// frontend/src/AppNavigator.tsx

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from './context/AuthContext';

// Import all your different navigators
import AuthNavigator from './navigation/AuthNavigator';
import AdminNavigator from './navigation/AdminNavigator';
import VoluntarioNavigator from './navigation/VoluntarioNavigator';
import GuardiaNavigator from './navigation/GuardiaNavigator';
import SuperAdminNavigator from './navigation/SuperAdminNavigator';

const AppNavigator = () => {
  const { user, isLoading } = useAuth(); // This will now work correctly

  // Show loading indicator while checking the user's session
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  // This is the core logic that fixes the RESET error
  // It chooses which navigator to show based on the user state.
  const navigatorToShow = () => {
    if (!user) {
      return <AuthNavigator />;
    }
    switch (user.role) {
      case 'admin': return <AdminNavigator />;
      case 'voluntario': return <VoluntarioNavigator />;
      case 'guardia': return <GuardiaNavigator />;
      case 'superadmin': return <SuperAdminNavigator />;
      default: return <AuthNavigator />;
    }
  };

  return (
      <NavigationContainer>
          {navigatorToShow()}
      </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppNavigator;