FROM nginxinc/nginx-unprivileged:1.23-alpine

ARG KEYCLOAK_HOSTNAME

WORKDIR /tmp/

COPY index.html /usr/share/nginx/html/index.html

USER root
RUN sed -i "s!http://localhost:8080!https://${KEYCLOAK_HOSTNAME}!" /usr/share/nginx/html/index.html
USER nginx
