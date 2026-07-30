/* ==========================================================================
   MODAL AND UI CONTROL
   ========================================================================== */

// Modals
const inventoryModal = document.getElementById('inventory-modal');
const addCharacterImageModal = document.getElementById('add-character-image-modal');

function openInventory() {
    renderInventory();
    inventoryModal?.classList.remove('hidden');
}

function closeInventory() {
    inventoryModal?.classList.add('hidden');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeInventory();
        closePokemon();
    }
});