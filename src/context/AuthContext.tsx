// ─────────────────────────────────────────────
// context/AuthContext.tsx
// Contexto global de autenticación.
// Aquí vive el estado de sesión de TODA la app:
// - Quién es el usuario actual (o null si no hay sesión)
// - Funciones para registrarse, iniciar sesión y cerrar sesión
// - Un estado "loading" mientras Supabase revisa si ya hay
//   una sesión guardada en el dispositivo (sesión persistente)
// ─────────────────────────────────────────────

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

// Forma de los datos y funciones que expone el contexto
interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean; // true mientras se verifica la sesión guardada
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: string | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

// Creamos el contexto (inicia undefined, se llena con el Provider)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1) Al abrir la app, preguntamos a Supabase si ya hay
    //    una sesión guardada en el dispositivo (AsyncStorage)
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // 2) Nos suscribimos a cambios de sesión (login, logout,
    //    token refrescado, etc.) para mantener todo sincronizado
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    // Limpieza: cancelamos la suscripción al desmontar
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Registro de nuevo usuario
  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Guardamos el nombre como metadata del usuario
        data: { full_name: fullName },
      },
    });

    if (error) return { error: error.message };
    return { error: null };
  };

  // Inicio de sesión
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { error: error.message };
    return { error: null };
  };

  // Cierre de sesión
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook para consumir el contexto fácilmente desde cualquier pantalla
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
