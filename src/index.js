'use strict';

const serverless = require('serverless-http');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();
app.set('view engine', 'ejs');
const path = require('path');
process.env.POSTS_PATH = process.env.POSTS_PATH || 'posts';
process.env.POSTS_FOLDER = process.env.POSTS_FOLDER || path.join(__dirname, '../posts');
app.set('views', path.join(__dirname, 'views'));
app.locals.pageTitle = 'SiestaCMS — Make space for your ideas';
app.locals.pageDescription = 'A small, simple home for big ideas. Publish with files, skip the database.';
app.locals.pageImage = '';
app.locals.post = null;
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use(expressLayouts);

const FileReaderBuilder = require("./services/fileReaderBuilder.js");
const PostLoader = require("./services/postLoader.js");
const PostViewModel = require("./view_models/post.js");

const fileReader = new FileReaderBuilder(process.env).getFileReader();
const postLoader = new PostLoader(fileReader);

app.get('/', async (req, res, next) => {
    try {
        const posts = await postLoader.getPosts();
        const postsView = PostViewModel.fromArray(posts);
        
        res.render('index', {posts: postsView, layout: 'layout'});
    } catch (e) {
        handleError(e, res);
    }
})

app.get('/' + process.env.POSTS_PATH + '/:file', async (req, res, next) => {
    try {
        const post = await postLoader.getPost(req.params.file);
        const postView = new PostViewModel(post);

        res.render('post', {post: postView, layout: 'layout', pageTitle: postView.title + ' — SiestaCMS', pageDescription: postView.summary, pageImage: postView.image})
    }
    catch (e) {
        handlePostError(e, res);
    }
})

function handlePostError(e, res) {
    console.error(e);
    
    let code = 500;
    switch (e.code) {
        case 'NoSuchKey':
        case 'ENOENT':
            code = 404;
            break;
    }
    res.status(code).render('error', {error: e, code, pageTitle: code === 404 ? 'Post not found — SiestaCMS' : 'Something went wrong — SiestaCMS'});
}

function handleError(e, res) {
    console.error(e);

    res.status(500).render('error', {error: e, code: 500});
}

module.exports.handler = serverless(app);

module.exports.app = app;
if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.info(`SiestaCMS is ready at http://localhost:${port}`));
}
