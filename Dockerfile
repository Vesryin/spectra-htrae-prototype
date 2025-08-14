# Stage 1: Build client and server
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json tsconfig*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build client
RUN npm run build:client

# Build server (TypeScript -> JS)
RUN npm run build:server

# Stage 2: Run
FROM node:20-alpine

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Expose server port
EXPOSE 3000

# Start the server
CMD ["node", "dist/server/index.js"]