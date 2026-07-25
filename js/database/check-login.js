import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Logged-in user: ", user.displayName);
        console.log("Logged-in User UID: ", user.uid);
    } else {
        console.log("No user logged in...");
        window.location.href = "../../pages/login.html";
    }
});

export { onAuthStateChanged };