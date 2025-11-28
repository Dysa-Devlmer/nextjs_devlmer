/**
 * Sistema de logging de eventos de seguridad
 * En producción, estos logs deberían enviarse a un servicio externo
 * como Sentry, LogRocket, o almacenarse en base de datos
 */

export enum SecurityEventType {
  // Autenticación
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  PASSWORD_RESET_REQUESTED = 'PASSWORD_RESET_REQUESTED',
  PASSWORD_RESET_COMPLETED = 'PASSWORD_RESET_COMPLETED',

  // Autorización
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  FORBIDDEN_ACTION = 'FORBIDDEN_ACTION',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // Inputs sospechosos
  MALICIOUS_INPUT_DETECTED = 'MALICIOUS_INPUT_DETECTED',
  VALIDATION_FAILED = 'VALIDATION_FAILED',

  // Cambios críticos
  USER_CREATED = 'USER_CREATED',
  USER_DELETED = 'USER_DELETED',
  USER_ROLE_CHANGED = 'USER_ROLE_CHANGED',
  USER_DEACTIVATED = 'USER_DEACTIVATED',

  // Operaciones sensibles
  BULK_OPERATION = 'BULK_OPERATION',
  DATA_EXPORT = 'DATA_EXPORT',

  // Errores
  API_ERROR = 'API_ERROR',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
}

export enum SecurityLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

interface SecurityLogEntry {
  timestamp: Date;
  eventType: SecurityEventType;
  level: SecurityLevel;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  endpoint?: string;
  method?: string;
  message: string;
  metadata?: Record<string, any>;
}

class SecurityLogger {
  private logs: SecurityLogEntry[] = [];
  private maxLogsInMemory: number = 1000;

  /**
   * Registrar evento de seguridad
   */
  public log(
    eventType: SecurityEventType,
    level: SecurityLevel,
    message: string,
    metadata?: {
      userId?: string;
      userEmail?: string;
      ipAddress?: string;
      userAgent?: string;
      endpoint?: string;
      method?: string;
      [key: string]: any;
    }
  ): void {
    const entry: SecurityLogEntry = {
      timestamp: new Date(),
      eventType,
      level,
      message,
      userId: metadata?.userId,
      userEmail: metadata?.userEmail,
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
      endpoint: metadata?.endpoint,
      method: metadata?.method,
      metadata,
    };

    // Agregar a logs en memoria
    this.logs.push(entry);

    // Mantener solo los últimos N logs en memoria
    if (this.logs.length > this.maxLogsInMemory) {
      this.logs.shift();
    }

    // Log a consola según el nivel
    this.logToConsole(entry);

    // En producción, aquí deberías:
    // 1. Enviar a servicio de logging externo (Sentry, LogRocket, etc.)
    // 2. Guardar en base de datos para auditoría
    // 3. Enviar alertas para eventos CRITICAL

    if (level === SecurityLevel.CRITICAL) {
      this.handleCriticalEvent(entry);
    }
  }

  /**
   * Logs de autenticación
   */
  public logLoginSuccess(userId: string, userEmail: string, ipAddress: string): void {
    this.log(
      SecurityEventType.LOGIN_SUCCESS,
      SecurityLevel.INFO,
      `Usuario autenticado exitosamente: ${userEmail}`,
      { userId, userEmail, ipAddress }
    );
  }

  public logLoginFailed(email: string, ipAddress: string, reason: string): void {
    this.log(
      SecurityEventType.LOGIN_FAILED,
      SecurityLevel.WARNING,
      `Intento de login fallido para: ${email}. Razón: ${reason}`,
      { userEmail: email, ipAddress, reason }
    );
  }

  public logPasswordResetRequested(email: string, ipAddress: string): void {
    this.log(
      SecurityEventType.PASSWORD_RESET_REQUESTED,
      SecurityLevel.INFO,
      `Solicitud de reseteo de contraseña para: ${email}`,
      { userEmail: email, ipAddress }
    );
  }

  /**
   * Logs de autorización
   */
  public logUnauthorizedAccess(
    userId: string | undefined,
    endpoint: string,
    ipAddress: string
  ): void {
    this.log(
      SecurityEventType.UNAUTHORIZED_ACCESS,
      SecurityLevel.WARNING,
      `Intento de acceso no autorizado al endpoint: ${endpoint}`,
      { userId, endpoint, ipAddress }
    );
  }

  /**
   * Logs de rate limiting
   */
  public logRateLimitExceeded(identifier: string, endpoint: string): void {
    this.log(
      SecurityEventType.RATE_LIMIT_EXCEEDED,
      SecurityLevel.WARNING,
      `Rate limit excedido para: ${identifier} en ${endpoint}`,
      { identifier, endpoint }
    );
  }

