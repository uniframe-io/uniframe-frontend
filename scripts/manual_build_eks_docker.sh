# This file build image for EKS environment

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

if [ "$DEPLOY_ENV" == "dev" ]; then
    VUE_APP_GOOGLE_ANALYTICS_ID=G-88GCXNTL61
elif [ "$DEPLOY_ENV" == "prod" ]; then
    VUE_APP_GOOGLE_ANALYTICS_ID=G-2LXFHTCD04
else
    echo "DEPLOY_ENV error: not dev or prod"
    exit 1
fi

FRONTEND_REPO=$(aws ssm get-parameters --names ${PRODUCT_PREFIX}-${DEPLOY_ENV}-ssm-frontend-repo-name --query "Parameters[*].Value | [0]" | tr -d '"')
DNS_NAME=$(aws ssm get-parameters --names ${PRODUCT_PREFIX}-${DEPLOY_ENV}-ssm-eks-domain-name --query "Parameters[*].Value | [0]" | tr -d '"')

OAUTH_GITHUB_SECRET=$(aws secretsmanager get-secret-value --secret-id ${PRODUCT_PREFIX}-${DEPLOY_ENV}-oauth-github-client-secret --region eu-west-1 --query SecretString --output text)
OAUTH2_GITHUB_CLIENT_ID=$(echo ${OAUTH_GITHUB_SECRET} | jq .OAUTH2_GITHUB_CLIENT_ID | tr -d '"')

TIMESTAMP=$(date +%Y%m%d%H%M%S)
IMAGE_TAG=manual-${TIMESTAMP}

aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
docker build --build-arg DNS_NAME=${DNS_NAME} --build-arg HTTP_SCHEMA=https  --build-arg OAUTH2_GITHUB_CLIENT_ID=${OAUTH2_GITHUB_CLIENT_ID} --build-arg VUE_APP_GOOGLE_ANALYTICS_ID=${VUE_APP_GOOGLE_ANALYTICS_ID} --build-arg VUE_APP_ENVIRONMENT=${DEPLOY_ENV} -t ${FRONTEND_REPO}:${IMAGE_TAG} . -f Dockerfile.k8s
docker tag ${FRONTEND_REPO}:${IMAGE_TAG} ${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${FRONTEND_REPO}:${IMAGE_TAG}

# force page image
AWS_PAGER="" aws ecr batch-delete-image --repository-name ${FRONTEND_REPO} --image-ids imageTag=${IMAGE_TAG}
docker push ${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${FRONTEND_REPO}:${IMAGE_TAG}

echo ${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${FRONTEND_REPO}:${IMAGE_TAG}
