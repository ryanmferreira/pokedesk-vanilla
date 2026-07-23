/* ==========================================================================
   STATES AND GLOBAL SELECTORS
   ========================================================================== */
const pokemonContainerElement = document.getElementById('captured-pokemon-list');
const pokemonTeamElement = document.getElementById('pokemon-grid');

// Pokémon Attributtes
let currentPokemon = null;

const xpToAddInput = document.getElementById('xp-to-add');
const currentLvlDisplay = document.getElementById('current-level');

// Text
const pokemonHapiness = document.getElementById('poke-happiness');

// Select (no value args)
const pokeLevelVelocity = document.getElementById('poke-level-velocity');

const pokemonType1 = document.getElementById('poke-type-1');
const pokemonType2 = document.getElementById('poke-type-2');

const pokemonGender = document.getElementById('poke-gender');

const pokemonPokeball = document.getElementById('poke-pokeball-used');

const pokemonNature = document.getElementById('poke-nature');
const pokemonAbility = document.getElementById('poke-ability');

// Input
const pokemonSpecie = document.getElementById('poke-specie');
const pokemonImage = document.getElementById('add-image-input');

const totalXP = document.getElementById('poke-total-xp');
const pokemonHealth = document.getElementById('poke-hp');

const pokemonItem = document.getElementById('poke-item');

const pokemonStatusHp = document.getElementById('poke-status-hp');
const pokemonStatusAtk = document.getElementById('poke-status-atk');
const pokemonStatusSpAtk = document.getElementById('poke-status-sp-atk');
const pokemonStatusDef = document.getElementById('poke-status-def');
const pokemonStatusSpDef = document.getElementById('poke-status-sp-def');
const pokemonStatusSpd = document.getElementById('poke-status-spd');

// Selected Pokemon Info
const selectedNameDetails = document.getElementById('manage-pokemon-name');
const selectedLvlDetails = document.getElementById('detail-lvl-num');
const selectedXpDetails = document.getElementById('detail-exp-num');
const selectedHappinessDetails = document.getElementById('detail-happy-text');
const selectedHealthDetails = document.getElementById('detail-hp-text');
const selectedImgDetails = document.getElementById('detail-img');

// Modal
const pokemonModal = document.getElementById('pokemon-management-modal');
const editPokemonModal = document.getElementById('edit-pokemon-modal');
const addImageModal = document.getElementById('add-image-modal');

/* ==========================================================================
   CAPTURED POKEMON MANAGEMENT
   ========================================================================== */
function renderPokemonTeam() {
    if (!pokemonTeamElement) {
        return;
    }

    pokemonTeamElement.innerHTML = '';

    let teamSize = 0;

    for (let index in characterState.team) {
        const pokemonData = characterState.team[index];

        const pokemonElement = document.createElement('button');
        pokemonElement.classList = 'pokemon-slot active-slot';

        teamSize++;

        pokemonElement.innerHTML = `
            <div class="pokemon-image-placeholder"></div>
            <div class="column pokemon-info">
                <div class="static-row align-between">
                    <h5>Pokémon Name</h5>
                    <h6>LVL 12</h6>
                </div>
                <div class="health-bar-container">
                    <div class="health-bar-fill" style="width: 100%;"></div>
                </div>
                <div class="static-row align-between tiny-text">
                    <span>HP 12/12</span>
                    <span>Happiness 5/10</span>
                </div>
            </div>
        `;

        pokemonElement.addEventListener('click', () => {
            selectPokemon(pokemonData);
        });

        pokemonTeamElement.appendChild(pokemonElement);
    }

    for (let i = 0; i < (6 - teamSize); i++) {
        console.log(i)

        const emptySlot = document.createElement('button');
        emptySlot.textContent = '(+) Empty';
        emptySlot.classList = 'pokemon-slot empty-slot';

        pokemonTeamElement.appendChild(emptySlot);
    }
}

function renderPokemonBasicInfo() {
    if (!pokemonContainerElement) {
        return
    };

    pokemonContainerElement.innerHTML = '';

    for (let index in characterState.capturedPokemon) {
        const poke = characterState.capturedPokemon[index];
        const pokemon = document.createElement('button');
        pokemon.className = 'captured-item';

        pokemon.innerHTML = `
        <div class="detail-box avatar-box"><img src="${poke.imgUrl}" alt="${poke.species}"></div>
            <div class="item-info column">
                <div class="static-row align-between">
                    <span class="poke-item-name">${poke.species}</span>
                    <span class="poke-item-lvl">LVL ${poke.level}</span>
                </div>
                <div class="health-bar-container green-bar">
                    <div class="health-bar-fill" style="width: 100%;"></div>
                </div>
                <div class="static-row align-between tiny-text">
                    <span>HP<br> ${poke.hp} / ${poke.status.hp}</span>
                    <span>HAPPINESS<br> ${poke.happiness} / 10</span>
                </div>
            </div>
        `;

        pokemon.addEventListener('click', () => {
            selectPokemon(poke);
        });

        pokemonContainerElement.appendChild(pokemon);
    }
}

