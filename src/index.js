'use strict';

const serverless = require('serverless-http');

const parser = require('fast-xml-parser');
const express = require('express');
const fs = require('fs');
const expressLayouts = require('express-ejs-layouts');

const app = express();
app.set('view engine', 'ejs');
app.set('views','src/views');
app.use('/public', express.static('public'));
app.use(expressLayouts);

const postsFolder = './posts/';
const Post = require("./models/post.js");

app.get('/', (req, res) => {
    let files = fs.readdirSync(postsFolder);   
    
    let posts = [];
    for(let file of files) {
        const post = loadPost(file)
        posts.push(post);
    }

    res.render('index', {posts: posts, layout: 'layout'});
})

app.get('/posts/:file', (req, res) => {
    try {
        const post = loadPost(req.params.file);
        res.render('post', {post: post, layout: 'layout'})
    }
    catch(e) {
        handleError(e, res);
    }
})

function loadPost(file){
    var rawPostData = fs.readFileSync(postsFolder + file).toString();
    return new Post(file, parser.parse(rawPostData, {stopNodes: "body"}));
}

function handleError(e, res) {
    let code = 500

    switch (e.code) {
        case 'ENOENT':
            code = 404
            break;
    }

    res.status(code).redirect('/');
}

module.exports.handler = serverless(app);

