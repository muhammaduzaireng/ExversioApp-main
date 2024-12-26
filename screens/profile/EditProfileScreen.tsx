import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import commonStyles from '../../styles/commonStyles'; // Ensure this path is correct
import RNFS from 'react-native-fs';

type EditProfileScreenNavigationProp = StackNavigationProp<any, 'EditProfile'>;

const EditProfileScreen = () => {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  const BASE_URL = "https://api.exversio.com:3000"; // Replace with your server's base URL

  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // To store image details for server upload


  useEffect(() => {
    // Load current profile data when the screen is loaded
    const loadProfileData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        console.log('Loaded userId from AsyncStorage:', userId);
        if (userId) {
          const response = await fetch(`${BASE_URL}/getUserProfile?userId=${userId}`);
          const data = await response.json();
          console.log('Response from getUserProfile:', data);
  
          if (data.success) {
            setName(data.data.name);
            setCountry(data.data.country);
            setBio(data.data.bio);
  
            // Handle profile_picture safely
            const profilePictureUrl =
              data.data.profilePicture && data.data.profilePicture.startsWith('/')
                ? `${BASE_URL}${data.data.profilePicture}` // Construct full URL for relative paths
                : data.data.profilePicture || null; // Use the absolute URL or set to null if not available
  
            console.log('Resolved profile picture URL:', profilePictureUrl);
  
            setProfilePicture(profilePictureUrl);
          } else {
            Alert.alert('Error', 'Failed to load profile data');
          }
        } else {
          Alert.alert('Error', 'No user found. Please log in again.');
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
        Alert.alert('Error', 'Failed to load profile data');
      }
    };
  
    loadProfileData();
  }, []);
  
  
 const handleProfilePictureUpload = async () => {
  const result = await ImagePicker.launchImageLibrary({
    mediaType: 'photo',
  });

  if (!result.didCancel && result.assets && result.assets.length > 0) {
    const selectedImage = result.assets[0];
    console.log('Selected image:', selectedImage);

    setProfilePicture(selectedImage.uri); // Show image preview

    // Store the image file details for upload
    setSelectedImage({
      uri: selectedImage.uri,
      name: selectedImage.fileName || `profile_${Date.now()}.jpg`,
      type: selectedImage.type || 'image/jpeg',
    });
  }
};

const handleSaveProfile = async () => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      Alert.alert('Error', 'User ID is required');
      return;
    }

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('name', name.trim());
    formData.append('country', country);
    formData.append('bio', bio.trim());

    if (selectedImage) {
      formData.append('profilePicture', {
        uri: selectedImage.uri,
        name: selectedImage.name,
        type: selectedImage.type,
      });
    }

    const response = await fetch(`${BASE_URL}/updateProfile`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } else {
      Alert.alert('Error', data.message || 'Failed to update profile');
    }
  } catch (error) {
    console.error('Error saving profile:', error);
    Alert.alert('Error', 'Failed to save profile');
  }
};

  
  
  

  return (
    <View style={commonStyles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={commonStyles.backButtonContainer}
      >
        <Image
          source={require('../../assets/icons/211686_back_arrow_icon.png')}
          style={commonStyles.backIcon}
        />
      </TouchableOpacity>

      <View style={commonStyles.logoContainer}>
        <Text style={commonStyles.title}>Edit Profile</Text>
      </View>

      <View style={commonStyles.formContainer}>
        {/* Profile Picture Upload */}
        <TouchableOpacity onPress={handleProfilePictureUpload}>
          <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Image
  source={
    profilePicture
      ? { uri: profilePicture }
      : require('../../assets/profile/profile-image.jpg') // Default image
  }
  style={commonStyles.avatar}
  onError={(error) => {
    console.error('Failed to load profile picture:', error.nativeEvent.error);
    setProfilePicture(require('../../assets/profile/profile-image.jpg')); // Fallback
  }}
/>


          </View>
          <Text style={commonStyles.linkText}>Change Profile Picture</Text>
        </TouchableOpacity>

        {/* Name Input */}
        <View style={commonStyles.inputContainer}>
          <TextInput
            style={commonStyles.input}
            placeholder="Full Name"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Country Input */}
        <View style={commonStyles.inputContainer}>
          <TextInput
            style={commonStyles.input}
            placeholder="Country"
            placeholderTextColor="#aaa"
            value={country}
            onChangeText={setCountry}
          />
        </View>

        {/* Bio Input */}
        <View style={commonStyles.inputContainerBio}>
          <TextInput
            style={commonStyles.inputBio}
            placeholder="Bio"
            placeholderTextColor="#aaa"
            multiline
            value={bio}
            onChangeText={setBio}
          />
        </View>

        {/* Save Profile Button */}
        <TouchableOpacity style={commonStyles.button} onPress={handleSaveProfile}>
          <Text style={commonStyles.buttonText}>Save Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditProfileScreen;
