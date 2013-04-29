(function() {

	/**
	 * Specialized view binded to a data model. Reacts to model changes, so its always updated
	 * @class Whapp.view.LiveView
	 * @author darlan
	 */
	Whapp.define('Whapp.view.LiveView', {
		extend: 'Whapp.view.ViewAbstract',

		/**
		 * @cfg {Whapp.data.Model} model
		 * Model associated with this view (required)
		 */
		model: null,

		/**
		 * Returns the model associated with this view
		 * @return {Whapp.data.Model} model
		 */
		getModel: function() {
			return this.model;
		},

        /**
         * TODO override and avoid DOM replacements (use LiveRange instead)
         * /
		refresh: function() {
			if (!this.$binding) {
				this.$binding = new Whapp.view.LiveRange(this.getTemplate().html);
				this.$binding.build(this.$el.dom);
			}

			this.$binding.update(this.$data);
		},
		*/

		/**
		 * Registers this view as a fake store to receive updates
		 * TODO find a better way to bind events, as it will remove the original store
		 */
		_initialize: function(config) {
			if (config && config.model) {
				var me = this;
				this.model = config.model;
				this.model.addListener('update', function() {me.doUpdate()});
				delete config.model;
				config.data = this.model.toJSON();
			}

			this.callParent('_initialize', [config]);
		},

		/**
		 * Called if the model was updated.
		 * Changes made to model will update the view as well
		 * @private
		 */
		doUpdate: function() {
            this.applyData(this.getData());
		},

		getData: function() {
			return this.model.toJSON();
		}
	});

}).call(this);