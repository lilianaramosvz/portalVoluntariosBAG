//frontend\src\screens\admin\DashboardAdminScreen.tsx

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { styles } from "../../styles/screens/admin/DashboardAdminStyles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../../context/AuthContext";
import { HeaderLogout } from "../../components/headerTitle";
import { AdminStackParamList } from "../../navigation/AdminNavigator";
import { Colors } from "../../styles/colors";

type DashboardAdminScreenProp = StackNavigationProp<AdminStackParamList, "DashboardAdmin">;

const DashboardAdminScreen: React.FC = () => {
  const navigation = useNavigation<DashboardAdminScreenProp>();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <HeaderLogout title="Panel administrativo" onLogout={handleLogout} />
      <View style={styles.divisorline} />

      <View style={styles.containerDisplay}>
        <Text style={styles.adminTitle}>Administrador</Text>
        <View style={styles.card}>
          <MaterialIcons name="account-circle" size={90} color={Colors.purple} />
          <Text style={styles.welcomeText}>¡Bienvenido Admin!</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Solicitudes")}
        >
          <Text style={styles.buttonText}>Solicitudes de voluntarios</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("ListaVoluntarios")}
        >
          <Text style={styles.buttonText}>Voluntarios registrados</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("HistorialAdmin")}
        >
          <Text style={styles.buttonText}>Historial de asistencias</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DashboardAdminScreen;