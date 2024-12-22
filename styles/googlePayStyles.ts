import { StyleSheet } from 'react-native';

const googlePayStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#2EF3DD',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 10,
  },
  addButtonText: {
    color: '#1E1E1E',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomContainer: {
    marginTop: 'auto',
  },
});

export default googlePayStyles;
