import { characterState } from "../player/player-state.js";
import { renderCapturedPokemons } from "./pokemon-render.js";
import { setCurrentPokemon } from "./pokemon-management.js";

/* ==========================================================================
   MODAL AND UI CONTROL
   ========================================================================== */

// ===== Modal =====
const editPokemonModal = document.getElementById('edit-pokemon-modal');
const addImageModal = document.getElementById('add-image-modal');
const pokemonModal = document.getElementById('pokemon-management-modal');
const selectedNameDetails = document.getElementById('manage-pokemon-name');

export function showSelectedPokemon() {
    const el = document.querySelector('.select-pokemon');
    if (el) el.style.display = 'flex';
}

export function hiddenSelectedPokemon() {
    const el = document.querySelector('.select-pokemon');
    if (el) el.style.display = 'none';
}

export function openPokemon() {
    pokemonModal?.classList.remove('hidden');
    renderCapturedPokemons();
}

export function closePokemon() {
    pokemonModal?.classList.add('hidden');
    clearSelection();
}

export function openEditPokemon() {
    editPokemonModal?.classList.remove('hidden');
    updateAllEffectInputs();
}

export function closeEditPokemon() {
    editPokemonModal?.classList.add('hidden');
}

export function openAddImage() {
    addImageModal?.classList.remove('hidden');
}

export function closeAddImage() {
    addImageModal?.classList.add('hidden');
}

export function clearSelection() {
    setCurrentPokemon(null);
    hiddenSelectedPokemon();
  
    const nameDetails = selectedNameDetails || document.getElementById('manage-pokemon-name');
   
    if (nameDetails) {
        nameDetails.textContent = "No Pokémon Selected";
    }
}

export function toggleEffectInput(checkbox) {
    const textInput = checkbox.nextElementSibling;

    if (textInput) {
        textInput.disabled = !checkbox.checked;
    }
}

export function updateAllEffectInputs() {
    const checkboxes = document.querySelectorAll('#edit-pokemon-modal .custom-checkbox');
    checkboxes.forEach(checkbox => toggleEffectInput(checkbox));
}

window.showSelectedPokemon = showSelectedPokemon;
window.hiddenSelectedPokemon = hiddenSelectedPokemon;
window.openPokemon = openPokemon;
window.closePokemon = closePokemon;
window.openEditPokemon = openEditPokemon;
window.closeEditPokemon = closeEditPokemon;
window.openAddImage = openAddImage;
window.closeAddImage = closeAddImage;
window.clearSelection = clearSelection;
window.toggleEffectInput = toggleEffectInput;
window.updateAllEffectInputs = updateAllEffectInputs;