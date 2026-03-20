import React, { useState } from 'react';
import { Receipt, Plus, Trash2, Calendar } from 'lucide-react';
import { Button, Card, Input, Badge } from '@components/ui';
import { useGastoStore, useConfigStore } from '@store/useStore';
import { formatCurrency, formatShortDate } from '@utils/helpers';

const CATEGORIAS = ['servicios', 'nomina', 'renta', 'mantenimiento', 'suministros', 'otros'];

export const Gastos = () => {
  const { gastos, addGasto, deleteGasto } = useGastoStore();
  const { config } = useConfigStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    concepto: '',
    categoria: 'otros',
    monto: '',
    metodoPago: 'efectivo',
    notas: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addGasto({
      ...formData,
      monto: parseFloat(formData.monto)
    });
    setShowForm(false);
    setFormData({ concepto: '', categoria: 'otros', monto: '', metodoPago: 'efectivo', notas: '' });
  };

  const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Registro de Gastos</h2>
        <Button variant="primary" onClick={() => setShowForm(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Nuevo Gasto
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Gastos</p>
            <p className="text-3xl font-bold text-danger-600">{formatCurrency(totalGastos, config.moneda)}</p>
          </div>
          <div className="p-3 bg-danger-100 rounded-lg">
            <Receipt className="w-8 h-8 text-danger-600" />
          </div>
        </div>
      </Card>

      {showForm && (
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              label="Concepto"
              value={formData.concepto}
              onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {CATEGORIAS.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>
            <Input
              label="Monto"
              type="number"
              step="0.01"
              value={formData.monto}
              onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
              required
            />
            <div className="flex items-end gap-2">
              <Button type="submit" variant="primary" className="flex-1">Guardar</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <div className="divide-y">
          {gastos.map((gasto) => (
            <div key={gasto.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-danger-100 rounded-lg">
                  <Receipt className="w-5 h-5 text-danger-600" />
                </div>
                <div>
                  <p className="font-medium">{gasto.concepto}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Badge variant="secondary" size="sm">{gasto.categoria}</Badge>
                    <span>•</span>
                    <span>{formatShortDate(gasto.fecha)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-danger-600">{formatCurrency(gasto.monto, config.moneda)}</span>
                <Button variant="ghost" size="icon" onClick={() => deleteGasto(gasto.id)}>
                  <Trash2 className="w-4 h-4 text-danger-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        {gastos.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Receipt className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No hay gastos registrados</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Gastos;
