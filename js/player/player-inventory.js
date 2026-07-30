function renderInventory() {
    if (!itemsContainerElement) return;

    itemsContainerElement.innerHTML = '';

    for (let item of checkPlayerItems()) {
        const itemRow = document.createElement('div');
        itemRow.className = 'inventory-item-row';

        itemRow.innerHTML = `
            <div class="inventory-section">
                <input type="text" class="inventory-item-input" value="${item.name || ''}">
                <input type="number" class="inventory-qty-input" value="${item.quantity || 1}" min="1">
            </div>
            <button class="item-delete-btn" type="button">×</button>
        `;

        itemRow.querySelector('.inventory-item-input').addEventListener('change', (e) => {
            item.name = e.target.value;
        });

        itemRow.querySelector('.inventory-qty-input').addEventListener('change', (e) => {
            item.quantity = parseInt(e.target.value, 10) || 1;
        });

        itemRow.querySelector('.item-delete-btn').addEventListener('click', () => {
            const index = characterState.inventory.indexOf(item);

            if (index !== -1) {
                characterState.inventory.splice(index, 1);
            }

            renderInventory();
        });

        itemsContainerElement.appendChild(itemRow);
    }
}

function updateCash(value) {
    characterState.cash = parseFloat(value) || 0;
}