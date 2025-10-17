//frontend\src\screens\voluntario\DashboardScreen.tsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../../context/AuthContext";
import { HeaderLogout } from "../../components/headerTitle";
import { VoluntarioStackParamList } from "../../navigation/VoluntarioNavigator";
import styles from "../../styles/screens/voluntario/DashboardStyles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type DashboardScreenProp = StackNavigationProp<
  VoluntarioStackParamList,
  "Dashboard"
>;

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardScreenProp>();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <HeaderLogout title="" onLogout={handleLogout} />
      <Text style={styles.title}>Mi perfil</Text>
      <Text style={styles.subtitle}>Bienvenido a tu panel de voluntario</Text>

      <View style={styles.card}>
        <MaterialIcons name="account-circle" size={90} color="#afabffff" />
        <Text style={styles.name}>{user?.name}</Text>

        <View style={styles.estadoVoluntario}>
          <Text style={[styles.estado]}>
            {user?.isActive ? "Aprobado" : "Pendiente"}
          </Text>
        </View>
      </View>

      <View style={styles.avisoCard}>
        <Text style={styles.avisoText}>Solicitud pendiente</Text>
        <Text style={styles.subtituloAviso}>
          Tu solicitud está siendo revisada por nuestro equipo. Te notificaremos
          una vez que haya sido aprobada.
        </Text>
      </View>

      {/* Button to open QR screen */}
      <TouchableOpacity
        style={[styles.card, { marginTop: 16, alignItems: 'center' }]}
        onPress={() => navigation.navigate('QRGenerator')}
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>Abrir código QR</Text>
      </TouchableOpacity>

    </View>
  );
};

export default DashboardScreen;
