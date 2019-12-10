#!/bin/bash
echo "Logging into Docker registry"

docker login -u $DOCKER_HUB_USER -p $DOCKER_HUB_PASSWORD

echo "Tagging current image"

currentHash=$(git rev-parse --short=8 HEAD)
imageName="benandryan1/revelio2:$currentHash"

echo "Tagging image as: $imageName"

docker build -t $imageName .
docker push $imageName

echo "Image push complete"
