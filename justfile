set dotenv-load := true

DOCKERHUB_USERNAME := env_var("DOCKERHUB_USERNAME")
DOCKERHUB_TOKEN := env_var("DOCKERHUB_TOKEN")
VERSION := env_var("VERSION")

docker-login:
    echo "{{DOCKERHUB_TOKEN}}" | docker login -u "{{DOCKERHUB_USERNAME}}" --password-stdin

docker-build-push service:
    #!/usr/bin/env bash
    set -euo pipefail

    SERVICE="{{service}}"
    IMAGE="{{DOCKERHUB_USERNAME}}/${SERVICE}"

    MAJOR="$(echo "{{VERSION}}" | cut -d. -f1)"
    MINOR="$(echo "{{VERSION}}" | cut -d. -f1,2)"

    docker build \
      -t "${IMAGE}:{{VERSION}}" \
      -t "${IMAGE}:${MINOR}" \
      -t "${IMAGE}:${MAJOR}" \
      "./${SERVICE}"

    docker push "${IMAGE}:{{VERSION}}"
    docker push "${IMAGE}:${MINOR}"
    docker push "${IMAGE}:${MAJOR}"

docker-build-push-all:
    just docker-build-push frontend
    just docker-build-push backend