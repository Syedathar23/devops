FROM node:18-alpine

# Install build dependencies for packages like bcrypt
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["node", "app.js"]
