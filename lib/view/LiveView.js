(function() {

	/**
	 * Specialized view binded to a data model. Reacts to model changes, so its always updated
	 * @class Moovia.view.LiveView
	 * @author darlan
	 */
	Ext.define('Moovia.view.LiveView', {
		requires: ['Ext.data.Model'],
		extend: 'Moovia.view.ViewAbstract',

		/**
		 * @cfg {Ext.data.Model} model
		 * Model associated with this view (required)
		 */
		model: null,

		/**
		 * Returns the model associated with this view
		 * @return {Ext.data.Model} model
		 */
		getModel: function() {
			return this.model;
		},

        /**
         * TODO override and avoid DOM replacements (use LiveRange instead)
         * /
		refresh: function() {
			if (!this.$binding) {
				this.$binding = new Moovia.view.LiveRange(this.getTemplate().html);
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
				this.model = config.model;
				this.model.join(this);
				delete config.model;
				config.data = this.model.toJSON();
			}

			this.callParent([config]);
		},

		// Ext models WOP
		// >> http://images.uncyc.org/pt/b/b5/Pogpowered2.gif
		afterCommit: function() {
			this.onUpdate(Ext.data.Model.COMMIT);
		},
		afterReject: function() {
			this.onUpdate(Ext.data.Model.REJECT);
		},
		afterEdit: function() {
			this.onUpdate(Ext.data.Model.EDIT);
		},

		/**
		 * Called if the model was updated.
		 * Changes made to model will update the view as well
		 * @private
		 */
		onUpdate: function(action) {
			/*if (this.model.dirty) {
				this.applyData(this.model.getChanges());
			}*/
            this.applyData(this.model.toJSON());
		}
	});

}).call(this);