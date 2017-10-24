#!/bin/bash
## gets run on host server
mkdir -p ~/datahub-api
cd ~/datahub-api || exit

rm -rf datahub-api.git && \
  git clone --depth 1 -b spotlights --single-branch git@github.com:devinit/datahub-api.git datahub-api-staging.git

echo 'finished clonning'

cd datahub-api-staging || exit # go into application directory

rm -rf datahub-api-staging/.git # no need for git history

echo 'rebuilding datahub-api docker containers'

# make sure you added the db credentials to .bashrc or bash_profile as environment variables
docker build --build-arg DB_USER=$DB_USER --build-arg DB_HOST=$DB_HOST --build-arg DB_PORT=$DB_PORT \
    --build-arg DB_PASSWORD=$DB_PASSWORD --build-arg DB_DATABASE=$DB_DATABASE -t datahub-api-staging .

docker stop datahub-app-api-staging

docker rm datahub-app-api-staging

docker run -it -d -p 6000:3000 --name datahub-app-api datahub-api





