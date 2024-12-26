// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Modal,
//   Alert,
// } from "react-native";
// import storage from "@react-native-firebase/storage";
// import DocumentPicker from "react-native-document-picker";
// import axios from "axios";

// const MusicLibraryPage = () => {
//   const BASE_URL = "https://api.exversio.com:3001"; // Replace with your server's correct IP and port

//   const [allTracks, setAllTracks] = useState([]); // All music fetched from server
//   const [isMusicModalVisible, setIsMusicModalVisible] = useState(false);
//   const [newMusic, setNewMusic] = useState({
//     title: "",
//     type: "",
//     fileUri: "",
//   });

//   // Upload music to Firebase Storage and save metadata to backend
//   const uploadMusic = async () => {
//     const { title, type } = newMusic;
  
//     if (!title.trim() || !type.trim()) {
//       Alert.alert("Validation Error", "Please provide a title and type for the music.");
//       return;
//     }
  
//     try {
//       const res = await DocumentPicker.pick({
//         type: [DocumentPicker.types.audio],
//       });
  
//       console.log("Picked file:", res);
  
//       const fileUri = res[0].uri;
//       const fileName = res[0].name;
//       const fileType = res[0].type;
  
//       const formData = new FormData();
//       formData.append("title", title);
//       formData.append("type", type);
//       formData.append("file", {
//         uri: fileUri,
//         name: fileName,
//         type: fileType,
//       });
  
//       console.log("FormData:", formData);
  
//       const response = await axios.post(`${BASE_URL}/upload-music`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
  
//       console.log("Upload successful:", response.data);
//       Alert.alert("Success", "Music uploaded successfully!");
//     } catch (error) {
//       console.error("Error uploading music:", error);
//       Alert.alert("Upload Error", "Failed to upload music. Please try again.");
//     }
//   };
  
  
  

//   // Save metadata to your backend
//   const saveMusicMetadata = async (downloadURL, title, type) => {
//     try {
//       const response = await axios.post(`${BASE_URL}/save-music`, {
//         title,
//         type,
//         file_url: downloadURL,
//       });
//       console.log("Music metadata saved:", response.data);
//       Alert.alert("Success", "Music uploaded and metadata saved successfully!");
//     } catch (error) {
//       console.error("Error saving metadata:", error);
//       Alert.alert("Database Error", "Failed to save music metadata.");
//     }
//   };

//   // Fetch all music from the backend
//   const fetchMusic = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/music`);
//       console.log("Fetched music:", response.data);
//       setAllTracks(response.data);
//     } catch (error) {
//       console.error("Error fetching music:", error);
//       Alert.alert("Error", "Failed to fetch music.");
//     }
//   };

//   useEffect(() => {
//     fetchMusic(); // Fetch music on component mount
//   }, []);

//   // Render each track
//   const renderTrack = ({ item }) => (
//     <View style={styles.trackCard}>
//       <Text style={styles.trackName}>Title: {item.title}</Text>
//       <Text style={styles.trackType}>Type: {item.type}</Text>
//       <Text style={styles.trackURL}>File URL: {item.file_url}</Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Music Library</Text>

//       <TouchableOpacity
//         style={styles.addMusicButton}
//         onPress={() => setIsMusicModalVisible(true)}
//       >
//         <Text style={styles.addMusicButtonText}>Add Music</Text>
//       </TouchableOpacity>

//       {/* Render fetched music */}
//       <FlatList
//         data={allTracks}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderTrack}
//       />

