// frontend/src/styles/screens/admin/HistorialAdminStyles.ts

import { StyleSheet } from "react-native";
import { Colors } from "../../colors";
import { typography } from "../../typography";

export const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
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
    marginBottom: 10,
    color: Colors.text,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Encabezado de cada sección (fecha)
  sectionHeader: {
    fontFamily: "Inter_400Regular", // Descomenta si tienes la fuente
    fontSize: 13,
    color: Colors.text, // Un color más legible que el verde
    marginTop: 8,
    marginBottom: 5,
    marginLeft: 12,
  },

  // Tarjeta individual de asistencia (diseño de la imagen)
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 0.5,
    borderColor: Colors.gray,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },

  // Contenedor del icono (círculo verde claro)
  iconContainer: {
    backgroundColor: "#0099511a",
    borderRadius: 25, // Para hacerlo un círculo perfecto
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  infoContainer: {
    flex: 1,
  },

  itemName: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
    lineHeight: 22,
  },

  itemDetails: {
    fontFamily: "Inter_300Light",
    fontSize: 11,
    color: Colors.gray,
    lineHeight: 18,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: Colors.gray,
    marginTop: 12,
    textAlign: "center",
  },
});
