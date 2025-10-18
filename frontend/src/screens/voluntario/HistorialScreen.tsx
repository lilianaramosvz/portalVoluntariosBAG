import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../../styles/screens/voluntario/HistorialStyles";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { HeaderBack } from "../../components/headerTitle";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../services/firebaseConfig";

interface Asistencia {
  fecha: Date;
  voluntarioNombre: string;
  registradoPor: string;
}

interface DiaHistorial {
  fecha: string;
  entradas: { hora: string; tipo: string }[];
}

export default function HistorialScreen() {
  const navigation = useNavigation();
  const [historial, setHistorial] = useState<DiaHistorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEntradas, setTotalEntradas] = useState(0);
  const [diasRegistrados, setDiasRegistrados] = useState(0);

  useEffect(() => {
    fetchAsistencias();
  }, []);

  const fetchAsistencias = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log("No hay usuario autenticado");
        setLoading(false);
        return;
      }

      // Query para obtener las asistencias del voluntario actual
      const asistenciasRef = collection(db, "RegistroAsistencias");
      const q = query(
        asistenciasRef,
        where("voluntarioId", "==", user.uid)
      );

      const querySnapshot = await getDocs(q);
      const asistencias: Asistencia[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        asistencias.push({
          fecha: data.fecha.toDate(),
          voluntarioNombre: data.voluntarioNombre,
          registradoPor: data.registradoPor,
        });
      });

      // Ordenar por fecha descendente (más reciente primero)
      asistencias.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());

      // Agrupar asistencias por día
      const diasMap = new Map<string, { hora: string; tipo: string }[]>();

      asistencias.forEach((asistencia) => {
        const fecha = asistencia.fecha;
        const fechaKey = fecha.toLocaleDateString("es-MX", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        const hora = fecha.toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
        });

        if (!diasMap.has(fechaKey)) {
          diasMap.set(fechaKey, []);
        }

        diasMap.get(fechaKey)?.push({
          hora: hora,
          tipo: "Entrada",
        });
      });

      // Convertir Map a array
      const historialArray: DiaHistorial[] = Array.from(diasMap.entries()).map(
        ([fecha, entradas]) => ({
          fecha: fecha.charAt(0).toUpperCase() + fecha.slice(1), // Capitalizar primera letra
          entradas: entradas,
        })
      );

      setHistorial(historialArray);
      setTotalEntradas(asistencias.length);
      setDiasRegistrados(historialArray.length);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener asistencias:", error);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, justifyContent: "space-between", padding: 18 }}>
        <HeaderBack
          title="Historial de asistencias"
          onBack={() => navigation.goBack()}
        />

        <View style={styles.divisorline} />

        {loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={[styles.description, { marginTop: 10 }]}>
              Cargando historial...
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.form}>
              <Text style={styles.number}>{diasRegistrados}</Text>
              <Text style={styles.description}>Días de voluntariado registrados</Text>
            </View>

            <ScrollView style={styles.scrollContainer}>
              {historial.length === 0 ? (
                <View style={{ padding: 20, alignItems: "center" }}>
                  <Ionicons name="calendar-outline" size={48} color="#999" />
                  <Text style={[styles.description, { marginTop: 10, textAlign: "center" }]}>
                    No tienes asistencias registradas aún
                  </Text>
                </View>
              ) : (
                historial.map((dia, index) => (
                  <View key={index} style={styles.formDia}>
                    <View style={styles.row}>
                      <Ionicons name="calendar-clear-outline" size={18} style={styles.icon} />
                      <Text style={[styles.description, { marginLeft: 5 }]}>{dia.fecha}</Text>
                    </View>
                    {dia.entradas.map((entrada, idx) => (
                      <View key={idx} style={styles.formGray}>
                        <View style={styles.row}>
                          <View style={styles.rowLeft}>
                            <Ionicons name="time-outline" size={18} style={styles.icon} />
                            <Text style={[styles.hora, { marginLeft: 5 }]}>{entrada.hora}</Text>
                          </View>
                          <View style={styles.formEntrada}>
                            <Text style={styles.entrada}>{entrada.tipo}</Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                ))
              )}
            </ScrollView>

            {/* Última caja */}
            <View style={styles.formGreen}>
              <Text style={styles.titleGreen}>Estadísticas</Text>
              <Text style={styles.number}>{totalEntradas}</Text>
              <Text style={styles.subtitleGreen}>Total Entradas</Text>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
