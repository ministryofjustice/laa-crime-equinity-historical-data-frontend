# Use an official Node.js runtime as a parent image
FROM node:20-bullseye as base

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# Set the working directory in the container
WORKDIR /home/node/app

# Change ownership of the working directory to node user
#RUN chown -R node:node /home/node/app

# Switch to the node user
RUN addgroup --gid 1017 --system appgroup \
  && adduser --uid 1017 --system appuser --gid 1017
#USER node

# Copy package.json and package-lock.json to the working directory
#COPY package*.json ./
#COPY package*.json /home/node/app/.

# Copy the application files to the working directory
#COPY --chown=node:node . .
COPY --chown=node:node package.json /home/node/app/.
COPY --chown=node:node .  /home/node/app/.

# Install app dependencies
RUN npm install

# Builds all assets needed to be onto a browser.
RUN npm run build
#COPY dist /home/node/app/.

# Expose the port that the app will run on
#EXPOSE 4000

# Define the command to run your app
#CMD ["node", "dist/index.js"]

#FROM node:16.14-bullseye-slim
#
#ENV NODE_ENV=development
#
#RUN addgroup --gid 1017 --system appgroup \
#  && adduser --uid 1017 --system appuser --gid 1017
#
#WORKDIR /app
#
#COPY . .
#
#RUN npm install
#
#RUN chown -R appuser:appgroup /app
#
#USER 1017
#
##RUN chmod +x start.sh
#
#CMD ["node", "dist/index.js"]

# Stage: copy production assets and dependencies
FROM base

COPY --from=build --chown=appuser:appgroup \
        /home/node/app/package.json \
        /home/node/app/package-lock.json \
        ./

COPY --from=build --chown=appuser:appgroup \
        /home/node/app/assets ./assets

COPY --from=build --chown=appuser:appgroup \
        /home/node/app/dist ./dist

COPY --from=build --chown=appuser:appgroup \
        /home/node/app/node_modules ./node_modules

EXPOSE 4000
ENV NODE_ENV='production'
USER 1017

CMD [ "npm", "start" ]