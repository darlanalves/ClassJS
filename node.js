(function() {
	var Class = require('./dist/classjs-latest').Class;

    var DemoClass = Class.create({
		name: 'DemoClass',
		foo: function() {
			console.log(this.name + ' says foo!');
		}
	});

	var x = new DemoClass();
	x.foo();

	Class.define('Sub.Class', {
		constructor: function(name) {
			if (name) {
				this.name = name;
			}
		},
		extend: DemoClass,
		name: 'Sub.Class'
	});

	var Sub = Class.ns('Sub.Class');
	var y = new Sub();
	y.foo();

	var z = new Sub('other Sub.Class');
	z.foo();
}());