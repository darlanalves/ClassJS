(function() {

	Whapp.define('Whapp.view.form.Form', {
		extend: 'Whapp.view.ViewAbstract',
		tagName: 'form',
		className: 'ui-form',
		serialize: function() {
			var field, fields, formData, name, _i, _len;
			fields = this.$el.serializeArray();
			formData = {};
			if (fields.length) {
				for (_i = 0, _len = fields.length; _i < _len; _i++) {
					field = fields[_i];
					name = field.name;
					if (name.substr(-2) === '[]') {
						name = name.substr(0, name.length - 2);
						if (!_.isArray(formData[name])) {
							formData[name] = [];
						}
						formData[name].push(field.value);
					} else {
						formData[name] = field.value;
					}
				}
			}
			return formData;
		}
	});

}).call(this);