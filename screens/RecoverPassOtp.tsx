import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles'; // Ensure this import path is correct

type RecoverPassOtpNavigationProp = StackNavigationProp<any, 'RecoverPassOtp'>;

const RecoverPassOtp = () => {
  const navigation = useNavigation<RecoverPassOtpNavigationProp>();
  const BASE_URL = "http://localhost:3000"; // Replace 3000 with your server's port

  const route = useRoute();
  const { userId } = route.params || {}; // Get the userId passed from the RecoverPasswordScreen

  const [otp, setOtp] = useState('');

  const handleVerifyOtp = () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP sent to your email');
      return;
    }
  
    // Send OTP for verification to the server
    fetch(`${BASE_URL}/verifyOTP`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, otp }),
    })
    .then(async (response) => {
      try {
        // Check if the response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error('Non-JSON response received:', await response.text());
          throw new Error('Received non-JSON response');
        }
  
        // If JSON, proceed to parse
        const data = await response.json();
        if (data.success) {
          Alert.alert('Success', 'OTP verified successfully');
          navigation.navigate('CreateNewPass', { userId });
        } else {
          Alert.alert('Error', data.message || 'Invalid OTP');
        }
      } catch (error) {
        console.error('Error parsing response:', error);
        Alert.alert('Error', 'An error occurred while verifying OTP. Please try again later.');
      }
    })
    .catch(error => {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', 'An error occurred while verifying OTP. Please try again later.');
    });
  };
  

  return (
    <View style={commonStyles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={commonStyles.backButtonContainer}>
        <Image source={require('../assets/icons/211686_back_arrow_icon.png')} style={commonStyles.backIcon} />
      </TouchableOpacity>
      <View style={commonStyles.logoContainer}>
        <Image source={require('../assets/logo/logo_white.png')} style={commonStyles.logo} />
        <Text style={commonStyles.title}>Recover Password</Text>
      </View>
      <View style={commonStyles.formContainer}>
        <View style={commonStyles.inputContainer}>
          <TextInput
            style={commonStyles.input}
            placeholder="Enter OTP"
            placeholderTextColor={commonStyles.placeholderTextColor}
            value={otp}
            onChangeText={setOtp} // Capture OTP input
          />
        </View>
        <TouchableOpacity style={commonStyles.button} onPress={handleVerifyOtp}>
          <Text style={commonStyles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RecoverPassOtp;
