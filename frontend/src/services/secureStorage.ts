//frontend\src\services\secureStorage.ts

import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/**
 * Almacenamiento de tokens seguro - Cumplimiento OWASP MASVS-STORAGE-1
 * Almacena tokens de autenticación de forma segura usando el llavero/keystore del dispositivo
 */
export class SecureTokenStorage {
  private static readonly AUTH_TOKEN_KEY = "bamx_auth_token";
  private static readonly REFRESH_TOKEN_KEY = "bamx_refresh_token";
  private static readonly USER_ROLE_KEY = "bamx_user_role";

  /**
   * Almacenar el token de autenticación de forma segura
   * @param token - Token JWT de Firebase Auth
   */
  static async setAuthToken(token: string): Promise<void> {
    try {
      // intentar almacenar con autenticación biométrica en iOS
      if (Platform.OS === "ios") {
        try {
          await SecureStore.setItemAsync(this.AUTH_TOKEN_KEY, token, {
            keychainService: "bamx-keychain",
            requireAuthentication: true,
            authenticationPrompt:
              "Autentícate para guardar tu información de login",
          });
          console.log(
            "✅ Auth token stored securely with biometric protection"
          );
          return;
        } catch (biometricError: any) {
          console.log(
            "Biometric authentication failed, using standard keychain:",
            biometricError.message
          );
        }
      }

      // guardar sin autenticación biométrica (fallback)
      await SecureStore.setItemAsync(this.AUTH_TOKEN_KEY, token, {
        keychainService: "bamx-keychain",
      });
      console.log("✅ Auth token stored securely (standard mode)");
    } catch (error: any) {
      console.warn("Failed to store auth token securely:", error);
      throw new Error("No se pudo almacenar el token de forma segura");
    }
  }

  //regresar el token de autenticación de forma segura
  static async getAuthToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.AUTH_TOKEN_KEY, {
        keychainService: "bamx-keychain",
      });
    } catch (error) {
      console.warn("Failed to retrieve auth token:", error);
      return null;
    }
  }

  // Almacenar refresh token de forma segura
  static async setRefreshToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.REFRESH_TOKEN_KEY, token, {
        keychainService: "bamx-keychain",
        requireAuthentication: false, // Los refresh tokens no necesitan autenticación biométrica
      });
    } catch (error) {
      console.warn("Failed to store refresh token:", error);
    }
  }

  // Regresar refresh token de forma segura
  static async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.REFRESH_TOKEN_KEY, {
        keychainService: "bamx-keychain",
      });
    } catch (error) {
      console.warn("Failed to retrieve refresh token:", error);
      return null;
    }
  }

  //guardar el rol del usuario de forma segura
  static async setUserRole(role: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.USER_ROLE_KEY, role, {
        keychainService: "bamx-keychain",
        // El rol del usuario no necesita autenticación biométrica
      });
    } catch (error) {
      console.warn("Failed to store user role:", error);
    }
  }

  // guarda el rol del usuario de forma segura
  static async getUserRole(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.USER_ROLE_KEY, {
        keychainService: "bamx-keychain",
      });
    } catch (error) {
      console.warn("Failed to retrieve user role:", error);
      return null;
    }
  }

  // Borrar todos los datos almacenados de forma segura
  static async clearAllData(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(this.AUTH_TOKEN_KEY, {
          keychainService: "bamx-keychain",
        }),
        SecureStore.deleteItemAsync(this.REFRESH_TOKEN_KEY, {
          keychainService: "bamx-keychain",
        }),
        SecureStore.deleteItemAsync(this.USER_ROLE_KEY, {
          keychainService: "bamx-keychain",
        }),
      ]);
    } catch (error) {
      console.warn("Failed to clear stored data:", error);
    }
  }

  // Verificar si el almacenamiento seguro está disponible
  static async isAvailable(): Promise<boolean> {
    return await SecureStore.isAvailableAsync();
  }
}
