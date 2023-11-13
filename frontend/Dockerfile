FROM node:19 AS base

FROM base AS dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm i --frozen-lockfile

FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm build

FROM caddy:2.6.2-alpine AS deploy
EXPOSE 443
COPY --from=build /app/dist /usr/share/caddy/hima-blog-app/
