(function() {
	var types = Whapp.data.Types;

    Whapp.define('Whapp.data.Field', {
		name: '',
		constructor: function(config) {
			if (_.isString(config)) {
				config = {name: config};
			}

			_.extend(this, config);
		},

		getValueOf: function(value) {
			return _.isFunction(this.convert) ? this.convert(value) : this.$convert(value);
		},

		$convert: function(v) {
			var t = this.type||'auto';
			return types[t] ? types[t].convert.call(this, v) : v;
		}
	});
}).call(this);