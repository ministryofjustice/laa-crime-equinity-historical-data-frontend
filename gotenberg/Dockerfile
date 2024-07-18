# Stage: base image
FROM gotenberg/gotenberg:8
USER root

RUN usermod -u 1001 -g 1001 gotenberg

USER gotenberg
EXPOSE 3100
HEALTHCHECK CMD curl -f /health


