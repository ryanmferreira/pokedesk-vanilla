import { auth } from "/js/database/firebase-config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import { getLastSessions, getSessionInfo, joinSession } from "/js/service/session-service.js";

import { hideLoading, showLoading } from '/js/components/loading.js';
import { showMessage } from '/js/components/message-modal.js';

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
        } catch (error) {
            console.error("Error loading sessions:", error);
            await showMessage(`Could not load your sessions: ${error.message || error}`, { title: 'Session loading failed' });
        }
        finally {
            hideLoading();
        }
    }, error => {
        console.error("Authentication state error:", error);
        hideLoading();
        showMessage(`Could not verify your account: ${error.message || error}`, { title: 'Authentication failed' });
    });
});

async function renderLastSessions() {
    const lastSessionsDiv = document.getElementById('last-sessions');

    if (lastSessionsDiv) {
        const { sessions } = getLastSessions();

        console.log(sessions);

        for (const session of sessions) {

            const sessionsButton = document.createElement('button');
            sessionsButton.className = 'flex-grow with-icon icon-history';

            const sessionInfo = await getSessionInfo(session);

            if (!sessionInfo) {
                break;
            }

            console.log(sessionInfo)

            sessionsButton.innerText = sessionInfo?.name;
            sessionsButton.title = `Open session: ${sessionInfo?.name || 'session'}`;

            sessionsButton.addEventListener('click', async () => {
                try {
                    await joinSession(session);
                } catch (error) {
                    console.error("Error opening recent session:", error);
                    await showMessage(`Could not open this session: ${error.message || error}`, { title: 'Session join failed' });
                }
            });

            lastSessionsDiv.appendChild(sessionsButton);
        }
    }
}