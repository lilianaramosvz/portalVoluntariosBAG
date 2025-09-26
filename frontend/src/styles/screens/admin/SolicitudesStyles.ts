//frontend\src\styles\screens\admin\SolicitudesStyles.ts

import { StyleSheet } from "react-native";
import { Colors } from "../../colors";
import { typography } from "../../typography";

export const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: 18,
    paddingBottom: 30,
  },
  divisorline: {
    height: 1,
    backgroundColor: Colors.text,
    marginVertical: 15,
    alignSelf: "center",
    width: "100%",
    marginBottom: 5,
  },
  form: {
    width: "100%",
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    borderWidth: 0.5,
    borderColor: Colors.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    marginBottom: 30,
  },
  subtitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    lineHeight: 22,
    color: Colors.text,
  },
});
