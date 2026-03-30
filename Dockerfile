# Backend Dockerfile - Node.js/Express (Use Pre-built Dist)
FROM node:20-alpine

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm install --omit=dev

# Copy source code and pre-built dist files
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app

# Change to dist directory for proper module resolution
WORKDIR /app/dist

USER nodejs

EXPOSE 5000

CMD ["node", "server.js"]