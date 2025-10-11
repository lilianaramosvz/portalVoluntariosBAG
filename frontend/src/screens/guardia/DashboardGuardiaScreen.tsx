//frontend\src\screens\guardia\DashboardGuardiaScreen.tsx

import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
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

type DashboardGuardiaScreenProp = StackNavigationProp<
  GuardiaStackParamList,
  "DashboardGuardia"
>;

const DashboardGuardiaScreen: React.FC = () => {
  const navigation = useNavigation<DashboardGuardiaScreenProp>();
  const { logout } = useAuth();

  // Estados del escáner
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isValidQR, setIsValidQR] = useState<boolean | null>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const handleLogout = () => {
    logout();
  };

  // Manejar el escaneo del QR
  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (!scannedData) {
      // Evitar múltiples lecturas
      setScannedData(data);
      validateQR(data);
      setIsScannerActive(false);
    }
  };

  // Validar el código QR
  const validateQR = (qrData: string) => {
    if (qrData.includes("voluntario") || qrData.includes("BAG")) {
      setIsValidQR(true);
    } else {
      setIsValidQR(false);
    }
  };

  // Iniciar escáner
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

  // Resetear estados
  const resetScanner = () => {
    setIsScannerActive(false);
    setScannedData(null);
    setIsValidQR(null);
  };

  // Renderizar contenido del scanner/resultados
  const renderScannerContent = () => {
    if (isScannerActive) {
      return (
        <CameraView
          style={{ width: 250, height: 250, borderRadius: 25 }}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onBarcodeScanned={handleBarcodeScanned}
        />
      );
    }

    if (scannedData && isValidQR !== null) {
      return (
        <View
          style={[
            styles.resultBox,
            {
              backgroundColor: isValidQR
                ? "#eefcf4ff" // verde claro
                : "#fde2e2ff", // rojo claro
            },
          ]}
        >
          <MaterialIcons
            name={isValidQR ? "check-circle" : "error"}
            size={60}
            paddingBottom={5}
            color={isValidQR ? Colors.text : Colors.text}
          />
          <Text
            style={[
              styles.resultText,
              { color: isValidQR ? Colors.text : Colors.text },
            ]}
          >
            {isValidQR ? "Ingreso válido" : "Ingreso denegado"}
          </Text>
          <Text style={styles.resultSubText}>{scannedData}</Text>
        </View>
      );
    }

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
          {/* Ícono superior */}
          <View style={styles.iconCircle}>
            <MaterialIcons
              name="qr-code-scanner"
              size={33}
              color={Colors.text}
            />
          </View>

          {/* Título */}
          <Text style={styles.title}>Control de acceso</Text>
          <Text style={styles.subtitle}>
            Escanea el código QR del voluntario
          </Text>

          {/* Scanner Box con cámara integrada */}
          <View style={styles.scannerBox}>{renderScannerContent()}</View>

          {/* Botón único */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.scanButton,
                {
                  backgroundColor: scannedData ? Colors.brown : Colors.primary,
                },
              ]}
              onPress={scannedData ? resetScanner : startScanner}
            >
              <Text style={styles.scanButtonText}>
                {scannedData ? "Escanear otro código" : "Iniciar escáner"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Instrucciones */}
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
