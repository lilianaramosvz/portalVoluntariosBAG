/**
 * Enhanced Input Validators - OWASP MASVS-CODE-4 Compliance
 * Comprehensive input validation and sanitization
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitized?: string;
}

/**
 * Validate and sanitize email addresses
 * @param email - Email to validate
 * @returns Validation result with sanitized email
 */
export const validateEmail = (email: string): ValidationResult => {
  try {
    // Sanitize input
    const sanitized = email.trim().toLowerCase();
    
    // Check for empty input
    if (!sanitized) {
      return { isValid: false, error: 'El email es requerido' };
    }

    // Enhanced email regex with more strict validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(sanitized)) {
      return { isValid: false, error: 'Formato de email inválido' };
    }

    // Check length limits (RFC 5321)
    if (sanitized.length > 254) {
      return { isValid: false, error: 'Email demasiado largo' };
    }

    // Check for dangerous characters
    if (containsSQLInjectionPatterns(sanitized)) {
      return { isValid: false, error: 'Caracteres no permitidos en email' };
    }

    return { isValid: true, sanitized };
  } catch (error) {
    return { isValid: false, error: 'Error validando email' };
  }
};

/**
 * Legacy email validator for backward compatibility
 */
export const validateEmailLegacy = (email: string): boolean => {
  const result = validateEmail(email);
  return result.isValid;
};

/**
 * Validate CURP (Mexican ID) with comprehensive checks
 * @param curp - CURP to validate
 * @returns Validation result
 */
export const validateCURP = (curp: string): ValidationResult => {
  try {
    // Sanitize input
    const sanitized = curp.trim().toUpperCase();
    
    if (!sanitized) {
      return { isValid: false, error: 'El CURP es requerido' };
    }

    // Basic format validation (fixed regex)
    const curpRegex = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z][0-9]$/;
    
    if (!curpRegex.test(sanitized)) {
      return { isValid: false, error: 'Formato de CURP inválido (ej: AAAA000000HXXXXX00)' };
    }

    // Validate birth date within CURP (basic validation only)
    const birthYear = parseInt(sanitized.substring(4, 6));
    const birthMonth = parseInt(sanitized.substring(6, 8));
    const birthDay = parseInt(sanitized.substring(8, 10));

    // Basic date range validation
    if (birthMonth < 1 || birthMonth > 12 || birthDay < 1 || birthDay > 31) {
      return { isValid: false, error: 'CURP inválido' };
    }

    // Check for dangerous patterns
    if (containsSQLInjectionPatterns(sanitized)) {
      return { isValid: false, error: 'Caracteres no permitidos en CURP' };
    }

    return { isValid: true, sanitized };
  } catch (error) {
    return { isValid: false, error: 'Error validando CURP' };
  }
};

/**
 * Legacy CURP validator for backward compatibility
 */
export const validateCURPLegacy = (curp: string): boolean => {
  const result = validateCURP(curp);
  return result.isValid;
};

/**
 * Validate INE (Mexican voter ID)
 * @param ine - INE to validate
 * @returns Validation result
 */
export const validateINE = (ine: string): ValidationResult => {
  try {
    // Sanitize input
    const sanitized = ine.replace(/\D/g, '');
    
    if (!sanitized) {
      return { isValid: false, error: 'El INE es requerido' };
    }

    if (sanitized.length !== 13) {
      return { isValid: false, error: 'El INE debe tener 13 dígitos' };
    }

    // Check for dangerous patterns
    if (containsSQLInjectionPatterns(sanitized)) {
      return { isValid: false, error: 'Caracteres no permitidos en INE' };
    }

    return { isValid: true, sanitized };
  } catch (error) {
    return { isValid: false, error: 'Error validando INE' };
  }
};

/**
 * Legacy INE validator for backward compatibility
 */
export const validateINELegacy = (ine: string): boolean => {
  const result = validateINE(ine);
  return result.isValid;
};

