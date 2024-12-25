import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import Sound from "react-native-sound";

type AlbumsComponentProps = {
  artistId: number;
};

type Album = {
  album_id: number;
  album_title: string;
  album_cover: string | null;
  music: Music[];
};

type Music = {
  music_id: number;
  music_title: string;
  music_type: string;
  music_file: string;
  music_cover: string | null;
};

const AlbumsComponent = ({ artistId }: AlbumsComponentProps) => {
  const BASE_URL = "http://192.168.10.3:3000"; // Replace with your server's URL
  const [albums, setAlbums] = useState<Album[]>([]);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Sound | null>(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch(`${BASE_URL}/albums-by-artist?artist_id=${artistId}`);
        const data = await response.json();
        if (data.success) {
          setAlbums(data.albums);
        } else {
          Alert.alert("Error", data.message);
        }
      } catch (error) {
        console.error("Error fetching albums:", error);
        Alert.alert("Error", "Failed to load albums.");
      }
    };

    fetchAlbums();
  }, [artistId]);

  const playMusic = (fileUrl: string) => {
    if (sound) {
      sound.stop(() => {
        sound.release();
      });
    }

    const newSound = new Sound(fileUrl, null, (error) => {
      if (error) {
        console.error("Failed to load sound", error);
        return;
      }
      newSound.play(() => {
        setCurrentPlaying(null);
        setIsPlaying(false);
        newSound.release();
      });
      setSound(newSound);
      setCurrentPlaying(fileUrl);
      setIsPlaying(true);
    });
  };

  const pauseMusic = () => {
    if (sound) {
      sound.pause();
      setIsPlaying(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={albums}
        keyExtractor={(album) => album.album_id.toString()}
        renderItem={({ item: album }) => (
          <View style={styles.albumCard}>
            {album.album_cover ? (
              <Image source={{ uri: album.album_cover }} style={styles.albumCover} />
            ) : (
              <View style={styles.albumCoverPlaceholder}>
                <Text style={styles.placeholderText}>
                  {album.album_title[0]}
                </Text>
              </View>
            )}
            <Text style={styles.albumTitle}>{album.album_title}</Text>
            <FlatList
              data={album.music}
              keyExtractor={(music) => music.music_id.toString()}
              renderItem={({ item: music }) => (
                <View style={styles.musicCard}>
                  {music.music_cover ? (
                    <Image
                      source={{ uri: music.music_cover }}
                      style={styles.musicCover}
                    />
                  ) : (
                    <View style={styles.musicCoverPlaceholder}>
                      <Text style={styles.placeholderText}>
                        {music.music_title[0]}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.musicTitle}>{music.music_title}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      currentPlaying === music.music_file && isPlaying
                        ? pauseMusic()
                        : playMusic(music.music_file)
                    }
                  >
                    <Text style={styles.playButton}>
                      {currentPlaying === music.music_file && isPlaying
                        ? "Pause"
                        : "Play"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a1a", padding: 20 },
  albumCard: { marginBottom: 20, backgroundColor: "#333", padding: 10, borderRadius: 10 },
  albumCover: { width: "100%", height: 200, borderRadius: 10 },
  albumCoverPlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#555",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: { color: "#fff", fontSize: 20 },
  albumTitle: { color: "#fff", fontSize: 18, marginTop: 10 },
  musicCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    padding: 10,
    backgroundColor: "#444",
    borderRadius: 8,
  },
  musicCover: { width: 50, height: 50, borderRadius: 8, marginRight: 10 },
  musicCoverPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: "#666",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  musicTitle: { color: "#fff", fontSize: 16, flex: 1 },
  playButton: { color: "#2EF3DD", fontSize: 16, fontWeight: "bold" },
});

export default AlbumsComponent;
