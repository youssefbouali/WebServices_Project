# Use Node 21
FROM node:20.19.0-alpine

# Set working directory
WORKDIR /app

# Configure npm to use a reliable registry mirror
RUN npm config set registry https://registry.npmmirror.com

# Copy package files
COPY package.json ./

# Install all dependencies with npm (tolerate peer conflicts)
RUN npm install --no-audit --legacy-peer-deps

# Copy the full source code
COPY . .

# Expose port
EXPOSE 8080

# Start the application directly
CMD ["npm", "run", "dev"]
