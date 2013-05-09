(function() {
	var __has = {}.hasOwnProperty;

    /**
	 * Base class to application components. Implements really basic features, such method hooking, events, etc.
	 * @class Whapp.view.Component
	 * @author Darlan
	 */
	Class.define('Whapp.Component', {
        extend: 'Whapp.EventManager',

        /**
		 * Destroy this instance
		 */
		destroy: function() {
			this.clearListeners();
			return this.destroyed = true;
		},

        /**
		 * Hook a callback before method `methodName`
		 * @param {String} methodName
		 * @param {Function} fn
		 */
		hookBefore: function(methodName, fn) {
			this.hook(methodName, 'before', fn);
		},

		/**
		 * Hook a callback after method `methodName`
		 * @param {String} methodName
		 * @param {Function} fn
		 */
		hookAfter: function(methodName, fn) {
			this.hook(methodName, 'after', fn);
		},

        /**
		 * Hooks a callback before or after a method call
		 * @param {String} methodName   Method name
		 * @param {String} when         `before` or `after`
		 * @param {Function} fn         Hook function
		 * @throws {Error} Trying to hook on a invalid method
		 * @throws {Error} Trying to hook a invalid callback
		 * @private
		 */
		hook: function(methodName, when, fn) {
			if (!_.isFunction(this[methodName])) {
				throw new Error('Trying to hook on a invalid method: ' + methodName);
			}

            if (!_.isFunction(fn)) {
				throw new Error('Tried to hook a invalid callback!');
			}

			if (!this.$hooks) {
				this.$hooks = {};
			}

			if (!this[methodName].$hooked) {
				this.addHooks(methodName);
			}

			this.$hooks[methodName].push(when, fn);
		},

		/**
		 * Replaces object method with a hooked one
		 * @param {String} methodName
		 * @private
		 */
		addHooks: function(methodName) {
			var me = this,
				method = this[methodName];

            // TODO suspend hooks if component is blocked!
			this.$hooks[methodName] = new Whapp.view.HookManager();
			this[methodName] = this.$hooks[methodName].getHookedMethod(method, this);
			this[methodName].$hooked = true;
		},

		blocked: false,

        /**
		 * Block the component
		 */
		block: function() {
			if (this.destroyed) {
				return false;
			}
			this.suspendEvents();
			this.blocked = true;
            return this;
		},

        /**
		 * Unblock the component (usually called after {@link #block})
		 */
		unblock: function() {
			if (this.destroyed) {
				return false;
			}
			this.resumeEvents();
			this.blocked = false;
            return this;
		},

        /**
         * Enable/disable component interaction (e.g. events)
         * @param {Boolean} [value=true]
         * @return this
         */
        setDisabled: function(value) {
            value = (value !== void 0 ? Boolean(value) : true);
            if (value) {
                this.block();
            } else {
                this.unblock();
            }

            return this;
        },

        /**
		 * @property $id
		 * Component id
		 */
		$id: null,

        /**
		 * Gets the component id
		 */
		getId: (function() {
			var UID = 1000;
			return function() {
				if (!this.$id) {
					this.$id = 'component-' + (++UID);
				}

				return this.$id;
			};
		})(),

        /**
         * Gets the many property values in the prototype chain, from the bottom up
         * @param {String} name             Name of property to search
         * @return {Array} Array of found values to `name` property
         */
		getPrototypeChain: function(name) {
			var ownerPrototype, list = [], _self = this.$self();

			if (_self) {
                if (this[name] != _self[name]) {
                    list.unshift(this[name]);
                }

                if (__has.call(_self, name)) {
                    list.unshift(_self[name]);
                }
			}

			ownerPrototype = this.superclass;
			while (ownerPrototype) {
				if (ownerPrototype && __has.call(ownerPrototype, name)) {
					list.unshift(ownerPrototype[name]);
				}

				ownerPrototype = ownerPrototype.superclass;
			}

			return list;
		},

        /**
		 * Merge arrays or objects that were set more than once (in current class and superclasses)
		 * If properties are not a chain of arrays or objects, returns the current instance value
		 * @param {String} name                     Property name
		 * @param {Boolean} [cloneObjects=false]    If true and is a chain of objects, returns a clone
		 */
		getMergedWithParents: function(name, cloneObjects) {
			var chain, isObject, result, value, last;
			chain = this.getPrototypeChain(name);
            cloneObjects = Boolean(cloneObjects) == true;
			result = null;

			if (chain.length) {
                last = _.last(chain);

				if (_.isArray(last)) {
					isObject = false;
					result = [];
				} else if (_.isObject(last)) {
					isObject = true;
					result = {};
				} else {
					return last;
				}

				while (true) {
                    value = chain.shift();
					if (isObject && value) {
						_.extend(result, value);
					} else if (value.length) {
						result = result.concat(value);
					}

                    if (chain.length == 0) break;
				}

				if (isObject && cloneObjects) {
					result = _.clone(result);
				}
			}

			return result;
		}
	});

}).call(this);