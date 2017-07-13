let synced = {
	io: {},
	data: {},
	initialData: {},
	// takes initial data
	initData: function (iData) {
		if (iData) {
			synced.initialData = iData;
		}
		synced.data = JSON.parse(JSON.stringify(synced.initialData));
		synced.io.sockets.emit('init', synced.data);
	},
	// takes a key as string and maps it to an object, sets the value to defined object
	set: (key, val, silent) => {
		let keys = key.split('.');
		let pointer = synced.data;
		for (var i = 0; i < keys.length - 1; i++) {
			pointer[keys[i]] = pointer[keys[i]] || {};
			pointer = pointer[keys[i]];
		}
		pointer[keys[i]] = val;
		if (!silent) {
			synced.io.sockets.emit('update', {
				key: key,
				val: val
			});
		}
		return synced.data;
	},
	// takes a key as string and maps it to an object, returns mapped value
	get: (key) => {
		let keys = key.split('.');
		let pointer = synced.data;
		for (var i = 0; i < keys.length - 1; i++) {
			if (!pointer[keys[i]]) {
				break;
			}
			pointer = pointer[keys[i]];
		}
		return pointer[keys[i]];
	},
	// initialize socket connection
	setIO: (newIO) => {
		synced.io = newIO;
		synced.io.on('connection', (socket) => {
			// send current data to new connection
			socket.emit('init', synced.data);
			// handle set requests
			socket.on('set', (data) => {
				// if card was removed, add to discarded list
				if (data.key.indexOf('cards.') === 0 && data.val === null) {
					let listName = data.key.substr(6, data.key.indexOf('.', 6) - 6);
					let discardPile = synced.get('cards.discardPile.' + listName);
					if (discardPile) {
						let cardIdx = data.key.substr(7 + listName.length);
						synced.set('cards.' + discardPile + '.' + cardIdx, synced.get(data.key), true);
					}
				}
				// set requested data
				synced.set(data.key, data.val);
			});
			// handle get requests
			socket.on('get', (key, cb) => {
				cb(synced.get(key));
			});
			// handle reset
			socket.on('reset', () => {
				synced.initData();
			});
		})
	}
};

module.exports = synced;