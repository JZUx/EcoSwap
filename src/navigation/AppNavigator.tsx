// ─────────────────────────────────────────────
// navigation/AppNavigator.tsx
// Navegador raiz de la aplicación.
// Decide si mostrar el flujo de Auth (Login/Registro)
// o el flujo principal (Tabs) según si el usuario está autenticado o no.
// 
// ─────────────────────────────────────────────

import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";
import { useAuth } from "../context/AuthContext";
import colors from "../theme/colors";

// Rutas raíz: Auth (sin sesión) y MainTabs (con sesión)
export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  // Leemos la sesión real desde el AuthContext (conectado a Supabase)
  const { session, loading } = useAuth();

  // Mientras Supabase revisa si hay una sesión guardada en el
  // dispositivo, mostramos un spinner en vez de parpadear pantallas
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <RootStack.Navigator
      // Si hay sesión activa, arrancamos directo en MainTabs;
      // si no, arrancamos en el flujo de autenticación
      initialRouteName={session ? "MainTabs" : "Auth"}

      // Ocultamos el header aquí porque cada sub-navigator
      // maneja su propio header
      screenOptions={{ headerShown: false }}
    >
      {session ? (
        // Usuario con sesión: solo puede ver el flujo principal
        <RootStack.Screen name="MainTabs" component={MainTabs} />
      ) : (
        // Usuario sin sesión: solo puede ver el flujo de autenticación
        <RootStack.Screen name="Auth" component={AuthStack} />
      )}
    </RootStack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
});

export default AppNavigator;
