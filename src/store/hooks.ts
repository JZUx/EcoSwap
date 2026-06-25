// ─────────────────────────────────────────────
// store/hooks.ts
// Versiones tipadas de useDispatch y useSelector,
// para tener autocompletado correcto del estado
// global sin repetir tipos en cada pantalla.
// ─────────────────────────────────────────────

import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
