# Sistema de Posventa para Comida Rápida

Sistema completo de gestión de atención posventa para restaurantes de comida rápida. Permite a los clientes crear y dar seguimiento a tickets de reclamos, mientras que los administradores pueden gestionar todos los tickets y visualizar estadísticas en tiempo real.

## Características Principales

### Portal del Cliente
- ✅ Crear tickets de reclamo con información detallada
- ✅ Ver historial completo de tickets
- ✅ Seguimiento en tiempo real del estado
- ✅ Sistema de búsqueda por asunto o número de pedido
- ✅ Visualización de respuestas del administrador
- ✅ Sistema de calificación de atención

### Panel Administrativo
- ✅ Dashboard con métricas clave
- ✅ Estadísticas de tickets (abiertos, en proceso, resueltos, cerrados)
- ✅ Calificación promedio de satisfacción
- ✅ Tiempo promedio de resolución
- ✅ Gráficos de distribución por categoría
- ✅ Gestión completa de tickets
- ✅ Búsqueda y filtros avanzados
- ✅ Sistema de respuesta a clientes
- ✅ Cambio de estados de tickets

### Categorías de Atención
- Pedido Incorrecto
- Pedido Frío
- Falta Producto
- Calidad del Producto
- Tiempo de Entrega
- Servicio al Cliente
- Otro

### Niveles de Prioridad
- Baja
- Media
- Alta
- Urgente

### Estados de Tickets
- Abierto
- En Proceso
- Resuelto
- Cerrado

## Tecnologías Utilizadas

- **Next.js 15** - Framework React con App Router
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS 4** - Estilos
- **Lucide React** - Iconos
- **Context API** - Gestión de estado
- **LocalStorage** - Persistencia de datos

## Estructura del Proyecto

```
nextjs_devlmer/
├── app/
│   ├── page.tsx              # Página principal
│   ├── layout.tsx            # Layout con Provider
│   ├── cliente/              # Portal del cliente
│   │   ├── page.tsx          # Lista de tickets del cliente
│   │   └── nuevo/
│   │       └── page.tsx      # Crear nuevo ticket
│   └── admin/                # Panel administrativo
│       ├── page.tsx          # Dashboard con estadísticas
│       └── tickets/
│           └── page.tsx      # Gestión de tickets
├── components/
│   └── ui/                   # Componentes reutilizables
│       ├── Card.tsx
│       ├── Button.tsx
│       ├── Badge.tsx
│       └── Input.tsx
├── context/
│   └── TicketContext.tsx    # Context API para tickets
├── types/
│   └── index.ts             # Tipos TypeScript
└── utils/
    └── stats.ts             # Utilidades para estadísticas
```

## Instalación y Uso

### Instalar dependencias

```bash
npm install
```

### Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Compilar para producción

```bash
npm run build
npm start
```

## Rutas de la Aplicación

- `/` - Página principal con opciones de navegación
- `/cliente` - Portal del cliente para ver y crear tickets
- `/cliente/nuevo` - Formulario para crear nuevo ticket
- `/admin` - Dashboard administrativo con estadísticas
- `/admin/tickets` - Gestión completa de tickets

## Datos de Ejemplo

La aplicación incluye 4 tickets de ejemplo con diferentes estados para demostración:
- Cliente 1: Juan Pérez - Ticket abierto (pedido frío)
- Cliente 2: María García - Ticket en proceso (falta producto)
- Cliente 3: Carlos López - Ticket resuelto (pedido incorrecto)
- Cliente 4: Ana Martínez - Ticket cerrado (servicio cliente)

## Características Técnicas

### Gestión de Estado
- Context API para estado global de tickets
- Persistencia automática en localStorage
- Actualización en tiempo real

### Validación de Formularios
- Validación de campos requeridos
- Mensajes de error claros
- Prevención de envíos inválidos

### Búsqueda y Filtros
- Búsqueda por texto (asunto, pedido, cliente)
- Filtro por estado
- Filtro por prioridad
- Resultados en tiempo real

### Responsive Design
- Diseño adaptable a móviles y escritorio
- Grid responsivo
- Navegación optimizada

## Próximas Mejoras Sugeridas

- [ ] Integración con base de datos real
- [ ] Sistema de autenticación
- [ ] Notificaciones por email
- [ ] Chat en tiempo real
- [ ] Exportación de reportes
- [ ] API REST
- [ ] Adjuntar imágenes a tickets
- [ ] Sistema de roles y permisos

## Licencia

Este proyecto es un sistema de demostración para gestión de posventa en restaurantes de comida rápida.
