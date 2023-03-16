# azure-managed-identity-oidc-demo
This repo this for demo purpose. This is a demo demonstrate, how to assume a Azure user managed identity as external user using azure workload identity.

Reference: https://learn.microsoft.com/en-us/azure/active-directory/develop/workload-identities-overview

## Overview

![](https://learn.microsoft.com/en-us/azure/active-directory/develop/media/workload-identity-federation/workflow.svg)

# Requirements

* Keycloak from docker-compose.yaml needs to be public available through HTTPS Port 443
* Access to an Azure Subscription with the Permissions to create User assigned managed identities
* A system with a working docker environment
* Authenticated Azure CLI
* A DNS Hostname that is pointing to your hosted keycloak instance (You can use a hostname from https://sslip.io)

# Step 1 - Create 2 managed identities in Azure

## Step 1.1 - Create a Resource Group

Skip to Step 1.2, if you already have a resource grou

```bash
az group create -n oidc-demo -l westeurope
```

## Step 1.2 - Create user assigned managed identities

```bash
az identity create -n demouser1 -g oidc-demo -o table
az identity create -n demouser2 -g oidc-demo -o table
```

The output contains the `ClientId` and `TenantId`. Save the values.

## Step 2 - Setup Keycloak

## Step 2.1 - Prepare .env file

Open `.env` file and use the values from step 1.3.

```ini
KEYCLOAK_ADMIN_PASSWORD= #define a password of your choice
KEYCLOAK_HOSTNAME=keycloak.localhost # Public routable hostname of Keycloak Instance
FRONTEND_HOSTNAME=keycloak.localhost # Public routable hostname of web Instance
AZURE_TENANT_ID=9c1de352-64a4-4509-b3fc-4ef2df8db9b8 # TenantId from step 1.2 (should be equal)
AZURE_CLIENT_ID_DEMO1=7806b049-b18e-422c-9dfd-750636ab16c6 # ClientId of demouser1 from step 1.2
AZURE_CLIENT_ID_DEMO2=c8635071-e956-415f-bbfb-58b7bdad013d # ClientId of demouser2 from step 1.2
```

## Step 2.2 - Run the containers

Ensure, that you pass a `KEYCLOAK_ADMIN_PASSWORD` and a `KEYCLOAK_URL` before running

```bash
docker compose up
```

The Keycloak and Demo Frontend will spin up. By default, the Keycloak listen on port `8080` and the frontend on port `3000`.
The Keycloak port needs to be publicly exposed by a load balancer of your choice. The endpoints need to be https and should 
redirect to port 8080.

The demo will also spin up a [traefik](https://traefik.io/) container. By default, traefik does the load balancer
and issues lets encrypt certificates automatically.

## Step 3 - Configure Federated Credentials

```bash
az identity federated-credential create --name demouser1 --identity-name demouser1 --resource-group oidc-demo --issuer https://$KEYCLOAK_URL/realms/demo --subject demouser1 --audiences account -o table
az identity federated-credential create --name demouser2 --identity-name demouser2 --resource-group oidc-demo --issuer https://$KEYCLOAK_URL/realms/demo --subject demouser2 --audiences account -o table
```
