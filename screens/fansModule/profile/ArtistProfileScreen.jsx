import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native';
import artistProfileStyles from '../../../styles/artist/artistProfileStyles';
import artistPostStyles from '../../../styles/artist/artistPostStyles';
import dashboardStyles from '../../../styles/dashboardStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavigationBar from '../../components/NavigationBar';
import Player from '../../components/Player';

const ArtistProfileScreen = () => {
    const BASE_URL = "https://www.exversio.com:3000"; // Replace 3000 with your server's port


    const [content, setContent] = useState('');
    const [media, setMedia] = useState(null);
    const [artistNames, setArtistNames] = useState('Unknown Artist');
    const [posts, setPosts] = useState([]);
    const [artistId, setArtistId] = useState(null);
    const [artistBio, setArtistBio] = useState(null);
    const [artistSubscriptionPrice, setArtistSubscriptionPrice] = useState(null);
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
  
                  // Fetch the artist ID and name
                  const response = await fetch(`${BASE_URL}/get-artist-id?userId=${storedUserId}`);
                  const data = await response.json();
  
                  if (data.success) {
                      setArtistId(data.artistId);
                      setArtistNames(data.artistNames);
  
                      // Fetch additional artist request details if artist ID is found
                      const responseArtistData = await fetch(`${BASE_URL}/get-artist-request?user_id=${storedUserId}`);
                      const dataArtistData = await responseArtistData.json();
  
                      if (dataArtistData.success) {
                          setArtistBio(dataArtistData.artistRequest.bio);
                          setArtistSubscriptionPrice(dataArtistData.artistRequest.subscriptionPrice);
                      } else {
                          console.warn('No artist request found for this user');
                      }
                  } else {
                      Alert.alert('Notice', data.message || 'User is not an approved artist');
                      navigation.navigate('DashboardScreen');
                  }
              }
          } catch (error) {
              console.error('Error fetching artist ID and user details:', error);
              Alert.alert('Error', 'Failed to fetch artist details');
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
            console.log('Fetch posts response:', data);
            if (data.success && Array.isArray(data.posts)) {
                setPosts(data.posts);
              
            } else {
                console.warn("Unexpected data format:", data);
                setPosts([]);
            }
          //   if (data.success && Array.isArray(data.posts) && data.posts.length > 0) {
          //     const firstPostArtistName = data.posts[0].artist_name;
          //     console.log('Artist Name from the first post:', firstPostArtistName);
          // }
          
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


    

    
    
    
    
    const handleComment = async (postId, commentText) => {
        try {
            const storedUserId = await AsyncStorage.getItem('userId');
            const userId = storedUserId ? parseInt(storedUserId, 10) : null;

            if (!userId) {
                Alert.alert('Error', 'User not found. Please log in again.');
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
            console.log('Comment response data:', data); // Log for debugging

            if (data.success) {
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
            if (!userId) {
                Alert.alert('Error', 'User not found. Please log in again.');
                return;
            }

            const response = await fetch(`${BASE_URL}/like-post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId, userId }),
            });

            const data = await response.json();
            console.log('Like response data:', data);

            if (data.success) {
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post.id === postId
                            ? {
                                ...post,
                                isLiked: !post.isLiked,
                                likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
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

  const renderHeader = ({item}) => (
    <View>
      <View style={artistProfileStyles.headerContainer}>
        <Image source={require('../../../assets/profile/profile-image.jpg')} style={artistProfileStyles.coverImage} />
        <View style={artistProfileStyles.artistInfoContainer}>
          <View style={artistProfileStyles.profileContainer}>
            <Image source={require('../../../assets/profile/profile-image.jpg')} style={artistProfileStyles.profileImage} />
          </View>
          <Text style={artistProfileStyles.artistName}>{artistNames}</Text>
          <Text style={artistProfileStyles.artistDescription}>
            {artistBio}
          </Text>
          <TouchableOpacity style={artistProfileStyles.subscribeButton}>
            <Text style={artistProfileStyles.subscribeButtonText}>Subscribe €{artistSubscriptionPrice} per month</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={artistProfileStyles.tabsContainer}>
        <TouchableOpacity style={artistProfileStyles.tabButtonActive}>
          <Text style={artistProfileStyles.tabButtonTextActive}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={artistProfileStyles.tabButton}>
          <Text style={artistProfileStyles.tabButtonText}>Music</Text>
        </TouchableOpacity>
        <TouchableOpacity style={artistProfileStyles.tabButton}>
          <Text style={artistProfileStyles.tabButtonText}>Videos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={artistProfileStyles.tabButton}>
          <Text style={artistProfileStyles.tabButtonText}>Pictures</Text>
        </TouchableOpacity>
        <TouchableOpacity style={artistProfileStyles.tabButton}>
          <Text style={artistProfileStyles.tabButtonText}>About</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPost = ({ item }) => (
    <View style={dashboardStyles.postContainer}>
        <View style={dashboardStyles.postHeader}>
            <Image source={require('../../../assets/profile/profile-image.jpg')} style={dashboardStyles.avatar} />
            <View style={dashboardStyles.userInfo}>
                <View style={dashboardStyles.userRow}>
                    <Text style={dashboardStyles.username} onPress={() => navigation.navigate('ArtistProfileScreen')}>
                        {item.artist_name || 'Unknown Artist'}
                    </Text>
                    <Image source={require('../../../assets/icons/icons8-blue-tick.png')} style={dashboardStyles.verifiedIcon} />
                </View>
                <Text style={dashboardStyles.timestamp}>{item.timestamp}</Text>
            </View>
        </View>

        <Text style={dashboardStyles.postText}>{item.content}</Text>

        {item.media_url && item.media_type === 'image' && (
            <Image source={{ uri: item.media_url }} style={artistPostStyles.postMedia} />
        )}

        {item.media_url && item.media_type === 'audio' && (
            <View style={artistPostStyles.audioContainer}>
                <Text>Audio file: {item.media_url}</Text>
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
            <Text style={dashboardStyles.commentCount}>{item.comments ? item.comments.length : 0}</Text>
            <TouchableOpacity onPress={() => setActiveCommentPostId(item.id)}>
                <Image source={require('../../../assets/icons/icons8-comment.png')} style={dashboardStyles.actionIconComment} />
            </TouchableOpacity>
        </View>

        {activeCommentPostId === item.id && (
            <View style={dashboardStyles.commentInputContainer}>
                <TextInput
                    style={dashboardStyles.commentInput}
                    placeholder="Write a comment..."
                    value={newCommentText}
                    onChangeText={setNewCommentText}
                />
                <TouchableOpacity onPress={() => handleComment(item.id, newCommentText)}>
                    <Text style={dashboardStyles.commentSubmitButton}>Submit</Text>
                </TouchableOpacity>
            </View>
        )}

        {item.comments && item.comments.map((comment) => (
            <View key={comment.id} style={dashboardStyles.commentContainer}>
                <Text style={dashboardStyles.commentText}>{comment.text}</Text>
            </View>
        ))}
    </View>
);

  return (
    <View style={artistProfileStyles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        renderItem={renderPost}
      />
      <Player />
      <NavigationBar />
    </View>
  );
};

export default ArtistProfileScreen;
