/* ==========================================================================
   INVENTORY MANAGEMENT
   ========================================================================== */
   
function renderInventory() {
    if (!itemsContainerElement) return;

    itemsContainerElement.innerHTML = '';

    for (let index in characterState.inventory) {
        const item = characterState.inventory[index];
        const itemRow = document.createElement('div');
        itemRow.className = 'inventory-item-row';

        itemRow.innerHTML = `
            <div class="inventory-section">
                <input type="text" class="inventory-item-input" value="${item.name || ''}" onchange="updateItemName(${index}, this.value)">
                <input type="number" class="inventory-qty-input" value="${item.quantity || 1}" min="1" onchange="updateItemQty(${index}, this.value)">
            </div>
            <button class="item-delete-btn" onclick="removeItem(${index})">×</button>
        `;

        itemsContainerElement.appendChild(itemRow);
    }
}

function updateCash(value) {
    characterState.cash = parseFloat(value) || 0;
}

function updateItemName(index, value) {
    if (characterState.inventory[index]) {
        characterState.inventory[index].name = value;
    }
}

function updateItemQty(index, value) {
    if (characterState.inventory[index]) {
        characterState.inventory[index].quantity = parseInt(value, 10) || 1;
    }
}

function removeItem(index) {
    characterState.inventory.splice(index, 1);
    renderInventory();
}