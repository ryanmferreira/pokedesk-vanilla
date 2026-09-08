export let characterState = {
    id: '',
    image: '',
    lastSaved: '',
    userId: 0,
    sessionId: 0,
    campaignRole: '',
    points: 8,
    name: '',
    class: '',
    race: '',
    hp: 0,
    cash: 0,

    attributes: {
        resistance: 1,
        strength: 1,
        mind: 1,
        agility: 1
    },

    // LEGACY
    // Mantido temporariamente para compatibilidade
    inventory: [],

    bag: {
        version: 1,
        misc: [],
        potions: [],
        pokeballs: [],
        consumables: [],
        weapons: [],
        equipment: [],
        keyItems: [],
        stones: [],
        insignia: []
    },

    capturedPokemon: [],
    team: [],
    diary: []
};

const BAG_CATEGORIES = [
    'misc',
    'potions',
    'pokeballs',
    'consumables',
    'weapons',
    'equipment',
    'keyItems',
    'stones',
    'insignia'
];

function createEmptyBag() {
    return {
        version: 1,
        misc: [],
        potions: [],
        pokeballs: [],
        consumables: [],
        weapons: [],
        equipment: [],
        keyItems: [],
        stones: [],
        insignia: []
    };
}

/* ==========================================================================
   INVENTORY MIGRATION
   ========================================================================== */

export function migrateInventory(state) {
    if (!Array.isArray(state.inventory)) {
        state.inventory = [];
    }

    const hasBag = state.bag && typeof state.bag === 'object';

    if (!hasBag) {
        state.bag = createEmptyBag();
        state.bag.misc = state.inventory.map(item => ({ ...item }));
    }

    for (const category of BAG_CATEGORIES) {
        if (!Array.isArray(state.bag[category])) {
            state.bag[category] = [];
        }
    }

    if (state.bag.version === undefined) {
        state.bag.version = 1;
    }

    return state;
}

/* ==========================================================================
   CHARACTER STATE
   ========================================================================== */

export function setCharacterState(newState) {
    /*
     * Faz a migração antes de colocar o estado
     * dentro do characterState global.
     */

    migrateInventory(newState);

    Object.assign(characterState, newState);
}