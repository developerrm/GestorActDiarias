# 🐳 Guía de Docker para GestorActDiarias

## 📋 Requisitos

- Docker >= 20.10
- Docker Compose >= 2.0

## 🏗️ Estructura de Dockerfiles

### 1. `Dockerfile` (Producción)
Build multi-stage optimizado para producción:
- **Etapa 1**: Build de la aplicación con Node.js
- **Etapa 2**: Servidor HTTP lightweight con `serve`

Ventajas:
- Imagen pequeña (~100MB)
- Sin código fuente en producción
- Optimizada para rendimiento

### 2. `Dockerfile.dev` (Desarrollo)
Dockerfile para desarrollo con hot reload:
- Monta volúmenes locales
- Ejecuta `npm run dev` con `--host`
- Permite editar código en tiempo real

## 🚀 Uso

### Desarrollo con Docker Compose (Recomendado)

```bash
# Iniciar en modo desarrollo
docker-compose -f docker-compose.dev.yml up

# Con rebuild
docker-compose -f docker-compose.dev.yml up --build

# En background
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Detener
docker-compose -f docker-compose.dev.yml down
```

La aplicación estará disponible en: **http://localhost:5173**

### Producción con Docker Compose

```bash
# Construir y ejecutar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

La aplicación estará disponible en: **http://localhost:3000**

## 🔨 Comandos Docker Individuales

### Build manual (Producción)

```bash
# Build
docker build -t gestor-actividades:latest .

# Run
docker run -p 3000:3000 \
  -e VITE_API_URL=http://localhost:3001/api \
  gestor-actividades:latest

# Acceder
# http://localhost:3000
```

### Build manual (Desarrollo)

```bash
# Build
docker build -f Dockerfile.dev -t gestor-actividades:dev .

# Run con volúmenes
docker run -p 5173:5173 \
  -v $(pwd):/app \
  -v /app/node_modules \
  -e VITE_API_URL=http://localhost:3001/api \
  gestor-actividades:dev

# Acceder
# http://localhost:5173
```

## 📁 Archivos Docker

```
GestorActDiarias/
├── Dockerfile              # Producción (multi-stage)
├── Dockerfile.dev          # Desarrollo
├── docker-compose.yml      # Composición producción
├── docker-compose.dev.yml  # Composición desarrollo
├── .dockerignore           # Archivos a ignorar
└── .env.docker             # Variables para Docker
```

## 🌐 Variables de Entorno

### `.env.docker` (Interno en Docker)
```env
VITE_API_URL=http://gestor-api:3001/api
```

### `.env` (Desarrollo Local)
```env
VITE_API_URL=http://localhost:3001/api
```

## 🔗 Conectar tu Backend API

### Opción 1: API Externa
1. Actualiza `VITE_API_URL` en los compose files
2. Asegúrate que tu API sea accesible desde Docker

### Opción 2: Agregar API al Compose
Edita `docker-compose.yml`:

```yaml
services:
  gestor-api:
    build:
      context: ./api
      dockerfile: Dockerfile
    container_name: gestor-actividades-api
    environment:
      - NODE_ENV=production
      - PORT=3001
    ports:
      - "3001:3001"
    networks:
      - gestor-network
```

## 📊 Networks en Docker Compose

### `docker-compose.yml` (Producción)
- Network: `gestor-network`
- Servicios: `gestor-app`, `gestor-api`
- Los servicios se comunican por nombre: `http://gestor-api:3001`

### `docker-compose.dev.yml` (Desarrollo)
- Network: `gestor-network-dev`
- Solo: `gestor-app-dev`

## 🧹 Limpiar

```bash
# Remover contenedores y volúmenes
docker-compose down -v

# Remover imágenes
docker image rm gestor-actividades:latest

# Limpiar todo (CUIDADO)
docker system prune -a
```

## 📈 Optimizaciones

### Dockerfile (Producción)
- ✅ Multi-stage build (reduce tamaño)
- ✅ Alpine Linux (imagen pequeña)
- ✅ npm ci (instalación determinística)
- ✅ Servidor serve (ligero)

### Dockerfile.dev
- ✅ Volúmenes para hot reload
- ✅ Git incluido para dependencias
- ✅ Host expuesto para Vite

## 🐛 Troubleshooting

### Puerto en uso
```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "4000:3000"  # Nuevo puerto local
```

### Problemas de volumen (Windows)
```bash
# Usar path absoluto o WSL2
volumes:
  - C:\ruta\absoluta:/app
```

### Cache de build
```bash
# Rebuild sin cache
docker-compose build --no-cache
```

### Logs detallados
```bash
# Ver logs con timestamps
docker-compose logs -f --timestamps
```

## 📚 Referencias

- [Docker Docs](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/contents/best-practices.md)

---

**¡Tu proyecto está listo para containerizar!** 🎉
