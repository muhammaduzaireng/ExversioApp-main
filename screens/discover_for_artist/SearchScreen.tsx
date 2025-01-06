// screens/SearchScreen.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import searchStyles from '../../styles/searchStyles'; // Ensure this import path is correct
import NavigationBar from '../components/NavigationBar';
import Player from '../components/Player';

const SearchScreen = () => {
  return (
    <View style={searchStyles.mainContainer}>
      {/* Search Section */}
      <View style={searchStyles.searchContainer}>
        <TouchableOpacity style={searchStyles.searchIconContainer}>
          <Image source={require('../../assets/icons/3844432_magnifier_search_zoom_icon.png')} style={searchStyles.searchIcon} />
        </TouchableOpacity>
        <TextInput
          style={searchStyles.searchInput}
          placeholder="What do you want to listen?"
          placeholderTextColor="#aaa"
        />
      </View>

      {/* Text Section */}
      <View style={searchStyles.textContainer}>
        <Text style={searchStyles.mainText}>Play what you love</Text>
        <Text style={searchStyles.subText}>Search for artist, songs, playlist and more.</Text>
      </View>

      {/* Player */}
      <Player />

      {/* Navigation Bar */}
      <NavigationBar />
    </View>
  );
};

export default SearchScreen;
