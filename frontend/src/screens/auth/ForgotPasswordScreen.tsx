//frontend\src\screens\auth\ForgotPasswordScreen.tsx

import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import { styles } from "../../styles/screens/auth/ForgotPasswordStyles";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AuthNavigator";

type ForgotPasswordScreenProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenProp>();
  const [email, setEmail] = useState("");

  function handleCodeSend() {
    if (!email) {
      alert("Por favor ingresa tu correo electrónico.");
      return;
    }
    // Simulate sending a password reset request
    // Replace this with your actual API call
    // Example:
    // await sendPasswordResetEmail(email);

    alert("Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña.");
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backContainer}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Logo */}
      <Image source={require("../../../assets/logo.png")} style={styles.logo} />

      <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
      <Text style={styles.subtitle}>No te preocupes, la puedes recuperar.</Text>

      <Text style={styles.label}>Ingresa tu correo electrónico:</Text>
      <TextInput
        style={styles.input}
        placeholder="tu@correo.com"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity style={styles.registerButton} onPress={handleCodeSend}>
        <Text style={styles.registerText}>Enviar código</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>Te llegará un correo de verificación.</Text>
    </View>
  );
};

export default ForgotPasswordScreen;
