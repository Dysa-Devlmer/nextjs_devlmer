#!/bin/bash

# ============================================
# Script para Iniciar Desarrollo Local
# ============================================

set -e

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}▶${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

echo "🚀 FastFood - Inicio de Desarrollo Local"
echo "========================================="
echo ""

# 1. Verificar .env.local
if [ ! -f .env.local ]; then
    print_warning ".env.local no existe"
    echo "Ejecuta primero: bash scripts/dev-setup.sh"
    exit 1
fi

# 2. Verificar si Docker está disponible
if command -v docker &> /dev/null; then
    # Verificar si PostgreSQL está corriendo
    if docker-compose ps | grep -q "fastfood-db.*Up"; then
        print_success "PostgreSQL ya está corriendo"
    else
        print_step "Iniciando PostgreSQL con Docker..."
        docker-compose up -d db
        sleep 3
        print_success "PostgreSQL iniciado"
    fi
fi

# 3. Verificar conexión a base de datos
print_step "Verificando conexión a base de datos..."
if npm run db:push -- --help &> /dev/null; then
    print_success "Conexión a base de datos OK"
else
    print_warning "No se pudo verificar la conexión a la base de datos"
fi

# 4. Generar Prisma Client (por si acaso)
print_step "Generando Prisma Client..."
npx prisma generate > /dev/null 2>&1
print_success "Prisma Client generado"

# 5. Mostrar información útil
echo ""
echo "================================================"
echo -e "${GREEN}✓ Ambiente listo${NC}"
echo "================================================"
echo ""
echo "Servicios disponibles:"
echo "  - App:           http://localhost:3000"
echo "  - Prisma Studio: npm run db:studio (en otra terminal)"

if command -v docker &> /dev/null; then
    if docker-compose ps | grep -q "fastfood-db.*Up"; then
        echo "  - PostgreSQL:    localhost:5432"
        echo "  - Adminer:       docker-compose up -d adminer && open http://localhost:8080"
    fi
fi

echo ""
echo "Usuarios de prueba:"
echo "  Admin:   admin@fastfood.com / password123"
echo "  Staff:   staff@fastfood.com / password123"
echo "  Cliente: juan@email.com / password123"
echo ""
echo "Comandos útiles:"
echo "  - Ver logs:      docker-compose logs -f db"
echo "  - Detener DB:    docker-compose down"
echo "  - Reset DB:      bash scripts/dev-reset.sh"
echo ""
echo "================================================"
echo ""

# 6. Iniciar servidor de desarrollo
print_step "Iniciando servidor de desarrollo..."
echo ""
npm run dev
