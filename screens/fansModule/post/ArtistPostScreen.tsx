import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, FlatList, Alert, RefreshControl } from 'react-native';
import artistPostStyles from '../../../styles/artist/artistPostStyles';
import dashboardStyles from '../../../styles/dashboardStyles';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import ArtistNavigationBar from '../../components/ArtistNavigationBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';

const ArtistPostScreen = () => {
    const BASE_URL = "https://api.exversio.com"; // Replace 3000 with your server's port

    const navigation = useNavigation();
    const [content, setContent] = useState('');
    const [media, setMedia] = useState(null);
    const [posts, setPosts] = useState([]);
    const [artistId, setArtistId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [activeCommentPostId, setActiveCommentPostId] = useState(null);
    const [newCommentText, setNewCommentText] = useState(''); // State to track new comment text
    const [profilePicture, setProfilePicture] = useState(null);
    const [activeAudioId, setActiveAudioId] = useState(null); // Track active audio post
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState(null);
    const [currentPlaying, setCurrentPlaying] = useState(null);
      const soundRef = useRef(null);
      const [refreshing, setRefreshing] = useState(false); // Track pull-to-refresh state
    // Fetch artistId from server based on userId in AsyncStorage
    useEffect(() => {
        const fetchArtistIdAndUserId = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userId');
                if (storedUserId) {
                    setUserId(parseInt(storedUserId, 10));
                    const response = await fetch(`${BASE_URL}/get-artist-id?userId=${storedUserId}`);
                    const data = await response.json();
                    console.log('Artist ID response data:', data);
                    if (data.success) {
                        setArtistId(data.artistId);
                    } else {
                        Alert.alert('Notice', data.message || 'User is not an approved artist');
                        navigation.navigate('DashboardScreen');
                    }
                }
            } catch (error) {
                console.error('Error fetching artistId and userId:', error);
                Alert.alert('Error', 'Failed to fetch artist ID');
            }
        };
      
        const fetchProfileData = async () => {
            try {
              const userId = await AsyncStorage.getItem('userId');
              if (userId) {
                const response = await fetch(`${BASE_URL}/getUserProfile?userId=${userId}`);
                const data = await response.json();
      
                if (data.success) {
                  const profilePictureUrl =
                    data.data.profilePicture && data.data.profilePicture.startsWith('/')
                      ? `${BASE_URL}${data.data.profilePicture}` // Construct full URL for relative paths
                      : data.data.profilePicture || null; // Use absolute URL or set to null if not available
                      
                    setProfilePicture(profilePictureUrl);
                } else {
                  Alert.alert('Error', 'Failed to fetch user profile');
                }
              } else {
                Alert.alert('Error', 'No user logged in');
                navigation.navigate('Login'); // Redirect to login if no userId is found
              }
            } catch (error) {
              console.error('Error fetching user profile:', error);
              Alert.alert('Error', 'Failed to fetch user profile');
            }
           
          };
 
          fetchProfileData();
                  
        fetchArtistIdAndUserId();
    }, []);

    // Fetch posts with userId to check if they are liked by the user
    const fetchPosts = async () => {
        if (!artistId || !userId) return;
        try {
            const response = await fetch(`${BASE_URL}/get-posts?artistId=${artistId}&userId=${userId}`);
            const data = await response.json();
            console.log('Fetched posts data:', data);
    
            if (data.success && Array.isArray(data.posts)) {
                setPosts(
                    data.posts.map((post) => ({
                        ...post,
                        isLiked: post.isLiked === true, // Ensure isLiked is a boolean
                    }))
                );
            } else {
                console.warn("Unexpected data format:", data);
                setPosts([]);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            Alert.alert('Error', 'Failed to fetch posts.');
        }
    };
    
    useEffect(() => {
        if (artistId && userId) {
            fetchPosts();
        }
    }, [artistId, userId]);


    // Handle creating a new post
    const selectImage = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                console.error('ImagePicker Error:', response.errorMessage);
            } else {
                const selectedImage = response.assets[0]; // Get the first selected image
                setMedia(selectedImage);
            }
        });
    };

    // Handle creating a new post
    const handlePost = async () => {
        if (!artistId) {
            Alert.alert('Error', 'Artist ID not available');
            return;
        }
        if (content || media) {
            const formData = new FormData();
            formData.append('artistId', artistId);
            formData.append('content', content);
            if (media) {
                formData.append('media', {
                    uri: media.uri,
                    name: media.fileName,
                    type: media.type,
                });
            }

            try {
                const response = await fetch(`${BASE_URL}/create-post`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formData,
                });
                const data = await response.json();

                if (data.success) {
                    fetchPosts(); // Refresh posts
                    setContent('');
                    setMedia(null);
                } else {
                    Alert.alert('Error', data.message || 'Failed to create post.');
                }
            } catch (error) {
                console.error('Error creating post:', error);
                Alert.alert('Error', 'Failed to create post.');
            }
        } else {
            Alert.alert('Error', 'Please enter some content or select media.');
        }
    };


    
    
    
    
    const handleComment = async (postId, commentText) => {
        console.log("Handling comment for post ID:", postId);
        console.log("Comment text:", commentText);
    
        if (!commentText.trim()) {
            Alert.alert("Error", "Comment cannot be empty.");
            return;
        }
    
        try {
            const storedUserId = await AsyncStorage.getItem('userId');
            const userId = storedUserId ? parseInt(storedUserId, 10) : null;
    
            if (!userId) {
                Alert.alert("Error", "User not found. Please log in again.");
                return;
            }
    
            const response = await fetch(`${BASE_URL}/add-comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId, userId, commentText }),
            });
    
            const data = await response.json();
            console.log("Comment API response:", data);
    
            if (data.success) {
                console.log("Comment added successfully");
    
                // Update the local state with the new comment
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post.id === postId
                            ? {
                                  ...post,
                                  comments: [
                                      ...(post.comments || []), // Ensure comments array exists
                                      {
                                          id: data.commentId, // Use the ID returned by the API
                                          user_id: userId,
                                          user_name: "You", // Optionally, replace with logged-in user's name
                                          text: commentText,
                                      },
                                  ],
                              }
                            : post
                    )
                );
    
                setActiveCommentPostId(null);
                setNewCommentText('');
            } else {
                Alert.alert("Error", data.message || "Failed to add comment.");
            }
        } catch (error) {
            console.error("Error adding comment:", error);
            Alert.alert("Error", "Failed to add comment. Please try again.");
        }
    };
    
    
    const handleLike = async (postId) => {
        try {
            const storedUserId = await AsyncStorage.getItem('userId');
            const userId = storedUserId ? parseInt(storedUserId, 10) : null;
    
            if (!userId) {
                Alert.alert('Error', 'User not found. Please log in again.');
                return;
            }
    
            // Make API call to like/unlike the post
            const response = await fetch(`${BASE_URL}/like-post`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, userId }),
            });
    
            const data = await response.json();
    
            if (data.success) {
                // Toggle the like status and count
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post.id === postId
                            ? {
                                ...post,
                                isLiked: !post.isLiked, // Toggle like status
                                like_count: post.isLiked
                                    ? post.like_count - 1 // Decrease count if unliked
                                    : post.like_count + 1, // Increase count if liked
                            }
                            : post
                    )
                );
            } else {
                Alert.alert('Error', data.message || 'Failed to like/unlike post.');
            }
        } catch (error) {
            console.error('Error liking post:', error);
            Alert.alert('Error', 'Failed to like post. Please try again.');
        }
    };
    useEffect(() => {
        if (soundRef.current) {
          console.log("Setting up interval to track playback position");
          const interval = setInterval(() => {
            soundRef.current.getCurrentTime((seconds) => {
              console.log("Current playback position:", seconds);
              setPlaybackPosition(seconds);
            });
          }, 1000);
          return () => {
            console.log("Clearing interval");
            clearInterval(interval);
          };
        }
      }, [currentPlaying]);
      
      const playMusic = (fileUrl) => {
        console.log("Attempting to play music:", fileUrl);
      
        const completeUrl = fileUrl.startsWith("http")
          ? fileUrl
          : `${BASE_URL}${fileUrl}`;
        console.log("Formatted URL for playback:", completeUrl);
      
        // Stop and release the current playing sound
        if (currentPlaying && soundRef.current) {
          console.log("Stopping current sound...");
          soundRef.current.stop(() => {
            console.log("Current sound stopped");
            soundRef.current.release();
            console.log("Current sound released");
          });
        }
      
        // Initialize the new sound
        console.log("Initializing new sound...");
        const sound = new Sound(completeUrl, null, (error) => {
          if (error) {
            console.error("file during sound initialization:", completeUrl);
            console.error("Error during sound initialization:", error);
            Alert.alert("Error", "Failed to load sound.");
            return;
          }
          console.log("Sound loaded successfully. Duration:", sound.getDuration());
      
          setPlaybackDuration(sound.getDuration());
      
          sound.play(() => {
            console.log("Playback finished");
            sound.release();
            console.log("Sound released after playback");
            setCurrentPlaying(null);
            setIsPlaying(false);
          });
      
          console.log("Started playback for:", completeUrl);
        });
      
        soundRef.current = sound;
        setCurrentPlaying(fileUrl);
        setIsPlaying(true);
        console.log("Playback state updated: Playing");
      };
      
      const pauseMusic = () => {
        console.log("Attempting to pause music...");
        if (soundRef.current) {
          soundRef.current.pause(() => {
            console.log("Music paused successfully");
            setIsPlaying(false);
          });
        } else {
          console.log("No active sound to pause");
        }
      };
      
    
      const onRefresh = async () => {
        console.log('Pull-to-refresh triggered');
        setRefreshing(true);
        await fetchPosts(); // Reload posts
        setRefreshing(false); // End refreshing state
    };

      const renderPost = ({ item }) => {
        // Enforce HTTPS for media_url
        const mediaUrl = item.media_url?.startsWith('http://')
            ? item.media_url.replace('http://', 'https://')
            : item.media_url;
    
        return (
            <View style={dashboardStyles.postContainer}>
                {/* Post Header */}
                <View style={dashboardStyles.postHeader}>
                    <Image
                        source={
                            profilePicture
                                ? { uri: profilePicture }
                                : require('../../../assets/profile/profile-image.jpg')
                        }
                        style={dashboardStyles.avatar}
                    />
                    <View style={dashboardStyles.userInfo}>
                        <View style={dashboardStyles.userRow}>
                            <Text
                                style={dashboardStyles.username}
                                onPress={() =>
                                    navigation.navigate('ArtistProfileScreen', { artistId: item.artist_id })
                                }
                            >
                                {item.artist_name || 'Unknown Artist'}
                            </Text>
                            <Image
                                source={require('../../../assets/icons/icons8-blue-tick.png')}
                                style={dashboardStyles.verifiedIcon}
                            />
                        </View>
                        <Text style={dashboardStyles.timestamp}>
                            {new Date(item.timestamp).toLocaleString()}
                        </Text>
                    </View>
                </View>
    
                {/* Post Content */}
                <Text style={dashboardStyles.postText}>{item.content}</Text>
    
                {/* Media Display */}
                {mediaUrl && item.media_type === 'image' && (
                    <Image source={{ uri: mediaUrl }} style={artistPostStyles.postMedia} />
                )}
                {mediaUrl && item.media_type === 'audio' && (
                    <View style={artistPostStyles.audioContainer}>
                        <TouchableOpacity onPress={() => playMusic(mediaUrl, item.id)}>
                            <Image
                                source={
                                    activeAudioId === item.id && isPlaying
                                        ? require('../../../assets/icons/icons8-pause-90.png')
                                        : require('../../../assets/icons/211876_play_icon.png')
                                }
                                style={artistPostStyles.audioControl}
                            />
                        </TouchableOpacity>
                        <Text style={artistPostStyles.audioLabel}>
                            {mediaUrl.split('/').pop()} {/* Display file name */}
                        </Text>
                    </View>
                )}
    
                {/* Actions: Likes and Comments */}
                <View style={dashboardStyles.postActions}>
                    <Text style={dashboardStyles.likeCount}>{item.like_count || 0}</Text>
                    <TouchableOpacity onPress={() => handleLike(item.id)}>
                        <Image
                            source={require('../../../assets/icons/8542029_heart_love_like_icon.png')}
                            style={[
                                dashboardStyles.actionIconLike,
                                { tintColor: item.isLiked ? 'red' : 'white' },
                            ]}
                        />
                    </TouchableOpacity>
                    <Text style={dashboardStyles.commentCount}>
                        {Array.isArray(item.comments) ? item.comments.length : 0}
                    </Text>
                    <TouchableOpacity onPress={() => setActiveCommentPostId(item.id)}>
                        <Image
                            source={require('../../../assets/icons/icons8-comment.png')}
                            style={dashboardStyles.actionIconComment}
                        />
                    </TouchableOpacity>
                </View>
    
                {/* Comment Input */}
                {activeCommentPostId === item.id && (
                    <View style={dashboardStyles.commentInputContainer}>
                        <TextInput
                            style={dashboardStyles.commentInput}
                            placeholder="Write a comment..."
                            placeholderTextColor="#888"
                            value={newCommentText}
                            onChangeText={setNewCommentText}
                        />
                        <TouchableOpacity onPress={() => handleComment(item.id, newCommentText)}>
                            <Text style={dashboardStyles.commentSubmitButton}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                )}
    
                {/* Comments Display */}
                {Array.isArray(item.comments) && item.comments.length > 0 ? (
                    item.comments.map((comment, index) => (
                        <View key={comment?.id || index} style={dashboardStyles.commentContainer}>
                            <Text style={dashboardStyles.commentText}>
                                <Text style={dashboardStyles.commentAuthor}>
                                    {`${comment?.user_name || 'Anonymous'}: `}
                                </Text>
                                {comment?.text || 'No comment available'}
                            </Text>
                        </View>
                    ))
                ) : (
                    <Text style={dashboardStyles.noCommentsText}>No comments yet</Text>
                )}
            </View>
        );
    };
    

    return (
        <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: '#1E1E1E' }}>
            <View style={artistPostStyles.container}>
                

                <FlatList
                    data={posts || []}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderPost}
                    contentContainerStyle={artistPostStyles.feedContainer}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            </View>
            <ArtistNavigationBar />
        </View>
    );
};

export default ArtistPostScreen;
