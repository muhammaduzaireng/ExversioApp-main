// import React, { useState, useEffect, useRef } from "react";
// import { useRoute } from "@react-navigation/native";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   FlatList,
//   Alert,
//   Image,
// } from "react-native";
// import axios from "axios";
// import Sound from "react-native-sound";
// import Slider from "@react-native-community/slider";

// const ArtistAlbums = () => {
//   const route = useRoute();
//   const { artistId } = route.params || {}; // Retrieve artistId from navigation params
//   console.log("Received artistId:", artistId);

//   const BASE_URL = "https://api.exversio.com"; // Replace with your server's URL
//   const [albums, setAlbums] = useState([]);
//   const [currentPlaying, setCurrentPlaying] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [playbackPosition, setPlaybackPosition] = useState(0);
//   const [playbackDuration, setPlaybackDuration] = useState(0);
//   const soundRef = useRef(null);

//   // Fetch Albums for the provided artistId
//   const fetchAlbums = async () => {
//     console.log("Fetching albums for artistId:", artistId); // Debug log
//     try {
//       const response = await axios.get(`${BASE_URL}/get-artist-albums`, {
//         params: { artist_id: artistId },
//       });
//       console.log("Albums response:", response.data); // Debug log
//       if (response.data.success && Array.isArray(response.data.albums)) {
//         setAlbums(response.data.albums);
//       } else {
//         Alert.alert("Error", "Failed to fetch albums");
//       }
//     } catch (error) {
//       console.error("Error fetching albums:", error);
//       Alert.alert("Error", "Failed to fetch albums");
//     }
//   };

//   useEffect(() => {
//     if (artistId) {
//       fetchAlbums();
//     }
//   }, [artistId]);

//   useEffect(() => {
//     if (soundRef.current) {
//       const interval = setInterval(() => {
//         soundRef.current.getCurrentTime((seconds) => {
//           setPlaybackPosition(seconds);
//         });
//       }, 1000);

//       return () => clearInterval(interval);
//     }
//   }, [currentPlaying]);

//   const playMusic = (fileUrl) => {
//     if (currentPlaying && soundRef.current) {
//       soundRef.current.stop(() => {
//         soundRef.current.release();
//       });
//     }

//     const sound = new Sound(fileUrl, null, (error) => {
//       if (error) {
//         console.error("Failed to load sound", error);
//         return;
//       }
//       setPlaybackDuration(sound.getDuration());
//       sound.play(() => {
//         sound.release();
//         setCurrentPlaying(null);
//         setIsPlaying(false);
//       });
//     });

//     soundRef.current = sound;
//     setCurrentPlaying(fileUrl);
//     setIsPlaying(true);
//   };

//   const pauseMusic = () => {
//     if (soundRef.current) {
//       soundRef.current.pause();
//       setIsPlaying(false);
//     }
//   };

//   const seekMusic = (value) => {
//     if (soundRef.current) {
//       soundRef.current.setCurrentTime(value);
//       setPlaybackPosition(value);
//     }
//   };

//   const renderAlbum = ({ item }) => {
//     return (
//       <View style={styles.albumCard}>
//         {item.cover ? (
//           <Image source={{ uri: item.cover }} style={styles.albumCover} />
//         ) : (
//           <View style={styles.albumCoverPlaceholder}>
//             <Text style={styles.albumCoverText}>{item.title[0]}</Text>
//           </View>
//         )}
//         <Text style={styles.albumTitle}>{item.title}</Text>
//         <FlatList
//           data={item.tracks}
//           keyExtractor={(track) => track.music_id.toString()}
//           renderItem={({ item: track }) => (
//             <View style={styles.trackCard}>
//               <Text style={styles.trackName}>{track.title}</Text>
//               <TouchableOpacity
//                 onPress={() =>
//                   currentPlaying === track.file_url && isPlaying
//                     ? pauseMusic()
//                     : playMusic(track.file_url)
//                 }
//               >
//                 <Text style={styles.playButtonText}>
//                   {currentPlaying === track.file_url && isPlaying ? "Pause" : "Play"}
//                 </Text>
//               </TouchableOpacity>
//               {currentPlaying === track.file_url && (
//                 <Slider
//                   style={styles.progressBar}
//                   minimumValue={0}
//                   maximumValue={playbackDuration}
//                   value={playbackPosition}
//                   onValueChange={seekMusic}
//                   minimumTrackTintColor="#2EF3DD"
//                   maximumTrackTintColor="#999"
//                   thumbTintColor="#2EF3DD"
//                 />
//               )}
//             </View>
//           )}
//         />
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={albums}
//         keyExtractor={(item) => item.album_id.toString()}
//         renderItem={renderAlbum}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#1a1a1a" },
//   albumCard: { marginBottom: 20, padding: 15, backgroundColor: "#3a3a3a", borderRadius: 10 },
//   albumCover: { width: "100%", height: 200, borderRadius: 10 },
//   albumCoverPlaceholder: { width: "100%", height: 200, justifyContent: "center", alignItems: "center", backgroundColor: "#555" },
//   albumCoverText: { fontSize: 24, fontWeight: "bold", color: "#fff" },
//   albumTitle: { marginTop: 10, fontSize: 20, color: "#fff", fontWeight: "bold" },
//   trackCard: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
//   trackName: { fontSize: 16, color: "#fff", flex: 1 },
//   playButtonText: { fontSize: 16, color: "#2EF3DD" },
//   progressBar: { flex: 1, marginHorizontal: 10 },
// });

