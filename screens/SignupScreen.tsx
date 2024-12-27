import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import commonStyles from '../styles/commonStyles'; // Ensure this import path is correct

type SignupScreenNavigationProp = StackNavigationProp<any, 'Signup'>;

const SignupScreen = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const BASE_URL = "https://api.exversio.com"; // Replace 3000 with your server's port


  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');

  // Function to validate the form
  const validateForm = () => {
    if (!name || !email || !username || !password || !country) {
      Alert.alert('Error', 'All fields are required');
      return false;
    }
    return true;
  };

  // Handle signup button press
  const handleSignup = () => {
    if (!validateForm()) {
      return;
    }

    const userData = {
      name,
      email,
      username,
      password,
      country,
    };

    fetch(`${BASE_URL}/Signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then(async (data) => {
        console.log("API Response:", data);

        if (data.success) {
          console.log("Received userId:", data.userId);  // Log the received userId

          // Save userId to AsyncStorage
          try {
            await AsyncStorage.setItem('userId', data.userId.toString());
            console.log("UserId saved to AsyncStorage:", data.userId);

            // Navigate to the Verification screen, passing userId
            navigation.navigate('Verification', { userId: data.userId });
          } catch (error) {
            console.error('Error saving userId to AsyncStorage:', error);
          }
        } else {
          Alert.alert('Failed', data.message || 'Failed to send OTP');
        }
      })
      .catch((error) => {
        // Handle any errors during the API call
        console.error("Error:", error);
        Alert.alert('Error', 'An error occurred. Please try again.');
      });
  };

  return (
    <View style={commonStyles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={commonStyles.backButtonContainer}>
        <Image source={require('../assets/icons/211686_back_arrow_icon.png')} style={commonStyles.backIcon} />
      </TouchableOpacity>

      <View style={commonStyles.logoContainer}>
        <Image source={require('../assets/logo/logo_white.png')} style={commonStyles.logo} />
        <Text style={commonStyles.title}>Sign Up</Text>
      </View>

      <View style={commonStyles.formContainer}>
        <View style={commonStyles.inputContainer}>
          <Image source={require('../assets/icons/9044907_name_space_icon.png')} style={commonStyles.inputIcon} />
          <TextInput
            style={commonStyles.input}
            placeholder="Full Name"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={commonStyles.inputContainer}>
          <Image source={require('../assets/icons/8665305_envelope_email_icon.png')} style={commonStyles.inputIcon} />
          <TextInput
            style={commonStyles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={commonStyles.inputContainer}>
          <Image source={require('../assets/icons/211625_at_icon.png')} style={commonStyles.inputIcon} />
          <TextInput
            style={commonStyles.input}
            placeholder="Username"
            placeholderTextColor="#aaa"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={commonStyles.inputContainer}>
          <Image source={require('../assets/icons/211855_locked_icon.png')} style={commonStyles.inputIcon} />
          <TextInput
            style={[commonStyles.input, commonStyles.passwordInput]}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={commonStyles.inputContainer}>
          <Image source={require('../assets/icons/172473_globe_global_internet_icon.png')} style={commonStyles.inputIcon} />
          <TextInput
            style={commonStyles.input}
            placeholder="Country"
            placeholderTextColor="#aaa"
            value={country}
            onChangeText={setCountry}
          />
        </View>

        <TouchableOpacity style={commonStyles.button} onPress={handleSignup}>
          <Text style={commonStyles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={commonStyles.separatorContainer}>
          <View style={commonStyles.separatorLine} />
          <Text style={commonStyles.separatorText}>OR</Text>
          <View style={commonStyles.separatorLine} />
        </View>

        <Text onPress={() => navigation.navigate('Login')} style={commonStyles.un_text}>
          Already have an Account? Login
        </Text>
      </View>
    </View>
  );
};

export default SignupScreen;
