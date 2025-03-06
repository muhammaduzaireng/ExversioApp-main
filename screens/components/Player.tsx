import React, { useEffect, useState, useRef } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, PanResponder } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { usePlayer } from "../../screens/components/PlayerContext";
import TrackPlayer, { State as TrackPlayerState } from "react-native-track-player";

const Player = () => {
  const {
    currentMusic,
    progress,
    duration,
    setIsPlaying, // Global state setter
    playlist,
    currentMusicIndex,
    artistName,
    profilePicture,
    isPlaying, // Global state
  } = usePlayer();
  const navigation = useNavigation();

  const [isLocalPlaying, setLocalIsPlaying] = useState(isPlaying); // Local state to manage play/pause status
  const [visible, setVisible] = useState(true); // To control the visibility of the player
  const pan = useRef(new Animated.ValueXY()).current; // Pan responder value

  // Sync local state with global state
  useEffect(() => {
    setLocalIsPlaying(isPlaying);
    if (isPlaying) {
      setVisible(true); // Show the player when music is playing
    }
  }, [isPlaying]);

  // Track player state listener
  useEffect(() => {
    const checkTrackState = async () => {
      const state = await TrackPlayer.getState();
      const isCurrentlyPlaying = state === TrackPlayerState.Playing;
      setLocalIsPlaying(isCurrentlyPlaying);
      setIsPlaying(isCurrentlyPlaying);
    };

    // Set the interval to check the player state every 200ms to reflect the change
    const interval = setInterval(checkTrackState, 200);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handlePlayPause = async () => {
    if (isLocalPlaying) {
      await TrackPlayer.pause();
      console.log("Music paused.");
    } else {
      await TrackPlayer.play();
      console.log("Music resumed.");
    }
    setLocalIsPlaying(!isLocalPlaying);
    setIsPlaying(!isLocalPlaying); // Update global state
  };

  const handleNavigateToMaximize = () => {
    navigation.navigate("PlayerMaximize", {
      playlist,
      currentMusicIndex,
    });
  };

  const handlePanResponderRelease = async (evt, gestureState) => {
    if (gestureState.dy > 50) { // Swipe down detected
      await TrackPlayer.pause();
      setVisible(false); // Hide the player
    }
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: Animated.event(
        [null, { dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: handlePanResponderRelease,
    })
  ).current;

  if (!currentMusic || !visible) {
    return null;
  }
console.log("currentMusic", currentMusic)
  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[styles.container, { transform: pan.getTranslateTransform() }]}
    >
      <TouchableOpacity onPress={handleNavigateToMaximize}>
        <View style={styles.row}>
          <Image
            source={
              profilePicture
                ? { uri: profilePicture }
                : require("../../assets/profile/profile-image.jpg")
            }
            style={styles.avatar}
          />
          <View style={styles.info}>
            <Text style={styles.title}>{currentMusic?.title || "No Music Playing"}</Text>
            {artistName && (
              <Text style={styles.artist}>{artistName}</Text>
            )}
          </View>
          <TouchableOpacity onPress={handlePlayPause}>
            <Image
              source={
                isLocalPlaying
                  ? require("../../assets/icons/icons8-pause-90.png")
                  : require("../../assets/icons/211876_play_icon.png")
              }
              style={styles.playIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.progressBar}>
          <Text style={styles.time}>{formatTime(progress)}</Text>
          <View style={styles.progress}>
            <View style={{ ...styles.progressFill, width: `${(progress / duration) * 100}%` }} />
          </View>
          <Text style={styles.time}>{formatTime(duration)}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
    borderBottomColor: '#333',
    backgroundColor: '#1E1E1E',
    zIndex: 100,
  },
  row: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 40, height: 40, borderRadius: 25, marginHorizontal: 10 },
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