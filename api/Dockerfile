# ---------- STAGE 1 : build / install deps ----------
FROM node:18-alpine AS builder

WORKDIR /app

# On copie seulement les fichiers de dépendances
COPY package*.json ./

# Install des dépendances (prod uniquement)
RUN npm install --omit=dev

# On copie le code source
COPY src ./src
COPY openapi.yaml ./openapi.yaml

# ---------- STAGE 2 : image finale, légère ----------
FROM node:18-alpine

ENV NODE_ENV=production
WORKDIR /app

# On récupère aussi package.json pour garder "type": "module"
COPY --from=builder /app/package*.json ./

# On récupère uniquement ce qui est nécessaire depuis le builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/openapi.yaml ./openapi.yaml

EXPOSE 3000
CMD ["node", "src/app.js"]
