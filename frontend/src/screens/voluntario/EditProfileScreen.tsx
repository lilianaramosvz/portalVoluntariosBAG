import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../services/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HeaderBack } from "../../components/headerTitle";
import { styles } from "../../styles/screens/voluntario/EditProfileStyles";
import { VoluntarioStackParamList } from "../../navigation/VoluntarioNavigator";

type EditProfileNavigationProp = StackNavigationProp<
  VoluntarioStackParamList,
  "EditProfile"
>;

const ReadOnlyField: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <View style={styles.readOnlyContainer}>
    <Text style={styles.readOnlyLabel}>{label}</Text>
    <Text style={styles.readOnlyValue}>{value}</Text>
  </View>
);

const EditProfileScreen: React.FC = () => {
  const { user, setUser } = useAuth();
  const navigation = useNavigation<EditProfileNavigationProp>();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.nombre || "");
  const [ine, setIne] = useState(user?.numeroIne || "");
  const [emergencyContact, setEmergencyContact] = useState(
    user?.contactoEmergencia || ""
  );
  const [disability, setDisability] = useState(user?.discapacidad || "Ninguna");

  useEffect(() => {
    if (user) {
      setName(user.nombre || "");
      setIne(user.numeroIne || "");
      setEmergencyContact(user.contactoEmergencia || "");
      setDisability(user.discapacidad || "Ninguna");
    }
  }, [user]);

  const handleSaveChanges = async () => {
    if (!user) return;
    if (!name.trim()) {
      Alert.alert("Error", "El nombre no puede estar vacío.");
      return;
    }

    setLoading(true);
    try {
      const userDocRef = doc(db, "Usuarios", user.uid);
      const updatedData = {
        nombre: name.trim(),
        numeroIne: ine.trim(),
        contactoEmergencia: emergencyContact.trim(),
        discapacidad: disability.trim(),
      };

      await updateDoc(userDocRef, updatedData);
      setUser((prevUser) =>
        prevUser ? { ...prevUser, ...updatedData } : null
      );

      Alert.alert("Éxito", "Tu información ha sido actualizada.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      Alert.alert("Error", "No se pudo actualizar tu información.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderBack title="Editar mi perfil" onBack={() => navigation.goBack()} />
      <View style={styles.divisorline} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainCard}>
            <Text style={styles.data}>Datos:</Text>
            <ReadOnlyField
              label="Correo"
              value={user?.email || "No disponible"}
            />

            <Text style={styles.label}>Nombre completo</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Tu nombre completo"
              editable={!loading}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Número de INE</Text>
            <TextInput
              style={styles.input}
              value={ine}
              onChangeText={setIne}
              placeholder="Número de INE"
              editable={!loading}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Contacto de emergencia</Text>
            <TextInput
              style={styles.input}
              value={emergencyContact}
              onChangeText={setEmergencyContact}
              placeholder="Nombre y teléfono de contacto"
              editable={!loading}
            />

            <Text style={styles.label}>Discapacidad</Text>
            <TextInput
              style={styles.input}
              value={disability}
              onChangeText={setDisability}
              placeholder="Ej: Ninguna, Motriz, Visual"
              editable={!loading}
            />

            <TouchableOpacity
              style={[styles.saveButton, loading && styles.disabledButton]}
              onPress={handleSaveChanges}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.changePasswordButton}
              onPress={() => {
                if (user?.email) {
                  navigation.navigate("ResetPassword", { email: user.email });
                } else {
                  Alert.alert(
                    "Error",
                    "No se pudo obtener tu correo electrónico."
                  );
                }
              }}
              disabled={loading}
            >
              <Text style={styles.changePasswordButtonText}>
                Cambiar Contraseña
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default EditProfileScreen;