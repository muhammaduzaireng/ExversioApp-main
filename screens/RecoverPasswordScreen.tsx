import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles'; // Ensure this import path is correct

type RecoverPasswordScreenNavigationProp = StackNavigationProp<any, 'RecoverPassword'>;

const RecoverPasswordScreen = () => {
  const navigation = useNavigation<RecoverPasswordScreenNavigationProp>();
  const BASE_URL = "http://192.168.10.3:3000"; // Replace 3000 with your server's port

  
  const [usernameOrEmail, setUsernameOrEmail] = useState(''); // State to store the username or email input

  const handleRecoverPassword = () => {
    if (!usernameOrEmail) {
      Alert.alert('Error', 'Please enter your username or email');
      return;
    }

    // Send the username/email to the server to request an OTP
    fetch(`${BASE_URL}/recover-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usernameOrEmail }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // OTP sent, navigate to OTP verification screen
        Alert.alert('Success', 'OTP sent to your registered email');
        navigation.navigate('RecoverPassOtp', { userId: data.userId }); // Pass the userId to the OTP screen
      } else {
        // Show an error message if no account was found or OTP could not be sent
        Alert.alert('Error', data.message || 'Failed to send OTP');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred. Please try again later.');
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
            placeholder="Username/Email"
            placeholderTextColor={commonStyles.placeholderTextColor}
            value={usernameOrEmail}
            onChangeText={setUsernameOrEmail} // Capture the input
          />
        </View>

        <TouchableOpacity style={commonStyles.button} onPress={handleRecoverPassword}>
          <Text style={commonStyles.buttonText}>Recover Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RecoverPasswordScreen;
