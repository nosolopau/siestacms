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

    get readingTime() {
        const words = String(this.body || '').replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
        return Math.max(1, Math.ceil(words / 200));
    }

    get path() {
        return '/' + process.env.POSTS_PATH + '/' + encodeURIComponent(this.file);
    }

    static fromArray(posts) {
        return posts.map(post => new PostViewModel(post));
    }

}
