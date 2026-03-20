/**
 * Constantes del Sistema TPV Grocery
 * Organizadas por categorías para mantenibilidad
 */

// ============================================
// CONFIGURACIÓN GENERAL
// ============================================
export const APP_CONFIG = Object.freeze({
  NAME: 'TPV Grocery',
  VERSION: '1.0.0',
  DESCRIPTION: 'Sistema de Punto de Venta para Tiendas de Abarrotes',
  DEFAULT_LOCALE: 'es-MX',
  DEFAULT_TIMEZONE: 'America/Mexico_City'
});

// ============================================
// UNIDADES DE MEDIDA
// ============================================
export const UNIDADES_MEDIDA = Object.freeze({
  PIEZA: 'pieza',
  KILO: 'kilo',
  LITRO: 'litro',
  GRAMO: 'gramo',
  METRO: 'metro'
});

export const UNIDADES_OPCIONES = Object.freeze([
  { value: UNIDADES_MEDIDA.PIEZA, label: 'Pieza', abbr: 'pza' },
  { value: UNIDADES_MEDIDA.KILO, label: 'Kilogramo', abbr: 'kg' },
  { value: UNIDADES_MEDIDA.LITRO, label: 'Litro', abbr: 'l' },
  { value: UNIDADES_MEDIDA.GRAMO, label: 'Gramo', abbr: 'g' },
  { value: UNIDADES_MEDIDA.METRO, label: 'Metro', abbr: 'm' }
]);

// ============================================
// MÉTODOS DE PAGO
// ============================================
export const METODOS_PAGO = Object.freeze({
  EFECTIVO: 'efectivo',
  TRANSFERENCIA: 'transferencia',
  TARJETA: 'tarjeta',
  OTRO: 'otro'
});

export const METODOS_PAGO_OPCIONES = Object.freeze([
  { value: METODOS_PAGO.EFECTIVO, label: 'Efectivo', icon: 'Banknote' },
  { value: METODOS_PAGO.TRANSFERENCIA, label: 'Transferencia', icon: 'Smartphone' },
  { value: METODOS_PAGO.TARJETA, label: 'Tarjeta', icon: 'CreditCard' },
  { value: METODOS_PAGO.OTRO, label: 'Otro', icon: 'Receipt' }
]);

// ============================================
// CATEGORÍAS DE GASTOS
// ============================================
export const CATEGORIAS_GASTO = Object.freeze({
  SERVICIOS: 'servicios',
  NOMINA: 'nomina',
  RENTA: 'renta',
  MANTENIMIENTO: 'mantenimiento',
  SUMINISTROS: 'suministros',
  OTROS: 'otros'
});

export const CATEGORIAS_GASTO_OPCIONES = Object.freeze([
  { value: CATEGORIAS_GASTO.SERVICIOS, label: 'Servicios' },
  { value: CATEGORIAS_GASTO.NOMINA, label: 'Nómina' },
  { value: CATEGORIAS_GASTO.RENTA, label: 'Renta' },
  { value: CATEGORIAS_GASTO.MANTENIMIENTO, label: 'Mantenimiento' },
  { value: CATEGORIAS_GASTO.SUMINISTROS, label: 'Suministros' },
  { value: CATEGORIAS_GASTO.OTROS, label: 'Otros' }
]);

// ============================================
// TIPOS DE MOVIMIENTO DE BODEGA
// ============================================
export const TIPOS_MOVIMIENTO = Object.freeze({
  ENTRADA: 'entrada',
  SALIDA: 'salida',
  TRANSFERENCIA: 'transferencia',
  MERMA: 'merma'
});

// ============================================
// ESTADOS DE VENTA
// ============================================
export const ESTADOS_VENTA = Object.freeze({
  EN_PROCESO: 'en_proceso',
  COMPLETADA: 'completada',
  CANCELADA: 'cancelada'
});

// ============================================
// LÍMITES Y VALIDACIONES
// ============================================
export const LIMITES = Object.freeze({
  MAX_IMAGEN_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGEN_WIDTH: 1200,
  IMAGEN_QUALITY: 0.8,
  MIN_STOCK_ALERTA: 5,
  MAX_DECIMALES: 2,
  MAX_PRODUCTOS_VENTA: 100,
  MAX_CANTIDAD_PRODUCTO: 9999
});

