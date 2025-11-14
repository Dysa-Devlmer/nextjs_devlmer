# 🚀 Guía de Configuración - Sistema FastFood

Este documento te guiará paso a paso para configurar el sistema completo de comida rápida con todas sus funcionalidades.

## 📋 Requisitos Previos

- Node.js 18+
- PostgreSQL 14+ instalado y corriendo
- Una cuenta en [Uploadthing](https://uploadthing.com) (para subir imágenes)
- Una cuenta en [Resend](https://resend.com) (para enviar emails) - Opcional
- Una cuenta en [Pusher](https://pusher.com) (para chat en tiempo real) - Opcional

## 🗄️ Paso 1: Configurar Base de Datos PostgreSQL

### Opción A: PostgreSQL Local

1. **Instalar PostgreSQL** (si no lo tienes):
   - Windows: Descargar de [postgresql.org](https://www.postgresql.org/download/windows/)
   - Mac: `brew install postgresql@14`
   - Linux: `sudo apt-get install postgresql`

2. **Crear la base de datos**:
   ```bash
   # Conectarse a PostgreSQL
   psql -U postgres

   # Crear la base de datos
   CREATE DATABASE fastfood_db;

   # Crear un usuario (opcional pero recomendado)
   CREATE USER fastfood_user WITH PASSWORD 'tu_password_seguro';
   GRANT ALL PRIVILEGES ON DATABASE fastfood_db TO fastfood_user;
   ```

3. **Actualizar el archivo .env**:
   ```env
   DATABASE_URL="postgresql://fastfood_user:tu_password_seguro@localhost:5432/fastfood_db?schema=public"
   ```

### Opción B: PostgreSQL en la Nube (Supabase - GRATIS)

1. Ir a [supabase.com](https://supabase.com)
2. Crear un nuevo proyecto
3. Ir a Settings > Database
4. Copiar la "Connection String" (modo Pooler)
5. Pegarla en tu archivo `.env`:
   ```env
   DATABASE_URL="tu-connection-string-de-supabase"
   ```

### Opción C: Neon.tech (GRATIS)

1. Ir a [neon.tech](https://neon.tech)
2. Crear un nuevo proyecto
3. Copiar la connection string
4. Pegarla en `.env`

## ⚙️ Paso 2: Configurar Variables de Entorno

1. **Copiar el archivo de ejemplo**:
   ```bash
   cp .env.example .env
   ```

2. **Editar el archivo `.env`** con tus credenciales:

```env
# ===== OBLIGATORIO =====
DATABASE_URL="postgresql://usuario:password@localhost:5432/fastfood_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="genera-un-secret-aleatorio-aqui"

# ===== OPCIONAL (pero recomendado) =====

# Uploadthing - Para subir imágenes
UPLOADTHING_SECRET="tu_secret_key"
UPLOADTHING_APP_ID="tu_app_id"

# Resend - Para enviar emails
RESEND_API_KEY="tu_api_key"

# Pusher - Para chat en tiempo real
NEXT_PUBLIC_PUSHER_APP_KEY="tu_app_key"
PUSHER_APP_ID="tu_app_id"
PUSHER_SECRET="tu_secret"
NEXT_PUBLIC_PUSHER_CLUSTER="us2"
```

### Generar NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

## 📦 Paso 3: Instalar Dependencias

```bash
npm install
```

## 🗃️ Paso 4: Configurar la Base de Datos

```bash
# Generar Prisma Client
npx prisma generate

# Crear las tablas en la base de datos
npm run db:push

# Poblar con datos de ejemplo
npm run db:seed
```

Si todo salió bien, verás:
```
✅ Usuarios creados
✅ Categorías creadas
✅ Productos creados
✅ Órdenes creadas
✅ Tickets creados
🎉 Seed completado exitosamente!
```

## 🎭 Paso 5: Usuarios de Prueba

El sistema incluye estos usuarios precargados:

| Rol | Email | Password | Descripción |
|-----|-------|----------|-------------|
| **Admin** | admin@fastfood.com | password123 | Acceso completo al sistema |
| **Staff** | staff@fastfood.com | password123 | Gestión de pedidos y cocina |
| **Cliente** | juan@email.com | password123 | Cliente de ejemplo 1 |
| **Cliente** | maria@email.com | password123 | Cliente de ejemplo 2 |

## 🚀 Paso 6: Iniciar la Aplicación

```bash
npm run dev
```

Abre http://localhost:3000 en tu navegador.

## 📂 Estructura de la Base de Datos

```
User (Usuarios)
├── Orders (Pedidos)
│   └── OrderItems (Items del pedido)
└── Tickets (Reclamos)
    └── ChatMessages (Chat del ticket)

Category (Categorías)
└── Products (Productos)
```

## 🔑 Configuración de Servicios Externos (Opcional)

### Uploadthing (Para imágenes)

1. Ir a [uploadthing.com](https://uploadthing.com)
2. Crear cuenta y nuevo proyecto
3. Copiar el API Key y App ID
4. Pegar en `.env`:
   ```env
   UPLOADTHING_SECRET="sk_live_xxxxx"
   UPLOADTHING_APP_ID="xxxxx"
   ```

### Resend (Para emails)

1. Ir a [resend.com](https://resend.com)
2. Crear cuenta
3. Crear API Key
4. Agregar a `.env`:
   ```env
   RESEND_API_KEY="re_xxxxx"
   ```

### Pusher (Para chat)

1. Ir a [pusher.com](https://pusher.com)
2. Crear cuenta y canal
3. Copiar las credenciales
4. Agregar a `.env`

## 🛠️ Comandos Útiles

```bash
# Ver la base de datos con interfaz visual
npm run db:studio

# Reiniciar la base de datos (borra todo y vuelve a crear)
npm run db:push -- --force-reset
npm run db:seed

# Ver logs de Prisma
npx prisma db push --help

# Generar migración
npx prisma migrate dev --name nombre_migracion
```

## 🐛 Solución de Problemas

### Error: "Can't reach database server"
- Verifica que PostgreSQL esté corriendo
- Verifica las credenciales en DATABASE_URL
- Verifica que el puerto 5432 esté disponible

### Error: "Prisma Client not generated"
```bash
npx prisma generate
```

### Error: "Invalid `prisma.xxx.create()`"
```bash
npm run db:push
npx prisma generate
```

### Resetear todo y empezar de nuevo
```bash
npm run db:push -- --force-reset
npm run db:seed
```

## 📱 Próximos Pasos

Una vez configurado, puedes:

1. **Login** en http://localhost:3000/auth/login
2. **Explorar el Dashboard** como admin
3. **Crear productos** y categorías
4. **Hacer pedidos** como cliente
5. **Gestionar tickets** de soporte

## 🎯 Funcionalidades Implementadas

- ✅ Autenticación con roles (Admin, Staff, Cliente)
- ✅ Gestión de productos y categorías
- ✅ Sistema de pedidos completo
- ✅ Sistema de tickets/reclamos
- ✅ Base de datos PostgreSQL con Prisma
- 🔄 Chat en tiempo real (en progreso)
- 🔄 Notificaciones por email (en progreso)
- 🔄 Upload de imágenes (en progreso)
- 🔄 Exportación de reportes (en progreso)

## 📞 Soporte

Si tienes problemas, revisa:
1. Que PostgreSQL esté corriendo
2. Que las credenciales en `.env` sean correctas
3. Que hayas ejecutado `npm run db:push` y `npm run db:seed`

¡Listo! Ya tienes el sistema completo configurado 🎉
