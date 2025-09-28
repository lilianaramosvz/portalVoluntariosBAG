//frontend\src\navigation\GuardiaNavigator.tsx

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DashboardGuardiaScreen from "../screens/guardia/DashboardGuardiaScreen";

export type GuardiaStackParamList = {
  DashboardGuardia: undefined;
  QRScanner: undefined;
};

const Stack = createStackNavigator<GuardiaStackParamList>();

const GuardiaNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="DashboardGuardia"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="DashboardGuardia"
        component={DashboardGuardiaScreen}
        options={{ title: "Dashboard Guardia" }}
      />
    </Stack.Navigator>
  );
};

export default GuardiaNavigator;
