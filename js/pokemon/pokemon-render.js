import { characterState } from "../player/player-state.js";
import { calculateLevel, getMaxHp } from "./pokemon-rules.js";
import {
    checkPokemons,
    updateLifeBar,
    handlePokemonSelect,
    maxPartySize
} from "./pokemon-management.js";
import { toggleEffectInput } from "./pokemon-modals.js";


/* ==========================================================================
   CAPTURED POKEMON MANAGEMENT
   ========================================================================== */

const teamPokemonElement =
    document.getElementById('pokemon-grid');

const teamSizeElement =
    document.getElementById('team-size');

const capturedPokemonElement =
    document.getElementById('captured-pokemon-list');

const pokemonLocationSelect =
    document.getElementById('pokemon-location-change');

const pokemonAttacksElement =
    document.getElementById('attacks-grid');


/* ==========================================================================
   POKEMON PARTY
   ========================================================================== */

export function renderPokemonParty() {

    const partyEl =
        teamPokemonElement ||
        document.getElementById('pokemon-grid');

    if (!partyEl) {
        return;
    }

    partyEl.innerHTML = '';

    const { team } = checkPokemons();

    let totalPokemons = 0;

    for (const pokemonInfo of team) {

        const pokemonSlot =
            document.createElement('button');

        pokemonSlot.type = 'button';
        pokemonSlot.className =
            'pokemon-slot active-slot';

        totalPokemons++;

        const { level } = calculateLevel(
            pokemonInfo.xp,
            pokemonInfo.levelSpeed
        );

        pokemonSlot.innerHTML = `

            <div class="detail-box avatar-box">

                <img
                    class="flex-grow"
                    src="${pokemonInfo.imgUrl}"
                    alt="${pokemonInfo.species}"
                >

            </div>

            <div class="column pokemon-info">

                <div class="static-row align-between">

                    <h5>
                        ${pokemonInfo.species}
                    </h5>

                    <span>
                        LVL ${level}
                    </span>

                </div>

                <div class="health-bar-container">

                    <div
                        class="health-bar-fill"
                        style="width: ${updateLifeBar(pokemonInfo)};"
                    ></div>

                </div>

                <div class="static-row align-between tiny-text">

                    <span>
                        HP ${pokemonInfo.hp} / ${getMaxHp(pokemonInfo)}
                    </span>

                    <span>
                        Happiness ${pokemonInfo.happiness}/10
                    </span>

                </div>

            </div>
        `;

        /*
         * Abre o modal de informações ao clicar
         */
        pokemonSlot.addEventListener('click', () => {
            openPokemonInfoModal(pokemonInfo);
        });

        partyEl.appendChild(pokemonSlot);
    }


    /* ----------------------------------------------------------------------
       EMPTY PARTY SLOTS
       ---------------------------------------------------------------------- */

    const partyLimit =
        maxPartySize || 6;

    const emptySlotsNeeded =
        Math.max(
            0,
            partyLimit - totalPokemons
        );

    for (let i = 0; i < emptySlotsNeeded; i++) {

        const emptySlot =
            document.createElement('button');

        emptySlot.type = 'button';

        emptySlot.className =
            'pokemon-slot empty-slot';

        emptySlot.textContent =
            '(+) Empty';

        partyEl.appendChild(emptySlot);
    }


    /* ----------------------------------------------------------------------
       PARTY SIZE
       ---------------------------------------------------------------------- */

    const sizeEl =
        teamSizeElement ||
        document.getElementById('team-size');

    if (sizeEl) {

        sizeEl.textContent =
            `${totalPokemons} / ${partyLimit}`;
    }
}


/* ==========================================================================
   POKEMON INFO MODAL
   ========================================================================== */

/* ==========================================================================
   POKEMON INFO MODAL
   ========================================================================== */

