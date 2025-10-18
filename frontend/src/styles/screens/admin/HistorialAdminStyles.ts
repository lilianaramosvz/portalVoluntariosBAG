// frontend/src/styles/screens/admin/HistorialAdminStyles.ts

import { StyleSheet } from 'react-native';
import { Colors } from '../../colors';
// import { typography } from '../../typography'; // Descomenta si lo usas

export const styles = StyleSheet.create({
  // ✅ Contenedor principal ajustado para dar espacio al header
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20, // Padding solo a los lados para el contenido
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Encabezado de cada sección (fecha)
  sectionHeader: {
    // fontFamily: 'Inter_700Bold', // Descomenta si tienes la fuente
    fontWeight: '700',
    fontSize: 16,
    color: Colors.text, // Un color más legible que el verde
    marginTop: 24,
    marginBottom: 12,
  },

  // Tarjeta individual de asistencia (diseño de la imagen)
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 15,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  // Contenedor del icono (círculo verde claro)
  iconContainer: {
    backgroundColor: 'rgba(0, 153, 81, 0.1)',
    borderRadius: 25, // Para hacerlo un círculo perfecto
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  infoContainer: {
    flex: 1,
  },

  itemName: {
    // fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
  },

  itemDetails: {
    // fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.gray,
    lineHeight: 18,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },

  emptyText: {
    // fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Colors.gray,
    marginTop: 12,
    textAlign: 'center',
  },
});