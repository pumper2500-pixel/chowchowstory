  function mT(i, e) {
    let t = zn.find((o) => o.def.id === "grocery");
    if (!t || !mr()) return;
    let n = t.inside;
    X3 -= i;
    let s = performance.now() / 1e3;
    if ((K6 -= i) < 0) {
      K6 = 10 + Math.random() * 12;
      let o = Nn.filter((r) => r.shop).length;
      if (o < 6) {
        let r = Nn.filter(
            (c) =>
              !c.shop &&
              !c.sus &&
              (c.shopCD ?? 0) < s &&
              !c.leave &&
              c.fadeOut === void 0 &&
              !((c.sitT ?? 0) > 0) &&
              c.pos.distanceTo(t.door) < 45,
          ).sort((c, l) => c.pos.distanceTo(t.door) - l.pos.distanceTo(t.door)),
          a = Math.min(r.length, 6 - o, 2 + (Math.random() < 0.5 ? 1 : 0));
        r.slice(0, a).forEach((c, l) => {
          let h = t.door.clone().add(new H((l - 1) * 0.5, 0, 0.6));
          ((c.shop = { ins: n, door: t.door.clone(), stage: "go", spots: [], path: [], t: 0, fade: 1 }),
            (c.wait = l * 0.8));
          let f = qt.ready ? dl(c.pos, h) : null;
          ((c.path = f && f.length ? f : [h]), c.target.copy(c.path.shift() ?? h), (c.life = 200));
        });
      }
    }
    for (let o of Nn) {
      let r = o.shop;
      if (!r) continue;
      if (((r.t += i), r.stage === "go")) {
        (o.pos.distanceTo(r.door) < 1.3 || r.t > 70) && ((r.stage = "enter"), (r.fade = 0.7), o.vel?.set(0, 0, 0));
        continue;
      }
      if (r.stage === "enter" || r.stage === "out") {
        if (((r.fade -= i), ga(o.rig.root, Math.max(0, r.fade / 0.7)), Qi(o.rig, i, 0.8, null), r.fade > 0)) continue;
        if (r.stage === "enter") {
          ((r.stage = "in"),
            o.pos.copy(n.exit).add(new H((Math.random() - 0.5) * 1.2, 0, -0.3)),
            (o.fadeIn = 0),
            (r.fade = 0),
            j6(n) && ((r.basket = ok()), r.basket.position.set(-0.3, 0.62, 0.05), o.rig.root.add(r.basket), ccsHoldAdd(o.rig, r.basket, "LeftHand")));
          let f = n.wares.slice().sort(() => Math.random() - 0.5);
          ((r.spots = f
            .slice(0, 3 + Math.floor(Math.random() * 3))
            .map((d) => d.pos.clone().add(new H((Math.random() - 0.5) * 0.6, 0, (Math.random() - 0.5) * 0.3)))),
            (r.path = jh(n, o.pos, r.spots[0])),
            (r.t = 0));
          continue;
        }
        if ((r.basket && (r.basket.parent?.remove(r.basket), (r.basket = void 0)), r.bag)) {
          let f = r.bag;
          ((r.bag = void 0), setTimeout(() => f.parent?.remove(f), 25e3));
        }
        ((o.shopCD = performance.now() / 1e3 + 90),
          (o.shop = void 0),
          o.pos.copy(r.door).add(new H(Math.random() - 0.5, 0, 0.8)),
          (o.fadeIn = 0),
          (o.wait = 0.4),
          (o.life = 40 + Math.random() * 80),
          o.vel?.set(0, 0, 0),
          (o.path = g0(o.pos)),
          o.target.copy(o.path.shift() ?? o.pos));
        continue;
      }
      let a = 1;
      if (
        (o.fadeIn !== void 0 && o.fadeIn < 1 && ((o.fadeIn = Math.min(1, o.fadeIn + i / 0.7)), (a = o.fadeIn)),
        r.fade > 0)
      ) {
        ((r.fade -= i),
          Qi(o.rig, i, 0, r.look ? Math.atan2(r.look.x - o.pos.x, r.look.z - o.pos.z) : null),
          r.fade <= 0 && r.stage === "in" && r.basket && r.look && rk(r.basket),
          r.fade <= 0 &&
            (r.stage === "in" && r.spots.length
              ? (r.path = jh(n, o.pos, r.spots[0]))
              : r.stage === "in" && j6(n) && Math.random() < 0.85
                ? ((r.stage = "toq"), (r.path = jh(n, o.pos, $6(n, 3))))
                : ((r.stage = "exit"), (r.path = jh(n, o.pos, n.exit)))),
          ga(o.rig.root, a),
          o.rig.root.position.copy(o.pos));
        continue;
      }
      if (r.stage === "q") {
        let f = Nn.filter((u) => u.shop?.ins === n && u.shop.stage === "q").sort(
            (u, p) => (u.shop.qT ?? 0) - (p.shop.qT ?? 0),
          ),
          d = $6(n, f.indexOf(o));
        ((r.path = o.pos.distanceTo(d) > 0.12 ? [d] : []), (r.rank = f.indexOf(o)));
      }
      let c = r.path[0],
        l = 0,
        h = null;
      if (c) {
        let f = c.x - o.pos.x,
          d = c.z - o.pos.z,
          u = Math.hypot(f, d),
          p = o.speed * 0.75,
          m = 1;
        for (let g of Nn)
          g !== o &&
            g.shop?.ins === n &&
            g.shop.stage !== "go" &&
            g.pos.distanceTo(o.pos) < 0.7 &&
            (g.pos.x - o.pos.x) * f + (g.pos.z - o.pos.z) * d > 0 &&
            (m = 0.35);
        Se === n && e.pos.distanceTo(o.pos) < 0.9 && (m = Math.min(m, 0.3));
        let E = (r.sm = (r.sm ?? 1) + (m - (r.sm ?? 1)) * Math.min(1, i * 3));
        u < 0.15 && r.path.shift();
        {
          let g = Math.min(u, p * E * i);
          (u > 0.001 && ((o.pos.x += (f / u) * g), (o.pos.z += (d / u) * g)),
            (l = p * Math.max(0.55, E)),
            u > 0.05 && (h = Math.atan2(f, d)));
        }
      } else if (r.stage === "in") {
        let f = r.spots.shift(),
          d = n.wares.reduce((u, p) => (p.pos.distanceTo(f) < u.pos.distanceTo(f) ? p : u), n.wares[0]);
        ((r.look = d.mesh.getWorldPosition(new H())),
          (r.fade = 3 + Math.random() * 4),
          Se === n &&
            X3 <= 0 &&
            e.pos.distanceTo(o.pos) < 9 &&
            Math.random() < 0.75 &&
            ((X3 = 2.2 + Math.random() * 2), tP(o, Z6[Math.floor(Math.random() * Z6.length)], 3.2 + Math.random())));
      } else
        r.stage === "toq"
          ? ((r.stage = "q"), (r.qT = performance.now()), (r.payT = 0))
          : r.stage === "q"
            ? ((h = 0),
              r.rank === 0 &&
                (r.payT = (r.payT ?? 0) + i) > 2.6 &&
                (ke && Se === n && e.pos.distanceTo(o.pos) < 7 && ke("coin"),
                Se === n &&
                  Math.random() < 0.6 &&
                  Ln(
                    n.keeperSpot.clone().setY(2.1),
                    [
                      "ขอบคุณค่ะ 🙏",
                      "รับถุงไหมคะ? 🛍",
                      "แต้มสะสมครบแล้วนะคะ!",
                      "มาอีกนะคะ 😊",
                    ][Math.floor(Math.random() * 4)],
                  ),
                r.basket && (r.basket.parent?.remove(r.basket), (r.basket = void 0)),
                (r.bag = ak()),
                r.bag.position.set(0.3, 0.62, 0.05),
                o.rig.root.add(r.bag),
                ccsHoldAdd(o.rig, r.bag, "RightHand"),
                (r.stage = "exit"),
                (r.path = jh(n, o.pos, n.exit))))
            : r.stage === "exit" && ((r.stage = "out"), (r.fade = 0.7));
      (ga(o.rig.root, a), o.rig.root.position.copy(o.pos), Qi(o.rig, i, l, h));
    }
  }
  function lk(i, e) {
    if (!mr()) return;
    let t = sk();
    for (let n of Nn)
      if (!(n.shop || n.sus)) {
        if (((n.life = (n.life ?? 60) - i), !n.leave && n.life < 0 && n.wait <= 0 && !((n.sitT ?? 0) > 0))) {
          n.seat !== void 0 && ((ua[n.seat].who = null), (n.seat = void 0));
          let s = t[0],
            o = 1e9;
          for (let a of t) {
            let c = a.distanceTo(n.pos);
            c < o && ((o = c), (s = a));
          }
          n.leave = s;
          let r = qt.ready ? dl(n.pos, s) : null;
          ((n.path = r && r.length ? r : [s.clone()]), n.target.copy(n.path.shift()));
        }
        if (n.leave) {
          let s = n.pos.distanceTo(n.leave) < 0.9 || n.life < -90,
            o = zn.some((r) => r.door.distanceTo(n.leave) < 0.5);
          if (s && !o && W6(n.pos)) {
            (n.life < -90 && (n.life = -60),
              (n.leave = null),
              (n.life = 8 + Math.random() * 10),
              (n.path = g0(n.pos)),
              n.target.copy(n.path.shift() ?? n.pos));
            continue;
          }
          if (s && n.fadeOut === void 0) {
            ((n.fadeOut = 0.8), n.vel?.set(0, 0, 0));
            continue;
          }
          if (s && (n.fadeOut = (n.fadeOut ?? 0) - i) > 0) continue;
          if (s) {
            ((n.fadeOut = void 0), K.remove(n.rig.root));
            let r = t.filter((c) => c.distanceTo(e.pos) > 14 && !W6(c)),
              a = (r.length ? r : t)[Math.floor(Math.random() * (r.length || t.length))];
            ((n.rig = Zr(Hh(ik++ * 7 + Math.floor(Math.random() * 1e3)))),
              K.add(n.rig.root),
              (n.fadeIn = 0),
              ga(n.rig.root, 0),
              n.name && gE.delete(n.name),
              (n.name = EE()),
              n.pos.copy(a),
              n.vel?.set(0, 0, 0),
              (n.leave = null),
              (n.life = 45 + Math.random() * 110),
              (n.speed = 1.1 + Math.random() * 0.9),
              (n.wait = 0.5),
              (n.path = g0(n.pos)),
              n.target.copy(n.path.shift() ?? n.pos));
          } else !n.path.length && n.target.distanceTo(n.pos) < 0.5 && (n.path = [n.leave.clone()]);
        }
      }
  }
  var Do = null,
    ca = null;
  function hk(i, e) {
    let t = j.started ? _i() : null;
    if (!t) return;
    let n = e && !Se ? Math.hypot(e.pos.x - kn.x, e.pos.z - kn.z) : 999,
      s = n < 28;
    if (s && !Do) {
      let o = t.sampleRate,
        r = Math.floor(o * 6),
        a = t.createBuffer(2, r, o);
      for (let h = 0; h < 2; h++) {
        let f = a.getChannelData(h),
          d = 0,
          u = 0,
          p = 0;
        for (let E = 0; E < r; E++) {
          let g = Math.random() * 2 - 1;
          ((d = 0.997 * d + g * 0.029), (u = 0.985 * u + g * 0.032), (p = 0.95 * p + g * 0.048));
          let y = 0.8 + 0.2 * Math.sin((E / o) * 1.7 + h) * Math.sin((E / o) * 0.63);
          f[E] = (d + u + p + g * 0.05) * 0.5 * y;
        }
        for (let E = 0; E < 220; E++) {
          let g = Math.floor(Math.random() * (r - o * 0.08)),
            y = 500 + Math.random() * 900,
            x = 0.05 + Math.random() * 0.12,
            b = Math.floor(o * (0.02 + Math.random() * 0.05)),
            w = 0;
          for (let v = 0; v < b; v++) {
            let _ = v / o;
            ((w += (2 * Math.PI * (y * (1 + _ * 18))) / o), (f[g + v] += Math.sin(w) * x * Math.exp(-_ * 70)));
          }
        }
        let m = Math.floor(o * 0.2);
        for (let E = 0; E < m; E++) {
          let g = E / m;
          f[E] = f[E] * g + f[r - m + E] * (1 - g);
        }
      }
      ((ca = t.createGain()), (ca.gain.value = 0));
      let c = t.createBiquadFilter();
      ((c.type = "lowpass"), (c.frequency.value = 5200));
      let l = t.createBiquadFilter();
      ((l.type = "highpass"),
        (l.frequency.value = 160),
        ca.connect(t.destination),
        (Do = t.createBufferSource()),
        (Do.buffer = a),
        (Do.loop = !0),
        (Do.loopEnd = 6 - 0.2),
        Do.connect(l).connect(c).connect(ca),
        Do.start());
    }
    if (Do && ca) {
      let o = s ? 0.42 * Math.pow(Math.max(0, 1 - Math.max(0, n - 6) / 22), 1.6) : 0;
      ((ca.gain.value += (o - ca.gain.value) * Math.min(1, i * 2)),
        !s && ca.gain.value < 0.004 && (Do.stop(), (Do = null)));
    }
  }
  var dk = (i) =>
      Math.abs(i.z) > Mt + 0.2 &&
      ((Math.abs(i.x + 46) < 3.6 && i.z > -12 && i.z < 33) || (Math.abs(i.x - 30) < 3.6 && i.z < -2 && i.z > -42)),
    Mr = (i) => Math.abs(i.z) < vn + 0.1 || dk(i),
    qt = { x0: -80, z0: -46, s: 0.5, w: 320, h: 220, walk: new Uint8Array(0), reach: [], side: [], ready: !1 },
    b1 = (i, e) => {
      let t = Math.floor((i - qt.x0) / qt.s),
        n = Math.floor((e - qt.z0) / qt.s);
      return t < 0 || n < 0 || t >= qt.w || n >= qt.h ? -1 : n * qt.w + t;
    },
    Md = (i) => new H(qt.x0 + ((i % qt.w) + 0.5) * qt.s, 0, qt.z0 + (Math.floor(i / qt.w) + 0.5) * qt.s),
    IE = (i, e) => {
      let t = b1(i, e);
      return t >= 0 && qt.walk[t] === 1;
    };
  function fk() {
    let { w: i, h: e, s: t, x0: n, z0: s } = qt,
      o = new Uint8Array(i * e).fill(1),
      r = 0.42,
      a = (u, p, m, E) => {
        let g = Math.max(0, Math.floor((u - m - n) / t)),
          y = Math.min(i - 1, Math.floor((u + m - n) / t)),
          x = Math.max(0, Math.floor((p - E - s) / t)),
          b = Math.min(e - 1, Math.floor((p + E - s) / t));
        for (let w = x; w <= b; w++) for (let v = g; v <= y; v++) o[w * i + v] = 0;
      };
    for (let u of pt) a(u.x, u.z, u.hw + r, u.hd + r);
    for (let u of lo) a(u.x, u.z, 1.05, 1.05);
    let c = new H();
    for (let u = 0; u < e; u++)
      for (let p = 0; p < i; p++) {
        let m = u * i + p;
        if (!o[m]) continue;
        if ((c.set(n + (p + 0.5) * t, 0, s + (u + 0.5) * t), Math.hypot(c.x - kn.x, c.z - kn.z) < 7.31 + 0.8)) {
          o[m] = 0;
          continue;
        }
        if (c.z > Rt - 1.5) {
          o[m] = 0;
          continue;
        }
        if (Math.hypot(c.x - ll.x, c.z - ll.z) < 6.5) {
          o[m] = 0;
          continue;
        }
        if (Mr(c) && !(Math.abs(c.z) < vn + 0.2 && kE.some((y) => Math.abs(c.x - y) < el / 2 - 0.35))) {
          o[m] = 0;
          continue;
        }
      }
    qt.walk = o;
    let l = -1;
    for (let u = -30; u <= 30 && l < 0; u += 0.5)
      for (let p of [-ns, ns]) {
        let m = b1(u, p);
        if (m >= 0 && o[m]) {
          l = m;
          break;
        }
      }
    let h = new Uint8Array(i * e),
      f = [l],
      d = [];
    if (f[0] >= 0 && o[f[0]])
      for (h[f[0]] = 1; f.length;) {
        let u = f.pop();
        d.push(u);
        let p = u % i,
          m = (u / i) | 0;
        for (let [E, g] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          let y = p + E,
            x = m + g;
          if (y < 0 || x < 0 || y >= i || x >= e) continue;
          let b = x * i + y;
          !h[b] && o[b] && ((h[b] = 1), f.push(b));
        }
      }
    for (let u = 0; u < o.length; u++) h[u] || (o[u] = 0);
    ((qt.reach = d.filter((u) => {
      let p = Md(u);
      return Math.abs(p.x) < 66 && p.z > -34 && p.z < 56;
    })),
      (qt.side = d.filter((u) => {
        let p = Md(u);
        return Math.abs(p.z) > vn + 0.6 && Math.abs(p.z) < Mt - 0.4 && Math.abs(p.x) < 64;
      })),
      (qt.ready = !0),
      (window.__nav = { reach: qt.reach.length, side: qt.side.length, seed: l }));
  }
  function FE(i) {
    if (IE(i.x, i.z)) return b1(i.x, i.z);
    for (let e = 1; e < 14; e++)
      for (let t = 0; t < 16; t++) {
        let n = i.x + Math.cos((t / 16) * Math.PI * 2) * e * 0.5,
          s = i.z + Math.sin((t / 16) * Math.PI * 2) * e * 0.5;
        if (IE(n, s)) return b1(n, s);
      }
    return -1;
  }
  var uk = (i, e) => {
      let t = i.distanceTo(e),
        n = Math.ceil(t / 0.2);
      for (let s = 1; s < n; s++) {
        let o = s / n;
        if (!IE(i.x + (e.x - i.x) * o, i.z + (e.z - i.z) * o)) return !1;
      }
      return !0;
    },
    Wc = new Float32Array(0),
    Wp = new Int32Array(0),
    l0 = new Uint32Array(0),
    pk = 0;
  function dl(i, e) {
    let t = performance.now();
    try {
      return mk(i, e);
    } finally {
      let n = window;
      ((n.__navT = (n.__navT ?? 0) + performance.now() - t), (n.__navN = (n.__navN ?? 0) + 1));
    }
  }
  function mk(i, e) {
    let { w: t } = qt,
      n = FE(i),
      s = FE(e);
    if (n < 0 || s < 0) return null;
    Wc.length !== qt.walk.length &&
      ((Wc = new Float32Array(qt.walk.length)),
      (Wp = new Int32Array(qt.walk.length)),
      (l0 = new Uint32Array(qt.walk.length)));
    let o = ++pk,
      r = s % t,
      a = (s / t) | 0,
      c = (x) => {
        let b = Math.abs((x % t) - r),
          w = Math.abs(((x / t) | 0) - a);
        return Math.max(b, w) + 0.414 * Math.min(b, w);
      },
      l = [],
      h = [],
      f = (x, b) => {
        (l.push(x), h.push(b));
        let w = l.length - 1;
        for (; w > 0;) {
          let v = (w - 1) >> 1;
          if (h[v] <= h[w]) break;
          (([l[v], l[w]] = [l[w], l[v]]), ([h[v], h[w]] = [h[w], h[v]]), (w = v));
        }
      },
      d = () => {
        let x = l[0],
          b = l.pop(),
          w = h.pop();
        if (l.length) {
          ((l[0] = b), (h[0] = w));
          let v = 0;
          for (;;) {
            let _ = 2 * v + 1,
              S = _ + 1,
              M = v;
            if ((_ < l.length && h[_] < h[M] && (M = _), S < l.length && h[S] < h[M] && (M = S), M === v)) break;
            (([l[M], l[v]] = [l[v], l[M]]), ([h[M], h[v]] = [h[v], h[M]]), (v = M));
          }
        }
        return x;
      };
    ((l0[n] = o * 2), (Wc[n] = 0), (Wp[n] = -1), f(n, c(n)));
    let u = !1,
      p = 0;
    for (; l.length && p++ < 6e4;) {
      let x = d();
      if (l0[x] === o * 2 + 1) continue;
      if (((l0[x] = o * 2 + 1), x === s)) {
        u = !0;
        break;
      }
      let b = x % t,
        w = (x / t) | 0;
      for (let v = -1; v <= 1; v++)
        for (let _ = -1; _ <= 1; _++) {
          if (!_ && !v) continue;
          let S = b + _,
            M = w + v;
          if (S < 0 || M < 0 || S >= t || M >= qt.h) continue;
          let T = M * t + S;
          if (!qt.walk[T] || l0[T] === o * 2 + 1 || (_ && v && (!qt.walk[w * t + S] || !qt.walk[M * t + b]))) continue;
          let A = Wc[x] + (_ && v ? 1.414 : 1);
          (l0[T] === o * 2 && Wc[T] <= A) || ((l0[T] = o * 2), (Wc[T] = A), (Wp[T] = x), f(T, A + c(T)));
        }
    }
    if (!u) return null;
    let m = [];
    for (let x = s; x >= 0; x = Wp[x]) m.push(Md(x));
    m.reverse();
    let E = [],
      g = i.clone(),
      y = 0;
    for (; y < m.length - 1;) {
      let x = m.length - 1;
      for (; x > y + 1 && !uk(g, m[x]);) x--;
      (E.push(m[x]), (g = m[x]), (y = x));
    }
    return (E.length || E.push(m[m.length - 1]), E);
  }
  function g0(i) {
    if (!qt.ready) return gk(i);
    for (let t = 0; t < 10; t++) {
      let n = Math.random() < 0.6 && qt.side.length ? qt.side : qt.reach;
      if (!n.length) break;
      let s = Md(n[Math.floor(Math.random() * n.length)]);
      if (((s.x += (Math.random() - 0.5) * 0.3), (s.z += (Math.random() - 0.5) * 0.3), s.distanceTo(i) < 5)) continue;
      let o = dl(i, s);
      if (o && o.length) return o;
    }
    let e = FE(i);
    return e >= 0 ? [Md(e)] : [];
  }
  function Y3(i, e) {
    let t = Math.ceil(i.distanceTo(e)),
      n = new H();
    for (let s = 1; s < t; s++) if ((n.lerpVectors(i, e, s / t), Mr(n))) return !1;
    return !0;
  }
  function gk(i) {
    for (let e = 0; e < 30; e++) {
      let t = Math.random(),
        n =
          t < 0.65
            ? new H(-56 + Math.random() * 112, 0, (Math.random() < 0.5 ? -1 : 1) * (ns + (Math.random() - 0.5) * 0.5))
            : t < 0.82
              ? new H(40 + Math.random() * 16, 0, 8 + Math.random() * 12)
              : P0();
      if (ri(n, 0.6) || Mr(n) || n.distanceTo(i) < 3) continue;
      let s = i.z >= 0 ? 1 : -1,
        o = n.z >= 0 ? 1 : -1,
        r = [],
        a = i.clone();
      if (s !== o) {
        let c = (i.x + n.x) / 2,
          l = kE.reduce((u, p) => (Math.abs(p - c) < Math.abs(u - c) ? p : u), kE[0]),
          h = new H(a.x, 0, s * ns),
          f = new H(l, 0, s * ns),
          d = new H(l, 0, o * ns);
        if (Math.abs(a.z - h.z) > 0.4) {
          if (!Y3(a, h)) continue;
          (r.push(h), (a = h));
        }
        (r.push(f, d), (a = d));
      }
      if (!Y3(a, n)) {
        let c = new H(n.x, 0, o * ns);
        if (Math.abs(a.z) < Mt + 0.2 && Y3(c, n)) r.push(c);
        else continue;
      }
      return (r.push(n), r);
    }
    return [new H(i.x + (Math.random() - 0.5) * 6, 0, i.z >= 0 ? ns : -ns)];
  }
  var Z3 = document.getElementById("needs"),
    pI = new H(),
    Q6 = "";
  function Ek(i) {
    if (!Z3) return;
    let e = document.getElementById("needsCard") ?? Z3;
    if (!j.started) {
      e.style.display = "none";
      return;
    }
    e.style.display = "";
    let t = Math.round(z.hunger ?? 100),
      n = Math.round(z.thirst ?? 100),
      s = Math.round(z.energy ?? 100),
      o = Math.round(z.potty ?? 0),
      r = Math.round(z.clean ?? 100),
      a = Ma(),
      c = `${t}|${n}|${s}|${o}|${r}|${a.lvl}|${a.xp}|${j.sleeping}`;
    if (c === Q6) return;
    Q6 = c;
    let l = document.getElementById("poopBtn");
    l && l.classList.toggle("on", o >= 30 && !Se && !j.sleeping);
    let h = (p, m, E, g) =>
        `<span class="nb${g ? " bad" : ""}" title="${p}"><em>${p}</em><b><i style="width:${m}%;background:${E}"></i></b></span>`,
      f = (p) => (p < 20 ? "#e2463f" : p < 50 ? "#f2a33a" : "#5cc24a"),
      d = document.getElementById("nName"),
      u = document.getElementById("nLv");
    (d && (d.textContent = pl[0].name + (j.sleeping ? " 💤" : "")),
      u &&
        ((u.title = `EXP ${Math.floor(a.xp)}/${rd(a.lvl)}`),
        (u.innerHTML = `Lv.${a.lvl} <small>${Math.floor(a.xp)}/${rd(a.lvl)}</small><i style="width:${Math.min(100, Math.round((a.xp / rd(a.lvl)) * 100))}%"></i>`)),
      (Z3.innerHTML = `${h("🍖", t, f(t), t < 15)}${h("💧", n, n < 20 ? "#e2463f" : "#3fa9e8", n < 15)}${h("⚡", s, s < 15 ? "#e2463f" : "#b08cff", s < 15)}${h("💩", o, o > 75 ? "#e2463f" : "#a8744a", o > 75)}${h("🫧", r, r < 35 ? "#e2463f" : "#7fd3f0", r < 30)}`));
  }
  function mi(i, e) {
    (i > 0 && (z.potty = Math.min(100, (z.potty ?? 0) + i * 0.3)),
      (z.hunger = Math.max(0, Math.min(100, (z.hunger ?? 100) + i))),
      (z.thirst = Math.max(0, Math.min(100, (z.thirst ?? 100) + e))));
  }
  function bk(i) {
    ((i.alive = !1),
      (i.sp.visible = i.shadow.visible = !1),
      (i.respawn = i.kind === "bowl" ? 12 : 20 + Math.random() * 20));
    let e = i.pos.clone();
    switch (i.kind) {
      case "food": {
        let t = pi[i.food];
        if (t.stamina < 0) {
          (rt(
            `${t.icon}🚫 เก็บทิ้งแล้ว ปลอดภัย!`,
            e,
            "bad",
          ),
            (j.score += t.score),
            De(`🐾 ${t.note}`, 3200),
            ke("nope"));
          break;
        }
        ((j.score += t.score),
          (z.energy = Math.min(100, z.energy + t.stamina)),
          mi(
            t.water && t.stamina < 4 ? t.stamina : t.stamina * 3,
            t.water ?? (t.name.includes("แตงโม") ? 15 : 0),
          ),
          rt(`${t.icon} +${t.stamina}⚡ อร่อย!`, e),
          Math.random() < 0.6 && De(`🐾 ${t.name}: ${t.note}`, 3e3),
          ke("pop"));
        break;
      }
      case "bone":
        ((j.score += 5), (j.bones += 1), rt("+1 🦴", e));
        break;
      case "poop":
        break;
      case "bowl":
        ((z.energy = Math.min(100, z.energy + 10)),
          mi(0, 40),
          rt("ดื่มน้ำ +40💧", e, "cool"));
        break;
    }
  }
  var gT,
    ET = !0,
    xk = Math.PI,
    Fn = "",
    $c = it("act"),
    K3 = it("bar"),
    js = it("panel"),
    Ea = it("pbody"),
    yk = it("ptitle"),
    Ad = null,
    C0 = () => js.classList.contains("on");
  $c.addEventListener("click", () => Ad?.());
  // v86: เลือกของในกระเป๋าได้ทุกอุปกรณ์ — คีย์บอร์ด: เลข 1-9 เลือกช่อง, 0/Esc ยกเลิก, Z/X เลื่อนซ้าย-ขวา · จอย: D-pad ◀▶ ▼
  function ccsBagCycle(i) {
    let e = Object.entries(z.inv)
      .filter(([, n]) => n > 0)
      .map(([n]) => n);
    if (!e.length) return (De("กระเป๋าว่าง \xB7 จับแมลง เก็บไข่ไก่ แล้วเอาไปส่งขาย", 1600), void 0);
    if (i === 0) Fn = "";
    else if (typeof i == "string") Fn = i;
    else {
      let n = e.indexOf(Fn);
      Fn = n < 0 ? e[i > 0 ? 0 : e.length - 1] : e[(n + i + e.length) % e.length];
    }
    (Ei(), ke("pop"), De(Fn ? `${zE(Fn)} เลือก${e4(Fn)} ×${z.inv[Fn]} \xB7 เดินไปที่ลังส่งของ/เพื่อน/แปลงผัก แล้วกดปุ่มใช้` : "ยกเลิกการเลือกของ", 1800));
    let n = K3.querySelector(".slot.on");
    n?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  }
  addEventListener("keydown", (i) => {
    if (!j.started || C0() || i.target?.tagName === "INPUT" || i.target?.tagName === "TEXTAREA") return;
    let e = i.key;
    if (/^[1-9]$/.test(e)) {
      let t = Object.entries(z.inv).filter(([, n]) => n > 0)[+e - 1];
      t && ccsBagCycle(Fn === t[0] ? 0 : t[0]);
    } else (e === "0" || (e === "Escape" && Fn)) ? ccsBagCycle(0) : e === "z" || e === "Z" ? ccsBagCycle(-1) : (e === "x" || e === "X") && ccsBagCycle(1);
  });
  addEventListener("keydown", (i) => {
    (i.key === "f" || i.key === "F" || i.key === "Enter") && j.started && !C0() && (i.preventDefault(), Ad?.());
  });
  it("pclose").addEventListener("click", () => {
    (js.classList.remove("on"), js.classList.remove("dress"), (uo = !1));
  });
  it("friendsBtn").addEventListener("click", eP);
  var e4 = (i) => ti(i).name,
    zE = (i) => ti(i).icon,
    J3 = (i) => !!i && !i.startsWith("seed") && ti(i).sell > 0;
  function Ei() {
    let i = Object.entries(z.inv).filter(([, e]) => e > 0);
    (Fn && !z.inv[Fn] && (Fn = ""), (K3.innerHTML = ""));
    for (let [e, t] of i) {
      let n = document.createElement("button");
      ((n.className = `slot${e === Fn ? " on" : ""}${e.startsWith("seed") ? " seed" : ""}`),
        (n.innerHTML = `<span>${zE(e)}</span>${e.startsWith("seed") ? `<em>${so(e.split(":")[1]).icon}</em>` : ""}<b>${t}</b>${K3.children.length < 9 ? `<i class="kn">${K3.children.length + 1}</i>` : ""}`),
        (n.title = e4(e)),
        n.addEventListener("click", () => {
          ((Fn = Fn === e ? "" : e), Ei(), Fn && De(e4(Fn), 1200));
        }),
        K3.appendChild(n));
    }
    i.length ||
      (K3.innerHTML =
        '<div class="empty">กระเป๋าว่าง \xB7 จับแมลง เก็บไข่ไก่ แล้วเอาไปส่งขาย</div>');
  }
  function Tr(i) {
    return z.energy < i
      ? (De(
          "เหนื่อยแล้ว 😵 ไปนอนพัก หรือกินขนมก่อนนะ",
          2600,
        ),
        !1)
      : ((z.energy -= i), !0);
  }
  function nt(i, e, t = !1) {
    ($c.dataset.label !== i && (($c.dataset.label = i), ($c.innerHTML = i)),
      $c.classList.toggle("off", t || !e),
      $c.classList.toggle("hide", !i),
      (Ad = t ? null : e));
  }
  function Mk(i) {
    if (ET) return -1;
    let e = Math.round((i.x - Gt.x) / Gt.size + (Gt.cols - 1) / 2),
      t = Math.round((i.z - Gt.z) / Gt.size + (Gt.rows - 1) / 2);
    return e < 0 || t < 0 || e >= Gt.cols || t >= Gt.rows ? -1 : t * Gt.cols + e;
  }
  function Tk(i) {
    ccsClawDaily();
    let e = i.pos;
    if (Rn && Se === Rn) {
      if (j.sleeping) return nt("☀️ ตื่นนอน", () => y4());
      if (e.distanceTo(Rn.exit) < 1.4)
        return nt("🚪 ออกจากบ้าน", () => WH());
      if (e.distanceTo(Rn.bed) < 1.6) {
        let h = j.time > 0.78 || j.time < 0.2;
        return nt(
          h
            ? "🌙 นอนหลับถึงเช้า"
            : "💤 งีบบนเตียง",
          () => (h ? jH() : qH()),
        );
      }
      if (Rn.cabinets) {
        let h = Rn.cabinets.slice(0, ccsCabN()).find((f) => {
          let d = f.group.getWorldPosition(new H());
          return Math.hypot(e.x - (d.x - 0.7), e.z - d.z) < 1.5;
        });
        if (h) {
          let f = ccsAlbAll(),
            d = new Set(z.plush ?? []);
          return nt(`📒 สมุดสะสมตุ๊กตา (${f.filter((u) => d.has(u)).length}/${f.length})`, ccsAlbum);
        }
      }
      return e.distanceTo(Rn.bowls) < 1.4 && ya() > 0 && k0("cook") < ul.cook && (z.hunger ?? 100) < 90
        ? nt(
            `🍳 ทำไข่ต้มให้น้อง (ไข่ 1 \xB7 วันนี้อีก ${ul.cook - k0("cook")})`,
            () => {
              M1(1) &&
                (y1("cook"),
                mi(30, 0),
                (z.energy = Math.min(100, (z.energy ?? 0) + 15)),
                ke("pop"),
                rt(
                  "🥚 ไข่ต้มหอม ๆ +30🍖 +15⚡",
                  e.clone().setY(1.2),
                  "big",
                ),
                _t(z));
            },
          )
        : e.distanceTo(Rn.bowls) < 1.4
          ? nt(
              z.homeFed === z.day
                ? "💧 ดื่มน้ำในชาม"
                : "🥣 กินข้าว + ดื่มน้ำ",
              () => {
                let h = z.homeFed !== z.day;
                ((z.homeFed = z.day),
                  mi(h ? 45 : 0, 60),
                  ke("water"),
                  rt(
                    h ? "🥣 อิ่ม! +45🍖 +60💧" : "💧 +60",
                    e.clone().setY(1.2),
                    "cool",
                  ),
                  _t(z));
              },
            )
          : nt("", null);
    }
    if (!Se && e.distanceTo(mo) < 2.2)
      return nt("🚪 เข้าบ้าน", () => JE());
    if (Se) {
      let h = Se,
        f = zn.find((d) => d.inside === h);
      if (e.distanceTo(h.exit) < 1.4)
        return nt("🚪 ออกจากร้าน", () => TT(f));
      for (let d of h.wares)
        if (e.distanceTo(d.pos) < 1.15) {
          let u = d.key.startsWith("hat:") && (z.hats ?? []).includes(d.key.slice(4));
          return nt(
            u
              ? pb(d.key.slice(4))
                ? `🙈 ถอด ${d.label}`
                : `👒 ใส่ ${d.label}`
              : `🛒 ${d.label} \xB7 ${d.price}💰`,
            () => P1(d),
          );
        }
      {
        let d = zn.find((u) => u.inside === h);
        if (d && d.def.id === "petshop" && vT.some((u) => e.distanceTo(u) < 1.6))
          return nt(
            "🐶 ดูน้องในคอก \xB7 รับเลี้ยง",
            () => gb(d),
          );
      }
      {
        let d = zn.find((u) => u.inside === h);
        if (d && e.distanceTo(h.keeperSpot) < 3.4)
          return nt(
            "🛍 คุยกับเจ้าของร้าน \xB7 ดูเมนู",
            () => {
              (Ln(
                h.keeperSpot,
                [
                  "ยินดีต้อนรับจ้า! เลือกดูได้เลย",
                  "วันนี้มีของใหม่นะ",
                  "อยากได้อะไรบอกได้เลยจ้า",
                ][Math.floor(Math.random() * 3)],
              ),
                v1(d));
            },
          );
      }
      return e.distanceTo(h.keeperSpot) < 3.2
        ? nt(
            "💬 คุยกับเจ้าของร้าน",
            () =>
              Ln(
                h.keeperSpot,
                [
                  "ยินดีต้อนรับจ้า! เดินไปดูของที่ชั้นได้เลย",
                  "วันนี้มีของใหม่นะ",
                  "ขนฟูน่ากอดจริง ๆ",
                  "เลือกตามสบายเลยจ้า",
                ][Math.floor(Math.random() * 4)],
              ),
          )
        : nt("", null);
    }
    if ((!Se && NC(e)) || (!Se && $4(e)) || (!Se && Z4(e))) return;
    if (!Se) {
      let h = cn.digs.findIndex((f, d) => d < wE() && !f.got && f.p.distanceTo(e) < (cn.on ? 1.5 : 0.9));
      if (h >= 0)
        return nt(
          "⛏ ขุดตรงนี้ (กลิ่นแรงมาก!)",
          () => iC(h, i),
        );
    }
    for (let h of zn)
      if (e.distanceTo(h.door) < 2) return nt(`🚪 เข้า${h.def.name}`, () => MT(h));
    {
      let h = -1,
        f = 1.3;
      if (
        (ma.forEach((d, u) => {
          let p = d.pos.distanceTo(e);
          p < f && ((f = p), (h = u));
        }),
        h >= 0)
      )
        return nt(
          "🥚 เก็บไข่ที่แม่ไก่เพิ่งออก",
          () => {
            let d = ma[h]?.m.userData.ring;
            (d && K.remove(d), yT(h));
          },
        );
    }
    if (e.distanceTo(Ti) < 4.3) {
      if (z.eggs > 0)
        return nt(`🥚 เก็บไข่ \xD7${z.eggs}`, () => {
          ((z.inv.egg = (z.inv.egg ?? 0) + z.eggs),
            rt(`+${z.eggs} 🥚`, Ti),
            (z.eggs = 0),
            wd(),
            ke("coin"),
            Ei(),
            _t(z));
        });
      if (z.hatch) {
        if (z.chickens === 0 || z.fed >= z.chickens)
          return nt(
            "🐣 แม่ไก่กำลังกกไข่ พรุ่งนี้ฟัก",
            null,
            !0,
          );
      } else if (ya() > 0 && z.chickens < 4 && (z.chickens === 0 || z.fed >= z.chickens))
        return nt(
          "🐣 วางไข่ให้แม่ไก่กก (ฟักเป็นลูกไก่พรุ่งนี้)",
          () => {
            M1(1) &&
              ((z.hatch = 1),
              wd(),
              ke("pop"),
              rt(
                "🥚 → 🐣 พรุ่งนี้!",
                Ti.clone().setY(1.2),
                "cool",
              ),
              De(
                "แม่ไก่นั่งกกไข่แล้ว พรุ่งนี้เช้าจะมีลูกไก่ 🐣 (ฟักได้ทีละฟอง)",
                2600,
              ),
              _t(z));
          },
        );
      return z.chickens === 0
        ? nt(
            "🐔 เล้าไก่ (ซื้อลูกไก่ที่ร้านของชำ หรือเอาไข่มาฟัก)",
            null,
            !0,
          )
        : z.fed < z.chickens
          ? nt("🌾 ให้อาหารไก่", () => {
              Tr(1) &&
                ((z.fed = z.chickens),
                ke("pop"),
                rt("ไก่อิ่มแล้ว 🐔", Ti),
                De(
                  "พรุ่งนี้เช้าไก่จะออกไข่ 🥚",
                  2e3,
                ));
            })
          : nt("🐔 ไก่อิ่มแล้ว", null, !0);
    }
    let t = Math.hypot(e.x - kn.x, e.z - kn.z);
    for (let h of fb)
      if (h.alive && h.sp.position.distanceTo(Xt.set(e.x, h.sp.position.y, e.z)) < 1.8)
        return nt(`🥅 จับ${Gc[h.kind].name}`, () => _k(h));
    if (e.distanceTo(Oc) < 2.2)
      return J3(Fn)
        ? nt(`📦 ส่งขาย ${zE(Fn)}\xD7${z.inv[Fn]}`, () => {
            ((z.ship[Fn] = (z.ship[Fn] ?? 0) + z.inv[Fn]),
              (z.inv[Fn] = 0),
              Ei(),
              ke("coin"),
              De(
                "ใส่ลังแล้ว พรุ่งนี้เช้าได้เงิน 💰",
                2200,
              ),
              _t(z));
          })
        : Object.keys(z.inv).filter((f) => J3(f) && z.inv[f] > 0).length
          ? nt("📦 ส่งขายทั้งหมด", () => {
              for (let f of Object.keys(z.inv))
                J3(f) && z.inv[f] > 0 && ((z.ship[f] = (z.ship[f] ?? 0) + z.inv[f]), (z.inv[f] = 0));
              (Ei(),
                ke("coin"),
                De(
                  "ใส่ลังหมดแล้ว พรุ่งนี้เช้าได้เงิน 💰",
                  2200,
                ),
                _t(z));
            })
          : nt("📦 ลังส่งของ", () =>
              De(
                "เก็บผัก ปลา แมลง หรือไข่ แล้วมาใส่ลังนี้ ได้เงินตอนเช้า",
                2600,
              ),
            );
    if (e.distanceTo(vH) < 1.6)
      return nt(
        "🐟 ซื้อปลาลุงทะเล \xB7 ดูเมนู",
        () =>
          dd(
            "ปลาสดลุงทะเล 🐟",
            Yk,
            od.clone().setY(od.y + 2.4),
          ),
      );
    if (e.distanceTo(fn.clone().setZ(fn.z - 1.4)) < 1.8 || e.distanceTo(fn) < 2)
      return nt(
        "🍗 สั่งไก่ย่างป้าอู้ด \xB7 ดูเมนู",
        () =>
          dd(
            "ไก่ย่างป้าอู้ด 🍗",
            Xk,
            fn.clone().setY(2.2),
            "sell",
          ),
      );
    {
      let h = ni.clone().add(new H(Math.sin(In) * 1.4, 0, Math.cos(In) * 1.4));
      if (e.distanceTo(h) < 1.9)
        return nt(
          "🥐 ลุงปั้ม Bakery \xB7 ดูเมนู",
          () => dd("ลุงปั้ม Bakery 🥨", DE, ni.clone().setY(2.4), "trade"),
        );
    }
    if (Math.hypot(e.x - kn.x, e.z - kn.z) < 8.4)
      return nt("💧 ดื่มน้ำบ่อ", () => {
        (mi(0, 30), ke("water"), rt("💧 +30", e.clone().setY(1), "cool"));
      });
    if (HA(e)) return;
    if (!Se && e.distanceTo(Hr) < 2.4)
      return nt(
        "📋 ดูบอร์ดงาน (หาเงิน)",
        _A,
      );
    if (Cr && !Se) {
      for (let h of Cr.stations)
        if (e.distanceTo(h.start) < 1.25) {
          let f = Ma();
          let d = z.trainStars?.[h.id] ?? 0;
          return nt(`${h.icon} ${h.name} ${"⭐".repeat(d)}${"☆".repeat(3 - d)} · ลงทะเบียนกับครูฝึกที่ทางเข้า`, ccsTRMenu);
        }
    }
    if ((ccsClawUI(), Oo)) {
      let h = Oo;
      return h.dropped
        ? nt("🕹 กำลังคีบ…", null, !0)
        : nt(`⬇️ ปล่อยคีบ! (${Math.ceil(h.t)} วิ)`, () =>
            fE(),
          );
    }
    if (ccsRide) return nt(ccsRide.k >= 0 ? "🎡 กำลังชมวิว… ลากจอ/จอยขวา หมุนมุมมอง" : "🎡 กำลังขึ้นกระเช้า…", null, !0);
    if (ccsFW && !Se && e.distanceTo(ccsFW.gate) < 2.2)
      return nt("🎡 ขึ้นชิงช้าสวรรค์ชมวิว 50💰", ccsRideStart);
    if (ccsPierEnd(e) && ccsWh) {
      let h = ccsWh.pods.find((f) => f.k === "orca");
      if (ccsOrcaBeg() && (z.bait?.salmon ?? 0) > 0 && !ccsBaitFly) return nt(`🐟 ป้อนแซลมอนเข้าปากออร์กา (มี ${z.bait.salmon})`, () => ccsWhaleThrow("salmon"));
      return h && (h.mode === "linger" || h.mode === "beg") && Object.values(z.bait ?? {}).every((f) => !(f > 0))
        ? nt("🐳 เล่นกับออร์กา", ccsOrcaPlay)
        : nt(`🐳 ให้อาหารปลาวาฬ · ${Object.entries(z.bait ?? {}).filter(([, f]) => f > 0).map(([f, d]) => ccsBaitDef[f].icon + d).join(" ") || "ยังไม่มีเหยื่อ"}${h && (h.mode === "linger" || h.mode === "beg") ? " · เล่นกับออร์กา" : ""}`, ccsWhaleMenu);
    }
    if (ccsBowl && e.distanceTo(ccsBowl.p) < 1.3) return nt("🥣 ทำขนมบัฟ (ชามผสม)", ccsTreatMenu);
    if (ccsFreeGift && e.distanceTo(ccsFreeGift.p) < 1.3)
      return nt({ chick: "🍗 กินไก่ย่างฟรี (หมวกลูกไก่)", santa: "🎁 เปิดกล่องของขวัญ (หมวกซานต้า)", pumpkin: "🥧 กินพายฟักทองฟรี (หมวกฟักทอง)" }[ccsFreeGift.k], () => ccsGiftTake(e));
    if ((ccsTRMakeNpc(), ccsTRNpc && !Se && !ho && e.distanceTo(ccsTRNpc.pos) < 2))
      return nt(ccsTROpen() ? "🏅 คุยกับครูฝึกพี่ต้น · เลือกคอร์สฝึก" : "🔒 สนามฝึกปิดแล้ว (เปิด 08:00-19:00)", ccsTROpen() ? ccsTRMenu : null, !ccsTROpen());
    if (ccsPK) return nt(`⚽ ดวลจุดโทษ ${ccsPK.me.filter(Boolean).length}:${ccsPK.cpu.filter(Boolean).length}`, null, !0);
    if (ccsPKNpc && !Se && e.distanceTo(ccsPKNpc.pos) < 1.9) {
      let h = ccsPKFoe();
      return nt(`⚽ ท้าดวลจุดโทษกับ${h.n} (${h.lv})${z.pkWin?.[h.n] === z.day ? "" : ` · ชนะได้ ${h.pay}💰`}`, ccsPKStart);
    }
    if (ccsBooth && !Se && e.distanceTo(ccsBooth.front) < 1.6)
      return nt("🎟 ซื้อตั๋วชิงช้าสวรรค์ 50💰 แล้วขึ้นเลย", ccsRideStart);
    for (let h of gl)
      if (e.distanceTo(h.front) < 1.3) {
        let f = h.c;
        return f.busy()
          ? nt("🕹 กำลังคีบ…", null, !0)
          : f.prizes.length
            ? nt(`🕹 เล่นตู้คีบ 20💰 · วันนี้: ${ccsClawPair().map((u) => Rp[u] ?? u).join(" + ")} (เหลือ ${f.prizes.length})`, () => {
                if (z.money < 20) {
                  (De(
                    "เงินไม่พอ ต้องมี 20 💰",
                    1800,
                  ),
                    ke("nope"));
                  return;
                }
                ((z.money -= 20),
                  ke("coin"),
                  Ei(),
                  (Oo = { k: h, t: 30, dropped: !1, yaw0: j.yaw }),
                  f.steer(f.pos().x, f.pos().y),
                  De(
                    "🕹 เลื่อนจอย/ลูกศร เล็งกรงเล็บ · ลากจอ/จอยขวา/Q-E หมุนดูด้านข้าง · ⬇️ ปล่อยคีบ · ✖ ยกเลิก (Esc/Ⓑ) คืนเงิน (30 วิ)",
                    3600,
                  ));
              })
            : nt(
                "🧸 ตู้ว่างแล้ว พรุ่งนี้มาใหม่",
                null,
                !0,
              );
      }
    {
      let h = null,
        f = 1.9;
      for (let d of Nn) {
        let u = d.pos.distanceTo(e);
        u < f && ((f = u), (h = d));
      }
      if (h) {
        let d = h;
        return nt(`👋 ทักทาย${d.name ?? ""} (โฮ่ง!)`, () => {
          (Uc(),
            (d.wait = Math.max(d.wait, 2.5)),
            d.vel?.multiplyScalar(0),
            rt("💕", d.pos.clone().setY(1.9)),
            ke("heart"),
            Ln(d.pos, XM()),
            (j.score += 1),
            Ai("greet"),
            bi.offerDay !== I0() && !d.sus && Math.random() < 0.35 && setTimeout(() => J4(d, i), 900));
        });
      }
    }
    let n = null,
      s = 2.2;
    for (let h of El) {
      let f = h.pos.distanceTo(e);
      f < s && ((s = f), (n = h));
    }
    if (n) {
      let h = n;
      return nt(
        `🤚 ทักทาย/ลูบหัว${h.def.name}`,
        () => {
          (Uc(),
            (h.wait = Math.max(h.wait, 2.5)),
            (h.spd = 0),
            rt("💕", h.pos.clone().setY(1.2)),
            ke("heart"),
            De(
              `🐶 ${h.def.name} (${h.def.kind}): ${h.def.lines[Math.floor(Math.random() * h.def.lines.length)]}`,
              2800,
            ),
            h.petT <= 0 && ((j.score += 3), (z.energy = Math.min(100, z.energy + 3)), (h.petT = 30)));
        },
      );
    }
    let o = null,
      r = 2.3;
    for (let h of wi) {
      let f = h.pos.distanceTo(e);
      f < r && ((r = f), (o = h));
    }
    if (o) {
      let h = wi.indexOf(o),
        f = es[h];
      return Fn && ti(Fn).giftable
        ? nt(`🎁 ให้${f.name} ${zE(Fn)}`, () => bT(h, o))
        : z.request?.npc === h && !z.request.accepted
          ? nt(`📜 รับเควสจาก${f.name}`, () => t4(h, o))
          : nt(`💬 ทักทาย${f.name}`, () => {
              (Uc(), t4(h, o));
            });
    }
    let a = Mk(e);
    if (a < 0) return nt("", null);
    let c = z.tiles[a];
    if (c.state === "grass")
      return nt(
        z.tools.hoe
          ? "⛏✨ ถางดิน \xD73"
          : "⛏ ถางดิน",
        () => {
          if (!Tr(z.tools.hoe ? 5 : 4)) return;
          let h = a % Gt.cols;
          for (let f of z.tools.hoe ? [-1, 0, 1] : [0]) {
            let d = h + f;
            d >= 0 && d < Gt.cols && (z.tiles[a + f].state = "soil");
          }
          (ke("dig"), rt("⛏", Nc(a)));
        },
      );
    if (!c.crop) {
      if (!Fn.startsWith("seed:"))
        return nt(
          "🌱 เลือกเมล็ดก่อน",
          null,
          !0,
        );
      let h = so(Fn.split(":")[1]);
      return nt(`🌱 ปลูก${h.name}`, () => {
        if (h.season !== z.season) {
          De(
            `${h.name} ปลูกได้แค่${Us[h.season].name}นะ`,
            2400,
          );
          return;
        }
        Tr(1) &&
          ((c.crop = h.id),
          (c.growth = 0),
          (c.dead = !1),
          (c.watered = z.rainToday),
          (z.inv[Fn] -= 1),
          Ei(),
          ke("pop"),
          rt("ปลูกแล้ว 🌱", Nc(a)));
      });
    }
    let l = so(c.crop);
    return c.dead
      ? nt(
          "🧹 ถอนต้นที่เหี่ยว",
          () => {
            Tr(1) && ((c.crop = null), (c.dead = !1));
          },
        )
      : c.growth >= l.days
        ? nt(`🧺 เก็บ${l.name}`, () => {
            if (!Tr(1)) return;
            let h = `crop:${l.id}`;
            ((z.inv[h] = (z.inv[h] ?? 0) + 1),
              (c.crop = null),
              (c.growth = 0),
              (j.score += 15),
              Ei(),
              ke("pop"),
              rt(`+1 ${l.icon}`, Nc(a)),
              _t(z));
          })
        : c.watered
          ? nt(`${l.icon} อีก ${l.days - c.growth} วัน`, null, !0)
          : nt(
              z.tools.can
                ? "💧✨ รดน้ำ 3\xD73"
                : "💧 รดน้ำ",
              () => {
                if (!Tr(z.tools.can ? 3 : 2)) return;
                let h = a % Gt.cols,
                  f = Math.floor(a / Gt.cols),
                  d = z.tools.can ? 1 : 0;
                for (let u = -d; u <= d; u++)
                  for (let p = -d; p <= d; p++) {
                    let m = h + p,
                      E = f + u;
                    if (m >= 0 && E >= 0 && m < Gt.cols && E < Gt.rows) {
                      let g = z.tiles[E * Gt.cols + m];
                      g.crop && (g.watered = !0);
                    }
                  }
                (ke("water"), rt("💧", Nc(a), "cool"));
              },
            );
  }
  function t4(i, e) {
    let t = es[i];
    if (z.request?.npc === i && !z.request.accepted) {
      ((z.request.accepted = !0),
        k1(),
        ke("heart"),
        Ln(
          e.pos,
          `ช่วยหา${ti(z.request.good).name}ให้หน่อยนะ ${ti(z.request.good).icon} ให้ค่าขนม ${z.request.reward}💰`,
        ),
        De(
          `📜 รับเควสแล้ว: หา ${ti(z.request.good).icon} ${ti(z.request.good).name} ไปให้${t.name}`,
          3e3,
        ),
        _t(z));
      return;
    }
    if (z.talked[i]) {
      Ln(
        e.pos,
        Math.random() < 0.7
          ? t.lines[Math.floor(Math.random() * t.lines.length)]
          : t1[Math.floor(Math.random() * t1.length)],
      );
      return;
    }
    if (((z.talked[i] = 1), (z.hearts[i] = Math.min(10, z.hearts[i] + 1)), ke("heart"), z.request?.npc === i)) {
      (Ln(
        e.pos,
        `ช่วยหา${ti(z.request.good).name}ให้หน่อยนะ ${ti(z.request.good).icon}`,
      ),
        rt("♥ +1", e.pos, "big"));
      return;
    }
    let n = ti(t.like);
    (Ln(
      e.pos,
      Math.random() < 0.35
        ? `ชอบ${n.name}ที่สุดเลย ${n.icon}`
        : Math.random() < 0.7
          ? t.lines[Math.floor(Math.random() * t.lines.length)]
          : t6[Math.floor(Math.random() * t6.length)],
    ),
      rt("♥ +1", e.pos, "big"));
  }
  function bT(i, e) {
    let t = es[i];
    if (z.gifted[i]) {
      Ln(
        e.pos,
        "วันนี้ให้แล้วจ้า ขอบใจนะ",
      );
      return;
    }
    let n = Fn,
      s = n === t.like;
    if (((z.inv[n] -= 1), z.request && z.request.npc === i && z.request.good === n)) {
      ((z.money += z.request.reward),
        (z.hearts[i] = Math.min(10, z.hearts[i] + 2)),
        Ln(
          e.pos,
          `ขอบคุณมาก! นี่ค่าตอบแทน ${z.request.reward} 💰`,
        ),
        rt(`+${z.request.reward}💰 +20 EXP ♥+2`, e.pos, "big"),
        ke("coin"),
        (z.request = null),
        k1(),
        Rs(20, Le[0]),
        Ei(),
        _t(z));
      return;
    }
    z.gifted[i] = 1;
    let o = s ? 3 : 1;
    ((z.hearts[i] = Math.min(10, z.hearts[i] + o)),
      Ln(
        e.pos,
        s
          ? `ว้าว ${ti(n).name}! ของโปรดเลย 😍`
          : "ขอบใจนะ น่ารักจัง",
      ),
      ke("heart"),
      rt(`♥ +${o}`, e.pos, "big"),
      Ei(),
      _t(z));
  }
  function Gi(i, e) {
    (sb(),
      e.includes("wtabs") || (js.classList.remove("dress"), (uo = !1)),
      (yk.textContent = i),
      (Ea.innerHTML = e),
      js.classList.add("on"));
  }
  var $h;
  function xT() {
    if (!Tr(2)) return;
    (kp(_i(), 0.35),
      Gi(
        "ตกปลา 🎣",
        '<div class="fish"><div class="water"><div class="bob" id="bob"></div><div class="ripple"></div></div><p id="fmsg">รอปลากินเหยื่อ…</p><button class="bigbtn" id="reel">ดึง!</button></div>',
      ));
    let i = it("bob"),
      e = it("fmsg"),
      t = it("reel"),
      n = !1,
      s = !1;
    clearTimeout($h);
    let o = 1200 + Math.random() * (z.tools.rod ? 1600 : 2800);
    (($h = setTimeout(() => {
      ((n = !0),
        i.classList.add("bite"),
        (e.textContent =
          "ปลากินเหยื่อ! กดเลย!"),
        ke("pop"),
        ($h = setTimeout(
          () => {
            s ||
              ((n = !1),
              i.classList.remove("bite"),
              (e.textContent = "ปลาหนีไปแล้ว 😢"),
              ke("nope"),
              (s = !0),
              (t.textContent = "ลองอีกครั้ง"));
          },
          z.tools.rod ? 1300 : 850,
        )));
    }, o)),
      t.addEventListener("click", () => {
        if (s) {
          (js.classList.remove("on"), xT());
          return;
        }
        if (!n) {
          ((s = !0),
            clearTimeout($h),
            (e.textContent =
              "ดึงเร็วไป ปลาตกใจหนี 💦"),
            (t.textContent = "ลองอีกครั้ง"),
            ke("nope"));
          return;
        }
        ((s = !0), clearTimeout($h));
        let r = T3.map((h) => ({ f: h, w: h.w * (z.tools.rod && h.id === "gold" ? 3 : 1) })),
          a = Math.random() * r.reduce((h, f) => h + f.w, 0),
          c = r[0].f;
        for (let h of r)
          if (((a -= h.w), a <= 0)) {
            c = h.f;
            break;
          }
        let l = `fish:${c.id}`;
        ((z.inv[l] = (z.inv[l] ?? 0) + 1),
          (j.score += 20),
          Ai("fish"),
          (e.innerHTML = `ได้<b>${c.name}</b> ${c.icon}! ${c.id === "gold" ? "หายากมาก ✨" : ""}`),
          (t.textContent = "ตกต่อ"),
          i.classList.remove("bite"),
          (i.textContent = c.icon),
          ke("catch"),
          Ei(),
          _t(z));
      }));
  }
  var fb = [];
  function wk(i) {
    let e = document.createElement("canvas");
    e.width = e.height = 96;
    let t = e.getContext("2d");
    ((t.font = "72px serif"), (t.textAlign = "center"), (t.textBaseline = "middle"), t.fillText(i, 48, 54));
    let n = new ut(e);
    return ((n.colorSpace = Ye), n);
  }
  function vk() {
    let i = Gc.map((e) => wk(e.icon));
    for (let e = 0; e < 9; e++) {
      let t = e < 5 ? 0 : e < 8 ? 1 : 2,
        n = LA(i[t], 0.7, 0.7);
      fb.push({ sp: n, kind: t, home: P0(), t: Math.random() * 10, alive: !0, respawn: 0 });
    }
  }
  function Rk(i) {
    let e = j.time % 1 < 0.22 || j.time % 1 > 0.84;
    for (let t of fb) {
      (t.alive || ((t.respawn -= i), t.respawn <= 0 && ((t.alive = !0), t.home.copy(P0()))), (t.t += i));
      let n = t.alive && (t.kind === 2 ? e : !e) && !document.body.classList.contains("raining");
      ((t.sp.visible = n),
        t.sp.position.set(
          t.home.x + Math.sin(t.t * 0.7) * 2,
          0.8 + Math.abs(Math.sin(t.t * 5)) * 0.3,
          t.home.z + Math.cos(t.t * 0.5) * 2,
        ),
        (t.sp.material.rotation = Math.sin(t.t * 10) * 0.2));
    }
  }
  function _k(i) {
    if (i.sp.visible && Tr(1))
      if (Math.random() < (i.kind === 2 ? 0.55 : 0.75)) {
        ((i.alive = !1), (i.respawn = 25 + Math.random() * 30), (i.sp.visible = !1));
        let e = `bug:${Gc[i.kind].id}`;
        ((z.inv[e] = (z.inv[e] ?? 0) + 1),
          (j.score += 10),
          ke("catch"),
          rt(`จับได้ ${Gc[i.kind].icon}`, i.sp.position.clone()),
          Ei());
      } else
        (ke("nope"),
          rt(
            "พลาด! บินหนีไปแล้ว",
            i.sp.position.clone(),
            "bad",
          ),
          i.home.copy(P0()));
  }
  var w0 = 3.4,
    v0 = 2.9,
    qp = 1.5;
  function Sk() {
    let i = Ti,
      e = 1.35,
      t = ze("fence_seg"),
      n = new X({ color: 9067051, roughness: 0.85 }),
      s = (y, x, b, w) => {
        let v = Math.hypot(b - y, w - x);
        if (v < 0.05) return;
        let _ = Math.max(1, Math.round(v / e)),
          S = v / (_ * e),
          M = Math.atan2(b - y, w - x);
        for (let A = 0; A < _; A++) {
          let F = (A + 0.5) / _,
            C = y + (b - y) * F,
            P = x + (w - x) * F,
            I;
          if (t) ((I = je("fence_seg")), I.scale.set(1, 1, S));
          else {
            ((I = new R(new ee(0.06, 0.7, e * S), n)), (I.position.y = 0.35));
            let k = new J();
            (k.add(I), (I = k));
          }
          ((I.position.x = C),
            (I.position.z = P),
            (I.rotation.y = M),
            I.traverse((k) => {
              ((k.castShadow = !0), (k.receiveShadow = !0));
            }),
            K.add(I));
        }
        let T = Math.abs(b - y) < 0.01;
        pt.push({ x: (y + b) / 2, z: (x + w) / 2, hw: T ? 0.08 : v / 2, hd: T ? v / 2 : 0.08, low: !0 });
      },
      o = i.x - w0,
      r = i.x + w0,
      a = i.z - v0,
      c = i.z + v0;
    (s(o, c, r, c), s(o, a, o, c), s(r, a, r, c), s(o, a, i.x - qp / 2, a), s(i.x + qp / 2, a, r, a));
    for (let y of [-1, 1]) {
      let x = new R(new ee(0.12, 1.25, 0.12), n);
      (x.position.set(i.x + (y * qp) / 2, 0.62, a), (x.castShadow = !0), K.add(x));
    }
    let l = new R(new ee(qp + 0.24, 0.1, 0.12), n);
    (l.position.set(i.x, 1.25, a), K.add(l));
    let h = new R(
      new Te(1.1, 0.34),
      new be({ map: ei("เล้าไก่ 🐔", 16774885, 9067051, 256, 80), side: Ke }),
    );
    (h.position.set(i.x, 1.47, a - 0.01), (h.rotation.y = Math.PI), K.add(h));
    let f = new R(new ee(0.06, 0.16, 0.06), n);
    (f.position.set(i.x, 1.33, a), K.add(f));
    let d = new X({ color: 11039807, roughness: 0.8 }),
      u = new X({ color: 15779678, roughness: 0.95 }),
      p = new J(),
      m = 2.2,
      E = new R(new ee(m, 0.05, 0.4), d);
    ((E.position.y = 0.22), p.add(E));
    for (let y of [-1, 1]) {
      let x = new R(new ee(m, 0.18, 0.05), d);
      (x.position.set(0, 0.3, y * 0.18), (x.rotation.x = y * 0.25), p.add(x));
    }
    for (let y of [-1, 1]) {
      let x = new R(new ee(0.05, 0.2, 0.42), d);
      (x.position.set((y * m) / 2, 0.3, 0), p.add(x));
      for (let b of [-1, 1]) {
        let w = new R(new ee(0.06, 0.22, 0.06), d);
        (w.position.set(y * (m / 2 - 0.1), 0.11, b * 0.14), p.add(w));
      }
    }
    let g = new R(new ee(m - 0.1, 0.05, 0.3), u);
    ((g.position.y = 0.3),
      p.add(g),
      p.position.set(i.x + 1.3, 0, c - 0.5),
      p.traverse((y) => {
        y.castShadow = !0;
      }),
      K.add(p),
      pt.push({ x: p.position.x, z: p.position.z, hw: m / 2, hd: 0.25, low: !0 }));
  }
  var wr,
    Td = [],
    ma = [],
    Hk = new we(0.075, 14, 10),
    Ak = new X({ color: 16181974, roughness: 0.55 }),
    LE = null,
    Ck = [2894382, 15784360, 16513780],
    n4 = new Map();
  function kk(i, e) {
    i.traverse((t) => {
      let n = t;
      if (!n.isMesh) return;
      let s = (o) => {
        let r = o.uuid + e,
          a = n4.get(r);
        if (a) return a;
        let c = o.clone(),
          l = new ae(e);
        return (
          (c.onBeforeCompile = (h) => {
            ((h.uniforms.uTint = { value: l }),
              (h.fragmentShader =
                `uniform vec3 uTint;
` +
                h.fragmentShader.replace(
                  "#include <map_fragment>",
                  `#include <map_fragment>
        { vec3 cc = diffuseColor.rgb; float lum = dot(cc, vec3(0.3, 0.59, 0.11));
          float red = step(cc.g * 2.0, cc.r) * step(0.3, cc.r);                                   // หงอน/เหนียงแดง
          float yel = step(0.5, cc.r) * step(0.42, cc.g) * step(cc.b * 2.2, cc.g);                  // ปาก/ขาเหลือง
          float keep = max(red, yel);
          vec3 fur = uTint * (0.55 + 0.9 * lum);                                                    // คงแสงเงา/ลายขนเดิม
          diffuseColor.rgb = mix(min(fur, vec3(1.0)), cc, keep); }`,
                )));
          }),
          (c.customProgramCacheKey = () => "hen" + e),
          n4.set(r, c),
          c
        );
      };
      n.material = Array.isArray(n.material) ? n.material.map(s) : s(n.material);
    });
  }
  var Pk = 0;
  function Ik() {
    if (!LE) return BM();
    let i = LE.clone(!0);
    kk(i, Ck[Pk++ % 3]);
    let e = new J(),
      t = new J();
    (t.add(i), e.add(t), (t.rotation.y = Fk), t.updateMatrixWorld(!0));
    let o = 0.72 / new mt().setFromObject(t).getSize(new H()).y;
    (t.scale.setScalar(o), t.updateMatrixWorld(!0));
    let r = new mt().setFromObject(t),
      a = r.getCenter(new H());
    return (
      t.position.set(-a.x, -r.min.y, -a.z),
      i.traverse((c) => {
        c.castShadow = !0;
      }),
      e
    );
  }
  var Fk = 0,
    i4 = -1,
    Xh = 0;
  function wd() {
    for (; Td.length < z.chickens + 6;) {
      let i = Ik();
      K.add(i);
      let e = Ti.clone().add(new H((Math.random() - 0.5) * 2 * (w0 - 0.6), 0, (Math.random() - 0.5) * 2 * (v0 - 0.6)));
      Td.push({
        g: i,
        pos: e,
        target: e.clone(),
        t: Math.random() * 5,
        wait: 0,
        layT: 25 + Math.random() * 80,
        laying: 0,
      });
    }
    if ((wr && (wr.userData.nest.children.length = 0), wr && z.hatch)) {
      let i = new R(new we(0.13, 10, 8), new X({ color: 15983300, roughness: 0.5 }));
      ((i.scale.y = 1.25), i.position.set(0, 0, -0.12), wr.userData.nest.add(i));
    }
    if (wr && z.eggs > 0)
      for (let i = 0; i < z.eggs; i++) {
        let e = new R(new we(0.12, 8, 6), new Mc({ color: 16774885 }));
        ((e.scale.y = 1.25),
          e.position.set(Math.cos(i * 1.6) * 0.15, Math.sin(i * 1.6) * 0.15, -0.1),
          wr.userData.nest.add(e));
      }
  }
  function yT(i) {
    let e = ma.splice(i, 1)[0];
    (K.remove(e.m),
      (z.inv.egg = (z.inv.egg ?? 0) + 1),
      Ai("egg"),
      rt("+1 🥚 ไข่ไก่", e.pos.clone().setY(1)),
      ke("coin"),
      Ei(),
      _t(z));
  }
  function zk(i) {
    {
      let e = Le[0],
        t = performance.now() * 0.004;
      for (let n = ma.length - 1; n >= 0; n--) {
        let s = ma[n];
        ((s.m.position.y = 0.11 + Math.abs(Math.sin(t + n)) * 0.06), (s.m.rotation.y += i * 1.5));
        let o = s.m.userData.ring;
        (o && (o.position.set(s.pos.x, 0.03, s.pos.z), (o.material.opacity = 0.35 + Math.sin(t * 2 + n) * 0.2)),
          e && !Se && Math.hypot(e.pos.x - s.pos.x, e.pos.z - s.pos.z) < 0.85 && (o && K.remove(o), yT(n)));
      }
    }
    for (let e of Td) {
      if (
        ((e.t += i),
        (e.layT -= i),
        e.laying <= 0 &&
          e.layT <= 0 &&
          e.wait <= 0.2 &&
          ((e.layT = 90 + Math.random() * 120),
          ma.length < 4 && k0("lay") < Zk() && ((e.laying = 2.4), (e.wait = 0), y1("lay"))),
        e.laying > 0)
      ) {
        if (
          ((e.laying -= i),
          (e.g.rotation.x = 0),
          (e.g.rotation.z = Math.sin(e.t * 14) * 0.08),
          e.g.position.set(e.pos.x, -0.06, e.pos.z),
          e.laying <= 0)
        ) {
          e.g.rotation.z = 0;
          let t = new H(-Math.sin(e.g.rotation.y), 0, -Math.cos(e.g.rotation.y)),
            n = e.pos.clone().addScaledVector(t, 0.28);
          ((n.x = Math.min(Ti.x + w0 - 0.3, Math.max(Ti.x - w0 + 0.3, n.x))),
            (n.z = Math.min(Ti.z + v0 - 0.3, Math.max(Ti.z - v0 + 0.3, n.z))));
          let s = new R(Hk, Ak);
          (s.scale.set(1, 1.28, 1),
            s.position.set(n.x, 0.09, n.z),
            (s.rotation.z = 1.2),
            (s.castShadow = !0),
            K.add(s));
          let o = new R(
            new rr(0.13, 0.22, 20),
            new be({ color: 16769357, transparent: !0, opacity: 0.5, depthWrite: !1 }),
          );
          ((o.rotation.x = -Math.PI / 2),
            o.position.set(n.x, 0.03, n.z),
            K.add(o),
            (s.userData.ring = o),
            ma.push({ m: s, pos: n }),
            ke("pop"),
            e.target.copy(e.pos).add(new H(Math.random() * 3 - 1.5, 0, Math.random() * 3 - 1.5)));
        }
        continue;
      }
      if (e.wait > 0) ((e.wait -= i), (e.g.rotation.x = Math.sin(e.t * 8) > 0.6 ? 0.25 : 0));
      else {
        Xt.copy(e.target).sub(e.pos);
        let t = Xt.length();
        t < 0.2
          ? ((e.wait = 1 + Math.random() * 3),
            e.target
              .copy(Ti)
              .add(new H((Math.random() - 0.5) * 2 * (w0 - 0.5), 0, (Math.random() - 0.5) * 2 * (v0 - 0.5))))
          : (Xt.divideScalar(t),
            e.pos.addScaledVector(Xt, Math.min(t, 1.4 * i)),
            (e.g.rotation.y = Math.atan2(Xt.x, Xt.z)),
            (e.g.rotation.x = 0));
      }
      e.g.position.set(e.pos.x, Math.abs(Math.sin(e.t * 10)) * (e.wait > 0 ? 0 : 0.08), e.pos.z);
    }
  }
  var fl = new zi(new vi({ map: io("st_quest", 16777215, 16756768), transparent: !0, depthTest: !1 }));
  fl.scale.set(0.75, 0.75, 1);
  fl.renderOrder = 10;
  fl.visible = !1;
  K.add(fl);
  function Lk(i) {
    let e = z.request,
      t = e && !e.accepted ? wi[e.npc] : null;
    ((fl.visible = !!t && !Se), t && fl.position.set(t.pos.x, 2.55 + Math.sin(i * 3) * 0.08, t.pos.z));
  }
  function k1() {
    let i = z.request,
      e = it("quest");
    (e.classList.toggle("on", !!i?.accepted),
      i?.accepted &&
        ((e.innerHTML = `📜 ${es[i.npc].name} อยากได้ ${ti(i.good).icon} <b>+${i.reward}💰</b>`),
        (e.title = `${es[i.npc].name} อยากได้ ${ti(i.good).name} \xB7 รางวัล ${i.reward}💰 +20 EXP`)));
  }
  function Dk() {
    if (Math.random() < 0.35) {
      z.request = null;
      return;
    }
    let i = ["bug:butterfly", "bug:ladybug", ...(z.chickens ? ["egg"] : [])],
      e = i[Math.floor(Math.random() * i.length)];
    z.request = {
      npc: Math.floor(Math.random() * es.length),
      good: e,
      reward: Math.round((ti(e).sell * 2.5) / 10) * 10,
    };
  }
  function MT(i) {
    ((rn.rebuild = 0), (rn.t = 0), Sd(i.inside));
    let e = Le[0];
    (e.pos.copy(i.inside.exit).add(new H(0, 0, -1.2)),
      e.pos.copy(h1(e.pos)),
      (e.dir = Math.PI),
      (j.yaw = 0),
      Lt.position.set(e.pos.x, 3.6, e.pos.z + 1.2),
      ke("pop"),
      De(
        `🛎 ยินดีต้อนรับสู่${i.def.name}`,
        2e3,
      ));
  }
  function TT(i) {
    ((rn.rebuild = 0), (rn.t = 0));
    for (let t of f0) ((t.t = 0), t.el.classList.remove("on"));
    Sd(null);
    let e = Le[0];
    (e.pos.copy(h1(i.door.clone().add(new H(0, 0, 1.6)))),
      (e.dir = 0),
      (j.yaw = 0),
      Lt.position.set(e.pos.x, 5, e.pos.z + 9),
      ke("pop"));
  }
  var _n = {
      straw: { slot: "head", name: "หมวกฟาง", icon: "👒", s: 1 },
      beanie: {
        slot: "head",
        name: "หมวกไหมพรม",
        icon: "🧶",
        s: 1.2,
        pos: [0, -0.03, 0],
      },
      party: {
        slot: "head",
        name: "หมวกปาร์ตี้",
        icon: "🎉",
        s: 1.1,
        rot: [0, 0, 0.25],
      },
      crown: { slot: "head", name: "มงกุฎทอง", icon: "👑", s: 1.15 },
      ribbon: {
        slot: "head",
        name: "โบว์ชมพู",
        icon: "🎀",
        s: 1.1,
        pos: [0.15, -0.04, 0.02],
        rot: [0, 0, -0.3],
      },
      bandana: {
        slot: "neck",
        name: "ผ้าพันคอแดง",
        icon: "🧣",
        s: 1.1,
        pos: [0, -0.34, 0.05],
        rot: [0.69, 0, 0],
      },
      bowtie: {
        slot: "neck",
        name: "หูกระต่าย",
        icon: "🎩",
        s: 0.95,
        pos: [0, -0.28, 0.06],
        rot: [0.69, 0, 0],
      },
      scarf: {
        slot: "neck",
        name: "ผ้าพันคอลายทาง",
        icon: "🧣",
        s: 1.22,
        pos: [0, 0, 0],
        rot: [-(Math.PI / 2 - 0.35), 0, 0],
      },
      sunglasses: {
        slot: "eyes",
        name: "แว่นกันแดด",
        icon: "🕶",
        s: 1.15,
        pos: [0, 0, 0],
      },
      heartglasses: {
        slot: "eyes",
        name: "แว่นหัวใจ",
        icon: "💖",
        s: 1.15,
        pos: [0, 0, 0],
      },
    },
    R0 = [
      {
        key: "col_red",
        slot: "neck",
        name: "ปลอกคอแดง ป้ายทอง",
        icon: "🔴",
        price: 80,
        c1: 14829119,
        tag: "tag",
      },
      {
        key: "col_blue",
        slot: "neck",
        name: "ปลอกคอฟ้า มีกระดิ่ง",
        icon: "🔔",
        price: 90,
        c1: 4163272,
        tag: "bell",
      },
      {
        key: "col_pink",
        slot: "neck",
        name: "ปลอกคอชมพู จี้หัวใจ",
        icon: "💗",
        price: 100,
        c1: 16748472,
        tag: "heart",
      },
      {
        key: "col_black",
        slot: "neck",
        name: "ปลอกคอหนังหมุดเท่",
        icon: "🖤",
        price: 120,
        c1: 2826520,
        tag: "stud",
      },
      {
        key: "col_green",
        slot: "neck",
        name: "ปลอกคอเขียว ป้ายชื่อ",
        icon: "🟢",
        price: 80,
        c1: 5025616,
        tag: "tag",
      },
      {
        key: "tee_red",
        slot: "body",
        name: "เสื้อยืดแดง",
        icon: "👕",
        price: 120,
        pat: 1,
        c1: 14829119,
        c2: 16777215,
      },
      {
        key: "stripe_navy",
        slot: "body",
        name: "เสื้อลายขวางกะลาสี",
        icon: "⚓",
        price: 160,
        pat: 2,
        c1: 2241899,
        c2: 16777215,
      },
      {
        key: "dots_pink",
        slot: "body",
        name: "เสื้อลายจุดชมพู",
        icon: "🩷",
        price: 150,
        pat: 3,
        c1: 16748472,
        c2: 16777215,
      },
      {
        key: "check_brown",
        slot: "body",
        name: "เสื้อลายสก๊อตน้ำตาล",
        icon: "🟫",
        price: 180,
        pat: 4,
        c1: 11565636,
        c2: 15983560,
      },
      {
        key: "bee",
        slot: "body",
        name: "ชุดผึ้งน้อย",
        icon: "🐝",
        price: 200,
        pat: 2,
        c1: 16765503,
        c2: 2826520,
      },
      {
        key: "raincoat",
        slot: "body",
        name: "เสื้อกันฝนเหลือง",
        icon: "🧥",
        price: 170,
        pat: 1,
        c1: 16765503,
        c2: 4163272,
      },
      {
        key: "hoodie",
        slot: "body",
        name: "ฮู้ดดี้เขียวมิ้นต์",
        icon: "🟩",
        price: 190,
        pat: 1,
        c1: 8378548,
        c2: 16777215,
      },
      {
        key: "pirate",
        slot: "body",
        name: "ชุดโจรสลัด",
        icon: "🏴‍☠️",
        price: 220,
        pat: 2,
        c1: 2826520,
        c2: 14829119,
      },
      {
        key: "dots_blue",
        slot: "body",
        name: "เสื้อลายจุดฟ้า",
        icon: "🔵",
        price: 150,
        pat: 3,
        c1: 6080757,
        c2: 16777215,
      },
      {
        key: "shoe_red",
        slot: "feet",
        name: "รองเท้าผ้าใบแดง",
        icon: "👟",
        price: 110,
        c1: 14829119,
      },
      {
        key: "shoe_blue",
        slot: "feet",
        name: "รองเท้าผ้าใบฟ้า",
        icon: "👟",
        price: 110,
        c1: 4163272,
      },
      {
        key: "shoe_yellow",
        slot: "feet",
        name: "บูทกันฝนเหลือง",
        icon: "🥾",
        price: 130,
        c1: 16765503,
      },
      {
        key: "shoe_pink",
        slot: "feet",
        name: "รองเท้าชมพูหวาน",
        icon: "🩰",
        price: 120,
        c1: 16748472,
      },
      {
        key: "shoe_black",
        slot: "feet",
        name: "รองเท้าหนังดำ",
        icon: "👞",
        price: 140,
        c1: 2826520,
      },
      {
        key: "kick_pompom",
        slot: "feet",
        name: "สลิปเปอร์ปอมปอม",
        icon: "🩴",
        price: 120,
        c1: 4034528,
        shoe: "Shoe_Slippers_04",
      },
      {
        key: "kick_frog",
        slot: "feet",
        name: "สลิปเปอร์กบน้อย",
        icon: "🐸",
        price: 140,
        c1: 8046915,
        shoe: "Shoe_Slippers_05",
      },
      {
        key: "kick_sandal",
        slot: "feet",
        name: "รองเท้ารัดส้นส้ม",
        icon: "🩴",
        price: 110,
        c1: 15895592,
        shoe: "Shoe_Slippers_06",
      },
      {
        key: "kick_skate",
        slot: "feet",
        name: "ผ้าใบสเก็ต",
        icon: "👟",
        price: 180,
        c1: 5922662,
        shoe: "Shoe_Sneakers_04",
      },
      {
        key: "kick_work",
        slot: "feet",
        name: "บูตหนังผูกเชือก",
        icon: "🥾",
        price: 200,
        c1: 5912608,
        shoe: "Shoe_Sneakers_06",
      },
      {
        key: "kick_red",
        slot: "feet",
        name: "ผ้าใบแดงสายซิ่ง",
        icon: "👟",
        price: 170,
        c1: 14829119,
        shoe: "Shoe_Sneakers_08",
      },
      {
        key: "kick_pink",
        slot: "feet",
        name: "รองเท้าวิ่งชมพู",
        icon: "👟",
        price: 170,
        c1: 16740277,
        shoe: "Shoe_Sneakers_10",
      },
      {
        key: "kick_santa",
        slot: "feet",
        name: "บูตซานต้า",
        icon: "🎅",
        price: 220,
        c1: 1118481,
        shoe: "Costume_10_05",
        q: !0,
      },
      {
        key: "kick_viking",
        slot: "feet",
        name: "บูตไวกิ้ง",
        icon: "🪓",
        price: 240,
        c1: 9080985,
        shoe: "Costume_9_05",
        q: !0,
      },
      {
        key: "folk_santa",
        slot: "body",
        name: "ชุดซานต้า",
        icon: "🎅",
        price: 320,
        pat: 8,
        c1: 13111322,
        c2: 16777215,
      },
      {
        key: "folk_bee",
        slot: "body",
        name: "ชุดผึ้งน้อย",
        icon: "🐝",
        price: 260,
        pat: 9,
        c1: 16761876,
        c2: 1118481,
        q: !0,
      },
      {
        key: "folk_jester",
        slot: "body",
        name: "ชุดตัวตลกราชสำนัก",
        icon: "🃏",
        price: 300,
        pat: 10,
        c1: 14359080,
        c2: 1744456,
        q: !0,
      },
      {
        key: "folk_viking",
        slot: "body",
        name: "ชุดนักรบไวกิ้ง",
        icon: "🪓",
        price: 340,
        pat: 11,
        c1: 10133160,
        c2: 7029280,
        q: !0,
      },
      {
        key: "folk_pirate",
        slot: "body",
        name: "ชุดกัปตันโจรสลัด",
        icon: "🏴‍☠️",
        price: 340,
        pat: 12,
        c1: 11735322,
        c2: 15908928,
        q: !0,
      },
      {
        key: "folk_dino",
        slot: "body",
        name: "ชุดไดโนเสาร์",
        icon: "🦖",
        price: 300,
        pat: 13,
        c1: 5421144,
        c2: 2061107,
        q: !0,
      },
      {
        key: "folk_overall",
        slot: "body",
        name: "ชุดเอี๊ยมยีนส์",
        icon: "👖",
        price: 220,
        pat: 14,
        c1: 3366046,
        c2: 15898931,
      },
      {
        key: "folk_flannel",
        slot: "body",
        name: "เชิ้ตสก็อตคนตัดไม้",
        icon: "🪵",
        price: 200,
        pat: 15,
        c1: 13376026,
        c2: 1118481,
      },
      {
        key: "folk_puffer",
        slot: "body",
        name: "เสื้อขนเป็ดพองลม",
        icon: "🧥",
        price: 240,
        pat: 16,
        c1: 2059225,
        c2: 663373,
      },
      {
        key: "folk_rocker",
        slot: "body",
        name: "แจ็กเก็ตหนังร็อกเกอร์",
        icon: "🎸",
        price: 280,
        pat: 17,
        c1: 1118481,
        c2: 14212322,
      },
      {
        key: "col_sniff",
        slot: "neck",
        name: "ปลอกคอนักดม",
        icon: "🟣",
        price: 0,
        c1: 9067766,
        tag: "tag",
        q: !0,
      },
      {
        key: "col_gold",
        slot: "neck",
        name: "ปลอกคอกระดิ่งทอง",
        icon: "🔔",
        price: 0,
        c1: 15911244,
        tag: "bell",
        q: !0,
      },
      {
        key: "col_crown",
        slot: "neck",
        name: "ปลอกคอราชาแห่งเมือง",
        icon: "👑",
        price: 0,
        c1: 8003490,
        tag: "stud",
        q: !0,
      },
    ];
  for (let i of R0) _n[`dw:${i.key}`] = { slot: i.slot, name: i.name, icon: i.icon };
  {
    let i = {
      "dw:vest_det": "dw:folk_pirate",
      "dw:vest_cool": "dw:folk_bee",
      "dw:vest_lucky": "dw:folk_jester",
      "dw:boots_paw": "dw:kick_santa",
      "dw:boots_dig": "dw:folk_dino",
      "dw:boots_run": "dw:kick_viking",
    };
    z.hats && (z.hats = [...new Set(z.hats.map((t) => i[t] ?? t))]);
    let e = z.outfit ?? {};
    for (let t in e) {
      let n = i[e[t]];
      n && (delete e[t], _n[n] && (e[_n[n].slot] = n));
    }
  }
  function Bk(i) {
    let e = new J(),
      t = new R(new vt(0.2, 0.032, 10, 28), new X({ color: i.c1, roughness: 0.5 }));
    e.add(t);
    let n = new X({ color: 15911244, roughness: 0.25, metalness: 0.85 });
    if (i.tag === "stud")
      for (let s = 0; s < 12; s++) {
        let o = (s / 12) * Math.PI * 2,
          r = new R(new yt(0.014, 0.03, 6), new X({ color: 14212578, metalness: 0.9, roughness: 0.2 }));
        (r.position.set(Math.cos(o) * 0.23, Math.sin(o) * 0.23, 0), (r.rotation.z = o - Math.PI / 2), e.add(r));
      }
    else {
      let s =
        i.tag === "bell"
          ? new R(new we(0.045, 12, 10), n)
          : i.tag === "heart"
            ? (() => {
                let o = new mn();
                return (
                  o.moveTo(0, -0.04),
                  o.bezierCurveTo(-0.07, 0.01, -0.03, 0.06, 0, 0.03),
                  o.bezierCurveTo(0.03, 0.06, 0.07, 0.01, 0, -0.04),
                  new R(
                    new yi(o, { depth: 0.012, bevelEnabled: !1 }),
                    new X({ color: 16735370, roughness: 0.3, metalness: 0.4 }),
                  )
                );
              })()
            : new R(new re(0.045, 0.045, 0.01, 18), n);
      (i.tag === "tag" && (s.rotation.x = Math.PI / 2), s.position.set(0, -0.25, 0.02), e.add(s));
    }
    return (e.scale.setScalar(1.35), e);
  }
  var ub = (i) =>
    /^(Glasses|Bandage)/.test(i) ? "eyes" : /^(Mustache|Beard|Clown|Pacifier|Mask)/.test(i) ? "face" : "head";
  for (let [i, e, t] of KE) {
    let n = ub(i);
    _n[`cc:${i}`] =
      n === "eyes"
        ? { slot: "eyes", name: e, icon: t, pos: [0, 0.01, 0] }
        : n === "face"
          ? { slot: "face", name: e, icon: t, pos: [0, 0, 0.01] }
          : { slot: "head", name: e, icon: t, pos: [0, -0.14, 0.04], rot: [-0.12, 0, 0] };
  }
  var Ok = (i) =>
      /^(Glasses|Bandage)/.test(i)
        ? 0.38
        : /^(Mustache|Beard)/.test(i)
          ? 0.3
          : /^(Clown|Pacifier)/.test(i)
            ? 0.14
            : /^Mask/.test(i)
              ? 0.34
              : 0.58,
    Ar = () => z.outfit ?? (z.outfit = {});
  z.wear && _n[z.wear] && ((Ar()[_n[z.wear].slot] = z.wear), (z.wear = ""));
  var pb = (i) => !!_n[i] && Ar()[_n[i].slot] === i;
  function vd(i, e) {
    let t = _n[i];
    if (!t) return;
    let n = Ar()[t.slot];
    (e === !0 || n !== i ? (Ar()[t.slot] = i) : delete Ar()[t.slot], x1(), _t(z), ccsSetCheck());
  }
  function mb(i, e, t, n) {
    let s = i.ring.map((o) => o.clone().setLength(o.length() + e));
    return new R(new Yi(new Xi(s, !0, "centripetal"), 96, t, 8, !0), n);
  }
  function Nk(i) {
    let e = new H();
    for (let n of i.ring) e.add(n);
    e.divideScalar(i.ring.length);
    let t = new H().subVectors(i.ring[0], e).cross(new H().subVectors(i.ring[12], e)).normalize();
    return { c: e, n: t };
  }
  function Yh(i, e, t, n) {
    return i.ring.map((s) =>
      s
        .clone()
        .setLength(s.length() + e)
        .addScaledVector(n, t),
    );
  }
  function Zh(i, e, t) {
    return new R(new Yi(new Xi(i, !0, "centripetal"), 120, e, 10, !0), t);
  }
  function s4(i, e, t) {
    let n = i.ring[e];
    return n.clone().setLength(n.length() + t);
  }
  function Gk(i, e) {
    if (!["col_sniff", "col_gold", "col_crown"].includes(i.key)) return null;
    let t = new J(),
      { n } = Nk(e),
      s = new X({ color: 16106818, roughness: 0.18, metalness: 1, emissive: 3811328, emissiveIntensity: 0.25 }),
      o = new X({ color: 15265010, roughness: 0.15, metalness: 1 }),
      r = s4(e, 36, 0.035),
      a = new H(0, -Math.cos(0.69), Math.sin(0.69)),
      c = r.clone().normalize();
    if (i.key === "col_sniff") {
      let l = new X({ color: 5975984, roughness: 0.55 }),
        h = new X({ color: 9067766, roughness: 0.5 });
      for (let x of [-0.014, 0.014]) t.add(Zh(Yh(e, 0.008, x, n), 0.016, x < 0 ? l : h));
      let f = new X({ color: 16774885, roughness: 0.8 });
      for (let x = 0; x < 48; x += 1)
        for (let b of [-0.024, 0.024]) {
          let w = e.ring[x]
              .clone()
              .setLength(e.ring[x].length() + 0.022)
              .addScaledVector(n, b),
            v = new R(new ee(0.012, 0.003, 0.003), f);
          (v.position.copy(w), v.lookAt(w.clone().add(e.ring[(x + 1) % 48].clone().sub(e.ring[x]))), t.add(v));
        }
      let d = new R(new vt(0.022, 0.005, 6, 4), o),
        u = s4(e, 30, 0.03);
      (d.position.copy(u), d.lookAt(u.clone().multiplyScalar(2)), (d.rotation.z += Math.PI / 4), t.add(d));
      let p = new J(),
        m = new X({ color: 11832575, roughness: 0.25, metalness: 0.3, emissive: 2756442, emissiveIntensity: 0.4 }),
        E = new R(new re(0.046, 0.046, 0.01, 28), o);
      ((E.rotation.x = Math.PI / 2), p.add(E));
      let g = new R(new we(0.02, 16, 12), m);
      (g.scale.set(1.15, 0.9, 0.35),
        g.position.set(0, -0.01, 0.006),
        p.add(g),
        [
          [-0.022, 0.016],
          [-0.008, 0.027],
          [0.008, 0.027],
          [0.022, 0.016],
        ].forEach(([x, b]) => {
          let w = new R(new we(0.008, 12, 8), m);
          ((w.scale.z = 0.4), w.position.set(x, b, 0.006), p.add(w));
        }),
        p.position.copy(r).addScaledVector(a, 0.05).addScaledVector(c, 0.01),
        p.lookAt(p.position.clone().add(c)),
        p.scale.setScalar(1.6),
        p.position.addScaledVector(a, 0.025),
        t.add(p));
      let y = new R(new vt(0.012, 0.0035, 6, 14), o);
      (y.position.copy(r).addScaledVector(a, 0.006), t.add(y));
    } else if (i.key === "col_gold") {
      t.add(Zh(Yh(e, 0.008, 0, n), 0.026, new X({ color: 9183018, roughness: 0.45 })));
      for (let m of [-0.025, 0.025]) t.add(Zh(Yh(e, 0.012, m, n), 0.004, s));
      for (let m = 0; m < 48; m += 3) {
        let E = e.ring[m].clone().setLength(e.ring[m].length() + 0.033),
          g = new R(new we(0.008, 10, 8), s);
        (g.position.copy(E), t.add(g));
      }
      let l = new J(),
        h = [
          [0, 0.05],
          [0.018, 0.048],
          [0.032, 0.035],
          [0.04, 0.012],
          [0.046, -0.012],
          [0.054, -0.026],
          [0.05, -0.03],
          [0, -0.03],
        ].map(([m, E]) => new me(m, E));
      l.add(new R(new ks(h, 32), s));
      let f = new R(new ee(0.08, 0.006, 0.012), new X({ color: 2759173 }));
      ((f.position.y = -0.012), l.add(f));
      let d = new R(new we(0.012, 12, 10), s);
      ((d.position.y = -0.034), l.add(d));
      let u = new R(new vt(0.012, 0.004, 8, 16), s);
      ((u.position.y = 0.058), l.add(u));
      let p = new R(new vt(0.041, 0.003, 6, 30), s);
      ((p.rotation.x = Math.PI / 2),
        (p.position.y = 0),
        l.add(p),
        l.position.copy(r).addScaledVector(a, 0.07).addScaledVector(c, 0.02),
        l.scale.setScalar(1.15),
        t.add(l));
    } else {
      t.add(
        Zh(
          Yh(e, 0.008, 0, n),
          0.03,
          new X({ color: 4854924, roughness: 0.85, sheen: 1, sheenColor: new ae(11766015) }),
        ),
      );
      for (let u of [-0.03, 0.03]) t.add(Zh(Yh(e, 0.016, u, n), 0.006, s));
      let l = [15022389, 2001125, 4431943];
      for (let u = 0, p = 0; u < 48; u += 4, p++) {
        let m = e.ring[u].clone().setLength(e.ring[u].length() + 0.038),
          E = new R(
            new Ho(0.011),
            new X({ color: l[p % 3], roughness: 0.05, metalness: 0.3, emissive: l[p % 3], emissiveIntensity: 0.25 }),
          );
        (E.position.copy(m), (E.scale.y = 1.4), t.add(E));
      }
      let h = new J();
      h.add(new R(new re(0.042, 0.04, 0.026, 32, 1, !0), s));
      let f = new R(new vt(0.041, 0.005, 8, 32), s);
      ((f.rotation.x = Math.PI / 2), (f.position.y = -0.013), h.add(f));
      for (let u = 0; u < 5; u++) {
        let p = (u / 5) * Math.PI * 2,
          m = new R(new yt(0.011, 0.034, 8), s);
        (m.position.set(Math.cos(p) * 0.04, 0.03, Math.sin(p) * 0.04), h.add(m));
        let E = new R(new we(0.006, 10, 8), new X({ color: 16775408, roughness: 0.2 }));
        (E.position.set(Math.cos(p) * 0.04, 0.05, Math.sin(p) * 0.04), h.add(E));
      }
      let d = new R(
        new Ho(0.014),
        new X({ color: 13959218, roughness: 0.05, metalness: 0.2, emissive: 6946832, emissiveIntensity: 0.5 }),
      );
      (d.position.set(0, 0, 0.043),
        d.scale.set(1, 1.3, 0.6),
        h.add(d),
        h.position.copy(r).addScaledVector(a, 0.06).addScaledVector(c, 0.03),
        (h.rotation.y = Math.atan2(c.x, c.z)),
        h.scale.setScalar(1.6),
        t.add(h));
    }
    return t;
  }
  function Uk(i, e) {
    let t = new J();
    {
      let o = Gk(i, e);
      if (o) return o;
    }
    t.add(mb(e, 0.004, 0.024, new X({ color: i.c1, roughness: 0.5 })));
    let n = new X({ color: 15911244, roughness: 0.25, metalness: 0.85 }),
      s = e.ring[36].clone().setLength(e.ring[36].length() + 0.03);
    if (i.tag === "stud")
      for (let o = 0; o < 48; o += 3) {
        let r = e.ring[o],
          a = r.clone().normalize(),
          c = new R(new yt(0.012, 0.028, 6), new X({ color: 14212578, metalness: 0.9, roughness: 0.2 }));
        (c.position.copy(r).addScaledVector(a, 0.03), c.quaternion.setFromUnitVectors(new H(0, 1, 0), a), t.add(c));
      }
    else {
      let o = new R(new vt(0.014, 0.004, 6, 12), n);
      (o.position.copy(s), t.add(o));
      let r =
        i.tag === "bell"
          ? new R(new we(0.035, 14, 10), n)
          : i.tag === "heart"
            ? (() => {
                let a = new mn();
                return (
                  a.moveTo(0, -0.035),
                  a.bezierCurveTo(-0.06, 0.01, -0.025, 0.05, 0, 0.026),
                  a.bezierCurveTo(0.025, 0.05, 0.06, 0.01, 0, -0.035),
                  new R(new yi(a, { depth: 0.01, bevelEnabled: !1 }), n)
                );
              })()
            : new R(new re(0.035, 0.035, 0.008, 18), n);
      (i.tag === "tag" && (r.rotation.x = Math.PI / 2),
        r.position.copy(s).add(new H(0, -Math.cos(0.69) * 0.045, Math.sin(0.69) * 0.045)),
        (r.rotation.x += 0.69),
        t.add(r));
    }
    return t;
  }
  function Vk(i) {
    let e = new J(),
      t = (() => {
        let a = document.createElement("canvas");
        ((a.width = 256), (a.height = 32));
        let c = a.getContext("2d");
        for (let h = 0; h < 16; h++) ((c.fillStyle = h % 2 ? "#ffffff" : "#e2463f"), c.fillRect(h * 16, 0, 16, 32));
        let l = new ut(a);
        return ((l.colorSpace = Ye), (l.wrapS = gn), l.repeat.set(4, 1), l);
      })(),
      n = new X({ map: t, roughness: 0.95 }),
      s = mb(i, 0.02, 0.04, n);
    ((s.scale.z = 1), e.add(s));
    let o = i.ring[33].clone().setLength(i.ring[33].length() + 0.05),
      r = new R(new we(0.06, 12, 10), n);
    (r.position.copy(o), e.add(r));
    for (let a of [31, 35]) {
      let c = i.ring[a].clone().setLength(i.ring[a].length() + 0.05),
        l = new R(new we(0.04, 10, 8), n);
      (l.scale.set(1.6, 0.7, 0.7), l.position.copy(c), (l.rotation.z = Math.atan2(c.y, c.x)), e.add(l));
    }
    return e;
  }
  function Wk(i) {
    let e = new J(),
      t = (() => {
        let o = document.createElement("canvas");
        o.width = o.height = 256;
        let r = o.getContext("2d");
        ((r.fillStyle = "#d8322b"), r.fillRect(0, 0, 256, 256), (r.fillStyle = "rgba(255,255,255,.9)"));
        for (let c = 12; c < 256; c += 26)
          for (let l = (c / 26) % 2 ? 0 : 13; l < 256; l += 26) (r.beginPath(), r.arc(l, c, 4, 0, 7), r.fill());
        ((r.strokeStyle = "rgba(255,255,255,.8)"), (r.lineWidth = 6), r.strokeRect(10, -20, 236, 266));
        let a = new ut(o);
        return ((a.colorSpace = Ye), a);
      })(),
      n = new qe();
    (n.setAttribute("position", new Je(i.bib.pos, 3)),
      n.setAttribute("uv", new Je(i.bib.uv, 2)),
      n.setIndex(i.bib.idx),
      n.computeVertexNormals());
    let s = new X({ map: t, roughness: 0.9, side: Ke, alphaTest: 0.5 });
    return (
      (s.onBeforeCompile = (o) => {
        o.fragmentShader = o.fragmentShader.replace(
          "#include <alphatest_fragment>",
          `if (abs(vMapUv.x - 0.5) > vMapUv.y * 0.5 + 0.004) discard;
#include <alphatest_fragment>`,
        );
      }),
      e.add(new R(n, s)),
      e.add(mb(i, 0.006, 0.02, new X({ color: 12986916, roughness: 0.9 }))),
      e
    );
  }
  function qk(i, e) {
    let t = i.slots;
    if (!t) return;
    for (let r in t) t[r].clear();
    let n = Jg(i),
      s = e.body?.startsWith("dw:") ? R0.find((r) => r.key === e.body.slice(3)) : void 0,
      o = e.feet?.startsWith("dw:") ? R0.find((r) => r.key === e.feet.slice(3)) : void 0;
    i.setWear?.({
      body: s ? { pat: s.pat ?? 1, c1: s.c1, c2: s.c2 ?? 16777215 } : void 0,
      feet: o?.shoe ? void 0 : o?.c1,
      shoeStyle: o?.pat ?? 0,
    });
    {
      let r = i.pawSlots,
        a = i.paws;
      if (r && a) {
        for (let c of r) c.clear();
        o?.shoe &&
          a.forEach((c, l) => {
            let h = Vy(o.shoe, c.side, c.w * 1.3, c.d * 1.2);
            h && (h.position.set(c.x, c.y0 - 0.006, c.z + c.d * 0.06), (h.renderOrder = 2), r[l].add(h));
          });
      }
    }
    for (let r in e) {
      let a = e[r],
        c = _n[a];
      if (!c || !t[r]) continue;
      if (a.startsWith("dw:")) {
        let h = R0.find((f) => f.key === a.slice(3));
        if (h && h.slot === "neck") {
          let f = n ? Uk(h, n) : Bk(h);
          (f.traverse((d) => {
            d.castShadow = !0;
          }),
            t.neck.add(f));
        }
        continue;
      }
      if (n && (a === "bandana" || a === "scarf")) {
        let h = a === "bandana" ? Wk(n) : Vk(n);
        (h.traverse((f) => {
          f.castShadow = !0;
        }),
          t.neck.add(h));
        continue;
      }
      let l = a.startsWith("cc:")
        ? r0(a.slice(3), Ok(a.slice(3)), ub(a.slice(3)) === "head" ? "bottom" : "center")
        : Ns(a);
      if ((l.scale.multiplyScalar(c.s ?? 1), c.pos && l.position.set(...c.pos), c.rot && l.rotation.set(...c.rot), n)) {
        if (c.slot === "eyes") l.position.z += n.glassZ + (a.startsWith("cc:") ? 0.02 : 0);
        else if (c.slot === "head") l.position.y += n.hatY;
        else if (c.slot === "face") l.position.z += n.faceZ;
        else if (a === "bowtie") {
          let h = n.ring[36];
          (l.position.set(h.x, h.y - 0.02, 0.03), l.rotation.set(0.69, 0, 0));
        }
      }
      (l.traverse((h) => {
        h.castShadow = !0;
      }),
        t[r].add(l));
    }
    if (s?.key.startsWith("folk_") && n) {
      let a = {
        folk_santa: ["Costume_10_02", 0.62, -0.22, -0.2, 0.12, 0.06],
        folk_jester: ["Costume_8_02", 0.64, -0.17, -0.1, 0, 0.05],
        folk_viking: ["Costume_9_02", 0.62, -0.2, -0.4, 0, 0],
        folk_pirate: ["Costume_14_02", 0.7, -0.19, -0.13, 0, 0.06],
      }[s.key];
      if (a && !e.head && t.head) {
        let h = r0(a[0], a[1], "bottom");
        ((h.position.y += n.hatY + a[2]),
          (h.position.z += a[5]),
          (h.rotation.x = a[3]),
          (h.rotation.z = a[4]),
          t.head.add(h));
      }
      let c = i.backY,
        l = i.M;
      if (c && t.back) {
        if (s.key === "folk_bee") {
          let h = r0("Costume_2_04", 0.85, "center"),
            f = l.zMid + 0.1;
          (h.position.set(0, c(f) + 0.1, f), (h.rotation.y = Math.PI), t.back.add(h));
        }
        if (s.key === "folk_dino") {
          let h = new X({ color: 16756782, roughness: 0.45 });
          for (let f = 0; f < 5; f++) {
            let d = 0.24 - f * 0.075,
              u = 0.115 - Math.abs(f - 1.5) * 0.012,
              p = new R(new yt(u * 0.55, u * 1.5, 4), h);
            ((p.scale.z = 0.45), p.position.set(0, c(d) + u * 0.45, d), (p.rotation.x = -0.25), t.back.add(p));
          }
        }
      }
      if (s.key === "folk_dino" && !e.neck && t.neck) {
        let h = r0("Costume_12_03", 0.22, "center"),
          f = n.ring[36];
        (h.position.set(f.x, f.y - 0.02, 0.05), h.rotation.set(0.69, 0, 0), t.neck.add(h));
      }
    }
    for (let r in t)
      t[r].traverse((a) => {
        a.isMesh && (a.renderOrder = 2);
      });
  }
  function x1() {
    Le[0] && qk(Le[0].rig, Ar());
  }
  var uo = !1,
    Kh = "head",
    jk = [
      ["head", "🎩 หมวก"],
      ["eyes", "👓 แว่น"],
      ["face", "🥸 หน้า"],
      ["neck", "🦮 ปลอกคอ"],
      ["body", "👕 เสื้อ"],
      ["feet", "👟 รองเท้า"],
    ];
  function _0() {
    (x1(), (uo = !0), js.classList.add("dress"));
    let i = (z.hats ?? []).filter((s) => _n[s] && _n[s].slot === Kh),
      e = Ar()[Kh],
      t = [
        `<button class="wt${e ? "" : " on"}" data-wnone><span>🚫</span><small>ไม่ใส่</small></button>`,
        ...i.map(
          (s) =>
            `<button class="wt${e === s ? " on" : ""}" data-wear="${s}"><span>${_n[s].icon}</span><small>${_n[s].name}</small>${A0(s) ? `<em class="wst">${A0(s)}</em>` : ""}</button>`,
        ),
      ].join(""),
      n = Math.round(z.clean ?? 100);
    (Gi(
      "ตู้เสื้อผ้าน้องเชา 👗",
      `<div class="tabs wtabs">${jk.map(([s, o]) => `<button data-wtab="${s}" class="${s === Kh ? "on" : ""}">${o}</button>`).join("")}</div>
    <div class="wgrid">${t}</div>
    ${i.length ? "" : '<p class="note">ยังไม่มีของช่องนี้ \xB7 ซื้อได้ที่แคตตาล็อกในร้านอาบน้ำตัดขน</p>'}
    <p class="note">🎽 พลังจากชุดที่ใส่: ${
      Object.entries(cb())
        .filter(([, s]) => s)
        .map(([s, o]) => `${rl[s].ic}${rl[s].n} +${o}`)
        .join(" \xB7 ") || "ยังไม่มี"
    }</p>
    <p class="note">🫧 ความสะอาด ${n}%${n < 60 ? " \xB7 ตัวเริ่มเหม็นแล้ว ไปอาบน้ำที่ร้านอาบน้ำตัดขนนะ" : ""}</p>${ccsSetHtml()}`,
    ),
      document.querySelectorAll("[data-wtab]").forEach((s) =>
        s.addEventListener("click", () => {
          ((Kh = s.dataset.wtab), ke("pop"), _0());
        }),
      ),
      document.querySelector("[data-wnone]")?.addEventListener("click", () => {
        (delete Ar()[Kh], x1(), _t(z), ke("pop"), _0());
      }),
      document.querySelectorAll("[data-wear]").forEach((s) =>
        s.addEventListener("click", () => {
          (vd(s.dataset.wear, !0), ke("heart"), _0());
        }),
      ));
  }
  var wT = [],
    vT = [];
  // v112: คอกน้องหมาใหญ่ขึ้น คอกละ 4 ตัว คละสายพันธุ์ เดินเล่น/หยุดดมพื้น/กระโดดเล่น/หันมองคนแบบเป็นธรรมชาติ
  function $k(i) {
    let e = new X({ color: 16777215, roughness: 0.5 }),
      t = new X({ color: 15895592, roughness: 0.5 }),
      n = 3.2,
      s = 2.4,
      o = [
        [["chow_cream", 1], ["labrador", 0.6], ["chihuahua", 1], ["bulldog", 0.85]],
        [["chow_red", 1], ["poodle", 1], ["sharpei", 0.78], ["pharaoh", 0.6]],
        [["chow_black", 1], ["chow_white", 1], ["bulldogpup", 0.95], ["chow_blue", 1]],
      ];
    [-3.5, 0, 3.5].forEach((r, a) => {
      let c = i.origin.x + r,
        l = i.origin.z + 0.6,
        h = new R(new Te(n, s), new X({ color: [16770026, 15136511, 16774084][a], roughness: 0.9 }));
      ((h.rotation.x = -Math.PI / 2), h.position.set(r, 0.015, 0.6), i.group.add(h));
      let f = n / 2,
        d = s / 2;
      for (let [u, p, m, E] of [
        [-f, -d, f, -d],
        [-f, d, f, d],
        [-f, -d, -f, d],
        [f, -d, f, d],
      ]) {
        let g = Math.hypot(m - u, E - p),
          y = new R(new ee(g, 0.06, 0.05), e);
        (y.position.set(r + (u + m) / 2, 0.45, 0.6 + (p + E) / 2), (y.rotation.y = -Math.atan2(E - p, m - u)), i.group.add(y));
        for (let [x, b] of [
          [u, p],
          [m, E],
        ]) {
          let w = new R(new re(0.05, 0.05, 0.55, 8), t);
          (w.position.set(r + x, 0.27, 0.6 + b), i.group.add(w));
        }
      }
      (i.solids.push({ x: c, z: l, hw: f + 0.1, hd: d + 0.1 }), vT.push(new H(c, 0, l + d + 0.45)));
      let pen = { x: c, z: l, hw: f - 0.32, hd: d - 0.3 };
      o[a].forEach(([u, p], m) => {
        try {
          let E = T1.find((y) => y.key === u);
          if (!E || (E.need && !E.need())) return;
          let g = E.make();
          if (!g) return;
          {
            // v115: ทุกตัวในคอกขนาดเท่าลูกเชาเชา (สูง ~0.6 ม.) ชิวาวาเล็กกว่านิดหน่อย
            g.root.updateMatrixWorld(!0);
            let y = new mt().setFromObject(g.root, !0).getSize(new H()).y || 0.6,
              x = u === "chihuahua" ? 0.5 : u === "bulldog" || u === "bulldogpup" ? 0.52 : 0.6;
            (g.root.scale.multiplyScalar(x / y), (p = x / 0.6));
          }
          let y = new H(c + (m % 2 ? 0.7 : -0.7), 0, l + (m < 2 ? -0.45 : 0.45));
          (g.root.position.copy(y), (g.yaw = Math.random() * 6), ccsLifeOn(g), K.add(g.root), wT.push({ rig: g, pos: y, pen: pen, st: 0, tt: Math.random() * 2, tgt: y.clone(), sp: 0, hop: 0, r: 0.32 * p + 0.12, base: y }));
        } catch (E) {
          console.warn("pen dog", u, E);
        }
      });
    });
  }
  function ccsPenTick(i) {
    let e = Le[0]?.pos;
    for (let t of wT) {
      if (!t.pen) continue;
      let n = t.pen,
        s = t.rig;
      if (((t.tt -= i), t.st === 0)) {
        // ยืนดู/ดมพื้น แล้วสุ่มเป้าหมายใหม่ในคอก
        if (((t.sp += (0 - t.sp) * Math.min(1, i * 6)), t.tt <= 0)) {
          let o = 0;
          do (t.tgt.set(n.x + (Math.random() * 2 - 1) * n.hw, 0, n.z + (Math.random() * 2 - 1) * n.hd), o++);
          while (o < 6 && wT.some((r) => r !== t && r.pen === n && r.pos.distanceTo(t.tgt) < 0.6));
          ((t.st = 1), (t.tt = 6), (t.want = 0.45 + Math.random() * 0.6), Math.random() < 0.15 && (t.want = 1.6));
        }
      } else {
        let o = t.tgt.x - t.pos.x,
          r = t.tgt.z - t.pos.z,
          a = Math.hypot(o, r);
        ((t.sp += ((a > 0.25 ? t.want : 0) - t.sp) * Math.min(1, i * 4)), (t.yawT = Math.atan2(o, r)));
        if (a < 0.2 || t.tt <= 0) ((t.st = 0), (t.tt = 1.2 + Math.random() * 4), Math.random() < 0.25 && (t.hop = 0.6));
      }
      // เดินหลบตัวอื่นในคอก + อยู่ในรั้ว
      let o = t.st === 1 ? Math.sin(t.yawT ?? 0) * t.sp * i : 0,
        r = t.st === 1 ? Math.cos(t.yawT ?? 0) * t.sp * i : 0;
      for (let a of wT)
        if (a !== t && a.pen === n) {
          let c = t.pos.x - a.pos.x,
            l = t.pos.z - a.pos.z,
            h = Math.hypot(c, l),
            f = t.r + a.r;
          h < f && h > 1e-3 && ((o += (c / h) * (f - h) * 0.5), (r += (l / h) * (f - h) * 0.5));
        }
      ((t.pos.x = Math.max(n.x - n.hw, Math.min(n.x + n.hw, t.pos.x + o))), (t.pos.z = Math.max(n.z - n.hd, Math.min(n.z + n.hd, t.pos.z + r))));
      // กระโดดดีใจเบา ๆ ตอนหยุด
      let c = 0;
      t.hop > 0 && ((t.hop -= i), (c = Math.max(0, Math.sin((0.6 - t.hop) * Math.PI * 3.3)) * 0.12));
      s.root.position.set(t.pos.x, c, t.pos.z);
      // ยืนเฉย ๆ หันมองน้องเชาที่มาดูคอก
      let a = t.st === 1 ? (t.yawT ?? null) : e && e.distanceTo(t.pos) < 3.5 ? Math.atan2(e.x - t.pos.x, e.z - t.pos.z) : null;
      (Number.isFinite(s.yaw) || (s.yaw = 0), Qi(s, i, t.sp * 2.2, a)); // v113: กันมุม NaN (เดิมทำให้น้องหมาในคอกหายทั้งคอก)
    }
  }
  var Q3 = {};
  function RT(i) {
    if (i === "breast") return id("food_breast");
    if (i === "liver") return id("food_skewer");
    if (i === "sashimi") return id("sashimi");
    if (i === "wing" || i === "thigh" || i === "rice" || i === "drum") return id("food_" + i);
    if (Q3[i]) return Q3[i];
    let e = document.createElement("canvas");
    e.width = e.height = 96;
    let t = e.getContext("2d");
    ((t.lineJoin = "round"), (t.lineCap = "round"));
    let n = "#5a2e10",
      s = (h) => {
        ((t.strokeStyle = "rgba(70,30,10,.55)"), (t.lineWidth = 3));
        for (let [f, d, u, p] of h) (t.beginPath(), t.moveTo(f, d), t.lineTo(u, p), t.stroke());
      },
      o = (h, f) => {
        let d = t.createLinearGradient(0, 15, 0, 85);
        return (
          d.addColorStop(0, "#f2a24a"),
          d.addColorStop(0.5, `hsl(${h},70%,42%)`),
          d.addColorStop(1, `hsl(${f},65%,30%)`),
          d
        );
      },
      r = (h, f, d, u) => {
        ((t.strokeStyle = "#f6efe2"),
          (t.lineWidth = 9),
          t.beginPath(),
          t.moveTo(h, f),
          t.lineTo(d, u),
          t.stroke(),
          (t.fillStyle = "#f6efe2"));
        let p = d - h,
          m = u - f,
          E = Math.hypot(p, m),
          g = (-m / E) * 6,
          y = (p / E) * 6;
        for (let x of [1, -1])
          (t.beginPath(),
            t.arc(d + g * x, u + y * x, 7, 0, Math.PI * 2),
            t.fill(),
            (t.strokeStyle = "#cfc3ad"),
            (t.lineWidth = 2),
            t.stroke());
      },
      a = () => {
        ((t.strokeStyle = n), (t.lineWidth = 3), t.stroke());
      },
      c = (h, f, d, u, p) => {
        (t.save(), h());
        let m = t.createRadialGradient(f - u * 0.35, d - u * 0.4, u * 0.1, f, d, u * 1.15);
        (m.addColorStop(0, "#f7c46a"),
          m.addColorStop(0.45, "#d98a32"),
          m.addColorStop(0.85, "#9a4e18"),
          m.addColorStop(1, "#6e3410"),
          (t.fillStyle = m),
          t.fill(),
          t.clip());
        for (let g = 0; g < 140; g++) {
          let y = f + (Math.random() - 0.5) * u * 2.4,
            x = d + (Math.random() - 0.5) * u * 2.4;
          ((t.fillStyle = Math.random() < 0.5 ? "rgba(120,55,15,.35)" : "rgba(255,215,140,.35)"),
            t.beginPath(),
            t.arc(y, x, 0.8 + Math.random() * 1.6, 0, Math.PI * 2),
            t.fill());
        }
        ((t.strokeStyle = "rgba(60,25,8,.6)"), (t.lineWidth = 3.5));
        for (let [g, y, x, b] of p) (t.beginPath(), t.moveTo(g, y), t.lineTo(x, b), t.stroke());
        let E = t.createRadialGradient(f - u * 0.45, d - u * 0.5, 0, f - u * 0.45, d - u * 0.5, u * 0.55);
        (E.addColorStop(0, "rgba(255,250,230,.75)"),
          E.addColorStop(1, "rgba(255,250,230,0)"),
          (t.fillStyle = E),
          t.fillRect(0, 0, 96, 96),
          t.restore(),
          h(),
          (t.strokeStyle = "#5a2a0c"),
          (t.lineWidth = 2.5),
          t.stroke());
      },
      l = (h, f, d, u) => {
        (t.save(),
          t.translate(h, f),
          t.rotate(d),
          (t.fillStyle = "#f3ead8"),
          (t.strokeStyle = "#b9a98c"),
          (t.lineWidth = 2),
          t.beginPath(),
          t.roundRect(0, -4.5, u, 9, 4),
          t.fill(),
          t.stroke());
        for (let p of [-1, 1]) (t.beginPath(), t.arc(u, p * 5, 6, 0, Math.PI * 2), t.fill(), t.stroke());
        t.restore();
      };
    if (i === "drum")
      (l(56, 44, -0.75, 26),
        c(
          () => {
            (t.beginPath(),
              t.moveTo(60, 42),
              t.bezierCurveTo(70, 52, 62, 82, 36, 84),
              t.bezierCurveTo(12, 86, 8, 60, 24, 46),
              t.bezierCurveTo(36, 36, 50, 36, 60, 42),
              t.closePath());
          },
          38,
          64,
          26,
          [
            [22, 58, 40, 76],
            [30, 50, 50, 70],
            [44, 46, 58, 60],
          ],
        ));
    else if (i === "thigh")
      (l(70, 64, 0.5, 14),
        c(
          () => {
            (t.beginPath(),
              t.moveTo(16, 46),
              t.bezierCurveTo(14, 22, 44, 12, 64, 20),
              t.bezierCurveTo(84, 28, 84, 58, 70, 70),
              t.bezierCurveTo(56, 82, 30, 82, 20, 68),
              t.bezierCurveTo(14, 60, 14, 52, 16, 46),
              t.closePath());
          },
          48,
          46,
          34,
          [
            [24, 40, 46, 70],
            [36, 28, 60, 62],
            [52, 24, 74, 52],
          ],
        ));
    else if (i === "wing") {
      (t.save(),
        t.translate(48, 50),
        t.rotate(-0.42),
        t.translate(-48, -50),
        l(12, 50, Math.PI, 2),
        l(84, 50, 0, 2),
        c(
          () => {
            (t.beginPath(),
              t.moveTo(14, 50),
              t.bezierCurveTo(14, 34, 30, 32, 40, 38),
              t.bezierCurveTo(46, 41, 52, 41, 58, 37),
              t.bezierCurveTo(70, 30, 84, 36, 84, 50),
              t.bezierCurveTo(84, 64, 70, 70, 58, 63),
              t.bezierCurveTo(52, 59, 46, 59, 40, 62),
              t.bezierCurveTo(30, 68, 14, 66, 14, 50),
              t.closePath());
          },
          48,
          50,
          30,
          [
            [24, 40, 30, 62],
            [44, 40, 48, 60],
            [62, 38, 68, 62],
          ],
        ),
        (t.strokeStyle = "rgba(90,40,10,.45)"),
        (t.lineWidth = 1.5));
      for (let h of [46, 54])
        (t.beginPath(), t.moveTo(22, h), t.bezierCurveTo(40, h + 3, 56, h - 3, 76, h), t.stroke());
      t.restore();
    } else if (i === "liver") {
      ((t.strokeStyle = "#d7b47a"),
        (t.lineWidth = 5),
        t.beginPath(),
        t.moveTo(10, 86),
        t.lineTo(88, 12),
        t.stroke(),
        (t.strokeStyle = "#a88850"),
        (t.lineWidth = 1.5),
        t.stroke());
      for (let [h, f, d] of [
        [32, 64, 14],
        [52, 45, 15],
        [71, 27, 13],
      ]) {
        (t.save(), t.beginPath(), t.ellipse(h, f, d, d * 0.72, -0.75, 0, Math.PI * 2));
        let u = t.createRadialGradient(h - 5, f - 5, 1, h, f, d);
        (u.addColorStop(0, "#a85a46"),
          u.addColorStop(0.6, "#6a2a1c"),
          u.addColorStop(1, "#3e1410"),
          (t.fillStyle = u),
          t.fill(),
          t.clip(),
          (t.strokeStyle = "rgba(30,8,4,.6)"),
          (t.lineWidth = 3),
          t.beginPath(),
          t.moveTo(h - d, f + 3),
          t.lineTo(h + d, f - 6),
          t.stroke(),
          (t.fillStyle = "rgba(255,230,210,.55)"),
          t.beginPath(),
          t.ellipse(h - 5, f - 5, 4, 2, -0.7, 0, Math.PI * 2),
          t.fill(),
          t.restore(),
          t.beginPath(),
          t.ellipse(h, f, d, d * 0.72, -0.75, 0, Math.PI * 2),
          (t.strokeStyle = "#2a0c06"),
          (t.lineWidth = 2),
          t.stroke());
      }
    } else if (i === "breast")
      for (let h = 0; h < 4; h++) {
        (t.save(),
          t.translate(22 + h * 15, 56 - h * 3),
          t.rotate(-0.3 + h * 0.06),
          t.beginPath(),
          t.ellipse(0, 0, 11, 25, 0, 0, Math.PI * 2));
        let f = t.createLinearGradient(-11, 0, 11, 0);
        (f.addColorStop(0, "#fbf0dc"),
          f.addColorStop(0.7, "#f1dcb8"),
          f.addColorStop(1, "#e3c290"),
          (t.fillStyle = f),
          t.fill(),
          (t.strokeStyle = "#c06a22"),
          (t.lineWidth = 5),
          t.beginPath(),
          t.ellipse(0, 0, 11, 25, 0, -Math.PI * 0.55, Math.PI * 0.55),
          t.stroke(),
          (t.strokeStyle = "rgba(200,170,130,.6)"),
          (t.lineWidth = 1));
        for (let d = -2; d <= 2; d++) (t.beginPath(), t.moveTo(-6, d * 8), t.lineTo(5, d * 8 + 3), t.stroke());
        ((t.strokeStyle = "#7a4a1c"),
          (t.lineWidth = 1.6),
          t.beginPath(),
          t.ellipse(0, 0, 11, 25, 0, 0, Math.PI * 2),
          t.stroke(),
          t.restore());
      }
    else if (i === "baguette") {
      (t.save(), t.translate(48, 50), t.rotate(-0.6));
      let h = t.createLinearGradient(0, -14, 0, 14);
      (h.addColorStop(0, "#e8a050"),
        h.addColorStop(1, "#a85a22"),
        (t.fillStyle = h),
        t.beginPath(),
        t.ellipse(0, 0, 44, 13, 0, 0, Math.PI * 2),
        t.fill(),
        a(),
        (t.strokeStyle = "#f8d7a0"),
        (t.lineWidth = 4));
      for (let f of [-24, -8, 8, 24]) (t.beginPath(), t.moveTo(f - 6, -5), t.lineTo(f + 6, 4), t.stroke());
      t.restore();
    } else if (i === "pretzel") {
      let h = () => {
        (t.beginPath(),
          t.moveTo(26, 78),
          t.bezierCurveTo(10, 60, 12, 24, 36, 22),
          t.bezierCurveTo(54, 20, 58, 44, 48, 52),
          t.bezierCurveTo(38, 44, 42, 20, 60, 22),
          t.bezierCurveTo(84, 24, 86, 60, 70, 78),
          t.moveTo(26, 78),
          t.bezierCurveTo(40, 66, 60, 58, 70, 46),
          t.moveTo(70, 78),
          t.bezierCurveTo(56, 66, 36, 58, 26, 46));
      };
      (h(),
        (t.strokeStyle = n),
        (t.lineWidth = 17),
        t.stroke(),
        h(),
        (t.strokeStyle = "#b8682a"),
        (t.lineWidth = 12),
        t.stroke(),
        (t.fillStyle = "#fff"));
      for (let [f, d] of [
        [22, 50],
        [36, 28],
        [62, 28],
        [74, 50],
        [48, 62],
      ])
        t.fillRect(f, d, 4, 4);
    } else if (i === "cheesecake")
      ((t.fillStyle = "#c98a4b"),
        t.beginPath(),
        t.moveTo(14, 72),
        t.lineTo(84, 60),
        t.lineTo(84, 70),
        t.lineTo(14, 82),
        t.closePath(),
        t.fill(),
        a(),
        (t.fillStyle = "#fff1c0"),
        t.beginPath(),
        t.moveTo(14, 72),
        t.lineTo(84, 60),
        t.lineTo(80, 30),
        t.closePath(),
        t.fill(),
        a(),
        (t.fillStyle = "#fff8de"),
        t.beginPath(),
        t.moveTo(14, 72),
        t.lineTo(80, 30),
        t.lineTo(76, 24),
        t.lineTo(12, 66),
        t.closePath(),
        t.fill(),
        a(),
        (t.fillStyle = "#e2463f"),
        t.beginPath(),
        t.arc(66, 32, 8, 0, Math.PI * 2),
        t.fill(),
        (t.fillStyle = "#3e9e3e"),
        t.beginPath(),
        t.ellipse(72, 24, 5, 2.5, 0.5, 0, Math.PI * 2),
        t.fill());
    else if (i === "waffle") {
      (t.save(),
        t.translate(48, 50),
        t.rotate(0.2),
        (t.fillStyle = "#e6a74a"),
        t.beginPath(),
        t.roundRect(-32, -32, 64, 64, 10),
        t.fill(),
        a(),
        (t.fillStyle = "#c98234"));
      for (let h = 0; h < 4; h++) for (let f = 0; f < 4; f++) t.fillRect(-26 + h * 14, -26 + f * 14, 10, 10);
      ((t.fillStyle = "#fff6d0"), t.beginPath(), t.roundRect(-8, -12, 16, 12, 3), t.fill(), t.restore());
    } else if (i === "pie") {
      let h = t.createRadialGradient(48, 46, 6, 48, 50, 40);
      (h.addColorStop(0, "#f2c070"),
        h.addColorStop(1, "#c07a32"),
        (t.fillStyle = h),
        t.beginPath(),
        t.ellipse(48, 54, 38, 26, 0, 0, Math.PI * 2),
        t.fill(),
        a(),
        (t.strokeStyle = "#9a5a20"),
        (t.lineWidth = 3));
      for (let f = -2; f <= 2; f++)
        (t.beginPath(),
          t.moveTo(30 + f * 10, 32),
          t.lineTo(46 + f * 10, 76),
          t.stroke(),
          t.beginPath(),
          t.moveTo(66 + f * 10, 32),
          t.lineTo(50 + f * 10, 76),
          t.stroke());
      ((t.fillStyle = "#e2463f"), t.beginPath(), t.ellipse(48, 52, 6, 4, 0, 0, Math.PI * 2), t.fill());
    } else if (i === "saba") {
      ((t.fillStyle = "#c9a25e"),
        t.beginPath(),
        t.ellipse(48, 60, 44, 26, 0, 0, Math.PI * 2),
        t.fill(),
        (t.strokeStyle = "#7a5a2a"),
        (t.lineWidth = 2.5),
        t.stroke(),
        t.save(),
        t.beginPath(),
        t.ellipse(48, 60, 43, 25, 0, 0, Math.PI * 2),
        t.clip(),
        (t.strokeStyle = "rgba(110,80,35,.6)"),
        (t.lineWidth = 1.3));
      for (let h = -44; h <= 44; h += 6) (t.beginPath(), t.moveTo(48 + h, 34), t.lineTo(48 + h * 0.8, 86), t.stroke());
      (t.restore(), (t.fillStyle = "#e4d0a0"), t.beginPath(), t.ellipse(48, 56, 37, 19, 0, 0, Math.PI * 2), t.fill());
      for (let [h, f] of [
        [50, 1],
        [64, -1],
      ]) {
        (t.save(), t.translate(50, h), t.scale(1, (f > 0, 1)));
        let d = () => {
            (t.beginPath(),
              t.moveTo(-32, 0),
              t.bezierCurveTo(-22, -10, 12, -11, 22, -6),
              t.quadraticCurveTo(30, -2, 30, 6),
              t.quadraticCurveTo(24, 6, 20, 3),
              t.bezierCurveTo(10, 8, -22, 8, -32, 0),
              t.closePath());
          },
          u = t.createLinearGradient(0, -10, 0, 8);
        (u.addColorStop(0, "#2d5a68"),
          u.addColorStop(0.35, "#6e98a4"),
          u.addColorStop(0.6, "#d6dee0"),
          u.addColorStop(1, "#f4f6f4"),
          d(),
          (t.fillStyle = u),
          t.fill(),
          (t.fillStyle = "rgba(20,30,35,.75)"));
        for (let p = 0; p < 6; p++) (t.beginPath(), t.arc(-20 + p * 6.5, -5.5, 1.3, 0, 7), t.fill());
        (d(),
          (t.strokeStyle = "#1f2a2e"),
          (t.lineWidth = 1.8),
          t.stroke(),
          (t.fillStyle = "#c9c27a"),
          t.beginPath(),
          t.moveTo(-31, 0),
          t.lineTo(-42, -7),
          t.lineTo(-38, 0),
          t.lineTo(-42, 7),
          t.closePath(),
          t.fill(),
          t.stroke(),
          (t.fillStyle = "#fff"),
          t.beginPath(),
          t.arc(24, 0, 2.6, 0, 7),
          t.fill(),
          (t.fillStyle = "#111"),
          t.beginPath(),
          t.arc(24.4, 0, 1.4, 0, 7),
          t.fill(),
          (t.strokeStyle = "rgba(30,30,30,.5)"),
          (t.lineWidth = 1.2),
          t.beginPath(),
          t.moveTo(16, -5),
          t.quadraticCurveTo(13, 1, 17, 5),
          t.stroke(),
          t.restore());
      }
    } else if (i === "salmonfish") {
      ((t.fillStyle = "#eef3f6"),
        t.beginPath(),
        t.ellipse(48, 60, 44, 24, 0, 0, Math.PI * 2),
        t.fill(),
        (t.strokeStyle = "#b8c4cc"),
        (t.lineWidth = 2),
        t.stroke(),
        t.save(),
        t.translate(48, 52),
        t.rotate(-0.15));
      let h = () => {
          (t.beginPath(),
            t.moveTo(-34, -10),
            t.bezierCurveTo(-20, -24, 22, -24, 34, -10),
            t.bezierCurveTo(40, 4, 26, 20, 0, 20),
            t.bezierCurveTo(-26, 20, -40, 6, -34, -10),
            t.closePath());
        },
        f = t.createLinearGradient(0, -22, 0, 20);
      (f.addColorStop(0, "#f7935a"),
        f.addColorStop(0.6, "#ec7440"),
        f.addColorStop(1, "#d65c30"),
        h(),
        (t.fillStyle = f),
        t.fill(),
        t.save(),
        h(),
        t.clip(),
        (t.strokeStyle = "rgba(255,238,222,.85)"),
        (t.lineWidth = 2.6));
      for (let d = -4; d <= 4; d++)
        (t.beginPath(), t.moveTo(-40, d * 7), t.quadraticCurveTo(0, d * 7 + 12, 40, d * 7), t.stroke());
      ((t.strokeStyle = "rgba(90,35,10,.65)"), (t.lineWidth = 4));
      for (let d of [-18, -4, 10, 24]) (t.beginPath(), t.moveTo(d - 8, -20), t.lineTo(d + 6, 20), t.stroke());
      (t.restore(),
        h(),
        (t.strokeStyle = "#8a9aa0"),
        (t.lineWidth = 4.5),
        t.stroke(),
        (t.strokeStyle = "#3a2a20"),
        (t.lineWidth = 1.5),
        t.stroke(),
        t.restore());
    } else if (i === "tilapia") {
      ((t.fillStyle = "#eef3f6"),
        t.beginPath(),
        t.ellipse(48, 60, 45, 24, 0, 0, Math.PI * 2),
        t.fill(),
        (t.strokeStyle = "#b8c4cc"),
        (t.lineWidth = 2),
        t.stroke(),
        t.save(),
        t.translate(50, 54),
        t.rotate(-0.08));
      let h = () => {
        (t.beginPath(),
          t.moveTo(-28, 0),
          t.bezierCurveTo(-24, -20, 18, -24, 30, -6),
          t.quadraticCurveTo(34, 0, 30, 6),
          t.bezierCurveTo(18, 22, -24, 18, -28, 0),
          t.closePath());
      };
      ((t.fillStyle = "#5e6a58"),
        (t.strokeStyle = "#232a20"),
        (t.lineWidth = 1.8),
        t.beginPath(),
        t.moveTo(-18, -14),
        t.lineTo(-10, -24),
        t.lineTo(16, -22),
        t.lineTo(20, -14),
        t.closePath(),
        t.fill(),
        t.stroke(),
        t.beginPath(),
        t.moveTo(-27, 0),
        t.lineTo(-42, -12),
        t.lineTo(-42, 12),
        t.closePath(),
        t.fill(),
        t.stroke());
      let f = t.createLinearGradient(0, -20, 0, 18);
      (f.addColorStop(0, "#4f5a48"),
        f.addColorStop(0.5, "#98a08c"),
        f.addColorStop(1, "#e2e0d2"),
        h(),
        (t.fillStyle = f),
        t.fill(),
        t.save(),
        h(),
        t.clip(),
        (t.fillStyle = "rgba(30,35,25,.28)"));
      for (let d = 0; d < 6; d++) t.fillRect(-20 + d * 8, -22, 3.5, 40);
      (t.restore(),
        h(),
        t.stroke(),
        (t.fillStyle = "#fff"),
        t.beginPath(),
        t.arc(22, -3, 3.2, 0, 7),
        t.fill(),
        t.stroke(),
        (t.fillStyle = "#111"),
        t.beginPath(),
        t.arc(22.6, -3, 1.6, 0, 7),
        t.fill(),
        (t.strokeStyle = "rgba(30,30,30,.55)"),
        (t.lineWidth = 1.4),
        t.beginPath(),
        t.moveTo(13, -12),
        t.quadraticCurveTo(8, 0, 13, 12),
        t.stroke(),
        t.restore());
    } else if (i === "shrimp") {
      ((t.fillStyle = "#eef3f6"),
        t.beginPath(),
        t.ellipse(48, 60, 44, 24, 0, 0, Math.PI * 2),
        t.fill(),
        (t.strokeStyle = "#b8c4cc"),
        (t.lineWidth = 2),
        t.stroke());
      for (let [h, f, d, u] of [
        [30, 56, 0.2, 1],
        [62, 52, -0.4, 1],
        [48, 68, 1.1, 0.9],
      ]) {
        (t.save(), t.translate(h, f), t.rotate(d), t.scale(u, u));
        for (let m = 0; m < 6; m++) {
          let E = Math.PI * 1.05 - m * 0.42,
            g = 11,
            y = 8.5 - m * 0.9;
          (t.save(), t.translate(Math.cos(E) * g, Math.sin(E) * g), t.rotate(E + Math.PI / 2));
          let x = t.createLinearGradient(-y, 0, y, 0);
          (x.addColorStop(0, "#f9e6da"),
            x.addColorStop(0.5, "#f6b48e"),
            x.addColorStop(1, "#e2643a"),
            (t.fillStyle = x),
            t.beginPath(),
            t.ellipse(0, 0, y, 4.6, 0, 0, Math.PI * 2),
            t.fill(),
            (t.strokeStyle = "rgba(200,70,30,.7)"),
            (t.lineWidth = 1),
            t.beginPath(),
            t.ellipse(0, 0, y, 4.6, 0, Math.PI * 0.1, Math.PI * 0.9),
            t.stroke(),
            t.restore());
        }
        ((t.fillStyle = "#d8401f"), t.beginPath());
        let p = Math.PI * 1.05 - 6 * 0.42;
        (t.translate(Math.cos(p) * 11, Math.sin(p) * 11),
          t.rotate(p),
          t.moveTo(0, 0),
          t.lineTo(7, -5),
          t.lineTo(9, 0),
          t.lineTo(7, 5),
          t.closePath(),
          t.fill(),
          t.restore());
      }
    } else if (i === "fishsoup") {
      ((t.fillStyle = "#f4f1ea"),
        t.beginPath(),
        t.ellipse(48, 56, 40, 26, 0, 0, Math.PI * 2),
        t.fill(),
        (t.strokeStyle = "#b0a690"),
        (t.lineWidth = 2),
        t.stroke(),
        (t.fillStyle = "#e9dcc0"),
        t.beginPath(),
        t.ellipse(48, 52, 32, 18, 0, 0, Math.PI * 2),
        t.fill());
      for (let [h, f] of [
        [38, 50],
        [56, 48],
        [48, 58],
      ])
        ((t.fillStyle = "#fbf8f2"), t.beginPath(), t.ellipse(h, f, 8, 5, 0.3, 0, 7), t.fill());
      t.fillStyle = "#6cbf4a";
      for (let [h, f] of [
        [44, 46],
        [60, 55],
        [34, 56],
      ])
        (t.beginPath(), t.arc(h, f, 2.4, 0, 7), t.fill());
      ((t.strokeStyle = "rgba(200,200,200,.7)"), (t.lineWidth = 2));
      for (let h of [38, 50, 62])
        (t.beginPath(), t.moveTo(h, 30), t.bezierCurveTo(h - 5, 22, h + 5, 18, h, 10), t.stroke());
    }
    return (Q3[i] = e.toDataURL());
  }
  var Xk = [
      {
        icon: "🍗",
        pic: "drum",
        name: "น่องไก่ย่าง",
        price: 25,
        food: 45,
        energy: 10,
        note: "ป้าแกะกระดูกออก ไม่ปรุงรส",
        lines: [
          "น่องใหญ่ ๆ แกะกระดูกให้แล้วจ้า",
          "กินเยอะ ๆ นะลูก",
        ],
      },
      {
        icon: "🍖",
        pic: "thigh",
        name: "สะโพกไก่ย่าง",
        price: 30,
        food: 55,
        energy: 10,
        note: "แกะกระดูก ไม่ทาซอส",
        lines: [
          "สะโพกชิ้นนี้ฉ่ำสุดในเตาเลย",
          "ป้าเลือกชิ้นสวยให้",
        ],
      },
      {
        icon: "🪽",
        pic: "wing",
        name: "ปีกกลางย่าง",
        price: 20,
        food: 30,
        energy: 15,
        note: "แกะกระดูก ไม่ปรุงรส",
        lines: [
          "ปีกกลางกรอบ ๆ ไม่ใส่ซอสนะ",
          "อร่อยไหมลูก?",
        ],
      },
      {
        icon: "🟤",
        pic: "liver",
        name: "ตับไก่ย่าง",
        price: 15,
        food: 25,
        energy: 20,
        note: "บำรุงเลือด มีแรง",
        lines: [
          "ตับไก่สุกทั่วถึง ไม่ใส่เครื่องปรุง",
          "กินแล้วมีแรงวิ่งเลย",
        ],
      },
      {
        icon: "🍱",
        pic: "rice",
        name: "ข้าวอบไก่ย่าง",
        price: 45,
        food: 75,
        energy: 15,
        note: "ข้าวสวยกับไก่ฉีก ไม่ปรุงรส",
        lines: [
          "ข้าวอบไก่ย่างจานพิเศษของป้าเลย",
          "ข้าวร้อน ๆ ไก่ฉ่ำ ๆ อิ่มยาวเลยลูก",
        ],
      },
      {
        icon: "🍗",
        pic: "breast",
        name: "อกไก่ย่าง",
        price: 25,
        food: 40,
        energy: 5,
        note: "ไขมันน้อย ดีต่อสุขภาพ",
        lines: [
          "อกไก่ฉีกให้แล้ว คำเล็ก ๆ",
          "เหมาะกับน้องที่คุมน้ำหนัก",
        ],
      },
    ],
    Yk = [
      { icon: "🎣", bait: "salmon", n: 3, name: "แซลมอนทั้งตัว (เหยื่อออร์กา)", price: 60, food: 0, note: "โยนที่ปลายท่าเรือ ฝูงออร์กาจะว่ายมากิน", lines: ["ออร์กาชอบแซลมอนที่สุด ยืนปลายท่าโยนไกล ๆ นะ", "ฝูงวาฬเพชรฆาตฉลาดมาก ให้บ่อย ๆ เดี๋ยวมาเล่นด้วย"] },
      { icon: "🦑", bait: "squid", n: 4, name: "ปลาหมึกสด (เหยื่อวาฬนำร่อง)", price: 40, food: 0, note: "วาฬนำร่องชอบหมึก มากันทั้งฝูง", lines: ["วาฬนำร่องว่ายกันเป็นครอบครัวเลยนะ", "หมึกสดจากเรือเช้านี้ วาฬชอบ"] },
      { icon: "🐙", bait: "giant", n: 2, name: "หมึกยักษ์ (เหยื่อวาฬสเปิร์ม)", price: 90, food: 0, note: "วาฬสเปิร์มดำลึกล่าหมึกยักษ์ ให้แล้วอาจได้ของหายาก", lines: ["วาฬสเปิร์มตัวใหญ่สุดในทะเลนี้ ชอบหมึกยักษ์", "ถ้ามันโผล่มาหายใจ จะเห็นน้ำพุ่งสูงเลย"] },
      {
        icon: "🍣",
        pic: "sashimi",
        name: "เรือซาชิมิ (ลวกสุกให้น้อง)",
        price: 159,
        food: 95,
        energy: 25,
        note: "ปลาหลายชนิดจัดเต็มลำเรือ ลุงลวกสุก ไม่ใส่วาซาบิ",
        lines: [
          "เรือซาชิมิลำใหญ่ ปลาสดจากทะเลเช้านี้!",
          "ลุงลวกสุกให้น้องแล้ว ไม่มีก้าง ไม่มีวาซาบิ",
          "กินช้า ๆ นะ ของดีมีลำเดียว",
        ],
      },
      {
        icon: "🐟",
        pic: "saba",
        name: "ปลาทูนึ่ง (แกะก้าง)",
        price: 30,
        food: 45,
        energy: 10,
        note: "โปรตีนสูง แกะก้างให้แล้ว",
        lines: [
          "ปลาทูสด ๆ จากเรือเช้านี้",
          "ลุงแกะก้างให้หมดแล้ว กินได้เลย",
        ],
      },
      {
        icon: "🍣",
        pic: "salmonfish",
        name: "แซลมอนย่าง",
        price: 55,
        food: 55,
        energy: 20,
        note: "โอเมก้า 3 ขนสวยเงา",
        lines: [
          "แซลมอนย่างสุก ไม่ใส่เกลือ",
          "กินแล้วขนนุ่มเงาเลยนะ",
        ],
      },
      {
        icon: "🐠",
        pic: "tilapia",
        name: "ปลานิลนึ่ง",
        price: 25,
        food: 40,
        energy: 10,
        note: "เนื้อนุ่ม ย่อยง่าย",
        lines: [
          "ปลานิลตัวโต เนื้อแน่น",
          "นึ่งเปล่า ๆ อร่อยสุด",
        ],
      },
      {
        icon: "🦐",
        pic: "shrimp",
        name: "กุ้งลวก",
        price: 40,
        food: 30,
        energy: 15,
        note: "แกะเปลือกแล้ว",
        lines: [
          "กุ้งลวกแกะเปลือกแล้วจ้า",
          "หวานเด้งเลยนะ",
        ],
      },
      {
        icon: "🍲",
        pic: "fishsoup",
        name: "ซุปปลา",
        price: 20,
        food: 25,
        drink: 30,
        note: "อุ่น ๆ ได้น้ำด้วย",
        lines: [
          "ซุปปลาอุ่น ๆ ชื่นใจ",
          "ซดน้ำซุปด้วยนะ ไม่เค็ม",
        ],
      },
    ],
    DE = [
      {
        icon: "🥖",
        pic: "baguette",
        name: "ขนมปังแถว",
        price: 20,
        food: 35,
        energy: 10,
        note: "อบใหม่ทุกเช้า",
        lines: [
          "ขนมปังแถวอบใหม่ร้อน ๆ",
          "หั่นชิ้นเล็กให้น้องนะ",
        ],
      },
      {
        icon: "🥨",
        pic: "pretzel",
        name: "เพรทเซลเนยสด",
        price: 25,
        food: 30,
        energy: 20,
        note: "สูตรไม่ใส่เกลือ",
        lines: [
          "เพรทเซลสูตรน้องหมา ไม่ใส่เกลือ",
          "ลุงปั้มบิดเองกับมือ",
        ],
      },
      {
        icon: "🍰",
        pic: "cheesecake",
        name: "ชีสเค้กสูตรน้องหมา",
        price: 45,
        food: 40,
        energy: 25,
        note: "ไม่ใส่น้ำตาล ใช้โยเกิร์ตจืด",
        lines: [
          "ชีสเค้กชิ้นจิ๋ว กินพอหอมปากหอมคอ",
          "ของหวานนาน ๆ ทีนะ",
        ],
      },
      {
        icon: "🧇",
        pic: "waffle",
        name: "วาฟเฟิล",
        price: 35,
        food: 35,
        energy: 25,
        note: "สูตรน้องหมา ไม่หวาน",
        lines: [
          "วาฟเฟิลกรอบ ๆ ร้อน ๆ",
          "ลุงไม่ราดน้ำเชื่อมให้นะ",
        ],
      },
      {
        icon: "🥧",
        pic: "pie",
        name: "พายไก่",
        price: 40,
        food: 55,
        energy: 15,
        note: "ไส้ไก่ ไม่ใส่หอมกระเทียม",
        lines: [
          "พายไก่ไส้แน่น อิ่มท้องแน่นอน",
          "อบกำลังดีเลย",
        ],
      },
    ],
    ul = { lay: 0, cook: 3, sell: 3, trade: 2 },
    Zk = () => Math.min(6, 2 + z.chickens),
    k0 = (i) => (z.eggUse ?? (z.eggUse = {}))[i] ?? 0,
    y1 = (i, e = 1) => {
      let t = z.eggUse ?? (z.eggUse = {});
      t[i] = (t[i] ?? 0) + e;
    },
    ya = () => z.inv.egg ?? 0;
  function M1(i) {
    return ya() < i ? !1 : ((z.inv.egg = ya() - i), Ei(), !0);
  }
  function _T(i) {
    let e = ul.sell - k0("sell:" + i);
    return `<div class="row"><span class="ic">🥚</span><div><b>ขายไข่ไก่สดให้ร้าน</b><small>ฟองละ 40 💰 (กล่องส่งของ 35) \xB7 วันนี้รับอีก ${Math.max(0, e)} ฟอง \xB7 มี ${ya()} ฟอง</small></div><button data-egg="sell:${i}" ${e <= 0 || ya() <= 0 ? "disabled" : ""}>ขาย</button></div>`;
  }
  function Kk() {
    let i = ul.trade - k0("trade");
    return `<div class="row"><span class="ic">🥚</span><div><b>เอาไข่ 3 ฟองแลกขนมปังอบใหม่</b><small>ฟรี! +45🍖 +10⚡ \xB7 วันนี้แลกได้อีก ${Math.max(0, i)} ครั้ง \xB7 มี ${ya()} ฟอง</small></div><button data-egg="trade" ${i <= 0 || ya() < 3 ? "disabled" : ""}>แลก</button></div>`;
  }
  function ST(i, e) {
    document.querySelectorAll("[data-egg]").forEach((t) =>
      t.addEventListener("click", () => {
        let n = t.dataset.egg;
        if (n.startsWith("sell:")) {
          if (k0(n) >= ul.sell || !M1(1)) {
            ke("nope");
            return;
          }
          (y1(n),
            (z.money += 40),
            ke("coin"),
            Ln(
              i,
              [
                "ไข่สดจริง ๆ ขอบใจนะ!",
                "เอามาอีกนะ ป้า/ลุงรับซื้อ",
                "ฟองโตดีจัง",
              ][Math.floor(Math.random() * 3)],
            ));
        } else if (n === "trade") {
          if (k0("trade") >= ul.trade || !M1(3)) {
            ke("nope");
            return;
          }
          (y1("trade"), mi(45, 0), (z.energy = Math.min(100, (z.energy ?? 0) + 10)), ke("coin"));
          let s = Le[0];
          (s &&
            rt(
              "🍞 ขนมปังอบใหม่ +45🍖",
              s.pos.clone().setY(1.4),
              "big",
            ),
            Ln(
              i,
              "ไข่สวยมาก! เดี๋ยวลุงเอาไปทำเค้ก รับขนมปังไปเลย",
            ));
        }
        (Ei(), _t(z), e());
      }),
    );
  }
  function dd(i, e, t, n) {
    let s = e
        .map(
          (r, a) =>
            `<div class="row"><span class="ic">${r.pic ? `<img src="${RT(r.pic)}" alt="" style="width:40px;height:40px;display:block">` : r.icon}</span><div><b>${r.name}</b><small>${ccsPriceF(e, r) < 1 ? `<s>${r.price}</s> ${Math.round(r.price * ccsPriceF(e, r))}` : r.price} 💰 \xB7 ${r.bait ? `เหยื่อ ×${r.n} (มี ${z.bait?.[r.bait] ?? 0})` : `+${r.food}🍖${r.energy ? " +" + r.energy + "⚡" : ""}`} \xB7 ${r.note}</small></div><button data-food="${a}" ${z.money < r.price ? "disabled" : ""}>ซื้อ</button></div>`,
        )
        .join(""),
      o = n === "sell" ? _T(i) : n === "trade" ? Kk() : "";
    (Gi(i, `<p class="note">💰 ${z.money}</p>${s}${o}`),
      n && ST(t, () => dd(i, e, t, n)),
      document.querySelectorAll("[data-food]").forEach((r) =>
        r.addEventListener("click", () => {
          let a = e[+r.dataset.food],
            c = Math.round(a.price * ccsPriceF(e, a));
          if (z.money < c) {
            ke("nope");
            return;
          }
          if (a.bait) {
            // v121: เหยื่อให้ปลาวาฬ (เก็บไว้โยนที่ท่าเรือ ไม่ได้กินเอง)
            (((z.bait ??= {})[a.bait] = (z.bait[a.bait] ?? 0) + a.n), (z.money -= c), ke("coin"), Ei(), Ln(t, a.lines[Math.floor(Math.random() * a.lines.length)]), De(`ได้ ${a.icon} ${a.name.split(" (")[0]} ×${a.n} ไปโยนที่ปลายท่าเรือนะ 🐳`, 2400), _t(z), dd(i, e, t, n));
            return;
          }
          ((z.money -= c),
            mi(a.food, a.drink ?? 0),
            a.energy && (z.energy = Math.min(100, (z.energy ?? 0) + a.energy)),
            ke("coin"),
            Ei());
          let l = Le[0];
          (l && rt(`อร่อย! +${a.food}🍖`, l.pos.clone().setY(1.4), "big"),
            Ln(t, a.lines[Math.floor(Math.random() * a.lines.length)]),
            _t(z),
            dd(i, e, t, n));
        }),
      ));
  }
  var T1 = [
      {
        key: "chow_cream",
        name: "ลูกเชาเชาสีครีม",
        icon: "🐻",
        price: 1200,
        note: "ขนฟูนุ่ม ขี้อ้อน",
        make: () => ui("cream", 0.52),
      },
      {
        key: "chow_red",
        name: "ลูกเชาเชาสีแดง",
        icon: "🦁",
        price: 1200,
        note: "ร่าเริง ชอบวิ่ง",
        make: () => ui("red", 0.52),
      },
      {
        key: "chow_black",
        name: "ลูกเชาเชาสีดำ",
        icon: "🐼",
        price: 1400,
        note: "หายาก เท่สุด ๆ",
        make: () => ui("black", 0.52),
      },
      {
        key: "chow_blue",
        name: "ลูกเชาเชาสีบลู",
        icon: "🌫",
        price: 1600,
        note: "สีเทาอมฟ้า หายากมาก",
        make: () => ui("blue", 0.52),
      },
      {
        key: "chow_white",
        name: "ลูกเชาเชาสีขาว",
        icon: "☁️",
        price: 1400,
        note: "ขาวฟูเหมือนก้อนเมฆ",
        make: () => ui("white", 0.52),
      },
      {
        key: "poodle",
        name: "พุดเดิ้ล",
        icon: "🐩",
        price: 900,
        note: "ขนหยิก ไม่ร่วง",
        make: () => ui("orange", 0.62, "poodle"),
      },
      {
        key: "bulldog",
        name: "บูลด็อก",
        icon: "🐶",
        price: 900,
        note: "หน้าย่น ใจดี",
        make: () => ccsTB("pet_britbull", 0.42, () => ui("orange", 0.62, "bulldog", 14859408)), // v112: บูลด็อกอังกฤษโมเดลใหม่
      },
      {
        key: "chihuahua",
        name: "ชิวาวา",
        icon: "🐕",
        price: 700,
        note: "ตัวจิ๋ว ใจใหญ่",
        make: () => Kr("chihuahua"),
      },
      {
        key: "pitt",
        name: "พิทบูล",
        icon: "😁",
        price: 1e3,
        note: "ยิ้มเก่ง ชอบกอด",
        make: () => Kr("pitt"),
      },
      {
        key: "labrador",
        name: "ลาบราดอร์",
        icon: "🦮",
        price: 1100,
        note: "ว่ายน้ำเก่ง",
        make: () => ccsTB("pet_labrador", 0.46, () => Kr("labrador")), // v109: โมเดลลาบราดอร์ใหม่ มีเท็กซ์เจอร์จริง
      },
      // v109: สัตว์เลี้ยงใหม่
      {
        key: "sharpei",
        need: () => !!vp.pet_sharpei,
        name: "ชาไป่",
        icon: "🫓",
        price: 1250,
        note: "หน้าย่น ลิ้นสีม่วงเหมือนเชาเชา",
        make: () => ccsTB("pet_sharpei", 0.42), // v110: ใช้โมเดลเหมือนจริง (ตัวการ์ตูนย้ายไปเป็นตุ๊กตา)
      },

      {
        key: "pharaoh",
        need: () => !!vp.pet_pharaoh,
        name: "ฟาโรห์ฮาวด์",
        icon: "🏺",
        price: 1500,
        note: "หมาโบราณ ยิ้มแล้วหน้าแดง",
        make: () => ccsTB("pet_pharaoh", 0.5),
      },

      {
        key: "bulldogpup",
        need: () => !!vp.pet_bulldogpup,
        name: "ลูกบูลด็อก",
        icon: "🍼",
        price: 1000,
        note: "ตัวป้อม หน้าย่น ขี้เซา",
        make: () => ccsTB("pet_bulldogpup", 0.42),
      },

      {
        key: "cat",
        need: () => !!vp.pet_cat,
        name: "แมวส้ม",
        icon: "🐈",
        price: 800,
        note: "ขี้อ้อน เดินตามน้องหมาได้",
        make: () => ccsTB("pet_cat", 0.36),
      },

      {
        key: "rott",
        name: "ร็อตไวเลอร์",
        icon: "🛡",
        price: 1300,
        note: "เฝ้าบ้านเก่ง",
        make: () => Kr("rott"),
      },
      {
        key: "doberman",
        name: "โดเบอร์แมน",
        icon: "⚡",
        price: 1300,
        note: "วิ่งเร็วที่สุด",
        make: () => Kr("doberman"),
      },
    ],
    w1 = 5,
    Pr = [],
    Vs = [];
  function BE(i, e) {
    let t = T1.find((n) => n.key === i);
    if (t)
      try {
        let n = t.make();
        (ccsLifeOn(n), K.add(n.root));
        let s = Le[0],
          o = (e ?? s?.pos ?? new H()).clone().add(new H(Math.random() - 0.5, 0, 1 + Pr.length * 0.8));
        Pr.push({ rig: n, pos: o, spd: 0, dir: null, sale: t, stuck: 0 });
      } catch (n) {
        console.warn("comp", n);
      }
  }
  function Jk(i) {
    let e = z.comps ?? (z.comps = []);
    if (e.length >= w1) {
      (ke("nope"),
        De(
          `มีเพื่อนเดินตามครบ ${w1} ตัวแล้วนะ`,
          2200,
        ));
      return;
    }
    if (z.money < i.price) {
      (ke("nope"),
        De(
          `เงินไม่พอ ต้องใช้ ${i.price} 💰`,
          1800,
        ));
      return;
    }
    ((z.money -= i.price), e.push(i.key), BE(i.key));
    for (let t of Pr) t.rig.root.visible = !Se;
    (ke("catch"),
      De(
        `🐾 ${i.name} มาเป็นเพื่อนแล้ว! จะเดินตามไปทุกที่เลย`,
        3e3,
      ),
      (j.score += 50),
      Ei(),
      _t(z));
  }
  function HT(i, e) {
    if (Se) {
      Vs.length = 0;
      for (let t of Pr) t.rig.root.visible = !1;
      return;
    }
    (Vs.length && Vs[0].distanceTo(e.pos) > 4 && (Vs.length = 0),
      (!Vs.length || Vs[0].distanceTo(e.pos) > 0.35) && (Vs.unshift(e.pos.clone()), Vs.length > 60 && Vs.pop()),
      Pr.forEach((t, n) => {
        if (((t.rig.root.visible = !Se), Se)) return;
        let s =
            Vs.length > 4 + n * 4
              ? Vs[4 + n * 4]
              : e.pos.clone().add(new H(Math.sin(n * 2.1) * (1.2 + n * 0.4), 0, Math.cos(n * 2.1) * (1.2 + n * 0.4))),
          o = t.pos.distanceTo(s);
        o > 12 && t.pos.copy(h1(s.clone()));
        {
          let c = t;
          if ((c.jam ?? (c.jam = 0), c.lastP && c.lastV && c.lastV.lengthSq() > 1e-6 && o > 1.4)) {
            let l = c.lastV.length();
            jA.copy(t.pos).sub(c.lastP).setY(0).dot(c.lastV) / l < l * 0.35
              ? (c.jam += i)
              : (c.jam = Math.max(0, c.jam - i * 1.5));
          } else c.jam = Math.max(0, c.jam - i * 1.5);
          if (c.jam > 1) {
            c.jam = 0;
            let h =
              [...Vs.slice(1, 8), e.pos.clone()].find((f) => f.distanceTo(t.pos) > 0.8 && !ri(f, 0.35, !1, !0)) ??
              h1(e.pos.clone());
            (t.pos.copy(h), (t.stuck = 0));
          }
          ((c.lastP ?? (c.lastP = new H())).copy(t.pos), c.lastV ?? (c.lastV = new H()), c.lastV.set(0, 0, 0));
        }
        let r = t;
        (r.vel ?? (r.vel = new H()),
          o > 0.95 ? (r.go = !0) : o < 0.45 && (r.go = !1),
          r.go
            ? Xt.copy(s)
                .sub(t.pos)
                .setY(0)
                .normalize()
                .multiplyScalar(Math.min(11.5, 1.3 + o * 1.7))
            : Xt.set(0, 0, 0),
          r.vel.lerp(Xt, 1 - Math.exp(-i * 6.5)));
        let a = r.vel.length();
        if (a > 0.08) {
          let c = t.pos.clone().addScaledVector(r.vel, i);
          if (!ri(c, 0.3, !1, !0) || hl(c, 0.3) < hl(t.pos, 0.3) || t.stuck > 0.6) (t.pos.copy(c), (t.stuck = 0));
          else {
            let l = t.pos.clone();
            l.x = c.x;
            let h = t.pos.clone();
            ((h.z = c.z), ri(l, 0.3, !1, !0) ? (ri(h, 0.3, !1, !0) ? (t.stuck += i) : t.pos.copy(h)) : t.pos.copy(l));
          }
          ((t.spd = a), (t.dir = Math.atan2(r.vel.x, r.vel.z)), r.lastV?.copy(r.vel).multiplyScalar(i));
        } else ((t.spd = 0), o < 2.5 && (t.dir = Math.atan2(e.pos.x - t.pos.x, e.pos.z - t.pos.z)));
        (t.rig.root.position.copy(t.pos), (t.rig.root.position.y = x4(t.pos, t.rig.yaw, b4)));
        {
          let c = t,
            l = go(t.pos.x, t.pos.z);
          ((c.wade = (c.wade ?? 0) + (l - (c.wade ?? 0)) * Math.min(1, i * 6)),
            (t.rig.root.position.y -= c.wade),
            l > 0.12 &&
              t.spd > 0.6 &&
              (c.wetT = (c.wetT ?? 0) - i) < 0 &&
              ((c.wetT = 0.35), tl.burst(t.pos.clone(), dE(t.pos), 0.45)));
        }
        (hT(t.rig, i, t.spd > 0.3, !1, !1), Qi(t.rig, i, t.spd, t.dir));
      }));
  }
  function gb(i) {
    let e = z.comps ?? [],
      t = T1.map(
        (n, s) =>
          n.need && !n.need() ? "" :
          `<div class="row"><span class="ic">${(n.make && ccsThumb("dog:" + n.key, n.make)) || n.icon}</span><div><b>${n.name}</b><small>${n.price} 💰 \xB7 ${n.note}</small></div><button data-dog="${s}" ${z.money < n.price || e.length >= w1 ? "disabled" : ""}>รับเลี้ยง</button></div>`,
      ).join("");
    (Gi(
      "ร้านสัตว์เลี้ยง 🐶",
      `<p class="note">💰 ${z.money} \xB7 เพื่อนที่เดินตามตอนนี้ ${e.length}/${w1} ตัว</p>${t}<button class="catbtn" id="toToys">🧸 ดูของเล่น ตุ๊กตา ขนม</button>`,
    ),
      document.querySelectorAll("[data-dog]").forEach((n) =>
        n.addEventListener("click", () => {
          (Jk(T1[+n.dataset.dog]), gb(i));
        }),
      ),
      document.getElementById("toToys")?.addEventListener("click", () => v1(i, !0)));
  }
  function v1(i, e = !1) {
    if (i.def.id === "petshop" && !e) return gb(i);
    let t = g4(i.def.id),
      n = z.hats ?? [],
      s = t
        .map((a, c) => {
          let l = a.label.match(/^(.*?)\s*((?:\p{Extended_Pictographic}|‍|️)+)\s*(?:\((.*)\))?\s*$/u),
            h = l ? l[1] : a.label,
            f = l ? l[2] : "🛒",
            d = l?.[3] ?? "",
            u = a.key.startsWith("hat:") ? a.key.slice(4) : "",
            p = !!u && n.includes(u),
            m = p ? (pb(u) ? "ถอด" : "ใส่") : "ซื้อ";
          (a.thumb || a.make) && (f = ccsThumb("w:" + a.key, a.thumb || a.make) || f);
          return `<div class="row"><span class="ic">${f}</span><div><b>${h}</b><small>${p ? "มีแล้ว" : a.price + " 💰"}${d ? " \xB7 " + d : ""}</small></div><button data-ware="${c}" ${!p && z.money < a.price ? "disabled" : ""}>${m}</button></div>`;
        })
        .join(""),
      o =
        i.def.id === "groom" && mr()
          ? `<button class="catbtn" id="toCat">📖 แคตตาล็อกแต่งตัวน่ารัก (หมวก ${Qk.hat} แบบ \xB7 แว่น \xB7 หนวด)</button>`
          : "",
      r = i.def.id === "grocery" ? _T("grocery") : "";
    (Gi(`${i.def.name} 🛍`, `<p class="note">💰 ${z.money}</p>${o}${s}${r}`),
      r && ST(i.inside.keeperSpot, () => v1(i)),
      document.getElementById("toCat")?.addEventListener("click", () => {
        (ke("pop"), OE());
      }),
      document.querySelectorAll("[data-ware]").forEach((a) =>
        a.addEventListener("click", () => {
          let c = t[+a.dataset.ware];
          (P1({ key: c.key, label: c.label, price: c.price }), v1(i, e)); // v105: ซื้อแล้วอยู่หน้าเดิม (ไม่เด้งกลับหน้ารับเลี้ยง)
        }),
      ));
  }
  var Qk = { hat: 59 },
    qc = "Hat";
  function OE() {
    let i = [
        ["Hat", "🎩 หมวก"],
        ["Glasses", "👓 แว่น"],
        ["face", "🥸 หน้า"],
        ["neck", "🦮 ปลอกคอ"],
        ["body", "👕 เสื้อ"],
        ["feet", "👟 รองเท้า"],
      ],
      e = z.hats ?? [],
      t = ["neck", "body", "feet"].includes(qc)
        ? R0.filter((s) => s.slot === qc && !s.q).map((s) => ({
            k: `dw:${s.key}`,
            n: s.key,
            l: s.name,
            ic: s.icon,
            pr: s.price,
          }))
        : KE.filter(([s]) =>
            qc === "face"
              ? ub(s) === "face" || s.startsWith("Bandage") || s.startsWith("Headphones")
              : s.startsWith(qc),
          ).map(([s, o, r, a]) => ({ k: `cc:${s}`, n: s, l: o, ic: r, pr: a })),
      n = t
        .map((s, o) => {
          let r = e.includes(s.k);
          let ic = s.k.startsWith("cc:")
            ? ccsThumb(s.k, () => r0(s.n, Ok(s.n), ub(s.n) === "head" ? "bottom" : "center"))
            : s.k.startsWith("dw:") && R0.find((a) => a.key === s.n)?.slot === "neck"
              ? ccsThumb(s.k, () => Bk(R0.find((a) => a.key === s.n)))
              : "";
          return `<div class="row"><span class="ic">${ic || s.ic}</span><div><b>${s.l}</b><small>${r ? "มีแล้ว \xB7 ใส่ได้ที่ตู้เสื้อผ้า" : s.pr + " 💰"}${A0(s.k) ? " \xB7 " + A0(s.k) : ""}</small></div><button data-cat="${o}">${r ? (pb(s.k) ? "ถอด" : "ใส่") : "ซื้อ"}</button></div>`;
        })
        .join("");
    (Gi(
      "แคตตาล็อกแต่งตัวน่ารัก 📖",
      `<div class="tabs wtabs">${i.map(([s, o]) => `<button data-ctab="${s}" class="${s === qc ? "on" : ""}">${o}</button>`).join("")}</div><p class="note">💰 ${z.money} \xB7 ซื้อแล้วไปแต่งที่ตู้เสื้อผ้า (ปุ่ม 👗) ได้ทุกเมื่อ</p>${n}`,
    ),
      document.querySelectorAll("[data-ctab]").forEach((s) =>
        s.addEventListener("click", () => {
          ((qc = s.dataset.ctab), OE());
        }),
      ),
      document.querySelectorAll("[data-cat]").forEach((s) =>
        s.addEventListener("click", () => {
          let o = t[+s.dataset.cat];
          ((z.hats ?? []).includes(o.k) ? (vd(o.k), ke("pop")) : P1({ key: `hat:${o.k}`, label: o.l, price: o.pr }),
            OE());
        }),
      ));
  }
  function P1(i) {
    if (i.key.startsWith("hat:")) {
      let t = i.key.slice(4);
      if ((z.hats ?? (z.hats = [])).includes(t)) {
        (vd(t), ke("pop"), _t(z));
        return;
      }
    }
    if (i.key.startsWith("tool:") && z.tools[i.key.slice(5)]) {
      De(
        "มีของวิเศษชิ้นนี้แล้ว ✨",
        1800,
      );
      return;
    }
    if (i.key.startsWith("cab:") && ccsCabN() >= +i.key.slice(4)) {
      De("มีตู้ใบนี้แล้ว 🗄️", 1800);
      return;
    }
    if (i.key === "chick" && z.chickens >= 4) {
      De("เล้าเต็มแล้ว (4 ตัว)", 1800);
      return;
    }
    if (z.money < i.price) {
      (ke("nope"),
        De(
          `เงินไม่พอ ต้องใช้ ${i.price} 💰`,
          1800,
        ));
      return;
    }
    z.money -= i.price;
    {
      let t = Math.floor(i.price * RC());
      t > 0 &&
        ((z.money += t),
        rt(
          `💖 ส่วนลดเสน่ห์ -${t}💰`,
          Le[0].pos.clone().setY(2.4),
        ));
    }
    Ai("buy");
    let e = i.key;
    if (e.startsWith("seed:")) {
      ((z.inv[e] = (z.inv[e] ?? 0) + 1), (Fn = e));
      let t = so(e.slice(5));
      t.season !== z.season &&
        De(
          `${t.name} ปลูกได้${Us[t.season].name}นะ เก็บไว้ก่อนได้`,
          2400,
        );
    } else if (e === "snack") ((z.energy = Math.min(100, z.energy + 40)), mi(15, 0));
    else if (e === "kibble") mi(60, 0);
    else if (s1[e]) {
      let t = "food:" + e;
      ((z.inv[t] = (z.inv[t] ?? 0) + 1), (Fn = t), Ei());
      let n = bi.foodSeen ?? (bi.foodSeen = []),
        s = ti(t);
      n.includes(e)
        ? De(
            `${s.icon} เก็บ${s.name}ไว้เป็นของฝากชาวเมือง (หมากินไม่ได้)`,
            2200,
          )
        : (n.push(e),
          Ai("care"),
          Rs(5, Le[0]),
          Gi(
            "ของคน ไม่ใช่ของน้อง 🐾",
            `<div class="care"><div class="big">${s.icon}</div><h3>${s.name} เก็บไว้เป็นของฝากนะ</h3><p>${s1[e]}</p><p class="note">🎁 เลือกในกระเป๋าแล้วเดินไปหาชาวเมือง กดให้ของฝาก ได้ใจ ♥ เพิ่ม</p></div>${K4}<button class="bigbtn" id="careOk">เข้าใจแล้ว (+5 EXP)</button>`,
          ),
          it("careOk").addEventListener("click", qs));
    } else if (o6[e]) {
      let [t, n, s] = o6[e];
      (mi(t, n), s && (z.energy = Math.min(100, z.energy + s)), s6[e] && De(`😋 ${s6[e]}`, 2200));
    } else if (e.startsWith("cab:")) {
      ((z.cabinets = +e.slice(4)), H1(), ke("heart"), _t(z));
      De(`🗄️ ได้ตู้โชว์ใบที่ ${z.cabinets} แล้ว! วางไว้ผนังเดียวกับตู้เดิมในบ้าน`, 2800);
    } else
      e.startsWith("plush:")
        ? ((z.plush ?? (z.plush = [])).push(e.slice(6)),
          H1(),
          De(
            `🧸 ได้ตุ๊กตา${Rp[e.slice(6)] ?? ""} · ${ccsPlushNote(e.slice(6))}`,
            2400,
          ))
        : e === "toy:ball"
          ? ((z.energy = Math.min(100, z.energy + 15)),
            (j.score += 5),
            De("🎾 กัดเล่นสนุกมาก!", 1600))
          : e === "toy:rope"
            ? ((z.energy = Math.min(100, z.energy + 10)),
              (j.score += 5),
              De(
                "🪢 ดึงเชือกแข่งกัน ฟันสะอาดด้วย!",
                1600,
              ))
            : e === "treat"
              ? (mi(20, 0), (z.energy = Math.min(100, z.energy + 10)))
              : e === "beef"
                ? mi(70, 0)
                : e === "chicken"
                  ? mi(50, 0)
                  : e === "salmon"
                    ? (mi(55, 0), (z.energy = Math.min(100, z.energy + 10)))
                    : e === "can"
                      ? (mi(40, 0), (z.energy = Math.min(100, z.energy + 20)))
                      : e === "water"
                        ? mi(0, 70)
                        : e === "fruit"
                          ? mi(35, 20)
                          : e === "chew"
                            ? (z.energy = Math.min(100, z.energy + 50))
                            : e === "vitamin"
                              ? (z.energy = Math.min(100, z.energy + 30))
                              : e === "checkup"
                                ? (z.energy = 100)
                                : e === "bath" && ccsBathStart()
                                  ? 0
                                  : e === "bath"
                                  ? ((z.energy = Math.min(100, z.energy + 60)),
                                    (z.clean = 100),
                                    rt(
                                      "🫧 สะอาดหอมฟุ้ง!",
                                      Le[0]?.pos.clone().setY(1.4) ?? new H(),
                                      "cool",
                                    ))
                                  : e === "brush"
                                    ? ((z.energy = Math.min(100, z.energy + 20)),
                                      (z.clean = Math.min(100, (z.clean ?? 100) + 25)))
                                    : e === "chick"
                                      ? ((z.chickens += 1),
                                        wd(),
                                        De(
                                          "ลูกไก่ไปอยู่ที่เล้าข้างฟาร์มแล้ว 🐣",
                                          2200,
                                        ))
                                      : e.startsWith("tool:")
                                        ? ((z.tools[e.slice(5)] = !0),
                                          De(
                                            "ได้ของวิเศษแล้ว! ✨",
                                            2e3,
                                          ))
                                        : e.startsWith("hat:") &&
                                          ((z.hats ?? (z.hats = [])).push(e.slice(4)),
                                          vd(e.slice(4), !0),
                                          De(
                                            "ใส่ให้น้องแล้ว น่ารักมาก! 💕 (ถอด/เปลี่ยนได้ที่ปุ่ม 👗)",
                                            2400,
                                          ));
    (ke("coin"), rt(`-${i.price}💰`, Le[0].pos, "cool"), Ei(), _t(z));
  }
  function eP() {
    let i = es
      .map((e, t) => {
        let n = z.hearts[t];
        return `<div class="row"><span class="ic">${e.face}</span><div><b>${e.name}</b><small>${z.hearts[t] >= 3 ? `ชอบ ${ti(e.like).icon} ${ti(e.like).name}` : "ยังไม่รู้ว่าชอบอะไร"}</small></div><span class="hearts">${"♥".repeat(Math.ceil(n / 2))}<i>${"♥".repeat(5 - Math.ceil(n / 2))}</i></span></div>`;
      })
      .join("");
    (Gi(
      "เพื่อนในเมือง 👥",
      `${i}<p class="note">คุยทุกวัน +1♥ \xB7 ให้ของ +1♥ \xB7 ของโปรด +3♥<br>🎁 วิธีให้ของ: เลือกของในกระเป๋าแถบล่างให้ขึ้นกรอบ (มือถือ: แตะ · คีย์บอร์ด: เลข 1-9 หรือ Z/X · จอย: D-pad ◀▶, ▼ ยกเลิก) แล้วเดินไปใกล้เพื่อน กดปุ่ม “🎁 ให้…” (F/Enter หรือ Ⓐ)</p><button class="reset" id="resetSave">เริ่มฟาร์มใหม่</button>`,
    ),
      it("resetSave").addEventListener("click", () => {
        (DM(), location.reload());
      }));
  }
  function AT(i) {
    co.schedule(i, (z.day * 0.618 + z.season * 0.37 + z.year * 0.11) % 1);
  }
  function CT(i) {
    if ((Se && Sd(null), (ho = null), (j.jy = 0), (j.vy = 0), (j.gy = 0), i)) {
      Oh(2, 0.5);
      let o = document.getElementById("sleepfx");
      o &&
        (o.classList.add("on"),
        (o.innerHTML = "<div>💤</div><p>ครอก… ฟี้…</p>"),
        setTimeout(() => o.classList.remove("on"), 2600));
    }
    let e = Object.entries(z.ship).reduce((o, [r, a]) => o + ti(r).sell * a, 0);
    ((z.money += e), (z.ship = {}));
    for (let o of z.tiles)
      (o.crop && !o.dead && o.watered && o.growth < so(o.crop).days && (o.growth += 1), (o.watered = !1));
    ((z.day += 1), St && !St.done && RE(), (St = null), ab());
    let t = "";
    if (z.day > PM) {
      ((z.day = 1), (z.season = (z.season + 1) % 3), z.season === 0 && (z.year += 1));
      for (let o of z.tiles) o.crop && so(o.crop).season !== z.season && (o.dead = !0);
      t = `<p>เข้าสู่<b>${Us[z.season].name}</b> ${Us[z.season].icon} ผักนอกฤดูเหี่ยวหมดแล้ว</p>`;
    }
    if (((z.rainToday = Math.random() < Us[z.season].rain), z.rainToday))
      for (let o of z.tiles) o.crop && (o.watered = !0);
    (AT(z.rainToday), (z.talked = z.talked.map(() => 0)), (z.gifted = z.gifted.map(() => 0)));
    let n = Math.min(z.fed, z.chickens);
    ((z.eggs += n), (z.fed = 0));
    let s = "";
    (z.hatch &&
      ((z.hatch = 0),
      z.chickens < 4 &&
        ((z.chickens += 1),
        (s =
          "<p>🐣 ไข่ที่กกไว้ฟักแล้ว! ได้ลูกไก่ตัวใหม่ในเล้า</p>"))),
      (z.eggUse = {}),
      wd(),
      Dk(),
      k1(),
      e && ke("coin"),
      (z.hunger = Math.max(15, (z.hunger ?? 100) - 20)),
      (z.thirst = Math.max(15, (z.thirst ?? 100) - 20)),
      (z.energy = i ? 55 : 100),
      (z.score = j.score),
      (z.bones = j.bones),
      (j.time = 0.25),
      (j.yaw = Math.PI));
    {
      let o = ze("beach_house");
      (Le[0].pos.copy(mo).add(new H(0, 0, o ? 0.9 : -1.4)), (Le[0].dir = o ? 0 : Math.PI));
    }
    (Lt.position.set(Le[0].pos.x, 5, Le[0].pos.z - 9),
      ml.forEach((o, r) => o.pos.set(mo.x - 1 + r, 0, mo.z - 2.6)),
      _t(z),
      Gi(
        i
          ? "เผลอหลับกลางทาง 😴"
          : "อรุณสวัสดิ์ ☀️",
        `<div class="morning"><div class="big">${Us[z.season].icon}</div><p><b>${Us[z.season].name} วันที่ ${z.day}</b> \xB7 ปี ${z.year}</p>${t}${s}${e ? `<p>ขายผลผลิตได้ <b>${e} 💰</b></p>` : ""}${z.rainToday ? "<p>วันนี้ช่วงสายจะมีเมฆครึ้ม ฟ้าร้อง แล้วฝนตก 🌧 ฝนหยุดแล้วลองมองหารุ้งนะ 🌈</p>" : ""}${n ? `<p>ไก่ออกไข่ ${n} ฟอง 🥚 ไปเก็บที่เล้า</p>` : ""}${z.request ? `<p>📜 ${es[z.request.npc].name} มีเรื่องอยากให้ช่วย ไปคุยดูนะ (มีสติกเกอร์ 💡 เหนือหัว)</p>` : ""}${i ? "<p>ดึกเกินไป พลังเหลือ 60⚡ คืนนี้กลับบ้านนอนให้ทันนะ</p>" : ""}<p>เงิน ${z.money} 💰</p></div>`,
      ));
  }
  setInterval(() => {
    j.started && ((z.score = j.score), (z.bones = j.bones), _t(z));
  }, 8e3);
  var la = null,
    eE = null,
    o4 = null,
    jp = !1;
  async function R1(i) {
    let e = _i();
    if (e) {
      if (!i) {
        (la?.stop(), (la = null));
        return;
      }
      if (!la) {
        if (!eE) {
          if (jp) return;
          jp = !0;
          try {
            let t = window,
              n;
            if (t.__MP3) {
              let s = atob(t.__MP3),
                o = new Uint8Array(s.length);
              for (let r = 0; r < s.length; r++) o[r] = s.charCodeAt(r);
              n = o.buffer;
            } else n = await (await fetch(nb("showa_night.mp3"))).arrayBuffer();
            eE = await e.decodeAudioData(n);
            // v115: ตัดช่วงเฟดจบ + เงียบท้ายเพลงออก วนต่อเนื่องแบบลงจังหวะ (85 BPM, ห้องละ 2.823 วิ)
            // ช่วงท้าย 137.28 วิ มีท่อนเดียวกับ 35.64 วิ (ห่างกัน 36 ห้อง) → กระโดดกลับไป 35.64 พร้อมผสมเสียงรอยต่อ 0.35 วิ
            try {
              let s = eE.sampleRate,
                o = Math.round(35.64 * s),
                r = Math.round(137.28 * s),
                a = Math.round(0.35 * s);
              if (r < eE.length && o > a) {
                for (let c = 0; c < eE.numberOfChannels; c++) {
                  let l = eE.getChannelData(c);
                  for (let h = 0; h < a; h++) {
                    let f = h / a;
                    l[r - a + h] = l[r - a + h] * Math.cos(f * Math.PI * 0.5) + l[o - a + h] * Math.sin(f * Math.PI * 0.5);
                  }
                }
                eE.ccsLoop = [o / s, r / s];
              }
            } catch (s) {
              console.warn("bgm loop", s);
            }
          } catch (t) {
            (console.warn("bgm", t), (jp = !1));
            return;
          }
          if (((jp = !1), !z.music)) return;
        }
        (o4 ??
          (o4 = (() => {
            let t = e.createGain();
            return ((t.gain.value = 0.42), t.connect(e.destination), t);
          })()),
          (la = e.createBufferSource()),
          (la.buffer = eE),
          (la.loop = !0),
          eE.ccsLoop && ((la.loopStart = eE.ccsLoop[0]), (la.loopEnd = eE.ccsLoop[1])),
          la.connect(o4),
          la.start());
      }
    }
  }
  var e1 = null,
    NE = 0;
  function Ln(i, e) {
    ((e1 = i), (NE = 3), (cd.innerHTML = emoHTML(emoMood(e))), cd.classList.add("on"));
    let t = [
        ...y0.map((o) => o.rig).filter((o) => !!o),
        ...zn.map((o) => o.keeper),
        ...wi.map((o) => o.rig),
        ...Nn.map((o) => o.rig),
      ],
      n = null,
      s = 2.2;
    for (let o of t) {
      let r = Math.hypot(o.root.position.x - i.x, o.root.position.z - i.z);
      r < s && ((s = r), (n = o));
    }
    n && Zg(n, Math.min(4, 0.9 + e.length * 0.06));
  }
  var f0 = [];
  function tP(i, e, t = 4) {
    let n = f0.find((s) => s.who === i) ?? f0.find((s) => s.t <= 0);
    if (!n)
      if (f0.length >= 4) n = f0.reduce((s, o) => (o.t < s.t ? o : s));
      else {
        let s = document.createElement("div");
        ((s.className = "fbub"), document.body.appendChild(s), (n = { el: s, who: null, t: 0 }), f0.push(n));
      }
    ((n.who = i),
      (n.t = t),
      (n.el.innerHTML = emoHTML(emoMood(e))),
      n.el.classList.add("on"),
      Zg(i.rig, Math.min(4, 0.9 + e.length * 0.06)));
  }
  function nP(i) {
    for (let e of f0) {
      if (e.t <= 0) continue;
      if (((e.t -= i), e.t <= 0 || !e.who)) {
        e.el.classList.remove("on");
        continue;
      }
      let t = e.who.pos.clone().setY(2.35).project(Lt),
        n = t.z < 1 && Math.abs(t.x) < 1.1 && Math.abs(t.y) < 1.1;
      ((e.el.style.left = `${(t.x * 0.5 + 0.5) * innerWidth}px`),
        (e.el.style.top = `${(-t.y * 0.5 + 0.5) * innerHeight}px`),
        e.el.classList.toggle("on", n && e.t > 0.3));
    }
  }
  function r4() {
    if (!e1) return;
    if (((NE -= 1 / 60), NE <= 0)) {
      (cd.classList.remove("on"), (e1 = null));
      return;
    }
    let i = e1.clone().setY(2.6).project(Lt);
    ((cd.style.left = `${(i.x * 0.5 + 0.5) * innerWidth}px`), (cd.style.top = `${(-i.y * 0.5 + 0.5) * innerHeight}px`));
  }
  var tE = 0;
  function a4(i) {
    if (((tE -= 1), tE > 0)) return;
    ((tE = 6),
      (fa.score.textContent = String(j.score)),
      (fa.bones.textContent = String(j.bones)),
      (fa.friends.textContent = `${z.hearts.filter((n) => n >= 4).length}`),
      (fa.money.textContent = String(z.money)),
      (fa.date.innerHTML = `${Us[z.season].icon}<span class="sn"> ${Us[z.season].name}</span> <span class="dw">วันที่ </span><span class="ds">ว.</span>${z.day}`));
    let e = B4.width,
      t = e / (E0 * 2.2);
    (Vt.clearRect(0, 0, e, e),
      Vt.save(),
      Vt.translate(e / 2, e / 2),
      Vt.rotate(j.yaw),
      (Vt.fillStyle = "#8FD064"),
      Vt.beginPath(),
      Vt.arc(0, 0, E0 * t, 0, Math.PI * 2),
      Vt.fill(),
      (Vt.fillStyle = "#F3E3C8"),
      Vt.fillRect(-55 * t, -vn * t, 110 * t, vn * 2 * t),
      Vt.fillRect(-49 * t, -12 * t, 6 * t, 60 * t),
      Vt.fillRect(27 * t, -42 * t, 6 * t, 40 * t),
      (Vt.fillStyle = "#5CC8F5"),
      Vt.beginPath(),
      Vt.arc(-46 * t, 40 * t, 7 * t, 0, Math.PI * 2),
      Vt.fill(),
      (Vt.fillStyle = "#B5338A"));
    for (let n of pt) Vt.fillRect((n.x - n.hw) * t, (n.z - n.hd) * t, n.hw * 2 * t, n.hd * 2 * t);
    for (let n of Le.slice(1))
      ((Vt.fillStyle = n.found ? "#F28C28" : "#fff"),
        Vt.beginPath(),
        Vt.arc(n.pos.x * t, n.pos.z * t, 3.2, 0, Math.PI * 2),
        Vt.fill(),
        (Vt.strokeStyle = "#241C15"),
        (Vt.lineWidth = 1.2),
        Vt.stroke(),
        n.found ||
          ((Vt.fillStyle = "#241C15"),
          (Vt.font = "bold 7px sans-serif"),
          Vt.fillText("?", n.pos.x * t - 2, n.pos.z * t + 2.5)));
    (Vt.translate(i.pos.x * t, i.pos.z * t),
      Vt.rotate(-j.yaw),
      (Vt.fillStyle = "#E2463F"),
      Vt.beginPath(),
      Vt.moveTo(0, -6),
      Vt.lineTo(4.5, 4),
      Vt.lineTo(-4.5, 4),
      Vt.closePath(),
      Vt.fill(),
      Vt.stroke(),
      Vt.restore());
  }
  (async () => {
    (G4(j.time),
      await D4,
      await Promise.all([
        Promise.race([
          Promise.all(
            ["700 64px Mitr", "600 64px Mitr", "500 64px Mitr"].map((n) => document.fonts.load(n, "ก ChowChow")),
          ).catch(() => null),
          new Promise((n) => setTimeout(n, 5e3)),
        ]),
        $g(Zt("animals")),
        Po(Zt("hen"))
          .then((n) => {
            LE = n.scene;
          })
          .catch(() => null),
        Dy(Zt("cute")),
        bn(Zt("food")),
        bn(Zt("food2")),
        bn(Zt("furniture")),
        bn(Zt("claw")),
        bn(Zt("fantasy")),
        bn(Zt("trees")),
        bn(Zt("fountain")),
        bn(Zt("market")),
        bn(Zt("roast")),
        bn(Zt("breads")),
        bn(Zt("breadrack")),
        bn(Zt("city")),
        bn(Zt("city2")),
        bn(Zt("beach")),
        bn(Zt("dogbed")),
        bn(Zt("beachkit")),
        bn(Zt("r25")),
        bn(Zt("r27")),
        bn(Zt("r28")),
        bn(Zt("r31")),
        bn(Zt("r34")),
        bn(Zt("grassvar")),
        bn(Zt("r56")),
        bn(Zt("r56b")),
        bn(Zt("r81")),
        bn(Zt("r82")),
        bn(Zt("r93")),
        bn(Zt("r102")),
        bn(Zt("r104")),
        bn(Zt("r105")),
        bn(Zt("r109")),
        bn(Zt("r111")),
        bn(Zt("r112")),
        $g(Zt("horse2")),
        QM(Zt("fish"), Zt("dolphin")),
      ]),
      nM(ze, je),
      (sE = e6(K, tl)),
      IA(),
      wA(),
      TA(),
      RA(),
      await VA());
    {
      let n = zn.find((s) => s.def.id === "petshop");
      n && $k(n.inside);
    }
    gT = new Pp(K, ET);
    let i = (n) =>
        inGarden(n, 1.2) ||
        (Math.abs(n.x - xt.x) < 2.4 && n.z < -Mt + 1 && n.z > xt.z + td / 2) ||
        eb(n, 1) ||
        Math.abs(n.z) < Mt + 0.6 ||
        (Math.abs(n.x + 46) < 3.5 && n.z > -12 && n.z < 48) ||
        (Math.abs(n.x - 30) < 3.5 && n.z < -2 && n.z > -42) ||
        Math.hypot(n.x - 48, n.z) < 12.5 ||
        Math.hypot(n.x + 46, n.z - 40) < 8 ||
        (n.x > -32 && n.x < -4 && n.z > 14 && n.z < 35.5) ||
        Math.hypot(n.x - fn.x, n.z - fn.z) < 4.2 ||
        Math.hypot(n.x - ni.x, n.z - ni.z) < 4.2 ||
        Math.hypot(n.x - kn.x, n.z - kn.z) < 9.2 ||
        Math.hypot(n.x - Hr.x, n.z - Hr.z) < 4.5 ||
        (Math.abs(n.z) < Mt + 0.4 && Math.abs(n.x) < 64) ||
        (n.z < -vn && n.z > -16 && n.x > -40 && n.x < 28) ||
        (Math.abs(n.x - Ut.x) < 7.5 && Math.abs(n.z - Ut.z) < 7) ||
        (Math.abs(n.x - Bo) < 1.6 && n.z > 0 && n.z < Ut.z + 6) ||
        (Math.abs(n.x - Ut.x) < 1.3 && n.z > 4.5 && n.z < Ut.z + 1) ||
        n.z > Ap(n.x) - 0.4 ||
        (Math.abs(n.x - Ti.x) < w0 + 0.8 && Math.abs(n.z - Ti.z) < v0 + 0.8) ||
        (Math.abs(n.x) < 2.5 && n.z > E0 - 18),
      e = Array.from({ length: 170 }, () => {
        let n = Math.random() * Math.PI * 2,
          s = Math.sqrt(Math.random()) * (E0 + 7);
        return new H(Math.cos(n) * s, 0, Math.sin(n) * s);
      }),
      t = (n) => () => {
        let s = e[Math.floor(Math.random() * e.length)],
          o = new H(s.x + (Math.random() - 0.5) * n, 0, s.z + (Math.random() - 0.5) * n);
        return Math.hypot(o.x, o.z) > E0 + 8 || i(o) ? null : o;
      };
    {
      let n = si === "low" ? 6e3 : si === "high" ? 34e3 : pa ? 9e3 : innerWidth < 700 ? 14e3 : 22e3;
      oE = ze("grassclump_0") ? iA(Math.round(n / 3), t(11)) : VM(K, n, t(11));
    }
    WM(K, 700, t(12));
    {
      let n = kn,
        s = new be({ color: 10479871, transparent: !0, opacity: 0.9, toneMapped: !1 });
      for (let r = 0; r < 10; r++) {
        let a = (r / 10) * Math.PI * 2,
          c = new R(new we(0.12, 10, 6), s);
        ((c.scale.y = 0.4),
          c.position.set(n.x + Math.cos(a) * 6.7, 0.12, n.z + Math.sin(a) * 6.7),
          (c.visible = !1),
          K.add(c),
          al.push(c));
        let l = pd(n.x + Math.cos(a) * 6.1, n.z + Math.sin(a) * 6.1, 1.4, 0.9);
        ((l.position.y = 0.11), l.material.color.set(10479871));
      }
      let o = new En(10477823, 0, 14, 1.3);
      (o.position.set(n.x, 1.2, n.z), K.add(o), H0.push({ l: o, on: 22 }));
    }
    ((wr = OM()),
      wr.position.copy(Ti),
      K.add(wr),
      pt.push({ x: Ti.x + 0.4, z: Ti.z, hw: 0.45, hd: 0.45, low: !0 }),
      Sk(),
      vk(),
      wd(),
      k1(),
      x1(),
      ze("beach_house") || pt.push({ x: Ut.x, z: Ut.z + 2.9, hw: 2.8, hd: 2.1 }),
      pt.push({ x: Oc.x, z: Oc.z, hw: 0.9, hd: 0.7 }),
      fk());
    for (let n of z.comps ?? []) BE(n, mo.clone().add(new H(0, 0, 2.6)));
    (Le[0].pos.copy(mo).add(new H(0, 0, 0.9)), (j.yaw = 0), (Le[0].dir = 0));
    for (let n of Le.slice(1)) z.found.includes(n.idx) && (n.found = !0);
    (AT(z.rainToday),
      Ei(),
      (window.__ccs = {
        resetCamera: ud,
        leaveShop: TT,
        camGuardState: () => ({ lost: Jh, fixes: l4 }),
        save: z,
        dogs: Le,
        pets: El,
        npcs: wi,
        claws: gl,
        pups: ml,
        state: j,
        shops: zn,
        camera: Lt,
        scene: K,
        park: () => Cr,
        wear: vd,
        cars: cl,
        balls: _d,
        home: () => Rn,
        enterHome: JE,
        album: () => ccsAlbum(),
        pk: () => ccsPK,
        pkStart: () => ccsPKStart(),
        pkInput: (k) => ccsPKInput(k),
        pkNpc: () => ccsPKNpc,
        pkTick: (d) => ccsPKTick(d, Le[0]),
        trainSt: () => Cr?.stations,
        trainStart: (k) => UH(Cr.stations.find((h) => h.id === k)),
        tr: () => ho,
        trTick: (d) => ho && ccsTRTick(Le[0], d),
        trMenu: () => ccsTRMenu(),
        bathStart: () => ccsBathStart(),
        leaveIn: () => Sd(null),
        bowlAt: () => ccsBowl && ccsBowl.p,
        v126: { dex: () => ccsDexOpen(), dexSnap: () => ccsDexOnSnap(), warp: (k) => ccsWarp(k), warpMenu: () => ccsWarpMenu(), treat: () => ccsTreatMenu(), make: (k) => ccsTreatMake(k), buff: (k) => ccsBuffOn(k), loot: (n) => ccsLootSpawn(n), wea: () => ccsWea, rain: (t) => (ccsWea.wasRain = !0, ccsWea.rbT = 0), say: (m) => ccsDogSay(m), comp: () => ccsCompToggle() },
        photos: () => ccsPhotos(),
        snap: (c) => ccsSnapSoon(c, 0),
        setOn: (k) => ccsSetOn(k),
        photoAlbum: () => ccsPhotoAlbum(),
        whales: () => ccsWh,
        po: (u) => Po(u),
        scn: () => K,
        T3: { mt, Ls, H },
        shops: () => zn,
        pens: () => wT,
        petMake: (k) => {
          let t = T1.find((n) => n.key === k),
            n = t && t.make();
          return (n && (ccsLifeOn(n), K.add(n.root)), n);
        },
        qi: (r, e, t, n) => Qi(r, e, t, n),
        wthrow: (k) => ccsWhaleThrow(k),
        wtick: (d) => (ccsWhaleTick(d), ccsBaitTick(d), ccsFxTick(d)),
        bigSplash: (x, z, e) => ccsBigSplash(new H(x, 0, z), e),
        wplay: () => ccsOrcaPlay(),
        bathTick: (d) => ccsBathTick(d),
        hatTick: (d) => ccsHatTick(d),
        signTick: () => (ccsTRFieldInit(), ccsTRSignTick()),
        bathSt: () => ccsBath && { t: ccsBath.t, at: ccsBath.at, dog: Le[0].pos.clone(), jy: j.jy },
        fresh: () => ccsFresh(),
        trOpen: () => ccsTROpen(),
        freeChick: () => ccsFreeGift && { p: ccsFreeGift.p, k: ccsFreeGift.k },
        hg: (k) => ccsHG(k),
        hatShop: () => OE(),
        ghostSys: () => en,
        wearIt: (k) => vd(k, !0),
        wear: (k) => ccsWear(k),
        setLv: (l) => (z.trLv = l),
        trBuy: (k) => ccsTRBuy(k),
        cmd: (k) => ccsDoCmd(k),
        cmdMenu: () => ccsCmdMenu(),
        trNpc: () => ccsTRNpc,
        trIn: (k, u) => ccsTRInput(k, u),
        rip: () => ccsRipGet(),
        ripDrop: (x, z, r, a) => ccsRipDrop(x, z, r, a),
        ripFeed: (dt, t) => ccsRipFeed(dt, t),
        swashAt: (x, z) => ccsSwashAt(x, z),
        wet: () => ccsWet,
        shake: () => ccsDoShake(Le[0]),
        lastErr: () => window.__ccsLastErr || localStorage.getItem("ccs-lastErr"),
        sea: () => ccsSeaV,
        trFx: (k, t) => ccsTRFx(k, t),
        trEnd: (s) => ccsTREnd(s, { icon: "🚧", name: "กระโดดข้ามรั้ว" }, "🟢🟢🔴<br>+30 XP", s === 3 ? 0 : 1),
        padPoll: () => tA(),
        clawPair: (d) => ccsClawPair(d),
        addComp: (k, p) => BE(k, p),
        floats: () => ccsFloats,
        pen: () => wT,
        petKeys: () => T1.filter((n) => !n.need || n.need()).map((n) => n.key),
        clawDaily: () => ccsClawDaily(),
        cabSync: () => H1(),
        wx: co,
        inside: () => Se,
        enterShop: MT,
        navPath: dl,
        comps: Pr,
        GANG: il,
        shipDeck: ba,
        gangH: Rd,
        renderer: dn,
        openWardrobe: _0,
        THREE: Ki,
        foodIcon: RT,
        crowd: Nn,
        SEATS: ua,
        setPose: Io,
        PR: _p,
        solids: () => pt,
        blocked: ri,
        soccer: () => fo,
        spawnComp: BE,
        PET_SALE: T1,
        stepDog: (n, s, o = 0) => {
          let r = Le[0];
          for (let a = 0; a < n; a++) ((r.spd = o), Qp(r, s));
        },
        stepComps: (n, s) => {
          for (let o = 0; o < n; o++) HT(s, Le[0]);
        },
        idleOff: (n) => {
          lT = n;
        },
        sea: () => sE,
        splash: tl,
        chickens: Td,
        groundEggs: ma,
        sitPose: _h,
        dynLights: H0,
        pool: () => g1,
        shoppers: () =>
          Nn.filter((n) => n.shop).map((n) => [
            n.name,
            n.shop.stage,
            n.pos.toArray().map((s) => +s.toFixed(1)),
            n.shop.spots.length,
          ]),
        occ: rn,
        makeCute: Zr,
        cutePart: r0,
        dogFit: Jg,
        cuteNames: Uy,
        updatePawSlots: e3,
        onRoad: po,
        waterDepth: go,
        fun: {
          placeGardenFlowers: hb,
          setCalm: m1,
          updateShoppers: mT,
          bq: () => gi.bq,
          breadAct: Z4,
          bqSpot: bd,
          bakeFront: ol,
          buy: P1,
          gift: bT,
          buildPlot: T0,
          openQuests: Rr,
          statOf: fs,
          track: Ai,
          rs: xn,
          spFree: Kc,
          ensureDaily: lb,
          giveGear: p1,
          openGiftBox: cT,
          speedMul: aT,
          updateGhosts: sT,
          updateCare: Q4,
          kase: () => St,
          sniff: cn,
          ghost: en,
          startCase: j4,
          offerFood: J4,
          care: ws,
          sniffToggle: xa,
          caseAct: $4,
          act: () => Ad,
          ensureDigs: q4,
        },
        gardenPlot: T0,
        openWares: (i, e) => v1(zn.find((t) => t.def.id === i), e),
        ball: () => fo,
        openDogs: () => gb(zn.find((i) => i.def.id === "petshop")),
        openToys: () => v1(zn.find((i) => i.def.id === "petshop"), !0),
        openWardrobe: () => OE(),
        shopIds: () => zn.map((t) => t.def.id),
        enterHome: () => JE(),
        setClar: (v) => ((ccsClar = ccsClarT = v), (ccsClarDay = typeof I0 == "function" ? I0() : 0)),
        clawStart: () => ((Oo = { k: gl[0], t: 30, dropped: !1, yaw0: j.yaw }), !0),
        clawState: () => (Oo ? [Oo.t, Oo.dropped, gl.length] : null),
        isle: () => ccsIsle,
        fwTick: (d, t) => ccsFWTick(d, t),
        fw: () => ccsFW,
        rideStart: () => ccsRideStart(),
        ride: () => ccsRide,
        sleepNow: () => qH(),
        P: () => ({ od, hn, xt, Rt, shops: zn.map((t) => [t.def.id, t.def.name, t.pos ?? t.door ?? null]) }),
        openFood: (i) => dd("food", i === "fish" ? Yk : i === "chick" ? Xk : DE, null, ""),
        emo: (i) => emoHTML(emoMood(i)),
        pop: (i) => rt(i, Le[0].pos.clone().setY(1.5), "big"),
        modelKeys: () => Object.keys(vp),
        thumb: (i) => (ccsThumb("dbg:" + i, () => je(i, 1)).match(/src="([^"]+)"/) || [])[1],
        modelClone: (n, e) => je(n, e),
        held: () => ccsHeld.map((i) => [i.bone.name, i.obj.position.toArray().map((e) => +e.toFixed(2))]),
        simStep: (n, s) => {
          for (let o = 0; o < n; o++) (w4(s, Le[0]), pT(s, Le[0]), T4(s, Le[0]));
        },
      }),
      K.traverse((n) => {
        let s = n;
        s.isMesh &&
          s.material !== XE &&
          !s.material.transparent &&
          !s.isInstancedMesh &&
          (s.geometry.type !== "CircleGeometry" && s.geometry.type !== "PlaneGeometry" && (s.castShadow = !0),
          (s.receiveShadow = !0));
      }),
      ZC(),
      ek(),
      document.body.classList.add("ready"));
    {
      let n = setInterval(() => {
        j.started && (clearInterval(n), setTimeout(XC, 6e3));
      }, 1e3);
    }
    requestAnimationFrame(U4);
    {
      let n = it("coats"),
        s = {
          orange: "#d9792e",
          cream: "#f3dcb2",
          white: "#fbf8f3",
          black: "#26201e",
          red: "#a8461f",
          blue: "#7d8696",
        },
        o = () => {
          n.innerHTML = Object.entries(o0)
            .map(
              ([r, a]) =>
                `<button data-k="${r}" class="${(z.coat ?? "orange") === r ? "on" : ""}"><i style="background:${s[r]}"></i>${a.name}</button>`,
            )
            .join("");
        };
      (o(),
        n.addEventListener("click", (r) => {
          let a = r.target.closest("button");
          if (!a) return;
          ((z.coat = a.dataset.k), _t(z), o(), Le[0]?.rig?.setCoat?.(z.coat));
        }));
    }
    it("start").addEventListener("click", () => {
      (GM(),
        (j.started = !0),
        it("menu").classList.add("hide"),
        document.body.classList.add("playing"),
        _i(),
        R1(z.music),
        (it("musicBtn").textContent = z.music ? "🎵" : "🔇"),
        De(
          z.day === 1 && z.season === 0 && z.year === 1
            ? "ยินดีต้อนรับสู่เมืองน้องเชา! ไปฝึกที่สนามข้างบ้าน กินข้าวกินน้ำให้อิ่ม แล้วตามหาเพื่อนเชาเชาอีก 5 ตัว 🐾"
            : `${Us[z.season].icon} ${Us[z.season].name} วันที่ ${z.day} \xB7 ปี ${z.year}`,
          4500,
        ));
    });
  })();
  it("wardBtn").addEventListener("click", () => _0());
  it("poopBtn").addEventListener("click", () => {
    let i = Le[0];
    if (!(!i || Se || (z.potty ?? 0) < 30)) {
      if (go(i.pos.x, i.pos.z) > 0.05) {
        De(
          "อย่าอึในน้ำนะ! ขึ้นฝั่งก่อน 😅",
          1800,
        );
        return;
      }
      M4(i);
    }
  });
  it("runBtn").addEventListener("pointerdown", (i) => {
    (i.preventDefault(), j.started && O4(!A1));
  });
  it("jumpBtn").addEventListener("pointerdown", (i) => {
    (i.preventDefault(), j.started && (Ed = !0));
  });
  it("musicBtn").addEventListener("click", () => {
    ((z.music = !z.music), R1(z.music), (it("musicBtn").textContent = z.music ? "🎵" : "🔇"), _t(z));
  });
  if ("serviceWorker" in navigator && location.protocol === "https:" && !location.hostname.endsWith("claude.ai"))
    try {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    } catch {}
  document.getElementById("camBtn")?.addEventListener("click", () => ud(!0));
  var nE = document.getElementById("qBtn");
  if (nE) {
    let i = () => {
      nE.textContent = w3[si];
    };
    i();
    let e = ["auto", "low", "mid", "high"],
      t = {
        auto: "ปรับความละเอียดเองตามความเร็วเครื่อง ให้ลื่นใกล้ 60fps",
        low: "ภาพต่ำ: ไม่มีเงา หญ้าน้อย ลื่นที่สุด (หญ้าเปลี่ยนหลังเปิดเกมใหม่)",
        mid: "ภาพกลาง: มีเงา ความละเอียดพอดี",
        high: "ภาพสูง: เงาคม แสงเรือง (ใช้เครื่องแรง)",
      };
    nE.addEventListener("click", () => {
      ((si = e[(e.indexOf(si) + 1) % e.length]), KM(si), h4(), i(), De(t[si], 2400));
    });
  }
})();
/*! Bundled license information:

react/cjs/react-jsx-runtime.production.js:
  (**
   * @license React
   * react-jsx-runtime.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2024 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
