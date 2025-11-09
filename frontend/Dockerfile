# Use Node 21
FROM node:21-alpine

WORKDIR /app

RUN npm install -g pnpm@10.14.0

RUN apk add --no-cache bash git build-base python3

COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile

COPY . .

# Build production client + server
RUN npm run build

# Expose port
EXPOSE 8080

# Serve production build
CMD ["npm", "run", "start"]
