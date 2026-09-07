import { auth } from "/js/database/firebase-config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js"

import { leaveSesion, getSessionInfo, getSession } from "/js/service/session-service.js";

import { showLoading, hideLoading } from "/js/components/loading.js";

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
    } finally {
        hideLoading();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const greetingsNameElement = document.getElementById('user-name');
            const firstName = user.displayName.split(' ', 1);

            if (greetingsNameElement) {
                greetingsNameElement.textContent = `Hello, ${firstName}!`;
            }
        }
    });
});

renderSessionInfo();