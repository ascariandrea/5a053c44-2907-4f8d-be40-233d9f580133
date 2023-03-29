#! /bin/bash

set -ex

yarn build

./scripts/migrate.sh ".env.test"

yarn test:cov

./scripts/migrate.sh ".env"

./scripts/db-seed.sh ".env"