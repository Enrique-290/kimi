import React from 'react';
import { useRouteError, Link, isRouteErrorResponse } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@components/ui';

/**
 * Componente de página de error para React Router v6
 * Muestra errores de ruta de forma amigable
 */
export const ErrorPage = () => {
  const error = useRouteError();

  let title = '¡Ups! Algo salió mal';
  let message = 'Ha ocurrido un error inesperado.';
  let status = null;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    if (error.status === 404) {
      title = 'Página no encontrada';
      message = 'La página que buscas no existe o ha sido movida.';
    } else if (error.status === 403) {
      title = 'Acceso denegado';
      message = 'No tienes permisos para acceder a esta página.';
    } else if (error.status === 500) {
      title = 'Error del servidor';
      message = 'Ha ocurrido un error en el servidor. Inténtalo de nuevo más tarde.';
    } else {
      message = error.statusText || message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-8 text-center">
        <div className="w-20 h-20 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-danger-600" />
        </div>

        {status && (
          <div className="text-6xl font-bold text-gray-200 mb-2">
            {status}
          </div>
        )}

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {title}
        </h1>

        <p className="text-gray-600 mb-8">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="primary" 
            as={Link}
            to="/"
            leftIcon={<Home className="w-4 h-4" />}
          >
            Volver al inicio
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Ir atrás
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && error instanceof Error && (
          <div className="mt-6 text-left">
            <div className="bg-gray-100 rounded-lg p-4 overflow-auto max-h-48">
              <p className="text-sm font-mono text-danger-600 font-semibold mb-2">
                Stack trace (solo desarrollo):
              </p>
              <pre className="text-xs text-gray-600 font-mono whitespace-pre-wrap">
                {error.stack}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
