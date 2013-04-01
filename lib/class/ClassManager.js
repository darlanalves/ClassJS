/**
 * @class Whapp.ClassManager
 * @static
 */
(function() {
	'use strict';

	var __has = {}.hasOwnProperty,
		__supername,

		ClassManager = function() {
			return Whapp.ClassManager;
		},

		resolveClassName = function(name) {
			return Whapp.ClassManager.$cache[name] || null;
		};

	/**
	 * Class references cache
	 */
	ClassManager.$cache = {};
	/**
	 * @property superName
	 * Name of property where the superclass reference resides (aka this.__proto__)
	 */
	ClassManager.superName = '__super__';

	Whapp.apply(ClassManager, {
		/**
		 * Defines a class
		 * @param {String} name		Class name (namespaced)
		 * @param {Object} prototype
		 */
		define: function(name, prototype) {
			var className, klass, parent, parts, scope, statics;
			parts = name.split('.');
			className = parts.pop();
			scope = Whapp.namespace(name);
			prototype || (prototype = {});

			if (prototype.extend) {
				if (Whapp.isString(object.extend)) {
					parent = resolveClassName(object.extend);
				} else {
					parent = object.extend;
				}
				delete object.extend;
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

			klass = Whapp.ClassManager.extend(parent, prototype, statics);
			Whapp.ClassManager.$cache[name] = klass;
			Whapp.apply(klass.prototype, {
				$class: name,
				$name: className,
				$owner: scope
			});

			scope[className] = klass;
			//return klass;
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
					return _super.constructor.apply(this, arguments);
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

		create: function(name, config) {
			var cls = resolveClassName(name);
			if (cls) {
				return new cls(config);
			}

			throw new Error('Class not found: ' + name);
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
				if (Whapp.isString(item)) {
					result[item] = item;
				}
			}
			return result;
		}
	});

	this.ClassManager = ClassManager;
	this.define = this.declare = this.ClassManager.define;

}).call(Whapp);