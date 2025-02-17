// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { FIREBASE_API_KEY } from "./data";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "marketplace-ac25a.firebaseapp.com",
  projectId: "marketplace-ac25a",
  storageBucket: "marketplace-ac25a.firebasestorage.app",
  messagingSenderId: "692266206856",
  appId: "1:692266206856:web:e8a40c8097a16a775ec13d",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
