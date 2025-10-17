import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../../styles/screens/voluntario/HistorialStyles";
import { HeaderBack } from "../../components/headerTitle";

export default function HistorialScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flex: 1, justifyContent: "space-between", padding: 18 }}>
        <HeaderBack
          title="Historial de asistencias"
          onBack={() => navigation.goBack()}
        />

        <View style={styles.divisorline} />
  
        <View style={styles.form}>
          <Text style={styles.number}>2</Text>
          <Text style={styles.description}>Días de voluntariado registrados</Text>
        </View>

        {/* Espaciador para las cajas del medio */}
        <View style={{ flex: 1 }} />

        {/* Última caja */}
        <View style={styles.formGreen}>
          <Text style={styles.titleGreen}>Estadísticas</Text>
          <Text style={styles.number}>4</Text>
          <Text style={styles.subtitleGreen}>Total Entradas</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
