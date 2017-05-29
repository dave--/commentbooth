var synced = (function () {
	var cards = [];

	// handle clicks on "synced" elements
	document.body.addEventListener('click', function (e) {
		if (hasClass(e.target, 'synced')) {
			// Play or Pause button clicked
			if (e.target.name === 'playState') {
				socket.emit('set', {
					key: 'video.playState',
					val: e.target.value
				});
			} else
			// Add card to list
			if (e.target.name === 'addCard' && cards) {
				socket.emit('set', {
					key: 'cards.' + e.target.getAttribute('data-listName') + '.' + Date.now(),
					val: cards[e.target.value]
				});
			} else
			// Remove card from list
			if (e.target.name === 'removeCard') {
				socket.emit('set', {
					key: 'cards.' + e.target.getAttribute('data-listName') + '.' + e.target.value,
					val: null
				});
			} else
			// Remove card from list
			if (e.target.name === 'expandCard') {
				socket.emit('set', {
					key: 'cards.' + e.target.getAttribute('data-listName') + '.' + e.target.value + '.expanded',
					val: true
				});
			} else
			// Remove card from list
			if (e.target.name === 'collapseCard') {
				socket.emit('set', {
					key: 'cards.' + e.target.getAttribute('data-listName') + '.' + e.target.value + '.expanded',
					val: false
				});
			}
		}
	});
	// handle changes on "synced" elements
	document.body.addEventListener('change', function (e) {
		if (hasClass(e.target, 'synced')) {
			// Change video volume
			if (e.target.name === 'videoVolume') {
				socket.emit('set', {
					key: 'video.volume',
					val: e.target.value
				});
			} else
			// change left player score
			if (e.target.name === 'scoreLeft') {
				socket.emit('set', {
					key: 'score.left',
					val: e.target.value
				})
			} else
			// change right player score
			if (e.target.name === 'scoreRight') {
				socket.emit('set', {
					key: 'score.right',
					val: e.target.value
				})
			} else
			// change firstplayer
			if (e.target.name === 'firstplayer') {
				socket.emit('set', {
					key: 'firstplayer',
					val: e.target.value
				})
			} else
			// change left player faction
			if (e.target.name === 'factionLeft') {
				socket.emit('set', {
					key: 'cards.leftMisc.faction',
					val: JSON.parse(e.target.value)
				})
			} else
			// change right player faction
			if (e.target.name === 'factionRight') {
				socket.emit('set', {
					key: 'cards.rightMisc.faction',
					val: JSON.parse(e.target.value)
				})
			} else
			// change left player agenda
			if (e.target.name === 'agendaLeft') {
				socket.emit('set', {
					key: 'cards.leftMisc.agenda',
					val: JSON.parse(e.target.value)
				})
			} else
			// change right player agenda
			if (e.target.name === 'agendaRight') {
				socket.emit('set', {
					key: 'cards.rightMisc.agenda',
					val: JSON.parse(e.target.value)
				})
			} else
			// change challenge icon
			if (e.target.name === 'challenge') {
				socket.emit('set', {
					key: 'challenge',
					val: e.target.value
				})
			}
		}
	});

	// init websocket
	var socket = io.connect('http://localhost:8081');

	// handle initial data
	socket.on('init', function (data) {
		for (var listName in data.cards) {
			for (var idx in data.cards[listName]) {
				if (data.cards[listName][idx] !== null) {
					controller.addCard(idx, listName, data.cards[listName][idx]);
				}
			}
		}
		controller.changeVideoSource(data.video.src);
		controller.changeVideoPlayState(data.video.playState);
		controller.setScore(data.score.left, 'left');
		controller.setScore(data.score.right, 'right');
		controller.setFP(data.firstplayer);
		controller.setChallengeIcon(data.challenge);
	});

	// handle updates sent from server and decide which controller function to call
	socket.on('update', function (data) {
		var key = data.key;
		var val = data.val;

		// A card list got updated
		if (key.indexOf('cards.') === 0) {
			var listName = key.substr(6, key.indexOf('.', 6) - 6);
			var cardIdx = key.substr(key.indexOf('.', 6) + 1);
			if (cardIdx.indexOf('.') > -1) {
				cardIdx = cardIdx.substr(0, cardIdx.indexOf('.'));
			}
			// remove card from list
			if (val === null) {
				controller.removeCard(cardIdx, listName);
			} else
			// Expand/Collapse specified card
			if (key.indexOf('expanded') > -1) {
				if (val === true) {
					controller.expandCard(cardIdx, listName);
				} else {
					controller.collapseCard(cardIdx, listName);
				}
			} else
			// if card with specified IDX already exists, replace it
			if ($('.' + listName + ' [data-cardIdx="' + cardIdx + '"]').length > 0) {
				controller.changeCard(cardIdx, listName, val);
			} else
			// Add card to list
			{
				controller.addCard(cardIdx, listName, val);
			}
		} else
		// change video source
		if (key === 'video.src') {
			controller.changeVideoSource(val);
		} else
		// change video play state (e.g. start playing or pause video)
		if (key === 'video.playState') {
			controller.changeVideoPlayState(val);
		} else
		// change video volume
		if (key === 'video.volume') {
			controller.changeVideoVolume(val);
		} else
		// change left player score
		if (key === 'score.left') {
			controller.setScore(val, 'left');
		} else
		// change right player score
		if (key === 'score.right') {
			controller.setScore(val, 'right');
		} else
		// change firstplayer
		if (key === 'firstplayer') {
			controller.setFP(val);
		} else
		// change challenge icon
		if (key === 'challenge') {
			controller.setChallengeIcon(val);
		}
	});

	var controller = {
		addCard: function (cardIdx, listName, cardData) {
			var targetLists = $('.' + listName);
			cardData.idx = cardIdx;
			for (var i = 0; i < targetLists.length; i++) {
				var el = buildCardElement(cardData, listName);
				targetLists[i].appendChild(el);
			}
		},
		removeCard: function (cardIdx, listName) {
			var targetCards = $('.' + listName + ' [data-cardIdx="' + cardIdx + '"]');
			// Only setting removed class to give some time for animations/transitions
			for (var i = 0; i < targetCards.length; i++) {
				addClass(targetCards[i], 'removed');
			}
			// After a few seconds we should be fine with actually removing the dom element
			window.setTimeout(function () {
				for (var i = 0; i < targetCards.length; i++) {
					targetCards[i].parentNode.removeChild(targetCards[i]);
				}
			}, 5000);
		},
		changeCard: function (cardIdx, listName, cardData) {
			var targetCards = $('.' + listName + ' [data-cardIdx="' + cardIdx + '"]');
			cardData.idx = cardIdx;
			for (var i = 0; i < targetCards.length; i++) {
				var el = buildCardElement(cardData, listName);
				targetCards[i].parentNode.replaceChild(el, targetCards[i]);
			}
		},
		expandCard: function (cardIdx, listName) {
			var targetCards = $('.' + listName + ' .panel[data-cardIdx="' + cardIdx + '"]');
			for (var i = 0; i < targetCards.length; i++) {
				removeClass(targetCards[i], 'collapsed');
			}
		},
		collapseCard: function (cardIdx, listName) {
			var targetCards = $('.' + listName + ' .panel[data-cardIdx="' + cardIdx + '"]');
			for (var i = 0; i < targetCards.length; i++) {
				addClass(targetCards[i], 'collapsed');
			}
		},
		changeVideoSource: function (newSrc) {
			var videos = $('video.video');
			for (var i = 0; i < videos.length; i++) {
				videos[i].src = newSrc;
			}
		},
		changeVideoPlayState: function (newPlayState) {
			var videos = $('video.video');
			for (var i = 0; i < videos.length; i++) {
				videos[i][newPlayState]();
			}
		},
		changeVideoVolume: function (newVolume) {
			var videos = $('video.video');
			for (var i = 0; i < videos.length; i++) {
				videos[i].volume = newVolume;
			}
		},
		setScore: function (newScore, whichPlayer) {
			var scoreEls = $('.' + whichPlayer + 'Score');
			for (var i = scoreEls.length - 1; i >= 0; i--) {
				scoreEls[i].setAttribute('data-score', newScore);
			}
		},
		setFP: function (newFP) {
			var allTokens = $('.firstplayerToken');
			for (var i = 0; i < allTokens.length; i++) {
				if (hasClass(allTokens[i], newFP + 'IsFP')) {
					removeClass(allTokens[i], 'hidden');
				} else if (!hasClass(allTokens[i], 'hidden')) {
					addClass(allTokens[i], 'hidden');
				}
			}
		},
		setChallengeIcon: function (newChallenge) {
			var els = $('.challengeIcon');
			for (var i = els.length - 1; i >= 0; i--) {
				els[i].setAttribute('data-challenge', newChallenge);
			}
		}
	}

	return {
		setCards: function (newCardsArray) {
			cards = newCardsArray;
		},
		getSocket: function () {
			return socket;
		}
	}
})();