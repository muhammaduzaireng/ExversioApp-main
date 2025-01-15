import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  TextInput,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Player from "../components/Player";
import { usePlayer } from "../components/PlayerContext";

const LibraryScreen = () => {
  const { playMusic, pauseMusic, currentMusic, isPlaying } = usePlayer();
  const BASE_URL = "https://api.exversio.com";
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistMusic, setPlaylistMusic] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
        fetchPlaylists(storedUserId);
      } else {
        Alert.alert("Error", "User ID not found.");
      }
    };
    getUserId();
  }, []);

  const fetchPlaylists = async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/get-user-playlists`, {
        params: { user_id: userId },
      });

      if (response.data.success) {
        setPlaylists(response.data.playlists);
      } else {
        Alert.alert("Error", "Failed to fetch playlists");
      }
    } catch (error) {
      console.error("Error fetching playlists:", error);
      Alert.alert("Error", "Failed to fetch playlists");
    }
  };

  const fetchPlaylistMusic = async (playlistId) => {
    try {
      const response = await axios.get(`${BASE_URL}/get-playlist-music`, {
        params: { playlist_id: playlistId },
      });
  
      if (response.data.success) {
        // Transform URLs to include the base URL and handle null values
        const musicWithFullUrls = response.data.music.map((item) => ({
          ...item,
          file_url: item.file_url
            ? item.file_url.startsWith("http")
              ? item.file_url
              : `${BASE_URL}${item.file_url}`
            : null, // Keep file_url null if it's missing
          cover_url: item.cover_url
            ? item.cover_url.startsWith("http")
              ? item.cover_url
              : `${BASE_URL}${item.cover_url}`
            : null, // Keep cover_url null if it's missing
        }));
  
        setPlaylistMusic(musicWithFullUrls);
        console.log("Fetched playlist music:", musicWithFullUrls); // Debug log to confirm URL transformation
      } else {
        Alert.alert("Error", "Failed to fetch playlist music");
      }
    } catch (error) {
      console.error("Error fetching playlist music:", error);
      Alert.alert("Error", "Failed to fetch playlist music");
    }
  };
  
  
 
  

  const createPlaylist = async () => {
    if (!newPlaylistName.trim()) {
      Alert.alert("Validation Error", "Playlist name cannot be empty.");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/create-playlist`, {
        user_id: userId,
        name: newPlaylistName,
      });

      if (response.data.success) {
        setNewPlaylistName("");
        setIsModalVisible(false);
        fetchPlaylists(userId);
        Alert.alert("Success", "Playlist created successfully!");
      } else {
        Alert.alert("Error", "Failed to create playlist.");
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
      Alert.alert("Error", "Failed to create playlist.");
    }
  };

  const renderPlaylist = ({ item }) => (
    <TouchableOpacity
      style={styles.playlistItem}
      onPress={() => {
        setSelectedPlaylist(item);
        fetchPlaylistMusic(item.playlist_id);
      }}
    >
      <Image
        source={require("../../assets/profile/profile-image.jpg")}
        style={styles.playlistImage}
      />
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  // const renderMusicItem = ({ item }) => (
  //   <View style={styles.musicItem}>
  //     <Text style={styles.musicTitle}>{item.music_title}</Text>
  //     <TouchableOpacity
  //       onPress={() =>
  //         currentMusic?.music_id === item.music_id && isPlaying
  //           ? pauseMusic()
  //           : playMusic({
  //               ...item,
  //               file_url:
  //                 item.file_url ||
  //                 "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  //             })
  //       }
  //     >
  //       <Text style={styles.playButton}>
  //         {currentMusic?.music_id === item.music_id && isPlaying ? "Pause" : "Play"}
  //       </Text>
  //     </TouchableOpacity>
  //   </View>
  // );

  const renderMusicItem = ({ item, index }) => (
    console.log("item", item),
    <View style={styles.musicItem}>
      <Text style={styles.musicTitle}>{item.music_title}</Text>
      <TouchableOpacity
        onPress={() => {
          playMusic(
            {
              ...item,
              file_url: item.file_url, // The file_url is now guaranteed to be a complete URL
            },
            playlistMusic, // Pass the full playlist
            index // Pass the index of the selected track
          );
        }}
      >
        <Text style={styles.playButton}>
          {currentMusic?.music_id === item.music_id && isPlaying ? "Pause" : "Play"}
        </Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Library</Text>
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Image
            source={require("../../assets/icons/plus.png")}
            style={styles.headerIcon}
          />
        </TouchableOpacity>
      </View>

      {!selectedPlaylist ? (
        <FlatList
          data={playlists}
          keyExtractor={(item) => item.playlist_id.toString()}
          renderItem={renderPlaylist}
        />
      ) : (
        <View>
          <View style={styles.selectedPlaylistHeader}>
            <TouchableOpacity onPress={() => setSelectedPlaylist(null)}>
              <Text style={styles.backButton}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.playlistTitle}>{selectedPlaylist.name}</Text>
          </View>
          <FlatList
            data={playlistMusic}
            keyExtractor={(item) => item.music_id.toString()}
            renderItem={renderMusicItem}
          />
        </View>
      )}

      {/* Modal for creating a playlist */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Playlist Name"
            value={newPlaylistName}
            onChangeText={setNewPlaylistName}
          />
          <TouchableOpacity style={styles.createButton} onPress={createPlaylist}>
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setIsModalVisible(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Player and Navigation */}
      
        <Player />
        <NavigationBar />
      </View>
    
  );
};
import {  Dimensions } from "react-native";
import NavigationBar from "../components/NavigationBar";

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: width * 0.02, // 2% of screen width
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
  headerIcon: {
    width: width * 0.06, // 6% of screen width
    height: width * 0.06, // Maintain aspect ratio
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02, // 2% of screen height
  },
  playlistImage: {
    width: width * 0.15, // 15% of screen width
    height: width * 0.15, // Maintain square shape
    borderRadius: width * 0.03, // Rounded corners
    marginRight: width * 0.04, // 4% of screen width
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    fontSize: width * 0.045, // 4.5% of screen width
    fontWeight: "bold",
    color: "#fff",
  },
  selectedPlaylistHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02, // 2% of screen height
  },
  backButton: {
    fontSize: width * 0.04, // 4% of screen width
    color: "#2EF3DD",
    marginRight: width * 0.02, // 2% of screen width
  },
  playlistTitle: {
    fontSize: width * 0.05, // 5% of screen width
    fontWeight: "bold",
    color: "#fff",
  },
  musicItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.015, // 1.5% of screen height
    padding: width * 0.04, // 4% of screen width
    backgroundColor: "#333",
    borderRadius: width * 0.03, // 3% of screen width
  },
  musicTitle: {
    fontSize: width * 0.04, // 4% of screen width
    color: "#fff",
    flex: 1,
  },
  playButton: {
    fontSize: width * 0.04, // 4% of screen width
    color: "#2EF3DD",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  input: {
    width: "80%",
    padding: height * 0.02, // 2% of screen height
    backgroundColor: "#fff",
    borderRadius: width * 0.03, // 3% of screen width
    marginBottom: height * 0.03, // 3% of screen height
  },
  createButton: {
    padding: height * 0.02, // 2% of screen height
    backgroundColor: "#2EF3DD",
    borderRadius: width * 0.03, // 3% of screen width
  },
  createButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: width * 0.045, // 4.5% of screen width
  },
  cancelButton: {
    padding: height * 0.02, // 2% of screen height
    marginTop: height * 0.015, // 1.5% of screen height
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: width * 0.04, // 4% of screen width
  },
  bottomSection: {
    flexDirection: "column", // Stack Player and NavigationBar vertically
  },
});

export default LibraryScreen;
