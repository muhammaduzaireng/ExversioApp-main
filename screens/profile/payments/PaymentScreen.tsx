import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import paymentStyles from '../../../styles/paymentStyles'; // Ensure the styles path is correct
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
type PaymentScreenNavigationProp = StackNavigationProp<any, 'PaymentScreen'>;
const PaymentScreen = () => {
    const navigation = useNavigation<PaymentScreenNavigationProp>();
  const BASE_URL = "http://localhost:3000"; // Replace 3000 with your server's port

  const [checkoutUrl, setCheckoutUrl] = useState('');  // URL for Stripe Checkout
  const [showWebView, setShowWebView] = useState(false);

  const handlePayment = async () => {
    try {
      // Fetch the checkout session URL from your backend
      const response = await fetch(`${BASE_URL}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 1000 }), // Amount in cents (1000 = $10.00)
      });

      const data = await response.json();
      if (data.url) {
        setCheckoutUrl(data.url);
        setShowWebView(true);  // Show the WebView with Stripe Checkout
      } else {
        Alert.alert('Error', 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      Alert.alert('Error', 'Failed to initiate payment');
    }
  };

  return (
    <View style={paymentStyles.container}>
      {showWebView ? (
        <WebView
          source={{ uri: checkoutUrl }} // Open Stripe's Checkout URL
          onNavigationStateChange={(navState) => {
            if (navState.url.includes('yourapp://success')) {
              // Handle payment success
              Alert.alert('Payment Successful', 'Your payment was successful.');
              setShowWebView(false);  // Close WebView
            } else if (navState.url.includes('yourapp://cancel')) {
              // Handle payment cancellation
              Alert.alert('Payment Canceled', 'You canceled the payment.');
              setShowWebView(false);  // Close WebView
            }
          }}
          style={{ flex: 1 }}
        />
      ) : (
        <>
          <Text style={paymentStyles.title}>Stripe Payment</Text>
          <TouchableOpacity style={paymentStyles.addButton} onPress={handlePayment}>
            <Text style={paymentStyles.addButtonText}>Pay Now</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ApplePayScreen')}>
            Apple Pay
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default PaymentScreen;
