const itemsContainer = document.getElementById('inventory-items-container');
const pokemonContainer = document.getElementById('captured-pokemon-list');

const inventoryModal = document.getElementById('inventory-modal');
const pokemonModal = document.getElementById('pokemon-management-modal');

const pokeLevelUpVelocity = document.getElementById('level-up-velocity');

const totalXPInput = document.getElementById('total-xp');
const xpToAddInput = document.getElementById('xp-to-add');
const currentLvlDisplay = document.getElementById('current-level');

let characterState = {
    id: 1,
    name: "Aldric",
    cash: 0,
    attributes: { resistance: 1, strength: 1, mind: 1, agility: 1 },
    inventory: [],
    capturedPokemon: []
};

function openInventory(playerName = null, itemsArray = null) {
    const nameToDisplay = playerName ? playerName : characterState.name;

    if (itemsArray) {
        characterState.inventory = itemsArray;
    }

    document.getElementById('inventory-player-name').textContent = nameToDisplay.toUpperCase();

    renderInventory();
    inventoryModal.classList.remove('hidden');
}

function openPokemon(playerName = null, itemsArray = null) {
    const nameToDisplay = playerName ? playerName : characterState.name;

    if (itemsArray) {
        characterState.capturedPokemon = itemsArray;
    }

    document.getElementById('manage-player-name').textContent = nameToDisplay.toUpperCase();

    renderPokemon();
    pokemonModal.classList.remove('hidden');
}

function closeInventory() {
    inventoryModal.classList.add('hidden');
}

function closePokemon() {
    pokemonModal.classList.add('hidden');
}

function renderInventory() {
    itemsContainer.innerHTML = '';

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

        itemsContainer.appendChild(itemRow);
    }
}

function renderPokemon() {
    pokemonContainer.innerHTML = '';

    for (let index in characterState.capturedPokemon) {
        const poke = characterState.capturedPokemon[index];

        const itemRow = document.createElement('button');
        itemRow.className = 'captured-item';

        itemRow.innerHTML = `
            <div class="item-avatar"></div>
            <div class="item-info column">
                <div class="static-row align-between">
                    <span class="poke-item-name">${poke.species || 'POKÉMON NAME'}</span>
                    <span class="poke-item-lvl">LVL ${poke.level || 1}</span>
                </div>
                <div class="health-bar-container green-bar">
                    <div class="health-bar-fill" style="width: 100%;"></div>
                </div>
                <div class="static-row align-between tiny-text">
                    <span>HP 12 / 12</span>
                    <span>HAPPINESS ${poke.happiness || 0} / 10</span>
                </div>
            </div>
        `;

        pokemonContainer.appendChild(itemRow);
    }
}

document.getElementById('add-item-btn').addEventListener('click', () => {
    characterState.inventory.push({ name: '', quantity: 1 });
    renderInventory();
});

document.getElementById('add-pokemon-btn').addEventListener('click', () => {
    characterState.capturedPokemon.push({ species: 'NEW POKÉMON', level: 1, happiness: 5 });
    renderPokemon();
});

document.getElementById('add-xp').addEventListener('click', () => {
    addXP();
});

document.getElementById('level-up-velocity').addEventListener('input', () => {
    calculateLevel(Number(totalXPInput.value));
});

function getMinimumXp(level, velocity) {
    switch (velocity) {
        case "fast":
            return 0.8 * level * level;
        case "medium":
            return level * level;
        case "slow":
            return 1.25 * level * level;
        case "pseudo-legendary":
            return 1.5 * level * level;
        case "legendary":
            return 2.0 * level * level;
        default:
            return level * level;
    }
}

function calculateLevel(xpTotal) {
    const velocity = pokeLevelUpVelocity.value.toLowerCase();

    const minXp = getMinimumXp(5, velocity);

    const xp = parseFloat(xpTotal) || 0;
    const totalXpWithOffset = xp + minXp;

    let level = 1;

    switch (velocity) {
        case "fast":
            level = Math.floor(Math.sqrt(totalXpWithOffset / 0.8));
            break;
        case "medium":
            level = Math.floor(Math.sqrt(totalXpWithOffset / 1.0));
            break;
        case "slow":
            level = Math.floor(Math.sqrt(totalXpWithOffset / 1.25));
            break;
        case "pseudo-legendary":
            level = Math.floor(Math.sqrt(totalXpWithOffset / 1.5));
            break;
        case "legendary":
            level = Math.floor(Math.sqrt(totalXpWithOffset / 2.0));
            break;
        default:
            level = Math.floor(Math.sqrt(totalXpWithOffset));
            break;
    }

    if (level < 1) {
        return 1;
    }
    else if (level >= 100) {
        return 100;
    }
    else {
        return level;
    }
}

function updateLevelUI() {
    const currentXP = totalXPInput.value;

    const level = calculateLevel(currentXP);

    if (currentLvlDisplay) {
        currentLvlDisplay.textContent = level;
    }

    console.log(pokeLevelUpVelocity.value, totalXPInput.value, level);
}

function addXP() {
    const currentTotal = parseInt(totalXPInput.value, 10) || 0;
    const addedXP = parseInt(xpToAddInput.value, 10) || 0;

    const newTotal = currentTotal + addedXP;

    totalXPInput.value = newTotal;
    xpToAddInput.value = '';

    updateLevelUI();
}

document.getElementById('level-up-velocity').addEventListener('change', () => {
    updateLevelUI();
});

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

function openEditPokemon() {
    const modal = document.getElementById('edit-pokemon-modal');
    if (modal) {
        modal.classList.remove('hidden');
        updateAllEffectInputs();
    }
}

function closeEditPokemon() {
    const modal = document.getElementById('edit-pokemon-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function toggleEffectInput(checkbox) {
    const textInput = checkbox.nextElementSibling;
    if (textInput) {
        textInput.disabled = !checkbox.checked;
    }
}

function updateAllEffectInputs() {
    const checkboxes = document.querySelectorAll('#edit-pokemon-modal .custom-checkbox');

    checkboxes.forEach(checkbox => {
        toggleEffectInput(checkbox);
    });
}