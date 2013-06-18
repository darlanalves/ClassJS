# ClassJS

Simple class system - supports inheritance and super methods. This project is just a experiment I've done to understand a JS classical implementation

# Features

	- inheritance
	- this._super()
	- this.superclass
	- pseudo-namespacing
	- Node.js and browser
	- ~2kb (~1kb gzipped)


# Examples

**Definition**

```
Class.define('MyClass', {
	foo: function() {
		console.log('baz');
	}
});

var test = new MyClass();
test.foo();
```

**Namespacing**

```
Class.define('My.ns.ClassOne', {
	constructor: function(string) {
		console.log(string);
	}
});

new My.ns.ClassOne('What about a text over here?');
```

**Statics**

```
Class.define('My.ns.ClassTwo', {
	statics: {
		MY_CONST: 'const-value',
		foo: function() {
			console.log('Hey! I\'m static!');
		}
	}
});

My.ns.ClassTwo.foo();
console.log(My.ns.ClassTwo.MY_CONST);
```