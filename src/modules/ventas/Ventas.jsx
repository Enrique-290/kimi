import React, { useState, useEffect, useCallback } from 'react';
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote, Smartphone, Receipt, X, User, Package } from 'lucide-react';
import { Button, Card, Input, Badge, Modal } from '@components/ui';
import { useVentaStore, useProductStore, useClienteStore, useConfigStore } from '@store/useStore';
import { useBarcodeScanner } from '@hooks/useKeyboard';
import { formatCurrency, calculateChange } from '@utils/helpers';

const METODOS_PAGO = [
  { id: 'efectivo', label: 'Efectivo', icon: Banknote },
  { id: 'transferencia', label: 'Transferencia', icon: Smartphone },
  { id: 'tarjeta', label: 'Tarjeta', icon: CreditCard },
  { id: 'otro', label: 'Otro', icon: Receipt },
];

export const Ventas = () => {
  const { 
    ventaActual, 
    iniciarVenta, 
    agregarProducto, 
    quitarProducto, 
    actualizarCantidad,
    setMetodoPago,
    setPagoCon,
    finalizarVenta,
    cancelarVenta 
  } = useVentaStore();

  const { productos, searchProductos, updateStock, loadDemoData } = useProductStore();
  const { clientes, searchClientes } = useClienteStore();
  const { config } = useConfigStore();

  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [showTicket, setShowTicket] = useState(false);
  const [ventaCompletada, setVentaCompletada] = useState(null);
  const [clienteBusqueda, setClienteBusqueda] = useState('');
  const [showClientes, setShowClientes] = useState(false);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);

  // Escáner de código de barras
  useBarcodeScanner((codigo) => {
    const producto = useProductStore.getState().getProductoByCodigo(codigo);
    if (producto) {
      handleAgregarProducto(producto);
    } else {
      alert(`Producto con código ${codigo} no encontrado`);
    }
  });

  // Inicializar venta si no existe
  useEffect(() => {
    if (!ventaActual) {
      iniciarVenta();
    }
  }, []);

  // Cargar datos demo si no hay productos
  useEffect(() => {
    if (productos.length === 0) {
      loadDemoData();
    }
  }, [productos.length, loadDemoData]);

  // Búsqueda de productos
  useEffect(() => {
    if (busqueda.trim()) {
      const results = searchProductos(busqueda);
      setResultados(results.slice(0, 8));
    } else {
      setResultados(productos.slice(0, 8));
    }
  }, [busqueda, productos, searchProductos]);

  // Búsqueda de clientes
  useEffect(() => {
    if (clienteBusqueda.trim()) {
      setClientesFiltrados(searchClientes(clienteBusqueda));
    } else {
      setClientesFiltrados(clientes.slice(0, 5));
    }
  }, [clienteBusqueda, clientes, searchClientes]);

  const handleAgregarProducto = useCallback((producto) => {
    if (producto.stock <= 0) {
      alert('Producto sin stock disponible');
      return;
    }
    agregarProducto(producto);
    setBusqueda('');
  }, [agregarProducto]);

  const handleFinalizarVenta = useCallback(() => {
    if (!ventaActual || ventaActual.productos.length === 0) return;

    // Descontar stock
    ventaActual.productos.forEach(item => {
      updateStock(item.productoId, item.cantidad, 'salida');
    });

    const venta = finalizarVenta();
    if (venta) {
      setVentaCompletada(venta);
      setShowTicket(true);
    }
  }, [ventaActual, finalizarVenta, updateStock]);

  const handleNuevaVenta = useCallback(() => {
    setShowTicket(false);
    setVentaCompletada(null);
    iniciarVenta();
  }, [iniciarVenta]);

  const handleSelectCliente = useCallback((cliente) => {
    const { ventaActual } = useVentaStore.getState();
    if (ventaActual) {
      useVentaStore.setState({
        ventaActual: {
          ...ventaActual,
          clienteId: cliente.id,
          clienteNombre: cliente.nombre
        }
      });
    }
    setShowClientes(false);
    setClienteBusqueda('');
  }, []);

  if (!ventaActual) return null;

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Panel Izquierdo - Catálogo */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Barra de búsqueda */}
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o código de barras..."
              className="w-full pl-10 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
          </div>
        </Card>

        {/* Grid de productos */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {resultados.map((producto) => (
              <button
                key={producto.id}
                onClick={() => handleAgregarProducto(producto)}
                disabled={producto.stock <= 0}
                className={`bg-white rounded-lg border p-3 text-left transition-all hover:shadow-md hover:border-primary-300 ${
                  producto.stock <= 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
                  {producto.imagen ? (
                    <img 
                      src={producto.imagen} 
                      alt={producto.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-sm text-gray-900 line-clamp-2">{producto.nombre}</h3>
                <p className="text-lg font-bold text-primary-600 mt-1">
                  {formatCurrency(producto.precio, config.moneda)}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant={producto.stock <= producto.stockMinimo ? 'danger' : 'success'} size="sm">
                    Stock: {producto.stock} {producto.unidad}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Panel Derecho - Carrito */}
      <div className="w-96 flex flex-col gap-4">
        {/* Cliente */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-sm">{ventaActual.clienteNombre}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowClientes(true)}
            >
              Cambiar
            </Button>
          </div>
        </Card>

        {/* Items del carrito */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary-600" />
              <h2 className="font-semibold">Carrito ({ventaActual.productos.length})</h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {ventaActual.productos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Agrega productos al carrito</p>
              </div>
            ) : (
              ventaActual.productos.map((item) => (
                <div key={item.productoId} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 bg-white rounded border overflow-hidden flex-shrink-0">
                    {item.imagen ? (
                      <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 truncate">{item.nombre}</h4>
                    <p className="text-primary-600 font-semibold">
                      {formatCurrency(item.precioUnitario, config.moneda)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => actualizarCantidad(item.productoId, Math.max(1, item.cantidad - 1))}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.cantidad}</span>
                      <button
                        onClick={() => actualizarCantidad(item.productoId, item.cantidad + 1)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(item.subtotal, config.moneda)}</p>
                    <button
                      onClick={() => quitarProducto(item.productoId)}
                      className="p-1 text-danger-500 hover:bg-danger-50 rounded mt-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Totales y Pago */}
        <Card className="p-4 space-y-4">
          {/* Método de pago */}
          <div className="grid grid-cols-2 gap-2">
            {METODOS_PAGO.map((metodo) => {
              const Icon = metodo.icon;
              return (
                <button
                  key={metodo.id}
                  onClick={() => setMetodoPago(metodo.id)}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-sm font-medium transition-all ${
                    ventaActual.metodoPago === metodo.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {metodo.label}
                </button>
              );
            })}
          </div>

          {/* Totales */}
          <div className="space-y-2 pt-2 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(ventaActual.subtotal, config.moneda)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary-600">{formatCurrency(ventaActual.total, config.moneda)}</span>
            </div>
          </div>

          {/* Pago en efectivo */}
          {ventaActual.metodoPago === 'efectivo' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Paga con:</span>
                <input
                  type="number"
                  value={ventaActual.pagoCon || ''}
                  onChange={(e) => setPagoCon(parseFloat(e.target.value) || 0)}
                  className="flex-1 px-3 py-1 border border-gray-300 rounded text-right"
                  placeholder="0.00"
                />
              </div>
              {ventaActual.cambio > 0 && (
                <div className="flex justify-between text-sm bg-success-50 p-2 rounded">
                  <span className="text-success-700">Cambio:</span>
                  <span className="font-bold text-success-700">
                    {formatCurrency(ventaActual.cambio, config.moneda)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Botones de acción */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button 
              variant="outline" 
              onClick={cancelarVenta}
              className="w-full"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              variant="primary"
              onClick={handleFinalizarVenta}
              disabled={ventaActual.productos.length === 0}
              className="w-full"
            >
              <Receipt className="w-4 h-4 mr-2" />
              Cobrar
            </Button>
          </div>
        </Card>
      </div>

      {/* Modal de selección de cliente */}
      <Modal
        isOpen={showClientes}
        onClose={() => setShowClientes(false)}
        title="Seleccionar Cliente"
        size="md"
      >
        <div className="space-y-4">
          <Input
            placeholder="Buscar cliente..."
            value={clienteBusqueda}
            onChange={(e) => setClienteBusqueda(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <button
              onClick={() => handleSelectCliente({ id: null, nombre: 'Cliente General' })}
              className="w-full p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200"
            >
              <span className="font-medium">Cliente General</span>
              <p className="text-sm text-gray-500">Venta rápida sin registrar</p>
            </button>
            {clientesFiltrados.map((cliente) => (
              <button
                key={cliente.id}
                onClick={() => handleSelectCliente(cliente)}
                className="w-full p-3 text-left hover:bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="font-medium">{cliente.nombre}</span>
                <p className="text-sm text-gray-500">{cliente.telefono}</p>
              </button>
            ))}
          </div>
        </div>
      </Modal>

      {/* Modal de Ticket */}
      <Modal
        isOpen={showTicket}
        onClose={handleNuevaVenta}
        title="Venta Completada"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={handleNuevaVenta}>
              Nueva Venta
            </Button>
            <Button variant="primary" onClick={() => window.print()}>
              Imprimir Ticket
            </Button>
          </>
        }
      >
        {ventaCompletada && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-bold text-lg">{config.nombreNegocio}</h3>
              <p className="text-sm text-gray-500">{config.direccion}</p>
              <p className="text-sm text-gray-500">{config.telefono}</p>
            </div>
            <div className="border-t border-b py-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Ticket:</span>
                <span className="font-mono">#{ventaCompletada.id.slice(-6)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Fecha:</span>
                <span>{new Date(ventaCompletada.fecha).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Cliente:</span>
                <span>{ventaCompletada.clienteNombre}</span>
              </div>
            </div>
            <div className="space-y-1">
              {ventaCompletada.productos.map((item) => (
                <div key={item.productoId} className="flex justify-between text-sm">
                  <span>{item.cantidad}x {item.nombre}</span>
                  <span>{formatCurrency(item.subtotal, config.moneda)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2 space-y-1">
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{formatCurrency(ventaCompletada.total, config.moneda)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pago ({ventaCompletada.metodoPago}):</span>
                <span>{formatCurrency(ventaCompletada.pagoCon || ventaCompletada.total, config.moneda)}</span>
              </div>
              {ventaCompletada.cambio > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Cambio:</span>
                  <span>{formatCurrency(ventaCompletada.cambio, config.moneda)}</span>
                </div>
              )}
            </div>
            <p className="text-center text-sm text-gray-500">{config.ticketMensaje}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Ventas;
