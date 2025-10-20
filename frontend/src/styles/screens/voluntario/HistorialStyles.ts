//frontend\src\styles\screens\voluntario\HistorialStyles.ts

import { StyleSheet } from "react-native";
import { Colors } from "../../colors";
import { typography } from "../../typography";

export const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    marginVertical: 20,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 18,
    paddingBottom: 30,
    backgroundColor: Colors.background,
  },
  divisorline: {
    height: 1,
    backgroundColor: Colors.text,
    marginVertical: 15,
    alignSelf: "center",
    width: "100%",
    marginBottom: 30,
  },

  //forms, las cajas
  form: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: "center",
    elevation: 3,
  },
  formDia: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    elevation: 3,
    borderColor: Colors.lightGray,
    borderWidth: 1,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    padding: 15,
    marginBottom: 5,
    marginTop: 5,
  },
  formGreen: {
    backgroundColor: Colors.lightGreen,
    borderRadius: 16,
    elevation: 3,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },
  formGray: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 12,
    justifyContent: "space-between",
    marginVertical: 5,
    marginHorizontal: 8,
  },
  formEntrada: {
    backgroundColor: Colors.primary,
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
  },

  //textos
  titleGreen: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: Colors.green,
    backgroundColor: "transparent",
  },
  subtitleGreen: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.primary,
    backgroundColor: "transparent",
  },
  entrada: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.white,
  },
  hora: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.text,
  },
  number: {
    fontSize: 24,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
    color: Colors.primary,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 5,
    lineHeight: 22,
  },
  fecha: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: Colors.text,
    textAlign: "justify",
    marginBottom: 5,
    lineHeight: 22,
  },
  icon: {
    color: Colors.primary,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
});
