import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js"
import { ref, set, push, query, orderByChild, onChildAdded, equalTo } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

import { auth } from "../database/firebase-config.js";
import { database } from "/js/database/database.js";
import { getUserData } from "/js/service/auth-service.js";
import { showMessage } from "/js/components/message-modal.js";
import { getSession, getLastSessions } from "./session-service.js";
import { characterState, setCharacterState } from "../player/player-state.js";
import { setPlayerInfo } from "../player/player-management.js";
import { renderAllPokemon } from "../pokemon/pokemon-render.js";

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
            additionalPoints: characterData.additionalPoints || {},
            name: characterData.name || "",
            class: characterData.class || "",
            race: characterData.race || "",
            hp: characterData.hp || 0,
            cash: characterData.cash || 0,
            attributes: characterData.attributes || {},
            inventory: characterData.inventory || [],
            bag: characterData.bag || [],
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
    try {
        const currentSession = getSession();

        const { sessions } = getLastSessions();

        const characterRef = ref(database, 'characters/');

        console.log("Current session: ", currentSession);
        console.log(sessions);

        if (currentSession != null && currentSession !== "") {
            const orderedQuery = query(characterRef, orderByChild('userId'), equalTo(userId));

            console.log("Session: ", currentSession);

            onChildAdded(orderedQuery, snapshot => {
                try {
                    const character = snapshot.val();

                    if (character && character.sessionId === currentSession) {
                        console.log("Character found:", snapshot.key, character);
                        setCharacterData(character);
                    }
                } catch (error) {
                    console.error("Error displaying character:", error);
                    showMessage(`Could not display your character: ${error.message || error}`, { title: 'Character loading failed' });
                }
            }, error => {
                console.error("Error loading character:", error);
                showMessage(`Could not load your character: ${error.message || error}`, { title: 'Character loading failed' });
            });
        } else {
            window.location.href = "/";
        }
    } catch (error) {
        console.error("Error preparing character load:", error);
        await showMessage(`Could not load your character: ${error.message || error}`, { title: 'Character loading failed' });
    }
}

function setCharacterData(data) {
    console.log("Set player data.", data);
    setCharacterState(data);
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

        showMessage("Character Saved!", { title: 'Saved' });
    } catch (error) {
        console.error("Error on saving character:", error);
        await showMessage(`Could not save your character: ${error.message || error}`, { title: 'Save failed' });
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
            showMessage("Nenhum usuário logado!", { title: 'Error' });
            return;
        }

        await loadCharacter(user.uid);

        showMessage("Character loaded!", { title: 'Loaded' });
    } catch (error) {
        console.error("Error on reloading character:", error);
        await showMessage(`Could not reload your character: ${error.message || error}`, { title: 'Reload failed' });
    } finally {
        handleReloadButton.disabled = false;
        handleReloadButton.textContent = "Reload";
    }
});

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, user => {
        if (user) {
            loadCharacter(user.uid);
        }
    }, error => {
        console.error("Authentication state error:", error);
        showMessage(`Could not verify your account: ${error.message || error}`, { title: 'Authentication failed' });
    });
});