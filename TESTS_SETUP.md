# Guía de Instalación y Ejecución de Pruebas

## 1. Instalar dependencias

```bash
npm install
```

## 2. Ejecutar pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch (se actualizan al guardar cambios)
npm run test:watch

# Ejecutar pruebas con cobertura
npm run test:coverage
```

## 3. Estructura de pruebas

Las pruebas se encuentran en: `src/components/ActivityForm.test.js`

### Secciones cubiertas:

- **Renderizado del formulario**: Verifica que todos los elementos se muestren correctamente
- **Validación de campos obligatorios**: Prueba todas las reglas de validación
- **Envío del formulario**: Valida el comportamiento al enviar datos
- **Mock de fetch**: Simula llamadas al backend
- **Interacción con campos**: Prueba los cambios de estado y estilos CSS

## 4. Archivos de configuración creados

- `jest.config.js` - Configuración de Jest
- `.babelrc` - Configuración de Babel para transformar JSX
- `src/setupTests.js` - Setup inicial para las pruebas
