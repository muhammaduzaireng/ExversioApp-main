import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles';

const VerificationScreen = ({ route }) => {
  const BASE_URL = "http://localhost:3000"; // Replace 3000 with your server's port

  const [otp, setOtp] = useState('');
  const navigation = useNavigation();
  

  // Assuming the userId is passed via navigation params from the signup process
  const { userId } = route.params || { userId: null };  // Ensure userId is passed through the route
  console.log("Received userId:", userId); // Add this to see if userId is received

  const handleVerifyOtp = () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP sent to your email.');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please try again.');
      return;
    }

    console.log('Sending OTP verification request:', userId, otp);

    fetch(`${BASE_URL}/verifyOTP`, {  // Make sure this URL points to your server (use your actual IP if on device)
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: userId, otp: otp }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('API Response:', data);

      if (data.success) {
        Alert.alert('Success', 'OTP verified successfully.');
        navigation.navigate('DashboardScreen'); // Adjust navigation to the appropriate screen
      } else {
        Alert.alert('Verification Failed', data.message || 'Invalid OTP, please try again.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      Alert.alert('Error', 'Unable to verify OTP at the moment. Please try again later.');
    });
  };

  return (
    <View style={commonStyles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={commonStyles.backButtonContainer}>
        <Image source={require('../assets/icons/211686_back_arrow_icon.png')} style={commonStyles.backIcon} />
      </TouchableOpacity>
      <View style={commonStyles.logoContainer}>
        <Image source={require('../assets/logo/logo_white.png')} style={commonStyles.logo} />
        <Text style={commonStyles.title}>Verification</Text>
      </View>
      <View style={commonStyles.formContainer}>
        <View style={commonStyles.inputContainer}>
          <TextInput
            style={commonStyles.input}
            placeholder="Enter OTP"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={otp}
            onChangeText={setOtp}
          />
        </View>

        <TouchableOpacity style={commonStyles.button} onPress={handleVerifyOtp}>
          <Text style={commonStyles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VerificationScreen;
