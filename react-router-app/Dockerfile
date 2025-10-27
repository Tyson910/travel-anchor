# Use Node.js for build stage (better React Router compatibility)
FROM node:lts-alpine AS base
WORKDIR /app

# Copy package files and install dependencies
COPY package.json bun.lock ./
COPY data-access-layer/package.json ./data-access-layer/
COPY hono-api/package.json ./hono-api/
COPY react-router-app/package.json ./react-router-app/

# Install Bun first
RUN npm install -g bun

# Install dependencies without running prepare scripts
RUN bun install --frozen-lockfile --ignore-scripts

# Copy source code
COPY . .

# Build the entire workspace to ensure all dependencies are available
RUN bun --filter './data-access-layer' build

# Change to react-router-app directory and run prepare + build
WORKDIR /app/react-router-app
RUN bun run prepare
RUN bun run build

# Go back to root for consistency
WORKDIR /app

# Use the Caddy image for serving
FROM caddy
WORKDIR /app

# Copy Caddyfile
COPY react-router-app/Caddyfile ./
RUN caddy fmt Caddyfile --overwrite

# Copy built files from react-router-app build/client to dist
COPY --from=base /app/react-router-app/build/client ./dist

# Use Caddy to run/serve the app
CMD ["caddy", "run", "--config", "Caddyfile", "--adapter", "caddyfile"]