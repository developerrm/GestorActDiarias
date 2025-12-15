# 🚀 Inicio Rápido con Docker

## ⚡ 30 Segundos para Empezar

### Windows
```bash
docker-helper.bat desarrollo
```

### Linux / Mac
```bash
./docker-helper.sh desarrollo
```

### Acceso
**http://localhost:5173** (Desarrollo)
**http://localhost:3000** (Producción)

---

## 📚 Documentación

- **[DOCKER_GUIDE.md](DOCKER_GUIDE.md)** - Guía completa
- **[DOCKER_SETUP.md](DOCKER_SETUP.md)** - Resumen técnico

## 🎯 Comandos Principales

### Desarrollo
```bash
# Windows
docker-helper.bat desarrollo        # Iniciar con hot reload
docker-helper.bat dev-rebuild       # Rebuild

# Linux/Mac
./docker-helper.sh desarrollo
./docker-helper.sh dev-rebuild
```

### Producción
```bash
# Windows
docker-helper.bat produccion        # Iniciar
docker-helper.bat prod-rebuild      # Rebuild

# Linux/Mac
./docker-helper.sh produccion
./docker-helper.sh prod-rebuild
```

### Logs y Control
```bash
# Windows
docker-helper.bat logs              # Ver logs (dev)
docker-helper.bat logs-prod         # Ver logs (prod)
docker-helper.bat stop              # Detener (dev)
docker-helper.bat stop-prod         # Detener (prod)

# Linux/Mac
./docker-helper.sh logs
./docker-helper.sh logs-prod
./docker-helper.sh stop
./docker-helper.sh stop-prod
```

## 🔨 Sin Scripts Helper

### Desarrollo
```bash
docker-compose -f docker-compose.dev.yml up
```

### Producción
```bash
docker-compose up -d
```

## ✅ Verificar Instalación

```bash
# Docker
docker --version

# Docker Compose
docker-compose --version
```

## 🆘 Problemas Comunes

### Puerto en uso
Edita `docker-compose.yml` o `.dev.yml`:
```yaml
ports:
  - "4000:3000"  # Usa 4000 en lugar de 3000
```

### Rebuild
```bash
docker-compose up --build
```

### Limpiar todo
```bash
docker-compose down -v
```

---

**¡Listo para usar!** 🎉
