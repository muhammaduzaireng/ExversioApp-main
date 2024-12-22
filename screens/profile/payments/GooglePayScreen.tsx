import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import paymentStyles from '../../../styles/googlePayStyles'; // Use your existing styles
import Player from '../../components/Player';
import NavigationBar from '../../components/NavigationBar';

const GooglePayScreen = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');

    const handleGooglePaySubmit = () => {
        // Handle Google Pay payment submission logic here
        console.log("Google Pay Info: ", cardNumber, expiryDate, cvv);
    };

    return (
        <View style={paymentStyles.container}>
            <Text style={paymentStyles.title}>Google Pay</Text>
            <TextInput
                style={paymentStyles.input}
                placeholder="Card Number"
                placeholderTextColor="#aaa"
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="numeric"
            />
            <TextInput
                style={paymentStyles.input}
                placeholder="Expiry Date (MM/YY)"
                placeholderTextColor="#aaa"
                value={expiryDate}
                onChangeText={setExpiryDate}
                keyboardType="numeric"
            />
            <TextInput
                style={paymentStyles.input}
                placeholder="CVV"
                placeholderTextColor="#aaa"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
                secureTextEntry
            />
            <TouchableOpacity style={paymentStyles.addButton} onPress={handleGooglePaySubmit}>
                <Text style={paymentStyles.addButtonText}>Submit</Text>
            </TouchableOpacity>

            <View style={paymentStyles.bottomContainer}>
                <Player />
                <NavigationBar />
            </View>
        </View>
    );
};

export default GooglePayScreen;
