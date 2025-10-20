//frontend\src\styles\screens\admin\ListaVoluntariosStyles.ts

import { StyleSheet } from "react-native";
import { Colors } from "../../colors";
import { typography } from "../../typography";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
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
    width: "100%",
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 8,
    shadowColor: Colors.text,
    borderWidth: 0.5,
    borderColor: Colors.gray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    marginBottom: 12,
    marginTop: 3,
  },
  subtitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 10,
    color: Colors.text,
  },
  centeredContainer: {
    // used with ActivityIndicator
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    // view when no volunteers
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  emailText: {
    fontSize: 12,
    color: Colors.text,
    marginBottom: 2,
  },
  modalOverlay: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 16,
    padding: 20,
    maxHeight: "80%",
    width: "90%",
  },
  modalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  closeButton: {
    padding: 5,
    color: Colors.gray,
  },
  loadingDetails: {
    alignItems: "center",
    padding: 20,
  },
  modalLoadingText: {
    marginTop: 10,
    color: Colors.gray,
  },
  fieldRow: {
    marginBottom: 5,
  },
  fieldLabel: {
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.text,
  },
  fieldValue: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "Colors.text",
    marginTop: 2,
    marginLeft: 2,
  },
  documentRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 5,
  },
  documentRowNoMargin: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  imageFont: {
    marginLeft: 10,
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.text,
  },
  mainCard: {
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
    marginBottom: 5,
  },
  mainCardTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    marginBottom: 15,
    color: Colors.text,
    textAlign: "left",
  },
  deleteButton: {
    backgroundColor: Colors.lightRed, 
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 25,
    marginBottom: 15,
  },
  deleteButtonText: {
    color: Colors.white,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 10,
  },
  curpText: {
    fontSize: 10,
    color: Colors.gray,
    fontFamily: "Inter_400Regular",
    lineHeight: 15,
  },
  nombreText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors.text,
    marginBottom: 2,
    lineHeight: 22,
  },
});
