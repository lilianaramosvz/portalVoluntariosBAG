// backend/functions/src/index.ts

import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { logger } from "firebase-functions";
import * as crypto from "crypto";
import { Timestamp } from "firebase-admin/firestore";

// Inicializa la app de Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Interfaces (Para seguridad de tipos)
interface SetRoleData {
  email: string;
  role: "admin" | "guardia" | "voluntario";
}

// Asigna roles personalizados a los usuarios
export const setUserRole = onCall<SetRoleData>(async (request) => {
  const { email, role } = request.data;

  if (!email || !role) {
    throw new HttpsError("invalid-argument", "Se requieren 'email' y 'role'.");
  }
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { role });
    logger.info(`Rol asignado a ${email}: ${role}`);
    return { message: `Éxito. El usuario ${email} ahora es ${role}.` };
  } catch (error: unknown) {
    logger.error("Error al asignar rol:", error);
    if (
      error instanceof Error &&
      (error as any).code === "auth/user-not-found"
    ) {
      throw new HttpsError("not-found", "El usuario con ese correo no existe.");
    }
    throw new HttpsError("internal", "No se pudo asignar el rol.");
  }
});

// Envia un código de recuperación de contraseña por correo
export const sendPasswordResetCode = onCall(async (request) => {
  const { email } = request.data;
  if (!email) {
    throw new HttpsError(
      "invalid-argument",
      "Debes proporcionar un correo electrónico."
    );
  }
  try {
    await admin.auth().getUserByEmail(email);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await db.collection("passwordResets").doc(email).set({
      code,
      createdAt: Timestamp.now(),
      used: false,
    });
    logger.info(`Código de recuperación para ${email}: ${code}`);
    return { message: `Código enviado correctamente a ${email}.` };
  } catch (error: unknown) {
    logger.error("Error en sendPasswordResetCode:", error);
    if (
      error instanceof Error &&
      (error as any).code === "auth/user-not-found"
    ) {
      throw new HttpsError("not-found", "No existe un usuario con ese correo.");
    }
    throw new HttpsError("internal", "Error al generar el código.");
  }
});

// Restablece la contraseña usando el código enviado por correo
export const resetPasswordWithCode = onCall(async (request) => {
  const { email, code, newPassword } = request.data;
  if (!email || !code || !newPassword) {
    throw new HttpsError("invalid-argument", "Faltan parámetros obligatorios.");
  }
  try {
    const docRef = db.collection("passwordResets").doc(email);
    const doc = await docRef.get();
    if (!doc.exists || doc.data()?.code !== code || doc.data()?.used) {
      throw new HttpsError(
        "not-found",
        "Código inválido, expirado o ya fue usado."
      );
    }
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(user.uid, { password: newPassword });
    await docRef.update({ used: true });
    return { message: "Contraseña actualizada correctamente." };
  } catch (error: unknown) {
    logger.error("Error al restablecer contraseña:", error);
    throw new HttpsError("internal", "No se pudo actualizar la contraseña.");
  }
});

// Crea un token de acceso QR para voluntarios
const QR_TOKEN_LENGTH = 12;
const QR_EXPIRY_SECONDS = 300;
const MAX_USES_PER_TOKEN = 1;

function generateToken(length = QR_TOKEN_LENGTH) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}

export const createAccessToken = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated.");
  }
  const uid = request.auth.uid;
  try {
    const userDoc = await db.collection("Usuarios").doc(uid).get();
    if (!userDoc.exists || userDoc.data()?.rol !== "voluntario") {
      throw new HttpsError(
        "permission-denied",
        "Only volunteers can generate tokens."
      );
    }
    const tokensRef = db.collection("qrCodes").doc();
    const token = generateToken();
    const now = Timestamp.now();
    const expiresAt = Timestamp.fromMillis(
      now.toMillis() + QR_EXPIRY_SECONDS * 1000
    );

    await tokensRef.set({
      token,
      createdBy: uid,
      createdAt: now,
      expiresAt,
      usedCount: 0,
      maxUses: MAX_USES_PER_TOKEN,
      active: true,
    });

    return { tokenId: tokensRef.id, token, expiresAt: expiresAt.toMillis() };
  } catch (error: unknown) {
    logger.error("[createAccessToken] Error:", error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "Failed to create access token.");
  }
});

// Canjea un token de acceso QR para registrar asistencia
export const redeemAccessToken = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated.");
  }
  const { token } = request.data;
  if (!token || typeof token !== "string") {
    throw new HttpsError("invalid-argument", "Token is required.");
  }

  const uid = request.auth.uid;
  try {
    const userDoc = await db.collection("Usuarios").doc(uid).get();
    if (!userDoc.exists || userDoc.data()?.rol !== "guardia") {
      throw new HttpsError(
        "permission-denied",
        "Only guards can redeem tokens."
      );
    }

    const tokensQuery = await db
      .collection("qrCodes")
      .where("token", "==", token)
      .limit(1)
      .get();
    if (tokensQuery.empty) {
      throw new HttpsError("not-found", "Invalid token.");
    }

    const tokenDoc = tokensQuery.docs[0];
    const tokenData = tokenDoc.data();
    const tokenRef = tokenDoc.ref;
    const now = Timestamp.now();

    if (
      !tokenData.active ||
      tokenData.expiresAt.toMillis() < now.toMillis() ||
      tokenData.usedCount >= tokenData.maxUses
    ) {
      throw new HttpsError(
        "failed-precondition",
        "Token is expired, used, or inactive."
      );
    }

    const volunteerDoc = await db
      .collection("Usuarios")
      .doc(tokenData.createdBy)
      .get();
    const asistenciaRef = db.collection("RegistroAsistencias").doc();

    await db.runTransaction(async (transaction) => {
      transaction.delete(tokenRef);
      transaction.set(asistenciaRef, {
        voluntarioId: tokenData.createdBy,
        voluntarioNombre: volunteerDoc.exists
          ? volunteerDoc.data()?.nombre
          : "Desconocido",
        fecha: now,
        registradoPor: uid,
      });
    });

    return { success: true, asistenciaId: asistenciaRef.id };
  } catch (error: unknown) {
    logger.error("[redeemAccessToken] Error:", error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "Failed to redeem access token.");
  }
});
