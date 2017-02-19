const crawl = require('../lib/crawler');
const path = require('path');

module.exports = function* (source) {
	let logOutput = yield crawl({
		source: source,
		imgPath: path.join(__dirname, '/../public/cardImages'),
		jsonPath: path.join(__dirname + '/../public/cards.json'),
		forceDownload: this.query.forceDownload === 'true'
	});
	this.render('importSuccess', { logOutput: logOutput });
}