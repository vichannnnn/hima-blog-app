.ONESHELL:
SHELL = bash

backend_container := backend
docker_run := docker compose run --rm
docker_backend := $(docker_run) $(backend_container)


-include ./Makefile.properties

hello:
	echo "Hello, world!"

build:
	docker compose -f docker-compose.$(version).yml stop && docker compose -f docker-compose.$(version).yml build --no-cache && docker compose -f docker-compose.$(version).yml up -d

stop:
	docker compose -f docker-compose.$(version).yml down

runserver:
	docker exec -it $(backend_container) uvicorn app.main:app --port 9000 --host 0.0.0.0 --reload

runbackend:
	docker compose -f docker-compose.yml up -d --build

migrate:
	$(docker_backend) alembic upgrade head

migrations:
	$(docker_backend) alembic revision --autogenerate -m $(name)

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

