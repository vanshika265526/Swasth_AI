// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA5e6H0-al_L7gGEv8yjUBS25zA6-IvFzU",
  authDomain: "swasthai-ba650.firebaseapp.com",
  projectId: "swasthai-ba650",
  storageBucket: "swasthai-ba650.appspot.com",
  messagingSenderId: "167599745247",
  appId: "1:167599745247:web:af3a5d0373a65d4678216a",
  measurementId: "G-N8TYETMJCD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);