import { leaveSesion, getSessionInfo, getSession } from "/js/service/session-service.js";

const showSessionName = document.getElementById('session-name');
const leaveSessionButton = document.getElementById('leave-session');

leaveSessionButton?.addEventListener('click', () => {
    leaveSesion();
});

async function renderSessionInfo() {
    const sessionInfo = await getSessionInfo(getSession());

    if (!sessionInfo) {
        return;
    }

    if (showSessionName) {
        showSessionName.innerText = sessionInfo.name;
    }
}

renderSessionInfo();