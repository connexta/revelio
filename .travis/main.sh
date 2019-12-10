#!/bin/bash

# Set an option to exit immediately if any error appears
set -o errexit

# Main function that describes the behavior of the 
# script. 
# By making it a function we can place our methods
# below and have the main execution described in a
# concise way via function invocations.
main() {
  setup_dependencies

  echo "SUCCESS:
  Done! Finished setting up Travis machine.
  "
}

# Prepare the dependencies that the machine need.
# Here I'm just updating the apt references and then
# installing both python and python-pip. This allows
# us to make use of `pip` to fetch the latest `docker-compose`
# later.
# We also upgrade `docker-ce` so that we can get the
# latest docker version which allows us to perform
# image squashing as well as multi-stage builds.
setup_dependencies() {
  echo "INFO:
  Setting up dependencies.
  "

#  sudo apt-get update -y
#  sudo apt-get curl
#  sudo curl -L "https://github.com/docker/compose/releases/download/1.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
#  sudo chmod +x /usr/local/bin/docker-compose

  docker info
  docker-compose --version
  docker login -u benandryan1 -p andyandyandy

  echo "Completed Installation Setup"
}

main
