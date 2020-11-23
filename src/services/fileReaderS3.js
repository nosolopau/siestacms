const FileReader = require("./fileReader.js");
const {S3} = require("aws-sdk");
const s3 = new S3();

module.exports = class FileReaderS3 extends FileReader {
    constructor(s3Bucket) {
        super();
        this.s3Bucket = s3Bucket;
    }

    async getFiles() {
        let params = {
            Bucket: this.s3Bucket
        };
        return this.getFilesRecursively(params);
    }

    async getFile(objectKey) {
        console.dir(objectKey)
        try {
            const params = {
                Bucket: this.s3Bucket,
                Key: objectKey 
            }
            let rawPostData = await s3.getObject(params).promise();
            return rawPostData.Body.toString('utf-8');
        } catch (e) {
            console.error(`Could not retrieve file from S3: ${e.message}`);
            throw(e);
        }
    }

    getId(file) {
        return file.Key;
    }

    async getFilesRecursively(param) {
        let result = await s3.listObjectsV2(param).promise();
    
        if (!result.IsTruncated) {
            return result.Contents;
        } else {
            param.ContinuationToken = result.NextContinuationToken;
            return result.Contents.concat(await this.getFilesRecursively(param));
        }
    }

}
