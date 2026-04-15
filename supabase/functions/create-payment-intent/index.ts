import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2024-12-18.acacia",
});

const ALLOWED_ORIGINS = [
  "https://neo-wellness-hub.lovable.app",
  "https://neoviv.life",
  "https://www.neoviv.life",
];

// Valid drip prices from the database (in dollars)
// This prevents clients from submitting arbitrary amounts
const VALID_DRIP_PRICES: Record<string, number> = {
  "Myers' Cocktail": 249,
  "Immunity Boost": 199,
  "Hydration": 149,
  "Energy & Vitality": 179,
  "NAD+": 599,
  "Longevity & Anti-Aging": 449,
  "Recovery & Performance": 299,
  "Skin & Beauty": 199,
  "Weight Loss Support": 249,
  "Immunity Shield": 199,
  "Energy Revive": 179,
  "Detox Cleanse": 229,
  "Beauty Glow": 189,
};

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGINS.join(" "),
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function getCorsOrigin(origin: string | null): string {
  if (!origin) return ALLOWED_ORIGINS[0];
  if (ALLOWED_ORIGINS.includes(origin)) return origin;
  return ALLOWED_ORIGINS[0];
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const responseCorsHeaders = {
    ...corsHeaders,
    "Access-Control-Allow-Origin": getCorsOrigin(origin),
  };

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: responseCorsHeaders });
  }

  try {
    const { amount, dripName, currency = "usd", metadata = {} } = await req.json();

    // --- Amount validation ---
    if (amount === undefined || amount === null) {
      return new Response(
        JSON.stringify({ error: "Amount is required and must be a number" }),
        {
          status: 400,
          headers: { ...responseCorsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (typeof amount !== "number" || isNaN(amount)) {
      return new Response(
        JSON.stringify({ error: "Amount must be a valid number" }),
        {
          status: 400,
          headers: { ...responseCorsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate amount against known drip prices if dripName is provided
    if (dripName && typeof dripName === "string") {
      const expectedPrice = VALID_DRIP_PRICES[dripName];
      if (expectedPrice !== undefined) {
        // Allow small floating point tolerance (0.01)
        if (Math.abs(amount - expectedPrice) > 0.01) {
          return new Response(
            JSON.stringify({
              error: `Invalid amount for '${dripName}'. Expected ${expectedPrice}.`,
            }),
            {
              status: 400,
              headers: { ...responseCorsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }
    }

    // Global min/max bounds as safety net
    if (amount < 1) {
      return new Response(
        JSON.stringify({ error: "Minimum payment amount is $1.00" }),
        {
          status: 400,
          headers: { ...responseCorsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (amount > 10000) {
      return new Response(
        JSON.stringify({ error: "Maximum payment amount is $10,000.00" }),
        {
          status: 400,
          headers: { ...responseCorsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Build idempotency key from metadata to prevent duplicate payments
    const idempotencyKey = [
      metadata.userId || "unknown",
      metadata.orderId || "unknown",
      Date.now().toString(),
    ].join("-");

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: Math.round(amount * 100), // amount in cents
        currency,
        metadata: {
          ...metadata,
          dripName: dripName || "unknown",
        },
        automatic_payment_methods: {
          enabled: true,
        },
      },
      {
        idempotencyKey,
      }
    );

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
      }),
      {
        status: 200,
        headers: { ...responseCorsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // Log full error server-side, return generic message to client
    console.error("Stripe error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return new Response(
      JSON.stringify({ error: "Payment processing failed. Please try again." }),
      {
        status: 500,
        headers: { ...responseCorsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
