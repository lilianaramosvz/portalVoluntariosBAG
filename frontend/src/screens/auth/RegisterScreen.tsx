// frontend\src\screens\auth\RegisterScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { styles } from "../../styles/screens/auth/RegisterStyles";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AuthNavigator";
import  app  from "../../services/firebase";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { DocumentPickerAsset } from "expo-document-picker";

type RegisterScreenProp = StackNavigationProp<RootStackParamList, "Register">;
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);
const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [curp, setCurp] = useState("");
  const [ine, setIne] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [gender, setGender] = useState("");
  const [discapacity, setDiscapacity] = useState("");
  const [business, setBusiness] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigation = useNavigation<RegisterScreenProp>();
  const [ineFile, setIneFile] = useState<DocumentPickerAsset | null>(null);
  const [addressFile, setAddressFile] = useState<DocumentPickerAsset | null>(null);

  const pickIneFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/*"], // PDF o imágenes
    });
    if (!result.canceled) {
      setIneFile(result.assets[0]);
    }
  };

  const pickAddressFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/*"],
    });
    if (!result.canceled) {
      setAddressFile(result.assets[0]);
    }
  };

  const handleRegister = async () => {
  if (
    !email ||
    !password ||
    !confirmPassword ||
    !name ||
    !curp ||
    !ine || 
    !birthDate ||
    !emergencyContact ||
    !gender ||
    !business
  ) {
    alert("Por favor, completa todos los campos con *.");
    return;
  }
  
  if (password !== confirmPassword) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  try {


    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Usuario creado con UID:", user.uid);

    const uploadFile = async (file: DocumentPickerAsset | null, fileName: string) => {
      if (!file) return null;

      const response = await fetch(file.uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `usuarios/${user.uid}/${fileName}`);
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    };

    const ineFileUrl = await uploadFile(ineFile, "ine" + (ineFile ? ineFile.name.substring(ineFile.name.lastIndexOf('.')) : ''));
    const addressFileUrl = await uploadFile(addressFile, "comprobante" + (addressFile ? addressFile.name.substring(addressFile.name.lastIndexOf('.')) : ''));
    console.log("Archivos procesados. Si no se seleccionaron, las URLs serán nulas.");

    await setDoc(doc(db, "Usuarios", user.uid), {
      nombre: name,
      curp: curp,
      email: email,
      numeroIne: ine,
      fechaNacimiento: birthDate,
      contactoEmergencia: emergencyContact,
      genero: gender,
      discapacidad: discapacity,
      empresa: business,
      rol: "voluntario",
      fechaRegistro: new Date(),
      documentos: {
        ine: ineFileUrl, 
        comprobanteDomicilio: addressFileUrl, 
      },
    });
    console.log("Datos del usuario guardados en Firestore.");

    alert("¡Registro completado con éxito!");
    navigation.navigate("Login");

  } catch (error: any) {
    console.error("Error en el registro:", error);
    // Mejora del mensaje de error para problemas de Storage
    if (error.code === 'storage/unauthorized') {
        alert("Error de permisos al subir archivos. Tu cuenta puede no estar verificada aún. El usuario fue creado, pero los archivos no se subieron.");
    } else {
        alert(`Ocurrió un error: ${error.message}`);
    }
  }
};

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.container}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backContainer}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={styles.title}>Registro de voluntarios</Text>
        </TouchableOpacity>

        <View style={styles.divisorline} />

        <View style={styles.form}>
          {/* Nombre */}
          <Text style={styles.label}>Nombre completo *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu nombre completo"
            value={name}
            onChangeText={setName}
          />

          {/* CURP */}
          <Text style={styles.label}>CURP *</Text>
          <TextInput
            style={styles.input}
            placeholder="ABCD123456EFGH01"
            value={curp}
            onChangeText={setCurp}
          />

          {/* Email */}
          <Text style={styles.label}>Correo electrónico *</Text>
          <TextInput
            style={styles.input}
            placeholder="tu@correo.com"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          {/* Número de INE */}
          <Text style={styles.label}>Número de INE *</Text>
          <TextInput
            style={styles.input}
            placeholder="1234567890123"
            value={ine}
            onChangeText={setIne}
            keyboardType="numeric"
          />

          {/* Fecha de nacimiento */}
          <Text style={styles.label}>Fecha de nacimiento *</Text>
          <TextInput
            style={styles.input}
            placeholder="dd/mm/aaaa"
            value={birthDate}
            onChangeText={setBirthDate}
          />

          {/* Contacto de emergencia */}
          <Text style={styles.label}>Contacto de emergencia *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre y teléfono"
            value={emergencyContact}
            onChangeText={setEmergencyContact}
          />

          {/* Género */}
          <Text style={styles.label}>Género *</Text>
          <TextInput
            style={styles.input}
            placeholder="Masculino/Femenino/Otro"
            value={gender}
            onChangeText={setGender}
          />

          {/* Discapacidad */}
          <Text style={styles.label}>¿Tienes alguna discapacidad? *</Text>
          <TextInput
            style={styles.multilineInput}
            placeholder="Describe tu discapacidad a considerar o 'Ninguna'"
            value={discapacity}
            onChangeText={setDiscapacity}
            multiline={true}
            numberOfLines={3}
          />

          {/* Negocio */}
          <Text style={styles.label}>Empresa o independiente *</Text>
          <TextInput
            style={styles.multilineInput}
            placeholder="Nombre de la empresa o 'Independiente'"
            value={business}
            multiline={true}
            onChangeText={setBusiness}
          />

          <Text style={styles.subtitle}>Documentos requeridos</Text>

          {/* Identificación oficial */}
          <Text style={styles.label}>Identificación oficial (INE)</Text>
          <TouchableOpacity style={styles.input} onPress={pickIneFile}>
            <Text style={styles.uploadButtonText}>
              {ineFile ? `✅ ${ineFile}` : "📎   Subir archivo INE"}
            </Text>
          </TouchableOpacity>

          {/* Comprobante de domicilio */}
          <Text style={styles.label}>Comprobante de domicilio *</Text>
          <TouchableOpacity style={styles.input} onPress={pickAddressFile}>
            <Text style={styles.uploadButtonText}>
              {addressFile ? `✅ ${addressFile}` : "📎   Subir comprobante"}
            </Text>
          </TouchableOpacity>

          {/* Contraseña */}
          <Text style={styles.label}>Contraseña *</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Confirmar contraseña */}
          <Text style={styles.label}>Confirmar contraseña *</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {/* Aviso privacidad */}
          <View style={styles.aviso}>
            <TouchableOpacity
              style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}
              onPress={() => setAcceptTerms(!acceptTerms)}
            >
              {acceptTerms && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
            <Text style={styles.avisoText}>
              Acepto el{" "}
              <Text
                style={styles.avisoLink}
                onPress={() => navigation.navigate("AvisoPrivacidad")}
              >
                aviso de privacidad
              </Text>{" "}
              y autorizo el uso de mis datos personales conforme a la norma
              aplicable.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
        >
          <Text style={styles.registerText}>Enviar solicitud</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;
