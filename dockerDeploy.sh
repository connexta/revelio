#!/bin/bash
echo "Logging into Docker registry"

docker login -u $DOCKER_HUB_USER -p $DOCKER_HUB_PASSWORD

echo "Tagging current image to push into $DOCKER_REPO_URL"

currentHash=$(git rev-parse --short=8 HEAD)
imageName="$DOCKER_REPO_URL:$currentHash"

echo "Tagging image as: $imageName"

docker build -t $imageName .
docker tag $imageName $DOCKER_REPO_URL:latest
docker push $imageName
docker push $DOCKER_REPO_URL:latest

echo "Image push complete and viewable at https://hub.docker.com/repository/docker/$DOCKER_REPO_URL"
