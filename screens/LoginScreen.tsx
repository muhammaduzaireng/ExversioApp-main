import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles';

type LoginScreenNavigationProp = StackNavigationProp<any, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const BASE_URL = "http://localhost:3000"; // Replace 3000 with your server's port

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }
  
    // Send the username and password to the server for verification
    fetch(`${BASE_URL}/login`, {
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
  
            // Check if artistId exists in the response
            if (data.artistId) {
              // Save artistId to AsyncStorage for artists
              await AsyncStorage.setItem('artistId', data.artistId.toString());
              console.log('Artist login successful, artistId saved:', data.artistId);
  
              // Navigate to ArtistPostScreen
              navigation.navigate('ArtistPostScreen', { artistId: data.artistId });
            } else {
              // Navigate to DashboardScreen for non-artists
              navigation.navigate('DashboardScreen', { userId: data.userId });
            }
          } catch (error) {
            console.error('Failed to save data to AsyncStorage:', error);
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
            onChangeText={setUsername}
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
            onChangeText={setPassword}
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

        <View style={commonStyles.iconContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('GoogleLogin')}>
            <Image source={require('../assets/icons/google-icon.png')} style={commonStyles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('AppleLogin')}>
            <Image source={require('../assets/icons/apple-seeklogo.png')} style={commonStyles.icon} />
          </TouchableOpacity>
        </View>

        <Text onPress={() => navigation.navigate('Signup')} style={commonStyles.un_text}>
          Don't have Account
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;
