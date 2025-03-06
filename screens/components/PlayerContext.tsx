import React, { createContext, useContext, useState, useEffect } from "react";
import TrackPlayer, { 
  usePlaybackState, 
  State as TrackPlayerState, 
  useProgress,
} from "react-native-track-player";
import trackPlayerSetup from "../player/trackPlayerSetup";

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const [currentMusic, setCurrentMusic] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0);
  const [artistName, setArtistName] = useState("Unknown Artist");
  const [profilePicture, setProfilePicture] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false); // Ensure boolean state

  const playbackState = usePlaybackState(); // Get playing, paused, stopped state
  const { position, duration } = useProgress(); // Get progress and duration

  // Track playback state changes
  useEffect(() => {
    setIsPlaying(playbackState === TrackPlayerState.Playing);
  }, [playbackState]);

  // Initialize Track Player
  useEffect(() => {
    const setup = async () => {
      await trackPlayerSetup();
      await TrackPlayer.updateOptions({
        stopWithApp: false, // Ensure music plays in background
        capabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
          TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        ],
        compactCapabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
        ],
        notificationCapabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
          TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
          TrackPlayer.CAPABILITY_STOP,
        ],
      });
    };
    setup();
  }, []);

  // Normalize music object structure
  const normalizeMusic = (music) => ({
    id: music.music_id || music.id,
    url: music.file_url || music.url,
    title: music.music_title || music.title,
    artist: music.artist_name || music.artist,
    artwork: music.profile_picture || music.artwork,
  });

  // Play a music track
  const playMusic = async (music, playlistData = [], index = 0) => {
    if (!music) return;

    const normalizedMusic = normalizeMusic(music);
    await TrackPlayer.reset();
    setPlaylist(playlistData);
    setCurrentMusicIndex(index);
    setCurrentMusic(normalizedMusic);
    setArtistName(normalizedMusic.artist);
    setProfilePicture(normalizedMusic.artwork);

    await TrackPlayer.add(normalizedMusic);
    await TrackPlayer.play();
    setIsPlaying(true);
  };

  // Pause music
  const pauseMusic = async () => {
    await TrackPlayer.pause();
    setIsPlaying(false);
  };

  // Resume music
  const resumeMusic = async () => {
    await TrackPlayer.play();
    setIsPlaying(true);
  };

  // Seek to a specific time
  const seekTo = async (time) => {
    await TrackPlayer.seekTo(time);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentMusic,
        isPlaying,
        progress: position,
        duration,
        playMusic,
        pauseMusic,
        resumeMusic,
        seekTo,
        playlist,
        currentMusicIndex,
        artistName,
        profilePicture,
        setIsPlaying,
        setCurrentMusic,
        setCurrentMusicIndex,
        setPlaylist
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};