Class.define('DemoOutput', {
	constructor: function(htmlNode) {
		this.node = htmlNode;
	},

	log: function() {
		var i = 0,
			len = arguments.length,
			out = '';

		for (; i < len; i++) {
			out += String(arguments[i]) + '\n';
		}

		this.node.innerHTML += '<li><i>&bull;</i> ' + out + '</li>';
	},

	debug: function() {
		this.log.apply(this, arguments);
	},

	clear: function() {
		this.node.innerHTML = '';
	}
});