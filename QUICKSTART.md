# 🚀 Guía de Inicio Rápido

Guía paso a paso para tener el sistema funcionando en menos de 10 minutos.

## ⚡ Opción Rápida: Script Automático (Recomendado)

La forma MÁS rápida. Un solo comando configura todo:

```bash
# Clonar repositorio
git clone https://github.com/Dysa-Devlmer/nextjs_devlmer.git
cd nextjs_devlmer

# Configurar todo automáticamente
npm run setup

# Iniciar desarrollo
npm run dev:start
```

¡Listo! El script configura Docker, PostgreSQL, .env.local, y datos de prueba automáticamente.

**Usuarios de prueba creados:**
- Admin: `admin@fastfood.com` / `password123`
- Staff: `staff@fastfood.com` / `password123`
- Cliente: `juan@email.com` / `password123`

---

## Opción 1: Desarrollo con Docker (Paso a Paso)

Si prefieres entender cada paso, sigue esta guía manual.

### 1. Clonar el repositorio

```bash
git clone https://github.com/Dysa-Devlmer/nextjs_devlmer.git
cd nextjs_devlmer
```

### 2. Iniciar base de datos con Docker

```bash
# Iniciar PostgreSQL en contenedor
docker-compose up -d db

# Verificar que está corriendo
docker-compose ps
```

### 3. Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env.local

# Editar con tu editor favorito
nano .env.local
```

Configuración mínima para desarrollo local:

```env
DATABASE_URL="postgresql://fastfood:fastfood123@localhost:5432/fastfood_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="super-secret-key-change-in-production"
```

### 4. Instalar dependencias

```bash
npm install
```

### 5. Configurar base de datos

```bash
# Aplicar schema a la base de datos
npm run db:push

