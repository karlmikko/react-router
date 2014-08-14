var renderRoutesToString = require('./renderRoutesToString');

var renderRoutesToStaticMarkup = function (routes, fullPath) {
	return renderRoutesToString(routes, fullPath, true);
};

module.exports = renderRoutesToStaticMarkup;