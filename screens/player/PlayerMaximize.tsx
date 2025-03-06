import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import playerMaximizeStyles from "../../styles/playerMaximizeStyles";
import { useNavigation } from "@react-navigation/native";
import { usePlayer } from "../../screens/components/PlayerContext";
import TrackPlayer, { useProgress, State as TrackPlayerState } from "react-native-track-player";
import Slider from "@react-native-community/slider";

const PlayerMaximize = () => {
  const navigation = useNavigation();
  const {
    currentMusic,
    playlist,
    currentMusicIndex,
    isPlaying,
    setCurrentMusic,
    setCurrentMusicIndex,
    setIsPlaying,
    artistName,
  } = usePlayer();

  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);

  const progress = useProgress();

  useEffect(() => {
    console.log("PlayerMaximize Loaded:", {
      currentMusic,
      currentMusicIndex,
      playlist,
      artistName,
    });

    return () => {
      // No need to reset TrackPlayer here, as the PlayerContext will manage the player state
    };
  }, [currentMusic, currentMusicIndex]);

  useEffect(() => {
    const updateIsPlaying = async () => {
      const playbackState = await TrackPlayer.getState();
      setIsPlaying(playbackState === TrackPlayerState.Playing);
    };

    updateIsPlaying();
  }, [isPlaying]);

  const handlePlayPause = async () => {
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
    setIsPlaying(!isPlaying); // Update global state
  };

  const handleNext = async () => {
    const nextIndex = shuffle
      ? Math.floor(Math.random() * playlist.length)
      : currentMusicIndex + 1;

    if (nextIndex < playlist.length) {
      const nextMusic = playlist[nextIndex];
      setCurrentMusic(nextMusic);
      setCurrentMusicIndex(nextIndex);
      await TrackPlayer.skip(nextMusic.file_url);
      await TrackPlayer.play();
    } else {
      console.log("End of playlist.");
    }
  };

  const handlePrevious = async () => {
    const prevIndex = currentMusicIndex - 1;

    if (prevIndex >= 0) {
      const prevMusic = playlist[prevIndex];
      setCurrentMusic(prevMusic);
      setCurrentMusicIndex(prevIndex);
      await TrackPlayer.skip(prevMusic.file_url);
      await TrackPlayer.play();
    } else {
      console.log("No previous music available.");
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleSliderChange = async (value) => {
    await TrackPlayer.seekTo(value);
  };

  return (
    <View style={playerMaximizeStyles.container}>
      <View style={playerMaximizeStyles.mainContainer}>
        <View style={playerMaximizeStyles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={playerMaximizeStyles.backButton}>← Back</Text>
          </TouchableOpacity>
        </View>

        <View style={playerMaximizeStyles.songInfoContainer}>
          <Text style={playerMaximizeStyles.songName}>
            {currentMusic?.title || "Unknown Song"}
          </Text>
          <Text style={playerMaximizeStyles.artistName}>
            {artistName}
          </Text>
        </View>

        <View style={playerMaximizeStyles.albumArtContainer}>
          <Image
            source={
              currentMusic?.cover_url
                ? { uri: currentMusic.cover_url }
                : require("../../assets/cover/music.jpg")
            }
            style={playerMaximizeStyles.albumArt}
          />
        </View>

        <View style={playerMaximizeStyles.controlsContainer}>
          <View style={playerMaximizeStyles.progressContainer}>
            <Text style={playerMaximizeStyles.time}>{formatTime(progress.position)}</Text>
            <Slider
              style={playerMaximizeStyles.slider}
              minimumValue={0}
              maximumValue={progress.duration}
              value={progress.position}
              onSlidingComplete={handleSliderChange}
              minimumTrackTintColor="#2EF3DD"
              maximumTrackTintColor="#fff"
              thumbTintColor="#2EF3DD"
            />
            <Text style={playerMaximizeStyles.time}>{formatTime(progress.duration)}</Text>
          </View>

          <View style={playerMaximizeStyles.controlButtonsContainer}>
            <TouchableOpacity onPress={() => setShuffle(!shuffle)}>
              <Image
                source={require("../../assets/icons/216094_shuffle_arrow_icon.png")}
                style={[
                  playerMaximizeStyles.controlIcon,
                  shuffle && { tintColor: "#2EF3DD" },
                ]}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePrevious}>
              <Image
                source={require("../../assets/icons/moveback.png")}
                style={playerMaximizeStyles.controlIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePlayPause}>
              <Image
                source={
                  isPlaying
                    ? require("../../assets/icons/icons8-pause-90.png")
                    : require("../../assets/icons/211876_play_icon.png")
                }
                style={playerMaximizeStyles.playIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNext}>
              <Image
                source={require("../../assets/icons/movenext.png")}
                style={playerMaximizeStyles.controlIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setRepeat(!repeat)}>
              <Image
                source={require("../../assets/icons/9054844_bx_repeat_icon.png")}
                style={[
                  playerMaximizeStyles.controlIcon,
                  repeat && { tintColor: "#2EF3DD" },
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PlayerMaximize;