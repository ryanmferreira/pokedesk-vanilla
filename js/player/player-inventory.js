import { characterState } from "./player-state.js";

/* ==========================================================================
   STATES AND SELECTORS
   ========================================================================== */

const itemsContainerElement = document.getElementById('inventory-items-container');
const categoriesContainerElement = document.getElementById('inventory-categories');
const inventoryCashElement = document.getElementById('inventory-cash');
const moveItemModalElement = document.getElementById('move-item-modal');
const moveItemContentElement = document.getElementById('move-item-content');

let currentInventoryCategory = 'misc';
let itemToMove = null;
let itemToMoveSourceCategory = null;

/* ==========================================================================
   INVENTORY CATEGORIES
   ========================================================================== */

const inventoryCategories = {
    misc: 'Misc',
    potions: 'Potions',
    pokeballs: 'Poké Balls',
    consumables: 'Consumables',
    weapons: 'Weapons',
    equipment: 'Equipment',
    keyItems: 'Key Items',
    stones: 'Stones',
    insignia: 'Insignia'
};

/* ==========================================================================
   CATEGORY
   ========================================================================== */

export function setInventoryCategory(category) {
    if (!Object.prototype.hasOwnProperty.call(inventoryCategories, category)) return;

    currentInventoryCategory = category;

    renderInventoryCategories();
    renderInventory();
}

/* ==========================================================================
   RENDER CATEGORIES
   ========================================================================== */

export function renderInventoryCategories() {
    const container = categoriesContainerElement || document.getElementById('inventory-categories');
    if (!container) return;

    container.innerHTML = '';

    for (const [category, label] of Object.entries(inventoryCategories)) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'inventory-category-btn';

        if (category === currentInventoryCategory) {
            button.classList.add('active');
        }

        button.textContent = label;

        button.addEventListener('click', () => {
            setInventoryCategory(category);
        });

        container.appendChild(button);
    }
}

/* ==========================================================================
   RENDER INVENTORY
   ========================================================================== */

export function renderInventory() {
    const container = itemsContainerElement || document.getElementById('inventory-items-container');
    if (!container) return;

    container.innerHTML = '';

    const categoryInventory = characterState?.bag?.[currentInventoryCategory];
    if (!Array.isArray(categoryInventory)) return;

    for (const item of categoryInventory) {
        const itemRow = document.createElement('div');
        itemRow.className = 'inventory-item-row';

        const inventorySection = document.createElement('div');
        inventorySection.className = 'inventory-section';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'inventory-item-input';
        nameInput.value = item.name || '';

        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.className = 'inventory-qty-input';
        quantityInput.value = item.quantity || 1;
        quantityInput.min = '1';

        /* -------------------------------------------------------------
           MOVE BUTTON
           ------------------------------------------------------------- */

        const moveButton = document.createElement('button');
        moveButton.type = 'button';
        moveButton.className = 'item-move-btn';
        moveButton.textContent = 'MOVE';
        moveButton.title = 'Move item';

        /* -------------------------------------------------------------
           DELETE BUTTON
           ------------------------------------------------------------- */

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'item-delete-btn';
        deleteButton.textContent = '×';
        deleteButton.title = 'Delete item';

        /* -------------------------------------------------------------
           ITEM EVENTS
           ------------------------------------------------------------- */

        nameInput.addEventListener('change', event => {
            item.name = event.target.value;
        });

        quantityInput.addEventListener('change', event => {
            item.quantity = parseInt(event.target.value, 10) || 1;
        });

        moveButton.addEventListener('click', () => {
            openMoveItemModal(item, currentInventoryCategory);
        });

        deleteButton.addEventListener('click', () => {
            const index = categoryInventory.indexOf(item);
            if (index !== -1) {
                categoryInventory.splice(index, 1);
            }

            renderInventory();
        });

        /* -------------------------------------------------------------
           BUILD ROW
           ------------------------------------------------------------- */

        inventorySection.appendChild(nameInput);
        inventorySection.appendChild(quantityInput);

        itemRow.appendChild(inventorySection);
        itemRow.appendChild(moveButton);
        itemRow.appendChild(deleteButton);

        container.appendChild(itemRow);
    }
}

/* ==========================================================================
   ADD ITEM
   ========================================================================== */

export function addInventoryItem() {
    if (!characterState.bag) return;

    if (!Array.isArray(characterState.bag[currentInventoryCategory])) {
        characterState.bag[currentInventoryCategory] = [];
    }

    characterState.bag[currentInventoryCategory].push({
        name: '',
        quantity: 1
    });

    renderInventory();
}

/* ==========================================================================
   MOVE ITEM MODAL
   ========================================================================== */

export function openMoveItemModal(item, sourceCategory) {
    if (!item || !sourceCategory) return;
    if (!moveItemModalElement) return;

    itemToMove = item;
    itemToMoveSourceCategory = sourceCategory;

    renderMoveItemModal();

    moveItemModalElement.classList.remove('hidden');
}

/* ==========================================================================
   RENDER MOVE ITEM MODAL
   ========================================================================== */

