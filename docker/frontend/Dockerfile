# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Install dependencies
COPY app/frontend/package*.json ./
RUN npm ci

# Copy source code
COPY app/frontend/ .

# Build for production
RUN npm run build

# Runtime stage
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 