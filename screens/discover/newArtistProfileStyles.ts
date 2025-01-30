import { StyleSheet } from 'react-native';

const newArtistProfileStyles = StyleSheet.create({
    headerContainer: {
        backgroundColor: '#f4f4f4',
        paddingBottom: 10,
    },
    coverImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    artistInfoContainer: {
        padding: 15,
        alignItems: 'center',
    },
    profileContainer: {
        marginBottom: 10,
        alignItems: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    artistName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    artistDescription: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
    },
    subscribeButton: {
        backgroundColor: '#2EF3DD',
        padding: 10,
        borderRadius: 5,
    },
    subscribeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    tabButton: {
        padding: 10,
    },
    tabButtonActive: {
        padding: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#2EF3DD',
    },
    tabButtonText: {
        fontSize: 16,
        color: '#666',
    },
    tabButtonTextActive: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
    },
});

export default newArtistProfileStyles;