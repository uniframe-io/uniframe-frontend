# This file build image for minikube environment
# push to ECR dev local repository

PRODUCT_PREFIX=uniframe
DEPLOY_ENV=dev
AWS_REGION=eu-west-1
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text) 
echo "Account_ID=${ACCOUNT_ID}"

OAUTH_GITHUB_SECRET=$(aws secretsmanager get-secret-value --secret-id ${PRODUCT_PREFIX}-${DEPLOY_ENV}-oauth-github-client-secret --region eu-west-1 --query SecretString --output text)
OAUTH2_GITHUB_CLIENT_ID=$(echo ${OAUTH_GITHUB_SECRET} | jq .OAUTH2_GITHUB_CLIENT_ID | tr -d '"')

VUE_APP_GOOGLE_ANALYTICS_ID=G-88GCXNTL61

FRONTEND_REPO=$(aws ssm get-parameters --names ${PRODUCT_PREFIX}-${DEPLOY_ENV}-ssm-frontend-local-repo-name --query "Parameters[*].Value | [0]" | tr -d '"')
DNS_NAME=uniframe-local.nl
IMAGE_TAG=minikube

eval $(minikube docker-env)  
docker build --build-arg DNS_NAME=${DNS_NAME} --build-arg HTTP_SCHEMA=http --build-arg OAUTH2_GITHUB_CLIENT_ID=${OAUTH2_GITHUB_CLIENT_ID} --build-arg VUE_APP_GOOGLE_ANALYTICS_ID=${VUE_APP_GOOGLE_ANALYTICS_ID} --build-arg VUE_APP_ENVIRONMENT=${DEPLOY_ENV} -t ${FRONTEND_REPO}:${IMAGE_TAG} . -f Dockerfile.k8s
docker tag ${FRONTEND_REPO}:${IMAGE_TAG} ${FRONTEND_REPO}:${IMAGE_TAG}
eval $(minikube docker-env -u)  
