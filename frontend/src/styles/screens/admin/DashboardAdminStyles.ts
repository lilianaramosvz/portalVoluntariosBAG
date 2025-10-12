//frontend\src\styles\screens\admin\DashboardAdminStyles.ts

import { StyleSheet } from "react-native";
import { Colors } from "../../colors";
import { typography } from "../../typography";

export const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 30,
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 25,
  },
  containerDisplay: {
    marginTop: 40,
    flex: 1,
  },
  adminTitle:{
    fontFamily: "Inter_600SemiBold",
    fontSize: 22,
    color: Colors.primary,
    flexWrap: "wrap",
    alignContent: "center",
    textAlign: "center",
    marginBottom: 50,
  },
  divisorline: {
    height: 1,
    backgroundColor: Colors.text,
    marginVertical: 15,
    alignSelf: "center",
    width: "100%",
    marginBottom: 30,
  },
  backContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingTop: 25,
    flexWrap: "wrap",
    alignContent: "center",
    justifyContent: "flex-end",
  },
  logoutButton: {
    padding: 8,
    borderRadius: 20,
  },
  card: {
    backgroundColor: Colors.white,
    padding: 25,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    marginBottom: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
  },
  welcomeText: {
    fontFamily: "Inter_400Regular",
    marginTop: 10,
    fontSize: 20,
    fontWeight: "500",
    color: Colors.text,
  },
  button: {
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
    backgroundColor: Colors.white,
    width: "100%",
    elevation: 3,
  },
  buttonText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.text,
    shadowOpacity: 0.05,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
  },
});
