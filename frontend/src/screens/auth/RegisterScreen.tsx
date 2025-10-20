// frontend\src\screens\auth\RegisterScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import { styles } from "../../styles/screens/auth/RegisterStyles";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AuthNavigator";
import { app } from "../../services/firebaseConfig";
import { createUserWithEmailAndPassword, getAuth, fetchSignInMethodsForEmail, signOut } from "firebase/auth";

import { doc, getFirestore, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { DocumentPickerAsset } from "expo-document-picker";
import { HeaderBack } from "../../components/headerTitle";
import { validateEmail, validatePassword, validateCURP, validateINE, validateName, validatePhone, validateDate } from "../../utils/validators";
import { SecureErrorHandler } from "../../utils/errorHandler";

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
  const [ineFile, setIneFile] = useState<DocumentPickerAsset | null>(null);
  const [addressFile, setAddressFile] = useState<DocumentPickerAsset | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const navigation = useNavigation<RegisterScreenProp>();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Validar nombre
    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error || 'Nombre inválido';
    }

    // Validar email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error || 'Email inválido';
    }

    // Validar CURP
    const curpValidation = validateCURP(curp);
    if (!curpValidation.isValid) {
      newErrors.curp = curpValidation.error || 'CURP inválido';
    }

    // Validar INE
    const ineValidation = validateINE(ine);
    if (!ineValidation.isValid) {
      newErrors.ine = ineValidation.error || 'INE inválido';
    }

    // Validar contraseña
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message || 'Contraseña inválida';
    }

    // Validar confirmación de contraseña
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validar fecha
    const dateValidation = validateDate(birthDate);
    if (!dateValidation.isValid) {
      newErrors.birthDate = dateValidation.error || 'Fecha inválida';
    }

    // Validar campos requeridos
    if (!emergencyContact.trim()) {
      newErrors.emergencyContact = 'Contacto de emergencia requerido';
    }

    if (!gender) {
      newErrors.gender = 'Género requerido';
    }

    if (!discapacity.trim()) {
      newErrors.discapacity = 'Campo requerido';
    }

    if (!business.trim()) {
      newErrors.business = 'Campo requerido';
    }

    if (!ineFile) {
      newErrors.ineFile = 'Archivo INE requerido';
    }

    if (!addressFile) {
      newErrors.addressFile = 'Comprobante de domicilio requerido';
    }

    if (!acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar el aviso de privacidad';
    }

    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const formatCURP = (text: string) => {
    // Convert to uppercase and remove non-alphanumeric characters
    const cleaned = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Limit to 18 characters (CURP length)
    return cleaned.slice(0, 18);
  };

  const formatINE = (text: string) => {
    // Remove non-numeric characters
    const cleaned = text.replace(/\D/g, '');
    
    // Limit to 13 digits
    return cleaned.slice(0, 13);
  };

  const formatDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    
    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 4) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    }
  };

  const handleDateChange = (text: string) => {
    const formatted = formatDate(text);
    setBirthDate(formatted);
  };

  const handleCURPChange = (text: string) => {
    const formatted = formatCURP(text);
    setCurp(formatted);
  };

  const handleINEChange = (text: string) => {
    const formatted = formatINE(text);
    setIne(formatted);
  };

  const selectGender = (selectedGender: string) => {
    setGender(selectedGender);
    setShowGenderPicker(false);
  };


  const pickIneFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/*"],
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
    console.log('🔵 handleRegister called');
    
    // Usar validación mejorada
    const validation = validateForm();
    console.log('🔵 Form validation result:', validation.isValid);
    
    if (!validation.isValid) {
      console.log('❌ Validation failed');
      console.log('❌ Errors:', validation.errors);
      
      // Mostrar los errores al usuario
      const errorMessages = Object.entries(validation.errors)
        .map(([field, message]) => `• ${message}`)
        .join('\n');
      
      alert(`Por favor corrige los siguientes errores:\n\n${errorMessages}`);
      return;
    }

    console.log('✅ Validation passed, starting registration');

    try {
      setIsRegistering(true);

      // Verificar si el email ya existe
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        setErrors({ email: 'Este correo electrónico ya está registrado. Usa otro correo o inicia sesión.' });
        return;
      }

      // Crear la cuenta
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Subir archivos ANTES del logout (usuario necesita estar autenticado)
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

      // Guardar datos en Firestore
      await setDoc(doc(db, "voluntariosPendientes", user.uid), {
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
        isActive: false, // Inactivo hasta que admin apruebe
        estado: "pendiente"
      });

      // Logout DESPUÉS de subir archivos y guardar datos
      await signOut(auth);

      alert("¡Registro completado con éxito! Tu cuenta está pendiente de aprobación. Recibirás un correo cuando sea aprobada.");


    } catch (error: any) {
      console.error("Error en el registro:", error);
      
      try {
        await signOut(auth);
      } catch (logoutError) {
        console.error("Error al hacer logout después de error:", logoutError);
      }
      
      // Usar SecureErrorHandler para manejar errores de forma segura
      const userMessage = SecureErrorHandler.handleAuthError(error, 'REGISTER');
      alert(userMessage);
    } finally {
      setIsRegistering(false);
    }
  };

  if (isRegistering) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: "#FEFFF6",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <ActivityIndicator size="large" color="#009951" />
        <Text style={{ marginTop: 10, fontSize: 16, color: "#666" }}>
          Registrando...
        </Text>
      </View>
    );
  }


  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
      <View style={styles.container}>
        <HeaderBack
          title="Registro de voluntarios"
          onBack={() => navigation.goBack()}
        />
        <View style={styles.divisorline} />

        <View style={styles.form}>
          <Text style={styles.label}>Nombre completo *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu nombre completo"
            value={name}
            onChangeText={setName}
          />
          {errors.name && <Text style={{color: 'red', fontSize: 12, marginTop: 4}}>{errors.name}</Text>}

          <Text style={styles.label}>CURP *</Text>
          <TextInput
            style={styles.input}
            placeholder="ABCD123456HEFGHIJ01"
            value={curp}
            onChangeText={handleCURPChange}
            maxLength={18}
            autoCapitalize="characters"
          />

          <Text style={styles.label}>Correo electrónico *</Text>
          <TextInput
            style={styles.input}
            placeholder="tu@correo.com"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Número de INE *</Text>
          <TextInput
            style={styles.input}
            placeholder="1234567890123"
            value={ine}
            onChangeText={handleINEChange}
            keyboardType="numeric"
            maxLength={13}
          />

          <Text style={styles.label}>Fecha de nacimiento *</Text>
          <TextInput
            style={styles.input}
            placeholder="DD/MM/AAAA"
            value={birthDate}
            onChangeText={handleDateChange}
            keyboardType="numeric"
            maxLength={10}
          />

          <Text style={styles.label}>Contacto de emergencia *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre y teléfono"
            value={emergencyContact}
            onChangeText={setEmergencyContact}
          />

          <Text style={styles.label}>Género *</Text>
          <TouchableOpacity style={styles.input} onPress={() => setShowGenderPicker(true)}>
            <Text style={[styles.uploadButtonText, { color: gender ? "#000" : "#999" }]}>
              {gender || "Selecciona tu género"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>¿Tienes alguna discapacidad? *</Text>
          <TextInput
            style={styles.multilineInput}
            placeholder="Describe tu discapacidad a considerar o 'Ninguna'"
            value={discapacity}
            onChangeText={setDiscapacity}
            multiline={true}
            numberOfLines={3}
          />

          <Text style={styles.label}>Empresa o independiente *</Text>
          <TextInput
            style={styles.multilineInput}
            placeholder="Nombre de la empresa o 'Independiente'"
            value={business}
            multiline={true}
            onChangeText={setBusiness}
          />

          <Text style={styles.subtitle}>Documentos requeridos</Text>

          <Text style={styles.label}>Identificación oficial (INE) *</Text>
          <TouchableOpacity style={styles.input} onPress={pickIneFile}>
            <Text style={styles.uploadButtonText}>
              {ineFile ? `✅ ${ineFile.name}` : "📎   Subir archivo INE"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Comprobante de domicilio *</Text>
          <TouchableOpacity style={styles.input} onPress={pickAddressFile}>
            <Text style={styles.uploadButtonText}>
              {addressFile ? `✅ ${addressFile.name}` : "📎   Subir comprobante"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.label}>Contraseña *</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.label}>Confirmar contraseña *</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

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
              y autorizo el uso de mis datos personales conforme a la norma aplicable.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.registerButton, isRegistering && { opacity: 0.6 }]}
          onPress={handleRegister}
          disabled={isRegistering}
        >
          <Text style={styles.registerText}>
            {isRegistering ? "Registrando..." : "Enviar solicitud"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Gender Picker Modal */}
      <Modal
        visible={showGenderPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowGenderPicker(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <View style={{
            backgroundColor: "white",
            borderRadius: 16,
            padding: 20,
            width: "80%",
            maxWidth: 300,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: "600",
              marginBottom: 20,
              textAlign: "center",
            }}>
              Selecciona tu género
            </Text>

            {["Masculino", "Femenino", "Otro"].map((option) => (
              <TouchableOpacity
                key={option}
                style={{
                  padding: 15,
                  borderBottomWidth: option !== "Otro" ? 1 : 0,
                  borderBottomColor: "#eee",
                }}
                onPress={() => selectGender(option)}
              >
                <Text style={{
                  fontSize: 16,
                  textAlign: "center",
                  color: gender === option ? "#009951" : "#333",
                  fontWeight: gender === option ? "600" : "400",
                }}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={{
                marginTop: 15,
                padding: 10,
                alignItems: "center",
              }}
              onPress={() => setShowGenderPicker(false)}
            >
              <Text style={{ color: "#666", fontSize: 16 }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default RegisterScreen;