import { getAllSessionCharacters } from "/js/service/session-service.js";

function renderSessionCharacters() {
    const mainElement = document.querySelector('main');
  
    if (!mainElement) {
        return;
    }

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
            characterCard.className = 'container';

            characterCard.innerHTML = `
                <!-- HEADER -->
                <div class="static-row align-between">
                    <div class="column">
                        <h2>${char.name || 'Unnamed Character'}</h2>
                        <span class="tiny-text">${char.race || 'Race'} • ${char.class || 'Class'}</span>
                    </div>
                    <div class="detail-box column stat-box">
                        <span class="panel-label">HP</span>
                        <span class="panel-value">${char.hp || 0}</span>
                    </div>
                </div>

                <hr>

                <!-- MAIN STATS -->
                <div class="static-row align-between">
                    <div>
                        <span class="panel-label">Points:</span>
                        <span class="panel-value">${char.points || 0}</span>
                    </div>
                    <div>
                        <span class="panel-label">Cash:</span>
                        <span class="panel-value">$${char.cash || 0}</span>
                    </div>
                </div>

                <!-- ACTION BUTTON -->
                <div class="action-row">
                    <button type="button" class="inspect-btn btn-dark expand">Inspect Character</button>
                </div>

                <!-- COLLAPSIBLE DETAILS SECTION -->
                <div class="details-container column" style="display: none;">
                    <hr>

                    <!-- ATTRIBUTES -->
                    <span class="section-title">Attributes</span>
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

                    <!-- INVENTORY -->
                    <span class="section-title">Inventory (${char.inventory?.length || 0})</span>
                    <div class="column">
                        ${(char.inventory && char.inventory.length > 0)
                    ? char.inventory.map(item => `
                                    <div class="inventory-item-row">
                                        <div class="detail-box flex-grow">
                                            <span class="poke-item-name">${item.name || 'Item'}</span>
                                        </div>
                                        <div class="inventory-qty-input">${item.quantity || 1}</div>
                                    </div>
                                `).join('')
                    : '<span class="tiny-text">No items in inventory.</span>'
                }
                    </div>

                    <hr>

                    <!-- POKÉMON TEAM -->
                    <span class="section-title">Pokémon Team (${char.team?.length || 0})</span>
                    <div class="pokemon-grid">
                        ${(char.team && char.team.length > 0)
                    ? char.team.map(p => `
                                    <div class="pokemon-slot active-slot">
                                        <div class="avatar-box">
                                            <img src="${p.imgUrl || ''}" alt="${p.species || 'Pokémon'}">
                                        </div>
                                        <div class="pokemon-info">
                                            <div class="static-row align-between">
                                                <h5>${p.species || 'Unknown'}</h5>
                                                <span class="tiny-text">LVL ${p.level || 1}</span>
                                            </div>
                                            <div class="health-bar-container">
                                                <div class="health-bar-fill" style="width: 100%;"></div>
                                            </div>
                                            <span class="tiny-text">HP ${p.hp || 0}</span>
                                        </div>
                                    </div>
                                `).join('')
                    : '<div class="pokemon-slot empty-slot">(+) No Pokémon in party</div>'
                }
                    </div>
                </div>
            `;

            const inspectBtn = characterCard.querySelector('.inspect-btn');
            const detailsDiv = characterCard.querySelector('.details-container');

            inspectBtn.addEventListener('click', () => {
                const isHidden = detailsDiv.style.display === 'none';
                detailsDiv.style.display = isHidden ? 'flex' : 'none';
                inspectBtn.textContent = isHidden ? 'Close Inspection' : 'Inspect Character';
            });

            mainElement.appendChild(characterCard);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderSessionCharacters();
});