# Use Node 20
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.14.0

# Copy package files
COPY pnpm-lock.yaml package.json ./

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy the full source code
COPY . .

# Expose port
EXPOSE 8080

# Start the application directly
CMD ["npm", "run", "dev"]
