/* ==========================================================================
   LEVEL & XP RULES
   ========================================================================== */

function getMaxHp(pokemon) {
    let { level } = calculateLevel(pokemon.xp, pokemon.levelSpeed)
    return (pokemon.status.hp / 5) + level;
}

function getVelocityModifier(velocity) {
    switch ((velocity || 'fast').toLowerCase()) {
        case "fast": return 0.8;
        case "medium": return 1.0;
        case "slow": return 1.25;
        case "pseudo-legendary": return 1.5;
        case "legendary": return 2.0;
        default: return 1.0;
    }
}

function getXpToNextLevel(currentLevel, modifier) {
    return Math.floor(modifier * currentLevel * currentLevel);
}

function getBaseXpForLevel(targetLevel, modifier) {
    let totalXp = 0;

    for (let i = 1; i < targetLevel; i++) {
        totalXp += getXpToNextLevel(i, modifier);
    }

    return totalXp;
}

function calculateLevel(xpInputTotal, velocityParam = null) {
    const modifier = getVelocityModifier(velocityParam || pokeLevelVelocity?.value);
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

function addXP() {
    if (!totalXP || !xpToAddInput) {
        return;
    }

    const currentTotal = parseInt(totalXP.value, 10) || 0;
    const addedXP = parseInt(xpToAddInput.value, 10) || 0;

    totalXP.value = currentTotal + addedXP;
    xpToAddInput.value = '';

    updateLevel();
}

function updateLevel() {
    if (!totalXP) {
        return;
    }

    const currentXP = totalXP.value;
    const { level } = calculateLevel(currentXP)

    if (currentLvlDisplay) {
        currentLvlDisplay.textContent = level;
    }
}