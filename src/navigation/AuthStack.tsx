// ─────────────────────────────────────────────
// navigation/AuthStack.tsx
// Stack de navegación para la zona de autenticación.
// Contiene las pantallas: Login y Registro.
// ─────────────────────────────────────────────

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import colors from "../theme/colors";

// Definicion de las rutas del AuthStack y sus parámetros

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Creamos el Stack Navigator tipado con nuestras rutas
const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
    
      // La primera pantalla que se muestra al entrar al auth
      initialRouteName="Login"
      screenOptions={{
        // Estilo del encabezado compartido para todas las pantallas del stack
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.surface,         // Color del botón "atrás" y texto
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      {/* Pantalla de Login */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Iniciar sesión" }}
      />

      {/* Pantalla de Registro */}
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "Crear cuenta" }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