  /**
   * Logs de inputs maliciosos
   */
  public logMaliciousInput(
    userId: string | undefined,
    input: string,
    reasons: string[],
    endpoint: string,
    ipAddress: string
  ): void {
    this.log(
      SecurityEventType.MALICIOUS_INPUT_DETECTED,
      SecurityLevel.ERROR,
      `Input malicioso detectado. Razones: ${reasons.join(', ')}`,
      { userId, input: input.substring(0, 100), reasons, endpoint, ipAddress }
    );
  }

  /**
   * Logs de cambios críticos
   */
  public logUserCreated(
    createdUserId: string,
    createdByUserId: string,
    userEmail: string,
    role: string
  ): void {
    this.log(
      SecurityEventType.USER_CREATED,
      SecurityLevel.INFO,
      `Nuevo usuario creado: ${userEmail} con rol ${role}`,
      { createdUserId, createdByUserId, userEmail, role }
    );
  }

  public logUserDeleted(
    deletedUserId: string,
    deletedByUserId: string,
    userEmail: string
  ): void {
    this.log(
      SecurityEventType.USER_DELETED,
      SecurityLevel.WARNING,
      `Usuario eliminado: ${userEmail}`,
      { deletedUserId, deletedByUserId, userEmail }
    );
  }

  public logUserRoleChanged(
    userId: string,
    changedByUserId: string,
    oldRole: string,
    newRole: string
  ): void {
    this.log(
      SecurityEventType.USER_ROLE_CHANGED,
      SecurityLevel.WARNING,
      `Rol de usuario cambiado de ${oldRole} a ${newRole}`,
      { userId, changedByUserId, oldRole, newRole }
    );
  }

  /**
   * Obtener logs recientes
   */
  public getRecentLogs(limit: number = 100): SecurityLogEntry[] {
    return this.logs.slice(-limit);
  }

  /**
   * Obtener logs por tipo de evento
   */
  public getLogsByEventType(eventType: SecurityEventType): SecurityLogEntry[] {
    return this.logs.filter(log => log.eventType === eventType);
  }

  /**
   * Obtener logs críticos
   */
  public getCriticalLogs(): SecurityLogEntry[] {
    return this.logs.filter(log => log.level === SecurityLevel.CRITICAL);
  }

  /**
   * Obtener logs por usuario
   */
  public getLogsByUser(userId: string): SecurityLogEntry[] {
    return this.logs.filter(log => log.userId === userId);
  }

  /**
   * Log a consola
   */
  private logToConsole(entry: SecurityLogEntry): void {
    const prefix = `[SECURITY][${entry.level}][${entry.eventType}]`;
    const timestamp = entry.timestamp.toISOString();
    const message = `${prefix} ${timestamp} - ${entry.message}`;

    switch (entry.level) {
      case SecurityLevel.CRITICAL:
      case SecurityLevel.ERROR:
        console.error(message, entry.metadata);
        break;
      case SecurityLevel.WARNING:
        console.warn(message, entry.metadata);
        break;
      default:
        console.log(message, entry.metadata);
    }
  }

  /**
   * Manejar eventos críticos
   */
  private handleCriticalEvent(entry: SecurityLogEntry): void {
    // En producción, aquí deberías:
    // 1. Enviar notificación inmediata a administradores
    // 2. Enviar a sistema de alertas (PagerDuty, etc.)
    // 3. Posiblemente bloquear automáticamente la IP
    console.error('⚠️ EVENTO DE SEGURIDAD CRÍTICO ⚠️', entry);
  }

  /**
   * Limpiar logs antiguos (para testing o mantenimiento)
   */
  public clearLogs(): void {
    this.logs = [];
  }

  /**
   * Exportar logs (para auditoría)
   */
  public exportLogs(): SecurityLogEntry[] {
    return [...this.logs];
  }
}

// Instancia global del logger
export const securityLogger = new SecurityLogger();

/**
 * Helper para extraer información del request
 */
export function getRequestInfo(req: Request): {
  ipAddress: string;
  userAgent: string;
  endpoint: string;
  method: string;
} {
  const forwarded = req.headers.get('x-forwarded-for');
  const ipAddress = forwarded ? forwarded.split(',')[0].trim() :
                    req.headers.get('x-real-ip') || 'unknown';

  const userAgent = req.headers.get('user-agent') || 'unknown';
  const url = new URL(req.url);
  const endpoint = url.pathname;
  const method = req.method;

  return { ipAddress, userAgent, endpoint, method };
}
