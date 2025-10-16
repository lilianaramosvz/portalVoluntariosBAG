# Emulator testing guide

This guide shows the steps to run and test Firebase Cloud Functions, Firestore and Auth locally using the Firebase Emulator Suite.

Prerequisites
- Node.js and npm
- Firebase CLI installed globally: `npm install -g firebase-tools`
- From repo root run `npm install` in backend if you haven't already: `cd backend && npm install`

1) Start the emulators

Open a PowerShell window (recommended) and run:

```powershell
cd c:\Users\silvi\Desktop\Proyectos\DesarrolloMovil\portalVoluntariosBAG
# optional: run helper script
.\start-emulators.ps1
# or run directly
firebase emulators:start --only functions,firestore
```

The Functions emulator listens on port 5001 and Firestore on 8080 by default.

2) Point the frontend to emulators

In a new PowerShell window set the env var and start the app (Expo):

```powershell
$env:EXPO_USE_FIREBASE_EMULATOR='true'
cd c:\Users\silvi\Desktop\Proyectos\DesarrolloMovil\portalVoluntariosBAG\frontend
npm run start
```

Notes for Android emulator and physical devices
- Android emulator (AVD) uses host `10.0.2.2`; the code in `frontend/src/services/firebaseConfig.ts` uses this automatically when `Platform.OS === 'android'`.
- For real devices, replace `localhost` with your machine IP in `firebaseConfig` or set an env var to point the emulator host.

3) Test the flow
-- Create a test user via your production Auth or sign up through the app (we do not run an Auth emulator by default).
-- From the app sign in as the test user and open the QR screen. The app will call the callable function and the Functions emulator will handle it.
- Watch the terminal running emulators for function logs and invocation details.
- Use Emulator UI at http://localhost:4000 to inspect Firestore and Auth state.

4) Export / import emulator data (optional)
- Export on exit: `firebase emulators:start --export-on-exit=./saved-data`
- Import data: `firebase emulators:start --import=./saved-data`

Troubleshooting
- If functions fail to load, check `backend/package.json` and ensure `main` points to `index.js` and dependencies are installed.
- If the client cannot reach the emulator, check the host and firewall settings.

If you want, I can:
- Create a small seed script to populate test users and test data in the emulator.
- Add a CI-friendly script to run tests against the emulator.
