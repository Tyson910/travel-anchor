# travel-anchor

A monorepo containing a Hono API backend and React Router SPA frontend.

## Services

- **API**: Hono-based backend service (port 3001)
- **SPA**: React Router single-page application (port 3000)

## Development

### Prerequisites
- [Bun](https://bun.sh/) installed
- Docker and Docker Compose (for containerized deployment)

### Local Development

```bash
# Install dependencies
bun install

# Build all packages
bun run build

# Start API server
bun --filter './hono-api' dev

# Start SPA dev server (in separate terminal)
bun --filter './react-router-app' dev
```

## Docker Deployment

### Quick Start

```bash
# Build and run both services
docker-compose up --build

# Run in detached mode
docker-compose up --build -d
```

### Individual Services

```bash
# Run only the API
docker-compose up --build api

# Run only the SPA
docker-compose up --build spa
```

### Service URLs

- **API**: http://localhost:3001
- **SPA**: http://localhost:3000

### Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## Project Structure

```
travel-anchor/
├── data-access-layer/     # Shared data access utilities
├── hono-api/            # Hono backend service
├── react-router-app/     # React Router SPA frontend
├── docker-compose.yml     # Docker Compose configuration
├── package.json          # Root package.json (workspace config)
└── bun.lock             # Lock file for all dependencies
```

## Technology Stack

- **Runtime**: Bun
- **Backend**: Hono
- **Frontend**: React Router v7
- **Database**: (configured in data-access-layer)
- **Deployment**: Docker + Caddy (for SPA)
