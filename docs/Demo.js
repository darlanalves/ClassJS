Class.define('Demo', {
	code: '',
	constructor: function(code, output) {
		this.code = code;
		this.output = output;
	},
	build: function(code) {
		this.code = code;
		this.$fn = new Function('console', this.code);
	},
	run: function() {
		if (!this.$fn) {
			this.build(this.code);
		}

		this.$fn.call(this, this.output);
	}
});