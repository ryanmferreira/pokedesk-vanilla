import { characterState } from "./player-state.js";
import { renderInventory } from "./player-inventory.js";
import { closePokemon } from "../pokemon/pokemon-modals.js";

/* ==========================================================================
   MODAL AND UI CONTROL
   ========================================================================== */

// Modals
const inventoryModal = document.getElementById('inventory-modal');
const addCharacterImageModal = document.getElementById('add-character-image-modal');

export function openInventory() {
    renderInventory();
    inventoryModal?.classList.remove('hidden');
}

export function closeInventory() {
    inventoryModal?.classList.add('hidden');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeInventory();
        closePokemon();
    }
});

window.openInventory = openInventory;
window.closeInventory = closeInventory;