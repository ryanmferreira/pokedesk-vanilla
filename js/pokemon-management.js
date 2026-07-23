/* ==========================================================================
   STATES AND GLOBAL SELECTORS
   ========================================================================== */
const capturedPokemonElement = document.getElementById('captured-pokemon-list');
const pokemonAttacksElement = document.getElementById('attacks-grid');
const teamPokemonElement = document.getElementById('pokemon-grid');

const pokemonLocationSelect = document.getElementById('pokemon-location-change');

const teamSizeElement = document.getElementById('team-size');
const addToTeamButton = document.getElementById('add-selected-pokemon');

// ===== Pokémon Attributtes =====
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

// ===== Selected Pokemon Info =====
const selectedNameDetails = document.getElementById('manage-pokemon-name');
const selectedImgDetails = document.getElementById('detail-img');

const selectedXpBarDetails = document.getElementById('detail-exp-bar');
const selectedLvlDetails = document.getElementById('detail-lvl-num');
const selectedXpDetails = document.getElementById('detail-exp-num');

const selectedHappinessDetails = document.getElementById('detail-happy-text');

const selectedHealthDetails = document.getElementById('detail-hp-text');
const selectedHealthBarDetails = document.getElementById('detail-life-bar');

// ===== Modal =====
const pokemonModal = document.getElementById('pokemon-management-modal');
const editPokemonModal = document.getElementById('edit-pokemon-modal');
const addImageModal = document.getElementById('add-image-modal');

/* ==========================================================================
   CAPTURED POKEMON MANAGEMENT
   ========================================================================== */
function renderPokemonTeam() {
    if (!teamPokemonElement) {
        return;
    }

    teamPokemonElement.innerHTML = '';
    let totalPokemons = 0;

    for (const pokemonInfo of characterState.team) {
        const pokemonSlot = document.createElement('button');
        pokemonSlot.classList = 'pokemon-slot active-slot';

        totalPokemons++;

        pokemonSlot.innerHTML = `
            <div class="detail-box avatar-box"><img src="${pokemonInfo.imgUrl}" alt="${pokemonInfo.species}"></div>
            <div class="column pokemon-info">
                <div class="static-row align-between">
                    <h5>${pokemonInfo.species}</h5>
                    <span>LVL ${calculateLevel(pokemonInfo.xp, pokemonInfo.levelSpeed)}</span>
                </div>
                <div class="health-bar-container">
                    <div class="health-bar-fill" style="width: ${updateLifeBar(pokemonInfo)}"></div>
                </div>
                <div class="static-row align-between tiny-text">
                    <span>HP ${pokemonInfo.hp} / ${pokemonInfo.status.hp}</span>
                    <span>Happiness ${pokemonInfo.happiness}/10</span>
                </div>
            </div>
        `;

        pokemonSlot.addEventListener('click', () => {
            handlePokemonSelect(pokemonInfo);
        });

        teamPokemonElement.appendChild(pokemonSlot);
    }

    let emptySlotsNeeded = 6 - totalPokemons;

    for (let i = 0; i < emptySlotsNeeded; i++) {
        const emptySlot = document.createElement('button');
        emptySlot.textContent = '(+) Empty';
        emptySlot.classList = 'pokemon-slot empty-slot';

        teamPokemonElement.appendChild(emptySlot);
    }

    if (teamSizeElement) {
        teamSizeElement.textContent = totalPokemons + "/6";
    }
}

function renderCapturedPokemons() {
    if (!capturedPokemonElement) {
        return;
    }

    capturedPokemonElement.innerHTML = '';

    let isParty = false;
    if (pokemonLocationSelect && pokemonLocationSelect.value) {
        isParty = pokemonLocationSelect.value.toLowerCase() === "party";
    }

    const pokemonLocation = isParty ? characterState.team : characterState.capturedPokemon;

    for (const pokemonInfo of pokemonLocation) {
        const pokemonSlot = document.createElement('button');
        pokemonSlot.className = 'captured-item';

        pokemonSlot.innerHTML = `
        <div class="detail-box avatar-box"><img src="${pokemonInfo.imgUrl}" alt="${pokemonInfo.species}"></div>
            <div class="item-info column">
                <div class="static-row align-between">
                    <span class="poke-item-name">${pokemonInfo.species}</span>
                    <span class="poke-item-lvl">LVL ${calculateLevel(pokemonInfo.xp, pokemonInfo.levelSpeed)}</span>
                    
                </div>
                <div class="health-bar-container green-bar">
                    <div class="health-bar-fill" style="width: ${updateLifeBar(pokemonInfo)};"></div>
                </div>
                <div class="static-row align-between tiny-text">
                    <span>HP<br> ${pokemonInfo.hp} / ${pokemonInfo.status.hp}</span>
                    <span>HAPPINESS<br> ${pokemonInfo.happiness} / 10</span>
                </div>
            </div>
        `;

        pokemonSlot.addEventListener('click', (event) => {
            handlePokemonSelect(pokemonInfo);
        });

        capturedPokemonElement.appendChild(pokemonSlot);
    }
}

