# 🔗 Guía de Conexión Frontend - Backend

## 📋 Resumen

El proyecto frontend **GestorActDiarias** ha sido configurado para conectarse al backend API en `http://localhost:5000`.

**Estado**: ✅ **LISTO PARA CONECTAR**

---

## ✅ Cambios Realizados

### 1. Archivo `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

**Cambio**: Puerto actualizado de 3000 a 5000 (puerto real de la API .NET Core)

### 2. Archivo `src/App.jsx`
**Cambios implementados:**

✅ **Importación del servicio habilitada**
```javascript
import { activityService } from './services/activityService';
```

✅ **Carga de actividades al iniciar**
```javascript
useEffect(() => {
  const loadActivities = async () => {
    const data = await activityService.getActivities();
    setActivities(data || []);
  };
  loadActivities();
}, []);
```

✅ **Crear actividad conectada al backend**
```javascript
const newActivity = await activityService.createActivity({
  activityDate: formData.date,
  description: formData.description,
});
```

✅ **Actualizar actividad conectada al backend**
```javascript
const updatedActivity = await activityService.updateActivity(id, {
  activityDate: formData.date,
  description: formData.description,
});
```

✅ **Eliminar actividad conectada al backend**
```javascript
await activityService.deleteActivity(id);
```

✅ **Mensajes de error mejorados**
```javascript
setError('No se pudieron cargar las actividades. Verifica que el servidor está ejecutándose en http://localhost:5000');
```

### 3. Archivo `src/services/activityService.js`
**Estado**: ✅ Ya está correctamente implementado

```javascript
const API_URL = import.meta.env.VITE_API_URL;

export const activityService = {
  getActivities: async () => { ... },
  getActivitiesByDate: async (date) => { ... },
  createActivity: async (activity) => { ... },
  updateActivity: async (id, activity) => { ... },
  deleteActivity: async (id) => { ... },
};
```

---

## 🚀 Cómo Usar (Frontend + Backend)

### Paso 1: Iniciar el Backend (API .NET Core)

**Terminal 1:**
```bash
cd C:\CursoGeneracionCodigo\GestorActDiariasAPI
dotnet run
```

**Resultado esperado:**
```
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
```

### Paso 2: Iniciar el Frontend (React)

**Terminal 2:**
```bash
cd C:\CursoGeneracionCodigo\GestorActDiarias
npm run dev
```

**Resultado esperado:**
```
  ➜  Local:   http://localhost:5173/
```

### Paso 3: Probar la Integración

1. Abre el navegador: `http://localhost:5173`
2. Deberías ver:
   - ✅ Calendario cargado con las actividades del backend
   - ✅ Formulario para crear nuevas actividades
   - ✅ Modal para ver, editar y eliminar actividades

---

## 🧪 Funciones Disponibles

### 1. Ver Actividades
- ✅ Se cargan automáticamente al abrir la app
- ✅ Se muestran en el calendario
- ✅ Filtradas por fecha en el modal

### 2. Crear Actividad
1. Haz clic en "+ Nueva Actividad" o en una fecha
2. Rellena fecha y descripción
3. Haz clic en "Guardar"
4. ✅ Se envía al backend y se actualiza la UI

### 3. Ver Actividades por Fecha
1. Haz clic en una fecha en el calendario
2. Se abre modal con actividades de esa fecha
3. ✅ Datos obtenidos del backend

### 4. Editar Actividad
1. En el modal, haz clic en "Editar" en una actividad
2. Modifica los datos
3. Haz clic en "Guardar"
4. ✅ Se actualiza en el backend

### 5. Eliminar Actividad
1. En el modal, haz clic en "Eliminar"
2. Confirma la eliminación
3. ✅ Se elimina del backend

---

## 🔧 Configuración

### Variable de Entorno
**Archivo: `.env`**
```env
VITE_API_URL=http://localhost:5000/api
```

### Cambiar Configuración

Si el backend está en otro puerto o servidor:

```env
# Backend en servidor remoto
VITE_API_URL=https://api.midominio.com/api

# Backend en puerto diferente
VITE_API_URL=http://localhost:8080/api

# Backend en Docker
VITE_API_URL=http://gestor-api:5000/api
```

---

## 📊 Flujo de Datos

### Obtener Actividades

```
React (App.jsx)
    ↓
activityService.getActivities()
    ↓
fetch('http://localhost:5000/api/activities')
    ↓
Backend (ActivitiesController)
    ↓
ActivityService
    ↓
AppDbContext (Entity Framework)
    ↓
MySQL Database
    ↓
Retorna Array de Activities
    ↓
React actualiza estado y UI
```

### Crear Actividad

