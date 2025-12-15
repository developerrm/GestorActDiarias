#!/bin/bash

# Script de ayuda para Docker en GestorActDiarias

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funciones
show_help() {
    echo -e "${BLUE}=== GestorActDiarias Docker Helper ===${NC}"
    echo ""
    echo "Uso: ./docker-helper.sh [comando]"
    echo ""
    echo "Comandos disponibles:"
    echo ""
    echo -e "${GREEN}desarrollo${NC}"
    echo "  Inicia el proyecto en modo desarrollo con hot reload"
    echo ""
    echo -e "${GREEN}dev-rebuild${NC}"
    echo "  Reconstruye y inicia en modo desarrollo"
    echo ""
    echo -e "${GREEN}produccion${NC}"
    echo "  Construye e inicia en modo producción"
    echo ""
    echo -e "${GREEN}prod-rebuild${NC}"
    echo "  Reconstruye y inicia en modo producción"
    echo ""
    echo -e "${GREEN}logs${NC}"
    echo "  Muestra logs de desarrollo"
    echo ""
    echo -e "${GREEN}logs-prod${NC}"
    echo "  Muestra logs de producción"
    echo ""
    echo -e "${GREEN}stop${NC}"
    echo "  Detiene los contenedores (desarrollo)"
    echo ""
    echo -e "${GREEN}stop-prod${NC}"
    echo "  Detiene los contenedores (producción)"
    echo ""
    echo -e "${GREEN}clean${NC}"
    echo "  Limpia contenedores, volúmenes e imágenes"
    echo ""
    echo -e "${GREEN}build${NC}"
    echo "  Solo construye la imagen de producción"
    echo ""
    echo -e "${GREEN}bash${NC}"
    echo "  Abre bash en el contenedor de desarrollo"
    echo ""
    echo -e "${GREEN}npm [comando]${NC}"
    echo "  Ejecuta comando npm en el contenedor (ej: npm install)"
    echo ""
}

desarrollo() {
    echo -e "${YELLOW}Iniciando en modo DESARROLLO...${NC}"
    docker-compose -f docker-compose.dev.yml up
}

dev_rebuild() {
    echo -e "${YELLOW}Reconstruyendo en modo DESARROLLO...${NC}"
    docker-compose -f docker-compose.dev.yml up --build
}

produccion() {
    echo -e "${YELLOW}Iniciando en modo PRODUCCIÓN...${NC}"
    docker-compose up -d
    echo -e "${GREEN}✓ Aplicación en http://localhost:3000${NC}"
}

prod_rebuild() {
    echo -e "${YELLOW}Reconstruyendo en modo PRODUCCIÓN...${NC}"
    docker-compose up --build -d
    echo -e "${GREEN}✓ Aplicación en http://localhost:3000${NC}"
}

logs_dev() {
    echo -e "${YELLOW}Mostrando logs (desarrollo)...${NC}"
    docker-compose -f docker-compose.dev.yml logs -f
}

logs_prod() {
    echo -e "${YELLOW}Mostrando logs (producción)...${NC}"
    docker-compose logs -f
}

stop_dev() {
    echo -e "${YELLOW}Deteniendo contenedores (desarrollo)...${NC}"
    docker-compose -f docker-compose.dev.yml down
    echo -e "${GREEN}✓ Detenido${NC}"
}

stop_prod() {
    echo -e "${YELLOW}Deteniendo contenedores (producción)...${NC}"
    docker-compose down
    echo -e "${GREEN}✓ Detenido${NC}"
}

clean_all() {
    echo -e "${RED}Limpiando Docker (contenedores, volúmenes e imágenes)...${NC}"
    read -p "¿Estás seguro? (s/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        docker-compose down -v
        docker-compose -f docker-compose.dev.yml down -v
        docker image rm gestor-actividades:latest 2>/dev/null || true
        docker image rm gestor-actividades:dev 2>/dev/null || true
        echo -e "${GREEN}✓ Limpieza completa${NC}"
    else
        echo "Cancelado"
    fi
}

build_prod() {
    echo -e "${YELLOW}Construyendo imagen de producción...${NC}"
    docker build -t gestor-actividades:latest .
    echo -e "${GREEN}✓ Imagen construida${NC}"
}

bash_dev() {
    echo -e "${YELLOW}Abriendo bash en contenedor de desarrollo...${NC}"
    docker-compose -f docker-compose.dev.yml exec gestor-app-dev /bin/sh
}

run_npm() {
    local cmd="${@}"
    echo -e "${YELLOW}Ejecutando: npm ${cmd}${NC}"
    docker-compose -f docker-compose.dev.yml exec gestor-app-dev npm ${cmd}
}

# Main
case "${1:-help}" in
    desarrollo)
        desarrollo
        ;;
    dev-rebuild)
        dev_rebuild
        ;;
    produccion)
        produccion
        ;;
    prod-rebuild)
        prod_rebuild
        ;;
    logs)
        logs_dev
        ;;
    logs-prod)
        logs_prod
        ;;
    stop)
        stop_dev
        ;;
    stop-prod)
        stop_prod
        ;;
    clean)
        clean_all
        ;;
    build)
        build_prod
        ;;
    bash)
        bash_dev
        ;;
    npm)
        shift
        run_npm "$@"
        ;;
    *)
        show_help
        ;;
esac
