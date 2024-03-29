# Builder stage
FROM --platform=$BUILDPLATFORM node:18-alpine AS builder
ARG TARGETPLATFORM
ARG BUILDPLATFORM

RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=@trashify/api-gateway --docker

# Development Installer stage
FROM --platform=$BUILDPLATFORM node:18-alpine AS development-installer
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
FROM --platform=$BUILDPLATFORM node:18-alpine AS production-installer
ARG TARGETPLATFORM
ARG BUILDPLATFORM
# Accept NPM token as a build argument
ARG NPM_READ_TOKEN

RUN apk update
RUN apk add --no-cache libc6-compat
RUN apk add jq
WORKDIR /app
COPY --from=builder /app/out/json/apps/api-gateway .
COPY --from=builder /app/out/json/yarn.lock ./yarn.lock
# Create .npmrc file with the provided NPM token
RUN echo "@trashify:registry=https://registry.npmjs.org/" > .npmrc && \
    echo "//registry.npmjs.org/:_authToken=${NPM_READ_TOKEN}" >> .npmrc && \
    yarn install --production && \
    rm -f .npmrc

# Sourcer stage
FROM --platform=$BUILDPLATFORM node:18-alpine AS sourcer
ARG TARGETPLATFORM
ARG BUILDPLATFORM

RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=development-installer /app/ .
COPY --from=builder /app/out/full/ .
RUN yarn turbo run build --scope=@trashify/api-gateway --include-dependencies --no-deps

# Development stage
FROM --platform=$BUILDPLATFORM node:18-alpine AS development
ARG TARGETPLATFORM
ARG BUILDPLATFORM

ENV NODE_ENV=development

RUN apk update
WORKDIR /app
COPY --from=sourcer /app/ .
WORKDIR /app/apps/api-gateway/
ENTRYPOINT ["yarn", "start:dev"]

# Production stage
FROM --platform=$BUILDPLATFORM node:18-alpine AS production
ARG TARGETPLATFORM
ARG BUILDPLATFORM

# Accept service URLs as build arguments
ARG ACCOUNTS_SERVICE_URL
ARG MAILING_SERVICE_URL
ARG TRASH_SERVICE_URL
ARG API_GATEWAY_URL

ENV NODE_ENV=production
ENV ACCOUNTS_SERVICE_URL=${ACCOUNTS_SERVICE_URL}
ENV MAILING_SERVICE_URL=${MAILING_SERVICE_URL}
ENV TRASH_SERVICE_URL=${TRASH_SERVICE_URL}
ENV API_GATEWAY_URL=${API_GATEWAY_URL}

RUN apk update
WORKDIR /app
COPY --chown=node:node --from=production-installer /app/node_modules/ ./node_modules/
COPY --chown=node:node --from=sourcer /app/apps/api-gateway/dist ./dist
COPY --chown=node:node --from=sourcer /app/apps/api-gateway/proto ./proto
USER node
CMD ["node", "dist/main.js"]