module.exports = function (listName, relevantButHiddenLists) {

	return function* () {
		// serve view
		this.render('controls/hand', {
			listName: listName,
			relevantButHiddenLists: relevantButHiddenLists || []
		});
	}
}