//       {/* Modal for adding music */}
//       <Modal visible={isMusicModalVisible} transparent={true} animationType="slide">
//         <View style={styles.modalContainer}>
//           <Text style={styles.modalTitle}>Add Music</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Music Title"
//             value={newMusic.title}
//             onChangeText={(text) => setNewMusic({ ...newMusic, title: text })}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Type of Music (e.g., Rock, Pop)"
//             value={newMusic.type}
//             onChangeText={(text) => setNewMusic({ ...newMusic, type: text })}
//           />
//           <TouchableOpacity style={styles.saveButton} onPress={uploadMusic}>
//             <Text style={styles.saveButtonText}>Upload Music</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.cancelButton}
//             onPress={() => setIsMusicModalVisible(false)}
//           >
//             <Text style={styles.cancelButtonText}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#1a1a1a",
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#fff",
//     marginBottom: 20,
//   },
//   addMusicButton: {
//     backgroundColor: "#2EF3DD",
//     padding: 15,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   addMusicButtonText: {
//     fontSize: 16,
//     color: "#000",
//     fontWeight: "bold",
//   },
//   trackCard: {
//     padding: 15,
//     backgroundColor: "#3a3a3a",
//     borderRadius: 10,
//     marginBottom: 15,
//   },
//   trackName: {
//     color: "#fff",
//     fontSize: 16,
//     marginBottom: 5,
//     fontWeight: "bold",
//   },
//   trackType: {
//     color: "#bbb",
//     fontSize: 14,
//   },
//   trackURL: {
//     color: "#88f",
//     fontSize: 12,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.7)",
//     padding: 20,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#fff",
//     marginBottom: 20,
//   },
//   input: {
//     width: "100%",
//     padding: 15,
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     marginBottom: 15,
//   },
//   saveButton: {
//     backgroundColor: "#2EF3DD",
//     padding: 15,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   saveButtonText: {
//     fontSize: 16,
//     color: "#000",
//     fontWeight: "bold",
//   },
//   cancelButton: {
//     backgroundColor: "#FF5C5C",
//     padding: 15,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   cancelButtonText: {
//     fontSize: 16,
//     color: "#fff",
//     fontWeight: "bold",
//   },
// });

// export default MusicLibraryPage;


// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   FlatList,
//   Modal,
//   Alert,
// } from "react-native";
// import DocumentPicker from "react-native-document-picker";
// import axios from "axios";
// import Sound from "react-native-sound";

// const AudioFileUpload = () => {
//   const BASE_URL = "https://api.exversio.com:3000"; // Replace with your backend server URL
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [musicList, setMusicList] = useState([]); // List of available music files
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   // Select Audio File
//   const selectAudioFile = async () => {
//     try {
//       const res = await DocumentPicker.pick({
//         type: [DocumentPicker.types.audio],
//       });
//       setSelectedFile(res[0]);
//     } catch (err) {
//       if (DocumentPicker.isCancel(err)) {
//         console.log("File selection canceled.");
//       } else {
//         console.error("Error selecting file:", err);
//       }
//     }
//   };

//   // Upload Audio File
//   const uploadAudioFile = async () => {
//     if (!selectedFile) {
//       Alert.alert("Error", "No file selected. Please select an audio file first.");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("file", {
//         uri: selectedFile.uri,
//         name: selectedFile.name,
//         type: selectedFile.type,
//       });
//       formData.append("title", "Example Title");
//       formData.append("type", "Example Type");

//       const response = await axios.post(`${BASE_URL}/upload-music`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       console.log("File uploaded successfully:", response.data);
//       Alert.alert("Success", "File uploaded successfully!");
//       setSelectedFile(null);
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       Alert.alert("Upload Error", "Failed to upload the file. Please try again.");
//     }
//   };

//   // Fetch Available Music Files
//   const fetchMusicFiles = async () => {
//     try {
//       const response = await axios.get(`${BASE_URL}/music`);
//       setMusicList(response.data); // Update music list
//     } catch (error) {
//       console.error("Error fetching music files:", error);
//     }
//   };

//   // Play Selected Music File
//   const playMusic = (fileUrl) => {
//     const sound = new Sound(fileUrl, null, (error) => {
//       if (error) {
//         console.error("Failed to load sound", error);
//         return;
//       }
//       sound.play(() => {
//         sound.release(); // Release the sound resource after playback
//         console.log("Playback finished.");
//       });
//     });
//   };

//   // Open Modal and Fetch Music Files
//   const openPlayMusicModal = () => {
//     fetchMusicFiles(); // Fetch the list of music files
//     setIsModalVisible(true);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Audio File Upload</Text>

//       {/* Select Audio File */}
//       <TouchableOpacity style={styles.selectButton} onPress={selectAudioFile}>
//         <Text style={styles.buttonText}>Select Audio File</Text>
//       </TouchableOpacity>

//       {/* Show Selected File */}
//       {selectedFile && (
//         <Text style={styles.selectedFileText}>
//           Selected: {selectedFile.name}
//         </Text>
//       )}

