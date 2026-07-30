/* ==========================================================================
   MODAL AND UI CONTROL
   ========================================================================== */

// ===== Modal =====
const editPokemonModal = document.getElementById('edit-pokemon-modal');
const addImageModal = document.getElementById('add-image-modal');
const pokemonModal = document.getElementById('pokemon-management-modal');

function showSelectedPokemon() {
    document.querySelector('.select-pokemon').style.display = 'flex';
}

function hiddenSelectedPokemon() {
    document.querySelector('.select-pokemon').style.display = 'none';
}

function openPokemon() {
    pokemonModal?.classList.remove('hidden');
    renderCapturedPokemons();
}

function closePokemon() {
    pokemonModal?.classList.add('hidden');
    clearSelection();
}

function openEditPokemon() {
    editPokemonModal.classList.remove('hidden');
    updateAllEffectInputs();
}

function closeEditPokemon() {
    editPokemonModal?.classList.add('hidden');
}

function openAddImage() {
    addImageModal?.classList.remove('hidden');
}

function closeAddImage() {
    addImageModal?.classList.add('hidden');
}

function clearSelection() {
    currentPokemon = null;
    hiddenSelectedPokemon();
    selectedNameDetails.textContent = "No Pokémon Selected";
}

function toggleEffectInput(checkbox) {
    const textInput = checkbox.nextElementSibling;

    if (textInput) {
        textInput.disabled = !checkbox.checked;
    }
}

function updateAllEffectInputs() {
    const checkboxes = document.querySelectorAll('#edit-pokemon-modal .custom-checkbox');
    checkboxes.forEach(checkbox => toggleEffectInput(checkbox));
}