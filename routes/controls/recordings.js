module.exports = function * () {
	this.render('controls/recordings', {playState: this.synced.get('video.playState')});
}