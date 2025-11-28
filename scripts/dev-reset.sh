#!/bin/bash

# ============================================
# Script para Resetear Base de Datos Local
# ============================================
# CUIDADO: Este script ELIMINA todos los datos

set -e

echo "⚠️  FastFood - Reset de Base de Datos"
echo "======================================"
echo ""
echo "⚠️  ADVERTENCIA: Este script eliminará TODOS los datos de la base de datos"
echo ""

# Confirmar
read -p "¿Estás seguro de que quieres continuar? (escribe 'SI'): " -r
echo
if [[ ! $REPLY == "SI" ]]; then
    echo "Operación cancelada"
    exit 0
fi

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}▶${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

# 1. Eliminar y recrear schema
print_step "Eliminando schema actual..."
npm run db:push -- --accept-data-loss
print_success "Schema recreado"

# 2. Aplicar migraciones
print_step "Aplicando schema..."
npm run db:push
print_success "Schema aplicado"

# 3. Seed
print_step "Poblando con datos de prueba..."
npm run db:seed
print_success "Datos de prueba agregados"

echo ""
echo "================================================"
echo -e "${GREEN}✓ Base de datos reseteada exitosamente${NC}"
echo "================================================"
echo ""
echo "Usuarios de prueba disponibles:"
echo "  Admin:   admin@fastfood.com / password123"
echo "  Staff:   staff@fastfood.com / password123"
echo "  Cliente: juan@email.com / password123"
echo ""
