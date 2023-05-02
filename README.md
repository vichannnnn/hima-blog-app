# Hima Blog

Blog single-page web application developed for my personal use because I couldn't be bothered using Wordpress, Medium or any other stuff like that, so I just decided to speedrun this bespoke blog for myself. You can check out my live version at https://blog.himaa.me.

Developed with React, TypeScript, Chakra, Vite on the frontend and FastAPI, Python, Postgres and SQLAlchemy on the backend.
DevOps handled with Docker, Docker Compose, Caddy and Make.

## Set up and Deployment

- Run your Python on the shell and type in this, copy the result and paste into the `.env_example` for your `SECRET_KEY`.

```python
import secrets
secret_key = secrets.token_hex(32)
```

- Run the following command 

```
touch .env
# Copy the content from .env_example into .env and edit based on your own needs.

make build version="prod"
make prodmigrations name="init"
make prodmigrate 
```

```
touch .env
# Copy the content from .env_example into .env and edit based on your own needs.

make build version="dev"
make devmigrations name="init"
make devmigrate 
```

## Usage

Go to `http://localhost:8000/api/v1/docs` to access the endpoints from the Swagger UI 
Go to `http://localhost:5173` to access the frontend.

You can also run `make runserver` to access the same application connected to the same database in port 9000, this is purely for debugging purpose.

You can run `make check` to run your code through mypy, pylint and pytest as a pre-hook commit for your own projects. 

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.
