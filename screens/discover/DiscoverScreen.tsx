import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import discoverStyles from '../../styles/discoverStyles'; // Ensure this stylesheet exists
import Player from '../components/Player'; // Ensure the Player component exists
import NavigationBar from '../components/NavigationBar'; // Ensure the NavigationBar component exists
import Sound from 'react-native-sound';
import ArtistProfileData from './ArtistProfileData'; // Import the ArtistProfileData component

type Artist = {
  id: number;
  name: string;
  profile_picture: string;
  user_id: number;
};

const DiscoverScreen = () => {
  const BASE_URL = "https://api.exversio.com"; // Replace with your server's URL

  const [artists, setArtists] = useState<Artist[]>([]);
  const [currentMusic, setCurrentMusic] = useState(null); // Current music being played
  const [isPlaying, setIsPlaying] = useState(false); // Whether music is playing
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null); // Selected artist
  const soundRef = useRef<Sound | null>(null); // Reference to the sound object

  useEffect(() => {
    const fetchApprovedArtists = async () => {
      try {
        const response = await fetch(`${BASE_URL}/approved-artists`);
        const data = await response.json();

        if (data.success) {
          // Transform artist data to include the base URL for profile picture URLs
          const artistsWithFullUrls = data.artists.map((artist) => ({
            ...artist,
            profile_picture: artist.profile_picture
              ? artist.profile_picture.startsWith("http")
                ? artist.profile_picture
                : `${BASE_URL}${artist.profile_picture}`
              : null, // Keep null if profile picture is missing
          }));
         


          setArtists(artistsWithFullUrls);
          console.log("Artists loaded:", artists);
        } else {
          Alert.alert("Error", "Failed to load artists");
        }
      } catch (error) {
        console.error("Error fetching artists:", error);
        Alert.alert("Error", "Failed to load artists");
      }
    };

    fetchApprovedArtists();
  }, []);

  const playMusic = (music) => {
    if (soundRef.current) {
      soundRef.current.stop(() => {
        soundRef.current.release();
      });
    }

    const sound = new Sound(music.file_url, null, (error) => {
      if (error) {
        console.error("Failed to load sound", error);
        return;
      }

      setCurrentMusic(music);
      setIsPlaying(true);
      sound.play(() => {
        sound.release();
        setIsPlaying(false);
        setCurrentMusic(null);
      });
    });

    soundRef.current = sound;
  };

  const pauseMusic = () => {
    if (soundRef.current) {
      soundRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <View style={discoverStyles.container}>
      {selectedArtist ? (
  // Render the ArtistProfileData component if an artist is selected
  <ArtistProfileData
          artistId={selectedArtist.id}
          user_id={selectedArtist.user_id}
          artistName={selectedArtist.name}
          profilePicture={selectedArtist.profile_picture}
          onBack={() => setSelectedArtist(null)} // Add a callback to go back
        />
) : (
  // Render the list of artists
  <ScrollView contentContainerStyle={discoverStyles.contentContainer}>
    <Text style={discoverStyles.sectionTitle}>Explore Artists</Text>
    <View style={discoverStyles.artistsContainer}>
      {artists.map((artist) => (
        <TouchableOpacity
          key={artist.id}
          onPress={() => {
            setSelectedArtist(artist);
          }}
        >
          <Image
            source={{ uri: artist.profile_picture }}
            style={discoverStyles.artistCard}
          />
          <Text style={discoverStyles.artistName}>{artist.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </ScrollView>
)}


      
    </View>
  );
};

export default DiscoverScreen;