# SiestaCMS

A lightweight, simple, database free, serverless CMS for lazy people.

Project page: [siestacms.com](https://www.siestacms.com)

Related articles:

- [Why did I write a CMS in 2020](https://nosolopau.medium.com/why-did-i-write-a-cms-in-2020-6824ab1c42ca)
- [How to get a Serverless web app working with your own domain and SSL on AWS, the right way](https://nosolopau.medium.com/how-to-get-a-serverless-web-app-working-with-your-own-domain-and-ssl-on-aws-the-right-way-69d5b138d8c0?source=your_stories_page-------------------------------------)

## Run locally with Node.js

Use Node.js 22 or newer. No Docker or AWS credentials are needed for local posts.

```sh
npm ci
npm start
```

Open http://localhost:3000. Run `npm test` to check file loading and HTTP pages.
Set `PORT`, `POSTS_FOLDER`, or `POSTS_PATH` to customize the local server; defaults
are `3000`, the repository's `posts` folder, and `posts`. Shell environment
variables configure `npm start`; it does not load `.env` automatically.

The journal includes search, reading times, and newest-first ordering. Use ISO
dates (`2026-10-04`) for predictable sorting. Article titles, summaries, and
optional images become social metadata. Templates and CSS live in `src/views`
and `public`; no frontend build is needed. Post bodies are trusted author HTML,
so only publish content from people you trust.

The existing AWS deployment configuration is legacy (Node.js 12) and needs a
runtime and Serverless tooling upgrade before a new production deployment.

## How to install it

Pre-requisites:

- Docker & Docker Compose
- AWS credentials in `~/.aws` or environment variables
  
Environment variables can be defined inside your shell session using `export VAR=value` or setting them in `.env` file. See `env.example` for more information.


Install dependencies:

    $ make deps

Run locally:

    $ make server

More info & instructions: [siestacms.com/posts/how-to-install.html](https://www.siestacms.com/posts/how-to-install.html)

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

More info & customization options: [siestacms.com/posts/how-to-use.html](https://www.siestacms.com/posts/how-to-use.html)

## Acknowledgements

- Thanks to @amaysim-au for their great solution for Serverless & Docker: https://github.com/amaysim-au/docker-serverless. Pretty cool stuff :)
## Render preview

`render.yaml` defines a free Node.js web service for `feat/epic-siesta`.
Connect the repository in Render and create a Blueprint from this branch,
or create a Web Service with `npm ci --omit=dev --ignore-scripts` as the build
command and `npm start` as the start command. Use Node.js 22, set `ENV=prod`,
and leave `USE_S3=false`. Render supplies `PORT`; no AWS credentials are required.
The preview is public and free instances sleep after inactivity.
