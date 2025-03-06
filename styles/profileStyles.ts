import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const profileStyles = StyleSheet.create({
  mainContainer: {
    flex: 1, // Ensure ScrollView takes full height
    backgroundColor: '#121212', // Dark theme
    paddingTop: height * 0.05,
    paddingBottom: height * 0.1,
  },
  container: {
    flexGrow: 1, // Allow content to grow within ScrollView
    marginBottom: height * 0.2,
    
  },
  title: {
    color: '#fff',
    fontSize: width * 0.065, 
    fontWeight: 'bold',
    marginBottom: height * 0.03,
    textAlign: 'center',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: height * 0.02,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  avatar: {
    width: width * 0.22, 
    height: width * 0.22, 
    borderRadius: width * 0.11, 
    borderWidth: 3,
    borderColor: '#2EF3DD',
  },
  userInfo: {
    marginLeft: width * 0.04,
  },
  userName: {
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#aaa',
    fontSize: width * 0.04,
  },
  menuItems: {
    marginTop: height * 0.03,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.018,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    marginBottom: height * 0.015,
    paddingHorizontal: width * 0.04,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  menuIcon: {
    width: width * 0.07,
    height: width * 0.07,
    tintColor: '#2EF3DD',
    marginRight: width * 0.04,
  },
  menuText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: '500',
  },
  becomeArtistButton: {
    backgroundColor: '#2EF3DD',
    paddingVertical: height * 0.016,
    borderRadius: 30,
    width: width * 0.6,
    alignItems: 'center',
    marginTop: height * 0.04,
    alignSelf: 'center',
    shadowColor: '#2EF3DD',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  becomeArtistButtonText: {
    color: '#121212',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCloseButton: {
    alignSelf: 'flex-end',
  },
  modalCloseButtonText: {
    fontSize: 18,
    color: '#888',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  subscriberItem:{
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.018,
   fontWeight: 'bold',
    borderRadius: 10,
    marginBottom: height * 0.015,
    paddingHorizontal: width * 0.04,
   
   
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  }
  
});

export default profileStyles;
