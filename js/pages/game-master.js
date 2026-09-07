import { auth } from "/js/database/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import {
    getAllSessionCharacters,
    leaveSesion,
    getSessionInfo,
    getSession
} from "/js/service/session-service.js";
import { showLoading, hideLoading } from "/js/components/loading.js";
import { calculateLevel, getMaxHp } from "/js/pokemon/pokemon-rules.js";
import { updateLifeBar } from "/js/pokemon/pokemon-management.js";

/* ==========================================================================
   GLOBAL ELEMENTS
   ========================================================================== */

const showSessionName = document.getElementById("session-name");
const copySessionIdButton = document.getElementById("copy-session-id");
const leaveSessionButton = document.getElementById("leave-session");
const sessionNameElement = document.getElementById("gm-session-name");
const sessionIdElement = document.getElementById("gm-session-id");

/* ==========================================================================
   CHARACTER INSPECTION MODAL
   ========================================================================== */

const inspectModal = document.getElementById("inspect-modal");
const closeModalButton = document.getElementById("close-inspect-modal");
const modalCharName = document.getElementById("modal-char-name");
const modalCharInfo = document.getElementById("modal-char-info");
const modalCharContent = document.getElementById("modal-char-content");

/* ==========================================================================
   POKEMON INFORMATION MODAL
   ========================================================================== */

const pokemonAttacksModal = document.getElementById("pokemon-attacks-modal");
const closePokemonAttacksModalButton = document.getElementById("close-pokemon-attacks-modal");
const attacksPokemonName = document.getElementById("attacks-pokemon-name");
const attacksPokemonInfo = document.getElementById("attacks-pokemon-info");
const pokemonAttacksContent = document.getElementById("pokemon-attacks-content");

/* ==========================================================================
   POKEMON INFORMATION MODAL
   ========================================================================== */