/**
 * Validate Mexican phone numbers
 * @param phone - Phone number to validate
 * @returns Validation result with sanitized phone
 */
export const validatePhone = (phone: string): ValidationResult => {
  try {
    // Remove all non-digit characters
    const sanitized = phone.replace(/\D/g, '');
    
    if (!sanitized) {
      return { isValid: false, error: 'El teléfono es requerido' };
    }

    // Mexican phone numbers: 10 digits
    if (sanitized.length !== 10) {
      return { isValid: false, error: 'El teléfono debe tener 10 dígitos' };
    }

    // Check for valid Mexican area codes (first 2-3 digits)
    const areaCode = sanitized.substring(0, 3);
    if (!isValidMexicanAreaCode(areaCode)) {
      return { isValid: false, error: 'Código de área mexicano inválido' };
    }

    return { isValid: true, sanitized };
  } catch (error) {
    return { isValid: false, error: 'Error validando teléfono' };
  }
};

/**
 * Legacy phone validator for backward compatibility
 */
export const validatePhoneLegacy = (phone: string): boolean => {
  const result = validatePhone(phone);
  return result.isValid;
};

/**
 * Enhanced password validation with security requirements
 * @param password - Password to validate
 * @returns Validation result with strength assessment
 */
export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  try {
    if (!password) {
      return { isValid: false, message: 'La contraseña es requerida' };
    }

    // Minimum length
    if (password.length < 8) {
      return { isValid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
    }

    // Maximum length (prevent DoS attacks)
    if (password.length > 128) {
      return { isValid: false, message: 'La contraseña es demasiado larga' };
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: 'La contraseña debe tener al menos una letra mayúscula' };
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: 'La contraseña debe tener al menos una letra minúscula' };
    }

    // Check for at least one number
    if (!/[0-9]/.test(password)) {
      return { isValid: false, message: 'La contraseña debe tener al menos un número' };
    }

    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return { isValid: false, message: 'La contraseña debe tener al menos un carácter especial' };
    }

    // Check against common passwords
    if (isCommonPassword(password)) {
      return { isValid: false, message: 'Esta contraseña es muy común. Elige una más segura' };
    }

    return { isValid: true, message: 'Contraseña segura' };
  } catch (error) {
    return { isValid: false, message: 'Error validando contraseña' };
  }
};

/**
 * Validate required fields
 * @param value - Value to validate
 * @param fieldName - Name of the field for error messages
 * @returns Validation result
 */
export const validateRequired = (value: string, fieldName: string): { isValid: boolean; message?: string } => {
  try {
    const sanitized = value?.trim() || '';
    
    if (!sanitized || sanitized.length === 0) {
      return { isValid: false, message: `${fieldName} es requerido` };
    }

    // Check for dangerous patterns
    if (containsSQLInjectionPatterns(sanitized) || containsXSSPatterns(sanitized)) {
      return { isValid: false, message: `${fieldName} contiene caracteres no permitidos` };
    }

    return { isValid: true };
  } catch (error) {
    return { isValid: false, message: `Error validando ${fieldName}` };
  }
};

/**
 * Enhanced date validation with detailed error messages
 * @param dateString - Date string to validate (DD/MM/YYYY format)
 * @returns Validation result with specific error message
 */
