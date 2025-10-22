//frontend\src\screens\admin\SolicitudesScreen.tsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Modal,
  ScrollView,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HeaderBack } from "../../components/headerTitle";
import AntDesign from "@expo/vector-icons/AntDesign";
import { styles } from "../../styles/screens/admin/SolicitudesStyles";
import { app } from "../../services/firebaseConfig";
import {
  collection,
  onSnapshot,
  getDocs,
  doc,
  getDoc,
  writeBatch,
  serverTimestamp,
  deleteDoc,
  getFirestore,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { FirebaseApp } from "firebase/app";
import { Colors } from "../../styles/colors";
import Ionicons from "@expo/vector-icons/build/Ionicons";

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
  role?: string;
  fechaRegistro?: any;
  documentos?: {
    ine?: string;
    comprobanteDomicilio?: string;
  };
}

type VoluntarioPendiente = {
  id: string;
  nombre: string;
  email: string;
};

const PENDIENTES_COL = "voluntariosPendientes";
const REGISTRADOS_COL = "Usuarios";

const SolicitudesScreen: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [solicitudes, setSolicitudes] = useState<VoluntarioPendiente[]>([]);
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [selectedVoluntario, setSelectedVoluntario] =
    useState<Voluntario | null>(null);

  const pendientesRef = useMemo(() => collection(db, PENDIENTES_COL), []);

  const mapDocToPendiente = (
    d: QueryDocumentSnapshot<DocumentData>
  ): VoluntarioPendiente => {
    const data = d.data() || {};
    return {
      id: d.id,
      nombre: data.nombre || data.name || "Sin nombre",
      email: data.email || data.correo || "Sin correo",
    };
  };

  useEffect(() => {
    const unsub = onSnapshot(
      pendientesRef,
      (snapshot) => {
        const data = snapshot.docs.map(mapDocToPendiente);
        setSolicitudes(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error al cargar solicitudes:", error);
        setLoading(false);
        Alert.alert("Error", "No se pudieron cargar las solicitudes.");
      }
    );
    return () => unsub();
  }, [pendientesRef]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const qs = await getDocs(pendientesRef);
      setSolicitudes(qs.docs.map(mapDocToPendiente));
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudieron refrescar las solicitudes.");
    } finally {
      setRefreshing(false);
    }
  }, [pendientesRef]);

  const fetchPendienteDetails = useCallback(async (voluntarioId: string) => {
    try {
      setLoadingDetails(true);
      const ref = doc(db, PENDIENTES_COL, voluntarioId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setSelectedVoluntario({
          id: snap.id,
          ...data,
        } as Voluntario);
      } else {
        Alert.alert("Error", "No se encontraron los detalles de la solicitud");
      }
    } catch (error) {
      console.error("Error al obtener detalles:", error);
      Alert.alert("Error", "No se pudieron cargar los detalles");
    } finally {
      setLoadingDetails(false);
    }
  }, []);

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

  const renderItem = ({ item }: { item: VoluntarioPendiente }) => {
    const disabled = processingId === item.id;
    return (
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() => fetchPendienteDetails(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              {item.nombre}{" "}
              <AntDesign
                name="down"
                size={12}
                color="colors.text"
                style={{ padding: 5 }}
              />
            </Text>

            <Text style={styles.cardSubtitle}>{item.email}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.acceptButton,
              disabled && styles.actionButtonDisabled,
            ]}
            onPress={() => handleAceptar(item)}
            disabled={disabled}
          >
            <Text style={styles.actionButtonText}>Aceptar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.rejectButton,
              disabled && styles.actionButtonDisabled,
            ]}
            onPress={() => handleRechazar(item)}
            disabled={disabled}
          >
            <Text style={styles.actionButtonText}>Rechazar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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

  const handleAceptar = useCallback(async (item: VoluntarioPendiente) => {
    try {
      setProcessingId(item.id);
      const srcRef = doc(db, PENDIENTES_COL, item.id);
      const dstRef = doc(db, REGISTRADOS_COL, item.id);
      const snap = await getDoc(srcRef);
      if (!snap.exists()) {
        Alert.alert("Aviso", "La solicitud ya no existe.");
        return;
      }

      const data = snap.data();
      const batch = writeBatch(db);
      batch.set(dstRef, {
        ...data,
        isActive: true,
        estado: "aceptado",
        fechaRegistro: serverTimestamp(),
      });
      batch.delete(srcRef);
      await batch.commit();

      Alert.alert(
        "Solicitud aceptada",
        `${item.nombre} ahora es voluntario registrado`
      );
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo aceptar la solicitud.");
    } finally {
      setProcessingId(null);
    }
  }, []);

  const handleRechazar = useCallback(async (item: VoluntarioPendiente) => {
    try {
      setProcessingId(item.id);
      const srcRef = doc(db, PENDIENTES_COL, item.id);
      await deleteDoc(srcRef);
      Alert.alert("Solicitud rechazada", "Solicitud rechazada");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo rechazar la solicitud.");
    } finally {
      setProcessingId(null);
    }
  }, []);

  if (loading) {
    return (
      <View style={[styles.scrollContainer, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text style={styles.loadingText}>Cargando solicitudes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.scrollContainer}>
      <View style={styles.container}>
        <HeaderBack
          title="Solicitudes pendientes"
          onBack={() => navigation.goBack()}
        />
        <View style={styles.divisorline} />

        <View style={styles.form}>
          <Text style={styles.subtitle}>
            Solicitudes pendientes de aprobación
          </Text>

          <FlatList
            data={solicitudes}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={
              solicitudes.length === 0 ? styles.emptyContainer : undefined
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No hay solicitudes pendientes.
              </Text>
            }
            ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#0ea5e9"
              />
            }
          />
        </View>

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
                  <View style={{ marginBottom: 7 }}>
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
                              selectedVoluntario.documentos
                                ?.comprobanteDomicilio
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
    </View>
  );
};

export default SolicitudesScreen;
