var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/draco3d/draco_encoder_nodejs.js
var require_draco_encoder_nodejs = __commonJS({
  "node_modules/draco3d/draco_encoder_nodejs.js"(exports2, module2) {
    var $jscomp = $jscomp || {};
    $jscomp.scope = {};
    $jscomp.arrayIteratorImpl = function(l) {
      var p = 0;
      return function() {
        return p < l.length ? { done: false, value: l[p++] } : { done: true };
      };
    };
    $jscomp.arrayIterator = function(l) {
      return { next: $jscomp.arrayIteratorImpl(l) };
    };
    $jscomp.makeIterator = function(l) {
      var p = "undefined" != typeof Symbol && Symbol.iterator && l[Symbol.iterator];
      return p ? p.call(l) : $jscomp.arrayIterator(l);
    };
    $jscomp.ASSUME_ES5 = false;
    $jscomp.ASSUME_NO_NATIVE_MAP = false;
    $jscomp.ASSUME_NO_NATIVE_SET = false;
    $jscomp.SIMPLE_FROUND_POLYFILL = false;
    $jscomp.ISOLATE_POLYFILLS = false;
    $jscomp.FORCE_POLYFILL_PROMISE = false;
    $jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = false;
    $jscomp.getGlobal = function(l) {
      l = ["object" == typeof globalThis && globalThis, l, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
      for (var p = 0; p < l.length; ++p) {
        var m = l[p];
        if (m && m.Math == Math) return m;
      }
      throw Error("Cannot find global object");
    };
    $jscomp.global = $jscomp.getGlobal(exports2);
    $jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(l, p, m) {
      if (l == Array.prototype || l == Object.prototype) return l;
      l[p] = m.value;
      return l;
    };
    $jscomp.IS_SYMBOL_NATIVE = "function" === typeof Symbol && "symbol" === typeof /* @__PURE__ */ Symbol("x");
    $jscomp.TRUST_ES6_POLYFILLS = !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
    $jscomp.polyfills = {};
    $jscomp.propertyToPolyfillSymbol = {};
    $jscomp.POLYFILL_PREFIX = "$jscp$";
    $jscomp.polyfill = function(l, p, m, r) {
      p && ($jscomp.ISOLATE_POLYFILLS ? $jscomp.polyfillIsolated(l, p, m, r) : $jscomp.polyfillUnisolated(l, p, m, r));
    };
    $jscomp.polyfillUnisolated = function(l, p, m, r) {
      m = $jscomp.global;
      l = l.split(".");
      for (r = 0; r < l.length - 1; r++) {
        var k = l[r];
        if (!(k in m)) return;
        m = m[k];
      }
      l = l[l.length - 1];
      r = m[l];
      p = p(r);
      p != r && null != p && $jscomp.defineProperty(m, l, { configurable: true, writable: true, value: p });
    };
    $jscomp.polyfillIsolated = function(l, p, m, r) {
      var k = l.split(".");
      l = 1 === k.length;
      r = k[0];
      r = !l && r in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
      for (var C = 0; C < k.length - 1; C++) {
        var h = k[C];
        if (!(h in r)) return;
        r = r[h];
      }
      k = k[k.length - 1];
      m = $jscomp.IS_SYMBOL_NATIVE && "es6" === m ? r[k] : null;
      p = p(m);
      null != p && (l ? $jscomp.defineProperty($jscomp.polyfills, k, { configurable: true, writable: true, value: p }) : p !== m && (void 0 === $jscomp.propertyToPolyfillSymbol[k] && (m = 1e9 * Math.random() >>> 0, $jscomp.propertyToPolyfillSymbol[k] = $jscomp.IS_SYMBOL_NATIVE ? $jscomp.global.Symbol(k) : $jscomp.POLYFILL_PREFIX + m + "$" + k), $jscomp.defineProperty(r, $jscomp.propertyToPolyfillSymbol[k], { configurable: true, writable: true, value: p })));
    };
    $jscomp.polyfill("Promise", function(l) {
      function p() {
        this.batch_ = null;
      }
      function m(h) {
        return h instanceof k ? h : new k(function(q, w) {
          q(h);
        });
      }
      if (l && (!($jscomp.FORCE_POLYFILL_PROMISE || $jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION && "undefined" === typeof $jscomp.global.PromiseRejectionEvent) || !$jscomp.global.Promise || -1 === $jscomp.global.Promise.toString().indexOf("[native code]"))) return l;
      p.prototype.asyncExecute = function(h) {
        if (null == this.batch_) {
          this.batch_ = [];
          var q = this;
          this.asyncExecuteFunction(function() {
            q.executeBatch_();
          });
        }
        this.batch_.push(h);
      };
      var r = $jscomp.global.setTimeout;
      p.prototype.asyncExecuteFunction = function(h) {
        r(h, 0);
      };
      p.prototype.executeBatch_ = function() {
        for (; this.batch_ && this.batch_.length; ) {
          var h = this.batch_;
          this.batch_ = [];
          for (var q = 0; q < h.length; ++q) {
            var w = h[q];
            h[q] = null;
            try {
              w();
            } catch (B) {
              this.asyncThrow_(B);
            }
          }
        }
        this.batch_ = null;
      };
      p.prototype.asyncThrow_ = function(h) {
        this.asyncExecuteFunction(function() {
          throw h;
        });
      };
      var k = function(h) {
        this.state_ = 0;
        this.result_ = void 0;
        this.onSettledCallbacks_ = [];
        this.isRejectionHandled_ = false;
        var q = this.createResolveAndReject_();
        try {
          h(q.resolve, q.reject);
        } catch (w) {
          q.reject(w);
        }
      };
      k.prototype.createResolveAndReject_ = function() {
        function h(B) {
          return function(v) {
            w || (w = true, B.call(q, v));
          };
        }
        var q = this, w = false;
        return { resolve: h(this.resolveTo_), reject: h(this.reject_) };
      };
      k.prototype.resolveTo_ = function(h) {
        if (h === this) this.reject_(new TypeError("A Promise cannot resolve to itself"));
        else if (h instanceof k) this.settleSameAsPromise_(h);
        else {
          a: switch (typeof h) {
            case "object":
              var q = null != h;
              break a;
            case "function":
              q = true;
              break a;
            default:
              q = false;
          }
          q ? this.resolveToNonPromiseObj_(h) : this.fulfill_(h);
        }
      };
      k.prototype.resolveToNonPromiseObj_ = function(h) {
        var q = void 0;
        try {
          q = h.then;
        } catch (w) {
          this.reject_(w);
          return;
        }
        "function" == typeof q ? this.settleSameAsThenable_(q, h) : this.fulfill_(h);
      };
      k.prototype.reject_ = function(h) {
        this.settle_(2, h);
      };
      k.prototype.fulfill_ = function(h) {
        this.settle_(1, h);
      };
      k.prototype.settle_ = function(h, q) {
        if (0 != this.state_) throw Error("Cannot settle(" + h + ", " + q + "): Promise already settled in state" + this.state_);
        this.state_ = h;
        this.result_ = q;
        2 === this.state_ && this.scheduleUnhandledRejectionCheck_();
        this.executeOnSettledCallbacks_();
      };
      k.prototype.scheduleUnhandledRejectionCheck_ = function() {
        var h = this;
        r(function() {
          if (h.notifyUnhandledRejection_()) {
            var q = $jscomp.global.console;
            "undefined" !== typeof q && q.error(h.result_);
          }
        }, 1);
      };
      k.prototype.notifyUnhandledRejection_ = function() {
        if (this.isRejectionHandled_) return false;
        var h = $jscomp.global.CustomEvent, q = $jscomp.global.Event, w = $jscomp.global.dispatchEvent;
        if ("undefined" === typeof w) return true;
        "function" === typeof h ? h = new h("unhandledrejection", { cancelable: true }) : "function" === typeof q ? h = new q("unhandledrejection", { cancelable: true }) : (h = $jscomp.global.document.createEvent("CustomEvent"), h.initCustomEvent("unhandledrejection", false, true, h));
        h.promise = this;
        h.reason = this.result_;
        return w(h);
      };
      k.prototype.executeOnSettledCallbacks_ = function() {
        if (null != this.onSettledCallbacks_) {
          for (var h = 0; h < this.onSettledCallbacks_.length; ++h) C.asyncExecute(this.onSettledCallbacks_[h]);
          this.onSettledCallbacks_ = null;
        }
      };
      var C = new p();
      k.prototype.settleSameAsPromise_ = function(h) {
        var q = this.createResolveAndReject_();
        h.callWhenSettled_(q.resolve, q.reject);
      };
      k.prototype.settleSameAsThenable_ = function(h, q) {
        var w = this.createResolveAndReject_();
        try {
          h.call(q, w.resolve, w.reject);
        } catch (B) {
          w.reject(B);
        }
      };
      k.prototype.then = function(h, q) {
        function w(I, J) {
          return "function" == typeof I ? function(Q) {
            try {
              B(I(Q));
            } catch (R) {
              v(R);
            }
          } : J;
        }
        var B, v, D = new k(function(I, J) {
          B = I;
          v = J;
        });
        this.callWhenSettled_(w(h, B), w(q, v));
        return D;
      };
      k.prototype.catch = function(h) {
        return this.then(void 0, h);
      };
      k.prototype.callWhenSettled_ = function(h, q) {
        function w() {
          switch (B.state_) {
            case 1:
              h(B.result_);
              break;
            case 2:
              q(B.result_);
              break;
            default:
              throw Error("Unexpected state: " + B.state_);
          }
        }
        var B = this;
        null == this.onSettledCallbacks_ ? C.asyncExecute(w) : this.onSettledCallbacks_.push(w);
        this.isRejectionHandled_ = true;
      };
      k.resolve = m;
      k.reject = function(h) {
        return new k(function(q, w) {
          w(h);
        });
      };
      k.race = function(h) {
        return new k(function(q, w) {
          for (var B = $jscomp.makeIterator(h), v = B.next(); !v.done; v = B.next()) m(v.value).callWhenSettled_(q, w);
        });
      };
      k.all = function(h) {
        var q = $jscomp.makeIterator(h), w = q.next();
        return w.done ? m([]) : new k(function(B, v) {
          function D(Q) {
            return function(R) {
              I[Q] = R;
              J--;
              0 == J && B(I);
            };
          }
          var I = [], J = 0;
          do
            I.push(void 0), J++, m(w.value).callWhenSettled_(D(I.length - 1), v), w = q.next();
          while (!w.done);
        });
      };
      return k;
    }, "es6", "es3");
    $jscomp.owns = function(l, p) {
      return Object.prototype.hasOwnProperty.call(l, p);
    };
    $jscomp.assign = $jscomp.TRUST_ES6_POLYFILLS && "function" == typeof Object.assign ? Object.assign : function(l, p) {
      for (var m = 1; m < arguments.length; m++) {
        var r = arguments[m];
        if (r) for (var k in r) $jscomp.owns(r, k) && (l[k] = r[k]);
      }
      return l;
    };
    $jscomp.polyfill("Object.assign", function(l) {
      return l || $jscomp.assign;
    }, "es6", "es3");
    $jscomp.checkStringArgs = function(l, p, m) {
      if (null == l) throw new TypeError("The 'this' value for String.prototype." + m + " must not be null or undefined");
      if (p instanceof RegExp) throw new TypeError("First argument to String.prototype." + m + " must not be a regular expression");
      return l + "";
    };
    $jscomp.polyfill("String.prototype.startsWith", function(l) {
      return l ? l : function(p, m) {
        var r = $jscomp.checkStringArgs(this, p, "startsWith");
        p += "";
        var k = r.length, C = p.length;
        m = Math.max(0, Math.min(m | 0, r.length));
        for (var h = 0; h < C && m < k; ) if (r[m++] != p[h++]) return false;
        return h >= C;
      };
    }, "es6", "es3");
    $jscomp.polyfill("Array.prototype.copyWithin", function(l) {
      function p(m) {
        m = Number(m);
        return Infinity === m || -Infinity === m ? m : m | 0;
      }
      return l ? l : function(m, r, k) {
        var C = this.length;
        m = p(m);
        r = p(r);
        k = void 0 === k ? C : p(k);
        m = 0 > m ? Math.max(C + m, 0) : Math.min(m, C);
        r = 0 > r ? Math.max(C + r, 0) : Math.min(r, C);
        k = 0 > k ? Math.max(C + k, 0) : Math.min(k, C);
        if (m < r) for (; r < k; ) r in this ? this[m++] = this[r++] : (delete this[m++], r++);
        else for (k = Math.min(k, C + r - m), m += k - r; k > r; ) --k in this ? this[--m] = this[k] : delete this[--m];
        return this;
      };
    }, "es6", "es3");
    $jscomp.typedArrayCopyWithin = function(l) {
      return l ? l : Array.prototype.copyWithin;
    };
    $jscomp.polyfill("Int8Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Uint8Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Uint8ClampedArray.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Int16Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Uint16Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Int32Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Uint32Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Float32Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Float64Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    var DracoEncoderModule = (function() {
      var l = "undefined" !== typeof document && document.currentScript ? document.currentScript.src : void 0;
      "undefined" !== typeof __filename && (l = l || __filename);
      return function(p) {
        function m(f) {
          return a.locateFile ? a.locateFile(f, L) : L + f;
        }
        function r() {
          var f = ba.buffer;
          a.HEAP8 = O = new Int8Array(f);
          a.HEAP16 = ea = new Int16Array(f);
          a.HEAP32 = S = new Int32Array(f);
          a.HEAPU8 = fa = new Uint8Array(f);
          a.HEAPU16 = new Uint16Array(f);
          a.HEAPU32 = T = new Uint32Array(f);
          a.HEAPF32 = ha = new Float32Array(f);
          a.HEAPF64 = new Float64Array(f);
        }
        function k(f) {
          if (a.onAbort) a.onAbort(f);
          f = "Aborted(" + f + ")";
          W(f);
          na = true;
          f = new WebAssembly.RuntimeError(f + ". Build with -sASSERTIONS for more info.");
          ca(f);
          throw f;
        }
        function C(f) {
          try {
            if (f == K && X) return new Uint8Array(X);
            if (ia) return ia(f);
            throw "both async and sync fetching of the wasm failed";
          } catch (b) {
            k(b);
          }
        }
        function h() {
          if (!X && (oa || Y)) {
            if ("function" == typeof fetch && !K.startsWith("file://")) return fetch(K, { credentials: "same-origin" }).then(function(f) {
              if (!f.ok) throw "failed to load wasm binary file at '" + K + "'";
              return f.arrayBuffer();
            }).catch(function() {
              return C(K);
            });
            if (ja) return new Promise(function(f, b) {
              ja(K, function(c) {
                f(new Uint8Array(c));
              }, b);
            });
          }
          return Promise.resolve().then(function() {
            return C(K);
          });
        }
        function q(f) {
          for (; 0 < f.length; ) f.shift()(a);
        }
        function w(f) {
          this.excPtr = f;
          this.ptr = f - 24;
          this.set_type = function(b) {
            T[this.ptr + 4 >> 2] = b;
          };
          this.get_type = function() {
            return T[this.ptr + 4 >> 2];
          };
          this.set_destructor = function(b) {
            T[this.ptr + 8 >> 2] = b;
          };
          this.get_destructor = function() {
            return T[this.ptr + 8 >> 2];
          };
          this.set_refcount = function(b) {
            S[this.ptr >> 2] = b;
          };
          this.set_caught = function(b) {
            O[this.ptr + 12 >> 0] = b ? 1 : 0;
          };
          this.get_caught = function() {
            return 0 != O[this.ptr + 12 >> 0];
          };
          this.set_rethrown = function(b) {
            O[this.ptr + 13 >> 0] = b ? 1 : 0;
          };
          this.get_rethrown = function() {
            return 0 != O[this.ptr + 13 >> 0];
          };
          this.init = function(b, c) {
            this.set_adjusted_ptr(0);
            this.set_type(b);
            this.set_destructor(c);
            this.set_refcount(0);
            this.set_caught(false);
            this.set_rethrown(false);
          };
          this.add_ref = function() {
            S[this.ptr >> 2] += 1;
          };
          this.release_ref = function() {
            var b = S[this.ptr >> 2];
            S[this.ptr >> 2] = b - 1;
            return 1 === b;
          };
          this.set_adjusted_ptr = function(b) {
            T[this.ptr + 16 >> 2] = b;
          };
          this.get_adjusted_ptr = function() {
            return T[this.ptr + 16 >> 2];
          };
          this.get_exception_ptr = function() {
            if (pa(this.get_type())) return T[this.excPtr >> 2];
            var b = this.get_adjusted_ptr();
            return 0 !== b ? b : this.excPtr;
          };
        }
        function B() {
          function f() {
            if (!da && (da = true, a.calledRun = true, !na)) {
              qa = true;
              q(ka);
              ra(a);
              if (a.onRuntimeInitialized) a.onRuntimeInitialized();
              if (a.postRun) for ("function" == typeof a.postRun && (a.postRun = [a.postRun]); a.postRun.length; ) sa.unshift(a.postRun.shift());
              q(sa);
            }
          }
          if (!(0 < U)) {
            if (a.preRun) for ("function" == typeof a.preRun && (a.preRun = [a.preRun]); a.preRun.length; ) ta.unshift(a.preRun.shift());
            q(ta);
            0 < U || (a.setStatus ? (a.setStatus("Running..."), setTimeout(function() {
              setTimeout(function() {
                a.setStatus("");
              }, 1);
              f();
            }, 1)) : f());
          }
        }
        function v() {
        }
        function D(f) {
          return (f || v).__cache__;
        }
        function I(f, b) {
          var c = D(b), d = c[f];
          if (d) return d;
          d = Object.create((b || v).prototype);
          d.ptr = f;
          return c[f] = d;
        }
        function J(f) {
          if ("string" === typeof f) {
            for (var b = 0, c = 0; c < f.length; ++c) {
              var d = f.charCodeAt(c);
              127 >= d ? b++ : 2047 >= d ? b += 2 : 55296 <= d && 57343 >= d ? (b += 4, ++c) : b += 3;
            }
            b = Array(b + 1);
            c = 0;
            d = b.length;
            if (0 < d) {
              d = c + d - 1;
              for (var e = 0; e < f.length; ++e) {
                var g = f.charCodeAt(e);
                if (55296 <= g && 57343 >= g) {
                  var t = f.charCodeAt(++e);
                  g = 65536 + ((g & 1023) << 10) | t & 1023;
                }
                if (127 >= g) {
                  if (c >= d) break;
                  b[c++] = g;
                } else {
                  if (2047 >= g) {
                    if (c + 1 >= d) break;
                    b[c++] = 192 | g >> 6;
                  } else {
                    if (65535 >= g) {
                      if (c + 2 >= d) break;
                      b[c++] = 224 | g >> 12;
                    } else {
                      if (c + 3 >= d) break;
                      b[c++] = 240 | g >> 18;
                      b[c++] = 128 | g >> 12 & 63;
                    }
                    b[c++] = 128 | g >> 6 & 63;
                  }
                  b[c++] = 128 | g & 63;
                }
              }
              b[c] = 0;
            }
            f = n.alloc(b, O);
            n.copy(b, O, f);
            return f;
          }
          return f;
        }
        function Q(f) {
          if ("object" === typeof f) {
            var b = n.alloc(f, O);
            n.copy(f, O, b);
            return b;
          }
          return f;
        }
        function R(f) {
          if ("object" === typeof f) {
            var b = n.alloc(f, ea);
            n.copy(f, ea, b);
            return b;
          }
          return f;
        }
        function V(f) {
          if ("object" === typeof f) {
            var b = n.alloc(f, S);
            n.copy(f, S, b);
            return b;
          }
          return f;
        }
        function Z(f) {
          if ("object" === typeof f) {
            var b = n.alloc(f, ha);
            n.copy(f, ha, b);
            return b;
          }
          return f;
        }
        function P() {
          throw "cannot construct a VoidPtr, no constructor in IDL";
        }
        function M() {
          this.ptr = ua();
          D(M)[this.ptr] = this;
        }
        function z() {
          this.ptr = va();
          D(z)[this.ptr] = this;
        }
        function G() {
          this.ptr = wa();
          D(G)[this.ptr] = this;
        }
        function E() {
          this.ptr = xa();
          D(E)[this.ptr] = this;
        }
        function N() {
          this.ptr = ya();
          D(N)[this.ptr] = this;
        }
        function H() {
          this.ptr = za();
          D(H)[this.ptr] = this;
        }
        function F() {
          this.ptr = Aa();
          D(F)[this.ptr] = this;
        }
        function x() {
          this.ptr = Ba();
          D(x)[this.ptr] = this;
        }
        function u() {
          this.ptr = Ca();
          D(u)[this.ptr] = this;
        }
        function y() {
          this.ptr = Da();
          D(y)[this.ptr] = this;
        }
        function A(f) {
          f && "object" === typeof f && (f = f.ptr);
          this.ptr = Ea(f);
          D(A)[this.ptr] = this;
        }
        p = void 0 === p ? {} : p;
        var a = "undefined" != typeof p ? p : {}, ra, ca;
        a.ready = new Promise(function(f, b) {
          ra = f;
          ca = b;
        });
        var Fa = false, Ga = false;
        a.onRuntimeInitialized = function() {
          Fa = true;
          if (Ga && "function" === typeof a.onModuleLoaded) a.onModuleLoaded(a);
        };
        a.onModuleParsed = function() {
          Ga = true;
          if (Fa && "function" === typeof a.onModuleLoaded) a.onModuleLoaded(a);
        };
        a.isVersionSupported = function(f) {
          if ("string" !== typeof f) return false;
          f = f.split(".");
          return 2 > f.length || 3 < f.length ? false : 1 == f[0] && 0 <= f[1] && 5 >= f[1] ? true : 0 != f[0] || 10 < f[1] ? false : true;
        };
        var Ha = Object.assign({}, a), oa = "object" == typeof window, Y = "function" == typeof importScripts, Ia = "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node, L = "";
        if (Ia) {
          var Ja = require("fs"), la = require("path");
          L = Y ? la.dirname(L) + "/" : __dirname + "/";
          var Ka = function(f, b) {
            f = f.startsWith("file://") ? new URL(f) : la.normalize(f);
            return Ja.readFileSync(f, b ? void 0 : "utf8");
          };
          var ia = function(f) {
            f = Ka(f, true);
            f.buffer || (f = new Uint8Array(f));
            return f;
          };
          var ja = function(f, b, c) {
            f = f.startsWith("file://") ? new URL(f) : la.normalize(f);
            Ja.readFile(f, function(d, e) {
              d ? c(d) : b(e.buffer);
            });
          };
          1 < process.argv.length && process.argv[1].replace(/\\/g, "/");
          process.argv.slice(2);
          a.inspect = function() {
            return "[Emscripten Module object]";
          };
        } else if (oa || Y) Y ? L = self.location.href : "undefined" != typeof document && document.currentScript && (L = document.currentScript.src), l && (L = l), L = 0 !== L.indexOf("blob:") ? L.substr(0, L.replace(/[?#].*/, "").lastIndexOf("/") + 1) : "", Ka = function(f) {
          var b = new XMLHttpRequest();
          b.open("GET", f, false);
          b.send(null);
          return b.responseText;
        }, Y && (ia = function(f) {
          var b = new XMLHttpRequest();
          b.open("GET", f, false);
          b.responseType = "arraybuffer";
          b.send(null);
          return new Uint8Array(b.response);
        }), ja = function(f, b, c) {
          var d = new XMLHttpRequest();
          d.open("GET", f, true);
          d.responseType = "arraybuffer";
          d.onload = function() {
            200 == d.status || 0 == d.status && d.response ? b(d.response) : c();
          };
          d.onerror = c;
          d.send(null);
        };
        a.print || console.log.bind(console);
        var W = a.printErr || console.warn.bind(console);
        Object.assign(a, Ha);
        Ha = null;
        var X;
        a.wasmBinary && (X = a.wasmBinary);
        "object" != typeof WebAssembly && k("no native wasm support detected");
        var ba, na = false, O, fa, ea, S, T, ha, ta = [], ka = [], sa = [], qa = false, U = 0, ma = null, aa = null;
        var K = "draco_encoder.wasm";
        K.startsWith("data:application/octet-stream;base64,") || (K = m(K));
        var pc = 0, qc = { b: function(f, b, c) {
          new w(f).init(b, c);
          pc++;
          throw f;
        }, a: function() {
          k("");
        }, d: function(f, b, c) {
          fa.copyWithin(f, b, b + c);
        }, c: function(f) {
          var b = fa.length;
          f >>>= 0;
          if (2147483648 < f) return false;
          for (var c = 1; 4 >= c; c *= 2) {
            var d = b * (1 + 0.2 / c);
            d = Math.min(d, f + 100663296);
            var e = Math;
            d = Math.max(f, d);
            e = e.min.call(
              e,
              2147483648,
              d + (65536 - d % 65536) % 65536
            );
            a: {
              d = ba.buffer;
              try {
                ba.grow(e - d.byteLength + 65535 >>> 16);
                r();
                var g = 1;
                break a;
              } catch (t) {
              }
              g = void 0;
            }
            if (g) return true;
          }
          return false;
        } };
        (function() {
          function f(e, g) {
            a.asm = e.exports;
            ba = a.asm.e;
            r();
            ka.unshift(a.asm.f);
            U--;
            a.monitorRunDependencies && a.monitorRunDependencies(U);
            0 == U && (null !== ma && (clearInterval(ma), ma = null), aa && (e = aa, aa = null, e()));
          }
          function b(e) {
            f(e.instance);
          }
          function c(e) {
            return h().then(function(g) {
              return WebAssembly.instantiate(g, d);
            }).then(function(g) {
              return g;
            }).then(e, function(g) {
              W("failed to asynchronously prepare wasm: " + g);
              k(g);
            });
          }
          var d = { a: qc };
          U++;
          a.monitorRunDependencies && a.monitorRunDependencies(U);
          if (a.instantiateWasm) try {
            return a.instantiateWasm(d, f);
          } catch (e) {
            W("Module.instantiateWasm callback failed with error: " + e), ca(e);
          }
          (function() {
            return X || "function" != typeof WebAssembly.instantiateStreaming || K.startsWith("data:application/octet-stream;base64,") || K.startsWith("file://") || Ia || "function" != typeof fetch ? c(b) : fetch(K, { credentials: "same-origin" }).then(function(e) {
              return WebAssembly.instantiateStreaming(e, d).then(
                b,
                function(g) {
                  W("wasm streaming compile failed: " + g);
                  W("falling back to ArrayBuffer instantiation");
                  return c(b);
                }
              );
            });
          })().catch(ca);
          return {};
        })();
        var La = a._emscripten_bind_VoidPtr___destroy___0 = function() {
          return (La = a._emscripten_bind_VoidPtr___destroy___0 = a.asm.h).apply(null, arguments);
        }, ua = a._emscripten_bind_GeometryAttribute_GeometryAttribute_0 = function() {
          return (ua = a._emscripten_bind_GeometryAttribute_GeometryAttribute_0 = a.asm.i).apply(null, arguments);
        }, Ma = a._emscripten_bind_GeometryAttribute___destroy___0 = function() {
          return (Ma = a._emscripten_bind_GeometryAttribute___destroy___0 = a.asm.j).apply(null, arguments);
        }, va = a._emscripten_bind_PointAttribute_PointAttribute_0 = function() {
          return (va = a._emscripten_bind_PointAttribute_PointAttribute_0 = a.asm.k).apply(null, arguments);
        }, Na = a._emscripten_bind_PointAttribute_size_0 = function() {
          return (Na = a._emscripten_bind_PointAttribute_size_0 = a.asm.l).apply(null, arguments);
        }, Oa = a._emscripten_bind_PointAttribute_attribute_type_0 = function() {
          return (Oa = a._emscripten_bind_PointAttribute_attribute_type_0 = a.asm.m).apply(null, arguments);
        }, Pa = a._emscripten_bind_PointAttribute_data_type_0 = function() {
          return (Pa = a._emscripten_bind_PointAttribute_data_type_0 = a.asm.n).apply(null, arguments);
        }, Qa = a._emscripten_bind_PointAttribute_num_components_0 = function() {
          return (Qa = a._emscripten_bind_PointAttribute_num_components_0 = a.asm.o).apply(null, arguments);
        }, Ra = a._emscripten_bind_PointAttribute_normalized_0 = function() {
          return (Ra = a._emscripten_bind_PointAttribute_normalized_0 = a.asm.p).apply(null, arguments);
        }, Sa = a._emscripten_bind_PointAttribute_byte_stride_0 = function() {
          return (Sa = a._emscripten_bind_PointAttribute_byte_stride_0 = a.asm.q).apply(null, arguments);
        }, Ta = a._emscripten_bind_PointAttribute_byte_offset_0 = function() {
          return (Ta = a._emscripten_bind_PointAttribute_byte_offset_0 = a.asm.r).apply(null, arguments);
        }, Ua = a._emscripten_bind_PointAttribute_unique_id_0 = function() {
          return (Ua = a._emscripten_bind_PointAttribute_unique_id_0 = a.asm.s).apply(null, arguments);
        }, Va = a._emscripten_bind_PointAttribute___destroy___0 = function() {
          return (Va = a._emscripten_bind_PointAttribute___destroy___0 = a.asm.t).apply(null, arguments);
        }, wa = a._emscripten_bind_PointCloud_PointCloud_0 = function() {
          return (wa = a._emscripten_bind_PointCloud_PointCloud_0 = a.asm.u).apply(null, arguments);
        }, Wa = a._emscripten_bind_PointCloud_num_attributes_0 = function() {
          return (Wa = a._emscripten_bind_PointCloud_num_attributes_0 = a.asm.v).apply(null, arguments);
        }, Xa = a._emscripten_bind_PointCloud_num_points_0 = function() {
          return (Xa = a._emscripten_bind_PointCloud_num_points_0 = a.asm.w).apply(null, arguments);
        }, Ya = a._emscripten_bind_PointCloud___destroy___0 = function() {
          return (Ya = a._emscripten_bind_PointCloud___destroy___0 = a.asm.x).apply(null, arguments);
        }, xa = a._emscripten_bind_Mesh_Mesh_0 = function() {
          return (xa = a._emscripten_bind_Mesh_Mesh_0 = a.asm.y).apply(null, arguments);
        }, Za = a._emscripten_bind_Mesh_num_faces_0 = function() {
          return (Za = a._emscripten_bind_Mesh_num_faces_0 = a.asm.z).apply(null, arguments);
        }, $a = a._emscripten_bind_Mesh_num_attributes_0 = function() {
          return ($a = a._emscripten_bind_Mesh_num_attributes_0 = a.asm.A).apply(null, arguments);
        }, ab = a._emscripten_bind_Mesh_num_points_0 = function() {
          return (ab = a._emscripten_bind_Mesh_num_points_0 = a.asm.B).apply(null, arguments);
        }, bb = a._emscripten_bind_Mesh_set_num_points_1 = function() {
          return (bb = a._emscripten_bind_Mesh_set_num_points_1 = a.asm.C).apply(null, arguments);
        }, cb = a._emscripten_bind_Mesh___destroy___0 = function() {
          return (cb = a._emscripten_bind_Mesh___destroy___0 = a.asm.D).apply(null, arguments);
        }, ya = a._emscripten_bind_Metadata_Metadata_0 = function() {
          return (ya = a._emscripten_bind_Metadata_Metadata_0 = a.asm.E).apply(null, arguments);
        }, db = a._emscripten_bind_Metadata___destroy___0 = function() {
          return (db = a._emscripten_bind_Metadata___destroy___0 = a.asm.F).apply(null, arguments);
        }, za = a._emscripten_bind_DracoInt8Array_DracoInt8Array_0 = function() {
          return (za = a._emscripten_bind_DracoInt8Array_DracoInt8Array_0 = a.asm.G).apply(null, arguments);
        }, eb = a._emscripten_bind_DracoInt8Array_GetValue_1 = function() {
          return (eb = a._emscripten_bind_DracoInt8Array_GetValue_1 = a.asm.H).apply(null, arguments);
        }, fb = a._emscripten_bind_DracoInt8Array_size_0 = function() {
          return (fb = a._emscripten_bind_DracoInt8Array_size_0 = a.asm.I).apply(null, arguments);
        }, gb = a._emscripten_bind_DracoInt8Array___destroy___0 = function() {
          return (gb = a._emscripten_bind_DracoInt8Array___destroy___0 = a.asm.J).apply(null, arguments);
        }, Aa = a._emscripten_bind_MetadataBuilder_MetadataBuilder_0 = function() {
          return (Aa = a._emscripten_bind_MetadataBuilder_MetadataBuilder_0 = a.asm.K).apply(null, arguments);
        }, hb = a._emscripten_bind_MetadataBuilder_AddStringEntry_3 = function() {
          return (hb = a._emscripten_bind_MetadataBuilder_AddStringEntry_3 = a.asm.L).apply(null, arguments);
        }, ib = a._emscripten_bind_MetadataBuilder_AddIntEntry_3 = function() {
          return (ib = a._emscripten_bind_MetadataBuilder_AddIntEntry_3 = a.asm.M).apply(null, arguments);
        }, jb = a._emscripten_bind_MetadataBuilder_AddIntEntryArray_4 = function() {
          return (jb = a._emscripten_bind_MetadataBuilder_AddIntEntryArray_4 = a.asm.N).apply(null, arguments);
        }, kb = a._emscripten_bind_MetadataBuilder_AddDoubleEntry_3 = function() {
          return (kb = a._emscripten_bind_MetadataBuilder_AddDoubleEntry_3 = a.asm.O).apply(null, arguments);
        }, lb = a._emscripten_bind_MetadataBuilder___destroy___0 = function() {
          return (lb = a._emscripten_bind_MetadataBuilder___destroy___0 = a.asm.P).apply(null, arguments);
        }, Ba = a._emscripten_bind_PointCloudBuilder_PointCloudBuilder_0 = function() {
          return (Ba = a._emscripten_bind_PointCloudBuilder_PointCloudBuilder_0 = a.asm.Q).apply(null, arguments);
        }, mb = a._emscripten_bind_PointCloudBuilder_AddFloatAttribute_5 = function() {
          return (mb = a._emscripten_bind_PointCloudBuilder_AddFloatAttribute_5 = a.asm.R).apply(null, arguments);
        }, nb = a._emscripten_bind_PointCloudBuilder_AddInt8Attribute_5 = function() {
          return (nb = a._emscripten_bind_PointCloudBuilder_AddInt8Attribute_5 = a.asm.S).apply(null, arguments);
        }, ob = a._emscripten_bind_PointCloudBuilder_AddUInt8Attribute_5 = function() {
          return (ob = a._emscripten_bind_PointCloudBuilder_AddUInt8Attribute_5 = a.asm.T).apply(null, arguments);
        }, pb = a._emscripten_bind_PointCloudBuilder_AddInt16Attribute_5 = function() {
          return (pb = a._emscripten_bind_PointCloudBuilder_AddInt16Attribute_5 = a.asm.U).apply(null, arguments);
        }, qb = a._emscripten_bind_PointCloudBuilder_AddUInt16Attribute_5 = function() {
          return (qb = a._emscripten_bind_PointCloudBuilder_AddUInt16Attribute_5 = a.asm.V).apply(null, arguments);
        }, rb = a._emscripten_bind_PointCloudBuilder_AddInt32Attribute_5 = function() {
          return (rb = a._emscripten_bind_PointCloudBuilder_AddInt32Attribute_5 = a.asm.W).apply(null, arguments);
        }, sb = a._emscripten_bind_PointCloudBuilder_AddUInt32Attribute_5 = function() {
          return (sb = a._emscripten_bind_PointCloudBuilder_AddUInt32Attribute_5 = a.asm.X).apply(null, arguments);
        }, tb = a._emscripten_bind_PointCloudBuilder_AddMetadata_2 = function() {
          return (tb = a._emscripten_bind_PointCloudBuilder_AddMetadata_2 = a.asm.Y).apply(null, arguments);
        }, ub = a._emscripten_bind_PointCloudBuilder_SetMetadataForAttribute_3 = function() {
          return (ub = a._emscripten_bind_PointCloudBuilder_SetMetadataForAttribute_3 = a.asm.Z).apply(null, arguments);
        }, vb = a._emscripten_bind_PointCloudBuilder_SetNormalizedFlagForAttribute_3 = function() {
          return (vb = a._emscripten_bind_PointCloudBuilder_SetNormalizedFlagForAttribute_3 = a.asm._).apply(null, arguments);
        }, wb = a._emscripten_bind_PointCloudBuilder___destroy___0 = function() {
          return (wb = a._emscripten_bind_PointCloudBuilder___destroy___0 = a.asm.$).apply(null, arguments);
        }, Ca = a._emscripten_bind_MeshBuilder_MeshBuilder_0 = function() {
          return (Ca = a._emscripten_bind_MeshBuilder_MeshBuilder_0 = a.asm.aa).apply(null, arguments);
        }, xb = a._emscripten_bind_MeshBuilder_AddFacesToMesh_3 = function() {
          return (xb = a._emscripten_bind_MeshBuilder_AddFacesToMesh_3 = a.asm.ba).apply(null, arguments);
        }, yb = a._emscripten_bind_MeshBuilder_AddFloatAttributeToMesh_5 = function() {
          return (yb = a._emscripten_bind_MeshBuilder_AddFloatAttributeToMesh_5 = a.asm.ca).apply(null, arguments);
        }, zb = a._emscripten_bind_MeshBuilder_AddInt32AttributeToMesh_5 = function() {
          return (zb = a._emscripten_bind_MeshBuilder_AddInt32AttributeToMesh_5 = a.asm.da).apply(null, arguments);
        }, Ab = a._emscripten_bind_MeshBuilder_AddMetadataToMesh_2 = function() {
          return (Ab = a._emscripten_bind_MeshBuilder_AddMetadataToMesh_2 = a.asm.ea).apply(null, arguments);
        }, Bb = a._emscripten_bind_MeshBuilder_AddFloatAttribute_5 = function() {
          return (Bb = a._emscripten_bind_MeshBuilder_AddFloatAttribute_5 = a.asm.fa).apply(
            null,
            arguments
          );
        }, Cb = a._emscripten_bind_MeshBuilder_AddInt8Attribute_5 = function() {
          return (Cb = a._emscripten_bind_MeshBuilder_AddInt8Attribute_5 = a.asm.ga).apply(null, arguments);
        }, Db = a._emscripten_bind_MeshBuilder_AddUInt8Attribute_5 = function() {
          return (Db = a._emscripten_bind_MeshBuilder_AddUInt8Attribute_5 = a.asm.ha).apply(null, arguments);
        }, Eb = a._emscripten_bind_MeshBuilder_AddInt16Attribute_5 = function() {
          return (Eb = a._emscripten_bind_MeshBuilder_AddInt16Attribute_5 = a.asm.ia).apply(null, arguments);
        }, Fb = a._emscripten_bind_MeshBuilder_AddUInt16Attribute_5 = function() {
          return (Fb = a._emscripten_bind_MeshBuilder_AddUInt16Attribute_5 = a.asm.ja).apply(null, arguments);
        }, Gb = a._emscripten_bind_MeshBuilder_AddInt32Attribute_5 = function() {
          return (Gb = a._emscripten_bind_MeshBuilder_AddInt32Attribute_5 = a.asm.ka).apply(null, arguments);
        }, Hb = a._emscripten_bind_MeshBuilder_AddUInt32Attribute_5 = function() {
          return (Hb = a._emscripten_bind_MeshBuilder_AddUInt32Attribute_5 = a.asm.la).apply(null, arguments);
        }, Ib = a._emscripten_bind_MeshBuilder_AddMetadata_2 = function() {
          return (Ib = a._emscripten_bind_MeshBuilder_AddMetadata_2 = a.asm.ma).apply(null, arguments);
        }, Jb = a._emscripten_bind_MeshBuilder_SetMetadataForAttribute_3 = function() {
          return (Jb = a._emscripten_bind_MeshBuilder_SetMetadataForAttribute_3 = a.asm.na).apply(null, arguments);
        }, Kb = a._emscripten_bind_MeshBuilder_SetNormalizedFlagForAttribute_3 = function() {
          return (Kb = a._emscripten_bind_MeshBuilder_SetNormalizedFlagForAttribute_3 = a.asm.oa).apply(null, arguments);
        }, Lb = a._emscripten_bind_MeshBuilder___destroy___0 = function() {
          return (Lb = a._emscripten_bind_MeshBuilder___destroy___0 = a.asm.pa).apply(null, arguments);
        }, Da = a._emscripten_bind_Encoder_Encoder_0 = function() {
          return (Da = a._emscripten_bind_Encoder_Encoder_0 = a.asm.qa).apply(null, arguments);
        }, Mb = a._emscripten_bind_Encoder_SetEncodingMethod_1 = function() {
          return (Mb = a._emscripten_bind_Encoder_SetEncodingMethod_1 = a.asm.ra).apply(null, arguments);
        }, Nb = a._emscripten_bind_Encoder_SetAttributeQuantization_2 = function() {
          return (Nb = a._emscripten_bind_Encoder_SetAttributeQuantization_2 = a.asm.sa).apply(null, arguments);
        }, Ob = a._emscripten_bind_Encoder_SetAttributeExplicitQuantization_5 = function() {
          return (Ob = a._emscripten_bind_Encoder_SetAttributeExplicitQuantization_5 = a.asm.ta).apply(null, arguments);
        }, Pb = a._emscripten_bind_Encoder_SetSpeedOptions_2 = function() {
          return (Pb = a._emscripten_bind_Encoder_SetSpeedOptions_2 = a.asm.ua).apply(null, arguments);
        }, Qb = a._emscripten_bind_Encoder_SetTrackEncodedProperties_1 = function() {
          return (Qb = a._emscripten_bind_Encoder_SetTrackEncodedProperties_1 = a.asm.va).apply(null, arguments);
        }, Rb = a._emscripten_bind_Encoder_EncodeMeshToDracoBuffer_2 = function() {
          return (Rb = a._emscripten_bind_Encoder_EncodeMeshToDracoBuffer_2 = a.asm.wa).apply(null, arguments);
        }, Sb = a._emscripten_bind_Encoder_EncodePointCloudToDracoBuffer_3 = function() {
          return (Sb = a._emscripten_bind_Encoder_EncodePointCloudToDracoBuffer_3 = a.asm.xa).apply(null, arguments);
        }, Tb = a._emscripten_bind_Encoder_GetNumberOfEncodedPoints_0 = function() {
          return (Tb = a._emscripten_bind_Encoder_GetNumberOfEncodedPoints_0 = a.asm.ya).apply(null, arguments);
        }, Ub = a._emscripten_bind_Encoder_GetNumberOfEncodedFaces_0 = function() {
          return (Ub = a._emscripten_bind_Encoder_GetNumberOfEncodedFaces_0 = a.asm.za).apply(null, arguments);
        }, Vb = a._emscripten_bind_Encoder___destroy___0 = function() {
          return (Vb = a._emscripten_bind_Encoder___destroy___0 = a.asm.Aa).apply(null, arguments);
        }, Ea = a._emscripten_bind_ExpertEncoder_ExpertEncoder_1 = function() {
          return (Ea = a._emscripten_bind_ExpertEncoder_ExpertEncoder_1 = a.asm.Ba).apply(null, arguments);
        }, Wb = a._emscripten_bind_ExpertEncoder_SetEncodingMethod_1 = function() {
          return (Wb = a._emscripten_bind_ExpertEncoder_SetEncodingMethod_1 = a.asm.Ca).apply(null, arguments);
        }, Xb = a._emscripten_bind_ExpertEncoder_SetAttributeQuantization_2 = function() {
          return (Xb = a._emscripten_bind_ExpertEncoder_SetAttributeQuantization_2 = a.asm.Da).apply(null, arguments);
        }, Yb = a._emscripten_bind_ExpertEncoder_SetAttributeExplicitQuantization_5 = function() {
          return (Yb = a._emscripten_bind_ExpertEncoder_SetAttributeExplicitQuantization_5 = a.asm.Ea).apply(null, arguments);
        }, Zb = a._emscripten_bind_ExpertEncoder_SetSpeedOptions_2 = function() {
          return (Zb = a._emscripten_bind_ExpertEncoder_SetSpeedOptions_2 = a.asm.Fa).apply(null, arguments);
        }, $b = a._emscripten_bind_ExpertEncoder_SetTrackEncodedProperties_1 = function() {
          return ($b = a._emscripten_bind_ExpertEncoder_SetTrackEncodedProperties_1 = a.asm.Ga).apply(null, arguments);
        }, ac = a._emscripten_bind_ExpertEncoder_EncodeToDracoBuffer_2 = function() {
          return (ac = a._emscripten_bind_ExpertEncoder_EncodeToDracoBuffer_2 = a.asm.Ha).apply(null, arguments);
        }, bc = a._emscripten_bind_ExpertEncoder_GetNumberOfEncodedPoints_0 = function() {
          return (bc = a._emscripten_bind_ExpertEncoder_GetNumberOfEncodedPoints_0 = a.asm.Ia).apply(null, arguments);
        }, cc = a._emscripten_bind_ExpertEncoder_GetNumberOfEncodedFaces_0 = function() {
          return (cc = a._emscripten_bind_ExpertEncoder_GetNumberOfEncodedFaces_0 = a.asm.Ja).apply(null, arguments);
        }, dc = a._emscripten_bind_ExpertEncoder___destroy___0 = function() {
          return (dc = a._emscripten_bind_ExpertEncoder___destroy___0 = a.asm.Ka).apply(null, arguments);
        }, ec = a._emscripten_enum_draco_GeometryAttribute_Type_INVALID = function() {
          return (ec = a._emscripten_enum_draco_GeometryAttribute_Type_INVALID = a.asm.La).apply(
            null,
            arguments
          );
        }, fc = a._emscripten_enum_draco_GeometryAttribute_Type_POSITION = function() {
          return (fc = a._emscripten_enum_draco_GeometryAttribute_Type_POSITION = a.asm.Ma).apply(null, arguments);
        }, gc = a._emscripten_enum_draco_GeometryAttribute_Type_NORMAL = function() {
          return (gc = a._emscripten_enum_draco_GeometryAttribute_Type_NORMAL = a.asm.Na).apply(null, arguments);
        }, hc = a._emscripten_enum_draco_GeometryAttribute_Type_COLOR = function() {
          return (hc = a._emscripten_enum_draco_GeometryAttribute_Type_COLOR = a.asm.Oa).apply(
            null,
            arguments
          );
        }, ic = a._emscripten_enum_draco_GeometryAttribute_Type_TEX_COORD = function() {
          return (ic = a._emscripten_enum_draco_GeometryAttribute_Type_TEX_COORD = a.asm.Pa).apply(null, arguments);
        }, jc = a._emscripten_enum_draco_GeometryAttribute_Type_GENERIC = function() {
          return (jc = a._emscripten_enum_draco_GeometryAttribute_Type_GENERIC = a.asm.Qa).apply(null, arguments);
        }, kc = a._emscripten_enum_draco_EncodedGeometryType_INVALID_GEOMETRY_TYPE = function() {
          return (kc = a._emscripten_enum_draco_EncodedGeometryType_INVALID_GEOMETRY_TYPE = a.asm.Ra).apply(null, arguments);
        }, lc = a._emscripten_enum_draco_EncodedGeometryType_POINT_CLOUD = function() {
          return (lc = a._emscripten_enum_draco_EncodedGeometryType_POINT_CLOUD = a.asm.Sa).apply(null, arguments);
        }, mc = a._emscripten_enum_draco_EncodedGeometryType_TRIANGULAR_MESH = function() {
          return (mc = a._emscripten_enum_draco_EncodedGeometryType_TRIANGULAR_MESH = a.asm.Ta).apply(null, arguments);
        }, nc = a._emscripten_enum_draco_MeshEncoderMethod_MESH_SEQUENTIAL_ENCODING = function() {
          return (nc = a._emscripten_enum_draco_MeshEncoderMethod_MESH_SEQUENTIAL_ENCODING = a.asm.Ua).apply(null, arguments);
        }, oc = a._emscripten_enum_draco_MeshEncoderMethod_MESH_EDGEBREAKER_ENCODING = function() {
          return (oc = a._emscripten_enum_draco_MeshEncoderMethod_MESH_EDGEBREAKER_ENCODING = a.asm.Va).apply(null, arguments);
        };
        a._malloc = function() {
          return (a._malloc = a.asm.Wa).apply(null, arguments);
        };
        a._free = function() {
          return (a._free = a.asm.Xa).apply(null, arguments);
        };
        var pa = function() {
          return (pa = a.asm.Ya).apply(null, arguments);
        };
        a.___start_em_js = 19116;
        a.___stop_em_js = 19214;
        var da;
        aa = function b() {
          da || B();
          da || (aa = b);
        };
        if (a.preInit) for ("function" == typeof a.preInit && (a.preInit = [a.preInit]); 0 < a.preInit.length; ) a.preInit.pop()();
        B();
        v.prototype = Object.create(v.prototype);
        v.prototype.constructor = v;
        v.prototype.__class__ = v;
        v.__cache__ = {};
        a.WrapperObject = v;
        a.getCache = D;
        a.wrapPointer = I;
        a.castObject = function(b, c) {
          return I(b.ptr, c);
        };
        a.NULL = I(0);
        a.destroy = function(b) {
          if (!b.__destroy__) throw "Error: Cannot destroy object. (Did you create it yourself?)";
          b.__destroy__();
          delete D(b.__class__)[b.ptr];
        };
        a.compare = function(b, c) {
          return b.ptr === c.ptr;
        };
        a.getPointer = function(b) {
          return b.ptr;
        };
        a.getClass = function(b) {
          return b.__class__;
        };
        var n = { buffer: 0, size: 0, pos: 0, temps: [], needed: 0, prepare: function() {
          if (n.needed) {
            for (var b = 0; b < n.temps.length; b++) a._free(n.temps[b]);
            n.temps.length = 0;
            a._free(n.buffer);
            n.buffer = 0;
            n.size += n.needed;
            n.needed = 0;
          }
          n.buffer || (n.size += 128, n.buffer = a._malloc(n.size), n.buffer || k(void 0));
          n.pos = 0;
        }, alloc: function(b, c) {
          n.buffer || k(void 0);
          b = b.length * c.BYTES_PER_ELEMENT;
          b = b + 7 & -8;
          n.pos + b >= n.size ? (0 < b || k(void 0), n.needed += b, c = a._malloc(b), n.temps.push(c)) : (c = n.buffer + n.pos, n.pos += b);
          return c;
        }, copy: function(b, c, d) {
          d >>>= 0;
          switch (c.BYTES_PER_ELEMENT) {
            case 2:
              d >>>= 1;
              break;
            case 4:
              d >>>= 2;
              break;
            case 8:
              d >>>= 3;
          }
          for (var e = 0; e < b.length; e++) c[d + e] = b[e];
        } };
        P.prototype = Object.create(v.prototype);
        P.prototype.constructor = P;
        P.prototype.__class__ = P;
        P.__cache__ = {};
        a.VoidPtr = P;
        P.prototype.__destroy__ = P.prototype.__destroy__ = function() {
          La(this.ptr);
        };
        M.prototype = Object.create(v.prototype);
        M.prototype.constructor = M;
        M.prototype.__class__ = M;
        M.__cache__ = {};
        a.GeometryAttribute = M;
        M.prototype.__destroy__ = M.prototype.__destroy__ = function() {
          Ma(this.ptr);
        };
        z.prototype = Object.create(v.prototype);
        z.prototype.constructor = z;
        z.prototype.__class__ = z;
        z.__cache__ = {};
        a.PointAttribute = z;
        z.prototype.size = z.prototype.size = function() {
          return Na(this.ptr);
        };
        z.prototype.attribute_type = z.prototype.attribute_type = function() {
          return Oa(this.ptr);
        };
        z.prototype.data_type = z.prototype.data_type = function() {
          return Pa(this.ptr);
        };
        z.prototype.num_components = z.prototype.num_components = function() {
          return Qa(this.ptr);
        };
        z.prototype.normalized = z.prototype.normalized = function() {
          return !!Ra(this.ptr);
        };
        z.prototype.byte_stride = z.prototype.byte_stride = function() {
          return Sa(this.ptr);
        };
        z.prototype.byte_offset = z.prototype.byte_offset = function() {
          return Ta(this.ptr);
        };
        z.prototype.unique_id = z.prototype.unique_id = function() {
          return Ua(this.ptr);
        };
        z.prototype.__destroy__ = z.prototype.__destroy__ = function() {
          Va(this.ptr);
        };
        G.prototype = Object.create(v.prototype);
        G.prototype.constructor = G;
        G.prototype.__class__ = G;
        G.__cache__ = {};
        a.PointCloud = G;
        G.prototype.num_attributes = G.prototype.num_attributes = function() {
          return Wa(this.ptr);
        };
        G.prototype.num_points = G.prototype.num_points = function() {
          return Xa(this.ptr);
        };
        G.prototype.__destroy__ = G.prototype.__destroy__ = function() {
          Ya(this.ptr);
        };
        E.prototype = Object.create(v.prototype);
        E.prototype.constructor = E;
        E.prototype.__class__ = E;
        E.__cache__ = {};
        a.Mesh = E;
        E.prototype.num_faces = E.prototype.num_faces = function() {
          return Za(this.ptr);
        };
        E.prototype.num_attributes = E.prototype.num_attributes = function() {
          return $a(this.ptr);
        };
        E.prototype.num_points = E.prototype.num_points = function() {
          return ab(this.ptr);
        };
        E.prototype.set_num_points = E.prototype.set_num_points = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          bb(c, b);
        };
        E.prototype.__destroy__ = E.prototype.__destroy__ = function() {
          cb(this.ptr);
        };
        N.prototype = Object.create(v.prototype);
        N.prototype.constructor = N;
        N.prototype.__class__ = N;
        N.__cache__ = {};
        a.Metadata = N;
        N.prototype.__destroy__ = N.prototype.__destroy__ = function() {
          db(this.ptr);
        };
        H.prototype = Object.create(v.prototype);
        H.prototype.constructor = H;
        H.prototype.__class__ = H;
        H.__cache__ = {};
        a.DracoInt8Array = H;
        H.prototype.GetValue = H.prototype.GetValue = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          return eb(c, b);
        };
        H.prototype.size = H.prototype.size = function() {
          return fb(this.ptr);
        };
        H.prototype.__destroy__ = H.prototype.__destroy__ = function() {
          gb(this.ptr);
        };
        F.prototype = Object.create(v.prototype);
        F.prototype.constructor = F;
        F.prototype.__class__ = F;
        F.__cache__ = {};
        a.MetadataBuilder = F;
        F.prototype.AddStringEntry = F.prototype.AddStringEntry = function(b, c, d) {
          var e = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c = c && "object" === typeof c ? c.ptr : J(c);
          d = d && "object" === typeof d ? d.ptr : J(d);
          return !!hb(e, b, c, d);
        };
        F.prototype.AddIntEntry = F.prototype.AddIntEntry = function(b, c, d) {
          var e = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c = c && "object" === typeof c ? c.ptr : J(c);
          d && "object" === typeof d && (d = d.ptr);
          return !!ib(e, b, c, d);
        };
        F.prototype.AddIntEntryArray = F.prototype.AddIntEntryArray = function(b, c, d, e) {
          var g = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c = c && "object" === typeof c ? c.ptr : J(c);
          "object" == typeof d && (d = V(d));
          e && "object" === typeof e && (e = e.ptr);
          return !!jb(g, b, c, d, e);
        };
        F.prototype.AddDoubleEntry = F.prototype.AddDoubleEntry = function(b, c, d) {
          var e = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c = c && "object" === typeof c ? c.ptr : J(c);
          d && "object" === typeof d && (d = d.ptr);
          return !!kb(e, b, c, d);
        };
        F.prototype.__destroy__ = F.prototype.__destroy__ = function() {
          lb(this.ptr);
        };
        x.prototype = Object.create(v.prototype);
        x.prototype.constructor = x;
        x.prototype.__class__ = x;
        x.__cache__ = {};
        a.PointCloudBuilder = x;
        x.prototype.AddFloatAttribute = x.prototype.AddFloatAttribute = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = Z(g));
          return mb(t, b, c, d, e, g);
        };
        x.prototype.AddInt8Attribute = x.prototype.AddInt8Attribute = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = Q(g));
          return nb(t, b, c, d, e, g);
        };
        x.prototype.AddUInt8Attribute = x.prototype.AddUInt8Attribute = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = Q(g));
          return ob(t, b, c, d, e, g);
        };
        x.prototype.AddInt16Attribute = x.prototype.AddInt16Attribute = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = R(g));
          return pb(t, b, c, d, e, g);
        };
        x.prototype.AddUInt16Attribute = x.prototype.AddUInt16Attribute = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = R(g));
          return qb(t, b, c, d, e, g);
        };
        x.prototype.AddInt32Attribute = x.prototype.AddInt32Attribute = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = V(g));
          return rb(t, b, c, d, e, g);
        };
        x.prototype.AddUInt32Attribute = x.prototype.AddUInt32Attribute = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = V(g));
          return sb(t, b, c, d, e, g);
        };
        x.prototype.AddMetadata = x.prototype.AddMetadata = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          return !!tb(d, b, c);
        };
        x.prototype.SetMetadataForAttribute = x.prototype.SetMetadataForAttribute = function(b, c, d) {
          var e = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!ub(e, b, c, d);
        };
        x.prototype.SetNormalizedFlagForAttribute = x.prototype.SetNormalizedFlagForAttribute = function(b, c, d) {
          var e = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!vb(e, b, c, d);
        };
        x.prototype.__destroy__ = x.prototype.__destroy__ = function() {
          wb(this.ptr);
        };
        u.prototype = Object.create(v.prototype);
        u.prototype.constructor = u;
        u.prototype.__class__ = u;
        u.__cache__ = {};
        a.MeshBuilder = u;
        u.prototype.AddFacesToMesh = u.prototype.AddFacesToMesh = function(b, c, d) {
          var e = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          "object" == typeof d && (d = V(d));
          return !!xb(e, b, c, d);
        };
        u.prototype.AddFloatAttributeToMesh = u.prototype.AddFloatAttributeToMesh = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = Z(g));
          return yb(t, b, c, d, e, g);
        };
        u.prototype.AddInt32AttributeToMesh = u.prototype.AddInt32AttributeToMesh = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = V(g));
          return zb(t, b, c, d, e, g);
        };
        u.prototype.AddMetadataToMesh = u.prototype.AddMetadataToMesh = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          return !!Ab(d, b, c);
        };
        u.prototype.AddFloatAttribute = u.prototype.AddFloatAttribute = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = Z(g));
          return Bb(t, b, c, d, e, g);
        };
        u.prototype.AddInt8Attribute = u.prototype.AddInt8Attribute = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = Q(g));
          return Cb(t, b, c, d, e, g);
        };
        u.prototype.AddUInt8Attribute = u.prototype.AddUInt8Attribute = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = Q(g));
          return Db(t, b, c, d, e, g);
        };
        u.prototype.AddInt16Attribute = u.prototype.AddInt16Attribute = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = R(g));
          return Eb(t, b, c, d, e, g);
        };
        u.prototype.AddUInt16Attribute = u.prototype.AddUInt16Attribute = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = R(g));
          return Fb(t, b, c, d, e, g);
        };
        u.prototype.AddInt32Attribute = u.prototype.AddInt32Attribute = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = V(g));
          return Gb(t, b, c, d, e, g);
        };
        u.prototype.AddUInt32Attribute = u.prototype.AddUInt32Attribute = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          e && "object" === typeof e && (e = e.ptr);
          "object" == typeof g && (g = V(g));
          return Hb(t, b, c, d, e, g);
        };
        u.prototype.AddMetadata = u.prototype.AddMetadata = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          return !!Ib(d, b, c);
        };
        u.prototype.SetMetadataForAttribute = u.prototype.SetMetadataForAttribute = function(b, c, d) {
          var e = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!Jb(e, b, c, d);
        };
        u.prototype.SetNormalizedFlagForAttribute = u.prototype.SetNormalizedFlagForAttribute = function(b, c, d) {
          var e = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!Kb(e, b, c, d);
        };
        u.prototype.__destroy__ = u.prototype.__destroy__ = function() {
          Lb(this.ptr);
        };
        y.prototype = Object.create(v.prototype);
        y.prototype.constructor = y;
        y.prototype.__class__ = y;
        y.__cache__ = {};
        a.Encoder = y;
        y.prototype.SetEncodingMethod = y.prototype.SetEncodingMethod = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          Mb(c, b);
        };
        y.prototype.SetAttributeQuantization = y.prototype.SetAttributeQuantization = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          Nb(d, b, c);
        };
        y.prototype.SetAttributeExplicitQuantization = y.prototype.SetAttributeExplicitQuantization = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          "object" == typeof e && (e = Z(e));
          g && "object" === typeof g && (g = g.ptr);
          Ob(t, b, c, d, e, g);
        };
        y.prototype.SetSpeedOptions = y.prototype.SetSpeedOptions = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          Pb(d, b, c);
        };
        y.prototype.SetTrackEncodedProperties = y.prototype.SetTrackEncodedProperties = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          Qb(c, b);
        };
        y.prototype.EncodeMeshToDracoBuffer = y.prototype.EncodeMeshToDracoBuffer = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          return Rb(d, b, c);
        };
        y.prototype.EncodePointCloudToDracoBuffer = y.prototype.EncodePointCloudToDracoBuffer = function(b, c, d) {
          var e = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return Sb(e, b, c, d);
        };
        y.prototype.GetNumberOfEncodedPoints = y.prototype.GetNumberOfEncodedPoints = function() {
          return Tb(this.ptr);
        };
        y.prototype.GetNumberOfEncodedFaces = y.prototype.GetNumberOfEncodedFaces = function() {
          return Ub(this.ptr);
        };
        y.prototype.__destroy__ = y.prototype.__destroy__ = function() {
          Vb(this.ptr);
        };
        A.prototype = Object.create(v.prototype);
        A.prototype.constructor = A;
        A.prototype.__class__ = A;
        A.__cache__ = {};
        a.ExpertEncoder = A;
        A.prototype.SetEncodingMethod = A.prototype.SetEncodingMethod = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          Wb(c, b);
        };
        A.prototype.SetAttributeQuantization = A.prototype.SetAttributeQuantization = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          Xb(d, b, c);
        };
        A.prototype.SetAttributeExplicitQuantization = A.prototype.SetAttributeExplicitQuantization = function(b, c, d, e, g) {
          var t = this.ptr;
          n.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          "object" == typeof e && (e = Z(e));
          g && "object" === typeof g && (g = g.ptr);
          Yb(t, b, c, d, e, g);
        };
        A.prototype.SetSpeedOptions = A.prototype.SetSpeedOptions = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          Zb(d, b, c);
        };
        A.prototype.SetTrackEncodedProperties = A.prototype.SetTrackEncodedProperties = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          $b(c, b);
        };
        A.prototype.EncodeToDracoBuffer = A.prototype.EncodeToDracoBuffer = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          return ac(d, b, c);
        };
        A.prototype.GetNumberOfEncodedPoints = A.prototype.GetNumberOfEncodedPoints = function() {
          return bc(this.ptr);
        };
        A.prototype.GetNumberOfEncodedFaces = A.prototype.GetNumberOfEncodedFaces = function() {
          return cc(this.ptr);
        };
        A.prototype.__destroy__ = A.prototype.__destroy__ = function() {
          dc(this.ptr);
        };
        (function() {
          function b() {
            a.INVALID = ec();
            a.POSITION = fc();
            a.NORMAL = gc();
            a.COLOR = hc();
            a.TEX_COORD = ic();
            a.GENERIC = jc();
            a.INVALID_GEOMETRY_TYPE = kc();
            a.POINT_CLOUD = lc();
            a.TRIANGULAR_MESH = mc();
            a.MESH_SEQUENTIAL_ENCODING = nc();
            a.MESH_EDGEBREAKER_ENCODING = oc();
          }
          qa ? b() : ka.unshift(b);
        })();
        if ("function" === typeof a.onModuleParsed) a.onModuleParsed();
        return p.ready;
      };
    })();
    "object" === typeof exports2 && "object" === typeof module2 ? module2.exports = DracoEncoderModule : "function" === typeof define && define.amd ? define([], function() {
      return DracoEncoderModule;
    }) : "object" === typeof exports2 && (exports2.DracoEncoderModule = DracoEncoderModule);
  }
});

// node_modules/draco3d/draco_decoder_nodejs.js
var require_draco_decoder_nodejs = __commonJS({
  "node_modules/draco3d/draco_decoder_nodejs.js"(exports2, module2) {
    var $jscomp = $jscomp || {};
    $jscomp.scope = {};
    $jscomp.arrayIteratorImpl = function(k) {
      var n = 0;
      return function() {
        return n < k.length ? { done: false, value: k[n++] } : { done: true };
      };
    };
    $jscomp.arrayIterator = function(k) {
      return { next: $jscomp.arrayIteratorImpl(k) };
    };
    $jscomp.makeIterator = function(k) {
      var n = "undefined" != typeof Symbol && Symbol.iterator && k[Symbol.iterator];
      return n ? n.call(k) : $jscomp.arrayIterator(k);
    };
    $jscomp.ASSUME_ES5 = false;
    $jscomp.ASSUME_NO_NATIVE_MAP = false;
    $jscomp.ASSUME_NO_NATIVE_SET = false;
    $jscomp.SIMPLE_FROUND_POLYFILL = false;
    $jscomp.ISOLATE_POLYFILLS = false;
    $jscomp.FORCE_POLYFILL_PROMISE = false;
    $jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = false;
    $jscomp.getGlobal = function(k) {
      k = ["object" == typeof globalThis && globalThis, k, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
      for (var n = 0; n < k.length; ++n) {
        var l = k[n];
        if (l && l.Math == Math) return l;
      }
      throw Error("Cannot find global object");
    };
    $jscomp.global = $jscomp.getGlobal(exports2);
    $jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(k, n, l) {
      if (k == Array.prototype || k == Object.prototype) return k;
      k[n] = l.value;
      return k;
    };
    $jscomp.IS_SYMBOL_NATIVE = "function" === typeof Symbol && "symbol" === typeof /* @__PURE__ */ Symbol("x");
    $jscomp.TRUST_ES6_POLYFILLS = !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
    $jscomp.polyfills = {};
    $jscomp.propertyToPolyfillSymbol = {};
    $jscomp.POLYFILL_PREFIX = "$jscp$";
    $jscomp.polyfill = function(k, n, l, p) {
      n && ($jscomp.ISOLATE_POLYFILLS ? $jscomp.polyfillIsolated(k, n, l, p) : $jscomp.polyfillUnisolated(k, n, l, p));
    };
    $jscomp.polyfillUnisolated = function(k, n, l, p) {
      l = $jscomp.global;
      k = k.split(".");
      for (p = 0; p < k.length - 1; p++) {
        var h = k[p];
        if (!(h in l)) return;
        l = l[h];
      }
      k = k[k.length - 1];
      p = l[k];
      n = n(p);
      n != p && null != n && $jscomp.defineProperty(l, k, { configurable: true, writable: true, value: n });
    };
    $jscomp.polyfillIsolated = function(k, n, l, p) {
      var h = k.split(".");
      k = 1 === h.length;
      p = h[0];
      p = !k && p in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
      for (var A = 0; A < h.length - 1; A++) {
        var f = h[A];
        if (!(f in p)) return;
        p = p[f];
      }
      h = h[h.length - 1];
      l = $jscomp.IS_SYMBOL_NATIVE && "es6" === l ? p[h] : null;
      n = n(l);
      null != n && (k ? $jscomp.defineProperty($jscomp.polyfills, h, { configurable: true, writable: true, value: n }) : n !== l && (void 0 === $jscomp.propertyToPolyfillSymbol[h] && (l = 1e9 * Math.random() >>> 0, $jscomp.propertyToPolyfillSymbol[h] = $jscomp.IS_SYMBOL_NATIVE ? $jscomp.global.Symbol(h) : $jscomp.POLYFILL_PREFIX + l + "$" + h), $jscomp.defineProperty(p, $jscomp.propertyToPolyfillSymbol[h], { configurable: true, writable: true, value: n })));
    };
    $jscomp.polyfill("Promise", function(k) {
      function n() {
        this.batch_ = null;
      }
      function l(f) {
        return f instanceof h ? f : new h(function(q, v) {
          q(f);
        });
      }
      if (k && (!($jscomp.FORCE_POLYFILL_PROMISE || $jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION && "undefined" === typeof $jscomp.global.PromiseRejectionEvent) || !$jscomp.global.Promise || -1 === $jscomp.global.Promise.toString().indexOf("[native code]"))) return k;
      n.prototype.asyncExecute = function(f) {
        if (null == this.batch_) {
          this.batch_ = [];
          var q = this;
          this.asyncExecuteFunction(function() {
            q.executeBatch_();
          });
        }
        this.batch_.push(f);
      };
      var p = $jscomp.global.setTimeout;
      n.prototype.asyncExecuteFunction = function(f) {
        p(f, 0);
      };
      n.prototype.executeBatch_ = function() {
        for (; this.batch_ && this.batch_.length; ) {
          var f = this.batch_;
          this.batch_ = [];
          for (var q = 0; q < f.length; ++q) {
            var v = f[q];
            f[q] = null;
            try {
              v();
            } catch (z) {
              this.asyncThrow_(z);
            }
          }
        }
        this.batch_ = null;
      };
      n.prototype.asyncThrow_ = function(f) {
        this.asyncExecuteFunction(function() {
          throw f;
        });
      };
      var h = function(f) {
        this.state_ = 0;
        this.result_ = void 0;
        this.onSettledCallbacks_ = [];
        this.isRejectionHandled_ = false;
        var q = this.createResolveAndReject_();
        try {
          f(q.resolve, q.reject);
        } catch (v) {
          q.reject(v);
        }
      };
      h.prototype.createResolveAndReject_ = function() {
        function f(z) {
          return function(O) {
            v || (v = true, z.call(q, O));
          };
        }
        var q = this, v = false;
        return { resolve: f(this.resolveTo_), reject: f(this.reject_) };
      };
      h.prototype.resolveTo_ = function(f) {
        if (f === this) this.reject_(new TypeError("A Promise cannot resolve to itself"));
        else if (f instanceof h) this.settleSameAsPromise_(f);
        else {
          a: switch (typeof f) {
            case "object":
              var q = null != f;
              break a;
            case "function":
              q = true;
              break a;
            default:
              q = false;
          }
          q ? this.resolveToNonPromiseObj_(f) : this.fulfill_(f);
        }
      };
      h.prototype.resolveToNonPromiseObj_ = function(f) {
        var q = void 0;
        try {
          q = f.then;
        } catch (v) {
          this.reject_(v);
          return;
        }
        "function" == typeof q ? this.settleSameAsThenable_(q, f) : this.fulfill_(f);
      };
      h.prototype.reject_ = function(f) {
        this.settle_(2, f);
      };
      h.prototype.fulfill_ = function(f) {
        this.settle_(1, f);
      };
      h.prototype.settle_ = function(f, q) {
        if (0 != this.state_) throw Error("Cannot settle(" + f + ", " + q + "): Promise already settled in state" + this.state_);
        this.state_ = f;
        this.result_ = q;
        2 === this.state_ && this.scheduleUnhandledRejectionCheck_();
        this.executeOnSettledCallbacks_();
      };
      h.prototype.scheduleUnhandledRejectionCheck_ = function() {
        var f = this;
        p(function() {
          if (f.notifyUnhandledRejection_()) {
            var q = $jscomp.global.console;
            "undefined" !== typeof q && q.error(f.result_);
          }
        }, 1);
      };
      h.prototype.notifyUnhandledRejection_ = function() {
        if (this.isRejectionHandled_) return false;
        var f = $jscomp.global.CustomEvent, q = $jscomp.global.Event, v = $jscomp.global.dispatchEvent;
        if ("undefined" === typeof v) return true;
        "function" === typeof f ? f = new f("unhandledrejection", { cancelable: true }) : "function" === typeof q ? f = new q("unhandledrejection", { cancelable: true }) : (f = $jscomp.global.document.createEvent("CustomEvent"), f.initCustomEvent("unhandledrejection", false, true, f));
        f.promise = this;
        f.reason = this.result_;
        return v(f);
      };
      h.prototype.executeOnSettledCallbacks_ = function() {
        if (null != this.onSettledCallbacks_) {
          for (var f = 0; f < this.onSettledCallbacks_.length; ++f) A.asyncExecute(this.onSettledCallbacks_[f]);
          this.onSettledCallbacks_ = null;
        }
      };
      var A = new n();
      h.prototype.settleSameAsPromise_ = function(f) {
        var q = this.createResolveAndReject_();
        f.callWhenSettled_(q.resolve, q.reject);
      };
      h.prototype.settleSameAsThenable_ = function(f, q) {
        var v = this.createResolveAndReject_();
        try {
          f.call(q, v.resolve, v.reject);
        } catch (z) {
          v.reject(z);
        }
      };
      h.prototype.then = function(f, q) {
        function v(t, x) {
          return "function" == typeof t ? function(D) {
            try {
              z(t(D));
            } catch (R) {
              O(R);
            }
          } : x;
        }
        var z, O, ba = new h(function(t, x) {
          z = t;
          O = x;
        });
        this.callWhenSettled_(v(f, z), v(q, O));
        return ba;
      };
      h.prototype.catch = function(f) {
        return this.then(void 0, f);
      };
      h.prototype.callWhenSettled_ = function(f, q) {
        function v() {
          switch (z.state_) {
            case 1:
              f(z.result_);
              break;
            case 2:
              q(z.result_);
              break;
            default:
              throw Error("Unexpected state: " + z.state_);
          }
        }
        var z = this;
        null == this.onSettledCallbacks_ ? A.asyncExecute(v) : this.onSettledCallbacks_.push(v);
        this.isRejectionHandled_ = true;
      };
      h.resolve = l;
      h.reject = function(f) {
        return new h(function(q, v) {
          v(f);
        });
      };
      h.race = function(f) {
        return new h(function(q, v) {
          for (var z = $jscomp.makeIterator(f), O = z.next(); !O.done; O = z.next()) l(O.value).callWhenSettled_(q, v);
        });
      };
      h.all = function(f) {
        var q = $jscomp.makeIterator(f), v = q.next();
        return v.done ? l([]) : new h(function(z, O) {
          function ba(D) {
            return function(R) {
              t[D] = R;
              x--;
              0 == x && z(t);
            };
          }
          var t = [], x = 0;
          do
            t.push(void 0), x++, l(v.value).callWhenSettled_(ba(t.length - 1), O), v = q.next();
          while (!v.done);
        });
      };
      return h;
    }, "es6", "es3");
    $jscomp.owns = function(k, n) {
      return Object.prototype.hasOwnProperty.call(k, n);
    };
    $jscomp.assign = $jscomp.TRUST_ES6_POLYFILLS && "function" == typeof Object.assign ? Object.assign : function(k, n) {
      for (var l = 1; l < arguments.length; l++) {
        var p = arguments[l];
        if (p) for (var h in p) $jscomp.owns(p, h) && (k[h] = p[h]);
      }
      return k;
    };
    $jscomp.polyfill("Object.assign", function(k) {
      return k || $jscomp.assign;
    }, "es6", "es3");
    $jscomp.checkStringArgs = function(k, n, l) {
      if (null == k) throw new TypeError("The 'this' value for String.prototype." + l + " must not be null or undefined");
      if (n instanceof RegExp) throw new TypeError("First argument to String.prototype." + l + " must not be a regular expression");
      return k + "";
    };
    $jscomp.polyfill("String.prototype.startsWith", function(k) {
      return k ? k : function(n, l) {
        var p = $jscomp.checkStringArgs(this, n, "startsWith");
        n += "";
        var h = p.length, A = n.length;
        l = Math.max(0, Math.min(l | 0, p.length));
        for (var f = 0; f < A && l < h; ) if (p[l++] != n[f++]) return false;
        return f >= A;
      };
    }, "es6", "es3");
    $jscomp.polyfill("Array.prototype.copyWithin", function(k) {
      function n(l) {
        l = Number(l);
        return Infinity === l || -Infinity === l ? l : l | 0;
      }
      return k ? k : function(l, p, h) {
        var A = this.length;
        l = n(l);
        p = n(p);
        h = void 0 === h ? A : n(h);
        l = 0 > l ? Math.max(A + l, 0) : Math.min(l, A);
        p = 0 > p ? Math.max(A + p, 0) : Math.min(p, A);
        h = 0 > h ? Math.max(A + h, 0) : Math.min(h, A);
        if (l < p) for (; p < h; ) p in this ? this[l++] = this[p++] : (delete this[l++], p++);
        else for (h = Math.min(h, A + p - l), l += h - p; h > p; ) --h in this ? this[--l] = this[h] : delete this[--l];
        return this;
      };
    }, "es6", "es3");
    $jscomp.typedArrayCopyWithin = function(k) {
      return k ? k : Array.prototype.copyWithin;
    };
    $jscomp.polyfill("Int8Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Uint8Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Uint8ClampedArray.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Int16Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Uint16Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Int32Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Uint32Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Float32Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    $jscomp.polyfill("Float64Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
    var DracoDecoderModule = (function() {
      var k = "undefined" !== typeof document && document.currentScript ? document.currentScript.src : void 0;
      "undefined" !== typeof __filename && (k = k || __filename);
      return function(n) {
        function l(e) {
          return a.locateFile ? a.locateFile(e, U) : U + e;
        }
        function p(e, b, c) {
          var d = b + c;
          for (c = b; e[c] && !(c >= d); ) ++c;
          if (16 < c - b && e.buffer && va) return va.decode(e.subarray(b, c));
          for (d = ""; b < c; ) {
            var g = e[b++];
            if (g & 128) {
              var u = e[b++] & 63;
              if (192 == (g & 224)) d += String.fromCharCode((g & 31) << 6 | u);
              else {
                var X = e[b++] & 63;
                g = 224 == (g & 240) ? (g & 15) << 12 | u << 6 | X : (g & 7) << 18 | u << 12 | X << 6 | e[b++] & 63;
                65536 > g ? d += String.fromCharCode(g) : (g -= 65536, d += String.fromCharCode(55296 | g >> 10, 56320 | g & 1023));
              }
            } else d += String.fromCharCode(g);
          }
          return d;
        }
        function h(e, b) {
          return e ? p(ea, e, b) : "";
        }
        function A() {
          var e = ja.buffer;
          a.HEAP8 = Y = new Int8Array(e);
          a.HEAP16 = new Int16Array(e);
          a.HEAP32 = ca = new Int32Array(e);
          a.HEAPU8 = ea = new Uint8Array(e);
          a.HEAPU16 = new Uint16Array(e);
          a.HEAPU32 = V = new Uint32Array(e);
          a.HEAPF32 = new Float32Array(e);
          a.HEAPF64 = new Float64Array(e);
        }
        function f(e) {
          if (a.onAbort) a.onAbort(e);
          e = "Aborted(" + e + ")";
          da(e);
          wa = true;
          e = new WebAssembly.RuntimeError(e + ". Build with -sASSERTIONS for more info.");
          ka(e);
          throw e;
        }
        function q(e) {
          try {
            if (e == P && fa) return new Uint8Array(fa);
            if (ma) return ma(e);
            throw "both async and sync fetching of the wasm failed";
          } catch (b) {
            f(b);
          }
        }
        function v() {
          if (!fa && (xa || ha)) {
            if ("function" == typeof fetch && !P.startsWith("file://")) return fetch(P, { credentials: "same-origin" }).then(function(e) {
              if (!e.ok) throw "failed to load wasm binary file at '" + P + "'";
              return e.arrayBuffer();
            }).catch(function() {
              return q(P);
            });
            if (na) return new Promise(function(e, b) {
              na(P, function(c) {
                e(new Uint8Array(c));
              }, b);
            });
          }
          return Promise.resolve().then(function() {
            return q(P);
          });
        }
        function z(e) {
          for (; 0 < e.length; ) e.shift()(a);
        }
        function O(e) {
          this.excPtr = e;
          this.ptr = e - 24;
          this.set_type = function(b) {
            V[this.ptr + 4 >> 2] = b;
          };
          this.get_type = function() {
            return V[this.ptr + 4 >> 2];
          };
          this.set_destructor = function(b) {
            V[this.ptr + 8 >> 2] = b;
          };
          this.get_destructor = function() {
            return V[this.ptr + 8 >> 2];
          };
          this.set_refcount = function(b) {
            ca[this.ptr >> 2] = b;
          };
          this.set_caught = function(b) {
            Y[this.ptr + 12 >> 0] = b ? 1 : 0;
          };
          this.get_caught = function() {
            return 0 != Y[this.ptr + 12 >> 0];
          };
          this.set_rethrown = function(b) {
            Y[this.ptr + 13 >> 0] = b ? 1 : 0;
          };
          this.get_rethrown = function() {
            return 0 != Y[this.ptr + 13 >> 0];
          };
          this.init = function(b, c) {
            this.set_adjusted_ptr(0);
            this.set_type(b);
            this.set_destructor(c);
            this.set_refcount(0);
            this.set_caught(false);
            this.set_rethrown(false);
          };
          this.add_ref = function() {
            ca[this.ptr >> 2] += 1;
          };
          this.release_ref = function() {
            var b = ca[this.ptr >> 2];
            ca[this.ptr >> 2] = b - 1;
            return 1 === b;
          };
          this.set_adjusted_ptr = function(b) {
            V[this.ptr + 16 >> 2] = b;
          };
          this.get_adjusted_ptr = function() {
            return V[this.ptr + 16 >> 2];
          };
          this.get_exception_ptr = function() {
            if (ya(this.get_type())) return V[this.excPtr >> 2];
            var b = this.get_adjusted_ptr();
            return 0 !== b ? b : this.excPtr;
          };
        }
        function ba() {
          function e() {
            if (!la && (la = true, a.calledRun = true, !wa)) {
              za = true;
              z(oa);
              Aa(a);
              if (a.onRuntimeInitialized) a.onRuntimeInitialized();
              if (a.postRun) for ("function" == typeof a.postRun && (a.postRun = [a.postRun]); a.postRun.length; ) Ba.unshift(a.postRun.shift());
              z(Ba);
            }
          }
          if (!(0 < aa)) {
            if (a.preRun) for ("function" == typeof a.preRun && (a.preRun = [a.preRun]); a.preRun.length; ) Ca.unshift(a.preRun.shift());
            z(Ca);
            0 < aa || (a.setStatus ? (a.setStatus("Running..."), setTimeout(function() {
              setTimeout(function() {
                a.setStatus("");
              }, 1);
              e();
            }, 1)) : e());
          }
        }
        function t() {
        }
        function x(e) {
          return (e || t).__cache__;
        }
        function D(e, b) {
          var c = x(b), d = c[e];
          if (d) return d;
          d = Object.create((b || t).prototype);
          d.ptr = e;
          return c[e] = d;
        }
        function R(e) {
          if ("string" === typeof e) {
            for (var b = 0, c = 0; c < e.length; ++c) {
              var d = e.charCodeAt(c);
              127 >= d ? b++ : 2047 >= d ? b += 2 : 55296 <= d && 57343 >= d ? (b += 4, ++c) : b += 3;
            }
            b = Array(b + 1);
            c = 0;
            d = b.length;
            if (0 < d) {
              d = c + d - 1;
              for (var g = 0; g < e.length; ++g) {
                var u = e.charCodeAt(g);
                if (55296 <= u && 57343 >= u) {
                  var X = e.charCodeAt(++g);
                  u = 65536 + ((u & 1023) << 10) | X & 1023;
                }
                if (127 >= u) {
                  if (c >= d) break;
                  b[c++] = u;
                } else {
                  if (2047 >= u) {
                    if (c + 1 >= d) break;
                    b[c++] = 192 | u >> 6;
                  } else {
                    if (65535 >= u) {
                      if (c + 2 >= d) break;
                      b[c++] = 224 | u >> 12;
                    } else {
                      if (c + 3 >= d) break;
                      b[c++] = 240 | u >> 18;
                      b[c++] = 128 | u >> 12 & 63;
                    }
                    b[c++] = 128 | u >> 6 & 63;
                  }
                  b[c++] = 128 | u & 63;
                }
              }
              b[c] = 0;
            }
            e = r.alloc(b, Y);
            r.copy(b, Y, e);
            return e;
          }
          return e;
        }
        function pa(e) {
          if ("object" === typeof e) {
            var b = r.alloc(e, Y);
            r.copy(e, Y, b);
            return b;
          }
          return e;
        }
        function Z() {
          throw "cannot construct a VoidPtr, no constructor in IDL";
        }
        function S() {
          this.ptr = Da();
          x(S)[this.ptr] = this;
        }
        function Q() {
          this.ptr = Ea();
          x(Q)[this.ptr] = this;
        }
        function W() {
          this.ptr = Fa();
          x(W)[this.ptr] = this;
        }
        function w() {
          this.ptr = Ga();
          x(w)[this.ptr] = this;
        }
        function C() {
          this.ptr = Ha();
          x(C)[this.ptr] = this;
        }
        function F() {
          this.ptr = Ia();
          x(F)[this.ptr] = this;
        }
        function G() {
          this.ptr = Ja();
          x(G)[this.ptr] = this;
        }
        function E() {
          this.ptr = Ka();
          x(E)[this.ptr] = this;
        }
        function T() {
          this.ptr = La();
          x(T)[this.ptr] = this;
        }
        function B() {
          throw "cannot construct a Status, no constructor in IDL";
        }
        function H() {
          this.ptr = Ma();
          x(H)[this.ptr] = this;
        }
        function I() {
          this.ptr = Na();
          x(I)[this.ptr] = this;
        }
        function J() {
          this.ptr = Oa();
          x(J)[this.ptr] = this;
        }
        function K() {
          this.ptr = Pa();
          x(K)[this.ptr] = this;
        }
        function L() {
          this.ptr = Qa();
          x(L)[this.ptr] = this;
        }
        function M() {
          this.ptr = Ra();
          x(M)[this.ptr] = this;
        }
        function N() {
          this.ptr = Sa();
          x(N)[this.ptr] = this;
        }
        function y() {
          this.ptr = Ta();
          x(y)[this.ptr] = this;
        }
        function m() {
          this.ptr = Ua();
          x(m)[this.ptr] = this;
        }
        n = void 0 === n ? {} : n;
        var a = "undefined" != typeof n ? n : {}, Aa, ka;
        a.ready = new Promise(function(e, b) {
          Aa = e;
          ka = b;
        });
        var Va = false, Wa = false;
        a.onRuntimeInitialized = function() {
          Va = true;
          if (Wa && "function" === typeof a.onModuleLoaded) a.onModuleLoaded(a);
        };
        a.onModuleParsed = function() {
          Wa = true;
          if (Va && "function" === typeof a.onModuleLoaded) a.onModuleLoaded(a);
        };
        a.isVersionSupported = function(e) {
          if ("string" !== typeof e) return false;
          e = e.split(".");
          return 2 > e.length || 3 < e.length ? false : 1 == e[0] && 0 <= e[1] && 5 >= e[1] ? true : 0 != e[0] || 10 < e[1] ? false : true;
        };
        var Xa = Object.assign({}, a), xa = "object" == typeof window, ha = "function" == typeof importScripts, Ya = "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node, U = "";
        if (Ya) {
          var Za = require("fs"), qa = require("path");
          U = ha ? qa.dirname(U) + "/" : __dirname + "/";
          var $a = function(e, b) {
            e = e.startsWith("file://") ? new URL(e) : qa.normalize(e);
            return Za.readFileSync(e, b ? void 0 : "utf8");
          };
          var ma = function(e) {
            e = $a(e, true);
            e.buffer || (e = new Uint8Array(e));
            return e;
          };
          var na = function(e, b, c) {
            e = e.startsWith("file://") ? new URL(e) : qa.normalize(e);
            Za.readFile(e, function(d, g) {
              d ? c(d) : b(g.buffer);
            });
          };
          1 < process.argv.length && process.argv[1].replace(/\\/g, "/");
          process.argv.slice(2);
          a.inspect = function() {
            return "[Emscripten Module object]";
          };
        } else if (xa || ha) ha ? U = self.location.href : "undefined" != typeof document && document.currentScript && (U = document.currentScript.src), k && (U = k), U = 0 !== U.indexOf("blob:") ? U.substr(0, U.replace(/[?#].*/, "").lastIndexOf("/") + 1) : "", $a = function(e) {
          var b = new XMLHttpRequest();
          b.open("GET", e, false);
          b.send(null);
          return b.responseText;
        }, ha && (ma = function(e) {
          var b = new XMLHttpRequest();
          b.open("GET", e, false);
          b.responseType = "arraybuffer";
          b.send(null);
          return new Uint8Array(b.response);
        }), na = function(e, b, c) {
          var d = new XMLHttpRequest();
          d.open("GET", e, true);
          d.responseType = "arraybuffer";
          d.onload = function() {
            200 == d.status || 0 == d.status && d.response ? b(d.response) : c();
          };
          d.onerror = c;
          d.send(null);
        };
        var ud = a.print || console.log.bind(console), da = a.printErr || console.warn.bind(console);
        Object.assign(a, Xa);
        Xa = null;
        var fa;
        a.wasmBinary && (fa = a.wasmBinary);
        "object" != typeof WebAssembly && f("no native wasm support detected");
        var ja, wa = false, va = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0, Y, ea, ca, V, Ca = [], oa = [], Ba = [], za = false, aa = 0, ra = null, ia = null;
        var P = "draco_decoder.wasm";
        P.startsWith("data:application/octet-stream;base64,") || (P = l(P));
        var vd = 0, wd = [null, [], []], xd = { b: function(e, b, c) {
          new O(e).init(b, c);
          vd++;
          throw e;
        }, a: function() {
          f("");
        }, g: function(e, b, c) {
          ea.copyWithin(e, b, b + c);
        }, e: function(e) {
          var b = ea.length;
          e >>>= 0;
          if (2147483648 < e) return false;
          for (var c = 1; 4 >= c; c *= 2) {
            var d = b * (1 + 0.2 / c);
            d = Math.min(d, e + 100663296);
            var g = Math;
            d = Math.max(e, d);
            g = g.min.call(g, 2147483648, d + (65536 - d % 65536) % 65536);
            a: {
              d = ja.buffer;
              try {
                ja.grow(g - d.byteLength + 65535 >>> 16);
                A();
                var u = 1;
                break a;
              } catch (X) {
              }
              u = void 0;
            }
            if (u) return true;
          }
          return false;
        }, f: function(e) {
          return 52;
        }, d: function(e, b, c, d, g) {
          return 70;
        }, c: function(e, b, c, d) {
          for (var g = 0, u = 0; u < c; u++) {
            var X = V[b >> 2], ab = V[b + 4 >> 2];
            b += 8;
            for (var sa = 0; sa < ab; sa++) {
              var ta = ea[X + sa], ua = wd[e];
              0 === ta || 10 === ta ? ((1 === e ? ud : da)(p(ua, 0)), ua.length = 0) : ua.push(ta);
            }
            g += ab;
          }
          V[d >> 2] = g;
          return 0;
        } };
        (function() {
          function e(g, u) {
            a.asm = g.exports;
            ja = a.asm.h;
            A();
            oa.unshift(a.asm.i);
            aa--;
            a.monitorRunDependencies && a.monitorRunDependencies(aa);
            0 == aa && (null !== ra && (clearInterval(ra), ra = null), ia && (g = ia, ia = null, g()));
          }
          function b(g) {
            e(g.instance);
          }
          function c(g) {
            return v().then(function(u) {
              return WebAssembly.instantiate(u, d);
            }).then(function(u) {
              return u;
            }).then(g, function(u) {
              da("failed to asynchronously prepare wasm: " + u);
              f(u);
            });
          }
          var d = { a: xd };
          aa++;
          a.monitorRunDependencies && a.monitorRunDependencies(aa);
          if (a.instantiateWasm) try {
            return a.instantiateWasm(d, e);
          } catch (g) {
            da("Module.instantiateWasm callback failed with error: " + g), ka(g);
          }
          (function() {
            return fa || "function" != typeof WebAssembly.instantiateStreaming || P.startsWith("data:application/octet-stream;base64,") || P.startsWith("file://") || Ya || "function" != typeof fetch ? c(b) : fetch(P, { credentials: "same-origin" }).then(function(g) {
              return WebAssembly.instantiateStreaming(g, d).then(b, function(u) {
                da("wasm streaming compile failed: " + u);
                da("falling back to ArrayBuffer instantiation");
                return c(b);
              });
            });
          })().catch(ka);
          return {};
        })();
        var bb = a._emscripten_bind_VoidPtr___destroy___0 = function() {
          return (bb = a._emscripten_bind_VoidPtr___destroy___0 = a.asm.k).apply(null, arguments);
        }, Da = a._emscripten_bind_DecoderBuffer_DecoderBuffer_0 = function() {
          return (Da = a._emscripten_bind_DecoderBuffer_DecoderBuffer_0 = a.asm.l).apply(null, arguments);
        }, cb = a._emscripten_bind_DecoderBuffer_Init_2 = function() {
          return (cb = a._emscripten_bind_DecoderBuffer_Init_2 = a.asm.m).apply(null, arguments);
        }, db = a._emscripten_bind_DecoderBuffer___destroy___0 = function() {
          return (db = a._emscripten_bind_DecoderBuffer___destroy___0 = a.asm.n).apply(null, arguments);
        }, Ea = a._emscripten_bind_AttributeTransformData_AttributeTransformData_0 = function() {
          return (Ea = a._emscripten_bind_AttributeTransformData_AttributeTransformData_0 = a.asm.o).apply(null, arguments);
        }, eb = a._emscripten_bind_AttributeTransformData_transform_type_0 = function() {
          return (eb = a._emscripten_bind_AttributeTransformData_transform_type_0 = a.asm.p).apply(null, arguments);
        }, fb = a._emscripten_bind_AttributeTransformData___destroy___0 = function() {
          return (fb = a._emscripten_bind_AttributeTransformData___destroy___0 = a.asm.q).apply(null, arguments);
        }, Fa = a._emscripten_bind_GeometryAttribute_GeometryAttribute_0 = function() {
          return (Fa = a._emscripten_bind_GeometryAttribute_GeometryAttribute_0 = a.asm.r).apply(null, arguments);
        }, gb = a._emscripten_bind_GeometryAttribute___destroy___0 = function() {
          return (gb = a._emscripten_bind_GeometryAttribute___destroy___0 = a.asm.s).apply(null, arguments);
        }, Ga = a._emscripten_bind_PointAttribute_PointAttribute_0 = function() {
          return (Ga = a._emscripten_bind_PointAttribute_PointAttribute_0 = a.asm.t).apply(null, arguments);
        }, hb = a._emscripten_bind_PointAttribute_size_0 = function() {
          return (hb = a._emscripten_bind_PointAttribute_size_0 = a.asm.u).apply(null, arguments);
        }, ib = a._emscripten_bind_PointAttribute_GetAttributeTransformData_0 = function() {
          return (ib = a._emscripten_bind_PointAttribute_GetAttributeTransformData_0 = a.asm.v).apply(null, arguments);
        }, jb = a._emscripten_bind_PointAttribute_attribute_type_0 = function() {
          return (jb = a._emscripten_bind_PointAttribute_attribute_type_0 = a.asm.w).apply(null, arguments);
        }, kb = a._emscripten_bind_PointAttribute_data_type_0 = function() {
          return (kb = a._emscripten_bind_PointAttribute_data_type_0 = a.asm.x).apply(null, arguments);
        }, lb = a._emscripten_bind_PointAttribute_num_components_0 = function() {
          return (lb = a._emscripten_bind_PointAttribute_num_components_0 = a.asm.y).apply(null, arguments);
        }, mb = a._emscripten_bind_PointAttribute_normalized_0 = function() {
          return (mb = a._emscripten_bind_PointAttribute_normalized_0 = a.asm.z).apply(null, arguments);
        }, nb = a._emscripten_bind_PointAttribute_byte_stride_0 = function() {
          return (nb = a._emscripten_bind_PointAttribute_byte_stride_0 = a.asm.A).apply(null, arguments);
        }, ob = a._emscripten_bind_PointAttribute_byte_offset_0 = function() {
          return (ob = a._emscripten_bind_PointAttribute_byte_offset_0 = a.asm.B).apply(null, arguments);
        }, pb = a._emscripten_bind_PointAttribute_unique_id_0 = function() {
          return (pb = a._emscripten_bind_PointAttribute_unique_id_0 = a.asm.C).apply(null, arguments);
        }, qb = a._emscripten_bind_PointAttribute___destroy___0 = function() {
          return (qb = a._emscripten_bind_PointAttribute___destroy___0 = a.asm.D).apply(null, arguments);
        }, Ha = a._emscripten_bind_AttributeQuantizationTransform_AttributeQuantizationTransform_0 = function() {
          return (Ha = a._emscripten_bind_AttributeQuantizationTransform_AttributeQuantizationTransform_0 = a.asm.E).apply(null, arguments);
        }, rb = a._emscripten_bind_AttributeQuantizationTransform_InitFromAttribute_1 = function() {
          return (rb = a._emscripten_bind_AttributeQuantizationTransform_InitFromAttribute_1 = a.asm.F).apply(null, arguments);
        }, sb = a._emscripten_bind_AttributeQuantizationTransform_quantization_bits_0 = function() {
          return (sb = a._emscripten_bind_AttributeQuantizationTransform_quantization_bits_0 = a.asm.G).apply(null, arguments);
        }, tb = a._emscripten_bind_AttributeQuantizationTransform_min_value_1 = function() {
          return (tb = a._emscripten_bind_AttributeQuantizationTransform_min_value_1 = a.asm.H).apply(null, arguments);
        }, ub = a._emscripten_bind_AttributeQuantizationTransform_range_0 = function() {
          return (ub = a._emscripten_bind_AttributeQuantizationTransform_range_0 = a.asm.I).apply(null, arguments);
        }, vb = a._emscripten_bind_AttributeQuantizationTransform___destroy___0 = function() {
          return (vb = a._emscripten_bind_AttributeQuantizationTransform___destroy___0 = a.asm.J).apply(null, arguments);
        }, Ia = a._emscripten_bind_AttributeOctahedronTransform_AttributeOctahedronTransform_0 = function() {
          return (Ia = a._emscripten_bind_AttributeOctahedronTransform_AttributeOctahedronTransform_0 = a.asm.K).apply(null, arguments);
        }, wb = a._emscripten_bind_AttributeOctahedronTransform_InitFromAttribute_1 = function() {
          return (wb = a._emscripten_bind_AttributeOctahedronTransform_InitFromAttribute_1 = a.asm.L).apply(
            null,
            arguments
          );
        }, xb = a._emscripten_bind_AttributeOctahedronTransform_quantization_bits_0 = function() {
          return (xb = a._emscripten_bind_AttributeOctahedronTransform_quantization_bits_0 = a.asm.M).apply(null, arguments);
        }, yb = a._emscripten_bind_AttributeOctahedronTransform___destroy___0 = function() {
          return (yb = a._emscripten_bind_AttributeOctahedronTransform___destroy___0 = a.asm.N).apply(null, arguments);
        }, Ja = a._emscripten_bind_PointCloud_PointCloud_0 = function() {
          return (Ja = a._emscripten_bind_PointCloud_PointCloud_0 = a.asm.O).apply(
            null,
            arguments
          );
        }, zb = a._emscripten_bind_PointCloud_num_attributes_0 = function() {
          return (zb = a._emscripten_bind_PointCloud_num_attributes_0 = a.asm.P).apply(null, arguments);
        }, Ab = a._emscripten_bind_PointCloud_num_points_0 = function() {
          return (Ab = a._emscripten_bind_PointCloud_num_points_0 = a.asm.Q).apply(null, arguments);
        }, Bb = a._emscripten_bind_PointCloud___destroy___0 = function() {
          return (Bb = a._emscripten_bind_PointCloud___destroy___0 = a.asm.R).apply(null, arguments);
        }, Ka = a._emscripten_bind_Mesh_Mesh_0 = function() {
          return (Ka = a._emscripten_bind_Mesh_Mesh_0 = a.asm.S).apply(null, arguments);
        }, Cb = a._emscripten_bind_Mesh_num_faces_0 = function() {
          return (Cb = a._emscripten_bind_Mesh_num_faces_0 = a.asm.T).apply(null, arguments);
        }, Db = a._emscripten_bind_Mesh_num_attributes_0 = function() {
          return (Db = a._emscripten_bind_Mesh_num_attributes_0 = a.asm.U).apply(null, arguments);
        }, Eb = a._emscripten_bind_Mesh_num_points_0 = function() {
          return (Eb = a._emscripten_bind_Mesh_num_points_0 = a.asm.V).apply(null, arguments);
        }, Fb = a._emscripten_bind_Mesh___destroy___0 = function() {
          return (Fb = a._emscripten_bind_Mesh___destroy___0 = a.asm.W).apply(null, arguments);
        }, La = a._emscripten_bind_Metadata_Metadata_0 = function() {
          return (La = a._emscripten_bind_Metadata_Metadata_0 = a.asm.X).apply(null, arguments);
        }, Gb = a._emscripten_bind_Metadata___destroy___0 = function() {
          return (Gb = a._emscripten_bind_Metadata___destroy___0 = a.asm.Y).apply(null, arguments);
        }, Hb = a._emscripten_bind_Status_code_0 = function() {
          return (Hb = a._emscripten_bind_Status_code_0 = a.asm.Z).apply(null, arguments);
        }, Ib = a._emscripten_bind_Status_ok_0 = function() {
          return (Ib = a._emscripten_bind_Status_ok_0 = a.asm._).apply(null, arguments);
        }, Jb = a._emscripten_bind_Status_error_msg_0 = function() {
          return (Jb = a._emscripten_bind_Status_error_msg_0 = a.asm.$).apply(null, arguments);
        }, Kb = a._emscripten_bind_Status___destroy___0 = function() {
          return (Kb = a._emscripten_bind_Status___destroy___0 = a.asm.aa).apply(null, arguments);
        }, Ma = a._emscripten_bind_DracoFloat32Array_DracoFloat32Array_0 = function() {
          return (Ma = a._emscripten_bind_DracoFloat32Array_DracoFloat32Array_0 = a.asm.ba).apply(null, arguments);
        }, Lb = a._emscripten_bind_DracoFloat32Array_GetValue_1 = function() {
          return (Lb = a._emscripten_bind_DracoFloat32Array_GetValue_1 = a.asm.ca).apply(null, arguments);
        }, Mb = a._emscripten_bind_DracoFloat32Array_size_0 = function() {
          return (Mb = a._emscripten_bind_DracoFloat32Array_size_0 = a.asm.da).apply(null, arguments);
        }, Nb = a._emscripten_bind_DracoFloat32Array___destroy___0 = function() {
          return (Nb = a._emscripten_bind_DracoFloat32Array___destroy___0 = a.asm.ea).apply(null, arguments);
        }, Na = a._emscripten_bind_DracoInt8Array_DracoInt8Array_0 = function() {
          return (Na = a._emscripten_bind_DracoInt8Array_DracoInt8Array_0 = a.asm.fa).apply(null, arguments);
        }, Ob = a._emscripten_bind_DracoInt8Array_GetValue_1 = function() {
          return (Ob = a._emscripten_bind_DracoInt8Array_GetValue_1 = a.asm.ga).apply(null, arguments);
        }, Pb = a._emscripten_bind_DracoInt8Array_size_0 = function() {
          return (Pb = a._emscripten_bind_DracoInt8Array_size_0 = a.asm.ha).apply(null, arguments);
        }, Qb = a._emscripten_bind_DracoInt8Array___destroy___0 = function() {
          return (Qb = a._emscripten_bind_DracoInt8Array___destroy___0 = a.asm.ia).apply(null, arguments);
        }, Oa = a._emscripten_bind_DracoUInt8Array_DracoUInt8Array_0 = function() {
          return (Oa = a._emscripten_bind_DracoUInt8Array_DracoUInt8Array_0 = a.asm.ja).apply(null, arguments);
        }, Rb = a._emscripten_bind_DracoUInt8Array_GetValue_1 = function() {
          return (Rb = a._emscripten_bind_DracoUInt8Array_GetValue_1 = a.asm.ka).apply(null, arguments);
        }, Sb = a._emscripten_bind_DracoUInt8Array_size_0 = function() {
          return (Sb = a._emscripten_bind_DracoUInt8Array_size_0 = a.asm.la).apply(null, arguments);
        }, Tb = a._emscripten_bind_DracoUInt8Array___destroy___0 = function() {
          return (Tb = a._emscripten_bind_DracoUInt8Array___destroy___0 = a.asm.ma).apply(null, arguments);
        }, Pa = a._emscripten_bind_DracoInt16Array_DracoInt16Array_0 = function() {
          return (Pa = a._emscripten_bind_DracoInt16Array_DracoInt16Array_0 = a.asm.na).apply(null, arguments);
        }, Ub = a._emscripten_bind_DracoInt16Array_GetValue_1 = function() {
          return (Ub = a._emscripten_bind_DracoInt16Array_GetValue_1 = a.asm.oa).apply(null, arguments);
        }, Vb = a._emscripten_bind_DracoInt16Array_size_0 = function() {
          return (Vb = a._emscripten_bind_DracoInt16Array_size_0 = a.asm.pa).apply(null, arguments);
        }, Wb = a._emscripten_bind_DracoInt16Array___destroy___0 = function() {
          return (Wb = a._emscripten_bind_DracoInt16Array___destroy___0 = a.asm.qa).apply(null, arguments);
        }, Qa = a._emscripten_bind_DracoUInt16Array_DracoUInt16Array_0 = function() {
          return (Qa = a._emscripten_bind_DracoUInt16Array_DracoUInt16Array_0 = a.asm.ra).apply(null, arguments);
        }, Xb = a._emscripten_bind_DracoUInt16Array_GetValue_1 = function() {
          return (Xb = a._emscripten_bind_DracoUInt16Array_GetValue_1 = a.asm.sa).apply(null, arguments);
        }, Yb = a._emscripten_bind_DracoUInt16Array_size_0 = function() {
          return (Yb = a._emscripten_bind_DracoUInt16Array_size_0 = a.asm.ta).apply(null, arguments);
        }, Zb = a._emscripten_bind_DracoUInt16Array___destroy___0 = function() {
          return (Zb = a._emscripten_bind_DracoUInt16Array___destroy___0 = a.asm.ua).apply(null, arguments);
        }, Ra = a._emscripten_bind_DracoInt32Array_DracoInt32Array_0 = function() {
          return (Ra = a._emscripten_bind_DracoInt32Array_DracoInt32Array_0 = a.asm.va).apply(null, arguments);
        }, $b = a._emscripten_bind_DracoInt32Array_GetValue_1 = function() {
          return ($b = a._emscripten_bind_DracoInt32Array_GetValue_1 = a.asm.wa).apply(null, arguments);
        }, ac = a._emscripten_bind_DracoInt32Array_size_0 = function() {
          return (ac = a._emscripten_bind_DracoInt32Array_size_0 = a.asm.xa).apply(null, arguments);
        }, bc = a._emscripten_bind_DracoInt32Array___destroy___0 = function() {
          return (bc = a._emscripten_bind_DracoInt32Array___destroy___0 = a.asm.ya).apply(null, arguments);
        }, Sa = a._emscripten_bind_DracoUInt32Array_DracoUInt32Array_0 = function() {
          return (Sa = a._emscripten_bind_DracoUInt32Array_DracoUInt32Array_0 = a.asm.za).apply(null, arguments);
        }, cc = a._emscripten_bind_DracoUInt32Array_GetValue_1 = function() {
          return (cc = a._emscripten_bind_DracoUInt32Array_GetValue_1 = a.asm.Aa).apply(null, arguments);
        }, dc = a._emscripten_bind_DracoUInt32Array_size_0 = function() {
          return (dc = a._emscripten_bind_DracoUInt32Array_size_0 = a.asm.Ba).apply(null, arguments);
        }, ec = a._emscripten_bind_DracoUInt32Array___destroy___0 = function() {
          return (ec = a._emscripten_bind_DracoUInt32Array___destroy___0 = a.asm.Ca).apply(null, arguments);
        }, Ta = a._emscripten_bind_MetadataQuerier_MetadataQuerier_0 = function() {
          return (Ta = a._emscripten_bind_MetadataQuerier_MetadataQuerier_0 = a.asm.Da).apply(null, arguments);
        }, fc = a._emscripten_bind_MetadataQuerier_HasEntry_2 = function() {
          return (fc = a._emscripten_bind_MetadataQuerier_HasEntry_2 = a.asm.Ea).apply(null, arguments);
        }, gc = a._emscripten_bind_MetadataQuerier_GetIntEntry_2 = function() {
          return (gc = a._emscripten_bind_MetadataQuerier_GetIntEntry_2 = a.asm.Fa).apply(null, arguments);
        }, hc = a._emscripten_bind_MetadataQuerier_GetIntEntryArray_3 = function() {
          return (hc = a._emscripten_bind_MetadataQuerier_GetIntEntryArray_3 = a.asm.Ga).apply(null, arguments);
        }, ic = a._emscripten_bind_MetadataQuerier_GetDoubleEntry_2 = function() {
          return (ic = a._emscripten_bind_MetadataQuerier_GetDoubleEntry_2 = a.asm.Ha).apply(null, arguments);
        }, jc = a._emscripten_bind_MetadataQuerier_GetStringEntry_2 = function() {
          return (jc = a._emscripten_bind_MetadataQuerier_GetStringEntry_2 = a.asm.Ia).apply(null, arguments);
        }, kc = a._emscripten_bind_MetadataQuerier_NumEntries_1 = function() {
          return (kc = a._emscripten_bind_MetadataQuerier_NumEntries_1 = a.asm.Ja).apply(null, arguments);
        }, lc = a._emscripten_bind_MetadataQuerier_GetEntryName_2 = function() {
          return (lc = a._emscripten_bind_MetadataQuerier_GetEntryName_2 = a.asm.Ka).apply(null, arguments);
        }, mc = a._emscripten_bind_MetadataQuerier___destroy___0 = function() {
          return (mc = a._emscripten_bind_MetadataQuerier___destroy___0 = a.asm.La).apply(null, arguments);
        }, Ua = a._emscripten_bind_Decoder_Decoder_0 = function() {
          return (Ua = a._emscripten_bind_Decoder_Decoder_0 = a.asm.Ma).apply(null, arguments);
        }, nc = a._emscripten_bind_Decoder_DecodeArrayToPointCloud_3 = function() {
          return (nc = a._emscripten_bind_Decoder_DecodeArrayToPointCloud_3 = a.asm.Na).apply(null, arguments);
        }, oc = a._emscripten_bind_Decoder_DecodeArrayToMesh_3 = function() {
          return (oc = a._emscripten_bind_Decoder_DecodeArrayToMesh_3 = a.asm.Oa).apply(null, arguments);
        }, pc = a._emscripten_bind_Decoder_GetAttributeId_2 = function() {
          return (pc = a._emscripten_bind_Decoder_GetAttributeId_2 = a.asm.Pa).apply(null, arguments);
        }, qc = a._emscripten_bind_Decoder_GetAttributeIdByName_2 = function() {
          return (qc = a._emscripten_bind_Decoder_GetAttributeIdByName_2 = a.asm.Qa).apply(null, arguments);
        }, rc = a._emscripten_bind_Decoder_GetAttributeIdByMetadataEntry_3 = function() {
          return (rc = a._emscripten_bind_Decoder_GetAttributeIdByMetadataEntry_3 = a.asm.Ra).apply(null, arguments);
        }, sc = a._emscripten_bind_Decoder_GetAttribute_2 = function() {
          return (sc = a._emscripten_bind_Decoder_GetAttribute_2 = a.asm.Sa).apply(null, arguments);
        }, tc = a._emscripten_bind_Decoder_GetAttributeByUniqueId_2 = function() {
          return (tc = a._emscripten_bind_Decoder_GetAttributeByUniqueId_2 = a.asm.Ta).apply(null, arguments);
        }, uc = a._emscripten_bind_Decoder_GetMetadata_1 = function() {
          return (uc = a._emscripten_bind_Decoder_GetMetadata_1 = a.asm.Ua).apply(null, arguments);
        }, vc = a._emscripten_bind_Decoder_GetAttributeMetadata_2 = function() {
          return (vc = a._emscripten_bind_Decoder_GetAttributeMetadata_2 = a.asm.Va).apply(null, arguments);
        }, wc = a._emscripten_bind_Decoder_GetFaceFromMesh_3 = function() {
          return (wc = a._emscripten_bind_Decoder_GetFaceFromMesh_3 = a.asm.Wa).apply(null, arguments);
        }, xc = a._emscripten_bind_Decoder_GetTriangleStripsFromMesh_2 = function() {
          return (xc = a._emscripten_bind_Decoder_GetTriangleStripsFromMesh_2 = a.asm.Xa).apply(null, arguments);
        }, yc = a._emscripten_bind_Decoder_GetTrianglesUInt16Array_3 = function() {
          return (yc = a._emscripten_bind_Decoder_GetTrianglesUInt16Array_3 = a.asm.Ya).apply(null, arguments);
        }, zc = a._emscripten_bind_Decoder_GetTrianglesUInt32Array_3 = function() {
          return (zc = a._emscripten_bind_Decoder_GetTrianglesUInt32Array_3 = a.asm.Za).apply(null, arguments);
        }, Ac = a._emscripten_bind_Decoder_GetAttributeFloat_3 = function() {
          return (Ac = a._emscripten_bind_Decoder_GetAttributeFloat_3 = a.asm._a).apply(null, arguments);
        }, Bc = a._emscripten_bind_Decoder_GetAttributeFloatForAllPoints_3 = function() {
          return (Bc = a._emscripten_bind_Decoder_GetAttributeFloatForAllPoints_3 = a.asm.$a).apply(null, arguments);
        }, Cc = a._emscripten_bind_Decoder_GetAttributeIntForAllPoints_3 = function() {
          return (Cc = a._emscripten_bind_Decoder_GetAttributeIntForAllPoints_3 = a.asm.ab).apply(null, arguments);
        }, Dc = a._emscripten_bind_Decoder_GetAttributeInt8ForAllPoints_3 = function() {
          return (Dc = a._emscripten_bind_Decoder_GetAttributeInt8ForAllPoints_3 = a.asm.bb).apply(null, arguments);
        }, Ec = a._emscripten_bind_Decoder_GetAttributeUInt8ForAllPoints_3 = function() {
          return (Ec = a._emscripten_bind_Decoder_GetAttributeUInt8ForAllPoints_3 = a.asm.cb).apply(null, arguments);
        }, Fc = a._emscripten_bind_Decoder_GetAttributeInt16ForAllPoints_3 = function() {
          return (Fc = a._emscripten_bind_Decoder_GetAttributeInt16ForAllPoints_3 = a.asm.db).apply(null, arguments);
        }, Gc = a._emscripten_bind_Decoder_GetAttributeUInt16ForAllPoints_3 = function() {
          return (Gc = a._emscripten_bind_Decoder_GetAttributeUInt16ForAllPoints_3 = a.asm.eb).apply(null, arguments);
        }, Hc = a._emscripten_bind_Decoder_GetAttributeInt32ForAllPoints_3 = function() {
          return (Hc = a._emscripten_bind_Decoder_GetAttributeInt32ForAllPoints_3 = a.asm.fb).apply(null, arguments);
        }, Ic = a._emscripten_bind_Decoder_GetAttributeUInt32ForAllPoints_3 = function() {
          return (Ic = a._emscripten_bind_Decoder_GetAttributeUInt32ForAllPoints_3 = a.asm.gb).apply(null, arguments);
        }, Jc = a._emscripten_bind_Decoder_GetAttributeDataArrayForAllPoints_5 = function() {
          return (Jc = a._emscripten_bind_Decoder_GetAttributeDataArrayForAllPoints_5 = a.asm.hb).apply(null, arguments);
        }, Kc = a._emscripten_bind_Decoder_SkipAttributeTransform_1 = function() {
          return (Kc = a._emscripten_bind_Decoder_SkipAttributeTransform_1 = a.asm.ib).apply(null, arguments);
        }, Lc = a._emscripten_bind_Decoder_GetEncodedGeometryType_Deprecated_1 = function() {
          return (Lc = a._emscripten_bind_Decoder_GetEncodedGeometryType_Deprecated_1 = a.asm.jb).apply(null, arguments);
        }, Mc = a._emscripten_bind_Decoder_DecodeBufferToPointCloud_2 = function() {
          return (Mc = a._emscripten_bind_Decoder_DecodeBufferToPointCloud_2 = a.asm.kb).apply(null, arguments);
        }, Nc = a._emscripten_bind_Decoder_DecodeBufferToMesh_2 = function() {
          return (Nc = a._emscripten_bind_Decoder_DecodeBufferToMesh_2 = a.asm.lb).apply(null, arguments);
        }, Oc = a._emscripten_bind_Decoder___destroy___0 = function() {
          return (Oc = a._emscripten_bind_Decoder___destroy___0 = a.asm.mb).apply(null, arguments);
        }, Pc = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_INVALID_TRANSFORM = function() {
          return (Pc = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_INVALID_TRANSFORM = a.asm.nb).apply(null, arguments);
        }, Qc = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_NO_TRANSFORM = function() {
          return (Qc = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_NO_TRANSFORM = a.asm.ob).apply(null, arguments);
        }, Rc = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_QUANTIZATION_TRANSFORM = function() {
          return (Rc = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_QUANTIZATION_TRANSFORM = a.asm.pb).apply(null, arguments);
        }, Sc = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_OCTAHEDRON_TRANSFORM = function() {
          return (Sc = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_OCTAHEDRON_TRANSFORM = a.asm.qb).apply(null, arguments);
        }, Tc = a._emscripten_enum_draco_GeometryAttribute_Type_INVALID = function() {
          return (Tc = a._emscripten_enum_draco_GeometryAttribute_Type_INVALID = a.asm.rb).apply(null, arguments);
        }, Uc = a._emscripten_enum_draco_GeometryAttribute_Type_POSITION = function() {
          return (Uc = a._emscripten_enum_draco_GeometryAttribute_Type_POSITION = a.asm.sb).apply(null, arguments);
        }, Vc = a._emscripten_enum_draco_GeometryAttribute_Type_NORMAL = function() {
          return (Vc = a._emscripten_enum_draco_GeometryAttribute_Type_NORMAL = a.asm.tb).apply(null, arguments);
        }, Wc = a._emscripten_enum_draco_GeometryAttribute_Type_COLOR = function() {
          return (Wc = a._emscripten_enum_draco_GeometryAttribute_Type_COLOR = a.asm.ub).apply(null, arguments);
        }, Xc = a._emscripten_enum_draco_GeometryAttribute_Type_TEX_COORD = function() {
          return (Xc = a._emscripten_enum_draco_GeometryAttribute_Type_TEX_COORD = a.asm.vb).apply(null, arguments);
        }, Yc = a._emscripten_enum_draco_GeometryAttribute_Type_GENERIC = function() {
          return (Yc = a._emscripten_enum_draco_GeometryAttribute_Type_GENERIC = a.asm.wb).apply(null, arguments);
        }, Zc = a._emscripten_enum_draco_EncodedGeometryType_INVALID_GEOMETRY_TYPE = function() {
          return (Zc = a._emscripten_enum_draco_EncodedGeometryType_INVALID_GEOMETRY_TYPE = a.asm.xb).apply(null, arguments);
        }, $c = a._emscripten_enum_draco_EncodedGeometryType_POINT_CLOUD = function() {
          return ($c = a._emscripten_enum_draco_EncodedGeometryType_POINT_CLOUD = a.asm.yb).apply(null, arguments);
        }, ad = a._emscripten_enum_draco_EncodedGeometryType_TRIANGULAR_MESH = function() {
          return (ad = a._emscripten_enum_draco_EncodedGeometryType_TRIANGULAR_MESH = a.asm.zb).apply(null, arguments);
        }, bd = a._emscripten_enum_draco_DataType_DT_INVALID = function() {
          return (bd = a._emscripten_enum_draco_DataType_DT_INVALID = a.asm.Ab).apply(null, arguments);
        }, cd = a._emscripten_enum_draco_DataType_DT_INT8 = function() {
          return (cd = a._emscripten_enum_draco_DataType_DT_INT8 = a.asm.Bb).apply(null, arguments);
        }, dd = a._emscripten_enum_draco_DataType_DT_UINT8 = function() {
          return (dd = a._emscripten_enum_draco_DataType_DT_UINT8 = a.asm.Cb).apply(null, arguments);
        }, ed = a._emscripten_enum_draco_DataType_DT_INT16 = function() {
          return (ed = a._emscripten_enum_draco_DataType_DT_INT16 = a.asm.Db).apply(null, arguments);
        }, fd = a._emscripten_enum_draco_DataType_DT_UINT16 = function() {
          return (fd = a._emscripten_enum_draco_DataType_DT_UINT16 = a.asm.Eb).apply(null, arguments);
        }, gd = a._emscripten_enum_draco_DataType_DT_INT32 = function() {
          return (gd = a._emscripten_enum_draco_DataType_DT_INT32 = a.asm.Fb).apply(null, arguments);
        }, hd = a._emscripten_enum_draco_DataType_DT_UINT32 = function() {
          return (hd = a._emscripten_enum_draco_DataType_DT_UINT32 = a.asm.Gb).apply(null, arguments);
        }, id = a._emscripten_enum_draco_DataType_DT_INT64 = function() {
          return (id = a._emscripten_enum_draco_DataType_DT_INT64 = a.asm.Hb).apply(null, arguments);
        }, jd = a._emscripten_enum_draco_DataType_DT_UINT64 = function() {
          return (jd = a._emscripten_enum_draco_DataType_DT_UINT64 = a.asm.Ib).apply(null, arguments);
        }, kd = a._emscripten_enum_draco_DataType_DT_FLOAT32 = function() {
          return (kd = a._emscripten_enum_draco_DataType_DT_FLOAT32 = a.asm.Jb).apply(
            null,
            arguments
          );
        }, ld = a._emscripten_enum_draco_DataType_DT_FLOAT64 = function() {
          return (ld = a._emscripten_enum_draco_DataType_DT_FLOAT64 = a.asm.Kb).apply(null, arguments);
        }, md = a._emscripten_enum_draco_DataType_DT_BOOL = function() {
          return (md = a._emscripten_enum_draco_DataType_DT_BOOL = a.asm.Lb).apply(null, arguments);
        }, nd = a._emscripten_enum_draco_DataType_DT_TYPES_COUNT = function() {
          return (nd = a._emscripten_enum_draco_DataType_DT_TYPES_COUNT = a.asm.Mb).apply(null, arguments);
        }, od = a._emscripten_enum_draco_StatusCode_OK = function() {
          return (od = a._emscripten_enum_draco_StatusCode_OK = a.asm.Nb).apply(null, arguments);
        }, pd = a._emscripten_enum_draco_StatusCode_DRACO_ERROR = function() {
          return (pd = a._emscripten_enum_draco_StatusCode_DRACO_ERROR = a.asm.Ob).apply(null, arguments);
        }, qd = a._emscripten_enum_draco_StatusCode_IO_ERROR = function() {
          return (qd = a._emscripten_enum_draco_StatusCode_IO_ERROR = a.asm.Pb).apply(null, arguments);
        }, rd = a._emscripten_enum_draco_StatusCode_INVALID_PARAMETER = function() {
          return (rd = a._emscripten_enum_draco_StatusCode_INVALID_PARAMETER = a.asm.Qb).apply(null, arguments);
        }, sd = a._emscripten_enum_draco_StatusCode_UNSUPPORTED_VERSION = function() {
          return (sd = a._emscripten_enum_draco_StatusCode_UNSUPPORTED_VERSION = a.asm.Rb).apply(null, arguments);
        }, td = a._emscripten_enum_draco_StatusCode_UNKNOWN_VERSION = function() {
          return (td = a._emscripten_enum_draco_StatusCode_UNKNOWN_VERSION = a.asm.Sb).apply(null, arguments);
        };
        a._malloc = function() {
          return (a._malloc = a.asm.Tb).apply(null, arguments);
        };
        a._free = function() {
          return (a._free = a.asm.Ub).apply(null, arguments);
        };
        var ya = function() {
          return (ya = a.asm.Vb).apply(null, arguments);
        };
        a.___start_em_js = 15856;
        a.___stop_em_js = 15954;
        var la;
        ia = function b() {
          la || ba();
          la || (ia = b);
        };
        if (a.preInit) for ("function" == typeof a.preInit && (a.preInit = [a.preInit]); 0 < a.preInit.length; ) a.preInit.pop()();
        ba();
        t.prototype = Object.create(t.prototype);
        t.prototype.constructor = t;
        t.prototype.__class__ = t;
        t.__cache__ = {};
        a.WrapperObject = t;
        a.getCache = x;
        a.wrapPointer = D;
        a.castObject = function(b, c) {
          return D(b.ptr, c);
        };
        a.NULL = D(0);
        a.destroy = function(b) {
          if (!b.__destroy__) throw "Error: Cannot destroy object. (Did you create it yourself?)";
          b.__destroy__();
          delete x(b.__class__)[b.ptr];
        };
        a.compare = function(b, c) {
          return b.ptr === c.ptr;
        };
        a.getPointer = function(b) {
          return b.ptr;
        };
        a.getClass = function(b) {
          return b.__class__;
        };
        var r = { buffer: 0, size: 0, pos: 0, temps: [], needed: 0, prepare: function() {
          if (r.needed) {
            for (var b = 0; b < r.temps.length; b++) a._free(r.temps[b]);
            r.temps.length = 0;
            a._free(r.buffer);
            r.buffer = 0;
            r.size += r.needed;
            r.needed = 0;
          }
          r.buffer || (r.size += 128, r.buffer = a._malloc(r.size), r.buffer || f(void 0));
          r.pos = 0;
        }, alloc: function(b, c) {
          r.buffer || f(void 0);
          b = b.length * c.BYTES_PER_ELEMENT;
          b = b + 7 & -8;
          r.pos + b >= r.size ? (0 < b || f(void 0), r.needed += b, c = a._malloc(b), r.temps.push(c)) : (c = r.buffer + r.pos, r.pos += b);
          return c;
        }, copy: function(b, c, d) {
          d >>>= 0;
          switch (c.BYTES_PER_ELEMENT) {
            case 2:
              d >>>= 1;
              break;
            case 4:
              d >>>= 2;
              break;
            case 8:
              d >>>= 3;
          }
          for (var g = 0; g < b.length; g++) c[d + g] = b[g];
        } };
        Z.prototype = Object.create(t.prototype);
        Z.prototype.constructor = Z;
        Z.prototype.__class__ = Z;
        Z.__cache__ = {};
        a.VoidPtr = Z;
        Z.prototype.__destroy__ = Z.prototype.__destroy__ = function() {
          bb(this.ptr);
        };
        S.prototype = Object.create(t.prototype);
        S.prototype.constructor = S;
        S.prototype.__class__ = S;
        S.__cache__ = {};
        a.DecoderBuffer = S;
        S.prototype.Init = S.prototype.Init = function(b, c) {
          var d = this.ptr;
          r.prepare();
          "object" == typeof b && (b = pa(b));
          c && "object" === typeof c && (c = c.ptr);
          cb(d, b, c);
        };
        S.prototype.__destroy__ = S.prototype.__destroy__ = function() {
          db(this.ptr);
        };
        Q.prototype = Object.create(t.prototype);
        Q.prototype.constructor = Q;
        Q.prototype.__class__ = Q;
        Q.__cache__ = {};
        a.AttributeTransformData = Q;
        Q.prototype.transform_type = Q.prototype.transform_type = function() {
          return eb(this.ptr);
        };
        Q.prototype.__destroy__ = Q.prototype.__destroy__ = function() {
          fb(this.ptr);
        };
        W.prototype = Object.create(t.prototype);
        W.prototype.constructor = W;
        W.prototype.__class__ = W;
        W.__cache__ = {};
        a.GeometryAttribute = W;
        W.prototype.__destroy__ = W.prototype.__destroy__ = function() {
          gb(this.ptr);
        };
        w.prototype = Object.create(t.prototype);
        w.prototype.constructor = w;
        w.prototype.__class__ = w;
        w.__cache__ = {};
        a.PointAttribute = w;
        w.prototype.size = w.prototype.size = function() {
          return hb(this.ptr);
        };
        w.prototype.GetAttributeTransformData = w.prototype.GetAttributeTransformData = function() {
          return D(ib(this.ptr), Q);
        };
        w.prototype.attribute_type = w.prototype.attribute_type = function() {
          return jb(this.ptr);
        };
        w.prototype.data_type = w.prototype.data_type = function() {
          return kb(this.ptr);
        };
        w.prototype.num_components = w.prototype.num_components = function() {
          return lb(this.ptr);
        };
        w.prototype.normalized = w.prototype.normalized = function() {
          return !!mb(this.ptr);
        };
        w.prototype.byte_stride = w.prototype.byte_stride = function() {
          return nb(this.ptr);
        };
        w.prototype.byte_offset = w.prototype.byte_offset = function() {
          return ob(this.ptr);
        };
        w.prototype.unique_id = w.prototype.unique_id = function() {
          return pb(this.ptr);
        };
        w.prototype.__destroy__ = w.prototype.__destroy__ = function() {
          qb(this.ptr);
        };
        C.prototype = Object.create(t.prototype);
        C.prototype.constructor = C;
        C.prototype.__class__ = C;
        C.__cache__ = {};
        a.AttributeQuantizationTransform = C;
        C.prototype.InitFromAttribute = C.prototype.InitFromAttribute = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          return !!rb(c, b);
        };
        C.prototype.quantization_bits = C.prototype.quantization_bits = function() {
          return sb(this.ptr);
        };
        C.prototype.min_value = C.prototype.min_value = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          return tb(c, b);
        };
        C.prototype.range = C.prototype.range = function() {
          return ub(this.ptr);
        };
        C.prototype.__destroy__ = C.prototype.__destroy__ = function() {
          vb(this.ptr);
        };
        F.prototype = Object.create(t.prototype);
        F.prototype.constructor = F;
        F.prototype.__class__ = F;
        F.__cache__ = {};
        a.AttributeOctahedronTransform = F;
        F.prototype.InitFromAttribute = F.prototype.InitFromAttribute = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          return !!wb(c, b);
        };
        F.prototype.quantization_bits = F.prototype.quantization_bits = function() {
          return xb(this.ptr);
        };
        F.prototype.__destroy__ = F.prototype.__destroy__ = function() {
          yb(this.ptr);
        };
        G.prototype = Object.create(t.prototype);
        G.prototype.constructor = G;
        G.prototype.__class__ = G;
        G.__cache__ = {};
        a.PointCloud = G;
        G.prototype.num_attributes = G.prototype.num_attributes = function() {
          return zb(this.ptr);
        };
        G.prototype.num_points = G.prototype.num_points = function() {
          return Ab(this.ptr);
        };
        G.prototype.__destroy__ = G.prototype.__destroy__ = function() {
          Bb(this.ptr);
        };
        E.prototype = Object.create(t.prototype);
        E.prototype.constructor = E;
        E.prototype.__class__ = E;
        E.__cache__ = {};
        a.Mesh = E;
        E.prototype.num_faces = E.prototype.num_faces = function() {
          return Cb(this.ptr);
        };
        E.prototype.num_attributes = E.prototype.num_attributes = function() {
          return Db(this.ptr);
        };
        E.prototype.num_points = E.prototype.num_points = function() {
          return Eb(this.ptr);
        };
        E.prototype.__destroy__ = E.prototype.__destroy__ = function() {
          Fb(this.ptr);
        };
        T.prototype = Object.create(t.prototype);
        T.prototype.constructor = T;
        T.prototype.__class__ = T;
        T.__cache__ = {};
        a.Metadata = T;
        T.prototype.__destroy__ = T.prototype.__destroy__ = function() {
          Gb(this.ptr);
        };
        B.prototype = Object.create(t.prototype);
        B.prototype.constructor = B;
        B.prototype.__class__ = B;
        B.__cache__ = {};
        a.Status = B;
        B.prototype.code = B.prototype.code = function() {
          return Hb(this.ptr);
        };
        B.prototype.ok = B.prototype.ok = function() {
          return !!Ib(this.ptr);
        };
        B.prototype.error_msg = B.prototype.error_msg = function() {
          return h(Jb(this.ptr));
        };
        B.prototype.__destroy__ = B.prototype.__destroy__ = function() {
          Kb(this.ptr);
        };
        H.prototype = Object.create(t.prototype);
        H.prototype.constructor = H;
        H.prototype.__class__ = H;
        H.__cache__ = {};
        a.DracoFloat32Array = H;
        H.prototype.GetValue = H.prototype.GetValue = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          return Lb(c, b);
        };
        H.prototype.size = H.prototype.size = function() {
          return Mb(this.ptr);
        };
        H.prototype.__destroy__ = H.prototype.__destroy__ = function() {
          Nb(this.ptr);
        };
        I.prototype = Object.create(t.prototype);
        I.prototype.constructor = I;
        I.prototype.__class__ = I;
        I.__cache__ = {};
        a.DracoInt8Array = I;
        I.prototype.GetValue = I.prototype.GetValue = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          return Ob(c, b);
        };
        I.prototype.size = I.prototype.size = function() {
          return Pb(this.ptr);
        };
        I.prototype.__destroy__ = I.prototype.__destroy__ = function() {
          Qb(this.ptr);
        };
        J.prototype = Object.create(t.prototype);
        J.prototype.constructor = J;
        J.prototype.__class__ = J;
        J.__cache__ = {};
        a.DracoUInt8Array = J;
        J.prototype.GetValue = J.prototype.GetValue = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          return Rb(c, b);
        };
        J.prototype.size = J.prototype.size = function() {
          return Sb(this.ptr);
        };
        J.prototype.__destroy__ = J.prototype.__destroy__ = function() {
          Tb(this.ptr);
        };
        K.prototype = Object.create(t.prototype);
        K.prototype.constructor = K;
        K.prototype.__class__ = K;
        K.__cache__ = {};
        a.DracoInt16Array = K;
        K.prototype.GetValue = K.prototype.GetValue = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          return Ub(c, b);
        };
        K.prototype.size = K.prototype.size = function() {
          return Vb(this.ptr);
        };
        K.prototype.__destroy__ = K.prototype.__destroy__ = function() {
          Wb(this.ptr);
        };
        L.prototype = Object.create(t.prototype);
        L.prototype.constructor = L;
        L.prototype.__class__ = L;
        L.__cache__ = {};
        a.DracoUInt16Array = L;
        L.prototype.GetValue = L.prototype.GetValue = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          return Xb(c, b);
        };
        L.prototype.size = L.prototype.size = function() {
          return Yb(this.ptr);
        };
        L.prototype.__destroy__ = L.prototype.__destroy__ = function() {
          Zb(this.ptr);
        };
        M.prototype = Object.create(t.prototype);
        M.prototype.constructor = M;
        M.prototype.__class__ = M;
        M.__cache__ = {};
        a.DracoInt32Array = M;
        M.prototype.GetValue = M.prototype.GetValue = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          return $b(c, b);
        };
        M.prototype.size = M.prototype.size = function() {
          return ac(this.ptr);
        };
        M.prototype.__destroy__ = M.prototype.__destroy__ = function() {
          bc(this.ptr);
        };
        N.prototype = Object.create(t.prototype);
        N.prototype.constructor = N;
        N.prototype.__class__ = N;
        N.__cache__ = {};
        a.DracoUInt32Array = N;
        N.prototype.GetValue = N.prototype.GetValue = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          return cc(c, b);
        };
        N.prototype.size = N.prototype.size = function() {
          return dc(this.ptr);
        };
        N.prototype.__destroy__ = N.prototype.__destroy__ = function() {
          ec(this.ptr);
        };
        y.prototype = Object.create(t.prototype);
        y.prototype.constructor = y;
        y.prototype.__class__ = y;
        y.__cache__ = {};
        a.MetadataQuerier = y;
        y.prototype.HasEntry = y.prototype.HasEntry = function(b, c) {
          var d = this.ptr;
          r.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c = c && "object" === typeof c ? c.ptr : R(c);
          return !!fc(d, b, c);
        };
        y.prototype.GetIntEntry = y.prototype.GetIntEntry = function(b, c) {
          var d = this.ptr;
          r.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c = c && "object" === typeof c ? c.ptr : R(c);
          return gc(d, b, c);
        };
        y.prototype.GetIntEntryArray = y.prototype.GetIntEntryArray = function(b, c, d) {
          var g = this.ptr;
          r.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c = c && "object" === typeof c ? c.ptr : R(c);
          d && "object" === typeof d && (d = d.ptr);
          hc(g, b, c, d);
        };
        y.prototype.GetDoubleEntry = y.prototype.GetDoubleEntry = function(b, c) {
          var d = this.ptr;
          r.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c = c && "object" === typeof c ? c.ptr : R(c);
          return ic(d, b, c);
        };
        y.prototype.GetStringEntry = y.prototype.GetStringEntry = function(b, c) {
          var d = this.ptr;
          r.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c = c && "object" === typeof c ? c.ptr : R(c);
          return h(jc(d, b, c));
        };
        y.prototype.NumEntries = y.prototype.NumEntries = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          return kc(c, b);
        };
        y.prototype.GetEntryName = y.prototype.GetEntryName = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          return h(lc(d, b, c));
        };
        y.prototype.__destroy__ = y.prototype.__destroy__ = function() {
          mc(this.ptr);
        };
        m.prototype = Object.create(t.prototype);
        m.prototype.constructor = m;
        m.prototype.__class__ = m;
        m.__cache__ = {};
        a.Decoder = m;
        m.prototype.DecodeArrayToPointCloud = m.prototype.DecodeArrayToPointCloud = function(b, c, d) {
          var g = this.ptr;
          r.prepare();
          "object" == typeof b && (b = pa(b));
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return D(nc(g, b, c, d), B);
        };
        m.prototype.DecodeArrayToMesh = m.prototype.DecodeArrayToMesh = function(b, c, d) {
          var g = this.ptr;
          r.prepare();
          "object" == typeof b && (b = pa(b));
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return D(oc(g, b, c, d), B);
        };
        m.prototype.GetAttributeId = m.prototype.GetAttributeId = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          return pc(d, b, c);
        };
        m.prototype.GetAttributeIdByName = m.prototype.GetAttributeIdByName = function(b, c) {
          var d = this.ptr;
          r.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c = c && "object" === typeof c ? c.ptr : R(c);
          return qc(d, b, c);
        };
        m.prototype.GetAttributeIdByMetadataEntry = m.prototype.GetAttributeIdByMetadataEntry = function(b, c, d) {
          var g = this.ptr;
          r.prepare();
          b && "object" === typeof b && (b = b.ptr);
          c = c && "object" === typeof c ? c.ptr : R(c);
          d = d && "object" === typeof d ? d.ptr : R(d);
          return rc(g, b, c, d);
        };
        m.prototype.GetAttribute = m.prototype.GetAttribute = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          return D(sc(d, b, c), w);
        };
        m.prototype.GetAttributeByUniqueId = m.prototype.GetAttributeByUniqueId = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          return D(tc(d, b, c), w);
        };
        m.prototype.GetMetadata = m.prototype.GetMetadata = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          return D(uc(c, b), T);
        };
        m.prototype.GetAttributeMetadata = m.prototype.GetAttributeMetadata = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          return D(vc(d, b, c), T);
        };
        m.prototype.GetFaceFromMesh = m.prototype.GetFaceFromMesh = function(b, c, d) {
          var g = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!wc(g, b, c, d);
        };
        m.prototype.GetTriangleStripsFromMesh = m.prototype.GetTriangleStripsFromMesh = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          return xc(d, b, c);
        };
        m.prototype.GetTrianglesUInt16Array = m.prototype.GetTrianglesUInt16Array = function(b, c, d) {
          var g = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!yc(g, b, c, d);
        };
        m.prototype.GetTrianglesUInt32Array = m.prototype.GetTrianglesUInt32Array = function(b, c, d) {
          var g = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!zc(g, b, c, d);
        };
        m.prototype.GetAttributeFloat = m.prototype.GetAttributeFloat = function(b, c, d) {
          var g = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!Ac(g, b, c, d);
        };
        m.prototype.GetAttributeFloatForAllPoints = m.prototype.GetAttributeFloatForAllPoints = function(b, c, d) {
          var g = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!Bc(g, b, c, d);
        };
        m.prototype.GetAttributeIntForAllPoints = m.prototype.GetAttributeIntForAllPoints = function(b, c, d) {
          var g = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!Cc(g, b, c, d);
        };
        m.prototype.GetAttributeInt8ForAllPoints = m.prototype.GetAttributeInt8ForAllPoints = function(b, c, d) {
          var g = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!Dc(g, b, c, d);
        };
        m.prototype.GetAttributeUInt8ForAllPoints = m.prototype.GetAttributeUInt8ForAllPoints = function(b, c, d) {
          var g = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!Ec(g, b, c, d);
        };
        m.prototype.GetAttributeInt16ForAllPoints = m.prototype.GetAttributeInt16ForAllPoints = function(b, c, d) {
          var g = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!Fc(g, b, c, d);
        };
        m.prototype.GetAttributeUInt16ForAllPoints = m.prototype.GetAttributeUInt16ForAllPoints = function(b, c, d) {
          var g = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!Gc(g, b, c, d);
        };
        m.prototype.GetAttributeInt32ForAllPoints = m.prototype.GetAttributeInt32ForAllPoints = function(b, c, d) {
          var g = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!Hc(g, b, c, d);
        };
        m.prototype.GetAttributeUInt32ForAllPoints = m.prototype.GetAttributeUInt32ForAllPoints = function(b, c, d) {
          var g = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          return !!Ic(g, b, c, d);
        };
        m.prototype.GetAttributeDataArrayForAllPoints = m.prototype.GetAttributeDataArrayForAllPoints = function(b, c, d, g, u) {
          var X = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          d && "object" === typeof d && (d = d.ptr);
          g && "object" === typeof g && (g = g.ptr);
          u && "object" === typeof u && (u = u.ptr);
          return !!Jc(X, b, c, d, g, u);
        };
        m.prototype.SkipAttributeTransform = m.prototype.SkipAttributeTransform = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          Kc(c, b);
        };
        m.prototype.GetEncodedGeometryType_Deprecated = m.prototype.GetEncodedGeometryType_Deprecated = function(b) {
          var c = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          return Lc(c, b);
        };
        m.prototype.DecodeBufferToPointCloud = m.prototype.DecodeBufferToPointCloud = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          return D(Mc(d, b, c), B);
        };
        m.prototype.DecodeBufferToMesh = m.prototype.DecodeBufferToMesh = function(b, c) {
          var d = this.ptr;
          b && "object" === typeof b && (b = b.ptr);
          c && "object" === typeof c && (c = c.ptr);
          return D(Nc(d, b, c), B);
        };
        m.prototype.__destroy__ = m.prototype.__destroy__ = function() {
          Oc(this.ptr);
        };
        (function() {
          function b() {
            a.ATTRIBUTE_INVALID_TRANSFORM = Pc();
            a.ATTRIBUTE_NO_TRANSFORM = Qc();
            a.ATTRIBUTE_QUANTIZATION_TRANSFORM = Rc();
            a.ATTRIBUTE_OCTAHEDRON_TRANSFORM = Sc();
            a.INVALID = Tc();
            a.POSITION = Uc();
            a.NORMAL = Vc();
            a.COLOR = Wc();
            a.TEX_COORD = Xc();
            a.GENERIC = Yc();
            a.INVALID_GEOMETRY_TYPE = Zc();
            a.POINT_CLOUD = $c();
            a.TRIANGULAR_MESH = ad();
            a.DT_INVALID = bd();
            a.DT_INT8 = cd();
            a.DT_UINT8 = dd();
            a.DT_INT16 = ed();
            a.DT_UINT16 = fd();
            a.DT_INT32 = gd();
            a.DT_UINT32 = hd();
            a.DT_INT64 = id();
            a.DT_UINT64 = jd();
            a.DT_FLOAT32 = kd();
            a.DT_FLOAT64 = ld();
            a.DT_BOOL = md();
            a.DT_TYPES_COUNT = nd();
            a.OK = od();
            a.DRACO_ERROR = pd();
            a.IO_ERROR = qd();
            a.INVALID_PARAMETER = rd();
            a.UNSUPPORTED_VERSION = sd();
            a.UNKNOWN_VERSION = td();
          }
          za ? b() : oa.unshift(b);
        })();
        if ("function" === typeof a.onModuleParsed) a.onModuleParsed();
        a.Decoder.prototype.GetEncodedGeometryType = function(b) {
          if (b.__class__ && b.__class__ === a.DecoderBuffer) return a.Decoder.prototype.GetEncodedGeometryType_Deprecated(b);
          if (8 > b.byteLength) return a.INVALID_GEOMETRY_TYPE;
          switch (b[7]) {
            case 0:
              return a.POINT_CLOUD;
            case 1:
              return a.TRIANGULAR_MESH;
            default:
              return a.INVALID_GEOMETRY_TYPE;
          }
        };
        return n.ready;
      };
    })();
    "object" === typeof exports2 && "object" === typeof module2 ? module2.exports = DracoDecoderModule : "function" === typeof define && define.amd ? define([], function() {
      return DracoDecoderModule;
    }) : "object" === typeof exports2 && (exports2.DracoDecoderModule = DracoDecoderModule);
  }
});

// node_modules/draco3d/draco3d.js
var require_draco3d = __commonJS({
  "node_modules/draco3d/draco3d.js"(exports2, module2) {
    var createEncoderModule = require_draco_encoder_nodejs();
    var createDecoderModule = require_draco_decoder_nodejs();
    module2.exports = {
      createEncoderModule,
      createDecoderModule
    };
  }
});

// libktx.js
var libktx_exports = {};
var init_libktx = __esm({
  "libktx.js"() {
    window.LIBKTX = (function() {
      var _scriptDir = typeof document !== "undefined" && document.currentScript ? document.currentScript.src : void 0;
      return (function(LIBKTX2) {
        LIBKTX2 = LIBKTX2 || {};
        var Module = typeof LIBKTX2 !== "undefined" ? LIBKTX2 : {};
        var moduleOverrides = {};
        var key;
        for (key in Module) {
          if (Module.hasOwnProperty(key)) {
            moduleOverrides[key] = Module[key];
          }
        }
        var arguments_ = [];
        var thisProgram = "./this.program";
        var quit_ = function(status, toThrow) {
          throw toThrow;
        };
        var ENVIRONMENT_IS_WEB = false;
        var ENVIRONMENT_IS_WORKER = false;
        var ENVIRONMENT_IS_NODE = false;
        var ENVIRONMENT_HAS_NODE = false;
        var ENVIRONMENT_IS_SHELL = false;
        ENVIRONMENT_IS_WEB = typeof window === "object";
        ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
        ENVIRONMENT_HAS_NODE = typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string";
        ENVIRONMENT_IS_NODE = ENVIRONMENT_HAS_NODE && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER;
        ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
        var scriptDirectory = "";
        function locateFile(path) {
          if (Module["locateFile"]) {
            return Module["locateFile"](path, scriptDirectory);
          }
          return scriptDirectory + path;
        }
        var read_, readAsync, readBinary, setWindowTitle;
        if (ENVIRONMENT_IS_NODE) {
          scriptDirectory = __dirname + "/";
          var nodeFS;
          var nodePath;
          read_ = function shell_read(filename, binary) {
            var ret;
            if (!nodeFS) nodeFS = require("fs");
            if (!nodePath) nodePath = require("path");
            filename = nodePath["normalize"](filename);
            ret = nodeFS["readFileSync"](filename);
            return binary ? ret : ret.toString();
          };
          readBinary = function readBinary2(filename) {
            var ret = read_(filename, true);
            if (!ret.buffer) {
              ret = new Uint8Array(ret);
            }
            assert(ret.buffer);
            return ret;
          };
          if (process["argv"].length > 1) {
            thisProgram = process["argv"][1].replace(/\\/g, "/");
          }
          arguments_ = process["argv"].slice(2);
          process["on"]("uncaughtException", function(ex) {
            if (!(ex instanceof ExitStatus)) {
              throw ex;
            }
          });
          process["on"]("unhandledRejection", abort);
          quit_ = function(status) {
            process["exit"](status);
          };
          Module["inspect"] = function() {
            return "[Emscripten Module object]";
          };
        } else if (ENVIRONMENT_IS_SHELL) {
          if (typeof read != "undefined") {
            read_ = function shell_read(f) {
              return read(f);
            };
          }
          readBinary = function readBinary2(f) {
            var data;
            if (typeof readbuffer === "function") {
              return new Uint8Array(readbuffer(f));
            }
            data = read(f, "binary");
            assert(typeof data === "object");
            return data;
          };
          if (typeof scriptArgs != "undefined") {
            arguments_ = scriptArgs;
          } else if (typeof arguments != "undefined") {
            arguments_ = arguments;
          }
          if (typeof quit === "function") {
            quit_ = function(status) {
              quit(status);
            };
          }
          if (typeof print !== "undefined") {
            if (typeof console === "undefined") console = {};
            console.log = print;
            console.warn = console.error = typeof printErr !== "undefined" ? printErr : print;
          }
        } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
          if (ENVIRONMENT_IS_WORKER) {
            scriptDirectory = self.location.href;
          } else if (document.currentScript) {
            scriptDirectory = document.currentScript.src;
          }
          if (_scriptDir) {
            scriptDirectory = _scriptDir;
          }
          if (scriptDirectory.indexOf("blob:") !== 0) {
            scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1);
          } else {
            scriptDirectory = "";
          }
          read_ = function shell_read(url) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, false);
            xhr.send(null);
            return xhr.responseText;
          };
          if (ENVIRONMENT_IS_WORKER) {
            readBinary = function readBinary2(url) {
              var xhr = new XMLHttpRequest();
              xhr.open("GET", url, false);
              xhr.responseType = "arraybuffer";
              xhr.send(null);
              return new Uint8Array(xhr.response);
            };
          }
          readAsync = function readAsync2(url, onload, onerror) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.responseType = "arraybuffer";
            xhr.onload = function xhr_onload() {
              if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                onload(xhr.response);
                return;
              }
              onerror();
            };
            xhr.onerror = onerror;
            xhr.send(null);
          };
          setWindowTitle = function(title) {
            document.title = title;
          };
        } else {
        }
        var out = Module["print"] || console.log.bind(console);
        var err = Module["printErr"] || console.warn.bind(console);
        for (key in moduleOverrides) {
          if (moduleOverrides.hasOwnProperty(key)) {
            Module[key] = moduleOverrides[key];
          }
        }
        moduleOverrides = null;
        if (Module["arguments"]) arguments_ = Module["arguments"];
        if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
        if (Module["quit"]) quit_ = Module["quit"];
        function dynamicAlloc(size) {
          var ret = HEAP32[DYNAMICTOP_PTR >> 2];
          var end = ret + size + 15 & -16;
          if (end > _emscripten_get_heap_size()) {
            abort();
          }
          HEAP32[DYNAMICTOP_PTR >> 2] = end;
          return ret;
        }
        function getNativeTypeSize(type) {
          switch (type) {
            case "i1":
            case "i8":
              return 1;
            case "i16":
              return 2;
            case "i32":
              return 4;
            case "i64":
              return 8;
            case "float":
              return 4;
            case "double":
              return 8;
            default: {
              if (type[type.length - 1] === "*") {
                return 4;
              } else if (type[0] === "i") {
                var bits = parseInt(type.substr(1));
                assert(bits % 8 === 0, "getNativeTypeSize invalid bits " + bits + ", type " + type);
                return bits / 8;
              } else {
                return 0;
              }
            }
          }
        }
        var asm2wasmImports = { "f64-rem": function(x, y) {
          return x % y;
        }, "debugger": function() {
        } };
        var functionPointers = new Array(0);
        var tempRet0 = 0;
        var setTempRet0 = function(value) {
          tempRet0 = value;
        };
        var wasmBinary;
        if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
        var noExitRuntime;
        if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];
        if (typeof WebAssembly !== "object") {
          err("no native wasm support detected");
        }
        function setValue(ptr, value, type, noSafe) {
          type = type || "i8";
          if (type.charAt(type.length - 1) === "*") type = "i32";
          switch (type) {
            case "i1":
              HEAP8[ptr >> 0] = value;
              break;
            case "i8":
              HEAP8[ptr >> 0] = value;
              break;
            case "i16":
              HEAP16[ptr >> 1] = value;
              break;
            case "i32":
              HEAP32[ptr >> 2] = value;
              break;
            case "i64":
              tempI64 = [value >>> 0, (tempDouble = value, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[ptr >> 2] = tempI64[0], HEAP32[ptr + 4 >> 2] = tempI64[1];
              break;
            case "float":
              HEAPF32[ptr >> 2] = value;
              break;
            case "double":
              HEAPF64[ptr >> 3] = value;
              break;
            default:
              abort("invalid type for setValue: " + type);
          }
        }
        var wasmMemory;
        var wasmTable;
        var ABORT = false;
        var EXITSTATUS = 0;
        function assert(condition, text) {
          if (!condition) {
            abort("Assertion failed: " + text);
          }
        }
        var ALLOC_NONE = 3;
        function allocate(slab, types, allocator, ptr) {
          var zeroinit, size;
          if (typeof slab === "number") {
            zeroinit = true;
            size = slab;
          } else {
            zeroinit = false;
            size = slab.length;
          }
          var singleType = typeof types === "string" ? types : null;
          var ret;
          if (allocator == ALLOC_NONE) {
            ret = ptr;
          } else {
            ret = [_malloc, stackAlloc, dynamicAlloc][allocator](Math.max(size, singleType ? 1 : types.length));
          }
          if (zeroinit) {
            var stop;
            ptr = ret;
            assert((ret & 3) == 0);
            stop = ret + (size & ~3);
            for (; ptr < stop; ptr += 4) {
              HEAP32[ptr >> 2] = 0;
            }
            stop = ret + size;
            while (ptr < stop) {
              HEAP8[ptr++ >> 0] = 0;
            }
            return ret;
          }
          if (singleType === "i8") {
            if (slab.subarray || slab.slice) {
              HEAPU8.set(slab, ret);
            } else {
              HEAPU8.set(new Uint8Array(slab), ret);
            }
            return ret;
          }
          var i2 = 0, type, typeSize, previousType;
          while (i2 < size) {
            var curr = slab[i2];
            type = singleType || types[i2];
            if (type === 0) {
              i2++;
              continue;
            }
            if (type == "i64") type = "i32";
            setValue(ret + i2, curr, type);
            if (previousType !== type) {
              typeSize = getNativeTypeSize(type);
              previousType = type;
            }
            i2 += typeSize;
          }
          return ret;
        }
        var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : void 0;
        function UTF8ArrayToString(u8Array, idx, maxBytesToRead) {
          var endIdx = idx + maxBytesToRead;
          var endPtr = idx;
          while (u8Array[endPtr] && !(endPtr >= endIdx)) ++endPtr;
          if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
            return UTF8Decoder.decode(u8Array.subarray(idx, endPtr));
          } else {
            var str = "";
            while (idx < endPtr) {
              var u0 = u8Array[idx++];
              if (!(u0 & 128)) {
                str += String.fromCharCode(u0);
                continue;
              }
              var u1 = u8Array[idx++] & 63;
              if ((u0 & 224) == 192) {
                str += String.fromCharCode((u0 & 31) << 6 | u1);
                continue;
              }
              var u2 = u8Array[idx++] & 63;
              if ((u0 & 240) == 224) {
                u0 = (u0 & 15) << 12 | u1 << 6 | u2;
              } else {
                u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | u8Array[idx++] & 63;
              }
              if (u0 < 65536) {
                str += String.fromCharCode(u0);
              } else {
                var ch = u0 - 65536;
                str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
              }
            }
          }
          return str;
        }
        function UTF8ToString(ptr, maxBytesToRead) {
          return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
        }
        function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
          if (!(maxBytesToWrite > 0)) return 0;
          var startIdx = outIdx;
          var endIdx = outIdx + maxBytesToWrite - 1;
          for (var i2 = 0; i2 < str.length; ++i2) {
            var u = str.charCodeAt(i2);
            if (u >= 55296 && u <= 57343) {
              var u1 = str.charCodeAt(++i2);
              u = 65536 + ((u & 1023) << 10) | u1 & 1023;
            }
            if (u <= 127) {
              if (outIdx >= endIdx) break;
              outU8Array[outIdx++] = u;
            } else if (u <= 2047) {
              if (outIdx + 1 >= endIdx) break;
              outU8Array[outIdx++] = 192 | u >> 6;
              outU8Array[outIdx++] = 128 | u & 63;
            } else if (u <= 65535) {
              if (outIdx + 2 >= endIdx) break;
              outU8Array[outIdx++] = 224 | u >> 12;
              outU8Array[outIdx++] = 128 | u >> 6 & 63;
              outU8Array[outIdx++] = 128 | u & 63;
            } else {
              if (outIdx + 3 >= endIdx) break;
              outU8Array[outIdx++] = 240 | u >> 18;
              outU8Array[outIdx++] = 128 | u >> 12 & 63;
              outU8Array[outIdx++] = 128 | u >> 6 & 63;
              outU8Array[outIdx++] = 128 | u & 63;
            }
          }
          outU8Array[outIdx] = 0;
          return outIdx - startIdx;
        }
        function stringToUTF8(str, outPtr, maxBytesToWrite) {
          return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
        }
        function lengthBytesUTF8(str) {
          var len = 0;
          for (var i2 = 0; i2 < str.length; ++i2) {
            var u = str.charCodeAt(i2);
            if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i2) & 1023;
            if (u <= 127) ++len;
            else if (u <= 2047) len += 2;
            else if (u <= 65535) len += 3;
            else len += 4;
          }
          return len;
        }
        var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : void 0;
        function allocateUTF8(str) {
          var size = lengthBytesUTF8(str) + 1;
          var ret = _malloc(size);
          if (ret) stringToUTF8Array(str, HEAP8, ret, size);
          return ret;
        }
        function writeArrayToMemory(array, buffer2) {
          HEAP8.set(array, buffer2);
        }
        var WASM_PAGE_SIZE = 65536;
        function alignUp(x, multiple) {
          if (x % multiple > 0) {
            x += multiple - x % multiple;
          }
          return x;
        }
        var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
        function updateGlobalBufferAndViews(buf) {
          buffer = buf;
          Module["HEAP8"] = HEAP8 = new Int8Array(buf);
          Module["HEAP16"] = HEAP16 = new Int16Array(buf);
          Module["HEAP32"] = HEAP32 = new Int32Array(buf);
          Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
          Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
          Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
          Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
          Module["HEAPF64"] = HEAPF64 = new Float64Array(buf);
        }
        var DYNAMIC_BASE = 5615952, DYNAMICTOP_PTR = 373040;
        var INITIAL_TOTAL_MEMORY = Module["TOTAL_MEMORY"] || 16777216;
        if (Module["wasmMemory"]) {
          wasmMemory = Module["wasmMemory"];
        } else {
          wasmMemory = new WebAssembly.Memory({ "initial": INITIAL_TOTAL_MEMORY / WASM_PAGE_SIZE });
        }
        if (wasmMemory) {
          buffer = wasmMemory.buffer;
        }
        INITIAL_TOTAL_MEMORY = buffer.byteLength;
        updateGlobalBufferAndViews(buffer);
        HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;
        function callRuntimeCallbacks(callbacks) {
          while (callbacks.length > 0) {
            var callback = callbacks.shift();
            if (typeof callback == "function") {
              callback();
              continue;
            }
            var func = callback.func;
            if (typeof func === "number") {
              if (callback.arg === void 0) {
                Module["dynCall_v"](func);
              } else {
                Module["dynCall_vi"](func, callback.arg);
              }
            } else {
              func(callback.arg === void 0 ? null : callback.arg);
            }
          }
        }
        var __ATPRERUN__ = [];
        var __ATINIT__ = [];
        var __ATMAIN__ = [];
        var __ATPOSTRUN__ = [];
        var runtimeInitialized = false;
        var runtimeExited = false;
        function preRun() {
          if (Module["preRun"]) {
            if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
            while (Module["preRun"].length) {
              addOnPreRun(Module["preRun"].shift());
            }
          }
          callRuntimeCallbacks(__ATPRERUN__);
        }
        function initRuntime() {
          runtimeInitialized = true;
          if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
          TTY.init();
          callRuntimeCallbacks(__ATINIT__);
        }
        function preMain() {
          FS.ignorePermissions = false;
          callRuntimeCallbacks(__ATMAIN__);
        }
        function exitRuntime() {
          runtimeExited = true;
        }
        function postRun() {
          if (Module["postRun"]) {
            if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
            while (Module["postRun"].length) {
              addOnPostRun(Module["postRun"].shift());
            }
          }
          callRuntimeCallbacks(__ATPOSTRUN__);
        }
        function addOnPreRun(cb) {
          __ATPRERUN__.unshift(cb);
        }
        function addOnPostRun(cb) {
          __ATPOSTRUN__.unshift(cb);
        }
        var Math_abs = Math.abs;
        var Math_ceil = Math.ceil;
        var Math_floor = Math.floor;
        var Math_min = Math.min;
        var runDependencies = 0;
        var runDependencyWatcher = null;
        var dependenciesFulfilled = null;
        function getUniqueRunDependency(id) {
          return id;
        }
        function addRunDependency(id) {
          runDependencies++;
          if (Module["monitorRunDependencies"]) {
            Module["monitorRunDependencies"](runDependencies);
          }
        }
        function removeRunDependency(id) {
          runDependencies--;
          if (Module["monitorRunDependencies"]) {
            Module["monitorRunDependencies"](runDependencies);
          }
          if (runDependencies == 0) {
            if (runDependencyWatcher !== null) {
              clearInterval(runDependencyWatcher);
              runDependencyWatcher = null;
            }
            if (dependenciesFulfilled) {
              var callback = dependenciesFulfilled;
              dependenciesFulfilled = null;
              callback();
            }
          }
        }
        Module["preloadedImages"] = {};
        Module["preloadedAudios"] = {};
        var dataURIPrefix = "data:application/octet-stream;base64,";
        function isDataURI(filename) {
          return String.prototype.startsWith ? filename.startsWith(dataURIPrefix) : filename.indexOf(dataURIPrefix) === 0;
        }
        var wasmBinaryFile = "libktx.wasm";
        if (!isDataURI(wasmBinaryFile)) {
          wasmBinaryFile = locateFile(wasmBinaryFile);
        }
        function getBinary() {
          try {
            if (wasmBinary) {
              return new Uint8Array(wasmBinary);
            }
            if (readBinary) {
              return readBinary(wasmBinaryFile);
            } else {
              throw "both async and sync fetching of the wasm failed";
            }
          } catch (err2) {
            abort(err2);
          }
        }
        function getBinaryPromise() {
          if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === "function") {
            return fetch(wasmBinaryFile, { credentials: "same-origin" }).then(function(response) {
              if (!response["ok"]) {
                throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
              }
              return response["arrayBuffer"]();
            }).catch(function() {
              return getBinary();
            });
          }
          return new Promise(function(resolve, reject) {
            resolve(getBinary());
          });
        }
        function createWasm(env) {
          var info = { "env": env, "global": { "NaN": NaN, Infinity: Infinity }, "global.Math": Math, "asm2wasm": asm2wasmImports };
          function receiveInstance(instance, module2) {
            var exports3 = instance.exports;
            Module["asm"] = exports3;
            removeRunDependency("wasm-instantiate");
          }
          addRunDependency("wasm-instantiate");
          function receiveInstantiatedSource(output) {
            receiveInstance(output["instance"]);
          }
          function instantiateArrayBuffer(receiver) {
            return getBinaryPromise().then(function(binary) {
              return WebAssembly.instantiate(binary, info);
            }).then(receiver, function(reason) {
              err("failed to asynchronously prepare wasm: " + reason);
              abort(reason);
            });
          }
          function instantiateAsync() {
            if (!wasmBinary && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && typeof fetch === "function") {
              fetch(wasmBinaryFile, { credentials: "same-origin" }).then(function(response) {
                var result = WebAssembly.instantiateStreaming(response, info);
                return result.then(receiveInstantiatedSource, function(reason) {
                  err("wasm streaming compile failed: " + reason);
                  err("falling back to ArrayBuffer instantiation");
                  instantiateArrayBuffer(receiveInstantiatedSource);
                });
              });
            } else {
              return instantiateArrayBuffer(receiveInstantiatedSource);
            }
          }
          if (Module["instantiateWasm"]) {
            try {
              var exports2 = Module["instantiateWasm"](info, receiveInstance);
              return exports2;
            } catch (e) {
              err("Module.instantiateWasm callback failed with error: " + e);
              return false;
            }
          }
          instantiateAsync();
          return {};
        }
        Module["asm"] = function(global2, env, providedBuffer) {
          env["memory"] = wasmMemory;
          env["table"] = wasmTable = new WebAssembly.Table({ "initial": 1167, "maximum": 1167, "element": "anyfunc" });
          env["__memory_base"] = 1024;
          env["__table_base"] = 0;
          var exports2 = createWasm(env);
          return exports2;
        };
        var tempDouble;
        var tempI64;
        __ATINIT__.push({ func: function() {
          globalCtors();
        } });
        function demangle(func) {
          return func;
        }
        function demangleAll(text) {
          var regex = /\b__Z[\w\d_]+/g;
          return text.replace(regex, function(x) {
            var y = demangle(x);
            return x === y ? x : y + " [" + x + "]";
          });
        }
        function jsStackTrace() {
          var err2 = new Error();
          if (!err2.stack) {
            try {
              throw new Error(0);
            } catch (e) {
              err2 = e;
            }
            if (!err2.stack) {
              return "(no stack trace available)";
            }
          }
          return err2.stack.toString();
        }
        function stackTrace() {
          var js = jsStackTrace();
          if (Module["extraStackTrace"]) js += "\n" + Module["extraStackTrace"]();
          return demangleAll(js);
        }
        function ___assert_fail(condition, filename, line, func) {
          abort("Assertion failed: " + UTF8ToString(condition) + ", at: " + [filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function"]);
        }
        function ___cxa_allocate_exception(size) {
          return _malloc(size);
        }
        var ___exception_infos = {};
        function ___cxa_pure_virtual() {
          ABORT = true;
          throw "Pure virtual function called!";
        }
        var ___exception_last = 0;
        function ___cxa_throw(ptr, type, destructor) {
          ___exception_infos[ptr] = { ptr, adjusted: [ptr], type, destructor, refcount: 0, caught: false, rethrown: false };
          ___exception_last = ptr;
          if (!("uncaught_exception" in __ZSt18uncaught_exceptionv)) {
            __ZSt18uncaught_exceptionv.uncaught_exceptions = 1;
          } else {
            __ZSt18uncaught_exceptionv.uncaught_exceptions++;
          }
          throw ptr;
        }
        function ___cxa_uncaught_exceptions() {
          return __ZSt18uncaught_exceptionv.uncaught_exceptions;
        }
        function ___lock() {
        }
        function ___setErrNo(value) {
          if (Module["___errno_location"]) HEAP32[Module["___errno_location"]() >> 2] = value;
          return value;
        }
        function ___map_file(pathname, size) {
          ___setErrNo(1);
          return -1;
        }
        var PATH = { splitPath: function(filename) {
          var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
          return splitPathRe.exec(filename).slice(1);
        }, normalizeArray: function(parts, allowAboveRoot) {
          var up = 0;
          for (var i2 = parts.length - 1; i2 >= 0; i2--) {
            var last = parts[i2];
            if (last === ".") {
              parts.splice(i2, 1);
            } else if (last === "..") {
              parts.splice(i2, 1);
              up++;
            } else if (up) {
              parts.splice(i2, 1);
              up--;
            }
          }
          if (allowAboveRoot) {
            for (; up; up--) {
              parts.unshift("..");
            }
          }
          return parts;
        }, normalize: function(path) {
          var isAbsolute = path.charAt(0) === "/", trailingSlash = path.substr(-1) === "/";
          path = PATH.normalizeArray(path.split("/").filter(function(p) {
            return !!p;
          }), !isAbsolute).join("/");
          if (!path && !isAbsolute) {
            path = ".";
          }
          if (path && trailingSlash) {
            path += "/";
          }
          return (isAbsolute ? "/" : "") + path;
        }, dirname: function(path) {
          var result = PATH.splitPath(path), root = result[0], dir = result[1];
          if (!root && !dir) {
            return ".";
          }
          if (dir) {
            dir = dir.substr(0, dir.length - 1);
          }
          return root + dir;
        }, basename: function(path) {
          if (path === "/") return "/";
          var lastSlash = path.lastIndexOf("/");
          if (lastSlash === -1) return path;
          return path.substr(lastSlash + 1);
        }, extname: function(path) {
          return PATH.splitPath(path)[3];
        }, join: function() {
          var paths = Array.prototype.slice.call(arguments, 0);
          return PATH.normalize(paths.join("/"));
        }, join2: function(l, r) {
          return PATH.normalize(l + "/" + r);
        } };
        var PATH_FS = { resolve: function() {
          var resolvedPath = "", resolvedAbsolute = false;
          for (var i2 = arguments.length - 1; i2 >= -1 && !resolvedAbsolute; i2--) {
            var path = i2 >= 0 ? arguments[i2] : FS.cwd();
            if (typeof path !== "string") {
              throw new TypeError("Arguments to path.resolve must be strings");
            } else if (!path) {
              return "";
            }
            resolvedPath = path + "/" + resolvedPath;
            resolvedAbsolute = path.charAt(0) === "/";
          }
          resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter(function(p) {
            return !!p;
          }), !resolvedAbsolute).join("/");
          return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
        }, relative: function(from, to) {
          from = PATH_FS.resolve(from).substr(1);
          to = PATH_FS.resolve(to).substr(1);
          function trim(arr) {
            var start = 0;
            for (; start < arr.length; start++) {
              if (arr[start] !== "") break;
            }
            var end = arr.length - 1;
            for (; end >= 0; end--) {
              if (arr[end] !== "") break;
            }
            if (start > end) return [];
            return arr.slice(start, end - start + 1);
          }
          var fromParts = trim(from.split("/"));
          var toParts = trim(to.split("/"));
          var length = Math.min(fromParts.length, toParts.length);
          var samePartsLength = length;
          for (var i2 = 0; i2 < length; i2++) {
            if (fromParts[i2] !== toParts[i2]) {
              samePartsLength = i2;
              break;
            }
          }
          var outputParts = [];
          for (var i2 = samePartsLength; i2 < fromParts.length; i2++) {
            outputParts.push("..");
          }
          outputParts = outputParts.concat(toParts.slice(samePartsLength));
          return outputParts.join("/");
        } };
        var TTY = { ttys: [], init: function() {
        }, shutdown: function() {
        }, register: function(dev, ops) {
          TTY.ttys[dev] = { input: [], output: [], ops };
          FS.registerDevice(dev, TTY.stream_ops);
        }, stream_ops: { open: function(stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(19);
          }
          stream.tty = tty;
          stream.seekable = false;
        }, close: function(stream) {
          stream.tty.ops.flush(stream.tty);
        }, flush: function(stream) {
          stream.tty.ops.flush(stream.tty);
        }, read: function(stream, buffer2, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(6);
          }
          var bytesRead = 0;
          for (var i2 = 0; i2 < length; i2++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(5);
            }
            if (result === void 0 && bytesRead === 0) {
              throw new FS.ErrnoError(11);
            }
            if (result === null || result === void 0) break;
            bytesRead++;
            buffer2[offset + i2] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        }, write: function(stream, buffer2, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(6);
          }
          try {
            for (var i2 = 0; i2 < length; i2++) {
              stream.tty.ops.put_char(stream.tty, buffer2[offset + i2]);
            }
          } catch (e) {
            throw new FS.ErrnoError(5);
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i2;
        } }, default_tty_ops: { get_char: function(tty) {
          if (!tty.input.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              var BUFSIZE = 256;
              var buf = Buffer.alloc ? Buffer.alloc(BUFSIZE) : new Buffer(BUFSIZE);
              var bytesRead = 0;
              var isPosixPlatform = process.platform != "win32";
              var fd = process.stdin.fd;
              if (isPosixPlatform) {
                var usingDevice = false;
                try {
                  fd = fs.openSync("/dev/stdin", "r");
                  usingDevice = true;
                } catch (e) {
                }
              }
              try {
                bytesRead = fs.readSync(fd, buf, 0, BUFSIZE, null);
              } catch (e) {
                if (e.toString().indexOf("EOF") != -1) bytesRead = 0;
                else throw e;
              }
              if (usingDevice) {
                fs.closeSync(fd);
              }
              if (bytesRead > 0) {
                result = buf.slice(0, bytesRead).toString("utf-8");
              } else {
                result = null;
              }
            } else if (typeof window != "undefined" && typeof window.prompt == "function") {
              result = window.prompt("Input: ");
              if (result !== null) {
                result += "\n";
              }
            } else if (typeof readline == "function") {
              result = readline();
              if (result !== null) {
                result += "\n";
              }
            }
            if (!result) {
              return null;
            }
            tty.input = intArrayFromString(result, true);
          }
          return tty.input.shift();
        }, put_char: function(tty, val) {
          if (val === null || val === 10) {
            out(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        }, flush: function(tty) {
          if (tty.output && tty.output.length > 0) {
            out(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        } }, default_tty1_ops: { put_char: function(tty, val) {
          if (val === null || val === 10) {
            err(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        }, flush: function(tty) {
          if (tty.output && tty.output.length > 0) {
            err(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        } } };
        var MEMFS = { ops_table: null, mount: function(mount) {
          return MEMFS.createNode(null, "/", 16384 | 511, 0);
        }, createNode: function(parent, name, mode, dev) {
          if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
            throw new FS.ErrnoError(1);
          }
          if (!MEMFS.ops_table) {
            MEMFS.ops_table = { dir: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr, lookup: MEMFS.node_ops.lookup, mknod: MEMFS.node_ops.mknod, rename: MEMFS.node_ops.rename, unlink: MEMFS.node_ops.unlink, rmdir: MEMFS.node_ops.rmdir, readdir: MEMFS.node_ops.readdir, symlink: MEMFS.node_ops.symlink }, stream: { llseek: MEMFS.stream_ops.llseek } }, file: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr }, stream: { llseek: MEMFS.stream_ops.llseek, read: MEMFS.stream_ops.read, write: MEMFS.stream_ops.write, allocate: MEMFS.stream_ops.allocate, mmap: MEMFS.stream_ops.mmap, msync: MEMFS.stream_ops.msync } }, link: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr, readlink: MEMFS.node_ops.readlink }, stream: {} }, chrdev: { node: { getattr: MEMFS.node_ops.getattr, setattr: MEMFS.node_ops.setattr }, stream: FS.chrdev_stream_ops } };
          }
          var node = FS.createNode(parent, name, mode, dev);
          if (FS.isDir(node.mode)) {
            node.node_ops = MEMFS.ops_table.dir.node;
            node.stream_ops = MEMFS.ops_table.dir.stream;
            node.contents = {};
          } else if (FS.isFile(node.mode)) {
            node.node_ops = MEMFS.ops_table.file.node;
            node.stream_ops = MEMFS.ops_table.file.stream;
            node.usedBytes = 0;
            node.contents = null;
          } else if (FS.isLink(node.mode)) {
            node.node_ops = MEMFS.ops_table.link.node;
            node.stream_ops = MEMFS.ops_table.link.stream;
          } else if (FS.isChrdev(node.mode)) {
            node.node_ops = MEMFS.ops_table.chrdev.node;
            node.stream_ops = MEMFS.ops_table.chrdev.stream;
          }
          node.timestamp = Date.now();
          if (parent) {
            parent.contents[name] = node;
          }
          return node;
        }, getFileDataAsRegularArray: function(node) {
          if (node.contents && node.contents.subarray) {
            var arr = [];
            for (var i2 = 0; i2 < node.usedBytes; ++i2) arr.push(node.contents[i2]);
            return arr;
          }
          return node.contents;
        }, getFileDataAsTypedArray: function(node) {
          if (!node.contents) return new Uint8Array();
          if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
          return new Uint8Array(node.contents);
        }, expandFileStorage: function(node, newCapacity) {
          var prevCapacity = node.contents ? node.contents.length : 0;
          if (prevCapacity >= newCapacity) return;
          var CAPACITY_DOUBLING_MAX = 1024 * 1024;
          newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) | 0);
          if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
          var oldContents = node.contents;
          node.contents = new Uint8Array(newCapacity);
          if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
          return;
        }, resizeFileStorage: function(node, newSize) {
          if (node.usedBytes == newSize) return;
          if (newSize == 0) {
            node.contents = null;
            node.usedBytes = 0;
            return;
          }
          if (!node.contents || node.contents.subarray) {
            var oldContents = node.contents;
            node.contents = new Uint8Array(new ArrayBuffer(newSize));
            if (oldContents) {
              node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)));
            }
            node.usedBytes = newSize;
            return;
          }
          if (!node.contents) node.contents = [];
          if (node.contents.length > newSize) node.contents.length = newSize;
          else while (node.contents.length < newSize) node.contents.push(0);
          node.usedBytes = newSize;
        }, node_ops: { getattr: function(node) {
          var attr = {};
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.usedBytes;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        }, setattr: function(node, attr) {
          if (attr.mode !== void 0) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== void 0) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== void 0) {
            MEMFS.resizeFileStorage(node, attr.size);
          }
        }, lookup: function(parent, name) {
          throw FS.genericErrors[2];
        }, mknod: function(parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        }, rename: function(old_node, new_dir, new_name) {
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i2 in new_node.contents) {
                throw new FS.ErrnoError(39);
              }
            }
          }
          delete old_node.parent.contents[old_node.name];
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          old_node.parent = new_dir;
        }, unlink: function(parent, name) {
          delete parent.contents[name];
        }, rmdir: function(parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i2 in node.contents) {
            throw new FS.ErrnoError(39);
          }
          delete parent.contents[name];
        }, readdir: function(node) {
          var entries = [".", ".."];
          for (var key2 in node.contents) {
            if (!node.contents.hasOwnProperty(key2)) {
              continue;
            }
            entries.push(key2);
          }
          return entries;
        }, symlink: function(parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
          node.link = oldpath;
          return node;
        }, readlink: function(node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(22);
          }
          return node.link;
        } }, stream_ops: { read: function(stream, buffer2, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= stream.node.usedBytes) return 0;
          var size = Math.min(stream.node.usedBytes - position, length);
          if (size > 8 && contents.subarray) {
            buffer2.set(contents.subarray(position, position + size), offset);
          } else {
            for (var i2 = 0; i2 < size; i2++) buffer2[offset + i2] = contents[position + i2];
          }
          return size;
        }, write: function(stream, buffer2, offset, length, position, canOwn) {
          canOwn = false;
          if (!length) return 0;
          var node = stream.node;
          node.timestamp = Date.now();
          if (buffer2.subarray && (!node.contents || node.contents.subarray)) {
            if (canOwn) {
              node.contents = buffer2.subarray(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (node.usedBytes === 0 && position === 0) {
              node.contents = new Uint8Array(buffer2.subarray(offset, offset + length));
              node.usedBytes = length;
              return length;
            } else if (position + length <= node.usedBytes) {
              node.contents.set(buffer2.subarray(offset, offset + length), position);
              return length;
            }
          }
          MEMFS.expandFileStorage(node, position + length);
          if (node.contents.subarray && buffer2.subarray) node.contents.set(buffer2.subarray(offset, offset + length), position);
          else {
            for (var i2 = 0; i2 < length; i2++) {
              node.contents[position + i2] = buffer2[offset + i2];
            }
          }
          node.usedBytes = Math.max(node.usedBytes, position + length);
          return length;
        }, llseek: function(stream, offset, whence) {
          var position = offset;
          if (whence === 1) {
            position += stream.position;
          } else if (whence === 2) {
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.usedBytes;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(22);
          }
          return position;
        }, allocate: function(stream, offset, length) {
          MEMFS.expandFileStorage(stream.node, offset + length);
          stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
        }, mmap: function(stream, buffer2, offset, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(19);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          if (!(flags & 2) && (contents.buffer === buffer2 || contents.buffer === buffer2.buffer)) {
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            if (position > 0 || position + length < stream.node.usedBytes) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            var fromHeap = buffer2.buffer == HEAP8.buffer;
            ptr = _malloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(12);
            }
            (fromHeap ? HEAP8 : buffer2).set(contents, ptr);
          }
          return { ptr, allocated };
        }, msync: function(stream, buffer2, offset, length, mmapFlags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(19);
          }
          if (mmapFlags & 2) {
            return 0;
          }
          var bytesWritten = MEMFS.stream_ops.write(stream, buffer2, 0, length, offset, false);
          return 0;
        } } };
        var IDBFS = { dbs: {}, indexedDB: function() {
          if (typeof indexedDB !== "undefined") return indexedDB;
          var ret = null;
          if (typeof window === "object") ret = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
          assert(ret, "IDBFS used, but indexedDB not supported");
          return ret;
        }, DB_VERSION: 21, DB_STORE_NAME: "FILE_DATA", mount: function(mount) {
          return MEMFS.mount.apply(null, arguments);
        }, syncfs: function(mount, populate, callback) {
          IDBFS.getLocalSet(mount, function(err2, local) {
            if (err2) return callback(err2);
            IDBFS.getRemoteSet(mount, function(err3, remote) {
              if (err3) return callback(err3);
              var src = populate ? remote : local;
              var dst = populate ? local : remote;
              IDBFS.reconcile(src, dst, callback);
            });
          });
        }, getDB: function(name, callback) {
          var db = IDBFS.dbs[name];
          if (db) {
            return callback(null, db);
          }
          var req;
          try {
            req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
          } catch (e) {
            return callback(e);
          }
          if (!req) {
            return callback("Unable to connect to IndexedDB");
          }
          req.onupgradeneeded = function(e) {
            var db2 = e.target.result;
            var transaction = e.target.transaction;
            var fileStore;
            if (db2.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
              fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME);
            } else {
              fileStore = db2.createObjectStore(IDBFS.DB_STORE_NAME);
            }
            if (!fileStore.indexNames.contains("timestamp")) {
              fileStore.createIndex("timestamp", "timestamp", { unique: false });
            }
          };
          req.onsuccess = function() {
            db = req.result;
            IDBFS.dbs[name] = db;
            callback(null, db);
          };
          req.onerror = function(e) {
            callback(this.error);
            e.preventDefault();
          };
        }, getLocalSet: function(mount, callback) {
          var entries = {};
          function isRealDir(p) {
            return p !== "." && p !== "..";
          }
          function toAbsolute(root) {
            return function(p) {
              return PATH.join2(root, p);
            };
          }
          var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
          while (check.length) {
            var path = check.pop();
            var stat;
            try {
              stat = FS.stat(path);
            } catch (e) {
              return callback(e);
            }
            if (FS.isDir(stat.mode)) {
              check.push.apply(check, FS.readdir(path).filter(isRealDir).map(toAbsolute(path)));
            }
            entries[path] = { timestamp: stat.mtime };
          }
          return callback(null, { type: "local", entries });
        }, getRemoteSet: function(mount, callback) {
          var entries = {};
          IDBFS.getDB(mount.mountpoint, function(err2, db) {
            if (err2) return callback(err2);
            try {
              var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readonly");
              transaction.onerror = function(e) {
                callback(this.error);
                e.preventDefault();
              };
              var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
              var index = store.index("timestamp");
              index.openKeyCursor().onsuccess = function(event) {
                var cursor = event.target.result;
                if (!cursor) {
                  return callback(null, { type: "remote", db, entries });
                }
                entries[cursor.primaryKey] = { timestamp: cursor.key };
                cursor.continue();
              };
            } catch (e) {
              return callback(e);
            }
          });
        }, loadLocalEntry: function(path, callback) {
          var stat, node;
          try {
            var lookup = FS.lookupPath(path);
            node = lookup.node;
            stat = FS.stat(path);
          } catch (e) {
            return callback(e);
          }
          if (FS.isDir(stat.mode)) {
            return callback(null, { timestamp: stat.mtime, mode: stat.mode });
          } else if (FS.isFile(stat.mode)) {
            node.contents = MEMFS.getFileDataAsTypedArray(node);
            return callback(null, { timestamp: stat.mtime, mode: stat.mode, contents: node.contents });
          } else {
            return callback(new Error("node type not supported"));
          }
        }, storeLocalEntry: function(path, entry, callback) {
          try {
            if (FS.isDir(entry.mode)) {
              FS.mkdir(path, entry.mode);
            } else if (FS.isFile(entry.mode)) {
              FS.writeFile(path, entry.contents, { canOwn: true });
            } else {
              return callback(new Error("node type not supported"));
            }
            FS.chmod(path, entry.mode);
            FS.utime(path, entry.timestamp, entry.timestamp);
          } catch (e) {
            return callback(e);
          }
          callback(null);
        }, removeLocalEntry: function(path, callback) {
          try {
            var lookup = FS.lookupPath(path);
            var stat = FS.stat(path);
            if (FS.isDir(stat.mode)) {
              FS.rmdir(path);
            } else if (FS.isFile(stat.mode)) {
              FS.unlink(path);
            }
          } catch (e) {
            return callback(e);
          }
          callback(null);
        }, loadRemoteEntry: function(store, path, callback) {
          var req = store.get(path);
          req.onsuccess = function(event) {
            callback(null, event.target.result);
          };
          req.onerror = function(e) {
            callback(this.error);
            e.preventDefault();
          };
        }, storeRemoteEntry: function(store, path, entry, callback) {
          var req = store.put(entry, path);
          req.onsuccess = function() {
            callback(null);
          };
          req.onerror = function(e) {
            callback(this.error);
            e.preventDefault();
          };
        }, removeRemoteEntry: function(store, path, callback) {
          var req = store.delete(path);
          req.onsuccess = function() {
            callback(null);
          };
          req.onerror = function(e) {
            callback(this.error);
            e.preventDefault();
          };
        }, reconcile: function(src, dst, callback) {
          var total = 0;
          var create = [];
          Object.keys(src.entries).forEach(function(key2) {
            var e = src.entries[key2];
            var e2 = dst.entries[key2];
            if (!e2 || e.timestamp > e2.timestamp) {
              create.push(key2);
              total++;
            }
          });
          var remove = [];
          Object.keys(dst.entries).forEach(function(key2) {
            var e = dst.entries[key2];
            var e2 = src.entries[key2];
            if (!e2) {
              remove.push(key2);
              total++;
            }
          });
          if (!total) {
            return callback(null);
          }
          var errored = false;
          var db = src.type === "remote" ? src.db : dst.db;
          var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readwrite");
          var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
          function done(err2) {
            if (err2 && !errored) {
              errored = true;
              return callback(err2);
            }
          }
          transaction.onerror = function(e) {
            done(this.error);
            e.preventDefault();
          };
          transaction.oncomplete = function(e) {
            if (!errored) {
              callback(null);
            }
          };
          create.sort().forEach(function(path) {
            if (dst.type === "local") {
              IDBFS.loadRemoteEntry(store, path, function(err2, entry) {
                if (err2) return done(err2);
                IDBFS.storeLocalEntry(path, entry, done);
              });
            } else {
              IDBFS.loadLocalEntry(path, function(err2, entry) {
                if (err2) return done(err2);
                IDBFS.storeRemoteEntry(store, path, entry, done);
              });
            }
          });
          remove.sort().reverse().forEach(function(path) {
            if (dst.type === "local") {
              IDBFS.removeLocalEntry(path, done);
            } else {
              IDBFS.removeRemoteEntry(store, path, done);
            }
          });
        } };
        var NODEFS = { isWindows: false, staticInit: function() {
          NODEFS.isWindows = !!process.platform.match(/^win/);
          var flags = process["binding"]("constants");
          if (flags["fs"]) {
            flags = flags["fs"];
          }
          NODEFS.flagsForNodeMap = { 1024: flags["O_APPEND"], 64: flags["O_CREAT"], 128: flags["O_EXCL"], 0: flags["O_RDONLY"], 2: flags["O_RDWR"], 4096: flags["O_SYNC"], 512: flags["O_TRUNC"], 1: flags["O_WRONLY"] };
        }, bufferFrom: function(arrayBuffer) {
          return Buffer.alloc ? Buffer.from(arrayBuffer) : new Buffer(arrayBuffer);
        }, mount: function(mount) {
          assert(ENVIRONMENT_HAS_NODE);
          return NODEFS.createNode(null, "/", NODEFS.getMode(mount.opts.root), 0);
        }, createNode: function(parent, name, mode, dev) {
          if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
            throw new FS.ErrnoError(22);
          }
          var node = FS.createNode(parent, name, mode);
          node.node_ops = NODEFS.node_ops;
          node.stream_ops = NODEFS.stream_ops;
          return node;
        }, getMode: function(path) {
          var stat;
          try {
            stat = fs.lstatSync(path);
            if (NODEFS.isWindows) {
              stat.mode = stat.mode | (stat.mode & 292) >> 2;
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(-e.errno);
          }
          return stat.mode;
        }, realPath: function(node) {
          var parts = [];
          while (node.parent !== node) {
            parts.push(node.name);
            node = node.parent;
          }
          parts.push(node.mount.opts.root);
          parts.reverse();
          return PATH.join.apply(null, parts);
        }, flagsForNode: function(flags) {
          flags &= ~2097152;
          flags &= ~2048;
          flags &= ~32768;
          flags &= ~524288;
          var newFlags = 0;
          for (var k in NODEFS.flagsForNodeMap) {
            if (flags & k) {
              newFlags |= NODEFS.flagsForNodeMap[k];
              flags ^= k;
            }
          }
          if (!flags) {
            return newFlags;
          } else {
            throw new FS.ErrnoError(22);
          }
        }, node_ops: { getattr: function(node) {
          var path = NODEFS.realPath(node);
          var stat;
          try {
            stat = fs.lstatSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(-e.errno);
          }
          if (NODEFS.isWindows && !stat.blksize) {
            stat.blksize = 4096;
          }
          if (NODEFS.isWindows && !stat.blocks) {
            stat.blocks = (stat.size + stat.blksize - 1) / stat.blksize | 0;
          }
          return { dev: stat.dev, ino: stat.ino, mode: stat.mode, nlink: stat.nlink, uid: stat.uid, gid: stat.gid, rdev: stat.rdev, size: stat.size, atime: stat.atime, mtime: stat.mtime, ctime: stat.ctime, blksize: stat.blksize, blocks: stat.blocks };
        }, setattr: function(node, attr) {
          var path = NODEFS.realPath(node);
          try {
            if (attr.mode !== void 0) {
              fs.chmodSync(path, attr.mode);
              node.mode = attr.mode;
            }
            if (attr.timestamp !== void 0) {
              var date = new Date(attr.timestamp);
              fs.utimesSync(path, date, date);
            }
            if (attr.size !== void 0) {
              fs.truncateSync(path, attr.size);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(-e.errno);
          }
        }, lookup: function(parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          var mode = NODEFS.getMode(path);
          return NODEFS.createNode(parent, name, mode);
        }, mknod: function(parent, name, mode, dev) {
          var node = NODEFS.createNode(parent, name, mode, dev);
          var path = NODEFS.realPath(node);
          try {
            if (FS.isDir(node.mode)) {
              fs.mkdirSync(path, node.mode);
            } else {
              fs.writeFileSync(path, "", { mode: node.mode });
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(-e.errno);
          }
          return node;
        }, rename: function(oldNode, newDir, newName) {
          var oldPath = NODEFS.realPath(oldNode);
          var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
          try {
            fs.renameSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(-e.errno);
          }
        }, unlink: function(parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.unlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(-e.errno);
          }
        }, rmdir: function(parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.rmdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(-e.errno);
          }
        }, readdir: function(node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(-e.errno);
          }
        }, symlink: function(parent, newName, oldPath) {
          var newPath = PATH.join2(NODEFS.realPath(parent), newName);
          try {
            fs.symlinkSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(-e.errno);
          }
        }, readlink: function(node) {
          var path = NODEFS.realPath(node);
          try {
            path = fs.readlinkSync(path);
            path = NODEJS_PATH.relative(NODEJS_PATH.resolve(node.mount.opts.root), path);
            return path;
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(-e.errno);
          }
        } }, stream_ops: { open: function(stream) {
          var path = NODEFS.realPath(stream.node);
          try {
            if (FS.isFile(stream.node.mode)) {
              stream.nfd = fs.openSync(path, NODEFS.flagsForNode(stream.flags));
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(-e.errno);
          }
        }, close: function(stream) {
          try {
            if (FS.isFile(stream.node.mode) && stream.nfd) {
              fs.closeSync(stream.nfd);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(-e.errno);
          }
        }, read: function(stream, buffer2, offset, length, position) {
          if (length === 0) return 0;
          try {
            return fs.readSync(stream.nfd, NODEFS.bufferFrom(buffer2.buffer), offset, length, position);
          } catch (e) {
            throw new FS.ErrnoError(-e.errno);
          }
        }, write: function(stream, buffer2, offset, length, position) {
          try {
            return fs.writeSync(stream.nfd, NODEFS.bufferFrom(buffer2.buffer), offset, length, position);
          } catch (e) {
            throw new FS.ErrnoError(-e.errno);
          }
        }, llseek: function(stream, offset, whence) {
          var position = offset;
          if (whence === 1) {
            position += stream.position;
          } else if (whence === 2) {
            if (FS.isFile(stream.node.mode)) {
              try {
                var stat = fs.fstatSync(stream.nfd);
                position += stat.size;
              } catch (e) {
                throw new FS.ErrnoError(-e.errno);
              }
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(22);
          }
          return position;
        } } };
        var WORKERFS = { DIR_MODE: 16895, FILE_MODE: 33279, reader: null, mount: function(mount) {
          assert(ENVIRONMENT_IS_WORKER);
          if (!WORKERFS.reader) WORKERFS.reader = new FileReaderSync();
          var root = WORKERFS.createNode(null, "/", WORKERFS.DIR_MODE, 0);
          var createdParents = {};
          function ensureParent(path) {
            var parts = path.split("/");
            var parent = root;
            for (var i2 = 0; i2 < parts.length - 1; i2++) {
              var curr = parts.slice(0, i2 + 1).join("/");
              if (!createdParents[curr]) {
                createdParents[curr] = WORKERFS.createNode(parent, parts[i2], WORKERFS.DIR_MODE, 0);
              }
              parent = createdParents[curr];
            }
            return parent;
          }
          function base(path) {
            var parts = path.split("/");
            return parts[parts.length - 1];
          }
          Array.prototype.forEach.call(mount.opts["files"] || [], function(file) {
            WORKERFS.createNode(ensureParent(file.name), base(file.name), WORKERFS.FILE_MODE, 0, file, file.lastModifiedDate);
          });
          (mount.opts["blobs"] || []).forEach(function(obj) {
            WORKERFS.createNode(ensureParent(obj["name"]), base(obj["name"]), WORKERFS.FILE_MODE, 0, obj["data"]);
          });
          (mount.opts["packages"] || []).forEach(function(pack) {
            pack["metadata"].files.forEach(function(file) {
              var name = file.filename.substr(1);
              WORKERFS.createNode(ensureParent(name), base(name), WORKERFS.FILE_MODE, 0, pack["blob"].slice(file.start, file.end));
            });
          });
          return root;
        }, createNode: function(parent, name, mode, dev, contents, mtime) {
          var node = FS.createNode(parent, name, mode);
          node.mode = mode;
          node.node_ops = WORKERFS.node_ops;
          node.stream_ops = WORKERFS.stream_ops;
          node.timestamp = (mtime || /* @__PURE__ */ new Date()).getTime();
          assert(WORKERFS.FILE_MODE !== WORKERFS.DIR_MODE);
          if (mode === WORKERFS.FILE_MODE) {
            node.size = contents.size;
            node.contents = contents;
          } else {
            node.size = 4096;
            node.contents = {};
          }
          if (parent) {
            parent.contents[name] = node;
          }
          return node;
        }, node_ops: { getattr: function(node) {
          return { dev: 1, ino: void 0, mode: node.mode, nlink: 1, uid: 0, gid: 0, rdev: void 0, size: node.size, atime: new Date(node.timestamp), mtime: new Date(node.timestamp), ctime: new Date(node.timestamp), blksize: 4096, blocks: Math.ceil(node.size / 4096) };
        }, setattr: function(node, attr) {
          if (attr.mode !== void 0) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== void 0) {
            node.timestamp = attr.timestamp;
          }
        }, lookup: function(parent, name) {
          throw new FS.ErrnoError(2);
        }, mknod: function(parent, name, mode, dev) {
          throw new FS.ErrnoError(1);
        }, rename: function(oldNode, newDir, newName) {
          throw new FS.ErrnoError(1);
        }, unlink: function(parent, name) {
          throw new FS.ErrnoError(1);
        }, rmdir: function(parent, name) {
          throw new FS.ErrnoError(1);
        }, readdir: function(node) {
          var entries = [".", ".."];
          for (var key2 in node.contents) {
            if (!node.contents.hasOwnProperty(key2)) {
              continue;
            }
            entries.push(key2);
          }
          return entries;
        }, symlink: function(parent, newName, oldPath) {
          throw new FS.ErrnoError(1);
        }, readlink: function(node) {
          throw new FS.ErrnoError(1);
        } }, stream_ops: { read: function(stream, buffer2, offset, length, position) {
          if (position >= stream.node.size) return 0;
          var chunk = stream.node.contents.slice(position, position + length);
          var ab = WORKERFS.reader.readAsArrayBuffer(chunk);
          buffer2.set(new Uint8Array(ab), offset);
          return chunk.size;
        }, write: function(stream, buffer2, offset, length, position) {
          throw new FS.ErrnoError(5);
        }, llseek: function(stream, offset, whence) {
          var position = offset;
          if (whence === 1) {
            position += stream.position;
          } else if (whence === 2) {
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.size;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(22);
          }
          return position;
        } } };
        var FS = { root: null, mounts: [], devices: {}, streams: [], nextInode: 1, nameTable: null, currentPath: "/", initialized: false, ignorePermissions: true, trackingDelegate: {}, tracking: { openFlags: { READ: 1, WRITE: 2 } }, ErrnoError: null, genericErrors: {}, filesystems: null, syncFSRequests: 0, handleFSError: function(e) {
          if (!(e instanceof FS.ErrnoError)) throw e + " : " + stackTrace();
          return ___setErrNo(e.errno);
        }, lookupPath: function(path, opts) {
          path = PATH_FS.resolve(FS.cwd(), path);
          opts = opts || {};
          if (!path) return { path: "", node: null };
          var defaults = { follow_mount: true, recurse_count: 0 };
          for (var key2 in defaults) {
            if (opts[key2] === void 0) {
              opts[key2] = defaults[key2];
            }
          }
          if (opts.recurse_count > 8) {
            throw new FS.ErrnoError(40);
          }
          var parts = PATH.normalizeArray(path.split("/").filter(function(p) {
            return !!p;
          }), false);
          var current = FS.root;
          var current_path = "/";
          for (var i2 = 0; i2 < parts.length; i2++) {
            var islast = i2 === parts.length - 1;
            if (islast && opts.parent) {
              break;
            }
            current = FS.lookupNode(current, parts[i2]);
            current_path = PATH.join2(current_path, parts[i2]);
            if (FS.isMountpoint(current)) {
              if (!islast || islast && opts.follow_mount) {
                current = current.mounted.root;
              }
            }
            if (!islast || opts.follow) {
              var count = 0;
              while (FS.isLink(current.mode)) {
                var link = FS.readlink(current_path);
                current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
                var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count });
                current = lookup.node;
                if (count++ > 40) {
                  throw new FS.ErrnoError(40);
                }
              }
            }
          }
          return { path: current_path, node: current };
        }, getPath: function(node) {
          var path;
          while (true) {
            if (FS.isRoot(node)) {
              var mount = node.mount.mountpoint;
              if (!path) return mount;
              return mount[mount.length - 1] !== "/" ? mount + "/" + path : mount + path;
            }
            path = path ? node.name + "/" + path : node.name;
            node = node.parent;
          }
        }, hashName: function(parentid, name) {
          var hash = 0;
          for (var i2 = 0; i2 < name.length; i2++) {
            hash = (hash << 5) - hash + name.charCodeAt(i2) | 0;
          }
          return (parentid + hash >>> 0) % FS.nameTable.length;
        }, hashAddNode: function(node) {
          var hash = FS.hashName(node.parent.id, node.name);
          node.name_next = FS.nameTable[hash];
          FS.nameTable[hash] = node;
        }, hashRemoveNode: function(node) {
          var hash = FS.hashName(node.parent.id, node.name);
          if (FS.nameTable[hash] === node) {
            FS.nameTable[hash] = node.name_next;
          } else {
            var current = FS.nameTable[hash];
            while (current) {
              if (current.name_next === node) {
                current.name_next = node.name_next;
                break;
              }
              current = current.name_next;
            }
          }
        }, lookupNode: function(parent, name) {
          var err2 = FS.mayLookup(parent);
          if (err2) {
            throw new FS.ErrnoError(err2, parent);
          }
          var hash = FS.hashName(parent.id, name);
          for (var node = FS.nameTable[hash]; node; node = node.name_next) {
            var nodeName = node.name;
            if (node.parent.id === parent.id && nodeName === name) {
              return node;
            }
          }
          return FS.lookup(parent, name);
        }, createNode: function(parent, name, mode, rdev) {
          if (!FS.FSNode) {
            FS.FSNode = function(parent2, name2, mode2, rdev2) {
              if (!parent2) {
                parent2 = this;
              }
              this.parent = parent2;
              this.mount = parent2.mount;
              this.mounted = null;
              this.id = FS.nextInode++;
              this.name = name2;
              this.mode = mode2;
              this.node_ops = {};
              this.stream_ops = {};
              this.rdev = rdev2;
            };
            FS.FSNode.prototype = {};
            var readMode = 292 | 73;
            var writeMode = 146;
            Object.defineProperties(FS.FSNode.prototype, { read: { get: function() {
              return (this.mode & readMode) === readMode;
            }, set: function(val) {
              val ? this.mode |= readMode : this.mode &= ~readMode;
            } }, write: { get: function() {
              return (this.mode & writeMode) === writeMode;
            }, set: function(val) {
              val ? this.mode |= writeMode : this.mode &= ~writeMode;
            } }, isFolder: { get: function() {
              return FS.isDir(this.mode);
            } }, isDevice: { get: function() {
              return FS.isChrdev(this.mode);
            } } });
          }
          var node = new FS.FSNode(parent, name, mode, rdev);
          FS.hashAddNode(node);
          return node;
        }, destroyNode: function(node) {
          FS.hashRemoveNode(node);
        }, isRoot: function(node) {
          return node === node.parent;
        }, isMountpoint: function(node) {
          return !!node.mounted;
        }, isFile: function(mode) {
          return (mode & 61440) === 32768;
        }, isDir: function(mode) {
          return (mode & 61440) === 16384;
        }, isLink: function(mode) {
          return (mode & 61440) === 40960;
        }, isChrdev: function(mode) {
          return (mode & 61440) === 8192;
        }, isBlkdev: function(mode) {
          return (mode & 61440) === 24576;
        }, isFIFO: function(mode) {
          return (mode & 61440) === 4096;
        }, isSocket: function(mode) {
          return (mode & 49152) === 49152;
        }, flagModes: { "r": 0, "rs": 1052672, "r+": 2, "w": 577, "wx": 705, "xw": 705, "w+": 578, "wx+": 706, "xw+": 706, "a": 1089, "ax": 1217, "xa": 1217, "a+": 1090, "ax+": 1218, "xa+": 1218 }, modeStringToFlags: function(str) {
          var flags = FS.flagModes[str];
          if (typeof flags === "undefined") {
            throw new Error("Unknown file open mode: " + str);
          }
          return flags;
        }, flagsToPermissionString: function(flag) {
          var perms = ["r", "w", "rw"][flag & 3];
          if (flag & 512) {
            perms += "w";
          }
          return perms;
        }, nodePermissions: function(node, perms) {
          if (FS.ignorePermissions) {
            return 0;
          }
          if (perms.indexOf("r") !== -1 && !(node.mode & 292)) {
            return 13;
          } else if (perms.indexOf("w") !== -1 && !(node.mode & 146)) {
            return 13;
          } else if (perms.indexOf("x") !== -1 && !(node.mode & 73)) {
            return 13;
          }
          return 0;
        }, mayLookup: function(dir) {
          var err2 = FS.nodePermissions(dir, "x");
          if (err2) return err2;
          if (!dir.node_ops.lookup) return 13;
          return 0;
        }, mayCreate: function(dir, name) {
          try {
            var node = FS.lookupNode(dir, name);
            return 17;
          } catch (e) {
          }
          return FS.nodePermissions(dir, "wx");
        }, mayDelete: function(dir, name, isdir) {
          var node;
          try {
            node = FS.lookupNode(dir, name);
          } catch (e) {
            return e.errno;
          }
          var err2 = FS.nodePermissions(dir, "wx");
          if (err2) {
            return err2;
          }
          if (isdir) {
            if (!FS.isDir(node.mode)) {
              return 20;
            }
            if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
              return 16;
            }
          } else {
            if (FS.isDir(node.mode)) {
              return 21;
            }
          }
          return 0;
        }, mayOpen: function(node, flags) {
          if (!node) {
            return 2;
          }
          if (FS.isLink(node.mode)) {
            return 40;
          } else if (FS.isDir(node.mode)) {
            if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
              return 21;
            }
          }
          return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
        }, MAX_OPEN_FDS: 4096, nextfd: function(fd_start, fd_end) {
          fd_start = fd_start || 0;
          fd_end = fd_end || FS.MAX_OPEN_FDS;
          for (var fd = fd_start; fd <= fd_end; fd++) {
            if (!FS.streams[fd]) {
              return fd;
            }
          }
          throw new FS.ErrnoError(24);
        }, getStream: function(fd) {
          return FS.streams[fd];
        }, createStream: function(stream, fd_start, fd_end) {
          if (!FS.FSStream) {
            FS.FSStream = function() {
            };
            FS.FSStream.prototype = {};
            Object.defineProperties(FS.FSStream.prototype, { object: { get: function() {
              return this.node;
            }, set: function(val) {
              this.node = val;
            } }, isRead: { get: function() {
              return (this.flags & 2097155) !== 1;
            } }, isWrite: { get: function() {
              return (this.flags & 2097155) !== 0;
            } }, isAppend: { get: function() {
              return this.flags & 1024;
            } } });
          }
          var newStream = new FS.FSStream();
          for (var p in stream) {
            newStream[p] = stream[p];
          }
          stream = newStream;
          var fd = FS.nextfd(fd_start, fd_end);
          stream.fd = fd;
          FS.streams[fd] = stream;
          return stream;
        }, closeStream: function(fd) {
          FS.streams[fd] = null;
        }, chrdev_stream_ops: { open: function(stream) {
          var device = FS.getDevice(stream.node.rdev);
          stream.stream_ops = device.stream_ops;
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        }, llseek: function() {
          throw new FS.ErrnoError(29);
        } }, major: function(dev) {
          return dev >> 8;
        }, minor: function(dev) {
          return dev & 255;
        }, makedev: function(ma, mi) {
          return ma << 8 | mi;
        }, registerDevice: function(dev, ops) {
          FS.devices[dev] = { stream_ops: ops };
        }, getDevice: function(dev) {
          return FS.devices[dev];
        }, getMounts: function(mount) {
          var mounts = [];
          var check = [mount];
          while (check.length) {
            var m = check.pop();
            mounts.push(m);
            check.push.apply(check, m.mounts);
          }
          return mounts;
        }, syncfs: function(populate, callback) {
          if (typeof populate === "function") {
            callback = populate;
            populate = false;
          }
          FS.syncFSRequests++;
          if (FS.syncFSRequests > 1) {
            console.log("warning: " + FS.syncFSRequests + " FS.syncfs operations in flight at once, probably just doing extra work");
          }
          var mounts = FS.getMounts(FS.root.mount);
          var completed = 0;
          function doCallback(err2) {
            FS.syncFSRequests--;
            return callback(err2);
          }
          function done(err2) {
            if (err2) {
              if (!done.errored) {
                done.errored = true;
                return doCallback(err2);
              }
              return;
            }
            if (++completed >= mounts.length) {
              doCallback(null);
            }
          }
          mounts.forEach(function(mount) {
            if (!mount.type.syncfs) {
              return done(null);
            }
            mount.type.syncfs(mount, populate, done);
          });
        }, mount: function(type, opts, mountpoint) {
          var root = mountpoint === "/";
          var pseudo = !mountpoint;
          var node;
          if (root && FS.root) {
            throw new FS.ErrnoError(16);
          } else if (!root && !pseudo) {
            var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
            mountpoint = lookup.path;
            node = lookup.node;
            if (FS.isMountpoint(node)) {
              throw new FS.ErrnoError(16);
            }
            if (!FS.isDir(node.mode)) {
              throw new FS.ErrnoError(20);
            }
          }
          var mount = { type, opts, mountpoint, mounts: [] };
          var mountRoot = type.mount(mount);
          mountRoot.mount = mount;
          mount.root = mountRoot;
          if (root) {
            FS.root = mountRoot;
          } else if (node) {
            node.mounted = mount;
            if (node.mount) {
              node.mount.mounts.push(mount);
            }
          }
          return mountRoot;
        }, unmount: function(mountpoint) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
          if (!FS.isMountpoint(lookup.node)) {
            throw new FS.ErrnoError(22);
          }
          var node = lookup.node;
          var mount = node.mounted;
          var mounts = FS.getMounts(mount);
          Object.keys(FS.nameTable).forEach(function(hash) {
            var current = FS.nameTable[hash];
            while (current) {
              var next = current.name_next;
              if (mounts.indexOf(current.mount) !== -1) {
                FS.destroyNode(current);
              }
              current = next;
            }
          });
          node.mounted = null;
          var idx = node.mount.mounts.indexOf(mount);
          node.mount.mounts.splice(idx, 1);
        }, lookup: function(parent, name) {
          return parent.node_ops.lookup(parent, name);
        }, mknod: function(path, mode, dev) {
          var lookup = FS.lookupPath(path, { parent: true });
          var parent = lookup.node;
          var name = PATH.basename(path);
          if (!name || name === "." || name === "..") {
            throw new FS.ErrnoError(22);
          }
          var err2 = FS.mayCreate(parent, name);
          if (err2) {
            throw new FS.ErrnoError(err2);
          }
          if (!parent.node_ops.mknod) {
            throw new FS.ErrnoError(1);
          }
          return parent.node_ops.mknod(parent, name, mode, dev);
        }, create: function(path, mode) {
          mode = mode !== void 0 ? mode : 438;
          mode &= 4095;
          mode |= 32768;
          return FS.mknod(path, mode, 0);
        }, mkdir: function(path, mode) {
          mode = mode !== void 0 ? mode : 511;
          mode &= 511 | 512;
          mode |= 16384;
          return FS.mknod(path, mode, 0);
        }, mkdirTree: function(path, mode) {
          var dirs = path.split("/");
          var d = "";
          for (var i2 = 0; i2 < dirs.length; ++i2) {
            if (!dirs[i2]) continue;
            d += "/" + dirs[i2];
            try {
              FS.mkdir(d, mode);
            } catch (e) {
              if (e.errno != 17) throw e;
            }
          }
        }, mkdev: function(path, mode, dev) {
          if (typeof dev === "undefined") {
            dev = mode;
            mode = 438;
          }
          mode |= 8192;
          return FS.mknod(path, mode, dev);
        }, symlink: function(oldpath, newpath) {
          if (!PATH_FS.resolve(oldpath)) {
            throw new FS.ErrnoError(2);
          }
          var lookup = FS.lookupPath(newpath, { parent: true });
          var parent = lookup.node;
          if (!parent) {
            throw new FS.ErrnoError(2);
          }
          var newname = PATH.basename(newpath);
          var err2 = FS.mayCreate(parent, newname);
          if (err2) {
            throw new FS.ErrnoError(err2);
          }
          if (!parent.node_ops.symlink) {
            throw new FS.ErrnoError(1);
          }
          return parent.node_ops.symlink(parent, newname, oldpath);
        }, rename: function(old_path, new_path) {
          var old_dirname = PATH.dirname(old_path);
          var new_dirname = PATH.dirname(new_path);
          var old_name = PATH.basename(old_path);
          var new_name = PATH.basename(new_path);
          var lookup, old_dir, new_dir;
          try {
            lookup = FS.lookupPath(old_path, { parent: true });
            old_dir = lookup.node;
            lookup = FS.lookupPath(new_path, { parent: true });
            new_dir = lookup.node;
          } catch (e) {
            throw new FS.ErrnoError(16);
          }
          if (!old_dir || !new_dir) throw new FS.ErrnoError(2);
          if (old_dir.mount !== new_dir.mount) {
            throw new FS.ErrnoError(18);
          }
          var old_node = FS.lookupNode(old_dir, old_name);
          var relative = PATH_FS.relative(old_path, new_dirname);
          if (relative.charAt(0) !== ".") {
            throw new FS.ErrnoError(22);
          }
          relative = PATH_FS.relative(new_path, old_dirname);
          if (relative.charAt(0) !== ".") {
            throw new FS.ErrnoError(39);
          }
          var new_node;
          try {
            new_node = FS.lookupNode(new_dir, new_name);
          } catch (e) {
          }
          if (old_node === new_node) {
            return;
          }
          var isdir = FS.isDir(old_node.mode);
          var err2 = FS.mayDelete(old_dir, old_name, isdir);
          if (err2) {
            throw new FS.ErrnoError(err2);
          }
          err2 = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
          if (err2) {
            throw new FS.ErrnoError(err2);
          }
          if (!old_dir.node_ops.rename) {
            throw new FS.ErrnoError(1);
          }
          if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
            throw new FS.ErrnoError(16);
          }
          if (new_dir !== old_dir) {
            err2 = FS.nodePermissions(old_dir, "w");
            if (err2) {
              throw new FS.ErrnoError(err2);
            }
          }
          try {
            if (FS.trackingDelegate["willMovePath"]) {
              FS.trackingDelegate["willMovePath"](old_path, new_path);
            }
          } catch (e) {
            console.log("FS.trackingDelegate['willMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message);
          }
          FS.hashRemoveNode(old_node);
          try {
            old_dir.node_ops.rename(old_node, new_dir, new_name);
          } catch (e) {
            throw e;
          } finally {
            FS.hashAddNode(old_node);
          }
          try {
            if (FS.trackingDelegate["onMovePath"]) FS.trackingDelegate["onMovePath"](old_path, new_path);
          } catch (e) {
            console.log("FS.trackingDelegate['onMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message);
          }
        }, rmdir: function(path) {
          var lookup = FS.lookupPath(path, { parent: true });
          var parent = lookup.node;
          var name = PATH.basename(path);
          var node = FS.lookupNode(parent, name);
          var err2 = FS.mayDelete(parent, name, true);
          if (err2) {
            throw new FS.ErrnoError(err2);
          }
          if (!parent.node_ops.rmdir) {
            throw new FS.ErrnoError(1);
          }
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(16);
          }
          try {
            if (FS.trackingDelegate["willDeletePath"]) {
              FS.trackingDelegate["willDeletePath"](path);
            }
          } catch (e) {
            console.log("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message);
          }
          parent.node_ops.rmdir(parent, name);
          FS.destroyNode(node);
          try {
            if (FS.trackingDelegate["onDeletePath"]) FS.trackingDelegate["onDeletePath"](path);
          } catch (e) {
            console.log("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message);
          }
        }, readdir: function(path) {
          var lookup = FS.lookupPath(path, { follow: true });
          var node = lookup.node;
          if (!node.node_ops.readdir) {
            throw new FS.ErrnoError(20);
          }
          return node.node_ops.readdir(node);
        }, unlink: function(path) {
          var lookup = FS.lookupPath(path, { parent: true });
          var parent = lookup.node;
          var name = PATH.basename(path);
          var node = FS.lookupNode(parent, name);
          var err2 = FS.mayDelete(parent, name, false);
          if (err2) {
            throw new FS.ErrnoError(err2);
          }
          if (!parent.node_ops.unlink) {
            throw new FS.ErrnoError(1);
          }
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(16);
          }
          try {
            if (FS.trackingDelegate["willDeletePath"]) {
              FS.trackingDelegate["willDeletePath"](path);
            }
          } catch (e) {
            console.log("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message);
          }
          parent.node_ops.unlink(parent, name);
          FS.destroyNode(node);
          try {
            if (FS.trackingDelegate["onDeletePath"]) FS.trackingDelegate["onDeletePath"](path);
          } catch (e) {
            console.log("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message);
          }
        }, readlink: function(path) {
          var lookup = FS.lookupPath(path);
          var link = lookup.node;
          if (!link) {
            throw new FS.ErrnoError(2);
          }
          if (!link.node_ops.readlink) {
            throw new FS.ErrnoError(22);
          }
          return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
        }, stat: function(path, dontFollow) {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          var node = lookup.node;
          if (!node) {
            throw new FS.ErrnoError(2);
          }
          if (!node.node_ops.getattr) {
            throw new FS.ErrnoError(1);
          }
          return node.node_ops.getattr(node);
        }, lstat: function(path) {
          return FS.stat(path, true);
        }, chmod: function(path, mode, dontFollow) {
          var node;
          if (typeof path === "string") {
            var lookup = FS.lookupPath(path, { follow: !dontFollow });
            node = lookup.node;
          } else {
            node = path;
          }
          if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(1);
          }
          node.node_ops.setattr(node, { mode: mode & 4095 | node.mode & ~4095, timestamp: Date.now() });
        }, lchmod: function(path, mode) {
          FS.chmod(path, mode, true);
        }, fchmod: function(fd, mode) {
          var stream = FS.getStream(fd);
          if (!stream) {
            throw new FS.ErrnoError(9);
          }
          FS.chmod(stream.node, mode);
        }, chown: function(path, uid, gid, dontFollow) {
          var node;
          if (typeof path === "string") {
            var lookup = FS.lookupPath(path, { follow: !dontFollow });
            node = lookup.node;
          } else {
            node = path;
          }
          if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(1);
          }
          node.node_ops.setattr(node, { timestamp: Date.now() });
        }, lchown: function(path, uid, gid) {
          FS.chown(path, uid, gid, true);
        }, fchown: function(fd, uid, gid) {
          var stream = FS.getStream(fd);
          if (!stream) {
            throw new FS.ErrnoError(9);
          }
          FS.chown(stream.node, uid, gid);
        }, truncate: function(path, len) {
          if (len < 0) {
            throw new FS.ErrnoError(22);
          }
          var node;
          if (typeof path === "string") {
            var lookup = FS.lookupPath(path, { follow: true });
            node = lookup.node;
          } else {
            node = path;
          }
          if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(1);
          }
          if (FS.isDir(node.mode)) {
            throw new FS.ErrnoError(21);
          }
          if (!FS.isFile(node.mode)) {
            throw new FS.ErrnoError(22);
          }
          var err2 = FS.nodePermissions(node, "w");
          if (err2) {
            throw new FS.ErrnoError(err2);
          }
          node.node_ops.setattr(node, { size: len, timestamp: Date.now() });
        }, ftruncate: function(fd, len) {
          var stream = FS.getStream(fd);
          if (!stream) {
            throw new FS.ErrnoError(9);
          }
          if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(22);
          }
          FS.truncate(stream.node, len);
        }, utime: function(path, atime, mtime) {
          var lookup = FS.lookupPath(path, { follow: true });
          var node = lookup.node;
          node.node_ops.setattr(node, { timestamp: Math.max(atime, mtime) });
        }, open: function(path, flags, mode, fd_start, fd_end) {
          if (path === "") {
            throw new FS.ErrnoError(2);
          }
          flags = typeof flags === "string" ? FS.modeStringToFlags(flags) : flags;
          mode = typeof mode === "undefined" ? 438 : mode;
          if (flags & 64) {
            mode = mode & 4095 | 32768;
          } else {
            mode = 0;
          }
          var node;
          if (typeof path === "object") {
            node = path;
          } else {
            path = PATH.normalize(path);
            try {
              var lookup = FS.lookupPath(path, { follow: !(flags & 131072) });
              node = lookup.node;
            } catch (e) {
            }
          }
          var created = false;
          if (flags & 64) {
            if (node) {
              if (flags & 128) {
                throw new FS.ErrnoError(17);
              }
            } else {
              node = FS.mknod(path, mode, 0);
              created = true;
            }
          }
          if (!node) {
            throw new FS.ErrnoError(2);
          }
          if (FS.isChrdev(node.mode)) {
            flags &= ~512;
          }
          if (flags & 65536 && !FS.isDir(node.mode)) {
            throw new FS.ErrnoError(20);
          }
          if (!created) {
            var err2 = FS.mayOpen(node, flags);
            if (err2) {
              throw new FS.ErrnoError(err2);
            }
          }
          if (flags & 512) {
            FS.truncate(node, 0);
          }
          flags &= ~(128 | 512);
          var stream = FS.createStream({ node, path: FS.getPath(node), flags, seekable: true, position: 0, stream_ops: node.stream_ops, ungotten: [], error: false }, fd_start, fd_end);
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
          if (Module["logReadFiles"] && !(flags & 1)) {
            if (!FS.readFiles) FS.readFiles = {};
            if (!(path in FS.readFiles)) {
              FS.readFiles[path] = 1;
              console.log("FS.trackingDelegate error on read file: " + path);
            }
          }
          try {
            if (FS.trackingDelegate["onOpenFile"]) {
              var trackingFlags = 0;
              if ((flags & 2097155) !== 1) {
                trackingFlags |= FS.tracking.openFlags.READ;
              }
              if ((flags & 2097155) !== 0) {
                trackingFlags |= FS.tracking.openFlags.WRITE;
              }
              FS.trackingDelegate["onOpenFile"](path, trackingFlags);
            }
          } catch (e) {
            console.log("FS.trackingDelegate['onOpenFile']('" + path + "', flags) threw an exception: " + e.message);
          }
          return stream;
        }, close: function(stream) {
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(9);
          }
          if (stream.getdents) stream.getdents = null;
          try {
            if (stream.stream_ops.close) {
              stream.stream_ops.close(stream);
            }
          } catch (e) {
            throw e;
          } finally {
            FS.closeStream(stream.fd);
          }
          stream.fd = null;
        }, isClosed: function(stream) {
          return stream.fd === null;
        }, llseek: function(stream, offset, whence) {
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(9);
          }
          if (!stream.seekable || !stream.stream_ops.llseek) {
            throw new FS.ErrnoError(29);
          }
          if (whence != 0 && whence != 1 && whence != 2) {
            throw new FS.ErrnoError(22);
          }
          stream.position = stream.stream_ops.llseek(stream, offset, whence);
          stream.ungotten = [];
          return stream.position;
        }, read: function(stream, buffer2, offset, length, position) {
          if (length < 0 || position < 0) {
            throw new FS.ErrnoError(22);
          }
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(9);
          }
          if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(9);
          }
          if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(21);
          }
          if (!stream.stream_ops.read) {
            throw new FS.ErrnoError(22);
          }
          var seeking = typeof position !== "undefined";
          if (!seeking) {
            position = stream.position;
          } else if (!stream.seekable) {
            throw new FS.ErrnoError(29);
          }
          var bytesRead = stream.stream_ops.read(stream, buffer2, offset, length, position);
          if (!seeking) stream.position += bytesRead;
          return bytesRead;
        }, write: function(stream, buffer2, offset, length, position, canOwn) {
          if (length < 0 || position < 0) {
            throw new FS.ErrnoError(22);
          }
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(9);
          }
          if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(9);
          }
          if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(21);
          }
          if (!stream.stream_ops.write) {
            throw new FS.ErrnoError(22);
          }
          if (stream.flags & 1024) {
            FS.llseek(stream, 0, 2);
          }
          var seeking = typeof position !== "undefined";
          if (!seeking) {
            position = stream.position;
          } else if (!stream.seekable) {
            throw new FS.ErrnoError(29);
          }
          var bytesWritten = stream.stream_ops.write(stream, buffer2, offset, length, position, canOwn);
          if (!seeking) stream.position += bytesWritten;
          try {
            if (stream.path && FS.trackingDelegate["onWriteToFile"]) FS.trackingDelegate["onWriteToFile"](stream.path);
          } catch (e) {
            console.log("FS.trackingDelegate['onWriteToFile']('" + stream.path + "') threw an exception: " + e.message);
          }
          return bytesWritten;
        }, allocate: function(stream, offset, length) {
          if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(9);
          }
          if (offset < 0 || length <= 0) {
            throw new FS.ErrnoError(22);
          }
          if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(9);
          }
          if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(19);
          }
          if (!stream.stream_ops.allocate) {
            throw new FS.ErrnoError(95);
          }
          stream.stream_ops.allocate(stream, offset, length);
        }, mmap: function(stream, buffer2, offset, length, position, prot, flags) {
          if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
            throw new FS.ErrnoError(13);
          }
          if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(13);
          }
          if (!stream.stream_ops.mmap) {
            throw new FS.ErrnoError(19);
          }
          return stream.stream_ops.mmap(stream, buffer2, offset, length, position, prot, flags);
        }, msync: function(stream, buffer2, offset, length, mmapFlags) {
          if (!stream || !stream.stream_ops.msync) {
            return 0;
          }
          return stream.stream_ops.msync(stream, buffer2, offset, length, mmapFlags);
        }, munmap: function(stream) {
          return 0;
        }, ioctl: function(stream, cmd, arg) {
          if (!stream.stream_ops.ioctl) {
            throw new FS.ErrnoError(25);
          }
          return stream.stream_ops.ioctl(stream, cmd, arg);
        }, readFile: function(path, opts) {
          opts = opts || {};
          opts.flags = opts.flags || "r";
          opts.encoding = opts.encoding || "binary";
          if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
            throw new Error('Invalid encoding type "' + opts.encoding + '"');
          }
          var ret;
          var stream = FS.open(path, opts.flags);
          var stat = FS.stat(path);
          var length = stat.size;
          var buf = new Uint8Array(length);
          FS.read(stream, buf, 0, length, 0);
          if (opts.encoding === "utf8") {
            ret = UTF8ArrayToString(buf, 0);
          } else if (opts.encoding === "binary") {
            ret = buf;
          }
          FS.close(stream);
          return ret;
        }, writeFile: function(path, data, opts) {
          opts = opts || {};
          opts.flags = opts.flags || "w";
          var stream = FS.open(path, opts.flags, opts.mode);
          if (typeof data === "string") {
            var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
            var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
            FS.write(stream, buf, 0, actualNumBytes, void 0, opts.canOwn);
          } else if (ArrayBuffer.isView(data)) {
            FS.write(stream, data, 0, data.byteLength, void 0, opts.canOwn);
          } else {
            throw new Error("Unsupported data type");
          }
          FS.close(stream);
        }, cwd: function() {
          return FS.currentPath;
        }, chdir: function(path) {
          var lookup = FS.lookupPath(path, { follow: true });
          if (lookup.node === null) {
            throw new FS.ErrnoError(2);
          }
          if (!FS.isDir(lookup.node.mode)) {
            throw new FS.ErrnoError(20);
          }
          var err2 = FS.nodePermissions(lookup.node, "x");
          if (err2) {
            throw new FS.ErrnoError(err2);
          }
          FS.currentPath = lookup.path;
        }, createDefaultDirectories: function() {
          FS.mkdir("/tmp");
          FS.mkdir("/home");
          FS.mkdir("/home/web_user");
        }, createDefaultDevices: function() {
          FS.mkdir("/dev");
          FS.registerDevice(FS.makedev(1, 3), { read: function() {
            return 0;
          }, write: function(stream, buffer2, offset, length, pos) {
            return length;
          } });
          FS.mkdev("/dev/null", FS.makedev(1, 3));
          TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
          TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
          FS.mkdev("/dev/tty", FS.makedev(5, 0));
          FS.mkdev("/dev/tty1", FS.makedev(6, 0));
          var random_device;
          if (typeof crypto === "object" && typeof crypto["getRandomValues"] === "function") {
            var randomBuffer = new Uint8Array(1);
            random_device = function() {
              crypto.getRandomValues(randomBuffer);
              return randomBuffer[0];
            };
          } else if (ENVIRONMENT_IS_NODE) {
            try {
              var crypto_module = require("crypto");
              random_device = function() {
                return crypto_module["randomBytes"](1)[0];
              };
            } catch (e) {
            }
          } else {
          }
          if (!random_device) {
            random_device = function() {
              abort("random_device");
            };
          }
          FS.createDevice("/dev", "random", random_device);
          FS.createDevice("/dev", "urandom", random_device);
          FS.mkdir("/dev/shm");
          FS.mkdir("/dev/shm/tmp");
        }, createSpecialDirectories: function() {
          FS.mkdir("/proc");
          FS.mkdir("/proc/self");
          FS.mkdir("/proc/self/fd");
          FS.mount({ mount: function() {
            var node = FS.createNode("/proc/self", "fd", 16384 | 511, 73);
            node.node_ops = { lookup: function(parent, name) {
              var fd = +name;
              var stream = FS.getStream(fd);
              if (!stream) throw new FS.ErrnoError(9);
              var ret = { parent: null, mount: { mountpoint: "fake" }, node_ops: { readlink: function() {
                return stream.path;
              } } };
              ret.parent = ret;
              return ret;
            } };
            return node;
          } }, {}, "/proc/self/fd");
        }, createStandardStreams: function() {
          if (Module["stdin"]) {
            FS.createDevice("/dev", "stdin", Module["stdin"]);
          } else {
            FS.symlink("/dev/tty", "/dev/stdin");
          }
          if (Module["stdout"]) {
            FS.createDevice("/dev", "stdout", null, Module["stdout"]);
          } else {
            FS.symlink("/dev/tty", "/dev/stdout");
          }
          if (Module["stderr"]) {
            FS.createDevice("/dev", "stderr", null, Module["stderr"]);
          } else {
            FS.symlink("/dev/tty1", "/dev/stderr");
          }
          var stdin = FS.open("/dev/stdin", "r");
          var stdout = FS.open("/dev/stdout", "w");
          var stderr = FS.open("/dev/stderr", "w");
        }, ensureErrnoError: function() {
          if (FS.ErrnoError) return;
          FS.ErrnoError = function ErrnoError(errno, node) {
            this.node = node;
            this.setErrno = function(errno2) {
              this.errno = errno2;
            };
            this.setErrno(errno);
            this.message = "FS error";
          };
          FS.ErrnoError.prototype = new Error();
          FS.ErrnoError.prototype.constructor = FS.ErrnoError;
          [2].forEach(function(code) {
            FS.genericErrors[code] = new FS.ErrnoError(code);
            FS.genericErrors[code].stack = "<generic error, no stack>";
          });
        }, staticInit: function() {
          FS.ensureErrnoError();
          FS.nameTable = new Array(4096);
          FS.mount(MEMFS, {}, "/");
          FS.createDefaultDirectories();
          FS.createDefaultDevices();
          FS.createSpecialDirectories();
          FS.filesystems = { "MEMFS": MEMFS, "IDBFS": IDBFS, "NODEFS": NODEFS, "WORKERFS": WORKERFS };
        }, init: function(input, output, error) {
          FS.init.initialized = true;
          FS.ensureErrnoError();
          Module["stdin"] = input || Module["stdin"];
          Module["stdout"] = output || Module["stdout"];
          Module["stderr"] = error || Module["stderr"];
          FS.createStandardStreams();
        }, quit: function() {
          FS.init.initialized = false;
          var fflush = Module["_fflush"];
          if (fflush) fflush(0);
          for (var i2 = 0; i2 < FS.streams.length; i2++) {
            var stream = FS.streams[i2];
            if (!stream) {
              continue;
            }
            FS.close(stream);
          }
        }, getMode: function(canRead, canWrite) {
          var mode = 0;
          if (canRead) mode |= 292 | 73;
          if (canWrite) mode |= 146;
          return mode;
        }, joinPath: function(parts, forceRelative) {
          var path = PATH.join.apply(null, parts);
          if (forceRelative && path[0] == "/") path = path.substr(1);
          return path;
        }, absolutePath: function(relative, base) {
          return PATH_FS.resolve(base, relative);
        }, standardizePath: function(path) {
          return PATH.normalize(path);
        }, findObject: function(path, dontResolveLastLink) {
          var ret = FS.analyzePath(path, dontResolveLastLink);
          if (ret.exists) {
            return ret.object;
          } else {
            ___setErrNo(ret.error);
            return null;
          }
        }, analyzePath: function(path, dontResolveLastLink) {
          try {
            var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
            path = lookup.path;
          } catch (e) {
          }
          var ret = { isRoot: false, exists: false, error: 0, name: null, path: null, object: null, parentExists: false, parentPath: null, parentObject: null };
          try {
            var lookup = FS.lookupPath(path, { parent: true });
            ret.parentExists = true;
            ret.parentPath = lookup.path;
            ret.parentObject = lookup.node;
            ret.name = PATH.basename(path);
            lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
            ret.exists = true;
            ret.path = lookup.path;
            ret.object = lookup.node;
            ret.name = lookup.node.name;
            ret.isRoot = lookup.path === "/";
          } catch (e) {
            ret.error = e.errno;
          }
          return ret;
        }, createFolder: function(parent, name, canRead, canWrite) {
          var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
          var mode = FS.getMode(canRead, canWrite);
          return FS.mkdir(path, mode);
        }, createPath: function(parent, path, canRead, canWrite) {
          parent = typeof parent === "string" ? parent : FS.getPath(parent);
          var parts = path.split("/").reverse();
          while (parts.length) {
            var part = parts.pop();
            if (!part) continue;
            var current = PATH.join2(parent, part);
            try {
              FS.mkdir(current);
            } catch (e) {
            }
            parent = current;
          }
          return current;
        }, createFile: function(parent, name, properties, canRead, canWrite) {
          var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
          var mode = FS.getMode(canRead, canWrite);
          return FS.create(path, mode);
        }, createDataFile: function(parent, name, data, canRead, canWrite, canOwn) {
          var path = name ? PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name) : parent;
          var mode = FS.getMode(canRead, canWrite);
          var node = FS.create(path, mode);
          if (data) {
            if (typeof data === "string") {
              var arr = new Array(data.length);
              for (var i2 = 0, len = data.length; i2 < len; ++i2) arr[i2] = data.charCodeAt(i2);
              data = arr;
            }
            FS.chmod(node, mode | 146);
            var stream = FS.open(node, "w");
            FS.write(stream, data, 0, data.length, 0, canOwn);
            FS.close(stream);
            FS.chmod(node, mode);
          }
          return node;
        }, createDevice: function(parent, name, input, output) {
          var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
          var mode = FS.getMode(!!input, !!output);
          if (!FS.createDevice.major) FS.createDevice.major = 64;
          var dev = FS.makedev(FS.createDevice.major++, 0);
          FS.registerDevice(dev, { open: function(stream) {
            stream.seekable = false;
          }, close: function(stream) {
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          }, read: function(stream, buffer2, offset, length, pos) {
            var bytesRead = 0;
            for (var i2 = 0; i2 < length; i2++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(5);
              }
              if (result === void 0 && bytesRead === 0) {
                throw new FS.ErrnoError(11);
              }
              if (result === null || result === void 0) break;
              bytesRead++;
              buffer2[offset + i2] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          }, write: function(stream, buffer2, offset, length, pos) {
            for (var i2 = 0; i2 < length; i2++) {
              try {
                output(buffer2[offset + i2]);
              } catch (e) {
                throw new FS.ErrnoError(5);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i2;
          } });
          return FS.mkdev(path, mode, dev);
        }, createLink: function(parent, name, target, canRead, canWrite) {
          var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
          return FS.symlink(target, path);
        }, forceLoadFile: function(obj) {
          if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
          var success = true;
          if (typeof XMLHttpRequest !== "undefined") {
            throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
          } else if (read_) {
            try {
              obj.contents = intArrayFromString(read_(obj.url), true);
              obj.usedBytes = obj.contents.length;
            } catch (e) {
              success = false;
            }
          } else {
            throw new Error("Cannot load without read() or XMLHttpRequest.");
          }
          if (!success) ___setErrNo(5);
          return success;
        }, createLazyFile: function(parent, name, url, canRead, canWrite) {
          function LazyUint8Array() {
            this.lengthKnown = false;
            this.chunks = [];
          }
          LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
            if (idx > this.length - 1 || idx < 0) {
              return void 0;
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = idx / this.chunkSize | 0;
            return this.getter(chunkNum)[chunkOffset];
          };
          LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
            this.getter = getter;
          };
          LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
            var xhr = new XMLHttpRequest();
            xhr.open("HEAD", url, false);
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            var datalength = Number(xhr.getResponseHeader("Content-length"));
            var header;
            var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
            var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
            var chunkSize = 1024 * 1024;
            if (!hasByteServing) chunkSize = datalength;
            var doXHR = function(from, to) {
              if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
              if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");
              var xhr2 = new XMLHttpRequest();
              xhr2.open("GET", url, false);
              if (datalength !== chunkSize) xhr2.setRequestHeader("Range", "bytes=" + from + "-" + to);
              if (typeof Uint8Array != "undefined") xhr2.responseType = "arraybuffer";
              if (xhr2.overrideMimeType) {
                xhr2.overrideMimeType("text/plain; charset=x-user-defined");
              }
              xhr2.send(null);
              if (!(xhr2.status >= 200 && xhr2.status < 300 || xhr2.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr2.status);
              if (xhr2.response !== void 0) {
                return new Uint8Array(xhr2.response || []);
              } else {
                return intArrayFromString(xhr2.responseText || "", true);
              }
            };
            var lazyArray2 = this;
            lazyArray2.setDataGetter(function(chunkNum) {
              var start = chunkNum * chunkSize;
              var end = (chunkNum + 1) * chunkSize - 1;
              end = Math.min(end, datalength - 1);
              if (typeof lazyArray2.chunks[chunkNum] === "undefined") {
                lazyArray2.chunks[chunkNum] = doXHR(start, end);
              }
              if (typeof lazyArray2.chunks[chunkNum] === "undefined") throw new Error("doXHR failed!");
              return lazyArray2.chunks[chunkNum];
            });
            if (usesGzip || !datalength) {
              chunkSize = datalength = 1;
              datalength = this.getter(0).length;
              chunkSize = datalength;
              console.log("LazyFiles on gzip forces download of the whole file when length is accessed");
            }
            this._length = datalength;
            this._chunkSize = chunkSize;
            this.lengthKnown = true;
          };
          if (typeof XMLHttpRequest !== "undefined") {
            if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
            var lazyArray = new LazyUint8Array();
            Object.defineProperties(lazyArray, { length: { get: function() {
              if (!this.lengthKnown) {
                this.cacheLength();
              }
              return this._length;
            } }, chunkSize: { get: function() {
              if (!this.lengthKnown) {
                this.cacheLength();
              }
              return this._chunkSize;
            } } });
            var properties = { isDevice: false, contents: lazyArray };
          } else {
            var properties = { isDevice: false, url };
          }
          var node = FS.createFile(parent, name, properties, canRead, canWrite);
          if (properties.contents) {
            node.contents = properties.contents;
          } else if (properties.url) {
            node.contents = null;
            node.url = properties.url;
          }
          Object.defineProperties(node, { usedBytes: { get: function() {
            return this.contents.length;
          } } });
          var stream_ops = {};
          var keys = Object.keys(node.stream_ops);
          keys.forEach(function(key2) {
            var fn = node.stream_ops[key2];
            stream_ops[key2] = function forceLoadLazyFile() {
              if (!FS.forceLoadFile(node)) {
                throw new FS.ErrnoError(5);
              }
              return fn.apply(null, arguments);
            };
          });
          stream_ops.read = function stream_ops_read(stream, buffer2, offset, length, position) {
            if (!FS.forceLoadFile(node)) {
              throw new FS.ErrnoError(5);
            }
            var contents = stream.node.contents;
            if (position >= contents.length) return 0;
            var size = Math.min(contents.length - position, length);
            if (contents.slice) {
              for (var i2 = 0; i2 < size; i2++) {
                buffer2[offset + i2] = contents[position + i2];
              }
            } else {
              for (var i2 = 0; i2 < size; i2++) {
                buffer2[offset + i2] = contents.get(position + i2);
              }
            }
            return size;
          };
          node.stream_ops = stream_ops;
          return node;
        }, createPreloadedFile: function(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
          Browser.init();
          var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
          var dep = getUniqueRunDependency("cp " + fullname);
          function processData(byteArray) {
            function finish(byteArray2) {
              if (preFinish) preFinish();
              if (!dontCreateFile) {
                FS.createDataFile(parent, name, byteArray2, canRead, canWrite, canOwn);
              }
              if (onload) onload();
              removeRunDependency(dep);
            }
            var handled = false;
            Module["preloadPlugins"].forEach(function(plugin) {
              if (handled) return;
              if (plugin["canHandle"](fullname)) {
                plugin["handle"](byteArray, fullname, finish, function() {
                  if (onerror) onerror();
                  removeRunDependency(dep);
                });
                handled = true;
              }
            });
            if (!handled) finish(byteArray);
          }
          addRunDependency(dep);
          if (typeof url == "string") {
            Browser.asyncLoad(url, function(byteArray) {
              processData(byteArray);
            }, onerror);
          } else {
            processData(url);
          }
        }, indexedDB: function() {
          return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        }, DB_NAME: function() {
          return "EM_FS_" + window.location.pathname;
        }, DB_VERSION: 20, DB_STORE_NAME: "FILE_DATA", saveFilesToDB: function(paths, onload, onerror) {
          onload = onload || function() {
          };
          onerror = onerror || function() {
          };
          var indexedDB2 = FS.indexedDB();
          try {
            var openRequest = indexedDB2.open(FS.DB_NAME(), FS.DB_VERSION);
          } catch (e) {
            return onerror(e);
          }
          openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
            console.log("creating db");
            var db = openRequest.result;
            db.createObjectStore(FS.DB_STORE_NAME);
          };
          openRequest.onsuccess = function openRequest_onsuccess() {
            var db = openRequest.result;
            var transaction = db.transaction([FS.DB_STORE_NAME], "readwrite");
            var files = transaction.objectStore(FS.DB_STORE_NAME);
            var ok = 0, fail = 0, total = paths.length;
            function finish() {
              if (fail == 0) onload();
              else onerror();
            }
            paths.forEach(function(path) {
              var putRequest = files.put(FS.analyzePath(path).object.contents, path);
              putRequest.onsuccess = function putRequest_onsuccess() {
                ok++;
                if (ok + fail == total) finish();
              };
              putRequest.onerror = function putRequest_onerror() {
                fail++;
                if (ok + fail == total) finish();
              };
            });
            transaction.onerror = onerror;
          };
          openRequest.onerror = onerror;
        }, loadFilesFromDB: function(paths, onload, onerror) {
          onload = onload || function() {
          };
          onerror = onerror || function() {
          };
          var indexedDB2 = FS.indexedDB();
          try {
            var openRequest = indexedDB2.open(FS.DB_NAME(), FS.DB_VERSION);
          } catch (e) {
            return onerror(e);
          }
          openRequest.onupgradeneeded = onerror;
          openRequest.onsuccess = function openRequest_onsuccess() {
            var db = openRequest.result;
            try {
              var transaction = db.transaction([FS.DB_STORE_NAME], "readonly");
            } catch (e) {
              onerror(e);
              return;
            }
            var files = transaction.objectStore(FS.DB_STORE_NAME);
            var ok = 0, fail = 0, total = paths.length;
            function finish() {
              if (fail == 0) onload();
              else onerror();
            }
            paths.forEach(function(path) {
              var getRequest = files.get(path);
              getRequest.onsuccess = function getRequest_onsuccess() {
                if (FS.analyzePath(path).exists) {
                  FS.unlink(path);
                }
                FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
                ok++;
                if (ok + fail == total) finish();
              };
              getRequest.onerror = function getRequest_onerror() {
                fail++;
                if (ok + fail == total) finish();
              };
            });
            transaction.onerror = onerror;
          };
          openRequest.onerror = onerror;
        } };
        var SYSCALLS = { DEFAULT_POLLMASK: 5, mappings: {}, umask: 511, calculateAt: function(dirfd, path) {
          if (path[0] !== "/") {
            var dir;
            if (dirfd === -100) {
              dir = FS.cwd();
            } else {
              var dirstream = FS.getStream(dirfd);
              if (!dirstream) throw new FS.ErrnoError(9);
              dir = dirstream.path;
            }
            path = PATH.join2(dir, path);
          }
          return path;
        }, doStat: function(func, path, buf) {
          try {
            var stat = func(path);
          } catch (e) {
            if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
              return -20;
            }
            throw e;
          }
          HEAP32[buf >> 2] = stat.dev;
          HEAP32[buf + 4 >> 2] = 0;
          HEAP32[buf + 8 >> 2] = stat.ino;
          HEAP32[buf + 12 >> 2] = stat.mode;
          HEAP32[buf + 16 >> 2] = stat.nlink;
          HEAP32[buf + 20 >> 2] = stat.uid;
          HEAP32[buf + 24 >> 2] = stat.gid;
          HEAP32[buf + 28 >> 2] = stat.rdev;
          HEAP32[buf + 32 >> 2] = 0;
          tempI64 = [stat.size >>> 0, (tempDouble = stat.size, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 40 >> 2] = tempI64[0], HEAP32[buf + 44 >> 2] = tempI64[1];
          HEAP32[buf + 48 >> 2] = 4096;
          HEAP32[buf + 52 >> 2] = stat.blocks;
          HEAP32[buf + 56 >> 2] = stat.atime.getTime() / 1e3 | 0;
          HEAP32[buf + 60 >> 2] = 0;
          HEAP32[buf + 64 >> 2] = stat.mtime.getTime() / 1e3 | 0;
          HEAP32[buf + 68 >> 2] = 0;
          HEAP32[buf + 72 >> 2] = stat.ctime.getTime() / 1e3 | 0;
          HEAP32[buf + 76 >> 2] = 0;
          tempI64 = [stat.ino >>> 0, (tempDouble = stat.ino, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 80 >> 2] = tempI64[0], HEAP32[buf + 84 >> 2] = tempI64[1];
          return 0;
        }, doMsync: function(addr, stream, len, flags) {
          var buffer2 = new Uint8Array(HEAPU8.subarray(addr, addr + len));
          FS.msync(stream, buffer2, 0, len, flags);
        }, doMkdir: function(path, mode) {
          path = PATH.normalize(path);
          if (path[path.length - 1] === "/") path = path.substr(0, path.length - 1);
          FS.mkdir(path, mode, 0);
          return 0;
        }, doMknod: function(path, mode, dev) {
          switch (mode & 61440) {
            case 32768:
            case 8192:
            case 24576:
            case 4096:
            case 49152:
              break;
            default:
              return -22;
          }
          FS.mknod(path, mode, dev);
          return 0;
        }, doReadlink: function(path, buf, bufsize) {
          if (bufsize <= 0) return -22;
          var ret = FS.readlink(path);
          var len = Math.min(bufsize, lengthBytesUTF8(ret));
          var endChar = HEAP8[buf + len];
          stringToUTF8(ret, buf, bufsize + 1);
          HEAP8[buf + len] = endChar;
          return len;
        }, doAccess: function(path, amode) {
          if (amode & ~7) {
            return -22;
          }
          var node;
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
          if (!node) {
            return -2;
          }
          var perms = "";
          if (amode & 4) perms += "r";
          if (amode & 2) perms += "w";
          if (amode & 1) perms += "x";
          if (perms && FS.nodePermissions(node, perms)) {
            return -13;
          }
          return 0;
        }, doDup: function(path, flags, suggestFD) {
          var suggest = FS.getStream(suggestFD);
          if (suggest) FS.close(suggest);
          return FS.open(path, flags, 0, suggestFD, suggestFD).fd;
        }, doReadv: function(stream, iov, iovcnt, offset) {
          var ret = 0;
          for (var i2 = 0; i2 < iovcnt; i2++) {
            var ptr = HEAP32[iov + i2 * 8 >> 2];
            var len = HEAP32[iov + (i2 * 8 + 4) >> 2];
            var curr = FS.read(stream, HEAP8, ptr, len, offset);
            if (curr < 0) return -1;
            ret += curr;
            if (curr < len) break;
          }
          return ret;
        }, doWritev: function(stream, iov, iovcnt, offset) {
          var ret = 0;
          for (var i2 = 0; i2 < iovcnt; i2++) {
            var ptr = HEAP32[iov + i2 * 8 >> 2];
            var len = HEAP32[iov + (i2 * 8 + 4) >> 2];
            var curr = FS.write(stream, HEAP8, ptr, len, offset);
            if (curr < 0) return -1;
            ret += curr;
          }
          return ret;
        }, varargs: 0, get: function(varargs) {
          SYSCALLS.varargs += 4;
          var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
          return ret;
        }, getStr: function() {
          var ret = UTF8ToString(SYSCALLS.get());
          return ret;
        }, getStreamFromFD: function() {
          var stream = FS.getStream(SYSCALLS.get());
          if (!stream) throw new FS.ErrnoError(9);
          return stream;
        }, get64: function() {
          var low = SYSCALLS.get(), high = SYSCALLS.get();
          return low;
        }, getZero: function() {
          SYSCALLS.get();
        } };
        function ___syscall140(which, varargs) {
          SYSCALLS.varargs = varargs;
          try {
            var stream = SYSCALLS.getStreamFromFD(), offset_high = SYSCALLS.get(), offset_low = SYSCALLS.get(), result = SYSCALLS.get(), whence = SYSCALLS.get();
            var HIGH_OFFSET = 4294967296;
            var offset = offset_high * HIGH_OFFSET + (offset_low >>> 0);
            var DOUBLE_LIMIT = 9007199254740992;
            if (offset <= -DOUBLE_LIMIT || offset >= DOUBLE_LIMIT) {
              return -75;
            }
            FS.llseek(stream, offset, whence);
            tempI64 = [stream.position >>> 0, (tempDouble = stream.position, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[result >> 2] = tempI64[0], HEAP32[result + 4 >> 2] = tempI64[1];
            if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
            return 0;
          } catch (e) {
            if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
            return -e.errno;
          }
        }
        function ___syscall145(which, varargs) {
          SYSCALLS.varargs = varargs;
          try {
            var stream = SYSCALLS.getStreamFromFD(), iov = SYSCALLS.get(), iovcnt = SYSCALLS.get();
            return SYSCALLS.doReadv(stream, iov, iovcnt);
          } catch (e) {
            if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
            return -e.errno;
          }
        }
        function ___syscall146(which, varargs) {
          SYSCALLS.varargs = varargs;
          try {
            var stream = SYSCALLS.getStreamFromFD(), iov = SYSCALLS.get(), iovcnt = SYSCALLS.get();
            return SYSCALLS.doWritev(stream, iov, iovcnt);
          } catch (e) {
            if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
            return -e.errno;
          }
        }
        function ___syscall54(which, varargs) {
          SYSCALLS.varargs = varargs;
          try {
            var stream = SYSCALLS.getStreamFromFD(), op = SYSCALLS.get();
            switch (op) {
              case 21509:
              case 21505: {
                if (!stream.tty) return -25;
                return 0;
              }
              case 21510:
              case 21511:
              case 21512:
              case 21506:
              case 21507:
              case 21508: {
                if (!stream.tty) return -25;
                return 0;
              }
              case 21519: {
                if (!stream.tty) return -25;
                var argp = SYSCALLS.get();
                HEAP32[argp >> 2] = 0;
                return 0;
              }
              case 21520: {
                if (!stream.tty) return -25;
                return -22;
              }
              case 21531: {
                var argp = SYSCALLS.get();
                return FS.ioctl(stream, op, argp);
              }
              case 21523: {
                if (!stream.tty) return -25;
                return 0;
              }
              case 21524: {
                if (!stream.tty) return -25;
                return 0;
              }
              default:
                abort("bad ioctl syscall " + op);
            }
          } catch (e) {
            if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
            return -e.errno;
          }
        }
        function ___syscall6(which, varargs) {
          SYSCALLS.varargs = varargs;
          try {
            var stream = SYSCALLS.getStreamFromFD();
            FS.close(stream);
            return 0;
          } catch (e) {
            if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
            return -e.errno;
          }
        }
        function __emscripten_syscall_munmap(addr, len) {
          if (addr === -1 || len === 0) {
            return -22;
          }
          var info = SYSCALLS.mappings[addr];
          if (!info) return 0;
          if (len === info.len) {
            var stream = FS.getStream(info.fd);
            SYSCALLS.doMsync(addr, stream, len, info.flags);
            FS.munmap(stream);
            SYSCALLS.mappings[addr] = null;
            if (info.allocated) {
              _free(info.malloc);
            }
          }
          return 0;
        }
        function ___syscall91(which, varargs) {
          SYSCALLS.varargs = varargs;
          try {
            var addr = SYSCALLS.get(), len = SYSCALLS.get();
            return __emscripten_syscall_munmap(addr, len);
          } catch (e) {
            if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
            return -e.errno;
          }
        }
        function ___unlock() {
        }
        var structRegistrations = {};
        function runDestructors(destructors) {
          while (destructors.length) {
            var ptr = destructors.pop();
            var del = destructors.pop();
            del(ptr);
          }
        }
        function simpleReadValueFromPointer(pointer) {
          return this["fromWireType"](HEAPU32[pointer >> 2]);
        }
        var awaitingDependencies = {};
        var registeredTypes = {};
        var typeDependencies = {};
        var char_0 = 48;
        var char_9 = 57;
        function makeLegalFunctionName(name) {
          if (void 0 === name) {
            return "_unknown";
          }
          name = name.replace(/[^a-zA-Z0-9_]/g, "$");
          var f = name.charCodeAt(0);
          if (f >= char_0 && f <= char_9) {
            return "_" + name;
          } else {
            return name;
          }
        }
        function createNamedFunction(name, body) {
          name = makeLegalFunctionName(name);
          return new Function("body", "return function " + name + '() {\n    "use strict";    return body.apply(this, arguments);\n};\n')(body);
        }
        function extendError(baseErrorType, errorName) {
          var errorClass = createNamedFunction(errorName, function(message) {
            this.name = errorName;
            this.message = message;
            var stack = new Error(message).stack;
            if (stack !== void 0) {
              this.stack = this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "");
            }
          });
          errorClass.prototype = Object.create(baseErrorType.prototype);
          errorClass.prototype.constructor = errorClass;
          errorClass.prototype.toString = function() {
            if (this.message === void 0) {
              return this.name;
            } else {
              return this.name + ": " + this.message;
            }
          };
          return errorClass;
        }
        var InternalError = void 0;
        function throwInternalError(message) {
          throw new InternalError(message);
        }
        function whenDependentTypesAreResolved(myTypes, dependentTypes, getTypeConverters) {
          myTypes.forEach(function(type) {
            typeDependencies[type] = dependentTypes;
          });
          function onComplete(typeConverters2) {
            var myTypeConverters = getTypeConverters(typeConverters2);
            if (myTypeConverters.length !== myTypes.length) {
              throwInternalError("Mismatched type converter count");
            }
            for (var i2 = 0; i2 < myTypes.length; ++i2) {
              registerType(myTypes[i2], myTypeConverters[i2]);
            }
          }
          var typeConverters = new Array(dependentTypes.length);
          var unregisteredTypes = [];
          var registered = 0;
          dependentTypes.forEach(function(dt, i2) {
            if (registeredTypes.hasOwnProperty(dt)) {
              typeConverters[i2] = registeredTypes[dt];
            } else {
              unregisteredTypes.push(dt);
              if (!awaitingDependencies.hasOwnProperty(dt)) {
                awaitingDependencies[dt] = [];
              }
              awaitingDependencies[dt].push(function() {
                typeConverters[i2] = registeredTypes[dt];
                ++registered;
                if (registered === unregisteredTypes.length) {
                  onComplete(typeConverters);
                }
              });
            }
          });
          if (0 === unregisteredTypes.length) {
            onComplete(typeConverters);
          }
        }
        function __embind_finalize_value_object(structType) {
          var reg = structRegistrations[structType];
          delete structRegistrations[structType];
          var rawConstructor = reg.rawConstructor;
          var rawDestructor = reg.rawDestructor;
          var fieldRecords = reg.fields;
          var fieldTypes = fieldRecords.map(function(field) {
            return field.getterReturnType;
          }).concat(fieldRecords.map(function(field) {
            return field.setterArgumentType;
          }));
          whenDependentTypesAreResolved([structType], fieldTypes, function(fieldTypes2) {
            var fields = {};
            fieldRecords.forEach(function(field, i2) {
              var fieldName = field.fieldName;
              var getterReturnType = fieldTypes2[i2];
              var getter = field.getter;
              var getterContext = field.getterContext;
              var setterArgumentType = fieldTypes2[i2 + fieldRecords.length];
              var setter = field.setter;
              var setterContext = field.setterContext;
              fields[fieldName] = { read: function(ptr) {
                return getterReturnType["fromWireType"](getter(getterContext, ptr));
              }, write: function(ptr, o) {
                var destructors = [];
                setter(setterContext, ptr, setterArgumentType["toWireType"](destructors, o));
                runDestructors(destructors);
              } };
            });
            return [{ name: reg.name, "fromWireType": function(ptr) {
              var rv = {};
              for (var i2 in fields) {
                rv[i2] = fields[i2].read(ptr);
              }
              rawDestructor(ptr);
              return rv;
            }, "toWireType": function(destructors, o) {
              for (var fieldName in fields) {
                if (!(fieldName in o)) {
                  throw new TypeError("Missing field");
                }
              }
              var ptr = rawConstructor();
              for (fieldName in fields) {
                fields[fieldName].write(ptr, o[fieldName]);
              }
              if (destructors !== null) {
                destructors.push(rawDestructor, ptr);
              }
              return ptr;
            }, "argPackAdvance": 8, "readValueFromPointer": simpleReadValueFromPointer, destructorFunction: rawDestructor }];
          });
        }
        function getShiftFromSize(size) {
          switch (size) {
            case 1:
              return 0;
            case 2:
              return 1;
            case 4:
              return 2;
            case 8:
              return 3;
            default:
              throw new TypeError("Unknown type size: " + size);
          }
        }
        function embind_init_charCodes() {
          var codes = new Array(256);
          for (var i2 = 0; i2 < 256; ++i2) {
            codes[i2] = String.fromCharCode(i2);
          }
          embind_charCodes = codes;
        }
        var embind_charCodes = void 0;
        function readLatin1String(ptr) {
          var ret = "";
          var c = ptr;
          while (HEAPU8[c]) {
            ret += embind_charCodes[HEAPU8[c++]];
          }
          return ret;
        }
        var BindingError = void 0;
        function throwBindingError(message) {
          throw new BindingError(message);
        }
        function registerType(rawType, registeredInstance, options) {
          options = options || {};
          if (!("argPackAdvance" in registeredInstance)) {
            throw new TypeError("registerType registeredInstance requires argPackAdvance");
          }
          var name = registeredInstance.name;
          if (!rawType) {
            throwBindingError('type "' + name + '" must have a positive integer typeid pointer');
          }
          if (registeredTypes.hasOwnProperty(rawType)) {
            if (options.ignoreDuplicateRegistrations) {
              return;
            } else {
              throwBindingError("Cannot register type '" + name + "' twice");
            }
          }
          registeredTypes[rawType] = registeredInstance;
          delete typeDependencies[rawType];
          if (awaitingDependencies.hasOwnProperty(rawType)) {
            var callbacks = awaitingDependencies[rawType];
            delete awaitingDependencies[rawType];
            callbacks.forEach(function(cb) {
              cb();
            });
          }
        }
        function __embind_register_bool(rawType, name, size, trueValue, falseValue) {
          var shift = getShiftFromSize(size);
          name = readLatin1String(name);
          registerType(rawType, { name, "fromWireType": function(wt) {
            return !!wt;
          }, "toWireType": function(destructors, o) {
            return o ? trueValue : falseValue;
          }, "argPackAdvance": 8, "readValueFromPointer": function(pointer) {
            var heap;
            if (size === 1) {
              heap = HEAP8;
            } else if (size === 2) {
              heap = HEAP16;
            } else if (size === 4) {
              heap = HEAP32;
            } else {
              throw new TypeError("Unknown boolean type size: " + name);
            }
            return this["fromWireType"](heap[pointer >> shift]);
          }, destructorFunction: null });
        }
        function ClassHandle_isAliasOf(other) {
          if (!(this instanceof ClassHandle)) {
            return false;
          }
          if (!(other instanceof ClassHandle)) {
            return false;
          }
          var leftClass = this.$$.ptrType.registeredClass;
          var left = this.$$.ptr;
          var rightClass = other.$$.ptrType.registeredClass;
          var right = other.$$.ptr;
          while (leftClass.baseClass) {
            left = leftClass.upcast(left);
            leftClass = leftClass.baseClass;
          }
          while (rightClass.baseClass) {
            right = rightClass.upcast(right);
            rightClass = rightClass.baseClass;
          }
          return leftClass === rightClass && left === right;
        }
        function shallowCopyInternalPointer(o) {
          return { count: o.count, deleteScheduled: o.deleteScheduled, preservePointerOnDelete: o.preservePointerOnDelete, ptr: o.ptr, ptrType: o.ptrType, smartPtr: o.smartPtr, smartPtrType: o.smartPtrType };
        }
        function throwInstanceAlreadyDeleted(obj) {
          function getInstanceTypeName(handle) {
            return handle.$$.ptrType.registeredClass.name;
          }
          throwBindingError(getInstanceTypeName(obj) + " instance already deleted");
        }
        var finalizationGroup = false;
        function detachFinalizer(handle) {
        }
        function runDestructor($$) {
          if ($$.smartPtr) {
            $$.smartPtrType.rawDestructor($$.smartPtr);
          } else {
            $$.ptrType.registeredClass.rawDestructor($$.ptr);
          }
        }
        function releaseClassHandle($$) {
          $$.count.value -= 1;
          var toDelete = 0 === $$.count.value;
          if (toDelete) {
            runDestructor($$);
          }
        }
        function attachFinalizer(handle) {
          if ("undefined" === typeof FinalizationGroup) {
            attachFinalizer = function(handle2) {
              return handle2;
            };
            return handle;
          }
          finalizationGroup = new FinalizationGroup(function(iter) {
            for (var result = iter.next(); !result.done; result = iter.next()) {
              var $$ = result.value;
              if (!$$.ptr) {
                console.warn("object already deleted: " + $$.ptr);
              } else {
                releaseClassHandle($$);
              }
            }
          });
          attachFinalizer = function(handle2) {
            finalizationGroup.register(handle2, handle2.$$, handle2.$$);
            return handle2;
          };
          detachFinalizer = function(handle2) {
            finalizationGroup.unregister(handle2.$$);
          };
          return attachFinalizer(handle);
        }
        function ClassHandle_clone() {
          if (!this.$$.ptr) {
            throwInstanceAlreadyDeleted(this);
          }
          if (this.$$.preservePointerOnDelete) {
            this.$$.count.value += 1;
            return this;
          } else {
            var clone = attachFinalizer(Object.create(Object.getPrototypeOf(this), { $$: { value: shallowCopyInternalPointer(this.$$) } }));
            clone.$$.count.value += 1;
            clone.$$.deleteScheduled = false;
            return clone;
          }
        }
        function ClassHandle_delete() {
          if (!this.$$.ptr) {
            throwInstanceAlreadyDeleted(this);
          }
          if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
            throwBindingError("Object already scheduled for deletion");
          }
          detachFinalizer(this);
          releaseClassHandle(this.$$);
          if (!this.$$.preservePointerOnDelete) {
            this.$$.smartPtr = void 0;
            this.$$.ptr = void 0;
          }
        }
        function ClassHandle_isDeleted() {
          return !this.$$.ptr;
        }
        var delayFunction = void 0;
        var deletionQueue = [];
        function flushPendingDeletes() {
          while (deletionQueue.length) {
            var obj = deletionQueue.pop();
            obj.$$.deleteScheduled = false;
            obj["delete"]();
          }
        }
        function ClassHandle_deleteLater() {
          if (!this.$$.ptr) {
            throwInstanceAlreadyDeleted(this);
          }
          if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
            throwBindingError("Object already scheduled for deletion");
          }
          deletionQueue.push(this);
          if (deletionQueue.length === 1 && delayFunction) {
            delayFunction(flushPendingDeletes);
          }
          this.$$.deleteScheduled = true;
          return this;
        }
        function init_ClassHandle() {
          ClassHandle.prototype["isAliasOf"] = ClassHandle_isAliasOf;
          ClassHandle.prototype["clone"] = ClassHandle_clone;
          ClassHandle.prototype["delete"] = ClassHandle_delete;
          ClassHandle.prototype["isDeleted"] = ClassHandle_isDeleted;
          ClassHandle.prototype["deleteLater"] = ClassHandle_deleteLater;
        }
        function ClassHandle() {
        }
        var registeredPointers = {};
        function ensureOverloadTable(proto, methodName, humanName) {
          if (void 0 === proto[methodName].overloadTable) {
            var prevFunc = proto[methodName];
            proto[methodName] = function() {
              if (!proto[methodName].overloadTable.hasOwnProperty(arguments.length)) {
                throwBindingError("Function '" + humanName + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + proto[methodName].overloadTable + ")!");
              }
              return proto[methodName].overloadTable[arguments.length].apply(this, arguments);
            };
            proto[methodName].overloadTable = [];
            proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
          }
        }
        function exposePublicSymbol(name, value, numArguments) {
          if (Module.hasOwnProperty(name)) {
            if (void 0 === numArguments || void 0 !== Module[name].overloadTable && void 0 !== Module[name].overloadTable[numArguments]) {
              throwBindingError("Cannot register public name '" + name + "' twice");
            }
            ensureOverloadTable(Module, name, name);
            if (Module.hasOwnProperty(numArguments)) {
              throwBindingError("Cannot register multiple overloads of a function with the same number of arguments (" + numArguments + ")!");
            }
            Module[name].overloadTable[numArguments] = value;
          } else {
            Module[name] = value;
            if (void 0 !== numArguments) {
              Module[name].numArguments = numArguments;
            }
          }
        }
        function RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast) {
          this.name = name;
          this.constructor = constructor;
          this.instancePrototype = instancePrototype;
          this.rawDestructor = rawDestructor;
          this.baseClass = baseClass;
          this.getActualType = getActualType;
          this.upcast = upcast;
          this.downcast = downcast;
          this.pureVirtualFunctions = [];
        }
        function upcastPointer(ptr, ptrClass, desiredClass) {
          while (ptrClass !== desiredClass) {
            if (!ptrClass.upcast) {
              throwBindingError("Expected null or instance of " + desiredClass.name + ", got an instance of " + ptrClass.name);
            }
            ptr = ptrClass.upcast(ptr);
            ptrClass = ptrClass.baseClass;
          }
          return ptr;
        }
        function constNoSmartPtrRawPointerToWireType(destructors, handle) {
          if (handle === null) {
            if (this.isReference) {
              throwBindingError("null is not a valid " + this.name);
            }
            return 0;
          }
          if (!handle.$$) {
            throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name);
          }
          if (!handle.$$.ptr) {
            throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
          }
          var handleClass = handle.$$.ptrType.registeredClass;
          var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
          return ptr;
        }
        function genericPointerToWireType(destructors, handle) {
          var ptr;
          if (handle === null) {
            if (this.isReference) {
              throwBindingError("null is not a valid " + this.name);
            }
            if (this.isSmartPointer) {
              ptr = this.rawConstructor();
              if (destructors !== null) {
                destructors.push(this.rawDestructor, ptr);
              }
              return ptr;
            } else {
              return 0;
            }
          }
          if (!handle.$$) {
            throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name);
          }
          if (!handle.$$.ptr) {
            throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
          }
          if (!this.isConst && handle.$$.ptrType.isConst) {
            throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name);
          }
          var handleClass = handle.$$.ptrType.registeredClass;
          ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
          if (this.isSmartPointer) {
            if (void 0 === handle.$$.smartPtr) {
              throwBindingError("Passing raw pointer to smart pointer is illegal");
            }
            switch (this.sharingPolicy) {
              case 0:
                if (handle.$$.smartPtrType === this) {
                  ptr = handle.$$.smartPtr;
                } else {
                  throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name);
                }
                break;
              case 1:
                ptr = handle.$$.smartPtr;
                break;
              case 2:
                if (handle.$$.smartPtrType === this) {
                  ptr = handle.$$.smartPtr;
                } else {
                  var clonedHandle = handle["clone"]();
                  ptr = this.rawShare(ptr, __emval_register(function() {
                    clonedHandle["delete"]();
                  }));
                  if (destructors !== null) {
                    destructors.push(this.rawDestructor, ptr);
                  }
                }
                break;
              default:
                throwBindingError("Unsupporting sharing policy");
            }
          }
          return ptr;
        }
        function nonConstNoSmartPtrRawPointerToWireType(destructors, handle) {
          if (handle === null) {
            if (this.isReference) {
              throwBindingError("null is not a valid " + this.name);
            }
            return 0;
          }
          if (!handle.$$) {
            throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name);
          }
          if (!handle.$$.ptr) {
            throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
          }
          if (handle.$$.ptrType.isConst) {
            throwBindingError("Cannot convert argument of type " + handle.$$.ptrType.name + " to parameter type " + this.name);
          }
          var handleClass = handle.$$.ptrType.registeredClass;
          var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
          return ptr;
        }
        function RegisteredPointer_getPointee(ptr) {
          if (this.rawGetPointee) {
            ptr = this.rawGetPointee(ptr);
          }
          return ptr;
        }
        function RegisteredPointer_destructor(ptr) {
          if (this.rawDestructor) {
            this.rawDestructor(ptr);
          }
        }
        function RegisteredPointer_deleteObject(handle) {
          if (handle !== null) {
            handle["delete"]();
          }
        }
        function downcastPointer(ptr, ptrClass, desiredClass) {
          if (ptrClass === desiredClass) {
            return ptr;
          }
          if (void 0 === desiredClass.baseClass) {
            return null;
          }
          var rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass);
          if (rv === null) {
            return null;
          }
          return desiredClass.downcast(rv);
        }
        function getInheritedInstanceCount() {
          return Object.keys(registeredInstances).length;
        }
        function getLiveInheritedInstances() {
          var rv = [];
          for (var k in registeredInstances) {
            if (registeredInstances.hasOwnProperty(k)) {
              rv.push(registeredInstances[k]);
            }
          }
          return rv;
        }
        function setDelayFunction(fn) {
          delayFunction = fn;
          if (deletionQueue.length && delayFunction) {
            delayFunction(flushPendingDeletes);
          }
        }
        function init_embind() {
          Module["getInheritedInstanceCount"] = getInheritedInstanceCount;
          Module["getLiveInheritedInstances"] = getLiveInheritedInstances;
          Module["flushPendingDeletes"] = flushPendingDeletes;
          Module["setDelayFunction"] = setDelayFunction;
        }
        var registeredInstances = {};
        function getBasestPointer(class_, ptr) {
          if (ptr === void 0) {
            throwBindingError("ptr should not be undefined");
          }
          while (class_.baseClass) {
            ptr = class_.upcast(ptr);
            class_ = class_.baseClass;
          }
          return ptr;
        }
        function getInheritedInstance(class_, ptr) {
          ptr = getBasestPointer(class_, ptr);
          return registeredInstances[ptr];
        }
        function makeClassHandle(prototype, record) {
          if (!record.ptrType || !record.ptr) {
            throwInternalError("makeClassHandle requires ptr and ptrType");
          }
          var hasSmartPtrType = !!record.smartPtrType;
          var hasSmartPtr = !!record.smartPtr;
          if (hasSmartPtrType !== hasSmartPtr) {
            throwInternalError("Both smartPtrType and smartPtr must be specified");
          }
          record.count = { value: 1 };
          return attachFinalizer(Object.create(prototype, { $$: { value: record } }));
        }
        function RegisteredPointer_fromWireType(ptr) {
          var rawPointer = this.getPointee(ptr);
          if (!rawPointer) {
            this.destructor(ptr);
            return null;
          }
          var registeredInstance = getInheritedInstance(this.registeredClass, rawPointer);
          if (void 0 !== registeredInstance) {
            if (0 === registeredInstance.$$.count.value) {
              registeredInstance.$$.ptr = rawPointer;
              registeredInstance.$$.smartPtr = ptr;
              return registeredInstance["clone"]();
            } else {
              var rv = registeredInstance["clone"]();
              this.destructor(ptr);
              return rv;
            }
          }
          function makeDefaultHandle() {
            if (this.isSmartPointer) {
              return makeClassHandle(this.registeredClass.instancePrototype, { ptrType: this.pointeeType, ptr: rawPointer, smartPtrType: this, smartPtr: ptr });
            } else {
              return makeClassHandle(this.registeredClass.instancePrototype, { ptrType: this, ptr });
            }
          }
          var actualType = this.registeredClass.getActualType(rawPointer);
          var registeredPointerRecord = registeredPointers[actualType];
          if (!registeredPointerRecord) {
            return makeDefaultHandle.call(this);
          }
          var toType;
          if (this.isConst) {
            toType = registeredPointerRecord.constPointerType;
          } else {
            toType = registeredPointerRecord.pointerType;
          }
          var dp = downcastPointer(rawPointer, this.registeredClass, toType.registeredClass);
          if (dp === null) {
            return makeDefaultHandle.call(this);
          }
          if (this.isSmartPointer) {
            return makeClassHandle(toType.registeredClass.instancePrototype, { ptrType: toType, ptr: dp, smartPtrType: this, smartPtr: ptr });
          } else {
            return makeClassHandle(toType.registeredClass.instancePrototype, { ptrType: toType, ptr: dp });
          }
        }
        function init_RegisteredPointer() {
          RegisteredPointer.prototype.getPointee = RegisteredPointer_getPointee;
          RegisteredPointer.prototype.destructor = RegisteredPointer_destructor;
          RegisteredPointer.prototype["argPackAdvance"] = 8;
          RegisteredPointer.prototype["readValueFromPointer"] = simpleReadValueFromPointer;
          RegisteredPointer.prototype["deleteObject"] = RegisteredPointer_deleteObject;
          RegisteredPointer.prototype["fromWireType"] = RegisteredPointer_fromWireType;
        }
        function RegisteredPointer(name, registeredClass, isReference, isConst, isSmartPointer, pointeeType, sharingPolicy, rawGetPointee, rawConstructor, rawShare, rawDestructor) {
          this.name = name;
          this.registeredClass = registeredClass;
          this.isReference = isReference;
          this.isConst = isConst;
          this.isSmartPointer = isSmartPointer;
          this.pointeeType = pointeeType;
          this.sharingPolicy = sharingPolicy;
          this.rawGetPointee = rawGetPointee;
          this.rawConstructor = rawConstructor;
          this.rawShare = rawShare;
          this.rawDestructor = rawDestructor;
          if (!isSmartPointer && registeredClass.baseClass === void 0) {
            if (isConst) {
              this["toWireType"] = constNoSmartPtrRawPointerToWireType;
              this.destructorFunction = null;
            } else {
              this["toWireType"] = nonConstNoSmartPtrRawPointerToWireType;
              this.destructorFunction = null;
            }
          } else {
            this["toWireType"] = genericPointerToWireType;
          }
        }
        function replacePublicSymbol(name, value, numArguments) {
          if (!Module.hasOwnProperty(name)) {
            throwInternalError("Replacing nonexistant public symbol");
          }
          if (void 0 !== Module[name].overloadTable && void 0 !== numArguments) {
            Module[name].overloadTable[numArguments] = value;
          } else {
            Module[name] = value;
            Module[name].argCount = numArguments;
          }
        }
        function embind__requireFunction(signature, rawFunction) {
          signature = readLatin1String(signature);
          function makeDynCaller(dynCall) {
            var args = [];
            for (var i2 = 1; i2 < signature.length; ++i2) {
              args.push("a" + i2);
            }
            var name = "dynCall_" + signature + "_" + rawFunction;
            var body = "return function " + name + "(" + args.join(", ") + ") {\n";
            body += "    return dynCall(rawFunction" + (args.length ? ", " : "") + args.join(", ") + ");\n";
            body += "};\n";
            return new Function("dynCall", "rawFunction", body)(dynCall, rawFunction);
          }
          var fp;
          if (Module["FUNCTION_TABLE_" + signature] !== void 0) {
            fp = Module["FUNCTION_TABLE_" + signature][rawFunction];
          } else if (typeof FUNCTION_TABLE !== "undefined") {
            fp = FUNCTION_TABLE[rawFunction];
          } else {
            var dc = Module["dynCall_" + signature];
            if (dc === void 0) {
              dc = Module["dynCall_" + signature.replace(/f/g, "d")];
              if (dc === void 0) {
                throwBindingError("No dynCall invoker for signature: " + signature);
              }
            }
            fp = makeDynCaller(dc);
          }
          if (typeof fp !== "function") {
            throwBindingError("unknown function pointer with signature " + signature + ": " + rawFunction);
          }
          return fp;
        }
        var UnboundTypeError = void 0;
        function getTypeName(type) {
          var ptr = ___getTypeName(type);
          var rv = readLatin1String(ptr);
          _free(ptr);
          return rv;
        }
        function throwUnboundTypeError(message, types) {
          var unboundTypes = [];
          var seen = {};
          function visit(type) {
            if (seen[type]) {
              return;
            }
            if (registeredTypes[type]) {
              return;
            }
            if (typeDependencies[type]) {
              typeDependencies[type].forEach(visit);
              return;
            }
            unboundTypes.push(type);
            seen[type] = true;
          }
          types.forEach(visit);
          throw new UnboundTypeError(message + ": " + unboundTypes.map(getTypeName).join([", "]));
        }
        function __embind_register_class(rawType, rawPointerType, rawConstPointerType, baseClassRawType, getActualTypeSignature, getActualType, upcastSignature, upcast, downcastSignature, downcast, name, destructorSignature, rawDestructor) {
          name = readLatin1String(name);
          getActualType = embind__requireFunction(getActualTypeSignature, getActualType);
          if (upcast) {
            upcast = embind__requireFunction(upcastSignature, upcast);
          }
          if (downcast) {
            downcast = embind__requireFunction(downcastSignature, downcast);
          }
          rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
          var legalFunctionName = makeLegalFunctionName(name);
          exposePublicSymbol(legalFunctionName, function() {
            throwUnboundTypeError("Cannot construct " + name + " due to unbound types", [baseClassRawType]);
          });
          whenDependentTypesAreResolved([rawType, rawPointerType, rawConstPointerType], baseClassRawType ? [baseClassRawType] : [], function(base) {
            base = base[0];
            var baseClass;
            var basePrototype;
            if (baseClassRawType) {
              baseClass = base.registeredClass;
              basePrototype = baseClass.instancePrototype;
            } else {
              basePrototype = ClassHandle.prototype;
            }
            var constructor = createNamedFunction(legalFunctionName, function() {
              if (Object.getPrototypeOf(this) !== instancePrototype) {
                throw new BindingError("Use 'new' to construct " + name);
              }
              if (void 0 === registeredClass.constructor_body) {
                throw new BindingError(name + " has no accessible constructor");
              }
              var body = registeredClass.constructor_body[arguments.length];
              if (void 0 === body) {
                throw new BindingError("Tried to invoke ctor of " + name + " with invalid number of parameters (" + arguments.length + ") - expected (" + Object.keys(registeredClass.constructor_body).toString() + ") parameters instead!");
              }
              return body.apply(this, arguments);
            });
            var instancePrototype = Object.create(basePrototype, { constructor: { value: constructor } });
            constructor.prototype = instancePrototype;
            var registeredClass = new RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast);
            var referenceConverter = new RegisteredPointer(name, registeredClass, true, false, false);
            var pointerConverter = new RegisteredPointer(name + "*", registeredClass, false, false, false);
            var constPointerConverter = new RegisteredPointer(name + " const*", registeredClass, false, true, false);
            registeredPointers[rawType] = { pointerType: pointerConverter, constPointerType: constPointerConverter };
            replacePublicSymbol(legalFunctionName, constructor);
            return [referenceConverter, pointerConverter, constPointerConverter];
          });
        }
        function heap32VectorToArray(count, firstElement) {
          var array = [];
          for (var i2 = 0; i2 < count; i2++) {
            array.push(HEAP32[(firstElement >> 2) + i2]);
          }
          return array;
        }
        function __embind_register_class_constructor(rawClassType, argCount, rawArgTypesAddr, invokerSignature, invoker, rawConstructor) {
          var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
          invoker = embind__requireFunction(invokerSignature, invoker);
          whenDependentTypesAreResolved([], [rawClassType], function(classType) {
            classType = classType[0];
            var humanName = "constructor " + classType.name;
            if (void 0 === classType.registeredClass.constructor_body) {
              classType.registeredClass.constructor_body = [];
            }
            if (void 0 !== classType.registeredClass.constructor_body[argCount - 1]) {
              throw new BindingError("Cannot register multiple constructors with identical number of parameters (" + (argCount - 1) + ") for class '" + classType.name + "'! Overload resolution is currently only performed using the parameter count, not actual type info!");
            }
            classType.registeredClass.constructor_body[argCount - 1] = function unboundTypeHandler() {
              throwUnboundTypeError("Cannot construct " + classType.name + " due to unbound types", rawArgTypes);
            };
            whenDependentTypesAreResolved([], rawArgTypes, function(argTypes) {
              classType.registeredClass.constructor_body[argCount - 1] = function constructor_body() {
                if (arguments.length !== argCount - 1) {
                  throwBindingError(humanName + " called with " + arguments.length + " arguments, expected " + (argCount - 1));
                }
                var destructors = [];
                var args = new Array(argCount);
                args[0] = rawConstructor;
                for (var i2 = 1; i2 < argCount; ++i2) {
                  args[i2] = argTypes[i2]["toWireType"](destructors, arguments[i2 - 1]);
                }
                var ptr = invoker.apply(null, args);
                runDestructors(destructors);
                return argTypes[0]["fromWireType"](ptr);
              };
              return [];
            });
            return [];
          });
        }
        function new_(constructor, argumentList) {
          if (!(constructor instanceof Function)) {
            throw new TypeError("new_ called with constructor type " + typeof constructor + " which is not a function");
          }
          var dummy = createNamedFunction(constructor.name || "unknownFunctionName", function() {
          });
          dummy.prototype = constructor.prototype;
          var obj = new dummy();
          var r = constructor.apply(obj, argumentList);
          return r instanceof Object ? r : obj;
        }
        function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc) {
          var argCount = argTypes.length;
          if (argCount < 2) {
            throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!");
          }
          var isClassMethodFunc = argTypes[1] !== null && classType !== null;
          var needsDestructorStack = false;
          for (var i2 = 1; i2 < argTypes.length; ++i2) {
            if (argTypes[i2] !== null && argTypes[i2].destructorFunction === void 0) {
              needsDestructorStack = true;
              break;
            }
          }
          var returns = argTypes[0].name !== "void";
          var argsList = "";
          var argsListWired = "";
          for (var i2 = 0; i2 < argCount - 2; ++i2) {
            argsList += (i2 !== 0 ? ", " : "") + "arg" + i2;
            argsListWired += (i2 !== 0 ? ", " : "") + "arg" + i2 + "Wired";
          }
          var invokerFnBody = "return function " + makeLegalFunctionName(humanName) + "(" + argsList + ") {\nif (arguments.length !== " + (argCount - 2) + ") {\nthrowBindingError('function " + humanName + " called with ' + arguments.length + ' arguments, expected " + (argCount - 2) + " args!');\n}\n";
          if (needsDestructorStack) {
            invokerFnBody += "var destructors = [];\n";
          }
          var dtorStack = needsDestructorStack ? "destructors" : "null";
          var args1 = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"];
          var args2 = [throwBindingError, cppInvokerFunc, cppTargetFunc, runDestructors, argTypes[0], argTypes[1]];
          if (isClassMethodFunc) {
            invokerFnBody += "var thisWired = classParam.toWireType(" + dtorStack + ", this);\n";
          }
          for (var i2 = 0; i2 < argCount - 2; ++i2) {
            invokerFnBody += "var arg" + i2 + "Wired = argType" + i2 + ".toWireType(" + dtorStack + ", arg" + i2 + "); // " + argTypes[i2 + 2].name + "\n";
            args1.push("argType" + i2);
            args2.push(argTypes[i2 + 2]);
          }
          if (isClassMethodFunc) {
            argsListWired = "thisWired" + (argsListWired.length > 0 ? ", " : "") + argsListWired;
          }
          invokerFnBody += (returns ? "var rv = " : "") + "invoker(fn" + (argsListWired.length > 0 ? ", " : "") + argsListWired + ");\n";
          if (needsDestructorStack) {
            invokerFnBody += "runDestructors(destructors);\n";
          } else {
            for (var i2 = isClassMethodFunc ? 1 : 2; i2 < argTypes.length; ++i2) {
              var paramName = i2 === 1 ? "thisWired" : "arg" + (i2 - 2) + "Wired";
              if (argTypes[i2].destructorFunction !== null) {
                invokerFnBody += paramName + "_dtor(" + paramName + "); // " + argTypes[i2].name + "\n";
                args1.push(paramName + "_dtor");
                args2.push(argTypes[i2].destructorFunction);
              }
            }
          }
          if (returns) {
            invokerFnBody += "var ret = retType.fromWireType(rv);\nreturn ret;\n";
          } else {
          }
          invokerFnBody += "}\n";
          args1.push(invokerFnBody);
          var invokerFunction = new_(Function, args1).apply(null, args2);
          return invokerFunction;
        }
        function __embind_register_class_function(rawClassType, methodName, argCount, rawArgTypesAddr, invokerSignature, rawInvoker, context, isPureVirtual) {
          var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
          methodName = readLatin1String(methodName);
          rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);
          whenDependentTypesAreResolved([], [rawClassType], function(classType) {
            classType = classType[0];
            var humanName = classType.name + "." + methodName;
            if (isPureVirtual) {
              classType.registeredClass.pureVirtualFunctions.push(methodName);
            }
            function unboundTypesHandler() {
              throwUnboundTypeError("Cannot call " + humanName + " due to unbound types", rawArgTypes);
            }
            var proto = classType.registeredClass.instancePrototype;
            var method = proto[methodName];
            if (void 0 === method || void 0 === method.overloadTable && method.className !== classType.name && method.argCount === argCount - 2) {
              unboundTypesHandler.argCount = argCount - 2;
              unboundTypesHandler.className = classType.name;
              proto[methodName] = unboundTypesHandler;
            } else {
              ensureOverloadTable(proto, methodName, humanName);
              proto[methodName].overloadTable[argCount - 2] = unboundTypesHandler;
            }
            whenDependentTypesAreResolved([], rawArgTypes, function(argTypes) {
              var memberFunction = craftInvokerFunction(humanName, argTypes, classType, rawInvoker, context);
              if (void 0 === proto[methodName].overloadTable) {
                memberFunction.argCount = argCount - 2;
                proto[methodName] = memberFunction;
              } else {
                proto[methodName].overloadTable[argCount - 2] = memberFunction;
              }
              return [];
            });
            return [];
          });
        }
        function validateThis(this_, classType, humanName) {
          if (!(this_ instanceof Object)) {
            throwBindingError(humanName + ' with invalid "this": ' + this_);
          }
          if (!(this_ instanceof classType.registeredClass.constructor)) {
            throwBindingError(humanName + ' incompatible with "this" of type ' + this_.constructor.name);
          }
          if (!this_.$$.ptr) {
            throwBindingError("cannot call emscripten binding method " + humanName + " on deleted object");
          }
          return upcastPointer(this_.$$.ptr, this_.$$.ptrType.registeredClass, classType.registeredClass);
        }
        function __embind_register_class_property(classType, fieldName, getterReturnType, getterSignature, getter, getterContext, setterArgumentType, setterSignature, setter, setterContext) {
          fieldName = readLatin1String(fieldName);
          getter = embind__requireFunction(getterSignature, getter);
          whenDependentTypesAreResolved([], [classType], function(classType2) {
            classType2 = classType2[0];
            var humanName = classType2.name + "." + fieldName;
            var desc = { get: function() {
              throwUnboundTypeError("Cannot access " + humanName + " due to unbound types", [getterReturnType, setterArgumentType]);
            }, enumerable: true, configurable: true };
            if (setter) {
              desc.set = function() {
                throwUnboundTypeError("Cannot access " + humanName + " due to unbound types", [getterReturnType, setterArgumentType]);
              };
            } else {
              desc.set = function(v) {
                throwBindingError(humanName + " is a read-only property");
              };
            }
            Object.defineProperty(classType2.registeredClass.instancePrototype, fieldName, desc);
            whenDependentTypesAreResolved([], setter ? [getterReturnType, setterArgumentType] : [getterReturnType], function(types) {
              var getterReturnType2 = types[0];
              var desc2 = { get: function() {
                var ptr = validateThis(this, classType2, humanName + " getter");
                return getterReturnType2["fromWireType"](getter(getterContext, ptr));
              }, enumerable: true };
              if (setter) {
                setter = embind__requireFunction(setterSignature, setter);
                var setterArgumentType2 = types[1];
                desc2.set = function(v) {
                  var ptr = validateThis(this, classType2, humanName + " setter");
                  var destructors = [];
                  setter(setterContext, ptr, setterArgumentType2["toWireType"](destructors, v));
                  runDestructors(destructors);
                };
              }
              Object.defineProperty(classType2.registeredClass.instancePrototype, fieldName, desc2);
              return [];
            });
            return [];
          });
        }
        var emval_free_list = [];
        var emval_handle_array = [{}, { value: void 0 }, { value: null }, { value: true }, { value: false }];
        function __emval_decref(handle) {
          if (handle > 4 && 0 === --emval_handle_array[handle].refcount) {
            emval_handle_array[handle] = void 0;
            emval_free_list.push(handle);
          }
        }
        function count_emval_handles() {
          var count = 0;
          for (var i2 = 5; i2 < emval_handle_array.length; ++i2) {
            if (emval_handle_array[i2] !== void 0) {
              ++count;
            }
          }
          return count;
        }
        function get_first_emval() {
          for (var i2 = 5; i2 < emval_handle_array.length; ++i2) {
            if (emval_handle_array[i2] !== void 0) {
              return emval_handle_array[i2];
            }
          }
          return null;
        }
        function init_emval() {
          Module["count_emval_handles"] = count_emval_handles;
          Module["get_first_emval"] = get_first_emval;
        }
        function __emval_register(value) {
          switch (value) {
            case void 0: {
              return 1;
            }
            case null: {
              return 2;
            }
            case true: {
              return 3;
            }
            case false: {
              return 4;
            }
            default: {
              var handle = emval_free_list.length ? emval_free_list.pop() : emval_handle_array.length;
              emval_handle_array[handle] = { refcount: 1, value };
              return handle;
            }
          }
        }
        function __embind_register_emval(rawType, name) {
          name = readLatin1String(name);
          registerType(rawType, { name, "fromWireType": function(handle) {
            var rv = emval_handle_array[handle].value;
            __emval_decref(handle);
            return rv;
          }, "toWireType": function(destructors, value) {
            return __emval_register(value);
          }, "argPackAdvance": 8, "readValueFromPointer": simpleReadValueFromPointer, destructorFunction: null });
        }
        function enumReadValueFromPointer(name, shift, signed) {
          switch (shift) {
            case 0:
              return function(pointer) {
                var heap = signed ? HEAP8 : HEAPU8;
                return this["fromWireType"](heap[pointer]);
              };
            case 1:
              return function(pointer) {
                var heap = signed ? HEAP16 : HEAPU16;
                return this["fromWireType"](heap[pointer >> 1]);
              };
            case 2:
              return function(pointer) {
                var heap = signed ? HEAP32 : HEAPU32;
                return this["fromWireType"](heap[pointer >> 2]);
              };
            default:
              throw new TypeError("Unknown integer type: " + name);
          }
        }
        function __embind_register_enum(rawType, name, size, isSigned) {
          var shift = getShiftFromSize(size);
          name = readLatin1String(name);
          function ctor() {
          }
          ctor.values = {};
          registerType(rawType, { name, constructor: ctor, "fromWireType": function(c) {
            return this.constructor.values[c];
          }, "toWireType": function(destructors, c) {
            return c.value;
          }, "argPackAdvance": 8, "readValueFromPointer": enumReadValueFromPointer(name, shift, isSigned), destructorFunction: null });
          exposePublicSymbol(name, ctor);
        }
        function requireRegisteredType(rawType, humanName) {
          var impl = registeredTypes[rawType];
          if (void 0 === impl) {
            throwBindingError(humanName + " has unknown type " + getTypeName(rawType));
          }
          return impl;
        }
        function __embind_register_enum_value(rawEnumType, name, enumValue) {
          var enumType = requireRegisteredType(rawEnumType, "enum");
          name = readLatin1String(name);
          var Enum = enumType.constructor;
          var Value = Object.create(enumType.constructor.prototype, { value: { value: enumValue }, constructor: { value: createNamedFunction(enumType.name + "_" + name, function() {
          }) } });
          Enum.values[enumValue] = Value;
          Enum[name] = Value;
        }
        function _embind_repr(v) {
          if (v === null) {
            return "null";
          }
          var t = typeof v;
          if (t === "object" || t === "array" || t === "function") {
            return v.toString();
          } else {
            return "" + v;
          }
        }
        function floatReadValueFromPointer(name, shift) {
          switch (shift) {
            case 2:
              return function(pointer) {
                return this["fromWireType"](HEAPF32[pointer >> 2]);
              };
            case 3:
              return function(pointer) {
                return this["fromWireType"](HEAPF64[pointer >> 3]);
              };
            default:
              throw new TypeError("Unknown float type: " + name);
          }
        }
        function __embind_register_float(rawType, name, size) {
          var shift = getShiftFromSize(size);
          name = readLatin1String(name);
          registerType(rawType, { name, "fromWireType": function(value) {
            return value;
          }, "toWireType": function(destructors, value) {
            if (typeof value !== "number" && typeof value !== "boolean") {
              throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name);
            }
            return value;
          }, "argPackAdvance": 8, "readValueFromPointer": floatReadValueFromPointer(name, shift), destructorFunction: null });
        }
        function integerReadValueFromPointer(name, shift, signed) {
          switch (shift) {
            case 0:
              return signed ? function readS8FromPointer(pointer) {
                return HEAP8[pointer];
              } : function readU8FromPointer(pointer) {
                return HEAPU8[pointer];
              };
            case 1:
              return signed ? function readS16FromPointer(pointer) {
                return HEAP16[pointer >> 1];
              } : function readU16FromPointer(pointer) {
                return HEAPU16[pointer >> 1];
              };
            case 2:
              return signed ? function readS32FromPointer(pointer) {
                return HEAP32[pointer >> 2];
              } : function readU32FromPointer(pointer) {
                return HEAPU32[pointer >> 2];
              };
            default:
              throw new TypeError("Unknown integer type: " + name);
          }
        }
        function __embind_register_integer(primitiveType, name, size, minRange, maxRange) {
          name = readLatin1String(name);
          if (maxRange === -1) {
            maxRange = 4294967295;
          }
          var shift = getShiftFromSize(size);
          var fromWireType = function(value) {
            return value;
          };
          if (minRange === 0) {
            var bitshift = 32 - 8 * size;
            fromWireType = function(value) {
              return value << bitshift >>> bitshift;
            };
          }
          var isUnsignedType = name.indexOf("unsigned") != -1;
          registerType(primitiveType, { name, "fromWireType": fromWireType, "toWireType": function(destructors, value) {
            if (typeof value !== "number" && typeof value !== "boolean") {
              throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name);
            }
            if (value < minRange || value > maxRange) {
              throw new TypeError('Passing a number "' + _embind_repr(value) + '" from JS side to C/C++ side to an argument of type "' + name + '", which is outside the valid range [' + minRange + ", " + maxRange + "]!");
            }
            return isUnsignedType ? value >>> 0 : value | 0;
          }, "argPackAdvance": 8, "readValueFromPointer": integerReadValueFromPointer(name, shift, minRange !== 0), destructorFunction: null });
        }
        function __embind_register_memory_view(rawType, dataTypeIndex, name) {
          var typeMapping = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array];
          var TA = typeMapping[dataTypeIndex];
          function decodeMemoryView(handle) {
            handle = handle >> 2;
            var heap = HEAPU32;
            var size = heap[handle];
            var data = heap[handle + 1];
            return new TA(heap["buffer"], data, size);
          }
          name = readLatin1String(name);
          registerType(rawType, { name, "fromWireType": decodeMemoryView, "argPackAdvance": 8, "readValueFromPointer": decodeMemoryView }, { ignoreDuplicateRegistrations: true });
        }
        function __embind_register_std_string(rawType, name) {
          name = readLatin1String(name);
          var stdStringIsUTF8 = name === "std::string";
          registerType(rawType, { name, "fromWireType": function(value) {
            var length = HEAPU32[value >> 2];
            var str;
            if (stdStringIsUTF8) {
              var endChar = HEAPU8[value + 4 + length];
              var endCharSwap = 0;
              if (endChar != 0) {
                endCharSwap = endChar;
                HEAPU8[value + 4 + length] = 0;
              }
              var decodeStartPtr = value + 4;
              for (var i2 = 0; i2 <= length; ++i2) {
                var currentBytePtr = value + 4 + i2;
                if (HEAPU8[currentBytePtr] == 0) {
                  var stringSegment = UTF8ToString(decodeStartPtr);
                  if (str === void 0) str = stringSegment;
                  else {
                    str += String.fromCharCode(0);
                    str += stringSegment;
                  }
                  decodeStartPtr = currentBytePtr + 1;
                }
              }
              if (endCharSwap != 0) HEAPU8[value + 4 + length] = endCharSwap;
            } else {
              var a = new Array(length);
              for (var i2 = 0; i2 < length; ++i2) {
                a[i2] = String.fromCharCode(HEAPU8[value + 4 + i2]);
              }
              str = a.join("");
            }
            _free(value);
            return str;
          }, "toWireType": function(destructors, value) {
            if (value instanceof ArrayBuffer) {
              value = new Uint8Array(value);
            }
            var getLength;
            var valueIsOfTypeString = typeof value === "string";
            if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) {
              throwBindingError("Cannot pass non-string to std::string");
            }
            if (stdStringIsUTF8 && valueIsOfTypeString) {
              getLength = function() {
                return lengthBytesUTF8(value);
              };
            } else {
              getLength = function() {
                return value.length;
              };
            }
            var length = getLength();
            var ptr = _malloc(4 + length + 1);
            HEAPU32[ptr >> 2] = length;
            if (stdStringIsUTF8 && valueIsOfTypeString) {
              stringToUTF8(value, ptr + 4, length + 1);
            } else {
              if (valueIsOfTypeString) {
                for (var i2 = 0; i2 < length; ++i2) {
                  var charCode = value.charCodeAt(i2);
                  if (charCode > 255) {
                    _free(ptr);
                    throwBindingError("String has UTF-16 code units that do not fit in 8 bits");
                  }
                  HEAPU8[ptr + 4 + i2] = charCode;
                }
              } else {
                for (var i2 = 0; i2 < length; ++i2) {
                  HEAPU8[ptr + 4 + i2] = value[i2];
                }
              }
            }
            if (destructors !== null) {
              destructors.push(_free, ptr);
            }
            return ptr;
          }, "argPackAdvance": 8, "readValueFromPointer": simpleReadValueFromPointer, destructorFunction: function(ptr) {
            _free(ptr);
          } });
        }
        function __embind_register_std_wstring(rawType, charSize, name) {
          name = readLatin1String(name);
          var getHeap, shift;
          if (charSize === 2) {
            getHeap = function() {
              return HEAPU16;
            };
            shift = 1;
          } else if (charSize === 4) {
            getHeap = function() {
              return HEAPU32;
            };
            shift = 2;
          }
          registerType(rawType, { name, "fromWireType": function(value) {
            var HEAP = getHeap();
            var length = HEAPU32[value >> 2];
            var a = new Array(length);
            var start = value + 4 >> shift;
            for (var i2 = 0; i2 < length; ++i2) {
              a[i2] = String.fromCharCode(HEAP[start + i2]);
            }
            _free(value);
            return a.join("");
          }, "toWireType": function(destructors, value) {
            var HEAP = getHeap();
            var length = value.length;
            var ptr = _malloc(4 + length * charSize);
            HEAPU32[ptr >> 2] = length;
            var start = ptr + 4 >> shift;
            for (var i2 = 0; i2 < length; ++i2) {
              HEAP[start + i2] = value.charCodeAt(i2);
            }
            if (destructors !== null) {
              destructors.push(_free, ptr);
            }
            return ptr;
          }, "argPackAdvance": 8, "readValueFromPointer": simpleReadValueFromPointer, destructorFunction: function(ptr) {
            _free(ptr);
          } });
        }
        function __embind_register_value_object(rawType, name, constructorSignature, rawConstructor, destructorSignature, rawDestructor) {
          structRegistrations[rawType] = { name: readLatin1String(name), rawConstructor: embind__requireFunction(constructorSignature, rawConstructor), rawDestructor: embind__requireFunction(destructorSignature, rawDestructor), fields: [] };
        }
        function __embind_register_value_object_field(structType, fieldName, getterReturnType, getterSignature, getter, getterContext, setterArgumentType, setterSignature, setter, setterContext) {
          structRegistrations[structType].fields.push({ fieldName: readLatin1String(fieldName), getterReturnType, getter: embind__requireFunction(getterSignature, getter), getterContext, setterArgumentType, setter: embind__requireFunction(setterSignature, setter), setterContext });
        }
        function __embind_register_void(rawType, name) {
          name = readLatin1String(name);
          registerType(rawType, { isVoid: true, name, "argPackAdvance": 0, "fromWireType": function() {
            return void 0;
          }, "toWireType": function(destructors, o) {
            return void 0;
          } });
        }
        function requireHandle(handle) {
          if (!handle) {
            throwBindingError("Cannot use deleted val. handle = " + handle);
          }
          return emval_handle_array[handle].value;
        }
        function __emval_as(handle, returnType, destructorsRef) {
          handle = requireHandle(handle);
          returnType = requireRegisteredType(returnType, "emval::as");
          var destructors = [];
          var rd = __emval_register(destructors);
          HEAP32[destructorsRef >> 2] = rd;
          return returnType["toWireType"](destructors, handle);
        }
        var emval_symbols = {};
        function getStringOrSymbol(address) {
          var symbol = emval_symbols[address];
          if (symbol === void 0) {
            return readLatin1String(address);
          } else {
            return symbol;
          }
        }
        var emval_methodCallers = [];
        function __emval_call_void_method(caller, handle, methodName, args) {
          caller = emval_methodCallers[caller];
          handle = requireHandle(handle);
          methodName = getStringOrSymbol(methodName);
          caller(handle, methodName, null, args);
        }
        function __emval_addMethodCaller(caller) {
          var id = emval_methodCallers.length;
          emval_methodCallers.push(caller);
          return id;
        }
        function __emval_lookupTypes(argCount, argTypes, argWireTypes) {
          var a = new Array(argCount);
          for (var i2 = 0; i2 < argCount; ++i2) {
            a[i2] = requireRegisteredType(HEAP32[(argTypes >> 2) + i2], "parameter " + i2);
          }
          return a;
        }
        function __emval_get_method_caller(argCount, argTypes) {
          var types = __emval_lookupTypes(argCount, argTypes);
          var retType = types[0];
          var signatureName = retType.name + "_$" + types.slice(1).map(function(t) {
            return t.name;
          }).join("_") + "$";
          var params = ["retType"];
          var args = [retType];
          var argsList = "";
          for (var i2 = 0; i2 < argCount - 1; ++i2) {
            argsList += (i2 !== 0 ? ", " : "") + "arg" + i2;
            params.push("argType" + i2);
            args.push(types[1 + i2]);
          }
          var functionName = makeLegalFunctionName("methodCaller_" + signatureName);
          var functionBody = "return function " + functionName + "(handle, name, destructors, args) {\n";
          var offset = 0;
          for (var i2 = 0; i2 < argCount - 1; ++i2) {
            functionBody += "    var arg" + i2 + " = argType" + i2 + ".readValueFromPointer(args" + (offset ? "+" + offset : "") + ");\n";
            offset += types[i2 + 1]["argPackAdvance"];
          }
          functionBody += "    var rv = handle[name](" + argsList + ");\n";
          for (var i2 = 0; i2 < argCount - 1; ++i2) {
            if (types[i2 + 1]["deleteObject"]) {
              functionBody += "    argType" + i2 + ".deleteObject(arg" + i2 + ");\n";
            }
          }
          if (!retType.isVoid) {
            functionBody += "    return retType.toWireType(destructors, rv);\n";
          }
          functionBody += "};\n";
          params.push(functionBody);
          var invokerFunction = new_(Function, params).apply(null, args);
          return __emval_addMethodCaller(invokerFunction);
        }
        function __emval_get_module_property(name) {
          name = getStringOrSymbol(name);
          return __emval_register(Module[name]);
        }
        function __emval_get_property(handle, key2) {
          handle = requireHandle(handle);
          key2 = requireHandle(key2);
          return __emval_register(handle[key2]);
        }
        function __emval_incref(handle) {
          if (handle > 4) {
            emval_handle_array[handle].refcount += 1;
          }
        }
        function craftEmvalAllocator(argCount) {
          var argsList = "";
          for (var i2 = 0; i2 < argCount; ++i2) {
            argsList += (i2 !== 0 ? ", " : "") + "arg" + i2;
          }
          var functionBody = "return function emval_allocator_" + argCount + "(constructor, argTypes, args) {\n";
          for (var i2 = 0; i2 < argCount; ++i2) {
            functionBody += "var argType" + i2 + " = requireRegisteredType(Module['HEAP32'][(argTypes >> 2) + " + i2 + '], "parameter ' + i2 + '");\nvar arg' + i2 + " = argType" + i2 + ".readValueFromPointer(args);\nargs += argType" + i2 + "['argPackAdvance'];\n";
          }
          functionBody += "var obj = new constructor(" + argsList + ");\nreturn __emval_register(obj);\n}\n";
          return new Function("requireRegisteredType", "Module", "__emval_register", functionBody)(requireRegisteredType, Module, __emval_register);
        }
        var emval_newers = {};
        function __emval_new(handle, argCount, argTypes, args) {
          handle = requireHandle(handle);
          var newer = emval_newers[argCount];
          if (!newer) {
            newer = craftEmvalAllocator(argCount);
            emval_newers[argCount] = newer;
          }
          return newer(handle, argTypes, args);
        }
        function __emval_new_cstring(v) {
          return __emval_register(getStringOrSymbol(v));
        }
        function __emval_new_object() {
          return __emval_register({});
        }
        function __emval_run_destructors(handle) {
          var destructors = emval_handle_array[handle].value;
          runDestructors(destructors);
          __emval_decref(handle);
        }
        function __emval_set_property(handle, key2, value) {
          handle = requireHandle(handle);
          key2 = requireHandle(key2);
          value = requireHandle(value);
          handle[key2] = value;
        }
        function __emval_take_value(type, argv) {
          type = requireRegisteredType(type, "_emval_take_value");
          var v = type["readValueFromPointer"](argv);
          return __emval_register(v);
        }
        function _abort() {
          Module["abort"]();
        }
        function _emscripten_get_heap_size() {
          return HEAP8.length;
        }
        var GL = { counter: 1, lastError: 0, buffers: [], mappedBuffers: {}, programs: [], framebuffers: [], renderbuffers: [], textures: [], uniforms: [], shaders: [], vaos: [], contexts: {}, currentContext: null, offscreenCanvases: {}, timerQueriesEXT: [], programInfos: {}, stringCache: {}, unpackAlignment: 4, init: function() {
          GL.miniTempBuffer = new Float32Array(GL.MINI_TEMP_BUFFER_SIZE);
          for (var i2 = 0; i2 < GL.MINI_TEMP_BUFFER_SIZE; i2++) {
            GL.miniTempBufferViews[i2] = GL.miniTempBuffer.subarray(0, i2 + 1);
          }
        }, recordError: function recordError(errorCode) {
          if (!GL.lastError) {
            GL.lastError = errorCode;
          }
        }, getNewId: function(table) {
          var ret = GL.counter++;
          for (var i2 = table.length; i2 < ret; i2++) {
            table[i2] = null;
          }
          return ret;
        }, MINI_TEMP_BUFFER_SIZE: 256, miniTempBuffer: null, miniTempBufferViews: [0], getSource: function(shader, count, string, length) {
          var source = "";
          for (var i2 = 0; i2 < count; ++i2) {
            var len = length ? HEAP32[length + i2 * 4 >> 2] : -1;
            source += UTF8ToString(HEAP32[string + i2 * 4 >> 2], len < 0 ? void 0 : len);
          }
          return source;
        }, createContext: function(canvas, webGLContextAttributes) {
          if (Module["preinitializedWebGLContext"]) {
            var ctx = Module["preinitializedWebGLContext"];
            webGLContextAttributes.majorVersion = 1;
          } else {
            var ctx = canvas.getContext("webgl", webGLContextAttributes) || canvas.getContext("experimental-webgl", webGLContextAttributes);
          }
          return ctx ? GL.registerContext(ctx, webGLContextAttributes) : 0;
        }, registerContext: function(ctx, webGLContextAttributes) {
          var handle = _malloc(8);
          var context = { handle, attributes: webGLContextAttributes, version: webGLContextAttributes.majorVersion, GLctx: ctx };
          if (ctx.canvas) ctx.canvas.GLctxObject = context;
          GL.contexts[handle] = context;
          if (typeof webGLContextAttributes.enableExtensionsByDefault === "undefined" || webGLContextAttributes.enableExtensionsByDefault) {
            GL.initExtensions(context);
          }
          return handle;
        }, makeContextCurrent: function(contextHandle) {
          GL.currentContext = GL.contexts[contextHandle];
          Module.ctx = GLctx = GL.currentContext && GL.currentContext.GLctx;
          return !(contextHandle && !GLctx);
        }, getContext: function(contextHandle) {
          return GL.contexts[contextHandle];
        }, deleteContext: function(contextHandle) {
          if (GL.currentContext === GL.contexts[contextHandle]) GL.currentContext = null;
          if (typeof JSEvents === "object") JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas);
          if (GL.contexts[contextHandle] && GL.contexts[contextHandle].GLctx.canvas) GL.contexts[contextHandle].GLctx.canvas.GLctxObject = void 0;
          _free(GL.contexts[contextHandle]);
          GL.contexts[contextHandle] = null;
        }, acquireInstancedArraysExtension: function(ctx) {
          var ext = ctx.getExtension("ANGLE_instanced_arrays");
          if (ext) {
            ctx["vertexAttribDivisor"] = function(index, divisor) {
              ext["vertexAttribDivisorANGLE"](index, divisor);
            };
            ctx["drawArraysInstanced"] = function(mode, first, count, primcount) {
              ext["drawArraysInstancedANGLE"](mode, first, count, primcount);
            };
            ctx["drawElementsInstanced"] = function(mode, count, type, indices, primcount) {
              ext["drawElementsInstancedANGLE"](mode, count, type, indices, primcount);
            };
          }
        }, acquireVertexArrayObjectExtension: function(ctx) {
          var ext = ctx.getExtension("OES_vertex_array_object");
          if (ext) {
            ctx["createVertexArray"] = function() {
              return ext["createVertexArrayOES"]();
            };
            ctx["deleteVertexArray"] = function(vao) {
              ext["deleteVertexArrayOES"](vao);
            };
            ctx["bindVertexArray"] = function(vao) {
              ext["bindVertexArrayOES"](vao);
            };
            ctx["isVertexArray"] = function(vao) {
              return ext["isVertexArrayOES"](vao);
            };
          }
        }, acquireDrawBuffersExtension: function(ctx) {
          var ext = ctx.getExtension("WEBGL_draw_buffers");
          if (ext) {
            ctx["drawBuffers"] = function(n, bufs) {
              ext["drawBuffersWEBGL"](n, bufs);
            };
          }
        }, initExtensions: function(context) {
          if (!context) context = GL.currentContext;
          if (context.initExtensionsDone) return;
          context.initExtensionsDone = true;
          var GLctx2 = context.GLctx;
          if (context.version < 2) {
            GL.acquireInstancedArraysExtension(GLctx2);
            GL.acquireVertexArrayObjectExtension(GLctx2);
            GL.acquireDrawBuffersExtension(GLctx2);
          }
          GLctx2.disjointTimerQueryExt = GLctx2.getExtension("EXT_disjoint_timer_query");
          var automaticallyEnabledExtensions = ["OES_texture_float", "OES_texture_half_float", "OES_standard_derivatives", "OES_vertex_array_object", "WEBGL_compressed_texture_s3tc", "WEBGL_depth_texture", "OES_element_index_uint", "EXT_texture_filter_anisotropic", "EXT_frag_depth", "WEBGL_draw_buffers", "ANGLE_instanced_arrays", "OES_texture_float_linear", "OES_texture_half_float_linear", "EXT_blend_minmax", "EXT_shader_texture_lod", "WEBGL_compressed_texture_pvrtc", "EXT_color_buffer_half_float", "WEBGL_color_buffer_float", "EXT_sRGB", "WEBGL_compressed_texture_etc1", "EXT_disjoint_timer_query", "WEBGL_compressed_texture_etc", "WEBGL_compressed_texture_astc", "EXT_color_buffer_float", "WEBGL_compressed_texture_s3tc_srgb", "EXT_disjoint_timer_query_webgl2"];
          var exts = GLctx2.getSupportedExtensions() || [];
          exts.forEach(function(ext) {
            if (automaticallyEnabledExtensions.indexOf(ext) != -1) {
              GLctx2.getExtension(ext);
            }
          });
        }, populateUniformTable: function(program) {
          var p = GL.programs[program];
          var ptable = GL.programInfos[program] = { uniforms: {}, maxUniformLength: 0, maxAttributeLength: -1, maxUniformBlockNameLength: -1 };
          var utable = ptable.uniforms;
          var numUniforms = GLctx.getProgramParameter(p, 35718);
          for (var i2 = 0; i2 < numUniforms; ++i2) {
            var u = GLctx.getActiveUniform(p, i2);
            var name = u.name;
            ptable.maxUniformLength = Math.max(ptable.maxUniformLength, name.length + 1);
            if (name.slice(-1) == "]") {
              name = name.slice(0, name.lastIndexOf("["));
            }
            var loc = GLctx.getUniformLocation(p, name);
            if (loc) {
              var id = GL.getNewId(GL.uniforms);
              utable[name] = [u.size, id];
              GL.uniforms[id] = loc;
              for (var j = 1; j < u.size; ++j) {
                var n = name + "[" + j + "]";
                loc = GLctx.getUniformLocation(p, n);
                id = GL.getNewId(GL.uniforms);
                GL.uniforms[id] = loc;
              }
            }
          }
        } };
        function _emscripten_glActiveTexture(x0) {
          GLctx["activeTexture"](x0);
        }
        function _emscripten_glAttachShader(program, shader) {
          GLctx.attachShader(GL.programs[program], GL.shaders[shader]);
        }
        function _emscripten_glBeginQueryEXT(target, id) {
          GLctx.disjointTimerQueryExt["beginQueryEXT"](target, GL.timerQueriesEXT[id]);
        }
        function _emscripten_glBindAttribLocation(program, index, name) {
          GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name));
        }
        function _emscripten_glBindBuffer(target, buffer2) {
          GLctx.bindBuffer(target, GL.buffers[buffer2]);
        }
        function _emscripten_glBindFramebuffer(target, framebuffer) {
          GLctx.bindFramebuffer(target, GL.framebuffers[framebuffer]);
        }
        function _emscripten_glBindRenderbuffer(target, renderbuffer) {
          GLctx.bindRenderbuffer(target, GL.renderbuffers[renderbuffer]);
        }
        function _emscripten_glBindTexture(target, texture) {
          GLctx.bindTexture(target, GL.textures[texture]);
        }
        function _emscripten_glBindVertexArrayOES(vao) {
          GLctx["bindVertexArray"](GL.vaos[vao]);
        }
        function _emscripten_glBlendColor(x0, x1, x2, x3) {
          GLctx["blendColor"](x0, x1, x2, x3);
        }
        function _emscripten_glBlendEquation(x0) {
          GLctx["blendEquation"](x0);
        }
        function _emscripten_glBlendEquationSeparate(x0, x1) {
          GLctx["blendEquationSeparate"](x0, x1);
        }
        function _emscripten_glBlendFunc(x0, x1) {
          GLctx["blendFunc"](x0, x1);
        }
        function _emscripten_glBlendFuncSeparate(x0, x1, x2, x3) {
          GLctx["blendFuncSeparate"](x0, x1, x2, x3);
        }
        function _emscripten_glBufferData(target, size, data, usage) {
          GLctx.bufferData(target, data ? HEAPU8.subarray(data, data + size) : size, usage);
        }
        function _emscripten_glBufferSubData(target, offset, size, data) {
          GLctx.bufferSubData(target, offset, HEAPU8.subarray(data, data + size));
        }
        function _emscripten_glCheckFramebufferStatus(x0) {
          return GLctx["checkFramebufferStatus"](x0);
        }
        function _emscripten_glClear(x0) {
          GLctx["clear"](x0);
        }
        function _emscripten_glClearColor(x0, x1, x2, x3) {
          GLctx["clearColor"](x0, x1, x2, x3);
        }
        function _emscripten_glClearDepthf(x0) {
          GLctx["clearDepth"](x0);
        }
        function _emscripten_glClearStencil(x0) {
          GLctx["clearStencil"](x0);
        }
        function _emscripten_glColorMask(red, green, blue, alpha) {
          GLctx.colorMask(!!red, !!green, !!blue, !!alpha);
        }
        function _emscripten_glCompileShader(shader) {
          GLctx.compileShader(GL.shaders[shader]);
        }
        function _emscripten_glCompressedTexImage2D(target, level, internalFormat, width, height, border, imageSize, data) {
          GLctx["compressedTexImage2D"](target, level, internalFormat, width, height, border, data ? HEAPU8.subarray(data, data + imageSize) : null);
        }
        function _emscripten_glCompressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, data) {
          GLctx["compressedTexSubImage2D"](target, level, xoffset, yoffset, width, height, format, data ? HEAPU8.subarray(data, data + imageSize) : null);
        }
        function _emscripten_glCopyTexImage2D(x0, x1, x2, x3, x4, x5, x6, x7) {
          GLctx["copyTexImage2D"](x0, x1, x2, x3, x4, x5, x6, x7);
        }
        function _emscripten_glCopyTexSubImage2D(x0, x1, x2, x3, x4, x5, x6, x7) {
          GLctx["copyTexSubImage2D"](x0, x1, x2, x3, x4, x5, x6, x7);
        }
        function _emscripten_glCreateProgram() {
          var id = GL.getNewId(GL.programs);
          var program = GLctx.createProgram();
          program.name = id;
          GL.programs[id] = program;
          return id;
        }
        function _emscripten_glCreateShader(shaderType) {
          var id = GL.getNewId(GL.shaders);
          GL.shaders[id] = GLctx.createShader(shaderType);
          return id;
        }
        function _emscripten_glCullFace(x0) {
          GLctx["cullFace"](x0);
        }
        function _emscripten_glDeleteBuffers(n, buffers) {
          for (var i2 = 0; i2 < n; i2++) {
            var id = HEAP32[buffers + i2 * 4 >> 2];
            var buffer2 = GL.buffers[id];
            if (!buffer2) continue;
            GLctx.deleteBuffer(buffer2);
            buffer2.name = 0;
            GL.buffers[id] = null;
            if (id == GL.currArrayBuffer) GL.currArrayBuffer = 0;
            if (id == GL.currElementArrayBuffer) GL.currElementArrayBuffer = 0;
          }
        }
        function _emscripten_glDeleteFramebuffers(n, framebuffers) {
          for (var i2 = 0; i2 < n; ++i2) {
            var id = HEAP32[framebuffers + i2 * 4 >> 2];
            var framebuffer = GL.framebuffers[id];
            if (!framebuffer) continue;
            GLctx.deleteFramebuffer(framebuffer);
            framebuffer.name = 0;
            GL.framebuffers[id] = null;
          }
        }
        function _emscripten_glDeleteProgram(id) {
          if (!id) return;
          var program = GL.programs[id];
          if (!program) {
            GL.recordError(1281);
            return;
          }
          GLctx.deleteProgram(program);
          program.name = 0;
          GL.programs[id] = null;
          GL.programInfos[id] = null;
        }
        function _emscripten_glDeleteQueriesEXT(n, ids) {
          for (var i2 = 0; i2 < n; i2++) {
            var id = HEAP32[ids + i2 * 4 >> 2];
            var query = GL.timerQueriesEXT[id];
            if (!query) continue;
            GLctx.disjointTimerQueryExt["deleteQueryEXT"](query);
            GL.timerQueriesEXT[id] = null;
          }
        }
        function _emscripten_glDeleteRenderbuffers(n, renderbuffers) {
          for (var i2 = 0; i2 < n; i2++) {
            var id = HEAP32[renderbuffers + i2 * 4 >> 2];
            var renderbuffer = GL.renderbuffers[id];
            if (!renderbuffer) continue;
            GLctx.deleteRenderbuffer(renderbuffer);
            renderbuffer.name = 0;
            GL.renderbuffers[id] = null;
          }
        }
        function _emscripten_glDeleteShader(id) {
          if (!id) return;
          var shader = GL.shaders[id];
          if (!shader) {
            GL.recordError(1281);
            return;
          }
          GLctx.deleteShader(shader);
          GL.shaders[id] = null;
        }
        function _emscripten_glDeleteTextures(n, textures) {
          for (var i2 = 0; i2 < n; i2++) {
            var id = HEAP32[textures + i2 * 4 >> 2];
            var texture = GL.textures[id];
            if (!texture) continue;
            GLctx.deleteTexture(texture);
            texture.name = 0;
            GL.textures[id] = null;
          }
        }
        function _emscripten_glDeleteVertexArraysOES(n, vaos) {
          for (var i2 = 0; i2 < n; i2++) {
            var id = HEAP32[vaos + i2 * 4 >> 2];
            GLctx["deleteVertexArray"](GL.vaos[id]);
            GL.vaos[id] = null;
          }
        }
        function _emscripten_glDepthFunc(x0) {
          GLctx["depthFunc"](x0);
        }
        function _emscripten_glDepthMask(flag) {
          GLctx.depthMask(!!flag);
        }
        function _emscripten_glDepthRangef(x0, x1) {
          GLctx["depthRange"](x0, x1);
        }
        function _emscripten_glDetachShader(program, shader) {
          GLctx.detachShader(GL.programs[program], GL.shaders[shader]);
        }
        function _emscripten_glDisable(x0) {
          GLctx["disable"](x0);
        }
        function _emscripten_glDisableVertexAttribArray(index) {
          GLctx.disableVertexAttribArray(index);
        }
        function _emscripten_glDrawArrays(mode, first, count) {
          GLctx.drawArrays(mode, first, count);
        }
        function _emscripten_glDrawArraysInstancedANGLE(mode, first, count, primcount) {
          GLctx["drawArraysInstanced"](mode, first, count, primcount);
        }
        var __tempFixedLengthArray = [];
        function _emscripten_glDrawBuffersWEBGL(n, bufs) {
          var bufArray = __tempFixedLengthArray[n];
          for (var i2 = 0; i2 < n; i2++) {
            bufArray[i2] = HEAP32[bufs + i2 * 4 >> 2];
          }
          GLctx["drawBuffers"](bufArray);
        }
        function _emscripten_glDrawElements(mode, count, type, indices) {
          GLctx.drawElements(mode, count, type, indices);
        }
        function _emscripten_glDrawElementsInstancedANGLE(mode, count, type, indices, primcount) {
          GLctx["drawElementsInstanced"](mode, count, type, indices, primcount);
        }
        function _emscripten_glEnable(x0) {
          GLctx["enable"](x0);
        }
        function _emscripten_glEnableVertexAttribArray(index) {
          GLctx.enableVertexAttribArray(index);
        }
        function _emscripten_glEndQueryEXT(target) {
          GLctx.disjointTimerQueryExt["endQueryEXT"](target);
        }
        function _emscripten_glFinish() {
          GLctx["finish"]();
        }
        function _emscripten_glFlush() {
          GLctx["flush"]();
        }
        function _emscripten_glFramebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer) {
          GLctx.framebufferRenderbuffer(target, attachment, renderbuffertarget, GL.renderbuffers[renderbuffer]);
        }
        function _emscripten_glFramebufferTexture2D(target, attachment, textarget, texture, level) {
          GLctx.framebufferTexture2D(target, attachment, textarget, GL.textures[texture], level);
        }
        function _emscripten_glFrontFace(x0) {
          GLctx["frontFace"](x0);
        }
        function __glGenObject(n, buffers, createFunction, objectTable) {
          for (var i2 = 0; i2 < n; i2++) {
            var buffer2 = GLctx[createFunction]();
            var id = buffer2 && GL.getNewId(objectTable);
            if (buffer2) {
              buffer2.name = id;
              objectTable[id] = buffer2;
            } else {
              GL.recordError(1282);
            }
            HEAP32[buffers + i2 * 4 >> 2] = id;
          }
        }
        function _emscripten_glGenBuffers(n, buffers) {
          __glGenObject(n, buffers, "createBuffer", GL.buffers);
        }
        function _emscripten_glGenFramebuffers(n, ids) {
          __glGenObject(n, ids, "createFramebuffer", GL.framebuffers);
        }
        function _emscripten_glGenQueriesEXT(n, ids) {
          for (var i2 = 0; i2 < n; i2++) {
            var query = GLctx.disjointTimerQueryExt["createQueryEXT"]();
            if (!query) {
              GL.recordError(1282);
              while (i2 < n) HEAP32[ids + i2++ * 4 >> 2] = 0;
              return;
            }
            var id = GL.getNewId(GL.timerQueriesEXT);
            query.name = id;
            GL.timerQueriesEXT[id] = query;
            HEAP32[ids + i2 * 4 >> 2] = id;
          }
        }
        function _emscripten_glGenRenderbuffers(n, renderbuffers) {
          __glGenObject(n, renderbuffers, "createRenderbuffer", GL.renderbuffers);
        }
        function _emscripten_glGenTextures(n, textures) {
          __glGenObject(n, textures, "createTexture", GL.textures);
        }
        function _emscripten_glGenVertexArraysOES(n, arrays) {
          __glGenObject(n, arrays, "createVertexArray", GL.vaos);
        }
        function _emscripten_glGenerateMipmap(x0) {
          GLctx["generateMipmap"](x0);
        }
        function _emscripten_glGetActiveAttrib(program, index, bufSize, length, size, type, name) {
          program = GL.programs[program];
          var info = GLctx.getActiveAttrib(program, index);
          if (!info) return;
          var numBytesWrittenExclNull = bufSize > 0 && name ? stringToUTF8(info.name, name, bufSize) : 0;
          if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
          if (size) HEAP32[size >> 2] = info.size;
          if (type) HEAP32[type >> 2] = info.type;
        }
        function _emscripten_glGetActiveUniform(program, index, bufSize, length, size, type, name) {
          program = GL.programs[program];
          var info = GLctx.getActiveUniform(program, index);
          if (!info) return;
          var numBytesWrittenExclNull = bufSize > 0 && name ? stringToUTF8(info.name, name, bufSize) : 0;
          if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
          if (size) HEAP32[size >> 2] = info.size;
          if (type) HEAP32[type >> 2] = info.type;
        }
        function _emscripten_glGetAttachedShaders(program, maxCount, count, shaders) {
          var result = GLctx.getAttachedShaders(GL.programs[program]);
          var len = result.length;
          if (len > maxCount) {
            len = maxCount;
          }
          HEAP32[count >> 2] = len;
          for (var i2 = 0; i2 < len; ++i2) {
            var id = GL.shaders.indexOf(result[i2]);
            HEAP32[shaders + i2 * 4 >> 2] = id;
          }
        }
        function _emscripten_glGetAttribLocation(program, name) {
          return GLctx.getAttribLocation(GL.programs[program], UTF8ToString(name));
        }
        function emscriptenWebGLGet(name_, p, type) {
          if (!p) {
            GL.recordError(1281);
            return;
          }
          var ret = void 0;
          switch (name_) {
            case 36346:
              ret = 1;
              break;
            case 36344:
              if (type != 0 && type != 1) {
                GL.recordError(1280);
              }
              return;
            case 36345:
              ret = 0;
              break;
            case 34466:
              var formats = GLctx.getParameter(34467);
              ret = formats ? formats.length : 0;
              break;
          }
          if (ret === void 0) {
            var result = GLctx.getParameter(name_);
            switch (typeof result) {
              case "number":
                ret = result;
                break;
              case "boolean":
                ret = result ? 1 : 0;
                break;
              case "string":
                GL.recordError(1280);
                return;
              case "object":
                if (result === null) {
                  switch (name_) {
                    case 34964:
                    case 35725:
                    case 34965:
                    case 36006:
                    case 36007:
                    case 32873:
                    case 34229:
                    case 34068: {
                      ret = 0;
                      break;
                    }
                    default: {
                      GL.recordError(1280);
                      return;
                    }
                  }
                } else if (result instanceof Float32Array || result instanceof Uint32Array || result instanceof Int32Array || result instanceof Array) {
                  for (var i2 = 0; i2 < result.length; ++i2) {
                    switch (type) {
                      case 0:
                        HEAP32[p + i2 * 4 >> 2] = result[i2];
                        break;
                      case 2:
                        HEAPF32[p + i2 * 4 >> 2] = result[i2];
                        break;
                      case 4:
                        HEAP8[p + i2 >> 0] = result[i2] ? 1 : 0;
                        break;
                    }
                  }
                  return;
                } else {
                  try {
                    ret = result.name | 0;
                  } catch (e) {
                    GL.recordError(1280);
                    err("GL_INVALID_ENUM in glGet" + type + "v: Unknown object returned from WebGL getParameter(" + name_ + ")! (error: " + e + ")");
                    return;
                  }
                }
                break;
              default:
                GL.recordError(1280);
                err("GL_INVALID_ENUM in glGet" + type + "v: Native code calling glGet" + type + "v(" + name_ + ") and it returns " + result + " of type " + typeof result + "!");
                return;
            }
          }
          switch (type) {
            case 1:
              tempI64 = [ret >>> 0, (tempDouble = ret, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[p >> 2] = tempI64[0], HEAP32[p + 4 >> 2] = tempI64[1];
              break;
            case 0:
              HEAP32[p >> 2] = ret;
              break;
            case 2:
              HEAPF32[p >> 2] = ret;
              break;
            case 4:
              HEAP8[p >> 0] = ret ? 1 : 0;
              break;
          }
        }
        function _emscripten_glGetBooleanv(name_, p) {
          emscriptenWebGLGet(name_, p, 4);
        }
        function _emscripten_glGetBufferParameteriv(target, value, data) {
          if (!data) {
            GL.recordError(1281);
            return;
          }
          HEAP32[data >> 2] = GLctx.getBufferParameter(target, value);
        }
        function _emscripten_glGetError() {
          var error = GLctx.getError() || GL.lastError;
          GL.lastError = 0;
          return error;
        }
        function _emscripten_glGetFloatv(name_, p) {
          emscriptenWebGLGet(name_, p, 2);
        }
        function _emscripten_glGetFramebufferAttachmentParameteriv(target, attachment, pname, params) {
          var result = GLctx.getFramebufferAttachmentParameter(target, attachment, pname);
          if (result instanceof WebGLRenderbuffer || result instanceof WebGLTexture) {
            result = result.name | 0;
          }
          HEAP32[params >> 2] = result;
        }
        function _emscripten_glGetIntegerv(name_, p) {
          emscriptenWebGLGet(name_, p, 0);
        }
        function _emscripten_glGetProgramInfoLog(program, maxLength, length, infoLog) {
          var log = GLctx.getProgramInfoLog(GL.programs[program]);
          if (log === null) log = "(unknown error)";
          var numBytesWrittenExclNull = maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0;
          if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
        }
        function _emscripten_glGetProgramiv(program, pname, p) {
          if (!p) {
            GL.recordError(1281);
            return;
          }
          if (program >= GL.counter) {
            GL.recordError(1281);
            return;
          }
          var ptable = GL.programInfos[program];
          if (!ptable) {
            GL.recordError(1282);
            return;
          }
          if (pname == 35716) {
            var log = GLctx.getProgramInfoLog(GL.programs[program]);
            if (log === null) log = "(unknown error)";
            HEAP32[p >> 2] = log.length + 1;
          } else if (pname == 35719) {
            HEAP32[p >> 2] = ptable.maxUniformLength;
          } else if (pname == 35722) {
            if (ptable.maxAttributeLength == -1) {
              program = GL.programs[program];
              var numAttribs = GLctx.getProgramParameter(program, 35721);
              ptable.maxAttributeLength = 0;
              for (var i2 = 0; i2 < numAttribs; ++i2) {
                var activeAttrib = GLctx.getActiveAttrib(program, i2);
                ptable.maxAttributeLength = Math.max(ptable.maxAttributeLength, activeAttrib.name.length + 1);
              }
            }
            HEAP32[p >> 2] = ptable.maxAttributeLength;
          } else if (pname == 35381) {
            if (ptable.maxUniformBlockNameLength == -1) {
              program = GL.programs[program];
              var numBlocks = GLctx.getProgramParameter(program, 35382);
              ptable.maxUniformBlockNameLength = 0;
              for (var i2 = 0; i2 < numBlocks; ++i2) {
                var activeBlockName = GLctx.getActiveUniformBlockName(program, i2);
                ptable.maxUniformBlockNameLength = Math.max(ptable.maxUniformBlockNameLength, activeBlockName.length + 1);
              }
            }
            HEAP32[p >> 2] = ptable.maxUniformBlockNameLength;
          } else {
            HEAP32[p >> 2] = GLctx.getProgramParameter(GL.programs[program], pname);
          }
        }
        function _emscripten_glGetQueryObjecti64vEXT(id, pname, params) {
          if (!params) {
            GL.recordError(1281);
            return;
          }
          var query = GL.timerQueriesEXT[id];
          var param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname);
          var ret;
          if (typeof param == "boolean") {
            ret = param ? 1 : 0;
          } else {
            ret = param;
          }
          tempI64 = [ret >>> 0, (tempDouble = ret, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[params >> 2] = tempI64[0], HEAP32[params + 4 >> 2] = tempI64[1];
        }
        function _emscripten_glGetQueryObjectivEXT(id, pname, params) {
          if (!params) {
            GL.recordError(1281);
            return;
          }
          var query = GL.timerQueriesEXT[id];
          var param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname);
          var ret;
          if (typeof param == "boolean") {
            ret = param ? 1 : 0;
          } else {
            ret = param;
          }
          HEAP32[params >> 2] = ret;
        }
        function _emscripten_glGetQueryObjectui64vEXT(id, pname, params) {
          if (!params) {
            GL.recordError(1281);
            return;
          }
          var query = GL.timerQueriesEXT[id];
          var param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname);
          var ret;
          if (typeof param == "boolean") {
            ret = param ? 1 : 0;
          } else {
            ret = param;
          }
          tempI64 = [ret >>> 0, (tempDouble = ret, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[params >> 2] = tempI64[0], HEAP32[params + 4 >> 2] = tempI64[1];
        }
        function _emscripten_glGetQueryObjectuivEXT(id, pname, params) {
          if (!params) {
            GL.recordError(1281);
            return;
          }
          var query = GL.timerQueriesEXT[id];
          var param = GLctx.disjointTimerQueryExt["getQueryObjectEXT"](query, pname);
          var ret;
          if (typeof param == "boolean") {
            ret = param ? 1 : 0;
          } else {
            ret = param;
          }
          HEAP32[params >> 2] = ret;
        }
        function _emscripten_glGetQueryivEXT(target, pname, params) {
          if (!params) {
            GL.recordError(1281);
            return;
          }
          HEAP32[params >> 2] = GLctx.disjointTimerQueryExt["getQueryEXT"](target, pname);
        }
        function _emscripten_glGetRenderbufferParameteriv(target, pname, params) {
          if (!params) {
            GL.recordError(1281);
            return;
          }
          HEAP32[params >> 2] = GLctx.getRenderbufferParameter(target, pname);
        }
        function _emscripten_glGetShaderInfoLog(shader, maxLength, length, infoLog) {
          var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
          if (log === null) log = "(unknown error)";
          var numBytesWrittenExclNull = maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0;
          if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
        }
        function _emscripten_glGetShaderPrecisionFormat(shaderType, precisionType, range, precision) {
          var result = GLctx.getShaderPrecisionFormat(shaderType, precisionType);
          HEAP32[range >> 2] = result.rangeMin;
          HEAP32[range + 4 >> 2] = result.rangeMax;
          HEAP32[precision >> 2] = result.precision;
        }
        function _emscripten_glGetShaderSource(shader, bufSize, length, source) {
          var result = GLctx.getShaderSource(GL.shaders[shader]);
          if (!result) return;
          var numBytesWrittenExclNull = bufSize > 0 && source ? stringToUTF8(result, source, bufSize) : 0;
          if (length) HEAP32[length >> 2] = numBytesWrittenExclNull;
        }
        function _emscripten_glGetShaderiv(shader, pname, p) {
          if (!p) {
            GL.recordError(1281);
            return;
          }
          if (pname == 35716) {
            var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
            if (log === null) log = "(unknown error)";
            HEAP32[p >> 2] = log.length + 1;
          } else if (pname == 35720) {
            var source = GLctx.getShaderSource(GL.shaders[shader]);
            var sourceLength = source === null || source.length == 0 ? 0 : source.length + 1;
            HEAP32[p >> 2] = sourceLength;
          } else {
            HEAP32[p >> 2] = GLctx.getShaderParameter(GL.shaders[shader], pname);
          }
        }
        function stringToNewUTF8(jsString) {
          var length = lengthBytesUTF8(jsString) + 1;
          var cString = _malloc(length);
          stringToUTF8(jsString, cString, length);
          return cString;
        }
        function _emscripten_glGetString(name_) {
          if (GL.stringCache[name_]) return GL.stringCache[name_];
          var ret;
          switch (name_) {
            case 7939:
              var exts = GLctx.getSupportedExtensions() || [];
              exts = exts.concat(exts.map(function(e) {
                return "GL_" + e;
              }));
              ret = stringToNewUTF8(exts.join(" "));
              break;
            case 7936:
            case 7937:
            case 37445:
            case 37446:
              var s = GLctx.getParameter(name_);
              if (!s) {
                GL.recordError(1280);
              }
              ret = stringToNewUTF8(s);
              break;
            case 7938:
              var glVersion = GLctx.getParameter(GLctx.VERSION);
              {
                glVersion = "OpenGL ES 2.0 (" + glVersion + ")";
              }
              ret = stringToNewUTF8(glVersion);
              break;
            case 35724:
              var glslVersion = GLctx.getParameter(GLctx.SHADING_LANGUAGE_VERSION);
              var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
              var ver_num = glslVersion.match(ver_re);
              if (ver_num !== null) {
                if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + "0";
                glslVersion = "OpenGL ES GLSL ES " + ver_num[1] + " (" + glslVersion + ")";
              }
              ret = stringToNewUTF8(glslVersion);
              break;
            default:
              GL.recordError(1280);
              return 0;
          }
          GL.stringCache[name_] = ret;
          return ret;
        }
        function _emscripten_glGetTexParameterfv(target, pname, params) {
          if (!params) {
            GL.recordError(1281);
            return;
          }
          HEAPF32[params >> 2] = GLctx.getTexParameter(target, pname);
        }
        function _emscripten_glGetTexParameteriv(target, pname, params) {
          if (!params) {
            GL.recordError(1281);
            return;
          }
          HEAP32[params >> 2] = GLctx.getTexParameter(target, pname);
        }
        function _emscripten_glGetUniformLocation(program, name) {
          name = UTF8ToString(name);
          var arrayIndex = 0;
          if (name[name.length - 1] == "]") {
            var leftBrace = name.lastIndexOf("[");
            arrayIndex = name[leftBrace + 1] != "]" ? parseInt(name.slice(leftBrace + 1)) : 0;
            name = name.slice(0, leftBrace);
          }
          var uniformInfo = GL.programInfos[program] && GL.programInfos[program].uniforms[name];
          if (uniformInfo && arrayIndex >= 0 && arrayIndex < uniformInfo[0]) {
            return uniformInfo[1] + arrayIndex;
          } else {
            return -1;
          }
        }
        function emscriptenWebGLGetUniform(program, location, params, type) {
          if (!params) {
            GL.recordError(1281);
            return;
          }
          var data = GLctx.getUniform(GL.programs[program], GL.uniforms[location]);
          if (typeof data == "number" || typeof data == "boolean") {
            switch (type) {
              case 0:
                HEAP32[params >> 2] = data;
                break;
              case 2:
                HEAPF32[params >> 2] = data;
                break;
              default:
                throw "internal emscriptenWebGLGetUniform() error, bad type: " + type;
            }
          } else {
            for (var i2 = 0; i2 < data.length; i2++) {
              switch (type) {
                case 0:
                  HEAP32[params + i2 * 4 >> 2] = data[i2];
                  break;
                case 2:
                  HEAPF32[params + i2 * 4 >> 2] = data[i2];
                  break;
                default:
                  throw "internal emscriptenWebGLGetUniform() error, bad type: " + type;
              }
            }
          }
        }
        function _emscripten_glGetUniformfv(program, location, params) {
          emscriptenWebGLGetUniform(program, location, params, 2);
        }
        function _emscripten_glGetUniformiv(program, location, params) {
          emscriptenWebGLGetUniform(program, location, params, 0);
        }
        function _emscripten_glGetVertexAttribPointerv(index, pname, pointer) {
          if (!pointer) {
            GL.recordError(1281);
            return;
          }
          HEAP32[pointer >> 2] = GLctx.getVertexAttribOffset(index, pname);
        }
        function emscriptenWebGLGetVertexAttrib(index, pname, params, type) {
          if (!params) {
            GL.recordError(1281);
            return;
          }
          var data = GLctx.getVertexAttrib(index, pname);
          if (pname == 34975) {
            HEAP32[params >> 2] = data["name"];
          } else if (typeof data == "number" || typeof data == "boolean") {
            switch (type) {
              case 0:
                HEAP32[params >> 2] = data;
                break;
              case 2:
                HEAPF32[params >> 2] = data;
                break;
              case 5:
                HEAP32[params >> 2] = Math.fround(data);
                break;
              default:
                throw "internal emscriptenWebGLGetVertexAttrib() error, bad type: " + type;
            }
          } else {
            for (var i2 = 0; i2 < data.length; i2++) {
              switch (type) {
                case 0:
                  HEAP32[params + i2 * 4 >> 2] = data[i2];
                  break;
                case 2:
                  HEAPF32[params + i2 * 4 >> 2] = data[i2];
                  break;
                case 5:
                  HEAP32[params + i2 * 4 >> 2] = Math.fround(data[i2]);
                  break;
                default:
                  throw "internal emscriptenWebGLGetVertexAttrib() error, bad type: " + type;
              }
            }
          }
        }
        function _emscripten_glGetVertexAttribfv(index, pname, params) {
          emscriptenWebGLGetVertexAttrib(index, pname, params, 2);
        }
        function _emscripten_glGetVertexAttribiv(index, pname, params) {
          emscriptenWebGLGetVertexAttrib(index, pname, params, 5);
        }
        function _emscripten_glHint(x0, x1) {
          GLctx["hint"](x0, x1);
        }
        function _emscripten_glIsBuffer(buffer2) {
          var b = GL.buffers[buffer2];
          if (!b) return 0;
          return GLctx.isBuffer(b);
        }
        function _emscripten_glIsEnabled(x0) {
          return GLctx["isEnabled"](x0);
        }
        function _emscripten_glIsFramebuffer(framebuffer) {
          var fb = GL.framebuffers[framebuffer];
          if (!fb) return 0;
          return GLctx.isFramebuffer(fb);
        }
        function _emscripten_glIsProgram(program) {
          program = GL.programs[program];
          if (!program) return 0;
          return GLctx.isProgram(program);
        }
        function _emscripten_glIsQueryEXT(id) {
          var query = GL.timerQueriesEXT[id];
          if (!query) return 0;
          return GLctx.disjointTimerQueryExt["isQueryEXT"](query);
        }
        function _emscripten_glIsRenderbuffer(renderbuffer) {
          var rb = GL.renderbuffers[renderbuffer];
          if (!rb) return 0;
          return GLctx.isRenderbuffer(rb);
        }
        function _emscripten_glIsShader(shader) {
          var s = GL.shaders[shader];
          if (!s) return 0;
          return GLctx.isShader(s);
        }
        function _emscripten_glIsTexture(id) {
          var texture = GL.textures[id];
          if (!texture) return 0;
          return GLctx.isTexture(texture);
        }
        function _emscripten_glIsVertexArrayOES(array) {
          var vao = GL.vaos[array];
          if (!vao) return 0;
          return GLctx["isVertexArray"](vao);
        }
        function _emscripten_glLineWidth(x0) {
          GLctx["lineWidth"](x0);
        }
        function _emscripten_glLinkProgram(program) {
          GLctx.linkProgram(GL.programs[program]);
          GL.populateUniformTable(program);
        }
        function _emscripten_glPixelStorei(pname, param) {
          if (pname == 3317) {
            GL.unpackAlignment = param;
          }
          GLctx.pixelStorei(pname, param);
        }
        function _emscripten_glPolygonOffset(x0, x1) {
          GLctx["polygonOffset"](x0, x1);
        }
        function _emscripten_glQueryCounterEXT(id, target) {
          GLctx.disjointTimerQueryExt["queryCounterEXT"](GL.timerQueriesEXT[id], target);
        }
        function __computeUnpackAlignedImageSize(width, height, sizePerPixel, alignment) {
          function roundedToNextMultipleOf(x, y) {
            return x + y - 1 & -y;
          }
          var plainRowSize = width * sizePerPixel;
          var alignedRowSize = roundedToNextMultipleOf(plainRowSize, alignment);
          return height * alignedRowSize;
        }
        var __colorChannelsInGlTextureFormat = { 6402: 1, 6406: 1, 6407: 3, 6408: 4, 6409: 1, 6410: 2, 35904: 3, 35906: 4 };
        var __sizeOfGlTextureElementType = { 5121: 1, 5123: 2, 5125: 4, 5126: 4, 32819: 2, 32820: 2, 33635: 2, 34042: 4, 36193: 2 };
        function emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) {
          var sizePerPixel = __colorChannelsInGlTextureFormat[format] * __sizeOfGlTextureElementType[type];
          if (!sizePerPixel) {
            GL.recordError(1280);
            return;
          }
          var bytes = __computeUnpackAlignedImageSize(width, height, sizePerPixel, GL.unpackAlignment);
          var end = pixels + bytes;
          switch (type) {
            case 5121:
              return HEAPU8.subarray(pixels, end);
            case 5126:
              return HEAPF32.subarray(pixels >> 2, end >> 2);
            case 5125:
            case 34042:
              return HEAPU32.subarray(pixels >> 2, end >> 2);
            case 5123:
            case 33635:
            case 32819:
            case 32820:
            case 36193:
              return HEAPU16.subarray(pixels >> 1, end >> 1);
            default:
              GL.recordError(1280);
          }
        }
        function _emscripten_glReadPixels(x, y, width, height, format, type, pixels) {
          var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, format);
          if (!pixelData) {
            GL.recordError(1280);
            return;
          }
          GLctx.readPixels(x, y, width, height, format, type, pixelData);
        }
        function _emscripten_glReleaseShaderCompiler() {
        }
        function _emscripten_glRenderbufferStorage(x0, x1, x2, x3) {
          GLctx["renderbufferStorage"](x0, x1, x2, x3);
        }
        function _emscripten_glSampleCoverage(value, invert) {
          GLctx.sampleCoverage(value, !!invert);
        }
        function _emscripten_glScissor(x0, x1, x2, x3) {
          GLctx["scissor"](x0, x1, x2, x3);
        }
        function _emscripten_glShaderBinary() {
          GL.recordError(1280);
        }
        function _emscripten_glShaderSource(shader, count, string, length) {
          var source = GL.getSource(shader, count, string, length);
          GLctx.shaderSource(GL.shaders[shader], source);
        }
        function _emscripten_glStencilFunc(x0, x1, x2) {
          GLctx["stencilFunc"](x0, x1, x2);
        }
        function _emscripten_glStencilFuncSeparate(x0, x1, x2, x3) {
          GLctx["stencilFuncSeparate"](x0, x1, x2, x3);
        }
        function _emscripten_glStencilMask(x0) {
          GLctx["stencilMask"](x0);
        }
        function _emscripten_glStencilMaskSeparate(x0, x1) {
          GLctx["stencilMaskSeparate"](x0, x1);
        }
        function _emscripten_glStencilOp(x0, x1, x2) {
          GLctx["stencilOp"](x0, x1, x2);
        }
        function _emscripten_glStencilOpSeparate(x0, x1, x2, x3) {
          GLctx["stencilOpSeparate"](x0, x1, x2, x3);
        }
        function _emscripten_glTexImage2D(target, level, internalFormat, width, height, border, format, type, pixels) {
          GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) : null);
        }
        function _emscripten_glTexParameterf(x0, x1, x2) {
          GLctx["texParameterf"](x0, x1, x2);
        }
        function _emscripten_glTexParameterfv(target, pname, params) {
          var param = HEAPF32[params >> 2];
          GLctx.texParameterf(target, pname, param);
        }
        function _emscripten_glTexParameteri(x0, x1, x2) {
          GLctx["texParameteri"](x0, x1, x2);
        }
        function _emscripten_glTexParameteriv(target, pname, params) {
          var param = HEAP32[params >> 2];
          GLctx.texParameteri(target, pname, param);
        }
        function _emscripten_glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels) {
          var pixelData = null;
          if (pixels) pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, 0);
          GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixelData);
        }
        function _emscripten_glUniform1f(location, v0) {
          GLctx.uniform1f(GL.uniforms[location], v0);
        }
        function _emscripten_glUniform1fv(location, count, value) {
          if (count <= GL.MINI_TEMP_BUFFER_SIZE) {
            var view = GL.miniTempBufferViews[count - 1];
            for (var i2 = 0; i2 < count; ++i2) {
              view[i2] = HEAPF32[value + 4 * i2 >> 2];
            }
          } else {
            var view = HEAPF32.subarray(value >> 2, value + count * 4 >> 2);
          }
          GLctx.uniform1fv(GL.uniforms[location], view);
        }
        function _emscripten_glUniform1i(location, v0) {
          GLctx.uniform1i(GL.uniforms[location], v0);
        }
        function _emscripten_glUniform1iv(location, count, value) {
          GLctx.uniform1iv(GL.uniforms[location], HEAP32.subarray(value >> 2, value + count * 4 >> 2));
        }
        function _emscripten_glUniform2f(location, v0, v1) {
          GLctx.uniform2f(GL.uniforms[location], v0, v1);
        }
        function _emscripten_glUniform2fv(location, count, value) {
          if (2 * count <= GL.MINI_TEMP_BUFFER_SIZE) {
            var view = GL.miniTempBufferViews[2 * count - 1];
            for (var i2 = 0; i2 < 2 * count; i2 += 2) {
              view[i2] = HEAPF32[value + 4 * i2 >> 2];
              view[i2 + 1] = HEAPF32[value + (4 * i2 + 4) >> 2];
            }
          } else {
            var view = HEAPF32.subarray(value >> 2, value + count * 8 >> 2);
          }
          GLctx.uniform2fv(GL.uniforms[location], view);
        }
        function _emscripten_glUniform2i(location, v0, v1) {
          GLctx.uniform2i(GL.uniforms[location], v0, v1);
        }
        function _emscripten_glUniform2iv(location, count, value) {
          GLctx.uniform2iv(GL.uniforms[location], HEAP32.subarray(value >> 2, value + count * 8 >> 2));
        }
        function _emscripten_glUniform3f(location, v0, v1, v2) {
          GLctx.uniform3f(GL.uniforms[location], v0, v1, v2);
        }
        function _emscripten_glUniform3fv(location, count, value) {
          if (3 * count <= GL.MINI_TEMP_BUFFER_SIZE) {
            var view = GL.miniTempBufferViews[3 * count - 1];
            for (var i2 = 0; i2 < 3 * count; i2 += 3) {
              view[i2] = HEAPF32[value + 4 * i2 >> 2];
              view[i2 + 1] = HEAPF32[value + (4 * i2 + 4) >> 2];
              view[i2 + 2] = HEAPF32[value + (4 * i2 + 8) >> 2];
            }
          } else {
            var view = HEAPF32.subarray(value >> 2, value + count * 12 >> 2);
          }
          GLctx.uniform3fv(GL.uniforms[location], view);
        }
        function _emscripten_glUniform3i(location, v0, v1, v2) {
          GLctx.uniform3i(GL.uniforms[location], v0, v1, v2);
        }
        function _emscripten_glUniform3iv(location, count, value) {
          GLctx.uniform3iv(GL.uniforms[location], HEAP32.subarray(value >> 2, value + count * 12 >> 2));
        }
        function _emscripten_glUniform4f(location, v0, v1, v2, v3) {
          GLctx.uniform4f(GL.uniforms[location], v0, v1, v2, v3);
        }
        function _emscripten_glUniform4fv(location, count, value) {
          if (4 * count <= GL.MINI_TEMP_BUFFER_SIZE) {
            var view = GL.miniTempBufferViews[4 * count - 1];
            for (var i2 = 0; i2 < 4 * count; i2 += 4) {
              view[i2] = HEAPF32[value + 4 * i2 >> 2];
              view[i2 + 1] = HEAPF32[value + (4 * i2 + 4) >> 2];
              view[i2 + 2] = HEAPF32[value + (4 * i2 + 8) >> 2];
              view[i2 + 3] = HEAPF32[value + (4 * i2 + 12) >> 2];
            }
          } else {
            var view = HEAPF32.subarray(value >> 2, value + count * 16 >> 2);
          }
          GLctx.uniform4fv(GL.uniforms[location], view);
        }
        function _emscripten_glUniform4i(location, v0, v1, v2, v3) {
          GLctx.uniform4i(GL.uniforms[location], v0, v1, v2, v3);
        }
        function _emscripten_glUniform4iv(location, count, value) {
          GLctx.uniform4iv(GL.uniforms[location], HEAP32.subarray(value >> 2, value + count * 16 >> 2));
        }
        function _emscripten_glUniformMatrix2fv(location, count, transpose, value) {
          if (4 * count <= GL.MINI_TEMP_BUFFER_SIZE) {
            var view = GL.miniTempBufferViews[4 * count - 1];
            for (var i2 = 0; i2 < 4 * count; i2 += 4) {
              view[i2] = HEAPF32[value + 4 * i2 >> 2];
              view[i2 + 1] = HEAPF32[value + (4 * i2 + 4) >> 2];
              view[i2 + 2] = HEAPF32[value + (4 * i2 + 8) >> 2];
              view[i2 + 3] = HEAPF32[value + (4 * i2 + 12) >> 2];
            }
          } else {
            var view = HEAPF32.subarray(value >> 2, value + count * 16 >> 2);
          }
          GLctx.uniformMatrix2fv(GL.uniforms[location], !!transpose, view);
        }
        function _emscripten_glUniformMatrix3fv(location, count, transpose, value) {
          if (9 * count <= GL.MINI_TEMP_BUFFER_SIZE) {
            var view = GL.miniTempBufferViews[9 * count - 1];
            for (var i2 = 0; i2 < 9 * count; i2 += 9) {
              view[i2] = HEAPF32[value + 4 * i2 >> 2];
              view[i2 + 1] = HEAPF32[value + (4 * i2 + 4) >> 2];
              view[i2 + 2] = HEAPF32[value + (4 * i2 + 8) >> 2];
              view[i2 + 3] = HEAPF32[value + (4 * i2 + 12) >> 2];
              view[i2 + 4] = HEAPF32[value + (4 * i2 + 16) >> 2];
              view[i2 + 5] = HEAPF32[value + (4 * i2 + 20) >> 2];
              view[i2 + 6] = HEAPF32[value + (4 * i2 + 24) >> 2];
              view[i2 + 7] = HEAPF32[value + (4 * i2 + 28) >> 2];
              view[i2 + 8] = HEAPF32[value + (4 * i2 + 32) >> 2];
            }
          } else {
            var view = HEAPF32.subarray(value >> 2, value + count * 36 >> 2);
          }
          GLctx.uniformMatrix3fv(GL.uniforms[location], !!transpose, view);
        }
        function _emscripten_glUniformMatrix4fv(location, count, transpose, value) {
          if (16 * count <= GL.MINI_TEMP_BUFFER_SIZE) {
            var view = GL.miniTempBufferViews[16 * count - 1];
            for (var i2 = 0; i2 < 16 * count; i2 += 16) {
              view[i2] = HEAPF32[value + 4 * i2 >> 2];
              view[i2 + 1] = HEAPF32[value + (4 * i2 + 4) >> 2];
              view[i2 + 2] = HEAPF32[value + (4 * i2 + 8) >> 2];
              view[i2 + 3] = HEAPF32[value + (4 * i2 + 12) >> 2];
              view[i2 + 4] = HEAPF32[value + (4 * i2 + 16) >> 2];
              view[i2 + 5] = HEAPF32[value + (4 * i2 + 20) >> 2];
              view[i2 + 6] = HEAPF32[value + (4 * i2 + 24) >> 2];
              view[i2 + 7] = HEAPF32[value + (4 * i2 + 28) >> 2];
              view[i2 + 8] = HEAPF32[value + (4 * i2 + 32) >> 2];
              view[i2 + 9] = HEAPF32[value + (4 * i2 + 36) >> 2];
              view[i2 + 10] = HEAPF32[value + (4 * i2 + 40) >> 2];
              view[i2 + 11] = HEAPF32[value + (4 * i2 + 44) >> 2];
              view[i2 + 12] = HEAPF32[value + (4 * i2 + 48) >> 2];
              view[i2 + 13] = HEAPF32[value + (4 * i2 + 52) >> 2];
              view[i2 + 14] = HEAPF32[value + (4 * i2 + 56) >> 2];
              view[i2 + 15] = HEAPF32[value + (4 * i2 + 60) >> 2];
            }
          } else {
            var view = HEAPF32.subarray(value >> 2, value + count * 64 >> 2);
          }
          GLctx.uniformMatrix4fv(GL.uniforms[location], !!transpose, view);
        }
        function _emscripten_glUseProgram(program) {
          GLctx.useProgram(GL.programs[program]);
        }
        function _emscripten_glValidateProgram(program) {
          GLctx.validateProgram(GL.programs[program]);
        }
        function _emscripten_glVertexAttrib1f(x0, x1) {
          GLctx["vertexAttrib1f"](x0, x1);
        }
        function _emscripten_glVertexAttrib1fv(index, v) {
          GLctx.vertexAttrib1f(index, HEAPF32[v >> 2]);
        }
        function _emscripten_glVertexAttrib2f(x0, x1, x2) {
          GLctx["vertexAttrib2f"](x0, x1, x2);
        }
        function _emscripten_glVertexAttrib2fv(index, v) {
          GLctx.vertexAttrib2f(index, HEAPF32[v >> 2], HEAPF32[v + 4 >> 2]);
        }
        function _emscripten_glVertexAttrib3f(x0, x1, x2, x3) {
          GLctx["vertexAttrib3f"](x0, x1, x2, x3);
        }
        function _emscripten_glVertexAttrib3fv(index, v) {
          GLctx.vertexAttrib3f(index, HEAPF32[v >> 2], HEAPF32[v + 4 >> 2], HEAPF32[v + 8 >> 2]);
        }
        function _emscripten_glVertexAttrib4f(x0, x1, x2, x3, x4) {
          GLctx["vertexAttrib4f"](x0, x1, x2, x3, x4);
        }
        function _emscripten_glVertexAttrib4fv(index, v) {
          GLctx.vertexAttrib4f(index, HEAPF32[v >> 2], HEAPF32[v + 4 >> 2], HEAPF32[v + 8 >> 2], HEAPF32[v + 12 >> 2]);
        }
        function _emscripten_glVertexAttribDivisorANGLE(index, divisor) {
          GLctx["vertexAttribDivisor"](index, divisor);
        }
        function _emscripten_glVertexAttribPointer(index, size, type, normalized, stride, ptr) {
          GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr);
        }
        function _emscripten_glViewport(x0, x1, x2, x3) {
          GLctx["viewport"](x0, x1, x2, x3);
        }
        function _exit(status) {
          exit(status);
        }
        var ENV = {};
        function _getenv(name) {
          if (name === 0) return 0;
          name = UTF8ToString(name);
          if (!ENV.hasOwnProperty(name)) return 0;
          if (_getenv.ret) _free(_getenv.ret);
          _getenv.ret = allocateUTF8(ENV[name]);
          return _getenv.ret;
        }
        function _llvm_stackrestore(p) {
          var self2 = _llvm_stacksave;
          var ret = self2.LLVM_SAVEDSTACKS[p];
          self2.LLVM_SAVEDSTACKS.splice(p, 1);
          stackRestore(ret);
        }
        function _llvm_stacksave() {
          var self2 = _llvm_stacksave;
          if (!self2.LLVM_SAVEDSTACKS) {
            self2.LLVM_SAVEDSTACKS = [];
          }
          self2.LLVM_SAVEDSTACKS.push(stackSave());
          return self2.LLVM_SAVEDSTACKS.length - 1;
        }
        function _llvm_trap() {
          abort("trap!");
        }
        function _emscripten_memcpy_big(dest, src, num) {
          HEAPU8.set(HEAPU8.subarray(src, src + num), dest);
        }
        function _pthread_cond_wait() {
          return 0;
        }
        function abortOnCannotGrowMemory(requestedSize) {
          abort("OOM");
        }
        function emscripten_realloc_buffer(size) {
          try {
            wasmMemory.grow(size - buffer.byteLength + 65535 >> 16);
            updateGlobalBufferAndViews(wasmMemory.buffer);
            return 1;
          } catch (e) {
          }
        }
        function _emscripten_resize_heap(requestedSize) {
          var oldSize = _emscripten_get_heap_size();
          var PAGE_MULTIPLE = 65536;
          var LIMIT = 2147483648 - PAGE_MULTIPLE;
          if (requestedSize > LIMIT) {
            return false;
          }
          var MIN_TOTAL_MEMORY = 16777216;
          var newSize = Math.max(oldSize, MIN_TOTAL_MEMORY);
          while (newSize < requestedSize) {
            if (newSize <= 536870912) {
              newSize = alignUp(2 * newSize, PAGE_MULTIPLE);
            } else {
              newSize = Math.min(alignUp((3 * newSize + 2147483648) / 4, PAGE_MULTIPLE), LIMIT);
            }
          }
          var replacement = emscripten_realloc_buffer(newSize);
          if (!replacement) {
            return false;
          }
          return true;
        }
        function __isLeapYear(year) {
          return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
        }
        function __arraySum(array, index) {
          var sum = 0;
          for (var i2 = 0; i2 <= index; sum += array[i2++]) ;
          return sum;
        }
        var __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        function __addDays(date, days) {
          var newDate = new Date(date.getTime());
          while (days > 0) {
            var leap = __isLeapYear(newDate.getFullYear());
            var currentMonth = newDate.getMonth();
            var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];
            if (days > daysInCurrentMonth - newDate.getDate()) {
              days -= daysInCurrentMonth - newDate.getDate() + 1;
              newDate.setDate(1);
              if (currentMonth < 11) {
                newDate.setMonth(currentMonth + 1);
              } else {
                newDate.setMonth(0);
                newDate.setFullYear(newDate.getFullYear() + 1);
              }
            } else {
              newDate.setDate(newDate.getDate() + days);
              return newDate;
            }
          }
          return newDate;
        }
        function _strftime(s, maxsize, format, tm) {
          var tm_zone = HEAP32[tm + 40 >> 2];
          var date = { tm_sec: HEAP32[tm >> 2], tm_min: HEAP32[tm + 4 >> 2], tm_hour: HEAP32[tm + 8 >> 2], tm_mday: HEAP32[tm + 12 >> 2], tm_mon: HEAP32[tm + 16 >> 2], tm_year: HEAP32[tm + 20 >> 2], tm_wday: HEAP32[tm + 24 >> 2], tm_yday: HEAP32[tm + 28 >> 2], tm_isdst: HEAP32[tm + 32 >> 2], tm_gmtoff: HEAP32[tm + 36 >> 2], tm_zone: tm_zone ? UTF8ToString(tm_zone) : "" };
          var pattern = UTF8ToString(format);
          var EXPANSION_RULES_1 = { "%c": "%a %b %d %H:%M:%S %Y", "%D": "%m/%d/%y", "%F": "%Y-%m-%d", "%h": "%b", "%r": "%I:%M:%S %p", "%R": "%H:%M", "%T": "%H:%M:%S", "%x": "%m/%d/%y", "%X": "%H:%M:%S", "%Ec": "%c", "%EC": "%C", "%Ex": "%m/%d/%y", "%EX": "%H:%M:%S", "%Ey": "%y", "%EY": "%Y", "%Od": "%d", "%Oe": "%e", "%OH": "%H", "%OI": "%I", "%Om": "%m", "%OM": "%M", "%OS": "%S", "%Ou": "%u", "%OU": "%U", "%OV": "%V", "%Ow": "%w", "%OW": "%W", "%Oy": "%y" };
          for (var rule in EXPANSION_RULES_1) {
            pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule]);
          }
          var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          function leadingSomething(value, digits, character) {
            var str = typeof value === "number" ? value.toString() : value || "";
            while (str.length < digits) {
              str = character[0] + str;
            }
            return str;
          }
          function leadingNulls(value, digits) {
            return leadingSomething(value, digits, "0");
          }
          function compareByDay(date1, date2) {
            function sgn(value) {
              return value < 0 ? -1 : value > 0 ? 1 : 0;
            }
            var compare;
            if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
              if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
                compare = sgn(date1.getDate() - date2.getDate());
              }
            }
            return compare;
          }
          function getFirstWeekStartDate(janFourth) {
            switch (janFourth.getDay()) {
              case 0:
                return new Date(janFourth.getFullYear() - 1, 11, 29);
              case 1:
                return janFourth;
              case 2:
                return new Date(janFourth.getFullYear(), 0, 3);
              case 3:
                return new Date(janFourth.getFullYear(), 0, 2);
              case 4:
                return new Date(janFourth.getFullYear(), 0, 1);
              case 5:
                return new Date(janFourth.getFullYear() - 1, 11, 31);
              case 6:
                return new Date(janFourth.getFullYear() - 1, 11, 30);
            }
          }
          function getWeekBasedYear(date2) {
            var thisDate = __addDays(new Date(date2.tm_year + 1900, 0, 1), date2.tm_yday);
            var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
            var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
            var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
            var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
            if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
              if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
                return thisDate.getFullYear() + 1;
              } else {
                return thisDate.getFullYear();
              }
            } else {
              return thisDate.getFullYear() - 1;
            }
          }
          var EXPANSION_RULES_2 = { "%a": function(date2) {
            return WEEKDAYS[date2.tm_wday].substring(0, 3);
          }, "%A": function(date2) {
            return WEEKDAYS[date2.tm_wday];
          }, "%b": function(date2) {
            return MONTHS[date2.tm_mon].substring(0, 3);
          }, "%B": function(date2) {
            return MONTHS[date2.tm_mon];
          }, "%C": function(date2) {
            var year = date2.tm_year + 1900;
            return leadingNulls(year / 100 | 0, 2);
          }, "%d": function(date2) {
            return leadingNulls(date2.tm_mday, 2);
          }, "%e": function(date2) {
            return leadingSomething(date2.tm_mday, 2, " ");
          }, "%g": function(date2) {
            return getWeekBasedYear(date2).toString().substring(2);
          }, "%G": function(date2) {
            return getWeekBasedYear(date2);
          }, "%H": function(date2) {
            return leadingNulls(date2.tm_hour, 2);
          }, "%I": function(date2) {
            var twelveHour = date2.tm_hour;
            if (twelveHour == 0) twelveHour = 12;
            else if (twelveHour > 12) twelveHour -= 12;
            return leadingNulls(twelveHour, 2);
          }, "%j": function(date2) {
            return leadingNulls(date2.tm_mday + __arraySum(__isLeapYear(date2.tm_year + 1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date2.tm_mon - 1), 3);
          }, "%m": function(date2) {
            return leadingNulls(date2.tm_mon + 1, 2);
          }, "%M": function(date2) {
            return leadingNulls(date2.tm_min, 2);
          }, "%n": function() {
            return "\n";
          }, "%p": function(date2) {
            if (date2.tm_hour >= 0 && date2.tm_hour < 12) {
              return "AM";
            } else {
              return "PM";
            }
          }, "%S": function(date2) {
            return leadingNulls(date2.tm_sec, 2);
          }, "%t": function() {
            return "	";
          }, "%u": function(date2) {
            return date2.tm_wday || 7;
          }, "%U": function(date2) {
            var janFirst = new Date(date2.tm_year + 1900, 0, 1);
            var firstSunday = janFirst.getDay() === 0 ? janFirst : __addDays(janFirst, 7 - janFirst.getDay());
            var endDate = new Date(date2.tm_year + 1900, date2.tm_mon, date2.tm_mday);
            if (compareByDay(firstSunday, endDate) < 0) {
              var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
              var firstSundayUntilEndJanuary = 31 - firstSunday.getDate();
              var days = firstSundayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
              return leadingNulls(Math.ceil(days / 7), 2);
            }
            return compareByDay(firstSunday, janFirst) === 0 ? "01" : "00";
          }, "%V": function(date2) {
            var janFourthThisYear = new Date(date2.tm_year + 1900, 0, 4);
            var janFourthNextYear = new Date(date2.tm_year + 1901, 0, 4);
            var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
            var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
            var endDate = __addDays(new Date(date2.tm_year + 1900, 0, 1), date2.tm_yday);
            if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
              return "53";
            }
            if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
              return "01";
            }
            var daysDifference;
            if (firstWeekStartThisYear.getFullYear() < date2.tm_year + 1900) {
              daysDifference = date2.tm_yday + 32 - firstWeekStartThisYear.getDate();
            } else {
              daysDifference = date2.tm_yday + 1 - firstWeekStartThisYear.getDate();
            }
            return leadingNulls(Math.ceil(daysDifference / 7), 2);
          }, "%w": function(date2) {
            return date2.tm_wday;
          }, "%W": function(date2) {
            var janFirst = new Date(date2.tm_year, 0, 1);
            var firstMonday = janFirst.getDay() === 1 ? janFirst : __addDays(janFirst, janFirst.getDay() === 0 ? 1 : 7 - janFirst.getDay() + 1);
            var endDate = new Date(date2.tm_year + 1900, date2.tm_mon, date2.tm_mday);
            if (compareByDay(firstMonday, endDate) < 0) {
              var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
              var firstMondayUntilEndJanuary = 31 - firstMonday.getDate();
              var days = firstMondayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
              return leadingNulls(Math.ceil(days / 7), 2);
            }
            return compareByDay(firstMonday, janFirst) === 0 ? "01" : "00";
          }, "%y": function(date2) {
            return (date2.tm_year + 1900).toString().substring(2);
          }, "%Y": function(date2) {
            return date2.tm_year + 1900;
          }, "%z": function(date2) {
            var off = date2.tm_gmtoff;
            var ahead = off >= 0;
            off = Math.abs(off) / 60;
            off = off / 60 * 100 + off % 60;
            return (ahead ? "+" : "-") + String("0000" + off).slice(-4);
          }, "%Z": function(date2) {
            return date2.tm_zone;
          }, "%%": function() {
            return "%";
          } };
          for (var rule in EXPANSION_RULES_2) {
            if (pattern.indexOf(rule) >= 0) {
              pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_2[rule](date));
            }
          }
          var bytes = intArrayFromString(pattern, false);
          if (bytes.length > maxsize) {
            return 0;
          }
          writeArrayToMemory(bytes, s);
          return bytes.length - 1;
        }
        function _strftime_l(s, maxsize, format, tm) {
          return _strftime(s, maxsize, format, tm);
        }
        FS.staticInit();
        if (ENVIRONMENT_HAS_NODE) {
          var fs = require("fs");
          var NODEJS_PATH = require("path");
          NODEFS.staticInit();
        }
        InternalError = Module["InternalError"] = extendError(Error, "InternalError");
        embind_init_charCodes();
        BindingError = Module["BindingError"] = extendError(Error, "BindingError");
        init_ClassHandle();
        init_RegisteredPointer();
        init_embind();
        UnboundTypeError = Module["UnboundTypeError"] = extendError(Error, "UnboundTypeError");
        init_emval();
        var GLctx;
        GL.init();
        for (var i = 0; i < 32; i++) __tempFixedLengthArray.push(new Array(i));
        function intArrayFromString(stringy, dontAddNull, length) {
          var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
          var u8array = new Array(len);
          var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
          if (dontAddNull) u8array.length = numBytesWritten;
          return u8array;
        }
        var asmGlobalArg = {};
        var asmLibraryArg = { "e": abort, "Ra": setTempRet0, "b": ___assert_fail, "p": ___cxa_allocate_exception, "Oa": ___cxa_pure_virtual, "n": ___cxa_throw, "Ea": ___cxa_uncaught_exceptions, "A": ___lock, "ja": ___map_file, "z": ___setErrNo, "Q": ___syscall140, "ed": ___syscall145, "F": ___syscall146, "Lc": ___syscall54, "Ac": ___syscall6, "pc": ___syscall91, "y": ___unlock, "Wb": __embind_finalize_value_object, "Lb": __embind_register_bool, "Ab": __embind_register_class, "pb": __embind_register_class_constructor, "E": __embind_register_class_function, "l": __embind_register_class_property, "Qa": __embind_register_emval, "m": __embind_register_enum, "d": __embind_register_enum_value, "D": __embind_register_float, "h": __embind_register_integer, "g": __embind_register_memory_view, "C": __embind_register_std_string, "Pa": __embind_register_std_wstring, "Na": __embind_register_value_object, "w": __embind_register_value_object_field, "Ma": __embind_register_void, "r": __emval_as, "La": __emval_call_void_method, "f": __emval_decref, "Ka": __emval_get_method_caller, "B": __emval_get_module_property, "o": __emval_get_property, "v": __emval_incref, "Ja": __emval_new, "i": __emval_new_cstring, "Ia": __emval_new_object, "q": __emval_run_destructors, "u": __emval_set_property, "t": __emval_take_value, "c": _abort, "Ha": _emscripten_get_heap_size, "Ga": _emscripten_glActiveTexture, "Fa": _emscripten_glAttachShader, "Da": _emscripten_glBeginQueryEXT, "Ca": _emscripten_glBindAttribLocation, "Ba": _emscripten_glBindBuffer, "Aa": _emscripten_glBindFramebuffer, "za": _emscripten_glBindRenderbuffer, "ya": _emscripten_glBindTexture, "xa": _emscripten_glBindVertexArrayOES, "wa": _emscripten_glBlendColor, "va": _emscripten_glBlendEquation, "ua": _emscripten_glBlendEquationSeparate, "ta": _emscripten_glBlendFunc, "sa": _emscripten_glBlendFuncSeparate, "ra": _emscripten_glBufferData, "qa": _emscripten_glBufferSubData, "pa": _emscripten_glCheckFramebufferStatus, "oa": _emscripten_glClear, "na": _emscripten_glClearColor, "ma": _emscripten_glClearDepthf, "la": _emscripten_glClearStencil, "ka": _emscripten_glColorMask, "ia": _emscripten_glCompileShader, "ha": _emscripten_glCompressedTexImage2D, "ga": _emscripten_glCompressedTexSubImage2D, "fa": _emscripten_glCopyTexImage2D, "ea": _emscripten_glCopyTexSubImage2D, "da": _emscripten_glCreateProgram, "ca": _emscripten_glCreateShader, "ba": _emscripten_glCullFace, "aa": _emscripten_glDeleteBuffers, "$": _emscripten_glDeleteFramebuffers, "_": _emscripten_glDeleteProgram, "Z": _emscripten_glDeleteQueriesEXT, "Y": _emscripten_glDeleteRenderbuffers, "X": _emscripten_glDeleteShader, "W": _emscripten_glDeleteTextures, "V": _emscripten_glDeleteVertexArraysOES, "U": _emscripten_glDepthFunc, "T": _emscripten_glDepthMask, "S": _emscripten_glDepthRangef, "R": _emscripten_glDetachShader, "P": _emscripten_glDisable, "O": _emscripten_glDisableVertexAttribArray, "N": _emscripten_glDrawArrays, "M": _emscripten_glDrawArraysInstancedANGLE, "L": _emscripten_glDrawBuffersWEBGL, "K": _emscripten_glDrawElements, "J": _emscripten_glDrawElementsInstancedANGLE, "I": _emscripten_glEnable, "H": _emscripten_glEnableVertexAttribArray, "G": _emscripten_glEndQueryEXT, "dd": _emscripten_glFinish, "cd": _emscripten_glFlush, "bd": _emscripten_glFramebufferRenderbuffer, "ad": _emscripten_glFramebufferTexture2D, "$c": _emscripten_glFrontFace, "_c": _emscripten_glGenBuffers, "Zc": _emscripten_glGenFramebuffers, "Yc": _emscripten_glGenQueriesEXT, "Xc": _emscripten_glGenRenderbuffers, "Wc": _emscripten_glGenTextures, "Vc": _emscripten_glGenVertexArraysOES, "Uc": _emscripten_glGenerateMipmap, "Tc": _emscripten_glGetActiveAttrib, "Sc": _emscripten_glGetActiveUniform, "Rc": _emscripten_glGetAttachedShaders, "Qc": _emscripten_glGetAttribLocation, "Pc": _emscripten_glGetBooleanv, "Oc": _emscripten_glGetBufferParameteriv, "Nc": _emscripten_glGetError, "Mc": _emscripten_glGetFloatv, "Kc": _emscripten_glGetFramebufferAttachmentParameteriv, "Jc": _emscripten_glGetIntegerv, "Ic": _emscripten_glGetProgramInfoLog, "Hc": _emscripten_glGetProgramiv, "Gc": _emscripten_glGetQueryObjecti64vEXT, "Fc": _emscripten_glGetQueryObjectivEXT, "Ec": _emscripten_glGetQueryObjectui64vEXT, "Dc": _emscripten_glGetQueryObjectuivEXT, "Cc": _emscripten_glGetQueryivEXT, "Bc": _emscripten_glGetRenderbufferParameteriv, "zc": _emscripten_glGetShaderInfoLog, "yc": _emscripten_glGetShaderPrecisionFormat, "xc": _emscripten_glGetShaderSource, "wc": _emscripten_glGetShaderiv, "vc": _emscripten_glGetString, "uc": _emscripten_glGetTexParameterfv, "tc": _emscripten_glGetTexParameteriv, "sc": _emscripten_glGetUniformLocation, "rc": _emscripten_glGetUniformfv, "qc": _emscripten_glGetUniformiv, "oc": _emscripten_glGetVertexAttribPointerv, "nc": _emscripten_glGetVertexAttribfv, "mc": _emscripten_glGetVertexAttribiv, "lc": _emscripten_glHint, "kc": _emscripten_glIsBuffer, "jc": _emscripten_glIsEnabled, "ic": _emscripten_glIsFramebuffer, "hc": _emscripten_glIsProgram, "gc": _emscripten_glIsQueryEXT, "fc": _emscripten_glIsRenderbuffer, "ec": _emscripten_glIsShader, "dc": _emscripten_glIsTexture, "cc": _emscripten_glIsVertexArrayOES, "bc": _emscripten_glLineWidth, "ac": _emscripten_glLinkProgram, "$b": _emscripten_glPixelStorei, "_b": _emscripten_glPolygonOffset, "Zb": _emscripten_glQueryCounterEXT, "Yb": _emscripten_glReadPixels, "Xb": _emscripten_glReleaseShaderCompiler, "Vb": _emscripten_glRenderbufferStorage, "Ub": _emscripten_glSampleCoverage, "Tb": _emscripten_glScissor, "Sb": _emscripten_glShaderBinary, "Rb": _emscripten_glShaderSource, "Qb": _emscripten_glStencilFunc, "Pb": _emscripten_glStencilFuncSeparate, "Ob": _emscripten_glStencilMask, "Nb": _emscripten_glStencilMaskSeparate, "Mb": _emscripten_glStencilOp, "Kb": _emscripten_glStencilOpSeparate, "Jb": _emscripten_glTexImage2D, "Ib": _emscripten_glTexParameterf, "Hb": _emscripten_glTexParameterfv, "Gb": _emscripten_glTexParameteri, "Fb": _emscripten_glTexParameteriv, "Eb": _emscripten_glTexSubImage2D, "Db": _emscripten_glUniform1f, "Cb": _emscripten_glUniform1fv, "Bb": _emscripten_glUniform1i, "zb": _emscripten_glUniform1iv, "yb": _emscripten_glUniform2f, "xb": _emscripten_glUniform2fv, "wb": _emscripten_glUniform2i, "vb": _emscripten_glUniform2iv, "ub": _emscripten_glUniform3f, "tb": _emscripten_glUniform3fv, "sb": _emscripten_glUniform3i, "rb": _emscripten_glUniform3iv, "qb": _emscripten_glUniform4f, "ob": _emscripten_glUniform4fv, "nb": _emscripten_glUniform4i, "mb": _emscripten_glUniform4iv, "lb": _emscripten_glUniformMatrix2fv, "kb": _emscripten_glUniformMatrix3fv, "jb": _emscripten_glUniformMatrix4fv, "ib": _emscripten_glUseProgram, "hb": _emscripten_glValidateProgram, "gb": _emscripten_glVertexAttrib1f, "fb": _emscripten_glVertexAttrib1fv, "eb": _emscripten_glVertexAttrib2f, "db": _emscripten_glVertexAttrib2fv, "cb": _emscripten_glVertexAttrib3f, "bb": _emscripten_glVertexAttrib3fv, "ab": _emscripten_glVertexAttrib4f, "$a": _emscripten_glVertexAttrib4fv, "_a": _emscripten_glVertexAttribDivisorANGLE, "Za": _emscripten_glVertexAttribPointer, "Ya": _emscripten_glViewport, "Xa": _emscripten_memcpy_big, "Wa": _emscripten_resize_heap, "x": _exit, "s": _getenv, "k": _llvm_stackrestore, "j": _llvm_stacksave, "Va": _llvm_trap, "Ua": _pthread_cond_wait, "Ta": _strftime_l, "Sa": abortOnCannotGrowMemory, "a": DYNAMICTOP_PTR };
        var asm = Module["asm"](asmGlobalArg, asmLibraryArg, buffer);
        Module["asm"] = asm;
        var __ZSt18uncaught_exceptionv = Module["__ZSt18uncaught_exceptionv"] = function() {
          return Module["asm"]["fd"].apply(null, arguments);
        };
        var ___embind_register_native_and_builtin_types = Module["___embind_register_native_and_builtin_types"] = function() {
          return Module["asm"]["gd"].apply(null, arguments);
        };
        var ___errno_location = Module["___errno_location"] = function() {
          return Module["asm"]["hd"].apply(null, arguments);
        };
        var ___getTypeName = Module["___getTypeName"] = function() {
          return Module["asm"]["id"].apply(null, arguments);
        };
        var _free = Module["_free"] = function() {
          return Module["asm"]["jd"].apply(null, arguments);
        };
        var _malloc = Module["_malloc"] = function() {
          return Module["asm"]["kd"].apply(null, arguments);
        };
        var globalCtors = Module["globalCtors"] = function() {
          return Module["asm"]["Wd"].apply(null, arguments);
        };
        var stackAlloc = Module["stackAlloc"] = function() {
          return Module["asm"]["Xd"].apply(null, arguments);
        };
        var stackRestore = Module["stackRestore"] = function() {
          return Module["asm"]["Yd"].apply(null, arguments);
        };
        var stackSave = Module["stackSave"] = function() {
          return Module["asm"]["Zd"].apply(null, arguments);
        };
        var dynCall_i = Module["dynCall_i"] = function() {
          return Module["asm"]["ld"].apply(null, arguments);
        };
        var dynCall_ii = Module["dynCall_ii"] = function() {
          return Module["asm"]["md"].apply(null, arguments);
        };
        var dynCall_iidiiii = Module["dynCall_iidiiii"] = function() {
          return Module["asm"]["nd"].apply(null, arguments);
        };
        var dynCall_iii = Module["dynCall_iii"] = function() {
          return Module["asm"]["od"].apply(null, arguments);
        };
        var dynCall_iiii = Module["dynCall_iiii"] = function() {
          return Module["asm"]["pd"].apply(null, arguments);
        };
        var dynCall_iiiii = Module["dynCall_iiiii"] = function() {
          return Module["asm"]["qd"].apply(null, arguments);
        };
        var dynCall_iiiiid = Module["dynCall_iiiiid"] = function() {
          return Module["asm"]["rd"].apply(null, arguments);
        };
        var dynCall_iiiiii = Module["dynCall_iiiiii"] = function() {
          return Module["asm"]["sd"].apply(null, arguments);
        };
        var dynCall_iiiiiid = Module["dynCall_iiiiiid"] = function() {
          return Module["asm"]["td"].apply(null, arguments);
        };
        var dynCall_iiiiiii = Module["dynCall_iiiiiii"] = function() {
          return Module["asm"]["ud"].apply(null, arguments);
        };
        var dynCall_iiiiiiii = Module["dynCall_iiiiiiii"] = function() {
          return Module["asm"]["vd"].apply(null, arguments);
        };
        var dynCall_iiiiiiiii = Module["dynCall_iiiiiiiii"] = function() {
          return Module["asm"]["wd"].apply(null, arguments);
        };
        var dynCall_iiiiiijii = Module["dynCall_iiiiiijii"] = function() {
          return Module["asm"]["xd"].apply(null, arguments);
        };
        var dynCall_iiiiij = Module["dynCall_iiiiij"] = function() {
          return Module["asm"]["yd"].apply(null, arguments);
        };
        var dynCall_iij = Module["dynCall_iij"] = function() {
          return Module["asm"]["zd"].apply(null, arguments);
        };
        var dynCall_jiji = Module["dynCall_jiji"] = function() {
          return Module["asm"]["Ad"].apply(null, arguments);
        };
        var dynCall_v = Module["dynCall_v"] = function() {
          return Module["asm"]["Bd"].apply(null, arguments);
        };
        var dynCall_vf = Module["dynCall_vf"] = function() {
          return Module["asm"]["Cd"].apply(null, arguments);
        };
        var dynCall_vff = Module["dynCall_vff"] = function() {
          return Module["asm"]["Dd"].apply(null, arguments);
        };
        var dynCall_vffff = Module["dynCall_vffff"] = function() {
          return Module["asm"]["Ed"].apply(null, arguments);
        };
        var dynCall_vfi = Module["dynCall_vfi"] = function() {
          return Module["asm"]["Fd"].apply(null, arguments);
        };
        var dynCall_vi = Module["dynCall_vi"] = function() {
          return Module["asm"]["Gd"].apply(null, arguments);
        };
        var dynCall_vif = Module["dynCall_vif"] = function() {
          return Module["asm"]["Hd"].apply(null, arguments);
        };
        var dynCall_viff = Module["dynCall_viff"] = function() {
          return Module["asm"]["Id"].apply(null, arguments);
        };
        var dynCall_vifff = Module["dynCall_vifff"] = function() {
          return Module["asm"]["Jd"].apply(null, arguments);
        };
        var dynCall_viffff = Module["dynCall_viffff"] = function() {
          return Module["asm"]["Kd"].apply(null, arguments);
        };
        var dynCall_vii = Module["dynCall_vii"] = function() {
          return Module["asm"]["Ld"].apply(null, arguments);
        };
        var dynCall_viif = Module["dynCall_viif"] = function() {
          return Module["asm"]["Md"].apply(null, arguments);
        };
        var dynCall_viii = Module["dynCall_viii"] = function() {
          return Module["asm"]["Nd"].apply(null, arguments);
        };
        var dynCall_viiii = Module["dynCall_viiii"] = function() {
          return Module["asm"]["Od"].apply(null, arguments);
        };
        var dynCall_viiiii = Module["dynCall_viiiii"] = function() {
          return Module["asm"]["Pd"].apply(null, arguments);
        };
        var dynCall_viiiiii = Module["dynCall_viiiiii"] = function() {
          return Module["asm"]["Qd"].apply(null, arguments);
        };
        var dynCall_viiiiiii = Module["dynCall_viiiiiii"] = function() {
          return Module["asm"]["Rd"].apply(null, arguments);
        };
        var dynCall_viiiiiiii = Module["dynCall_viiiiiiii"] = function() {
          return Module["asm"]["Sd"].apply(null, arguments);
        };
        var dynCall_viiiiiiiii = Module["dynCall_viiiiiiiii"] = function() {
          return Module["asm"]["Td"].apply(null, arguments);
        };
        var dynCall_viiiiiiiiii = Module["dynCall_viiiiiiiiii"] = function() {
          return Module["asm"]["Ud"].apply(null, arguments);
        };
        var dynCall_viijii = Module["dynCall_viijii"] = function() {
          return Module["asm"]["Vd"].apply(null, arguments);
        };
        Module["asm"] = asm;
        Module["GL"] = GL;
        var calledRun;
        Module["then"] = function(func) {
          if (calledRun) {
            func(Module);
          } else {
            var old = Module["onRuntimeInitialized"];
            Module["onRuntimeInitialized"] = function() {
              if (old) old();
              func(Module);
            };
          }
          return Module;
        };
        function ExitStatus(status) {
          this.name = "ExitStatus";
          this.message = "Program terminated with exit(" + status + ")";
          this.status = status;
        }
        dependenciesFulfilled = function runCaller() {
          if (!calledRun) run();
          if (!calledRun) dependenciesFulfilled = runCaller;
        };
        function run(args) {
          args = args || arguments_;
          if (runDependencies > 0) {
            return;
          }
          preRun();
          if (runDependencies > 0) return;
          function doRun() {
            if (calledRun) return;
            calledRun = true;
            if (ABORT) return;
            initRuntime();
            preMain();
            if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
            postRun();
          }
          if (Module["setStatus"]) {
            Module["setStatus"]("Running...");
            setTimeout(function() {
              setTimeout(function() {
                Module["setStatus"]("");
              }, 1);
              doRun();
            }, 1);
          } else {
            doRun();
          }
        }
        Module["run"] = run;
        function exit(status, implicit) {
          if (implicit && noExitRuntime && status === 0) {
            return;
          }
          if (noExitRuntime) {
          } else {
            ABORT = true;
            EXITSTATUS = status;
            exitRuntime();
            if (Module["onExit"]) Module["onExit"](status);
          }
          quit_(status, new ExitStatus(status));
        }
        function abort(what) {
          if (Module["onAbort"]) {
            Module["onAbort"](what);
          }
          what += "";
          out(what);
          err(what);
          ABORT = true;
          EXITSTATUS = 1;
          throw "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
        }
        Module["abort"] = abort;
        if (Module["preInit"]) {
          if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
          while (Module["preInit"].length > 0) {
            Module["preInit"].pop()();
          }
        }
        noExitRuntime = true;
        run();
        return LIBKTX2;
      });
    })();
    if (typeof exports === "object" && typeof module === "object")
      module.exports = LIBKTX;
    else if (typeof define === "function" && define["amd"])
      define([], function() {
        return LIBKTX;
      });
    else if (typeof exports === "object")
      exports["LIBKTX"] = LIBKTX;
  }
});

// src/redcube.node.ts
var redcube_node_exports = {};
__export(redcube_node_exports, {
  RedCube: () => RedCube
});
module.exports = __toCommonJS(redcube_node_exports);

// src/matrix.ts
var Matrix4 = class _Matrix4 {
  elements;
  animated;
  constructor(opt_src) {
    let i;
    let s;
    let d;
    if (opt_src && typeof opt_src === "object" && opt_src.hasOwnProperty("elements")) {
      s = opt_src.elements;
      d = new Float32Array(16);
      for (i = 0; i < 16; ++i) {
        d[i] = s[i];
      }
      this.elements = d;
    } else {
      this.elements = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }
  }
  /**
   * Copy matrix.
   * @param src source matrix
   * @return this
   */
  set(src) {
    let i;
    let s;
    let d;
    s = src;
    d = this.elements;
    if (s === d) {
      return;
    }
    for (i = 0; i < 16; ++i) {
      d[i] = s[i];
    }
    return this;
  }
  multiply(matrix) {
    this.concat(matrix);
    return this;
  }
  /**
   * Multiply the matrix from the right.
   * @param other The multiply matrix
   * @return this
   */
  concat({ elements }) {
    let i;
    let e;
    let a;
    let b;
    let ai0;
    let ai1;
    let ai2;
    let ai3;
    e = this.elements;
    a = this.elements;
    b = elements;
    if (e === b) {
      b = new Float32Array(16);
      for (i = 0; i < 16; ++i) {
        b[i] = e[i];
      }
    }
    for (i = 0; i < 4; i++) {
      ai0 = a[i];
      ai1 = a[i + 4];
      ai2 = a[i + 8];
      ai3 = a[i + 12];
      e[i] = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
      e[i + 4] = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
      e[i + 8] = ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
      e[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
    }
    return this;
  }
  /**
   * Calculate the inverse matrix of specified matrix, and set to this.
   * @param other The source matrix
   * @return this
   */
  setInverseOf({ elements }) {
    let i;
    let s;
    let d;
    let inv;
    let det;
    s = elements;
    d = this.elements;
    inv = new Float32Array(16);
    inv[0] = s[5] * s[10] * s[15] - s[5] * s[11] * s[14] - s[9] * s[6] * s[15] + s[9] * s[7] * s[14] + s[13] * s[6] * s[11] - s[13] * s[7] * s[10];
    inv[4] = -s[4] * s[10] * s[15] + s[4] * s[11] * s[14] + s[8] * s[6] * s[15] - s[8] * s[7] * s[14] - s[12] * s[6] * s[11] + s[12] * s[7] * s[10];
    inv[8] = s[4] * s[9] * s[15] - s[4] * s[11] * s[13] - s[8] * s[5] * s[15] + s[8] * s[7] * s[13] + s[12] * s[5] * s[11] - s[12] * s[7] * s[9];
    inv[12] = -s[4] * s[9] * s[14] + s[4] * s[10] * s[13] + s[8] * s[5] * s[14] - s[8] * s[6] * s[13] - s[12] * s[5] * s[10] + s[12] * s[6] * s[9];
    inv[1] = -s[1] * s[10] * s[15] + s[1] * s[11] * s[14] + s[9] * s[2] * s[15] - s[9] * s[3] * s[14] - s[13] * s[2] * s[11] + s[13] * s[3] * s[10];
    inv[5] = s[0] * s[10] * s[15] - s[0] * s[11] * s[14] - s[8] * s[2] * s[15] + s[8] * s[3] * s[14] + s[12] * s[2] * s[11] - s[12] * s[3] * s[10];
    inv[9] = -s[0] * s[9] * s[15] + s[0] * s[11] * s[13] + s[8] * s[1] * s[15] - s[8] * s[3] * s[13] - s[12] * s[1] * s[11] + s[12] * s[3] * s[9];
    inv[13] = s[0] * s[9] * s[14] - s[0] * s[10] * s[13] - s[8] * s[1] * s[14] + s[8] * s[2] * s[13] + s[12] * s[1] * s[10] - s[12] * s[2] * s[9];
    inv[2] = s[1] * s[6] * s[15] - s[1] * s[7] * s[14] - s[5] * s[2] * s[15] + s[5] * s[3] * s[14] + s[13] * s[2] * s[7] - s[13] * s[3] * s[6];
    inv[6] = -s[0] * s[6] * s[15] + s[0] * s[7] * s[14] + s[4] * s[2] * s[15] - s[4] * s[3] * s[14] - s[12] * s[2] * s[7] + s[12] * s[3] * s[6];
    inv[10] = s[0] * s[5] * s[15] - s[0] * s[7] * s[13] - s[4] * s[1] * s[15] + s[4] * s[3] * s[13] + s[12] * s[1] * s[7] - s[12] * s[3] * s[5];
    inv[14] = -s[0] * s[5] * s[14] + s[0] * s[6] * s[13] + s[4] * s[1] * s[14] - s[4] * s[2] * s[13] - s[12] * s[1] * s[6] + s[12] * s[2] * s[5];
    inv[3] = -s[1] * s[6] * s[11] + s[1] * s[7] * s[10] + s[5] * s[2] * s[11] - s[5] * s[3] * s[10] - s[9] * s[2] * s[7] + s[9] * s[3] * s[6];
    inv[7] = s[0] * s[6] * s[11] - s[0] * s[7] * s[10] - s[4] * s[2] * s[11] + s[4] * s[3] * s[10] + s[8] * s[2] * s[7] - s[8] * s[3] * s[6];
    inv[11] = -s[0] * s[5] * s[11] + s[0] * s[7] * s[9] + s[4] * s[1] * s[11] - s[4] * s[3] * s[9] - s[8] * s[1] * s[7] + s[8] * s[3] * s[5];
    inv[15] = s[0] * s[5] * s[10] - s[0] * s[6] * s[9] - s[4] * s[1] * s[10] + s[4] * s[2] * s[9] + s[8] * s[1] * s[6] - s[8] * s[2] * s[5];
    det = s[0] * inv[0] + s[1] * inv[4] + s[2] * inv[8] + s[3] * inv[12];
    if (det === 0) {
      return this;
    }
    det = 1 / det;
    for (i = 0; i < 16; i++) {
      d[i] = inv[i] * det;
    }
    return this;
  }
  /**
   * Calculate the inverse matrix of this, and set to this.
   * @return this
   */
  invert() {
    return this.setInverseOf(this);
  }
  makeOrthographic(left, right, top, bottom, near, far) {
    var te = this.elements;
    var w = 1 / (right - left);
    var h = 1 / (top - bottom);
    var p = 1 / (far - near);
    var x = (right + left) * w;
    var y = (top + bottom) * h;
    var z = (far + near) * p;
    te[0] = 2 * w;
    te[4] = 0;
    te[8] = 0;
    te[12] = -x;
    te[1] = 0;
    te[5] = 2 * h;
    te[9] = 0;
    te[13] = -y;
    te[2] = 0;
    te[6] = 0;
    te[10] = -2 * p;
    te[14] = -z;
    te[3] = 0;
    te[7] = 0;
    te[11] = 0;
    te[15] = 1;
    return this;
  }
  /**
   * Set the orthographic projection matrix.
   * @param left The coordinate of the left of clipping plane.
   * @param right The coordinate of the right of clipping plane.
   * @param bottom The coordinate of the bottom of clipping plane.
   * @param top The coordinate of the top top clipping plane.
   * @param near The distances to the nearer depth clipping plane. This value is minus if the plane is to be behind the viewer.
   * @param far The distances to the farther depth clipping plane. This value is minus if the plane is to be behind the viewer.
   * @return this
   */
  setOrtho(r, t, near, far) {
    let e;
    let rw;
    let rh;
    let rd;
    rw = 1 / r;
    rh = 1 / t;
    rd = 2 / (near - far);
    e = this.elements;
    e[0] = rw;
    e[1] = 0;
    e[2] = 0;
    e[3] = 0;
    e[4] = 0;
    e[5] = rh;
    e[6] = 0;
    e[7] = 0;
    e[8] = 0;
    e[9] = 0;
    e[10] = rd;
    e[11] = (far + near) / (near - far);
    e[12] = 0;
    e[13] = 0;
    e[14] = 0;
    e[15] = 1;
    return this;
  }
  /**
   * Set the perspective projection matrix by fovy and aspect.
   * @param fovy The angle between the upper and lower sides of the frustum.
   * @param aspect The aspect ratio of the frustum. (width/height)
   * @param near The distances to the nearer depth clipping plane. This value must be plus value.
   * @param far The distances to the farther depth clipping plane. This value must be plus value.
   * @return this
   */
  setPerspective(fovy, aspect, near, far) {
    let e;
    let rd;
    let s;
    let ct;
    if (near === far || aspect === 0) {
      throw "null frustum";
    }
    if (near <= 0) {
      throw "near <= 0";
    }
    if (far <= 0) {
      throw "far <= 0";
    }
    fovy /= 2;
    s = Math.sin(fovy);
    if (s === 0) {
      throw "null frustum";
    }
    rd = 1 / (far - near);
    ct = Math.cos(fovy) / s;
    e = this.elements;
    e[0] = ct / aspect;
    e[1] = 0;
    e[2] = 0;
    e[3] = 0;
    e[4] = 0;
    e[5] = ct;
    e[6] = 0;
    e[7] = 0;
    e[8] = 0;
    e[9] = 0;
    e[10] = -(far + near) * rd;
    e[11] = -1;
    e[12] = 0;
    e[13] = 0;
    e[14] = -2 * near * far * rd;
    e[15] = 0;
    return this;
  }
  /**
   * Multiply the perspective projection matrix from the right.
   * @param fovy The angle between the upper and lower sides of the frustum.
   * @param aspect The aspect ratio of the frustum. (width/height)
   * @param near The distances to the nearer depth clipping plane. This value must be plus value.
   * @param far The distances to the farther depth clipping plane. This value must be plus value.
   * @return this
   */
  perspective(fovy, aspect, near, far) {
    return this.concat(new _Matrix4().setPerspective(fovy, aspect, near, far));
  }
  /**
   * Multiply the four-dimensional vector.
   * @param pos  The multiply vector
   * @return The result of multiplication(Float32Array)
   */
  multiplyVector4({ elements }) {
    const e = this.elements;
    const p = elements;
    const v = new Vector4();
    const result = v.elements;
    result[0] = p[0] * e[0] + p[1] * e[4] + p[2] * e[8] + p[3] * e[12];
    result[1] = p[0] * e[1] + p[1] * e[5] + p[2] * e[9] + p[3] * e[13];
    result[2] = p[0] * e[2] + p[1] * e[6] + p[2] * e[10] + p[3] * e[14];
    result[3] = p[0] * e[3] + p[1] * e[7] + p[2] * e[11] + p[3] * e[15];
    return v;
  }
  getScaling() {
    let e = this.elements;
    let m11 = e[0];
    let m12 = e[1];
    let m13 = e[2];
    let m21 = e[4];
    let m22 = e[5];
    let m23 = e[6];
    let m31 = e[8];
    let m32 = e[9];
    let m33 = e[10];
    let out = new Vector3([
      Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13),
      Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23),
      Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33)
    ]);
    return out;
  }
  scale(vec3) {
    const x = vec3.elements[0];
    const y = vec3.elements[1];
    const z = vec3.elements[2];
    const e = this.elements;
    e[0] *= x;
    e[4] *= y;
    e[8] *= z;
    e[1] *= x;
    e[5] *= y;
    e[9] *= z;
    e[2] *= x;
    e[6] *= y;
    e[10] *= z;
    e[3] *= x;
    e[7] *= y;
    e[11] *= z;
    return this;
  }
  restoreScale(vec3) {
    const x = vec3.elements[0];
    const y = vec3.elements[1];
    const z = vec3.elements[2];
    const e = this.elements;
    e[0] /= x;
    e[4] /= y;
    e[8] /= z;
    e[1] /= x;
    e[5] /= y;
    e[9] /= z;
    e[2] /= x;
    e[6] /= y;
    e[10] /= z;
    e[3] /= x;
    e[7] /= y;
    e[11] /= z;
    return this;
  }
  setTranslate(vec3) {
    const e = this.elements;
    const x = vec3.elements[0];
    const y = vec3.elements[1];
    const z = vec3.elements[2];
    e[12] = x;
    e[13] = y;
    e[14] = z;
    e[15] = 1;
    return this;
  }
  /**
   * Multiply the matrix for translation from the right.
   * @param x The X value of a translation.
   * @param y The Y value of a translation.
   * @param z The Z value of a translation.
   * @return this
   */
  translate(x, y, z) {
    const e = this.elements;
    e[12] += e[0] * x + e[4] * y + e[8] * z;
    e[13] += e[1] * x + e[5] * y + e[9] * z;
    e[14] += e[2] * x + e[6] * y + e[10] * z;
    e[15] += e[3] * x + e[7] * y + e[11] * z;
    return this;
  }
  getMaxScaleOnAxis() {
    const te = this.elements;
    const scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
    const scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
    const scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];
    return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
  }
  rotate(axis, rad) {
    let x = axis.elements[0], y = axis.elements[1], z = axis.elements[2];
    let len = Math.hypot(x, y, z);
    let s, c, t;
    let a00, a01, a02, a03;
    let a10, a11, a12, a13;
    let a20, a21, a22, a23;
    let b00, b01, b02;
    let b10, b11, b12;
    let b20, b21, b22;
    if (len < Number.EPSILON) {
      return null;
    }
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;
    let a = this.elements;
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    b00 = x * x * t + c;
    b01 = y * x * t + z * s;
    b02 = z * x * t - y * s;
    b10 = x * y * t - z * s;
    b11 = y * y * t + c;
    b12 = z * y * t + x * s;
    b20 = x * z * t + y * s;
    b21 = y * z * t - x * s;
    b22 = z * z * t + c;
    a[0] = a00 * b00 + a10 * b01 + a20 * b02;
    a[1] = a01 * b00 + a11 * b01 + a21 * b02;
    a[2] = a02 * b00 + a12 * b01 + a22 * b02;
    a[3] = a03 * b00 + a13 * b01 + a23 * b02;
    a[4] = a00 * b10 + a10 * b11 + a20 * b12;
    a[5] = a01 * b10 + a11 * b11 + a21 * b12;
    a[6] = a02 * b10 + a12 * b11 + a22 * b12;
    a[7] = a03 * b10 + a13 * b11 + a23 * b12;
    a[8] = a00 * b20 + a10 * b21 + a20 * b22;
    a[9] = a01 * b20 + a11 * b21 + a21 * b22;
    a[10] = a02 * b20 + a12 * b21 + a22 * b22;
    a[11] = a03 * b20 + a13 * b21 + a23 * b22;
    return this;
  }
  makeRotationAxis(axis, angle) {
    const te = this.elements;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const t = 1 - c;
    const x = axis.elements[0], y = axis.elements[1], z = axis.elements[2];
    const tx = t * x, ty = t * y;
    te[0] = tx * x + c;
    te[1] = tx * y - s * z;
    te[2] = tx * z + s * y;
    te[3] = 0;
    te[4] = tx * y + s * z;
    te[5] = ty * y + c;
    te[6] = ty * z - s * x;
    te[7] = 0;
    te[8] = tx * z - s * y;
    te[9] = ty * z + s * x;
    te[10] = t * z * z + c;
    te[11] = 0;
    te[15] = 1;
    return this;
  }
  makeRotationFromQuaternion(q) {
    const te = this.elements;
    const x = q[0];
    const y = q[1];
    const z = q[2];
    const w = q[3];
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;
    const xx = x * x2;
    const xy = x * y2;
    const xz = x * z2;
    const yy = y * y2;
    const yz = y * z2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;
    te[0] = 1 - (yy + zz);
    te[4] = xy - wz;
    te[8] = xz + wy;
    te[1] = xy + wz;
    te[5] = 1 - (xx + zz);
    te[9] = yz - wx;
    te[2] = xz - wy;
    te[6] = yz + wx;
    te[10] = 1 - (xx + yy);
    return this;
  }
  transpose() {
    let e;
    let t;
    e = this.elements;
    t = e[1];
    e[1] = e[4];
    e[4] = t;
    t = e[2];
    e[2] = e[8];
    e[8] = t;
    t = e[3];
    e[3] = e[12];
    e[12] = t;
    t = e[6];
    e[6] = e[9];
    e[9] = t;
    t = e[7];
    e[7] = e[13];
    e[13] = t;
    t = e[11];
    e[11] = e[14];
    e[14] = t;
    return this;
  }
};
var Vector3 = class _Vector3 {
  elements;
  get x() {
    return this.elements[0];
  }
  get y() {
    return this.elements[1];
  }
  get z() {
    return this.elements[2];
  }
  set x(v) {
    this.elements[0] = v;
  }
  set y(v) {
    this.elements[1] = v;
  }
  set z(v) {
    this.elements[2] = v;
  }
  static FromArrayToRef(array, offset, result) {
    result.x = array[offset];
    result.y = array[offset + 1];
    result.z = array[offset + 2];
  }
  constructor(opt_src) {
    const v = new Float32Array(3);
    if (opt_src && typeof opt_src === "object") {
      v[0] = opt_src[0];
      v[1] = opt_src[1];
      v[2] = opt_src[2];
    }
    this.elements = v;
  }
  projectOnVector(vector) {
    const scalar = _Vector3.dot(vector, this) / vector.lengthSq();
    return new _Vector3(vector.elements).scale(scalar);
  }
  applyQuaternion({ elements }) {
    const x = this.elements[0];
    const y = this.elements[1];
    const z = this.elements[2];
    const qx = elements[0];
    const qy = elements[1];
    const qz = elements[2];
    const qw = elements[3];
    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;
    this.elements[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    this.elements[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    this.elements[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
    return this;
  }
  /**
   * Normalize.
   * @return this
   */
  normalize() {
    const v = this.elements;
    const c = v[0];
    const d = v[1];
    const e = v[2];
    let g = Math.sqrt(c * c + d * d + e * e);
    if (g) {
      if (g == 1) {
        return this;
      }
    } else {
      v[0] = 0;
      v[1] = 0;
      v[2] = 0;
      return this;
    }
    g = 1 / g;
    v[0] = c * g;
    v[1] = d * g;
    v[2] = e * g;
    return this;
  }
  /**
   * Scales a vec3 by a scalar number
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a the vector to scale
   * @param {Number} b amount to scale the vector by
   * @returns {vec3} out
   */
  add(vector) {
    const a = this.elements;
    const b = vector.elements;
    a[0] = a[0] + b[0];
    a[1] = a[1] + b[1];
    a[2] = a[2] + b[2];
    return this;
  }
  addS(b) {
    const a = this.elements;
    a[0] = a[0] + b;
    a[1] = a[1] + b;
    a[2] = a[2] + b;
    return this;
  }
  scale(b) {
    const a = this.elements;
    a[0] = a[0] * b;
    a[1] = a[1] * b;
    a[2] = a[2] * b;
    return this;
  }
  scale2(scale) {
    return new _Vector3([this.x * scale, this.y * scale, this.z * scale]);
  }
  subtract2(otherVector) {
    return new _Vector3([this.x - otherVector.x, this.y - otherVector.y, this.z - otherVector.z]);
  }
  add2(otherVector) {
    return new _Vector3([this.x + otherVector.x, this.y + otherVector.y, this.z + otherVector.z]);
  }
  distanceToSquared(x, y, z) {
    const dx = this.elements[0] - x;
    const dy = this.elements[1] - y;
    const dz = this.elements[2] - z;
    return dx * dx + dy * dy + dz * dz;
  }
  subtract(vector) {
    const out = this.elements;
    const b = vector.elements;
    out[0] = out[0] - b[0];
    out[1] = out[1] - b[1];
    out[2] = out[2] - b[2];
    return this;
  }
  divideScalar(scalar) {
    return this.scale(1 / scalar);
  }
  applyMatrix4({ elements }) {
    const x = this.elements[0];
    const y = this.elements[1];
    const z = this.elements[2];
    const e = elements;
    this.elements[0] = e[0] * x + e[4] * y + e[8] * z + e[12];
    this.elements[1] = e[1] * x + e[5] * y + e[9] * z + e[13];
    this.elements[2] = e[2] * x + e[6] * y + e[10] * z + e[14];
    const w = e[3] * x + e[7] * y + e[11] * z + e[15];
    return this.divideScalar(w);
  }
  lerp(a, b, t) {
    const out = this.elements;
    const ax = a[0];
    const ay = a[1];
    const az = a[2];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    out[2] = az + t * (b[2] - az);
    return this;
  }
  lengthSq() {
    return this.elements[0] * this.elements[0] + this.elements[1] * this.elements[1] + this.elements[2] * this.elements[2];
  }
  multiply({ elements }) {
    this.elements[0] *= elements[0];
    this.elements[1] *= elements[1];
    this.elements[2] *= elements[2];
    return this;
  }
  static angle(a, b) {
    const tempA = new _Vector3(a.elements);
    const tempB = new _Vector3(b.elements);
    tempA.normalize();
    tempB.normalize();
    const cosine = _Vector3.dot(tempA, tempB);
    if (cosine > 1) {
      return 0;
    } else {
      return Math.acos(cosine);
    }
  }
  static cross(vecA, vecB) {
    const a = vecA.elements;
    const b = vecB.elements;
    const ax = a[0];
    const ay = a[1];
    const az = a[2];
    const bx = b[0];
    const by = b[1];
    const bz = b[2];
    const out = new _Vector3();
    out.elements[0] = ay * bz - az * by;
    out.elements[1] = az * bx - ax * bz;
    out.elements[2] = ax * by - ay * bx;
    return out;
  }
  static dot(vecA, vecB) {
    const a = vecA.elements;
    const b = vecB.elements;
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  min(v) {
    this.x = Math.min(this.x, v.x);
    this.y = Math.min(this.y, v.y);
    this.z = Math.min(this.z, v.z);
    return this;
  }
  max(v) {
    this.x = Math.max(this.x, v.x);
    this.y = Math.max(this.y, v.y);
    this.z = Math.max(this.z, v.z);
    return this;
  }
  subVectors(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    return this;
  }
};
var Box = class {
  min = new Vector3([Infinity, Infinity, Infinity]);
  max = new Vector3([-Infinity, -Infinity, -Infinity]);
  expand(box) {
    this.min.min(box.min);
    this.max.max(box.max);
  }
  getSize() {
    const size = new Vector3();
    size.subVectors(this.max, this.min);
    return size.length();
  }
};
var Vector4 = class {
  elements;
  constructor(opt_src) {
    const v = new Float32Array(4);
    if (opt_src && typeof opt_src === "object") {
      v[0] = opt_src[0];
      v[1] = opt_src[1];
      v[2] = opt_src[2];
      v[3] = opt_src[3];
    }
    this.elements = v;
  }
  set(e) {
    const a = this.elements;
    a[0] = e[0];
    a[1] = e[1];
    a[2] = e[2];
    a[3] = e[3];
    return this;
  }
  add(vector) {
    const a = this.elements;
    const b = vector.elements;
    a[0] = b[0];
    a[1] = b[1];
    a[2] = b[2];
    a[3] = a[3] + b[3];
    return this;
  }
  normalize() {
    const x = this.elements[0];
    const y = this.elements[1];
    const z = this.elements[2];
    const w = this.elements[3];
    let len = x * x + y * y + z * z + w * w;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
      this.elements[0] = x * len;
      this.elements[1] = y * len;
      this.elements[2] = z * len;
      this.elements[3] = w * len;
    }
    return this;
  }
  setFromRotationMatrix({ elements }) {
    const te = elements;
    const m11 = te[0];
    const m12 = te[4];
    const m13 = te[8];
    const m21 = te[1];
    const m22 = te[5];
    const m23 = te[9];
    const m31 = te[2];
    const m32 = te[6];
    const m33 = te[10];
    const trace = m11 + m22 + m33;
    let s;
    if (trace > 0) {
      s = 0.5 / Math.sqrt(trace + 1);
      this.elements[3] = 0.25 / s;
      this.elements[0] = (m32 - m23) * s;
      this.elements[1] = (m13 - m31) * s;
      this.elements[2] = (m21 - m12) * s;
    } else if (m11 > m22 && m11 > m33) {
      s = 2 * Math.sqrt(1 + m11 - m22 - m33);
      this.elements[3] = (m32 - m23) / s;
      this.elements[0] = 0.25 * s;
      this.elements[1] = (m12 + m21) / s;
      this.elements[2] = (m13 + m31) / s;
    } else if (m22 > m33) {
      s = 2 * Math.sqrt(1 + m22 - m11 - m33);
      this.elements[3] = (m13 - m31) / s;
      this.elements[0] = (m12 + m21) / s;
      this.elements[1] = 0.25 * s;
      this.elements[2] = (m23 + m32) / s;
    } else {
      s = 2 * Math.sqrt(1 + m33 - m11 - m22);
      this.elements[3] = (m21 - m12) / s;
      this.elements[0] = (m13 + m31) / s;
      this.elements[1] = (m23 + m32) / s;
      this.elements[2] = 0.25 * s;
    }
    return this;
  }
  lerp(a, b, t) {
    const out = this.elements;
    if (t === 0) {
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      return this;
    }
    if (t === 1) {
      out[0] = b[0];
      out[1] = b[1];
      out[2] = b[2];
      out[3] = b[3];
      return this;
    }
    const x = a[0], y = a[1], z = a[2], w = a[3];
    let cosHalfTheta = w * b[3] + x * b[0] + y * b[1] + z * b[2];
    if (cosHalfTheta < 0) {
      out[3] = -b[3];
      out[0] = -b[0];
      out[1] = -b[1];
      out[2] = -b[2];
      cosHalfTheta = -cosHalfTheta;
    } else {
      out[0] = b[0];
      out[1] = b[1];
      out[2] = b[2];
      out[3] = b[3];
    }
    if (cosHalfTheta >= 1) {
      out[3] = w;
      out[0] = x;
      out[1] = y;
      out[2] = z;
      return this;
    }
    const sqrSinHalfTheta = 1 - cosHalfTheta * cosHalfTheta;
    if (sqrSinHalfTheta <= Number.EPSILON) {
      var s = 1 - t;
      out[3] = s * w + t * out[3];
      out[0] = s * x + t * out[0];
      out[1] = s * y + t * out[1];
      out[2] = s * z + t * out[2];
      return this.normalize();
    }
    const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
    const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
    const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta, ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
    out[3] = w * ratioA + out[3] * ratioB;
    out[0] = x * ratioA + out[0] * ratioB;
    out[1] = y * ratioA + out[1] * ratioB;
    out[2] = z * ratioA + out[2] * ratioB;
    return this;
  }
  inverse() {
    this.elements[0] = -this.elements[0];
    this.elements[1] = -this.elements[1];
    this.elements[2] = -this.elements[2];
    return this;
  }
};
var Vector2 = class {
  elements;
  get x() {
    return this.elements[0];
  }
  get y() {
    return this.elements[1];
  }
  set x(v) {
    this.elements[0] = v;
  }
  set y(v) {
    this.elements[1] = v;
  }
  constructor(opt_src) {
    const v = new Float32Array(2);
    if (opt_src && typeof opt_src === "object") {
      v[0] = opt_src[0];
      v[1] = opt_src[1];
    }
    this.elements = v;
  }
  subtract(vector) {
    const out = this.elements;
    const b = vector.elements;
    out[0] = out[0] - b[0];
    out[1] = out[1] - b[1];
    return this;
  }
  lerp(a, b, t) {
    const out = this.elements;
    const ax = a[0];
    const ay = a[1];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    return this;
  }
};

// src/objects/scene.ts
var Scene = class {
  children;
  bin;
  matrixWorld;
  matrix;
  transparentChildren;
  opaqueChildren;
  meshes;
  tracks;
  cameras;
  lights;
  variants;
  visible = true;
  constructor() {
    this.opaqueChildren = [];
    this.transparentChildren = [];
    this.meshes = [];
    this.children = [];
    this.bin = [];
    this.matrixWorld = new Matrix4();
    this.matrix = new Matrix4();
    this.variants = [];
  }
};

// src/objects/object3d.ts
var Object3D = class {
  uuid;
  name;
  id;
  children;
  matrix;
  matrixWorld;
  parent;
  reflow;
  repaint;
  visible = true;
  instances = 1;
  matrices = [];
  constructor(name, parent) {
    this.uuid = Math.floor(Date.now() * Math.random());
    this.name = name;
    this.children = [];
    this.matrix = new Matrix4();
    this.matrixWorld = new Matrix4();
    this.parent = parent;
  }
  getPosition() {
    return new Float32Array([this.matrixWorld.elements[12], this.matrixWorld.elements[13], this.matrixWorld.elements[14]]);
  }
  setPosition(translation, rotation, scale) {
    if (rotation) {
      this.matrix.makeRotationFromQuaternion(rotation);
    }
    if (scale) {
      this.matrix.scale(new Vector3(scale));
    }
    if (translation) {
      this.matrix.setTranslate(new Vector3(translation));
    }
  }
  setMatrix(matrix) {
    this.matrix.set(matrix);
  }
  setMatrixWorld(matrix) {
    this.matrixWorld.set(matrix);
  }
  updateMatrix() {
    const m = new Matrix4();
    m.multiply(this.parent.matrixWorld);
    m.multiply(this.matrix);
    this.setMatrixWorld(m.elements);
    if (this.matrices.length) {
      for (const matrix of this.matrices) {
        const m2 = new Matrix4();
        m2.multiply(this.parent.matrixWorld);
        m2.multiply(matrix);
        matrix.set(m2.elements);
      }
    }
  }
};

// src/glEnum.ts
var glEnum_default = {
  "0": "NONE",
  "1": "ONE",
  "2": "LINE_LOOP",
  "3": "LINE_STRIP",
  "4": "TRIANGLES",
  "5": "TRIANGLE_STRIP",
  "6": "TRIANGLE_FAN",
  "256": "DEPTH_BUFFER_BIT",
  "512": "NEVER",
  "513": "LESS",
  "514": "EQUAL",
  "515": "LEQUAL",
  "516": "GREATER",
  "517": "NOTEQUAL",
  "518": "GEQUAL",
  "519": "ALWAYS",
  "768": "SRC_COLOR",
  "769": "ONE_MINUS_SRC_COLOR",
  "770": "SRC_ALPHA",
  "771": "ONE_MINUS_SRC_ALPHA",
  "772": "DST_ALPHA",
  "773": "ONE_MINUS_DST_ALPHA",
  "774": "DST_COLOR",
  "775": "ONE_MINUS_DST_COLOR",
  "776": "SRC_ALPHA_SATURATE",
  "1024": "STENCIL_BUFFER_BIT",
  "1028": "FRONT",
  "1029": "BACK",
  "1032": "FRONT_AND_BACK",
  "1280": "INVALID_ENUM",
  "1281": "INVALID_VALUE",
  "1282": "INVALID_OPERATION",
  "1285": "OUT_OF_MEMORY",
  "1286": "INVALID_FRAMEBUFFER_OPERATION",
  "1798": "drawingBufferHeight",
  "2304": "CW",
  "2305": "CCW",
  "2712": "drawingBufferWidth",
  "2849": "LINE_WIDTH",
  "2884": "CULL_FACE",
  "2885": "CULL_FACE_MODE",
  "2886": "FRONT_FACE",
  "2928": "DEPTH_RANGE",
  "2929": "DEPTH_TEST",
  "2930": "DEPTH_WRITEMASK",
  "2931": "DEPTH_CLEAR_VALUE",
  "2932": "DEPTH_FUNC",
  "2960": "STENCIL_TEST",
  "2961": "STENCIL_CLEAR_VALUE",
  "2962": "STENCIL_FUNC",
  "2963": "STENCIL_VALUE_MASK",
  "2964": "STENCIL_FAIL",
  "2965": "STENCIL_PASS_DEPTH_FAIL",
  "2966": "STENCIL_PASS_DEPTH_PASS",
  "2967": "STENCIL_REF",
  "2968": "STENCIL_WRITEMASK",
  "2978": "VIEWPORT",
  "3024": "DITHER",
  "3042": "BLEND",
  "3074": "READ_BUFFER",
  "3088": "SCISSOR_BOX",
  "3089": "SCISSOR_TEST",
  "3106": "COLOR_CLEAR_VALUE",
  "3107": "COLOR_WRITEMASK",
  "3314": "UNPACK_ROW_LENGTH",
  "3315": "UNPACK_SKIP_ROWS",
  "3316": "UNPACK_SKIP_PIXELS",
  "3317": "UNPACK_ALIGNMENT",
  "3330": "PACK_ROW_LENGTH",
  "3331": "PACK_SKIP_ROWS",
  "3332": "PACK_SKIP_PIXELS",
  "3333": "PACK_ALIGNMENT",
  "3379": "MAX_TEXTURE_SIZE",
  "3386": "MAX_VIEWPORT_DIMS",
  "3408": "SUBPIXEL_BITS",
  "3410": "RED_BITS",
  "3411": "GREEN_BITS",
  "3412": "BLUE_BITS",
  "3413": "ALPHA_BITS",
  "3414": "DEPTH_BITS",
  "3415": "STENCIL_BITS",
  "3553": "TEXTURE_2D",
  "4352": "DONT_CARE",
  "4353": "FASTEST",
  "4354": "NICEST",
  "5120": "BYTE",
  "5121": "UNSIGNED_BYTE",
  "5122": "SHORT",
  "5123": "UNSIGNED_SHORT",
  "5124": "INT",
  "5125": "UNSIGNED_INT",
  "5126": "FLOAT",
  "5131": "HALF_FLOAT",
  "5386": "INVERT",
  "5890": "TEXTURE",
  "6144": "COLOR",
  "6145": "DEPTH",
  "6146": "STENCIL",
  "6402": "DEPTH_COMPONENT",
  "6403": "RED",
  "6406": "ALPHA",
  "6407": "RGB",
  "6408": "RGBA",
  "6409": "LUMINANCE",
  "6410": "LUMINANCE_ALPHA",
  "7680": "KEEP",
  "7681": "REPLACE",
  "7682": "INCR",
  "7683": "DECR",
  "7936": "VENDOR",
  "7937": "RENDERER",
  "7938": "VERSION",
  "9728": "NEAREST",
  "9729": "LINEAR",
  "9984": "NEAREST_MIPMAP_NEAREST",
  "9985": "LINEAR_MIPMAP_NEAREST",
  "9986": "NEAREST_MIPMAP_LINEAR",
  "9987": "LINEAR_MIPMAP_LINEAR",
  "10240": "TEXTURE_MAG_FILTER",
  "10241": "TEXTURE_MIN_FILTER",
  "10242": "TEXTURE_WRAP_S",
  "10243": "TEXTURE_WRAP_T",
  "10497": "REPEAT",
  "10752": "POLYGON_OFFSET_UNITS",
  "16384": "COLOR_BUFFER_BIT",
  "32769": "CONSTANT_COLOR",
  "32770": "ONE_MINUS_CONSTANT_COLOR",
  "32771": "CONSTANT_ALPHA",
  "32772": "ONE_MINUS_CONSTANT_ALPHA",
  "32773": "BLEND_COLOR",
  "32774": "FUNC_ADD",
  "32775": "MIN",
  "32776": "MAX",
  "32777": "BLEND_EQUATION_RGB",
  "32778": "FUNC_SUBTRACT",
  "32779": "FUNC_REVERSE_SUBTRACT",
  "32819": "UNSIGNED_SHORT_4_4_4_4",
  "32820": "UNSIGNED_SHORT_5_5_5_1",
  "32823": "POLYGON_OFFSET_FILL",
  "32824": "POLYGON_OFFSET_FACTOR",
  "32849": "RGB8",
  "32854": "RGBA4",
  "32855": "RGB5_A1",
  "32856": "RGBA8",
  "32857": "RGB10_A2",
  "32873": "TEXTURE_BINDING_2D",
  "32874": "TEXTURE_BINDING_3D",
  "32877": "UNPACK_SKIP_IMAGES",
  "32878": "UNPACK_IMAGE_HEIGHT",
  "32879": "TEXTURE_3D",
  "32882": "TEXTURE_WRAP_R",
  "32883": "MAX_3D_TEXTURE_SIZE",
  "32926": "SAMPLE_ALPHA_TO_COVERAGE",
  "32928": "SAMPLE_COVERAGE",
  "32936": "SAMPLE_BUFFERS",
  "32937": "SAMPLES",
  "32938": "SAMPLE_COVERAGE_VALUE",
  "32939": "SAMPLE_COVERAGE_INVERT",
  "32968": "BLEND_DST_RGB",
  "32969": "BLEND_SRC_RGB",
  "32970": "BLEND_DST_ALPHA",
  "32971": "BLEND_SRC_ALPHA",
  "33000": "MAX_ELEMENTS_VERTICES",
  "33001": "MAX_ELEMENTS_INDICES",
  "33071": "CLAMP_TO_EDGE",
  "33082": "TEXTURE_MIN_LOD",
  "33083": "TEXTURE_MAX_LOD",
  "33084": "TEXTURE_BASE_LEVEL",
  "33085": "TEXTURE_MAX_LEVEL",
  "33170": "GENERATE_MIPMAP_HINT",
  "33189": "DEPTH_COMPONENT16",
  "33190": "DEPTH_COMPONENT24",
  "33296": "FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING",
  "33297": "FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE",
  "33298": "FRAMEBUFFER_ATTACHMENT_RED_SIZE",
  "33299": "FRAMEBUFFER_ATTACHMENT_GREEN_SIZE",
  "33300": "FRAMEBUFFER_ATTACHMENT_BLUE_SIZE",
  "33301": "FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE",
  "33302": "FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE",
  "33303": "FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE",
  "33304": "FRAMEBUFFER_DEFAULT",
  "33306": "DEPTH_STENCIL_ATTACHMENT",
  "33319": "RG",
  "33320": "RG_INTEGER",
  "33321": "R8",
  "33323": "RG8",
  "33325": "R16F",
  "33326": "R32F",
  "33327": "RG16F",
  "33328": "RG32F",
  "33329": "R8I",
  "33330": "R8UI",
  "33331": "R16I",
  "33332": "R16UI",
  "33333": "R32I",
  "33334": "R32UI",
  "33335": "RG8I",
  "33336": "RG8UI",
  "33337": "RG16I",
  "33338": "RG16UI",
  "33339": "RG32I",
  "33340": "RG32UI",
  "33503": "TEXTURE_IMMUTABLE_LEVELS",
  "33635": "UNSIGNED_SHORT_5_6_5",
  "33640": "UNSIGNED_INT_2_10_10_10_REV",
  "33648": "MIRRORED_REPEAT",
  "33901": "ALIASED_POINT_SIZE_RANGE",
  "33902": "ALIASED_LINE_WIDTH_RANGE",
  "33984": "TEXTURE0",
  "33985": "TEXTURE1",
  "33986": "TEXTURE2",
  "33987": "TEXTURE3",
  "33988": "TEXTURE4",
  "33989": "TEXTURE5",
  "33990": "TEXTURE6",
  "33991": "TEXTURE7",
  "33992": "TEXTURE8",
  "33993": "TEXTURE9",
  "33994": "TEXTURE10",
  "33995": "TEXTURE11",
  "33996": "TEXTURE12",
  "33997": "TEXTURE13",
  "33998": "TEXTURE14",
  "33999": "TEXTURE15",
  "34000": "TEXTURE16",
  "34001": "TEXTURE17",
  "34002": "TEXTURE18",
  "34003": "TEXTURE19",
  "34004": "TEXTURE20",
  "34005": "TEXTURE21",
  "34006": "TEXTURE22",
  "34007": "TEXTURE23",
  "34008": "TEXTURE24",
  "34009": "TEXTURE25",
  "34010": "TEXTURE26",
  "34011": "TEXTURE27",
  "34012": "TEXTURE28",
  "34013": "TEXTURE29",
  "34014": "TEXTURE30",
  "34015": "TEXTURE31",
  "34016": "ACTIVE_TEXTURE",
  "34024": "MAX_RENDERBUFFER_SIZE",
  "34041": "DEPTH_STENCIL",
  "34042": "UNSIGNED_INT_24_8",
  "34045": "MAX_TEXTURE_LOD_BIAS",
  "34055": "INCR_WRAP",
  "34056": "DECR_WRAP",
  "34067": "TEXTURE_CUBE_MAP",
  "34068": "TEXTURE_BINDING_CUBE_MAP",
  "34069": "TEXTURE_CUBE_MAP_POSITIVE_X",
  "34070": "TEXTURE_CUBE_MAP_NEGATIVE_X",
  "34071": "TEXTURE_CUBE_MAP_POSITIVE_Y",
  "34072": "TEXTURE_CUBE_MAP_NEGATIVE_Y",
  "34073": "TEXTURE_CUBE_MAP_POSITIVE_Z",
  "34074": "TEXTURE_CUBE_MAP_NEGATIVE_Z",
  "34076": "MAX_CUBE_MAP_TEXTURE_SIZE",
  "34229": "VERTEX_ARRAY_BINDING",
  "34338": "VERTEX_ATTRIB_ARRAY_ENABLED",
  "34339": "VERTEX_ATTRIB_ARRAY_SIZE",
  "34340": "VERTEX_ATTRIB_ARRAY_STRIDE",
  "34341": "VERTEX_ATTRIB_ARRAY_TYPE",
  "34342": "CURRENT_VERTEX_ATTRIB",
  "34373": "VERTEX_ATTRIB_ARRAY_POINTER",
  "34467": "COMPRESSED_TEXTURE_FORMATS",
  "34660": "BUFFER_SIZE",
  "34661": "BUFFER_USAGE",
  "34816": "STENCIL_BACK_FUNC",
  "34817": "STENCIL_BACK_FAIL",
  "34818": "STENCIL_BACK_PASS_DEPTH_FAIL",
  "34819": "STENCIL_BACK_PASS_DEPTH_PASS",
  "34836": "RGBA32F",
  "34837": "RGB32F",
  "34842": "RGBA16F",
  "34843": "RGB16F",
  "34852": "MAX_DRAW_BUFFERS",
  "34853": "DRAW_BUFFER0",
  "34854": "DRAW_BUFFER1",
  "34855": "DRAW_BUFFER2",
  "34856": "DRAW_BUFFER3",
  "34857": "DRAW_BUFFER4",
  "34858": "DRAW_BUFFER5",
  "34859": "DRAW_BUFFER6",
  "34860": "DRAW_BUFFER7",
  "34861": "DRAW_BUFFER8",
  "34862": "DRAW_BUFFER9",
  "34863": "DRAW_BUFFER10",
  "34864": "DRAW_BUFFER11",
  "34865": "DRAW_BUFFER12",
  "34866": "DRAW_BUFFER13",
  "34867": "DRAW_BUFFER14",
  "34868": "DRAW_BUFFER15",
  "34877": "BLEND_EQUATION_ALPHA",
  "34892": "TEXTURE_COMPARE_MODE",
  "34893": "TEXTURE_COMPARE_FUNC",
  "34894": "COMPARE_REF_TO_TEXTURE",
  "34917": "CURRENT_QUERY",
  "34918": "QUERY_RESULT",
  "34919": "QUERY_RESULT_AVAILABLE",
  "34921": "MAX_VERTEX_ATTRIBS",
  "34922": "VERTEX_ATTRIB_ARRAY_NORMALIZED",
  "34930": "MAX_TEXTURE_IMAGE_UNITS",
  "34962": "ARRAY_BUFFER",
  "34963": "ELEMENT_ARRAY_BUFFER",
  "34964": "ARRAY_BUFFER_BINDING",
  "34965": "ELEMENT_ARRAY_BUFFER_BINDING",
  "34975": "VERTEX_ATTRIB_ARRAY_BUFFER_BINDING",
  "35040": "STREAM_DRAW",
  "35041": "STREAM_READ",
  "35042": "STREAM_COPY",
  "35044": "STATIC_DRAW",
  "35045": "STATIC_READ",
  "35046": "STATIC_COPY",
  "35048": "DYNAMIC_DRAW",
  "35049": "DYNAMIC_READ",
  "35050": "DYNAMIC_COPY",
  "35051": "PIXEL_PACK_BUFFER",
  "35052": "PIXEL_UNPACK_BUFFER",
  "35053": "PIXEL_PACK_BUFFER_BINDING",
  "35055": "PIXEL_UNPACK_BUFFER_BINDING",
  "35056": "DEPTH24_STENCIL8",
  "35069": "VERTEX_ATTRIB_ARRAY_INTEGER",
  "35070": "VERTEX_ATTRIB_ARRAY_DIVISOR",
  "35071": "MAX_ARRAY_TEXTURE_LAYERS",
  "35076": "MIN_PROGRAM_TEXEL_OFFSET",
  "35077": "MAX_PROGRAM_TEXEL_OFFSET",
  "35097": "SAMPLER_BINDING",
  "35345": "UNIFORM_BUFFER",
  "35368": "UNIFORM_BUFFER_BINDING",
  "35369": "UNIFORM_BUFFER_START",
  "35370": "UNIFORM_BUFFER_SIZE",
  "35371": "MAX_VERTEX_UNIFORM_BLOCKS",
  "35373": "MAX_FRAGMENT_UNIFORM_BLOCKS",
  "35374": "MAX_COMBINED_UNIFORM_BLOCKS",
  "35375": "MAX_UNIFORM_BUFFER_BINDINGS",
  "35376": "MAX_UNIFORM_BLOCK_SIZE",
  "35377": "MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS",
  "35379": "MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS",
  "35380": "UNIFORM_BUFFER_OFFSET_ALIGNMENT",
  "35382": "ACTIVE_UNIFORM_BLOCKS",
  "35383": "UNIFORM_TYPE",
  "35384": "UNIFORM_SIZE",
  "35386": "UNIFORM_BLOCK_INDEX",
  "35387": "UNIFORM_OFFSET",
  "35388": "UNIFORM_ARRAY_STRIDE",
  "35389": "UNIFORM_MATRIX_STRIDE",
  "35390": "UNIFORM_IS_ROW_MAJOR",
  "35391": "UNIFORM_BLOCK_BINDING",
  "35392": "UNIFORM_BLOCK_DATA_SIZE",
  "35394": "UNIFORM_BLOCK_ACTIVE_UNIFORMS",
  "35395": "UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES",
  "35396": "UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER",
  "35398": "UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER",
  "35632": "FRAGMENT_SHADER",
  "35633": "VERTEX_SHADER",
  "35657": "MAX_FRAGMENT_UNIFORM_COMPONENTS",
  "35658": "MAX_VERTEX_UNIFORM_COMPONENTS",
  "35659": "MAX_VARYING_COMPONENTS",
  "35660": "MAX_VERTEX_TEXTURE_IMAGE_UNITS",
  "35661": "MAX_COMBINED_TEXTURE_IMAGE_UNITS",
  "35663": "SHADER_TYPE",
  "35664": "FLOAT_VEC2",
  "35665": "FLOAT_VEC3",
  "35666": "FLOAT_VEC4",
  "35667": "INT_VEC2",
  "35668": "INT_VEC3",
  "35669": "INT_VEC4",
  "35670": "BOOL",
  "35671": "BOOL_VEC2",
  "35672": "BOOL_VEC3",
  "35673": "BOOL_VEC4",
  "35674": "FLOAT_MAT2",
  "35675": "FLOAT_MAT3",
  "35676": "FLOAT_MAT4",
  "35678": "SAMPLER_2D",
  "35679": "SAMPLER_3D",
  "35680": "SAMPLER_CUBE",
  "35682": "SAMPLER_2D_SHADOW",
  "35685": "FLOAT_MAT2x3",
  "35686": "FLOAT_MAT2x4",
  "35687": "FLOAT_MAT3x2",
  "35688": "FLOAT_MAT3x4",
  "35689": "FLOAT_MAT4x2",
  "35690": "FLOAT_MAT4x3",
  "35712": "DELETE_STATUS",
  "35713": "COMPILE_STATUS",
  "35714": "LINK_STATUS",
  "35715": "VALIDATE_STATUS",
  "35717": "ATTACHED_SHADERS",
  "35718": "ACTIVE_UNIFORMS",
  "35721": "ACTIVE_ATTRIBUTES",
  "35723": "FRAGMENT_SHADER_DERIVATIVE_HINT",
  "35724": "SHADING_LANGUAGE_VERSION",
  "35725": "CURRENT_PROGRAM",
  "35738": "IMPLEMENTATION_COLOR_READ_TYPE",
  "35739": "IMPLEMENTATION_COLOR_READ_FORMAT",
  "35863": "UNSIGNED_NORMALIZED",
  "35866": "TEXTURE_2D_ARRAY",
  "35869": "TEXTURE_BINDING_2D_ARRAY",
  "35887": "ANY_SAMPLES_PASSED",
  "35898": "R11F_G11F_B10F",
  "35899": "UNSIGNED_INT_10F_11F_11F_REV",
  "35901": "RGB9_E5",
  "35902": "UNSIGNED_INT_5_9_9_9_REV",
  "35904": "SRGB",
  "35905": "SRGB8",
  "35907": "SRGB8_ALPHA8",
  "35967": "TRANSFORM_FEEDBACK_BUFFER_MODE",
  "35968": "MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS",
  "35971": "TRANSFORM_FEEDBACK_VARYINGS",
  "35972": "TRANSFORM_FEEDBACK_BUFFER_START",
  "35973": "TRANSFORM_FEEDBACK_BUFFER_SIZE",
  "35976": "TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN",
  "35977": "RASTERIZER_DISCARD",
  "35978": "MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS",
  "35979": "MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS",
  "35980": "INTERLEAVED_ATTRIBS",
  "35981": "SEPARATE_ATTRIBS",
  "35982": "TRANSFORM_FEEDBACK_BUFFER",
  "35983": "TRANSFORM_FEEDBACK_BUFFER_BINDING",
  "36003": "STENCIL_BACK_REF",
  "36004": "STENCIL_BACK_VALUE_MASK",
  "36005": "STENCIL_BACK_WRITEMASK",
  "36006": "FRAMEBUFFER_BINDING",
  "36007": "RENDERBUFFER_BINDING",
  "36008": "READ_FRAMEBUFFER",
  "36009": "DRAW_FRAMEBUFFER",
  "36010": "READ_FRAMEBUFFER_BINDING",
  "36011": "RENDERBUFFER_SAMPLES",
  "36012": "DEPTH_COMPONENT32F",
  "36013": "DEPTH32F_STENCIL8",
  "36048": "FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE",
  "36049": "FRAMEBUFFER_ATTACHMENT_OBJECT_NAME",
  "36050": "FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL",
  "36051": "FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE",
  "36052": "FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER",
  "36053": "FRAMEBUFFER_COMPLETE",
  "36054": "FRAMEBUFFER_INCOMPLETE_ATTACHMENT",
  "36055": "FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT",
  "36057": "FRAMEBUFFER_INCOMPLETE_DIMENSIONS",
  "36061": "FRAMEBUFFER_UNSUPPORTED",
  "36063": "MAX_COLOR_ATTACHMENTS",
  "36064": "COLOR_ATTACHMENT0",
  "36065": "COLOR_ATTACHMENT1",
  "36066": "COLOR_ATTACHMENT2",
  "36067": "COLOR_ATTACHMENT3",
  "36068": "COLOR_ATTACHMENT4",
  "36069": "COLOR_ATTACHMENT5",
  "36070": "COLOR_ATTACHMENT6",
  "36071": "COLOR_ATTACHMENT7",
  "36072": "COLOR_ATTACHMENT8",
  "36073": "COLOR_ATTACHMENT9",
  "36074": "COLOR_ATTACHMENT10",
  "36075": "COLOR_ATTACHMENT11",
  "36076": "COLOR_ATTACHMENT12",
  "36077": "COLOR_ATTACHMENT13",
  "36078": "COLOR_ATTACHMENT14",
  "36079": "COLOR_ATTACHMENT15",
  "36096": "DEPTH_ATTACHMENT",
  "36128": "STENCIL_ATTACHMENT",
  "36160": "FRAMEBUFFER",
  "36161": "RENDERBUFFER",
  "36162": "RENDERBUFFER_WIDTH",
  "36163": "RENDERBUFFER_HEIGHT",
  "36164": "RENDERBUFFER_INTERNAL_FORMAT",
  "36168": "STENCIL_INDEX8",
  "36176": "RENDERBUFFER_RED_SIZE",
  "36177": "RENDERBUFFER_GREEN_SIZE",
  "36178": "RENDERBUFFER_BLUE_SIZE",
  "36179": "RENDERBUFFER_ALPHA_SIZE",
  "36180": "RENDERBUFFER_DEPTH_SIZE",
  "36181": "RENDERBUFFER_STENCIL_SIZE",
  "36182": "FRAMEBUFFER_INCOMPLETE_MULTISAMPLE",
  "36183": "MAX_SAMPLES",
  "36194": "RGB565",
  "36202": "ANY_SAMPLES_PASSED_CONSERVATIVE",
  "36203": "MAX_ELEMENT_INDEX",
  "36208": "RGBA32UI",
  "36209": "RGB32UI",
  "36214": "RGBA16UI",
  "36215": "RGB16UI",
  "36220": "RGBA8UI",
  "36221": "RGB8UI",
  "36226": "RGBA32I",
  "36227": "RGB32I",
  "36232": "RGBA16I",
  "36233": "RGB16I",
  "36238": "RGBA8I",
  "36239": "RGB8I",
  "36244": "RED_INTEGER",
  "36248": "RGB_INTEGER",
  "36249": "RGBA_INTEGER",
  "36255": "INT_2_10_10_10_REV",
  "36269": "FLOAT_32_UNSIGNED_INT_24_8_REV",
  "36289": "SAMPLER_2D_ARRAY",
  "36292": "SAMPLER_2D_ARRAY_SHADOW",
  "36293": "SAMPLER_CUBE_SHADOW",
  "36294": "UNSIGNED_INT_VEC2",
  "36295": "UNSIGNED_INT_VEC3",
  "36296": "UNSIGNED_INT_VEC4",
  "36298": "INT_SAMPLER_2D",
  "36299": "INT_SAMPLER_3D",
  "36300": "INT_SAMPLER_CUBE",
  "36303": "INT_SAMPLER_2D_ARRAY",
  "36306": "UNSIGNED_INT_SAMPLER_2D",
  "36307": "UNSIGNED_INT_SAMPLER_3D",
  "36308": "UNSIGNED_INT_SAMPLER_CUBE",
  "36311": "UNSIGNED_INT_SAMPLER_2D_ARRAY",
  "36336": "LOW_FLOAT",
  "36337": "MEDIUM_FLOAT",
  "36338": "HIGH_FLOAT",
  "36339": "LOW_INT",
  "36340": "MEDIUM_INT",
  "36341": "HIGH_INT",
  "36347": "MAX_VERTEX_UNIFORM_VECTORS",
  "36348": "MAX_VARYING_VECTORS",
  "36349": "MAX_FRAGMENT_UNIFORM_VECTORS",
  "36386": "TRANSFORM_FEEDBACK",
  "36387": "TRANSFORM_FEEDBACK_PAUSED",
  "36388": "TRANSFORM_FEEDBACK_ACTIVE",
  "36389": "TRANSFORM_FEEDBACK_BINDING",
  "36662": "COPY_READ_BUFFER_BINDING",
  "36663": "COPY_WRITE_BUFFER_BINDING",
  "36756": "R8_SNORM",
  "36757": "RG8_SNORM",
  "36758": "RGB8_SNORM",
  "36759": "RGBA8_SNORM",
  "36764": "SIGNED_NORMALIZED",
  "36975": "RGB10_A2UI",
  "37137": "MAX_SERVER_WAIT_TIMEOUT",
  "37138": "OBJECT_TYPE",
  "37139": "SYNC_CONDITION",
  "37140": "SYNC_STATUS",
  "37141": "SYNC_FLAGS",
  "37142": "SYNC_FENCE",
  "37143": "SYNC_GPU_COMMANDS_COMPLETE",
  "37144": "UNSIGNALED",
  "37145": "SIGNALED",
  "37146": "ALREADY_SIGNALED",
  "37147": "TIMEOUT_EXPIRED",
  "37148": "CONDITION_SATISFIED",
  "37149": "WAIT_FAILED",
  "37154": "MAX_VERTEX_OUTPUT_COMPONENTS",
  "37157": "MAX_FRAGMENT_INPUT_COMPONENTS",
  "37167": "TEXTURE_IMMUTABLE_FORMAT",
  "37440": "UNPACK_FLIP_Y_WEBGL",
  "37441": "UNPACK_PREMULTIPLY_ALPHA_WEBGL",
  "37442": "CONTEXT_LOST_WEBGL",
  "37443": "UNPACK_COLORSPACE_CONVERSION_WEBGL",
  "37444": "BROWSER_DEFAULT_WEBGL",
  "37447": "MAX_CLIENT_WAIT_TIMEOUT_WEBGL",
  "4294967295": "INVALID_INDEX",
  "-1": "TIMEOUT_IGNORED"
};

// src/utils.ts
var textureEnum = {
  baseColorTexture: 0,
  metallicRoughnessTexture: 1,
  normalTexture: 2,
  occlusionTexture: 3,
  emissiveTexture: 4,
  irradianceTexture: 5,
  prefilterTexture: 6,
  brdfLUTTexture: 7,
  clearcoatTexture: 8,
  clearcoatRoughnessTexture: 9,
  clearcoatNormalTexture: 10,
  sheenColorTexture: 11,
  sheenRoughnessTexture: 12,
  Sheen_E: 13,
  transmissionTexture: 14,
  specularTexture: 15,
  specularColorTexture: 19,
  thicknessTexture: 16,
  iridescenceThicknessTexture: 17,
  charlieTexture: 18,
  diffuseTransmissionTexture: 20,
  diffuseTransmissionColorTexture: 21,
  anisotropyTexture: 22,
  iridescenceTexture: 23
};
function getDataType(type) {
  let count;
  switch (type) {
    case "MAT2":
      count = 4;
      break;
    case "MAT3":
      count = 9;
      break;
    case "MAT4":
      count = 16;
      break;
    case "VEC4":
      count = 4;
      break;
    case "VEC3":
      count = 3;
      break;
    case "VEC2":
      count = 2;
      break;
    case "SCALAR":
      count = 1;
      break;
  }
  return count;
}
function getCount(type) {
  let arr;
  switch (glEnum_default[type]) {
    case "BYTE":
    case "UNSIGNED_BYTE":
      arr = 1;
      break;
    case "SHORT":
    case "UNSIGNED_SHORT":
      arr = 2;
      break;
    case "UNSIGNED_INT":
    case "FLOAT":
      arr = 4;
      break;
  }
  return arr;
}
var ArrayBufferMap = /* @__PURE__ */ new Map();
ArrayBufferMap.set(Int8Array, "BYTE");
ArrayBufferMap.set(Uint8Array, "UNSIGNED_BYTE");
ArrayBufferMap.set(Int16Array, "SHORT");
ArrayBufferMap.set(Uint16Array, "UNSIGNED_SHORT");
ArrayBufferMap.set(Uint32Array, "UNSIGNED_INT");
ArrayBufferMap.set(Float32Array, "FLOAT");
function buildArrayWithStride(arrayBuffer, accessor, bufferView) {
  const sizeofComponent = getCount(accessor.componentType);
  const typeofComponent = getDataType(accessor.type);
  const offset = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
  const stride = bufferView.byteStride;
  const lengthByStride = stride * accessor.count / sizeofComponent;
  const requiredLength = accessor.count * typeofComponent;
  let length = lengthByStride || requiredLength;
  if (arrayBuffer.byteLength < length * sizeofComponent + offset) {
    length -= accessor.byteOffset;
  }
  let arr;
  switch (glEnum_default[accessor.componentType]) {
    case "BYTE":
      arr = new Int8Array(arrayBuffer, offset, length);
      break;
    case "UNSIGNED_BYTE":
      arr = new Uint8Array(arrayBuffer, offset, length);
      break;
    case "SHORT":
      arr = new Int16Array(arrayBuffer, offset, length);
      break;
    case "UNSIGNED_SHORT":
      arr = new Uint16Array(arrayBuffer, offset, length);
      break;
    case "UNSIGNED_INT":
      arr = new Uint32Array(arrayBuffer, offset, length);
      break;
    case "FLOAT":
      arr = new Float32Array(arrayBuffer, offset, length);
      break;
  }
  if (length !== requiredLength) {
    const ArrCtor = arr.constructor;
    const stridedArr = new ArrCtor(requiredLength);
    let j = 0;
    for (let i = 0; i < stridedArr.length; i += typeofComponent) {
      for (let k = 0; k < typeofComponent; k++) {
        stridedArr[i + k] = arr[j + k];
      }
      j += stride / sizeofComponent;
    }
    return stridedArr;
  } else {
    return arr;
  }
}
function buildArray(arrayBuffer, type, offset, length) {
  let arr;
  switch (glEnum_default[type]) {
    case "BYTE":
      arr = new Int8Array(arrayBuffer, offset, length);
      break;
    case "UNSIGNED_BYTE":
      arr = new Uint8Array(arrayBuffer, offset, length);
      break;
    case "SHORT":
      arr = new Int16Array(arrayBuffer, offset, length);
      break;
    case "UNSIGNED_SHORT":
      arr = new Uint16Array(arrayBuffer, offset, length);
      break;
    case "UNSIGNED_INT":
      arr = new Uint32Array(arrayBuffer, offset, length);
      break;
    case "FLOAT":
      arr = new Float32Array(arrayBuffer, offset, length);
      break;
  }
  return arr;
}
function compileShader(gl2, type, shaderSource, program) {
  const shader = gl2.createShader(type);
  gl2.shaderSource(shader, shaderSource);
  gl2.compileShader(shader);
  gl2.attachShader(program, shader);
  const log = gl2.getShaderInfoLog(shader);
  if (log) {
    throw new Error(log);
  }
}
function createProgram(gl2, vertex, fragment) {
  const program = gl2.createProgram();
  compileShader(gl2, gl2.VERTEX_SHADER, vertex, program);
  compileShader(gl2, gl2.FRAGMENT_SHADER, fragment, program);
  gl2.linkProgram(program);
  gl2.validateProgram(program);
  if (!gl2.getProgramParameter(program, gl2.LINK_STATUS)) {
    const info = gl2.getProgramInfoLog(program);
    throw new Error(`Could not compile WebGL program. ${info}`);
  }
  return program;
}
function walk(node, callback) {
  function _walk(node2) {
    callback(node2);
    if (node2.children) {
      node2.children.forEach(_walk);
    }
  }
  _walk(node);
}
function canvasToWorld(vec2, projection, width, height) {
  const [x, y] = vec2;
  const newM = new Matrix4();
  newM.setTranslate(new Vector3([0, 0, 0.05]));
  const m = new Matrix4(projection);
  m.multiply(newM);
  const mp = m.multiplyVector4(new Vector4([0, 0, 0, 1]));
  mp.elements[0] = (2 * x / width - 1) * mp.elements[3];
  mp.elements[1] = (-2 * y / height + 1) * mp.elements[3];
  const v = m.invert().multiplyVector4(mp);
  return [v.elements[0], v.elements[1]];
}
function calculateProjection(cam) {
  const { aspect, zoom } = cam;
  let proj;
  if (cam.type === "perspective" && cam.perspective) {
    const { yfov } = cam.perspective;
    const f = 1 / Math.tan(yfov / 2);
    const nf = 1 / (cam.perspective.znear - cam.perspective.zfar);
    return new Matrix4().set([
      f / aspect,
      0,
      0,
      0,
      0,
      f,
      0,
      0,
      0,
      0,
      cam.perspective.zfar * nf,
      -1,
      0,
      0,
      cam.perspective.znear * cam.perspective.zfar * nf,
      0
    ]);
  } else if (cam.type === "orthographic" && cam.orthographic) {
    proj = new Matrix4().setOrtho(
      cam.orthographic.xmag * zoom,
      cam.orthographic.ymag * zoom,
      cam.orthographic.znear,
      cam.orthographic.zfar
    );
  }
  return proj;
}
function calculateOffset(a = 0, b = 0) {
  return a + b;
}
function calculateUVs(vertex, normal) {
  const UVS = new Float32Array(vertex.length / 3 * 2);
  const Min = new Vector2([Infinity, Infinity]);
  const Max = new Vector2([-Infinity, -Infinity]);
  for (let i = 0; i < vertex.length / 3; ++i) {
    const coords = [];
    const norm = [];
    for (let c = 0; c < 3; ++c) {
      coords.push(vertex[3 * i + c]);
      norm.push(normal[3 * i + c]);
    }
    const N = new Vector3(norm);
    const components = ["x", "y", "z"];
    components.sort((a, b) => {
      return Math.abs(N[a]) - Math.abs(N[b]);
    });
    const pos = new Vector3(coords);
    const u = pos[components[0]];
    const v = pos[components[1]];
    UVS[i * 2] = u;
    UVS[i * 2 + 1] = v;
    Max.x = Math.max(Max.x, u);
    Max.y = Math.max(Max.y, v);
    Min.x = Math.min(Min.x, u);
    Min.y = Math.min(Min.y, v);
  }
  const diff = new Vector2(Max.elements).subtract(Min);
  for (let i = 0; i < vertex.length / 3; ++i) {
    const ix = i * 2;
    UVS[ix] = (UVS[ix] - Min.x) / diff.x;
    UVS[ix + 1] = (UVS[ix + 1] - Min.y) / diff.y;
  }
  return UVS;
}
function calculateNormals2(vertex) {
  const ns = new Float32Array(vertex.length);
  for (let i = 0; i < vertex.length; i += 9) {
    const faceVertices = [
      new Vector3([vertex[i], vertex[i + 1], vertex[i + 2]]),
      new Vector3([vertex[i + 3], vertex[i + 4], vertex[i + 5]]),
      new Vector3([vertex[i + 6], vertex[i + 7], vertex[i + 8]])
    ];
    const dv1 = faceVertices[1].subtract(faceVertices[0]);
    const dv2 = faceVertices[2].subtract(faceVertices[0]);
    const n = Vector3.cross(dv1.normalize(), dv2.normalize());
    const [x, y, z] = n.elements;
    ns[i] = x;
    ns[i + 1] = y;
    ns[i + 2] = z;
    ns[i + 3] = x;
    ns[i + 4] = y;
    ns[i + 5] = z;
    ns[i + 6] = x;
    ns[i + 7] = y;
    ns[i + 8] = z;
  }
  return ns;
}
function calculateNormals(index, vertex) {
  const ns = new Float32Array(vertex.length / 3 * 3);
  for (let i = 0; i < index.length; i += 3) {
    const faceIndexes = [index[i], index[i + 1], index[i + 2]];
    const faceVertices = faceIndexes.map((ix) => vectorFromArray(vertex, ix));
    const dv1 = faceVertices[1].subtract(faceVertices[0]);
    const dv2 = faceVertices[2].subtract(faceVertices[0]);
    const n = Vector3.cross(dv1.normalize(), dv2.normalize());
    const [x, y, z] = n.elements;
    for (let j = 0; j < 3; j++) {
      ns[3 * index[i + j] + 0] = ns[3 * index[i + j] + 0] + x;
      ns[3 * index[i + j] + 1] = ns[3 * index[i + j] + 1] + y;
      ns[3 * index[i + j] + 2] = ns[3 * index[i + j] + 2] + z;
    }
  }
  return ns;
  function vectorFromArray(array, index2, elements = 3) {
    index2 = index2 * elements;
    return new Vector3([array[index2], array[index2 + 1], array[index2 + 2]]);
  }
}
function calculateBinormals(index, vertex, normal, uv) {
  const tangent = new Float32Array(normal.length / 3 * 4);
  for (let i = 0; i < index.length; i += 3) {
    const faceIndexes = [index[i], index[i + 1], index[i + 2]];
    const faceVertices = faceIndexes.map((ix) => vectorFromArray3(vertex, ix));
    const faceUVs = faceIndexes.map((ix) => vectorFromArray2(uv, ix));
    const dv1 = faceVertices[1].subtract(faceVertices[0]);
    const dv2 = faceVertices[2].subtract(faceVertices[0]);
    const duv1 = faceUVs[1].subtract(faceUVs[0]);
    const duv2 = faceUVs[2].subtract(faceUVs[0]);
    let r = duv1.elements[0] * duv2.elements[1] - duv1.elements[1] * duv2.elements[0];
    const sign = r > 0 ? 1 : -1;
    r = r !== 0 ? 1 / r : 1;
    const udir = new Vector3([
      (duv2.elements[1] * dv1.elements[0] - duv1.elements[1] * dv2.elements[0]) * r,
      (duv2.elements[1] * dv1.elements[1] - duv1.elements[1] * dv2.elements[1]) * r,
      (duv2.elements[1] * dv1.elements[2] - duv1.elements[1] * dv2.elements[2]) * r
    ]);
    udir.normalize();
    faceIndexes.forEach((ix) => {
      accumulateVectorInArray(tangent, ix, udir, sign);
    });
  }
  return tangent;
  function vectorFromArray3(array, index2) {
    index2 = index2 * 3;
    return new Vector3([array[index2], array[index2 + 1], array[index2 + 2]]);
  }
  function vectorFromArray2(array, index2) {
    index2 = index2 * 2;
    return new Vector2([array[index2], array[index2 + 1]]);
  }
  function accumulateVectorInArray(array, index2, vector, sign, elements = 4, accumulator = (acc, x) => acc + x) {
    index2 = index2 * elements;
    for (let i = 0; i < elements; ++i) {
      if (i === 3) {
        array[index2 + i] = sign;
      } else {
        array[index2 + i] = accumulator(array[index2 + i], vector.elements[i]);
      }
    }
  }
}
function getGlEnum(name) {
  return glEnum_default[name];
}
function normalize(array) {
  let fn;
  switch (true) {
    case array instanceof Uint8Array:
      fn = (c) => c / 255;
      break;
    case array instanceof Int8Array:
      fn = (c) => Math.max(c / 127, -1);
      break;
    case array instanceof Uint16Array:
      fn = (c) => c / 65535;
      break;
    case array instanceof Int16Array:
      fn = (c) => Math.max(c / 32767, -1);
      break;
  }
  if (fn) {
    const normalizedArray = new Float32Array(array.length);
    for (let i = 0; i < array.length; i++) {
      normalizedArray[i] = fn(array[i]);
    }
    return normalizedArray;
  } else {
    return array;
  }
}
async function generateMipmaps(device, texture, width, height, mipLevelCount, { isCube = false } = {}) {
  const wgsl = `
    @group(0) @binding(0) var mySampler: sampler;
    @group(0) @binding(1) var myTexture: texture_2d<f32>;

    struct VSOut {
      @builtin(position) pos: vec4f,
      @location(0) uv: vec2f
    };

    @vertex
    fn vs_main(@builtin(vertex_index) vi: u32) -> VSOut {
      var pos = array<vec2f, 6>(
        vec2f(-1.0, -1.0),
        vec2f( 1.0, -1.0),
        vec2f(-1.0,  1.0),
        vec2f(-1.0,  1.0),
        vec2f( 1.0, -1.0),
        vec2f( 1.0,  1.0)
      );
      var out: VSOut;
      out.pos = vec4f(pos[vi], 0.0, 1.0);
      var  uv = (pos[vi] + vec2f(1.0)) * 0.5;
      uv.y = 1.0 - uv.y;
      out.uv  = uv;
      return out;
    }

    @fragment
    fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
      // sample exactly mip 0 of the bound view (which we create from src mip)
      return textureSampleLevel(myTexture, mySampler, uv, 0.0);
    }
  `;
  const module2 = device.createShaderModule({ code: wgsl });
  const pipeline = device.createRenderPipeline({
    layout: "auto",
    vertex: { module: module2, entryPoint: "vs_main" },
    fragment: {
      module: module2,
      entryPoint: "fs_main",
      targets: [{ format: texture.format }]
      // use the real texture format
    },
    primitive: { topology: "triangle-list" }
  });
  const genSampler = device.createSampler({
    magFilter: "linear",
    minFilter: "linear",
    mipmapFilter: "nearest",
    addressModeU: "clamp-to-edge",
    addressModeV: "clamp-to-edge"
  });
  for (let level = 1; level < mipLevelCount; level++) {
    const dstWidth = Math.max(1, Math.floor(width / Math.pow(2, level)));
    const dstHeight = Math.max(1, Math.floor(height / Math.pow(2, level)));
    const faceCount = isCube ? 6 : 1;
    for (let face = 0; face < faceCount; face++) {
      const srcView = texture.createView({
        baseMipLevel: level - 1,
        mipLevelCount: 1,
        baseArrayLayer: isCube ? face : 0,
        arrayLayerCount: isCube ? 1 : void 0,
        dimension: "2d"
      });
      const dstView = texture.createView({
        baseMipLevel: level,
        mipLevelCount: 1,
        baseArrayLayer: isCube ? face : 0,
        arrayLayerCount: isCube ? 1 : void 0,
        dimension: "2d"
      });
      const bindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          { binding: 0, resource: genSampler },
          { binding: 1, resource: srcView }
        ]
      });
      const encoder = device.createCommandEncoder();
      const pass = encoder.beginRenderPass({
        colorAttachments: [
          {
            view: dstView,
            clearValue: { r: 0, g: 0, b: 0, a: 1 },
            loadOp: "clear",
            storeOp: "store"
          }
        ]
      });
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, bindGroup);
      pass.setViewport(0, 0, dstWidth, dstHeight, 0, 1);
      pass.draw(6);
      pass.end();
      device.queue.submit([encoder.finish()]);
    }
  }
}
function fanToTriListIndices(fan) {
  if (fan.length < 3) return new Uint32Array(0);
  const out = new Uint32Array((fan.length - 2) * 3);
  const [c] = fan;
  let o = 0;
  for (let i = 1; i < fan.length - 1; i++) {
    out[o++] = c;
    out[o++] = fan[i];
    out[o++] = fan[i + 1];
  }
  return out;
}
function convertLineLoopToLineList(loopIndices) {
  const n = loopIndices.length;
  const ListCtor = loopIndices.constructor;
  const listIndices = new ListCtor(n * 2);
  for (let i = 0; i < n; i++) {
    const curr = loopIndices[i];
    const next = loopIndices[(i + 1) % n];
    listIndices[i * 2] = curr;
    listIndices[i * 2 + 1] = next;
  }
  return listIndices;
}
function toFloat32Normalized(typedArray) {
  const ctor = typedArray.constructor;
  const { length } = typedArray;
  const out = new Float32Array(length);
  let scale, clampMin = -Infinity;
  switch (ctor) {
    case Uint8Array:
      scale = 1 / 255;
      break;
    case Uint16Array:
      scale = 1 / 65535;
      break;
    case Uint32Array:
      scale = 1 / 4294967295;
      break;
    case Int8Array:
      scale = 1 / 127;
      clampMin = -1;
      break;
    case Int16Array:
      scale = 1 / 32767;
      clampMin = -1;
      break;
    case Int32Array:
      scale = 1 / 2147483647;
      clampMin = -1;
      break;
    default:
      return typedArray;
  }
  for (let i = 0; i < length; i++) {
    let v = typedArray[i] * scale;
    if (v < clampMin) {
      v = clampMin;
    }
    out[i] = v;
  }
  return out;
}

// src/objects/mesh.ts
var Mesh = class extends Object3D {
  geometry;
  material;
  program;
  defines;
  mode;
  frontFace;
  distance;
  variants;
  order;
  uniformBindGroup1;
  pipeline;
  pipeline2;
  constructor(name, parent) {
    super(name, parent);
    this.program = null;
    this.defines = null;
    this.mode = 4;
    this.variants = [];
  }
  setDefines(defines) {
    this.defines = defines;
  }
  setBlend(value) {
    this.material.blend = value;
  }
  setMaterial(material) {
    this.material = material;
  }
  drawWebGPU(WebGPU, passEncoder, i, {
    renderState,
    materialStorage,
    transformsStorage
  }) {
    const { isprerefraction } = renderState;
    if (this.defines.find((i2) => i2.name === "TRANSMISSION") && isprerefraction) {
      return;
    }
    if (this.reflow) {
      transformsStorage.store.set(this.matrixWorld.elements, i * this.geometry.uniformBuffer.store.length);
      WebGPU.device.queue.writeBuffer(
        transformsStorage.bufferWebGPU,
        0,
        transformsStorage.store.buffer,
        transformsStorage.store.byteOffset,
        transformsStorage.store.byteLength
      );
    }
    if (this.repaint) {
      materialStorage.store.set(this.material.materialUniformBuffer.store, i * this.material.materialUniformBuffer.store.length);
      WebGPU.device.queue.writeBuffer(
        materialStorage.bufferWebGPU,
        0,
        materialStorage.store.buffer,
        materialStorage.store.byteOffset,
        materialStorage.store.byteLength
      );
    }
    if (this instanceof SkinnedMesh) {
      if (this.bones.some((bone) => bone.reflow)) {
        const jointMatrix = this.getJointMatrix();
        const matrices = new Float32Array(jointMatrix.length * 16);
        let i2 = 0;
        for (const j of jointMatrix) {
          matrices.set(j.elements, 0 + 16 * i2);
          i2++;
        }
        WebGPU.device.queue.writeBuffer(this.skinBuffer, 0, matrices.buffer, matrices.byteOffset, matrices.byteLength);
      }
    }
    passEncoder.setBindGroup(0, this.uniformBindGroup1);
    passEncoder.setVertexBuffer(0, this.geometry.verticesWebGPUBuffer);
    if (this.geometry.indicesBuffer) {
      passEncoder.setIndexBuffer(this.geometry.indicesWebGPUBuffer, "uint32");
      passEncoder.drawIndexed(this.geometry.indicesBuffer.length, this.instances, 0, 0, i);
    } else {
      passEncoder.draw(this.geometry.attributes.POSITION.length / 3, this.instances, 0, i);
    }
  }
  draw(gl2, { lights, camera, needUpdateProjection, preDepthTexture, colorTexture, renderState, fakeDepth, isIBL, isDefaultLight }) {
    const texUnit = (n) => gl2[`TEXTURE${n}`];
    const glTypeEnum = (ctor) => gl2[ArrayBufferMap.get(ctor)];
    const { isprepender, isprerefraction } = renderState;
    if (this.defines.find((i) => i.name === "TRANSMISSION") && isprerefraction) {
      return;
    }
    gl2.useProgram(this.program);
    gl2.bindVertexArray(this.geometry.VAO);
    if (needUpdateProjection) {
      this.geometry.uniformBuffer.update(gl2, "projection", camera.projection.elements);
    }
    this.geometry.uniformBuffer.update(gl2, "isShadow", isprepender ? 1 : 0);
    if (this instanceof SkinnedMesh) {
      gl2.bindBufferBase(gl2.UNIFORM_BUFFER, 2, this.geometry.SKIN);
      if (this.bones.some((bone) => bone.reflow)) {
        const jointMatrix = this.getJointMatrix();
        const matrices = new Float32Array(jointMatrix.length * 16);
        let i = 0;
        for (const j of jointMatrix) {
          matrices.set(j.elements, 0 + 16 * i);
          i++;
        }
        gl2.bufferSubData(gl2.UNIFORM_BUFFER, 0, matrices);
      }
    }
    if (this.material.matrices.length) {
      gl2.bindBufferBase(gl2.UNIFORM_BUFFER, 8, this.material.textureMatricesUniform);
    }
    if (this.material.sphericalHarmonics) {
      gl2.bindBufferBase(gl2.UNIFORM_BUFFER, 7, this.material.sphericalHarmonics);
    }
    gl2.uniform1i(this.material.uniforms.depthTexture, preDepthTexture && !isprepender ? preDepthTexture.index : fakeDepth.index);
    gl2.uniform1i(this.material.uniforms.colorTexture, !isprerefraction ? colorTexture.index : fakeDepth.index);
    gl2.uniform1f(this.material.uniforms.isTone, isprerefraction ? 0 : 1);
    gl2.uniform1f(this.material.uniforms.isIBL, isIBL ? 1 : 0);
    gl2.uniform1f(this.material.uniforms.isDefaultLight, isDefaultLight || lights.some((l) => !l.isInitial) ? 1 : 0);
    if (this.material.baseColorTexture) {
      gl2.activeTexture(texUnit(0));
      gl2.bindTexture(gl2.TEXTURE_2D, this.material.baseColorTexture);
      gl2.bindSampler(0, this.material.baseColorTexture.sampler);
    }
    if (this.material.metallicRoughnessTexture) {
      gl2.activeTexture(texUnit(1));
      gl2.bindTexture(gl2.TEXTURE_2D, this.material.metallicRoughnessTexture);
      gl2.bindSampler(1, this.material.metallicRoughnessTexture.sampler);
    }
    if (this.material.normalTexture) {
      gl2.activeTexture(texUnit(2));
      gl2.bindTexture(gl2.TEXTURE_2D, this.material.normalTexture);
      gl2.bindSampler(2, this.material.normalTexture.sampler);
    }
    if (this.material.occlusionTexture) {
      gl2.activeTexture(texUnit(3));
      gl2.bindTexture(gl2.TEXTURE_2D, this.material.occlusionTexture);
      gl2.bindSampler(3, this.material.occlusionTexture.sampler);
    }
    if (this.material.emissiveTexture) {
      gl2.activeTexture(texUnit(4));
      gl2.bindTexture(gl2.TEXTURE_2D, this.material.emissiveTexture);
      gl2.bindSampler(4, this.material.emissiveTexture.sampler);
    }
    if (this.material.clearcoatTexture) {
      gl2.activeTexture(texUnit(8));
      gl2.bindTexture(gl2.TEXTURE_2D, this.material.clearcoatTexture);
      gl2.bindSampler(8, this.material.clearcoatTexture.sampler);
    }
    if (this.material.clearcoatRoughnessTexture) {
      gl2.activeTexture(texUnit(9));
      gl2.bindTexture(gl2.TEXTURE_2D, this.material.clearcoatRoughnessTexture);
      gl2.bindSampler(9, this.material.clearcoatRoughnessTexture.sampler);
    }
    if (this.material.sheenColorTexture) {
      gl2.activeTexture(texUnit(11));
      gl2.bindTexture(gl2.TEXTURE_2D, this.material.sheenColorTexture);
      gl2.bindSampler(11, this.material.sheenColorTexture.sampler);
    }
    if (this.material.sheenRoughnessTexture) {
      gl2.activeTexture(texUnit(12));
      gl2.bindTexture(gl2.TEXTURE_2D, this.material.sheenRoughnessTexture);
      gl2.bindSampler(12, this.material.sheenRoughnessTexture.sampler);
    }
    if (this.material.iridescenceThicknessTexture) {
      gl2.activeTexture(texUnit(17));
      gl2.bindTexture(gl2.TEXTURE_2D, this.material.iridescenceThicknessTexture);
      gl2.bindSampler(17, this.material.iridescenceThicknessTexture.sampler);
    }
    if (this.material.iridescenceTexture) {
      gl2.activeTexture(texUnit(23));
      gl2.bindTexture(gl2.TEXTURE_2D, this.material.iridescenceTexture);
      gl2.bindSampler(23, this.material.iridescenceTexture.sampler);
    }
    if (this.material.diffuseTransmissionTexture) {
      gl2.activeTexture(texUnit(20));
      gl2.bindTexture(gl2.TEXTURE_2D, this.material.diffuseTransmissionTexture);
      gl2.bindSampler(20, this.material.diffuseTransmissionTexture.sampler);
    }
    if (this.material.diffuseTransmissionColorTexture) {
      gl2.activeTexture(texUnit(21));
      gl2.bindTexture(gl2.TEXTURE_2D, this.material.diffuseTransmissionColorTexture);
      gl2.bindSampler(21, this.material.diffuseTransmissionColorTexture.sampler);
    }
    if (this.material.anisotropyTexture) {
      gl2.activeTexture(texUnit(22));
      gl2.bindTexture(gl2.TEXTURE_2D, this.material.anisotropyTexture);
      gl2.bindSampler(22, this.material.anisotropyTexture.sampler);
    }
    if (this.material.clearcoatNormalTexture) {
      gl2.activeTexture(texUnit(10));
      gl2.bindTexture(gl2.TEXTURE_2D, this.material.clearcoatNormalTexture);
      gl2.bindSampler(10, this.material.clearcoatNormalTexture.sampler);
    }
    if (this.material.transmissionTexture) {
      gl2.activeTexture(texUnit(14));
      gl2.bindTexture(gl2.TEXTURE_2D, this.material.transmissionTexture);
      gl2.bindSampler(14, this.material.transmissionTexture.sampler);
    }
    if (this.material.specularTexture) {
      gl2.activeTexture(texUnit(15));
      gl2.bindTexture(gl2.TEXTURE_2D, this.material.specularTexture);
      gl2.bindSampler(15, this.material.specularTexture.sampler);
    }
    if (this.material.specularColorTexture) {
      gl2.activeTexture(texUnit(19));
      gl2.bindTexture(gl2.TEXTURE_2D, this.material.specularColorTexture);
      gl2.bindSampler(19, this.material.specularColorTexture.sampler);
    }
    if (this.material.thicknessTexture) {
      gl2.activeTexture(texUnit(16));
      gl2.bindTexture(gl2.TEXTURE_2D, this.material.thicknessTexture);
      gl2.bindSampler(16, this.material.thicknessTexture.sampler);
    }
    if (this.material.doubleSided) {
      gl2.disable(gl2.CULL_FACE);
    }
    if (this.frontFace) {
      gl2.frontFace(gl2.CW);
    }
    if (this.instances > 1) {
      gl2.drawElementsInstanced(
        this.mode,
        this.geometry.indicesBuffer.length,
        glTypeEnum(this.geometry.indicesBuffer.constructor),
        0,
        this.instances
      );
    } else {
      if (this.geometry.indicesBuffer) {
        gl2.drawElements(
          this.mode === 2 ? gl2.LINES : this.mode,
          this.geometry.indicesBuffer.length,
          glTypeEnum(this.geometry.indicesBuffer.constructor),
          0
        );
      } else {
        gl2.drawArrays(this.mode, 0, this.geometry.attributes.POSITION.length / 3);
      }
    }
    if (this.material.doubleSided) {
      gl2.enable(gl2.CULL_FACE);
    }
    if (this.frontFace) {
      gl2.frontFace(gl2.CCW);
    }
  }
  setGeometry(geometry) {
    this.geometry = geometry;
  }
  setProgram(value) {
    this.program = value;
  }
  setMode(value = 4) {
    this.mode = value;
  }
  setVariants(variants) {
    this.variants = variants;
  }
  setFrontFace() {
    this.frontFace = true;
    this.material.defines.push({ name: "FRONTFACE" });
  }
  isVisible(planes) {
    const c = new Vector3(this.geometry.boundingSphere.center.elements).applyMatrix4(this.matrixWorld);
    const r = this.geometry.boundingSphere.radius * this.matrixWorld.getMaxScaleOnAxis();
    let dist;
    let visible = true;
    for (const p of planes) {
      dist = p.elements[0] * c.elements[0] + p.elements[1] * c.elements[1] + p.elements[2] * c.elements[2] + p.elements[3];
      if (dist < -r) {
        visible = false;
        break;
      }
    }
    this.distance = dist + r;
    return visible;
  }
  calculateBounding() {
    this.geometry.calculateBounding(this.matrixWorld);
    if (this.matrices.length) {
      for (const m of this.matrices) {
        this.geometry.calculateBounding(m);
      }
    }
  }
};
var SkinnedMesh = class extends Mesh {
  bones;
  boneInverses;
  skin;
  skinBuffer;
  constructor(name, parent) {
    super(name, parent);
  }
  setSkinWebGPU(WebGPU, skin) {
    this.bones = skin.bones;
    this.boneInverses = skin.boneInverses;
    const jointMatrix = this.getJointMatrix();
    const matrices = new Float32Array(jointMatrix.length * 16);
    let i = 0;
    for (const j of jointMatrix) {
      matrices.set(j.elements, 0 + 16 * i);
      i++;
    }
    const matrixSize = matrices.byteLength;
    const offset = 256;
    const uniformBufferSize = offset + matrixSize;
    const { device } = WebGPU;
    const uniformBuffer = device.createBuffer({
      size: uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    });
    this.skinBuffer = uniformBuffer;
    const uniformBindGroup1 = {
      binding: 22,
      resource: uniformBuffer
    };
    device.queue.writeBuffer(uniformBuffer, 0, matrices.buffer, matrices.byteOffset, matrices.byteLength);
    return uniformBindGroup1;
  }
  setSkin(gl2, skin) {
    this.bones = skin.bones;
    this.boneInverses = skin.boneInverses;
    const jointMatrix = this.getJointMatrix();
    const matrices = new Float32Array(jointMatrix.length * 16);
    let i = 0;
    for (const j of jointMatrix) {
      matrices.set(j.elements, 0 + 16 * i);
      i++;
    }
    const uIndex = gl2.getUniformBlockIndex(this.program, "Skin");
    gl2.uniformBlockBinding(this.program, uIndex, 2);
    const UBO = gl2.createBuffer();
    gl2.bindBuffer(gl2.UNIFORM_BUFFER, UBO);
    gl2.bufferData(gl2.UNIFORM_BUFFER, matrices, gl2.DYNAMIC_DRAW);
    this.geometry.SKIN = UBO;
    gl2.bindBuffer(gl2.UNIFORM_BUFFER, null);
    return this;
  }
  getJointMatrix() {
    const m = new Matrix4(this.matrixWorld).invert();
    const resArray = [];
    for (let mi = 0; mi < this.boneInverses.length; mi++) {
      const res = new Matrix4().multiply(m).multiply(this.bones[mi].matrixWorld).multiply(this.boneInverses[mi]);
      resArray.push(res);
    }
    return resArray;
  }
};
var Bone = class extends Object3D {
};

// src/objects/camera.ts
function clamp(a, b, c) {
  return a < b ? b : a > c ? c : a;
}
var Camera = class extends Object3D {
  isInitial;
  props;
  matrixWorldInvert;
  projection;
  modelSize;
  modelXSize;
  modelYSize;
  yaw;
  pitch;
  matrixInitial;
  rotation;
  constructor(props, name, parent) {
    super(name, parent);
    this.matrixWorldInvert = new Matrix4();
    this.projection = new Matrix4();
    this.props = props;
    this.yaw = 0;
    this.pitch = -Math.PI;
    this.rotation = new Matrix4();
  }
  setProjection(matrix) {
    this.projection.set(matrix.elements);
  }
  setMatrixWorld(matrix) {
    super.setMatrixWorld(matrix);
    this.matrixWorldInvert.setInverseOf(this.matrixWorld);
    if (!this.matrixInitial) {
      this.matrixInitial = new Matrix4(this.matrixWorld);
    }
  }
  setZ(z) {
    this.matrix.elements[14] = z;
    this.matrixInitial = new Matrix4(this.matrix);
    this.setMatrixWorld(this.matrix.elements);
  }
  getViewProjMatrix() {
    const m = new Matrix4();
    m.multiply(this.projection);
    m.multiply(this.matrixWorldInvert);
    return m;
  }
  pan(coordsStart, coordsMove, width, height) {
    const coordsStartWorld = canvasToWorld(coordsStart, this.projection, width, height);
    const coordsMoveWorld = canvasToWorld(coordsMove, this.projection, width, height);
    const p0 = new Vector3([...coordsStartWorld, 0]);
    const p1 = new Vector3([...coordsMoveWorld, 0]);
    if (this.props.type === "orthographic") {
      const pan = 2 * this.matrixWorld.elements[14];
      const delta = p0.subtract(p1).scale(pan);
      this.matrixInitial.translate(delta.elements[0], delta.elements[1], 0);
    } else {
      const pan = 10 * this.matrixWorld.elements[14];
      const delta = p1.subtract(p0).scale(pan);
      this.matrixInitial.translate(delta.elements[0], delta.elements[1], 0);
    }
    const res = new Matrix4(this.rotation);
    res.multiply(this.matrixInitial);
    this.setMatrixWorld(res.elements);
  }
  rotate(coordsStart, coordsMove) {
    this.yaw += (coordsStart[0] - coordsMove[0]) * 0.01;
    this.pitch += (coordsStart[1] - coordsMove[1]) * 0.01;
    this.pitch = clamp(this.pitch, -1.5 * Math.PI, -0.5 * Math.PI);
    const m = new Matrix4();
    m.rotate(new Vector3([1, 0, 0]), this.pitch);
    m.rotate(new Vector3([0, 1, 0]), -this.yaw);
    m.rotate(new Vector3([1, 0, 0]), Math.PI);
    this.rotation = m;
    const res = new Matrix4(m);
    res.multiply(this.matrixInitial);
    this.setMatrixWorld(res.elements);
  }
  zoom(value) {
    if (this.matrixInitial.elements[14] > this.modelSize * 5 && value > 0) {
      return;
    }
    this.matrixInitial.elements[14] += value * this.modelSize * 1e-3;
    const m = new Matrix4(this.rotation);
    m.multiply(this.matrixInitial);
    this.setMatrixWorld(m.elements);
    this.updateNF();
  }
  updateNF() {
    if (this.props.isInitial) {
      const scale = Math.min(...this.matrixWorld.getScaling().elements);
      const modelSize = this.modelSize / scale;
      const cameraZ = Math.abs(this.matrixWorldInvert.elements[14]);
      const cameraProps = this.props.perspective || this.props.orthographic;
      cameraProps.znear = Math.max(cameraZ - modelSize, modelSize * 0.05);
      cameraProps.zfar = cameraZ + modelSize;
    }
    this.setProjection(calculateProjection(this.props));
  }
};

// src/objects/light.ts
var Light = class extends Object3D {
  matrixWorldInvert;
  type;
  color;
  intensity;
  isInitial;
  spot;
  range;
  constructor(props, name, parent) {
    super(name, parent);
    const { type, color = [1, 1, 1], intensity, isInitial, spot = {}, range = -1 } = props;
    this.type = type;
    this.color = new Vector3(color);
    this.intensity = intensity;
    this.isInitial = isInitial;
    this.spot = spot;
    this.range = range;
    this.matrixWorldInvert = new Matrix4();
  }
  setMatrixWorld(matrix) {
    super.setMatrixWorld(matrix);
    this.matrixWorldInvert.setInverseOf(this.matrixWorld);
  }
  setZ(z) {
    this.matrix.elements[13] = z;
    this.matrix.elements[14] = z;
    this.setMatrixWorld(this.matrix.elements);
  }
  update(v) {
    if (this.isInitial || this.type === "directional") {
      const camMatrix = new Matrix4();
      camMatrix.makeRotationAxis(new Vector3([0, 1, 0]), v);
      camMatrix.multiply(this.matrix);
      this.setMatrixWorld(camMatrix.elements);
    }
  }
};

// src/objects/uniform.ts
var UniformBuffer = class {
  offset;
  map;
  tempStore;
  store;
  bufferWebGPU;
  isTexture;
  constructor(isTexture = false) {
    this.map = /* @__PURE__ */ new Map();
    this.tempStore = {};
    this.offset = 0;
    this.isTexture = isTexture;
  }
  getBuffer(v) {
    const { length } = v;
    if (length === 3) {
      return new Float32Array([v[0], v[1], v[2], 0]);
    }
    if (length === 9) {
      return new Float32Array([v[0], v[1], v[2], 0, v[3], v[4], v[5], 0, v[6], v[7], v[8], 0]);
    }
    if (length === 12) {
      return new Float32Array([v[0], v[1], v[2], 0, v[3], v[4], v[5], 0, v[6], v[7], v[8], 0, v[9], v[10], v[11], 0]);
    }
    if (length === 6) {
      return new Float32Array([v[0], v[1], v[2], 0, v[3], v[4], v[5], 0]);
    }
    return v;
  }
  add(name, value) {
    if (value.length === void 0) {
      value = [value];
    }
    this.map.set(name, this.offset);
    const buffer = this.getBuffer(value);
    this.tempStore[name] = buffer;
    if (this.isTexture) {
      this.offset += Math.max(buffer.length, 4);
    } else {
      this.offset += buffer.length;
    }
  }
  update(gl2, name, value, skip = false) {
    if (value.length === void 0) {
      value = new Float32Array([value]);
    }
    const offset = this.map.get(name);
    if (offset === void 0) {
      return;
    }
    const buffer = this.getBuffer(value);
    this.store.set(buffer, offset);
    if (skip) {
      return;
    }
    gl2.bufferSubData(gl2.UNIFORM_BUFFER, offset * Float32Array.BYTES_PER_ELEMENT, buffer);
  }
  updateWebGPU(WebGPU, name, value, skip = false) {
    const { device } = WebGPU;
    if (value.length === void 0) {
      value = new Float32Array([value]);
    }
    const offset = this.map.get(name);
    if (offset === void 0) {
      return;
    }
    const buffer = this.getBuffer(value);
    this.store.set(buffer, offset);
    if (skip) {
      return;
    }
    device.queue.writeBuffer(
      this.bufferWebGPU,
      offset * Float32Array.BYTES_PER_ELEMENT,
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength
    );
  }
  done() {
    this.store = new Float32Array(this.offset);
    for (const [name, offset] of this.map) {
      this.store.set(this.tempStore[name], offset);
    }
    this.tempStore = null;
  }
};

// GLTF.ts
var Material = class {
  "name";
  "extensions";
  "extras";
  /**
   * A set of parameter values that are used to define the metallic-roughness material model from Physically-Based Rendering (PBR) methodology. When not specified, all the default values of `pbrMetallicRoughness` apply.
   */
  "pbrMetallicRoughness";
  /**
   * The normal map texture.
   */
  "normalTexture";
  /**
   * The occlusion map texture.
   */
  "occlusionTexture";
  /**
   * The emissive map texture.
   */
  "emissiveTexture";
  /**
   * The emissive color of the material.
   */
  "emissiveFactor";
  /**
   * The alpha rendering mode of the material.
   */
  "alphaMode";
  /**
   * The alpha cutoff value of the material.
   */
  "alphaCutoff";
  /**
   * Specifies whether the material is double sided.
   */
  "doubleSided";
};

// src/objects/material.ts
var defaultMaterial = {
  baseColorFactor: [1, 0, 0, 1]
};
var lightEnum = {
  directional: 0,
  point: 1,
  spot: 2
};
var Material2 = class extends Material {
  blend;
  uniforms;
  alpha;
  UBO;
  defines;
  matrices;
  uniformBuffer;
  lightPosUniform;
  lightColorUniform;
  spotdirUniform;
  lightIntensityUniform;
  textureMatricesUniform;
  matricesMap = /* @__PURE__ */ new Map();
  lights = [-1, -1, -1, -1];
  uniformBindGroup1;
  constructor(m = defaultMaterial, textures, defines) {
    super();
    const material = Object.assign({}, m);
    this.defines = defines;
    this.name = material.name;
    this.matrices = [];
    this.diffuseTransmissionColorFactor = [1, 1, 1];
    if (!material.pbrMetallicRoughness && material.extensions && material.extensions.KHR_materials_pbrSpecularGlossiness) {
      material.pbrMetallicRoughness = {};
      const SG = material.extensions.KHR_materials_pbrSpecularGlossiness;
      material.pbrMetallicRoughness.baseColorTexture = SG.diffuseTexture;
      material.pbrMetallicRoughness.metallicRoughnessTexture = SG.specularGlossinessTexture;
      material.pbrMetallicRoughness.baseColorFactor = SG.diffuseFactor;
      material.pbrMetallicRoughness.specularFactor = SG.specularFactor;
      material.pbrMetallicRoughness.glossinessFactor = SG.glossinessFactor;
      defines.push({ name: "SPECULARGLOSSINESSMAP" });
    }
    if (material.extensions && material.extensions.KHR_materials_clearcoat) {
      const cl = material.extensions.KHR_materials_clearcoat;
      this.clearcoatFactor = cl.clearcoatFactor;
      this.clearcoatRoughnessFactor = cl.clearcoatRoughnessFactor;
      defines.push({ name: "CLEARCOAT" });
      if (cl.clearcoatTexture) {
        const { extensions, texCoord } = cl.clearcoatTexture;
        this.clearcoatTexture = textures[cl.clearcoatTexture.index];
        defines.push({ name: "CLEARCOATMAP", value: texCoord ?? 0 });
        if (extensions) {
          const ex = extensions.KHR_texture_transform;
          if (ex) {
            this.matricesMap.set("clearcoatTexture", this.buildTrans(ex, defines, "CLEARCOATMAP"));
          }
        }
      }
      if (cl.clearcoatNormalTexture) {
        const { extensions, texCoord } = cl.clearcoatNormalTexture;
        this.clearcoatNormalTexture = textures[cl.clearcoatNormalTexture.index];
        defines.push({ name: "CLEARCOATNORMALMAP", value: texCoord ?? 0 });
        if (extensions) {
          const ex = extensions.KHR_texture_transform;
          if (ex) {
            this.matricesMap.set("clearcoatNormalTexture", this.buildTrans(ex, defines, "CLEARCOATNORMALMAP"));
          }
        }
      }
      if (cl.clearcoatRoughnessTexture) {
        const { extensions, texCoord } = cl.clearcoatRoughnessTexture;
        this.clearcoatRoughnessTexture = textures[cl.clearcoatRoughnessTexture.index];
        defines.push({ name: "CLEARCOATROUGHMAP", value: texCoord ?? 0 });
        if (extensions) {
          const ex = extensions.KHR_texture_transform;
          if (ex) {
            this.matricesMap.set("clearcoatRoughnessTexture", this.buildTrans(ex, defines, "CLEARCOATROUGHMAP"));
          }
        }
      }
    }
    if (material.extensions && material.extensions.KHR_materials_sheen) {
      const { sheenColorTexture, sheenColorFactor, sheenRoughnessFactor, sheenRoughnessTexture } = material.extensions.KHR_materials_sheen;
      this.sheenColorFactor = sheenColorFactor;
      this.sheenRoughnessFactor = sheenRoughnessFactor;
      if (sheenColorTexture) {
        const { extensions, texCoord } = sheenColorTexture;
        this.sheenColorTexture = textures[sheenColorTexture.index];
        defines.push({ name: "SHEENMAP", value: texCoord ?? 0 });
        if (extensions) {
          const ex = extensions.KHR_texture_transform;
          if (ex) {
            this.matricesMap.set("sheenColorTexture", this.buildTrans(ex, defines, "SHEENMAP"));
          }
        }
      }
      if (sheenRoughnessTexture) {
        const { extensions, texCoord } = sheenRoughnessTexture;
        this.sheenRoughnessTexture = textures[sheenRoughnessTexture.index];
        defines.push({ name: "SHEENROUGHNESSMAP", value: texCoord ?? 0 });
        if (extensions) {
          const ex = extensions.KHR_texture_transform;
          if (ex) {
            this.matricesMap.set("sheenRoughnessTexture", this.buildTrans(ex, defines, "SHEENROUGHNESSMAP"));
          }
        }
      }
      defines.push({ name: "SHEEN" });
    }
    if (material.extensions && material.extensions.KHR_materials_transmission) {
      const { transmissionFactor, transmissionTexture } = material.extensions.KHR_materials_transmission;
      this.transmissionFactor = transmissionFactor;
      if (transmissionTexture) {
        const { extensions, texCoord } = transmissionTexture;
        this.transmissionTexture = textures[transmissionTexture.index];
        defines.push({ name: "TRANSMISSIONMAP", value: texCoord ?? 0 });
        if (extensions) {
          const ex = extensions.KHR_texture_transform;
          if (ex) {
            this.matricesMap.set("transmissionTexture", this.buildTrans(ex, defines, "TRANSMISSIONMAP"));
          }
        }
      }
      defines.push({ name: "TRANSMISSION" });
    }
    if (material.extensions && material.extensions.KHR_materials_volume) {
      const { attenuationColor, attenuationDistance, thicknessFactor, thicknessTexture } = material.extensions.KHR_materials_volume;
      this.attenuationColor = attenuationColor;
      this.attenuationDistance = attenuationDistance;
      this.thicknessFactor = thicknessFactor;
      this.ior = 1.5;
      if (thicknessTexture) {
        const { extensions, texCoord } = thicknessTexture;
        this.thicknessTexture = textures[thicknessTexture.index];
        defines.push({ name: "THICKNESSMAP", value: texCoord ?? 0 });
        if (extensions) {
          const ex = extensions.KHR_texture_transform;
          if (ex) {
            this.matricesMap.set("thicknessTexture", this.buildTrans(ex, defines, "THICKNESSMAP"));
          }
        }
      }
      defines.push({ name: "VOLUME" });
    }
    if (material.extensions && material.extensions.KHR_materials_emissive_strength) {
      const { emissiveStrength } = material.extensions.KHR_materials_emissive_strength;
      this.emissiveStrength = emissiveStrength;
    }
    if (material.extensions && material.extensions.KHR_materials_anisotropy) {
      const { anisotropyStrength, anisotropyRotation, anisotropyTexture } = material.extensions.KHR_materials_anisotropy;
      this.anisotropyStrength = anisotropyStrength;
      this.anisotropyRotation = anisotropyRotation;
      if (anisotropyTexture) {
        this.anisotropyTexture = textures[anisotropyTexture.index];
        defines.push({ name: "ANISOTROPYMAP", value: anisotropyTexture.texCoord ?? 0 });
        if (anisotropyTexture.extensions) {
          const ex = anisotropyTexture.extensions.KHR_texture_transform;
          if (ex) {
            this.matricesMap.set("anisotropyTexture", this.buildTrans(ex, defines, "ANISOTROPYMAP"));
          }
        }
      }
      defines.push({ name: "ANISOTROPY" });
    }
    if (material.extensions && material.extensions.KHR_materials_dispersion) {
      const { dispersion } = material.extensions.KHR_materials_dispersion;
      this.dispersion = dispersion;
      defines.push({ name: "DISPERSION" });
    }
    if (material.extensions && material.extensions.KHR_materials_iridescence) {
      const {
        iridescenceTexture,
        iridescenceThicknessTexture,
        iridescenceFactor,
        iridescenceIor,
        iridescenceThicknessMaximum,
        iridescenceThicknessMinimum
      } = material.extensions.KHR_materials_iridescence;
      this.iridescenceFactor = iridescenceFactor;
      this.iridescenceIOR = iridescenceIor;
      this.iridescenceThicknessMaximum = iridescenceThicknessMaximum;
      this.iridescenceThicknessMinimum = iridescenceThicknessMinimum;
      if (iridescenceTexture) {
        this.iridescenceTexture = textures[iridescenceTexture.index];
        defines.push({ name: "IRIDESCENCE_COLOR", value: iridescenceTexture.texCoord ?? 0 });
        if (iridescenceTexture.extensions) {
          const ex = iridescenceTexture.extensions.KHR_texture_transform;
          if (ex) {
            this.matricesMap.set("iridescenceTexture", this.buildTrans(ex, defines, "IRIDESCENCE_COLOR"));
          }
        }
      }
      if (iridescenceThicknessTexture) {
        this.iridescenceThicknessTexture = textures[iridescenceThicknessTexture.index];
        defines.push({ name: "IRIDESCENCEMAP", value: iridescenceThicknessTexture.texCoord ?? 0 });
        if (iridescenceThicknessTexture.extensions) {
          const ex = iridescenceThicknessTexture.extensions.KHR_texture_transform;
          if (ex) {
            this.matricesMap.set("iridescenceThicknessTexture", this.buildTrans(ex, defines, "IRIDESCENCEMAP"));
          }
        }
      }
      defines.push({ name: "IRIDESCENCE" });
    }
    if (material.extensions && material.extensions.KHR_materials_diffuse_transmission) {
      const {
        diffuseTransmissionFactor,
        diffuseTransmissionTexture,
        diffuseTransmissionColorFactor,
        diffuseTransmissionColorTexture
      } = material.extensions.KHR_materials_diffuse_transmission;
      this.diffuseTransmissionFactor = diffuseTransmissionFactor;
      if (diffuseTransmissionTexture) {
        this.diffuseTransmissionTexture = textures[diffuseTransmissionTexture.index];
        defines.push({ name: "DIFFUSE_TRANSMISSION_MAP", value: diffuseTransmissionTexture.texCoord ?? 0 });
        if (diffuseTransmissionTexture.extensions) {
          const ex = diffuseTransmissionTexture.extensions.KHR_texture_transform;
          if (ex) {
            this.matricesMap.set("diffuseTransmissionTexture", this.buildTrans(ex, defines, "DIFFUSE_TRANSMISSION_MAP"));
          }
        }
      }
      this.diffuseTransmissionColorFactor = diffuseTransmissionColorFactor ?? [1, 1, 1];
      if (diffuseTransmissionColorTexture) {
        this.diffuseTransmissionColorTexture = textures[diffuseTransmissionColorTexture.index];
        defines.push({ name: "DIFFUSE_TRANSMISSION_COLOR_MAP", value: diffuseTransmissionColorTexture.texCoord ?? 0 });
        if (diffuseTransmissionColorTexture.extensions) {
          const ex = diffuseTransmissionColorTexture.extensions.KHR_texture_transform;
          if (ex) {
            this.matricesMap.set(
              "diffuseTransmissionColorTexture",
              this.buildTrans(ex, defines, "DIFFUSE_TRANSMISSION_COLOR_MAP")
            );
          }
        }
      }
      defines.push({ name: "DIFFUSE_TRANSMISSION" });
    }
    if (material.extensions && material.extensions.KHR_materials_ior) {
      this.ior = material.extensions.KHR_materials_ior.ior;
      defines.push({ name: "IOR" });
    }
    if (material.extensions && material.extensions.KHR_materials_specular) {
      const { specularFactor, specularTexture, specularColorFactor, specularColorTexture } = material.extensions.KHR_materials_specular;
      this.specularFactor = [specularFactor ?? 1, 0, 0];
      this.specularColorFactor = specularColorFactor;
      if (specularTexture) {
        this.specularTexture = textures[specularTexture.index];
        defines.push({ name: "SPECULARMAP" });
        if (specularTexture.extensions) {
          const ex = specularTexture.extensions.KHR_texture_transform;
          if (ex) {
            this.matricesMap.set("specularTexture", this.buildTrans(ex, defines, "SPECULARMAP"));
          }
        }
      }
      if (specularColorTexture) {
        this.specularColorTexture = textures[specularColorTexture.index];
        defines.push({ name: "SPECULARCOLORMAP" });
        if (specularColorTexture.extensions) {
          const ex = specularColorTexture.extensions.KHR_texture_transform;
          if (ex) {
            this.matricesMap.set("specularColorTexture", this.buildTrans(ex, defines, "SPECULARCOLORMAP"));
          }
        }
      }
      defines.push({ name: "SPECULAR" });
    }
    this.uniforms = {
      baseColorTexture: null,
      metallicRoughnessTexture: null,
      normalTexture: null,
      occlusionTexture: null,
      clearcoatTexture: null,
      clearcoatRoughnessTexture: null,
      sheenRoughnessTexture: null,
      iridescenceThicknessTexture: null,
      iridescenceTexture: null,
      sheenColorTexture: null,
      clearcoatNormalTexture: null,
      emissiveTexture: null,
      prefilterMap: null,
      charlieMap: null,
      brdfLUT: null,
      irradianceMap: null,
      transmissionTexture: null,
      specularTexture: null,
      specularColorTexture: null,
      thicknessTexture: null,
      colorTexture: null,
      Sheen_E: null,
      depthTexture: null,
      diffuseTransmissionTexture: null,
      diffuseTransmissionColorTexture: null,
      anisotropyTexture: null,
      isTone: null,
      isIBL: null,
      isDefaultLight: null
    };
    const { pbrMetallicRoughness } = material;
    if (pbrMetallicRoughness) {
      this.baseColorFactor = pbrMetallicRoughness.baseColorFactor;
      this.roughnessFactor = pbrMetallicRoughness.roughnessFactor;
      this.metallicFactor = pbrMetallicRoughness.metallicFactor;
      if (pbrMetallicRoughness.specularFactor) {
        this.specularFactor = pbrMetallicRoughness.specularFactor;
      }
      if (pbrMetallicRoughness.glossinessFactor) {
        this.glossinessFactor = pbrMetallicRoughness.glossinessFactor;
      }
    }
    this.alpha = material.alphaMode === "BLEND";
    this.doubleSided = material.doubleSided;
    this.emissiveFactor = material.emissiveFactor;
    this.extras = material.extras;
    if (pbrMetallicRoughness && pbrMetallicRoughness.metallicRoughnessTexture) {
      const { extensions, texCoord } = pbrMetallicRoughness.metallicRoughnessTexture;
      this.metallicRoughnessTexture = textures[pbrMetallicRoughness.metallicRoughnessTexture.index];
      defines.push({ name: "METALROUGHNESSMAP", value: texCoord ?? 0 });
      if (extensions) {
        const ex = extensions.KHR_texture_transform;
        if (ex) {
          this.matricesMap.set("metallicRoughnessTexture", this.buildTrans(ex, defines, "METALROUGHNESSMAP"));
        }
      }
    }
    if (material.normalTexture) {
      const { extensions, texCoord, scale } = material.normalTexture;
      this.normalTexture = textures[material.normalTexture.index];
      this.normalTextureScale = scale;
      defines.push({ name: "NORMALMAP", value: texCoord ?? 0 });
      if (extensions) {
        const ex = extensions.KHR_texture_transform;
        if (ex) {
          this.normalTextureScale = void 0;
          this.matricesMap.set("normalTexture", this.buildTrans(ex, defines, "NORMALMAP"));
        }
      }
    }
    if (material.occlusionTexture) {
      const { extensions, texCoord } = material.occlusionTexture;
      this.occlusionTexture = textures[material.occlusionTexture.index];
      defines.push({ name: "OCCLUSIONMAP", value: texCoord ?? 0 });
      if (extensions) {
        const ex = extensions.KHR_texture_transform;
        if (ex) {
          this.matricesMap.set("occlusionTexture", this.buildTrans(ex, defines, "OCCLUSIONMAP"));
        }
      }
    }
    if (pbrMetallicRoughness && pbrMetallicRoughness.baseColorTexture) {
      const { extensions, texCoord } = pbrMetallicRoughness.baseColorTexture;
      this.baseColorTexture = textures[pbrMetallicRoughness.baseColorTexture.index];
      defines.push({ name: "BASECOLORTEXTURE", value: texCoord ?? 0 });
      if (extensions) {
        const ex = extensions.KHR_texture_transform;
        if (ex) {
          this.matricesMap.set("baseColorTexture", this.buildTrans(ex, defines, "BASECOLORTEXTURE"));
        }
      }
    }
    if (material.emissiveTexture) {
      const { extensions, texCoord } = material.emissiveTexture;
      this.emissiveTexture = textures[material.emissiveTexture.index];
      defines.push({ name: "EMISSIVEMAP", value: texCoord ?? 0 });
      if (extensions) {
        const ex = extensions.KHR_texture_transform;
        if (ex) {
          this.matricesMap.set("emissiveTexture", this.buildTrans(ex, defines, "EMISSIVEMAP"));
        }
      }
    }
    if (material.alphaMode === "MASK") {
      defines.push({
        name: "ALPHATEST",
        value: material.alphaCutoff ?? 0.5
      });
    } else if (material.alphaMode === "BLEND") {
      defines.push({ name: "ALPHATEST", value: 0.01 });
    }
    if (this.doubleSided) {
      defines.push({ name: "DOUBLESIDED" });
    }
    if (material.extensions && material.extensions.KHR_materials_unlit) {
      defines.push({ name: "NOLIGHT" });
    }
    if (this.matrices.length) {
      defines.push({ name: "MATRICES", value: this.matrices.length });
    }
  }
  buildTrans(ex, defines, name = "") {
    if (ex.offset !== void 0 || ex.scale !== void 0 || ex.rotation !== void 0) {
      const offset = ex.offset || [0, 0];
      const scale = ex.scale || [1, 1];
      const rotation = ex.rotation || 0;
      const i = this.matrices.push(new Matrix4().set([...offset, 0, 0, ...scale, 0, 0, rotation, 0, 0, 0, 0, 0, 0, 0])) - 1;
      defines.push({ name: `${name}_TEXTURE_TRANSFORM`, value: i });
      return i;
    }
  }
  setHarmonics(sphericalHarmonics) {
    this.sphericalHarmonics = sphericalHarmonics;
  }
  updateUniformsWebgl(gl2, program) {
    gl2.useProgram(program);
    this.uniforms.isTone = gl2.getUniformLocation(program, "isTone");
    this.uniforms.isIBL = gl2.getUniformLocation(program, "isIBL");
    this.uniforms.isDefaultLight = gl2.getUniformLocation(program, "isDefaultLight");
    if (this.baseColorTexture) {
      this.uniforms.baseColorTexture = gl2.getUniformLocation(program, "baseColorTexture");
      gl2.uniform1i(this.uniforms.baseColorTexture, textureEnum.baseColorTexture);
    }
    if (this.metallicRoughnessTexture) {
      this.uniforms.metallicRoughnessTexture = gl2.getUniformLocation(program, "metallicRoughnessTexture");
      gl2.uniform1i(this.uniforms.metallicRoughnessTexture, textureEnum.metallicRoughnessTexture);
    }
    if (this.normalTexture) {
      this.uniforms.normalTexture = gl2.getUniformLocation(program, "normalTexture");
      gl2.uniform1i(this.uniforms.normalTexture, textureEnum.normalTexture);
    }
    if (this.occlusionTexture) {
      this.uniforms.occlusionTexture = gl2.getUniformLocation(program, "occlusionTexture");
      gl2.uniform1i(this.uniforms.occlusionTexture, textureEnum.occlusionTexture);
    }
    if (this.emissiveTexture) {
      this.uniforms.emissiveTexture = gl2.getUniformLocation(program, "emissiveTexture");
      gl2.uniform1i(this.uniforms.emissiveTexture, textureEnum.emissiveTexture);
    }
    if (this.clearcoatTexture) {
      this.uniforms.clearcoatTexture = gl2.getUniformLocation(program, "clearcoatTexture");
      gl2.uniform1i(this.uniforms.clearcoatTexture, textureEnum.clearcoatTexture);
    }
    if (this.clearcoatRoughnessTexture) {
      this.uniforms.clearcoatRoughnessTexture = gl2.getUniformLocation(program, "clearcoatRoughnessTexture");
      gl2.uniform1i(this.uniforms.clearcoatRoughnessTexture, textureEnum.clearcoatRoughnessTexture);
    }
    if (this.clearcoatNormalTexture) {
      this.uniforms.clearcoatNormalTexture = gl2.getUniformLocation(program, "clearcoatNormalTexture");
      gl2.uniform1i(this.uniforms.clearcoatNormalTexture, textureEnum.clearcoatNormalTexture);
    }
    if (this.sheenRoughnessTexture) {
      this.uniforms.sheenRoughnessTexture = gl2.getUniformLocation(program, "sheenRoughnessTexture");
      gl2.uniform1i(this.uniforms.sheenRoughnessTexture, textureEnum.sheenRoughnessTexture);
    }
    if (this.iridescenceThicknessTexture) {
      this.uniforms.iridescenceThicknessTexture = gl2.getUniformLocation(program, "iridescenceThicknessTexture");
      gl2.uniform1i(this.uniforms.iridescenceThicknessTexture, textureEnum.iridescenceThicknessTexture);
    }
    if (this.iridescenceTexture) {
      this.uniforms.iridescenceTexture = gl2.getUniformLocation(program, "iridescenceTexture");
      gl2.uniform1i(this.uniforms.iridescenceTexture, textureEnum.iridescenceTexture);
    }
    if (this.anisotropyTexture) {
      this.uniforms.anisotropyTexture = gl2.getUniformLocation(program, "anisotropyTexture");
      gl2.uniform1i(this.uniforms.anisotropyTexture, textureEnum.anisotropyTexture);
    }
    if (this.diffuseTransmissionColorTexture) {
      this.uniforms.diffuseTransmissionColorTexture = gl2.getUniformLocation(program, "diffuseTransmissionColorTexture");
      gl2.uniform1i(this.uniforms.diffuseTransmissionColorTexture, textureEnum.diffuseTransmissionColorTexture);
    }
    if (this.diffuseTransmissionTexture) {
      this.uniforms.diffuseTransmissionTexture = gl2.getUniformLocation(program, "diffuseTransmissionTexture");
      gl2.uniform1i(this.uniforms.diffuseTransmissionTexture, textureEnum.diffuseTransmissionTexture);
    }
    if (this.sheenColorTexture) {
      this.uniforms.sheenColorTexture = gl2.getUniformLocation(program, "sheenColorTexture");
      gl2.uniform1i(this.uniforms.sheenColorTexture, textureEnum.sheenColorTexture);
    }
    if (this.transmissionTexture) {
      this.uniforms.transmissionTexture = gl2.getUniformLocation(program, "transmissionTexture");
      gl2.uniform1i(this.uniforms.transmissionTexture, textureEnum.transmissionTexture);
    }
    if (this.specularTexture) {
      this.uniforms.specularTexture = gl2.getUniformLocation(program, "specularTexture");
      gl2.uniform1i(this.uniforms.specularTexture, textureEnum.specularTexture);
    }
    if (this.specularColorTexture) {
      this.uniforms.specularColorTexture = gl2.getUniformLocation(program, "specularColorTexture");
      gl2.uniform1i(this.uniforms.specularColorTexture, textureEnum.specularColorTexture);
    }
    if (this.thicknessTexture) {
      this.uniforms.thicknessTexture = gl2.getUniformLocation(program, "thicknessTexture");
      gl2.uniform1i(this.uniforms.thicknessTexture, textureEnum.thicknessTexture);
    }
    this.uniforms.prefilterMap = gl2.getUniformLocation(program, "prefilterMap");
    this.uniforms.charlieMap = gl2.getUniformLocation(program, "charlieMap");
    this.uniforms.brdfLUT = gl2.getUniformLocation(program, "brdfLUT");
    this.uniforms.irradianceMap = gl2.getUniformLocation(program, "irradianceMap");
    this.uniforms.depthTexture = gl2.getUniformLocation(program, "depthTexture");
    this.uniforms.colorTexture = gl2.getUniformLocation(program, "colorTexture");
    this.uniforms.Sheen_E = gl2.getUniformLocation(program, "Sheen_E");
    gl2.uniform1i(this.uniforms.prefilterMap, textureEnum.prefilterTexture);
    gl2.uniform1i(this.uniforms.charlieMap, textureEnum.charlieTexture);
    gl2.uniform1i(this.uniforms.brdfLUT, textureEnum.brdfLUTTexture);
    gl2.uniform1i(this.uniforms.irradianceMap, textureEnum.irradianceTexture);
    gl2.uniform1i(this.uniforms.Sheen_E, textureEnum.Sheen_E);
    {
      const mIndex = gl2.getUniformBlockIndex(program, "LightColor");
      gl2.uniformBlockBinding(program, mIndex, 4);
    }
    {
      const mIndex = gl2.getUniformBlockIndex(program, "LightPos");
      gl2.uniformBlockBinding(program, mIndex, 3);
    }
    {
      const mIndex = gl2.getUniformBlockIndex(program, "Spotdir");
      gl2.uniformBlockBinding(program, mIndex, 5);
    }
    {
      const mIndex = gl2.getUniformBlockIndex(program, "LightIntensity");
      gl2.uniformBlockBinding(program, mIndex, 6);
    }
    if (this.matrices.length) {
      const mIndex = gl2.getUniformBlockIndex(program, "TextureMatrices");
      gl2.uniformBlockBinding(program, mIndex, 8);
      const textureMatricesUniform = gl2.createBuffer();
      gl2.bindBuffer(gl2.UNIFORM_BUFFER, textureMatricesUniform);
      gl2.bufferData(gl2.UNIFORM_BUFFER, this.textureMatricesBuffer.store, gl2.STATIC_DRAW);
      this.textureMatricesUniform = textureMatricesUniform;
    }
  }
  createUniforms(isTexture, lights) {
    const spotDirs = new Float32Array(lights.length * 4);
    const lightPos = new Float32Array(lights.length * 4);
    const lightColor = new Float32Array(lights.length * 4);
    const lightProps = new Float32Array(lights.length * 4);
    const textureMatrices = new Float32Array(this.matrices.length * 16);
    lights.forEach((light, i) => {
      spotDirs.set(
        new Vector3([light.matrixWorld.elements[8], light.matrixWorld.elements[9], light.matrixWorld.elements[10]]).normalize().elements,
        i * 4
      );
      lightPos.set(light.getPosition(), i * 4);
      lightColor.set(light.color.elements, i * 4);
      lightProps.set(
        [light.intensity, light.spot.innerConeAngle ?? 0, light.spot.outerConeAngle ?? 0, lightEnum[light.type]],
        i * 4
      );
    });
    this.matrices.forEach((m, i) => {
      textureMatrices.set(m.elements, i * 16);
    });
    {
      const materialUniformBuffer = new UniformBuffer(isTexture);
      materialUniformBuffer.add("lights", [...this.lights]);
      materialUniformBuffer.add("iridescence", [
        this.iridescenceFactor ?? 0,
        this.iridescenceIOR ?? 1.3,
        this.iridescenceThicknessMaximum ?? 400,
        this.iridescenceThicknessMinimum ?? 100
      ]);
      materialUniformBuffer.add("diffuseTransmissionFactor", [
        this.diffuseTransmissionFactor ?? 0,
        ...this.diffuseTransmissionColorFactor
      ]);
      materialUniformBuffer.add("baseColorFactor", this.baseColorFactor ?? [0.8, 0.8, 0.8, 1]);
      materialUniformBuffer.add("specularColorFactor", this.specularColorFactor ?? [1, 1, 1]);
      materialUniformBuffer.add("emissiveFactor", this.emissiveFactor ?? [0, 0, 0]);
      materialUniformBuffer.add("sheenColorFactor", this.sheenColorFactor ?? [0, 0, 0]);
      materialUniformBuffer.add("attenuationColor", this.attenuationColor ?? [1, 1, 1]);
      materialUniformBuffer.add("specularFactor", this.specularFactor ?? [1, 0, 0]);
      materialUniformBuffer.add("anisotropy", [this.anisotropyStrength ?? 0, this.anisotropyRotation ?? 0]);
      materialUniformBuffer.add("glossinessFactor", this.glossinessFactor ?? 0.5);
      materialUniformBuffer.add("metallicFactor", this.metallicFactor ?? 1);
      materialUniformBuffer.add("roughnessFactor", this.roughnessFactor ?? 1);
      materialUniformBuffer.add("clearcoatFactor", this.clearcoatFactor ?? 0);
      materialUniformBuffer.add("clearcoatRoughnessFactor", this.clearcoatRoughnessFactor ?? 0);
      materialUniformBuffer.add("sheenRoughnessFactor", this.sheenRoughnessFactor ?? 0);
      materialUniformBuffer.add("transmissionFactor", this.transmissionFactor ?? 0);
      materialUniformBuffer.add("ior", this.ior ?? 1);
      materialUniformBuffer.add("normalTextureScale", this.normalTextureScale ?? 1);
      materialUniformBuffer.add("attenuationDistance", this.attenuationDistance ?? 1);
      materialUniformBuffer.add("thicknessFactor", this.thicknessFactor ?? 0);
      materialUniformBuffer.add("emissiveStrength", this.emissiveStrength ?? 1);
      materialUniformBuffer.add("dispersionFactor", [this.dispersion ?? 0]);
      materialUniformBuffer.add("bulk", 0);
      materialUniformBuffer.done();
      if (materialUniformBuffer.store.byteLength % 16 !== 0) {
        throw new Error("Material uniform buffer length must be multiple of 16");
      }
      this.materialUniformBuffer = materialUniformBuffer;
    }
    if (this.matrices.length) {
      const materialUniformBuffer = new UniformBuffer();
      materialUniformBuffer.add("textureMatrices", textureMatrices);
      materialUniformBuffer.done();
      this.textureMatricesBuffer = materialUniformBuffer;
    }
  }
  updateUniformsWebGPU(WebGPU) {
    const { device, nearestSampler, linearSampler } = WebGPU;
    let uniformBuffer6;
    if (this.textureMatricesBuffer) {
      uniformBuffer6 = device.createBuffer({
        size: 256 + this.textureMatricesBuffer.store.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      });
      this.textureMatricesBuffer.bufferWebGPU = uniformBuffer6;
    }
    const sampler = this.baseColorTexture ? this.baseColorTexture.sampler : linearSampler;
    const uniformBindGroup1 = [
      {
        binding: 2,
        resource: sampler
      },
      {
        binding: 37,
        resource: nearestSampler
      },
      {
        binding: 24,
        resource: linearSampler
      },
      {
        binding: 3,
        resource: this.baseColorTexture?.view
      },
      {
        binding: 4,
        resource: this.metallicRoughnessTexture?.view
      },
      {
        binding: 5,
        resource: this.normalTexture?.view
      },
      {
        binding: 6,
        resource: this.emissiveTexture?.view
      },
      {
        binding: 7,
        resource: this.occlusionTexture?.view
      },
      {
        binding: 8,
        resource: this.clearcoatTexture?.view
      },
      {
        binding: 9,
        resource: this.clearcoatRoughnessTexture?.view
      },
      {
        binding: 10,
        resource: this.transmissionTexture?.view
      },
      {
        binding: 11,
        resource: this.sheenColorTexture?.view
      },
      {
        binding: 12,
        resource: this.sheenRoughnessTexture?.view
      },
      {
        binding: 13,
        resource: this.clearcoatNormalTexture?.view
      },
      {
        binding: 14,
        resource: this.specularTexture?.view
      },
      {
        binding: 29,
        resource: this.thicknessTexture?.view
      },
      {
        binding: 31,
        resource: this.anisotropyTexture?.view
      },
      {
        binding: 32,
        resource: this.iridescenceThicknessTexture?.view
      },
      {
        binding: 38,
        resource: this.iridescenceTexture?.view
      },
      {
        binding: 33,
        resource: this.specularColorTexture?.view
      },
      {
        binding: 34,
        resource: this.diffuseTransmissionTexture?.view
      },
      {
        binding: 36,
        resource: this.diffuseTransmissionColorTexture?.view
      },
      {
        binding: 23,
        resource: this.textureMatricesBuffer && uniformBuffer6
      }
    ];
    if (this.textureMatricesBuffer) {
      device.queue.writeBuffer(
        uniformBuffer6,
        0,
        this.textureMatricesBuffer.store.buffer,
        this.textureMatricesBuffer.store.byteOffset,
        this.textureMatricesBuffer.store.byteLength
      );
    }
    this.uniformBindGroup1 = uniformBindGroup1.filter((r) => r.resource);
  }
  hasNormal() {
    return Boolean(this.normalTexture) || Boolean(this.clearcoatNormalTexture);
  }
  setColor(gl2, name, value) {
    this.materialUniformBuffer.update(gl2, name, value.elements, true);
  }
  setTexture(gl2, name, type, value) {
    gl2.bindBufferBase(gl2.UNIFORM_BUFFER, 8, this.textureMatricesUniform);
    const i = this.matricesMap.get(name) * 16;
    const [e0, e1] = value.elements;
    if (type === "offset") {
      this.textureMatricesBuffer.store[i] = e0;
      this.textureMatricesBuffer.store[i + 1] = e1;
    }
    if (type === "scale") {
      this.textureMatricesBuffer.store[i + 4] = e0;
      this.textureMatricesBuffer.store[i + 5] = e1;
    }
    if (type === "rotation") {
      this.textureMatricesBuffer.store[i + 8] = e0;
    }
    gl2.bufferSubData(gl2.UNIFORM_BUFFER, 0, this.textureMatricesBuffer.store);
  }
  setTextureWebGPU(WebGPU, name, type, value) {
    const i = this.matricesMap.get(name) * 16;
    const [e0, e1] = value.elements;
    if (type === "offset") {
      this.textureMatricesBuffer.store[i] = e0;
      this.textureMatricesBuffer.store[i + 1] = e1;
    }
    if (type === "scale") {
      this.textureMatricesBuffer.store[i + 4] = e0;
      this.textureMatricesBuffer.store[i + 5] = e1;
    }
    if (type === "rotation") {
      this.textureMatricesBuffer.store[i + 8] = e0;
    }
    WebGPU.device.queue.writeBuffer(
      this.textureMatricesBuffer.bufferWebGPU,
      0,
      this.textureMatricesBuffer.store.buffer,
      this.textureMatricesBuffer.store.byteOffset,
      this.textureMatricesBuffer.store.byteLength
    );
  }
  setColorWebGPU(WebGPU, name, value) {
    this.materialUniformBuffer.updateWebGPU(WebGPU, name, value.elements, true);
  }
};

// src/fetch.ts
function loadKTX(b) {
  const { ktxTexture, TranscodeTarget, transcoderConfig } = window.LIBKTX;
  const { astcSupported, dxtSupported, pvrtcSupported, etc1Supported, etc2Supported } = transcoderConfig;
  const ktxdata = new Uint8Array(b);
  if (!IsValid(ktxdata)) {
    throw new Error("Texture is not valid ktx 2.0 file");
  }
  const texture = new ktxTexture(ktxdata);
  if (texture.needsTranscoding) {
    let format;
    if (astcSupported) {
      format = TranscodeTarget.ASTC_4x4_RGBA;
    } else if (dxtSupported) {
      format = TranscodeTarget.BC1_OR_3;
    } else if (pvrtcSupported) {
      format = TranscodeTarget.PVRTC1_4_RGBA;
    } else if (etc1Supported || etc2Supported) {
      format = TranscodeTarget.ETC;
    } else {
      format = TranscodeTarget.RGBA4444;
    }
    const result = texture.transcodeBasis(format, 0);
    if (result !== window.LIBKTX.ErrorCode.SUCCESS) {
      throw new Error("Texture transcode failed. See console for details.");
    }
    return texture.glUpload().texture;
  }
}
function IsValid(data) {
  if (data.byteLength >= 12) {
    const identifier = new Uint8Array(data.buffer, data.byteOffset, 12);
    if (identifier[0] === 171 && identifier[1] === 75 && identifier[2] === 84 && identifier[3] === 88 && identifier[4] === 32 && identifier[5] === 50 && identifier[6] === 48 && identifier[7] === 187 && identifier[8] === 13 && identifier[9] === 10 && identifier[10] === 26 && identifier[11] === 10) {
      return true;
    }
  }
  return false;
}
function fetchJSON(url) {
  return fetch(url).then((r) => r.json());
}
function fetchBinary(url) {
  return fetch(url).then((r) => r.arrayBuffer());
}
function fetchImage(isbitmap, s, { bufferView, mimeType, uri }, { url, name }, sampler) {
  if (typeof window !== "undefined") {
    return new Promise((resolve, reject) => {
      if (mimeType === "image/ktx2") {
        window.fetch(url).then((r) => r.arrayBuffer()).then((b) => {
          resolve({
            sampler,
            mimeType,
            name,
            image: loadKTX(b)
          });
        });
      } else {
        const image = new Image();
        image.onload = () => {
          if (isbitmap) {
            createImageBitmap(image, { premultiplyAlpha: "none", colorSpaceConversion: "none" }).then((bitmap) => {
              resolve({
                sampler,
                name,
                image: bitmap
              });
            });
          } else {
            resolve({
              sampler,
              name,
              image
            });
          }
        };
        image.onerror = () => {
          reject(new Error("Cant load texture"));
        };
        image.crossOrigin = "anonymous";
        if (bufferView !== void 0) {
          const view = s.json.bufferViews[bufferView];
          const buffer = new Uint8Array(s.arrayBuffer[view.buffer], view.byteOffset, view.byteLength);
          const blob = new Blob([buffer], { type: mimeType });
          image.src = URL.createObjectURL(blob);
        } else if (/base64/.test(uri)) {
          image.src = uri;
        } else {
          image.src = url;
        }
      }
    });
  } else {
    return fetch(url).then((r) => r.arrayBuffer()).then((b) => ({
      sampler,
      mimeType,
      name,
      image: b
    }));
  }
}

// src/decoder.ts
var decoderModule;
var DecoderModule = () => new Promise((resolve) => {
  const dracoDecoderType = {
    onModuleLoaded(module2) {
      decoderModule = module2;
      resolve(decoderModule);
    }
  };
  Promise.resolve().then(() => __toESM(require_draco3d(), 1)).then((m) => {
    m.createDecoderModule(dracoDecoderType);
  });
});
function decodeDracoData(rawBuffer, decoder, offset, length) {
  const buffer = new decoderModule.DecoderBuffer();
  buffer.Init(new Int8Array(rawBuffer, offset, length), rawBuffer.byteLength);
  const dracoGeometry = new decoderModule.Mesh();
  decoder.DecodeBufferToMesh(buffer, dracoGeometry);
  decoderModule.destroy(buffer);
  return dracoGeometry;
}
function getArray(type, length, decodedGeometry, attribute, decoder) {
  let arr;
  let dracoArr;
  switch (type) {
    case "BYTE":
      arr = new Int8Array(length);
      arr.type = "BYTE";
      dracoArr = new decoderModule.DracoInt8Array();
      if (decodedGeometry) {
        decoder.GetAttributeInt8ForAllPoints(decodedGeometry, attribute, dracoArr);
      }
      break;
    case "UNSIGNED_BYTE":
      arr = new Uint8Array(length);
      arr.type = "UNSIGNED_BYTE";
      dracoArr = new decoderModule.DracoUInt8Array();
      if (decodedGeometry) {
        decoder.GetAttributeUInt8ForAllPoints(decodedGeometry, attribute, dracoArr);
      }
      break;
    case "SHORT":
      arr = new Int16Array(length);
      arr.type = "SHORT";
      dracoArr = new decoderModule.DracoInt16Array();
      if (decodedGeometry) {
        decoder.GetAttributeInt16ForAllPoints(decodedGeometry, attribute, dracoArr);
      }
      break;
    case "UNSIGNED_SHORT":
      arr = new Uint16Array(length);
      arr.type = "UNSIGNED_SHORT";
      dracoArr = new decoderModule.DracoUInt16Array();
      if (decodedGeometry) {
        decoder.GetAttributeUInt16ForAllPoints(decodedGeometry, attribute, dracoArr);
      }
      break;
    case "UNSIGNED_INT":
      arr = new Uint32Array(length);
      arr.type = "UNSIGNED_INT";
      dracoArr = new decoderModule.DracoUInt32Array();
      if (decodedGeometry) {
        decoder.GetAttributeUInt32ForAllPoints(decodedGeometry, attribute, dracoArr);
      }
      break;
    case "FLOAT":
      arr = new Float32Array(length);
      arr.type = "FLOAT";
      dracoArr = new decoderModule.DracoFloat32Array();
      if (decodedGeometry) {
        decoder.GetAttributeFloatForAllPoints(decodedGeometry, attribute, dracoArr);
      }
      break;
  }
  return [dracoArr, arr];
}

// src/shaders/vertex.glsl
var vertex_default = '#include "./vert.h"\r\n\r\nvoid main() {\r\n    #if defined(WEBGPU)\r\n    Transform tr = transforms.data[gl_InstanceIndex];\r\n    #else\r\n    Transform tr = fetchTransform(int(uMaterialID) + gl_InstanceID);\r\n    #endif\r\n    mat4 model = tr.model;\r\n\r\n    #ifdef JOINTNUMBER\r\n        mat4 skin = inWeight.x * joint[int(inJoint.x)];\r\n        skin += inWeight.y * joint[int(inJoint.y)];\r\n        skin += inWeight.z * joint[int(inJoint.z)];\r\n        skin += inWeight.w * joint[int(inJoint.w)];\r\n    #else\r\n        mat4 skin = mat4(1.0);\r\n    #endif\r\n\r\n    #ifdef COLOR\r\n    vColor = inColor;\r\n    #endif\r\n    outUV0 = inUV;\r\n    #ifdef MULTIUV\r\n    outUV2 = inUV2;\r\n    #endif\r\n    #ifdef MULTIUV2\r\n    outUV3 = inUV3;\r\n    #endif\r\n    #ifdef TANGENT\r\n        vec3 normalW = normalize(vec3(model * vec4(inNormal.xyz, 0.0)));\r\n        vec3 tangentW = normalize(vec3(model * vec4(inTangent.xyz, 0.0)));\r\n        vec3 bitangentW = cross(normalW, tangentW) * inTangent.w;\r\n        #ifdef USERIGHTHANDEDSYSTEM\r\n        tangentW *= 1.0; // invertX\r\n        bitangentW *= -1.0; // invertY\r\n        #endif\r\n        outTBN = mat3(tangentW, bitangentW, normalW);\r\n    #else\r\n        outNormal = normalize(mat3(transpose(inverse(model))) * mat3(skin) * inNormal);\r\n    #endif\r\n    outPosition = vec3(model * skin * vec4(inPosition, 1.0));\r\n    outPositionView = projection * light * model * skin * vec4(inPosition, 1.0);\r\n    if (isShadow == 1.0) {\r\n        gl_Position = projection * light * model * skin * vec4(inPosition, 1.0);\r\n    } else {\r\n        gl_Position = projection * view * model * skin * vec4(inPosition, 1.0);\r\n    }\r\n\r\n    gl_PointSize = 1.0;\r\n\r\n    id = int(uMaterialID);\r\n}\r\n';

// src/shaders/fragment.glsl
var fragment_default = `#include "./frag.h"\r
\r
const float RECIPROCAL_PI = 0.31830988618;\r
const float PI = 3.141592653589793;\r
const float EPSILON = 1e-6;\r
const float ambientStrength = 0.1;\r
const float specularStrength = 2.5;\r
const float specularPower = 32.0;\r
const float gamma = 2.2;\r
const float exposure = 0.7;\r
\r
vec3 PBRNeutralToneMapping( vec3 color ) {\r
  const float startCompression = 0.8 - 0.04;\r
  const float desaturation = 0.15;\r
\r
  float x = min(color.r, min(color.g, color.b));\r
  float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;\r
  color -= offset;\r
\r
  float peak = max(color.r, max(color.g, color.b));\r
  if (peak < startCompression) return color;\r
\r
  const float d = 1. - startCompression;\r
  float newPeak = 1. - d * d / (peak + d - startCompression);\r
  color *= newPeak / peak;\r
\r
  float g = 1. - 1. / (desaturation * (peak - newPeak) + 1.);\r
  return mix(color, newPeak * vec3(1, 1, 1), g);\r
}\r
vec3 toneMapACES(vec3 x) {\r
    const float a = 2.51;\r
    const float b = 0.03;\r
    const float c = 2.43;\r
    const float d = 0.59;\r
    const float e = 0.14;\r
    return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0);\r
}\r
float saturate(float a) {\r
	if (a > 1.0) return 1.0;\r
	if (a < 0.0) return 0.0;\r
	return a;\r
}\r
vec2 getUV(int index) {\r
    #ifdef MULTIUV\r
    if (index == 2) {\r
        return outUV3;\r
    }\r
    if (index == 1) {\r
        return outUV2;\r
    }\r
    #endif\r
    if (index == 0) {\r
        return outUV0;\r
    }\r
}\r
#ifdef SHADOWMAP\r
float ShadowCalculation(vec4 fragPosLightSpace, float bias) {\r
    vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;\r
    projCoords = projCoords * 0.5 + 0.5;\r
    float currentDepth = projCoords.z;\r
\r
    float shadow = 0.0;\r
    vec2 texelSize = 1.0 / vec2(textureSize(depthTexture, 0));\r
    for (int x = -2; x <= 2; ++x) {\r
        for (int y = -2; y <= 2; ++y) {\r
            float pcfDepth = texture2D(depthTexture, projCoords.xy + vec2(x, y) * texelSize).r;\r
            shadow += currentDepth - bias > pcfDepth ? 0.5 : 0.0;\r
        }\r
    }\r
    shadow /= 25.0;\r
\r
    return shadow;\r
}\r
#endif\r
\r
vec3 srgbToLinear(vec4 srgbIn) {\r
    #ifdef BASISU\r
    return srgbIn.rgb;\r
    #else\r
    return pow(srgbIn.rgb, vec3(2.2));\r
    #endif\r
}\r
\r
vec3 fresnelSchlick(float cosTheta, vec3 F0) {\r
    return F0 + (vec3(1.0) - F0) * pow(1.0 - cosTheta, 5.0);\r
}\r
float fresnelSchlick(float cosTheta, float F0) {\r
    return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);\r
}\r
vec3 Schlick_to_F0(vec3 f, vec3 f90, float VdotH) {\r
    float x = clamp(1.0 - VdotH, 0.0, 1.0);\r
    float x2 = x * x;\r
    float x5 = clamp(x * x2 * x2, 0.0, 0.9999);\r
\r
    return (f - f90 * x5) / (1.0 - x5);\r
}\r
vec3 Schlick_to_F0(vec3 f, float VdotH) {\r
    return Schlick_to_F0(f, vec3(1.0), VdotH);\r
}\r
float sq(float t) {\r
    return t * t;\r
}\r
vec3 sq(vec3 t) {\r
    return t * t;\r
}\r
// XYZ to sRGB color space\r
const mat3 XYZ_TO_REC709 = mat3(\r
     3.2404542, -0.9692660,  0.0556434,\r
    -1.5371385,  1.8760108, -0.2040259,\r
    -0.4985314,  0.0415560,  1.0572252\r
);\r
\r
float applyIorToRoughness(float roughness, float ior) {\r
    #if defined VOLUME\r
    // Scale roughness with IOR so that an IOR of 1.0 results in no microfacet refraction and\r
    // an IOR of 1.5 results in the default amount of microfacet refraction.\r
    return roughness * clamp(ior * 2.0 - 2.0, 0.0, 1.0);\r
    #else\r
    return roughness;\r
    #endif\r
}\r
\r
// Assume air interface for top\r
// Note: We don't handle the case fresnel0 == 1\r
vec3 Fresnel0ToIor(vec3 fresnel0) {\r
    vec3 sqrtF0 = sqrt(fresnel0);\r
    return (vec3(1.0) + sqrtF0) / (vec3(1.0) - sqrtF0);\r
}\r
\r
// Conversion FO/IOR\r
vec3 IorToFresnel0(vec3 transmittedIor, float incidentIor) {\r
    return sq((transmittedIor - vec3(incidentIor)) / (transmittedIor + vec3(incidentIor)));\r
}\r
\r
// ior is a value between 1.0 and 3.0. 1.0 is air interface\r
float IorToFresnel0(float transmittedIor, float incidentIor) {\r
    return sq((transmittedIor - incidentIor) / (transmittedIor + incidentIor));\r
}\r
\r
// Fresnel equations for dielectric/dielectric interfaces.\r
// Ref: https://belcour.github.io/blog/research/2017/05/01/brdf-thin-film.html\r
// Evaluation XYZ sensitivity curves in Fourier space\r
vec3 evalSensitivity(float OPD, vec3 shift) {\r
    float phase = 2.0 * PI * OPD * 1.0e-9;\r
    vec3 val = vec3(5.4856e-13, 4.4201e-13, 5.2481e-13);\r
    vec3 pos = vec3(1.6810e+06, 1.7953e+06, 2.2084e+06);\r
    vec3 var = vec3(4.3278e+09, 9.3046e+09, 6.6121e+09);\r
\r
    vec3 xyz = val * sqrt(2.0 * PI * var) * cos(pos * phase + shift) * exp(-sq(phase) * var);\r
    xyz.x += 9.7470e-14 * sqrt(2.0 * PI * 4.5282e+09) * cos(2.2399e+06 * phase + shift[0]) * exp(-4.5282e+09 * sq(phase));\r
    xyz /= 1.0685e-7;\r
\r
    vec3 srgb = XYZ_TO_REC709 * xyz;\r
    return srgb;\r
}\r
\r
vec3 evalIridescence(float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0) {\r
    vec3 I;\r
\r
    // Force iridescenceIOR -> outsideIOR when thinFilmThickness -> 0.0\r
    float iridescenceIOR = mix(outsideIOR, eta2, smoothstep(0.0, 0.03, thinFilmThickness));\r
    // Evaluate the cosTheta on the base layer (Snell law)\r
    float sinTheta2Sq = sq(outsideIOR / iridescenceIOR) * (1.0 - sq(cosTheta1));\r
\r
    // Handle TIR:\r
    float cosTheta2Sq = 1.0 - sinTheta2Sq;\r
    if (cosTheta2Sq < 0.0) {\r
        return vec3(1.0);\r
    }\r
\r
    float cosTheta2 = sqrt(cosTheta2Sq);\r
\r
    // First interface\r
    float R0 = IorToFresnel0(iridescenceIOR, outsideIOR);\r
    float R12 = fresnelSchlick(cosTheta1, R0);\r
    float R21 = R12;\r
    float T121 = 1.0 - R12;\r
    float phi12 = 0.0;\r
    if (iridescenceIOR < outsideIOR) phi12 = PI;\r
    float phi21 = PI - phi12;\r
\r
    // Second interface\r
    vec3 baseIOR = Fresnel0ToIor(clamp(baseF0, 0.0, 0.9999)); // guard against 1.0\r
    vec3 R1 = IorToFresnel0(baseIOR, iridescenceIOR);\r
    vec3 R23 = fresnelSchlick(cosTheta2, R1);\r
    vec3 phi23 = vec3(0.0);\r
    if (baseIOR[0] < iridescenceIOR) phi23[0] = PI;\r
    if (baseIOR[1] < iridescenceIOR) phi23[1] = PI;\r
    if (baseIOR[2] < iridescenceIOR) phi23[2] = PI;\r
\r
    // Phase shift\r
    float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;\r
    vec3 phi = vec3(phi21) + phi23;\r
\r
    // Compound terms\r
    vec3 R123 = clamp(R12 * R23, 1e-5, 0.9999);\r
    vec3 r123 = sqrt(R123);\r
    vec3 Rs = sq(T121) * R23 / (vec3(1.0) - R123);\r
\r
    // Reflectance term for m = 0 (DC term amplitude)\r
    vec3 C0 = R12 + Rs;\r
    I = C0;\r
\r
    // Reflectance term for m > 0 (pairs of diracs)\r
    vec3 Cm = Rs - T121;\r
    for (int m = 1; m <= 2; ++m)\r
    {\r
        Cm *= r123;\r
        vec3 Sm = 2.0 * evalSensitivity(float(m) * OPD, float(m) * phi);\r
        I += Cm * Sm;\r
    }\r
\r
    // Since out of gamut colors might be produced, negative color values are clamped to 0.\r
    return max(I, vec3(0.0));\r
}\r
#ifdef ANISOTROPY\r
float DistributionGGX(vec3 N, vec3 H, vec3 anisotropicT, vec3 anisotropicB, float at, float ab) {\r
    float NdotH = dot(N, H);\r
    float TdotH = dot(anisotropicT, H);\r
    float BdotH = dot(anisotropicB, H);\r
\r
    float a2 = at * ab;\r
    vec3 f = vec3(ab * TdotH, at * BdotH, a2 * NdotH);\r
    float w2 = a2 / dot(f, f);\r
    return a2 * w2 * w2 / PI;\r
}\r
\r
float GeometrySmith(vec3 N, vec3 V, vec3 L, vec3 anisotropicT, vec3 anisotropicB, float at, float ab) {\r
    float NdotV = dot(N, V);\r
    float NdotL = dot(N, L);\r
    float TdotV = dot(anisotropicT, V);\r
    float TdotL = dot(anisotropicT, L);\r
    float BdotV = dot(anisotropicB, V);\r
    float BdotL = dot(anisotropicB, L);\r
\r
    float GGXV = NdotL * length(vec3(at * TdotV, ab * BdotV, NdotV));\r
    float GGXL = NdotV * length(vec3(at * TdotL, ab * BdotL, NdotL));\r
    float v = 0.5 / (GGXV + GGXL);\r
    return clamp(v, 0.0, 1.0);\r
}\r
#else\r
float DistributionGGX(vec3 N, vec3 H, float roughness) {\r
    float NdotH = saturate(dot(N, H));\r
    float a = max(roughness*roughness, 0.04);\r
    float alphaRoughnessSq = a * a;\r
    float f = (NdotH * NdotH) * (alphaRoughnessSq - 1.0) + 1.0;\r
    return alphaRoughnessSq / (PI * f * f);\r
}\r
\r
float GeometrySchlickGGX(float cosTheta, float roughness) {\r
    float r = (roughness + 1.0);\r
    float k = (r * r) / 8.0;\r
\r
    float nom   = cosTheta;\r
    float denom = cosTheta * (1.0 - k) + k;\r
\r
    return nom / denom;\r
}\r
\r
float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {\r
    float NdotV = saturate(dot(N, V));\r
    float NdotL = saturate(dot(N, L));\r
    float ggx2 = GeometrySchlickGGX(NdotV, roughness);\r
    float ggx1 = GeometrySchlickGGX(NdotL, roughness);\r
\r
    return ggx1 * ggx2;\r
}\r
#endif\r
\r
float fresnelSchlickRoughness(float cosTheta, float F0, float roughness) {\r
    return F0 + (max(1.0 - roughness, F0) - F0) * pow(1.0 - cosTheta, 5.0);\r
}\r
vec3 fresnelSchlickRoughness(float cosTheta, vec3 F0, float roughness) {\r
    return F0 + (max(vec3(1.0 - roughness), F0) - F0) * pow(1.0 - cosTheta, 5.0);\r
}\r
vec3 calcTransmission(float dispersionFactor, float ior, vec3 color, vec3 N, float roughness, vec3 V, float transmission, float thickness) {\r
    float refraction_ior = 1.0 / ior;\r
    vec3 environmentRefraction = vec3(0.0);\r
    #ifdef DISPERSION\r
    float realIOR = 1.0 / ior;\r
    float iorDispersionSpread = 0.04 * dispersionFactor * (realIOR - 1.0);\r
    vec3 iors = vec3(realIOR - iorDispersionSpread, refraction_ior, realIOR + iorDispersionSpread);\r
    for (int i = 0; i < 3; i++) {\r
        refraction_ior = iors[i];\r
    #endif\r
\r
    vec4 refractS = projection * view * vec4(outPosition + refract(-V, N, refraction_ior) * thickness, 1.0);\r
    refractS.xy = refractS.xy / refractS.w;\r
    refractS.xy = refractS.xy * 0.5 + 0.5;\r
    const float MAX_REFLECTION_LOD = 7.0;\r
    #if defined(WEBGPU)\r
    refractS.y = 1.0 - refractS.y;\r
    #endif\r
    vec3 baseColor = textureLod2D2(colorTexture, refractS.xy, applyIorToRoughness(roughness, 1.0 / refraction_ior) * MAX_REFLECTION_LOD).xyz;\r
\r
    #ifdef DISPERSION\r
        environmentRefraction[i] = baseColor[i];\r
    }\r
    #else\r
        environmentRefraction = baseColor;\r
    #endif\r
\r
    return transmission * environmentRefraction * color;\r
}\r
\r
#ifdef SPHERICAL_HARMONICS\r
vec3 computeEnvironmentIrradiance(vec3 normal) {\r
    return vSphericalL00.xyz\r
        + vSphericalL1_1.xyz * (normal.y)\r
        + vSphericalL10.xyz * (normal.z)\r
        + vSphericalL11.xyz * (normal.x)\r
        + vSphericalL2_2.xyz * (normal.y * normal.x)\r
        + vSphericalL2_1.xyz * (normal.y * normal.z)\r
        + vSphericalL20.xyz * ((3.0 * normal.z * normal.z) - 1.0)\r
        + vSphericalL21.xyz * (normal.z * normal.x)\r
        + vSphericalL22.xyz * (normal.x * normal.x - (normal.y * normal.y));\r
}\r
#endif\r
float sheenDistribution(float sheenRoughness, vec3 N, vec3 H) {\r
    float NdotH = saturate(dot(N, H));\r
    float alphaG = max(sheenRoughness * sheenRoughness, 0.01);\r
    float invR = 1.0 / alphaG;\r
    float cos2h = NdotH * NdotH;\r
    float sin2h = 1.0 - cos2h;\r
    return (2.0 + invR) * pow(sin2h, invR * 0.5) / (2.0 * PI);\r
}\r
float lambdaSheenNumericHelper(float x, float alphaG) {\r
    float oneMinusAlphaSq = (1.0 - alphaG) * (1.0 - alphaG);\r
    float a = mix(21.5473, 25.3245, oneMinusAlphaSq);\r
    float b = mix(3.82987, 3.32435, oneMinusAlphaSq);\r
    float c = mix(0.19823, 0.16801, oneMinusAlphaSq);\r
    float d = mix(-1.97760, -1.27393, oneMinusAlphaSq);\r
    float e = mix(-4.32054, -4.85967, oneMinusAlphaSq);\r
    return a / (1.0 + b * pow(x, c)) + d * x + e;\r
}\r
float lambdaSheen(float cosTheta, float alphaG) {\r
    if (abs(cosTheta) < 0.5) {\r
        return exp(lambdaSheenNumericHelper(cosTheta, alphaG));\r
    } else {\r
        return exp(2.0 * lambdaSheenNumericHelper(0.5, alphaG) - lambdaSheenNumericHelper(1.0 - cosTheta, alphaG));\r
    }\r
}\r
float sheenVisibility(vec3 N, vec3 V, vec3 L, float sheenRoughness) {\r
    float NdotL = saturate(dot(N, L));\r
    float NdotV = saturate(dot(N, V));\r
\r
    sheenRoughness = max(sheenRoughness, 0.000001); //clamp (0,1]\r
    float alphaG = sheenRoughness * sheenRoughness;\r
\r
    return clamp(1.0 / ((1.0 + lambdaSheen(NdotV, alphaG) + lambdaSheen(NdotL, alphaG)) *\r
        (4.0 * NdotV * NdotL)), 0.0, 1.0);\r
}\r
float E(float x, float y) {\r
    return clamp(textureLod2D(Sheen_E, vec2(x,y), 0.0).r, 0.0, 1.0);\r
}\r
float max3(vec3 v) { return max(max(v.x, v.y), v.z); }\r
float pow2(float v) { return v * v; }\r
vec3 IBLAmbient(vec3 baseColor, float metallic, vec3 n, float roughness, vec3 viewDir, float transmission, vec3 sheenColor, float sheenRoughness, vec3 iridescenceFresnel, float iridescenceFactor, vec3 F0, float specularWeight, float anisotropy, vec3 anisotropicB, inout vec3 f_sheen, out vec3 specular) {\r
    #ifdef ANISOTROPY\r
    vec3 Normal = cross(anisotropicB, viewDir);\r
    Normal = normalize(cross(Normal, anisotropicB));\r
    float a = pow2(pow2(1.0 - anisotropy * (1.0 - roughness)));\r
    n = normalize(mix(Normal, n, a));\r
    #endif\r
    \r
    vec3 F = fresnelSchlickRoughness(saturate(dot(n, viewDir)), F0, roughness);\r
\r
    vec3 kD = vec3(1.0) - F * specularWeight;\r
    #if defined SPECULARGLOSSINESSMAP\r
    #else\r
        kD *= 1.0 - clamp(metallic, 0.0, 0.9);\r
    #endif\r
    #if defined IRIDESCENCE\r
    kD = vec3(1.0) - mix(F, iridescenceFresnel, iridescenceFactor) * specularWeight;\r
    kD *= 1.0 - clamp(metallic, 0.0, 0.9);\r
    #endif\r
\r
    vec3 R;\r
    #ifdef SPHERICAL_HARMONICS\r
    R = reflect(viewDir, n);\r
    vec4 rotatedR = rotationMatrix * vec4(R.x * -1.0, R.y, R.z, 0.0);\r
    R = rotatedR.xyz;\r
    vec4 prefilterColor = textureLodCube(prefilterMap, R, roughness * float(SPHERICAL_HARMONICS));\r
    vec3 prefilteredColor = srgbToLinear(vec4(prefilterColor.rgb, 0.0)) / pow(prefilterColor.a, 2.2);\r
    vec3 irradianceVector = vec3(rotationMatrix * vec4(n.x, n.y, n.z * -1.0, 0)).xyz;\r
    vec3 irradiance = computeEnvironmentIrradiance(irradianceVector).rgb;\r
    #else\r
    const float MAX_REFLECTION_LOD = 4.0;\r
    R = reflect(-viewDir, n);\r
    vec3 prefilteredColor = textureLodCube(prefilterMap, R, roughness * MAX_REFLECTION_LOD).rgb;\r
    vec3 irradiance = textureCube(irradianceMap, n).rgb;\r
    #endif\r
    vec2 envBRDF  = textureLod2D(brdfLUT, vec2(saturate(dot(n, viewDir)), roughness), 0.0).rg;\r
    vec3 kS = F;\r
    #if defined IRIDESCENCE\r
    kS = mix(F, iridescenceFresnel, iridescenceFactor);\r
    #endif\r
    specular = prefilteredColor * (kS * specularWeight * envBRDF.x + envBRDF.y);\r
\r
    #if defined SHEEN\r
    float charliebrdf = textureLod2D(brdfLUT, vec2(saturate(dot(n, viewDir)), sheenRoughness), 0.0).b;\r
    vec3 sheenSample = textureLodCube(charlieMap, R, max(sheenRoughness * MAX_REFLECTION_LOD, 1.0)).rgb;\r
    f_sheen += sheenSample * sheenColor * charliebrdf;\r
    #endif\r
\r
    return (1.0 - transmission) * kD * irradiance * baseColor;\r
}\r
\r
float specEnv(vec3 N, vec3 V, float metallic, float roughness, vec3 F0, float specularWeight) {\r
    float F = fresnelSchlickRoughness(saturate(dot(N, V)), (F0.x+F0.y+F0.z)/3.0, roughness);\r
    vec2 envBRDF  = textureLod2D(brdfLUT, vec2(saturate(dot(N, V)), roughness), 0.0).rg;\r
    return (F * specularWeight * envBRDF.x + envBRDF.y);\r
}\r
\r
#ifdef ANISOTROPY\r
vec3 CookTorranceSpecular2(vec3 baseColor, float metallic, vec3 n, vec3 H, vec3 anisotropicT, vec3 anisotropicB, float roughness, vec3 viewDir, vec3 lightDir, float anisotropy, vec3 iridescenceFresnel, float iridescenceFactor, vec3 F0, float specularWeight) {\r
    roughness = roughness * roughness;\r
    float at = max(mix(roughness, 1.0, anisotropy * anisotropy), 0.001);\r
    float ab = max(roughness, 0.001);\r
    float D = DistributionGGX(n, H, anisotropicT, anisotropicB, at, ab);\r
    float G = GeometrySmith(n, viewDir, lightDir, anisotropicT, anisotropicB, at, ab);\r
    vec3 F = mix(fresnelSchlick(saturate(dot(viewDir, H)), F0), iridescenceFresnel, iridescenceFactor);\r
\r
    vec3 nominator = D * G * F * specularWeight;\r
    float denominator = 4.0 * saturate(dot(n, viewDir)) * max(dot(n, lightDir), 0.0);\r
    return D * G * F;\r
}\r
vec3 CookTorranceSpecular(vec3 baseColor, float metallic, vec3 n, vec3 H, vec3 anisotropicT, vec3 anisotropicB, float roughness, vec3 viewDir, vec3 lightDir, float anisotropy, vec3 F0, float specularWeight) {\r
    roughness = roughness * roughness;\r
    float at = max(mix(roughness, 1.0, anisotropy * anisotropy), 0.001);\r
    float ab = max(roughness, 0.001);\r
    float D = DistributionGGX(n, H, anisotropicT, anisotropicB, at, ab);\r
    float G = GeometrySmith(n, viewDir, lightDir, anisotropicT, anisotropicB, at, ab);\r
    vec3 F = fresnelSchlick(saturate(dot(viewDir, H)), F0); \r
\r
    vec3 nominator = D * G * F * specularWeight;\r
    float denominator = 4.0 * saturate(dot(n, viewDir)) * saturate(dot(n, lightDir));\r
    return D * G * F;\r
}\r
#else\r
vec3 CookTorranceSpecular2(vec3 baseColor, float metallic, vec3 n, vec3 H, vec3 anisotropicT, vec3 anisotropicB, float roughness, vec3 viewDir, vec3 lightDir, float anisotropy, vec3 iridescenceFresnel, float iridescenceFactor, vec3 F0, float specularWeight) {\r
    float D = DistributionGGX(n, H, roughness);\r
    float G = GeometrySmith(n, viewDir, lightDir, roughness);\r
    vec3 F = mix(fresnelSchlick(saturate(dot(viewDir, H)), F0), iridescenceFresnel, iridescenceFactor);\r
\r
    vec3 nominator = D * G * F * specularWeight;\r
    float denominator = 4.0 * saturate(dot(n, viewDir)) * saturate(dot(n, lightDir));\r
    return nominator / max(denominator, 0.001);\r
}\r
vec3 CookTorranceSpecular(vec3 baseColor, float metallic, vec3 n, vec3 H, vec3 anisotropicT, vec3 anisotropicB, float roughness, vec3 viewDir, vec3 lightDir, float anisotropy, vec3 F0, float specularWeight) {\r
    float D = DistributionGGX(n, H, roughness);\r
    float G = GeometrySmith(n, viewDir, lightDir, roughness);\r
    vec3 F = fresnelSchlick(saturate(dot(viewDir, H)), F0); \r
\r
    vec3 nominator = D * G * F * specularWeight;\r
    float denominator = 4.0 * saturate(dot(n, viewDir)) * saturate(dot(n, lightDir));\r
    return nominator / max(denominator, 0.001);\r
}\r
#endif\r
\r
vec3 LambertDiffuse(vec3 baseColor, float metallic, vec3 n, vec3 H, float roughness, vec3 viewDir, vec3 lightDir, vec3 F0, float specularWeight) {\r
    float NdotL = saturate(dot(n, lightDir));\r
\r
    vec3 F = fresnelSchlick(saturate(dot(H, viewDir)), F0);    \r
\r
    vec3 kD = vec3(1.0) - F * specularWeight;\r
    #if defined SPECULARGLOSSINESSMAP\r
    #else\r
        kD *= 1.0 - metallic;\r
    #endif\r
    return baseColor * kD / PI;\r
}\r
\r
vec3 ImprovedOrenNayarDiffuse(vec3 baseColor, float metallic, vec3 N, vec3 H, float a, vec3 V, vec3 L, vec3 F0, vec3 iridescenceFresnel, float iridescenceFactor, float specularWeight) {\r
    vec3 F = fresnelSchlick(saturate(dot(H, V)), F0);\r
    vec3 kD = vec3(1.0) - F * specularWeight;\r
    #if defined SPECULARGLOSSINESSMAP\r
    #else\r
        kD *= 1.0 - metallic;\r
    #endif\r
    #if defined IRIDESCENCE\r
    kD = vec3(1.0) - mix(F, iridescenceFresnel, iridescenceFactor) * specularWeight;\r
    kD *= 1.0 - clamp(metallic, 0.0, 0.9);\r
    #endif\r
    vec3 diffuseColor = baseColor * kD;\r
	// calculate intermediary values\r
	float dotNL = saturate(dot(N, L));\r
	float dotNV = saturate(dot(N, V));\r
	float dotLV = saturate(dot(L, V));\r
	float dotLH = saturate(dot(L, H));\r
\r
	float s = dotLV - dotNL * dotNV;\r
	float t = mix(1.0, max(max(dotNL, dotNV), 0.001), step(0.0, s));\r
	float st = s * (1.0 / (t + EPSILON));\r
\r
	float sigma2 = a;\r
	vec3 A = diffuseColor * (0.17 * sigma2 / (sigma2 + 0.13)) + vec3(1.0 - 0.5 * sigma2 / (sigma2 + 0.33));\r
	float B = 0.45 * sigma2 / (sigma2 + 0.09);\r
	return (diffuseColor * max(0.0, dotNL)) * (A + vec3(B * s / t) / PI) / PI;\r
}\r
\r
vec2 applyTransform(vec2 uv, mat4 textureMatrix) {\r
    mat3 translation = mat3(1, 0, 0, 0, 1, 0, textureMatrix[0].x, textureMatrix[0].y, 1);\r
    mat3 rotation = mat3(1, 0, 0, 0, 1, 0, 0, 0, 1);\r
    if (textureMatrix[2].x != 0.0) {\r
        rotation = mat3(\r
            cos(-textureMatrix[2].x), sin(-textureMatrix[2].x), 0,\r
            -sin(-textureMatrix[2].x), cos(-textureMatrix[2].x), 0,\r
            0, 0, 1\r
        );\r
    }\r
    mat3 scale = mat3(textureMatrix[1].x, 0, 0, 0, textureMatrix[1].y, 0, 0, 0, 1);\r
\r
    mat3 matrix = translation * rotation * scale;\r
    vec2 outUV = ( matrix * vec3(uv, 1.0) ).xy;\r
    return outUV;\r
}\r
float computeWrappedDiffuseNdotL(float NdotL, float w) {\r
    float t = 1.0+w;\r
    float invt2 = 1.0/(t*t);\r
    return saturate((NdotL+w)*invt2);\r
}\r
float pow5(float value) {\r
    float sq = value*value;\r
    return sq*sq*value;\r
}\r
float diffuseBRDF_Burley(float NdotL, float NdotV, float VdotH, float roughness) {\r
    float diffuseFresnelNV = pow5(saturate(1.0-NdotL)+EPSILON);\r
    float diffuseFresnelNL = pow5(saturate(1.0-NdotV)+EPSILON);\r
    float diffuseFresnel90 = 0.5+2.0*VdotH*VdotH*roughness;\r
    float fresnel = (1.0+(diffuseFresnel90-1.0)*diffuseFresnelNL) *\r
    (1.0+(diffuseFresnel90-1.0)*diffuseFresnelNV);\r
    return fresnel/PI;\r
}\r
#define absEps(x) abs(x)+EPSILON\r
\r
vec3 cocaLambert(vec3 alpha, float distance) {\r
    return exp(-alpha*distance);\r
}\r
#define maxEps(x) max(x, EPSILON)\r
vec3 transmittanceBRDF_Burley(const vec3 tintColor, const vec3 diffusionDistance, float thickness) {\r
    vec3 S = 1./maxEps(diffusionDistance);\r
    vec3 temp = exp((-0.333333333*thickness)*S);\r
    return tintColor.rgb*0.25*(temp*temp*temp+3.0*temp);\r
}\r
\r
vec3 computeColorAtDistanceInMedia(vec3 color, float distance) {\r
    return -log(color)/distance;\r
}\r
\r
void main() {\r
    mat4 inverseViewMatrix = inverse(view);\r
    vec3 viewPos = inverseViewMatrix[3].xyz;\r
\r
    #if defined(WEBGPU)\r
    Material mat = materials.data[int(id)];\r
    #else\r
    Material mat = fetchMaterial(int(id));\r
    #endif\r
    ivec4 lights = ivec4(mat.lights);\r
    vec4 baseColorFactor = mat.baseColorFactor;\r
    vec3 specularFactor = mat.specularFactor;\r
    vec3 specularColorFactor = mat.specularColorFactor;\r
    vec3 emissiveFactor = mat.emissiveFactor;\r
    float glossinessFactor = mat.glossinessFactor;\r
    float metallic = mat.metallicFactor;\r
    float roughness = mat.roughnessFactor;\r
    float clearcoatBlendFactor = mat.clearcoatFactor;\r
    float clearcoatRoughness = mat.clearcoatRoughnessFactor;;\r
    vec3 sheenColor = mat.sheenColorFactor;\r
    float sheenRoughness = mat.sheenRoughnessFactor;\r
    float transmission = mat.transmissionFactor;\r
    float ior = mat.ior;\r
    float normalTextureScale = mat.normalTextureScale;\r
    vec3 attenuationColorFactor = mat.attenuationColorFactor; \r
    float attenuationDistance = mat.attenuationDistance;\r
    float thickness = mat.thicknessFactor;\r
    float emissiveStrength = mat.emissiveStrength;\r
    vec2 anisotropyFactor = mat.anisotropyFactor;\r
    vec4 iridescence = mat.iridescence;\r
    float transmissionDiffuse = mat.diffuseTransmissionFactor.x;\r
    vec3 tintColor = mat.diffuseTransmissionFactor.yzw;\r
    float dispersionFactor = mat.dispersionFactor;\r
\r
    vec2 outUV = outUV0;\r
    #ifdef BASECOLORTEXTURE\r
        outUV = getUV(BASECOLORTEXTURE);\r
        #ifdef BASECOLORTEXTURE_TEXTURE_TRANSFORM\r
            outUV = applyTransform(outUV, textureMatrices[BASECOLORTEXTURE_TEXTURE_TRANSFORM]);\r
        #endif\r
        vec3 baseColor = texture2D(baseColorTexture, outUV).rgb * baseColorFactor.rgb;\r
        float alpha = min(texture2D(baseColorTexture, outUV).a, baseColorFactor.a);\r
    #else\r
        vec3 baseColor = baseColorFactor.rgb;\r
        float alpha = baseColorFactor.a;\r
    #endif\r
\r
    #ifdef ALPHATEST\r
    if ( alpha < ALPHATEST ) {\r
        discard;\r
    }\r
    if ( ALPHATEST > 0.01 ) {\r
        alpha = 1.0;\r
    }\r
    #else\r
        alpha = 1.0;\r
    #endif\r
\r
    if ( length(vColor.rgb) != 0.0 ) {\r
        baseColor.rgb *= vColor.rgb;\r
    }\r
\r
    #ifdef NOLIGHT\r
        color = vec4(baseColor, alpha);\r
        return;\r
    #endif\r
\r
    float ao = 1.0;\r
    #ifdef OCCLUSIONMAP\r
        outUV = getUV(OCCLUSIONMAP);\r
        #ifdef OCCLUSIONMAP_TEXTURE_TRANSFORM\r
            outUV = applyTransform(outUV, textureMatrices[OCCLUSIONMAP_TEXTURE_TRANSFORM]);\r
        #endif\r
        ao = texture2D(occlusionTexture, outUV).r;\r
    #endif\r
    \r
    #ifdef DIFFUSE_TRANSMISSION_MAP\r
        #ifdef DIFFUSE_TRANSMISSION_MAP_TEXTURE_TRANSFORM\r
            outUV = applyTransform(outUV, textureMatrices[DIFFUSE_TRANSMISSION_MAP_TEXTURE_TRANSFORM]);\r
        #endif\r
        vec4 diffuseTransmissionTextureV = texture2D(diffuseTransmissionTexture, outUV);\r
        transmissionDiffuse *= diffuseTransmissionTextureV.a;\r
    #endif\r
    vec3 attenuationColor = attenuationColorFactor.rgb;\r
    \r
    #ifdef DIFFUSE_TRANSMISSION_COLOR_MAP\r
        #ifdef DIFFUSE_TRANSMISSION_COLOR_MAP_TEXTURE_TRANSFORM\r
            outUV = applyTransform(outUV, textureMatrices[DIFFUSE_TRANSMISSION_COLOR_MAP_TEXTURE_TRANSFORM]);\r
        #endif\r
        vec4 diffuseTransmissionColorTextureV = texture2D(diffuseTransmissionColorTexture, outUV);\r
        tintColor *= diffuseTransmissionColorTextureV.rgb;\r
    #endif\r
    #ifdef CLEARCOATMAP\r
        outUV = getUV(CLEARCOATMAP);\r
        #ifdef CLEARCOATMAP_TEXTURE_TRANSFORM\r
            outUV = applyTransform(outUV, textureMatrices[CLEARCOATMAP_TEXTURE_TRANSFORM]);\r
        #endif\r
        clearcoatBlendFactor = texture2D(clearcoatTexture, outUV).r * clearcoatBlendFactor;\r
    #endif\r
    #ifdef CLEARCOATROUGHMAP\r
        outUV = getUV(CLEARCOATROUGHMAP);\r
        #ifdef CLEARCOATROUGHMAP_TEXTURE_TRANSFORM\r
            outUV = applyTransform(outUV, textureMatrices[CLEARCOATROUGHMAP_TEXTURE_TRANSFORM]);\r
        #endif\r
        clearcoatRoughness = texture2D(clearcoatRoughnessTexture, outUV).g * clearcoatRoughness;\r
    #endif\r
    #ifdef SHEENMAP\r
        outUV = getUV(SHEENMAP);\r
        #ifdef SHEENMAP_TEXTURE_TRANSFORM\r
            outUV = applyTransform(outUV, textureMatrices[SHEENMAP_TEXTURE_TRANSFORM]);\r
        #endif\r
        vec3 sheenColorTextureV = texture2D(sheenColorTexture, outUV).rgb;\r
        sheenColor = sheenColorTextureV * sheenColor;\r
    #endif\r
    #ifdef SHEENROUGHNESSMAP\r
        outUV = getUV(SHEENROUGHNESSMAP);\r
        #ifdef SHEENROUGHNESSMAP_TEXTURE_TRANSFORM\r
            outUV = applyTransform(outUV, textureMatrices[SHEENROUGHNESSMAP_TEXTURE_TRANSFORM]);\r
        #endif\r
    vec4 sheenRoughnessTextureV = texture2D(sheenRoughnessTexture, outUV);\r
    sheenRoughness = sheenRoughnessTextureV.a * sheenRoughness;\r
    #endif\r
    float iridescenceThickness = iridescence.z;\r
    #ifdef IRIDESCENCEMAP\r
        #ifdef IRIDESCENCEMAP_TEXTURE_TRANSFORM\r
            outUV = applyTransform(outUV, textureMatrices[IRIDESCENCEMAP_TEXTURE_TRANSFORM]);\r
        #endif\r
        iridescenceThickness = mix(iridescence.w, iridescence.z, texture2D(iridescenceThicknessTexture, outUV).g);\r
    #endif\r
    float iridescenceFactor = iridescence.y;\r
    #ifdef IRIDESCENCE_COLOR\r
        #ifdef IRIDESCENCE_COLOR_TEXTURE_TRANSFORM\r
            outUV = applyTransform(outUV, textureMatrices[IRIDESCENCE_COLOR_TEXTURE_TRANSFORM]);\r
        #endif\r
        iridescenceFactor *= texture2D(iridescenceTexture, outUV).r;\r
    #endif\r
    #ifdef TRANSMISSIONMAP\r
        #ifdef TRANSMISSIONMAP_TEXTURE_TRANSFORM\r
            outUV = applyTransform(outUV, textureMatrices[TRANSMISSIONMAP_TEXTURE_TRANSFORM]);\r
        #endif\r
        float transmissionTextureV = texture2D(transmissionTexture, outUV).r;\r
        transmission = transmissionTextureV * transmission;\r
    #endif\r
    #ifdef THICKNESSMAP\r
        #ifdef THICKNESSMAP_TEXTURE_TRANSFORM\r
            outUV = applyTransform(outUV, textureMatrices[THICKNESSMAP_TEXTURE_TRANSFORM]);\r
        #endif\r
        float thicknessTextureV = texture2D(thicknessTexture, outUV).g;\r
        thickness = thicknessTextureV * thickness;\r
    #endif\r
    #ifdef DIFFUSE_TRANSMISSION\r
        thickness *= 2.2;\r
    #endif\r
    vec3 specularMap = vec3(0);\r
    #ifdef SPECULARGLOSSINESSMAP\r
        #ifdef METALROUGHNESSMAP\r
            outUV = getUV(METALROUGHNESSMAP);\r
            #ifdef METALROUGHNESSMAP_TEXTURE_TRANSFORM\r
                outUV = applyTransform(outUV, textureMatrices[METALROUGHNESSMAP_TEXTURE_TRANSFORM]);\r
            #endif\r
            roughness = 1.0 - texture2D(metallicRoughnessTexture, outUV).a;\r
            specularMap = texture2D(metallicRoughnessTexture, outUV).rgb;\r
        #else\r
            roughness = glossinessFactor;\r
            specularMap = specularFactor;\r
        #endif\r
    #else\r
        #ifdef METALROUGHNESSMAP\r
            outUV = getUV(METALROUGHNESSMAP);\r
            #ifdef METALROUGHNESSMAP_TEXTURE_TRANSFORM\r
                outUV = applyTransform(outUV, textureMatrices[METALROUGHNESSMAP_TEXTURE_TRANSFORM]);\r
            #endif\r
            vec4 metallicRoughness = texture2D(metallicRoughnessTexture, outUV);\r
            roughness *= metallicRoughness.g;\r
            metallic *= metallicRoughness.b;\r
        #endif\r
    #endif\r
    float specularWeight = 1.0;\r
    #ifdef SPECULAR\r
        specularMap = specularColorFactor;\r
        #ifdef SPECULARCOLORMAP\r
        #ifdef SPECULARCOLORMAP_TEXTURE_TRANSFORM\r
            outUV = applyTransform(outUV, textureMatrices[SPECULARCOLORMAP_TEXTURE_TRANSFORM]);\r
        #endif\r
        specularMap *= texture2D(specularColorTexture, outUV).rgb;\r
        #endif\r
        specularWeight = specularFactor.x;\r
        #ifdef SPECULARMAP\r
        #ifdef SPECULARMAP_TEXTURE_TRANSFORM\r
            outUV = applyTransform(outUV, textureMatrices[SPECULARMAP_TEXTURE_TRANSFORM]);\r
        #endif\r
        specularWeight *= texture2D(specularTexture, outUV).a;\r
        #endif\r
    #endif\r
    vec3 F0 = mix(vec3(0.04), baseColor, metallic);\r
    #if defined(IOR) && defined(VOLUME)\r
    F0 = vec3(pow(( ior - 1.0) /  (ior + 1.0), 2.0));\r
    #endif\r
    #if defined SPECULAR\r
    F0 = mix(min(F0 * specularMap, vec3(1.0)), baseColor, metallic);\r
    #endif\r
    #if defined SPECULARGLOSSINESSMAP\r
        F0 = specularMap;\r
    #endif\r
\r
    #ifdef TANGENT\r
        #ifdef NORMALMAP\r
            outUV = getUV(NORMALMAP);\r
            #ifdef NORMALMAP_TEXTURE_TRANSFORM\r
                outUV = applyTransform(outUV, textureMatrices[NORMALMAP_TEXTURE_TRANSFORM]);\r
            #endif\r
            vec3 n = texture2D(normalTexture, outUV).rgb;\r
            n = normalize(outTBN * (2.0 * n - 1.0) * vec3(normalTextureScale, normalTextureScale, 1.0));\r
        #else\r
            vec3 n = normalize(outTBN[2].xyz);\r
        #endif\r
    #else\r
        vec3 n = normalize(outNormal);\r
    #endif\r
\r
    #ifdef TANGENT\r
    #ifdef CLEARCOATNORMALMAP\r
        outUV = getUV(CLEARCOATNORMALMAP);\r
        #ifdef CLEARCOATNORMALMAP_TEXTURE_TRANSFORM\r
            outUV = applyTransform(outUV, textureMatrices[CLEARCOATNORMALMAP_TEXTURE_TRANSFORM]);\r
        #endif\r
        vec3 clearcoatNormal = texture2D(clearcoatNormalTexture, outUV).rgb;\r
        clearcoatNormal = normalize(outTBN * (2.0 * clearcoatNormal - 1.0));\r
    #else\r
        vec3 clearcoatNormal = outTBN[2].xyz;\r
    #endif\r
    #else\r
        vec3 clearcoatNormal = outNormal;\r
    #endif\r
\r
    vec3 viewDir = normalize(viewPos - outPosition);\r
\r
    #ifdef DOUBLESIDED\r
    if (gl_FrontFacing == false) {\r
        n = -n;\r
        clearcoatNormal = -clearcoatNormal;\r
    }\r
    #endif\r
\r
    float shadow = 1.0;\r
    #ifdef SHADOWMAP\r
        vec3 l = normalize(lightPos[0] - outPosition);\r
        float shadowBias = max(0.05 * (1.0 - dot(n, l)), 0.005);\r
        shadow = 1.0 - ShadowCalculation(outPositionView, shadowBias);\r
    #endif\r
\r
    vec3 anisotropicT = vec3(0.0);\r
    vec3 anisotropicB = vec3(0.0);\r
    vec3 anisotropy = vec3(anisotropyFactor.xy, 0.0);\r
    anisotropy.yz = vec2(cos(anisotropy.y), sin(anisotropy.y));\r
    #ifdef ANISOTROPYMAP\r
        #ifdef ANISOTROPYMAP_TEXTURE_TRANSFORM\r
            outUV = applyTransform(outUV, textureMatrices[ANISOTROPYMAP_TEXTURE_TRANSFORM]);\r
        #endif\r
        vec4 anisotropyTex = texture2D(anisotropyTexture, outUV);\r
        vec2 direction = anisotropyTex.rg * 2.0 - vec2(1.0);\r
        direction = mat2(anisotropy.y, anisotropy.z, -anisotropy.z, anisotropy.y) * normalize(direction);\r
        anisotropy.x = anisotropyTex.b * anisotropyFactor.x;\r
        anisotropy.yz = direction;\r
    #endif\r
    #ifdef TANGENT\r
        anisotropicT = normalize(outTBN * vec3(anisotropy.yz, 0.0));\r
        anisotropicB = normalize(cross(n, anisotropicT));\r
    #endif\r
\r
    // clamp nan inf\r
    n = clamp(n, vec3(-1.0), vec3(1.0));\r
    clearcoatNormal = clamp(clearcoatNormal, vec3(-1.0), vec3(1.0));\r
\r
    #ifdef USE_PBR\r
        vec3 finalDiffuse = vec3(0.0);\r
        vec3 Lo = vec3(0.0);\r
\r
        #ifdef DIFFUSE_TRANSMISSION\r
        float translucencyIntensity = transmissionDiffuse;\r
        vec3 transmittance = transmittanceBRDF_Burley(tintColor, vec3(1.0), thickness);\r
        transmittance *= translucencyIntensity;\r
        vec3 f_transmission = transmittance;\r
        vec3 f_transmission2 = transmittance;\r
        #else\r
        vec3 f_transmission = cocaLambert(computeColorAtDistanceInMedia(attenuationColor.rgb, attenuationDistance), thickness) * calcTransmission(dispersionFactor, ior, baseColor, n, roughness, viewDir, transmission, thickness);\r
        #endif\r
\r
        if (isDefaultLight == 1.0) {\r
        for (int j = 0; j < 4; j++) {\r
            if (lights[j] < 0) continue;\r
            int i = lights[j];\r
            vec3 lightDir = normalize(lightPos[i].xyz - outPosition);\r
            float NdotL = saturate(dot(n, lightDir));\r
            vec3 H = normalize(viewDir + lightDir);\r
\r
            vec3 radiance = lightColor[i].xyz * lightIntensity[i].x * (1.0 / PI);\r
            float distance = length(lightPos[i].xyz - outPosition);\r
            float attenuation = 1.0 / (distance * distance);\r
            if (lightIntensity[i].w == 1.0) { // point\r
                vec3 irradiance = lightColor[i].xyz * lightIntensity[i].x * attenuation;\r
                radiance = irradiance * (1.0 / PI);\r
            }\r
            if (lightIntensity[i].w == 2.0) { // spot\r
                float lightAngleScale = 1.0 / max(0.001, cos(lightIntensity[i].y) - cos(lightIntensity[i].z));\r
                float lightAngleOffset = -cos(lightIntensity[i].z) * lightAngleScale;\r
\r
                float cd = dot(spotdir[i].xyz, lightDir);\r
                float attenuationSpot = saturate(cd * lightAngleScale + lightAngleOffset);\r
                attenuationSpot *= attenuationSpot;\r
\r
                radiance = radiance * attenuationSpot * attenuation;\r
            }\r
\r
            float NdotV = saturate(dot(n, viewDir));\r
            vec3 iridescenceF0 = vec3(0.0);\r
            #if defined IRIDESCENCE\r
            vec3 iridescenceFresnel = evalIridescence(1.0, iridescenceFactor, NdotV, iridescenceThickness, F0);\r
            iridescenceF0 = Schlick_to_F0(iridescenceFresnel, NdotV);\r
            vec3 specular = CookTorranceSpecular2(baseColor, metallic, n, H, anisotropicT, anisotropicB, roughness, viewDir, lightDir, anisotropy.x, iridescenceF0, iridescence.x, F0, specularWeight);\r
            #else\r
            vec3 specular = CookTorranceSpecular(baseColor, metallic, n, H, anisotropicT, anisotropicB, roughness, viewDir, lightDir, anisotropy.x, F0, specularWeight);\r
            #endif\r
            vec3 f_clearcoat = CookTorranceSpecular(vec3(0.0), 0.0, clearcoatNormal, H, anisotropicT, anisotropicB, clearcoatRoughness, viewDir, lightDir, anisotropy.x, F0, specularWeight);\r
            vec3 clearcoatFresnel = 1.0 - clearcoatBlendFactor * fresnelSchlick(saturate(dot(clearcoatNormal, viewDir)), vec3(0.04));\r
            #ifndef DIFFUSE_TRANSMISSION\r
            vec3 diffuse = ImprovedOrenNayarDiffuse(baseColor, metallic, n, H, roughness, viewDir, lightDir, F0, iridescenceF0, iridescence.x, specularWeight);\r
            //#ifdef CLEARCOAT\r
            diffuse *= radiance * clearcoatFresnel;\r
            //#endif\r
            #else\r
            float NdotV2 = absEps(dot(n, viewDir));\r
            float NdotL2 = absEps(dot(n, lightDir));\r
            float VdotH = absEps(dot(viewDir, H));\r
            float diffuse = diffuseBRDF_Burley(NdotL2, NdotV2, VdotH, roughness);\r
            #endif\r
            #if defined SPECULARGLOSSINESSMAP\r
                diffuse = baseColor * (1.0 - max(max(specularMap.r, specularMap.g), specularMap.b));\r
            #endif\r
            #if defined SHEEN\r
            vec3 f_sheen = NdotL * (sheenColor * sheenDistribution(sheenRoughness, n, H) * sheenVisibility(n, viewDir, lightDir, sheenRoughness));\r
            float VN = saturate(dot(viewDir, n));\r
            float LN = saturate(dot(lightDir, n));\r
            float albedoSheenScaling = min(1.0 - max3(sheenColor) * E(VN, sheenRoughness), 1.0 - max3(sheenColor) * E(LN, sheenRoughness));\r
            \r
            Lo = f_sheen + Lo * albedoSheenScaling;\r
            #endif\r
\r
            Lo += (specular * NdotL * radiance);\r
            //#ifdef CLEARCOAT\r
            Lo = Lo * clearcoatFresnel + f_clearcoat * clearcoatBlendFactor;\r
            //#endif\r
            vec3 diffuseLobe = vec3(diffuse);\r
\r
            #ifdef DIFFUSE_TRANSMISSION\r
            float trAdapt = step(0., dot(n, lightDir));\r
            float wrapNdotL = computeWrappedDiffuseNdotL(absEps(dot(n, lightDir)), 0.02);\r
            vec3 transmittanceNdotL = mix(f_transmission*wrapNdotL, vec3(wrapNdotL), trAdapt);\r
            diffuseLobe = diffuseLobe * radiance * baseColor;\r
            diffuseLobe = mix(diffuseLobe, f_transmission * transmittanceNdotL, transmissionDiffuse);\r
            transmission = 0.0;\r
            f_transmission = vec3(0.0);\r
            #else\r
            diffuseLobe *= (1.0 - transmission);\r
            #endif\r
\r
            #ifndef SCATTERING\r
            Lo += diffuseLobe;\r
            #endif\r
\r
            finalDiffuse += diffuseLobe;\r
        }\r
        }\r
\r
        vec3 ambient = vec3(0.0);\r
        vec3 ambientClearcoat = vec3(0.0);\r
        vec3 clearcoatFresnel = vec3(1.0);\r
        vec3 aSpecular;\r
        vec3 cSpecular;\r
        vec3 f_sheen = vec3(0.0);\r
        float albedoSheenScaling = 1.0;\r
        if (isIBL == 1.0) {\r
            float NdotV = saturate(dot(n, viewDir));\r
            vec3 iridescenceFresnel = evalIridescence(1.0, iridescenceFactor, NdotV, iridescenceThickness, F0);\r
            vec3 iridescenceF0 = Schlick_to_F0(iridescenceFresnel, NdotV);\r
            ambient = IBLAmbient(baseColor, metallic, n, roughness, viewDir, transmission, sheenColor, sheenRoughness, iridescenceF0, iridescence.x, F0, specularWeight, anisotropy.x, anisotropicB, f_sheen, aSpecular);\r
            float VN = saturate(dot(viewDir, n));\r
            albedoSheenScaling = 1.0 - max3(sheenColor) * E(VN, sheenRoughness);\r
            vec3 placeholder = vec3(0.0);\r
            ambientClearcoat = IBLAmbient(vec3(0.0), 0.0, clearcoatNormal, clearcoatRoughness, viewDir, transmission, sheenColor, sheenRoughness, iridescenceF0, iridescence.x, F0, specularWeight, anisotropy.x, anisotropicB, placeholder, cSpecular) * clearcoatBlendFactor;\r
            #ifdef DIFFUSE_TRANSMISSION\r
            ambient = mix(ambient, f_transmission2, transmissionDiffuse);\r
            #endif\r
            #ifndef SPHERICAL_HARMONICS\r
            #ifndef SCATTERING\r
            ambient += aSpecular;\r
            #endif\r
            ambientClearcoat += cSpecular * clearcoatBlendFactor;\r
            #endif\r
            clearcoatFresnel = (1.0 - clearcoatBlendFactor * fresnelSchlick(saturate(dot(clearcoatNormal, viewDir)), vec3(0.04)));\r
        } else {\r
            ambient = vec3(0.03) * baseColor * 0.2;\r
        }\r
\r
        vec3 emissive = emissiveFactor;\r
        #ifdef EMISSIVEMAP\r
            outUV = getUV(EMISSIVEMAP);\r
            #ifdef EMISSIVEMAP_TEXTURE_TRANSFORM\r
                outUV = applyTransform(outUV, textureMatrices[EMISSIVEMAP_TEXTURE_TRANSFORM]);\r
            #endif\r
            emissive *= texture2D(emissiveTexture, outUV).rgb;\r
        #endif\r
        emissive *= emissiveStrength;\r
\r
        #ifdef TRANSMISSION\r
            float kT = 1.0 - specEnv(n, viewDir, metallic, roughness, F0, specularWeight);\r
            f_transmission = f_transmission * kT;\r
            color = vec4((Lo) * clearcoatFresnel + ambientClearcoat, alpha);\r
            #ifndef SCATTERING\r
            color.rgb += (ambient * ao + emissive + f_transmission) * clearcoatFresnel;\r
            #endif\r
        #else\r
            color = vec4(ao * ((emissive + Lo) * clearcoatFresnel + ambientClearcoat), alpha);\r
            #ifndef SCATTERING\r
            color.rgb += ambient * ao * clearcoatFresnel;\r
            #endif\r
        #endif\r
\r
        color.rgb = f_sheen + color.rgb * albedoSheenScaling;\r
    #else\r
        n = clamp(n, vec3(0.0), vec3(1.0));\r
        vec3 lightDir = normalize(lightPos[lights[0]].xyz - outPosition);\r
        vec3 ambient = ambientStrength * lightColor[lights[0]].xyz;\r
\r
        float diff = saturate(dot(n, lightDir));\r
        vec3 diffuse = diff * lightColor[lights[0]].xyz;\r
\r
        vec3 reflectDir = reflect(-lightDir, n);\r
        float spec = pow(saturate(dot(viewDir, reflectDir)), specularPower);\r
        vec3 specular = specularStrength * spec * lightColor[lights[0]].xyz;\r
\r
        color = vec4(emissiveFactor + baseColor.rgb * (ambient + diffuse + specular) * shadow, alpha);\r
    #endif\r
\r
    #ifndef SCATTERING\r
    if (isTone == 1.0) {\r
        #ifdef SPHERICAL_HARMONICS\r
        vec3 X = max(vec3(0.0, 0.0, 0.0), color.rgb - 0.004);\r
        vec3 retColor = (X * (6.2 * X + 0.5)) / (X * (6.2 * X + 1.7) + 0.06);\r
        color.rgb = retColor * retColor;\r
        #else\r
        color.rgb = vec3(1.0) - exp(-color.rgb * exposure);\r
        color.rgb = PBRNeutralToneMapping(color.rgb);\r
        color.rgb = pow(color.rgb, vec3(1.0 / gamma));\r
        #endif\r
    }\r
    #endif\r
\r
    #ifdef SPHERICAL_HARMONICS\r
    color.rgb += aSpecular;\r
    #endif\r
\r
    // normalColor = vec4(n, 0.0);\r
\r
    #ifdef SCATTERING\r
    specColor = vec4(Lo + aSpecular, 1.0);\r
\r
    vec3 irradiance = finalDiffuse;\r
    irradiance += ambient;\r
    irradiance += f_transmission;\r
    irradiance /= sqrt(baseColor.rgb);\r
\r
    irradianceColor = vec4(clamp(irradiance, vec3(0.), vec3(1.)), 1.0);\r
    #ifdef TRANSMISSION\r
    albedoColor = vec4(sqrt(attenuationColor.rgb), 1.0);\r
    #else\r
    albedoColor = vec4(sqrt(baseColor), 1.0);\r
    #endif\r
    #else\r
    irradianceColor = vec4(0.0);\r
    albedoColor = vec4(0.0);\r
    specColor = vec4(0.0);\r
    #endif\r
}\r
`;

// src/shaders/frag.h
var frag_default = "#version 300 es\r\nprecision highp float;\r\n\r\n// #ifdef DIFFUSE_TRANSMISSION\r\n//     #define SCATTERING 1\r\n// #endif\r\n\r\n#define texture2D(p, uv) texture(p, uv)\r\n#define textureCube(p, uv) texture(p, uv)\r\n#define textureLodCube(p, uv, i) textureLod(p, uv, i)\r\n#define textureLod2D(p, uv, i) textureLod(p, uv, i)\r\n#define textureLod2D2(p, uv, i) textureLod(p, uv, i)\r\n\r\nuniform sampler2D uMaterialTex;\r\n\r\nin vec4 vColor;\r\nin vec2 outUV0;\r\nin vec2 outUV2;\r\nin vec2 outUV3;\r\nin vec3 outPosition;\r\nin vec4 outPositionView;\r\nflat in int id;\r\n#ifdef TANGENT\r\n    in mat3 outTBN;\r\n#else\r\n    in vec3 outNormal;\r\n#endif\r\n\r\nlayout (location = 0) out vec4 color;\r\nlayout (location = 1) out vec4 normalColor;\r\nlayout (location = 2) out vec4 irradianceColor;\r\nlayout (location = 3) out vec4 albedoColor;\r\nlayout (location = 4) out vec4 specColor;\r\n\r\nstruct Material {\r\n    vec4 lights;\r\n    vec4 iridescence;\r\n    vec4 diffuseTransmissionFactor;\r\n    vec4 baseColorFactor;\r\n    vec3 specularColorFactor;\r\n    vec3 emissiveFactor;\r\n    vec3 sheenColorFactor;\r\n    vec3 attenuationColorFactor; \r\n    vec3 specularFactor;\r\n    vec2 anisotropyFactor;\r\n    float glossinessFactor;\r\n    float metallicFactor;\r\n    float roughnessFactor;\r\n    float clearcoatFactor;\r\n    float clearcoatRoughnessFactor;\r\n    float sheenRoughnessFactor;\r\n    float transmissionFactor;\r\n    float ior;\r\n    float normalTextureScale;\r\n    float attenuationDistance; \r\n    float thicknessFactor;\r\n    float emissiveStrength;\r\n    float dispersionFactor;\r\n};\r\n\r\nMaterial fetchMaterial(int id) {\r\n    Material m;\r\n    int row = id;\r\n    m.baseColorFactor         = texelFetch(uMaterialTex, ivec2(3, row), 0);\r\n    m.specularFactor          = texelFetch(uMaterialTex, ivec2(8, row), 0).xyz;\r\n    m.specularColorFactor     = texelFetch(uMaterialTex, ivec2(4, row), 0).xyz;\r\n    m.emissiveFactor          = texelFetch(uMaterialTex, ivec2(5, row), 0).xyz;\r\n    m.glossinessFactor        = texelFetch(uMaterialTex, ivec2(10, row), 0).x;\r\n    m.metallicFactor          = texelFetch(uMaterialTex, ivec2(11, row), 0).x;\r\n    m.roughnessFactor         = texelFetch(uMaterialTex, ivec2(12, row), 0).x;\r\n    m.clearcoatFactor         = texelFetch(uMaterialTex, ivec2(13, row), 0).x;\r\n    m.clearcoatRoughnessFactor= texelFetch(uMaterialTex, ivec2(14, row), 0).x;\r\n    m.sheenColorFactor        = texelFetch(uMaterialTex, ivec2(6, row), 0).xyz;\r\n    m.sheenRoughnessFactor    = texelFetch(uMaterialTex, ivec2(15, row), 0).x;\r\n    m.transmissionFactor      = texelFetch(uMaterialTex, ivec2(16, row), 0).x;\r\n    m.ior                     = texelFetch(uMaterialTex, ivec2(17, row), 0).x;\r\n    m.normalTextureScale      = texelFetch(uMaterialTex, ivec2(18, row), 0).x;\r\n    m.attenuationColorFactor  = texelFetch(uMaterialTex, ivec2(7, row), 0).xyz;\r\n    m.attenuationDistance     = texelFetch(uMaterialTex, ivec2(19, row), 0).x;\r\n    m.thicknessFactor         = texelFetch(uMaterialTex, ivec2(20, row), 0).x;\r\n    m.emissiveStrength        = texelFetch(uMaterialTex, ivec2(21, row), 0).x;\r\n    m.anisotropyFactor        = texelFetch(uMaterialTex, ivec2(9, row), 0).xy;\r\n    m.iridescence             = texelFetch(uMaterialTex, ivec2(1, row), 0);\r\n    m.diffuseTransmissionFactor= texelFetch(uMaterialTex, ivec2(2, row), 0);\r\n    m.dispersionFactor        = texelFetch(uMaterialTex, ivec2(22, row), 0).x;\r\n    m.lights                  = texelFetch(uMaterialTex, ivec2(0, row), 0);\r\n    return m;\r\n}\r\n\r\nuniform Matrices2 {\r\n    mat4 view;\r\n    mat4 projection;\r\n    mat4 light;\r\n    float isShadow;\r\n};\r\nuniform LightPos {\r\n    vec4 lightPos[LIGHTNUMBER];\r\n};\r\nuniform LightColor {\r\n    vec4 lightColor[LIGHTNUMBER];\r\n};\r\nuniform Spotdir {\r\n    vec4 spotdir[LIGHTNUMBER];\r\n};\r\nuniform LightIntensity {\r\n    vec4 lightIntensity[LIGHTNUMBER];\r\n};\r\n#if defined MATRICES\r\nuniform TextureMatrices {\r\n    mat4 textureMatrices[MATRICES];\r\n};\r\n#endif\r\n#ifdef SPHERICAL_HARMONICS\r\nuniform SphericalHarmonics {\r\n    vec4 vSphericalL00;\r\n    vec4 vSphericalL1_1;\r\n    vec4 vSphericalL10;\r\n    vec4 vSphericalL11;\r\n    vec4 vSphericalL2_2;\r\n    vec4 vSphericalL2_1;\r\n    vec4 vSphericalL20;\r\n    vec4 vSphericalL21;\r\n    vec4 vSphericalL22;\r\n    mat4 rotationMatrix;\r\n};\r\n#endif\r\n\r\nuniform sampler2D baseColorTexture;\r\nuniform sampler2D metallicRoughnessTexture;\r\nuniform sampler2D normalTexture;\r\nuniform sampler2D emissiveTexture;\r\nuniform sampler2D occlusionTexture;\r\nuniform sampler2D clearcoatTexture;\r\nuniform sampler2D clearcoatRoughnessTexture;\r\nuniform sampler2D transmissionTexture;\r\nuniform sampler2D sheenColorTexture;\r\nuniform sampler2D sheenRoughnessTexture;\r\nuniform sampler2D iridescenceThicknessTexture;\r\nuniform sampler2D iridescenceTexture;\r\nuniform sampler2D clearcoatNormalTexture;\r\nuniform sampler2D specularTexture;\r\nuniform sampler2D specularColorTexture;\r\nuniform sampler2D thicknessTexture;\r\nuniform sampler2D diffuseTransmissionTexture;\r\nuniform sampler2D diffuseTransmissionColorTexture;\r\nuniform sampler2D anisotropyTexture;\r\n\r\nuniform samplerCube prefilterMap;\r\nuniform samplerCube charlieMap;\r\nuniform sampler2D brdfLUT;  \r\nuniform samplerCube irradianceMap;\r\nuniform sampler2D depthTexture;\r\nuniform sampler2D colorTexture;\r\nuniform float isTone;\r\nuniform float isIBL;\r\nuniform float isDefaultLight;\r\nuniform sampler2D Sheen_E;\r\n";

// src/shaders/vert.h
var vert_default = "#version 300 es\r\nprecision highp float;\r\n\r\nlayout (location = 0) in vec3 inPosition;\r\nlayout (location = 1) in vec3 inNormal;\r\nlayout (location = 2) in vec2 inUV;\r\nlayout (location = 4) in vec4 inJoint;\r\nlayout (location = 5) in vec4 inWeight;\r\nlayout (location = 3) in vec4 inTangent;\r\nlayout (location = 6) in vec4 inColor;\r\nlayout (location = 7) in vec2 inUV2;\r\nlayout (location = 8) in vec2 inUV3;\r\nlayout (location = 9) in float uMaterialID;\r\n\r\nuniform sampler2D uTransformTex;\r\n\r\nout vec4 vColor;\r\nout vec2 outUV0;\r\nout vec2 outUV2;\r\nout vec2 outUV3;\r\nout vec3 outPosition;\r\nout vec4 outPositionView;\r\nflat out int id;\r\n#ifdef TANGENT\r\n    out mat3 outTBN;\r\n#else\r\n    out vec3 outNormal;\r\n#endif\r\n\r\nstruct Transform {\r\n    mat4 model;\r\n};\r\nTransform fetchTransform(int id) {\r\n    Transform t;\r\n\r\n    // 8 texels across (0..7)\r\n    t.model[0] = texelFetch(uTransformTex, ivec2(0, id), 0);\r\n    t.model[1] = texelFetch(uTransformTex, ivec2(1, id), 0);\r\n    t.model[2] = texelFetch(uTransformTex, ivec2(2, id), 0);\r\n    t.model[3] = texelFetch(uTransformTex, ivec2(3, id), 0);\r\n\r\n    return t;\r\n}\r\nuniform Matrices2 {\r\n    mat4 view;\r\n    mat4 projection;\r\n    mat4 light;\r\n    float isShadow;\r\n};\r\n#ifdef JOINTNUMBER\r\nuniform Skin {\r\n    mat4 joint[JOINTNUMBER];\r\n};\r\n#endif";

// src/objects/geometry.ts
var GeometryEnum = {
  POSITION: [0, 3],
  TEXCOORD_0: [2, 2],
  NORMAL: [1, 3],
  TANGENT: [3, 4],
  JOINTS_0: [4, 4],
  WEIGHTS_0: [5, 4],
  COLOR_0: [6, 4],
  TEXCOORD_1: [7, 2],
  TEXCOORD_2: [8, 2]
};
var Geometry = class {
  UBO;
  VAO;
  uniformBuffer;
  indicesBuffer;
  attributes;
  targets;
  blend;
  uniforms;
  SKIN;
  boundingSphere;
  vertexAccessor;
  indexType;
  cubeVertexSize;
  VBO;
  indicesWebGPUBuffer;
  verticesWebGPUBuffer;
  uniformBindGroup1;
  g;
  constructor(json, arrayBuffer, weights, draco, primitive) {
    this.boundingSphere = {
      center: new Vector3(),
      radius: null,
      min: new Vector3([Infinity, Infinity, Infinity]),
      max: new Vector3([-Infinity, -Infinity, -Infinity])
    };
    this.uniformBuffer = null;
    this.UBO = null;
    this.VAO = null;
    this.blend = null;
    this.uniforms = null;
    this.SKIN = null;
    this.targets = [];
    let indicesBuffer;
    const vertexBuffers = {};
    const indicesAccessor = primitive.indices !== void 0 ? json.accessors[primitive.indices] : void 0;
    this.indexType = indicesAccessor?.componentType;
    const vertexAccessor = /* @__PURE__ */ new Map();
    for (const a in primitive.attributes) {
      vertexAccessor.set(a, json.accessors[primitive.attributes[a]]);
    }
    const boundingBox = {
      min: vertexAccessor.get("POSITION").min,
      max: vertexAccessor.get("POSITION").max
    };
    const compresedMesh = primitive.extensions && primitive.extensions.KHR_draco_mesh_compression;
    if (compresedMesh) {
      const bufferView = json.bufferViews[compresedMesh.bufferView];
      const decoder = new draco.Decoder();
      const decodedGeometry = decodeDracoData(arrayBuffer[bufferView.buffer], decoder, bufferView.byteOffset, bufferView.byteLength);
      const numFaces = decodedGeometry.num_faces();
      const numPoints = decodedGeometry.num_points();
      for (const k of vertexAccessor.keys()) {
        const attribute = decoder.GetAttributeByUniqueId(decodedGeometry, compresedMesh.attributes[k]);
        const size = getDataType(vertexAccessor.get(k).type);
        const [dracoArr, arr] = getArray(
          getGlEnum(vertexAccessor.get(k).componentType),
          numPoints * size,
          decodedGeometry,
          attribute,
          decoder
        );
        for (let i = 0; i < numPoints * size; i += size) {
          arr[i] = dracoArr.GetValue(i);
          arr[i + 1] = dracoArr.GetValue(i + 1);
          if (size > 2) {
            arr[i + 2] = dracoArr.GetValue(i + 2);
          }
          if (size > 3) {
            arr[i + 3] = dracoArr.GetValue(i + 3);
          }
        }
        draco.destroy(dracoArr);
        vertexBuffers[k] = arr;
      }
      {
        const indices = new Uint32Array(numFaces * 3);
        indices.type = "UNSIGNED_INT";
        const ia = new draco.DracoUInt32Array();
        for (let i = 0; i < numFaces; ++i) {
          decoder.GetFaceFromMesh(decodedGeometry, i, ia);
          const index = i * 3;
          indices[index] = ia.GetValue(0);
          indices[index + 1] = ia.GetValue(1);
          indices[index + 2] = ia.GetValue(2);
        }
        draco.destroy(ia);
        indicesBuffer = indices;
      }
      draco.destroy(decoder);
      draco.destroy(decodedGeometry);
    } else {
      if (indicesAccessor) {
        const bufferView = json.bufferViews[indicesAccessor.bufferView];
        indicesBuffer = buildArray(
          arrayBuffer[bufferView.buffer],
          indicesAccessor.componentType,
          calculateOffset(bufferView.byteOffset, indicesAccessor.byteOffset),
          getDataType(indicesAccessor.type) * indicesAccessor.count
        );
        if (primitive.mode === 6) {
          indicesBuffer = fanToTriListIndices(indicesBuffer);
        }
        if (primitive.mode === 2) {
          indicesBuffer = convertLineLoopToLineList(indicesBuffer);
        }
      }
      for (const k of vertexAccessor.keys()) {
        const accessor = vertexAccessor.get(k);
        const bufferView = json.bufferViews[accessor.bufferView];
        vertexBuffers[k] = buildArrayWithStride(arrayBuffer[bufferView.buffer], accessor, bufferView);
      }
    }
    if (primitive.targets) {
      for (const target of primitive.targets) {
        const vertexAcc = {};
        const accessors = {};
        for (const a in target) {
          accessors[a] = json.accessors[target[a]];
          const accessor = accessors[a];
          const bufferView = json.bufferViews[accessor.bufferView];
          vertexAcc[a] = buildArrayWithStride(arrayBuffer[bufferView.buffer], accessor, bufferView);
        }
        this.targets.push(vertexAcc);
      }
      for (const k of vertexAccessor.keys()) {
        if (this.targets[0][k]) {
          let offset = 0;
          const geometry = vertexBuffers[k];
          const GeometryCtor = geometry.constructor;
          vertexBuffers[k] = new GeometryCtor(geometry.length);
          for (let i = 0; i < vertexBuffers[k].length; i++) {
            if (k === "TANGENT" && (i + 1) % 4 === 0) {
              offset++;
              continue;
            }
            vertexBuffers[k][i] = geometry[i] + weights.reduce((a, b, index) => {
              return a + weights[index] * this.targets[index][k][i - offset];
            }, 0);
          }
        }
      }
    }
    for (const k of vertexAccessor.keys()) {
      const accessor = vertexAccessor.get(k);
      if (k === "COLOR_0" && accessor.type === "VEC3") {
        const ColorCtor = vertexBuffers[k].constructor;
        const temp = new ColorCtor(accessor.count * 4);
        let j = 0;
        for (let i = 0; i < temp.length; i++) {
          if ((i + 1) % 4 === 0) {
            temp[i] = 1;
          } else {
            temp[i] = vertexBuffers[k][j];
            j++;
          }
        }
        vertexBuffers[k] = temp;
      }
      if (accessor.sparse !== void 0) {
        const itemSize = getDataType(accessor.type);
        const indicesBufferView = json.bufferViews[accessor.sparse.indices.bufferView];
        const valuesBufferView = json.bufferViews[accessor.sparse.values.bufferView];
        const sparseIndices = buildArray(
          arrayBuffer[indicesBufferView.buffer],
          accessor.sparse.indices.componentType,
          calculateOffset(indicesBufferView.byteOffset, accessor.sparse.indices.byteOffset),
          accessor.sparse.count
        );
        const sparseValues = buildArray(
          arrayBuffer[valuesBufferView.buffer],
          accessor.componentType,
          calculateOffset(valuesBufferView.byteOffset, accessor.byteOffset),
          getDataType(accessor.type) * accessor.sparse.count
        );
        for (let i = 0, il = sparseIndices.length; i < il; i++) {
          const index = sparseIndices[i];
          vertexBuffers[k][index * itemSize] = sparseValues[i * itemSize];
          if (itemSize >= 2) {
            vertexBuffers[k][index * itemSize + 1] = sparseValues[i * itemSize + 1];
          }
          if (itemSize >= 3) {
            vertexBuffers[k][index * itemSize + 2] = sparseValues[i * itemSize + 2];
          }
          if (itemSize >= 4) {
            vertexBuffers[k][index * itemSize + 3] = sparseValues[i * itemSize + 3];
          }
        }
      }
    }
    if (vertexBuffers.NORMAL === void 0 && indicesBuffer) {
      vertexBuffers.NORMAL = calculateNormals(indicesBuffer, vertexBuffers.POSITION);
      vertexAccessor.set("NORMAL", { componentType: 5126 });
    }
    if (vertexBuffers.NORMAL === void 0 && indicesBuffer === void 0) {
      vertexBuffers.NORMAL = calculateNormals2(vertexBuffers.POSITION);
      vertexAccessor.set("NORMAL", { componentType: 5126 });
    }
    if (vertexBuffers.TEXCOORD_0 === void 0 && indicesBuffer) {
      vertexBuffers.TEXCOORD_0 = calculateUVs(vertexBuffers.POSITION, vertexBuffers.NORMAL);
      vertexAccessor.set("TEXCOORD_0", { componentType: 5126 });
    }
    if (primitive.attributes.TANGENT === void 0 && indicesBuffer) {
      vertexBuffers.TANGENT = calculateBinormals(
        indicesBuffer,
        vertexBuffers.POSITION,
        vertexBuffers.NORMAL,
        vertexBuffers.TEXCOORD_0
      );
      vertexAccessor.set("TANGENT", { componentType: 5126 });
    }
    this.vertexAccessor = vertexAccessor;
    this.attributes = vertexBuffers;
    this.indicesBuffer = indicesBuffer;
    const { min, max } = boundingBox;
    this.boundingSphere._min = new Vector3(min);
    this.boundingSphere._max = new Vector3(max);
  }
  compose(order) {
    let total = 13;
    const count = this.attributes["POSITION"].length / 3;
    const g = new Float32Array(
      count + count * 3 + count * 2 + count * 3 + count * 4 + (this.attributes["JOINTS_0"]?.length ?? 0) + (this.attributes["WEIGHTS_0"]?.length ?? 0) + (this.attributes["COLOR_0"]?.length ?? 0) + (this.attributes["TEXCOORD_1"]?.length ?? 0) + (this.attributes["TEXCOORD_2"]?.length ?? 0)
    );
    if (this.attributes["WEIGHTS_0"]) {
      total += 8;
    }
    if (this.attributes["COLOR_0"]) {
      total += 4;
    }
    if (this.attributes["TEXCOORD_1"]) {
      total += 2;
    }
    if (this.attributes["TEXCOORD_2"]) {
      total += 2;
    }
    let k = 0;
    let l = 0;
    let m = 0;
    this.attributes["NORMAL"] = toFloat32Normalized(this.attributes["NORMAL"]);
    if (this.attributes["COLOR_0"]) {
      this.attributes["COLOR_0"] = toFloat32Normalized(this.attributes["COLOR_0"]);
    }
    for (let i = 0; i < g.length; i += total) {
      let j = 12;
      g[i] = this.attributes["POSITION"][k];
      g[i + 1] = this.attributes["POSITION"][k + 1];
      g[i + 2] = this.attributes["POSITION"][k + 2];
      if (this.attributes["TEXCOORD_0"]) {
        g[i + 3] = this.attributes["TEXCOORD_0"][l];
        g[i + 4] = this.attributes["TEXCOORD_0"][l + 1];
      }
      g[i + 5] = this.attributes["NORMAL"][k];
      g[i + 6] = this.attributes["NORMAL"][k + 1];
      g[i + 7] = this.attributes["NORMAL"][k + 2];
      if (this.attributes["TANGENT"]) {
        g[i + 8] = this.attributes["TANGENT"][m];
        g[i + 9] = this.attributes["TANGENT"][m + 1];
        g[i + 10] = this.attributes["TANGENT"][m + 2];
        g[i + 11] = this.attributes["TANGENT"][m + 3];
      }
      if (this.attributes["WEIGHTS_0"]) {
        g[i + 12] = this.attributes["JOINTS_0"][m];
        g[i + 13] = this.attributes["JOINTS_0"][m + 1];
        g[i + 14] = this.attributes["JOINTS_0"][m + 2];
        g[i + 15] = this.attributes["JOINTS_0"][m + 3];
        g[i + 16] = this.attributes["WEIGHTS_0"][m];
        g[i + 17] = this.attributes["WEIGHTS_0"][m + 1];
        g[i + 18] = this.attributes["WEIGHTS_0"][m + 2];
        g[i + 19] = this.attributes["WEIGHTS_0"][m + 3];
        j += 8;
      }
      if (this.attributes["COLOR_0"]) {
        g[i + 12] = this.attributes["COLOR_0"][m];
        g[i + 13] = this.attributes["COLOR_0"][m + 1];
        g[i + 14] = this.attributes["COLOR_0"][m + 2];
        g[i + 15] = this.attributes["COLOR_0"][m + 3];
        j += 4;
      }
      if (this.attributes["TEXCOORD_1"]) {
        g[i + 12] = this.attributes["TEXCOORD_1"][l];
        g[i + 13] = this.attributes["TEXCOORD_1"][l + 1];
        j += 2;
      }
      if (this.attributes["TEXCOORD_2"]) {
        g[i + 14] = this.attributes["TEXCOORD_2"][l];
        g[i + 15] = this.attributes["TEXCOORD_2"][l + 1];
        j += 2;
      }
      g[i + j] = order;
      k += 3;
      l += 2;
      m += 4;
    }
    this.g = g;
  }
  createGeometryForWebGPU(WebGPU, order) {
    const { device } = WebGPU;
    this.compose(order);
    const verticesBuffer = device.createBuffer({
      size: this.g.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true
    });
    new Float32Array(verticesBuffer.getMappedRange()).set(this.g);
    verticesBuffer.unmap();
    this.verticesWebGPUBuffer = verticesBuffer;
    if (this.indicesBuffer) {
      this.indicesBuffer = new Uint32Array(this.indicesBuffer);
      const indicesBuffer = device.createBuffer({
        size: this.indicesBuffer.byteLength,
        usage: GPUBufferUsage.INDEX,
        mappedAtCreation: true
      });
      new Uint32Array(indicesBuffer.getMappedRange()).set(this.indicesBuffer);
      indicesBuffer.unmap();
      this.indicesWebGPUBuffer = indicesBuffer;
    }
  }
  createGeometryForWebGl(gl2, defines, order) {
    const VAO = gl2.createVertexArray();
    gl2.bindVertexArray(VAO);
    this.compose(order);
    const VBO = gl2.createBuffer();
    gl2.bindBuffer(gl2.ARRAY_BUFFER, VBO);
    gl2.bufferData(gl2.ARRAY_BUFFER, this.g, gl2.STATIC_DRAW);
    this.VBO = VBO;
    const vertexLayout = [3, 2, 3, 4];
    if (defines.find((d) => d.name === "JOINTNUMBER")) {
      vertexLayout.push(4, 4);
    }
    if (defines.find((d) => d.name === "COLOR")) {
      vertexLayout.push(4);
    }
    if (defines.find((d) => d.name === "MULTIUV")) {
      vertexLayout.push(2);
    }
    if (this.attributes["TEXCOORD_2"]) {
      vertexLayout.push(2);
    }
    vertexLayout.push(1);
    const cubeVertexSize = Float32Array.BYTES_PER_ELEMENT * vertexLayout.reduce((a, b) => a + b, 0);
    this.cubeVertexSize = cubeVertexSize;
    let offset = 0;
    for (const k in GeometryEnum) {
      if (k in this.attributes || k === "TANGENT" || k === "TEXCOORD_0") {
        const index = GeometryEnum[k];
        gl2.enableVertexAttribArray(index[0]);
        gl2.vertexAttribPointer(index[0], index[1], gl2.FLOAT, false, cubeVertexSize, Float32Array.BYTES_PER_ELEMENT * offset);
        offset += index[1];
      }
    }
    gl2.enableVertexAttribArray(9);
    gl2.vertexAttribPointer(9, 1, gl2.FLOAT, false, cubeVertexSize, Float32Array.BYTES_PER_ELEMENT * offset);
    if (this.indicesBuffer) {
      const VBO2 = gl2.createBuffer();
      gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, VBO2);
      gl2.bufferData(gl2.ELEMENT_ARRAY_BUFFER, this.indicesBuffer, gl2.STATIC_DRAW);
    }
    this.VAO = VAO;
    gl2.bindVertexArray(null);
  }
  calculateBounding(matrix) {
    const box = new Box();
    const min = new Vector3(this.boundingSphere._min.elements).applyMatrix4(matrix);
    const max = new Vector3(this.boundingSphere._max.elements).applyMatrix4(matrix);
    box.expand({ min, max });
    box.expand(this.boundingSphere);
    this.boundingSphere.min = box.min;
    this.boundingSphere.max = box.max;
    const vertices = this.attributes.POSITION;
    let maxRadiusSq = 0;
    this.boundingSphere.center.add(this.boundingSphere.min).add(this.boundingSphere.max).scale(0.5);
    for (let i = 0; i < vertices.length; i = i + 3) {
      maxRadiusSq = Math.max(
        maxRadiusSq,
        this.boundingSphere.center.distanceToSquared(vertices[i], vertices[i + 1], vertices[i + 2])
      );
    }
    this.boundingSphere.radius = Math.sqrt(maxRadiusSq);
  }
  createUniforms(matrixWorld) {
    const uniformBuffer = new UniformBuffer();
    uniformBuffer.add("model", matrixWorld.elements);
    uniformBuffer.done();
    this.uniformBuffer = uniformBuffer;
  }
  updateUniformsWebGPU(WebGPU, buffer, usage = GPUBufferUsage.UNIFORM) {
    const matrixSize = buffer.store.byteLength;
    const offset = 256;
    const uniformBufferSize = offset + matrixSize;
    const { device } = WebGPU;
    const uniformBuffer = device.createBuffer({
      size: uniformBufferSize,
      usage: usage | GPUBufferUsage.COPY_DST
    });
    buffer.bufferWebGPU = uniformBuffer;
    const uniformBindGroup1 = [
      {
        binding: 0,
        resource: uniformBuffer
      }
    ];
    device.queue.writeBuffer(uniformBuffer, 0, buffer.store.buffer, buffer.store.byteOffset, buffer.store.byteLength);
    return uniformBindGroup1;
  }
  updateUniformsWebGl(gl2, program) {
    const uIndex2 = gl2.getUniformBlockIndex(program, "Matrices2");
    gl2.uniformBlockBinding(program, uIndex2, 1);
  }
  async updateWebGPU(WebGPU, geometry) {
    const { device } = WebGPU;
    let total = 12;
    if (this.attributes["COLOR_0"]) {
      total += 4;
    }
    if (this.attributes["TEXCOORD_1"]) {
      total += 2;
    }
    let k = 0;
    let l = 0;
    let m = 0;
    const g = this.g;
    for (let i = 0; i < g.length; i += total) {
      if (geometry["POSITION"]) {
        g[i] = geometry["POSITION"][k];
        g[i + 1] = geometry["POSITION"][k + 1];
        g[i + 2] = geometry["POSITION"][k + 2];
      }
      if (geometry["TEXCOORD_0"]) {
        g[i + 3] = geometry["TEXCOORD_0"][l];
        g[i + 4] = geometry["TEXCOORD_0"][l + 1];
      }
      if (geometry["NORMAL"]) {
        g[i + 5] = geometry["NORMAL"][k];
        g[i + 6] = geometry["NORMAL"][k + 1];
        g[i + 7] = geometry["NORMAL"][k + 2];
      }
      if (geometry["TANGENT"]) {
        g[i + 8] = geometry["TANGENT"][m];
        g[i + 9] = geometry["TANGENT"][m + 1];
        g[i + 10] = geometry["TANGENT"][m + 2];
        g[i + 11] = geometry["TANGENT"][m + 3];
      }
      k += 3;
      l += 2;
      m += 4;
    }
    device.queue.writeBuffer(this.verticesWebGPUBuffer, 0, g.buffer, g.byteOffset, g.byteLength);
  }
  update(gl2, geometry) {
    gl2.bindVertexArray(this.VAO);
    let total = 13;
    if (this.attributes["COLOR_0"]) {
      total += 4;
    }
    if (this.attributes["TEXCOORD_1"]) {
      total += 2;
    }
    let k = 0;
    let l = 0;
    let m = 0;
    const g = this.g;
    for (let i = 0; i < g.length; i += total) {
      if (geometry["POSITION"]) {
        g[i] = geometry["POSITION"][k];
        g[i + 1] = geometry["POSITION"][k + 1];
        g[i + 2] = geometry["POSITION"][k + 2];
      }
      if (geometry["TEXCOORD_0"]) {
        g[i + 3] = geometry["TEXCOORD_0"][l];
        g[i + 4] = geometry["TEXCOORD_0"][l + 1];
      }
      if (geometry["NORMAL"]) {
        g[i + 5] = geometry["NORMAL"][k];
        g[i + 6] = geometry["NORMAL"][k + 1];
        g[i + 7] = geometry["NORMAL"][k + 2];
      }
      if (geometry["TANGENT"]) {
        g[i + 8] = geometry["TANGENT"][m];
        g[i + 9] = geometry["TANGENT"][m + 1];
        g[i + 10] = geometry["TANGENT"][m + 2];
        g[i + 11] = geometry["TANGENT"][m + 3];
      }
      k += 3;
      l += 2;
      m += 4;
    }
    gl2.bindBuffer(gl2.ARRAY_BUFFER, this.VBO);
    gl2.bufferData(gl2.ARRAY_BUFFER, g, gl2.STATIC_DRAW);
    gl2.bindVertexArray(null);
  }
};

// src/parse.ts
var gl;
var BASE64_MARKER = ";base64,";
var Parse = class {
  tracks;
  url;
  host;
  skins;
  textures;
  images;
  samplers;
  arrayBuffer;
  cameras;
  lights;
  programs;
  scene;
  camera;
  light;
  aspect;
  zoom;
  canvas;
  resize;
  json;
  defines;
  draco;
  constructor(url, defines, resize) {
    this.url = url;
    this.host = url.substr(0, url.lastIndexOf("/") + 1);
    this.tracks = [];
    this.skins = [];
    this.textures = null;
    this.images = /* @__PURE__ */ new Map();
    this.samplers = null;
    this.arrayBuffer = null;
    this.cameras = [];
    this.lights = [];
    this.programs = {};
    this.defines = defines;
    this.resize = resize;
  }
  setScene(scene) {
    this.scene = scene;
  }
  setGl(g) {
    gl = g;
  }
  setCamera(camera) {
    this.camera = camera;
  }
  setLight(light) {
    this.light = light;
  }
  setCanvas(canvas) {
    this.canvas = canvas;
  }
  getBuffer() {
    return Promise.all(
      this.scene.bin.map((url) => {
        if (typeof url === "string") {
          if (/base64/.test(url)) {
            const base64Index = url.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
            const base64 = url.substring(base64Index);
            const raw = window.atob(base64);
            const buffer = new ArrayBuffer(raw.length);
            const array = new Uint8Array(buffer);
            for (let i = 0; i < raw.length; i++) {
              array[i] = raw.charCodeAt(i);
            }
            return buffer;
          } else {
            return fetchBinary(`${this.host}${url}`);
          }
        } else {
          return Promise.resolve(url);
        }
      })
    ).then((buffers) => {
      this.arrayBuffer = buffers;
    });
  }
  createProgram(defines) {
    let program;
    const programHash = defines.map((define2) => `${define2.name}${define2.value ?? 1}`).join("");
    if (this.programs[programHash]) {
      program = this.programs[programHash];
    } else {
      const defineStr = defines.map((define2) => `#define ${define2.name} ${define2.value ?? 1}
`).join("");
      const shaders = [vertex_default, fragment_default].map(
        (p) => p.replace(/#include ".*/g, (str) => {
          const [, subPath] = str.split('"');
          if (subPath.includes("vert")) {
            return vert_default;
          } else {
            return frag_default;
          }
        })
      ).map((p) => p.replace(/\n/, `
${defineStr}`));
      this.programs[programHash] = createProgram(gl, shaders[0], shaders[1]);
      program = this.programs[programHash];
    }
    return program;
  }
  buildPrim(el, parent, name, skin, weights, primitive) {
    const m = this.json.materials && this.json.materials[primitive.material];
    if (this.json.extensions && this.json.extensions.EXT_lights_image_based) {
      this.defines.push({
        name: "SPHERICAL_HARMONICS",
        value: Math.ceil(Math.log(this.json.extensions.EXT_lights_image_based.lights[0].specularImageSize) * Math.LOG2E) + 10
      });
    }
    if (this.json.extensionsUsed && this.json.extensionsUsed.includes("KHR_texture_basisu")) {
      this.defines.push({ name: "BASISU" });
    }
    const defines = [...this.defines];
    const material = new Material2(m, this.textures, defines);
    if (skin !== void 0) {
      defines.push({
        name: "JOINTNUMBER",
        value: this.skins[skin].jointNames.length
      });
    }
    if (primitive.indices !== void 0 || primitive.attributes["TANGENT"] !== void 0) {
      defines.push({ name: "TANGENT" });
    }
    if (primitive.attributes["TEXCOORD_1"] !== void 0 || primitive.attributes["TEXCOORD_2"] !== void 0) {
      defines.push({ name: "MULTIUV" });
    }
    if (primitive.attributes["TEXCOORD_2"] !== void 0) {
      defines.push({ name: "MULTIUV2" });
    }
    if (primitive.attributes["COLOR_0"]) {
      defines.push({ name: "COLOR" });
    }
    const mesh = skin !== void 0 ? new SkinnedMesh(name, parent) : new Mesh(name, parent);
    const geometry = new Geometry(this.json, this.arrayBuffer, weights, this.draco, primitive);
    if (primitive.attributes.TANGENT === void 0) {
      defines.push({ name: "USERIGHTHANDEDSYSTEM" });
    }
    if (primitive.extensions && primitive.extensions.KHR_materials_variants) {
      const variants = primitive.extensions.KHR_materials_variants.mappings.map((m2) => {
        return { ...m2, m: new Material2(this.json.materials[m2.material], this.textures, [...defines]) };
      });
      mesh.setVariants(variants);
    }
    mesh.setMode(primitive.mode);
    mesh.setMaterial(material);
    mesh.setGeometry(geometry);
    if (el.scale && el.scale[0] < 0) {
      mesh.setFrontFace();
    }
    if (el.scale && material.thicknessFactor) {
      material.thicknessFactor *= el.scale[0];
    }
    mesh.setDefines(material.defines);
    if (mesh instanceof SkinnedMesh) {
      mesh.skin = skin;
    }
    mesh.matrices = parent.matrices;
    mesh.updateMatrix();
    mesh.calculateBounding();
    mesh.visible = parent.visible;
    mesh.instances = parent.instances;
    return mesh;
  }
  buildNode(parent, name) {
    const el = this.json.nodes[name];
    let child;
    if (el.camera !== void 0) {
      const camera = Object.assign(
        {
          zoom: 1,
          isInitial: false,
          aspect: this.canvas ? this.canvas.offsetWidth / this.canvas.offsetHeight : 1
        },
        this.json.cameras[el.camera]
      );
      const camObj = new Camera(camera, name, parent);
      const proj = calculateProjection(camObj.props);
      camObj.setProjection(proj);
      this.cameras.push(camObj);
      child = camObj;
    } else if (el.extensions && el.extensions.KHR_lights_punctual) {
      if (this.lights.find((l) => l.id === el.name)) {
        return;
      }
      const light = this.json.extensions.KHR_lights_punctual.lights[el.extensions.KHR_lights_punctual.light];
      light.isInitial = false;
      const lightObj = new Light(light, name, parent);
      this.lights.push(lightObj);
      child = lightObj;
    } else {
      if (el.isBone !== void 0) {
        child = new Bone(name, parent);
      } else {
        child = new Object3D(name, parent);
      }
    }
    if (el.translation || el.rotation || el.scale) {
      child.setPosition(el.translation, el.rotation, el.scale);
    } else if (el.matrix) {
      child.setMatrix(el.matrix);
    }
    child.updateMatrix();
    child.visible = parent.visible;
    if (el.extensions && el.extensions.KHR_node_visibility) {
      child.visible = el.extensions.KHR_node_visibility.visible;
    }
    if (el.extensions && el.extensions.EXT_mesh_gpu_instancing) {
      const { attributes } = el.extensions.EXT_mesh_gpu_instancing;
      const keys = ["ROTATION", "SCALE", "TRANSLATION"];
      for (const key of keys) {
        if (!attributes[key]) {
          continue;
        }
        const stride = key === "ROTATION" ? 4 : 3;
        const accessor = this.json.accessors[attributes[key]];
        const bufferView = this.json.bufferViews[accessor.bufferView];
        const buffer = buildArray(
          this.arrayBuffer[bufferView.buffer],
          accessor.componentType,
          calculateOffset(bufferView.byteOffset, accessor.byteOffset),
          getDataType(accessor.type) * accessor.count
        );
        if (child.instances === 1) {
          child.instances = buffer.length / stride;
          child.matrices = Array.from({ length: child.instances });
          for (let i = 0; i < child.instances; i++) {
            child.matrices[i] = new Matrix4();
          }
        }
        for (let i = 0; i < buffer.length; i += stride) {
          const m = child.matrices[i / stride];
          if (key === "ROTATION") {
            m.makeRotationFromQuaternion([buffer[i], buffer[i + 1], buffer[i + 2], buffer[i + 3]]);
          } else if (key === "SCALE") {
            m.scale(new Vector3([buffer[i], buffer[i + 1], buffer[i + 2]]));
          } else if (key === "TRANSLATION") {
            m.setTranslate(new Vector3([buffer[i], buffer[i + 1], buffer[i + 2]]));
          }
        }
      }
    }
    child.id = el.name;
    parent.children.push(child);
    parent = child;
    if (el.mesh !== void 0) {
      parent.children.push(
        ...this.json.meshes[el.mesh].primitives.map(
          this.buildPrim.bind(this, el, parent, this.json.meshes[el.mesh].name, el.skin, this.json.meshes[el.mesh].weights)
        )
      );
    }
    if (el.children && el.children.length) {
      el.children.forEach(this.buildNode.bind(this, parent));
    }
  }
  calculateFov(isInitial) {
    const box = new Box();
    walk(this.scene, (node) => {
      if (node instanceof Mesh) {
        box.expand(node.geometry.boundingSphere);
      }
    });
    const size = box.getSize();
    if (isInitial) {
      const center = new Vector3().add(box.min).add(box.max).scale(0.5);
      const matrix = new Matrix4();
      matrix.translate(center.x, center.y, center.z);
      matrix.invert();
      this.scene.matrixWorld.multiply(matrix);
      walk(this.scene, (node) => {
        if (node instanceof Object3D) {
          node.updateMatrix();
        }
      });
    }
    this.cameras.forEach((c) => {
      c.modelSize = size;
    });
    this.resize();
  }
  async buildMesh() {
    if (this.json.extensionsUsed && this.json.extensionsUsed.includes("KHR_draco_mesh_compression")) {
      this.draco = await DecoderModule();
    }
    if (this.json.extensions && this.json.extensions.KHR_materials_variants) {
      this.scene.variants = this.json.extensions.KHR_materials_variants.variants;
    }
    this.json.scenes[this.json.scene !== void 0 ? this.json.scene : 0].nodes.forEach((n) => {
      if (this.json.nodes[n].extensions !== void 0) {
        this.buildNode(this.scene, n);
      }
      if (this.json.nodes[n].children && this.json.nodes[n].children.length) {
        this.buildNode(this.scene, n);
      }
      if (this.json.nodes[n].mesh !== void 0) {
        this.buildNode(this.scene, n);
      }
      if (this.json.nodes[n].camera !== void 0) {
        this.buildNode(this.scene, n);
      }
    });
    if (this.lights.length === 0 && this.light) {
      this.lights.push(this.light);
    }
    walk(this.scene, (mesh) => {
      if (mesh instanceof Mesh) {
        if (mesh.material.alpha) {
          this.scene.transparentChildren.push(mesh);
        } else {
          this.scene.opaqueChildren.push(mesh);
        }
        this.scene.meshes.push(mesh);
        mesh.material.defines.push({ name: "LIGHTNUMBER", value: this.lights.length });
        this.lights.forEach((light, i) => {
          if (light.visible) {
            if (light.type === "directional") {
              mesh.material.lights[mesh.material.lights.findIndex((l) => l === -1)] = i;
            } else {
              const p = mesh.getPosition();
              const distance = new Vector3(light.getPosition()).distanceToSquared(p[0], p[1], p[2]);
              const attenuation = Math.max(Math.min(1 - Math.pow(distance / light.range, 4), 1), 0) / Math.pow(distance, 2);
              if (attenuation > 0) {
                mesh.material.lights[mesh.material.lights.findIndex((l) => l === -1)] = i;
              }
            }
          }
        });
      }
    });
    this.scene.meshes.forEach((m) => {
      if (m.material.lights[0] === -1) {
        m.material.lights[0] = 0;
      }
    });
    this.scene.opaqueChildren.sort((a, b) => a.distance - b.distance);
    this.scene.transparentChildren.sort((a, b) => a.distance - b.distance);
  }
  buildAnimation() {
    if (!this.json.animations) {
      return true;
    }
    for (const animation of this.json.animations) {
      const tracks = [];
      for (const channel of animation.channels) {
        const duration = 0;
        const sampler = animation.samplers[channel.sampler];
        if (sampler) {
          const { target } = channel;
          let name = target.node;
          let { path } = target;
          if (name === void 0) {
            const s = target.extensions.KHR_animation_pointer.pointer.split("/");
            if (s[1] === "materials") {
              const mat = this.json.materials[Number(s[2])].name;
              ({ name } = this.scene.meshes.find((m) => m.material.name === mat));
              path = s.splice(3).join("/");
            }
            if (s[1] === "nodes") {
              ({ name } = this.json.nodes[Number(s[2])]);
              path = s[5];
            }
          }
          const input = animation.parameters !== void 0 ? animation.parameters[sampler.input] : sampler.input;
          const output = animation.parameters !== void 0 ? animation.parameters[sampler.output] : sampler.output;
          const inputAccessor = this.json.accessors[input];
          const outputAccessor = this.json.accessors[output];
          const inputBuffer = this.json.bufferViews[inputAccessor.bufferView];
          const outputBuffer = this.json.bufferViews[outputAccessor.bufferView];
          const inputArray = buildArray(
            this.arrayBuffer[inputBuffer.buffer],
            inputAccessor.componentType,
            calculateOffset(inputBuffer.byteOffset, inputAccessor.byteOffset),
            getDataType(inputAccessor.type) * inputAccessor.count
          );
          const outputArray = buildArray(
            this.arrayBuffer[outputBuffer.buffer],
            outputAccessor.componentType,
            calculateOffset(outputBuffer.byteOffset, outputAccessor.byteOffset),
            getDataType(outputAccessor.type) * outputAccessor.count
          );
          const meshes = [];
          walk(this.scene, (node) => {
            if (node.name === name || node.id === name) {
              if (path === "weights" && node instanceof Object3D) {
                meshes.push(...node.children);
              } else {
                meshes.push(node);
              }
            }
          });
          let component = path === "weights" ? meshes[0].geometry.targets.length : getDataType(outputAccessor.type);
          if (sampler.interpolation === "CUBICSPLINE") {
            component = component * 3;
          }
          const keys = [];
          for (let i = 0; i < inputArray.length; i++) {
            const firstT = inputArray[i];
            const firstV = outputArray.slice(i * component, (i + 1) * component);
            keys.push({
              time: firstT,
              value: normalize(firstV)
            });
          }
          if (keys.length >= 2) {
            if (meshes.length) {
              tracks.push({
                duration: Math.max(keys[keys.length - 1].time, duration),
                stoped: false,
                meshes,
                component,
                type: path,
                name: `${meshes[0].name}.${path}`,
                keys,
                interpolation: sampler.interpolation
              });
            }
          }
        }
      }
      this.tracks.push(tracks);
    }
  }
  buildSkin() {
    if (!this.json.skins) {
      return true;
    }
    for (const skin of this.json.skins) {
      const acc = this.json.accessors[skin.inverseBindMatrices];
      const buffer = this.json.bufferViews[acc.bufferView];
      const array = buildArray(
        this.arrayBuffer[buffer.buffer],
        acc.componentType,
        calculateOffset(buffer.byteOffset, acc.byteOffset),
        getDataType(acc.type) * acc.count
      );
      const v = {
        jointNames: skin.joints,
        inverseBindMatrices: array,
        bones: [],
        boneInverses: []
      };
      let i = 0;
      for (const join of v.jointNames) {
        this.json.nodes[join].isBone = true;
        const m = v.inverseBindMatrices;
        const mat = new Matrix4().set(m.slice(i * 16, (i + 1) * 16));
        v.boneInverses.push(mat);
        i++;
      }
      this.skins.push(v);
    }
  }
  getJson() {
    if (/glb/.test(this.url)) {
      return fetchBinary(this.url).then((b) => {
        const decoder = new TextDecoder("utf-8");
        const [jsonLength] = new Uint32Array(b, 12, 1);
        const jsonBuffer = new Uint8Array(b, 20, jsonLength);
        const json = JSON.parse(decoder.decode(jsonBuffer));
        const [bufferLength] = new Uint32Array(b, 20 + jsonLength, 1);
        const buffer = b.slice(28 + jsonLength, 28 + jsonLength + bufferLength);
        this.json = json;
        this.scene.bin.push(buffer);
      });
    } else {
      return fetchJSON(this.url).then((json) => {
        for (const key in json.buffers) {
          this.scene.bin.push(json.buffers[Number(key)].uri);
        }
        this.json = json;
        return true;
      });
    }
  }
  createSamplers() {
    const webglGl = gl;
    const samplers = this.json.samplers || [{}];
    this.samplers = samplers.map((s) => {
      const sampler = webglGl.createSampler();
      webglGl.samplerParameteri(sampler, webglGl.TEXTURE_MIN_FILTER, s.minFilter || webglGl.LINEAR_MIPMAP_LINEAR);
      webglGl.samplerParameteri(sampler, webglGl.TEXTURE_MAG_FILTER, s.magFilter || webglGl.LINEAR);
      webglGl.samplerParameteri(sampler, webglGl.TEXTURE_WRAP_S, s.wrapS || webglGl.REPEAT);
      webglGl.samplerParameteri(sampler, webglGl.TEXTURE_WRAP_T, s.wrapT || webglGl.REPEAT);
      return sampler;
    });
  }
  createSamplersWebGPU(WebGPU) {
    function getSamplerParam(value) {
      const map = {
        9987: "linear",
        9729: "linear",
        9986: "nearest",
        9728: "nearest",
        10497: "repeat",
        33648: "mirror-repeat",
        33071: "clamp-to-edge"
      };
      return value === void 0 ? void 0 : map[value];
    }
    const samplers = this.json.samplers || [{}];
    this.samplers = samplers.map((s) => {
      const sampler = WebGPU.device.createSampler({
        mipmapFilter: "linear",
        magFilter: getSamplerParam(s.magFilter) || "linear",
        minFilter: getSamplerParam(s.minFilter) || "linear",
        addressModeU: getSamplerParam(s.wrapS) || "repeat",
        addressModeV: getSamplerParam(s.wrapT) || "repeat",
        addressModeW: getSamplerParam(s.wrapS) || "repeat"
      });
      sampler.id = (getSamplerParam(s.minFilter) || "linear") + (getSamplerParam(s.magFilter) || "linear");
      return sampler;
    });
  }
  createTexturesWebGPU(WebGPU) {
    this.createTextures(
      (t, textureType) => this.handleTextureLoadedWebGPU(
        WebGPU,
        t,
        textureType
      )
    );
  }
  createTexturesWebGL() {
    this.createTextures(
      (t) => this.handleTextureLoaded(
        t
      )
    );
  }
  createTextures(callback) {
    this.scene.meshes.forEach((mesh) => {
      const materials = [mesh.material, ...mesh.variants.map((m) => m.m)];
      const textureTypes = [
        "baseColorTexture",
        "metallicRoughnessTexture",
        "emissiveTexture",
        "normalTexture",
        "occlusionTexture",
        "clearcoatTexture",
        "clearcoatRoughnessTexture",
        "clearcoatNormalTexture",
        "sheenColorTexture",
        "sheenRoughnessTexture",
        "transmissionTexture",
        "specularTexture",
        "specularColorTexture",
        "thicknessTexture",
        "iridescenceThicknessTexture",
        "iridescenceTexture",
        "diffuseTransmissionTexture",
        "diffuseTransmissionColorTexture",
        "anisotropyTexture"
      ];
      const textureSRGB = [
        "baseColorTexture",
        "sheenColorTexture",
        "emissiveTexture",
        "diffuseTransmissionColorTexture",
        mesh.defines.find((d) => d.name === "SPECULARGLOSSINESSMAP") && "metallicRoughnessTexture"
      ];
      for (let i = 0; i < textureTypes.length; i++) {
        for (const material of materials) {
          const textureType = textureTypes[i];
          const t = material[textureType];
          if (!t) {
            continue;
          }
          if (textureSRGB.find((name) => name === textureType)) {
            t.srgb = true;
          }
          material[textureType] = callback(t, textureType);
        }
      }
    });
  }
  async initTextures(isbitmap) {
    if (!this.json.textures) {
      return true;
    }
    const texturesMap = {};
    let hasBasisu = false;
    this.json.textures.forEach((t) => {
      if (t.extensions && t.extensions.KHR_texture_basisu) {
        hasBasisu = true;
      }
      let source = t.extensions && t.extensions.KHR_texture_basisu ? t.extensions.KHR_texture_basisu.source : t.source;
      source = t.extensions && t.extensions.EXT_texture_webp ? t.extensions.EXT_texture_webp.source : source;
      const name = String(t.sampler) + String(source);
      texturesMap[name] = t;
      texturesMap[name].name = name;
      t.name = name;
    });
    if (hasBasisu) {
      await Promise.resolve().then(() => (init_libktx(), libktx_exports));
      globalThis.LIBKTX({ preinitializedWebGLContext: gl }).then((module2) => {
        const transcoderConfig = gl.device ? {
          astcSupported: gl.features.has("texture-compression-astc"),
          etc1Supported: gl.features.has("texture-compression-etc2"),
          etc2Supported: gl.features.has("texture-compression-etc2"),
          bptcSupported: gl.features.has("texture-compression-bc"),
          dxtSupported: false,
          pvrtcSupported: false
        } : {
          astcSupported: gl.getExtension("WEBGL_compressed_texture_astc"),
          etc1Supported: gl.getExtension("WEBGL_compressed_texture_etc1"),
          etc2Supported: gl.getExtension("WEBGL_compressed_texture_etc"),
          dxtSupported: gl.getExtension("WEBGL_compressed_texture_s3tc"),
          bptcSupported: gl.getExtension("EXT_texture_compression_bptc"),
          pvrtcSupported: gl.getExtension("WEBGL_compressed_texture_pvrtc") || gl.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc")
        };
        window.LIBKTX = module2;
        window.LIBKTX.transcoderConfig = transcoderConfig;
        window.LIBKTX.GL.makeContextCurrent(window.LIBKTX.GL.registerContext(gl, { majorVersion: 2 }));
      });
      await new Promise((resolve) => setTimeout(resolve, 1e3));
    }
    const promiseArr = Object.values(texturesMap).map((t) => {
      let s = t.extensions && t.extensions.KHR_texture_basisu ? t.extensions.KHR_texture_basisu.source : t.source;
      s = t.extensions && t.extensions.EXT_texture_webp ? t.extensions.EXT_texture_webp.source : s;
      const source = this.json.images[s];
      return fetchImage(
        isbitmap,
        this,
        source,
        {
          url: `${this.host}${source.uri}`,
          name: t.name
        },
        t.sampler
      );
    });
    return Promise.all(promiseArr).then((textures) => {
      this.textures = this.json.textures.map((t) => {
        return textures.find((j) => j.name === t.name);
      });
      return true;
    });
  }
  handleTextureLoadedWebGPU(WebGPU, { image: bitmap, sampler, srgb, name }, textureType) {
    if (this.images.get(name)) {
      return this.images.get(name);
    }
    const { device } = WebGPU;
    const s = this.samplers[sampler !== void 0 ? sampler : 0];
    const mipLevelCount = Math.max(1, Math.floor(Math.log2(Math.max(bitmap.width, bitmap.height))) - 2);
    const tex = device.createTexture({
      label: textureType,
      size: [bitmap.width, bitmap.height, 1],
      format: srgb ? "rgba8unorm-srgb" : "rgba8unorm",
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
      mipLevelCount
    });
    device.queue.copyExternalImageToTexture(
      { source: bitmap },
      { premultipliedAlpha: false, texture: tex, mipLevel: 0, origin: { x: 0, y: 0, z: 0 } },
      { width: bitmap.width, height: bitmap.height, depthOrArrayLayers: 1 }
    );
    tex.sampler = s;
    tex.view = tex.createView();
    generateMipmaps(device, tex, bitmap.width, bitmap.height, mipLevelCount);
    this.images.set(name, tex);
    return tex;
  }
  handleTextureLoaded({
    image,
    name,
    mimeType,
    sampler,
    srgb = false
  }) {
    const s = this.samplers[sampler !== void 0 ? sampler : 0];
    if (mimeType) {
      image.sampler = s;
      return image;
    }
    if (this.images.has(name + srgb)) {
      return this.images.get(name + srgb);
    }
    const webglGl = gl;
    const t = webglGl.createTexture();
    t.name = name;
    t.image = image.src.substr(image.src.lastIndexOf("/"));
    t.sampler = s;
    webglGl.activeTexture(webglGl[`TEXTURE${31}`]);
    webglGl.bindTexture(webglGl.TEXTURE_2D, t);
    webglGl.pixelStorei(webglGl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    webglGl.pixelStorei(webglGl.UNPACK_COLORSPACE_CONVERSION_WEBGL, webglGl.NONE);
    webglGl.texImage2D(webglGl.TEXTURE_2D, 0, srgb ? webglGl.SRGB8_ALPHA8 : webglGl.RGBA, webglGl.RGBA, webglGl.UNSIGNED_BYTE, image);
    webglGl.generateMipmap(webglGl.TEXTURE_2D);
    this.images.set(name + srgb, t);
    return t;
  }
  async getEnv(isBuffer) {
    if (this.json.extensions && this.json.extensions.EXT_lights_image_based) {
      const [env] = this.json.extensions.EXT_lights_image_based.lights;
      const specularImages = env.specularImages.map((cube) => {
        return cube.map((img) => {
          const accessor = this.json.images[img];
          const bufferView = this.json.bufferViews[accessor.bufferView];
          const { buffer, byteLength, byteOffset } = bufferView;
          const view = new Uint8Array(this.arrayBuffer[buffer], byteOffset, byteLength);
          const blob = new Blob([view], { type: accessor.mimeType });
          const imageUrl = window.URL.createObjectURL(blob);
          const imageEl = new Image();
          imageEl.src = imageUrl;
          return imageEl;
        });
      });
      env.specularImages = specularImages;
      await new Promise((r) => setTimeout(r, 200));
      if (isBuffer) {
        for (const images of specularImages) {
          for (const image of images) {
            image.bitmap = await createImageBitmap(image);
          }
        }
      }
      return env;
    }
  }
};

// src/redcube.node.ts
var FOV = 45;
var RedCube = class {
  url;
  parse;
  camera;
  constructor(url) {
    if (!url) {
      throw new Error("RedCube: a glTF url must be passed as the first constructor argument");
    }
    this.url = url;
  }
  async init(cb) {
    const scene = new Scene();
    this.parse = new Parse(this.url, [], () => {
    });
    this.parse.setScene(scene);
    await this.parse.getJson();
    await this.parse.getBuffer();
    await this.parse.initTextures(false);
    this.parse.buildSkin();
    await this.parse.buildMesh();
    this.parse.buildAnimation();
    if (this.parse.cameras.length === 0) {
      this.camera = new Camera(
        {
          type: "perspective",
          isInitial: true,
          zoom: 1,
          aspect: 1,
          perspective: {
            yfov: FOV * Math.PI / 180
          }
        },
        "perspective"
      );
      this.parse.cameras.push(this.camera);
    }
    const [c] = this.parse.cameras;
    this.camera = c;
    this.parse.calculateFov(this.camera.props.isInitial);
    this.resize();
    scene.tracks = this.parse.tracks;
    scene.cameras = this.parse.cameras;
    scene.lights = this.parse.lights;
    cb(scene);
  }
  resize() {
    const z = this.camera.modelSize;
    if (this.camera.props.isInitial) {
      this.camera.setZ(z);
    }
    this.camera.updateNF();
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RedCube
});
//# sourceMappingURL=redcube.node.cjs.map
