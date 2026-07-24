/* ==========================================================================
   MODAL AND UI CONTROL
   ========================================================================== */

function showSelectedPokemon() {
    document.querySelector('.select-pokemon').style.display = 'flex';
}

function openEditPokemon() {
    if (editPokemonModal) {
        editPokemonModal.classList.remove('hidden');
        updateAllEffectInputs();
    }
}

function hiddenSelectedPokemon() {
    document.querySelector('.select-pokemon').style.display = 'none';
}

function openPokemon(pokeArray = null) {
    if (pokeArray) {
        characterState.capturedPokemon = pokeArray;
    }

    renderCapturedPokemons();
    pokemonModal?.classList.remove('hidden');
}

function closePokemon() {
    pokemonModal?.classList.add('hidden');
    clearSelection();
}

function closeAddImage() {
    addImageModal?.classList.add('hidden');
}

function openAddImage() {
    addImageModal?.classList.remove('hidden');
}

function clearSelection() {
    selectedNameDetails.textContent = "No Pokémon Selected";
    currentPokemon = null;
    hiddenSelectedPokemon();
}

function closeEditPokemon() {
    editPokemonModal?.classList.add('hidden');
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
