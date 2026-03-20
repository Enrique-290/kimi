import React, { useState, useRef } from 'react';
import { Settings, Store, Upload, Save, Trash2 } from 'lucide-react';
import { Button, Card, Input } from '@components/ui';
import { useConfigStore } from '@store/useStore';
import { compressImage } from '@utils/helpers';

export const Configuracion = () => {
  const { config, updateConfig, resetConfig } = useConfigStore();
  const [formData, setFormData] = useState(config);
  const [logoPreview, setLogoPreview] = useState(config.logo);
  const fileInputRef = useRef(null);

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    try {
      const compressed = await compressImage(file, 400, 0.8);
      setLogoPreview(compressed);
      setFormData(prev => ({ ...prev, logo: compressed }));
    } catch (error) {
      console.error('Error al procesar logo:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateConfig(formData);
    alert('Configuración guardada exitosamente');
  };

  const handleReset = () => {
    if (confirm('¿Restaurar configuración por defecto?')) {
      resetConfig();
      setFormData(config);
      setLogoPreview(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Configuración del Sistema</h2>
        <Button variant="outline" onClick={handleReset} leftIcon={<Trash2 className="w-4 h-4" />}>
          Restaurar Default
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo y Nombre */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Store className="w-5 h-5 text-primary-600" />
            Información del Negocio
          </h3>

          <div className="space-y-4">
            {/* Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo del Negocio</label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Store className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    leftIcon={<Upload className="w-4 h-4" />}
                  >
                    {logoPreview ? 'Cambiar Logo' : 'Subir Logo'}
                  </Button>
                  {logoPreview && (
                    <button
                      type="button"
                      onClick={() => { setLogoPreview(null); setFormData(prev => ({ ...prev, logo: null })); }}
                      className="block mt-2 text-sm text-danger-600 hover:text-danger-700"
                    >
                      Eliminar logo
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre del Negocio"
                value={formData.nombreNegocio}
                onChange={(e) => setFormData({ ...formData, nombreNegocio: e.target.value })}
                required
              />
              <Input
                label="Teléfono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                label="RFC"
                value={formData.rfc}
                onChange={(e) => setFormData({ ...formData, rfc: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <textarea
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={2}
              />
            </div>
          </div>
        </Card>

        {/* Configuración de Ticket */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Configuración de Ticket</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje del Ticket</label>
              <textarea
                value={formData.ticketMensaje}
                onChange={(e) => setFormData({ ...formData, ticketMensaje: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={2}
                placeholder="Ej: ¡Gracias por su compra!"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Símbolo de Moneda"
                value={formData.moneda}
                onChange={(e) => setFormData({ ...formData, moneda: e.target.value })}
                placeholder="$"
              />
              <Input
                label="Impuesto %"
                type="number"
                value={formData.impuestoPorcentaje}
                onChange={(e) => setFormData({ ...formData, impuestoPorcentaje: parseFloat(e.target.value) })}
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="lg" leftIcon={<Save className="w-5 h-5" />}>
            Guardar Configuración
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Configuracion;
