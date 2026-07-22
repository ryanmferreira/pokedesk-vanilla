/* ==========================================================================
   STATES AND GLOBAL SELECTORS
   ========================================================================== */

// Pokémon Attributtes
const pokeLevelUpVelocity = document.getElementById('poke-level-velocity');
const totalXPInput = document.getElementById('total-xp');
const xpToAddInput = document.getElementById('xp-to-add');
const currentLvlDisplay = document.getElementById('current-level');
const pokemonHapiness = document.getElementById('pokemon-happiness');

// Selected Pokemon Info
const selectedNameDetails = document.getElementById('manage-pokemon-name');
const selectedLvlDetails = document.getElementById('detail-lvl-num');
const selectedXpDetails = document.getElementById('detail-exp-num');
const selectedHappinessDetails = document.getElementById('detail-happy-text');
const selectedHealthDetails = document.getElementById('detail-hp-text');
const selectedImgDetails = document.getElementById('detail-img');


/* ==========================================================================
   CAPTURED POKEMON MANAGEMENT
   ========================================================================== */
function renderPokemonBasicInfo() {
    if (!pokemonContainerElement) return;
    pokemonContainerElement.innerHTML = '';

    for (let index in characterState.capturedPokemon) {
        const poke = characterState.capturedPokemon[index];
        const pokemon = document.createElement('button');
        pokemon.className = 'captured-item';

        pokemon.innerHTML = `
            <div class="detail-box avatar-box"><img src="${poke.imgUrl}" alt="${poke.species}"></div>
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

        pokemon.addEventListener('click', () => {
            selectPokemon(poke);
        });

        pokemonContainerElement.appendChild(pokemon);
    }
}

function selectPokemon(pokemon) {
    console.log(pokemon);

    selectedLvlDetails.textContent = pokemon.level;
    selectedXpDetails.textContent = pokemon.xp;
    selectedHappinessDetails.textContent = pokemon.happiness;
    selectedHealthDetails.textContent = `${pokemon.hp} / ${pokemon.status?.hp || '?'}`;
    selectedNameDetails.textContent = pokemon.species;

    selectedImgDetails.innerHTML = `<img src="${pokemon.imgUrl}" alt="${pokemon.species}">`;
}

function handlePokemonEdit(pokemon) {
    console.log(pokemon);
}

function alterPokemonHappiness(quantity) {
    // pokemonHapiness
}

function updatePokemonInfo() {

}

function addPokemon() {
    characterState.capturedPokemon.push({
        species: 'NEW POKÉMON',
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
        imgUrl: 'https://imgs.search.brave.com/DPXaIr7D-rZeiygOpRELOGuZ8XK98kHl18ppsfXsPPk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wbmcu/cG5ndHJlZS5jb20v/cG5nLXZlY3Rvci8y/MDIyMDkxNC9vdXJt/aWQvcG5ndHJlZS1y/ZWFsaXN0aWMtM2Qt/cG9rZWJhbGwtbW9k/ZXJuLWNvbmNlcHQt/c2lnbi12ZWN0b3It/cG5nLWltYWdlXzM5/MjI3ODc0LnBuZw'
    });

    console.log(characterState);

    renderPokemonBasicInfo();
}

/* ==========================================================================
   MODAL AND UI CONTROL
   ========================================================================== */

function openPokemon(pokeArray = null) {
    if (pokeArray) characterState.capturedPokemon = pokeArray;

    renderPokemonBasicInfo();
    pokemonModal?.classList.remove('hidden');
}

function closePokemon() {
    pokemonModal?.classList.add('hidden');
}

function openEditPokemon() {
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

document.getElementById('add-xp')?.addEventListener('click', () => {
    addXP();
});

pokeLevelUpVelocity?.addEventListener('change', () => {
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
    if (!pokeLevelUpVelocity) return 5;
    const velocity = pokeLevelUpVelocity.value.toLowerCase();
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
    if (!totalXPInput) return;
    const currentXP = totalXPInput.value;
    const level = calculateLevel(currentXP);

    if (currentLvlDisplay) {
        currentLvlDisplay.textContent = level;
    }
}

function addXP() {
    if (!totalXPInput || !xpToAddInput) {
        return;
    }

    const currentTotal = parseInt(totalXPInput.value, 10) || 0;
    const addedXP = parseInt(xpToAddInput.value, 10) || 0;

    totalXPInput.value = currentTotal + addedXP;
    xpToAddInput.value = '';

    updateLevel();
}