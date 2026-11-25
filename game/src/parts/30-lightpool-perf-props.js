  function YM(i, e) {
    i.updateMatrixWorld(!0);
    let t = new Map();
    i.traverse((s) => {
      s.userData[e] &&
        s.traverse((o) => {
          let r = o;
          if (!r.isMesh || r.isInstancedMesh) return;
          let a = Array.isArray(r.material) ? r.material.map((h) => h.uuid).join(",") : r.material.uuid,
            c = r.geometry.uuid + "|" + a,
            l = t.get(c);
          (l ||
            ((l = { geo: r.geometry, mat: r.material, mats: [], meshes: [], roots: [], cast: r.castShadow }),
            t.set(c, l)),
            l.mats.push(r.matrixWorld.clone()),
            l.meshes.push(r),
            l.roots.push(s));
        });
    });
    let n = 0;
    for (let s of t.values()) {
      if (s.mats.length < 3) continue;
      let o = new di(s.geo, s.mat, s.mats.length);
      (s.mats.forEach((r, a) => o.setMatrixAt(a, r)),
        (o.instanceMatrix.needsUpdate = !0),
        (o.castShadow = s.cast),
        (o.receiveShadow = !0),
        o.computeBoundingSphere(),
        i.add(o),
        (o.userData.instRoots = s.roots),
        s.roots.forEach((r, a) => {
          var c;
          ((c = r.userData).inst ?? (c.inst = [])).push({ im: o, i: a });
        }));
      for (let r of s.meshes) r.parent?.remove(r);
      n += s.mats.length;
    }
    return n;
  }
  function ZM(i, e = 4) {
    i.updateMatrixWorld(!0);
    let t = [],
      n = [];
    i.traverse((h) => {
      h.isPointLight && n.push(h);
    });
    for (let h of n) {
      let f = h.getWorldPosition(new H());
      (t.push({ src: h, pos: f, root: h.parent }), h.parent?.remove(h));
    }
    let s = Array.from({ length: e }, () => {
        let h = new En(16777215, 0, 1, 2);
        return ((h.castShadow = !1), i.add(h), h);
      }),
      o = s.map(() => ({ v: null, pend: void 0, k: 0 })),
      r = 0,
      a = new H(),
      c = [],
      l = (h) => (h.root ? a.copy(h.src.position).applyMatrix4(h.root.matrixWorld) : a.copy(h.pos));
    return {
      count: t.length,
      // v125: ไฟที่สร้างทีหลัง (สนามฝึก/ไฟฉายหมวก) ให้เข้าระบบไฟหมุนเวียน ไม่เพิ่มจำนวนไฟจริงในฉาก
      // (เพิ่มไฟจริง 1 ดวง = ทุก shader ต้องคอมไพล์ใหม่ + ทุกพิกเซลคำนวณไฟเพิ่ม → กระตุก)
      adopt(h, f) {
        (h.parent?.updateWorldMatrix(!0, !1), t.push({ src: h, pos: h.getWorldPosition(new H()), root: f ?? null }), h.parent?.remove(h));
      },
      dbg: () => [
        c,
        o.map((h) => [
          h.v ? l(h.v).toArray().map(Math.round) : null,
          h.pend === void 0 ? "u" : h.pend ? "p" : "n",
          +h.k.toFixed(2),
        ]),
        s.map((h) => [h.position.toArray().map(Math.round), +h.intensity.toFixed(1), h.parent ? 1 : 0]),
      ],
      update(h, f, d) {
        if (((r -= h), r <= 0)) {
          r = 0.3;
          let u = d ?? f;
          for (let g of t) g.root?.updateWorldMatrix(!0, !1);
          let p = t
            .filter((g) => g.src.intensity > 0.01)
            .map((g) => ({ v: g, d: l(g).distanceToSquared(u) - g.src.intensity * 0.3 }))
            .sort((g, y) => g.d - y.d)
            .slice(0, e)
            .map((g) => g.v);
          c = p.map((g) =>
            l(g)
              .toArray()
              .map((y) => Math.round(y))
              .concat([+g.src.intensity.toFixed(1)]),
          );
          let m = new Set();
          for (let g of o) {
            let y = g.pend !== void 0 ? g.pend : g.v;
            y && p.includes(y) && m.add(y);
          }
          let E = p.filter((g) => !m.has(g));
          for (let g of o) {
            let y = g.pend !== void 0 ? g.pend : g.v;
            if (y && m.has(y)) continue;
            let x = E.shift();
            g.pend = x ?? null;
          }
        }
        s.forEach((u, p) => {
          let m = o[p];
          m.pend !== void 0
            ? ((m.k -= h * 3), (m.k <= 0 || !m.v) && ((m.k = 0), (m.v = m.pend), (m.pend = void 0)))
            : m.v && (m.k = Math.min(1, m.k + h * 1.6));
          let E = m.v;
          if (!E) {
            u.intensity = 0;
            return;
          }
          (u.color.copy(E.src.color),
            (u.intensity = E.src.intensity * m.k),
            (u.distance = E.src.distance),
            (u.decay = E.src.decay),
            u.position.copy(l(E)));
        });
      },
    };
  }
  var w3 = {
    auto: "🔄 ภาพอัตโนมัติ",
    low: "⚡ ภาพต่ำ (ลื่นสุด)",
    mid: "🙂 ภาพกลาง",
    high: "✨ ภาพสูง",
  };
  function v3() {
    try {
      let i = localStorage.getItem("ccs-q2");
      if (i && w3[i]) return i;
    } catch {}
    return "auto";
  }
  function KM(i) {
    try {
      localStorage.setItem("ccs-q2", i);
    } catch {}
  }
  function R3(i, e, t) {
    let n = 0,
      s = 0,
      o = Math.min(i, 1.25),
      r = 0;
    return (
      t(o),
      {
        get pr() {
          return o;
        },
        // v80: กันความละเอียดจอแกว่งขึ้น-ลง (เดิมลด/เพิ่มทุก 1.5–3 วิ แต่ละครั้ง setSize ใหม่ = จอกระตุกเป็นจังหวะ
        // โดยเฉพาะในถูกจังมาร์ท/สวนสายรุ้งที่ fps ก้ำกึ่ง 50–58) — ลดเมื่อช้าจริง 2 รอบติด, ลดแล้วไม่เพิ่มคืนอย่างน้อย 30 วิ
        tick(a) {
          if ((n++, (s += a), (r -= a), s < 2)) return;
          let c = n / s;
          if (((n = 0), (s = 0), r > 0)) return;
          c < 45 && o > e
            ? (this.low = (this.low ?? 0) + 1) >= 2 &&
              ((o = Math.max(e, o - (c < 30 ? 0.2 : 0.1))), t(o), (r = 30), (this.low = 0), (this.high = 0))
            : c > 58 && o < i
              ? (this.high = (this.high ?? 0) + 1) >= 5 && ((o = Math.min(i, o + 0.1)), t(o), (r = 10), (this.high = 0), (this.low = 0))
              : ((this.low = 0), (this.high = 0));
        },
        reset(a) {
          ((i = a), (o = Math.min(o, i)), t(o));
        },
      }
    );
  }
  var Nh = null,
    S3 = null;
  async function QM(i, e) {
    try {
      let t = await Po(i);
      Nh = { scene: t.scene, clip: t.animations[0] ?? null };
    } catch (t) {
      console.warn("fish", t);
    }
    try {
      let t = await Po(e);
      S3 = { scene: t.scene, clip: t.animations[0] ?? null };
    } catch (t) {
      console.warn("dolphin", t);
    }
    return !!Nh;
  }
  function _3(i, e, t, n) {
    let s = kc(i.scene);
    (s.traverse((f) => {
      let d = f;
      d.isMesh && ((d.frustumCulled = !1), (d.castShadow = !1));
    }),
      s.updateMatrixWorld(!0));
    let o = new mt().setFromObject(s),
      r = o.getCenter(new H()),
      a = o.getSize(new H()),
      c = new J();
    (s.position.sub(r),
      c.add(s),
      e && c.quaternion.setFromRotationMatrix(e),
      c.scale.setScalar(t / Math.max(a.x, a.y, a.z)));
    let l = new J();
    l.add(c);
    let h = null;
    if (i.clip) {
      h = new dr(s);
      let f = h.clipAction(i.clip);
      ((f.timeScale = n), f.play(), h.update(Math.random() * 3));
    }
    return { root: l, mixer: h };
  }
  var JM = new Oe().makeBasis(new H(0, 0, -1), new H(-1, 0, 0), new H(0, 1, 0));
  function e6(i, e) {
    let t = Ph,
      n = Rt,
      s = [],
      o = [],
      r = [],
      a = (f) => {
        ((f.cx = -150 + Math.random() * 300),
          (f.cz = n + 40 + Math.random() * 45),
          (f.rx = 18 + Math.random() * 22),
          (f.rz = 8 + Math.random() * 12),
          (f.ang = Math.random() * 6.28),
          (f.w = (Math.random() < 0.5 ? 1 : -1) * (0.12 + Math.random() * 0.07)));
      };
    if (Nh) {
      for (let f = 0; f < 10; f++) {
        let d = _3(Nh, JM, 0.38, 1.3);
        ((d.root.visible = !1),
          i.add(d.root),
          s.push({
            a: d,
            home: new H(),
            yaw: 0,
            turn: 0,
            spd: 0.6 + Math.random() * 0.5,
            life: 0,
            age: 0,
            wait: Math.random() * 6,
          }));
      }
      for (let f = 0; f < 3; f++) {
        let d = _3(Nh, JM, 0.42, 2.4);
        ((d.root.visible = !1),
          i.add(d.root),
          o.push({ a: d, t: -1, dur: 1, from: new H(), dir: new H(), dist: 2, h: 1.3, splashed: 0 }));
      }
    }
    if (S3)
      for (let f = 0; f < 3; f++) {
        let d = _3(S3, null, 2.6, 1.6);
        i.add(d.root);
        let u = {
          a: d,
          cx: 0,
          cz: 0,
          rx: 0,
          rz: 0,
          ang: 0,
          w: 0,
          jump: -1,
          jt: 0,
          wait: 2 + Math.random() * 8,
          leaps: 0,
          y: t - 1.4,
          prevY: t - 1.4,
          hide: Math.random() * 6,
        };
        (a(u), r.push(u));
      }
    let c = 3 + Math.random() * 4,
      l = new H();
    return {
      update: (f, d, u) => {
        if (!u) return;
        let p = performance.now();
        for (let m of s) {
          let E = m.a.root.position;
          if (m.life <= 0) {
            if (((m.wait -= f), m.wait > 0)) continue;
            let w = d.z > n - 25 ? d.x + (Math.random() - 0.5) * 40 : -140 + Math.random() * 280;
            (m.home.set(w, 0, n + 5 + Math.random() * 10),
              E.copy(m.home),
              (m.yaw = Math.random() < 0.5 ? Math.PI / 2 : -Math.PI / 2),
              (m.yaw += (Math.random() - 0.5) * 0.8),
              (m.turn = 0),
              (m.life = 9 + Math.random() * 14),
              (m.age = 0),
              (m.spd = 0.7 + Math.random() * 0.6),
              (m.a.root.visible = !0));
          }
          m.age += f;
          let g = Math.min(1, m.age / 1.2),
            y = Math.max(0, Math.min(1, (m.life - m.age) / 1.6));
          if (m.age >= m.life) {
            ((m.life = 0), (m.wait = 1 + Math.random() * 7), (m.a.root.visible = !1));
            continue;
          }
          if (((m.turn += (Math.random() - 0.5) * f * 1.6), (m.turn *= 0.97), (m.yaw += m.turn * f), E.z < n + 4)) {
            let b = 0 - m.yaw;
            b = ccsWrapA(b);
            m.yaw += b * Math.min(1, f * 1.2);
          }
          ((E.x += Math.sin(m.yaw) * m.spd * f), (E.z += Math.cos(m.yaw) * m.spd * f), (E.z = Math.max(n + 3.2, E.z)));
          let x = Math.max(Lc(E.z) + 0.2, t - 0.42) + Math.sin(p * 0.002 + m.home.x) * 0.03;
          ((E.y = x - (1 - y) * 1.2),
            m.a.root.scale.setScalar(Math.max(0.05, g * (0.4 + 0.6 * y))),
            m.a.root.rotation.set(0, m.yaw, Math.sin(p * 0.003 + m.home.x) * 0.08),
            m.a.mixer?.update(f));
        }
        if (o.length && d.z > n - 22 && (c -= f) < 0) {
          c = 4 + Math.random() * 8;
          let m = Math.random() < 0.35 ? 2 : 1;
          for (let E = 0; E < m; E++) {
            let g = o.find((w) => w.t < 0);
            if (!g) break;
            let y = Math.min(n + 16, Math.max(n + 2.5, d.z + 4 + Math.random() * 10)),
              x = d.x + (Math.random() - 0.5) * 18 + E * 1.2,
              b = ((Math.random() < 0.5 ? 1 : -1) * Math.PI) / 2 + (Math.random() - 0.5) * 0.9;
            (g.from.set(x, t - 0.25, y + E * 0.6),
              g.dir.set(Math.sin(b), 0, Math.cos(b)),
              (g.dist = 1.8 + Math.random() * 1.6),
              (g.h = 0.9 + Math.random() * 0.9),
              (g.dur = 0.85 + g.h * 0.25),
              (g.t = -E * 0.25 - 1e-4),
              (g.splashed = 0));
          }
        }
        for (let m of o) {
          if (m.t === -1 || ((m.t += f), m.t < 0)) continue;
          let E = m.t / m.dur;
          if (E >= 1) {
            ((m.t = -1), (m.a.root.visible = !1));
            continue;
          }
          let g = m.from.y + 4 * m.h * E * (1 - E),
            y = m.a.root.position;
          (y.copy(m.from).addScaledVector(m.dir, m.dist * E), (y.y = g));
          let x = (4 * m.h * (1 - 2 * E)) / m.dur,
            b = m.dist / m.dur;
          ((m.a.root.visible = !0),
            m.a.root.rotation.set(0, Math.atan2(m.dir.x, m.dir.z), 0),
            m.a.root.rotateX(-Math.atan2(x, b)),
            m.splashed === 0 && g > t && ((m.splashed = 1), e.burst(y.clone().setY(0), t, 0.5)),
            m.splashed === 1 && E > 0.82 && g < t + 0.15 && ((m.splashed = 2), e.burst(y.clone().setY(0), t, 0.6)),
            m.a.mixer?.update(f));
        }
        for (let m of r) {
          m.ang += m.w * f;
          let E = m.cx + Math.cos(m.ang) * m.rx,
            g = m.cz + Math.sin(m.ang) * m.rz,
            y = -Math.sin(m.ang) * m.rx * m.w,
            x = Math.cos(m.ang) * m.rz * m.w,
            b = Math.hypot(y, x);
          if (((m.prevY = m.y), m.hide > 0)) {
            ((m.hide -= f), (m.a.root.visible = !1), m.hide <= 0 && (a(m), (m.wait = 1 + Math.random() * 4)));
            continue;
          }
          if (m.jump < 0)
            ((m.wait -= f),
              (m.y = t - 1.4 + Math.sin(m.ang * 6) * 0.15),
              m.wait < 0 &&
                ((m.jump = 0), (m.jt = 1.25 + Math.random() * 0.4), (m.leaps = 1 + Math.floor(Math.random() * 3))));
          else {
            m.jump += f;
            let v = m.jump / m.jt,
              _ = 2.3;
            ((m.y = t - 1 + (_ + 1) * 4 * v * (1 - v)),
              m.prevY <= t && m.y > t && e.burst(new H(E, 0, g), t, 1.5),
              m.prevY >= t && m.y < t && e.burst(new H(E, 0, g), t, 1.7),
              v >= 1 &&
                (m.leaps--,
                m.leaps > 0
                  ? ((m.jump = 0), (m.jt = 1.1 + Math.random() * 0.4))
                  : ((m.jump = -1),
                    (m.wait = 4 + Math.random() * 8),
                    Math.random() < 0.6 && (m.hide = 6 + Math.random() * 14))));
          }
          let w = (m.y - m.prevY) / Math.max(1e-4, f);
          (m.a.root.position.set(E, m.y, g),
            m.a.root.rotation.set(0, Math.atan2(y, x), 0),
            m.a.root.rotateX(-Math.atan2(w, b) * 0.9),
            (m.a.root.visible = m.y > t - 2.2),
            m.a.mixer?.update(f * (m.jump >= 0 ? 0.6 : 1)));
        }
      },
      debug: { swimmers: s, jumpers: o, dolphins: r },
    };
  }
  var id = (i) => window.__IMG?.[i] ?? `img/${i}.png`,
    pl = [
      { name: "ข้าวต้ม", img: "main", walk: "main-walk" },
      { name: "ขนมปัง", img: "s2" },
      { name: "บัวลอย", img: "s9" },
      { name: "ทองหยิบ", img: "s39" },
      { name: "ฟักทอง", img: "s29" },
      { name: "โมจิ", img: "s5" },
    ],
    t6 = [
      "ร้อนแล้วอย่าพาเดินตอนเที่ยงนะ",
      "แปรงขนให้หน่อยสิ ผลัดขนอีกแล้ว",
      "อาบน้ำแล้วเป่าให้แห้งถึงผิวด้วยนะ",
      "ขอนอนห้องแอร์ได้ไหม",
      "ลิ้นม่วงนี่เกิดมาแบบนี้เลยนะ",
      "เดินเล่นตอนเย็นดีที่สุด",
      "อย่าไถขนเกรียนเลย ขนช่วยกันแดด",
      "ชามน้ำว่างแล้ว เติมให้หน่อย",
    ],
    t1 = [
      "น้องน่ารักจัง!",
      "สวัสดีจ้า 🐾",
      "ขอลูบหัวหน่อยได้ไหม",
      "ขนฟูมากเลย",
      "ระวังร้อนนะ หาน้ำให้น้องด้วย",
      "เห็นเชาเชาอีกตัวแถวสวนแน่ะ",
      "วันนี้อากาศดีเนอะ",
    ],
    E0 = 62,
    b0 = 0,
    el = 5,
    vn = 6.2,
    Xc = 4.2,
    gH = vn + 0.45,
    Mt = vn + Xc;
  var dI = new jr();
  var EH = document.getElementById("app"),
    GE =
      /Android|iPhone|iPad|iPod|Mobi/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && innerWidth < 1100),
    dn = new ih({ antialias: !GE, powerPreference: "high-performance" });
  dn.domElement.addEventListener("webglcontextlost", (i) => {
    (i.preventDefault(),
      UE(
        "หน่วยความจำภาพของเครื่องเต็ม กำลังเปิดใหม่ในโหมดภาพต่ำ…",
      ));
    try {
      (localStorage.setItem("ccs-q2", "low"),
        sessionStorage.getItem("ccs-relost") ||
          (sessionStorage.setItem("ccs-relost", "1"), setTimeout(() => location.reload(), 1500)));
    } catch {}
  });
  function UE(i) {
    let e = document.getElementById("fatal");
    (e ||
      ((e = document.createElement("div")),
      (e.id = "fatal"),
      (e.style.cssText =
        "position:fixed;inset:0;z-index:99;display:grid;place-items:center;background:rgba(20,16,12,.82);color:#fff;font:600 15px Mitr,sans-serif;text-align:center;padding:24px"),
      document.body.appendChild(e)),
      (e.innerHTML = `<div>${i}<br><br><button style="font:600 15px Mitr,sans-serif;border:0;border-radius:99px;padding:10px 20px;background:#FFD23F" onclick="location.reload()">โหลดใหม่</button></div>`));
  }
  addEventListener("error", (i) => {
    document.body.classList.contains("ready") ||
      UE(
        "โหลดเกมไม่สำเร็จ: " +
          String(i.message ?? "").slice(0, 120),
      );
  });
  addEventListener("unhandledrejection", (i) => {
    document.body.classList.contains("ready") ||
      UE(
        "โหลดเกมไม่สำเร็จ: " +
          String(i.reason ?? "").slice(0, 120),
      );
  });
  dn.setPixelRatio(Math.min(2, window.devicePixelRatio));
  dn.outputColorSpace = Ye;
  dn.shadowMap.enabled = !0;
  dn.shadowMap.type = Nu;
  dn.toneMapping = Rc;
  dn.toneMappingExposure = 1.05;
  EH.appendChild(dn.domElement);
  var K = new pc();
  K.fog = new uc(14676471, 70, 240);
  var Lt = new Tn(50, 1, 0.25, 700),
    VE = new qn(1024, 314, { type: Zi }),
    ha = new Tn(40, 1024 / 314, 0.3, 320);
  ha.layers.enableAll();
  var WE = new Map(),
    iE = (i, e, t, n, s) => ({
      pos: new H(i.x, n / 2, i.z - e * 5),
      look: new H(i.x, n / 2, i.z + e * 20),
      fov: (2 * Math.atan(n / 2 / 5) * 180) / Math.PI,
      aspect: t / n,
      near: 5 + s,
    }),
    qE = 0,
    x0 = new Tc(14478591, 8034908, 1.4);
  K.add(x0);
  var ii = new hr(16773590, 1.6);
  ii.castShadow = !0;
  ii.shadow.mapSize.set(1024, 1024);
  Object.assign(ii.shadow.camera, { left: -26, right: 26, top: 26, bottom: -26, near: 1, far: 140 });
  ii.shadow.bias = -8e-4;
  ii.shadow.normalBias = 0.04;
  ii.shadow.radius = 4;
  K.add(ii, ii.target);
  var sd = new H(0.5, 1, 0.3),
    h0 = UM(K).u;
  hM(
    K,
    new jr().load(id("sea_wave")),
    v3() !== "low" && innerWidth >= 900 && !/Android|iPhone|iPad|Mobi/i.test(navigator.userAgent),
  );
  var tl = fM(K),
    sE = null,
    bH = dM(K),
    co = AM(K),
    oE = null,
    nl = qM(K, Rt + 1);
  nl.ship.visible = !1;
  var is = 1.35,
    fd = 1.65 + 2.5 * is + 0.35,
    _1 = Rt + 1 + 17,
    jE = -0.5,
    oi = HM({ x: jE, side: 1, w: 1.5 });
  oi.ship.scale.setScalar(is);
  oi.ship.rotation.y = -Math.PI / 2;
  oi.ship.position.set(fd, -0.85, _1);
  oi.moor.baseY = -0.85;
  oi.moor.amp = 0.08;
  // v81: เอาเรือลุงทะเลออก (ไม่ใส่ลงฉาก) · ร้านปลาย้ายไปตั้งบนหาดหน้าสะพานไม้
  var ba = (i, e) => null,
    Lp = (jE + oi.L / 2) / oi.L,
    H3 = _1 + jE * is,
    il = [
      new H(0.75, 0.36, H3 - 5.2),
      new H(fd - oi.halfW(Lp) * 0.99 * is - 0.05, -0.85 + oi.deckY(Lp) * is + 0.04, H3),
      new H(fd - oi.halfW(Lp) * 0.62 * is, -0.85 + (oi.deckY(Lp) - 0.25) * is + 0.02, H3),
    ];
  function Rd(i, e) {
    return null;
    for (let t = 0; t < il.length - 1; t++) {
      let n = il[t],
        s = il[t + 1],
        o = s.x - n.x,
        r = s.z - n.z,
        a = o * o + r * r,
        c = ((i - n.x) * o + (e - n.z) * r) / a;
      if (c < -0.03 || c > 1.03) continue;
      let l = n.x + o * c,
        h = n.z + r * c;
      if (!(Math.hypot(i - l, e - h) > (t ? 0.7 : 0.55))) return n.y + (s.y - n.y) * Math.max(0, Math.min(1, c));
    }
    return null;
  }
  {
    let i = il[0],
      e = il[1],
      t = e.x - i.x,
      n = e.z - i.z,
      s = Math.hypot(t, n),
      o = e.y - i.y,
      r = new J();
    (r.position.copy(i), (r.rotation.y = Math.atan2(t, n)));
    let a = Math.atan2(o, s),
      c = Math.hypot(s, o),
      l = new R(new ee(1, 0.1, c + 0.25), new X({ color: 11039807, roughness: 0.8 }));
    ((l.rotation.x = -a), l.position.set(0, o / 2 - 0.05, s / 2), r.add(l));
    for (let h = 0; h < 12; h++) {
      let f = (h + 0.5) / 12,
        d = new R(new ee(0.9, 0.04, 0.06), new X({ color: 8014372 }));
      (d.position.set(0, o * f + 0.02, s * f), r.add(d));
    }
    for (let h of [-0.5, 0.5]) {
      let f = new R(new re(0.03, 0.03, c, 6), new X({ color: 5913116 }));
      ((f.rotation.x = Math.PI / 2 - a), f.position.set(h, o / 2 + 0.8, s / 2), r.add(f));
      for (let d of [0.04, 0.5, 0.96]) {
        let u = new R(new re(0.03, 0.03, 0.8, 6), f.material);
        (u.position.set(h, o * d + 0.4, s * d), r.add(u));
      }
    }
  }
  var xH = (() => {
      let i = document.createElement("canvas");
      i.width = i.height = 256;
      let e = i.getContext("2d"),
        t = e.createRadialGradient(110, 110, 10, 128, 128, 120);
      (t.addColorStop(0, "#fffdf2"),
        t.addColorStop(0.7, "#eae6d6"),
        t.addColorStop(1, "#c9c4b0"),
        (e.fillStyle = t),
        e.beginPath(),
        e.arc(128, 128, 120, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = "rgba(150,150,140,.35)"));
      for (let [s, o, r] of [
        [95, 90, 38],
        [150, 80, 26],
        [160, 140, 34],
        [110, 160, 22],
        [80, 130, 18],
      ])
        (e.beginPath(), e.ellipse(s, o, r, r * 0.8, 0.4, 0, Math.PI * 2), e.fill());
      for (let s = 0; s < 40; s++) {
        let o = Math.random() * Math.PI * 2,
          r = Math.random() * 105,
          a = 128 + Math.cos(o) * r,
          c = 128 + Math.sin(o) * r,
          l = 2 + Math.random() * 7;
        ((e.fillStyle = "rgba(120,118,108,.35)"),
          e.beginPath(),
          e.arc(a, c, l, 0, 7),
          e.fill(),
          (e.strokeStyle = "rgba(255,255,250,.35)"),
          (e.lineWidth = 1),
          e.beginPath(),
          e.arc(a - 0.8, c - 0.8, l, Math.PI, Math.PI * 1.6),
          e.stroke());
      }
      ((e.globalCompositeOperation = "destination-in"), e.beginPath(), e.arc(128, 128, 120, 0, Math.PI * 2), e.fill());
      let n = new ut(i);
      return ((n.colorSpace = Ye), n);
    })(),
    yH = (() => {
      let i = document.createElement("canvas");
      i.width = i.height = 128;
      let e = i.getContext("2d"),
        t = e.createRadialGradient(64, 64, 0, 64, 64, 64);
      return (
        t.addColorStop(0, "rgba(255,250,220,.55)"),
        t.addColorStop(0.3, "rgba(220,230,255,.18)"),
        t.addColorStop(1, "rgba(200,210,255,0)"),
        (e.fillStyle = t),
        e.fillRect(0, 0, 128, 128),
        new ut(i)
      );
    })(),
    u0 = new zi(new vi({ map: xH, fog: !1, depthWrite: !1, transparent: !0, toneMapped: !1 }));
  u0.scale.setScalar(34);
  u0.renderOrder = -8;
  var sl = new zi(new vi({ map: yH, fog: !1, depthWrite: !1, transparent: !0, blending: $i }));
  sl.scale.setScalar(120);
  sl.renderOrder = -9;
  K.add(sl, u0);
  var Gh = (() => {
      let e = new Float32Array(2700),
        t = new Float32Array(900 * 3);
      for (let o = 0; o < 900; o++) {
        let r = Math.random(),
          a = Math.random() * 0.9 + 0.08,
          c = r * Math.PI * 2,
          l = Math.acos(a);
        e.set([Math.sin(l) * Math.cos(c) * 370, Math.cos(l) * 370, Math.sin(l) * Math.sin(c) * 370], o * 3);
        let h = 0.7 + Math.random() * 0.3;
        t.set([h, h, h * (0.9 + Math.random() * 0.15)], o * 3);
      }
      let n = new qe();
      (n.setAttribute("position", new Je(e, 3)), n.setAttribute("color", new Je(t, 3)));
      let s = new bs(
        n,
        new ls({
          size: 1.6,
          sizeAttenuation: !1,
          vertexColors: !0,
          transparent: !0,
          opacity: 0,
          fog: !1,
          depthWrite: !1,
        }),
      );
      return ((s.renderOrder = -9), K.add(s), s);
    })(),
    Dp = new H(),
    xr = 1.05,
    d0 = uM(K, new H(-46, 0, 40), 0.07),
    Bp = null;
  jM();
  var si = v3(),
    rE = si === "high",
    Uh = window.devicePixelRatio || 1,
    $p = null,
    n6 = !0,
    _r = [],
    S0 = new Mp(dn);
  S0.addPass(new Tp(K, Lt));
  var $E = new zc(new me(256, 256), 0.32, 0.55, 0.86);
  S0.addPass($E);
  {
    let i = $E.materialHighPassFilter;
    ((i.fragmentShader = i.fragmentShader.replace(
      "vec4 texel = texture2D( tDiffuse, vUv );",
      "vec4 texel = texture2D( tDiffuse, vUv ); if (texel.r != texel.r || texel.g != texel.g || texel.b != texel.b || texel.a != texel.a) texel = vec4(0.0); texel = clamp(texel, vec4(0.0), vec4(32.0));",
    )),
      (i.needsUpdate = !0));
  }
  var c4 = new wp();
  {
    let i = c4.material;
    ((i.fragmentShader = i.fragmentShader.replace(
      "gl_FragColor = texture2D( tDiffuse, vUv );",
      "gl_FragColor = texture2D( tDiffuse, vUv ); if (gl_FragColor.r != gl_FragColor.r || gl_FragColor.g != gl_FragColor.g || gl_FragColor.b != gl_FragColor.b) gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);",
    )),
      (i.needsUpdate = !0));
  }
  S0.addPass(c4);
  function Vh(i) {
    (dn.setPixelRatio(i), S0.setPixelRatio(i), S0.setSize(window.innerWidth, window.innerHeight));
  }
  function Wh(i, e, t) {
    ((dn.shadowMap.enabled = !0),
      i !== n6 && ((ii.castShadow = i), (n6 = i)),
      i &&
        ii.shadow.mapSize.x !== e &&
        (ii.shadow.mapSize.set(e, e), ii.shadow.map?.dispose(), (ii.shadow.map = null)));
  }
  var Jh = 0,
    l4 = 0,
    i6 = performance.now() / 1e3,
    Op = new H();
  function MH(i, e) {
    let t = Lt.position;
    if (!Number.isFinite(t.x + t.y + t.z) || !Number.isFinite(j.yaw + j.pitch + j.dist)) {
      ud(!1);
      return;
    }
    Op.set(i.pos.x, i.pos.y + 0.6 + j.jy, i.pos.z).project(Lt);
    let n = Op.z > 1 || Math.abs(Op.x) > 1.05 || Math.abs(Op.y) > 1.05,
      s = performance.now() / 1e3;
    ((Jh = n ? Jh + Math.min(0.5, s - i6) : 0), (i6 = s), Jh > 1.5 && ((Jh = 0), l4++, ud(!1)));
  }
  function TH() {
    let i = Le[0];
    if (!i) return;
    let e = Se ? Math.min(j.dist, 7.5) : j.dist,
      t = j.pitch;
    if (
      (Lt.position.set(
        i.pos.x + Math.sin(j.yaw) * Math.cos(t) * e,
        Math.max(0.75, 1 + Math.sin(t) * e),
        i.pos.z + Math.cos(j.yaw) * Math.cos(t) * e,
      ),
      Se)
    ) {
      let n = Se.bounds;
      ((Lt.position.x = Math.max(n.x0, Math.min(n.x1, Lt.position.x))),
        (Lt.position.z = Math.max(n.z0 - 0.2, Math.min(n.z1 + 0.05, Lt.position.z))),
        (Lt.position.y = Math.min(Lt.position.y, 3.7)));
    }
    Lt.lookAt(i.pos.x, 1.1, i.pos.z);
  }
  function ud(i = !0) {
    let e = Le[0];
    if (!e) return;
    (Number.isFinite(j.yaw) || (j.yaw = 0),
      (i || !Number.isFinite(j.pitch) || !Number.isFinite(j.dist)) && ((j.pitch = 0.42), (j.dist = 13)),
      (uo = !1),
      (j.jy = Number.isFinite(j.jy) ? j.jy : 0));
    let t = !1;
    if (i && ri(e.pos, 0.35)) {
      let n = new H();
      e: for (let s = 0.4; s < 6; s += 0.3)
        for (let o = 0; o < Math.PI * 2; o += Math.PI / 8)
          if ((n.set(e.pos.x + Math.cos(o) * s, e.pos.y, e.pos.z + Math.sin(o) * s), !ri(n, 0.4))) {
            (e.pos.copy(n), (t = !0));
            break e;
          }
    }
    (TH(),
      i &&
        De(
          t
            ? "🎥 รีเซ็ตกล้องแล้ว และพาน้องออกจากจุดที่ติด"
            : "🎥 รีเซ็ตกล้องแล้ว",
          1800,
        ));
  }
  var A3 = !1;
  function wH(i, e) {
    let t = Le[0],
      n = t ? Math.hypot(t.pos.x - kn.x, t.pos.z - kn.z) : 0;
    if (!(!Se && n < 70 && !!t)) {
      (A3 && (d0.reset(), (d0.group.visible = !0)), (A3 = !1));
      return;
    }
    (d0.setMist(Math.max(0, Math.min(1, 1 - (n - 7) / 9)), Math.min(e, 0.05)), (A3 = !0));
    let o = si === "high" ? 1 : si === "mid" ? 0.55 : si === "low" ? 0.3 : pa ? 0.4 : 0.7,
      r = n < 25 ? 1 : n < 45 ? 0.6 : 0.35;
    (d0.setBudget(Math.round(o * r * 20) / 20), d0.update(i, Math.min(e, 0.05)));
  }
  var pa = /Android|iPhone|iPad|Mobi/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && innerWidth < 1100);
  function h4() {
    ((rE = si === "high"),
      ($E.enabled = rE),
      ($p = null),
      si === "high"
        ? (Vh(Math.min(2, Uh)), Wh(!0, 2048, !0))
        : si === "mid"
          ? (Vh(Math.min(1.25, Uh)), Wh(!0, 1024, !1))
          : si === "low"
            ? (Vh(Math.min(0.8, Uh)), Wh(!1, 512, !1))
            : pa
              ? (Wh(!1, 512, !1), ($p = R3(Math.min(1.25, Uh), 0.6, (i) => Vh(i))))
              : (Wh(!0, 1024, !1), ($p = R3(Math.min(1.5, Uh), 0.6, (i) => Vh(i)))),
      Lt.updateProjectionMatrix(),
      d4());
  }
  function d4() {
    (dn.setSize(window.innerWidth, window.innerHeight),
      S0.setSize(window.innerWidth, window.innerHeight),
      (Lt.aspect = window.innerWidth / window.innerHeight),
      Lt.updateProjectionMatrix());
  }
  window.addEventListener("resize", d4);
  h4();
  var Xp = (i) => new bt({ color: i });
  var XE = new be({ color: 5916214, side: Wn });
  function aE(i, e = 1.04) {
    let t = new R(i.geometry, XE);
    return (t.scale.setScalar(e), i.add(t), i);
  }
  {
    let i = Fp("#efd9a6", ["#e2c48a", "#f7e8c4", "#d8b97c"], 256, 260);
    i.repeat.set(10, 10);
    let e = Fp("#8cc865", ["#6fb34e", "#a6d878", "#5aa043", "#c3e08a", "#7cbf5a"], 512, 700);
    e.repeat.set(36, 24);
    let t = 260 + Rt - 3,
      n = new R(new Te(560, t), new bt({ map: e }));
    ((n.rotation.x = -Math.PI / 2), n.position.set(0, 0.01, Rt - 3 - t / 2), (n.receiveShadow = !0), K.add(n), mM(K));
    let s = Fp("#f0dcb0", ["#e0c48e", "#f8ead0", "#d4b582"], 256, 220);
    s.repeat.set(4, 4);
    let o = (u, p, m, E) => {
        let g = new R(new Te(u, p), new bt({ map: s, transparent: !0 }));
        ((g.rotation.x = -Math.PI / 2), g.position.set(m, 0.03, E), (g.receiveShadow = !0), K.add(g));
      },
      r = (u, p, m) => {
        let E = document.createElement("canvas");
        ((E.width = 512), (E.height = 128));
        let g = E.getContext("2d");
        ((g.fillStyle = "#b9bbbd"), g.fillRect(0, 0, 512, 128));
        for (let x = 0; x < 2600; x++)
          ((g.fillStyle = `rgba(${Math.random() < 0.5 ? "60,60,60" : "255,255,255"},${Math.random() * 0.08})`),
            g.fillRect(Math.random() * 512, Math.random() * 128, 2, 2));
        ((g.strokeStyle = "rgba(90,90,90,.45)"), (g.lineWidth = 2));
        for (let x = 0; x <= 4; x++) (g.beginPath(), g.moveTo(x * 128, 0), g.lineTo(x * 128, 128), g.stroke());
        if (u) {
          ((g.fillStyle = "#f2c230"),
            g.fillRect(0, 59, 512, 3),
            g.fillRect(0, 66, 512, 3),
            (g.fillStyle = "#f4f4f4"),
            g.fillRect(0, 5, 512, 3),
            g.fillRect(0, 120, 512, 3));
          for (let x = 0; x < 4; x++) (g.fillRect(x * 128 + 30, 32, 68, 3), g.fillRect(x * 128 + 30, 94, 68, 3));
        }
        let y = new ut(E);
        return ((y.colorSpace = Ye), (y.wrapS = y.wrapT = gn), y.repeat.set(p, m), (y.anisotropy = 4), y);
      },
      a = (u, p, m, E, g, y) => {
        let x = r(y, (g === "x" ? u : p) / 16, 1),
          b = new R(new Te(g === "x" ? u : p, g === "x" ? p : u), new bt({ map: x }));
        ((b.rotation.x = -Math.PI / 2),
          g === "z" && (b.rotation.z = Math.PI / 2),
          b.position.set(m, 0.03, E),
          (b.receiveShadow = !0),
          K.add(b));
      };
    (a(340, vn * 2, 0, 0, "x", !0),
      a(6, 33 - Mt, -46, (33 + Mt) / 2, "z", !1),
      a(6, 42 - Mt, 30, -(42 + Mt) / 2, "z", !1));
    {
      let u = document.createElement("canvas");
      ((u.width = 64), (u.height = 256));
      let p = u.getContext("2d");
      (p.clearRect(0, 0, 64, 256), (p.fillStyle = "rgba(250,250,246,.96)"));
      for (let b = 0; b < 8; b++) p.fillRect(0, b * 32 + 4, 64, 22);
      let m = new ut(u);
      m.colorSpace = Ye;
      let E = new bt({ map: m, transparent: !0, depthWrite: !1, polygonOffset: !0, polygonOffsetFactor: -2 }),
        g = new R(
          new Te(el + 0.4, vn * 2 - 0.25),
          new bt({ color: 9342606, polygonOffset: !0, polygonOffsetFactor: -1 }),
        );
      ((g.rotation.x = -Math.PI / 2), g.position.set(b0, 0.04, 0), (g.receiveShadow = !0), K.add(g));
      let y = new R(new Te(el, vn * 2 - 0.3), E);
      ((y.rotation.x = -Math.PI / 2), y.position.set(b0, 0.046, 0), (y.receiveShadow = !0), K.add(y));
      let x = new bt({ color: 16053488, polygonOffset: !0, polygonOffsetFactor: -3 });
      for (let b of [-1, 1]) {
        let w = new R(new Te(0.35, vn - 0.3), x);
        ((w.rotation.x = -Math.PI / 2), w.position.set(b0 + b * (el / 2 + 1.3), 0.047, -b * (vn / 2)), K.add(w));
      }
    }
    let c = (() => {
      let u = document.createElement("canvas");
      ((u.width = 256), (u.height = 256));
      let p = u.getContext("2d");
      ((p.fillStyle = "#8f4a2c"), p.fillRect(0, 0, 256, 256));
      let m = ["#c8653c", "#d0703f", "#bf5d36", "#d77a48", "#c46a40", "#b85a35"],
        E = 64,
        g = 32,
        y = 6;
      for (let b = -1; b < 9; b++)
        for (let w = -1; w < 5; w++) {
          let v = w * E + (b % 2 ? E / 2 : 0),
            _ = b * g;
          ((p.fillStyle = m[(b * 7 + w * 3 + 64) % m.length]), p.beginPath(), p.moveTo(v + 2, _ + 3));
          for (let S = 1; S <= y; S++) p.lineTo(v + 2 + ((E - 4) * S) / y, _ + (S % 2 ? 7 : 3));
          p.lineTo(v + E - 2, _ + g - 3);
          for (let S = y - 1; S >= 0; S--) p.lineTo(v + 2 + ((E - 4) * S) / y, _ + g + (S % 2 ? 1 : -3));
          (p.closePath(), p.fill(), (p.fillStyle = "rgba(255,230,200,.12)"), p.fillRect(v + 6, _ + 9, E - 14, 4));
        }
      for (let b = 0; b < 1800; b++)
        ((p.fillStyle = `rgba(${Math.random() < 0.5 ? "60,30,20" : "255,220,190"},${Math.random() * 0.08})`),
          p.fillRect(Math.random() * 256, Math.random() * 256, 2, 2));
      let x = new ut(u);
      return ((x.colorSpace = Ye), (x.wrapS = x.wrapT = gn), (x.anisotropy = 4), x.repeat.set(340 / 2.4, Xc / 2.4), x);
    })();
    for (let u of [-(vn + Xc / 2), vn + Xc / 2]) {
      let p = new R(new ee(340, 0.1, 0.22), new bt({ color: 11578532 }));
      (p.position.set(0, 0.05, Math.sign(u) * (vn + 0.11)), K.add(p));
      let m = new R(new ee(340, 0.03, Xc - 0.2), new bt({ map: c }));
      (m.position.set(0, 0.025, u + Math.sign(u) * 0.1), (m.receiveShadow = !0), K.add(m), (ccsOldSW = ccsOldSW || []).push(p, m));
    }
    let l = new R(new gt(12, 40), new bt({ map: s }));
    ((l.rotation.x = -Math.PI / 2),
      l.position.set(49, 0.035, 21.5),
      (l.receiveShadow = !0),
      K.add(l),
      l.scale.setScalar(0.72));
    let h = new R(new gt(7, 40), new bt({ color: 7311210 }));
    ((h.rotation.x = -Math.PI / 2), h.position.set(-46, 0.03, 40), K.add(h));
    let f = d3(7).mesh;
    (f.position.set(-46, 0.07, 40), K.add(f));
    let d = new R(
      new ks(
        [
          new me(6.95, -0.02),
          new me(6.95, 0.5),
          new me(7.02, 0.6),
          new me(7.6, 0.6),
          new me(7.68, 0.5),
          new me(7.68, -0.02),
        ],
        72,
      ),
      new X({ map: i3(13616304), roughness: 0.92 }),
    );
    ((d.material.side = Ke), d.position.set(-46, 0, 40), (d.castShadow = !0), (d.receiveShadow = !0), K.add(d));
  }
  var lo = [],
    n1 = [];
  function f4(i, e, t = 1) {
    let n = new J(),
      s = aE(new R(new re(0.25, 0.35, 2.2, 8), Xp(9067051)));
    ((s.position.y = 1.1), n.add(s));
    let o = [7127626, 6075454, 7916629];
    [
      [0, 3, 0, 1.6],
      [0.9, 2.5, 0.3, 1.1],
      [-0.9, 2.6, -0.2, 1.15],
      [0.2, 3.9, 0.1, 1],
    ].forEach(([r, a, c, l], h) => {
      let f = aE(new R(new Ps(l, 1), Xp(o[h % 3])), 1.05);
      (f.position.set(r, a, c), n.add(f));
    });
    for (let r = 0; r < 4; r++) {
      let a = new R(new we(0.16, 8, 6), Xp(r % 2 ? 16740241 : 16765503)),
        c = (r / 4) * Math.PI * 2 + t;
      (a.position.set(Math.cos(c) * 1.5, 3 + Math.sin(r) * 0.5, Math.sin(c) * 1.5), n.add(a));
    }
    (n.position.set(i, 0, e),
      n.scale.setScalar(t),
      n.traverse((r) => {
        r.isMesh && r.material !== XE && (r.castShadow = !0);
      }),
      K.add(n),
      lo.push(new H(i, 0, e)),
      n1.push(n));
  }
  for (let i = 0; i < 48; i++) {
    let e = (i / 48) * Math.PI * 2,
      t = E0 + 10 + (i % 4) * 7,
      n = Math.cos(e) * t * 1.35,
      s = Math.sin(e) * t;
    (s > Rt - 16 && (s = Rt - 8 - (i % 3) * 1.5),
      Math.abs(s) < Mt + 3 && (s += s < 0 ? -(Mt + 5) : Mt + 5),
      f4(n, s, 1.1 + (i % 3) * 0.2));
  }
  [
    [-38, -16],
    [-10, -20],
    [14, -18],
    [38, 14],
    [56, 10],
    [56, -10],
    [40, -12],
    [-58, 30],
    [-34, 46],
    [10, 26],
    [24, 30],
    [-12, 38],
    [0, -40],
    [20, -46],
    [44, -36],
    [-24, -44],
  ].forEach(([i, e], t) => f4(i, e, 0.9 + (t % 3) * 0.15));
  var pt = [],
    S1 = (i, e) => new H(fd - e * is, 0, _1 + i * is);
  // (เรือถูกเอาออก: ไม่มีจุดชนของเรือแล้ว)
  var Sr = { x: 2.6, z: -1.05 },
    od = new H(-4.6, 0, Rt - 4.4),
    vH = new H(od.x + 1.25, 0, od.z),
    ccsStall = null;
  {
    let i = SM();
    (i.position.copy(od),
      (i.rotation.y = Math.PI / 2),
      K.add(i),
      (ccsStall = i),
      pt.push({ x: od.x, z: od.z, hw: 0.95 / 2 + 0.05, hd: 2.1 / 2 + 0.05 }));
  }
  var YE = [],
    i1 = [],
    cE = { uTime: { value: 0 } },
    RH = `uniform float uTime; uniform float uSeed; varying vec2 vUv;
void main(){ vUv = uv; vec3 p = position; float h = uv.y;
  p.x += (sin(uTime*3.1 + uSeed*7.0 + h*4.0)*0.06 + sin(uTime*7.3 + uSeed*3.0)*0.025) * h*h;
  p.z += cos(uTime*2.7 + uSeed*5.0 + h*3.0)*0.04 * h*h;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0); }`,
    _H = `uniform float uTime; uniform float uSeed; varying vec2 vUv;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float v=0.0, a=0.5; for(int i=0;i<4;i++){ v+=a*noise(p); p*=2.03; a*=0.5; } return v; }
void main(){ float y = vUv.y, x = (vUv.x-0.5)*2.0;
  float n = fbm(vec2(x*2.2 + uSeed, y*3.0 - uTime*2.6 + uSeed*3.0));
  float w = pow(max(0.0, 1.0 - y), 0.75) * smoothstep(0.0, 0.18, y) * 0.95 + 0.05;   // ทรงหยดน้ำกลับหัว ฐานกว้าง ปลายแหลม
  float d = abs(x + (n-0.5)*0.55*y) / w;
  float body = smoothstep(1.0, 0.55, d) * smoothstep(1.02, 0.55 + n*0.35, y + (n-0.5)*0.25);
  float core = smoothstep(0.55, 0.0, d) * smoothstep(0.75, 0.05, y);
  float flick = 0.85 + 0.15*sin(uTime*17.0 + uSeed*11.0);
  vec3 col = mix(vec3(0.85,0.12,0.02), vec3(1.0,0.48,0.06), smoothstep(0.0, 0.7, body));
  col = mix(col, vec3(1.0,0.86,0.45), core); col += vec3(1.0,0.95,0.8)*core*core*0.6;
  float a = body * flick; if (a < 0.01) discard;
  gl_FragColor = vec4(col*a*1.6, 1.0); }`;
  function lE(i = 0.5, e = 0.26) {
    let t = new J(),
      n = Math.random() * 10,
      s = new Qt({
        uniforms: { uTime: cE.uTime, uSeed: { value: n } },
        vertexShader: RH,
        fragmentShader: _H,
        transparent: !0,
        depthWrite: !1,
        blending: $i,
        side: Ke,
        toneMapped: !1,
      }),
      o = new Te(e, i, 4, 8);
    o.translate(0, i / 2, 0);
    for (let f = 0; f < 3; f++) {
      let d = new R(o, s);
      ((d.rotation.y = (f * Math.PI) / 3), (d.renderOrder = 5), t.add(d));
    }
    let r = 10,
      a = new Float32Array(r * 3),
      c = new Float32Array(r).map(() => Math.random()),
      l = new qe();
    l.setAttribute("position", new Je(a, 3));
    let h = new bs(
      l,
      new ls({
        color: 16752704,
        size: 0.045,
        transparent: !0,
        opacity: 0.9,
        blending: $i,
        depthWrite: !1,
        toneMapped: !1,
      }),
    );
    return (t.add(h), (t.userData.sparks = { pos: a, life: c, seed: n, pg: l }), t);
  }
  var hE = [],
    u4 = [],
    SH = null;
  function HH(i, e) {
    cE.uTime.value += i;
    let t = null,
      n = 1e9;
    for (let r of hE) {
      if (!r.visible) continue;
      let a = r.userData.sparks,
        c = r.getWorldPosition(AH);
      if (e) {
        let l = Math.hypot(c.x - e.x, c.z - e.z);
        if ((l < n && ((n = l), (t = r)), l > 40)) continue;
      }
      for (let l = 0; l < a.life.length; l++) {
        ((a.life[l] += i * (0.6 + (l % 3) * 0.25)), a.life[l] > 1 && (a.life[l] -= 1));
        let h = a.life[l];
        ((a.pos[l * 3] = Math.sin(l * 3.7 + a.seed + h * 4) * 0.08 * (0.3 + h)),
          (a.pos[l * 3 + 1] = 0.15 + h * 0.9),
          (a.pos[l * 3 + 2] = Math.cos(l * 2.3 + a.seed + h * 3) * 0.08 * (0.3 + h)));
      }
      a.pg.attributes.position.needsUpdate = !0;
    }
    let s = cE.uTime.value,
      o = i1.some((r) => r.visible);
    u4.forEach((r, a) => {
      r.intensity = o ? 5 * (0.82 + 0.1 * Math.sin(s * 13 + a * 2.1) + 0.08 * Math.sin(s * 29 + a)) : 0;
    });
  }
  var AH = new H(),
    al = [],
    CH = (() => {
      let i = document.createElement("canvas");
      i.width = i.height = 128;
      let e = i.getContext("2d"),
        t = e.createRadialGradient(64, 64, 0, 64, 64, 64);
      (t.addColorStop(0, "rgba(255,236,170,.85)"),
        t.addColorStop(0.45, "rgba(255,220,140,.35)"),
        t.addColorStop(1, "rgba(255,210,120,0)"),
        (e.fillStyle = t),
        e.fillRect(0, 0, 128, 128));
      let n = new ut(i);
      return ((n.colorSpace = Ye), n);
    })(),
    p4 = (i = 1) =>
      new be({
        map: CH,
        transparent: !0,
        opacity: i * 0.55,
        depthWrite: !1,
        blending: $i,
        polygonOffset: !0,
        polygonOffsetFactor: -4,
      }),
    kH =
      "varying float vV; varying float vEdge; void main(){ vV = uv.y; vec4 wp = modelMatrix * vec4(position,1.0); vec3 N = normalize(mat3(modelMatrix) * normal); vec3 V = normalize(cameraPosition - wp.xyz); vEdge = abs(dot(N, V)); gl_Position = projectionMatrix * viewMatrix * wp; }",
    PH =
      "uniform vec3 uCol; uniform float uOp; varying float vV; varying float vEdge; void main(){ float a = pow(vV, 1.6) * pow(vEdge, 1.4) * uOp; gl_FragColor = vec4(uCol * a, 1.0); }";
  function ZE(i, e, t, n, s) {
    let o = new R(
      new re(e, t, i, 24, 1, !0),
      new Qt({
        uniforms: { uCol: { value: new ae(n) }, uOp: { value: s } },
        vertexShader: kH,
        fragmentShader: PH,
        transparent: !0,
        depthWrite: !1,
        blending: $i,
        side: Ke,
        toneMapped: !1,
      }),
    );
    return ((o.renderOrder = 4), (o.visible = !1), al.push(o), o);
  }
  function pd(i, e, t, n = 1) {
    let s = new R(new Te(t * 2, t * 2), p4(n));
    return (
      (s.rotation.x = -Math.PI / 2),
      s.position.set(i, 0.09, e),
      (s.visible = !1),
      (s.renderOrder = 2),
      K.add(s),
      al.push(s),
      s
    );
  }
  var Qh = [];
  var H0 = [];
  function IH() {
    let i = ze("street_lamp2"),
      e = 0,
      t = 0.5,
      n = 4.25;
    if (i) {
      let s = je("street_lamp2");
      s.updateMatrixWorld(!0);
      let o = 0,
        r = 0,
        a = -9,
        c = new H();
      (s.traverse((h) => {
        let f = h;
        if (!f.isMesh) return;
        let d = f.geometry.attributes.position;
        for (let u = 0; u < d.count; u++)
          (c.fromBufferAttribute(d, u).applyMatrix4(f.matrixWorld),
            c.y < 0.4 && ((o += c.x), r++),
            c.x > a && (a = c.x));
      }),
        (e = r ? o / r : 0));
      let l = 9;
      (s.traverse((h) => {
        let f = h;
        if (!f.isMesh) return;
        let d = f.geometry.attributes.position;
        for (let u = 0; u < d.count; u++)
          (c.fromBufferAttribute(d, u).applyMatrix4(f.matrixWorld), c.x > a - 0.25 && c.y < l && (l = c.y));
      }),
        (t = a - 0.12),
        (n = l - 0.02));
    }
    for (let s of [-55, -38, -27, -2, 12, 30, 50]) {
      let o = Mt - 0.35,
        r = new be({ color: 16774048 });
      if ((YE.push(r), i)) {
        let a = je("street_lamp2");
        ((a.rotation.y = Math.PI / 2),
          a.position.set(s, 0, o - -e),
          (a.position.z = o + e),
          (a.position.y = 0),
          a.traverse((f) => {
            f.castShadow = !0;
          }),
          K.add(a));
        let c = new R(new we(0.13, 10, 8), r);
        ((c.scale.y = 0.6),
          c.position.set(s, n, o + e - t),
          K.add(c),
          pt.push({ x: s, z: o, hw: 0.18, hd: 0.18 }),
          pd(s, o + e - t - 0.2, 3));
        let l = ZE(n - 0.05, 0.12, 1.9, 16766880, 0.22);
        (l.position.set(s, n / 2, o + e - t), K.add(l));
        let h = new En(16766880, 0, 10, 1.4);
        (h.position.set(s, n - 0.45, o + e - t), K.add(h), H0.push({ l: h, on: 16 }));
      } else {
        let a = aE(new R(new re(0.09, 0.12, 3.6, 6), Xp(4147802)));
        (a.position.set(s, 1.8, o), pt.push({ x: s, z: o, hw: 0.18, hd: 0.18 }), K.add(a));
        let c = new R(new we(0.32, 10, 8), r);
        (c.position.set(s, 3.7, o), K.add(c), pd(s, o - 1.6, 3.6));
      }
    }
    // v87: เสาไฟฝั่งร้านค้า (ฟุตบาทอีกฝั่ง) หันโคมเข้าหาถนน ส่องทางเดินหน้าร้าน
    if (i)
      for (let s of [-55, -30, -19.5, -8, 16, 30, 50]) {
        let o = -(Mt - 0.35),
          r = new be({ color: 16774048 });
        YE.push(r);
        let a = je("street_lamp2");
        ((a.rotation.y = -Math.PI / 2),
          a.position.set(s, 0, o - e),
          a.traverse((f) => {
            f.castShadow = !0;
          }),
          K.add(a));
        let c = new R(new we(0.13, 10, 8), r);
        ((c.scale.y = 0.6), c.position.set(s, n, o - e + t), K.add(c), pt.push({ x: s, z: o, hw: 0.18, hd: 0.18 }), pd(s, o - e + t + 0.2, 3));
        let l = ZE(n - 0.05, 0.12, 1.9, 16766880, 0.22);
        (l.position.set(s, n / 2, o - e + t), K.add(l));
        let h = new En(16766880, 0, 10, 1.4);
        (h.position.set(s, n - 0.45, o - e + t), K.add(h), H0.push({ l: h, on: 16 }));
      }
  }
  var zn = [],
    KE = [
      [
        "Hat_01",
        "หมวกบักเก็ตฟ้า",
        "🧢",
        90,
      ],
      ["Hat_02", "หมวกลายธงชาติ", "🎩", 160],
      ["Hat_03", "หมวกกบตาโต", "🐸", 120],
      ["Hat_04", "หมวกร่มสีรุ้ง", "🌈", 140],
      [
        "Hat_05",
        "หมวกไหมพรมน้ำตาล",
        "🧶",
        80,
      ],
      [
        "Hat_06",
        "หมวกที่ปั๊มชักโครก",
        "🪠",
        99,
      ],
      ["Hat_07", "หูฟังชมพู", "🎧", 150],
      ["Hat_08", "หมวกแก๊ปขาว", "🧢", 80],
      [
        "Hat_09",
        "ผ้าคาดหัวญี่ปุ่น",
        "🎌",
        80,
      ],
      [
        "Hat_10",
        "ที่คาดหูกระต่ายเทา",
        "🐰",
        110,
      ],
      ["Hat_11", "หมวกบีนนี่แดง", "🧶", 90],
      ["Hat_12", "หมวกเขาวัวส้ม", "🐮", 130],
      ["Hat_13", "หมวกดื่มน้ำ", "🥤", 160],
      ["Hat_14", "หมวกปีกส้ม", "👒", 100],
      ["Hat_15", "มงกุฎราชา", "👑", 600],
      ["Hat_16", "หมวกตำรวจ", "👮", 160],
      ["Hat_17", "หมวกไวกิ้ง", "⚔️", 180],
      ["Hat_18", "หมวกทรงสูง", "🎩", 170],
      ["Hat_19", "หมวกกะลาสี", "⚓", 110],
      ["Hat_20", "หมวกใบพัด", "🚁", 150],
      [
        "Hat_21",
        "หมวกเบเร่ต์แดง",
        "🎨",
        120,
      ],
      ["Hat_22", "หมวกหูแมว", "🐱", 130],
      ["Hat_23", "หมวกแฟนซี", "✨", 120],
      [
        "Hat_24",
        "ที่คาดหูกระต่ายชมพู",
        "🐰",
        120,
      ],
      [
        "Hat_25",
        "หมวกนักขุดเหมือง",
        "⛏",
        140,
      ],
      ["Hat_26", "หมวกโรบินฮู้ด", "🏹", 130],
      ["Hat_27", "หมวกนักสืบ", "🕵", 140],
      ["Hat_28", "หมวกโบว์เลอร์", "🎩", 150],
      ["Hat_29", "หมวกซอมเบรโร", "🌮", 170],
      ["Hat_30", "หมวกหน้ายิ้ม", "😊", 120],
      ["Hat_31", "หมวกแฟนซีพิเศษ", "✨", 150],
      ["Hat_32", "หมวกเห็ดแดง", "🍄", 130],
      ["Hat_33", "ห่วงยางเป็ด", "🦆", 160],
      ["Hat_34", "หมวกมือกอดหัว", "🙌", 140],
      ["Hat_35", "กรวยจราจร", "🚧", 90],
      [
        "Hat_36",
        "หมวกตัวตลกสีรุ้ง",
        "🤡",
        150,
      ],
      ["Hat_37", "หมวกเขากวาง", "🦌", 160],
      ["Hat_38", "หมวกรับปริญญา", "🎓", 200],
      ["Hat_39", "หมวกสานกันแดด", "🌞", 90],
      ["Hat_40", "หมวกปีกลายส้ม", "👒", 110],
      ["Hat_41", "หมวกซานต้า", "🎅", 150],
      ["Hat_42", "หมวกไหมพรมเทา", "🧶", 90],
      [
        "Hat_43",
        "หมวกกระดองเต่า",
        "🐢",
        170,
      ],
      ["Hat_44", "หมวกตากบ", "🐸", 110],
      [
        "Hat_45",
        "หมวกแฟนซีลายเท่",
        "✨",
        150,
      ],
      [
        "Hat_46",
        "หมวกจิ๋วสีเขียว",
        "🌱",
        100,
      ],
      [
        "Hat_47",
        "หมวกหมาจิ้งจอก",
        "🦊",
        220,
      ],
      ["Hat_48", "หมวกลูกไก่", "🐥", 200],
      ["Hat_49", "หมวกโคอาล่า", "🐨", 220],
      ["Hat_50", "หมวกแมวดำ", "🐈‍⬛", 220],
      ["Hat_51", "หมวกกันน็อก", "⛑", 180],
      [
        "Hat_52",
        "หมวกแฟนซีสีหวาน",
        "✨",
        150,
      ],
      ["Hat_53", "หมวกฟักทอง", "🎃", 190],
      [
        "Hat_54",
        "หน้ากากกล่องกระดาษ",
        "📦",
        120,
      ],
      ["Hat_55", "หมวกฉลาม", "🦈", 230],
      ["Hat_56", "หมวกแฟนซีใหญ่", "✨", 180],
      ["Hat_57", "หมวกแฟนซีสีสด", "✨", 160],
      [
        "Hat_58",
        "หมวกแฟนซีลายจุด",
        "✨",
        160,
      ],
      ["Hat_59", "หมวกตัวตลก", "🃏", 170],
      [
        "Glasses_01",
        "แว่นกันแดดขาว",
        "🕶",
        113,
      ],
      ["Glasses_03", "แว่นกรอบแดง", "👓", 139],
      [
        "Glasses_04",
        "แว่นขยายนักสืบ",
        "👓",
        152,
      ],
      ["Glasses_08", "แว่นกลมสีฟ้า", "👓", 124],
      [
        "Glasses_11",
        "แว่นริ้วม่านสีแดง",
        "👓",
        163,
      ],
      ["Glasses_18", "แว่นกันแดดดำ", "🕶", 174],
      [
        "Glasses_19",
        "แว่นกันแดดสีส้ม",
        "👓",
        107,
      ],
      [
        "Glasses_20",
        "แว่นกลมเขียวน้ำทะเล",
        "👓",
        120,
      ],
      [
        "Glasses_21",
        "แว่นเลนส์ฟ้ากรอบแดง",
        "👓",
        133,
      ],
      [
        "Mustache_01",
        "หนวดเท่ ๆ แบบที่ 1",
        "🥸",
        64,
      ],
      [
        "Mustache_02",
        "หนวดเท่ ๆ แบบที่ 2",
        "🥸",
        68,
      ],
      [
        "Mustache_03",
        "หนวดเท่ ๆ แบบที่ 3",
        "🥸",
        72,
      ],
      [
        "Mustache_04",
        "หนวดเท่ ๆ แบบที่ 4",
        "🥸",
        76,
      ],
      [
        "Mustache_05",
        "หนวดเท่ ๆ แบบที่ 5",
        "🥸",
        80,
      ],
      [
        "Mustache_06",
        "หนวดเท่ ๆ แบบที่ 6",
        "🥸",
        84,
      ],
      [
        "Mustache_07",
        "หนวดเท่ ๆ แบบที่ 7",
        "🥸",
        88,
      ],
      [
        "Mustache_08",
        "หนวดเท่ ๆ แบบที่ 8",
        "🥸",
        92,
      ],
      [
        "Mustache_09",
        "หนวดเท่ ๆ แบบที่ 9",
        "🥸",
        96,
      ],
      [
        "Mustache_10",
        "หนวดเท่ ๆ แบบที่ 10",
        "🥸",
        100,
      ],
      [
        "Mustache_11",
        "หนวดเท่ ๆ แบบที่ 11",
        "🥸",
        104,
      ],
      [
        "Mustache_12",
        "หนวดเท่ ๆ แบบที่ 12",
        "🥸",
        108,
      ],
      [
        "Mustache_13",
        "หนวดเท่ ๆ แบบที่ 13",
        "🥸",
        112,
      ],
      [
        "Mustache_14",
        "หนวดเท่ ๆ แบบที่ 14",
        "🥸",
        116,
      ],
      [
        "Mustache_15",
        "หนวดเท่ ๆ แบบที่ 15",
        "🥸",
        120,
      ],
      [
        "Beard_01",
        "เคราปุยแบบที่ 1",
        "🧔",
        100,
      ],
      [
        "Beard_02",
        "เคราปุยแบบที่ 2",
        "🧔",
        110,
      ],
      [
        "Beard_03",
        "เคราปุยแบบที่ 3",
        "🧔",
        120,
      ],
      ["Clown_nose_01", "จมูกตัวตลก", "🔴", 50],
      [
        "Pacifier_001",
        "จุกนมน้องเล็ก",
        "🍼",
        60,
      ],
      [
        "Mask_01",
        "หน้ากากอนามัยฟ้า",
        "😷",
        40,
      ],
      ["Mask_02", "หน้ากากดำเท่ ๆ", "🖤", 50],
      [
        "Bandage_01",
        "ผ้าปิดตาโจรสลัด",
        "🏴‍☠️",
        90,
      ],
      ["Headphones_02", "หูฟังสีขาว", "🎧", 160],
    ],
    FH = new Set([
      "Hat_01",
      "Hat_03",
      "Hat_04",
      "Hat_09",
      "Hat_14",
      "Hat_15",
      "Hat_16",
      "Hat_19",
      "Hat_20",
      "Hat_22",
      "Hat_24",
      "Hat_27",
      "Hat_29",
      "Hat_30",
      "Hat_32",
      "Hat_33",
      "Hat_38",
      "Hat_39",
      "Hat_41",
      "Hat_44",
      "Hat_47",
      "Hat_48",
      "Hat_49",
      "Hat_50",
      "Glasses_01",
      "Glasses_03",
      "Glasses_08",
      "Glasses_18",
      "Glasses_20",
      "Glasses_21",
    ]),
    zH = (i, e, t, n) => ({
      key: `hat:cc:${i}`,
      label: `${e} ${t}`,
      price: n,
      make: () => r0(i, i.startsWith("Glasses") ? 0.42 : 0.5, i.startsWith("Glasses") ? "center" : "bottom"),
    }),
    m4 = [
      [
        "dk:bento",
        "ข้าวกล่องเบนโตะ 🍱 (+80🍖)",
        65,
        "dk_bento",
        0.42,
      ],
      [
        "dk:ramen",
        "ราเมงชามร้อน 🍜 (+60🍖 +25💧)",
        55,
        "dk_ramen",
        0.36,
      ],
      [
        "dk:nuggets",
        "นักเก็ตไก่ 🍗 (+45🍖 +15⚡)",
        45,
        "dk_nuggets",
        0.32,
      ],
      [
        "dk:chips",
        "มันฝรั่งทอดกรอบ 🥔 (+25🍖 +25⚡)",
        30,
        "dk_chips_1",
        0.34,
      ],
      [
        "dk:bread",
        "ขนมปังอบใหม่ 🍞 (+40🍖)",
        25,
        "dk_bread_1",
        0.36,
      ],
      [
        "dk:soda",
        "น้ำอัดลมเย็น ๆ 🥤 (+40💧 +15⚡)",
        20,
        "dk_soda_c",
        0.2,
      ],
      ["dk:milk", "นมสด 🥛 (+25🍖 +40💧)", 25, "dk_milk", 0.3],
      [
        "dk:cereal",
        "ซีเรียลกรุบกรอบ 🥣 (+35🍖 +10⚡)",
        35,
        "dk_cereal_a",
        0.32,
      ],
      [
        "dk:banana",
        "กล้วยหอม 🍌 (+25🍖 +10⚡)",
        15,
        "dk_banana",
        0.3,
      ],
      [
        "dk:apple",
        "แอปเปิ้ลแดง 🍎 (+20🍖 +15💧)",
        15,
        "dk_apple",
        0.18,
      ],
      [
        "dk:sushi",
        "ซูชิแซลมอน 🍣 (+50🍖 +10⚡)",
        55,
        "sushi_0",
        0.3,
      ],
      [
        "dk:beefpk",
        "เนื้อวัวแพ็ก (ต้มสุกให้) 🥩 (+75🍖)",
        70,
        "Meat_Steak_2",
        0.26,
      ],
      [
        "dk:icecream",
        "ไอศกรีมถ้วย 🍨 (+15🍖 +35💧 +10⚡)",
        35,
        "icecream_8",
        0.16,
      ],
      [
        "dk:sandw",
        "แซนด์วิชแฮมชีส 🥪 (+45🍖)",
        35,
        "sandw_6",
        0.26,
      ],
      [
        "dk:melonpan",
        "เมลอนปัง 🍞 (+35🍖 +10⚡)",
        25,
        "jbread_6",
        0.22,
      ],
      [
        "dk:cookie",
        "คุกกี้ช็อกชิป 🍪 (+20🍖 +25⚡)",
        20,
        "cookie_7",
        0.2,
      ],
      [
        "dk:sashimi",
        "เรือซาชิมิรวม 🍣 (+110🍖 +20⚡)",
        199,
        "sashimi_boat",
        0.5,
      ],
      [
        "dk:seafood",
        "ซีฟู้ดรวมถาด 🦀 (+80🍖 +20💧)",
        129,
        "Shrimp",
        0.3,
      ],
      [
        "dk:drum",
        "น่องไก่ย่าง 🍗 (+55🍖 +10⚡)",
        40,
        "leg_0",
        0.24,
      ],
      [
        "dk:kitkat",
        "คิทแคทชาเขียว 🍫 (+10🍖 +35⚡)",
        30,
        "jcandy_5",
        0.24,
      ],
      ["dk:ribeye", "ริบอายวากิวแพ็ก (ย่างสุกให้) 🥩 (+95🍖 +10⚡)", 159, "meatpk_12", 0.34],
      ["dk:tbone", "สเต๊กเนื้อแพ็กถาด (แกะกระดูกให้) 🍖 (+90🍖)", 139, "meatpk_6", 0.34],
      ["dk:shabu", "เนื้อสไลซ์ชาบู (ลวกสุกให้) 🍲 (+60🍖 +10💧)", 79, "meatpk_10", 0.34],
      ["dk:chkpk", "อกไก่สดแพ็ก (ต้มสุกให้) 🐔 (+55🍖)", 49, "meatpk_18", 0.3],
      ["dk:porkpk", "หมูสันในแพ็ก (ต้มสุกให้) 🐖 (+65🍖)", 65, "meatpk_24", 0.3],
      ["dk:salmonpk", "แซลมอนสดแพ็ก (นึ่งสุกให้) 🐟 (+60🍖 +15⚡)", 99, "meatpk_22", 0.3],
      ["dk:wholechk", "ไก่สดทั้งตัว (ต้มแกะกระดูกให้) 🐓 (+120🍖)", 149, "meatpk_28", 0.34],
      ["dk:roastchk", "ไก่อบไม่ปรุงรส (แกะกระดูกให้) 🍗 (+100🍖)", 129, "roast", 0.32],
      ["dk:sausage", "ไส้กรอกหมูรมควัน 🌭 (+40🍖 +10⚡)", 35, "Sausage", 0.26],
      [
        "dk:cola",
        "โคล่ากระป๋องเย็น 🥤 (+45💧 +15⚡)",
        20,
        "soda_7",
        0.2,
      ],
    ],
    s1 = {
      "dk:bento":
        "ข้าวกล่องมักปรุงด้วยหอม กระเทียม และเกลือเยอะ ซึ่งไม่ดีต่อหมา",
      "dk:ramen":
        "น้ำซุปราเมงเค็มจัด และมักมีหอมกระเทียม ทำให้หมาท้องเสียหรือโลหิตจางได้",
      "dk:nuggets":
        "นักเก็ตทอดมีไขมันสูงและเครื่องปรุง เสี่ยงตับอ่อนอักเสบ",
      "dk:chips":
        "มันฝรั่งทอดเค็มและมันมาก กินบ่อยไม่ดีต่อไตและตับอ่อน",
      "dk:soda":
        "น้ำอัดลมมีน้ำตาลและคาเฟอีน ไม่เหมาะกับหมา",
      "dk:milk":
        "หมาโตส่วนใหญ่ย่อยแลคโตสไม่ได้ กินนมวัวแล้วท้องเสียง่าย",
      "dk:cereal":
        "ซีเรียลหวานมีน้ำตาลสูง บางยี่ห้อใส่ลูกเกดหรือช็อกโกแลตที่อันตราย",
      "dk:sushi":
        "ปลาดิบอาจมีพยาธิ และข้าวซูชิปรุงน้ำส้มสายชู/น้ำตาล ไม่ควรให้หมา",
      "dk:icecream":
        "ไอศกรีมมีนมและน้ำตาล บางสูตรใส่ไซลิทอลหรือช็อกโกแลตซึ่งอันตรายมาก",
      "dk:sandw":
        "แฮมเค็มจัด ชีสมัน และแซนด์วิชมักมีหอมหรือซอส",
      "dk:melonpan":
        "ขนมปังหวานเคลือบน้ำตาลเนย ไม่มีประโยชน์กับหมา",
      "dk:cookie":
        "คุกกี้ช็อกชิปมีช็อกโกแลต (ธีโอโบรมีน) ซึ่งเป็นพิษต่อหมา",
      "dk:seafood":
        "ซีฟู้ดมีเปลือกแข็งและอาจดิบ เสี่ยงติดคอและท้องเสีย",
      "dk:sashimi":
        "ปลาดิบอาจมีพยาธิ ซอสโชยุเค็มจัด และวาซาบิทำให้หมาระคายเคือง (ซื้อแบบลวกสุกที่แผงลุงทะเลจะปลอดภัยกว่า)",
      "dk:drum":
        "กระดูกไก่สุกแตกเป็นเสี้ยนแหลม ทิ่มคอหรือลำไส้ได้ (ร้านป้าอู้ดจะแกะกระดูกให้)",
      "dk:kitkat":
        "ช็อกโกแลตและชาเขียวมีธีโอโบรมีน/คาเฟอีน เป็นพิษต่อหมา",
      "dk:sausage":
        "ไส้กรอกรมควันเค็มจัดและมีไนไตรท์ ไม่ควรให้หมากิน",
      "dk:cola":
        "โคล่ามีคาเฟอีนและน้ำตาลสูง ทำให้หมาใจสั่น กระสับกระส่าย",
    },
    s6 = {
      "dk:bread":
        "ขนมปังจืดชิ้นเล็กให้ได้นาน ๆ ครั้ง",
      "dk:banana":
        "กล้วยหอมให้ได้พอประมาณ (หวาน)",
      "dk:apple":
        "แอปเปิ้ลหั่น เอาเมล็ดและแกนออกก่อน",
      "dk:beefpk":
        "ต้มสุก ไม่ปรุงรส แล้วหั่นเป็นชิ้น",
      "dk:ribeye": "ย่างสุกไม่ใส่เกลือ หั่นชิ้นพอดีคำ",
      "dk:tbone": "แกะกระดูกออกแล้ว ปลอดภัย",
      "dk:shabu": "ลวกสุก ไม่จิ้มน้ำจิ้ม",
      "dk:chkpk": "อกไก่ต้มสุก โปรตีนสูงไขมันต่ำ",
      "dk:porkpk": "หมูต้องสุกทั่วถึงเสมอนะ",
      "dk:salmonpk": "นึ่งสุก แกะก้างแล้ว ขนสวยเงา",
      "dk:wholechk": "แกะกระดูกไก่ออกหมดแล้ว",
      "dk:roastchk": "สูตรไม่ปรุงรส แกะกระดูกแล้ว",
    };
  for (let [i, e] of m4.map((t) => [t[0], t[1]]))
    if (s1[i]) {
      let t = e.match(/^(.*?)\s*(\p{Extended_Pictographic})/u);
      Ip["food:" + i] = {
        name: (t ? t[1] : e.split(" (")[0]).trim(),
        icon: t ? t[2] : "🎁",
        sell: 0,
        giftable: !0,
      };
    }
  var o6 = {
      "dk:bento": [80, 0, 0],
      "dk:ramen": [60, 25, 0],
      "dk:nuggets": [45, 0, 15],
      "dk:chips": [25, 0, 25],
      "dk:bread": [40, 0, 0],
      "dk:soda": [0, 40, 15],
      "dk:milk": [25, 40, 0],
      "dk:cereal": [35, 0, 10],
      "dk:banana": [25, 0, 10],
      "dk:apple": [20, 15, 0],
      "dk:sushi": [50, 0, 10],
      "dk:beefpk": [75, 0, 0],
      "dk:icecream": [15, 35, 10],
      "dk:sandw": [45, 0, 0],
      "dk:melonpan": [35, 0, 10],
      "dk:cookie": [20, 0, 25],
      "dk:seafood": [80, 20, 0],
      "dk:sashimi": [110, 0, 20],
      "dk:drum": [55, 0, 10],
      "dk:kitkat": [10, 0, 35],
      "dk:cola": [0, 45, 15],
      "dk:ribeye": [95, 0, 10],
      "dk:tbone": [90, 0, 0],
      "dk:shabu": [60, 10, 0],
      "dk:chkpk": [55, 0, 0],
      "dk:porkpk": [65, 0, 0],
      "dk:salmonpk": [60, 0, 15],
      "dk:wholechk": [120, 0, 0],
      "dk:roastchk": [100, 0, 0],
      "dk:sausage": [40, 0, 10],
    },
    LH = (i, e) =>
      s1[i]
        ? e.replace(/\s*\(.*\)\s*$/, "") +
          " (ของคน \xB7 ซื้อเป็นของฝาก 🎁)"
        : e;
  function g4(i) {
    return i === "grocery"
      ? [
          {
            key: "kibble",
            label:
              "อาหารเม็ดพรีเมียม 🥣 (+60🍖)",
            price: 30,
            make: () => je("dk_fc_5", 0.34),
          },
          {
            key: "can",
            label:
              "อาหารกระป๋อง 🥫 (+40🍖 +20⚡)",
            price: 45,
            make: () => je("dk_fc_37", 0.24),
          },
          {
            key: "beef",
            label:
              "เนื้อวัวต้มสุก 🥩 (+70🍖)",
            price: 60,
            make: () => je("dk_fc_32", 0.3),
          },
          {
            key: "chicken",
            label: "อกไก่ต้มฉีก 🍗 (+50🍖)",
            price: 40,
            make: () => je("dk_fc_9", 0.26),
          },
          {
            key: "salmon",
            label: "แซลมอนนึ่ง 🐟 (+55🍖 +10⚡)",
            price: 70,
            make: () => je("dk_fc_0", 0.24),
          },
          {
            key: "snack",
            label: "ขนมน้องหมา 🍪 (+40⚡ +15🍖)",
            price: 50,
            make: () => je("dk_fc_27", 0.3),
          },
          {
            key: "water",
            label: "น้ำดื่มสะอาด 💧 (+70💧)",
            price: 15,
            make: () => je("dk_fc_36", 0.34),
          },
          {
            key: "fruit",
            label:
              "ผลไม้รวมหั่น 🍉 (+35🍖 +20💧)",
            price: 35,
            make: () => je("dk_fc_2", 0.24),
          },
          {
            key: "chew",
            label:
              "กระดูกแทะชิ้นใหญ่ 🦴 (+50⚡)",
            price: 70,
            make: () => ccsBone(0.32),
          },
          {
            key: "chick",
            label:
              "ลูกไก่ 🐣 (ไข่ทุกเช้า)",
            price: 150,
            make: Zy,
          },
          ...(ze("dk_bento")
            ? m4.map(([e, t, n, s, o]) => ({ key: e, label: LH(e, t), price: n, make: () => je(s, o) }))
            : []),
        ]
      : i === "petshop"
        ? [
            // v105: ตู้โชว์ตุ๊กตาใบเสริม (ขายทีละใบ สูงสุด 3 ใบ)
            ...(ccsCabN() < 3
              ? [
                  {
                    key: "cab:" + (ccsCabN() + 1),
                    label: `ตู้โชว์ตุ๊กตาใบที่ ${ccsCabN() + 1} 🗄️ (โชว์เพิ่มได้ 15 แบบ)`,
                    price: ccsCabPrice[ccsCabN()],
                    make: () => Q7("", !1).group,
                    noShelf: !0,
                  },
                ]
              : []),
            {
              key: "plush:Dog_01",
              label:
                "ตุ๊กตาหมานุ่มนิ่ม 🧸",
              price: 150,
              make: () => je("Dog_01", 0.5),
            },
            {
              key: "plush:Cat_01",
              label: "ตุ๊กตาแมว 🐱",
              price: 150,
              make: () => je("Cat_01", 0.5),
            },
            {
              key: "plush:Unicorn_01",
              label:
                "ตุ๊กตายูนิคอร์น 🦄",
              price: 220,
              make: () => je("Unicorn_01", 0.5),
            },
            {
              key: "plush:Panda_01",
              label: "ตุ๊กตาแพนด้า 🐼",
              price: 180,
              make: () => je("Panda_01", 0.5),
            },
            ...ccsPlush.filter(ze).map((e, t) => ({
              key: "plush:" + e,
              label: `ตุ๊กตา${Rp[e]} ${{ plush_shiba: "🐕", plush_beaver: "🦫", plush_penguin: "🐧", plush_hound: "🐶", plush_gura: "🦈", plush_hippo: "🦛", plush_shark: "🌊", plush_plane: "✈️", plush_toydog: "🦮", plush_truck: "🚚", plush_police: "🚓", plush_sharpei: "🥟" }[e] ?? "🧸"} (ใหม่!)`,
              price: { plush_shiba: 260, plush_beaver: 240, plush_penguin: 220, plush_hound: 200, plush_gura: 280, plush_hippo: 250, plush_shark: 270, plush_plane: 230, plush_toydog: 240, plush_truck: 290, plush_police: 300, plush_sharpei: 320 }[e] ?? 240,
              make: () => je(e, 0.5),
            })),
            ...(ze("Barney_01")
              ? [
                  {
                    key: "plush:Barney_01",
                    label:
                      "ตุ๊กตาไดโนเสาร์ม่วง 🦖",
                    price: 250,
                    make: () => je("Barney_01", 0.55),
                  },
                ]
              : []),
            {
              key: "toy:ball",
              label:
                "ลูกบอลยางกัดเล่น 🎾 (+15⚡)",
              price: 40,
              make: () => {
                let e = m3();
                (e.scale.setScalar(0.4), (e.position.y = 0.15));
                let t = new J();
                return (t.add(e), t);
              },
            },
            {
              key: "toy:rope",
              label: "เชือกขัดฟัน 🪢 (+10⚡)",
              price: 35,
              make: () => Os(6080757),
            },
            {
              key: "treat",
              label: "ขนมขัดฟัน 🦴 (+20🍖 +10⚡)",
              price: 25,
              make: () => Os(15914656),
            },
          ]
        : i === "clinic"
          ? [
              {
                key: "vitamin",
                label:
                  "วิตามินน้องหมา 💊 (+30⚡)",
                price: 40,
                make: () => Os(16765503),
                thumb: () => je("Bottle_2", 0.35),
              },
              {
                key: "checkup",
                label:
                  "ตรวจสุขภาพ 🩺 (พลังเต็ม)",
                price: 90,
                make: () => Os(14829119),
                thumb: () => null,
              },
            ]
          : [
              {
                key: "bath",
                label: "อาบน้ำหอม ๆ ในอ่าง 🛁 (+60⚡ หอมฟุ้ง 1 วัน)",
                price: 60,
                make: () => Os(6080757),
                thumb: () => null,
              },
              {
                key: "brush",
                label: "แปรงขนฟู ✨ (+20⚡)",
                price: 25,
                make: () => Yy(16748472),
              },
              {
                key: "hat:straw",
                label: "หมวกฟาง 👒",
                price: 120,
                make: () => Ns("straw"),
              },
              {
                key: "hat:beanie",
                label: "หมวกไหมพรม 🧶",
                price: 100,
                make: () => Ns("beanie"),
              },
              {
                key: "hat:party",
                label: "หมวกปาร์ตี้ 🎉",
                price: 60,
                make: () => Ns("party"),
              },
              {
                key: "hat:crown",
                label: "มงกุฎทอง 👑",
                price: 500,
                make: () => Ns("crown"),
              },
              {
                key: "hat:ribbon",
                label: "โบว์ชมพู 🎀",
                price: 80,
                make: () => Ns("ribbon"),
              },
              {
                key: "hat:bandana",
                label: "ผ้าพันคอแดง 🧣",
                price: 90,
                make: () => Ns("bandana"),
              },
              {
                key: "hat:bowtie",
                label:
                  "หูกระต่ายสุดหล่อ 🎩",
                price: 70,
                make: () => Ns("bowtie"),
              },
              {
                key: "hat:scarf",
                label: "ผ้าพันคอลายทาง 🧣",
                price: 110,
                make: () => Ns("scarf"),
              },
              {
                key: "hat:sunglasses",
                label: "แว่นกันแดด 🕶",
                price: 150,
                make: () => Ns("sunglasses"),
                thumb: () => null,
              },
              {
                key: "hat:heartglasses",
                label: "แว่นหัวใจ 💖",
                price: 130,
                make: () => Ns("heartglasses"),
              },
              ...(mr() ? KE.filter(([e]) => FH.has(e)).map(([e, t, n, s]) => zH(e, t, n, s)) : []),
            ];
  }
  var DH = [
      ["Picture_17", -3.4, -4.42, 0, 2.5],
      ["Clock_03", 2.4, -4.4, 0, 3],
      ["Plants_15", -5, -3.9, 0],
      ["Light_05", 4.75, -2.6, -Math.PI / 2],
      ["Armchair_02", -4, 3, Math.PI / 2],
      ["Coffee_Table_03", -2.7, 3, 0],
      ["Plants_05", -2.7, 3, 0, 0.45],
    ],
    BH = {
      chow: [
        ["Couch_11", 4.1, 3.83, Math.PI],
        ["Picture_21", 2, -4.42, 0, 2.5],
        ["Toy_03", 0.9, 1.4, 0.6],
      ],
      clinic: [
        ["Wash_Basin_07", -1.75, -4.05, 0],
        ["Plants_15", 4.9, 3.95, 0],
        ["Plants_15", -1, 3.95, 0],
      ],
      groom: [
        ["Wash_Basin_07", -1.75, -4.05, 0],
        ["Toothbrush_01", -1.95, -4.05, 0, 0.95],
      ],
      grocery: [
        ["Fridge_01", -1.75, -3.95, 0],
        ["Kitchen_Table_09", 4.15, 3.75, 0],
        ["Chair_17", 4.15, 3.1, 0],
        ["Microwave_01", -4.2, -2.4, 0, 0.72],
      ],
      pet: [
        ["Couch_08", 4.1, 3.83, Math.PI],
        ["Toy_02", 0.9, 1.5, 0.4],
        ["Toy_03", -0.9, 0.7, -0.5],
      ],
    };
  function OH(i, e) {
    let t = i === "grocery" && e.W !== void 0 && e.W > 15;
    if (t) {
      let n = e.W,
        s = Jr.counter;
      if (ze("Microwave_01")) {
        let o = je("Microwave_01");
        (o.position.set(s.x - s.len / 2 + 0.45, 0.84, s.z + 0.05), (o.rotation.y = 0), e.group.add(o));
      }
      if (ze("Fridge_01"))
        for (let o = 0; o < 2; o++) {
          let r = je("Fridge_01"),
            a = new mt().setFromObject(r),
            c = a.getSize(new H()),
            l = 2.15 / Math.max(0.1, c.y);
          r.scale.multiplyScalar(l);
          let h = c.x * l,
            f = c.z * l;
          ((r.rotation.y = -Math.PI / 2),
            r.position.set(n / 2 - f / 2 - 0.04, 0, -3.3 + o * (h + 0.08)),
            e.group.add(r),
            e.solids.push({
              x: e.origin.x + r.position.x,
              z: e.origin.z + r.position.z,
              hw: f / 2 + 0.05,
              hd: h / 2 + 0.05,
            }));
        }
      return;
    }
    if (t && ze("Microwave_01")) {
      let n = e.W,
        s = e.D,
        o = je("Microwave_01");
      (o.position.set(-n / 2 + 3.9, 0.72, -s / 2 + 0.75), (o.rotation.y = -Math.PI / 2), e.group.add(o));
    }
    for (let [n, s, o, r, a] of [
      ...DH.filter(
        (c) =>
          !((i === "groom" || (i === "grocery" && ze("dk_chips_0"))) && /Armchair|Coffee_Table|Plants_05/.test(c[0])) &&
          !(t && c[0] === "Plants_15"),
      ),
      ...(BH[i] ?? []).filter((c) => !(t && c[0] === "Microwave_01")),
    ]) {
      if (!ze(n)) continue;
      let c = je(n);
      if ((c.position.set(s * (s3 / 11), a ?? 0, o * (o3 / 9)), (c.rotation.y = r), e.group.add(c), (a ?? 0) > 0.3))
        continue;
      c.updateMatrixWorld(!0);
      let l = new mt().setFromObject(c),
        h = l.getCenter(new H()),
        f = l.getSize(new H());
      f.y > 0.25 &&
        e.solids.push({ x: h.x, z: h.z, hw: Math.max(0.2, f.x / 2 - 0.05), hd: Math.max(0.2, f.z / 2 - 0.05) });
    }
  }
  var r6 = new WeakMap();
  function po(i) {
    return (
      Math.abs(i.z) < Mt + 0.4 ||
      (Math.abs(i.x + 46) < 3.6 && i.z > -12 && i.z < 33) ||
      (Math.abs(i.x - 30) < 3.6 && i.z < -2 && i.z > -42)
    );
  }
  function o1(i, e) {
    return ri(i, e, !1, !0);
  }
  function E4(i, e, t, n, s, o) {
    let r = r6.get(i);
    if (!r) {
      let h = (o ?? i.pos).clone();
      (po(h) && (h.z += h.z < 0 ? -7 : 7),
        (r = { home: h, target: i.pos.clone(), wait: Math.random() * 3 }),
        r6.set(i, r));
    }
    if ((po(i.pos) && r.wait > 0 && (r.wait = 0), (i.spd = 0), r.wait > 0)) {
      ((r.wait -= s), e && (i.dir = Math.atan2(e.x - i.pos.x, e.z - i.pos.z)));
      return;
    }
    Xt.copy(r.target).sub(i.pos).setY(0);
    let a = Xt.length();
    if (a < 0.3) {
      r.wait = 2 + Math.random() * 5;
      for (let h = 0; h < 14; h++) {
        let f = r.home.clone().add(new H((Math.random() - 0.5) * n * 2, 0, (Math.random() - 0.5) * n * 2));
        if (!po(f) && !o1(f, 0.6) && go(f.x, f.z) < 0.05) {
          r.target.copy(f);
          break;
        }
      }
      return;
    }
    Xt.divideScalar(a);
    let c = i.pos.clone().addScaledVector(Xt, Math.min(a, t * s)),
      l = go(c.x, c.z);
    if (o1(c, 0.45) || (l > 0.01 && l >= go(i.pos.x, i.pos.z))) {
      r.target.copy(i.pos);
      return;
    }
    (i.pos.copy(c), (i.spd = t), (i.dir = Math.atan2(Xt.x, Xt.z)));
  }
  var ml = [];
  function NH(i, e) {
    ml.forEach((t, n) => {
      let s = new H(Ut.x - 3 + n * 3, 0, Ut.z + 7);
      (t.pos.distanceTo(s) > 40 && t.pos.copy(s),
        E4(t, t.pos.distanceTo(e.pos) < 3 ? e.pos : null, 1.6, 6, i, s),
        t.rig.root.position.copy(t.pos),
        Qi(
          t.rig,
          i,
          t.spd,
          t.spd > 0 ? t.dir : t.pos.distanceTo(e.pos) < 3 ? Math.atan2(e.pos.x - t.pos.x, e.pos.z - t.pos.z) : null,
        ));
    });
  }
