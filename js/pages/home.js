
import { onAuthStateChanged, auth } from "/js/database/firebase-config.js";

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log(user);

            const greetingsNameElement = document.getElementById('user-name');
            const firstName = user.displayName.split(' ', 1);

            if (greetingsNameElement) {
                greetingsNameElement.textContent = `Hello, ${firstName}!`;
            }
        }
    });
});

