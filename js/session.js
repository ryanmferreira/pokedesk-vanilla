document.addEventListener('DOMContentLoaded', () => {
    setPlayerInfo();

    renderPokemonTeam();
    renderCapturedPokemons();
});

function toggleMobileMenu() {
    const dropdown = document.querySelector('.mobile-menu-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}