function renderPokemonAttacks(pokemon) {
    if (!pokemonAttacksElement) {
        return
    };

    pokemonAttacksElement.innerHTML = '';

    for (const attack of pokemon.attacks) {
        const attackSlot = document.createElement('div');
        attackSlot.className = 'attack-card';

        var index = pokemon.attacks.indexOf(attack);

        attackSlot.innerHTML = `
            <div class="static-row">
                <div class="column flex-grow">
                    <h6>ATTACK</h6>
                    <input id="attack-name-${index}" type="text" class="inventory-item-input">
                </div>
                <div class="column" style="width: 40px;">
                    <h6>PWR</h6>
                    <input id="attack-power-${index}" type="text" class="inventory-item-input text-center">
                </div>
                <div class="column" style="width: 40px;">
                    <h6>PP</h6>
                    <input id="attack-power-points-${index}" type="text" class="inventory-item-input text-center">
                </div>
            </div>

            <div class="column">
                <h6>Attack Type</h6>
                <select id="attack-type-${index}" class="custom-select-red">
                    <option selected disabled value="">Select Type...</option>
                </select>
            </div>

            <hr class="red-text">

            <h6>HAVE EFFECT?</h6>
            <div class="static-row align-center">
                <input id="attack-have-effect-${index}" type="checkbox" class="custom-checkbox" onchange="toggleEffectInput(this)">
                <input id="attack-effect-${index}" type="text" class="inventory-item-input">
            </div>
        `;

        pokemonAttacksElement.appendChild(attackSlot);
    }
}

function debugPokemon() {
    console.log(characterState.capturedPokemon.attacks)
}

function updateLifeBar(pokemon) {
    const maxHp = pokemon?.status?.hp || 1;
    const currentHp = pokemon?.hp || 0;
    const percentage = Math.max(0, Math.min(100, Math.round((currentHp / maxHp) * 100)));

    return `${percentage}%`;
}

function updateXpBar(pokemon) {
    var currentXp = pokemon.xp || 0;
    var currentVel = pokemon.levelSpeed || 'fast';
    var currentLevel = calculateLevel(currentXp, currentVel);

    var baseXp = getXpQuantity(5, currentVel);

    var xpCurrentLevel = getXpQuantity(currentLevel, currentVel) - baseXp;
    var xpNextLevel = getXpQuantity(currentLevel + 1, currentVel) - baseXp;

    var xpInCurrentLevel = currentXp - xpCurrentLevel;
    var xpSpanForNextLevel = xpNextLevel - xpCurrentLevel;

    if (xpSpanForNextLevel <= 0) return '100.00%';

    var percentage = (xpInCurrentLevel / xpSpanForNextLevel) * 100;
    var clampedPercentage = Math.max(0, Math.min(100, percentage));

    return `${clampedPercentage.toFixed(2)}%`;
}

function handlePokemonSelect(pokemon) {
    console.log(pokemon);

    showSelectedPokemon();
    renderPokemonAttacks(pokemon);

    currentPokemon = pokemon;

    const allSlots = capturedPokemonElement.querySelectorAll('.captured-item');
    allSlots.forEach(slot => slot.classList.remove('selected'));

    event.currentTarget.classList.add('selected');

    selectedXpDetails.textContent = currentPokemon.xp;
    selectedLvlDetails.textContent = calculateLevel(currentPokemon.xp, currentPokemon.levelSpeed);

    selectedHappinessDetails.textContent = currentPokemon.happiness;
    selectedHealthDetails.textContent = `${currentPokemon.hp} / ${currentPokemon.status?.hp || '?'}`;
    selectedNameDetails.textContent = currentPokemon === null ? "No Pokémon Selected" : currentPokemon.species;

    selectedImgDetails.innerHTML = `<img src="${currentPokemon.imgUrl}" alt="${currentPokemon.species}">`;

    selectedHealthBarDetails.style.width = updateLifeBar(currentPokemon);
    selectedXpBarDetails.style.width = updateXpBar(currentPokemon);

    loadAttackType();

    updateTeamButton();
}

function handlePokemonEdit() {
    console.log("Editing: ", currentPokemon.species);
    openEditPokemon();
}

function handlePokemonDelete() {
    console.log("Deleting: ", currentPokemon.species);

    const index = characterState.capturedPokemon.indexOf(currentPokemon);
    characterState.capturedPokemon.splice(index, 1);


    renderCapturedPokemons();
    clearSelection();
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
        species: 'Pokémon Name',
        gender: '',
        type1: '',
        type2: '',
        levelSpeed: 'fast',
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
            { name: 'Attack name', type: '', pp: 0, pwr: 0, haveEffect: false, effect: 'Regular Damage' },
            { name: 'Attack name', type: '', pp: 0, pwr: 0, haveEffect: false, effect: 'Regular Damage' },
            { name: 'Attack name', type: '', pp: 0, pwr: 0, haveEffect: false, effect: 'Regular Damage' },
            { name: 'Attack name', type: '', pp: 0, pwr: 0, haveEffect: false, effect: 'Regular Damage' },
        ],
        imgUrl: 'https://raw.githubusercontent.com/ryanmferreira/pokedesk-vanilla/refs/heads/main/assets/icons/pokeball.svg'
    });

    console.log(characterState);

    renderCapturedPokemons();
    clearSelection();
}

