(function() {
	var Class = require('./src/core/Class');
    var DemoClass = Class.extend({
		name: 'DemoClass',
		foo: function() {
			console.log(this.name + ' says foo!');
		}
	});

	var x = new DemoClass();
	x.foo();

	Class.define('Sub.Class', {
		constructor: function(name) {
			if (name) this.name = name;
		},
		extend: DemoClass,
		name: 'Sub.Class'
	});

	var Sub = Class.ns('Sub.Class');
	var y = new Sub();
	y.foo();

	var z = Class.create('Sub.Class', 'Sub.Class via .create');
	z.foo();

	console.log('Events:');
	var Events = Class.get('EventEmitter');
	Class.define('');
}(this));