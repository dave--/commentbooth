const koa = require('koa');
const app = koa();
const http = require('http');

// setting up template engine
const Pug = require('koa-pug')
const pug = new Pug({
	viewPath: './views',
	debug: false,
	pretty: false,
	compileDebug: false,
	basedir: './views',
	helperPath: [],
	app: app
});

// setting up commentbooth specific routes
const routes = require('./routes');
for (let i = 0; i < routes.length; i++) {
	app.use(routes[i]);
}

// setting up less-css preprocessor
const less = require('koa-less');
app.use(less('./public', {
	force: true
}));

// setting up static file handler
const serve = require('koa-static');
app.use(serve('./public'));

// setting up socket.io
const io = require('socket.io')(8081);

// initialize synchronizer
app.context.synced = require('./lib/synced');
app.context.synced.setIO(io);
app.context.synced.set('video.src', '/video');
app.context.synced.set('video.playState', 'pause');
app.context.synced.set('video.volume', '1');
app.context.synced.set('cards.leftHand', {});
app.context.synced.set('cards.rightHand', {});
app.context.synced.set('score.left', 0);
app.context.synced.set('score.right', 0);
app.context.synced.set('firstplayer', 'none');

// start server
app.listen(8080);

console.log('Server started at http://localhost:8080');
