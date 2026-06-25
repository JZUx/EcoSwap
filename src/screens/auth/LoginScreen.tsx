// ─────────────────────────────────────────────
// screens/auth/LoginScreen.tsx
// Pantalla de inicio de sesión.
// Incluye validación de email y contraseña, imagen local del logo, y navegación al registro.
// ─────────────────────────────────────────────

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/AuthStack";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { isValidEmail, isValidPassword } from "../../utils/validators";
import colors from "../../theme/colors";
import { useAuth } from "../../context/AuthContext";

// Tipo de navegación para esta pantalla dentro del AuthStack
type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Login">;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  // Función real de login que viene del AuthContext (conectado a Supabase)
  const { signIn } = useAuth();

  // Estados para los campos del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estados para los mensajes de error de cada campo
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Estado de carga mientras Supabase responde
  const [loading, setLoading] = useState(false);

  // Funcion que valida los campos y ejecuta el login
  const handleLogin = async () => {

    // Reinicia errores antes de validar
    setEmailError("");
    setPasswordError("");

    let hasError = false;

    // Validar email
    if (!isValidEmail(email)) {
      setEmailError("Ingresa un correo electrónico válido");
      hasError = true;
    }

    // Validar contraseña
    if (!isValidPassword(password)) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      hasError = true;
    }

    // Si hay errores, no continuar
    if (hasError) return;

    // Llamada real a Supabase Auth
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);

    if (error) {
      // Mostramos el error que devuelve Supabase (ej. credenciales inválidas)
      Alert.alert("No se pudo iniciar sesión", error);
      return;
    }

    // No navegamos manualmente: AppNavigator detecta la sesión
    // automáticamente (a través de onAuthStateChange) y cambia
    // a MainTabs por sí solo.
  };

  return (

    //  Evitamos que el teclado tape los inputs
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo local de EcoSwap */}
        <Image
          source={require("../../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Titulo y subtitulo de bienvenida de la pantalla al iniciar sesion */}
        <Text style={styles.title}>Bienvenido a EcoSwap</Text>
        <Text style={styles.subtitle}>Intercambia, reduce, conecta 🌱</Text>

        {/* Formulario de login */}
        <View style={styles.form}>
          <CustomInput
            label="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            placeholder="ejemplo@correo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            errorMessage={emailError}
          />

          <CustomInput
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry={true}
            errorMessage={passwordError}
          />

          {/* Botón principal de login */}
          <CustomButton
            title="Iniciar sesión"
            onPress={handleLogin}
            loading={loading}
          />

          {/* Botón para ir al registro */}
          <CustomButton
            title="¿No tienes cuenta? Regístrate"
            onPress={() => navigation.navigate("Register")}
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
    alignItems: "center",       // Centra horizontalmente
    justifyContent: "center",   // Centra verticalmente
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 32,
  },
  form: {
    width: "100%",              // El formulario ocupa todo el ancho
  },
});

export default LoginScreen;
