//frontend\src\screens\admin\ListaVoluntariosScreen.tsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../../styles/screens/admin/ListaVoluntariosStyles";
import { HeaderBack } from "../../components/headerTitle";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";

const ListaVoluntariosScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.container}
    >
      <View style={styles.container}>
        <HeaderBack
          title="Voluntarios registrados"
          onBack={() => navigation.goBack()}
        />
        <View style={styles.divisorline} />
      </View>

      <View style={styles.form}>
        <Text style={styles.subtitle}>
          Lista de voluntarios registrados
        </Text>
      </View>
    </ScrollView>
  );
};

export default ListaVoluntariosScreen;
