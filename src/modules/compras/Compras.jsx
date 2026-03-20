import React from 'react';
import { ShoppingBag, Construction } from 'lucide-react';
import { Card } from '@components/ui';

export const Compras = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Compras a Proveedores</h2>
      <Card className="p-12 text-center">
        <Construction className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Módulo en Desarrollo</h3>
        <p className="text-gray-500">El módulo de compras estará disponible próximamente.</p>
      </Card>
    </div>
  );
};

export default Compras;
