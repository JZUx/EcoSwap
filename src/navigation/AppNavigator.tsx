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
import CreateProductScreen from "../screens/main/CreateProductScreen";
import ProductDetailScreen from "../screens/main/ProductDetailScreen";

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
  CreateProduct: { articleId?: string }; 
  ProductDetail: { articleId: string };
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
  // Usuario con sesión: ve el flujo principal + la pantalla modal de crear producto
  <>
  <RootStack.Screen name="MainTabs" component={MainTabs} />
  <RootStack.Screen
    name="CreateProduct"
    component={CreateProductScreen}
    options={{ presentation: "modal" }}
  />
  <RootStack.Screen name="ProductDetail" component={ProductDetailScreen} />
</>
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
