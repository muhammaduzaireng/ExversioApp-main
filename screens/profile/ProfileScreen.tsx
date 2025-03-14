import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert , Modal, ScrollView, FlatList} from 'react-native';
import profileStyles from '../../styles/profileStyles'; // Ensure this import path is correct
import Player from '../components/Player';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs'; // Import react-native-fs
import TrackPlayer from 'react-native-track-player'; // Import TrackPlayer
import { usePlayer } from '../../screens/components/PlayerContext'; // Import Player context

type ProfileScreenNavigationProp = StackNavigationProp<any, 'ProfileScreen'>;

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const BASE_URL = "https://api.exversio.com"; // Replace with your server's port

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profilePicture: '',
  });

  const { setCurrentMusic, setCurrentMusicIndex, setIsPlaying, setPlaylist } = usePlayer(); // Destructure Player context
  const [subscribedList, setSubscribedList] = useState([]);
  const [subscribedModalVisible, setSubscribedModalVisible] = useState(false);


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

            setProfileData({
              name: data.data.name,
              email: data.data.email,
              profilePicture: profilePictureUrl,
            });
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
  const fetchSubscribed = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const response = await fetch(`${BASE_URL}/get-subscribed-artists?user_id=${userId}`);
        const data = await response.json();
        if (data.success) {
          setSubscribedList(data.subscribed);
          setSubscribedModalVisible(true);
        } else {
          Alert.alert('Error', 'Failed to fetch subscribed artists');
        }
      } else {
        Alert.alert('Error', 'No user logged in');
        navigation.navigate('Login'); // Redirect to login if no userId is found
      }
    } catch (error) {
      console.error('Error fetching subscribed artists:', error);
      Alert.alert('Error', 'Failed to fetch subscribed artists');
    }
  };

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

  const clearAppCache = async () => {
    try {
      const cachePath = RNFS.CachesDirectoryPath;
      const result = await RNFS.readDir(cachePath); // Read the cache directory
      for (const file of result) {
        if (file.isFile()) {
          await RNFS.unlink(file.path); // Remove file
        } else if (file.isDirectory()) {
          await RNFS.unlink(file.path); // Remove directory
        }
      }
      console.log('Cache cleared successfully');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await TrackPlayer.stop(); // Stop any playing music
      setCurrentMusic(null); // Reset current music
     
      setIsPlaying(false); // Reset playing state
      // Reset playlist
      await AsyncStorage.clear(); // Clear all data from AsyncStorage
      await clearAppCache(); // Clear the cache
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
                  : require('../../assets/profile/profile-image.jpg') // Default image
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
          <TouchableOpacity style={profileStyles.menuItem} onPress={fetchSubscribed}>
            <Image
              source={require('../../assets/icons/icons8-subscribe-58.png')}
              style={profileStyles.menuIcon}
            />
            <Text style={profileStyles.menuText}>Subscribed</Text>
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

          <TouchableOpacity
            style={profileStyles.becomeArtistButton}
            onPress={() => navigation.navigate('BecomeArtistForm')}
          >
            <Text style={profileStyles.becomeArtistButtonText}>Become Artist</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Player />
      {/* Modal for subscribed list */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={subscribedModalVisible}
        onRequestClose={() => setSubscribedModalVisible(false)}
      >
        <View style={profileStyles.modalContainer}>
          <View style={profileStyles.modalContent}>
            <TouchableOpacity
              style={profileStyles.modalCloseButton}
              onPress={() => setSubscribedModalVisible(false)}
            >
              <Text style={profileStyles.modalCloseButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={profileStyles.modalTitle}>Subscribed</Text>
            <FlatList
              data={subscribedList}
              keyExtractor={(item) => item.id?.toString() || item.name} // Handle undefined id
              renderItem={({ item }) => (
                <View style={profileStyles.subscriberItem}>
                  <Text>{item.name}</Text>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
     
    </View>
  );
};

export default ProfileScreen;