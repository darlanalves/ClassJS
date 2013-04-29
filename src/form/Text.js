(function() {

	Whapp.define('Whapp.view.form.Text', {
		extend: 'Whapp.view.ViewAbstract',
		config: {
			rows: '',
			columns: '',
			resize: false
		},
		template: '<textarea rows="{rows}" cols="{columns}" class="ui-edit" />',
		initialize: function() {
			this.$el.addClass('multiline');
			if (this.resize) {
				return this.$el.addClass('resize');
			}
		}
	});

}).call(this);