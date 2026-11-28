  var Qn = (i, e = 0.85) => new X({ color: i, roughness: e, metalness: 0 }),
    ky = new X({ color: 1708560, roughness: 0.15, metalness: 0 }),
    e7 = new be({ color: 16777215 }),
    Yr = new X({ color: 2759704, roughness: 0.3 }),
    t7 = new be({ color: 16752560, transparent: !0, opacity: 0.55, depthWrite: !1 });
  function Nt(i, e, t, n, s = 1, o = 1, r = 1, a = 0, c = 0, l = 0) {
    let h = i.clone();
    return (
      h.applyMatrix4(new Oe().compose(new H(e, t, n), new At().setFromEuler(new Yn(a, c, l)), new H(s, o, r))),
      h
    );
  }
  var An = (i, e) => {
    let t = new R(i, e);
    return ((t.castShadow = !0), (t.receiveShadow = !0), t);
  };
  function n7(i, e, t, n, s) {
    let o = [];
    for (let r of [-1, 1]) {
      let a = An(new we(s, 14, 10), ky);
      (a.position.set(e * r, t, n), a.scale.set(1, 1.15, 0.6));
      let c = new R(new we(s * 0.35, 8, 6), e7);
      (c.position.set(s * 0.35, s * 0.45, s * 0.7), a.add(c), i.add(a), o.push(a));
    }
    return o;
  }
  // v129: หมุนมุมให้อยู่ในช่วง -π..π แบบไม่วนลูป (ค่าใหญ่มาก/อินฟินิตี้เคยทำให้เกมค้างได้)
  function ccsWrapA(i) {
    if (!Number.isFinite(i)) return 0;
    let e = Math.PI * 2;
    return ((((i + Math.PI) % e) + e) % e) - Math.PI;
  }
  function Qi(i, e, t, n) {
    ((i.t += e), i.face?.update(e), i.life && ccsLifeTick(i, e, t));
    let s = t > 0.3,
      o = i.t * (s ? 6 + t * 1.1 : 1);
    if (n !== null) {
      let h = n - i.yaw;
      h = ccsWrapA(h);
      i.yaw += h * (1 - Math.exp(-e * 9));
    }
    i.root.rotation.y = i.yaw;
    let r = s ? Math.min(1, t / 4) : 0,
      a = i.person,
      c = i.sit;
    if ((c?.on && ((i.yaw = c.yaw), (i.root.rotation.y = c.yaw)), a)) {
      let h = i.mv ?? (i.mv = { on: !1, t: 0 }),
        f = t > (h.on ? 0.15 : 0.35);
      (f !== h.on ? ((h.t += e), h.t > (f ? 0.08 : 0.25) && ((h.on = f), (h.t = 0))) : (h.t = 0),
        a.set(h.on && !c?.on ? "walk" : a.mood, Math.max(t, h.on ? 0.6 : 0)),
        a.mixer.update(e),
        c && A7(i, c, e));
      return;
    }
    if (i.quad) {
      let h = i.gait ?? (i.gait = { ph: 0, amp: 0, gal: 0 }),
        f = t > 0.25 ? Math.min(1, 0.3 + t / 5) : 0,
        d = t > 0.25 ? Math.min(1, Math.max(0, (t - 8.6) / 1.8)) : h.gal;
      ((h.amp += (f - h.amp) * Math.min(1, e * (f > h.amp ? 7 : 5))), (h.gal += (d - h.gal) * Math.min(1, e * 3.5)));
      let u = h.gal,
        p = h.amp,
        m = u * u * (3 - 2 * u),
        E = (5.2 + Math.min(t, 12) * 0.85) * (1 - m) + (8.5 + Math.min(t, 14) * 0.55) * m;
      h.ph += e * E * (p > 0.01 ? 1 : 0);
      let g = h.ph;
      (i.legs.forEach((x, b) => {
        x.rotation.x = Math.sin(g + (b === 0 || b === 3 ? 0 : Math.PI)) * 0.7 * p;
      }),
        (i.body.position.y = Math.abs(Math.sin(g)) * (0.028 * (1 - m) + 0.085 * m) * p + Math.sin(i.t * 2) * 0.008),
        (i.body.rotation.z = Math.sin(g) * 0.035 * (1 - m) * p),
        (i.body.rotation.x = (Math.sin(g + 0.9) * 0.075 * m - 0.03 * m) * p),
        (i.head.rotation.x = Math.sin(g * 2) * 0.05 * p + Math.sin(i.t * 0.7) * 0.04),
        (i.head.rotation.y = s ? 0 : Math.sin(i.t * 0.5) * 0.35),
        i.tail && (i.tail.rotation.z = Math.sin(i.t * (s ? 10 : 3)) * 0.25));
      let y = i.uni;
      if (y) {
        ((y.uPhase.value = g),
          (y.uAmp.value = 0.52 * p * (1 + 0.5 * m)),
          y.uGal && (y.uGal.value = m),
          (y.uWag.value = i.t * (s ? 13 : 5)),
          i.body.scale.set(1, 1 + Math.sin(i.t * 2.4) * 0.012, 1));
        let x = y.uJaw,
          b = Math.sin(i.t * 0.45 + i.yaw) > 0.55 ? 0.65 + Math.abs(Math.sin(i.t * 5)) * 0.3 : 0,
          w = s ? 0.4 + m * 0.3 + Math.abs(Math.sin(i.t * (9 + 4 * m))) * 0.45 : b;
        x.value += (w - x.value) * Math.min(1, e * 8);
        let v = i.tongue;
        if (v) {
          let _ = Math.max(0, x.value - 0.12);
          ((v.visible = _ > 0.02), v.scale.set(1, 0.4 + _ * 0.9, 0.5 + _ * 0.7), (v.rotation.x = 0.35 + _ * 0.5));
        }
      }
      (i.tongue && (i.tongue.scale.y = s ? 0.75 + Math.sin(i.t * 14) * 0.2 : 0.5), L7(i, e, s));
    } else
      (i.legs.forEach((h, f) => {
        h.rotation.x = Math.sin(o + f * Math.PI) * 0.65 * r;
      }),
        i.arms.forEach((h, f) => {
          ((h.rotation.x = Math.sin(o + (f + 1) * Math.PI) * 0.55 * r),
            (h.rotation.z = (f ? -1 : 1) * (0.12 + Math.sin(i.t * 1.6) * 0.03)));
        }),
        (i.body.position.y = Math.abs(Math.sin(o)) * 0.05 * r),
        (i.body.rotation.y = Math.sin(o) * 0.08 * r),
        (i.body.scale.y = 1 + Math.sin(i.t * 2.2) * 0.012),
        (i.head.rotation.z = Math.sin(i.t * 0.9) * 0.05),
        (i.head.rotation.y = s ? 0 : Math.sin(i.t * 0.4) * 0.3),
        i.tail && (i.tail.rotation.y = Math.sin(i.t * 3) * 0.3));
    i.blink -= e;
    let l = i.blink < 0.12 ? 0.1 : 1;
    for (let h of i.eyes) h.scale.y = 1.15 * l;
    i.blink < 0 && (i.blink = 2 + Math.random() * 4);
  }
  var Di = (i, e, t) => {
      let n = (i[0] - e[0]) / t[0],
        s = (i[1] - e[1]) / t[1],
        o = (i[2] - e[2]) / t[2];
      return (Math.sqrt(n * n + s * s + o * o) - 1) * Math.min(t[0], t[1], t[2]);
    },
    Bs = (i, e, t) => {
      let n = Math.max(t - Math.abs(i - e), 0) / t;
      return Math.min(i, e) - n * n * t * 0.25;
    };
  function Gg(i, e, t) {
    let n = new rp(i, new be(), !1, !0, 16e4),
      s = n.size,
      o = s / 2;
    for (let c = 0; c < s; c++)
      for (let l = 0; l < s; l++)
        for (let h = 0; h < s; h++) {
          let f = [(h - o) / o, (l - o) / o, (c - o) / o],
            d = c * s * s + l * s + h,
            u = e(f);
          n.field[d] = 80 - u * 500;
          let [p, m] = t(f);
          ((n.palette[d * 3] = p), (n.palette[d * 3 + 1] = m), (n.palette[d * 3 + 2] = 0));
        }
    n.update();
    let r = n.count,
      a = new qe();
    return (
      a.setAttribute("position", new Je(n.positionArray.slice(0, r * 3), 3)),
      a.setAttribute("normal", new Je(n.normalArray.slice(0, r * 3), 3)),
      a.setAttribute("tone", new Je(n.colorArray.slice(0, r * 3), 3)),
      n.geometry.dispose(),
      a
    );
  }
  var i7 = 0.13,
    qg = [0, 0.36, 0.42],
    hp = [0.6, 0.56, 0.44];
  function s7(i) {
    let e = Di(i, [0, 0.06, -0.44], [0.42, 0.4, 0.34]);
    ((e = Bs(e, Di(i, [0, 0.08, -0.12], [0.43, 0.4, 0.44]), i7)),
      (e = Bs(e, Di(i, qg, hp), 0.18)),
      (e = Bs(e, Di(i, [0, 0.38, 0.7], [0.32, 0.31, 0.26]), 0.1)));
    for (let t of [-1, 1])
      ((e = Bs(e, Di(i, [t * 0.13, 0.5, 0.86], [0.14, 0.075, 0.08]), 0.04)),
        (e = Bs(e, Di(i, [t * 0.13, 0.28, 0.9], [0.14, 0.12, 0.11]), 0.05)),
        (e = Bs(e, Di(i, [t * 0.27, 0.84, 0.4], [0.11, 0.12, 0.065]), 0.05)),
        (e = Bs(e, Di(i, [t * 0.23, -0.14, 0.3], [0.16, 0.22, 0.16]), 0.1)),
        (e = Bs(e, Di(i, [t * 0.23, -0.1, -0.5], [0.18, 0.23, 0.19]), 0.1)));
    ((e = Bs(e, Di(i, [0, 0.36, 0.95], [0.11, 0.09, 0.09]), 0.05)),
      (e = Bs(e, Di(i, [0, 0.19, 0.86], [0.12, 0.07, 0.08]), 0.05)));
    for (let t of [-1, 1]) e = Math.max(e, -Di(i, [t * 0.13, 0.42, 0.97], [0.12, 0.022, 0.06]));
    return e;
  }
  function o7(i) {
    let e = Math.max(0, 1 - Math.hypot(i[0] / 0.34, (i[1] - 0.4) / 0.32, (i[2] - 0.8) / 0.24)),
      t = i[0] / hp[0],
      n = (i[1] - qg[1]) / hp[1],
      s = (i[2] - qg[2]) / hp[2],
      o = Math.max(0, 1 - Math.abs(Math.sqrt(t * t + n * n + s * s) - 1) * 4) * (i[2] > -0.1 ? 1 : 0),
      r = Math.min(1, Math.max(0, (i[1] - 0.45) * 2.5)),
      a = Math.max(0, 1 - Math.hypot(i[0] / 0.24, (i[1] - 0.28) / 0.13, (i[2] - 0.92) / 0.12)),
      c = Math.max(0, 1 - Math.hypot((Math.abs(i[0]) - 0.13) / 0.13, (i[1] - 0.52) / 0.05, (i[2] - 0.9) / 0.08)) * 0.5,
      l = Math.min(1, Math.max(0, (-0.08 - i[1]) * 3)),
      h = Math.min(1, Math.max(o * (1 - r * 0.85) * (1 - e * 1.4), a * 1.2, c, l * 0.7)),
      f = Math.min(1, Math.max(0, (i[1] - 0.25) * 1.6)) * (1 - a) * (1 - h);
    return [h, f];
  }
  function r7(i) {
    let e = Di(i, [0, 0, 0], [0.62, 0.3, 0.7]);
    return ((e = Bs(e, Di(i, [0, -0.15, 0.55], [0.4, 0.26, 0.3]), 0.2)), e);
  }
  var cp = null;
  function a7() {
    if (cp) return cp;
    let i = Gg(84, s7, o7),
      e = Gg(40, r7, (n) => [0.85 - Math.max(0, n[1]) * 0.6, 0.1]),
      t = Gg(
        30,
        (n) => Bs(Di(n, [0, 0.15, 0], [0.42, 0.75, 0.42]), Di(n, [0, -0.62, 0.12], [0.48, 0.3, 0.58]), 0.25),
        (n) => [Math.min(1, Math.max(0, (0.1 - n[1]) * 1.2)), 0],
      );
    return ((cp = { body: i, tail: e, leg: t }), cp);
  }
  function Ug(i, e, t) {
    let n = i.clone(),
      s = n.getAttribute("tone"),
      o = new ae(e),
      r = new ae(t),
      a = new Float32Array(s.count * 3),
      c = new ae();
    for (let l = 0; l < s.count; l++)
      (c
        .copy(o)
        .lerp(r, Math.min(1, s.getX(l)))
        .multiplyScalar(1 - 0.16 * s.getY(l)),
        (a[l * 3] = c.r),
        (a[l * 3 + 1] = c.g),
        (a[l * 3 + 2] = c.b));
    return (n.setAttribute("color", new Je(a, 3)), n);
  }
  var c7 = () => {
    let i = new Kn({ vertexColors: !0, roughness: 0.92, sheen: 1, sheenColor: new ae(16773340), sheenRoughness: 0.55 });
    return (
      (i.onBeforeCompile = (e) => {
        ((e.vertexShader = e.vertexShader
          .replace(
            "#include <common>",
            `#include <common>
varying vec3 vObj;`,
          )
          .replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
vObj = position;`,
          )),
          (e.fragmentShader = e.fragmentShader
            .replace(
              "#include <common>",
              `#include <common>
      varying vec3 vObj;
      float furH(vec3 p){ return sin(p.y*34.0 + sin(p.x*7.0 + p.z*6.0)*2.4 + sin(p.z*19.0)*0.9); }`,
            )
            .replace(
              "#include <normal_fragment_maps>",
              `#include <normal_fragment_maps>
      { float h = furH(vObj);
        vec3 dpx = dFdx(-vViewPosition), dpy = dFdy(-vViewPosition);
        float dhx = dFdx(h), dhy = dFdy(h);
        vec3 r1 = cross(dpy, normal), r2 = cross(normal, dpx);
        float det = dot(dpx, r1);
        vec3 grad = sign(det) * (dhx * r1 + dhy * r2);
        normal = normalize(abs(det) * normal - grad * 0.0016);
        diffuseColor.rgb *= 0.95 + 0.05 * h; }`,
            )));
      }),
      i
    );
  };
  function Py(i = 14256709, e = 15976847, t = 1) {
    let n = a7(),
      s = new J(),
      o = new J(),
      r = new J();
    s.add(o);
    let a = 0.85,
      c = new J();
    (c.scale.setScalar(a), (c.position.y = 0.62 * a), o.add(c));
    let l = c7();
    c.add(An(Ug(n.body, i, e), l));
    let h = [];
    for (let y of [-1, 1]) {
      let x = An(new we(0.03, 12, 8), ky);
      (x.position.set(y * 0.12, 0.45, 0.905), x.scale.set(1.4, 0.55, 0.6), c.add(x), h.push(x));
    }
    let f = An(new we(0.075, 18, 14), Yr);
    (f.position.set(0, 0.385, 1), f.scale.set(1.1, 0.78, 0.7), c.add(f));
    for (let y of [-1, 1]) {
      let x = new R(new we(0.016, 8, 6), new be({ color: 0 }));
      (x.position.set(y * 0.03, 0.37, 1.05), c.add(x));
    }
    let d = An(new we(0.1, 16, 10), Qn(5910560, 0.6));
    (d.position.set(0, 0.235, 0.915), d.scale.set(0.9, 0.22, 0.4), c.add(d));
    let u = An(new we(0.04, 12, 8), Qn(8018600, 0.35));
    (u.position.set(0.01, 0.215, 0.94), u.scale.set(1, 0.6, 1), c.add(u), r.position.set(0, 0.45 * a, 0.6 * a));
    let p = new J();
    p.position.set(0, (0.62 + 0.46) * a, -0.42 * a);
    let m = An(Ug(n.tail, i, e), l);
    (m.scale.set(a * 0.32, a * 0.32, a * 0.36), p.add(m), o.add(p));
    let E = [],
      g = Ug(n.leg, i, e);
    for (let [y, x] of [
      [-0.23, 0.32],
      [0.23, 0.32],
      [-0.23, -0.5],
      [0.23, -0.5],
    ]) {
      let b = new J();
      b.position.set(y * a, 0.5 * a, x * a);
      let w = An(g, l);
      (w.scale.set(0.2 * a, 0.33 * a, 0.2 * a), (w.position.y = -0.167), b.add(w), o.add(b), E.push(b));
    }
    return (
      s.scale.setScalar(t),
      {
        root: s,
        body: o,
        head: r,
        legs: E,
        arms: [],
        eyes: h,
        tail: p,
        tongue: u,
        quad: !0,
        t: Math.random() * 10,
        blink: 2,
        yaw: 0,
        height: 1.3 * t,
      }
    );
  }
  var l7 = 0;
  function Ic(i) {
    if (ko) return Zr(Hh(By++ * 7 + 3, !!i.plain));
    if (fp.length) return m7(l7++);
    if (dp) return p7(i);
    let e = new J(),
      t = new J(),
      n = new J();
    e.add(t);
    let s = Qn(i.fur, 0.9),
      o = Qn(i.belly, 0.9),
      r = Qn(i.shirt, 0.75),
      a = Qn(i.pants, 0.8),
      c = Qn(3811872, 0.5),
      l = new Ps(1, 3),
      h = An(new Ri(0.27, 0.36, 6, 16), r);
    if (((h.position.y = 0.98), h.scale.set(1, 1, 0.82), t.add(h), i.skirt)) {
      let M = An(new re(0.22, 0.4, 0.34, 18), a);
      ((M.position.y = 0.66), t.add(M));
    } else {
      let M = An(Nt(l, 0, 0.7, 0, 0.27, 0.16, 0.22), a);
      t.add(M);
    }
    let f = An(new vt(0.16, 0.035, 8, 18), Qn(16777215, 0.6));
    ((f.position.y = 1.3), (f.rotation.x = Math.PI / 2), t.add(f));
    let d = [];
    for (let M of [-1, 1]) {
      let T = new J();
      (T.position.set(M * 0.12, 0.68, 0),
        T.add(An(Nt(new Ri(0.085, 0.36, 4, 10), 0, -0.3, 0), i.skirt ? s : a)),
        T.add(An(Nt(l, 0, -0.6, 0.06, 0.1, 0.07, 0.15), c)),
        t.add(T),
        d.push(T));
    }
    let u = [];
    for (let M of [-1, 1]) {
      let T = new J();
      (T.position.set(M * 0.3, 1.18, 0),
        T.add(An(Nt(new Ri(0.07, 0.3, 4, 10), 0, -0.2, 0), r)),
        T.add(An(Nt(l, 0, -0.42, 0, 0.075, 0.075, 0.075), s)),
        t.add(T),
        u.push(T));
    }
    (n.position.set(0, 1.55, 0.02), t.add(n));
    let p = i.sp,
      m = {
        cat: [0.28, 0.25, 0.25],
        bear: [0.3, 0.28, 0.28],
        rabbit: [0.25, 0.27, 0.25],
        penguin: [0.27, 0.3, 0.27],
        elephant: [0.33, 0.3, 0.3],
        tiger: [0.3, 0.27, 0.28],
        monkey: [0.27, 0.27, 0.26],
        panda: [0.31, 0.28, 0.29],
        pig: [0.3, 0.27, 0.29],
        dog: [0.27, 0.26, 0.3],
        fox: [0.26, 0.24, 0.28],
      },
      [E, g, y] = m[p];
    n.add(An(Nt(l, 0, 0, 0, E, g, y), s));
    let x = 0.1,
      b = 0.04,
      w = 0.11,
      v = (M, T) => {
        let A = An(M, T);
        return (n.add(A), A);
      };
    switch (p) {
      case "cat":
        for (let M of [-1, 1])
          (v(Nt(new yt(0.09, 0.17, 4), M * 0.15, 0.24, 0, 1, 1, 0.6, 0, Math.PI / 4, -M * 0.25), s),
            v(Nt(new yt(0.05, 0.1, 4), M * 0.15, 0.24, 0.025, 1, 1, 0.4, 0, Math.PI / 4, -M * 0.25), Qn(16757702)));
        (v(Nt(l, 0, -0.08, 0.2, 0.12, 0.08, 0.08), o), v(Nt(l, 0, -0.04, 0.27, 0.03, 0.025, 0.02), Qn(16740241, 0.4)));
        for (let M of [-1, 1])
          for (let T of [0, 1])
            v(
              Nt(
                new re(0.004, 0.004, 0.18, 3),
                M * 0.17,
                -0.07 + T * 0.03,
                0.22,
                1,
                1,
                1,
                0,
                0,
                Math.PI / 2 + M * 0.1 * (T ? 1 : -1),
              ),
              Yr,
            );
        break;
      case "bear":
      case "panda":
        for (let M of [-1, 1]) v(Nt(l, M * 0.21, 0.22, -0.02, 0.09, 0.09, 0.05), p === "panda" ? Yr : s);
        if (
          (v(Nt(l, 0, -0.08, 0.2, 0.14, 0.1, 0.12), o), v(Nt(l, 0, -0.03, 0.31, 0.045, 0.035, 0.03), Yr), p === "panda")
        )
          for (let M of [-1, 1]) v(Nt(l, M * 0.11, 0.03, 0.22, 0.07, 0.085, 0.04, 0, 0, M * 0.4), Yr);
        ((x = 0.14), (w = 0.11));
        break;
      case "rabbit":
        for (let M of [-1, 1]) {
          let T = v(Nt(new Ri(0.055, 0.32, 4, 10), M * 0.09, 0.42, -0.02, 1, 1, 0.5, 0, 0, -M * 0.12), s);
          v(Nt(new Ri(0.03, 0.25, 4, 8), M * 0.09, 0.42, 0.005, 1, 1, 0.3, 0, 0, -M * 0.12), Qn(16757702));
        }
        (v(Nt(l, 0, -0.1, 0.18, 0.1, 0.07, 0.08), o), v(Nt(l, 0, -0.05, 0.25, 0.03, 0.02, 0.02), Qn(16740241, 0.4)));
        break;
      case "penguin":
        (v(Nt(l, 0, -0.04, 0.12, 0.2, 0.2, 0.17), o),
          v(Nt(new yt(0.05, 0.16, 8), 0, -0.04, 0.32, 1, 1, 1, Math.PI / 2, 0, 0), Qn(16756768, 0.5)));
        break;
      case "elephant": {
        for (let T of [-1, 1]) v(Nt(l, T * 0.3, 0, -0.05, 0.05, 0.22, 0.2, 0, -T * 0.4, 0), s);
        let M = new Xi([new H(0, -0.02, 0.25), new H(0, -0.15, 0.36), new H(0, -0.3, 0.38), new H(0, -0.36, 0.45)]);
        (v(new Yi(M, 12, 0.055, 10), s), (x = 0.16));
        break;
      }
      case "tiger":
        for (let M of [-1, 1]) v(Nt(l, M * 0.2, 0.22, -0.02, 0.08, 0.08, 0.05), s);
        (v(Nt(l, 0, -0.08, 0.2, 0.15, 0.09, 0.1), o), v(Nt(l, 0, -0.02, 0.3, 0.04, 0.03, 0.02), Qn(16740241, 0.4)));
        for (let [M, T, A] of [
          [0, 0.2, 0],
          [-0.06, 0.19, 0.4],
          [0.06, 0.19, -0.4],
          [-0.25, 0.05, 1.3],
          [0.25, 0.05, -1.3],
        ])
          v(Nt(new ee(0.025, 0.09, 0.02), M, T, 0.24 - Math.abs(M) * 0.3, 1, 1, 1, -0.3, 0, A), Yr);
        break;
      case "monkey":
        for (let M of [-1, 1])
          (v(Nt(l, M * 0.29, 0.01, 0, 0.09, 0.09, 0.04), s), v(Nt(l, M * 0.29, 0.01, 0.02, 0.055, 0.055, 0.03), o));
        (v(Nt(l, 0, -0.03, 0.15, 0.2, 0.19, 0.14), o), v(Nt(l, 0, -0.12, 0.25, 0.12, 0.07, 0.07), o));
        break;
      case "pig":
        for (let M of [-1, 1])
          v(Nt(new yt(0.08, 0.13, 4), M * 0.18, 0.24, 0.02, 1, 1, 0.5, 0.4, Math.PI / 4, -M * 0.5), s);
        v(Nt(new re(0.085, 0.09, 0.08, 18), 0, -0.06, 0.28, 1, 1, 1, Math.PI / 2, 0, 0), Qn(16752564, 0.5));
        for (let M of [-1, 1]) v(Nt(l, M * 0.03, -0.06, 0.325, 0.015, 0.025, 0.01), Yr);
        break;
      case "dog":
      case "fox":
        for (let M of [-1, 1])
          v(
            p === "fox"
              ? Nt(new yt(0.08, 0.2, 6), M * 0.14, 0.26, 0, 1, 1, 0.5, 0, 0, -M * 0.2)
              : Nt(l, M * 0.25, -0.02, -0.02, 0.07, 0.17, 0.09, 0, 0, M * 0.3),
            p === "fox" ? s : Qn(9067051),
          );
        (v(Nt(l, 0, -0.07, 0.22, 0.11, 0.09, 0.14), o), v(Nt(l, 0, -0.03, 0.35, 0.04, 0.03, 0.03), Yr), (x = 0.16));
        break;
    }
    let _ = n7(n, w, b, y * 0.86, 0.035);
    for (let M of [-1, 1]) {
      let T = new R(new gt(0.04, 10), t7);
      (T.position.set(M * 0.17, -0.06, y * 0.85), (T.rotation.y = M * 0.55), n.add(T));
    }
    if (i.hat !== void 0) {
      let M = An(new re(0.34, 0.34, 0.03, 24), Qn(i.hat, 0.7));
      ((M.position.y = g * 0.82), n.add(M));
      let T = An(new re(0.19, 0.22, 0.17, 20), Qn(i.hat, 0.7));
      ((T.position.y = g * 0.82 + 0.09), n.add(T));
      let A = An(new re(0.225, 0.225, 0.04, 20), Qn(14829119));
      ((A.position.y = g * 0.82 + 0.03), n.add(A));
    }
    let S;
    if (p === "cat" || p === "tiger" || p === "monkey" || p === "fox" || p === "dog") {
      ((S = new J()), S.position.set(0, 0.75, -0.2));
      let M = new Xi([new H(0, 0, 0), new H(0, 0.1, -0.2), new H(0, 0.35, -0.3), new H(0, 0.5, -0.22)]);
      (S.add(An(new Yi(M, 10, p === "fox" ? 0.08 : 0.04, 8), s)),
        p === "fox" && S.add(An(Nt(l, 0, 0.5, -0.22, 0.09, 0.09, 0.09), Qn(16777215))),
        t.add(S));
    } else
      (p === "rabbit" || p === "bear" || p === "panda" || p === "pig") &&
        t.add(An(Nt(l, 0, 0.72, -0.24, 0.07, 0.07, 0.07), p === "rabbit" ? Qn(16777215) : s));
    return (
      e.scale.setScalar(i.scale ?? 1),
      {
        root: e,
        body: t,
        head: n,
        legs: d,
        arms: u,
        eyes: _,
        tail: S,
        quad: !1,
        t: Math.random() * 10,
        blink: Math.random() * 3,
        yaw: 0,
        height: 2 * (i.scale ?? 1),
      }
    );
  }
  var Sh = [
      { sp: "cat", fur: 16769732, belly: 16774892, shirt: 16748472, pants: 6080757, skirt: !0 },
      { sp: "bear", fur: 11037240, belly: 15913641, shirt: 1943770, pants: 4147802, hat: 15254634 },
      { sp: "rabbit", fur: 16777215, belly: 16773364, shirt: 16765503, pants: 3050327, scale: 0.85 },
      { sp: "penguin", fur: 2832999, belly: 16777215, shirt: 16777215, pants: 2832999, scale: 0.9 },
      { sp: "elephant", fur: 11121864, belly: 13160670, shirt: 10255336, pants: 11875210, skirt: !0 },
      { sp: "tiger", fur: 15895592, belly: 16773590, shirt: 7127626, pants: 2366485 },
      { sp: "monkey", fur: 9065776, belly: 15910560, shirt: 15895592, pants: 4868682 },
      { sp: "panda", fur: 16777215, belly: 16777215, shirt: 6080757, pants: 13208139 },
    ],
    Iy = [
      "Body_10",
      "Ears_10",
      "Female_Emotion_Happy_02",
      "Hairstyle_Female_04",
      "Outwear_45",
      "Pants_05",
      "Shoe_Slippers_02",
    ],
    Fy = [
      "Body_11",
      "Ears_11",
      "Male_Emotion_Happy_01",
      "Hairstyle_Male_13",
      "Outwear_19",
      "Pants_03",
      "Shoe_Sneakers_09",
      "Mustache_03",
    ],
    zy = [
      { sp: "bear", fur: 9067051, belly: 15913641, shirt: 3050327, pants: 4147802 },
      { sp: "fox", fur: 15237178, belly: 16777215, shirt: 10255336, pants: 4147802 },
      { sp: "dog", fur: 15983560, belly: 16777215, shirt: 11875210, pants: 4147802 },
      { sp: "rabbit", fur: 16183551, belly: 16777215, shirt: 16777215, pants: 6080757 },
      { sp: "pig", fur: 16762837, belly: 16770026, shirt: 16748472, pants: 4147802 },
    ],
    Ly = [
      [14256709, 15976847],
      [15783592, 16773592],
      [16446438, 16777215],
      [13134127, 15381114],
      [14711338, 16171146],
      [3813420, 6969936],
    ],
    jg = {};
  async function mp(i, e = 1.15, t = "chow") {
    try {
      let n;
      if (i.startsWith("data:")) {
        let M = i.slice(i.indexOf(",") + 1),
          T = atob(M),
          A = new Uint8Array(T.length);
        for (let F = 0; F < T.length; F++) A[F] = T.charCodeAt(F);
        n = await new s0().setMeshoptDecoder(Ng).parseAsync(A.buffer, "");
      } else n = await new s0().setMeshoptDecoder(Ng).loadAsync(i);
      let s = null;
      if (
        (n.scene.updateMatrixWorld(!0),
        n.scene.traverse((M) => {
          M.isMesh && !s && (s = M);
        }),
        !s)
      )
        return !1;
      let o = s,
        r = o.geometry.clone();
      for (let M of Object.keys(r.attributes)) {
        let T = r.getAttribute(M);
        if (T.array instanceof Float32Array && !T.normalized) continue;
        let A = T.count,
          F = T.itemSize,
          C = new Float32Array(A * F);
        for (let P = 0; P < A; P++)
          ((C[P * F] = T.getX(P)),
            F > 1 && (C[P * F + 1] = T.getY(P)),
            F > 2 && (C[P * F + 2] = T.getZ(P)),
            F > 3 && (C[P * F + 3] = T.getW(P)));
        r.setAttribute(M, new Je(C, F));
      }
      if ((r.applyMatrix4(o.matrixWorld), o.matrixWorld.determinant() < 0 && r.index)) {
        let M = r.index.array;
        for (let T = 0; T < M.length; T += 3) {
          let A = M[T + 1];
          ((M[T + 1] = M[T + 2]), (M[T + 2] = A));
        }
      }
      r.computeBoundingBox();
      let a = r.boundingBox,
        c = e / (a.max.y - a.min.y);
      (r.translate(-(a.min.x + a.max.x) / 2, -a.min.y, -(a.min.z + a.max.z) / 2), r.scale(c, c, c));
      let l = r.getAttribute("position"),
        h = 0,
        f = 0;
      for (let M = 0; M < l.count; M++) l.getY(M) > e * 0.75 && ((h += l.getZ(M)), f++);
      (f && h / f < 0 && r.rotateY(Math.PI), r.computeBoundingBox(), (a = r.boundingBox));
      let d = 0,
        u = 0,
        p = 0,
        m = 0,
        E = 0,
        g = 0;
      for (let M = 0; M < l.count; M++) l.getY(M) < e * 0.12 && ((E += l.getZ(M)), g++);
      let y = g ? E / g : 0;
      for (let M = 0; M < l.count; M++)
        if (l.getY(M) < e * 0.12) {
          let T = l.getZ(M);
          T > y ? ((d += T), u++) : ((p += T), m++);
        }
      let x = 0,
        b = 0;
      for (let M = 0; M < l.count; M++)
        l.getZ(M) > (a.min.z + a.max.z) / 2 + 0.05 &&
          Math.abs(l.getX(M)) < 0.12 &&
          l.getY(M) > x &&
          ((x = l.getY(M)), (b = l.getZ(M)));
      let w = -9,
        v = 0;
      for (let M = 0; M < l.count; M++)
        l.getY(M) > e * 0.4 && Math.abs(l.getX(M)) < 0.05 && l.getZ(M) > w && ((w = l.getZ(M)), (v = l.getY(M)));
      // v92: หาตำแหน่งจมูกจริงจากสีเท็กซ์เจอร์ (จุดดำสุดที่อยู่หน้าสุดของหัว) — หน้าเชาเชาแบน แก้มยื่นพอ ๆ กับจมูก
      let N3 = [0, 0, -9];
      try {
        let M0 = o.material.map?.image,
          uvA = r.getAttribute("uv");
        if (M0 && uvA) {
          let cv = document.createElement("canvas"),
            W0 = (cv.width = Math.min(512, M0.width)),
            H0b = (cv.height = Math.min(512, M0.height)),
            cx = cv.getContext("2d", { willReadFrequently: !0 });
          cx.drawImage(M0, 0, 0, W0, H0b);
          let px = cx.getImageData(0, 0, W0, H0b).data,
            zmax = -9;
          for (let M = 0; M < l.count; M++) l.getY(M) > e * 0.45 && l.getZ(M) > zmax && (zmax = l.getZ(M));
          let sx = 0, sy = 0, sz = 0, sw = 0, fy = o.material.map.flipY;
          for (let M = 0; M < l.count; M++) {
            if (l.getY(M) < e * 0.45 || l.getZ(M) < zmax - 0.12) continue;
            let U = uvA.getX(M) % 1, V = uvA.getY(M) % 1;
            (U < 0 && (U += 1), V < 0 && (V += 1));
            let ix = Math.min(W0 - 1, (U * W0) | 0), iy = Math.min(H0b - 1, ((fy ? 1 - V : V) * H0b) | 0), k = (iy * W0 + ix) * 4,
              lum = (px[k] * 0.3 + px[k + 1] * 0.59 + px[k + 2] * 0.11) / 255;
            if (lum < 0.13) {
              let w0 = (0.13 - lum) * (1 + (l.getZ(M) - zmax + 0.12) * 20);
              ((sx += l.getX(M) * w0), (sy += l.getY(M) * w0), (sz += l.getZ(M) * w0), (sw += w0));
            }
          }
          sw > 0 && (N3 = [sx / sw, sy / sw, sz / sw]);
        }
      } catch (M) {}
      if (N3[2] < -1) for (let M = 0; M < l.count; M++) l.getY(M) > e * 0.4 && l.getZ(M) > N3[2] && (N3 = [l.getX(M), l.getY(M), l.getZ(M)]);
      window.__ccsNose = N3;
      let _ = -9;
      for (let M = 0; M < l.count; M++)
        Math.abs(Math.abs(l.getX(M)) - 0.15) < 0.03 &&
          Math.abs(l.getY(M) - (v + 0.015)) < 0.03 &&
          l.getZ(M) > _ &&
          (_ = l.getZ(M));
      _ < -1 && (_ = w - 0.05);
      let hx0 = 9, hx1 = -9;   // v145: กึ่งกลางหัวจริง (แกน x)
      for (let M = 0; M < l.count; M++) {
        let y0 = l.getY(M), z0 = l.getZ(M);
        y0 > e * 0.72 && y0 < e * 0.88 && z0 > a.min.z + (a.max.z - a.min.z) * 0.76 && ((hx0 = Math.min(hx0, l.getX(M))), (hx1 = Math.max(hx1, l.getX(M))));
      }
      let S = o.material.clone(), tl0 = null;
      return (
        S.map || (r.deleteAttribute("color"), (S = new X({ color: 14200968 }))),
        r.getAttribute("normal") || r.computeVertexNormals(),
        t === "chow" && ccsEarMask(r, e, a.max.z - a.min.z, hx1 > hx0 ? (hx0 + hx1) / 2 : 0),
        (tl0 = t === "chow" ? ccsTailPrep(r, e, a.max.z - a.min.z) : null),
        (S.roughness = 0.9),
        (S.metalness = 0),
        (jg[t] = {
          geo: r,
          mat: S,
          H: e,
          L: a.max.z - a.min.z,
          hip: e * 0.36,
          zF: u ? d / u : 0.25,
          zB: m ? p / m : -0.25,
          zMid: y,
          ...(t === "chow"
            ? {
                tailZ: a.min.z + (a.max.z - a.min.z) * 0.45,   // v145: หางเฉพาะส่วนที่อยู่เหนือแผ่นหลัง (หลังสูงสุด ≈ 0.79H) → หางกระดิกทั้งพวง หลังไม่บิด
                tailY: e * 0.8,
                tailY1: e * 0.845,
                tailPZ: a.min.z + (a.max.z - a.min.z) * 0.17,
              }
            : {
                tailZ: a.min.z + (a.max.z - a.min.z) * 0.14,
                tailY: e * 0.5,
                tailY1: e * 0.6,
                tailPZ: a.min.z + (a.max.z - a.min.z) * 0.14,
              }),
          topY: x,
          topZ: b,
          eyeZ: _,
          noseY: v,
          noseZ: w,
          nose3: N3,
          headX: hx1 > hx0 ? (hx0 + hx1) / 2 : 0,
          tail: tl0,
        }),
        !0
      );
    } catch (n) {
      return (console.warn("chow model", n), !1);
    }
  }
  var Fc = (i = "chow") => !!jg[i],
    o0 = {
      orange: { name: "ส้มแดง (ต้นฉบับ)" },
      cream: { name: "ครีม", dark: 12094040, light: 16773334 },
      white: { name: "ขาว", dark: 14077892, light: 16777215 },
      black: { name: "ดำ", dark: 1315090, light: 9076344 },
      red: { name: "แดงเข้ม", dark: 6956048, light: 14714954 },
      blue: {
        name: "บลู (เทาอมฟ้า)",
        dark: 3028032,
        light: 10134708,
      },
    };
  function ui(i = "orange", e = 1, t = "chow", n) {
    let s = jg[t],
      o = t === "chow",
      r = new J(),
      a = new J(),
      c = new J();
    r.add(a);
    let l = {
        uPhase: { value: 0 },
        uAmp: { value: 0 },
        uWag: { value: 0 },
        uJaw: { value: 1 },
        uHeadY: { value: 0 },
        uHeadX: { value: 0 },
        uHeadZ: { value: 0 },
        uFrontC: { value: 0 },
        uRearC: { value: 0 },
        uScr: { value: 0 },
        uScrPh: { value: 0 },
        uNeck: { value: new H() },
        uGal: { value: 0 },
        uFootOn: { value: 0 },
        uPawF: { value: 0 },
        uFootM: { value: new Oe() },
      },
      h = o0[i] ?? o0.orange,
      f = {
        uChow: { value: o ? 1 : 0 },
        uRecolor: { value: h.dark !== void 0 ? 1 : 0 },
        uDark: { value: new ae(h.dark ?? 0) },
        uLight: { value: new ae(h.light ?? 16777215) },
      },
      d = {
        uPat: { value: 0 },
        uShirt: { value: new ae(14829119) },
        uShirt2: { value: new ae(16777215) },
        uShoeOn: { value: 0 },
        uShoeStyle: { value: 0 },
        uShoe: { value: new ae(14829119) },
        uDirt: { value: 0 },
        uWet: { value: 0 },
        uWetY: { value: 1.2 },
        uPuff: { value: o ? 0.075 : 0 },
        uFurLen: { value: 0.07 },
        uFurDen: { value: 125 },
        uFurT: { value: Math.random() * 50 },
        uFurFlat: { value: 0 },
        uFurVel: { value: new H() },
      },
      u = s.mat.clone();
    ((u.color = new ae(16777215).multiplyScalar(h.dark !== void 0 ? 1 : 1.18)),
      o ||
        ((f.uRecolor.value = 0),
        (u.color = new ae(n ?? (s.mat.map ? 16777215 : 14200968)).multiplyScalar(s.mat.map ? 1.1 : 1))),
      (u.onBeforeCompile = (v) => {
        (Object.assign(v.uniforms, l, f, d, {
          uNoseY: { value: s.noseY },
          uNoseZ: { value: s.noseZ },
          uNose3: { value: new H(...(s.nose3 || [0, 0, -9])) },
          uH: { value: s.H },
          uL: { value: s.L },
          uHip: { value: s.hip },
          uZF: { value: s.zF },
          uZB: { value: s.zB },
          uZMid: { value: s.zMid },
          uTailZ: { value: s.tailZ },
          uTailY: { value: s.tailY },
          uTailY1: { value: s.tailY1 },
          uTailPZ: { value: s.tailPZ },
          uHX: { value: s.headX ?? 0 },
          uTailSep: { value: s.tail ? 1 : 0 },
          uTailRoot: { value: new H(...(s.tail?.root ?? [0, 0, 0])) },
        }),
          (v.fragmentShader =
            `#ifdef FUR_SHELL
varying float vFm;
#endif
uniform float uRecolor, uChow, uNoseY, uNoseZ, uH, uL, uHip, uZF, uZB, uZMid, uTailZ, uTailY, uTailY1, uPat, uShoeOn, uShoeStyle, uDirt, uWet, uWetY, uShellK, uFurDen, uFurFlat; uniform vec3 uDark, uLight, uShirt, uShirt2, uShoe, uNose3; varying vec3 vPosM;
      // ลายผ้า 2 มิติ (ใช้คู่กับการฉาย 3 แกน): 0 = สีหลัก, 1 = สีรอง
      float wearPat(vec2 u, float st, float ax) {
        if (st < 1.5) return 0.0;
        if (st < 2.5) return 0.0;
        if (st < 3.5) { vec2 g = fract(u / 0.075 + vec2(0.5 * floor(u.y / 0.075), 0.0)) - 0.5; return 1.0 - smoothstep(0.2, 0.25, length(g)); }
        if (st < 4.5 || (st > 4.5 && st < 5.5)) { vec2 g = abs(fract(u / 0.09) - 0.5); float a = smoothstep(0.3, 0.34, g.x), b = smoothstep(0.3, 0.34, g.y); float pl = max(a, b) * 0.55 + a * b * 0.45;
          if (st > 4.5) { float hb = sin((u.x + abs(fract(u.y * 28.0) - 0.5) * 0.06) * 260.0); return clamp(pl * 0.75 + step(0.6, hb) * 0.18, 0.0, 1.0); }
          return pl; }
        if (st < 6.5) { vec2 h = u * 26.0; h.x += 0.5 * mod(floor(h.y), 2.0); vec2 g = abs(fract(h) - 0.5); return 0.25 * step(0.36, max(g.x, g.y)); }
        vec2 d = abs(fract((u + u.yx * vec2(1.0, -1.0)) * 7.0) - 0.5); return 0.22 * step(0.44, min(d.x, d.y)) + 0.22 * step(0.46, max(d.x, d.y));
      }
      float hsh(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }
      float vnoise(vec3 p) { vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix(hsh(i), hsh(i + vec3(1,0,0)), f.x), mix(hsh(i + vec3(0,1,0)), hsh(i + vec3(1,1,0)), f.x), f.y), mix(mix(hsh(i + vec3(0,0,1)), hsh(i + vec3(1,0,1)), f.x), mix(hsh(i + vec3(0,1,1)), hsh(i + vec3(1,1,1)), f.x), f.y), f.z); }
      // ชุดชาวเมืองเวอร์ชันหมา (8-17): ทำตามชุดจริงของชาวเมือง สีและรายละเอียดตายตัว
      float pick3(vec2 a, vec2 b, vec2 c, vec3 tw, out vec2 o) { if (tw.x >= tw.y && tw.x >= tw.z) { o = a; return 0.0; } if (tw.y >= tw.z) { o = b; return 1.0; } o = c; return 2.0; }
      vec3 folkWear(float st, vec3 p, vec3 n, vec3 tw, vec2 side, float isSide, float edge, float zFr, float zBk, float shade) {
        vec2 u; pick3(p.zy / uL, p.xz / uL, p.xy / uL, tw, u);
        float belt = step(abs(p.z - uZMid), 0.045 * uL) * step(uHip * 0.66, p.y);
        float buckle = isSide * belt * step(abs(p.y - 0.5 * uH), 0.055 * uL);
        float front = step(zFr - 0.17 * uL, p.z) * step(abs(p.x), 0.05 * uL);
        float fn = vnoise(p * 130.0);
        vec3 c;
        if (st < 8.5) {        // ซานต้า: กำมะหยี่แดง ขนเฟอร์ขาวที่ขอบ เข็มขัดดำหัวทอง
          c = vec3(0.78, 0.06, 0.08) * (0.82 + 0.25 * fn);
          float fur = max(edge, step(p.z, zBk + 0.09 * uL)) ; fur = max(fur, step(zFr - 0.09 * uL, p.z) * step(0.6 * uH, p.y));
          if (p.y < uHip * 0.52) fur = 1.0;
          if (fur > 0.5) c = vec3(0.97, 0.96, 0.94) * (0.78 + 0.22 * vnoise(p * 340.0));
          if (belt > 0.5) c = vec3(0.07, 0.06, 0.06) * (0.9 + 0.2 * fn);
          if (buckle > 0.5) c = (abs(p.y - 0.5 * uH) < 0.03 * uL && abs(p.z - uZMid) < 0.025 * uL) ? vec3(0.1) : vec3(1.0, 0.8, 0.25);
        } else if (st < 9.5) { // ผึ้ง: ลายเหลืองดำรอบตัว ขนฟู
          float k = fract((p.z - uZB) / (0.13 * uL));
          c = k < 0.5 ? vec3(1.0, 0.76, 0.08) : vec3(0.07, 0.06, 0.05);
          c *= 0.8 + 0.3 * vnoise(p * 300.0);
          if (edge > 0.5) c = vec3(0.07, 0.06, 0.05);
        } else if (st < 10.5) { // ตัวตลกราชสำนัก: ลายข้าวหลามตัด 3 สี + ขอบทอง
          vec2 q = vec2(u.x + u.y, u.x - u.y) / 0.11; vec2 ce = floor(q); float id = mod(ce.x + ce.y * 2.0, 3.0);
          c = id < 0.5 ? vec3(0.86, 0.1, 0.16) : id < 1.5 ? vec3(0.1, 0.62, 0.28) : vec3(1.0, 0.8, 0.12);
          vec2 f = abs(fract(q) - 0.5); if (max(f.x, f.y) > 0.47) c *= 0.55;
          if (edge > 0.5) c = vec3(1.0, 0.82, 0.3) * (0.85 + 0.3 * step(0.5, fract(p.x * 60.0 + p.z * 60.0)));
        } else if (st < 11.5) { // ไวกิ้ง: เกราะโซ่เหล็กด้านบน \xB7 เสื้อหนังด้านล่าง \xB7 ขอบขนสัตว์ \xB7 เข็มขัดหนังหัวเงินกลม
          vec2 g = u / 0.034; g.x += 0.5 * mod(floor(g.y), 2.0); float d = length(fract(g) - 0.5);
          c = mix(vec3(0.62, 0.64, 0.68), vec3(0.2, 0.21, 0.23), smoothstep(0.28, 0.36, d) - smoothstep(0.44, 0.5, d)) * (0.85 + 0.3 * pow(max(0.0, n.y), 2.0));
          if (p.y < 0.5 * uH) c = vec3(0.42, 0.26, 0.13) * (0.75 + 0.35 * fn);
          if (edge > 0.5) c = vec3(0.55, 0.47, 0.38) * (0.6 + 0.5 * vnoise(p * 320.0));
          if (belt > 0.5) c = vec3(0.3, 0.18, 0.09) * (0.85 + 0.3 * fn);
          if (buckle > 0.5 && length(vec2(p.z - uZMid, p.y - 0.5 * uH)) < 0.045 * uL) c = vec3(0.86, 0.88, 0.92);
        } else if (st < 12.5) { // กัปตันโจรสลัด: เสื้อโค้ตแดง ขอบทอง กระดุมทองสองแถว ลายปักทองข้างตัว
          c = vec3(0.7, 0.07, 0.09) * (0.85 + 0.2 * fn);
          float emb = isSide * step(0.92, sin(side.x * 120.0 + sin(side.y * 70.0) * 2.0)) * step(abs(side.y), 0.12) * step(abs(side.x), 0.16);
          if (emb > 0.5) c = vec3(0.95, 0.74, 0.28);
          if (step(zFr - 0.15 * uL, p.z) > 0.5 && abs(abs(p.x) - 0.06 * uL) < 0.02 * uL && fract(p.y / (0.07 * uH)) < 0.35) c = vec3(1.0, 0.82, 0.3);
          if (edge > 0.5) c = vec3(0.95, 0.75, 0.28) * (0.85 + 0.3 * fn);
          if (belt > 0.5) c = vec3(0.08, 0.06, 0.05);
          if (buckle > 0.5) c = vec3(1.0, 0.8, 0.25);
        } else if (st < 13.5) { // ไดโนเสาร์: เขียวสด ลายแถบเข้มบนหลัง ท้องเหลืองอ่อน
          c = vec3(0.2, 0.68, 0.25) * (0.85 + 0.2 * fn);
          if (n.y > 0.25 && fract((p.z - uZB) / (0.11 * uL)) < 0.42) c = vec3(0.07, 0.38, 0.13);
          if (n.y < -0.35 || p.y < uHip * 0.82) c = vec3(0.96, 0.88, 0.45) * (0.9 + 0.15 * fn);
          if (isSide > 0.5 && length(side - vec2(0.08, 0.02)) < 0.03) c = vec3(0.12, 0.45, 0.2);
          if (isSide > 0.5 && length(side - vec2(-0.05, -0.04)) < 0.022) c = vec3(0.12, 0.45, 0.2);
        } else if (st < 14.5) { // เอี๊ยมยีนส์: ผ้ายีนส์ทวิล ตะเข็บด้ายส้ม สายเอี๊ยมไขว้หลัง กระดุมทอง กระเป๋าหน้าอก
          c = vec3(0.17, 0.32, 0.6) * (0.78 + 0.22 * fn + 0.12 * vnoise(vec3((u.x + u.y) * 700.0, (u.x - u.y) * 40.0, 0.0)));
          float strap = step(0.35, n.y) * step(abs(abs(p.x) - 0.1 * uL + (p.z - uZMid) * 0.25), 0.028 * uL);
          if (strap > 0.5) c = abs(abs(abs(p.x) - 0.1 * uL + (p.z - uZMid) * 0.25) - 0.021 * uL) < 0.005 * uL ? vec3(0.95, 0.62, 0.2) : vec3(0.1, 0.2, 0.42);
          vec2 pk = vec2(p.x / uL, (p.y - 0.62 * uH) / uL);
          if (step(zFr - 0.14 * uL, p.z) > 0.5 && abs(pk.x) < 0.07 && abs(pk.y) < 0.06) c = (abs(abs(pk.x) - 0.064) < 0.006 || abs(abs(pk.y) - 0.054) < 0.006) ? vec3(0.95, 0.6, 0.2) : vec3(0.18, 0.32, 0.56);
          if (step(zFr - 0.1 * uL, p.z) > 0.5 && length(vec2(abs(p.x) / uL - 0.09, (p.y - 0.74 * uH) / uL)) < 0.018) c = vec3(1.0, 0.8, 0.3);
          if (edge > 0.5) c = mix(vec3(0.24, 0.4, 0.66), vec3(0.95, 0.6, 0.2), step(0.7, fract((p.x + p.z) * 140.0)));
        } else if (st < 15.5) { // เชิ้ตลายสก็อตคนตัดไม้: แดงตัดดำ เส้นเล็กสีเหลือง กระดุมขาวหน้าอก
          vec2 g = fract(u / 0.12); float a = step(0.5, g.x), b = step(0.5, g.y);
          c = a * b > 0.5 ? vec3(0.06, 0.04, 0.04) : max(a, b) > 0.5 ? vec3(0.42, 0.05, 0.05) : vec3(0.8, 0.1, 0.1);
          if (abs(g.x - 0.25) < 0.02 || abs(g.y - 0.25) < 0.02) c = mix(c, vec3(0.95, 0.8, 0.3), 0.6);
          c *= 0.88 + 0.2 * fn;
          if (front > 0.5) { c = vec3(0.35, 0.04, 0.04); if (fract(p.y / (0.08 * uH)) < 0.3) c = vec3(0.95, 0.93, 0.88); }
          if (edge > 0.5) c = vec3(0.08, 0.05, 0.05);
        } else if (st < 16.5) { // เสื้อขนเป็ด: ห่วงพองเป็นปล้องรอบตัว ผ้ามันวาว ตะเข็บลึก
          float s = fract((p.z - uZB) / (0.085 * uL));
          c = vec3(0.12, 0.42, 0.85) * (0.6 + 0.55 * sin(s * 3.1416)) + vec3(0.35) * pow(sin(s * 3.1416), 12.0);
          if (s < 0.06 || s > 0.96) c = vec3(0.04, 0.12, 0.3);
          if (edge > 0.5) c = vec3(0.06, 0.16, 0.38) * (0.9 + 0.2 * fn);
          return c;
        } else {               // แจ็กเก็ตหนังร็อกเกอร์: หนังดำมันวาว หมุดเงินบนบ่าและหลัง ซิปเงินหน้าอก ซับในแดง
          c = vec3(0.06, 0.055, 0.06) * (0.8 + 0.6 * pow(max(0.0, n.y), 3.0)) + vec3(0.12) * pow(fn, 6.0);
          vec2 g = fract(u / 0.05) - 0.5;
          if (n.y > 0.3 && length(g) < 0.18) c = vec3(0.9, 0.92, 0.95) * (0.7 + 0.5 * (0.5 - g.y));
          if (step(zFr - 0.17 * uL, p.z) > 0.5 && abs(p.x - (p.y - 0.6 * uH) * 0.25) < 0.01 * uL) c = vec3(0.85, 0.87, 0.9) * (0.7 + 0.3 * step(0.5, fract(p.y * 220.0)));
          if (edge > 0.5) c = vec3(0.55, 0.06, 0.08);
          return c;
        }
        return c;
      }
` +
            v.fragmentShader.replace(
              "#include <map_fragment>",
              `#include <map_fragment>
      { vec3 c0 = diffuseColor.rgb;
        float l = dot(c0, vec3(0.3, 0.59, 0.11));
        // v91: ปาก/ลิ้นสะอาดทุกสีขน — ลิ้นม่วงอมดำผสมแบบนุ่ม (ไม่เป็นจุดกระดำกระด่าง), ริมฝีปาก/เส้นปากเก็บสีเข้มเดิมไว้ ไม่โดนย้อมสีขน
        vec3 mq = vPosM - uNose3;
        float muz = uChow > 0.5 ? smoothstep(-0.26 * uL, -0.2 * uL, mq.z) * (1.0 - smoothstep(0.0, 0.04 * uH, mq.y)) : 0.0;   // v103: อิงตำแหน่งจมูกจริง
        // v92: ลิ้นทั้งลิ้นม่วงอมดำ (ทุกเฉดชมพู/แดงในช่องปาก) + จมูกดำสนิทเรียบทั้งก้อน
        float pinkish = smoothstep(0.0, 0.05, c0.r - c0.g) * smoothstep(-0.12, -0.03, c0.b - c0.g) * smoothstep(0.12, 0.22, c0.r);
        float mouthZone = uChow > 0.5 ? (1.0 - smoothstep(0.05 * uL, 0.075 * uL, abs(mq.x))) * (1.0 - smoothstep(-0.075 * uH, -0.05 * uH, mq.y)) * smoothstep(-0.22 * uH, -0.18 * uH, mq.y) * smoothstep(-0.24 * uL, -0.2 * uL, mq.z) : 0.0;
        float tgw = clamp(pinkish * 1.6, 0.0, 1.0) * mouthZone;
        vec3 nd = (vPosM - uNose3) / vec3(0.07 * uL, 0.065 * uH, 0.07 * uL);
        float noseM = uChow > 0.5 ? (1.0 - smoothstep(0.85, 1.0, length(nd))) * smoothstep(-0.05, 0.2, nd.y) * (1.0 - smoothstep(0.14, 0.26, l)) : 0.0;
        vec3 base = c0;
        if (uRecolor > 0.5) {
          vec3 fur = mix(uDark, uLight, smoothstep(0.05, 0.7, l));
          float keep = 1.0 - smoothstep(0.012, 0.03, l);
          float lip = muz * (1.0 - smoothstep(-0.095 * uH, -0.075 * uH, mq.y));
          float philtrum = muz * smoothstep(-0.095 * uH, -0.075 * uH, mq.y);
          keep *= 1.0 - philtrum;
          keep = max(keep, lip * (1.0 - smoothstep(0.07, 0.15, l)));
          base = mix(fur, uDark * 0.1 + c0 * 0.4, keep);
        }
        base = mix(base, vec3(0.035, 0.03, 0.035) * (0.8 + 1.2 * l), noseM);   // จมูกดำเรียบ (เงาวาวตามผิวเดิม)
        diffuseColor.rgb = mix(base, vec3(0.032, 0.02, 0.06) * (0.8 + 0.5 * l), tgw);
        float shade = 0.78 + 0.3 * smoothstep(0.03, 0.55, l);
        // เสื้อ: คลุมลำตัว + ต้นขาหน้า (แขนเสื้อ) ไม่ทับหัวและหาง \xB7 ลวดลายฉายจาก 3 แกนตามทิศผิว (ไม่ยืดเป็นเส้นตรงกลางตัว)
        vec3 nM = normalize(cross(dFdx(vPosM), dFdy(vPosM)));
        vec3 tw = pow(abs(nM), vec3(4.0)); tw /= (tw.x + tw.y + tw.z + 1e-4);
        if (uPat > 0.5) {
          float zFr = uZF + 0.06 * uL, zBk = uZB - 0.12 * uL;
          float torso = step(uHip * 0.66, vPosM.y) * (1.0 - step(0.97 * uH, vPosM.y)) * step(zBk, vPosM.z) * (1.0 - step(zFr, vPosM.z));
          if (vPosM.z < uZB - 0.02 * uL && vPosM.y > 0.6 * uH) torso = 0.0;      // หาง
          if ((1.0 - smoothstep(uTailZ - 0.08, uTailZ, vPosM.z)) * smoothstep(uTailY, uTailY1, vPosM.y) > 0.25) torso = 0.0;   // หางที่ม้วนขึ้นมาบนหลัง (โซนเดียวกับที่ใช้กระดิกหาง)
          if (vPosM.z > uZF - 0.06 * uL && vPosM.y > 0.66 * uH) torso = 0.0;     // แผงคอ/หัว
          float sleeve = step(uHip * 0.42, vPosM.y) * (1.0 - step(uHip * 0.72, vPosM.y)) * step(uZF - 0.11 * uL, vPosM.z) * (1.0 - step(uZF + 0.11 * uL, vPosM.z));
          if (max(torso, sleeve) > 0.5) {
            vec3 P = vPosM / uL;
            vec3 c = uShirt;
            float fx = wearPat(P.zy, uPat, 0.0), fy = wearPat(P.xz, uPat, 1.0), fz = wearPat(P.xy, uPat, 2.0);
            float f = fx * tw.x + fy * tw.y + fz * tw.z;
            c = mix(uShirt, uShirt2, clamp(f, 0.0, 1.0));
            if (uPat > 1.5 && uPat < 2.5) c = mix(uShirt, uShirt2, smoothstep(0.46, 0.54, abs(fract(vPosM.y / (0.15 * uH)) - 0.5) * 2.0));
            if (uPat > 4.5) c *= 0.92 + 0.16 * vnoise(vPosM * 140.0);                    // เนื้อผ้าละเอียด
            else c *= 0.96 + 0.06 * sin(vPosM.y * 520.0);                                 // ลายถักเล็ก ๆ
            vec2 side = vec2(vPosM.z - uZMid, vPosM.y - 0.56 * uH) / uL;                  // จุดกลางด้านข้างลำตัว
            float isSide = smoothstep(0.55, 0.8, abs(nM.x)) * step(0.2 * uL, abs(vPosM.x));
            // 5 เสื้อกั๊กนักสืบ: กระดุมทองแถวหน้าอก + กระเป๋าข้าง
            if (uPat > 4.5 && uPat < 5.5) {
              if (vPosM.z > zFr - 0.16 * uL && abs(vPosM.x) < 0.035 * uL) { c = uShirt * 0.55; if (length(vec2(vPosM.x / uL, fract(vPosM.y / (0.09 * uH)) * 0.09 * uH / uL - 0.045 * uH / uL)) < 0.016) c = vec3(0.95, 0.76, 0.3); }
              vec2 pk = side - vec2(-0.06, -0.09); if (isSide > 0.5 && abs(pk.x) < 0.085 && abs(pk.y) < 0.05) c = (abs(pk.y - 0.035) < 0.012) ? uShirt2 * 0.8 : uShirt * 0.78;
            }
            // 6 เสื้อระบายความร้อน: ตาข่ายระบายอากาศ + แถบสะท้อนแสงบนหลัง + เกล็ดหิมะข้างตัว
            if (uPat > 5.5 && uPat < 6.5) {
              if (nM.y > 0.45 && abs(abs(vPosM.x) - 0.1 * uL) < 0.02 * uL) c = vec3(0.92, 0.96, 1.0) * (1.05 + 0.15 * sin(vPosM.z * 300.0));
              vec2 q = side * 8.0; float r = length(q), an = atan(q.y, q.x) + 0.5236;
              float a = mod(an, 1.0472) - 0.5236; float u = r * cos(a), v = abs(r * sin(a));
              float flake = step(r, 1.0) * max(step(v, 0.055), step(abs(v - (u - 0.42) * 0.85), 0.05) * step(0.42, u) * step(u, 0.78));
              flake = max(flake, step(abs(v - (u - 0.18) * 0.85), 0.045) * step(0.18, u) * step(u, 0.36));
              if (isSide > 0.5 && flake > 0.5) c = vec3(0.97, 0.99, 1.0);
            }
            // 7 เสื้อโคลเวอร์นำโชค: ใบโคลเวอร์ 4 แฉกข้างตัว + เดินขอบทอง
            if (uPat > 6.5) {
              vec2 q = side * 8.0; float d = 9.0;
              for (int k = 0; k < 4; k++) { float an = float(k) * 1.5708 + 0.785; d = min(d, length(q - 0.42 * vec2(cos(an), sin(an))) - 0.36); }
              float stem = step(abs(q.x + 0.12 + q.y * 0.35), 0.06) * step(q.y, -0.2) * step(-0.95, q.y);
              if (isSide > 0.5) { if (d < 0.0 || stem > 0.5) c = vec3(0.86, 1.0, 0.82); else if (d < 0.07) c = vec3(0.12, 0.36, 0.14); if (d < -0.28) c = vec3(0.98, 0.84, 0.3); }
            }
            float edgeF = torso > 0.5 && (vPosM.z > zFr - 0.05 * uL || vPosM.z < zBk + 0.05 * uL || vPosM.y < uHip * 0.74) ? 1.0 : 0.0;
            if (uPat > 7.5) { diffuseColor.rgb = folkWear(uPat, vPosM, nM, tw, side, isSide, edgeF, zFr, zBk, shade) * shade; }
            else {
            // ขอบคอเสื้อ/ชายเสื้อ
            float edge = torso > 0.5 && (vPosM.z > zFr - 0.05 * uL || vPosM.z < zBk + 0.05 * uL || vPosM.y < uHip * 0.74) ? 1.0 : 0.0;
            if (edge > 0.5) c = uPat > 4.5 ? uShirt2 * (0.9 + 0.2 * sin(vPosM.x * 400.0 + vPosM.z * 400.0)) : uShirt2;
            diffuseColor.rgb = c * shade;
            }
          }
        }
        // รองเท้า: 0 แบบเดิม (ปลายเท้า) \xB7 1 บูตยางกันร้อน \xB7 2 บูตหนังขุดดิน \xB7 3 ผ้าใบวิ่งสายฟ้า
        if (uShoeOn > 0.5) {
          float top = uShoeStyle > 0.5 ? uHip * 0.36 : uHip * 0.2;
          if (vPosM.y < top) {
            float y = vPosM.y / uHip; vec3 c = uShoe * shade;
            if (uShoeStyle < 0.5) c = y < 0.055 ? vec3(0.96, 0.95, 0.92) : uShoe * shade;
            else if (uShoeStyle < 1.5) {           // บูตยาง: พื้นหนามีดอกยาง \xB7 ปากบูตพับ \xB7 เส้นนูนรอบข้อ
              c = uShoe * (0.85 + 0.15 * smoothstep(0.0, 0.36, y)) * shade;
              if (y > 0.3) c = uShoe * 1.2 * shade;
              if (abs(y - 0.18) < 0.012) c *= 0.7;
              if (y < 0.075) c = vec3(0.16, 0.17, 0.2) * (0.8 + 0.4 * step(0.5, fract(vPosM.z * 90.0 + vPosM.x * 90.0)));
            } else if (uShoeStyle < 2.5) {         // บูตหนัง: หัวเหล็ก \xB7 เชือกไขว้ \xB7 พื้นหยัก
              c = uShoe * (0.8 + 0.25 * vnoise(vPosM * 220.0)) * shade;
              if (nM.z > 0.45 && y < 0.13 && y > 0.07) c = vec3(0.72, 0.74, 0.78) * shade * 1.15;
              if (nM.z > 0.35 && y > 0.13 && y < 0.33) { float l = abs(fract((vPosM.x * 1.0 + vPosM.y) * 60.0) - 0.5) * abs(fract((-vPosM.x + vPosM.y) * 60.0) - 0.5); if (l < 0.02) c = vec3(0.9, 0.8, 0.55); }
              if (y > 0.31) c = uShoe * 0.6 * shade;
              if (y < 0.075) c = vec3(0.12, 0.08, 0.05) * (0.7 + 0.6 * step(0.5, fract(vPosM.z * 70.0)));
            } else {                               // ผ้าใบ: สายฟ้าดำข้างรองเท้า \xB7 ส้นแดง \xB7 พื้นขาวหนา \xB7 เชือกขาว
              c = uShoe * shade;
              float zz = abs(fract(vPosM.z * 22.0) - 0.5);
              if (abs(nM.x) > 0.45 && abs(y - (0.17 + (zz - 0.25) * 0.28)) < 0.028) c = vec3(0.07);
              if (nM.z < -0.45 && y > 0.08 && y < 0.3) c = vec3(0.9, 0.18, 0.15) * shade;
              if (nM.z > 0.5 && y > 0.14 && y < 0.32 && fract(y * 30.0) < 0.35) c = vec3(0.98);
              if (y < 0.085) c = vec3(0.97, 0.96, 0.93) * (y < 0.03 ? 0.75 : 1.0);
            }
            diffuseColor.rgb = c;
          }
        }
        if (uChow > 0.5) diffuseColor.rgb *= mix(0.62, 1.0, smoothstep(0.0, 0.09 * uHip, vPosM.y));   // v145: ใต้อุ้งเท้ามืดลง (เงาสัมผัสพื้น ไม่เป็นขอบสว่าง)
        // คราบสกปรก: ด่างดำตามขาและท้องก่อน แล้วลามขึ้นตัว
        if (uDirt > 0.01) {
          float n = vnoise(vPosM * 26.0) * 0.6 + vnoise(vPosM * 61.0) * 0.4;
          float low = 1.0 - smoothstep(uHip * 0.4, uHip * 2.2, vPosM.y);
          float m = smoothstep(1.0 - uDirt * (0.55 + 0.45 * low), 1.02 - uDirt * 0.2, n);
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.13, 0.1, 0.08), m * 0.88);
        }
        // v132: ขนเปียก — เข้มขึ้นจากระดับน้ำลงมา ขนจับกันเป็นเส้น ๆ (แห้งแล้วค่อย ๆ จางขึ้นจากด้านบน)
        if (uWet > 0.01) {
          float lv = uWetY * uH + (vnoise(vPosM * 9.0) - 0.5) * 0.08 * uH;
          float wm = uWet * (1.0 - smoothstep(lv - 0.04 * uH, lv + 0.04 * uH, vPosM.y));
          float strand = 0.82 + 0.18 * vnoise(vec3(vPosM.x * 90.0, vPosM.y * 14.0, vPosM.z * 90.0));
          diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(0.5, 0.47, 0.45) * strand, wm);
        }
        #ifdef FUR_SHELL
        { // ขนฟู: ชั้นเปลือกขน — เส้นขนสุ่มเป็นจุด ๆ ยิ่งชั้นนอกยิ่งเหลือน้อย (ปลายขนเรียว) · ปลายขนสว่าง โคนขนมืด
          // เส้นขนกลม ปลายเรียว: แต่ละช่องมีขน 1 เส้น (ตำแหน่งสุ่ม) รัศมีเล็กลงเรื่อย ๆ ตามชั้น
          if (vFm < 0.05) discard;   // ไม่มีขน (หู/ปลายจมูก): ไม่วาดชั้นขนทับผิว
          vec3 q = vPosM * (uFurDen * 1.6 / uH);
          vec3 ci = floor(q), cf = fract(q) - 0.5;
          vec3 jit = vec3(hsh(ci), hsh(ci + 3.1), hsh(ci + 7.7)) - 0.5;
          float r = length(cf - jit * 0.5);
          float rad = 0.62 * (1.0 - uShellK * 0.85) * (0.75 + 0.5 * hsh(ci + 1.9));
          #ifdef FUR_A2C
          float fa = (1.0 - smoothstep(rad * 0.45, rad * 1.15, r)) * (1.0 - uShellK * 0.35);   // v145: ขอบเส้นขนนุ่ม (MSAA alpha-to-coverage) ไม่เป็นจุดแตก ๆ
          if (fa < 0.04) discard;
          diffuseColor.a = fa;
          #else
          if (r > rad) discard;
          #endif
          float fz = 1.0 - smoothstep(0.16 * uL, 0.3 * uL, distance(vPosM.yz, vec2(uNoseY, uNoseZ)));   // โซนหน้า (ตา จมูก ปาก)
          if (uPat > 0.5 || uFurFlat > 0.5 || vPosM.y < uHip * 0.18 || (fz > 0.0 && dot(diffuseColor.rgb, vec3(0.33)) < 0.22)) discard;   // v144: ใส่เสื้อ/ตัวเปียกโชก/อุ้งเท้า/ตา-จมูก-ปาก: ไม่มีขนฟู · ส่วนอื่นสีเข้มก็มีขน
          diffuseColor.rgb *= mix(0.9, 1.12, uShellK);
        }
        #endif
      }`,
            ).replace(
              "#include <roughnessmap_fragment>",
              `#include <roughnessmap_fragment>
      if (uWet > 0.01) { float lv2 = uWetY * uH; roughnessFactor = mix(roughnessFactor, 0.38, 0.8 * uWet * (1.0 - smoothstep(lv2 - 0.04 * uH, lv2 + 0.04 * uH, vPosM.y))); }`,
            )),
          (v.vertexShader =
            `varying vec3 vPosM;
attribute float aEar;
#ifdef CCS_TAIL
attribute float aT;
#endif
#ifdef FUR_SHELL
varying float vFm;
#endif
uniform float uChow, uPhase, uAmp, uWag, uJaw, uHip, uZF, uZB, uZMid, uTailZ, uTailY, uTailY1, uTailPZ, uNoseY, uNoseZ, uH, uL, uHeadY, uHeadX, uHeadZ, uFrontC, uRearC, uScr, uScrPh, uGal, uFootOn, uPawF, uPuff, uFurLen, uShellK, uFurT, uHX, uTailSep; uniform vec3 uNeck, uFurVel, uTailRoot; uniform mat4 uFootM;
` +
            v.vertexShader.replace(
              "#include <begin_vertex>",
              `#include <begin_vertex>
      vPosM = position;
      { // v142: น้องอ้วนฟู — ขยายตัวออกจาก "แกนกลางลำตัว" (เส้นจากโคนหางถึงคอ) และหัวขยายจากจุดกลางหัว ไล่ต่อเนื่องกัน
        //        (ไม่ใช้ทิศ normal → ไม่มีรอยหัก/รอยพับตอนขยับ) · ขาฟูออกด้านข้าง ไม่ยืดลงพื้น · หน้าไม่มีขนชั้นนอก (เรียบร้อยแบบหมาจริง)
        vec3 hc = vec3(uHX, uNeck.y + 0.19 * uH, uNeck.z + 0.07 * uL);                       // จุดกลางหัว (v145: โมเดลหัวเอียงไปทางซ้ายนิดนึง → ใช้กึ่งกลางจริง หัวฟูกลมเท่ากันสองข้าง)
        vec3 sa = vec3(0.0, uHip * 1.25, uZB + 0.05 * uL), sb = vec3(0.0, uNeck.y - 0.02 * uH, uNeck.z - 0.02 * uL);   // แกนลำตัว
        vec3 ab = sb - sa; float tt = clamp(dot(position - sa, ab) / dot(ab, ab), 0.0, 1.0); vec3 sp = sa + ab * tt;
        float hw = smoothstep(uNeck.z - 0.06 * uL, uNeck.z + 0.1 * uL, position.z) * smoothstep(uNeck.y - 0.16 * uH, uNeck.y + 0.04 * uH, position.y);
        float legM = smoothstep(uHip * 0.15, uHip * 1.0, position.y);
        float mane = exp(-pow((position.z - (uNeck.z - 0.03 * uL)) / (0.16 * uL), 2.0)) * smoothstep(uHip * 0.6, uHip * 1.3, position.y);
        float sBody = uPuff * (3.0 + 2.2 * mane) * (0.55 + 0.45 * legM);   // v147: ขาฟูอวบขึ้น
        float top = smoothstep(hc.y - 0.02 * uH, hc.y + 0.2 * uH, position.y);                // กระหม่อม/หลังหัว
        float front = smoothstep(hc.z + 0.04 * uL, uNoseZ, position.z);                         // หน้า/ปาก
        float sHead = uPuff * (1.5 + 1.4 * top * (1.0 - front));                                  // v144: หัวด้านบนพองกลมขึ้น
        vec3 anc = mix(sp, hc, hw);
        vec3 off = (position - anc) * mix(sBody, sHead, hw) * (1.0 - 0.45 * aEar);   // v145b: หูไม่ถูกดึงยืดออกไปตามหัวที่ฟู (ไม่แหลมโผล่)
        off.z -= hw * front * (0.035 * uL) * smoothstep(0.0, 1.0, 1.0 - top);                    // v144: ปากสั้นลงนิดหน่อย
        off.y *= mix(legM, 1.0, hw);                                   // ขา: ฟูออกด้านข้างอย่างเดียว ไม่ยืดลงพื้น
        { // v147: หัวกลมเป็นลูกบอล — ดึงผิวหัว (ยกเว้นหน้า/ปาก) เข้าหาทรงกลมรอบจุดกลางหัว · หูถูกดันออกให้โผล่พ้นขนเป็นก้อนกลม
          vec3 rv = position - hc; float rl = max(length(rv), 1e-4);
          float sph = hw * (1.0 - front) * smoothstep(hc.y - 0.2 * uH, hc.y, position.y) * 0.65;
          off += (rv / rl * 0.235 * uH - rv) * sph;
          off += (rv / rl * 0.045 * uH + normal * 0.03 * uH) * aEar;
        }
        transformed += off * uChow;   // v145: ฟูถึงฝ่าเท้า (เดิมขอบล่างไม่ฟู → เห็นเป็นขอบสีส้มสว่างใต้เท้า)
        #ifdef FUR_SHELL
        vec3 nn = normalize(objectNormal);
        float fd = distance(position.yz, vec2(uNoseY, uNoseZ));
        float face = mix(1.0, mix(0.0, 0.7, smoothstep(0.07 * uL, 0.3 * uL, fd)), step(hc.z - 0.02 * uL, position.z));   // v143: หน้ามีขนฟู (สั้นลงใกล้ตา/จมูก ปลายจมูกไม่มี)
        float fm = (0.25 + 0.75 * legM + 0.5 * mane + 0.6 * hw * top * (1.0 - front)) * face;   // v144: ขนบนหัวยาวขึ้น
        fm *= 1.0 - aEar;
        #ifdef CCS_TAIL
        fm *= 1.3;   // หางพวงฟู
        #endif   // v145: หู (หาจากรูปทรงตอนโหลด แล้วเกลี่ยให้เนียน) ไม่มีขนชั้นนอก → ไม่มีขนแหลมเป็นกระจุก/เส้นโด่ ๆ
        vFm = fm;
        float fl = uShellK * uFurLen * uH * fm;
        transformed += nn * fl;
        // ขนไหวเบา ๆ: ปลายขนลู่ตามการวิ่ง + เด้งตามจังหวะก้าว + ลมโชย (ขยับน้อย ๆ ไม่ให้ขนหลุดจากตัว)
        float fw = uShellK * uShellK * uFurLen * uH * fm;
        transformed -= uFurVel * fw * 0.35;
        transformed.y -= fw * (0.1 + 0.15 * abs(sin(uPhase * 2.0)) * min(uAmp * 3.0, 1.0));
        transformed.x += fw * 0.08 * sin(uFurT * 1.7 + position.z * 9.0 + position.y * 7.0);
        #endif
      }
      { // ขากรรไกรล่าง: หุบ/อ้า
        float jw = smoothstep(uNoseZ - 0.22 * uL, uNoseZ - 0.1 * uL, position.z) * (1.0 - smoothstep(uNoseY - 0.06 * uH, uNoseY - 0.025 * uH, position.y)) * smoothstep(uNoseY - 0.3 * uH, uNoseY - 0.18 * uH, position.y);
        jw *= uChow;
        if (jw > 0.0) {
          float a = uJaw * 0.3 * jw;
          vec3 piv = vec3(transformed.x, uNoseY - 0.06 * uH, uNoseZ - 0.24 * uL);
          vec3 q = transformed - piv; float ca = cos(a), sa = sin(a);
          transformed = piv + vec3(q.x, q.y * ca - q.z * sa, q.y * sa + q.z * ca);
        }
      }
      float legW = 1.0 - smoothstep(uHip * 0.45, uHip, position.y);   // v143: ใช้ตำแหน่งเดิม (ไม่ให้ท้องที่พองลงมาถูกนับเป็นขา)
      if (legW > 0.0) {
        bool front = position.z > uZMid;
        float side = position.x > 0.0 ? 1.0 : -1.0;
        float off = front ? (side > 0.0 ? 0.0 : 3.14159) : (side > 0.0 ? 3.14159 : 0.0);          // เดิน: ขาทแยงคู่กัน
        float offG = front ? (side > 0.0 ? 0.0 : 0.55) : (side > 0.0 ? 3.14159 : 3.7);            // วิ่งควบ: ขาหน้าคู่ ขาหลังคู่ สลับกัน
        off = mix(off, offG, uGal);
        float a = sin(uPhase + off) * uAmp * legW + (front ? -0.1 : 0.12) * uGal * uAmp * legW;   // วิ่งแล้วขาหน้ายื่น ขาหลังถีบ
        if (!front && side > 0.0) a += uScr * (0.95 + 0.45 * sin(uScrPh)) * legW;   // ขาหลังเกาหู
        vec3 piv = vec3(transformed.x, uHip, front ? uZF : uZB);
        vec3 q = transformed - piv;
        float ca = cos(a), sa = sin(a);
        transformed = piv + vec3(q.x, q.y * ca - q.z * sa, q.y * sa + q.z * ca);
      }
      { // หัว: หมุนรอบคอ (หันมอง ก้มดม เงยหาว เอียงคอ) \xB7 ค่อย ๆ ไล่น้ำหนักจากคอขึ้นหัว
        float hw = smoothstep(uNeck.z - 0.04 * uL, uNeck.z + 0.1 * uL, position.z) * smoothstep(uNeck.y - 0.14 * uH, uNeck.y + 0.02 * uH, position.y);
        // v145 เชาเชา: ท้ายทอยของโมเดลยื่นไปด้านหลังคอ → ใช้แนวเฉียงแบ่งหัว/แผงคอ (ท้ายทอยหมุนไปกับหัวทั้งก้อน ไม่โผล่เป็นโหนก)
        //   และหมุนรอบจุดที่อยู่หลังคอเล็กน้อย (หัวทั้งหัวหันไปทางเดียวกัน ไม่มีส่วนหลังหัวสะบัดออกด้านตรงข้าม)
        vec2 hq = position.yz - vec2(uNeck.y + 0.08 * uH, uNeck.z - 0.04 * uL);
        float hwC = smoothstep(-0.06 * uH, 0.08 * uH, dot(hq, vec2(0.8, 0.6))) * smoothstep(uNeck.y - 0.2 * uH, uNeck.y, position.y);
        hw = mix(hw, hwC, uChow);
        vec3 pv = uNeck - vec3(0.0, 0.0, 0.1 * uL * uChow);
        if (hw > 0.0 && (abs(uHeadY) + abs(uHeadX) + abs(uHeadZ)) > 0.001) {
          vec3 q = transformed - pv; float a, c, s2;
          a = uHeadZ * hw; c = cos(a); s2 = sin(a); q = vec3(q.x * c - q.y * s2, q.x * s2 + q.y * c, q.z);
          a = uHeadX * hw; c = cos(a); s2 = sin(a); q = vec3(q.x, q.y * c - q.z * s2, q.y * s2 + q.z * c);
          a = uHeadY * hw; c = cos(a); s2 = sin(a); q = vec3(q.x * c + q.z * s2, q.y, -q.x * s2 + q.z * c);
          transformed = pv + q;
        }
      }
      { // หางกระดิก: หมุนทั้งพวงรอบโคนหาง (ไม่ลากหลังให้เบี้ยว)
        float tw = (1.0 - smoothstep(uTailZ - 0.08, uTailZ, position.z)) * mix(smoothstep(uTailY, uTailY1, position.y), smoothstep(uTailY - 0.05 * uH, uTailY + 0.02 * uH, position.y), uChow);   // v143: ใช้ตำแหน่งเดิม — ขนกลางหลังที่ฟูขึ้นไม่หมุนตามหาง
        if (tw > 0.0) {
          if (uChow < 0.5) {
            float a = sin(uWag) * 0.42 * tw;
            vec2 q = vec2(transformed.x, transformed.z - uTailPZ);
            float ca = cos(a), sa = sin(a);
            transformed.x = q.x * ca - q.y * sa;
            transformed.z = uTailPZ + q.x * sa + q.y * ca;
          } else {
            // v145b เชาเชา: หางของโมเดลติดเป็นผืนเดียวกับแผ่นหลัง → ไม่เลื่อนทั้งพวง (จะดึงผิวหลังยืดเป็นแผ่น)
            //   แต่ "เอน" ซ้าย-ขวาจากผิวหลัง: ยิ่งสูงจากหลังยิ่งปัดมาก ใต้หางที่ติดหลังแทบไม่ขยับ → ไม่มีผิวยืด
            float py = uTailY - 0.03 * uH, h = max(position.y - py, 0.0);
            float b = sin(uWag) * 0.5 * tw * (1.0 - uTailSep);   // v147: มีหางแยกชิ้นแล้ว → ตัวไม่ต้องขยับ
            transformed.x += h * sin(b);
            transformed.y -= h * (1.0 - cos(b));
          }
          transformed.y += abs(sin(uWag)) * 0.012 * tw * (1.0 - uChow);
        }
        #ifdef CCS_TAIL
        { // v147: หางแยกชิ้น — ส่ายรอบแกนตามแนวสะโพก (โคนหางอยู่กับที่ ไล่น้ำหนักไปปลาย) + ยกขึ้นนิด ๆ ตอนปัดสุด → ปลายหางหลุดจากหลัง
          float wt = smoothstep(0.12, 0.4, aT);
          vec3 piv = uTailRoot + vec3(0.0, 0.05 * uH, -0.03 * uL) * uChow;
          vec3 ax = normalize(vec3(0.0, 0.5, -1.0));
          float a = sin(uWag) * 0.6 * wt;
          vec3 q = transformed - piv;
          q = q * cos(a) + cross(ax, q) * sin(a) + ax * dot(ax, q) * (1.0 - cos(a));
          float b = -(0.1 + 0.16 * abs(sin(uWag))) * wt;      // ยกหางขึ้น/ไปด้านหลัง (หมุนรอบแกน x)
          q = vec3(q.x, q.y * cos(b) - q.z * sin(b), q.y * sin(b) + q.z * cos(b));
          transformed = piv + q;
        }
        #endif
      }
      { // เท้าติดพื้นตอนนั่ง/หมอบ/ก้ม: ปลายเท้าคืนสู่ตำแหน่งเดิมบนพื้น ไล่น้ำหนักขึ้นไปถึงสะโพก (ขาที่กำลังเกาไม่ดึง)
        float wf = uFootOn * (1.0 - clamp((position.y - uHip * 0.1) / (uHip * 0.95), 0.0, 1.0));
        if (position.z < uZMid && position.x > 0.0) wf *= 1.0 - clamp(uScr, 0.0, 1.0);
        if (wf > 0.0) { transformed = mix(transformed, (uFootM * vec4(transformed, 1.0)).xyz, wf); if (position.z > uZMid) transformed.z += uPawF * wf; }   // หมอบ: เหยียดขาหน้าไปข้างหน้า
      }`,
            )));
      }));
    let p = new R(s.geo, u);
    o && p.scale.set(1.24, 1.02, 1.08);
    o && ccsFurShells(p, u, d);
    o && ccsTailAttach(s, u, d, p);
    p.userData.ccsG = s;
    let m = (v) => {
      let _ = o0[v] ?? o0.orange;
      ((f.uRecolor.value = _.dark !== void 0 ? 1 : 0),
        f.uDark.value.set(_.dark ?? 0),
        f.uLight.value.set(_.light ?? 16777215),
        u.color.set(16777215).multiplyScalar(_.dark !== void 0 ? 1 : 1.18));
    };
    ((p.castShadow = !0), (p.receiveShadow = !0), a.add(p));
    let E = new J(),
      g = new R(new we(0.05, 14, 10), new X({ color: 1838362, roughness: 0.9 }));
    (g.scale.set(1.3, 0.55, 0.6), E.add(g));
    let y = new we(0.042, 16, 12);
    y.translate(0, -0.03, 0.02);
    let x = new R(y, new X({ color: 1180196, roughness: 0.55, metalness: 0, emissive: 131590 }));
    (x.scale.set(1.15, 1.9, 0.5), E.add(x));
    let b = new R(new ee(0.004, 0.08, 0.01), new X({ color: 3809888 }));
    (b.position.set(0, -0.03, 0.04),
      E.add(b),
      E.position.set(0, s.noseY - s.H * 0.075, s.noseZ - 0.02),
      (E.visible = !1),
      c.position.set(0, s.H * 0.7, s.L * 0.35),
      r.scale.setScalar(e));
    let w = {
      root: r,
      body: a,
      head: c,
      legs: [],
      arms: [],
      eyes: [],
      quad: !0,
      t: Math.random() * 10,
      blink: 99,
      yaw: 0,
      height: s.H * e,
    };
    if (
      (l.uNeck.value.set(
        o ? (-0.03 * s.H) / 1.15 : 0,
        o ? (0.71 * s.H) / 1.15 : s.hip + (s.noseY - s.hip) * 0.35,
        o ? (0.33 * s.H) / 1.15 : s.zF + (s.noseZ - s.zF) * 0.25,
      ),
      (w.poseMesh = p),
      (w.uni = l),
      (w.M = {
        H: s.H,
        L: s.L,
        hip: s.hip,
        zF: s.zF,
        zB: s.zB,
        zMid: s.zMid,
        tailZ: s.tailZ,
        noseZ: s.noseZ,
        noseY: s.noseY,
        topY: s.topY,
        topZ: s.topZ,
        eyeZ: s.eyeZ,
      }),
      (w.setCoat = m),
      (w.setWear = (v) => {
        ((d.uPat.value = v.body ? v.body.pat : 0),
          v.body && (d.uShirt.value.set(v.body.c1), d.uShirt2.value.set(v.body.c2)),
          (d.uShoeOn.value = v.feet ? 1 : 0),
          v.feet && d.uShoe.value.set(v.feet),
          (d.uShoeStyle.value = v.shoeStyle ?? 0));
      }),
      (w.setDirt = (v) => {
        d.uDirt.value = v;
      }),
      (w.setWet = (v, y) => {
        ((d.uWet.value = v), (d.uWetY.value = y));
      }),
      (w.setFurFlat = (v) => {
        d.uFurFlat.value = v;
      }),
      (w.tongue = E),
      o)
    ) {
      let v = { head: new J(), neck: new J(), eyes: new J(), face: new J(), back: new J() };
      {
        let T = p.geometry.attributes.position,
          A = 32,
          F = new Array(A).fill(0),
          C = s.zB - 0.1,
          P = s.zF + 0.1;
        for (let I = 0; I < T.count; I++) {
          let k = T.getX(I),
            D = T.getY(I),
            L = T.getZ(I);
          if (Math.abs(k) > 0.06 || L < C || L > P) continue;
          let q = Math.min(A - 1, Math.floor(((L - C) / (P - C)) * A));
          D > F[q] && (F[q] = D);
        }
        {
          let I = [0, 1, 2, 3].map(() => ({ x: 0, z: 0, n: 0, x0: 9, x1: -9, z0: 9, z1: -9, y0: 9 }));
          for (let D = 0; D < T.count; D++) {
            let L = T.getY(D);
            if (L > s.hip * 0.16) continue;
            let q = T.getX(D),
              $ = T.getZ(D),
              te = ($ > s.zMid ? 0 : 2) + (q > 0 ? 1 : 0),
              Y = I[te];
            ((Y.x += q),
              (Y.z += $),
              Y.n++,
              (Y.x0 = Math.min(Y.x0, q)),
              (Y.x1 = Math.max(Y.x1, q)),
              (Y.z0 = Math.min(Y.z0, $)),
              (Y.z1 = Math.max(Y.z1, $)),
              (Y.y0 = Math.min(Y.y0, L)));
          }
          w.paws = I.map((D, L) => ({
            x: D.n ? D.x / D.n : 0,
            z: D.n ? D.z / D.n : 0,
            w: D.x1 - D.x0,
            d: D.z1 - D.z0,
            y0: D.y0,
            front: L < 2,
            side: L % 2 ? 1 : -1,
          }));
          let k = [];
          for (let D = 0; D < 4; D++) {
            let L = new J();
            ((L.matrixAutoUpdate = !1), p.add(L), k.push(L));
          }
          w.pawSlots = k;
        }
        w.backY = (I) => F[Math.max(0, Math.min(A - 1, Math.floor(((I - C) / (P - C)) * A)))];
      }
      let _ = s.H / 1.15;
      (v.head.position.set(-0.08 * _, 1.12 * _, 0.42 * _),
        (v.head.rotation.y = -0.33),
        v.neck.position.set(-0.03 * _, 0.71 * _, 0.33 * _),
        (v.neck.rotation.x = -0.69));
      let S = -0.33,
        M = s.H / 1.15;
      (v.eyes.position.set(-0.214 * M, 0.934 * M, 0.55 * M),
        (v.eyes.rotation.y = S),
        v.face.position.set(-0.235 * M, 0.835 * M, 0.62 * M),
        (v.face.rotation.y = S));
      for (let T in v) p.add(v[T]);
      w.slots = v;
    }
    return w;
  }
  var dp = null;
  async function Po(i) {
    return h7(await d7(i));
  }
  function h7(i) {
    let e = [];
    i.scene.traverse((t) => {
      t.isLight && e.push(t);
    });
    for (let t of e) t.removeFromParent();
    return i;
  }
  async function d7(i) {
    if (i.startsWith("data:")) {
      let e = i.slice(i.indexOf(",") + 1),
        t = atob(e),
        n = new Uint8Array(t.length);
      for (let s = 0; s < t.length; s++) n[s] = t.charCodeAt(s);
      return new s0().setMeshoptDecoder(Ng).parseAsync(n.buffer, "");
    }
    return new s0().setMeshoptDecoder(Ng).loadAsync(i);
  }
  var f7 = 8;
  function u7(i, e) {
    let t = i.getAttribute("color"),
      n = t.count,
      s = new Float32Array(n * 3),
      o = e.map((a) => new ae(a));
    for (let a = 0; a < n; a++) {
      let c = Math.min(f7 - 1, Math.round((t.getX(a) * (t.normalized ? 1 : 0.00392156862745098) * 255) / 25)),
        l = o[c];
      ((s[a * 3] = l.r), (s[a * 3 + 1] = l.g), (s[a * 3 + 2] = l.b));
    }
    let r = new qe();
    return (
      r.setAttribute("position", i.getAttribute("position")),
      r.setAttribute("normal", i.getAttribute("normal")),
      i.index && r.setIndex(i.index),
      r.setAttribute("color", new Je(s, 3)),
      r
    );
  }
  function p7(i) {
    let e = dp.parts,
      t = [i.fur, 1971732, 5913122, i.pants, i.hat ?? 15909424, i.shirt, 8378088, i.belly],
      n = new X({ vertexColors: !0, roughness: 0.7, metalness: 0 }),
      s = new J(),
      o = new J(),
      r = new J();
    s.add(o);
    let a = (f, d) => {
        let u = new R(u7(f, t), n);
        if (((u.castShadow = !0), (u.receiveShadow = !0), !d)) return (o.add(u), u);
        let p = new J();
        return (p.position.copy(d), u.position.copy(d).multiplyScalar(-1), p.add(u), o.add(p), p);
      },
      c = dp.H / 2.098;
    a(e.body);
    let l = [a(e.armL, new H(-0.27 * c, 1.4 * c, 0)), a(e.armR, new H(0.27 * c, 1.4 * c, 0))],
      h = [a(e.legL, new H(-0.1 * c, 0.74 * c, 0)), a(e.legR, new H(0.1 * c, 0.74 * c, 0))];
    return (
      r.position.set(0, 1.75 * c, 0),
      o.add(r),
      s.scale.setScalar(i.scale ?? 1),
      {
        root: s,
        body: o,
        head: r,
        legs: h,
        arms: l,
        eyes: [],
        quad: !1,
        t: Math.random() * 10,
        blink: Math.random() * 3,
        yaw: 0,
        height: dp.H * (i.scale ?? 1),
      }
    );
  }
  var fp = [];
  function m7(i) {
    let e = fp[i % fp.length],
      t = kc(e.scene),
      n = (p) => {
        let m = Math.sin((i + 1) * 91.7 + p * 13.3) * 43758.5;
        return m - Math.floor(m);
      },
      s = [0, n(1), n(2), n(3)],
      o = n(4);
    t.traverse((p) => {
      let m = p;
      if (!m.isMesh) return;
      ((m.castShadow = !0), (m.receiveShadow = !0), (m.frustumCulled = !1));
      let E = m.name.toLowerCase(),
        g = /hair/.test(E)
          ? 3
          : /pants|shorts|skirt|trousers/.test(E)
            ? 2
            : /shirt|jacket|vest|outwear|top|dress|costume|coat|suit|hat/.test(E)
              ? 1
              : 0;
      if (!g || i < fp.length) return;
      let y = m.material.clone();
      m.material = y;
      let x = g === 3 ? 0 : s[g] * Math.PI * 2,
        b = g === 3 ? 0.35 + o * 0.9 : 1;
      y.onBeforeCompile = (w) => {
        ((w.uniforms.uHue = { value: x }),
          (w.uniforms.uDarken = { value: b }),
          (w.fragmentShader =
            `uniform float uHue, uDarken;
` +
            w.fragmentShader.replace(
              "#include <map_fragment>",
              `#include <map_fragment>
        { vec3 c = diffuseColor.rgb; float cs = cos(uHue), sn = sin(uHue);
          mat3 H = mat3(0.299 + 0.701 * cs + 0.168 * sn, 0.587 - 0.587 * cs + 0.330 * sn, 0.114 - 0.114 * cs - 0.497 * sn,
                        0.299 - 0.299 * cs - 0.328 * sn, 0.587 + 0.413 * cs + 0.035 * sn, 0.114 - 0.114 * cs + 0.292 * sn,
                        0.299 - 0.300 * cs + 1.250 * sn, 0.587 - 0.588 * cs - 1.050 * sn, 0.114 + 0.886 * cs - 0.203 * sn);
          diffuseColor.rgb = clamp(c * H, 0.0, 1.0) * uDarken; }`,
            )));
      };
    });
    let r = new J(),
      a = new J(),
      c = new J();
    (r.add(a), a.add(t), (c.position.y = 1.7), a.add(c));
    let l = new dr(t),
      h = {};
    for (let p of e.clips) h[p.name] = l.clipAction(p);
    let f = "",
      d = {
        mixer: l,
        mood: Math.random() < 0.25 ? "happy" : "idle",
        set: (p, m) => {
          let E = h[p] ?? h.idle;
          if ((p === "walk" && E && (E.timeScale = Math.max(0.7, Math.min(1.6, m / 1.6))), f === p || !E)) return;
          let g = h[f];
          (E.reset().setEffectiveWeight(1).fadeIn(0.25).play(), g && g.fadeOut(0.25), (f = p));
        },
      };
    l.update(Math.random() * 3);
    let u = {
      root: r,
      body: a,
      head: c,
      legs: [],
      arms: [],
      eyes: [],
      quad: !1,
      t: Math.random() * 10,
      blink: 9,
      yaw: 0,
      height: 1.75,
    };
    return ((u.person = d), d.set("idle", 0), u);
  }
  var up = {};
  async function $g(i) {
    try {
      let e = await Po(i);
      for (let t of e.scene.children) {
        let n = t.name.split("_")[0].toLowerCase(),
          s = e.animations
            .filter((o) => o.name.toLowerCase().startsWith(n))
            .map((o) => {
              let r = o.clone();
              return ((r.name = o.name.split("_").pop().toLowerCase()), r);
            });
        up[n] = { rig: t, clips: s };
      }
      return Object.keys(up);
    } catch (e) {
      return (console.warn("animals", e), []);
    }
  }
  var Xg = (i) => !!up[i];
  function Yg(i, e) {
    let t = up[i],
      n = kc(t.rig);
    (n.position.set(0, 0, 0), n.updateMatrixWorld(!0));
    let s = new mt().setFromObject(n),
      o = e / Math.max(0.01, s.max.y - s.min.y);
    (n.scale.multiplyScalar(o),
      (n.position.y = -s.min.y * o),
      n.traverse((p) => {
        let m = p;
        m.isMesh && ((m.castShadow = !0), (m.receiveShadow = !0), (m.frustumCulled = !1));
      }));
    let r = new J(),
      a = new J(),
      c = new J();
    (r.add(a), a.add(n), (c.position.y = e), a.add(c));
    let l = new dr(n),
      h = {};
    for (let p of t.clips) h[p.name] = l.clipAction(p);
    let f = "",
      d = {
        mixer: l,
        mood: h.eat && Math.random() < 0.5 ? "eat" : "idle",
        set: (p, m) => {
          let E = p;
          p === "walk" && m > 3.2 && h.run && (E = "run");
          let g = h[E] ?? h.idle;
          if (
            !g ||
            (E === "walk" && (g.timeScale = Math.max(0.6, Math.min(1.8, m / 1.3))),
            E === "run" && (g.timeScale = Math.max(0.7, Math.min(1.6, m / 4.5))),
            f === E)
          )
            return;
          let y = h[f];
          (g.reset().fadeIn(0.2).play(), y && y.fadeOut(0.2), (f = E));
        },
      };
    l.update(Math.random() * 2);
    let u = {
      root: r,
      body: a,
      head: c,
      legs: [],
      arms: [],
      eyes: [],
      quad: !0,
      t: Math.random() * 10,
      blink: 9,
      yaw: 0,
      height: e,
    };
    return ((u.person = d), d.set("idle", 0), u);
  }
  var ko = null;
  async function Dy(i) {
    try {
      return ((ko = (await Po(i)).scene), g7(ko), !0);
    } catch (e) {
      return (console.warn("cute", e), !1);
    }
  }
  function g7(i) {
    i.updateMatrixWorld(!0);
    let e = new Oe().copy(i.matrixWorld).invert(),
      t = new mt(),
      n = new H(),
      s = new H(),
      o = [];
    i.traverse((r) => {
      let a = r;
      a.isMesh &&
        (t.setFromObject(a).applyMatrix4(e),
        !t.isEmpty() &&
          (t.getCenter(n),
          t.getSize(s),
          (n.y > 2.2 || n.y < -0.5 || Math.hypot(n.x, n.z) > 1.2 || Math.max(s.x, s.y, s.z) > 2.2) && o.push(a)));
    });
    for (let r of o) r.removeFromParent();
    o.length &&
      console.info(
        "cute: ตัดชิ้นลอย",
        o.map((r) => r.name).join(","),
      );
  }
  var mr = () => !!ko,
    Jn = (i, e) => i[Math.floor(e * i.length) % i.length],
    Ji = (i, e, t) => Array.from({ length: t - e + 1 }, (n, s) => `${i}${String(e + s).padStart(2, "0")}`),
    E7 = ["Usual_01", "Usual_02", "Happy_01", "Happy_02", "Neutral_01", "Neutral_02"],
    b7 = [
      "Love_01",
      "Surpriced_01",
      "Surpriced_02",
      "Tongue_01",
      "Confuse_01",
      "Sad_01",
      "Shout_01",
      "Evil_01",
      "Angry_01",
      "Cry_01",
      "Evil_02",
      "Sad_02",
    ],
    x7 = [
      [1, 3],
      [2, 4],
      [4, 4],
      [5, 4],
      [6, 2],
      [7, 3],
      [8, 2],
      [9, 5],
      [10, 5],
      [11, 6],
      [12, 3],
      [13, 2],
      [14, 3],
    ].map(([i, e]) => Ji(`Costume_${i}_`, 1, e)),
    y7 = Ji("Hat_", 1, 59).filter((i) => !["Hat_45", "Hat_52", "Hat_57"].includes(i)),
    M7 = [
      "Glasses_01",
      "Glasses_03",
      "Glasses_08",
      "Glasses_11",
      "Glasses_18",
      "Glasses_19",
      "Glasses_20",
      "Glasses_21",
    ];
  function Hh(i, e = !1) {
    let t = (a) => {
        let c = Math.sin((i + 1) * 78.233 + a * 12.9898) * 43758.5453;
        return c - Math.floor(c);
      },
      n =
        t(1) < 0.86
          ? Jn(["09", "10", "11", "12", "13"], t(2))
          : Jn(["01", "02", "03", "04", "05", "06", "07", "08", "14", "15", "16"], t(2)),
      s = t(3) < 0.5,
      o = `${s ? "Female" : "Male"}_Emotion_${t(4) < 0.82 ? Jn(E7, t(5)) : Jn(b7, t(5))}`,
      r = [`Body_${n}`, `Ears_${n}`, o];
    if (!e && t(9) < 0.12) {
      let a = Jn(x7, t(10));
      return [...r, ...a, Jn(Ji("Shoe_Sneakers_", 1, 15), t(11))];
    }
    if ((r.push(Jn(s ? Ji("Hairstyle_Female_", 1, 12) : Ji("Hairstyle_Male_", 1, 18), t(6))), t(7) < 0.14))
      r.push(Jn(Ji("Outfit_", 1, 9), t(8)));
    else {
      r.push(Jn(Ji("Outwear_", 1, 56), t(8)));
      let a = t(20) < 0.2;
      (r.push(Jn(a ? Ji("Shorts_", 1, 3) : Ji("Pants_", 1, 15), t(21))),
        a && t(22) < 0.6 && r.push(Jn(Ji("Socks_", 1, 3), t(23))));
    }
    return (
      r.push(t(12) < 0.75 ? Jn(Ji("Shoe_Sneakers_", 1, 15), t(13)) : Jn(Ji("Shoe_Slippers_", 1, 7), t(13))),
      t(14) < 0.38 ? r.push(Jn(y7, t(15))) : t(14) < 0.45 && r.push("Headphones_02"),
      t(16) < 0.28 && r.push(Jn(M7, t(17))),
      !s && t(18) < 0.22 && r.push(t(19) < 0.8 ? Jn(Ji("Mustache_", 1, 15), t(24)) : Jn(Ji("Beard_", 1, 3), t(24))),
      s && t(25) < 0.3 && r.push("Earrings_01"),
      t(26) < 0.08 && r.push(Jn(Ji("Gloves_", 1, 12), t(27))),
      !e && t(28) < 0.03 && r.push(Jn(["Clown_nose_01", "Bandage_01", "Mask_01", "Mask_02"], t(29))),
      r
    );
  }
  var T7 = new At(),
    w7 = new At(),
    v7 = new H(1, 0, 0),
    R7 = new H(0, 0, 1),
    _7 = new H(0, 1, 0),
    By = 0,
    vh = null;
  function S7() {
    if (vh) return vh;
    vh = {};
    for (let [i, e] of Object.entries(xy)) {
      let t = [];
      for (let [n, [s, o]] of Object.entries(e.t))
        if (n.endsWith(".quaternion")) t.push(new Fs(n, s, o));
        else {
          let r = o.slice();
          for (let a = 0; a < r.length; a += 3) ((r[a] = o[0]), (r[a + 2] = o[2]));
          t.push(new zs(n, s, r));
        }
      vh[i] = new to(i, e.d, t);
    }
    return vh;
  }
  function Zr(i, e = 1.5) {
    let t = i ?? Hh(By++ * 7 + 3),
      n = kc(ko),
      s = t.find((S) => S.includes("_Emotion_")) ?? "",
      o = s.startsWith("Female") ? "Female_Emotion_" : "Male_Emotion_",
      r = s
        ? ["Surpriced_01", "Shout_01", "Happy_01", "Happy_02", "Love_01"].map((S) => o + S).filter((S) => S !== s)
        : [],
      a = new Set([...t, ...r]),
      c = [];
    n.traverse((S) => {
      if (S.isBone) return;
      let M = S;
      if (!M.isMesh) return;
      (a.has(M.name) ? M.name : a.has(M.parent?.name ?? "") ? M.parent.name : "")
        ? ((M.castShadow = !0), (M.receiveShadow = !0), (M.frustumCulled = !1))
        : c.push(M);
    });
    for (let S of c) S.removeFromParent();
    n.updateMatrixWorld(!0);
    let l = e / 1.16;
    n.scale.setScalar(l);
    let h = new J(),
      f = new J(),
      d = new J();
    (h.add(f), f.add(n), (d.position.y = e), f.add(d));
    let u = new At(),
      p = {};
    (n.updateMatrixWorld(!0),
      n.getWorldQuaternion(u).invert(),
      n.traverse((S) => {
        let M = S;
        if (
          !M.isBone ||
          !/^(LeftArm|RightArm|LeftForeArm|RightForeArm|LeftUpLeg|RightUpLeg|LeftLeg|RightLeg|Spine|Head|Hips)$/.test(
            M.name,
          ) ||
          p[M.name]
        )
          return;
        let T = new At();
        (M.parent.getWorldQuaternion(T),
          T.premultiply(u),
          (p[M.name] = { b: M, rest: M.quaternion.clone(), pq: T, pqi: T.clone().invert() }));
      }));
    let m = new dr(n),
      E = {};
    for (let [S, M] of Object.entries(S7())) E[S] = m.clipAction(M);
    let g = "",
      y = (S) => {
        if (g === S || !E[S]) return;
        let M = E[S],
          T = E[g];
        (M.reset().setEffectiveWeight(1).fadeIn(0.25).play(), T && T.fadeOut(0.25), (g = S));
      },
      x = {
        mixer: m,
        mood: Math.random() < 0.3 ? "happy" : "idle",
        set: (S, M) => {
          if (S === "walk") {
            let T = M > 2.6;
            (y(T ? "run" : "walk"),
              (E[g].timeScale = T ? Math.min(1.4, M / 3.2) : Math.max(0.7, Math.min(1.5, M / 1.5))));
          } else y(S === "happy" ? "look" : "idle");
        },
      };
    (x.set("idle", 0), m.update(Math.random() * 4));
    let b = {
      root: h,
      body: f,
      head: d,
      legs: [],
      arms: [],
      eyes: [],
      quad: !1,
      t: Math.random() * 10,
      blink: 9,
      yaw: 0,
      height: e,
    };
    ((b.person = x), (b.bones = p));
    let w = {};
    n.traverse((S) => {
      let M = S;
      if (!M.isMesh) return;
      let T = a.has(M.name) ? M.name : (M.parent?.name ?? "");
      T.includes("_Emotion_") && (w[T] ?? (w[T] = [])).push(M);
    });
    let v = (S) => {
      w[S] || (S = s);
      for (let M in w) for (let T of w[M]) T.visible = M === S;
    };
    v(s);
    let _ = {
      talk: 0,
      t: 0,
      nx: 0,
      open: !1,
      of: s,
      cur: s,
      smileT: 4 + Math.random() * 8,
      smile: 0,
      sf: s,
      update(S) {
        if (!s) return;
        _.t += S;
        let M = s;
        (_.talk > 0
          ? ((_.talk -= S),
            (_.nx -= S),
            _.nx <= 0 &&
              ((_.open = !_.open),
              (_.nx = _.open ? 0.28 + Math.random() * 0.22 : 0.32 + Math.random() * 0.35),
              (_.of = Math.random() < 0.75 ? o + "Happy_02" : o + "Surpriced_01")),
            (M = _.open && _.talk > 0.25 ? _.of : s.includes("Happy") ? s : o + "Happy_01"))
          : ((_.smileT -= S),
            _.smileT <= 0 &&
              ((_.smile = 1.2 + Math.random() * 1.5),
              (_.smileT = 5 + Math.random() * 9),
              (_.sf = o + ["Happy_01", "Happy_02", "Love_01"][Math.floor(Math.random() * 3)])),
            _.smile > 0 && ((_.smile -= S), (M = _.sf))),
          M !== _.cur && ((_.cur = M), v(M)));
      },
    };
    return ((b.face = _), b);
  }
  function Zg(i, e = 2.4) {
    let t = i.face;
    t && (t.talk = Math.max(t.talk, e));
  }
  function Ah(i, e) {
    let t = i.person;
    t && (t.mood = e);
  }
  function r0(i, e, t = "bottom") {
    let n = new J();
    if (!ko) return n;
    let s = null;
    if (
      (ko.traverse((f) => {
        !s && f.isMesh && (f.name === i || f.parent?.name === i) && (s = f);
      }),
      !s)
    )
      return n;
    let o = s,
      r = new R(o.geometry, o.material);
    ((r.castShadow = !0), o.geometry.computeBoundingBox());
    let a = o.geometry.boundingBox,
      c = a.getCenter(new H()),
      l = a.getSize(new H()),
      h = e / Math.max(0.01, l.x);
    return (
      r.scale.setScalar(h),
      r.position.set(-c.x * h, (t === "bottom" ? -a.min.y : -c.y) * h, -c.z * h),
      n.add(r),
      n
    );
  }
  var Oy = {
      rott: {
        rot: [0, Math.PI, 0],
        h: 1.55,
        legTop: 0.42,
        pat: 0,
        name: "ร็อตไวเลอร์",
      },
      doberman: {
        rot: [-Math.PI / 2, 0, 0],
        h: 1.65,
        legTop: 0.45,
        pat: 0,
        name: "โดเบอร์แมน",
      },
      pitt: { rot: [0, 0, 0], h: 0.62, legTop: 0.38, pat: 1, name: "พิทบูล" },
      labrador: {
        rot: [-Math.PI / 2, 0, 0],
        h: 0.8,
        legTop: 0.42,
        pat: 2,
        name: "ลาบราดอร์",
      },
      chihuahua: {
        rot: [-Math.PI / 2, 0, 0],
        h: 0.34,
        legTop: 0.4,
        pat: 3,
        name: "ชิวาวา",
      },
      redpanda: {
        rot: [-Math.PI / 2, 0, 0],
        h: 0.5,
        legTop: 0.36,
        pat: 6,
        name: "แพนด้าแดง",
      },
    },
    pp = {};
  async function Ny(i) {
    return (
      await Promise.all(
        Object.entries(Oy).map(async ([e, t]) => {
          try {
            let n = await Po(i(e)),
              s = null;
            if (
              (n.scene.traverse((l) => {
                !s && l.isMesh && (s = l);
              }),
              !s)
            )
              return;
            let o = s.geometry.clone();
            n.scene.updateMatrixWorld(!0);
            for (let l of Object.keys(o.attributes)) l !== "position" && o.deleteAttribute(l);
            if (o.attributes.position.normalized || !(o.attributes.position.array instanceof Float32Array)) {
              let l = o.attributes.position,
                h = new Float32Array(l.count * 3);
              for (let f = 0; f < l.count; f++)
                ((h[f * 3] = l.getX(f)), (h[f * 3 + 1] = l.getY(f)), (h[f * 3 + 2] = l.getZ(f)));
              o.setAttribute("position", new Je(h, 3));
            }
            (o.applyMatrix4(s.matrixWorld),
              o.rotateX(t.rot[0]),
              o.rotateY(t.rot[1]),
              o.rotateZ(t.rot[2]),
              o.computeBoundingBox());
            let r = o.boundingBox,
              a = r.getCenter(new H());
            (o.translate(-a.x, -r.min.y, -a.z), o.computeBoundingBox(), (r = o.boundingBox));
            let c = t.h / (r.max.y - r.min.y);
            (o.scale(c, c, c),
              o.computeBoundingBox(),
              (r = o.boundingBox),
              o.computeVertexNormals(),
              (pp[e] = { geo: o, H: r.max.y, L: r.max.z - r.min.z, W: r.max.x - r.min.x }));
          } catch (n) {
            console.warn("beast", e, n);
          }
        }),
      ),
      Object.keys(pp)
    );
  }
  var Kg = (i) => !!pp[i],
    H7 = `
  vec3 beastColor(vec3 o){ // o = (x/W, y/H, z/L) โดย z>0 = หัว
    float h = o.y, f = o.z, s = o.x;
    if (uPat == 0) { vec3 c = vec3(0.07,0.06,0.06); vec3 tan = vec3(0.62,0.34,0.14);
      float t = step(h, 0.16) + step(0.42, f) * step(0.48, h) * step(h, 0.78) + step(0.28, f) * step(0.34, h) * step(h, 0.5) * step(abs(s), 0.18);
      return mix(c, tan, clamp(t, 0.0, 1.0)); }
    if (uPat == 1) { vec3 c = vec3(0.42,0.44,0.5); float w = step(0.2, f) * step(0.12, h) * step(h, 0.56) * step(abs(s), 0.22) + step(h, 0.07); return mix(c, vec3(0.95,0.93,0.9), clamp(w,0.0,1.0)); }
    if (uPat == 2) { vec3 c = vec3(0.88,0.7,0.42); return mix(c, vec3(0.12,0.08,0.06), step(0.485, f) * step(0.55, h)); }
    if (uPat == 3) { vec3 c = vec3(0.86,0.6,0.34); return mix(c, vec3(0.97,0.88,0.74), step(h, 0.42) * step(abs(s), 0.25)); }
    if (uPat == 4) { vec3 c = vec3(0.45,0.25,0.12); c = mix(c, vec3(0.16,0.1,0.07), step(h, 0.18)); c = mix(c, vec3(0.05), step(h, 0.035)); c = mix(c, vec3(0.1,0.07,0.05), step(0.18, f) * step(0.72, h) * step(abs(s), 0.12)); return c; }
    if (uPat == 5) { vec3 c = vec3(0.93,0.88,0.79); float n = sin(o.x*31.0+o.y*17.0)*sin(o.z*23.0+o.y*11.0); return mix(c, vec3(0.62,0.44,0.28), step(0.55, n) * step(0.2, h)); }
    if (uPat == 6) { vec3 c = vec3(0.74,0.3,0.12); c = mix(c, vec3(0.12,0.07,0.05), step(h, 0.34)); c = mix(c, vec3(0.97,0.95,0.92), step(0.4, f) * step(0.55, h) * step(0.06, abs(s)) * 0.85); c = mix(c, vec3(0.5,0.18,0.08), step(f, -0.3) * step(0.0, sin(f*70.0))); return c; }
    if (uPat == 7) { float st = sin(f*44.0 + sin(h*7.0)*1.8 + s*4.0); float leg = sin(h*80.0); float k = h < 0.42 ? step(0.0, leg) : step(0.15, st); k *= 1.0 - step(0.47, f) * step(0.62, h) * 0.6; return mix(vec3(0.96,0.95,0.92), vec3(0.06), k); }
    if (uPat == 8) { vec3 p = vec3(o.x*2.6, o.y*9.0, o.z*7.0); vec3 i = floor(p), fr = fract(p); float d = 9.0;
      for (int x=-1;x<=1;x++) for (int y=-1;y<=1;y++) for (int z=-1;z<=1;z++) { vec3 g = vec3(float(x),float(y),float(z)); vec3 r = g + fract(sin(vec3(dot(i+g,vec3(127.1,311.7,74.7)),dot(i+g,vec3(269.5,183.3,246.1)),dot(i+g,vec3(113.5,271.9,124.6))))*43758.5) - fr; d = min(d, dot(r,r)); }
      vec3 c = mix(vec3(0.62,0.34,0.12), vec3(0.97,0.88,0.64), smoothstep(0.22, 0.32, d)); return mix(c, vec3(0.97,0.9,0.72), step(h, 0.12)); }
    return vec3(0.8); }`;
  function Kr(i) {
    let e = pp[i],
      t = Oy[i],
      n = {
        uT: { value: Math.random() * 6 },
        uWalk: { value: 0 },
        uLegTop: { value: e.H * t.legTop },
        uCZ: { value: 0 },
        uDim: { value: new H(e.W, e.H, e.L) },
        uPat: { value: t.pat },
      },
      lu = ccsLifeUni(-e.L / 2, e.L / 2, e.H, e.H * t.legTop),
      s = new X({ roughness: 0.85, metalness: 0 });
    s.onBeforeCompile = (d) => {
      (Object.assign(d.uniforms, n, lu),
        (d.vertexShader =
          `uniform float uT, uWalk, uLegTop, uCZ; uniform vec3 uDim; varying vec3 vO;
${ccsLifeGL}
` +
          d.vertexShader.replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
      vO = vec3(position.x / uDim.x, position.y / uDim.y, position.z / uDim.z);
      { float w = smoothstep(uLegTop, uLegTop * 0.5, position.y);
        float front = step(uCZ, position.z), left = step(0.0, position.x);
        float off = abs(front - left) * 3.14159;
        float a = sin(uT + off) * 0.5 * uWalk; float d = max(0.0, uLegTop - position.y);
        transformed.z += d * sin(a) * w; transformed.y += d * (1.0 - cos(a)) * w * 0.4 + abs(sin(uT)) * 0.012 * uDim.y * uWalk;
        transformed = ccsLife(transformed); }`,
          )),
        (d.fragmentShader =
          `uniform int uPat; varying vec3 vO;
` +
          H7 +
          `
` +
          d.fragmentShader.replace(
            "vec4 diffuseColor = vec4( diffuse, opacity );",
            "vec4 diffuseColor = vec4( beastColor(vO), opacity );",
          )));
    };
    let o = new R(e.geo, s);
    ((o.castShadow = !0), (o.receiveShadow = !0));
    let r = new J(),
      a = new J(),
      c = new J();
    (r.add(a), a.add(o), (c.position.y = e.H), a.add(c));
    let l = 0,
      h = {
        mixer: {
          update: (d) => {
            ((n.uT.value += d * (l > 0.05 ? 3 + l * 2.2 : 0)),
              (n.uWalk.value += ((l > 0.05 ? 1 : 0) - n.uWalk.value) * Math.min(1, d * 6)));
          },
        },
        mood: "idle",
        set: (d, u) => {
          l = d === "walk" ? u : 0;
        },
      },
      f = { root: r, body: a, head: c, legs: [], arms: [], eyes: [], quad: !0, t: 0, blink: 9, yaw: 0, height: e.H, lu };
    return ((f.person = h), f);
  }
  // v109: สัตว์เลี้ยงโมเดลมีเท็กซ์เจอร์จริง (ลาบราดอร์ ฟาโรห์ แมว ลูกบูลด็อก) เดินด้วยการแกว่งขาในเชเดอร์แบบเดียวกับ Kr
  // ===== v131: ชีวิตชีวาของหมาทุกสายพันธุ์ (โมเดลจริง/โมเดลสร้าง) — หัวหัน/ก้ม/เอียง หางกระดิก/ชี้ นั่ง หมอบ โค้งชวนเล่น หายใจ + เห่าตามขนาดตัว =====
  // ทำงานในพิกัดโมเดล: +z = หัว (ทิศที่เดิน), y = สูง · uBox = (zmin, zmax, H, legTop)
  var ccsLifeGL = `
uniform mat4 uToM, uFromM; uniform vec4 uBox, uLHead, uLTail, uLPose;
vec3 ccsRotY(vec3 v, float a){ float c = cos(a), s = sin(a); return vec3(v.x*c + v.z*s, v.y, -v.x*s + v.z*c); }
vec3 ccsRotX(vec3 v, float a){ float c = cos(a), s = sin(a); return vec3(v.x, v.y*c - v.z*s, v.y*s + v.z*c); }
vec3 ccsRotZ(vec3 v, float a){ float c = cos(a), s = sin(a); return vec3(v.x*c - v.y*s, v.x*s + v.y*c, v.z); }
vec3 ccsLife(vec3 p){
  float L = max(0.05, uBox.y - uBox.x), H = uBox.z, lt = uBox.w, zs = (p.z - uBox.x) / L;
  float lg = clamp(p.y / max(0.01, lt), 0.0, 1.0);            // 0 ที่เท้า → 1 ที่ลำตัว
  // ท่าทาง: นั่ง (ก้นลง) · หมอบ (ทั้งตัวลง) · โค้งชวนเล่น (อกลง ก้นชี้)
  float rear = 1.0 - smoothstep(0.15, 0.6, zs), front = smoothstep(0.42, 0.85, zs);
  float drop = lt * (0.78 * uLPose.x * rear + 0.82 * uLPose.y + 0.6 * uLPose.z * front);
  p.y -= drop * lg;
  p.z += L * (0.14 * uLPose.x * rear * (1.0 - lg) + 0.12 * uLPose.y * (1.0 - lg) * (front * 2.0 - 1.0) * step(0.5, front + rear));
  p.y += H * 0.06 * uLPose.x * front * lg;
  p.x *= 1.0 + uLPose.w * smoothstep(0.25, 0.55, zs) * (1.0 - smoothstep(0.62, 0.75, zs)) * lg;   // หายใจ (อกขยาย)
  // หัว: หมุนรอบคอ
  float hw = smoothstep(0.66, 0.8, zs) * smoothstep(0.34 * H, 0.52 * H, p.y + drop * lg);
  vec3 pv = vec3(0.0, 0.62 * H - drop * front, uBox.x + 0.72 * L);
  vec3 q = p - pv; q = ccsRotZ(q, uLHead.z); q = ccsRotX(q, uLHead.y); q = ccsRotY(q, uLHead.x);
  p = mix(p, pv + q, hw);
  // หาง: กระดิกซ้าย-ขวา + ยก/ลด
  float tw = (1.0 - smoothstep(0.03, 0.16, zs)) * smoothstep(0.32 * H, 0.5 * H, p.y + drop * lg);
  vec3 pt = vec3(0.0, 0.6 * H - drop * rear, uBox.x + 0.1 * L);
  vec3 r = p - pt; r = ccsRotX(r, -uLTail.y); r = ccsRotY(r, uLTail.x);
  p = mix(p, pt + r, tw);
  return p;
}`;
  function ccsLifeUni(zmin, zmax, H, lt) {
    return {
      uToM: { value: new Oe() },
      uFromM: { value: new Oe() },
      uBox: { value: new Kt(zmin, zmax, H, lt) },
      uLHead: { value: new Kt() },
      uLTail: { value: new Kt() },
      uLPose: { value: new Kt() },
    };
  }
  // เสียงเห่าตามขนาดตัว (ตัวเล็กเสียงแหลม ตัวใหญ่เสียงทุ้ม) ดังเบาตามระยะห่างจากกล้อง
  var ccsBarkCd = 0;
  function ccsBarkAt(i, e, t = 1) {
    let n = _i();
    if (!n || !Dh || !i) return;
    let s = Lt.position.distanceTo(i);
    if (s > 22 || performance.now() < ccsBarkCd) return;
    ccsBarkCd = performance.now() + 2200; // ไม่ให้เห่ากันระงม
    let o = Math.max(0.62, Math.min(1.75, 1.32 - (e - 0.6) * 0.55)) * (0.95 + Math.random() * 0.1),
      r = 0.85 * Math.max(0.08, 1 - s / 22);
    for (let a = 0; a < t; a++) {
      let c = n.createBufferSource();
      ((c.buffer = Dh), (c.playbackRate.value = o * (a ? 0.97 : 1)));
      let l = n.createGain();
      l.gain.value = r * (a ? 0.85 : 1);
      let h = n.createStereoPanner ? n.createStereoPanner() : null;
      if (h) {
        let f = i.clone().sub(Lt.position),
          d = new H(1, 0, 0).applyQuaternion(Lt.quaternion);
        h.pan.value = Math.max(-0.8, Math.min(0.8, f.normalize().dot(d)));
        c.connect(l).connect(h).connect(n.destination);
      } else c.connect(l).connect(n.destination);
      c.start(n.currentTime + 0.01 + a * (0.28 / o), 0.1, 0.34);
    }
  }
  // สมองพฤติกรรม (ใช้กับหมา NPC/ในคอก/เพื่อนเดินตาม): สุ่มท่าเมื่อหยุด ตื่นเต้นเมื่อน้องเข้าใกล้
  var ccsLifeAct = [
    ["look", 3], ["sniff", 3], ["sit", 2.2], ["lie", 1.3], ["bow", 1], ["shake", 0.8], ["bark", 1.1], ["tilt", 1], ["yawn", 0.7], ["scratch", 0.7],
  ];
  function ccsLifeTick(i, e, t) {
    let n = i.life;
    if (!n) return;
    let s = t > 0.3,
      o = i.root.getWorldPosition(ccsLifeV),
      r = Le[0]?.pos,
      a = r ? Math.hypot(r.x - o.x, r.z - o.z) : 99,
      c = a < 3.2;
    n.t -= e;
    if (s) (n.act !== "walk" && ((n.act = "walk"), (n.t = 0)));
    else if (n.t <= 0 || n.act === "walk") {
      // เลือกท่าใหม่: ถ้าน้องอยู่ใกล้ มักจะหันมามอง กระดิกหางแรง โค้งชวนเล่น หรือเห่าทัก
      let l = c ? [["happy", 5], ["bow", 2], ["bark", 1.6], ["sit", 1.5], ["tilt", 1.5]] : ccsLifeAct,
        h = l.reduce((d, u) => d + u[1], 0) * Math.random(),
        f = l[0][0];
      for (let [d, u] of l) if ((h -= u) <= 0) {
        f = d;
        break;
      }
      ((n.act = f), (n.t = { sit: 4 + Math.random() * 5, lie: 6 + Math.random() * 8, bow: 1.6, shake: 0.9, bark: 1.2, yawn: 1.8, scratch: 2.2, happy: 2.5 + Math.random() * 2 }[f] ?? 1.5 + Math.random() * 3), (n.at = 0), (n.side = Math.random() < 0.5 ? -1 : 1));
      f === "bark" && setTimeout(() => ccsBarkAt(i.root.getWorldPosition(new H()).setY(0.5), i.height * i.root.scale.y, 1 + (Math.random() < 0.5 ? 1 : 0)), 120);
    }
    n.at = (n.at ?? 0) + e;
    let l = n.act,
      h = n.at,
      f = c && r ? ccsWrapA(Math.atan2(r.x - o.x, r.z - o.z) - i.yaw) : 0,
      d = { hy: 0, hp: 0, hr: 0, wag: 0.25, wagS: 5, tu: 0.1, sit: 0, lie: 0, bow: 0, sh: 0 };
    switch (l) {
      case "walk":
        ((d.wag = 0.35), (d.wagS = 7), (d.tu = 0.25), (d.hp = Math.sin(i.t * 7) * 0.04));
        break;
      case "look":
        d.hy = (Math.sin(h * 0.9) > 0 ? 0.75 : -0.7) * n.side;
        break;
      case "sniff":
        ((d.hp = 0.8), (d.hy = Math.sin(h * 1.7) * 0.3), (d.wag = 0.15));
        break;
      case "sit":
        ((d.sit = 1), (d.hp = -0.12), (d.hy = c ? f : Math.sin(h * 0.5) * 0.35), (d.wag = c ? 0.5 : 0.1), (d.wagS = 9));
        break;
      case "lie":
        ((d.lie = 1), (d.hp = h > 3 ? 0.18 : 0), (d.hy = Math.sin(h * 0.3) * 0.3), (d.wag = 0.05), (d.tu = -0.2));
        break;
      case "bow":
        ((d.bow = 1), (d.hp = -0.25), (d.wag = 0.7), (d.wagS = 16), (d.tu = 0.6));
        break;
      case "shake":
        d.sh = Math.sin(h * 34) * 0.22 * Math.sin(Math.min(1, h / 0.9) * Math.PI);
        break;
      case "bark":
        ((d.hp = -0.25 - Math.abs(Math.sin(h * 11)) * 0.18), (d.tu = 0.5), (d.wag = 0.3), (d.hy = c ? f : 0));
        break;
      case "tilt":
        ((d.hr = 0.38 * n.side), (d.hy = c ? f : 0.1), (d.wag = 0.3));
        break;
      case "yawn":
        ((d.hp = -0.45 * Math.sin(Math.min(1, h / 1.8) * Math.PI)), (d.tu = 0));
        break;
      case "scratch":
        ((d.sit = 0.8), (d.hr = 0.25 * n.side), (d.hp = 0.1), (d.sh = Math.sin(h * 26) * 0.04));
        break;
      case "happy":
        ((d.hy = f), (d.hp = -0.1 + Math.sin(h * 6) * 0.05), (d.wag = 0.75), (d.wagS = 18), (d.tu = 0.6), (d.hop = Math.abs(Math.sin(h * 6)) * 0.04));
        break;
    }
    d.hy = Math.max(-0.85, Math.min(0.85, d.hy));
    let u = i.lu;
    if (u) {
      // โมเดลจริง/โมเดลสร้าง: ขับ uniform ของ shader
      let p = Math.min(1, e * 5),
        m = n.k ?? (n.k = { hy: 0, hp: 0, hr: 0, wag: 0, tu: 0, sit: 0, lie: 0, bow: 0 });
      for (let E in m) m[E] += (d[E] - m[E]) * (E === "sit" || E === "lie" || E === "bow" ? Math.min(1, e * 3) : p);
      ((n.wp = (n.wp ?? 0) + e * d.wagS),
        u.uLHead.value.set(m.hy, m.hp, m.hr, 0),
        u.uLTail.value.set(Math.sin(n.wp) * m.wag, m.tu, 0, 0),
        u.uLPose.value.set(m.sit, m.lie, m.bow, Math.sin(i.t * (l === "happy" || l === "bow" ? 9 : 2.2)) * 0.03),
        (i.body.rotation.z = d.sh),
        (i.body.position.y = d.hop ?? 0));
    } else if (i.uni && i.M) {
      // หมาที่มีระบบท่าทางอยู่แล้ว (เชาเชา/พุดเดิ้ล): ส่งชื่อท่าให้ระบบเดิม
      let p = i.pose ?? (i.pose = Gy()),
        m = { look: "look", sniff: "sniff", sit: "sit", lie: "lie", bow: "bow", shake: "shake", bark: "alert", tilt: "tilt", yawn: "yawn", scratch: "scratch", happy: "happy" }[l] ?? "none";
      s || (p.want !== m && ((p.want = m), (p.t = 0), (p.side = n.side ?? 1)));
      l === "bark" && i.uni.uJaw && (i.uni.uJaw.value = Math.abs(Math.sin(h * 11)) * 1.1);
    }
  }
  var ccsLifeV = new H();
  function ccsLifeOn(i) {
    return (i && (i.lu || (i.uni && i.M)) && (i.life ??= { act: "idle", t: Math.random() * 3 }), i);
  }
  function ccsTB(i, e = 0.42, t) {
    let n = vp[i];
    if (!n) return t ? t() : null;
    let s = n.clone(!0);
    (s.position.set(0, 0, 0), s.rotation.set(0, 0, 0), s.scale.setScalar(1), s.updateMatrixWorld(!0));
    let o = new mt().setFromObject(s),
      r = o.max.y,
      a = {
        uT: { value: Math.random() * 6 },
        uWalk: { value: 0 },
        uLegTop: { value: r * e },
        uCZ: { value: (o.min.z + o.max.z) / 2 },
        uHH: { value: r },
      },
      lu = ccsLifeUni(o.min.z, o.max.z, r, r * e);
    s.traverse((u) => {
      if (!u.isMesh) return;
      ((u.castShadow = !0), (u.receiveShadow = !0), (u.frustumCulled = !1));
      // v131: แปลงพิกัด mesh → พิกัดโมเดล (บางไฟล์มี transform ซ้อน) เพื่อให้ขา/หัว/หางขยับถูกจุด
      let tm = u.matrixWorld.clone(),
        fm = tm.clone().invert();
      let p = (Array.isArray(u.material) ? u.material : [u.material]).map((m) => {
        let E = m.clone();
        return (
          (E.onBeforeCompile = (g) => {
            (Object.assign(g.uniforms, a, lu, { uToM: { value: tm }, uFromM: { value: fm } }),
              (g.vertexShader =
                `uniform float uT, uWalk, uLegTop, uCZ, uHH;
${ccsLifeGL}
` +
                g.vertexShader.replace(
                  "#include <begin_vertex>",
                  `#include <begin_vertex>
      { vec3 pm = (uToM * vec4(position, 1.0)).xyz;
        float w = smoothstep(uLegTop, uLegTop * 0.45, pm.y);
        float front = step(uCZ, pm.z), left = step(0.0, pm.x);
        float off = abs(front - left) * 3.14159;
        float a = sin(uT + off) * 0.5 * uWalk; float d = max(0.0, uLegTop - pm.y);
        pm.z += d * sin(a) * w; pm.y += d * (1.0 - cos(a)) * w * 0.4 + abs(sin(uT)) * 0.012 * uHH * uWalk;
        pm = ccsLife(pm);
        transformed = (uFromM * vec4(pm, 1.0)).xyz; }`,
                )));
          }),
          (E.customProgramCacheKey = () => "ccsTB2"),
          E
        );
      });
      u.material = Array.isArray(u.material) ? p : p[0];
    });
    let c = new J(),
      l = new J(),
      h = new J();
    (c.add(l), l.add(s), (h.position.y = r), l.add(h));
    let f = 0,
      d = {
        mixer: {
          update: (u) => {
            ((a.uT.value += u * (f > 0.05 ? 3 + f * 2.2 : 0)), (a.uWalk.value += ((f > 0.05 ? 1 : 0) - a.uWalk.value) * Math.min(1, u * 6)));
          },
        },
        mood: "idle",
        set: (u, p) => {
          f = u === "walk" ? p : 0;
        },
      };
    return { root: c, body: l, head: h, legs: [], arms: [], eyes: [], quad: !0, t: 0, blink: 9, yaw: 0, height: r, person: d, lu };
  }
  var yy = new WeakMap();
  function Jg(i) {
    let e = i.slots;
    if (!e) return null;
    let t = e.neck.parent;
    if (!t || !t.geometry) return null;
    let n = t.geometry,
      s = yy.get(n);
    if (s) return s;
    let o = new R(n, new be({ side: Ke }));
    (o.updateMatrixWorld(!0), n.boundingSphere || n.computeBoundingSphere());
    let r = new Ls(),
      a = (P, I) => {
        (r.set(P, I.clone().normalize()), (r.far = 4));
        let k = r.intersectObject(o, !1)[0];
        return k ? k.point.clone() : null;
      };
    for (let P in e) e[P].updateMatrix();
    let c = (P, I) => I.clone().applyMatrix4(P.matrix),
      l = (P, I) => I.clone().applyMatrix4(P.matrix.clone().invert()),
      h = (P, I) => I.clone().applyQuaternion(P.quaternion),
      f = e.neck,
      d = [];
    for (let P = 0; P < 48; P++) {
      let I = (P / 48) * Math.PI * 2,
        k = new H(Math.cos(I), Math.sin(I), 0),
        D = h(f, k),
        L = f.position.clone().addScaledVector(D, 0.9),
        q = a(L, D.clone().negate());
      d.push(q ? Math.max(0.14, Math.min(0.46, 0.9 - q.distanceTo(L))) : null);
    }
    for (let P = 0; P < 48; P++)
      if (d[P] === null) {
        let I = 0,
          k = 0;
        for (let D of [P - 2, P - 1, P + 1, P + 2]) {
          let L = d[(D + 48) % 48];
          L !== null && ((I += L), k++);
        }
        d[P] = k ? I / k : 0.27;
      }
    let u = d;
    for (let P = 0; P < 3; P++) u = u.map((I, k) => (u[(k + 47) % 48] + u[k] * 2 + u[(k + 1) % 48]) / 4);
    let p = u.map((P, I) => {
        let k = (I / 48) * Math.PI * 2;
        return new H(Math.cos(k), Math.sin(k), 0).multiplyScalar(P + 0.014);
      }),
      m = 9,
      E = 7,
      g = [],
      y = [],
      x = [],
      b = [];
    for (let P = 0; P < m; P++) {
      let I = Math.round(30 + (P / (m - 1)) * 12);
      b.push(c(f, p[(I + 48) % 48]));
    }
    let v = c(f, p[36])
      .clone()
      .add(new H(0, -0.3, 0.03));
    for (let P = 0; P <= E; P++)
      for (let I = 0; I < m; I++) {
        let k = P / E,
          D = b[I].clone().lerp(v, k);
        if (P > 0) {
          let q = a(new H(D.x, D.y, D.z + 0.7), new H(0, 0, -1));
          q && q.z > D.z - 0.25 && (D.z = Math.max(q.z + 0.012, D.z - 0.05));
        }
        let L = l(f, D);
        (g.push(L.x, L.y, L.z), y.push(I / (m - 1), 1 - k));
      }
    for (let P = 0; P < E; P++)
      for (let I = 0; I < m - 1; I++) {
        let k = P * m + I,
          D = k + 1,
          L = k + m,
          q = L + 1;
        x.push(k, L, D, D, L, q);
      }
    let _ = e.eyes,
      S = -9;
    for (let P of [-0.105, 0.105])
      for (let [I, k] of [
        [0, 0],
        [0.05, 0],
        [-0.05, 0],
        [0, 0.05],
        [0, -0.05],
      ]) {
        let D = c(_, new H(P + I, k, 0.6)),
          L = a(D, h(_, new H(0, 0, -1)));
        L && (S = Math.max(S, l(_, L).z));
      }
    let M = e.head,
      T = -9;
    for (let [P, I] of [
      [0, 0],
      [0.08, 0],
      [-0.08, 0],
      [0, 0.08],
      [0, -0.08],
    ]) {
      let k = c(M, new H(P, 0.7, I)),
        D = a(k, h(M, new H(0, -1, 0)));
      D && (T = Math.max(T, l(M, D).y));
    }
    let A = e.face,
      F = -9;
    for (let P of [0, 0.06, -0.06]) {
      let I = c(A, new H(P, 0, 0.6)),
        k = a(I, h(A, new H(0, 0, -1)));
      k && (F = Math.max(F, l(A, k).z));
    }
    let C = {
      ring: p,
      bib: { pos: new Float32Array(g), uv: new Float32Array(y), idx: x },
      glassZ: S > -9 ? S + 0.008 : 0.02,
      hatY: T > -9 ? T - 0.035 : 0,
      faceZ: F > -9 ? F + 0.006 : 0.02,
    };
    return (yy.set(n, C), o.material.dispose(), C);
  }
  var My = new At();
  function Ms(i, e, t) {
    !i || !t || (My.setFromAxisAngle(e, t), i.b.quaternion.premultiply(i.pqi.clone().multiply(My).multiply(i.pq)));
  }
  var _h = { sym: 2, thigh: -1.5, knee: 1.2, spine: 0.06, arm: -0.15, fore: -0.5, armDown: -1, lift: 0 };
  function A7(i, e, t) {
    e.k += ((e.on ? 1 : 0) - e.k) * Math.min(1, t * 5);
    let n = i.bones;
    if (!n) return;
    let s = e.k,
      o = [
        "Hips",
        "LeftUpLeg",
        "RightUpLeg",
        "LeftLeg",
        "RightLeg",
        "Spine",
        "RightArm",
        "RightForeArm",
        "LeftArm",
        "LeftForeArm",
      ];
    if (s < 0.002) {
      if (e.posed && e.base)
        for (let h of o) {
          let f = n[h],
            d = e.base[h];
          f && d && f.b.quaternion.copy(d);
        }
      ((e.posed = !1), (e.base = void 0), (e.hipFix = void 0), (i.body.position.y = 0));
      return;
    }
    if (!e.base) {
      e.base = {};
      for (let h of o) {
        let f = n[h];
        f && (e.base[h] = f.b.quaternion.clone());
      }
    }
    for (let h of o) {
      let f = n[h],
        d = e.base[h];
      f && d && f.b.quaternion.copy(d);
    }
    if (((e.posed = !0), n.Hips && n.LeftUpLeg && n.RightUpLeg)) {
      let h = new H(0, 0, 1);
      if (e.hipFix === void 0) {
        let f = () => {
            i.root.updateMatrixWorld(!0);
            let p = n.LeftUpLeg.b.getWorldPosition(new H()),
              m = n.RightUpLeg.b.getWorldPosition(new H());
            return Math.asin(Math.max(-1, Math.min(1, (p.y - m.y) / Math.max(1e-4, p.distanceTo(m)))));
          },
          d = f();
        Ms(n.Hips, h, -d);
        let u = f();
        ((e.hipFix = Math.abs(u) <= Math.abs(d) ? -d : d),
          n.Hips.b.quaternion.copy(e.base.Hips ?? n.Hips.b.quaternion));
      }
      Ms(n.Hips, h, e.hipFix);
    }
    if (_h.sym)
      for (let [h, f] of [
        ["LeftUpLeg", "RightUpLeg"],
        ["LeftLeg", "RightLeg"],
      ]) {
        let d = e.base[h],
          u = n[f];
        !d || !u || (_h.sym === 1 ? u.b.quaternion.copy(d) : u.b.quaternion.set(d.x, -d.y, -d.z, d.w));
      }
    if (e.hip0 === void 0) {
      let h = n.Hips?.b;
      h
        ? (i.root.updateMatrixWorld(!0), (e.hip0 = h.getWorldPosition(new H()).y - i.root.getWorldPosition(new H()).y))
        : (e.hip0 = i.height * 0.45);
    }
    let r = new H(1, 0, 0),
      a = _h;
    (Ms(n.LeftUpLeg, r, a.thigh * s),
      Ms(n.RightUpLeg, r, a.thigh * s),
      Ms(n.LeftLeg, r, a.knee * s),
      Ms(n.RightLeg, r, a.knee * s),
      Ms(n.Spine, r, a.spine * s),
      (e.bite += t));
    let c = e.eat ? Math.max(0, Math.sin(e.bite * 1.6)) : 0,
      l = new H(0, 0, 1);
    (Ms(n.RightArm, r, (a.arm - 1 * c) * s),
      Ms(n.RightForeArm, r, (a.fore - 1.2 * c) * s),
      Ms(n.LeftArm, r, a.arm * s),
      Ms(n.LeftForeArm, r, a.fore * s),
      a.armDown && (Ms(n.RightArm, l, -a.armDown * s), Ms(n.LeftArm, l, a.armDown * s)),
      (i.body.position.y = (e.seatY - (e.hip0 ?? 0.6) + a.lift) * s),
      e.food && (e.food.visible = !0));
  }
  function Qg(i, e, t = 0, n = 0.55, s = !1) {
    let o = i;
    (o.sit ?? (o.sit = { on: !1, yaw: t, seatY: n, k: 0, eat: !1, bite: 0 }),
      (o.sit.on = e),
      (o.sit.yaw = t),
      (o.sit.seatY = n),
      (o.sit.eat = s));
  }
  var Gy = () => ({ want: "none", t: 0, k: {}, side: 1, wagT: 0, padT: 0 });
  function Io(i, e) {
    let t = i;
    (t.pose ?? (t.pose = Gy()),
      t.pose.want !== e &&
        ((t.pose.want = e), (t.pose.t = 0), (t.pose.side = e === "sleep" || Math.random() < 0.5 ? -1 : 1)));
  }
  function gp(i) {
    return i.pose?.want ?? "none";
  }
  var Vg = new At(),
    Pc = new H(),
    Ty = new Oe(),
    wy = new Oe(),
    Rh = new Oe(),
    vy = new Oe(),
    Ry = new Yn(),
    _y = new At(),
    Sy = new H(1, 0, 0),
    C7 = new H(0, 1, 0),
    k7 = new H(0, 0, 1),
    Hy = new WeakMap();
  function P7(i) {
    let e = i.geometry,
      t = Hy.get(e);
    if (t) return t;
    let n = e.attributes.position,
      s = i.scale,
      o = Math.max(1, Math.floor(n.count / 1500));
    e.boundingBox || e.computeBoundingBox();
    let r = ((e.boundingBox.min.y + e.boundingBox.max.y) / 2) * s.y,
      a = [],
      c = [],
      l = [];
    for (let f = -24; f <= 24; f++) {
      let d = f * 0.1,
        u = Math.cos(d),
        p = Math.sin(d),
        m = 9;
      for (let E = 0; E < n.count; E += o) {
        let g = n.getX(E) * s.x,
          y = n.getY(E) * s.y;
        m = Math.min(m, g * p + y * u);
      }
      (a.push(d), c.push(-m), l.push(r * p));
    }
    let h = { a, lift: c, sx: l };
    return (Hy.set(e, h), h);
  }
  var I7 = (i, e) => {
    let t = Math.max(0, Math.min(i.a.length - 1.001, (e + 2.4) / 0.1)),
      n = Math.floor(t),
      s = t - n;
    return { lift: i.lift[n] + (i.lift[n + 1] - i.lift[n]) * s, sx: i.sx[n] + (i.sx[n + 1] - i.sx[n]) * s };
  };
  function F7(i, e) {
    let t = i.geometry.attributes.position,
      n = [],
      s = Math.max(1, Math.floor(t.count / 6e3));
    for (let o = 0; o < t.count; o += s) {
      let r = t.getY(o),
        a = t.getZ(o);
      r > e.hip * 0.55 &&
        r < e.hip * 1.25 &&
        a > e.zB - e.hip * 0.6 &&
        a < e.zF + e.hip * 0.35 &&
        n.push(t.getX(o), r, a);
    }
    return new Float32Array(n);
  }
  function z7(i, e, t) {
    let n = {
      sit: 0,
      lie: 0,
      bow: 0,
      crouch: 0,
      raise: 0,
      shake: 0,
      scr: 0,
      roll: 0,
      rock: 0,
      paddle: 0,
      hy: 0,
      hx: 0,
      hz: 0,
      jaw: -1,
      wag: 5,
      tremble: 0,
      bounce: 0,
    };
    switch (i) {
      case "sit":
        ((n.sit = 1), (n.hx = -0.08), (n.hy = Math.sin(e * 0.7) * 0.25), (n.wag = 4));
        break;
      case "lie":
        ((n.lie = 1),
          (n.hx = 0.34 + Math.sin(e * 0.4) * 0.04),
          (n.hy = Math.sin(e * 0.25) * 0.15),
          (n.wag = 1.5),
          (n.jaw = 0));
        break;
      case "bow":
        ((n.bow = 1),
          (n.hx = -0.22),
          (n.hz = Math.sin(e * 6) * 0.08),
          (n.wag = 17),
          (n.jaw = 0.75 + Math.abs(Math.sin(e * 8)) * 0.3));
        break;
      case "shake":
        n.shake = 1;
        break;
      case "scratch":
        ((n.sit = 1), (n.scr = 1), (n.hz = 0.38), (n.hy = 0.25), (n.hx = 0.1));
        break;
      case "sniff":
        ((n.bow = 0.25), (n.hx = 0.72), (n.hy = Math.sin(e * 2.2) * 0.35), (n.wag = 7), (n.jaw = 0));
        break;
      case "look":
        ((n.hy = Math.sin(e * 1.4) * 0.75), (n.hx = -0.08));
        break;
      case "tilt":
        ((n.hz = 0.42 * (Math.sin(e * 0.8) > 0 ? 1 : -1)), (n.hx = -0.1), (n.wag = 2));
        break;
      case "yawn":
        ((n.hx = -0.35), (n.jaw = e < 1.4 ? 1.35 : 0), (n.hz = 0.1));
        break;
      case "happy":
        ((n.raise = 0.5),
          (n.hx = -0.14 + Math.sin(e * 3) * 0.03),
          (n.hy = Math.sin(e * 0.9) * 0.12),
          (n.jaw = 0.8 + Math.abs(Math.sin(e * 9)) * 0.35),
          (n.wag = 19),
          (n.bounce = 1));
        break;
      case "alert": {
        ((n.raise = 1), (n.hx = -0.3));
        let s = Math.floor(e / 1.3);
        ((n.hy = [0, 0.55, -0.45, 0.2, -0.6][s % 5] * t), (n.wag = 0.6), (n.jaw = 0));
        break;
      }
      case "roll":
        ((n.roll = 1),
          (n.rock = 1),
          (n.paddle = 1),
          (n.jaw = 0.6 + Math.abs(Math.sin(e * 4)) * 0.3),
          (n.wag = 9),
          (n.hz = -0.25 * t));
        break;
      case "scared":
        ((n.crouch = 1), (n.hx = 0.4), (n.hy = Math.sin(e * 0.9) * 0.2), (n.wag = 0), (n.jaw = 0), (n.tremble = 1));
        break;
      case "beg":
        ((n.sit = 1),
          (n.hx = -0.6),
          (n.hy = Math.sin(e * 0.8) * 0.08),
          (n.jaw = 0.55 + Math.abs(Math.sin(e * 7)) * 0.3),
          (n.wag = 14));
        break;
      case "sleep":
        ((n.roll = 1), (n.hx = 0.22), (n.hz = 0.12 * t), (n.jaw = 0), (n.wag = 0));
        break;
      case "wary":
        ((n.hy = (Math.sin(e * 0.5) > -0.6 ? 0.62 : 0.1) * t), (n.hx = 0.1), (n.jaw = 0), (n.wag = 0.3));
        break;
    }
    return n;
  }
  // v93: ระบบสปริง (secondary motion) — คำนวณแรงเร่งของตัวน้องในแกนตัวเอง แล้วให้ของที่ติดตัวแกว่งตาม
  var ccsSprQ = new At(),
    ccsSprE = new Yn(),
    ccsSprV = new H();
  function ccsSpring(i, e) {
    let t = i.spr ?? (i.spr = { lx: null, lz: null, vx: 0, vz: 0, ox: 0, oz: 0, wx: 0, wz: 0, flick: 0 });
    if (!(e > 0) || e > 0.2) return t;
    i.root.getWorldPosition(ccsSprV);
    if (t.lx === null) return ((t.lx = ccsSprV.x), (t.lz = ccsSprV.z), t);
    let n = (ccsSprV.x - t.lx) / e,
      s = (ccsSprV.z - t.lz) / e;
    if (Math.hypot(n, s) > 40) ((n = t.vx), (s = t.vz));
    let o = (n - t.vx) / e,
      r = (s - t.vz) / e,
      a = i.root.rotation.y,
      c = Math.sin(a),
      l = Math.cos(a),
      h = o * c + r * l,
      f = o * l - r * c;
    ((t.lx = ccsSprV.x), (t.lz = ccsSprV.z), (t.vx = n), (t.vz = s));
    let d = Math.max(-0.32, Math.min(0.32, -h * 0.014)),
      u = Math.max(-0.28, Math.min(0.28, f * 0.012));
    return (
      (t.wz += ((d - t.oz) * 140 - t.wz * 8) * e),
      (t.wx += ((u - t.ox) * 140 - t.wx * 8) * e),
      (t.oz += t.wz * e),
      (t.ox += t.wx * e),
      (t.flick = Math.min(14, Math.abs(t.wz) * 3 + Math.abs(t.wx) * 3)),
      t
    );
  }
  function L7(i, e, t) {
    let n = i,
      s = n.uni,
      o = n.M,
      r = n.poseMesh;
    if (!s || !o || !r) return;
    let a = n.pose ?? (n.pose = Gy());
    (t && a.want !== "none" && ((a.want = "none"), (a.t = 0)), (a.t += e));
    let c = z7(a.want, a.t, a.side),
      l = a.k,
      h = Math.min(1, e * 5);
    for (let C of [
      "sit",
      "lie",
      "bow",
      "crouch",
      "raise",
      "shake",
      "scr",
      "roll",
      "hy",
      "hx",
      "hz",
      "tremble",
      "bounce",
    ]) {
      let P = c[C],
        I = C === "shake" || C === "tremble" ? Math.min(1, e * 12) : C === "roll" ? Math.min(1, e * 2.2) : h;
      l[C] = (l[C] ?? 0) + (P - (l[C] ?? 0)) * I;
    }
    let f = i.body.position.clone();
    ((f.z = 0), (f.x = 0), Ry.copy(i.body.rotation), _y.setFromEuler(Ry));
    let d = o.hip,
      u = d * (0.66 * l.sit + 0.74 * l.lie + 0.34 * l.crouch),
      p = d * (0.82 * l.lie + 0.62 * l.bow + 0.36 * l.crouch - 0.09 * l.raise),
      m = Math.max(0.3, o.zF - o.zB),
      E = -Math.asin(Math.max(-0.9, Math.min(0.9, (u - p) / m))),
      g = r.scale.y,
      y = r.scale.z,
      x = new H(0, d * g, (u >= p ? o.zB : o.zF) * y),
      b = Math.max(u, p, 0) * g;
    if (
      (Pc.copy(x).applyAxisAngle(Sy, E),
      (i.body.rotation.x += E),
      (i.body.position.z = x.z - Pc.z),
      (i.body.position.y += x.y - Pc.y - b + Math.abs(Math.sin(a.t * 5.5)) * 0.018 * l.bounce),
      (i.body.position.x = 0),
      (i.body.rotation.z += Math.sin(i.t * 32) * 0.2 * l.shake + Math.sin(i.t * 47) * 0.012 * l.tremble),
      l.roll > 0.002)
    ) {
      let C = a.roll ?? (a.roll = P7(r)),
        P = a.side * l.roll * (c.rock ? 1.4 + 0.42 * (0.5 + 0.5 * Math.sin(a.t * 0.9 - 1.5)) : 1.5),
        I = I7(C, P);
      ((i.body.rotation.z += P),
        (i.body.position.y += I.lift * Math.min(1, l.roll * 1.5)),
        (i.body.position.x += I.sx),
        c.paddle &&
          ((a.padT += e * 4.5), (s.uPhase.value = a.padT), (s.uAmp.value = Math.max(s.uAmp.value, 0.28 * l.roll))));
    }
    if (l.roll < 0.3 && l.sit + l.lie + l.bow + l.crouch > 0.01) {
      let C = a.torso ?? (a.torso = F7(r, o));
      (i.body.updateMatrix(), r.updateMatrix(), Rh.multiplyMatrices(i.body.matrix, r.matrix));
      let P = 9;
      for (let I = 0; I < C.length; I += 3) (Pc.set(C[I], C[I + 1], C[I + 2]).applyMatrix4(Rh), Pc.y < P && (P = Pc.y));
      P < 0.015 && (i.body.position.y += 0.015 - P);
    }
    if (((a.wagT += e * (t ? 13 : c.wag)), (s.uWag.value = a.wagT), c.jaw >= 0 && !t)) {
      let C = s.uJaw;
      C.value += (c.jaw - C.value) * Math.min(1, e * 9);
    }
    ((s.uScr.value = 1.1 * l.scr), (s.uScrPh.value = i.t * 26));
    let w = Math.min(1, l.sit + l.lie + l.bow + l.crouch + Math.abs(l.raise) + l.shake + l.tremble + l.bounce + l.roll);
    ((s.uFootOn.value = w > 0.002 ? 1 - Math.min(1, l.roll * 1.6) : 0),
      (s.uPawF.value = 0.2 * l.lie + 0.09 * l.bow + 0.05 * l.crouch),
      w > 0.002 &&
        (Ty.compose(f, _y, i.body.scale),
        i.body.updateMatrix(),
        wy.copy(i.body.matrix).invert(),
        r.updateMatrix(),
        Rh.copy(r.matrix),
        vy.copy(Rh).invert(),
        s.uFootM.value.copy(vy).multiply(wy).multiply(Ty).multiply(Rh)));
    let v = n.gait,
      _ = v ? Math.sin(v.ph * 2 + 0.8) * (0.035 + 0.06 * v.gal) * v.amp : 0,
      S = l.hx + _,
      M = l.hy,
      T = l.hz;
    ((s.uHeadY.value = M), (s.uHeadX.value = S), (s.uHeadZ.value = T));
    // v93: สปริงตามแรงเร่ง — ของบนหัว/ผ้าพันคอ/หางเด้งตามตอนวิ่ง-หยุด-เลี้ยว
    let SQ = ccsSpring(i, e);
    s.uWag.value += SQ.flick * e;
    let A = n.slots;
    if (!A) return;
    a.base ?? (a.base = new Map());
    let F = ccsNeckP.copy(s.uNeck.value);
    F.z -= 0.1 * (o.L ?? 0) * (s.uChow?.value ?? 0);   // v145: จุดหมุนหัวเดียวกับใน shader
    for (let [C, P] of [
      ["eyes", 1],
      ["face", 1],
      ["head", 1],
      ["neck", 0.35],
    ]) {
      let I = A[C];
      if (!I) continue;
      let k = a.base.get(I);
      k || ((k = { p: I.position.clone(), q: I.quaternion.clone() }), a.base.set(I, k));
      let D = new At().setFromAxisAngle(k7, T * P),
        L = new At().setFromAxisAngle(Sy, S * P),
        q = new At().setFromAxisAngle(C7, M * P);
      (Vg.copy(q).multiply(L).multiply(D),
        I.position.copy(k.p).sub(F).applyQuaternion(Vg).add(F),
        I.quaternion.copy(Vg).multiply(k.q));
      let SF = C === "head" ? 1 : C === "neck" ? 1.5 : 0;
      SF && (ccsSprQ.setFromEuler(ccsSprE.set(SQ.oz * SF, 0, SQ.ox * SF)), I.quaternion.multiply(ccsSprQ));
    }
    for (let C in A) {
      if (C === "eyes" || C === "face" || C === "head" || C === "neck") continue;
      let I = A[C];
      if (!I || !I.children.length) continue;
      let k = a.base.get(I);
      (k || ((k = { p: I.position.clone(), q: I.quaternion.clone() }), a.base.set(I, k)),
        ccsSprQ.setFromEuler(ccsSprE.set(SQ.oz * 0.8, 0, SQ.ox * 0.8)),
        I.quaternion.copy(k.q).multiply(ccsSprQ));
    }
    e3(n);
  }
  var ccsNeckP = new H();
  var lp = new Oe(),
    Ay = new Oe(),
    Wg = new Oe();
  function e3(i) {
    let e = i.pawSlots,
      t = i.paws,
      n = i.uni,
      s = i.M;
    if (!e || !t || !n || !s || !e.some((p) => p.children.length)) return;
    let o = i.M.zMid ?? 0,
      r = n.uPhase.value,
      a = n.uAmp.value,
      c = n.uGal?.value ?? 0,
      l = n.uScr?.value ?? 0,
      h = n.uScrPh?.value ?? 0,
      f = n.uFootOn?.value ?? 0,
      d = n.uPawF?.value ?? 0,
      u = n.uFootM?.value;
    for (let p = 0; p < 4; p++) {
      let m = t[p],
        E = m.front,
        g = m.side,
        y = E ? (g > 0 ? 0 : Math.PI) : g > 0 ? Math.PI : 0,
        x = E ? (g > 0 ? 0 : 0.55) : g > 0 ? Math.PI : 3.7;
      y = y + (x - y) * c;
      let b = Math.sin(r + y) * a + (E ? -0.1 : 0.12) * c * a;
      !E && g > 0 && (b += l * (0.95 + 0.45 * Math.sin(h)));
      let w = E ? s.zF : s.zB;
      lp.makeTranslation(0, s.hip, w)
        .multiply(Ay.makeRotationX(b))
        .multiply(Wg.makeTranslation(0, -s.hip, -w));
      let v = f;
      if ((!E && g > 0 && (v *= 1 - Math.min(1, Math.max(0, l))), v > 0.001 && u)) {
        let _ = Wg.identity().elements,
          S = u.elements;
        for (let M = 0; M < 16; M++) _[M] = _[M] * (1 - v) + S[M] * v;
        (lp.premultiply(Wg), E && lp.premultiply(Ay.makeTranslation(0, 0, d * v)));
      }
      (e[p].matrix.copy(lp), (e[p].matrixWorldNeedsUpdate = !0));
    }
  }
  function Uy(i = "") {
    let e = [];
    return (
      ko?.traverse((t) => {
        let n = (t.isMesh && (t.name || t.parent?.name)) || "";
        n && n.startsWith(i) && !e.includes(n) && e.push(n);
      }),
      e
    );
  }
  var Cy = new Map();
  function Vy(i, e, t, n) {
    if (!ko) return null;
    let s = null;
    if (
      (ko.traverse((d) => {
        !s && d.isMesh && (d.name === i || d.parent?.name === i) && (s = d);
      }),
      !s)
    )
      return null;
    let o = s,
      r = i + e,
      a = Cy.get(r);
    if (!a) {
      let d = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone(),
        u = d.attributes.position,
        p = d.attributes.normal,
        m = d.attributes.uv,
        E = [],
        g = [],
        y = [];
      for (let w = 0; w < u.count; w += 3) {
        let v = (u.getX(w) + u.getX(w + 1) + u.getX(w + 2)) / 3;
        if (Math.sign(v) === e)
          for (let _ = 0; _ < 3; _++)
            (E.push(u.getX(w + _), u.getY(w + _), u.getZ(w + _)),
              p && g.push(p.getX(w + _), p.getY(w + _), p.getZ(w + _)),
              m && y.push(m.getX(w + _), m.getY(w + _)));
      }
      ((a = new qe()),
        a.setAttribute("position", new Fe(E, 3)),
        g.length ? a.setAttribute("normal", new Fe(g, 3)) : a.computeVertexNormals(),
        y.length && a.setAttribute("uv", new Fe(y, 2)),
        a.computeBoundingBox());
      let x = a.boundingBox,
        b = x.getCenter(new H());
      (a.translate(-b.x, -x.min.y, -b.z), a.computeBoundingBox(), a.computeBoundingSphere(), Cy.set(r, a));
    }
    let c = a.boundingBox,
      l = c.getSize(new H()),
      h = new R(a, o.material);
    h.castShadow = !0;
    let f = Math.max(t / Math.max(0.001, l.x), n / Math.max(0.001, l.z));
    return (h.scale.setScalar(f), h);
  }
  var Ve = (i, e = 0.8, t = {}) => new X({ color: i, roughness: e, ...t });
  function Qr(i, e, t, n = 1) {
    let s = document.createElement("canvas");
    ((s.width = i), (s.height = e), t(s.getContext("2d")));
    let o = new ut(s);
    return ((o.colorSpace = Ye), (o.anisotropy = 4), (o.wrapS = o.wrapT = gn), o.repeat.set(n, n), o);
  }
  var Ch = (i, e, t, n = 18) => {
      let s = i.getImageData(0, 0, e, t);
      for (let o = 0; o < s.data.length; o += 4) {
        let r = (Math.random() - 0.5) * n;
        ((s.data[o] += r), (s.data[o + 1] += r), (s.data[o + 2] += r));
      }
      i.putImageData(s, 0, 0);
    },
    Fo = (i) => "#" + i.toString(16).padStart(6, "0");
  function i3(i) {
    return Qr(256, 256, (e) => {
      ((e.fillStyle = Fo(i)), e.fillRect(0, 0, 256, 256));
      for (let t = 0; t < 40; t++)
        ((e.fillStyle = `rgba(255,255,255,${Math.random() * 0.06})`),
          e.beginPath(),
          e.arc(Math.random() * 256, Math.random() * 256, 10 + Math.random() * 40, 0, 7),
          e.fill());
      Ch(e, 256, 256, 14);
    });
  }
  function Cn(i, e) {
    return Qr(256, 256, (t) => {
      ((t.fillStyle = Fo(i)), t.fillRect(0, 0, 256, 256));
      for (let n = 0; n < 256; n += 32) {
        ((t.fillStyle = e), t.fillRect(0, n, 256, 2));
        for (let s = (n / 32) % 2 ? 0 : 90; s < 256; s += 180) t.fillRect(s, n, 2, 32);
        ((t.fillStyle = `rgba(0,0,0,${Math.random() * 0.06})`), t.fillRect(0, n + 2, 256, 30));
      }
      Ch(t, 256, 256, 16);
    });
  }
  function n3(i, e) {
    return Qr(256, 64, (t) => {
      for (let n = 0; n < 8; n++) ((t.fillStyle = Fo(n % 2 ? e : i)), t.fillRect(n * 32, 0, 32, 64));
      Ch(t, 256, 64, 10);
    });
  }
  function ei(i, e, t, n = 512, s = 128) {
    let o = Qr(n, s, (r) => {
      ((r.fillStyle = Fo(e)),
        r.fillRect(0, 0, n, s),
        (r.strokeStyle = Fo(t)),
        (r.globalAlpha = 0.35),
        (r.lineWidth = 4),
        r.setLineDash([10, 8]),
        r.strokeRect(12, 12, n - 24, s - 24),
        (r.globalAlpha = 1),
        r.setLineDash([]),
        (r.fillStyle = Fo(t)),
        (r.font = `700 ${Math.round(s * 0.48)}px Mitr, sans-serif`),
        (r.textAlign = "center"),
        (r.textBaseline = "middle"),
        r.fillText(i, n / 2, s / 2 + 4));
    });
    return ((o.wrapS = o.wrapT = Fi), o.repeat.set(1, 1), o);
  }
  var tt = (i, e, t, n, s = 0, o = 0, r = 0) => {
      let a = new R(new ee(i, e, t), n);
      return (a.position.set(s, o, r), (a.castShadow = !0), (a.receiveShadow = !0), a);
    },
    Wy = [
      {
        style: "flat",
        id: "clinic",
        name: "คลินิกหมอหมา",
        x: -25,
        z: -11,
        w: 6.4,
        d: 6,
        wall: 15398898,
        trim: 1943770,
        roof: 6074584,
        awning: [16777215, 6080757],
        signBg: 16777215,
        signFg: 1736614,
        door: 10410224,
        goods: [16777215, 14829119, 10410224],
      },
      {
        style: "dome",
        id: "groom",
        name: "อาบน้ำตัดขน",
        x: -14,
        z: -11,
        w: 6.8,
        d: 6,
        wall: 16766692,
        trim: 11875210,
        roof: 16748472,
        awning: [16777215, 16748472],
        signBg: 16774885,
        signFg: 11875210,
        door: 16777215,
        goods: [6080757, 16777215, 16748472],
      },
      {
        style: "gable",
        id: "petshop",
        name: "ร้านสัตว์เลี้ยง",
        x: 22,
        z: -11,
        w: 9.4,
        d: 7,
        wall: 14676991,
        trim: 2849727,
        roof: 4163272,
        awning: [16777215, 15895592],
        signBg: 16774885,
        signFg: 2849727,
        door: 15895592,
        goods: [15895592, 6080757, 16748472, 16765503],
      },
      {
        style: "store",
        id: "grocery",
        name: "ร้านของชำ",
        x: 10,
        z: -11,
        w: 7.8,
        d: 6,
        wall: 16645111,
        trim: 14829119,
        roof: 14829119,
        awning: [14829119, 16777215],
        signBg: 16774885,
        signFg: 14829119,
        door: 14829119,
        goods: [14829119, 16765503, 10215773, 15895592],
      },
    ];
  function qy(i, e) {
    let t = new J(),
      n = [],
      s = 3.6,
      o = 2.8,
      r = s + o,
      a = i.style ?? "gable",
      c = new X({ map: a === "gambrel" ? Cn(i.wall, "#c9a46a") : i3(i.wall), roughness: 0.9 }),
      l = Ve(i.trim, 0.6),
      h = Ve(i.roof, 0.7),
      f = Ve(10410224, 0.08, { metalness: 0.15, emissive: new ae(16765562), emissiveIntensity: 0 }),
      d = Ve(3811872, 0.6),
      u = Ve(16774885, 0.7),
      p = 1.5,
      m = i.w * 0.22,
      E = 1.36,
      g = 2.4,
      y = a === "tower" ? 2.3 : i.w * 0.42,
      x = a === "tower" ? -0.75 : -i.w * 0.2,
      b = 1,
      w = 2.85;
    t.add(tt(i.w, r, i.d - p, c, 0, r / 2, -(i.d + p) / 2));
    {
      let I = new mn();
      (I.moveTo(-i.w / 2, 0), I.lineTo(i.w / 2, 0), I.lineTo(i.w / 2, r), I.lineTo(-i.w / 2, r), I.closePath());
      let k = new So();
      (k.moveTo(x - y / 2, b), k.lineTo(x - y / 2, w), k.lineTo(x + y / 2, w), k.lineTo(x + y / 2, b), k.closePath());
      let D = new So();
      (D.moveTo(m - E / 2, 0.45),
        D.lineTo(m - E / 2, 0.45 + g),
        D.lineTo(m + E / 2, 0.45 + g),
        D.lineTo(m + E / 2, 0.45),
        D.closePath(),
        I.holes.push(k, D));
      let L = new yi(I, { depth: 0.18, bevelEnabled: !1 }),
        q = L.attributes.uv,
        $ = L.attributes.position;
      for (let Z = 0; Z < q.count; Z++) q.setXY(Z, $.getX(Z) / i.w + 0.5, $.getY(Z) / r);
      let te = new R(L, c);
      ((te.position.z = -0.18), (te.castShadow = !0), (te.receiveShadow = !0), t.add(te));
      for (let Z of [-1, 1]) t.add(tt(0.16, r, p, c, Z * (i.w / 2 - 0.08), r / 2, -p / 2));
      t.add(tt(i.w, 0.16, p, c, 0, r - 0.08, -p / 2));
      let Y = new bt({ map: $y(i), emissive: new ae(16769712), emissiveIntensity: 0.32 });
      (Y.map.repeat.set(2, 1), n.push({ m: Y, day: 0.32, night: 1.05 }));
      let O = new bt({ map: jy(i.id), emissive: new ae(16769712), emissiveIntensity: 0.22 });
      n.push({ m: O, day: 0.22, night: 0.8 });
      let U = new R(new Te(i.w - 0.3, s - 0.45), Y);
      (U.position.set(0, 0.45 + (s - 0.45) / 2, -p + 0.01), t.add(U));
      for (let Z of [-1, 1]) {
        let fe = new R(new Te(p, s - 0.45), Y);
        (fe.position.set(Z * (i.w / 2 - 0.17), 0.45 + (s - 0.45) / 2, -p / 2),
          (fe.rotation.y = (-Z * Math.PI) / 2),
          t.add(fe));
      }
      let W = new R(new Te(i.w - 0.3, p), O);
      ((W.rotation.x = -Math.PI / 2), W.position.set(0, 0.46, -p / 2), t.add(W));
      let Q = new R(
        new Te(i.w - 0.3, p),
        new bt({ color: 16774885, emissive: new ae(16773328), emissiveIntensity: 0.5 }),
      );
      ((Q.rotation.x = Math.PI / 2), Q.position.set(0, s - 0.02, -p / 2), t.add(Q));
      for (let Z of [x, m]) {
        let fe = new R(new re(0.22, 0.22, 0.05, 16), new be({ color: 16773568 }));
        (fe.position.set(Z, s - 0.06, -p / 2), t.add(fe));
      }
    }
    (t.add(
      tt(
        i.w + (a === "store" ? 0.5 : 0.12),
        0.45,
        i.d + (a === "store" ? 0.5 : 0.12),
        a === "store" ? Ve(4892896, 0.35) : Ve(10127994, 0.9),
        0,
        0.22,
        -i.d / 2 + (a === "store" ? 0.15 : 0),
      ),
    ),
      t.add(tt(i.w + 0.3, 0.22, i.d + 0.3, l, 0, s, -i.d / 2)),
      t.add(tt(i.w + 0.4, 0.3, i.d + 0.4, l, 0, r + 0.15, -i.d / 2)));
    let v = (I) => {
        let k = new mn();
        (I.forEach(([L, q], $) => ($ ? k.lineTo(L, q) : k.moveTo(L, q))), k.closePath());
        let D = new R(new yi(k, { depth: i.w + 0.5, bevelEnabled: !1 }), h);
        ((D.rotation.y = Math.PI / 2),
          D.position.set(-(i.w + 0.5) / 2, r + 0.3, -i.d / 2),
          (D.castShadow = !0),
          t.add(D));
      },
      _ = i.d / 2;
    if (a === "gable" || a === "tower") {
      v([
        [-_ - 0.5, 0],
        [0, 1.8],
        [_ + 0.5, 0],
      ]);
      for (let I = 0; I < 4; I++)
        t.add(
          tt(
            i.w + 0.52,
            0.06,
            0.08,
            Ve(i.roof, 0.6, { color: new ae(i.roof).multiplyScalar(0.8) }),
            0,
            r + 0.45 + I * 0.38,
            0.2 - I * 0.6 + 0.3,
          ),
        );
    }
    if (a === "gambrel") {
      v([
        [-_ - 0.5, 0],
        [-_ + 0.4, 1.5],
        [0, 2.5],
        [_ - 0.4, 1.5],
        [_ + 0.5, 0],
      ]);
      let I = tt(1.4, 1.2, 0.1, u, 0, r + 1.3, 0.12);
      (t.add(I), t.add(tt(1.1, 0.9, 0.06, f, 0, r + 1.3, 0.18)));
      for (let k of [0.7, -0.7]) {
        let D = tt(0.08, 1.3, 0.08, u, 0, r + 1.3, 0.2);
        ((D.rotation.z = k), t.add(D));
      }
    }
    if (a === "flat") {
      for (let [D, L, q, $] of [
        [i.w + 0.4, 0.2, 0, 0.1],
        [i.w + 0.4, 0.2, 0, -i.d - 0.1],
        [0.2, i.d + 0.4, -i.w / 2 - 0.1, -_],
        [0.2, i.d + 0.4, i.w / 2 + 0.1, -_],
      ])
        t.add(tt(D, 0.7, L, l, q, r + 0.6, $));
      t.add(tt(i.w + 0.2, 0.1, i.d + 0.2, Ve(10132122, 0.9), 0, r + 0.32, -_));
      for (let D of [-1.2, 0.8]) {
        t.add(tt(0.9, 0.6, 0.7, Ve(14673642, 0.5), D, r + 0.65, -_ - 0.8));
        let L = new R(new re(0.25, 0.25, 0.05, 16), d);
        (L.position.set(D, r + 0.97, -_ - 0.8), t.add(L));
      }
      let I = new J();
      I.position.set(i.w / 2 - 0.9, r + 1.5, 0.1);
      let k = Ve(14829119, 0.4, { emissive: new ae(14829119), emissiveIntensity: 0.4 });
      (I.add(tt(0.9, 0.3, 0.12, k, 0, 0, 0)), I.add(tt(0.3, 0.9, 0.12, k, 0, 0, 0)), t.add(I));
    }
    if (a === "dome") {
      let I = new R(new re(Math.min(i.w, i.d) * 0.42, Math.min(i.w, i.d) * 0.42, 0.5, 32), l);
      (I.position.set(0, r + 0.55, -_), t.add(I));
      let k = new R(new we(Math.min(i.w, i.d) * 0.42, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), h);
      (k.position.set(0, r + 0.8, -_), (k.scale.y = 0.85), (k.castShadow = !0), t.add(k));
      let D = new R(new yt(0.15, 0.7, 12), Ve(16765503, 0.3, { metalness: 0.6 }));
      (D.position.set(0, r + 0.8 + Math.min(i.w, i.d) * 0.36 + 0.3, -_),
        t.add(D),
        t.add(tt(i.w + 0.2, 0.12, i.d + 0.2, l, 0, r + 0.33, -_)));
      for (let L of [-i.w / 2 + 0.3, i.w / 2 - 0.3])
        for (let q of [0.15]) {
          let $ = new R(new re(0.16, 0.18, s, 12), u);
          ($.position.set(L, s / 2, q), t.add($));
        }
    }
    if (a === "store") {
      let I = Ve(14829119, 0.35),
        k = Ve(16774885, 0.5);
      (t.add(tt(i.w + 0.7, 0.55, i.d + 0.7, I, 0, r + 0.3, -_)),
        t.add(tt(i.w + 0.3, 0.1, i.d + 0.3, k, 0, r + 0.6, -_)));
      let D = Math.min(i.w * 0.78, 6.2),
        L = 1.9,
        q = (O, U, W, Q, Z, fe) => {
          let _e = new mn();
          (_e.moveTo(-O / 2 + W, -U / 2),
            _e.lineTo(O / 2 - W, -U / 2),
            _e.quadraticCurveTo(O / 2, -U / 2, O / 2, -U / 2 + W),
            _e.lineTo(O / 2, U / 2 - W),
            _e.quadraticCurveTo(O / 2, U / 2, O / 2 - W, U / 2),
            _e.lineTo(-O / 2 + W, U / 2),
            _e.quadraticCurveTo(-O / 2, U / 2, -O / 2, U / 2 - W),
            _e.lineTo(-O / 2, -U / 2 + W),
            _e.quadraticCurveTo(-O / 2, -U / 2, -O / 2 + W, -U / 2));
          let ge = new R(
            new yi(_e, { depth: Q, bevelEnabled: !0, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 3 }),
            Z,
          );
          return (ge.position.set(0, r + 0.6 + L / 2 + 0.15, -_ * 0.35 + fe), (ge.castShadow = !0), t.add(ge), ge);
        };
      (q(D, L, 0.4, 0.35, I, 0), q(D - 0.35, L - 0.35, 0.3, 0.42, k, 0.02));
      let $ = q(D - 0.9, L - 0.85, 0.42, 0.5, I, 0.04),
        te = new R(new Te(D - 1.1, L - 1), new be({ map: ei(i.name, 14829119, 16777215, 512, 150), transparent: !1 }));
      (te.position.set(0, r + 0.6 + L / 2 + 0.15, -_ * 0.35 + 0.66), t.add(te));
      for (let O of [-1, 1]) t.add(tt(0.14, 0.5, 0.14, Ve(10132122, 0.6), O * D * 0.32, r + 0.75, -_ * 0.35 + 0.15));
      let Y = tt(y * 0.7, 0.28, 0.32, I, x, b - 0.3, 0.3);
      t.add(Y);
      for (let O = 0; O < 4; O++) {
        let U = new R(new we(0.16, 10, 8), Ve(7192395, 0.7));
        (U.position.set(x - y * 0.26 + O * y * 0.17, b - 0.08, 0.3), t.add(U));
      }
      for (let O of [-1, 1]) t.add(tt(0.3, r, 0.3, k, O * (i.w / 2 + 0.02), r / 2, 0.02));
    }
    if (a === "tower") {
      let k = -i.w / 2 + 0.2,
        D = -0.4,
        L = new R(new re(1.05, 1.05, r + 1.2, 24), c);
      (L.position.set(k, (r + 1.2) / 2, D), (L.castShadow = !0), t.add(L));
      let q = new R(new yt(1.05 + 0.25, 2.2, 24), h);
      (q.position.set(k, r + 1.2 + 1.1, D), (q.castShadow = !0), t.add(q));
      let $ = tt(0.5, 0.3, 0.02, Ve(16748472, 0.6), k + 0.27, r + 3.4, D);
      (t.add($), t.add(tt(0.03, 0.7, 0.03, d, k, r + 3.3, D)));
      for (let te of [s + 1.4, r + 0.6]) {
        let Y = new R(new gt(0.32, 18), f);
        (Y.position.set(k, te, D + 1.05 + 0.01), t.add(Y));
        let O = new R(new vt(0.33, 0.05, 6, 18), u);
        (O.position.copy(Y.position), t.add(O));
      }
    }
    let S = Ve(i.door, 0.45, { metalness: 0.2 }),
      M = new X({ color: 13954295, roughness: 0.04, metalness: 0.1, transparent: !0, opacity: 0.22, depthWrite: !1 });
    {
      let k = m;
      for (let [q, $, te, Y] of [
        [E + 0.24, 0.14, 0, 0.45 + g + 0.05],
        [0.12, g + 0.1, -E / 2 - 0.06, 0.45 + g / 2],
        [0.12, g + 0.1, E / 2 + 0.06, 0.45 + g / 2],
      ])
        t.add(tt(q, $, 0.22, l, k + te, Y, -0.09));
      for (let q of [-1, 1]) {
        let $ = k + (q * E) / 4;
        (t.add(tt(E / 2 - 0.02, 0.1, 0.06, S, $, 0.45 + 0.08, -0.12)),
          t.add(tt(E / 2 - 0.02, 0.1, 0.06, S, $, 0.45 + g - 0.08, -0.12)),
          t.add(tt(0.07, g - 0.06, 0.06, S, $ - q * (E / 4 - 0.05), 0.45 + g / 2, -0.12)),
          t.add(tt(0.07, g - 0.06, 0.06, S, $ + q * (E / 4 - 0.05), 0.45 + g / 2, -0.12)),
          t.add(tt(E / 2 - 0.12, 0.3, 0.06, S, $, 0.45 + 0.28, -0.12)));
        let te = new R(new Te(E / 2 - 0.12, g - 0.5), M);
        (te.position.set($, 0.45 + 0.43 + (g - 0.5) / 2, -0.12), (te.renderOrder = 3), t.add(te));
        let Y = new R(new re(0.025, 0.025, 0.7, 8), Ve(14211288, 0.2, { metalness: 0.9 }));
        (Y.position.set(k - q * 0.12, 0.45 + 1.15, -0.02), t.add(Y));
      }
      let D = new R(new Te(0.46, 0.2), new be({ map: ei("OPEN", 14829119, 16777215, 192, 80) }));
      (D.position.set(k + E / 4, 0.45 + 1.75, -0.08),
        t.add(D),
        t.add(tt(1.9, 0.08, 0.7, Ve(10127994, 0.9), k, 0.42, 0.33)));
      let L = new R(new Te(1.2, 0.55), Ve(9067051, 0.95));
      ((L.rotation.x = -Math.PI / 2), L.position.set(k, 0.465, 0.35), t.add(L));
    }
    {
      let I = (b + w) / 2,
        k = w - b;
      for (let [L, q, $, te] of [
        [y + 0.2, 0.12, x, w + 0.04],
        [y + 0.2, 0.12, x, b - 0.04],
        [0.12, k, x - y / 2 - 0.04, I],
        [0.12, k, x + y / 2 + 0.04, I],
        [0.07, k, x, I],
      ])
        t.add(tt(L, q, 0.2, l, $, te, -0.05));
      let D = new R(new Te(y, k), M);
      (D.position.set(x, I, -0.06), (D.renderOrder = 3), t.add(D), t.add(tt(y + 0.4, 0.1, 0.36, u, x, b - 0.08, 0.12)));
    }
    let T = [];
    {
      let I = new bt({ color: 16774885, emissive: new ae(16771264), emissiveIntensity: 0.25 }),
        k = -0.75;
      (t.add(tt(y - 0.2, 0.5, 0.8, I, x, 0.7, k)), t.add(tt(y * 0.6, 0.45, 0.45, I, x, 1.18, k - 0.15)));
      let D = Math.max(3, Math.round(y / 0.6));
      for (let L = 0; L < D; L++) T.push(new H(x - (y - 0.6) / 2 + (L * (y - 0.6)) / (D - 1), 0.95, k + 0.2));
      for (let L = 0; L < 3; L++) T.push(new H(x - y * 0.2 + L * y * 0.2, 1.41, k - 0.15));
      i.goods.forEach((L, q) => {
        let $ = new R(q % 2 ? new we(0.14, 12, 10) : new ee(0.24, 0.32, 0.18), Ve(L, 0.6));
        ($.position.set(x - y / 2 + 0.4 + (q * (y - 0.8)) / Math.max(1, i.goods.length - 1), 0.62, -1.3), t.add($));
      });
    }
    let A = new R(
      new re(0.85, 0.85, i.w * 0.92, 24, 1, !0, 0, Math.PI / 2),
      new X({ map: n3(i.awning[0], i.awning[1]), side: Ke, roughness: 0.8 }),
    );
    ((A.rotation.z = Math.PI / 2), A.position.set(0, 2.25, 0.02), (A.castShadow = !0), t.add(A));
    for (let I of [-1, 1]) {
      let k = new R(new gt(0.85, 16, 0, Math.PI / 2), Ve(i.awning[1], 0.8, { side: Ke }));
      ((k.rotation.y = -Math.PI / 2), k.position.set(I * i.w * 0.46, 2.25, 0.02), t.add(k));
    }
    {
      let I = Ve(2829099, 0.4, { metalness: 0.6 });
      for (let k of [-1, 1]) {
        let D = new R(new re(0.025, 0.025, 1, 6), I);
        ((D.rotation.x = 0.9), D.position.set(k * (i.w * 0.46 - 0.05), 1.95, 0.38), t.add(D));
      }
    }
    for (let I = 0; I < 14; I++) {
      let k = new R(
        new we(0.16, 10, 6, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
        Ve(I % 2 ? i.awning[1] : i.awning[0], 0.8),
      );
      (k.position.set(-i.w * 0.46 + 0.16 + (I * (i.w * 0.92 - 0.32)) / 13, 2.27, 0.86), t.add(k));
    }
    let F = new X({
      map: ei(i.name, i.signBg, i.signFg),
      roughness: 0.6,
      emissive: new ae(16777215),
      emissiveIntensity: 0,
    });
    ((F.emissiveMap = F.map), n.push({ m: F, day: 0, night: 0.85 }));
    let C = new R(new ee(a === "store" ? 0.01 : i.w * 0.7, a === "store" ? 0.01 : 0.75, 0.12), [l, l, l, l, F, l]);
    (C.position.set(0, s + 0.62, 0.1), (C.castShadow = !0), t.add(C));
    for (let I of [-i.w * 0.27, i.w * 0.27]) {
      t.add(tt(1.1, 1.3, 0.12, u, I, s + 1.5, 0.03));
      let k = tt(0.9, 1.1, 0.05, f, I, s + 1.5, 0.08);
      t.add(k);
      for (let D of [-0.72, 0.72]) t.add(tt(0.36, 1.2, 0.06, Ve(i.trim, 0.7), I + D, s + 1.5, 0.08));
      t.add(tt(1.2, 0.22, 0.35, Ve(12738618, 0.8), I, s + 0.85, 0.2));
      for (let D = 0; D < 6; D++) {
        let L = new R(new we(0.1, 8, 6), Ve(D % 2 ? 6075454 : [16740241, 16765503, 16777215][D % 3], 0.8));
        (L.position.set(I - 0.45 + D * 0.18, s + 1.02, 0.2), t.add(L));
      }
    }
    let P = Ve(16774080, 0.3, { emissive: new ae(16762976), emissiveIntensity: 0.2 });
    for (let I of [-0.95, 0.95]) {
      t.add(tt(0.08, 0.3, 0.2, d, m + I, 2.4, 0.1));
      let k = new R(new we(0.12, 10, 8), P);
      (k.position.set(m + I, 2.65, 0.25), t.add(k));
    }
    return (
      t.position.set(i.x, 0, i.z),
      e.add(t),
      {
        group: t,
        door: new H(i.x + m, 0, i.z + 0.9),
        vitrine: T.map((I) => I.clone().add(t.position)),
        glassM: f,
        lampM: P,
        nightM: n,
        glassF: M,
        solid: { x: i.x, z: i.z - i.d / 2, hw: i.w / 2 + 0.3, hd: i.d / 2 + 0.35 },
      }
    );
  }
  var s3 = 15,
    o3 = 12;
  function jy(i) {
    if (i === "grocery" || i === "pet")
      return Cn(i === "pet" ? 14267498 : 13208139, i === "pet" ? "#9a7a3a" : "#8a5a2b");
    let e = { chow: ["#ffe3ea", "#fff6e5"], clinic: ["#f4f8fb", "#dfeaf1"], groom: ["#d9f1fb", "#ffffff"] },
      [t, n] = e[i] ?? ["#eee", "#fff"];
    return Qr(256, 256, (s) => {
      for (let o = 0; o < 4; o++)
        for (let r = 0; r < 4; r++) ((s.fillStyle = (r + o) % 2 ? t : n), s.fillRect(r * 64, o * 64, 64, 64));
      s.strokeStyle = "rgba(0,0,0,.08)";
      for (let o = 0; o <= 4; o++)
        (s.beginPath(),
          s.moveTo(o * 64, 0),
          s.lineTo(o * 64, 256),
          s.moveTo(0, o * 64),
          s.lineTo(256, o * 64),
          s.stroke());
      Ch(s, 256, 256, 8);
    });
  }
  function $y(i) {
    return Qr(
      256,
      256,
      (e) => {
        if (((e.fillStyle = Fo(i.wall)), e.fillRect(0, 0, 256, 256), i.id === "chow")) {
          for (let t = 0; t < 256; t += 32) ((e.fillStyle = "rgba(255,255,255,.35)"), e.fillRect(t, 0, 14, 256));
          for (let t = 0; t < 16; t++)
            ((e.font = "22px serif"), e.fillText("🐾", (t % 4) * 64 + 20, Math.floor(t / 4) * 64 + 40));
        } else if (i.id === "clinic")
          ((e.fillStyle = "rgba(255,255,255,.6)"),
            e.fillRect(0, 150, 256, 106),
            (e.fillStyle = Fo(i.trim)),
            e.fillRect(0, 146, 256, 6));
        else if (i.id === "groom")
          for (let t = 0; t < 40; t++)
            ((e.strokeStyle = "rgba(255,255,255,.7)"),
              (e.lineWidth = 2),
              e.beginPath(),
              e.arc(Math.random() * 256, Math.random() * 256, 4 + Math.random() * 14, 0, 7),
              e.stroke());
        else if (i.id === "grocery") {
          e.fillStyle = "rgba(150,70,40,.25)";
          for (let t = 0; t < 256; t += 24)
            for (let n = (t / 24) % 2 ? 0 : 24; n < 256; n += 48) e.fillRect(n + 1, t + 1, 46, 22);
        } else for (let t = 0; t < 256; t += 28) ((e.fillStyle = "rgba(0,0,0,.12)"), e.fillRect(t, 0, 2, 256));
        Ch(e, 256, 256, 10);
      },
      3,
    );
  }
  var t3 = 3.2,
    B7 = -3.4;
  function Ep(i, e, t, n, s, o, r, a, c, l = 3.6) {
    let h = s ? new be({ map: s }) : new be({ color: 12575735 }),
      f = t / 2 - 0.02,
      d = (x, b, w, v) => {
        let _ = new Te(w, v),
          S = _.attributes.uv,
          M = _.attributes.position;
        for (let A = 0; A < S.count; A++) {
          let F = M.getX(A),
            C = M.getY(A);
          S.setXY(A, (e / 2 - (x - F)) / e, (b + v / 2 + C) / n);
        }
        let T = new R(_, h);
        return (T.position.set(x, b + v / 2, f), (T.rotation.y = Math.PI), i.add(T), T);
      },
      u = Ve(o, 0.5),
      p = Ve(r, 0.45, { metalness: 0.2 }),
      m = new X({ color: 13954295, roughness: 0.04, metalness: 0.1, transparent: !0, opacity: 0.16, depthWrite: !1 }),
      E = 1.6,
      g = 2.5,
      y = t / 2 - 0.08;
    if (!Number.isNaN(a)) {
      d(a, 0, E, g);
      for (let [x, b, w, v] of [
        [E + 0.3, 0.16, 0, g + 0.06],
        [0.15, g + 0.1, -E / 2 - 0.07, g / 2],
        [0.15, g + 0.1, E / 2 + 0.07, g / 2],
      ])
        i.add(tt(x, b, 0.2, u, a + w, v, y));
      for (let x of [-1, 1]) {
        let b = a + (x * E) / 4;
        (i.add(tt(E / 2 - 0.02, 0.1, 0.06, p, b, g - 0.06, y - 0.04)),
          i.add(tt(0.08, g, 0.06, p, b - x * (E / 4 - 0.05), g / 2, y - 0.04)),
          i.add(tt(0.08, g, 0.06, p, b + x * (E / 4 - 0.05), g / 2, y - 0.04)),
          i.add(tt(E / 2 - 0.12, 0.32, 0.06, p, b, 0.16, y - 0.04)));
        let w = new R(new Te(E / 2 - 0.14, g - 0.45), m);
        (w.position.set(b, 0.32 + (g - 0.45) / 2, y - 0.06), (w.rotation.y = Math.PI), (w.renderOrder = 3), i.add(w));
        let v = new R(new re(0.025, 0.025, 0.7, 8), Ve(14211288, 0.2, { metalness: 0.9 }));
        (v.position.set(a - x * 0.14, 1.1, y - 0.12), i.add(v));
      }
    }
    if (l > 0) {
      d(c, 0.95, l, 1.95);
      for (let [_, S, M, T] of [
        [l + 0.24, 0.14, c, 2.9 + 0.05],
        [l + 0.24, 0.14, c, 0.95 - 0.05],
        [0.14, 1.95, c - l / 2 - 0.05, 0.95 + 1.95 / 2],
        [0.14, 1.95, c + l / 2 + 0.05, 0.95 + 1.95 / 2],
        [0.08, 1.95, c, 0.95 + 1.95 / 2],
      ])
        i.add(tt(_, S, 0.16, u, M, T, y));
      let v = new R(new Te(l, 1.95), m);
      (v.position.set(c, 0.95 + 1.95 / 2, y - 0.06),
        (v.rotation.y = Math.PI),
        (v.renderOrder = 3),
        i.add(v),
        i.add(tt(l + 0.4, 0.08, 0.32, u, c, 0.95 - 0.12, y - 0.14)));
    }
  }
  function Xy(i, e, t, n, s, o = !1) {
    let r = new J();
    r.position.copy(t);
    let a = o ? 21 : s3,
      c = o ? 15 : o3,
      l = 4.6,
      h = o
        ? new X({ map: N7(a, c), roughness: 0.35, metalness: 0.05 })
        : new X({ map: jy(i.id), roughness: i.id === "clinic" || i.id === "groom" ? 0.35 : 0.75 });
    o || h.map.repeat.set(4, 3);
    let f = new X({ map: o ? G7() : $y(i), roughness: 0.9, side: Ke }),
      d = new R(new Te(a, c), h);
    ((d.rotation.x = -Math.PI / 2), (d.receiveShadow = !0), r.add(d));
    let u = new R(new Te(a, c), Ve(16774885, 0.9, { side: Ke, emissive: new ae(16774885), emissiveIntensity: 0.45 }));
    ((u.rotation.x = Math.PI / 2), (u.position.y = l), (u.castShadow = !0), (u.userData.noMerge = !0), r.add(u));
    for (let [k, D, L, q] of [
      [0, -c / 2, 0, a],
      [-a / 2, 0, Math.PI / 2, c],
      [a / 2, 0, -Math.PI / 2, c],
      [0, c / 2, Math.PI, a],
    ]) {
      let $ = new R(new Te(q, l), f);
      ($.position.set(k, l / 2, D),
        ($.rotation.y = L),
        ($.receiveShadow = !0),
        ($.castShadow = !0),
        ($.userData.noMerge = !0),
        r.add($), // v89: เอาบัวผนังล่าง (แถบสีเข้ม) ออก — ซ้อนระนาบกับตู้/เสาชิดผนังจนกะพริบ
        r.add(
          tt(
            L === 0 || L === Math.PI ? q : 0.08,
            0.16,
            L === 0 || L === Math.PI ? 0.08 : q,
            Ve(16774885, 0.6),
            k,
            l - 0.08,
            D,
          ),
        ));
    }
    Ep(r, a, c, l, s, i.trim, i.door, t3, B7);
    let p = new R(new gt(0.85, 40), new be({ map: r3(i) }));
    (p.position.set(0, 3.1, -c / 2 + 0.06), r.add(p));
    let m = new R(new gt(2, 40), Ve(i.awning[1], 0.95));
    ((m.rotation.x = -Math.PI / 2), m.position.set(0, 0.01, 2.2), m.scale.set(1.5, 1, 1), r.add(m));
    let E = new R(new Te(2, 1), Ve(9067051, 0.95));
    ((E.rotation.x = -Math.PI / 2), E.position.set(t3, 0.012, c / 2 - 0.8), r.add(E));
    let g = new X({ map: Cn(10185274, "#6b4220"), roughness: 0.7 }),
      y = Jr,
      x = o ? y.counter.x : -4.6,
      b = o ? y.counter.z : -3.3,
      w = Ve(16773577, 0.5);
    if (o) {
      let k = Ve(1908002, 0.55),
        D = Ve(16769280, 0.45),
        L = y.counter;
      (r.add(tt(L.len, 0.78, L.d, k, L.x, 0.39, L.z)),
        r.add(tt(L.len + 0.08, 0.06, L.d + 0.14, w, L.x, 0.81, L.z)),
        r.add(tt(L.len, 0.16, 0.02, D, L.x, 0.6, L.z - L.d / 2 - 0.011)),
        r.add(tt(L.d, 0.78, L.armLen, k, L.armX, 0.39, L.z + L.d / 2 + L.armLen / 2)),
        r.add(tt(L.d + 0.14, 0.06, L.armLen + 0.04, w, L.armX, 0.81, L.z + L.d / 2 + L.armLen / 2)),
        r.add(tt(0.02, 0.16, L.armLen, D, L.armX + L.d / 2 + 0.011, 0.6, L.z + L.d / 2 + L.armLen / 2)),
        r.add(tt(0.46, 0.2, 0.38, Ve(2763312, 0.4, { metalness: 0.3 }), L.regX, 0.94, L.z)),
        r.add(
          tt(
            0.36,
            0.26,
            0.03,
            Ve(1118481, 0.3, { emissive: new ae(3836888), emissiveIntensity: 0.6 }),
            L.regX,
            1.18,
            L.z + 0.12,
          ),
        ));
      let q = new R(new we(0.1, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), Ve(16765503, 0.2, { metalness: 0.8 }));
      (q.position.set(L.regX + 0.55, 0.84, L.z - 0.22), r.add(q));
      let $ = Ve(13159634, 0.25, { metalness: 0.85 });
      for (let te = 0; te < 3; te++) {
        let Y = L.qx + te * 0.9,
          O = new R(new re(0.035, 0.05, 0.95, 10), $);
        if ((O.position.set(Y, 0.47, L.qz - 0.55), r.add(O), te)) {
          let U = new R(new ee(0.9, 0.06, 0.012), Ve(15073298, 0.5));
          (U.position.set(Y - 0.45, 0.82, L.qz - 0.55), r.add(U));
        }
      }
    } else (r.add(tt(3.6, 0.64, 0.9, g, x, 0.32, b)), r.add(tt(3.8, 0.08, 1.1, w, x, 0.68, b)));
    if (!o) {
      r.add(tt(0.5, 0.26, 0.4, Ve(14829119, 0.4, { metalness: 0.3 }), x + 1.1, 0.85, b));
      let k = new R(new we(0.1, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), Ve(16765503, 0.2, { metalness: 0.8 }));
      (k.position.set(x - 0.6, 0.72, b + 0.2), r.add(k));
    }
    for (let k of [-4, 0, 4]) {
      // v82: โคมกระดาษสาแบบเดียวกับบ้านข้าวต้ม ทุกร้าน
      if (!ccsRiceLamp(r, k, l, 0)) {
        let D = new R(new yt(0.45, 0.35, 16, 1, !0), Ve(i.trim, 0.6, { side: Ke }));
        (D.position.set(k, l - 0.6, 0), r.add(D));
        let L = new R(new we(0.14, 10, 8), new be({ color: 16773568 }));
        (L.position.set(k, l - 0.75, 0), r.add(L));
      }
      let q = new En(16767392, 8, 12, 1.6);
      (q.position.set(k, l - 0.9, 0), r.add(q));
    }
    let v = new En(16773336, 4, 16, 1.4);
    (v.position.set(0, 3, 3.5), r.add(v));
    let _ = o
        ? new X({ color: 16053494, roughness: 0.45, metalness: 0.35 })
        : new X({ map: Cn(11565636, "#7a4a24"), roughness: 0.7 }),
      S = o ? new X({ color: 2368554, roughness: 0.7 }) : _,
      M = o ? new X({ color: 16769280, roughness: 0.5 }) : null,
      T = [],
      A = [],
      F = n.length > 13,
      C = (k, D, L, q, $ = !1) => {
        let te = new J();
        (te.position.set(k, 0, D),
          (te.rotation.y = L),
          $ ? o && te.add(tt(q, 2.2, 0.06, S, 0, 1.1, 0)) : te.add(tt(q, 2.2, 0.08, S, 0, 1.1, -0.35)));
        for (let U of [0.05, 0.75, 1.45, 2.15])
          if ((te.add(tt(q, 0.08, $ ? 1.3 : 0.7, _, 0, U, 0)), M))
            for (let W of $ ? [-0.66, 0.66] : [0.36]) te.add(tt(q, 0.09, 0.02, M, 0, U + 0.02, W));
        for (let U of [-q / 2, q / 2]) te.add(tt(0.08, 2.2, $ ? 1.3 : 0.7, o ? S : _, U, 1.1, 0));
        r.add(te);
        let Y = Math.max(1, Math.round(q / (F ? 0.82 : 1.1))),
          O = $ ? [L, L + Math.PI] : [L];
        for (let U of O) {
          let W = $ ? 0.35 : 0;
          for (let Z = 0; Z < Y; Z++) {
            let fe = -q / 2 + (Z + 0.5) * (q / Y),
              _e = k + Math.cos(L) * fe + Math.sin(U) * W,
              ge = D - Math.sin(L) * fe + Math.cos(U) * W;
            T.push([_e + Math.sin(U) * 1, ge + Math.cos(U) * 1, U]);
          }
          let Q = Math.max(2, Math.round(q / 0.55));
          for (let Z of [0.13, 1.53, 2.23])
            for (let fe = 0; fe < Q; fe++) {
              let _e = -q / 2 + (fe + 0.5) * (q / Q);
              A.push({
                pos: new H(k + Math.cos(L) * _e + Math.sin(U) * W, Z, D - Math.sin(L) * _e + Math.cos(U) * W).add(t),
                ry: U,
                level: Z,
              });
            }
        }
      };
    if (o) for (let k of y.shelves) C(k.x, k.z, k.ry, k.len, k.both);
    else
      (C(2.6, -c / 2 + 0.55, 0, 7.2), C(-a / 2 + 0.45, 0.9, Math.PI / 2, 6.2), C(a / 2 - 0.45, 0.9, -Math.PI / 2, 6.2));
    let P = o
      ? O7(t)
      : [
          { x: t.x + x, z: t.z + b, hw: 2, hd: 0.7 },
          { x: t.x + 2.6, z: t.z - c / 2 + 0.55, hw: 3.8, hd: 0.6 },
          { x: t.x - a / 2 + 0.45, z: t.z + 0.9, hw: 0.6, hd: 3.3 },
          { x: t.x + a / 2 - 0.45, z: t.z + 0.9, hw: 0.6, hd: 3.3 },
        ];
    F && !o && i.id !== "petshop" && (C(2.4, -0.4, 0, 3.6, !0), P.push({ x: t.x + 2.4, z: t.z - 0.4, hw: 2, hd: 0.8 })); // v112: ร้านสัตว์เลี้ยงไม่ตั้งชั้นกลางร้าน (บังคอกน้องหมา)
    let I = [];
    return (
      (n = n.filter((k) => !k.noShelf)), // v113: ตู้โชว์ (สินค้าชิ้นใหญ่) ไม่วางบนชั้น
      n.slice(0, T.length).forEach((k, D) => {
        let [L, q, $] = T[D],
          te = k.make();
        (te.position.set(L - Math.sin($) * 1, 0.85, q - Math.cos($) * 1),
          (te.rotation.y = $),
          te.traverse((O) => {
            O.castShadow = !0;
          }),
          r.add(te));
        let Y = new R(new Te(0.62, 0.22), new be({ map: ei(`${k.price}฿`, 16777215, 2366485, 192, 72) }));
        (Y.position.set(L - Math.sin($) * 0.62, 0.66, q - Math.cos($) * 0.62),
          (Y.rotation.y = $),
          r.add(Y),
          I.push({ key: k.key, label: k.label, price: k.price, pos: new H(L, 0, q).add(t), mesh: te }));
      }),
      e.add(r),
      {
        id: i.id,
        group: r,
        origin: t,
        exit: new H(t3, 0, c / 2 - 0.8).add(t),
        keeperSpot: new H(o ? y.keeper.x : x, 0, o ? y.keeper.z : b - 0.9).add(t),
        keeperYaw: o ? Math.PI : 0,
        wares: I,
        solids: P,
        decor: A,
        bounds: { x0: t.x - a / 2 + 0.5, x1: t.x + a / 2 - 0.5, z0: t.z - c / 2 + 0.5, z1: t.z + c / 2 - 0.4 },
        W: a,
        D: c,
      }
    );
  }
  var Jr = {
    aisle: { x0: 0.8, x1: 5.6 },
    counter: { x: -7.75, z: 5, len: 4.3, d: 0.9, armX: -6.05, armLen: 1.95, regX: -7.6, qx: -7.6, qz: 4 },
    keeper: { x: -7.9, z: 6.45 },
    queue: [
      [-7.6, 4],
      [-6.7, 4],
      [-5.8, 4],
      [-4.9, 3.9],
    ],
    shelves: [
      { x: -5.55, z: -6.95, ry: 0, len: 8.1, both: !1 },
      { x: 2.75, z: -6.95, ry: 0, len: 6.3, both: !1 },
      { x: -10.05, z: -1.6, ry: Math.PI / 2, len: 8.6, both: !1 },
      { x: -5.2, z: -0.6, ry: Math.PI / 2, len: 5.2, both: !0 },
    ],
  };
  function O7(i) {
    let e = (t, n, s, o) => ({ x: i.x + t, z: i.z + n, hw: s, hd: o });
    return [
      e(-5.55, -6.95, 4.1, 0.6),
      e(2.75, -6.95, 3.2, 0.6),
      e(-10.05, -1.6, 0.6, 4.35),
      e(-5.2, -0.6, 0.8, 2.65),
      e(-7.75, 5, 2.25, 0.5),
      e(-6.05, 6.45, 0.5, 1.05),
      e(-8.2, 6.5, 1.75, 1.05),
      e(-6.7, 3.45, 0.95, 0.06),
    ];
  }
  function N7(i, e) {
    return Qr(1024, Math.round((1024 * e) / i), (t) => {
      let s = Math.round((1024 * e) / i),
        o = 1024 / i;
      ((t.fillStyle = "#f4f2ee"),
        t.fillRect(0, 0, 1024, s),
        (t.strokeStyle = "rgba(170,165,155,.55)"),
        (t.lineWidth = 2));
      for (let l = 0; l <= i; l += 0.6) (t.beginPath(), t.moveTo(l * o, 0), t.lineTo(l * o, s), t.stroke());
      for (let l = 0; l <= e; l += 0.6) (t.beginPath(), t.moveTo(0, l * o), t.lineTo(1024, l * o), t.stroke());
      let r = Jr.aisle;
      t.fillStyle = "#ffd400";
      for (let l of [r.x0, r.x1]) t.fillRect((l + i / 2) * o - 5, 0.9 * o, 10, s - 1.2 * o);
      t.fillStyle = "rgba(255,212,0,.85)";
      let a = ((r.x0 + r.x1) / 2 + i / 2) * o;
      for (let l = 1.6; l < e - 2; l += 2.2) {
        let h = l * o;
        (t.beginPath(),
          t.moveTo(a, h),
          t.lineTo(a + 22, h + 26),
          t.lineTo(a + 8, h + 26),
          t.lineTo(a + 8, h + 50),
          t.lineTo(a - 8, h + 50),
          t.lineTo(a - 8, h + 26),
          t.lineTo(a - 22, h + 26),
          t.closePath(),
          t.fill());
      }
      let c = Jr.counter;
      ((t.strokeStyle = "#ffd400"),
        (t.lineWidth = 6),
        t.setLineDash([18, 12]),
        t.strokeRect((c.qx - 0.5 + i / 2) * o, (c.qz - 0.45 + e / 2) * o, 3.4 * o, 0.9 * o),
        t.setLineDash([]));
    });
  }
  function G7() {
    return Qr(256, 512, (i) => {
      ((i.fillStyle = "#1d1d22"),
        i.fillRect(0, 0, 256, 512 * 0.36),
        (i.fillStyle = "#ffe100"),
        i.fillRect(0, 512 * 0.36, 256, 512 * 0.05),
        (i.fillStyle = "#e60012"),
        i.fillRect(0, 512 * 0.41, 256, 6),
        (i.fillStyle = "#f3efe6"),
        i.fillRect(0, 512 * 0.41 + 6, 256, 512));
    });
  }
  var U7 = {
      petshop: "st_chow",
      chow: "st_chow",
      clinic: "st_clinic",
      groom: "st_groom",
      grocery: "st_grocery",
      pet: "st_pet",
    },
    V7 = (i) => window.__IMG?.[i] ?? `img/${i}.png`;
  function io(i, e, t, n = 256, s = 0.055) {
    let o = document.createElement("canvas");
    o.width = o.height = n;
    let r = o.getContext("2d"),
      a = new ut(o);
    ((a.colorSpace = Ye), (a.anisotropy = 4));
    let c = n / 2;
    (e !== void 0 && ((r.fillStyle = Fo(e)), r.beginPath(), r.arc(c, c, c - 2, 0, 7), r.fill()),
      t !== void 0 &&
        ((r.lineWidth = n * s),
        (r.strokeStyle = Fo(t)),
        r.beginPath(),
        r.arc(c, c, c - (n * s) / 2 - 2, 0, 7),
        r.stroke(),
        (r.lineWidth = n * 0.012),
        (r.strokeStyle = "#2b1a10"),
        r.beginPath(),
        r.arc(c, c, c - 2, 0, 7),
        r.stroke(),
        r.beginPath(),
        r.arc(c, c, c - n * s - 2, 0, 7),
        r.stroke()));
    let l = new Image();
    return (
      (l.onload = () => {
        let h = e !== void 0 ? n * (s + 0.06) : 0;
        (r.save(),
          e !== void 0 && (r.beginPath(), r.arc(c, c, c - n * s - 3, 0, 7), r.clip()),
          r.drawImage(l, h, h, n - h * 2, n - h * 2),
          r.restore(),
          (a.needsUpdate = !0));
      }),
      (l.src = V7(i)),
      a
    );
  }
  function r3(i) {
    return io(U7[i.id] ?? "st_main", 16777215, i.signFg, 256, 0.12);
  }
  function Os(i) {
    let e = new J(),
      t = new R(new re(0.22, 0.22, 0.45, 16), Ve(14677247, 0.05, { transparent: !0, opacity: 0.55 }));
    ((t.position.y = 0.22), e.add(t));
    for (let s = 0; s < 6; s++) {
      let o = new R(new re(0.08, 0.08, 0.03, 12), Ve(i, 0.7));
      (o.position.set(Math.cos(s) * 0.1, 0.06 + s * 0.06, Math.sin(s) * 0.1), e.add(o));
    }
    let n = new R(new re(0.23, 0.23, 0.06, 16), Ve(14829119, 0.4));
    return ((n.position.y = 0.47), e.add(n), e);
  }
  function Yy(i) {
    let e = new J(),
      t = new R(new re(0.03, 0.03, 0.9, 8), Ve(10185274));
    ((t.rotation.z = 0.5), t.position.set(0, 0.3, 0), e.add(t));
    let n = new R(new ee(0.28, 0.08, 0.14), Ve(i, 0.3, { metalness: 0.6 }));
    return (n.position.set(0.24, 0.66, 0), e.add(n), e);
  }
  function Zy() {
    let i = new J(),
      e = new R(new ee(0.8, 0.3, 0.5), Ve(13208139));
    ((e.position.y = 0.15), i.add(e));
    for (let t of [-0.2, 0.15]) {
      let n = new R(new we(0.13, 12, 10), Ve(16769126, 0.8));
      (n.position.set(t, 0.38, 0), i.add(n));
      let s = new R(new yt(0.03, 0.07, 6), Ve(16754224));
      ((s.rotation.x = Math.PI / 2), s.position.set(t, 0.39, 0.14), i.add(s));
    }
    return i;
  }
  function Ns(i) {
    let e = new J();
    if (i === "straw") {
      let t = new R(new re(0.3, 0.3, 0.03, 24), Ve(15254634));
      e.add(t);
      let n = new R(new re(0.15, 0.17, 0.15, 20), Ve(15254634));
      ((n.position.y = 0.08), e.add(n));
      let s = new R(new re(0.175, 0.175, 0.04, 20), Ve(14829119));
      ((s.position.y = 0.03), e.add(s));
    } else if (i === "ribbon") {
      for (let n of [-1, 1]) {
        let s = new R(new yt(0.1, 0.18, 8), Ve(16740241, 0.5));
        ((s.rotation.z = (n * Math.PI) / 2), (s.position.x = n * 0.1), e.add(s));
      }
      let t = new R(new we(0.05, 10, 8), Ve(16740241, 0.5));
      e.add(t);
    } else if (i === "crown") {
      let t = new R(new re(0.15, 0.14, 0.12, 6, 1, !0), Ve(16765503, 0.2, { metalness: 0.8, side: Ke }));
      ((t.position.y = 0.06), e.add(t));
      for (let n = 0; n < 6; n++) {
        let s = new R(new we(0.025, 8, 6), Ve(14829119, 0.2));
        (s.position.set(Math.cos(n) * 0.15, 0.13, Math.sin(n) * 0.15), e.add(s));
      }
    } else if (i === "beanie") {
      let t = new R(new we(0.2, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), Ve(4163272, 0.9));
      e.add(t);
      let n = new R(new vt(0.2, 0.04, 8, 24), Ve(16777215, 0.9));
      ((n.rotation.x = Math.PI / 2), e.add(n));
      let s = new R(new we(0.07, 10, 8), Ve(16777215, 0.9));
      ((s.position.y = 0.21), e.add(s));
    } else if (i === "party") {
      let t = new R(new yt(0.13, 0.36, 18), new X({ map: n3(16740241, 16765503), roughness: 0.6 }));
      ((t.position.y = 0.18), e.add(t));
      let n = new R(new we(0.05, 10, 8), Ve(6080757, 0.6));
      ((n.position.y = 0.37), e.add(n));
    } else if (i === "bowtie") {
      for (let n of [-1, 1]) {
        let s = new R(new yt(0.08, 0.15, 4), Ve(2366485, 0.4));
        ((s.rotation.z = (n * Math.PI) / 2), (s.position.x = n * 0.075), (s.scale.z = 0.5), e.add(s));
      }
      let t = new R(new we(0.035, 8, 6), Ve(2366485, 0.4));
      e.add(t);
    } else if (i === "scarf") {
      let t = new X({ map: n3(14829119, 16777215), roughness: 0.9 }),
        n = new R(new vt(0.24, 0.032, 8, 28), t);
      ((n.scale.z = 2.2), (n.rotation.x = Math.PI / 2 - 0.35), e.add(n));
      for (let [s, o] of [
        [0.05, 0.12],
        [-0.04, -0.1],
      ]) {
        let r = new R(new ee(0.09, 0.24, 0.025), t);
        (r.position.set(s, -0.33, 0.04), (r.rotation.z = o), n.add(r), (r.scale.z = 1 / 2.2));
      }
    } else if (i === "sunglasses" || i === "heartglasses") {
      let t = i === "heartglasses",
        n = Ve(t ? 16732043 : 1710626, 0.15, { metalness: 0.4, transparent: !0, opacity: 0.9 });
      for (let o of [-1, 1]) {
        let r = t
          ? (() => {
              let a = new mn();
              return (
                a.moveTo(0, -0.06),
                a.bezierCurveTo(-0.1, 0, -0.06, 0.08, 0, 0.035),
                a.bezierCurveTo(0.06, 0.08, 0.1, 0, 0, -0.06),
                new R(new Is(a), n)
              );
            })()
          : new R(new gt(0.065, 20), n);
        (r.position.set(o * 0.09, 0, 0), e.add(r));
      }
      let s = new R(new ee(0.06, 0.015, 0.015), Ve(2366485, 0.4));
      e.add(s);
      for (let o of [-1, 1]) {
        let r = new R(new ee(0.015, 0.015, 0.2), Ve(2366485, 0.4));
        (r.position.set(o * 0.15, 0, -0.1), e.add(r));
      }
    } else if (i === "bandana") {
      let t = new R(new yt(0.2, 0.22, 3), Ve(14829119, 0.7));
      ((t.rotation.x = Math.PI), (t.scale.z = 0.4), e.add(t));
    }
    return e;
  }
  var bp = {
    name: "CopyShader",
    uniforms: { tDiffuse: { value: null }, opacity: { value: 1 } },
    vertexShader: `

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,
    fragmentShader: `

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`,
  };
  var Ts = class {
      constructor() {
        ((this.isPass = !0), (this.enabled = !0), (this.needsSwap = !0), (this.clear = !1), (this.renderToScreen = !1));
      }
      setSize() {}
      render() {
        console.error("THREE.Pass: .render() must be implemented in derived pass.");
      }
      dispose() {}
    },
    W7 = new Ro(-1, 1, 1, -1, 0, 1),
    a3 = class extends qe {
      constructor() {
        (super(),
          this.setAttribute("position", new Fe([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3)),
          this.setAttribute("uv", new Fe([0, 2, 0, 0, 2, 0], 2)));
      }
    },
    q7 = new a3(),
    ea = class {
      constructor(e) {
        this._mesh = new R(q7, e);
      }
      dispose() {
        this._mesh.geometry.dispose();
      }
      render(e) {
        e.render(this._mesh, W7);
      }
      get material() {
        return this._mesh.material;
      }
      set material(e) {
        this._mesh.material = e;
      }
    };
  var xp = class extends Ts {
    constructor(e, t) {
      (super(),
        (this.textureID = t !== void 0 ? t : "tDiffuse"),
        e instanceof Qt
          ? ((this.uniforms = e.uniforms), (this.material = e))
          : e &&
            ((this.uniforms = fr.clone(e.uniforms)),
            (this.material = new Qt({
              name: e.name !== void 0 ? e.name : "unspecified",
              defines: Object.assign({}, e.defines),
              uniforms: this.uniforms,
              vertexShader: e.vertexShader,
              fragmentShader: e.fragmentShader,
            }))),
        (this.fsQuad = new ea(this.material)));
    }
    render(e, t, n) {
      (this.uniforms[this.textureID] && (this.uniforms[this.textureID].value = n.texture),
        (this.fsQuad.material = this.material),
        this.renderToScreen
          ? (e.setRenderTarget(null), this.fsQuad.render(e))
          : (e.setRenderTarget(t),
            this.clear && e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil),
            this.fsQuad.render(e)));
    }
    dispose() {
      (this.material.dispose(), this.fsQuad.dispose());
    }
  };
  var kh = class extends Ts {
      constructor(e, t) {
        (super(), (this.scene = e), (this.camera = t), (this.clear = !0), (this.needsSwap = !1), (this.inverse = !1));
      }
      render(e, t, n) {
        let s = e.getContext(),
          o = e.state;
        (o.buffers.color.setMask(!1),
          o.buffers.depth.setMask(!1),
          o.buffers.color.setLocked(!0),
          o.buffers.depth.setLocked(!0));
        let r, a;
        (this.inverse ? ((r = 0), (a = 1)) : ((r = 1), (a = 0)),
          o.buffers.stencil.setTest(!0),
          o.buffers.stencil.setOp(s.REPLACE, s.REPLACE, s.REPLACE),
          o.buffers.stencil.setFunc(s.ALWAYS, r, 4294967295),
          o.buffers.stencil.setClear(a),
          o.buffers.stencil.setLocked(!0),
          e.setRenderTarget(n),
          this.clear && e.clear(),
          e.render(this.scene, this.camera),
          e.setRenderTarget(t),
          this.clear && e.clear(),
          e.render(this.scene, this.camera),
          o.buffers.color.setLocked(!1),
          o.buffers.depth.setLocked(!1),
          o.buffers.color.setMask(!0),
          o.buffers.depth.setMask(!0),
          o.buffers.stencil.setLocked(!1),
          o.buffers.stencil.setFunc(s.EQUAL, 1, 4294967295),
          o.buffers.stencil.setOp(s.KEEP, s.KEEP, s.KEEP),
          o.buffers.stencil.setLocked(!0));
      }
    },
    yp = class extends Ts {
      constructor() {
        (super(), (this.needsSwap = !1));
      }
      render(e) {
        (e.state.buffers.stencil.setLocked(!1), e.state.buffers.stencil.setTest(!1));
      }
    };
  var Mp = class {
    constructor(e, t) {
      if (((this.renderer = e), (this._pixelRatio = e.getPixelRatio()), t === void 0)) {
        let n = e.getSize(new me());
        ((this._width = n.width),
          (this._height = n.height),
          (t = new qn(this._width * this._pixelRatio, this._height * this._pixelRatio, { type: Zi })),
          (t.texture.name = "EffectComposer.rt1"));
      } else ((this._width = t.width), (this._height = t.height));
      ((this.renderTarget1 = t),
        (this.renderTarget2 = t.clone()),
        (this.renderTarget2.texture.name = "EffectComposer.rt2"),
        (this.writeBuffer = this.renderTarget1),
        (this.readBuffer = this.renderTarget2),
        (this.renderToScreen = !0),
        (this.passes = []),
        (this.copyPass = new xp(bp)),
        (this.copyPass.material.blending = Qs),
        (this.clock = new vc()));
    }
    swapBuffers() {
      let e = this.readBuffer;
      ((this.readBuffer = this.writeBuffer), (this.writeBuffer = e));
    }
    addPass(e) {
      (this.passes.push(e), e.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio));
    }
    insertPass(e, t) {
      (this.passes.splice(t, 0, e), e.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio));
    }
    removePass(e) {
      let t = this.passes.indexOf(e);
      t !== -1 && this.passes.splice(t, 1);
    }
    isLastEnabledPass(e) {
      for (let t = e + 1; t < this.passes.length; t++) if (this.passes[t].enabled) return !1;
      return !0;
    }
    render(e) {
      e === void 0 && (e = this.clock.getDelta());
      let t = this.renderer.getRenderTarget(),
        n = !1;
      for (let s = 0, o = this.passes.length; s < o; s++) {
        let r = this.passes[s];
        if (r.enabled !== !1) {
          if (
            ((r.renderToScreen = this.renderToScreen && this.isLastEnabledPass(s)),
            r.render(this.renderer, this.writeBuffer, this.readBuffer, e, n),
            r.needsSwap)
          ) {
            if (n) {
              let a = this.renderer.getContext(),
                c = this.renderer.state.buffers.stencil;
              (c.setFunc(a.NOTEQUAL, 1, 4294967295),
                this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, e),
                c.setFunc(a.EQUAL, 1, 4294967295));
            }
            this.swapBuffers();
          }
          kh !== void 0 && (r instanceof kh ? (n = !0) : r instanceof yp && (n = !1));
        }
      }
      this.renderer.setRenderTarget(t);
    }
    reset(e) {
      if (e === void 0) {
        let t = this.renderer.getSize(new me());
        ((this._pixelRatio = this.renderer.getPixelRatio()),
          (this._width = t.width),
          (this._height = t.height),
          (e = this.renderTarget1.clone()),
          e.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio));
      }
      (this.renderTarget1.dispose(),
        this.renderTarget2.dispose(),
        (this.renderTarget1 = e),
        (this.renderTarget2 = e.clone()),
        (this.writeBuffer = this.renderTarget1),
        (this.readBuffer = this.renderTarget2));
    }
    setSize(e, t) {
      ((this._width = e), (this._height = t));
      let n = this._width * this._pixelRatio,
        s = this._height * this._pixelRatio;
      (this.renderTarget1.setSize(n, s), this.renderTarget2.setSize(n, s));
      for (let o = 0; o < this.passes.length; o++) this.passes[o].setSize(n, s);
    }
    setPixelRatio(e) {
      ((this._pixelRatio = e), this.setSize(this._width, this._height));
    }
    dispose() {
      (this.renderTarget1.dispose(), this.renderTarget2.dispose(), this.copyPass.dispose());
    }
  };
  var Tp = class extends Ts {
    constructor(e, t, n = null, s = null, o = null) {
      (super(),
        (this.scene = e),
        (this.camera = t),
        (this.overrideMaterial = n),
        (this.clearColor = s),
        (this.clearAlpha = o),
        (this.clear = !0),
        (this.clearDepth = !1),
        (this.needsSwap = !1),
        (this._oldClearColor = new ae()));
    }
    render(e, t, n) {
      let s = e.autoClear;
      e.autoClear = !1;
      let o, r;
      (this.overrideMaterial !== null &&
        ((r = this.scene.overrideMaterial), (this.scene.overrideMaterial = this.overrideMaterial)),
        this.clearColor !== null &&
          (e.getClearColor(this._oldClearColor), e.setClearColor(this.clearColor, e.getClearAlpha())),
        this.clearAlpha !== null && ((o = e.getClearAlpha()), e.setClearAlpha(this.clearAlpha)),
        this.clearDepth == !0 && e.clearDepth(),
        e.setRenderTarget(this.renderToScreen ? null : n),
        this.clear === !0 && e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil),
        e.render(this.scene, this.camera),
        this.clearColor !== null && e.setClearColor(this._oldClearColor),
        this.clearAlpha !== null && e.setClearAlpha(o),
        this.overrideMaterial !== null && (this.scene.overrideMaterial = r),
        (e.autoClear = s));
    }
  };
  var Jy = {
    name: "LuminosityHighPassShader",
    shaderID: "luminosityHighPass",
    uniforms: {
      tDiffuse: { value: null },
      luminosityThreshold: { value: 1 },
      smoothWidth: { value: 1 },
      defaultColor: { value: new ae(0) },
      defaultOpacity: { value: 0 },
    },
    vertexShader: `

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,
    fragmentShader: `

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`,
  };
  var zc = class i extends Ts {
    constructor(e, t, n, s) {
      (super(),
        (this.strength = t !== void 0 ? t : 1),
        (this.radius = n),
        (this.threshold = s),
        (this.resolution = e !== void 0 ? new me(e.x, e.y) : new me(256, 256)),
        (this.clearColor = new ae(0, 0, 0)),
        (this.renderTargetsHorizontal = []),
        (this.renderTargetsVertical = []),
        (this.nMips = 5));
      let o = Math.round(this.resolution.x / 2),
        r = Math.round(this.resolution.y / 2);
      ((this.renderTargetBright = new qn(o, r, { type: Zi })),
        (this.renderTargetBright.texture.name = "UnrealBloomPass.bright"),
        (this.renderTargetBright.texture.generateMipmaps = !1));
      for (let f = 0; f < this.nMips; f++) {
        let d = new qn(o, r, { type: Zi });
        ((d.texture.name = "UnrealBloomPass.h" + f),
          (d.texture.generateMipmaps = !1),
          this.renderTargetsHorizontal.push(d));
        let u = new qn(o, r, { type: Zi });
        ((u.texture.name = "UnrealBloomPass.v" + f),
          (u.texture.generateMipmaps = !1),
          this.renderTargetsVertical.push(u),
          (o = Math.round(o / 2)),
          (r = Math.round(r / 2)));
      }
      let a = Jy;
      ((this.highPassUniforms = fr.clone(a.uniforms)),
        (this.highPassUniforms.luminosityThreshold.value = s),
        (this.highPassUniforms.smoothWidth.value = 0.01),
        (this.materialHighPassFilter = new Qt({
          uniforms: this.highPassUniforms,
          vertexShader: a.vertexShader,
          fragmentShader: a.fragmentShader,
        })),
        (this.separableBlurMaterials = []));
      let c = [3, 5, 7, 9, 11];
      ((o = Math.round(this.resolution.x / 2)), (r = Math.round(this.resolution.y / 2)));
      for (let f = 0; f < this.nMips; f++)
        (this.separableBlurMaterials.push(this.getSeperableBlurMaterial(c[f])),
          (this.separableBlurMaterials[f].uniforms.invSize.value = new me(1 / o, 1 / r)),
          (o = Math.round(o / 2)),
          (r = Math.round(r / 2)));
      ((this.compositeMaterial = this.getCompositeMaterial(this.nMips)),
        (this.compositeMaterial.uniforms.blurTexture1.value = this.renderTargetsVertical[0].texture),
        (this.compositeMaterial.uniforms.blurTexture2.value = this.renderTargetsVertical[1].texture),
        (this.compositeMaterial.uniforms.blurTexture3.value = this.renderTargetsVertical[2].texture),
        (this.compositeMaterial.uniforms.blurTexture4.value = this.renderTargetsVertical[3].texture),
        (this.compositeMaterial.uniforms.blurTexture5.value = this.renderTargetsVertical[4].texture),
        (this.compositeMaterial.uniforms.bloomStrength.value = t),
        (this.compositeMaterial.uniforms.bloomRadius.value = 0.1));
      let l = [1, 0.8, 0.6, 0.4, 0.2];
      ((this.compositeMaterial.uniforms.bloomFactors.value = l),
        (this.bloomTintColors = [new H(1, 1, 1), new H(1, 1, 1), new H(1, 1, 1), new H(1, 1, 1), new H(1, 1, 1)]),
        (this.compositeMaterial.uniforms.bloomTintColors.value = this.bloomTintColors));
      let h = bp;
      ((this.copyUniforms = fr.clone(h.uniforms)),
        (this.blendMaterial = new Qt({
          uniforms: this.copyUniforms,
          vertexShader: h.vertexShader,
          fragmentShader: h.fragmentShader,
          blending: $i,
          depthTest: !1,
          depthWrite: !1,
          transparent: !0,
        })),
        (this.enabled = !0),
        (this.needsSwap = !1),
        (this._oldClearColor = new ae()),
        (this.oldClearAlpha = 1),
        (this.basic = new be()),
        (this.fsQuad = new ea(null)));
    }
    dispose() {
      for (let e = 0; e < this.renderTargetsHorizontal.length; e++) this.renderTargetsHorizontal[e].dispose();
      for (let e = 0; e < this.renderTargetsVertical.length; e++) this.renderTargetsVertical[e].dispose();
      this.renderTargetBright.dispose();
      for (let e = 0; e < this.separableBlurMaterials.length; e++) this.separableBlurMaterials[e].dispose();
      (this.compositeMaterial.dispose(), this.blendMaterial.dispose(), this.basic.dispose(), this.fsQuad.dispose());
    }
    setSize(e, t) {
      let n = Math.round(e / 2),
        s = Math.round(t / 2);
      this.renderTargetBright.setSize(n, s);
      for (let o = 0; o < this.nMips; o++)
        (this.renderTargetsHorizontal[o].setSize(n, s),
          this.renderTargetsVertical[o].setSize(n, s),
          (this.separableBlurMaterials[o].uniforms.invSize.value = new me(1 / n, 1 / s)),
          (n = Math.round(n / 2)),
          (s = Math.round(s / 2)));
    }
    render(e, t, n, s, o) {
      (e.getClearColor(this._oldClearColor), (this.oldClearAlpha = e.getClearAlpha()));
      let r = e.autoClear;
      ((e.autoClear = !1),
        e.setClearColor(this.clearColor, 0),
        o && e.state.buffers.stencil.setTest(!1),
        this.renderToScreen &&
          ((this.fsQuad.material = this.basic),
          (this.basic.map = n.texture),
          e.setRenderTarget(null),
          e.clear(),
          this.fsQuad.render(e)),
        (this.highPassUniforms.tDiffuse.value = n.texture),
        (this.highPassUniforms.luminosityThreshold.value = this.threshold),
        (this.fsQuad.material = this.materialHighPassFilter),
        e.setRenderTarget(this.renderTargetBright),
        e.clear(),
        this.fsQuad.render(e));
      let a = this.renderTargetBright;
      for (let c = 0; c < this.nMips; c++)
        ((this.fsQuad.material = this.separableBlurMaterials[c]),
          (this.separableBlurMaterials[c].uniforms.colorTexture.value = a.texture),
          (this.separableBlurMaterials[c].uniforms.direction.value = i.BlurDirectionX),
          e.setRenderTarget(this.renderTargetsHorizontal[c]),
          e.clear(),
          this.fsQuad.render(e),
          (this.separableBlurMaterials[c].uniforms.colorTexture.value = this.renderTargetsHorizontal[c].texture),
          (this.separableBlurMaterials[c].uniforms.direction.value = i.BlurDirectionY),
          e.setRenderTarget(this.renderTargetsVertical[c]),
          e.clear(),
          this.fsQuad.render(e),
          (a = this.renderTargetsVertical[c]));
      ((this.fsQuad.material = this.compositeMaterial),
        (this.compositeMaterial.uniforms.bloomStrength.value = this.strength),
        (this.compositeMaterial.uniforms.bloomRadius.value = this.radius),
        (this.compositeMaterial.uniforms.bloomTintColors.value = this.bloomTintColors),
        e.setRenderTarget(this.renderTargetsHorizontal[0]),
        e.clear(),
        this.fsQuad.render(e),
        (this.fsQuad.material = this.blendMaterial),
        (this.copyUniforms.tDiffuse.value = this.renderTargetsHorizontal[0].texture),
        o && e.state.buffers.stencil.setTest(!0),
        this.renderToScreen
          ? (e.setRenderTarget(null), this.fsQuad.render(e))
          : (e.setRenderTarget(n), this.fsQuad.render(e)),
        e.setClearColor(this._oldClearColor, this.oldClearAlpha),
        (e.autoClear = r));
    }
    getSeperableBlurMaterial(e) {
      let t = [];
      for (let n = 0; n < e; n++) t.push((0.39894 * Math.exp((-0.5 * n * n) / (e * e))) / e);
      return new Qt({
        defines: { KERNEL_RADIUS: e },
        uniforms: {
          colorTexture: { value: null },
          invSize: { value: new me(0.5, 0.5) },
          direction: { value: new me(0.5, 0.5) },
          gaussianCoefficients: { value: t },
        },
        vertexShader: `varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,
        fragmentShader: `#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`,
      });
    }
    getCompositeMaterial(e) {
      return new Qt({
        defines: { NUM_MIPS: e },
        uniforms: {
          blurTexture1: { value: null },
          blurTexture2: { value: null },
          blurTexture3: { value: null },
          blurTexture4: { value: null },
          blurTexture5: { value: null },
          bloomStrength: { value: 1 },
          bloomFactors: { value: null },
          bloomTintColors: { value: null },
          bloomRadius: { value: 0 },
        },
        vertexShader: `varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,
        fragmentShader: `varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`,
      });
    }
  };
  zc.BlurDirectionX = new me(1, 0);
  zc.BlurDirectionY = new me(0, 1);
  var Qy = {
    name: "OutputShader",
    uniforms: { tDiffuse: { value: null }, toneMappingExposure: { value: 1 } },
    vertexShader: `
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,
    fragmentShader: `
	
		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`,
  };
  var wp = class extends Ts {
    constructor() {
      super();
      let e = Qy;
      ((this.uniforms = fr.clone(e.uniforms)),
        (this.material = new yc({
          name: e.name,
          uniforms: this.uniforms,
          vertexShader: e.vertexShader,
          fragmentShader: e.fragmentShader,
        })),
        (this.fsQuad = new ea(this.material)),
        (this._outputColorSpace = null),
        (this._toneMapping = null));
    }
    render(e, t, n) {
      ((this.uniforms.tDiffuse.value = n.texture),
        (this.uniforms.toneMappingExposure.value = e.toneMappingExposure),
        (this._outputColorSpace !== e.outputColorSpace || this._toneMapping !== e.toneMapping) &&
          ((this._outputColorSpace = e.outputColorSpace),
          (this._toneMapping = e.toneMapping),
          (this.material.defines = {}),
          Bt.getTransfer(this._outputColorSpace) === tn && (this.material.defines.SRGB_TRANSFER = ""),
          this._toneMapping === Uu
            ? (this.material.defines.LINEAR_TONE_MAPPING = "")
            : this._toneMapping === Vu
              ? (this.material.defines.REINHARD_TONE_MAPPING = "")
              : this._toneMapping === Wu
                ? (this.material.defines.CINEON_TONE_MAPPING = "")
                : this._toneMapping === Rc
                  ? (this.material.defines.ACES_FILMIC_TONE_MAPPING = "")
                  : this._toneMapping === qu
                    ? (this.material.defines.AGX_TONE_MAPPING = "")
                    : this._toneMapping === ju && (this.material.defines.NEUTRAL_TONE_MAPPING = ""),
          (this.material.needsUpdate = !0)),
        this.renderToScreen === !0
          ? (e.setRenderTarget(null), this.fsQuad.render(e))
          : (e.setRenderTarget(t),
            this.clear && e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil),
            this.fsQuad.render(e)));
    }
    dispose() {
      (this.material.dispose(), this.fsQuad.dispose());
    }
  };
  var kt = (i, e = 0.6, t = {}) => new X({ color: i, roughness: e, ...t }),
    zt = (i, e, t, n = 0, s = 0, o = 0, r = 1, a = 1, c = 1, l = 0, h = 0, f = 0) => {
      let d = new R(e, t);
      return (d.position.set(n, s, o), d.scale.set(r, a, c), d.rotation.set(l, h, f), (d.castShadow = !0), i.add(d), d);
    },
    Bi = (i, e = 16, t = 12) => new we(i, e, t),
    c3 = (i, e, t, n, s = 0) => {
      zt(i, new re(t, t, e, 12), n, 0, s, 0, 1, 1, 1, 0, 0, Math.PI / 2);
      for (let o of [-1, 1]) for (let r of [-1, 1]) zt(i, Bi(t * 1.35), n, (o * e) / 2, s, r * t * 1.1);
    },
    pi = [
      {
        name: "น่องไก่",
        icon: "🍗",
        note: "กระดูกไก่สุกแตกเป็นเสี้ยน ของจริงแกะเนื้อให้แทน",
        stamina: 6,
        score: 10,
        make: () => {
          let i = new J(),
            e = kt(13202990, 0.45);
          return (
            zt(i, Bi(0.2), e, 0.08, 0.16, 0, 1.3, 0.9, 1),
            zt(i, new re(0.04, 0.045, 0.3, 10), kt(15983560), -0.2, 0.12, 0, 1, 1, 1, 0, 0, Math.PI / 2.3),
            zt(i, Bi(0.06), kt(15983560), -0.35, 0.06, 0.03),
            zt(i, Bi(0.06), kt(15983560), -0.35, 0.06, -0.04),
            i
          );
        },
      },
      {
        name: "สเต๊กติดกระดูก",
        icon: "🥩",
        note: "เนื้อต้มไม่ปรุงรสให้ได้ แต่กระดูกสุกอย่าให้แทะ",
        stamina: 8,
        score: 12,
        make: () => {
          let i = new J();
          (zt(i, new re(0.24, 0.26, 0.12, 20), kt(10107428, 0.5), 0, 0.12, 0, 1.2, 1, 1),
            zt(i, new re(0.1, 0.1, 0.125, 16), kt(15764106, 0.6), 0.12, 0.12, 0.05));
          let e = new J();
          return (c3(e, 0.5, 0.035, kt(15983560)), (e.position.y = 0.2), (e.rotation.y = 0.4), i.add(e), i);
        },
      },
      {
        name: "ไส้กรอก",
        icon: "🌭",
        note: "ไส้กรอกเค็มและมันเยอะ ให้แค่ชิ้นเล็ก ๆ นาน ๆ ครั้ง",
        stamina: 4,
        score: 8,
        make: () => {
          let i = new J();
          for (let e = 0; e < 3; e++)
            zt(
              i,
              new Ri(0.06, 0.3, 6, 12),
              kt(13129018, 0.35),
              -0.14 + e * 0.14,
              0.07,
              0,
              1,
              1,
              1,
              Math.PI / 2,
              0,
              (e - 1) * 0.15,
            );
          return i;
        },
      },
      {
        name: "ปลาแซลมอนย่าง",
        icon: "🐟",
        note: "ปลาสุกแกะก้างให้ได้ มีโอเมก้าดีต่อขน",
        stamina: 8,
        score: 12,
        make: () => {
          let i = new J();
          (zt(i, Bi(0.18, 18, 12), kt(15895642, 0.4), 0, 0.1, 0, 1.6, 0.55, 0.7),
            zt(i, new yt(0.12, 0.2, 4), kt(14711370, 0.4), -0.36, 0.1, 0, 1, 1, 0.3, 0, 0, Math.PI / 2));
          for (let e = 0; e < 4; e++) zt(i, new ee(0.02, 0.06, 0.18), kt(9062954, 0.6), -0.15 + e * 0.1, 0.18, 0);
          return (zt(i, Bi(0.025), kt(2366485), 0.23, 0.13, 0.08), i);
        },
      },
      {
        name: "ไข่ต้ม",
        icon: "🥚",
        note: "ไข่ต้มสุกให้ได้ มีโปรตีนดี วันละฟองพอ",
        stamina: 6,
        score: 8,
        make: () => {
          let i = new J();
          return (
            zt(i, Bi(0.14), kt(16775406, 0.4), 0, 0.1, 0, 1, 0.55, 1.3),
            zt(i, Bi(0.07), kt(16762158, 0.5), 0, 0.15, 0, 1, 0.4, 1),
            i
          );
        },
      },
      {
        name: "ข้าวไข่",
        icon: "🍚",
        note: "ข้าวสวยกับไข่สุก ไม่ใส่ซีอิ๊ว เป็นมื้อเบา ๆ ได้",
        stamina: 10,
        score: 12,
        make: () => {
          let i = new J();
          return (
            zt(i, new re(0.26, 0.17, 0.16, 24), kt(6080757, 0.3), 0, 0.08, 0),
            zt(i, Bi(0.22, 16, 10), kt(16777215, 0.8), 0, 0.15, 0, 1, 0.4, 1),
            zt(i, new re(0.13, 0.14, 0.03, 20), kt(16775406, 0.5), 0.02, 0.24, 0),
            zt(i, Bi(0.055), kt(16756768, 0.4), 0.02, 0.26, 0, 1, 0.5, 1),
            i
          );
        },
      },
      {
        name: "ฟักทองนึ่ง",
        icon: "🎃",
        note: "ฟักทองนึ่งช่วยเรื่องขับถ่าย ให้นิดหน่อยได้",
        stamina: 6,
        score: 8,
        make: () => {
          let i = new J();
          for (let e = 0; e < 6; e++)
            zt(i, Bi(0.12), kt(15895592, 0.5), Math.cos(e) * 0.09, 0.13, Math.sin(e) * 0.09, 0.8, 1, 1.1, 0, e, 0);
          return (zt(i, new re(0.025, 0.03, 0.1, 8), kt(4885040), 0, 0.28, 0), i);
        },
      },
      {
        name: "แครอท",
        icon: "🥕",
        note: "แครอทดิบหรือต้มเป็นขนมกรุบ ๆ ได้ ช่วยขัดฟัน",
        stamina: 4,
        score: 6,
        make: () => {
          let i = new J();
          zt(i, new yt(0.07, 0.42, 12), kt(16747050, 0.5), 0, 0.07, 0, 1, 1, 1, 0, 0, Math.PI / 2);
          for (let e = 0; e < 3; e++)
            zt(
              i,
              new yt(0.025, 0.16, 6),
              kt(6075454),
              -0.27,
              0.1 + e * 0.02,
              (e - 1) * 0.03,
              1,
              1,
              1,
              0,
              0,
              Math.PI / 2 + (e - 1) * 0.4,
            );
          return i;
        },
      },
      {
        name: "แอปเปิ้ล",
        icon: "🍎",
        note: "แอปเปิ้ลหั่นชิ้นให้ได้ แต่ต้องเอาเมล็ดออก",
        stamina: 4,
        score: 6,
        make: () => {
          let i = new J();
          return (
            zt(i, Bi(0.14), kt(14829119, 0.3), 0, 0.14, 0, 1, 0.92, 1),
            zt(i, new re(0.012, 0.012, 0.08, 6), kt(7029280), 0, 0.29, 0),
            zt(i, Bi(0.05), kt(6075454, 0.5), 0.04, 0.3, 0, 1, 0.3, 0.6),
            i
          );
        },
      },
      {
        name: "แตงโม",
        icon: "🍉",
        note: "แตงโมเอาเมล็ดกับเปลือกออก ให้คลายร้อนได้",
        stamina: 7,
        score: 8,
        make: () => {
          let i = new J();
          (zt(
            i,
            new re(0.28, 0.28, 0.08, 24, 1, !1, 0, Math.PI),
            kt(16734830, 0.4),
            0,
            0.15,
            0,
            1,
            1,
            1,
            Math.PI / 2,
            0,
            0,
          ),
            zt(i, new vt(0.28, 0.03, 6, 24, Math.PI), kt(4103738, 0.4), 0, 0.15, 0, 1, 1, 1.3, 0, 0, 0));
          for (let e = 0; e < 5; e++)
            zt(i, Bi(0.015), kt(2366485), -0.15 + e * 0.075, 0.25 - Math.abs(e - 2) * 0.03, 0.045);
          return i;
        },
      },
      {
        name: "บลูเบอร์รี่",
        icon: "🫐",
        note: "บลูเบอร์รี่เป็นขนมสุขภาพ ให้ทีละไม่กี่ลูก",
        stamina: 4,
        score: 6,
        make: () => {
          let i = new J();
          zt(i, new re(0.2, 0.14, 0.1, 20), kt(16773577, 0.6), 0, 0.05, 0);
          for (let e = 0; e < 9; e++)
            zt(
              i,
              Bi(0.045, 10, 8),
              kt(4868784, 0.3),
              (Math.cos(e * 2.2) * 0.1 * (e % 3)) / 2,
              0.12 + (e % 2) * 0.03,
              (Math.sin(e * 2.2) * 0.1 * (e % 3)) / 2,
            );
          return i;
        },
      },
      {
        name: "บิสกิตกระดูก",
        icon: "🍪",
        note: "ขนมสำหรับหมาโดยเฉพาะ ให้เป็นรางวัลตอนฝึก",
        stamina: 5,
        score: 8,
        make: () => {
          let i = new J(),
            e = new J();
          (c3(e, 0.26, 0.06, kt(14260821, 0.8)), e.scale.set(1, 0.6, 1), i.add(e), (e.position.y = 0.06));
          let t = e.clone();
          return (t.position.set(0.05, 0.12, 0.06), (t.rotation.y = 0.7), i.add(t), i);
        },
      },
      {
        name: "ช็อกโกแลต",
        icon: "🍫",
        note: "⚠️ ช็อกโกแลตเป็นพิษต่อหมา! เก็บทิ้งไม่ให้น้องกิน",
        stamina: -15,
        score: 5,
        make: () => {
          let i = new J();
          zt(i, new ee(0.34, 0.05, 0.22), kt(5910560, 0.4), 0, 0.04, 0);
          for (let e = 0; e < 3; e++)
            for (let t = 0; t < 2; t++)
              zt(i, new ee(0.09, 0.03, 0.08), kt(7027238, 0.4), -0.11 + e * 0.11, 0.08, -0.05 + t * 0.1);
          return (zt(i, new ee(0.2, 0.06, 0.23), kt(14041146, 0.5), 0.12, 0.05, 0), i);
        },
      },
      {
        name: "องุ่น",
        icon: "🍇",
        note: "⚠️ องุ่นทำไตหมาวายได้! ห้ามให้กินเด็ดขาด",
        stamina: -15,
        score: 5,
        make: () => {
          let i = new J();
          for (let e = 0; e < 10; e++) {
            let t = Math.floor(e / 4);
            zt(i, Bi(0.05, 10, 8), kt(8081361, 0.3), ((e % 4) - 1.5) * 0.08 + t * 0.03, 0.08 + (2 - t) * 0.08, 0);
          }
          return (zt(i, new re(0.01, 0.01, 0.1, 6), kt(7029280), 0.05, 0.32, 0), i);
        },
      },
    ];
  function eM() {
    let i = new J(),
      e = new J();
    return (c3(e, 0.44, 0.055, kt(16446438, 0.5)), (e.position.y = 0.09), i.add(e), i);
  }
  function l3() {
    let i = new J(),
      e = kt(8014374, 0.45);
    for (let t = 0; t < 3; t++)
      zt(i, new vt(0.13 - t * 0.035, 0.06 - t * 0.008, 8, 18), e, 0, 0.06 + t * 0.08, 0, 1, 1, 1, Math.PI / 2, 0, 0);
    return (zt(i, new yt(0.05, 0.1, 8), e, 0, 0.3, 0), i);
  }
  function tM() {
    let i = new J(),
      e = kt(8377328, 0.05, { transparent: !0, opacity: 0.55, metalness: 0.1 }),
      t = [
        [0, 0],
        [0.15, 0],
        [0.165, 0.03],
        [0.165, 0.42],
        [0.15, 0.5],
        [0.07, 0.6],
        [0.055, 0.66],
        [0.055, 0.7],
      ].map(([s, o]) => new me(s, o)),
      n = new R(new ks(t, 24), e);
    i.add(n);
    for (let s of [0.12, 0.24, 0.36]) {
      let o = new R(new vt(0.166, 0.01, 6, 24), e);
      ((o.rotation.x = Math.PI / 2), (o.position.y = s), i.add(o));
    }
    return (
      zt(i, new re(0.168, 0.168, 0.14, 24, 1, !0), kt(4163272, 0.5, { side: Ke }), 0, 0.3, 0),
      zt(i, new re(0.06, 0.06, 0.06, 16), kt(1929174, 0.4), 0, 0.73, 0),
      zt(i, new re(0.15, 0.15, 0.36, 20), kt(12577275, 0.1, { transparent: !0, opacity: 0.45 }), 0, 0.2, 0),
      i
    );
  }
  var j7 = [
      [
        "sasuage_003",
        "ไส้กรอก",
        "🌭",
        "ไส้กรอกเค็มและมันเยอะ ให้แค่ชิ้นเล็กนาน ๆ ครั้ง",
        4,
        8,
        2,
      ],
      [
        "fish_004",
        "ปลาย่าง",
        "🐟",
        "ปลาสุกไม่ปรุงรส แกะก้างออกให้หมดก่อนนะ",
        8,
        12,
        3,
      ],
      [
        "shrimp_001",
        "กุ้งต้ม",
        "🦐",
        "กุ้งต้มสุก แกะเปลือกและหางออก ให้นิดหน่อยพอ",
        6,
        10,
        2,
      ],
      [
        "egg_001",
        "ไข่ต้ม",
        "🥚",
        "ไข่ต้มสุกให้ได้ โปรตีนดี วันละไม่เกินครึ่งฟอง",
        7,
        10,
        2,
      ],
      [
        "egg_003",
        "ไข่ดาว",
        "🍳",
        "ไข่ดาวใช้น้ำมัน ถ้าจะให้ทอดแบบไม่ใส่เกลือ ไม่ใส่ซอส",
        5,
        8,
        2,
      ],
      [
        "egg_004",
        "ไข่ต้มผ่าครึ่ง",
        "🥚",
        "ไข่ต้มสุกผ่าครึ่ง ขนาดกำลังดีสำหรับน้อง",
        7,
        10,
        2,
      ],
      [
        "watermelon_002",
        "แตงโมผ่าซีก",
        "🍉",
        "แตงโมเอาเมล็ดกับเปลือกออก ฉ่ำน้ำคลายร้อน",
        6,
        10,
        2,
      ],
      [
        "watermelon_003",
        "แตงโมชิ้น",
        "🍉",
        "แตงโมชิ้นเล็ก ไม่มีเมล็ด กินคลายร้อน",
        6,
        10,
        2,
      ],
      [
        "egg_002",
        "ไข่ต้มทั้งฟอง",
        "🥚",
        "ไข่ต้มสุก ปอกเปลือกก่อนให้น้องนะ",
        7,
        10,
        1.5,
      ],
      [
        "shrimp_002",
        "กุ้งแกะเปลือก",
        "🦐",
        "กุ้งสุกแกะเปลือกแล้ว ให้ทีละนิด",
        6,
        10,
        1.5,
      ],
      [
        "watermelon_001",
        "แตงโมทั้งลูก",
        "🍉",
        "แตงโมลูกโต! แบ่งกินชิ้นเล็ก ๆ ไม่เอาเมล็ด",
        8,
        14,
        0.8,
        30,
      ],
      [
        "pepper_003",
        "พริกหยวก",
        "🫑",
        "พริกหยวกไม่เผ็ด มีวิตามินซี ให้หั่นชิ้นเล็กได้",
        3,
        6,
        1,
      ],
      [
        "sandwich_003",
        "ขนมปังปิ้ง",
        "🍞",
        "ขนมปังปิ้งเปล่า ๆ ให้นิดหน่อยได้",
        3,
        6,
        1,
      ],
      [
        "cookie_011",
        "คุกกี้เนย",
        "🍪",
        "คุกกี้คนหวานมัน อาจมีส่วนผสมอันตราย ให้ไม่ได้",
        1,
        4,
        0.8,
      ],
      [
        "ice_cream_003",
        "ไอติมแท่ง",
        "🍦",
        "หวานเย็นแต่มีนมกับน้ำตาลเยอะ ไม่เหมาะกับน้อง",
        1,
        4,
        0.8,
        5,
      ],
      [
        "pastry_002",
        "เพสตรี้",
        "🥮",
        "แป้งกับเนยเยอะ ให้แค่คำเล็กมาก ๆ",
        1,
        4,
        0.8,
      ],
      [
        "bottle_002",
        "น้ำเปล่าขวด",
        "💧",
        "น้ำสะอาดคือเครื่องดื่มที่ดีที่สุดของน้องหมา",
        3,
        6,
        2.2,
        45,
      ],
      [
        "glass_004",
        "น้ำเย็นแก้ว",
        "🥛",
        "น้ำเย็นชื่นใจ ช่วยคลายร้อน",
        2,
        5,
        2,
        35,
      ],
      [
        "glass_005",
        "น้ำมะพร้าว",
        "🥥",
        "น้ำมะพร้าวให้ได้นิดหน่อย มีโพแทสเซียมสูง ไม่ควรให้บ่อย",
        2,
        6,
        1.2,
        25,
      ],
      [
        "yogurt_002",
        "โยเกิร์ตรสธรรมชาติ",
        "🥣",
        "โยเกิร์ตไม่หวาน ไม่ใส่ไซลิทอล ให้ได้นิดหน่อย",
        3,
        6,
        1,
        8,
      ],
      [
        "cup_003",
        "นมวัว",
        "🥛",
        "หมาหลายตัวย่อยแลคโตสไม่ได้ อาจท้องเสีย ให้น้อยมาก",
        1,
        4,
        0.8,
        10,
      ],
      [
        "can_009",
        "น้ำอัดลม",
        "🥤",
        "⚠️ น้ำตาลสูง บางยี่ห้อมีคาเฟอีน อย่าให้น้องดื่ม",
        -6,
        10,
        0.5,
      ],
      [
        "tea_003",
        "ชา",
        "🍵",
        "⚠️ ชามีคาเฟอีน เป็นอันตรายต่อหมา",
        -10,
        12,
        0.5,
      ],
      [
        "onion_003",
        "หอมแดง",
        "🧅",
        "⚠️ หอมทุกชนิดทำลายเม็ดเลือดแดงของหมา",
        -12,
        15,
        0.5,
      ],
      [
        "mushroom_006",
        "เห็ดป่า",
        "🍄",
        "⚠️ เห็ดป่าบางชนิดมีพิษร้ายแรง",
        -12,
        15,
        0.5,
      ],
      [
        "sandwich_002",
        "ขนมปังแผ่น",
        "🍞",
        "ขนมปังขาวธรรมดาให้ได้นิดหน่อย ไม่มีประโยชน์มาก",
        3,
        6,
        1.5,
      ],
      [
        "donut_002",
        "โดนัท",
        "🍩",
        "ขนมหวานของคน น้ำตาลเยอะ ไม่ควรให้น้องกินนะ",
        1,
        4,
        1,
      ],
      [
        "cookie_006",
        "คุกกี้",
        "🍪",
        "คุกกี้คนอาจมีช็อกโกแลตหรือไซลิทอลซึ่งเป็นพิษ ระวัง!",
        1,
        4,
        1,
      ],
      [
        "cheesecake_001",
        "ชีสเค้ก",
        "🍰",
        "เค้กหวานมันเยอะ บางหมาท้องเสียจากนม ให้ไม่ได้",
        1,
        4,
        1,
      ],
      [
        "croissant_001",
        "ครัวซองต์",
        "🥐",
        "เนยเยอะมาก กินแล้วอาจท้องอืด ให้แค่คำเล็ก",
        2,
        5,
        1,
      ],
      [
        "ice_cream_001",
        "ไอติม",
        "🍦",
        "นมกับน้ำตาลเยอะ หมาหลายตัวย่อยแลคโตสไม่ได้",
        1,
        4,
        1,
      ],
      [
        "onion_001",
        "หัวหอม",
        "🧅",
        "⚠️ หัวหอมทำลายเม็ดเลือดแดงของหมา! เก็บทิ้งเลย",
        -12,
        15,
        0.8,
      ],
      [
        "avocado_001",
        "อะโวคาโด",
        "🥑",
        "⚠️ อะโวคาโดมีสารเพอร์ซินและเมล็ดติดคอได้ ห้ามให้!",
        -10,
        15,
        0.7,
      ],
      [
        "bar_001",
        "ช็อกโกแลตแท่ง",
        "🍫",
        "⚠️ ช็อกโกแลตเป็นพิษต่อหมา! ยิ่งเข้มยิ่งอันตราย",
        -15,
        15,
        0.7,
      ],
      [
        "burger_001",
        "เบอร์เกอร์",
        "🍔",
        "⚠️ มีหัวหอม เกลือ และไขมันเยอะ อย่าให้น้องกิน",
        -8,
        12,
        0.7,
      ],
      [
        "chili_002",
        "พริก",
        "🌶️",
        "⚠️ พริกเผ็ดทำให้ท้องและปากแสบ ไม่ต้องให้นะ",
        -6,
        10,
        0.6,
      ],
      [
        "mushroom_002",
        "เห็ดไม่รู้ชนิด",
        "🍄",
        "⚠️ เห็ดป่าบางชนิดเป็นพิษร้ายแรง ห้ามให้กินเด็ดขาด",
        -12,
        15,
        0.6,
      ],
      [
        "coffee_005",
        "กาแฟ",
        "☕",
        "⚠️ คาเฟอีนเป็นพิษต่อหมา ใจสั่น ชักได้",
        -12,
        15,
        0.5,
      ],
      [
        "chips_008",
        "มันฝรั่งทอด",
        "🥔",
        "⚠️ เค็มจัด มันเยอะ กินมากเสี่ยงโซเดียมเกิน",
        -5,
        8,
        0.6,
      ],
      [
        "Meat_on_Bone",
        "เนื้อติดกระดูก",
        "🍖",
        "เนื้อสุกไม่ปรุงรส ระวังกระดูกต้มสุกแตกเป็นเสี้ยน ให้กินแต่เนื้อ",
        9,
        12,
        2.4,
      ],
      [
        "Meat_Steak_1",
        "สเต๊กเนื้อสุก",
        "🥩",
        "เนื้อสุกไม่ใส่เกลือ ไม่ใส่ซอส โปรตีนดีมาก",
        9,
        12,
        2.2,
      ],
      [
        "Meat_Steak_2",
        "เนื้อสันในชิ้นเล็ก",
        "🥩",
        "หั่นชิ้นเล็กให้เคี้ยวง่าย",
        8,
        11,
        1.8,
      ],
      [
        "Salmon_Steak",
        "สเต๊กแซลมอน",
        "🐟",
        "แซลมอนสุก โอเมก้า 3 ช่วยให้ขนเงางาม ห้ามให้แบบดิบ",
        8,
        12,
        2,
      ],
      [
        "Sardine",
        "ปลาซาร์ดีน",
        "🐟",
        "ปลาซาร์ดีนสด/ในน้ำเปล่า ไม่ใช่ในน้ำมันหรือซอส",
        7,
        10,
        1.6,
      ],
      [
        "Sardine_Half_1",
        "ปลาซาร์ดีนครึ่งตัว",
        "🐟",
        "แกะก้างก่อนให้นะ",
        6,
        9,
        1.2,
      ],
      [
        "Shrimp",
        "กุ้งต้มทั้งตัว",
        "🦐",
        "ต้มสุกแล้วแกะเปลือกออกก่อน",
        5,
        9,
        1.4,
      ],
      [
        "Sausage",
        "ไส้กรอกจัมโบ้",
        "🌭",
        "เค็มและมัน ให้แค่คำเล็กนาน ๆ ครั้ง",
        3,
        6,
        1.2,
      ],
      [
        "Pumpkin_Quarter",
        "ฟักทองนึ่ง",
        "🎃",
        "ฟักทองนึ่งช่วยเรื่องการขับถ่าย เอาเปลือกและเมล็ดออก",
        6,
        10,
        1.8,
      ],
      [
        "Apple_Red_Half_1",
        "แอปเปิ้ลผ่าครึ่ง",
        "🍎",
        "แอปเปิ้ลให้ได้ แต่ต้องคว้านเมล็ดออก เมล็ดมีสารพิษ",
        5,
        9,
        1.8,
        10,
      ],
      [
        "Watermelon_Slice_1",
        "แตงโมชิ้นโต",
        "🍉",
        "แตงโมไม่มีเมล็ด ช่วยแก้กระหาย",
        4,
        8,
        1.8,
        25,
      ],
      [
        "Orange_Slice",
        "ส้มชิ้นเล็ก",
        "🍊",
        "ส้มให้ได้นิดหน่อย กรดเยอะ อาจท้องไส้ปั่นป่วน",
        2,
        5,
        0.9,
        10,
      ],
      [
        "Tomato_Piece",
        "มะเขือเทศสุกชิ้น",
        "🍅",
        "เฉพาะลูกสุกแดง ส่วนก้านใบสีเขียวเป็นพิษ",
        2,
        5,
        0.8,
        5,
      ],
      [
        "Bell_Pepper_Yellow_Pice",
        "พริกหวานเหลือง",
        "🫑",
        "พริกหวานไม่เผ็ด มีวิตามิน ให้ได้",
        3,
        6,
        1,
      ],
      [
        "Champignon_Mushroom_Half",
        "เห็ดแชมปิญองสุก",
        "🍄",
        "เห็ดที่ขายในซูเปอร์ปรุงสุกไม่ใส่เครื่องปรุงให้ได้ แต่เห็ดป่าห้ามเด็ดขาด",
        2,
        5,
        0.8,
      ],
      [
        "Bread_1_Slice",
        "ขนมปังโฮลวีท",
        "🍞",
        "ขนมปังเปล่าให้ได้นิดหน่อย ระวังแบบใส่ลูกเกด",
        2,
        5,
        1,
      ],
      [
        "Sandwich_Half_1",
        "แซนด์วิชครึ่งชิ้น",
        "🥪",
        "อาหารคนอาจมีหัวหอม/กระเทียม เช็กไส้ก่อนนะ",
        1,
        4,
        0.7,
      ],
      [
        "Cookie_1",
        "คุกกี้เนย",
        "🍪",
        "ขนมหวานของคน ไม่ควรให้น้อง",
        1,
        4,
        0.7,
      ],
      [
        "Donut",
        "โดนัทเคลือบ",
        "🍩",
        "น้ำตาลเยอะมาก ไม่ดีต่อฟันและน้ำหนัก",
        1,
        4,
        0.6,
      ],
      [
        "Macaron",
        "มาการง",
        "🍬",
        "น้ำตาลเยอะ ไม่ควรให้",
        1,
        4,
        0.5,
      ],
      [
        "Eclair",
        "เอแคลร์",
        "🧁",
        "ครีม+ช็อกโกแลตด้านบน ⚠️ ช็อกโกแลตเป็นพิษ",
        -8,
        10,
        0.5,
      ],
      [
        "Pie_Piece",
        "พายผลไม้",
        "🥧",
        "หวานมัน ถ้ามีองุ่น/ลูกเกดเป็นพิษ",
        1,
        4,
        0.5,
      ],
      [
        "Pizza_Slice",
        "พิซซ่า",
        "🍕",
        "⚠️ ซอสมีหัวหอมกระเทียม และเค็มมาก",
        -7,
        10,
        0.6,
      ],
      [
        "Green_Onion",
        "ต้นหอม",
        "🧅",
        "⚠️ ตระกูลหอมทำลายเม็ดเลือดแดงของหมา!",
        -12,
        15,
        0.6,
      ],
      [
        "Chips_1",
        "ขนมถุงมันฝรั่ง",
        "🥔",
        "⚠️ เค็มจัด มันเยอะ",
        -5,
        8,
        0.5,
      ],
      [
        "Ketchup",
        "ซอสมะเขือเทศ",
        "🥫",
        "⚠️ มีหัวหอม/กระเทียมผงและน้ำตาล",
        -6,
        8,
        0.4,
      ],
      [
        "Coffee_Cup_To_Go",
        "กาแฟแก้ว",
        "☕",
        "⚠️ คาเฟอีนเป็นพิษต่อหมา",
        -12,
        15,
        0.5,
      ],
      [
        "Soda_Can_1",
        "น้ำอัดลมกระป๋อง",
        "🥤",
        "⚠️ น้ำตาล+คาเฟอีน ไม่ดีต่อหมา",
        -8,
        10,
        0.5,
      ],
      [
        "Bottle_1",
        "น้ำแร่ขวด",
        "💧",
        "น้ำสะอาดดื่มได้ทุกวัน",
        3,
        6,
        2.4,
        45,
      ],
      [
        "Bottle_3",
        "น้ำดื่มขวดใหญ่",
        "💧",
        "ดื่มน้ำบ่อย ๆ โดยเฉพาะหลังวิ่งเล่น",
        3,
        6,
        2,
        50,
      ],
      [
        "Bowl",
        "ชามน้ำสะอาด",
        "🥣",
        "น้ำในชามสะอาด สดชื่น!",
        2,
        5,
        2.2,
        40,
      ],
      [
        "Juice_Box",
        "น้ำผลไม้กล่อง",
        "🧃",
        "น้ำตาลเยอะ ให้ได้นิดเดียว น้ำเปล่าดีกว่า",
        1,
        4,
        0.7,
        15,
      ],
      [
        "Carton_Box_1",
        "นมกล่อง",
        "🥛",
        "บางตัวแพ้แลคโตส ให้นิดเดียว",
        1,
        4,
        0.6,
        15,
      ],
    ],
    $7 = new Set([
      "ไส้กรอก",
      "ไข่ต้ม",
      "แตงโม",
      "ช็อกโกแลต",
    ]);
  function nM(i, e) {
    let t = j7.filter((n) => i(n[0]));
    if (t.length) {
      for (let n = pi.length - 1; n >= 0; n--) $7.has(pi[n].name) && pi.splice(n, 1);
      for (let [n, s, o, r, a, c, l, h] of t)
        pi.push({
          name: s,
          icon: o,
          note: r,
          stamina: a,
          score: c,
          w: l,
          water: h,
          make: () => e(n, n === "watermelon_001" ? 0.55 : n.startsWith("watermelon_002") ? 0.42 : 0.3),
        });
    }
  }
  function iM() {
    let i = 0;
    for (let t of pi) i += t.w ?? (t.stamina < 0 ? 0.8 : 2);
    let e = Math.random() * i;
    for (let t = 0; t < pi.length; t++) if (((e -= pi[t].w ?? (pi[t].stamina < 0 ? 0.8 : 2)), e <= 0)) return t;
    return 0;
  }
  var _p = {};
  _b(_p, {
    PLUSH: () => sM,
    PLUSH_TH: () => Rp,
    clawMachine: () => h3,
    has: () => ze,
    loadPack: () => bn,
    prop: () => je,
  });
  var vp = {};
  async function bn(i) {
    try {
      let e = await Po(i);
      for (let t of [...e.scene.children])
        /^(Frame|Plane)/.test(t.name) ||
          (t.traverse((n) => {
            let s = n;
            if (s.isMesh) {
              ((s.castShadow = !0), (s.receiveShadow = !0));
              for (let o of Array.isArray(s.material) ? s.material : [s.material])
                o.emissive && o.emissiveMap && (o.emissiveIntensity = Math.min(o.emissiveIntensity, 0.25));
            }
          }),
          (vp[t.name] = t));
      return !0;
    } catch (e) {
      return (console.warn("pack", i, e), !1);
    }
  }
  var ze = (i) => !!vp[i];
  function je(i, e) {
    let t = vp[i],
      n = new J();
    if (!t) return n;
    // v104: ตุ๊กตาทรงยาว (ฉลาม) ขยายให้ตัวดูพอ ๆ กับตัวอื่น
    e && (e *= { plush_shark: 1.3 }[i] ?? 1);
    let s = t.clone(!0);
    (s.position.set(0, 0, 0), s.updateMatrixWorld(!0));
    let o = new mt().setFromObject(s),
      r = o.getCenter(new H()),
      a = o.getSize(new H());
    s.position.set(-r.x, -o.min.y, -r.z);
    let c = new J();
    return (c.add(s), e && c.scale.setScalar(e / Math.max(a.x, a.y, a.z)), n.add(c), n);
  }
  var sM = [
      "Bear_01",
      "Cat_01",
      "Chick_01",
      "Crocodile_01",
      "Dog_01",
      "Elephant_01",
      "Fox_01",
      "Koala_01",
      "Lion_01",
      "Panda_01",
      "Penguin_01",
      "Pig_01",
      "Rabbit_01",
      "Shark_01",
      "Unicorn_01",
    ],
    // v82: ตุ๊กตาสะสมชุดใหม่ (ตู้คีบ + ร้าน)
    ccsPlush = ["plush_shiba", "plush_beaver", "plush_penguin", "plush_hound", "plush_gura", "plush_hippo", "plush_shark", "plush_plane", "plush_toydog", "plush_truck", "plush_police", "plush_sharpei"],
    Rp = {
      plush_shiba: "ชิบะ",
      plush_beaver: "บีเวอร์ฟันโต",
      plush_penguin: "เพนกวินซานต้า",
      plush_hound: "บาสเซ็ตฮาวนด์",
      plush_gura: "ฉลามน้อยกุระ",
      plush_hippo: "ฮิปโปนุ่มนิ่ม",
      plush_shark: "ฉลามฟ้ายิ้มกว้าง",
      plush_plane: "เครื่องบินตาโต",
      plush_toydog: "หมาปั๊กหน้าย่น",
      plush_truck: "รถดั๊มพ์ขนหิน",
      plush_police: "รถตำรวจจิ๋ว",
      plush_sharpei: "ชาไป่ย่นนุ่ม",
      Barney_01: "ไดโนเสาร์ม่วง",
      Bear_01: "หมี",
      Cat_01: "แมว",
      Chick_01: "ลูกเจี๊ยบ",
      Crocodile_01: "จระเข้",
      Dog_01: "หมา",
      Elephant_01: "ช้าง",
      Fox_01: "จิ้งจอก",
      Koala_01: "โคอาล่า",
      Lion_01: "สิงโต",
      Panda_01: "แพนด้า",
      Penguin_01: "เพนกวิน",
      Pig_01: "หมู",
      Rabbit_01: "กระต่าย",
      Shark_01: "ฉลาม",
      Unicorn_01: "ยูนิคอร์น",
    };
  // ขอบด้านในกระจกตู้คีบ (พิกัดในตู้) และช่องหย่อนรางวัล (หน้าซ้าย)
  var CLW = { x0: -0.5, x1: 0.5, z0: -0.425, z1: 0.405, cx: -0.039, cz: 0.071 };
  function ccsClawFit(i, e) {
    let t = i.obj.position,
      n = i.hx ?? 0.11,
      s = i.hz ?? 0.11;
    ((t.x = Math.max(CLW.x0 + n, Math.min(CLW.x1 - n, t.x))), (t.z = Math.max(CLW.z0 + s, Math.min(CLW.z1 - s, t.z))));
    if (!e && t.x < CLW.cx + n && t.z > CLW.cz - s) {
      let o = CLW.cx + n - t.x,
        r = t.z - (CLW.cz - s);
      o < r ? (t.x = CLW.cx + n + 0.002) : (t.z = CLW.cz - s - 0.002);
    }
  }
  function h3(i = 0.85) {
    let e = new J(),
      t = vp.Toy_Claw_01,
      n = t ? t.clone(!0) : new J();
    (e.add(n), e.scale.setScalar(i));
    let s = (N) => {
        let he = null;
        return (
          n.traverse((le) => {
            !he && le.name === N && (he = le);
          }),
          he
        );
      },
      o = s("Claw_Mechanism_02");
    o && (o.userData.noMerge = !0);
    let r = ["Claw_Piston_02", "Claw_01", "Claw_01.001", "Claw_01.002"].map(s).filter((N) => !!N),
      a = r.filter((N) => {
        let he = N.parent;
        for (; he;) {
          if (r.includes(he)) return !1;
          he = he.parent;
        }
        return !0;
      }),
      c = null,
      l = null,
      h = () => {
        c ||
          (n.updateMatrixWorld(!0),
          m(),
          (c = a.map((N) => n.worldToLocal(N.getWorldPosition(new H())))),
          (l = o ? n.worldToLocal(o.getWorldPosition(new H())) : null));
      },
      f = (N, he) => {
        n.updateMatrixWorld(!0);
        let le = n.localToWorld(he.clone());
        (N.position.copy(N.parent.worldToLocal(le)), N.updateMatrixWorld(!0));
      },
      d = s("Claw_Piston_02"),
      u = d ? d.children.filter((N) => /^Claw_01/.test(N.name)) : [],
      p = null,
      m = () => {
        p ||
          !d ||
          (n.updateMatrixWorld(!0),
          (p = u.map((N) => {
            let he = new mt().setFromObject(N),
              le = d.worldToLocal(new H((he.min.x + he.max.x) / 2, he.max.y, (he.min.z + he.max.z) / 2)),
              ve = new H(N.position.x, 0, N.position.z).normalize();
            return {
              o: N,
              p0: N.position.clone(),
              q0: N.quaternion.clone(),
              hinge: le,
              axis: new H(ve.z, 0, -ve.x).normalize(),
            };
          })));
      },
      E = 0,
      g = new At(),
      y = (N) => {
        if (((E = N), !!p))
          for (let he of p)
            (g.setFromAxisAngle(he.axis, N),
              he.o.quaternion.copy(g).multiply(he.q0),
              he.o.position.copy(he.p0).sub(he.hinge).applyQuaternion(g).add(he.hinge));
      },
      x = (N, he, le = 2.2) => y(E + Math.max(-le * he, Math.min(le * he, N - E))),
      b = [],
      w = [];
    // v108: ตู้คีบมีตุ๊กตาแค่ 10 ตัว (วันละ 2 แบบ แบบละ 5 ตัว) วางบนพื้นตู้ชั้นเดียว ไม่ล้นตู้
    let ccsRestock = (types) => {
      for (let N of b) e.remove(N.obj);
      b.length = 0;
      let N = [
        [-0.36, -0.33], [-0.12, -0.33], [0.12, -0.33], [0.36, -0.33],
        [-0.36, -0.07], [-0.12, -0.07], [0.12, -0.07], [0.36, -0.07],
        [0.13, 0.2], [0.36, 0.2],
      ];
      if (!types.length) return;
      N.forEach(([he, le], ve) => {
        let He = types[ve % types.length],
          at = je(He, 0.22 + Math.random() * 0.04);
        (at.position.set(he + (Math.random() - 0.5) * 0.03, 1.165, le + (Math.random() - 0.5) * 0.03),
          (at.rotation.y = (Math.random() - 0.5) * 1.2),
          (at.userData.noMerge = !0),
          e.add(at));
        // v98: วัดขนาดจริงของตุ๊กตา แล้วจัดให้อยู่ในกระจกทั้งตัว (ไม่ทะลุผนัง/ไม่ล้ำช่องรางวัล)
        let Ge = new mt().setFromObject(at),
          V = Ge.getSize(new H()).multiplyScalar(0.5 / (e.scale.x || 1)),
          B = { name: He, obj: at, hx: V.x, hz: V.z };
        (ccsClawFit(B), b.push(B));
      });
    };
    {
      // v100: ใช้ขอบกระจกใสรอบช่องรางวัลของโมเดลเดิม แค่ยกให้สูงขึ้น (ไม่เพิ่มชิ้นอื่น)
      e.updateMatrixWorld(!0);
      let N = new Oe().copy(e.matrixWorld).invert();
      e.traverse((he) => {
        if (!he.isMesh || he.name !== "Toy_Claw_01_3") return;
        let le = new Oe().multiplyMatrices(N, he.matrixWorld),
          ve = new Oe().copy(le).invert(),
          He = he.geometry.clone(),
          at = He.attributes.position,
          Ge = new H();
        for (let V = 0; V < at.count; V++)
          (Ge.fromBufferAttribute(at, V).applyMatrix4(le),
            Ge.x < -0.03 && Ge.z > 0.06 && Ge.y > 1.2 && Ge.y < 1.35 && ((Ge.y += 0.2), Ge.applyMatrix4(ve), at.setXYZ(V, Ge.x, Ge.y, Ge.z)));
        ((at.needsUpdate = !0), He.computeBoundingSphere(), He.computeBoundingBox(), (he.geometry = He));
      });
    }
    let _ = -1,
      S = !1,
      M = -1,
      T = null,
      A = null,
      F = 0.5,
      C = new H(),
      P = new H(),
      I = () => {
        e.updateMatrixWorld(!0);
        let N = new mt();
        for (let ve of a) N.expandByObject(ve);
        let he = e.worldToLocal(N.min.clone()).y,
          le = 1.18;
        if (T) {
          let ve = new mt().setFromObject(T.obj);
          ((le = e.worldToLocal(ve.max.clone()).y - 0.07), C.copy(T.obj.position));
        }
        F = Math.max(0.12, Math.min(0.95, he - le));
      },
      k = (N, he) => {
        if (_ >= 0 || !b.length) return he(null);
        (h(),
          (S = N),
          (A = he),
          (_ = 0),
          (T = b[Math.floor(Math.random() * b.length)]),
          (gr = N ? 1 : 0.3),
          (Wn = null),
          (M = -1),
          P.set(T.obj.position.x, 0, T.obj.position.z),
          I());
      },
      D = new me(-0.24, -0.2),
      L = new me(-0.25, 0.3),
      q = 0,
      $ = 0,
      te = 0,
      Y = () => {
        (o && l && f(o, new H(l.x + q, l.y, l.z + $)),
          c && a.forEach((N, he) => f(N, new H(c[he].x + q, c[he].y - te, c[he].z + $))));
      },
      O = (N, he) => {
        ((q = N - D.x), ($ = he - D.y), Y());
      },
      U = (N) => {
        ((te = N), Y());
      },
      W = () => {
        e.updateMatrixWorld(!0);
        let N = e.worldToLocal((d ?? a[0]).getWorldPosition(new H()));
        return { x: N.x, z: N.z, y: N.y };
      },
      Q = 0,
      Z = 0.5,
      fe = 0,
      // v93: ตู้คีบฟิสิกส์จริง — ตุ๊กตาเป็นทรงกลมมีแรงโน้มถ่วง ชนกัน/ชนผนัง, มือคีบจับไม่แน่นอาจหลุดกลางทาง, ได้รางวัลเมื่อตกลงช่องจริง
      gr = 1,
      won = null,
      PR = 0.1,
      inChute = (V, B) => V < -0.039 && B > 0.071,
      wake = (V, B, ce, De = 1.6) => {
        for (let ue of b) {
          if (ue === T && S) continue;
          let ye = ue.obj.position;
          Math.hypot(ye.x - V, ye.y - B, ye.z - ce) < 0.3 && ((ue.aw = Math.max(ue.aw ?? 0, De)), ue.v || (ue.v = new H()));
        }
      },
      release = (V) => {
        V && ((V.v || (V.v = new H())).set((Math.random() - 0.5) * 0.15, 0, (Math.random() - 0.5) * 0.15), (V.aw = 4), wake(V.obj.position.x, V.obj.position.y, V.obj.position.z, 2));
      },
      PH = (V) => {
        let B = Math.min(V, 1 / 30);
        if (!(B > 0)) return 0;
        let ce = 0;
        for (let De of b) {
          if (!(De.aw > 0) || (De === T && S)) continue;
          ce++;
          let ue = De.obj.position,
            ye = De.v;
          ((ye.y -= 6.5 * B), ue.addScaledVector(ye, B));
          let fl = inChute(ue.x, ue.z) ? 0.55 : 1.165;
          if (ue.y < fl) {
            if (fl < 1) {
              won = won ?? De;
              continue;
            }
            ((ue.y = fl), (ye.y = Math.abs(ye.y) > 0.4 ? -ye.y * 0.3 : 0), (ye.x *= 0.55), (ye.z *= 0.55));
          }
          // ขอบกั้นช่องหย่อนรางวัล + ผนังกระจก ตามขนาดจริงของตุ๊กตา
          {
            let ox = ue.x,
              oz = ue.z,
              ab = ue.y > 1.5;
            (ccsClawFit(De, ab || De.top), (De.top = ab || (De.top && inChute(ue.x, ue.z))), ue.x !== ox && (ye.x *= -0.35), ue.z !== oz && (ye.z *= -0.35));
          }
          for (let ke2 of b) {
            if (ke2 === De || (ke2 === T && S)) continue;
            let Ue = ke2.obj.position,
              dx = ue.x - Ue.x,
              dy = ue.y - Ue.y,
              dz = ue.z - Ue.z,
              d2 = dx * dx + dy * dy + dz * dz;
            if (d2 < 4 * PR * PR && d2 > 1e-8) {
              let d = Math.sqrt(d2),
                nx = dx / d,
                ny = dy / d,
                nz = dz / d,
                pen = 2 * PR - d,
                vn = ye.x * nx + ye.y * ny + ye.z * nz;
              (ke2.aw > 0 ? (ue.addScaledVector(new H(nx, ny, nz), pen * 0.5), Ue.addScaledVector(new H(nx, ny, nz), -pen * 0.5)) : ue.addScaledVector(new H(nx, ny, nz), pen),
                vn < 0 && ((ye.x -= 1.3 * vn * nx), (ye.y -= 1.3 * vn * ny), (ye.z -= 1.3 * vn * nz)),
                (ye.x *= 0.96),
                (ye.z *= 0.96));
            }
          }
          ccsClawFit(De, De.top);
          let sp = ye.length();
          ((De.aw -= B), sp > 0.15 && (De.aw = Math.max(De.aw, 0.3)), De.aw <= 0 && ye.set(0, 0, 0));
          De.obj.rotation.x += ye.z * B * 6;
          De.obj.rotation.z -= ye.x * B * 6;
        }
        if (won) {
          (e.remove(won.obj), b.splice(b.indexOf(won), 1), T === won && ((T = null), (S = !1)));
          let De = won;
          return ((won = null), (Wn = Wn ?? De.name), ke("coin"), 1);
        }
        return ce;
      },
      Wn = null,
      _e = (N) => {
        let he = performance.now() / 1e3,
          le = Math.min(0.25, fe ? he - fe : 0);
        if (((fe = he), _ < 0)) return;
        _ += le;
        let ve = (V, B, ce) => V + (B - V) * Math.min(1, Math.max(0, ce)),
          He = F,
          at = () => {
            if (T) {
              let V = W();
              (T.obj.position.set(V.x, V.y - Q, V.z), (T.obj.rotation.z = Math.sin(_ * 9) * 0.08 * (1 - gr)));
            }
          },
          slip = (V) => {
            S && T && Math.random() < V * le && ((S = !1), release(T), x(-0.3, le, 3), rt && ke("nope"));
          },
          act = PH(le);
        if (_ < 1.2) (O(ve(D.x, P.x, _ / 1.2), ve(D.y, P.z, _ / 1.2)), x(0, le));
        else if (_ < 2.4) {
          (U(ve(0, He, (_ - 1.2) / 1.2)), x(-0.55, le));
          let V = W();
          _ > 2.0 && wake(V.x, V.y - 0.1, V.z, 0.5);
        } else if (_ < 2.8) {
          if (_ - le < 2.4) {
            let V = W();
            Q = V.y - (T ? T.obj.position.y : V.y);
          }
          if ((x(T ? -0.1 : 0.18, le, 2.4), T)) {
            let V = W(),
              B = (_ - 2.4) / 0.4;
            ((T.obj.position.x = ve(C.x, V.x, B)), (T.obj.position.z = ve(C.z, V.z, B)));
          }
        } else if (_ < 3.9) {
          let V = (_ - 2.8) / 1.1;
          if ((U(ve(He, 0, V)), S && T)) (at(), slip((1 - gr) * (V < 0.25 ? 2.6 : 1.1)), _ - le < 2.8 && T && wake(T.obj.position.x, T.obj.position.y, T.obj.position.z, 2));
          else if (T && !T.aw && _ - le < 2.8) ((S = !1), release(T));
        } else if (_ < 5.1) {
          let V = (_ - 3.9) / 1.2;
          (O(ve(P.x, L.x, V), ve(P.z, L.y, V)), S && T ? (at(), slip((1 - gr) * 0.9)) : x(0, le));
        } else if (_ < 5.6) (x(-0.55, le, 3), S && T && ((S = !1), release(T)), U(0));
        else if (_ < 9 && act > 0) (O(D.x, D.y), U(0), y(0));
        else {
          (O(D.x, D.y), U(0), y(0), Pe.set(D.x, D.y));
          let V = Wn;
          ((Wn = null), (_ = -1), (T = null), (S = !1));
          for (let ce of b) ce.aw > 0 && ((ce.aw = 0), ce.v?.set(0, 0, 0));
          let B = A;
          ((A = null), B?.(V));
        }
      },
      ge = { x0: -0.4, x1: 0.3, z0: -0.34, z1: 0.24 },
      Pe = new me(D.x, D.y);
    return {
      group: e,
      prizes: b,
      play: k,
      update: _e,
      steer: (N, he) => {
        _ >= 0 ||
          (h(), Pe.set(Math.max(ge.x0, Math.min(ge.x1, N)), Math.max(ge.z0, Math.min(ge.z1, he))), O(Pe.x, Pe.y));
      },
      drop: (N) => {
        if (_ >= 0) return N(null);
        (h(), (A = N));
        let he = W(),
          le = null,
          ve = 9;
        for (let He of b) {
          let at =
            Math.hypot(He.obj.position.x - he.x, He.obj.position.z - he.z) - (He.obj.position.y > 1.1 ? 0.03 : 0);
          at < ve && ((ve = at), (le = He));
        }
        ((T = ve < 0.15 ? le : null),
          (gr = Math.max(0, Math.min(1, 1 - ve / 0.12)) * (0.6 + Math.random() * 0.4)),
          (S = !!T && gr > 0.22),
          (M = -1),
          (Wn = null),
          I(),
          P.set(Pe.x, 0, Pe.y),
          (_ = 1.2));
      },
      bounds: ge,
      restock: ccsRestock,
      pos: () => Pe.clone(),
      busy: () => _ >= 0,
      dbg: () => ({
        t: _,
        tip: W(),
        tg: T ? T.obj.position.clone() : null,
        win: S,
        carriage: !!o,
        drops: a.map((N) => N.name),
        homes: c?.length,
      }),
    };
  }
