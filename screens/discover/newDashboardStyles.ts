import { StyleSheet } from 'react-native';

const newDashboardStyles = StyleSheet.create({
    postContainer: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatarContainer: {
        marginRight: 10,
    },
    avatarWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    userInfo: {
        flex: 1,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    username: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 5,
    },
    verifiedIcon: {
        width: 16,
        height: 16,
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
    },
    postText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    postActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    likeCount: {
        fontSize: 16,
        color: '#333',
        marginRight: 5,
    },
    actionIconLike: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    commentCount: {
        fontSize: 16,
        color: '#333',
        marginRight: 5,
    },
    actionIconComment: {
        width: 24,
        height: 24,
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    commentInput: {
        flex: 1,
        padding: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        marginRight: 10,
    },
    commentSubmitButton: {
        fontSize: 16,
        color: '#2EF3DD',
    },
    commentContainer: {
        padding: 10,
        backgroundColor: '#f4f4f4',
        borderRadius: 5,
        marginTop: 10,
    },
    commentText: {
        fontSize: 14,
        color: '#333',
    },
    commentAuthor: {
        fontWeight: 'bold',
    },
    noCommentsText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default newDashboardStyles;