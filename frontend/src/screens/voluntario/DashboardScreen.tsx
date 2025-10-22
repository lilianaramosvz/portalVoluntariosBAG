// frontend/src/screens/voluntario/DashboardScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { auth, db } from "../../services/firebaseConfig";
import { HeaderLogout } from "../../components/headerTitle";
import { Colors } from "../../styles/colors";
import { typography } from "../../styles/typography";
import styles from "../../styles/screens/voluntario/DashboardStyles";
import { useAuth } from "../../context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";

type DashboardScreenProp = StackNavigationProp<any, "Dashboard">;

interface UsuarioData {
  nombre: string;
  email: string;
  rol: "voluntario" | "guardia" | "admin";
  estado: "pendiente" | "aceptado";
  createdAt?: string;
}

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardScreenProp>();
  const currentUser = getAuth().currentUser;

  const [userData, setUserData] = useState<UsuarioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del usuario cada vez que se enfoca la pantalla
  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        if (!currentUser) {
          setError("No hay usuario autenticado");
          setLoading(false);
          return;
        }

        try {
          setLoading(true);
          setError(null);

          // Intentar leer de la colección 'Usuarios' primero
          let userDoc = await getDoc(doc(db, "Usuarios", currentUser.uid));

          // Si no existe en Usuarios, buscar en voluntariosPendientes
          if (!userDoc.exists()) {
            userDoc = await getDoc(
              doc(db, "voluntariosPendientes", currentUser.uid)
            );
          }

          if (!userDoc.exists()) {
            setError("Perfil no encontrado");
            setLoading(false);
            return;
          }

          const data = userDoc.data() as UsuarioData;
          setUserData(data);
          setLoading(false);
        } catch (err) {
          console.error("Error al cargar datos:", err);
          setError("Error al cargar tus datos");
          setLoading(false);
        }
      };

      fetchUserData();
    }, [currentUser])
  );

  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: logout,
        },
      ]
    );
  };

  // Pantalla de carga
  if (loading) {
    return (
      <View style={styles.container}>
        <HeaderLogout title="" onLogout={handleLogout} />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={[styles.subtitle, { marginTop: 15 }]}>
            Cargando tu perfil...
          </Text>
        </View>
      </View>
    );
  }

  // Pantalla de error
  if (error || !userData) {
    return (
      <View style={styles.container}>
        <HeaderLogout title="" onLogout={handleLogout} />
        <ScrollView
          contentContainerStyle={{ flex: 1, justifyContent: "center" }}
        >
          <View style={{ alignItems: "center", paddingHorizontal: 20 }}>
            <MaterialIcons
              name="error-outline"
              size={60}
              color={Colors.secondary}
            />
            <Text style={[styles.subtitle, { marginTop: 20, marginBottom: 0 }]}>
              {error || "Error al cargar tu perfil"}
            </Text>
            <TouchableOpacity
              style={{
                marginTop: 30,
                paddingHorizontal: 30,
                paddingVertical: 12,
                backgroundColor: Colors.primary,
                borderRadius: 10,
              }}
              onPress={() => {
                setLoading(true);
                setError(null);
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "Inter_600SemiBold",
                  fontSize: 16,
                }}
              >
                Reintentar
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Determinar si está aprobado
  const isAprobado = userData.estado === "aceptado";
  const estadoColor = isAprobado ? Colors.lightGreen : Colors.tertiary;
  const estadoTexto = isAprobado ? "Aceptado" : "Pendiente";

  return (
    <View style={styles.container}>
      <HeaderLogout title="" onLogout={handleLogout} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Mi perfil</Text>
        <Text style={styles.subtitle}>Banco de Alimentos - Voluntario</Text>

        <View style={styles.card}>
          <MaterialIcons
            name="account-circle"
            size={90}
            color={Colors.purple}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: -8,
            }}
          >
            <Text style={styles.name}>{userData.nombre || "Voluntario"}</Text>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                if (isAprobado) {
                  navigation.navigate("EditProfile");
                } else {
                  Alert.alert(
                    "Pendiente",
                    "No puedes editar tu perfil hasta que tu solicitud sea aceptada."
                  );
                }
              }}
            >
              <Ionicons name="pencil" size={16} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <View
            style={[styles.estadoVoluntario, { backgroundColor: estadoColor }]}
          >
            <Text
              style={[
                styles.estado,
                { fontFamily: "Inter_400Regular", color: Colors.text },
              ]}
            >
              {estadoTexto}
            </Text>
            <TouchableOpacity></TouchableOpacity>
          </View>

          <Text
            style={[
              styles.estado,
              {
                fontFamily: "Inter_400Regular",
                marginTop: 10,
                fontSize: 11,
                color: Colors.gray,
              },
            ]}
          >
            ID: {currentUser?.uid?.substring(0, 8) || "..."}
          </Text>
        </View>

        {/*si está pendiente: */}
        {!isAprobado && (
          <View style={{ marginTop: 10 }}>
            <View style={styles.avisoCard}>
              <Text style={styles.avisoText}>Solicitud pendiente</Text>
              <Text style={styles.subtituloAviso}>
                Tu solicitud está siendo revisada por nuestro equipo. Te
                notificaremos cuando sea aprobada.
              </Text>
            </View>
          </View>
        )}

        {/*si está aprobado: */}
        {isAprobado && (
          <View style={{ marginTop: 16, gap: 12 }}>
            <TouchableOpacity
              style={styles.buttonQR}
              onPress={() => navigation.navigate("QR")}
            >
              <MaterialIcons name="qr-code-2" size={24} color={Colors.white} />
              <Text style={styles.buttonTextQR}>Ver código QR</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Historial")}
            >
              <MaterialIcons name="history" size={24} color={Colors.primary} />
              <Text style={styles.buttonText}>Historial de asistencias</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;
