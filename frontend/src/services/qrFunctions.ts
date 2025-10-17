// frontend/src/services/qrFunctions.ts
// Wrapper for backend callable functions (QR code generation and redemption)
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from './firebaseConfig';
import { getAuth } from 'firebase/auth';

// Get reference to Cloud Functions in us-central1 region
const functions = getFunctions(app, 'us-central1');

// Type definition: What the backend returns when creating a token
type AccessTokenResponse = {
  tokenId: string;      // Firestore document ID
  token: string;        // The actual QR code value (12 character hex string)
  expiresAt: number;    // Timestamp in milliseconds when token expires
};

// Type definition: What the backend returns when redeeming a token
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

/**
 * Creates a new QR access token for volunteer attendance
 * 
 * How it works:
 * 1. Checks if user is logged in
 * 2. Calls the Cloud Function 'createAccessToken'
 * 3. Backend validates user is a volunteer
 * 4. Backend generates random token and saves to Firestore
 * 5. Returns the token string and expiration time
 * 
 * @returns Token data with expiration timestamp
 * @throws Error if user is not authenticated or not authorized
 * 
 * Example usage:
 *   const data = await createAccessToken();
 *   console.log(data.token);      // "a3f5b2c8d1e4"
 *   console.log(data.expiresAt);  // 1729138800000
 */
export async function createAccessToken(): Promise<AccessTokenResponse> {
  // Step 1: Check if user is logged in
  const user = getAuth().currentUser;
  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  // Step 2: Create a callable function reference
  // httpsCallable<InputType, OutputType>
  // - InputType: void (we send nothing to the function)
  // - OutputType: AccessTokenResponse (what the function returns)
  const callable = httpsCallable<void, AccessTokenResponse>(
    functions,
    'createAccessToken'  // Name of the Cloud Function
  );

  // Step 3: Call the function (sends request to backend)
  // Firebase automatically attaches the user's auth token
  const result = await callable();

  // Step 4: Return the data from the function
  return result.data;
}

/**
 * Redeems (validates and marks as used) a QR access token
 * 
 * How it works:
 * 1. Checks if user is logged in (must be a guard)
 * 2. Calls the Cloud Function 'redeemAccessToken' with the scanned token
 * 3. Backend validates:
 *    - User is a guard
 *    - Token exists
 *    - Token not expired
 *    - Token not already used
 * 4. Backend marks token as used
 * 5. Returns volunteer information
 * 
 * @param token - The QR code token string (scanned from volunteer's screen)
 * @returns Redemption result with volunteer information
 * @throws Error if token is invalid, expired, or already used
 * 
 * Example usage:
 *   const result = await redeemAccessToken("a3f5b2c8d1e4");
 *   console.log(result.volunteer.name);  // "Juan Pérez"
 *   console.log(result.success);         // true
 */
export async function redeemAccessToken(
  token: string
): Promise<RedeemTokenResponse> {
  // Step 1: Check if user is logged in
  const user = getAuth().currentUser;
  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  // Step 2: Create a callable function reference
  // httpsCallable<InputType, OutputType>
  // - InputType: { token: string } (we send the scanned token)
  // - OutputType: RedeemTokenResponse (volunteer info and success status)
  const callable = httpsCallable<{ token: string }, RedeemTokenResponse>(
    functions,
    'redeemAccessToken'  // Name of the Cloud Function
  );

  // Step 3: Call the function with the token parameter
  const result = await callable({ token });

  // Step 4: Return the data from the function
  return result.data;
}

