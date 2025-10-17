//frontend\src\styles\screens\admin\HistorialStyles.ts

import { StyleSheet } from "react-native";
import { Colors } from "../../colors";
import { typography } from "../../typography";

export const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.background,
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
  },
  formGreen: {
    backgroundColor: "rgba(235, 255, 238, 0.8)",
    borderRadius: 16,
    elevation: 3,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
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
  number: {
    color: Colors.primary,
    fontSize: 34,
    fontWeight: "bold", 
    marginBottom: 5, 
  },
  description: {
    color: Colors.text, 
    fontSize: 20, 
  }
});


