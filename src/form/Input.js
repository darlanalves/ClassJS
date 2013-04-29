(function() {

	Whapp.define('Whapp.view.form.Input', {
		extend: 'Whapp.view.ViewAbstract',
		config: {
			type: 'text',
			name: ''
		},
		template: '<input type="{type}" name="{name}" class="ui-input" />',
		initialize: function() {
			return this.$el.addClass("ui-" + this.type);
		},
		update: function(value) {
			return this.$el.val(value);
		},
		value: function() {
			return this.$el.val();
		}
	});

}).call(this);