function openPokemonAttacksModal(pokemon) {
    if (!pokemonAttacksModal || !pokemonAttacksContent || !pokemon) return;

    /* ---------------------------------------------------------------------
       BASIC INFORMATION
       --------------------------------------------------------------------- */

    const { level } = calculateLevel(pokemon.xp, pokemon.levelSpeed);
    const maxHp = getMaxHp(pokemon);
    const currentHp = pokemon.hp ?? 0;
    const status = pokemon.status || {};

    const types = [pokemon.type1, pokemon.type2]
        .filter(type => type && type !== "None")
        .join(" / ");

    const attacks = Array.isArray(pokemon.attacks)
        ? pokemon.attacks.filter(attack => attack && attack.name && attack.name.trim() !== "")
        : [];

    /* ---------------------------------------------------------------------
       HEADER
       --------------------------------------------------------------------- */

    attacksPokemonName.textContent = pokemon.species || "Unknown Pokémon";
    attacksPokemonInfo.textContent = types || "Unknown Type";

    /* ---------------------------------------------------------------------
       CONTENT
       --------------------------------------------------------------------- */

    pokemonAttacksContent.innerHTML = `
        <!-- ================================================================
             POKEMON SUMMARY
             ================================================================ -->
        <div class="gm-pokemon-summary">
            <!-- IMAGE -->
            <div class="detail-box avatar-box gm-pokemon-image">
                <img src="${pokemon.imgUrl || "/assets/icons/pokeball.svg"}" alt="${pokemon.species || "Pokémon"}">
            </div>

            <!-- BASIC INFORMATION -->
            <div class="gm-pokemon-information">
                <div class="correct-size">
                    <!-- LEVEL -->
                    <div class="detail-box stat-box column">
                        <span class="panel-label">LEVEL</span>
                        <span class="panel-value">${level}</span>
                    </div>

                    <!-- XP -->
                    <div class="detail-box stat-box column">
                        <span class="panel-label">XP</span>
                        <span class="panel-value">${pokemon.xp ?? 0}</span>
                    </div>

                    <!-- LEVEL SPEED -->
                    <div class="detail-box stat-box column">
                        <span class="panel-label">LEVEL SPEED</span>
                        <span class="panel-value">${pokemon.levelSpeed || "-"}</span>
                    </div>
                </div>

                <div class="correct-size">
                    <!-- HP -->
                    <div class="detail-box stat-box column">
                        <span class="panel-label">HP</span>
                        <span class="panel-value">${currentHp} / ${maxHp}</span>
                    </div>

                    <!-- HAPPINESS -->
                    <div class="detail-box stat-box column">
                        <span class="panel-label">HAPPINESS</span>
                        <span class="panel-value">${pokemon.happiness ?? 0} / 10</span>
                    </div>

                    <!-- GENDER -->
                    <div class="detail-box stat-box column">
                        <span class="panel-label">GENDER</span>
                        <span class="panel-value">${pokemon.gender || "-"}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- ================================================================
             HP BAR
             ================================================================ -->
        <div class="column">
            <div class="static-row align-between">
                <span class="panel-label">HP</span>
                <span class="tiny-text">${currentHp} / ${maxHp}</span>
            </div>

            <div class="health-bar-container green-bar">
                <div class="health-bar-fill" style="width: ${updateLifeBar(pokemon)};"></div>
            </div>
        </div>

        <!-- ================================================================
             DETAILS
             ================================================================ -->
        <div class="gm-pokemon-details">
            <!-- NATURE -->
            <div class="detail-box column">
                <span class="panel-label">NATURE</span>
                <span class="panel-value">${pokemon.nature || "-"}</span>
            </div>

            <!-- ABILITY -->
            <div class="detail-box column">
                <span class="panel-label">ABILITY</span>
                <span class="panel-value">${pokemon.ability || "-"}</span>
            </div>

            <!-- ITEM -->
            <div class="detail-box column">
                <span class="panel-label">EQUIPPED ITEM</span>
                <span class="panel-value">${pokemon.item || "-"}</span>
            </div>

            <!-- CAPTURED BY -->
            <div class="detail-box column">
                <span class="panel-label">CAPTURED BY</span>
                <span class="panel-value">${pokemon.capturedBy || "-"}</span>
            </div>
        </div>

        <!-- ================================================================
             STATUS
             ================================================================ -->
        <div class="column">
            <h3 class="section-title">STATUS</h3>

            <div class="status-table">
                <div class="status-table-header">
                    <span>HP</span>
                    <span>ATK</span>
                    <span>DEF</span>
                    <span>SP. ATK</span>
                    <span>SP. DEF</span>
                    <span>SPD</span>
                </div>

                <div class="status-table-body gm-status-values">
                    <span>${status.hp ?? 0}</span>
                    <span>${status.atk ?? 0}</span>
                    <span>${status.def ?? 0}</span>
                    <span>${status.spAtk ?? 0}</span>
                    <span>${status.spDef ?? 0}</span>
                    <span>${status.spd ?? 0}</span>
                </div>
            </div>
        </div>

        <!-- ================================================================
             ATTACKS
             ================================================================ -->
        <div class="column">
            <div class="static-row align-between">
                <h3 class="section-title">ATTACKS</h3>
                <span class="tiny-text">${attacks.length}</span>
            </div>

            <div class="gm-attacks-grid">
                ${attacks.length > 0
            ? attacks.map(attack => `
                    <div class="attack-card">
                        <div class="static-row align-between">
                            <div class="column">
                                <h3>${attack.name}</h3>
                                <span class="tiny-text">${attack.type || "-"}</span>
                            </div>

                            <div class="column align-center">
                                <span class="panel-label">POWER</span>
                                <span class="panel-value">${attack.pwr ?? 0}</span>
                            </div>
                        </div>

                        <div class="correct-size">
                            <div class="detail-box stat-box column">
                                <span class="panel-label">ACC</span>
                                <span class="panel-value">${attack.acc ?? 0}%</span>
                            </div>

                            <div class="detail-box stat-box column">
                                <span class="panel-label">PP</span>
                                <span class="panel-value">${attack.pp ?? 0}</span>
                            </div>
                        </div>

                        ${attack.haveEffect && attack.effect ? `
                        <div class="column">
                            <span class="panel-label">EFFECT</span>
                            <span class="tiny-text">${attack.effect}</span>
                        </div>
                        ` : ""}
                    </div>
                `).join("")
            : `<span class="tiny-text">No attacks available.</span>`
        }
            </div>
        </div>
    `;

    pokemonAttacksModal.classList.remove("hidden");
}

