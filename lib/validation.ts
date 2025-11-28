/**
 * Sistema de validación y sanitización de inputs
 */

/**
 * Sanitizar string para prevenir XSS
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';

  return input
    .replace(/[<>]/g, '') // Remover < y >
    .replace(/javascript:/gi, '') // Remover javascript: protocol
    .replace(/on\w+=/gi, '') // Remover event handlers
    .trim();
}

/**
 * Validar email
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email es requerido' };
  }

  const sanitized = email.trim().toLowerCase();

  // Regex básico pero robusto para emails
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(sanitized)) {
    return { valid: false, error: 'Formato de email inválido' };
  }

  if (sanitized.length > 254) {
    return { valid: false, error: 'Email demasiado largo' };
  }

  return { valid: true };
}

/**
 * Validar contraseña
 */
export function validatePassword(password: string): {
  valid: boolean;
  error?: string;
  strength?: 'weak' | 'medium' | 'strong';
} {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Contraseña es requerida' };
  }

  if (password.length < 6) {
    return { valid: false, error: 'La contraseña debe tener al menos 6 caracteres' };
  }

  if (password.length > 128) {
    return { valid: false, error: 'La contraseña es demasiado larga' };
  }

  // Calcular fortaleza
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score >= 5) strength = 'strong';
  else if (score >= 3) strength = 'medium';

  return { valid: true, strength };
}

/**
 * Validar teléfono
 */
export function validatePhone(phone: string): { valid: boolean; error?: string } {
  if (!phone) return { valid: true }; // Opcional

  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length < 10 || cleaned.length > 15) {
    return { valid: false, error: 'Número de teléfono inválido' };
  }

  return { valid: true };
}

/**
 * Validar URL
 */
export function validateURL(url: string): { valid: boolean; error?: string } {
  if (!url) return { valid: true }; // Opcional

  try {
    const parsed = new URL(url);

    // Solo permitir http y https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: 'Protocolo no permitido' };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: 'URL inválida' };
  }
}

/**
 * Validar nombre (no números, caracteres especiales limitados)
 */
export function validateName(name: string): { valid: boolean; error?: string } {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Nombre es requerido' };
  }

  const trimmed = name.trim();

  if (trimmed.length < 2) {
    return { valid: false, error: 'El nombre debe tener al menos 2 caracteres' };
  }

  if (trimmed.length > 100) {
    return { valid: false, error: 'El nombre es demasiado largo' };
  }

  // Permitir letras, espacios, guiones y apóstrofes
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
  if (!nameRegex.test(trimmed)) {
    return { valid: false, error: 'El nombre contiene caracteres no permitidos' };
  }

  return { valid: true };
}

/**
 * Validar precio/monto
 */
export function validatePrice(price: number): { valid: boolean; error?: string } {
  if (typeof price !== 'number' || isNaN(price)) {
    return { valid: false, error: 'Precio debe ser un número' };
  }

  if (price < 0) {
    return { valid: false, error: 'El precio no puede ser negativo' };
  }

  if (price > 1000000) {
    return { valid: false, error: 'El precio es demasiado alto' };
  }

  return { valid: true };
}

/**
 * Validar cantidad
 */
export function validateQuantity(quantity: number): { valid: boolean; error?: string } {
  if (typeof quantity !== 'number' || isNaN(quantity) || !Number.isInteger(quantity)) {
    return { valid: false, error: 'Cantidad debe ser un número entero' };
  }

  if (quantity < 1) {
    return { valid: false, error: 'La cantidad debe ser al menos 1' };
  }

  if (quantity > 1000) {
    return { valid: false, error: 'La cantidad es demasiado alta' };
  }

  return { valid: true };
}

/**
 * Validar texto largo (descripciones, mensajes)
 */
export function validateText(
  text: string,
  minLength: number = 1,
  maxLength: number = 5000
): { valid: boolean; error?: string } {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: 'Texto es requerido' };
  }

  const trimmed = text.trim();

  if (trimmed.length < minLength) {
    return { valid: false, error: `El texto debe tener al menos ${minLength} caracteres` };
  }

  if (trimmed.length > maxLength) {
    return { valid: false, error: `El texto no puede exceder ${maxLength} caracteres` };
  }

  return { valid: true };
}

/**
 * Validar archivo subido
 */
export function validateFile(
  file: File,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp'],
  maxSizeMB: number = 5
): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'Archivo es requerido' };
  }

  // Validar tipo
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de archivo no permitido. Permitidos: ${allowedTypes.join(', ')}`,
    };
  }

  // Validar tamaño
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `El archivo es demasiado grande. Máximo: ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Prevenir SQL Injection (aunque Prisma ya lo hace)
 * Esta función es adicional para inputs que puedan usarse en queries raw
 */
export function sanitizeForSQL(input: string): string {
  if (typeof input !== 'string') return '';

  return input
    .replace(/['";\\]/g, '') // Remover comillas y backslashes
    .replace(/--/g, '') // Remover comentarios SQL
    .replace(/\/\*/g, '') // Remover inicio de comentarios de bloque
    .replace(/\*\//g, '') // Remover fin de comentarios de bloque
    .trim();
}

/**
 * Validar y sanitizar objeto completo
 */
export function validateAndSanitizeObject<T extends Record<string, any>>(
  obj: T,
  schema: Record<keyof T, (value: any) => { valid: boolean; error?: string }>
): { valid: boolean; errors: Partial<Record<keyof T, string>>; sanitized: Partial<T> } {
  const errors: Partial<Record<keyof T, string>> = {};
  const sanitized: Partial<T> = {};

  for (const key in schema) {
    const validator = schema[key];
    const value = obj[key];
    const result = validator(value);

    if (!result.valid && result.error) {
      errors[key] = result.error;
    } else if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value) as any;
    } else {
      sanitized[key] = value;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized,
  };
}

/**
 * Detectar posibles ataques comunes en inputs
 */
export function detectMaliciousInput(input: string): {
  suspicious: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];

  // Detectar posible XSS
  if (/<script|javascript:|on\w+=/i.test(input)) {
    reasons.push('Posible intento de XSS');
  }

  // Detectar posible SQL injection
  if (/(\bUNION\b|\bSELECT\b|\bDROP\b|\bDELETE\b|\bINSERT\b|\bUPDATE\b).*(\bFROM\b|\bWHERE\b)/i.test(input)) {
    reasons.push('Posible intento de SQL injection');
  }

  // Detectar path traversal
  if (/\.\.[\/\\]/.test(input)) {
    reasons.push('Posible path traversal');
  }

  // Detectar command injection
  if (/[;&|`$(){}[\]]/.test(input)) {
    reasons.push('Caracteres sospechosos detectados');
  }

  return {
    suspicious: reasons.length > 0,
    reasons,
  };
}
