/* ==========================================================================
   STATES AND GLOBAL SELECTORS
   ========================================================================== */

// Player Elements Container
const itemsContainerElement = document.getElementById('inventory-items-container');
const characterImageElement = document.getElementById('character-image-element');

const avaliablePoints = document.getElementById('points-label');

const lastSavedElement = document.getElementById('last-saved');

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
const characterImageInput = document.getElementById('character-image');

// Player Attribute Displays (text)
const resistanceElement = document.getElementById('attr-resistance');
const strengthElement = document.getElementById('attr-strength');
const minElement = document.getElementById('attr-mind');
const agilityElement = document.getElementById('attr-agility');

// Player Base Values
const baseHp = 0;
let characterMaxHp = calculateMaxHP();

// Buttons
const addCharacterImage = document.getElementById('add-image-button');

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

    const currentHp = characterState?.hp ?? 0;
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
    if (!characterState?.attributes) {
        return;
    }

    let currentUsedPoints = 0;
    for (let key in characterState.attributes) {
        currentUsedPoints += characterState.attributes[key];
    }

    const maxPointsAllowed = characterState.points + 4;

    if (quantity > 0 && currentUsedPoints >= maxPointsAllowed) {
        return;
    }

    const currentValue = characterState.attributes[attributeName] || 0;
    const newValue = currentValue + quantity;

    if (newValue < 1) {
        return;
    }

    characterState.attributes[attributeName] = newValue;

    let updatedUsedPoints = 0;

    for (let key in characterState.attributes) {
        updatedUsedPoints += characterState.attributes[key];
    }

    if (avaliablePoints) {
        avaliablePoints.innerText = `Points to distribute: ${maxPointsAllowed - updatedUsedPoints}`;
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
    if (characterCash) { characterState.cash = parseFloat(characterCash.value); }
    if (characterImageInput) { characterState.image = characterImageInput.value; }

    updateLastSaved();
    updatePlayerImage();
    updatePlayerHP();
    updatePlayerName();
}

function updateLastSaved() {
    if (!lastSavedElement || !characterState?.lastSaved) {
        if (lastSavedElement) lastSavedElement.textContent = '';
        return;
    }

    const date = new Date(characterState.lastSaved);

    if (isNaN(date.getTime())) {
        lastSavedElement.textContent = '';
        return;
    }

    lastSavedElement.textContent = "Last saved: " + date.toLocaleString("pt-BR", {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

window.updateLastSaved = updateLastSaved;

function setPlayerInfo() {
    const nameInput = document.getElementById('character-name');
    const raceInput = document.getElementById('character-race');
    const classInput = document.getElementById('character-class');
    const cashInput = document.getElementById('inventory-cash');
    const imageInput = document.getElementById('character-image');

    if (nameInput) { nameInput.value = characterState.name ?? ''; }
    if (raceInput) { raceInput.value = characterState.race ?? ''; }
    if (classInput) { classInput.value = characterState.class ?? ''; }
    if (cashInput) { cashInput.value = characterState.cash ?? 0; }
    if (imageInput) { imageInput.value = characterState.image ?? ''; }

    updateLastSaved();

    if (characterState.attributes) {
        for (const [attr, val] of Object.entries(characterState.attributes)) {
            const attrDisplay = document.getElementById(`attr-${attr}`);

            if (attrDisplay) {
                attrDisplay.textContent = val;
            }
        }
    }

    updatePlayerImage();
    updatePlayerHP();
    updatePlayerName();
    alterAttribute('resistance', 0);
}

function updatePlayerName() {
    const nameElements = document.querySelectorAll('.get-player-name');
    const nameToDisplay = (characterState.name || 'Player').toUpperCase();

    nameElements.forEach(el => {
        el.textContent = nameToDisplay;
    });
}

function updatePlayerImage() {
    if (characterImageElement) {
        characterImageElement.src = characterState.image || '';
    }
}

/* ==========================================================================
   MODAL IMAGE CONTROLS
   ========================================================================== */

function openCharacterAddImage() {
    if (characterImageInput) {
        characterImageInput.value = characterState.image || '';
    }

    addCharacterImageModal?.classList.remove('hidden');
}

function closeCharacterAddImage() {
    if (characterImageInput) {
        characterState.image = characterImageInput.value;
    }

    updatePlayerImage();
    addCharacterImageModal?.classList.add('hidden');
}

/* ==========================================================================
   EVENT LISTENERS
   ========================================================================== */

document.getElementById('add-item-btn')?.addEventListener('click', () => {
    if (!characterState.inventory) characterState.inventory = [];
    characterState.inventory.push({ name: '', quantity: 1 });
    if (typeof renderInventory === 'function') {
        renderInventory();
    }
});

characterName?.addEventListener('change', getPlayerInfo);
characterRace?.addEventListener('change', getPlayerInfo);
characterClass?.addEventListener('change', getPlayerInfo);
characterCash?.addEventListener('change', getPlayerInfo);

addCharacterImage?.addEventListener('click', () => {
    openCharacterAddImage();
});