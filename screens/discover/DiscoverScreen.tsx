import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import discoverStyles from '../../styles/discoverStyles';
import dashboardStyles from '../../styles/dashboardStyles';
import Player from '../components/Player';
import NavigationBar from '../components/NavigationBar';
import Sound from 'react-native-sound';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

type DiscoverScreenNavigationProp = StackNavigationProp<any, 'DiscoverScreen'>;

type Artist = {
  id: number;
  name: string;
  profileImage: string;
  userId: number;
};

const DiscoverScreen = () => {
  const BASE_URL = "https://www.exversio.com:3000"; // Replace 3000 with your server's port

  const navigation = useNavigation<DiscoverScreenNavigationProp>();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [currentMusic, setCurrentMusic] = useState(null); // Current music being played
  const [isPlaying, setIsPlaying] = useState(false); // Whether music is playing
  const soundRef = useRef<Sound | null>(null); // Reference to the sound object

  useEffect(() => {
    const fetchApprovedArtists = async () => {
      try {
        const response = await fetch(`${BASE_URL}/approved-artists`);
        const data = await response.json();

        if (data.success) {
          setArtists(data.artists);
          console.log(data.artists);
        } else {
          Alert.alert('Error', 'Failed to load artists');
        }
      } catch (error) {
        console.error('Error fetching artists:', error);
        Alert.alert('Error', 'Failed to load artists');
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
      <ScrollView contentContainerStyle={discoverStyles.contentContainer}>
        <Text style={discoverStyles.sectionTitle}>Explore Artists</Text>
        <View style={discoverStyles.artistsContainer}>
          {artists.map((artist) => (
            <TouchableOpacity
              key={artist.id}
              onPress={() => {
                console.log('Navigating to artist profile with userId:', artist.user_id); // Log userId here
                navigation.navigate('ArtistProfileData', { artistId: artist.id, user_id: artist.user_id });
              }}
            >
              <Image
                source={{ uri: artist.profileImage }}
                style={discoverStyles.artistCard}
              />
              <Text style={discoverStyles.artistName}>{artist.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Player component with required props */}
      <Player
        currentMusic={currentMusic}
        isPlaying={isPlaying}
        setPlaying={setIsPlaying}
        soundRef={soundRef}
      />
      <NavigationBar />
    </View>
  );
};

export default DiscoverScreen;
