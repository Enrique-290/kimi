/**
 * @typedef {Object} Producto
 * @property {string} id - UUID del producto
 * @property {string} nombre - Nombre del producto
 * @property {string} codigo - Código de barras o SKU
 * @property {string} categoria - Categoría del producto
 * @property {string} marca - Marca del producto
 * @property {number} costo - Costo de compra
 * @property {number} precio - Precio de venta
 * @property {number} stock - Cantidad disponible
 * @property {number} stockMinimo - Stock mínimo para alertas
 * @property {'pieza'|'kilo'|'litro'|'gramo'|'metro'} unidad - Unidad de medida
 * @property {string} imagen - URL base64 o blob de la imagen
 * @property {string} proveedorId - ID del proveedor
 * @property {Date} createdAt - Fecha de creación
 * @property {Date} updatedAt - Fecha de actualización
 */

/**
 * @typedef {Object} ProductoVenta
 * @property {string} productoId - ID del producto
 * @property {string} nombre - Nombre del producto
 * @property {number} cantidad - Cantidad vendida
 * @property {number} precioUnitario - Precio unitario
 * @property {number} subtotal - Subtotal calculado
 * @property {string} imagen - Imagen del producto
 */

/**
 * @typedef {Object} Venta
 * @property {string} id - UUID de la venta
 * @property {Date} fecha - Fecha de la venta
 * @property {ProductoVenta[]} productos - Productos vendidos
 * @property {number} subtotal - Subtotal antes de impuestos
 * @property {number} total - Total de la venta
 * @property {'efectivo'|'transferencia'|'tarjeta'|'otro'} metodoPago - Método de pago
 * @property {number} pagoCon - Cantidad pagada (para calcular cambio)
 * @property {number} cambio - Cambio devuelto
 * @property {string|null} clienteId - ID del cliente (null si es venta rápida)
 * @property {string} clienteNombre - Nombre del cliente
 * @property {string} vendedorId - ID del vendedor
 * @property {string} estado - Estado de la venta (completada|cancelada)
 * @property {string} notas - Notas adicionales
 */

/**
 * @typedef {Object} Cliente
 * @property {string} id - UUID del cliente
 * @property {string} nombre - Nombre completo
 * @property {string} telefono - Teléfono de contacto
 * @property {string} email - Correo electrónico
 * @property {string} direccion - Dirección
 * @property {string} rfc - RFC (para facturación)
 * @property {Date} createdAt - Fecha de registro
 * @property {number} totalGastado - Total histórico gastado
 * @property {number} numeroCompras - Número de compras realizadas
 */

/**
 * @typedef {Object} Proveedor
 * @property {string} id - UUID del proveedor
 * @property {string} nombre - Nombre o razón social
 * @property {string} contacto - Nombre del contacto
 * @property {string} telefono - Teléfono
 * @property {string} email - Correo electrónico
 * @property {string} direccion - Dirección fiscal
 * @property {string} rfc - RFC
 * @property {string} banco - Banco para transferencias
 * @property {string} cuenta - Número de cuenta
 * @property {Date} createdAt - Fecha de registro
 */

/**
 * @typedef {Object} Compra
 * @property {string} id - UUID de la compra
 * @property {Date} fecha - Fecha de compra
 * @property {string} proveedorId - ID del proveedor
 * @property {string} proveedorNombre - Nombre del proveedor
 * @property {Array<{productoId: string, nombre: string, cantidad: number, costo: number, subtotal: number}>} productos - Productos comprados
 * @property {number} subtotal - Subtotal
 * @property {number} impuesto - Impuestos
 * @property {number} total - Total
 * @property {'efectivo'|'transferencia'|'credito'} metodoPago - Método de pago
 * @property {string} notas - Notas adicionales
 * @property {string} estado - Estado (completada|pendiente|cancelada)
 */

/**
 * @typedef {Object} Gasto
 * @property {string} id - UUID del gasto
 * @property {Date} fecha - Fecha del gasto
 * @property {string} concepto - Concepto/descripción
 * @property {string} categoria - Categoría del gasto
 * @property {number} monto - Monto del gasto
 * @property {string} metodoPago - Método de pago
 * @property {string} comprobante - URL de comprobante (opcional)
 * @property {string} notas - Notas adicionales
 */

/**
 * @typedef {Object} MovimientoBodega
 * @property {string} id - UUID del movimiento
 * @property {Date} fecha - Fecha del movimiento
 * @property {'entrada'|'salida'|'transferencia'|'merma'} tipo - Tipo de movimiento
 * @property {string} productoId - ID del producto
 * @property {string} productoNombre - Nombre del producto
 * @property {number} cantidad - Cantidad movida
 * @property {string} origen - Origen (bodega|tienda|proveedor)
 * @property {string} destino - Destino (bodega|tienda|merma)
 * @property {string} motivo - Motivo del movimiento
 * @property {string} usuarioId - ID del usuario que realizó el movimiento
 * @property {string} notas - Notas adicionales
 */

/**
 * @typedef {Object} Configuracion
 * @property {string} nombreNegocio - Nombre del negocio
 * @property {string} logo - Logo en base64
 * @property {string} direccion - Dirección del negocio
 * @property {string} telefono - Teléfono de contacto
 * @property {string} email - Correo electrónico
 * @property {string} rfc - RFC del negocio
 * @property {string} ticketMensaje - Mensaje personalizado para tickets
 * @property {string} moneda - Símbolo de moneda ($, €, etc.)
 * @property {string[]} metodosPago - Métodos de pago habilitados
 * @property {number} impuestoPorcentaje - Porcentaje de impuesto (IVA)
 * @property {string} tema - Tema actual (claro)
 */

/**
 * @typedef {Object} KardexEntry
 * @property {string} id - UUID del registro
 * @property {Date} fecha - Fecha del movimiento
 * @property {string} productoId - ID del producto
 * @property {'venta'|'compra'|'ajuste'|'merma'|'transferencia'} tipo - Tipo de movimiento
 * @property {number} cantidad - Cantidad (positiva entrada, negativa salida)
 * @property {number} stockAnterior - Stock antes del movimiento
 * @property {number} stockNuevo - Stock después del movimiento
 * @property {number} costoUnitario - Costo unitario (si aplica)
 * @property {string} referenciaId - ID de referencia (ventaId, compraId, etc.)
 * @property {string} notas - Notas adicionales
 */

export const TIPOS_UNIDAD = ['pieza', 'kilo', 'litro', 'gramo', 'metro'];
export const METODOS_PAGO = ['efectivo', 'transferencia', 'tarjeta', 'otro'];
export const CATEGORIAS_GASTO = ['servicios', 'nomina', 'renta', 'mantenimiento', 'otros'];
export const TIPOS_MOVIMIENTO = ['entrada', 'salida', 'transferencia', 'merma'];
