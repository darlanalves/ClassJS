(function() {

	/**
	 * A simple implementation of view, with fewer resources
	 * Has a .template HTML and a render() method if additional things need to be done upon construction
	 */
	Ext.define('Moovia.view.LiteView', {
        extend: 'Moovia.view.ViewAbstract',
		/**
		 * @cfg {Object} data
		 * View data
		 */

        _initialize: function() {
            // TODO merge componentCls, additionalCls, cls into className
            this.callParent(params)
        }
	});
}).call(this);