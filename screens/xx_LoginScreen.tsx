import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles'; // Ensure this import path is correct

type LoginScreenNavigationProp = StackNavigationProp<any, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  // State for username and password input fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle login
  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    // Send the username and password to the server for verification
    fetch('http://10.0.2.2:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(async (data) => {
      if (data.success) {
        // Login successful, save userId to AsyncStorage
        try {
          await AsyncStorage.setItem('userId', data.userId.toString());
          console.log('Login successful, userId saved:', data.userId);

          // Navigate to the dashboard and pass the userId
          navigation.navigate('DashboardScreen', { userId: data.userId });
        } catch (error) {
          console.error('Failed to save userId to AsyncStorage:', error);
        }
        
      } else {
        // Show an error message if login failed
        Alert.alert('Login Failed', data.message || 'Invalid username or password');
      }
    })
    .catch(error => {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred during login. Please try again later.');
    });
  };

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.logoContainer}>
        <Image source={require('../assets/logo/logo_white.png')} style={commonStyles.logo} />
        <Text style={commonStyles.title}>Login</Text>
      </View>
      <View style={commonStyles.formContainer}>
        <View style={commonStyles.inputContainer}>
          <Image source={require('../assets/icons/8665305_envelope_email_icon.png')} style={commonStyles.inputIcon} />
          <TextInput
            style={commonStyles.input}
            placeholder="Username"
            placeholderTextColor={commonStyles.placeholderTextColor}
            value={username}
            onChangeText={setUsername} // Capturing the username input
          />
        </View>
        <View style={commonStyles.inputContainer}>
          <Image source={require('../assets/icons/211855_locked_icon.png')} style={commonStyles.inputIcon} />
          <TextInput
            style={[commonStyles.input, commonStyles.passwordInput]}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor={commonStyles.placeholderTextColor}
            value={password}
            onChangeText={setPassword} // Capturing the password input
          />
        </View>

        <Text onPress={() => navigation.navigate('RecoverPassword')} style={commonStyles.un_text_rcvr}>
          Recover Password
        </Text>

        <TouchableOpacity style={commonStyles.button} onPress={handleLogin}>
          <Text style={commonStyles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={commonStyles.separatorContainer}>
          <View style={commonStyles.separatorLine} />
          <Text style={commonStyles.separatorText}>OR</Text>
          <View style={commonStyles.separatorLine} />
        </View>

        <TouchableOpacity style={commonStyles.button} onPress={() => navigation.navigate('MobileNumberScreen')}>
          <Text style={commonStyles.buttonText}>Login with Mobile Number</Text>
        </TouchableOpacity>

        <Text onPress={() => navigation.navigate('Signup')} style={commonStyles.un_text}>
          Don't have Account
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;
