import { database, ref, set } from "./database";

async function createSession(session) {
    set(ref(database, 'sessions/' + session.id), {
        name: session.name,
        owner: session.owner,
        users: session.users,
    });
}