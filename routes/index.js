const route = require('koa-route');
let routes = [];

routes.push(route.all(
	'/',
	require('./home')
));

routes.push(route.all(
	'/crawl/:source',
	require('./crawler')
));

routes.push(route.all(
	'/controls/video',
	require('./controls/video')
));

routes.push(route.all(
	'/controls/hand/left',
	require('./controls/hand')('leftHand')
));

routes.push(route.all(
	'/controls/hand/right',
	require('./controls/hand')('rightHand')
));

routes.push(route.all(
	'/controls/recordings',
	require('./controls/recordings')
));

routes.push(route.all(
	'/showroom',
	require('./showroom')
));

routes.push(route.all(
	'/video',
	require('./videoStream')
));

module.exports = routes;