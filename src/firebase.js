// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjVMjmyjrW4TQH6QkrfQdVo5_t78_EVDo",
  authDomain: "my-softdev-miniproject.firebaseapp.com",
  projectId: "my-softdev-miniproject",
  storageBucket: "my-softdev-miniproject.firebasestorage.app",
  messagingSenderId: "136416305629",
  appId: "1:136416305629:web:cc6b053634212269e09634",
  measurementId: "G-NGE66BV582",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
