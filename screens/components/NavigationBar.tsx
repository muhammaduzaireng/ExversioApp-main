import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import discoverStyles from '../../styles/discoverStyles'; // Ensure this import path is correct
import dashboardStyles from '../../styles/dashboardStyles'; // Ensure this import path is correct

interface NavigationBarProps {
  selectedScreen: 'DashboardScreen' | 'DiscoverScreen' | 'LibraryScreen' | 'ProfileScreen'; // Selected screen passed as a prop
  onNavigationClick: (screen: 'DashboardScreen' | 'DiscoverScreen' | 'LibraryScreen' | 'ProfileScreen') => void; // Callback function
}

const NavigationBar = ({ selectedScreen, onNavigationClick }: NavigationBarProps) => {
  // Function to determine the icon style based on the selected screen
  const getIconStyle = (screenName: string) => {
    // If the screen is selected, change the tint color; otherwise, keep default color
    return selectedScreen === screenName
      ? [discoverStyles.footerIcon, { tintColor: '#2EF3DD' }] // Color for the selected icon
      : discoverStyles.footerIcon; // Default color for non-selected icons
  };

  return (
    <View style={dashboardStyles.footer}>
      {/* Dashboard Button */}
      <TouchableOpacity
        style={dashboardStyles.footerButton}
        onPress={() => onNavigationClick('DashboardScreen')} // Update selected screen
      >
        <Image
          source={require('../../assets/icons/9004706_house_home_property_estate_building_icon.png')}
          style={getIconStyle('DashboardScreen')} // Apply correct style
        />
      </TouchableOpacity>

      {/* Discover Button */}
      <TouchableOpacity
        style={dashboardStyles.footerButton}
        onPress={() => onNavigationClick('DiscoverScreen')} // Update selected screen
      >
        <Image
          source={require('../../assets/icons/icons.png')}
          style={getIconStyle('DiscoverScreen')} // Apply correct style
        />
      </TouchableOpacity>

      {/* Library Button */}
      <TouchableOpacity
        style={dashboardStyles.footerButton}
        onPress={() => onNavigationClick('LibraryScreen')} // Update selected screen
      >
        <Image
          source={require('../../assets/icons/3669472_music_library_ic_icon.png')}
          style={getIconStyle('LibraryScreen')} // Apply correct style
        />
      </TouchableOpacity>

      {/* Profile Button */}
      <TouchableOpacity
        style={dashboardStyles.footerButton}
        onPress={() => onNavigationClick('ProfileScreen')} // Update selected screen
      >
        <Image
          source={require('../../assets/icons/370076_account_avatar_client_male_person_icon.png')}
          style={getIconStyle('ProfileScreen')} // Apply correct style
        />
      </TouchableOpacity>
    </View>
  );
};

export default NavigationBar;
