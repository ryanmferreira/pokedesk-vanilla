import { getAllSessionCharacters, leaveSesion, getSessionInfo, getSession } from "/js/service/session-service.js";

const showSessionName = document.getElementById('session-name');
const copySessionIdButton = document.getElementById('copy-session-id');
const leaveSessionButton = document.getElementById('leave-session');

const sessionNameElement = document.getElementById('gm-session-name');
const sessionIdElement = document.getElementById('gm-session-id');

const inspectModal = document.getElementById('inspect-modal');
const closeModalBtn = document.getElementById('close-inspect-modal');
const modalCharName = document.getElementById('modal-char-name');
const modalCharInfo = document.getElementById('modal-char-info');
const modalCharContent = document.getElementById('modal-char-content');

function openInspectModal(char) {
    if (!inspectModal) return;

    modalCharName.innerText = char.name || 'Unnamed Character';
    modalCharInfo.innerText = `${char.race || 'Race'} • ${char.class || 'Class'}`;

    const charImageSrc = char.image || '/assets/icons/pokeball.svg';

    modalCharContent.innerHTML = `
        <div class="static-row align-center" style="gap: 16px;">
            <div class="avatar-box" style="width: 72px; height: 72px; flex-shrink: 0;">
                <img class="player-image" src="${charImageSrc}" alt="${char.name || 'Player'}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
            </div>
            <div class="column flex-grow" style="min-width: 0;">
                <h3>${char.name || 'Unnamed Character'}</h3>
                <span class="tiny-text">${char.race || 'Race'} • ${char.class || 'Class'}</span>
            </div>
        </div>

        <div class="correct-size">
            <div class="detail-box column stat-box">
                <span class="panel-label">HP</span>
                <span class="panel-value">${char.hp || 0}</span>
            </div>
            <div class="detail-box column stat-box">
                <span class="panel-label">Points</span>
                <span class="panel-value">${char.points || 0}</span>
            </div>
            <div class="detail-box column stat-box">
                <span class="panel-label">Cash</span>
                <span class="panel-value">$${char.cash || 0}</span>
            </div>
        </div>

        <div class="correct-size">
            <div class="detail-box column stat-box">
                <span class="panel-label">STR</span>
                <span class="panel-value">${char.attributes?.strength || 1}</span>
            </div>
            <div class="detail-box column stat-box">
                <span class="panel-label">AGI</span>
                <span class="panel-value">${char.attributes?.agility || 1}</span>
            </div>
            <div class="detail-box column stat-box">
                <span class="panel-label">RES</span>
                <span class="panel-value">${char.attributes?.resistance || 1}</span>
            </div>
            <div class="detail-box column stat-box">
                <span class="panel-label">MND</span>
                <span class="panel-value">${char.attributes?.mind || 1}</span>
            </div>
        </div>

        <hr>

        <div class="inspect-columns">
            <div class="inspect-column-box">
                <span class="section-title">Inventory (${char.inventory?.length || 0})</span>
                <div class="column" style="gap: 8px;">
                    ${(char.inventory && char.inventory.length > 0)
            ? char.inventory.map(item => `
                            <div class="inventory-item-row static-row align-between">
                                <div class="detail-box flex-grow">
                                    <span class="poke-item-name">${item.name || 'Item'}</span>
                                </div>
                                <div class="inventory-qty-input">${item.quantity || 1}</div>
                            </div>
                        `).join('')
            : '<span class="tiny-text">No items in inventory.</span>'
        }
                </div>
            </div>

            <div class="inspect-column-box">
                <span class="section-title">Pokémon Team (${char.team?.length || 0})</span>
                <div class="column" style="gap: 8px;">
                    ${(char.team && char.team.length > 0)
            ? char.team.map((p, index) => {
                const maxHp = p.maxHp || p.hp || 1;
                const hpPercent = Math.max(0, Math.min(100, Math.round(((p.hp || 0) / maxHp) * 100)));
                return `
                            <button type="button" class="pokemon-slot active-slot" data-index="${index}">
                                <div class="avatar-box" style="width: 42px; height: 42px; flex-shrink: 0;">
                                    <img src="${p.imgUrl || '/assets/icons/pokeball.svg'}" alt="${p.species || 'Pokémon'}">
                                </div>
                                <div class="pokemon-info flex-grow">
                                    <div class="static-row align-between">
                                        <h5>${p.species || 'Unknown'}</h5>
                                        <span class="tiny-text">LVL ${p.level || 1}</span>
                                    </div>
                                    <div class="health-bar-container" style="height: 5px;">
                                        <div class="health-bar-fill" style="width: ${hpPercent}%;"></div>
                                    </div>
                                    <span class="tiny-text">HP ${p.hp || 0}</span>
                                </div>
                            </button>
                        `;
            }).join('')
            : '<div class="pokemon-slot empty-slot">(+) No Pokémon in party</div>'
        }
                </div>
            </div>
        </div>
    `;

    const pokeButtons = modalCharContent.querySelectorAll('button.pokemon-slot');
    pokeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const pokeIndex = btn.getAttribute('data-index');
            const selectedPokemon = char.team[pokeIndex];
            console.log('Selected Pokémon:', selectedPokemon);
        });
    });

    inspectModal.classList.remove('hidden');
}

