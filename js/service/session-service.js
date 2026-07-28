import { database, ref, set, push } from "/js/database/database.js";
import { getUserData } from "/js/service/auth-service.js";

const createSessionButton = document.getElementById('create-session');
const createSessionNameInput = document.getElementById('create-session-name');

const joinSessionButton = document.getElementById('join-session');
const joinSessionNameInput = document.getElementById('join-session-name');

export let currentSession = "";

export async function createSession(sessionName) {
    try {
        const user = getUserData();

        if (!user) {
            return;
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

        setSession(sessionId);
        window.location.href = "../../pages/session.html";

        return sessionData;
    } catch (error) {
        console.error("Error creating session:", error);
        throw error;
    }
}

export async function joinSession(sessionId) {
    if (!sessionId) {
        alert("Enter a valid Session ID!");
        return;
    }

    setSession(sessionId);
    console.log("Sessão salva:", getSession());
    window.location.href = "../../pages/session.html";
}

createSessionButton?.addEventListener('click', () => {
    let value = createSessionNameInput.value;
    createSession(value);
});

joinSessionButton?.addEventListener('click', () => {
    let value = joinSessionNameInput.value;
    joinSession(value);
});

export function setSession(sessionId) {
    localStorage.setItem("currentSession", sessionId);
}

export function getSession() {
    return localStorage.getItem("currentSession") || "";
}

export function leaveSesion() {
    localStorage.removeItem("currentSession")
    window.location.href = "../../pages/home.html";
};