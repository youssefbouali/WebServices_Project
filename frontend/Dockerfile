# Use Node 21
FROM node:21-alpine

WORKDIR /app

RUN npm install -g pnpm@10.14.0

COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN npm run build    # Build both client and server

EXPOSE 8080

CMD ["npm", "run", "start"]   # Serve built server
