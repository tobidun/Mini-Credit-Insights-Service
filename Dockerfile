FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install all dependencies (not just production)
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"] 