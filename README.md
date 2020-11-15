# My deadly simple CMS for lasiestaamericana.com

## Pre-requisites

- Docker
- Docker Compose
- AWS credentials in ~/.aws or environment variables
  
Environment variables can be defined inside your shell session using `export VAR=value` or setting them in `.env` file. See `env.example` for more information.

## Usage

Create .env file based on .env.example:

    $ make envfile ENVFILE=env.example

Install dependencies:

    $ make deps

Test:

    $ make test

Build:

    $ make build

Deploy to AWS (dev stage):

    $ make deploy-dev

Clean your folder

    $ make clean


## Acknowledgements

- Thanks to @amaysim-au for their great solution for Serverless & Docker: https://github.com/amaysim-au/docker-serverless. Pretty cool stuff :)