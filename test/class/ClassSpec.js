describe("Class - js classical implementation", function() {

	it('checks if Class is defined', function() {
		expect(typeof Class).not.toBe('undefined');
	});

	it('should return a instance of Class', function() {
		expect(new Class() instanceof Class).toBe(true);
	});

	it('should return a class by name', function() {
		Class.define('NameTest.Class');
		expect(Class.get('NameTest.Class')).toBeDefined();
	});

	it('should define a class without own properties', function() {
		var Class1 = Class.define('My.Class1');
		expect(Class1).toBeDefined();
	});

	it('should define a class with own properties', function() {
		var SomeClass = Class.define('SomeClass', {property: true});
		expect(Class.get('SomeClass')).toBeDefined();

		var cls = new SomeClass();
		expect(cls.property).toBe(true);
	});

	// http://stackoverflow.com/questions/6075231/how-to-extend-the-javascript-date-object
	// http://javascriptweblog.wordpress.com/2010/09/27/the-secret-life-of-javascript-primitives/
	// it('should work with primitives', function() {})

	it('should define a class using Class.extend method', function() {
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

	it('should create namespaces', function() {
		var scope = {};
		expect(typeof Class.ns('Some.namespace', null, scope)).toBe('object');
		expect(typeof scope.Some.namespace).toBe('object');
	});

	it('should call a function with the scope being the new namespace', function() {
		var scope = {};
		Class.ns('Some.name', function() {
			this.someValue = 123;
		}, scope);

		expect(scope.Some.name.someValue).toBe(123);
	});

	it('should create subclasses via prototype.extend and Class.extend', function() {
		Class.define('ExtendTest.ClassOne', {
			classOneFn: function() {
				return true;
			}
		});

		var ClassTwo = Class.define('ExtendTest.ClassTwo', {
			extend: 'ExtendTest.ClassOne'
		});

		var ClassThree = Class.extend(ClassTwo);

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
		expect(ClassThree).toBeDefined();
		expect(typeof ClassThree).toBe('function');
	});

	it('Checks Class.use for two predefined classes', function() {
		var classOne = Class.define('Use.test.ClassOne', {
			me: function() {
				return 'ClassOne';
			}
		});

		var classTwo = Class.define('Use.test.sub.ClassTwo', {
			extend: 'Use.test.ClassOne',
			me: function() {
				return 'ClassTwo';
			}
		});

		var modules = Class.use('Use.test.ClassOne', 'Use.test.sub.ClassTwo');
		expect(modules.ClassOne).toEqual(classOne);
		expect(modules.ClassTwo).toEqual(classTwo);
	});

});