function selectPokemon(pokemon) {
    console.log(pokemon);
    showSelectedPokemon();

    selectedLvlDetails.textContent = pokemon.level;
    selectedXpDetails.textContent = pokemon.xp;
    selectedHappinessDetails.textContent = pokemon.happiness;
    selectedHealthDetails.textContent = `${pokemon.hp} / ${pokemon.status?.hp || '?'}`;
    selectedNameDetails.textContent = pokemon.species;

    selectedImgDetails.innerHTML = `<img src="${pokemon.imgUrl}" alt="${pokemon.species}">`;

    currentPokemon = pokemon;
}

function handlePokemonEdit() {
    console.log("Editing: ", currentPokemon.species);
    openEditPokemon();
}

function handlePokemonDelete() {
    console.log("Deleting: ", currentPokemon.species);

    const index = characterState.capturedPokemon.indexOf(currentPokemon);
    characterState.capturedPokemon.splice(index, 1);

    currentPokemon = null;
    hiddenSelectedPokemon();
    renderPokemonBasicInfo();
}

function alterPokemonHappiness(quantity) {
    let pokeHappiness = parseInt(pokemonHapiness.textContent, 10);

    pokeHappiness += quantity;

    if (pokeHappiness > 10) {
        pokeHappiness = 10;
    }
    else if (pokeHappiness < 0) {
        pokeHappiness = 0;
    }

    pokemonHapiness.textContent = pokeHappiness;
}

function addPokemon() {
    characterState.capturedPokemon.push({
        species: 'NEW POKÉMON',
        gender: '',
        level: 5,
        type1: '',
        type2: '',
        levelSpeed: '',
        xp: 0,
        hp: 0,
        capturedBy: '',
        item: '',
        happiness: 1,
        nature: '',
        ability: '',
        status: {
            hp: 5,
            atk: 5,
            spAtk: 5,
            def: 5,
            spDef: 5,
            spd: 5
        },
        attacks: [
            { atkName: '', atkType: '', pp: 10, pwr: 40, haveEffect: false, effect: '' }
        ],
        imgUrl: 'https://raw.githubusercontent.com/ryanmferreira/pokedesk-vanilla/refs/heads/main/assets/icons/pokeball.svg'
    });

    console.log(characterState);

    renderPokemonBasicInfo();
}

function addToTeam() {
    if (!currentPokemon) {
        return;
    }

    characterState.team.push(currentPokemon);

    renderPokemonTeam()
    debugPlayer();
}

function updatePokemonInfo() {
    if (!currentPokemon) {
        return;
    }

    currentPokemon.species = pokemonSpecie?.value;
    currentPokemon.gender = pokemonGender?.value;
    currentPokemon.levelSpeed = pokeLevelVelocity?.value;
    currentPokemon.type1 = pokemonType1?.value;
    currentPokemon.type2 = pokemonType2?.value;
    currentPokemon.capturedBy = pokemonPokeball?.value;
    currentPokemon.nature = pokemonNature?.value;
    currentPokemon.ability = pokemonAbility?.value;
    currentPokemon.item = pokemonItem?.value;
    currentPokemon.imgUrl = pokemonImage?.value;

    currentPokemon.xp = parseInt(totalXP?.value, 10);
    currentPokemon.level = calculateLevel(currentPokemon.xp);
    currentPokemon.happiness = parseInt(pokemonHapiness?.textContent, 10);
    currentPokemon.hp = parseInt(pokemonHealth?.value, 10);

    currentPokemon.status = {
        hp: parseInt(pokemonStatusHp?.value, 10),
        atk: parseInt(pokemonStatusAtk?.value, 10),
        spAtk: parseInt(pokemonStatusSpAtk?.value, 10),
        def: parseInt(pokemonStatusDef?.value, 10),
        spDef: parseInt(pokemonStatusSpDef?.value, 10),
        spd: parseInt(pokemonStatusSpd?.value, 10)
    };

    selectPokemon(currentPokemon);
    renderPokemonBasicInfo();

    closeEditPokemon();
}

/* ==========================================================================
   MODAL AND UI CONTROL
   ========================================================================== */
function showSelectedPokemon() {
    document.querySelector('.select-pokemon').style.display = 'flex';
}

function hiddenSelectedPokemon() {
    document.querySelector('.select-pokemon').style.display = 'none';
}

function openPokemon(pokeArray = null) {
    if (pokeArray) {
        characterState.capturedPokemon = pokeArray;
    }

    renderPokemonBasicInfo();
    pokemonModal?.classList.remove('hidden');
}

function closePokemon() {
    pokemonModal?.classList.add('hidden');
    hiddenSelectedPokemon();
}

function closeAddImage() {
    addImageModal?.classList.add('hidden');
}

function openAddImage() {
    addImageModal?.classList.remove('hidden');
}

