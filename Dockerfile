# Use the specific Node.js base image
FROM node:21

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Verify Node.js version (for development/debugging)
RUN node -v

# Expose port 5000 for the application
EXPOSE 5000

# Command to start the app in development mode
CMD ["npm", "run", "start:dev"]
