
    if (typeof module !== 'undefined' && module.exports) {
		Class.extend = require('extends');
        module.exports = Class;
        globalScope.Class = Class;
    } else {
		Class.extend = globalScope.extend;
        globalScope.Class = Class;
    }

}.call(this);