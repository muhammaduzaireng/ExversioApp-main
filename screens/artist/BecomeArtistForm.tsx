import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import formStyles from '../../styles/artist/formStyle'; // Ensure this path is correct
import AsyncStorage from '@react-native-async-storage/async-storage';

const BecomeArtistForm = () => {
  const BASE_URL = "http://192.168.10.3:3000"; // Replace 3000 with your server's port

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [trackStack, setTrackStack] = useState('');
  const [bio, setBio] = useState('');
  const [subscriptionPrice, setSubscriptionPrice] = useState('');


  const handleSubmit = async () => {
    if (!name || !email || !country || !trackStack || !bio || !subscriptionPrice) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }
  
    try {
      // Retrieve userId from AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      
      if (!userId) {
        Alert.alert('Error', 'User not logged in');
        return;
      }
  
      // Prepare form data with userId
      const formData = {
        name,
        email,
        country,
        trackStack,
        bio,
        subscriptionPrice,
        user_id: userId, // Include userId in the form data
      };
  
      // Send the form data to the server for submission
      fetch(`${BASE_URL}/become-artist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      .then(response => response.json())
      .then((data) => {
        if (data.success) {
          Alert.alert('Success', 'Your request to become an artist has been submitted');
        } else {
          Alert.alert('Error', data.message || 'Failed to submit the request');
        }
      })
      .catch(error => {
        console.error('Submission error:', error);
        Alert.alert('Error', 'An error occurred during submission. Please try again later.');
      });
    } catch (error) {
      console.error('Error retrieving userId from AsyncStorage:', error);
      Alert.alert('Error', 'Failed to retrieve user information.');
    }
  };
  
  return (
    <ScrollView contentContainerStyle={formStyles.container}>
      <Text style={formStyles.title}>Request to Become an Artist</Text>

      <TextInput
        style={formStyles.input}
        placeholder="Name"
        placeholderTextColor="#ffffff" // Set the placeholder color
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={formStyles.input}
        placeholder="Email"
        placeholderTextColor="#ffffff" // Set the placeholder color
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={formStyles.input}
        placeholder="Country"
        placeholderTextColor="#ffffff" // Set the placeholder color
        value={country}
        onChangeText={setCountry}
      />

      <TextInput
        style={formStyles.input}
        placeholder="Track Stack"
        placeholderTextColor="#ffffff" // Set the placeholder color
        value={trackStack}
        onChangeText={setTrackStack}
      />

      <TextInput
        style={formStyles.input}
        placeholder="Bio"
        placeholderTextColor="#ffffff" // Set the placeholder color
        value={bio}
        onChangeText={setBio}
        multiline
      />

      <TextInput
        style={formStyles.input}
        placeholder="Subscription Price/Month"
        placeholderTextColor="#ffffff" // Set the placeholder color
        value={subscriptionPrice}
        onChangeText={setSubscriptionPrice}
        keyboardType="numeric"
      />

      <TouchableOpacity style={formStyles.button} onPress={handleSubmit}>
        <Text style={formStyles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BecomeArtistForm;
