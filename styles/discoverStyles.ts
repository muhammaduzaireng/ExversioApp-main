import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const discoverStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  contentContainer: {
    paddingHorizontal: width * 0.05, // 5% of screen width
    paddingTop: height * 0.04, // 1% of screen height
  },
  searchContainer: {
    marginBottom: height * 0.02, // 2% of screen height
  },
  searchLabel: {
    color: '#fff',
    fontSize: width * 0.04, // 4% of screen width
    fontWeight: 'bold',
    marginBottom: height * 0.01, // 1% of screen height
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: width * 0.025, // 2.5% of screen width
    paddingHorizontal: width * 0.025, // 2.5% of screen width
  },
  searchInput: {
    flex: 1,
    paddingVertical: height * 0.01, // 1% of screen height
    color: '#000',
  },
  searchIconContainer: {
    padding: width * 0.0125, // 1.25% of screen width
  },
  searchIcon: {
    width: width * 0.06, // 6% of screen width
    height: height * 0.03, // 3% of screen height
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  artistsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  artistCard: {
    width: 100,
    height: 140,
    borderRadius: 10,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly', // This will distribute the buttons more evenly with less space between them
    marginBottom: 10,
  },
  genreButton: {
    width: 140,
    height: 90,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15, // Reduced space between rows
    marginHorizontal: 5, // Add horizontal margin to reduce space between columns

  },
  genreText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },

  musicPlayerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e2e2e',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  musicPlayerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  musicPlayerInfo: {
    flex: 1,
  },
  musicPlayerTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  musicPlayerArtist: {
    color: '#bbb',
    fontSize: 12,
  },
  musicPlayerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  musicPlayerTime: {
    color: '#bbb',
    fontSize: 12,
    marginHorizontal: 5,
  },
  musicPlayerProgressBar: {
    width: 100,
    height: 2,
    backgroundColor: '#4CD964',
    marginHorizontal: 5,
  },
  playIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#333',
  },
  footerButton: {
    alignItems: 'center',
  },
  footerIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  artistName:{
    color: 'white',
    textAlign:'center'
  }
});

export default discoverStyles;
