# Use an official Node.js runtime as a parent image
FROM node:20-bullseye as build

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# Set the working directory in the container
WORKDIR /home/node/app

# Switch user
RUN addgroup --gid 1017 --system appgroup \
  && adduser --uid 1017 --system appuser --gid 1017

# Copy the application files to the working directory
COPY --chown=node:node .  /home/node/app/.

# Install app dependencies
RUN npm install

# Builds all assets needed to be onto a browser
RUN npm run build

# Stage: copy production assets and dependencies
FROM build as deploy

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
USER 1017

CMD [ "npm", "start" ]