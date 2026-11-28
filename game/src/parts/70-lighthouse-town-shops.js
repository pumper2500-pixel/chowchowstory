  var E6 = -Math.PI / 2;
  function MA() {
    if (!ze("k_umbrella")) return;
    let i = (t, n, s, o, r, a, c = 0) => {
      if (!ze(t)) return null;
      let l = je(t, r);
      return (
        l.position.set(n, zo(n, s) - 0.02 + c, s),
        (l.rotation.y = o),
        l.traverse((h) => {
          ((h.castShadow = !0), (h.receiveShadow = !0));
        }),
        K.add(l),
        a && pt.push({ x: n, z: s, hw: a[0], hd: a[1] }),
        l
      );
    };
    [-138, -122, -68, -50, -28, 18, 34, 58, 92, 118, 136].forEach((t, n) => {
      let s = Rt - 5.2 - (n % 3) * 0.7,
        o = Math.sin(n * 12.9898) * 0.5 + 0.5;
      (i("k_umbrella", t, s, o * 6, 4.4, [0.18, 0.18]),
        i("k_chair", t - 1, s + 0.4, E6, 2, [0.4, 0.95]),
        n % 2 === 0 && i("k_chair", t + 1.1, s + 0.4, E6, 2, [0.4, 0.95]),
        n % 3 === 0 && i("k_surf", t + 2.6, s - 1, 0.4 + o, 2.1, [0.15, 0.15], -0.25),
        n % 3 === 1 && i("k_ring", t + 2.2, s + 0.6, o * 3, 0.85),
        n % 2 === 1 && i("k_castle", t - 2.8, s + 2, o * 2, 0.75, [0.3, 0.3]),
        n % 4 === 2 && i("b_towel2", t + 2.4, s + 1.6, o, void 0, void 0, 0.01),
        i("k_shells", t + (o - 0.5) * 3, s + 2.6, o * 6, 4.2));
    });
  }
  // v81: ประภาคารบนเกาะเล็กกลางทะเล (โมเดล Lighthouse) · ลำแสงหมุนตอนกลางคืน
  var ccsLH = { g: null, beam: null, glow: null, lampM: null, t: 0 };
  function ccsLighthouse() {
    if (ccsLH.g || !ze("lighthouse")) return;
    let i = new J();
    (i.position.set(41, 0, Rt + 94), K.add(i)); // v82: ไกลออกไปอีก ~20%
    let e = (d, u) => {
        let p = d.attributes.position,
          m = new H();
        for (let E = 0; E < p.count; E++) (m.fromBufferAttribute(p, E), m.y > -7 && (m.x += (Math.sin(E * 12.9898) * 43758.5453 % 1) * u, m.z += (Math.cos(E * 78.233) * 12543.123 % 1) * u), p.setXYZ(E, m.x, m.y, m.z));
        return (d.computeVertexNormals(), d);
      },
      t = new R(e(new re(6.2, 9.5, 9, 16, 3), 0.6), new X({ color: 8483924, roughness: 0.95, flatShading: !0 }));
    ((t.position.y = -3.6), i.add(t));
    let n = new R(new re(8.6, 9.2, 0.6, 28), new X({ color: 15125412, roughness: 1 }));
    ((n.position.y = 0.05), i.add(n));
    let s = new R(e(new re(5.4, 6.3, 1.2, 16, 1), 0.25), new X({ color: 7380820, roughness: 0.95, flatShading: !0 }));
    ((s.position.y = 1.0), i.add(s));
    let o = new X({ color: 9078660, roughness: 0.9, flatShading: !0 });
    for (let d = 0; d < 11; d++) {
      let u = (d / 11) * Math.PI * 2 + Math.sin(d * 3.1) * 0.3,
        p = 6.4 + Math.sin(d * 7.7) * 1.2,
        m = new R(new Ps(0.7 + Math.abs(Math.sin(d * 2.3)) * 1.1, 0), o);
      (m.position.set(Math.cos(u) * p, 0.3, Math.sin(u) * p), m.rotation.set(d, d * 2, d * 3), m.scale.y = 0.7, i.add(m));
    }
    // ต้นมะพร้าว 2 ต้น (ใช้โมเดลในเกมถ้ามี)
    for (let [d, u, p] of [
      [-3.2, 2.4, 0.4],
      [3.4, -2.2, 2.1],
    ])
      if (ze("coconut_palm")) {
        let m = je("coconut_palm", 5.5);
        (m.position.set(d, 1.6, u), (m.rotation.y = p), i.add(m));
      }
    let r = je("lighthouse", 15);
    (r.position.set(0, 1.55, 0), i.add(r));
    let a = 0;
    (r.updateMatrixWorld(!0),
      r.traverse((d) => {
        let u = d;
        if (!u.isMesh) return;
        ((u.castShadow = !1), (u.receiveShadow = !1));
        for (let p of Array.isArray(u.material) ? u.material : [u.material])
          /LampGlass|Window/.test(p.name) && ((p.emissive = new ae(16766336)), (p.emissiveIntensity = 0.2), (p.toneMapped = !1), /LampGlass/.test(p.name) && (ccsLH.lampM = p));
        if (u.name === "Lamp" || /LampGlass/.test(u.material?.name ?? "")) {
          let p = new mt().setFromObject(u);
          a = Math.max(a, (p.min.y + p.max.y) / 2 - i.position.y);
        }
      }));
    a || (a = 1.55 + 15 * 0.74);
    // ลำแสง: กรวยใส 2 อัน หันออกคนละทาง หมุนรอบเสา
    let c = document.createElement("canvas");
    ((c.width = 4), (c.height = 128));
    let l = c.getContext("2d"),
      h = l.createLinearGradient(0, 0, 0, 128);
    (h.addColorStop(0, "#ffffff"), h.addColorStop(0.3, "#4a4a4a"), h.addColorStop(0.72, "#000000"), h.addColorStop(1, "#000000"), (l.fillStyle = h), l.fillRect(0, 0, 4, 128));
    let f = new X({ color: 16775880, emissive: 16775880, emissiveIntensity: 1, alphaMap: new ut(c), transparent: !0, opacity: 0, depthWrite: !1, blending: $i, side: Ke, fog: !1, toneMapped: !1 }),
      g = new J();
    g.position.set(0, a, 0);
    for (let d of [1, -1]) {
      let u = new re(0.25, 5.5, 75, 20, 1, !0);
      u.translate(0, -37.5, 0);
      let p = new R(u, f);
      ((p.rotation.z = (d * Math.PI) / 2), (p.rotation.x = 0), (p.userData.noOcc = !0), (p.frustumCulled = !1), g.add(p));
    }
    i.add(g);
    let y = new zi(new vi({ map: CC, color: 16771776, transparent: !0, opacity: 0.9, depthWrite: !1, blending: $i, fog: !1 }));
    (y.scale.setScalar(7), y.position.set(0, a, 0), (y.userData.noOcc = !0), i.add(y));
    ((ccsLH.g = i), (ccsLH.beam = g), (ccsLH.beamM = f), (ccsLH.glow = y));
  }
  function ccsLighthouseTick(i) {
    if (!ccsLH.g) return;
    let e = 1 - Math.min(1, Math.max(0, (Math.sin((j.time - 0.25) * Math.PI * 2) + 0.15) * 3));
    ((ccsLH.t += i), (ccsLH.beam.rotation.y = ccsLH.t * 0.7), (ccsLH.beam.visible = e > 0.02 && !Se), (ccsLH.beamM.opacity = 0.42 * e));
    ((ccsLH.glow.material.opacity = 0.25 + e * 0.75 * (0.8 + 0.2 * Math.sin(ccsLH.t * 6))), ccsLH.glow.scale.setScalar(4 + e * 6));
    ccsLH.lampM && (ccsLH.lampM.emissiveIntensity = 0.2 + e * 2.5);
  }
  // v112: ทางเท้าใหม่จากโมเดล Sidewalk (บล็อกปูถนน + แถบอิฐแดง + ขอบคันหิน + รางหินคิวบ์)
  var ccsOldSW;
  function ccsSidewalk() {
    let i = vp.sidewalk_tex,
      e = null;
    if ((i?.traverse((d) => d.isMesh && !e && (e = d.material)), !e?.map)) return;
    let t = e.map.clone();
    ((t.wrapS = gn), (t.wrapT = Fi), (t.anisotropy = 8), (t.needsUpdate = !0));
    let n = new X({ map: t, roughness: 0.92, metalness: 0 }),
      s = 340,
      o = 0.7;
    for (let d of [-1, 1]) {
      let u = [],
        p = [],
        m = [],
        E = [],
        g = (y, x, b, w, v, _, S) => {
          // แถบยาวตามแกน x: (z0,y0,v0) → (z1,y1,v1)
          let M = u.length / 3;
          for (let [T, A, F] of [
            [-s / 2, y, v],
            [s / 2, y, v],
            [s / 2, x, _],
            [-s / 2, x, _],
          ])
            (u.push(T, A, 0), p.push(T * o, F));
          let T = u.length / 3 - 4;
          ((u[T * 3 + 2] = b), (u[(T + 1) * 3 + 2] = b), (u[(T + 2) * 3 + 2] = w), (u[(T + 3) * 3 + 2] = w));
          let A = S ? [0, 0, 1] : [0, 1, 0];
          for (let F = 0; F < 4; F++) m.push(A[0], A[1], A[2] * -d);
          d > 0 ? E.push(M, M + 2, M + 1, M, M + 3, M + 2) : E.push(M, M + 1, M + 2, M, M + 2, M + 3);
        },
        y = vn,
        x = vn + 0.3,
        b = vn + 0.52,
        w = vn + Xc + 0.05;
      (g(0.025, 0.025, d * y, d * x, 0.99, 0.845, !1), g(0.025, 0.065, d * x, d * x, 0.845, 0.812, !0), g(0.065, 0.065, d * x, d * b, 0.81, 0.772, !1), g(0.065, 0.065, d * b, d * w, 0.77, 0.045, !1));
      let v = new qe();
      (v.setAttribute("position", new Fe(u, 3)), v.setAttribute("normal", new Fe(m, 3)), v.setAttribute("uv", new Fe(p, 2)), v.setIndex(E), v.computeBoundingSphere());
      let _ = new R(v, n);
      ((_.receiveShadow = !0), K.add(_));
    }
    for (let d of ccsOldSW ?? []) d.visible = !1;
  }
  function TA() {
    (ccsSidewalk(), ccsLighthouse(), ccsFerris(), ccsVolcano(), ccsStall && Cr && ((ccsStall.position.y = Math.max(0, Cr.heightAt(od.x, od.z))), (od.y = ccsStall.position.y)), ccsStallExtras());
    if ((IH(), ze("rb_garden"))) {
      ccsGardenModel();
      for (let d = 0; d < yd; d++) T0(d);
      PC();
    }
    if (ze("zfountain_0")) {
      let d = je("zfountain_0");
      (d.scale.multiplyScalar(xr),
        d.traverse((u) => {
          ((u.castShadow = !0), (u.receiveShadow = !0));
        }),
        d0.useModel(d, 2.75 * xr, -0.12, {
          rimR: 3.55 * xr,
          rimY: 0.5 * xr,
          midR: 1.6 * xr,
          midY: 1.1 * xr,
          poolR: 3.75 * xr,
          poolY: 0.2 * xr,
        }));
    } else if (ze("fountain")) {
      let d = je("fountain");
      (d.traverse((u) => {
        ((u.castShadow = !0), (u.receiveShadow = !0));
      }),
        d0.useModel(d, 3.46, -0.2));
    }
    let i = ze("beach_house");
    (i && yA(), MA(), bA());
    let e = ze("cottage");
    if (!i && (e || ze("house_003"))) {
      let d = e ? je("cottage", 7.4) : je("house_003", 7.2);
      (d.position.set(Ut.x, 0, Ut.z + 2.9), (d.rotation.y = e ? Math.PI : xk), K.add(d), d.updateMatrixWorld(!0));
      let p = new Ls(new H(Ut.x, 1, Ut.z - 12), new H(0, 0, 1)).intersectObject(d, !0)[0],
        m = p ? p.point.z : Ut.z + 0.4,
        E = e ? Ut.x + 0.93 : Ut.x;
      if (e) {
        let y = new R(
          new Te(1.4, 0.32),
          new be({
            map: ei(
              "🏠 บ้านข้าวต้ม",
              16774885,
              11875210,
              512,
              110,
            ),
          }),
        );
        (y.position.set(E, 2.85, m - 0.06), (y.rotation.y = Math.PI), K.add(y));
      } else {
        let y = g3("บ้านข้าวต้ม");
        (y.position.set(Ut.x, 0, m - 0.03), K.add(y));
      }
      mo.set(E, 0, m - 1.1);
      let g = new X({ color: 14275267, roughness: 0.95 });
      for (let y = m - 1.4, x = 0; y > Mt + 0.3; y -= 0.95, x++) {
        let b = new R(new re(0.42 + (x % 3) * 0.04, 0.46, 0.08, 9), g);
        (b.position.set(Ut.x + (x % 2 ? 0.18 : -0.18), 0.04, y), (b.rotation.y = x), (b.receiveShadow = !0), K.add(b));
      }
      for (let y of [m - 3.5, m - 7.5])
        for (let x of [-1.1, 1.1]) {
          let b = new R(new re(0.05, 0.06, 0.7, 8), new X({ color: 2829099 }));
          (b.position.set(Ut.x + x, 0.35, y), K.add(b));
          let w = new R(new we(0.12, 10, 8), new be({ color: 16773568 }));
          (w.position.set(Ut.x + x, 0.75, y), K.add(w), YE.push(w.material));
        }
    }
    if (!i) {
      let d = p3("บ้านข้าวต้ม 🐾");
      (d.position.set(Ut.x, 0, Ut.z + 0.2), K.add(d));
    }
    if (
      ((Rn = MM(K, new H(620, 0, 760), VE.texture)),
      WE.set(
        Rn,
        i ? iE(new H(mo.x, 0, Ut.z + 1.1), 1, 16, 4.2, 3) : iE(mo.clone().add(new H(0, 0, 1.1)), -1, 16, 4.2, 1.2),
      ),
      (_4 = Rn.cabinet),
      H1(),
      (ed = TM(
        () =>
          ze("leg_0")
            ? je("leg_0", 0.2)
            : ze("Meat_on_Bone")
              ? je("Meat_on_Bone", 0.2)
              : (pi.find((d) => d.name === "น่องไก่") ?? pi[0]).make(),
        ze("roast") ? () => je("roast", 0.42) : void 0,
      )),
      ed.group.position.copy(fn),
      (ed.group.rotation.y = Math.PI),
      K.add(ed.group),
      pt.push({ x: fn.x, z: fn.z, hw: 1.45, hd: 0.7 }),
      ze("food_rice"))
    ) {
      let d = new X({ map: Cn(13208139, "#8a5a2b"), roughness: 0.7 }),
        u = new J(),
        p = new R(new ee(1.5, 0.78, 1), d);
      ((p.position.y = 0.39), u.add(p));
      let m = new R(new ee(1.62, 0.07, 1.12), new X({ color: 16774885, roughness: 0.5 }));
      ((m.position.y = 0.81), u.add(m));
      let E = new R(new ee(1.52, 0.3, 0.02), new X({ color: 14829119, roughness: 0.8 }));
      (E.position.set(0, 0.62, 0.51), u.add(E));
      {
        let y = new X({ color: 14081506, roughness: 0.25, metalness: 0.85 }),
          x = new X({ color: 16777215, roughness: 0.05, transparent: !0, opacity: 0.16, depthWrite: !1, side: Ke }),
          b = 1.4,
          w = 0.78,
          v = 0.66,
          _ = 0.845,
          S = new J();
        ((S.position.y = _), u.add(S));
        let M = (C, P, I, k, D, L, q) => {
          let $ = new R(new ee(C, P, I), k);
          return ($.position.set(D, L, q), S.add($), $);
        };
        (M(b, 0.04, w, y, 0, 0.02, 0), M(b, 0.03, w, y, 0, v, 0));
        for (let C of [-1, 1])
          for (let P of [-1, 1]) M(0.03, v, 0.03, y, C * (b / 2 - 0.015), v / 2, P * (w / 2 - 0.015));
        let T = M(b - 0.06, 0.015, w - 0.06, x, 0, 0.36, 0);
        T.renderOrder = 2;
        for (let [C, P, I, k, D] of [
          [b, v - 0.04, 0, w / 2, 0],
          [b, v - 0.04, 0, -w / 2, 0],
          [w, v - 0.04, -b / 2, 0, Math.PI / 2],
          [w, v - 0.04, b / 2, 0, Math.PI / 2],
        ]) {
          let L = new R(new Te(C, P), x);
          (L.position.set(I, 0.02 + (v - 0.04) / 2 + 0.02, k), (L.rotation.y = D), (L.renderOrder = 3), S.add(L));
        }
        let A = M(
            b - 0.1,
            0.02,
            0.06,
            new X({ color: 16756832, emissive: new ae(16751162), emissiveIntensity: 1.6 }),
            0,
            v - 0.03,
            0,
          ),
          F = new En(16756848, 1.2, 1.6, 2);
        (F.position.set(0, v - 0.1, 0), S.add(F));
        for (let [C, P, I, k] of [
          [-0.34, 0.04, -0.12, 0.1],
          [0.34, 0.04, -0.14, -0.15],
          [-0.34, 0.375, 0.08, -0.05],
          [0.34, 0.375, 0.06, 0.2],
        ]) {
          let D = je("food_rice", 0.36);
          (D.position.set(C, P, I), (D.rotation.y = k), S.add(D));
        }
      }
      let g = new R(
        new Te(1.3, 0.36),
        new be({
          map: ei(
            "ข้าวอบไก่ย่าง 45฿",
            16774885,
            14829119,
            512,
            140,
          ),
        }),
      );
      (g.position.set(0, 0.5, 0.525),
        u.add(g),
        u.position.set(fn.x + 2.3, 0, fn.z),
        (u.rotation.y = Math.PI),
        u.traverse((y) => {
          ((y.castShadow = !0), (y.receiveShadow = !0));
        }),
        K.add(u),
        pt.push({ x: fn.x + 2.3, z: fn.z, hw: 0.8, hd: 0.55 }));
    }
    {
      let d = ["Bread_1", "Bread_2", "Bread_3"].filter((g) => ze(g)),
        u = wM((g) => (g % 2 === 0 || !d.length ? _M(0.3) : je(d[(g >> 1) % d.length], 0.34)));
      (u.position.copy(ni), (u.rotation.y = In), K.add(u));
      {
        let g = new H(Math.cos(In), 0, -Math.sin(In)),
          y = new H(Math.sin(In), 0, Math.cos(In));
        if (ze("bread_rack")) {
          let x = je("bread_rack");
          (x.scale.multiplyScalar(1.25),
            x.position.copy(ni).addScaledVector(g, -2.05).addScaledVector(y, 0.15),
            (x.rotation.y = In - Math.PI / 2),
            K.add(x),
            pt.push({ x: x.position.x, z: x.position.z, hw: 0.6, hd: 0.6 }));
        }
        if (ze("breads"))
          for (let x of [-0.8, 0.75]) {
            let b = je("breads");
            (b.scale.multiplyScalar(0.17),
              b.position.copy(ni).addScaledVector(g, x).addScaledVector(y, 0.22).setY(0.98),
              (b.rotation.y = In + (x > 0 ? 0.3 : -0.2)),
              K.add(b));
          }
      }
      pt.push({ x: ni.x, z: ni.z, hw: 0.8, hd: 1.6 });
      let p = mr() ? Zr(Fy) : Ic(Sh[3]),
        m = new H(Math.cos(In), 0, -Math.sin(In)),
        E = new H(Math.sin(In), 0, Math.cos(In));
      (p.root.position.copy(ni).addScaledVector(m, 2.05).addScaledVector(E, 0.25),
        (p.yaw = In),
        K.add(p.root),
        (md = p),
        pt.push({ x: p.root.position.x, z: p.root.position.z, hw: 0.32, hd: 0.32 }),
        y0.push({
          rig: p,
          at: p.root.position.clone(),
          yaw: In,
          t: 2,
          moodT: 1,
          happy: !1,
          lines: [
            "ขนมปังอบใหม่ร้อน ๆ จ้า!",
            "เพรทเซลเนยสด หอมมาก",
            "ครัวซองต์กรอบนอกนุ่มใน",
            "แวะชิมก่อนได้นะหลานชาย",
            "วันนี้อากาศดี กินโดนัทกัน!",
            "ลุงปั้มอบเองทุกเช้าเลย",
          ],
        }));
    }
    {
      let d = mr()
          ? Zr([
              "Body_12",
              "Ears_12",
              "Male_Emotion_Happy_01",
              "Hairstyle_Male_07",
              "Outwear_33",
              "Pants_06",
              "Shoe_Slippers_03",
              "Hat_01",
            ])
          : Ic(Sh[3]),
        u = new H(od.x - 0.85, 0, od.z + 0.2);
      ((u.y = ccsStall?.position.y ?? 0),
        d.root.position.copy(u),
        (d.yaw = -Math.PI / 2),
        K.add(d.root),
        pt.push({ x: u.x, z: u.z, hw: 0.3, hd: 0.3 }),
        y0.push({
          rig: d,
          at: u.clone(),
          yaw: -Math.PI / 2,
          t: 3,
          moodT: 2,
          happy: !1,
          deck: !0,
          lines: [
            "ปลาสด ๆ จากทะเลเช้านี้จ้า!",
            "ปลาทูนึ่งแกะก้างให้น้องหมา",
            "แซลมอนย่างหอม ๆ ไม่ใส่เกลือ",
            "กุ้งลวกแกะเปลือกแล้วนะ",
            "มาเที่ยวทะเลเหรอหนู",
          ],
        }));
    }
    let t = mr() ? Zr(Iy) : Ic(Sh[7]);
    (t.root.position.set(fn.x - 1.95, 0, fn.z - 0.25),
      (t.yaw = Math.PI),
      K.add(t.root),
      (nA = t),
      pt.push({ x: fn.x - 1.95, z: fn.z - 0.25, hw: 0.32, hd: 0.32 }),
      y0.push({
        rig: t,
        at: t.root.position.clone(),
        yaw: Math.PI,
        t: 4,
        moodT: 2,
        happy: !1,
        lines: [
          "ไก่ย่างร้อน ๆ จ้า หอมไหมลูก",
          "ไม่ใส่ซอส ไม่เค็ม สำหรับน้องหมา",
          "ย่างเตาถ่านแท้ ๆ เลย",
          "ป้าอู้ดแถมน่องให้อีกชิ้นนะ",
          "มาเร็ว ๆ เดี๋ยวหมดก่อน!",
        ],
      }));
    for (let [d, u] of [
      [8, 60],
      [-6, 58],
      [44, 9],
      [-22, 20],
    ]) {
      let p = m3();
      (K.add(p), _d.push({ m: p, pos: new H(d, 0, u), vel: new H(), y: 0, vy: 0 }));
    }
    let n = [
        14168111, 16053488, 1976890, 12173510, 3104680, 8377264, 15909424, 15759914, 16033472, 8016568, 3046735,
        7027242,
      ],
      s = (d, u) => {
        let p = new ae(u),
          m = new Map();
        d.traverse((E) => {
          let g = E;
          if (!g.isMesh) return;
          let x = (Array.isArray(g.material) ? g.material : [g.material]).map((b) => {
            let w = b;
            if (!/^(Color|Car_Color|Color_Glossy)$/.test(w.name)) return w;
            if (m.has(w)) return m.get(w);
            let v = w.clone();
            return (
              m.set(w, v),
              (v.userData.paint = p),
              (v.onBeforeCompile = (_) => {
                ((_.uniforms.uPaint = { value: p }),
                  (_.fragmentShader =
                    `uniform vec3 uPaint;
` +
                    _.fragmentShader.replace(
                      "#include <map_fragment>",
                      `#include <map_fragment>
            { vec3 cc = diffuseColor.rgb; float mx = max(cc.r, max(cc.g, cc.b)), mn = min(cc.r, min(cc.g, cc.b)); float sat = mx > 0.001 ? (mx - mn) / mx : 0.0;
              float k = smoothstep(0.32, 0.5, sat) * step(0.12, mx);                     // เฉพาะพื้นที่สีสด = สีตัวถัง
              vec3 pt = uPaint * (0.35 + 0.9 * mx);                                       // คงแสงเงาเดิม
              diffuseColor.rgb = mix(cc, pt, k); }`,
                    )));
              }),
              (v.customProgramCacheKey = () => "paint" + u),
              v
            );
          });
          g.material = Array.isArray(g.material) ? x : x[0];
        });
      },
      o = { Car_sport: 3.6, Car_ev: 3.7, Car_4x4: 4.1, Car_suv: 3.8, car_macan: 3.9 },
      r = (d) => o[d] ?? (d === "Van" ? 4.1 : 3.5);
    ([
      "Car_06",
      "Car_13",
      "Van",
      "Car_16",
      "Car_19",
      "Futuristic_Car_1",
      "car_macan", // v82: Porsche Macan (Kaban)
      "Car_13",
      "Car_06",
      "Car_16",
      "Car_19",
      "Van",
      "Car_13",
    ]
      .filter((d, u) => u < 6 || ze(d))
      .forEach((d, u) => {
        let p = ze(d) ? je(d, r(d)) : null;
        if ((p && !o[d] && s(p, n[(u * 5) % n.length]), p && (p.userData.model = d), !p)) {
          let g = new J(),
            y = new R(new ee(1.8, 1.2, 3.8), new X({ color: [14829119, 4163272, 16765503, 7127626][u] }));
          ((y.position.y = 0.8), g.add(y), (p = g));
        }
        {
          let g = r(d),
            y = new J();
          p.traverse((b) => {
            let w = b;
            if (w.isMesh)
              for (let v of Array.isArray(w.material) ? w.material : [w.material])
                (/Headlight|^Emissive$/.test(v.name) && !Qh.some((_) => _.m === v) && Qh.push({ m: v, tail: !1 }),
                  /Taillight/.test(v.name) && !Qh.some((_) => _.m === v) && Qh.push({ m: v, tail: !0 }));
          });
          // v83: แสงไฟหน้าตกถึงพื้นชิดหน้ารถพอดี (เดิมเลยหน้ารถไปมาก) ทุกรุ่นใช้ความยาวจริงของรถ
          // v84: แสงไฟหน้าบนพื้นเป็นรูปพัด เริ่มที่กันชนหน้าพอดี แล้วค่อยกว้างและจางออกไป (ไม่มีช่องว่างระหว่างรถกับแสง)
          let x = new R(new Te(3.2, 6.4), ccsBeamMat());
          ((x.rotation.x = -Math.PI / 2), x.position.set(0, 0.1, g / 2 + 3.2 - 0.25), (x.visible = !1), (x.renderOrder = 2), y.add(x), al.push(x));
          {
            let b = new En(16773848, 0, 8, 1.3);
            (b.position.set(0, 0.75, g / 2 + 1.3), y.add(b), H0.push({ l: b, on: 10 }));
          }
          for (let b of [-0.55, 0.55]) {
            let w = ZE(5.5, 0.08, 1.1, 16773840, 0.22);
            ((w.rotation.x = -Math.PI / 2 + 0.06), w.position.set(b * 0.95, 0.62, g / 2 + 2.75), y.add(w));
          }
          p.add(y);
        }
        K.add(p);
        let m = r(d),
          E = { o: p, dir: 1, pos: new H(), yaw: 0, v: QE, honkT: 0, wait: 0, hl: m / 2, hw: m * 0.24 };
        (R4(E, !0), E.o.position.copy(E.pos), (E.o.rotation.y = E.yaw), cl.push(E));
        {
          let g = [];
          p.traverse((x) => {
            /Wheel/i.test(x.name) && g.push(x);
          });
          let y = g.filter((x) => !g.includes(x.parent));
          if (y.length) {
            ((E.wheels = y), p.updateMatrixWorld(!0));
            let x = new mt().setFromObject(y[0]);
            E.wr = Math.max(0.15, (x.max.y - x.min.y) / 2);
          }
          for (let x of y) x.userData.noMerge = !0;
          for (let x of p.children) x.children.some((b) => b.material && al.includes(b)) && (x.userData.noMerge = !0);
          oo(p, !0);
          for (let x of y) ((x.userData.noMerge = !1), oo(x, !0), (x.userData.noMerge = !0));
        }
      }),
      (Cr = xM(K, -31, 15, -5, 34.5)),
      pt.push(...Cr.solids));
    // v82: ต้นไม้การ์ตูน (tree_001 / fabulous_tree) → ต้นไม้จริงชุด Trees Set A
    let a = [
      [ze("tree_r1") ? "tree_r1" : "tree_001", 7],
      [ze("tree_r4") ? "tree_r4" : "fabulous_tree_001", 6.5],
      ["lptree_1", 7.5],
      ["lptree_2", 8],
      ["coconut_palm", 8.5],
    ];
    if (
      (n1.forEach((d, u) => {
        let p = u < 48,
          E = d.position.z > Rt - 16 ? 4 : p ? [2, 0, 3, 1][u % 4] : [0, 2, 1, 3, 0, 2, 3][u % 7]; // v82: เปลี่ยนต้นไม้การ์ตูนทุกต้น (เดิมบางต้นข้าม = -1)
        if (E < 0) return;
        let [g, y] = a[E];
        if (!ze(g)) return;
        let x = Zp(g, y * (0.85 + ((u * 37) % 10) / 30));
        ((x.rotation.y = u * 1.7), d.clear(), d.scale.setScalar(1), d.add(x));
      }),
      ze("coconut_palm"))
    ) {
      let d = 0;
      for (let u = -146; u <= 146; u += 4.7) {
        let p = Math.sin(u * 12.9898) * 43758.5453,
          m = p - Math.floor(p);
        if (!(Math.abs(u) < 6 || m < 0.38))
          for (let E = 0; E < (m > 0.9 ? 2 : 1); E++) {
            let g = u + (E ? 1.2 : 0) + (m - 0.5) * 1.4,
              y = Rt - 2.6 - ((m * 7.3) % 1) * 5.5 - E * 1.6;
            if ((Math.abs(g - 8) < 2.5 && Math.abs(y - 60) < 2.5) || (Math.abs(g + 6) < 2.5 && Math.abs(y - 58) < 2.5))
              continue;
            let b = Zp("coconut_palm", 6.2 + ((m * 13.1) % 1) * 2.8);
            (b.position.set(g, zo(g, y) - 0.05, y),
              (b.rotation.y = m * 6.28),
              (b.rotation.x = 0.06 + ((m * 5.7) % 1) * 0.1),
              K.add(b),
              lo.push(new H(g, 0, y)),
              d++);
          }
      }
    }
    for (let [d, u, p, m, E] of [
      ["fabulous_mushroom_001", -40, 30, 0, 2.2],
      ["lptree_1", -54, -30, 0, 8],
      [ze("tree_r2") ? "tree_r2" : "fir_001", -48, -46, 1, 7],
      ["lptree_2", -36, -40, 2, 8.4],
      [ze("tree_r3") ? "tree_r3" : "fabulous_tree_001", 20, 20, 0, 5.5],
      [ze("tree_r1") ? "tree_r1" : "big_fabulous_tree_001", 52, 22, 0, 8],
    ])
      Si(d, u, p, m, E) && lo.push(new H(u, 0, p));
    for (let [d, u, p, m] of [
      [53.5, 18.2, 1.7, 0],
      [45.2, 25.6, 1.3, 2],
      [54.8, 24.8, 2.1, 4],
      [-62, Rt - 4.2, 2.4, 1],
      [66, Rt - 3.6, 2.2, 3],
      [-104, Rt - 5, 2.6, 5],
      [112, Rt - 4.5, 2.3, 2],
      [-30, Rt - 3.2, 1.6, 0],
    ])
      if (Si("cactus_001", d, u, m, p)) {
        let E = K.children[K.children.length - 1];
        ((E.position.y = zo(d, u) - 0.05), lo.push(new H(d, 0, u)));
      }
    {
      let d = ze("tree_r1") ? ["lptree_1", "tree_r1", "lptree_2", "tree_r4", "tree_r3", "tree_r1", "tree_r2"] : ["lptree_1", "fir_001", "lptree_2", "fabulous_tree_001"],
        u = 0;
      for (let g = 0; g < 400 && u < 90; g++) {
        let y = (Math.sin(g * 12.9898) * 0.5 + 0.5) * 300 - 150,
          x = (Math.sin(g * 78.233) * 0.5 + 0.5) * (150 + Rt - 18) - 150;
        if (
          (Math.abs(y) < 72 && x > -58) ||
          Math.abs(x) < Mt + 4 ||
          (Math.abs(y - Hi.x) < 16 && Math.abs(x - Hi.z) < 14) ||
          Math.abs(y - 30) < 6 ||
          Math.abs(y + 46) < 6
        )
          continue;
        let b = d[g % d.length];
        if (!ze(b)) continue;
        let w = Zp(b, 6 + (g % 5) * 1.3);
        (w.position.set(y, 0, x), (w.rotation.y = g), K.add(w), lo.push(new H(y, 0, x)), u++);
      }
      let p = [
        [hn, 0],
        [Hr, 6.5],
        [fn, 4.5],
        [new H(fn.x, 0, fn.z + 4.5), 5.5],
        [Ti, 6.5],
        [new H(fn.x + 2.4, 0, fn.z + 1), 3],
        [ni, 4.5],
        [new H(-9, 0, Mt + 0.6), 3.5],
        [new H(Ut.x, 0, Ut.z + 2), 10],
        [new H(Ut.x - 2, 0, Ut.z + 11), 5],
      ];
      for (let g = Mt; g < Ut.z + 6; g += 3) p.push([new H(Bo, 0, g), 2.6]);
      let m = [];
      K.traverse((g) => {
        if (!g.userData.tree) return;
        let y = g.getWorldPosition(new H());
        (eb(y, 2) || inGarden(y, 2.5) || p.some(([x, b]) => Math.hypot(y.x - x.x, y.z - x.z) < b)) && m.push(g);
      });
      for (let g of m) {
        let y = g.getWorldPosition(new H());
        g.parent?.remove(g);
        let x = lo.findIndex((b) => Math.hypot(b.x - y.x, b.z - y.z) < 0.6);
        x >= 0 && lo.splice(x, 1);
      }
      let E = new bt({ color: 8368233 });
      for (let g = 0; g < 9; g++) {
        let y = Math.PI + 0.15 + (g / 8) * (Math.PI - 0.3),
          x = new R(new we(40 + (g % 3) * 14, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), E);
        ((x.scale.y = 0.35 + (g % 2) * 0.12), x.position.set(Math.cos(y) * 230, -2, Math.sin(y) * 200 - 20), K.add(x));
      }
    }
    (Si("stall_001", 37, -13.1, 0, 3.3, [1.4, 1.3]),
      Si("table_001", 41, -14.1, 0.3, 2.2, [1, 0.8]),
      Si("barrel_001", 34.6, -12.1, 0, 0.9, [0.4, 0.4]),
      Si("barrel_001", 34.2, -13.3, 1, 0.8, [0.4, 0.4]),
      Si("cart_001", 44.5, -13.6, -0.6, 3.6, [1.6, 1]),
      Si("log_001", -24, 38, 0.2, 2.6, [1.2, 0.5]),
      Si("Bus_Stop_02", -9, Mt + 0.6, Math.PI, void 0, [2.3, 0.7]),
      Si("Van", 36, -19.1, Math.PI / 2, 5, [2.6, 1.2]),
      qC());
    let l = ((d, u, p, m, E, g, y) => {
      let x = document.createElement("canvas");
      ((x.width = d), (x.height = u));
      let b = x.getContext("2d");
      y(b);
      let w = new ut(x);
      return ((w.colorSpace = Ye), w);
    })(1024, 184, 0.144, 0.031, 0.887, 0.164, (d) => {
      let u = d.createLinearGradient(0, 0, 1024, 0);
      (u.addColorStop(0, "#ffd6e4"),
        u.addColorStop(1, "#fff1c9"),
        (d.fillStyle = u),
        d.fillRect(0, 0, 1024, 184),
        (d.fillStyle = "#b5338a"),
        (d.font = "700 74px Mitr, sans-serif"),
        (d.textAlign = "center"),
        d.fillText("ChowChowStory", 512, 92),
        (d.fillStyle = "#8a5a2b"),
        (d.font = "600 40px Mitr, sans-serif"),
        d.fillText(
          "เมืองของน้องเชาเชา \xB7 มาเที่ยวกันนะ!",
          512,
          150,
        ));
      let p = (m, E, g, y) => {
        (d.save(),
          d.translate(m, E),
          d.rotate(y),
          (d.fillStyle = "rgba(242,140,40,.55)"),
          d.beginPath(),
          d.ellipse(0, g * 0.35, g * 0.62, g * 0.5, 0, 0, Math.PI * 2),
          d.fill());
        for (let [x, b] of [
          [-0.62, -0.38],
          [-0.22, -0.72],
          [0.22, -0.72],
          [0.62, -0.38],
        ])
          (d.beginPath(), d.ellipse(x * g, b * g, g * 0.2, g * 0.26, 0, 0, Math.PI * 2), d.fill());
        d.restore();
      };
      for (let m = 0; m < 7; m++) p(205 + m * 105, 170 + (m % 2 ? -6 : 4), 11, 1.57 + (m % 2 ? 0.25 : -0.25));
    });
    {
      let d = new Image();
      ((d.onload = () => {
        let u = l.image,
          p = u.getContext("2d"),
          m = 170,
          E = (m * d.width) / d.height;
        for (let g of [86, 938]) p.drawImage(d, g - E / 2, 7, E, m);
        l.needsUpdate = !0;
      }),
        (d.src = id("logo_chow")));
    }
    let h = (d) =>
      d?.traverse((u) => {
        let p = u;
        if (!p.isMesh) return;
        (Array.isArray(p.material) ? p.material : [p.material]).forEach((E, g) => {
          if (E.name === "scrolling text") {
            p.visible = !1;
            return;
          }
          let y = E.name === "Billboard" ? l : null;
          if (!y) return;
          {
            let b = p.geometry.clone(),
              w = b.getAttribute("position"),
              v = b.getAttribute("uv"),
              _ = b.getIndex(),
              S = new Float32Array(w.count * 2);
            if (v) for (let L = 0; L < w.count; L++) ((S[L * 2] = v.getX(L)), (S[L * 2 + 1] = v.getY(L)));
            let M = b.groups.find((L) => L.materialIndex === g) ?? { start: 0, count: _ ? _.count : w.count },
              T = new Set();
            for (let L = M.start; L < M.start + M.count; L++) T.add(_ ? _.getX(L) : L);
            let A = [1e9, 1e9, 1e9],
              F = [-1e9, -1e9, -1e9];
            for (let L of T)
              for (let q = 0; q < 3; q++) {
                let $ = w.getComponent(L, q);
                ((A[q] = Math.min(A[q], $)), (F[q] = Math.max(F[q], $)));
              }
            let C = [0, 1, 2].map((L) => F[L] - A[L]),
              P = C.indexOf(Math.min(...C)),
              I = [0, 1, 2].filter((L) => L !== P),
              k = C[I[0]] >= C[I[1]] ? I[0] : I[1],
              D = k === I[0] ? I[1] : I[0];
            for (let L of T)
              ((S[L * 2] = (w.getComponent(L, k) - A[k]) / C[k]),
                (S[L * 2 + 1] = (w.getComponent(L, D) - A[D]) / C[D]));
            (b.setAttribute("uv", new Je(S, 2)), (p.geometry = b));
          }
          let x = new be({ map: y, side: Ke, polygonOffset: !0, polygonOffsetFactor: -1 });
          Array.isArray(p.material) ? (p.material[g] = x) : (p.material = x);
        });
      });
    (h(Si("Billboard_4x1_04", -54, -Mt - 3, 0, 8, [3.8, 0.4])),
      h(Si("Billboard_4x1_04", 60, -Mt - 2.2, 0, 7.5, [3.6, 0.4])));
    {
      let d = Si("Graffiti_03", -10.5, -12.9, Math.PI / 2, 3.2);
      d &&
        ((d.position.y = 0.4),
        d.traverse((u) => {
          let p = u;
          if (p.isMesh) {
            let m = p.material;
            ((m.transparent = !0),
              (m.alphaTest = 0.3),
              (m.side = Ke),
              (m.polygonOffset = !0),
              (m.polygonOffsetFactor = -2));
          }
        }));
    }
    (Si("Trash_Can_05", 34.6, -27, -Math.PI / 2, 2.1, [0.65, 1.1]),
      Si("Trash_Can_07", 34.6, -29.4, -Math.PI / 2, 2.1, [0.65, 1.1]));
    for (let [d, u, p] of [
      [39.5, 25, 2.4],
      [59, 25, -2.4],
    ])
      Si("Spotlight_02", d, u, p, 5.2, [0.6, 0.6]);
    let f = [
      ["Eco_Building_Slope", -60, -150, 70],
      ["Eco_Building_Terrace", -15, -158, 34],
      ["Regular_Building_TwistedTower_Large", 25, -165, 72],
      ["Eco_Building_Grid", 70, -150, 62],
    ];
    if (ze("Eco_Building_Grid")) {
      let d = new R(new ee(260, 2, 40), new bt({ color: 13623472 }));
      (d.position.set(5, -0.6, -158), K.add(d));
      for (let [u, p, m, E] of f) Si(u, p, m, 0, E);
    }
  }
  function wA() {
    if (!ze("Toy_Claw_01")) return;
    let i = [
        [16777215, 16766624],
        [16754904, 16751317],
        [10476799, 10151679],
        [12121520, 12124104],
        [13809919, 13215999],
        [16769658, 16773280],
      ],
      e = (i.splice(1), i.length), // v97: เหลือตู้เดียว
      t = 1.75,
      n = -36 - ((e - 1) * t) / 2,
      s = -Mt - 1,
      o = new R(new Te(e * t + 1.4, 3.2), new bt({ color: 16181247 }));
    ((o.rotation.x = -Math.PI / 2),
      o.position.set(-36, 0.02, s - 0.4),
      (o.receiveShadow = !0),
      K.add(o),
      i.forEach(([r, a], c) => {
        let l = n + c * t,
          h = h3(1.15);
        (h.group.position.set(l, 0, s),
          K.add(h.group),
          c > 0 &&
            h.group.traverse((d) => {
              let u = d;
              if (!u.isMesh) return;
              let m = (Array.isArray(u.material) ? u.material : [u.material]).map((E) => {
                if (!/^(Colorset_01|Color_Glossy|Color)$/.test(E.name)) return E;
                let g = E.clone();
                return (g.color.setHex(r), g);
              });
              u.material = Array.isArray(u.material) ? m : m[0];
            }));
        if (c % 2 === 0) { // v99: เอาแถบขาว (หลอดไฟ) กลางตู้ออก
          let d = new En(a, 2.2, 3.4, 1.5); // v97: ไฟในตู้อ่อนลง (เดิมสว่างจ้า)
          (d.position.set(t / 2 / 1.15, 1.7, 0.1), h.group.add(d));
        }
        {
          // v87: ไฟส่องหน้าตู้คีบตอนกลางคืน (สปอตไลต์ติดชายคา + แสงตกพื้น)
          let d = new En(16773336, 0, 7, 1.3);
          (d.position.set(l, 2.7, s + 1.3), K.add(d), H0.push({ l: d, on: 3.5 }), pd(l, s + 1.1, 2.2));
        }
        (gl.push({ c: h, pos: new H(l, 0, s), front: new H(l, 0, s + 1.35) }),
          pt.push({ x: l, z: s + 0.1, hw: 0.8, hd: 0.72 }));
      }),
      H1());
  }
  var I4 = [],
    Hr = new H(37.5, 0, 12.6),
    Ot = null,
    jc = (() => {
      let i = new J(),
        e = new R(new yt(0.35, 0.7, 4), new be({ color: 16765503 }));
      ((e.rotation.x = Math.PI), i.add(e));
      let t = new R(new vt(0.9, 0.06, 6, 28), new be({ color: 16765503 }));
      return ((t.rotation.x = -Math.PI / 2), (t.position.y = -2.8), i.add(t), (i.visible = !1), K.add(i), i);
    })();
  function vA() {
    let t = document.createElement("canvas");
    ((t.width = 1024), (t.height = 640));
    let n = t.getContext("2d");
    ((n.fillStyle = "#c9935a"), n.fillRect(0, 0, 1024, 640));
    for (let r = 0; r < 2500; r++)
      ((n.fillStyle = `rgba(${Math.random() < 0.5 ? "90,50,20" : "255,230,190"},${Math.random() * 0.18})`),
        n.fillRect(Math.random() * 1024, Math.random() * 640, 3, 3));
    ((n.fillStyle = "#fff6e5"),
      n.beginPath(),
      n.roundRect(40, 30, 944, 170, 26),
      n.fill(),
      (n.lineWidth = 8),
      (n.strokeStyle = "#8a5a2b"),
      n.stroke(),
      (n.fillStyle = "#8a5a2b"),
      (n.textAlign = "center"),
      (n.textBaseline = "middle"),
      (n.font = "700 92px Mitr, sans-serif"),
      n.fillText("บอร์ดรับงาน", 1024 / 2 - 60, 98),
      (n.font = "600 44px Mitr, sans-serif"),
      (n.fillStyle = "#b5338a"),
      n.fillText(
        "ทำงานได้เงิน 💰 + ค่า EXP ⭐",
        1024 / 2 - 60,
        164,
      ),
      [
        ["📦", "ส่งพัสดุ", "#ffe9a8"],
        ["🗑", "เก็บขยะ", "#c9f0d8"],
        ["✉️", "ส่งจดหมาย", "#d6e9ff"],
      ].forEach(([r, a, c], l) => {
        let h = 70 + l * 315,
          f = 250,
          d = (l - 1) * 0.05;
        (n.save(),
          n.translate(h + 140, f + 160),
          n.rotate(d),
          (n.fillStyle = "rgba(0,0,0,.18)"),
          n.fillRect(-132, -152, 280, 330),
          (n.fillStyle = c),
          n.fillRect(-140, -160, 280, 330),
          (n.fillStyle = "#e2463f"),
          n.beginPath(),
          n.arc(0, -140, 14, 0, 7),
          n.fill(),
          (n.font = "96px 'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif"),
          (n.fillStyle = "#241c15"),
          n.fillText(r, 0, -40),
          (n.font = "700 52px Mitr, sans-serif"),
          n.fillText(a, 0, 70),
          (n.font = "500 34px Mitr, sans-serif"),
          (n.fillStyle = "#6b4220"),
          n.fillText("กดรับงาน", 0, 128),
          n.restore());
      }));
    let o = new ut(t);
    return ((o.colorSpace = Ye), (o.anisotropy = 4), o);
  }
  function RA() {
    let i = new J();
    i.position.copy(Hr);
    let e = new X({ map: Cn(10508330, "#5a2e12"), roughness: 0.8 }),
      t = 3.4,
      n = 2.1,
      s = 1.95;
    for (let l of [-t / 2 - 0.05, t / 2 + 0.05]) {
      let h = new R(new ee(0.16, s + n / 2 + 0.2, 0.16), e);
      (h.position.set(l, (s + n / 2 + 0.2) / 2, 0), i.add(h));
    }
    let o = new R(new ee(t + 0.2, n + 0.2, 0.1), e);
    ((o.position.y = s), i.add(o));
    let r = new R(new Te(t, n * (t / n) * (640 / 1024)), new be({ map: vA() }));
    (r.position.set(0, s, -0.06), (r.rotation.y = Math.PI), i.add(r));
    let a = new R(new ee(t + 0.7, 0.12, 0.7), new X({ color: 12735807 }));
    ((a.position.y = s + n / 2 + 0.25), i.add(a));
    let c = new R(new gt(0.34, 32), new be({ map: io("st_board", 16777215, 11875210, 256, 0.1), transparent: !0 }));
    (c.position.set(-t / 2 + 0.48, s + n / 2 - 0.37, -0.08),
      (c.rotation.y = Math.PI),
      i.add(c),
      i.traverse((l) => {
        l.castShadow = !0;
      }),
      K.add(i),
      pt.push({ x: Hr.x, z: Hr.z, hw: t / 2 + 0.2, hd: 0.3 }));
  }
  function c1() {
    let i = it("jobChip");
    if ((i.classList.toggle("on", !!Ot), !Ot)) {
      jc.visible = !1;
      return;
    }
    let e =
      Ot.kind === "litter" && Ot.step === 0
        ? `เก็บขยะ ${Ot.got}/${Ot.litter.length}`
        : (Ot.stops[Ot.step]?.label ?? "");
    ((i.innerHTML = `💼 ${e} <b>+${Ot.reward}💰</b>`),
      (i.title = `${Ot.title}: ${e} \xB7 +${Ot.reward}💰 +${Ot.kind === "letter" ? 15 : 25} EXP`));
  }
  function _A() {
    let i = Ot
      ? `<p>งานที่ทำอยู่: <b>${Ot.title}</b></p><button data-job="cancel">ยกเลิกงานนี้</button>`
      : `
    <div class="row"><span class="ic">📦</span><div><b>ส่งพัสดุ</b><small>รับของจากร้านหนึ่ง ไปส่งอีกร้าน \xB7 50-90💰</small></div><button data-job="deliver">รับงาน</button></div>
    <div class="row"><span class="ic">🗑</span><div><b>เก็บขยะในเมือง</b><small>เก็บขยะ 6 ชิ้น ไปทิ้งถังขยะ \xB7 2💰/ชิ้น +โบนัส 40💰</small></div><button data-job="litter">รับงาน</button></div>
    <div class="row"><span class="ic">✉️</span><div><b>ส่งจดหมาย</b><small>ส่งจดหมายให้ชาวเมือง 3 คน \xB7 25💰/คน +โบนัส 20💰</small></div><button data-job="letter">รับงาน</button></div>
    <p class="note">ฝึกที่สนามก็ได้ 10💰 ต่อรอบ \xB7 เลเวลขึ้นได้โบนัส</p>`;
    (Gi("บอร์ดงานพิเศษ 💼", i),
      document.querySelectorAll("[data-job]").forEach((e) =>
        e.addEventListener("click", () => {
          (SA(e.dataset.job), qs());
        }),
      ));
  }
  function SA(i) {
    if (i === "cancel") {
      if (Ot?.litter) for (let e of Ot.litter) K.remove(e);
      ((Ot = null), c1(), De("ยกเลิกงานแล้ว", 1400));
      return;
    }
    if ((ke("pop"), i === "deliver")) {
      let e = zn[Math.floor(Math.random() * zn.length)],
        t = zn[Math.floor(Math.random() * zn.length)];
      for (; t === e;) t = zn[Math.floor(Math.random() * zn.length)];
      Ot = {
        kind: "deliver",
        title: "ส่งพัสดุ",
        step: 0,
        got: 0,
        reward: 50 + Math.round(Math.abs(e.door.x - t.door.x)),
        stops: [
          { at: () => e.door, label: `รับของที่${e.def.name}` },
          { at: () => t.door, label: `ส่งของที่${t.def.name}` },
        ],
      };
    } else if (i === "litter") {
      let e = ["Soda_Can_1", "Chips_2", "Coffee_Cup_To_Go", "Juice_Box", "Soda_Can_2", "Chips_1"].filter((n) => ze(n)),
        t = [];
      for (let n = 0; n < 6; n++) {
        let s = P0();
        Math.abs(s.z) < Mt + 0.5 && (s.z += s.z < 0 ? -(Mt + 2) : Mt + 2);
        let o = je(e[n % e.length] ?? "Bowl", 0.35);
        (o.position.copy(s),
          o.rotation.set(Math.PI / 2, 0, Math.random() * 6),
          (o.position.y = 0.1),
          K.add(o),
          t.push(o));
      }
      Ot = {
        kind: "litter",
        title: "เก็บขยะ",
        step: 0,
        got: 0,
        reward: 40,
        litter: t,
        stops: [
          {
            at: () => t.find((n) => n.visible)?.position ?? new H(),
            label: "เก็บขยะ",
          },
          {
            at: () => new H(34.6, 0, -25.5),
            label:
              "ทิ้งที่ถังขยะใหญ่ริมซอย",
          },
        ],
      };
    } else
      Ot = {
        kind: "letter",
        title: "ส่งจดหมาย",
        step: 0,
        got: 0,
        reward: 20,
        stops: [...wi]
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((t) => ({
            at: () => t.pos,
            label: `ส่งจดหมายให้${es[wi.indexOf(t)]?.name ?? "ชาวเมือง"}`,
          })),
      };
    (De(
      `💼 รับงาน "${Ot.title}" แล้ว! ตามลูกศรสีเหลืองไปเลย`,
      2600,
    ),
      c1());
  }
  function HA(i) {
    if (!Ot || Se) return !1;
    if (Ot.kind === "litter" && Ot.step === 0) {
      let t = Ot.litter.find((n) => n.visible && n.position.distanceTo(i) < 1.8);
      return t
        ? (nt("🗑 เก็บขยะ", () => {
            ((t.visible = !1),
              Ot.got++,
              (z.money += 2),
              ke("pop"),
              rt("+2💰", t.position.clone().setY(1), "cool"),
              Ot.got >= Ot.litter.length &&
                ((Ot.step = 1),
                De(
                  "เก็บครบแล้ว! เอาไปทิ้งถังขยะใหญ่ริมซอยกันเถอะ 🗑",
                  2400,
                )),
              c1());
          }),
          !0)
        : !1;
    }
    let e = Ot.stops[Ot.step];
    return e && e.at().distanceTo(i) < (Ot.kind === "letter" ? 2.4 : 2.6)
      ? (nt(
          Ot.kind === "letter"
            ? "✉️ ยื่นจดหมาย"
            : Ot.kind === "litter"
              ? "🗑 ทิ้งขยะ"
              : Ot.step === 0
                ? "📦 รับพัสดุ"
                : "📦 ส่งพัสดุ",
          () => {
            let t = Ot;
            if (
              (t.step++,
              ke("coin"),
              t.kind === "letter" &&
                ((z.money += 25),
                rt(
                  "+25💰 ขอบคุณจ้า!",
                  e.at().clone().setY(2.2),
                  "cool",
                )),
              t.step >= t.stops.length)
            ) {
              let n = t.kind === "deliver" ? t.reward : t.kind === "letter" ? 20 : t.reward,
                s = t.kind === "letter" ? 15 : 25;
              if (
                ((z.money += n),
                (j.score += 30),
                rt(`💼 +${n}💰 +${s} EXP`, i.clone().setY(2.2), "big"),
                De(
                  `🎉 ทำงาน "${t.title}" เสร็จแล้ว ได้ ${n}💰 และ ${s} EXP`,
                  2800,
                ),
                Rs(s, Le[0]),
                t.litter)
              )
                for (let o of t.litter) K.remove(o);
              Ot = null;
            } else De(`👍 ต่อไป: ${t.stops[t.step].label}`, 2e3);
            ((fa.money.textContent = String(z.money)), _t(z), c1());
          },
        ),
        !0)
      : !1;
  }
  function AA(i) {
    if (!Ot) {
      jc.visible = !1;
      return;
    }
    let e = Ot.stops[Ot.step];
    if (!e) {
      jc.visible = !1;
      return;
    }
    let t = e.at();
    ((jc.visible = !Se), jc.position.set(t.x, 3.2 + Math.sin(i * 3) * 0.25, t.z), (jc.rotation.y = i * 1.5));
  }
  var F4 = {
    petshop: [
      "Dog_01",
      "Barney_01",
      "Cat_01",
      "Bear_01",
      "Rabbit_01",
      "Barney_01",
      "Bowl",
      "Panda_01",
      "Fox_01",
      "Bowl",
    ],
    chow: [
      "Dog_01",
      "Barney_01",
      "Cat_01",
      "Bear_01",
      "Rabbit_01",
      "Bowl",
      "Carton_Box_1",
      "Carton_Box_2",
      "Bowl",
      "Panda_01",
      "Fox_01",
      "Bottle_2",
    ],
    grocery: [
      "Apple_Red",
      "Orange",
      "Tomato",
      "Pumpkin",
      "Watermelon",
      "Bread_1",
      "Bread_2",
      "Bread_3",
      "Bottle_1",
      "Bottle_3",
      "Juice_Box",
      "Carton_Box_2",
      "Chips_1",
      "Chips_2",
      "Soda_Can_2",
      "Ketchup",
      "Mustard",
    ],
    clinic: ["Bottle_4", "Bottle_5", "Bottle_6", "Carton_Box_1", "Mug_1", "Bottle_4"],
    groom: ["Bottle_2", "Bottle_3", "Bottle_5", "Mug_2", "Bowl"],
    pet: ["egg_001", "egg_002", "Chick_01", "Bowl", "Pumpkin"],
  };
  function CA(i, e) {
    let t = (F4[i] ?? []).filter((s) => ze(s));
    if (!t.length || !e.decor || (i === "grocery" && ze("dk_chips_0"))) return;
    let n = 0;
    for (let s of e.decor) {
      if (
        ((n++ * 7919) % 100) / 100 >
        (i === "grocery" && ze("donki_store") ? 1.01 : i === "chow" || i === "grocery" ? 0.72 : 0.45)
      )
        continue;
      let o = t[(n * 31 + Math.floor(s.pos.x * 3)) % t.length],
        r = je(o, s.level > 2 ? 0.42 : 0.36);
      (r.position.copy(s.pos).sub(e.origin), (r.rotation.y = s.ry + (Math.random() - 0.5) * 0.5), e.group.add(r));
    }
    if (i === "chow")
      for (let [s, o, r] of [
        [-1.9, 2.6, 16748472],
        [0, 3.7, 8374520],
        [1.5, 2.4, 16765503],
      ]) {
        let a = new R(new vt(0.55, 0.22, 10, 24), new X({ color: r, roughness: 0.95 }));
        ((a.rotation.x = -Math.PI / 2), a.position.set(s, 0.2, o), e.group.add(a));
        let c = new R(new re(0.55, 0.55, 0.12, 24), new X({ color: 16774885, roughness: 0.95 }));
        (c.position.set(s, 0.08, o),
          e.group.add(c),
          e.solids.push({ x: e.origin.x + s, z: e.origin.z + o, hw: 0.6, hd: 0.6 }));
      }
  }
  var Zc = [],
    yr = new Tn(40, 2, 1, 60),
    b6 = 0,
    z3 = 0;
  yr.layers.enableAll();
  function kA(i, e) {
    let t = i,
      n = t.fz ?? i.z,
      s = Math.max(2.2, Math.min(4.2, t.top ?? 3.2) - 0.05),
      o = t.winX ? t.winX[0] + 0.02 : i.x - (i.w - 0.3) / 2,
      r = t.winX ? t.winX[1] - 0.02 : i.x + (i.w - 0.3) / 2;
    {
      let y = [];
      K.children.forEach((w) => {
        w.userData.prop === "shop" && y.push(w);
      });
      let x = new Ls(),
        b = (t.fz ?? i.z) - (i.id === "grocery" ? 0.55 : 0.45) / 2;
      for (let w of [-1, 1]) {
        let v = 1 / 0;
        for (let _ of [0.9, 1.6, 2.3]) {
          (x.set(new H(i.x + w * (i.w / 2 + 4), _, b), new H(-w, 0, 0)), (x.far = i.w / 2 + 4));
          let S = x
            .intersectObjects(y, !0)
            .find((M) => M.object.visible !== !1 && Math.abs(M.point.x - i.x) < i.w / 2 + 0.6);
          S && (v = Math.min(v, Math.abs(S.point.x - i.x)));
        }
        if (v < 1 / 0) {
          let _ = i.x + w * (v - 0.24);
          w < 0 ? (o = Math.max(o, _)) : (r = Math.min(r, _));
        }
      }
    }
    let a = r - o,
      c = (o + r) / 2,
      l = i.id === "grocery" ? 0.55 : 0.45,
      h = 5,
      f = new qn(1024, Math.round((1024 * s) / a), { type: Zi });
    f.texture.colorSpace = fi;
    let d = e.origin,
      u = d.z + e.D / 2,
      p = new H(d.x + (c - i.x), s / 2, u + h),
      m = new H(d.x + (c - i.x), s / 2, u - 20),
      E = new R(new Te(a, s), new be({ map: f.texture }));
    (E.position.set(c, s / 2, n - l), K.add(E));
    let g = new be({ color: 3813416 });
    for (let y of [-1, 1]) {
      let x = new R(new Te(l, s), g);
      (x.position.set(c + (y * a) / 2, s / 2, n - l / 2), (x.rotation.y = (-y * Math.PI) / 2), K.add(x));
    }
    Zc.push({
      ins: e,
      rt: f,
      pos: p,
      look: m,
      fov: (2 * Math.atan(s / 2 / h) * 180) / Math.PI,
      aspect: a / s,
      near: h + 0.08,
      at: new H(i.x, 0, i.z),
      done: !1,
    });
  }
  function x6(i) {
    (yr.position.copy(i.pos),
      (yr.fov = i.fov),
      (yr.aspect = i.aspect),
      (yr.near = i.near),
      (yr.far = 40),
      yr.updateProjectionMatrix(),
      yr.lookAt(i.look));
    let e = !i.ins.group.parent;
    e && K.add(i.ins.group);
    let t = x0.intensity,
      n = ii.intensity;
    ((x0.intensity = Math.max(t, 1.25)), (ii.intensity = Math.max(n, 0.5)));
    let s = K.fog;
    ((K.fog = null),
      dn.setRenderTarget(i.rt),
      dn.render(K, yr),
      dn.setRenderTarget(null),
      (K.fog = s),
      (i.done = !0),
      (x0.intensity = t),
      (ii.intensity = n),
      e && K.remove(i.ins.group));
  }
  // v79: เดินเข้าใกล้ประตูร้าน (<14 ม.) → ทยอยส่งโมเดล/ภาพในร้านขึ้นการ์ดจอทีละ 40 ชิ้นต่อเฟรม
  // เข้าร้านแล้วจะไม่ค้าง (เดิมถูกจังมาร์ทต้องอัปโหลด ~400 เมช + 50 ภาพในเฟรมเดียวตอนเข้าประตู)
  var cW = { shop: null, list: null, k: 0, rt: null, cam: null, done: new Set() };
  function ccsWarmShop() {
    let i = Le[0];
    if (Se || !j.started || !i) return;
    if (!cW.list) {
      let a = null,
        l = 14;
      for (let c of zn) {
        let h = c.door ? Math.hypot(i.pos.x - c.door.x, i.pos.z - c.door.z) : 1 / 0;
        !cW.done.has(c) && h < l && ((a = c), (l = h));
      }
      if (!a) return;
      ((cW.shop = a), (cW.list = []), (cW.k = 0));
      a.inside.group.traverse((c) => {
        (c.isMesh || c.isPoints || c.isSprite) && cW.list.push(c);
      });
      (cW.rt ?? (cW.rt = new qn(4, 4, { type: Zi })), cW.cam ?? (cW.cam = new Tn(60, 1, 0.1, 60)));
      return;
    }
    let e = cW.shop.inside.group,
      t = !e.parent,
      n = cW.list.slice(cW.k, cW.k + 40),
      s = new Set(n),
      o = [],
      r = dn.shadowMap.autoUpdate;
    cW.k += 40;
    try {
      t && K.add(e);
      for (let a of cW.list) (o.push([a, a.visible, a.frustumCulled]), s.has(a) ? (a.frustumCulled = !1) : (a.visible = !1));
      (cW.cam.position.copy(e.position).add(new H(0, 3, 0)),
        cW.cam.updateMatrixWorld(),
        (dn.shadowMap.autoUpdate = !1),
        dn.setRenderTarget(cW.rt),
        dn.render(K, cW.cam));
    } catch (a) {
      (console.warn("warm shop", a), (cW.k = cW.list.length));
    } finally {
      (dn.setRenderTarget(null), (dn.shadowMap.autoUpdate = r));
      for (let [a, c, l] of o) ((a.visible = c), (a.frustumCulled = l));
      t && K.remove(e);
    }
    cW.k >= cW.list.length && (cW.done.add(cW.shop), (cW.list = null), console.log(`[perf] เตรียมร้าน ${cW.shop.def.name} ล่วงหน้าแล้ว`));
  }
  function PA(i) {
    if (!Zc.length) return;
    let e = Zc.find((s) => !s.done);
    if (e) {
      x6(e);
      return;
    }
    if ((b6 -= i) > 0 || Se || GE) return; // v79: มือถือไม่วาดภายในร้านลงหน้าต่างซ้ำทุก 1.2 วิ (ถูกจังมาร์ทล้านกว่าเหลี่ยม ทำให้กระตุกเป็นจังหวะ)
    b6 = 1.2;
    let t = Le[0];
    z3 = (z3 + 1) % Zc.length;
    let n = Zc[z3];
    t && Math.hypot(t.pos.x - n.at.x, t.pos.z - n.at.z) < 40 && x6(n);
  }
  function IA() {
    Wy.forEach((t, n) => {
      let s = qy(t, K);
      s.group.userData.prop = "shop";
      let o = t.id === "grocery" && ze("donki_store"),
        r = o ? cA(s, t) : ze("market") ? oA(s, t) : 0;
      pt.push(s.solid);
      let a = Xy(t, K, new H(400 + n * 40, 0, 760), g4(t.id), VE.texture, t.id === "grocery" && ze("donki_store"));
      if ((WE.set(a, iE(new H(t.x, 0, t.z), 1, a.W, 4.6, 1.45)), !r)) {
        let f = (F4[t.id] ?? []).filter((d) => ze(d));
        s.vitrine.forEach((d, u) => {
          if (!f.length) return;
          let p = je(f[(u * 5 + n) % f.length], 0.34);
          (p.position.copy(d), (p.rotation.y = ((u % 3) - 1) * 0.35), K.add(p));
        });
      }
      if ((OH(t.id, a), CA(t.id, a), o && fA(a), t.id === "groom")) {
        let f = RM();
        (f.position.set(-4.7, 0, 3.7),
          (f.userData.noMerge = !0),
          a.group.add(f),
          (uE = f),
          a.solids.push({ x: a.origin.x - 4.7, z: a.origin.z + 3.7, hw: 1.1, hd: 0.65 }));
      }
      let c = vM(t, r, o);
      (K.add(c.group),
        I4.push(c),
        c.group.updateMatrixWorld(!0),
        c.group.traverse((f) => {
          let d = f;
          if (!d.isMesh) return;
          let u = new mt().setFromObject(d),
            p = u.getSize(new H());
          if (u.min.y > 0.6 || p.y < 0.15 || u.min.z < t.z - 0.05 || Math.max(p.x, p.z) < 0.25) return;
          let m = u.getCenter(new H());
          pt.push({ x: m.x, z: m.z, hw: p.x / 2, hd: p.z / 2 });
        }));
      let l = Ic({ ...zy[n], plain: !0 });
      (l.root.position.copy(a.keeperSpot), K.add(l.root), kA(t, a));
      let h = new En(16763e3, 0, 11, 1.4);
      (h.position.set(t.x, 2.4, t.z + 1.6),
        K.add(h),
        pd(t.x, t.z + 2.2, 3.2, 0.8),
        zn.push({
          def: t,
          door: s.door,
          glassM: s.glassM,
          lampM: s.lampM,
          nightM: s.nightM,
          glassF: s.glassF,
          shopLight: h,
          inside: a,
          keeper: l,
        }));
    });
    let i = new X({ color: 11565636, roughness: 0.8 }),
      e = new X({ color: 4147802, roughness: 0.5 });
    for (let [t, n, s] of [
      [-16, Mt + 0.5, Math.PI],
      [4, Mt + 0.5, Math.PI],
      [40, Mt + 0.5, Math.PI],
      [-37.6, 40, -Math.PI / 2],
      [-46, 49.6, Math.PI],
    ]) {
      let o = new J(),
        r = Math.sin(s),
        a = Math.cos(s),
        c = Math.cos(s),
        l = -Math.sin(s);
      for (let h of [-0.55, 0.55])
        ua.push({
          p: new H(t + c * h + r * 0.2, 0, n + l * h + a * 0.2),
          front: new H(t + c * h + r * 0.75, 0, n + l * h + a * 0.75),
          yaw: s,
          who: null,
        });
      if (ze("table_bench")) {
        let h = je("table_bench");
        ((h.rotation.y = Math.PI / 2), h.scale.set(1.1, 0.6, 1.1), o.add(h));
      } else {
        for (let h = 0; h < 3; h++) {
          let f = new R(new ee(2.2, 0.08, 0.16), i);
          (f.position.set(0, 0.55, -0.2 + h * 0.2), o.add(f));
        }
        for (let h = 0; h < 2; h++) {
          let f = new R(new ee(2.2, 0.14, 0.06), i);
          (f.position.set(0, 0.8 + h * 0.2, -0.32), o.add(f));
        }
        for (let h of [-0.95, 0.95]) {
          let f = new R(new ee(0.08, 0.55, 0.5), e);
          (f.position.set(h, 0.28, -0.05), o.add(f));
        }
      }
      (o.position.set(t, 0, n),
        (o.rotation.y = s),
        o.traverse((h) => {
          h.castShadow = !0;
        }),
        K.add(o),
        pt.push(
          Math.abs(Math.sin(s)) > 0.5
            ? { x: t, z: n, hw: 0.4, hd: 1.2, low: !0 }
            : { x: t, z: n, hw: 1.2, hd: 0.4, low: !0 },
        ));
    }
    EM(K, ll.x, ll.z);
  }
  var FA = null,
    ll = new H(49, 0, 21.5);
  function zA(i) {
    let e = new R(new gt(i, 20), new be({ color: 1981460, transparent: !0, opacity: 0.22, depthWrite: !1 }));
    return ((e.rotation.x = -Math.PI / 2), K.add(e), e);
  }
  function LA(i, e, t) {
    let n = new vi({ map: i, transparent: !0, alphaTest: 0.05, toneMapped: !1 }),
      s = new zi(n);
    return (s.center.set(0.5, 0), s.scale.set(e, t, 1), K.add(s), s);
  }
  var DA = new H(),
    Ni = new H(),
    Le = [],
    Se = null;
  function Sd(i) {
    (_r.length && (Se && Se !== i && K.remove(Se.group), i && K.add(i.group)),
      (Se = i),
      document.body.classList.toggle("indoors", !!i),
      (qE = 0));
  }
  var wi = [],
    L3 = [
      "ต้นข้าว",
      "มะปราง",
      "ปั้นแป้ง",
      "น้ำหวาน",
      "ข้าวปุ้น",
      "ใบเตย",
      "ส้มจี๊ด",
      "ภูผา",
      "ฟ้าใส",
      "แพรวา",
      "บุญมี",
      "กล้วยไข่",
      "ขนมจีบ",
      "เจ้าสัว",
      "ป้าแจ๋ว",
      "ลุงเปี๊ยก",
      "น้าหมู",
      "พี่ต่าย",
      "เจ๊หงส์",
      "ตาชื่น",
      "ยายบุญ",
      "หมอกควัน",
      "สายรุ้ง",
      "มะลิ",
      "ชมพู่",
      "ทองคำ",
      "นิลุบล",
      "กะทิ",
      "โอวัลติน",
      "ไอติม",
      "ลูกชิ้น",
      "ปลาทอง",
      "บัวลอย",
      "ทับทิม",
      "มะนาว",
      "เต้าหู้",
      "ข้าวเหนียว",
      "ขนุน",
      "ลำไย",
      "พริกหวาน",
      "อาทิตย์",
      "จันทร์เพ็ญ",
      "ดาวเหนือ",
      "ลมหนาว",
      "ป๊อปคอร์น",
      "คุกกี้",
      "มาการอง",
      "บราวนี่",
      "น้องเนย",
      "พี่ตูน",
      "ครูแดง",
      "ช่างเอก",
      "หมอนิด",
      "แม่ค้าอร",
      "ลุงยาม",
      "ตี๋เล็ก",
      "หมวยใหญ่",
      "ปุยฝ้าย",
      "ก้อนเมฆ",
      "หยาดฝน",
    ],
    gE = new Set();
  function EE() {
    let i = L3.filter((t) => !gE.has(t)),
      e = i.length
        ? i[Math.floor(Math.random() * i.length)]
        : L3[Math.floor(Math.random() * L3.length)] + " " + (2 + Math.floor(Math.random() * 8));
    return (gE.add(e), e);
  }
  var Nn = [],
    z4 = [],
    y6 = [
      [54, 12],
      [-46, 31],
      [-26, -14],
      [30, -40],
      [-50, -26],
    ],
    BA = {},
    OA = ["cream", "white", "black", "red", "blue"],
    L4 = new URLSearchParams(location.search).get("cdn"),
    M6 = L4 ?? "https://chowchowstory-cdn.pumper2500.workers.dev/farm/",
    l1 = "",
    bE = new Map(),
    D4 = (async () => {
      if (!(
        window.__M ||
        (!L4 && (!/^https:/.test(location.protocol) || /localhost|127\.0\.0\.1/.test(location.hostname)))
      )) {
        try {
          let i = new AbortController(),
            e = setTimeout(() => i.abort(), 2500),
            t = await fetch(M6 + "cdn-ok.txt", { cache: "no-store", signal: i.signal });
          clearTimeout(e);
          let n = t.ok ? await t.text() : "";
          if (n.startsWith("ccs")) {
            l1 = M6;
            for (let s of n
              .split(
                `
`,
              )
              .slice(1)) {
              let [o, r] = s.trim().split(/\s+/);
              o && bE.set(o, r ?? "");
            }
          }
        } catch {}
        console.log("[cdn]", l1 || "ไฟล์บน Vercel");
      }
    })(),
    nb = (i) => (l1 && bE.has(i) ? `${l1}${i}?v=${bE.get(i)}` : i),
    Zt = (i) => window.__M?.[i] ?? nb(`${i}.glb`),
    Hi = new H(74, 0, 27),
    NA = [
      {
        key: "poodle",
        name: "ขนมปัง",
        kind: "พุดเดิ้ลขนหยิก",
        home: [46, 4],
        tint: void 0,
        speed: 2.2,
        lines: [
          "หยิกทั้งตัวเลยนะ แต่ไม่ร่วงสักเส้น ✨",
          "ขนมปังชอบวิ่งเล่นในสวน!",
          "เจอข้าวต้มทีไรต้องดมก้นทุกที 🐾",
        ],
      },
      {
        key: "bulldog",
        name: "ตึ๋ง",
        kind: "บูลด็อก",
        home: [-20, 4.5],
        tint: 14859408,
        speed: 1.4,
        lines: [
          "ฟืด… ฟืด… อากาศร้อนต้องนอนในร่ม 💤",
          "หน้าย่นแต่ใจดีนะ",
          "ตึ๋งเฝ้าถนนเส้นนี้เอง 🛡",
        ],
      },
      {
        key: "a1",
        anim: "dog",
        h: 0.8,
        name: "ถุงทอง",
        kind: "หมาบ้าน",
        home: [6, 9],
        speed: 2.4,
        lines: [
          "โฮ่ง! มาวิ่งแข่งกันไหม",
          "ถุงทองชอบนอนหน้าร้านของชำ",
          "ใครมีขนมบ้าง 🍪",
        ],
      },
      {
        key: "a2",
        anim: "dog",
        h: 0.72,
        name: "มะลิ",
        kind: "หมาบ้าน",
        home: [36, 9],
        speed: 2.6,
        lines: [
          "มะลิชอบน้ำพุที่สุด 💦",
          "วันนี้อากาศดีจัง",
          "โฮ่ง ๆ",
        ],
      },
      {
        key: "a3",
        anim: "kitty",
        h: 0.45,
        name: "ส้มโอ",
        kind: "แมวส้ม",
        home: [14, -13],
        speed: 1.8,
        lines: [
          "เมี๊ยว~ อย่าเห่าใส่นะ",
          "ส้มโอนอนบนหลังคาร้านทุกบ่าย 😼",
          "ปลาทูอยู่ไหนน้า",
        ],
      },
      {
        key: "a4",
        anim: "kitty",
        h: 0.42,
        name: "นิล",
        kind: "แมวดำ",
        home: [-44, -10],
        speed: 1.8,
        lines: [
          "เมี้ยว…",
          "นิลไม่ใช่แมวโชคร้ายนะ เป็นแมวโชคดี! ✨",
          "อย่ามาแย่งที่นอนกันน้า",
        ],
      },
      {
        key: "a7",
        anim: "pinguin",
        h: 0.75,
        name: "ปิงปอง",
        kind: "เพนกวิน",
        home: [6, 64],
        speed: 1.2,
        roam: 4,
        lines: [
          "ร้อนจัง ขอไปแช่น้ำก่อน 🐧",
          "ปิงปองมากับเรือเมื่อวาน",
          "ปลาสดอยู่ท่าเรือนะ",
        ],
      },
      {
        key: "a8",
        anim: "pinguin",
        h: 0.65,
        name: "ปิงปิง",
        kind: "เพนกวิน",
        home: [-6, 63],
        speed: 1.2,
        roam: 4,
        lines: [
          "🐧💙",
          "เดินเตาะแตะแต่ไม่ช้านะ!",
        ],
      },
      {
        key: "a9",
        anim: "deer",
        h: 1.5,
        name: "กวางน้อย",
        kind: "กวาง",
        home: [-44, -38],
        speed: 2,
        roam: 9,
        lines: [
          "ชู่… อย่าส่งเสียงดัง ป่าเงียบดีนะ",
          "ใบไม้ตรงนี้อร่อย 🌿",
        ],
      },
      {
        key: "a10",
        anim: "horse",
        h: 1.9,
        name: "เจ้าโพนี่",
        kind: "ม้า",
        home: [-30, 48],
        speed: 1.8,
        roam: 8,
        lines: [
          "ฮี้~ หญ้าแถวบ่อนี่หวานดี",
          "อยากขี่หลังเล่นไหม? ล้อเล่น 🐴",
        ],
      },
      {
        key: "b1",
        beast: "rott",
        name: "ดุ๊กดิ๊ก",
        kind: "ร็อตไวเลอร์",
        home: [-56, -18],
        speed: 2.2,
        roam: 7,
        lines: [
          "หน้าดุแต่ใจดีนะ 🐾",
          "เฝ้าบ้านให้ทั้งซอยเลย",
          "โฮ่ง! (แปลว่าสวัสดี)",
        ],
      },
      {
        key: "b2",
        beast: "doberman",
        name: "เจ้าสิงห์",
        kind: "โดเบอร์แมน",
        home: [16, -22],
        speed: 2.6,
        roam: 8,
        lines: [
          "วิ่งเร็วที่สุดในเมือง ⚡",
          "หูตั้งแบบนี้ได้ยินทุกอย่างนะ",
          "มาวิ่งแข่งกันไหม",
        ],
      },
      {
        key: "b3",
        beast: "pitt",
        name: "ตูบตูบ",
        kind: "ชาไป่",
        real: "pet_sharpei",
        home: [6, 17],
        speed: 1.6,
        roam: 6,
        lines: [
          "หน้าย่นแต่ยิ้มกว้างสุดในเมือง 😁",
          "ลิ้นม่วงเหมือนเชาเชาเลยนะ",
          "เล่นชักเย่อกันไหม",
        ],
      },
      {
        key: "b4",
        beast: "labrador",
        real: "pet_labrador",
        name: "ข้าวปั้น",
        kind: "ลาบราดอร์",
        home: [28, 20],
        speed: 2.2,
        roam: 8,
        lines: [
          "ว่ายน้ำเก่งนะ ไปทะเลกัน 🌊",
          "กินเก่งด้วย อิอิ",
          "ลูกบอลอยู่ไหนน้า 🎾",
        ],
      },
      {
        key: "b5",
        beast: "chihuahua",
        name: "จิ๋ว",
        kind: "ชิวาวา",
        home: [-4, -16],
        speed: 2.4,
        roam: 5,
        lines: [
          "ตัวเล็กแต่ใจใหญ่!",
          "ยิป ๆ ๆ",
          "อย่าเหยียบหนูนะ",
        ],
      },
      {
        key: "b6",
        beast: "redpanda",
        name: "ส้มจี๊ด",
        kind: "แพนด้าแดง",
        home: [-50, 54],
        speed: 1.4,
        roam: 6,
        lines: [
          "ชอบปีนต้นไม้ที่สุด 🌳",
          "หางฟูไหมล่ะ",
          "กินหน่อไม้อร่อย",
        ],
      },
      {
        key: "b7",
        beast: "redpanda",
        name: "ส้มโอ้",
        kind: "แพนด้าแดง",
        home: [12, 36],
        speed: 1.4,
        roam: 6,
        lines: [
          "งีบใต้ต้นไม้ดีที่สุด 💤",
          "เดินช้า ๆ ไม่ต้องรีบ",
        ],
      },
      {
        key: "z1",
        beast: "horse",
        name: "ม้าน้ำตาล",
        kind: "ม้า",
        home: [Hi.x - 6, Hi.z - 5],
        speed: 1.8,
        roam: 6,
        lines: [
          "ฮี้ ~ ยินดีต้อนรับสู่ฟาร์มสัตว์ 🐴",
          "หญ้าตรงนี้หวานมาก",
        ],
      },
      {
        key: "z2",
        beast: "zebra",
        name: "ลายพาดกลอน",
        kind: "ม้าลาย",
        home: [Hi.x + 5, Hi.z + 3],
        speed: 1.8,
        roam: 6,
        lines: [
          "ลายขาวดำ ไม่มีตัวไหนเหมือนกันนะ 🦓",
          "ถ่ายรูปได้เลย",
        ],
      },
      {
        key: "z3",
        beast: "giraffe",
        name: "คอยาว",
        kind: "ยีราฟ",
        home: [Hi.x + 6, Hi.z - 5],
        speed: 1.4,
        roam: 5,
        lines: [
          "มองเห็นทะเลจากตรงนี้ด้วย 🦒",
          "ใบไม้บนยอดอร่อยสุด",
        ],
      },
      {
        key: "z4",
        beast: "lama",
        name: "ลามะปุยฝ้าย",
        kind: "ลามะ",
        home: [Hi.x - 5, Hi.z + 5],
        speed: 1.5,
        roam: 5,
        lines: [
          "ขนนุ่มมาก ลองลูบดูสิ ☁️",
          "อย่าทำให้โกรธนะ เดี๋ยวถุยน้ำลาย 😤",
        ],
      },
    ],
    El = [];
  function GA() {
    let t = new J();
    t.position.copy(Hi);
    let n = new X({ map: Cn(13208139, "#7a4a24"), roughness: 0.8 }),
      s = 3.2,
      o = (p, m, E, g) => {
        let y = Math.hypot(E - p, g - m),
          x = Math.max(1, Math.round(y / 2.2)),
          b = Math.atan2(E - p, g - m);
        for (let _ = 0; _ <= x; _++) {
          let S = _ / x,
            M = new R(new ee(0.16, 1.2, 0.16), n);
          (M.position.set(p + (E - p) * S, 0.6, m + (g - m) * S), t.add(M));
        }
        for (let _ of [0.45, 0.95]) {
          let S = new R(new ee(0.08, 0.12, y), n);
          (S.position.set((p + E) / 2, _, (m + g) / 2), (S.rotation.y = b), t.add(S));
        }
        let w = Hi.x + (p + E) / 2,
          v = Hi.z + (m + g) / 2;
        pt.push({ x: w, z: v, hw: Math.abs(E - p) / 2 + 0.15, hd: Math.abs(g - m) / 2 + 0.15 });
      };
    (o(-24 / 2, -20 / 2, -s / 2, -20 / 2),
      o(s / 2, -20 / 2, 24 / 2, -20 / 2),
      o(-24 / 2, 20 / 2, 24 / 2, 20 / 2),
      o(-24 / 2, -20 / 2, -24 / 2, 20 / 2),
      o(24 / 2, -20 / 2, 24 / 2, 20 / 2));
    for (let p of [-s / 2, s / 2]) {
      let m = new R(new ee(0.25, 3, 0.25), n);
      (m.position.set(p, 1.5, -20 / 2), t.add(m));
    }
    let r = new R(new ee(s + 0.8, 0.3, 0.3), n);
    (r.position.set(0, 3, -20 / 2), t.add(r));
    let a = new R(
      new Te(3.4, 0.7),
      new be({
        map: ei(
          "🐾 ฟาร์มสัตว์น่ารัก",
          16774885,
          3050327,
          512,
          106,
        ),
        side: Ke,
      }),
    );
    (a.position.set(0, 3.55, -20 / 2 - 0.05), (a.rotation.y = Math.PI), (a.material.side = ji), t.add(a));
    {
      let p = a.clone();
      ((p.rotation.y = 0), (p.position.z = -20 / 2 + 0.05), t.add(p));
    }
    {
      let p = new H(6.5, 0, 5),
        m = new R(new gt(1.7, 32), new bt({ color: 7311210 }));
      ((m.rotation.x = -Math.PI / 2), m.position.set(p.x, 0.03, p.z), t.add(m));
      let E = new R(
        new gt(1.6, 32),
        new X({ color: 5224168, roughness: 0.08, metalness: 0.1, transparent: !0, opacity: 0.88 }),
      );
      ((E.rotation.x = -Math.PI / 2), E.position.set(p.x, 0.09, p.z), t.add(E));
      let g = new X({ color: 11116950, roughness: 0.9 });
      for (let y = 0; y < 14; y++) {
        let x = (y / 14) * Math.PI * 2,
          b = new R(new Qa(0.28, 0), g);
        (b.position.set(p.x + Math.cos(x) * 1.75, 0.12, p.z + Math.sin(x) * 1.75),
          b.scale.set(1.2, 0.6, 1),
          (b.rotation.y = y),
          t.add(b));
      }
      for (let y = 0; y < 3; y++) {
        let x = new R(new gt(0.22, 12), new bt({ color: 5941322 }));
        ((x.rotation.x = -Math.PI / 2), x.position.set(p.x - 0.6 + y * 0.5, 0.1, p.z + (y % 2 ? 0.5 : -0.4)), t.add(x));
      }
      pt.push({ x: Hi.x + p.x, z: Hi.z + p.z, hw: 1.5, hd: 1.5, low: !0 });
    }
    let c = new X({ color: 15188570, roughness: 0.95 }),
      l = new R(new ee(2.4, 0.5, 0.7), n);
    (l.position.set(-4, 0.25, 2), t.add(l));
    let h = new R(new ee(2.2, 0.12, 0.55), c);
    (h.position.set(-4, 0.52, 2), t.add(h));
    let f = new R(new ee(2, 0.45, 0.7), UA(9079434));
    (f.position.set(4, 0.23, -2), t.add(f));
    let d = new R(new Te(1.8, 0.55), new X({ color: 6080757, roughness: 0.1 }));
    ((d.rotation.x = -Math.PI / 2), d.position.set(4, 0.44, -2), t.add(d));
    for (let [p, m] of [
      [-9, 7],
      [-7.6, 7.4],
      [9, 7],
    ]) {
      let E = new R(new re(0.55, 0.55, 1, 16), c);
      ((E.rotation.z = Math.PI / 2), E.position.set(p, 0.55, m), t.add(E));
    }
    let u = new R(new Te(24 - 0.4, 20 - 0.4), new bt({ color: 11901546 }));
    ((u.rotation.x = -Math.PI / 2),
      (u.position.y = 0.025),
      (u.receiveShadow = !0),
      t.add(u),
      t.traverse((p) => {
        p.castShadow = !0;
      }),
      K.add(t));
    for (let [p, m, E, g] of [
      [-4, 2, 1.3, 0.45],
      [4, -2, 1.1, 0.45],
    ])
      pt.push({ x: Hi.x + p, z: Hi.z + m, hw: E, hd: g, low: !0 });
  }
  var UA = (i) => new X({ color: i, roughness: 0.6 });
  async function VA() {
    (await D4,
      await Promise.all([
        mp(Zt("chow"), 1.15),
        mp(Zt("poodle"), 0.95, "poodle"),
        mp(Zt("bulldog"), 0.78, "bulldog"),
        Ny((i) => Zt("b_" + i)),
      ]),
      GA());
    for (let i of NA) {
      let e = (i.anim === "horse" || i.beast === "horse") && Xg("horse2");
      if (!e && (i.beast ? !Kg(i.beast) : i.anim ? !Xg(i.anim) : !Fc(i.key))) continue;
      let t = i.real && vp[i.real]
        ? ccsTB(i.real, i.real === "pet_labrador" ? 0.46 : 0.42) // v113: หมาในเมืองใช้โมเดลหมาจริง
        : e
        ? Yg("horse2", i.beast ? 2 : 1.85)
        : i.beast
          ? Kr(i.beast)
          : i.anim
            ? Yg(i.anim, i.h ?? 0.8)
            : i.key === "bulldog" && vp.pet_britbull
              ? ccsTB("pet_britbull", 0.42)
              : ui("orange", 0.8, i.key, i.tint);
      (ccsLifeOn(t), K.add(t.root));
      let n = new H(i.home[0], 0, i.home[1]);
      po(n) && (n.z += n.z < 0 ? -7 : 7);
      for (let s = 0; s < 60 && (ri(n, 0.9) || po(n)); s++)
        n.set(i.home[0] + Math.cos(s) * s * 0.5, 0, i.home[1] + Math.sin(s) * s * 0.5);
      El.push({ rig: t, pos: n, home: n.clone(), target: n.clone(), wait: 1, def: i, petT: 0, spd: 0 });
    }
    for (let i = 0; i < 1; i++) {
      let [e, t] = Ly[i],
        n = Fc()
          ? ui(i === 0 ? (z.coat ?? "orange") : OA[i - 1], i === 0 ? 0.8 : 0.72)
          : Py(e, t, i === 0 ? 0.76 : 0.68);
      K.add(n.root);
      let s = i === 0 ? new H(-30, 0, 12) : new H(y6[i - 1][0], 0, y6[i - 1][1]);
      Le.push({ rig: n, pos: s, found: i === 0, idx: i, face: 1, phase: Math.random() * 6, dir: null, spd: 0 });
    }
    for (let i = 0; i < hg.length; i++) {
      let e = Ic(Sh[i]);
      K.add(e.root);
      let t = new H(-40 + i * 11, 0, i % 2 ? ns : -ns);
      wi.push({
        rig: e,
        pos: t,
        target: t.clone(),
        speed: Math.min(3.2, (hg[i].speed ?? 18) / 9),
        face: 1,
        wait: Math.random() * 2,
        t: Math.random() * 5,
        talkT: 0,
        path: [],
        name: es[i]?.name ?? EE(),
      });
    }
    if (mr())
      for (let i = 0; i < 18; i++) {
        let e = Zr(Hh(100 + i * 13));
        K.add(e.root);
        let t = new H(-70 + i * 8 + Math.random() * 3, 0, i % 2 ? ns : -ns);
        Nn.push({
          rig: e,
          pos: t,
          target: t.clone(),
          speed: 1.1 + Math.random() * 0.9,
          face: 1,
          wait: Math.random() * 3,
          t: Math.random() * 5,
          talkT: 0,
          path: [],
          life: 30 + Math.random() * 120,
          leave: null,
          name: EE(),
        });
      }
    for (let i = 0; i < 44; i++) T6(i < 34 ? "food" : "bone");
    for (let [i, e] of [
      [-33, -Mt - 0.2],
      [12, -Mt - 0.2],
      [44, Mt + 1.2],
      [-43, 31],
      [26, -30],
      [-2, 30],
      [5, 54],
      [52, -14],
    ])
      T6("bowl", new H(i, 0, e));
  }
  function P0() {
    for (let i = 0; i < 40; i++) {
      let e = Math.random() * Math.PI * 2,
        t = 4 + Math.sqrt(Math.random()) * (E0 - 6),
        n = new H(Math.cos(e) * t, 0, Math.sin(e) * t);
      if (!ri(n, 0.8)) return n;
    }
    return new H(0, 0, 2);
  }
  function T6(i, e) {
    let t = i === "food" ? iM() : void 0,
      n = i === "food" ? pi[t].make() : i === "bone" ? eM() : i === "poop" ? l3() : tM();
    (n.scale.setScalar(i === "bowl" ? 1.15 : 1.5), K.add(n));
    let s = e ?? P0();
    z4.push({ sp: n, shadow: zA(i === "bowl" ? 0.5 : 0.4), pos: s, kind: i, food: t, alive: !0, respawn: 0 });
  }
  function vr(i, e) {
    let t = 0;
    for (let n of cl) {
      if (!n.o.visible) continue;
      let s = i.x - n.pos.x,
        o = i.z - n.pos.z,
        r = Math.sin(n.yaw),
        a = Math.cos(n.yaw),
        c = Math.abs(s * r + o * a),
        l = Math.abs(s * a - o * r),
        h = Math.min(n.hl + e - c, n.hw + e - l);
      h > t && (t = h);
    }
    return t;
  }
  function ri(i, e = 0.5, t = !1, n = !1) {
    if (Se) {
      let o = Se.bounds;
      if (i.x < o.x0 || i.x > o.x1 || i.z < o.z0 || i.z > o.z1) return !0;
      for (let r of Se.solids)
        if (Math.abs(i.x - r.x) < r.hw + e * 0.6 && Math.abs(i.z - r.z) < r.hd + e * 0.6) return !0;
      return !1;
    }
    if (
      !((Math.abs(i.x) < 1.9 && i.z > Rt - 1.5 && i.z < Rt + 23.5) || Rd(i.x, i.z) !== null || ba(i.x, i.z) !== null) &&
      (i.z > Rt + 5.2 || Math.abs(i.x) > 150 || i.z < -150)
    )
      return !0;
    {
      let o = Math.hypot(i.x - kn.x, i.z - kn.z);
      if ((!t && Math.abs(o - 7.31) < 0.37 + e * 0.7) || o < 4.02 * xr + e * 0.5) return !0;
    }
    for (let o of pt) if (!(t && o.low) && Math.abs(i.x - o.x) < o.hw + e && Math.abs(i.z - o.z) < o.hd + e) return !0;
    if (!n && vr(i, e) > 0) return !0;
    for (let o of lo) if (Math.hypot(i.x - o.x, i.z - o.z) < 0.9 + e * 0.3) return !0;
    return !1;
  }
  function hl(i, e = 0.5) {
    let t = 0,
      n = Se ? Se.solids : pt,
      s = Se ? 0.6 : 1;
    for (let o of n) {
      let r = Math.min(o.hw + e * s - Math.abs(i.x - o.x), o.hd + e * s - Math.abs(i.z - o.z));
      r > t && (t = r);
    }
    if (!Se)
      for (let o of lo) {
        let r = 0.9 + e * 0.3 - Math.hypot(i.x - o.x, i.z - o.z);
        r > t && (t = r);
      }
    return t;
  }
  function h1(i, e = 0.5) {
    if (!ri(i, e)) return i;
    for (let t = 1; t <= 12; t++)
      for (let n = 0; n < 16; n++) {
        let s = (n / 16) * Math.PI * 2,
          o = i.clone().add(new H(Math.sin(s), 0, Math.cos(s)).multiplyScalar(t * 0.35));
        if (!ri(o, e)) return o;
      }
    return i;
  }
  var it = (i) => document.getElementById(i),
    fa = {
      score: it("score"),
      bones: it("bones"),
      friends: it("friends"),
      clock: it("clock"),
      money: it("money"),
      date: it("date"),
    },
    cd = it("bubble"),
    D3 = it("toast"),
    B4 = it("mini"),
    Vt = B4.getContext("2d"),
    w6;
  function De(i, e = 2600) {
    ((D3.textContent = i),
      D3.classList.add("on"),
      clearTimeout(w6),
      (w6 = setTimeout(() => D3.classList.remove("on"), e)));
  }
  // v82: อีโมจิ 3D (จาก emojis_pack.glb เรนเดอร์เป็นแผ่นภาพ emoji3d.png 8×6 ช่อง) แทนอีโมจิตัวอักษรในกรอบคำพูด/ป้ายลอย
  var ccsE3 = (() => {
      let i = {},
        e = [
          "😀😁😄😆", "😕🫤", "😳", "🙄", "🤔", "🤪", "🤣", "😜", "😤😡😠💢", "😵", "🤨", "😮😯😲", "😨😰", "🥺", "🤕", "😎",
          "🥵", "👍", "👎", "❤💖💗🧡💛💚💙💜", "⭐🌟✨", "💕💞💓", "🥳🎉", "🤤😋", "😊☺", "😴💤", "😛", "😅", "😱😭", "😢😞😔☹😿",
          "🤯", "🥶", "😬🤢", "😉", "😘", "🤓", "😒", "🙂😃", "😗", "😍🥰", "😂", "💩", "😐😑", "🥴", "😌",
        ];
      return (e.forEach((t, n) => [...t].forEach((s) => (i[s] = n))), i);
    })(),
    ccsE3re = /(\p{Extended_Pictographic})️?/gu;
  function emoHTML(i) {
    let e = String(i).replace(/[&<>"]/g, (t) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[t]);
    return e.replace(ccsE3re, (t, n) => {
      let s = ccsE3[n];
      return s === void 0 ? t : `<i class="e3d" style="background-position:${((s % 8) / 7) * 100}% ${(Math.floor(s / 8) / 5) * 100}%"></i>`;
    });
  }
  // ชาวเมืองพูด: ถ้าประโยคยังไม่มีอีโมจิ ใส่ให้ตามอารมณ์ของประโยค
  function emoMood(i) {
    if (ccsE3re.test(i)) return ((ccsE3re.lastIndex = 0), i);
    ccsE3re.lastIndex = 0;
    let e = [
      [/อร่อย|หิว|กิน|ขนม|ปลา|ไก่|ข้าว/, "😋"],
      [/ร้อน|แดด/, "🥵"],
      [/หนาว|เย็น/, "🥶"],
      [/ง่วง|นอน|เหนื่อย/, "😴"],
      [/รัก|น่ารัก|ชอบ/, "😍"],
      [/คิดถึง|เศร้า|เสียใจ/, "🥺"],
      [/ว้าว|เจ๋ง|เท่|สุดยอด/, "😎"],
      [/ฮ่า|555|ตลก|ขำ/, "😂"],
      [/ระวัง|อันตราย|ตกใจ/, "😱"],
      [/\?|ไหม|หรือยัง|อะไร/, "🤔"],
      [/ขอบคุณ|ยินดี/, "😊"],
    ];
    for (let [t, n] of e) if (t.test(i)) return `${n} ${i}`;
    return Math.random() < 0.5 ? `${["😊", "🙂", "😄", "😉", "😌"][Math.floor(Math.random() * 5)]} ${i}` : i;
  }
  // v82: น้องหมาแสดงอารมณ์เป็นอีโมจิ 3D เหนือหัว ตามค่าสถานะ (ทุก ~20–35 วิ)
  var dogMoodT = 12;
  function ccsDogMood(i) {
    let e = Le[0];
    if (!e || !j.started || j.sleeping || (dogMoodT -= i) > 0) return;
    dogMoodT = 20 + Math.random() * 15;
    let t = z.hunger ?? 100,
      n = z.thirst ?? 100,
      s = z.energy ?? 100,
      o = z.clean ?? 100,
      r =
        t < 25 ? ["🥺", "🤤"] :
        n < 25 ? ["🥵", "😮"] :
        s < 20 ? ["😴", "🥴"] :
        o < 30 ? ["😬", "🙄"] :
        inGarden(e.pos) ? ["😌", "🥺", "❤"] :
        t > 70 && s > 60 ? ["😊", "😍", "😄", "😛", "😎"] :
        ["🙂", "🤔", "😗"];
    rt(r[Math.floor(Math.random() * r.length)], e.pos.clone().setY(1.5));
  }
  function rt(i, e, t = "") {
    let n = e.clone().setY(2.2).project(Lt),
      s = document.createElement("span");
    ((s.className = `pop ${t}`),
      (s.innerHTML = emoHTML(i)),
      (s.style.left = `${(n.x * 0.5 + 0.5) * innerWidth}px`),
      (s.style.top = `${(-n.y * 0.5 + 0.5) * innerHeight}px`),
      document.body.appendChild(s),
      s.addEventListener("animationend", () => s.remove()));
  }
  var z = LM(),
    WA = (() => {
      try {
        return new URLSearchParams(location.search).get("admin") === "1";
      } catch {
        return !1;
      }
    })();
  WA && (z.money = Math.max(z.money, 9999));
  z.energy ?? (z.energy = 100);
  var j = {
      score: z.score,
      bones: z.bones,
      time: 0.25,
      yaw: 0,
      pitch: 0.42,
      dist: 13,
      tired: 0,
      started: !1,
      jy: 0,
      vy: 0,
      jt: 0,
      needT: 0,
      wasWet: !1,
      prevJy: 0,
      gy: 0,
      wade: 0,
      sleeping: 0,
      napT: 0,
      zzT: 0,
      splashT: 0,
      running: !1,
    },
    Ed = !1;
  addEventListener("keydown", (i) => {
    (i.key === " " || i.key === "j" || i.key === "J") && j.started && !C0() && (i.preventDefault(), (Ed = !0));
  });
  var ts = new Set(),
    A1 = !1,
    xE = !1;
  function O4(i) {
    ((A1 = i), document.getElementById("runBtn")?.classList.toggle("on", i));
  }
  addEventListener("keydown", (i) => {
    ts.add(i.key.toLowerCase());
  });
  addEventListener("keyup", (i) => ts.delete(i.key.toLowerCase()));
  var On = { id: -1, x: 0, y: 0, cx: 0, cy: 0 },
    Ws = { id: -1, x: 0, y: 0 },
    ld = it("stick"),
    ib = it("knob");
  dn.domElement.addEventListener("pointerdown", (i) => {
    j.started &&
      (On.id >= 0 &&
        i.pointerId !== On.id &&
        i.clientX < innerWidth * 0.45 &&
        i.clientY > innerHeight * 0.35 &&
        (On.id = -1),
      i.clientX < innerWidth * 0.45 && i.clientY > innerHeight * 0.35 && On.id < 0
        ? ((On.id = i.pointerId),
          (On.cx = i.clientX),
          (On.cy = i.clientY),
          (On.x = On.y = 0),
          (ld.style.left = `${i.clientX}px`),
          (ld.style.top = `${i.clientY}px`),
          ld.classList.add("on"))
        : Ws.id < 0 && ((Ws.id = i.pointerId), (Ws.x = i.clientX), (Ws.y = i.clientY)),
      dn.domElement.setPointerCapture(i.pointerId));
  });
  dn.domElement.addEventListener("pointermove", (i) => {
    if (i.pointerId === On.id) {
      let e = i.clientX - On.cx,
        t = i.clientY - On.cy,
        n = Math.hypot(e, t),
        s = 46;
      (n > s && ((e = (e / n) * s), (t = (t / n) * s)),
        (On.x = e / s),
        (On.y = t / s),
        (ib.style.transform = `translate(${e}px, ${t}px)`));
    } else
      i.pointerId === Ws.id &&
        ((j.yaw -= (i.clientX - Ws.x) * 0.006),
        (j.pitch = Math.max(0.02, Math.min(1.1, j.pitch + (i.clientY - Ws.y) * 0.004))),
        (Ws.x = i.clientX),
        (Ws.y = i.clientY));
  });
  var Hd = (i) => {
    (i.pointerId === On.id && ((On.id = -1), (On.x = On.y = 0), (ib.style.transform = ""), ld.classList.remove("on")),
      i.pointerId === Ws.id && (Ws.id = -1));
  };
  dn.domElement.addEventListener("pointerup", Hd);
  dn.domElement.addEventListener("pointercancel", Hd);
  dn.domElement.addEventListener("lostpointercapture", Hd);
  addEventListener("pointerup", Hd);
  addEventListener("pointercancel", Hd);
  var sb = () => {
    ((On.id = -1), (On.x = On.y = 0), (ib.style.transform = ""), ld.classList.remove("on"), (Ws.id = -1), ts.clear());
  };
  addEventListener("blur", sb);
  document.addEventListener("visibilitychange", () => {
    document.hidden && sb();
  });
  dn.domElement.addEventListener(
    "wheel",
    (i) => {
      j.dist = Math.max(3, Math.min(18, j.dist + i.deltaY * 0.01));
    },
    { passive: !0 },
  );
  it("zin").addEventListener("click", () => {
    j.dist = Math.max(3, j.dist - 2);
  });
  it("cam3p").addEventListener("click", () => {
    let i = j.pitch < 0.3;
    ((j.pitch = i ? 0.42 : 0.1),
      (j.dist = i ? 13 : 4.6),
      !i && Le[0] && (j.yaw = (Le[0].dir ?? 0) + Math.PI),
      ke("pop"));
  });
  it("zout").addEventListener("click", () => {
    j.dist = Math.min(18, j.dist + 2);
  });
  var Gp = [
      {
        t: 0,
        sky: 658718,
        fog: 1053738,
        light: 0.1,
        sun: 7307216,
        name: "🌙 กลางคืน",
      },
      {
        t: 0.17,
        sky: 1316918,
        fog: 1843264,
        light: 0.19,
        sun: 9408511,
        name: "🌙 ใกล้รุ่ง",
      },
      {
        t: 0.22,
        sky: 16763060,
        fog: 16769736,
        light: 1,
        sun: 16765600,
        name: "🌤 ตอนเช้า",
      },
      {
        t: 0.35,
        sky: 5220076,
        fog: 13035255,
        light: 1.25,
        sun: 16777215,
        name: "☀️ กลางวัน",
      },
      {
        t: 0.65,
        sky: 5220076,
        fog: 13035255,
        light: 1.25,
        sun: 16777215,
        name: "☀️ กลางวัน",
      },
      {
        t: 0.76,
        sky: 16747114,
        fog: 16757898,
        light: 0.9,
        sun: 16751184,
        name: "🌇 ตอนเย็น",
      },
      { t: 0.82, sky: 2761040, fog: 3024464, light: 0.32, sun: 9408511, name: "🌆 ค่ำ" },
      {
        t: 0.88,
        sky: 1184814,
        fog: 1448500,
        light: 0.13,
        sun: 7307216,
        name: "🌙 กลางคืน",
      },
      {
        t: 1,
        sky: 658718,
        fog: 1053738,
        light: 0.1,
        sun: 7307216,
        name: "🌙 กลางคืน",
      },
    ],
    v6 = "",
    B3 = 0,
    yE = 0,
    N4 = new ae(1, 1, 1),
    Vc = null,
    ME = new hr(11058431, 0);
  K.add(ME);
  var R6 = !1,
    qA = new ae(),
    oa = new ae();
  // v97: สภาพอากาศรายวัน (ความใสของอากาศ) — บางวันฟ้าใสแดดจ้าเห็นวิวไกลชัด บางวันมีหมอกควัน/ฟ้าหม่น เปลี่ยนนุ่ม ๆ ระหว่างวัน
  var ccsClar = 0.6,
    ccsClarT = 0.6,
    ccsClarDay = -1,
    ccsHaze = { value: 0.3 },
    ccsHazeCol = { value: new ae(14676471) };
  function ccsWeatherDay(i) {
    let e = typeof I0 == "function" ? I0() : 0;
    if (e !== ccsClarDay) {
      ccsClarDay = e;
      let n = Math.abs(Math.sin(e * 12.9898 + 7.7) * 43758.5453) % 1;
      ((ccsClarT = n < 0.42 ? 0.92 + n * 0.15 : n < 0.78 ? 0.5 + (n - 0.42) * 0.5 : 0.1 + (n - 0.78) * 0.6),
        j.started && !Se && n < 0.42 && De("☀️ วันนี้ฟ้าใส แดดจ้า มองเห็นวิวได้ไกลสุดตา", 2600),
        j.started && !Se && n >= 0.78 && De("🌫 วันนี้อากาศหม่น มีหมอกบาง ๆ ปกคลุม", 2600));
    }
    let t = ccsClarT * (1 - 0.6 * co.cur.o) * (1 - 0.8 * co.cur.r) - (i > 0.2 && i < 0.3 ? 0.25 : 0);
    return ((ccsClar += (Math.max(0, Math.min(1, t)) - ccsClar) * 0.004), ccsClar);
  }
  function G4(i) {
    let CL = ccsWeatherDay(i);
    let e = 0;
    for (; e < Gp.length - 2 && i > Gp[e + 1].t;) e++;
    let t = Gp[e],
      n = Gp[e + 1],
      s = (i - t.t) / (n.t - t.t),
      o = qA.setHex(t.sky).lerp(oa.setHex(n.sky), s).clone(),
      r = co.cur.o,
      a = co.cur.r,
      c = Math.min(1, Math.max(0, (t.light + (n.light - t.light) * s - 0.1) / 0.6));
    (o.lerp(oa.setHex(7108230), 0.72 * r * c).multiplyScalar(1 - 0.32 * a),
      h0.top.value.copy(o),
      h0.bottom.value
        .setHex(t.fog)
        .lerp(oa.setHex(n.fog), s)
        .lerp(new ae(16777215), 0.12 * Math.min(1, Math.max(0, (t.light + (n.light - t.light) * s - 0.1) / 0.6)))
        .lerp(oa.setHex(10134445), 0.7 * r * c)
        .multiplyScalar(1 - 0.28 * a),
      h0.top.value.lerp(oa.setHex(2324708), 0.4 * CL * c).lerp(oa.setHex(11125980), 0.45 * (1 - CL) * c),
      h0.bottom.value.lerp(oa.setHex(11131875), 0.22 * CL * c).lerp(oa.setHex(14211296), 0.5 * (1 - CL) * c),
      K.fog.color.copy(h0.bottom.value),
      (K.fog.near = 45 + 70 * CL - 30 * a),
      (K.fog.far = 170 + 170 * CL - 100 * a),
      ccsHaze.value = 0.62 - 0.46 * CL + 0.3 * a,
      ccsHazeCol.value.copy(h0.bottom.value));
    let l = (t.light + (n.light - t.light) * s) * (1 - 0.42 * r - 0.12 * a);
    ((x0.intensity = 0.19 + l * 1.25 + co.cur.flash * 2.2),
      x0.color.setHex(14478591).lerp(oa.setHex(3820154), Math.max(0, Math.min(1, (0.6 - l) / 0.5))),
      x0.groundColor.setHex(8034908).lerp(oa.setHex(1053720), Math.max(0, Math.min(1, (0.6 - l) / 0.5))),
      (ii.intensity = l * 1.3 * (0.82 + 0.38 * CL)),
      ii.color.setHex(t.sun).lerp(oa.setHex(n.sun), s));
    let h = (i - 0.25) * Math.PI * 2;
    // v83: แสงต่ำมากตอนกลางคืน/เช้ามืดทำเงายาวคลุมทั้งหาด ตัดเป็นเส้นตรงที่ขอบเงา → ให้แสงสูงพอ และเงาจางลงตอนมืด
    ((ii.shadow.intensity = 0.25 + 0.75 * Math.max(0, Math.min(1, (l - 0.15) / 0.5))),
    sd.set(Math.cos(h) * 0.8, Math.max(0.6, Math.abs(Math.sin(h))), 0.45).normalize(),
      h0.sunDir.value.copy(sd).setY(Math.sin(h)));
    let f = l < 0.6;
    {
      Dp.set(-Math.cos(h) * 0.8, -Math.sin(h) * 0.55, -0.6).normalize();
      let g = Dp.y,
        y = Math.sin(h),
        x =
          Math.max(0, Math.min(1, (g - 0.02) / 0.15)) *
          Math.max(0, Math.min(1, (-y - 0.03) / 0.12)) *
          Math.max(0, Math.min(1, (0.6 - l) / 0.3)) *
          (1 - 0.8 * r);
      (u0.position.copy(Lt.position).addScaledVector(Dp, 360),
        sl.position.copy(u0.position),
        ME.position.copy(Dp).multiplyScalar(80),
        (ME.intensity = 0.55 * Math.max(x, Math.max(0, Math.min(1, (0.5 - l) / 0.3)) * 0.6)),
        (u0.visible = sl.visible = x > 0.01),
        (u0.material.opacity = x),
        (sl.material.opacity = x * 0.9),
        Gh.position.copy(Lt.position),
        (Gh.material.opacity = Math.max(0, Math.min(1, (0.55 - l) / 0.3)) * (1 - 0.9 * r)),
        (Gh.visible = Gh.material.opacity > 0.01),
        (Gh.rotation.y = i * 0.6));
    }
    if (
      (!Vc &&
        j.started &&
        ((Vc = []),
        K.traverse((g) => {
          let y = g;
          if (y.isMesh)
            for (let x of Array.isArray(y.material) ? y.material : [y.material])
              x.name === "Emissive" && x.emissive && !Vc.includes(x) && Vc.push(x);
        })),
      Vc)
    )
      for (let g of Vc) g.emissiveIntensity = Math.max(0.025, Math.min(1, (l - 0.05) / 0.95));
    for (let g of YE) g.color.setHex(f ? 16773242 : 15262408);
    for (let g of i1) g.visible = f;
    let d = i % 1 > 0.79 || i % 1 < 0.21;
    for (let g of al) g.visible = d;
    Kp && ((Kp.emissiveIntensity = d ? 0.6 : 0.55), Kp.emissive.setHex(d ? 6261320 : 4877876));
    for (let g of k4) g.emissiveIntensity = d ? 1.3 : 0.2;
    for (let g of H0) g.l.intensity = d ? g.on : 0;
    for (let g of Qh)
      ((g.m.emissive = g.m.emissive ?? new ae()),
        g.m.emissive.setHex(g.tail ? 16719904 : 16773832),
        (g.m.emissiveIntensity = d ? (g.tail ? 1.6 : 2.4) : 0));
    ((yE = f ? 1 : 0),
      N4.copy(h0.bottom.value)
        .lerp(oa.setHex(16777215), f ? 0.05 : 0.75 - 0.5 * r)
        .multiplyScalar(f ? 0.14 : 1 - 0.38 * r),
      nl.bulbMat.color.setHex(f ? 16773242 : 15262408),
      nl.winMat.color.setHex(f ? 16769162 : 10410224));
    let u = i % 1 > 0.7917 || i % 1 < 0.2083;
    if (u !== R6) {
      R6 = u;
      for (let g of Zc) g.done = !1;
    }
    for (let g of zn) {
      ((g.glassM.emissiveIntensity = u ? 0.9 : 0), (g.lampM.emissiveIntensity = u ? 2.5 : 0.2));
      for (let y of g.nightM) y.m.emissiveIntensity = u ? y.night : y.day;
      (g.glassF.emissive.setHex(16767114),
        (g.glassF.emissiveIntensity = u ? 0.55 : 0),
        (g.glassF.opacity = u ? 0.34 : 0.22),
        (g.shopLight.intensity = u ? 9 : 0));
    }
    let p = (s < 0.5 ? t : n).name;
    p !== v6 && ((v6 = p), j.started && De(p));
    let m = Math.floor(i * 24),
      E = Math.floor((i * 24 - m) * 60);
    fa.clock.textContent = `${p.split(" ")[0]} ${String(m).padStart(2, "0")}:${String(E).padStart(2, "0")}`;
  }
  var c0 = new H(),
    O3 = new H(),
    Xt = new H(),
    jA = new H(),
    _6 = new H(),
    S6 = new H(),
    H6 = performance.now(),
    TE = 0;
  // v129: ลูปหลักกันพัง — ถ้ามีระบบไหน error เกมไม่หยุดค้าง แต่เก็บข้อความไว้ให้ดู (__ccs.lastErr)
  var ccsLoopErrT = 0;
  function U4(i) {
    try {
      U4b(i);
    } catch (e) {
      ((window.__ccsLastErr = String(e?.stack || e).slice(0, 600)), console.error("[ccs loop]", e));
      try {
        localStorage.setItem("ccs-lastErr", new Date().toISOString() + " " + window.__ccsLastErr);
      } catch {}
      performance.now() - ccsLoopErrT > 8e3 && ((ccsLoopErrT = performance.now()), typeof De == "function" && De("⚠️ มีข้อผิดพลาดเล็กน้อย เกมยังเล่นต่อได้", 1800));
      try {
        dn.render(K, Lt);
      } catch {}
      requestAnimationFrame(U4);
    }
  }
  function ccsSafe(f, a, b) {
    try {
      return f(a, b);
    } catch (e) {
      ((window.__ccsLastErr = (f.name || "?") + ": " + String(e?.stack || e).slice(0, 500)), console.error("[ccs " + f.name + "]", e));
      try {
        localStorage.setItem("ccs-lastErr", new Date().toISOString() + " " + window.__ccsLastErr);
      } catch {}
    }
  }
  function U4b(i) {
    TE++;
    let e = Math.min(0.05, (i - H6) / 1e3);
    ((H6 = i), j.started && !C0() && (j.time += e / 900));
    let t = i / 1e3;
    if (
      (oE && (oE.value = t),
      co.update(e, j.time % 1, Lt, sd, !!Se, j.started ? _i() : null),
      bH(e, N4, yE ? 0.18 + 0.4 * co.cur.o : 1),
      j.started)
    ) {
      let s = co.cur.r > 0.3 ? 2 : co.cur.rb > 0.3 ? 3 : co.cur.o > 0.35 ? 1 : 0;
      s !== B3 &&
        (s === 1 && B3 === 0
          ? De(
              "☁️ เมฆครึ้มก่อตัว ฟ้าเริ่มมืด… ได้ยินฟ้าร้องแล้ว ฝนใกล้ตก",
              2800,
            )
          : s === 2
            ? De(
                "🌧 ฝนตกหนัก! หลบเข้าร้านหรือกลับบ้านก็ได้นะ",
                2600,
              )
            : s === 3 &&
              De(
                "🌈 ฝนหยุดแล้ว ฟ้าใส มีรุ้งกินน้ำ! หันกล้องไปฝั่งเมือง (ตรงข้ามดวงอาทิตย์)",
                3400,
              ),
        (B3 = s));
    }
    (aM(t, Lt.position, sd, h0.top.value, h0.bottom.value, yE),
      xA(e, Le[0]),
      ccsPhysTick(Math.min(0.05, e), Le[0], t),
      ccsFWTick(Math.min(0.05, e), t),
      ccsVolcanoTick(Math.min(0.05, e), t),
      tl.update(e),
      ccsSafe(ccsRipFeed, Math.min(0.05, e), t),
      sE?.update(e, Le[0]?.pos ?? new H(), !Se),
      oi.update(t),
      wH(t, e));
    for (let s of I4) s.update(t);
    if ((AA(t), Lk(t), !Bp && j.started)) {
      let s = _i();
      s && (Bp = pM(s));
    }
    if (Bp) {
      let s = Le[0],
        o = Se || !s ? 0 : Math.max(0, Math.min(1, 1 - (Rt - s.pos.z) / 45));
      Bp(e, Math.pow(o, 1.6));
    }
    (FA?.update(t, e), ed?.update(t, e), Cr && Le[0] && Cr.update(Le[0].pos));
    for (let s of y0) {
      if (!s.rig) continue;
      let o = Le[0],
        r = !Se && !!o && o.pos.distanceTo(s.at) < 9;
      if (
        ((s.t -= e),
        (s.moodT -= e),
        s.moodT <= 0 &&
          ((s.happy = !s.happy),
          Ah(s.rig, s.happy ? "happy" : "idle"),
          (s.moodT = s.happy ? 2.5 + Math.random() * 2 : 3 + Math.random() * 5)),
        r &&
          s.t <= 0 &&
          !js.classList.contains("on") &&
          (Ln(s.at, s.lines[Math.floor(Math.random() * s.lines.length)]),
          Ah(s.rig, "happy"),
          (s.happy = !0),
          (s.moodT = 3),
          (s.t = 7 + Math.random() * 7 + (Math.random() < 0.3 ? 6 : 0))),
        Qi(s.rig, e, 0, r && o ? Math.atan2(o.pos.x - s.at.x, o.pos.z - s.at.z) : s.yaw),
        s.deck)
      ) {
        let a = ba(s.at.x, s.at.z);
        a !== null && (s.rig.root.position.y = a);
      }
    }
    for (let s of zn) (s.keeper.root.position.copy(s.inside.keeperSpot), Qi(s.keeper, e, 0, s.inside.keeperYaw ?? 0));
    if ((uE && Se && Se.id === "groom" && uE.userData.update?.(e), Se && Se.id === "petshop"))
      ccsPenTick(e);
    if (Se && ((C3 -= e), C3 <= 0)) {
      let s = zn.find((o) => o.inside === Se);
      if (s && !js.classList.contains("on")) {
        let o = c6[s.def.id] ?? c6.grocery;
        (Ln(s.inside.keeperSpot, o[Math.floor(Math.random() * o.length)]),
          Ah(s.keeper, "happy"),
          setTimeout(() => Ah(s.keeper, "idle"), 2600));
      }
      C3 = 6 + Math.random() * 6 + (Math.random() < 0.35 ? 9 : 0);
    }
    for (let s = 0; s < n1.length; s++) {
      let o = n1[s];
      ((o.rotation.z = Math.sin(t * 1.1 + s) * 0.018), (o.rotation.x = Math.cos(t * 0.9 + s * 0.7) * 0.012));
    }
    ((nl.ship.position.y = -0.3 + Math.sin(t * 0.8) * 0.12),
      (nl.ship.rotation.z = Math.sin(t * 0.6) * 0.02),
      (nl.boat.position.y = -0.15 + Math.sin(t * 1.1 + 1) * 0.08),
      Le[0] && ccsSunFollow(Le[0].pos),
      j.time >= 0.995 && CT(!0),
      G4(j.time % 1),
      Se && ((x0.intensity = Math.max(x0.intensity, 1.45)), x0.color.setHex(14478591), x0.groundColor.setHex(8034908), (ii.intensity = Math.max(ii.intensity, 0.9))));
    let n = Le[0];
    if (n) {
      (_6.set(-Math.sin(j.yaw), 0, -Math.cos(j.yaw)), S6.set(Math.cos(j.yaw), 0, -Math.sin(j.yaw)));
      let s = On.x,
        o = On.y;
      ((ts.has("a") || ts.has("arrowleft")) && (s -= 1),
        (ts.has("d") || ts.has("arrowright")) && (s += 1),
        (ts.has("w") || ts.has("arrowup")) && (o -= 1),
        (ts.has("s") || ts.has("arrowdown")) && (o += 1));
      let r = tA();
      if (
        (r &&
          ((s += r.lx),
          (o += r.ly),
          (j.yaw -= r.rx * e * 2.4),
          (j.pitch = Math.max(0.02, Math.min(1.2, j.pitch + r.ry * e * 1.2)))),
        j.sleeping && ((s = 0), (o = 0)),
        Oo)
      ) {
        let b = Oo,
          w = b.k.c;
        if (!b.dropped) {
          b.t -= e;
          let v = w.pos();
          let CA = Math.max(-1.25, Math.min(1.25, j.yaw - (b.yaw0 ?? j.yaw))),
            CX = s * Math.cos(CA) + o * Math.sin(CA),
            CZ = -s * Math.sin(CA) + o * Math.cos(CA);
          (w.steer(v.x + CX * e * 0.35, v.y + CZ * e * 0.35), b.t <= 0 && fE(), ts.has(" ") && fE(), ts.has("escape") && ccsClawCancel());
        }
        ((s = 0), (o = 0));
      }
      (ts.has("q") && (j.yaw += e * 1.8), ts.has("e") && (j.yaw -= e * 1.8));
      let a = Math.min(1, Math.hypot(s, o)),
        c = z.train?.lvl ?? 1,
        l = (z.hunger ?? 100) < 15 || (z.thirst ?? 100) < 15,
        h = (z.energy ?? 100) < 15,
        f = (ts.has("shift") || xE || A1) && !Se && (z.energy ?? 100) > 8 && j.tired <= 0;
      j.running = f && a > 0.3;
      let d =
        (j.tired > 0 ? 2 : 6.2 * (1 + Math.min(10, c - 1) * 0.03)) *
        (l ? 0.7 : 1) *
        (h ? 0.7 : 1) *
        (j.wade > 0.15 ? (ccsHG("swim") ? 1.15 : 0.6) * (ccsBuffOn("swim") ? 1.25 : 1) : 1) *
        (co.cur.r > 0.3 && !Se && ccsSetOn("rain") ? 1.1 : 1) *
        (j.running ? 1.7 : 1) *
        (1 + ccsSt("speed") * 0.0025) *
        a *
        aT();
      j.running && j.started && (z.energy = Math.max(0, (z.energy ?? 100) - e * 0.35 * F6() * (1 - ccsSt("stam") / 200) * (ccsHG("helmet") ? 0.5 : 1) * (ccsBuffOn("stam") ? 0.65 : 1)));
      let u = j.started && a > 0.08 && !ho,
        p = j.jy > 0.42;
      (u ? O3.copy(S6).multiplyScalar(s).addScaledVector(_6, -o).normalize().multiplyScalar(d) : O3.set(0, 0, 0),
        ho || !j.started ? c0.set(0, 0, 0) : c0.lerp(O3, 1 - Math.exp(-e * (u ? 9 : 11))));
      let m = c0.length();
      if (m > 0.06) {
        Xt.copy(c0).divideScalar(m);
        let b = n.pos.clone().addScaledVector(c0, e),
          w = vr(n.pos, 0.45),
          v = !Se && Math.abs(Math.hypot(n.pos.x - kn.x, n.pos.z - kn.z) - 7.31) < 0.75 && j.gy > 0.45, // v106: ข้ามขอบบ่อได้เฉพาะตอนกระโดด/ยืนอยู่บนขอบ (เดิมเดินทะลุออกจากในบ่อได้)
          _ = hl(n.pos),
          S = (F) => ba(F.x, F.z) !== null,
          M = (F) => Rd(F.x, F.z) !== null,
          T = (F) => (Se ? !0 : S(F) ? S(n.pos) || M(n.pos) || j.jy > 1.2 : !(S(n.pos) && !M(F))),
          A = (F) =>
            T(F) &&
            (_ > 0.01
              ? hl(F) < _ - 1e-4 &&
                !(Se && (F.x < Se.bounds.x0 || F.x > Se.bounds.x1 || F.z < Se.bounds.z0 || F.z > Se.bounds.z1))
              : !ri(F, 0.5, p || v, !0)) &&
            (vr(F, 0.45) <= 0 || vr(F, 0.45) < w - 1e-4);
        if (A(b)) n.pos.copy(b);
        else {
          let F = n.pos.clone();
          ((F.x = b.x), A(F) ? n.pos.copy(F) : (c0.x *= 0.3));
          let P = n.pos.clone();
          ((P.z = b.z), A(P) ? n.pos.copy(P) : (c0.z *= 0.3));
        }
        (Math.abs(s) > 0.15 && (n.face = s > 0 ? 1 : -1), (n.dir = Math.atan2(Xt.x, Xt.z)));
      }
      if (!Se) {
        let b = vr(n.pos, 0.45);
        if (b > 0.02)
          for (let w of [
            Math.PI / 2,
            -Math.PI / 2,
            0,
            Math.PI,
            Math.PI / 4,
            -Math.PI / 4,
            (3 * Math.PI) / 4,
            (-3 * Math.PI) / 4,
          ]) {
            let v = n.pos.clone().add(new H(Math.sin(w), 0, Math.cos(w)).multiplyScalar(b + 0.06));
            if (vr(v, 0.45) <= 0 && !ri(v, 0.5, !1, !0)) {
              n.pos.copy(v);
              break;
            }
          }
      }
      if (((n.spd = m > 0.06 ? m : 0), ccsRide)) ccsRideStep(n, e);
      else if (ho) ccsTRTick(n, e);
      else
        (Ed && j.jy <= 0.001 && j.started && !Se && ((j.vy = 7.4 * (1 + ccsSt("jump") * 0.003) * (ccsHG("prop") ? 1.25 : 1)), (j.jt = 0), ke("pop")),
          (j.jy > 0 || j.vy > 0) &&
            ((j.vy -= (ccsHG("prop") && j.vy < 0 ? 13 : 24) * e), (j.jy = Math.max(0, j.jy + j.vy * e)), (j.jt += e), j.jy === 0 && (j.vy = 0)));
      Ed = !1;
      let E = Se ? (Rn && Se === Rn && (j.sleeping || $H(n.pos)) ? Rn.bedY + ccsBedLift(n) : 0) : x4(n.pos, n.rig.yaw, b4);
      E >= j.gy ? (j.gy = E) : (j.gy = Math.max(E, j.gy - e * 5));
      let g = Se ? 0 : go(n.pos.x, n.pos.z);
      if (((j.wade += (g - j.wade) * Math.min(1, e * 6)), g > 0.12 && j.started)) {
        let b = z.clean ?? 100;
        ((z.clean = Math.min(100, b + e * 14)),
          !Xh &&
            b < 90 &&
            ((Xh = 1),
            De(
              "🫧 กำลังล้างตัวในน้ำ… คราบค่อย ๆ หายไป",
              2e3,
            )),
          Xh === 1 &&
            z.clean >= 100 &&
            ((Xh = 2),
            rt("✨ สะอาดแล้ว!", n.pos.clone().setY(1.6), "big"),
            ke("heart")));
      } else g < 0.02 && (Xh = 0);
      let y = g > 0.08;
      if (y && (!j.wasWet || (j.prevJy > 0.25 && j.jy === 0))) {
        let b = j.prevJy > 0.25 ? 1.4 : 0.9;
        (tl.burst(n.pos, dE(n.pos), b), j.started && kp(_i(), b));
      } else
        y &&
          n.spd > 0.5 &&
          (j.splashT -= e) < 0 &&
          ((j.splashT = 0.28),
          tl.burst(
            n.pos.clone().addScaledVector(new H(Math.sin(n.dir ?? 0), 0, Math.cos(n.dir ?? 0)), 0.5),
            dE(n.pos),
            0.35,
          ),
          j.started && Math.random() < 0.5 && kp(_i(), 0.3));
      if (
        ((j.wasWet = y),
        (j.prevJy = j.jy),
        j.sleeping && (n.spd = 0),
        Qp(n, e),
        (n.rig.root.position.y = j.gy + j.jy - j.wade),
        j.sleeping &&
          ((n.rig.body.scale.y = 0.82 + Math.sin(i / 600) * 0.03), (n.rig.body.position.y = Se === Rn ? 0 : -0.12)),
        JH(e, n),
        ccsWetTick(e, n),
        w4(e, n),
        pT(e, n),
        $C(e, n),
        hk(e, n),
        ZH(e, n),
        j.sleeping && XH(e, n),
        NH(e, n),
        j.started)
      ) {
        let b = n.spd > 0.3 ? 1.5 : 1,
          w = j.sleeping ? 0.3 : 1;
        if (
          ((z.hunger = Math.max(0, (z.hunger ?? 100) - e * 0.09 * b * w * (ccsHG("koala") ? 0.7 : 1))),
          (z.thirst = Math.max(0, (z.thirst ?? 100) - e * 0.13 * b * w * (ccsHG("drink") ? 0.5 : 1))),
          j.sleeping || (z.energy = Math.max(0, (z.energy ?? 100) - e * 0.085 * b * F6() * (1 - ccsSt("stam") / 200))),
          (z.potty = Math.min(100, (z.potty ?? 0) + e * 0.03 * (ccsHG("plunger") ? 0.5 : 1))),
          (z.clean = Math.max(
            0,
            (z.clean ?? 100) - e * 0.035 * b * (co.cur.r > 0.3 && !Se ? (ccsSetOn("rain") ? 0 : ccsHG("rain") ? 0.5 : 2.2) : ccsHG("rain") ? 0.5 : 1) * (j.sleeping ? 0.2 : 1) * (ccsFresh() ? 0.15 : 1),
          )),
          (j.needT -= e),
          j.needT < 0 && !j.sleeping)
        ) {
          let v = z.hunger ?? 100,
            _ = z.thirst ?? 100,
            S = z.energy ?? 100,
            M = z.potty ?? 0,
            T =
              _ < 20
                ? "💧 น้องกระหายน้ำ! ไปดื่มที่ชามน้ำ บ่อน้ำ หรือซื้อน้ำที่ Petshop"
                : v < 20
                  ? "🍖 น้องหิวแล้ว! เก็บอาหาร ซื้อที่ Petshop หรือไก่ย่างป้าแจ๋ว"
                  : S < 15
                    ? "😪 น้องง่วงมาก กลับบ้านไปนอนที่เบาะก่อนนะ"
                    : M > 75
                      ? "💩 น้องปวดอึ! กดปุ่ม 💩 ตรงพื้นหญ้า"
                      : (z.clean ?? 100) < 35 && j.wade < 0.05
                        ? "🫧 น้องตัวเหม็นแล้ว มีคราบดำเต็มตัว! อาบน้ำที่ร้านอาบน้ำตัดขน หรือลงเล่นน้ำทะเล/บ่อน้ำก็ได้"
                        : "";
          T && ((j.needT = 22), De(T, 3200));
        }
      }
      Ek(n);
      {
        let b = Math.max(0, Math.min(1, (72 - (z.clean ?? 100)) / 62)),
          w = n.rig.setDirt;
        w && Math.abs(b - i4) > 0.01 && (w(b), (i4 = b));
      }
      HT(e, n);
      let x = n;
      for (let b of Le.slice(1)) {
        if (!b.found) {
          if (
            ((b.spd = 0),
            (b.dir = Math.atan2(n.pos.x - b.pos.x, n.pos.z - b.pos.z)),
            Qp(b, e),
            j.started && !Se && b.pos.distanceTo(n.pos) < 2.4)
          ) {
            ((b.found = !0), z.found.includes(b.idx) || z.found.push(b.idx));
            let w = Le.filter((v) => v.found).length - 1;
            (rt("เจอเพื่อนแล้ว!", b.pos, "big"),
              De(
                `🐾 ${pl[b.idx].name} เป็นเพื่อนกันแล้ว! แวะมาเล่นด้วยกันได้ทุกเมื่อ (${w}/5)`,
                3e3,
              ),
              (j.score += 100),
              w === 5 &&
                setTimeout(
                  () =>
                    De(
                      "🎉 เจอเพื่อนเชาเชาครบทั้ง 5 ตัวแล้ว! เดินเล่นกันต่อได้เลย",
                      4500,
                    ),
                  3200,
                ));
          }
          continue;
        }
        (E4(b, b.pos.distanceTo(n.pos) < 3 ? n.pos : null, 1.8, 8, e), Qp(b, e), Se && Se === Rn && $H(b.pos) && (b.rig.root.position.y = Rn.bedY + ccsBedLift(b))); // v87: เพื่อนขึ้นไปนอนบนเบาะ ไม่จมเตียง
      }
      for (let b of z4) {
        if (!b.alive) {
          ((b.respawn -= e),
            b.respawn <= 0 &&
              ((b.alive = !0), (b.sp.visible = b.shadow.visible = !0), b.kind !== "bowl" && b.pos.copy(P0())));
          continue;
        }
        let w = b.kind === "food" || b.kind === "bone";
        (b.sp.position.set(b.pos.x, w ? 0.12 + Math.abs(Math.sin(i / 500 + b.pos.x)) * 0.12 : 0.02, b.pos.z),
          w && (b.sp.rotation.y = i / 1400 + b.pos.z),
          b.shadow.position.set(b.pos.x, 0.06, b.pos.z),
          j.started && b.pos.distanceTo(n.pos) < 1.2 && bk(b));
      }
      (j.tired > 0 && (j.tired -= e), gT?.render(z.tiles, i / 1e3), Rk(e), zk(e), j.started && Tk(n));
      for (let b of gl) b.c.update(e);
      for (let b of El) {
        b.petT > 0 && (b.petT -= e);
        let w = b.pos.distanceTo(n.pos) < 3;
        if ((po(b.pos) && b.wait > 0 && (b.wait = 0), b.wait > 0)) ((b.wait -= e), (b.spd = 0));
        else {
          Xt.copy(b.target).sub(b.pos).setY(0);
          let _ = Xt.length();
          if (_ < 0.3) {
            b.wait = 1.5 + Math.random() * 4;
            for (let S = 0; S < 10; S++) {
              let M = b.def.roam ?? 7,
                T = b.home.clone().add(new H((Math.random() - 0.5) * M * 2, 0, (Math.random() - 0.5) * M * 1.5));
              if (!po(T) && !o1(T, 0.6) && go(T.x, T.z) < 0.05) {
                b.target.copy(T);
                break;
              }
            }
          } else {
            Xt.divideScalar(_);
            let S = Xt.clone().multiplyScalar(Math.min(_, b.def.speed * e)),
              M = b.pos.clone().add(S);
            (o1(M, 0.5) ? b.target.copy(b.pos) : b.pos.copy(M), (b.spd = b.def.speed));
          }
        }
        b.rig.root.position.copy(b.pos);
        let v = b.spd > 0;
        Qi(
          b.rig,
          e,
          b.spd,
          v
            ? Math.atan2(b.target.x - b.pos.x, b.target.z - b.pos.z)
            : w
              ? Math.atan2(n.pos.x - b.pos.x, n.pos.z - b.pos.z)
              : null,
        );
      }
      (ccsSafe(ccsBathTick, e), ccsSafe(ccsHatTick, e), ccsSafe(ccsTRFieldInit), ccsSafe(ccsTRSignTick), ccsSafe(ccsWhaleTick, Math.min(0.1, e)), ccsSafe(ccsBaitTick, Math.min(0.1, e)), ccsSafe(ccsFxTick, Math.min(0.05, e)), ccsSafe(ccsV126Tick, Math.min(0.1, e)));
      if ((T4(e, n), Oo)) {
        let b = Oo.k.pos,
          CA = Math.max(-1.25, Math.min(1.25, j.yaw - (Oo.yaw0 ?? j.yaw)));
        // v97: หมุนกล้องดูตู้จากด้านข้างได้ (ลากจอ / จอยขวา / Q-E)
        (Lt.position.lerp(Xt.set(b.x - 0.05 + Math.sin(CA) * 2.35, 2.45, b.z + Math.cos(CA) * 2.35), Math.min(1, e * 5)),
          Lt.lookAt(b.x - 0.05, 1.55, b.z),
          r4(),
          a4(n));
      } else if (ho && !Se) {
        // v120: มุมกล้องตอนฝึก: อยู่หลังเฉียงข้างน้อง มองไปข้างหน้าตามทางวิ่ง
        let b0 = yM(ho.st.path, Math.max(0, ho.d) + 0.5, new H()).dir ?? n.dir ?? 0;
        ccsTRCamA === null && (ccsTRCamA = b0);
        let dA = Math.atan2(Math.sin(b0 - ccsTRCamA), Math.cos(b0 - ccsTRCamA));
        ccsTRCamA += dA * Math.min(1, e * 2.5);
        let b = ccsTRCamA,
          w = Math.sin(b),
          v = Math.cos(b);
        (Lt.position.lerp(Xt.set(n.pos.x - w * 4.6 + v * 1.8, 3.4 + j.jy * 0.5, n.pos.z - v * 4.6 - w * 1.8), Math.min(1, e * 4)), Lt.lookAt(n.pos.x - w * 0.4, -0.25 + j.jy * 0.5, n.pos.z - v * 0.4), r4(), a4(n));
      } else if (ccsPK && fo) {
        // v116: ดวลจุดโทษ ใช้มุมกล้องเดียวกันทั้งตอนยิงและตอนรับ (หลังจุดโทษ มองเข้าประตู)
        let b = ccsPKGeo();
        (Lt.position.lerp(Xt.set(b.spot.x - 6.2, 3.5, b.spot.z + 0.9), Math.min(1, e * 5)), Lt.lookAt(b.gx - 1.2, 0.7, b.spot.z), r4(), a4(n));
      } else {
        let b = uo ? 3.1 : Se ? Math.min(j.dist, 7.5) : j.dist,
          w = uo ? 0.12 : j.pitch,
          v = uo ? n.rig.yaw + 0.5 : j.yaw,
          _ = n.pos.x + Math.sin(v) * Math.cos(w) * b,
          S = n.pos.z + Math.cos(v) * Math.cos(w) * b,
          M = Math.max(0.75, 1 + Math.sin(w) * b),
          T = _,
          A = S,
          F = Math.max(0, Math.min(1, (0.32 - w) / 0.3));
        if (Se) {
          let C = Se.bounds;
          ((T = Math.max(C.x0, Math.min(C.x1, _))),
            (A = Math.max(C.z0 - 0.2, Math.min(C.z1 + 0.05, S))),
            (M = Math.min(M, 3.7)));
        }
        if ((Lt.position.lerp(Xt.set(T, uo ? 1.05 : M, A), Math.min(1, e * 6)), uo)) {
          let C = innerHeight < 500 && innerWidth > innerHeight ? 0.75 : 0;
          Lt.lookAt(n.pos.x + Math.cos(v) * C, 0.05 + j.jy, n.pos.z - Math.sin(v) * C);
        } else Lt.lookAt(n.pos.x - Math.sin(j.yaw) * F * 4, 1.1 + F * 0.25, n.pos.z - Math.cos(j.yaw) * F * 4);
        (MH(n, e), r4(), a4(n));
      }
      ccsCamPost(n, e);
    }
    if ((Se && (qE -= e) < 0 && UC(), PA(e), ccsWarmShop(), ccsLighthouseTick(e), ccsDogMood(e), ccsHeldTick(), HH(e, Le[0]?.pos), eC(Math.min(0.1, e)), nP(Math.min(0.1, e)), Le[0])) {
      let s = Math.min(0.1, e);
      (lC(s, Le[0]), pC(s, Le[0]), Q4(s, Le[0]), sT(s, Le[0]), FC(s, Le[0]), BC(s, Le[0]), oC(s), j.started && p0());
    }
    (nk(Math.min(0.1, e)), rE ? S0.render() : dn.render(K, Lt), ccsSnapTick(Math.min(0.1, e)), ccsSnapAfterRender(), requestAnimationFrame(U4));
  }
  var rn = { list: [], t: 0, rebuild: 0, fade: new Map(), ray: new Ls(), lift: !1, ro: 0 },
    $A = 0.14;
  function A6(i) {
    let e = i.userData.occR;
    if (e) return e;
    let t = i;
    for (let n = i.parent; n && n !== K; n = n.parent) {
      let s = new mt().setFromObject(n).getSize(new H());
      if (Math.max(s.x, s.y, s.z) >= 8) break;
      t = n;
    }
    return ((i.userData.occR = t), t);
  }
  var V4 = new H();
  function XA(i) {
    let e = !1;
    return (
      i.traverse((t) => {
        let n = t;
        if (!n.isMesh || e) return;
        let s = n.userData.fadeOrig ?? n.material;
        for (let o of Array.isArray(s) ? s : [s]) (o.alphaTest > 0 || o.transparent) && (e = !0);
      }),
      e ? 0.06 : $A
    );
  }
  var YA = new Oe().makeScale(0, 0, 0);
  function ZA(i, e) {
    let t = i.userData.instRoots?.[e];
    if (!t) return null;
    if (t.userData.occProxy) return t.userData.occProxy;
    let n = new J();
    n.userData.noOcc = !0;
    let s = [];
    for (let { im: o, i: r } of t.userData.inst) {
      let a = new Oe();
      (o.getMatrixAt(r, a), s.push([o, r, a]));
      let c = new R(o.geometry, o.material);
      ((c.matrixAutoUpdate = !1),
        c.matrix.copy(a),
        (c.castShadow = o.castShadow),
        (c.receiveShadow = !0),
        (c.userData.occR = n),
        n.add(c),
        o.setMatrixAt(r, YA),
        (o.instanceMatrix.needsUpdate = !0));
    }
    return (
      (n.userData.restore = () => {
        for (let [o, r, a] of s) (o.setMatrixAt(r, a), (o.instanceMatrix.needsUpdate = !0));
        (K.remove(n), (t.userData.occProxy = void 0));
      }),
      K.add(n),
      n.updateMatrixWorld(!0),
      (t.userData.occProxy = n),
      n
    );
  }
  function KA(i) {
    if (i.userData.occBig2 === void 0) {
      let e = new mt().setFromObject(i).getSize(new H());
      i.userData.occBig2 = (Math.max(e.x, e.z) >= 8 && e.y < 0.6) || e.y >= 3.8;
    }
    return i.userData.occBig2;
  }
  function W4() {
    let i = new Set();
    for (let n of [...Le, ...wi, ...Nn, ...El, ...Pr, ...ml]) i.add(n.rig.root);
    for (let n of cl) i.add(n.o);
    for (let n of Td) i.add(n.g);
    for (let n of _d) {
      let s = n.mesh ?? n.o;
      s && i.add(s);
    }
    let e = [],
      t = (n) => {
        if (i.has(n) || n.userData.noOcc || n.parent?.userData.noOcc) return;
        let s = n;
        if (
          (s.isMesh && s.isInstancedMesh && s.userData.instRoots && e.push(s),
          s.isMesh && !s.isInstancedMesh && !s.isSkinnedMesh && s.geometry)
        ) {
          let o = s.geometry;
          o.boundingSphere || o.computeBoundingSphere();
          let r = s.getWorldScale(V4),
            a = (o.boundingSphere?.radius ?? 0) * Math.max(r.x, r.y, r.z),
            c = Array.isArray(s.material) ? s.material[0] : s.material;
          (a >= 30 && !s.userData.occBig && ((s.userData.occBig = !0), (s.renderOrder = Math.max(s.renderOrder, 3))),
            a > 0.25 && a < 30 && c && (!c.transparent || s.userData.fadeOrig) && c.visible !== !1 && e.push(s));
        }
        for (let o of n.children) t(o);
      };
    (t(K), (rn.list = e), (rn.skip = i), (rn.rb = W4));
  }
  var JA = [
      [0.35, 0],
      [0.95, 0],
      [0.6, 0.55],
      [0.6, -0.55],
    ],
    QA = new H();
  function eC(i) {
    let e = Le[0];
    if (!e) return;
    if (
      (nC(e.rig.root),
      (rn.ro = (rn.ro ?? 0) - i) < 0 &&
        ((rn.ro = 0.5),
        e.rig.root.traverse((n) => {
          let s = n;
          s.isMesh && !s.userData.isXray && s.renderOrder < 2 && (s.renderOrder = 2);
        })),
      (rn.rebuild -= i) < 0 && ((rn.rebuild = 2.5), W4()),
      (rn.t -= i) < 0)
    ) {
      rn.t = 0.08;
      for (let o of rn.fade.values()) o.hit = !1;
      let n = Lt.position,
        s = QA.set(n.z - e.pos.z, 0, e.pos.x - n.x).normalize();
      for (let [o, r] of JA) {
        let a = V4.set(e.pos.x + s.x * r, Math.max(e.pos.y, e.rig.root.position.y) + o, e.pos.z + s.z * r), // v132: เล็งที่ตัวน้องจริง (ตอนอยู่บนสะพาน/โต๊ะฝึก ตัวลอยสูงกว่า pos.y → ของใต้เท้าเคยโปร่งใสทั้งชิ้น)
          c = n.distanceTo(a);
        (rn.ray.set(n, a.sub(n).normalize()), (rn.ray.far = c - 0.35), (rn.ray.near = 0.05));
        let l = [];
        for (let h of rn.fade.keys()) h.userData.restore && l.push(...h.children);
        // v80: ในร้านยิงเรย์เฉพาะผนัง/ชั้นวางที่บังได้จริง (เดิมยิงใส่สินค้าที่รวมเมชแล้ว ~1 ล้านเหลี่ยม ทุก 0.08 วิ = กระตุก)
        let h0 = rn.list;
        if (Se) {
          (rn.inL?.[0] !== Se || rn.inL[1] !== rn.list) &&
            (rn.inL = [
              Se,
              rn.list,
              rn.list.filter((d) => {
                let u = d;
                for (; u && u !== Se.group; ) u = u.parent;
                if (!u) return !1;
                let m = A6(d);
                return !!(m.userData.occOK || KA(m));
              }),
            ]);
          h0 = rn.inL[2];
        }
        for (let h of rn.ray.intersectObjects(l.length ? [...h0, ...l] : h0, !1)) {
          let f = !0;
          for (let m = h.object; m; m = m.parent)
            if (!m.visible) {
              f = !1;
              break;
            }
          if (!f) continue;
          let d = h.object;
          if (Se && !d.isInstancedMesh) {
            let m = A6(h.object);
            if (!m.userData.occOK && !KA(m)) continue;
          }
          let u = d.isInstancedMesh ? ZA(d, h.instanceId ?? 0) : A6(h.object);
          if (!u) continue;
          let p = rn.fade.get(u);
          p ? (p.hit = !0) : rn.fade.set(u, { a: 1, hit: !0, min: XA(u) });
        }
      }
    }
    let t = rn.fade.size > 0;
    t !== rn.lift &&
      ((rn.lift = t),
      e.rig.root.traverse((n) => {
        let s = n;
        if (!s.isMesh || s.userData.isXray || s.renderOrder !== 2) return;
        let o = s.material;
        ((o.transparent = t), (o.needsUpdate = !0));
      }));
    for (let [n, s] of rn.fade) {
      if (((s.a += ((s.hit ? s.min : 1) - s.a) * Math.min(1, i * 7)), !s.hit && s.a > 0.985)) {
        (ga(n, 1), rn.fade.delete(n), n.userData.restore?.());
        continue;
      }
      ga(n, s.a);
    }
  }
  var tC = new ae(16757575);
  function nC(i) {
    if (i.userData.xray) return;
    i.userData.xray = !0;
    let e = [];
    i.traverse((t) => {
      let n = t;
      n.isMesh && !n.userData.isXray && e.push(n);
    });
    for (let t of e) {
      let n = Array.isArray(t.material) ? t.material[0] : t.material;
      if (n.transparent) continue;
      t.renderOrder = 2;
      let s = n.clone(),
        o = n.onBeforeCompile.bind(n),
        r = n.customProgramCacheKey();
      ((s.onBeforeCompile = (c, l) => {
        (o(c, l),
          (c.uniforms.uXCol = { value: tC }),
          (c.fragmentShader =
            `uniform vec3 uXCol;
` + c.fragmentShader.replace(/}\s*$/, " gl_FragColor = vec4(uXCol, 0.55); }")));
      }),
        (s.customProgramCacheKey = () => r + "|xray"),
        (s.depthFunc = rc),
        (s.depthWrite = !1),
        (s.transparent = !1),
        (s.blending = Gu),
        (s.blendSrc = sc),
        (s.blendDst = oc),
        (s.blendEquation = yo));
      let a = new R(t.geometry, s);
      ((a.userData.isXray = !0),
        (a.userData.noOcc = !0),
        (a.renderOrder = 1),
        (a.castShadow = !1),
        (a.receiveShadow = !1),
        (a.frustumCulled = t.frustumCulled),
        t.add(a));
    }
  }
  var I0 = () => z.year * 1e3 + z.season * 100 + z.day,
    bi = z,
    cn = { on: !1, t: 0, drawn: !1, digs: [], digDay: -1, cv: null, cx: null },
    qh = new H();
  function xa(i = !cn.on) {
    (i &&
      (Se || j.sleeping) &&
      (De(
        "ออกไปข้างนอกก่อนค่อยดมกลิ่นนะ 👃",
        2e3,
      ),
      (i = !1)),
      (cn.on = i),
      document.body.classList.toggle("sniffing", i),
      it("sniffBtn").classList.toggle("on", i),
      i &&
        (ke("pop"),
        q4(),
        Ai("sniff"),
        De(
          St && !St.done
            ? St.learned
              ? `👃 ตามรอยที่มี ${St.icon} วิบวับ ไปหาคนร้าย!`
              : `👃 ไปดมที่เกิดเหตุก่อน (${St.where}) จะได้รู้ว่ารอยไหนคือกลิ่น${St.item}`
            : "👃 โหมดดมกลิ่น: ควันสีทอง = ของฝังอยู่ใต้ดิน ไปขุดดู!",
          3200,
        )));
  }
  function q4() {
    let i = I0();
    if (cn.digDay === i) return;
    ((cn.digDay = i), (cn.digs = []));
    let e = bi.dug?.day === i ? bi.dug.ids : [],
      t = (i * 7919) % 233280,
      n = () => (t = (t * 9301 + 49297) % 233280) / 233280;
    for (let s = 0; cn.digs.length < 8 && s < 900; s++) {
      let o = new H(-70 + n() * 130, 0, -40 + n() * 105);
      po(o) ||
        ri(o, 0.9) ||
        go(o.x, o.z) > 0.01 ||
        cn.digs.some((r) => r.p.distanceTo(o) < 15) ||
        cn.digs.push({ p: o, got: e.includes(cn.digs.length) });
    }
  }
  function iC(i, e) {
    let t = cn.digs[i];
    if (!t || t.got || !Tr(Math.max(0, 3 - fs("dig")))) return;
    (Ai("dig"), (t.got = !0));
    let n = I0();
    (bi.dug?.day !== n && (bi.dug = { day: n, ids: [] }), bi.dug.ids.push(i), ke("dig"));
    let s = t.p.clone().setY(1.2),
      o = Math.random();
    if (o < 0.45) {
      let r = 15 + Math.floor(Math.random() * 30);
      ((z.money += r),
        rt(`💰 +${r}`, s, "big"),
        De(
          `ขุดเจอเหรียญที่ใครทำหล่นไว้ ${r}💰!`,
          2400,
        ));
    } else
      o < 0.75
        ? ((j.bones += 1),
          rt("🦴 +1", s, "big"),
          De(
            "ขุดเจอกระดูกที่ฝังไว้! 🦴",
            2200,
          ))
        : o < 0.9 - 0.04 * fs("luck")
          ? ((z.inv.egg = (z.inv.egg ?? 0) + 1),
            rt("🥚 +1", s, "big"),
            De(
              "เจอไข่ไก่ที่แม่ไก่แอบไปออกไว้ 🥚",
              2400,
            ))
          : ((z.money += 80),
            Ai("treasure"),
            rt("💎 +80💰", s, "big"),
            De(
              "ว้าว! ขุดเจอสมบัติเก่า 💎 ขายได้ 80💰",
              2800,
            ));
    if (fs("dig") >= 2 && Math.random() < 0.5) {
      let r = 10 + Math.floor(Math.random() * 15);
      ((z.money += r),
        setTimeout(() => rt(`⛏ ของแถม +${r}💰`, s.clone().setY(1.8)), 600));
    }
    (Rs(5, e), _t(z));
  }
  var wE = () => 4 + Math.min(4, fs("nose")),
    sC = () => [fn, ni, zn.find((i) => i.def.id === "grocery")?.door].filter(Boolean);
  function oC(i) {
    let e = cn.cv ?? (cn.cv = document.getElementById("scentCv"));
    if (!e) return;
    let t = cn.cx ?? (cn.cx = e.getContext("2d"));
    if (!t) return;
    if (!cn.on || Se) {
      (cn.drawn && (t.clearRect(0, 0, e.width, e.height), (cn.drawn = !1)), cn.on && Se && xa(!1));
      return;
    }
    let n = innerWidth,
      s = innerHeight;
    ((e.width !== n || e.height !== s) && ((e.width = n), (e.height = s)),
      t.clearRect(0, 0, n, s),
      (cn.drawn = !0),
      (cn.t += i));
    let o = cn.t,
      r = Le[0].pos,
      a = Lt.position,
      c = (d, u, p) => (
        qh.set(d, u, p).project(Lt),
        qh.z > 1 || qh.z < -1 ? null : [((qh.x + 1) / 2) * n, ((1 - qh.y) / 2) * s]
      ),
      l = (d, u, p, m, E) => {
        let g = t.createRadialGradient(d, u, 0, d, u, p);
        (g.addColorStop(0, m),
          g.addColorStop(1, "rgba(0,0,0,0)"),
          (t.globalAlpha = E),
          (t.fillStyle = g),
          t.beginPath(),
          t.arc(d, u, p, 0, 6.283),
          t.fill());
      };
    t.globalCompositeOperation = "lighter";
    let h = fs("nose"),
      f = 45 + 8 * h;
    for (let d of cn.digs.slice(0, wE())) {
      if (d.got || d.p.distanceTo(r) > f) continue;
      let u = Math.max(4, a.distanceTo(d.p));
      for (let p = 0; p < 7; p++) {
        let m = (o * 0.45 + p / 7) % 1,
          E = c(d.p.x + Math.sin(o * 2 + p) * 0.25 * m, 0.05 + m * 2.2, d.p.z + Math.cos(o * 1.7 + p) * 0.25 * m);
        E && l(E[0], E[1], ((70 - m * 30) / u) * 6, "rgba(255,206,60,1)", (1 - m) * 0.85);
      }
    }
    for (let d of sC()) {
      if (d.distanceTo(r) > 40) continue;
      let u = Math.max(4, a.distanceTo(d));
      for (let p = 0; p < 4; p++) {
        let m = (o * 0.3 + p / 4) % 1,
          E = c(d.x + Math.sin(o + p * 2) * 0.6, 0.8 + m * 2.4, d.z + Math.cos(o + p) * 0.6);
        E && l(E[0], E[1], (60 / u) * 6, "rgba(255,140,60,1)", (1 - m) * 0.45);
      }
    }
    if (St && !St.done) {
      let d = c(St.scene.x, 0.4, St.scene.z);
      (d && l(d[0], d[1], 46 + Math.sin(o * 4) * 6, "rgba(255,255,255,1)", 0.5),
        St.sus.forEach((u, p) => {
          let m = u.trail,
            E = p === St.culprit && St.learned,
            g = St.learned && !E && fs("det") >= 4 ? 0.35 : 1;
          ((t.strokeStyle = u.col),
            (t.lineCap = "round"),
            (t.lineJoin = "round"),
            (t.globalAlpha = (E ? 0.55 : 0.32) * g),
            t.beginPath());
          let y = !1;
          for (let b of m) {
            let w = b.distanceTo(r) < 50 ? c(b.x, 0.15, b.z) : null;
            if (!w) {
              y = !1;
              continue;
            }
            ((t.lineWidth = Math.max(3, 60 / Math.max(3, a.distanceTo(b)))),
              y ? t.lineTo(w[0], w[1]) : (t.moveTo(w[0], w[1]), (y = !0)));
          }
          t.stroke();
          for (let b = 0; b < m.length; b++) {
            let w = m[b];
            if (w.distanceTo(r) > 50) continue;
            let v = c(w.x, 0.18, w.z);
            if (!v) continue;
            let _ = Math.max(3, a.distanceTo(w)),
              S = 0.35 + 0.65 * Math.max(0, Math.sin(b * 0.55 - o * 5));
            (l(v[0], v[1], Math.max(9, (80 / _) * 6), u.col, (E ? 0.8 : 0.55) * S * g),
              E &&
                b % 3 === 0 &&
                S > 0.5 &&
                ((t.globalCompositeOperation = "source-over"),
                (t.globalAlpha = 0.95),
                (t.font = `${Math.round(Math.max(16, Math.min(30, 260 / _)))}px sans-serif`),
                (t.textAlign = "center"),
                t.fillText(St.icon, v[0], v[1] - 10),
                (t.globalCompositeOperation = "lighter")));
          }
          let x = c(u.n.pos.x, 2.3, u.n.pos.z);
          x && u.n.pos.distanceTo(r) < 50 && l(x[0], x[1], 22, u.col, 0.7 + 0.3 * Math.sin(o * 6));
        }));
    }
    if ((mC(t, c, l, o, r, a), (t.globalCompositeOperation = "source-over"), (t.globalAlpha = 1), h >= 3)) {
      let d = null,
        u = 1e9;
      for (let p of cn.digs.slice(0, wE())) {
        if (p.got) continue;
        let m = p.p.distanceTo(r);
        m < u && ((u = m), (d = p.p));
      }
      if (d) {
        let p = r.x - a.x,
          m = r.z - a.z,
          E = d.x - r.x,
          g = d.z - r.z,
          y = Math.atan2(p * g - m * E, p * E + m * g),
          x = n / 2,
          b = s - 110;
        (t.save(),
          t.translate(x, b),
          (t.fillStyle = "rgba(30,20,50,.6)"),
          t.beginPath(),
          t.arc(0, 0, 30, 0, 6.283),
          t.fill(),
          t.rotate(y),
          (t.fillStyle = "#ffd23f"),
          t.beginPath(),
          t.moveTo(0, -24),
          t.lineTo(10, 6),
          t.lineTo(0, 0),
          t.lineTo(-10, 6),
          t.closePath(),
          t.fill(),
          t.restore(),
          (t.font = "600 12px Mitr, sans-serif"),
          (t.textAlign = "center"),
          (t.fillStyle = "#fff"),
          t.fillText(`🧭 ${Math.round(u)} ม.`, x, b + 46));
      }
    }
  }
  var St = null,
    C6 = 3,
    rC = ["rgba(255,90,140,1)", "rgba(90,200,255,1)", "rgba(170,120,255,1)"],
    k6 = [
      "ไม่ใช่ฉันนะ! 😤",
      "เปล่านะ ฉันไม่ได้เอาไป!",
      "ดมผิดคนแล้วจ้า 😅",
      "โฮ่งใส่ทำไมเนี่ย 😳",
    ];
  function aC() {
    let i = [
        {
          item: "ไก่ย่าง",
          icon: "🍗",
          victim: "ป้าอู๊ด",
          where:
            "ร้านไก่ย่างป้าอู๊ด",
          scene: fn.clone().setZ(fn.z - 1.5),
        },
        {
          item: "ครัวซองต์",
          icon: "🥐",
          victim: "ลุงปั้ม",
          where:
            "ร้านขนมปังลุงปั้ม",
          scene: ni.clone().add(new H(Math.sin(In) * 1.6, 0, Math.cos(In) * 1.6)),
        },
      ],
      e = zn.find((t) => t.def.id === "grocery");
    return (
      e &&
        i.push({
          item: "ข้าวปั้น",
          icon: "🍙",
          victim:
            "เจ้าของถูกจังมาร์ท",
          where:
            "หน้าร้านถูกจังมาร์ท",
          scene: e.door.clone(),
        }),
      i
    );
  }
  function cC(i, e) {
    let t = [],
      n = Math.max(1, Math.ceil(i.distanceTo(e) / 1.2));
    for (let s = 0; s <= n; s++)
      t.push(
        i
          .clone()
          .lerp(e, s / n)
          .setY(0),
      );
    return t;
  }
  function j4() {
    let i = aC(),
      e = i[Math.floor(Math.random() * i.length)],
      t = Nn.filter(
        (n) =>
          n.name &&
          !n.shop &&
          !n.leave &&
          n.fadeOut === void 0 &&
          !((n.sitT ?? 0) > 0) &&
          n.pos.distanceTo(e.scene) < 70,
      )
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    return t.length < 3
      ? !1
      : ((St = {
          ...e,
          sus: t.map((n, s) => ((n.sus = !0), { n, col: rC[s], trail: cC(e.scene, n.pos) })),
          culprit: Math.floor(Math.random() * 3),
          learned: !1,
          strikes: 0,
          done: !1,
          t: 0,
        }),
        (bi.caseDay = I0()),
        ke("nope"),
        d1(),
        De(
          `🕵️ คดีใหม่! ${St.item}${St.icon}ของ${St.victim}หายไป \xB7 ไปดมที่${St.where}แล้วกด 👃 ตามกลิ่น`,
          4200,
        ),
        !0);
  }
  var vE = () => 2 + (fs("det") >= 2 ? 1 : 0);
  function RE() {
    if (St) {
      for (let i of St.sus) i.n.sus = !1;
      ((St.done = !0), d1());
    }
  }
  function d1() {
    let i = document.getElementById("caseChip");
    if (!i) return;
    let e = !!St && !St.done;
    (i.classList.toggle("on", e),
      !(!e || !St) &&
        (i.innerHTML = St.learned
          ? `🕵️ ตามกลิ่น ${St.icon} หาคนร้าย <b>(${vE() - St.strikes} ครั้ง)</b>`
          : `🕵️ ${St.item}${St.icon}หาย \xB7 ไปดมที่${St.where}`));
  }
  function lC(i, e) {
    if (
      j.started &&
      ((C6 -= i) < 0 &&
        ((C6 = 3),
        (!St || St.done) && bi.caseDay !== I0() && !Se && !j.sleeping && j.time > 0.3 && j.time < 0.72 && j4()),
      !(!St || St.done))
    )
      for (let t of St.sus) {
        let n = t.trail;
        n[n.length - 1].distanceTo(t.n.pos) > 1.2 &&
          (n.push(t.n.pos.clone().setY(0)), n.length > 160 && n.splice(1, 1));
      }
  }
  function $4(i) {
    if (!St || St.done) return !1;
    let e = St;
    if (!e.learned && i.distanceTo(e.scene) < 2.3)
      return (
        nt(
          `👃 ดมที่เกิดเหตุ (${e.icon})`,
          () => {
            ((e.learned = !0),
              ke("pop"),
              rt(
                `👃 จำกลิ่น${e.icon}ได้แล้ว!`,
                e.scene.clone().setY(1.6),
                "big",
              ),
              cn.on || xa(!0),
              De(
                `จำกลิ่น${e.item}ได้แล้ว! มีรอยกลิ่น 3 สาย สายที่มี ${e.icon} วิบวับคือคนร้าย ตามไปแล้วเห่าจับเลย`,
                4200,
              ),
              d1());
          },
        ),
        !0
      );
    let t = null,
      n = 2.1;
    for (let o of e.sus) {
      let r = o.n.pos.distanceTo(i);
      r < n && ((n = r), (t = o));
    }
    if (!t) return !1;
    let s = t;
    return e.learned
      ? (nt(`🐾 เห่าจับ ${s.n.name}!`, () => {
          if ((Uc(), (s.n.wait = Math.max(s.n.wait, 3)), s.n.vel?.multiplyScalar(0), e.sus.indexOf(s) === e.culprit)) {
            (Ln(
              s.n.pos,
              `ขอโทษจ้า… หิวเลยแอบหยิบ${e.item}ไป คืนให้นะ ${e.icon}`,
            ),
              ke("coin"));
            let o = 60 + 15 * fs("det");
            ((z.money += o),
              Rs(30, Le[0]),
              (j.score += 10),
              (bi.casesSolved = (bi.casesSolved ?? 0) + 1),
              Ai("case"),
              rt(
                `🎉 ไขคดีสำเร็จ! +${o}💰`,
                s.n.pos.clone().setY(2.4),
                "big",
              ),
              De(
                `🕵️ เก่งมาก! จับได้ว่า${s.n.name}เอา${e.item}ของ${e.victim}ไป \xB7 ไขคดีแล้ว ${bi.casesSolved} คดี`,
                4e3,
              ),
              RE(),
              _t(z));
          } else
            (e.strikes++,
              Ln(s.n.pos, k6[Math.floor(Math.random() * k6.length)]),
              ke("nope"),
              e.strikes >= vE()
                ? (De(
                    `😿 จับผิดคน 2 ครั้ง คนร้ายหนีไปแล้ว… คนร้ายคือ${e.sus[e.culprit].n.name} พรุ่งนี้มีคดีใหม่นะ`,
                    4200,
                  ),
                  RE())
                : (De(
                    `ไม่ใช่คนนี้! ลองดูรอยกลิ่นดี ๆ อีกที เหลือโอกาสอีก ${vE() - e.strikes} ครั้ง`,
                    2800,
                  ),
                  d1()));
        }),
        !0)
      : (nt(`🕵️ ${s.n.name}?`, () =>
          De(
            `ไปดมที่${e.where}ก่อน จะได้รู้ว่าต้องตามกลิ่นอะไร 👃`,
            2600,
          ),
        ),
        !0);
  }
