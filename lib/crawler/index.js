/**
 *	cfg:
 *		#source - enum: [thronesdb]
 *			defines which cards to load, currently only one value supported
 *		#imgPath - String
 *			Folder where card images are stored
 *		#jsonPath - String
 *			Folder and Filename where card data will be written to
 *		#forceDownload - Boolean
 *			Download images even if they were downloaded before (defaults to false)
 */
module.exports = function* (cfg) {
	let crawler = require('./' + cfg.source);
	return yield crawler(cfg);
}
