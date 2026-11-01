export let characterState = {
    id: '',
    image: '',
    lastSaved: '',
    userId: 0,
    sessionId: 0,
    campaignRole: '',
    points: 8,

    additionalPoints: {
        resistance: 0,
        strength: 0,
        mind: 0,
        agility: 0
    },

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
   ADDITIONAL POINTS MIGRATION
   ========================================================================== */

function normalizeAdditionalPoint(value) {
    const points = Number(value);

    if (!Number.isFinite(points)) {
        return 0;
    }

    return Math.floor(points);
}

export function migrateAdditionalPoints(state) {
    const additionalPoints = state?.additionalPoints;
    const isValidObject = additionalPoints
        && typeof additionalPoints === 'object'
        && !Array.isArray(additionalPoints);

    state.additionalPoints = {
        resistance: isValidObject ? normalizeAdditionalPoint(additionalPoints.resistance) : 0,
        strength: isValidObject ? normalizeAdditionalPoint(additionalPoints.strength) : 0,
        mind: isValidObject ? normalizeAdditionalPoint(additionalPoints.mind) : 0,
        agility: isValidObject ? normalizeAdditionalPoint(additionalPoints.agility) : 0
    };

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
    migrateAdditionalPoints(newState);

    Object.assign(characterState, newState);
}