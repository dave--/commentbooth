let synced = {
	io: {},
	data: {},
	// takes a key as string and maps it to an object, sets the value to defined object
	set: (key, val) => {
		let keys = key.split('.');
		let pointer = synced.data;
		for (var i = 0; i < keys.length - 1; i++) {
			pointer[keys[i]] = pointer[keys[i]] || {};
			pointer = pointer[keys[i]];
		}
		pointer[keys[i]] = val;
		synced.io.sockets.emit('update', {
			key: key,
			val: val
		});
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
				synced.set(data.key, data.val);
			});
			// handle get requests
			socket.on('get', (key, cb) => {
				cb(synced.get(key));
			});
		})
	}
};

module.exports = synced;