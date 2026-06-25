// ─────────────────────────────────────────────
// Tarjeta reutilizable para mostrar artículos
// disponibles para intercambio en el inicio.
// Muestra: nombre, categoría, ubicación y estado.
// ─────────────────────────────────────────────

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../theme/colors";

// Props que recibe la tarjeta
interface EcoCardProps {
  title: string;        // Nombre del articulo
  category: string;     // Categoria (Ropa, Libros, Electronica...)
  location: string;     // Ubicación del dueño
  isAvailable: boolean; // Si el articulo aun esta disponible
  onPress?: () => void; // Acción al tocar la tarjeta
}

const EcoCard: React.FC<EcoCardProps> = ({
  title,
  category,
  location,
  isAvailable,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Encabezado: título y badge de disponibilidad */}
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>

        {/* Badge de disponibilidad con color condicional */}
        <View style={[
          styles.badge,
          isAvailable ? styles.badgeAvailable : styles.badgeTaken,
        ]}>
          <Text style={styles.badgeText}>
            {isAvailable ? "Disponible" : "Intercambiado"}
          </Text>
        </View>
      </View>

      {/* Pie de la tarjeta: categoría e icono de ubicación */}
      <View style={styles.footer}>
        <Text style={styles.category}>📦 {category}</Text>
        <Text style={styles.location}>📍 {location}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,

    // Sombra para dar profundidad a la tarjeta
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,              // Sombra en Android
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  header: {
    flexDirection: "row",       // Titulo y badge en la misma fila
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeAvailable: {
    backgroundColor: colors.primaryLight, // Verde claro si disponible
  },
  badgeTaken: {
    backgroundColor: "#FFCCBC",           // Naranja claro si ya se intercambió
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  category: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  location: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});

export default EcoCard;
