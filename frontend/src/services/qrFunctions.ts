// frontend/src/services/qrFunctions.ts
// Thin wrapper that calls backend callable functions (server-side generation)
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './firebaseConfig';
import { getAuth } from 'firebase/auth';

const functions = getFunctions(app, "us-central1");

type AccessTokenResponse = {
  tokenId?: string;
  token?: string;
  expiresAt?: number | string | null;
  [key: string]: any;
};

export async function createAccessToken(): Promise<AccessTokenResponse> {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Usuario no autenticado');

  try {
    console.log('[qrFunctions] createAccessToken called by user:', user.uid);
    const callable = httpsCallable(functions, 'createAccessToken');
    const res = await callable({});

    // Log raw response for debugging when data is unknown
    // eslint-disable-next-line no-console
    console.log('[qrFunctions] createAccessToken raw response:', res);

    const data: unknown = res.data;

    // Defensive check and fallback
    if (data && typeof data === 'object') {
      return data as AccessTokenResponse;
    }

    // If data is not the expected shape, return a helpful object for debugging
    return { token: undefined, tokenId: undefined, expiresAt: null, raw: data };
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('[qrFunctions] createAccessToken error', err);
    throw err;
  }
}

export async function redeemAccessToken(token: string) {
  try {
    const callable = httpsCallable(functions, 'redeemAccessToken');
    const res = await callable({ token });
    // eslint-disable-next-line no-console
    console.log('[qrFunctions] redeemAccessToken raw response:', res);
    return res.data;
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('[qrFunctions] redeemAccessToken error', err);
    throw err;
  }
}
