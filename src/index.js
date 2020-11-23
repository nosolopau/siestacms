'use strict';

const serverless = require('serverless-http');

const parser = require('fast-xml-parser');
const express = require('express');
const fs = require('fs');
const fsPromises = fs.promises;
const expressLayouts = require('express-ejs-layouts');
const {S3} = require("aws-sdk");
const s3 = new S3();

const app = express();
app.set('view engine', 'ejs');
app.set('views','src/views');
app.use('/public', express.static('public'));
app.use(expressLayouts);

const postsFolder = './posts/';
const Post = require("./models/post.js");

app.get('/', async (req, res, next) => {
    try {
        const posts = await loadPosts();
        res.render('index', {posts: posts, layout: 'layout'});
    } catch (e) {
        console.error(e);

        return next(e);
    }
})

app.get('/posts/:file', async (req, res, next) => {
    try {
        const post = await loadPost(req.params.file);
        res.render('post', {post: post, layout: 'layout'})
    }
    catch (e) {
        handlePostNotFoundError(e, res);
    }
})

async function loadPosts() {
    let posts = [];

    if(process.env.USE_S3 == "true") {
        let params = {
            Bucket: process.env.POSTS_S3_BUCKET
        };
        let files = await getFilesRecursively(params);
        for(let file of files) {
            const post = await loadPostFromS3(file.Key);
            posts.push(post);
        }
    } else {
        let files = await fsPromises.readdir(postsFolder);  
        for(let file of files) {
            const post = await loadPostFromFile(file);
            posts.push(post);
        }
    }
    return posts;
}

async function loadPost(file){
    if (process.env.USE_S3 == "true") {
        return await loadPostFromS3(file);
    } 
    else {
        return await loadPostFromFile(file);
    }
}

async function loadPostFromFile(file) {
    let rawPostData = await fsPromises.readFile(postsFolder + file);
    return new Post(file, parser.parse(rawPostData.toString(), {stopNodes: "body"}));
}

async function loadPostFromS3(objectKey) {
    try {
        const params = {
            Bucket: process.env.POSTS_S3_BUCKET,
            Key: objectKey 
        }
        let rawPostData = await s3.getObject(params).promise();
        return new Post(objectKey, parser.parse(rawPostData.Body.toString('utf-8'), {stopNodes: "body"}));
    } catch (e) {
        console.error(`Could not retrieve file from S3: ${e.message}`);
        throw(e);
    }
}

function handlePostNotFoundError(e, res) {
    console.error(e);
    
    let code = 500;
    switch (e.code) {
        case 'ENOENT':
            code = 404;
            break;
    }

    res.status(code).redirect('/');
}

async function getFilesRecursively(param) {
    let result = await s3.listObjectsV2(param).promise();

    if (!result.IsTruncated) {
        return result.Contents;
    } else {
        param.ContinuationToken = result.NextContinuationToken;
        return result.Contents.concat(await getFilesRecursively(param));
    }
}

module.exports.handler = serverless(app);
