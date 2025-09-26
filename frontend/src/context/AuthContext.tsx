//frontend\src\context\AuthContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'voluntario' | 'admin' | 'guardia' | 'superadmin';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Admin credentials
      if (email === 'admin@bag.org.mx' && password === 'admin123') {
        setUser({
          id: '1',
          email: email,
          name: 'Administrador BAG',
          role: 'admin'
        });
        return true;
      }
      
      // Voluntario credentials
      if (email === 'voluntario@test.com' && password === 'voluntario123') {
        setUser({
          id: '2',
          email: email,
          name: 'Juan Voluntario',
          role: 'voluntario'
        });
        return true;
      }

      // Guardia credentials
      if (email === 'guardia@bag.org.mx' && password === 'guardia123') {
        setUser({
          id: '3',
          email: email,
          name: 'Guardia BAG',
          role: 'guardia'
        });
        return true;
      }

      // Super Admin credentials
      if (email === 'superadmin@bag.org.mx' && password === 'super123') {
        setUser({
          id: '4',
          email: email,
          name: 'Super Admin BAG',
          role: 'superadmin'
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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