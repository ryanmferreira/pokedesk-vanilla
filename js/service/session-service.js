import { database } from "/js/database/database.js";
import { getUserData } from "/js/service/auth-service.js";
import { showMessage } from "/js/components/message-modal.js";

import { get, onValue, push, ref, set } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

const createSessionButton = document.getElementById('create-session');
const createSessionNameInput = document.getElementById('create-session-name');

const joinSessionButton = document.getElementById('join-session');
const joinSessionNameInput = document.getElementById('join-session-name');


export async function createSession(sessionName) {
    try {
        const user = getUserData();

        if (!user) {
            await showMessage("Sign in before creating a session.", { title: 'Sign in required' });
            return null;
        }

        const sessionsRef = ref(database, 'sessions/');
        const newSessionRef = push(sessionsRef);

        const sessionId = newSessionRef.key;

        const sessionData = {
            id: sessionId,
            name: sessionName || "Unnamed Session",
            owner: user.uid,
            createdAt: Date.now(),
            status: "active",
            players: {
                [user.uid]: true
            }
        };

        await set(newSessionRef, sessionData);

        console.log("session created succesfully! ID:", sessionId);

        await joinSession(sessionId);

        return sessionData;
    } catch (error) {
        console.error("Error creating session:", error);
        await showMessage(`Could not create the session: ${error.message || error}`, { title: 'Session creation failed' });
        return null;
    }
}

export async function getSessionInfo(sessionId) {
    const sessionRef = ref(database, 'sessions/' + sessionId);
    const snapshot = await get(sessionRef);

    if (snapshot.exists()) {
        return snapshot.val();
    }

    return null;
}

export async function joinSession(sessionId) {
    try {
        if (!sessionId) {
            await showMessage("Enter a valid Session ID!", { title: 'Invalid session' });
            return;
        }

        const user = getUserData();
        if (!user) {
            await showMessage("Sign in before joining a session.", { title: 'Sign in required' });
            return;
        }

        const sessionInfo = await getSessionInfo(sessionId);

        if (!sessionInfo) {
            await showMessage("Session not founded!", { title: 'Session not found' });
            return;
        }

        setSession(sessionId);

        let location;

        if (sessionInfo.owner === user.uid) {
            await showMessage("Entering as Game Master!", { title: 'Game Master' });
            location = "/pages/game-master";
        } else {
            location = "/pages/session";
        }

        console.log("Session saved:", getSession());

        window.location.href = location;
    } catch (error) {
        console.error("Error joining session:", error);
        await showMessage(`Could not join the session: ${error.message || error}`, { title: 'Session join failed' });
    }
}

export function getAllSessionCharacters(callback, onError = null) {
    const currentSessionId = getSession();
    const databaseRef = ref(database, 'characters/');

    return onValue(databaseRef, (snapshot) => {
        const sessionCharacters = [];

        snapshot.forEach((childSnapshot) => {
            const childData = childSnapshot.val();

            if (childData.sessionId === currentSessionId) {
                sessionCharacters.push({
                    id: childSnapshot.key,
                    ...childData
                });
            }
        });

        callback(sessionCharacters);
    }, error => {
        console.error("Error loading session characters:", error);
        if (onError) {
            onError(error);
            return;
        }

        showMessage(`Could not load session characters: ${error.message || error}`, { title: 'Character loading failed' });
    });
}

export function setSession(sessionId) {
    if (!sessionId || sessionId === "null" || sessionId === "undefined") {
        return;
    }

    setLastSessions(sessionId);

    localStorage.setItem("currentSession", sessionId);
}

export function setLastSessions(sessionId) {
    const { sessions, counter } = getLastSessions();

    const index = sessions.indexOf(sessionId);

    if (sessions.includes(sessionId) && index !== -1) {
        [sessions[index], sessions[0]] = [sessions[0], sessions[index]];

        for (let i = 0; i < sessions.length; i++) {
            localStorage.setItem(`lastSession-${i}`, sessions[i]);
        }

        return;
    }

    localStorage.setItem('lastSession-' + counter, sessionId);
    localStorage.setItem('lastSessionsCounter', counter + 1);
}

export function getLastSessions() {
    const counter = parseInt(localStorage.getItem('lastSessionsCounter')) || 0;
    const sessions = [];

    for (let i = 0; i < counter; i++) {
        let item = localStorage.getItem('lastSession-' + i);

        if (item) {
            sessions.push(item);
        }
    }

    return {
        counter: counter,
        sessions: sessions
    };
}

export function getSession() {
    return localStorage.getItem("currentSession") || "";
}

export function leaveSesion() {
    localStorage.removeItem("currentSession");
    window.location.href = "/pages/home";
};

createSessionButton?.addEventListener('click', () => {
    let value = createSessionNameInput.value;
    createSession(value);
});

joinSessionButton?.addEventListener('click', () => {
    let value = joinSessionNameInput.value;
    joinSession(value);
});