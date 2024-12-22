import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
// import auth from '@react-native-firebase/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles';

const MobileNumberScreen = () => {
  const navigation = useNavigation();
  const [mobileNumber, setMobileNumber] = useState('');

  const handleSendOtp = () => {
    if (!mobileNumber || !/^\+?[1-9]\d{1,14}$/.test(mobileNumber)) {
      Alert.alert('Error', 'Please enter a valid mobile number');
      return;
    }

    // Send OTP using Firebase
    // auth()
    //   .signInWithPhoneNumber(mobileNumber)
    //   .then(confirmResult => {
    //     // OTP sent, now navigate to OTP verification screen
    //     navigation.navigate('OtpVerificationScreen', { confirmResult, mobileNumber });
    //   })
    //   .catch(error => {
    //     console.error('Error sending OTP:', error);
    //     Alert.alert('Error', 'Failed to send OTP');
    //   });
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Enter Mobile Number</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="Enter mobile number with country code"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="phone-pad"
      />
      <TouchableOpacity style={commonStyles.button} onPress={handleSendOtp}>
        <Text style={commonStyles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MobileNumberScreen;
