// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4ucyHhNyVrMzAYI2ADotl7CWJH8L6HB8",
  authDomain: "crud-buku-63c8f.firebaseapp.com",
  projectId: "crud-buku-63c8f",
  storageBucket: "crud-buku-63c8f.firebasestorage.app",
  messagingSenderId: "1000193535011",
  appId: "1:1000193535011:web:dcb7534c90b1c56ae0d596",
  measurementId: "G-7604KH8882"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;