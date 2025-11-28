# 🍔 FastFood - Sistema Completo de Gestión para Restaurantes

Sistema integral de gestión para restaurantes de comida rápida que incluye pedidos en línea, gestión de productos, atención posventa y panel administrativo completo.

## 📚 Documentación

- **[🚀 QUICKSTART.md](QUICKSTART.md)** - Guía de inicio rápido (10 minutos)
- **[⚙️ SETUP.md](SETUP.md)** - Configuración detallada de PostgreSQL
- **[🔒 SECURITY.md](SECURITY.md)** - Guía completa de seguridad
- **[🚢 DEPLOYMENT.md](DEPLOYMENT.md)** - Guías de despliegue (Vercel, Railway, Docker)
- **[🤝 CONTRIBUTING.md](CONTRIBUTING.md)** - Guía para contribuidores
- **[📝 CHANGELOG.md](CHANGELOG.md)** - Historial de cambios del proyecto

## ✨ Características Principales

### 🛒 Sistema de Pedidos en Línea
- ✅ Menú público con productos por categoría
- ✅ Carrito de compras con persistencia
- ✅ Checkout con validación completa
- ✅ Seguimiento de pedidos en tiempo real
- ✅ Historial de pedidos
- ✅ Confirmación y detalles del pedido

### 👤 Portal del Cliente
- ✅ Navegación y compra sin autenticación
- ✅ Registro e inicio de sesión
- ✅ Creación de tickets de soporte
- ✅ Seguimiento de tickets con estadísticas
- ✅ **Chat en tiempo real** con equipo de soporte
- ✅ Vista de detalle de tickets con historial
- ✅ Historial completo de pedidos
- ✅ Categorización de tickets (pedido, producto, entrega, pago, general)
- ✅ Niveles de prioridad (baja, media, alta, urgente)

### 👨‍🍳 Panel de Cocina/Staff
- ✅ Vista de pedidos en tiempo real
- ✅ Filtros por estado (Pendiente, Preparando, Listo)
- ✅ Actualización automática cada 30 segundos
- ✅ Cambio de estados de pedidos
- ✅ Vista de notas especiales
- ✅ Información del cliente y entrega

### 👨‍💼 Panel Administrativo
- ✅ Dashboard con métricas clave
- ✅ Estadísticas de ventas e ingresos
- ✅ Gestión completa de productos (CRUD con UI)
- ✅ Gestión completa de categorías (CRUD con UI)
- ✅ Gestión completa de usuarios (CRUD con UI)
  - Crear, editar, eliminar usuarios
  - Asignación de roles (ADMIN, STAFF, CLIENTE)
  - Activar/desactivar usuarios
  - Estadísticas por usuario (pedidos, tickets)
  - Búsqueda y filtros por rol
  - Paginación en listado de usuarios
- ✅ Gestión de tickets de soporte con chat en tiempo real
- ✅ Vista de pedidos recientes
- ✅ Sistema de roles y permisos
- ✅ Gráficos interactivos (Recharts):
  - Ingresos de últimos 7 días
  - Distribución de pedidos por estado
  - Productos por categoría
  - Estadísticas adicionales
- ✅ Upload de imágenes con Uploadthing
- ✅ Exportación de reportes (PDF/Excel):
  - Reporte general del sistema
  - Exportación de pedidos
  - Exportación de productos
  - Exportación de categorías
- ✅ Notificaciones automáticas por email:
  - Confirmación de pedidos
  - Actualizaciones de estado
  - Tickets y respuestas
  - Recuperación de contraseña
- ✅ Sistema de notificaciones in-app:
  - Bell icon con contador de no leídas
  - Auto-refresh cada 30 segundos
  - Marcar como leída/eliminar
  - Links contextuales a recursos
  - Tipos: ORDER_STATUS, TICKET_RESPONSE, SYSTEM, PROMOTION
- ✅ Configuración del restaurante:
  - Información general (nombre, logo, descripción)
  - Contacto y redes sociales
  - Horarios de atención por día
  - Configuración de pedidos y delivery
  - Métodos de pago
  - Configuración de notificaciones
  - Optimización SEO (meta tags)
- ✅ Sistema de paginación en listas largas
- ✅ Perfil de usuario editable
- ✅ Recuperación de contraseña segura

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 15** - Framework React con App Router
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Estilos modernos
- **Lucide React** - Iconos
- **Context API** - Gestión de estado

