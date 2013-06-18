var globalScope = this,
	has = {}.hasOwnProperty,
	$nsCache = {};

/**
 * @class Class
 * @author Darlan Alves <darlan@moovia.com>
 */
var Class = function() {};

Class.prototype.superclass = undefined;
Class.prototype.self = Class;

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
 * @method extend
 * @param {Function} parent			Superclass
 * @param {Object} prototype		prototype
 * @return {Function}
 */

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
Class.newInstance = function(name, config) {
	var $class = Class.get(name);
	if ($class !== null) {
		return $class.prototype.constructor.apply($class, config);
	}

	throw new Error('Class not found: ' + name);
};