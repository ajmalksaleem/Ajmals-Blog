// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-app-a697d.firebaseapp.com",
  projectId: "blog-app-a697d",
  storageBucket: "blog-app-a697d.appspot.com",
  messagingSenderId: "220035990096",
  appId: "1:220035990096:web:19c3320b62c42df2a80755"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);