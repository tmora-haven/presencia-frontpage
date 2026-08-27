# ---- build -----------------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app

# Build-time config: the WordPress origin is baked into the static bundle.
ARG VITE_WP_API_URL=https://presenciapr.com
ENV VITE_WP_API_URL=$VITE_WP_API_URL

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

# ---- serve -----------------------------------------------------------------
FROM nginx:1.27-alpine AS serve

# The CSP must allow the same origin the bundle talks to. Defaults to the build ARG;
# override WP_ORIGIN at runtime if you ever point the image elsewhere.
ARG VITE_WP_API_URL=https://presenciapr.com
ENV WP_ORIGIN=$VITE_WP_API_URL
ENV NGINX_ENVSUBST_FILTER=^WP_ORIGIN$

RUN rm /etc/nginx/conf.d/default.conf
COPY deploy/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/healthz >/dev/null || exit 1
CMD ["nginx", "-g", "daemon off;"]
