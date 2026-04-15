import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2024-12-18.acacia",
});

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const ALLOWED_ORIGINS = [
  "https://neo-wellness-hub.lovable.app",
  "https://neoviv.life",
  "https://www.neoviv.life",
];

function getCorsOrigin(origin: string | null): string {
  if (!origin) return ALLOWED_ORIGINS[0];
  return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
}

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGINS.join(" "),
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  const origin = req.headers.get("origin");
  const responseCorsHeaders = {
    ...corsHeaders,
    "Access-Control-Allow-Origin": getCorsOrigin(origin),
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: responseCorsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...responseCorsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response(
        JSON.stringify({ error: "Missing stripe-signature header" }),
        {
          status: 400,
          headers: { ...responseCorsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is not configured");
      return new Response(
        JSON.stringify({ error: "Webhook secret not configured" }),
        {
          status: 500,
          headers: { ...responseCorsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Read raw body for signature verification
    const rawBody = await req.text();

    let event: Stripe.Event;

    // Verify and construct the event
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        {
          status: 400,
          headers: { ...responseCorsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create Supabase client with service role key for admin access
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    console.log(`Processing Stripe event: ${event.type} (${event.id})`);

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);

        const userId = paymentIntent.metadata?.userId;
        const orderId = paymentIntent.metadata?.orderId;
        const dripName = paymentIntent.metadata?.dripName;

        if (!userId) {
          console.warn("PaymentIntent succeeded but no userId in metadata:", paymentIntent.id);
          break;
        }

        // Record payment in orders table (update stripe_payment_id and status)
        if (orderId) {
          const { error: updateError } = await supabaseAdmin
            .from("orders")
            .update({
              stripe_payment_id: paymentIntent.id,
              status: "confirmed",
            })
            .eq("id", orderId)
            .eq("user_id", userId);

          if (updateError) {
            console.error("Failed to update order:", updateError);
          } else {
            console.log(`Order ${orderId} updated with PaymentIntent ${paymentIntent.id}`);
          }
        }

        // Also insert into a payments audit table if it exists
        try {
          const { error: paymentError } = await supabaseAdmin
            .from("payments")
            .insert({
              stripe_payment_id: paymentIntent.id,
              user_id: userId,
              order_id: orderId || null,
              amount: paymentIntent.amount / 100, // convert from cents
              currency: paymentIntent.currency,
              status: "succeeded",
              drip_name: dripName || null,
              metadata: paymentIntent.metadata || {},
              paid_at: new Date().toISOString(),
            });

          if (paymentError) {
            // payments table might not exist yet — log but don't fail
            console.warn("Could not insert into payments table:", paymentError.message);
          } else {
            console.log(`Payment record created for PaymentIntent ${paymentIntent.id}`);
          }
        } catch (e) {
          console.warn("Payments table insert failed (table may not exist):", e);
        }

        // Create audit log entry
        try {
          await supabaseAdmin.rpc("create_audit_log", {
            p_user_id: userId,
            p_action: "payment_succeeded",
            p_table_name: "orders",
            p_record_id: orderId || null,
            p_new_data: {
              payment_intent_id: paymentIntent.id,
              amount: paymentIntent.amount / 100,
              currency: paymentIntent.currency,
              status: "confirmed",
            },
            p_ip_address: req.headers.get("x-forwarded-for") || null,
            p_user_agent: req.headers.get("user-agent") || null,
          });
        } catch (e) {
          // Audit log function may not exist yet — log but don't fail
          console.warn("Audit log creation failed (function may not exist):", e);
        }

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent failed: ${paymentIntent.id}`);

        const userId = paymentIntent.metadata?.userId;
        const orderId = paymentIntent.metadata?.orderId;

        if (orderId) {
          await supabaseAdmin
            .from("orders")
            .update({ status: "pending" })
            .eq("id", orderId)
            .eq("user_id", userId || "");
        }

        // Log failed payment
        if (userId) {
          try {
            await supabaseAdmin.rpc("create_audit_log", {
              p_user_id: userId,
              p_action: "payment_failed",
              p_table_name: "orders",
              p_record_id: orderId || null,
              p_new_data: {
                payment_intent_id: paymentIntent.id,
                error: paymentIntent.last_payment_error?.message || "Unknown error",
              },
            });
          } catch (e) {
            console.warn("Audit log creation failed:", e);
          }
        }

        break;
      }

      case "payment_intent.canceled": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent canceled: ${paymentIntent.id}`);

        const orderId = paymentIntent.metadata?.orderId;
        const userId = paymentIntent.metadata?.userId;

        if (orderId) {
          await supabaseAdmin
            .from("orders")
            .update({ status: "cancelled" })
            .eq("id", orderId)
            .eq("user_id", userId || "");
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true, eventId: event.id }),
      {
        status: 200,
        headers: { ...responseCorsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Webhook handler error:", error);

    return new Response(
      JSON.stringify({ error: "Webhook handler failed" }),
      {
        status: 500,
        headers: { ...responseCorsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
