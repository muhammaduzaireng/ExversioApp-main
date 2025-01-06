import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import dashboardStyles from '../../styles/dashboardStyles';
import discoverStyles from '../../styles/discoverStyles';
import CreatePost from './CreatePost'; // Import the CreatePost component

const ArtistNavigationBar = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [isPostModalVisible, setIsPostModalVisible] = useState(false);

  const getIconStyle = (screenName) => {
    return route.name === screenName
      ? [discoverStyles.footerIcon, { tintColor: '#2EF3DD' }]
      : discoverStyles.footerIcon;
  };

  return (
    <View style={styles.footerContainer}>
      {/* First Button */}
      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => navigation.navigate('ArtistPostScreen')}
      >
        <Image
          source={require('../../assets/icons/9004706_house_home_property_estate_building_icon.png')}
          style={getIconStyle('ArtistPostScreen')}
        />
      </TouchableOpacity>

      {/* Second Button */}
      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => navigation.navigate('DiscoverScreenForArtist')}
      >
        <Image
          source={require('../../assets/icons/icons.png')}
          style={getIconStyle('DiscoverScreen')}
        />
      </TouchableOpacity>

      {/* Centered "+" Button */}
      <TouchableOpacity
        style={styles.centerButton}
        onPress={() => setIsPostModalVisible(true)}
      >
        <Image
          source={require('../../assets/icons/134224_add_plus_new_icon.png')} // Replace with your plus icon path
          style={styles.plusIcon}
        />
      </TouchableOpacity>

      {/* Third Button */}
      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => navigation.navigate('MusicLibraryPage')}
      >
        <Image
          source={require('../../assets/icons/3669472_music_library_ic_icon.png')}
          style={getIconStyle('MusicLibraryPage')}
        />
      </TouchableOpacity>

      {/* Fourth Button */}
      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => navigation.navigate('ProfileScreenArtist')}
      >
        <Image
          source={require('../../assets/icons/370076_account_avatar_client_male_person_icon.png')}
          style={getIconStyle('ProfileScreen')}
        />
      </TouchableOpacity>

      {/* Modal for Create Post */}
      <Modal
        visible={isPostModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsPostModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <CreatePost onClose={() => setIsPostModalVisible(false)} />
        </View>
      </Modal>
      
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    height: 70,
    paddingHorizontal: 20,
  },
  footerButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2EF3DD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, // Lift the "+" button slightly above
  },
  plusIcon: {
    width: 30,
    height: 30,
    tintColor: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dimmed background
},
});

export default ArtistNavigationBar;
