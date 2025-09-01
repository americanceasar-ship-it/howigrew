# Production-ready Dockerfile for HowiGrew LMS Platform

# Use official Node.js LTS image
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install system dependencies for production
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    && ln -sf python3 /usr/bin/python

# Copy package files
COPY package*.json ./

# Install dependencies with production optimizations
RUN npm ci --only=production --no-audit --no-fund \
    && npm cache clean --force

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs \
    && adduser -S lmsuser -u 1001

WORKDIR /app

# Copy built application and dependencies
COPY --from=base --chown=lmsuser:nodejs /app/node_modules ./node_modules
COPY --from=base --chown=lmsuser:nodejs /app/dist ./dist
COPY --from=base --chown=lmsuser:nodejs /app/package*.json ./

# Install Python for scraping functionality
RUN apk add --no-cache python3 py3-pip py3-requests py3-beautifulsoup4

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Switch to non-root user
USER lmsuser

# Expose port
EXPOSE 5000

# Start application
CMD ["node", "dist/index.js"]