export function openPokemonInfoModal(pokemonInfo) {

    const modal =
        document.getElementById(
            'pokemon-info-modal'
        );

    const content =
        document.getElementById(
            'pokemon-info-content'
        );

    const nameEl =
        document.getElementById(
            'info-pokemon-name'
        );

    const typesEl =
        document.getElementById(
            'info-pokemon-types'
        );


    if (
        !modal ||
        !content ||
        !nameEl ||
        !typesEl ||
        !pokemonInfo
    ) {
        return;
    }


    /* ----------------------------------------------------------------------
       BASIC INFORMATION
       ---------------------------------------------------------------------- */

    const {
        level
    } = calculateLevel(
        pokemonInfo.xp,
        pokemonInfo.levelSpeed
    );


    const maxHp =
        getMaxHp(pokemonInfo);


    const currentHp =
        pokemonInfo.hp ?? 0;


    const status =
        pokemonInfo.status || {};


    const types = [
        pokemonInfo.type1,
        pokemonInfo.type2
    ]
        .filter(type =>
            type &&
            type !== "None"
        )
        .join(" / ");


    const attacks =
        Array.isArray(pokemonInfo.attacks)
            ? pokemonInfo.attacks.filter(attack =>
                attack &&
                attack.name &&
                attack.name.trim() !== ""
            )
            : [];


    /* ----------------------------------------------------------------------
       HEADER
       ---------------------------------------------------------------------- */

    nameEl.textContent =
        pokemonInfo.species ||
        "Unknown Pokémon";


    typesEl.textContent =
        types ||
        "Unknown Type";


    /* ----------------------------------------------------------------------
       CONTENT
       ---------------------------------------------------------------------- */

    content.innerHTML = `

        <!-- ================================================================
             POKEMON SUMMARY
             ================================================================ -->

        <div class="gm-pokemon-summary">


            <!-- IMAGE -->

            <div class="detail-box avatar-box gm-pokemon-image">

                <img
                    src="${pokemonInfo.imgUrl || "/assets/icons/pokeball.svg"}"
                    alt="${pokemonInfo.species || "Pokémon"}">

            </div>


            <!-- BASIC INFORMATION -->

            <div class="gm-pokemon-information">


                <div class="correct-size">


                    <!-- LEVEL -->

                    <div class="detail-box stat-box column">

                        <span class="panel-label">
                            LEVEL
                        </span>

                        <span class="panel-value">
                            ${level}
                        </span>

                    </div>


                    <!-- XP -->

                    <div class="detail-box stat-box column">

                        <span class="panel-label">
                            XP
                        </span>

                        <span class="panel-value">
                            ${pokemonInfo.xp ?? 0}
                        </span>

                    </div>


                    <!-- LEVEL SPEED -->

                    <div class="detail-box stat-box column">

                        <span class="panel-label">
                            LEVEL SPEED
                        </span>

                        <span class="panel-value">
                            ${pokemonInfo.levelSpeed || "-"}
                        </span>

                    </div>


                </div>


                <div class="correct-size">


                    <!-- HP -->

                    <div class="detail-box stat-box column">

                        <span class="panel-label">
                            HP
                        </span>

                        <span class="panel-value">
                            ${currentHp} / ${maxHp}
                        </span>

                    </div>


                    <!-- HAPPINESS -->

                    <div class="detail-box stat-box column">

                        <span class="panel-label">
                            HAPPINESS
                        </span>

                        <span class="panel-value">
                            ${pokemonInfo.happiness ?? 0} / 10
                        </span>

                    </div>


                    <!-- GENDER -->

                    <div class="detail-box stat-box column">

                        <span class="panel-label">
                            GENDER
                        </span>

                        <span class="panel-value">
                            ${pokemonInfo.gender || "-"}
                        </span>

                    </div>


                </div>


            </div>

        </div>


        <!-- ================================================================
             HP BAR
             ================================================================ -->

        <div class="column">


            <div class="static-row align-between">

                <span class="panel-label">
                    HP
                </span>

                <span class="tiny-text">
                    ${currentHp} / ${maxHp}
                </span>

            </div>


            <div class="health-bar-container green-bar">

                <div
                    class="health-bar-fill"
                    style="width: ${updateLifeBar(pokemonInfo)};">
                </div>

            </div>


        </div>


        <!-- ================================================================
             DETAILS
             ================================================================ -->

        <div class="gm-pokemon-details">


            <!-- NATURE -->

            <div class="detail-box column">

                <span class="panel-label">
                    NATURE
                </span>

                <span class="panel-value">
                    ${pokemonInfo.nature || "-"}
                </span>

            </div>


            <!-- ABILITY -->

            <div class="detail-box column">

                <span class="panel-label">
                    ABILITY
                </span>

                <span class="panel-value">
                    ${pokemonInfo.ability || "-"}
                </span>

            </div>


            <!-- ITEM -->

            <div class="detail-box column">

                <span class="panel-label">
                    EQUIPPED ITEM
                </span>

                <span class="panel-value">
                    ${pokemonInfo.item || "-"}
                </span>

            </div>


            <!-- CAPTURED BY -->

            <div class="detail-box column">

                <span class="panel-label">
                    CAPTURED BY
                </span>

                <span class="panel-value">
                    ${pokemonInfo.capturedBy || "-"}
                </span>

            </div>


        </div>


        <!-- ================================================================
             STATUS
             ================================================================ -->

        <div class="column">


            <h3 class="section-title">
                STATUS
            </h3>


            <div class="status-table">


                <div class="status-table-header">

                    <span>
                        HP
                    </span>

                    <span>
                        ATK
                    </span>

                    <span>
                        DEF
                    </span>

                    <span>
                        SP. ATK
                    </span>

                    <span>
                        SP. DEF
                    </span>

                    <span>
                        SPD
                    </span>

                </div>


                <div class="status-table-body gm-status-values">

                    <span>
                        ${status.hp ?? 0}
                    </span>

                    <span>
                        ${status.atk ?? 0}
                    </span>

                    <span>
                        ${status.def ?? 0}
                    </span>

                    <span>
                        ${status.spAtk ?? 0}
                    </span>

                    <span>
                        ${status.spDef ?? 0}
                    </span>

                    <span>
                        ${status.spd ?? 0}
                    </span>

                </div>


            </div>


        </div>


        <!-- ================================================================
             ATTACKS
             ================================================================ -->

        <div class="column">


            <div class="static-row align-between">

                <h3 class="section-title">
                    ATTACKS
                </h3>

                <span class="tiny-text">
                    ${attacks.length}
                </span>

            </div>


            <div class="gm-attacks-grid">


                ${attacks.length > 0

            ? attacks.map(attack => `

                            <div class="attack-card">


                                <div class="static-row align-between">

                                    <div class="column">

                                        <h3>
                                            ${attack.name}
                                        </h3>

                                        <span class="tiny-text">
                                            ${attack.type || "-"}
                                        </span>

                                    </div>


                                    <div class="column align-center">

                                        <span class="panel-label">
                                            POWER
                                        </span>

                                        <span class="panel-value">
                                            ${attack.pwr ?? 0}
                                        </span>

                                    </div>

                                </div>


                                <div class="correct-size">


                                    <div class="detail-box stat-box column">

                                        <span class="panel-label">
                                            ACC
                                        </span>

                                        <span class="panel-value">
                                            ${attack.acc ?? 0}%
                                        </span>

                                    </div>


                                    <div class="detail-box stat-box column">

                                        <span class="panel-label">
                                            PP
                                        </span>

                                        <span class="panel-value">
                                            ${attack.pp ?? 0}
                                        </span>

                                    </div>


                                </div>


                                ${attack.haveEffect &&
                    attack.effect

                    ? `

                                            <div class="column">

                                                <span class="panel-label">
                                                    EFFECT
                                                </span>

                                                <span class="tiny-text">
                                                    ${attack.effect}
                                                </span>

                                            </div>

                                          `

                    : ""
                }


                            </div>

                        `).join("")

            : `

                            <span class="tiny-text">
                                No attacks available.
                            </span>

                          `
        }


            </div>


        </div>

    `;


    modal.classList.remove(
        "hidden"
    );
}

