# 📅 Gestor de Actividades Diarias

Una aplicación web desarrollada con **React + Vite** para gestionar actividades diarias con interfaz tipo calendario mensual.

## ✨ Características

- ✅ **RF-01: Registro de actividades** - Registra nuevas actividades con fecha y descripción
- ✅ **RF-03: Visualización en Calendario** - Vista mensual interactiva con indicadores de actividades
- ✅ **RF-04: Edición de actividades** - Modifica actividades existentes desde un modal
- ✅ **RF-05: Eliminación de actividades** - Elimina actividades con confirmación
- 🎨 **Bootstrap 5** - Estilos profesionales y responsive
- 📱 **Diseño Responsive** - Funciona en desktop y dispositivos móviles

## 📋 Requisitos

- Node.js >= 20.16.0
- npm >= 10.8.1

## 🚀 Instalación

1. **Navega a la carpeta del proyecto:**
```bash
cd GestorActDiarias
```

2. **Las dependencias ya están instaladas, pero puedes reinstalarlas si es necesario:**
```bash
npm install
```

3. **Configura las variables de entorno:**

Edita el archivo `.env` en la raíz del proyecto:
```env
VITE_API_URL=http://localhost:3000/api
```

## 🏃 Ejecución

Inicia el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173/**

## � Ejecución con Docker

### Modo Desarrollo (con hot reload)

```bash
# Opción 1: Usar docker-compose directamente
docker-compose -f docker-compose.dev.yml up

# Opción 2: Usar script helper (Windows)
docker-helper.bat desarrollo

# Opción 3: Usar script helper (Linux/Mac)
./docker-helper.sh desarrollo
```

Accede a: **http://localhost:5173**

### Modo Producción

```bash
# Opción 1: Usar docker-compose
docker-compose up -d

# Opción 2: Usar script helper (Windows)
docker-helper.bat produccion

# Opción 3: Usar script helper (Linux/Mac)
./docker-helper.sh produccion
```

Accede a: **http://localhost:3000**

### Comandos Docker Útiles

```bash
# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Detener contenedores
docker-compose -f docker-compose.dev.yml down

# Limpiar volúmenes
docker-compose down -v
```

**Para más información:** consulta [DOCKER_GUIDE.md](DOCKER_GUIDE.md)

## �📁 Estructura del Proyecto

```
GestorActDiarias/
├── src/
│   ├── components/           # Componentes React
│   │   ├── CalendarView.jsx # Calendario mensual
│   │   ├── ActivityForm.jsx # Formulario de actividades
│   │   └── ActivityModal.jsx # Modal para editar/eliminar
│   ├── services/             # Servicios de API
│   │   └── activityService.js # Funciones CRUD
│   ├── styles/               # Estilos CSS
│   │   └── CalendarView.css
│   ├── App.jsx              # Componente principal
│   ├── App.css              # Estilos globales
│   ├── main.jsx             # Punto de entrada
│   └── index.css
├── .env                      # Variables de entorno
├── Dockerfile               # Imagen para producción
├── Dockerfile.dev           # Imagen para desarrollo
├── docker-compose.yml       # Orquestación producción
├── docker-compose.dev.yml   # Orquestación desarrollo
├── docker-helper.bat        # Helper scripts Windows
├── docker-helper.sh         # Helper scripts Linux/Mac
├── vite.config.js           # Configuración de Vite
├── package.json             # Dependencias del proyecto
└── README.md                # Este archivo
```

## 🔧 Configuración del Backend

El proyecto está preparado para consumir un API REST. Para conectar tu backend:

1. Actualiza `VITE_API_URL` en el archivo `.env`
2. Descomenta la línea en `App.jsx`:
```javascript
import { activityService } from './services/activityService';
```
3. Reemplaza las llamadas locales con las funciones del servicio:
   - `activityService.getActivities()` - Obtener todas las actividades
   - `activityService.getActivitiesByDate(date)` - Obtener por fecha
   - `activityService.createActivity(activity)` - Crear actividad
   - `activityService.updateActivity(id, activity)` - Actualizar
   - `activityService.deleteActivity(id)` - Eliminar

## 📦 Endpoints Esperados

El API debe tener los siguientes endpoints:

```
GET    /api/activities              - Obtener todas las actividades
GET    /api/activities?date=YYYY-MM-DD - Obtener por fecha
POST   /api/activities              - Crear actividad
PUT    /api/activities/:id          - Actualizar actividad
DELETE /api/activities/:id          - Eliminar actividad
```

**Formato esperado de actividad:**
```json
{
  "id": 1,
  "date": "2025-12-15",
  "description": "Descripción de la actividad"
}
```

## 🛠️ Scripts Disponibles

```bash
# Inicia el servidor de desarrollo
npm run dev

# Compila el proyecto para producción
npm run build

# Preview de la compilación
npm run preview

# Lint del código
npm run lint
```

## 📝 Notas de Desarrollo

- Actualmente, los datos se almacenan en memoria local (useState)
- Para persistencia, integra un backend API
- El servicio `activityService.js` ya contiene todas las funciones necesarias
- Bootstrap 5 está importado globalmente en `App.jsx`

## 🎯 Próximas Mejoras

- [ ] Integración con backend API
- [ ] Persistencia de datos en base de datos
- [ ] Autenticación de usuarios
- [ ] Categorías de actividades
- [ ] Búsqueda y filtrado avanzado
- [ ] Exportar actividades a PDF/Excel
- [ ] Notificaciones y recordatorios

## 📄 Licencia

MIT

## 👨‍💻 Autor

Desarrollado como proyecto de gestión de actividades diarias.
