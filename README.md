# SiestaCMS

A lightweight, simple, database free, serverless CMS for lazy people.

## Pre-requisites

- Docker
- Docker Compose
- AWS credentials in ~/.aws or environment variables
  
Environment variables can be defined inside your shell session using `export VAR=value` or setting them in `.env` file. See `env.example` for more information.

## How to install it

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

## How to use it

1. Create a new file (for example with name `my-post.html`) under `/posts` with this structure:

        <head>
            <title>Hey! This is a new post</title>
            <date>01/01/2020</date>
            <summary>This summary will appear in the index</summary>
            <image></image>
        </head>
        <body>
            <p>This is my first paragraph.</p>
        </body>
2. Deploy the service.
3. The post will appear in the index page and under `/posts/my-post.html`
4. Done!

## How to use it with S3

1. Create a bucket: `aws s3api create-bucket --bucket siestacms-posts-prod`
2. Push the files: `aws s3 sync posts s3://siestacms-posts-dev`

## Acknowledgements

- Thanks to @amaysim-au for their great solution for Serverless & Docker: https://github.com/amaysim-au/docker-serverless. Pretty cool stuff :)