.ONESHELL:
SHELL = bash

backend_container := backend
docker_run := docker compose run --rm
docker_backend := $(docker_run) $(backend_container)
docker_compose_production_run := docker compose -f docker-compose.prod.yml run --rm $(backend_container)
docker_compose_dev_run := docker compose -f docker-compose.dev.yml run --rm $(backend_container)

-include ./Makefile.properties

hello:
	echo "Hello, world!"

build:
	docker compose -f docker-compose.$(version).yml stop && docker compose -f docker-compose.$(version).yml build --no-cache && docker compose -f docker-compose.$(version).yml up -d

stop:
	docker compose -f docker-compose.$(version).yml stop

runserver:
	docker exec -it $(backend_container) uvicorn app.main:app --port 9000 --host 0.0.0.0 --reload

runbackend:
	docker compose -f docker-compose.yml up -d --build

prodmigrate:
	$(docker_compose_production_run) alembic upgrade head

prodmigrations:
	$(docker_compose_production_run) alembic revision --autogenerate -m $(name)

migrate:
	$(docker_compose_dev_run) alembic upgrade head

migrations:
	$(docker_compose_dev_run) alembic revision --autogenerate -m $(name)

migrateversion:
	$(docker_backend) alembic upgrade $(version)

stamp:
	$(docker_backend) alembic stamp $(version)

pylint:
	$(docker_backend) pylint ./app --disable=C0114,C0115,C0116,R0903,R0913,C0411 --extension-pkg-whitelist=pydantic --load-plugins pylint_flask_sqlalchemy

mypy:
	$(docker_backend) mypy ./app --install-types

check: pylint \
	mypy \
	tests \

tests:
	$(docker_backend) pytest ./app/tests -x -vv

