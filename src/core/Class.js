(function() {
	// References:
	// Super method: 		http://ejohn.org/blog/simple-javascript-inheritance/
	// Class.extend syntax:	Prototype
	// Prototype setup: 	https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Operators/instanceof

	var globalScope = this,
		has = {}.hasOwnProperty,
		$nsCache = {},

		fnTest = /xyz/.test(function() {
			xyz();
		}) ? /\b_super\b/ : /.*/,

		copy = function(destination, source) {
			var name;
			for (name in source) {
				if (has.call(source, name)) {
					destination[name] = source[name];
				}
			}

			return destination;
		};

	/**
	 * @class Class
	 * @author Darlan Alves <darlan@moovia.com>
	 */
	var Class = function() {};

	var clsProto = Class.prototype;
	copy(clsProto, {
		superclass: undefined,
		self: Class
	});

	var extend = function(SuperClass, prototype) {
		var members, superProto, NewClass, statics = false;

		if (SuperClass && SuperClass === Object) {
			SuperClass = Class;
		}

		if (prototype) {
			if (has.call(prototype, 'statics')) {
				statics = prototype.statics;
				prototype.statics = false;
				delete prototype.statics;
			}

			if (has.call(prototype, 'constructor')) {
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

		// we use a dummy constructor to provide inheritance mechanism
		var Surrogate = function() {};

		// a reference to superclass.prototype will allow the 'instanceof' operator to work
		// with all inherited superclasses of a instance
		Surrogate.prototype = SuperClass.prototype;
		Surrogate.prototype.__initialize__ = false;
		NewClass.prototype = new Surrogate();
		NewClass.prototype.__initialize__ = true;
		superProto = SuperClass.prototype;


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
			NewClass.prototype[name] = (typeof member === 'function' && typeof superProto[name] === 'function' && fnTest.test(member)) ? (function(property, superclass, fn) {
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

		/**
		 * Creates a clone of this instance
		 * @method
		 * @return {Object}
		 */
		NewClass.prototype.clone = function() {
			return copy(new this.self(), this);
		};

		/**
		 * Bind static properties/methods to new class
		 */
		if (statics) {
			copy(NewClass, statics);
		}

		NewClass.extend = function(prototype) {
			return extend(this, prototype);
		}

		// this.superclass gives access to parent class
		NewClass.superclass = NewClass.prototype.superclass = superProto;

		// this.self is a reference to proto
		NewClass.prototype.self = NewClass;

		return NewClass;
	};

	/**
	 * <b>Class inheritance</b>
	 *
	 * There are two ways to inherit from a class. Let's create a base class called `MyClass`:
	 *
	 * 		var MyClass = Class.define('MyClass', {
	 * 			property: 'value...'
	 * 		});
	 *
	 *	* Method one: using `Class.extend( TheClass, properties )`
	 *		var SubClass = Class.extend(MyClass);
	 *
	 * 	* Method two: using the `extend` method of a class (only works if a class were created with Class.create)
	 * 	*
	 * 		var ThirdClass = MyClass.extend();
	 *
	 * A new instance can access the inherited class via 'superclass' property:
	 *
	 * 		var third = new ThirdClass();
	 * 		console.log(third.superclass)	// will show MyClass prototype
	 *
	 * @markdown
	 * @static
	 * @param {Function} parent			Superclass
	 * @param {Object} prototype		prototype
	 * @return {Function}
	 */
	Class.extend = function(SuperClass, prototype) {
		return extend(SuperClass, prototype);
	};

	/**
	 * Creates and returns a new class
	 * @param {Object} prototype		Class own prototype
	 * @return {Function}
	 */
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
		scope = scope || globalScope;

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
			ref = globalScope;
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
	Class.define = function(namespace, prototype) {
		var NewClass, nsParts = namespace.split('.'),
			className = nsParts.pop(),
			ns = nsParts.length === 0 ? globalScope : Class.ns(nsParts.join('.')),
			SuperClass = Class;

		if (prototype && prototype.hasOwnProperty('extend')) {
			var _super = prototype.extend;
			prototype.extend = null; // force a copy of property value
			if (typeof _super === 'string') {
				_super = Class.get(_super);
			}

			if (typeof _super !== 'function') {
				throw new Error('Invalid parent class!');
			}

			delete prototype.extend;
			SuperClass = _super;
		}

		$nsCache[namespace] = ns[className] = NewClass = extend(SuperClass, prototype);
		NewClass.$name = className;
		NewClass.$className = namespace;
		NewClass.$parent = ns;

		return NewClass;
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

	exports.Class = Class;
}.call(this));