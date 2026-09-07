import { auth } from "/js/database/firebase-config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js"

import { getLastSessions, getSessionInfo, joinSession, setLastSessions } from "/js/service/session-service.js";

import { showLoading, hideLoading } from '/js/components/loading.js';

document.addEventListener('DOMContentLoaded', () => {
    showLoading("Loading your sessions...");

    onAuthStateChanged(auth, async (user) => {
        try {
            if (user) {
                const greetingsNameElement = document.getElementById('user-name');
                const firstName = user.displayName.split(' ', 1);

                if (greetingsNameElement) {
                    greetingsNameElement.textContent = `Hello, ${firstName}!`;
                }

                await renderLastSessions();
            }
        }
        finally {
            hideLoading();
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

            if (!sessionInfo) {
                break;
            }

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