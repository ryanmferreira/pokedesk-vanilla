/* ==========================================================================
   LEVEL & XP RULES
   ========================================================================== */
function getXpQuantity(level, velocity) {
    var levelSpeed = velocity.toLowerCase();

    switch (levelSpeed) {
        case "fast": return 0.8 * level * level;
        case "medium": return 1.0 * level * level;
        case "slow": return 1.25 * level * level;
        case "pseudo-legendary": return 1.5 * level * level;
        case "legendary": return 2.0 * level * level;
        default: return 1.0 * level * level;
    }
}

function calculateLevel(xpTotal, velocityParam = null) {
    var velocity = (velocityParam || pokeLevelVelocity?.value || 'fast').toLowerCase();
    var xpInput = parseInt(xpTotal, 10) || 0;

    var baseXp = getXpQuantity(5, velocity);
    var totalXp = baseXp + xpInput;

    let level = 5;

    switch (velocity) {
        case "fast": level = Math.floor(Math.sqrt(totalXp / 0.8)); break;
        case "medium": level = Math.floor(Math.sqrt(totalXp / 1.0)); break;
        case "slow": level = Math.floor(Math.sqrt(totalXp / 1.25)); break;
        case "pseudo-legendary": level = Math.floor(Math.sqrt(totalXp / 1.5)); break;
        case "legendary": level = Math.floor(Math.sqrt(totalXp / 2.0)); break;
        default: level = Math.floor(Math.sqrt(totalXp / 1.0)); break;
    }

    return Math.max(5, level);
}

function updateLevel() {
    if (!totalXP) {
        return;
    }

    const currentXP = totalXP.value;
    const level = calculateLevel(currentXP);

    if (currentLvlDisplay) {
        currentLvlDisplay.textContent = level;
    }
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