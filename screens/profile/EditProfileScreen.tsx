import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import * as ImagePicker from 'react-native-image-picker'; // For selecting profile picture
import commonStyles from '../../styles/commonStyles'; // Ensure this path is correct

type EditProfileScreenNavigationProp = StackNavigationProp<any, 'EditProfile'>;

const EditProfileScreen = () => {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();
  const BASE_URL = "http://localhost:3000"; // Replace 3000 with your server's port

  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  useEffect(() => {
    // Load current profile data when the screen is loaded
    const loadProfileData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          // Fetch the current user profile data from the server
          fetch(`${BASE_URL}/getUserProfile?userId=${userId}`)
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                setName(data.data.name);
                setCountry(data.data.country);
                setBio(data.data.bio);
                setProfilePicture(data.data.profile_picture);
              } else {
                Alert.alert('Error', 'Failed to load profile data');
              }
            })
            .catch(error => {
              console.error('Error fetching profile data:', error);
              Alert.alert('Error', 'Failed to load profile data');
            });
        } else {
          Alert.alert('Error', 'No user found. Please log in again.');
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error loading profile data from AsyncStorage:', error);
      }
    };

    loadProfileData();
  }, []);

//   const handleProfilePictureUpload = () => {
//     // Open image picker for selecting profile picture
//     ImagePicker.launchImageLibrary({}, (response) => {
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.error) {
//         console.error('ImagePicker Error: ', response.error);
//       } else if (response.assets && response.assets.length > 0) {
//         const selectedImage = response.assets[0].uri;
//         console.log('Selected image: ', selectedImage);
//         setProfilePicture(selectedImage);
//       }
//     });
//   };

  const handleSaveProfile = async () => {
    try {
        const userId = await AsyncStorage.getItem('userId'); // Fetch userId from storage

        if (!userId) {
            Alert.alert('Error', 'User ID is required');
            return;
        }

        const profileData = {
            userId,  // Include userId
            name,
            country,
            bio: bio || '',  // Handle empty bio
            profilePicture: profilePicture ? profilePicture : null  // If profile picture is present, send it
        };

        fetch(`{BASE_URL}/updateProfile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),  // Send the profile data as JSON
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Alert.alert('Success', 'Profile updated successfully');
                navigation.goBack();  // Go back to the previous screen
            } else {
                Alert.alert('Error', 'Failed to update profile');
            }
        })
        .catch(error => {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Failed to update profile');
        });
    } catch (error) {
        console.error('Error saving profile:', error);
        Alert.alert('Error', 'Failed to save profile');
    }
};

const handleProfilePictureUpload = () => {
    ImagePicker.launchImageLibrary({}, (response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.error('ImagePicker Error: ', response.error);
        } else if (response.assets && response.assets.length > 0) {
            const selectedImage = response.assets[0].uri;

            // Convert image to base64 string to send to the backend
            RNFetchBlob.fs.readFile(selectedImage, 'base64')
                .then((base64Data) => {
                    setProfilePicture(`data:image/jpeg;base64,${base64Data}`);  // Save base64 image in state
                })
                .catch((error) => {
                    console.error('Error converting image to base64:', error);
                });
        }
    });
};

  
  

  return (
    <View style={commonStyles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={commonStyles.backButtonContainer}>
        <Image source={require('../../assets/icons/211686_back_arrow_icon.png')} style={commonStyles.backIcon} />
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
        : require('../../assets/profile/profile-image.jpg')
    }
    style={commonStyles.avatar}
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
