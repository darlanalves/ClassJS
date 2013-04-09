(function() {
	var buttonTpl;

	buttonTpl = _.template('<a href="{href}" class="clearfix">\
		<span data-icon="{icon}"></span>\
		<label>{label}</label>\
	</a>');

	define('Whapp.view.form.Button', {
		extend: 'Whapp.view.ViewAbstract',
		consts: ['ICON_LEFT', 'ICON_RIGHT', 'ICON_TOP', 'ICON_BOTTOM'],
		tagName: 'button',
		template: '<span class="ui-icon {icon}" id="{id}-icon"/><span class="ui-label" id="{id}-lbl">{label}</span>',
		className: 'ui-button',
		config: {
			icon: '',
			label: '',
			iconPos: 'ICON_LEFT',
			name: ''
		},
		childSelectors: {
			labelEl: 'lbl',
			iconEl: 'icon'
		},
		initComponent: function() {
			this.$el.addClass('ui-' + this.iconPos.replace('_', '-').toLowerCase());
			this.setIcon(this.icon);
			return this.setLabel(this.label);
		},
		setIcon: function(icon) {
			if (icon) {
				this.icon = icon;
				this.iconEl.removeClass().addClass('ui-icon ' + this.icon);
				return this.$el.removeClass('no-icon');
			} else {
				return this.$el.addClass('no-icon');
			}
		},
		setLabel: function(label) {
			if (label) {
				this.label = label;
				this.labelEl.html(label);
				return this.$el.removeClass('no-label');
			} else {
				return this.$el.addClass('no-label');
			}
		}
	});

}).call(this);