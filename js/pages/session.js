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

renderSessionInfo();