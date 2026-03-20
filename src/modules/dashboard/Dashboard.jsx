import React, { useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@components/ui';
import { useVentaStore, useProductStore, useGastoStore, useConfigStore } from '@store/useStore';
import { formatCurrency, formatShortDate } from '@utils/helpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#2563EB', '#16A34A', '#F59E0B', '#EF4444', '#8B5CF6'];

export const Dashboard = () => {
  const { ventas, getVentasHoy, getTotalVentasHoy, getProductosMasVendidos, getStats } = useVentaStore();
  const { productos, getProductosBajoStock } = useProductStore();
  const { getTotalGastosHoy } = useGastoStore();
  const { config } = useConfigStore();

  // Cargar datos demo si es necesario
  useEffect(() => {
    if (productos.length === 0) {
      useProductStore.getState().loadDemoData();
    }
  }, [productos.length]);

  const stats = useMemo(() => {
    const ventasHoy = getVentasHoy();
    const totalVentas = getTotalVentasHoy();
    const totalGastos = getTotalGastosHoy();
    const globalStats = getStats();
    const productosBajoStock = getProductosBajoStock();
    const masVendidos = getProductosMasVendidos(5);

    return {
      ventasHoy: ventasHoy.length,
      totalVentas,
      totalGastos,
      utilidad: totalVentas - totalGastos,
      ticketPromedio: globalStats.ticketPromedio,
      productosBajoStock: productosBajoStock.length,
      totalProductos: productos.length,
      masVendidos,
      productosAlerta: productosBajoStock.slice(0, 5)
    };
  }, [ventas, productos, getVentasHoy, getTotalVentasHoy, getTotalGastosHoy, getStats, getProductosBajoStock, getProductosMasVendidos]);

  // Datos para gráfica de ventas por hora (últimas 8 horas)
  const ventasPorHora = useMemo(() => {
    const data = [];
    const ahora = new Date();
    for (let i = 7; i >= 0; i--) {
      const hora = new Date(ahora.getTime() - i * 60 * 60 * 1000);
      const horaStr = hora.getHours() + ':00';
      const ventasEnHora = ventas.filter(v => {
        const vHora = new Date(v.fecha);
        return vHora.getHours() === hora.getHours() && v.estado === 'completada';
      }).reduce((sum, v) => sum + v.total, 0);
      data.push({ hora: horaStr, ventas: ventasEnHora });
    }
    return data;
  }, [ventas]);

  // Datos para gráfica de productos más vendidos
  const datosMasVendidos = useMemo(() => {
    return stats.masVendidos.map(p => ({
      nombre: p.nombre.length > 20 ? p.nombre.substring(0, 20) + '...' : p.nombre,
      cantidad: p.cantidadTotal
    }));
  }, [stats.masVendidos]);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ventas Hoy</p>
                <p className="text-2xl font-bold text-gray-900">{stats.ventasHoy}</p>
                <p className="text-xs text-success-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% vs ayer
                </p>
              </div>
              <div className="p-3 bg-primary-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ingresos Hoy</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.totalVentas, config.moneda)}
                </p>
                <p className="text-xs text-success-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8% vs ayer
                </p>
              </div>
              <div className="p-3 bg-success-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-success-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ticket Promedio</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.ticketPromedio, config.moneda)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Por transacción
                </p>
              </div>
              <div className="p-3 bg-warning-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-warning-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Alertas Stock</p>
                <p className="text-2xl font-bold text-gray-900">{stats.productosBajoStock}</p>
                <p className="text-xs text-danger-600 flex items-center mt-1">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Requieren atención
                </p>
              </div>
              <div className="p-3 bg-danger-100 rounded-lg">
                <Package className="w-6 h-6 text-danger-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas por hora */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Hora</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ventasPorHora}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="hora" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value, config.moneda)}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ventas" 
                    stroke="#2563EB" 
                    strokeWidth={2}
                    dot={{ fill: '#2563EB', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Productos más vendidos */}
        <Card>
          <CardHeader>
            <CardTitle>Productos Más Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datosMasVendidos} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#6b7280" fontSize={12} />
                  <YAxis dataKey="nombre" type="category" stroke="#6b7280" fontSize={11} width={100} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <Bar dataKey="cantidad" fill="#2563EB" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas y Últimos Movimientos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas de Stock Bajo */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-danger-500" />
                Alertas de Stock Bajo
              </CardTitle>
              <Badge variant="danger" size="sm">{stats.productosBajoStock} productos</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.productosAlerta.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No hay alertas de stock</p>
              ) : (
                stats.productosAlerta.map((producto) => (
                  <div key={producto.id} className="flex items-center justify-between p-3 bg-danger-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded border flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{producto.nombre}</p>
                        <p className="text-xs text-gray-500">{producto.categoria}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-danger-600">
                        {producto.stock} {producto.unidad}
                      </p>
                      <p className="text-xs text-gray-500">Min: {producto.stockMinimo}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Últimas Ventas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Últimas Ventas</CardTitle>
              <Button variant="ghost" size="sm">Ver todas</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ventas.slice(0, 5).map((venta) => (
                <div key={venta.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{venta.clienteNombre}</p>
                    <p className="text-xs text-gray-500">
                      {venta.productos.length} productos • {formatShortDate(venta.fecha)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600">
                      {formatCurrency(venta.total, config.moneda)}
                    </p>
                    <Badge variant="success" size="sm">{venta.metodoPago}</Badge>
                  </div>
                </div>
              ))}
              {ventas.length === 0 && (
                <p className="text-center text-gray-500 py-4">No hay ventas registradas</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
