import { initializeApp } from 'firebase/app';
import { getFirestore} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: "react-courses01.firebaseapp.com",
    projectId: "react-courses01",
    storageBucket: "react-courses01.appspot.com",
    messagingSenderId: "496236800301",
    appId: "1:496236800301:web:5aef9c38ccb047efa98ba4",
    measurementId: "G-SZTPPQE3W6"
  };

  const firebaseApp = initializeApp(firebaseConfig);

  const db = getFirestore(firebaseApp);

  export { db };