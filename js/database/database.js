import { ref, set } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";

import { app } from "./firebase-config.js";

export const database = getDatabase(app);

export { ref, set };