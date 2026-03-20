import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Warehouse,
  Users,
  Receipt,
  ShoppingBag,
  Truck,
  History,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Store
} from 'lucide-react';
import { cn } from '@components/ui/Button';
import { useUIStore, useConfigStore } from '@store/useStore';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/ventas', icon: ShoppingCart, label: 'Ventas', highlight: true },
  { path: '/inventario', icon: Package, label: 'Inventario' },
  { path: '/bodega', icon: Warehouse, label: 'Bodega' },
  { path: '/clientes', icon: Users, label: 'Clientes' },
  { path: '/gastos', icon: Receipt, label: 'Gastos' },
  { path: '/compras', icon: ShoppingBag, label: 'Compras' },
  { path: '/proveedores', icon: Truck, label: 'Proveedores' },
  { path: '/historial', icon: History, label: 'Historial' },
  { path: '/reportes', icon: BarChart3, label: 'Reportes' },
  { path: '/configuracion', icon: Settings, label: 'Configuración' },
];

export const Sidebar = () => {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { config } = useConfigStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out',
        sidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      {/* Logo/Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <div className={cn('flex items-center gap-3 overflow-hidden', !sidebarOpen && 'justify-center w-full')}>
          <div className="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Store className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <span className="font-bold text-lg text-gray-900 truncate">
              {config.nombreNegocio}
            </span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className={cn(
            'p-1 rounded-lg hover:bg-gray-100 transition-colors',
            !sidebarOpen && 'hidden'
          )}
        >
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Toggle button when collapsed */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 p-1 bg-primary-600 rounded-full shadow-md hover:bg-primary-700 transition-colors z-50"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                item.highlight && !isActive && 'bg-success-50 text-success-700 hover:bg-success-100',
                !sidebarOpen && 'justify-center'
              )}
            >
              <Icon className={cn(
                'w-5 h-5 flex-shrink-0',
                item.highlight && 'text-success-600'
              )} />
              {sidebarOpen && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      {sidebarOpen && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Administrador</p>
              <p className="text-xs text-gray-500 truncate">admin@tienda.com</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
