# TPV Grocery - Sistema de Punto de Venta

Sistema TPV (Terminal Punto de Venta) profesional para tiendas de abarrotes, desarrollado con React + Vite + TailwindCSS.

## 🚀 Características

### Módulos Principales
- **Dashboard**: KPIs en tiempo real, gráficas de ventas, alertas de stock
- **Ventas (TPV)**: Catálogo visual, carrito dinámico, múltiples métodos de pago, tickets digitales
- **Inventario**: CRUD completo con subida de imágenes desde dispositivo, control de stock
- **Bodega**: Gestión de entradas/salidas, transferencias
- **Clientes**: Registro, historial de compras, estadísticas
- **Gastos**: Control de egresos por categoría
- **Configuración**: Personalización del negocio, logo, datos de ticket

### Características Técnicas
- ⚡ **Alto Rendimiento**: Optimizado para operaciones rápidas de venta
- 📱 **Responsive**: Funciona en tablets, desktops y móviles
- 🎨 **UI Profesional**: Diseño tipo SaaS con tema claro
- 💾 **Persistencia Local**: localStorage con posibilidad de sincronización futura
- 🖼️ **Manejo de Imágenes**: Compresión automática, preview inmediato, almacenamiento base64
- 📊 **Estado Global**: Zustand con persistencia automática

## 🛠️ Tecnologías

- **Frontend**: React 18 + Vite
- **Estilos**: TailwindCSS
- **Estado**: Zustand (persist middleware)
- **Router**: React Router v6 (createBrowserRouter)
- **Gráficas**: Recharts
- **Fechas**: date-fns
- **Iconos**: Lucide React

## 📦 Instalación

```bash
# Clonar o descomprimir proyecto
cd tpv-grocery

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🏗️ Arquitectura

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Button, Card, Input, Modal, etc.
│   └── layout/         # Sidebar, Header, Layout
├── modules/            # Módulos funcionales (feature-based)
│   ├── dashboard/
│   ├── ventas/         # Punto de venta (CRÍTICO)
│   ├── inventario/     # CRUD + imágenes
│   ├── bodega/
│   ├── clientes/
│   ├── gastos/
│   ├── compras/
│   ├── proveedores/
│   ├── historial/
│   ├── reportes/
│   └── configuracion/
├── services/           # Servicios/API (preparado para backend)
├── store/              # Estado global (Zustand)
├── utils/              # Helpers y utilidades
├── types/              # Tipos y constantes
└── assets/             # Recursos estáticos
```

## 🎯 Uso

### Flujo de Venta Rápida
1. Ir a módulo **Ventas**
2. Buscar producto por nombre o código
3. Click en producto para agregar al carrito
4. Ajustar cantidades si es necesario
5. Seleccionar método de pago
6. Click en **Cobrar**
7. Imprimir o guardar ticket

### Gestión de Inventario
1. Ir a módulo **Inventario**
2. Click en **Nuevo Producto**
3. Llenar datos (nombre, código, precios, stock)
4. **Subir imagen** desde dispositivo (se comprime automáticamente)
5. Guardar

### Configuración Inicial
1. Ir a **Configuración**
2. Ingresar nombre del negocio, dirección, teléfono
3. Subir logo (aparece en tickets)
4. Personalizar mensaje del ticket
5. Guardar

## 🔮 Preparado para Futuro

- **Roles de Usuario**: Estructura lista para implementar auth
- **Multi-sucursal**: Arquitectura preparada para escalado
- **Sincronización**: localStorage actual puede migrarse a backend
- **Offline**: PWA-ready para operación sin conexión
- **Impresión**: Estilos de impresión para tickets incluidos

## 📝 Notas

- Las imágenes se almacenan en base64 comprimido en localStorage
- Los datos persisten entre sesiones del navegador
- Optimizado para Chrome/Edge/Firefox modernos
- Recomendado usar en tablet para módulo de ventas

## 📄 Licencia

MIT - Sistema listo para uso comercial.
