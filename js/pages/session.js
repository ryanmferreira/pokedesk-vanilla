import { auth } from "/js/database/firebase-config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import { getSession, getSessionInfo, leaveSesion } from "/js/service/session-service.js";

import { hideLoading, showLoading } from "/js/components/loading.js";
import { showMessage } from "/js/components/message-modal.js";

const showSessionName = document.getElementById("session-name");
const leaveSessionButton = document.getElementById("leave-session");

leaveSessionButton?.addEventListener("click", () => {
    leaveSesion();
});

async function renderSessionInfo() {
    showLoading("Loading Character...");

    try {
        const sessionInfo = await getSessionInfo(getSession());

        if (!sessionInfo) {
            return;
        }

        if (showSessionName) {
            showSessionName.innerText = sessionInfo.name;
        }

        document.title = sessionInfo.name;
    } catch (error) {
        console.error("Error loading session information:", error);
        await showMessage(`Could not load session information: ${error.message || error}`, { title: 'Session loading failed' });
    } finally {
        hideLoading();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, user => {
        try {
            if (user) {
                const greetingsNameElement = document.getElementById('user-name');
                const firstName = user.displayName ? user.displayName.split(' ', 1)[0] : 'Visitor';

                if (greetingsNameElement) {
                    greetingsNameElement.textContent = `Hello, ${firstName}!`;
                }
            }
        } catch (error) {
            console.error("Error displaying account information:", error);
            showMessage(`Could not display your account information: ${error.message || error}`, { title: 'Account loading failed' });
        }
    }, error => {
        console.error("Authentication state error:", error);
        showMessage(`Could not verify your account: ${error.message || error}`, { title: 'Authentication failed' });
    });
});

renderSessionInfo();