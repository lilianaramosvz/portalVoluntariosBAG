//frontend\src\screens\admin\DashboardAdminScreen.tsx

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { styles } from "../../styles/screens/admin/DashboardAdminStyles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { HeaderLogout } from "../../components/headerTitle";

const DashboardAdminScreen: React.FC = () => {
  const navigation = useNavigation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <HeaderLogout title="Panel administrativo" onLogout={handleLogout} />
      <View style={styles.divisorline} />

      <Text style={styles.adminTitle}>Administrador</Text>


    <View style={styles.containerDisplay}>
      {/* Card de bienvenida */}
      <View style={styles.card}>
        <MaterialIcons name="account-circle" size={90} color="#afabffff" />
        <Text style={styles.welcomeText}>¡Bienvenido Admin!</Text>
      </View>

      {/* Botones de navegación */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("VolunteerRequests" as never)}
      >
        <Text style={styles.buttonText}>Solicitudes de voluntarios</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("VolunteersList" as never)}
      >
        <Text style={styles.buttonText}>Voluntarios registrados</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AttendanceHistory" as never)}
      >
        <Text style={styles.buttonText}>Historial de asistencias</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

export default DashboardAdminScreen;