### Backend & Database
- **Prisma ORM** - ORM para TypeScript
- **PostgreSQL** - Base de datos relacional
- **NextAuth.js** - Autenticación
- **bcryptjs** - Hash de contraseñas
- **Zod** - Validación de esquemas

### APIs & Servicios (Opcionales)
- **Uploadthing** - Upload de imágenes
- **Resend** - Envío de emails
- **Pusher** - Chat en tiempo real

## 📁 Estructura del Proyecto

```
nextjs_devlmer/
├── app/
│   ├── page.tsx                      # Página principal
│   ├── layout.tsx                    # Layout global con providers
│   ├── auth/                         # Autenticación
│   │   ├── login/page.tsx           # Login
│   │   ├── register/page.tsx        # Registro
│   │   ├── forgot-password/page.tsx # Recuperar contraseña
│   │   └── reset-password/page.tsx  # Resetear contraseña
│   ├── perfil/page.tsx              # Perfil de usuario editable
│   ├── menu/page.tsx                # Menú público
│   ├── cart/page.tsx                # Carrito de compras
│   ├── checkout/page.tsx            # Checkout
│   ├── orders/[id]/page.tsx         # Detalle de pedido
│   ├── cliente/                     # Portal del cliente
│   │   ├── page.tsx                 # Tickets del cliente
│   │   ├── tickets/[id]/page.tsx    # Detalle de ticket con chat
│   │   └── nuevo/page.tsx           # Crear ticket
│   ├── staff/page.tsx               # Panel de cocina
│   ├── admin/                       # Panel administrativo
│   │   ├── page.tsx                 # Dashboard admin con gráficos
│   │   ├── tickets/                 # Gestión de tickets
│   │   │   ├── page.tsx            # Lista de tickets
│   │   │   └── [id]/page.tsx       # Detalle con chat y gestión
│   │   ├── users/                   # Gestión de usuarios
│   │   │   ├── page.tsx            # Lista de usuarios
│   │   │   ├── new/page.tsx        # Crear usuario
│   │   │   └── [id]/page.tsx       # Editar usuario
│   │   ├── products/                # Gestión de productos
│   │   │   ├── page.tsx            # Lista de productos
│   │   │   ├── new/page.tsx        # Crear producto
│   │   │   └── [id]/page.tsx       # Editar producto
│   │   ├── categories/              # Gestión de categorías
│   │   │   ├── page.tsx            # Lista de categorías
│   │   │   ├── new/page.tsx        # Crear categoría
│   │   │   └── [id]/page.tsx       # Editar categoría
│   │   └── config/page.tsx          # Configuración del restaurante
│   ├── api/                         # API REST
│   │   ├── auth/                    # Auth endpoints
│   │   │   ├── [...nextauth]/route.ts  # NextAuth
│   │   │   ├── register/route.ts       # Registro
│   │   │   ├── forgot-password/route.ts # Solicitar reset
│   │   │   └── reset-password/route.ts  # Resetear password
│   │   ├── categories/              # CRUD de categorías
│   │   ├── products/                # CRUD de productos
│   │   ├── orders/                  # CRUD de pedidos
│   │   ├── tickets/                 # CRUD de tickets
│   │   ├── chat/route.ts            # Chat en tiempo real
│   │   ├── users/                   # CRUD de usuarios
│   │   ├── profile/route.ts         # Perfil de usuario
│   │   ├── notifications/           # Notificaciones in-app
│   │   ├── config/route.ts          # Configuración del restaurante
│   │   └── uploadthing/             # Upload de imágenes
├── components/
│   ├── ui/                          # Componentes reutilizables
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   ├── ImageUpload.tsx          # Upload de imágenes
│   │   ├── Pagination.tsx           # Paginación reutilizable
│   │   └── NotificationBell.tsx     # Bell de notificaciones
│   └── providers/
│       └── SessionProvider.tsx      # Provider de sesión
├── context/
│   ├── CartContext.tsx             # Context del carrito
│   └── TicketContext.tsx           # Context de tickets
├── hooks/
│   └── usePagination.ts            # Hook de paginación
├── lib/
│   ├── prisma.ts                   # Cliente de Prisma
│   ├── auth.ts                     # Configuración de NextAuth
│   ├── uploadthing.ts              # Helpers de Uploadthing
│   ├── exportUtils.ts              # Utilidades de exportación
│   ├── emailTemplates.ts           # Templates de emails
│   ├── notifications.ts            # Utilidades de notificaciones
│   ├── rateLimit.ts                # Sistema de rate limiting
│   ├── validation.ts               # Validación y sanitización
│   ├── securityLogger.ts           # Logging de seguridad
│   └── apiSecurity.ts              # Helpers de seguridad para APIs
├── prisma/
│   ├── schema.prisma               # Schema de la base de datos
│   └── seed.ts                     # Datos de prueba
├── types/
│   ├── index.ts                    # Tipos de la app
│   └── next-auth.d.ts             # Tipos de NextAuth
├── middleware.ts                   # Middleware de protección
├── next.config.ts                  # Config de Next.js con security headers
├── SECURITY.md                     # Documentación de seguridad
└── .env                           # Variables de entorno
```

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/Dysa-Devlmer/nextjs_devlmer.git
cd nextjs_devlmer
git checkout claude/web-app-posventa-012qcfDLYQ7WpqumpSjiFdFV
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Base de Datos

