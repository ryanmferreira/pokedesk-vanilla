export const levelVelocity = [
    "Fast", "Medium", "Slow", "Pseudo-legendary", "Legendary"
];

export const types = [
    "Normal", "Fire", "Water", "Electric", "Grass", "Ice",
    "Fighting", "Poison", "Ground", "Flying", "Psychic",
    "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel",
    "Fairy", "Cosmic", "Light"
];

const typeColors = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
    cosmic: "#7E6BFF",
    light: "#E8C547"
};

function getTypeColor(type) {
    return typeColors[(type || "").toLowerCase()] || "#6B7280";
}

function getReadableTextColor(hexColor) {
    const hex = (hexColor || "").replace("#", "");

    if (hex.length !== 6) {
        return "#FFFFFF";
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.6 ? "#362C22" : "#FFFFFF";
}

export function renderTypeBadges(...pokemonTypes) {
    return pokemonTypes
        .filter(type => type && type !== "None")
        .map(type => {
            const color = getTypeColor(type);
            const textColor = getReadableTextColor(color);
            const textShadow = textColor === "#FFFFFF"
                ? "0 1px 2px rgba(0, 0, 0, 0.45)"
                : "none";

            return `<span class="type-badge" style="--type-color: ${color}; --type-text-color: ${textColor}; --type-text-shadow: ${textShadow}">${type}</span>`;
        })
        .join("");
}

export const pokeballs = [
    "Ancient Ball", "Beast Ball", "Cosmic Ball", "Cherish Ball", "Custom Ball", "Dive Ball", "Divine Ball",
    "Dream Ball", "Dusk Ball", "Fast Ball", "Feather Ball", "Friend Ball", "Gigaton Ball", "Great Ball",
    "Heal Ball", "Heavy Ball", "Jet Ball", "Leaden Ball", "Level Ball", "Love Ball", "Lure Ball", "Luxury Ball", "Master Ball", "Moon Ball", "Nest Ball",
    "Net Ball", "Origin Ball", "Park Ball", "Poke Ball", "Premier Ball", "Quick Ball", "Repeat Ball",
    "Safari Ball", "Sport Ball", "Strange Ball", "Timer Ball", "Ultra Ball", "Wing Ball"
];

export const natures = [
    "Adamant", "Bashful", "Bold", "Brave", "Calm",
    "Careful", "Docile", "Gentle", "Hardy", "Hasty",
    "Impish", "Jolly", "Lax", "Lonely", "Mild",
    "Modest", "Naive", "Naughty", "Quiet", "Quirky",
    "Rash", "Relaxed", "Sassy", "Serious", "Timid"
];

export const abilities = [
    "Adaptability", "Aerilate", "Aftermath", "Air Lock", "Analytic", "Anger Point", "Anger Shell",
    "Anticipation", "Arena Trap", "Armor Tail", "Aroma Veil", "As One", "Aura Break", "Bad Dreams",
    "Ball Fetch", "Battery", "Battle Armor", "Battle Bond", "Beads of Ruin", "Beast Boost", "Berserk",
    "Big Pecks", "Blaze", "Bulletproof", "Cheek Pouch", "Chilling Neigh", "Chlorophyll", "Clear Body",
    "Cloud Nine", "Color Change", "Comatose", "Commander", "Competitive", "Compound Eyes", "Contrary",
    "Corrosion", "Costar", "Cotton Down", "Cud Chew", "Curious Medicine", "Cursed Body", "Cute Charm",
    "Damp", "Dancer", "Dark Aura", "Dauntless Shield", "Dazzling", "Defeatist", "Defiant", "Delta Stream",
    "Desolate Land", "Disguise", "Download", "Dragon's Maw", "Dragonize", "Drizzle", "Drought", "Dry Skin",
    "Early Bird", "Earth Eater", "Effect Spore", "Electric Surge", "Electromorphosis", "Embody Aspect",
    "Emergency Exit", "Fairy Aura", "Filter", "Flame Body", "Flare Boost", "Flash Fire", "Flower Gift",
    "Flower Veil", "Fluffy", "Forecast", "Forewarn", "Friend Guard", "Frisk", "Full Metal Body", "Fur Coat",
    "Gale Wings", "Galvanize", "Gluttony", "Good as Gold", "Gooey", "Gorilla Tactics", "Grass Pelt",
    "Grassy Surge", "Grim Neigh", "Guard Dog", "Gulp Missile", "Guts", "Hadron Engine", "Harvest", "Healer",
    "Heatproof", "Heavy Metal", "Honey Gather", "Hospitality", "Huge Power", "Hunger Switch", "Hustle",
    "Hydration", "Hyper Cutter", "Ice Body", "Ice Face", "Ice Scales", "Illuminate", "Illusion", "Immunity",
    "Imposter", "Infiltrator", "Innards Out", "Inner Focus", "Insomnia", "Intimidate", "Intrepid Sword",
    "Iron Barbs", "Iron Fist", "Justified", "Keen Eye", "Klutz", "Leaf Guard", "Levitate", "Libero",
    "Light Metal", "Lightning Rod", "Limber", "Lingering Aroma", "Liquid Ooze", "Liquid Voice", "Long Reach",
    "Magic Bounce", "Magic Guard", "Magician", "Magma Armor", "Magnet Pull", "Marvel Scale", "Mega Launcher",
    "Mega Sol", "Merciless", "Mimicry", "Mind's Eye", "Minus", "Mirror Armor", "Misty Surge", "Mold Breaker",
    "Moody", "Motor Drive", "Moxie", "Multiscale", "Multitype", "Mummy", "Mycelium Might", "Natural Cure",
    "Neuroforce", "Neutralizing Gas", "No Guard", "Normalize", "Oblivious", "Opportunist", "Orichalcum Pulse",
    "Overcoat", "Overgrow", "Own Tempo", "Parental Bond", "Pastel Veil", "Perish Body", "Pickpocket",
    "Pickup", "Pixilate", "Plus", "Poison Heal", "Poison Point", "Poison Puppeteer", "Poison Touch",
    "Power Construct", "Power of Alchemy", "Power Spot", "Prankster", "Pressure", "Primordial Sea",
    "Prism Armor", "Propeller Tail", "Protean", "Protosynthesis", "Psychic Surge", "Punk Rock", "Pure Power",
    "Purifying Salt", "Quark Drive", "Queenly Majesty", "Quick Draw", "Quick Feet", "Rain Dish", "Rattled",
    "Receiver", "Reckless", "Refrigerate", "Regenerator", "Ripen", "Rivalry", "RKS System", "Rock Head",
    "Rocky Payload", "Rough Skin", "Run Away", "Sand Force", "Sand Rush", "Sand Spit", "Sand Stream",
    "Sand Veil", "Sap Sipper", "Schooling", "Scrappy", "Screen Cleaner", "Seed Sower", "Serene Grace",
    "Shadow Shield", "Shadow Tag", "Sharpness", "Shed Skin", "Sheer Force", "Shell Armor", "Shield Dust",
    "Shields Down", "Simple", "Skill Link", "Slow Start", "Slush Rush", "Sniper", "Snow Cloak",
    "Snow Warning", "Solar Power", "Solid Rock", "Soul-Heart", "Soundproof", "Speed Boost", "Stakeout",
    "Stall", "Stalwart", "Stamina", "Stance Change", "Static", "Steadfast", "Steam Engine", "Steelworker",
    "Steely Spirit", "Stench", "Sticky Hold", "Storm Drain", "Strong Jaw", "Sturdy", "Suction Cups",
    "Super Luck", "Supersweet Syrup", "Supreme Overlord", "Surge Surfer", "Swarm", "Sweet Veil",
    "Swift Swim", "Sword of Ruin", "Symbiosis", "Synchronize", "Tablets of Ruin", "Tangled Feet",
    "Tangling Hair", "Technician", "Telepathy", "Tera Shell", "Tera Shift", "Teraform Zero", "Teravolt",
    "Thermal Exchange", "Thick Fat", "Tinted Lens", "Torrent", "Tough Claws", "Toxic Boost", "Toxic Chain",
    "Toxic Debris", "Trace", "Transistor", "Triage", "Truant", "Turboblaze", "Unaware", "Unburden",
    "Unnerve", "Unseen Fist", "Vessel of Ruin", "Victory Star", "Vital Spirit", "Volt Absorb",
    "Wandering Spirit", "Water Absorb", "Water Bubble", "Water Compaction", "Water Veil", "Weak Armor",
    "Well-Baked Body", "White Smoke", "Wimp Out", "Wind Power", "Wind Rider", "Wonder Guard",
    "Wonder Skin", "Zen Mode", "Zero to Hero"
];

export const populateSelect = (selectId, items, includeNone = false) => {
    const select = document.getElementById(selectId);

    if (!select) {
        return
    };

    if (includeNone) {
        const noneOpt = document.createElement("option");
        noneOpt.textContent = "None";
        select.appendChild(noneOpt);
    }

    for (const item of items) {
        const opt = document.createElement("option");
        opt.textContent = item;
        select.appendChild(opt);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    populateSelect("poke-type-1", types);
    populateSelect("poke-type-2", types, true);
    populateSelect("poke-ability", abilities);
    populateSelect("poke-nature", natures);
    populateSelect("poke-level-velocity", levelVelocity);
    populateSelect("poke-pokeball-used", pokeballs);
});

export function loadAttackType() {
    for (let i = 0; i < 4; i++) {
        let attackTypeId = `attack-type-${i}`;
        populateSelect(attackTypeId, types);
    }
}

window.populateSelect = populateSelect;
window.loadAttackType = loadAttackType;