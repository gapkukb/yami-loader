var g = Object.defineProperty, w = Object.defineProperties;
var C = Object.getOwnPropertyDescriptors;
var h = Object.getOwnPropertySymbols;
var O = Object.prototype.hasOwnProperty, L = Object.prototype.propertyIsEnumerable;
var v = (r, t, e) => t in r ? g(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e, u = (r, t) => {
  for (var e in t || (t = {}))
    O.call(t, e) && v(r, e, t[e]);
  if (h)
    for (var e of h(t))
      L.call(t, e) && v(r, e, t[e]);
  return r;
}, m = (r, t) => w(r, C(t));
var y = (r, t, e) => new Promise((o, n) => {
  var i = (l) => {
    try {
      d(e.next(l));
    } catch (a) {
      n(a);
    }
  }, s = (l) => {
    try {
      d(e.throw(l));
    } catch (a) {
      n(a);
    }
  }, d = (l) => l.done ? o(l.value) : Promise.resolve(l.value).then(i, s);
  d((e = e.apply(r, t)).next());
});
var _ = /* @__PURE__ */ ((r) => (r.LOAD = "load", r.ERROR = "error", r.COMPLETE = "complete", r))(_ || {});
const p = document.head || document.getElementsByTagName("head")[0] || document.body, E = "loaded", T = ["body", "frame", "frameset", "iframe", "img", "link", "script", "style"];
function P(r, t, e) {
  let o = e.id ? document.getElementById(e.id) : null;
  if (!o) {
    const n = `${t}[${t === "link" ? "href" : "src"}="${r}"]`;
    o = p.querySelector(n);
  }
  return o || (o = document.createElement(t), Object.assign(o, e), p.appendChild(o)), o;
}
const $ = {
  LoaderEvent: _,
  load(r, t = {}, e = {}) {
    const o = t.src || t.href;
    let n = P(o, r, t);
    if (!T.includes(r) || n.getAttribute(E) === "1")
      return Promise.resolve(n);
    let i;
    return new Promise((s, d) => {
      function l() {
        s(n);
      }
      function a() {
        d(`Failed to load ${o}`);
      }
      n.addEventListener("load", l, !1), n.addEventListener("error", a, !1), i = () => {
        var f;
        n.removeEventListener("load", l, !1), n.removeEventListener("error", a, !1), document.dispatchEvent(new CustomEvent("complete", { detail: n })), (f = e.oncomplete) == null || f.call(e, n);
      };
      const c = 15 * 1e3;
      setTimeout(() => d(`Time out of ${c}ms`), c);
    }).then((s) => {
      var d;
      return n.setAttribute(E, "1"), document.dispatchEvent(new CustomEvent("load", { detail: n })), (d = e.onload) == null || d.call(e, n), s;
    }).catch((s) => {
      var d;
      throw n.remove(), document.dispatchEvent(new CustomEvent("error", { detail: s })), (d = e.onerror) == null || d.call(e, s), new Error(s);
    }).finally(i);
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
    return y(this, null, function* () {
      const [e, o] = r.split("?"), n = new URLSearchParams(o);
      n.append(t.name || "jsonCallback", t.callee);
      const i = Object.create(t.callbacks || {}), s = i.onload;
      delete i.onload;
      const d = yield this.loadScript(e + "?" + n.toString(), void 0, i), l = globalThis[t.callee]();
      return globalThis[t.callee] = null, d.remove(), s == null || s.call(t, l), l;
    });
  }
};
export {
  _ as LoaderEvent,
  $ as default,
  $ as yamiLoader
};
