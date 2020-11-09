# My deadly simple CMS for lasiestaamericana.com

## Pre-requisites

- Docker
- Docker Compose
- AWS credentials in ~/.aws or environment variables
  > Environment variables can be defined inside your shell session using `export VAR=value` or setting them in .env file. See `.env.template` for more information.

## Usage

```bash
# Create .env file based on .env.example
$ make envfile DOTENV=.env.example

# Install dependencies
$ make deps

# Test
$ make test
# Build
$ make build

# Deploy to AWS
$ make deploy
# Clean your folder
$ make clean
```

Acknowledgements

- Thanks to great amaysim Australia's great Docker solution for Serverless: https://github.com/amaysim-au/docker-serverless. Pretty cool stuff :)