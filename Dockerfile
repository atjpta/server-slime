FROM node:22-bookworm-slim AS builder
WORKDIR /app
RUN corepack enable && corepack prepare yarn@1.22.22 --activate
COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM ubuntu:24.04
RUN apt-get update && \
    apt-get install -y ca-certificates curl && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g yarn@1.22.22 && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json yarn.lock* ./
RUN yarn install --production --frozen-lockfile
COPY --from=builder /app/build ./build
EXPOSE 2567
CMD ["node", "build/index.js"]
