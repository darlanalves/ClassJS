Class.define('Demo', {
	code: '',
	constructor: function(code, output) {
		this.code = code;
		this.output = output;
	},
	run: function() {
		if (!this.$fn) {
			var code = this.code;
			this.$fn = new Function('console', code);
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
})

$(function() {
	var root = $('<div/>'),
		trimRe = /^\s+|\s+$/g,
		trim = function(s) {
			return s.replace(trimRe, '');
		};

	$('code').each(function(i, codeEl) {
		var code = $(codeEl),
			js = trim(code.html()),
			buttons, div, results, title, demoResults, demo;

		div = $('<div class="sample"/>');
		code.html(js);

		title = $('<h1>' + code.attr('title') + '</h1>');
		results = $('<ul class="results"/>');

		demoResults = new DemoOutput(results[0]);
		demo = new Demo(js, demoResults);

		buttons = $('<div class="button-bar"><button class="clear">Clear</button><button class="run">Run</button></div>');
		buttons.on('click', '.clear', function() {
			demoResults.clear();
		});

		buttons.on('click', '.run', function() {
			demo.run();
		});

		div.append(title).append(code).append(buttons).append(results).appendTo(root);
	});

	root.appendTo(document.body);
});