//frontend\src\utils\validators.ts

// Validadores de entrada-Cumplimiento OWASP MASVS-CODE-4

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitized?: string;
}

/**
 * Valida y limpia direcciones de correo electrónico
 * @param email - Correo electrónico a validar
 * @returns Resultado de validación con el correo limpio
 */
export const validateEmail = (email: string): ValidationResult => {
  try {
    const sanitized = email.trim().toLowerCase();

    // revisa si está vacío
    if (!sanitized) {
      return { isValid: false, error: "El email es requerido" };
    }

    // Expresión regular de email mejorada con validación más estricta
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailRegex.test(sanitized)) {
      return { isValid: false, error: "Formato de email inválido" };
    }

    // Revisa los límites de longitud (RFC 5321)
    if (sanitized.length > 254) {
      return { isValid: false, error: "Email demasiado largo" };
    }

    // Revisa si hay caracteres peligrosos
    if (containsSQLInjectionPatterns(sanitized)) {
      return { isValid: false, error: "Caracteres no permitidos en email" };
    }

    return { isValid: true, sanitized };
  } catch (error) {
    return { isValid: false, error: "Error validando email" };
  }
};

export const validateEmailLegacy = (email: string): boolean => {
  const result = validateEmail(email);
  return result.isValid;
};

//valida la curp con base en los parámetros de México
export const validateCURP = (curp: string): ValidationResult => {
  try {
    // Saneamiento de entrada
    const sanitized = curp.trim().toUpperCase();

    if (!sanitized) {
      return { isValid: false, error: "El CURP es requerido" };
    }

    // Validación básica de formato
    const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}(?:\d{2}|[A-Z]\d|\d[A-Z])$/;

    if (!curpRegex.test(sanitized)) {
      return {
        isValid: false,
        error: "Formato de CURP inválido (ej: AAAA000000HXXXXX00)",
      };
    }

    // validación de fecha de nacimiento dentro de la CURP
    const birthYear = parseInt(sanitized.substring(4, 6));
    const birthMonth = parseInt(sanitized.substring(6, 8));
    const birthDay = parseInt(sanitized.substring(8, 10));

    // Validación básica de rango de fechas
    if (birthMonth < 1 || birthMonth > 12 || birthDay < 1 || birthDay > 31) {
      return { isValid: false, error: "CURP inválido" };
    }

    // Revisa si hay patrones peligrosos
    if (containsSQLInjectionPatterns(sanitized)) {
      return { isValid: false, error: "Caracteres no permitidos en CURP" };
    }

    return { isValid: true, sanitized };
  } catch (error) {
    return { isValid: false, error: "Error validando CURP" };
  }
};

export const validateCURPLegacy = (curp: string): boolean => {
  const result = validateCURP(curp);
  return result.isValid;
};

///valida la ine con base en los parámetros de México
export const validateINE = (ine: string): ValidationResult => {
  try {
    // Saneamiento de entrada
    const sanitized = ine.replace(/\D/g, "");

    if (!sanitized) {
      return { isValid: false, error: "El INE es requerido" };
    }

    if (sanitized.length !== 13) {
      return { isValid: false, error: "El INE debe tener 13 dígitos" };
    }

    // Revisa si hay patrones peligrosos
    if (containsSQLInjectionPatterns(sanitized)) {
      return { isValid: false, error: "Caracteres no permitidos en INE" };
    }

    return { isValid: true, sanitized };
  } catch (error) {
    return { isValid: false, error: "Error validando INE" };
  }
};

export const validateINELegacy = (ine: string): boolean => {
  const result = validateINE(ine);
  return result.isValid;
};

//valida el teléfono con base en los parámetros de México
export const validatePhone = (phone: string): ValidationResult => {
  try {
    // quita caracteres no numéricos
    const sanitized = phone.replace(/\D/g, "");

    if (!sanitized) {
      return { isValid: false, error: "El teléfono es requerido" };
    }

    // verifica que sea de 10 dígitos
    if (sanitized.length !== 10) {
      return { isValid: false, error: "El teléfono debe tener 10 dígitos" };
    }

    // Revisa si hay códigos de área mexicanos válidos (primeros 2-3 dígitos)
    const areaCode = sanitized.substring(0, 3);
    if (!isValidMexicanAreaCode(areaCode)) {
      return { isValid: false, error: "Código de área mexicano inválido" };
    }

    return { isValid: true, sanitized };
  } catch (error) {
    return { isValid: false, error: "Error validando teléfono" };
  }
};

