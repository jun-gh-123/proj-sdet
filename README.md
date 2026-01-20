# SDET Project
Simple project for learning SDET things:
- Playwright (e2e testing)
- Jest (unit and integration testing)
- Docker (dev ops)
## Commands
1. Build docker images:
`docker compose build`
2. Start docker containers (app and db): `docker compose up` or `docker compose up -d` (to run in background)
3. Run e2e: `docker compose --profile e2e run --rm e2e`
