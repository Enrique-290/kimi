import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useUIStore } from '@store/useStore';
import { cn } from '@components/ui/Button';

const pageTitles = {
  '/': 'Dashboard',
  '/ventas': 'Punto de Venta',
  '/inventario': 'Inventario',
  '/bodega': 'Bodega',
  '/clientes': 'Clientes',
  '/gastos': 'Gastos',
  '/compras': 'Compras',
  '/proveedores': 'Proveedores',
  '/historial': 'Historial',
  '/reportes': 'Reportes',
  '/configuracion': 'Configuración',
};

export const Layout = () => {
  const { sidebarOpen } = useUIStore();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'TPV Grocery';

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className={cn(
        'transition-all duration-300',
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
      )}>
        <Header title={title} />
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
