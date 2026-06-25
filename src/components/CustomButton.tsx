// ─────────────────────────────────────────────
// components/CustomButton.tsx
// Botón reutilizable con dos variantes:
// - "primary": fondo verde (acción principal)
// - "outline": solo borde (acción secundaria)
// También soporta estado de carga (loading).
// ─────────────────────────────────────────────

import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from "react-native";
import colors from "../theme/colors";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline"; // Estilo del botón
  loading?: boolean;               // Muestra spinner si está cargando
  disabled?: boolean;              // Desactiva el botón
  style?: ViewStyle;               // Estilos adicionales opcionales
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
}) => {

  // El botón se desactiva si está cargando o si disabled=true
  const isDisabled = loading || disabled;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.base,

        // Estilo condicional según la variante elegida
        variant === "primary" ? styles.primary : styles.outline,

        // Reduce la opacidad si está desactivado
        isDisabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.8}
    >
    
      {/* Si está cargando, muestra spinner; si no, muestra el texto */}
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? colors.surface : colors.primary}
        />
      ) : (
        <Text
          style={[
            styles.text,

            // Color de texto según variante
            variant === "outline" && styles.textOutline,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",  // Centra verticalmente
    alignItems: "center",       // Centra horizontalmente
    marginVertical: 6,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.surface,     // Texto blanco en botón primario
  },
  textOutline: {
    color: colors.primary,     // Texto verde en botón outline
  },
});

export default CustomButton;
