/* ==========================================================================
   MODAL AND UI CONTROL
   ========================================================================== */

function showSelectedPokemon() {
    document.querySelector('.select-pokemon').style.display = 'flex';
}

function hiddenSelectedPokemon() {
    document.querySelector('.select-pokemon').style.display = 'none';
}

function openPokemon() {
    renderCapturedPokemons();
    pokemonModal?.classList.remove('hidden');
}

function closePokemon() {
    pokemonModal?.classList.add('hidden');
    clearSelection();
}


function openEditPokemon() {
    if (editPokemonModal) {
        editPokemonModal.classList.remove('hidden');
        updateAllEffectInputs();
    }
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
    selectedNameDetails.textContent = "No Pokémon Selected";
    currentPokemon = null;
    hiddenSelectedPokemon();
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