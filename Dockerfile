# Use the official Node.js image.
FROM node:14

# Create and set the working directory.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json.
COPY package*.json ./

# Install npm dependencies.
RUN npm install

# Copy the rest of your application code.
COPY . .

# Expose port (if needed).
EXPOSE 2910

# Command to run the application.
CMD [ "node", "index.ts" ]