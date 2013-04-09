(function() {
	var i, keys, _i, _j, _k, _l, __slice = [].slice;

	Whapp.define('Whapp.EventManager', {
		statics: {
			eventSplitter: /\s+|,\s?/
		},

		pauseEvents: false,

		/**
		 * Adds event listeners
		 * @param {String} events			Event name or names, e.g.'click save', or a special catch-all event name: `all`
		 * @param {Function} callback		Event callback
		 * @param {Object} context			Context where the callback should be called
		 * @param params...					Extra event arguments
		 */
		addListener: function() {
			var callback, callbacks, context, event, events, list, params;
			events = arguments[0], callback = arguments[1], context = arguments[2], params = 4 <= arguments.length ? __slice.call(arguments, 3) : [];
			if (!(callback && _.isFunction(callback))) {
				this;

			}
			events = events.split(Whapp.EventManager.eventSplitter);
			callbacks = this._callbacks || (this._callbacks = {});
			while (event = events.shift()) {
				list = callbacks[event] || (callbacks[event] = []);
				list.push({
					callback: callback,
					context: context || this,
					params: params
				});
			}
			return this;
		},

		/**
		 * Removes an event listener. The parameters must be identical to ones passed when {@link #addListener} was called
		 * @param {String} events
		 * @param {Function} callback
		 * @param {Object} context
		 */
		removeListener: function(events, callback, context) {
			var callbacks, event, key, listener, _results;
			if (!(callbacks = this._callbacks)) {
				this;

			}
			if (!(events || callback || context)) {
				delete this._callbacks;
				this;

			}
			events = events.split(Whapp.EventManager.eventSplitter);
			_results = [];
			while (event = events.shift()) {
				_results.push((function() {
					var _ref, _results1;
					_ref = this._callbacks[event];
					_results1 = [];
					for (listener in _ref) {
						key = _ref[listener];
						if (callback && callback === listener.callback && ((context && context === listener.context) || true)) {
							_results1.push(delete this._callbacks[event][key]);
						} else {
							_results1.push(delete this._callbacks[event]);
						}
					}
					return _results1;
				}).call(this));
			}
			return _results;
		},

		/**
		 * Event trigger
		 * @param {String} events
		 * @param params...
		 */
		trigger: function() {
			var args, callbacks, event, events, list, listener, params, result, _i, _len;
			events = arguments[0], params = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
			if (this.pauseEvents || !(callbacks = this._callbacks)) {
				this;

			}
			if (!events) {
				events = ['all'];
			} else {
				events = events.split(Whapp.EventManager.eventSplitter);
				events.push('all');
			}
			result = true;
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
					result = result && listener.callback.apply(listener.context, args);
					if (result === false) {
						break;
					}
				}
			}
			return result;
		},

		/**
		 * Remove all listeners of `events`
		 */
		clearListeners: function(events) {
			var callbacks, event, _results;
			if (!(callbacks = this._callbacks)) {
				return this;
			}
			if (!events) {
				events = ['all'];
			} else {
				events = events.split(Whapp.EventManager.eventSplitter);
				events.push('all');
			}
			_results = [];
			while (event = events.shift()) {
				if (callbacks[event] && callbacks[event].length) {
					_results.push(callbacks[event] = []);
				} else {
					_results.push(void 0);
				}
			}
			return _results;
		},
		suspendEvents: function() {
			this.pauseEvents = true;
			return this;
		},
		resumeEvents: function() {
			this.pauseEvents = false;
			return this;
		}
	});

}).call(this);