const Post = require("../models/post.js");
const parser = require('fast-xml-parser');

module.exports = class PostLoader {
    constructor(fileReader) {
        this.fileReader = fileReader;
    }

    async getPosts() {
        let posts = [];
        let files = await this.fileReader.getFiles();

        for(let file of files) {
            const post = await this.getPost(this.fileReader.getId(file));
            posts.push(post);
        }
        return posts;
    }

    async getPost(id) {
        let content = await this.fileReader.getFile(id);
        return new Post(id, parser.parse(content, {stopNodes: "body"}));
    }
}
