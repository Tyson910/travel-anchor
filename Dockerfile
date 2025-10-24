# Use official Bun image
FROM oven/bun:latest AS base
WORKDIR /app

# Copy package files and install dependencies
COPY package.json bun.lock ./
COPY data-access-layer/package.json ./data-access-layer/
COPY hono-api/package.json ./hono-api/
COPY react-router-app/package.json ./react-router-app/

RUN bun install --frozen-lockfile --filter hono-api --filter data-access-layer

# Copy source code
COPY . .

# Build the data-access-layer first, then hono-api
RUN bun --filter './data-access-layer' build
RUN bun --filter './hono-api' build

# Production stage
FROM oven/bun:latest AS production
WORKDIR /app

# Copy built artifacts and dependencies
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/data-access-layer/dist ./data-access-layer/dist
COPY --from=base /app/hono-api/dist ./hono-api/dist
COPY --from=base /app/hono-api/package.json ./hono-api/

# Expose port
EXPOSE 3000

# Start the application
CMD ["bun", "run", "--cwd", "hono-api", "start"]