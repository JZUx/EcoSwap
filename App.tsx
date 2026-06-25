// ─────────────────────────────────────────────
// App.tsx
// Punto de entrada principal de la aplicación.
// Aquí envolvemos toda la app con NavigationContainer,
// que es el contexto necesario para que la navegación funcione.
// ─────────────────────────────────────────────

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./src/store/store";
import { AuthProvider } from "./src/context/AuthContext";
import { ThemeProvider } from "./src/context/ThemeContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    // ReduxProvider: da acceso al store global (artículos) a toda la app
    <ReduxProvider store={store}>
      {/* AuthProvider: da acceso a la sesión del usuario a toda la app */}
      <AuthProvider>
        {/* ThemeProvider: da acceso al modo claro/oscuro a toda la app */}
        <ThemeProvider>
          {/* NavigationContainer debe envolver toda la app */}
          {/* Es el "contenedor" que mantiene el estado de navegación */}
          <NavigationContainer>
            {/* Barra de estado del sistema con estilo claro */}
            <StatusBar style="light" />

            {/* Navegador raíz: decide entre Auth y MainTabs */}
            <AppNavigator />
          </NavigationContainer>
        </ThemeProvider>
      </AuthProvider>
    </ReduxProvider>
  );
}
