// ─────────────────────────────────────────────
// store/articlesSlice.ts
// Slice de Redux Toolkit que maneja el ESTADO GLOBAL
// del contenido de la app: la lista de artículos
// disponibles para intercambio.
//
// Los datos reales viven en Supabase (tabla "articles");
// Redux guarda una copia en memoria para que toda la app
// (Home, futuros filtros, etc.) lea del mismo lugar
// sin tener que volver a pedirlos cada vez.
// ─────────────────────────────────────────────

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../lib/supabase";

// Forma de un artículo tal como vive en la tabla de Supabase
export interface Article {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
  created_at: string;
}

interface ArticlesState {
  items: Article[];
  loading: boolean;
  error: string | null;
}

const initialState: ArticlesState = {
  items: [],
  loading: false,
  error: null,
};

// ── Thunk: traer todos los artículos desde Supabase ──
export const fetchArticles = createAsyncThunk(
  "articles/fetchArticles",
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return rejectWithValue(error.message);
    return data as Article[];
  }
);

// ── Thunk: publicar un nuevo artículo ──
export const createArticle = createAsyncThunk(
  "articles/createArticle",
  async (
    payload: { title: string; description: string; category: string; user_id: string },
    { rejectWithValue }
  ) => {
    const { data, error } = await supabase
      .from("articles")
      .insert({
        title: payload.title,
        description: payload.description,
        category: payload.category,
        user_id: payload.user_id,
      })
      .select()
      .single();

    if (error) return rejectWithValue(error.message);
    return data as Article;
  }
);

const articlesSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {},
  // extraReducers maneja los 3 estados automáticos de cada thunk:
  // pending (cargando), fulfilled (éxito), rejected (error)
  extraReducers: (builder) => {
    builder
      // fetchArticles
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // createArticle: agregamos el nuevo artículo al inicio de la lista
      .addCase(createArticle.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export default articlesSlice.reducer;