// export default ArtistAlbums;


import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Image, Modal, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import TrackPlayer, { usePlaybackState, State as TrackPlayerState, useProgress } from "react-native-track-player";
import Slider from "@react-native-community/slider";
import trackPlayerSetup from '../player/trackPlayerSetup'; // Make sure to create this setup file




const ArtistAlbums = ({ artistId, profilePicture }) => {
  const BASE_URL = "https://api.exversio.com";
  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const playbackState = usePlaybackState();
  const progress = useProgress();

  useEffect(() => {
    if (artistId) {
      fetchAlbums();
    }
  }, [artistId]);

  useEffect(() => {
    trackPlayerSetup(); // Initialize track player
  }, []);

  const fetchAlbums = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/get-artist-albums`, {
        params: { artist_id: artistId },
      });
      if (response.data.success && Array.isArray(response.data.albums)) {
        setAlbums(response.data.albums);
      } else {
        Alert.alert("Error", "Failed to fetch albums");
      }
    } catch (error) {
      console.error("Error fetching albums:", error);
      Alert.alert("Error", "Failed to fetch albums");
    }
  };

  const fetchPlaylists = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
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

  const addMusicToPlaylist = async (playlistId, musicId) => {
    try {
      const response = await axios.post(`${BASE_URL}/add-music-to-playlist`, {
        playlist_id: playlistId,
        music_id: musicId,
      });
      if (response.data.success) {
        Alert.alert("Success", "Music added to playlist successfully!");
        setIsModalVisible(false);
      } else {
        Alert.alert("Error", response.data.message || "Failed to add music.");
      }
    } catch (error) {
      console.error("Error adding music to playlist:", error);
      Alert.alert("Error", "Failed to add music to playlist.");
    }
  };

  const playMusic = async (fileUrl) => {
    const completeUrl = fileUrl.startsWith("http") ? fileUrl : `${BASE_URL}${fileUrl}`;
    console.log("Playing music from URL:", completeUrl);
  
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: completeUrl, // Use completeUrl as the unique ID
        url: completeUrl,
        title: 'Track Title',
        artist: 'Artist Name',
        artwork: 'https://placekitten.com/300/300', // URL or local path to artwork
      });
      await TrackPlayer.play();
      setCurrentPlaying(completeUrl); // Update currentPlaying state
    } catch (error) {
      console.error("Error playing music:", error);
      Alert.alert("Error", "Failed to play music.");
    }
  };

  const pauseMusic = async () => {
    try {
      await TrackPlayer.pause();
      setCurrentPlaying(null); // Set currentPlaying to null when paused
    } catch (error) {
      console.error("Error pausing music:", error);
      Alert.alert("Error", "Failed to pause music.");
    }
  };

  const seekMusic = async (value) => {
    try {
      await TrackPlayer.seekTo(value);
    } catch (error) {
      console.error("Error seeking music:", error);
      Alert.alert("Error", "Failed to seek music.");
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleNavigateToMaximize = (track) => {
    // Implement navigation to a maximized view of the track if necessary
  };

  const renderTrack = (track) => {
    const completeUrl = track.file_url.startsWith("http") ? track.file_url : `${BASE_URL}${track.file_url}`;
    const isPlaying = currentPlaying === completeUrl;
  
    const handleSliderChange = async (value) => {
      try {
        await TrackPlayer.seekTo(value);
        if (!isPlaying) {
          await TrackPlayer.play();
        }
      } catch (error) {
        console.error('Error seeking music:', error);
        Alert.alert('Error', 'Failed to seek music.');
      }
    };
  
    return (
      <View style={styles.trackContainer}>
  <View style={styles.row}>
    {/* Track Cover Image */}
    <Image
      source={
        profilePicture
          ? { uri: profilePicture }
          : require("../../assets/profile/profile-image.jpg") // Default image
      }
      style={styles.trackAvatar}
    />

    {/* Track Info */}
    <View style={styles.info}>
      <Text style={styles.trackTitle} numberOfLines={1}>
        {track.title}
      </Text>
    </View>

    {/* Play/Pause Button */}
    <TouchableOpacity onPress={() => (isPlaying ? pauseMusic() : playMusic(completeUrl))}>
      <Image
        source={
          isPlaying
            ? require("../../assets/icons/icons8-pause-90.png") // Pause icon
            : require("../../assets/icons/211876_play_icon.png") // Play icon
        }
        style={[
          styles.playIcon, // Base style for both icons
          isPlaying ? styles.pauseIcon : styles.playIconSpecific, // Conditional styles
        ]}
      />
    </TouchableOpacity>

    {/* Maximize/Expand Button */}
    <TouchableOpacity onPress={() => {
            setSelectedMusic(track);
            fetchPlaylists();
            setIsModalVisible(true);
          }
            }>
      <Image source={require("../../assets/icons/plus.png")} style={styles.addToPlaylistText} />
    </TouchableOpacity>
  </View>

  {/* Progress Bar (if playing) */}
  {isPlaying && (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarWrapper}>
        <Text style={styles.time}>{formatTime(progress.position)}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={progress.duration}
          value={progress.position}
          onSlidingComplete={handleSliderChange}
          minimumTrackTintColor="#2EF3DD"
          maximumTrackTintColor="#999"
          thumbTintColor="#2EF3DD"
        />
      </View>
      <Text style={styles.timeRight}>{formatTime(progress.duration)}</Text>
    </View>
  )}
</View>
    );
  };

  const renderAlbum = ({ item }) => {
    return (
      <View style={styles.albumCard}>
        {item.cover ? (
          <Image source={{ uri: item.cover }} style={styles.albumCover} />
        ) : (
          <View style={styles.albumCoverPlaceholder}>
            <Text style={styles.albumCoverText}>{item.title[0]}</Text>
          </View>
        )}
        <Text style={styles.albumTitle}>{item.title}</Text>
        <FlatList
          data={item.tracks}
          keyExtractor={(track) => track.music_id.toString()}
          renderItem={({ item: track }) => renderTrack(track)}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <FlatList
          data={albums}
          keyExtractor={(item) => item.album_id.toString()}
          renderItem={renderAlbum}
          scrollEnabled={false} // Prevent conflict with ScrollView
        />
      </ScrollView>
  
      {/* Modal for selecting a playlist */}
      {isModalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select a Playlist</Text>
            <FlatList
              data={playlists}
              keyExtractor={(playlist) => playlist.playlist_id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.playlistItem}
                  onPress={() => addMusicToPlaylist(item.playlist_id, selectedMusic.music_id)}
                >
                  <Text style={styles.playlistName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  albumCard: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#3a3a3a",
    borderRadius: 10,
  },
  albumCover: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  albumCoverPlaceholder: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#555",
  },
  albumCoverText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  albumTitle: {
    marginTop: 10,
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  trackCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  trackName: {
    fontSize: 16,
    color: "#fff",
    flex: 1,
  },
  playButtonText: {
    fontSize: 16,
    color: "#2EF3DD",
  },
  addToPlaylistText: {
    fontSize: 16,
    color: "#FFA500",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalTitle: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 20,
  },
  playlistItem: {
    padding: 15,
    backgroundColor: "#3a3a3a",
    marginBottom: 10,
    borderRadius: 10,
  },
  playlistName: {
    fontSize: 16,
    color: "#fff",
  },
  closeModalText: {
    fontSize: 16,
    color: "#2EF3DD",
    marginTop: 20,
  },
  icon: {
    width: 20,
    height: 20,
  },
  trackContainer: {
    padding: 8,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: "#1C1C1E",
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  trackAvatar: {
    width: 40, // Smaller size
    height: 40,
    borderRadius: 4,
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  trackTitle: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  trackArtist: {
    color: "#888",
    fontSize: 12,
  },
  playIcon: {
    width: 16,
    height: 18,
    marginHorizontal: 8,
  },
  maximizeIcon: {
    width: 20,
    height: 20,
  },
  progressBarContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 5,
    width: '100%',
    
  },
  progressBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    
  },
  time: {
    fontSize: 12,
    color: '#FFF',
    position: 'absolute',
    left: 0,
    top: '100%',
    
    
  },
  timeRight: {
    fontSize: 12,
    color: '#FFF',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  slider: {
    flex: 1,
    height: 40,
    marginLeft: 35, // Adjust this margin to position the slider correctly
  },
  progress: {
    flex: 1,
    height: 3,
    backgroundColor: "#444",
    borderRadius: 2,
    marginHorizontal: 5,
  },
  progressFill: {
    height: 3,
    backgroundColor: "#2EF3DD",
    borderRadius: 2,
  },
  pauseIcon: {
    width: 20,
    height: 20,
  },
});

export default ArtistAlbums;
