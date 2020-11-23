
const FileReader = require("./fileReader.js");
const fs = require('fs');
const fsPromises = fs.promises;

module.exports = class FileReaderFS extends FileReader {
    constructor(postsFolder) {
        super();
        this.postsFolder = postsFolder;
    }

    async getFiles() {
        return fsPromises.readdir(this.postsFolder);  
    }

    async getFile(file) {
        try {
            let rawPostData = await fsPromises.readFile(this.postsFolder + file);
            return rawPostData.toString();
        } catch (e) {
            console.error(`Could not retrieve file from file system: ${e.message}`);
            throw(e);
        }
    }

    getId(file){
        return file;
    }
}
