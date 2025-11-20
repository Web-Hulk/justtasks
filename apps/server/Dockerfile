# Add local DB for DEVELOPMENT
FROM node:20-alpine AS base
WORKDIR /server

RUN corepack enable 

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

FROM base AS dev
ENV NODE_ENV=development

EXPOSE 3000

CMD ["pnpm", "run", "dev"]

FROM base AS build
ENV NODE_ENV=production
ARG DATABASE_URL="postgresql://user:pass@localhost:5432/db"
ENV DATABASE_URL=${DATABASE_URL}

RUN pnpm exec prisma generate --schema=prisma/schema.prisma
RUN pnpm run build

FROM node:20-alpine AS prod
WORKDIR /server

RUN apk add --no-cache openssl

RUN corepack enable

COPY --from=build /server/dist ./dist
COPY --from=base /server/package.json ./
COPY --from=base /server/pnpm-lock.yaml ./
COPY --from=build /server/prisma ./prisma
COPY --from=build /server/src/generated ./src/generated

RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000

CMD ["pnpm", "run", "start"]
