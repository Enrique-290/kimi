/**
 * Servicio de exportación de datos
 * Exporta datos a CSV, JSON y otros formatos
 */

/**
 * Convierte array de objetos a CSV
 * @param {Array} data - Array de objetos
 * @param {Array} headers - Array de {key, label} para mapear campos
 * @returns {string} - String CSV
 */
export const convertToCSV = (data, headers) => {
  if (!data || !data.length) return '';

  // Si no hay headers definidos, usar las keys del primer objeto
  const cols = headers || Object.keys(data[0]).map(key => ({ key, label: key }));

  // Crear fila de encabezados
  const headerRow = cols.map(col => `"${col.label}"`).join(',');

  // Crear filas de datos
  const rows = data.map(item => {
    return cols.map(col => {
      const value = item[col.key];
      // Manejar valores nulos, undefined o con comillas
      if (value === null || value === undefined) return '""';
      const stringValue = String(value).replace(/"/g, '""');
      return `"${stringValue}"`;
    }).join(',');
  });

  return [headerRow, ...rows].join('\n');
};

/**
 * Descarga contenido como archivo
 * @param {string} content - Contenido del archivo
 * @param {string} filename - Nombre del archivo
 * @param {string} mimeType - Tipo MIME
 */
export const downloadFile = (content, filename, mimeType = 'text/csv') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exporta ventas a CSV
 * @param {Array} ventas - Array de ventas
 * @param {string} filename - Nombre del archivo
 */
export const exportVentasToCSV = (ventas, filename = 'ventas.csv') => {
  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'fecha', label: 'Fecha' },
    { key: 'clienteNombre', label: 'Cliente' },
    { key: 'total', label: 'Total' },
    { key: 'metodoPago', label: 'Método de Pago' },
    { key: 'estado', label: 'Estado' }
  ];

  // Aplanar datos de ventas
  const flatData = ventas.map(v => ({
    ...v,
    fecha: new Date(v.fecha).toLocaleString(),
    total: v.total.toFixed(2)
  }));

  const csv = convertToCSV(flatData, headers);
  downloadFile(csv, filename);
};

/**
 * Exporta productos a CSV
 * @param {Array} productos - Array de productos
 * @param {string} filename - Nombre del archivo
 */
export const exportProductosToCSV = (productos, filename = 'inventario.csv') => {
  const headers = [
    { key: 'codigo', label: 'Código' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'categoria', label: 'Categoría' },
    { key: 'marca', label: 'Marca' },
    { key: 'costo', label: 'Costo' },
    { key: 'precio', label: 'Precio' },
    { key: 'stock', label: 'Stock' },
    { key: 'unidad', label: 'Unidad' }
  ];

  const csv = convertToCSV(productos, headers);
  downloadFile(csv, filename);
};

/**
 * Exporta datos a JSON
 * @param {Object} data - Datos a exportar
 * @param {string} filename - Nombre del archivo
 */
export const exportToJSON = (data, filename = 'data.json') => {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename, 'application/json');
};

/**
 * Genera reporte completo del sistema
 * @param {Object} data - Objeto con ventas, productos, clientes, gastos
 */
export const generateFullReport = (data) => {
  const report = {
    fechaGeneracion: new Date().toISOString(),
    resumen: {
      totalVentas: data.ventas?.length || 0,
      totalProductos: data.productos?.length || 0,
      totalClientes: data.clientes?.length || 0,
      totalGastos: data.gastos?.length || 0,
      ingresosTotales: data.ventas?.reduce((sum, v) => sum + (v.total || 0), 0) || 0,
      gastosTotales: data.gastos?.reduce((sum, g) => sum + (g.monto || 0), 0) || 0
    },
    ventas: data.ventas || [],
    productos: data.productos || [],
    clientes: data.clientes || [],
    gastos: data.gastos || []
  };

  exportToJSON(report, `reporte_completo_${new Date().toISOString().split('T')[0]}.json`);
};

/**
 * Importa productos desde CSV
 * @param {File} file - Archivo CSV
 * @returns {Promise<Array>} - Array de productos parseados
 */
export const importProductosFromCSV = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());

        const products = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.replace(/"/g, '').trim());
          const obj = {};
          headers.forEach((header, index) => {
            let value = values[index];
            // Convertir números
            if (!isNaN(value) && value !== '') {
              value = parseFloat(value);
            }
            obj[header.toLowerCase()] = value;
          });
          return obj;
        });

        resolve(products);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export default {
  convertToCSV,
  downloadFile,
  exportVentasToCSV,
  exportProductosToCSV,
  exportToJSON,
  generateFullReport,
  importProductosFromCSV
};
