@echo off
REM Script de ayuda para Docker en GestorActDiarias (Windows)

setlocal enabledelayedexpansion

set "CMD=%1"

if "%CMD%"=="" (
    goto show_help
)

if /i "%CMD%"=="desarrollo" (
    echo [INFO] Iniciando en modo DESARROLLO...
    docker-compose -f docker-compose.dev.yml up
    goto end
)

if /i "%CMD%"=="dev-rebuild" (
    echo [INFO] Reconstruyendo en modo DESARROLLO...
    docker-compose -f docker-compose.dev.yml up --build
    goto end
)

if /i "%CMD%"=="produccion" (
    echo [INFO] Iniciando en modo PRODUCCION...
    docker-compose up -d
    echo [OK] Aplicacion en http://localhost:3000
    goto end
)

if /i "%CMD%"=="prod-rebuild" (
    echo [INFO] Reconstruyendo en modo PRODUCCION...
    docker-compose up --build -d
    echo [OK] Aplicacion en http://localhost:3000
    goto end
)

if /i "%CMD%"=="logs" (
    echo [INFO] Mostrando logs (desarrollo)...
    docker-compose -f docker-compose.dev.yml logs -f
    goto end
)

if /i "%CMD%"=="logs-prod" (
    echo [INFO] Mostrando logs (produccion)...
    docker-compose logs -f
    goto end
)

if /i "%CMD%"=="stop" (
    echo [INFO] Deteniendo contenedores (desarrollo)...
    docker-compose -f docker-compose.dev.yml down
    echo [OK] Detenido
    goto end
)

if /i "%CMD%"=="stop-prod" (
    echo [INFO] Deteniendo contenedores (produccion)...
    docker-compose down
    echo [OK] Detenido
    goto end
)

if /i "%CMD%"=="build" (
    echo [INFO] Construyendo imagen de produccion...
    docker build -t gestor-actividades:latest .
    echo [OK] Imagen construida
    goto end
)

if /i "%CMD%"=="bash" (
    echo [INFO] Abriendo bash en contenedor de desarrollo...
    docker-compose -f docker-compose.dev.yml exec gestor-app-dev /bin/sh
    goto end
)

if /i "%CMD%"=="clean" (
    echo [ADVERTENCIA] Limpiando Docker ^(contenedores, volumenes e imagenes^)...
    set /p confirm="Estoy seguro? (s/n): "
    if /i "!confirm!"=="s" (
        docker-compose down -v
        docker-compose -f docker-compose.dev.yml down -v
        docker image rm gestor-actividades:latest 2>nul
        docker image rm gestor-actividades:dev 2>nul
        echo [OK] Limpieza completa
    ) else (
        echo Cancelado
    )
    goto end
)

if /i "%CMD%"=="npm" (
    set "npm_cmd=%2 %3 %4 %5 %6 %7 %8 %9"
    echo [INFO] Ejecutando: npm !npm_cmd!
    docker-compose -f docker-compose.dev.yml exec gestor-app-dev npm !npm_cmd!
    goto end
)

:show_help
echo.
echo ===== GestorActDiarias Docker Helper =====
echo.
echo Uso: docker-helper.bat [comando]
echo.
echo Comandos disponibles:
echo.
echo desarrollo        - Inicia en modo desarrollo con hot reload
echo dev-rebuild       - Reconstruye e inicia en modo desarrollo
echo produccion        - Construye e inicia en modo produccion
echo prod-rebuild      - Reconstruye e inicia en modo produccion
echo logs              - Muestra logs de desarrollo
echo logs-prod         - Muestra logs de produccion
echo stop              - Detiene los contenedores (desarrollo)
echo stop-prod         - Detiene los contenedores (produccion)
echo build             - Solo construye la imagen de produccion
echo bash              - Abre bash en el contenedor de desarrollo
echo npm [comandos]    - Ejecuta comando npm (ej: npm install)
echo clean             - Limpia contenedores, volumenes e imagenes
echo.

:end
endlocal
