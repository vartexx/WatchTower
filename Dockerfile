# Use official Node.js 20 Alpine image
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci

# Copy project files
COPY . .

# Build Vite frontend bundle into dist/
RUN npm run build

# Production runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV TARGET_PATH=/target

# Copy package manifests and production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy server code, built frontend dist, and untouched SIH26163 UI
COPY server ./server
COPY sih26163 ./sih26163
COPY --from=builder /app/dist ./dist

# Create mount point for target repository
RUN mkdir -p /target

EXPOSE 3001

CMD ["node", "server/server.js"]
