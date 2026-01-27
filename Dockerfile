# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy manifests first for caching
COPY package.json ./
# Copy lockfile if it exists (one of these). If none exists, npm will still work with npm install.
COPY package-lock.json* ./
COPY npm-shrinkwrap.json* ./

RUN if [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then npm ci; else npm install; fi

# Copy the rest
COPY . .

RUN npm run build

# Runtime stage
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
