# Stage: base image
FROM gotenberg/gotenberg:8
EXPOSE 3100

ENV TZ=Europe/London

HEALTHCHECK CMD curl -f http://localhost:3100/health