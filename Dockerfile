# syntax=docker/dockerfile:1
# Build stage with BuildKit cache mounts
FROM node:25-alpine AS builder

# Install pnpm and dependencies needed for some packages
RUN apk add --no-cache python3 make g++ && \
    corepack enable && \
    corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml ./

# Use BuildKit cache mount for pnpm cache
# This significantly speeds up pnpm install by caching downloaded packages
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --prefer-offline

# Copy source files
COPY . .

# Build the application
RUN pnpm run build

# Production stage - smaller final image
FROM node:25-alpine AS production

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