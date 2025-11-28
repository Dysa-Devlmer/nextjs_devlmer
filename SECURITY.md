# 🔒 Guía de Seguridad - FastFood Management System

Este documento describe las medidas de seguridad implementadas en el sistema y las mejores prácticas a seguir.

## 📋 Índice

1. [Medidas de Seguridad Implementadas](#medidas-de-seguridad-implementadas)
2. [Rate Limiting](#rate-limiting)
3. [Validación de Inputs](#validación-de-inputs)
4. [Security Headers](#security-headers)
5. [Logging de Seguridad](#logging-de-seguridad)
6. [Autenticación y Autorización](#autenticación-y-autorización)
7. [Protección de Datos](#protección-de-datos)
8. [Mejores Prácticas](#mejores-prácticas)

---

## Medidas de Seguridad Implementadas

### 1. Rate Limiting

Sistema de limitación de peticiones para prevenir ataques de fuerza bruta y abuso de APIs.

**Ubicación:** `lib/rateLimit.ts`

**Configuraciones Predefinidas:**

```typescript
// Endpoints de autenticación - 5 requests en 15 minutos
RateLimitConfig.AUTH

// APIs generales - 100 requests por minuto
RateLimitConfig.API

// Crear recursos (POST) - 20 requests por minuto
RateLimitConfig.CREATE

// Búsquedas - 50 requests por minuto
RateLimitConfig.SEARCH

// Uploads - 10 requests por minuto
RateLimitConfig.UPLOAD
```

**Uso en APIs:**

```typescript
import { withRateLimit, RateLimitConfig } from '@/lib/rateLimit';

export const POST = withRateLimit(async (req) => {
  // Tu lógica aquí
}, RateLimitConfig.AUTH);
```

**Headers de Respuesta:**
- `X-RateLimit-Limit`: Límite máximo de requests
- `X-RateLimit-Remaining`: Requests restantes
- `X-RateLimit-Reset`: Timestamp de reseteo
- `Retry-After`: Segundos hasta poder reintentar (cuando excede límite)

---

### 2. Validación de Inputs

Sistema robusto de validación y sanitización de inputs para prevenir XSS, SQL injection y otros ataques.

**Ubicación:** `lib/validation.ts`

**Funciones Principales:**

#### Validación de Email
```typescript
const { valid, error } = validateEmail(email);
// Valida formato, longitud máxima (254 chars)
```

#### Validación de Contraseña
```typescript
const { valid, error, strength } = validatePassword(password);
// Valida longitud (6-128 chars), calcula fortaleza
```

#### Validación de Nombre
```typescript
const { valid, error } = validateName(name);
// Permite solo letras, espacios, guiones, apóstrofes
// Mínimo 2 caracteres, máximo 100
```

#### Validación de Precio/Cantidad
```typescript
const { valid, error } = validatePrice(price);
const { valid, error } = validateQuantity(quantity);
```

#### Sanitización de Strings
```typescript
const clean = sanitizeString(input);
// Remueve <, >, javascript:, event handlers
```

#### Detección de Inputs Maliciosos
```typescript
const { suspicious, reasons } = detectMaliciousInput(input);
// Detecta XSS, SQL injection, path traversal, command injection
```

---

### 3. Security Headers

Headers HTTP de seguridad configurados en `next.config.ts`:

```typescript
X-Frame-Options: DENY
// Previene clickjacking

X-Content-Type-Options: nosniff
// Previene MIME sniffing

X-XSS-Protection: 1; mode=block
// Protección XSS (legacy)

Referrer-Policy: strict-origin-when-cross-origin
// Control de información en Referrer

Permissions-Policy: camera=(), microphone=(), geolocation=()
// Deshabilita APIs sensibles del navegador

Strict-Transport-Security: max-age=31536000; includeSubDomains
// Fuerza HTTPS por 1 año
```

**Aplicación Automática:**

Los headers se aplican automáticamente a todas las rutas. Para APIs específicas:

```typescript
import { secureResponse } from '@/lib/apiSecurity';

return secureResponse({ data: 'value' }, 200);
```

---

### 4. Logging de Seguridad

Sistema completo de auditoría de eventos de seguridad.

**Ubicación:** `lib/securityLogger.ts`

**Eventos Rastreados:**

- `LOGIN_SUCCESS` / `LOGIN_FAILED`
- `PASSWORD_RESET_REQUESTED` / `PASSWORD_RESET_COMPLETED`
- `UNAUTHORIZED_ACCESS` / `FORBIDDEN_ACTION`
- `RATE_LIMIT_EXCEEDED`
- `MALICIOUS_INPUT_DETECTED`
- `USER_CREATED` / `USER_DELETED` / `USER_ROLE_CHANGED`
- `API_ERROR` / `SYSTEM_ERROR`

**Niveles de Severidad:**

- `INFO`: Eventos normales (login exitoso)
- `WARNING`: Eventos sospechosos (intento fallido, rate limit)
- `ERROR`: Errores de sistema
- `CRITICAL`: Eventos que requieren atención inmediata

**Uso:**

```typescript
import { securityLogger } from '@/lib/securityLogger';

// Login exitoso
securityLogger.logLoginSuccess(userId, email, ipAddress);

// Login fallido
securityLogger.logLoginFailed(email, ipAddress, reason);

// Input malicioso
securityLogger.logMaliciousInput(userId, input, reasons, endpoint, ip);

// Evento personalizado
securityLogger.log(
  SecurityEventType.USER_CREATED,
  SecurityLevel.INFO,
  'Usuario creado',
  { userId, email, role }
);
```

**Consulta de Logs:**

```typescript
// Logs recientes
const logs = securityLogger.getRecentLogs(100);

// Logs críticos
const critical = securityLogger.getCriticalLogs();

// Logs por usuario
const userLogs = securityLogger.getLogsByUser(userId);

// Logs por tipo
const loginFails = securityLogger.getLogsByEventType(
  SecurityEventType.LOGIN_FAILED
);
```

---

### 5. Autenticación y Autorización

**NextAuth.js** con mejoras de seguridad:

#### Protecciones Implementadas:

1. **Validación de Email** antes de buscar usuario
2. **Verificación de Usuario Activo** (campo `activo`)
3. **Logging de todos los intentos** (exitosos y fallidos)
4. **Mensajes genéricos** para prevenir enumeración de usuarios
5. **Sanitización de email** (lowercase, trim)
6. **Hash seguro de contraseñas** con bcryptjs (salt rounds: 10)

#### Roles y Permisos:

- `ADMIN`: Acceso completo
- `STAFF`: Gestión de pedidos y operaciones
- `CLIENTE`: Solo sus propios recursos

**Middleware de Autorización:**

```typescript
// middleware.ts verifica roles automáticamente
/admin/* → Solo ADMIN
/staff/* → STAFF y ADMIN
Otras rutas → Usuario autenticado
```

---

### 6. Protección de Datos

#### Prisma ORM
- **Protección contra SQL Injection** automática
- Queries parametrizadas
- Type-safety completo

#### Sanitización de Responses
```typescript
import { sanitizeResponse } from '@/lib/apiSecurity';

const user = await prisma.user.findUnique({ ... });
const safe = sanitizeResponse(user, ['password', 'token']);
// Remueve campos sensibles automáticamente
```

#### Validación de Archivos
```typescript
import { validateFile } from '@/lib/validation';

const { valid, error } = validateFile(
  file,
  ['image/jpeg', 'image/png', 'image/webp'], // tipos permitidos
  5 // max 5MB
);
```

#### Configuración de Imágenes
```typescript
// next.config.ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'utfs.io' }
  ],
  formats: ['image/avif', 'image/webp']
}
```

---

### 7. API Security Helpers

**Ubicación:** `lib/apiSecurity.ts`

#### Validar Body del Request
```typescript
import { validateRequestBody } from '@/lib/apiSecurity';

const body = await req.json();
const { valid, suspicious, reasons } = validateRequestBody(
  body,
  userId,
  endpoint,
  ipAddress
);

if (suspicious) {
  return errorResponse('Input sospechoso detectado', 400);
}
```

#### Response con Seguridad
```typescript
import { secureResponse, errorResponse } from '@/lib/apiSecurity';

// Response exitosa
return secureResponse({ data: value }, 200);

// Response de error con logging
return errorResponse('Error message', 500, {
  userId,
  endpoint,
  ipAddress
});
```

#### Timeout para Requests
```typescript
import { withTimeout } from '@/lib/apiSecurity';

const result = await withTimeout(
  longRunningOperation(),
  30000 // 30 segundos
);
```

#### Validar Content-Type
```typescript
import { validateContentType } from '@/lib/apiSecurity';

if (!validateContentType(req, 'application/json')) {
  return errorResponse('Content-Type inválido', 400);
}
```

---

## Mejores Prácticas

### 1. Variables de Entorno

**Archivo `.env.local` debe contener:**

```bash
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="[genera con: openssl rand -base64 32]"
NEXTAUTH_URL="http://localhost:3000"

# Email (Resend)
RESEND_API_KEY="re_..."

# File Upload (UploadThing)
UPLOADTHING_SECRET="sk_..."
UPLOADTHING_APP_ID="..."

# Pusher (Chat en tiempo real)
NEXT_PUBLIC_PUSHER_KEY="..."
NEXT_PUBLIC_PUSHER_CLUSTER="..."
PUSHER_APP_ID="..."
PUSHER_SECRET="..."
```

**⚠️ NUNCA COMMITEAR `.env.local` AL REPOSITORIO**

### 2. Producción

Antes de desplegar a producción:

1. **Generar SECRET fuerte** para NEXTAUTH_SECRET
2. **Configurar NEXTAUTH_URL** con el dominio real
3. **Habilitar HTTPS** (obligatorio para cookies seguras)
4. **Configurar CORS** si tienes frontend separado
5. **Migrar logs** a servicio externo (Sentry, LogRocket)
6. **Configurar alertas** para eventos críticos
7. **Implementar rate limiting en Nginx/Redis** (más robusto)
8. **Backups automáticos** de base de datos
9. **Monitoreo de uptime**
10. **Configurar WAF** (Web Application Firewall)

### 3. Desarrollo Seguro

```typescript
// ✅ CORRECTO - Validar y sanitizar
const { valid, error } = validateEmail(email);
if (!valid) return errorResponse(error, 400);
const cleanEmail = email.toLowerCase().trim();

// ❌ INCORRECTO - Usar directamente
const user = await prisma.user.findUnique({
  where: { email }
});
```

```typescript
// ✅ CORRECTO - Usar Prisma (previene SQL injection)
const users = await prisma.user.findMany({
  where: { role }
});

// ❌ INCORRECTO - Nunca usar raw queries sin sanitizar
const users = await prisma.$queryRaw`
  SELECT * FROM users WHERE role = ${role}
`;
```

```typescript
// ✅ CORRECTO - Remover campos sensibles
const { password, ...safeUser } = user;
return secureResponse(safeUser);

// ❌ INCORRECTO - Exponer todo
return secureResponse(user);
```

### 4. Rate Limiting en Producción

Para producción, se recomienda usar **Redis** para rate limiting distribuido:

```typescript
// Ejemplo con ioredis (no implementado aún)
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function checkRateLimit(
  key: string,
  limit: number,
  window: number
) {
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, window);
  }

  return count <= limit;
}
```

### 5. Logging en Producción

Integrar con servicios externos:

```typescript
// Ejemplo con Sentry (no implementado aún)
import * as Sentry from "@sentry/nextjs";

// En securityLogger.ts
private logToExternalService(entry: SecurityLogEntry): void {
  if (entry.level === SecurityLevel.CRITICAL ||
      entry.level === SecurityLevel.ERROR) {
    Sentry.captureException(new Error(entry.message), {
      level: entry.level.toLowerCase(),
      extra: entry.metadata,
      tags: {
        eventType: entry.eventType,
      }
    });
  }
}
```

---

## 🚨 Vulnerabilidades Conocidas

### Mitigadas:
- ✅ XSS (Cross-Site Scripting)
- ✅ SQL Injection
- ✅ CSRF (Cross-Site Request Forgery)
- ✅ Clickjacking
- ✅ MIME Sniffing
- ✅ Brute Force (parcial - rate limiting básico)
- ✅ Path Traversal
- ✅ Command Injection

### Pendientes (para producción final):
- ⚠️ DDoS Protection (usar Cloudflare/AWS Shield)
- ⚠️ Rate Limiting Distribuido (Redis)
- ⚠️ Logging Persistente (Base de datos o servicio externo)
- ⚠️ Alertas en Tiempo Real (PagerDuty, etc.)
- ⚠️ 2FA (Two-Factor Authentication)
- ⚠️ Session Management avanzado
- ⚠️ IP Blocking automático

---

## 📞 Contacto de Seguridad

Si encuentras una vulnerabilidad de seguridad, por favor repórtala de forma responsable:

1. **NO** crear un issue público
2. Contactar directamente al equipo de desarrollo
3. Proporcionar detalles completos (sin explotar la vulnerabilidad)
4. Esperar respuesta antes de divulgar públicamente

---

## 📚 Referencias

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [NextAuth.js Best Practices](https://next-auth.js.org/security)
- [Prisma Security](https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access)

---

**Última actualización:** Noviembre 2025
**Versión:** 1.0.0