```
React (ActivityForm)
    ↓
handleAddActivity()
    ↓
activityService.createActivity()
    ↓
fetch('POST http://localhost:5000/api/activities')
    ↓
Backend recibe y procesa
    ↓
Guarda en MySQL
    ↓
Retorna Activity creada
    ↓
React agrega a lista y cierra form
```

---

## ✅ Verificación

### 1. Verificar que el backend está funcionando

```bash
curl http://localhost:5000/api/activities
```

Deberías obtener un JSON con actividades.

### 2. Verificar que el frontend conecta

1. Abre `http://localhost:5173`
2. Abre DevTools (F12)
3. Vé a Network
4. Recarga la página
5. Deberías ver peticiones a `http://localhost:5000/api/activities`

### 3. Verificar Swagger del Backend

Abre en navegador: `http://localhost:5000/swagger`

Deberías ver todos los endpoints disponibles.

---

## 🆘 Solución de Problemas

### ❌ Error: "No se pudieron cargar las actividades"

**Causa**: El backend no está ejecutándose

**Solución**:
1. Verifica que el backend está en ejecución: `dotnet run`
2. Abre `http://localhost:5000/swagger` en navegador
3. Si funciona, el frontend debería cargar también

### ❌ Error: "CORS error" o "Access to fetch blocked"

**Causa**: Backend rechaza solicitudes de origen diferente

**Solución**: El backend ya tiene CORS configurado para aceptar todas las solicitudes. Si persiste:
1. Verifica que `Program.cs` tiene `app.UseCors("AllowAll")`
2. Reinicia el backend

### ❌ La app carga pero no hay actividades

**Causa**: Base de datos vacía o no creada

**Solución**:
1. Ejecuta el script SQL: `mysql -u root -p < Scripts\script.sql`
2. Reinicia el backend
3. Recarga el frontend

### ❌ Error al crear/actualizar/eliminar

**Causa**: Validación del servidor

**Solución**: 
1. Verifica los mensajes de error en DevTools (F12)
2. Asegúrate de llenar todos los campos requeridos
3. Verifica que la fecha es válida

---

## 🔐 Configuración Segura (Producción)

### Variable de entorno para producción

**Archivo: `.env.production`** (crear si no existe)
```env
VITE_API_URL=https://api.midominio.com/api
```

### Build para producción

```bash
npm run build
```

---

## 📚 Archivos Involucrados

### Frontend
```
GestorActDiarias/
├── .env                           ← Configuración (ACTUALIZADO)
├── src/
│   ├── App.jsx                    ← Main component (ACTUALIZADO)
│   ├── services/
│   │   └── activityService.js     ← API client (Ya estaba listo)
│   └── components/
│       ├── CalendarView.jsx
│       ├── ActivityForm.jsx
│       └── ActivityModal.jsx
```

### Backend
```
GestorActDiariasAPI/
├── Controllers/
│   └── ActivitiesController.cs    ← Endpoints
├── Services/
│   └── ActivityService.cs         ← Lógica
├── Data/
│   └── AppDbContext.cs            ← BD
├── appsettings.json               ← Configuración
└── Program.cs                      ← CORS habilitado
```

---

## 📋 Checklist de Integración

- [x] Backend .NET Core 8 creado
- [x] API REST con 6 endpoints
- [x] Base de datos MySQL configurada
- [x] Frontend React actualizado
- [x] Servicio de API implementado
- [x] App.jsx conectado al backend
- [x] Variable de entorno configurada
- [x] CORS habilitado en backend
- [x] Mensajes de error mejorados
- [x] Métodos CRUD implementados

**Estado**: ✅ **100% LISTO PARA USAR**

---

## 🚀 Próximos Pasos

1. ✅ Inicia el backend: `cd GestorActDiariasAPI && dotnet run`
2. ✅ Inicia el frontend: `cd GestorActDiarias && npm run dev`
3. ✅ Abre `http://localhost:5173` en navegador
4. ✅ Prueba todas las funciones (crear, leer, actualizar, eliminar)

---

## 📞 Referencia Rápida

### Endpoints Backend
```
GET    http://localhost:5000/api/activities
GET    http://localhost:5000/api/activities/{id}
GET    http://localhost:5000/api/activities/by-date?date=YYYY-MM-DD
POST   http://localhost:5000/api/activities
PUT    http://localhost:5000/api/activities/{id}
DELETE http://localhost:5000/api/activities/{id}
```

### URLs Frontend
```
Development: http://localhost:5173
Swagger Backend: http://localhost:5000/swagger
```

### Puertos
```
Frontend: 5173
Backend: 5000 (HTTP), 5001 (HTTPS)
MySQL: 3306
```

---

**Estado**: ✅ Frontend y Backend completamente integrados  
**Fecha**: Diciembre 15, 2025  
**Versión**: 1.0

¡Listo para usar! 🎉
