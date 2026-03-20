import React, { useState } from 'react';
import { Warehouse, ArrowRight, Package, Upload, Plus, Minus, History } from 'lucide-react';
import { Button, Card, Input, Badge, Modal } from '@components/ui';
import { useProductStore } from '@store/useStore';
import { formatCurrency } from '@utils/helpers';

export const Bodega = () => {
  const { productos, updateStock } = useProductStore();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [movimiento, setMovimiento] = useState({ tipo: 'entrada', cantidad: '', motivo: '' });
  const [showModal, setShowModal] = useState(false);

  const handleMovimiento = () => {
    if (!selectedProduct || !movimiento.cantidad) return;

    const cantidad = parseInt(movimiento.cantidad);
    if (movimiento.tipo === 'entrada') {
      updateStock(selectedProduct.id, cantidad, 'entrada');
    } else {
      updateStock(selectedProduct.id, cantidad, 'salida');
    }

    setShowModal(false);
    setSelectedProduct(null);
    setMovimiento({ tipo: 'entrada', cantidad: '', motivo: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Control de Bodega</h2>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<History className="w-4 h-4" />}>
            Historial
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Warehouse className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total en Bodega</p>
              <p className="text-2xl font-bold">{productos.reduce((sum, p) => sum + p.stock, 0)}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b">
          <h3 className="font-semibold">Productos</h3>
        </div>
        <div className="divide-y">
          {productos.map((producto) => (
            <div key={producto.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                  {producto.imagen ? (
                    <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium">{producto.nombre}</p>
                  <p className="text-sm text-gray-500">Stock: {producto.stock} {producto.unidad}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => { setSelectedProduct(producto); setMovimiento({ ...movimiento, tipo: 'entrada' }); setShowModal(true); }}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Entrada
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => { setSelectedProduct(producto); setMovimiento({ ...movimiento, tipo: 'salida' }); setShowModal(true); }}
                  leftIcon={<Minus className="w-4 h-4" />}
                >
                  Salida
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`${movimiento.tipo === 'entrada' ? 'Entrada' : 'Salida'} de Bodega`}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleMovimiento}>Confirmar</Button>
          </>
        }
      >
        {selectedProduct && (
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">{selectedProduct.nombre}</p>
              <p className="text-sm text-gray-500">Stock actual: {selectedProduct.stock} {selectedProduct.unidad}</p>
            </div>
            <Input
              label="Cantidad"
              type="number"
              value={movimiento.cantidad}
              onChange={(e) => setMovimiento({ ...movimiento, cantidad: e.target.value })}
              placeholder={`Cantidad a ${movimiento.tipo === 'entrada' ? 'agregar' : 'retirar'}`}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
              <textarea
                value={movimiento.motivo}
                onChange={(e) => setMovimiento({ ...movimiento, motivo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                placeholder="Motivo del movimiento..."
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Bodega;
