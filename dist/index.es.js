var w = Object.defineProperty, _ = Object.defineProperties;
var C = Object.getOwnPropertyDescriptors;
var v = Object.getOwnPropertySymbols;
var O = Object.prototype.hasOwnProperty, L = Object.prototype.propertyIsEnumerable;
var f = (r, t, e) => t in r ? w(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e, u = (r, t) => {
  for (var e in t || (t = {}))
    O.call(t, e) && f(r, e, t[e]);
  if (v)
    for (var e of v(t))
      L.call(t, e) && f(r, e, t[e]);
  return r;
}, m = (r, t) => _(r, C(t));
var E = (r, t, e) => new Promise((n, o) => {
  var a = (s) => {
    try {
      d(e.next(s));
    } catch (i) {
      o(i);
    }
  }, l = (s) => {
    try {
      d(e.throw(s));
    } catch (i) {
      o(i);
    }
  }, d = (s) => s.done ? n(s.value) : Promise.resolve(s.value).then(a, l);
  d((e = e.apply(r, t)).next());
});
var g = /* @__PURE__ */ ((r) => (r.LOAD = "load", r.ERROR = "error", r.COMPLETE = "complete", r))(g || {});
const y = document.head || document.getElementsByTagName("head")[0] || document.body, p = "loaded";
function S(r, t, e) {
  let n = e.id ? document.getElementById(e.id) : null;
  if (!n) {
    const o = `${t}[${t === "link" ? "href" : "src"}="${r}"]`;
    n = y.querySelector(o);
  }
  return n || (n = document.createElement(t), Object.assign(n, e), y.appendChild(n)), n;
}
const T = {
  LoaderEvent: g,
  load(r, t = {}, e = {}) {
    const n = t.src || t.href;
    let o = S(n, r, t);
    if (o.getAttribute(p) === "1")
      return Promise.resolve(o);
    let a;
    return new Promise((l, d) => {
      function s() {
        l(o);
      }
      function i() {
        d(`Failed to load ${n}`);
      }
      o.addEventListener("load", s, !1), o.addEventListener("error", i, !1), a = () => {
        var h;
        o.removeEventListener("load", s, !1), o.removeEventListener("error", i, !1), document.dispatchEvent(new CustomEvent("complete", { detail: o })), (h = e.oncomplete) == null || h.call(e, o);
      };
      const c = 15 * 1e3;
      setTimeout(() => d(`Time out of ${c}ms`), c);
    }).then((l) => {
      var d;
      return o.setAttribute(p, "1"), document.dispatchEvent(new CustomEvent("load", { detail: o })), (d = e.onload) == null || d.call(e, o), l;
    }).catch((l) => {
      var d;
      throw o.remove(), document.dispatchEvent(new CustomEvent("error", { detail: l })), (d = e.onerror) == null || d.call(e, l), new Error(l);
    }).finally(a);
  },
  loadScript(r, t, e) {
    return this.load(
      "script",
      m(u({}, t), {
        defer: !0,
        async: !0,
        type: "text/javascript",
        crossOrigin: "anonymous",
        src: r
      }),
      e
    );
  },
  loadCss(r, t, e) {
    return this.load(
      "link",
      m(u({}, t), {
        rel: "stylesheet",
        type: "text/css",
        crossOrigin: "anonymous",
        href: r
      }),
      e
    );
  },
  jsonp(r, t) {
    return E(this, null, function* () {
      const [e, n] = r.split("?"), o = new URLSearchParams(n);
      o.append(t.name || "jsonCallback", t.callee);
      const a = Object.create(t.callbacks || {}), l = a.onload;
      delete a.onload;
      const d = yield this.loadScript(e + "?" + o.toString(), void 0, a), s = globalThis[t.callee]();
      return globalThis[t.callee] = null, d.remove(), l == null || l.call(t, s), s;
    });
  }
};
T.loadScript("demo.js", void 0, {
  onload(r) {
    console.log(this), console.log(r);
  }
});
export {
  g as LoaderEvent,
  T as default,
  T as yamiLoader
};
