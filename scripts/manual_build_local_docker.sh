# This file build image for local docker-compose environment

# N.B. the repository is ...-frontend-local-...

if [ $# -eq 0 ]; then
    echo "You must at least input --deploy_env=prod|dev"
    exit 1
fi

while [ "$1" != "" ]; do
 case $1 in
    -e | --deploy-env)
       shift
       DEPLOY_ENV=$1
      ;;

 esac
 shift
done

PRODUCT_PREFIX=uniframe
AWS_REGION=eu-west-1
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text) 
echo "Account_ID=${ACCOUNT_ID}"

# N.B. the different is this image is pushed to dedicated frontend repository
FRONTEND_REPO=$(aws ssm get-parameters --names ${PRODUCT_PREFIX}-${DEPLOY_ENV}-ssm-frontend-local-repo-name --query "Parameters[*].Value | [0]" | tr -d '"')

OAUTH_GITHUB_SECRET=$(aws secretsmanager get-secret-value --secret-id ${PRODUCT_PREFIX}-${DEPLOY_ENV}-oauth-github-client-secret --region eu-west-1 --query SecretString --output text)
OAUTH2_GITHUB_CLIENT_ID=$(echo ${OAUTH_GITHUB_SECRET} | jq .OAUTH2_GITHUB_CLIENT_ID | tr -d '"')

# since it is just a script for build the image and test local deployment, we don't actually login ECR
# aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

docker build --build-arg DNS_NAME=localhost --build-arg HTTP_SCHEMA=http --build-arg OAUTH2_GITHUB_CLIENT_ID=${OAUTH2_GITHUB_CLIENT_ID} --build-arg VUE_APP_ENVIRONMENT=${DEPLOY_ENV} -t ${FRONTEND_REPO} . -f Dockerfile
docker tag ${FRONTEND_REPO}:latest ${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${FRONTEND_REPO}:latest

# docker push ${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${FRONTEND_REPO}:latest
