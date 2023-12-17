var O = Object.defineProperty, S = Object.defineProperties;
var T = Object.getOwnPropertyDescriptors;
var j = Object.getOwnPropertySymbols;
var w = Object.prototype.hasOwnProperty, C = Object.prototype.propertyIsEnumerable;
var _ = (n, t, e) => t in n ? O(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e, y = (n, t) => {
  for (var e in t || (t = {}))
    w.call(t, e) && _(n, e, t[e]);
  if (j)
    for (var e of j(t))
      C.call(t, e) && _(n, e, t[e]);
  return n;
}, p = (n, t) => S(n, T(t));
var v = (n, t, e) => (_(n, typeof t != "symbol" ? t + "" : t, e), e);
var E = (n, t, e) => new Promise((r, s) => {
  var d = (o) => {
    try {
      u(e.next(o));
    } catch (i) {
      s(i);
    }
  }, f = (o) => {
    try {
      u(e.throw(o));
    } catch (i) {
      s(i);
    }
  }, u = (o) => o.done ? r(o.value) : Promise.resolve(o.value).then(d, f);
  u((e = e.apply(n, t)).next());
});
var L = /* @__PURE__ */ ((n) => (n.LOAD = "_load", n.ERROR = "_error", n.COMPLETE = "_complete", n))(L || {});
const c = document.head || document.body, g = "loaded", $ = ["body", "frame", "frameset", "iframe", "img", "link", "script", "style"], a = (n, t) => document.dispatchEvent(new CustomEvent(n, { detail: t }));
function P(n, t, e) {
  let r = e.id ? c.querySelector("#" + e.id) : null;
  if (!r) {
    const s = `${t}[${t === "link" ? "href" : "src"}="${n}"]`;
    r = c.querySelector(s);
  }
  return r || (r = document.createElement(t), Object.assign(r, e), c.appendChild(r)), r;
}
class R {
  constructor(t) {
    v(this, "timeout", 15 * 1e3);
    v(this, "LoaderEvent", L);
    Object.assign(this, t);
  }
  load(t, e = {}, r = {}) {
    const s = e.href || e.src;
    let d = P(s, t, e), f, u = 0;
    return new Promise((o, i) => {
      function m() {
        o({ el: d, options: e });
      }
      function l(h) {
        i({ reason: typeof h == "string" ? h : `Failed to load ${s}`, options: e });
      }
      if ($.includes(t))
        if (s) {
          if (d.getAttribute(g) === "1")
            return m();
        } else
          return l("Not found the source address");
      else
        return m();
      d.addEventListener("load", m, !1), d.addEventListener("error", l, !1), f = () => {
        var h;
        d.removeEventListener("load", m, !1), d.removeEventListener("error", l, !1), a("_complete", e), (h = r.oncomplete) == null || h.call(r, e), clearTimeout(u);
      }, u = setTimeout(() => l(`Time out of ${this.timeout} ms`), this.timeout);
    }).then((o) => {
      var i;
      return d.setAttribute(g, "1"), "_jsonp_" in e || (a("_load", o), (i = r.onload) == null || i.call(r, o.el, o.options)), o;
    }).catch((o) => {
      var m;
      d.remove();
      const i = { reason: o, options: e };
      return a("_error", i), (m = r.onerror) == null || m.call(r, o, e), Promise.reject(i);
    }).finally(f);
  }
  loadScript(t, e, r) {
    return this.load(
      "script",
      p(y({}, e), {
        defer: !0,
        async: !0,
        type: "text/javascript",
        crossOrigin: "anonymous",
        src: t
      }),
      r
    );
  }
  loadCss(t, e, r) {
    return this.load(
      "link",
      p(y({}, e), {
        rel: "stylesheet",
        type: "text/css",
        crossOrigin: "anonymous",
        href: t
      }),
      r
    );
  }
  jsonp(t, e, r) {
    return E(this, null, function* () {
      const [s, d] = t.split("?"), f = new URLSearchParams(d);
      f.append(e.name || "jsonCallback", e.callee);
      const u = r == null ? void 0 : r.onload;
      r == null || delete r.onload;
      const { el: o, options: i } = yield this.loadScript(
        s + "?" + f.toString(),
        Object.assign(e, { _jsonp_: !0 }),
        r
      ), m = globalThis[e.callee]();
      globalThis[e.callee] = null, o.remove();
      const l = { data: m, options: i };
      return a("_load", l), u == null || u.call(r, m, i), l;
    });
  }
}
const x = new R();
export {
  L as LoaderEvent,
  R as YamiLoader,
  R as default,
  x as yamiLoader
};
