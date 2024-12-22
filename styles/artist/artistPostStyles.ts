import { StyleSheet } from 'react-native';

const artistPostStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1E1E1E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    color: '#fff',
    backgroundColor: '#2e2e2e',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  mediaOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  mediaIcon: {
    width: 50,
    height: 50,
    tintColor: '#4CD964',
  },
  mediaText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  previewContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  postButton: {
    backgroundColor: '#4CD964',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  feedContainer: {
    marginTop: 20,
  },
  postContainer: {
    backgroundColor: '#2e2e2e',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  postContent: {
    color: '#fff',
    marginBottom: 10,
  },
  postMedia: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
});

export default artistPostStyles;
