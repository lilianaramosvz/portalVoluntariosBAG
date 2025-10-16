// backend/Functions/src/QrGeneration.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');

const TTL_SECONDS = 300;

function generateToken(len = 10) {
  return crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
}

exports.createAccessToken = functions.https.onCall(async (data, context) => {
  if (!context || !context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  }

  try {
    const uid = context.auth.uid;
    const nowMs = Date.now();
    const expiresAt = admin.firestore.Timestamp.fromMillis(nowMs + TTL_SECONDS * 1000);

    const token = generateToken(12);
    const docRef = await admin.firestore().collection('qrCodes').add({
      token, 
      createdBy: uid,
      createdAt: admin.firestore.Timestamp.fromMillis(nowMs),
      expiresAt,
      usedCount: 0,
      maxUses: 1,
      active: true
    });

    return { tokenId: docRef.id, token, expiresAt: expiresAt.toMillis() };
  } catch (err) {
    console.error('createAccessToken failed', err);
    throw new functions.https.HttpsError('internal', 'Unable to create access token.');
  }
});