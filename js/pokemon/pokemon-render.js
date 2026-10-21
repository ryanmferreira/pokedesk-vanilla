import { renderTypeBadges } from "./pokemon-info.js";
import { checkPokemons, handlePokemonEdit, handlePokemonSelect, maxPartySize, updateLifeBar, updateXpBar } from "./pokemon-management.js";
import { calculateLevel, getMaxHp } from "./pokemon-rules.js";

/* ==========================================================================
   CAPTURED POKEMON MANAGEMENT
   ========================================================================== */

const teamPokemonElement = document.getElementById('pokemon-grid');
const teamSizeElement = document.getElementById('team-size');
const capturedPokemonElement = document.getElementById('captured-pokemon-list');
const pokemonLocationSelect = document.getElementById('pokemon-location-change');
const pokemonAttacksElement = document.getElementById('attacks-grid');

/* ==========================================================================
   POKEMON PARTY
   ========================================================================== */

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
        pokemonSlot.type = 'button';
        pokemonSlot.className = 'pokemon-slot active-slot';

        totalPokemons++;

        const { level } = calculateLevel(pokemonInfo.xp, pokemonInfo.levelSpeed);

        pokemonSlot.innerHTML = `
            <div class="detail-box avatar-box">
                <img class="flex-grow" src="${pokemonInfo.imgUrl || "/assets/icons/pokeball.svg"}" alt="${pokemonInfo.species}">
            </div>

            <div class="column pokemon-info">
                <div class="static-row align-between pokemon-info__title">
                    <h5>${pokemonInfo.species}</h5>
                    <span class="pokemon-info__level">LVL ${level}</span>
                </div>

                ${statBar("HP", `${pokemonInfo.hp ?? 0} / ${getMaxHp(pokemonInfo)}`, "hp", updateLifeBar(pokemonInfo))}
            </div>
        `;

        pokemonSlot.addEventListener('click', () => {
            openPokemonInfoModal(pokemonInfo);
        });

        partyEl.appendChild(pokemonSlot);
    }

    /* ---------------------------------------------------------------------
       EMPTY PARTY SLOTS
       --------------------------------------------------------------------- */

    const partyLimit = maxPartySize || 6;
    const emptySlotsNeeded = Math.max(0, partyLimit - totalPokemons);

    for (let i = 0; i < emptySlotsNeeded; i++) {
        const emptySlot = document.createElement('button');
        emptySlot.type = 'button';
        emptySlot.className = 'pokemon-slot empty-slot';
        emptySlot.textContent = '(+) Empty';
        partyEl.appendChild(emptySlot);
    }

    /* ---------------------------------------------------------------------
       PARTY SIZE
       --------------------------------------------------------------------- */

    const sizeEl = teamSizeElement || document.getElementById('team-size');
    if (sizeEl) {
        sizeEl.textContent = `${totalPokemons} / ${partyLimit}`;
    }
}

/* ==========================================================================
   SHARED POKEMON DETAILS
   ========================================================================== */

function detailTile(label, value, wrap = false) {
    return `
        <div class="detail-box">
            <span class="panel-label">${label}</span>
            <span class="panel-value${wrap ? " panel-value--wrap" : ""}">${value}</span>
        </div>
    `;
}

export function statBar(label, value, variant, percentage) {
    return `
        <div class="stat-bar stat-bar--${variant}">
            <div class="stat-bar__head">
                <span class="stat-bar__label">${label}</span>
                <span class="stat-bar__value">${value}</span>
            </div>

            <div class="stat-bar__track">
                <div class="stat-bar__fill" style="width: ${percentage};"></div>
            </div>
        </div>
    `;
}

function renderAttackCard(attack) {
    const typeBadge = attack.type ? renderTypeBadges(attack.type) : "";

    const effect = attack.haveEffect && attack.effect
        ? `<p class="attack-card__effect"><span class="panel-label">EFFECT</span> ${attack.effect}</p>`
        : "";

    return `
        <article class="attack-card">
            <header class="attack-card__head">
                <h4>${attack.name}</h4>
                ${typeBadge}
            </header>

            <div class="attack-card__stats">
                <div class="attack-stat attack-stat--main">
                    <span class="attack-stat__label">POWER</span>
                    <span class="attack-stat__value">${attack.pwr ?? 0}</span>
                </div>

                <div class="attack-stat attack-stat--main">
                    <span class="attack-stat__label">ACC</span>
                    <span class="attack-stat__value">${attack.acc ?? 0}%</span>
                </div>

                <div class="attack-stat attack-stat--muted">
                    <span class="attack-stat__label">PP</span>
                    <span class="attack-stat__value">${attack.pp ?? 0}</span>
                </div>
            </div>

            ${effect}
        </article>
    `;
}