Ver el archivo **SETUP.md** para instrucciones detalladas de configuración de PostgreSQL (local o en la nube).

Configuración rápida con archivo `.env.local`:

```env
# Base de datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/fastfood_db"

# NextAuth (Autenticación)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-key-aqui"  # Genera uno con: openssl rand -base64 32

# Email (Resend) - Opcional para desarrollo
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxx"

# Upload de Imágenes (UploadThing) - Opcional para desarrollo
UPLOADTHING_SECRET="sk_xxxxxxxxxxxxxxxxxxxxx"
UPLOADTHING_APP_ID="xxxxxxxxx"

# Chat en Tiempo Real (Pusher) - Opcional para desarrollo
NEXT_PUBLIC_PUSHER_KEY="xxxxxxxxxxxxxxxxxx"
NEXT_PUBLIC_PUSHER_CLUSTER="xx"
PUSHER_APP_ID="xxxxxx"
PUSHER_SECRET="xxxxxxxxxxxxxxxxxxxx"
```

**Nota**: Las APIs de terceros (Resend, Uploadthing, Pusher) son opcionales. El sistema funcionará sin ellas con funcionalidad limitada.

### 4. Ejecutar migraciones y seed

```bash
# Crear las tablas
npm run db:push

# Poblar con datos de ejemplo
npm run db:seed
```

### 5. Iniciar la aplicación

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 👥 Usuarios de Prueba

El sistema incluye usuarios precargados:

| Rol | Email | Password | Descripción |
|-----|-------|----------|-------------|
| **Admin** | admin@fastfood.com | password123 | Acceso completo al sistema |
| **Staff** | staff@fastfood.com | password123 | Panel de cocina |
| **Cliente** | juan@email.com | password123 | Cliente de ejemplo 1 |
| **Cliente** | maria@email.com | password123 | Cliente de ejemplo 2 |

## 🗺️ Rutas de la Aplicación

### Públicas
- `/` - Página principal
- `/menu` - Menú de productos (público)
- `/auth/login` - Iniciar sesión
- `/auth/register` - Registrarse
- `/auth/forgot-password` - Recuperar contraseña
- `/auth/reset-password?token=...` - Resetear contraseña con token

### Clientes (Requiere autenticación)
- `/perfil` - Perfil de usuario editable
- `/cart` - Carrito de compras
- `/checkout` - Procesar pedido
- `/orders/[id]` - Detalle del pedido
- `/cliente/tickets` - Mis tickets de soporte
- `/cliente/tickets/[id]` - Detalle de ticket con **chat en tiempo real**
- `/cliente/nuevo` - Crear nuevo ticket

### Staff (Requiere rol STAFF o ADMIN)
- `/staff` - Panel de cocina

### Admin (Requiere rol ADMIN)
- `/admin` - Dashboard administrativo con gráficos interactivos y notificaciones
- `/admin/users` - Gestión de usuarios (con UI completa)
  - `/admin/users/new` - Crear usuario
  - `/admin/users/[id]` - Editar usuario
- `/admin/tickets` - Gestión de tickets
  - `/admin/tickets/[id]` - Detalle de ticket con **chat en tiempo real** y panel de gestión
- `/admin/products` - Gestión de productos (con UI completa)
  - `/admin/products/new` - Crear producto
  - `/admin/products/[id]` - Editar producto
