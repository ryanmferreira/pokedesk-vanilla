/* ==========================================================================
   STATES AND GLOBAL SELECTORS
   ========================================================================== */

// Player elements
const itemsContainerElement = document.getElementById('inventory-items-container');
const pokemonContainerElement = document.getElementById('captured-pokemon-list');

const maxHpElement = document.getElementById("max-hp");
const hpPercentageElement = document.getElementById("hp-percentage");
const hpStatusElement = document.getElementById("hp-status");

// Player Values
let characterMaxHp = characterState.attributes.resistance * 5;
const baseHp = 0;

// Player Attributes
const currentHpElement = document.getElementById('hp-display');

const resistanceElement = document.getElementById('attr-resistance');
const strengthElement = document.getElementById('attr-strength');
const minElement = document.getElementById('attr-mind');
const agilityElement = document.getElementById('attr-agility');

// Modals
const inventoryModal = document.getElementById('inventory-modal');
const pokemonModal = document.getElementById('pokemon-management-modal');
const editPokemonModal = document.getElementById('edit-pokemon-modal');

/* ==========================================================================
   PLAYER MANAGEMENT
   ========================================================================== */
function alterAttribute(attributeName, quantity) {
    let currentUsedPoints = 0;

    for (let key in characterState.attributes) {
        currentUsedPoints += characterState.attributes[key];
    }

    if (quantity > 0 && currentUsedPoints >= (characterState.points + 4)) {
        return;
    }

    characterState.attributes[attributeName] += quantity;

    if (characterState.attributes[attributeName] < 1) {
        characterState.attributes[attributeName] = 1;
    }

    document.getElementById(`attr-${attributeName}`).textContent = characterState.attributes[attributeName];

    updatePlayerHP();
    debugPlayer();
}

function alterHP(quantity) {
    characterState.hp += quantity;

    if (characterState.hp > characterMaxHp) {
        characterState.hp = characterMaxHp;
    }
    else if (characterState.hp < 0) {
        characterState.hp = 0;
    }

    updatePlayerHP();
    debugPlayer();
}

function updateMaxHP() {
    characterMaxHp = baseHp + characterState.attributes.resistance * 5;
}

function updatePlayerHP() {
    updateMaxHP();

    currentHpElement.textContent = characterState.hp;
    hpStatusElement.textContent = `${characterState.hp}/${characterMaxHp}`;

    const percentage = Math.round((characterState.hp / characterMaxHp) * 100);
    hpPercentageElement.textContent = `${percentage}%`;

    const hpDonut = document.querySelector(".hp-donut");
    hpDonut.style.setProperty("--percentage", `${percentage}%`);

    maxHpElement.textContent = characterMaxHp;
}

function debugPlayer() {
    console.log("Player attributes: ", characterState.attributes);
}

function updatePlayerInfo() {
    updatePlayerHP();
}

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
                <input type="text" class="inventory-item-input" value="${item.name}" onchange="updateItemName(${index}, this.value)">
                <input type="number" class="inventory-qty-input" value="${item.quantity}" min="1" onchange="updateItemQty(${index}, this.value)">
            </div>
            <button class="item-delete-btn" onclick="removeItem(${index})">×</button>
        `;

        itemsContainerElement.appendChild(itemRow);
    }
}

function updateItemName(index, val) {
    characterState.inventory[index].name = val;
}

function updateItemQty(index, val) {
    characterState.inventory[index].quantity = parseInt(val, 10) || 1;
}

function removeItem(index) {
    characterState.inventory.splice(index, 1);
    renderInventory();
}

/* ==========================================================================
   MODAL AND UI CONTROL
   ========================================================================== */

function openInventory(itemsArray = null) {
    if (itemsArray) characterState.inventory = itemsArray;

    renderInventory();
    inventoryModal?.classList.remove('hidden');
}

function closeInventory() {
    inventoryModal?.classList.add('hidden');
}

function updateAllPlayerNames() {
    const nameElements = document.querySelectorAll('.get-player-name');

    nameElements.forEach(el => {
        el.textContent = characterState.name.toUpperCase();
    });
}

/* ==========================================================================
   EVENT LISTENERS
   ========================================================================== */
document.getElementById('add-item-btn')?.addEventListener('click', () => {
    characterState.inventory.push({ name: '', quantity: 1 });
    renderInventory();
});