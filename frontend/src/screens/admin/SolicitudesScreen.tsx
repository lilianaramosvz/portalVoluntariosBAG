//frontend\src\screens\admin\SolicitudesScreen.tsx

import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { styles } from "../../styles/screens/admin/SolicitudesStyles";
import { HeaderBack } from "../../components/headerTitle";
import { useNavigation } from "@react-navigation/native";

const SolicitudesScreen: React.FC = () => {
  const navigation = useNavigation();

  return (  
  <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.container}
    >
      <View style={styles.container}>
        <HeaderBack
          title="RSolicitudes de voluntarios"
          onBack={() => navigation.goBack()}
        />
        <View style={styles.divisorline} />
      
        {/* Aquí irá tu contenido de solicitudes */}
      </View>
  </ScrollView> 
  );
};

export default SolicitudesScreen;