(function(globalNamespace) {
	var _ = globalNamespace._,
		__slice = [].slice,
		__split = /\s+|,\s?/;

	globalNamespace.EventEmitter = Class.define('EventEmitter', {
		pauseEvents: false,

		/**
		 * Returns the list of registered callbacks
		 * @return {Object}
		 */
		getListeners: function() {
			return this.$callbacks || (this.$callbacks = {});
		},

		/**
		 * Adds event listeners
		 * @param {String} events			Event name or names, e.g.'click save', or a special catch-all event name: `all`
		 * @param {Function} callback		Event callback
		 * @param {Object} context			Context where the callback should be called
		 * @param params...					Extra event arguments
		 */
		addListener: function(events, callback, context) {
			if (callback && _.isFunction(callback)) {
				var callbacks, event, list, params = 4 <= arguments.length ? __slice.call(arguments, 3) : [];
				events = events.split(__split);
				callbacks = this.getListeners();

				while (event = events.shift()) {
					list = callbacks[event] || (callbacks[event] = []);
					list.push({
						callback: callback,
						context: context || this,
						params: params
					});
				}
			}

			return this;
		},

		/**
		 * Removes an event listener. The parameters must be identical to ones passed
		 * to {@link #addListener}
		 *
		 * @param {String} events
		 * @param {Function} callback
		 * @param {Object} context
		 */
		removeListener: function(events, callback, context) {
			if (!(events || callback || context)) {
				delete this.$callbacks;
				return this;
			}

			var callbacks = this.getListeners(),
				events = events.split(__split),
				results = [],
				fn = function(event) {
					var ref = callbacks[event],
						list = [];

					if (ref !== undefined) {
						_.each(ref, function(listener, key) {
							if (callback && callback === listener.callback && ((context && context === listener.context) || true)) {
								list.push(delete callbacks[event][key]);
							} else {
								list.push(delete callbacks[event]);
							}
						});
					}

					return list;
				};

			while (event = events.shift()) {
				results.push(fn.call(this, event));
			}

			return results;
		},

		/**
		 * Event trigger
		 * @param {String} events
		 * @param params...
		 */
		trigger: function(events) {
			var result, callbacks, event, list, listener, args, params = 2 <= arguments.length ? __slice.call(arguments, 1) : [];

			callbacks = this.getListeners();
			if (this.pauseEvents || !callbacks) {
				return this;
			}

			if (!events) {
				events = ['all'];
			} else {
				events = events.split(__split);
				events.push('all');
			}

			while (event = events.shift()) {
				if (!(list = callbacks[event])) {
					continue;
				}

				for (_i = 0, _len = list.length; _i < _len; _i++) {
					listener = list[_i];
					args = [];

					if (listener.params.length) {
						args = args.concat(listener.params);
					}

					if (params.length) {
						args = args.concat(params);
					}

					result = listener.callback.apply(listener.context, args);
					if (result === false) {
						break;
					}
				}
			}

			return Boolean(result);
		},

		/**
		 * Remove all listeners of `events`
		 */
		clearListeners: function(events) {
			if (!events) {
				this.$callbacks = {};
			} else {
				events = events.split(__split);
				var callbacks = this.getListeners(),
					event;

				if (callbacks) {
					while (event = events.shift()) {
						callbacks[event] = [];
					}
				}
			}
		},

		/**
		 * Listen to an event and drop listener once it happens.
		 * This method follows the same rules of {@link #addListener}
		 * @param {String} ename        Event to bind
		 * @param {Function} fn         Event handler
		 * @param {Object} scope        Scope where the handler will be called
		 */
		once: function(name, fn, scope) {
			var me = this,
				_func, handler, done = false;

			scope = scope || this;
			_func = function() {
				me.removeListener(name, handler, scope);
				fn.apply(this, arguments);
			};

			handler = function() {
				if (!done) {
					done = true;
					_func.apply(this, arguments);
					_func = null;
				}
			};

			this.on(name, handler, scope);
			return this;
		},

		/**
		 * Alias to {@link #addEventListener}
		 *
		 */
		on: function() {
			this.addListener.apply(this, arguments);
		},

		/**
		 * Alias to {@link #removeEventListener}
		 *
		 */
		off: function() {
			this.removeListener.apply(this, arguments);
		},

		/**
		 * Suspend events
		 */
		suspendEvents: function() {
			this.pauseEvents = true;
			return this;
		},

		/**
		 * Continue events
		 */
		resumeEvents: function() {
			this.pauseEvents = false;
			return this;
		}
	});

}(this));