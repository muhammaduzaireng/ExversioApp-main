import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles';
import auth from '@react-native-firebase/auth';

const OtpVerificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { confirmResult, mobileNumber } = route.params || {};
  const [otp, setOtp] = useState('');

  const handleVerifyOtp = () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    // Verify the OTP using Firebase
    confirmResult
      .confirm(otp)
      .then(user => {
        Alert.alert('Success', 'OTP verified');
        navigation.navigate('ProfileDataScreen', { mobileNumber });
      })
      .catch(error => {
        console.error('Error verifying OTP:', error);
        Alert.alert('Error', 'Invalid OTP');
      });
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Enter OTP</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
      />
      <TouchableOpacity style={commonStyles.button} onPress={handleVerifyOtp}>
        <Text style={commonStyles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OtpVerificationScreen;