//       {/* Upload Audio File */}
//       <TouchableOpacity
//         style={styles.uploadButton}
//         onPress={uploadAudioFile}
//         disabled={!selectedFile}
//       >
//         <Text style={styles.buttonText}>
//           {selectedFile ? "Upload Audio File" : "No File Selected"}
//         </Text>
//       </TouchableOpacity>

//       {/* Play Music Button */}
//       <TouchableOpacity style={styles.playButton} onPress={openPlayMusicModal}>
//         <Text style={styles.buttonText}>Play Music</Text>
//       </TouchableOpacity>

//       {/* Modal to Show Available Music Files */}
//       <Modal visible={isModalVisible} transparent={true} animationType="slide">
//         <View style={styles.modalContainer}>
//           <Text style={styles.modalTitle}>Available Music</Text>
//           <FlatList
//             data={musicList}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 style={styles.musicItem}
//                 onPress={() => {
//                   playMusic(item.file_url);
//                   setIsModalVisible(false); // Close modal after selection
//                 }}
//               >
//                 <Text style={styles.musicTitle}>{item.title}</Text>
//               </TouchableOpacity>
//             )}
//           />
//           <TouchableOpacity
//             style={styles.closeButton}
//             onPress={() => setIsModalVisible(false)}
//           >
//             <Text style={styles.closeButtonText}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#1a1a1a",
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#fff",
//     marginBottom: 20,
//   },
//   selectButton: {
//     backgroundColor: "#2EF3DD",
//     padding: 15,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   uploadButton: {
//     backgroundColor: "#4CAF50",
//     padding: 15,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   playButton: {
//     backgroundColor: "#FFA500",
//     padding: 15,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   buttonText: {
//     fontSize: 16,
//     color: "#000",
//     fontWeight: "bold",
//   },
//   selectedFileText: {
//     color: "#fff",
//     marginBottom: 20,
//     fontSize: 16,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.8)",
//     padding: 20,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#fff",
//     marginBottom: 20,
//   },
//   musicItem: {
//     backgroundColor: "#2EF3DD",
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   musicTitle: {
//     fontSize: 16,
//     color: "#000",
//     fontWeight: "bold",
//   },
//   closeButton: {
//     backgroundColor: "#FF5C5C",
//     padding: 10,
//     borderRadius: 10,
//     marginTop: 20,
//   },
//   closeButtonText: {
//     fontSize: 16,
//     color: "#fff",
//   },
// });

// export default AudioFileUpload;


import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
  Alert,
  Image,
} from "react-native";
import DocumentPicker from "react-native-document-picker";
import * as ImagePicker from "react-native-image-picker";
import axios from "axios";
import Sound from "react-native-sound";
// import ProgressCircle from "react-native-progress-circle";
import Slider from "@react-native-community/slider";
import CircularProgress from "../components/CircularProgress";
import AsyncStorage from '@react-native-async-storage/async-storage';


