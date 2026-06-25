// ─────────────────────────────────────────────
// components/CustomInput.tsx
// Campo de texto reutilizable con soporte para los siguientes:
// - Tipos de teclado (email, numerico, default)
// - Mostrar/ocultar contraseña
// - Mensajes de error con estilo condicional
// ─────────────────────────────────────────────

import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardTypeOptions,
} from "react-native";
import colors from "../theme/colors";

// Props que recibe el componente
interface CustomInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;            //  campo de contraseña
  keyboardType?: KeyboardTypeOptions;
  errorMessage?: string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder = "",
  secureTextEntry = false,
  keyboardType = "default",
  errorMessage = "",
  autoCapitalize = "sentences",
}) => {

  // Estado para alternar visibilidad de la contraseña
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Ocultar texto solo si es contraseña y no se activa la visibilidad
  const hideText = secureTextEntry && !isPasswordVisible;

  return (
    <View style={styles.container}>
      {/* Label del campo */}
      <Text style={styles.label}>{label}</Text>

      {/* Contenedor del input con estilo condicional (error o normal) */}
      <View style={[
        styles.inputWrapper,
        errorMessage ? styles.inputError : styles.inputNormal,
      ]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={hideText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />

        {/* Boton ojo: solo aparece en campos de contraseña */}
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeButton}
          >
            <Text style={styles.eyeText}>
              {isPasswordVisible ? "🙈" : "👁️"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Mensaje de error: visible solo cuando hay un problema */}
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",       // Input y botón ojo en la misma fila
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 10,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
  },
  inputNormal: {
    borderColor: colors.border,
  },
  inputError: {
    borderColor: colors.error,  // Borde rojo si hay error en el campo
  },
  input: {
    flex: 1,                    // Ocupa todo el espacio disponible
    height: 48,
    fontSize: 15,
    color: colors.textPrimary,
  },
  eyeButton: {
    paddingLeft: 8,
  },
  eyeText: {
    fontSize: 18,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: colors.error,
  },
});

export default CustomInput;
