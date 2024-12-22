// components/NavigationBar.tsx
import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import discoverStyles from '../../styles/discoverStyles'; // Ensure this import path is correct
import dashboardStyles from '../../styles/dashboardStyles'; // Ensure this import path is correct
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const NavigationBar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const getIconStyle = (screenName: string) => {
    return route.name === screenName
      ? [discoverStyles.footerIcon, { tintColor: '#2EF3DD' }]
      : discoverStyles.footerIcon;
  };

  return (
    <View style={dashboardStyles.footer}>
      <TouchableOpacity
        style={dashboardStyles.footerButton}
        onPress={() => navigation.navigate('DashboardScreen')}
      >
        <Image
          source={require('../../assets/icons/9004706_house_home_property_estate_building_icon.png')}
          style={getIconStyle('DashboardScreen')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={dashboardStyles.footerButton}
        onPress={() => navigation.navigate('DiscoverScreen')}
      >
        <Image
          source={require('../../assets/icons/icons.png')}
          style={getIconStyle('DiscoverScreen')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={dashboardStyles.footerButton}
        onPress={() => navigation.navigate('LibraryScreen')}
      >
        <Image
          source={require('../../assets/icons/3669472_music_library_ic_icon.png')}
          style={getIconStyle('LibraryScreen')}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={dashboardStyles.footerButton}
        onPress={() => navigation.navigate('ProfileScreen')}
      >
        <Image
          source={require('../../assets/icons/370076_account_avatar_client_male_person_icon.png')}
          style={getIconStyle('ProfileScreen')}
        />
      </TouchableOpacity>
    </View>
  );
};

export default NavigationBar;
