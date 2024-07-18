# Stage: base image
FROM gotenberg/gotenberg:8
USER root

RUN usermod -u 1001 -g 1001 gotenberg

USER gotenberg
EXPOSE 3000
CMD gotenberg --api-port=3000 --chromium-ignore-certificate-errors --api-timeout=30s --pdfengines-engines=pdftk 

HEALTHCHECK CMD curl -f http://localhost:3100/health
