# Multi-stage
# 1) Node image for building frontend assets
# 2) nginx stage to serve frontend assets

# Name the node stage "builder"
FROM node:14 AS builder
# SETUP ENV
ARG DNS_NAME
ARG HTTP_SCHEMA
ARG OAUTH2_GITHUB_CLIENT_ID
ARG VUE_APP_ENVIRONMENT
ENV VUE_APP_TITLE="UniFrame"
ENV VUE_APP_CONTACT_EMAIL=info@uniframe.io
ENV VUE_APP_CONTACT_LINKEDIN=https://www.linkedin.com/company/sun-analytics-bv
ENV VUE_APP_GITHUB_LOGIN_URL=https://github.com/login/oauth/authorize?client_id=${OAUTH2_GITHUB_CLIENT_ID}
ENV VUE_APP_GOOGLE_ANALYTICS_ID=G-88GCXNTL61 
ENV VUE_APP_ENVIRONMENT=${VUE_APP_ENVIRONMENT}

# ECS
ENV VUE_APP_BASE_URL=${HTTP_SCHEMA}://${DNS_NAME}:8000/api/v1
ENV VUE_APP_DOCUMENTS_BASE_URL=${HTTP_SCHEMA}://${DNS_NAME}:8082

# Set working directory
WORKDIR /app
# Copy all files from current directory to working dir in image
COPY . .
# install node modules and build assets
RUN yarn install --no-optional && yarn build

# nginx state for serving content
FROM nginx:alpine
# set up nginx conf. https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=builder /app/dist .
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
