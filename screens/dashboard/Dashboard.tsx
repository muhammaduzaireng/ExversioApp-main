import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, TextInput, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dashboardStyles from '../../styles/dashboardStyles'; // Ensure this path is correct
import artistPostStyles from '../../styles/artist/artistPostStyles';
import NavigationBar from '../components/NavigationBar';
import { useNavigation } from '@react-navigation/native';
import ProfileScreen from '../profile/ProfileScreen';
import DiscoverScreen from '../discover/DiscoverScreen';
import LibraryScreen from '../library/LibraryScreen';
import Header from '../components/Header';
import TrackPlayer, { usePlaybackState, State as TrackPlayerState, useProgress } from "react-native-track-player";
import Slider from "@react-native-community/slider";
import trackPlayerSetup from '../player/trackPlayerSetup'; // Make sure to create this setup file
import { formatTime } from '../components/Utils'; // Import the formatTime function

const DashboardScreen = () => {
    const navigation = useNavigation();
    const BASE_URL = "https://api.exversio.com";
    const [posts, setPosts] = useState([]);
    const [savedUserId, setSavedUserId] = useState(null);
    const [activeCommentPostId, setActiveCommentPostId] = useState(null);
    const [newCommentText, setNewCommentText] = useState('');
    const [selectedScreen, setSelectedScreen] = useState('DashboardScreen');
    const [selectedTab, setSelectedTab] = useState('All');
    const [currentPlaying, setCurrentPlaying] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const progress = useProgress();
  
    // Initialize TrackPlayer
    const trackPlayerSetup = async () => {
      await TrackPlayer.setupPlayer();
      TrackPlayer.updateOptions({
        stopWithApp: true,
        capabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_STOP,
        ],
        compactCapabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
        ],
      });
    };
  
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
  
    // Setup TrackPlayer
    useEffect(() => {
      trackPlayerSetup(); // Initialize track player
    }, []);
  
    // Fetch feed for subscribed artists
    const fetchFeed = async (userId) => {
      try {
        console.log("Fetching feed for userId:", userId);
        const response = await fetch(`${BASE_URL}/get-feed?userId=${userId}`);
        const data = await response.json();
  
        if (data.success && Array.isArray(data.posts)) {
          console.log("Fetched posts:", data.posts);
  
          // Transform profile picture URLs to include the base URL
          const postsWithFullUrls = data.posts.map((post) => ({
            ...post,
            artist_profile_picture: post.artist_profile_picture
              ? post.artist_profile_picture.startsWith("http")
                ? post.artist_profile_picture
                : `${BASE_URL}${post.artist_profile_picture}`
              : null, // Keep null if profile picture is missing
          }));
  
          // Log the transformed posts with full URLs
          postsWithFullUrls.forEach((post, index) => {
            console.log(`Post ${index + 1}:`, {
              artistName: post.artist_name,
              profilePicture: post.artist_profile_picture,
              postContent: post.content,
              comments: post.comments.map((comment, commentIndex) => ({
                commentText: comment.text,
                userName: comment.user_name, // Full name of the user
                userUsername: comment.user_username, // Username of the user
              })),
            });
          });
  
          setPosts(postsWithFullUrls);
        } else {
          console.warn("Unexpected data format:", data);
          setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching feed:", error);
        Alert.alert("Error", "Failed to fetch feed.");
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
  
    const handleNavigationClick = (screen) => {
      setSelectedScreen(screen); // Update the selected screen
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
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderPost}
                contentContainerStyle={dashboardStyles.feedContainer}
              />
            </View>
          );
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
                <Text style={dashboardStyles.username} onPress={() => navigation.replace('ArtistProfileScreen', { artistId: item.artist_id })}>
                  {item.artist_name || 'Unknown Artist'}
                  <Image source={require('../../assets/icons/icons8-blue-tick.png')} style={dashboardStyles.verifiedIcon} />
                </Text>
                
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
                  <TouchableOpacity onPress={() => playMusic(completeUrl)}>
                    <Image
                      source={isPlayingCurrent ? require("../../assets/icons/icons8-pause-90.png") : require("../../assets/icons/211876_play_icon.png")}
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
        <NavigationBar selectedScreen={selectedScreen} onNavigationClick={handleNavigationClick} />
      </View>
    );
  };


export default DashboardScreen;
