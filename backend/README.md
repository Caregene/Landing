# Backend Monorepo (FastAPI Microservices)

This backend contains a microservices-ready monorepo with multiple FastAPI services, shared libraries, and infrastructure tooling.

## Structure

```
backend/
  services/
    identity-svc/
    consent-svc/
    files-svc/
    model-gateway/
    api-gateway/
  libs/
    clients/
    utils/
    shared_protos/
  infra/
    helm/
    k8s/
    seed/
  scripts/
  .github/workflows/
  docker-compose.yml
```

## Quick start

1) Create local `.env` files as needed (examples inline in each service and in compose environment).

2) Start dev stack (Postgres, Redis, MinIO, services):

```bash
cd backend
./scripts/dev.sh
```

Alternatively:

```bash
cd backend
docker compose up --build
```

3) Seed sample data:

```bash
cd backend
./scripts/seed.sh
```

## Services

- identity-svc: Authentication/authorization primitives (users, tokens)
- consent-svc: Consent records and policy checks
- files-svc: Object storage broker (MinIO)
- model-gateway: Abstraction to downstream AI model providers
- api-gateway: Edge/API gateway facade for frontend

Each service exposes `/healthz` and `/readyz` for probes.

## Development

- Each service has its own `requirements.txt` and Dockerfile
- Shared code resides in `libs/clients` and `libs/utils`
- API contracts live in `libs/shared_protos` (OpenAPI and gRPC)

## Testing

Run unit tests per service:

```bash
cd backend/services/identity-svc
pytest -q
```

## CI

GitHub Actions workflow in `.github/workflows/ci.yml` runs lint and tests.








