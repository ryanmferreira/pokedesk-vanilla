import { auth } from "/js/database/firebase-config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

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