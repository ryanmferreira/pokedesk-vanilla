import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js"
import { ref, set, push, update, onValue, query, orderByChild, onChildAdded, equalTo } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

import { auth } from "../database/firebase-config.js";
import { database } from "/js/database/database.js";
import { getUserData } from "/js/service/auth-service.js";
import { getSession, getLastSessions } from "./session-service.js";

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
            sessionId: getSession(),
            lastSaved: Date.now(),
            image: characterData.image || "",
            campaignRole: characterData.campaignRole || "Player",
            points: characterData.points || 8,
            name: characterData.name || "",
            class: characterData.class || "",
            race: characterData.race || "",
            hp: characterData.hp || 0,
            cash: characterData.cash || 0,
            attributes: characterData.attributes || {},
            inventory: characterData.inventory || [],
            capturedPokemon: characterData.capturedPokemon || [],
            team: characterData.team || [],
            diary: characterData.diary || []
        };

        await set(characterRef, characterToSave);

        console.log("Character created sucessfully! ID:", characterRef.key);
        return characterToSave;

    } catch (error) {
        console.error("Error on creating character:", error.code, error.message);
        throw error;
    }
}

export async function loadCharacter(userId) {
    const currentSession = getSession();

    const { sessions } = getLastSessions();

    const characterRef = ref(database, 'characters/');

    console.log("Current session: ", currentSession);
    console.log(sessions);

    if (currentSession != null && currentSession !== "") {
        const orderedQuery = query(characterRef, orderByChild('userId'), equalTo(userId));

        console.log("Session: ", currentSession);

        onChildAdded(orderedQuery, (snapshot) => {
            const character = snapshot.val();

            if (character && character.sessionId === currentSession) {
                console.log("Character found:", snapshot.key, character);
                setCharacterData(character);
            }
        });
    }
    else {
        window.location.href = "/index.html";
    }
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

        window.updateLastSaved();
        
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

        loadCharacter(user.uid);

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
        loadCharacter(auth.currentUser.uid);
    });
});