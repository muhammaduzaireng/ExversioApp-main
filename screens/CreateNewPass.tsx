import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles'; // Ensure this import path is correct

type CreateNewPassNavigationProp = StackNavigationProp<any, 'CreateNewPass'>;

const CreateNewPass = () => {
  const navigation = useNavigation<CreateNewPassNavigationProp>();
  const route = useRoute();
  const { userId } = route.params || {}; // Get the userId passed from the RecoverPassOtp screen
  const BASE_URL = "https://api.exversio.com"; // Replace 3000 with your server's port


  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleCreateNewPassword = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Send the new password to the server for updating
    fetch(`${BASE_URL}/update-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, newPassword }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Password updated successfully, navigate to login or verification screen
        Alert.alert('Success', 'Password updated successfully');
        navigation.navigate('Login'); // Navigate back to login or other appropriate screen
      } else {
        Alert.alert('Error', data.message || 'Failed to update password');
      }
    })
    .catch(error => {
      console.error('Error updating password:', error);
      Alert.alert('Error', 'An error occurred while updating password. Please try again later.');
    });
  };

  return (
    <View style={commonStyles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={commonStyles.backButtonContainer}>
        <Image source={require('../assets/icons/211686_back_arrow_icon.png')} style={commonStyles.backIcon} />
      </TouchableOpacity>
      <View style={commonStyles.logoContainer}>
        <Image source={require('../assets/logo/logo_white.png')} style={commonStyles.logo} />
        <Text style={commonStyles.title}>Create New Password</Text>
      </View>
      <View style={commonStyles.formContainer}>
        <View style={commonStyles.inputContainer}>
          <TextInput
            style={commonStyles.input}
            placeholder="Create new Password"
            secureTextEntry
            placeholderTextColor={commonStyles.placeholderTextColor}
            value={newPassword}
            onChangeText={setNewPassword}
          />
        </View>
        <View style={commonStyles.inputContainer}>
          <TextInput
            style={commonStyles.input}
            placeholder="Confirm Password"
            secureTextEntry
            placeholderTextColor={commonStyles.placeholderTextColor}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
        <TouchableOpacity style={commonStyles.button} onPress={handleCreateNewPassword}>
          <Text style={commonStyles.buttonText}>Create New Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateNewPass;
