module.exports = class PostViewModel {
    constructor(post) {
        this.post = post;
    }

    get file() {
        return this.post.file;
    } 

    get body() {
        return this.post.body;
    } 

    get summary() {
        return this.post.summary;
    } 

    get image() {
        return this.post.image;
    } 

    get title() {
        return this.post.title;
    } 

    get date() {
        return this.post.date;
    } 

    get path() {
        return '/' + process.env.POSTS_PATH + '/' + this.file;
    }

    static fromArray(posts) {
        return posts.map(post => new PostViewModel(post));
    }

}
