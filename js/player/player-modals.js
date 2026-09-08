import { initializeInventory } from "./player-inventory.js";
import { closePokemon } from "../pokemon/pokemon-modals.js";

/* ==========================================================================
   MODAL AND UI CONTROL
   ========================================================================== */

const inventoryModal = document.getElementById('inventory-modal');

/* ==========================================================================
   INVENTORY MODAL
   ========================================================================== */

export function openInventory() {
    initializeInventory();

    inventoryModal?.classList.remove('hidden');
}

export function closeInventory() {
    inventoryModal?.classList.add('hidden');
}

/* ==========================================================================
   KEYBOARD CONTROLS
   ========================================================================== */

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeInventory();
        closePokemon();
    }
});

/* ==========================================================================
   GLOBAL FUNCTIONS
   ========================================================================== */

window.openInventory = openInventory;
window.closeInventory = closeInventory;