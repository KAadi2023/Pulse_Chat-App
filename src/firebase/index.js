import { initializeApp, credential as _credential } from "firebase-admin";

import serviceAccount from './serviceAccountKeys.json';

initializeApp({
    credential: _credential.cert(serviceAccount)
})

export default {firebase}