//frontend\src\screens\admin\ListaVoluntariosScreen.tsx

import React from "react";
import { View, Text } from "react-native";
import { styles } from "../../styles/screens/admin/ListaVoluntariosStyles";

const ListaVoluntariosScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Voluntarios</Text>
    </View>
  );
};

export default ListaVoluntariosScreen;