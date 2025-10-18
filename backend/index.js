// backend/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin once
try {
  admin.initializeApp();
} catch (e) {
  // ignore if already initialized in emulator or tests
}

// Re-export functions implemented in src/
exports.createAccessToken = require('./src/QrGeneration').createAccessToken;
exports.redeemAccessToken = require('./src/QrRedemption').redeemAccessToken;
