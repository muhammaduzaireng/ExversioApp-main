import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const playerMaximizeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: width * 0.05, // 5% of screen width
    paddingVertical: height * 0.02, // 2% of screen height
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: height * 0.02, // 2% of screen height
  },
  backIcon: {
    width: width * 0.05, // 5% of screen width
    height: height * 0.03, // 3% of screen height
    tintColor: '#fff',
  },
  menuIcon: {
    width: width * 0.05,
    height: width * 0.05,
    tintColor: '#fff',
    transform: [{ rotate: '90deg' }],
  },
  albumArtContainer: {
    alignItems: 'center',
    marginTop: height * 0.05, // 5% of screen height
    marginBottom: height * 0.05,
  },
  albumArt: {
    width: width * 0.9, // 90% of screen width
    height: width * 0.8, // Maintain aspect ratio
    borderRadius: 20,
  },
  songInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  songName: {
    color: '#fff',
    fontSize: width * 0.05, // 5% of screen width
    fontWeight: 'bold',
  },
  artistName: {
    color: '#bbb',
    fontSize: width * 0.04,
  },
  heartIcon: {
    width: width * 0.06,
    height: width * 0.05,
    tintColor: '#fff',
  },
  controlsContainer: {
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  progressBarContainer: {
    flex: 1,
    height: 2,
    backgroundColor: '#333',
    marginHorizontal: width * 0.02,
    borderRadius: 2,
  },
  progressBar: {
    width: '50%', // Example static value, should be dynamic
    height: '100%',
    backgroundColor: '#4CD964',
    borderRadius: 2,
  },
  time: {
    color: '#bbb',
    fontSize: width * 0.035,
  },
  controlButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: height * 0.03,
  },
  controlIcon: {
    width: width * 0.07,
    height: width * 0.07,
    tintColor: '#fff',
  },
  playButton: {
    width: width * 0.15,
    height: width * 0.15,
    backgroundColor: '#2ef3dd',
    borderRadius: width * 0.075, // Half of width/height for a circle
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    width: width * 0.05,
    height: width * 0.06,
    tintColor: '#00041b',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  footerButton: {
    alignItems: 'center',
  },
  footerIcon: {
    width: width * 0.06,
    height: width * 0.06,
    tintColor: '#fff',
  },
});

export default playerMaximizeStyles;
