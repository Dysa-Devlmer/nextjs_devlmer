# 🍔 FastFood - Sistema Completo de Gestión para Restaurantes

Sistema integral de gestión para restaurantes de comida rápida que incluye pedidos en línea, gestión de productos, atención posventa y panel administrativo completo.

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
- ✅ Creación de tickets de reclamo
- ✅ Seguimiento de tickets
- ✅ Historial completo de pedidos
- ✅ Sistema de calificación

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
- ✅ Gestión de tickets de soporte
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
│   │   └── register/page.tsx        # Registro
│   ├── menu/page.tsx                # Menú público
│   ├── cart/page.tsx                # Carrito de compras
│   ├── checkout/page.tsx            # Checkout
│   ├── orders/[id]/page.tsx         # Detalle de pedido
│   ├── cliente/                     # Portal del cliente
│   │   ├── page.tsx                 # Tickets del cliente
│   │   └── nuevo/page.tsx           # Crear ticket
│   ├── staff/page.tsx               # Panel de cocina
│   ├── admin/                       # Panel administrativo
│   │   ├── page.tsx                 # Dashboard admin con gráficos
│   │   ├── tickets/page.tsx         # Gestión de tickets
│   │   ├── products/                # Gestión de productos
│   │   │   ├── page.tsx            # Lista de productos
│   │   │   ├── new/page.tsx        # Crear producto
│   │   │   └── [id]/page.tsx       # Editar producto
│   │   └── categories/              # Gestión de categorías
│   │       ├── page.tsx            # Lista de categorías
│   │       ├── new/page.tsx        # Crear categoría
│   │       └── [id]/page.tsx       # Editar categoría
│   ├── api/                         # API REST
│   │   ├── auth/                    # Auth endpoints
│   │   ├── categories/              # CRUD de categorías
│   │   ├── products/                # CRUD de productos
│   │   ├── orders/                  # CRUD de pedidos
│   │   └── uploadthing/             # Upload de imágenes
├── components/
│   ├── ui/                          # Componentes reutilizables
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   └── ImageUpload.tsx          # Upload de imágenes
│   └── providers/
│       └── SessionProvider.tsx      # Provider de sesión
├── context/
│   ├── CartContext.tsx             # Context del carrito
│   └── TicketContext.tsx           # Context de tickets
├── lib/
│   ├── prisma.ts                   # Cliente de Prisma
│   ├── auth.ts                     # Configuración de NextAuth
│   ├── uploadthing.ts              # Helpers de Uploadthing
│   └── exportUtils.ts              # Utilidades de exportación
├── prisma/
│   ├── schema.prisma               # Schema de la base de datos
│   └── seed.ts                     # Datos de prueba
├── types/
│   ├── index.ts                    # Tipos de la app
│   └── next-auth.d.ts             # Tipos de NextAuth
├── middleware.ts                   # Middleware de protección
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

Configuración rápida con archivo `.env`:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/fastfood_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-key-aqui"
```

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

### Clientes (Requiere autenticación)
- `/cart` - Carrito de compras
- `/checkout` - Procesar pedido
- `/orders/[id]` - Detalle del pedido
- `/cliente` - Mis tickets
- `/cliente/nuevo` - Crear ticket

### Staff (Requiere rol STAFF o ADMIN)
- `/staff` - Panel de cocina

### Admin (Requiere rol ADMIN)
- `/admin` - Dashboard administrativo con gráficos interactivos
- `/admin/tickets` - Gestión de tickets
- `/admin/products` - Gestión de productos (con UI completa)
  - `/admin/products/new` - Crear producto
  - `/admin/products/[id]` - Editar producto
- `/admin/categories` - Gestión de categorías (con UI completa)
  - `/admin/categories/new` - Crear categoría
  - `/admin/categories/[id]` - Editar categoría

## 🎯 Flujos de Usuario

### Flujo de Pedido
1. **Cliente navega** → Menú (`/menu`)
2. **Agrega productos** → Carrito (`/cart`)
3. **Inicia sesión** → Login (`/auth/login`)
4. **Completa datos** → Checkout (`/checkout`)
5. **Confirma pedido** → Detalle (`/orders/[id]`)
6. **Staff prepara** → Panel Cocina (`/staff`)

### Flujo de Ticket
1. **Cliente tiene problema** → Crear Ticket (`/cliente/nuevo`)
2. **Admin revisa** → Gestión (`/admin/tickets`)
3. **Admin responde** → Actualiza ticket
4. **Cliente califica** → Portal Cliente (`/cliente`)

## 📊 Modelos de Base de Datos

### User
- Roles: ADMIN, STAFF, CLIENTE
- Relaciones: Orders, Tickets, ChatMessages

### Category & Product
- Categorías de productos
- Productos con precio e imagen
- Estado activo/inactivo

### Order & OrderItem
- Estados: PENDIENTE, PREPARANDO, LISTO, ENTREGADO, CANCELADO
- Cálculo automático de impuestos
- Items con notas especiales

### Ticket & ChatMessage
- Sistema de tickets de soporte
- Prioridades y categorías
- Chat en tiempo real (preparado)

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
- `POST /api/orders` - Crear pedido
- `GET /api/orders/[id]` - Obtener pedido
- `PUT /api/orders/[id]` - Actualizar estado (STAFF/ADMIN)
- `DELETE /api/orders/[id]` - Cancelar pedido

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

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

## 📈 Funcionalidades Implementadas

- [x] UI completa para CRUD de productos en admin
- [x] UI completa para CRUD de categorías en admin
- [x] Upload de imágenes con Uploadthing
- [x] Exportación de reportes (PDF/Excel)
- [x] Dashboard con gráficos interactivos (Recharts)

## 🔮 Próximas Mejoras (Opcionales)

- [ ] Notificaciones por email con Resend
- [ ] Chat en tiempo real con Pusher
- [ ] Sistema de cupones y descuentos
- [ ] Historial detallado de cambios
- [ ] Notificaciones push
- [ ] Sistema de calificación de productos
- [ ] Panel de analytics avanzado

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
