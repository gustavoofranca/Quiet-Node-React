import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

//Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDI9PWSJswji1SsNJf9vEA1sUzqGEiot_s",
    authDomain: "quietracingclub-34130.firebaseapp.com",
    projectId: "quietracingclub-34130",
    storageBucket: "quietracingclub-34130.firebasestorage.app",
    messagingSenderId: "719352170995",
    appId: "1:719352170995:web:8c5182490948e6f5aeea86"
};

// Initialize Firebase
const firebaseapp = initializeApp(firebaseConfig);
//Get Firestore Database
const db = getFirestore(firebaseapp);
//Get Auth methods from Firestore Databse
const auth = getAuth(firebaseapp)

export { db, auth, firebaseapp };