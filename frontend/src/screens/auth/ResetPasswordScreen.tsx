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
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../styles/screens/auth/ForgotPasswordStyles";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AuthNavigator";

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      Alert.alert("Campo vacío", "Por favor, ingresa tu correo electrónico.");
      return;
    }

    setLoading(true);
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);

      Alert.alert(
        "Revisa tu correo 📩",
        "Te enviamos un enlace para restablecer tu contraseña.",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }]
      );
    } catch (error: any) {
      console.error("Error al enviar correo de restablecimiento:", error);

      if (error.code === "auth/user-not-found") {
        Alert.alert(
          "Usuario no encontrado",
          "No existe una cuenta registrada con ese correo."
        );
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Correo inválido", "Por favor ingresa un correo válido.");
      } else {
        Alert.alert(
          "Error",
          "No se pudo enviar el correo. Inténtalo de nuevo más tarde."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Botón de volver atrás */}
      <TouchableOpacity
        style={styles.backContainer}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Logo */}
      <Image
        source={require("../../../assets/logo.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Restablecer Contraseña</Text>
      <Text style={styles.subtitle}>
        Ingresa tu correo electrónico y te enviaremos un enlace para que
        restablezcas tu contraseña.
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
        style={[styles.registerButton, loading && { opacity: 0.6 }]}
        onPress={handlePasswordReset}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.registerText}>Enviar enlace</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;
