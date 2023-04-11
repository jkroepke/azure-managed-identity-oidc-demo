FROM node:lts AS build

WORKDIR /tmp/npm/

COPY package*.json .

RUN npm ci

COPY . .

RUN npx webpack


FROM nginxinc/nginx-unprivileged:1.23-alpine

ARG KEYCLOAK_HOSTNAME

WORKDIR /tmp/

COPY --from=build /tmp/npm/dist/ /usr/share/nginx/html/

USER root
RUN sed -i "s!http://localhost:8080!https://${KEYCLOAK_HOSTNAME}!" /usr/share/nginx/html/index.html
USER nginx
