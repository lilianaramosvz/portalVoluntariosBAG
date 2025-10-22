//frontend\src\navigation\AdminNavigator.tsx

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DashboardAdminScreen from "../screens/admin/DashboardAdminScreen";
import SolicitudesScreen from "../screens/admin/SolicitudesScreen";
import ListaVoluntariosScreen from "../screens/admin/ListaVoluntariosScreen";
import HistorialAdminScreen from "../screens/admin/HistorialAdminScreen";

export type AdminStackParamList = {
  DashboardAdmin: undefined;
  Solicitudes: undefined;
  ListaVoluntarios: undefined;
  HistorialAdmin: undefined;
};

const Stack = createStackNavigator<AdminStackParamList>();

const AdminNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="DashboardAdmin"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="DashboardAdmin" component={DashboardAdminScreen} />
      <Stack.Screen name="Solicitudes" component={SolicitudesScreen} />
      <Stack.Screen
        name="ListaVoluntarios"
        component={ListaVoluntariosScreen}
      />
      <Stack.Screen name="HistorialAdmin" component={HistorialAdminScreen} />
    </Stack.Navigator>
  );
};

export default AdminNavigator;
