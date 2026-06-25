// ─────────────────────────────────────────────
// utils/categories.ts
// Lista fija de categorías disponibles para
// publicar un artículo. Centralizada aquí para
// poder reutilizarla en el dropdown y, a futuro,
// en filtros del Home.
// ─────────────────────────────────────────────

export const CATEGORIES = [
  "Electrónica",
  "Ropa",
  "Hogar",
  "Deportes",
  "Libros",
  "Juguetes",
  "Muebles",
  "Otros",
] as const;

export type Category = typeof CATEGORIES[number];