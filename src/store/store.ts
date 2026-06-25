// ─────────────────────────────────────────────
// store/store.ts
// Configuración central del store de Redux.
// Aquí se registran todos los "slices" de la app.
// Por ahora solo tenemos "articles", pero si EcoSwap
// crece (ej. notificaciones, chats), sus slices
// se agregarían aquí también.
// ─────────────────────────────────────────────

import { configureStore } from "@reduxjs/toolkit";
import articlesReducer from "./articlesSlice";
import profileReducer from "./profileSlice";

export const store = configureStore ({
  reducer: {
    articles: articlesReducer,
    profile: profileReducer,
  },
});

// Tipos útiles para usar con los hooks de react-redux
// (useSelector, useDispatch) con autocompletado correcto
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
