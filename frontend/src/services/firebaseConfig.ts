// frontend/src/services/firebaseConfig.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// ============================================
// CONFIGURACIÓN DE FIREBASE DESDE .env
// ============================================
// Nota: En Expo, las variables de entorno deben comenzar con EXPO_PUBLIC_

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// ============================================
// VALIDAR CONFIGURACIÓN
// ============================================

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error(
    '❌ ERROR CRÍTICO: Firebase no está configurado.\n' +
    'Asegúrate de que el archivo .env existe y tiene los valores correctos.\n' +
    'Archivo esperado: /frontend/.env'
  );
}

// ============================================
// INICIALIZAR FIREBASE
// ============================================

let app: any;
let auth: any;
let db: any;
let storage: any;
let functions: any;

try {
  // Inicializar la app
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase App inicializada');

  // Inicializar Auth
  auth = getAuth(app);
  console.log('✅ Firebase Auth inicializada');

  // Inicializar Firestore
  db = getFirestore(app);
  console.log('✅ Firestore inicializado');

  // Inicializar Storage
  storage = getStorage(app);
  console.log('✅ Firebase Storage inicializado');

  // Inicializar Functions
  functions = getFunctions(app);
  console.log('✅ Firebase Functions inicializado');

} catch (error) {
  console.error('❌ Error al inicializar Firebase:', error);
  throw error;
}

export { 
  app, 
  auth, 
  db, 
  storage, 
  functions 
};