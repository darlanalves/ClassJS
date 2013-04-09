/**
 * @class Whapp.ClassManager
 * @static
 */
(function() {
	'use strict';

	var __has = {}.hasOwnProperty,

		resolveClassName = function(name) {
			return Whapp.ClassManager.$cache[name] || null;
		};

	var ClassManager = {
		/**
		 * Class references cache
		 */
		$cache: {},
		/**
		 * @property superName
		 * Name of property where the superclass reference resides (e.g. this.__super__)
		 */
		superName: '__super__',

		/**
		 * Defines a class
		 * @param {String} name		Class name (can be namespaced)
		 * @param {Object} prototype
		 */
		define: function(name, prototype) {
			var className, klass, parent, parts, scope, statics;
			parts = name.split('.');
			className = parts.pop();
			scope = parts.length > 1 ? Whapp.namespace(parts.join('.')) : window;
			prototype || (prototype = {});

			if (prototype.extend) {
				if (Whapp.isString(prototype.extend)) {
					parent = resolveClassName(prototype.extend);
				} else {
					parent = prototype.extend;
				}
				delete prototype.extend;
				if (parent.__final === true) {
					throw new Error('Cannot extend final class: ' + name);
				}
			} else {
				parent = Whapp.Class;
			}

			// statics
			statics = {};
			if (Whapp.isObject(prototype.statics)) {
				Whapp.apply(statics, prototype.statics);
				delete prototype.statics;
			}

			// constants
			if (Whapp.isArray(prototype.consts)) {
				Whapp.apply(statics, Whapp.ClassManager.consts(prototype.consts));
				delete prototype.consts;
			}

			// special properties
			Whapp.apply(prototype, {
				$class: name,
				$name: className,
				$owner: scope
			});

			klass = Whapp.ClassManager.extend(parent, prototype, statics);
			Whapp.ClassManager.$cache[name] = klass;

			scope[className] = klass;
		},

		/**
		 * Extends a class
		 * @param superclass	Superclass to extend
		 * @param prototype		Additional prototype values
		 * @param statics		New class static properties
		 */
		extend: function(_super, prototype, statics) {
			var Class, Parent;

			if (__has.call(prototype, 'constructor')) {
				Class = function() {
					return prototype.constructor.apply(this, arguments);
				};
			} else {
				Class = function() {
					return _super.prototype.constructor.apply(this, arguments);
				};
			}

			Whapp.extend(Class, _super, statics);
			Parent = function() {};
			Parent.prototype = _super.prototype;
			Class.prototype = new Parent();
			Whapp.apply(Class.prototype, prototype);
			Class.prototype[ClassManager.superName] = _super.prototype;
			Class.prototype.self = Class;

			return Class;
		},

		/**
		 * Creates a new instance of class `name`
		 * @param {String} name
		 * @param {Object} config
		 */
		create: function(name, config) {
			var cls = resolveClassName(name);
			if (cls) {
				return new cls(config);
			}

			throw new Error('Class not found: ' + name);
		},

		/**
		 * Resolves a class name to a constructor
		 * @param {String} name			The full class name (e.g. 'Some.ns.Class')
		 * @return {Function}
		 */
		resolve: function(name) {
			return resolveClassName(name);
		},

		/**
		 * Generates a list of property/value pairs to a given list of strings
		 * to use as constants
		 * @param {String[]} list
		 * @return {Object}
		 */
		consts: function(list) {
			var item, result, _i, _len;
			result = {};
			for (_i = 0, _len = list.length; _i < _len; _i++) {
				item = list[_i];
				if (_.isString(item)) {
					result[item] = item;
				}
			}
			return result;
		}
	};

	Whapp.ClassManager = ClassManager;
	Whapp.define = ClassManager.define;

}).call(this);