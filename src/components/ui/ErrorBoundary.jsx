import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';

/**
 * Componente Error Boundary para capturar errores de React
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    // Aquí se podría enviar el error a un servicio de logging
    console.error('ErrorBoundary capturó un error:', error, errorInfo);

    // Ejemplo: enviar a Sentry, LogRocket, etc.
    // if (window.Sentry) {
    //   window.Sentry.captureException(error);
    // }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-8 text-center">
            <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-danger-600" />
            </div>

            <h1 className="text-xl font-bold text-gray-900 mb-2">
              ¡Ups! Algo salió mal
            </h1>

            <p className="text-gray-600 mb-6">
              Ha ocurrido un error inesperado. Puedes intentar recargar la página o volver al inicio.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6">
                <div className="bg-gray-100 rounded-lg p-4 text-left overflow-auto max-h-48">
                  <p className="text-sm font-mono text-danger-600 mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="text-xs text-gray-600 font-mono">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="primary" 
                onClick={this.handleReload}
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Recargar página
              </Button>
              <Button 
                variant="outline" 
                onClick={this.handleGoHome}
                leftIcon={<Home className="w-4 h-4" />}
              >
                Volver al inicio
              </Button>
            </div>

            {this.props.onReset && (
              <button
                onClick={this.handleReset}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Intentar recuperar
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Componente para mostrar errores de forma amigable
 * @param {Object} props
 * @param {Error} props.error - Error a mostrar
 * @param {Function} props.onRetry - Función para reintentar
 * @param {string} [props.title] - Título personalizado
 */
export const ErrorDisplay = ({ error, onRetry, title = 'Error' }) => {
  return (
    <div className="bg-danger-50 border border-danger-200 rounded-lg p-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-danger-800">{title}</h3>
          <p className="text-danger-700 mt-1 text-sm">
            {error?.message || 'Ha ocurrido un error inesperado'}
          </p>
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="mt-3"
              leftIcon={<RefreshCw className="w-3 h-3" />}
            >
              Reintentar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
