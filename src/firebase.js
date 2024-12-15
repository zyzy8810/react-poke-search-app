// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDj6fF88ZwiSLCW7I9Ka5_w2Ky7pfR43Y",
  authDomain: "react-pokemon-search-app.firebaseapp.com",
  projectId: "react-pokemon-search-app",
  storageBucket: "react-pokemon-search-app.firebasestorage.app",
  messagingSenderId: "479957263474",
  appId: "1:479957263474:web:63c2149c083bf6ffcd0eeb",
  measurementId: "G-CGKYJ4MFPN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