export const validateDate = (dateString: string): ValidationResult => {
  try {
    const sanitized = dateString.trim();
    
    // Check if empty
    if (!sanitized) {
      return { isValid: false, error: 'La fecha de nacimiento es requerida' };
    }
    
    // Check format DD/MM/YYYY
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    
    if (!dateRegex.test(sanitized)) {
      return { isValid: false, error: 'Formato: DD/MM/AAAA (ej: 15/03/1990)' };
    }
    
    const [, day, month, year] = sanitized.match(dateRegex) || [];
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    // Validate ranges
    if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) {
      return { isValid: false, error: 'Fecha inválida' };
    }
    
    // Create date object
    const date = new Date(yearNum, monthNum - 1, dayNum);
    
    // Validate the date components
    if (date.getFullYear() !== yearNum || 
        date.getMonth() !== monthNum - 1 || 
        date.getDate() !== dayNum) {
      return { isValid: false, error: 'Fecha inválida' };
    }
    
    // Check if date is not in the future
    if (date > new Date()) {
      return { isValid: false, error: 'Fecha inválida' };
    }
    
    // Check reasonable year range (1900-current year)
    const currentYear = new Date().getFullYear();
    if (yearNum < 1900 || yearNum > currentYear) {
      return { isValid: false, error: 'Fecha inválida' };
    }
    
    // Check minimum age (18 years old)
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
      age--;
    }
    
    if (age < 18) {
      return { isValid: false, error: 'Debes ser mayor de 18 años' };
    }
    
    return { isValid: true, sanitized };
  } catch (error) {
    return { isValid: false, error: 'Fecha inválida' };
  }
};

/**
 * Legacy date validator for backward compatibility
 * @deprecated Use validateDate instead for better error messages
 */
export const validateDateLegacy = (dateString: string): boolean => {
  const result = validateDate(dateString);
  return result.isValid;
};

/**
 * Validate names (first name, last name)
 * @param name - Name to validate
 * @returns Validation result with sanitized name
 */
export const validateName = (name: string): ValidationResult => {
  try {
    // Sanitize input - remove extra spaces and trim
    const sanitized = name.trim().replace(/\s+/g, ' ');
    
    if (!sanitized) {
      return { isValid: false, error: 'El nombre es requerido' };
    }

    // Length validation
    if (sanitized.length < 2) {
      return { isValid: false, error: 'El nombre debe tener al menos 2 caracteres' };
    }

    if (sanitized.length > 50) {
      return { isValid: false, error: 'El nombre es demasiado largo' };
    }

    // Only allow letters, spaces, and common name characters
    const nameRegex = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s\-']+$/;
    
    if (!nameRegex.test(sanitized)) {
      return { isValid: false, error: 'El nombre solo puede contener letras, espacios y guiones' };
    }

    // Check for dangerous patterns
    if (containsSQLInjectionPatterns(sanitized)) {
      return { isValid: false, error: 'Caracteres no permitidos en nombre' };
    }

    return { isValid: true, sanitized };
  } catch (error) {
    return { isValid: false, error: 'Error validando nombre' };
  }
};

// Helper functions

/**
 * Check if a date is valid
 */
function isValidDate(year: number, month: number, day: number): boolean {
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && 
         date.getMonth() === month - 1 && 
         date.getDate() === day &&
         date <= new Date(); // Can't be in the future
}

/**
 * Check if area code is valid for Mexico
 */
function isValidMexicanAreaCode(areaCode: string): boolean {
  // Common Mexican area codes (first 3 digits)
  const validCodes = [
    '222', '223', '224', '225', '226', '227', '228', '229', // Puebla region
    '33', '333', '334', '335', '336', '337', '338', '339',   // Guadalajara region
    '55', '56', '57', '58', '59',                           // Mexico City region
    '81', '818', '819', '82', '821', '822', '823', '824',   // Monterrey region
    '998', '999'                                            // Yucatan region
  ];
  
  return validCodes.some(code => areaCode.startsWith(code));
}

/**
 * Check for SQL injection patterns
 */
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
    /drop(.*)table/i
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Check for XSS patterns
 */
function containsXSSPatterns(input: string): boolean {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<img[^>]+src[^>]*>/gi,
    /<svg[^>]*>.*?<\/svg>/gi
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
}

/**
 * Check against common passwords
 */
function isCommonPassword(password: string): boolean {
  const commonPasswords = [
    '12345678', 'password', 'qwerty123', 'abc123456',
    'password123', '123456789', 'admin123', 'user123',
    'contraseña', 'password1', '11111111', '00000000'
  ];
  
  return commonPasswords.includes(password.toLowerCase());
}
