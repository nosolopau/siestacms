'use strict';

const serverless = require('serverless-http');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();
app.set('view engine', 'ejs');
app.set('views','src/views');
app.use('/public', express.static('public'));
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

        res.render('post', {post: postView, layout: 'layout'})
    }
    catch (e) {
        handlePostError(e, res);
    }
})

function handlePostError(e, res) {
    console.error(e);
    
    let code = 500;
    switch (e.code) {
        case 'ENOENT':
            code = 404;
            break;
    }
    res.status(code).redirect('/');
}

function handleError(e, res) {
    console.error(e);

    res.status(500).render('error', {error: e});
}

module.exports.handler = serverless(app);
