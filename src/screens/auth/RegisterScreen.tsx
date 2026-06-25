// ─────────────────────────────────────────────
// screens/auth/RegisterScreen.tsx
// Pantalla de registro de nuevo usuario.
// Valida nombre, email, telefono, contraseña y confirmacion de contraseña.
// ─────────────────────────────────────────────

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/AuthStack";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import {
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isNotEmpty,
  passwordsMatch,
} from "../../utils/validators";
import colors from "../../theme/colors";
import { useAuth } from "../../context/AuthContext";

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Register">;
};

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  // Función real de registro que viene del AuthContext (conectado a Supabase)
  const { signUp } = useAuth();

  // Estados para cada campo del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados para mensajes de error de cada campo
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const [loading, setLoading] = useState(false);

  // Función que valida todos los campos del registro
  const handleRegister = async () => {

    // Limpiar errores anteriores
    setNameError("");
    setEmailError("");
    setPhoneError("");
    setPasswordError("");
    setConfirmError("");

    let hasError = false;

    // Validar nombre: no debe estar vacío
    if (!isNotEmpty(name)) {
      setNameError("El nombre es obligatorio");
      hasError = true;
    }

    // Validar email con formato correcto
    if (!isValidEmail(email)) {
      setEmailError("Ingresa un correo válido");
      hasError = true;
    }

    // Validar telefono: solo números, 8–15 dígitos
    if (!isValidPhone(phone)) {
      setPhoneError("Ingresa un teléfono válido (8–15 dígitos)");
      hasError = true;
    }

    // Validar contraseña: mínimo 6 caracteres
    if (!isValidPassword(password)) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      hasError = true;
    }

    // Validar que las contraseñas coincidan
    if (!passwordsMatch(password, confirmPassword)) {
      setConfirmError("Las contraseñas no coinciden");
      hasError = true;
    }

    if (hasError) return;

    // Llamada real a Supabase Auth para crear la cuenta
    setLoading(true);
    const { error } = await signUp(email.trim(), password, name.trim());
    setLoading(false);

    if (error) {
      Alert.alert("No se pudo crear la cuenta", error);
      return;
    }

    Alert.alert(
      "¡Cuenta creada!",
      "Revisa tu correo si Supabase requiere confirmación, o inicia sesión directamente.",
      [{ text: "OK", onPress: () => navigation.navigate("Login") }]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Encabezado de la pantalla */}
        <Text style={styles.title}>Crear cuenta</Text>
        <Text style={styles.subtitle}>Únete a la comunidad EcoSwap 🌿</Text>

        {/* Formulario de registro con todos los campos */}
        <View style={styles.form}>

          {/* Campo: nombre completo */}
          <CustomInput
            label="Nombre completo"
            value={name}
            onChangeText={setName}
            placeholder="Tu nombre"
            errorMessage={nameError}
          />

          {/* Campo: correo electronico */}
          <CustomInput
            label="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            placeholder="ejemplo@correo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            errorMessage={emailError}
          />

          {/* Campo: telefono con teclado numérico */}
          <CustomInput
            label="Teléfono"
            value={phone}
            onChangeText={setPhone}
            placeholder="50312345678"
            keyboardType="phone-pad"
            autoCapitalize="none"
            errorMessage={phoneError}
          />

          {/* Campo: contraseña  */}
          <CustomInput
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry={true}
            errorMessage={passwordError}
          />

          {/* Campo: confirmar contraseña */}
          <CustomInput
            label="Confirmar contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Repite tu contraseña"
            secureTextEntry={true}
            errorMessage={confirmError}
          />

          {/* Botón de registro */}
          <CustomButton
            title="Crear cuenta"
            onPress={handleRegister}
            loading={loading}
          />

          {/* Volver al login */}
          <CustomButton
            title="¿Ya tienes cuenta? Inicia sesión"
            onPress={() => navigation.navigate("Login")}
            variant="outline"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 28,
  },
  form: {
    width: "100%",
  },
});

export default RegisterScreen;