- `/admin/categories` - Gestión de categorías (con UI completa)
  - `/admin/categories/new` - Crear categoría
  - `/admin/categories/[id]` - Editar categoría
- `/admin/config` - Configuración del restaurante (6 tabs: General, Contacto, Horarios, Pedidos, Notificaciones, SEO)

## 🎯 Flujos de Usuario

### Flujo de Pedido
1. **Cliente navega** → Menú (`/menu`)
2. **Agrega productos** → Carrito (`/cart`)
3. **Inicia sesión** → Login (`/auth/login`)
4. **Completa datos** → Checkout (`/checkout`)
5. **Confirma pedido** → Detalle (`/orders/[id]`)
6. **Staff prepara** → Panel Cocina (`/staff`)

### Flujo de Ticket con Chat en Tiempo Real
1. **Cliente tiene problema** → Crear Ticket (`/cliente/nuevo`)
2. **Sistema envía email** → Confirmación automática
3. **Cliente abre chat** → Vista detalle (`/cliente/tickets/[id]`)
4. **Chat en tiempo real** → Cliente ↔ Soporte
5. **Admin/Staff responde** → Panel de gestión (`/admin/tickets/[id]`)
6. **Conversación fluida** → Mensajes instantáneos con Pusher
7. **Admin resuelve** → Actualiza estado del ticket
8. **Cliente recibe notificación** → Email de actualización

## 📊 Modelos de Base de Datos

### User
- Roles: ADMIN, STAFF, CLIENTE
- Campo `activo` para activar/desactivar usuarios
- Relaciones: Orders, Tickets, ChatMessages, Notifications, PasswordResetTokens

### Category & Product
- Categorías de productos
- Productos con precio e imagen
- Estado activo/inactivo

### Order & OrderItem
- Estados: PENDIENTE, PREPARANDO, LISTO, ENTREGADO, CANCELADO
- Cálculo automático de impuestos
- Items con notas especiales

### Ticket & ChatMessage
- Sistema completo de tickets de soporte
- Estados: ABIERTO, EN_PROCESO, RESUELTO, CERRADO
- Prioridades: BAJA, MEDIA, ALTA, URGENTE
- Categorías: pedido, producto, entrega, pago, general
- **Chat en tiempo real** totalmente funcional
- Mensajes con historial completo
- Notificaciones por email

### PasswordResetToken
- Tokens seguros para recuperación de contraseña
- Expiración de 1 hora
- Validación de uso único

### Notification
- Sistema de notificaciones in-app
- Tipos: ORDER_STATUS, TICKET_RESPONSE, SYSTEM, PROMOTION
- Estado leído/no leído
- Links contextuales a recursos

### RestaurantConfig
- Configuración centralizada del restaurante
- 30+ campos configurables
- Información general, contacto, horarios
- Configuración de pedidos y delivery
- Métodos de pago
- SEO metadata

## 🔌 APIs REST Disponibles

### Categorías
- `GET /api/categories` - Listar categorías
- `POST /api/categories` - Crear categoría (ADMIN)
- `GET /api/categories/[id]` - Obtener categoría
- `PUT /api/categories/[id]` - Actualizar (ADMIN)
- `DELETE /api/categories/[id]` - Eliminar (ADMIN)

### Productos
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto (ADMIN)
- `GET /api/products/[id]` - Obtener producto
- `PUT /api/products/[id]` - Actualizar (ADMIN)
- `DELETE /api/products/[id]` - Eliminar (ADMIN)

### Pedidos
- `GET /api/orders` - Listar pedidos
- `POST /api/orders` - Crear pedido (envía email de confirmación y notificación)
- `GET /api/orders/[id]` - Obtener pedido
- `PUT /api/orders/[id]` - Actualizar estado (STAFF/ADMIN, envía email y notificación)
- `DELETE /api/orders/[id]` - Cancelar pedido

### Tickets
- `GET /api/tickets` - Listar tickets (filtrado por rol)
- `POST /api/tickets` - Crear ticket (envía email de confirmación)
- `GET /api/tickets/[id]` - Obtener ticket
- `PUT /api/tickets/[id]` - Actualizar ticket (STAFF/ADMIN)
- `DELETE /api/tickets/[id]` - Eliminar ticket (ADMIN)

### Chat (Tiempo Real)
- `GET /api/chat?ticketId=[id]` - Obtener mensajes de un ticket
- `POST /api/chat` - Enviar mensaje (con Pusher real-time)
- Eventos Pusher: `ticket-{id}` → `new-message`

