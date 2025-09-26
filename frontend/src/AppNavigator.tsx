//frontend\src\AppNavigator.tsx

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from './context/AuthContext';
import AuthNavigator from './navigation/AuthNavigator';
import AdminNavigator from './navigation/AdminNavigator';
import VoluntarioNavigator from './navigation/VoluntarioNavigator';
import GuardiaNavigator from './navigation/GuardiaNavigator';
import SuperAdminNavigator from './navigation/SuperAdminNavigator';

const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  // Mostrar indicador de carga mientras verificamos el estado de autenticación
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Verificando sesión...</Text>
      </View>
    );
  }

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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default AppNavigator;