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
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const BASE_URL = 'https://api.exversio.com';

const CreatePost = ({ onClose, refreshPosts }) => {
    const [content, setContent] = useState('');
    const [media, setMedia] = useState(null); // Holds selected image or audio
    const navigation = useNavigation();

    // Select Media (Image or Audio)
    const selectMedia = async (type) => {
        if (type === 'image') {
            launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.errorMessage) {
                    console.error('ImagePicker Error:', response.errorMessage);
                } else {
                    const selectedImage = response.assets[0];
                    setMedia({
                        uri: selectedImage.uri,
                        name: selectedImage.fileName,
                        type: selectedImage.type,
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

    // Handle Post Submission
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
                if (refreshPosts) refreshPosts(); // Refresh posts if callback provided
                navigation.navigate('ArtistPostScreen'); // Navigate back
            } else {
                Alert.alert('Error', data.message || 'Failed to create post.');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            Alert.alert('Error', 'Failed to create post.');
        }
        onClose();
    };

    // Handle Cancel Button
    const handleCancel = () => {
        navigation.navigate('ArtistPostScreen'); // Navigate back to ArtistPostScreen
    };

    return (
        <View style={styles.wrapper}>
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
                        {media.type.startsWith('image') ? (
                            <Image source={{ uri: media.uri }} style={styles.mediaPreview} />
                        ) : (
                            <Text style={styles.audioText}>Audio: {media.name}</Text>
                        )}
                    </View>
                )}

                {/* <View style={styles.centerContainer}>
                    <TouchableOpacity
                        style={styles.mediaButton}
                        onPress={() => selectMedia('image')}
                    >
                        <Text style={styles.mediaButtonText}>Add Image</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.mediaButton}
                        onPress={() => selectMedia('audio')}
                    >
                        <Text style={styles.mediaButtonText}>Add Audio</Text>
                    </TouchableOpacity>
                </View> */}
                <View style={styles.centerContainer}>
    <TouchableOpacity
        style={styles.mediaButton}
        onPress={() => selectMedia('image')}
    >
        <Text style={styles.mediaButtonText}>Add Image</Text>
    </TouchableOpacity>
</View>

                <TouchableOpacity style={styles.postButton} onPress={handlePost}>
                    <Text style={styles.postButtonText}>Post</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#1E1E1E',
    },
    container: {
        width: '90%',
        backgroundColor: '#333',
        borderRadius: 10,
        padding: 20,
    },
    input: {
        backgroundColor: '#444',
        color: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        height: 150,
        textAlignVertical: 'top',
    },
    mediaPreviewContainer: {
        marginBottom: 20,
    },
    mediaPreview: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    centerContainer: {
        marginVertical: 20, // Space around the button
        justifyContent: 'center',
        alignItems: 'center',
    },
    mediaButton: {
        backgroundColor: '#2EF3DD',
        padding: 15,
        borderRadius: 10,
    },
    mediaButtonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    postButton: {
        backgroundColor: '#2EF3DD',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    postButtonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    cancelButton: {
        alignItems: 'center',
        marginTop: 10,
    },
    cancelButtonText: {
        color: '#fff',
        textDecorationLine: 'underline',
    },
});


export default CreatePost;
