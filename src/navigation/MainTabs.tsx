// ─────────────────────────────────────────────
// navigation/MainTabs.tsx
// Navegación por pestañas (Tab Navigator) para la zona principal de la app una vez autenticado.
// Incluye: Home y Perfil.
// Las tabs aparecen en la parte inferior de la pantalla.
// ─────────────────────────────────────────────

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import HomeScreen from "../screens/main/HomeScreen";
import ProfileScreen from "../screens/main/ProfileScreen";
import colors from "../theme/colors";

// Definicion de las rutas del Tab Navigator
export type MainTabsParamList = {
  Home: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({

        // Definimos el ícono de cada tab según el nombre de la ruta
        tabBarIcon: ({ focused }) => {

          // icono emoji segun la tab activa o no
          const icons: Record<string, string> = {
            Home: focused ? "🏠" : "🏡",
            Profile: focused ? "👤" : "👥",
          };
          return <Text style={{ fontSize: 22 }}>{icons[route.name]}</Text>;
        },

        // Colores activos o inactivos de las tabs
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },

        // Estilos del header de cada tab
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.surface,
        headerTitleStyle: { fontWeight: "700" },
      })}
    >
      
      {/* Tab de inicio / feed de artículos */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Inicio" }}
      />

      {/* Tab de perfil del usuario */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Mi Perfil" }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
