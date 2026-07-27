import { database, ref, set, push, update, onValue } from "../database/database.js";
import { getUserData } from "./auth-service.js";

import { query, orderByChild, onChildAdded, equalTo } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

import { auth, onAuthStateChanged } from "../database/firebase-config.js";

const handleSaveButton = document.getElementById('save-button');
const handleReloadButton = document.getElementById('reload-button');

export async function saveCharacter(user, characterData) {
    try {
        let characterRef;
        let characterId = characterData.id;

        if (!characterId) {
            const charactersRef = ref(database, 'characters/');
            characterRef = push(charactersRef);
            characterId = characterRef.key;
        } else {
            characterRef = ref(database, `characters/${characterId}`);
        }

        const characterToSave = {
            id: characterId,
            userId: user.uid,
            sessionId: characterData.sessionId || null,
            campaignRole: characterData.campaignRole || "Player",
            points: characterData.points || 0,
            name: characterData.name || "",
            class: characterData.class || "",
            race: characterData.race || "",
            hp: characterData.hp || 0,
            cash: characterData.cash || 0,
            attributes: characterData.attributes || {},
            inventory: characterData.inventory || [],
            capturedPokemon: characterData.capturedPokemon || [],
            team: characterData.team || [],
            diary: characterData.diary || ""
        };

        await set(characterRef, characterToSave);

        console.log("Character created sucessfully! ID:", characterRef.key);
        return characterToSave;

    } catch (error) {
        console.error("Error on creating character:", error.code, error.message);
        throw error;
    }
}

export async function loadCharacter(characterRef, userId) {
    const orderedQuery = query(characterRef, orderByChild('userId'), equalTo(userId));

    onChildAdded(orderedQuery, (snapshot) => {
        const character = snapshot.val();
        console.log("Character found:", snapshot.key, character);

        setCharacterData(character);
    });
}

function setCharacterData(data) {
    console.log("Set player data.", data);
    characterState = data;
    setPlayerInfo();
    renderAllPokemon();
}

handleSaveButton.addEventListener('click', async () => {
    handleSaveButton.disabled = true;
    handleSaveButton.textContent = "Saving...";

    try {
        const user = await getUserData();
        const savedCharacter = await saveCharacter(user, characterState);

        characterState.id = savedCharacter.id;

        alert("Character Saved!");
    } catch (error) {
        console.error("Error on saving character:", error);
        alert("Error on saving character.");
    } finally {
        handleSaveButton.disabled = false;
        handleSaveButton.textContent = "Save changes";
    }
});

handleReloadButton.addEventListener('click', async () => {
    handleReloadButton.disabled = true;
    handleReloadButton.textContent = "Reloading...";

    try {
        const user = await getUserData();

        if (!user) {
            alert("Nenhum usuário logado!");
            return;
        }

        const characterRef = ref(database, 'characters/');

        loadCharacter(characterRef, user.uid);

        alert("Character loaded!");
    } catch (error) {
        console.error("Error on reloading character:", error);
        alert("Error on reloading character.");
    } finally {
        handleReloadButton.disabled = false;
        handleReloadButton.textContent = "Reload";
    }
});

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        const characterRef = ref(database, 'characters/');
        loadCharacter(characterRef, auth.currentUser.uid);
    });
});