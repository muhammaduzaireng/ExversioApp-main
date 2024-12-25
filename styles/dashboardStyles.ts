import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const dashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    paddingTop: height * 0.04, // 2% of screen height
  },
  logo: {
    width: width * 0.1, // 10% of screen width
    height: height * 0.06, // 6% of screen height
    alignSelf: 'center',
    marginBottom: height * 0.02, // 2% of screen height
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: height * 0.02, // 2% of screen height
  },
  tabButton: {
    backgroundColor: '#333',
    width: width * 0.2, // 20% of screen width
    height: height * 0.05, // 5% of screen height
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center',  // Center the text horizontally
    borderRadius: height * 0.025,  // Adjust the borderRadius to half of the height for a rounded look
  },
  tabButtonActive: {
    backgroundColor: '#2ef3dd',
    width: width * 0.2, // 20% of screen width
    height: height * 0.05, // 5% of screen height
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center',  // Center the text horizontally
    borderRadius: height * 0.025,  // Adjust the borderRadius to half of the height for a rounded look
  },
  tabButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  tabButtonTextActive: {
    color: '#1E1E1E',
    fontSize: 16,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  postContainer: {
    backgroundColor: '#2e2e2e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  actionIconsContainer: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: [{ translateX: -25 }], // Center horizontally
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 50, // Adjust based on your icon size and spacing
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  postMedia: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    color: '#aaa',
    fontSize: 12,
  },
  postText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom:10,
  },
  likeCount: {
    color: '#fff',
    fontSize: 14,
    marginRight: 5,
  },
  commentCount: {
    color: '#fff',
    fontSize: 14,
    marginRight: 5,
    marginLeft: 10,
  },
  iconWrapper: {
    marginTop: 10,  // Adds space above the icon (between the post image and icon)
    alignItems: 'flex-end',  // Aligns the icon to the right
  },
  actionIconMessage: {
    width: 18,
    height: 15,
    marginRight: 10,  // Add some space from the right edge, adjust as needed
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
},
verifiedIcon: {
    width: 16,
    height: 16,
},
modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
},
modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
},
commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    color: '#fff',
},
commentSubmitButton:{color: '#fff'},
commentsContainer: {
    padding: 10,
    backgroundColor: '#2e2e2e',
    borderRadius: 10,
    marginTop: 10,
},
commentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
},
commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
},
commentUsername: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
},
commentText: {
    color: '#fff',
    fontSize: 12,
},
  actionIconLike: {
    width: 18,
    height: 15,
    marginRight: 10,
  },
  actionIconComment: {
    width: 15,
    height: 14,
    marginRight: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#1E1E1E', // Ensure the footer has a background color
  },
  footerButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerIcon: {
    width: 24,
    height: 24,
  },
  mediaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
},
mediaImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
},
mediaInfo: {
    flex: 1,
},
mediaTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
},
mediaArtist: {
    color: '#bbb',
    fontSize: 12,
},
playIcon: {
    width: 16.67,
    height: 20,
},
moreIcon: {
    width:16,
    height:4,
    marginRight:10,
    marginLeft:10,
},
});

export default dashboardStyles;
