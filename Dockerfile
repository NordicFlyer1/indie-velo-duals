FROM node:18 as build-stage

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --non-interactive --pure-lockfile && yarn cache clean

COPY . .

RUN yarn build

FROM node:18-bullseye-slim as production-stage

COPY --from=build-stage /usr/src/app/.output /usr/src/app

ENV HOST 0.0.0.0
EXPOSE 3000

CMD ["node", "/usr/src/app/server/index.mjs"]
