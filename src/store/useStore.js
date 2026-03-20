import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId, saveToStorage, loadFromStorage } from '@utils/helpers';
import { STORAGE_KEYS, DEFAULT_CONFIG, CATEGORIAS_DEFAULT, METODOS_PAGO, ESTADOS_VENTA } from '@utils/constants';
import { validateProduct } from '@utils/validations';

// Store de Configuración
export const useConfigStore = create(
  persist(
    (set, get) => ({
      config: {
        nombreNegocio: 'Mi Tienda',
        logo: null,
        direccion: '',
        telefono: '',
        email: '',
        rfc: '',
        ticketMensaje: '¡Gracias por su compra!',
        moneda: '$',
        metodosPago: Object.values(METODOS_PAGO),
        impuestoPorcentaje: 16,
        tema: 'claro'
      },

      updateConfig: (newConfig) => set((state) => ({
        config: { ...state.config, ...newConfig }
      })),

      resetConfig: () => set({
        config: {
          nombreNegocio: 'Mi Tienda',
          logo: null,
          direccion: '',
          telefono: '',
          email: '',
          rfc: '',
          ticketMensaje: '¡Gracias por su compra!',
          moneda: '$',
          metodosPago: Object.values(METODOS_PAGO),
          impuestoPorcentaje: 16,
          tema: 'claro'
        }
      })
    }),
    {
      name: STORAGE_KEYS.CONFIG
    }
  )
);

