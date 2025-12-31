import ee from "react";
var b = { exports: {} }, _ = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var I;
function re() {
  if (I) return _;
  I = 1;
  var o = Symbol.for("react.transitional.element"), l = Symbol.for("react.fragment");
  function i(f, s, u) {
    var m = null;
    if (u !== void 0 && (m = "" + u), s.key !== void 0 && (m = "" + s.key), "key" in s) {
      u = {};
      for (var E in s)
        E !== "key" && (u[E] = s[E]);
    } else u = s;
    return s = u.ref, {
      $$typeof: o,
      type: f,
      key: m,
      ref: s !== void 0 ? s : null,
      props: u
    };
  }
  return _.Fragment = l, _.jsx = i, _.jsxs = i, _;
}
var v = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var F;
function te() {
  return F || (F = 1, process.env.NODE_ENV !== "production" && (function() {
    function o(e) {
      if (e == null) return null;
      if (typeof e == "function")
        return e.$$typeof === Z ? null : e.displayName || e.name || null;
      if (typeof e == "string") return e;
      switch (e) {
        case T:
          return "Fragment";
        case q:
          return "Profiler";
        case U:
          return "StrictMode";
        case G:
          return "Suspense";
        case X:
          return "SuspenseList";
        case H:
          return "Activity";
      }
      if (typeof e == "object")
        switch (typeof e.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), e.$$typeof) {
          case W:
            return "Portal";
          case V:
            return e.displayName || "Context";
          case J:
            return (e._context.displayName || "Context") + ".Consumer";
          case z:
            var r = e.render;
            return e = e.displayName, e || (e = r.displayName || r.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
          case B:
            return r = e.displayName || null, r !== null ? r : o(e.type) || "Memo";
          case k:
            r = e._payload, e = e._init;
            try {
              return o(e(r));
            } catch {
            }
        }
      return null;
    }
    function l(e) {
      return "" + e;
    }
    function i(e) {
      try {
        l(e);
        var r = !1;
      } catch {
        r = !0;
      }
      if (r) {
        r = console;
        var t = r.error, n = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return t.call(
          r,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          n
        ), l(e);
      }
    }
    function f(e) {
      if (e === T) return "<>";
      if (typeof e == "object" && e !== null && e.$$typeof === k)
        return "<...>";
      try {
        var r = o(e);
        return r ? "<" + r + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function s() {
      var e = x.A;
      return e === null ? null : e.getOwner();
    }
    function u() {
      return Error("react-stack-top-frame");
    }
    function m(e) {
      if (P.call(e, "key")) {
        var r = Object.getOwnPropertyDescriptor(e, "key").get;
        if (r && r.isReactWarning) return !1;
      }
      return e.key !== void 0;
    }
    function E(e, r) {
      function t() {
        g || (g = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          r
        ));
      }
      t.isReactWarning = !0, Object.defineProperty(e, "key", {
        get: t,
        configurable: !0
      });
    }
    function L() {
      var e = o(this.type);
      return N[e] || (N[e] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), e = this.props.ref, e !== void 0 ? e : null;
    }
    function M(e, r, t, n, R, j) {
      var a = t.ref;
      return e = {
        $$typeof: y,
        type: e,
        key: r,
        props: t,
        _owner: n
      }, (a !== void 0 ? a : null) !== null ? Object.defineProperty(e, "ref", {
        enumerable: !1,
        get: L
      }) : Object.defineProperty(e, "ref", { enumerable: !1, value: null }), e._store = {}, Object.defineProperty(e._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(e, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.defineProperty(e, "_debugStack", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: R
      }), Object.defineProperty(e, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: j
      }), Object.freeze && (Object.freeze(e.props), Object.freeze(e)), e;
    }
    function S(e, r, t, n, R, j) {
      var a = r.children;
      if (a !== void 0)
        if (n)
          if (Q(a)) {
            for (n = 0; n < a.length; n++)
              h(a[n]);
            Object.freeze && Object.freeze(a);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else h(a);
      if (P.call(r, "key")) {
        a = o(e);
        var d = Object.keys(r).filter(function(K) {
          return K !== "key";
        });
        n = 0 < d.length ? "{key: someKey, " + d.join(": ..., ") + ": ...}" : "{key: someKey}", $[a + n] || (d = 0 < d.length ? "{" + d.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          n,
          a,
          d,
          a
        ), $[a + n] = !0);
      }
      if (a = null, t !== void 0 && (i(t), a = "" + t), m(r) && (i(r.key), a = "" + r.key), "key" in r) {
        t = {};
        for (var A in r)
          A !== "key" && (t[A] = r[A]);
      } else t = r;
      return a && E(
        t,
        typeof e == "function" ? e.displayName || e.name || "Unknown" : e
      ), M(
        e,
        a,
        t,
        s(),
        R,
        j
      );
    }
    function h(e) {
      w(e) ? e._store && (e._store.validated = 1) : typeof e == "object" && e !== null && e.$$typeof === k && (e._payload.status === "fulfilled" ? w(e._payload.value) && e._payload.value._store && (e._payload.value._store.validated = 1) : e._store && (e._store.validated = 1));
    }
    function w(e) {
      return typeof e == "object" && e !== null && e.$$typeof === y;
    }
    var p = ee, y = Symbol.for("react.transitional.element"), W = Symbol.for("react.portal"), T = Symbol.for("react.fragment"), U = Symbol.for("react.strict_mode"), q = Symbol.for("react.profiler"), J = Symbol.for("react.consumer"), V = Symbol.for("react.context"), z = Symbol.for("react.forward_ref"), G = Symbol.for("react.suspense"), X = Symbol.for("react.suspense_list"), B = Symbol.for("react.memo"), k = Symbol.for("react.lazy"), H = Symbol.for("react.activity"), Z = Symbol.for("react.client.reference"), x = p.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, P = Object.prototype.hasOwnProperty, Q = Array.isArray, O = console.createTask ? console.createTask : function() {
      return null;
    };
    p = {
      react_stack_bottom_frame: function(e) {
        return e();
      }
    };
    var g, N = {}, C = p.react_stack_bottom_frame.bind(
      p,
      u
    )(), Y = O(f(u)), $ = {};
    v.Fragment = T, v.jsx = function(e, r, t) {
      var n = 1e4 > x.recentlyCreatedOwnerStacks++;
      return S(
        e,
        r,
        t,
        !1,
        n ? Error("react-stack-top-frame") : C,
        n ? O(f(e)) : Y
      );
    }, v.jsxs = function(e, r, t) {
      var n = 1e4 > x.recentlyCreatedOwnerStacks++;
      return S(
        e,
        r,
        t,
        !0,
        n ? Error("react-stack-top-frame") : C,
        n ? O(f(e)) : Y
      );
    };
  })()), v;
}
var D;
function ne() {
  return D || (D = 1, process.env.NODE_ENV === "production" ? b.exports = re() : b.exports = te()), b.exports;
}
var c = ne();
function ae({ transcript: o }) {
  const l = o.confidence < 0.8, i = (f) => f.toISOString().substring(11, 19);
  return /* @__PURE__ */ c.jsxs(
    "div",
    {
      className: `transcript-entry ${o.speaker}`,
      "data-speaker": o.speaker,
      "data-low-confidence": l || void 0,
      "data-interim": !o.isFinal || void 0,
      children: [
        /* @__PURE__ */ c.jsx("div", { className: "speaker-label", children: o.speaker === "caller" ? "Caller" : "Agent" }),
        /* @__PURE__ */ c.jsx("div", { className: "timestamp", children: i(o.timestamp) }),
        /* @__PURE__ */ c.jsx("div", { className: `text ${l ? "low-confidence" : ""}`, children: o.text })
      ]
    }
  );
}
function se({ transcripts: o }) {
  return o.length === 0 ? /* @__PURE__ */ c.jsx("div", { className: "transcript-panel empty", children: /* @__PURE__ */ c.jsx("p", { children: "No transcripts available" }) }) : /* @__PURE__ */ c.jsx("div", { className: "transcript-panel", children: o.map((l) => /* @__PURE__ */ c.jsx(ae, { transcript: l }, l.id)) });
}
export {
  ae as TranscriptEntry,
  se as TranscriptPanel
};