# Poblar con datos de prueba
npm run db:seed
```

### 6. Iniciar aplicación

```bash
npm run dev
```

🎉 **¡Listo!** Abre [http://localhost:3000](http://localhost:3000)

### 7. Usuarios de prueba

Inicia sesión con cualquiera de estos usuarios:

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@fastfood.com | password123 |
| Staff | staff@fastfood.com | password123 |
| Cliente | juan@email.com | password123 |

---

## Opción 2: Desarrollo sin Docker

Si prefieres instalar PostgreSQL localmente.

### 1. Instalar PostgreSQL

#### macOS (con Homebrew)
```bash
brew install postgresql@16
brew services start postgresql@16
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Windows
Descarga el instalador desde [postgresql.org](https://www.postgresql.org/download/windows/)

### 2. Crear base de datos

```bash
# Conectar a PostgreSQL
psql postgres

# Crear usuario y base de datos
CREATE USER fastfood WITH PASSWORD 'fastfood123';
CREATE DATABASE fastfood_db OWNER fastfood;
GRANT ALL PRIVILEGES ON DATABASE fastfood_db TO fastfood;

# Salir
\q
```

### 3. Continuar desde el paso 3 de la Opción 1

Sigue los pasos 3-7 de la opción con Docker.

---

## Servicios Opcionales

El sistema funciona sin estos servicios, pero con funcionalidad limitada:

### Resend (Emails)

1. Crea cuenta en [resend.com](https://resend.com)
2. Obtén tu API Key
3. Agrega a `.env.local`:

```env
RESEND_API_KEY="re_xxxxxxxxxxxxx"
EMAIL_FROM="FastFood <noreply@tudominio.com>"
```

### Uploadthing (Imágenes)

1. Crea cuenta en [uploadthing.com](https://uploadthing.com)
2. Crea una nueva app
3. Obtén tu App ID y Secret
4. Agrega a `.env.local`:

```env
UPLOADTHING_SECRET="sk_xxxxxxxxxxxxx"
UPLOADTHING_APP_ID="xxxxxxxxx"
```

### Pusher (Chat en tiempo real)

1. Crea cuenta en [pusher.com](https://pusher.com)
2. Crea una nueva app (Channels)
3. Obtén tus credenciales
4. Agrega a `.env.local`:

```env
NEXT_PUBLIC_PUSHER_APP_KEY="xxxxxxxxxxxxx"
PUSHER_APP_ID="xxxxxx"
PUSHER_SECRET="xxxxxxxxxxxxx"
NEXT_PUBLIC_PUSHER_CLUSTER="us2"
```

---

## Herramientas Útiles

### Prisma Studio

GUI para explorar y editar la base de datos:

```bash
npm run db:studio
```

Abre [http://localhost:5555](http://localhost:5555)

### Adminer

Si usas Docker, puedes usar Adminer:

```bash
docker-compose up -d adminer
```

Abre [http://localhost:8080](http://localhost:8080)

- Sistema: PostgreSQL
- Servidor: db
- Usuario: fastfood
- Contraseña: fastfood123
- Base de datos: fastfood_db

---

## 📋 Comandos Disponibles

### Scripts Automáticos

```bash
# Setup completo (primera vez)
npm run setup            # Configura todo automáticamente

# Desarrollo diario
npm run dev:start        # Inicia PostgreSQL + servidor de desarrollo
npm run dev:reset        # Reset completo de DB con datos frescos
```

### Comandos NPM

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo
npm run dev:start        # Iniciar con Docker automático
npm run build            # Build para producción
npm start                # Servidor de producción

# Base de datos
npm run db:push          # Aplicar cambios del schema
npm run db:seed          # Poblar con datos de prueba
npm run db:studio        # Abrir Prisma Studio (GUI)
npm run db:reset         # Reset completo (⚠️ elimina datos)
npm run db:generate      # Generar Prisma Client

# Docker
npm run docker:up        # Iniciar todos los servicios
npm run docker:down      # Detener servicios
npm run docker:logs      # Ver logs en tiempo real

# Calidad de código
npm run type-check       # Verificar tipos TypeScript
npm run lint             # Ejecutar linter
```

### Makefile (Alternativa)

Si prefieres usar `make`:

```bash
make help          # Ver todos los comandos disponibles
make setup         # Setup completo
make dev           # Iniciar desarrollo
make db-studio     # Prisma Studio
make db-reset      # Reset de DB
make docker-up     # Iniciar Docker
make adminer       # Iniciar Adminer (GUI web)
make info          # Info del proyecto
make status        # Estado de servicios
```

---

## Solución de Problemas Comunes

### Error: "Cannot connect to database"

Verifica que PostgreSQL está corriendo:

```bash
# Con Docker
docker-compose ps

# Sin Docker (macOS/Linux)
pg_isready

# Sin Docker (Ubuntu)
sudo systemctl status postgresql
```

### Error: "Prisma Client did not initialize"

Regenera el cliente de Prisma:

```bash
npx prisma generate
```

### Puerto 3000 ya está en uso

Cambia el puerto en el comando dev:

```bash
PORT=3001 npm run dev
```

### Tablas no existen en la base de datos

Aplica el schema:

```bash
npm run db:push
```

---

## Próximos Pasos

1. ✅ **Explora la aplicación** con los usuarios de prueba
2. ✅ **Lee la documentación completa** en [README.md](README.md)
3. ✅ **Revisa la configuración de seguridad** en [SECURITY.md](SECURITY.md)
4. ✅ **Prepara para producción** con [DEPLOYMENT.md](DEPLOYMENT.md)

---

## Estructura Rápida del Proyecto

```
app/
├── menu/           → Menú público
├── cart/           → Carrito de compras
├── auth/           → Login, registro, recuperación de contraseña
├── admin/          → Panel administrativo (ADMIN)
│   ├── users/      → Gestión de usuarios
│   ├── products/   → Gestión de productos
│   ├── categories/ → Gestión de categorías
│   ├── tickets/    → Gestión de tickets
│   └── config/     → Configuración del restaurante
├── staff/          → Panel de cocina (STAFF)
├── cliente/        → Portal del cliente
└── perfil/         → Perfil de usuario

app/api/            → Endpoints REST (40+)
components/ui/      → Componentes reutilizables
lib/                → Utilidades y helpers
prisma/             → Schema y seed de base de datos
```

---

## Soporte

- 📖 Documentación completa: [README.md](README.md)
- 🔒 Seguridad: [SECURITY.md](SECURITY.md)
- 🚀 Deployment: [DEPLOYMENT.md](DEPLOYMENT.md)
- ⚙️ Configuración: [SETUP.md](SETUP.md)

---

**¡Disfruta desarrollando con FastFood Management System! 🍔**
