// ─────────────────────────────────────────────
// theme/colors.ts
// Paleta de colores global de EcoSwap.
// Ahora soporta modo claro Y modo oscuro.
// El verde de marca (primary/accent) se mantiene igual
// en ambos modos para que la identidad visual no cambie;
// lo que cambia son fondos, superficies y textos.
// ─────────────────────────────────────────────

export interface ColorPalette {
  primary: string;
  primaryLight: string;
  accent: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  error: string;
  success: string;
  border: string;
  tabActive: string;
  tabInactive: string;
}

// Paleta clara (la original del proyecto)
export const lightColors: ColorPalette = {
  primary: "#2E7D32",
  primaryLight: "#A5D6A7",
  accent: "#FF8F00",
  background: "#F9FBF9",
  surface: "#FFFFFF",
  textPrimary: "#1B1B1B",
  textSecondary: "#6B6B6B",
  error: "#D32F2F",
  success: "#388E3C",
  border: "#C8E6C9",
  tabActive: "#2E7D32",
  tabInactive: "#9E9E9E",
};

// Paleta oscura
export const darkColors: ColorPalette = {
  primary: "#4CAF50",
  primaryLight: "#2E7D32",
  accent: "#FFB74D",
  background: "#121212",
  surface: "#1E1E1E",
  textPrimary: "#F2F2F2",
  textSecondary: "#A8A8A8",
  error: "#EF5350",
  success: "#66BB6A",
  border: "#333333",
  tabActive: "#4CAF50",
  tabInactive: "#777777",
};

// Export por defecto: se mantiene para los componentes/navegación
// que todavía no son sensibles al tema (mismo comportamiento de antes)
const colors = lightColors;
export default colors;
