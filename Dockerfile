# Use official Node.js image as the base
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy env before anything else to cache better
COPY .env .env

# Check if the file exists inside the container
RUN cat .env

# Copy dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Build app with env variables
RUN npm run build

# Expose port
EXPOSE 3000

# Start with host and port
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
