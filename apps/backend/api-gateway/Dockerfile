# Builder stage
FROM --platform=$BUILDPLATFORM node:lts-alpine AS builder
ARG TARGETPLATFORM
ARG BUILDPLATFORM

RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=@trashify/api-gateway --docker

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
RUN yarn turbo run build --scope=@trashify/api-gateway --include-dependencies --no-deps

# Development stage
FROM --platform=$BUILDPLATFORM node:lts-alpine AS development
ARG TARGETPLATFORM
ARG BUILDPLATFORM

ENV PROTO_PATH=../../../../../node_modules/@trashify/transport
ENV NODE_ENV=development

RUN apk update
WORKDIR /app
COPY --from=sourcer /app/ .
WORKDIR /app/apps/api-gateway/
ENTRYPOINT ["yarn", "start:dev"]

# Production stage
FROM --platform=$BUILDPLATFORM node:lts-alpine AS production
ARG TARGETPLATFORM
ARG BUILDPLATFORM

ARG API_GATEWAY_PORT=50000
ENV API_GATEWAY_PORT=$API_GATEWAY_PORT
ENV NODE_ENV=production
ENV PROTO_PATH=node_modules/@trashify/transport

RUN apk update
WORKDIR /app
COPY --chown=node:node --from=sourcer /app/node_modules/ ./node_modules/
COPY --chown=node:node --from=sourcer /app/apps/api-gateway/dist/ ./dist/
USER node
CMD ["node", "dist/main.js"]
EXPOSE $API_GATEWAY_PORT