FROM node:20-slim AS base
WORKDIR /client

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

FROM base AS dev
ENV NODE_ENV=development

EXPOSE 5173

CMD ["pnpm", "run", "dev"]

FROM base AS build
ENV NODE_ENV=production
RUN pnpm run build

# https://alvincrespo.hashnode.dev/react-vite-production-ready-docker
# https://medium.com/@pvasu3658/guide-to-dockerizing-and-deploying-your-vite-react-app-8ed6eaca002e
FROM nginx:1.27-alpine AS prod
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /client/dist ./

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]