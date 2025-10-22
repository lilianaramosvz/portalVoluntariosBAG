// frontend/src/services/qrFunctions.ts

import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "./firebaseConfig";
import { getAuth } from "firebase/auth";

const functions = getFunctions(app, "us-central1");

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

//crea un token de acceso QR para el guardia actual
export async function createAccessToken(): Promise<AccessTokenResponse> {
  const user = getAuth().currentUser;
  if (!user) {
    throw new Error("Usuario no autenticado");
  }

  const callable = httpsCallable<void, AccessTokenResponse>(
    functions,
    "createAccessToken"
  );

  const result = await callable();
  return result.data;
}

//Valida y marca como usado un token de acceso QR, el backend valida que el usuario sea guardia, que exista, que no haya expirado y que no esté ya usado

export async function redeemAccessToken(
  token: string
): Promise<RedeemTokenResponse> {
  const user = getAuth().currentUser;
  if (!user) {
    throw new Error("Usuario no autenticado");
  }

  const callable = httpsCallable<{ token: string }, RedeemTokenResponse>(
    functions,
    "redeemAccessToken"
  );

  const result = await callable({ token });
  return result.data;
}
