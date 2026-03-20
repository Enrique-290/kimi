import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Genera un UUID v4
 * @returns {string}
 */
export const generateId = () => {
  return crypto.randomUUID();
};

/**
 * Formatea un número como moneda
 * @param {number} amount - Cantidad
 * @param {string} currency - Símbolo de moneda
 * @returns {string}
 */
export const formatCurrency = (amount, currency = '$') => {
  if (amount === null || amount === undefined || isNaN(amount)) return `${currency}0.00`;
  return `${currency}${Number(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

/**
 * Formatea una fecha
 * @param {Date|string} date - Fecha
 * @param {string} formatStr - Formato deseado
 * @returns {string}
 */
export const formatDate = (date, formatStr = 'dd/MM/yyyy HH:mm') => {
  if (!date) return '-';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr, { locale: es });
};

/**
 * Formatea fecha corta
 * @param {Date|string} date - Fecha
 * @returns {string}
 */
export const formatShortDate = (date) => {
  return formatDate(date, 'dd/MM/yyyy');
};

/**
 * Convierte archivo a Base64
 * @param {File} file - Archivo a convertir
 * @returns {Promise<string>}
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Comprime imagen antes de convertir a base64
 * @param {File} file - Archivo de imagen
 * @param {number} maxWidth - Ancho máximo
 * @param {number} quality - Calidad (0-1)
 * @returns {Promise<string>}
 */
export const compressImage = (file, maxWidth = 800, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scaleFactor = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scaleFactor;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

/**
 * Calcula el cambio
 * @param {number} total - Total a pagar
 * @param {number} pagoCon - Cantidad pagada
 * @returns {number}
 */
export const calculateChange = (total, pagoCon) => {
  return Math.max(0, pagoCon - total);
};

/**
 * Valida si hay stock suficiente
 * @param {number} requested - Cantidad solicitada
 * @param {number} available - Stock disponible
 * @returns {boolean}
 */
export const hasEnoughStock = (requested, available) => {
  return requested <= available;
};

/**
 * Calcula utilidad
 * @param {number} precio - Precio de venta
 * @param {number} costo - Costo
 * @returns {number}
 */
export const calculateProfit = (precio, costo) => {
  return precio - costo;
};

/**
 * Calcula porcentaje de utilidad
 * @param {number} precio - Precio de venta
 * @param {number} costo - Costo
 * @returns {number}
 */
export const calculateProfitMargin = (precio, costo) => {
  if (costo === 0) return 100;
  return ((precio - costo) / costo) * 100;
};

/**
 * Debounce function
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera
 * @returns {Function}
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Guarda en localStorage
 * @param {string} key - Clave
 * @param {any} value - Valor
 */
export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
};

/**
 * Lee de localStorage
 * @param {string} key - Clave
 * @param {any} defaultValue - Valor por defecto
 * @returns {any}
 */
export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Error loading from localStorage:', e);
    return defaultValue;
  }
};

/**
 * Exporta datos a CSV
 * @param {Array} data - Array de objetos
 * @param {string} filename - Nombre del archivo
 */
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || !data.length) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const cell = row[header] || '';
        return `"${String(cell).replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

/**
 * Filtra array por término de búsqueda
 * @param {Array} items - Array a filtrar
 * @param {string} term - Término de búsqueda
 * @param {Array} fields - Campos a buscar
 * @returns {Array}
 */
export const filterByTerm = (items, term, fields) => {
  if (!term) return items;
  const lowerTerm = term.toLowerCase();
  return items.filter(item => 
    fields.some(field => 
      String(item[field] || '').toLowerCase().includes(lowerTerm)
    )
  );
};

/**
 * Agrupa array por propiedad
 * @param {Array} array - Array a agrupar
 * @param {string} key - Propiedad para agrupar
 * @returns {Object}
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    result[group] = result[group] || [];
    result[group].push(item);
    return result;
  }, {});
};

/**
 * Suma valores de un array por propiedad
 * @param {Array} array - Array
 * @param {string} key - Propiedad a sumar
 * @returns {number}
 */
export const sumBy = (array, key) => {
  return array.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
};