/**
 * Builds the shared "inspect" markup for a Pokémon. Used by both the player
 * (session) and the Game Master modals so they always stay in sync.
 */
export function renderPokemonDetails(pokemon) {
    const { level, currentXpInLevel, costForNextLevel } = calculateLevel(pokemon.xp, pokemon.levelSpeed);

    const maxHp = getMaxHp(pokemon);
    const currentHp = pokemon.hp ?? 0;
    const status = pokemon.status || {};

    const attacks = Array.isArray(pokemon.attacks)
        ? pokemon.attacks.filter(attack => attack && attack.name && attack.name.trim() !== "")
        : [];

    return `
        <div class="inspect-layout">
            <div class="inspect-layout__main">
                <h3 class="section-title">Pokémon Stats</h3>

                <div class="info-hero">
                    <div class="detail-box avatar-box info-hero__image">
                        <img src="${pokemon.imgUrl || "/assets/icons/pokeball.svg"}" alt="${pokemon.species || "Pokémon"}">
                    </div>

                    <div class="tiles info-tiles">
                        ${detailTile("LEVEL", level)}
                        ${detailTile("HAPPINESS", `${pokemon.happiness ?? 0} / 10`)}
                        ${detailTile("NATURE", pokemon.nature || "-", true)}
                        ${detailTile("ABILITY", pokemon.ability || "-", true)}
                        ${detailTile("ITEM", pokemon.item || "-", true)}
                        ${detailTile("POKÉ BALL", pokemon.capturedBy || "-", true)}
                    </div>
                </div>

                <div class="bar-grid">
                    ${statBar("HP", `${currentHp} / ${maxHp}`, "hp", updateLifeBar(pokemon))}
                    ${statBar("XP", `${currentXpInLevel} / ${costForNextLevel}`, "xp", updateXpBar(pokemon))}
                </div>

                <hr>

                <div class="detail-section">
                    <h3 class="section-title">BASE STATS</h3>

                    <table class="base-stats-table">
                        <thead>
                            <tr>
                                <th scope="col">HP</th>
                                <th scope="col">ATK</th>
                                <th scope="col">DEF</th>
                                <th scope="col">SP. ATK</th>
                                <th scope="col">SP. DEF</th>
                                <th scope="col">SPD</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>${status.hp ?? 0}</td>
                                <td>${status.atk ?? 0}</td>
                                <td>${status.def ?? 0}</td>
                                <td>${status.spAtk ?? 0}</td>
                                <td>${status.spDef ?? 0}</td>
                                <td>${status.spd ?? 0}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="inspect-layout__side">
                <div class="detail-section">
                    <div class="section-head">
                        <h3 class="section-title">ATTACKS</h3>
                        <span class="section-count">${attacks.length}</span>
                    </div>

                    <div class="attack-grid">
                        ${attacks.length > 0 ? attacks.map(renderAttackCard).join("") : `<span class="tiny-text">No attacks available.</span>`}
                    </div>
                </div>
            </div>
        </div>
    `;
}

/* ==========================================================================
   POKEMON INFO MODAL
   ========================================================================== */

export function openPokemonInfoModal(pokemonInfo) {
    const modal = document.getElementById('pokemon-info-modal');
    const content = document.getElementById('pokemon-info-content');
    const nameEl = document.getElementById('info-pokemon-name');
    const typesEl = document.getElementById('info-pokemon-types');
    const genderEl = document.getElementById('info-pokemon-gender');
    const trainerEl = document.getElementById('info-pokemon-trainer');

    const editPokemonBtn = document.getElementById('edit-pokemon-btn');

    if (!modal || !content || !nameEl || !typesEl || !pokemonInfo) {
        return;
    }

    /* Rebind on every open so a single listener always targets the
       currently inspected Pokémon. */
    if (editPokemonBtn) {
        editPokemonBtn.onclick = () => {
            closePokemonInfo();
            handlePokemonSelect(pokemonInfo);
            handlePokemonEdit();
        };
    }

    nameEl.textContent = pokemonInfo.species || "Unknown Pokémon";
    typesEl.innerHTML = renderTypeBadges(pokemonInfo.type1, pokemonInfo.type2)
        || '<span class="tiny-text">Unknown Type</span>';

    if (genderEl) {
        genderEl.textContent = pokemonInfo.gender || "-";
    }

    if (trainerEl) {
        const playerName = document.querySelector('.get-player-name')?.textContent?.trim();
        trainerEl.textContent = playerName || "Unknown";
    }

    content.innerHTML = renderPokemonDetails(pokemonInfo);

    modal.classList.remove("hidden");
}

/* ==========================================================================
   CAPTURED POKEMON / BOX
   ========================================================================== */

