# Backend Dockerfile - Node.js/Express
FROM node:20-alpine

WORKDIR /app

# Install ALL dependencies (including dev dependencies for building)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript (needs dev dependencies)
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm prune --omit=dev

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 5000

CMD ["node", "dist/server.js"]