/* ==========================================================================
   CHARACTER INSPECTION MODAL
   ========================================================================== */

function openInspectModal(char) {
    if (!inspectModal || !modalCharContent || !char) return;

    /* ---------------------------------------------------------------------
       CHARACTER DATA
       --------------------------------------------------------------------- */

    const characterName = char.name || "Unnamed Character";
    const race = char.race || "Unknown Race";
    const characterClass = char.class || "Unknown Class";
    const campaignRole = char.campaignRole || "PLAYER";
    const attributes = char.attributes || {};
    const inventory = Array.isArray(char.inventory) ? char.inventory : [];
    const team = Array.isArray(char.team) ? char.team : [];
    const box = Array.isArray(char.box) ? char.box : [];
    const imageSrc = char.image || "/assets/icons/pokeball.svg";

    /* ---------------------------------------------------------------------
       HEADER
       --------------------------------------------------------------------- */

    modalCharName.textContent = characterName;
    modalCharInfo.textContent = `${race} • ${characterClass}`;

    /* ---------------------------------------------------------------------
       CONTENT
       --------------------------------------------------------------------- */

    modalCharContent.innerHTML = `
        <!-- ================================================================
             CHARACTER HEADER
             ================================================================ -->
        <div class="static-row gm-character-header">
            <div class="avatar-box gm-character-image">
                <img src="${imageSrc}" alt="${characterName}">
            </div>

            <div class="column flex-grow">
                <h2>${characterName}</h2>
                <span class="tiny-text">${race} • ${characterClass}</span>
                <span class="gm-role">${campaignRole}</span>
            </div>
        </div>

        <!-- ================================================================
             CHARACTER STATS
             ================================================================ -->
        <div class="correct-size">
            <div class="detail-box stat-box column">
                <span class="panel-label">HP</span>
                <span class="panel-value">${char.hp ?? 0}</span>
            </div>

            <div class="detail-box stat-box column">
                <span class="panel-label">POINTS</span>
                <span class="panel-value">${char.points ?? 0}</span>
            </div>

            <div class="detail-box stat-box column">
                <span class="panel-label">CASH</span>
                <span class="panel-value">$${char.cash ?? 0}</span>
            </div>

            <div class="detail-box stat-box column">
                <span class="panel-label">ROLE</span>
                <span class="panel-value">${campaignRole}</span>
            </div>
        </div>

        <hr>

        <!-- ================================================================
             ATTRIBUTES
             ================================================================ -->
        <div class="column">
            <h3 class="section-title">ATTRIBUTES</h3>

            <div class="correct-size">
                <div class="detail-box stat-box column">
                    <span class="panel-label">STR</span>
                    <span class="panel-value">${attributes.strength ?? 1}</span>
                </div>

                <div class="detail-box stat-box column">
                    <span class="panel-label">AGI</span>
                    <span class="panel-value">${attributes.agility ?? 1}</span>
                </div>

                <div class="detail-box stat-box column">
                    <span class="panel-label">RES</span>
                    <span class="panel-value">${attributes.resistance ?? 1}</span>
                </div>

                <div class="detail-box stat-box column">
                    <span class="panel-label">MND</span>
                    <span class="panel-value">${attributes.mind ?? 1}</span>
                </div>
            </div>
        </div>

        <hr>

        <!-- ================================================================
             INVENTORY + POKEMON PARTY
             ================================================================ -->
        <div class="gm-character-sections">
            <!-- ============================================================
                 INVENTORY
                 ============================================================ -->
            <div class="column gm-character-section">
                <div class="static-row align-between">
                    <h3 class="section-title">INVENTORY</h3>
                    <span class="tiny-text">${inventory.length} item(s)</span>
                </div>

                <div class="gm-inventory-list">
                    ${inventory.length > 0
            ? inventory.map(item => `
                        <div class="inventory-item-row">
                            <div class="detail-box flex-grow">
                                <span class="poke-item-name">${item.name || "Item"}</span>
                            </div>
                            <div class="inventory-qty-input">${item.quantity ?? 1}</div>
                        </div>
                    `).join("")
            : `<span class="tiny-text">No items in inventory.</span>`
        }
                </div>
            </div>

            <!-- ============================================================
                 POKEMON PARTY
                 ============================================================ -->
            <div class="column gm-character-section">
                <div class="static-row align-between">
                    <h3 class="section-title">POKÉMON PARTY</h3>
                    <span class="tiny-text">${team.length} / 6</span>
                </div>

                <div class="gm-pokemon-list">
                    ${team.length > 0
            ? team.map((pokemon, index) => renderCharacterPokemon(pokemon, index, "team")).join("")
            : `<div class="pokemon-slot empty-slot">(+) No Pokémon in party</div>`
        }
                </div>
            </div>
        </div>

        <hr>

        <!-- ================================================================
             POKEMON BOX
             ================================================================ -->
        <div class="column">
            <div class="static-row align-between">
                <h3 class="section-title">POKÉMON BOX</h3>
                <span class="tiny-text">${box.length} Pokémon</span>
            </div>

            <div class="gm-box-grid">
                ${box.length > 0
            ? box.map((pokemon, index) => renderBoxPokemon(pokemon, index)).join("")
            : `<span class="tiny-text">No Pokémon in box.</span>`
        }
            </div>
        </div>

        <hr>

        <!-- ================================================================
             CHARACTER INFORMATION
             ================================================================ -->
        <div class="column">
            <h3 class="section-title">INFORMATION</h3>

            <div class="gm-metadata">
                <div class="detail-box column">
                    <span class="panel-label">CHARACTER ID</span>
                    <span class="tiny-text">${char.id || "-"}</span>
                </div>

                <div class="detail-box column">
                    <span class="panel-label">USER ID</span>
                    <span class="tiny-text">${char.userId || "-"}</span>
                </div>

                <div class="detail-box column">
                    <span class="panel-label">SESSION ID</span>
                    <span class="tiny-text">${char.sessionId || "-"}</span>
                </div>

                <div class="detail-box column">
                    <span class="panel-label">LAST SAVED</span>
                    <span class="tiny-text">${formatLastSaved(char.lastSaved)}</span>
                </div>
            </div>
        </div>
    `;

    /* ---------------------------------------------------------------------
       PARTY EVENTS
       --------------------------------------------------------------------- */

    const pokemonButtons = modalCharContent.querySelectorAll("[data-team-index]");
    pokemonButtons.forEach(button => {
        button.addEventListener("click", () => {
            const index = Number(button.dataset.teamIndex);
            const selectedPokemon = team[index];
            openPokemonAttacksModal(selectedPokemon);
        });
    });

    /* ---------------------------------------------------------------------
       BOX EVENTS
       --------------------------------------------------------------------- */

    const boxButtons = modalCharContent.querySelectorAll("[data-box-index]");
    boxButtons.forEach(button => {
        button.addEventListener("click", () => {
            const index = Number(button.dataset.boxIndex);
            const selectedPokemon = box[index];
            openPokemonAttacksModal(selectedPokemon);
        });
    });

    /* ---------------------------------------------------------------------
       OPEN
       --------------------------------------------------------------------- */

    inspectModal.classList.remove("hidden");
}

