# Stage 1: Build frontend
FROM node:22-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY src/ src/
COPY public/ public/

RUN npm run build

# Stage 2: Production
FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm install tsx

COPY --from=build /app/dist dist/
COPY server/ server/

ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

CMD ["npx", "tsx", "server/index.ts"]