/* ==========================================================================
   CAPTURED POKEMON / BOX
   ========================================================================== */

export function renderCapturedPokemons() {

    const listEl =
        capturedPokemonElement ||
        document.getElementById(
            'captured-pokemon-list'
        );

    if (!listEl) {
        return;
    }

    listEl.innerHTML = '';


    const { team, box } =
        checkPokemons();


    const locSelect =
        pokemonLocationSelect ||
        document.getElementById(
            'pokemon-location-change'
        );


    const location =
        locSelect?.value?.toLowerCase() ||
        'box';


    let pokemonLocation = [];


    /* ----------------------------------------------------------------------
       LOCATION
       ---------------------------------------------------------------------- */

    switch (location) {

        case 'party':

            pokemonLocation = team;

            break;


        case 'all':

            pokemonLocation = [
                ...team,
                ...box
            ];

            break;


        case 'box':

        default:

            pokemonLocation = box;

            break;
    }


    /* ----------------------------------------------------------------------
       RENDER POKEMON
       ---------------------------------------------------------------------- */

    for (const pokemonInfo of pokemonLocation) {

        const pokemonSlot =
            document.createElement('button');

        pokemonSlot.type = 'button';

        pokemonSlot.className =
            'captured-item';


        const { level } =
            calculateLevel(
                pokemonInfo.xp,
                pokemonInfo.levelSpeed
            );


        pokemonSlot.innerHTML = `

            <div class="detail-box avatar-box">

                <img
                    src="${pokemonInfo.imgUrl || '/assets/icons/pokeball.svg'}"
                    alt="${pokemonInfo.species || 'Pokémon'}"
                >

            </div>


            <div class="item-info column">


                <div class="static-row align-between">

                    <span class="poke-item-name">
                        ${pokemonInfo.species || 'Unknown'}
                    </span>

                    <span class="poke-item-lvl">
                        LVL ${level}
                    </span>

                </div>


                <div class="health-bar-container green-bar">

                    <div
                        class="health-bar-fill"
                        style="width: ${updateLifeBar(pokemonInfo)};"
                    ></div>

                </div>


                <div class="static-row align-between tiny-text">

                    <span>
                        HP<br>
                        ${pokemonInfo.hp ?? 0}
                        /
                        ${getMaxHp(pokemonInfo)}
                    </span>


                    <span>
                        HAPPINESS<br>
                        ${pokemonInfo.happiness ?? 0}
                        / 10
                    </span>

                </div>


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

    const attacksEl =
        pokemonAttacksElement ||
        document.getElementById(
            'attacks-grid'
        );


    if (
        !attacksEl ||
        !pokemon ||
        !pokemon.attacks
    ) {
        return;
    }


    attacksEl.innerHTML = '';


    for (const attack of pokemon.attacks) {

        const attackSlot =
            document.createElement('div');

        attackSlot.className =
            'attack-card';


        const index =
            pokemon.attacks.indexOf(attack);


        attackSlot.innerHTML = `

            <div class="static-row">

                <div class="column flex-grow">

                    <h6>
                        ATTACK
                    </h6>

                    <input
                        id="attack-name-${index}"
                        type="text"
                        class="inventory-item-input"
                    >

                </div>

            </div>


            <div class="static-row">


                <div class="column">

                    <h6>
                        PWR
                    </h6>

                    <input
                        id="attack-power-${index}"
                        type="text"
                        class="inventory-item-input text-center"
                    >

                </div>


                <div class="column">

                    <h6>
                        ACC
                    </h6>

                    <input
                        id="attack-acc-points-${index}"
                        type="text"
                        class="inventory-item-input text-center"
                    >

                </div>


                <div class="column">

                    <h6>
                        PP
                    </h6>

                    <input
                        id="attack-pp-points-${index}"
                        type="text"
                        class="inventory-item-input text-center"
                    >

                </div>


            </div>


            <div class="column">

                <h6>
                    Attack Type
                </h6>

                <select
                    id="attack-type-${index}"
                    class="custom-select-red"
                >

                    <option
                        selected
                        disabled
                        value=""
                    >
                        Select Type...
                    </option>

                </select>

            </div>


            <hr class="red-text">


            <h6>
                HAVE EFFECT?
            </h6>


            <div class="static-row">

                <input
                    id="attack-have-effect-${index}"
                    type="checkbox"
                    class="custom-checkbox"
                    onchange="toggleEffectInput(this)"
                >

                <input
                    id="attack-effect-${index}"
                    type="text"
                    class="inventory-item-input"
                >

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

const pokemonInfoModal =
    document.getElementById(
        'pokemon-info-modal'
    );

const closePokemonInfoModal =
    document.getElementById(
        'close-pokemon-info-modal'
    );


/* --------------------------------------------------------------------------
   CLOSE FUNCTION
   -------------------------------------------------------------------------- */

function closePokemonInfo() {

    pokemonInfoModal?.classList.add(
        'hidden'
    );
}


/* --------------------------------------------------------------------------
   CLOSE BUTTON
   -------------------------------------------------------------------------- */

closePokemonInfoModal?.addEventListener(
    'click',
    closePokemonInfo
);


/* --------------------------------------------------------------------------
   CLOSE WHEN CLICKING OVERLAY
   -------------------------------------------------------------------------- */

pokemonInfoModal?.addEventListener(
    'click',
    event => {

        if (
            event.target === pokemonInfoModal
        ) {
            closePokemonInfo();
        }

    }
);


/* --------------------------------------------------------------------------
   CLOSE WITH ESCAPE
   -------------------------------------------------------------------------- */

document.addEventListener(
    'keydown',
    event => {

        if (event.key === 'Escape') {
            closePokemonInfo();
        }

    }
);


/* ==========================================================================
   WINDOW EXPORTS
   ========================================================================== */

window.renderPokemonParty =
    renderPokemonParty;

window.renderCapturedPokemons =
    renderCapturedPokemons;

window.renderPokemonAttacks =
    renderPokemonAttacks;

window.renderAllPokemon =
    renderAllPokemon;