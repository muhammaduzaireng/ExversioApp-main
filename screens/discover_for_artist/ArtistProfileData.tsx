import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native';
import artistProfileStyles from '../../styles/artist/artistProfileStyles';
import artistPostStyles from '../../styles/artist/artistPostStyles';
import dashboardStyles from '../../styles/dashboardStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ArtistNavigationBar from '../components/ArtistNavigationBar';
import Player from '../components/Player';
import { useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { set } from 'mongoose';


type ArtistProfileDataNavigationProp = StackNavigationProp<any, 'ArtistProfileData'>;


const ArtistProfileData = () => {
    const BASE_URL = "https://api.exversio.com"; // Replace 3000 with your server's port
    const navigation = useNavigation<ArtistProfileDataNavigationProp>();
    const route = useRoute();
    const { user_id } = route.params; // Retrieve user_id from route params
   
    const [content, setContent] = useState('');
    const [media, setMedia] = useState(null);
    const [artistNames, setArtistNames] = useState('Unknown Artist');
    const [posts, setPosts] = useState([]);
    const [artistId, setArtistId] = useState(null);
    const [artistBio, setArtistBio] = useState(null);
    const [artistSubscriptionPrice, setArtistSubscriptionPrice] = useState(null);
    const [activeCommentPostId, setActiveCommentPostId] = useState(null);
    const [newCommentText, setNewCommentText] = useState('');
    const [savedUserId, setSavedUserId] = useState(null); // Initialize savedUserId
    const [passedArtistId, setPassedArtistId] = useState(null);
    const [selectedTab, setSelectedTab] = useState('All'); 
    const [artistProfilePicture, setArtistProfilePicture] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [artists, setArtists] = useState<Artist[]>([]);

   console.log('User ID:', user_id);

    // Fetch artistId and artist details based on user_id passed in props
    useEffect(() => {
        const fetchApprovedArtists = async (user_id) => {
            console.log("Fetching artist data for user ID:", user_id);
    
            try {
                const response = await fetch(`${BASE_URL}/approved-artists?userId=${user_id}`);
                const data = await response.json();
    
                if (data.success) {
                    // Find the specific artist with the given user_id
                    const artist = data.artists.find((artist) => artist.user_id === user_id);
    
                    if (artist) {
                        // Transform the profile_picture URL for the specific artist
                        const transformedArtist = {
                            ...artist,
                            profile_picture: artist.profile_picture
                                ? artist.profile_picture.startsWith("http")
                                    ? artist.profile_picture
                                    : `${BASE_URL}${artist.profile_picture}`
                                : null, // Handle null profile_picture gracefully
                        };
    
                        // Update state with the specific artist's data
                        setArtists([transformedArtist]);
    
                        // Debug log to confirm the transformation
                        console.log("Transformed Artist with Full URL:", transformedArtist);
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
                // Fetch artist ID and name based on user_id
                const response = await fetch(`${BASE_URL}/get-artist-id?userId=${user_id}`);
                const data = await response.json();
                const responseUserProfileData = await fetch(`${BASE_URL}/getUserProfile?user_id=${user_id}`);
                        const dataUserProfileData = await responseUserProfileData.json();

                        if (dataUserProfileData.success) {
                            setArtistBio(dataUserProfileData.userProfile.bio);
                        }
                        console.log('Artist Bio:', dataUserProfileData.userProfile.bio);
    
                if (data.success) {
                    setArtistId(data.artistId);
                    setArtistNames(data.artistNames);
    
                    const profilePicture = data.profile_picture
                        ? data.profile_picture.startsWith("http")
                            ? data.profile_picture
                            : `${BASE_URL}${data.profile_picture}`
                        : null; // Handle null profile_picture gracefully
    
                    setArtistProfilePicture(profilePicture);
    
                    // Fetch additional artist details (bio, subscription price) if artist ID is found
                    const responseArtistData = await fetch(`${BASE_URL}/get-artist-request?user_id=${user_id}`);
                    const dataArtistData = await responseArtistData.json();
                    const responseUserProfileData = await fetch(`${BASE_URL}/getUserProfile?userId=${user_id}`);
                        const dataUserProfileData = await responseUserProfileData.json();
                        if(dataUserProfileData.success){    
                        setArtistBio(dataUserProfileData.data.bio);
                        setCoverImage(`${BASE_URL}${dataUserProfileData.data.coverImage}`);

                        }
    
                    if (dataArtistData.success) {
                        // setArtistBio(dataArtistData.artistRequest.bio);
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
            }
        };
    
        // Ensure `user_id` is passed to the function
        if (user_id) {
            fetchApprovedArtists(user_id);
            fetchArtistData();
        } else {
            console.warn("No user ID provided");
        }
    }, [user_id]);
    
    
    
    
    
   

    
  

  
      
      

    // Fetch posts for the artist using the artistId and user_id
    const fetchPosts = async () => {
        if (!artistId || !savedUserId) return;
        try {
            const response = await fetch(`${BASE_URL}/get-posts?artistId=${artistId}&userId=${savedUserId}`);
            const data = await response.json();
            
            console.log('Fetched posts data:', data);
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
                    setSavedUserId(parseInt(storedUserId, 10)); // Set saved userId in state
                }
            } catch (error) {
                console.error('Error fetching saved userId:', error);
            }
        };

        fetchSavedUserId();
    }, []);

    useEffect(() => {
        if (artistId && savedUserId) {
            fetchPosts(); // Fetch posts when artistId and savedUserId are available
        }
    }, [artistId, savedUserId]);

  
    

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
    const handleSubscribe = async () => {
        try {
            const storedUserId = await AsyncStorage.getItem('userId'); // Saved user_id
            if (!storedUserId) {
                Alert.alert('Error', 'User not found. Please log in again.');
                return;
            }
    
            const response = await fetch(`${BASE_URL}/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: parseInt(storedUserId, 10), // User ID from AsyncStorage
                    artist_id: artistId, // Artist ID passed from the page
                }),
            });
    
            const data = await response.json();
            if (data.success) {
                Alert.alert('Success', 'Subscribed successfully!');
            } else {
                Alert.alert('Error', data.message || 'Failed to subscribe.');
            }
        } catch (error) {
            console.error('Error subscribing:', error);
            Alert.alert('Error', 'Failed to subscribe. Please try again.');
        }
    };
    
    
    
    const renderHeader = () => {
       
        return (
            <View>
                <View style={artistProfileStyles.headerContainer}>
                    {/* Cover Image */}
                    <Image
    source={
        coverImage
            ? { uri: coverImage } // Use the state variable if it exists
            : require('../../assets/profile/profile-image.jpg') // Fallback to default
    }
    style={artistProfileStyles.coverImage}
/>
                    
                    {/* Artist Info */}
                    <View style={artistProfileStyles.artistInfoContainer}>
                    
    {artists.map((artist) => (
        <View key={artist.id} style={artistProfileStyles.profileContainer}>
            {artist.profile_picture ? (
                <Image
                    source={{ uri: artist.profile_picture }}
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
                        >
                            <Text style={artistProfileStyles.subscribeButtonText}>
                                Subscribe €{artistSubscriptionPrice || '0'} per month
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
    
                {/* Tabs */}
                <View style={artistProfileStyles.tabsContainer}>
                    <TouchableOpacity style={artistProfileStyles.tabButtonActive}>
                        <Text style={artistProfileStyles.tabButtonTextActive}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            artistProfileStyles.tabButton,
                            selectedTab === 'Music' && artistProfileStyles.tabButtonActive,
                        ]}
                        onPress={() => {
                            navigation.navigate('ArtistAlbums', { artistId }); // Navigate to ArtistAlbum and pass artistId
                            console.log(artistId);
                        }}
                    >
                        <Text
                            style={
                                selectedTab === 'Music'
                                    ? artistProfileStyles.tabButtonTextActive
                                    : artistProfileStyles.tabButtonText
                            }
                        >
                            Music
                        </Text>
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
    };
    
  
    

    const renderPost = ({ item }) => (
        <View style={dashboardStyles.postContainer}>
            {/* Post Header */}
            
            <View style={dashboardStyles.postHeader}>
                
            <View style={dashboardStyles.avatarContainer}>
    {artists.map((artist) => (
        <View key={artist.id} style={dashboardStyles.avatarWrapper}>
            {artist.profile_picture ? (
                <Image
                    source={{ uri: artist.profile_picture }}
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
        <View style={artistProfileStyles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={renderHeader}
                renderItem={renderPost}
            />
            <Player />
            <ArtistNavigationBar />
        </View>
    );
};

export default ArtistProfileData;
