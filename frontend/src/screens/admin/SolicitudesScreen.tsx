//frontend\src\screens\admin\SolicitudesScreen.tsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../../styles/screens/admin/SolicitudesStyles";
import { HeaderBack } from "../../components/headerTitle";
import { useNavigation } from "@react-navigation/native";

const SolicitudesScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <HeaderBack 
        title="Solicitudes de voluntarios" 
        onBack={() => navigation.goBack()}
      />
      <View style={styles.divisorline} />
      
        {/* Aquí irá tu contenido de solicitudes */}
      </View>
  );
};

export default SolicitudesScreen;