function isPokemonInTeam() {
    const indexInTeam = characterState.team.indexOf(currentPokemon);
    const indexInBox = characterState.capturedPokemon.indexOf(currentPokemon);

    return {
        inTeam: indexInTeam !== -1,
        teamIndex: indexInTeam,
        boxIndex: indexInBox
    };
}

function moveToTeam() {
    if (!currentPokemon) {
        return;
    }

    const { inTeam, teamIndex, boxIndex } = isPokemonInTeam();

    if (inTeam) {
        const pokemonToMove = characterState.team.splice(teamIndex, 1)[0];
        characterState.capturedPokemon.push(pokemonToMove);
    } else {
        if (characterState.team.length >= 6) {
            alert("Team already full!");
            return;
        }

        const pokemonToMove = characterState.capturedPokemon.splice(boxIndex, 1)[0];
        characterState.team.push(pokemonToMove);
    }

    updateTeamButton();
    renderPokemonTeam();
    renderCapturedPokemons();

    clearSelection();
}

function updateTeamButton() {
    const { inTeam } = isPokemonInTeam();

    if (inTeam) {
        addToTeamButton.textContent = "Send to PC";
    } else {
        addToTeamButton.textContent = "Move to Party";
    }
}

function getAttackElements(index) {
    return {
        name: document.getElementById(`attack-name-${index}`),
        pwr: document.getElementById(`attack-power-${index}`),
        pp: document.getElementById(`attack-power-points-${index}`),
        haveEffect: document.getElementById(`attack-have-effect-${index}`),
        effect: document.getElementById(`attack-effect-${index}`),
        type: document.getElementById(`attack-type-${index}`)
    };
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
    currentPokemon.level = calculateLevel(currentPokemon.xp, currentPokemon.levelSpeed);
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

    if (currentPokemon.attacks) {
        for (const attack of currentPokemon.attacks) {
            var index = currentPokemon.attacks.indexOf(attack);
            const els = getAttackElements(index);

            if (els.name) attack.name = els.name.value;
            if (els.pwr) attack.pwr = parseInt(els.pwr.value, 10);
            if (els.pp) attack.pp = parseInt(els.pp.value, 10);
            if (els.effect) attack.effect = els.effect.value;
            if (els.type) attack.type = els.type.value;
            if (els.haveEffect) attack.haveEffect = els.haveEffect.checked;
        }
    }

    handlePokemonSelect(currentPokemon);

    renderCapturedPokemons();
    renderPokemonTeam();

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

    renderCapturedPokemons();
    pokemonModal?.classList.remove('hidden');
}

function closePokemon() {
    pokemonModal?.classList.add('hidden');
    clearSelection();
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

    if (currentPokemon.attacks) {
        for (const attack of currentPokemon.attacks) {
            var index = currentPokemon.attacks.indexOf(attack);
            const els = getAttackElements(index);

            if (els.name) els.name.value = attack.name || '';
            if (els.pwr) els.pwr.value = attack.pwr ?? 0;
            if (els.pp) els.pp.value = attack.pp ?? 0;
            if (els.effect) els.effect.value = attack.effect || '';
            if (els.type) els.type.value = attack.type || '';
            if (els.haveEffect) els.haveEffect.checked = Boolean(attack.haveEffect);
        }
    }

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
    moveToTeam();
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

pokemonLocationSelect?.addEventListener('change', () => {
    renderPokemonTeam();
    renderCapturedPokemons();
    clearSelection();
});

function clearSelection() {
    selectedNameDetails.textContent = "No Pokémon Selected";
    currentPokemon = null;
    hiddenSelectedPokemon();
}

pokeLevelVelocity?.addEventListener('change', () => {
    updateLevel();
});

/* ==========================================================================
   LEVEL & XP RULES
   ========================================================================== */
function getXpQuantity(level, velocity) {
    var levelSpeed = velocity.toLowerCase();

    switch (levelSpeed) {
        case "fast": return 0.8 * level * level;
        case "medium": return 1.0 * level * level;
        case "slow": return 1.25 * level * level;
        case "pseudo-legendary": return 1.5 * level * level;
        case "legendary": return 2.0 * level * level;
        default: return 1.0 * level * level;
    }
}

function calculateLevel(xpTotal, velocityParam = null) {
    var velocity = (velocityParam || pokeLevelVelocity?.value || 'fast').toLowerCase();
    var xpInput = parseInt(xpTotal, 10) || 0;

    var baseXp = getXpQuantity(5, velocity);
    var totalXp = baseXp + xpInput;

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
    if (!totalXP) {
        return;
    }

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