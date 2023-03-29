#! /bin/sh

set -x

env=${1:-'.env'}

DOTENV_CONFIG_PATH=$env yarn db-seed