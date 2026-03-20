import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2, Search, Phone, Mail, ShoppingBag } from 'lucide-react';
import { Button, Card, Input, Modal } from '@components/ui';
import { useClienteStore } from '@store/useStore';
import { formatCurrency } from '@utils/helpers';

export const Clientes = () => {
  const { clientes, addCliente, updateCliente, deleteCliente, searchClientes } = useClienteStore();
  const [busqueda, setBusqueda] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    rfc: ''
  });

  const clientesFiltrados = busqueda ? searchClientes(busqueda) : clientes;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCliente) {
      updateCliente(editingCliente.id, formData);
    } else {
      addCliente(formData);
    }
    closeModal();
  };

  const handleEdit = (cliente) => {
    setEditingCliente(cliente);
    setFormData({
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      email: cliente.email,
      direccion: cliente.direccion || '',
      rfc: cliente.rfc || ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCliente(null);
    setFormData({ nombre: '', telefono: '', email: '', direccion: '', rfc: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar clientes..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
          />
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Nuevo Cliente
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clientesFiltrados.map((cliente) => (
          <Card key={cliente.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{cliente.nombre}</h3>
                  <p className="text-sm text-gray-500">{cliente.telefono}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(cliente)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteCliente(cliente.id)}>
                  <Trash2 className="w-4 h-4 text-danger-500" />
                </Button>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Total Gastado</p>
                <p className="font-semibold text-primary-600">{formatCurrency(cliente.totalGastado)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Compras</p>
                <p className="font-semibold">{cliente.numeroCompras}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {clientesFiltrados.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No hay clientes registrados</p>
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>Cancelar</Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingCliente ? 'Guardar' : 'Crear'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre Completo"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
          <Input
            label="Teléfono"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Dirección"
            value={formData.direccion}
            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
          />
          <Input
            label="RFC"
            value={formData.rfc}
            onChange={(e) => setFormData({ ...formData, rfc: e.target.value })}
          />
        </form>
      </Modal>
    </div>
  );
};

export default Clientes;
