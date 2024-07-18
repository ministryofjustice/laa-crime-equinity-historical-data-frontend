# Stage: base image
FROM gotenberg/gotenberg:8
USER root

RUN usermod -u 1001 -g 1001 gotenberg

USER gotenberg
EXPOSE 3100
CMD gotenberg --api-port=3100 --chromium-ignore-certificate-errors --api-timeout=30s --pdfengines-engines=pdftk 

HEALTHCHECK CMD curl -f http://localhost:3100/health


