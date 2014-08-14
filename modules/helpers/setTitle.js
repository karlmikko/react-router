
var TitleStore = require('../stores/TitleStore');

function setTitle (title){
	TitleStore.updateTitle(title);
}

module.exports = setTitle;