// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDf4DwsOBmONIR4NOi5wb0jrTu-lbC-EQM",
  authDomain: "reak-2f5a3.firebaseapp.com",
  projectId: "reak-2f5a3",
  storageBucket: "reak-2f5a3.firebasestorage.app",
  messagingSenderId: "136497290871",
  appId: "1:136497290871:web:8dfafc6b33d8741c15f072",
  measurementId: "G-VR27H8W12V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function initialFirebaseConfig() {
    return initializeApp(firebaseConfig);
}

export default initialFirebaseConfig;