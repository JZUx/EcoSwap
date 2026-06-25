// ─────────────────────────────────────────────
// store/profileSlice.ts
// Slice de Redux Toolkit para el PERFIL del usuario
// (teléfono, departamento, ciudad). Se llena UNA VEZ
// y se reutiliza automáticamente en sus publicaciones.
// ─────────────────────────────────────────────

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../lib/supabase";

export interface Profile {
  id: string;
  phone: string | null;
  department: string | null;
  city: string | null;
}

interface ProfileState {
  data: Profile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  data: null,
  loading: false,
  error: null,
};

// ── Thunk: traer el perfil del usuario actual ──
export const fetchMyProfile = createAsyncThunk(
  "profile/fetchMyProfile",
  async (userId: string, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle(); // puede no existir todavía (primera vez)

    if (error) return rejectWithValue(error.message);
    return data as Profile | null;
  }
);

// ── Thunk: crear o actualizar el perfil (upsert) ──
export const saveMyProfile = createAsyncThunk(
  "profile/saveMyProfile",
  async (
    payload: { id: string; phone: string; department: string; city: string },
    { rejectWithValue }
  ) => {
    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id: payload.id,
        phone: payload.phone,
        department: payload.department,
        city: payload.city,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) return rejectWithValue(error.message);
    return data as Profile;
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(saveMyProfile.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export default profileSlice.reducer;