import { auth, googleProvider, signInWithPopup } from "./firebase.js";

const loginButton = document.getElementById('login-with-google');

if (loginButton) {
    loginButton.addEventListener('click', async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            console.log("Logged user:", user);

            const surName = user.displayName.split(' ')[0];

            alert(`Welcome, ${surName}!`);

            window.location.href = "../../pages/home.html";

        } catch (error) {
            console.error("Error on log in with Google: ", error.code, error.message);
            alert("Failed to log in with Google.");
        }
    });
}