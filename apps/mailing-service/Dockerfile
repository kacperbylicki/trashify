# Builder stage
FROM --platform=$BUILDPLATFORM node:lts-alpine AS builder
ARG TARGETPLATFORM
ARG BUILDPLATFORM

RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=@trashify/mailing-service --docker

# Installer stage
FROM --platform=$BUILDPLATFORM node:lts-alpine AS installer
ARG TARGETPLATFORM
ARG BUILDPLATFORM

RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
COPY --from=builder /app/turbo.json ./turbo.json
RUN yarn install --frozen-lockfile

# Sourcer stage
FROM --platform=$BUILDPLATFORM node:lts-alpine AS sourcer
ARG TARGETPLATFORM
ARG BUILDPLATFORM

RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=installer /app/ .
COPY --from=builder /app/out/full/ .
RUN yarn turbo run build --scope=@trashify/mailing-service --include-dependencies --no-deps

# Development stage
FROM --platform=$BUILDPLATFORM node:lts-alpine AS development
ARG TARGETPLATFORM
ARG BUILDPLATFORM

ENV PROTO_PATH=../../../../../node_modules/@trashify/transport
ENV NODE_ENV=development

RUN apk update
WORKDIR /app
COPY --from=sourcer /app/ .
WORKDIR /app/apps/mailing-service/
ENTRYPOINT ["yarn", "start:dev"]

# Production stage
FROM --platform=$BUILDPLATFORM node:lts-alpine AS production
ARG TARGETPLATFORM
ARG BUILDPLATFORM

ARG MAILING_SERVICE_PORT=50013
ENV MAILING_SERVICE_PORT=$MAILING_SERVICE_PORT
ENV NODE_ENV=production
ENV PROTO_PATH=node_modules/@trashify/transport

RUN apk update
WORKDIR /app
COPY --chown=node:node --from=sourcer /app/node_modules/ ./node_modules/
COPY --chown=node:node --from=sourcer /app/apps/mailing-service/dist/ ./dist/
USER node
CMD ["node", "dist/main.js"]
EXPOSE $MAILING_SERVICE_PORT