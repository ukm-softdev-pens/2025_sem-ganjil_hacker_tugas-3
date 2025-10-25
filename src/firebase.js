// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCT8Rqh9ZG6rwjbMT3BVVn21vh7rFyTQNA",
  authDomain: "pyrenees-da24f.firebaseapp.com",
  projectId: "pyrenees-da24f",
  storageBucket: "pyrenees-da24f.firebasestorage.app",
  messagingSenderId: "583225406833",
  appId: "1:583225406833:web:97b491348fca81b3d372d0",
  measurementId: "G-1BXFG8L99C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);