/* ==========================================================================
   RENDER PARTY POKEMON
   ========================================================================== */

function renderCharacterPokemon(pokemon, index, location) {
    const { level } = calculateLevel(pokemon.xp, pokemon.levelSpeed);
    const maxHp = getMaxHp(pokemon);
    const currentHp = pokemon.hp ?? 0;
    const happiness = pokemon.happiness ?? 0;

    const types = [pokemon.type1, pokemon.type2]
        .filter(type => type && type !== "None")
        .join(" / ");

    return `
        <button type="button" class="pokemon-slot active-slot gm-character-pokemon" data-team-index="${index}">
            <div class="detail-box avatar-box">
                <img src="${pokemon.imgUrl || "/assets/icons/pokeball.svg"}" alt="${pokemon.species || "Pokémon"}">
            </div>

            <div class="column pokemon-info">
                <div class="static-row align-between">
                    <h5>${pokemon.species || "Unknown"}</h5>
                    <span>LVL ${level}</span>
                </div>

                <span class="tiny-text">${types || "Unknown Type"}</span>

                <div class="health-bar-container">
                    <div class="health-bar-fill" style="width: ${updateLifeBar(pokemon)};"></div>
                </div>

                <div class="static-row align-between tiny-text">
                    <span>HP ${currentHp} / ${maxHp}</span>
                    <span>Happiness ${happiness}/10</span>
                </div>
            </div>
        </button>
    `;
}

