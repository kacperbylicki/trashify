# Builder stage
FROM --platform=$BUILDPLATFORM node:lts-alpine AS builder
ARG TARGETPLATFORM
ARG BUILDPLATFORM

RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=@trashify/accounts-service --docker

# Development Installer stage
FROM --platform=$BUILDPLATFORM node:lts-alpine AS development-installer
ARG TARGETPLATFORM
ARG BUILDPLATFORM

RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/json/yarn.lock ./yarn.lock
COPY --from=builder /app/turbo.json ./turbo.json
RUN yarn install --frozen-lockfile

# Production Installer stage
FROM --platform=$BUILDPLATFORM node:lts-alpine AS production-installer
ARG TARGETPLATFORM
ARG BUILDPLATFORM
# Accept NPM token as a build argument
ARG NPM_READ_TOKEN

RUN apk update
RUN apk add --no-cache libc6-compat
RUN apk add jq
WORKDIR /app
COPY --from=builder /app/out/json/apps/accounts-service .
COPY --from=builder /app/out/json/yarn.lock ./yarn.lock
# Create .npmrc file with the provided NPM token
RUN echo "@trashify:registry=https://registry.npmjs.org/" > .npmrc && \
    echo "//registry.npmjs.org/:_authToken=${NPM_READ_TOKEN}" >> .npmrc && \
    yarn install --production && \
    rm -f .npmrc

# Sourcer stage
FROM --platform=$BUILDPLATFORM node:lts-alpine AS sourcer
ARG TARGETPLATFORM
ARG BUILDPLATFORM

RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=development-installer /app/ .
COPY --from=builder /app/out/full/ .
RUN yarn turbo run build --scope=@trashify/accounts-service --include-dependencies --no-deps

# Development stage
FROM --platform=$BUILDPLATFORM node:lts-alpine AS development
ARG TARGETPLATFORM
ARG BUILDPLATFORM

ENV NODE_ENV=development

RUN apk update
WORKDIR /app
COPY --from=sourcer /app/ .
WORKDIR /app/apps/accounts-service/
ENTRYPOINT ["yarn", "start:dev"]

# Production stage
FROM --platform=$BUILDPLATFORM node:lts-alpine AS production
ARG TARGETPLATFORM
ARG BUILDPLATFORM

ENV NODE_ENV=production

RUN apk update
WORKDIR /app
COPY --chown=node:node --from=production-installer /app/node_modules/ ./node_modules/
COPY --chown=node:node --from=sourcer /app/apps/accounts-service/dist ./dist
COPY --chown=node:node --from=sourcer /app/apps/accounts-service/proto ./proto
USER node
CMD ["node", "dist/main.js"]