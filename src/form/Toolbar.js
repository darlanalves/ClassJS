(function() {
	'use strict';

	Whapp.define('Whapp.view.form.Toolbar', {
		extend: 'Whapp.view.ViewAbstract',
		template: '<div class="ui-toolbar ui-clearfix"><div class="ui-left"></div><div class="ui-right"></div></div>',
		renderSelectors: {
			left: '.ui-left',
			right: '.ui-right'
		}
	});

}).call(this);