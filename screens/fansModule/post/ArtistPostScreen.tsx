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
import DiscoverScreenForArtist from '../../discover/DiscoverScreen';
import MusicLibraryPage from '../../artist/MusicLibraryPage';
import ProfileScreenArtist from '../../profile/ProfileScreenArtist';
import CreatePost from '../../components/CreatePost';
import Header from '../../components/Header';
import TrackPlayer, { usePlaybackState, State as TrackPlayerState, useProgress } from "react-native-track-player";
import trackPlayerSetup from "../../player/trackPlayerSetup";
import Slider from "@react-native-community/slider";
import { formatTime } from '../../components/Utils'; // Import the formatTime function


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
      const [selectedTab, setSelectedTab] = useState<'All' | 'Music' | 'Videos' | 'Pictures'>('All');
      const [selectedScreen, setSelectedScreen] = useState<'ArtistPostScreen' | 'DiscoverScreenForArtist' | 'MusicLibraryPage' | 'ProfileScreenArtist' | 'CreatePost'>('ArtistPostScreen');
       const progress = useProgress();
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
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post.id === postId
                            ? {
                                  ...post,
                                  isLiked: !post.isLiked,
                                  like_count: post.isLiked ? post.like_count - 1 : post.like_count + 1,
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
     const playMusic = async (fileUrl) => {
           const completeUrl = fileUrl.startsWith("http") ? fileUrl : `${BASE_URL}${fileUrl}`;
           console.log("Playing music from URL:", completeUrl);
         
           try {
             if (currentPlaying === completeUrl) {
               // If the same track is clicked again, toggle play/pause
               if (isPlaying) {
                 await TrackPlayer.pause();
                 setIsPlaying(false);
               } else {
                 await TrackPlayer.play();
                 setIsPlaying(true);
               }
             } else {
               // Play new track
               await TrackPlayer.reset();
               await TrackPlayer.add({
                 id: completeUrl, // Use completeUrl as the unique ID
                 url: completeUrl,
                 title: 'Track Title',
                 artist: 'Artist Name',
                 artwork: 'https://placekitten.com/300/300',
               });
               await TrackPlayer.play();
               setIsPlaying(true);
               setCurrentPlaying(completeUrl); // Correct reference
             }
           } catch (error) {
             console.error("Error playing music:", error);
             Alert.alert("Error", "Failed to play music.");
           }
         };
         
         const pauseMusic = async () => {
           try {
             await TrackPlayer.pause();
             setIsPlaying(false);
           } catch (error) {
             console.error("Error pausing music:", error);
             Alert.alert("Error", "Failed to pause music.");
           }
         };
         
         const handleSliderChange = async (value) => {
           await TrackPlayer.seekTo(value);
         };
      
    
      const onRefresh = async () => {
        console.log('Pull-to-refresh triggered');
        setRefreshing(true);
        await fetchPosts(); // Reload posts
        setRefreshing(false); // End refreshing state
    };
    const handleNavigationClick = (screen: 'ArtistPostScreen' | 'DiscoverScreenForArtist' | 'MusicLibraryPage' | 'ProfileScreenArtist' | 'CreatePost') => {
        setSelectedScreen(screen); // Update the selected screen
      };
      const renderContent = () => {
        switch (selectedScreen) {
          
          case 'DiscoverScreenForArtist':
            return <DiscoverScreenForArtist />;
          case 'MusicLibraryPage':
            return <MusicLibraryPage />;
          case 'ProfileScreenArtist':
            return <ProfileScreenArtist />;
            case 'CreatePost':
            return <CreatePost />;
            case 'ArtistPostScreen':
          default:
            return <View style={dashboardStyles.container}>
                <Header selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                <FlatList
                    data={posts || []}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderPost}
                    contentContainerStyle={dashboardStyles.contentContainer}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            </View>;
        }
        };
      const renderPost = ({ item }) => {
        // Enforce HTTPS for media_url
        const mediaUrl = item.media_url?.startsWith('http://')
            ? item.media_url.replace('http://', 'https://')
            : item.media_url;
            const completeUrl = item.media_url 
            ? (item.media_url.startsWith("http") ? item.media_url : `${BASE_URL}${item.media_url}`) 
            : null;
          const isPlayingCurrent = currentPlaying === completeUrl && isPlaying;
        
    
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
  {new Date(item.created_at).toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })}
</Text>
                    </View>
                </View>
    
                {/* Post Content */}
                <Text style={dashboardStyles.postText}>{item.content}</Text>
    
                
                {/* Media Display */}
            {completeUrl && item.media_type === 'image' && <Image source={{ uri: completeUrl }} style={artistPostStyles.postMedia} />}
      
      {completeUrl && item.media_type === 'audio' && (
        <View style={dashboardStyles.trackContainer}>
          <View style={dashboardStyles.row}>
            <Image source={profilePicture ? { uri: profilePicture } : require("../../../assets/profile/profile-image.jpg")} style={dashboardStyles.trackAvatar} />
            <View style={dashboardStyles.info}>
              <Text style={dashboardStyles.trackTitle} numberOfLines={1}>{item.music_title || 'Unknown Track'}</Text>
            </View>
            <TouchableOpacity onPress={() => playMusic(completeUrl)}>
              <Image
                source={isPlayingCurrent ? require("../../../assets/icons/icons8-pause-90.png") : require("../../../assets/icons/211876_play_icon.png")}
                style={dashboardStyles.playIcon}
              />
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          {isPlayingCurrent && (
            <View style={dashboardStyles.progressBarContainer}>
              
              <Slider
                style={dashboardStyles.slider}
                minimumValue={0}
                maximumValue={progress.duration}
                value={progress.position}
                onSlidingComplete={handleSliderChange}
                minimumTrackTintColor="#2EF3DD"
                maximumTrackTintColor="#999"
                thumbTintColor="#2EF3DD"
              />
              <View style={dashboardStyles.progressTime}>
              <Text style={dashboardStyles.time}>{formatTime(progress.position)}</Text>
              <Text style={dashboardStyles.timeRight}>{formatTime(progress.duration)}</Text>
            </View>
            </View>
            
          )}
          
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
       
            <View style={artistPostStyles.container}>
            {renderContent()}

            <ArtistNavigationBar selectedScreen={selectedScreen} onNavigationClick={handleNavigationClick} />
            </View>
           
       
    );
};

export default ArtistPostScreen;
