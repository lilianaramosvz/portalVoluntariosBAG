//frontend\src\screens\voluntario\QrScreen.tsx

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import QrDisplay from "../../components/QrDisplay";
import { HeaderBack } from "../../components/headerTitle";
import { createAccessToken } from "../../services/qrFunctions";
import styles from "../../styles/screens/voluntario/QrStyles";

const QR_EXPIRY_SECONDS = 300; // 5 minutes

const QrScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [token, setToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [loading, setLoading] = useState(true); // Start as true to show loading while checking auth
  const [timeRemaining, setTimeRemaining] = useState<number>(QR_EXPIRY_SECONDS);
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const auth = getAuth();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthChecked(true);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
      setTimeRemaining(remaining);

      if (remaining === 0) {
        setToken(null);
        setExpiresAt(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const handleGenerateToken = async () => {
    if (!user) {
      Alert.alert("Error", "Debes iniciar sesión para generar un código QR");
      return;
    }

    setLoading(true);
    try {
      const data = await createAccessToken();
      setToken(data.token);
      setExpiresAt(data.expiresAt);
      setTimeRemaining(QR_EXPIRY_SECONDS);
    } catch (error: any) {
      // Extract the error message from Firebase error
      let message = "No se pudo generar el código QR";

      if (error.code === "functions/resource-exhausted") {
        // Rate limit error - show the custom message from backend
        message = error.message;
      } else if (error.message) {
        message = error.message;
      }

      Alert.alert("Error", message);
      console.error("[QrScreen] Error generating token:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <HeaderBack
          title="Código de asistencia"
          onBack={() => navigation.goBack()}
        />
        <View style={styles.divisorline} />

        {/* Timer Card */}
        <View style={styles.card}>
          <Text style={styles.timerLabel}>Tiempo restante para expiración</Text>
          <Text style={styles.timerValue}>{formatTime(timeRemaining)}</Text>
        </View>

        {/* QR Code Card */}
        <View style={styles.qrCard}>
          <Text style={styles.qrTitle}>Tu código de asistencia</Text>

          <View style={styles.qrContainer}>
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#009951" />
                <Text style={styles.loadingText}>
                  {!authChecked
                    ? "Verificando sesión..."
                    : "Generando código..."}
                </Text>
              </View>
            )}

            {!loading && token && <QrDisplay value={token} />}

            {!loading && !token && user && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Presiona el botón para generar tu código QR
                </Text>
              </View>
            )}

            {!loading && !user && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Debes iniciar sesión para generar un código QR
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.instructions}>
            Presenta este código al guardia para registrar tu asistencia.
          </Text>
        </View>

        {/* Renew Button */}
        <Pressable
          style={[styles.button, (loading || !user) && styles.buttonDisabled]}
          onPress={handleGenerateToken}
          disabled={loading || !user}
        >
          <Text style={styles.buttonText}>
            {token ? "Renovar código QR" : "Generar código QR"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default QrScreen;
