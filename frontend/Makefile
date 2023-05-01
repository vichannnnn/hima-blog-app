.ONESHELL:
SHELL = bash

backend_container := hima-blog-frontend
docker_run := docker compose run --rm
docker_frontend := $(docker_run) $(frontend_container)

-include ./Makefile.properties

hello:
	echo "Hello, world!"

build:
	docker compose -f docker-compose.dev.yml stop && docker compose -f docker-compose.dev.yml build --no-cache && docker compose up -d

prod:
	docker compose -f docker-compose.prod.yml stop && docker compose -f docker-compose.prod.yml build --no-cache && docker compose up -d
