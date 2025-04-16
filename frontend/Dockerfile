# Verwende ein noch schlankeres Basis-Image
FROM node:22-alpine

# Setze das Arbeitsverzeichnis
WORKDIR /app

# Kopiere nur package.json und package-lock.json
COPY package*.json ./

# Installiere nur die Produktions-Abhängigkeiten
RUN npm install --force --only=production

# Kopiere nur die nötigen Dateien
COPY . .

# Baue das Projekt
#RUN npm run build

EXPOSE 3000

# Setze den Container auf den Startbefehl
CMD ["npm", "start"]