// frontend/src/AppNavigator.tsx

import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "./context/AuthContext";
import AuthNavigator from "./navigation/AuthNavigator";
import AdminNavigator from "./navigation/AdminNavigator";
import VoluntarioNavigator from "./navigation/VoluntarioNavigator";
import GuardiaNavigator from "./navigation/GuardiaNavigator";
import SuperAdminNavigator from "./navigation/SuperAdminNavigator";
import { Colors } from "./styles/colors";

const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Muestra el navegador adecuado según el rol del usuario
  const navigatorToShow = () => {
    if (!user) {
      return <AuthNavigator />;
    }
    switch (user.role) {
      case "admin":
        return <AdminNavigator />;
      case "voluntario":
        return <VoluntarioNavigator />;
      case "guardia":
        return <GuardiaNavigator />;
      default:
        return <AuthNavigator />;
    }
  };

  return <NavigationContainer>{navigatorToShow()}</NavigationContainer>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AppNavigator;
