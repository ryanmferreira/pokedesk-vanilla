import { auth } from "/js/database/firebase-config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import { getAllSessionCharacters, getSession, getSessionInfo, leaveSesion } from "/js/service/session-service.js";

import { hideLoading, showLoading } from "/js/components/loading.js";
import { renderTypeBadges } from "/js/pokemon/pokemon-info.js";
import { updateLifeBar } from "/js/pokemon/pokemon-management.js";
import { renderPokemonDetails, statBar } from "/js/pokemon/pokemon-render.js";
import { calculateLevel, getMaxHp } from "/js/pokemon/pokemon-rules.js";

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
const modalCharRole = document.getElementById("modal-char-role");
const modalCharImage = document.getElementById("modal-char-image");
const modalCharContent = document.getElementById("modal-char-content");

/* ==========================================================================
   POKEMON INFORMATION MODAL
   ========================================================================== */

const pokemonAttacksModal = document.getElementById("pokemon-attacks-modal");
const closePokemonAttacksModalButton = document.getElementById("close-pokemon-attacks-modal");
const attacksPokemonName = document.getElementById("attacks-pokemon-name");
const attacksPokemonInfo = document.getElementById("attacks-pokemon-info");
const attacksPokemonGender = document.getElementById("attacks-pokemon-gender");
const pokemonAttacksContent = document.getElementById("pokemon-attacks-content");

/* ==========================================================================
   POKEMON INFORMATION MODAL
   ========================================================================== */

function openPokemonAttacksModal(pokemon) {
    if (!pokemonAttacksModal || !pokemonAttacksContent || !pokemon) {
        return;
    }

    attacksPokemonName.textContent = pokemon.species || "Unknown Pokémon";
    attacksPokemonInfo.innerHTML = renderTypeBadges(pokemon.type1, pokemon.type2)
        || "Unknown Type";

    if (attacksPokemonGender) {
        attacksPokemonGender.textContent = pokemon.gender || "-";
    }

    pokemonAttacksContent.innerHTML = renderPokemonDetails(pokemon);

    pokemonAttacksModal.classList.remove("hidden");
}

/* ==========================================================================
   CHARACTER INSPECTION MODAL
   ========================================================================== */

