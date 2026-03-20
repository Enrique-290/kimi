/**
 * Utilidades de validación para el sistema TPV
 */

import { LIMITES, UNIDADES_MEDIDA, METODOS_PAGO } from './constants';

/**
 * Valida un email
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (!email) return true; // Email opcional
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida un teléfono mexicano
 * @param {string} phone 
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  // Elimina espacios, guiones y paréntesis
  const clean = phone.replace(/[\s\-\(\)]/g, '');
  // Valida 10 dígitos (celular) o 10 dígitos con lada opcional
  return /^\d{10}$/.test(clean);
};

/**
 * Valida RFC mexicano
 * @param {string} rfc 
 * @returns {boolean}
 */
export const isValidRFC = (rfc) => {
  if (!rfc) return true; // RFC opcional
  const regex = /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/i;
  return regex.test(rfc);
};

/**
 * Valida un código de barras
 * @param {string} code 
 * @returns {boolean}
 */
export const isValidBarcode = (code) => {
  if (!code) return false;
  // Acepta números y letras, mínimo 3 caracteres
  return /^[A-Z0-9\-]{3,}$/i.test(code);
};

/**
 * Valida datos de un producto
 * @param {Object} product 
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateProduct = (product) => {
  const errors = {};

  if (!product.nombre || product.nombre.trim().length < 2) {
    errors.nombre = 'El nombre debe tener al menos 2 caracteres';
  }

  if (!product.codigo || !isValidBarcode(product.codigo)) {
    errors.codigo = 'Código inválido (mínimo 3 caracteres alfanuméricos)';
  }

  if (!product.categoria) {
    errors.categoria = 'Selecciona una categoría';
  }

  if (isNaN(product.precio) || product.precio <= 0) {
    errors.precio = 'El precio debe ser mayor a 0';
  }

  if (isNaN(product.costo) || product.costo < 0) {
    errors.costo = 'El costo no puede ser negativo';
  }

  if (isNaN(product.stock) || product.stock < 0) {
    errors.stock = 'El stock no puede ser negativo';
  }

  if (isNaN(product.stockMinimo) || product.stockMinimo < 0) {
    errors.stockMinimo = 'El stock mínimo no puede ser negativo';
  }

  if (!Object.values(UNIDADES_MEDIDA).includes(product.unidad)) {
    errors.unidad = 'Unidad de medida inválida';
  }

  // Validar que precio sea mayor o igual al costo (opcional, puede ser configurable)
  if (product.precio < product.costo) {
    errors.precio = errors.precio || 'El precio es menor al costo';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Valida datos de un cliente
 * @param {Object} client 
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateClient = (client) => {
  const errors = {};

  if (!client.nombre || client.nombre.trim().length < 2) {
    errors.nombre = 'El nombre debe tener al menos 2 caracteres';
  }

  if (!client.telefono || !isValidPhone(client.telefono)) {
    errors.telefono = 'Teléfono inválido (10 dígitos requeridos)';
  }

  if (client.email && !isValidEmail(client.email)) {
    errors.email = 'Email inválido';
  }

  if (client.rfc && !isValidRFC(client.rfc)) {
    errors.rfc = 'RFC inválido';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Valida datos de una venta
 * @param {Object} sale 
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateSale = (sale) => {
  const errors = {};

  if (!sale.productos || sale.productos.length === 0) {
    errors.productos = 'La venta debe tener al menos un producto';
  }

  if (sale.productos && sale.productos.length > LIMITES.MAX_PRODUCTOS_VENTA) {
    errors.productos = `Máximo ${LIMITES.MAX_PRODUCTOS_VENTA} productos por venta`;
  }

  if (!Object.values(METODOS_PAGO).includes(sale.metodoPago)) {
    errors.metodoPago = 'Método de pago inválido';
  }

  if (sale.metodoPago === METODOS_PAGO.EFECTIVO) {
    if (sale.pagoCon < sale.total) {
      errors.pagoCon = 'El pago es insuficiente';
    }
  }

  // Validar cada producto
  if (sale.productos) {
    const productErrors = [];
    sale.productos.forEach((item, index) => {
      if (isNaN(item.cantidad) || item.cantidad <= 0) {
        productErrors.push(`Producto ${index + 1}: cantidad inválida`);
      }
      if (item.cantidad > LIMITES.MAX_CANTIDAD_PRODUCTO) {
        productErrors.push(`Producto ${index + 1}: cantidad máxima excedida`);
      }
    });
    if (productErrors.length > 0) {
      errors.productosDetalle = productErrors;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Valida datos de un gasto
 * @param {Object} expense 
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateExpense = (expense) => {
  const errors = {};

  if (!expense.concepto || expense.concepto.trim().length < 2) {
    errors.concepto = 'El concepto debe tener al menos 2 caracteres';
  }

  if (isNaN(expense.monto) || expense.monto <= 0) {
    errors.monto = 'El monto debe ser mayor a 0';
  }

  if (!expense.categoria) {
    errors.categoria = 'Selecciona una categoría';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Valida un archivo de imagen
 * @param {File} file 
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { isValid: false, error: 'No se seleccionó ningún archivo' };
  }

  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'El archivo debe ser una imagen' };
  }

  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    return { isValid: false, error: 'Formato no soportado. Use JPG, PNG o WEBP' };
  }

  if (file.size > LIMITES.MAX_IMAGEN_SIZE) {
    return { 
      isValid: false, 
      error: `La imagen no debe superar ${LIMITES.MAX_IMAGEN_SIZE / 1024 / 1024}MB` 
    };
  }

  return { isValid: true, error: null };
};

/**
 * Sanitiza texto para prevenir XSS
 * @param {string} text 
 * @returns {string}
 */
export const sanitizeText = (text) => {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Formatea un número como moneda para validación
 * @param {number} amount 
 * @returns {boolean}
 */
export const isValidAmount = (amount) => {
  return !isNaN(amount) && isFinite(amount) && amount >= 0;
};

export default {
  isValidEmail,
  isValidPhone,
  isValidRFC,
  isValidBarcode,
  validateProduct,
  validateClient,
  validateSale,
  validateExpense,
  validateImageFile,
  sanitizeText,
  isValidAmount
};
