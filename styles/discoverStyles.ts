// styles/discoverStyles.ts
import { StyleSheet } from 'react-native';

const discoverStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    color: '#000',
  },
  searchIconContainer: {
    padding: 5,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#000',
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
