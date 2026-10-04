
const FileReader = require("./fileReader.js");
const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;

module.exports = class FileReaderFS extends FileReader {
    constructor(postsFolder) {
        super();
        this.postsFolder = postsFolder;
    }

    async getFiles() {
        const entries = await fsPromises.readdir(this.postsFolder, {withFileTypes: true});
        return entries.filter(entry => entry.isFile() && entry.name.endsWith('.html')).map(entry => entry.name);
    }

    async getFile(file) {
        try {
            if (file !== path.basename(file) || file.includes('\\') || !file.endsWith('.html')) {
                const error = new Error('Post not found');
                error.code = 'ENOENT';
                throw error;
            }
            let rawPostData = await fsPromises.readFile(path.join(this.postsFolder, file));
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
