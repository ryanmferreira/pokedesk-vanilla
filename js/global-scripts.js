document.addEventListener('contextmenu', (e) => e.preventDefault());

const mobileMenuButton = document.getElementById('open-mobile-menu');

if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
        toggleMobileMenu();
    });
}

function toggleMobileMenu() {
    const dropdown = document.querySelector('.mobile-menu-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}