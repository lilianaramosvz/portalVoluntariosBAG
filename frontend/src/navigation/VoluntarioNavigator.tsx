// frontend/src/navigation/VoluntarioNavigator.tsx

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// 1. Importa TODAS las pantallas que usarás en este navegador
import DashboardScreen from "../screens/voluntario/DashboardScreen";
import QrScreen from "../screens/voluntario/QrScreen";
import HistorialScreen from "../screens/voluntario/HistorialScreen";

// 2. Define los nombres de las rutas que usarás en navigation.navigate()
export type VoluntarioStackParamList = {
  Dashboard: undefined;
  QR: undefined;        // <-- Coincide con navigation.navigate("QR")
  Historial: undefined; // <-- Coincide con navigation.navigate("Historial")
};

const Stack = createStackNavigator<VoluntarioStackParamList>();

const VoluntarioNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="QR" component={QrScreen} />
      <Stack.Screen name="Historial" component={HistorialScreen} />
    </Stack.Navigator>
  );
};

export default VoluntarioNavigator;