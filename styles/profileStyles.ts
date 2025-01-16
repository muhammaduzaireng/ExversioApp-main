import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const profileStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    paddingTop: height * 0.05, // Add space on top
  },
  container: {
    padding: width * 0.05, // Responsive padding
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: width * 0.06, // Responsive font size
    fontWeight: 'bold',
    marginBottom: height * 0.02,
  },
  headerContainer: {
    position: 'relative',

    paddingBottom: 20,
    color: '#fff',
  },
  coverImage: {
    width: '100%',
    height: 200,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  artistInfoContainer: {
    alignItems: 'center',
    marginTop: -50,
  },
  artistName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  artistDescription: {
    color: '#ccc',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#1E1E1E',
    marginBottom: 10,
    marginTop: -50, // Adjust to move the profile image up
  },
  menuItems: {
    marginTop: height * 0.02,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.02, // Responsive padding
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuIcon: {
    width: width * 0.06, // Responsive width
    height: width * 0.06, // Responsive height
    tintColor: '#fff',
    marginRight: width * 0.04,
  },
  menuText: {
    color: '#fff',
    fontSize: width * 0.045, // Responsive font size
  },
  becomeArtistButton: {
    backgroundColor: '#007AFF',
    padding: height * 0.015, // Responsive padding
    borderRadius: 5,
    width: width * 0.5, // Responsive width for the button
    alignItems: 'center',
    marginTop: height * 0.02,
    alignSelf: 'center', // Center the button
  },
  becomeArtistButtonText: {
    color: '#fff',
    fontSize: width * 0.045, // Responsive font size
    fontWeight: 'bold',
  },
});


export default profileStyles;
