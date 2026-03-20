import React from 'react';
import { cn } from './Button';

const sizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const variants = {
  primary: 'text-primary-600',
  white: 'text-white',
  gray: 'text-gray-400',
};

/**
 * Componente Spinner para estados de carga
 * @param {Object} props
 * @param {string} [props.size='md'] - Tamaño del spinner
 * @param {string} [props.variant='primary'] - Variante de color
 * @param {string} [props.className] - Clases adicionales
 * @param {string} [props.label] - Texto accesible para lectores de pantalla
 */
export const Spinner = ({ 
  size = 'md', 
  variant = 'primary',
  className,
  label = 'Cargando...'
}) => {
  return (
    <div role="status" className={cn('inline-flex items-center justify-center', className)}>
      <svg
        className={cn('animate-spin', sizes[size], variants[variant])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {label && <span className="sr-only">{label}</span>}
    </div>
  );
};

/**
 * Componente de overlay de carga para pantalla completa
 * @param {Object} props
 * @param {boolean} props.isLoading - Si está cargando
 * @param {string} [props.message] - Mensaje a mostrar
 */
export const LoadingOverlay = ({ isLoading, message }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 flex flex-col items-center gap-3 shadow-xl">
        <Spinner size="xl" />
        {message && <p className="text-gray-600 font-medium">{message}</p>}
      </div>
    </div>
  );
};

/**
 * Skeleton loader para tarjetas
 * @param {Object} props
 * @param {number} [props.count=1] - Número de skeletons
 * @param {string} [props.className]
 */
export const SkeletonCard = ({ count = 1, className }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "bg-white rounded-xl border border-gray-200 p-6 animate-pulse",
            className
          )}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

/**
 * Skeleton loader para tablas
 * @param {number} [props.rows=5] - Número de filas
 * @param {number} [props.cols=4] - Número de columnas
 */
export const SkeletonTable = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex gap-4 pb-4 border-b">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={`h-${i}`} className="h-4 bg-gray-200 rounded flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={`r-${rowIdx}`} className="flex gap-4 py-4 border-b">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <div key={`c-${rowIdx}-${colIdx}`} className="h-4 bg-gray-200 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Spinner;
