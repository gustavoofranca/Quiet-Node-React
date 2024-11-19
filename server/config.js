import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDI9PWSJswji1SsNJf9vEA1sUzqGEiot_s",
    authDomain: "quietracingclub-34130.firebaseapp.com",
    projectId: "quietracingclub-34130",
    storageBucket: "quietracingclub-34130.firebasestorage.app",
    messagingSenderId: "719352170995",
    appId: "1:719352170995:web:8c5182490948e6f5aeea86"
};

const auth = getAuth();
const db = getFirestore();

export default { auth, db, firebaseConfig }; 