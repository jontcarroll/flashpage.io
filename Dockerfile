# syntax=docker/dockerfile:1
# Build stage with BuildKit cache mounts
FROM node:24-alpine AS builder

# Install dependencies needed for some npm packages
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Use BuildKit cache mount for npm cache
# This significantly speeds up npm ci by caching downloaded packages
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit --progress=false

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Production stage - smaller final image
FROM node:24-alpine AS production

# Add non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy built output from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/.output ./.output

# Set production environment
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Switch to non-root user
USER nodejs

EXPOSE 3000

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {r.statusCode === 200 ? process.exit(0) : process.exit(1)})" || exit 1

CMD ["node", ".output/server/index.mjs"]