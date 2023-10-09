# Builder stage
FROM --platform=$BUILDPLATFORM node:lts-alpine AS builder
ARG TARGETPLATFORM
ARG BUILDPLATFORM

RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=@trashify/trash-service --docker

# Development Installer stage
FROM --platform=$BUILDPLATFORM node:lts-alpine AS development-installer
ARG TARGETPLATFORM
ARG BUILDPLATFORM

RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
COPY --from=builder /app/turbo.json ./turbo.json
RUN yarn install --frozen-lockfile

# Production Installer stage
FROM --platform=$BUILDPLATFORM node:lts-alpine AS production-installer
ARG TARGETPLATFORM
ARG BUILDPLATFORM

RUN apk update
RUN apk add --no-cache libc6-compat
RUN apk add jq
WORKDIR /app
COPY --from=builder /app/out/json/apps/trash-service .
COPY --from=builder /app/out/json/yarn.lock ./yarn.lock
COPY --from=builder /app/out/json/.npmrc ./.npmrc
RUN yarn install --production

# Sourcer stage
FROM --platform=$BUILDPLATFORM node:lts-alpine AS sourcer
ARG TARGETPLATFORM
ARG BUILDPLATFORM

RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=development-installer /app/ .
COPY --from=builder /app/out/full/ .
RUN yarn turbo run build --scope=@trashify/trash-service --include-dependencies --no-deps

# Development stage
FROM --platform=$BUILDPLATFORM node:lts-alpine AS development
ARG TARGETPLATFORM
ARG BUILDPLATFORM

ENV NODE_ENV=development

RUN apk update
WORKDIR /app
COPY --from=sourcer /app/ .
WORKDIR /app/apps/trash-service/
ENTRYPOINT ["yarn", "start:dev"]

# Production stage
FROM --platform=$BUILDPLATFORM node:lts-alpine AS production
ARG TARGETPLATFORM
ARG BUILDPLATFORM

ENV NODE_ENV=production

RUN apk update
WORKDIR /app
COPY --chown=node:node --from=production-installer /app/node_modules/ ./node_modules/
COPY --chown=node:node --from=sourcer /app/apps/trash-service/dist ./dist
COPY --chown=node:node --from=sourcer /app/apps/trash-service/proto ./proto
USER node
CMD ["node", "dist/main.js"]
