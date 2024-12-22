// import { StyleSheet } from 'react-native';

// const libraryStyles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#1E1E1E',
//     justifyContent: 'space-between',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: 20,
//   },
//   title: {
//     fontSize: 24,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   headerIcons: {
//     flexDirection: 'row',
//   },
//   headerIcon: {
//     width: 24,
//     height: 24,
//     tintColor: '#fff',
//     marginLeft: 15,
//   },
//   playlistContainer: {
//     paddingHorizontal: 20,
//     paddingTop: 20,
//   },
//   playlistItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   playlistImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 15,
//   },
//   playlistInfo: {
//     flex: 1,
//   },
//   playlistName: {
//     fontSize: 18,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   playlistDate: {
//     fontSize: 14,
//     color: '#aaa',
//     marginTop: 5,
//   },
//   createPlaylistItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   createPlaylistButton: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#333',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   createPlaylistIcon: {
//     width: 24,
//     height: 24,
//     tintColor: '#fff',
//   },
//   createPlaylistText: {
//     fontSize: 18,
//     color: '#fff',
//   },

  
// });

// export default libraryStyles;
import { StyleSheet } from "react-native";

const libraryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerIcons: {
    flexDirection: "row",
  },
  headerIcon: {
    width: 24,
    height: 24,
    marginLeft: 20,
    tintColor: "#fff",
  },
  playlistContainer: {
    paddingBottom: 20,
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  playlistImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  playlistDate: {
    fontSize: 14,
    color: "#888",
  },
  createPlaylistItem: {
    alignItems: "center",
    marginTop: 20,
  },
  createPlaylistButton: {
    backgroundColor: "#2EF3DD",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  createPlaylistIcon: {
    width: 30,
    height: 30,
    tintColor: "#000",
  },
  createPlaylistText: {
    marginTop: 10,
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInput: {
    width: "100%",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2EF3DD",
    padding: 10,
  },
});

export default libraryStyles;
