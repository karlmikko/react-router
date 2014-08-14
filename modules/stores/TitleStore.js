
var ExecutionEnvironment = require('react/lib/ExecutionEnvironment');

var _timer = null;
var _title = null;

var TitleStore = {

	/**
	 *  Update document title with last title set at nextTick.
	 */
	updateTitle: function (title) {
		var newTitle = String(title);
		if (_title == newTitle)
			return;

		_title = newTitle;

		if (ExecutionEnvironment.canUseDOM) {
			clearTimeout(_timer);
			_timer = setTimeout(function(){
				document.title = _title;
			}, 0);
		}
	},

	/**
	 * Get current document title
	 */
	getTitle: function () {
		if (ExecutionEnvironment.canUseDOM)
			_title = _title || document.title;

		return _title;
	},

	/**
	 * clear TitleStore
	 */
	clearStore: function () {
		_title = null;
		clearTimeout(_timer);
	}
};

module.exports = TitleStore;