function closeInspectModal() {
    if (inspectModal) {
        inspectModal.classList.add('hidden');
    }
}

function renderSessionCharacters() {
    const mainElement = document.getElementById('players');

    if (!mainElement) return;

    getAllSessionCharacters((characters) => {
        mainElement.innerHTML = '';

        if (!characters || characters.length === 0) {
            const emptyNotice = document.createElement('div');
            emptyNotice.className = 'container flex-grow';
            emptyNotice.innerHTML = `
                <h2>Session Characters</h2>
                <hr>
                <h6>No characters found in this session.</h6>
            `;
            mainElement.appendChild(emptyNotice);
            return;
        }

        for (const char of characters) {
            const characterCard = document.createElement('div');
            characterCard.classList = 'container characters';

            const imageSrc = char.image || '/assets/icons/pokeball.svg';

            characterCard.innerHTML = `
                <div class="static-row align-between" style="gap: 12px; align-items: center;">
                    <div class="avatar-box" style="width: 52px; height: 52px; flex-shrink: 0;">
                        <img class="player-image" src="${imageSrc}" alt="${char.name || 'Player'}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
                    </div>

                    <div class="column flex-grow" style="min-width: 0;">
                        <h2>${char.name || 'Unnamed Character'}</h2>
                        <span class="tiny-text">${char.race || 'Race'} • ${char.class || 'Class'}</span>
                    </div>

                    <div class="detail-box column stat-box role-stat-box">
                        <span class="panel-label">ROLE</span>
                        <span class="panel-value role-text">${char.campaignRole || 'PLAYER'}</span>
                    </div>
                </div>

                <hr>

                <div class="static-row card-stats-row">
                    <div class="detail-box column stat-box flex-grow">
                        <span class="panel-label">HP</span>
                        <span class="panel-value">${char.hp || 0}</span>
                    </div>
                    <div class="detail-box column stat-box flex-grow">
                        <span class="panel-label">POINTS</span>
                        <span class="panel-value">${char.points || 0}</span>
                    </div>
                    <div class="detail-box column stat-box flex-grow">
                        <span class="panel-label">CASH</span>
                        <span class="panel-value">$${char.cash || 0}</span>
                    </div>
                </div>

                <div class="action-row" style="margin-top: 12px;">
                    <button type="button" class="inspect-btn btn-dark expand">Inspect Character</button>
                </div>
            `;

            const inspectBtn = characterCard.querySelector('.inspect-btn');
            inspectBtn.addEventListener('click', () => {
                openInspectModal(char);
            });

            mainElement.appendChild(characterCard);
        }
    });
}

closeModalBtn?.addEventListener('click', closeInspectModal);

inspectModal?.addEventListener('click', (e) => {
    if (e.target === inspectModal) {
        closeInspectModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeInspectModal();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    renderSessionInfo();
    renderSessionCharacters();
});

leaveSessionButton?.addEventListener('click', () => {
    leaveSesion();
});

async function renderSessionInfo() {
    const sessionInfo = await getSessionInfo(getSession());

    if (!sessionInfo) {
        return;
    }

    if (showSessionName) { showSessionName.innerText = sessionInfo.name; }
    if (sessionIdElement) { sessionIdElement.innerText = sessionInfo.id; }
    if (sessionNameElement) { sessionNameElement.innerText = sessionInfo.name; }

    copySessionIdButton?.addEventListener('click', () => {
        copyToClipboard(sessionInfo.id);
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
}