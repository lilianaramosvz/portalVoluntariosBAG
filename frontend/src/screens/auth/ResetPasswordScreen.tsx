// frontend/src/screens/auth/ForgotPasswordScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { styles } from "../../styles/screens/auth/ForgotPasswordStyles";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AuthNavigator";

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert("Campo vacío", "Por favor, ingresa tu correo electrónico.");
      return;
    }

    setLoading(true);
    try {
      const auth = getAuth();
      // Esta es la función clave de Firebase
      await sendPasswordResetEmail(auth, email);

      Alert.alert(
        "Revisa tu Correo",
        "Se ha enviado un enlace a tu correo electrónico para restablecer tu contraseña.",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }]
      );
    } catch (error: any) {
      console.error("Error al enviar correo de restablecimiento:", error);
      // Maneja errores comunes para dar una mejor respuesta al usuario
      if (error.code === 'auth/user-not-found') {
        Alert.alert("Usuario no encontrado", "No existe una cuenta registrada con ese correo electrónico.");
      } else {
        Alert.alert("Error", "No se pudo enviar el correo de restablecimiento. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backContainer}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Image
        source={require("../../../assets/logo.png")} // Asegúrate de que la ruta del logo sea correcta
        style={styles.logo}
      />
      <Text style={styles.title}>Recuperar Contraseña</Text>
      <Text style={styles.subtitle}>
        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
      </Text>

      <Text style={styles.label}>Correo electrónico:</Text>
      <TextInput
        style={styles.input}
        placeholder="tu@correo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity
        style={styles.registerButton}
        onPress={handlePasswordReset}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.registerText}>Enviar Enlace</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;