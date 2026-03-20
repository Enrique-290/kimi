# Documentación de API y Servicios

## Servicios de Exportación (`exportService.js`)

### Funciones disponibles

#### `convertToCSV(data, headers)`
Convierte un array de objetos a formato CSV.

**Parámetros:**
- `data` (Array): Array de objetos a convertir
- `headers` (Array): Array de `{key, label}` para mapear campos

**Retorna:** String en formato CSV

#### `downloadFile(content, filename, mimeType)`
Descarga contenido como archivo.

**Parámetros:**
- `content` (String): Contenido del archivo
- `filename` (String): Nombre del archivo
- `mimeType` (String): Tipo MIME (default: 'text/csv')

#### `exportVentasToCSV(ventas, filename)`
Exporta array de ventas a CSV.

#### `exportProductosToCSV(productos, filename)`
Exporta inventario a CSV.

#### `exportToJSON(data, filename)`
Exporta datos a JSON.

#### `generateFullReport(data)`
Genera reporte completo del sistema en JSON.

**Parámetros:**
- `data` (Object): Objeto con {ventas, productos, clientes, gastos}

## Servicio de Sincronización (`syncService.js`)

### Clase `SyncService`

#### Métodos

##### `checkConnection()`
Verifica si hay conexión a internet.
**Retorna:** `boolean`

##### `queueOperation(operation, entity, data)`
Agrega operación a la cola de sincronización.

**Parámetros:**
- `operation` (String): 'create', 'update', 'delete'
- `entity` (String): 'producto', 'venta', etc.
- `data` (Object): Datos de la operación

##### `sync()`
Fuerza sincronización manual.

##### `exportAllData()`
Exporta todos los datos para backup.
**Retorna:** Object con todos los datos del sistema

##### `importAllData(data)`
Importa datos desde backup.

##### `clearAllData()`
Limpia todos los datos (reset).

### Eventos
El servicio emite los siguientes eventos:
- `online`: Conexión restaurada
- `offline`: Conexión perdida
- `sync-start`: Inicio de sincronización
- `sync-complete`: Sincronización completada
- `sync-error`: Error en sincronización
- `import-complete`: Importación completada
- `data-cleared`: Datos limpiados

**Uso:**
```javascript
import { syncService } from '@services/syncService';

syncService.addListener((event, data) => {
  console.log('Evento:', event, data);
});
```

## Hooks (`useKeyboard.js`)

### `useKeyboard(handlers, deps)`
Maneja atajos de teclado.

**Handlers disponibles:**
- `onEscape`: Tecla Escape
- `onEnter`: Tecla Enter
- `onF2`, `onF4`, `onF8`: Teclas de función
- `onDelete`: Delete o Backspace
- `onPlus`, `onMinus`: Teclas + y -
- `onNumber`: Números 1-9

### `useBarcodeScanner(onScan, timeout)`
Detecta escaneo de código de barras.

**Parámetros:**
- `onScan` (Function): Callback con el código escaneado
- `timeout` (Number): Tiempo entre caracteres (default: 100ms)

## Stores (Zustand)

### `useConfigStore`
Gestiona configuración del sistema.

**State:**
- `config`: Objeto de configuración

**Actions:**
- `updateConfig(newConfig)`: Actualiza configuración
- `resetConfig()`: Restaura configuración default

### `useProductStore`
Gestiona inventario.

**State:**
- `productos`: Array de productos
- `categorias`: Array de categorías

**Actions:**
- `addProducto(productoData)`: Agrega producto
- `updateProducto(id, updates)`: Actualiza producto
- `deleteProducto(id)`: Elimina producto
- `updateStock(id, cantidad, tipo)`: Actualiza stock
- `getProductoById(id)`: Obtiene producto por ID
- `getProductoByCodigo(codigo)`: Obtiene por código
- `getProductosBajoStock()`: Productos con stock bajo
- `searchProductos(term)`: Busca productos
- `loadDemoData()`: Carga datos de ejemplo

### `useVentaStore`
Gestiona ventas y carrito.

**State:**
- `ventas`: Array de ventas completadas
- `ventaActual`: Venta en progreso

**Actions:**
- `iniciarVenta(clienteId, clienteNombre)`: Nueva venta
- `agregarProducto(producto, cantidad)`: Agrega al carrito
- `quitarProducto(productoId)`: Quita del carrito
- `actualizarCantidad(productoId, cantidad)`: Cambia cantidad
- `setMetodoPago(metodo)`: Cambia método de pago
- `setPagoCon(monto)`: Registra pago
- `finalizarVenta()`: Completa la venta
- `cancelarVenta()`: Cancela venta actual
- `getVentasHoy()`: Ventas del día
- `getTotalVentasHoy()`: Total vendido hoy
- `getProductosMasVendidos(limit)`: Top productos

### `useClienteStore`
Gestiona clientes.

**Actions:**
- `addCliente(clienteData)`: Agrega cliente
- `updateCliente(id, updates)`: Actualiza cliente
- `deleteCliente(id)`: Elimina cliente
- `searchClientes(term)`: Busca clientes
- `updateStats(clienteId, monto)`: Actualiza estadísticas

### `useGastoStore`
Gestiona gastos.

**Actions:**
- `addGasto(gastoData)`: Agrega gasto
- `deleteGasto(id)`: Elimina gasto
- `getGastosByDate(inicio, fin)`: Gastos por fecha
- `getTotalGastosHoy()`: Total de gastos hoy

### `useUIStore`
Gestiona estado de UI.

**State:**
- `sidebarOpen`: Boolean
- `modalOpen`: Boolean
- `toast`: Object|null

**Actions:**
- `toggleSidebar()`: Alterna sidebar
- `openModal(content)`: Abre modal
- `closeModal()`: Cierra modal
- `showToast(message, type)`: Muestra notificación
