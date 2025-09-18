// frontend/src/screens/auth/LoginScreen.tsx

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from "react-native";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from '../../services/firebaseConfig';

import { styles } from "../../styles/screens/auth/LoginStyles";

const LoginScreen: React.FC = () => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  const auth = getAuth(app);

  const handleLogin = () => { 
    if (!email || !password) {
      setError("Por favor ingresa tu correo y contraseña.");
      return;
    }
    setLoading(true);
    setError(null);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert("Login exitoso!");
      })
      .catch((e) => {
        let errorMessage = "Ocurrió un error inesperado.";
        switch (e.code) {
          case "auth/user-not-found":
          case "auth/invalid-credential":
            errorMessage = "Correo o contraseña incorrectos.";
            break;
          case "auth/invalid-email":
            errorMessage = "El formato del correo electrónico no es válido.";
            break;
          case "auth/network-request-failed":
            errorMessage = "Error de red. Revisa tu conexión a internet.";
            break;
        }
        setError(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };




    return (
    <View style={styles.container}>
      <Image source={require("../../../assets/logo.png")} style={styles.logo} />

      <Text style={styles.title}>Banco de Alimentos de Guadalajara</Text>
      <Text style={styles.subtitle}>Portal de voluntarios</Text>

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

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>Iniciar sesión</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.newVolunteer}>¿Nuevo voluntario?</Text>
      <TouchableOpacity style={styles.registerButton}>
        <Text style={styles.registerText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;