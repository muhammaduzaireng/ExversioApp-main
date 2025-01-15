import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import Sound from "react-native-sound";

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const [currentMusic, setCurrentMusic] = useState(null); // Currently playing music
  const [isPlaying, setIsPlaying] = useState(false); // Playback state
  const [progress, setProgress] = useState(0); // Playback progress
  const [duration, setDuration] = useState(0); // Music duration
  const [playlist, setPlaylist] = useState([]); // Full playlist
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0); // Current music index
  const [artistName, setArtistName] = useState("Unknown Artist"); // Current artist name
  const soundRef = useRef(null); // Reference to the sound object

  // Cleanup soundRef on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.stop(() => soundRef.current.release());
      }
    };
  }, []);

  // Update progress every second
  useEffect(() => {
    let interval = null;

    if (soundRef.current && isPlaying) {
      interval = setInterval(() => {
        soundRef.current.getCurrentTime((time) => {
          setProgress(time || 0);
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const initializeSound = (fileUrl, onCompletion) => {
    if (soundRef.current) {
      soundRef.current.stop(() => soundRef.current.release());
    }

    const sound = new Sound(fileUrl, null, (error) => {
      if (error) {
        console.error("Error loading sound:", error);
        return;
      }

      setDuration(sound.getDuration());
      setProgress(0);

      sound.play((success) => {
        if (success) {
          onCompletion();
        } else {
          console.error("Playback failed.");
        }
      });
    });

    soundRef.current = sound;
    setIsPlaying(true);
  };

  const playMusic = (music, playlistData, index) => {
    if (!music) {
      console.error("Music object is undefined.");
      return;
    }

    setPlaylist(playlistData || []);
    setCurrentMusicIndex(index);
    setCurrentMusic(music);
    setArtistName(music.artist_name || "Unknown Artist");

    initializeSound(music.file_url, handleCompletion);
  };

  const pauseMusic = () => {
    if (soundRef.current && isPlaying) {
      soundRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeMusic = () => {
    if (soundRef.current && !isPlaying) {
      soundRef.current.play(() => {
        setIsPlaying(true);
      });
    }
  };

  const handleCompletion = () => {
    const nextIndex = currentMusicIndex + 1;

    if (nextIndex < playlist.length) {
      playMusic(playlist[nextIndex], playlist, nextIndex);
    } else {
      setIsPlaying(false);
      setProgress(0);
    }
  };

  const seekTo = (time) => {
    if (soundRef.current) {
      soundRef.current.setCurrentTime(time);
      setProgress(time);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentMusic,
        isPlaying,
        progress,
        duration,
        playMusic,
        pauseMusic,
        resumeMusic,
        setIsPlaying,
        setProgress,
        seekTo,
        playlist,
        currentMusicIndex,
        setCurrentMusicIndex,
        soundRef,
        setDuration,
        setCurrentMusic,
        artistName,
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
