# ---- Stage 1: build static files bằng Vite ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
# Nếu đã có package-lock.json (nên commit), đổi thành: RUN npm ci
RUN npm install
COPY . .
RUN npm run build

# ---- Stage 2: Nginx phục vụ file tĩnh + proxy /api ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=15s --timeout=3s CMD wget -qO- http://localhost/ || exit 1
