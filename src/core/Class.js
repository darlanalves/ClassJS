(function(globalNamespace) {
	//'use strict';
	// loads Underscore as a node module
	if (typeof require !== 'undefined') {
		// nodejs don't have a global object, so we attach the namespaces to a local object
		globalNamespace = {};
	}

	var clsProto, extend, Class = function() {},
		$nsCache = {},
		fnTest = /xyz/.test(function() {
			xyz();
		}) ? /\b_super\b/ : /.*/,
		$this = this,
		_apply = function(destination, source) {
			var name;
			for (name in source) {
				if (source.hasOwnProperty(name)) {
					destination[name] = source[name];
				}
			}
		};

	clsProto = Class.prototype;
	_apply(clsProto, {
		superclass: undefined,
		self: Class
	});

	/**
	 * var SomeClass = Class.extend(TheParent, { propName: 'value' })
	 * var SomeClass = TheParent.extend({ propName: 'value' });
	 * @method
	 * @static
	 * @param {Function} parent			Superclass
	 * @param {Object} prototype		prototype
	 * @method
	 * @return NewClass
	 */
	extend = function(SuperClass, prototype) {
		var SuperClassProxy, statics = false,
			members, superProto, NewClass;

		if (SuperClass && SuperClass === Object) {
			SuperClass = Class;
		}

		if (prototype) {
			if (prototype.hasOwnProperty('statics')) {
				statics = prototype.statics;
				prototype.statics = false;
				delete prototype.statics;
			}

			if (prototype.hasOwnProperty('constructor')) {
				NewClass = prototype.constructor;
			}
		} else {
			prototype = {};
		}

		if (!NewClass) {
			NewClass = function() {
				return this.constructor.apply(this, arguments);
			};
		}

		superProto = SuperClass.prototype;
		SuperClassProxy = function() {};
		SuperClassProxy.prototype = SuperClass.prototype;
		SuperClassProxy.prototype.__initialize__ = false;
		NewClass.prototype = new SuperClassProxy();
		NewClass.prototype.__initialize__ = true;

		var name, member;
		for (name in prototype) {
			// skip reserved keys
			if (name === 'self' || name === 'superclass') continue;
			member = prototype[name];

			// Check if we're overwriting an existing function:
			// if proto.name is function and superclass.name are both function
			// and proto.name has a reference to _super(), we should:
			// - save old this._super value;
			// - set this._super to parent fn
			// - call the proto.name fn in the proper scope (this)
			// - restore the old _super value
			// and voila!
			NewClass.prototype[name] =
				(typeof member === 'function' && typeof superProto[name] === 'function' && fnTest.test(member)) ?
				(function(property, superclass, fn) {
					return function() {
						var tmp = this._super;

						// Adds a new ._super() method that references the superclass
						this._super = superclass[property];

						// The method only need to be bound temporarily, so we
						// remove it when we're done executing
						var ret = fn.apply(this, arguments);
						this._super = tmp;
						return ret;
					};
				}(name, superProto, member)) : member;
		}

		if (statics) {
			_apply(NewClass, statics);
		}

		// this.superclass will reference super proto, while
		// Class.superclass holds a reference to its parent class
		NewClass.superclass = SuperClass;
		NewClass.prototype.superclass = superProto;

		// this.self is a reference to proto
		NewClass.prototype.self = NewClass;
		NewClass.extend = function(prototype) {
			return extend(this, prototype);
		};

		return NewClass;
	};

	Class.extend = function(SuperClass, prototype) {
		return extend(SuperClass, prototype);
	};

	Class.create = function(prototype) {
		return extend(Class, prototype);
	};

	/**
	 * Pseudo-namespacing declaration method.
	 * Also can run a method in scope of desired namespace
	 * @param {String} ns			The namespace to create/use
	 * @param {Function} wrapper	Optional function to call in the scope of ns
	 * @param {Object} scope		Optional scope to use as start point (default is global object)
	 * @return {Object}				Reference to NS
	 * @static
	 */
	Class.ns = function(ns, fn, scope) {
		var i, item, len, target;
		scope = scope || globalNamespace;

		if (!ns) {
			return scope;
		}

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
					i++;
				}
			}

			$nsCache[ns] = scope;
		}

		if (typeof fn === 'function') {
			fn.call(scope);
		}

		return scope;
	};

	/**
	 * Returns the reference to a class
	 * @param {String} name		Class name, like 'My.ns.Class'
	 * @return {Function}		Class constructor / null if not found
	 */
	Class.get = function(name) {
		if (!name) return null;
		if ($nsCache[name] !== undefined) {
			return $nsCache[name];
		}

		var item, parts = name.split('.'),
			ref = globalNamespace;
		while (item = parts.shift()) {
			ref = ref[item];
			if (ref === undefined) {
				return null;
			}
		}

		$nsCache[name] = ref;
		return ref;
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
			result[alias] = Class.get(item);
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
			_super = Class, ns;

		// if the only part was popped out, use global scope
		if (nsParts.length === 0) {
			ns = globalNamespace;
		} else {
			ns = Class.ns(nsParts.join('.'));
		}

		if (prototype && prototype.hasOwnProperty('extend')) {
			var _super = prototype.extend;

			if (typeof _super === 'string') {
				_super = Class.get(_super);
			}

			if (typeof _super !== 'function') {
				throw new Error('Invalid parent class!');
			}

			prototype.extend = null; // ensure the _super var is copied
			delete prototype.extend;
		}

		ns[className] = newClass = extend(_super, prototype);
		newClass.$name = className;
		newClass.$className = classNS;
		$nsCache[classNS] = newClass;
		return newClass;
	};

	/**
	 * Creates a new instance of a class
	 * @method
	 * @param {String} name
	 * @param {Object} config
	 */
	Class.instantiate = function(name, config) {
		var $class = Class.get(name);
		if ($class !== null) {
			// TODO multiple args? apply to constructor?
			return new $class(config);
		}

		throw new Error('Class not found: ' + name);
	};

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