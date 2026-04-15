import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';
import { StripePayment } from './src/components/StripePayment';

// Ensure you set these environment variables in your .env file
const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

export default function App() {
  if (!STRIPE_PUBLISHABLE_KEY) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>
          EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing.
          Please add it to your .env file.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <StripeProvider
      publishableKey={STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier="merchant.com.neoviv"
      urlScheme="neoviv"
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>NEOVIV</Text>
        <Text style={styles.subtitle}>Secure Payment Demo</Text>
        <View style={styles.paymentSection}>
          <StripePayment
            amount={19.99}
            buttonText="Subscribe for $19.99/month"
            onSuccess={(paymentIntentId) => {
              console.log('Payment succeeded:', paymentIntentId);
              // Handle successful payment (e.g., update user subscription)
            }}
            onError={(error) => {
              console.error('Payment error:', error);
            }}
          />
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  paymentSection: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  error: {
    color: '#d00',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});