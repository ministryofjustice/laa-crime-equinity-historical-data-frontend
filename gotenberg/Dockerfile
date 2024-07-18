# Stage: base image
FROM gotenberg/gotenberg:8
RUN addgroup -S appgroup && adduser -u 1001 -S gotenberg -G appgroup
USER 1001
EXPOSE 3100
HEALTHCHECK CMD curl -f /health


