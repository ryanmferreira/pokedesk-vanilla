/* ==========================================================================
   MODAL AND UI CONTROL
   ========================================================================== */

function openInventory() {
    renderInventory();
    inventoryModal?.classList.remove('hidden');
}

function closeInventory() {
    inventoryModal?.classList.add('hidden');
}