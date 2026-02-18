import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDGk-_ja-eaiPsAuZPZoD-fmBKLgYAHN34",
    authDomain: "prime-e5968.firebaseapp.com",
    projectId: "prime-e5968",
    storageBucket: "prime-e5968.firebasestorage.app",
    messagingSenderId: "767056914442",
    appId: "1:767056914442:web:02edd2b8744d5acf0897f3",
    measurementId: "G-MH7P24D1D3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
