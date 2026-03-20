# Documentación Técnica - TPV Grocery

## Arquitectura del Sistema

### Patrón de Diseño: Feature-Based Architecture

El proyecto sigue una arquitectura basada en características (features) donde cada módulo funcional está autocontenido:

```
src/
├── modules/           # Cada módulo contiene su lógica, UI y tests
│   ├── ventas/       # Punto de venta (core del negocio)
│   ├── inventario/   # Gestión de productos
│   ├── dashboard/    # KPIs y métricas
│   └── ...
├── components/       # Componentes compartidos
│   ├── ui/          # Design system (Button, Card, Input, etc.)
│   └── layout/      # Layout components (Sidebar, Header)
├── store/           # Estado global con Zustand
├── services/        # Lógica de negocio y APIs
├── utils/           # Helpers, constantes, validaciones
├── hooks/           # Custom hooks
└── types/           # Definiciones de tipos
```

### Flujo de Datos

1. **UI Layer**: Componentes React reciben eventos del usuario
2. **Store Layer**: Zustand maneja el estado global
3. **Service Layer**: Servicios procesan lógica de negocio
4. **Persistence Layer**: localStorage para persistencia local

### Gestión de Estado

#### Zustand Stores

- **useConfigStore**: Configuración del negocio (persistente)
- **useProductStore**: Inventario de productos (persistente)
- **useVentaStore**: Ventas y carrito actual (persistente)
- **useClienteStore**: Base de datos de clientes (persistente)
- **useGastoStore**: Registro de gastos (persistente)
- **useUIStore**: Estado temporal de UI (no persistente)

#### Persistencia

Todas las stores usan el middleware `persist` de Zustand que:
- Guarda automáticamente en localStorage
- Rehidrata el estado al iniciar la app
- Permite versionado y migraciones

### Sistema de Componentes

#### Design System (Atomic Design)

- **Atoms**: Button, Input, Badge, Spinner
- **Molecules**: Card (compuesto de atoms)
- **Organisms**: Formularios completos
- **Templates**: Layouts de página

#### Props Standard

Todos los componentes UI aceptan:
- `className`: Para extensión de estilos
- `variant`: Variante visual (primary, secondary, etc.)
- `size`: Tamaño (xs, sm, md, lg, xl)
- `disabled`: Estado deshabilitado
- `loading`: Estado de carga

### Manejo de Imágenes

#### Flujo de Procesamiento

1. **Selección**: Usuario selecciona archivo
2. **Validación**: Se verifica tipo y tamaño
3. **Compresión**: Canvas API reduce dimensiones
4. **Conversión**: FileReader convierte a base64
5. **Almacenamiento**: Se guarda en store (localStorage)

#### Optimizaciones

- Redimensión a 800px máximo
- Compresión JPEG 80%
- Límite de 5MB por imagen
- Placeholder mientras carga

### Validaciones

#### Capa de Validación

Todas las entradas se validan antes de procesar:

```javascript
// Ejemplo: Validación de producto
const { isValid, errors } = validateProduct(productData);
if (!isValid) {
  // Mostrar errores en UI
  return;
}
```

#### Tipos de Validación

- **Sincrona**: Email, teléfono, RFC, códigos
- **Asíncrona**: Duplicados en base de datos
- **Schema**: Estructura completa de objetos

### Seguridad

#### Medidas Implementadas

1. **Sanitización**: Previene XSS en textos
2. **Validación**: Datos validados antes de procesar
3. **Error Boundaries**: Capturan errores de React
4. **No eval**: No se usa eval() ni similar

#### Consideraciones

- localStorage es accesible solo en cliente
- Sin autenticación implementada (listo para agregar)
- Sin encriptación de datos (listo para agregar)

### Performance

#### Optimizaciones

1. **Memoización**: useMemo para cálculos costosos
2. **Virtualización**: Listas largas (preparado)
3. **Lazy Loading**: Carga diferida de módulos (preparado)
4. **Debouncing**: En búsquedas y inputs
5. **Compresión**: Imágenes antes de almacenar

#### Métricas

- Bundle size: ~150KB (estimado)
- First Paint: < 1.5s
- Time to Interactive: < 3s

### Testing Strategy

#### Niveles de Testing

1. **Unit**: Funciones utilitarias
2. **Integration**: Stores y servicios
3. **E2E**: Flujos completos de usuario

#### Herramientas Recomendadas

- Jest + React Testing Library
- Cypress para E2E
- React DevTools para debugging

### Despliegue

#### Opciones

1. **Static Hosting**: Netlify, Vercel, GitHub Pages
2. **Docker**: Container con Nginx
3. **CDN**: CloudFlare, AWS CloudFront

#### Build Process

```bash
npm run build
# Genera /dist con:
# - JavaScript minificado
# - CSS optimizado
# - Assets hasheados
# - Source maps (opcional)
```

### Extensibilidad

#### Agregar Nuevos Módulos

1. Crear carpeta en `src/modules/`
2. Agregar ruta en `src/App.jsx`
3. Agregar ítem de menú en constantes
4. Creer store si es necesario

#### Integración con Backend

1. Creer servicios en `src/services/api/`
2. Reemplazar localStorage por API calls
3. Mantener stores como cache local
4. Implementar syncService para offline-first

### Debugging

#### Herramientas

- **React DevTools**: Inspeccionar componentes
- **Zustand DevTools**: Ver estado global
- **Redux DevTools**: Compatible con Zustand
- **Browser DevTools**: Network, Console, Storage

#### Logs

```javascript
// En stores, usar:
console.log('[Store] Action:', action, data);

// En servicios, usar:
console.log('[Service] Operation:', operation, result);
```

### Mantenimiento

#### Checklist Mensual

- [ ] Revisar dependencias desactualizadas
- [ ] Verificar tamaño del bundle
- [ ] Revisar logs de errores
- [ ] Optimizar imágenes en storage
- [ ] Backup de datos localStorage

#### Actualizaciones

- React: Seguir migración oficial
- Zustand: Revisar breaking changes
- Tailwind: Actualizar clases deprecadas
- Vite: Mantener plugins actualizados

## Referencias

- [React Docs](https://react.dev)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Docs](https://vitejs.dev)
- [Recharts](https://recharts.org)