// Store de Productos (Inventario)
export const useProductStore = create(
  persist(
    (set, get) => ({
      productos: [],
      categorias: CATEGORIAS_DEFAULT,

      addProducto: (productoData) => {
        const nuevoProducto = {
          id: generateId(),
          ...productoData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        set((state) => ({
          productos: [...state.productos, nuevoProducto]
        }));
        return nuevoProducto;
      },

      updateProducto: (id, updates) => {
        set((state) => ({
          productos: state.productos.map(p => 
            p.id === id 
              ? { ...p, ...updates, updatedAt: new Date().toISOString() }
              : p
          )
        }));
      },

      deleteProducto: (id) => {
        set((state) => ({
          productos: state.productos.filter(p => p.id !== id)
        }));
      },

      updateStock: (id, cantidad, tipo = 'ajuste') => {
        const producto = get().productos.find(p => p.id === id);
        if (!producto) return;

        const nuevoStock = tipo === 'entrada' 
          ? producto.stock + cantidad 
          : producto.stock - cantidad;

        get().updateProducto(id, { stock: Math.max(0, nuevoStock) });
      },

      getProductoById: (id) => get().productos.find(p => p.id === id),

      getProductoByCodigo: (codigo) => get().productos.find(p => p.codigo === codigo),

      getProductosBajoStock: () => {
        return get().productos.filter(p => p.stock <= p.stockMinimo);
      },

      searchProductos: (term) => {
        const lowerTerm = term.toLowerCase();
        return get().productos.filter(p => 
          p.nombre.toLowerCase().includes(lowerTerm) ||
          p.codigo.toLowerCase().includes(lowerTerm) ||
          p.categoria.toLowerCase().includes(lowerTerm)
        );
      },

      addCategoria: (categoria) => {
        if (!get().categorias.includes(categoria)) {
          set((state) => ({
            categorias: [...state.categorias, categoria]
          }));
        }
      },

      // Datos de ejemplo para desarrollo
      loadDemoData: () => {
        const demoProductos = [
          {
            id: generateId(),
            nombre: 'Arroz Integral 1kg',
            codigo: '7501000123456',
            categoria: 'Abarrotes',
            marca: 'Saman',
            costo: 18.50,
            precio: 25.00,
            stock: 45,
            stockMinimo: 10,
            unidad: 'pieza',
            imagen: null,
            proveedorId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: generateId(),
            nombre: 'Frijol Negro 1kg',
            codigo: '7501000123457',
            categoria: 'Abarrotes',
            marca: 'La Sierra',
            costo: 22.00,
            precio: 32.00,
            stock: 8,
            stockMinimo: 15,
            unidad: 'pieza',
            imagen: null,
            proveedorId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: generateId(),
            nombre: 'Leche Entera 1L',
            codigo: '7501000123458',
            categoria: 'Lácteos',
            marca: 'Lala',
            costo: 14.50,
            precio: 21.00,
            stock: 120,
            stockMinimo: 20,
            unidad: 'pieza',
            imagen: null,
            proveedorId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: generateId(),
            nombre: 'Huevo Blanco 1kg',
            codigo: '7501000123459',
            categoria: 'Lácteos',
            marca: 'San Juan',
            costo: 28.00,
            precio: 42.00,
            stock: 25,
            stockMinimo: 10,
            unidad: 'kilo',
            imagen: null,
            proveedorId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: generateId(),
            nombre: 'Jabón en Barra',
            codigo: '7501000123460',
            categoria: 'Limpieza',
            marca: 'Zote',
            costo: 8.50,
            precio: 15.00,
            stock: 60,
            stockMinimo: 12,
            unidad: 'pieza',
            imagen: null,
            proveedorId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: generateId(),
            nombre: 'Coca-Cola 2L',
            codigo: '7501000123461',
            categoria: 'Bebidas',
            marca: 'Coca-Cola',
            costo: 24.00,
            precio: 38.00,
            stock: 35,
            stockMinimo: 8,
            unidad: 'pieza',
            imagen: null,
            proveedorId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: generateId(),
            nombre: 'Pan Blanco',
            codigo: '7501000123462',
            categoria: 'Abarrotes',
            marca: 'Bimbo',
            costo: 18.00,
            precio: 28.00,
            stock: 15,
            stockMinimo: 10,
            unidad: 'pieza',
            imagen: null,
            proveedorId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: generateId(),
            nombre: 'Aceite Vegetal 1L',
            codigo: '7501000123463',
            categoria: 'Abarrotes',
            marca: '1-2-3',
            costo: 32.00,
            precio: 48.00,
            stock: 40,
            stockMinimo: 8,
            unidad: 'pieza',
            imagen: null,
            proveedorId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        set({ productos: demoProductos });
      }
    }),
    {
      name: STORAGE_KEYS.PRODUCTOS
    }
  )
);

// Store de Ventas
export const useVentaStore = create(
  persist(
    (set, get) => ({
      ventas: [],
      ventaActual: null,

      iniciarVenta: (clienteId = null, clienteNombre = 'Cliente General') => {
        const nuevaVenta = {
          id: generateId(),
          fecha: new Date().toISOString(),
          productos: [],
          subtotal: 0,
          total: 0,
          metodoPago: 'efectivo',
          pagoCon: 0,
          cambio: 0,
          clienteId,
          clienteNombre,
          vendedorId: 'admin',
          estado: ESTADOS_VENTA.EN_PROCESO,
          notas: ''
        };
        set({ ventaActual: nuevaVenta });
        return nuevaVenta;
      },

      agregarProducto: (producto, cantidad = 1) => {
        set((state) => {
          if (!state.ventaActual) return state;

          const productos = [...state.ventaActual.productos];
          const existingIndex = productos.findIndex(p => p.productoId === producto.id);

          if (existingIndex >= 0) {
            productos[existingIndex].cantidad += cantidad;
            productos[existingIndex].subtotal = 
              productos[existingIndex].cantidad * productos[existingIndex].precioUnitario;
          } else {
            productos.push({
              productoId: producto.id,
              nombre: producto.nombre,
              cantidad,
              precioUnitario: producto.precio,
              subtotal: producto.precio * cantidad,
              imagen: producto.imagen,
              unidad: producto.unidad
            });
          }

          const subtotal = productos.reduce((sum, p) => sum + p.subtotal, 0);

          return {
            ventaActual: {
              ...state.ventaActual,
              productos,
              subtotal,
              total: subtotal
            }
          };
        });
      },

      quitarProducto: (productoId) => {
        set((state) => {
          if (!state.ventaActual) return state;

          const productos = state.ventaActual.productos.filter(p => p.productoId !== productoId);
          const subtotal = productos.reduce((sum, p) => sum + p.subtotal, 0);

          return {
            ventaActual: {
              ...state.ventaActual,
              productos,
              subtotal,
              total: subtotal
            }
          };
        });
      },

      actualizarCantidad: (productoId, cantidad) => {
        set((state) => {
          if (!state.ventaActual) return state;

          const productos = state.ventaActual.productos.map(p => {
            if (p.productoId === productoId) {
              return {
                ...p,
                cantidad,
                subtotal: cantidad * p.precioUnitario
              };
            }
            return p;
          });

          const subtotal = productos.reduce((sum, p) => sum + p.subtotal, 0);

          return {
            ventaActual: {
              ...state.ventaActual,
              productos,
              subtotal,
              total: subtotal
            }
          };
        });
      },

      setMetodoPago: (metodoPago) => {
        set((state) => ({
          ventaActual: state.ventaActual ? { ...state.ventaActual, metodoPago } : null
        }));
      },

      setPagoCon: (pagoCon) => {
        set((state) => {
          if (!state.ventaActual) return state;
          const cambio = Math.max(0, pagoCon - state.ventaActual.total);
          return {
            ventaActual: { ...state.ventaActual, pagoCon, cambio }
          };
        });
      },

      finalizarVenta: () => {
        const { ventaActual } = get();
        if (!ventaActual || ventaActual.productos.length === 0) return null;

        const ventaCompletada = {
          ...ventaActual,
          estado: ESTADOS_VENTA.COMPLETADA,
          fecha: new Date().toISOString()
        };

        set((state) => ({
          ventas: [ventaCompletada, ...state.ventas],
          ventaActual: null
        }));

        return ventaCompletada;
      },

      cancelarVenta: () => {
        set({ ventaActual: null });
      },

      getVentasByDate: (fechaInicio, fechaFin) => {
        return get().ventas.filter(v => {
          const fecha = new Date(v.fecha);
          return fecha >= fechaInicio && fecha <= fechaFin && v.estado === 'completada';
        });
      },

      getVentasHoy: () => {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        return get().ventas.filter(v => {
          const fecha = new Date(v.fecha);
          return fecha >= hoy && v.estado === 'completada';
        });
      },

      getTotalVentasHoy: () => {
        return get().getVentasHoy().reduce((sum, v) => sum + v.total, 0);
      },

      getProductosMasVendidos: (limit = 5) => {
        const productosCount = {};
        get().ventas
          .filter(v => v.estado === 'completada')
          .forEach(v => {
            v.productos.forEach(p => {
              if (!productosCount[p.productoId]) {
                productosCount[p.productoId] = { ...p, totalVendido: 0, cantidadTotal: 0 };
              }
              productosCount[p.productoId].cantidadTotal += p.cantidad;
              productosCount[p.productoId].totalVendido += p.subtotal;
            });
          });

        return Object.values(productosCount)
          .sort((a, b) => b.cantidadTotal - a.cantidadTotal)
          .slice(0, limit);
      },

      getStats: () => {
        const ventasCompletadas = get().ventas.filter(v => v.estado === 'completada');
        const totalVentas = ventasCompletadas.length;
        const ingresosTotales = ventasCompletadas.reduce((sum, v) => sum + v.total, 0);
        const ticketPromedio = totalVentas > 0 ? ingresosTotales / totalVentas : 0;

        return { totalVentas, ingresosTotales, ticketPromedio };
      }
    }),
    {
      name: STORAGE_KEYS.VENTAS
    }
  )
);

// Store de Clientes
export const useClienteStore = create(
  persist(
    (set, get) => ({
      clientes: [],

      addCliente: (clienteData) => {
        const nuevoCliente = {
          id: generateId(),
          ...clienteData,
          totalGastado: 0,
          numeroCompras: 0,
          createdAt: new Date().toISOString()
        };
        set((state) => ({
          clientes: [...state.clientes, nuevoCliente]
        }));
        return nuevoCliente;
      },

      updateCliente: (id, updates) => {
        set((state) => ({
          clientes: state.clientes.map(c => 
            c.id === id ? { ...c, ...updates } : c
          )
        }));
      },

      deleteCliente: (id) => {
        set((state) => ({
          clientes: state.clientes.filter(c => c.id !== id)
        }));
      },

      getClienteById: (id) => get().clientes.find(c => c.id === id),

      searchClientes: (term) => {
        const lowerTerm = term.toLowerCase();
        return get().clientes.filter(c => 
          c.nombre.toLowerCase().includes(lowerTerm) ||
          c.telefono.includes(term) ||
          (c.email && c.email.toLowerCase().includes(lowerTerm))
        );
      },

      updateStats: (clienteId, monto) => {
        set((state) => ({
          clientes: state.clientes.map(c => 
            c.id === clienteId 
              ? { 
                  ...c, 
                  totalGastado: c.totalGastado + monto,
                  numeroCompras: c.numeroCompras + 1
                } 
              : c
          )
        }));
      }
    }),
    {
      name: STORAGE_KEYS.CLIENTES
    }
  )
);

// Store de Gastos
export const useGastoStore = create(
  persist(
    (set, get) => ({
      gastos: [],

      addGasto: (gastoData) => {
        const nuevoGasto = {
          id: generateId(),
          ...gastoData,
          fecha: new Date().toISOString()
        };
        set((state) => ({
          gastos: [nuevoGasto, ...state.gastos]
        }));
        return nuevoGasto;
      },

      deleteGasto: (id) => {
        set((state) => ({
          gastos: state.gastos.filter(g => g.id !== id)
        }));
      },

      getGastosByDate: (fechaInicio, fechaFin) => {
        return get().gastos.filter(g => {
          const fecha = new Date(g.fecha);
          return fecha >= fechaInicio && fecha <= fechaFin;
        });
      },

      getTotalGastosHoy: () => {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        return get().gastos
          .filter(g => new Date(g.fecha) >= hoy)
          .reduce((sum, g) => sum + g.monto, 0);
      },

      getGastosByCategoria: () => {
        const grouped = {};
        get().gastos.forEach(g => {
          grouped[g.categoria] = (grouped[g.categoria] || 0) + g.monto;
        });
        return grouped;
      }
    }),
    {
      name: STORAGE_KEYS.GASTOS
    }
  )
);

// Store de UI (estado temporal de interfaz)
export const useUIStore = create((set) => ({
  sidebarOpen: true,
  modalOpen: false,
  modalContent: null,
  toast: null,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  openModal: (content) => set({ modalOpen: true, modalContent: content }),
  closeModal: () => set({ modalOpen: false, modalContent: null }),

  showToast: (message, type = 'info') => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 3000);
  }
}));
