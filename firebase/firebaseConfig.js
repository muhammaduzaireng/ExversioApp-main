import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBZDXaoxoofz_idAE60NrWdLHB18fHCx-s",
  authDomain: "exversio-dd2ca.firebaseapp.com",
  projectId: "exversio-dd2ca",
  storageBucket: "exversio-dd2ca.appspot.com",
  messagingSenderId: "338221186802",
  appId: "1:338221186802:android:ad76934af84777389e5a6b",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase, auth };