function openInspectModal(char) {
    if (!inspectModal || !modalCharContent || !char) {
        return;
    }

    /* ---------------------------------------------------------------------
       CHARACTER DATA
       --------------------------------------------------------------------- */

    const characterName = char.name || "Unnamed Character";
    const race = char.race || "Unknown Race";
    const characterClass = char.class || "Unknown Class";
    const campaignRole = char.campaignRole || "PLAYER";
    const attributes = char.attributes || {};

    const inventory = Array.isArray(char.inventory) ? char.inventory : [];
    const bag = char.bag ? Object.values(char.bag).flat() : inventory;

    const team = Array.isArray(char.team) ? char.team : [];
    const box = Array.isArray(char.box) ? char.box : [];
    const imageSrc = char.image || "/assets/icons/pokeball.svg";

    const maxHp = getCharacterMaxHp(char);
    const currentHp = char.hp ?? 0;
    const hpPercent = maxHp > 0
        ? Math.max(0, Math.min(100, Math.round((currentHp / maxHp) * 100)))
        : 0;

    /* ---------------------------------------------------------------------
       HEADER
       --------------------------------------------------------------------- */

    modalCharName.textContent = characterName;
    modalCharInfo.textContent = `${race} - ${characterClass}`;
    modalCharRole.textContent = campaignRole;

    if (modalCharImage) {
        modalCharImage.src = imageSrc;
        modalCharImage.alt = characterName;
    }

    /* ---------------------------------------------------------------------
       CONTENT
       --------------------------------------------------------------------- */

    modalCharContent.innerHTML = `
        ${gmSection("OVERVIEW", `
            ${statBar("HP", `${currentHp} / ${maxHp}`, "hp", `${hpPercent}%`)}

            <div class="tiles gm-stat-tiles">
                <div class="detail-box">
                    <span class="panel-label">POINTS</span>
                    <span class="panel-value">${char.points ?? 0}</span>
                </div>

                <div class="detail-box">
                    <span class="panel-label">CASH</span>
                    <span class="panel-value">${formatCash(char.cash)}</span>
                </div>
            </div>
        `, { collapsible: false })}

        ${gmSection("ATTRIBUTES", `
            <div class="tiles">
                <div class="detail-box">
                    <span class="panel-label">STR</span>
                    <span class="panel-value">${attributes.strength ?? 1}</span>
                </div>

                <div class="detail-box">
                    <span class="panel-label">AGI</span>
                    <span class="panel-value">${attributes.agility ?? 1}</span>
                </div>

                <div class="detail-box">
                    <span class="panel-label">RES</span>
                    <span class="panel-value">${attributes.resistance ?? 1}</span>
                </div>

                <div class="detail-box">
                    <span class="panel-label">MND</span>
                    <span class="panel-value">${attributes.mind ?? 1}</span>
                </div>
            </div>
        `, { collapsible: false })}

        <div class="gm-character-sections">
            ${gmSection("INVENTORY", `
                <div class="gm-inventory-list">
                    ${bag.length > 0
            ? bag.map(renderBagItem).join("")
            : `<span class="tiny-text">No items in inventory.</span>`
        }
                </div>
            `, { count: `${bag.length} item(s)` })}

            ${gmSection("POKÉMON PARTY", `
                <div class="gm-pokemon-list">
                    ${team.length > 0
                ? team.map((pokemon, index) => renderCharacterPokemon(pokemon, index)).join("")
                : `<div class="pokemon-slot empty-slot">(+) No Pokémon in party</div>`
            }
                </div>
            `, { count: `${team.length} / 6`, open: true })}
        </div>

        ${gmSection("POKÉMON BOX", `
            <div class="gm-box-grid">
                ${box.length > 0
                    ? box.map((pokemon, index) => renderBoxPokemon(pokemon, index)).join("")
                    : `<span class="tiny-text">No Pokémon in box.</span>`
                }
            </div>
        `, { count: `${box.length} Pokémon` })}

        ${gmSection("INFORMATION", `
            <div class="tiles">
                <div class="detail-box">
                    <span class="panel-label">CHARACTER ID</span>
                    <span class="panel-value panel-value--wrap">${char.id || "-"}</span>
                </div>

                <div class="detail-box">
                    <span class="panel-label">USER ID</span>
                    <span class="panel-value panel-value--wrap">${char.userId || "-"}</span>
                </div>

                <div class="detail-box">
                    <span class="panel-label">SESSION ID</span>
                    <span class="panel-value panel-value--wrap">${char.sessionId || "-"}</span>
                </div>

                <div class="detail-box">
                    <span class="panel-label">LAST SAVED</span>
                    <span class="panel-value panel-value--wrap">${formatLastSaved(char.lastSaved)}</span>
                </div>
            </div>
        `)}
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

function renderCharacterPokemon(pokemon, index) {
    const { level } = calculateLevel(pokemon.xp, pokemon.levelSpeed);
    const maxHp = getMaxHp(pokemon);
    const currentHp = pokemon.hp ?? 0;

    return `
        <button type="button" class="pokemon-slot active-slot" data-team-index="${index}">
            <div class="detail-box avatar-box">
                <img src="${pokemon.imgUrl || "/assets/icons/pokeball.svg"}" alt="${pokemon.species || "Pokémon"}">
            </div>

            <div class="column pokemon-info">
                <div class="static-row align-between pokemon-info__title">
                    <h5>${pokemon.species || "Unknown"}</h5>
                    <span class="pokemon-info__level">LVL ${level}</span>
                </div>

                ${statBar("HP", `${currentHp} / ${maxHp}`, "hp", updateLifeBar(pokemon))}
            </div>
        </button>
    `;
}

/* ==========================================================================
   RENDER BOX POKEMON
   ========================================================================== */

function renderBoxPokemon(pokemon, index) {
    const { level } = calculateLevel(pokemon.xp, pokemon.levelSpeed);
    const maxHp = getMaxHp(pokemon);
    const currentHp = pokemon.hp ?? 0;

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

                ${statBar("HP", `${currentHp} / ${maxHp}`, "hp", updateLifeBar(pokemon))}
            </div>
        </button>
    `;
}

