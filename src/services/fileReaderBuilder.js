const FileReaderS3 = require("./fileReaderS3.js");
const FileReaderFS = require("./fileReaderFS.js");

module.exports = class FileReaderBuilder {
    constructor(env) {
        this.env = env;
    }

    getFileReader() {
        if (this.useS3()) {
            console.info("Using S3 reader");
            return new FileReaderS3(this.env.POSTS_S3_BUCKET);
        }
        else  {
            console.info("Using file system reader");
            return new FileReaderFS(this.env.POSTS_FOLDER);
        }
    }

    useS3() {
        return (this.env.USE_S3 == "true");
    }
}
