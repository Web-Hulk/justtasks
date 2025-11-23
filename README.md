# Development
docker compose -f docker/dev/docker-compose.dev.yaml --env-file docker/dev/.env.dev up

# Staging
docker compose -f docker/staging/docker-compose.staging.yaml --env-file docker/staging/.env.staging up

# Production
docker compose -f docker/prod/docker-compose.prod.yaml --env-file docker/prod/.env.prod up