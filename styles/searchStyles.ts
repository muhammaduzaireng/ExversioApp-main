// styles/searchStyles.ts
import { StyleSheet } from 'react-native';

const searchStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    justifyContent: 'space-between',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 10,  // Adjust padding for proper spacing
    height: 35, // Set the height to 35
    margin: 20,
    marginTop: 50, // Adjust as needed for top spacing
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingLeft: 10, // Add padding to the left of the text input
    height: '100%', // Ensure the input takes full height of the container
    padding:0,
  },
  searchIconContainer: {
    paddingRight: 10, // Add some padding to the right of the icon
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  mainText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
  },
});

export default searchStyles;
