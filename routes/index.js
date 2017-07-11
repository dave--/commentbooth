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
	'/controls/general',
	require('./controls/general')
));

routes.push(route.all(
	'/controls/left/hand',
	require('./controls/hand')('leftHand')
));

routes.push(route.all(
	'/controls/left/unusedPlots',
	require('./controls/hand')('leftUnusedPlots', ['leftUsedPlots', 'leftCurrentPlot'])
));

routes.push(route.all(
	'/controls/left/currentPlot',
	require('./controls/hand')('leftCurrentPlot', ['leftUnusedPlots', 'leftUsedPlots'])
));

routes.push(route.all(
	'/controls/left/usedPlots',
	require('./controls/hand')('leftUsedPlots', ['leftCurrentPlot', 'leftUnusedPlots'])
));

routes.push(route.all(
	'/controls/right/hand',
	require('./controls/hand')('rightHand')
));

routes.push(route.all(
	'/controls/right/unusedPlots',
	require('./controls/hand')('rightUnusedPlots', ['rightUsedPlots', 'rightCurrentPlot'])
));

routes.push(route.all(
	'/controls/right/currentPlot',
	require('./controls/hand')('rightCurrentPlot', ['rightUnusedPlots', 'rightUsedPlots'])
));

routes.push(route.all(
	'/controls/right/usedPlots',
	require('./controls/hand')('rightUsedPlots', ['rightCurrentPlot', 'rightUnusedPlots'])
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