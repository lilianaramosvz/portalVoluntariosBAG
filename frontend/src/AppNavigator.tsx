//frontend\src\AppNavigator.tsx

import React from 'react';
import { useAuth } from './context/AuthContext';
import AuthNavigator from './navigation/AuthNavigator';
import AdminNavigator from './navigation/AdminNavigator';
import VoluntarioNavigator from './navigation/VoluntarioNavigator';
import GuardiaNavigator from './navigation/GuardiaNavigator';
import SuperAdminNavigator from './navigation/SuperAdminNavigator';

const AppNavigator = () => {
  const { user } = useAuth();

  // Si no está logueado, mostrar AuthNavigator (Login/Register)
  if (!user) {
    return <AuthNavigator />;
  }

  // Si está logueado, mostrar el navigator según su rol
  switch (user.role) {
    case 'admin':
      return <AdminNavigator />;
    case 'voluntario':
      return <VoluntarioNavigator />;
    case 'guardia':
      return <GuardiaNavigator />;
    case 'superadmin':
      return <SuperAdminNavigator />;
    default:
      return <AuthNavigator />;
  }
};

export default AppNavigator;