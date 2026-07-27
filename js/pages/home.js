const greetingsName = document.getElementById('user-name');

import { onAuthStateChanged, auth } from "../database/firebase-config.js";

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log(user);

            const firstName = user.displayName.split(' ', 1);
            greetingsName.textContent = `Hello, ${firstName}!`;
        }
    });
});

