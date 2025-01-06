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


import React, { useState, useEffect, useRef } from "react";
import { useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Image,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Sound from "react-native-sound";
import Slider from "@react-native-community/slider";

const ArtistAlbums = () => {
  const route = useRoute();
  const { artistId } = route.params || {};
  console.log("Received artistId:", artistId);

  const BASE_URL = "https://api.exversio.com";
  const [albums, setAlbums] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const soundRef = useRef(null);

  // Fetch Albums for the provided artistId
  const fetchAlbums = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/get-artist-albums`, {
        params: { artist_id: artistId },
      });
      if (response.data.success && Array.isArray(response.data.albums)) {
        setAlbums(response.data.albums);
        console.log("Albums response:", response.data.albums);
      } else {
        Alert.alert("Error", "Failed to fetch albums");
      }
    } catch (error) {
      console.error("Error fetching albums:", error);
      Alert.alert("Error", "Failed to fetch albums");
    }
  };

  // Fetch all available playlists for the user
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

  // Add music to the selected playlist
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

  useEffect(() => {
    if (artistId) {
      fetchAlbums();
    }
  }, [artistId]);

  useEffect(() => {
    if (soundRef.current) {
      const interval = setInterval(() => {
        soundRef.current.getCurrentTime((seconds) => {
          setPlaybackPosition(seconds);
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentPlaying]);

  const playMusic = (fileUrl) => {
    const completeUrl = fileUrl.startsWith("http")
      ? fileUrl
      : `${BASE_URL}${fileUrl}`;
    console.log("Playing music from URL:", completeUrl);
  
    if (currentPlaying && soundRef.current) {
      soundRef.current.stop(() => {
        soundRef.current.release();
      });
    }
  
    const sound = new Sound(completeUrl, null, (error) => {
      if (error) {
        console.error("Failed to load sound", error);
        Alert.alert("Error", "Failed to load sound.");
        return;
      }
      setPlaybackDuration(sound.getDuration());
      sound.play(() => {
        sound.release();
        setCurrentPlaying(null);
        setIsPlaying(false);
      });
    });
  
    soundRef.current = sound;
    setCurrentPlaying(fileUrl);
    setIsPlaying(true);
  };
  

  const pauseMusic = () => {
    if (soundRef.current) {
      soundRef.current.pause();
      setIsPlaying(false);
    }
  };

  const seekMusic = (value) => {
    if (soundRef.current) {
      soundRef.current.setCurrentTime(value);
      setPlaybackPosition(value);
    }
  };

  const renderTrack = (track) => {
    console.log("Rendering track:", track.file_url);
    return (
      <View style={styles.trackCard}>
        <Text style={styles.trackName}>{track.title}</Text>
        <TouchableOpacity
          onPress={() =>
            currentPlaying === track.file_url && isPlaying
              ? pauseMusic()
              : playMusic(track.file_url)
          }
        >
          <Text style={styles.playButtonText}>
            {currentPlaying === track.file_url && isPlaying ? "Pause" : "Play"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelectedMusic(track);
            fetchPlaylists();
            setIsModalVisible(true);
          }}
        >
          <Text style={styles.addToPlaylistText}>Add to Playlist</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderAlbum = ({ item }) => {
    console.log("Rendering album:", item);
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
      <FlatList
        data={albums}
        keyExtractor={(item) => item.album_id.toString()}
        renderItem={renderAlbum}
      />

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
  container: { flex: 1, padding: 20, backgroundColor: "#1a1a1a" },
  albumCard: { marginBottom: 20, padding: 15, backgroundColor: "#3a3a3a", borderRadius: 10 },
  albumCover: { width: "100%", height: 200, borderRadius: 10 },
  albumCoverPlaceholder: { width: "100%", height: 200, justifyContent: "center", alignItems: "center", backgroundColor: "#555" },
  albumCoverText: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  albumTitle: { marginTop: 10, fontSize: 20, color: "#fff", fontWeight: "bold" },
  trackCard: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  trackName: { fontSize: 16, color: "#fff", flex: 1 },
  playButtonText: { fontSize: 16, color: "#2EF3DD" },
  addToPlaylistText: { fontSize: 16, color: "#FFA500" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.8)" },
  modalTitle: { fontSize: 20, color: "#fff", marginBottom: 20 },
  playlistItem: { padding: 15, backgroundColor: "#3a3a3a", marginBottom: 10, borderRadius: 10 },
  playlistName: { fontSize: 16, color: "#fff" },
  closeModalText: { fontSize: 16, color: "#2EF3DD", marginTop: 20 },
});

export default ArtistAlbums;
