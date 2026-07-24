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

    let emptySlotsNeeded = maxPartySize - totalPokemons;

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
