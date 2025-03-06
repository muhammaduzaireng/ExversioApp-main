import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, TextInput, Alert, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dashboardStyles from '../../styles/dashboardStyles'; // Ensure this path is correct
import artistPostStyles from '../../styles/artist/artistPostStyles';
import NavigationBar from '../components/NavigationBar';
import { useNavigation } from '@react-navigation/native';
import { useProgress } from "react-native-track-player";
import Slider from "@react-native-community/slider";
import { usePlayer } from "../../screens/components/PlayerContext"; // Import usePlayer
import Player from "../components/Player"; // Import the Player component
import Header from '../components/Header';
import DiscoverScreen from '../discover/DiscoverScreen';
import LibraryScreen from '../library/LibraryScreen';
import ProfileScreen from '../profile/ProfileScreen'; 

const DashboardScreen = () => {
  const navigation = useNavigation();
  const { playMusic, pauseMusic, currentMusic, isPlaying, setIsPlaying } = usePlayer();
  const BASE_URL = "https://api.exversio.com";
  const [posts, setPosts] = useState([]);
  const [savedUserId, setSavedUserId] = useState(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [selectedScreen, setSelectedScreen] = useState('DashboardScreen');
  const [selectedTab, setSelectedTab] = useState('All');
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // Track pull-to-refresh state
  const progress = useProgress();

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
      const response = await fetch(`${BASE_URL}/get-feed?userId=${userId}`);
      const data = await response.json();

      if (data.success && Array.isArray(data.posts)) {
        const postsWithFullUrls = data.posts.map((post) => ({
          ...post,
          artist_profile_picture: post.artist_profile_picture
            ? post.artist_profile_picture.startsWith("http")
              ? post.artist_profile_picture
              : `${BASE_URL}${post.artist_profile_picture}`
            : null, // Keep null if profile picture is missing
        }));

        setPosts(postsWithFullUrls);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching feed:", error);
      Alert.alert("Error", "Failed to fetch feed.");
    } finally {
      setRefreshing(false); // Stop the refreshing indicator
    }
  };

  // Handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    if (savedUserId) {
      fetchFeed(savedUserId);
    }
  };

  useEffect(() => {
    navigation.setOptions({ gestureEnabled: false });
  }, [navigation]);

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

  const handleNavigationClick = (screen) => {
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

  // Render dynamic content based on selectedScreen
  const renderContent = () => {
    switch (selectedScreen) {
      case 'DiscoverScreen':
        return <DiscoverScreen />;
      case 'LibraryScreen':
        return <LibraryScreen />;
      case 'ProfileScreen':
        return <ProfileScreen />;
      case 'DashboardScreen':
      default:
        return (
          <View style={dashboardStyles.container}>
            <Header selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
            <FlatList
              data={filterPosts()}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderPost}
              contentContainerStyle={artistPostStyles.feedContainer}
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
        {/* Post Header */}
        <View style={dashboardStyles.postHeader}>
          <Image
            source={item.artist_profile_picture ? { uri: item.artist_profile_picture } : require('../../assets/profile/profile-image.jpg')}
            style={dashboardStyles.avatar}
          />
          <View style={dashboardStyles.userInfo}>
            <View style={dashboardStyles.usernameContainer}>
              <Text 
                style={dashboardStyles.username} 
                onPress={() => navigation.replace('ArtistProfileScreen', { artistId: item.artist_id })}
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
        {completeUrl && item.media_type === 'image' && <Image source={{ uri: completeUrl }} style={artistPostStyles.postMedia} />}

        {completeUrl && item.media_type === 'audio' && (
          <View style={dashboardStyles.trackContainer}>
            <View style={dashboardStyles.row}>
              <Image source={item.artist_profile_picture ? { uri: item.artist_profile_picture } : require("../../assets/profile/profile-image.jpg")} style={dashboardStyles.trackAvatar} />
              <View style={dashboardStyles.info}>
                <Text style={dashboardStyles.trackTitle} numberOfLines={1}>{item.music_title || 'Unknown Track'}</Text>
              </View>
              <TouchableOpacity onPress={() => playMusic({
                music_id: item.id,
                file_url: completeUrl,
                music_title: item.music_title || 'Track Title',
                artist_name: item.artist_name || 'Artist Name',
                profile_picture: item.artist_profile_picture || 'https://placekitten.com/300/300'
              })}>
                <Image
                  source={isPlayingCurrent ? require("../../assets/icons/icons8-pause-90.png") : require("../../assets/icons/211876_play_icon.png")}
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
                  {`${comment?.user_username || 'Anonymous'}: `}
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
      {renderContent()}
      {/* Ensure the Player component is rendered at the bottom */}
      <Player />
      <NavigationBar selectedScreen={selectedScreen} onNavigationClick={handleNavigationClick} />
    </View>
  );
};

export default DashboardScreen;