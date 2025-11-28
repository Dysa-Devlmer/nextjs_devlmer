#!/bin/bash

# ============================================
# Script de Configuración para Desarrollo Local
# ============================================

set -e  # Salir si hay error

echo "🚀 FastFood - Configuración de Desarrollo Local"
echo "================================================"
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_step() {
    echo -e "${BLUE}▶${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# 1. Verificar Node.js
print_step "Verificando Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado. Instala Node.js 20+ desde https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    print_error "Node.js versión 20+ es requerida. Versión actual: $(node -v)"
    exit 1
fi
print_success "Node.js $(node -v) ✓"

# 2. Verificar npm
print_step "Verificando npm..."
if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado"
    exit 1
fi
print_success "npm $(npm -v) ✓"

# 3. Verificar Docker (opcional)
print_step "Verificando Docker..."
if command -v docker &> /dev/null; then
    print_success "Docker $(docker -v | cut -d' ' -f3 | cut -d',' -f1) ✓"
    DOCKER_AVAILABLE=true
else
    print_warning "Docker no está instalado (opcional)"
    DOCKER_AVAILABLE=false
fi

# 4. Instalar dependencias
print_step "Instalando dependencias de Node.js..."
npm install
print_success "Dependencias instaladas ✓"

# 5. Configurar .env.local
print_step "Configurando variables de entorno..."
if [ ! -f .env.local ]; then
    if [ -f .env.local.example ]; then
        cp .env.local.example .env.local
        print_success "Archivo .env.local creado desde .env.local.example"

        # Generar NEXTAUTH_SECRET automáticamente
        if command -v openssl &> /dev/null; then
            SECRET=$(openssl rand -base64 32)
            if [[ "$OSTYPE" == "darwin"* ]]; then
                # macOS
                sed -i '' "s|change-this-to-a-random-secret-key-min-32-chars|$SECRET|g" .env.local
            else
                # Linux
                sed -i "s|change-this-to-a-random-secret-key-min-32-chars|$SECRET|g" .env.local
            fi
            print_success "NEXTAUTH_SECRET generado automáticamente"
        fi

        print_warning "IMPORTANTE: Edita .env.local y configura tus valores"
    else
        print_error ".env.local.example no encontrado"
        exit 1
    fi
else
    print_success ".env.local ya existe ✓"
fi

# 6. Iniciar base de datos con Docker
if [ "$DOCKER_AVAILABLE" = true ]; then
    echo ""
    read -p "¿Quieres iniciar PostgreSQL con Docker? (s/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[SsYy]$ ]]; then
        print_step "Iniciando PostgreSQL con Docker..."
        docker-compose up -d db

        # Esperar a que PostgreSQL esté listo
        print_step "Esperando a que PostgreSQL esté listo..."
        sleep 5

        # Verificar si está corriendo
        if docker-compose ps | grep -q "fastfood-db.*Up"; then
            print_success "PostgreSQL iniciado correctamente ✓"

            # Actualizar DATABASE_URL en .env.local
            if [[ "$OSTYPE" == "darwin"* ]]; then
                sed -i '' 's|^DATABASE_URL=.*|DATABASE_URL="postgresql://fastfood:fastfood123@localhost:5432/fastfood_db"|' .env.local
            else
                sed -i 's|^DATABASE_URL=.*|DATABASE_URL="postgresql://fastfood:fastfood123@localhost:5432/fastfood_db"|' .env.local
            fi
            print_success "DATABASE_URL configurado en .env.local"
        else
            print_error "Error al iniciar PostgreSQL"
            exit 1
        fi
    fi
else
    print_warning "Configura PostgreSQL manualmente y actualiza DATABASE_URL en .env.local"
fi

# 7. Configurar base de datos
echo ""
read -p "¿Quieres configurar la base de datos ahora? (s/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[SsYy]$ ]]; then
    print_step "Aplicando schema a la base de datos..."
    npm run db:push
    print_success "Schema aplicado ✓"

    print_step "Poblando base de datos con datos de prueba..."
    npm run db:seed
    print_success "Datos de prueba agregados ✓"
fi

# 8. Resumen
echo ""
echo "================================================"
echo -e "${GREEN}✓ Configuración completada${NC}"
echo "================================================"
echo ""
echo "Usuarios de prueba:"
echo "  Admin:   admin@fastfood.com / password123"
echo "  Staff:   staff@fastfood.com / password123"
echo "  Cliente: juan@email.com / password123"
echo ""
echo "Próximos pasos:"
echo "  1. Edita .env.local si necesitas configurar servicios opcionales"
echo "  2. Ejecuta: npm run dev"
echo "  3. Abre: http://localhost:3000"
echo ""
echo "Herramientas útiles:"
echo "  - Prisma Studio: npm run db:studio"
if [ "$DOCKER_AVAILABLE" = true ]; then
    echo "  - Adminer (DB GUI): http://localhost:8080 (docker-compose up -d adminer)"
fi
echo ""
echo "Documentación:"
echo "  - Ver QUICKSTART.md para más información"
echo "  - Ver CONTRIBUTING.md para guía de desarrollo"
echo ""
