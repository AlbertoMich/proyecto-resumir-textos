# ===== Etapa 1: build de Angular =====
FROM node:20 AS build
WORKDIR /app

# Copiar código fuente
COPY . .

# Limpieza por bug de npm/rollup (evita fallos en CI)
RUN rm -rf node_modules package-lock.json && \
    npm install && \
    npm run build

# ===== Etapa 2: servidor estático =====
FROM node:20-slim AS runtime
WORKDIR /app

# Copiamos TODO el resultado de build
COPY --from=build /app/dist /app/dist

# Instalar servidor estático
RUN npm install -g serve

EXPOSE 80

# Si existe dist/frontend-app/browser, servimos esa; si no, probamos dist/frontend-app; si no, dist/
CMD ["sh", "-lc", "\
  if [ -f dist/frontend-app/browser/index.html ]; then \
    echo 'Serving dist/frontend-app/browser'; \
    exec serve -s dist/frontend-app/browser -l 80; \
  elif [ -f dist/frontend-app/index.html ]; then \
    echo 'Serving dist/frontend-app'; \
    exec serve -s dist/frontend-app -l 80; \
  elif [ -f dist/index.html ]; then \
    echo 'Serving dist'; \
    exec serve -s dist -l 80; \
  else \
    echo '❌ No se encontró index.html en dist/'; \
    echo 'Contenido:' && find dist -maxdepth 3 -type f | sed 's|^| - |'; \
    exit 1; \
  fi"]
