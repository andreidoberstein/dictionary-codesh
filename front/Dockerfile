# Multi-stage build: build with Node, serve with Nginx

# 1) Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci || npm i
RUN npm run build

# 2) Runtime stage
FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Basic SPA config: serve index.html for all routes
RUN sed -i 's#try_files \$uri \$uri/#try_files \$uri \$uri/ /index.html#g' /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
