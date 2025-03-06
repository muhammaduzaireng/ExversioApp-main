import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const playlistStyles = StyleSheet.create({
  
trackContainer: {
    padding: 8,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: "#2e2e2e",
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  trackAvatar: {
    width: 40, // Smaller size
    height: 40,
    borderRadius: 4,
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  trackTitle: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  trackArtist: {
    color: "#888",
    fontSize: 12,
  },
  playIcon: {
    width: 16,
    height: 18,
    marginHorizontal: 8,
  },
  artistName:{
    color: "#FFF",
    fontSize: 12,
    fontWeight: "normal",
    marginBottom: 0,
  }
});

export default playlistStyles;