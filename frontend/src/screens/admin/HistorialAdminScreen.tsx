// frontend/src/screens/admin/HistorialAdminScreen.tsx

import React, { useState } from "react";
import { View, Text, ActivityIndicator, SectionList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles/screens/admin/HistorialAdminStyles";
import { HeaderBack } from "../../components/headerTitle";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../styles/colors";
import { db } from "../../services/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";

// --- Tipos ---
interface Asistencia {
  id: string;
  voluntarioNombre: string;
  voluntarioId: string;
  fecha: Date;
}

interface AsistenciaSection {
  title: string;
  data: Asistencia[];
}

// --- Componente Principal ---
const HistorialAdminScreen: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [asistencias, setAsistencias] = useState<AsistenciaSection[]>([]);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      // La lógica para obtener los datos de Firebase se mantiene igual
      const fetchAsistencias = async () => {
        try {
          setLoading(true);
          setError(null);
          const asistenciasRef = collection(db, "RegistroAsistencias");
          const q = query(asistenciasRef, orderBy("fecha", "desc"));
          const querySnapshot = await getDocs(q);
          const data: Asistencia[] = querySnapshot.docs.map((doc) => {
            const docData = doc.data();
            const fechaAsistencia =
              docData.fecha instanceof Timestamp
                ? docData.fecha.toDate()
                : new Date();
            return {
              id: doc.id,
              voluntarioNombre:
                docData.voluntarioNombre || "Nombre no disponible",
              voluntarioId: docData.voluntarioId || "ID no disponible",
              fecha: fechaAsistencia,
            };
          });
          const grouped = data.reduce((acc, item) => {
            const dateKey = item.fecha.toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(item);
            return acc;
          }, {} as Record<string, Asistencia[]>);
          const sections: AsistenciaSection[] = Object.keys(grouped).map(
            (key) => ({
              title: key,
              data: grouped[key],
            })
          );
          setAsistencias(sections);
        } catch (error) {
          console.error("Error al obtener el historial de asistencias:", error);
          setError("Error al cargar el historial.");
        } finally {
          setLoading(false);
        }
      };
      fetchAsistencias();
    }, [])
  );

  const renderItem = ({ item }: { item: Asistencia }) => (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons
          name="time-outline"
          size={28}
          color={Colors.primary}
          alignment="center"
          justifyContent="center"
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.itemName}>{item.voluntarioNombre}</Text>
        <Text style={styles.itemDetails}>
          {`ID: ${item.voluntarioId.substring(0, 16)}...`}
          {"\n"}
          {item.fecha.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
          })}
          {"\n"}
          Entrada:{" "}
          {item.fecha.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          hrs
        </Text>
      </View>
    </View>
  );

  const renderSectionHeader = ({
    section: { title },
  }: {
    section: AsistenciaSection;
  }) => <Text style={styles.sectionHeader}>{title}</Text>;

  // Renderizado centralizado para evitar repetir el Header
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ marginTop: 15, fontSize: 16, color: Colors.gray }}>
            Cargando historial...
          </Text>
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.loadingContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={60}
            color={Colors.secondary}
          />
          <Text
            style={{
              marginTop: 15,
              fontSize: 16,
              color: Colors.gray,
              textAlign: "center",
            }}
          >
            {error}
          </Text>
        </View>
      );
    }
    return (
      <SectionList
        sections={asistencias}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="document-text-outline"
              size={60}
              color={Colors.gray}
            />
            <Text style={styles.emptyText}>
              No hay registros de asistencia.
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <View style={styles.scrollContainer}>
      <View style={styles.container}>
        <HeaderBack
          title="Historial de asistencias"
          onBack={() => navigation.goBack()}
        />
        <View style={styles.divisorline} />

        <View style={styles.form}>
          <Text style={styles.subtitle}> Historial general de asistencias</Text>
          {renderContent()}
        </View>
      </View>
    </View>
  );
};

export default HistorialAdminScreen;
