// frontend/src/context/AuthContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { app } from "../services/firebaseConfig";
import { getUserData } from "../services/api";
import { SecureTokenStorage } from "../services/secureStorage";
import { SecureErrorHandler } from "../utils/errorHandler";
import { validateEmail } from "../utils/validators";

type UserRole = "voluntario" | "admin" | "guardia";

interface User {
  uid: string;
  email: string;
  nombre: string;
  role: UserRole;
  isActive?: boolean;
  contactoEmergencia?: string;
  numeroIne?: string;
  discapacidad?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  loginError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          try {
            const idTokenResult = await firebaseUser.getIdTokenResult();
            const userRole =
              (idTokenResult.claims.role as UserRole) || "voluntario";

            const userDataFromDb = await getUserData(
              firebaseUser.uid,
              firebaseUser.email || undefined
            );

            if (userDataFromDb) {
              setUser({
                uid: firebaseUser.uid,
                email: userDataFromDb.email,
                nombre: userDataFromDb.name,
                role: userRole,
                isActive: userDataFromDb.isActive || true,
                contactoEmergencia: userDataFromDb.contactoEmergencia || "",
                numeroIne: userDataFromDb.numeroIne || "",
                discapacidad: userDataFromDb.discapacidad || "",
              });
            } else {
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email || "",
                nombre: firebaseUser.displayName || "Usuario",
                role: userRole,
                isActive: true,
                contactoEmergencia: "",
                numeroIne: "",
                discapacidad: "",
              });
            }
          } catch (error) {
            console.error("Error en onAuthStateChanged:", error);
            setUser(null);
          }
        } else {
          setUser(null);
          await SecureTokenStorage.clearAllData();
        }
        setIsLoading(false);
      }
    );

    return unsubscribe;
  }, [auth]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setLoginError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idTokenResult = await userCredential.user.getIdTokenResult();
      const userRole = (idTokenResult.claims.role as UserRole) || "voluntario";
      const userData = await getUserData(
        userCredential.user.uid,
        userCredential.user.email || email
      );

      if (userData) {
        setUser({
          uid: userCredential.user.uid,
          email: userData.email,
          nombre: userData.name,
          role: userRole,
          isActive: userData.isActive !== undefined ? userData.isActive : false,
          contactoEmergencia: userData.contactoEmergencia || "",
          numeroIne: userData.numeroIne || "",
          discapacidad: userData.discapacidad || "",
        });
        return true;
      } else {
        setLoginError("No se encontraron los datos del perfil de usuario.");
        await signOut(auth);
        return false;
      }
    } catch (error: any) {
      const userFriendlyError = SecureErrorHandler.handleAuthError(
        error,
        "LOGIN"
      );
      setLoginError(userFriendlyError);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await signOut(auth);
      setUser(null);
      await SecureTokenStorage.clearAllData();
    } catch (error: any) {
      console.warn("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, isLoading, loginError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  AvisoPrivacidad: undefined;
  ForgotPassword: undefined;
  ResetPassword: { email: string };
};
