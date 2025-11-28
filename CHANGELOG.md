# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [1.0.0] - 2025-11-28

### 🎉 Primera Versión de Producción

Sistema completo de gestión para restaurantes de comida rápida listo para producción.

### ✨ Agregado

#### Sistema de Pedidos
- Menú público con productos por categoría
- Carrito de compras con persistencia en localStorage
- Checkout con validación completa
- Seguimiento de pedidos en tiempo real
- Historial de pedidos por cliente
- Estados: PENDIENTE, PREPARANDO, LISTO, ENTREGADO, CANCELADO
- Notificaciones por email en cada cambio de estado

#### Portal del Cliente
- Navegación y compra sin autenticación
- Sistema de registro e inicio de sesión
- Creación de tickets de soporte
- Chat en tiempo real con equipo de soporte (Pusher)
- Vista de detalle de tickets con historial
- Categorización: pedido, producto, entrega, pago, general
- Niveles de prioridad: baja, media, alta, urgente
- Perfil de usuario editable (nombre, email, contraseña)

#### Panel de Cocina/Staff
- Vista de pedidos en tiempo real
- Filtros por estado (Pendiente, Preparando, Listo)
- Actualización automática cada 30 segundos
- Cambio de estados de pedidos
- Vista de notas especiales del cliente
- Información del cliente y entrega

#### Panel Administrativo
- Dashboard con métricas clave y gráficos interactivos (Recharts)
- Estadísticas de ventas e ingresos
- Gráfico de ingresos de últimos 7 días (LineChart)
- Distribución de pedidos por estado (PieChart)
- Productos por categoría (BarChart)
- Gestión completa de productos (CRUD con UI completa)
- Gestión completa de categorías (CRUD con UI completa)
- Gestión completa de usuarios (CRUD con UI completa)
  - Crear, editar, eliminar usuarios
  - Asignación de roles (ADMIN, STAFF, CLIENTE)
  - Activar/desactivar usuarios
  - Estadísticas por usuario (pedidos, tickets)
  - Búsqueda y filtros por rol
  - Paginación en listado de usuarios
- Gestión de tickets de soporte con chat en tiempo real
- Vista de pedidos recientes
- Sistema de roles y permisos (ADMIN, STAFF, CLIENTE)
- Upload de imágenes con Uploadthing
- Exportación de reportes (PDF/Excel):
  - Reporte general del sistema
  - Exportación de pedidos
  - Exportación de productos
  - Exportación de categorías

#### Sistema de Notificaciones
- Notificaciones automáticas por email (Resend):
  - Confirmación de pedidos
  - Actualizaciones de estado de pedidos
  - Tickets y respuestas
  - Recuperación de contraseña
  - Templates HTML responsivos y profesionales
- Notificaciones in-app:
  - Bell icon con contador de no leídas
  - Auto-refresh cada 30 segundos
  - Marcar como leída/eliminar
  - Links contextuales a recursos
  - Tipos: ORDER_STATUS, TICKET_RESPONSE, SYSTEM, PROMOTION

#### Configuración del Restaurante
- Página de configuración centralizada (6 tabs)
- Información general (nombre, logo, descripción)
- Contacto y redes sociales
- Horarios de atención por día
- Configuración de pedidos y delivery (monto mínimo, costo, tiempo)
- Métodos de pago (efectivo, tarjeta, transferencia, etc.)
- Configuración de notificaciones por email
- Optimización SEO (meta title, description, keywords)

#### Seguridad Avanzada
- Sistema de rate limiting configurable por endpoint:
  - AUTH: 5 requests / 15 minutos
  - API: 100 requests / minuto
  - CREATE: 20 requests / minuto
  - SEARCH: 50 requests / minuto
  - UPLOAD: 10 requests / minuto
- Validación y sanitización de inputs
- Detección de inputs maliciosos (XSS, SQL injection, path traversal)
- Security headers (HSTS, CSP, X-Frame-Options, etc.)
- Logging completo de eventos de seguridad con niveles:
  - INFO, WARNING, ERROR, CRITICAL
  - Rastreo de: login, logout, accesos no autorizados, rate limit, inputs maliciosos
