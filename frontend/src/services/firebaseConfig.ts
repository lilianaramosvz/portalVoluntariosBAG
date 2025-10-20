// frontend/src/services/firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// ✅ Configuración de Firebase desde variables de entorno
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// ❌ Validación rápida de configuración
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error(
    "❌ ERROR: No se encontró configuración de Firebase.\n" +
      "Verifica tu archivo .env y asegúrate de tener las claves EXPO_PUBLIC_ definidas."
  );
}

// ✅ Inicializar app
export const app = initializeApp(firebaseConfig);


// ✅ Inicializar otros servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, "us-central1"); // ejemplo: reset password

// ⚙️ App Check opcional
/*
export const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("TU_CLAVE_PUBLICA_RECAPTCHA"),
  isTokenAutoRefreshEnabled: true,
});
*/

console.log("✅ Firebase inicializado correctamente para Expo Managed Workflow");
