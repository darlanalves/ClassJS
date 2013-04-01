(function() {
  var i, keys, _i, _j, _k, _l,
    __slice = [].slice;

  namespace('Whapp');

  declare('Whapp.EventManager', {
    statics: {
      eventSplitter: /\s+|,\s?/
    },
    pauseEvents: false,
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

  keys = {
    'BACKSPACE': 8,
    'TAB': 9,
    'NUM_PAD_CLEAR': 12,
    'ENTER': 13,
    'SHIFT': 16,
    'CTRL': 17,
    'ALT': 18,
    'PAUSE': 19,
    'CAPS_LOCK': 20,
    'ESCAPE': 27,
    'SPACEBAR': 32,
    'PAGE_UP': 33,
    'PAGE_DOWN': 34,
    'END': 35,
    'HOME': 36,
    'ARROW_LEFT': 37,
    'ARROW_UP': 38,
    'ARROW_RIGHT': 39,
    'ARROW_DOWN': 40,
    'PRINT_SCREEN': 44,
    'INSERT': 45,
    'DELETE': 46,
    'SEMICOLON': 59,
    'WINDOWS_LEFT': 91,
    'WINDOWS_RIGHT': 92,
    'SELECT': 93,
    'NUM_PAD_ASTERISK': 106,
    'NUM_PAD_PLUS_SIGN': 107,
    'NUM_PAD_HYPHEN-MINUS': 109,
    'NUM_PAD_FULL_STOP': 110,
    'NUM_PAD_SOLIDUS': 111,
    'NUM_LOCK': 144,
    'SCROLL_LOCK': 145,
    'NUM_PAD_SEMICOLON': 186,
    'EQUALS_SIGN': 187,
    'COMMA': 188,
    'HYPHEN_MINUS': 189,
    'FULL_STOP': 190,
    'SOLIDUS': 191,
    'GRAVE_ACCENT': 192,
    'LEFT_SQUARE_BRACKET': 219,
    'REVERSE_SOLIDUS': 220,
    'RIGHT_SQUARE_BRACKET': 221,
    'APOSTROPHE': 222
  };

  for (i = _i = 48; _i <= 57; i = ++_i) {
    keys['' + (i - 48)] = i;
  }

  for (i = _j = 65; _j <= 90; i = ++_j) {
    keys['' + String.fromCharCode(i)] = i;
  }

  for (i = _k = 96; _k <= 105; i = ++_k) {
    keys['NUM_PAD_' + (i - 96)] = i;
  }

  for (i = _l = 112; _l <= 123; i = ++_l) {
    keys['F' + (i - 112 + 1)] = i;
  }

  _.extend(Whapp.EventManager, keys);

}).call(this);
