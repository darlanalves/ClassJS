(function() {
	var __has = {}.hasOwnProperty;

	Whapp.define('Whapp.view.form.ButtonGroup', {
		extend: 'Whapp.view.ViewAbstract',
		className: 'ui-buttongroup',
		tagName: 'span',
		initComponent: function() {
			var button, key, _ref, _results;
			if (this.items) {
				_ref = this.items;
				_results = [];
				for (key in _ref) {
					if (!__has.call(_ref, key)) continue;
					button = _ref[key];
					_results.push(this.addButton(button));
				}
				return _results;
			}
		},
		addButton: function(config) {
			var btn;
			config.renderTo = this.$el;
			return btn = new Whapp.view.form.Button(config);
		}
	});

}).call(this);