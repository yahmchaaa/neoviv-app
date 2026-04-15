import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import { supabase } from '../lib/supabase';

const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

if (!STRIPE_PUBLISHABLE_KEY) {
  console.warn('EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. Stripe will not work.');
}

/**
 * Calls the Supabase Edge Function via the available client.
 * Falls back to direct fetch if supabase.functions.invoke is not available.
 */
const callEdgeFunction = async (functionName: string, body: any) => {
  // Try supabase.functions.invoke first (works with supabase-js v2+)
  if (supabase?.functions?.invoke) {
    const { data, error } = await supabase.functions.invoke(functionName, { body });
    if (error) throw error;
    return data;
  }

  // Fallback: direct HTTP call
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase URL or Anon Key in environment variables.');
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Edge function error (${response.status}): ${text}`);
  }

  return await response.json();
};

/**
 * Fetches a PaymentIntent client secret from the Supabase Edge Function.
 * @param amount Amount in dollars (e.g., 10.00)
 * @param currency Currency code (default: 'usd')
 * @returns PaymentIntent client secret and ID
 */
export const fetchPaymentIntent = async (
  amount: number,
  currency: string = 'usd'
): Promise<{ clientSecret: string; id: string }> => {
  try {
    const data = await callEdgeFunction('create-payment-intent', { amount, currency });

    if (!data?.clientSecret || !data?.id) {
      console.error('Invalid response from edge function:', data);
      throw new Error('Invalid response from payment endpoint');
    }

    return { clientSecret: data.clientSecret, id: data.id };
  } catch (err: any) {
    console.error('fetchPaymentIntent error:', err);
    throw new Error(`Payment intent creation failed: ${err.message}`);
  }
};

/**
 * Initializes the Stripe payment sheet with a given amount.
 * Call this before opening the sheet.
 */
export const initializePaymentSheet = async (
  amount: number,
  currency: string = 'usd'
): Promise<{ error: string | null }> => {
  try {
    // 1. Get client secret from our edge function
    const { clientSecret } = await fetchPaymentIntent(amount, currency);

    // 2. Initialize the payment sheet
    const { error } = await initPaymentSheet({
      merchantDisplayName: 'NEOVIV',
      paymentIntentClientSecret: clientSecret,
      allowsDelayedPaymentMethods: true,
      // If you have customer/ephemeral key for saved cards, add here:
      // customerId: '...',
      // customerEphemeralKeySecret: '...',
    });

    return { error: error ? error.message : null };
  } catch (err: any) {
    return { error: err.message };
  }
};

/**
 * Opens the previously initialized payment sheet.
 * Returns success status and any error.
 */
export const openPaymentSheet = async (): Promise<{
  success: boolean;
  error: string | null;
}> => {
  const { error } = await presentPaymentSheet();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
};

/**
 * Complete payment flow: initialize + open.
 * Use this for a simple one‑step payment.
 */
export const completePayment = async (
  amount: number,
  currency: string = 'usd'
): Promise<{ success: boolean; error: string | null }> => {
  const init = await initializePaymentSheet(amount, currency);
  if (init.error) {
    return { success: false, error: init.error };
  }

  return await openPaymentSheet();
};