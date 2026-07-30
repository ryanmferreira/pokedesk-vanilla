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

    if (currentHpElement) { currentHpElement.textContent = currentHp; }
    if (hpStatusElement) { hpStatusElement.textContent = `${currentHp}/${maxHp}`; }
    if (maxHpElement) { maxHpElement.textContent = maxHp; }

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

    characterState.attributes[attributeName] = (characterState.attributes[attributeName]) + quantity;

    if (characterState.attributes[attributeName] < 1) {
        characterState.attributes[attributeName] = 1;
    }

    const attrDisplay = document.getElementById(`attr-${attributeName}`);

    if (attrDisplay) {
        attrDisplay.textContent = characterState.attributes[attributeName];
    }

    updatePlayerHP();
}

function alterHP(quantity) {
    updateMaxHP();

    characterState.hp = (characterState.hp || 0) + quantity;

    if (characterState.hp > characterMaxHp) {
        characterState.hp = characterMaxHp;
    }
    else if (characterState.hp < 0) {
        characterState.hp = 0;
    }

    updatePlayerHP();
}

function checkPlayerItems() {
    if (!characterState.inventory) {
        characterState.inventory = [];
    }

    return characterState.inventory;
}

/* ==========================================================================
   LOAD / SAVE PLAYER STATUS
   ========================================================================== */

function getPlayerInfo() {
    if (characterName) { characterState.name = characterName.value; }
    if (characterRace) { characterState.race = characterRace.value; }
    if (characterClass) { characterState.class = characterClass.value; }
    if (characterCash) { characterState.cash = parseFloat(characterCash.value) || 0; }

    updatePlayerHP();
    updatePlayerName();
}

function setPlayerInfo() {
    const nameInput = document.getElementById('character-name');
    const raceInput = document.getElementById('character-race');
    const classInput = document.getElementById('character-class');
    const cashInput = document.getElementById('inventory-cash');

    if (nameInput) { nameInput.value = characterState.name ?? ''; }
    if (raceInput) { raceInput.value = characterState.race ?? ''; }
    if (classInput) { classInput.value = characterState.class ?? ''; }
    if (cashInput) { cashInput.value = characterState.cash ?? 0; }

    if (characterState.attributes) {
        for (const [attr, val] of Object.entries(characterState.attributes)) {
            const attrDisplay = document.getElementById(`attr-${attr}`);
            if (attrDisplay) attrDisplay.textContent = val;
        }
    }

    updatePlayerHP();
    updatePlayerName();

    console.log("Informations loaded successfully!\n", characterState);
}

function updatePlayerName() {
    const nameElements = document.querySelectorAll('.get-player-name');
    const nameToDisplay = (characterState.name || 'Player').toUpperCase();

    nameElements.forEach(el => {
        el.textContent = nameToDisplay;
    });
}

/* ==========================================================================
   EVENT LISTENERS
   ========================================================================== */

document.getElementById('add-item-btn')?.addEventListener('click', () => {
    characterState.inventory.push({ name: '', quantity: 1 });
    renderInventory();
});

characterName?.addEventListener('change', () => {
    getPlayerInfo();
});