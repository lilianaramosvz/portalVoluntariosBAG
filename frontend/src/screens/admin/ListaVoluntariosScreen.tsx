//frontend\src\screens\admin\ListaVoluntariosScreen.tsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../../styles/screens/admin/ListaVoluntariosStyles";
import { HeaderBack } from "../../components/headerTitle";
import { useNavigation } from "@react-navigation/native";

const ListaVoluntariosScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <HeaderBack 
        title="Voluntarios registrados" 
        onBack={() => navigation.goBack()}
      />
      <View style={styles.divisorline} />
      
    </View>
  );
};

export default ListaVoluntariosScreen;