### Usuarios (ADMIN)
- `GET /api/users` - Listar usuarios con búsqueda y filtros
- `POST /api/users` - Crear usuario (ADMIN)
- `GET /api/users/[id]` - Obtener usuario
- `PUT /api/users/[id]` - Actualizar usuario (ADMIN)
- `DELETE /api/users/[id]` - Eliminar usuario (ADMIN)

### Perfil
- `GET /api/profile` - Obtener perfil del usuario autenticado
- `PUT /api/profile` - Actualizar perfil (nombre, email, contraseña)

### Notificaciones
- `GET /api/notifications` - Listar notificaciones del usuario
- `POST /api/notifications` - Crear notificación (SYSTEM)
- `PUT /api/notifications/[id]` - Marcar como leída
- `DELETE /api/notifications/[id]` - Eliminar notificación

### Configuración del Restaurante (ADMIN)
- `GET /api/config` - Obtener configuración actual
- `PUT /api/config` - Actualizar configuración (ADMIN)

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/[...nextauth]` - NextAuth endpoints
- `POST /api/auth/forgot-password` - Solicitar recuperación de contraseña
- `POST /api/auth/reset-password` - Resetear contraseña con token

## ⚙️ Scripts Útiles

```bash
# Desarrollo
npm run dev                    # Iniciar servidor de desarrollo

# Base de datos
npm run db:push               # Aplicar schema a la base de datos
npm run db:seed               # Poblar con datos de ejemplo
npm run db:studio             # Abrir Prisma Studio

# Producción
npm run build                 # Compilar para producción
npm start                     # Iniciar servidor de producción
```

## 🎨 Características Técnicas

### Autenticación y Seguridad
- ✅ NextAuth.js con credenciales
- ✅ Hash de contraseñas con bcrypt
- ✅ Middleware de protección de rutas
- ✅ Sistema de roles granular
- ✅ Sesiones con JWT
- ✅ **Sistema de seguridad avanzado** (ver SECURITY.md):
  - Rate limiting configurado por endpoint
  - Validación y sanitización de inputs
  - Detección de inputs maliciosos (XSS, SQL injection, path traversal)
  - Security headers (HSTS, CSP, X-Frame-Options, etc.)
  - Logging completo de eventos de seguridad
  - Protección contra CSRF, clickjacking, MIME sniffing
  - Recuperación segura de contraseñas con tokens
  - Validación de archivos y tipos de contenido

### Gestión de Estado
- ✅ Context API para carrito
- ✅ Context API para tickets
- ✅ Session Provider global
- ✅ Persistencia en localStorage
- ✅ Actualización en tiempo real

### UI/UX
- ✅ Diseño responsive
- ✅ Componentes reutilizables
- ✅ Iconos con Lucide React
- ✅ Feedback visual
- ✅ Loading states
- ✅ Error handling

### Base de Datos
- ✅ Prisma ORM
- ✅ Migraciones automáticas
- ✅ Seed con datos de prueba
- ✅ Relaciones complejas
- ✅ Validación de integridad

## 🔒 Sistema de Seguridad

El sistema implementa medidas de seguridad de nivel empresarial para proteger datos y prevenir ataques. Ver **SECURITY.md** para documentación completa.

### Rate Limiting
- Límites configurables por tipo de endpoint
- Headers informativos (X-RateLimit-Limit, X-RateLimit-Remaining)
- Protección contra fuerza bruta y abuso de APIs
- Configuraciones predefinidas:
  - AUTH: 5 requests / 15 minutos
  - API: 100 requests / minuto
  - CREATE: 20 requests / minuto
  - SEARCH: 50 requests / minuto
  - UPLOAD: 10 requests / minuto

### Validación y Sanitización
- Validación de emails con regex completo
- Validación de contraseñas con cálculo de fortaleza
- Sanitización automática de strings (remueve scripts, eventos)
- Detección de inputs maliciosos:
  - XSS (Cross-Site Scripting)
  - SQL Injection
  - Path Traversal
  - Command Injection
- Validación de archivos (tipo, tamaño)

### Security Headers
Configurados automáticamente en todas las respuestas:
- `X-Frame-Options: DENY` - Previene clickjacking
- `X-Content-Type-Options: nosniff` - Previene MIME sniffing
- `X-XSS-Protection: 1; mode=block` - Protección XSS legacy
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` - Limita APIs del navegador
- `Strict-Transport-Security` - Fuerza HTTPS

