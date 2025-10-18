//frontend\src\styles\screens\voluntario\DashboardStyles.ts

import { StyleSheet } from "react-native";
import { Colors } from "../../colors";
import { typography } from "../../typography";

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 30,
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 35,
  },
  title: {
    fontFamily: "Inter_600SemiBold",
    marginTop: 5,
    textAlign: "center",
    fontSize: 24,
    color: Colors.primary,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    marginTop: 5,
    color: Colors.text,
    textAlign: "center",
    fontSize: 15,
    marginBottom: 30,
  },
card: {
    backgroundColor: Colors.white, 
    borderRadius: 20,
    padding: 35,
    flex: 1,
    marginVertical: 10,
    marginBottom: 25,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20, 
    elevation: 3,
  },
  name: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    marginTop: 8,
    color: Colors.text,
  },
  estadoVoluntario: {
    alignItems: "center",
    backgroundColor: Colors.tertiary, 
    borderRadius: 8,
    elevation: 2,
    marginTop: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderColor: Colors.lightBrown,
    borderWidth: 1,
  },
  estado: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.text,
    textAlign: "center",
  },
  avisoCard: {
    backgroundColor: Colors.tertiary,
    borderRadius: 8,
    elevation: 2,
    marginTop: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  avisoText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    marginTop: 3,
    color: Colors.text,
    padding: 5,
    textAlign: "center",
  },
  subtituloAviso: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.text,
    textAlign: "center",
    padding: 5,
    marginTop: -5,
  },
});

export default styles;
