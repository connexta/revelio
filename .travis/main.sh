#!/bin/bash

# Set an option to exit immediately if any error appears
set -o errexit

main() {
  setup_dependencies

  echo "SUCCESS:
  Done! Finished setting up Travis machine.
  "
}

setup_dependencies() {
  echo "INFO:
  Setting up dependencies.
  "
  docker info
  docker-compose --version

  echo "Completed Installation Setup"
}

main
