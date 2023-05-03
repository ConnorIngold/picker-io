# --- Build your client app ---

# Use a separate build stage for the client
FROM node:18-alpine as client-builder

# Set the working directory for the client
WORKDIR /client

# Copy package*.json files for the client
COPY client/package*.json ./

# Install dependencies for the client
RUN npm install

# Copy the client source code
COPY client/ .

# Build the client app
RUN npm run build

# --- Build your Express server ---

# Create a directory for the app and set it as the working directory
FROM node:18-alpine

WORKDIR /dist

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the TypeScript source code
COPY . .

# Copy the client build output from the client-builder stage
COPY --from=client-builder /client/dist ./client/dist

# Compile the TypeScript code
RUN npm run build

# Expose the app's port
EXPOSE 3001

# Set the command to start the app
CMD ["npm", "start"]