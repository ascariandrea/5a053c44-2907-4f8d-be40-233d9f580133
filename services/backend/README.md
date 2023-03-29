# Tour planner Back Office API with NestJS

## Requirements

- node >= 16
- yarn >= 3.5

## Installation

```bash
# install
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## DB Seed

Running this script will insert 3 users and 40 travels with 40 tours each in the DB. The users credentials are printed when the script completes.

```bash
# insert data in db defined in .env
$ ./scripts/db-seed.sh

# insert data in db defined in .env.test
$ ./scripts/db-seed.sh .env.test
```