export const validatePhoneLegacy = (phone: string): boolean => {
  const result = validatePhone(phone);
  return result.isValid;
};

//Validación mejorada de contraseñas con requisitos de seguridad
export const validatePassword = (
  password: string
): { isValid: boolean; message?: string } => {
  try {
    if (!password) {
      return { isValid: false, message: "La contraseña es requerida" };
    }

    // largo mínimo
    if (password.length < 8) {
      return {
        isValid: false,
        message: "La contraseña debe tener al menos 8 caracteres",
      };
    }

    // largo máximo
    if (password.length > 128) {
      return { isValid: false, message: "La contraseña es demasiado larga" };
    }

    // Revisa si hay al menos una letra mayúscula
    if (!/[A-Z]/.test(password)) {
      return {
        isValid: false,
        message: "La contraseña debe tener al menos una letra mayúscula",
      };
    }

    // Revisa si hay al menos una letra minúscula
    if (!/[a-z]/.test(password)) {
      return {
        isValid: false,
        message: "La contraseña debe tener al menos una letra minúscula",
      };
    }

    // Revisa si hay al menos un número
    if (!/[0-9]/.test(password)) {
      return {
        isValid: false,
        message: "La contraseña debe tener al menos un número",
      };
    }

    // Revisa si hay al menos un carácter especial
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return {
        isValid: false,
        message: "La contraseña debe tener al menos un carácter especial",
      };
    }

    // Revisa si hay contraseñas comunes
    if (isCommonPassword(password)) {
      return {
        isValid: false,
        message: "Esta contraseña es muy común. Elige una más segura",
      };
    }

    return { isValid: true, message: "Contraseña segura" };
  } catch (error) {
    return { isValid: false, message: "Error validando contraseña" };
  }
};

/// Validación de campos requeridos con saneamiento y revisión de patrones peligrosos
export const validateRequired = (
  value: string,
  fieldName: string
): { isValid: boolean; message?: string } => {
  try {
    const sanitized = value?.trim() || "";

    if (!sanitized || sanitized.length === 0) {
      return { isValid: false, message: `${fieldName} es requerido` };
    }

    // Revisa patrones peligrosos
    if (
      containsSQLInjectionPatterns(sanitized) ||
      containsXSSPatterns(sanitized)
    ) {
      return {
        isValid: false,
        message: `${fieldName} contiene caracteres no permitidos`,
      };
    }

    return { isValid: true };
  } catch (error) {
    return { isValid: false, message: `Error validando ${fieldName}` };
  }
};

// Valida fechas con formato DD/MM/YYYY y reglas de negocio
export const validateDate = (dateString: string): ValidationResult => {
  try {
    const sanitized = dateString.trim();

    // revisa si está vacío
    if (!sanitized) {
      return { isValid: false, error: "La fecha de nacimiento es requerida" };
    }

    // Revisa formato DD/MM/YYYY
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

    if (!dateRegex.test(sanitized)) {
      return { isValid: false, error: "Formato: DD/MM/AAAA (ej: 15/03/1990)" };
    }

    const [, day, month, year] = sanitized.match(dateRegex) || [];
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    // Valida rangos
    if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) {
      return { isValid: false, error: "Fecha inválida" };
    }

    // Crea el objeto de fecha
    const date = new Date(yearNum, monthNum - 1, dayNum);

    // Valida los componentes de la fecha
    if (
      date.getFullYear() !== yearNum ||
      date.getMonth() !== monthNum - 1 ||
      date.getDate() !== dayNum
    ) {
      return { isValid: false, error: "Fecha inválida" };
    }

    // Revisa si la fecha no está en el futuro
    if (date > new Date()) {
      return { isValid: false, error: "Fecha inválida" };
    }

    // Revisa rango de años razonable (1900-año actual)
    const currentYear = new Date().getFullYear();
    if (yearNum < 1900 || yearNum > currentYear) {
      return { isValid: false, error: "Fecha inválida" };
    }

    // Revisa edad mínima (18 años)
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < date.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      return { isValid: false, error: "Debes ser mayor de 18 años" };
    }

    return { isValid: true, sanitized };
  } catch (error) {
    return { isValid: false, error: "Fecha inválida" };
  }
};

