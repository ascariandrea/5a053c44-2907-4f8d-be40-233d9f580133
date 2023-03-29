# Tour planner Back Office with Nuxt and NestJS

## Requirements

- node >= 16
- yarn >= 3.5

## Quick Test

Want to test the app right away?

```bash
yarn

# run the scripts
./scripts/run-all.sh

# run the nuxt command in one pane
$ PORT=3002 yarn backoffice start

# run the nest server in another pane
$ yarn backend start
```

Now you can open [localhost:3002](http://localhost:3002/) and try to login with users created during db seeding.

## Installation

```bash
yarn install
```

## Workspaces

The project is structured using _yarn workspaces_ and divided in 2 services and 1 package.


### Backoffice (Service)

[Backoffice](/services/backoffice/README.md) web app written in TypeScript with Nuxt

### Backend (Service)

[Backend](/services/backend/README.md) service written in TypeScript with NestJS

### Models (Package)

A [package](/packages/models/src/index.ts) for the models shared between [backend](/services/backend/README.md) and [backoffice](/services//backoffice/README.md).
