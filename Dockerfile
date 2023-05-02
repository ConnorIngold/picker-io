FROM node:18-alpine

# Create a directory for the app and set it as the working directory
WORKDIR /dist

# Copy the package.json and package-lock.json files
COPY package*.json .

# Install the dependencies
RUN npm install

# Copy the TypeScript source code
COPY . .

# Compile the TypeScript code
RUN npm run build

# Expose the app's port
EXPOSE 3001

# Set the command to start the app
CMD ["npm", "start"]