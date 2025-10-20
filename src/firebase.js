// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// Inisialisasi Firestore dan ekspor untuk digunakan di file lain
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCqMzoSIrwGgd06mEn4qqqmp5AuXU5Epr4",
    authDomain: "root-96c13.firebaseapp.com",
    projectId: "root-96c13",
    storageBucket: "root-96c13.firebasestorage.app",
    messagingSenderId: "812631527161",
    appId: "1:812631527161:web:8dcdea1fda736491f45c28",
    measurementId: "G-4K9Y9DHSD3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);