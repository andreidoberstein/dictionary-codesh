# server/Dockerfile

# --- Stage 1: build ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# --- Stage 2: runtime ---
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Porta interna (deixe 3000 p/ bater com o service da Railway)
EXPOSE 3000

# Retry de migrate (espera DB subir) e inicia o Nest
CMD sh -c '\
for i in 1 2 3 4 5; do \
  npx prisma migrate deploy && break || { echo "[migrate] falhou, retry em 5s"; sleep 5; }; \
done; \
node dist/main.js'
