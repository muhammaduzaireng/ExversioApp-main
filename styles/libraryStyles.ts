import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const libraryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: width * 0.05, // 5% of screen width
    height: height * 0.04,
    
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.02, // 2% of screen height
  },
  title: {
    fontSize: width * 0.06, // 6% of screen width
    fontWeight: "bold",
    color: "#fff",
  },
  headerIcons: {
    flexDirection: "row",
  },
  headerIcon: {
    width: width * 0.06, // 6% of screen width
    height: width * 0.06, // 6% of screen width (keeping it square)
    marginLeft: width * 0.05, // 5% of screen width
    tintColor: "#fff",
  },
  playlistContainer: {
    paddingBottom: height * 0.02, // 2% of screen height
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    padding: 10,
    marginBottom: height * 0.02, // 2% of screen height
  },
  playlistImage: {
    width: width * 0.15, // 15% of screen width
    height: width * 0.15, // 15% of screen width (keeping it square)
    borderRadius: width * 0.075, // 7.5% of screen width (half of the width for a circular image)
    marginRight: width * 0.05, // 5% of screen width
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    fontSize: width * 0.045, // 4.5% of screen width
    fontWeight: "bold",
    color: "#fff",
  },
  playlistDate: {
    fontSize: width * 0.035, // 3.5% of screen width
    color: "#aaa",
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
