import React, { useState, useMemo } from 'react';
import { History, Filter, Download, ShoppingCart, Package, UserPlus, Receipt, ArrowUpDown, Trash2, Edit, Plus } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge, Modal } from '@components/ui';
import { useVentaStore, useProductStore, useClienteStore, useGastoStore } from '@store/useStore';
import { formatDate, formatCurrency } from '@utils/helpers';

const TIPOS_LOG = {
  venta: { label: 'Venta', icon: ShoppingCart, color: 'primary' },
  producto_creado: { label: 'Producto Creado', icon: Plus, color: 'success' },
  producto_editado: { label: 'Producto Editado', icon: Edit, color: 'warning' },
  producto_eliminado: { label: 'Producto Eliminado', icon: Trash2, color: 'danger' },
  cliente_creado: { label: 'Cliente Nuevo', icon: UserPlus, color: 'success' },
  gasto: { label: 'Gasto', icon: Receipt, color: 'danger' },
  stock_ajustado: { label: 'Stock Ajustado', icon: ArrowUpDown, color: 'warning' }
};

export const Historial = () => {
  const { ventas } = useVentaStore();
  const { productos } = useProductStore();
  const { clientes } = useClienteStore();
  const { gastos } = useGastoStore();

  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  // Generar logs combinados de todas las fuentes
  const logs = useMemo(() => {
    const allLogs = [];

    // Logs de ventas
    ventas.forEach(venta => {
      allLogs.push({
        id: venta.id,
        tipo: 'venta',
        fecha: venta.fecha,
        titulo: `Venta a ${venta.clienteNombre}`,
        descripcion: `${venta.productos.length} productos - ${formatCurrency(venta.total)}`,
        detalles: venta,
        usuario: 'Admin'
      });
    });

    // Logs de productos
    productos.forEach(prod => {
      allLogs.push({
        id: `prod-${prod.id}`,
        tipo: 'producto_creado',
        fecha: prod.createdAt,
        titulo: `Producto creado: ${prod.nombre}`,
        descripcion: `Código: ${prod.codigo} - Stock inicial: ${prod.stock}`,
        detalles: prod,
        usuario: 'Admin'
      });
    });

    // Logs de clientes
    clientes.forEach(cliente => {
      allLogs.push({
        id: `cli-${cliente.id}`,
        tipo: 'cliente_creado',
        fecha: cliente.createdAt,
        titulo: `Cliente registrado: ${cliente.nombre}`,
        descripcion: `Tel: ${cliente.telefono}`,
        detalles: cliente,
        usuario: 'Admin'
      });
    });

    // Logs de gastos
    gastos.forEach(gasto => {
      allLogs.push({
        id: gasto.id,
        tipo: 'gasto',
        fecha: gasto.fecha,
        titulo: `Gasto: ${gasto.concepto}`,
        descripcion: `${formatCurrency(gasto.monto)} - ${gasto.categoria}`,
        detalles: gasto,
        usuario: 'Admin'
      });
    });

    // Ordenar por fecha descendente
    return allLogs.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [ventas, productos, clientes, gastos]);

  // Filtrar logs
  const logsFiltrados = useMemo(() => {
    return logs.filter(log => {
      const matchTipo = filtroTipo === 'todos' || log.tipo === filtroTipo;
      const matchFecha = !filtroFecha || log.fecha.startsWith(filtroFecha);
      return matchTipo && matchFecha;
    });
  }, [logs, filtroTipo, filtroFecha]);

  const handleExport = () => {
    const data = logsFiltrados.map(log => ({
      Fecha: formatDate(log.fecha),
      Tipo: TIPOS_LOG[log.tipo]?.label || log.tipo,
      Título: log.titulo,
      Descripción: log.descripcion,
      Usuario: log.usuario
    }));

    const csv = [
      Object.keys(data[0] || {}).join(','),
      ...data.map(row => Object.values(row).map(v => `"${v}"`).join(','))
    ].join('
');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historial_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-lg font-semibold">Historial de Movimientos</h2>
        <Button variant="outline" onClick={handleExport} leftIcon={<Download className="w-4 h-4" />}>
          Exportar CSV
        </Button>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="todos">Todos los tipos</option>
              {Object.entries(TIPOS_LOG).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-gray-500" />
            <input
              type="date"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {filtroFecha && (
              <Button variant="ghost" size="sm" onClick={() => setFiltroFecha('')}>
                Limpiar
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <Card>
        <div className="divide-y">
          {logsFiltrados.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No hay registros en el historial</p>
            </div>
          ) : (
            logsFiltrados.map((log) => {
              const config = TIPOS_LOG[log.tipo] || { icon: History, color: 'default' };
              const Icon = config.icon;
              const colorClasses = {
                primary: 'bg-primary-100 text-primary-600',
                success: 'bg-success-100 text-success-600',
                warning: 'bg-warning-100 text-warning-600',
                danger: 'bg-danger-100 text-danger-600',
                default: 'bg-gray-100 text-gray-600'
              };

              return (
                <div 
                  key={log.id} 
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedItem(log)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${colorClasses[config.color]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{log.titulo}</p>
                        <span className="text-sm text-gray-500">
                          {formatDate(log.fecha, 'dd/MM/yyyy HH:mm')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{log.descripcion}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" size="sm">
                          {config.label || log.tipo}
                        </Badge>
                        <span className="text-xs text-gray-400">• {log.usuario}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Modal de detalles */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="Detalles del Movimiento"
        size="md"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                TIPOS_LOG[selectedItem.tipo]?.color === 'primary' ? 'bg-primary-100 text-primary-600' :
                TIPOS_LOG[selectedItem.tipo]?.color === 'success' ? 'bg-success-100 text-success-600' :
                TIPOS_LOG[selectedItem.tipo]?.color === 'warning' ? 'bg-warning-100 text-warning-600' :
                TIPOS_LOG[selectedItem.tipo]?.color === 'danger' ? 'bg-danger-100 text-danger-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {React.createElement(TIPOS_LOG[selectedItem.tipo]?.icon || History, { className: 'w-5 h-5' })}
              </div>
              <div>
                <p className="font-semibold">{selectedItem.titulo}</p>
                <p className="text-sm text-gray-500">{formatDate(selectedItem.fecha)}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">{selectedItem.descripcion}</p>
            </div>

            {selectedItem.tipo === 'venta' && selectedItem.detalles && (
              <div>
                <h4 className="font-medium mb-2">Productos vendidos:</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedItem.detalles.productos?.map((prod, idx) => (
                    <div key={idx} className="flex justify-between text-sm p-2 bg-white rounded border">
                      <span>{prod.cantidad}x {prod.nombre}</span>
                      <span className="font-medium">{formatCurrency(prod.subtotal)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-primary-600">{formatCurrency(selectedItem.detalles.total)}</span>
                </div>
              </div>
            )}

            {selectedItem.tipo === 'producto_creado' && selectedItem.detalles && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Código:</span>
                  <p className="font-medium">{selectedItem.detalles.codigo}</p>
                </div>
                <div>
                  <span className="text-gray-500">Categoría:</span>
                  <p className="font-medium">{selectedItem.detalles.categoria}</p>
                </div>
                <div>
                  <span className="text-gray-500">Precio:</span>
                  <p className="font-medium">{formatCurrency(selectedItem.detalles.precio)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Stock inicial:</span>
                  <p className="font-medium">{selectedItem.detalles.stock}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Historial;
