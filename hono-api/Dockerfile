# Use official Bun image
FROM oven/bun:latest AS base
WORKDIR /app

ARG DATABASE_PUBLIC_URL
ENV DATABASE_URL=$DATABASE_PUBLIC_URL

ARG FRONTEND_URL
ENV FRONTEND_URL=$FRONTEND_URL

# Copy package files and install dependencies
COPY package.json bun.lock ./
COPY data-access-layer/package.json ./data-access-layer/
COPY hono-api/package.json ./hono-api/
COPY react-router-app/package.json ./react-router-app/

RUN bun install --frozen-lockfile --ignore-scripts --filter './hono-api'

# Generate database types from data-access-layer
RUN cd data-access-layer && bun run db:inspect

# Copy source code
COPY . .

# Build the hono-api package
RUN cd hono-api && bun run build

# Production stage
FROM oven/bun:latest AS production
WORKDIR /app

# Install system fonts for text rendering in OG images
RUN apk add --no-cache \
    ttf-liberation \
    fontconfig \
    dejavu-fonts-ttf

ARG FRONTEND_URL
ENV FRONTEND_URL=$FRONTEND_URL

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Copy built artifacts and dependencies
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/data-access-layer ./data-access-layer
COPY --from=base /app/hono-api/dist ./hono-api/dist
COPY --from=base /app/hono-api/package.json ./hono-api/

# Expose port
EXPOSE 3000

# Start the application
CMD ["bun", "run", "--cwd", "hono-api", "start"]