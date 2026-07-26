// auth-service.js
import { auth, signOut, googleProvider, signInWithPopup, db } from "./firebase-config.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

const loginButton = document.getElementById('login-with-google');

async function saveUserToDatabase(user) {
    try {
        await set(ref(db, `users/${user.uid}`), {
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            lastLogin: Date.now(),
        });

        console.log("User saved to database Successfully!");
    } catch (error) {
        console.error("Error on save user to database:", error.code);
    }
}

export async function handleSignOut() {
    try {
        await signOut(auth);
        window.location.href = "../../index.html";
    } catch (error) {
        const errorMessage = `Error logging out: ${error.code} ${error.message}`;
        console.error(errorMessage);
        alert(errorMessage);
    }
}

window.handleSignOut = handleSignOut;

if (loginButton) {
    loginButton.addEventListener('click', async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            await saveUserToDatabase(user);

            console.log("Logged user:", user);

            window.location.href = "./home.html";
        } catch (error) {
            console.error("Error on log in with Google: ", error.code, error.message);
            alert(`Failed to log in with Google: ${error.message}`);
        }
    });
}