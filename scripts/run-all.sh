#! /bin/bash

set -ex

yarn clean

yarn build

cd ./services/backend || exit 0

./scripts/migrate.sh ".env.test"

yarn test:cov

./scripts/migrate.sh

./scripts/db-seed.sh

cd ../../ || exit 0
