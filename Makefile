# Makefile para FastFood Management System
# =========================================
# Comandos útiles para desarrollo local

.PHONY: help setup dev start stop clean reset db-studio db-reset docker-up docker-down

# Default target
.DEFAULT_GOAL := help

# Colores para output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m

##@ Comandos Principales

help: ## Muestra esta ayuda
	@echo ""
	@echo "$(BLUE)FastFood Management System - Comandos Disponibles$(NC)"
	@echo "===================================================="
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf ""} /^[a-zA-Z_-]+:.*?##/ { printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(YELLOW)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
	@echo ""

setup: ## Configuración inicial del proyecto
	@echo "$(BLUE)▶ Configurando proyecto...$(NC)"
	@bash scripts/dev-setup.sh

dev: ## Inicia el servidor de desarrollo
	@echo "$(BLUE)▶ Iniciando desarrollo...$(NC)"
	@bash scripts/dev-start.sh

start: dev ## Alias de 'dev'

##@ Base de Datos

db-studio: ## Abre Prisma Studio (GUI para DB)
	@echo "$(BLUE)▶ Abriendo Prisma Studio...$(NC)"
	@npm run db:studio

db-reset: ## Resetea la base de datos (elimina datos)
	@echo "$(YELLOW)⚠  Reseteando base de datos...$(NC)"
	@bash scripts/dev-reset.sh

db-push: ## Aplica cambios del schema
	@echo "$(BLUE)▶ Aplicando schema...$(NC)"
	@npm run db:push

db-seed: ## Puebla la DB con datos de prueba
	@echo "$(BLUE)▶ Poblando base de datos...$(NC)"
	@npm run db:seed

db-generate: ## Genera Prisma Client
	@echo "$(BLUE)▶ Generando Prisma Client...$(NC)"
	@npm run db:generate

##@ Docker

docker-up: ## Inicia servicios de Docker
	@echo "$(BLUE)▶ Iniciando servicios de Docker...$(NC)"
	@docker-compose up -d

docker-down: ## Detiene servicios de Docker
	@echo "$(BLUE)▶ Deteniendo servicios de Docker...$(NC)"
	@docker-compose down

docker-logs: ## Muestra logs de Docker
	@docker-compose logs -f

docker-restart: ## Reinicia servicios de Docker
	@echo "$(BLUE)▶ Reiniciando servicios de Docker...$(NC)"
	@docker-compose restart

docker-clean: ## Elimina volúmenes de Docker (⚠️ elimina datos)
	@echo "$(YELLOW)⚠  Limpiando volúmenes de Docker...$(NC)"
	@docker-compose down -v

##@ Desarrollo

install: ## Instala dependencias de npm
	@echo "$(BLUE)▶ Instalando dependencias...$(NC)"
	@npm install

build: ## Build para producción
	@echo "$(BLUE)▶ Building para producción...$(NC)"
	@npm run build

type-check: ## Verifica tipos de TypeScript
	@echo "$(BLUE)▶ Verificando tipos...$(NC)"
	@npm run type-check

lint: ## Ejecuta linter
	@echo "$(BLUE)▶ Ejecutando linter...$(NC)"
	@npm run lint

##@ Limpieza

clean: ## Limpia archivos generados
	@echo "$(BLUE)▶ Limpiando archivos generados...$(NC)"
	@rm -rf .next
	@rm -rf node_modules/.cache
	@echo "$(GREEN)✓ Limpieza completada$(NC)"

clean-all: clean ## Limpieza completa (incluye node_modules)
	@echo "$(BLUE)▶ Limpieza completa...$(NC)"
	@rm -rf node_modules
	@echo "$(GREEN)✓ Limpieza completa$(NC)"

##@ Información

info: ## Muestra información del proyecto
	@echo ""
	@echo "$(BLUE)FastFood Management System$(NC)"
	@echo "================================"
	@echo ""
	@echo "Versión Node.js:  $$(node -v)"
	@echo "Versión npm:      $$(npm -v)"
	@if command -v docker &> /dev/null; then \
		echo "Versión Docker:   $$(docker --version | cut -d' ' -f3 | cut -d',' -f1)"; \
	else \
		echo "Docker:           No instalado"; \
	fi
	@echo ""
	@echo "Scripts disponibles:"
	@echo "  - make setup      → Configuración inicial"
	@echo "  - make dev        → Iniciar desarrollo"
	@echo "  - make db-studio  → Abrir Prisma Studio"
	@echo ""
	@echo "Documentación:"
	@echo "  - QUICKSTART.md   → Guía de inicio rápido"
	@echo "  - scripts/README.md → Documentación de scripts"
	@echo ""

status: ## Muestra estado de los servicios
	@echo ""
	@echo "$(BLUE)Estado de Servicios$(NC)"
	@echo "===================="
	@echo ""
	@if command -v docker &> /dev/null; then \
		docker-compose ps; \
	else \
		echo "Docker no está disponible"; \
	fi
	@echo ""

##@ Utilidades

env-example: ## Crea .env.local desde el ejemplo
	@if [ ! -f .env.local ]; then \
		echo "$(BLUE)▶ Creando .env.local...$(NC)"; \
		cp .env.local.example .env.local; \
		echo "$(GREEN)✓ .env.local creado$(NC)"; \
		echo "$(YELLOW)⚠ Edita .env.local con tus valores$(NC)"; \
	else \
		echo "$(YELLOW).env.local ya existe$(NC)"; \
	fi

adminer: ## Inicia Adminer (GUI web para PostgreSQL)
	@echo "$(BLUE)▶ Iniciando Adminer...$(NC)"
	@docker-compose up -d adminer
	@echo "$(GREEN)✓ Adminer disponible en http://localhost:8080$(NC)"
	@echo ""
	@echo "Credenciales:"
	@echo "  Sistema:  PostgreSQL"
	@echo "  Servidor: db"
	@echo "  Usuario:  fastfood"
	@echo "  Password: fastfood123"
	@echo "  Database: fastfood_db"
