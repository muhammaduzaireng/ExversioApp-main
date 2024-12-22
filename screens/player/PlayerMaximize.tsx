import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import playerMaximizeStyles from "../../styles/playerMaximizeStyles";
import { useNavigation } from "@react-navigation/native";
import { usePlayer } from "../../screens/components/PlayerContext";
import Sound from "react-native-sound";

const PlayerMaximize = () => {
  const navigation = useNavigation();
  const {
    currentMusic,
    playlist,
    currentMusicIndex,
    isPlaying,
    pauseMusic,
    resumeMusic,
    progress,
    duration,
    soundRef,
    setCurrentMusic,
    setCurrentMusicIndex,
    setIsPlaying,
    setProgress,
    setDuration,
  } = usePlayer();

  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);

  useEffect(() => {
    console.log("PlayerMaximize Loaded:", {
      currentMusic,
      currentMusicIndex,
      playlist,
    });

    // Sync progress and duration on mount
    if (soundRef.current) {
      soundRef.current.getCurrentTime((time) => setProgress(time || 0));
      setDuration(soundRef.current.getDuration());
    }

    return () => {
      if (soundRef?.current) {
        soundRef.current.stop();
      }
    };
  }, [currentMusic, currentMusicIndex]);

  useEffect(() => {
    let interval = null;
    if (isPlaying && soundRef?.current) {
      interval = setInterval(() => {
        soundRef.current.getCurrentTime((time) => {
          setProgress(time || 0);
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

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
  
  
  const playMusic = (fileUrl) => {
    if (soundRef.current) {
      soundRef.current.stop(() => {
        soundRef.current.release();
      });
    }
  
    soundRef.current = new Sound(fileUrl, null, (error) => {
      if (error) {
        console.error("Failed to load sound", error);
        return;
      }
      setDuration(soundRef.current.getDuration());
      setProgress(0);
      setIsPlaying(true);
  
      soundRef.current.play((success) => {
        if (success) {
          console.log("Playback completed.");
          setIsPlaying(false);
        } else {
          console.error("Playback failed.");
        }
      });
    });
  };
  
  

  const handleNext = () => {
    const nextIndex = shuffle
      ? Math.floor(Math.random() * playlist.length)
      : currentMusicIndex + 1;

    if (nextIndex < playlist.length) {
      const nextMusic = playlist[nextIndex];
      setCurrentMusic(nextMusic);
      setCurrentMusicIndex(nextIndex);
      loadMusic(nextMusic.file_url);
    } else {
      console.log("End of playlist.");
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentMusicIndex - 1;

    if (prevIndex >= 0) {
      const prevMusic = playlist[prevIndex];
      setCurrentMusic(prevMusic);
      setCurrentMusicIndex(prevIndex);
      loadMusic(prevMusic.file_url);
    } else {
      console.log("No previous music available.");
    }
  };

  const loadMusic = (url) => {
    if (!url) {
      console.error("No URL provided for music.");
      return;
    }

    if (soundRef?.current) {
      soundRef.current.stop(() => {
        soundRef.current.release();
        soundRef.current = new Sound(url, null, (error) => {
          if (error) {
            console.error("Failed to load music:", error);
            return;
          }
          setDuration(soundRef.current.getDuration());
          setProgress(0);
          setIsPlaying(true);
          soundRef.current.play(() => {
            console.log("Playback started.");
          });
        });
      });
    }
  };

  const handleCompletion = () => {
    if (repeat) {
      loadMusic(currentMusic.file_url);
    } else {
      handleNext();
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <View style={playerMaximizeStyles.container}>
      <View style={playerMaximizeStyles.mainContainer}>
        <View style={playerMaximizeStyles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require("../../assets/icons/3994400_arrow_forward_navigation_next_right_icon.png")}
              style={playerMaximizeStyles.backIcon}
            />
          </TouchableOpacity>
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

        <View style={playerMaximizeStyles.songInfoContainer}>
          <Text style={playerMaximizeStyles.songName}>
            {currentMusic?.music_title || "Unknown Song"}
          </Text>
          <Text style={playerMaximizeStyles.artistName}>
            {currentMusic?.artist || "Unknown Artist"}
          </Text>
        </View>

        <View style={playerMaximizeStyles.controlsContainer}>
          <View style={playerMaximizeStyles.progressContainer}>
            <Text style={playerMaximizeStyles.time}>{formatTime(progress)}</Text>
            <View style={playerMaximizeStyles.progressBarContainer}>
              <View
                style={{
                  ...playerMaximizeStyles.progressBar,
                  width: `${(progress / duration) * 100}%`,
                }}
              />
            </View>
            <Text style={playerMaximizeStyles.time}>{formatTime(duration)}</Text>
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
