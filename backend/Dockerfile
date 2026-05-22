FROM node:18-alpine

RUN apk add --no-cache python3 make g++ && apk add --no-cache curl

WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "app.js"]
