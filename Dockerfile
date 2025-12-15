# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa 2: Servidor de producción
FROM node:20-alpine

WORKDIR /app

# Instalar servidor HTTP simple
RUN npm install -g serve

# Copiar archivos construidos desde la etapa anterior
COPY --from=builder /app/dist ./dist

# Exponer puerto
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["serve", "-s", "dist", "-l", "3000"]
