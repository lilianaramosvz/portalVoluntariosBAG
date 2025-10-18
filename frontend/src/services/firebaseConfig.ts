//frontend\src\services\firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
};

//validar configuración
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error(
    "❌ ERROR: No se encontró configuración de Firebase.\n" +
      "Verifica tu archivo .env y asegúrate de tener las claves EXPO_PUBLIC_ definidas."
  );
}

export const app = initializeApp(firebaseConfig);

/*export const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6LfN_u0rAAAAAN8l7XQEiG6Gjo4q6Cv_L0NSTvih"), // tu clave pública
  isTokenAutoRefreshEnabled: true,
});
*/

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

console.log("✅ Firebase inicializado correctamente con App Check activo.");
