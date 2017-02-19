const stream = require('koa-stream');
const path = require('path');

module.exports = function* () {
	yield stream.file(this, 'raw', { root: path.join(__dirname, '../streamSrc/') });
}