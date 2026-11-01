import { database } from "/js/database/database.js";
import { auth, googleProvider, signInWithPopup, signOut } from "/js/database/firebase-config.js";
import { showMessage } from "/js/components/message-modal.js";

import { ref, set } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

const logInButton = document.getElementById('login-with-google');
const logOutButton = document.getElementById('log-out');

export function getUserData() {
    const user = auth.currentUser;

    if (user) {
        return user;
    } else {
        console.error("No user logged in.");
        return null;
    }
}

async function saveUserToDatabase(user) {
    try {
        const userData = {
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            lastLogin: Date.now(),
        };

        const userRef = ref(database, `users/${user.uid}`);

        await set(userRef, userData);

        console.log("User saved to database Successfully!");
    } catch (error) {
        console.error("Error on save user to database:", error.code);
        throw error;
    }
}

export async function handleSignOut() {
    try {
        await signOut(auth);
        window.location.href = "/";
    } catch (error) {
        const errorMessage = `Error logging out: ${error.code} ${error.message}`;
        console.error(errorMessage);
        await showMessage(errorMessage, { title: 'Error' });
    }
}

export async function handleLogIn() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        await saveUserToDatabase(user);

        console.log("Logged user:", user);

        window.location.href = "/pages/home";
    } catch (error) {
        console.error("Error on log in with Google: ", error.code, error.message);
        await showMessage(`Failed to log in with Google: ${error.message}`, { title: 'Login failed' });
    }
}

if (logInButton) {
    logInButton.addEventListener('click', async () => {
        handleLogIn();
    });
}

if (logOutButton) {
    logOutButton.addEventListener('click', async () => {
        handleSignOut();
    });
}