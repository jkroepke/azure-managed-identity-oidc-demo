FROM nginxinc/nginx-unprivileged:1.23-alpine

ARG KEYCLOAK_URL

WORKDIR /tmp/

COPY index.html /usr/share/nginx/html/index.html

USER root
RUN sed -i "s!http://localhost:8080!${KEYCLOAK_URL}!" /usr/share/nginx/html/index.html
USER nginx
