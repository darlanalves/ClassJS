Class.define('Demo', {
	code: '',
	constructor: function(code, output) {
		this.code = code;
		this.output = output;
	},
	build: function(code) {
		this.code = code;
		this.$fn = new Function('console', this.code);
	},
	run: function() {
		if (!this.$fn) {
			this.build(this.code);
		}

		this.$fn.call(this, this.output);
	}
});

Class.define('DemoOutput', {
	constructor: function(htmlNode) {
		this.node = htmlNode;
	},

	log: function() {
		var i = 0,
			len = arguments.length,
			out = '';

		for (; i < len; i++) {
			out += String(arguments[i]) + '\n';
		}

		this.node.innerHTML += '<li><i>&bull;</i> ' + out + '</li>';
	},

	debug: function() {
		this.log.apply(this, arguments);
	},

	clear: function() {
		this.node.innerHTML = '';
	}
});

Class.define('DemoEditor', {
	editor: null,
	input: null,
	value: '',
	constructor: function(initialValue, callback) {
		this.value = initialValue || '';
		this.callback = callback;
	},

	show: function(newValue) {
		if (!this.editor) {
			var that = this;
			this.editor = $('<div class="modal" />');
			$('<h2>Edit test code</h2>').appendTo(this.editor);
			this.input = $('<textarea rows="10" cols="40" />');
			this.input.on('change', function() {
				that.value = that.input.val();
			});
			this.input.appendTo(this.editor);

			$('<button class="save">Save</button>').appendTo(this.editor).on('click', function() {
				that.trigger();
			});

			this.editor.appendTo(document.body).hide();
		}

		this.editor.fadeIn();

		this.update(newValue);
		return this;
	},

	hide: function() {
		this.editor.fadeOut();
		return this;
	},

	update: function(newValue) {
		this.value = newValue;
		this.input.val(this.value);
		return this;
	},

	trigger: function() {
		if (this.callback) {
			this.callback(this.value);
		}

		this.hide();
	}
});

$(function() {
	var root = $('<div/>'),
		trimRe = /^\s+|\s+$/g,
		trim = function(s) {
			return s.replace(trimRe, '');
		};


	$('code').each(function(i, codeEl) {
		var code = $(codeEl),
			js = trim(code.html()),
			buttons, div, results, title, demoResults, demo, editor;

		div = $('<div class="sample"/>');
		code.html(js);

		title = $('<h1>' + code.attr('title') + '</h1>');
		results = $('<ul class="results"/>');

		demoResults = new DemoOutput(results[0]);
		demo = new Demo(js, demoResults);

		buttons = $('<div class="button-bar"><button class="clear">Clear</button>'+
			'<button class="edit">Edit</button><button class="run">Run</button></div>');
		buttons.on('click', '.clear', function() {
			demoResults.clear();
		});

		buttons.on('click', '.run', function() {
			demo.run();
		});

		var editor;
		buttons.on('click', '.edit', function() {
			var val = code.html();
			if (!editor) {
				editor = new DemoEditor(val, function(newValue) {
					code.html(newValue);
					demo.build(newValue);
				});
			}

			editor.show(val);
		});

		div.append(title).append(code).append(buttons).append(results).appendTo(root);
	});

	root.appendTo(document.body);
});