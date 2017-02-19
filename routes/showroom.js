module.exports = function* () {
	this.render('showroom', {
		video: {
			src: this.synced.get('videoSrc')
		}
	});
}