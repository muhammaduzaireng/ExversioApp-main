import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import profileStyles from '../../styles/profileStyles'; // Ensure this import path is correct
import Player from '../components/Player';

import ArtistNavigationBar from '../components/ArtistNavigationBar';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ProfileScreenNavigationProp = StackNavigationProp<any, 'ProfileScreen'>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const BASE_URL = "https://api.exversio.com"; // Replace with your server's port

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profilePicture: '',
    coverImage: '',
  });

  useEffect(() => {
    // Fetch user profile data using AsyncStorage to get the stored userId
    const fetchProfileData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const response = await fetch(`${BASE_URL}/getUserProfile?userId=${userId}`);
          const data = await response.json();

          if (data.success) {
            const profilePictureUrl =
              data.data.profilePicture && data.data.profilePicture.startsWith('/')
                ? `${BASE_URL}${data.data.profilePicture}` // Construct full URL for relative paths
                : data.data.profilePicture || null; // Use absolute URL or set to null if not available

                //cover image
                const coverPictureUrl =
                data.data.coverImage && data.data.coverImage.startsWith('/')
                ? `${BASE_URL}${data.data.coverImage}` // Construct full URL for relative paths
                : data.data.coverImage || null; // Use absolute URL or set to null if not available


            setProfileData({
              name: data.data.name,
              email: data.data.email,
              profilePicture: profilePictureUrl,
              coverImage: coverPictureUrl,
            });
            console.log('Fetched user profile:', profileData);
          } else {
            Alert.alert('Error', 'Failed to fetch user profile');
          }
        } else {
          Alert.alert('Error', 'No user logged in');
          navigation.navigate('Login'); // Redirect to login if no userId is found
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        Alert.alert('Error', 'Failed to fetch user profile');
      }
    };

    fetchProfileData();
  }, [navigation]);

  const handleProfilePictureUpload = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: 'photo', quality: 0.8 }, // Picker options
      async (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.error('ImagePicker Error: ', response.errorMessage);
          Alert.alert('Error', 'Failed to open image picker');
        } else if (response.assets && response.assets.length > 0) {
          const selectedImage = response.assets[0];
          console.log('Selected image: ', selectedImage);
  
          try {
            const userId = await AsyncStorage.getItem('userId');
            if (!userId) {
              Alert.alert('Error', 'User ID is required');
              return;
            }
  
            const formData = new FormData();
            formData.append('userId', userId); // Only include the userId
            formData.append('profilePicture', {
              uri: selectedImage.uri,
              type: selectedImage.type || 'image/jpeg',
              name: selectedImage.fileName || `profile-picture-${Date.now()}.jpg`,
            });
  
            console.log('Uploading profile picture with data:', formData);
  
            const response = await fetch(`${BASE_URL}/updateProfilePicture`, {
              method: 'POST',
              body: formData,
            });
  
            const data = await response.json();
            console.log('Response from updateProfilePicture:', data);
  
            if (data.success) {
              Alert.alert('Success', 'Profile picture updated');
              setProfileData({
                ...profileData,
                profilePicture: `${BASE_URL}${data.updatedProfilePicture}`,
              });
            } else {
              Alert.alert('Error', data.message || 'Failed to upload profile picture');
            }
          } catch (error) {
            console.error('Error uploading profile picture:', error);
            Alert.alert('Error', 'Failed to upload profile picture');
          }
        }
      }
    );
  };
  const handleCoverImageUpload = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: 'photo', quality: 0.8 }, // Picker options
      async (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.error('ImagePicker Error: ', response.errorMessage);
          Alert.alert('Error', 'Failed to open image picker');
        } else if (response.assets && response.assets.length > 0) {
          const selectedImage = response.assets[0];
          console.log('Selected cover image: ', selectedImage);
  
          try {
            const userId = await AsyncStorage.getItem('userId');
            if (!userId) {
              Alert.alert('Error', 'User ID is required');
              return;
            }
  
            const formData = new FormData();
            formData.append('userId', userId); // Only include the userId
            formData.append('coverImage', {
              uri: selectedImage.uri,
              type: selectedImage.type || 'image/jpeg',
              name: selectedImage.fileName || `cover-image-${Date.now()}.jpg`,
            });
  
            console.log('Uploading cover image with data:', formData);
  
            const response = await fetch(`${BASE_URL}/updateCoverImage`, {
              method: 'POST',
              body: formData,
            });
  
            const data = await response.json();
            console.log('Response from updateCoverImage:', data);
  
            if (data.success) {
              Alert.alert('Success', 'Cover image updated');
              setProfileData({
                ...profileData,
                coverImage: `${BASE_URL}${data.updatedCoverImage}`,
              });
            } else {
              Alert.alert('Error', data.message || 'Failed to upload cover image');
            }
          } catch (error) {
            console.error('Error uploading cover image:', error);
            Alert.alert('Error', 'Failed to upload cover image');
          }
        }
      }
    );
  };
  
  

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userId'); // Clear the user ID from AsyncStorage
      navigation.navigate('Login'); // Navigate to the login screen
    } catch (error) {
      console.error('Error clearing user data on logout:', error);
      Alert.alert('Error', 'Failed to log out');
    }
  };

  return (
    <View style={profileStyles.mainContainer}>
      <View style={profileStyles.container}>
        <Text style={profileStyles.title}>Profile</Text>
        
  {/* Cover Image Section */}
  
  

  {/* Profile Header Section */}
  <View style={profileStyles.headerContainer}>
  {/* Cover Image */}
  <TouchableOpacity onPress={handleCoverImageUpload}>
  <Image
    source={
      profileData.coverImage
        ? { uri: profileData.coverImage }
        : require('../../assets/cover/music.jpg') // Default cover image
    }
    style={profileStyles.coverImage}
  />
</TouchableOpacity>
  

  {/* Profile Info */}
  <View style={profileStyles.artistInfoContainer}>
    <View style={profileStyles.profileContainer}>
      <TouchableOpacity onPress={handleProfilePictureUpload}>
        <Image
          source={
            profileData.profilePicture
              ? { uri: profileData.profilePicture } 
              : require('../../assets/profile/profile-image.jpg') // Default profile image
          }
          style={profileStyles.profileImage}
        />
      </TouchableOpacity>
    </View>
    <Text style={profileStyles.artistName}>{profileData.name || 'Name'}</Text>
    <Text style={profileStyles.artistDescription}>
      {profileData.email || 'Email@.com'}
    </Text>
  </View>
</View>



        <View style={profileStyles.menuItems}>
          <TouchableOpacity
            style={profileStyles.menuItem}
            onPress={() => navigation.navigate('EditProfileScreen')}
          >
            <Image
              source={require('../../assets/icons/8666681_edit_icon.png')}
              style={profileStyles.menuIcon}
            />
            <Text style={profileStyles.menuText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={profileStyles.menuItem}>
            <Image
              source={require('../../assets/icons/8530564_bell_icon.png')}
              style={profileStyles.menuIcon}
            />
            <Text style={profileStyles.menuText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={profileStyles.menuItem}
            onPress={() => {
              navigation.navigate('PaymentScreen');
            }}
          >
            <Image
              source={require('../../assets/icons/290143_cash_money_payment_wallet_icon.png')}
              style={profileStyles.menuIcon}
            />
            <Text style={profileStyles.menuText}>Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={profileStyles.menuItem}>
            <Image
              source={require('../../assets/icons/172473_globe_global_internet_icon.png')}
              style={profileStyles.menuIcon}
            />
            <Text style={profileStyles.menuText}>Language</Text>
          </TouchableOpacity>
          <TouchableOpacity style={profileStyles.menuItem} onPress={handleLogout}>
            <Image
              source={require('../../assets/icons/power.png')}
              style={profileStyles.menuIcon}
            />
            <Text style={profileStyles.menuText}>Logout</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={profileStyles.becomeArtistButton}
            onPress={() => navigation.navigate('BecomeArtistForm')}
          >
            <Text style={profileStyles.becomeArtistButtonText}>Become Artist</Text>
          </TouchableOpacity> */}
        </View>
      </View>
      <Player />
    </View>
  );
};



export default ProfileScreen;
