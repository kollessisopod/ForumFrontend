# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy only package.json first (cache friendly)
COPY package.json ./

# Copy the rest (includes package-lock.json / npm-shrinkwrap.json if present)
COPY . .

# Install deps depending on which lock exists
RUN if [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then npm ci; else npm install; fi

RUN npm run build

# Runtime stage
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
