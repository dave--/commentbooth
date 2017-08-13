// first off, load cards
synced.getCards(function (cards) {
	// save uppercase value of name to have easy, performance case-insenstive search
	// also save array index in object for easier referencing
	for (var i = cards.length - 1; i >= 0; i--) {
		cards[i].name_uppercase = cards[i].name.toUpperCase();
		cards[i].idx = i;
	}

	// handle card name search
	document.body.addEventListener('keyup', function (e) {
		if (e.target.name && e.target.name.indexOf('queryCard') > -1 && e.target.value.length > 2) {
			var html = '';
			var listName = e.target.parentNode.parentNode.getAttribute('data-addToListName');
			var searchTerm = e.target.value.toUpperCase();
			var resultsEl = e.target.parentNode.nextSibling;
			resultsEl.innerHTML = '';
			for (var i = cards.length - 1; i >= 0; i--) {
				if (cards[i].name_uppercase.indexOf(searchTerm) > -1) {
					resultsEl.appendChild(buildCardElement(cards[i], '', listName));
				}
			}
		}
	});
	// on card title click, expand card but only "locally" (meaning don't send any messages to server)
	document.body.addEventListener('click', function (e) {
		if (hasClass(e.target, 'panel-title')) {
			if (hasClass(e.target.parentNode, 'collapsed')) {
				removeClass(e.target.parentNode, 'collapsed');
			} else {
				addClass(e.target.parentNode, 'collapsed');
			}
		}
	});
});