function openEditPokemon() {
    if (!currentPokemon) return;

    if (pokemonSpecie) pokemonSpecie.value = currentPokemon.species;
    if (pokemonGender) pokemonGender.value = currentPokemon.gender;
    if (pokeLevelVelocity) pokeLevelVelocity.value = currentPokemon.levelSpeed;
    if (pokemonType1) pokemonType1.value = currentPokemon.type1;
    if (pokemonType2) pokemonType2.value = currentPokemon.type2;
    if (pokemonPokeball) pokemonPokeball.value = currentPokemon.capturedBy;
    if (pokemonNature) pokemonNature.value = currentPokemon.nature;
    if (pokemonAbility) pokemonAbility.value = currentPokemon.ability;
    if (pokemonItem) pokemonItem.value = currentPokemon.item;
    if (pokemonHapiness) pokemonHapiness.textContent = currentPokemon.happiness;

    if (totalXP) totalXP.value = currentPokemon.xp;
    if (pokemonHealth) pokemonHealth.value = currentPokemon.hp;
    if (pokemonImage) pokemonImage.value = currentPokemon.imgUrl;

    if (pokemonStatusHp) pokemonStatusHp.value = currentPokemon.status?.hp;
    if (pokemonStatusAtk) pokemonStatusAtk.value = currentPokemon.status?.atk;
    if (pokemonStatusSpAtk) pokemonStatusSpAtk.value = currentPokemon.status?.spAtk;
    if (pokemonStatusDef) pokemonStatusDef.value = currentPokemon.status?.def;
    if (pokemonStatusSpDef) pokemonStatusSpDef.value = currentPokemon.status?.spDef;
    if (pokemonStatusSpd) pokemonStatusSpd.value = currentPokemon.status?.spd;

    updateLevel();

    if (editPokemonModal) {
        editPokemonModal.classList.remove('hidden');
        updateAllEffectInputs();
    }
}

function closeEditPokemon() {
    editPokemonModal?.classList.add('hidden');
}

function toggleEffectInput(checkbox) {
    const textInput = checkbox.nextElementSibling;
    if (textInput) {
        textInput.disabled = !checkbox.checked;
    }
}

function updateAllEffectInputs() {
    const checkboxes = document.querySelectorAll('#edit-pokemon-modal .custom-checkbox');
    checkboxes.forEach(checkbox => toggleEffectInput(checkbox));
}

/* ==========================================================================
   EVENT LISTENERS
   ========================================================================== */
document.getElementById('add-pokemon-btn')?.addEventListener('click', () => {
    addPokemon();
});

document.getElementById('add-selected-pokemon')?.addEventListener('click', () => {
    addToTeam();
});

document.getElementById('delete-selected-pokemon')?.addEventListener('click', () => {
    handlePokemonDelete();
});

document.getElementById('edit-selected-pokemon')?.addEventListener('click', () => {
    handlePokemonEdit();
});

document.getElementById('save-pokemon-btn')?.addEventListener('click', () => {
    updatePokemonInfo();
});

document.getElementById('add-xp')?.addEventListener('click', () => {
    addXP();
});

pokeLevelVelocity?.addEventListener('change', () => {
    updateLevel();
});

/* ==========================================================================
   LEVEL & XP RULES
   ========================================================================== */
function getMinimumXp(level, velocity) {
    switch (velocity) {
        case "fast": return 0.8 * level * level;
        case "medium": return 1.0 * level * level;
        case "slow": return 1.25 * level * level;
        case "pseudo-legendary": return 1.5 * level * level;
        case "legendary": return 2.0 * level * level;
        default: return 1.0 * level * level;
    }
}

function calculateLevel(xpTotal) {
    if (!pokeLevelVelocity) return 5;
    const velocity = pokeLevelVelocity.value.toLowerCase();
    const xpInput = parseFloat(xpTotal) || 0;

    const baseXpForLvl5 = getMinimumXp(5, velocity);
    const totalXp = xpInput + baseXpForLvl5;

    let level = 5;

    switch (velocity) {
        case "fast": level = Math.floor(Math.sqrt(totalXp / 0.8)); break;
        case "medium": level = Math.floor(Math.sqrt(totalXp / 1.0)); break;
        case "slow": level = Math.floor(Math.sqrt(totalXp / 1.25)); break;
        case "pseudo-legendary": level = Math.floor(Math.sqrt(totalXp / 1.5)); break;
        case "legendary": level = Math.floor(Math.sqrt(totalXp / 2.0)); break;
        default: level = Math.floor(Math.sqrt(totalXp / 1.0)); break;
    }

    return Math.max(5, level);
}

function updateLevel() {
    if (!totalXP) return;
    const currentXP = totalXP.value;
    const level = calculateLevel(currentXP);

    if (currentLvlDisplay) {
        currentLvlDisplay.textContent = level;
    }
}

function addXP() {
    if (!totalXP || !xpToAddInput) {
        return;
    }

    const currentTotal = parseInt(totalXP.value, 10) || 0;
    const addedXP = parseInt(xpToAddInput.value, 10) || 0;

    totalXP.value = currentTotal + addedXP;
    xpToAddInput.value = '';

    updateLevel();
}