/* ==========================================================================
   STATES AND GLOBAL SELECTORS
   ========================================================================== */

// Player Elements Container
const itemsContainerElement = document.getElementById('inventory-items-container');

// Player Health Displays
const maxHpElement = document.getElementById('max-hp');
const currentHpElement = document.getElementById('hp-display');
const hpPercentageElement = document.getElementById('hp-percentage');
const hpStatusElement = document.getElementById('hp-status');

// Player Form Inputs
const characterName = document.getElementById('character-name');
const characterRace = document.getElementById('character-race');
const characterClass = document.getElementById('character-class');

const characterCash = document.getElementById('inventory-cash');

// Player Attribute Displays (text)
const resistanceElement = document.getElementById('attr-resistance');
const strengthElement = document.getElementById('attr-strength');
const minElement = document.getElementById('attr-mind');
const agilityElement = document.getElementById('attr-agility');

// Modals
const inventoryModal = document.getElementById('inventory-modal');

// Player Base Values
const baseHp = 0;
let characterMaxHp = calculateMaxHP();

/* ==========================================================================
   PLAYER MANAGEMENT
   ========================================================================== */
function calculateMaxHP() {
    const resistance = characterState?.attributes?.resistance || 1;
    return baseHp + (resistance * 5);
}

function updateMaxHP() {
    characterMaxHp = calculateMaxHP();
}

function updatePlayerHP() {
    updateMaxHP();

    const currentHp = characterState.hp ?? 0;
    const maxHp = characterMaxHp || 1;

    if (currentHpElement) currentHpElement.textContent = currentHp;
    if (hpStatusElement) hpStatusElement.textContent = `${currentHp}/${maxHp}`;
    if (maxHpElement) maxHpElement.textContent = maxHp;

    const percentage = Math.max(0, Math.min(100, Math.round((currentHp / maxHp) * 100)));

    if (hpPercentageElement) {
        hpPercentageElement.textContent = `${percentage}%`;
    }

    const hpDonut = document.querySelector('.hp-donut');
    if (hpDonut) {
        hpDonut.style.setProperty('--percentage', `${percentage}%`);
    }
}

function alterAttribute(attributeName, quantity) {
    if (!characterState?.attributes) return;

    let currentUsedPoints = 0;
    for (let key in characterState.attributes) {
        currentUsedPoints += characterState.attributes[key];
    }

    if (quantity > 0 && currentUsedPoints >= (characterState.points + 4)) {
        return;
    }

    characterState.attributes[attributeName] = (characterState.attributes[attributeName] || 1) + quantity;

    if (characterState.attributes[attributeName] < 1) {
        characterState.attributes[attributeName] = 1;
    }

    const attrDisplay = document.getElementById(`attr-${attributeName}`);
    if (attrDisplay) {
        attrDisplay.textContent = characterState.attributes[attributeName];
    }

    updatePlayerHP();
    debugPlayer();
}

function alterHP(quantity) {
    updateMaxHP();

    characterState.hp = (characterState.hp || 0) + quantity;

    if (characterState.hp > characterMaxHp) {
        characterState.hp = characterMaxHp;
    } else if (characterState.hp < 0) {
        characterState.hp = 0;
    }

    updatePlayerHP();
    debugPlayer();
}

function updatePlayerInfo() {
    if (characterName) characterState.name = characterName.value;
    if (characterRace) characterState.race = characterRace.value;
    if (characterClass) characterState.class = characterClass.value;
    if (characterCash) characterState.cash = parseFloat(characterCash.value) || 0;

    updatePlayerHP();
    updateAllPlayerNames();
}

function loadPlayerInfo() {
    const nameInput = document.getElementById('character-name');
    const raceInput = document.getElementById('character-race');
    const classInput = document.getElementById('character-class');
    // CORRIGIDO: O ID correto conforme seu HTML é inventory-cash
    const cashInput = document.getElementById('inventory-cash');

    if (nameInput) nameInput.value = characterState.name ?? '';
    if (raceInput) raceInput.value = characterState.race ?? '';
    if (classInput) classInput.value = characterState.class ?? '';
    if (cashInput) cashInput.value = characterState.cash ?? 0;

    if (characterState.attributes) {
        for (const [attr, val] of Object.entries(characterState.attributes)) {
            const attrDisplay = document.getElementById(`attr-${attr}`);
            if (attrDisplay) attrDisplay.textContent = val;
        }
    }

    updatePlayerHP();
    updateAllPlayerNames();

    console.log("Informations loaded successfully!", characterState);
}

function updateAllPlayerNames() {
    const nameElements = document.querySelectorAll('.get-player-name');
    const nameToDisplay = (characterState.name || 'Aldric').toUpperCase();

    nameElements.forEach(el => {
        el.textContent = nameToDisplay;
    });
}

function debugPlayer() {
    console.log("Player: ", characterState);
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

/* ==========================================================================
   MODAL AND UI CONTROL
   ========================================================================== */
function openInventory(itemsArray = null) {
    if (itemsArray) {
        characterState.inventory = itemsArray;
    }

    renderInventory();
    inventoryModal?.classList.remove('hidden');
}

function closeInventory() {
    inventoryModal?.classList.add('hidden');
}

/* ==========================================================================
   EVENT LISTENERS
   ========================================================================== */
document.getElementById('add-item-btn')?.addEventListener('click', () => {
    characterState.inventory.push({ name: '', quantity: 1 });
    renderInventory();
});

characterName?.addEventListener('change', () => {
    updatePlayerInfo();
});

characterRace?.addEventListener('change', () => {
    updatePlayerInfo();
});

characterClass?.addEventListener('change', () => {
    updatePlayerInfo();
});