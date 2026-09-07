import { characterState } from "../player/player-state.js";
import { calculateLevel, getMaxHp } from "./pokemon-rules.js";
import { checkPokemons, updateLifeBar, handlePokemonSelect, maxPartySize } from "./pokemon-management.js";
import { toggleEffectInput } from "./pokemon-modals.js";

/* ==========================================================================
   CAPTURED POKEMON MANAGEMENT
   ========================================================================== */

const teamPokemonElement = document.getElementById('pokemon-grid');
const teamSizeElement = document.getElementById('team-size');
const capturedPokemonElement = document.getElementById('captured-pokemon-list');
const pokemonLocationSelect = document.getElementById('pokemon-location-change');
const pokemonAttacksElement = document.getElementById('attacks-grid');

export function renderPokemonParty() {
    const partyEl = teamPokemonElement || document.getElementById('pokemon-grid');
    if (!partyEl) {
        return;
    }

    partyEl.innerHTML = '';

    const { team } = checkPokemons();

    let totalPokemons = 0;

    for (const pokemonInfo of team) {
        const pokemonSlot = document.createElement('button');
        pokemonSlot.classList = 'pokemon-slot active-slot';

        totalPokemons++;

        let { level } = calculateLevel(pokemonInfo.xp, pokemonInfo.levelSpeed);

        pokemonSlot.innerHTML = `
            <div class="detail-box avatar-box"><img class="flex-grow" src="${pokemonInfo.imgUrl}" alt="${pokemonInfo.species}"></div>
            <div class="column pokemon-info">
                <div class="static-row align-between">
                    <h5>${pokemonInfo.species}</h5>
                    <span>LVL ${level}</span>
                </div>
                <div class="health-bar-container">
                    <div class="health-bar-fill" style="width: ${updateLifeBar(pokemonInfo)}"></div>
                </div>
                <div class="static-row align-between tiny-text">
                    <span>HP ${pokemonInfo.hp} / ${getMaxHp(pokemonInfo)}</span>
                    <span>Happiness ${pokemonInfo.happiness}/10</span>
                </div>
            </div>
        `;

        pokemonSlot.addEventListener('click', () => {
            handlePokemonSelect(pokemonInfo);
        });

        partyEl.appendChild(pokemonSlot);
    }

    const partyLimit = maxPartySize || 6;
    let emptySlotsNeeded = partyLimit - totalPokemons;

    for (let i = 0; i < emptySlotsNeeded; i++) {
        const emptySlot = document.createElement('button');
        emptySlot.textContent = '(+) Empty';
        emptySlot.classList = 'pokemon-slot empty-slot';

        partyEl.appendChild(emptySlot);
    }

    const sizeEl = teamSizeElement || document.getElementById('team-size');
    if (sizeEl) {
        sizeEl.textContent = totalPokemons + " / 6";
    }
}

export function renderCapturedPokemons() {
    const listEl = capturedPokemonElement || document.getElementById('captured-pokemon-list');
    if (!listEl) {
        return;
    }

    listEl.innerHTML = '';

    let isParty = false;

    const { team, box } = checkPokemons();

    const locSelect = pokemonLocationSelect || document.getElementById('pokemon-location-change');
    if (locSelect && locSelect.value) {
        isParty = locSelect.value.toLowerCase() === "party";
    }

    const pokemonLocation = isParty ? team : box;

    for (const pokemonInfo of pokemonLocation) {
        const pokemonSlot = document.createElement('button');
        pokemonSlot.className = 'captured-item';

        const { level } = calculateLevel(pokemonInfo.xp, pokemonInfo.levelSpeed);

        pokemonSlot.innerHTML = `
        <div class="detail-box avatar-box"><img src="${pokemonInfo.imgUrl}" alt="${pokemonInfo.species}"></div>
            <div class="item-info column">
                <div class="static-row align-between">
                    <span class="poke-item-name">${pokemonInfo.species}</span>
                    <span class="poke-item-lvl">LVL ${level}</span>
                    
                </div>
                <div class="health-bar-container green-bar">
                    <div class="health-bar-fill" style="width: ${updateLifeBar(pokemonInfo)};"></div>
                </div>
                <div class="static-row align-between tiny-text">
                    <span>HP<br> ${pokemonInfo.hp} / ${getMaxHp(pokemonInfo)}</span>
                    <span>HAPPINESS<br> ${pokemonInfo.happiness} / 10</span>
                </div>
            </div>
        `;

        pokemonSlot.addEventListener('click', () => {
            handlePokemonSelect(pokemonInfo);
        });

        listEl.appendChild(pokemonSlot);
    }
}

export function renderPokemonAttacks(pokemon) {
    const attacksEl = pokemonAttacksElement || document.getElementById('attacks-grid');
    if (!attacksEl || !pokemon || !pokemon.attacks) {
        return;
    }

    attacksEl.innerHTML = '';

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
            </div>

            <div class="static-row">
                <div class="column">
                    <h6>PWR</h6>
                    <input id="attack-power-${index}" type="text" class="inventory-item-input text-center">
                </div>
                <div class="column">
                    <h6>ACC</h6>
                    <input id="attack-acc-points-${index}" type="text" class="inventory-item-input text-center">
                </div>
                <div class="column">
                    <h6>PP</h6>
                    <input id="attack-pp-points-${index}" type="text" class="inventory-item-input text-center">
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
            <div class="static-row">
                <input id="attack-have-effect-${index}" type="checkbox" class="custom-checkbox" onchange="toggleEffectInput(this)">
                <input id="attack-effect-${index}" type="text" class="inventory-item-input">
            </div>
        `;

        attacksEl.appendChild(attackSlot);
    }
}

export function renderAllPokemon() {
    renderPokemonParty();
    renderCapturedPokemons();
}

window.renderPokemonParty = renderPokemonParty;
window.renderCapturedPokemons = renderCapturedPokemons;
window.renderPokemonAttacks = renderPokemonAttacks;
window.renderAllPokemon = renderAllPokemon;