### Logging de Seguridad
Sistema completo de auditoría con múltiples niveles:
- **Eventos rastreados**: Login, logout, accesos no autorizados, rate limit excedido, inputs maliciosos, cambios de rol, creación/eliminación de usuarios
- **Niveles de severidad**: INFO, WARNING, ERROR, CRITICAL
- **Metadata completa**: IP, user agent, endpoint, timestamps
- Logs consultables por tipo, usuario, nivel de severidad
- En producción: integrable con Sentry, LogRocket, etc.

### Recuperación de Contraseña
- Tokens seguros generados con crypto.randomBytes
- Expiración de 1 hora
- Validación de uso único
- Invalidación de tokens anteriores
- Emails HTML profesionales
- Prevención de enumeración de usuarios

### Protección de APIs
- Autenticación requerida en endpoints sensibles
- Autorización basada en roles
- Sanitización de responses (remueve campos sensibles)
- Validación de Content-Type
- Timeouts para prevenir slowloris
- Detección básica de bots

## 📈 Funcionalidades Implementadas

- [x] UI completa para CRUD de productos en admin
- [x] UI completa para CRUD de categorías en admin
- [x] Upload de imágenes con Uploadthing
- [x] Exportación de reportes (PDF/Excel)
- [x] Dashboard con gráficos interactivos (Recharts)
- [x] **Notificaciones por email con Resend**:
  - Email de bienvenida al registrarse
  - Confirmación de pedido con detalles
  - Actualización de estado de pedido
  - Notificación de ticket creado
  - Templates HTML responsivos y profesionales
- [x] **Chat en tiempo real con Pusher**:
  - Mensajes instantáneos en tickets
  - Actualizaciones en tiempo real
  - Historial completo de conversación
  - Indicador de fecha y hora
  - Separadores de fecha
  - Fallback cuando Pusher no está configurado

## 🚀 Deployment a Producción

El sistema está listo para desplegar a producción. Ver **DEPLOYMENT.md** para guías detalladas de despliegue en:

- **Vercel** (Recomendado) - Deploy en 1 click con integración Git
- **Railway** - PostgreSQL incluido, deploy automático
- **DigitalOcean/AWS/GCP** - Hosting tradicional con Docker

### Checklist Pre-Producción

- [ ] Configurar NEXTAUTH_SECRET fuerte (generado con openssl)
- [ ] Configurar variables de entorno en plataforma de hosting
- [ ] Configurar base de datos PostgreSQL en producción
- [ ] Ejecutar migraciones de Prisma
- [ ] Configurar dominio personalizado y SSL
- [ ] Configurar Resend para emails
- [ ] Configurar UploadThing para imágenes
- [ ] Configurar Pusher para chat en tiempo real
- [ ] Revisar y ajustar límites de rate limiting
- [ ] Configurar monitoreo y alertas (Sentry, LogRocket)
- [ ] Configurar backups automáticos de base de datos
- [ ] Realizar pruebas de seguridad
- [ ] Configurar WAF si es necesario

## 🔮 Próximas Mejoras (Opcionales)

- [ ] Sistema de cupones y descuentos
- [ ] Historial detallado de cambios
- [ ] Notificaciones push en navegador
- [ ] Sistema de calificación de productos
- [ ] Panel de analytics avanzado
- [ ] Integración con pasarelas de pago (Stripe, PayPal)
- [ ] Sistema de inventario automático
- [ ] Autenticación 2FA
- [ ] Rate limiting distribuido con Redis
- [ ] Logs persistentes en base de datos

## 📝 Notas de Desarrollo

- El sistema usa Next.js 15 con Turbopack para desarrollo rápido
- Las rutas de API están protegidas por roles
- El middleware maneja redirecciones automáticas
- Los datos se persisten en PostgreSQL
- El carrito se guarda en localStorage

## 🤝 Contribuir

Este es un proyecto de demostración. Para contribuir:

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es un sistema de demostración para gestión integral de restaurantes de comida rápida.

## 🆘 Soporte

Para configuración y problemas, consulta:
- **SETUP.md** - Guía completa de configuración
- **prisma/schema.prisma** - Estructura de la base de datos
- **middleware.ts** - Reglas de protección de rutas

---

**Desarrollado con ❤️ usando Next.js 15, Prisma y PostgreSQL**
