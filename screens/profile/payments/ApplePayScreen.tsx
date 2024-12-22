import React, { useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import {
  initPaymentSheet,
  presentPaymentSheet,
  isApplePaySupported,
  createApplePayPaymentMethod,
} from '@stripe/stripe-react-native';

const App = () => {
  useEffect(() => {
    // Initialize Stripe when the app loads
    initializeStripe();
  }, []);

  const initializeStripe = async () => {
    const STRIPE_PUBLISHABLE_KEY = '<YOUR_STRIPE_PUBLISHABLE_KEY>'; // Replace with your Stripe publishable key
    const STRIPE_MERCHANT_IDENTIFIER = '<YOUR_MERCHANT_ID>'; // Replace with your Apple Pay Merchant ID

    await isApplePaySupported(); // Ensures Apple Pay is available on the device

    try {
      await initPaymentSheet({
        merchantDisplayName: 'Exversio',
        merchantCountryCode: 'US', // Your country code
        applePay: {
          merchantCountryCode: 'US',
          paymentSummaryItems: [
            {
              label: 'Exversio',
              amount: '10.00', // Amount to charge
            },
          ],
        },
        testEnv: true, // Use true for sandbox mode
      });
    } catch (error) {
      console.error('Stripe Initialization Error:', error);
    }
  };

  const handleApplePay = async () => {
    try {
      // Create Apple Pay payment method
      const { paymentMethod } = await createApplePayPaymentMethod({
        applePay: {
          merchantCountryCode: 'US',
          paymentSummaryItems: [
            {
              label: 'Exversio',
              amount: '10.00',
            },
          ],
        },
      });

      console.log('Apple Pay Payment Method:', paymentMethod);

      Alert.alert('Payment Success', 'Your payment was successfully processed!');
    } catch (error) {
      console.error('Apple Pay Error:', error);
      Alert.alert('Payment Failed', 'Something went wrong while processing the payment.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Exversio App</Text>
      <Text style={styles.description}>
        Test Apple Pay integration by clicking the button below:
      </Text>
      <Button title="Pay with Apple Pay" onPress={handleApplePay} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  description: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
  },
});

export default App;
