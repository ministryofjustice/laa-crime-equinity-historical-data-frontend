# Use an official Node.js runtime as a parent image
FROM node:20-bullseye as base

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# Set the working directory in the container
WORKDIR /home/node/app

# Change ownership of the working directory to node user
RUN chown -R node:node /home/node/app

# Switch to the node user
USER node

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy the application files to the working directory
COPY --chown=node:node . .

# Install app dependencies
RUN npm install

# Builds all assets needed to be onto a browser.
RUN npm run build

# Expose the port that the app will run on
EXPOSE 4000

# Define the command to run your app
CMD ["node", "dist/index.js"]