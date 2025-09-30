//frontend\src\context\AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { app } from '../services/firebaseConfig';
import { getUserData, UserData } from '../services/api';

type UserRole = 'voluntario' | 'admin' | 'guardia' | 'superadmin';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  loginError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // true inicialmente para verificar estado de auth
  const [loginError, setLoginError] = useState<string | null>(null);

  const auth = getAuth(app);

  // Efecto para escuchar cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Usuario está logueado, obtener sus datos desde Firestore
          const userData = await getUserData(firebaseUser.uid, firebaseUser.email || undefined);
          if (userData) {
            setUser({
              id: userData.id,
              email: userData.email,
              name: userData.name,
              role: userData.rol,
              isActive: userData.isActive || true
            });
          } else {
            console.error('No se pudieron obtener los datos del usuario');
            setUser(null);
          }
        } catch (error) {
          console.error('Error obteniendo datos del usuario:', error);
          setUser(null);
        }
      } else {
        // Usuario no está logueado
        setUser(null);
      }
      setIsLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, [auth]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Obtener datos del usuario desde Firestore
      const userData = await getUserData(userCredential.user.uid, userCredential.user.email || email);
      
      if (userData) {
        setUser({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.rol,
          isActive: userData.isActive || false
        });
        return true;
      } else {
        setLoginError('Tu cuenta no está registrada en nuestro sistema. Contacta al administrador.');
        return false;
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      
      let userFriendlyError = 'Ocurrió un error inesperado.';
      if (error?.code) {
        switch (error.code) {
          case "auth/user-not-found":
          case "auth/invalid-credential":
            userFriendlyError = 'Correo o contraseña incorrectos.';
            break;
          case "auth/invalid-email":
            userFriendlyError = 'El formato del correo electrónico no es válido.';
            break;
          case "auth/network-request-failed":
            userFriendlyError = 'Error de red. Revisa tu conexión a internet.';
            break;
          case "auth/too-many-requests":
            userFriendlyError = 'Demasiados intentos fallidos. Intenta más tarde.';
            break;
        }
      }
      
      setLoginError(userFriendlyError);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, loginError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};