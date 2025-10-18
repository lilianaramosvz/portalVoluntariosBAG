// backend/functions/src/index.ts

import { onCall, HttpsError, CallableRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { logger } from "firebase-functions";

admin.initializeApp();

interface SetRoleData {
  email: string;
  role: "admin" | "superadmin" | "guardia" | "voluntario";
}

export const setUserRole = onCall<SetRoleData>(async (request: CallableRequest<SetRoleData>) => {
  const { email, role } = request.data;

  // 🔹 En la API moderna, la autenticación se accede con request.auth
  const auth = request.auth;

  if (!auth || !["admin", "superadmin"].includes(auth.token.role)) {
    throw new HttpsError(
      "permission-denied",
      "Esta función solo puede ser ejecutada por un administrador o superadministrador.",
    );
  }

  if (!email || !role) {
    throw new HttpsError(
      "invalid-argument",
      'La función debe ser llamada con los argumentos "email" y "role".',
    );
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { role });

    logger.info(`Rol asignado correctamente a ${email}: ${role}`);

    return {
      message: `Éxito. El usuario ${email} ahora tiene el rol de "${role}".`,
    };
  } catch (error: any) {
    logger.error("Error al asignar rol:", error);

    if (error.code === "auth/user-not-found") {
      throw new HttpsError("not-found", "El usuario con ese correo no existe.");
    }

    throw new HttpsError("internal", "Ocurrió un error inesperado al asignar el rol.");
  }
});
