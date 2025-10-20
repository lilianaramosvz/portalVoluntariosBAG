//frontend\src\context\AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { app } from '../services/firebaseConfig';
import { getUserData, UserData } from '../services/api';
import { SecureTokenStorage } from '../services/secureStorage';
import { SecureErrorHandler } from '../utils/errorHandler';
import { validateEmail } from '../utils/validators';
import { doc, getDoc } from 'firebase/firestore';

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
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Verificar tokens almacenados de forma segura
        const storedToken = await SecureTokenStorage.getAuthToken();
        const storedRole = await SecureTokenStorage.getUserRole();
        
        if (storedToken && storedRole) {
          // Verificar si el token sigue siendo válido
          const currentUser = auth.currentUser;
          if (currentUser) {
            const userData = await getUserData(currentUser.uid, currentUser.email || undefined);
            if (userData) {
              setUser({
                id: userData.id,
                email: userData.email,
                name: userData.name,
                role: storedRole as UserRole,
                isActive: userData.isActive || true
              });
            }
          } else {
            // Token expirado, limpiar storage
            await SecureTokenStorage.clearAllData();
          }
        }
      } catch (error: any) {
        const userMessage = SecureErrorHandler.handleAuthError(error, 'INIT');
        console.warn('Auth initialization error:', userMessage);
        await SecureTokenStorage.clearAllData();
      } finally {
        setIsLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Obtener el token con customClaims
          const idTokenResult = await firebaseUser.getIdTokenResult();
          const userRole = idTokenResult.claims.role as UserRole || 'voluntario';
          const token = idTokenResult.token;
          
          // Almacenar en SecureStorage
          await SecureTokenStorage.setAuthToken(token);
          await SecureTokenStorage.setUserRole(userRole);
          
          // Usuario está logueado, obtener sus datos desde Firestore
          const userData = await getUserData(firebaseUser.uid, firebaseUser.email || undefined);
          if (userData) {
            setUser({
              id: userData.id,
              email: userData.email,
              name: userData.name,
              role: userRole, // Usar rol desde customClaims, no desde Firestore
              isActive: userData.isActive || true
            });
          } else {
            // Si no hay datos en Firestore pero sí customClaims, crear usuario básico
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'Usuario',
              role: userRole,
              isActive: true
            });
          }
        } catch (error) {
          const userMessage = SecureErrorHandler.handleAuthError(error, 'AUTH_STATE_CHANGE');
          console.error('Error obteniendo datos del usuario:', userMessage);
          setUser(null);
        }
      } else {
        // Usuario no está logueado
        setUser(null);
        await SecureTokenStorage.clearAllData();
      }
      setIsLoading(false);
    });

    // Inicializar auth al montar el componente
    initializeAuth();

    // Cleanup subscription
    return unsubscribe;
  }, [auth]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      // Validar email (solo formato básico para login)
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        setLoginError(emailValidation.error || 'Formato de correo inválido');
        return false;
      }

      // Para login no validamos la contraseña - usuarios existentes pueden tener contraseñas simples
      // La validación robusta solo aplica para nuevos registros

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Obtener el token con customClaims
      const idTokenResult = await userCredential.user.getIdTokenResult();
      const userRole = idTokenResult.claims.role as UserRole || 'voluntario';
      const token = idTokenResult.token;
      
      // Almacenar en SecureStorage
      await SecureTokenStorage.setAuthToken(token);
      await SecureTokenStorage.setUserRole(userRole);
      
      // Obtener datos del usuario desde Firestore
      const userData = await getUserData(userCredential.user.uid, userCredential.user.email || email);
      
      if (userData) {
        setUser({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userRole, // Usar rol desde customClaims
          isActive: userData.isActive !== undefined ? userData.isActive : false
        });
        return true;
      } else {
        // Si no hay datos en Firestore pero el usuario tiene customClaims válidos
        if (userRole && userRole !== 'voluntario') {
          setUser({
            id: userCredential.user.uid,
            email: userCredential.user.email || email,
            name: userCredential.user.displayName || 'Usuario',
            role: userRole,
            isActive: true
          });
          return true;
        } else {
          // Usuario registrado pero no aprobado aún
          setLoginError('Tu cuenta está pendiente de aprobación por un administrador.');
          await signOut(auth); // Hacer logout para evitar estado inconsistente
          return false;
        }
      }
    } catch (error: any) {
      console.error('Error en login:', error);
      
      // Usar SecureErrorHandler para manejo seguro de errores
      const userFriendlyError = SecureErrorHandler.handleAuthError(error, 'LOGIN');
      setLoginError(userFriendlyError);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Limpiar tokens seguros
      await SecureTokenStorage.clearAllData();
      
      // Firebase logout
      await signOut(auth);
      setUser(null);
    } catch (error: any) {
      const userMessage = SecureErrorHandler.handleAuthError(error, 'LOGOUT');
      console.warn('Logout error:', userMessage);
      throw error;
    } finally {
      setIsLoading(false);
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



export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  AvisoPrivacidad: undefined;
  ForgotPassword: undefined;
  ResetPassword: { email: string}; 
};