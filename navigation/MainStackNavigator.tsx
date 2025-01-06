// navigation/MainStackNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { StripeProvider } from '@stripe/stripe-react-native';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import VerificationScreen from '../screens/VerificationScreen';
import RecoverPasswordScreen from '../screens/RecoverPasswordScreen';
import RecoverPasOtp from '../screens/RecoverPassOtp';
import CreateNewPass from '../screens/CreateNewPass';
import GoogleLogin from '../screens/GoogleLogin';
import AppleLogin from '../screens/AppleLogin';
import DashboardScreen from '../screens/dashboard/Dashboard';
import DiscoverScreen from '../screens/discover/DiscoverScreen';
import Player from '../screens/components/Player';
import PlayerMaximize from '../screens/player/PlayerMaximize';
import ExampleComponent from '../screens/ExampleComponent';
import SearchScreen from '../screens/discover/SearchScreen';
import LibraryScreen from '../screens/library/LibraryScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ArtistPostScreen from '../screens/fansModule/post/ArtistPostScreen';
import ArtistProfileScreen from '../screens/fansModule/profile/ArtistProfileScreen';
import PaymentScreen from '../screens/profile/payments/PaymentScreen';
import PayPalScreen from '../screens/profile/payments/PayPalScreen';
import GooglePayScreen from '../screens/profile/payments/GooglePayScreen';
import ApplePayScreen from '../screens/profile/payments/ApplePayScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import MobileNumberScreen from '../screens/MobileNumberScreen';
import OtpVerificationScreen from '../screens/OtpVerificationScreen ';
import ProfileDataScreen from '../screens/ProfileDataScreen';
import ArtistNavigationBar from '../screens/components/ArtistNavigationBar';
import BecomeArtistForm from '../screens/artist/BecomeArtistForm';
import ArtistProfileData from '../screens/discover/ArtistProfileData';
import MusicLibraryPage from '../screens/artist/MusicLibraryPage';
import ArtistAlbums from '../screens/discover/ArtistAlbums';
import CreatePost from '../screens/components/CreatePost';
import ArtistProfileDataForArtist from '../screens/discover_for_artist/ArtistProfileData';
import DiscoverScreenForArtist from '../screens/discover_for_artist/DiscoverScreenForArtist';
import ProfileScreenArtist from '../screens/profile/ProfileScreenArtist';



const Stack = createStackNavigator();

const MainStackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Verification" component={VerificationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RecoverPassword" component={RecoverPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RecoverPassOtp" component={RecoverPasOtp} options={{ headerShown: false }} />
        <Stack.Screen name="CreateNewPass" component={CreateNewPass} options={{ headerShown: false }} />
        
        <Stack.Screen name="GoogleLogin" component={GoogleLogin} options={{ headerShown: false }} />
        <Stack.Screen name="AppleLogin" component={AppleLogin} options={{ headerShown: false }} />
        <Stack.Screen name="DashboardScreen" component={DashboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DiscoverScreen" component={DiscoverScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Player" component={Player} options={{ headerShown: false }} />
        <Stack.Screen name="PlayerMaximize" component={PlayerMaximize} options={{ headerShown: false }} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LibraryScreen" component={LibraryScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ArtistPostScreen" component={ArtistPostScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ArtistProfileScreen" component={ArtistProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PayPalScreen" component={PayPalScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GooglePayScreen" component={GooglePayScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ApplePayScreen" component={ApplePayScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MobileNumberScreen" component={MobileNumberScreen} options={{headerShown: false}} />
        <Stack.Screen name="OtpVerificationScreen" component={OtpVerificationScreen} options={{headerShown: false}} />
        <Stack.Screen name="ProfileDataScreen" component={ProfileDataScreen} options={{headerShown: false}} />
        <Stack.Screen name="ArtistNavigationBar" component={ArtistNavigationBar} options={{headerShown: false}} />
        <Stack.Screen name="BecomeArtistForm" component={BecomeArtistForm} options={{headerShown: false}} />
        <Stack.Screen name="ArtistProfileData" component={ArtistProfileData} options={{headerShown: false}} />
        <Stack.Screen name="MusicLibraryPage" component={MusicLibraryPage} options={{headerShown: false}} />
        <Stack.Screen name="ArtistAlbums" component={ArtistAlbums} options={{headerShown: false}} />
        <Stack.Screen name="CreatePost" component={CreatePost} options={{headerShown: false}} />
        <Stack.Screen name="ProfileScreenArtist" component={ProfileScreenArtist} options={{headerShown: false}} />
              
        <Stack.Screen name="ArtistProfileDataForArtist" component={ArtistProfileDataForArtist} options={{headerShown: false}} />
        <Stack.Screen name="DiscoverScreenForArtist" component={DiscoverScreenForArtist} options={{headerShown: false}} />
        
        <Stack.Screen name="example" component={ProfileDataScreen} options={{title:'example'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainStackNavigator;
