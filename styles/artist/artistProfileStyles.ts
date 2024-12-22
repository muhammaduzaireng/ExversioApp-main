import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const artistProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  contentContainer: {
    paddingBottom: 100,
  },
  headerContainer: {
    position: 'relative',
    backgroundColor: '#333',
    paddingBottom: 20,
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
  settingsButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#333',
    borderRadius: 20,
    padding: 5,
  },
  settingsIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
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
  subscribeButton: {
    backgroundColor: '#2EF3DD',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  subscribeButtonText: {
    color: '#1E1E1E',
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  tabButtonActive: {
    backgroundColor: '#2EF3DD',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  tabButton: {
    backgroundColor: '#333',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  tabButtonTextActive: {
    color: '#1E1E1E',
    fontWeight: 'bold',
  },
  tabButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  postContainer: {
    backgroundColor: '#2E2E2E',
    marginVertical: 10,
    marginHorizontal: 15, // Adjust for a more narrow margin
    borderRadius: 10,
    padding: 10,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
  },
  timestamp: {
    color: '#bbb',
    fontSize: 12,
  },
  shareIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  postText: {
    color: '#fff',
    marginVertical: 10,
  },
  postMedia: {
    width: screenWidth - 80, // Adjust width for margin
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likeCount: {
    color: '#fff',
  },
  commentCount: {
    color: '#fff',
  },
  actionIconLike: {
    width: 20,
    height: 20,
  },
  actionIconComment: {
    width: 20,
    height: 20,
  },
  artistPostContainer:{
    width:'90%',
    margin:'auto'
  }
});

export default artistProfileStyles;
