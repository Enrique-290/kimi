# Guía de Despliegue

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:3000
```

## Construcción para Producción

```bash
# Generar build optimizado
npm run build

# Los archivos se generan en /dist
```

## Despliegue en Servidor Web

### Opción 1: Servidor Estático (Nginx, Apache, etc.)

1. Copiar contenido de `/dist` al directorio web
2. Configurar redirección de rutas para SPA:

**Nginx:**
```nginx
server {
    listen 80;
    server_name tpv.tudominio.com;
    root /var/www/tpv-grocery/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Apache (.htaccess):**
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Opción 2: Vercel/Netlify

1. Conectar repositorio Git
2. Configurar build command: `npm run build`
3. Directorio de publicación: `dist`

### Opción 3: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# Construir imagen
docker build -t tpv-grocery .

# Ejecutar
docker run -p 80:80 tpv-grocery
```

## Configuración de Base de Datos (Futuro)

Cuando se integre backend:

1. Configurar variables de entorno:
```env
VITE_API_URL=https://api.tudominio.com
VITE_WS_URL=wss://api.tudominio.com/ws
```

2. Actualizar stores para usar API en lugar de localStorage

## Backup y Recuperación

### Backup Manual
1. Ir a Configuración > Exportar Datos
2. Descargar archivo JSON completo

### Recuperación
1. Ir a Configuración > Importar Datos
2. Seleccionar archivo de backup
3. Confirmar importación

## Mantenimiento

### Limpieza de Datos
```javascript
// En consola del navegador
localStorage.clear();
```

### Reset de Configuración
Ir a Configuración > Restaurar Default

## Seguridad

- Los datos se almacenan localmente en el navegador
- Usar HTTPS en producción
- Implementar autenticación para multi-usuario
- Hacer backups regulares

## Soporte

Para reportar issues o solicitar features:
- Email: soporte@tpv-grocery.com
- GitHub Issues: [URL del repo]
