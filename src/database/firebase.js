// src/database/firebase.js
const admin = require("firebase-admin");
const path = require("path");

// Agora o JSON está na raiz do projeto
const serviceAccount = require(path.join(__dirname, "../../serviceAccountKey.json"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

module.exports = db;