export function renderCapturedPokemons() {
    const listEl = capturedPokemonElement || document.getElementById('captured-pokemon-list');
    if (!listEl) {
        return;
    }

    listEl.innerHTML = '';

    const { team, box } = checkPokemons();
    const locSelect = pokemonLocationSelect || document.getElementById('pokemon-location-change');
    const location = locSelect?.value?.toLowerCase() || 'box';

    let pokemonLocation = [];

    /* ---------------------------------------------------------------------
       LOCATION
       --------------------------------------------------------------------- */

    switch (location) {
        case 'party':
            pokemonLocation = team;
            break;

        case 'all':
            pokemonLocation = [...team, ...box];
            break;

        case 'box':
        default:
            pokemonLocation = box;
            break;
    }

    /* ---------------------------------------------------------------------
       RENDER POKEMON
       --------------------------------------------------------------------- */

    const countEl = document.getElementById('captured-count');
    if (countEl) {
        countEl.textContent = pokemonLocation.length;
    }

    const totalEl = document.getElementById('pc-total-count');
    const partyEl = document.getElementById('pc-party-count');
    const boxEl = document.getElementById('pc-box-count');

    if (totalEl) {
        totalEl.textContent = team.length + box.length;
    }

    if (partyEl) {
        partyEl.textContent = team.length;
    }

    if (boxEl) {
        boxEl.textContent = box.length;
    }

    if (pokemonLocation.length === 0) {
        listEl.innerHTML = `<span class="empty-state tiny-text">No Pokémon found here.</span>`;
        return;
    }

    for (const pokemonInfo of pokemonLocation) {
        const pokemonSlot = document.createElement('button');
        pokemonSlot.type = 'button';
        pokemonSlot.className = 'captured-item';

        const { level } = calculateLevel(pokemonInfo.xp, pokemonInfo.levelSpeed);

        pokemonSlot.innerHTML = `
            <div class="detail-box avatar-box">
                <img src="${pokemonInfo.imgUrl || '/assets/icons/pokeball.svg'}" alt="${pokemonInfo.species || 'Pokémon'}">
            </div>

            <div class="item-info column">
                <div class="static-row align-between">
                    <span class="poke-item-name">${pokemonInfo.species || 'Unknown'}</span>
                    <span class="poke-item-lvl">LVL ${level}</span>
                </div>

                ${statBar("HP", `${pokemonInfo.hp ?? 0} / ${getMaxHp(pokemonInfo)}`, "hp", updateLifeBar(pokemonInfo))}
            </div>
        `;

        pokemonSlot.addEventListener('click', () => {
            handlePokemonSelect(pokemonInfo);
        });

        listEl.appendChild(pokemonSlot);
    }
}

/* ==========================================================================
   POKEMON ATTACKS - EDIT MODAL
   ========================================================================== */

export function renderPokemonAttacks(pokemon) {
    const attacksEl = pokemonAttacksElement || document.getElementById('attacks-grid');
    if (!attacksEl || !pokemon || !pokemon.attacks) return;

    attacksEl.innerHTML = '';

    for (const attack of pokemon.attacks) {
        const attackSlot = document.createElement('div');
        attackSlot.className = 'attack-card';

        const index = pokemon.attacks.indexOf(attack);

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

/* ==========================================================================
   RENDER ALL
   ========================================================================== */

export function renderAllPokemon() {
    renderPokemonParty();
    renderCapturedPokemons();
}

/* ==========================================================================
   POKEMON INFO MODAL CONTROLS
   ========================================================================== */

const pokemonInfoModal = document.getElementById('pokemon-info-modal');
const closePokemonInfoModal = document.getElementById('close-pokemon-info-modal');

/* -------------------------------------------------------------------------
   CLOSE FUNCTION
   ------------------------------------------------------------------------- */

function closePokemonInfo() {
    pokemonInfoModal?.classList.add('hidden');
}

/* -------------------------------------------------------------------------
   CLOSE BUTTON
   ------------------------------------------------------------------------- */

closePokemonInfoModal?.addEventListener('click', closePokemonInfo);

/* -------------------------------------------------------------------------
   CLOSE WHEN CLICKING OVERLAY
   ------------------------------------------------------------------------- */

pokemonInfoModal?.addEventListener('click', event => {
    if (event.target === pokemonInfoModal) {
        closePokemonInfo();
    }
});

/* -------------------------------------------------------------------------
   CLOSE WITH ESCAPE
   ------------------------------------------------------------------------- */

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        closePokemonInfo();
    }
});

/* ==========================================================================
   WINDOW EXPORTS
   ========================================================================== */

window.renderPokemonParty = renderPokemonParty;
window.renderCapturedPokemons = renderCapturedPokemons;
window.renderPokemonAttacks = renderPokemonAttacks;
window.renderAllPokemon = renderAllPokemon;