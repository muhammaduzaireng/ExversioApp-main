import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import {
  initPaymentSheet,
  presentPaymentSheet,
  isApplePaySupported,
  confirmApplePayPayment,
} from '@stripe/stripe-react-native';

const ApplePayScreen = () => {
  const [isApplePayAvailable, setIsApplePayAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkApplePaySupport();
  }, []);

  // Check if Apple Pay is supported on the device
  const checkApplePaySupport = async () => {
    const isSupported = await isApplePaySupported();
    setIsApplePayAvailable(isSupported);
  };

  const initializeStripe = async () => {
    try {
      setLoading(true);
  
      // Initialize the Payment Sheet with Apple Pay configuration
      const { error } = await initPaymentSheet({
        merchantDisplayName: 'Exversio', // Your app or business name
        merchantCountryCode: 'US', // Two-letter ISO country code (e.g., 'US', 'PK')
        applePay: {
          paymentSummaryItems: [
            {
              label: 'Exversio', // Display label in Apple Pay
              amount: '10.00', // Payment amount
            },
          ],
        },
        testEnv: true, // Use sandbox for testing
      });
  
      if (error) {
        console.error('Stripe Initialization Error:', error);
        Alert.alert('Initialization Failed', error.localizedMessage || 'An error occurred.');
      } else {
        Alert.alert('Stripe Initialized', 'You can now use Apple Pay.');
      }
    } catch (error) {
      console.error('Stripe Initialization Error:', error);
      Alert.alert('Initialization Failed', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };
  
  
  

  const handleApplePay = async () => {
    if (!isApplePayAvailable) {
      Alert.alert('Error', 'Apple Pay is not available on this device.');
      return;
    }

    try {
      setLoading(true);
      const { error, paymentIntent } = await presentPaymentSheet();

      if (error) {
        console.error('Apple Pay Error:', error);
        Alert.alert('Payment Failed', 'Something went wrong while processing payment.');
      } else {
        // Confirm Apple Pay Payment
        const confirmError = await confirmApplePayPayment(paymentIntent);

        if (confirmError) {
          console.error('Payment Confirmation Error:', confirmError);
          Alert.alert('Payment Failed', 'Something went wrong during payment confirmation.');
        } else {
          Alert.alert('Payment Success', 'Your payment was successfully processed!');
        }
      }
    } catch (error) {
      console.error('Apple Pay Error:', error);
      Alert.alert('Payment Failed', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Exversio App</Text>
      <Text style={styles.description}>
        Click the button below to test Apple Pay integration:
      </Text>
      <Button title="Initialize Apple Pay" onPress={initializeStripe} disabled={loading} />
      <Button
        title="Pay with Apple Pay"
        onPress={handleApplePay}
        disabled={!isApplePayAvailable || loading}
      />
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

export default ApplePayScreen;
