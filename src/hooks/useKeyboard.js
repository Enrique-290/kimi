import { useEffect, useCallback } from 'react';

/**
 * Hook para manejar atajos de teclado en el TPV
 * @param {Object} handlers - Objeto con los handlers de teclas
 * @param {Array} deps - Dependencias para re-crear los handlers
 */
export const useKeyboard = (handlers, deps = []) => {
  const handleKeyDown = useCallback((event) => {
    // Ignorar si estamos en un input o textarea
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      // Permitir Escape incluso en inputs
      if (event.key === 'Escape' && handlers.onEscape) {
        handlers.onEscape(event);
      }
      return;
    }

    // Atajos numéricos para cantidades (teclas 1-9)
    if (event.key >= '1' && event.key <= '9' && handlers.onNumber) {
      handlers.onNumber(parseInt(event.key));
      return;
    }

    // Teclas especiales
    switch (event.key) {
      case 'Escape':
        handlers.onEscape?.(event);
        break;
      case 'Enter':
        handlers.onEnter?.(event);
        break;
      case 'F2':
        event.preventDefault();
        handlers.onF2?.(event);
        break;
      case 'F4':
        event.preventDefault();
        handlers.onF4?.(event);
        break;
      case 'F8':
        event.preventDefault();
        handlers.onF8?.(event);
        break;
      case 'Delete':
      case 'Backspace':
        handlers.onDelete?.(event);
        break;
      case '+':
      case '=':
        handlers.onPlus?.(event);
        break;
      case '-':
      case '_':
        handlers.onMinus?.(event);
        break;
      default:
        break;
    }
  }, deps);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

/**
 * Hook para escanear código de barras
 * @param {Function} onScan - Callback cuando se escanea un código
 * @param {number} timeout - Tiempo de espera entre caracteres (ms)
 */
export const useBarcodeScanner = (onScan, timeout = 100) => {
  useEffect(() => {
    let code = '';
    let lastTime = 0;
    let timeoutId = null;

    const handleKeyPress = (event) => {
      const currentTime = new Date().getTime();

      // Si el tiempo entre teclas es muy corto, probablemente es un escáner
      if (currentTime - lastTime < timeout && event.key !== 'Enter') {
        code += event.key;
      } else if (event.key !== 'Enter') {
        code = event.key;
      }

      lastTime = currentTime;

      // Limpiar el código después de un tiempo
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        code = '';
      }, timeout + 50);

      // Si presionamos Enter y tenemos código, es un escaneo completo
      if (event.key === 'Enter' && code.length > 3) {
        onScan(code);
        code = '';
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      clearTimeout(timeoutId);
    };
  }, [onScan, timeout]);
};

/**
 * Hook para manejar el foco automático
 * @param {boolean} shouldFocus - Si debe enfocarse
 */
export const useAutoFocus = (shouldFocus = true) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (shouldFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [shouldFocus]);

  return inputRef;
};

export default useKeyboard;
