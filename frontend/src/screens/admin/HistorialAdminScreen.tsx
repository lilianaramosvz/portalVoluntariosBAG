//frontend\src\screens\admin\HistorialAdminScreen.tsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../../styles/screens/admin/HistorialAdminStyles";
import { HeaderBack } from "../../components/headerTitle";
import { useNavigation } from "@react-navigation/native";

const HistorialAdminScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <HeaderBack 
        title="Historial de asistencias" 
        onBack={() => navigation.goBack()}
      />
      <View style={styles.divisorline} />
      
    </View>
  );
};

export default HistorialAdminScreen;