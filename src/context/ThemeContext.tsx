// ─────────────────────────────────────────────
// context/ThemeContext.tsx
// Contexto global de tema (claro/oscuro).
// Cualquier pantalla puede leer `colors` de aquí
// para pintarse automáticamente según el modo activo,
// y `toggleTheme` para cambiarlo.
// ─────────────────────────────────────────────

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { lightColors, darkColors, ColorPalette } from "../theme/colors";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  mode: ThemeMode;
  colors: ColorPalette;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Por defecto la app abre en modo claro
  const [mode, setMode] = useState<ThemeMode>("light");

  // Alterna entre claro y oscuro
  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Elegimos la paleta de colores según el modo activo
  const colors = mode === "light" ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ mode, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook para consumir el tema desde cualquier pantalla
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe usarse dentro de un ThemeProvider");
  }
  return context;
};
