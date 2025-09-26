//frontend\src\styles\screens\admin\ListaVoluntariosStyles.ts

import { StyleSheet } from "react-native";
import { Colors } from "../../colors";
import { typography } from "../../typography";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  title: {
    ...typography.title,
    color: Colors.primary,
  },
});
