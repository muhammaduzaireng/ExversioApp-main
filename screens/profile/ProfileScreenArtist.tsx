import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, Modal, TextInput, Button, FlatList,ScrollView } from 'react-native';
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
  const BASE_URL = "https://api.exversio.com"; // Replace with your server's base URL

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profilePicture: '',
    coverImage: '',
  });

  const { setCurrentMusic, setCurrentMusicIndex, setIsPlaying, setPlaylist } = usePlayer(); // Destructure Player context
  const [modalVisible, setModalVisible] = useState(false);
  const [subscriptionPrice, setSubscriptionPrice] = useState('');
  const [newSubscriptionPrice, setNewSubscriptionPrice] = useState('');
  const [subscribersModalVisible, setSubscribersModalVisible] = useState(false);
  const [subscribedModalVisible, setSubscribedModalVisible] = useState(false);
  const [subscribersList, setSubscribersList] = useState([]);
  const [subscribedList, setSubscribedList] = useState([]);
  const [userId, setUserId] = useState(null);
  const [artistId, setArtistId] = useState(null);


  useEffect(() => {
    // Fetch user profile data using AsyncStorage to get the stored userId
    const fetchArtistIdAndUserId = async () => {
      try {
          const storedUserId = await AsyncStorage.getItem('userId');
          if (storedUserId) {
              setUserId(parseInt(storedUserId, 10));
              const response = await fetch(`${BASE_URL}/get-artist-id?userId=${storedUserId}`);
              const data = await response.json();
              console.log('Artist ID response data:', data);
              if (data.success) {
                  setArtistId(data.artistId);
              } else {
                  Alert.alert('Notice', data.message || 'User is not an approved artist');
                  navigation.navigate('DashboardScreen');
              }
          }
      } catch (error) {
          console.error('Error fetching artistId and userId:', error);
          Alert.alert('Error', 'Failed to fetch artist ID');
      }
  };
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
    fetchArtistIdAndUserId();
  }, [navigation]);
  const fetchSubscribers = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const response = await fetch(`${BASE_URL}/get-subscription-list?artist_id=${artistId}`);
        const data = await response.json();
        if (data.success) {
          setSubscribersList(data.subscribers);
          setSubscribersModalVisible(true);
        } else {
          Alert.alert('Error', 'Failed to fetch subscribers');
        }
      } else {
        Alert.alert('Error', 'No user logged in');
        navigation.navigate('Login'); // Redirect to login if no userId is found
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      Alert.alert('Error', 'Failed to fetch subscribers');
    }
  };
  
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
      setCurrentMusicIndex(null); // Reset current music index
      setIsPlaying(false); // Reset playing state
      setPlaylist([]); // Reset playlist
      await AsyncStorage.removeItem('userId'); // Clear all data from AsyncStorage
      await clearAppCache(); // Clear the cache
      navigation.navigate('Login'); // Navigate to the login screen
    } catch (error) {
      console.error('Error clearing user data on logout:', error);
      Alert.alert('Error', 'Failed to log out');
    }
  };

  const fetchSubscriptionPrice = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const response = await fetch(`${BASE_URL}/getSubscriptionPrice?userId=${userId}`);
        const data = await response.json();
        if (data.success) {
          setSubscriptionPrice(data.subscriptionPrice);
          setNewSubscriptionPrice(data.subscriptionPrice);
        } else {
          Alert.alert('Error', 'Failed to fetch subscription price');
        }
      } else {
        Alert.alert('Error', 'No user logged in');
        navigation.navigate('Login'); // Redirect to login if no userId is found
      }
    } catch (error) {
      console.error('Error fetching subscription price:', error);
      Alert.alert('Error', 'Failed to fetch subscription price');
    }
  };

  const updateSubscriptionPrice = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const response = await fetch(`${BASE_URL}/updateSubscriptionPrice`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            subscriptionPrice: newSubscriptionPrice,
          }),
        });
        const data = await response.json();
        if (data.success) {
          Alert.alert('Success', 'Subscription price updated');
          setSubscriptionPrice(newSubscriptionPrice);
          setModalVisible(false);
        } else {
          Alert.alert('Error', 'Failed to update subscription price');
        }
      } else {
        Alert.alert('Error', 'No user logged in');
        navigation.navigate('Login'); // Redirect to login if no userId is found
      }
    } catch (error) {
      console.error('Error updating subscription price:', error);
      Alert.alert('Error', 'Failed to update subscription price');
    }
  };

  const openPriceChangeModal = () => {
    fetchSubscriptionPrice();
    setModalVisible(true);
  };

return (
  
    <ScrollView
      style={profileStyles.mainContainer}
      contentContainerStyle={profileStyles.container} // Ensure content grows
    >
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
          <TouchableOpacity onPress={handleCoverImageUpload}>
            <Image
              source={
                profileData.coverImage
                  ? { uri: profileData.coverImage }
                  : require('../../assets/profile/profile-image.jpg') // Default image
              }
              style={profileStyles.coverImage}
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
          <TouchableOpacity style={profileStyles.menuItem} onPress={openPriceChangeModal}>
            <Image
              source={require('../../assets/icons/icons8-change-100.png')}
              style={profileStyles.menuIcon}
            />
            <Text style={profileStyles.menuText}>Change Subscription Price</Text>
          </TouchableOpacity>
          <TouchableOpacity style={profileStyles.menuItem} onPress={fetchSubscribers}>
            <Image
              source={require('../../assets/icons/icons8-subscribe-96.png')}
              style={profileStyles.menuIcon}
            />
            <Text style={profileStyles.menuText}>Subscribers</Text>
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
        </View>
      </View>
      <Player />
      {/* Modal for changing subscription price */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={profileStyles.modalContainer}>
          <View style={profileStyles.modalContent}>
            <TouchableOpacity
              style={profileStyles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={profileStyles.modalCloseButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={profileStyles.modalTitle}>Change Subscription Price</Text>
            <TextInput
              style={profileStyles.modalInput}
              value={newSubscriptionPrice}
              onChangeText={setNewSubscriptionPrice}
              keyboardType="numeric"
              placeholder="Enter new subscription price"
            />
            <Button title="Update" onPress={updateSubscriptionPrice} />
          </View>
        </View>
      </Modal>
      {/* Modal for subscribers list */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={subscribersModalVisible}
        onRequestClose={() => setSubscribersModalVisible(false)}
      >
        <View style={profileStyles.modalContainer}>
          <View style={profileStyles.modalContent}>
            <TouchableOpacity
              style={profileStyles.modalCloseButton}
              onPress={() => setSubscribersModalVisible(false)}
            >
              <Text style={profileStyles.modalCloseButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={profileStyles.modalTitle}>Subscribers</Text>
            <FlatList
              data={subscribersList}
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
    </ScrollView>
  );

};

export default ProfileScreen;