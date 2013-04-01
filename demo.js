function test1() {
	Whapp.define('MyClass', {
		foo: function() {
			alert('baz');
		}
	});

	//var test = new MyClass();
	//test.foo();		// alerts 'baz'
	console.log(MyClass);
}