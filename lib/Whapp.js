(function() {
	'use strict';

	/**
	 * @class Whapp
	 * @singleton
	 */
	var Whapp = function() {},
		__has = {}.hasOwnProperty,
		__slice = Array.prototype.slice,
		__toString = Object.prototype.toString;

	/**
	 * Apply properties of source to destination
	 * @param {Object} destination		Destination
	 * @param {Object} source			Source object
	 * @param {Boolean} shallow			Check if source owns the properties before copy
	 * @return {Object}
	 */
	Whapp.apply = function(destination, source, shallow) {
		var i;
		shallow = Boolean(shallow) || false;

		if (shallow) {
			for (i in source) {
				if (__has.call(source, i)) destination[i] = source[i];
			}
		} else {
			for (i in source) destination[i] = source[i];
		}

		return destination;
	};

	/**
	 * Apply each source properties to destination
	 * @param {Object} destination
	 * @param {Object} sources...
	 * @return object
	 */
	Whapp.extend = function(obj) {
		var i, j, sources = __slice.call(arguments, 1);
		for (i = 0, j = sources.length; i < j; i++) {
			Whapp.apply(obj, sources[i]);
		}

		return obj;
	}

	var classCache = {},
		nsCache = {};

	/**
	 * Needless to say
	 * @param thing
	 * @static
	 */
	Whapp.isArray = Array.isArray ||
	function(thing) {
		return __toString.call(thing) === '[object Array]';
	};

	Whapp.isObject = function(obj) {
		return obj === Object(obj);
	};

	/**
	 * Needless to say
	 * @param thing
	 * @static
	 */
	Whapp.isFunction = function(thing) {
		return __toString.call(thing) === '[object Function]';
	};

	/**
	 * Needless to say
	 * @param thing
	 * @static
	 */
	Whapp.isString = function(thing) {
		return __toString.call(thing) === '[object String]';
	};

	/**
	 * Needless to say
	 * @param thing
	 * @static
	 */
	Whapp.isNumber = function(thing) {
		return __toString.call(thing) === '[object Number]';
	};

	/**
	 * Returns an array of class references to use within other classes or functions.
	 * Useful in a environment with namespaces
	 *
	 * Example:
	 *		var $ = Whapp.use('jQuery', 'Whapp.some.Class', 'Whapp.other.Class2');
	 *		var foo = new $.Class()
	 *		$.Class2.staticMethod();
	 *		$.jQuery('span');
	 * @markdown
	 * @static
	 */
	Whapp.use = function() {
		var className, classNames, i, j, name, nameParts, part, result, scope;
		if (isArray(classNames)) {
			classNames = classNames[0];
		} else {
			classNames = __slice.call(arguments);
		}
		i = 0;
		j = classNames.length;
		result = {};

		while (i < j) {
			scope = window;
			name = classNames[i];
			className = name.replace("/", ".");
			nameParts = className.split(".");
			if (classCache[className]) {
				result[nameParts.pop()] = classCache[className];
				continue;
			}
			while (nameParts.length !== 0) {
				part = nameParts.shift();
				scope = scope[part];
				if (scope === void 0) {
					throw new Error("Class " + className + " not found!");
				}
			}
			useCache[className] = scope;
			result[part] = scope;
			i += 1;
		}

		return result;
	};

	/**
	 * Pseudo-namespacing declaration method
	 * @param {String} ns			The namespace to emulate
	 * @param {Function} wrapper	Optional function to call in the scope of ns
	 * @return {Object} ns			The new NS
	 * @static
	 */
	Whapp.namespace = function(ns, wrapper) {
		var i, item, len, scope, target;
		scope = window;

		if (nsCache[ns] !== void 0) {
			scope = nsCache[ns];
		} else {
			target = ns.split(".");
			if (target.length !== 0) {
				i = 0;
				len = target.length;
				while (i < len) {
					item = target[i];
					scope = scope[item] || (scope[item] = {});
					i += 1;
				}
			}

			nsCache[ns] = scope;
		}

		if (Whapp.isFunction(wrapper)) {
			wrapper.call(scope);
		}

		return scope;
	};

	this.Whapp = Whapp;

}).call(this);