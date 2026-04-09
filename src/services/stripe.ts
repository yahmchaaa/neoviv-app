import { StripeProvider, initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';

const stripePromise = async () => {
  // In a real app, you'd fetch the payment sheet configuration from your backend
  // which would create a PaymentIntent and return the client secret
  return {
    merchantDisplayName: 'NEOVIV',
    customerId: '',
    customerEphemeralKeySecret: '',
    paymentIntentClientSecret: '',
    publishesableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  };
};

export const initializePaymentSheet = async () => {
  const config = await stripePromise();
  
  const { error } = await initPaymentSheet({
    merchantDisplayName: config.merchantDisplayName,
    customerId: config.customerId,
    customerEphemeralKeySecret: config.customerEphemeralKeySecret,
    paymentIntentClientSecret: config.paymentIntentClientSecret,
    allowsDelayedPaymentMethods: true,
  });

  return { error };
};

export const openPaymentSheet = async (): Promise<{ success: boolean; error: string | null }> => {
  const { error } = await presentPaymentSheet();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
};
