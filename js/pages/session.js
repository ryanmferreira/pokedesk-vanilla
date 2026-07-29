import { leaveSesion, getSessionInfo } from "/js/service/session-service.js";

const leaveSessionButton = document.getElementById('leave-session');
const showSessionName = document.getElementById('session-name');

document.addEventListener('DOMContentLoaded', () => {
    setPlayerInfo();
});

leaveSessionButton.addEventListener('click', () => {
    leaveSesion();
});


async function renderSessionInfo() {
    const session = await getSessionInfo();
    console.log("Test:", session);

    if (session) {
        showSessionName.innerText = session.name;
    }
}

renderSessionInfo();