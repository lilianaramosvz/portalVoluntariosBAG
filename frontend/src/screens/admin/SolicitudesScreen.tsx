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
          title="Solicitudes pendientes"
          onBack={() => navigation.goBack()}
        />
        <View style={styles.divisorline} />
        </View>

        <View style={styles.form}>
          <Text style={styles.subtitle}>Solicitudes pendientes de aprobación</Text>
        </View>
    </ScrollView>
  );
}


export default SolicitudesScreen;