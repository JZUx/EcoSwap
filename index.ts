// ─────────────────────────────────────────────
// index.ts
// Archivo de entrada requerido por Expo/React Native.
// Registra el componente raíz de la aplicación.
// ─────────────────────────────────────────────

import { registerRootComponent } from "expo";
import App from "./App";

// registerRootComponent hace que App sea el componente raíz
// y maneja automáticamente el entorno de desarrollo y producción
registerRootComponent(App);
