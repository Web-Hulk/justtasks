FROM node:20-slim AS base
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

FROM node:20-slim AS final
WORKDIR /server

RUN corepack enable

COPY --from=build /server/dist ./dist
COPY --from=base /server/package.json ./
COPY --from=base /server/pnpm-lock.yaml ./
# Not sure if it is needed (Only if used in runtime!) - I will test it when container is created
COPY --from=build /server/prisma ./prisma
COPY --from=build /server/src/generated ./src/generated

RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000

CMD ["pnpm", "run", "start"]