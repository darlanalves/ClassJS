/**
 * Hook Manager class
 * Helps in the handle of method hooks
 */
Whapp.define('Whapp.view.HookManager', {
    constructor: function() {
        this.hooks = {
            before: [],
            after: []
        };
    },

    /**
	 * Executes the hooked functions
	 * @param {String} when
	 * @param {Array} args
	 * @param {Object} [scope=this]
	 */
    callHooks: function(when, args, scope) {
        var i, j, list = this.hooks[when], result;
        args = args || [];
        scope = scope || this;
        if (list.length) {
            for (i = 0, j = list.length; i < j; i++) {
                result = list[i].apply(scope, args);
                if (result === false) { return result; }
            }
        }
	},

    /**
	 * Clear hooks list
	 * @param {String} when     `before` or `after`
	 */
    clear: function(when) {
        this.hooks[when] = [];
    },

    /**
	 * Clear all hooks
	 */
    clearAll: function() {
        this.hooks['before'] = this.hooks['after'] = [];
    },

    /**
	 * Adds a new hook
	 * @param {String} when
	 * @param {Function} fn
	 */
    push: function(when, fn) {
        this.hooks[when].push(fn);
    },

    /**
	 * Returns a function to replace the `originalMethod`
	 * @param {Function} originalMethod     Original method to replace
	 * @param {Object} scope                Scope of original method
	 */
    getHookedMethod: function(originalMethod, scope) {
        var me = this;
        return function() {
            me.callHooks('before', arguments, scope);
            var result = originalMethod.apply(scope, arguments);
            me.callHooks('after', arguments, scope);
            return result;
        }
    }
});