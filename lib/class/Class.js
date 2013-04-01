(function() {
	'use strict';

	// TODO should  use external lib instead? (_, $...)
	var __has = {}.hasOwnProperty,
		__slice = Array.prototype.slice,
		__isFunction = function(obj) {
			return toString.call(obj) === '[object Function]';
		},
		__apply = Whapp.apply,
		__extend = Whapp.extend;

	this.Class = function() {};
	this.Class.uuid = function() {
		var i, itoh, range, s, _i, _j, _k, _len, _len1, _results;
		s = [];
		itoh = '0123456789ABCDEF';
		range = (function() {
			_results = [];
			for (_i = 0; _i <= 35; _i++) {
				_results.push(_i);
			}
			return _results;
		}).apply(this);
		for (_j = 0, _len = range.length; _j < _len; _j++) {
			i = range[_j];
			s[i] = Math.floor(Math.random() * 0x10);
		}
		s[14] = 4;
		s[19] = (s[19] & 0x3) | 0x8;
		for (_k = 0, _len1 = range.length; _k < _len1; _k++) {
			i = range[_k];
			s[i] = itoh[s[i]];
		}
		s[8] = s[13] = s[18] = s[23] = '-';
		return s.join('');
	};

	this.Class.prototype = {
		config: {},
		constructor: function() {},

		/**
		 * Gets the many property values in the prototype chain, from the bottom up
		 * @param {String} name				Name of property to search
		 * @return {Array} foundValues      Array of found values to `property`
		 */
		getPrototypeChain: function(name) {
			var ownerPrototype, list = [],
				_self = this.$self(),
				__superName = Whapp.ClassManager.superName;

			if (_self) {
				if (this[name] != _self[name]) {
					list.unshift(this[name]);
				}

				if (__hasOwn.call(_self, name)) {
					list.unshift(_self[name]);
				}
			}

			ownerPrototype = this.superclass;
			while (ownerPrototype) {
				if (ownerPrototype && __hasOwn.call(ownerPrototype, name)) {
					list.unshift(ownerPrototype[name]);
				}

				ownerPrototype = ownerPrototype[__superName];
			}

			return list;
		},

		/**
		 * Merge arrays or objects that were set more than once (in current class and superclasses)
		 * If properties are not a chain of arrays or objects, returns the current instance value
		 * @param {String} name                     Property name
		 * @param {Boolean} [cloneObjects=false]    If true and is a chain of objects, returns a clone
		 */
		getMergedWithParents: function(name, cloneObjects) {
			var chain, isObject, result, value, last;
			chain = this.getPrototypeChain(name);
			cloneObjects = Boolean(cloneObjects) == true;
			result = null;

			if (chain.length) {
				last = __last(chain);
				if (__isArray(last)) {
					isObject = false;
					result = [];
				} else if (__isObject(last)) {
					isObject = true;
					result = {};
				} else {
					return last;
				}

				while ((value = chain.shift())) {
					if (isObject && value) {
						__apply(result, value);
					} else if (value.length) {
						result = result.concat(value);
					}
				}

				if (isObject && cloneObjects) {
					result = __clone(result);
				}
			}

			return result;
		},

		initConfig: function(config) {
			var configName, k, me, mergedConfig, _fn, _ref;
			if (!this.$configInited) {
				me = this;
				mergedConfig = __extend({}, this.config, config);
				_ref = this.config;
				_fn = function(configName) {
					var cName, getter, pName, setter;
					cName = String(configName);
					// capitalize
					cName = cName.substr(0, 1).toUpperCase() + cName.substr(1).toLowerCase();
					pName = configName;
					setter = 'set' + cName;
					getter = 'get' + cName;
					if (!me[setter]) {
						me[setter] = function(val) {
							this[pName] = val;
							return this;
						};
					}
					if (!me[getter]) {
						me[getter] = function() {
							return this[pName];
						};
					}
					return true;
				};

				for (configName in _ref) {
					if (!__hasProp.call(_ref, configName)) continue;
					k = _ref[configName];
					_fn(configName);
				}

				this.config = mergedConfig;
				__apply(this, mergedConfig);
				this.$configInited = true;
			}
			return this;
		}
	};

}).call(Whapp);