const MusicApp = () => {
  const BASE_URL = "https://api.exversio.com:3000"; // Replace with your server's URL
  const [albums, setAlbums] = useState([]);
  const [isAlbumModalVisible, setIsAlbumModalVisible] = useState(false);
  const [newAlbum, setNewAlbum] = useState({ title: "", cover: null });
  const [isMusicModalVisible, setIsMusicModalVisible] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [newMusic, setNewMusic] = useState({
    title: "",
    type: "",
    file: null,
    cover: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const soundRef = useRef(null);

  // Fetch Albums
  const fetchAlbums = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/albums`);
      setAlbums(response.data);
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

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

  // Select Image
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

  // Create Album
 

  const createAlbum = async () => {
    if (!newAlbum.title.trim()) {
      Alert.alert("Validation Error", "Album title is required.");
      return;
    }
  
    try {
      const artistId = await AsyncStorage.getItem('artistId'); // Fetch artist_id from AsyncStorage
  
      if (!artistId) {
        Alert.alert("Error", "Artist ID not found. Please log in as an artist.");
        return;
      }
  
      const formData = new FormData();
      formData.append("title", newAlbum.title);
      formData.append("artist_id", artistId); // Add artist_id to formData
  
      if (newAlbum.cover) {
        formData.append("cover", {
          uri: newAlbum.cover,
          name: `cover-${Date.now()}.jpg`,
          type: "image/jpeg",
        });
      }
  
      await axios.post(`${BASE_URL}/create-album`, formData, {
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
  
  // Add Music
  const addMusic = async () => {
    const { title, type, file, cover } = newMusic;
  
    if (!title.trim() || !file) {
      Alert.alert("Validation Error", "Music title and file are required.");
      return;
    }
  
    try {
      const artistId = await AsyncStorage.getItem('artistId'); // Fetch artist_id from AsyncStorage
  
      if (!artistId) {
        Alert.alert("Error", "Artist ID not found. Please log in as an artist.");
        return;
      }
  
      const formData = new FormData();
      formData.append("album_id", selectedAlbumId);
      formData.append("artist_id", artistId); // Add artist_id to formData
      formData.append("title", title);
      formData.append("type", type);
      formData.append("file", {
        uri: file.uri,
        name: file.name,
        type: file.type,
      });
  
      if (cover) {
        formData.append("cover", {
          uri: cover,
          name: `cover-${Date.now()}.jpg`,
          type: "image/jpeg",
        });
      }
  
      await axios.post(`${BASE_URL}/add-music`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
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
  

  // Play Music
  const playMusic = (fileUrl) => {
    if (currentPlaying && soundRef.current) {
      soundRef.current.stop(() => {
        soundRef.current.release();
      });
    }

    const sound = new Sound(fileUrl, null, (error) => {
      if (error) {
        console.error("Failed to load sound", error);
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

  const renderAlbum = ({ item }) => (
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
        renderItem={({ item: track }) => (
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
            {currentPlaying === track.file_url && (
              <Slider
                style={styles.progressBar}
                minimumValue={0}
                maximumValue={playbackDuration}
                value={playbackPosition}
                onValueChange={(value) => {
                  if (soundRef.current) {
                    soundRef.current.setCurrentTime(value);
                  }
                }}
              />
            )}
          </View>
        )}
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

      {/* Album Modal */}
      <Modal visible={isAlbumModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.input}
            placeholder="Album Title"
            value={newAlbum.title}
            onChangeText={(text) => setNewAlbum({ ...newAlbum, title: text })}
          />
          <TouchableOpacity onPress={() => selectImage((uri) => setNewAlbum({ ...newAlbum, cover: uri }))}>
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

      {/* Music Modal */}
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
          <TouchableOpacity onPress={() => selectImage((uri) => setNewMusic({ ...newMusic, cover: uri }))}>
            <Text style={styles.coverButtonText}>Select Cover Image</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              DocumentPicker.pick({ type: [DocumentPicker.types.audio] }).then((res) =>
                setNewMusic({ ...newMusic, file: res[0] })
              )
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#1a1a1a" },
  createAlbumButton: { backgroundColor: "#2EF3DD", padding: 15, borderRadius: 10, alignItems: "center" },
  createAlbumButtonText: { fontSize: 16, fontWeight: "bold", color: "#000" },
  albumCard: { marginBottom: 20, padding: 15, backgroundColor: "#3a3a3a", borderRadius: 10 },
  albumCover: { width: "100%", height: 200, borderRadius: 10 },
  albumCoverPlaceholder: { width: "100%", height: 200, justifyContent: "center", alignItems: "center", backgroundColor: "#555" },
  albumCoverText: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  albumTitle: { marginTop: 10, fontSize: 20, color: "#fff", fontWeight: "bold" },
  trackCard: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  trackName: { fontSize: 16, color: "#fff", flex: 1 },
  playButtonText: { fontSize: 16, color: "#2EF3DD" },
  addMusicButton: { backgroundColor: "#FFA500", padding: 10, borderRadius: 10, alignItems: "center" },
  addMusicButtonText: { fontSize: 16, color: "#000", fontWeight: "bold" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.8)", padding: 20 },
  input: { width: "100%", padding: 15, backgroundColor: "#fff", borderRadius: 10, marginBottom: 15 },
  coverButtonText: { fontSize: 16, color: "#2EF3DD", marginBottom: 10 },
  saveButtonText: { fontSize: 16, fontWeight: "bold", color: "#2EF3DD" },
  doneButtonText: { fontSize: 16, fontWeight: "bold", color: "#2EF3DD" },
  progressBar: { flex: 1, marginHorizontal: 10 },
});

export default MusicApp;









