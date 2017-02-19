module.exports = function (listName) {

	return function* () {
		// serve view
		this.render('controls/hand', {
			listName: listName
		});
	}
}