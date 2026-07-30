import { getDatabase } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js"
import { app } from "./firebase-config.js";

const database = getDatabase(app);

export { database };