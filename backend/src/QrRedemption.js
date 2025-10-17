const { onCall, HttpsError } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const { Timestamp } = require('firebase-admin/firestore');

/**
 * Redeems (validates and marks as used) a QR access token
 * Security:
 * - Requires Firebase Authentication
 * - Only guards can redeem tokens
 * - Validates token exists, not expired, not already used
 * TODO: Add App Check verification
 */
exports.redeemAccessToken = onCall(
  {
    region: 'us-central1',
    cors: true,
    invoker: 'public',
    // consumeAppCheckToken: true, // TODO: Enable for production
  },
  async (request) => {
    const { auth, data } = request;

    // Verify user is authenticated
    if (!auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated.');
    }

    // Validate input
    const { token } = data;
    if (!token || typeof token !== 'string') {
      throw new HttpsError('invalid-argument', 'Token is required.');
    }

    const uid = auth.uid;
    const db = admin.firestore();

    try {
      // Verify user role - only guards can redeem QR codes
      const userDoc = await db.collection('Usuarios').doc(uid).get();
      
      if (!userDoc.exists) {
        throw new HttpsError('not-found', 'User profile not found.');
      }

      const userData = userDoc.data();
      const userRole = userData.rol || userData.role;

      if (userRole !== 'guardia') {
        throw new HttpsError(
          'permission-denied',
          'Only guards can redeem access tokens.'
        );
      }

      // Find and validate token in transaction
      const result = await db.runTransaction(async (transaction) => {
        // Query for the token
        const tokensQuery = await db.collection('qrCodes')
          .where('token', '==', token)
          .limit(1)
          .get();

        if (tokensQuery.empty) {
          throw new HttpsError('not-found', 'Invalid token.');
        }

        const tokenDoc = tokensQuery.docs[0];
        const tokenData = tokenDoc.data();
        const tokenRef = tokenDoc.ref;
        const now = Timestamp.now();

        // Validate token is active
        if (!tokenData.active) {
          throw new HttpsError('failed-precondition', 'Token has been deactivated.');
        }

        // Validate token not expired
        if (tokenData.expiresAt.toMillis() < now.toMillis()) {
          throw new HttpsError('failed-precondition', 'Token has expired.');
        }

        // Validate token not already fully used
        if (tokenData.usedCount >= tokenData.maxUses) {
          throw new HttpsError('failed-precondition', 'Token has already been used.');
        }

        // Update token - increment used count
        const newUsedCount = tokenData.usedCount + 1;
        const updates = {
          usedCount: newUsedCount,
          lastUsedAt: now,
          lastUsedBy: uid,
        };

        // Deactivate if max uses reached
        if (newUsedCount >= tokenData.maxUses) {
          updates.active = false;
        }

        transaction.update(tokenRef, updates);

        // Get volunteer info for response
        const volunteerDoc = await transaction.get(
          db.collection('Usuarios').doc(tokenData.createdBy)
        );

        return {
          success: true,
          tokenId: tokenDoc.id,
          volunteer: volunteerDoc.exists ? {
            uid: tokenData.createdBy,
            name: volunteerDoc.data().nombre || 'Unknown',
            email: volunteerDoc.data().correo || volunteerDoc.data().email || null,
          } : null,
          redeemedAt: now.toMillis(),
          remainingUses: tokenData.maxUses - newUsedCount,
        };
      });

      return result;
    } catch (error) {
      console.error('[redeemAccessToken] Error:', error);
      if (error instanceof HttpsError) throw error;
      throw new HttpsError('internal', 'Failed to redeem access token.');
    }
  }
);
