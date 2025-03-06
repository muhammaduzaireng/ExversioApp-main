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
import playlistStyles from "../../styles/playlistStyles";

const LibraryScreen = () => {
  const { playMusic, pauseMusic, currentMusic, isPlaying, setIsPlaying } = usePlayer();
  const BASE_URL = "https://api.exversio.com";
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistMusic, setPlaylistMusic] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [userId, setUserId] = useState(null);
  const [currentMusicIndex, setCurrentMusicIndex] = useState(null);
  const [currentMusicPlaylist, setCurrentMusicPlaylist] = useState(null);

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
        const musicWithFullUrls = response.data.music.map((item) => ({
          ...item,
          file_url: item.file_url
            ? item.file_url.startsWith("http")
              ? item.file_url
              : `${BASE_URL}${item.file_url}`
            : null,
          cover_url: item.cover_url
            ? item.cover_url.startsWith("http")
              ? item.cover_url
              : `${BASE_URL}${item.cover_url}`
            : null,
          artist_name: item.artist_name || "Unknown Artist",
          profile_picture: item.profile_picture
            ? item.profile_picture.startsWith("http")
              ? item.profile_picture
              : `${BASE_URL}${item.profile_picture}`
            : null,
        }));

        setPlaylistMusic(musicWithFullUrls);
        console.log("Fetched playlist music with artist names:", musicWithFullUrls);
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

  const handlePlayPause = async (item, index) => {
    if (currentMusic?.music_id === item.music_id) {
      // Toggle play/pause
      if (isPlaying) {
        await pauseMusic();
      } else {
        await playMusic(currentMusic, playlistMusic, currentMusicIndex);
      }
      setIsPlaying(!isPlaying);
    } else {
      // Play new music
      await playMusic(item, playlistMusic, index);
      setIsPlaying(true);
      setCurrentMusicPlaylist(item);
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

  const renderMusicItem = ({ item, index }) => (
    <View style={playlistStyles.trackContainer}>
      <View style={playlistStyles.row}>
        <Image
          source={item.profile_picture ? { uri: item.profile_picture } : require("../../assets/profile/profile-image.jpg")}
          style={playlistStyles.trackAvatar}
        />
        <View style={playlistStyles.info}>
          <Text style={playlistStyles.trackTitle} numberOfLines={1}>
            {item.music_title || "Unknown Track"}
          </Text>
          <Text style={playlistStyles.artistName} numberOfLines={1}>
            {item.artist_name || "Unknown Artist"}
          </Text>
        </View>
        <TouchableOpacity onPress={() => handlePlayPause(item, index)}>
          <Image
            source={
              currentMusic?.music_id === item.music_id && isPlaying
                ? require("../../assets/icons/icons8-pause-90.png")
                : require("../../assets/icons/211876_play_icon.png")
            }
            style={playlistStyles.playIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  console.log("isPlaying", isPlaying);

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

      <Player />
    </View>
  );
};

import { Dimensions } from "react-native";
import NavigationBar from "../components/NavigationBar";

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: width * 0.05,
    paddingTop: height * 0.05,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#fff",
  },
  headerIcon: {
    width: width * 0.06,
    height: width * 0.06,
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  playlistImage: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.03,
    marginRight: width * 0.04,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#fff",
  },
  selectedPlaylistHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  backButton: {
    fontSize: width * 0.04,
    color: "#2EF3DD",
    marginRight: width * 0.02,
  },
  playlistTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#fff",
  },
  musicItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.015,
    padding: width * 0.04,
    backgroundColor: "#333",
    borderRadius: width * 0.03,
  },
  musicTitle: {
    fontSize: width * 0.04,
    color: "#fff",
    flex: 1,
  },
  playButton: {
    fontSize: width * 0.04,
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
    padding: height * 0.02,
    backgroundColor: "#fff",
    borderRadius: width * 0.03,
    marginBottom: height * 0.03,
  },
  createButton: {
    padding: height * 0.02,
    backgroundColor: "#2EF3DD",
    borderRadius: width * 0.03,
  },
  createButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: width * 0.045,
  },
  cancelButton: {
    padding: height * 0.02,
    marginTop: height * 0.015,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: width * 0.04,
  },
});

export default LibraryScreen;