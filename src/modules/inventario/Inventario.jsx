import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit2, Trash2, Package, Upload, X, AlertTriangle, Filter } from 'lucide-react';
import { Button, Card, Input, Badge, Modal } from '@components/ui';
import { useProductStore, useConfigStore } from '@store/useStore';
import { formatCurrency, compressImage } from '@utils/helpers';

const UNIDADES = ['pieza', 'kilo', 'litro', 'gramo', 'metro'];

export const Inventario = () => {
  const { productos, categorias, addProducto, updateProducto, deleteProducto, searchProductos, loadDemoData } = useProductStore();
  const { config } = useConfigStore();

  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    categoria: '',
    marca: '',
    costo: '',
    precio: '',
    stock: '',
    stockMinimo: '',
    unidad: 'pieza',
    imagen: null,
    proveedorId: ''
  });

  // Cargar datos demo si no hay productos
  useEffect(() => {
    if (productos.length === 0) {
      loadDemoData();
    }
  }, [productos.length, loadDemoData]);

  const productosFiltrados = React.useMemo(() => {
    let resultados = busqueda ? searchProductos(busqueda) : productos;
    if (filtroCategoria !== 'todas') {
      resultados = resultados.filter(p => p.categoria === filtroCategoria);
    }
    return resultados;
  }, [busqueda, filtroCategoria, productos, searchProductos]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar 5MB');
      return;
    }

    try {
      const compressed = await compressImage(file, 800, 0.8);
      setPreviewImage(compressed);
      setFormData(prev => ({ ...prev, imagen: compressed }));
    } catch (error) {
      console.error('Error al procesar imagen:', error);
      alert('Error al procesar la imagen');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const productoData = {
      ...formData,
      costo: parseFloat(formData.costo) || 0,
      precio: parseFloat(formData.precio) || 0,
      stock: parseInt(formData.stock) || 0,
      stockMinimo: parseInt(formData.stockMinimo) || 0,
    };

    if (editingProduct) {
      updateProducto(editingProduct.id, productoData);
    } else {
      addProducto(productoData);
    }

    closeModal();
  };

  const handleEdit = (producto) => {
    setEditingProduct(producto);
    setFormData({
      nombre: producto.nombre,
      codigo: producto.codigo,
      categoria: producto.categoria,
      marca: producto.marca || '',
      costo: producto.costo.toString(),
      precio: producto.precio.toString(),
      stock: producto.stock.toString(),
      stockMinimo: producto.stockMinimo.toString(),
      unidad: producto.unidad,
      imagen: producto.imagen,
      proveedorId: producto.proveedorId || ''
    });
    setPreviewImage(producto.imagen);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      deleteProducto(id);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setPreviewImage(null);
    setFormData({
      nombre: '',
      codigo: '',
      categoria: '',
      marca: '',
      costo: '',
      precio: '',
      stock: '',
      stockMinimo: '',
      unidad: 'pieza',
      imagen: null,
      proveedorId: ''
    });
  };

  const openNewProduct = () => {
    setEditingProduct(null);
    setPreviewImage(null);
    setFormData({
      nombre: '',
      codigo: '',
      categoria: categorias[0] || '',
      marca: '',
      costo: '',
      precio: '',
      stock: '',
      stockMinimo: '',
      unidad: 'pieza',
      imagen: null,
      proveedorId: ''
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar productos..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
            />
          </div>
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <Button variant="primary" onClick={openNewProduct} leftIcon={<Plus className="w-4 h-4" />}>
          Nuevo Producto
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Package className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Productos</p>
              <p className="text-xl font-bold">{productos.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-danger-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-danger-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Stock Bajo</p>
              <p className="text-xl font-bold text-danger-600">
                {productos.filter(p => p.stock <= p.stockMinimo).length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success-100 rounded-lg">
              <Package className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Valor Inventario</p>
              <p className="text-xl font-bold">
                {formatCurrency(productos.reduce((sum, p) => sum + (p.costo * p.stock), 0), config.moneda)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabla de Productos */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productosFiltrados.map((producto) => (
                <tr key={producto.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {producto.imagen ? (
                          <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{producto.nombre}</p>
                        {producto.marca && <p className="text-xs text-gray-500">{producto.marca}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-mono">{producto.codigo}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" size="sm">{producto.categoria}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium">
                    {formatCurrency(producto.precio, config.moneda)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-sm font-medium ${
                      producto.stock <= producto.stockMinimo ? 'text-danger-600' : 'text-success-600'
                    }`}>
                      {producto.stock} {producto.unidad}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(producto)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(producto.id)}>
                        <Trash2 className="w-4 h-4 text-danger-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {productosFiltrados.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No se encontraron productos</p>
          </div>
        )}
      </Card>

      {/* Modal de Producto */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>Cancelar</Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Imagen */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del Producto</label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <Upload className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{previewImage ? 'Cambiar imagen' : 'Subir imagen'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {previewImage && (
                    <button
                      type="button"
                      onClick={() => { setPreviewImage(null); setFormData(prev => ({ ...prev, imagen: null })); }}
                      className="mt-2 text-sm text-danger-600 hover:text-danger-700 flex items-center gap-1"
                    >
                      <X className="w-4 h-4" /> Eliminar imagen
                    </button>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Máximo 5MB. Formatos: JPG, PNG, WEBP</p>
                </div>
              </div>
            </div>

            <Input
              label="Nombre del Producto"
              value={formData.nombre}
              onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
              required
            />
            <Input
              label="Código / SKU"
              value={formData.codigo}
              onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <Input
              label="Marca"
              value={formData.marca}
              onChange={(e) => setFormData(prev => ({ ...prev, marca: e.target.value }))}
            />
            <Input
              label="Costo"
              type="number"
              step="0.01"
              value={formData.costo}
              onChange={(e) => setFormData(prev => ({ ...prev, costo: e.target.value }))}
              required
            />
            <Input
              label="Precio de Venta"
              type="number"
              step="0.01"
              value={formData.precio}
              onChange={(e) => setFormData(prev => ({ ...prev, precio: e.target.value }))}
              required
            />
            <Input
              label="Stock Actual"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
              required
            />
            <Input
              label="Stock Mínimo"
              type="number"
              value={formData.stockMinimo}
              onChange={(e) => setFormData(prev => ({ ...prev, stockMinimo: e.target.value }))}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unidad de Medida</label>
              <select
                value={formData.unidad}
                onChange={(e) => setFormData(prev => ({ ...prev, unidad: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {UNIDADES.map(u => (
                  <option key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Inventario;
