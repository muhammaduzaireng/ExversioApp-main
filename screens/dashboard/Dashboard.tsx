import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dashboardStyles from '../../styles/dashboardStyles'; // Ensure this path is correct
import artistPostStyles from '../../styles/artist/artistPostStyles';
import NavigationBar from '../components/NavigationBar';

const DashboardScreen = ({ navigation }) => {
    const BASE_URL = "http://145.223.100.9:3000"; // Replace 3000 with your server's port

    const [posts, setPosts] = useState([]);
    const [savedUserId, setSavedUserId] = useState(null);
    const [activeCommentPostId, setActiveCommentPostId] = useState(null);
    const [newCommentText, setNewCommentText] = useState('');

    // Fetch user ID from AsyncStorage
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                if (userId) {
                    setSavedUserId(userId);
                    fetchFeed(userId);
                }
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };
        fetchUserId();
    }, []);

    // Fetch feed for subscribed artists
    const fetchFeed = async (userId) => {
        try {
            console.log('Fetching feed for userId:', userId);
            const response = await fetch(`${BASE_URL}/get-feed?userId=${userId}`);
            const data = await response.json();
    
            if (data.success && Array.isArray(data.posts)) {
                console.log('Fetched posts:', data.posts);
    
                // Log the artist profile picture URLs for each post
                data.posts.forEach((post, index) => {
                    console.log(`Post ${index + 1}:`, {
                        artistName: post.artist_name,
                        profilePicture: post.artist_profile_picture,
                    });
                });
    
                setPosts(data.posts);
            } else {
                console.warn('Unexpected data format:', data);
                setPosts([]);
            }
        } catch (error) {
            console.error('Error fetching feed:', error);
            Alert.alert('Error', 'Failed to fetch feed.');
        }
    };
    

    const handleLike = async (postId) => {
        if (!savedUserId) {
            Alert.alert('Error', 'User not found. Please log in again.');
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/like-post`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, userId: savedUserId }),
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

    const handleComment = async (postId, commentText) => {
        if (!savedUserId) {
            Alert.alert('Error', 'User not found. Please log in again.');
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/add-comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, userId: savedUserId, commentText }),
            });

            const data = await response.json();
            if (data.success) {
                setActiveCommentPostId(null);
                setNewCommentText('');
                fetchFeed(savedUserId); // Refresh feed to show new comments
            } else {
                Alert.alert('Error', data.message || 'Failed to add comment.');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            Alert.alert('Error', 'Failed to add comment. Please try again.');
        }
    };

    const renderPost = ({ item }) => {
        console.log('Rendering post:', {
            artistName: item.artist_name,
            profilePicture: item.artist_profile_picture,
            postContent: item.content,
        });
    
        return (
            <View style={dashboardStyles.postContainer}>
                {/* Post Header */}
                <View style={dashboardStyles.postHeader}>
                    {/* Display artist profile picture */}
                    <Image
                        source={
                            item.artist_profile_picture
                                ? { uri: item.artist_profile_picture } // Use artist's profile picture URL
                                : require('../../assets/profile/profile-image.jpg') // Fallback to default image
                        }
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
                                source={require('../../assets/icons/icons8-blue-tick.png')}
                                style={dashboardStyles.verifiedIcon}
                            />
                        </View>
                        <Text style={dashboardStyles.timestamp}>{new Date(item.created_at).toLocaleString()}</Text>
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
                            source={require('../../assets/icons/8542029_heart_love_like_icon.png')}
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
                            source={require('../../assets/icons/icons8-comment.png')}
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
        <View style={dashboardStyles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderPost}
                contentContainerStyle={dashboardStyles.feedContainer}
            />
            <NavigationBar />
        </View>
    );
};

export default DashboardScreen;
