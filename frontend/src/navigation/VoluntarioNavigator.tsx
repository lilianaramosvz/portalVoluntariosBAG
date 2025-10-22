// frontend/src/navigation/VoluntarioNavigator.tsx

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DashboardScreen from "../screens/voluntario/DashboardScreen";
import QrScreen from "../screens/voluntario/QrScreen";
import HistorialScreen from "../screens/voluntario/HistorialScreen";
import EditProfileScreen from "../screens/voluntario/EditProfileScreen";
import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen";

export type VoluntarioStackParamList = {
  Dashboard: undefined;
  QR: undefined;
  Historial: undefined;
  EditProfile: undefined;
  ResetPassword: { email: string };
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
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
};

export default VoluntarioNavigator;
