const greetingsName = document.getElementById('user-name');

import { onAuthStateChanged, auth } from "/js/database/firebase-config.js";

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log(user);

            const firstName = user.displayName.split(' ', 1);
            greetingsName.textContent = `Hello, ${firstName}!`;
        }
    });
});

