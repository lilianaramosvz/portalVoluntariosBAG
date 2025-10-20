// frontend/src/screens/admin/ListaVoluntariosScreen.tsx

import React, { useState, useEffect, useCallback } from "react";
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
  SafeAreaView,
  StyleSheet, 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../styles/colors";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  getFirestore,
  deleteDoc, // Se importa la función para borrar
} from "firebase/firestore";
import { app } from "../../services/firebaseConfig";
// Se renombra la importación de estilos para evitar conflictos
import { styles as externalStyles } from "../../styles/screens/admin/ListaVoluntariosStyles";
import { HeaderBack } from "../../components/headerTitle";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { use } from "react";

const db = getFirestore(app);

// La interfaz de Voluntario se mantiene igual
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
  role?: string;
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

  // Lógica para obtener los datos de Firebase
  const fetchVoluntarios = useCallback(async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "Usuarios"));
      const voluntariosData: Voluntario[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.rol === "voluntario" || data.role === "voluntario") {
          voluntariosData.push({ id: doc.id, ...data } as Voluntario);
        }
      });
      voluntariosData.sort((a, b) => {
        if (a.fechaRegistro && b.fechaRegistro) {
          const dateA = a.fechaRegistro.toDate ? a.fechaRegistro.toDate() : new Date(a.fechaRegistro);
          const dateB = b.fechaRegistro.toDate ? b.fechaRegistro.toDate() : new Date(b.fechaRegistro);
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
  }, []);
  useEffect(() => {
      fetchVoluntarios();
    }, [fetchVoluntarios]);

  const fetchVoluntarioDetails = async (voluntarioId: string) => {
    try {
      setLoadingDetails(true);
      const docRef = doc(db, "Usuarios", voluntarioId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSelectedVoluntario({ id: docSnap.id, ...docSnap.data() } as Voluntario);
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

  const formatDate = (timestamp: any): string => {
    if (!timestamp) return "No disponible";
    try {
      if (timestamp.toDate && typeof timestamp.toDate === "function") {
        return timestamp.toDate().toLocaleDateString("es-MX");
      }
      if (timestamp instanceof Date) {
        return timestamp.toLocaleDateString("es-MX");
      }
      return String(timestamp);
    } catch {
      return "Fecha inválida";
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

  const handleDeleteVolunteer = useCallback((volunteer: Voluntario) => {
    Alert.alert(
      "Confirmar Baja",
      `¿Estás seguro de que quieres dar de baja a ${volunteer.nombre}? Esta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Dar de Baja",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "Usuarios", volunteer.id));
              setVoluntarios((prev) => prev.filter((v) => v.id !== volunteer.id));
              setSelectedVoluntario(null); // <-- Cierra el modal después de borrar
              Alert.alert("Éxito", `${volunteer.nombre} ha sido dado de baja.`);
            } catch (error) {
              console.error("Error al dar de baja al voluntario:", error);
              Alert.alert("Error", "No se pudo completar la operación.");
            }
          },
        },
      ]
    );
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={externalStyles.centeredContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={externalStyles.emptyText}>Cargando voluntarios...</Text>
        </View>
      );
    }

    if (voluntarios.length === 0) {
      return (
        <View style={externalStyles.emptyContainer}>
          <Ionicons name="people-outline" size={60} color={Colors.gray} />
          <Text style={externalStyles.emptyText}>No hay voluntarios registrados</Text>
        </View>
      );
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={externalStyles.mainCard}>
          <Text style={externalStyles.mainCardTitle}>Lista de voluntarios registrados</Text>
          <FlatList
            data={voluntarios}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={externalStyles.form}
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
                    <Text style={externalStyles.nombreText} ellipsizeMode="tail" numberOfLines={1}>
                      {item.nombre}
                    </Text>
                    <Text style={externalStyles.emailText}>{item.email}</Text>
                    <Text style={externalStyles.curpText}>CURP: {item.curp}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
                </View>
              </TouchableOpacity>
            )}
            onRefresh={fetchVoluntarios}
            refreshing={loading}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    );
  };

return (
  <>
    <View style={externalStyles.container}>
      <HeaderBack
        title="Voluntarios registrados"
        onBack={() => navigation.goBack()}
      />
      <View style={externalStyles.divisorline} />
      {renderContent()}
    </View>

    {/* Modal */}
    <Modal
      visible={!!selectedVoluntario}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setSelectedVoluntario(null)}
    >
      <View style={externalStyles.modalOverlay}>
        <View style={externalStyles.modalBox}>
          {/* Header del Modal */}
          <View style={externalStyles.modalHeaderRow}>
            <Text style={[externalStyles.subtitle, { fontSize: 18 }]}>
              Detalles del Voluntario
            </Text>
            <TouchableOpacity
              onPress={() => setSelectedVoluntario(null)}
              style={externalStyles.closeButton}
            >
              <Ionicons name="close" size={24} color={Colors.gray} />
            </TouchableOpacity>
          </View>

          {loadingDetails ? (
            <View style={externalStyles.loadingDetails}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Información del voluntario */}
              <View style={{ marginBottom: 10 }}>
                {[
                  ["Nombre completo", selectedVoluntario?.nombre],
                  ["Correo electrónico", selectedVoluntario?.email],
                  ["CURP", selectedVoluntario?.curp],
                  ["Número de INE", selectedVoluntario?.numeroIne],
                  ["Fecha de nacimiento", formatDate(selectedVoluntario?.fechaNacimiento)],
                  ["Género", selectedVoluntario?.genero],
                  ["Contacto de emergencia", selectedVoluntario?.contactoEmergencia],
                  ["Discapacidad", selectedVoluntario?.discapacidad],
                  ["Empresa", selectedVoluntario?.empresa],
                  ["Fecha de registro", formatDate(selectedVoluntario?.fechaRegistro)],
                ].map(([label, value]) => (
                  <View key={label as string} style={externalStyles.fieldRow}>
                    <Text style={externalStyles.fieldLabel}>{label}:</Text>
                    <Text style={externalStyles.fieldValue}>{String(value) || "No disponible"}</Text>
                  </View>
                ))}
              </View>

              {/* Documentos */}
              {(selectedVoluntario?.documentos?.ine || selectedVoluntario?.documentos?.comprobanteDomicilio) && (
                <View>
                  <Text style={[externalStyles.subtitle, { marginBottom: 5 }]}>Documentos:</Text>
                  {selectedVoluntario?.documentos?.ine && (
                    <TouchableOpacity
                      style={externalStyles.documentRow}
                      onPress={() => openDocument(selectedVoluntario.documentos?.ine)}
                    >
                      <Ionicons name="document-attach" size={20} color={Colors.primary} />
                      <Text style={externalStyles.imageFont}>Identificación oficial (INE)</Text>
                      <Ionicons name="eye-outline" size={18} color={Colors.gray} />
                    </TouchableOpacity>
                  )}
                  {selectedVoluntario?.documentos?.comprobanteDomicilio && (
                    <TouchableOpacity
                      style={externalStyles.documentRowNoMargin}
                      onPress={() => openDocument(selectedVoluntario.documentos?.comprobanteDomicilio)}
                    >
                      <Ionicons name="document-attach" size={20} color={Colors.primary} />
                      <Text style={externalStyles.imageFont}>Comprobante de domicilio</Text>
                      <Ionicons name="eye-outline" size={18} color={Colors.gray} />
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Botón de eliminar voluntario */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => selectedVoluntario && handleDeleteVolunteer(selectedVoluntario)}
              >
                <Ionicons name="trash-outline" size={20} color={Colors.white} />
                <Text style={styles.deleteButtonText}>Dar de baja voluntario</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  </>
);
};

// Estilos locales para el nuevo botón de borrar
const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: Colors.lightRed, // Rojo
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 25,
    marginBottom: 15,
  },
  deleteButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default ListaVoluntariosScreen;