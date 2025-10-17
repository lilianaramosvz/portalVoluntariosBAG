// src/services/firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";


// Lee las credenciales desde las variables de entorno
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
};

// Inicializa Firebase y exporta la instancia de la app
export const app = initializeApp(firebaseConfig);

// Inicializa App Check con reCAPTCHA v3
export const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6LfN_u0rAAAAAN8l7XQEiG6Gjo4q6Cv_L0NSTvih"), // Clave del sitio reCAPTCHA v3
  isTokenAutoRefreshEnabled: true, // Mantiene el token actualizado automáticamente
});