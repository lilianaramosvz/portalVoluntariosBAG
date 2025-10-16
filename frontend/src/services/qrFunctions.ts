// frontend/src/services/qrFunctions.ts
// Thin wrapper that calls backend callable functions (server-side generation)
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './firebaseConfig';
import { getAuth } from 'firebase/auth';

const functions = getFunctions(app);

export async function createAccessToken() {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Usuario no autenticado');

  const callable = httpsCallable(functions, 'createAccessToken');
  const res = await callable({});
  return res.data; // { tokenId, token, expiresAt }
}

export async function redeemAccessToken(token: string) {
  const callable = httpsCallable(functions, 'redeemAccessToken');
  const res = await callable({ token });
  return res.data;
}
