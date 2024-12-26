import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import paymentStyles from '../../../styles/paymentStyles'; // Ensure the styles path is correct
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  initPaymentSheet,
  presentPaymentSheet,
  isApplePaySupported,
  presentApplePay,
} from '@stripe/stripe-react-native';

type PaymentScreenNavigationProp = StackNavigationProp<any, 'PaymentScreen'>;

const PaymentScreen = () => {
  const navigation = useNavigation<PaymentScreenNavigationProp>();
  const BASE_URL = "http://145.223.100.9:3000"; // Replace with your server's address and port

  const [checkoutUrl, setCheckoutUrl] = useState(''); // URL for WebView (Stripe or Apple Pay)
  const [showWebView, setShowWebView] = useState(false);
  const [isApplePayAvailable, setIsApplePayAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkApplePaySupport();
    initializePaymentSheet();
  }, []);

  const checkApplePaySupport = async () => {
    try {
      const isSupported = await isApplePaySupported();
      setIsApplePayAvailable(isSupported);
      console.log('isApplePaySupported:', isSupported);
    } catch (error) {
      console.error('Error checking Apple Pay support:', error);
    }
  };

  const fetchPaymentSheetParams = async () => {
    try {
      const response = await fetch(`${BASE_URL}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 1000 }), // Amount in cents
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment sheet params');
      }

      const { paymentIntent, ephemeralKey, customer } = await response.json();
      return { paymentIntent, ephemeralKey, customer };
    } catch (error) {
      console.error('Error fetching payment sheet params:', error);
      Alert.alert('Error', 'Failed to fetch payment sheet params');
      return null;
    }
  };

  const initializePaymentSheet = async () => {
    const params = await fetchPaymentSheetParams();
    if (!params) return;

    const { paymentIntent, ephemeralKey, customer } = params;

    const { error } = await initPaymentSheet({
      merchantDisplayName: 'Your Business Name',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane Doe',
      },
      applePay: {
        merchantCountryCode: 'US', // Your merchant's country code
      },
    });

    if (!error) {
      setLoading(true);
      console.log('Payment sheet initialized successfully');
    } else {
      console.error('Error initializing payment sheet:', error);
      Alert.alert('Error', 'Failed to initialize payment sheet');
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      console.error('Error presenting payment sheet:', error);
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your payment was successful!');
    }
  };

  const handleStripePayment = async () => {
    try {
      const response = await fetch(`${BASE_URL}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 1000 }), // Amount in cents
      });

      const data = await response.json();
      if (data.url) {
        setCheckoutUrl(data.url);
        setShowWebView(true); // Open WebView for Stripe Checkout
      } else {
        Alert.alert('Error', 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      Alert.alert('Error', 'Failed to initiate payment');
    }
  };

  const handleApplePayPayment = async () => {
    if (!isApplePayAvailable) {
      Alert.alert('Error', 'Apple Pay is not available on this device.');
      return;
    }

    try {
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'Your Business Name',
        merchantCountryCode: 'US',
        paymentIntentClientSecret: 'CLIENT_SECRET_FROM_BACKEND', // Replace with actual clientSecret
        applePay: { merchantCountryCode: 'US' },
      });

      if (initError) {
        console.error('Apple Pay Initialization Error:', initError);
        Alert.alert('Error', 'Failed to initialize Apple Pay.');
        return;
      }

      const { error: presentError } = await presentApplePay({
        cartItems: [{ label: 'Your Product Name', amount: '10.00' }],
        country: 'US',
        currency: 'USD',
      });

      if (presentError) {
        console.error('Apple Pay Error:', presentError);
        Alert.alert('Payment Failed', presentError.message);
      } else {
        Alert.alert('Payment Success', 'Your payment was successfully processed!');
      }
    } catch (error) {
      console.error('Error with Apple Pay Payment:', error);
      Alert.alert('Error', 'Failed to process payment with Apple Pay.');
    }
  };

  return (
    <View style={paymentStyles.container}>
      {showWebView ? (
        <WebView
          source={{ uri: checkoutUrl }}
          onNavigationStateChange={(navState) => {
            if (navState.url.includes('yourapp://success')) {
              Alert.alert('Payment Successful', 'Your payment was successful.');
              setShowWebView(false);
            } else if (navState.url.includes('yourapp://cancel')) {
              Alert.alert('Payment Canceled', 'You canceled the payment.');
              setShowWebView(false);
            }
          }}
          style={{ flex: 1 }}
        />
      ) : (
        <>
          <Text style={paymentStyles.title}>Payment Options</Text>
          <TouchableOpacity style={paymentStyles.addButton} onPress={handleStripePayment}>
            <Text style={paymentStyles.addButtonText}>Pay with Stripe</Text>
          </TouchableOpacity>
          <TouchableOpacity style={paymentStyles.addButton} onPress={handleApplePayPayment}>
            <Text style={paymentStyles.addButtonText}>Pay with Apple Pay</Text>
          </TouchableOpacity>
          <TouchableOpacity style={paymentStyles.addButton} onPress={openPaymentSheet} disabled={!loading}>
            <Text style={paymentStyles.addButtonText}>Pay with Payment Sheet</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default PaymentScreen;
