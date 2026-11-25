  // ===== v93: ชิงช้าสวรรค์ (ขึ้นได้ หมุนจริง ชมวิว) =====
  var ccsFW = null,
    ccsRide = null,
    ccsShake = 0;
  const FW_PIV = [
    [0.1712, -0.0138], [0.1517, 0.0905], [0.0736, 0.1637], [-0.0324, 0.1781], [-0.1261, 0.1265],
    [-0.1717, 0.0297], [-0.1518, -0.0754], [-0.074, -0.1488], [0.0321, -0.1618], [0.1261, -0.1105],
  ];
  function ccsFerris() {
    if (!ze("fw_wheel") || !ze("fw_base") || !ze("fw_cab")) return;
    let i = 57,
      e = new H(40, 0, 45),
      t = new J();
    ((t.userData.noCull = !0), t.position.copy(e), K.add(t));
    let n = vp.fw_base.clone(!0);
    (n.position.set(0, 0, 0), n.scale.setScalar(i), t.add(n));
    let s = new J();
    (s.position.set(0, 0.2274 * i, 0), t.add(s));
    let o = vp.fw_wheel.clone(!0);
    (o.position.set(0, 0, 0), o.scale.setScalar(i), s.add(o));
    let r = [];
    for (let [c, l] of FW_PIV) {
      let h = vp.fw_cab.clone(!0);
      (h.position.set(0, 0, 0), h.scale.setScalar(i));
      let f = new J();
      (f.add(h), t.add(f), r.push({ g: f, a: Math.atan2(l - 0.008, c), r: Math.hypot(c, l - 0.008) * i, sw: 0, sv: 0 }));
    }
    let a = [];
    (t.traverse((c) => {
      if (!c.isMesh) return;
      ((c.castShadow = !0), (c.receiveShadow = !0));
      let l = c.material;
      l.emissiveMap && !a.includes(l) && ((c.material = l = l.clone()), a.push(l));
    }),
      pt.push({ x: e.x, z: e.z, hw: 7.9, hd: 3.7 }));
    // v95: ทางเข้าเครื่องเล่น — ซุ้มประตูโค้งไฟวิบวับ, ป้ายชื่อ, ตู้ขายตั๋ว, ทางเดินปูหิน, ราวกั้นคิว, กระถางดอกไม้, เสาไฟ
    let c = new H(e.x, 0, e.z + 4.6);
    ccsFWEntrance(e, c, a);
    pd(c.x, c.z, 3);
    ccsFW = { root: t, hub: s, cabs: r, mats: a, gate: c, S: i, ang: 0, w: (Math.PI * 2) / 75, hold: 0, hue: 0 };
    ccsFWLeds();
  }
  // v106: ไฟ LED RGB หลายเอฟเฟกต์บนวงล้อ (แทนไฟเดิม) + ไฟในกระเช้าทุกใบ
  function ccsFWLeds() {
    let i = ccsFW,
      e = [],
      t = [],
      n = (d, u, p, m, E) => (e.push(Math.cos(d) * u, Math.sin(d) * u, p), t.push({ a: d, r: u, k: m, s: E }));
    for (let d of [-1.38, 1.38]) {
      for (let u = 0; u < 150; u++) n((u / 150) * Math.PI * 2, 10.05, d, 0, u / 150);
      for (let u = 0; u < 80; u++) n((u / 80) * Math.PI * 2, 5.45, d, 1, u / 80);
      for (let u of i.cabs) for (let p = 0; p < 26; p++) n(u.a, 1.3 + (p / 25) * 8.4, d, 2, p / 25);
    }
    let s = new qe();
    s.setAttribute("position", new Fe(e, 3));
    let o = new Float32Array(t.length * 3);
    s.setAttribute("color", new Je(o, 3));
    let r = ss(64, 64, (d) => {
        let u = d.createRadialGradient(32, 32, 0, 32, 32, 32);
        (u.addColorStop(0, "rgba(255,255,255,1)"), u.addColorStop(0.25, "rgba(255,255,255,.85)"), u.addColorStop(0.6, "rgba(255,255,255,.18)"), u.addColorStop(1, "rgba(255,255,255,0)"), (d.fillStyle = u), d.fillRect(0, 0, 64, 64));
      }),
      a = new bs(s, new ls({ size: 0.42, map: r, vertexColors: !0, transparent: !0, depthWrite: !1, blending: $i, toneMapped: !1 })),
      c = new bs(s, new ls({ size: 1.5, map: r, vertexColors: !0, transparent: !0, opacity: 0.38, depthWrite: !1, blending: $i, toneMapped: !1 }));
    for (let d of [a, c]) ((d.frustumCulled = !1), (d.visible = !1), i.hub.add(d));
    // ไฟในกระเช้า: หลอดไฟ + แสงฟุ้ง + ตัวกระเช้าเรืองแสงอุ่น ๆ
    let l = [],
      h = [];
    for (let d of i.cabs) {
      d.g.traverse((m) => {
        if (!m.isMesh) return;
        let E = m.material;
        i.mats.includes(E) && ((E.emissiveMap = E.map), (E.needsUpdate = !0), h.push(E));
      });
      let u = new R(new we(0.16, 10, 8), new be({ color: 16770992, toneMapped: !1 }));
      (u.position.set(0, -0.05 * i.S + 1.55, 0), d.g.add(u));
      let p = new zi(new vi({ map: r, color: 16764032, transparent: !0, depthWrite: !1, blending: $i, opacity: 0, toneMapped: !1 }));
      (p.scale.setScalar(3.2), p.position.copy(u.position), d.g.add(p), l.push({ b: u, g: p }));
    }
    ((i.mats = i.mats.filter((d) => !h.includes(d))), (i.led = { pts: [a, c], col: o, info: t, geo: s, cabL: l, cabM: h, mode: 0, mt: 0, tw: new Float32Array(t.length) }));
  }
  var ccsFWC = null;
  function ccsFWLedTick(i, e, t) {
    let n = ccsFW?.led;
    if (!n) return;
    for (let o of n.pts) o.visible = t;
    for (let o of n.cabL) ((o.g.material.opacity = t ? 0.55 + 0.08 * Math.sin(e * 3 + o.b.id) : 0), (o.b.material.color.setHex(t ? 16770992 : 13421772)));
    for (let o of n.cabM) (o.emissive.setHex(16767392), (o.emissiveIntensity = t ? 0.55 : 0));
    if (!t) return;
    ((n.mt += i), n.mt > 9 && ((n.mt = 0), (n.mode = (n.mode + 1) % 6)));
    let s = ccsFWC ?? (ccsFWC = new ae()),
      o = n.col,
      r = n.mode,
      a = e;
    for (let c = 0; c < n.info.length; c++) {
      let l = n.info[c],
        h = 1,
        f = 0,
        d = 1;
      if (r === 0) f = l.a / (Math.PI * 2) + a * 0.15; // รุ้งหมุนรอบวง
      else if (r === 1) ((f = a * 0.07 + l.k * 0.33), (h = 0.25 + 0.75 * Math.max(0, Math.sin(l.r * 0.9 - a * 6)))); // คลื่นสีวิ่งจากแกนออกขอบ
      else if (r === 2) {
        // ประกายสุ่ม 16 ล้านสี
        (n.tw[c] -= i * 1.6), n.tw[c] <= 0 && Math.random() < i * 1.4 && (n.tw[c] = 1);
        ((f = (c * 0.6180339) % 1), (h = 0.12 + 0.88 * Math.max(0, n.tw[c])));
      } else if (r === 3) ((f = a * 0.12), (h = 0.55 + 0.45 * Math.sin(a * 3.2))); // หายใจเปลี่ยนสีทั้งวง
      else if (r === 4) {
        // ดาวหางไล่รอบวง
        let u = (l.s - a * 0.25 + 10) % 1;
        ((f = l.k === 2 ? a * 0.1 + 0.5 : a * 0.1), (h = l.k === 2 ? 0.35 + 0.65 * ((Math.floor(a * 4) + Math.floor(l.s * 8)) % 2) : Math.max(0.08, Math.pow(1 - u, 4))));
      } else ((f = Math.floor(l.a / (Math.PI / 5) + a * 1.5) * 0.17 + l.k * 0.08), (d = 1), (h = (Math.floor(a * 3) + l.k) % 2 ? 1 : 0.45)); // บล็อกสีกระพริบสลับ
      (s.setHSL(((f % 1) + 1) % 1, d, 0.55), (o[c * 3] = s.r * h), (o[c * 3 + 1] = s.g * h), (o[c * 3 + 2] = s.b * h));
    }
    n.geo.attributes.color.needsUpdate = !0;
  }
  function ccsFWEntrance(i, e, t) {
    let n = new J();
    K.add(n);
    let s = (A, F) => new X({ color: A, roughness: F ?? 0.55 }),
      o = (A, F, C, P, I, k, D) => {
        let L = new R(new ee(A, F, C), P);
        return (L.position.set(I, k, D), (L.castShadow = !0), (L.receiveShadow = !0), n.add(L), L);
      },
      r = i.x,
      a = i.z + 3.75,
      c = 11.5;
    // ทางเดินปูหินลายหมากรุกจากซุ้มถึงชานชาลา
    let l = ss(256, 512, (A) => {
      for (let F = 0; F < 8; F++)
        for (let C = 0; C < 16; C++) ((A.fillStyle = (F + C) % 2 ? "#e9d8b8" : "#d7b98e"), A.fillRect(F * 32, C * 32, 32, 32), (A.strokeStyle = "#b99a70"), A.strokeRect(F * 32 + 0.5, C * 32 + 0.5, 31, 31));
      ((A.fillStyle = "#c0392b"), A.fillRect(0, 0, 14, 512), A.fillRect(242, 0, 14, 512));
    });
    let h = new R(new Te(3.4, c), new X({ map: l, roughness: 0.8 }));
    ((h.rotation.x = -Math.PI / 2), h.position.set(r, 0.025, a + c / 2), (h.receiveShadow = !0), n.add(h));
    // ซุ้มประตูโค้ง
    let f = a + c - 0.6,
      d = new X({ color: 16777215, roughness: 0.4 }),
      u = new X({ color: 14031922, roughness: 0.4 });
    for (let A of [-2.3, 2.3]) {
      for (let F = 0; F < 8; F++) {
        let C = new R(new re(0.2, 0.2, 0.5, 14), F % 2 ? d : u);
        ((C.position.set(r + A, 0.25 + F * 0.5, f), (C.castShadow = !0)), n.add(C));
      }
      let F = new R(new we(0.3, 16, 12), new X({ color: 16766720, roughness: 0.3, metalness: 0.4 }));
      (F.position.set(r + A, 4.25, f), n.add(F));
      pt.push({ x: r + A, z: f, hw: 0.25, hd: 0.25 });
    }
    let p = new R(new vt(2.3, 0.16, 10, 32, Math.PI), u);
    (p.position.set(r, 4.1, f), n.add(p));
    let m = ss(1024, 256, (A) => {
        let F = A.createLinearGradient(0, 0, 0, 256);
        (F.addColorStop(0, "#ff5f6d"), F.addColorStop(1, "#c81d4e"), (A.fillStyle = F), A.fillRect(0, 0, 1024, 256), (A.strokeStyle = "#ffd84d"), (A.lineWidth = 14), A.strokeRect(10, 10, 1004, 236));
        ((A.fillStyle = "#fff"), (A.textAlign = "center"), (A.font = "700 92px Mitr, sans-serif"), A.fillText("ชิงช้าสวรรค์", 512, 118), (A.fillStyle = "#ffe066"), (A.font = "700 58px Mitr, sans-serif"), A.fillText("CHOWCHOW SKY WHEEL", 512, 205));
      }),
      E = new R(new ee(4.2, 1.05, 0.12), [s(13113422), s(13113422), s(13113422), s(13113422), new be({ map: m }), new be({ map: m })]);
    (E.position.set(r, 4.95, f), n.add(E));
    // หลอดไฟวิบวับรอบซุ้ม
    let g = [];
    for (let A = 0; A <= 16; A++) {
      let F = (A / 16) * Math.PI,
        C = new be({ color: 16768358 }),
        P = new R(new we(0.07, 8, 6), C);
      (P.position.set(r + Math.cos(F) * 2.52, 4.1 + Math.sin(F) * 2.52, f + 0.05), n.add(P), g.push(C));
    }
    for (let A = 0; A < 8; A++)
      for (let F of [-1, 1]) {
        let C = new be({ color: 16768358 }),
          P = new R(new we(0.06, 8, 6), C);
        (P.position.set(r + F * 2.12, 0.5 + A * 0.5, f + 0.12), n.add(P), g.push(C));
      }
    // ราวกั้นคิว (เสาทองเหลือง + เชือกแดง) 2 ข้างทางเดิน
    let y = s(13938487, 0.3);
    ((y.metalness = 0.7), (y.roughness = 0.3));
    let x = s(11867158, 0.7);
    for (let A of [-1.35, 1.35]) {
      let F = [];
      for (let C = a + 0.8; C < f - 0.9; C += 1.6) {
        let P = new R(new re(0.05, 0.05, 0.95, 10), y);
        (P.position.set(r + A, 0.475, C), n.add(P));
        let I = new R(new re(0.16, 0.18, 0.05, 14), y);
        (I.position.set(r + A, 0.025, C), n.add(I));
        let k = new R(new we(0.07, 10, 8), y);
        (k.position.set(r + A, 0.97, C), n.add(k), F.push(C));
      }
      for (let C = 0; C < F.length - 1; C++) {
        let P = new ah(new H(r + A, 0.9, F[C]), new H(r + A, 0.7, (F[C] + F[C + 1]) / 2), new H(r + A, 0.9, F[C + 1])),
          I = new R(new Yi(P, 10, 0.025, 6, !1), x);
        n.add(I);
      }
      pt.push({ x: r + A, z: (a + f) / 2, hw: 0.08, hd: (f - a) / 2 - 0.6, low: !0 });
    }
    // ตู้ขายตั๋ว (ข้างซุ้ม)
    {
      let A = r + 3.9,
        F = f - 0.6;
      let BM = s(16249318),
        BG = new X({ color: 9419999, roughness: 0.1, transparent: !0, opacity: 0.35 });
      // v107: เคาน์เตอร์เตี้ยลง (0.7) ให้เห็นตัวคนขายตั๋วตั้งแต่อกขึ้นไป ไม่จมในซุ้ม
      // ซุ้มสูงขึ้น (หลังคา 2.45) + แท่นยืนในซุ้ม 0.45 → เห็นคนขายตั้งแต่อกขึ้นไป
      (o(1.6, 0.7, 1.3, BM, A, 0.35, F), o(1.6, 1.7, 1.3, BG, A, 1.55, F), o(1.7, 0.1, 1.4, BM, A, 2.45, F), o(1.7, 0.06, 1.4, BM, A, 0.73, F), o(1.4, 0.45, 0.6, BM, A, 0.225, F - 0.25));
      for (let C of [-0.75, 0.75]) for (let P of [-0.6, 0.6]) o(0.08, 1.7, 0.08, BM, A + C, 1.55, F + P);
      let C = new R(new yt(1.35, 0.75, 4), new X({ color: 14031922, roughness: 0.5 }));
      ((C.rotation.y = Math.PI / 4), C.position.set(A, 2.88, F), (C.castShadow = !0), n.add(C));
      let P = ro("🎟 ตั๋ว 50💰", 3, 1.3, 0.34);
      (P.position.set(A, 2.33, F + 0.72), n.add(P));
      pt.push({ x: A, z: F, hw: 0.85, hd: 0.7 });
      // v106: ไฟในซุ้ม (หลอดไฟเพดาน + แสงฟุ้ง + แสงตกพื้น) และคนขายตั๋ว
      {
        let I = new R(new we(0.11, 10, 8), new be({ color: 16770992, toneMapped: !1 }));
        (I.position.set(A, 2.28, F), n.add(I));
        {
          let O = new En(16767392, 0, 3.8, 1.5);
          (O.position.set(A, 2.15, F + 0.2), K.add(O), H0.push({ l: O, on: 8 }));
        }
        let k = new R(new re(0.02, 0.02, 0.06, 6), s(3355443));
        (k.position.set(A, 2.37, F), n.add(k));
        let D = ss(64, 64, (q) => {
            let O = q.createRadialGradient(32, 32, 0, 32, 32, 32);
            (O.addColorStop(0, "rgba(255,240,200,1)"), O.addColorStop(0.35, "rgba(255,220,150,.5)"), O.addColorStop(1, "rgba(255,200,120,0)"), (q.fillStyle = O), q.fillRect(0, 0, 64, 64));
          }),
          L = new zi(new vi({ map: D, transparent: !0, depthWrite: !1, blending: $i, toneMapped: !1, opacity: 0 }));
        (L.scale.setScalar(2.2), L.position.copy(I.position), n.add(L));
        let q = pd(A, F + 0.9, 1.6);
        ccsBooth = { bulb: I, glow: L, mats: [BM, BG], at: new H(A, 0, F), front: new H(A, 0, F + 1.45) };
      }
      try {
        let I = mr()
            ? Zr([
                "Body_10",
                "Ears_10",
                "Female_Emotion_Happy_02",
                "Hairstyle_Female_07",
                "Outwear_33",
                "Pants_05",
                "Shoe_Slippers_02",
                "Hat_01",
              ])
            : Ic(Sh[5]),
          k = new H(A, 0.45, F - 0.2); // ยืนบนแท่นในซุ้ม
        (I.root.position.copy(k),
          (I.yaw = Math.PI),
          K.add(I.root),
          y0.push({
            rig: I,
            at: k.clone(),
            yaw: Math.PI,
            t: 5,
            moodT: 2,
            happy: !1,
            lines: [
              "ตั๋วชิงช้าสวรรค์ใบละ 50💰 จ้า!",
              "ขึ้นไปบนยอด เห็นทะเลทั้งอ่าวเลยนะ",
              "กลางคืนวงล้อเปิดไฟหลากสี สวยมาก ✨",
              "น้องหมาขึ้นได้ ปลอดภัย มีราวกั้นครบ",
              "รับตั๋วไหมจ๊ะ หนึ่งรอบประมาณนาทีกว่า ๆ",
            ],
          }));
      } catch (I) {
        console.warn("ticket npc", I);
      }
    }
    // กระถางดอกไม้ + เสาไฟข้างซุ้ม
    let b = [16733525, 16766720, 16738740, 10053375, 16777215];
    for (let A of [-3.6, 3.6]) {
      if (A > 0) continue;
      let F = new R(new re(0.55, 0.45, 0.55, 16), s(11699253, 0.8));
      (F.position.set(r + A, 0.275, f - 0.3), n.add(F));
      for (let C = 0; C < 9; C++) {
        let P = new R(new we(0.13, 8, 6), s(b[C % b.length], 0.6));
        (P.position.set(r + A + Math.cos(C * 0.7) * 0.32, 0.62 + (C % 3) * 0.06, f - 0.3 + Math.sin(C * 0.7) * 0.32), n.add(P));
      }
      pt.push({ x: r + A, z: f - 0.3, hw: 0.55, hd: 0.55 });
    }
    for (let A of [-1.6, 1.6])
      for (let F of [a + 3.2, a + 7.2]) {
        let C = new R(new we(0.06, 6, 4), s(16766720));
        (C.position.set(r + A * 1.18, 0.15, F), n.add(C));
      }
    // แสงไฟส่องทางตอนกลางคืน
    for (let A of [a + 2, f - 1.2]) pd(r, A, 2.6);
    {
      let A = new En(16766880, 0, 9, 1.4);
      (A.position.set(r, 3.6, f - 0.8), K.add(A), H0.push({ l: A, on: 10 }));
    }
    ccsFWBulbs = g;
  }
  var ccsFWBulbs = [],
    ccsBooth = null;
  function ccsFWTick(i, e) {
    if (!ccsFW) return;
    let t = ccsFW,
      n = ccsRide;
    // ตอนน้องขึ้นถึงยอด หยุดค้าง 5 วิให้ชมวิว
    if (n && n.k >= 0 && !n.topDone) {
      let o = t.cabs[n.k],
        r = o.a + t.ang;
      Math.sin(r) > 0.995 && ((n.topDone = !0), (t.hold = 5), De("✨ วิวสวยมาก! เห็นทั้งเมือง ทะเล ประภาคาร และเกาะภูเขาป่ากลางทะเล 🏝", 4200), ke("heart"));
    }
    let s = t.hold > 0 ? 0 : t.w;
    ((t.hold = Math.max(0, t.hold - i)), (t.spd = (t.spd ?? s) + (s - (t.spd ?? s)) * Math.min(1, i * 1.5)), (t.ang += t.spd * i), (t.hub.rotation.z = t.ang));
    let o = t.spd - (t.ps ?? t.spd);
    t.ps = t.spd;
    for (let r of t.cabs) {
      let a = r.a + t.ang;
      ((r.sv += (-r.sw * 18 - r.sv * 1.6 - (o / Math.max(i, 1e-3)) * 0.6 * Math.cos(a)) * i), (r.sw += r.sv * i), r.g.position.set(Math.cos(a) * r.r, t.hub.position.y + Math.sin(a) * r.r + 0.008 * t.S, 0), (r.g.rotation.z = r.sw * 0.15));
    }
    // ไฟ LED ตอนกลางคืนไล่สี
    let a = j.time % 1 > 0.79 || j.time % 1 < 0.21;
    t.hue = (t.hue + i * 0.08) % 1;
    ccsFWBulbs.forEach((r, c) => r.color.setHSL(a ? (c * 0.06 + t.hue) % 1 : 0.13, a ? 1 : 0.9, (Math.floor(e * 4) + c) % 3 ? (a ? 0.6 : 0.75) : 0.95));
    for (let r of t.mats) (r.emissive.setHSL(0, 0, 0.35), (r.emissiveIntensity = a ? 0 : 0.4)); // v106: ปิดไฟแถบเดิมตอนกลางคืน ใช้ LED RGB แทน
    ccsFWLedTick(i, e, a);
    ccsBooth && ((ccsBooth.glow.material.opacity = a ? 0.85 : 0), ccsBooth.bulb.material.color.setHex(a ? 16770992 : 14540253), ccsBooth.mats.forEach((r, c) => (r.emissive.setHex(16767392), (r.emissiveIntensity = a ? (c ? 0.55 : 0.3) : 0))));
    // จบรอบ: กระเช้ากลับมาล่างสุด → ลง
    if (n && n.k >= 0) {
      let r = t.cabs[n.k].a + t.ang;
      ((n.trav += t.spd * i), n.trav > Math.PI * 2 - 0.05 && Math.sin(r) < -0.97 && ccsRideEnd());
    }
  }
  function ccsCabWorld(i, e) {
    let t = ccsFW,
      n = t.cabs[i];
    return (n.g.updateMatrixWorld(!0), e.set(0, -0.05 * t.S + 0.32, 0).applyMatrix4(n.g.matrixWorld));
  }
  function ccsRideStart() {
    if (ccsRide || !ccsFW) return;
    if (z.money < 50) return (De("เงินไม่พอ ตั๋วชิงช้าสวรรค์ 50 💰", 1800), ke("nope"));
    ((z.money -= 50), ke("coin"), Ei());
    let i = ccsFW,
      e = 0,
      t = 9;
    i.cabs.forEach((n, s) => {
      let o = Math.sin(n.a + i.ang);
      o < t && ((t = o), (e = s));
    });
    ((() => {
      // หันหน้าน้องและกล้องไปทางทะเล/ภูเขาไฟ
      let n = (ccsIsle ? ccsIsle.g.position.x : -60) - i.root.position.x,
        s = (ccsIsle ? ccsIsle.g.position.z : Rt + 305) - i.root.position.z;
      ((ccsRide = { k: e, trav: 0, topDone: !1, yaw: Math.atan2(n, s) }), (j.yaw = Math.atan2(-n, -s)), (j.pitch = 0.12));
    })(),
      (i.hold = 0), De("🎡 ขึ้นกระเช้าแล้ว! ลากจอ (หรือจอยขวา) หมุนมุมมองชมวิว · หมุนครบ 1 รอบแล้วลงเอง", 3600));
    for (let n of Le.slice(1)) n.found && ((n.rideHide = !0), (n.rig.root.visible = !1));
    Le[0]?.rig.root.traverse((n) => n.userData.isXray && (n.visible = !1)); // ในกระเช้าไม่ต้องโชว์เงาเอ็กซเรย์สีส้ม
    for (let n of Pr) n.rig.root.visible = !1;
  }
  function ccsRideEnd() {
    let i = Le[0];
    (i && (i.pos.set(ccsFW.gate.x, 0, ccsFW.gate.z + 0.8), (j.jy = 0), (j.vy = 0)), (ccsRide = null), De("🎡 ลงจากชิงช้าสวรรค์แล้ว สนุกไหม? 🐾", 2200));
    Le[0]?.rig.root.traverse((e) => e.userData.isXray && (e.visible = !0));
    for (let e of Le.slice(1)) e.rideHide && ((e.rideHide = !1), (e.rig.root.visible = !0), e.pos.copy(ccsFW.gate).add(new H(1, 0, 1.5)));
  }
  var ccsRV = new H();
  function ccsRideStep(i, e) {
    ccsCabWorld(ccsRide.k, ccsRV);
    (i.pos.set(ccsRV.x, 0, ccsRV.z), (j.jy = ccsRV.y - (x4(i.pos, 0, b4) || 0)), (j.vy = 0), (i.spd = 0), (i.dir = ccsRide.yaw));
  }
  function ccsCamPost(i, e) {
    if (ccsRide && ccsFW) {
      ccsCabWorld(ccsRide.k, ccsRV);
      let t = Math.min(j.dist, 4.2),
        n = Math.max(-0.2, j.pitch);
      (Lt.position.set(ccsRV.x + Math.sin(j.yaw) * Math.cos(n) * t, ccsRV.y + 0.7 + Math.sin(n) * t, ccsRV.z + Math.cos(j.yaw) * Math.cos(n) * t), Lt.lookAt(ccsRV.x, ccsRV.y + 0.6, ccsRV.z));
    }
    ho || (ccsTRCamA = null);
    if (ccsBath) {
      // กล้องอาบน้ำ: ใช้ตำแหน่งของตัวเอง (ไม่แย่งกับกล้องปกติ = ภาพไม่สั่น) และตรึงตัวน้องในอ่างหลังทุกระบบขยับเสร็จ
      let b = ccsBath.at;
      (ccsBath.cam ??= Lt.position.clone()).lerp(Xt.set(b.x + 1.1, 1.85, b.z - 2.1), Math.min(1, e * 3));
      (Lt.position.copy(ccsBath.cam), Lt.lookAt(b.x, 0.75, b.z));
      let d = Le[0];
      d && (d.pos.set(b.x, 0, b.z), d.rig.root.position.set(b.x, j.gy + 0.4, b.z));
    }
    ccsShake > 0.001 && (Lt.position.x += (Math.random() - 0.5) * ccsShake, (Lt.position.y += (Math.random() - 0.5) * ccsShake), (ccsShake *= Math.pow(0.2, e)));
  }
  // ===== v93: เกาะภูเขาไฟกลางทะเล ปะทุ + ลาวาไหล =====
  var ccsVol = null,
    ccsIsle = null;
  function ccsSoftTex() {
    return ss(64, 64, (i) => {
      let e = i.createRadialGradient(32, 32, 0, 32, 32, 32);
      (e.addColorStop(0, "rgba(255,255,255,1)"), e.addColorStop(0.5, "rgba(255,255,255,.55)"), e.addColorStop(1, "rgba(255,255,255,0)"), (i.fillStyle = e), i.fillRect(0, 0, 64, 64));
    });
  }
  function ccsVolcano() {
    if (!ze("volcano_isle")) return;
    let i = new H(-60, 0, Rt + 305),
      e = new J();
    ((e.userData.noCull = !0), e.position.copy(i), K.add(e)); // v95: วัตถุใหญ่ไกล ๆ ไม่ซ่อนตามระยะ
    // v96: เอาภูเขาไฟออก — เหลือเกาะ Tacana (ภูเขาป่าจริง) ตั้งกลางทะเลไกล ๆ เป็นวิว
    let t = je("volcano_isle", 165);
    (t.position.set(0, Ph - 2.5, 0), e.add(t));
    t.traverse((A) => {
      if (!A.isMesh) return;
      ((A.material = A.material.clone()), (A.material.fog = !1), (A.receiveShadow = !0));
      // หมอกระยะไกล (aerial perspective) ตามความใสของอากาศรายวัน
      A.material.onBeforeCompile = (F) => {
        ((F.uniforms.uHaze = ccsHaze),
          (F.uniforms.uHazeCol = ccsHazeCol),
          (F.fragmentShader = F.fragmentShader.replace("#include <common>", "#include <common>\nuniform float uHaze; uniform vec3 uHazeCol;").replace("#include <dithering_fragment>", "#include <dithering_fragment>\ngl_FragColor.rgb = mix(gl_FragColor.rgb, uHazeCol, clamp(uHaze, 0.0, 0.9));")));
      };
    });
    e.updateMatrixWorld(!0);
    let o = new mt().setFromObject(t),
      r = ccsSoftTex(),
      a = [];
    for (let A = 0; A < 9; A++) {
      let F = new zi(new vi({ map: r, color: 16777215, transparent: !0, opacity: 0, depthWrite: !1, fog: !1 }));
      (e.add(F), a.push({ s: F, ang: (A / 9) * Math.PI * 2, rad: 12 + (A % 3) * 9, h: 0.68 + (A % 4) * 0.08, sz: 34 + (A % 3) * 14 }));
    }
    ccsIsle = { g: e, top: e.worldToLocal(new H((o.min.x + o.max.x) / 2, o.max.y, (o.min.z + o.max.z) / 2)), cap: a, amt: 0 };
    return;
  }
  function ccsVolcanoTick(i, e) {
    if (ccsIsle) {
      // เมฆปกคลุมยอดเขา: มากตอนเช้า/เย็น, วันฟ้าหม่น, ฟ้าครึ้ม; วันฟ้าใสแทบไม่มี
      let n = j.time % 1,
        s = Math.max(0, 1 - Math.abs(n - 0.27) / 0.08) * 0.9 + Math.max(0, 1 - Math.abs(n - 0.75) / 0.07) * 0.6,
        o = Math.min(1, s * (1 - 0.6 * ccsClar) + (1 - ccsClar) * 0.55 + co.cur.o * 0.8 + 0.25 * Math.max(0, Math.sin(e * 0.021)));
      ccsIsle.amt += (o - ccsIsle.amt) * Math.min(1, i * 0.3);
      let r = n > 0.79 || n < 0.21,
        a = ccsIsle.top;
      for (let c of ccsIsle.cap) {
        c.ang += i * 0.012;
        (c.s.position.set(a.x + Math.cos(c.ang) * c.rad, a.y * c.h + Math.sin(e * 0.05 + c.ang) * 2, a.z + Math.sin(c.ang) * c.rad * 0.6), c.s.scale.set(c.sz * 1.6, c.sz * 0.7, 1), (c.s.material.opacity = ccsIsle.amt * 0.75), c.s.material.color.copy(ccsHazeCol.value).lerp(oa.setHex(16777215), r ? 0.1 : 0.7));
      }
    }
  // v103: ลบระบบภูเขาไฟปะทุออกแล้ว (เหลือแค่เกาะ Tacana + เมฆคลุมยอด)
  }
  // ===== v93: ฟิสิกส์ไดนามิก — ของในฉากชนแล้วล้ม/กลิ้ง, ของลอยน้ำตามคลื่น, น้ำกระเซ็น =====
  var ccsBodies = [],
    ccsFloats = [],
    ccsSplash = null,
    ccsPhysInit = !1,
    ccsQa = new At(),
    ccsQb = new At(),
    ccsVa = new H(),
    ccsUp = new H(0, 1, 0);
  function ccsBrkY(i, e, t) {
    // v128: สูตรเดียวกับคลื่นหัวแตกใน shader (ของลอยน้ำขึ้นลงตามคลื่นที่เห็นจริง)
    let n = e - Rt;
    if (n < 0 || n > 40) return 0;
    let s = 0.62832 * (-n - 3.4 * t) + 0.45 * Math.sin(i * 0.045 + 0.7) + 0.25 * Math.sin(i * 0.11 - 1.3),
      o = 0.5 + 0.5 * Math.sin(s / 7.3 + 0.8 * Math.sin(s / 19)),
      r = 0.22 + 1.45 * o * o * o,
      a = (x, y, v) => ((v = Math.max(0, Math.min(1, (v - x) / (y - x)))), v * v * (3 - 2 * v)),
      c = 0.16 * ccsSeaV * r * a(40, 16, n) * (1 + 0.9 * a(14, 4, n)),
      l = 1.5 + c * 9;
    c *= (1 + (0.35 - 1) * a(l, l - 4, n)) * a(0, 1.5, n);
    let h = 0.5 + 0.5 * Math.sin(s),
      f = Math.pow(h, 1 + 3 * a(26, 5, n));
    return c * (f * 1.7 - 0.45);
  }
  function ccsWaveY(i, e, t) {
    let n = Math.max(0, e - Rt),
      s = (0.015 + 0.22 * Math.min(1, Math.max(0, (n - 4) / 36))) * ccsSeaV,
      o = Math.sin(i * 0.21 + t * 0.9) * 0.45 + Math.sin(e * 0.33 - t * 1.35 + i * 0.07) * 0.4 + Math.sin((i - e) * 0.6 + t * 2.1) * 0.15;
    return Ph + o * s + 0.02 * Math.sin(t * 1.7 + i * 0.9 + e * 0.6) + ccsBrkY(i, e, ccsSeaT || t);
  }
  function ccsMkCone() {
    let i = new J(),
      e = new X({ color: 16737792, roughness: 0.55 }),
      t = new R(new ee(0.4, 0.04, 0.4), new X({ color: 2236962, roughness: 0.8 }));
    ((t.position.y = 0.02), i.add(t));
    let n = new R(new re(0.03, 0.16, 0.56, 14), e);
    ((n.position.y = 0.32), i.add(n));
    let s = new R(new re(0.075, 0.1, 0.1, 14), new X({ color: 16777215, roughness: 0.4 }));
    return ((s.position.y = 0.36), i.add(s), { g: i, r: 0.19, lr: 0.16, h: 0.6, snd: "pop" });
  }
  function ccsMkBin() {
    // v97: ถังขยะทรงกระบอกมีฝา ห่วงจับ ร่องคาด และป้ายรีไซเคิล
    let i = new J(),
      e = new X({ color: 2984521, roughness: 0.55, metalness: 0.1 }),
      t = new X({ color: 1856570, roughness: 0.5 }),
      n = new R(new re(0.22, 0.19, 0.68, 20, 1, !0), e);
    ((n.position.y = 0.36), (n.material.side = Ke), i.add(n));
    let s = new R(new re(0.19, 0.19, 0.02, 20), t);
    ((s.position.y = 0.03), i.add(s));
    for (let r of [0.16, 0.56]) {
      let a = new R(new vt(0.205 + r * 0.03, 0.012, 6, 24), t);
      ((a.rotation.x = Math.PI / 2), (a.position.y = r), i.add(a));
    }
    let o = new R(new re(0.235, 0.235, 0.045, 20), t);
    ((o.position.y = 0.72), i.add(o));
    let r = new R(new vt(0.06, 0.012, 6, 12, Math.PI), new X({ color: 13421772, roughness: 0.4, metalness: 0.5 }));
    ((r.position.y = 0.745), i.add(r));
    let a = new R(new Te(0.16, 0.16), new be({ map: ss(64, 64, (c) => ((c.fillStyle = "#fff"), (c.font = "48px sans-serif"), (c.textAlign = "center"), c.fillText("♻", 32, 48))), transparent: !0 }));
    return ((a.position.set(0, 0.42, 0.214), (a.rotation.x = -0.04)), i.add(a), { g: i, r: 0.22, lr: 0.235, h: 0.75, snd: "pop", bin: !0 });
  }
  function ccsMkCrate() {
    let i = new J(),
      e = new R(new ee(0.5, 0.42, 0.42), new X({ map: Cn(11827314, "#7a5530"), roughness: 0.85 }));
    ((e.position.y = 0.21), i.add(e));
    let t0 = ["Watermelon_Slice_1", "dk_fc_2", "Bottle_1"][ccsBodies.length % 3],
      t = ze(t0) ? je(t0, 0.22) : null;
    return (t && ((t.position.y = 0.44), i.add(t)), { g: i, r: 0.24, h: 0.46, snd: "pop" });
  }
  function ccsAddBody(i, e, t, n) {
    let s = i();
    if ((s.g.position.set(e, 0, t), (s.g.rotation.y = n), ri(s.g.position, s.r, !0))) return;
    (s.g.traverse((o) => {
      o.isMesh && ((o.castShadow = !0), (o.receiveShadow = !0));
    }),
      K.add(s.g),
      Object.assign(s, { hx: e, hz: t, yaw: n, x: e, z: t, vx: 0, vz: 0, tilt: 0, tv: 0, nx: 0, nz: 1, lying: !1, away: 0, roll: 0 }),
      ccsBodies.push(s));
  }
  function ccsMkBeachBall(i, e, t) {
    let n = ss(256, 128, (a) => {
        let c = ["#ff3b3b", "#ffffff", "#ffd400", "#ffffff", "#2a8cff", "#ffffff"];
        for (let l = 0; l < 6; l++) ((a.fillStyle = c[l]), a.fillRect((l * 256) / 6, 0, 256 / 6 + 1, 128));
      }),
      s = new R(new we(i, 20, 14), new X({ map: n, roughness: 0.35 }));
    s.castShadow = !0;
    let o = new J();
    return (o.add(s), K.add(o), { m: o, pos: new H(e, 0, t), vel: new H(), y: 0, vy: 0, r: i, beach: !0 });
  }
  // v111: ห่วงยาง/ของลอยน้ำโมเดลใหม่ (Cartoon Float Pool Pack) + ฟิสิกส์ลอยน้ำสมจริง
  var ccsFloatNew = !1;
  function ccsFloatsBuild() {
    if (ccsFloatNew || !vp.float_ringa) return;
    ccsFloatNew = !0;
    for (let i = ccsFloats.length - 1; i >= 0; i--) ccsFloats[i].kayak || (K.remove(ccsFloats[i].g), ccsFloats.splice(i, 1));
    // [โมเดล, x, z (จากชายหาด), ขนาด, มวล]
    for (let [i, e, t, n, s] of [
      ["float_ringa", -6, 3.2, 0.95, 1],
      ["float_unia", 9, 4.6, 1.35, 1.6],
      ["float_flamingo", 18, 6.2, 1.3, 1.5],
      ["float_duckring", -10.5, 4.4, 1.05, 1.2],
      ["float_ringb", 3.5, 6.5, 0.95, 1],
      ["float_unib", -18, 5.6, 1.25, 1.5],
      ["float_ringc", 13.5, 3.4, 0.95, 1],
      ["float_rainbow", -2, 8.2, 1.5, 1.8],
      ["float_ball", 2, 3.8, 0.45, 0.35],
      ["float_ducky", -2.5, 2.6, 0.42, 0.4],
      ["float_ducky", 5.5, 2.4, 0.42, 0.4],
      ["float_noodle1", 7.5, 7.6, 1.25, 0.6],
      ["float_noodle2", -13.5, 7.4, 1.2, 0.6],
      ["float_noodle3", 22, 4.2, 1.2, 0.6],
    ]) {
      if (!vp[i]) continue;
      let o = je(i, n),
        r = new J();
      (o.traverse((c) => c.isMesh && ((c.castShadow = !0), (c.receiveShadow = !1))), r.add(o));
      let a = new mt().setFromObject(o),
        c = a.getSize(new H());
      // ให้จมน้ำราว 35% ของความสูง (ห่วงยางลอยตื้น ลูกบอล/เป็ดลอยสูง)
      let dr = c.y * (s < 0.5 ? 0.3 : 0.38);
      ((o.position.y = -a.min.y - dr), r.position.set(e, Ph, Rt + t), K.add(r));
      ccsFloats.push({ g: r, x: e, z: Rt + t, hx: e, hz: Rt + t, vx: 0, vz: 0, vy: 0, y: Ph, dr: dr, r: Math.max(c.x, c.z) * 0.46, m: s, yaw: Math.random() * 6, yv: (Math.random() - 0.5) * 0.3, px: 0, pz: 0, pvx: 0, pvz: 0, nw: !0 });
    }
  }
  function ccsPhysSetup() {
    ccsPhysInit = !0;
    // กรวยจราจร/ถังขยะ ริมฟุตบาท
    for (let [i, e] of [[-3.5, 8.6], [-2.6, 8.6], [-1.7, 8.6], [21, -8.4], [22, -8.4], [-46, 8.5]]) ccsAddBody(ccsMkCone, i, e, 0);
    for (let [i, e] of [[12.5, 8.9], [-15, 8.9], [-6.5, Rt - 7.5], [7, Rt - 7.5]]) ccsAddBody(ccsMkBin, i, e, 0.3);
    // ลังผลไม้ข้างแผงลุงทะเล
    for (let [i, e, t] of [[2.6, 0.7, 0], [2.6, -0.1, 0.4], [-2.4, 0.9, 0.2]]) ccsAddBody(ccsMkCrate, od.x + i, od.z + e, t);
    // ลูกบอลชายหาด (ใช้ระบบลูกบอลเดิม เด้ง/กลิ้ง/เตะได้)
    for (let [i, e] of [[4, Rt - 3], [-9, Rt - 2.5], [14, Rt - 4]]) _d.push(ccsMkBeachBall(0.32, i, e));
    // ของลอยน้ำ: ห่วงยาง ลูกบอล เป็ดยาง เรือคายัค
    let i = (n, s) => new X({ color: n, roughness: s ?? 0.45 });
    for (let [n, s, o] of [
      ["ring", -6, Rt + 3.2],
      ["ring", 9, Rt + 4.4],
      ["ball", 2, Rt + 3.8],
      ["duck", -2.5, Rt + 2.6],
      ["duck", 5.5, Rt + 2.4],
      ["kayak", -14, Rt + 7.5],
      ["ring", 18, Rt + 6],
    ]) {
      let r = new J(),
        a = 0.3;
      if (n === "ring") {
        let c = new R(new vt(0.42, 0.14, 12, 28), i(o % 2 > 1 ? 16729156 : 16740096));
        ((c.rotation.x = Math.PI / 2), r.add(c));
        for (let l = 0; l < 4; l++) {
          let h = new R(new vt(0.42, 0.145, 6, 6, Math.PI / 8), i(16777215));
          ((h.rotation.x = Math.PI / 2), (h.rotation.z = (l * Math.PI) / 2), r.add(h));
        }
        a = 0.56;
      } else if (n === "ball") {
        let c = ccsMkBeachBall(0.3, 0, 0);
        (K.remove(c.m), r.add(c.m), (c.m.position.y = 0.12), (a = 0.3));
      } else if (n === "duck") {
        let c = new R(new we(0.2, 14, 10), i(16766208));
        ((c.scale.set(1, 0.75, 1.25), (c.position.y = 0.06)), r.add(c));
        let l = new R(new we(0.12, 12, 8), i(16766208));
        (l.position.set(0, 0.24, 0.16), r.add(l));
        let h = new R(new yt(0.05, 0.1, 8), i(16738816));
        ((h.rotation.x = Math.PI / 2), h.position.set(0, 0.22, 0.31), r.add(h));
        for (let f of [-0.05, 0.05]) {
          let d = new R(new we(0.02, 6, 4), i(1118481));
          (d.position.set(f, 0.28, 0.25), r.add(d));
        }
        a = 0.24;
      } else {
        let c = new R(new we(0.5, 16, 10), i(1946623, 0.35));
        ((c.scale.set(0.6, 0.32, 3.2)), r.add(c));
        let l = new R(new ee(0.4, 0.05, 0.7), i(2236962));
        (l.position.set(0, 0.15, 0), r.add(l));
        let h = new R(new re(0.02, 0.02, 2.2, 6), i(13421772));
        ((h.rotation.z = Math.PI / 2 - 0.2), h.position.set(0, 0.3, 0.2), r.add(h));
        a = 0.8;
      }
      (r.traverse((c) => {
        c.isMesh && (c.castShadow = !0);
      }),
        r.position.set(s, Ph, o),
        K.add(r),
        ccsFloats.push({ g: r, x: s, z: o, hx: s, hz: o, vx: 0, vz: 0, r: a, yaw: Math.random() * 6, yv: 0, kayak: n === "kayak" }));
    }
    // ละอองน้ำกระเซ็น + วงคลื่น
    let e = new be({ color: 15400959, transparent: !0, opacity: 0.85, depthWrite: !1 }),
      t = [];
    for (let n = 0; n < 40; n++) {
      let o = new R(new we(0.065, 6, 4), e);
      ((o.visible = !1), K.add(o), t.push({ m: o, vx: 0, vy: 0, vz: 0, life: 0 }));
    }
    let n = [];
    for (let o = 0; o < 6; o++) {
      let r = new R(new rr(0.8, 1, 32), new be({ color: 16777215, transparent: !0, opacity: 0, depthWrite: !1 }));
      ((r.rotation.x = -Math.PI / 2), (r.visible = !1), K.add(r), n.push({ m: r, life: 0 }));
    }
    ccsSplash = { drops: t, rings: n, di: 0, ri: 0, acc: 0, ringAcc: 0, wasIn: !1 };
  }
  function ccsSplashAt(i, e, t, n) {
    let s = ccsSplash;
    for (let o = 0; o < n; o++) {
      let r = s.drops[s.di++ % s.drops.length],
        a = Math.random() * Math.PI * 2,
        c = 0.6 + Math.random() * 1.4;
      (r.m.position.set(i + Math.cos(a) * 0.25, e, t + Math.sin(a) * 0.25), (r.vx = Math.cos(a) * c), (r.vz = Math.sin(a) * c), (r.vy = 1.8 + Math.random() * 2.2), (r.life = 0.6 + Math.random() * 0.4), (r.m.visible = !0), r.m.scale.setScalar(0.6 + Math.random()));
    }
  }
  function ccsRingAt(i, e, t) {
    if (ccsRipDrop(i, t, 0.25, 0.04)) return; // v128: ใช้คลื่นจำลองแทนวงแหวนแบน
    let n = ccsSplash.rings[ccsSplash.ri++ % ccsSplash.rings.length];
    (n.m.position.set(i, e + 0.02, t), (n.life = 1.2), (n.m.visible = !0));
  }
  function ccsPhysTick(i, e, t) {
    if (!j.started || !e || Se) return;
    ccsPhysInit || ccsPhysSetup();
    let n = e.pos,
      s = e.spd ?? 0,
      o = [{ p: n, v: s, r: 0.5 }, ...ml.map((a) => ({ p: a.pos, v: a.spd ?? 0, r: 0.35 }))];
    // ---- ของล้มได้ ----
    for (let a of ccsBodies) {
      let c = Math.hypot(a.x - n.x, a.z - n.z),
        l = a.tilt > 0.001 || Math.abs(a.vx) + Math.abs(a.vz) > 0.01 || a.lying;
      if (c > 40 && !l) continue;
      for (let h of o) {
        let f = a.x - h.p.x,
          d = a.z - h.p.z,
          u = Math.hypot(f, d),
          p = a.r + h.r;
        if (u < p && u > 1e-3) {
          let m = f / u,
            E = d / u,
            g = Math.max(0.8, h.v);
          ((a.x = h.p.x + m * p), (a.z = h.p.z + E * p), (a.vx += m * g * 0.9 * (a.lying ? 1.3 : 0.6)), (a.vz += E * g * 0.9 * (a.lying ? 1.3 : 0.6)));
          if (!a.lying && a.tilt < 0.02) ((a.nx = m), (a.nz = E), (a.tv = Math.max(a.tv, g * 0.7)), h.v > 1.6 && ke(a.snd));
        }
      }
      if (!a.lying) {
        let h = Math.atan2(a.r, a.h * 0.5),
          f = (9.8 / (a.h * 0.75)) * Math.sin(a.tilt - h + (a.tilt > h ? 0 : 0));
        ((a.tv += (a.tilt > 0.001 || a.tv > 0 ? f : 0) * i), (a.tv *= Math.pow(0.6, i)), (a.tilt += a.tv * i));
        if (a.tilt <= 0) ((a.tilt = 0), (a.tv = Math.abs(a.tv) > 0.4 ? -a.tv * 0.3 : 0));
        a.tilt >= Math.PI / 2 && ((a.tilt = Math.PI / 2), (a.lying = !0), (a.tv = 0), ke("pop"), (a.x += a.nx * (a.r + a.h / 2)), (a.z += a.nz * (a.r + a.h / 2)), (a.vx += a.nx * 0.3 + -a.nz * (Math.random() - 0.5) * 1.2), (a.vz += a.nz * 0.3 + a.nx * (Math.random() - 0.5) * 1.2));
      }
      let h = a.x + a.vx * i,
        f = a.z + a.vz * i;
      (ccsVa.set(h, 0, f), ri(ccsVa, a.r * 0.8, !0) ? ((a.vx *= -0.4), (a.vz *= -0.4)) : ((a.x = h), (a.z = f)));
      let d = a.lying ? -a.nz * a.vx + a.nx * a.vz : 0;
      if (a.lying) {
        let u = a.vx * a.nx + a.vz * a.nz,
          p = Math.pow(0.86, i * 60),
          m = Math.pow(0.985, i * 60);
        ((u *= p), (d *= m), (a.vx = a.nx * u - a.nz * d), (a.vz = a.nz * u + a.nx * d), (a.roll += (d / (a.lr ?? a.r)) * i));
      } else ((a.vx *= Math.pow(0.8, i * 60)), (a.vz *= Math.pow(0.8, i * 60)));
      // ตั้งกลับที่เดิมเมื่อน้องไปไกล
      let u = Math.hypot(a.x - a.hx, a.z - a.hz) > 0.2 || a.tilt > 0.01;
      ((a.away = u && c > 28 ? a.away + i : 0), a.away > 6 && ((a.x = a.hx), (a.z = a.hz), (a.vx = a.vz = 0), (a.tilt = a.tv = 0), (a.lying = !1), (a.roll = 0), (a.away = 0)));
      // วาด: หมุนรอบขอบฐานด้านที่ล้ม
      let p = new H(a.nz, 0, -a.nx);
      (ccsQa.setFromAxisAngle(p, a.tilt), ccsQb.setFromAxisAngle(ccsUp, a.yaw));
      if (a.lying && a.roll) {
        let m = new At().setFromAxisAngle(new H(a.nx, 0, a.nz), a.roll);
        ccsQa.premultiply(m);
      }
      a.g.quaternion.copy(ccsQa).multiply(ccsQb);
      let gy = (a.gy = a.gy ?? b4(a.x, a.z));
      (Math.abs(a.x - (a.gx ?? 1e9)) + Math.abs(a.z - (a.gz ?? 1e9)) > 0.3 && ((a.gy = gy = b4(a.x, a.z)), (a.gx = a.x), (a.gz = a.z)));
      if (a.lying) {
        // นอนราบ: แกนกระบอกสูงจากพื้นเท่ารัศมี (ไม่จมพื้น), กลิ้งรอบแกนตัวเอง
        let m = a.lr ?? a.r;
        ccsVa.set(0, a.h / 2, 0).applyQuaternion(ccsQa);
        a.g.position.set(a.x - ccsVa.x, gy + m - ccsVa.y * 0, a.z - ccsVa.z);
      } else {
        ccsVa.set(-a.nx * a.r, 0, -a.nz * a.r).applyQuaternion(ccsQa);
        a.g.position.set(a.x + a.nx * a.r + ccsVa.x, gy + Math.max(0, ccsVa.y), a.z + a.nz * a.r + ccsVa.z);
      }
    }
    // ลูกบอลชายหาดลอยน้ำ
    for (let a of _d)
      if (a.beach && a.pos.z > Rt - 1.3) {
        let c = ccsWaveY(a.pos.x, a.pos.z, t);
        (a.m.position.y = Math.max(a.m.position.y, c + a.r * 0.55), (a.vel.z -= 0.25 * i), (a.vel.x += Math.sin(t * 0.3) * 0.05 * i));
      }
    // ---- ของลอยน้ำ (v111: แรงลอยตัว + คลื่นพัด + ลม + เอียงตามผิวน้ำ + ชนกันเอง) ----
    ccsFloatsBuild();
    for (let a of ccsFloats) {
      if (Math.hypot(a.x - n.x, a.z - n.z) > 70) continue;
      if (!a.nw) {
        // เรือคายัค: ระบบเดิม
        for (let f of o) {
          let d = a.x - f.p.x,
            u = a.z - f.p.z,
            p = Math.hypot(d, u),
            m = a.r + f.r;
          p < m && p > 1e-3 && ((a.x = f.p.x + (d / p) * m), (a.z = f.p.z + (u / p) * m), (a.vx += (d / p) * Math.max(0.6, f.v) * 0.7), (a.vz += (u / p) * Math.max(0.6, f.v) * 0.7), (a.yv += (Math.random() - 0.5) * 2));
        }
        ((a.vx += ((a.hx - a.x) * 0.02 + Math.sin(t * 0.21 + a.hx) * 0.05) * i), (a.vz += ((a.hz - a.z) * 0.02 + Math.cos(t * 0.17 + a.hz) * 0.04) * i));
        let c = Math.pow(0.97, i * 60);
        ((a.vx *= c), (a.vz *= c), (a.yv *= c), (a.x += a.vx * i), (a.z = Math.max(Rt + 1.2, a.z + a.vz * i)), (a.yaw += (a.yv + 0.08) * i));
        let l = ccsWaveY(a.x, a.z, t),
          h = 0.35;
        ((a.g.position.x = a.x), (a.g.position.z = a.z), (a.g.position.y += (l - a.g.position.y) * Math.min(1, i * 8)));
        let f = (ccsWaveY(a.x + h, a.z, t) - ccsWaveY(a.x - h, a.z, t)) / (2 * h),
          d = (ccsWaveY(a.x, a.z + h, t) - ccsWaveY(a.x, a.z - h, t)) / (2 * h);
        a.g.rotation.set(Math.atan(d) * 1.4, a.yaw, -Math.atan(f) * 1.4, "YXZ");
        continue;
      }
      let c = Math.min(i, 0.05),
        l = a.m,
        h = Math.max(0.3, a.r * 0.7);
      // น้องว่ายชน/เดินชน → ดันออก + หมุน + กระดก
      for (let f of o) {
        let d = a.x - f.p.x,
          u = a.z - f.p.z,
          p = Math.hypot(d, u),
          m = a.r + f.r;
        if (p < m && p > 1e-3) {
          let E = (m - p) / m,
            g = Math.max(0.8, f.v) * (1.4 / l);
          ((a.x = f.p.x + (d / p) * m), (a.z = f.p.z + (u / p) * m), (a.vx += (d / p) * g * 0.6), (a.vz += (u / p) * g * 0.6), (a.yv += ((d * f.v - u) / p) * 0.8 / l), (a.pvx += (u / p) * E * 6 / l), (a.pvz -= (d / p) * E * 6 / l), (a.vy -= E * 1.2 / l));
          f.v > 1.2 && Math.random() < c * 8 && ccsSplashAt(a.x, a.y, a.z, 3);
        }
      }
      // ชนกันเองระหว่างของลอยน้ำ
      for (let f of ccsFloats) {
        if (f === a || !f.nw) continue;
        let d = a.x - f.x,
          u = a.z - f.z,
          p = Math.hypot(d, u),
          m = a.r + f.r;
        if (p < m && p > 1e-3) {
          let E = (m - p) * 0.5,
            g = ((a.vx - f.vx) * d + (a.vz - f.vz) * u) / p;
          ((a.x += (d / p) * E), (a.z += (u / p) * E), g < 0 && ((a.vx -= (d / p) * g * 0.6 * (f.m / (a.m + f.m)) * 2), (a.vz -= (u / p) * g * 0.6 * (f.m / (a.m + f.m)) * 2), (a.yv += g * 0.3)));
        }
      }
      // ผิวน้ำ + พื้น (ทะเลลาดลึก / ชายหาด) → ลอยน้ำ หรือ เกยหาด
      let f = ccsWaveY(a.x, a.z, t),
        d = (ccsWaveY(a.x + h, a.z, t) - ccsWaveY(a.x - h, a.z, t)) / (2 * h),
        u = (ccsWaveY(a.x, a.z + h, t) - ccsWaveY(a.x, a.z - h, t)) / (2 * h),
        gH = a.z > Rt - 1.35 ? Lc(a.z) : b4(a.x, a.z),
        rest = gH + a.dr,
        wet = f > rest - 0.01,
        sw = Math.max(0, 1 - Math.abs(a.z - (Rt - 0.6)) / 2.2); // เขตคลื่นซัดฝั่ง
      if (wet) {
        // ลอยน้ำ: แรงลอยตัวแบบสปริง-หน่วง (ของเบาเด้งไวกว่า) + คลื่นไหลตามความชัน + ลมเบา ๆ + ดึงกลับแถวเดิมช้า ๆ
        ((a.vy += ((f - a.y) * (34 / l) - a.vy * (3.2 + 1.5 / l)) * c), (a.y += a.vy * c), a.y < rest && ((a.y = rest), (a.vy = Math.max(0, a.vy))));
        let p = a.z > Rt + 1.5 ? 1 : 0;
        ((a.vx += (-d * 9.8 * 0.35 + Math.sin(t * 0.07 + a.hz) * 0.06 + (a.hx - a.x) * 0.012 * p) * c),
          (a.vz += (-u * 9.8 * 0.35 - 0.024 + (a.hz - a.z) * 0.012 * p + Math.sin(t * 0.9 + a.hx) * 0.35 * sw) * c));
        let m = Math.pow(0.55, c);
        ((a.vx *= m), (a.vz *= m));
      } else {
        // เกยหาด: ตกลงพื้น มีแรงเสียดทานทราย, หาดลาดลงทะเล → ไหลกลับลงน้ำเอง, คลื่นซัดดึงกลับ
        ((a.vy -= 9.8 * c), (a.y += a.vy * c), a.y < rest && ((a.y = rest), (a.vy = 0)));
        let p = a.z > Rt - 4.5 ? 0.55 : 0;
        ((a.vz += (p + Math.max(0, Math.sin(t * 0.9 + a.hx)) * 0.9 * sw) * c), (a.vx *= Math.pow(0.12, c)), (a.vz *= Math.pow(0.12, c)));
      }
      ((a.yv *= Math.pow(wet ? 0.6 : 0.1, c)), (a.yv += (d - u) * 0.15 * c * (wet ? 1 : 0)), (a.x += a.vx * c), (a.z += a.vz * c), (a.yaw += a.yv * c));
      a.z < Rt - 9 && ((a.z = Rt - 9), (a.vz = Math.abs(a.vz) * 0.3));
      // เอียงตามผิวน้ำ (บนหาดวางราบ) แบบสปริง มีแกว่งค้าง
      let E = wet ? Math.atan(u) * 1.1 : 0,
        g = wet ? -Math.atan(d) * 1.1 : 0;
      ((a.pvx += ((E - a.px) * 22 - a.pvx * 3.5) * c), (a.pvz += ((g - a.pz) * 22 - a.pvz * 3.5) * c), (a.px += a.pvx * c), (a.pz += a.pvz * c));
      (a.g.position.set(a.x, a.y, a.z), a.g.rotation.set(a.px, a.yaw, a.pz, "YXZ"));
    }
    // ---- น้ำกระเซ็นเมื่อน้องเดินลุยน้ำ ----
    let r = ccsSplash,
      a = n.z > Rt - 1.0 && go(n.x, n.z) > 0.04;
    if (a) {
      let c = ccsWaveY(n.x, n.z, t);
      (r.wasIn || (ccsSplashAt(n.x, c, n.z, 14), ccsRingAt(n.x, c, n.z)), (r.acc += i * Math.min(1, s / 3)), (r.ringAcc += i));
      for (; r.acc > 0.06; ) ((r.acc -= 0.06), ccsSplashAt(n.x, c, n.z, 2));
      r.ringAcc > (s > 0.6 ? 0.35 : 1.4) && ((r.ringAcc = 0), ccsRingAt(n.x, c, n.z));
    }
    r.wasIn = a;
    for (let c of r.drops)
      c.life > 0 &&
        ((c.life -= i), (c.vy -= 9.8 * i), c.m.position.set(c.m.position.x + c.vx * i, c.m.position.y + c.vy * i, c.m.position.z + c.vz * i), (c.life <= 0 || c.m.position.y < Ph - 0.2) && ((c.life = 0), (c.m.visible = !1)));
    for (let c of r.rings)
      c.life > 0 && ((c.life -= i), c.m.scale.setScalar(0.3 + (1.2 - c.life) * 1.6), (c.m.material.opacity = Math.max(0, c.life / 1.2) * 0.55), c.life <= 0 && (c.m.visible = !1));
  }
  var QH = new H();
  function T4(i, e) {
    (lk(i, e), mT(i, e));
    let t = wi.length + Nn.length ? [...wi, ...Nn] : wi;
    for (let n of t) {
      if (n.shop && n.shop.stage !== "go") continue;
      if (n.fadeOut !== void 0) {
        Qi(n.rig, i, 0, null);
        continue;
      }
      if (((n.t += i), n.yieldT && (n.yieldT = Math.max(0, n.yieldT - i)), (n.sitT ?? 0) > 0 && n.seat !== void 0)) {
        let l = ua[n.seat];
        ((n.sitT -= i),
          n.pos.copy(l.p),
          n.rig.root.position.copy(l.p),
          Qi(n.rig, i, 0, l.yaw),
          n.sitT <= 0 &&
            (Qg(n.rig, !1),
            (l.who = null),
            (n.seat = void 0),
            n.pos.copy(l.front),
            (n.wait = 0.3),
            (n.path = g0(n.pos)),
            n.target.copy(n.path.shift() ?? n.pos)));
        continue;
      }
      let s = n.vel ?? (n.vel = new H()),
        o = DA.set(0, 0, 0),
        r = !1;
      if (n.wait > 0) n.wait -= i;
      else {
        Xt.copy(n.target).sub(n.pos).setY(0);
        let l = Xt.length();
        if (l < 0.4) {
          let h = n.path.shift();
          if (h) {
            let f =
              Math.abs(n.pos.z) > vn - 0.1 &&
              Math.abs(n.pos.z) < Mt + 0.2 &&
              Math.abs(h.z) < Mt + 0.2 &&
              Math.sign(h.z) !== Math.sign(n.pos.z);
            (n.target.copy(h), f && (n.wait = 0.6));
          } else if (n.seat !== void 0 && n.pos.distanceTo(ua[n.seat].front) < 1.2) {
            let f = ua[n.seat];
            (Qg(n.rig, !0, f.yaw, 0.32), (n.sitT = 12 + Math.random() * 30), s.set(0, 0, 0), n.pos.copy(f.p));
          } else {
            n.seat !== void 0 && ((ua[n.seat].who = null), (n.seat = void 0));
            let f =
              !n.leave && Math.random() < 0.3
                ? ua.map((d, u) => [d, u]).filter(([d]) => !d.who && d.p.distanceTo(n.pos) < 30)
                : [];
            if (f.length) {
              let [d, u] = f[Math.floor(Math.random() * f.length)];
              ((d.who = n), (n.seat = u));
              let p = qt.ready ? dl(n.pos, d.front) : null;
              ((n.path = p && p.length ? p : [d.front.clone()]),
                n.target.copy(n.path.shift() ?? d.front),
                (n.wait = 0.2));
            } else ((n.wait = 1.5 + Math.random() * 4), (n.path = g0(n.pos)), n.target.copy(n.path.shift() ?? n.pos));
          }
        } else {
          Xt.divideScalar(l);
          let h = n.pos.clone().addScaledVector(Xt, 0.9);
          ((r =
            Mr(n.pos) ||
            Mr(h) ||
            (Math.abs(n.pos.z) < Mt + 0.2 &&
              Math.abs(n.target.z) < Mt + 0.2 &&
              Math.sign(n.target.z) !== Math.sign(n.pos.z))),
            !Mr(n.pos) && Mr(h) && !VC()
              ? ((n.wait = 0.4), Math.abs(n.pos.z) < vn + 0.35 && (n.pos.z = Math.sign(n.pos.z || 1) * (vn + 0.35)))
              : o.copy(Xt).multiplyScalar(n.speed * Math.min(1, 0.35 + l / 1.2)));
        }
      }
      if (o.lengthSq() > 0) {
        Ni.set(0, 0, 0);
        for (let f of pt) {
          let d = n.pos.x - f.x,
            u = n.pos.z - f.z;
          if (Math.abs(d) > f.hw + 1.3 || Math.abs(u) > f.hd + 1.3) continue;
          let p = d - Math.max(-f.hw, Math.min(f.hw, d)),
            m = u - Math.max(-f.hd, Math.min(f.hd, u)),
            E = Math.hypot(p, m);
          if (E > 0.7 || E < 1e-4) continue;
          let g = ((0.7 - E) / 0.7) * 0.6;
          ((Ni.x += (p / E) * g), (Ni.z += (m / E) * g));
        }
        for (let f of lo) {
          let d = n.pos.x - f.x,
            u = n.pos.z - f.z,
            p = Math.hypot(d, u) - 0.9;
          if (p > 0.6 || p < -0.9) continue;
          let m = (0.6 - Math.max(0, p)) * 0.6,
            E = Math.hypot(d, u) || 1;
          ((Ni.x += (d / E) * m), (Ni.z += (u / E) * m));
        }
        for (let f of t) {
          if (f === n) continue;
          let d = n.pos.x - f.pos.x,
            u = n.pos.z - f.pos.z,
            p = Math.hypot(d, u);
          if (p > 0.95 || p < 1e-4) continue;
          let m = ((0.95 - p) / 0.95) * 1.4;
          ((Ni.x += (d / p) * m), (Ni.z += (u / p) * m));
        }
        {
          let f = n.pos.x - e.pos.x,
            d = n.pos.z - e.pos.z,
            u = Math.hypot(f, d);
          if (u < 1.2 && u > 1e-4) {
            let p = ((1.2 - u) / 1.2) * 1.6;
            ((Ni.x += (f / u) * p), (Ni.z += (d / u) * p));
          }
        }
        let l = Ni.x * -Xt.z + Ni.z * Xt.x,
          h = Ni.x * Xt.x + Ni.z * Xt.z;
        (h < 0 && ((Ni.x += -Xt.z * Math.sign(l || 1) * -h * 0.9), (Ni.z += Xt.x * Math.sign(l || 1) * -h * 0.9)),
          o.addScaledVector(Ni, n.speed * 0.9),
          o.length() > n.speed && o.setLength(n.speed));
      }
      if ((s.lerp(o, Math.min(1, i * 4.5)), s.lengthSq() > 1e-5)) {
        let l = n.pos.clone().addScaledVector(s, i),
          h = (n.yieldT ?? 0) > 0,
          f = (d) =>
            (h || vr(d, 0.35) <= 0 || vr(d, 0.35) < vr(n.pos, 0.35) - 1e-4) &&
            (h || r || !Mr(d) || Mr(n.pos)) &&
            (!ri(d, 0.3, !1, !0) || hl(d, 0.3) < hl(n.pos, 0.3) - 1e-4);
        if (f(l)) (n.pos.copy(l), (n.stuck = 0));
        else {
          let d = n.pos.clone();
          d.x = l.x;
          let u = n.pos.clone();
          ((u.z = l.z),
            f(d)
              ? (n.pos.copy(d), (s.z *= 0.5))
              : f(u)
                ? (n.pos.copy(u), (s.x *= 0.5))
                : (s.multiplyScalar(0.3), (n.stuck = (n.stuck ?? 0) + i)));
        }
        if ((n.stuck ?? 0) > 0.8) {
          n.stuck = 0;
          let d = n.path.length ? n.path[n.path.length - 1] : n.target,
            u = qt.ready ? dl(n.pos, d) : null;
          ((n.path = u && u.length ? u : g0(n.pos)), n.target.copy(n.path.shift() ?? n.pos));
        }
      }
      let a = s.length();
      {
        let l = n.watch ?? (n.watch = { p: n.pos.clone(), t: 0, n: 0 });
        if (((l.t += i), l.t > 6)) {
          let h = l.p.distanceTo(n.pos);
          if ((l.p.copy(n.pos), (l.t = 0), h < 0.6 && !((n.sitT ?? 0) > 0) && !r))
            if ((l.n++, (n.wait = 0), l.n >= 2 && Nn.includes(n))) ((n.life = -100), (n.wait = 0), (l.n = 0));
            else {
              let f = g0(n.pos);
              ((n.path = f), n.target.copy(n.path.shift() ?? n.pos));
            }
          else l.n = 0;
        }
      }
      n.rig.root.position.copy(n.pos);
      {
        let l = 1;
        (n.fadeIn !== void 0 && n.fadeIn < 1 && ((n.fadeIn = Math.min(1, n.fadeIn + i / 0.9)), (l = n.fadeIn)),
          n.leave && (l = Math.min(l, Math.max(0, Math.min(1, (n.pos.distanceTo(n.leave) - 0.9) / 2)))),
          n.fadeOut !== void 0 && (l = Math.min(l, Math.max(0, n.fadeOut / 0.8))),
          ga(n.rig.root, l));
      }
      let c = n.pos.distanceTo(e.pos) < 4;
      (Qi(
        n.rig,
        i,
        a > 0.25 ? a : 0,
        a > 0.25 ? Math.atan2(s.x, s.z) : c ? Math.atan2(e.pos.x - n.pos.x, e.pos.z - n.pos.z) : null,
      ),
        n.talkT > 0 && (n.talkT -= i),
        j.started &&
          n.talkT <= 0 &&
          n.pos.distanceTo(e.pos) < 2.2 &&
          ((n.talkT = 12), Ln(n.pos, t1[Math.floor(Math.random() * t1.length)])));
    }
  }
  function w4(i, e) {
    let t = [
      e.pos,
      ...ml.map((n) => n.pos),
      ...wi.map((n) => n.pos),
      ...Nn.map((n) => n.pos),
      ...El.map((n) => n.pos),
      ...Pr.map((n) => n.pos),
      ...Le.slice(1)
        .filter((n) => n.found)
        .map((n) => n.pos),
    ].filter((n) => Math.abs(n.z) < vn - 0.05);
    for (let n of cl) {
      if (n.wait > 0 && ((n.wait -= i), (n.o.visible = n.wait <= 0), n.wait > 0)) continue;
      let s = Math.sin(n.yaw),
        o = Math.cos(n.yaw),
        r = !1,
        a = !1,
        c = n.hw + 0.4;
      for (let h of t) {
        let f = h.x - n.pos.x,
          d = h.z - n.pos.z,
          u = f * s + d * o,
          p = Math.abs(-f * o + d * s);
        if (u > 1 && u < 6.5 && p < c) {
          r = !0;
          break;
        }
      }
      if (r)
        a = [...wi, ...Nn].some(
          (h) =>
            Math.abs(h.pos.z) < vn - 0.05 &&
            Math.abs(-(h.pos.x - n.pos.x) * o + (h.pos.z - n.pos.z) * s) < c &&
            (h.pos.x - n.pos.x) * s + (h.pos.z - n.pos.z) * o > 0.5 &&
            (h.pos.x - n.pos.x) * s + (h.pos.z - n.pos.z) * o < 7,
        );
      else
        for (let h of [...wi, ...Nn]) {
          if (Math.abs(h.pos.z) >= vn - 0.05) continue;
          let f = h.pos.x - n.pos.x,
            d = h.pos.z - n.pos.z,
            u = f * s + d * o,
            p = Math.abs(-f * o + d * s);
          if (u > 0.5 && u < 7 && p < c) {
            ((r = !0), (a = !0));
            break;
          }
        }
      if (((n.pedT = a && n.v < 0.5 ? (n.pedT ?? 0) + i : 0), n.pedT > 1.2))
        for (let h of [...wi, ...Nn]) {
          if (Math.abs(h.pos.z) >= vn + 0.2) continue;
          let f = h.pos.x - n.pos.x,
            d = h.pos.z - n.pos.z,
            u = f * s + d * o,
            p = Math.abs(-f * o + d * s);
          if (u < -1 || u > 8 || p > c + 0.6) continue;
          let m = Math.sign(h.pos.z || 1),
            E = new H(h.pos.x + (Math.random() - 0.5), 0, m * (vn + 1.2));
          ((!h.yieldT || h.yieldT <= 0) &&
            ((h.yieldT = 3), (h.wait = 0), (h.path = [E]), h.target.copy(E), (h.leave = null)),
            n.pedT > 4 && (h.pos.z += m * Math.min(Math.abs(E.z - h.pos.z), i * 2.2)));
        }
      for (let h of cl)
        if (h !== n) {
          let f = h.pos.x - n.pos.x,
            d = h.pos.z - n.pos.z,
            u = f * s + d * o,
            p = Math.abs(-f * o + d * s);
          if (u > 0 && u < 7 && p < 1.5) {
            r = !0;
            break;
          }
        }
      let l = r ? 0 : QE;
      {
        let h = db().car;
        if (h !== "green") {
          let d = (b0 - n.dir * (el / 2 + 1.5 + n.hl) - n.pos.x) * n.dir;
          d > -0.2 && d < 22 && !(h === "yellow" && d < 3) && (l = Math.min(l, Math.max(0, d * 0.55)));
        }
      }
      if (
        ((n.v += (l - n.v) * Math.min(1, i * (r ? 4 : l < n.v ? 2.6 : 1.2))),
        r &&
          n.v < 0.3 &&
          (n.honkT -= i) < 0 &&
          n.pos.distanceTo(e.pos) < 8 &&
          ((n.honkT = 6),
          ke("nope"),
          Ln(
            n.pos.clone().setY(2.2),
            "ปี๊น ๆ 🚗 ขอทางหน่อยจ้า",
          )),
        (n.pos.x += n.dir * n.v * i),
        Math.abs(n.pos.x) > r1 + 1 && R4(n),
        n.o.position.copy(n.pos),
        (n.o.rotation.y = n.yaw),
        ga(n.o, Math.max(0, Math.min(1, (r1 + 1 - Math.abs(n.pos.x)) / 14))),
        n.wheels)
      )
        for (let h of n.wheels) h.rotation.x += (n.v * i) / (n.wr ?? 0.35);
    }
  }
  var a6 = [],
    gr = -1;
  function eA() {
    return Array.from(js.querySelectorAll("button:not([disabled])")).filter((i) => i.offsetParent !== null);
  }
  function tA() {
    let i = navigator.getGamepads ? navigator.getGamepads() : [],
      e = Array.from(i ?? []).find((r) => r && r.connected);
    if ((document.body.classList.toggle("pad", !!e), !e)) return ((xE = !1), null);
    let t = (r) => (Math.abs(r) < 0.18 ? 0 : r),
      n = (r) => !!e.buttons[r]?.pressed,
      s = (r) => {
        let a = n(r),
          c = a6[r];
        return ((a6[r] = a), a && !c);
      };
    if (ho?.tr) {
      // v117: สนามฝึก: Ⓐ = กด, ◀ ▶ / สติ๊กซ้าย = เลี้ยว/ทรงตัว
      let r = t(e.axes[0] ?? 0);
      ((a) => (s(0), a !== !!ho.tr.aHeld && ccsTRInput("A", !a)))(n(0)), ((s(14) || (r < -0.6 && !ho.tr.ax)) && ccsTRInput("L"), (s(15) || (r > 0.6 && !ho.tr.ax)) && ccsTRInput("R"), (ho.tr.ax = Math.abs(r) > 0.6));
    } else if (C0() && ccsPK) {
      // v115: ดวลจุดโทษ: D-pad ◀ ▼ ▶ = เรียด/พุ่งต่ำ, ▲/Ⓨ = โด่งกลาง, LB/RB = โด่งซ้าย/ขวา, Ⓐ ยิง, Ⓑ ยกเลิก
      // v116: เลือกทิศด้วย D-pad/สติ๊กซ้ายแบบ 8 ทิศ (กดเฉียงขึ้นได้ = โด่งซ้าย/ขวา) · ตอนเล็งใช้ Ⓐ ยืนยัน · ตอนรับเลือกทันที
      let r = (n(15) ? 1 : 0) - (n(14) ? 1 : 0) || (t(e.axes[0] ?? 0) > 0.5 ? 1 : t(e.axes[0] ?? 0) < -0.5 ? -1 : 0),
        a = n(12) || t(e.axes[1] ?? 0) < -0.5 ? -1 : n(13) || t(e.axes[1] ?? 0) > 0.5 ? 1 : 0,
        c = a < 0 ? ["HL", "HC", "HR"][r + 1] : r ? ["L", "", "R"][r + 1] : a > 0 ? "C" : null;
      (s(3) && (c = "HC"), s(4) && (c = "HL"), s(5) && (c = "HR"), s(2) && (c = "C"));
      if (c && c !== ccsPK.padSel) {
        ccsPK.padSel = c;
        ccsPK.ph === "dive" ? ccsPKInput(c) : ccsPK.ph === "aim" && document.querySelectorAll("[data-pk]").forEach((l) => l.classList.toggle("on", l.dataset.pk === c));
      }
      (c || (ccsPK.padSel = null),
        s(0) && (ccsPK.ph === "power" ? ccsPKInput("K") : ccsPK.ph === "aim" ? ccsPKInput(document.querySelector("[data-pk].on")?.dataset.pk ?? "C") : 0),
        (s(1) || s(9)) && qs());
    } else if (C0()) {
      let r = eA(),
        a = (c) => {
          r.length &&
            ((gr = (gr + c + r.length) % r.length),
            r.forEach((l, h) => l.classList.toggle("padfocus", h === gr)),
            r[gr].scrollIntoView({ block: "nearest" }));
        };
      ((s(13) || (t(e.axes[1] ?? 0) > 0.6 && s(99))) && a(1),
        s(12) && a(-1),
        s(15) && a(1),
        s(14) && a(-1),
        s(0) && (gr >= 0 && r[gr] ? r[gr].click() : r.length && a(1)),
        (s(1) || s(9)) && (qs(), (gr = -1)),
        s(2),
        s(3),
        s(6),
        s(11));
    } else
      ((gr = -1),
        s(0) && (j.started ? Ad?.() : it("start").click()),
        s(2) && (Ed = !0),
        s(1) && (Oo && !Oo.dropped ? ccsClawCancel() : qs()),
        s(3) && _0(),
        s(8) && it("poopBtn").click(),
        (s(6) || s(11)) && xa(),
        s(9) && j.started && Rr(),
        j.started && (s(14) && ccsBagCycle(-1), s(15) && ccsBagCycle(1), s(13) && ccsBagCycle(0))); // v86: D-pad ◀▶ เลือกของในกระเป๋า, ▼ ยกเลิก
    return (
      s(4) && it("zout").click(),
      s(5) && it("zin").click(),
      (xE = (e.buttons[7]?.value ?? 0) > 0.35),
      s(10) && O4(!A1),
      { lx: t(e.axes[0] ?? 0), ly: t(e.axes[1] ?? 0), rx: t(e.axes[2] ?? 0), ry: t(e.axes[3] ?? 0) }
    );
  }
  function qs() {
    (js.classList.remove("on"), js.classList.remove("dress"), (uo = !1));
  }
  var gl = [];
  // v108: หมุนเวียนตุ๊กตาในตู้คีบ วันละ 2 แบบ ไม่ซ้ำจนกว่าจะครบทุกแบบ (พลาดวันไหนต้องรอรอบหน้า)
  function ccsShuf(i, e) {
    let t = (e * 2654435761 + 977) >>> 0,
      n = () => ((t = (t + 1831565813) >>> 0), (((t ^ (t >>> 15)) * (t | 1)) >>> 0) / 4294967296),
      s = i.slice();
    for (let o = s.length - 1; o > 0; o--) {
      let r = Math.floor(n() * (o + 1));
      [s[o], s[r]] = [s[r], s[o]];
    }
    return s;
  }
  function ccsClawDayIdx() {
    return ((z.year ?? 1) * 3 + (z.season ?? 0)) * PM + (z.day ?? 1) - 1;
  }
  function ccsClawPair(i = ccsClawDayIdx()) {
    let e = ccsAlbAll(),
      t = e.length;
    if (t < 2) return e;
    let n = (r) => ccsShuf(e, Math.floor(r / t))[r % t],
      s = n(2 * i),
      o = n(2 * i + 1);
    return (o === s && (o = n(2 * i + 2)), [s, o]);
  }
  function ccsClawDaily() {
    let i = ccsClawDayIdx();
    for (let e of gl) e.day === i || e.c.busy?.() || ((e.day = i), e.c.restock?.(ccsClawPair(i)));
  }
  var Oo = null;
  // v97: ยกเลิกการคีบ (ยังไม่กดปล่อย) → คืนเงิน
  function ccsClawCancel() {
    let i = Oo;
    !i || i.dropped || ((Oo = null), (z.money += 20), Ei(), ke("pop"), De("✖ ยกเลิกการคีบแล้ว คืนเงิน 20💰", 1800), ccsClawUI());
  }
  var ccsClawBtn = null;
  function ccsClawUI() {
    ccsClawBtn ||
      ((ccsClawBtn = document.createElement("button")),
      (ccsClawBtn.id = "clawCancel"),
      (ccsClawBtn.textContent = "✖ ยกเลิก"),
      ccsClawBtn.addEventListener("click", (i) => (i.stopPropagation(), ccsClawCancel())),
      document.body.appendChild(ccsClawBtn));
    ccsClawBtn.classList.toggle("on", !!(Oo && !Oo.dropped));
  }
  function fE() {
    let i = Oo;
    !i ||
      i.dropped ||
      ((i.dropped = !0),
      ke("pop"),
      i.k.c.drop((e) => {
        (e
          ? ((z.plush ?? (z.plush = [])).push(e),
            _t(z),
            H1(),
            rt("🧸 ได้แล้ว!", i.k.front.clone().setY(2)),
            ke("heart"),
            De(
              `🎉 คีบได้ตุ๊กตา${Rp[e] ?? ""}! ${ccsPlushNote(e)}`,
              3e3,
            ))
          : (rt("หลุด! 😿", i.k.front.clone().setY(2), "bad"),
            De(
              "เกือบได้! เล็งให้ตรงกลางตุ๊กตาอีกนิดนะ",
              2200,
            )),
          setTimeout(() => {
            Oo === i && (Oo = null);
          }, 900));
      }));
  }
  // v105: ตู้โชว์หลายใบ + สมุดสะสม
  var ccsCabZ = [-0.6, -3.55, 2.35],
    ccsCabPrice = [0, 500, 800],
    ccsCabSolid = [];
  function ccsCabMake(i, e, t, n, s) {
    let o = [s];
    for (let r = 1; r < 3; r++) {
      let a = Q7(`🧸 ตู้ตุ๊กตาของข้าวต้ม ใบที่ ${r + 1}`, !1);
      (a.group.position.set(e / 2 - 0.4, 0, ccsCabZ[r]), (a.group.rotation.y = -Math.PI / 2), (a.group.visible = !1), i.add(a.group), o.push(a));
      ccsCabSolid[r] = { x: t.x + e / 2 - 0.4, z: t.z + ccsCabZ[r], hw: 0.4, hd: 1.35 };
    }
    return ((ccsCabSolid.list = n), o);
  }
  function ccsCabN() {
    return Math.max(1, Math.min(3, z.cabinets ?? 1));
  }
  function ccsCabSync() {
    let i = Rn?.cabinets;
    if (!i) return;
    let e = ccsCabN();
    for (let t = 1; t < 3; t++) {
      i[t].group.visible = t < e;
      let n = ccsCabSolid.list,
        s = ccsCabSolid[t];
      n && s && t < e && !n.includes(s) && n.push(s);
    }
    let t = ccsAlbAll().every((n) => (z.plush ?? []).includes(n));
    for (let n of i) (n.trim.color.setHex(t ? 14264627 : 16774885), (n.trim.metalness = t ? 0.45 : 0), (n.trim.roughness = t ? 0.35 : 0.5)); // สะสมครบ → ขอบตู้สีทอง
  }
  function ccsPlushUniq() {
    let i = new Map();
    for (let e of z.plush ?? []) i.set(e, (i.get(e) ?? 0) + 1);
    return [...i];
  }
  function ccsAlbAll() {
    return [...sM, ...ccsPlush, "Barney_01"].filter(ze);
  }
  function ccsPlushNote(i) {
    let e = ccsPlushUniq(),
      t = e.findIndex(([s]) => s === i),
      n = (e[t]?.[1] ?? 0);
    return n > 1
      ? `มีแล้ว ×${n}`
      : t >= ccsCabN() * 15
        ? (ccsCabN() < 3 ? "ตู้เต็มแล้ว! ซื้อตู้ใบใหม่ได้ที่ร้านสัตว์เลี้ยง" : "ตู้ทุกใบเต็มแล้ว ดูได้ในสมุดสะสม")
        : `แบบใหม่! สะสมแล้ว ${e.length}/${ccsAlbAll().length} แบบ`;
  }
  var ccsAlbGoal = [
    [10, 200],
    [20, 500],
    [0, 1500],
  ];
  function ccsAlbum() {
    let i = ccsAlbAll(),
      e = new Map(ccsPlushUniq()),
      t = i.filter((a) => e.has(a)).length,
      n = z.albClaim ?? [],
      s = new Set(["Dog_01", "Cat_01", "Unicorn_01", "Panda_01", "Barney_01", ...ccsPlush]),
      o = ccsAlbGoal
        .map(([a, c], l) => {
          let h = a || i.length,
            f = n.includes(l),
            d = t >= h;
          return `<button class="agoal" data-goal="${l}" ${f || !d ? "disabled" : ""}>${f ? "✅" : d ? "🎁" : "🔒"} ${a ? `สะสม ${a} แบบ` : "สะสมครบทุกแบบ"} · ${c}💰${a ? "" : " + ขอบตู้สีทอง"}${f ? " (รับแล้ว)" : ""}</button>`;
        })
        .join(""),
      r = i
        .map((a) => {
          let c = e.get(a) ?? 0;
          return `<button class="ptile${c ? "" : " miss"}" data-pl="${a}">${ccsThumb("alb:" + a, () => je(a, 0.5)) || "🧸"}<b>${c ? Rp[a] ?? a : "???"}</b><small>${c ? (c > 1 ? `×${c}` : "มี 1 ตัว") : s.has(a) ? "ตู้คีบ · ร้าน" : "ตู้คีบ"}</small></button>`;
        })
        .join("");
    (Gi(
      "สมุดสะสมตุ๊กตา 📒",
      `<p class="note">สะสมแล้ว <b>${t}/${i.length}</b> แบบ · ตู้โชว์ ${ccsCabN()} ใบ (โชว์ได้ ${ccsCabN() * 15} แบบ)${ccsCabN() < 3 ? ` · ตู้ใบที่ ${ccsCabN() + 1} ซื้อได้ที่ร้านสัตว์เลี้ยง` : ""}</p><div class="abar"><i style="width:${Math.round((t / i.length) * 100)}%"></i></div><div class="agoals">${o}</div><div class="pgrid">${r}</div>`,
    ),
      document.querySelectorAll("[data-goal]").forEach((a) =>
        a.addEventListener("click", () => {
          let c = +a.dataset.goal,
            l = z.albClaim ?? (z.albClaim = []);
          l.includes(c) ||
            (l.push(c),
            (z.money += ccsAlbGoal[c][1]),
            Ei(),
            ke("heart"),
            De(`🎁 รางวัลสมุดสะสม +${ccsAlbGoal[c][1]}💰${c === 2 ? " · ขอบตู้โชว์เป็นสีทองแล้ว!" : ""}`, 2600),
            ccsCabSync(),
            _t(z),
            ccsAlbum());
        }),
      ),
      document.querySelectorAll("[data-pl]").forEach((a) =>
        a.addEventListener("click", () => {
          let c = a.dataset.pl,
            l = e.get(c) ?? 0;
          (ke("pop"),
            De(
              l
                ? `🧸 ตุ๊กตา${Rp[c] ?? c} มี ${l} ตัว`
                : s.has(c)
                  ? "ยังไม่มี · คีบได้จากตู้คีบ หรือซื้อที่ร้านสัตว์เลี้ยง"
                  : "ยังไม่มี · คีบได้จากตู้คีบข้างสนามบอล",
              1800,
            ));
        }),
      ));
  }
  function H1() {
    let i = ccsPlushUniq(),
      e = Rn?.cabinets;
    if (!e) return void _4?.fill(i);
    ccsCabSync();
    for (let t = 0; t < 3; t++) e[t].fill(t < ccsCabN() ? i.slice(t * 15, t * 15 + 15) : []);
  }
  var fI = new H(9999, 0, 9999),
    Rn = null,
    ed = null,
    nA = null,
    fn = new H(22.5, 0, 12.2),
    hn = new H(-2.2, 0, -19.6), // v83: ย้ายสวนมาหน้าถนน ระหว่างร้านตัดขนกับถูกจังมาร์ท
    ni = new H(-41.3, 0, 24.5),
    In = -Math.PI / 2,
    md = null,
    y0 = [],
    C3 = 3,
    uE = null,
    c6 = {
      grocery: [
        "อาหารเม็ดพรีเมียมเพิ่งมาส่งเลยจ้า!",
        "ลูกไก่น่ารักมาใหม่ เลี้ยงไว้เก็บไข่ได้นะ",
        "แซลมอนนึ่งหอม ๆ ขนในน้องเงาวับ",
        "น้ำสะอาดขวดละ 15 เอง",
        "เลือกได้ตามสบายเลยนะ",
      ],
      petshop: [
        "ลูกเชาเชาตัวใหม่มาแล้ว ขนฟูมาก!",
        "รับน้องกลับบ้านไปเป็นเพื่อนเดินเล่นกันนะ",
        "พุดเดิ้ลตัวนี้ขี้อ้อนสุด ๆ",
        "ชิวาวาตัวเล็กแต่กล้าหาญ",
        "ตุ๊กตากับของเล่นก็มีนะจ๊ะ",
        "ทุกตัวฉีดวัคซีนครบแล้วจ้า",
      ],
      clinic: [
        "ตรวจสุขภาพประจำปีกันหน่อยไหม",
        "วิตามินช่วยให้มีแรงวิ่งเล่นทั้งวัน",
        "น้องดูแข็งแรงดีนะเนี่ย",
        "ฉีดวัคซีนครบหรือยังจ๊ะ",
      ],
      groom: [
        "อาบน้ำหอม ๆ ขนฟูนุ่มเลย!",
        "หมวกใหม่มาเพียบ เปิดแคตตาล็อกดูได้นะ",
        "แว่นกันแดดใส่แล้วเท่สุด ๆ",
        "แปรงขนทุกวันขนไม่พันกันนะ",
        "อ่างน้ำอุ่นพร้อมแล้วจ้า",
      ],
    },
    _d = [],
    cl = [],
    v4 = [];
  function iA(i, e) {
    let t = { value: 0 },
      n = [
        ["grassclump_0", 0.35],
        ["grassclump_3", 0.35],
        ["grassclump_2", 0.2],
        ["grassclump_1", 0.1],
      ];
    for (let [s, o] of n) {
      if (!ze(s)) continue;
      let r = null,
        a = null;
      if (
        (je(s).traverse((x) => {
          let b = x;
          b.isMesh && !r && ((r = b.geometry), (a = b.material));
        }),
        !r || !a)
      )
        continue;
      let c = r;
      c.computeBoundingBox();
      let l = Math.max(0.2, c.boundingBox.max.y),
        h = a.clone();
      ((h.alphaTest = 0.45),
        (h.side = Ke),
        (h.roughness = 0.9),
        (h.onBeforeCompile = (x) => {
          ((x.uniforms.time = t),
            (x.vertexShader =
              `uniform float time;
` +
              x.vertexShader.replace(
                "#include <begin_vertex>",
                `#include <begin_vertex>
      vec4 ip = instanceMatrix * vec4(0.0,0.0,0.0,1.0); float hk = clamp(position.y / ${l.toFixed(3)}, 0.0, 1.0);
      float sway = sin(time*1.8 + ip.x*0.35 + ip.z*0.25) + 0.4*sin(time*3.1 + ip.x*1.3);
      transformed.x += sway * 0.09 * hk * hk; transformed.z += sway * 0.04 * hk * hk;`,
              )));
        }),
        (h.customProgramCacheKey = () => "clump" + s));
      let f = Math.round(i * o),
        d = 32,
        u = new Map(),
        p = new Oe(),
        m = new At(),
        E = new H(),
        g = new H(0, 1, 0),
        y = 0;
      for (let x = 0; x < f * 3 && y < f; x++) {
        let b = e();
        if (!b) continue;
        m.setFromAxisAngle(g, Math.random() * Math.PI * 2);
        let w = 0.75 + Math.random() * 0.6;
        E.set(w, w * (0.85 + Math.random() * 0.35), w);
        let v = `${Math.floor(b.x / d)},${Math.floor(b.z / d)}`,
          _ = u.get(v) ?? (u.set(v, { m: [], c: [] }), u.get(v));
        _.m.push(p.compose(b, m, E).clone());
        let S = 1.05 + Math.random() * 0.3;
        (_.c.push(new ae().setRGB(S * 0.95, S * 1.08, S * 0.85)), y++);
      }
      for (let x of u.values()) {
        let b = new di(c, h, x.m.length);
        (x.m.forEach((w, v) => {
          (b.setMatrixAt(v, w), b.setColorAt(v, x.c[v]));
        }),
          (b.receiveShadow = !0),
          (b.renderOrder = 3),
          b.computeBoundingSphere(),
          (b.frustumCulled = !0),
          (b.userData.grassTile = !0),
          K.add(b),
          v4.push(b));
      }
    }
    return t;
  }
  function ga(i, e) {
    let t = i.userData;
    (t.alpha !== void 0 && Math.abs(t.alpha - e) < 0.01) ||
      ((t.alpha = e),
      i.traverse((n) => {
        let s = n;
        if (!s.isMesh) return;
        let o = s.userData.fadeOrig;
        if (!o) {
          if (e >= 0.999) return;
          ((o = s.material),
            (s.userData.fadeOrig = o),
            (s.material = Array.isArray(o) ? o.map((c) => c.clone()) : o.clone()));
        }
        let r = Array.isArray(s.material) ? s.material : [s.material],
          a = Array.isArray(o) ? o : [o];
        (r.forEach((c, l) => {
          let h = a[l] ?? a[0];
          ((c.transparent = e < 0.999 || h.transparent),
            (c.opacity = h.opacity * e),
            (c.depthWrite = e > 0.98 ? h.depthWrite : !1));
        }),
          e >= 0.999 && ((s.material = o), (s.userData.fadeOrig = void 0)));
      }));
  }
  var QE = 4.2,
    sA = [1.55, 4.65],
    r1 = 168;
  function R4(i, e = !1) {
    i.dir = Math.random() < 0.5 ? 1 : -1;
    let t = sA[Math.random() < 0.5 ? 0 : 1];
    (i.pos.set(e ? (Math.random() - 0.5) * 2 * r1 : -i.dir * r1, 0, i.dir > 0 ? t : -t),
      (i.yaw = i.dir > 0 ? Math.PI / 2 : -Math.PI / 2),
      (i.v = QE),
      (i.wait = e ? 0 : 2 + Math.random() * 10),
      (i.o.visible = i.wait <= 0));
  }
  var _4 = null,
    Cr = null,
    S4 = { coconut_palm: 1, lptree_1: 1, lptree_2: 1 };
  function Zp(i, e) {
    let t = je(i, e * (S4[i] ?? 1));
    // v82: ใบไม้ร่วงใต้ต้นไม้จริง (Autumn Leaves)
    if (/^tree_r/.test(i) && ze("leaf_set")) {
      let n = t.scale.x || 1;
      for (let s = 0; s < 3; s++) {
        let o = je("leaf_set", 1.1 + s * 0.35),
          r = s * 2.1 + e;
        (o.scale.multiplyScalar(1 / n), o.position.set((Math.cos(r) * (0.7 + s * 0.55)) / n, 0.03 / n, (Math.sin(r) * (0.7 + s * 0.55)) / n), (o.rotation.y = r * 1.7), (o.userData.noOcc = !0), t.add(o));
      }
    }
    return ((t.userData.tree = !0), /fabulous_tree/.test(i) && H4(t), t);
  }
  function Si(i, e, t, n = 0, s, o) {
    if (!ze(i)) return null;
    let r = (S4[i] || /tree|fir_/.test(i)) && s ? Zp(i, s) : je(i, s);
    return (
      r.position.set(e, 0, t),
      (r.rotation.y = n),
      K.add(r),
      r.userData.tree || (r.userData.prop = i),
      o && pt.push({ x: e, z: t, hw: o[0], hd: o[1] }),
      /fabulous_tree/.test(i) && !r.userData.tree && H4(r),
      r
    );
  }
  var k3 = new Map();
  function H4(i) {
    i.traverse((e) => {
      let t = e;
      if (!t.isMesh) return;
      let n = (s) => {
        if (k3.has(s)) return k3.get(s);
        let o = s.clone();
        return (
          (o.onBeforeCompile = (r) => {
            ((r.uniforms.uY0 = { value: 1.2 }),
              (r.uniforms.uY1 = { value: 7.5 }),
              (r.vertexShader =
                `varying float vWY;
` +
                r.vertexShader.replace(
                  "#include <begin_vertex>",
                  `#include <begin_vertex>
#ifdef USE_INSTANCING
 vWY = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).y;
#else
 vWY = (modelMatrix * vec4(transformed, 1.0)).y;
#endif`,
                )),
              (r.fragmentShader =
                `uniform float uY0, uY1; varying float vWY;
` +
                r.fragmentShader.replace(
                  "#include <map_fragment>",
                  `#include <map_fragment>
          { vec3 c = diffuseColor.rgb; float purple = smoothstep(0.03, 0.12, min(c.b - c.g, c.r - c.g * 0.9));
            if (purple > 0.0) { float h = clamp((vWY - uY0) / max(0.01, uY1 - uY0), 0.0, 1.0); float l = dot(c, vec3(0.3, 0.59, 0.11)) * 1.6 + 0.35;
              vec3 a1 = mix(vec3(0.62, 0.1, 0.05), vec3(0.93, 0.36, 0.08), smoothstep(0.25, 0.65, h)); vec3 a2 = mix(a1, vec3(1.0, 0.72, 0.2), smoothstep(0.7, 1.0, h));
              diffuseColor.rgb = mix(c, a2 * clamp(l, 0.55, 1.25), purple); } }`,
                )));
          }),
          (o.customProgramCacheKey = () => "autumn"),
          k3.set(s, o),
          o
        );
      };
      t.material = Array.isArray(t.material) ? t.material.map(n) : n(t.material);
    });
  }
  function A4(i, e) {
    i.updateMatrixWorld(!0);
    let t = new Ls(),
      n = -1 / 0,
      s = [];
    for (let c of [-0.42, -0.3, 0.3, 0.42])
      for (let l of [1.3, 1.9]) {
        t.set(new H(e.x + c * e.w, l, e.z + 6), new H(0, 0, -1));
        let h = t.intersectObject(i, !0).find((f) => f.object.visible !== !1);
        h && s.push(h.point.z);
      }
    (s.sort((c, l) => c - l), (n = s.length ? s[Math.floor(s.length / 2)] : e.z));
    let o = 4;
    t.set(new H(e.x - e.w * 0.3, 30, n - 0.12), new H(0, -1, 0));
    let r = t.intersectObject(i, !0)[0];
    r && (o = r.point.y);
    let a = o;
    for (let c = o - 0.03; c > o - 1.6; c -= 0.04) {
      t.set(new H(e.x - e.w * 0.3, c, e.z + 6), new H(0, 0, -1));
      let l = t.intersectObject(i, !0)[0];
      if (l && l.point.z < n + 0.04) {
        a = c;
        break;
      }
    }
    return { z: n, top: a };
  }
  function oA(i, e) {
    i.group.traverse((u) => {
      u.isMesh && (u.visible = !1);
    });
    let t = je("market"),
      n = e.w / 10,
      s = e.d / 8.69,
      o = (n + s) / 2;
    (t.scale.multiply(new H(n, o, s)), t.position.set(e.x, 0, e.z - e.d / 2));
    let r = new ae(e.trim),
      a = new ae(e.wall),
      c = new Map();
    (t.traverse((u) => {
      let p = u;
      if (!p.isMesh) return;
      let E = (Array.isArray(p.material) ? p.material : [p.material]).map((g) => {
        let y = g;
        if (c.has(y)) return c.get(y);
        let x = y.clone(),
          b = { h: 0, s: 0, l: 0 };
        if ((y.color.getHSL(b), y.transparent || y.opacity < 1)) {
          let w = x;
          ((w.transparent = !0), (w.opacity = 0.12), w.color.set(16777215), (w.roughness = 0.05), (w.depthWrite = !1));
        } else
          b.s > 0.5 && (b.h < 0.04 || b.h > 0.95) && !y.map
            ? x.color.copy(r)
            : b.l > 0.6 && b.s < 0.6 && b.h > 0.05 && b.h < 0.15 && !y.map && x.color.copy(y.color).lerp(a, 0.55);
        return (c.set(y, x), x);
      });
      ((p.material = Array.isArray(p.material) ? E : E[0]), (p.castShadow = !0), (p.receiveShadow = !0));
    }),
      K.add(t),
      (t.userData.prop = "shop"));
    let l = 4.61 * o,
      h = A4(t, e);
    ((e.fz = h.z), (e.top = h.top));
    let f = 0.62 * o + 0.1,
      d = new R(new Te(Math.min(e.w * 0.62, 4.6), f), new be({ map: ei(e.name, e.signBg, e.signFg) }));
    return (d.position.set(e.x, Math.min(l * 0.9, h.top - f / 2 - 0.06), h.z + 0.025), K.add(d), (i.door.x = e.x), l);
  }
  var ss = (i, e, t) => {
      let n = document.createElement("canvas");
      ((n.width = i), (n.height = e), t(n.getContext("2d")));
      let s = new ut(n);
      return ((s.colorSpace = Ye), (s.anisotropy = 4), s);
    },
    l6 = [
      "ลดกระหน่ำ!",
      "ถูกสุดในเมือง",
      "ของมันต้องมี",
      "ซื้อ 2 ถูกกว่า",
      "มาใหม่!",
      "แนะนำ!",
      "ราคาพิเศษ",
      "ขายดีอันดับ 1",
      "หมดแล้วหมดเลย",
      "คุ้มสุด ๆ",
    ],
    h6 = [
      ["#ffe100", "#e60012"],
      ["#e60012", "#ffe100"],
      ["#111111", "#ffe100"],
      ["#00a650", "#ffffff"],
      ["#ff7a00", "#ffffff"],
      ["#ff4fa3", "#ffffff"],
    ],
    d6 = new Map();
  function C4(i, e = !0) {
    let t = `${i % 64}|${e}`,
      n = d6.get(t);
    if (n) return n;
    let s = rA(i, e);
    return (d6.set(t, s), s);
  }
  function rA(i, e = !0) {
    let [t, n] = h6[i % h6.length],
      s = l6[i % l6.length];
    return e
      ? ss(128, 512, (o) => {
          ((o.fillStyle = t),
            o.fillRect(0, 0, 128, 512),
            (o.strokeStyle = n),
            (o.lineWidth = 8),
            o.strokeRect(6, 6, 116, 500),
            (o.fillStyle = n),
            (o.font = "700 54px Mitr, sans-serif"),
            (o.textAlign = "center"),
            (o.textBaseline = "middle"),
            o.save(),
            o.translate(64, 256),
            o.rotate(Math.PI / 2),
            o.fillText(s, 0, 0),
            o.restore());
        })
      : ss(512, 160, (o) => {
          ((o.fillStyle = t),
            o.fillRect(0, 0, 512, 160),
            (o.strokeStyle = n),
            (o.lineWidth = 10),
            o.strokeRect(8, 8, 496, 144),
            (o.fillStyle = n),
            (o.font = "700 76px Mitr, sans-serif"),
            (o.textAlign = "center"),
            (o.textBaseline = "middle"),
            o.fillText(s, 256, 86));
        });
  }
  var f6 = new Map();
  function gd(i) {
    let e = f6.get(i);
    if (e) return e;
    let t = aA(i);
    return (f6.set(i, t), t);
  }
  function aA(i) {
    return ss(256, 256, (e) => {
      ((e.fillStyle = "#ffe100"), e.beginPath());
      for (let t = 0; t < 24; t++) {
        let n = (t / 24) * Math.PI * 2,
          s = t % 2 ? 98 : 124;
        e.lineTo(128 + Math.cos(n) * s, 128 + Math.sin(n) * s);
      }
      (e.closePath(),
        e.fill(),
        (e.strokeStyle = "#e60012"),
        (e.lineWidth = 8),
        e.stroke(),
        (e.fillStyle = "#e60012"),
        (e.font = "700 74px Mitr, sans-serif"),
        (e.textAlign = "center"),
        (e.textBaseline = "middle"),
        e.fillText("฿" + i, 128, 140),
        (e.font = "700 34px Mitr, sans-serif"),
        (e.fillStyle = "#111"),
        e.fillText("ถูกจัง!", 128, 70));
    });
  }
  var u6 = "ถูกจัง!";
  function cA(i, e) {
    i.group.traverse((f) => {
      f.isMesh && (f.visible = !1);
    });
    let t = je("donki_store"),
      n = e.w / 7.4;
    t.scale.multiplyScalar(n);
    let s = new J();
    (s.position.set(e.x + 0.1 * n, 0, e.z - 2.2 * n), s.add(t), K.add(s), (s.userData.prop = "shop"));
    let o = ss(1024, 128, (f) => {
        ((f.fillStyle = "#111"),
          f.fillRect(0, 0, 1024, 128),
          (f.fillStyle = "#e60012"),
          f.fillRect(0, 0, 1024, 12),
          f.fillRect(0, 116, 1024, 12),
          (f.fillStyle = "#ffe100"),
          (f.font = "700 92px Mitr, sans-serif"),
          (f.textAlign = "center"),
          (f.textBaseline = "middle"),
          (f.lineWidth = 10),
          (f.strokeStyle = "#e60012"),
          f.strokeText(u6 + " มาร์ท", 512, 68),
          f.fillText(u6 + " มาร์ท", 512, 68),
          (f.font = "700 34px Mitr, sans-serif"),
          (f.fillStyle = "#fff"),
          (f.textAlign = "left"),
          f.fillText("24 ชม.", 30, 66),
          (f.textAlign = "right"),
          f.fillText("ของเยอะ!", 994, 66));
      }),
      r = (f, d, u) => {
        let p = new mt().setFromBufferAttribute(f.geometry.attributes.position),
          m = p.getSize(new H()),
          E = p.getCenter(new H()),
          g = new R(new Te(Math.max(m.x, 0.05), m.y), new be({ map: d, transparent: u, alphaTest: u ? 0.3 : 0 }));
        (g.position.set(E.x, E.y, p.max.z + 0.012), t.add(g));
      };
    t.traverse((f) => {
      let d = f;
      if (!d.isMesh) return;
      ((d.castShadow = !0), (d.receiveShadow = !0));
      let u = d.material;
      u.name === "Storefront_Sign_Emissive" && d.name === "Main_Storefront_Sign"
        ? ((d.visible = !1), r(d, o, !1))
        : u.name === "Donki_POP_Sign"
          ? (d.visible = !1)
          : /^Side_Stripe_Orange/.test(d.name)
            ? ((d.material = u.clone()), d.material.color.set(16769280))
            : /^Side_Stripe_Green/.test(d.name) && ((d.material = u.clone()), d.material.color.set(1118481));
    });
    let a = new X({ color: 15525596, roughness: 0.8 }),
      c = new X({ color: 7040888, roughness: 0.8 }),
      l = (f, d, u, p, m, E, g) => {
        let y = new R(new ee(f, d, u), p);
        return (
          y.position.set(m * n, E * n, g * n),
          y.scale.setScalar(n),
          (y.castShadow = !0),
          (y.receiveShadow = !0),
          s.add(y),
          y
        );
      };
    (l(0.36, 3.2, 6, a, 3.58, 1.6, -0.8), l(7.6, 0.2, 1.5, c, -0.1, 3.3, 0.12)); // v87: ผนังปิดข้างหนาขึ้น กันประตูแดงของโมเดลซ้อนระนาบ (กะพริบ)
    for (let [f, d] of [
      [-3.58, 0],
      [3.38, 3],
    ]) {
      let u = new R(new Te(0.4, 1.6), new be({ map: C4(d) }));
      (u.position.set(f * n, 2.2 * n, 2.23 * n), u.scale.setScalar(n), s.add(u));
    }
    for (let f = 0; f < 9; f++) {
      let d = -3.2 + f * 0.42 + (f > 3 ? 2 : 0);
      if (d > 3) break;
      let u = new R(
        new Te(0.36, 0.36),
        new be({ map: gd([19, 29, 39, 49, 59, 69, 79, 89, 99][f]), transparent: !0, alphaTest: 0.3 }),
      );
      (u.position.set(d * n, (2.75 + (f % 2) * 0.22) * n, 2.12 * n), u.scale.setScalar(n), s.add(u));
    }
    for (let [f, d, u, p] of [[-2.25, 1.15, 2.85, 0.55]]) {
      let m = new R(new gt(p, 40), new be({ map: io("st_chow", 16769280, 15073298), transparent: !0, side: Ke }));
      (m.position.set(f * n, d * n, u * n), m.scale.setScalar(n), s.add(m));
      let E = new R(new re(0.04, 0.04, d - p, 6), new X({ color: 3355443 }));
      (E.position.set(f * n, ((d - p) / 2) * n + (d > 3 ? 3.3 * n : 0) * 0, u * n - 0.05),
        (E.scale.y = d > 3 ? (d - p - 4.1) / (d - p) : 1),
        (E.position.y = d > 3 ? (4.1 + (d - p - 4.1) / 2) * n : ((d - p) / 2) * n),
        s.add(E));
    }
    let h = 4.1 * n;
    if (ze("vend_red")) {
      s.updateMatrixWorld(!0);
      let f = new mt(),
        d = new mt();
      if (
        (t.traverse((u) => {
          let p = u;
          p.isMesh &&
            (/^(Vending_Machine|Magazine_Rack|Mag_)/.test(p.name)
              ? (f.union(new mt().setFromObject(p)), (p.visible = !1))
              : /^Bargain_/.test(p.name)
                ? (d.union(new mt().setFromObject(p)), (p.visible = !1))
                : /^(Gacha_|Blade_Sign_)/.test(p.name) && (p.visible = !1));
        }),
        !f.isEmpty())
      ) {
        let u = f.min.z + 0.05,
          p = (f.min.x + f.max.x) / 2,
          m = je("vend_red", 0),
          E = je("vend_star"),
          g = 1.95 / 1.9;
        (m.scale.multiplyScalar(g),
          E.scale.multiplyScalar(g),
          m.position.set(p - 0.62, 0, u + 0.39),
          E.position.set(p + 0.62, 0, u + 0.36),
          K.add(m, E));
        for (let y of [m, E])
          y.traverse((x) => {
            let b = x;
            b.isMesh && ((b.castShadow = !0), (b.receiveShadow = !0));
          });
      }
      if (!d.isEmpty() && ze("dk_pile_apples_r")) {
        let u = new X({ color: 12159573, roughness: 0.85 }),
          p = (d.min.z + d.max.z) / 2,
          m = (d.min.x + d.max.x) / 2;
        ["dk_pile_apples_r", "dk_pile_oranges2"].forEach((E, g) => {
          let y = m + (g - 0.5) * 0.82,
            x = new R(new ee(0.76, 0.5, 0.62), u);
          (x.position.set(y, 0.25, p), (x.castShadow = x.receiveShadow = !0), K.add(x));
          let b = je(E, 0.66);
          (b.position.set(y, 0.42, p), K.add(b));
          let w = new R(new Te(0.36, 0.36), new be({ map: gd([19, 15][g]), transparent: !0, alphaTest: 0.3 }));
          (w.position.set(y, 0.3, p + 0.315), K.add(w));
        });
      }
    }
    {
      let f = e.x - 1.7 * n,
        d = e.z + 1.65 * n,
        u = new J();
      (u.position.set(f, 0, d), (u.rotation.y = 0.25), K.add(u));
      let p = new X({ color: 1908002, roughness: 0.6 });
      for (let m of [-1, 1]) {
        let E = new R(new ee(0.62, 0.95, 0.03), p);
        (E.position.set(0, 0.47, m * 0.13), (E.rotation.x = -m * 0.26), (E.castShadow = !0), u.add(E));
        let g = new R(
          new Te(0.56, 0.86),
          new be({
            map: ss(224, 344, (y) => {
              ((y.fillStyle = "#ffe100"),
                y.fillRect(0, 0, 224, 344),
                (y.strokeStyle = "#111"),
                (y.lineWidth = 12),
                y.strokeRect(6, 6, 212, 332),
                (y.fillStyle = "#c8102e"),
                y.fillRect(16, 16, 192, 64),
                (y.fillStyle = "#fff"),
                (y.font = "700 46px Mitr, sans-serif"),
                (y.textAlign = "center"),
                y.fillText("SALE!", 112, 64),
                (y.fillStyle = "#111"),
                (y.font = "600 30px Mitr, sans-serif"),
                y.fillText(
                  m > 0
                    ? "ขนมญี่ปุ่น"
                    : "เครื่องดื่ม",
                  112,
                  128,
                ),
                (y.fillStyle = "#c8102e"),
                (y.font = "700 104px Mitr, sans-serif"),
                y.fillText(m > 0 ? "29" : "19", 112, 248),
                (y.fillStyle = "#111"),
                (y.font = "700 30px Mitr, sans-serif"),
                y.fillText("บาท", 112, 300));
            }),
          }),
        );
        (g.position.set(0, 0.47, m * 0.13 + m * 0.018), g.rotation.set(-m * 0.26, m > 0 ? 0 : Math.PI, 0), u.add(g));
      }
      pt.push({ x: f, z: d, hw: 0.38, hd: 0.3 });
    }
    (pt.push(
      { x: e.x + 1.95 * n, z: e.z + 0.55 * n, hw: 1.05 * n, hd: 0.4 * n },
      { x: e.x + 3.65 * n, z: e.z + 0.55 * n, hw: 0.55 * n, hd: 0.3 * n },
      { x: e.x - 3.25 * n, z: e.z + 0.95 * n, hw: 0.45 * n, hd: 0.85 * n },
      { x: e.x - 4.1 * n, z: e.z - 1.5 * n, hw: 0.35 * n, hd: 0.9 * n },
    ),
      (i.door.x = e.x - 0.5 * n));
    {
      let f = A4(s, e);
      ((e.fz = f.z), (e.top = f.top), s.updateMatrixWorld(!0));
      let d = new mt();
      (t.traverse((u) => {
        u.isMesh &&
          /^(Front_Glass|Door_Glass|Door_Frame|Front_Pier)/.test(u.name) &&
          d.union(new mt().setFromObject(u));
      }),
        d.isEmpty() || (e.winX = [d.min.x, d.max.x]));
    }
    return h;
  }
  var p6 = new Map();
  function a1(i) {
    let e = p6.get(i);
    if (e) return e;
    let t = je(i);
    t.updateMatrixWorld(!0);
    let n = [];
    return (
      t.traverse((s) => {
        let o = s;
        o.isMesh && n.push({ geo: o.geometry, mat: o.material, m: o.matrixWorld.clone() });
      }),
      (e = { parts: n, size: new mt().setFromObject(t).getSize(new H()) }),
      p6.set(i, e),
      e
    );
  }
  function ad(i, e, t, n = !1) {
    if (!t.length) return;
    let s = a1(e),
      o = new Oe();
    for (let r of s.parts) {
      let a = new di(r.geo, r.mat, t.length);
      (t.forEach((c, l) => a.setMatrixAt(l, o.multiplyMatrices(c, r.m))),
        (a.castShadow = n),
        (a.receiveShadow = !0),
        a.computeBoundingSphere(),
        i.add(a));
    }
  }
  var P3 = [
    [
      "dk_chips_0",
      "dk_chips_1",
      "dk_chips_2",
      "dk_chips_3",
      "dk_chips_4",
      "dk_chips_5",
      "dk_chips_6",
      "dk_chips_7",
      "dk_chips_8",
    ],
    ["dk_soda_a", "dk_soda_b", "dk_soda_c", "dk_soda_d", "dk_milk", "dk_fc_29", "dk_fc_36", "dk_fc_35", "dk_fc_30"],
    ["dk_can_a", "dk_can_b", "dk_fc_0", "dk_fc_2", "dk_fc_3", "dk_fc_8", "dk_fc_15", "dk_fc_37", "dk_fc_39", "dk_fc_9"],
    [
      "dk_cereal_a",
      "dk_cereal_b",
      "dk_fc_5",
      "dk_fc_18",
      "dk_fc_7",
      "dk_bag",
      "dk_fc_27",
      "dk_fc_16",
      "dk_fc_32",
      "dk_fc_34",
    ],
    [
      "dk_bread_1",
      "dk_pile_apples_r",
      "dk_bread_2",
      "dk_eggs",
      "dk_pile_oranges",
      "dk_bread_3",
      "dk_pile_lemons",
      "dk_pile_apples_g",
    ],
  ];
  function lA(i) {
    if (!ze("dk_chips_0") || !i.decor) return !1;
    let e = i.origin,
      t = new Map(),
      n = new At(),
      s = new H(0, 1, 0),
      o = new H(1, 1, 1),
      r = new H(),
      a = 11,
      c = () => (a = (a * 16807) % 2147483647) / 2147483647,
      l = new Map(),
      h = 0;
    for (let u of i.decor) {
      let p = Math.round((u.pos.x - e.x) * Math.sin(u.ry) + (u.pos.z - e.z) * Math.cos(u.ry)),
        m = `${u.ry.toFixed(2)}|${u.level}|${p}`;
      l.has(m) || l.set(m, l.size);
      let E = P3[(l.get(m) * 3 + (u.level > 2 ? 1 : 0)) % P3.length].filter((k) => ze(k));
      if (!E.length) continue;
      let g = E[h++ % E.length],
        y = a1(g).size,
        x = y.x > 0.5 ? 0.5 / y.x : 1,
        b = y.clone().multiplyScalar(x),
        w = new H(x, x, x),
        v = 0.012,
        _ = 0.5,
        S = Math.max(1, Math.min(6, Math.floor(_ / (b.x + v)))),
        M = b.z < 0.16 ? 2 : 1,
        T = u.level > 2 ? (b.y < 0.22 ? 2 : 1) : Math.max(1, Math.min(2, Math.floor(0.6 / (b.y + 0.006)))),
        A = Math.sin(u.ry),
        F = Math.cos(u.ry),
        C = Math.cos(u.ry),
        P = -Math.sin(u.ry),
        I = t.get(g) ?? (t.set(g, []), t.get(g));
      for (let k = 0; k < S; k++)
        for (let D = 0; D < M; D++)
          for (let L = 0; L < T; L++) {
            let q = (k - (S - 1) / 2) * (b.x + v),
              $ = 0.28 - b.z / 2 - D * (b.z + 0.02);
            (r.set(u.pos.x - e.x + C * q + A * $, u.pos.y - 0.04 + L * (b.y + 0.006), u.pos.z - e.z + P * q + F * $),
              n.setFromAxisAngle(s, u.ry + (c() - 0.5) * 0.12),
              I.push(new Oe().compose(r.clone(), n.clone(), w)));
          }
    }
    let f = i.wares.map((u) => u.mesh.position),
      d = 0;
    for (let u of i.decor) {
      if (u.level !== 0.13) continue;
      let p = P3[d++ % 4].filter((_) => ze(_)),
        m = p[d % p.length],
        E = a1(m).size;
      if (E.x > 0.5) continue;
      let g = Math.sin(u.ry),
        y = Math.cos(u.ry),
        x = Math.cos(u.ry),
        b = -Math.sin(u.ry),
        w = t.get(m) ?? (t.set(m, []), t.get(m)),
        v = Math.max(1, Math.min(6, Math.floor(0.5 / (E.x + 0.012))));
      for (let _ = 0; _ < v; _++) {
        let S = (_ - (v - 1) / 2) * (E.x + 0.012);
        for (let M of [!1, !0]) {
          let T = M ? 0.28 - E.z / 2 : -0.3 + E.z / 2 + 0.02;
          (r.set(u.pos.x - e.x + x * S + g * T, 0.79, u.pos.z - e.z + b * S + y * T),
            !(M && f.some((A) => Math.hypot(A.x - r.x, A.z - r.z) < 0.42)) &&
              ((!M && E.y > 0.45) ||
                (n.setFromAxisAngle(s, u.ry + (c() - 0.5) * 0.1), w.push(new Oe().compose(r.clone(), n.clone(), o)))));
        }
      }
    }
    for (let [u, p] of t) ad(i.group, u, p);
    return (dA(i), (i.W ?? 0) > 15 && hA(i), !0);
  }
  var Np = {
      dry: [
        "Chips_1",
        "Chips_2",
        "chips_008",
        "Cookie_1",
        "Cookie_2",
        "Cookie_3",
        "cookie_006",
        "cookie_011",
        "cookie_012",
        "bar_001",
        "Macaron",
        "Donut",
        "donut_002",
        "Eclair",
        "Croissant",
        "croissant_001",
        "pastry_002",
        "Bread_1",
        "Bread_2",
        "Bread_3",
        "Pie",
        "cheesecake_001",
        "dk_bag",
      ],
      drink: [
        "Bottle_1",
        "Bottle_2",
        "Bottle_3",
        "Bottle_4",
        "Bottle_5",
        "Bottle_6",
        "bottle_002",
        "Carton_Box_1",
        "Carton_Box_2",
        "Juice_Box",
        "Soda_Can_1",
        "Soda_Can_2",
        "can_009",
        "soda_002",
        "coffee_005",
        "tea_003",
        "Coffee_Cup_To_Go",
        "yogurt_002",
        "Mustard",
        "Ketchup",
      ],
      fresh: [
        "Apple_Red",
        "Orange",
        "Tomato",
        "Bell_Pepper_Yellow",
        "Pumpkin",
        "Watermelon",
        "watermelon_001",
        "avocado_001",
        "avocado_003",
        "pepper_003",
        "onion_001",
        "onion_003",
        "chili_002",
        "mushroom_002",
        "mushroom_004",
        "mushroom_006",
        "Champignon_Mushroom",
        "Green_Onion",
        "egg_001",
        "egg_002",
      ],
      frozen: [
        "Meat_Steak_1",
        "Meat_Steak_2",
        "Meat_on_Bone",
        "Salmon_Steak",
        "Sardine",
        "fish_004",
        "Shrimp",
        "shrimp_001",
        "shrimp_002",
        "Sausage",
        "sasuage_003",
        "Pizza",
        "ice_cream_001",
        "ice_cream_003",
        "burger_001",
        "Burger",
        "sandwich_001",
        "sandwich_002",
        "Sandwich",
      ],
    },
    sa = [
      "ถูกสุด!",
      "ลด 50%",
      "ฮิตมาก!",
      "ของใหม่!",
      "1 แถม 1",
      "ราคาพิเศษ",
      "ขายดี!",
      "แนะนำ!",
      "คุ้มสุด ๆ",
      "ลดกระหน่ำ",
      "ของมันต้องมี",
      "หมดแล้วหมดเลย",
      "ถูกจัง!",
      "จัดเต็ม!",
      "ห้ามพลาด!",
      "ราคาโหด",
    ],
    I3 = [
      ["#ffe100", "#e60012"],
      ["#e60012", "#ffe100"],
      ["#ff7a00", "#fff"],
      ["#ff4fa3", "#fff"],
      ["#00a650", "#fff"],
      ["#1d6fd8", "#ffe100"],
      ["#fff", "#e60012"],
      ["#111", "#ffe100"],
    ],
    m6 = new Map();
  function ro(i, e, t, n, s = "") {
    let [o, r] = I3[e % I3.length],
      a = `${i}|${e % I3.length}|${Math.round(t * 10)}|${Math.round(n * 10)}|${s}`,
      c = m6.get(a),
      l = c
        ? c.map
        : ss(Math.round(t * 320), Math.round(n * 320), (p) => {
            let m = p.canvas.width,
              E = p.canvas.height;
            ((p.fillStyle = o),
              p.fillRect(0, 0, m, E),
              (p.strokeStyle = r),
              (p.lineWidth = Math.max(6, E * 0.06)),
              p.strokeRect(p.lineWidth / 2, p.lineWidth / 2, m - p.lineWidth, E - p.lineWidth),
              (p.fillStyle = r),
              (p.textAlign = "center"),
              (p.textBaseline = "middle"));
            let g = Math.min(E * (s ? 0.46 : 0.62), (m / Math.max(3, i.length)) * 1.5);
            ((p.font = `700 ${g}px Mitr, sans-serif`),
              p.save(),
              p.translate(m / 2, s ? E * 0.4 : E / 2),
              p.rotate(-0.04),
              p.fillText(i, 0, 0),
              p.restore(),
              s && ((p.font = `600 ${E * 0.24}px Mitr, sans-serif`), p.fillText(s, m / 2, E * 0.78)));
          }),
      h = c ?? new be({ map: l, toneMapped: !1 }),
      f = new Te(t, n);
    m6.set(a, h);
    let d = new R(f, h),
      u = new R(f, h);
    return ((u.rotation.y = Math.PI), (u.position.z = -0.003), d.add(u), d);
  }
  // v82: โมเดลสินค้าที่สแกนมาเละ/แตก/ภาพเบลอ — ไม่วางในร้าน (ตรวจด้วยภาพทีละชิ้นแล้ว)
  var ccsBad = new Set([
    "crabstall_0", "seafood_0", "beefpack_0",
    "deli_5", "deli_6", "deli_7", "deli_21", "deli_30", "deli_34",
    "meatpk_4", "meatpk_12", "meatpk_13",
    "breadpk_11", "breadpk_12", "breadpk_28",
    "sandw_0", "sandw_1", "sandw_2", "sandw_3", "sandw_4", "sandw_5", "sandw_7", "sandw_16",
    "jbread_1", "jbread_2", "jbread_3", "jbread_9", "jbread_12",
    "shelfu_4", "shelfu_5", "shelfu_6", "shelfu_7", "shelfu_8", "shelfu_9",
    ...Array.from({ length: 21 }, (i, e) => "candybox_" + e),
  ]);
  function F3(i, e) {
    let t = i.filter((r) => ze(r) && !ccsBad.has(r));
    // ทั้งชุดเป็นของเสีย → ใช้ขนมกล่องญี่ปุ่น/ขนมแพ็กที่สวยแทน
    t.length || !i.some((r) => ccsBad.has(r)) || (t = ["jcandy_0", "jcandy_1", "jcandy_2", "jcandy_3", "jcandy_5", "jcandy_6", "jcandy_7", "shelfu_12", "shelfu_13", "shelfu_15", "shelfu_17"].filter((r) => ze(r)));
    let n = new Map();
    if (!t.length) return n;
    let s = new At(),
      o = new Yn();
    return (
      e.forEach((r, a) => {
        let c = t[a % t.length],
          l = a1(c).size,
          h = r.size / Math.max(0.01, l.x, l.y, l.z);
        (o.set(r.rx ?? 0, r.ry, 0, "YXZ"),
          s.setFromEuler(o),
          r.rx &&
            ((r.p = r.p.clone()),
            (r.p.y += (l.z * h) / 2),
            r.p.addScaledVector(new H(Math.sin(r.ry), 0, Math.cos(r.ry)), (-l.y * h) / 2)),
          (n.get(c) ?? (n.set(c, []), n.get(c))).push(new Oe().compose(r.p.clone(), s.clone(), new H(h, h, h))));
      }),
      n
    );
  }
  function hA(i) {
    let e = i.group,
      t = i.origin,
      n = i.W,
      s = i.D,
      o = 11,
      r = () => (o = (o * 16807) % 2147483647) / 2147483647,
      a = new X({ color: 15921906, roughness: 0.5, metalness: 0.3 }),
      c = new X({ color: 15073298, roughness: 0.5 }),
      l = [],
      h = (T, A, F, C, P, I, k = !1) => {
        let D = F,
          L = !I,
          q = L ? 0.62 : 0.9,
          $ = 1.85,
          te = new J();
        (te.position.set(T, 0, A), (te.rotation.y = (C ? Math.PI / 2 : 0) + (k ? Math.PI : 0)), e.add(te));
        let Y = new R(new ee(D, $, 0.06), a);
        (Y.position.set(0, $ / 2, L ? -q / 2 + 0.03 : 0), te.add(Y));
        let O = new R(new ee(D - 0.12, 0.14, q - 0.02), c); // v90: ฐานแดงหดเข้าด้านใน ไม่ซ้อนระนาบกับแผงข้างสีเทา (กะพริบ)
        ((O.position.y = 0.07), te.add(O));
        for (let ge of [-1, 1]) {
          let Pe = new R(new ee(0.05, $, q), a);
          (Pe.position.set(ge * (D / 2 - 0.025), $ / 2, 0), te.add(Pe));
        }
        let U = L
            ? [[1, P]]
            : [
                [1, P],
                [-1, I],
              ],
          W = new Map();
        if (
          ([0.14, 0.58, 1.02, 1.46].forEach((ge, Pe) => {
            let de = new R(new ee(D - 0.1, 0.035, q), a);
            ((de.position.y = ge), te.add(de));
            for (let [Me, N] of U) {
              let he = new R(new ee(D - 0.1, 0.07, 0.015), c);
              (he.position.set(0, ge + 0.02, (Me * q) / 2), te.add(he));
              let le = N[Pe],
                ve = le.step ?? le.size * 1.12,
                He = Math.max(2, Math.floor((D - 0.24) / ve)),
                at = L ? [q / 2 - 0.13, q / 2 - 0.36] : [0.3, 0.12],
                Ge = le.n.join(","),
                V = W.get(Ge) ?? (W.set(Ge, { names: le.n, pts: [] }), W.get(Ge));
              for (let B = 0; B < He; B++)
                for (let ce of at) {
                  let xe = -D / 2 + 0.12 + ve / 2 + B * ((D - 0.24 - ve) / Math.max(1, He - 1));
                  V.pts.push({
                    p: new H(xe, ge + 0.02, Me * ce),
                    ry: (Me > 0 ? 0 : Math.PI) + (le.stand ? 0 : (r() - 0.5) * 0.25),
                    size: le.size * (0.95 + r() * 0.1),
                    rx: le.stand ? Math.PI / 2 : void 0,
                  });
                }
              for (let B = 0; B < Math.floor(D / 0.6); B++) {
                let ce = new R(
                  new Te(0.2, 0.2),
                  new be({
                    map: gd([9, 15, 19, 25, 29, 39, 49, 59][Math.floor(r() * 8)]),
                    transparent: !0,
                    alphaTest: 0.3,
                    toneMapped: !1,
                  }),
                );
                (ce.position.set(-D / 2 + 0.3 + B * 0.6, ge - 0.02, Me * (q / 2 + 0.012)),
                  (ce.rotation.y = Me > 0 ? 0 : Math.PI),
                  te.add(ce));
              }
            }
          }),
          !L)
        )
          for (let ge of [-1, 1]) {
            let Pe = ro(sa[Math.floor(r() * sa.length)], Math.floor(r() * 8), 0.8, 0.5);
            (Pe.position.set(ge * (D / 2 + 0.006), 1.5, 0), (Pe.rotation.y = (ge * Math.PI) / 2), te.add(Pe));
          }
        let Q = Math.min(2.4, D * 0.7),
          Z = ro(
            sa[Math.floor(r() * sa.length)],
            Math.floor(r() * 8),
            Q,
            0.42,
            "ราคาเดียวทั้งชั้น!",
          );
        (Z.position.set(0, $ + 0.3, L ? -q / 2 + 0.07 : 0), te.add(Z));
        for (let ge of [-1, 1]) {
          let Pe = new R(new re(0.015, 0.015, 0.3, 6), a);
          (Pe.position.set(ge * Q * 0.4, $ + 0.04, L ? -q / 2 + 0.07 : 0), te.add(Pe));
        }
        let fe = C ? q : D,
          _e = C ? D : q;
        (i.solids.push({ x: t.x + T, z: t.z + A, hw: fe / 2 + 0.06, hd: _e / 2 + 0.06 }), (te.userData.occOK = !0));
        for (let ge of W.values()) for (let [Pe, de] of F3(ge.names, ge.pts)) ad(te, Pe, de);
      },
      f = (T, A) => A.map((F) => `${T}_${F}`),
      d = f("sauce", [0, 1, 2, 3, 4, 5, 6, 7]),
      u = f("soda", [0, 1, 2, 3, 4, 5, 6, 7]),
      p = f(
        "candybox",
        Array.from({ length: 21 }, (T, A) => A),
      ),
      m = f("jcandy", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      E = f("shelfu", [12, 13, 14, 15, 16, 17, 18, 19]),
      g = [...f("jbread", [0, 4, 5, 6, 7, 8, 10]), ...f("cookie", [6, 7, 8, 10, 11])],
      y = f("sandw", [5, 6, 7, 15, 16]),
      x = ze("sauce_0");
    (x
      ? h(
          6.6,
          2,
          2.8,
          !0,
          [
            { n: u, size: 0.17 },
            { n: u.slice(4), size: 0.17 },
            { n: m, size: 0.22, step: 0.24 },
            { n: p, size: 0.17, stand: !0 },
          ],
          [
            { n: d, size: 0.26 },
            { n: E, size: 0.24 },
            { n: g, size: 0.15 },
            { n: y, size: 0.2 },
          ],
        )
      : h(
          6.6,
          2,
          2.8,
          !0,
          [0, 1, 2, 3].map(() => ({ n: Np.dry, size: 0.18 })),
          [0, 1, 2, 3].map(() => ({ n: Np.drink, size: 0.18 })),
        ),
      [
        [7.25, -4.35],
        [7.25, -1.45],
      ].forEach(([T, A], F) => {
        let C = new J();
        (C.position.set(T, 0, A), (C.rotation.y = Math.PI / 2), e.add(C));
        let P = new R(new ee(2.4, 0.8, 0.95), new X({ color: 16777215, roughness: 0.35, metalness: 0.2 }));
        ((P.position.y = 0.4), C.add(P));
        let I = new R(
          new ee(2.25, 0.05, 0.8),
          new X({ color: 12577023, roughness: 0.3, emissive: 7325439, emissiveIntensity: 0.35 }),
        );
        ((I.position.y = 0.66), C.add(I));
        let k = new R(
          new ee(2.3, 0.02, 0.86),
          new X({ color: 15399167, transparent: !0, opacity: 0.08, roughness: 0.02, metalness: 0.1, depthWrite: !1 }),
        );
        ((k.position.y = 0.93), (k.userData.noOcc = !0), C.add(k));
        for (let $ of [-1, 1]) {
          let te = new R(new ee(0.04, 0.14, 0.95), new X({ color: 10134701, metalness: 0.7, roughness: 0.3 }));
          (te.position.set($ * 1.2, 0.87, 0), C.add(te));
        }
        for (let $ of [-1, 1]) {
          let te = new R(new ee(2.4, 0.14, 0.04), new X({ color: 10134701, metalness: 0.7, roughness: 0.3 }));
          (te.position.set(0, 0.87, $ * 0.455), C.add(te));
        }
        for (let $ of [-1, 1]) {
          let te = ro(
            F === 0
              ? "ไอศกรีม ลด 30%!"
              : $ > 0
                ? "เนื้อสด ซีฟู้ด ถูกจัง!"
                : "ของสดทุกวัน!",
            F === 0 ? 5 : $ > 0 ? 0 : 3,
            2.3,
            0.36,
          );
          (te.position.set(0, 0.42, $ * 0.481), (te.rotation.y = $ > 0 ? 0 : Math.PI), C.add(te));
        }
        let D = [],
          L = ($, te) => {
            for (let [Y, O] of F3($, te)) ad(C, Y, O);
          };
        if (x && F === 0) {
          for (let $ = 0; $ < 2; $++)
            for (let te = 0; te < 17; te++)
              for (let Y = 0; Y < 6; Y++)
                D.push({
                  p: new H(
                    -1.04 + te * 0.13 + $ * 0.065,
                    0.69 + $ * 0.085,
                    -0.33 + Y * 0.13 + $ * 0.065 * (Y < 5 ? 1 : -1),
                  ),
                  ry: (r() - 0.5) * 0.4,
                  size: 0.12,
                });
          L(
            f(
              "icecream",
              Array.from({ length: 34 }, ($, te) => te + 6),
            ),
            D,
          );
        } else if (x) {
          let $ = [];
          for (let te = 0; te < 2; te++)
            for (let Y = 0; Y < 9; Y++)
              for (let O = 0; O < 4; O++)
                $.push({
                  p: new H(-0.98 + Y * 0.245 + te * 0.06, 0.69 + te * 0.07, -0.28 + O * 0.185 + (r() - 0.5) * 0.02),
                  ry: (O % 2) * Math.PI + (r() - 0.5) * 0.25 + (te ? 0.4 : 0),
                  size: 0.22,
                });
          (L([...f("meatpk", [18, 19, 20, 22, 23, 24, 25, 26, 27]), "beefpack_0", "sushi_0", "meatpk_28"], $),
            L([ze("sashimi_boat") ? "sashimi_boat" : "seafood_0"], [{ p: new H(0.03, 0.74, 0), ry: 0, size: 1.15 }])); // v82: เรือซาชิมิ
        } else {
          for (let $ = 0; $ < 11; $++)
            for (let te of [-0.2, 0.2])
              D.push({
                p: new H(-1 + $ * 0.2, 0.69, te + (r() - 0.5) * 0.05),
                ry: r() * 6.28,
                size: 0.17 + r() * 0.04,
              });
          L(Np.frozen, D);
        }
        ((C.userData.occOK = !0), i.solids.push({ x: t.x + T, z: t.z + A, hw: 0.53, hd: 1.26 }));
        let q = ro(
          F === 0
            ? "ไอศกรีม"
            : "ของสด ราคาโหด!",
          F === 0 ? 5 : 1,
          1.3,
          0.5,
        );
        (q.position.set(T, 2.7, A), (q.rotation.y = Math.PI / 2), (q.userData.noOcc = !0), e.add(q));
        for (let $ of [-0.55, 0.55]) {
          let te = new R(new re(0.005, 0.005, 1.6499999999999995, 4), new be({ color: 3355443 }));
          (te.position.set(T, (4.6 + 2.95) / 2, A + $), e.add(te));
        }
      }));
    let b = (T, A, F, C, P, I = 0, k) => {
      if (!ze(T)) return null;
      let D = je(T, P);
      return (
        D.position.set(A, I, F),
        (D.rotation.y = C),
        // v84: ของตกแต่งในร้านไม่รับเงาตัวเอง (กันเงาเป็นริ้วกะพริบเวลาเดิน) + กัน z-fight ชิ้นที่ซ้อนระนาบเดียวกัน
        (() => {
          let L = 0;
          D.traverse((q) => {
            if (!q.isMesh) return;
            ((q.castShadow = !0), (q.receiveShadow = !1));
            if (/^breadpk|snack_shelf|vfridge/.test(T)) {
              let W = (Array.isArray(q.material) ? q.material : [q.material]).map((Z) => {
                Z = Z.clone();
                (Z.transparent || Z.opacity < 1 || /glass/i.test(Z.name)) && (Z.depthWrite = !1);
                return ((Z.polygonOffset = !0), (Z.polygonOffsetFactor = -0.5 * (L % 6)), (Z.polygonOffsetUnits = -2 * (L % 6)), Z);
              });
              ((q.material = Array.isArray(q.material) ? W : W[0]), L++);
            }
          });
        })(),
        e.add(D),
        k && i.solids.push({ x: t.x + A, z: t.z + F, hw: k[0], hd: k[1] }),
        D
      );
    };
    if (x) {
      (b("vfridge_1", n / 2 - 0.62, -5.2, -Math.PI / 2, 2.2, 0, [0.62, 1.12]),
        // (เอาแผงปูสแกนที่เละออก)
        // v82: ชั้นขนม (snack_shelf) ชิดผนังหลังมุมขวา (ที่เดิมของแผงปู) หันเข้าร้าน
        b("snack_shelf", 7.6, -s / 2 + 0.3, -Math.PI / 2, 2.45, 0, [0.98, 0.3]),
        ccsMeatCase(e, i, t, -1.9, -0.9)); // v88: ย้ายตู้แช่เนื้อมากลางโซนหน้าชั้นหลัง เดินรอบได้ (เดิมชนปลายชั้นวาง)
      {
        let F = new R(
          new ee(1.7, 0.72, 0.8),
          new X({
            map: ss(64, 64, (P) => {
              ((P.fillStyle = "#c58a4e"), P.fillRect(0, 0, 64, 64), (P.fillStyle = "#a86f3a"));
              for (let I = 0; I < 8; I++) P.fillRect(0, I * 8, 64, 2);
            }),
            roughness: 0.8,
          }),
        );
        (F.position.set(-1.2, 0.36, -4.3),
          (F.castShadow = F.receiveShadow = !0),
          e.add(F),
          b("breadpk_1", -1.2 - 0.5, -4.3 - 0.05, 0, 0.62, 0.72),
          b("breadbasket_0", -1.2 + 0.25, -4.3 + 0.08, 0.3, 0.42, 0.72),
          b("breadpk_3", -1.2 + 0.65, -4.3 - 0.15, 0, 0.5, 0.72));
        let C = ro(
          "ขนมปังอบใหม่",
          2,
          1.1,
          0.34,
          "ชิ้นละ ฿25",
        );
        (C.position.set(-1.2, 1.32, -4.3 - 0.3), e.add(C));
        for (let P of [-0.45, 0.45]) {
          let I = new R(new re(0.014, 0.014, 0.45, 6), a);
          (I.position.set(-1.2 + P, 0.95, -4.3 - 0.3), e.add(I));
        }
        i.solids.push({ x: t.x + -1.2, z: t.z + -4.3, hw: 0.9, hd: 0.45 });
      }
      {
        let F = new R(new ee(2, 0.6, 0.75), c);
        (F.position.set(-2.6, 0.3, 5.75), (F.castShadow = F.receiveShadow = !0), e.add(F));
        let C = new R(new ee(2.06, 0.06, 0.8), new X({ color: 16769280, roughness: 0.5 }));
        (C.position.set(-2.6, 0.62, 5.75),
          e.add(C),
          ["shelfu_0", "shelfu_2", "shelfu_3"].forEach((I, k) => b(I, -2.6 - 0.62 + k * 0.62, 5.75, 0, 0.6, 0.65)));
        let P = ro("มันฝรั่ง 3 ถุง ฿99", 0, 1.3, 0.36);
        (P.position.set(-2.6, 1.45, 5.75 - 0.25), e.add(P));
        for (let I of [-0.55, 0.55]) {
          let k = new R(new re(0.014, 0.014, 0.8, 6), a);
          (k.position.set(-2.6 + I, 1, 5.75 - 0.25), e.add(k));
        }
        i.solids.push({ x: t.x + -2.6, z: t.z + 5.75, hw: 1.05, hd: 0.42 });
      }
    }
    for (let [T, A, F, C, P] of [
      [
        "ขนม ของกินเล่น",
        "SNACKS",
        -5.2,
        -0.6,
        Math.PI / 2,
      ],
      ["เครื่องดื่ม", "DRINKS", 8.3, 1.6, Math.PI / 2],
      ["เนื้อสด", "FRESH MEAT", -1.9, -0.9, 0],
      ["เบเกอรี่", "BAKERY", -1.0, -4.3, 0],
      ["ซีฟู้ด สดทุกวัน", "SEAFOOD", 8.3, -6, 0],
      ["ของแช่แข็ง", "FROZEN", 7.25, -2.9, Math.PI / 2],
      ["ผักผลไม้", "FRESH", 8.2, 5.6, 0],
      ["ชำระเงิน", "CASHIER", -7.75, 4.3, 0],
    ]) {
      let I = ro(T, 0, 2, 0.62, A);
      (I.position.set(F, 3.35, C), (I.rotation.y = P), (I.userData.noOcc = !0), e.add(I));
      for (let k of [-0.85, 0.85]) {
        let D = new R(new re(0.005, 0.005, 0.9399999999999995, 4), new be({ color: 3355443 }));
        (D.position.set(F + Math.cos(P) * k, (4.6 + 3.66) / 2, C - Math.sin(P) * k), e.add(D));
      }
    }
    for (let T = 0; T < 3; T++) {
      let A = 7 + T * 1.2,
        F = 6.35,
        C = new R(new re(0.5, 0.42, 0.62, 18), new X({ color: [15073298, 16769280, 42576][T], roughness: 0.6 }));
      (C.position.set(A, 0.31, F), e.add(C));
      let P = [];
      for (let D = 0; D < 9; D++) {
        let L = D * 2.4,
          q = 0.12 + (D % 3) * 0.1;
        P.push({
          p: new H(A + Math.cos(L) * q, 0.62 + (D > 5 ? 0.08 : 0), F + Math.sin(L) * q),
          ry: r() * 6,
          size: 0.16,
        });
      }
      l.push({ names: Np.fresh.slice(T * 6, T * 6 + 7), pts: P });
      let I = ro(
        [
          "ผักสด",
          "ผลไม้",
          "ไข่+เห็ด",
        ][T],
        T,
        0.6,
        0.3,
        `฿${[10, 15, 12][T]}`,
      );
      (I.position.set(A, 1.25, F), e.add(I));
      let k = new R(new re(0.012, 0.012, 0.6, 6), a);
      (k.position.set(A, 0.92, F), e.add(k), i.solids.push({ x: t.x + A, z: t.z + F, hw: 0.52, hd: 0.52 }));
    }
    for (let T of l) for (let [A, F] of F3(T.names, T.pts)) ad(e, A, F);
    let w = (T, A, F) =>
        !i.solids.some((C) => Math.abs(t.x + T - C.x) < C.hw + F && Math.abs(t.z + A - C.z) < C.hd + F) &&
        Math.abs(T) < n / 2 - 1.6 &&
        A > -s / 2 + 1.6 &&
        A < s / 2 - 1.2,
      v = [];
    for (let T = 0, A = 0; T < 46 && A < 900; A++) {
      let F = -n / 2 + 1 + r() * (n - 2),
        C = -s / 2 + 1 + r() * (s - 2.5),
        P = 0.6 + r() * 0.8,
        I = 0.32 + r() * 0.25;
      if (!w(F, C, P / 2 + 0.25) || v.some((L) => Math.hypot(L.x - F, L.y - C) < 1.3)) continue;
      (v.push(new me(F, C)), T++);
      let k = ro(sa[T % sa.length], Math.floor(r() * 8), P, I);
      (k.position.set(F, 2.75 + r() * 0.9, C),
        (k.rotation.y = (r() < 0.5 ? 0 : Math.PI / 2) + (r() - 0.5) * 0.3),
        (k.userData.noOcc = !0),
        e.add(k));
      let D = new R(new re(0.004, 0.004, 4.4 - k.position.y, 4), new be({ color: 3355443 }));
      (D.position.set(F, (4.4 + k.position.y + I / 2) / 2, C), e.add(D));
    }
    let _ = [15073298, 16769280, 42576, 1929176, 16742912, 16732067],
      S = new qe();
    (S.setAttribute("position", new Fe([-0.13, 0, 0, 0.13, 0, 0, 0, -0.24, 0], 3)), S.computeVertexNormals());
    let M = _.map((T) => new be({ color: T, side: Ke, toneMapped: !1 }));
    for (let T = 0; T < 7; T++) {
      let A = -s / 2 + 1.2 + T * ((s - 2.4) / 6),
        F = Math.floor(n / 0.32);
      for (let C = 0; C < F; C++) {
        let P = -n / 2 + 0.2 + C * 0.32,
          I = 4.25 - Math.sin((C / (F - 1)) * Math.PI) * 0.45,
          k = new R(S, M[(C + T) % 6]);
        (k.position.set(P, I, A), (k.userData.noOcc = !0), e.add(k));
      }
    }
    for (let T of [-1, 1])
      for (let A = 0; A < 9; A++) {
        let F = ro(
          sa[(A * 3 + (T > 0 ? 5 : 0)) % sa.length],
          A + (T > 0 ? 3 : 0),
          0.95,
          0.55,
          ["฿19", "฿29", "฿39", "฿49", "฿99"][A % 5],
        );
        (F.position.set(T * (n / 2 - 0.06), 3.55 + (A % 2) * 0.35, -s / 2 + 1.2 + A * ((s - 2.4) / 8)),
          (F.rotation.y = (-T * Math.PI) / 2),
          e.add(F));
      }
  }
  function dA(i) {
    let e = i.group,
      t = i.origin;
    e.children.forEach((c) => {
      let l = c;
      l.isMesh && l.geometry instanceof gt && l.position.y < 0.02 && l.position.y > 0.005 && (l.visible = !1);
    });
    let n = (c, l, h, f, d) => {
        if (!ze(c)) return null;
        let u = je(c);
        return (
          u.position.set(l, 0, h),
          (u.rotation.y = f),
          u.traverse((p) => {
            let m = p;
            m.isMesh && ((m.castShadow = !0), (m.receiveShadow = !0));
          }),
          e.add(u),
          d && i.solids.push({ x: t.x + l, z: t.z + h, hw: d[0], hd: d[1] }),
          u
        );
      },
      s = (i.W ?? 0) > 15;
    s
      ? n("dk_drinkshelf", i.W / 2 - 0.45, 1.1, -Math.PI / 2, [0.45, 1.75])
      : n("dk_drinkshelf", -3.6, -0.3, 0, [1.72, 0.4]);
    {
      let c = s ? -1.9 : -3.6,
        l = s ? 2.9 : 3.7,
        h = new R(new ee(2.9, 0.62, 0.95), new X({ color: 15073298, roughness: 0.6 }));
      (h.position.set(c, 0.31, l), (h.castShadow = h.receiveShadow = !0), e.add(h));
      let f = new R(new ee(3, 0.12, 1.05), new X({ color: 16769280, roughness: 0.5 }));
      (f.position.set(c, 0.66, l), e.add(f));
      let d = [
          "dk_chips_0",
          "dk_chips_1",
          "dk_chips_2",
          "dk_chips_3",
          "dk_chips_4",
          "dk_chips_5",
          "dk_chips_6",
          "dk_chips_7",
          "dk_chips_8",
          "dk_bag",
        ].filter((b) => ze(b)),
        p = 5,
        m = () => (p = (p * 16807) % 2147483647) / 2147483647;
      // v87: ถังขนมจัดเป็นระเบียบ — ขอบกั้นรอบถัง + ถุงตั้งเรียงแถว เอนพิงไปด้านหลัง ไม่ทะลุเสาป้าย/ขอบ
      {
        let b = new X({ color: 16769280, roughness: 0.5 });
        for (let [w, v, _, S] of [
          [3, 0.2, 0.06, [0, 0.5]],
          [3, 0.2, 0.06, [0, -0.5]],
          [0.06, 0.2, 1.05, [1.47, 0]],
          [0.06, 0.2, 1.05, [-1.47, 0]],
        ]) {
          let M = new R(new ee(w, v, _), b);
          (M.position.set(c + S[0], 0.82, l + S[1]), e.add(M));
        }
      }
      for (let [b, w, v] of [
        [0.27, 0.72, 0.5],
        [0, 0.8, 0.5],
        [-0.27, 0.88, 0.5],
      ])
        for (let _ = 0; _ < 8; _++) {
          let S = d[(_ * 3 + Math.round(b * 10) + 20) % d.length],
            M = je(S, 0.3);
          (M.position.set(c - 1.22 + _ * 0.35 + (m() - 0.5) * 0.04, w - 0.1, l + b),
            (M.rotation.set(-v * 0.6 - 0.15, (m() - 0.5) * 0.25, 0)),
            e.add(M));
        }
      let x = new R(
        new Te(1.4, 0.5),
        new be({
          map: ss(448, 160, (b) => {
            ((b.fillStyle = "#ffe100"),
              b.fillRect(0, 0, 448, 160),
              (b.strokeStyle = "#e60012"),
              (b.lineWidth = 10),
              b.strokeRect(5, 5, 438, 150),
              (b.fillStyle = "#e60012"),
              (b.font = "700 62px Mitr, sans-serif"),
              (b.textAlign = "center"),
              (b.textBaseline = "middle"),
              b.fillText("ถุงละ 19฿!", 224, 66),
              (b.fillStyle = "#111"),
              (b.font = "500 30px Mitr, sans-serif"),
              b.fillText(
                "ขนมเทกระจาด ลดล้างสต็อก",
                224,
                126,
              ));
          }),
          side: Ke,
        }),
      );
      (x.position.set(c, 1.55, l - 0.5), e.add(x));
      for (let b of [-0.72, 0.72]) {
        let w = new R(new re(0.02, 0.02, 0.9, 6), new X({ color: 8947848 }));
        (w.position.set(c + b, 1.2, l - 0.5), e.add(w));
      }
      i.solids.push({ x: t.x + c, z: t.z + l, hw: 1.5, hd: 0.52 });
    }
    let o = ["dk_pile_apples_r", "dk_pile_oranges2", "dk_pile_apples_g", "dk_pile_lemons", "dk_pile_oranges"].filter(
        (c) => ze(c),
      ),
      r = new X({ color: 12159573, roughness: 0.85 });
    (o.slice(0, 4).forEach((c, l) => {
      let h = s ? 6.55 + l * 0.95 : -5 + l * 0.95,
        f = s ? 4.6 : 1.55,
        d = new R(new ee(0.8, 0.42, 0.62), r);
      (d.position.set(h, 0.21, f), (d.castShadow = d.receiveShadow = !0), e.add(d));
      let u = je(c, 0.68);
      (u.position.set(h, 0.36, f), (u.rotation.y = (l % 2) * 0.4), e.add(u));
      let p = new R(new Te(0.34, 0.34), new be({ map: gd([10, 15, 12, 9][l]), transparent: !0, alphaTest: 0.3 }));
      (p.position.set(h, 0.3, f + 0.32), e.add(p));
    }),
      o.length &&
        i.solids.push(
          s
            ? { x: t.x + 7.98, z: t.z + 4.6, hw: 1.95, hd: 0.36 }
            : { x: t.x - 3.58, z: t.z + 1.55, hw: 1.95, hd: 0.36 },
        ));
    {
      let c = i.keeperSpot.clone().sub(t),
        l = Jr.counter;
      for (let [h, f, d] of [
        ["dk_bento", -1.05, 0.42],
        ["dk_nuggets", -1.8, 0.32],
        ["dk_ramen", -0.3, 0.36],
      ]) {
        if (!ze(h)) continue;
        let u = je(h, d);
        (s
          ? (u.position.set(l.regX + 0.9 + (f + 1.8) * 0.55, 0.84, l.z - 0.1), (u.rotation.y = Math.PI + 0.15))
          : (u.position.set(c.x + f, 0.72, c.z + 1.05), (u.rotation.y = 0.15)),
          e.add(u));
      }
    }
    let a = new R(
      new Te(1.6, 0.55),
      new be({
        map: ss(512, 176, (c) => {
          ((c.fillStyle = "#e60012"),
            c.fillRect(0, 0, 512, 176),
            (c.fillStyle = "#ffe100"),
            (c.font = "700 64px Mitr, sans-serif"),
            (c.textAlign = "center"),
            (c.textBaseline = "middle"),
            c.fillText("อาหารร้อน ๆ", 256, 62),
            (c.fillStyle = "#fff"),
            (c.font = "500 40px Mitr, sans-serif"),
            c.fillText(
              "เบนโตะ \xB7 ราเมง \xB7 นักเก็ต",
              256,
              132,
            ));
        }),
      }),
    );
    (s
      ? (a.position.set(i.keeperSpot.x - t.x, 2.45, i.D / 2 - 0.07), (a.rotation.y = Math.PI))
      : a.position.set(i.keeperSpot.x - t.x, 2.35, -i.D / 2 + 0.07),
      e.add(a));
  }
  function g6(i) {
    let e = [];
    for (let s of i.children) s.isInstancedMesh && e.push(s);
    let t = new Oe(),
      n = new J();
    ((n.userData.prodBake = !0), i.add(n));
    for (let s of e) {
      if (Array.isArray(s.material) || s.count === 0) continue;
      let o = s.geometry.index ? s.geometry.toNonIndexed() : s.geometry,
        r = [];
      for (let l = 0; l < s.count; l++) {
        s.getMatrixAt(l, t);
        let h = new qe();
        for (let f of ["position", "normal", "uv"]) {
          let d = o.getAttribute(f);
          d && h.setAttribute(f, d.clone());
        }
        (h.applyMatrix4(t), r.push(h));
      }
      let a = null;
      try {
        a = ip(r, !1);
      } catch {
        a = null;
      }
      if (!a) continue;
      let c = new R(a, s.material);
      (c.position.copy(s.position),
        c.quaternion.copy(s.quaternion),
        c.scale.copy(s.scale),
        (c.receiveShadow = s.receiveShadow),
        (c.castShadow = s.castShadow),
        n.add(c),
        i.remove(s));
    }
    return oo(n, !0);
  }
  function fA(i) {
    let e = i.group,
      t = i.origin,
      n = 4.6,
      s = new ee(1, 1, 1),
      o = new re(0.5, 0.5, 1, 10),
      r = i.decor ?? [],
      a = r.length * 9 + 1,
      c = new di(s, new X({ roughness: 0.55 }), a),
      l = new di(o, new X({ roughness: 0.3, metalness: 0.2 }), a),
      h = [15073298, 16769280, 42576, 1929176, 16742912, 16732067, 16777215, 9060305, 47043, 5978654],
      f = new Oe(),
      d = new At(),
      u = new H(),
      p = new H(),
      m = new ae(),
      E = 0,
      g = 0,
      y = 7,
      x = () => (y = (y * 16807) % 2147483647) / 2147483647,
      b = lA(i);
    for (let S of r) {
      let M = Math.sin(S.ry),
        T = Math.cos(S.ry),
        A = Math.cos(S.ry),
        F = -Math.sin(S.ry);
      if (!b)
        for (let C = 0; C < 9; C++) {
          let P = ((C % 5) - 2) * 0.17 + (x() - 0.5) * 0.03,
            I = (C < 5 ? 0.12 : -0.14) + (x() - 0.5) * 0.04;
          p.set(S.pos.x - t.x + A * P - M * I, S.pos.y, S.pos.z - t.z + F * P - T * I);
          let k = x() < 0.35,
            D = k ? 0.16 + x() * 0.14 : 0.18 + x() * 0.26;
          (k ? u.set(0.09, D, 0.09) : u.set(0.11 + x() * 0.06, D, 0.07 + x() * 0.05),
            (p.y += D / 2 + 0.04),
            d.setFromAxisAngle(new H(0, 1, 0), S.ry + (x() - 0.5) * 0.15),
            f.compose(p, d, u),
            m.setHex(h[Math.floor(x() * h.length)]),
            k ? (l.setMatrixAt(g, f), l.setColorAt(g++, m)) : (c.setMatrixAt(E, f), c.setColorAt(E++, m)));
        }
      if (S.level > 2 && x() < 0.8)
        for (let C = 0; C < 2; C++) {
          let P = new R(
            new ee(0.42 + x() * 0.2, 0.32 + x() * 0.12, 0.38),
            new X({ color: x() < 0.5 ? 13081186 : 14267004, roughness: 0.9 }),
          );
          (P.position.set(S.pos.x - t.x - M * 0.1, 2.45 + C * 0.36, S.pos.z - t.z - T * 0.1),
            (P.rotation.y = S.ry + (x() - 0.5) * 0.3),
            e.add(P));
        }
      if (S.level < 2 && x() < 0.5) {
        let C = new R(
          new Te(0.34, 0.34),
          new be({ map: gd([19, 29, 39, 49, 59, 99][Math.floor(x() * 6)]), transparent: !0, alphaTest: 0.3 }),
        );
        (C.position.set(S.pos.x - t.x + M * 0.36, S.pos.y + 0.55, S.pos.z - t.z + T * 0.36),
          (C.rotation.y = S.ry),
          e.add(C));
      }
    }
    ((c.count = E), (l.count = g), e.add(c, l));
    for (let S = 0; S < 14; S++) {
      let M = -6 + (S % 7) * 2,
        T = S < 7 ? -2.4 : 1.6,
        A = C4(S, !1),
        F = new J();
      for (let C of [0, Math.PI]) {
        let P = new R(new Te(1.35, 0.42), new be({ map: A }));
        ((P.rotation.y = C), (P.position.z = C ? -0.004 : 0.004), F.add(P));
      }
      (F.position.set(M + (S % 2) * 0.4, n - 0.95, T), (F.rotation.y = ((S % 3) - 1) * 0.35), e.add(F));
      for (let C of [-0.55, 0.55]) {
        let P = new R(new re(0.006, 0.006, 0.75, 4), new be({ color: 3355443 }));
        (P.position.set(C, 0.55, 0), F.add(P));
      }
    }
    let w = new be({ color: 16775404 }),
      v = new be({ color: 15073298 });
    for (let S = 0; S < 6; S++) {
      let M = new J(),
        T = new R(new we(0.28, 14, 10), w);
      ((T.scale.y = 1.15), M.add(T));
      for (let A of [-0.27, 0.27]) {
        let F = new R(new re(0.16, 0.16, 0.06, 14), v);
        ((F.position.y = A), M.add(F));
      }
      (M.position.set(6.6, n - 0.55 - (S % 2) * 0.1, -4.5 + S * 1.6), e.add(M));
    }
    let _ = new R(
      new Te(4.2, 0.9),
      new be({
        map: ss(1024, 220, (S) => {
          ((S.fillStyle = "#ffe100"),
            S.fillRect(0, 0, 1024, 220),
            (S.fillStyle = "#e60012"),
            S.fillRect(0, 0, 1024, 18),
            S.fillRect(0, 202, 1024, 18),
            (S.fillStyle = "#111"),
            (S.font = "700 120px Mitr, sans-serif"),
            (S.textAlign = "center"),
            (S.textBaseline = "middle"),
            S.fillText("ถูกจัง! ของเยอะ!", 512, 116));
        }),
      }),
    );
    if ((_.position.set(0, n - 0.75, -i.D / 2 + 0.07), e.add(_), (i.W ?? 0) > 15)) {
      let S = g6(e);
      for (let M of [...e.children]) M.userData.occOK && (S += g6(M));
      // หลังรวมเมช: ชิ้นที่ทั้งก้อนลอยอยู่กลางทางเดินกลางร้าน (รางเขียว + ผลไม้) → ลบทิ้ง
      {
        let M = new mt(),
          T = [];
        (e.updateMatrixWorld(!0),
          e.traverse((A) => {
            if (!A.isMesh || A.isInstancedMesh) return;
            M.setFromObject(A);
            let F = M.min.clone().sub(e.position),
              C = M.max.clone().sub(e.position);
            F.x > -1.3 && C.x < 1.3 && F.z > -0.3 && C.z < 0.8 && F.y > 0.4 && C.y < 1.1 && T.push(A);
          }));
        for (let A of T) A.parent?.remove(A);
        T.length && console.log(`[fix] เอาของลอยกลางร้านออก ${T.length} ชิ้น`);
      }
      console.log(
        `[perf] ร้านถูกจัง: รวมสินค้า ${S} ชิ้น`,
      );
    }
    if ((i.W ?? 0) <= 15)
      for (let S = 0; S < 5; S++) {
        let M = new R(
          new Te(0.7, 0.45),
          new be({
            map: ss(128, 80, (T) => {
              ((T.fillStyle = "#e60012"),
                T.beginPath(),
                T.moveTo(0, 20),
                T.lineTo(80, 20),
                T.lineTo(80, 0),
                T.lineTo(128, 40),
                T.lineTo(80, 80),
                T.lineTo(80, 60),
                T.lineTo(0, 60),
                T.fill());
            }),
            transparent: !0,
          }),
        );
        ((M.rotation.x = -Math.PI / 2),
          (M.rotation.z = Math.PI / 2),
          M.position.set(-1.2, 0.015, 4.5 - S * 1.6),
          e.add(M));
      }
  }
  var xt = new H(-45, 0, -64),
    da = 34,
    td = 34 * 0.767,
    eb = (i, e = 0) => Math.abs(i.x - xt.x) < da / 2 + 3 + e && Math.abs(i.z - xt.z) < td / 2 + 3 + e,
    fo = null;
  function uA() {
    if (ze("football")) {
      let n = je("football", 0.6);
      ((n.position.y = -0.3),
        n.traverse((o) => {
          let r = o;
          if (((r.castShadow = !0), !r.isMesh)) return;
          let a = r.material.clone(),
            c = a.map?.image;
          if (c && c.width) {
            let l = document.createElement("canvas");
            ((l.width = c.width), (l.height = c.height));
            let h = l.getContext("2d");
            h.drawImage(c, 0, 0);
            let f = h.getImageData(0, 0, l.width, l.height);
            for (let u = 0; u < f.data.length; u += 4) {
              let p = f.data[u],
                m = f.data[u + 1],
                E = f.data[u + 2];
              m > p + 20 &&
                ((f.data[u] = Math.min(255, m * 1.05 + 10)),
                (f.data[u + 1] = Math.round(p * 0.6 + m * 0.42)),
                (f.data[u + 2] = Math.round(E * 0.4)));
            }
            h.putImageData(f, 0, 0);
            let d = new ut(l);
            ((d.colorSpace = Ye),
              (d.flipY = a.map.flipY),
              (d.wrapS = a.map.wrapS),
              (d.wrapT = a.map.wrapT),
              (a.map = d));
          } else a.color.set(16742938);
          r.material = a;
        }));
      let s = new J();
      return (s.add(n), s);
    }
    let i = ss(512, 256, (n) => {
        ((n.fillStyle = "#fafafa"), n.fillRect(0, 0, 512, 256), (n.fillStyle = "#151515"));
        for (let s = 0; s < 4; s++)
          for (let o = 0; o < 8; o++) {
            let r = o * 64 + (s % 2) * 32 + 16,
              a = 32 + s * 64;
            n.beginPath();
            for (let c = 0; c < 5; c++) {
              let l = (c / 5) * Math.PI * 2 - Math.PI / 2;
              n.lineTo(r + Math.cos(l) * 17, a + Math.sin(l) * 17 * (s === 0 || s === 3 ? 0.7 : 1));
            }
            (n.closePath(), n.fill());
          }
      }),
      e = new R(
        new we(0.3, 24, 16),
        new X({ map: i, roughness: 0.4, emissive: 16777215, emissiveMap: i, emissiveIntensity: 0.18 }),
      );
    e.castShadow = !0;
    let t = new J();
    return (t.add(e), t);
  }
  var Yc = da * 0.4556,
    Kp = null;
  var k4 = [],
    tb = [];
  function pA(i, e) {
    let t = i.index ? i.toNonIndexed() : i.clone();
    for (let n = 0; n < e; n++) {
      let s = t.attributes.position.array,
        o = t.attributes.uv ? t.attributes.uv.array : null,
        r = t.attributes.normal ? t.attributes.normal.array : null,
        a = s.length / 9,
        c = new Float32Array(a * 36),
        l = o ? new Float32Array(a * 24) : null,
        h = r ? new Float32Array(a * 36) : null,
        f = (p, m, E, g, y) =>
          Array.from({ length: m }, (x, b) => (p[E * m + b] + p[g * m + b]) / 2)
            .concat([])
            .slice(0, m),
        d = 0;
      for (let p = 0; p < a; p++) {
        let m = p * 3,
          E = m + 1,
          g = m + 2,
          y = (b, w, v) => Array.from({ length: w }, (_, S) => b[v * w + S]),
          x = (b, w) => {
            let v = y(b, w, m),
              _ = y(b, w, E),
              S = y(b, w, g),
              M = f(b, w, m, E, 0),
              T = f(b, w, E, g, 0),
              A = f(b, w, g, m, 0);
            return [v, M, A, M, _, T, A, T, S, M, T, A];
          };
        (x(s, 3).forEach((b, w) => c.set(b, (d + w) * 3)),
          o && l && x(o, 2).forEach((b, w) => l.set(b, (d + w) * 2)),
          r && h && x(r, 3).forEach((b, w) => h.set(b, (d + w) * 3)),
          (d += 12));
      }
      let u = new qe();
      (u.setAttribute("position", new Je(c, 3)),
        l && u.setAttribute("uv", new Je(l, 2)),
        h && u.setAttribute("normal", new Je(h, 3)),
        (t = u));
    }
    return t;
  }
  function mA(i, e, t) {
    let n = Math.hypot(t.x, t.z);
    (i.hit.copy(e), i.dir.set(t.x, 0, t.z).normalize(), (i.amp = Math.min(0.75, 0.2 + n * 0.08)), (i.t = 0));
  }
  function gA(i) {
    let e = new Oe(),
      t = new H();
    for (let n of tb) {
      if (n.t > 3) continue;
      n.t += i;
      let s = n.amp * Math.exp(-n.t * 2.6) * Math.cos(n.t * 11);
      for (let o of n.nets) {
        let r = o.m.geometry.attributes.position,
          a = r.array;
        (e.copy(o.m.matrixWorld).invert(), t.copy(n.dir).transformDirection(e));
        let c = 1 / o.m.matrixWorld.getMaxScaleOnAxis();
        for (let l = 0; l < r.count; l++) {
          let h = o.world[l * 3] - n.hit.x,
            f = o.world[l * 3 + 1] - n.hit.y,
            d = o.world[l * 3 + 2] - n.hit.z,
            u = Math.exp(-(h * h + f * f + d * d) / 0.9) * s * c;
          ((a[l * 3] = o.base[l * 3] + t.x * u),
            (a[l * 3 + 1] = o.base[l * 3 + 1] + t.y * u),
            (a[l * 3 + 2] = o.base[l * 3 + 2] + t.z * u));
        }
        r.needsUpdate = !0;
      }
    }
  }
  function EA(i, e, t) {
    for (let n of tb) {
      let s = (e - n.x0) * n.side,
        o = t - xt.z,
        r = i.r ?? 0.3,
        a = (i.pos.x - n.x0) * n.side,
        c = i.pos.z - xt.z;
      if (
        a < -0.6 ||
        a > n.depth ||
        Math.abs(c) > n.w / 2 ||
        s < -0.2 ||
        s > n.depth + 0.6 ||
        Math.abs(o) > n.w / 2 + 0.6 ||
        (s < 0.05 && Math.abs(o) > n.w / 2 - 0.05)
      )
        continue;
      let l = !1;
      return (
        s > n.depth - r &&
          ((l = !0), (i.vel.x = -n.side * Math.abs(i.vel.x) * 0.12), (e = n.x0 + n.side * (n.depth - r))),
        s > 0 &&
          Math.abs(o) > n.w / 2 - r &&
          ((l = !0), (i.vel.z = -Math.sign(o) * Math.abs(i.vel.z) * 0.12), (t = xt.z + Math.sign(o) * (n.w / 2 - r))),
        l && (mA(n, new H(e, (i.y ?? 0) + r, t), new H(i.vel.x || n.side, 0, i.vel.z)), i.vel.multiplyScalar(0.5)),
        i.pos.set(e, 0, t),
        !0
      );
    }
    return !1;
  }
  function bA() {
    if (!ze("pitch_surface")) return;
    let i = je("pitch_surface");
    (i.scale.set(da, 1, da),
      i.position.set(xt.x, 0.03, xt.z),
      i.traverse((f) => {
        let d = f;
        if (((d.receiveShadow = !0), d.isMesh)) {
          let u = d.material;
          (u.color.setRGB(1.25, 1.3, 1.15), u.emissive.setHex(4877876), (u.emissiveIntensity = 0.55), (Kp = u));
        }
      }),
      K.add(i));
    let e = new R(new Te(da + 4, td + 4), new X({ color: 7651934, roughness: 1 }));
    ((e.rotation.x = -Math.PI / 2), e.position.set(xt.x, 0.02, xt.z), (e.receiveShadow = !0), K.add(e));
    let t = (f) =>
        ss(512, 64, (d) => {
          let u = [
            ["#1a7fa6", "#fff"],
            ["#ffe100", "#e60012"],
            ["#e60012", "#fff"],
            ["#2e7d32", "#fff"],
          ][f % 4];
          ((d.fillStyle = u[0]),
            d.fillRect(0, 0, 512, 64),
            (d.fillStyle = u[1]),
            (d.font = "700 40px Mitr, sans-serif"),
            (d.textAlign = "center"),
            (d.textBaseline = "middle"),
            d.fillText(
              [
                "ChowChowStory FC",
                "ถูกจัง! มาร์ท",
                "ไก่ย่างลุงปั้ม",
                "ร้านเชาเชา",
              ][f % 4],
              256,
              34,
            ));
        }),
      n = da / 2 + 2.4,
      s = td / 2 + 1.2,
      o = [];
    for (let f = -n; f < n - 0.1; f += 4)
      (o.push([xt.x + f + 2, xt.z - s, 4, 0, 0]), Math.abs(f + 2) > 3.2 && o.push([xt.x + f + 2, xt.z + s, 4, 0, 1]));
    for (let f = -s; f < s - 0.1; f += 4)
      (o.push([xt.x - n, xt.z + f + 2, 4, 1, 2]), o.push([xt.x + n, xt.z + f + 2, 4, 1, 3]));
    o.forEach(([f, d, u, p, m], E) => {
      let g = new R(new ee(p ? 0.12 : u - 0.06, 0.7, p ? u - 0.06 : 0.12), [
        new X({ color: 546 }),
        new X({ color: 546 }),
        new X({ color: 546 }),
        new X({ color: 546 }),
        new be({ map: t(E + m) }),
        new be({ map: t(E + m + 1) }),
      ]);
      (p &&
        (g.material = [
          new be({ map: t(E) }),
          new be({ map: t(E + 1) }),
          ...[0, 1, 2, 3].map(() => new X({ color: 546 })),
        ]),
        g.position.set(f, 0.35, d),
        (g.castShadow = !0),
        K.add(g),
        pt.push({ x: f, z: d, hw: p ? 0.1 : u / 2, hd: p ? u / 2 : 0.1, low: !0 }));
    });
    let r = 4.2;
    for (let f of [-1, 1]) {
      let d = je("soccer_goal"),
        u = new mt().setFromObject(d),
        p = u.getSize(new H()),
        m = r / p.x;
      d.scale.multiplyScalar(m);
      let E = 0,
        g = 0;
      (d.updateMatrixWorld(!0),
        d.traverse((_) => {
          let S = _;
          if (!S.isMesh) return;
          let M = S.geometry.attributes.position;
          for (let T = 0; T < M.count; T += 3) {
            let A = new H().fromBufferAttribute(M, T).applyMatrix4(S.matrixWorld);
            A.y > p.y * m * 0.93 && ((E += A.z), g++);
          }
        }));
      let y = (g && Math.sign(E / g)) || 1,
        x = p.z * m,
        b = new J();
      (b.add(d),
        (b.rotation.y = f * (y > 0 ? -Math.PI / 2 : Math.PI / 2)),
        b.position.set(xt.x + f * (Yc + x / 2), 0.03, xt.z),
        K.add(b),
        b.updateMatrixWorld(!0));
      let w = [];
      (d.traverse((_) => {
        let S = _;
        if (!S.isMesh) return;
        let M = S.material;
        if (!M.map) {
          let k = M.clone();
          (k.color.set(16777215),
            (k.emissive = new ae(16777215)),
            (k.emissiveIntensity = 0.18),
            (k.roughness = 0.35),
            (k.metalness = 0.1),
            (S.material = k));
          return;
        }
        let T = pA(S.geometry, 2);
        S.geometry = T;
        let A = M.clone();
        (A.color.set(16777215), (A.side = Ke), (S.material = A));
        let F = T.attributes.position,
          C = new Float32Array(F.array),
          P = new Float32Array(F.count * 3),
          I = new H();
        for (let k = 0; k < F.count; k++)
          (I.fromBufferAttribute(F, k).applyMatrix4(S.matrixWorld),
            (P[k * 3] = I.x),
            (P[k * 3 + 1] = I.y),
            (P[k * 3 + 2] = I.z));
        w.push({ m: S, base: C, world: P });
      }),
        tb.push({
          side: f,
          x0: xt.x + f * Yc,
          depth: x,
          w: r,
          h: p.y * m,
          nets: w,
          hit: new H(),
          dir: new H(),
          amp: 0,
          t: 9,
        }));
      let v = xt.x + f * (Yc + x);
      pt.push({ x: v, z: xt.z, hw: 0.08, hd: r / 2, low: !0 });
      for (let _ of [-1, 1])
        pt.push({ x: xt.x + f * (Yc + x / 2), z: xt.z + (_ * r) / 2, hw: x / 2, hd: 0.08, low: !0 });
    }
    if (ze("stadium_light"))
      for (let f of [-1, 1])
        for (let d of [-1, 1]) {
          let u = xt.x + f * (da / 2 + 4.8),
            p = xt.z + d * (td / 2 + 3.2),
            m = je("stadium_light"),
            E = xt.x - u,
            g = xt.z - p;
          ((m.rotation.y = Math.atan2(-g, E)),
            m.position.set(u, 0, p),
            m.traverse((_) => {
              let S = _;
              if (S.isMesh && ((S.castShadow = !0), S.material.name === "flood_lens")) {
                let M = S.material.clone();
                ((S.material = M), k4.push(M));
              }
            }),
            K.add(m),
            pt.push({ x: u, z: p, hw: 0.3, hd: 0.3 }));
          let y = new H(u + Math.sign(E) * 0.3, 11, p + Math.sign(g) * 0.3),
            x = new H(xt.x - f * 3, 0, xt.z - d * 2),
            b = y.distanceTo(x),
            w = ZE(b, 0.9, 7.5, 15922943, 0.06),
            v = y.clone().add(x).multiplyScalar(0.5);
          (w.position.copy(v), w.quaternion.setFromUnitVectors(new H(0, 1, 0), y.clone().sub(x).normalize()), K.add(w));
        }
    for (let f of [-1, 1])
      for (let d of [-1, 1]) {
        let u = new En(15791359, 0, 30, 1);
        (u.position.set(xt.x + f * da * 0.25, 7, xt.z + d * td * 0.25), K.add(u), H0.push({ l: u, on: 32 }));
      }
    let a = ss(512, 160, () => {}),
      c = new R(new Te(4.4, 1.4), new be({ map: a }));
    (c.position.set(xt.x, 3.2, xt.z - s - 0.6), K.add(c));
    for (let f of [-1.9, 1.9]) {
      let d = new R(new re(0.08, 0.08, 3.2, 8), new X({ color: 1365 }));
      (d.position.set(xt.x + f, 1.6, xt.z - s - 0.65), K.add(d));
    }
    if ((pt.push({ x: xt.x, z: xt.z - s - 0.65, hw: 2, hd: 0.15, low: !0 }), ze("Bench_01") || ze("bench")))
      for (let f of [-8, 8]) {
        let d = je(ze("Bench_01") ? "Bench_01" : "bench", 1.6);
        (d.position.set(xt.x + f, 0, xt.z + s + 2.2),
          (d.rotation.y = Math.PI),
          K.add(d),
          pt.push({ x: xt.x + f, z: xt.z + s + 2.2, hw: 0.9, hd: 0.3 }));
      }
    ccsFieldPath(s);
    let l = uA();
    K.add(l);
    let h = { m: l, pos: xt.clone(), vel: new H(), y: 0, vy: 0, r: 0.3 };
    (_d.push(h), (fo = { ball: h, score: [0, 0], cool: 0, out: 0, board: c, boardTex: a }), P4());
  }
  // v82: ทางเดินปูหินจากทางเท้าถนนใหญ่ เข้าช่องประตูสนามฝั่งใต้ + ป้ายทางเข้า
  function ccsFieldPath(i) {
    let e = xt.z + i - 0.3,
      t = -Mt + 0.2,
      n = t - e,
      s = ss(128, 256, (a) => {
        ((a.fillStyle = "#cfc6b4"), a.fillRect(0, 0, 128, 256));
        for (let c = 0; c < 8; c++)
          for (let l = 0; l < 4; l++) {
            let h = (c % 2) * 16;
            ((a.fillStyle = ["#d9d1bf", "#c4baa5", "#d3c9b3", "#bdb39e"][(c * 3 + l) % 4]), a.fillRect(l * 32 + h - 14, c * 32 + 2, 28, 28));
          }
      });
    ((s.wrapS = s.wrapT = 1e3), s.repeat.set(1, n / 3), (s.anisotropy = 4));
    let o = new R(new Te(3, n), new X({ map: s, roughness: 0.95 }));
    ((o.rotation.x = -Math.PI / 2), o.position.set(xt.x, 0.035, (e + t) / 2), (o.receiveShadow = !0), (o.userData.noOcc = !0), K.add(o));
    let r = new X({ color: 9605778, roughness: 0.9 });
    for (let a of [-1.62, 1.62]) {
      let c = new R(new ee(0.16, 0.12, n), r);
      (c.position.set(xt.x + a, 0.06, (e + t) / 2), (c.userData.noOcc = !0), K.add(c));
    }
    // v83: ซุ้มประตูทางเข้าสนาม (เสาไม้ 2 ต้นคร่อมทางเดิน + ป้ายโค้ง) ไม่ล้นไปชนตู้คีบ
    let a = new X({ color: 16777215, roughness: 0.5 }),
      c = new X({ color: 1527636, roughness: 0.6 });
    for (let f of [-1.8, 1.8]) {
      let d = new R(new re(0.1, 0.12, 3.3, 12), a);
      (d.position.set(xt.x + f, 1.65, t - 1.2), (d.castShadow = !0), K.add(d));
      let u = new R(new re(0.17, 0.17, 0.16, 12), c);
      (u.position.set(xt.x + f, 0.08, t - 1.2), K.add(u), pt.push({ x: xt.x + f, z: t - 1.2, hw: 0.14, hd: 0.14 }));
      let m = new R(new we(0.15, 14, 10), new X({ color: 16769280, roughness: 0.4, metalness: 0.2 }));
      (m.position.set(xt.x + f, 3.38, t - 1.2), K.add(m));
    }
    let l = ss(768, 160, (f) => {
        let d = f.createLinearGradient(0, 0, 0, 160);
        (d.addColorStop(0, "#1f8a4c"), d.addColorStop(1, "#126b38"), (f.fillStyle = d), f.beginPath(), f.roundRect(0, 0, 768, 160, 34), f.fill());
        ((f.strokeStyle = "#ffffff"), (f.lineWidth = 8), f.beginPath(), f.roundRect(10, 10, 748, 140, 26), f.stroke());
        ((f.strokeStyle = "rgba(255,255,255,.18)"), (f.lineWidth = 3));
        for (let u = 0; u < 768; u += 48) (f.beginPath(), f.moveTo(u, 14), f.lineTo(u + 24, 146), f.stroke());
        ((f.fillStyle = "#fff"), (f.textAlign = "center"), (f.textBaseline = "middle"), (f.font = "700 64px Mitr, sans-serif"), f.fillText("สนามฟุตบอล", 384, 66));
        ((f.font = "600 30px Mitr, sans-serif"), (f.fillStyle = "#ffe100"), f.fillText("ChowChowStory FC", 384, 122));
        ((f.font = "64px sans-serif"), f.fillText("⚽", 66, 82), f.fillText("⚽", 702, 82));
      }),
      h = new R(new ee(3.9, 0.82, 0.08), [c, c, c, c, new be({ map: l }), new be({ map: l })]);
    (h.position.set(xt.x, 3.0, t - 1.2), (h.userData.noOcc = !0), K.add(h));
  }
  // v82: เสียงนกหวีดกรรมการ (สังเคราะห์: นกหวีดมีลูกกลิ้ง = เสียงสูง ~3kHz สั่นรัวเร็ว + ลมหายใจ)
  function ccsWhistle(i) {
    let e = _i();
    if (!e || z.sound === !1) return;
    let t = e.currentTime + 0.02,
      n = i === "goal" ? [[0, 0.22], [0.32, 0.22], [0.66, 1.1]] : i === "end" ? [[0, 0.5], [0.65, 0.5], [1.3, 1.4]] : [[0, 0.45]],
      s = e.createGain();
    ((s.gain.value = 0.16), s.connect(e.destination));
    for (let [o, r] of n) {
      let a = t + o,
        c = e.createGain();
      (c.gain.setValueAtTime(0, a), c.gain.linearRampToValueAtTime(1, a + 0.025), c.gain.setValueAtTime(1, a + r - 0.06), c.gain.linearRampToValueAtTime(0, a + r), c.connect(s));
      for (let [l, h] of [
        [2850, 0.7],
        [3010, 0.45],
      ]) {
        let f = e.createOscillator(),
          d = e.createGain(),
          u = e.createOscillator(),
          p = e.createGain();
        ((f.type = "sine"), (f.frequency.value = l), (u.frequency.value = 38 + Math.random() * 6), (p.gain.value = 170), u.connect(p), p.connect(f.frequency), (d.gain.value = h), f.connect(d), d.connect(c), f.start(a), u.start(a), f.stop(a + r + 0.02), u.stop(a + r + 0.02));
      }
      let l = e.createBuffer(1, Math.ceil(e.sampleRate * r), e.sampleRate),
        h = l.getChannelData(0);
      for (let m = 0; m < h.length; m++) h[m] = Math.random() * 2 - 1;
      let f = e.createBufferSource(),
        d = e.createBiquadFilter(),
        u = e.createGain();
      ((f.buffer = l), (d.type = "bandpass"), (d.frequency.value = 3200), (d.Q.value = 2.5), (u.gain.value = 0.18), f.connect(d), d.connect(u), u.connect(c), f.start(a));
    }
  }
  // v83: กติกาบอล: ป้ายรอบสนามกันบอล (เด้งกลับ), บอลออกเส้นข้าง = ลูกทุ่ม, ออกเส้นหลัง = เตะมุม พร้อมนกหวีด
  var ccsZH = 12;
  function ccsBallRules(i, e, t, n) {
    let s = e.pos.x - xt.x,
      o = e.pos.z - xt.z,
      r = da / 2 + 2.4 - 0.32,
      a = td / 2 + 1.2 - 0.32;
    if (Math.abs(s) < r + 4 && Math.abs(o) < a + 4) {
      (Math.abs(s) > r && ((e.pos.x = xt.x + Math.sign(s) * r), (e.vel.x = -e.vel.x * 0.45)),
        Math.abs(o) > a && ((e.pos.z = xt.z + Math.sign(o) * a), (e.vel.z = -e.vel.z * 0.45)));
      ((s = e.pos.x - xt.x), (o = e.pos.z - xt.z));
    } else {
      ((i.out += n), i.out > 8 && (e.pos.copy(xt), e.vel.set(0, 0, 0), (i.out = 0), (i.dead = null)));
      return;
    }
    if (((i.out = 0), i.dead)) {
      if ((i.dead.t -= n) <= 0) {
        let c = i.dead;
        ((i.dead = null), e.pos.copy(c.p), e.vel.set(0, 0, 0), (e.vy = 0), (e.y = 0.2), (i.rc = 2), rt(c.m, c.p.clone().setY(1.6), "big"));
      }
      return;
    }
    if (i.cool > 0 || (i.rc = (i.rc ?? 0) - n) > 0) return;
    let l = t.pos.distanceTo(e.pos) < 50;
    if (Math.abs(o) > ccsZH + 0.15) {
      let c = Math.max(-Yc + 0.6, Math.min(Yc - 0.6, s));
      ((i.dead = { t: 1.3, p: new H(xt.x + c, 0, xt.z + Math.sign(o) * (ccsZH - 0.45)), m: "🙌 ลูกทุ่ม!" }), l && (ccsWhistle("out"), rt("📣 บอลออกข้าง!", e.pos.clone().setY(2), "bad")));
    } else if (Math.abs(s) > Yc + 0.15 && !(Math.abs(o) < 2 && Math.abs(s) < Yc + 3)) {
      ((i.dead = { t: 1.3, p: new H(xt.x + Math.sign(s) * (Yc - 0.35), 0, xt.z + Math.sign(o || 1) * (ccsZH - 0.35)), m: "🚩 เตะมุม!" }), l && (ccsWhistle("out"), rt("📣 บอลออกหลัง!", e.pos.clone().setY(2), "bad")));
    }
  }
  function P4() {
    if (!fo) return;
    let e = fo.boardTex.image.getContext("2d");
    ((e.fillStyle = "#111"),
      e.fillRect(0, 0, 512, 160),
      (e.strokeStyle = "#ffe100"),
      (e.lineWidth = 8),
      e.strokeRect(4, 4, 504, 152),
      (e.fillStyle = "#fff"),
      (e.font = "700 30px Mitr, sans-serif"),
      (e.textAlign = "center"),
      e.fillText("ทีมเชาเชา", 120, 42),
      e.fillText("ทีมเมือง", 392, 42),
      (e.fillStyle = "#ffe100"),
      (e.font = "700 84px Mitr, sans-serif"),
      e.fillText(`${fo.score[0]}  :  ${fo.score[1]}`, 256, 130),
      (fo.boardTex.needsUpdate = !0));
  }
