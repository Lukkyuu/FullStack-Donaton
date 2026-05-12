# ── Etapa 1: Build ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias (npm ci es más rápido y determinístico que npm install)
COPY package*.json ./
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# VITE_BFF_URL se inyecta en build-time como build-arg
# Ejemplo: docker build --build-arg VITE_BFF_URL=http://tu-ip-aws:8080 .
ARG VITE_BFF_URL=http://localhost:8080
ENV VITE_BFF_URL=$VITE_BFF_URL

RUN npm run build

# ── Etapa 2: Servir con Nginx ───────────────────────────────────────────────────
FROM nginx:1.27-alpine AS production

# Config de Nginx adaptada para React Router (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar el build de producción
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]