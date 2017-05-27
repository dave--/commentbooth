module.exports = function* () {
	// serve view
	this.render('controls/general', {
		scoreLeft: this.synced.get('score.left'),
		scoreRight: this.synced.get('score.right'),
		firstplayer: this.synced.get('firstplayer')
	});
}