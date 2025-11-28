# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir al FastFood Management System! Esta guía te ayudará a empezar.

## 📋 Tabla de Contenidos

1. [Código de Conducta](#código-de-conducta)
2. [Cómo Contribuir](#cómo-contribuir)
3. [Configuración del Entorno](#configuración-del-entorno)
4. [Proceso de Desarrollo](#proceso-de-desarrollo)
5. [Estándares de Código](#estándares-de-código)
6. [Convenciones de Commits](#convenciones-de-commits)
7. [Pull Requests](#pull-requests)
8. [Reportar Bugs](#reportar-bugs)
9. [Solicitar Funcionalidades](#solicitar-funcionalidades)

---

## Código de Conducta

Este proyecto se adhiere a un código de conducta de colaboración. Al participar, se espera que mantengas este código.

### Nuestros Estándares

- ✅ Ser respetuoso y considerado con otros contribuyentes
- ✅ Aceptar críticas constructivas
- ✅ Enfocarse en lo mejor para la comunidad
- ✅ Mostrar empatía hacia otros miembros de la comunidad

### Comportamientos Inaceptables

- ❌ Lenguaje o imágenes sexualizadas
- ❌ Trolling, insultos o ataques personales
- ❌ Acoso público o privado
- ❌ Publicar información privada de otros sin permiso

---

## Cómo Contribuir

Hay muchas formas de contribuir:

### 🐛 Reportar Bugs

Abre un issue describiendo:
- Qué esperabas que pasara
- Qué pasó realmente
- Pasos para reproducir el bug
- Capturas de pantalla (si aplica)
- Versión de Node.js, navegador, etc.

### 💡 Sugerir Mejoras

Abre un issue describiendo:
- La funcionalidad que propones
- Por qué sería útil
- Cómo debería funcionar
- Ejemplos de uso (si aplica)

### 📝 Mejorar Documentación

- Corregir typos o errores
- Agregar ejemplos
- Mejorar explicaciones
- Traducir documentación

### 💻 Contribuir Código

1. Fork el repositorio
2. Crea una rama para tu feature
3. Implementa tus cambios
4. Escribe/actualiza tests (cuando estén disponibles)
5. Asegúrate de que todo funciona
6. Crea un Pull Request

---

## Configuración del Entorno

### Prerrequisitos

- Node.js 20 o superior
- PostgreSQL 14+ (o Docker)
- Git

### Instalación

```bash
# 1. Fork y clonar
git clone https://github.com/TU-USUARIO/nextjs_devlmer.git
cd nextjs_devlmer

# 2. Instalar dependencias
npm install

# 3. Configurar base de datos
docker-compose up -d db

# 4. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores

# 5. Aplicar schema y seed
npm run db:push
npm run db:seed

# 6. Iniciar desarrollo
npm run dev
```

Ver [QUICKSTART.md](QUICKSTART.md) para más detalles.

---

## Proceso de Desarrollo

### Workflow

1. **Asignar o crear un issue**
   - Comenta en el issue que vas a trabajar en él
   - Espera confirmación antes de empezar

2. **Crear una rama**
   ```bash
   git checkout -b feature/nombre-descriptivo
   # o
   git checkout -b fix/nombre-del-bug
   ```

3. **Desarrollar**
   - Haz commits pequeños y frecuentes
   - Sigue las convenciones de código
   - Comenta código complejo
   - Actualiza documentación si es necesario

4. **Probar**
   - Prueba manualmente todas las funcionalidades afectadas
   - Verifica que no rompiste nada existente
   - Prueba en diferentes navegadores si afecta UI

5. **Commit y Push**
   ```bash
   git add .
   git commit -m "tipo: descripción breve"
   git push origin feature/nombre-descriptivo
   ```

6. **Crear Pull Request**
   - Usa el template de PR
   - Describe los cambios claramente
   - Vincula al issue relacionado
   - Agrega capturas de pantalla si aplica

### Ramas

- `main` - Código en producción
- `develop` - Código en desarrollo (si existe)
- `feature/*` - Nuevas funcionalidades
- `fix/*` - Correcciones de bugs
- `docs/*` - Mejoras de documentación
- `refactor/*` - Refactorización de código
- `test/*` - Agregar o mejorar tests

---

## Estándares de Código

### TypeScript

- ✅ Usa TypeScript para todo el código
- ✅ Define tipos explícitos
- ✅ Evita `any`, usa `unknown` si es necesario
- ✅ Usa interfaces para objetos complejos

```typescript
// ✅ Bien
interface User {
  id: string;
  name: string;
  email: string;
}

function createUser(data: User): Promise<User> {
  // ...
}

// ❌ Mal
function createUser(data: any) {
  // ...
}
```

### React/Next.js

- ✅ Usa Server Components por defecto
- ✅ Usa Client Components solo cuando sea necesario
- ✅ Nombres de componentes en PascalCase
- ✅ Nombres de archivos en PascalCase para componentes
- ✅ Usa hooks personalizados para lógica reutilizable

```typescript
// ✅ Bien - Server Component
export default function ProductsPage() {
  const products = await prisma.product.findMany();
  return <ProductList products={products} />;
}

// ✅ Bien - Client Component cuando se necesita
'use client';
export function SearchBar() {
  const [search, setSearch] = useState('');
  // ...
}
```

### Estilos

- ✅ Usa Tailwind CSS para estilos
- ✅ Usa clases utilitarias
- ✅ Evita CSS custom a menos que sea necesario
- ✅ Mantén consistencia con el diseño existente

```typescript
// ✅ Bien
<button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
  Click me
</button>

// ❌ Evitar
<button style={{ backgroundColor: 'blue' }}>
  Click me
</button>
```

### APIs

- ✅ Valida todos los inputs
- ✅ Sanitiza datos de usuario
- ✅ Usa rate limiting apropiado
- ✅ Retorna errores descriptivos
- ✅ Usa códigos de estado HTTP correctos

```typescript
// ✅ Bien
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: 'No autenticado' },
      { status: 401 }
    );
  }

  const body = await req.json();
  const validation = validateEmail(body.email);
  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.error },
      { status: 400 }
    );
  }

  // ... lógica
}
```

### Seguridad

- ✅ Nunca loggear información sensible
- ✅ Validar todos los inputs
- ✅ Sanitizar outputs
- ✅ Usar autenticación en endpoints sensibles
- ✅ Seguir principio de mínimo privilegio

Ver [SECURITY.md](SECURITY.md) para más detalles.

---

## Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

### Formato

```
tipo(scope): descripción breve

Descripción más detallada si es necesario.

Fixes #123
```

### Tipos

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan código)
- `refactor`: Refactorización (sin cambios funcionales)
- `perf`: Mejoras de rendimiento
- `test`: Agregar o modificar tests
- `chore`: Tareas de mantenimiento
- `security`: Correcciones de seguridad

### Ejemplos

```bash
# Nueva funcionalidad
git commit -m "feat(products): agregar filtro por categoría"

# Corrección de bug
git commit -m "fix(auth): corregir validación de email"

# Documentación
git commit -m "docs(readme): actualizar instrucciones de instalación"

# Seguridad
git commit -m "security(api): agregar rate limiting a endpoint de login"
```

### Scope

Usa uno de estos scopes cuando sea relevante:

- `auth` - Autenticación
- `products` - Productos
- `categories` - Categorías
- `orders` - Pedidos
- `tickets` - Tickets
- `chat` - Chat
- `users` - Usuarios
- `api` - APIs
- `ui` - Componentes de UI
- `db` - Base de datos
- `security` - Seguridad

---

## Pull Requests

### Antes de Crear un PR

- [ ] El código compila sin errores (`npm run build`)
- [ ] Probaste manualmente los cambios
- [ ] Actualizaste documentación si es necesario
- [ ] Los commits siguen las convenciones
- [ ] Resolviste conflictos con la rama base

### Template de PR

```markdown
## Descripción
[Describe brevemente qué hace este PR]

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## Checklist
- [ ] El código compila correctamente
- [ ] Probé manualmente los cambios
- [ ] Actualicé la documentación
- [ ] Los commits siguen las convenciones

## Capturas de pantalla (si aplica)
[Agrega capturas de pantalla aquí]

## Issues relacionados
Fixes #[número del issue]
```

### Proceso de Revisión

1. Creas el PR
2. Un maintainer revisa tu código
3. Si hay comentarios, haces los cambios necesarios
4. Una vez aprobado, se hace merge

### Estándares de Revisión

Los revisores verificarán:

- ✅ El código sigue los estándares del proyecto
- ✅ No introduce bugs o regresiones
- ✅ La documentación está actualizada
- ✅ Las validaciones de seguridad están presentes
- ✅ El rendimiento no se ve afectado negativamente

---

## Reportar Bugs

### Template de Bug Report

```markdown
## Descripción del bug
[Descripción clara del problema]

## Pasos para reproducir
1. Ir a '...'
2. Click en '...'
3. Scroll hasta '...'
4. Ver error

## Comportamiento esperado
[Qué esperabas que pasara]

## Comportamiento actual
[Qué pasó realmente]

## Capturas de pantalla
[Si aplica]

## Entorno
- OS: [e.g. macOS 13.0]
- Navegador: [e.g. Chrome 120]
- Node.js: [e.g. 20.10.0]
- Versión del proyecto: [e.g. 1.0.0]

## Información adicional
[Cualquier otro contexto sobre el problema]
```

---

## Solicitar Funcionalidades

### Template de Feature Request

```markdown
## Funcionalidad propuesta
[Descripción clara de la funcionalidad]

## Problema que resuelve
[Por qué esta funcionalidad sería útil]

## Solución propuesta
[Cómo debería funcionar]

## Alternativas consideradas
[Otras formas de resolver el problema]

## Información adicional
[Mockups, ejemplos, etc.]
```

---

## Preguntas Frecuentes

### ¿Necesito permiso para trabajar en un issue?

Sí, comenta en el issue indicando que quieres trabajar en él y espera confirmación de un maintainer.

### ¿Cuánto tiempo toma la revisión de un PR?

Intentamos revisar PRs en 2-3 días hábiles. PRs más grandes pueden tomar más tiempo.

### ¿Puedo trabajar en múltiples issues a la vez?

Preferimos que te enfoques en un issue a la vez para evitar conflictos y facilitar revisiones.

### ¿Qué hago si mi PR no recibe atención?

Puedes hacer un comentario cortés recordando después de 3-4 días.

### ¿Necesito agregar tests?

Por ahora no hay tests implementados, pero cuando se agreguen, sí será requerido.

---

## Recursos Útiles

### Documentación del Proyecto
- [README.md](README.md) - Documentación principal
- [QUICKSTART.md](QUICKSTART.md) - Guía de inicio rápido
- [SECURITY.md](SECURITY.md) - Guía de seguridad
- [DEPLOYMENT.md](DEPLOYMENT.md) - Guía de deployment

### Tecnologías Usadas
- [Next.js 15 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev/)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Herramientas de Desarrollo
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows)

---

## Contacto

Si tienes preguntas sobre cómo contribuir:

1. Revisa esta guía
2. Busca en los issues existentes
3. Crea un nuevo issue con tu pregunta

---

**¡Gracias por contribuir al FastFood Management System! 🎉**

Tu tiempo y esfuerzo ayudan a hacer este proyecto mejor para todos.
