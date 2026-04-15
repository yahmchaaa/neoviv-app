import React, { useState } from 'react';
import { Button, Alert, ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { completePayment } from '../services/stripe';

interface StripePaymentProps {
  amount: number;
  currency?: string;
  buttonText?: string;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
}

/**
 * A ready‑to‑use Stripe payment button for NEOVIV.
 * Requires StripeProvider to be set up at the root of your app.
 */
export const StripePayment: React.FC<StripePaymentProps> = ({
  amount,
  currency = 'usd',
  buttonText = `Pay $${amount.toFixed(2)}`,
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const { success, error } = await completePayment(amount, currency);
      if (success) {
        Alert.alert('Success', 'Payment completed successfully!');
        // In a real app you would capture the payment intent ID from the service
        // and pass it to onSuccess. For simplicity we just call the callback.
        onSuccess?.('payment_intent_id');
      } else {
        Alert.alert('Payment Failed', error || 'Unknown error');
        onError?.(error || 'Unknown error');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
      onError?.(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title={buttonText} onPress={handlePayment} disabled={loading} />
      )}
      <Text style={styles.note}>
        Secure payment powered by Stripe.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  note: {
    marginTop: 12,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});