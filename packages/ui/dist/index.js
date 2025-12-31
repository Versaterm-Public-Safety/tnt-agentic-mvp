import te, { useState as O, useRef as D, useCallback as ne, useEffect as oe } from "react";
var N = { exports: {} }, y = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var V;
function ae() {
  if (V) return y;
  V = 1;
  var t = Symbol.for("react.transitional.element"), s = Symbol.for("react.fragment");
  function f(i, c, u) {
    var d = null;
    if (u !== void 0 && (d = "" + u), c.key !== void 0 && (d = "" + c.key), "key" in c) {
      u = {};
      for (var m in c)
        m !== "key" && (u[m] = c[m]);
    } else u = c;
    return c = u.ref, {
      $$typeof: t,
      type: i,
      key: d,
      ref: c !== void 0 ? c : null,
      props: u
    };
  }
  return y.Fragment = s, y.jsx = f, y.jsxs = f, y;
}
var j = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var G;
function se() {
  return G || (G = 1, process.env.NODE_ENV !== "production" && (function() {
    function t(e) {
      if (e == null) return null;
      if (typeof e == "function")
        return e.$$typeof === K ? null : e.displayName || e.name || null;
      if (typeof e == "string") return e;
      switch (e) {
        case k:
          return "Fragment";
        case v:
          return "Profiler";
        case w:
          return "StrictMode";
        case B:
          return "Suspense";
        case H:
          return "SuspenseList";
        case Q:
          return "Activity";
      }
      if (typeof e == "object")
        switch (typeof e.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), e.$$typeof) {
          case g:
            return "Portal";
          case p:
            return e.displayName || "Context";
          case x:
            return (e._context.displayName || "Context") + ".Consumer";
          case C:
            var r = e.render;
            return e = e.displayName, e || (e = r.displayName || r.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
          case Z:
            return r = e.displayName || null, r !== null ? r : t(e.type) || "Memo";
          case W:
            r = e._payload, e = e._init;
            try {
              return t(e(r));
            } catch {
            }
        }
      return null;
    }
    function s(e) {
      return "" + e;
    }
    function f(e) {
      try {
        s(e);
        var r = !1;
      } catch {
        r = !0;
      }
      if (r) {
        r = console;
        var n = r.error, o = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return n.call(
          r,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          o
        ), s(e);
      }
    }
    function i(e) {
      if (e === k) return "<>";
      if (typeof e == "object" && e !== null && e.$$typeof === W)
        return "<...>";
      try {
        var r = t(e);
        return r ? "<" + r + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function c() {
      var e = F.A;
      return e === null ? null : e.getOwner();
    }
    function u() {
      return Error("react-stack-top-frame");
    }
    function d(e) {
      if (U.call(e, "key")) {
        var r = Object.getOwnPropertyDescriptor(e, "key").get;
        if (r && r.isReactWarning) return !1;
      }
      return e.key !== void 0;
    }
    function m(e, r) {
      function n() {
        L || (L = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          r
        ));
      }
      n.isReactWarning = !0, Object.defineProperty(e, "key", {
        get: n,
        configurable: !0
      });
    }
    function P() {
      var e = t(this.type);
      return M[e] || (M[e] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), e = this.props.ref, e !== void 0 ? e : null;
    }
    function R(e, r, n, o, A, Y) {
      var a = n.ref;
      return e = {
        $$typeof: T,
        type: e,
        key: r,
        props: n,
        _owner: o
      }, (a !== void 0 ? a : null) !== null ? Object.defineProperty(e, "ref", {
        enumerable: !1,
        get: P
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
        value: A
      }), Object.defineProperty(e, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: Y
      }), Object.freeze && (Object.freeze(e.props), Object.freeze(e)), e;
    }
    function _(e, r, n, o, A, Y) {
      var a = r.children;
      if (a !== void 0)
        if (o)
          if (ee(a)) {
            for (o = 0; o < a.length; o++)
              h(a[o]);
            Object.freeze && Object.freeze(a);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else h(a);
      if (U.call(r, "key")) {
        a = t(e);
        var S = Object.keys(r).filter(function(re) {
          return re !== "key";
        });
        o = 0 < S.length ? "{key: someKey, " + S.join(": ..., ") + ": ...}" : "{key: someKey}", q[a + o] || (S = 0 < S.length ? "{" + S.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          o,
          a,
          S,
          a
        ), q[a + o] = !0);
      }
      if (a = null, n !== void 0 && (f(n), a = "" + n), d(r) && (f(r.key), a = "" + r.key), "key" in r) {
        n = {};
        for (var I in r)
          I !== "key" && (n[I] = r[I]);
      } else n = r;
      return a && m(
        n,
        typeof e == "function" ? e.displayName || e.name || "Unknown" : e
      ), R(
        e,
        a,
        n,
        c(),
        A,
        Y
      );
    }
    function h(e) {
      b(e) ? e._store && (e._store.validated = 1) : typeof e == "object" && e !== null && e.$$typeof === W && (e._payload.status === "fulfilled" ? b(e._payload.value) && e._payload.value._store && (e._payload.value._store.validated = 1) : e._store && (e._store.validated = 1));
    }
    function b(e) {
      return typeof e == "object" && e !== null && e.$$typeof === T;
    }
    var E = te, T = Symbol.for("react.transitional.element"), g = Symbol.for("react.portal"), k = Symbol.for("react.fragment"), w = Symbol.for("react.strict_mode"), v = Symbol.for("react.profiler"), x = Symbol.for("react.consumer"), p = Symbol.for("react.context"), C = Symbol.for("react.forward_ref"), B = Symbol.for("react.suspense"), H = Symbol.for("react.suspense_list"), Z = Symbol.for("react.memo"), W = Symbol.for("react.lazy"), Q = Symbol.for("react.activity"), K = Symbol.for("react.client.reference"), F = E.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, U = Object.prototype.hasOwnProperty, ee = Array.isArray, $ = console.createTask ? console.createTask : function() {
      return null;
    };
    E = {
      react_stack_bottom_frame: function(e) {
        return e();
      }
    };
    var L, M = {}, z = E.react_stack_bottom_frame.bind(
      E,
      u
    )(), J = $(i(u)), q = {};
    j.Fragment = k, j.jsx = function(e, r, n) {
      var o = 1e4 > F.recentlyCreatedOwnerStacks++;
      return _(
        e,
        r,
        n,
        !1,
        o ? Error("react-stack-top-frame") : z,
        o ? $(i(e)) : J
      );
    }, j.jsxs = function(e, r, n) {
      var o = 1e4 > F.recentlyCreatedOwnerStacks++;
      return _(
        e,
        r,
        n,
        !0,
        o ? Error("react-stack-top-frame") : z,
        o ? $(i(e)) : J
      );
    };
  })()), j;
}
var X;
function ce() {
  return X || (X = 1, process.env.NODE_ENV === "production" ? N.exports = ae() : N.exports = se()), N.exports;
}
var l = ce();
function le({ transcript: t }) {
  const s = t.confidence < 0.8, f = (i) => i.toISOString().substring(11, 19);
  return /* @__PURE__ */ l.jsxs(
    "div",
    {
      className: `transcript-entry ${t.speaker}`,
      "data-speaker": t.speaker,
      "data-low-confidence": s || void 0,
      "data-interim": !t.isFinal || void 0,
      children: [
        /* @__PURE__ */ l.jsx("div", { className: "speaker-label", children: t.speaker === "caller" ? "Caller" : "Agent" }),
        /* @__PURE__ */ l.jsx("div", { className: "timestamp", children: f(t.timestamp) }),
        /* @__PURE__ */ l.jsx("div", { className: `text ${s ? "low-confidence" : ""}`, children: t.text })
      ]
    }
  );
}
function ie({ transcripts: t }) {
  return t.length === 0 ? /* @__PURE__ */ l.jsx("div", { className: "transcript-panel empty", children: /* @__PURE__ */ l.jsx("p", { children: "No transcripts available" }) }) : /* @__PURE__ */ l.jsx("div", { className: "transcript-panel", children: t.map((s) => /* @__PURE__ */ l.jsx(le, { transcript: s }, s.id)) });
}
const ue = ({
  status: t,
  callId: s,
  error: f,
  reconnectAttempts: i = 0
}) => {
  const c = () => {
    switch (t) {
      case "connected":
        return "green";
      case "disconnected":
        return "red";
      case "reconnecting":
        return "orange";
      default:
        return "gray";
    }
  }, u = () => {
    switch (t) {
      case "connected":
        return s ? `Connected - Call ${s}` : "Connected";
      case "disconnected":
        return "Disconnected";
      case "reconnecting":
        return `Reconnecting... (Attempt ${i})`;
      default:
        return "Unknown";
    }
  };
  return /* @__PURE__ */ l.jsxs(
    "div",
    {
      style: {
        padding: "12px 16px",
        borderBottom: "1px solid #e0e0e0",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        gap: "12px"
      },
      children: [
        /* @__PURE__ */ l.jsx(
          "div",
          {
            style: {
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: c(),
              flexShrink: 0
            }
          }
        ),
        /* @__PURE__ */ l.jsxs("div", { style: { flex: 1 }, children: [
          /* @__PURE__ */ l.jsx("div", { style: { fontWeight: 600, fontSize: "14px" }, children: u() }),
          f && /* @__PURE__ */ l.jsxs("div", { style: { fontSize: "12px", color: "#d32f2f", marginTop: "4px" }, children: [
            "Error: ",
            f
          ] })
        ] })
      ]
    }
  );
};
function fe(t) {
  const {
    url: s,
    reconnectInterval: f = 3e3,
    maxReconnectAttempts: i = 5
  } = t, [c, u] = O([]), [d, m] = O("disconnected"), [P, R] = O(null), [_, h] = O(0), b = D(null), E = D(null), T = D(!0), g = ne(() => {
    var k, w;
    if (!(((k = b.current) == null ? void 0 : k.readyState) === WebSocket.OPEN || ((w = b.current) == null ? void 0 : w.readyState) === WebSocket.CONNECTING))
      try {
        const v = new WebSocket(s);
        b.current = v, v.onopen = () => {
          console.log("WebSocket connected"), m("connected"), h(0), R(null);
        }, v.onmessage = (x) => {
          try {
            const p = JSON.parse(x.data);
            p.type === "transcript" && p.transcript ? u((C) => [...C, p.transcript]) : p.type === "status" ? p.status && m(p.status) : p.type === "error" && R(p.message || "Unknown error");
          } catch (p) {
            console.error("Failed to parse WebSocket message:", p);
          }
        }, v.onerror = (x) => {
          console.error("WebSocket error:", x), R("WebSocket connection error");
        }, v.onclose = () => {
          console.log("WebSocket closed"), m("disconnected"), T.current && _ < i ? (m("reconnecting"), h((x) => x + 1), E.current = setTimeout(() => {
            g();
          }, f)) : _ >= i && R(`Failed to reconnect after ${i} attempts`);
        };
      } catch (v) {
        console.error("Failed to create WebSocket:", v), R("Failed to establish WebSocket connection"), m("disconnected");
      }
  }, [s, f, i, _]);
  return oe(() => (T.current = !0, g(), () => {
    T.current = !1, E.current && clearTimeout(E.current), b.current && (b.current.close(), b.current = null);
  }), [g]), {
    transcripts: c,
    connectionStatus: d,
    error: P,
    reconnectAttempts: _
  };
}
const pe = ({
  websocketUrl: t = "ws://localhost:8080"
}) => {
  const {
    transcripts: s,
    connectionStatus: f,
    error: i,
    reconnectAttempts: c
  } = fe({ url: t }), u = s.map((d) => ({
    id: d.id,
    text: d.text,
    speaker: d.speaker,
    confidence: d.confidence,
    timestamp: new Date(d.timestamp),
    isFinal: d.isFinal
  }));
  return /* @__PURE__ */ l.jsxs(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      },
      children: [
        /* @__PURE__ */ l.jsx(
          "header",
          {
            style: {
              padding: "16px 24px",
              backgroundColor: "#1976d2",
              color: "white",
              fontSize: "20px",
              fontWeight: 600
            },
            children: "TnT - Real-Time Transcription"
          }
        ),
        /* @__PURE__ */ l.jsx(
          ue,
          {
            status: f,
            error: i,
            reconnectAttempts: c
          }
        ),
        /* @__PURE__ */ l.jsx(ie, { transcripts: u })
      ]
    }
  );
};
export {
  pe as App,
  ue as CallStatus,
  le as TranscriptEntry,
  ie as TranscriptPanel,
  fe as useWebSocket
};