/* ==========================================================================
   RENDER BOX POKEMON
   ========================================================================== */

function renderBoxPokemon(pokemon, index) {
    const { level } = calculateLevel(pokemon.xp, pokemon.levelSpeed);

    const types = [pokemon.type1, pokemon.type2]
        .filter(type => type && type !== "None")
        .join(" / ");

    return `
        <button type="button" class="captured-item gm-box-pokemon" data-box-index="${index}">
            <div class="detail-box avatar-box">
                <img src="${pokemon.imgUrl || "/assets/icons/pokeball.svg"}" alt="${pokemon.species || "Pokémon"}">
            </div>

            <div class="item-info column">
                <div class="static-row align-between">
                    <span class="poke-item-name">${pokemon.species || "Unknown"}</span>
                    <span class="poke-item-lvl">LVL ${level}</span>
                </div>

                <span class="tiny-text">${types || "Unknown Type"}</span>
            </div>
        </button>
    `;
}

/* ==========================================================================
   FORMAT LAST SAVED
   ========================================================================== */

function formatLastSaved(timestamp) {
    if (!timestamp) return "-";

    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleString();
}

/* ==========================================================================
   CLOSE CHARACTER MODAL
   ========================================================================== */

function closeInspectModal() {
    inspectModal?.classList.add("hidden");
}

/* ==========================================================================
   CLOSE POKEMON MODAL
   ========================================================================== */

function closePokemonAttacksModal() {
    pokemonAttacksModal?.classList.add("hidden");
}

/* ==========================================================================
   RENDER SESSION CHARACTERS
   ========================================================================== */

