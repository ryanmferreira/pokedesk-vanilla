import { leaveSesion } from "../service/session-service.js";

const leaveSessionButton = document.getElementById('leave-session');

document.addEventListener('DOMContentLoaded', () => {
    setPlayerInfo();
});

leaveSessionButton.addEventListener('click', () => {
    leaveSesion();
});