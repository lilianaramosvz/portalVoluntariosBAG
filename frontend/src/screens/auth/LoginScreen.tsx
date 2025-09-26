// frontend\src\screens\auth\LoginScreen.tsx

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../../services/firebaseConfig";

import { styles } from "../../styles/screens/auth/LoginStyles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigation/AuthNavigator";
import { useAuth } from "../../context/AuthContext";

type LoginScreenProp = StackNavigationProp<RootStackParamList, "Login">;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenProp>();
  const { login, isLoading, loginError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showValidationError, setShowValidationError] = useState(false);

  const handleLogin = async () => { 
    if (!email.trim() || !password.trim()) {
      setShowValidationError(true);
      return;
    }
    
    setShowValidationError(false);
    await login(email, password);
    // El AuthContext manejará automáticamente la navegación por rol y los errores
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require("../../../assets/logo.png")} style={styles.logo} />

      {/* Títulos */}
      <Text style={styles.title}>Banco de Alimentos de Guadalajara</Text>
      <Text style={styles.subtitle}>Portal de voluntarios</Text>

      {/* Formulario */}
      <View style={styles.form}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="tu@correo.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="******"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {showValidationError && (
          <Text style={styles.error}>Por favor ingresa tu correo y contraseña.</Text>
        )}
        
        {loginError && <Text style={styles.error}>{loginError}</Text>}

        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginText}>
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Text>
        </TouchableOpacity>
      </View>
     

      {/* Registro */}
      <Text style={styles.newVolunteer}>¿Nuevo voluntario?</Text>
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.registerText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