function renderSessionCharacters() {
    showLoading("Loading Characters...");

    const mainElement = document.getElementById("players");
    if (!mainElement) {
        hideLoading();
        return;
    }

    getAllSessionCharacters(characters => {
        try {
            mainElement.innerHTML = "";

            /* ---------------------------------------------------------
               EMPTY SESSION
               --------------------------------------------------------- */

            if (!characters || characters.length === 0) {
                const emptyNotice = document.createElement("div");
                emptyNotice.className = "container flex-grow";
                emptyNotice.innerHTML = `
                    <h2>Session Characters</h2>
                    <hr>
                    <h6>No characters found in this session.</h6>
                `;
                mainElement.appendChild(emptyNotice);
                return;
            }

            /* ---------------------------------------------------------
               CHARACTERS
               --------------------------------------------------------- */

            for (const char of characters) {
                const characterCard = document.createElement("div");
                characterCard.className = "container characters";

                const imageSrc = char.image || "/assets/icons/pokeball.svg";

                characterCard.innerHTML = `
                    <div class="static-row align-between gm-character-card-header">
                        <div class="avatar-box">
                            <img class="player-image" src="${imageSrc}" alt="${char.name || "Player"}">
                        </div>

                        <div class="column flex-grow">
                            <h2>${char.name || "Unnamed Character"}</h2>
                            <span class="tiny-text">${char.race || "Race"} • ${char.class || "Class"}</span>
                        </div>

                        <div class="detail-box column stat-box role-stat-box">
                            <span class="panel-label">ROLE</span>
                            <span class="panel-value role-text">${char.campaignRole || "PLAYER"}</span>
                        </div>
                    </div>

                    <hr>

                    <div class="static-row card-stats-row">
                        <div class="detail-box column stat-box flex-grow">
                            <span class="panel-label">HP</span>
                            <span class="panel-value">${char.hp ?? 0}</span>
                        </div>

                        <div class="detail-box column stat-box flex-grow">
                            <span class="panel-label">POINTS</span>
                            <span class="panel-value">${char.points ?? 0}</span>
                        </div>

                        <div class="detail-box column stat-box flex-grow">
                            <span class="panel-label">CASH</span>
                            <span class="panel-value">$${char.cash ?? 0}</span>
                        </div>
                    </div>

                    <div class="action-row">
                        <button type="button" class="inspect-btn btn-dark expand">Inspect Character</button>
                    </div>
                `;

                const inspectButton = characterCard.querySelector(".inspect-btn");
                inspectButton?.addEventListener("click", () => {
                    openInspectModal(char);
                });

                mainElement.appendChild(characterCard);
            }
        } finally {
            hideLoading();
        }
    });
}

/* ==========================================================================
   MODAL EVENTS
   ========================================================================== */

closeModalButton?.addEventListener("click", closeInspectModal);
closePokemonAttacksModalButton?.addEventListener("click", closePokemonAttacksModal);

/* ==========================================================================
   OVERLAY CLICK
   ========================================================================== */

inspectModal?.addEventListener("click", event => {
    if (event.target === inspectModal) {
        closeInspectModal();
    }
});

pokemonAttacksModal?.addEventListener("click", event => {
    if (event.target === pokemonAttacksModal) {
        closePokemonAttacksModal();
    }
});

/* ==========================================================================
   ESCAPE
   ========================================================================== */

document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;

    if (!pokemonAttacksModal?.classList.contains("hidden")) {
        closePokemonAttacksModal();
        return;
    }

    closeInspectModal();
});

/* ==========================================================================
   LEAVE SESSION
   ========================================================================== */

leaveSessionButton?.addEventListener("click", () => {
    leaveSesion();
});

/* ==========================================================================
   COPY SESSION ID
   ========================================================================== */

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
}

/* ==========================================================================
   SESSION INFORMATION
   ========================================================================== */

async function renderSessionInfo() {
    const sessionInfo = await getSessionInfo(getSession());
    if (!sessionInfo) return;

    if (showSessionName) {
        showSessionName.innerText = sessionInfo.name;
    }

    if (sessionIdElement) {
        sessionIdElement.innerText = sessionInfo.id;
    }

    if (sessionNameElement) {
        sessionNameElement.innerText = sessionInfo.name;
    }

    copySessionIdButton?.addEventListener("click", () => {
        copyToClipboard(sessionInfo.id);
    });
}

/* ==========================================================================
   AUTH
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    renderSessionCharacters();
    renderSessionInfo();

    onAuthStateChanged(auth, async user => {
        if (!user) return;

        const greetingsNameElement = document.getElementById("user-name");
        if (!greetingsNameElement) return;

        const firstName = user.displayName ? user.displayName.split(" ", 1)[0] : "Visitor";
        greetingsNameElement.textContent = `Hello, ${firstName}!`;
    });
});