//frontend\src\styles\screens\voluntario\QrStyles.ts

import { StyleSheet } from "react-native";
import { Colors } from "../../colors";
import { typography } from "../../typography";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 35,
    paddingBottom: 25,
  },
  divisorline: {
    height: 1,
    backgroundColor: Colors.text,
    marginVertical: 15,
    alignSelf: "center",
    width: "100%",
    marginBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 28,
    color: Colors.primary,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Inter_400Regular",
    color: Colors.primary,
    marginLeft: 8,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timerLabel: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 8,
    shadowOpacity: 0.05,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    lineHeight: 22,
  },
  timerValue: {
    fontSize: 24,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
    color: Colors.primary,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  qrCard: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 10,
  },
  qrTitle: {
    fontSize: 18,
    fontFamily: "Inter_500Medium",
    color: Colors.text,
    textAlign: "center",
    marginBottom: 12,
  },
  qrContainer: {
    minHeight: 250,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  loadingContainer: {
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.text,
    fontFamily: "Inter_400Regular",
  },
  emptyContainer: {
    padding: 40,
  },
  emptyText: {
    fontSize: 13,
    color: Colors.gray,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
  },
  instructions: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: Colors.text,
    textAlign: "center",
    lineHeight: 22,
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
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.text,
    shadowOpacity: 0.05,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
  },
});

export default styles;
