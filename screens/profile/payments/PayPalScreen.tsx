import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import paymentStyles from '../../../styles/paypalStyles'; // Use your existing styles
import Player from '../../components/Player';
import NavigationBar from '../../components/NavigationBar';

const PayPalScreen = () => {
    const [email, setEmail] = useState('');

    const handlePayPalSubmit = () => {
        // Handle PayPal payment submission logic here
        console.log("PayPal Email: ", email);
    };

    return (
        <View style={paymentStyles.container}>
            <Text style={paymentStyles.title}>PayPal</Text>
            <TextInput
                style={paymentStyles.input}
                placeholder="Enter PayPal Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TouchableOpacity style={paymentStyles.addButton} onPress={handlePayPalSubmit}>
                <Text style={paymentStyles.addButtonText}>Submit</Text>
            </TouchableOpacity>

            <View style={paymentStyles.bottomContainer}>
                <Player />
                <NavigationBar />
            </View>
        </View>
    );
};

export default PayPalScreen;