// ============================================
// FORMATOS DE FECHA
// ============================================
export const FORMATOS_FECHA = Object.freeze({
  COMPLETO: 'dd/MM/yyyy HH:mm:ss',
  CORTO: 'dd/MM/yyyy',
  HORA: 'HH:mm',
  MES_ANO: 'MM/yyyy',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
});

// ============================================
// COLORES PARA GRÁFICAS
// ============================================
export const COLORES_GRAFICAS = Object.freeze([
  '#2563EB', // primary-600
  '#16A34A', // success-600
  '#F59E0B', // warning-600
  '#EF4444', // danger-600
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#84CC16', // lime
  '#F97316', // orange
  '#6366F1'  // indigo
]);

// ============================================
// MENÚ DE NAVEGACIÓN
// ============================================
export const MENU_ITEMS = Object.freeze([
  { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/ventas', label: 'Ventas', icon: 'ShoppingCart', highlight: true },
  { path: '/inventario', label: 'Inventario', icon: 'Package' },
  { path: '/bodega', label: 'Bodega', icon: 'Warehouse' },
  { path: '/clientes', label: 'Clientes', icon: 'Users' },
  { path: '/gastos', label: 'Gastos', icon: 'Receipt' },
  { path: '/compras', label: 'Compras', icon: 'ShoppingBag' },
  { path: '/proveedores', label: 'Proveedores', icon: 'Truck' },
  { path: '/historial', label: 'Historial', icon: 'History' },
  { path: '/reportes', label: 'Reportes', icon: 'BarChart3' },
  { path: '/configuracion', label: 'Configuración', icon: 'Settings' }
]);

// ============================================
// MENSAJES DEL SISTEMA
// ============================================
export const MENSAJES = Object.freeze({
  ERROR_GENERICO: 'Ha ocurrido un error. Por favor, inténtalo de nuevo.',
  CONFIRMACION_ELIMINAR: '¿Estás seguro de que deseas eliminar este elemento?',
  CONFIRMACION_CANCELAR_VENTA: '¿Estás seguro de cancelar esta venta?',
  STOCK_INSUFICIENTE: 'Stock insuficiente para este producto',
  PRODUCTO_NO_ENCONTRADO: 'Producto no encontrado',
  VENTA_COMPLETADA: 'Venta completada exitosamente',
  DATOS_GUARDADOS: 'Datos guardados correctamente',
  ERROR_IMAGEN: 'Error al procesar la imagen. Verifica el formato y tamaño.',
  CODIGO_DUPLICADO: 'Ya existe un producto con este código'
});

// ============================================
// LOCALSTORAGE KEYS
// ============================================
export const STORAGE_KEYS = Object.freeze({
  CONFIG: 'tpv-config',
  PRODUCTOS: 'tpv-productos',
  VENTAS: 'tpv-ventas',
  CLIENTES: 'tpv-clientes',
  GASTOS: 'tpv-gastos',
  SYNC_QUEUE: 'tpv-sync-queue',
  BACKUP: 'tpv-backup'
});

// ============================================
// CONFIGURACIÓN POR DEFECTO
// ============================================
export const DEFAULT_CONFIG = Object.freeze({
  nombreNegocio: 'Mi Tienda',
  logo: null,
  direccion: '',
  telefono: '',
  email: '',
  rfc: '',
  ticketMensaje: '¡Gracias por su compra!',
  moneda: '$',
  metodosPago: Object.values(METODOS_PAGO),
  impuestoPorcentaje: 16,
  tema: 'claro'
});

// ============================================
// CATEGORÍAS DE PRODUCTOS POR DEFECTO
// ============================================
export const CATEGORIAS_DEFAULT = Object.freeze([
  'Abarrotes',
  'Bebidas',
  'Lácteos',
  'Carnes',
  'Frutas y Verduras',
  'Limpieza',
  'Higiene Personal',
  'Panadería',
  'Dulces y Snacks',
  'Conservas',
  'Especias',
  'Otros'
]);

export default {
  APP_CONFIG,
  UNIDADES_MEDIDA,
  UNIDADES_OPCIONES,
  METODOS_PAGO,
  METODOS_PAGO_OPCIONES,
  CATEGORIAS_GASTO,
  CATEGORIAS_GASTO_OPCIONES,
  TIPOS_MOVIMIENTO,
  ESTADOS_VENTA,
  LIMITES,
  FORMATOS_FECHA,
  COLORES_GRAFICAS,
  MENU_ITEMS,
  MENSAJES,
  STORAGE_KEYS,
  DEFAULT_CONFIG,
  CATEGORIAS_DEFAULT
};
