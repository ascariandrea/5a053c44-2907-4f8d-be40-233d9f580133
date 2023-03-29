#! /bin/sh


env=${1:-'.env'}

echo "$env"

docker-compose down --volumes
mv ./src/migrations/Migration20230501151556.ts ./src/migrations/Migration20230501151556.tsm
rm -r ./src/migrations/*.ts
rm -r ./src/migrations/*.json

docker-compose up -d db db-test

export MIKRO_ORM_ENV=$env

yarn mikro-orm migration:create --initial
mv ./src/migrations/Migration20230501151556.tsm ./src/migrations/Migration20230501151556.ts

sleep 2

yarn mikro-orm migration:up