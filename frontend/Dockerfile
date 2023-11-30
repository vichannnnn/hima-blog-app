FROM oven/bun:1.0.14 as base

FROM base AS build

ENV VITE_APP_API_URL="https://api.blog.himaa.me/"
ENV VITE_APP_AWS_CLOUDFRONT_URL="https://image.himaa.me/"

WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM caddy:2.6.2-alpine AS deploy
EXPOSE 443
COPY --from=build /app/dist /usr/share/caddy/hima-blog-app/
