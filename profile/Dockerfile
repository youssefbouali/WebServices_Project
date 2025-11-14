FROM node:18-alpine

WORKDIR /app

# Copier uniquement les dépendances
COPY package*.json ./

# Installer les dépendances sans dev
RUN npm ci

# Copier le reste
COPY . .

# Construire le projet
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
