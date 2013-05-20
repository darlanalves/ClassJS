(function() {
	'use strict';

	/**
	 * Default data types. Used to parse some primitive types in data fields
	 */
	Whapp.namespace('Whapp.data');
	Whapp.data.Types = {
		register: function(name, data) {
			if (Whapp.data.Types[name]) {
				throw new Error('Type ' + name + ' is already registered!');
			}
			
			Whapp.data.Types[name] = data;
		},

		date: {
			convert: function(v) {
				if (!v) {
					return null;
				}

				if (_.isDate(v)) {
					return v;
				}

				return new Date(v);
			}
		},

		timestamp: {
			convert: function(v) {
				return new Date(v * 1000);
			}
		},

		time: {
			convert: function(v) {
				return new Date(parseInt(v, 10));
			}
		},

		bool: {
			convert: function(v) {
				return Boolean(v);
			}
		},

		'int': {
			convert: function(v) {
				return v !== undefined && v !== null && v !== '' ? parseInt(v.replace(/\D+/, ''), 10) : null;
			}
		},

		'float': {
			convert: function(v) {
				return v !== undefined && v !== null && v !== '' ? parseInt(v.replace(/\D+/, ''), 10) : null;
			}
		},

		number: {
			convert: function(v) {
				return Number(v);
			}
		},

		model: {
			convert: function(v) {
				return v.toJSON ? v.toJSON() : null;

			}
		},

		auto: {
			convert: function(v) {
				return v;
			}
		}

	};
}).call(this);