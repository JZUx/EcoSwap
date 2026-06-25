// ─────────────────────────────────────────────
// utils/validators.ts
// Funciones puras de validación reutilizables.
// Se usan en Login y Registro para verificar que los datos sean correctos antes de enviarlos.
// ─────────────────────────────────────────────

// Valida formato de email: usuario@dominio.ext
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

// Contraseña valida si tiene al menos 6 caracteres
export const isValidPassword = (password: string): boolean => {
  return password.trim().length >= 6;
};

// Telefono valido: solo dígitos, entre 8 y 15 caracteres
export const isValidPhone = (phone: string): boolean => {
  const regex = /^[0-9]{8,15}$/;
  return regex.test(phone.trim());
};

// Campo obligatorio: no debe estar vacío
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

// Las dos contraseñas deben ser iguales para el registro
export const passwordsMatch = (password: string, confirm: string): boolean => {
  return password === confirm;
};
