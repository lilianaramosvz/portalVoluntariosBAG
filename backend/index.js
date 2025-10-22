// backend/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Inicializa la app de Firebase Admin
try {
  admin.initializeApp();
} catch (e) {
  // La app ya ha sido inicializada
}

exports.createAccessToken = require("./src/QrGeneration").createAccessToken;
exports.redeemAccessToken = require("./src/QrRedemption").redeemAccessToken;
