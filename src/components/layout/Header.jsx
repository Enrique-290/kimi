import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useUIStore, useProductStore } from '@store/useStore';
import { Button } from '@components/ui';
import { cn } from '@components/ui/Button';

export const Header = ({ title, actions }) => {
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const productosBajoStock = useProductStore(state => state.getProductosBajoStock());

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            {productosBajoStock.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full" />
            )}
          </Button>

          {/* Actions */}
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
