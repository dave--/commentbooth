const fs = require('co-fs');
const request = require('co-request');
const path = require('path');

const requestPipeToFile = (() => {
	let fs = require('fs');
	let request = require('request');
	return (url, filepath) => {
		return new Promise((resolve, reject) => {
			try {
				let stream = fs.createWriteStream(filepath);
				stream
					.on('error', (e) => { reject(e) })
					.on('finish', () => { resolve(true); });
				return request(url).on('error', (e) => { reject(e) }).pipe(stream);
			} catch (e) {
				return reject(e);
			}
		});
	};
})();

module.exports = function* (cfg) {
	const log = (() => {
		let str = '';
		return (add) => {
			console.log(add);
			str += '\n' + add;
			return str;
		};
	})();
	log('Getting card data from http://thronesdb.com/api/public/cards/');
	let result = yield request('http://thronesdb.com/api/public/cards/');
	let cards = result.body;
	cards = JSON.parse(cards);
	for (let i = 0; i < cards.length; i++) {
		log('Downloading card image ' + (i+1) + ' of ' + cards.length + ' (' + cards[i].name + ')');
		if (!cards[i].imagesrc) {
			log('  ⤷ Skipping: image source missing');
		} else {
			cards[i].localsrc = cards[i].imagesrc.replace(/.*(\/.+?\..+?)$/, '$1');
			let exists = yield fs.exists(path.join(cfg.imgPath, cards[i].localsrc));
			if (!cfg.forceDownload && exists) {
				log('  ⤷ Skipping: file already exists');
			} else {
				try {
					yield requestPipeToFile('http://thronesdb.com' + cards[i].imagesrc, path.join(cfg.imgPath, cards[i].localsrc));
				} catch (e) {
					log('  ⤷ ' + e);
				}
			}
		}
	}
	yield fs.writeFile(cfg.jsonPath, JSON.stringify(cards));
	return log('Save card data as ' + cfg.jsonPath);
}