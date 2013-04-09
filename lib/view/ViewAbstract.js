(function() {
	//'use strict';
	var trimRe = /^\s+|\s+$/g,
		__cssPropertiesRe = /width|height|left|top|right|bottom|minWidth|minHeight|maxWidth|maxHeight/,
		__hasOwn = {}.hasOwnProperty,
		__isFunction = Ext.isFunction,
		__isString = Ext.isString,
		__isArray = Ext.isArray,
		__addUnits = Ext.Element.addUnits,
		__extend = Ext.apply,
		__noop = function() {};

	/**
	 * Abstraction of View structure (shared methods and common properties)
	 * @class Whapp.view.ViewAbstract
	 * @author Darlan
	 * @abstract
	 */
	Ext.define('Whapp.view.ViewAbstract', {
		extend: 'Whapp.Component',
		statics: {
			DOMEvents: {
				click: true,
				dblclick: true,
				contextmenu: true,
				mousedown: true,
				mouseup: true,
				mouseenter: true,
				mouseleave: true,
				mousemove: true,
				mouseout: true,
				mouseover: true,
				keydown: true,
				keypress: true,
				keyup: true,
				submit: true
			},

			/**
			 * A hidden fragment to append template outputs before move 'em to a final position
			 * or take a view out of document tree
			 * @static
			 * @property {HTMLElement} limbo
			 */
			limbo: document.createDocumentFragment(),

			/**
			 * Returns a DOM element wrapper
			 * @param {String|HTMLElement} el
			 */
			find: function(el) {
				// Ext compatibility
				if (__isString(el)) {
					if (el.substr(0, 1) == '#') {
						el = el.substr(1);
					}
				}

                // TODO find a better way to detect document fragments
                if (el && el.nodeType && el.nodeType === 11) {
                    return el;
                }

				return Ext.get(el) || el;
			}
		},

		/**
		 * @constructor
		 */
		constructor: function(config) {
			/**
			 * @event update
			 * Fired whenever the view data is updated
			 */
			this.addEvents('update');
			this._initialize(config||{});

            if (this.autoRender) {
                this.appendTo(this.parentNode);
            }
		},

		/**
		 * @cfg {Boolean|Object}
		 * Set as `true` to relay common DOM events to view, or a custom list of DOM events
		 * you want to relay, with event names as keys and `true` as value.
		 * See {@link Moovia.view.ViewAbstract#DOMEvents}
		 */
		delegateDomEvents: true,

		/**
		 * @cfg {Boolean} hidden
		 * True will hide view
		 */

		/**
		 * @property {Boolean} hidden
		 */
		hidden: false,

        /**
		 * @property {Boolean} autoRender
		 * Set to false if the view shouldn't auto rendered into {@link #renderTo}
		 */
        autoRender: true,

        /**
		 * @cfg {String|HTMLElement} renderTo
		 */

		/**
		 * Additional things need to run every time the view is updated
		 * @method
		 */
		render: __noop,

		/**
		 * Called by constructor once, before render
		 * @method
		 */
		initialize: __noop,

		/**
		 * Returns the View's root element
		 * @return {Ext.Element} el
		 */
		getEl: function() {
			return this.$el;
		},

		/**
		 * Looks for one or more child node inside this view
		 * @param {String} selector A valid CSS selector
		 * @return {Ext.CompositeElement|Ext.CompositeElementLite}
		 */
		select: function(selector) {
			return this.$el.select(selector);
		},

		/**
		 * @property {Ext.Element} parentNode
		 * The node where this view was inserted
		 */

		/**
		 * Removes view from DOM but keeps the view nodes
		 */
		detach: function() {
			Moovia.view.ViewAbstract.limbo.appendChild(this.$el.dom);
			this.parentNode = null;
			return this;
		},

		/**
		 * Destroy this view (removes entire DOM structure and detach events)
		 */
		destroy: function() {
			Ext.removeNode(this.$el);
			this.clearListeners();
			return this.destroyed = true;
		},

		/**
		 * Show this item
		 */
		show: function() {
			this.$el.show();
			this.hidden = false;
			return this;
		},

		/**
		 * Hide this item
		 */
		hide: function() {
			this.$el.hide();
			this.hidden = true;
			return this;
		},

		/**
		 * Block view
		 */
		block: function() {
			if (!this.$el || this.destroyed) {
				return false;
			}
			this.suspendEvents();
			this.$el.addCls('ui-blocked');
			this.blocked = true;
			return this;
		},

		/**
		 * Unblock view
		 */
		unblock: function() {
			if (!this.$el || this.destroyed) {
				return false;
			}
			this.resumeEvents();
			this.$el.removeCls('ui-blocked');
			this.blocked = false;
			return this;
		},

		/**
		 * Update view's data
		 */
		setData: function(data) {
			this.applyData(data);
			return this;
		},

		/**
		 * Returns a JSON representation of current view data
		 */
		getData: function() {
			return this.$data;
		},

		/**
		 * Appends the view into a DOM node
		 * @param {String|HTMLElement|Ext.Element} container    The DOM node to append to
		 */
		appendTo: function(container) {
			this.doInsert('last', container);
			return this;
		},

		/**
		 * Prepends the view into a DOM node
		 * @param {String/HTMLElement/Ext.Element} container    The DOM node to prepend to
		 */
		prependTo: function(container) {
			this.doInsert('first', container);
			return this;
		},

		/**
		 * Inserts the view before a DOM node
		 * @param {String|HTMLElement|Ext.Element} element      The DOM node id, HTML element or Ext.Element
		 */
		insertBefore: function(element) {
			this.doInsert('before', element);
			return this;
		},

		/**
		 * Inserts the view after a DOM node
		 * @param {String|HTMLElement|Ext.Element} element      The DOM node id, HTML element or Ext.Element
		 */
		insertAfter: function(element) {
			this.doInsert('after', element);
			return this;
		},

		/**
		 * @property {String|String[]} className
		 * CSS class names to add in this view's DOM node
		 */
		className: false,

		/**
		 * @cfg {String} [tagName='div']
		 * Tag name of node used as root
		 */
		tagName: 'div',

		/**
		 * @property {String|String[]} template
		 * HTML template for this view guts (inner nodes)
		 */
		template: false,

		/**
		 * @return {Ext.Template|Ext.XTemplate}
		 */
		getTemplate: function() {
			if (this.template !== false) {
				if (!(this.template instanceof Ext.Template)) { // XTemplate is subclass of Template
					this.template = Ext.ClassManager.dynInstantiate('Ext.XTemplate', this.template);
				}
			}

			return this.template;
		},

		/**
		 * Applies data to view's template and returns HTML, or false if there's no template to apply
		 * @param {Object} data
		 * @return {String}
		 */
		applyTemplate: function(data) {
			var t = this.getTemplate();

			if (t) {
				//d = document.createDocumentFragment();
				//t.append(d, data || this.getData());
				return t.applyTemplate(data || this.getData());
			}

			return '';
		},

		/*****************************
		 * Private methods
		 * @ignore
		 *****************************/

		/**
		 * Insert view into a DOM node
		 * @param {String} where
		 * @param node
		 * @param {Boolean} [fadeIn=false]
		 * @private
		 */
		doInsert: function(where, node) {
			if (!node) {
				return;
			}

            if (!this.$el) {
				this.createView();
                this.updateView();
			}

			var whereMethod, _get = Moovia.view.ViewAbstract.find;
			node = _get(node);

            if (!node) {
				throw new Error('Container node not found');
			}

			if (where === 'first') {
                if (node.dom.childNodes.length > 0) {
                    this.$el.insertBefore(node.dom.firstChild);
                } else {
                    this.$el.appendTo(node);
                }
                this.parentNode = node;
            } else if (where === 'last') {
				this.$el.appendTo(node);
                this.parentNode = node;
			} else {
                whereMethod = where === 'before' ? 'insertBefore' : 'insertAfter';
                this.parentNode = _get(node.dom.parentNode);
                this.$el[whereMethod](node);
            }

			return this;
		},
		/**
		 * @private
		 */
		_initialize: function(config) {
			// TODO what about no renderTo? Just create and append to desired location...
			if (config.renderTo) {
				this.parentNode = Moovia.view.ViewAbstract.find(config.renderTo);
				delete config.renderTo;
			}

            if (!this.parentNode) {
				this.parentNode = Moovia.view.ViewAbstract.limbo;
			}

			if (config.data) {
				var data = config.data;
				delete config.data;
			} else {
				var data = {};
			}

			__extend(this, config);
			this.applyData(data, true);
			this.initialize(config);
		},

		/**
		 * @private
		 */
		_render: function() {
            this.applySelectors();
            this.applyAttributes();
            this.render();
		},

		/**
		 * Root element
		 * @private
		 */
		$el: false,

		/**
		 * Creates the the view DOM structure
		 * @private
		 */
		createView: function() {
            this.$el = Ext.get(document.createElement(this.tagName));
            this.$el.enableDisplayMode();
            // listen to and relay DOM events
            if (this.delegateDomEvents) {
                var evt = Moovia.view.ViewAbstract.DOMEvents;
                this.relayEvents(this.$el, Ext.Object.getKeys(evt));
                this.addEvents(evt);
                evt = false;
            }
            //this.applyAttributes();
            this.applyCls();
            this.applyStyles();
            this.hidden && this.hide();
		},

		/**
		 * Updates the view. Call it if you need a refresh in this view
		 */
		updateView: function() {
			var inner = this.applyTemplate();

			if (inner) {
				this.$el.dom.innerHTML = inner;
			}

            this._render();
		},

		/**
		 * @property {Object} renderers
		 * A list of special render functions to convert data before send it to template
		 *
		 * Example:
		 *      // will set `name` on {@link #renderData} that will be applied to component's template
		 *      Ext.define('My.Class', {
		 *          extend: Moovia.AbstractComponent,
		 *          innerTpl: '<h1>{name}</h1>',
		 *          renderers: {
		 *              name: function(str) { return 'My name is ' + str.split(' ').shift(); }
		 *          }
		 *      });
		 *
		 *      Ext.create('My.Class', {
		 *          renderTo: Ext.getBody(),
		 *          name: 'John Doe'
		 *      });
		 */

		$renderers: false,

		/**
		 * @private
		 */
		getRenderers: function() {
			if (this.$renderers === false) {
				var i, result = null,
					list = this.getMergedWithParents('renderers') || false;

				if (list) {
					result = {};
					for (i in list) {
						if (!(__hasOwn.call(list, i) && __isFunction(list[i]))) continue;
						result[i] = list[i];
					}
				}

				this.$renderers = result;
			}

			return this.$renderers;
		},

		/**
		 * View data
		 * @private
		 */
		$data: false,

		/**
		 * Updates view data and the DOM as well
		 * @param {Object} data         Data to update (may be partial data only)
		 * @private
		 */
        // silent is internal
		applyData: function(data, silent) {
			var undef, renderers = this.getRenderers();

			if (renderers !== null) {
				for (name in renderers) {
					if (__hasOwn.call(renderers, name) && __hasOwn.call(data, name)) {
						data[name] = renderers[name].call(this, (data[name] !== undef ? data[name] : null));
					}
				}
			}

			this.$data || (this.$data = {});
			Ext.Object.merge(this.$data, data);

			if (!silent) {
				this.updateView();
				this.fireEvent('update', this.$data);
			}
		},

		/**
		 * @cfg {Object} attributes
		 * A list of element attributes applied to root node
		 * Example:
		 *      Ext.define('SomeView', {
		 *          ...
		 *          tagName: 'a',
		 *          attributes: {
		 *              title: '...',
		 *              href: '#'
		 *          },
		 *          ...
		 *      });
		 */
		attributes: false,

		/**
		 * Apply attributes to view
		 */
		applyAttributes: function() {
			if (this.attributes !== false && __isObject(this.attributes)) {
				this.$el.set(this.attributes);
			}

			var id = this.getId();
			this.$el.set({
				'data-id': this.$data.id || id,
				'id': id
			});
		},

		/**
		 * @cfg {object} styles
		 * A list of CSS properties to apply after view is rendered
		 */
		styles: false,

		/**
		 * Apply allowed CSS properties passed via config, defined in {@link #cssProperties}.
		 * @param {Object} styles   Optional. A list of properties to apply instead. Numeric values can be specified without units
		 */
		applyStyles: function(styles) {
			// if a view doesn't have a own value set, `styles` property will be false
			if (!styles && this.styles === false) return;

			var val, i;
			styles || (styles = this.getMergedWithParents('styles') || false);

			if (!styles) return;
			for (i in styles) {
				if (!__hasOwn.call(styles, i)) continue;
				val = styles[i];

				// imports value if it's a size/position one (e.g width, left...)
				if (__cssPropertiesRe.test(i)) {
					this[i] = val;

					if (!__isString(prop)) {
						styles[i] = __addUnits(val)
					}
				}
			}

			this.$el.setStyle(styles);
		},

		/**
		 * Apply `className` value to view
		 * @private
		 */
		applyCls: function() {
			var cls = this.className;

			// skip search if there's nothing in this property
			if (cls !== false) {
				cls = (__isArray(cls) ? cls.join(' ') : String(cls)).replace(trimRe, '');
			}
			// TODO review when our Ext friend is gone
			this.$el.dom.className = '';
			if (cls) {
				this.$el.addCls(cls);
			}
		},

		renderSelectors: false,
		childSelectors: false,

		/**
		 * Apply post-render selectors
		 */
		applySelectors: function(overwrite) {
			var list, count, baseId, key, list, renderSel = this.getMergedWithParents('renderSelectors') || false,
				childSel = this.getMergedWithParents('childSelectors') || false;

			overwrite = Boolean(overwrite) == true;
			if (renderSel !== false) {
				for (key in renderSel) {
					if (!__hasOwn.call(renderSel, key)) continue;

					if (!this[key] || overwrite) {
						list = this.select(renderSel[key]), count = list.getCount();

						if (count == 0) {
							list = null;
						} else if (count == 1) {
							list = Ext.get(list.first().dom);
						}

						this[key] = list;
					}
				}
				list = null;
			}

			baseId = '#' + this.getId() + '-';
			if (childSel !== false) {
				for (key in childSel) {
					if (!__hasOwn.call(childSel, key)) continue;

					if (!this[key] || overwrite) {
						node = this.$el.select(baseId + childSel[key]);
						if (node.getCount() > 0) {
							node = Ext.get(node.first().dom);
						}

						this[key] = node;
					}
				}
			}
		}
	});

}).call(this);