//frontend\src\screens\admin\ListaVoluntariosScreen.tsx

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
import { collection, getDocs, doc, getDoc, getFirestore } from "firebase/firestore";
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
  fechaNacimiento?: string;
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
  [key: string]: any;
}

const ListaVoluntariosScreen: React.FC = () => {
  const navigation = useNavigation();
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [selectedVoluntario, setSelectedVoluntario] = useState<Voluntario | null>(null);
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
        
        // Filter for volunteers using both possible field names
        if (data.rol === "voluntario" || data.role === "voluntario") {
          voluntariosData.push({
            id: doc.id,
            ...data,
          } as Voluntario);
        }
      });

      // Sort by registration date (most recent first)
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
      if (timestamp.toDate && typeof timestamp.toDate === 'function') {
        return timestamp.toDate().toLocaleDateString("es-MX");
      }
      if (timestamp instanceof Date) {
        return timestamp.toLocaleDateString("es-MX");
      }
      if (typeof timestamp === 'string') {
        return timestamp;
      }
      return "No disponible";
    } catch (error) {
      return "No disponible";
    }
  };

  const renderField = (label: string, value: any) => (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontWeight: "600", fontSize: 14, color: "#333" }}>
        {label}:
      </Text>
      <Text style={{ fontSize: 14, color: "#666", marginTop: 2 }}>
        {value || "No disponible"}
      </Text>
    </View>
  );

  const openDocument = async (documentUrl: string, documentName: string) => {
    try {
      if (!documentUrl) {
        Alert.alert("Error", "No hay URL de documento disponible");
        return;
      }

      const supported = await Linking.canOpenURL(documentUrl);
      if (supported) {
        await Linking.openURL(documentUrl);
      } else {
        Alert.alert("Error", "No se puede abrir este tipo de documento");
      }
    } catch (error) {
      console.error("Error opening document:", error);
      Alert.alert("Error", "No se pudo abrir el documento");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#009951" />
        <Text style={{ marginTop: 10, fontSize: 16, color: "#666" }}>
          Cargando voluntarios...
        </Text>
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
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Ionicons name="people-outline" size={60} color="#ccc" />
          <Text style={{ fontSize: 16, color: "#666", marginTop: 10 }}>
            No hay voluntarios registrados
          </Text>
        </View>
      ) : (
        <FlatList
          data={voluntarios}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.form}
              onPress={() => handleVoluntarioPress(item)}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ marginRight: 15 }}>
                  <Ionicons name="person-circle" size={40} color="#009951" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.subtitle, { fontSize: 16, marginBottom: 3 }]}>
                    {item.nombre}
                  </Text>
                  <Text style={{ fontSize: 14, color: "#666", marginBottom: 2 }}>
                    {item.email}
                  </Text>
                  <Text style={{ fontSize: 12, color: "#999" }}>
                    CURP: {item.curp}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </View>
            </TouchableOpacity>
          )}
          refreshing={loading}
          onRefresh={fetchVoluntarios}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal para mostrar detalles */}
      <Modal
        visible={!!selectedVoluntario}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedVoluntario(null)}
      >
        <View style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <View style={{
            backgroundColor: "white",
            margin: 20,
            borderRadius: 16,
            padding: 20,
            maxHeight: "80%",
            width: "90%",
          }}>
            <View style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}>
              <Text style={[styles.subtitle, { fontSize: 18 }]}>
                Detalles del Voluntario
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedVoluntario(null)}
                style={{ padding: 5 }}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {loadingDetails ? (
              <View style={{ alignItems: "center", padding: 20 }}>
                <ActivityIndicator size="large" color="#009951" />
                <Text style={{ marginTop: 10, color: "#666" }}>
                  Cargando detalles...
                </Text>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ marginBottom: 20 }}>
                  <Text style={[styles.subtitle, { marginBottom: 15 }]}>
                    Información Personal
                  </Text>

                  {renderField("Nombre completo", selectedVoluntario?.nombre)}
                  {renderField("Correo electrónico", selectedVoluntario?.email)}
                  {renderField("CURP", selectedVoluntario?.curp)}
                  {renderField("Número de INE", selectedVoluntario?.numeroIne)}
                  {renderField("Fecha de nacimiento", selectedVoluntario?.fechaNacimiento)}
                  {renderField("Género", selectedVoluntario?.genero)}
                  {renderField("Contacto de emergencia", selectedVoluntario?.contactoEmergencia)}
                  {renderField("Discapacidad", selectedVoluntario?.discapacidad)}
                  {renderField("Empresa", selectedVoluntario?.empresa)}
                  {renderField("Fecha de registro", formatDate(selectedVoluntario?.fechaRegistro))}
                </View>

                {(selectedVoluntario?.documentos?.ine || selectedVoluntario?.documentos?.comprobanteDomicilio) && (
                  <View>
                    <Text style={[styles.subtitle, { marginBottom: 15 }]}>
                      Documentos
                    </Text>
                    {selectedVoluntario?.documentos?.ine && (
                      <TouchableOpacity 
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          padding: 10,
                          backgroundColor: "#f5f5f5",
                          borderRadius: 8,
                          marginBottom: 8,
                        }}
                        onPress={() => openDocument(selectedVoluntario.documentos?.ine!, "INE")}
                      >
                        <Ionicons name="document-attach" size={20} color="#009951" />
                        <Text style={{ marginLeft: 10, flex: 1 }}>
                          Identificación oficial (INE)
                        </Text>
                        <Ionicons name="eye-outline" size={18} color="#666" />
                      </TouchableOpacity>
                    )}
                    {selectedVoluntario?.documentos?.comprobanteDomicilio && (
                      <TouchableOpacity 
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          padding: 10,
                          backgroundColor: "#f5f5f5",
                          borderRadius: 8,
                        }}
                        onPress={() => openDocument(selectedVoluntario.documentos?.comprobanteDomicilio!, "Comprobante de domicilio")}
                      >
                        <Ionicons name="document-attach" size={20} color="#009951" />
                        <Text style={{ marginLeft: 10, flex: 1 }}>
                          Comprobante de domicilio
                        </Text>
                        <Ionicons name="eye-outline" size={18} color="#666" />
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
