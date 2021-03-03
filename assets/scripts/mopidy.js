parcelRequire = (function (e, r, t, n) {
  var i,
    o = "function" == typeof parcelRequire && parcelRequire,
    u = "function" == typeof require && require;
  function f(t, n) {
    if (!r[t]) {
      if (!e[t]) {
        var i = "function" == typeof parcelRequire && parcelRequire;
        if (!n && i) return i(t, !0);
        if (o) return o(t, !0);
        if (u && "string" == typeof t) return u(t);
        var c = new Error("Cannot find module '" + t + "'");
        throw ((c.code = "MODULE_NOT_FOUND"), c);
      }
      (p.resolve = function (r) {
        return e[t][1][r] || r;
      }),
        (p.cache = {});
      var l = (r[t] = new f.Module(t));
      e[t][0].call(l.exports, p, l, l.exports, this);
    }
    return r[t].exports;
    function p(e) {
      return f(p.resolve(e));
    }
  }
  (f.isParcelRequire = !0),
    (f.Module = function (e) {
      (this.id = e), (this.bundle = f), (this.exports = {});
    }),
    (f.modules = e),
    (f.cache = r),
    (f.parent = o),
    (f.register = function (r, t) {
      e[r] = [
        function (e, r) {
          r.exports = t;
        },
        {},
      ];
    });
  for (var c = 0; c < t.length; c++)
    try {
      f(t[c]);
    } catch (e) {
      i || (i = e);
    }
  if (t.length) {
    var l = f(t[t.length - 1]);
    "object" == typeof exports && "undefined" != typeof module
      ? (module.exports = l)
      : "function" == typeof define && define.amd
      ? define(function () {
          return l;
        })
      : n && (this[n] = l);
  }
  if (((parcelRequire = f), i)) throw i;
  return f;
})(
  {
    FRpO: [
      function (require, module, exports) {
        "use strict";
        var e,
          t = "object" == typeof Reflect ? Reflect : null,
          n =
            t && "function" == typeof t.apply
              ? t.apply
              : function (e, t, n) {
                  return Function.prototype.apply.call(e, t, n);
                };
        function r(e) {
          console && console.warn && console.warn(e);
        }
        e =
          t && "function" == typeof t.ownKeys
            ? t.ownKeys
            : Object.getOwnPropertySymbols
            ? function (e) {
                return Object.getOwnPropertyNames(e).concat(
                  Object.getOwnPropertySymbols(e),
                );
              }
            : function (e) {
                return Object.getOwnPropertyNames(e);
              };
        var i =
          Number.isNaN ||
          function (e) {
            return e != e;
          };
        function o() {
          o.init.call(this);
        }
        (module.exports = o),
          (module.exports.once = m),
          (o.EventEmitter = o),
          (o.prototype._events = void 0),
          (o.prototype._eventsCount = 0),
          (o.prototype._maxListeners = void 0);
        var s = 10;
        function u(e) {
          if ("function" != typeof e)
            throw new TypeError(
              'The "listener" argument must be of type Function. Received type ' +
                typeof e,
            );
        }
        function f(e) {
          return void 0 === e._maxListeners
            ? o.defaultMaxListeners
            : e._maxListeners;
        }
        function v(e, t, n, i) {
          var o, s, v;
          if (
            (u(n),
            void 0 === (s = e._events)
              ? ((s = e._events = Object.create(null)), (e._eventsCount = 0))
              : (void 0 !== s.newListener &&
                  (e.emit("newListener", t, n.listener ? n.listener : n),
                  (s = e._events)),
                (v = s[t])),
            void 0 === v)
          )
            (v = s[t] = n), ++e._eventsCount;
          else if (
            ("function" == typeof v
              ? (v = s[t] = i ? [n, v] : [v, n])
              : i
              ? v.unshift(n)
              : v.push(n),
            (o = f(e)) > 0 && v.length > o && !v.warned)
          ) {
            v.warned = !0;
            var l = new Error(
              "Possible EventEmitter memory leak detected. " +
                v.length +
                " " +
                String(t) +
                " listeners added. Use emitter.setMaxListeners() to increase limit",
            );
            (l.name = "MaxListenersExceededWarning"),
              (l.emitter = e),
              (l.type = t),
              (l.count = v.length),
              r(l);
          }
          return e;
        }
        function l() {
          if (!this.fired)
            return (
              this.target.removeListener(this.type, this.wrapFn),
              (this.fired = !0),
              0 === arguments.length
                ? this.listener.call(this.target)
                : this.listener.apply(this.target, arguments)
            );
        }
        function c(e, t, n) {
          var r = {
              fired: !1,
              wrapFn: void 0,
              target: e,
              type: t,
              listener: n,
            },
            i = l.bind(r);
          return (i.listener = n), (r.wrapFn = i), i;
        }
        function a(e, t, n) {
          var r = e._events;
          if (void 0 === r) return [];
          var i = r[t];
          return void 0 === i
            ? []
            : "function" == typeof i
            ? n
              ? [i.listener || i]
              : [i]
            : n
            ? d(i)
            : p(i, i.length);
        }
        function h(e) {
          var t = this._events;
          if (void 0 !== t) {
            var n = t[e];
            if ("function" == typeof n) return 1;
            if (void 0 !== n) return n.length;
          }
          return 0;
        }
        function p(e, t) {
          for (var n = new Array(t), r = 0; r < t; ++r) n[r] = e[r];
          return n;
        }
        function y(e, t) {
          for (; t + 1 < e.length; t++) e[t] = e[t + 1];
          e.pop();
        }
        function d(e) {
          for (var t = new Array(e.length), n = 0; n < t.length; ++n)
            t[n] = e[n].listener || e[n];
          return t;
        }
        function m(e, t) {
          return new Promise(function (n, r) {
            function i() {
              void 0 !== o && e.removeListener("error", o),
                n([].slice.call(arguments));
            }
            var o;
            "error" !== t &&
              ((o = function (n) {
                e.removeListener(t, i), r(n);
              }),
              e.once("error", o)),
              e.once(t, i);
          });
        }
        Object.defineProperty(o, "defaultMaxListeners", {
          enumerable: !0,
          get: function () {
            return s;
          },
          set: function (e) {
            if ("number" != typeof e || e < 0 || i(e))
              throw new RangeError(
                'The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' +
                  e +
                  ".",
              );
            s = e;
          },
        }),
          (o.init = function () {
            (void 0 !== this._events &&
              this._events !== Object.getPrototypeOf(this)._events) ||
              ((this._events = Object.create(null)), (this._eventsCount = 0)),
              (this._maxListeners = this._maxListeners || void 0);
          }),
          (o.prototype.setMaxListeners = function (e) {
            if ("number" != typeof e || e < 0 || i(e))
              throw new RangeError(
                'The value of "n" is out of range. It must be a non-negative number. Received ' +
                  e +
                  ".",
              );
            return (this._maxListeners = e), this;
          }),
          (o.prototype.getMaxListeners = function () {
            return f(this);
          }),
          (o.prototype.emit = function (e) {
            for (var t = [], r = 1; r < arguments.length; r++)
              t.push(arguments[r]);
            var i = "error" === e,
              o = this._events;
            if (void 0 !== o) i = i && void 0 === o.error;
            else if (!i) return !1;
            if (i) {
              var s;
              if ((t.length > 0 && (s = t[0]), s instanceof Error)) throw s;
              var u = new Error(
                "Unhandled error." + (s ? " (" + s.message + ")" : ""),
              );
              throw ((u.context = s), u);
            }
            var f = o[e];
            if (void 0 === f) return !1;
            if ("function" == typeof f) n(f, this, t);
            else {
              var v = f.length,
                l = p(f, v);
              for (r = 0; r < v; ++r) n(l[r], this, t);
            }
            return !0;
          }),
          (o.prototype.addListener = function (e, t) {
            return v(this, e, t, !1);
          }),
          (o.prototype.on = o.prototype.addListener),
          (o.prototype.prependListener = function (e, t) {
            return v(this, e, t, !0);
          }),
          (o.prototype.once = function (e, t) {
            return u(t), this.on(e, c(this, e, t)), this;
          }),
          (o.prototype.prependOnceListener = function (e, t) {
            return u(t), this.prependListener(e, c(this, e, t)), this;
          }),
          (o.prototype.removeListener = function (e, t) {
            var n, r, i, o, s;
            if ((u(t), void 0 === (r = this._events))) return this;
            if (void 0 === (n = r[e])) return this;
            if (n === t || n.listener === t)
              0 == --this._eventsCount
                ? (this._events = Object.create(null))
                : (delete r[e],
                  r.removeListener &&
                    this.emit("removeListener", e, n.listener || t));
            else if ("function" != typeof n) {
              for (i = -1, o = n.length - 1; o >= 0; o--)
                if (n[o] === t || n[o].listener === t) {
                  (s = n[o].listener), (i = o);
                  break;
                }
              if (i < 0) return this;
              0 === i ? n.shift() : y(n, i),
                1 === n.length && (r[e] = n[0]),
                void 0 !== r.removeListener &&
                  this.emit("removeListener", e, s || t);
            }
            return this;
          }),
          (o.prototype.off = o.prototype.removeListener),
          (o.prototype.removeAllListeners = function (e) {
            var t, n, r;
            if (void 0 === (n = this._events)) return this;
            if (void 0 === n.removeListener)
              return (
                0 === arguments.length
                  ? ((this._events = Object.create(null)),
                    (this._eventsCount = 0))
                  : void 0 !== n[e] &&
                    (0 == --this._eventsCount
                      ? (this._events = Object.create(null))
                      : delete n[e]),
                this
              );
            if (0 === arguments.length) {
              var i,
                o = Object.keys(n);
              for (r = 0; r < o.length; ++r)
                "removeListener" !== (i = o[r]) && this.removeAllListeners(i);
              return (
                this.removeAllListeners("removeListener"),
                (this._events = Object.create(null)),
                (this._eventsCount = 0),
                this
              );
            }
            if ("function" == typeof (t = n[e])) this.removeListener(e, t);
            else if (void 0 !== t)
              for (r = t.length - 1; r >= 0; r--) this.removeListener(e, t[r]);
            return this;
          }),
          (o.prototype.listeners = function (e) {
            return a(this, e, !0);
          }),
          (o.prototype.rawListeners = function (e) {
            return a(this, e, !1);
          }),
          (o.listenerCount = function (e, t) {
            return "function" == typeof e.listenerCount
              ? e.listenerCount(t)
              : h.call(e, t);
          }),
          (o.prototype.listenerCount = h),
          (o.prototype.eventNames = function () {
            return this._eventsCount > 0 ? e(this._events) : [];
          });
      },
      {},
    ],
    lNMl: [
      function (require, module, exports) {
        var global = arguments[3];
        var e = arguments[3],
          o = null;
        "undefined" != typeof WebSocket
          ? (o = WebSocket)
          : "undefined" != typeof MozWebSocket
          ? (o = MozWebSocket)
          : void 0 !== e
          ? (o = e.WebSocket || e.MozWebSocket)
          : "undefined" != typeof window
          ? (o = window.WebSocket || window.MozWebSocket)
          : "undefined" != typeof self &&
            (o = self.WebSocket || self.MozWebSocket),
          (module.exports = o);
      },
      {},
    ],
    qsOc: [
      function (require, module, exports) {
        function e(r) {
          var o = "function" == typeof Map ? new Map() : void 0;
          return (e = function (e) {
            if (null === e || !n(e)) return e;
            if ("function" != typeof e)
              throw new TypeError(
                "Super expression must either be null or a function",
              );
            if (void 0 !== o) {
              if (o.has(e)) return o.get(e);
              o.set(e, r);
            }
            function r() {
              return t(e, arguments, d(this).constructor);
            }
            return (
              (r.prototype = Object.create(e.prototype, {
                constructor: {
                  value: r,
                  enumerable: !1,
                  writable: !0,
                  configurable: !0,
                },
              })),
              f(r, e)
            );
          })(r);
        }
        function t(e, n, r) {
          return (t = y()
            ? Reflect.construct
            : function (e, t, n) {
                var r = [null];
                r.push.apply(r, t);
                var o = new (Function.bind.apply(e, r))();
                return n && f(o, n.prototype), o;
              }).apply(null, arguments);
        }
        function n(e) {
          return -1 !== Function.toString.call(e).indexOf("[native code]");
        }
        function r(e) {
          return (r =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (e) {
                  return typeof e;
                }
              : function (e) {
                  return e &&
                    "function" == typeof Symbol &&
                    e.constructor === Symbol &&
                    e !== Symbol.prototype
                    ? "symbol"
                    : typeof e;
                })(e);
        }
        function o(e, t) {
          var n = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var r = Object.getOwnPropertySymbols(e);
            t &&
              (r = r.filter(function (t) {
                return Object.getOwnPropertyDescriptor(e, t).enumerable;
              })),
              n.push.apply(n, r);
          }
          return n;
        }
        function i(e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = null != arguments[t] ? arguments[t] : {};
            t % 2
              ? o(Object(n), !0).forEach(function (t) {
                  c(e, t, n[t]);
                })
              : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : o(Object(n)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(n, t),
                  );
                });
          }
          return e;
        }
        function c(e, t, n) {
          return (
            t in e
              ? Object.defineProperty(e, t, {
                  value: n,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                })
              : (e[t] = n),
            e
          );
        }
        function s(e, t) {
          if (!(e instanceof t))
            throw new TypeError("Cannot call a class as a function");
        }
        function a(e, t) {
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              "value" in r && (r.writable = !0),
              Object.defineProperty(e, r.key, r);
          }
        }
        function u(e, t, n) {
          return t && a(e.prototype, t), n && a(e, n), e;
        }
        function l(e, t) {
          if ("function" != typeof t && null !== t)
            throw new TypeError(
              "Super expression must either be null or a function",
            );
          (e.prototype = Object.create(t && t.prototype, {
            constructor: { value: e, writable: !0, configurable: !0 },
          })),
            t && f(e, t);
        }
        function f(e, t) {
          return (f =
            Object.setPrototypeOf ||
            function (e, t) {
              return (e.__proto__ = t), e;
            })(e, t);
        }
        function p(e) {
          return function () {
            var t,
              n = d(e);
            if (y()) {
              var r = d(this).constructor;
              t = Reflect.construct(n, arguments, r);
            } else t = n.apply(this, arguments);
            return h(this, t);
          };
        }
        function h(e, t) {
          return !t || ("object" !== r(t) && "function" != typeof t) ? b(e) : t;
        }
        function b(e) {
          if (void 0 === e)
            throw new ReferenceError(
              "this hasn't been initialised - super() hasn't been called",
            );
          return e;
        }
        function y() {
          if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
          if (Reflect.construct.sham) return !1;
          if ("function" == typeof Proxy) return !0;
          try {
            return (
              Date.prototype.toString.call(
                Reflect.construct(Date, [], function () {}),
              ),
              !0
            );
          } catch (e) {
            return !1;
          }
        }
        function d(e) {
          return (d = Object.setPrototypeOf
            ? Object.getPrototypeOf
            : function (e) {
                return e.__proto__ || Object.getPrototypeOf(e);
              })(e);
        }
        var v = require("events"),
          w = require("isomorphic-ws");
        function k(e) {
          return e.replace(/(_[a-z])/g, function (e) {
            return e.toUpperCase().replace("_", "");
          });
        }
        var _ = (function (e) {
            l(n, v);
            var t = p(n);
            function n(e) {
              var r;
              return (
                s(this, n),
                ((r = t.call(this))._console = r._getConsole(e || {})),
                (r._settings = r._configure(e || {})),
                (r._backoffDelay = r._settings.backoffDelayMin),
                (r._pendingRequests = {}),
                (r._webSocket = null),
                r._delegateEvents(),
                r._settings.autoConnect && r.connect(),
                r
              );
            }
            return (
              u(n, [
                {
                  key: "_getConsole",
                  value: function (e) {
                    if (void 0 !== e.console) return e.console;
                    var t = ("undefined" != typeof console && console) || {};
                    return (
                      (t.log = t.log || function () {}),
                      (t.warn = t.warn || function () {}),
                      (t.error = t.error || function () {}),
                      t
                    );
                  },
                },
                {
                  key: "_configure",
                  value: function (e) {
                    var t = i({}, e),
                      n =
                        "undefined" != typeof document &&
                        "https:" === document.location.protocol
                          ? "wss://"
                          : "ws://",
                      r =
                        ("undefined" != typeof document &&
                          document.location.host) ||
                        "localhost";
                    return (
                      (t.webSocketUrl =
                        e.webSocketUrl || "".concat(n).concat(r, "/mopidy/ws")),
                      !1 !== e.autoConnect && (t.autoConnect = !0),
                      (t.backoffDelayMin = e.backoffDelayMin || 1e3),
                      (t.backoffDelayMax = e.backoffDelayMax || 64e3),
                      t
                    );
                  },
                },
                {
                  key: "_delegateEvents",
                  value: function () {
                    this.removeAllListeners("websocket:close"),
                      this.removeAllListeners("websocket:error"),
                      this.removeAllListeners("websocket:incomingMessage"),
                      this.removeAllListeners("websocket:open"),
                      this.removeAllListeners("state:offline"),
                      this.on("websocket:close", this._cleanup),
                      this.on("websocket:error", this._handleWebSocketError),
                      this.on("websocket:incomingMessage", this._handleMessage),
                      this.on("websocket:open", this._resetBackoffDelay),
                      this.on("websocket:open", this._getApiSpec),
                      this.on("state:offline", this._reconnect);
                  },
                },
                {
                  key: "off",
                  value: function () {
                    if (0 === arguments.length) this.removeAllListeners();
                    else if (1 === arguments.length) {
                      var e = arguments.length <= 0 ? void 0 : arguments[0];
                      if ("string" != typeof e)
                        throw Error(
                          "Expected no arguments, a string, or a string and a listener.",
                        );
                      this.removeAllListeners(e);
                    } else this.removeListener.apply(this, arguments);
                  },
                },
                {
                  key: "connect",
                  value: function () {
                    var e = this;
                    if (this._webSocket) {
                      if (this._webSocket.readyState === n.WebSocket.OPEN)
                        return;
                      this._webSocket.close();
                    }
                    (this._webSocket =
                      this._settings.webSocket ||
                      new n.WebSocket(this._settings.webSocketUrl)),
                      (this._webSocket.onclose = function (t) {
                        e.emit("websocket:close", t);
                      }),
                      (this._webSocket.onerror = function (t) {
                        e.emit("websocket:error", t);
                      }),
                      (this._webSocket.onopen = function () {
                        e.emit("websocket:open");
                      }),
                      (this._webSocket.onmessage = function (t) {
                        e.emit("websocket:incomingMessage", t);
                      });
                  },
                },
                {
                  key: "_cleanup",
                  value: function (e) {
                    var t = this;
                    Object.keys(this._pendingRequests).forEach(function (r) {
                      var o = t._pendingRequests[r].reject;
                      delete t._pendingRequests[r];
                      var i = new n.ConnectionError("WebSocket closed");
                      (i.closeEvent = e), o(i);
                    }),
                      this.emit("state", "state:offline"),
                      this.emit("state:offline");
                  },
                },
                {
                  key: "_reconnect",
                  value: function () {
                    var e = this;
                    setTimeout(function () {
                      e.emit("state", "reconnectionPending", {
                        timeToAttempt: e._backoffDelay,
                      }),
                        e.emit("reconnectionPending", {
                          timeToAttempt: e._backoffDelay,
                        }),
                        setTimeout(function () {
                          e.emit("state", "reconnecting"),
                            e.emit("reconnecting"),
                            e.connect();
                        }, e._backoffDelay),
                        (e._backoffDelay *= 2),
                        e._backoffDelay > e._settings.backoffDelayMax &&
                          (e._backoffDelay = e._settings.backoffDelayMax);
                    }, 0);
                  },
                },
                {
                  key: "_resetBackoffDelay",
                  value: function () {
                    this._backoffDelay = this._settings.backoffDelayMin;
                  },
                },
                {
                  key: "close",
                  value: function () {
                    this.off("state:offline", this._reconnect),
                      this._webSocket && this._webSocket.close();
                  },
                },
                {
                  key: "_handleWebSocketError",
                  value: function (e) {
                    this._console.warn("WebSocket error:", e.stack || e);
                  },
                },
                {
                  key: "_send",
                  value: function (e) {
                    var t = this;
                    switch (this._webSocket.readyState) {
                      case n.WebSocket.CONNECTING:
                        return Promise.reject(
                          new n.ConnectionError(
                            "WebSocket is still connecting",
                          ),
                        );
                      case n.WebSocket.CLOSING:
                        return Promise.reject(
                          new n.ConnectionError("WebSocket is closing"),
                        );
                      case n.WebSocket.CLOSED:
                        return Promise.reject(
                          new n.ConnectionError("WebSocket is closed"),
                        );
                      default:
                        return new Promise(function (n, r) {
                          var o = i(
                            i({}, e),
                            {},
                            { jsonrpc: "2.0", id: t._nextRequestId() },
                          );
                          (t._pendingRequests[o.id] = {
                            resolve: n,
                            reject: r,
                          }),
                            t._webSocket.send(JSON.stringify(o)),
                            t.emit("websocket:outgoingMessage", o);
                        });
                    }
                  },
                },
                {
                  key: "_handleMessage",
                  value: function (e) {
                    try {
                      var t = JSON.parse(e.data);
                      Object.hasOwnProperty.call(t, "id")
                        ? this._handleResponse(t)
                        : Object.hasOwnProperty.call(t, "event")
                        ? this._handleEvent(t)
                        : this._console.warn(
                            "Unknown message type received. Message was: ".concat(
                              e.data,
                            ),
                          );
                    } catch (n) {
                      if (!(n instanceof SyntaxError)) throw n;
                      this._console.warn(
                        "WebSocket message parsing failed. Message was: ".concat(
                          e.data,
                        ),
                      );
                    }
                  },
                },
                {
                  key: "_handleResponse",
                  value: function (e) {
                    if (
                      Object.hasOwnProperty.call(this._pendingRequests, e.id)
                    ) {
                      var t = this._pendingRequests[e.id],
                        r = t.resolve,
                        o = t.reject;
                      if (
                        (delete this._pendingRequests[e.id],
                        Object.hasOwnProperty.call(e, "result"))
                      )
                        r(e.result);
                      else if (Object.hasOwnProperty.call(e, "error")) {
                        var i = new n.ServerError(e.error.message);
                        (i.code = e.error.code),
                          (i.data = e.error.data),
                          o(i),
                          this._console.warn("Server returned error:", e.error);
                      } else {
                        var c = new Error(
                          "Response without 'result' or 'error' received",
                        );
                        (c.data = { response: e }),
                          o(c),
                          this._console.warn(
                            "Response without 'result' or 'error' received. Message was:",
                            e,
                          );
                      }
                    } else
                      this._console.warn(
                        "Unexpected response received. Message was:",
                        e,
                      );
                  },
                },
                {
                  key: "_handleEvent",
                  value: function (e) {
                    var t = i({}, e);
                    delete t.event;
                    var n = "event:".concat(k(e.event));
                    this.emit("event", n, t), this.emit(n, t);
                  },
                },
                {
                  key: "_getApiSpec",
                  value: function () {
                    return this._send({ method: "core.describe" })
                      .then(this._createApi.bind(this))
                      .catch(this._handleWebSocketError.bind(this));
                  },
                },
                {
                  key: "_createApi",
                  value: function (e) {
                    var t = this;
                    Object.keys(e).forEach(function (n) {
                      var r,
                        o,
                        i,
                        c,
                        s =
                          ((r = n.split(".")).length >= 1 &&
                            "core" === r[0] &&
                            (r = r.slice(1)),
                          r),
                        a = k(s.slice(-1)[0]),
                        u =
                          ((o = s.slice(0, -1)),
                          (i = t),
                          o.forEach(function (e) {
                            var t = k(e);
                            (i[t] = i[t] || {}), (i = i[t]);
                          }),
                          i);
                      (u[a] =
                        ((c = n),
                        function () {
                          for (
                            var e = { method: c },
                              n = arguments.length,
                              r = new Array(n),
                              o = 0;
                            o < n;
                            o++
                          )
                            r[o] = arguments[o];
                          return 0 === r.length
                            ? t._send(e)
                            : r.length > 1
                            ? Promise.reject(
                                new Error(
                                  "Expected zero arguments, a single array, or a single object.",
                                ),
                              )
                            : Array.isArray(r[0]) || r[0] === Object(r[0])
                            ? ((e.params = r[0]), t._send(e))
                            : Promise.reject(
                                new TypeError(
                                  "Expected an array or an object.",
                                ),
                              );
                        })),
                        (u[a].description = e[n].description),
                        (u[a].params = e[n].params);
                    }),
                      this.emit("state", "state:online"),
                      this.emit("state:online");
                  },
                },
              ]),
              n
            );
          })(),
          g = (function (t) {
            l(r, e(Error));
            var n = p(r);
            function r(e) {
              var t;
              return (
                s(this, r), ((t = n.call(this, e)).name = "ConnectionError"), t
              );
            }
            return r;
          })();
        _.ConnectionError = g;
        var m = (function (t) {
          l(r, e(Error));
          var n = p(r);
          function r(e) {
            var t;
            return s(this, r), ((t = n.call(this, e)).name = "ServerError"), t;
          }
          return r;
        })();
        (_.ServerError = m),
          (_.WebSocket = w),
          (_.prototype._nextRequestId = (function () {
            var e = -1;
            return function () {
              return (e += 1);
            };
          })()),
          (module.exports = _);
      },
      { events: "FRpO", "isomorphic-ws": "lNMl" },
    ],
  },
  {},
  ["qsOc"],
  "Mopidy",
);
