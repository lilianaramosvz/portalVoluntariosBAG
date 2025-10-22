//frontend\src\screens\guardia\DashboardGuardiaScreen.tsx

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { styles } from "../../styles/screens/guardia/DashboardGuardiaStyles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../../context/AuthContext";
import { HeaderLogout } from "../../components/headerTitle";
import { Colors } from "../../styles/colors";
import { CameraView, useCameraPermissions } from "expo-camera";
import { GuardiaStackParamList } from "../../navigation/GuardiaNavigator";
import Feather from "@expo/vector-icons/build/Feather";
import { redeemAccessToken } from "../../services/qrFunctions";

type DashboardGuardiaScreenProp = StackNavigationProp<
  GuardiaStackParamList,
  "DashboardGuardia"
>;

const DashboardGuardiaScreen: React.FC = () => {
  const navigation = useNavigation<DashboardGuardiaScreenProp>();
  const { logout } = useAuth();

  const [isScannerActive, setIsScannerActive] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isValidQR, setIsValidQR] = useState<boolean | null>(null);
  const [volunteerName, setVolunteerName] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const isProcessing = useRef(false);

  const handleLogout = () => {
    logout();
  };

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (isProcessing.current) {
      return;
    }
    isProcessing.current = true;

    setIsValidating(true);
    setScannedData(data);
    setIsScannerActive(false);
    validateQR(data);
  };

  const validateQR = async (token: string) => {
    try {
      const result = await redeemAccessToken(token);
      if (result.success) {
        setIsValidQR(true);
        setVolunteerName(result.volunteer?.name || "Voluntario");
        Alert.alert(
          "✅ Acceso permitido",
          `Voluntario: ${
            result.volunteer?.name || "Desconocido"
          }\n\nAsistencia registrada correctamente.`,
          [{ text: "OK" }]
        );
      }
    } catch (error: any) {
      setIsValidQR(false);
      setVolunteerName(null);

      let errorMessage = "Código QR inválido";
      if (error.code === "functions/not-found") {
        errorMessage = "Código QR no válido";
      } else if (error.code === "functions/failed-precondition") {
        if (error.message.includes("expired"))
          errorMessage = "Código QR expirado";
        else if (error.message.includes("used"))
          errorMessage = "Código QR ya fue utilizado";
        else if (error.message.includes("deactivated"))
          errorMessage = "Código QR desactivado";
      } else if (error.code === "functions/permission-denied") {
        errorMessage = "No tienes permiso para validar códigos QR";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("❌ Acceso denegado", errorMessage, [{ text: "OK" }]);
    } finally {
      setIsValidating(false);
    }
  };

  const startScanner = async () => {
    if (!permission?.granted) {
      const response = await requestPermission();
      if (!response.granted) {
        Alert.alert(
          "Permiso requerido",
          "Se necesita acceso a la cámara para escanear códigos QR"
        );
        return;
      }
    }
    resetScanner();
    setIsScannerActive(true);
  };

  const resetScanner = () => {
    setIsScannerActive(false);
    setScannedData(null);
    setIsValidQR(null);
    setIsValidating(false);
    isProcessing.current = false;
  };

  const renderScannerContent = () => {
    // Si la cámara está activa, mostrarla.
    if (isScannerActive) {
      return (
        <CameraView
          style={{ width: 250, height: 250, borderRadius: 25 }}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={handleBarcodeScanned}
        />
      );
    }

    // Si se está validando, mostrar SIEMPRE la pantalla de carga.
    if (isValidating) {
      return (
        <View style={styles.QRBox}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={[styles.resultSubText, { marginTop: 12 }]}>
            Validando código...
          </Text>
        </View>
      );
    }

    // Si no se está validando y hay datos escaneados, mostrar el resultado final.
    if (scannedData) {
      return (
        <View
          style={[
            styles.resultBox,
            { backgroundColor: isValidQR ? "#eefcf4ff" : "#fde2e2ff" },
          ]}
        >
          <MaterialIcons
            name={isValidQR ? "check-circle" : "error"}
            size={60}
            paddingBottom={5}
            color={isValidQR ? Colors.primary : Colors.secondary}
          />
          <Text
            style={[
              styles.resultText,
              { color: isValidQR ? Colors.primary : Colors.secondary },
            ]}
          >
            {isValidQR ? "Acceso permitido" : "Acceso denegado"}
          </Text>
          {isValidQR && volunteerName && (
            <Text
              style={[
                styles.resultSubText,
                { fontWeight: "600", marginTop: 8 },
              ]}
            >
              {volunteerName}
            </Text>
          )}
        </View>
      );
    }

    //Si no ha pasado nada, mostrar el ícono de cámara por defecto.
    return (
      <View style={styles.QRBox}>
        <Feather name="camera" size={50} color={Colors.gray} />
      </View>
    );
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <HeaderLogout title="Escáner QR" onLogout={handleLogout} />
        <View style={styles.divisorline} />
      </View>

      <View style={styles.containerView}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <MaterialIcons
              name="qr-code-scanner"
              size={33}
              color={Colors.text}
            />
          </View>

          <Text style={styles.title}>Control de acceso</Text>
          <Text style={styles.subtitle}>
            Escanea el código QR del voluntario
          </Text>

          <View style={styles.scannerBox}>{renderScannerContent()}</View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.scanButton,
                {
                  backgroundColor: scannedData ? Colors.brown : Colors.primary,
                  opacity: isValidating ? 0.6 : 1,
                },
              ]}
              onPress={scannedData ? resetScanner : startScanner}
              disabled={isValidating}
            >
              <Text style={styles.scanButtonText}>
                {scannedData ? "Escanear otro código" : "Iniciar escáner"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.instructionsBox}>
            <Text style={styles.instructionsTitle}>Instrucciones:</Text>
            <Text style={styles.instructionsText}>
              1. Presiona "Iniciar escáner" para activar la cámara.
            </Text>
            <Text style={styles.instructionsText}>
              2. Centra el código QR en el recuadro.
            </Text>
            <Text style={styles.instructionsText}>
              3. El resultado se mostrará automáticamente. Permite el acceso
              sólo si es válido.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default DashboardGuardiaScreen;
