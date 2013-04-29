(function(globalNamespace) {
	var $this, Class, clsProto, extend, ctorFactory;

	Class = function() {};
	clsProto = Class.prototype;

	_.extend(clsProto, {
		superclass: clsProto,
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

			return method.apply(this, args);
		}
	});

	ctorFactory = function() {
		return function() {
			if ($init) {
				return this.constructor.apply(this, arguments);
			}

			return null;
		}
	};

	/**
	 * @params SuperClass, prototype, statics
	 * @params prototype, statics
	 * @return NewClass
	 */
	extend = function(SuperClass, prototype, statics) {
		var argv = arguments,
			argc = arguments.length;

		prototype = argc === 1 ? argv[0] : argv[1];
		SuperClass = argc === 2 ? argv[0] : false;
		statics = argc < 3 ? (argc === 2 ? argv[1] : false) : statics;

		var SuperClassProxy = function() {},
			NewClass = prototype.hasOwnProperty('constructor') ? prototype.constructor : false;

		if (!NewClass) {
			if (SuperClass) {
				NewClass = function() {
					SuperClass.apply(this, arguments);
				};
			} else {
				NewClass = function() {};
			}
		}

		SuperClassProxy.prototype = SuperClass ? SuperClass.prototype : clsProto;
		$init = false;
		NewClass.prototype = new SuperClassProxy();
		//NewClass.prototype.constructor = NewClass;
		$init = true;
		// copy static properties
		_.extend(NewClass, SuperClass);
		NewClass.extend = extend;
		return NewClass;
	};

	/**
	 * var SomeClass = Class.extend(TheParent, { propName: 'value' }, { SOME_CONST: 1 })
	 *
	 * var SomeClass = TheParent.extend({ propName: 'value' }, { SOME_CONST: 1 });
	 */
	Class.extend = extend;

	// Return as AMD module or attach to head object
	if (typeof define !== "undefined") {
		define([], function() {
			return Class;
		});
	} else if (globalNamespace) { /** @expose */
		globalNamespace.Class = Class;
	} else { /** @expose */
		module.exports = Class;
	}
}(typeof define !== "undefined" || typeof window === "undefined" ? null : window));