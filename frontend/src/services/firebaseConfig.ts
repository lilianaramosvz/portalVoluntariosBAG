// src/services/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { Platform } from 'react-native';

// Read credentials from environment variables. Keep these the same as production
// but use an explicit flag to connect to local emulators.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
};

export const app = initializeApp(firebaseConfig);

// SDK instances
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Enable emulators only when explicitly requested. This avoids changing production behavior.
// Use EXPO_USE_FIREBASE_EMULATOR to enable Firestore+Functions emulators.
// Use EXPO_USE_FIREBASE_EMULATOR to enable Firestore+Functions emulators.
const USE_EMULATOR = process.env.EXPO_USE_FIREBASE_EMULATOR === 'true';

if (USE_EMULATOR) {
  // Choose host depending on platform. Android emulator uses 10.0.2.2
  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

  // Firestore emulator (default port 8080)
  connectFirestoreEmulator(db, host, 8080);

  // Functions emulator (default port 5001)
  connectFunctionsEmulator(functions, host, 5001);

  // Helpful log during development
  // eslint-disable-next-line no-console
  console.log(`[firebase] connected to Firestore+Functions emulators on ${host}`);
}
