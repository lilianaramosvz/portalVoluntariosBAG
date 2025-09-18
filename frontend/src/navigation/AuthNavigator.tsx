//frontend\src\navigation\AuthNavigator.tsx

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import AvisoPrivacidadScreen from "../screens/auth/AvisoPrivacidadScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  AvisoPrivacidad: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="AvisoPrivacidad" component={AvisoPrivacidadScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
