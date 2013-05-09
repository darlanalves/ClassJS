$(function() {
	var g = Class.use('Demo', 'DemoOutput', 'DemoEditor'),
		DemoEditor = g.DemoEditor,
		DemoOutput = g.DemoOutput,
		Demo = g.Demo,
		root = $('<div/>'),
		trimRe = /^\s+|\s+$/g,
		trim = function(s) {
			return s.replace(trimRe, '');
		};


	$('code').each(function(i, codeEl) {
		var code = $(codeEl),
			js = trim(code.html()),
			buttons, div, results, title, demoResults, demo, editor;

		div = $('<div class="sample"/>');
		code.attr('title', '').html(js);

		title = $('<h1>' + code.attr('title') + '</h1>');
		results = $('<ul class="results"/>');

		demoResults = new DemoOutput(results[0]);
		demo = new Demo(js, demoResults);

		buttons = $('<div class="button-bar"><button class="clear">Clear</button>'+
			'<button class="edit">Edit</button><button class="submit">Run</button></div>');
		buttons.on('click', '.clear', function() {
			demoResults.clear();
		});

		buttons.on('click', '.submit', function() {
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