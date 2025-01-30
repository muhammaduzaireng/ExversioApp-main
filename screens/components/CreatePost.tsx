import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const BASE_URL = 'https://api.exversio.com';

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null); // Holds selected image, video, or audio
  const navigation = useNavigation();
  const [audioRecorderPlayer] = useState(new AudioRecorderPlayer());
  const [isRecording, setIsRecording] = useState(false);

  const selectMedia = async (type) => {
    if (type === 'image' || type === 'video') {
      const options = {
        mediaType: type,
        quality: 1,
      };

      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.error('ImagePicker Error:', response.errorMessage);
        } else {
          const selectedMedia = response.assets[0];
          setMedia({
            uri: selectedMedia.uri,
            name: selectedMedia.fileName,
            type: selectedMedia.type,
          });
        }
      });
    } else if (type === 'audio') {
      try {
        const res = await DocumentPicker.pickSingle({ type: [DocumentPicker.types.audio] });
        setMedia({
          uri: res.uri,
          name: res.name,
          type: res.type,
        });
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          console.log('User cancelled audio picker');
        } else {
          console.error('DocumentPicker Error:', err);
        }
      }
    }
  };

  const captureImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorMessage) {
        console.error('Camera Error:', response.errorMessage);
      } else {
        const capturedImage = response.assets[0];
        setMedia({
          uri: capturedImage.uri,
          name: capturedImage.fileName,
          type: capturedImage.type,
        });
      }
    });
  };

  const recordAudio = async () => {
    if (isRecording) {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      setMedia({
        uri: result,
        type: 'audio/mp4',
        name: `Audio-${Date.now()}.mp4`,
      });
    } else {
      const result = await audioRecorderPlayer.startRecorder();
      audioRecorderPlayer.addRecordBackListener((e) => {
        console.log('Recording...', e);
      });
      setIsRecording(true);
    }
  };

  const handlePost = async () => {
    try {
      const artistId = await AsyncStorage.getItem('artistId');
      if (!artistId) {
        Alert.alert('Error', 'Artist ID not available');
        return;
      }

      let mediaUrl = null;
      let mediaType = 'text'; // Default media type is 'text'

      // Upload media if selected
      if (media) {
        const formData = new FormData();
        formData.append('file', {
          uri: media.uri,
          name: media.name,
          type: media.type,
        });

        const uploadResponse = await fetch(`${BASE_URL}/upload-media`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        const uploadData = await uploadResponse.json();

        if (uploadData.success && uploadData.url) {
          mediaUrl = uploadData.url.startsWith('https://')
            ? uploadData.url
            : uploadData.url.replace('http://', 'https://');
          mediaType = media.type.startsWith('image/')
            ? 'image'
            : media.type.startsWith('video/')
            ? 'video'
            : media.type.startsWith('audio/')
            ? 'audio'
            : 'text';
        } else {
          Alert.alert('Error', 'Failed to upload media.');
          return;
        }
      }

      const postData = {
        artistId,
        content: content || '',
        mediaUrl,
        mediaType,
      };

      const response = await fetch(`${BASE_URL}/create-post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'Post created successfully!');
        setContent('');
        setMedia(null);
        navigation.navigate('ArtistPostScreen'); // Navigate back
      } else {
        Alert.alert('Error', data.message || 'Failed to create post.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post.');
    }
  };

  const handleCancel = () => {
    navigation.navigate('ArtistPostScreen'); // Navigate back to ArtistPostScreen
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity onPress={handlePost}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          placeholderTextColor="#aaa"
          value={content}
          onChangeText={setContent}
          multiline
        />

        {media && (
          <View style={styles.mediaPreviewContainer}>
            {media.type.startsWith('image') && (
              <Image source={{ uri: media.uri }} style={styles.mediaPreview} />
            )}
            {media.type.startsWith('video') && (
              <Text style={styles.mediaText}>Video: {media.name}</Text>
            )}
            {media.type.startsWith('audio') && (
              <Text style={styles.mediaText}>Audio: {media.name}</Text>
            )}
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.mediaButton}
            onPress={() => selectMedia('image')}
          >
            <Text style={styles.mediaButtonText}>Add Image</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mediaButton}
            onPress={() => selectMedia('video')}
          >
            <Text style={styles.mediaButtonText}>Add Video</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mediaButton}
            onPress={captureImage}
          >
            <Text style={styles.mediaButtonText}>Capture Image</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mediaButton}
            onPress={recordAudio}
          >
            <Text style={styles.mediaButtonText}>
              {isRecording ? 'Stop Recording' : 'Record Audio'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cancelButtonText: {
    color: '#007BFF',
    fontSize: 18,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postButtonText: {
    color: '#007BFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 15,
  },
  input: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
    fontSize: 16,
  },
  mediaPreviewContainer: {
    width: '100%',
    marginBottom: 20,
  },
  mediaPreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  mediaText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  mediaButton: {
    padding: 10,
    backgroundColor: '#2EF3DD',
    borderRadius: 5,
    margin: 5,
  },
  mediaButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default CreatePost;