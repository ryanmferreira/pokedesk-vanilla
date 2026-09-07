import { characterState } from "../player/player-state.js";

/* ==========================================================================
   LEVEL & XP RULES
   ========================================================================== */

const pokeLevelVelocity = document.getElementById('poke-level-velocity');
const totalXP = document.getElementById('poke-total-xp');
const xpToAddInput = document.getElementById('xp-to-add');
const currentLvlDisplay = document.getElementById('current-level');

export function getMaxHp(pokemon) {
    if (!pokemon || !pokemon.status) return 10;
    let { level } = calculateLevel(pokemon.xp, pokemon.levelSpeed);

    return Math.floor(0.01 * ((pokemon.status.hp || 0) * 2) * level) + level + 10;
}

export function getVelocityModifier(velocity) {
    switch ((velocity || 'fast').toLowerCase()) {
        case "fast": return 0.8;
        case "medium": return 1.0;
        case "slow": return 1.25;
        case "pseudo-legendary": return 1.5;
        case "legendary": return 2.0;
        default: return 1.0;
    }
}

export function getXpToNextLevel(currentLevel, modifier) {
    return Math.floor(modifier * (100 + currentLevel * 20));
}

export function getBaseXpForLevel(targetLevel, modifier) {
    let totalXp = 0;

    for (let i = 1; i < targetLevel; i++) {
        totalXp += getXpToNextLevel(i, modifier);
    }

    return totalXp;
}

export function calculateLevel(xpInputTotal, velocityParam = null) {
    const velocityEl = pokeLevelVelocity || document.getElementById('poke-level-velocity');
    const modifier = getVelocityModifier(velocityParam || velocityEl?.value);

    const xpInput = parseInt(xpInputTotal, 10) || 0;

    const baseXpForLevel5 = getBaseXpForLevel(5, modifier);

    let absoluteTotalXp = baseXpForLevel5 + xpInput;

    let level = 1;
    let costForNextLevel = getXpToNextLevel(level, modifier);

    while (absoluteTotalXp >= costForNextLevel) {
        absoluteTotalXp -= costForNextLevel;
        level++;
        costForNextLevel = getXpToNextLevel(level, modifier);
    }

    return {
        level: level,
        currentXpInLevel: absoluteTotalXp,
        costForNextLevel: costForNextLevel
    };
}

export function addXP() {
    const totalXpEl = totalXP || document.getElementById('poke-total-xp');
    const xpToAddEl = xpToAddInput || document.getElementById('xp-to-add');

    if (!totalXpEl || !xpToAddEl) {
        return;
    }

    const currentTotal = parseInt(totalXpEl.value, 10) || 0;
    const addedXP = parseInt(xpToAddEl.value, 10) || 0;

    totalXpEl.value = currentTotal + addedXP;
    xpToAddEl.value = '';

    updateLevel();
}

export function updateLevel() {
    const totalXpEl = totalXP || document.getElementById('poke-total-xp');
    const lvlDisplayEl = currentLvlDisplay || document.getElementById('current-level');

    if (!totalXpEl) {
        return;
    }

    const currentXP = totalXpEl.value;
    const { level } = calculateLevel(currentXP);

    if (lvlDisplayEl) {
        lvlDisplayEl.textContent = level;
    }
}

window.getMaxHp = getMaxHp;
window.getVelocityModifier = getVelocityModifier;
window.getXpToNextLevel = getXpToNextLevel;
window.getBaseXpForLevel = getBaseXpForLevel;
window.calculateLevel = calculateLevel;
window.addXP = addXP;
window.updateLevel = updateLevel;