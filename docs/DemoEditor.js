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
			var that = this,
				lastCount = 0;

			this.editor = $('<div class="modal" />');
			$('<h2>Edit test code</h2>').appendTo(this.editor);
			this.input = $('<textarea rows="10" cols="40" />');
			this.input.on('change', function() {
				that.value = this.value;
			}).on('keyup', function(evt) {
				var count = this.value.split('\n').length + 1;
				if (lastCount != count) {
					that.input.attr('rows', count);
					lastCount = count;
				}
			});
			this.input.appendTo(this.editor);
			var buttons = $('<div class="button-bar"/>');

			$('<button class="clear">Cancel</button>').appendTo(buttons).on('click', function() {
				that.hide();
			});

			$('<button class="submit">Save</button>').appendTo(buttons).on('click', function() {
				that.trigger();
			});

			this.editor.append(buttons).appendTo(document.body).hide();
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
		this.input.val(newValue).attr('rows', newValue.split('\n').length + 1);
		return this;
	},

	trigger: function() {
		if (this.callback) {
			this.callback(this.value);
		}

		this.hide();
	}
});