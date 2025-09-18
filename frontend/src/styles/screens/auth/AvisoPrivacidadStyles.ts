//frontend\src\styles\screens\auth\AvisoPrivacidadStyles.ts

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
  backContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingTop: 25,
    flexWrap: "wrap",
    alignContent: "center",
  },
  title: {
    fontFamily: "Inter_400Regular",
    fontSize: 20,
    textAlign: "left",
    paddingLeft: 8,
    color: Colors.green,
    flexWrap: "wrap",
  },
  divisorline: {
    height: 1,
    backgroundColor: Colors.text,
    marginVertical: 15,
    alignSelf: "center",
    width: "100%",
    marginBottom: 30,
  },
  text: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "left",
    paddingLeft: 5,
    lineHeight: 20,
    color: Colors.text,
    flexWrap: "wrap",
    marginBottom: 15,
  },
    form: {
    width: "100%",
    backgroundColor: Colors.white,
    padding: 25,
    borderRadius: 16,
    shadowColor: "#000",
    borderWidth: 0.5,
    borderColor: Colors.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    marginBottom: 5,
  },
});
