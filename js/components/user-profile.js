/* ==========================================================================
   USER PROFILE MODAL CONTROLLER
   ========================================================================== */

import { getUserData } from "../service/auth-service.js";

const profileModal = document.getElementById('user-profile-modal');
const profileAvatar = document.getElementById('profile-modal-avatar');
const profileName = document.getElementById('profile-modal-name');
const profileEmail = document.getElementById('profile-modal-email');
const profileUid = document.getElementById('profile-modal-uid');
const profileVerified = document.getElementById('profile-modal-verified');
const profileLastLogin = document.getElementById('profile-modal-last-login');

const openProfileBtn = document.getElementById('open-profile');

const closeProfileBottomBtn = document.getElementById('profile-modal-close-action');

function openUserProfileModal(user) {
    if (!profileModal || !user) {
        return;
    }

    profileAvatar.src = user.photoURL;
    profileName.textContent = user.displayName;
    profileEmail.textContent = user.email;
    profileUid.textContent = user.uid;

    profileVerified.textContent = user.emailVerified ? 'Yes' : 'No';

    const loginDate = new Date(user.metadata.lastSignInTime);
    profileLastLogin.textContent = loginDate.toLocaleString('en-US');

    profileModal.classList.remove('hidden');
}

function closeUserProfileModal() {
    if (profileModal) {
        profileModal.classList.add('hidden');
    }
}

if (closeProfileBottomBtn) {
    closeProfileBottomBtn.addEventListener('click', closeUserProfileModal);
}

if (openProfileBtn) {
    openProfileBtn.addEventListener('click', () => {
        const user = getUserData();
        openUserProfileModal(user);
    });
}

if (profileModal) {
    profileModal.addEventListener('click', (event) => {
        if (event.target === profileModal) {
            closeUserProfileModal();
        }
    });
}