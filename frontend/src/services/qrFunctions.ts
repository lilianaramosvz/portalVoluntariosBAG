// frontend/src/services/qrFunctions.ts
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './firebaseConfig';
import { getAuth } from 'firebase/auth';

const functions = getFunctions(app, 'us-central1');

type AccessTokenResponse = {
  tokenId: string;
  token: string;
  expiresAt: number;
};

type RedeemTokenResponse = {
  success: boolean;
  tokenId: string;
  volunteer: {
    uid: string;
    name: string;
    email: string | null;
  } | null;
  redeemedAt: number;
  remainingUses: number;
};

/**
 * Creates a new QR access token for volunteer attendance
 * Backend validates user is volunteer and enforces rate limiting (4-minute cooldown)
 */
export async function createAccessToken(): Promise<AccessTokenResponse> {
  const user = getAuth().currentUser;
  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const callable = httpsCallable<void, AccessTokenResponse>(
    functions,
    'createAccessToken'
  );

  const result = await callable();
  return result.data;
}

/**
 * Redeems (validates and marks as used) a QR access token
 * Backend validates user is guard, token exists, not expired, and not already used
 * @param token - The QR code token string scanned from volunteer's screen
 */
export async function redeemAccessToken(
  token: string
): Promise<RedeemTokenResponse> {
  const user = getAuth().currentUser;
  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const callable = httpsCallable<{ token: string }, RedeemTokenResponse>(
    functions,
    'redeemAccessToken'
  );

  const result = await callable({ token });
  return result.data;
}

