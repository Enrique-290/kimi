import React, { useState, useMemo } from 'react';
import { BarChart3, Download, FileText, Calendar, TrendingUp, PieChart as PieChartIcon, DollarSign } from 'lucide-react';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '@components/ui';
import { useVentaStore, useProductStore, useGastoStore, useConfigStore } from '@store/useStore';
import { exportVentasToCSV, exportProductosToCSV, generateFullReport } from '@services/exportService';
import { formatCurrency, formatDate, formatShortDate } from '@utils/helpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';

const COLORS = ['#2563EB', '#16A34A', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

export const Reportes = () => {
  const { ventas, getVentasByDate } = useVentaStore();
  const { productos, categorias } = useProductStore();
  const { gastos } = useGastoStore();
  const { config } = useConfigStore();

  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // Filtrar ventas por rango de fechas
  const ventasFiltradas = useMemo(() => {
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    end.setHours(23, 59, 59);
    return getVentasByDate(start, end);
  }, [ventas, dateRange, getVentasByDate]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const totalVentas = ventasFiltradas.reduce((sum, v) => sum + v.total, 0);
    const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0);
    const utilidad = totalVentas - totalGastos;
    const ticketPromedio = ventasFiltradas.length > 0 ? totalVentas / ventasFiltradas.length : 0;

    return { totalVentas, totalGastos, utilidad, ticketPromedio, numVentas: ventasFiltradas.length };
  }, [ventasFiltradas, gastos]);

  // Datos para gráfica de ventas por día
  const ventasPorDia = useMemo(() => {
    const grouped = {};
    ventasFiltradas.forEach(v => {
      const fecha = formatShortDate(v.fecha);
      grouped[fecha] = (grouped[fecha] || 0) + v.total;
    });
    return Object.entries(grouped).map(([fecha, total]) => ({ fecha, total })).slice(-30);
  }, [ventasFiltradas]);

  // Datos para gráfica de productos por categoría
  const productosPorCategoria = useMemo(() => {
    const grouped = {};
    productos.forEach(p => {
      grouped[p.categoria] = (grouped[p.categoria] || 0) + 1;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [productos]);

  // Datos para gráfica de métodos de pago
  const metodosPago = useMemo(() => {
    const grouped = {};
    ventasFiltradas.forEach(v => {
      grouped[v.metodoPago] = (grouped[v.metodoPago] || 0) + v.total;
    });
    return Object.entries(grouped).map(([name, value]) => ({ 
      name: name.charAt(0).toUpperCase() + name.slice(1), 
      value 
    }));
  }, [ventasFiltradas]);

  const handleExportVentas = () => {
    exportVentasToCSV(ventasFiltradas, `ventas_${dateRange.start}_${dateRange.end}.csv`);
  };

  const handleExportProductos = () => {
    exportProductosToCSV(productos, 'inventario.csv');
  };

  const handleExportFullReport = () => {
    generateFullReport({
      ventas: ventasFiltradas,
      productos,
      gastos,
      clientes: []
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-lg font-semibold">Reportes y Análisis</h2>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <span className="text-gray-500">a</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ventas Totales</p>
                <p className="text-2xl font-bold text-primary-600">{formatCurrency(stats.totalVentas, config.moneda)}</p>
              </div>
              <div className="p-3 bg-primary-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Número de Ventas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.numVentas}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ticket Promedio</p>
                <p className="text-2xl font-bold text-warning-600">{formatCurrency(stats.ticketPromedio, config.moneda)}</p>
              </div>
              <div className="p-3 bg-warning-100 rounded-lg">
                <FileText className="w-6 h-6 text-warning-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Utilidad Estimada</p>
                <p className="text-2xl font-bold text-success-600">{formatCurrency(stats.utilidad, config.moneda)}</p>
              </div>
              <div className="p-3 bg-success-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas por día */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Día</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ventasPorDia}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="fecha" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => formatCurrency(value, config.moneda)} />
                  <Line type="monotone" dataKey="total" stroke="#2563EB" strokeWidth={2} dot={{ fill: '#2563EB' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Productos por categoría */}
        <Card>
          <CardHeader>
            <CardTitle>Productos por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productosPorCategoria}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {productosPorCategoria.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Métodos de pago */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Método de Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metodosPago}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => formatCurrency(value, config.moneda)} />
                  <Bar dataKey="value" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Exportación */}
        <Card>
          <CardHeader>
            <CardTitle>Exportar Datos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-500 mb-4">Descarga los datos del período seleccionado en diferentes formatos.</p>

            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" onClick={handleExportVentas} className="justify-start" leftIcon={<Download className="w-4 h-4" />}>
                Exportar Ventas a CSV
              </Button>
              <Button variant="outline" onClick={handleExportProductos} className="justify-start" leftIcon={<Download className="w-4 h-4" />}>
                Exportar Inventario a CSV
              </Button>
              <Button variant="primary" onClick={handleExportFullReport} className="justify-start" leftIcon={<FileText className="w-4 h-4" />}>
                Generar Reporte Completo (JSON)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de ventas recientes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Ventas del Período</CardTitle>
            <Badge variant="secondary">{ventasFiltradas.length} ventas</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Productos</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {ventasFiltradas.slice(0, 10).map((venta) => (
                  <tr key={venta.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{formatShortDate(venta.fecha)}</td>
                    <td className="px-4 py-3 text-sm font-medium">{venta.clienteNombre}</td>
                    <td className="px-4 py-3 text-sm">{venta.productos.length} items</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" size="sm">{venta.metodoPago}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(venta.total, config.moneda)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {ventasFiltradas.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No hay ventas en el período seleccionado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reportes;
