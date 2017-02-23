/**
 * This script contains a few small helper functions to avoid having to use jQuery (which would be overkill)
 */
// writing document.querySelectorAll is waaaayyyyy too much effort ;-)
var $ = document.querySelectorAll.bind(document);
// remove css class from element
var removeClass = function (el, className) {
	var re = new RegExp('( |^)' + className + '( |$)','g');
	el.className = el.className.replace(re, '');
};
// add css class to element
var addClass = function (el, className) {
	el.className += ' ' + className;
};
// checks if given element has specified css class
var hasClass = function (el, className) {
	var re = new RegExp('( |^)' + className + '( |$)', 'g');
	if (!el.className) {
		return false;
	}
	return !!el.className.match(re);
};
// Helper to get height of element (including margin)
var getOuterHeight = function (el) {
	var styles = window.getComputedStyle(el);
	return parseInt(styles.marginTop, 10) + parseInt(styles.marginBottom, 10) + el.offsetHeight;
};
// Make AJAX request to specified URL, on request end call cb with returned data
var ajax = function (url, cb) {
	var httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = function () {
		if (httpRequest.readyState === XMLHttpRequest.DONE) {
			cb(httpRequest.responseText);
		}
	};
	httpRequest.open('GET', url);
	httpRequest.send();
}

// I know this doesn't qualify as "small" helper anymore ...
// build card html from json, indentation represents html structure
var buildCardElement = (function () {
	var cardImageRoot = '/cardImages'; // <-- the folder all the card images are stored in
	// After panel generated with buildCardElement was added we have to set the width inline, for transitions to work
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
				for (var i = 0; i < mutation.addedNodes.length; i++) {
					if (hasClass(mutation.addedNodes[i], 'panel')) {
						var titleHeight = getOuterHeight(mutation.addedNodes[i].querySelector('.panel-title'));
						var imageHeight = getOuterHeight(mutation.addedNodes[i].querySelector('.panel-image'));
						var bodyHeight = getOuterHeight(mutation.addedNodes[i].querySelector('.panel-body'));
						mutation.addedNodes[i].style.height = titleHeight + Math.max(imageHeight, bodyHeight) + 'px';
					}
				}
			}
		});
	});
	observer.observe(document.body, { childList: true, subtree: true });

	// function that actually builds card panel html
	return function (json, listName) {
		var panel = document.createElement('div');
		panel.className = 'panel style-' + json.faction_code + ' type-' + json.type_code + (json.expanded ? '' : ' collapsed');
		panel.setAttribute('data-cardIdx', json.idx);
		var html = '';
		html += '<h3 class="panel-title">';
		html += '<button type="button" class="synced" name="addCard" value="' + json.idx + '" data-listName="' + listName + '">Add</button>';
		html += '<button type="button" class="synced" name="removeCard" value="' + json.idx + '" data-listName="' + listName + '">Remove</button>';
		html += '<button type="button" class="synced" name="expandCard" value="' + json.idx + '" data-listName="' + listName + '">Expand</button>';
		html += '<button type="button" class="synced" name="collapseCard" value="' + json.idx + '" data-listName="' + listName + '">Collapse</button>';
		html += (json.is_unique ? '<span class="icon-unique"></span> ' : '') + json.name + '</h3>';
		html += '<div class="panel-image" style="background-image:url(' + cardImageRoot + json.localsrc + ');"></div>';
		html += '<div class="panel-body">';
			html += '<div class="card-faction"><span class="icon-' + json.faction_code + '"></span> ' + json.faction_name + '. ' + (json.is_loyal ? '' : 'Non-') + 'Loyal.</div>';
			if (json.type_code === 'character') {
				html += '<div class="card-info"><span class="card-type">' + json.type_name + '. </span><span class="card-props">Cost: ' + json.cost + '. STR: ' + json.strength + '. ' + (json.is_military ? '<span class="icon-military"></span>' : '') + (json.is_intrigue ? '<span class="icon-intrigue"></span>' : '') + (json.is_power ? '<span class="icon-power"></span>' : '') + '</span><span class="card-traits">' + json.traits + '</span></div>';
			}
			html += '<div class="card-text"><p>' + (json.text || '').replace(/\n/g, '</p><p>').replace(/(\[(.+?)\])/g, '<span class="icon-$2"></span>') + '</p></div>';
		html += '</div>';
		panel.innerHTML = html;
		return panel;
	};
})();