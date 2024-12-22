// styles/profileStyles.ts
import { StyleSheet } from 'react-native';

const profileStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  userInfo: {
    justifyContent: 'center',
  },
  userName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#aaa',
    fontSize: 14,
  },
  menuItems: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
    marginRight: 15,
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
  },
  becomeArtistButton: {
    backgroundColor: '#007AFF', // Blue background
    padding: 10,
    borderRadius: 5,
    width:200,
    alignItems:'center',
    marginTop: 10,
  },
  becomeArtistButtonText: {
    color: '#fff', // White text
    fontSize: 16,
    fontWeight: 'bold',
  },

});

export default profileStyles;
