const { onCall, HttpsError } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const crypto = require('crypto');
const { Timestamp } = require('firebase-admin/firestore');

const QR_TOKEN_LENGTH = 12;
const QR_EXPIRY_SECONDS = 300; // 5 minutes
const MAX_USES_PER_TOKEN = 1;
const COOLDOWN_SECONDS = 240; // 4 minutes - prevents spam while allowing early renewal

/**
 * Generates a cryptographically secure random token
 * @param {number} length - Desired token length
 * @returns {string} Hexadecimal token string
 */
function generateToken(length = QR_TOKEN_LENGTH) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

/**
 * Creates a QR access token for volunteer attendance tracking
 * Security: 
 * - Requires Firebase Authentication
 * - Only volunteers can generate tokens
 * TODO: Add App Check verification
 */
exports.createAccessToken = onCall(
  {
    region: 'us-central1',
    cors: true,
    invoker: 'public',
    // consumeAppCheckToken: true, // TODO: Enable for production
  },
  async (request) => {
    const { auth } = request;

    // Verify user is authenticated
    if (!auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated.');
    }

    const uid = auth.uid;
    const db = admin.firestore();

    try {
      // Verify user role - only volunteers can generate QR codes
      const userDoc = await db.collection('Usuarios').doc(uid).get();
      
      if (!userDoc.exists) {
        throw new HttpsError('not-found', 'User profile not found.');
      }

      const userData = userDoc.data();
      const userRole = userData.rol || userData.role;

      if (userRole !== 'voluntario') {
        throw new HttpsError(
          'permission-denied',
          'Only volunteers can generate access tokens.'
        );
      }

      // Rate limiting: Check if user generated a QR code too recently
      const lastQRQuery = await db.collection('qrCodes')
        .where('createdBy', '==', uid)
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();

      if (!lastQRQuery.empty) {
        const lastQRData = lastQRQuery.docs[0].data();
        const lastQRTime = lastQRData.createdAt.toMillis();
        const timeSinceLastQR = Date.now() - lastQRTime;
        const cooldownMs = COOLDOWN_SECONDS * 1000;

        if (timeSinceLastQR < cooldownMs) {
          const remainingSeconds = Math.ceil((cooldownMs - timeSinceLastQR) / 1000);
          const minutes = Math.floor(remainingSeconds / 60);
          const seconds = remainingSeconds % 60;
          
          const timeMessage = minutes > 0 
            ? `${minutes} minuto${minutes > 1 ? 's' : ''} y ${seconds} segundo${seconds !== 1 ? 's' : ''}`
            : `${seconds} segundo${seconds !== 1 ? 's' : ''}`;

          throw new HttpsError(
            'resource-exhausted',
            `Por favor espera ${timeMessage} antes de generar un nuevo código QR.`
          );
        }
      }

      // Create token in Firestore transaction
      const tokensRef = db.collection('qrCodes').doc();
      const nowMs = Date.now();
      const expiresAt = Timestamp.fromMillis(nowMs + QR_EXPIRY_SECONDS * 1000);

      const result = await db.runTransaction(async (transaction) => {
        const token = generateToken(QR_TOKEN_LENGTH);
        const createdAt = Timestamp.fromMillis(nowMs);

        transaction.set(tokensRef, {
          token,
          createdBy: uid,
          createdAt,
          expiresAt,
          usedCount: 0,
          maxUses: MAX_USES_PER_TOKEN,
          active: true,
        });

        return {
          tokenId: tokensRef.id,
          token,
          expiresAt: expiresAt.toMillis(),
        };
      });

      return result;
    } catch (error) {
      console.error('[createAccessToken] Error:', error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError('internal', 'Failed to create access token.');
    }
  }
);