/**
 * Validador de fecha heredado para compatibilidad con versiones anteriores
 * @deprecated Usa validateDate en su lugar para obtener mensajes de error más precisos
 */
export const validateDateLegacy = (dateString: string): boolean => {
  const result = validateDate(dateString);
  return result.isValid;
};

// Valida nombres con saneamiento y revisión de patrones peligrosos
export const validateName = (name: string): ValidationResult => {
  try {
    // Sanea la entrada - elimina espacios extra y recorta
    const sanitized = name.trim().replace(/\s+/g, " ");

    if (!sanitized) {
      return { isValid: false, error: "El nombre es requerido" };
    }

    // Validación de longitud
    if (sanitized.length < 2) {
      return {
        isValid: false,
        error: "El nombre debe tener al menos 2 caracteres",
      };
    }

    if (sanitized.length > 50) {
      return { isValid: false, error: "El nombre es demasiado largo" };
    }

    // Solo permite letras, espacios y caracteres comunes en nombres
    const nameRegex = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s\-']+$/;

    if (!nameRegex.test(sanitized)) {
      return {
        isValid: false,
        error: "El nombre solo puede contener letras, espacios y guiones",
      };
    }

    // Revisa si hay patrones peligrosos
    if (containsSQLInjectionPatterns(sanitized)) {
      return { isValid: false, error: "Caracteres no permitidos en nombre" };
    }

    return { isValid: true, sanitized };
  } catch (error) {
    return { isValid: false, error: "Error validando nombre" };
  }
};

// Valida si una fecha es válida y no está en el futuro
function isValidDate(year: number, month: number, day: number): boolean {
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date <= new Date()
  );
}

// Valida códigos de área mexicanos comunes
function isValidMexicanAreaCode(areaCode: string): boolean {
  // Códigos de área mexicanos comunes (primeros 3 dígitos)
  const validCodes = [
    "222",
    "223",
    "224",
    "225",
    "226",
    "227",
    "228",
    "229",
    "33",
    "333",
    "334",
    "335",
    "336",
    "337",
    "338",
    "339",
    "55",
    "56",
    "57",
    "58",
    "59",
    "81",
    "818",
    "819",
    "82",
    "821",
    "822",
    "823",
    "824",
    "998",
    "999",
  ];

  return validCodes.some((code) => areaCode.startsWith(code));
}

// Revisa patrones de inyección SQL
function containsSQLInjectionPatterns(input: string): boolean {
  const sqlPatterns = [
    /[';|*%<>{}[\]]/i,
    /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
    /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    /((\%27)|(\'))union/i,
    /exec(\s|\+)+(s|x)p\w+/i,
    /union(.*)select/i,
    /insert(.*)into/i,
    /delete(.*)from/i,
    /update(.*)set/i,
    /drop(.*)table/i,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
}

// Revisa patrones de XSS
function containsXSSPatterns(input: string): boolean {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<img[^>]+src[^>]*>/gi,
    /<svg[^>]*>.*?<\/svg>/gi,
  ];

  return xssPatterns.some((pattern) => pattern.test(input));
}

// Revisa si la contraseña es una comúnmente usada
function isCommonPassword(password: string): boolean {
  const commonPasswords = [
    "12345678",
    "password",
    "qwerty123",
    "abc123456",
    "password123",
    "123456789",
    "admin123",
    "user123",
    "contraseña",
    "password1",
    "11111111",
    "00000000",
  ];

  return commonPasswords.includes(password.toLowerCase());
}
