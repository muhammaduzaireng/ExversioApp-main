import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import artistProfileStyles from '../../styles/artist/artistProfileStyles';
import artistPostStyles from '../../styles/artist/artistPostStyles';
import dashboardStyles from '../../styles/dashboardStyles';
import Player from '../components/Player';
import ArtistAlbums from './ArtistAlbums';
import { usePlayer } from '../../screens/components/PlayerContext'; // Import usePlayer

type ArtistProfileDataNavigationProp = StackNavigationProp<any, 'ArtistProfileData'>;

const ArtistProfileData = ({ artistId, user_id, artistName, profilePicture, onBack }) => {
  const BASE_URL = "https://api.exversio.com"; // Replace with your server's URL
  const navigation = useNavigation<ArtistProfileDataNavigationProp>();
  const { playMusic, isPlaying, currentPlaying } = usePlayer(); // Use the playMusic function from the context

  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [artistNames, setArtistNames] = useState('Unknown Artist');
  const [posts, setPosts] = useState([]);
  const [artistBio, setArtistBio] = useState(null);
  const [artistSubscriptionPrice, setArtistSubscriptionPrice] = useState(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [savedUserId, setSavedUserId] = useState(null); // Initialize savedUserId
  const [selectedTab, setSelectedTab] = useState('All');
  const [coverImage, setCoverImage] = useState(null);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false); // New state for subscription status

  useEffect(() => {
    const fetchApprovedArtists = async (user_id) => {
      try {
        const response = await fetch(`${BASE_URL}/approved-artists?userId=${user_id}`);
        const data = await response.json();

        if (data.success) {
          const artist = data.artists.find((artist) => artist.user_id === user_id);

          if (artist) {
            const transformedArtist = {
              ...artist,
              profile_picture: artist.profile_picture
                ? artist.profile_picture.startsWith("http")
                  ? artist.profile_picture
                  : `${BASE_URL}${artist.profile_picture}`
                : null,
            };

            setArtists([transformedArtist]);
          } else {
            Alert.alert("Error", "Artist not found for the given user ID");
          }
        } else {
          Alert.alert("Error", "Failed to load artist data");
        }
      } catch (error) {
        console.error("Error fetching artist:", error);
        Alert.alert("Error", "Failed to load artist data");
      }
    };

    const fetchArtistData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/get-artist-id?userId=${user_id}`);
        const data = await response.json();
        const responseUserProfileData = await fetch(`${BASE_URL}/getUserProfile?userId=${user_id}`);
        const dataUserProfileData = await responseUserProfileData.json();
        if (dataUserProfileData.success) {
          setArtistBio(dataUserProfileData.data.bio);
          setCoverImage(`${BASE_URL}${dataUserProfileData.data.coverImage}`);
        }

        if (data.success) {
          setArtistNames(data.artistNames);

          const profilePicture = data.profile_picture
            ? data.profile_picture.startsWith("http")
              ? data.profile_picture
              : `${BASE_URL}${data.profile_picture}`
            : null;

          const responseArtistData = await fetch(`${BASE_URL}/get-artist-request?user_id=${user_id}`);
          const dataArtistData = await responseArtistData.json();

          if (dataArtistData.success) {
            setArtistSubscriptionPrice(dataArtistData.artistRequest.subscriptionPrice);
          } else {
            console.warn("No artist request found for this user");
          }
        } else {
          Alert.alert("Notice", data.message || "User is not an approved artist");
        }
      } catch (error) {
        console.error("Error fetching artist ID and details:", error);
        Alert.alert("Error", "Failed to fetch artist details");
      } finally {
        setLoading(false);
      }
    };

    if (user_id) {
      fetchApprovedArtists(user_id);
      fetchArtistData();
    } else {
      console.warn("No user ID provided");
    }
  }, [user_id]);

  const fetchPosts = async () => {
    if (!artistId || !savedUserId) return;
    try {
      const response = await fetch(`${BASE_URL}/get-posts?artistId=${artistId}&userId=${savedUserId}`);
      const data = await response.json();

      if (data.success && Array.isArray(data.posts)) {
        setPosts(data.posts);
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
    const fetchSavedUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setSavedUserId(parseInt(storedUserId, 10));
        }
      } catch (error) {
        console.error('Error fetching saved userId:', error);
      }
    };

    fetchSavedUserId();
  }, []);

  useEffect(() => {
    if (artistId && savedUserId) {
      fetchPosts();
      checkSubscriptionStatus(); // Check subscription status
    }
  }, [artistId, savedUserId]);

  const checkSubscriptionStatus = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/check-subscription?user_id=${savedUserId}&artist_id=${artistId}`
      );
      const data = await response.json();
      if (data.success) {
        setIsSubscribed(data.subscribed);
      } else {
        console.error('Failed to check subscription status:', data.message);
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

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
      if (data.success) {
        setActiveCommentPostId(null);
        setNewCommentText('');
        fetchPosts();
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
                  like_count: post.isLiked
                    ? post.like_count - 1
                    : post.like_count + 1,
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

  const handleSubscribe = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      if (!storedUserId) {
        Alert.alert('Error', 'User not found. Please log in again.');
        return;
      }

      const response = await fetch(`${BASE_URL}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: parseInt(storedUserId, 10),
          artist_id: artistId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert('Success', 'Subscribed successfully!');
        setIsSubscribed(true); // Update subscription status
      } else {
        Alert.alert('Error', data.message || 'Failed to subscribe.');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      Alert.alert('Error', 'Failed to subscribe. Please try again.');
    }
  };

  const renderHeader = useCallback(() => {
    return (
      <View style={artistProfileStyles.headerContainer}>
        {/* Cover Image */}
        <Image
          source={
            coverImage
              ? { uri: coverImage }
              : require('../../assets/profile/profile-image.jpg')
          }
          style={artistProfileStyles.coverImage}
        />

        {/* Artist Info */}
        <View style={artistProfileStyles.artistInfoContainer}>
          {artists.map((artist) => (
            <View key={artist.id} style={artistProfileStyles.profileContainer}>
              {profilePicture ? (
                <Image
                  source={{ uri: profilePicture }}
                  style={artistProfileStyles.profileImage}
                />
              ) : (
                <Image
                  source={require("../../assets/profile/profile-image.jpg")}
                  style={artistProfileStyles.profileImage}
                />
              )}
            </View>
          ))}

          {/* Artist Name and Bio */}
          <Text style={artistProfileStyles.artistName}>
            {artistNames || 'Unknown Artist'}
          </Text>
          <Text style={artistProfileStyles.artistDescription}>
            {artistBio || 'No bio available'}
          </Text>

          {/* Subscribe Button */}
          <TouchableOpacity
            style={artistProfileStyles.subscribeButton}
            onPress={handleSubscribe}
            disabled={isSubscribed} // Disable the button if already subscribed
          >
            <Text style={artistProfileStyles.subscribeButtonText}>
              {isSubscribed ? 'Subscribed' : `Subscribe €${artistSubscriptionPrice || '0'} per month`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={artistProfileStyles.tabsContainer}>
          <TouchableOpacity
            style={selectedTab === 'All' ? artistProfileStyles.tabButtonActive : artistProfileStyles.tabButton}
            onPress={() => setSelectedTab('All')}
          >
            <Text style={selectedTab === 'All' ? artistProfileStyles.tabButtonTextActive : artistProfileStyles.tabButtonText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={selectedTab === 'Music' ? artistProfileStyles.tabButtonActive : artistProfileStyles.tabButton}
            onPress={() => setSelectedTab('Music')}
          >
            <Text style={selectedTab === 'Music' ? artistProfileStyles.tabButtonTextActive : artistProfileStyles.tabButtonText}>Music</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={selectedTab === 'Videos' ? artistProfileStyles.tabButtonActive : artistProfileStyles.tabButton}
            onPress={() => setSelectedTab('Videos')}
          >
            <Text style={selectedTab === 'Videos' ? artistProfileStyles.tabButtonTextActive : artistProfileStyles.tabButtonText}>Videos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={selectedTab === 'Pictures' ? artistProfileStyles.tabButtonActive : artistProfileStyles.tabButton}
            onPress={() => setSelectedTab('Pictures')}
          >
            <Text style={selectedTab === 'Pictures' ? artistProfileStyles.tabButtonTextActive : artistProfileStyles.tabButtonText}>Pictures</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={selectedTab === 'About' ? artistProfileStyles.tabButtonActive : artistProfileStyles.tabButton}
            onPress={() => setSelectedTab('About')}
          >
            <Text style={selectedTab === 'About' ? artistProfileStyles.tabButtonTextActive : artistProfileStyles.tabButtonText}>About</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [coverImage, artists, profilePicture, artistNames, artistBio, artistSubscriptionPrice, selectedTab, isSubscribed]);

  const cachedHeader = useMemo(renderHeader, [renderHeader]);

  const renderPost = ({ item }) => {
    const completeUrl = item.media_url 
      ? (item.media_url.startsWith("http") ? item.media_url : `${BASE_URL}${item.media_url}`) 
      : null;
    const isPlayingCurrent = currentPlaying === completeUrl && isPlaying;
    console.log(item);

    return (
      <View style={dashboardStyles.postContainer}>
        {/* Post Header */}
        <View style={dashboardStyles.postHeader}>
        <View style={dashboardStyles.avatarContainer}>
          {artists.map((artist) => (
            <View key={artist.id} style={dashboardStyles.avatarWrapper}>
              {profilePicture ? (
                <Image
                  source={{ uri: profilePicture }}
                  style={dashboardStyles.avatar}
                />
              ) : (
                <Image
                  source={require("../../assets/profile/profile-image.jpg")}
                  style={dashboardStyles.avatar}
                />
              )}
            </View>
          ))}
        </View>

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
          <Text style={dashboardStyles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
        </View>
      </View>
        

        {/* Post Content */}
        <Text style={dashboardStyles.postText}>{item.content}</Text>

        {/* Media Display */}
        {completeUrl && item.media_type === 'image' && <Image source={{ uri: completeUrl }} style={artistPostStyles.postMedia} />}

        {completeUrl && item.media_type === 'audio' && (
          <View style={dashboardStyles.trackContainer}>
            <View style={dashboardStyles.row}>
              <Image source={profilePicture ? { uri: profilePicture } : require("../../assets/profile/profile-image.jpg")} style={dashboardStyles.trackAvatar} />
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
    <View style={artistProfileStyles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {selectedTab === 'All' ? (
            <FlatList
              data={posts}
              keyExtractor={(item) => item.id.toString()}
              ListHeaderComponent={cachedHeader}
              renderItem={renderPost}
            />
          ) : (
            <>
              {cachedHeader}
              <View style={artistProfileStyles.tabContent}>
                {selectedTab === 'Music' && (
                  <ArtistAlbums artistId={artistId} profilePicture={profilePicture} />
                )}
                {selectedTab === 'Videos' && (
                  <Text>Videos content goes here</Text>
                )}
                {selectedTab === 'Pictures' && (
                  <Text>Pictures content goes here</Text>
                )}
                {selectedTab === 'About' && (
                  <Text>About content goes here</Text>
                )}
              </View>
            </>
          )}
        </>
      )}
      <Player />
    </View>
  );
};

export default ArtistProfileData;