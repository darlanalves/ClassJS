describe("Class - js classical implementation", function() {

	// test basic class operation (new)
	it('should return a instance of Class', function() {
		expect(new Class() instanceof Class).toBe(true);
	});

	// http://stackoverflow.com/questions/6075231/how-to-extend-the-javascript-date-object
	// http://javascriptweblog.wordpress.com/2010/09/27/the-secret-life-of-javascript-primitives/
	// it('should work with primitives', function() {})
	// tests a class construction calling SubClass.extend
	it('Subclasses should have a valid extend method as well', function() {
		var SubClass = Class.define('SubClassOne', {
			propTrue: true
		});

		var ThirdClass = SubClass.extend({
			propFalse: false
		});

		var third = new ThirdClass();

		// proper subclassing
		expect(third instanceof SubClass).toBe(true);

		// valid prototype chain
		expect(third.propFalse).toBe(false);
		expect(third.propTrue).toBe(true);
	});

	// tests the declaration of static properties
	it('Should have support to static properties', function() {
		var A = Class.define('A', {
			statics: {
				STATIC_ONE: 1
			}
		});

		var a = new A();
		expect(a.statics).toBeUndefined();
		expect(A.STATIC_ONE).toBeDefined();
		expect(A.STATIC_ONE).toEqual(1);
	});

	// test namespace declaration
	it('Namespace method should return an object that makes reference to it', function() {
		var scope = {};
		expect(typeof Class.ns('Some.namespace', null, scope)).toBe('object');
	});

	// check if namespaces are working using a specific scope
	it('Should create a namespace into scope provided', function() {
		var scope = {};
		Class.ns('scopeTest.Ns', null, scope);
		expect(typeof scope.scopeTest.Ns).toBe('object');
	});

	// tests the call of a function (wrapper) scoped to new namespace
	it('Should call a function in scope of a new namespace', function() {
		var scope = {};
		Class.ns('Some.name', function() {
			this.someValue = 123;
		}, scope);

		expect(scope.Some.name.someValue).toBe(123);
	});

	it('Tests a class without custom properties', function() {
		var Class1 = Class.define('My.Class1');
		expect(Class1).toBeDefined();
	});

	// tests the declaration of a superclass via prototype.extend
	it('Checks subclassing via prototype.extend', function() {
		Class.define('ExtendTest.ClassOne', {
			classOneFn: function() {
				return true;
			}
		});
		Class.define('ExtendTest.ClassTwo', {
			extend: ExtendTest.ClassOne
		});

		var buildFn = function() {
			return new ExtendTest.ClassTwo();
		};

		var throwFn = function() {
			Class.define('ExtendTest.ClassThree', {
				extend: Some.silly.ClassName
			});
		};

		expect(buildFn).not.toThrow();
		expect(buildFn() instanceof ExtendTest.ClassOne).toBe(true);
		expect(throwFn).toThrow();
	});

	it('Checks Class.use for two predefined classes', function() {
		Class.define('Use.test.ClassOne', {
			me: function() {
				return 'ClassOne';
			}
		});
		Class.define('Use.test.sub.ClassTwo', {
			extend: Use.test.ClassOne,
			me: function() {
				return 'ClassTwo';
			}
		});

		var globals = Class.use('Use.test.ClassOne', 'Use.test.sub.ClassTwo');
		expect(globals.ClassOne).toEqual(Use.test.ClassOne);
		expect(globals.ClassTwo).toEqual(Use.test.sub.ClassTwo);
	});

	it("Should throw exception if this._super is called and local method doesn't exists", function() {
		Class.define('ThrowTest.ClassOne', {
			a: function() {}
		});

		Class.define('ThrowTest.ClassTwo', {
			b: function() {
				this._super('a');
			}
		});

		var throwFn = function() {
			var x = new ThrowTest.ClassTwo();
			x.b();
		};

		expect(throwFn).toThrow();
	});

	it("Should throw exception if this._super is called and parent method doesn't exists", function() {
		Class.define('ThrowTest.ClassThree', {
			a: function() {
				this._super('a');
			}
		});

		var throwFn = function() {
			var x = new ThrowTest.ClassThree;
			x.a();
		};
		expect(throwFn).toThrow();
	});

	it('Shoud return a class by name', function() {
		Class.define('NameTest.Class');
		expect(Class.get('NameTest.Class')).toBeDefined();
	});

});