function renderMoveItemModal() {
    const container = moveItemContentElement || document.getElementById('move-item-content');
    if (!container) return;

    container.innerHTML = '';

    /* -----------------------------------------------------------------
       ITEM
       ----------------------------------------------------------------- */

    const itemColumn = document.createElement('div');
    itemColumn.className = 'column';

    const itemLabel = document.createElement('h6');
    itemLabel.textContent = 'ITEM';

    const itemName = document.createElement('div');
    itemName.className = 'move-item-name';
    itemName.textContent = itemToMove?.name || 'Unnamed Item';

    itemColumn.appendChild(itemLabel);
    itemColumn.appendChild(itemName);

    container.appendChild(itemColumn);

    /* -----------------------------------------------------------------
       CATEGORIES
       ----------------------------------------------------------------- */

    const categoryRow = document.createElement('div');
    categoryRow.className = 'static-row move-category-row';

    /* FROM */

    const fromColumn = document.createElement('div');
    fromColumn.className = 'column flex-grow';

    const fromLabel = document.createElement('h6');
    fromLabel.textContent = 'FROM';

    const fromValue = document.createElement('div');
    fromValue.className = 'move-item-category';
    fromValue.textContent = inventoryCategories[itemToMoveSourceCategory] || itemToMoveSourceCategory;

    fromColumn.appendChild(fromLabel);
    fromColumn.appendChild(fromValue);

    /* TO */

    const toColumn = document.createElement('div');
    toColumn.className = 'column flex-grow';

    const toLabel = document.createElement('h6');
    toLabel.textContent = 'TO';

    const select = document.createElement('select');
    select.className = 'custom-select';

    for (const [category, label] of Object.entries(inventoryCategories)) {
        if (category === itemToMoveSourceCategory) continue;

        const option = document.createElement('option');
        option.value = category;
        option.textContent = label;

        select.appendChild(option);
    }

    toColumn.appendChild(toLabel);
    toColumn.appendChild(select);

    categoryRow.appendChild(fromColumn);
    categoryRow.appendChild(toColumn);

    container.appendChild(categoryRow);

    /* -----------------------------------------------------------------
       ACTIONS
       ----------------------------------------------------------------- */

    const actionRow = document.createElement('div');
    actionRow.className = 'action-row move-item-actions';

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.className = 'flex-grow';
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', closeMoveItemModal);

    const moveButton = document.createElement('button');
    moveButton.type = 'button';
    moveButton.className = 'btn-red flex-grow';
    moveButton.textContent = 'Move';
    moveButton.addEventListener('click', () => {
        moveInventoryItem(select.value);
    });

    actionRow.appendChild(cancelButton);
    actionRow.appendChild(moveButton);

    container.appendChild(actionRow);
}

/* ==========================================================================
   MOVE ITEM
   ========================================================================== */

export function moveInventoryItem(targetCategory) {
    if (!itemToMove || !itemToMoveSourceCategory) return;
    if (!Object.prototype.hasOwnProperty.call(inventoryCategories, targetCategory)) return;
    if (targetCategory === itemToMoveSourceCategory) return;

    const sourceInventory = characterState?.bag?.[itemToMoveSourceCategory];
    if (!Array.isArray(sourceInventory)) return;

    const itemIndex = sourceInventory.indexOf(itemToMove);
    if (itemIndex === -1) return;

    if (!Array.isArray(characterState.bag[targetCategory])) {
        characterState.bag[targetCategory] = [];
    }

    sourceInventory.splice(itemIndex, 1);
    characterState.bag[targetCategory].push(itemToMove);

    closeMoveItemModal();

    setInventoryCategory(targetCategory);
}

/* ==========================================================================
   CLOSE MOVE ITEM MODAL
   ========================================================================== */

export function closeMoveItemModal() {
    if (!moveItemModalElement) return;

    moveItemModalElement.classList.add('hidden');

    itemToMove = null;
    itemToMoveSourceCategory = null;
}

/* ==========================================================================
   CASH
   ========================================================================== */

export function updateCash(value) {
    characterState.cash = parseFloat(value) || 0;
}

export function renderInventoryCash() {
    const cashInput = inventoryCashElement || document.getElementById('inventory-cash');
    if (!cashInput) return;

    cashInput.value = characterState.cash ?? 0;
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */

export function initializeInventory() {
    renderInventoryCategories();
    renderInventory();
    renderInventoryCash();
}

/* ==========================================================================
   EVENT LISTENERS
   ========================================================================== */

document.getElementById('add-item-btn')?.addEventListener('click', addInventoryItem);
document.getElementById('close-move-item-btn')?.addEventListener('click', closeMoveItemModal);

/* ==========================================================================
   GLOBAL FUNCTIONS
   ========================================================================== */

window.renderInventory = renderInventory;
window.updateCash = updateCash;
window.setInventoryCategory = setInventoryCategory;
window.initializeInventory = initializeInventory;
window.addInventoryItem = addInventoryItem;
window.openMoveItemModal = openMoveItemModal;
window.closeMoveItemModal = closeMoveItemModal;
window.moveInventoryItem = moveInventoryItem;