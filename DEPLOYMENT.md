# 🚀 Guía de Deployment - FastFood Management System

Esta guía detalla cómo desplegar el sistema en diferentes plataformas de hosting para producción.

## 📋 Índice

1. [Pre-requisitos](#pre-requisitos)
2. [Variables de Entorno](#variables-de-entorno)
3. [Deploy en Vercel (Recomendado)](#deploy-en-vercel)
4. [Deploy en Railway](#deploy-en-railway)
5. [Deploy en DigitalOcean/AWS/GCP](#deploy-tradicional)
6. [Configuración Post-Deploy](#configuración-post-deploy)
7. [Monitoreo y Mantenimiento](#monitoreo-y-mantenimiento)
8. [Troubleshooting](#troubleshooting)

---

## Pre-requisitos

Antes de comenzar, asegúrate de tener:

- ✅ Cuenta en GitHub con el repositorio del proyecto
- ✅ Base de datos PostgreSQL (puede ser en la nube)
- ✅ Cuentas en servicios opcionales:
  - [Resend](https://resend.com) para emails
  - [UploadThing](https://uploadthing.com) para imágenes
  - [Pusher](https://pusher.com) para chat en tiempo real

---

## Variables de Entorno

Todas las plataformas requieren estas variables de entorno:

### Variables Requeridas

```env
# Base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:password@host:5432/database_name"

# NextAuth (Autenticación)
NEXTAUTH_URL="https://tu-dominio.com"  # URL de producción
NEXTAUTH_SECRET="[GENERA_UNO_SEGURO]"  # Ver instrucciones abajo
```

### Generar NEXTAUTH_SECRET

```bash
# En tu terminal local:
openssl rand -base64 32

# O en Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Variables Opcionales (Recomendadas para producción)

```env
# Email (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxx"

# Upload de Imágenes (UploadThing)
UPLOADTHING_SECRET="sk_xxxxxxxxxxxxxxxxxxxxx"
UPLOADTHING_APP_ID="xxxxxxxxx"

# Chat en Tiempo Real (Pusher)
NEXT_PUBLIC_PUSHER_KEY="xxxxxxxxxxxxxxxxxx"
NEXT_PUBLIC_PUSHER_CLUSTER="xx"
PUSHER_APP_ID="xxxxxx"
PUSHER_SECRET="xxxxxxxxxxxxxxxxxxxx"
```

**⚠️ NUNCA commitear archivo `.env.local` al repositorio**

---

## Deploy en Vercel

Vercel es la plataforma recomendada por el equipo de Next.js. Deploy en minutos con integración automática.

### Paso 1: Preparar Base de Datos

Opciones recomendadas:
- **Vercel Postgres** (integración directa)
- **Neon** (serverless PostgreSQL, tier gratuito)
- **Supabase** (incluye PostgreSQL + extras)
- **Railway** (PostgreSQL managed)

#### Ejemplo con Neon:

1. Ve a [neon.tech](https://neon.tech) y crea una cuenta
2. Crea un nuevo proyecto
3. Copia la cadena de conexión (DATABASE_URL)

### Paso 2: Deploy en Vercel

#### Opción A: Deploy con UI (Recomendado)

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Click en **"Add New Project"**
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente Next.js
5. Configura las variables de entorno:
   - Click en **"Environment Variables"**
   - Agrega todas las variables mencionadas arriba
6. Click en **"Deploy"**

#### Opción B: Deploy con CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Agregar variables de entorno
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
# ... agregar todas las demás

# Deploy a producción
vercel --prod
```

### Paso 3: Ejecutar Migraciones

```bash
# Opción A: Localmente contra base de datos de producción
DATABASE_URL="tu-url-produccion" npx prisma migrate deploy

# Opción B: Agregar script de build en vercel.json
```

Crea `vercel.json` en la raíz:

```json
{
  "buildCommand": "prisma generate && prisma migrate deploy && next build"
}
```

### Paso 4: Configurar Dominio

1. En Vercel, ve a tu proyecto → **Settings** → **Domains**
2. Agrega tu dominio personalizado
3. Configura DNS según instrucciones de Vercel
4. SSL se configura automáticamente

---

## Deploy en Railway

Railway ofrece base de datos PostgreSQL incluida y deploy automático desde Git.

### Paso 1: Crear Proyecto en Railway

1. Ve a [railway.app](https://railway.app) y crea cuenta
2. Click en **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Selecciona tu repositorio

### Paso 2: Agregar Base de Datos

1. En tu proyecto, click en **"New"**
2. Selecciona **"Database"** → **"PostgreSQL"**
3. Railway creará la base de datos automáticamente
4. Copia la **DATABASE_URL** desde la pestaña **"Connect"**

### Paso 3: Configurar Variables de Entorno

1. Click en tu servicio Next.js
2. Ve a **"Variables"**
3. Agrega todas las variables:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}  # Auto-referencia
NEXTAUTH_URL=https://tu-app.railway.app
NEXTAUTH_SECRET=[genera uno seguro]
# ... resto de variables
```

### Paso 4: Configurar Build Command

1. En **"Settings"** → **"Build"**
2. Agrega build command:

```bash
prisma generate && prisma migrate deploy && npm run build
```

### Paso 5: Deploy

Railway hace deploy automáticamente al hacer push a la rama principal.

```bash
git push origin main
```

### Configurar Dominio Personalizado

1. En Railway, ve a **"Settings"** → **"Domains"**
2. Click en **"Generate Domain"** para dominio railway.app
3. O agrega tu dominio personalizado

---

## Deploy Tradicional

Para DigitalOcean, AWS, GCP, u otros proveedores VPS.

### Opción A: Deploy con Docker

#### 1. Crear Dockerfile

Crea `Dockerfile` en la raíz:

```dockerfile
FROM node:20-alpine AS base

# Dependencias
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### 2. Modificar next.config.ts

```typescript
const nextConfig: NextConfig = {
  output: 'standalone', // Agregar esta línea
  // ... resto de configuración
};
```

#### 3. Crear docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: ${DATABASE_URL}
      NEXTAUTH_URL: ${NEXTAUTH_URL}
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: fastfood
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: fastfood_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

#### 4. Deploy

```bash
# Construir imagen
docker build -t fastfood-app .

# Ejecutar con docker-compose
docker-compose up -d

# Ejecutar migraciones
docker-compose exec app npx prisma migrate deploy
```

### Opción B: Deploy Directo (PM2)

#### 1. Preparar Servidor

```bash
# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib

# Instalar PM2
sudo npm install -g pm2
```

#### 2. Clonar y Configurar

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/nextjs_devlmer.git
cd nextjs_devlmer

# Instalar dependencias
npm ci --production=false

# Copiar variables de entorno
cp .env.example .env.local
nano .env.local  # Editar con tus valores

# Generar Prisma Client
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy

# Build
npm run build
```

#### 3. Configurar PM2

Crea `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'fastfood-app',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

#### 4. Iniciar con PM2

```bash
# Iniciar aplicación
pm2 start ecosystem.config.js

# Guardar configuración
pm2 save

# Configurar inicio automático
pm2 startup

# Ver logs
pm2 logs fastfood-app

# Monitorear
pm2 monit
```

#### 5. Configurar Nginx (Reverse Proxy)

```bash
sudo apt install nginx

# Crear configuración
sudo nano /etc/nginx/sites-available/fastfood
```

Agregar:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Activar:

```bash
sudo ln -s /etc/nginx/sites-available/fastfood /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. Configurar SSL con Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

---

## Configuración Post-Deploy

### 1. Crear Usuario Admin

```bash
# Conectar a la base de datos
psql $DATABASE_URL

# O con Prisma Studio
npx prisma studio
```

Crea un usuario admin con contraseña hasheada.

### 2. Seed Inicial (Opcional)

```bash
npm run db:seed
```

### 3. Verificar Configuración

- [ ] Login funciona correctamente
- [ ] Emails se envían (si configuraste Resend)
- [ ] Upload de imágenes funciona (si configuraste UploadThing)
- [ ] Chat en tiempo real funciona (si configuraste Pusher)
- [ ] Security headers están activos
- [ ] HTTPS funciona correctamente
- [ ] Todos los roles tienen acceso correcto

### 4. Configurar Backups Automáticos

#### En Railway:

Railway hace backups automáticos de PostgreSQL.

#### En Vercel Postgres:

```bash
# Backup manual
pg_dump $DATABASE_URL > backup.sql

# Configurar cron job en servidor
crontab -e

# Agregar (backup diario a las 2am):
0 2 * * * pg_dump $DATABASE_URL > /backups/fastfood-$(date +\%Y\%m\%d).sql
```

#### Con Docker:

```yaml
# Agregar a docker-compose.yml
  backup:
    image: prodrigestivill/postgres-backup-local
    environment:
      POSTGRES_HOST: db
      POSTGRES_DB: fastfood_db
      POSTGRES_USER: fastfood
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      SCHEDULE: "@daily"
    volumes:
      - ./backups:/backups
```

---

## Monitoreo y Mantenimiento

### 1. Configurar Sentry (Errores)

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

Actualizar `.env.local`:

```env
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

### 2. Configurar Analytics

#### Google Analytics:

Agregar en `app/layout.tsx`:

```tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 3. Monitoreo de Uptime

Servicios recomendados:
- **UptimeRobot** (gratuito, checks cada 5 min)
- **Pingdom**
- **StatusCake**

### 4. Logs

#### En Vercel:

Los logs están disponibles en el dashboard.

#### En Railway:

```bash
railway logs
```

#### Con PM2:

```bash
pm2 logs fastfood-app
pm2 logs fastfood-app --lines 100
```

---

## Troubleshooting

### Error: "Prisma Client did not initialize yet"

```bash
npx prisma generate
npm run build
```

### Error: "Cannot connect to database"

Verifica:
1. `DATABASE_URL` está correctamente configurada
2. Base de datos está corriendo
3. Firewall permite conexiones
4. Credenciales son correctas

### Error: Rate Limit en Build

```bash
# Usar cache de npm
npm ci --prefer-offline
```

### Migraciones fallan en producción

```bash
# Forzar reset (⚠️ CUIDADO: borra datos)
npx prisma migrate reset --force

# O aplicar migraciones específicas
npx prisma migrate deploy
```

### Emails no se envían

1. Verifica `RESEND_API_KEY` es correcta
2. Verifica dominio está verificado en Resend
3. Revisa logs de Resend

### Upload de imágenes falla

1. Verifica `UPLOADTHING_SECRET` y `UPLOADTHING_APP_ID`
2. Verifica límites de tamaño
3. Revisa logs de UploadThing

### Chat no funciona en tiempo real

1. Verifica todas las variables de Pusher (`NEXT_PUBLIC_*` y privadas)
2. Verifica app_id, cluster son correctos
3. Revisa logs de Pusher dashboard

---

## 🔒 Checklist de Seguridad

Antes de lanzar a producción:

- [ ] `NEXTAUTH_SECRET` es fuerte y único
- [ ] Todas las variables sensibles están en `.env.local` (no commiteadas)
- [ ] HTTPS está habilitado
- [ ] Security headers están activos (verificar con securityheaders.com)
- [ ] Rate limiting está configurado
- [ ] Backups automáticos están funcionando
- [ ] Monitoreo de errores está activo (Sentry)
- [ ] Logs de seguridad se están guardando
- [ ] Usuarios de prueba fueron eliminados o deshabilitados
- [ ] Contraseñas de admin fueron cambiadas
- [ ] CORS está correctamente configurado (si aplica)
- [ ] Validación de inputs está activa
- [ ] Firewall de base de datos permite solo IPs de la app

---

## 📞 Soporte

Si encuentras problemas durante el deployment:

1. Revisa los logs de la plataforma
2. Verifica las variables de entorno
3. Consulta la documentación oficial de la plataforma
4. Revisa el archivo **SECURITY.md** para problemas de seguridad

---

**Última actualización:** Noviembre 2025
**Versión:** 1.0.0
