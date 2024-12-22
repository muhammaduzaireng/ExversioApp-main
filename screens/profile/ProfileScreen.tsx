import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import profileStyles from '../../styles/profileStyles'; // Ensure this import path is correct
import Player from '../components/Player';
import NavigationBar from '../components/NavigationBar';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

type ProfileScreenNavigationProp = StackNavigationProp<any, 'ProfileScreen'>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const BASE_URL = "http://localhost:3000"; // Replace 3000 with your server's port

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profilePicture: '',
  });

  useEffect(() => {
    // Fetch user profile data using AsyncStorage to get the stored userId
    const fetchProfileData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          fetch(`${BASE_URL}/getUserProfile?userId=${userId}`)
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                setProfileData({
                  name: data.data.name,
                  email: data.data.email,
                  profilePicture: data.data.profile_picture,
                });
              } else {
                Alert.alert('Error', 'Failed to fetch user profile');
              }
            })
            .catch((error) => {
              console.error('Error fetching user profile:', error);
              Alert.alert('Error', 'Failed to fetch user profile');
            });
        } else {
          Alert.alert('Error', 'No user logged in');
          navigation.navigate('Login'); // Redirect to login if no userId is found
        }
      } catch (error) {
        console.error('Error fetching userId from AsyncStorage:', error);
      }
    };

    fetchProfileData();
  }, [navigation]);

  const handleProfilePictureUpload = () => {
    // Open image picker for selecting profile picture
    ImagePicker.launchImageLibrary({}, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0].uri;
        console.log('Selected image: ', selectedImage);
        uploadProfilePicture(selectedImage);
      }
    });
  };

  const uploadProfilePicture = (imageUri: string) => {
    const formData = new FormData();
    formData.append('profilePicture', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile-picture.jpg',
    });

    fetch(`${BASE_URL}/updateProfile`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Alert.alert('Success', 'Profile picture updated');
          setProfileData({ ...profileData, profilePicture: data.profilePicture });
        } else {
          Alert.alert('Error', 'Failed to upload profile picture');
        }
      })
      .catch((error) => {
        console.error('Error uploading profile picture:', error);
        Alert.alert('Error', 'Failed to upload profile picture');
      });
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
        <View style={profileStyles.profileHeader}>
          <TouchableOpacity onPress={handleProfilePictureUpload}>
            <Image
              source={
                profileData.profilePicture
                  ? { uri: profileData.profilePicture }
                  : require('../../assets/profile/profile-image.jpg')
              }
              style={profileStyles.avatar}
            />
          </TouchableOpacity>
          <View style={profileStyles.userInfo}>
            <Text style={profileStyles.userName}>{profileData.name || 'Name'}</Text>
            <Text style={profileStyles.userEmail}>{profileData.email || 'Email@.com'}</Text>
          </View>
        </View>
        <View style={profileStyles.menuItems}>
          <TouchableOpacity style={profileStyles.menuItem} onPress={() =>navigation.navigate('EditProfileScreen')}>
            <Image source={require('../../assets/icons/8666681_edit_icon.png')} style={profileStyles.menuIcon} />
            <Text style={profileStyles.menuText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={profileStyles.menuItem}>
            <Image source={require('../../assets/icons/8530564_bell_icon.png')} style={profileStyles.menuIcon} />
            <Text style={profileStyles.menuText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={profileStyles.menuItem} onPress={() => { navigation.navigate('PaymentScreen') }}>
            <Image source={require('../../assets/icons/290143_cash_money_payment_wallet_icon.png')} style={profileStyles.menuIcon} />
            <Text style={profileStyles.menuText}>Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={profileStyles.menuItem}>
            <Image source={require('../../assets/icons/172473_globe_global_internet_icon.png')} style={profileStyles.menuIcon} />
            <Text style={profileStyles.menuText}>Language</Text>
          </TouchableOpacity>
          <TouchableOpacity style={profileStyles.menuItem} onPress={handleLogout}>
            <Image source={require('../../assets/icons/power.png')} style={profileStyles.menuIcon} />
            <Text style={profileStyles.menuText}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={profileStyles.becomeArtistButton}
            onPress={() => navigation.navigate('BecomeArtistForm')}
          >
            <Text style={profileStyles.becomeArtistButtonText}>Become Artist</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Player />
      <NavigationBar />
    </View>
  );
};

export default ProfileScreen;
