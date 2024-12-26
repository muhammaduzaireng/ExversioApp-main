import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import artistPostStyles from '../../../styles/artist/artistPostStyles';
import dashboardStyles from '../../../styles/dashboardStyles';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import ArtistNavigationBar from '../../components/ArtistNavigationBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ArtistPostScreen = () => {
    const BASE_URL = "https://api.exversio.com:3000"; // Replace 3000 with your server's port

    const navigation = useNavigation();
    const [content, setContent] = useState('');
    const [media, setMedia] = useState(null);
    const [posts, setPosts] = useState([]);
    const [artistId, setArtistId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [activeCommentPostId, setActiveCommentPostId] = useState(null);
    const [newCommentText, setNewCommentText] = useState(''); // State to track new comment text

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
    const handlePost = async () => {
        if (!artistId) {
            Alert.alert('Error', 'Artist ID not available');
            return;
        }
        if (content || media) {
            const postData = {
                artistId,
                content,
                mediaUrl: media?.uri || null,
                mediaType: media ? media.type : 'text',
            };

            try {
                const response = await fetch(`${BASE_URL}/create-post`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(postData),
                });
                const data = await response.json();
                console.log('Create post response:', data); // Log response for debugging

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
        try {
            // Fetch user_id from AsyncStorage
            const storedUserId = await AsyncStorage.getItem('userId');
            const userId = storedUserId ? parseInt(storedUserId, 10) : null;
    
            if (!userId) {
                Alert.alert('Error', 'User not found. Please log in again.');
                return;
            }
    
            // Make the API call to add the comment
            const response = await fetch(`${BASE_URL}/add-comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId, userId, commentText }),
            });
    
            const data = await response.json();
            if (data.success) {
                console.log(`Comment added successfully with ID: ${data.commentId}`);
                setActiveCommentPostId(null); // Hide comment input after submit
                setNewCommentText(''); // Reset comment input field
                fetchPosts(); // Refresh posts to show the new comment
            } else {
                Alert.alert('Error', data.message || 'Failed to add comment.');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            Alert.alert('Error', 'Failed to add comment. Please try again.');
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

    const renderPost = ({ item }) => (
        <View style={dashboardStyles.postContainer}>
            {/* Post Header */}
            <View style={dashboardStyles.postHeader}>
                <Image source={require('../../../assets/profile/profile-image.jpg')} style={dashboardStyles.avatar} />
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
                    <Text style={dashboardStyles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
                </View>
            </View>
    
            {/* Post Content */}
            <Text style={dashboardStyles.postText}>{item.content}</Text>
    
            {/* Media Display */}
            {item.media_url && item.media_type === 'image' && (
                <Image source={{ uri: item.media_url }} style={artistPostStyles.postMedia} />
            )}
            {item.media_url && item.media_type === 'audio' && (
                <View style={artistPostStyles.audioContainer}>
                    <Text>Audio file: {item.media_url}</Text>
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
            {Array.isArray(item.comments) && item.comments.length >= 0 ? (
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
    

    

    return (
        <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: '#1E1E1E' }}>
            <View style={artistPostStyles.container}>
                <View style={artistPostStyles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('../../../assets/icons/3994400_arrow_forward_navigation_next_right_icon.png')} style={artistPostStyles.backIcon} />
                    </TouchableOpacity>
                    <Text style={artistPostStyles.headerTitle}>Create Post</Text>
                </View>

                <TextInput
                    style={artistPostStyles.input}
                    placeholder="What's on your mind?"
                    placeholderTextColor="#aaa"
                    value={content}
                    onChangeText={setContent}
                    multiline
                />

                <TouchableOpacity style={artistPostStyles.postButton} onPress={handlePost}>
                    <Text style={artistPostStyles.postButtonText}>Post</Text>
                </TouchableOpacity>

                <FlatList
                    data={posts || []}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderPost}
                    contentContainerStyle={artistPostStyles.feedContainer}
                />
            </View>
            <ArtistNavigationBar />
        </View>
    );
};

export default ArtistPostScreen;
