import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { usePlayer } from "../../screens/components/PlayerContext";

const Player = () => {
  const {
    currentMusic,
    isPlaying,
    progress,
    duration,
    soundRef,
    setIsPlaying,
    playlist,
    currentMusicIndex,
  } = usePlayer();
  const navigation = useNavigation();

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handlePlayPause = () => {
    if (soundRef.current) {
      if (isPlaying) {
        // Pause music
        soundRef.current.pause();
        console.log("Music paused globally.");
      } else {
        // Resume music
        soundRef.current.play((success) => {
          if (success) {
            console.log("Music resumed globally.");
          } else {
            console.error("Failed to resume music.");
          }
        });
      }
      // Toggle the play/pause state
      setIsPlaying(!isPlaying);
    } else {
      console.error("soundRef.current is not initialized.");
    }
  };

  const handleNavigateToMaximize = () => {
    navigation.navigate("PlayerMaximize", {
      playlist,
      currentMusicIndex,
    });
  };

  // Hide Player if no music is playing
  if (!currentMusic) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image
          source={
            currentMusic?.cover_url
              ? { uri: currentMusic.cover_url }
              : require("../../assets/profile/profile-image.jpg")
          }
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.title}>{currentMusic?.music_title || "No Music Playing"}</Text>
        </View>
        <TouchableOpacity onPress={handlePlayPause}>
          <Image
            source={
              isPlaying
                ? require("../../assets/icons/icons8-pause-90.png")
                : require("../../assets/icons/211876_play_icon.png")
            }
            style={styles.playIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNavigateToMaximize}>
          <Image source={require("../../assets/icons/maximize.png")} style={styles.maximizeIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.progressBar}>
        <Text style={styles.time}>{formatTime(progress)}</Text>
        <View style={styles.progress}>
          <View style={{ ...styles.progressFill, width: `${(progress / duration) * 100}%` }} />
        </View>
        <Text style={styles.time}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative', // Use relative positioning unless absolute is required
    width: '100%',
    marginBottom: 90,
    backgroundColor: '#1E1E1E',
    borderTopWidth: 1,
   paddingTop: 10,
  },
  row: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 50, height: 50, borderRadius: 25, marginHorizontal: 10 },
  info: { flex: 1, marginHorizontal: 10 },
  title: { fontSize: 16, color: "#fff", fontWeight: "bold" },
  artist: { fontSize: 14, color: "#aaa" },
  playIcon: { width: 18, height: 20, tintColor: "#fff", margin: 10 },
  maximizeIcon: { width: 18, height: 18, tintColor: "#fff" },
  progressBar: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  time: { fontSize: 12, color: "#aaa", marginHorizontal: 10 },
  progress: { flex: 1, height: 5, backgroundColor: "#555", borderRadius: 2.5 },
  progressFill: { height: "100%", backgroundColor: "#2EF3DD" },
});

export default Player;
