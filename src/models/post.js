module.exports = class Post {
    constructor(file, object) {
        this.file = file;
        this.title = object.head.title;
        this.date = object.head.date;
        this.summary = object.head.summary;
        this.image = object.head.image;
        this.body = object.body;
    }
}
