// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// ✅ Konfigurasi Firebase Project kamu
const firebaseConfig = {
  apiKey: "AIzaSyCF3tV_PWCCEknd-h9LItEz5Kj5IbLAMjk",
  authDomain: "react-d5683.firebaseapp.com",
  projectId: "react-d5683",
  storageBucket: "react-d5683.firebasestorage.app",
  messagingSenderId: "930719114145",
  appId: "1:930719114145:web:94a3e402d97e48b628a1e0",
  measurementId: "G-RM5E0V1K32"
};

// ✅ Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// ✅ Ekspor instance yang bisa dipakai di seluruh aplikasi
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;