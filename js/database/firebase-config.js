import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth, signOut, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyC9S4937lRGwO8Cok56BwbA2GBtKRvfAM8",
    authDomain: "pokedesk-vanilla.firebaseapp.com",
    databaseURL: "https://pokedesk-vanilla-default-rtdb.firebaseio.com",
    projectId: "pokedesk-vanilla",
    storageBucket: "pokedesk-vanilla.firebasestorage.app",
    messagingSenderId: "514055994237",
    appId: "1:514055994237:web:23f87d602b4d6f99fd6a14"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getDatabase(app);

export { signOut, signInWithPopup, onAuthStateChanged };