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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.03,
  },
  avatar: {
    width: width * 0.2, // Responsive width
    height: width * 0.2, // Keep aspect ratio
    borderRadius: (width * 0.2) / 2, // Circular shape
    marginRight: width * 0.05,
  },
  userInfo: {
    justifyContent: 'center',
  },
  userName: {
    color: '#fff',
    fontSize: width * 0.05, // Responsive font size
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#aaa',
    fontSize: width * 0.035, // Responsive font size
  },
  coverImage: {
    width: '100%',
    height: 200,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  coverImageEditIcon: {
    position: 'absolute', // Overlay icon on the cover image
    bottom: height * 0.02, // Positioned at the bottom
    right: width * 0.05, // Positioned on the right
    backgroundColor: '#000000aa', // Semi-transparent black background
    padding: width * 0.02, // Padding around the icon
    borderRadius: width * 0.05, // Rounded icon background
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
