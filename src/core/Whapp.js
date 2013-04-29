(function() {
	var root = this, Whapp = root.Whapp || {};
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = Whapp;
		}
		exports.Whapp = Whapp;
	} else {
		root['Whapp'] = Whapp;
	}

}).call(this);