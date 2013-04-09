(function() {
	'use strict';

	var __has = {}.hasOwnProperty,
		__uuid = this.Class.uuid,
		Field = Whapp.data.Field;

	Whapp.define('Whapp.data.Model', {
		extend: 'Whapp.Component',
		dirty: false,
		modified: null,

		constructor: function(data) {
			this.data = data;
			this.modified = {};
			this.mapFields();
			this.setData(data, 1);
		},

		isDirty: function() {
			return this.dirty;
		},

		isNew: function() {
			return this.$data.id === null
		},

		getChanges: function() {
			return this.modified;
		},

		getRawData: function() {
			return this.data;
		},

		getData: function() {
			return this.$data;
		},

		setData: function(data, silent) {
			var _data = {};

			silent = silent !== void 0 ? !!silent : false;
			_.each(this.$fields, function(field, name) {
				_data[name] = field.getValueOf(data[name] || null);
			});

			this.$data = _data;
			if (!silent) this.trigger('update', this.$data);
		},

		get: function(name) {
			return this.$data[name] !== undefined ? this.$data[name] : null;
		},

		set: function(name, value) {
			if (this.$fields[name]) {
				this.data[name] = value;
				this.$data = this.$fields[name].getValueOf(value);
			}
			var o = {};
			o[name] = value;
			_.extend(this.modified, o);
			this.dirty = true;
			this.trigger('update', o);
			return this;
		},

		/**
		 * Revert changes
		 */
		revert: function() {
			this.modified = {};
			this.dirty = false;
			this.trigger('revert', this);
		},

		/**
		 * Commit changes
		 */
		commit: function() {
			if (this.dirty == false) return;
			this.trigger('commit', this.modified, this);
			_.extend(this.data, this.modified);
			this.setData(this.modified);
			this.revert();
		},

		/**
		 * Start edition
		 */
		edit: function() {
			this.dirty = true;
		},

		/**
		 * Returns a JSON object with full model data (model and associations)
		 */
		toJSON: function() {
			return flatten(this.getData());
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
							if (_.isArray(value)) {
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

			var fields = this.fields;
			this.$fields = {};
			if (_.isArray(fields)) {
				_.each(fields, function(field) {
					me.$fields[field.name] = new Field(field);
				});
			}
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