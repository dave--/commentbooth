var synced = (function () {
	var cards = [],
		discardPile = {},
		hls;

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
			} else
			// Reset all data
			if (e.target.name === 'reset') {
				socket.emit('reset');
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
			} else
			// hide/show left player used and unused plot piles
			if (e.target.name === 'leftHidePlots') {
				socket.emit('set', {
					key: 'leftHidePlots',
					val: e.target.checked
				})
			} else
			// hide/show right player used and unused plot piles
			if (e.target.name === 'rightHidePlots') {
				socket.emit('set', {
					key: 'rightHidePlots',
					val: e.target.checked
				})
			}
		}
	});

	// init websocket
	var socket = io.connect('http://localhost:8081');

	// handle initial data
	socket.on('init', function (data) {
		console.log(data.cards.leftHand);
		for (var listName in data.cards) {
			controller.clearList(listName);
			for (var idx in data.cards[listName]) {
				if (data.cards[listName][idx] !== null) {
					controller.addCard(idx, listName, data.cards[listName][idx]);
				}
			}
		}
		controller.changeVideoSourceAndType();
		controller.setScore(data.score.left, 'left');
		controller.setScore(data.score.right, 'right');
		controller.setFP(data.firstplayer);
		controller.setChallengeIcon(data.challenge);
		controller.setPlotpileVisibility(data.leftHidePlots, 'left');
		controller.setPlotpileVisibility(data.rightHidePlots, 'right');
		discardPile = data.cards.discardPile;
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
		if (key === 'video') {
			controller.changeVideoSourceAndType();
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
		} else
		// change left player plot pile visibility
		if (key === 'leftHidePlots') {
			controller.setPlotpileVisibility(val, 'left');
		} else
		// change left player plot pile visibility
		if (key === 'rightHidePlots') {
			controller.setPlotpileVisibility(val, 'right');
		}
	});

	var controller = {
		clearList: function (listName) {
			var cards = $('.' + listName + ' [data-cardIdx]');
			for (var i = 0; i < cards.length; i++) {
				controller.removeCard(cards[i].getAttribute('data-cardIdx'), listName, true);
			}
		},
		addCard: function (cardIdx, listName, cardData) {
			var targetLists = $('.' + listName);
			cardData.idx = cardIdx;
			for (var i = 0; i < targetLists.length; i++) {
				var el = buildCardElement(cardData, listName);
				targetLists[i].appendChild(el);
			}
		},
		removeCard: function (cardIdx, listName, ignoreDiscard) {
			var targetCards = $('.' + listName + ' [data-cardIdx="' + cardIdx + '"]'),
				discardPiles = $('.' + (discardPile[listName] || 'noDiscardPileDefined'));
			// Only setting removed class to give some time for animations/transitions
			for (var i = 0; i < targetCards.length; i++) {
				// add card to discard pile, unless it should be ignored
				if (!ignoreDiscard) {
					for (var j = 0; j < discardPiles.length; j++) {
						var clone = targetCards[i].cloneNode(true);
						discardPiles[0].appendChild(clone);
						var toUpdate = $('[data-listname]', clone);
						for (var j = 0; j < toUpdate.length; j++) {
							toUpdate[j].setAttribute('data-listname', discardPile[listName]);
						}
					}
				}
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
		changeVideoSourceAndType: function () {
			var oldVideoElements = $('.video');
			socket.emit('get', 'video.type', function (type) {
				socket.emit('get', 'video.src', function (src) {
					for (var i = 0; i < oldVideoElements.length; i++) {
						var newVideoElement;

						if (hls) {
							hls.destroy();
						}

						if (type === 'Video') {
							newVideoElement = document.createElement('video');
							newVideoElement.src = src;
						} else if (type === 'MJPEG') {
							newVideoElement = document.createElement('img');
							newVideoElement.src = src;
						} else if (type === 'M3U8') {
							newVideoElement = document.createElement('video')
							hls = new Hls();
							hls.attachMedia(newVideoElement);
							hls.on(Hls.Events.MEDIA_ATTACHED, function () {
								hls.loadSource(src);
							});
						}

						newVideoElement.className = 'video';

						oldVideoElements[i].parentNode.replaceChild(newVideoElement, oldVideoElements[i]);
					}
					socket.emit('get', 'video.playState', function (playState) {
						controller.changeVideoPlayState(playState);
					})
				});
			});
		},
		changeVideoPlayState: function (newPlayState) {
			var videos = $('video');
			for (var i = 0; i < videos.length; i++) {
				videos[i][newPlayState]();
			}
		},
		changeVideoVolume: function (newVolume) {
			var videos = $('.video');
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
		},
		setPlotpileVisibility: function (hidden, whichPlayer) {
			var els = $('.' + whichPlayer + 'Plots');
			for (var i = els.length - 1; i >= 0; i--) {
				if (!hidden) {
					removeClass(els[i], 'hidePiles');
				} else if (!hasClass(els[i], 'hidePiles')) {
					addClass(els[i], 'hidePiles');
				}
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