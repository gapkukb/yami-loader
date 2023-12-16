var w = Object.defineProperty, _ = Object.defineProperties;
var C = Object.getOwnPropertyDescriptors;
var f = Object.getOwnPropertySymbols;
var O = Object.prototype.hasOwnProperty, L = Object.prototype.propertyIsEnumerable;
var v = (r, t, e) => t in r ? w(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e, u = (r, t) => {
  for (var e in t || (t = {}))
    O.call(t, e) && v(r, e, t[e]);
  if (f)
    for (var e of f(t))
      L.call(t, e) && v(r, e, t[e]);
  return r;
}, m = (r, t) => _(r, C(t));
var E = (r, t, e) => new Promise((o, n) => {
  var a = (s) => {
    try {
      d(e.next(s));
    } catch (i) {
      n(i);
    }
  }, l = (s) => {
    try {
      d(e.throw(s));
    } catch (i) {
      n(i);
    }
  }, d = (s) => s.done ? o(s.value) : Promise.resolve(s.value).then(a, l);
  d((e = e.apply(r, t)).next());
});
var g = /* @__PURE__ */ ((r) => (r.LOAD = "load", r.ERROR = "error", r.COMPLETE = "complete", r))(g || {});
const y = document.head || document.getElementsByTagName("head")[0] || document.body, p = "loaded";
function T(r, t, e) {
  let o = e.id ? document.getElementById(e.id) : null;
  if (!o) {
    const n = `${t}[${t === "link" ? "href" : "src"}="${r}"]`;
    o = y.querySelector(n);
  }
  return o || (o = document.createElement(t), Object.assign(o, e), y.appendChild(o)), o;
}
const $ = {
  LoaderEvent: g,
  load(r, t = {}, e = {}) {
    const o = t.src || t.href;
    let n = T(o, r, t);
    if (n.getAttribute(p) === "1")
      return Promise.resolve(n);
    let a;
    return new Promise((l, d) => {
      function s() {
        l(n);
      }
      function i() {
        d(`Failed to load ${o}`);
      }
      n.addEventListener("load", s, !1), n.addEventListener("error", i, !1), a = () => {
        var h;
        n.removeEventListener("load", s, !1), n.removeEventListener("error", i, !1), document.dispatchEvent(new CustomEvent("complete", { detail: n })), (h = e.oncomplete) == null || h.call(e, n);
      };
      const c = 15 * 1e3;
      setTimeout(() => d(`Time out of ${c}ms`), c);
    }).then((l) => {
      var d;
      return n.setAttribute(p, "1"), document.dispatchEvent(new CustomEvent("load", { detail: n })), (d = e.onload) == null || d.call(e, n), l;
    }).catch((l) => {
      var d;
      throw n.remove(), document.dispatchEvent(new CustomEvent("error", { detail: l })), (d = e.onerror) == null || d.call(e, l), new Error(l);
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
      const [e, o] = r.split("?"), n = new URLSearchParams(o);
      n.append(t.name || "jsonCallback", t.callee);
      const a = Object.create(t.callbacks || {}), l = a.onload;
      delete a.onload;
      const d = yield this.loadScript(e + "?" + n.toString(), void 0, a), s = globalThis[t.callee]();
      return globalThis[t.callee] = null, d.remove(), l == null || l.call(t, s), s;
    });
  }
};
export {
  g as LoaderEvent,
  $ as default,
  $ as yamiLoader
};