/* ==========================================================================
   CHARACTER / ITEM HELPERS
   ========================================================================== */

function getCharacterMaxHp(char) {
    const resistance = char?.attributes?.resistance ?? 0;
    return resistance * 15;
}

function formatCash(cash) {
    return `₽${cash ?? 0}`;
}

function renderBagItem(item) {
    return `
        <div class="gm-inventory-row">
            <span class="poke-item-name">${item.name || "Item"}</span>
            <span class="gm-qty-chip">x${item.quantity ?? 1}</span>
        </div>
    `;
}

/* Fixed sections stay on screen; collapsible ones get a filled header that
   spells out the action so they are never mistaken for content boxes. */
function gmSection(title, body, options = {}) {
    const { count = "", open = false, collapsible = true } = options;

    if (!collapsible) {
        return `
            <div class="gm-section gm-section--static">
                <div class="section-head">
                    <span class="section-title">${title}</span>
                    ${count ? `<span class="section-count">${count}</span>` : ""}
                </div>

                <div class="gm-section__body">
                    ${body}
                </div>
            </div>
        `;
    }

    return `
        <details class="gm-section"${open ? " open" : ""}>
            <summary class="gm-section__head">
                <span class="section-title">${title}</span>

                <span class="gm-section__meta">
                    ${count ? `<span class="section-count">${count}</span>` : ""}
                    <span class="gm-section__hint" aria-hidden="true"></span>
                    <span class="gm-section__chevron" aria-hidden="true"></span>
                </span>
            </summary>

            <div class="gm-section__body">
                ${body}
            </div>
        </details>
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

                const maxHp = getCharacterMaxHp(char);
                const currentHp = char.hp ?? 0;
                const hpPercent = maxHp > 0
                    ? Math.max(0, Math.min(100, Math.round((currentHp / maxHp) * 100)))
                    : 0;

                characterCard.innerHTML = `
                    <div class="static-row gm-character-card-header">
                        <div class="avatar-box">
                            <img class="player-image" src="${imageSrc}" alt="${char.name || "Player"}">
                        </div>

                        <div class="gm-character-card-identity">
                            <h2>${char.name || "Unnamed Character"}</h2>
                            <span class="tiny-text">${char.race || "Race"} - ${char.class || "Class"}</span>
                        </div>
                    </div>

                    ${statBar("HP", `${currentHp} / ${maxHp}`, "hp", `${hpPercent}%`)}

                    <div class="tiles gm-stat-tiles">
                        <div class="detail-box">
                            <span class="panel-label">POINTS</span>
                            <span class="panel-value">${char.points ?? 0}</span>
                        </div>

                        <div class="detail-box">
                            <span class="panel-label">CASH</span>
                            <span class="panel-value">${formatCash(char.cash)}</span>
                        </div>
                    </div>

                    <button type="button" class="inspect-btn btn-dark expand">Inspect Character</button>
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
    if (event.key !== "Escape") {
        return;
    }

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

        copySessionIdButton.textContent = "Copied!";
        setTimeout(() => {
            copySessionIdButton.textContent = "Copy Session ID";
        }, 2000);
    });
}

/* ==========================================================================
   AUTH
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    renderSessionCharacters();
    renderSessionInfo();

    onAuthStateChanged(auth, async user => {
        if (!user) {
            return;
        }

        const greetingsNameElement = document.getElementById("user-name");

        if (!greetingsNameElement) {
            return;
        }

        const firstName = user.displayName ? user.displayName.split(" ", 1)[0] : "Visitor";
        greetingsNameElement.textContent = `Hello, ${firstName}!`;
    });
});