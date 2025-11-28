# 🛠️ Scripts de Desarrollo Local

Scripts útiles para facilitar el desarrollo local del proyecto FastFood.

## 📋 Scripts Disponibles

### 1. Setup Inicial - `dev-setup.sh`

Configura todo el ambiente de desarrollo por primera vez.

```bash
npm run setup
# o
bash scripts/dev-setup.sh
```

**Qué hace:**
- ✅ Verifica Node.js 20+
- ✅ Instala dependencias de npm
- ✅ Crea `.env.local` desde el ejemplo
- ✅ Genera `NEXTAUTH_SECRET` automáticamente
- ✅ Inicia PostgreSQL con Docker (opcional)
- ✅ Aplica schema a la base de datos
- ✅ Puebla con datos de prueba

**Cuándo usarlo:**
- Primera vez que clonas el proyecto
- Cuando quieres resetear todo tu ambiente

---

### 2. Iniciar Desarrollo - `dev-start.sh`

Inicia todos los servicios necesarios para desarrollo.

```bash
npm run dev:start
# o
bash scripts/dev-start.sh
```

**Qué hace:**
- ✅ Verifica que `.env.local` existe
- ✅ Inicia PostgreSQL con Docker (si está disponible)
- ✅ Genera Prisma Client
- ✅ Inicia servidor de desarrollo en http://localhost:3000

**Cuándo usarlo:**
- Cada vez que empieces a desarrollar
- Después de un `git pull` con cambios en el schema

---

### 3. Reset de Base de Datos - `dev-reset.sh`

Elimina y recrea toda la base de datos con datos frescos.

```bash
npm run dev:reset
# o
bash scripts/dev-reset.sh
```

**⚠️ ADVERTENCIA:** Esto **ELIMINA TODOS LOS DATOS**

**Qué hace:**
- 🗑️ Elimina todo el schema actual
- ✅ Aplica schema limpio
- ✅ Puebla con datos de prueba

**Cuándo usarlo:**
- Tu base de datos está en mal estado
- Quieres empezar con datos frescos
- Después de cambios importantes en el schema

---

## 📦 Scripts NPM

### Base de Datos

```bash
# Aplicar cambios del schema sin migraciones
npm run db:push

# Poblar con datos de prueba
npm run db:seed

# Abrir Prisma Studio (GUI para DB)
npm run db:studio

# Reset completo de DB (elimina datos)
npm run db:reset

# Crear nueva migración
npm run db:migrate

# Generar Prisma Client
npm run db:generate
```

### Docker

```bash
# Iniciar todos los servicios
npm run docker:up

# Detener todos los servicios
npm run docker:down

# Ver logs en tiempo real
npm run docker:logs
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Verificar tipos de TypeScript
npm run type-check

# Ejecutar linter
npm run lint

# Build para producción
npm run build

# Iniciar servidor de producción
npm start
```

---

## 🐳 Docker

### Servicios Disponibles

El `docker-compose.yml` incluye:

#### PostgreSQL (Puerto 5432)
```bash
# Iniciar solo PostgreSQL
docker-compose up -d db

# Ver logs
docker-compose logs -f db

# Detener
docker-compose stop db
```

**Credenciales por defecto:**
- Usuario: `fastfood`
- Password: `fastfood123`
- Base de datos: `fastfood_db`

#### Adminer (Puerto 8080)
GUI web para gestionar PostgreSQL.

```bash
# Iniciar Adminer
docker-compose up -d adminer

# Abrir en navegador
open http://localhost:8080
```

**Login en Adminer:**
- Sistema: `PostgreSQL`
- Servidor: `db`
- Usuario: `fastfood`
- Contraseña: `fastfood123`
- Base de datos: `fastfood_db`

---

## 🔧 Configuración Manual

### Crear `.env.local` manualmente

```bash
cp .env.local.example .env.local
```

Edita `.env.local` y configura:

```env
DATABASE_URL="postgresql://fastfood:fastfood123@localhost:5432/fastfood_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-generado"
```

### Generar NEXTAUTH_SECRET

```bash
# Con OpenSSL
openssl rand -base64 32

# Con Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### PostgreSQL sin Docker

Si instalaste PostgreSQL localmente:

```sql
-- Conectar a PostgreSQL
psql postgres

-- Crear usuario y base de datos
CREATE USER fastfood WITH PASSWORD 'fastfood123';
CREATE DATABASE fastfood_db OWNER fastfood;
GRANT ALL PRIVILEGES ON DATABASE fastfood_db TO fastfood;
```

Actualiza `DATABASE_URL` en `.env.local`:
```env
DATABASE_URL="postgresql://fastfood:fastfood123@localhost:5432/fastfood_db"
```

---

## 🚨 Troubleshooting

### PostgreSQL no inicia

```bash
# Ver logs de Docker
docker-compose logs db

# Reiniciar contenedor
docker-compose restart db

# Eliminar y recrear
docker-compose down
docker-compose up -d db
```

### Error: "Prisma Client did not initialize"

```bash
npm run db:generate
```

### Error: "Cannot connect to database"

1. Verifica que PostgreSQL esté corriendo:
```bash
docker-compose ps
```

2. Verifica la URL en `.env.local`:
```env
DATABASE_URL="postgresql://fastfood:fastfood123@localhost:5432/fastfood_db"
```

3. Prueba la conexión:
```bash
npx prisma db push
```

### Puerto 3000 ya en uso

```bash
# Ver qué proceso usa el puerto
lsof -i :3000

# Usar otro puerto
PORT=3001 npm run dev
```

### Cambios en schema.prisma no se reflejan

```bash
# Generar Prisma Client
npm run db:generate

# Aplicar cambios
npm run db:push

# Si nada funciona, reset completo
npm run dev:reset
```

---

## 📚 Recursos

- **Documentación principal:** [README.md](../README.md)
- **Guía rápida:** [QUICKSTART.md](../QUICKSTART.md)
- **Contribuir:** [CONTRIBUTING.md](../CONTRIBUTING.md)
- **Deployment:** [DEPLOYMENT.md](../DEPLOYMENT.md)

---

## 💡 Tips

### Workflow Diario Recomendado

```bash
# 1. Iniciar servicios
npm run dev:start

# 2. En otra terminal, abrir Prisma Studio (opcional)
npm run db:studio

# 3. Hacer cambios en código
# ...

# 4. Si cambias schema.prisma:
npm run db:push

# 5. Al terminar, detener Docker (opcional)
npm run docker:down
```

### Atajos de Teclado (al correr npm run dev)

- `Ctrl + C` - Detener servidor
- `r` - Reiniciar servidor (si está disponible)

### Variables de Entorno

Las variables que empiezan con `NEXT_PUBLIC_` son accesibles en el cliente:
```env
NEXT_PUBLIC_PUSHER_KEY="..."  # ✅ Accesible en el navegador
PUSHER_SECRET="..."            # ❌ Solo en el servidor
```

---

**¡Happy Coding! 🚀**
