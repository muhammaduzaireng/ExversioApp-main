// screens/RecoverPassOtp.tsx
import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import commonStyles from '../styles/commonStyles'; // Ensure this import path is correct

type GoogleLoginNavigationProp = StackNavigationProp<any, 'GoogleLogin'>;

const GoogleLogin = () => {
  const navigation = useNavigation<GoogleLoginNavigationProp>();

  return (
    <View style={commonStyles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={commonStyles.backButtonContainer}>
        <Image source={require('../assets/icons/211686_back_arrow_icon.png')} style={commonStyles.backIcon} />
      </TouchableOpacity>
      <View style={commonStyles.logoContainer}>
        <Image source={require('../assets/logo/logo_white.png')} style={commonStyles.logo} />
        <Text style={commonStyles.title}>Login Using Google ID</Text>
        <Image source={require('../assets/icons/google-icon.png')} style={commonStyles.titleIcon} />
      </View>

      <View style={commonStyles.formContainer}>
        <View style={commonStyles.inputContainer}>
          
          <TextInput
            style={commonStyles.input}
            placeholder="Email"
            placeholderTextColor={commonStyles.placeholderTextColor}
          />
        </View>
        
        <TouchableOpacity style={commonStyles.button} onPress={() => navigation.navigate('CreateNewPass')}>
          <Text style={commonStyles.buttonText}>Create Link</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GoogleLogin;
