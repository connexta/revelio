#!/bin/bash

docker login -u $DOCKER_HUB_USER -p $DOCKER_HUB_PASSWORD

if [[ "$TRAVIS_BRANCH" == "docker-aws" ]]; then
  make push-image ;
fi

