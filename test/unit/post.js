'use strict';
const assert = require('assert');
const fs = require('fs').promises;
const os = require('os');
const path = require('path');
const http = require('http');
const FileReaderFS = require('../../src/services/fileReaderFS');
const PostLoader = require('../../src/services/postLoader');
const PostViewModel = require('../../src/view_models/post');

function request(server, url) {
    return new Promise((resolve, reject) => {
        http.get({host: '127.0.0.1', port: server.address().port, path: url}, response => {
            let body = '';
            response.on('data', chunk => body += chunk);
            response.on('end', () => resolve({status: response.statusCode, body}));
        }).on('error', reject);
    });
}

describe('File publishing', () => {
    let folder;
    beforeEach(async () => { folder = await fs.mkdtemp(path.join(os.tmpdir(), 'siesta-')); });
    afterEach(async () => { await fs.rm(folder, {recursive: true, force: true}); });
    it('loads HTML files without requiring a trailing slash and ignores directories', async () => {
        await fs.writeFile(path.join(folder, 'story.html'), '<head><title>A story</title><date>2026-01-01</date><summary>Hello</summary><image></image></head><body><p>Hello world</p></body>');
        await fs.writeFile(path.join(folder, 'notes.txt'), 'ignore me');
        await fs.mkdir(path.join(folder, 'draft.html'));
        const posts = await new PostLoader(new FileReaderFS(folder)).getPosts();
        assert.deepStrictEqual(posts.map(post => post.title), ['A story']);
        assert.strictEqual(posts[0].body, '<p>Hello world</p>');
    });
    it('rejects traversal and non-post files', async () => {
        const reader = new FileReaderFS(folder);
        for (const file of ['../README.md', '../story.html', '..\\story.html', 'notes.txt']) {
            await assert.rejects(reader.getFile(file), error => error.code === 'ENOENT');
        }
    });
    it('sorts newest first, with stable ordering for equal or invalid dates', async () => {
        const entries = { 'older.html': '2020-01-01', 'newer.html': '2026-01-01', 'undated.html': 'unknown' };
        const reader = {getFiles: async () => Object.keys(entries), getId: file => file,
            getFile: async file => `<head><title>${file}</title><date>${entries[file]}</date><summary></summary><image></image></head><body>Text</body>`};
        assert.deepStrictEqual((await new PostLoader(reader).getPosts()).map(post => post.file), ['newer.html', 'older.html', 'undated.html']);
    });
    it('calculates reading time and encodes post filenames', () => {
        const post = new PostViewModel({file: 'hello world.html', body: `<p>${'word '.repeat(401)}</p>`});
        assert.strictEqual(post.readingTime, 3);
        assert.ok(post.path.endsWith('/hello%20world.html'));
        assert.strictEqual(new PostViewModel({body: ''}).readingTime, 1);
    });
});

describe('HTTP pages', () => {
    let server;
    before(done => { server = require('../../src/index').app.listen(0, '127.0.0.1', done); });
    after(done => server.close(done));
    it('renders the journal and serves progressive search', async () => {
        const page = await request(server, '/');
        assert.strictEqual(page.status, 200);
        assert.ok(page.body.includes('Take it easy.'));
        assert.ok(page.body.includes('data-search='));
        assert.ok(page.body.includes('How to use it'));
        const script = await request(server, '/public/js/journal.js');
        assert.strictEqual(script.status, 200);
    });
    it('renders article HTML with article-specific metadata', async () => {
        const page = await request(server, '/posts/how-to-use.html');
        assert.strictEqual(page.status, 200);
        assert.ok(page.body.includes('<title>How to use it — SiestaCMS</title>'));
        assert.ok(page.body.includes('<h3>How to upload content</h3>'));
        assert.ok(page.body.includes('min read'));
    });
    it('returns a real 404 for missing posts', async () => {
        const page = await request(server, '/posts/missing.html');
        assert.strictEqual(page.status, 404);
        assert.ok(page.body.includes('This page took a siesta.'));
        assert.ok(!page.body.includes('ENOENT'));
    });
});
