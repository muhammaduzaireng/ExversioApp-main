import { StyleSheet, Dimensions } from "react-native";
const styles = StyleSheet.create({
    headerContainer: {
      alignItems: 'center',
      paddingVertical: 10,
      backgroundColor: '#fff', // Adjust as needed
    },
    logoContainer: {
      marginBottom: 10,
    },
    logo: {
      width: 100, // Adjust as needed
      height: 40, // Adjust as needed
    },
    tabsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
    tabButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    tabButtonActive: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderBottomWidth: 2,
      borderBottomColor: '#000', // Adjust as needed
    },
    tabButtonText: {
      fontSize: 16,
      color: '#000',
    },
    tabButtonTextActive: {
      fontSize: 16,
      color: '#000',
      fontWeight: 'bold',
    },
  });