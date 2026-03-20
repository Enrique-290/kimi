import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Layout, ErrorPage } from '@components/layout';
import { Dashboard } from '@modules/dashboard';
import { Ventas } from '@modules/ventas';
import { Inventario } from '@modules/inventario';
import { Bodega } from '@modules/bodega';
import { Clientes } from '@modules/clientes';
import { Gastos } from '@modules/gastos';
import { Compras } from '@modules/compras';
import { Proveedores } from '@modules/proveedores';
import { Historial } from '@modules/historial';
import { Reportes } from '@modules/reportes';
import { Configuracion } from '@modules/configuracion';

const router = createBrowserRouter([
  {
    path: '/error',
    element: <ErrorPage />
  },
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'ventas', element: <Ventas /> },
      { path: 'inventario', element: <Inventario /> },
      { path: 'bodega', element: <Bodega /> },
      { path: 'clientes', element: <Clientes /> },
      { path: 'gastos', element: <Gastos /> },
      { path: 'compras', element: <Compras /> },
      { path: 'proveedores', element: <Proveedores /> },
      { path: 'historial', element: <Historial /> },
      { path: 'reportes', element: <Reportes /> },
      { path: 'configuracion', element: <Configuracion /> },
      { path: '*', element: <Navigate to="/" replace /> }
    ]
  }
], {
  future: {
    v7_normalizeFormMethod: true
  }
});

function App() {
  return <RouterProvider router={router} />;
}

export default App;
