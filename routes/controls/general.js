const fs = require('co-fs');
const path = require('path');

const pathToJson = path.join(__dirname, '../../public/cards.json');

const factionCards = [
	{"name": "none", "faction_code": "none", "type_code": "faction", "code": "faction-none"},
	{"name": "Baratheon", "faction_code": "baratheon", "localsrc": "/baratheon.jpg", "type_code": "faction", "code": "faction-baratheon"},
	{"name": "Greyjoy", "faction_code": "greyjoy", "localsrc": "/greyjoy.jpg", "type_code": "faction", "code": "faction-greyjoy"},
	{"name": "Lannister", "faction_code": "lannister", "localsrc": "/lannister.jpg", "type_code": "faction", "code": "faction-lannister"},
	{"name": "Martell", "faction_code": "martell", "localsrc": "/martell.jpg", "type_code": "faction", "code": "faction-martell"},
	{"name": "Night\'s Watch", "faction_code": "thenightswatch", "localsrc": "/thenightswatch.jpg", "type_code": "faction", "code": "faction-thenightswatch"},
	{"name": "Stark", "faction_code": "stark", "localsrc": "/stark.jpg", "type_code": "faction", "code": "faction-stark"},
	{"name": "Targaryen", "faction_code": "targaryen", "localsrc": "/targaryen.jpg", "type_code": "faction", "code": "faction-targaryen"},
	{"name": "Tyrell", "faction_code": "tyrell", "localsrc": "/tyrell.jpg", "type_code": "faction", "code": "faction-tyrell"}
];


module.exports = function* () {
	// get agendas
	let agendas = [];
	const jsonExists = yield fs.exists(pathToJson);
	if (jsonExists) {
		let cards = yield fs.readFile(pathToJson);
		cards = JSON.parse(cards);
		cards.forEach((item) => {
			if (item.type_code === 'agenda') {
				agendas.push(item);
			}
		});
		agendas.sort((a, b) => {
			if (a.name.toUpperCase() < b.name.toUpperCase()) {
				return -1;
			} else if (a.name.toUpperCase() > b.name.toUpperCase()) {
				return 1;
			} else {
				return 0;
			}
		});
	}
	agendas = [{"name": "none", "faction_code": "none", "type_code": "agenda", "code": "agenda-none"}].concat(agendas);
	// serve view
	this.render('controls/general', {
		scoreLeft: this.synced.get('score.left'),
		scoreRight: this.synced.get('score.right'),
		firstplayer: this.synced.get('firstplayer'),
		factionLeft: this.synced.get('cards.leftMisc.faction'),
		factionRight: this.synced.get('cards.rightMisc.faction'),
		factionCards: factionCards,
		agendaLeft: this.synced.get('cards.leftMisc.agenda'),
		agendaRight: this.synced.get('cards.rightMisc.agenda'),
		agendas: agendas,
		challenge: this.synced.get('challenge')
	});
}