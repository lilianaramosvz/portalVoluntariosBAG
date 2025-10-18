import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Secure Token Storage - OWASP MASVS-STORAGE-1 Compliance
 * Stores authentication tokens securely using device keychain/keystore
 */
export class SecureTokenStorage {
  private static readonly AUTH_TOKEN_KEY = 'bamx_auth_token';
  private static readonly REFRESH_TOKEN_KEY = 'bamx_refresh_token';
  private static readonly USER_ROLE_KEY = 'bamx_user_role';

  /**
   * Store authentication token securely
   * @param token - JWT token from Firebase Auth
   */
  static async setAuthToken(token: string): Promise<void> {
    try {
      // Try with biometric authentication first (iOS only)
      if (Platform.OS === 'ios') {
        try {
          await SecureStore.setItemAsync(this.AUTH_TOKEN_KEY, token, {
            keychainService: 'bamx-keychain',
            requireAuthentication: true,
            authenticationPrompt: 'Autentícate para guardar tu información de login'
          });
          console.log('✅ Auth token stored securely with biometric protection');
          return;
        } catch (biometricError: any) {
          console.log('Biometric authentication failed, using standard keychain:', biometricError.message);
          // Continue to fallback below
        }
      }

      // Fallback: store without biometric authentication
      await SecureStore.setItemAsync(this.AUTH_TOKEN_KEY, token, {
        keychainService: 'bamx-keychain'
        // No requireAuthentication for fallback
      });
      console.log('✅ Auth token stored securely (standard mode)');
      
    } catch (error: any) {
      console.warn('Failed to store auth token securely:', error);
      throw new Error('No se pudo almacenar el token de forma segura');
    }
  }

  /**
   * Retrieve authentication token securely
   * @returns JWT token or null if not found
   */
  static async getAuthToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.AUTH_TOKEN_KEY, {
        keychainService: 'bamx-keychain'
      });
    } catch (error) {
      console.warn('Failed to retrieve auth token:', error);
      return null;
    }
  }

  /**
   * Store refresh token securely
   * @param token - Refresh token from Firebase Auth
   */
  static async setRefreshToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.REFRESH_TOKEN_KEY, token, {
        keychainService: 'bamx-keychain',
        requireAuthentication: false // Refresh tokens don't need biometric auth
      });
    } catch (error) {
      console.warn('Failed to store refresh token:', error);
    }
  }

  /**
   * Retrieve refresh token securely
   */
  static async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.REFRESH_TOKEN_KEY, {
        keychainService: 'bamx-keychain'
      });
    } catch (error) {
      console.warn('Failed to retrieve refresh token:', error);
      return null;
    }
  }

  /**
   * Store user role for offline access
   * @param role - User role from custom claims
   */
  static async setUserRole(role: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.USER_ROLE_KEY, role, {
        keychainService: 'bamx-keychain'
        // User role doesn't need biometric authentication
      });
    } catch (error) {
      console.warn('Failed to store user role:', error);
    }
  }

  /**
   * Get stored user role
   */
  static async getUserRole(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.USER_ROLE_KEY, {
        keychainService: 'bamx-keychain'
      });
    } catch (error) {
      console.warn('Failed to retrieve user role:', error);
      return null;
    }
  }

  /**
   * Clear all stored tokens and data
   * Called on logout or security breach
   */
  static async clearAllData(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(this.AUTH_TOKEN_KEY, {
          keychainService: 'bamx-keychain'
        }),
        SecureStore.deleteItemAsync(this.REFRESH_TOKEN_KEY, {
          keychainService: 'bamx-keychain'
        }),
        SecureStore.deleteItemAsync(this.USER_ROLE_KEY, {
          keychainService: 'bamx-keychain'
        })
      ]);
    } catch (error) {
      console.warn('Failed to clear stored data:', error);
    }
  }

  /**
   * Check if secure storage is available
   */
  static async isAvailable(): Promise<boolean> {
    return await SecureStore.isAvailableAsync();
  }
}