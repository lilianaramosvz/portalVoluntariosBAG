//frontend\src\screens\admin\InformacionPerfilScreen.tsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../../styles/screens/admin/HistorialAdminStyles";
import { HeaderBack } from "../../components/headerTitle";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";

const InformacionPerfil: React.FC = () => {
  const navigation = useNavigation();

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.container}
    >
      <View style={styles.container}>
        <HeaderBack
          title="Información del perfil"
          onBack={() => navigation.goBack()}
        />
        <View style={styles.divisorline} />
      </View>

      <View style={styles.form}>
        <Text style={styles.subtitle}>
          Información del perfil del voluntario
        </Text>
      </View>
    </ScrollView>
  );
};

export default InformacionPerfil;
