import { auth } from "/js/database/firebase-config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js"

import { getLastSessions, getSessionInfo, joinSession, setLastSessions } from "/js/service/session-service.js";

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const greetingsNameElement = document.getElementById('user-name');
            const firstName = user.displayName.split(' ', 1);

            if (greetingsNameElement) {
                greetingsNameElement.textContent = `Hello, ${firstName}!`;
            }

            renderLastSessions();
        }
    });
});

async function renderLastSessions() {
    const lastSessionsDiv = document.getElementById('last-sessions');

    if (lastSessionsDiv) {
        const { sessions } = getLastSessions();

        console.log(sessions);

        for (const session of sessions) {
            const sessionsButton = document.createElement('button');
            sessionsButton.className = 'flex-grow';

            const sessionInfo = await getSessionInfo(session);

            console.log(sessionInfo)

            sessionsButton.innerText = sessionInfo?.name;

            sessionsButton.addEventListener('click', () => {
                joinSession(session);
                setLastSessions(session);
            });

            lastSessionsDiv.appendChild(sessionsButton);
        }
    }
}