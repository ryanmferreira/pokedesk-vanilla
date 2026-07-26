import { ref, set, push, getDatabase, update, onValue } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

import { app } from "./firebase-config.js";

const database = getDatabase(app);

export { database, ref, set, push, update, onValue };