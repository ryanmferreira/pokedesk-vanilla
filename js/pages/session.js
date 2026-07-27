import { leaveSesion } from "../service/session-service.js";

const leaveSessionButton = document.getElementById('leave-session');

function toggleMobileMenu() {
    const dropdown = document.querySelector('.mobile-menu-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setPlayerInfo();
});

leaveSessionButton.addEventListener('click', () => {
    leaveSesion();
});