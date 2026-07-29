import { auth, onAuthStateChanged } from "/js/database/firebase-config.js";

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("Logged-in user: ", user.displayName);
            console.log("Logged-in User UID: ", user.uid);
        } else {
            console.log("No user logged in...");
            window.location.href = "/pages/login.html";
        }
    });
});