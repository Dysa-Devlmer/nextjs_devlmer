/**
 * Helpers de seguridad para APIs
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  rateLimiter,
  RateLimitConfig,
  getRequestIdentifier,
  rateLimitExceededResponse,
} from './rateLimit';
import { securityLogger, SecurityEventType, SecurityLevel, getRequestInfo } from './securityLogger';
import { detectMaliciousInput } from './validation';

/**
 * Middleware de rate limiting para rutas API
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<Response>,
  config: { maxRequests: number; windowMs: number } = RateLimitConfig.API
) {
  return async (req: NextRequest): Promise<Response> => {
    const identifier = getRequestIdentifier(req);
    const { endpoint } = getRequestInfo(req);

    const { allowed, remaining, resetTime } = rateLimiter.checkLimit(
      identifier,
      config.maxRequests,
      config.windowMs
    );

    if (!allowed) {
      securityLogger.logRateLimitExceeded(identifier, endpoint);
      return rateLimitExceededResponse(resetTime);
    }

    // Agregar headers de rate limit a la response
    const response = await handler(req);

    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(resetTime).toISOString());

    return response;
  };
}

/**
 * Validar inputs del body y detectar contenido malicioso
 */
export function validateRequestBody(
  body: Record<string, any>,
  userId?: string,
  endpoint?: string,
  ipAddress?: string
): { valid: boolean; suspicious: boolean; reasons: string[] } {
  const allReasons: string[] = [];
  let hasSuspicious = false;

  // Revisar cada campo del body
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === 'string') {
      const detection = detectMaliciousInput(value);
      if (detection.suspicious) {
        hasSuspicious = true;
        allReasons.push(...detection.reasons.map(r => `${key}: ${r}`));

        // Log el input malicioso
        if (userId && endpoint && ipAddress) {
          securityLogger.logMaliciousInput(
            userId,
            `${key}=${value}`,
            detection.reasons,
            endpoint,
            ipAddress
          );
        }
      }
    }
  }

  return {
    valid: !hasSuspicious,
    suspicious: hasSuspicious,
    reasons: allReasons,
  };
}

/**
 * Headers de seguridad recomendados
 */
export const SECURITY_HEADERS = {
  // Prevenir clickjacking
  'X-Frame-Options': 'DENY',

  // Prevenir MIME sniffing
  'X-Content-Type-Options': 'nosniff',

  // XSS Protection (legacy pero útil para navegadores antiguos)
  'X-XSS-Protection': '1; mode=block',

  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions policy (limitar APIs del navegador)
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

/**
 * Aplicar headers de seguridad a una response
 */
export function applySecurityHeaders(response: Response): Response {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

/**
 * Helper para crear response con headers de seguridad
 */
export function secureResponse(
  data: any,
  status: number = 200,
  headers: Record<string, string> = {}
): Response {
  const response = NextResponse.json(data, {
    status,
    headers: {
      ...SECURITY_HEADERS,
      ...headers,
    },
  });

  return response;
}

/**
 * Helper para response de error con logging
 */
export function errorResponse(
  error: string,
  status: number = 500,
  metadata?: {
    userId?: string;
    endpoint?: string;
    ipAddress?: string;
    [key: string]: any;
  }
): Response {
  // Log el error
  securityLogger.log(
    SecurityEventType.API_ERROR,
    status >= 500 ? SecurityLevel.ERROR : SecurityLevel.WARNING,
    error,
    metadata
  );

  return secureResponse({ error }, status);
}

/**
 * Helper para verificar origen del request (CORS manual si es necesario)
 */
export function validateOrigin(req: NextRequest, allowedOrigins: string[]): boolean {
  const origin = req.headers.get('origin');

  if (!origin) {
    // Requests del mismo origen no tienen header origin
    return true;
  }

  return allowedOrigins.includes(origin);
}

/**
 * Sanitizar response para evitar fugas de información sensible
 */
export function sanitizeResponse<T extends Record<string, any>>(
  data: T,
  sensitiveFields: string[] = ['password', 'token', 'secret']
): T {
  const sanitized = { ...data };

  sensitiveFields.forEach(field => {
    if (field in sanitized) {
      delete sanitized[field];
    }
  });

  return sanitized;
}

/**
 * Validar que el request venga de un navegador real (básico)
 */
export function isLikelyBot(userAgent: string): boolean {
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python-requests/i,
  ];

  return botPatterns.some(pattern => pattern.test(userAgent));
}

/**
 * Generar token CSRF (para formularios críticos)
 */
export function generateCSRFToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Validar token CSRF
 */
export function validateCSRFToken(
  providedToken: string,
  storedToken: string
): boolean {
  if (!providedToken || !storedToken) return false;
  return providedToken === storedToken;
}

/**
 * Timeout para prevenir ataques de slowloris
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 30000
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    ),
  ]);
}

/**
 * Validar que el content-type sea el esperado
 */
export function validateContentType(
  req: NextRequest,
  expectedType: string = 'application/json'
): boolean {
  const contentType = req.headers.get('content-type');
  return contentType?.includes(expectedType) || false;
}
