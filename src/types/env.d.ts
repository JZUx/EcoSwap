// ─────────────────────────────────────────────
// types/env.d.ts
// Le dice a TypeScript que estas variables de entorno
// existen en process.env, para evitar errores de tipado.
// ─────────────────────────────────────────────

declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_SUPABASE_URL: string;
    EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
  }
}
