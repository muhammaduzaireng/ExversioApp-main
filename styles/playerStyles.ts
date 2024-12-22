// components/playerStyles.ts
import { StyleSheet } from 'react-native';

const playerStyles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    marginHorizontal: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Space out the items
    marginBottom: 5, // Space between rows
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  artist: {
    color: '#bbb',
    fontSize: 11,
  },
  playIcon: {
    width: 16.67,
    height: 20,
    tintColor: '#fff',
    marginLeft:10,
  },
  progressContainer: {
    marginTop: 5, // Add some space between the rows and the progress bar
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 3,
    backgroundColor: '#333',
    borderRadius: 1.5,
    marginBottom: 3, // Space between the progress bar and time labels
  },
  progressBar: {
    width: '50%', // Adjust the width to represent progress
    height: '100%',
    backgroundColor: '#2ef3dd',
    borderRadius: 1.5,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
    color: '#bbb',
    fontSize: 11,
  },
  maximizeIcon:{
    width:25,
    height:25,
    
  }
});

export default playerStyles;
