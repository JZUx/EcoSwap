// ─────────────────────────────────────────────
// lib/supabase.ts
// Cliente único de Supabase para toda la app.
// Usamos AsyncStorage para que la sesión del usuario
// persista aunque cierre y vuelva a abrir la app.
// ─────────────────────────────────────────────

// Polyfill necesario porque React Native no tiene
// la clase URL completa que supabase-js necesita.
import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Las llaves vienen del archivo .env (no se suben al repo).
// Expo expone automáticamente cualquier variable que empiece
// con EXPO_PUBLIC_ al código del cliente.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Si esto truena, revisa que exista un archivo .env en la raíz
  // del proyecto con EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY
  console.warn(
    "⚠️ Faltan las variables de entorno de Supabase. Revisa tu archivo .env"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Guardamos la sesión en el almacenamiento local del dispositivo
    storage: AsyncStorage,
    // Mantiene la sesión activa entre reinicios de la app
    persistSession: true,
    // Refresca el token automáticamente antes de que expire
    autoRefreshToken: true,
    // No aplica en mobile (es para flujos OAuth en web)
    detectSessionInUrl: false,
  },
});