- Recuperación segura de contraseñas:
  - Tokens seguros con crypto.randomBytes
  - Expiración de 1 hora
  - Validación de uso único
  - Prevención de enumeración de usuarios
- Protección de APIs con autenticación y autorización
- Hash de contraseñas con bcryptjs
- Sesiones seguras con NextAuth.js y JWT

#### UI/UX
- Sistema de paginación reutilizable con hook personalizado
- Componente NotificationBell para notificaciones in-app
- Diseño responsive para todos los dispositivos
- Componentes reutilizables (Card, Button, Badge, Input, etc.)
- Iconos con Lucide React
- Feedback visual en todas las acciones
- Loading states
- Error handling consistente

#### Documentación
- README.md completo con toda la información del proyecto
- SETUP.md con guía de configuración de PostgreSQL
- SECURITY.md con documentación de seguridad completa
- DEPLOYMENT.md con guías detalladas de despliegue:
  - Vercel (recomendado)
  - Railway
  - Docker + docker-compose
  - PM2 + Nginx para VPS
  - Configuración de SSL, backups, monitoreo
  - Troubleshooting
- Metadata SEO optimizada (Open Graph, Twitter Card)
- robots.txt para crawlers
- sitemap.xml dinámico
- Checklist pre-producción

#### APIs REST
- 40+ endpoints documentados
- Autenticación: registro, login, recuperación de contraseña
- Categorías: CRUD completo
- Productos: CRUD completo
- Pedidos: CRUD completo con notificaciones
- Tickets: CRUD completo
- Chat: mensajes en tiempo real
- Usuarios: CRUD completo (ADMIN)
- Perfil: gestión de perfil de usuario
- Notificaciones: CRUD de notificaciones in-app
- Configuración: gestión de configuración del restaurante

### 🔧 Tecnologías

#### Frontend
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React (iconos)
- Recharts (gráficos)
- Context API (gestión de estado)

#### Backend & Database
- Prisma ORM
- PostgreSQL
- NextAuth.js (autenticación)
- bcryptjs (hash de contraseñas)
- Zod (validación de esquemas)

#### Servicios Externos (Opcionales)
- Uploadthing (upload de imágenes)
- Resend (envío de emails)
- Pusher (chat en tiempo real)

### 📊 Modelos de Base de Datos

- User (con roles ADMIN, STAFF, CLIENTE)
- Category
- Product
- Order
- OrderItem
- Ticket
- ChatMessage
- PasswordResetToken
- Notification (con tipos ORDER_STATUS, TICKET_RESPONSE, SYSTEM, PROMOTION)
- RestaurantConfig

### 🔐 Seguridad

- Rate limiting por endpoint
- Validación y sanitización de inputs
- Security headers (HSTS, CSP, etc.)
- Logging de eventos de seguridad
- Tokens seguros para recuperación de contraseña
- Protección contra XSS, SQL injection, CSRF, clickjacking
- Autenticación y autorización basada en roles

### 📝 Notas

- Las APIs de terceros (Resend, Uploadthing, Pusher) son opcionales
- El sistema funciona sin ellas con funcionalidad limitada
- Incluye datos de prueba (seed.ts)
- Middleware de protección de rutas
- Sistema completamente en español

---

## [Unreleased]

### Próximas Mejoras Planeadas

- [ ] Sistema de cupones y descuentos
- [ ] Historial detallado de cambios (audit log)
- [ ] Notificaciones push en navegador
- [ ] Sistema de calificación de productos
- [ ] Panel de analytics avanzado
- [ ] Integración con pasarelas de pago (Stripe, PayPal)
- [ ] Sistema de inventario automático
- [ ] Autenticación 2FA
- [ ] Rate limiting distribuido con Redis
- [ ] Logs persistentes en base de datos
- [ ] Tests unitarios y de integración
- [ ] CI/CD pipeline
- [ ] Modo offline (PWA)
- [ ] Multi-idioma (i18n)
- [ ] Dark mode

---

**Formato del Changelog:**
- `Agregado` para nuevas funcionalidades
- `Cambiado` para cambios en funcionalidades existentes
- `Obsoleto` para funcionalidades que serán eliminadas
- `Eliminado` para funcionalidades eliminadas
- `Arreglado` para corrección de bugs
- `Seguridad` para vulnerabilidades corregidas
