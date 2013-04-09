(function() {
	'use strict';

	var __has = {}.hasOwnProperty,
		__uuid = this.Class.uuid,
		Field = Whapp.data.Field;

	Whapp.define('Whapp.data.Model', {
		extend: 'Whapp.Component',
		dirty: false,

		constructor: function(data) {
			this.data = data;
			this.mapFields();
			this.setData(data);
		},

		isDirty: function() {
			return this.dirty;
		},

		isNew: function() {
			return this.$data.id === null
		},

		mapFields: function() {
			var map = this.mapping,
				me = this;

			this.fields || (this.fields = []);
			if (map && _.isArray(map)) {
				_.each(map, function(mapper) {
					var fn = Whapp.ClassManager.resolve(mapper.model),
						name = mapper.name;

					if (!(_.isFunction(fn) && name)) return;

					me.fields.push({
						name: name,
						type: 'model',
						convert: function(value) {
							if (Ext.isArray(value)) {
								var map, i, j;
								map = [];
								for (i = 0, j = value.length; i < j; i++) {
									map.push(new fn(value[i]));
								}
							} else {
								map = new fn(value);
							}

							return map;
						}
					});

				});
			}

			var fields = me.fields;
			this.$fields = {};
			if (_.isArray(fields)) {
				_.each(fields, function(field) {
					if (!field.name) return;
					me.$fields[field.name] = new Field(field);
				});
			}
		},

		getRawData: function() {
			return this.data;
		},
		
		getData: function() {
			return this.$data;
		},

		setData: function(data) {
			var _data = {};
			_.each(this.$fields, function(field, name) {
				_data[name] = field.getValueOf(data[name] || null);
			});

			this.$data = _data;
		},

		get: function(name) {
			return this.$data[name] !== undefined ? this.$data[name] : null;
		},

		set: function(name, value) {
			if (this.$fields[name]) {
				this.data[name] = value;
				this.$data = this.$fields[name].getValueOf(value);
			}

			return this;
		},

		/**
		 * Returns a JSON object with full model data (model and associations)
		 */
		toJSON: function() {
			return flatten(this.getData());
		}
	});

	var __flatten = function(obj, output) {
		var i, val;
		for (i in obj) {
			if (!obj.hasOwnProperty(i)) continue;
			val = obj[i];

			if (val === Object(val) && val instanceof Whapp.data.Model) {
				var flatObj = __flatten(val.getData(), {});
				for (var x in flatObj) {
					if (!flatObj.hasOwnProperty(x)) continue;
					output[i] || (output[i] = {});
					output[i][x] = flatObj[x];
				}
			} else {
				output[i] = val;
			}
		}

		return output;
	},

		flatten = function(obj) {
			return __flatten(obj, {});
		}

}).call(Whapp);