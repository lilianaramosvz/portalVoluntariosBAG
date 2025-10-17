//frontend\src\navigation\VoluntarioNavigator.tsx

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DashboardScreen from "../screens/voluntario/DashboardScreen";
import QRGenerator from "../screens/voluntario/QrScreen";

export type VoluntarioStackParamList = {
  Dashboard: undefined;
  QRGenerator: undefined;
  HistorialAsistencias: undefined;
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
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: "Dashboard" }}
      />
        <Stack.Screen
          name="QRGenerator"
          component={QRGenerator}
          options={{ title: "QR Generator" }}
        />
    </Stack.Navigator>
  );
};

export default VoluntarioNavigator;
