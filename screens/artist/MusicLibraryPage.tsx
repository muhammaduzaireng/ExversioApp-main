import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, FlatList, Alert, Modal, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import Slider from "@react-native-community/slider";
import TrackPlayer, { useProgress } from "react-native-track-player";
import { usePlayer } from "../components/PlayerContext";
import Player from '../components/Player';
import CircularProgress from '../components/CircularProgress';
import { useNavigation } from '@react-navigation/native';



const MusicApp = () => {
   const navigation = useNavigation();
  const BASE_URL = "https://api.exversio.com";
  const [albums, setAlbums] = useState([]);
  const [isAlbumModalVisible, setIsAlbumModalVisible] = useState(false);
  const [newAlbum, setNewAlbum] = useState({ title: "", cover: null });
  const [isMusicModalVisible, setIsMusicModalVisible] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [userId, setUserId] = useState(null);
  const [artsitName, setArtsitName] = useState(null);
  const [artistId, setArtistId] = useState(null);

  const [newMusic, setNewMusic] = useState({
    title: "",
    type: "",
    file: null,
    cover: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const { playMusic, pauseMusic, currentMusic, isPlaying, currentPlaying } = usePlayer();
  const progress = useProgress();

 
  useEffect(() => {
    const fetchArtistIdAndUserId = async () => {
        try {
            const storedUserId = await AsyncStorage.getItem('userId');
            if (storedUserId) {
                setUserId(parseInt(storedUserId, 10));
                const response = await fetch(`${BASE_URL}/get-artist-id?userId=${storedUserId}`);
                const data = await response.json();
                console.log('Artist ID response data:', data);
                setArtsitName(data.artistNames);
                if (data.success) {
                    setArtistId(data.artistId);
                } else {
                    Alert.alert('Notice', data.message || 'User is not an approved artist');
                    navigation.navigate('DashboardScreen');
                }
            }
        } catch (error) {
            console.error('Error fetching artistId and userId:', error);
            Alert.alert('Error', 'Failed to fetch artist ID');
        }
    };
  
    const fetchProfileData = async () => {
        try {
          const userId = await AsyncStorage.getItem('userId');
          if (userId) {
            const response = await fetch(`${BASE_URL}/getUserProfile?userId=${userId}`);
            const data = await response.json();
  
            if (data.success) {
              const profilePictureUrl =
                data.data.profilePicture && data.data.profilePicture.startsWith('/')
                  ? `${BASE_URL}${data.data.profilePicture}` // Construct full URL for relative paths
                  : data.data.profilePicture || null; // Use absolute URL or set to null if not available
                  
                setProfilePicture(profilePictureUrl);
                console.log('data:', data);
            } else {
              Alert.alert('Error', 'Failed to fetch user profile');
            }
          } else {
            Alert.alert('Error', 'No user logged in');
            navigation.navigate('Login'); // Redirect to login if no userId is found
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          Alert.alert('Error', 'Failed to fetch user profile');
        }
       
      };

      fetchProfileData();
              
    fetchArtistIdAndUserId();
}, []);

  const fetchAlbums = async () => {
    try {
      const artistId = await AsyncStorage.getItem('artistId');
      if (!artistId) {
        console.log('No artistId found in AsyncStorage.');
        return;
      }
      const response = await axios.get(`${BASE_URL}/albums?artistId=${artistId}`);
      const processedAlbums = response.data.map((album) => ({
        ...album,
        cover: enforceHttps(album.cover),
        tracks: album.tracks.map((track) => ({
          ...track,
          file_url: enforceHttps(track.file_url),
        })),
      }));
      setAlbums(processedAlbums);
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const selectImage = async (callback) => {
    try {
      const result = await ImagePicker.launchImageLibrary({
        mediaType: "photo",
        quality: 1,
      });
      if (result.assets) {
        callback(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error selecting image:", error);
    }
  };

  const createAlbum = async () => {
    if (!newAlbum.title.trim()) {
      Alert.alert("Validation Error", "Album title is required.");
      return;
    }
    try {
      const artistId = await AsyncStorage.getItem("artistId");
      if (!artistId) {
        Alert.alert("Error", "Artist ID not found. Please log in as an artist.");
        return;
      }
      const formData = new FormData();
      formData.append("title", newAlbum.title);
      formData.append("artist_id", artistId);
      if (newAlbum.cover) {
        formData.append("cover", {
          uri: enforceHttps(newAlbum.cover),
          name: `cover-${Date.now()}.jpg`,
          type: "image/jpeg",
        });
      }
      await axios.post(enforceHttps(`${BASE_URL}/create-album`), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchAlbums();
      setNewAlbum({ title: "", cover: null });
      setIsAlbumModalVisible(false);
      Alert.alert("Success", "Album created successfully!");
    } catch (error) {
      console.error("Error creating album:", error);
      Alert.alert("Error", "Failed to create album.");
    }
  };

  const addMusic = async () => {
    const { title, type, file, cover } = newMusic;
    if (!title.trim() || !file) {
      Alert.alert("Validation Error", "Music title and file are required.");
      return;
    }
    try {
      const artistId = await AsyncStorage.getItem("artistId");
      if (!artistId) {
        Alert.alert("Error", "Artist ID not found. Please log in as an artist.");
        return;
      }
      const formData = new FormData();
      formData.append("album_id", selectedAlbumId);
      formData.append("artist_id", artistId);
      formData.append("title", title);
      formData.append("type", type);
      formData.append("file", {
        uri: enforceHttps(file.uri),
        name: file.name,
        type: file.type,
      });
      if (cover) {
        formData.append("cover", {
          uri: enforceHttps(cover),
          name: `cover-${Date.now()}.jpg`,
          type: "image/jpeg",
        });
      }
      await axios.post(enforceHttps(`${BASE_URL}/add-music`), formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      setUploadProgress(0);
      fetchAlbums();
      setNewMusic({ title: "", type: "", file: null, cover: null });
      setIsMusicModalVisible(false);
      Alert.alert("Success", "Music added successfully!");
    } catch (error) {
      console.error("Error adding music:", error);
      Alert.alert("Error", "Failed to add music.");
    }
  };

  const enforceHttps = (url) => {
    if (!url || typeof url !== "string") {
      return "";
    }
    return url.startsWith("http://") ? url.replace("http://", "https://") : url;
  };

  const renderAlbum = ({ item }) => {
    return (
      <View style={styles.albumCard}>
        <View style={styles.albumHeader}>
          {item.cover ? (
            <Image source={{ uri: item.cover }} style={styles.albumCover} />
          ) : (
            <View style={styles.albumCoverPlaceholder}>
              <Text style={styles.albumCoverText}>{item.title[0]}</Text>
            </View>
          )}
          <Text style={styles.albumTitle}>{item.title}</Text>
        </View>
        <FlatList
          data={item.tracks}
          keyExtractor={(track) => track.music_id.toString()}
          renderItem={({ item: track }) => {
            return (
              <View style={styles.trackContainer}>
                <View style={styles.row}>
                  <Image
                    source={profilePicture ? { uri: profilePicture } : require("../../assets/profile/profile-image.jpg")}
                    style={styles.trackAvatar}
                  />
                  <View style={styles.info}>
                    <Text style={styles.trackTitle} numberOfLines={1}>{track.title || 'Unknown Track'}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      currentPlaying === track.file_url && isPlaying
                        ? pauseMusic()
                        : playMusic({
                          music_id: track.id,
                          file_url: track.file_url,
                          music_title: track.title || 'Track Title',
                          artist_name: artsitName || 'Artist Name',
                          profile_picture: profilePicture || 'https://placekitten.com/300/300'
                        })
                    }
                  >
                
                    <Image
                      source={currentPlaying === track.file_url && isPlaying ? require("../../assets/icons/icons8-pause-90.png") : require("../../assets/icons/211876_play_icon.png")}
                      style={styles.playIcon}
                    />
                  </TouchableOpacity>
                </View>
                
              </View>
            );
          }}
        />
        <TouchableOpacity
          style={styles.addMusicButton}
          onPress={() => {
            setSelectedAlbumId(item.album_id);
            setIsMusicModalVisible(true);
          }}
        >
          <Text style={styles.addMusicButtonText}>Add Music</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.createAlbumButton}
        onPress={() => setIsAlbumModalVisible(true)}
      >
        <Text style={styles.createAlbumButtonText}>Create Album</Text>
      </TouchableOpacity>
      <FlatList
        data={albums}
        keyExtractor={(item) => item.album_id.toString()}
        renderItem={renderAlbum}
      />
      <Modal visible={isAlbumModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Album Title"
            value={newAlbum.title}
            onChangeText={(text) => setNewAlbum({ ...newAlbum, title: text })}
          />
          <TouchableOpacity
            onPress={() => selectImage((uri) => setNewAlbum({ ...newAlbum, cover: uri }))}
          >
            <Text style={styles.coverButtonText}>Select Cover Image</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={createAlbum}>
            <Text style={styles.saveButtonText}>Save Album</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsAlbumModalVisible(false)}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal visible={isMusicModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Music Title"
            value={newMusic.title}
            onChangeText={(text) => setNewMusic({ ...newMusic, title: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Music Type"
            value={newMusic.type}
            onChangeText={(text) => setNewMusic({ ...newMusic, type: text })}
          />
          <TouchableOpacity
            onPress={() => selectImage((uri) => setNewMusic({ ...newMusic, cover: uri }))}
          >
            <Text style={styles.coverButtonText}>Select Cover Image</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              DocumentPicker.pickSingle({ type: [DocumentPicker.types.audio] })
                .then((res) => setNewMusic({ ...newMusic, file: res }))
                .catch((err) => console.error(err))
            }
          >
            <Text style={styles.coverButtonText}>Select Music File</Text>
          </TouchableOpacity>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <CircularProgress percent={uploadProgress} />
          )}
          <TouchableOpacity onPress={addMusic}>
            <Text style={styles.saveButtonText}>Add Music</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsMusicModalVisible(false)}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Player />
    </View>
  );
};

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.02,
    backgroundColor: "#1a1a1a",
  },
  createAlbumButton: {
    backgroundColor: "#2EF3DD",
    padding: height * 0.02,
    borderRadius: width * 0.02,
    alignItems: "center",
    marginTop: width * 0.1,
  },
  createAlbumButtonText: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#000",
  },
  albumCard: {
    marginBottom: height * 0.03,
    padding: width * 0.05,
    backgroundColor: "#3a3a3a",
    borderRadius: width * 0.03,
  },
  albumHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  albumCover: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: width * 0.02,
    marginRight: width * 0.03,
  },
  albumCoverPlaceholder: {
    width: width * 0.2,
    height: width * 0.2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#555",
    borderRadius: width * 0.02,
    marginRight: width * 0.03,
  },
  albumCoverText: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#fff",
  },
  albumTitle: {
    fontSize: width * 0.05,
    color: "#fff",
    fontWeight: "bold",
  },
  trackContainer: {
    marginTop: height * 0.02,
    marginBottom: height * 0.01,
    backgroundColor: "#1C1C1E",
    padding: width * 0.02,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  trackAvatar: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.02,
    marginRight: width * 0.03,
  },
  info: {
    flex: 1,
  },
  trackTitle: {
    fontSize: width * 0.04,
    color: "#fff",
  },
  playIcon: {
    width: width * 0.035,
    height: width * 0.04,
  },
  addMusicButton: {
    backgroundColor: "#2EF3DD",
    padding: height * 0.015,
    borderRadius: width * 0.02,
    alignItems: "center",
    marginTop: height * 0.01,
  },
  addMusicButtonText: {
    fontSize: width * 0.04,
    color: "#000",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: width * 0.05,
  },
  input: {
    width: "100%",
    padding: width * 0.04,
    backgroundColor: "#fff",
    borderRadius: width * 0.02,
    marginBottom: height * 0.02,
  },
  coverButtonText: {
    fontSize: width * 0.04,
    color: "#2EF3DD",
    marginBottom: height * 0.01,
  },
  saveButtonText: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#2EF3DD",
  },
  doneButtonText: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#2EF3DD",
  },
  progressBar: {
    flex: 1,
    marginHorizontal: width * 0.03,
  },
});

export default MusicApp;