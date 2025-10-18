//frontend\src\styles\screens\admin\HistorialStyles.ts

import { StyleSheet } from "react-native";
import { Colors } from "../../colors";
import { typography } from "../../typography";

export const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    marginVertical: 30
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
    borderRadius: 16,
    elevation: 3,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  formDia:{
    backgroundColor: Colors.white,
    borderRadius: 16,
    elevation: 3,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    marginHorizontal: 5,
    marginTop: 4
  },
  formGreen: {
    backgroundColor: "rgba(235, 255, 238, 0.8)",
    borderRadius: 16,
    elevation: 3,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  formGray: {
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    padding: 15,
    justifyContent: "center",
    marginHorizontal: 30,
    marginVertical: 5,
    minWidth: 300
  },
  formEntrada: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 70
  },

  //textos
  titleGreen: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    color: Colors.green,
  },
  subtitleGreen:{
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.primary,
  },
  subtitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    lineHeight: 22,
    color: Colors.text,
  },
  entrada: {
    fontFamily: "Inter_600SemiBold", 
    fontSize: 14,
    color: Colors.white,
  },
  hora: {
    fontFamily: "Inter_600SemiBold", 
    fontSize: 18, 
    fontWeight: "bold",
    color: Colors.text
  },
  number: {
    color: Colors.primary,
    fontSize: 34,
    fontWeight: "bold", 
    marginBottom: 5, 
  },
  description: {
    color: Colors.text, 
    fontSize: 20, 
  }, 
  icon: {
    color: Colors.primary
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


