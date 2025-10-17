// frontend/src/screens/admin/ListaVoluntariosScreen.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../styles/colors";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  getFirestore,
} from "firebase/firestore";
import { app } from "../../services/firebaseConfig";
import { styles } from "../../styles/screens/admin/ListaVoluntariosStyles";
import { HeaderBack } from "../../components/headerTitle";
import { useNavigation } from "@react-navigation/native";

const db = getFirestore(app);

interface Voluntario {
  id: string;
  nombre: string;
  email: string;
  curp: string;
  numeroIne?: string;
  fechaNacimiento?: any;
  contactoEmergencia?: string;
  genero?: string;
  discapacidad?: string;
  empresa?: string;
  rol?: string;
  role?: string; // backward compatibility
  fechaRegistro?: any;
  documentos?: {
    ine?: string;
    comprobanteDomicilio?: string;
  };
}

const ListaVoluntariosScreen: React.FC = () => {
  const navigation = useNavigation();
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [selectedVoluntario, setSelectedVoluntario] =
    useState<Voluntario | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchVoluntarios();
  }, []);

  const fetchVoluntarios = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "Usuarios"));

      const voluntariosData: Voluntario[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.rol === "voluntario" || data.role === "voluntario") {
          voluntariosData.push({
            id: doc.id,
            ...data,
          } as Voluntario);
        }
      });

      voluntariosData.sort((a, b) => {
        if (a.fechaRegistro && b.fechaRegistro) {
          const dateA = a.fechaRegistro.toDate
            ? a.fechaRegistro.toDate()
            : new Date(a.fechaRegistro);
          const dateB = b.fechaRegistro.toDate
            ? b.fechaRegistro.toDate()
            : new Date(b.fechaRegistro);
          return dateB.getTime() - dateA.getTime();
        }
        return 0;
      });

      setVoluntarios(voluntariosData);
    } catch (error) {
      console.error("Error al obtener voluntarios:", error);
      Alert.alert("Error", "No se pudieron cargar los voluntarios");
    } finally {
      setLoading(false);
    }
  };

  const fetchVoluntarioDetails = async (voluntarioId: string) => {
    try {
      setLoadingDetails(true);
      const docRef = doc(db, "Usuarios", voluntarioId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setSelectedVoluntario({
          id: docSnap.id,
          ...data,
        } as Voluntario);
      } else {
        Alert.alert("Error", "No se encontraron los detalles del voluntario");
      }
    } catch (error) {
      console.error("Error al obtener detalles:", error);
      Alert.alert("Error", "No se pudieron cargar los detalles");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleVoluntarioPress = (voluntario: Voluntario) => {
    fetchVoluntarioDetails(voluntario.id);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "No disponible";
    try {
      if (timestamp.toDate && typeof timestamp.toDate === "function") {
        return timestamp.toDate().toLocaleDateString("es-MX");
      }
      if (timestamp instanceof Date) {
        return timestamp.toLocaleDateString("es-MX");
      }
      if (typeof timestamp === "string") {
        return timestamp;
      }
      return "No disponible";
    } catch {
      return "No disponible";
    }
  };

  const openDocument = async (url?: string) => {
    if (!url) {
      Alert.alert("Error", "No hay URL de documento disponible");
      return;
    }
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "No se puede abrir este tipo de documento");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo abrir el documento");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centeredContainer]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.emptyText}>Cargando voluntarios...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderBack
        title="Voluntarios registrados"
        onBack={() => navigation.goBack()}
      />
      <View style={styles.divisorline} />

      {voluntarios.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={60} color={Colors.gray} />
          <Text style={styles.emptyText}>No hay voluntarios registrados</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View style={styles.mainCard}>
            <Text style={styles.mainCardTitle}>
              Lista de voluntarios registrados
            </Text>

            <FlatList
              data={voluntarios}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.form}
                  onPress={() => handleVoluntarioPress(item)}
                  activeOpacity={0.7}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="person-circle"
                      size={40}
                      color={Colors.purple}
                      style={{ marginRight: 10, marginLeft: -5 }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={styles.nombreText}
                        ellipsizeMode="tail"
                        numberOfLines={2}
                      >
                        {item.nombre}
                      </Text>
                      <Text style={styles.emailText}>{item.email}</Text>
                      <Text style={styles.curpText}>CURP: {item.curp}</Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={Colors.gray}
                      marginLeft={10}
                    />
                  </View>
                </TouchableOpacity>
              )}
              refreshing={loading}
              onRefresh={fetchVoluntarios}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </ScrollView>
      )}

      {/* Modal con detalles del voluntario */}
      <Modal
        visible={!!selectedVoluntario}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedVoluntario(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeaderRow}>
              <Text style={[styles.subtitle, { fontSize: 18 }]}>
                Detalles del Voluntario
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedVoluntario(null)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={Colors.gray} />
              </TouchableOpacity>
            </View>

            {loadingDetails ? (
              <View style={styles.loadingDetails}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.modalLoadingText}>
                  Cargando detalles...
                </Text>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ marginBottom: 5 }}>
                  {[
                    ["Nombre completo", selectedVoluntario?.nombre],
                    ["Correo electrónico", selectedVoluntario?.email],
                    ["CURP", selectedVoluntario?.curp],
                    ["Número de INE", selectedVoluntario?.numeroIne],
                    [
                      "Fecha de nacimiento",
                      formatDate(selectedVoluntario?.fechaNacimiento),
                    ],
                    ["Género", selectedVoluntario?.genero],
                    [
                      "Contacto de emergencia",
                      selectedVoluntario?.contactoEmergencia,
                    ],
                    ["Discapacidad", selectedVoluntario?.discapacidad],
                    ["Empresa", selectedVoluntario?.empresa],
                    [
                      "Fecha de registro",
                      formatDate(selectedVoluntario?.fechaRegistro),
                    ],
                  ].map(([label, value]) => (
                    <View key={label} style={styles.fieldRow}>
                      <Text style={styles.fieldLabel}>{label}:</Text>
                      <Text style={styles.fieldValue}>
                        {value || "No disponible"}
                      </Text>
                    </View>
                  ))}
                </View>

                {(selectedVoluntario?.documentos?.ine ||
                  selectedVoluntario?.documentos?.comprobanteDomicilio) && (
                  <View>
                    <Text style={[styles.subtitle, { marginBottom: 5 }]}>
                      Documentos:
                    </Text>
                    {selectedVoluntario?.documentos?.ine && (
                      <TouchableOpacity
                        style={styles.documentRow}
                        onPress={() =>
                          openDocument(selectedVoluntario.documentos?.ine)
                        }
                      >
                        <Ionicons
                          name="document-attach"
                          size={20}
                          color={Colors.primary}
                        />
                        <Text style={styles.imageFont}>
                          Identificación oficial (INE)
                        </Text>
                        <Ionicons
                          name="eye-outline"
                          size={18}
                          color={Colors.gray}
                        />
                      </TouchableOpacity>
                    )}
                    {selectedVoluntario?.documentos?.comprobanteDomicilio && (
                      <TouchableOpacity
                        style={styles.documentRowNoMargin}
                        onPress={() =>
                          openDocument(
                            selectedVoluntario.documentos?.comprobanteDomicilio
                          )
                        }
                      >
                        <Ionicons
                          name="document-attach"
                          size={20}
                          color={Colors.primary}
                        />
                        <Text style={styles.imageFont}>
                          Comprobante de domicilio
                        </Text>
                        <Ionicons
                          name="eye-outline"
                          size={18}
                          color={Colors.gray}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ListaVoluntariosScreen;
