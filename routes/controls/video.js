const parse = require('co-busboy');
const fs = require('fs');
const coFs = require('co-fs');
const path = require('path');

module.exports = function* () {
	// check if form was submitted, if so, updated values and upload file
	if (this.request.is('multipart/*')) {
		let parts = parse(this, { autoFields: true });
		let part;
		while (part = yield parts) {
			part.pipe(fs.createWriteStream(path.join(__dirname, 'tmp')));
		}
		// sync received videoSrc
		this.synced.set('video', {
			type: parts.field.videoType,
			src:  parts.field.videoSrc,
			playState: this.synced.get('video.playState'),
			volume: this.synced.get('video.volume')
		});
		// move file if size > 0
		let stats = yield coFs.stat(path.join(__dirname, 'tmp'));
		if (stats.size > 0) {
			yield coFs.rename(path.join(__dirname, 'tmp'), path.join(__dirname, '../../streamSrc/raw'));
		}
	}
	// serve view
	this.render('controls/video', {
		videoType: this.synced.get('video.type'),
		videoSrc: this.synced.get('video.src'),
		videoVolume: this.synced.get('video.volume')
	});
}