import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
import CreatePost from './CreatePost'; // Import the CreatePost component
import dashboardStyles from '../../styles/dashboardStyles';
import discoverStyles from '../../styles/discoverStyles';

interface NavigationBarProps {
  selectedScreen: 'ArtistPostScreen' | 'DiscoverScreenForArtist' | 'MusicLibraryPage' | 'ProfileScreenArtist' | 'CreatePost'; // Selected screen passed as a prop
  onNavigationClick: (
    screen: 'ArtistPostScreen' | 'DiscoverScreenForArtist' | 'MusicLibraryPage' | 'ProfileScreenArtist' | 'CreatePost'
  ) => void; // Callback function
}

const ArtistNavigationBar = ({ selectedScreen, onNavigationClick }: NavigationBarProps) => {
  const [isCreatePostVisible, setCreatePostVisible] = useState(false);

  const getIconStyle = (screenName: string) => {
    return selectedScreen === screenName
      ? [discoverStyles.footerIcon, { tintColor: '#2EF3DD' }] // Color for the selected icon
      : discoverStyles.footerIcon; // Default color for non-selected icons
  };

  const handleCreatePostClick = () => {
    setCreatePostVisible(true);
  };

  const handleCloseCreatePost = () => {
    setCreatePostVisible(false);
  };

  return (
    <View style={styles.footerContainer}>
      {/* First Button */}
      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => onNavigationClick('ArtistPostScreen')}
      >
        <Image
          source={require('../../assets/icons/9004706_house_home_property_estate_building_icon.png')}
          style={getIconStyle('ArtistPostScreen')}
        />
      </TouchableOpacity>

      {/* Second Button */}
      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => onNavigationClick('DiscoverScreenForArtist')}
      >
        <Image
          source={require('../../assets/icons/icons.png')}
          style={getIconStyle('DiscoverScreenForArtist')}
        />
      </TouchableOpacity>

      {/* Centered "+" Button */}
      <TouchableOpacity
        style={styles.centerButton}
        onPress={()=> onNavigationClick('CreatePost')}
      >
        <Image
          source={require('../../assets/icons/134224_add_plus_new_icon.png')} // Replace with your plus icon path
          style={styles.plusIcon}
        />
      </TouchableOpacity>

      {/* Third Button */}
      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => onNavigationClick('MusicLibraryPage')}
      >
        <Image
          source={require('../../assets/icons/3669472_music_library_ic_icon.png')}
          style={getIconStyle('MusicLibraryPage')}
        />
      </TouchableOpacity>

      {/* Fourth Button */}
      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => onNavigationClick('ProfileScreenArtist')}
      >
        <Image
          source={require('../../assets/icons/370076_account_avatar_client_male_person_icon.png')}
          style={getIconStyle('ProfileScreenArtist')}
        />
      </TouchableOpacity>

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
    paddingHorizontal: 10,
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