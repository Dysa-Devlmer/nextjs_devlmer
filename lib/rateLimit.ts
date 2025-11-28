/**
 * Sistema de Rate Limiting simple en memoria
 * Para producción, considerar usar Redis o servicios como Upstash
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map();

  /**
   * Verificar si una request está permitida
   * @param identifier - IP o user ID
   * @param maxRequests - Máximo de requests permitidos
   * @param windowMs - Ventana de tiempo en milisegundos
   */
  public checkLimit(
    identifier: string,
    maxRequests: number = 100,
    windowMs: number = 60000 // 1 minuto por defecto
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    // Si no hay entrada o el tiempo ya expiró, crear nueva
    if (!entry || now > entry.resetTime) {
      const resetTime = now + windowMs;
      this.requests.set(identifier, { count: 1, resetTime });

      // Limpiar entradas antiguas periódicamente
      this.cleanup();

      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime,
      };
    }

    // Si ya alcanzó el límite
    if (entry.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    // Incrementar contador
    entry.count++;
    this.requests.set(identifier, entry);

    return {
      allowed: true,
      remaining: maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  /**
   * Resetear límite para un identificador
   */
  public reset(identifier: string): void {
    this.requests.delete(identifier);
  }

  /**
   * Limpiar entradas expiradas
   */
  private cleanup(): void {
    const now = Date.now();
    const entriesToDelete: string[] = [];

    this.requests.forEach((entry, key) => {
      if (now > entry.resetTime) {
        entriesToDelete.push(key);
      }
    });

    entriesToDelete.forEach(key => this.requests.delete(key));
  }

  /**
   * Obtener estadísticas
   */
  public getStats(identifier: string): RateLimitEntry | null {
    return this.requests.get(identifier) || null;
  }
}

// Instancia global del rate limiter
export const rateLimiter = new RateLimiter();

/**
 * Configuraciones predefinidas de rate limiting
 */
export const RateLimitConfig = {
  // Endpoints de autenticación - más restrictivo
  AUTH: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutos
  },
  // APIs generales
  API: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minuto
  },
  // Crear recursos (POST)
  CREATE: {
    maxRequests: 20,
    windowMs: 60 * 1000, // 1 minuto
  },
  // Búsquedas y queries
  SEARCH: {
    maxRequests: 50,
    windowMs: 60 * 1000, // 1 minuto
  },
  // Uploads de archivos
  UPLOAD: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minuto
  },
};

/**
 * Helper para obtener identificador único del request
 */
export function getRequestIdentifier(req: Request): string {
  // Intentar obtener IP real detrás de proxies
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() :
             req.headers.get('x-real-ip') || 'unknown';

  return ip;
}

/**
 * Helper para crear response de rate limit excedido
 */
export function rateLimitExceededResponse(resetTime: number) {
  const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      message: 'Has excedido el límite de peticiones. Por favor intenta más tarde.',
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Reset': new Date(resetTime).toISOString(),
      },
    }
  );
}
