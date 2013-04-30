(function(globalNamespace) {
	// loads Underscore as a node module
	if (typeof require !== 'undefined') {
		var _ = require('underscore');
		globalNamespace = {};
	} else {
		var _ = globalNamespace._;
	}

	var clsProto, extend, Class = function() {},
		$nsCache = {},
		$this = this;

	clsProto = Class.prototype;
	_.extend(clsProto, {
		superclass: undefined,
		self: Class,
		_super: function(name, args) {
			if (!name) {
				return this.superclass;
			}

			// checks if the class itself has a method with the name, otherwise we shouldn't
			// call a parent method if it was not overriden
			if (!this.self.prototype.hasOwnProperty(name)) {
				throw new Error('Trying to call superclass method "' + name + '" from a class has not defined its own!');
			}

			var method = this.superclass[name];
			if (!method) {
				throw new Error('Method "' + name + '" not found in parent class');
			}

			// TODO check two consecutive calls to _super: applying to current scope may run in a loop
			return method.apply(this, args || []);
		}
	});

	/**
	 * @params SuperClass
	 * @params prototype
	 * @return NewClass
	 */
	extend = function(SuperClass, prototype) {
		var SuperClassProxy, NewClass, statics = false;

		if (!SuperClass) {
			throw new Error('Trying to extend invalid class');
		}

		if (prototype) {
			if (prototype.hasOwnProperty('statics')) {
				statics = _.extend({}, prototype.statics);
				delete prototype.statics;
			}

			if (prototype.hasOwnProperty('constructor')) {
				NewClass = prototype.constructor;
			}
		}

		if (!NewClass) {
			NewClass = function() {
				return SuperClass.prototype.constructor.apply(this, arguments);
			};
		}

		SuperClassProxy = function() {};
		if (SuperClass) {
			SuperClassProxy.prototype = SuperClass.prototype;
		}

		// Primitives may not like the object param into constructor.
		// Also, there's some silly behaviors when a primitive method is called.
		// So, extending primitives should be avoided
		NewClass.prototype = new SuperClassProxy({
			'$init': false
		});
		NewClass.prototype.constructor = NewClass;

		if (prototype) {
			_.extend(NewClass.prototype, prototype);
		}

		if (statics) {
			_.extend(NewClass, statics);
		}

		// this.superclass will reference super
		NewClass.superclass = SuperClass;
		NewClass.prototype.superclass = SuperClass.prototype;

		// this.self is a reference to proto
		NewClass.prototype.self = NewClass;
		NewClass.extend = function(prototype) {
			return extend(NewClass, prototype);
		};

		return NewClass;
	};

	/**
	 * var SomeClass = Class.extend(TheParent, { propName: 'value' })
	 * var SomeClass = TheParent.extend({ propName: 'value' });
	 * @method
	 * @static
	 * @param {Function} parent			Superclass
	 * @param {Object} prototype		Class Prototype
	 */
	Class.extend = function(prototype) {
		return extend(this, prototype);
	};

	/**
	 * Pseudo-namespacing declaration method. Also runs a method in scope of that namespace
	 * @param {String} ns			The namespace to create/use
	 * @param {Function} wrapper	Optional function to call in the scope of ns
	 * @param {Object} scope		Optional scope to use as start point
	 * @return {Object}				Reference to NS
	 * @static
	 */
	Class.namespace = function(ns, fn, scope) {
		var i, item, len, target;
		scope = scope || globalNamespace;

		if ($nsCache[ns] !== undefined) {
			scope = $nsCache[ns];
		} else {
			target = ns.split('.');
			if (target.length !== 0) {
				i = 0;
				len = target.length;
				while (i < len) {
					item = target[i];
					scope = scope[item] || (scope[item] = {});
					i += 1;
				}
			}

			$nsCache[ns] = scope;
		}

		if (fn && _.isFunction(fn)) {
			fn.call(scope);
		}

		return scope;
	};

	var aliasRe = /\s{1}as\s{1}/i;
	/**
	 * Returns an array of class references to use within other classes or functions.
	 * Useful in a environment with namespaces
	 *
	 *		var externals = Class.use(
	 *			'jQuery.fn.plugin as JPlugin',
	 *			'My.ns.ClassOne',
	 *			'My.ns.OtherClassTwo as ClassTwo');
	 *		console.log(externals.ClassTwo, externals.classOne, externals.JPlugin);
	 * @static
	 */
	Class.use = function() {
		var item, alias, result = {},
			args = arguments,
			i = args.length;

		while (i--) {
			item = args[i];
			alias = aliasRe.test(item) ? item.split(aliasRe).pop() : item.split('.').pop();
			result[alias] = Class.namespace(item);
		}

		return result;
	};

	/**
	 * @method
	 * @param {String} class		Namespaced class name
	 * @param {Object} prototype
	 */
	Class.define = function(classNS, prototype) {
		var newClass, nsParts = classNS.split('.'),
			className = nsParts.pop(),
			_super = Class;

		// if the only part was popped out, use global scope
		if (nsParts.length === 0) {
			ns = globalNamespace;
		} else {
			ns = Class.namespace(nsParts.join('.'));
		}

		if (prototype && prototype.hasOwnProperty('extend')) {
			if (!_.isFunction(prototype.extend)) {
				throw new Error('Invalid parent class!');
			}

			_super = prototype.extend;
			prototype.extend = null;
			delete prototype.extend;
		}

		ns[className] = newClass = extend(_super, prototype);
		newClass.$name = className;
		newClass.$className = classNS;
		return newClass;
	};

	/**
	 * Creates a new instance of a class
	 * @method
	 * @param {String} name
	 * @param {Object} config
	 */
	Class.create = function(name, config) {
		var $class = Class.namespace(name);
		if ($class) {
			// TODO multiple args? apply to constructor?
			return new $class(config);
		}

		throw new Error('Class not found: ' + name);
	};

	// alias to namespace
	Class.ns = Class.namespace;

	// Return as AMD module or attach to global object
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = Class;
		}
		exports.Class = Class;
	} else {
		globalNamespace.Class = Class;
	}

}(this));