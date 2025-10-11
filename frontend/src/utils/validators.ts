// Validation utilities for forms (useful for registration, profile editing, etc.)

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateCURP = (curp: string): boolean => {
  const curpRegex = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9]{2}$/;
  return curpRegex.test(curp.toUpperCase());
};

export const validateINE = (ine: string): boolean => {
  return ine.length === 13 && /^\d{13}$/.test(ine);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\d{10}|\d{3}-\d{3}-\d{4}|\(\d{3}\)\s*\d{3}-\d{4})$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 6) {
    return { isValid: false, message: "La contraseña debe tener al menos 6 caracteres" };
  }
  if (!/(?=.*[a-zA-Z])/.test(password)) {
    return { isValid: false, message: "La contraseña debe contener al menos una letra" };
  }
  return { isValid: true };
};

export const validateRequired = (value: string, fieldName: string): { isValid: boolean; message?: string } => {
  if (!value || value.trim().length === 0) {
    return { isValid: false, message: `${fieldName} es requerido` };
  }
  return { isValid: true };
};

export const validateDate = (dateString: string): boolean => {
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!dateRegex.test(dateString)) return false;
  
  const [, day, month, year] = dateString.match(dateRegex) || [];
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  
  return date.getFullYear() == parseInt(year) && 
         date.getMonth() == parseInt(month) - 1 && 
         date.getDate() == parseInt(day);
};
