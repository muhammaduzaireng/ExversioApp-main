import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const Header = ({ selectedTab, setSelectedTab }) => {
  return (
    <View style={styles.headerContainer}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/logo/logo_white.png')} // Replace with your logo path
          style={styles.logo}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={selectedTab === 'All' ? styles.tabButtonActive : styles.tabButton}
          onPress={() => setSelectedTab('All')}
        >
          <Text style={selectedTab === 'All' ? styles.tabButtonTextActive : styles.tabButtonText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={selectedTab === 'Music' ? styles.tabButtonActive : styles.tabButton}
          onPress={() => setSelectedTab('Music')}
        >
          <Text style={selectedTab === 'Music' ? styles.tabButtonTextActive : styles.tabButtonText}>Music</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={selectedTab === 'Videos' ? styles.tabButtonActive : styles.tabButton}
          onPress={() => setSelectedTab('Videos')}
        >
          <Text style={selectedTab === 'Videos' ? styles.tabButtonTextActive : styles.tabButtonText}>Videos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={selectedTab === 'Pictures' ? styles.tabButtonActive : styles.tabButton}
          onPress={() => setSelectedTab('Pictures')}
        >
          <Text style={selectedTab === 'Pictures' ? styles.tabButtonTextActive : styles.tabButtonText}>Pictures</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
    headerContainer: {
      alignItems: 'center',
      
      backgroundColor: '#1E1E1E', // Adjust as needed
    },
    logoContainer: {
      marginBottom: 10,
    },
    logo: {
        width: 150,
        height: 25,

    },
    tabsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      backgroundColor: '#1E1E1E', // Adjust as needed
      padding: 10,
    },
    tabButton: {
        backgroundColor: '#333',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
      },
      tabButtonActive: {
        backgroundColor: '#2EF3DD',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
      },
      tabButtonText: {
        color: '#fff',
        fontWeight: 'bold',
      },
      tabButtonTextActive: {
        color: '#1E1E1E',
        fontWeight: 'bold',
      },
  });
export default Header;