import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, FlatList, Alert, RefreshControl, Modal, Button } from 'react-native';
import artistPostStyles from '../../../styles/artist/artistPostStyles';
import dashboardStyles from '../../../styles/dashboardStyles';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import ArtistNavigationBar from '../../components/ArtistNavigationBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DiscoverScreenForArtist from '../../discover/DiscoverScreen';
import MusicLibraryPage from '../../artist/MusicLibraryPage';
import ProfileScreenArtist from '../../profile/ProfileScreenArtist';
import CreatePost from '../../components/CreatePost';
import Header from '../../components/Header';
import Slider from "@react-native-community/slider";
import { formatTime } from '../../components/Utils'; // Import the formatTime function
import Player from '../../components/Player';
import { usePlayer } from "../../components/PlayerContext"; // Import usePlayer

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
    const [refreshing, setRefreshing] = useState(false); // Track pull-to-refresh state
    const [selectedTab, setSelectedTab] = useState<'All' | 'Music' | 'Videos' | 'Pictures'>('All');
    const [selectedScreen, setSelectedScreen] = useState<'ArtistPostScreen' | 'DiscoverScreenForArtist' | 'MusicLibraryPage' | 'ProfileScreenArtist' | 'CreatePost'>('ArtistPostScreen');
    const { playMusic, pauseMusic, currentMusic, isPlaying, setIsPlaying } = usePlayer();
    const { progress, currentPlaying } = usePlayer(); // Destructure the progress and currentPlaying values from the usePlayer hook
    const [isEditing, setIsEditing] = useState(false);
    const [editingContent, setEditingContent] = useState('');
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [showOptionsModal, setShowOptionsModal] = useState(false);


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
    const handleUpdatePost = async () => {
        try {
            const response = await fetch(`${BASE_URL}/update-post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId: selectedPostId, content: editingContent }),
            });
    
            const data = await response.json();
    
            if (data.success) {
                fetchPosts(); // Refresh posts
                setShowOptionsModal(false);
                setIsEditing(false);
                setEditingContent('');
                Alert.alert('Success', 'Post updated successfully.');
            } else {
                Alert.alert('Error', data.message || 'Failed to update post.');
            }
        } catch (error) {
            console.error('Error updating post:', error);
            Alert.alert('Error', 'Failed to update post.');
        }
    };
    
    const handleDeletePost = async () => {
        try {
            const response = await fetch(`${BASE_URL}/delete-post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId: selectedPostId }),
            });
    
            const data = await response.json();
    
            if (data.success) {
                fetchPosts(); // Refresh posts
                setShowOptionsModal(false);
                Alert.alert('Success', 'Post deleted successfully.');
            } else {
                Alert.alert('Error', data.message || 'Failed to delete post.');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            Alert.alert('Error', 'Failed to delete post.');
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

    const filterPosts = () => {
        if (selectedTab === 'All') {
            return posts;
        }
        if (selectedTab === 'Music') {
            return posts.filter(post => post.media_type === 'audio');
        }
        if (selectedTab === 'Videos') {
            return posts.filter(post => post.media_type === 'video');
        }
        if (selectedTab === 'Pictures') {
            return posts.filter(post => post.media_type === 'image');
        }
        return posts;
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
                return (
                    <View style={dashboardStyles.container}>
                        <Header selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                        <FlatList
                            data={filterPosts() || []}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderPost}
                            contentContainerStyle={dashboardStyles.contentContainer}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                        />
                    </View>
                );
        }
    };

    const renderPost = ({ item }) => {
        const completeUrl = item.media_url
            ? (item.media_url.startsWith("http") ? item.media_url : `${BASE_URL}${item.media_url}`)
            : null;
        const isPlayingCurrent = currentPlaying === completeUrl && isPlaying;
    
        return (
            <View style={dashboardStyles.postContainer}>
                <View style={dashboardStyles.postHeader}>
                    <Image
                        source={profilePicture ? { uri: profilePicture } : require('../../../assets/profile/profile-image.jpg')}
                        style={dashboardStyles.avatar}
                    />
                    <View style={dashboardStyles.userInfo}>
                        <View style={dashboardStyles.userRow}>
                            <Text
                                style={dashboardStyles.username}
                                onPress={() => navigation.navigate('ArtistProfileScreen', { artistId: item.artist_id })}
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
                    <TouchableOpacity onPress={() => {
                        setSelectedPostId(item.id);
                        setShowOptionsModal(true);
                    }}>
                        <Image
                            source={require('../../../assets/icons/icons8-three-dots-90.png')}
                            style={dashboardStyles.moreIcons}
                        />
                    </TouchableOpacity>
                </View>
                
                <Text style={dashboardStyles.postText}>{item.content}</Text>
                {completeUrl && item.media_type === 'image' && <Image source={{ uri: completeUrl }} style={artistPostStyles.postMedia} />}
                {completeUrl && item.media_type === 'audio' && (
                    <View style={dashboardStyles.trackContainer}>
                        <View style={dashboardStyles.row}>
                            <Image source={profilePicture ? { uri: profilePicture } : require("../../../assets/profile/profile-image.jpg")} style={dashboardStyles.trackAvatar} />
                            <View style={dashboardStyles.info}>
                                <Text style={dashboardStyles.trackTitle} numberOfLines={1}>{item.music_title || 'Unknown Track'}</Text>
                            </View>
                            <TouchableOpacity onPress={() => playMusic({
                                music_id: item.id,
                                file_url: completeUrl,
                                music_title: item.music_title || 'Track Title',
                                artist_name: item.artist_name || 'Artist Name',
                                profile_picture: profilePicture || 'https://placekitten.com/300/300'
                            })}>
                                <Image
                                    source={isPlayingCurrent ? require("../../../assets/icons/icons8-pause-90.png") : require("../../../assets/icons/211876_play_icon.png")}
                                    style={dashboardStyles.playIcon}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
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
            <Player />
            <ArtistNavigationBar selectedScreen={selectedScreen} onNavigationClick={handleNavigationClick} />
            
            <Modal
                transparent={true}
                animationType="slide"
                visible={showOptionsModal}
                onRequestClose={() => setShowOptionsModal(false)}
            >
                <View style={dashboardStyles.modalContainer}>
                    <View style={dashboardStyles.modalContent}>
                        <TouchableOpacity onPress={() => setShowOptionsModal(false)} style={dashboardStyles.closeButton}>
                            <Text style={dashboardStyles.closeButtonText}>X</Text>
                        </TouchableOpacity>
                        {isEditing ? (
                            <>
                                <TextInput
                                    style={dashboardStyles.modalInput}
                                    value={editingContent}
                                    onChangeText={setEditingContent}
                                    placeholder="Edit your post content"
                                />
                                <TouchableOpacity onPress={() => setShowOptionsModal(false)} style={dashboardStyles.closeButton}>
                                <Button  title="Save" onPress={handleUpdatePost} />
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Button title="Edit" onPress={() => {
                                    setIsEditing(true);
                                    setEditingContent(posts.find(post => post.id === selectedPostId)?.content || '');
                                }} />
                                <TouchableOpacity onPress={() => setShowOptionsModal(false)} style={dashboardStyles.closeButton}>
                                <Button title="Delete" onPress={handleDeletePost} />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ArtistPostScreen;