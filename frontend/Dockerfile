FROM oven/bun:1.0.14 as base

FROM base AS build

WORKDIR /app

ENV NODE_ENV=production

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build


FROM caddy:2.6.2-alpine AS deploy
EXPOSE 443
COPY --from=build /app/.next /usr/share/caddy/hima-blog-app/
