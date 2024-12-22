import { StyleSheet } from 'react-native';

const paymentStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  paymentOptionsContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    paddingVertical: 12, // Reduced padding to decrease the overall height
    paddingHorizontal: 20,
    marginBottom: 8, // Add slight margin to ensure a small gap
  },
  paymentOptionText: {
    color: '#fff',
    fontSize: 16,
  },
  selectedOption: {
    borderColor: '#2EF3DD',
    borderWidth: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2EF3DD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2EF3DD',
  },
  addButton: {
    backgroundColor: '#2EF3DD',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 20,
  },
  addButtonText: {
    color: '#1E1E1E',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default paymentStyles;
