// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };
const firebaseConfig = {

  apiKey: "AIzaSyCFe3QEBX6sPqrRaPLBNxNfejbxm1HBgfg",

  authDomain: "hw-monster-battle.firebaseapp.com",

  projectId: "hw-monster-battle",

  storageBucket: "hw-monster-battle.firebasestorage.app",

  messagingSenderId: "806524011519",

  appId: "1:806524011519:web:181b4fb6d478c052385dca",

  measurementId: "G-CTS7HB4N55"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);