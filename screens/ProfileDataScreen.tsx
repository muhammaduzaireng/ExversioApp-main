import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles'; // Ensure this import path is correct

type ProfileDataScreenNavigationProp = StackNavigationProp<any, 'ProfileDataScreen'>;

const ProfileDataScreen = () => {
  const navigation = useNavigation<ProfileDataScreenNavigationProp>();
  const BASE_URL = "http://localhost:3000"; // Replace 3000 with your server's port

  const route = useRoute();
  const { mobileNumber } = route.params || {};

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const country = mobileNumber ? mobileNumber.substring(0, 3) : ''; // Extract country code from mobile number

  const handleSubmitProfile = () => {
    if (!name || !username || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    // Submit profile details to the server
    fetch(`${BASE_URL}/updateProfile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, username, password, country, mobileNumber }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          Alert.alert('Success', 'Profile data saved');
          navigation.navigate('Login'); // Navigate to login after saving profile data
        } else {
          Alert.alert('Error', 'Failed to save profile data');
        }
      })
      .catch(error => {
        console.error('Error saving profile data:', error);
        Alert.alert('Error', 'Failed to save profile data');
      });
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Complete Profile</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={commonStyles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={commonStyles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={commonStyles.input}
        placeholder="Country"
        value={country}
        editable={false} // Country auto-filled from mobile number
      />
      <TouchableOpacity style={commonStyles.button} onPress={handleSubmitProfile}>
        <Text style={commonStyles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileDataScreen;
