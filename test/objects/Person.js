var Person = Class.extend({
	name: String(),
	age: Number(),
	hello: function() {
		console.log('Hello!', this);
	}
});