# Stage: base image
FROM node:20.11-bookworm-slim as base

# ARG BUILD_NUMBER
#ARG GIT_REF
#ARG GIT_BRANCH

LABEL maintainer="LAA ..... <....@.......justice.gov.uk>"

ENV TZ=Europe/London
RUN ln -snf "/usr/share/zoneinfo/$TZ" /etc/localtime && echo "$TZ" > /etc/timezone

#RUN addgroup --gid 2000 --system appgroup && \
   #     adduser --uid 2000 --system appuser --gid 2000
RUN addgroup --gid 10001 --system appgroup && \
        adduser --uid 10001 --system appuser --gid 10001
# RUN addgroup -S appgroup && adduser -u 10001 -S appuser -G appgroup
WORKDIR /app

# Cache breaking and ensure required build / git args defined
#RUN test -n "$BUILD_NUMBER" || (echo "BUILD_NUMBER not set" && false)
#RUN test -n "$GIT_REF" || (echo "GIT_REF not set" && false)
#RUN test -n "$GIT_BRANCH" || (echo "GIT_BRANCH not set" && false)

# Define env variables for runtime health / info
#ENV BUILD_NUMBER=${BUILD_NUMBER}
#ENV GIT_REF=${GIT_REF}
#ENV GIT_BRANCH=${GIT_BRANCH}

RUN apt-get update && \
        apt-get upgrade -y && \
        apt-get autoremove -y && \
        rm -rf /var/lib/apt/lists/*

# Stage: build assets
FROM base as build

#ARG BUILD_NUMBER
#ARG GIT_REF
#ARG GIT_BRANCH

COPY package*.json ./
RUN CYPRESS_INSTALL_BINARY=0 npm ci --no-audit

COPY . .
RUN npm run build

RUN npm prune --no-audit --omit=dev

# Stage: copy production assets and dependencies
FROM base

COPY --from=build --chown=appuser:appgroup \
        /app/package.json \
        /app/package-lock.json \
        ./

COPY --from=build --chown=appuser:appgroup \
        /app/assets ./assets

COPY --from=build --chown=appuser:appgroup \
        /app/dist ./dist

COPY --from=build --chown=appuser:appgroup \
        /app/node_modules ./node_modules

EXPOSE 3000 3001
ENV NODE_ENV='production'

# You must use a UID, not a username, here
USER 10001
RUN chown -R 10001:0 "/.npm"
CMD [ "npm", "start" ]
