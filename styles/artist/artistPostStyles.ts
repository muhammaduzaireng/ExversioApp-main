import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const artistPostStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    paddingTop: height * 0.04, // Responsive padding
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.02, // Responsive margin
  },
  headerTitle: {
    color: '#fff',
    fontSize: width * 0.06, // Responsive font size
    fontWeight: 'bold',
  },
  input: {
    color: '#fff',
    backgroundColor: '#2e2e2e',
    borderRadius: 10,
    padding: width * 0.03, // Responsive padding
    marginBottom: height * 0.02,
  },
  mediaOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: height * 0.02,
  },
  mediaIcon: {
    width: width * 0.12, // Responsive width
    height: width * 0.12, // Responsive height
    tintColor: '#4CD964',
  },
  mediaText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: height * 0.005, // Responsive margin
    fontSize: width * 0.035,
  },
  previewContainer: {
    marginBottom: height * 0.02,
    alignItems: 'center',
  },
  previewImage: {
    width: width * 0.5, // Half the screen width
    height: width * 0.5, // Aspect ratio maintained
    borderRadius: 10,
  },
  postButton: {
    backgroundColor: '#4CD964',
    padding: width * 0.04,
    borderRadius: 10,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045, // Responsive font size
  },
  feedContainer: {
    marginTop: height * 0.02,
  },
  postContainer: {
    backgroundColor: '#2e2e2e',
    padding: width * 0.03,
    borderRadius: 10,
    marginBottom: height * 0.015,
  },
  postContent: {
    color: '#fff',
    marginBottom: height * 0.015,
    fontSize: width * 0.04,
  },
  postMedia: {
    width: '100%',
    height: height * 0.25, // Responsive height
    borderRadius: 10,
  },
});

export default artistPostStyles;
