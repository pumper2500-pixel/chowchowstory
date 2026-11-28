  var ho = null,
    GH = new H(),
    Ma = () => z.train ?? (z.train = { xp: 0, lvl: 1, runs: 0 }),
    rd = (i) => Math.round(80 * Math.pow(i, 1.5) + 20);
  // ===== v120: เวลาเปิดสนามฝึก, ไฟสนาม, ระดับการฝึก, อาบน้ำในอ่าง, หมวกพิเศษ =====
  var ccsTRSign = null,
    ccsTRLvDef = [
      { n: "เบื้องต้น", e: 1.25, p: 0.65, chg: 1.15, pw: 0.13, spd: 1, bal: 1, stay: 3, sit: 1.6, mul: 1, gain: 1 },
      { n: "ปานกลาง", e: 0.95, p: 0.45, chg: 0.95, pw: 0.1, spd: 1.25, bal: 1.35, stay: 4, sit: 1.2, mul: 1.5, gain: 1.4 },
      { n: "ระดับสูง", e: 0.75, p: 0.3, chg: 0.8, pw: 0.075, spd: 1.5, bal: 1.7, stay: 5, sit: 0.9, mul: 2, gain: 1.8 },
    ];
  var ccsTRCamA = null;
  function ccsTROpen() {
    let i = j.time % 1;
    return i >= 8 / 24 && i < 19 / 24;
  }
  function ccsTRL() {
    return ccsTRLvDef[ho?.lv ?? 0];
  }
  function ccsTRW() {
    let i = ccsTRL(),
      e = ccsSt("bal");
    return { e: i.e + e * 0.005, p: i.p + e * 0.004 };
  }
  function ccsStarKey(i, e) {
    return e ? `${i}:${e}` : i;
  }
  function ccsTRUnlocked(i, e) {
    return !e || (z.trainStars?.[ccsStarKey(i, e - 1)] ?? 0) >= 2;
  }
  function ccsTRFieldInit() {
    if (ccsTRSign) return;
    // ป้าย OPEN / CLOSED ที่ซุ้มทางเข้า
    let i = document.createElement("canvas");
    ((i.width = 256), (i.height = 112));
    let e = new ut(i);
    e.colorSpace = "srgb";
    let t = new R(new Te(1.5, 0.66), new be({ map: e, side: Ke, toneMapped: !1 }));
    (t.position.set(-14.1, 1.55, 16.25), (t.rotation.y = Math.PI), K.add(t));
    let n = new R(new re(0.04, 0.04, 1.3, 6), Ae(5592405, 0.5));
    (n.position.set(-14.1, 0.65, 16.27), K.add(n));
    ccsTRSign = { cv: i, tex: e, open: null };
    // ไฟส่องสว่างสนามฝึก 6 ต้น
    let s = Ae(4473924, 0.5, { metalness: 0.4 }),
      o = new be({ color: 16774368, toneMapped: !1 });
    for (let [r, a] of [
      [-30.6, 15.6],
      [-5.4, 15.6],
      [-30.6, 34],
      [-5.4, 34],
      [-18, 34.2],
      [-30.8, 25],
    ]) {
      let c = new R(new re(0.07, 0.09, 4.6, 8), s);
      (c.position.set(r, 2.3, a), K.add(c), pt.push({ x: r, z: a, hw: 0.15, hd: 0.15 }));
      let l = new R(new ee(0.7, 0.16, 0.36), s);
      (l.position.set(r + (r < -18 ? 0.3 : -0.3), 4.6, a + (a < 25 ? 0.2 : -0.2)), K.add(l));
      let h = new R(new ee(0.6, 0.04, 0.28), o);
      (h.position.copy(l.position).setY(4.51), K.add(h));
      let f = new En(16774368, 0, 20, 1.2);
      (f.position.copy(l.position).setY(4.3), K.add(f), H0.push({ l: f, on: 16 }), g1?.adopt && g1.adopt(f));
    }
  }
  function ccsTRSignTick() {
    if (!ccsTRSign) return;
    let i = ccsTROpen();
    if (ccsTRSign.open === i) return;
    ccsTRSign.open = i;
    let e = ccsTRSign.cv.getContext("2d");
    ((e.fillStyle = i ? "#1e9e4a" : "#c0392b"), e.fillRect(0, 0, 256, 112), (e.strokeStyle = "#fff"), (e.lineWidth = 6), e.strokeRect(5, 5, 246, 102), (e.fillStyle = "#fff"), (e.textAlign = "center"), (e.font = "900 50px Mitr, sans-serif"), e.fillText(i ? "OPEN" : "CLOSED", 128, 60), (e.font = "700 22px Mitr, sans-serif"), e.fillText("เปิด 08:00 - 19:00", 128, 95), (ccsTRSign.tex.needsUpdate = !0));
    ccsTRNpc && (ccsTRNpc.rig.root.visible = i);
  }
  // ---- อาบน้ำในอ่างที่ร้านอาบน้ำตัดขน ----
  var ccsBath = null,
    ccsSparkTex = null;
  function ccsSparkle(i, e = 14) {
    ccsSparkTex ??= ss(64, 64, (t) => {
      ((t.fillStyle = "#fff"), t.beginPath());
      for (let n = 0; n < 8; n++) {
        let s = (n / 8) * Math.PI * 2,
          o = n % 2 ? 9 : 30;
        t.lineTo(32 + Math.cos(s) * o, 32 + Math.sin(s) * o);
      }
      t.fill();
    });
    for (let t = 0; t < e; t++) {
      let n = new zi(new vi({ map: ccsSparkTex, color: [16774144, 16777215, 10741759, 16759039][t % 4], transparent: !0, depthWrite: !1, blending: $i, toneMapped: !1 }));
      (n.position.copy(i).add(new H((Math.random() - 0.5) * 1.1, 0.3 + Math.random() * 0.9, (Math.random() - 0.5) * 1.1)), n.scale.setScalar(0.01), K.add(n), Yp.push({ o: n, t: 1.1 + Math.random() * 0.5, sp: !0, a: Math.random() * 6 }));
    }
  }
  function ccsBathStart() {
    if (!uE || !Se || Se.id !== "groom") return !1;
    let i = new H();
    uE.getWorldPosition(i);
    let e = [];
    for (let t = 0; t < 26; t++) {
      let n = new R(new we(0.09 + Math.random() * 0.09, 10, 8), new X({ color: 16777215, roughness: 0.25, transparent: !0, opacity: 0.92 }));
      (n.scale.setScalar(0.01), K.add(n), e.push({ m: n, a: Math.random() * 6, r: 0.18 + Math.random() * 0.3, y: 0.15 + Math.random() * 0.55, d: Math.random() * 1.2 }));
    }
    return (Le[0].rig.root.traverse((t) => t.userData.isXray && (t.visible = !1)), (ccsBath = { t: 0, dur: 4.2, at: i, back: Le[0].pos.clone(), fo: e }), qs(), ke("splash"), !0);
  }
  function ccsBathTick(i) {
    let e = ccsBath;
    if (!e) return;
    let t = Le[0];
    ((e.t += i), c0.set(0, 0, 0), (Ed = !1));
    let n = e.t < e.dur;
    if (n) {
      (t.pos.set(e.at.x, 0, e.at.z), (j.jy = 0.4), (j.vy = 0), (t.dir = 2.66), (t.spd = 0), t.rig.root.position.set(e.at.x, j.gy + 0.4, e.at.z));
      let s = Math.min(1, e.t / 1.2) * (e.t > e.dur - 0.5 ? (e.dur - e.t) / 0.5 : 1);
      for (let o of e.fo) {
        let r = Math.min(1, Math.max(0, (e.t - o.d) / 0.6)) * s;
        (o.m.scale.setScalar(Math.max(0.01, r)), o.m.position.set(e.at.x + Math.cos(o.a + e.t * 0.6) * o.r, 0.45 + o.y + Math.sin(e.t * 3 + o.a) * 0.03, e.at.z + Math.sin(o.a + e.t * 0.6) * o.r * 0.7));
      }
      e.t % 0.9 < i && ke("splash");
    } else {
      for (let s of e.fo) (K.remove(s.m), s.m.geometry.dispose());
      (t.rig.root.traverse((o) => o.userData.isXray && (o.visible = !0)), (ccsBath = null), (j.jy = 0), t.pos.copy(e.back));
      // อาบน้ำร้าน: สะอาด + หอมฟุ้ง 1 วัน + ขนเงาวิ้ง
      ((z.clean = 100), (z.fresh = j.time + 1), (z.energy = Math.min(100, (z.energy ?? 0) + 60)), ccsSparkle(t.pos, 18), ke("sparkle"), rt("✨ วิ้ง! หอมฟุ้ง", t.pos, "big"), De("🛁 อาบน้ำเสร็จแล้ว! ✨ หอมฟุ้ง 1 วัน: ตัวไม่เลอะง่าย · ทิปจากคำสั่ง ×2 · ชาวเมืองทักชม", 3600), Ai("bath"), ccsDogSay("happy"), ccsSnapSoon("🛁 อาบน้ำหอมฟุ้ง วิ้ง ✨", 0.05, "bath"), _t(z));
    }
  }
  function ccsFresh() {
    return (z.fresh ?? 0) > j.time;
  }
  // ---- หมวกพิเศษ ----
  function ccsWear(i) {
    return Object.values(Ar()).includes(i);
  }
  // ===== v122: ความสามารถพิเศษของหมวกทุกใบ (พลัง + ลูกเล่นเฉพาะ) =====
  var ccsHatStat = {
      Hat_01: { heat: 1, speed: 1 }, Hat_02: { charm: 1, luck: 1 }, Hat_03: { speed: 1, charm: 1 }, Hat_04: { heat: 2, charm: 1 },
      Hat_05: { stam: 2 }, Hat_06: { luck: 1, charm: 1 }, Hat_07: { charm: 2 }, Hat_08: { heat: 1, speed: 1 },
      Hat_09: { stam: 2, speed: 1 }, Hat_10: { speed: 2 }, Hat_11: { stam: 2 }, Hat_12: { dig: 1, stam: 1 },
      Hat_13: { stam: 1 }, Hat_14: { heat: 2 }, Hat_15: { charm: 3, luck: 2 }, Hat_16: { det: 3, nose: 1 },
      Hat_17: { stam: 2, dig: 1 }, Hat_18: { charm: 2, det: 1 }, Hat_19: { luck: 1, stam: 1 }, Hat_20: { speed: 1 },
      Hat_21: { charm: 2 }, Hat_22: { luck: 2 }, Hat_23: { charm: 2 }, Hat_24: { speed: 2 },
      Hat_25: { dig: 3, nose: 1 }, Hat_26: { luck: 2, speed: 1 }, Hat_27: { det: 3, nose: 2 }, Hat_28: { charm: 1, det: 1 },
      Hat_29: { heat: 3 }, Hat_30: { charm: 3 }, Hat_31: { charm: 2 }, Hat_32: { luck: 2, nose: 1 },
      Hat_33: { speed: 1 }, Hat_34: { charm: 2, luck: 1 }, Hat_35: { luck: 1, charm: 1 }, Hat_36: { charm: 2 },
      Hat_37: { speed: 2, stam: 1 }, Hat_38: { det: 1, luck: 1 }, Hat_39: { heat: 2, stam: 1 }, Hat_40: { heat: 2 },
      Hat_41: { charm: 2, luck: 1 }, Hat_42: { stam: 2 }, Hat_43: { stam: 2 }, Hat_44: { speed: 1, charm: 1 },
      Hat_46: { luck: 1, nose: 1 }, Hat_47: { speed: 3 }, Hat_48: { charm: 1 }, Hat_49: { stam: 3 },
      Hat_50: { luck: 3 }, Hat_51: { stam: 2 }, Hat_53: { charm: 2 }, Hat_54: { det: 1, luck: 1 },
      Hat_55: { speed: 1, charm: 1 }, Hat_56: { charm: 2 }, Hat_58: { charm: 2 }, Hat_59: { charm: 2 },
    },
    // ลูกเล่นเฉพาะใบ: [คีย์, คำอธิบายสั้น]
    ccsHatGim = {
      Hat_48: ["chick", "🍗 บ้านมีไก่ย่างฟรีวันละจาน · ป้าอู้ดลด 40%"],
      Hat_41: ["santa", "🎁 บ้านมีกล่องของขวัญทุกวัน (เงิน 30-90💰)"],
      Hat_53: ["pumpkin", "🥧 บ้านมีพายฟักทองฟรีวันละชิ้น"],
      Hat_04: ["rain", "☔ ฝนตกตัวไม่เลอะ · สกปรกช้าลงครึ่งหนึ่ง"],
      Hat_03: ["swim", "🏊 ว่ายน้ำเร็วเต็มสปีด (ไม่ช้าลงในน้ำ)"],
      Hat_44: ["swim", "🏊 ว่ายน้ำเร็วเต็มสปีด (ไม่ช้าลงในน้ำ)"],
      Hat_33: ["swim", "🏊 ว่ายน้ำเร็วเต็มสปีด (ไม่ช้าลงในน้ำ)"],
      Hat_43: ["swim", "🏊 ว่ายน้ำเร็วเต็มสปีด (ไม่ช้าลงในน้ำ)"],
      Hat_55: ["shark", "🐳 ความผูกพันปลาวาฬ ×2 · เหยื่อปลาวาฬลด 30%"],
      Hat_19: ["sailor", "⚓ แผงปลาลุงทะเลลด 25%"],
      Hat_15: ["crown", "👑 ทุกร้านอาหารลด 15%"],
      Hat_25: ["miner", "🔦 ไฟฉายส่องทางตอนกลางคืน"],
      Hat_20: ["prop", "🚁 กระโดดสูงขึ้น 25% · ร่อนลงช้า"],
      Hat_13: ["drink", "🥤 กระหายน้ำช้าลงครึ่งหนึ่ง"],
      Hat_38: ["grad", "🎓 ฝึกได้พลังเพิ่ม 30% · ค่าฝึกลด 20%"],
      Hat_17: ["viking", "⚔️ จุดโทษ: ช่องพลังเขียวกว้างขึ้น"],
      Hat_36: ["clown", "🤡 ทิปจากการโชว์คำสั่ง ×2"],
      Hat_59: ["clown", "🤡 ทิปจากการโชว์คำสั่ง ×2"],
      Hat_51: ["helmet", "⛑ วิ่งใช้พลังน้อยลงครึ่งหนึ่ง"],
      Hat_06: ["plunger", "🪠 ปวดฉี่/อึช้าลงครึ่งหนึ่ง"],
      Hat_49: ["koala", "🐨 หิวช้าลง 30%"],
      Hat_16: ["police", "👮 ชาวเมืองให้ทิปเพิ่ม 50%"],
    };
  function ccsHG(k) {
    let i = Ar().head;
    if (!i || !i.startsWith("cc:")) return !1;
    let e = ccsHatGim[i.slice(3)];
    return !!e && e[0] === k;
  }
  function ccsPriceF(m, r) {
    // ตัวคูณราคาเมนูอาหาร (ส่วนลดเบเกอรี่ + หมวก)
    let i = m === DE ? G3() : 1;
    return (
      m === Xk && ccsHG("chick") && (i *= 0.6),
      m === Yk && ccsHG("sailor") && !r.bait && (i *= 0.75),
      r.bait && ccsHG("shark") && (i *= 0.7),
      ccsHG("crown") && !r.bait && !ccsSetOn("king") && (i *= 0.85),
      ccsSetOn("king") && !r.bait && (i *= 0.75),
      r.bait && ccsSetOn("sailor") && (i *= 0.6),
      i
    );
  }
  var ccsFreeGift = null,
    ccsLamp = null;
  function ccsGiftMesh(k) {
    let i = new J(),
      e = new R(new re(0.32, 0.26, 0.05, 24), Ae(16777215, 0.4));
    if (k === "chick") {
      i.add(e);
      let t = ze("roast") ? je("roast", 0.42) : new R(new we(0.17, 12, 10), Ae(12088115, 0.6));
      (t.position.y = 0.04), i.add(t);
    } else if (k === "pumpkin") {
      i.add(e);
      let t = new R(new re(0.24, 0.2, 0.07, 24), Ae(14251782, 0.6));
      t.position.y = 0.065;
      let n = new R(new vt(0.235, 0.025, 6, 24), Ae(14201950, 0.7));
      ((n.rotation.x = Math.PI / 2), (n.position.y = 0.1), i.add(t, n));
    } else {
      let t = new R(new ee(0.46, 0.38, 0.46), Ae(14366250, 0.5));
      t.position.y = 0.19;
      let n = new R(new ee(0.48, 0.06, 0.1), Ae(16766720, 0.4)),
        o = n.clone();
      ((n.position.y = o.position.y = 0.2), (o.rotation.y = Math.PI / 2), (n.scale.y = o.scale.y = 6.6));
      let r = new R(new vt(0.08, 0.025, 6, 12), Ae(16766720, 0.4));
      ((r.position.set(0, 0.42, 0)), i.add(t, n, o, r));
    }
    i.traverse((t) => t.isMesh && (t.castShadow = !0));
    return i;
  }
  function ccsHatTick(i) {
    let e = Ar().head?.slice(3),
      t = e && ccsHatGim[e]?.[0],
      n = ["chick", "santa", "pumpkin"].includes(t) && Rn && Se === Rn && (z.hatGift ?? {})[t] !== z.day ? t : null;
    if (n && ccsFreeGift?.k !== n) {
      ccsFreeGift && K.remove(ccsFreeGift.g);
      let s = ccsGiftMesh(n),
        o = Rn.bowls.clone().add(new H(0.9, 0, 0));
      (s.position.copy(o).setY(0.03), K.add(s));
      let r = { chick: "🍗 ฟรี!", santa: "🎁 ของขวัญ!", pumpkin: "🥧 ฟรี!" }[n],
        a = new zi(new vi({ map: ei(r, 16765503, 9067051, 256, 96), transparent: !0, depthWrite: !1 }));
      (a.scale.set(0.9, 0.34, 1), (a.position.y = 0.85), s.add(a), (ccsFreeGift = { k: n, g: s, p: o, tag: a }));
    } else !n && ccsFreeGift && (K.remove(ccsFreeGift.g), (ccsFreeGift = null));
    ccsFreeGift && (ccsFreeGift.tag.position.y = 0.85 + Math.sin(performance.now() * 0.003) * 0.04);
    // ไฟฉายหมวกนักขุด (สร้างครั้งเดียว ปรับความสว่างแทนการเพิ่ม/ลบไฟ)
    if (!ccsLamp && Le[0]) {
      ((ccsLamp = new En(16774604, 0, 11, 1.3)), K.add(ccsLamp), g1?.adopt ? g1.adopt(ccsLamp, K) : K.remove(ccsLamp));
    }
    if (ccsLamp && Le[0]) {
      let s = j.time % 1,
        o = t === "miner" && !Se && (s > 0.78 || s < 0.24),
        r = Le[0];
      ((ccsLamp.intensity += ((o ? 9 : 0) - ccsLamp.intensity) * Math.min(1, i * 4)), ccsLamp.position.set(r.pos.x + Math.sin(r.dir ?? 0) * 1.6, 1.3 + j.jy, r.pos.z + Math.cos(r.dir ?? 0) * 1.6));
    }
  }
  function ccsGiftTake(e) {
    let i = ccsFreeGift;
    if (!i) return;
    (z.hatGift ??= {})[i.k] = z.day;
    i.k === "chick"
      ? (mi(55, 0), (z.energy = Math.min(100, (z.energy ?? 0) + 15)), rt("🍗 อร่อย! +55🍖 +15⚡", e, "big"))
      : i.k === "pumpkin"
        ? (mi(40, 0), (z.energy = Math.min(100, (z.energy ?? 0) + 20)), rt("🥧 หวานหอม! +40🍖 +20⚡", e, "big"))
        : ((i = (30 + Math.floor(Math.random() * 61)) * (ccsSetOn("santa") ? 2 : 1)), (z.money += i), Ei(), rt(`🎁 ได้ ${i}💰 จากซานต้า!`, e, "big"));
    (ke("heart"), ccsSparkle(e, 10), _t(z));
  }
  // ===== v125: ชุดเซ็ต (ใส่ครบได้โบนัส) · อัลบั้มรูป (ถ่ายเอง + บันทึกช่วงสำคัญอัตโนมัติ) =====
  var ccsSets = [
    { id: "santa", ic: "🎅", n: "ชุดซานต้า", need: ["cc:Hat_41", "dw:folk_santa", "dw:kick_santa"], st: { charm: 3, luck: 2 }, d: "ของขวัญซานต้าที่บ้านได้เงิน ×2" },
    { id: "viking", ic: "⚔️", n: "ชุดนักรบไวกิ้ง", need: ["cc:Hat_17", "dw:folk_viking", "dw:kick_viking"], st: { stam: 3, dig: 2 }, d: "จุดโทษ: ช่องเขียวกว้างขึ้นอีก · ชนะได้เงิน ×1.5" },
    { id: "sailor", ic: "⚓", n: "ชุดกะลาสี", need: ["cc:Hat_19", "dw:stripe_navy", "dw:shoe_blue"], st: { luck: 2, speed: 1 }, d: "เหยื่อปลาวาฬลด 40% · ป้อนวาฬได้ความผูกพันเพิ่ม +1" },
    { id: "rain", ic: "☔", n: "ชุดกันฝน", need: ["cc:Hat_04", "dw:raincoat", "dw:shoe_yellow"], st: { stam: 2, heat: 2 }, d: "ฝนตกตัวไม่เลอะเลย · เดินเร็วขึ้น 10% ตอนฝนตก" },
    { id: "jester", ic: "🃏", n: "ชุดตัวตลกราชสำนัก", need: [["cc:Hat_36", "cc:Hat_59"], "dw:folk_jester", "dw:kick_pompom"], st: { charm: 4 }, d: "ทิปจากการโชว์คำสั่ง ×3" },
    { id: "king", ic: "👑", n: "ชุดราชาแห่งเมือง", need: ["cc:Hat_15", "dw:col_crown", "dw:folk_rocker"], st: { charm: 3, luck: 3 }, d: "ทุกร้านอาหารลด 25%" },
    { id: "sleuth", ic: "🔎", n: "ชุดนักสืบ", need: ["cc:Hat_27", "dw:col_sniff", "dw:folk_flannel", "dw:kick_work"], st: { det: 3, nose: 3 }, d: "รางวัลคดีและของที่ขุดได้ดีขึ้น (พลังนักสืบ/จมูก +3)" },
  ];
  function ccsSetHas(i) {
    let e = Object.values(Ar());
    return i.need.filter((t) => (Array.isArray(t) ? t.some((n) => e.includes(n)) : e.includes(t))).length;
  }
  function ccsSetOn(i) {
    let e = ccsSets.find((t) => t.id === i);
    return !!e && ccsSetHas(e) === e.need.length;
  }
  function ccsSetBonus() {
    let i = {};
    for (let e of ccsSets) if (ccsSetHas(e) === e.need.length) for (let [t, n] of Object.entries(e.st)) i[t] = (i[t] ?? 0) + n;
    return i;
  }
  var ccsSetPrev = null;
  function ccsSetCheck() {
    let i = ccsSets.filter((e) => ccsSetHas(e) === e.need.length).map((e) => e.id).join(",");
    if (ccsSetPrev !== null && i !== ccsSetPrev)
      for (let e of ccsSets)
        ccsSetOn(e.id) && !ccsSetPrev.split(",").includes(e.id) && (ke("quest"), ccsSparkle(Le[0].pos, 14), De(`${e.ic} ใส่${e.n}ครบเซ็ต! ${e.d}`, 3600), Ai("setwear"), ccsSnapSoon(`${e.ic} แต่ง${e.n}ครบเซ็ต`, 0.6));
    ccsSetPrev = i;
  }
  function ccsSetHtml() {
    let i = (e) => (_n[e]?.icon ?? "") + " " + (_n[e]?.name ?? e);
    return `<h4 class="qh">🧩 ชุดเซ็ต <small>ใส่ครบได้โบนัสพิเศษ</small></h4>${ccsSets
      .map((e) => {
        let t = ccsSetHas(e),
          n = t === e.need.length;
        return `<div class="qcard${n ? " ok" : ""}"><b>${e.ic} ${e.n} ${n ? "✅" : `(${t}/${e.need.length})`}</b><p>${e.need.map((s) => (Array.isArray(s) ? s.map(i).join(" หรือ ") : i(s))).join(" + ")}</p><p class="qrw">🎁 ${e.d} · ${Object.entries(e.st)
          .map(([s, o]) => `${rl[s].ic}+${o}`)
          .join(" ")}</p></div>`;
      })
      .join("")}`;
  }
  // ---- อัลบั้มรูป ----
  var ccsSnapQ = null,
    ccsSnapCool = {};
  function ccsPhotos() {
    try {
      return JSON.parse(localStorage.getItem("ccs-photos") ?? "[]");
    } catch {
      return [];
    }
  }
  function ccsSnapSoon(cap, delay = 0.4, key) {
    // key: กันถ่ายซ้ำช่วงเดียวกันบ่อยเกิน (ต่อวันในเกม)
    if (key) {
      if (ccsSnapCool[key] === z.day) return;
      ccsSnapCool[key] = z.day;
    }
    ccsSnapQ = { cap, t: delay };
  }
  function ccsSnapTick(dt) {
    ccsSnapQ && ccsSnapQ.t > 0 && (ccsSnapQ.t -= dt);
  }
  // เรียกทันทีหลังวาดภาพลงจอในเฟรมเดียวกัน (ภาพยังอยู่ในบัฟเฟอร์)
  function ccsSnapAfterRender() {
    if (!ccsSnapQ || ccsSnapQ.t > 0) return;
    let i = ccsSnapQ;
    ccsSnapQ = null;
    try {
      let e = dn.domElement,
        t = 480,
        n = Math.round((t * e.height) / e.width),
        s = document.createElement("canvas");
      ((s.width = t), (s.height = n), s.getContext("2d").drawImage(e, 0, 0, t, n));
      let o = s.toDataURL("image/jpeg", 0.72),
        r = ccsPhotos();
      r.unshift({ img: o, cap: i.cap, day: z.day, ts: Date.now() });
      for (; r.length > 36; ) r.pop();
      for (let a = 0; a < 5; a++)
        try {
          localStorage.setItem("ccs-photos", JSON.stringify(r));
          break;
        } catch {
          r.splice(-4);
        }
      (ke("shutter"), ccsFlash(), De(`📷 บันทึกลงอัลบั้มแล้ว: ${i.cap}`, 2200), ccsDexOnSnap());
    } catch (e) {
      console.warn("snap", e);
    }
  }
  function ccsOnScreen(p) {
    let i = new H().subVectors(p, Lt.position).normalize(),
      e = new H();
    return (Lt.getWorldDirection(e), i.dot(e) > 0.82);
  }
  function ccsFlash() {
    let i = document.createElement("div");
    ((i.className = "snapflash"), document.body.appendChild(i), setTimeout(() => i.remove(), 600));
  }
  function ccsPhotoAlbum(sel = -1) {
    let i = ccsPhotos();
    if (sel >= 0 && i[sel]) {
      let e = i[sel];
      (Gi(
        "📷 อัลบั้มรูป",
        `<div class="phview"><img src="${e.img}" alt=""><p><b>${e.cap}</b><br><small>วันที่ ${e.day} ในเกม · ${new Date(e.ts).toLocaleDateString("th-TH")}</small></p></div><div class="offerBtns"><button class="bigbtn" data-phback>⬅ กลับ</button><button class="bigbtn ghost" data-phsave>💾 บันทึกลงเครื่อง</button><button class="bigbtn ghost" data-phdel>🗑 ลบรูปนี้</button></div>`,
      ),
        document.querySelector("[data-phback]")?.addEventListener("click", () => ccsPhotoAlbum()),
        document.querySelector("[data-phsave]")?.addEventListener("click", () => {
          let t = document.createElement("a");
          ((t.href = e.img), (t.download = `chowchow-${e.ts}.jpg`), t.click());
        }),
        document.querySelector("[data-phdel]")?.addEventListener("click", () => {
          (i.splice(sel, 1), localStorage.setItem("ccs-photos", JSON.stringify(i)), ke("pop"), ccsPhotoAlbum());
        }));
      return;
    }
    (Gi(
      "📷 อัลบั้มรูป",
      `<p class="note">เกมจะถ่ายเก็บให้เองตอนสำคัญ (ได้ 3 ดาว, ชนะจุดโทษ, ออร์กากระโดดใกล้ ๆ, ป้อนปลาเข้าปาก, แต่งชุดเซ็ตครบ, อาบน้ำหอม) · เก็บได้ ${36} รูปล่าสุด</p><button class="bigbtn" data-phsnap>📸 ถ่ายรูปตอนนี้</button><div class="phgrid">${
        i.length ? i.map((e, t) => `<button data-ph="${t}"><img src="${e.img}" alt=""><small>${e.cap}</small></button>`).join("") : '<p class="note">ยังไม่มีรูป ลองกด 📸 ถ่ายรูปตอนนี้ดูสิ</p>'
      }</div>`,
    ),
      document.querySelector("[data-phsnap]")?.addEventListener("click", () => {
        (qs(), ccsSnapSoon(`${pl[0]?.name ?? "น้อง"} เที่ยวเล่น`, 0.25));
      }),
      document.querySelectorAll("[data-ph]").forEach((e) => e.addEventListener("click", () => ccsPhotoAlbum(+e.dataset.ph))));
  }
  // ===== v123: เอฟเฟกต์น้ำตามหลักฟิสิกส์ (ละอองวิถีโค้ง+แรงต้านอากาศ, ฟองคลื่นท้ายตัว, ฟองแผ่ออก) · ชนสิ่งกีดขวาง · ทะเลกว้างขึ้น =====
  var ccsFx = null,
    ccsSoftTexC = null;
  function ccsSoft() {
    return ccsSoftTexC ?? (ccsSoftTexC = ccsSoftTex());
  }
  function ccsFxInit() {
    if (ccsFx) return ccsFx;
    let i = 520,
      e = new Float32Array(i * 3).fill(-999),
      t = new Float32Array(i),
      n = new Float32Array(i),
      w = new Float32Array(i),
      s = new qe();
    (s.setAttribute("position", new Je(e, 3)), s.setAttribute("aSize", new Je(t, 1)), s.setAttribute("aAlpha", new Je(n, 1)), s.setAttribute("aSoft", new Je(w, 1)));
    let o = new Qt({
        transparent: !0,
        depthWrite: !1,
        uniforms: { map: { value: ccsSoft() }, uScale: { value: 500 } },
        vertexShader: "attribute float aSize; attribute float aAlpha; attribute float aSoft; varying float vA; varying float vS; uniform float uScale; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = max(1.5, aSize * uScale / max(0.1, -mv.z)); vA = aAlpha; vS = aSoft; gl_Position = projectionMatrix * mv; }",
        // หยดน้ำ = จุดกลมคม มีไฮไลต์ · ละอองฝอย = นุ่มฟุ้ง
        fragmentShader: "uniform sampler2D map; varying float vA; varying float vS; void main(){ vec2 q = gl_PointCoord - 0.5; float d = length(q); float hard = smoothstep(0.5, 0.36, d); float a = mix(hard, texture2D(map, gl_PointCoord).a, vS) * vA; if (a < 0.01) discard; vec3 c = mix(vec3(0.78, 0.9, 0.97), vec3(1.0), smoothstep(0.3, 0.0, length(q + vec2(0.15, 0.15))) * (1.0 - vS) + vS * 0.7); gl_FragColor = vec4(c, a); }",
      }),
      r = new bs(s, o);
    r.userData.soft = w;
    ((r.frustumCulled = !1), (r.renderOrder = 4), K.add(r));
    let pts = r;
    // ฟองบนผิวน้ำ: แผ่นแบนวางบนน้ำ (instanced) ผสมแบบบวกแสง จางด้วยสี
    let a = ss(128, 128, (h) => {
        h.clearRect(0, 0, 128, 128);
        for (let f = 0; f < 70; f++) {
          let d = 64 + (Math.random() - 0.5) * 92,
            u = 64 + (Math.random() - 0.5) * 92,
            p = 4 + Math.random() * 13,
            m = Math.max(0, 1 - Math.hypot(d - 64, u - 64) / 62),
            E = h.createRadialGradient(d, u, 0, d, u, p);
          (E.addColorStop(0, `rgba(255,255,255,${0.75 * m})`), E.addColorStop(1, "rgba(255,255,255,0)"), (h.fillStyle = E), h.fillRect(d - p, u - p, p * 2, p * 2));
        }
      }),
      c = new Te(1, 1);
    c.rotateX(-Math.PI / 2);
    let l = new di(c, new be({ map: a, transparent: !0, depthWrite: !1, blending: $i, color: 16777215 }), 300);
    ((l.frustumCulled = !1), (l.renderOrder = 3), K.add(l));
    let f = new Oe();
    f.makeScale(0, 0, 0);
    for (let h = 0; h < 300; h++) (l.setMatrixAt(h, f), l.setColorAt(h, new ae(0, 0, 0)));
    return (ccsFx = { pts, P: { pos: e, size: t, alpha: n, soft: w, geo: s, mat: o, v: new Float32Array(i * 3), life: new Float32Array(i), max: new Float32Array(i), drag: new Float32Array(i), s0: new Float32Array(i), n: i, k: 0 }, F: { m: l, d: [], k: 0, n: 300 } });
  }
  // ระดับเอฟเฟกต์ตามโหมดภาพ: ต่ำ/มือถือ = ละออง/ฟองน้อยลง
  function ccsFxLvl() {
    return si === "high" ? 1 : si === "low" ? 0.3 : pa ? 0.45 : 0.75;
  }
  function ccsDrop(x, y, z, vx, vy, vz, size, life, drag = 0.35) {
    if (Math.random() > ccsFxLvl()) return;
    let i = ccsFxInit().P,
      e = i.k++ % i.n;
    (i.pos.set([x, y, z], e * 3), i.v.set([vx, vy, vz], e * 3), (i.size[e] = size), (i.s0[e] = size), (i.alpha[e] = 0.9), (i.life[e] = life), (i.max[e] = life), (i.drag[e] = drag), (i.soft[e] = drag > 1 ? 1 : 0), (i.geo.attributes.aSoft.needsUpdate = !0));
  }
  function ccsFoam(x, z, sc, life, vx = 0, vz = 0, a = 0.85, grow = 1.6) {
    if (Math.random() > Math.max(0.4, ccsFxLvl())) return;
    let i = ccsFxInit().F,
      e = i.k++ % i.n;
    i.d[e] = { x, z, s: sc, g: grow, t: 0, life, vx, vz, a, r: Math.random() * 6.28 };
  }
  // สาดน้ำแบบ crown splash: ความเร็วละอองตามความเร็วตกกระทบ v = √(2gh)
  function ccsBigSplash(p, e = 1) {
    let i = Math.sqrt(2 * 9.81 * Math.max(0.2, 0.55 * e)),
      t = Math.round(40 + 110 * Math.min(2.2, e));
    for (let n = 0; n < t; n++) {
      let s = Math.random() * Math.PI * 2,
        o = (35 + Math.random() * 45) * (Math.PI / 180),
        r = i * (0.45 + Math.random() * 0.75),
        a = 0.35 * e * Math.random();
      ccsDrop(p.x + Math.cos(s) * a, Ph + 0.05, p.z + Math.sin(s) * a, Math.cos(s) * Math.cos(o) * r, Math.sin(o) * r, Math.sin(s) * Math.cos(o) * r, 0.05 + Math.random() * 0.13 * Math.min(1.6, 0.5 + e), 2.2);
    }
    // เสาน้ำกลาง (Worthington jet) เมื่อกระแทกแรง
    if (e > 0.7)
      for (let n = 0; n < 30 * e; n++) ccsDrop(p.x + (Math.random() - 0.5) * 0.6, Ph + 0.1, p.z + (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 1.2, i * (0.9 + Math.random() * 0.5), (Math.random() - 0.5) * 1.2, 0.08 + Math.random() * 0.14, 2.2);
    // ละอองฝอยลอยค้าง
    for (let n = 0; n < 3 + 4 * e; n++) {
      let s = Math.random() * Math.PI * 2;
      ccsDrop(p.x + Math.cos(s) * e * 0.8, Ph + 0.3 + Math.random() * e, p.z + Math.sin(s) * e * 0.8, Math.cos(s) * 1.2, 1 + Math.random() * 2 * e, Math.sin(s) * 1.2, 0.8 + Math.random() * 0.9 * Math.min(1.5, e), 2.2, 2.2);
    }
    // ฟองขาวแผ่ออกเป็นวง
    for (let n = 0; n < 5 + 6 * e; n++) {
      let s = Math.random() * Math.PI * 2,
        o = Math.random() * e * 1.6;
      ccsFoam(p.x + Math.cos(s) * o, p.z + Math.sin(s) * o, 1 + Math.random() * 1.6 * Math.min(1.6, e), 4 + Math.random() * 3, Math.cos(s) * 0.6 * e, Math.sin(s) * 0.6 * e, 0.38);
    }
  }
  function ccsSplashW(p, y, e) {
    (tl.burst(p, Ph, Math.min(1.6, e)), e >= 0.5 && ccsBigSplash(p, e * 0.7));
  }
  var ccsFxM = new Oe(),
    ccsFxQ = new At(),
    ccsFxC = new ae();
  function ccsFxTick(dt) {
    if (!ccsFx) return;
    let i = ccsFx.P,
      al = 0;
    for (let e = 0; e < i.n; e++) {
      if (i.life[e] <= 0) continue;
      al++;
      let t = e * 3;
      i.life[e] -= dt;
      let n = Math.max(0, 1 - i.drag[e] * dt);
      ((i.v[t] *= n), (i.v[t + 2] *= n), (i.v[t + 1] = i.v[t + 1] * n - 9.81 * dt * (i.drag[e] > 1 ? 0.15 : 1)), (i.pos[t] += i.v[t] * dt), (i.pos[t + 1] += i.v[t + 1] * dt), (i.pos[t + 2] += i.v[t + 2] * dt));
      let s = 1 - i.life[e] / i.max[e];
      ((i.size[e] = i.s0[e] * (1 + s * (i.drag[e] > 1 ? 1.2 : 0.4))), (i.alpha[e] = 0.9 * (1 - s) * (i.drag[e] > 1 ? 0.22 : 1)));
      // หยดกลับลงน้ำ: ดับ และทิ้งฟองเล็ก ๆ
      (i.pos[t + 1] < Ph && i.v[t + 1] < 0 || i.life[e] <= 0) && (i.drag[e] < 1 && i.life[e] > 0 && Math.random() < 0.25 && ccsFoam(i.pos[t], i.pos[t + 2], 0.35 + Math.random() * 0.4, 1.6), (i.life[e] = 0), (i.alpha[e] = 0), (i.pos[t + 1] = -999));
    }
    (al || i.was) && ((i.geo.attributes.position.needsUpdate = !0), (i.geo.attributes.aSize.needsUpdate = !0), (i.geo.attributes.aAlpha.needsUpdate = !0), (i.mat.uniforms.uScale.value = innerHeight * 0.9));
    i.was = al > 0;
    let e = ccsFx.F,
      fa = 0;
    for (let t = 0; t < e.n; t++) {
      let n = e.d[t];
      if (!n) continue;
      fa++;
      ((n.t += dt), (n.x += n.vx * dt), (n.z += n.vz * dt), (n.vx *= Math.pow(0.75, dt)), (n.vz *= Math.pow(0.75, dt)));
      let s = n.t / n.life;
      if (s >= 1) {
        (ccsFxM.makeScale(0, 0, 0), e.m.setMatrixAt(t, ccsFxM), (e.d[t] = null));
        continue;
      }
      let o = n.s * (1 + s * n.g),
        r = n.a * Math.min(1, n.t * 6) * (1 - s) * (1 - s);
      (ccsFxQ.setFromAxisAngle(ccsFxV.set(0, 1, 0), n.r + n.t * 0.1), ccsFxM.compose(ccsFxV2.set(n.x, Ph + 0.02, n.z), ccsFxQ, ccsFxV3.set(o, 1, o)), e.m.setMatrixAt(t, ccsFxM), e.m.setColorAt(t, ccsFxC.setScalar(r)));
    }
    ((fa || e.was) && ((e.m.instanceMatrix.needsUpdate = !0), e.m.instanceColor && (e.m.instanceColor.needsUpdate = !0)), (e.was = fa > 0), (e.m.visible = fa > 0), (ccsFx.pts.visible = al > 0));
  }
  var ccsFxV = new H(),
    ccsFxV2 = new H(),
    ccsFxV3 = new H();
  // คลื่นฟองท้ายตัว (Kelvin wake ~19.5°) + ฝอยน้ำที่ครีบหลังตอนว่ายเร็วเลียดผิวน้ำ
  function ccsWake(o, dt) {
    let i = o.y + o.size * 0.13;
    if (!o.vis || i < Ph - 0.25 || o.spd < 0.4 || si === "low") return;
    o.wk = (o.wk ?? 0) + o.spd * dt;
    let e = Math.sin(o.yaw),
      t = Math.cos(o.yaw),
      n = o.size * 0.36,
      s = o.pos.x + e * n,
      r = o.pos.z + t * n;
    if (o.wk > 0.55) {
      o.wk = 0;
      let a = Math.min(1, (i - (Ph - 0.25)) / 0.4);
      for (let c of [-1, 1]) {
        let l = 0.34 * o.spd;
        ccsFoam(s + t * c * o.size * 0.09, r - e * c * o.size * 0.09, 0.35 * o.size * 0.2 + 0.2, 3.6, (t * c - e * 0.15) * l, (-e * c - t * 0.15) * l, 0.32 * a, 2.6);
      }
      ccsFoam(o.pos.x - e * o.size * 0.42, o.pos.z - t * o.size * 0.42, o.size * 0.16, 2.6, 0, 0, 0.28 * a, 1.6);
    }
    // ฝอยหน้าหัว/ครีบเมื่อเร็ว
    if (o.spd > 2.2 && Math.random() < dt * 14) {
      let a = Math.random() < 0.5 ? -1 : 1;
      ccsDrop(s, Ph + 0.15, r, t * a * 1.2 + e * o.spd * 0.4, 1.2 + Math.random() * 1.5, -e * a * 1.2 + t * o.spd * 0.4, 0.05 + Math.random() * 0.06, 1.4);
    }
  }
  // ---- สิ่งกีดขวาง: สะพานไม้ เกาะประภาคาร เกาะภูเขา ----
  var ccsObs = null;
  function ccsObsList() {
    return (ccsObs ??= [
      { b: 1, x0: -2.1, x1: 2.1, z0: Rt - 3, z1: Rt + 23.6 },
      { x: 41, z: Rt + 94, r: 11 },
      { x: -60, z: Rt + 305, r: 78 },
    ]);
  }
  function ccsObsPush(x, z, r) {
    for (let i of ccsObsList()) {
      if (i.b) {
        if (x > i.x0 - r && x < i.x1 + r && z > i.z0 - r && z < i.z1 + r) {
          let e = [
            [i.x0 - r - x, 0],
            [i.x1 + r - x, 0],
            [0, i.z1 + r - z],
          ].sort((t, n) => Math.hypot(...t) - Math.hypot(...n))[0];
          return e;
        }
      } else {
        let e = x - i.x,
          t = z - i.z,
          n = Math.hypot(e, t);
        if (n < i.r + r) return [(e / (n || 1)) * (i.r + r - n), (t / (n || 1)) * (i.r + r - n)];
      }
    }
    return null;
  }
  function ccsWhCollide(w) {
    let i = Math.sin(w.yaw),
      e = Math.cos(w.yaw);
    for (let [t, n] of [
      [0.42, 0.12],
      [0, 0.17],
      [-0.42, 0.1],
    ]) {
      let s = w.size * t * Math.cos(w.pitch ?? 0),
        o = w.y + w.size * t * Math.sin(w.pitch ?? 0);
      if (o > 0.7) continue;
      let r = ccsObsPush(w.pos.x + i * s, w.pos.z + e * s, w.size * n);
      r && ((w.pos.x += r[0]), (w.pos.z += r[1]));
    }
  }
  // ความลึกขั้นต่ำที่ตัวนี้ว่ายเข้าไปได้ (น้ำตื้นได้ แต่ไม่เกยตื้น)
  function ccsZMin(w) {
    let i = w.k === "sperm" ? 2.6 : 0.24 * w.size,
      e = (-0.085 + Math.sqrt(0.085 * 0.085 + 0.016 * i)) / 0.008;
    return Rt - 1.35 + e;
  }
  // ===== v121: ปลาวาฬในทะเล (วาฬสเปิร์ม · วาฬนำร่องฝูง 3 · ออร์กาฝูง 4) + ให้อาหารที่ท่าเรือ + เล่นกับออร์กา =====
  var ccsWhM = {},
    ccsWh = null,
    ccsWhT = 0,
    ccsWhUni = { value: 0 },
    ccsSpouts = [];
  async function ccsWhaleLoad(o, p, s) {
    for (let [k, u] of [["orca", o], ["pilot", p], ["sperm", s]])
      try {
        let t = await Po(u);
        ccsWhM[k] = { scene: t.scene, clip: t.animations[0] ?? null };
      } catch (t) {
        console.warn("whale", k, t);
      }
  }
  var ccsWhInfo = {
    orca: { n: "ออร์กา", bait: "salmon", y: [-0.32, -1.5], spd: 2.6 },
    pilot: { n: "วาฬนำร่อง", bait: "squid", y: [-0.38, -1.4], spd: 1.7 },
    sperm: { n: "วาฬสเปิร์ม", bait: "giant", y: [-0.75, -2.6], spd: 1.1 },
  };
  var ccsBaitDef = {
    salmon: { icon: "🎣", n: "แซลมอนทั้งตัว", who: "orca", col: 16742991 },
    squid: { icon: "🦑", n: "ปลาหมึกสด", who: "pilot", col: 16103368 },
    giant: { icon: "🐙", n: "หมึกยักษ์", who: "sperm", col: 13649478 },
  };
  function ccsWhMake(k, size) {
    let m = ccsWhM[k];
    if (!m) return null;
    let a = _3(m, null, size, k === "orca" ? 1 : 0.8);
    if (k === "orca") {
      // อ้าปากได้: หมุนขากรรไกรล่างรอบบานพับใต้ตา (ทำใน vertex shader ก่อน skinning)
      a.jaw = { value: 0 };
      a.root.traverse((t) => {
        if (!t.isMesh) return;
        let n = t.material.clone();
        ((n.onBeforeCompile = (c) => {
          ((c.uniforms.uJaw = a.jaw),
            (c.vertexShader = `uniform float uJaw;
varying float vJw;
varying float vJz;
` + c.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n float jw = step(transformed.y, -1.05);\n vJw = jw; vJz = transformed.z;\n float ja = uJaw * jw * smoothstep(3.3, 3.85, transformed.z);\n if (ja > 0.0) { vec2 r = vec2(transformed.y + 1.05, transformed.z - 3.3); float cs = cos(ja), sn = sin(ja); transformed.y = -1.05 + r.x * cs - r.y * sn; transformed.z = 3.3 + r.x * sn + r.y * cs; }")),
            // หน้าที่ถูกยืดระหว่างขากรรไกรบน-ล่าง = ด้านในปาก: ทาสีแดงเข้ม + ฟันขาวตามขอบ
            (c.fragmentShader = `uniform float uJaw;
varying float vJw;
varying float vJz;
` + c.fragmentShader.replace("#include <opaque_fragment>", "#include <opaque_fragment>\n if (uJaw > 0.03 && vJw > 0.06 && vJw < 0.94 && vJz > 3.5) { float ed = min(vJw, 1.0 - vJw); vec3 mc = mix(vec3(0.32, 0.04, 0.06), vec3(0.75, 0.25, 0.3), smoothstep(0.2, 0.5, ed)); if (ed < 0.2 && fract(vJz * 16.0) < 0.55 && vJz > 3.7) mc = vec3(0.95, 0.93, 0.88); gl_FragColor.rgb = mc * (0.55 + 0.45 * clamp(dot(normal, vec3(0.0, 0.0, 1.0)) * 0.5 + 0.5, 0.0, 1.0)); }")));
        }),
          (n.customProgramCacheKey = () => "orcajaw"),
          (t.material = n));
      });
    }
    if (k === "sperm")
      a.root.traverse((t) => {
        if (!t.isMesh) return;
        let n = t.material.clone();
        ((n.onBeforeCompile = (c) => {
          ((c.uniforms.uWT = ccsWhUni),
            (c.vertexShader = `uniform float uWT;
` + c.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n float tw = clamp(-transformed.z / 9.7, 0.0, 1.0);\n transformed.y += 0.55 * sin(uWT * 1.25 + transformed.z * 0.26) * tw * tw;")));
        }),
          (n.customProgramCacheKey = () => "spermbend"),
          (t.material = n));
      });
    return (K.add(a.root), a);
  }
  function ccsWhRand(w) {
    // สุ่มจุดหมาย: บางครั้งเข้าน้ำตื้นใกล้ฝั่ง บางครั้งออกทะเลลึกไกล ๆ
    let i = w.k === "sperm" ? Rt + 26 : Rt + 13;
    for (let e = 0; e < 12; e++) {
      let t = Math.random(),
        n = t < (w.k === "sperm" ? 0.15 : 0.35) ? i + Math.random() * 22 : Rt + 40 + Math.random() * 230,
        s = -200 + Math.random() * 400;
      if (!ccsObsPush(s, n, 14)) return void w.tgt.set(s, 0, n);
    }
    w.tgt.set(0, 0, Rt + 60);
  }
  // v125: โหลดโมเดลปลาวาฬเฉพาะตอนน้องเดินเข้าใกล้ทะเล (เปิดเกมเร็วขึ้น ไม่โหลดของที่ยังไม่เห็น)
  var ccsWhLoading = !1,
    ccsWhDone = !1;
  function ccsWhaleInit() {
    if (!ccsWhLoading) {
      let i = Le[0]?.pos;
      if (!i || Se || i.z < Rt - 45) return;
      ((ccsWhLoading = !0),
        ccsWhaleLoad(Zt("orca"), Zt("pilotwhale"), Zt("spermwhale")).then(() => {
          ccsWhDone = !0;
          (ccsWhaleInit(), ccsFxInit());
          // คอมไพล์ shader ของวาฬ/ละอองน้ำล่วงหน้าแบบขนาน (ไม่ให้กระตุกตอนเห็นครั้งแรก)
          try {
            dn.compileAsync(K, Lt).catch(() => {});
          } catch (e) {}
        }));
      return;
    }
    // v130: รอโหลดครบทั้ง 3 ชนิดก่อนสร้างฝูง (เดิมสร้างทันทีที่ออร์กาโหลดเสร็จ → ฝูงวาฬนำร่อง/สเปิร์มว่างเปล่า โยนเหยื่อแล้วไม่มีใครมา)
    if (ccsWh || !ccsWhDone || !ccsWhM.orca) return;
    let i = [],
      e = (k, size, pod, off) => {
        let a = ccsWhMake(k, size);
        if (!a) return null;
        let w = { k, a, size, pod, off, pos: new H(), yaw: Math.random() * 6.28, y: ccsWhInfo[k].y[1], vy: 0, pitch: 0, roll: 0, spd: ccsWhInfo[k].spd, br: Math.random() * 8, act: null, tgt: new H(), vis: 1 };
        return (i.push(w), w);
      },
      t = { k: "orca", mode: "roam", tgt: new H(), hunt: 30 + Math.random() * 30, m: [] },
      n = { k: "pilot", mode: "roam", tgt: new H(), m: [] },
      s = { k: "sperm", mode: "roam", tgt: new H(), m: [], dive: 0 };
    // ออร์กา: ตัวผู้ครีบสูงตัวใหญ่ · ตัวเมีย · ลูก 2 ตัว (ว่ายแนบแม่)
    for (let [o, r] of [
      [5.6, [0, 0]],
      [4.6, [-3.2, -3.5]],
      [2.8, [-1.6, -5.2]],
      [3, [2.8, -4.6]],
    ]) {
      let a = e("orca", o, t, new H(r[0], 0, r[1]));
      a && t.m.push(a);
    }
    for (let [o, r] of [
      [4.2, [0, 0]],
      [3.8, [2.6, -3]],
      [3.1, [-2.4, -3.8]],
    ]) {
      let a = e("pilot", o, n, new H(r[0], 0, r[1]));
      a && n.m.push(a);
    }
    let o = e("sperm", 12, s, new H());
    o && s.m.push(o);
    let r = (a, c, l) => {
      (a.tgt.set(c, 0, l), a.m.forEach((h, f) => (h.pos.set(c + h.off.x, h.y, l + h.off.z - f * 0.5), ccsWhRand(h))));
    };
    (r(t, 40, Rt + 50), r(n, -60, Rt + 62), r(s, 5, Rt + 74), (ccsWh = { all: i, pods: [t, n, s] }));
  }
  function ccsSpout(i, e = 1) {
    let t = ccsSoft();
    for (let n = 0; n < 7; n++) {
      let s = new zi(new vi({ map: t, transparent: !0, depthWrite: !1, opacity: 0.75, color: 15661823 }));
      (s.position.copy(i), s.scale.setScalar(0.3 * e), K.add(s), ccsSpouts.push({ s, t: 0, d: 1.5 + Math.random() * 0.5, v: (2.6 + n * 0.45) * e, dx: (Math.random() - 0.5) * 0.4 * e, dz: (Math.random() - 0.5) * 0.4 * e, e }));
    }
  }
  function ccsWhAct(w, k, dur) {
    w.act = { k, t: 0, dur, y0: w.y, sp: 0 };
  }
  function ccsWhPos(w, back) {
    // ตำแหน่งหาง/หัว (สำหรับละอองน้ำ)
    let t = w.size * 0.5 * back;
    return new H(w.pos.x + Math.sin(w.yaw) * t, Ph, w.pos.z + Math.cos(w.yaw) * t);
  }
  // หาทางอ้อม: ถ้าเส้นตรงไปเป้าผ่านสะพาน/เกาะ ให้ไปจุดอ้อมก่อน (ปลายสะพานฝั่งทะเล / ข้างเกาะ)
  function ccsWhRoute(w, tx, tz) {
    let i = w.size * 0.25;
    for (let e of ccsObsList()) {
      let t = !1;
      for (let n = 1; n <= 16 && !t; n++) {
        let s = n / 16,
          o = w.pos.x + (tx - w.pos.x) * s,
          r = w.pos.z + (tz - w.pos.z) * s;
        e.b ? (t = o > e.x0 - i && o < e.x1 + i && r > e.z0 - i && r < e.z1 + i) : (t = Math.hypot(o - e.x, r - e.z) < e.r + i);
      }
      if (!t) continue;
      if (e.b) return [w.pos.x < 0 ? e.x0 - i - 3 : e.x1 + i + 3, e.z1 + i + w.size * 0.6 + 3];
      let n = w.pos.x - e.x,
        s = w.pos.z - e.z,
        o = Math.hypot(n, s) || 1,
        r = tx - e.x,
        a = tz - e.z,
        c = Math.sign(n * a - s * r) || 1,
        l = e.r + i + 8;
      return [e.x + (n / o) * l * 0.4 + (-s / o) * c * l, e.z + (s / o) * l * 0.4 + (n / o) * c * l];
    }
    return null;
  }
  function ccsWhStep(w, dt, tx, tz, spd) {
    let rw = ccsWhRoute(w, tx, tz);
    rw && ((tx = rw[0]), (tz = rw[1]));
    let e = tx - w.pos.x,
      t = tz - w.pos.z,
      n = Math.hypot(e, t);
    if (n > 0.3) {
      let s = Math.atan2(e, t),
        o = Math.atan2(Math.sin(s - w.yaw), Math.cos(s - w.yaw)),
        r = (w.k === "sperm" ? 0.25 : 0.7) * dt,
        L = w.size * 0.5 + 3 + w.spd * 1.2,
        q = ccsObsPush(w.pos.x + Math.sin(w.yaw) * L, w.pos.z + Math.cos(w.yaw) * L, w.size * 0.25);
      // มองล่วงหน้า: ถ้าทางข้างหน้าชนสะพาน/เกาะ ให้เลี้ยวหลบไปทางที่ถูกดันออก
      if (q) {
        let a = Math.atan2(q[0], q[1]),
          c = Math.atan2(Math.sin(a - w.yaw), Math.cos(a - w.yaw));
        o = c > 0 ? 1.4 : -1.4;
        n > L * 1.5 || (o *= 0.6);
      }
      ((w.yaw += Math.max(-r, Math.min(r, o))), (w.roll += (-o * 0.6 - w.roll) * Math.min(1, dt * 2)));
    }
    ((w.spd += (spd - w.spd) * Math.min(1, dt * 0.8)), (w.pos.x += Math.sin(w.yaw) * w.spd * dt), (w.pos.z += Math.cos(w.yaw) * w.spd * dt), (w.pos.z = Math.max(ccsZMin(w), Math.min(Rt + 280, w.pos.z))), (w.pos.x = Math.max(-230, Math.min(230, w.pos.x))), ccsWhCollide(w));
    return n;
  }
  function ccsWhFeedPt() {
    return new H(0, 0, Rt + 28.5);
  }
  function ccsWhaleTick(dt) {
    if ((ccsWhaleInit(), !ccsWh || window.__whPause)) return;
    let i = !Se;
    for (let w of ccsWh.all) w.a.root.visible = i && w.vis > 0;
    for (let e = ccsSpouts.length - 1; e >= 0; e--) {
      let t = ccsSpouts[e];
      ((t.t += dt), t.s.position.set(t.s.position.x + t.dx * dt, t.s.position.y + t.v * dt, t.s.position.z + t.dz * dt), (t.v *= Math.pow(0.35, dt)), t.s.scale.setScalar((0.3 + t.t * 1.3) * t.e), (t.s.material.opacity = 0.75 * Math.max(0, 1 - t.t / t.d)), t.t > t.d && (K.remove(t.s), t.s.material.dispose(), ccsSpouts.splice(e, 1)));
    }
    if (!i) return;
    ((ccsWhT += dt), (ccsWhUni.value = ccsWhT));
    let e = Le[0]?.pos;
    for (let t of ccsWh.pods) {
      let n = t.m[0];
      if (!n) continue;
      let s = ccsWhInfo[t.k];
      // ---- พฤติกรรมฝูง ----
      if (t.mode === "come") {
        let o = ccsWhStep(n, dt, t.tgt.x, t.tgt.z, s.spd * 2.4);
        o < 2.5 && !n.act && (ccsWhAct(n, "eat", 1.8), (t.mode = t.k === "orca" ? "beg" : "linger"), (t.lt = t.k === "orca" ? 30 : 22), (t.ang = Math.atan2(n.pos.x - t.tgt.x, n.pos.z - t.tgt.z)));
      } else if (t.mode === "beg") {
        // ออร์กาว่ายมาชิดปลายท่าเรือ ยกหัวพ้นน้ำ อ้าปากรอรับปลาจากน้อง
        t.lt -= dt;
        let o = ccsBegPt(n),
          r = Math.hypot(o.x - n.pos.x, o.z - n.pos.z);
        if (n.act) n.beg = Math.max(0, (n.beg ?? 0) - dt * 2);
        else if (r > 1.3 && !(n.beg > 0.5)) (ccsWhStep(n, dt, o.x, o.z, s.spd * 1.1), (n.beg = 0));
        else {
          ((n.pos.x += (o.x - n.pos.x) * Math.min(1, dt * 2)), (n.pos.z += (o.z - n.pos.z) * Math.min(1, dt * 2)));
          let a = Math.atan2(Math.sin(Math.PI - n.yaw), Math.cos(Math.PI - n.yaw));
          ((n.yaw += a * Math.min(1, dt * 2.5)), (n.spd *= Math.pow(0.2, dt)), (n.beg = Math.min(1, (n.beg ?? 0) + dt * 0.7)));
        }
        t.lt < 0 && ((t.mode = "linger"), (t.lt = 14), (n.beg = 0), (n.jawT = 0), (t.ang = 0));
      } else if (t.mode === "linger") {
        ((t.lt -= dt), (t.ang += dt * (t.k === "sperm" ? 0.08 : 0.22)));
        let o = t.k === "sperm" ? 9 : 5.5,
          r = ccsWhFeedPt();
        (ccsWhStep(n, dt, r.x + Math.sin(t.ang) * o, r.z + 2 + Math.cos(t.ang) * o * 0.6, s.spd * 0.8), t.lt < 0 && ((t.mode = "roam"), ccsWhRand(t)));
      } else if (t.mode === "hunt") {
        // ออร์กาล่าเหยื่อ: พุ่งไปหาฝูงปลา แล้วว่ายวนล้อม ต้อนปลาให้กระโดด
        if (((t.ht += dt), t.ht < 0)) (ccsWhStep(n, dt, t.c.x, t.c.z, s.spd * 2.2) < 6 && (t.ht = 0), t.m.forEach((o) => !o.act && Math.random() < dt * 0.35 && ccsWhAct(o, "porp", 1.1)));
        else {
          let o = t.ht * 0.9;
          (ccsWhStep(n, dt, t.c.x + Math.sin(o) * 5, t.c.z + Math.cos(o) * 5, s.spd * 1.9),
            (t.fj -= dt) < 0 && ((t.fj = 0.25 + Math.random() * 0.4), ccsSplashW(new H(t.c.x + (Math.random() - 0.5) * 5, 0, t.c.z + (Math.random() - 0.5) * 5), Ph, 0.35 + Math.random() * 0.3)),
            t.ht > 6 && !t.br && ((t.br = 1), ccsWhAct(t.m[1] ?? n, "breach", 2.2)),
            t.ht > 4 && t.ht < 4.1 && ccsWhAct(n, "slap", 1.6),
            t.ht > 11 && ((t.mode = "roam"), (t.hunt = 50 + Math.random() * 50), ccsWhRand(t)));
        }
      } else {
        (ccsWhStep(n, dt, t.tgt.x, t.tgt.z, s.spd) < 6 && ccsWhRand(t), t.k === "orca" && (t.hunt -= dt) < 0 && ((t.mode = "hunt"), (t.ht = -30), (t.fj = 0), (t.br = 0), (t.c = n.pos.clone().add(new H(Math.sin(n.yaw) * 16, 0, Math.cos(n.yaw) * 16))), (t.c.z = Math.max(Rt + 26, Math.min(Rt + 260, t.c.z)))));
      }
      // ลูกฝูงตามจ่าฝูงเป็นรูปขบวน (ตอนล่าว่ายวนรอบเป้าคนละมุม)
      for (let o = 1; o < t.m.length; o++) {
        let r = t.m[o],
          a,
          c;
        if (t.mode === "hunt" && t.ht >= 0) {
          let l = t.ht * 0.9 + (o * Math.PI * 2) / t.m.length;
          ((a = t.c.x + Math.sin(l) * (5 + o)), (c = t.c.z + Math.cos(l) * (5 + o)));
        } else if (t.mode === "beg") {
          // ลูกฝูงว่ายวนรอบ ๆ ด้านหลังจ่าฝูง
          let l = ccsWhT * 0.25 + (o * Math.PI * 2) / t.m.length;
          ((a = Math.sin(l) * 6.5), (c = Rt + 32 + Math.cos(l) * 3.5));
        } else {
          let l = Math.cos(n.yaw),
            h = Math.sin(n.yaw);
          ((a = n.pos.x + r.off.x * l + r.off.z * h), (c = n.pos.z - r.off.x * h + r.off.z * l));
        }
        let l = Math.hypot(a - r.pos.x, c - r.pos.z);
        ccsWhStep(r, dt, a, c, Math.min(s.spd * 2.6, Math.max(n.spd * 0.6, n.spd + (l - 1) * 0.6)));
      }
      // ---- ท่าทางขึ้นลงน้ำ หายใจ / ท่าพิเศษ ----
      for (let o of t.m) {
        let r = o.y;
        o.br += dt;
        let a = t.k === "sperm" ? 26 : 7,
          c = t.k === "sperm" ? 14 : 2.4;
        if (t.k === "sperm" && t.mode === "roam") {
          // วาฬสเปิร์ม: ลอยหายใจนาน ๆ แล้วยกหางดำลึก หายไปนานก่อนโผล่ที่ใหม่
          let l = o.br % 70;
          (l < 26 ? ((o.ty = s.y[0]), (o.vis = 1)) : l < 31 ? (o.ty = -3.4) : ((o.ty = -3.4), (o.vis = 0), l > 68 && (ccsWhRand(t), o.pos.copy(t.tgt).add(new H(8, 0, 8)))), l < 26 && o.br % 6 < dt && ccsSpout(ccsWhPos(o, 0.42).setY(Ph + 0.6), 2.2));
        } else ((o.vis = 1), (o.ty = o.br % a < c || t.mode === "linger" ? s.y[0] : s.y[1]), o.br % a < dt && t.mode !== "hunt" && ccsSpout(ccsWhPos(o, 0.3).setY(Ph + 0.3), o.size / 4.5));
        let l = 0,
          h = 0,
          f = 0;
        if (o.act) {
          let d = o.act;
          d.t += dt;
          let u = d.t / d.dur;
          if (d.k === "breach") {
            // breach แบบธรรมชาติ: พุ่งขึ้นเกือบตั้งฉาก ลำตัวพ้นน้ำ 2/3 บิดตัวตะแคง แล้วล้มหงายตูมลงน้ำ
            let p = 0.35 + o.size * 0.24,
              c = s.y[1] - 0.4;
            ((o.y = u < 0.5 ? c + (p - c) * Math.sin((u / 0.5) * Math.PI * 0.5) : p - (p - c) * Math.pow((u - 0.5) / 0.5, 2)),
              (l = u < 0.45 ? 1.3 - u * 0.5 : 1.08 - ((u - 0.45) / 0.55) * 1.75),
              (h = Math.min(1, Math.max(0, (u - 0.25) / 0.45)) * 1.8),
              d.sp === 0 && u > 0.12 && ((d.sp = 1), ccsSplashW(o.pos.clone(), Ph, 1.3), ke("splash"), e && o.pos.distanceTo(e) < 45 && ccsOnScreen(o.pos) && ccsSnapSoon(`🐋 ${s.n}กระโดดโชว์!`, 0.35, "breach")),
              d.sp === 1 && u > 0.78 && ((d.sp = 2), ccsSplashW(o.pos.clone(), Ph, o.size / 2), ccsSplashW(ccsWhPos(o, 0.3), Ph, o.size / 2.6), ke("splash")),
              (f = 0.7));
          } else if (d.k === "porp") {
            // ว่ายเร็วกระโดดโค้งต่ำ ๆ (porpoising)
            let p = Math.sin(u * Math.PI);
            ((o.y = s.y[0] + p * (0.6 + o.size * 0.05)), (l = (1 - 2 * u) * 0.55), d.sp === 0 && u > 0.2 && ((d.sp = 1), ccsSplashW(ccsWhPos(o, 0.3), Ph, 0.6)), d.sp === 1 && u > 0.8 && ((d.sp = 2), ccsSplashW(o.pos.clone(), Ph, 0.8)));
          } else if (d.k === "spy") {
            // ยืดตัวตั้งโผล่หัวมองน้อง
            let p = Math.sin(Math.min(1, u * 1.4) * Math.PI * 0.5) * (u > 0.8 ? (1 - u) / 0.2 : 1),
              c = 1.1 - o.size * 0.47 * Math.sin(1.4);
            ((l = 1.4 * p), (o.y = s.y[0] + (c - s.y[0]) * p), (f = 1), (o.jawT = 0));
          } else if (d.k === "slap") {
            // ตบหางเสียงดังตูม
            let p = Math.sin(u * Math.PI);
            ((l = -0.75 * p), (o.y = s.y[0] + 0.1), u > 0.55 && d.sp === 0 && ((d.sp = 1), ccsSplashW(ccsWhPos(o, -0.48), Ph, 1.3), ke("splash"), d.wet && e && e.z > Rt + 18 && (ccsSplashW(new H(e.x, 0, e.z + 1), Ph, 1.6), rt("💦 เปียกปอน! ออร์กาแกล้ง 😆", e.clone().setY(1.5), "big"))));
          } else if (d.k === "eat") {
            // โผล่งับปลา
            let p = Math.sin(u * Math.PI);
            ((l = 0.7 * p), (o.y = s.y[0] + p * 0.5), (o.jawT = u < 0.45 ? 0.55 : 0), d.sp === 0 && u > 0.35 && ((d.sp = 1), ccsSplashW(o.pos.clone(), Ph, 1), ke("splash"), ccsSparkle(o.pos.clone().setY(1.2), 6), rt("❤️ งั่ม!", o.pos.clone().setY(1.6), "big")), (f = 0.6));
          }
          u >= 1 && (o.act = null);
        } else if (o.beg > 0) {
          // ท่าขอปลา: ยกหัวพ้นน้ำ อ้าปาก ส่ายหัวเบา ๆ
          let p = o.beg,
            c = 1.15 - o.size * 0.47 * Math.sin(0.95) + Math.sin(ccsWhT * 1.7) * 0.06;
          ((o.y += (s.y[0] + (c - s.y[0]) * p - o.y) * Math.min(1, dt * 3)), (l = 0.95 * p), (h = Math.sin(ccsWhT * 1.3) * 0.08), (f = 0.85), (o.jawT = (o.chomp ?? 0) > 0 ? 0 : p > 0.75 ? 0.5 + Math.sin(ccsWhT * 2.6) * 0.07 : 0));
        } else o.y += (o.ty - o.y) * Math.min(1, dt * (o.ty > o.y ? 0.9 : 0.6));
        o.chomp > 0 && (o.chomp -= dt);
        // ไม่จมลงต่ำกว่าพื้นทะเล (น้ำตื้นจะว่ายเลียดผิวน้ำเห็นครีบหลัง)
        o.y = Math.max(o.y, Lc(o.pos.z) + o.size * 0.15);
        ccsWake(o, dt);
        let d = (o.y - r) / Math.max(1e-4, dt);
        (o.act || o.beg > 0 || (l = Math.max(-0.5, Math.min(0.5, Math.atan2(d, Math.max(0.5, o.spd)) * 0.8)) + Math.sin(ccsWhT * 1.3 + o.size) * 0.04), (o.pitch += (l - o.pitch) * Math.min(1, dt * 4)), (o.roll *= Math.pow(0.5, dt)));
        let u = o.a.root;
        (u.position.set(o.pos.x, o.y, o.pos.z), u.rotation.set(0, o.yaw, 0), u.rotateX(-o.pitch), u.rotateZ(o.roll + h), o.a.mixer?.update(dt * (0.5 + Math.min(1.5, o.spd / s.spd) * 0.6) * (1 - f * 0.7)));
        o.a.jaw && ((o.jaw = (o.jaw ?? 0) + ((o.jawT ?? 0) - (o.jaw ?? 0)) * Math.min(1, dt * (o.jawT > (o.jaw ?? 0) ? 6 : 14))), (o.a.jaw.value = o.jaw));
      }
    }
  }
  // โยนเหยื่อจากปลายท่าเรือ
  var ccsBaitFly = null;
  function ccsPierEnd(i) {
    return i && !Se && !ho && i.z > Rt + 18.5 && Math.abs(i.x) < 2.1;
  }
  function ccsBegPt(n) {
    let i = Le[0]?.pos;
    return new H(Math.max(-0.9, Math.min(0.9, i ? i.x : 0)), 0, Rt + 24.4 + n.size * 0.47 * Math.cos(0.95));
  }
  function ccsWhHead(o) {
    return (o.a.root.updateMatrixWorld(!0), o.a.root.localToWorld(new H(0, -0.05 * o.size, 0.44 * o.size)));
  }
  function ccsOrcaBeg() {
    let i = ccsWh?.pods.find((e) => e.k === "orca");
    return i && i.mode === "beg" && i.m[0].beg > 0.75 && !i.m[0].act ? i : null;
  }
  // เหยื่อแบบเหมือนจริง: แซลมอนใช้โมเดลปลาจริง · หมึก/หมึกยักษ์ปั้นตัว+หนวด
  function ccsBaitMesh(k) {
    if (k === "salmon") {
      // แซลมอนทั้งตัว: ท้องเงิน หลังเทาอมเขียว ข้างลำตัวชมพู ครีบหาง/หลัง
      let i = new J(),
        e = new R(new we(0.1, 16, 12), Ae(13942950, 0.35, { metalness: 0.3 }));
      (e.scale.set(0.9, 1.15, 4.2), i.add(e));
      let t = new R(new we(0.1, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.42), Ae(4610660, 0.4, { metalness: 0.25 }));
      ((t.scale.set(0.93, 1.18, 4.25), (t.position.y = 0.004)), i.add(t));
      let n = new R(new ee(0.012, 0.05, 0.62), Ae(15238784, 0.5));
      ((n.position.set(0, -0.01, 0), (n.scale.x = 8.5)), i.add(n));
      let s = new qe();
      (s.setAttribute("position", new Fe([0, 0, -0.36, 0, 0.13, -0.56, 0, -0.13, -0.56], 3)), s.computeVertexNormals());
      let o = new R(s, Ae(4610660, 0.5, { side: Ke }));
      i.add(o);
      let r = new qe();
      (r.setAttribute("position", new Fe([0, 0.1, 0.05, 0, 0.19, -0.03, 0, 0.1, -0.12], 3)), r.computeVertexNormals());
      i.add(new R(r, Ae(4610660, 0.5, { side: Ke })));
      for (let a of [-1, 1]) {
        let c = new R(new we(0.014, 8, 6), Ae(1118481, 0.2));
        (c.position.set(a * 0.07, 0.03, 0.33), i.add(c));
      }
      return i;
    }
    let i = new J(),
      e = k === "giant" ? 1.9 : 1,
      t = Ae(k === "giant" ? 12729402 : 15762611, 0.45),
      n = new R(new we(0.09, 14, 10), t);
    (n.scale.set(1, 1, 2.6), (n.position.z = 0.17), i.add(n));
    let s = new R(new yt(0.11, 0.14, 4), t);
    ((s.rotation.x = Math.PI / 2), (s.position.z = 0.42), (s.scale.y = 0.25), i.add(s));
    for (let o of [-1, 1]) {
      let r = new R(new we(0.022, 8, 6), Ae(1118481, 0.2));
      (r.position.set(o * 0.075, 0.03, -0.03), i.add(r));
    }
    for (let o = 0; o < 10; o++) {
      let r = o / 10 * Math.PI * 2,
        a = o >= 8 ? 0.42 : 0.24,
        c = new R(new re(0.016, 0.006, a, 5), t);
      ((c.rotation.x = Math.PI / 2 + Math.sin(r) * 0.25), (c.rotation.y = Math.cos(r) * 0.25), c.position.set(Math.cos(r) * 0.04, Math.sin(r) * 0.04, -0.08 - a / 2), i.add(c));
    }
    return (i.scale.setScalar(e), i);
  }
  function ccsWhaleThrow(k) {
    let i = Le[0],
      e = ccsBaitDef[k];
    if (!i || !e || !ccsWh) return;
    let t = (z.bait ??= {});
    if (!(t[k] > 0)) return void De(`ไม่มี${e.n} ซื้อได้ที่แผงปลาลุงทะเลริมหาด 🐟`, 2400);
    if (ccsBaitFly) return void De("รอเหยื่อลงน้ำก่อนนะ 🐟", 1200); // v129: กันโยนซ้อน (เหยื่อชิ้นแรกค้างกลางอากาศ)
    ((t[k] -= 1), qs());
    let n = ccsBaitMesh(k);
    K.add(n);
    let o = ccsWhFeedPt(),
      r = k === "salmon" && ccsOrcaBeg();
    ((o.x = i.pos.x + (Math.random() - 0.5) * 2), (ccsBaitFly = { g: n, t: 0, from: i.pos.clone().setY(1.2), to: o, k, mouth: r ? r.m[0] : null }), ke("pop"), ccsDogSay("bark"), rt(r ? "🐟 ป้อนเข้าปาก!" : `${e.icon} โยน!`, i.pos.clone().setY(1.5)), _t(z));
  }
  function ccsBaitTick(dt) {
    let i = ccsBaitFly;
    if (!i) return;
    i.t += dt;
    if (i.mouth) {
      // ลอยโค้งเข้าปากออร์กาที่อ้ารออยู่
      let a = i.mouth,
        c = ccsWhHead(a),
        l = Math.min(1, i.t / 0.75);
      if ((i.g.position.lerpVectors(i.from, c, l), (i.g.position.y += 1.4 * l * (1 - l)), i.g.lookAt(c), l < 1)) return;
      (K.remove(i.g), (ccsBaitFly = null), (a.chomp = 0.45), ke("pop"), ke("heart"), ccsSparkle(c.clone(), 8), rt("❤️ งั่ม! อร่อย", c.clone().setY(c.y + 0.8), "big"), ccsSplashW(c.clone(), Ph, 0.4));
      let h = ccsWh.pods.find((u) => u.k === "orca");
      h.lt = Math.max(h.lt, 18);
      let f = (z.whale ??= {}),
        d = f.orca ?? 0;
      (Ai("whalefeed"), Ai("orcamouth"), ccsSnapSoon("🐳 ป้อนแซลมอนเข้าปากออร์กา", 0.05, "mouth"), (f.orca = d + ((ccsHG("shark") ? 2 : 1) + (ccsSetOn("sailor") ? 1 : 0)) * (ccsBuffOn("whale") ? 2 : 1)), Math.floor(f.orca / 5) > Math.floor(d / 5) && setTimeout(() => ccsWhGift("orca"), 1500), _t(z));
      return;
    }
    let e = Math.min(1, i.t / 0.9);
    if ((i.g.position.lerpVectors(i.from, i.to, e), (i.g.position.y = i.from.y + (Ph - i.from.y) * e + 3 * e * (1 - e)), (i.g.rotation.x += dt * 9), e < 1)) return;
    (K.remove(i.g), ccsSplashW(i.to.clone(), Ph, 0.5), ke("splash"), (ccsBaitFly = null));
    let t = ccsBaitDef[i.k].who,
      n = ccsWh.pods.find((a) => a.k === t);
    if (!n || !n.m[0]) return void De(`${ccsWhInfo[t].n}ยังไม่อยู่แถวนี้ ลองใหม่อีกทีนะ`, 2200);
    let s = n.m[0];
    // ถ้าอยู่ไกลมาก ให้ดำน้ำมาโผล่ใกล้ ๆ (ไม่ต้องรอนาน)
    if (s.pos.distanceTo(i.to) > 45) {
      let a = i.to.clone().add(new H((Math.random() < 0.5 ? -1 : 1) * 22, 0, 14));
      n.m.forEach((c, l) => (c.pos.copy(a).add(new H(c.off.x, 0, c.off.z - l)), (c.y = ccsWhInfo[t].y[1]), (c.vis = 1)));
    }
    t === "sperm" && (s.br = 0);
    ((n.mode = "come"), n.tgt.copy(i.to), (n.feeder = 1));
    let o = (z.whale ??= {});
    let o0 = o[t] ?? 0;
    (o[t] = o0 + ((ccsHG("shark") ? 2 : 1) + (ccsSetOn("sailor") ? 1 : 0)) * (ccsBuffOn("whale") ? 2 : 1)), Ai("whalefeed");
    let r = ccsWhInfo[t].n;
    (De(`${r}ได้กลิ่น${ccsBaitDef[i.k].n} กำลังว่ายมา! 🌊`, 2200),
      setTimeout(() => {
        Math.floor(o[t] / 5) > Math.floor(o0 / 5) && ccsWhGift(t);
      }, 7000),
      _t(z));
  }
  function ccsWhGift(t) {
    let i = Le[0];
    if (!i) return;
    let e = t === "orca" ? [60, "ออร์กาคาบขวดข้อความลอยมาให้ 💌"] : t === "pilot" ? [35, "วาฬนำร่องดันเปลือกหอยสวยมาให้ 🐚"] : [150, "วาฬสเปิร์มทิ้งอำพันทะเลหายากไว้ให้ ✨"];
    ((z.money += e[0]), Ei(), ke("quest"), ccsDogSay("happy"), ccsSparkle(i.pos, 14), De(`${e[1]} +${e[0]}💰 (ความผูกพัน ${(z.whale ?? {})[t] ?? 0})`, 3200), _t(z));
  }
  function ccsWhaleMenu() {
    let i = z.bait ?? {},
      e = ccsWh?.pods.find((n) => n.k === "orca"),
      t = e && (e.mode === "linger" || e.mode === "beg");
    (Gi(
      "🐳 ให้อาหารปลาวาฬ · ท่าเรือ",
      `<p class="note">โยนเหยื่อจากปลายท่าเรือ วาฬแต่ละชนิดชอบไม่เหมือนกัน · ให้บ่อย ๆ จะผูกพันและมีของขวัญ</p>${Object.entries(ccsBaitDef)
        .map(([n, s]) => `<div class="row"><div class="ic">${s.icon}</div><div class="nm"><b>${s.n} → ${ccsWhInfo[s.who].n}</b><small>มี ${i[n] ?? 0} · ผูกพัน ${(z.whale ?? {})[s.who] ?? 0}</small></div><button class="buy" data-bait="${n}" ${(i[n] ?? 0) > 0 ? "" : "disabled"}>โยน</button></div>`)
        .join("")}${t ? `<button class="buy wide" data-orcaplay>🐳 เล่นกับออร์กา</button>` : ""}<p class="note">ซื้อเหยื่อได้ที่แผงปลาลุงทะเลริมหาด</p>`,
    ),
      document.querySelectorAll("[data-bait]").forEach((n) => n.addEventListener("click", () => ccsWhaleThrow(n.dataset.bait))),
      document.querySelector("[data-orcaplay]")?.addEventListener("click", () => (qs(), ccsOrcaPlay())));
  }
  var ccsOrcaCd = 0;
  function ccsOrcaPlay() {
    let i = ccsWh?.pods.find((s) => s.k === "orca");
    if (!i || (i.mode !== "linger" && i.mode !== "beg") || performance.now() < ccsOrcaCd) return;
    ((ccsOrcaCd = performance.now() + 2500), Ai("orcaplay"));
    i.lt = Math.max(i.lt, 25);
    let e = Math.floor(Math.random() * 3),
      t = i.m[Math.floor(Math.random() * i.m.length)];
    if (e === 0) {
      // กระโดดพร้อมกันทั้งฝูง
      i.m.forEach((s, o) => setTimeout(() => ccsWhAct(s, "breach", 2 + o * 0.1), o * 280));
      De("🐳 ออร์กากระโดดโชว์พร้อมกันทั้งฝูง!", 2000);
    } else if (e === 1) {
      (ccsWhAct(t, "slap", 1.6), (t.act.wet = 1), De("🐳 ตบหางสาดน้ำใส่น้อง!", 1800));
    } else (ccsWhAct(t, "spy", 3.2), De("🐳 ออร์กาโผล่หัวมามองน้อง น่ารักจัง ❤️", 2000));
    let n = (z.whale ??= {});
    ((n.orca = (n.orca ?? 0) + 0.5), Number.isInteger(n.orca) && n.orca % 5 === 0 && setTimeout(() => ccsWhGift("orca"), 2500), _t(z));
  }
  // ===== v119: ครูฝึก + คอร์สฝึก + พลัง 5 ด้าน (มีผลในเกมจริง) + คำสั่ง =====
  var ccsTRNpc = null,
    ccsStatDef = [
      ["jump", "🦘", "กระโดด", "กระโดดสูงขึ้นสูงสุด +70% · เตะลูกโด่งดวลจุดโทษแม่นขึ้น"],
      ["speed", "⚡", "ความเร็ว", "เดิน/วิ่งเร็วขึ้นสูงสุด +25%"],
      ["bal", "⚖️", "ทรงตัว", "โซนกดในสนามฝึกและดวลจุดโทษกว้างขึ้น · สะพานแคบโยกน้อยลง"],
      ["stam", "💪", "ความอึด", "พลังงานลดช้าลงสูงสุด 50% (วิ่ง/เดิน/ฝึก)"],
      ["obey", "🧠", "เชื่อฟัง", "ปลดล็อกคำสั่ง นั่ง หมอบ ขอ โค้ง กลิ้ง · โชว์ให้ชาวเมืองได้ทิป · นั่งคอยบนโต๊ะง่ายขึ้น"],
    ],
    ccsCourse = {
      hurdle: ["jump", 30],
      tire: ["jump", 35],
      hoops: ["jump", 40],
      broad: ["jump", 50],
      weave: ["speed", 40],
      tunnel: ["speed", 35],
      beam: ["bal", 50],
      seesaw: ["bal", 45],
      aframe: ["stam", 40],
      steps: ["stam", 40],
      table: ["obey", 60],
    },
    ccsCmds = [
      ["sit", "🐕 นั่ง", 0, 8],
      ["tilt", "🤔 เอียงคอ", 8, 3],
      ["lie", "🛌 หมอบ", 15, 10],
      ["beg", "🙏 ขอ", 25, 5],
      ["bow", "🙇 โค้ง", 40, 3],
      ["roll", "🔄 กลิ้ง", 60, 6],
    ];
  function ccsSt(i) {
    return Math.max(0, Math.min(100, (z.stats ?? (z.stats = {}))[i] ?? 0));
  }
  function ccsCoursePrice(i, l = z.trLv ?? 0) {
    let [e, t] = ccsCourse[i];
    return Math.round((t * ccsTRLvDef[l].mul * (1 + Math.floor(ccsSt(e) / 20) * 0.2) * (ccsHG("grad") ? 0.8 : 1)) / 5) * 5;
  }
  function ccsTRLeft(i) {
    let e = z.trDay ?? (z.trDay = { d: z.day, c: {} });
    return (e.d !== z.day && ((e.d = z.day), (e.c = {})), 3 - (e.c[i] ?? 0));
  }
  function ccsStatBars() {
    return ccsStatDef
      .map(([i, e, t, n]) => {
        let s = ccsSt(i);
        return `<div class="stb"><b>${e} ${t}</b><span><i style="width:${s}%"></i></span><em>${s.toFixed(1)}</em><small>${n}</small></div>`;
      })
      .join("");
  }
  function ccsTRMenu() {
    if (!Cr) return;
    if (!ccsTROpen()) return void De("🔒 สนามฝึกปิดแล้ว เปิด 08:00-19:00 นะ", 2200);
    let L = z.trLv ?? 0,
      i = Ma(),
      e = ccsStatDef
        .map(([n, s, o]) => {
          let r = Cr.stations
            .filter((a) => ccsCourse[a.id]?.[0] === n)
            .map((a) => {
              let c = ccsCoursePrice(a.id),
                l = ccsTRLeft(a.id),
                h = z.trainStars?.[ccsStarKey(a.id, L)] ?? 0,
                u = ccsTRUnlocked(a.id, L);
              return `<div class="row${u ? "" : " off"}"><div class="ic">${a.icon}</div><div class="nm"><b>${a.name}</b><small>${u ? `${"⭐".repeat(h)}${"☆".repeat(3 - h)} · วันนี้เหลือ ${l}/3 · ใช้แรง ${Math.round(a.stamina * (1 - ccsSt("stam") / 200))}` : `🔒 ต้องได้ ⭐⭐ ระดับ${ccsTRLvDef[L - 1].n}ก่อน`}</small></div><button class="buy" data-crs="${a.id}" ${!u || l <= 0 || z.money < c ? "disabled" : ""}>ฝึก ${c}💰</button></div>`;
            })
            .join("");
          return `<h4 class="qh">${s} ${o} · ${ccsSt(n).toFixed(1)}/100</h4>${r}`;
        })
        .join("");
    (Gi(
      "🏅 ครูฝึกพี่ต้น · เลือกคอร์สฝึก",
      `<p class="note">ฝึกได้คอร์สละ 3 ครั้ง/วัน · ได้ดาวมาก = พลังขึ้นมาก (⭐ +1.5 · ⭐⭐ +3 · ⭐⭐⭐ +5 ยิ่งสูงยิ่งขึ้นช้า) · เลเวลฝึก ${i.lvl}</p><div class="stbars">${ccsStatBars()}</div><div class="trlv">${ccsTRLvDef.map((d, u) => `<button data-trlv="${u}" class="${u === L ? "on" : ""}">Lv.${u + 1} ${d.n}<small>ค่าฝึก ×${d.mul} · พลัง ×${d.gain}</small></button>`).join("")}</div><button class="buy wide" data-cmdmenu>🐾 สั่งน้อง (คำสั่งที่ปลดล็อกแล้ว)</button>${e}`,
    ),
      document.querySelectorAll("[data-crs]").forEach((n) => n.addEventListener("click", () => ccsTRBuy(n.dataset.crs))),
      document.querySelector("[data-cmdmenu]")?.addEventListener("click", ccsCmdMenu),
      document.querySelectorAll("[data-trlv]").forEach((n) =>
        n.addEventListener("click", () => {
          ((z.trLv = +n.dataset.trlv), ke("pop"), ccsTRMenu());
        }),
      ));
  }
  function ccsTRBuy(i) {
    let e = Cr.stations.find((o) => o.id === i),
      t = ccsCoursePrice(i);
    if (!ccsTROpen()) return void De("🔒 สนามฝึกปิดแล้ว เปิด 08:00-19:00", 2200);
    if (!ccsTRUnlocked(i, z.trLv ?? 0)) return void De("🔒 ต้องได้ ⭐⭐ ในระดับก่อนหน้าก่อน", 2200);
    if (!e || ccsTRLeft(i) <= 0) return void De("คอร์สนี้ฝึกครบ 3 ครั้งแล้ววันนี้ พรุ่งนี้มาใหม่นะ", 2200);
    if (z.money < t) return (De(`เงินไม่พอ ค่าฝึก ${t}💰`, 1800), ke("nope"));
    qs();
    let n = Le[0],
      s = n.pos.clone();
    (n.pos.copy(e.start), UH(e));
    if (!ho) return void n.pos.copy(s);
    ((z.money -= t), Ei(), (z.trDay.c[i] = (z.trDay.c[i] ?? 0) + 1), (ho.paid = ccsCourse[i][0]), (ho.lv = z.trLv ?? 0), Ln(ccsTRNpc?.pos ?? n.pos, `${e.icon} ${e.name} พร้อมนะ! ${["hurdle", "tire", "hoops", "broad"].includes(i) ? "กดค้างชาร์จพลัง แล้วปล่อยตรงแถบเขียวตอนถึงจุดกระโดด" : i === "seesaw" ? "กดค้างก่อนถึงกลางกระดาน แล้วปล่อยตอนแตะพื้น" : "ดูแถบแล้วกดตอนเข้าช่องเขียว"}`), _t(z));
  }
  function ccsCmdMenu() {
    let i = ccsSt("obey");
    (Gi(
      "🐾 สั่งน้อง",
      `<p class="note">พลังเชื่อฟัง ${i.toFixed(1)}/100 · โชว์ใกล้ชาวเมือง (ไม่เกิน 4 ม.) ได้ทิปคนละครั้งต่อวัน · ฝึกเพิ่มที่ "โต๊ะหยุด" กับครูฝึก</p>${ccsCmds
        .map(([e, t, n]) => `<div class="row"><div class="ic">${t.split(" ")[0]}</div><div class="nm"><b>${t.split(" ")[1]}</b><small>${i >= n ? "ใช้ได้แล้ว" : `🔒 ต้องเชื่อฟัง ${n}`}</small></div><button class="buy" data-cmd="${e}" ${i >= n ? "" : "disabled"}>สั่ง!</button></div>`)
        .join("")}`,
    ),
      document.querySelectorAll("[data-cmd]").forEach((e) => e.addEventListener("click", () => ccsDoCmd(e.dataset.cmd))));
  }
  function ccsDoCmd(i) {
    let e = ccsCmds.find((r) => r[0] === i),
      t = Le[0];
    if (!e || ccsSt("obey") < e[2]) return;
    (qs(), Io(t.rig, i));
    let n = B6.get(t.rig);
    (n && ((n.it = 0), (n.end = e[3] + 2)), rt(e[1], t.pos, "big"), ke("pop"));
    // โชว์ให้ชาวเมืองใกล้ ๆ ดู → ได้ทิป (คนละครั้ง/วัน)
    let s = null,
      o = 4;
    for (let r of y0) {
      let a = r.rig?.root?.position;
      if (!a) continue;
      let c = Math.hypot(a.x - t.pos.x, a.z - t.pos.z);
      c < o && ((o = c), (s = r));
    }
    if (s) {
      let r = z.tips ?? (z.tips = {}),
        a = y0.indexOf(s) + ":" + z.day;
      if (r[a]) return void Ln(s.rig.root.position, "น่ารักจัง! 😊");
      r[a] = 1;
      let c = Math.round((5 + ccsSt("obey") / 8 + e[2] / 4) * (ccsFresh() ? 2 : 1) * (ccsSetOn("jester") ? 3 : ccsHG("clown") ? 2 : ccsHG("police") ? 1.5 : 1) * (ccsBuffOn("whale") ? 1.5 : 1));
      ((z.money += c), Ei(), Ai("tip"), rt(`❤️ +${c}💰`, s.rig.root.position.clone(), "big"), ke("coin"), Ln(s.rig.root.position, ccsFresh() ? `หอมจัง! ${e[1].split(" ")[1]}เก่งด้วย ให้ทิปเพิ่มเลย ✨` : `ว้าว ${e[1].split(" ")[1]}เก่งมาก! ให้ขนมนะ ❤️`), _t(z));
    }
  }
  function ccsTRMakeNpc() {
    if (ccsTRNpc || !Cr) return;
    try {
      let i = mr()
          ? Zr(["Body_07", "Ears_07", "Male_Emotion_Happy_02", "Hairstyle_Male_03", "Outwear_25", "Pants_05", "Shoe_Sneakers_02", "Hat_04"])
          : Ic(Sh[3]),
        e = new H(-15.4, 0, 16.3);
      ((i.yaw = Math.PI), i.root.position.copy(e), K.add(i.root));
      y0.push({
        rig: i,
        at: e.clone(),
        yaw: Math.PI,
        t: 5,
        moodT: 2,
        happy: !1,
        lines: ["มาฝึกกันไหม! คุยกับพี่เพื่อเลือกคอร์สได้เลย 🏅", "ฝึกกระโดดเยอะ ๆ จะกระโดดได้สูงมากนะ", "ฝึกเชื่อฟังแล้วสั่งนั่ง สั่งหมอบได้ ชาวเมืองชอบมาก", "ได้ 3 ดาวพลังขึ้นเยอะที่สุด!"],
      });
      // v122: โต๊ะลงทะเบียนหันออกทางเข้า · ป้ายติดหน้าโต๊ะ (เดิมลอยกลางอากาศ)
      let D = new J(),
        W = Ae(10181420, 0.7),
        Wd = Ae(7032119, 0.75);
      {
        let q = new R(new ee(1.7, 0.08, 0.66), W);
        (q.position.y = 0.92), D.add(q);
        let f = new R(new ee(1.62, 0.84, 0.06), Wd);
        (f.position.set(0, 0.46, -0.27), D.add(f));
        for (let x of [-0.79, 0.79]) {
          let g = new R(new ee(0.06, 0.88, 0.58), Wd);
          (g.position.set(x, 0.44, 0), D.add(g));
        }
        let pp = new R(new ee(0.5, 0.04, 0.34), Ae(16777215, 0.6));
        (pp.position.set(0.35, 0.97, 0.05), (pp.rotation.y = 0.2), D.add(pp));
        let cup = new R(new re(0.06, 0.05, 0.14, 12), Ae(15158332, 0.5));
        (cup.position.set(-0.5, 1.03, 0.08), D.add(cup));
      }
      let t = ro("🏅 ครูฝึก · ลงทะเบียน", 3, 1.5, 0.34);
      (t.rotation.y = Math.PI), t.position.set(0, 0.55, -0.31), D.add(t);
      (D.position.set(-15.4, 0, 15.72), D.traverse((q) => q.isMesh && ((q.castShadow = !0), (q.receiveShadow = !0))), K.add(D), pt.push({ x: -15.4, z: 15.72, hw: 0.87, hd: 0.35 }));
      ccsTRNpc = { rig: i, pos: e };
    } catch (i) {
      console.warn("trainer", i);
    }
  }
  // ===== v117: สนามฝึกแบบต้องใช้ฝีมือ (กดตามจังหวะ / เลี้ยวสลาลอม / ทรงตัว / นั่งคอย) + ดาว 1-3 =====
  var ccsTRHud = null,
    ccsSeeOv = null;
  function ccsTRBuild(i) {
    let e = i.path,
      t = [0];
    for (let r = 1; r < e.length; r++) t.push(t[r - 1] + e[r].distanceTo(e[r - 1]));
    let n = t[t.length - 1],
      s = [],
      o = [];
    // หาจุดเริ่มกระโดด/ขึ้น และจุดลง
    for (let r = 1; r < e.length; r++) {
      if (e[r].y > 0.06 && e[r - 1].y <= 0.06) {
        let a = r - 1;
        for (; a > 0 && e[a].y > 0.02; ) a--;
        s.push(t[a]);
      }
      e[r].y <= 0.06 && e[r - 1].y > 0.06 && o.push(t[r]);
    }
    let r = [],
      a = (c, l, h, f) => r.push({ d: Math.max(0.3, c), k: l, lab: h, ok: f ?? "✨ เป๊ะ!", res: null });
    switch (i.id) {
      case "weave": {
        for (let c = 2; c < e.length; c++) {
          let l = Math.atan2(e[c - 1].x - e[c - 2].x, e[c - 1].z - e[c - 2].z),
            h = Math.atan2(e[c].x - e[c - 1].x, e[c].z - e[c - 1].z),
            f = h - l;
          f = ccsWrapA(f);
          Math.abs(f) > 0.5 && (!r.length || t[c - 1] - r[r.length - 1].d > 0.9) && a(t[c - 1], f > 0 ? "L" : "R", f > 0 ? "⬅ เลี้ยวซ้าย!" : "เลี้ยวขวา ➡", "👌 อ้อมเสาสวย");
        }
        break;
      }
      case "tunnel":
        a(t[1] ?? 1, "A", "🕳️ ก้มลอดอุโมงค์!");
        break;
      case "aframe":
      case "steps":
        (s[0] !== void 0 && a(s[0], "A", "⬆ ก้าวขึ้น!"), o[0] !== void 0 && a(o[0] - 0.7, "A", "🟡 แตะโซนเหลือง!"));
        break;
      case "seesaw": {
        let c = 0;
        for (let l = 1; l < e.length; l++) e[l].y > e[c].y && (c = l);
        (s[0] !== void 0 && a(s[0], "A", "⬆ ขึ้นกระดาน!"), r.push({ d: t[c], k: "T", lab: "✋ กดค้างก่อนถึงกลาง → ปล่อยตอนกระดานแตะพื้น", res: null }));
        break;
      }
      case "beam": {
        // v132: สะพานทรงตัวแบบท้าทาย — ทรงตัวด้วย ⬅ ➡ ตลอดทาง (ให้คะแนนตามเวลาที่อยู่ตรงกลาง) + ลมกระโชกเป็นช่วง ๆ ต้องกดค้าง ⤴ เกาะสะพานให้ทันจังหวะ
        let lv = z.trLv ?? 0,
          b0 = s[0] ?? 2,
          b1 = o[0] ?? n - 1,
          g = [2, 3, 4][lv] ?? 2,
          g0 = b0 + 1.6,
          g1 = b1 - 1.3;
        s[0] !== void 0 && a(s[0], "A", "⬆ ขึ้นสะพาน!");
        for (let c = 0; c < g; c++) r.push({ d: g0 + ((g1 - g0) * (c + 0.5 + (Math.random() - 0.5) * 0.4)) / g, k: "gust", dir: Math.random() < 0.5 ? -1 : 1, lab: "💨 ลมกระโชก", res: null });
        r.push({ d: b0, d1: b1, k: "bal", lab: "⚖️ ทรงตัว", res: null });
        break;
      }
      case "table": {
        // v132: นั่งคอยแบบท้าทาย — สั่งนั่งให้ตรงจังหวะ · มีสิ่งล่อใจมาจากซ้าย/ขวา ต้องกดทิศนั้นห้าม (ไม่!) ให้ตรงจังหวะ · ห้ามกด ⤴ ระหว่างคอย · ปิดท้ายเรียกลงให้ตรงจังหวะ
        let c = 0,
          lv = z.trLv ?? 0;
        // v133: จุดนั่งคอย = จุดแรกที่ลงยืนบนโต๊ะแล้ว (จุดติดกันสูงเท่ากัน) ไม่ใช่กลางอากาศระหว่างกระโดด
        for (let l = 1; l < e.length - 1; l++) if (e[l].y > 0.4 && Math.abs(e[l].y - e[l + 1].y) < 0.003) { c = l; break; }
        let d = t[c] + 0.12,
          ds = [["🦋", "ผีเสื้อ"], ["🎾", "ลูกบอลกลิ้งมา"], ["🐿️", "กระรอก"], ["🍗", "ไก่ย่างหอม ๆ"], ["🐈", "แมวเดินผ่าน"]].sort(() => Math.random() - 0.5);
        (s[0] !== void 0 && a(s[0], "A", "⬆ กระโดดขึ้นโต๊ะ!"), r.push({ d, k: "sit", lab: "🪑 สั่งนั่ง!", res: null }));
        for (let l = 0; l < ([1, 2, 3][lv] ?? 1); l++) r.push({ d, k: "dis", side: Math.random() < 0.5 ? "L" : "R", ic: ds[l][0], nm: ds[l][1], lab: `${ds[l][0]} ${ds[l][1]}`, res: null });
        r.push({ d, k: "rel", lab: "📣 เรียกลงจากโต๊ะ", res: null });
        break;
      }
      default:
        // v127: กระโดดแบบชาร์จพลัง — กดค้างให้พลังขึ้น (ขึ้น-ลงวนไป) แล้วปล่อยให้ตรงแถบพลังของสิ่งกีดขวางนั้น + ปล่อยในระยะกระโดด
        for (let c of s) {
          let l = i.id === "broad" ? 0.78 + Math.random() * 0.12 : i.id === "tire" ? 0.55 + Math.random() * 0.15 : i.id === "hoops" ? 0.4 + Math.random() * 0.3 : 0.35 + Math.random() * 0.45;
          r.push({ d: Math.max(0.3, c), k: "J", pw: l, lab: i.id === "broad" ? "🦘 กระโดดไกล" : i.id === "hoops" ? "⭕ ลอดห่วง" : i.id === "tire" ? "🛞 ลอดยาง" : `🚧 ไม้สูง ${Math.round(l * 60 + 10)} ซม.`, ok: "✨ เป๊ะ! พลังพอดี", res: null });
        }
        r.length || a(n / 2, "A", "⚡ กดเลย!");
    }
    return { ev: r, len: n };
  }
  function ccsTRHudSet(i) {
    if (!ccsTRHud) {
      let e = document.createElement("div");
      ((e.id = "trHud"),
        (e.innerHTML = `<div class="trp"></div><div class="trdots"></div><div class="trbar"><b></b><s></s><i></i></div><div class="trdz"><b></b><i></i></div><div class="trbtn"><button data-tr="L">⬅</button><button data-tr="A" class="big">⤴ กด / ค้าง</button><button data-tr="R">➡</button></div>`),
        document.body.appendChild(e),
        e.querySelectorAll("[data-tr]").forEach((t) =>
          t.addEventListener("pointerdown", (n) => {
            (n.preventDefault(), n.stopPropagation(), t.setPointerCapture?.(n.pointerId), ccsTRInput(t.dataset.tr));
          }),
        ),
        e.querySelectorAll("[data-tr]").forEach((t) => {
          for (let ev of ["pointerup", "pointercancel", "lostpointercapture"]) t.addEventListener(ev, (n) => { (n.preventDefault(), ccsTRInput(t.dataset.tr, 1)); });
        }),
        (ccsTRHud = e));
    }
    ccsTRHud.classList.toggle("on", !!i);
    document.body.classList.toggle("training", !!i);
  }
  function ccsTRPow(i) {
    let e = i % 2;
    return e < 1 ? e : 2 - e;
  }
  function ccsTRInput(i, up) {
    let e = ho?.tr;
    if (!e) return;
    if (i === "A") {
      if (up ? !e.aHeld : e.aHeld) return; // กันกดซ้ำ/ปล่อยซ้ำ
      e.aHeld = !up;
    }
    let t = e.ev.find((s) => s.res === null);
    if (!t) return;
    if (t.k === "T") {
      // v127: กระดานหก — ต้องกดค้าง (เบรก) ก่อนถึงกลาง แล้วปล่อยตอนแตะพื้น
      i === "A" && up && ho.d >= t.d - 0.02 && (e.tdn === void 0 ? ccsTRRes(t, !1, "🙈 ลงก่อนกระดานแตะพื้น!") : ccsTRRes(t, !0, e.tdn <= 0.4 ? "👌 ลงนิ่งสวย!" : "👍 ลงได้ (ช้าไปนิด)", e.tdn <= 0.4 ? 1 : 0.75));
      return;
    }
    if (t.k === "J") {
      if (i !== "A" || e.cd > 0) return;
      let n = t.d - ho.d;
      if (!up) return void (n < 7 && ((e.chg = { ph: 0 }), ke("trChg")));
      if (!e.chg) return;
      let s = ccsTRPow(e.chg.ph),
        o = s - t.pw,
        r = ccsTRL().pw + ccsSt("bal") * 0.0006;
      ((e.chg = null), (t.pv = s));
      if (n > ccsTRW().e) return void ccsTRRes(t, !1, "⏩ ปล่อยเร็วไป! ยังไม่ถึงจุดกระโดด");
      if (Math.abs(o) > r * 2) return void ccsTRRes(t, !1, o < 0 ? (ho.st.id === "broad" ? "💦 แรงไม่พอ โดดไม่ถึง!" : "💥 แรงไม่พอ ชนเลย!") : "🌀 แรงเกิน ลงพลาด!");
      let a = Math.abs(o) <= r ? 1 : 0.6,
        c = n <= ccsTRW().p ? 1 : 0.8;
      ccsTRRes(t, !0, a * c >= 1 ? t.ok : a < 1 ? (o < 0 ? "👍 ผ่าน (แรงน้อยไปนิด)" : "👍 ผ่าน (แรงเกินไปนิด)") : "👍 ผ่าน (ปล่อยช้าไปนิด)", a * c);
      return;
    }
    // v132: สะพาน — ⬅ ➡ ทรงตัวได้ตลอดที่อยู่บนสะพาน · ลมกระโชก: กดค้าง ⤴ เกาะ แล้วค้างไว้จนลมผ่าน
    let bE = e.ev.find((s) => s.k === "bal" && s.res === null && ho.d >= s.d);
    if (bE && (i === "L" || i === "R")) return void (up || (e.bv += i === "L" ? -1.1 : 1.1));
    if (t.k === "gust") {
      if (i !== "A" || !bE) return;
      if (!up) return void (t.br || ((e.bSt = ho.d), t.hit && !t.br && ho.d <= t.d + 0.32 && ((t.br = 0.6), (t.late = 1), (e.bv += t.dir * 0.7 * ccsTRL().bal ** 0.5), rt("🧱 เกาะทัน!", Le[0].pos))));
      t.br && ho.d < t.d + 0.55 && ((e.bv += t.dir * 0.9), ccsTRRes(t, !0, "🍃 ปล่อยเร็วไป ลมยังไม่หมด!", 0.5));
      return;
    }
    if (t.k === "sit" || t.k === "dis" || t.k === "rel") return void ccsTBInput(t, i, up, e);
    if (up) return;
    let n = t.d - ho.d;
    if (n > 1.7) return;
    n > ccsTRW().e ? ccsTRRes(t, !1, "⏩ เร็วไป!") : t.k !== i ? ccsTRRes(t, !1, t.k === "A" ? "❌ ผิดปุ่ม" : "❌ ผิดทาง!") : ccsTRRes(t, !0, n <= ccsTRW().p ? t.ok : "👍 ดี", n <= ccsTRW().p ? 1 : 0.75);
  }
  function ccsTRRes(i, e, t, n = 1) {
    ((i.res = e ? n : 0), ho?.tr && (ho.tr.chg = null), rt(t, Le[0].pos, e ? "big" : "bad"), ccsTRFx(e ? (n >= 1 ? "ok" : "good") : "bad", t), e && i.hold && (ho.tr.hold = i.hold));
  }
  // ===== v127: สัญลักษณ์+เสียงที่ต่างกันชัด: เป๊ะ / ผ่าน / พลาด / ไม่ผ่าน / สำเร็จ =====
  var ccsTRFxEl = null,
    ccsTRFxT = 0;
  function ccsTRFx(i, e) {
    if (!ccsTRFxEl) {
      ccsTRFxEl = document.createElement("div");
      ccsTRFxEl.id = "trFx";
      ccsTRFxEl.innerHTML = '<div class="ic"></div><div class="tx"></div>';
      document.body.appendChild(ccsTRFxEl);
      let t = document.createElement("div");
      ((t.id = "trVig"), document.body.appendChild(t));
    }
    let t = { ok: ["✔", "เป๊ะ!"], good: ["👍", "ผ่าน"], bad: ["✖", "พลาด!"] }[i];
    ccsTRFxEl.querySelector(".ic").textContent = t[0];
    ccsTRFxEl.querySelector(".tx").textContent = (e || t[1]).replace(/^[^\p{L}\p{N}]+/u, "") || t[1];
    ccsTRFxEl.className = "";
    void ccsTRFxEl.offsetWidth;
    ccsTRFxEl.className = i;
    clearTimeout(ccsTRFxT);
    ccsTRFxT = setTimeout(() => (ccsTRFxEl.className = ""), 1100);
    ke(i === "ok" ? "trOk" : i === "good" ? "trGood" : "trBad");
    if (i === "bad") {
      let n = document.getElementById("trVig");
      ((n.className = ""), void n.offsetWidth, (n.className = "on"), document.body.classList.remove("trshake"), void document.body.offsetWidth, document.body.classList.add("trshake"), setTimeout(() => document.body.classList.remove("trshake"), 450));
      try { navigator.vibrate?.([60, 40, 90]); } catch {}
      typeof ccsDogSay == "function" && ccsDogSay("whine");
    } else i === "ok" && typeof ccsDogSay == "function" && Math.random() < 0.5 && ccsDogSay("happy");
  }
  var ccsTREndEl = null,
    ccsTREndT = [];
  function ccsTREndClose() {
    (ccsTREndT.forEach(clearTimeout), (ccsTREndT = []), ccsTREndEl && ccsTREndEl.classList.remove("on"), (window.ccsTREndOn = !1));
  }
  function ccsTREnd(i, e, t, n) {
    // i=ดาว 0-3, e=สถานี, t=รายละเอียด, n=จุดพลาด
    if (!ccsTREndEl) {
      ccsTREndEl = document.createElement("div");
      ccsTREndEl.id = "trEnd";
      ccsTREndEl.addEventListener("pointerdown", (s) => (s.preventDefault(), ccsTREndClose()));
      document.body.appendChild(ccsTREndEl);
    }
    ccsTREndClose();
    let s = i > 0;
    ccsTREndEl.className = s ? (i === 3 ? "win3" : "win") : "fail";
    ccsTREndEl.innerHTML = `<div class="card"><div class="big">${s ? (i === 3 ? "🏆" : "✅") : "❌"}</div><h2>${s ? (i === 3 ? "สมบูรณ์แบบ!" : "ผ่าน!") : "ไม่ผ่าน"}</h2><div class="who">${e.icon} ${e.name}</div><div class="stars">${[0, 1, 2].map(() => "<span>★</span>").join("")}</div><div class="det">${t}</div><div class="trhint">${s ? (n ? `พลาด ${n} จุด · ฝึกอีกเพื่อ ⭐⭐⭐` : "ไม่พลาดเลย! เก่งมาก") : "ลองใหม่นะ ดูแถบพลัง/จังหวะให้ดี"}</div><small>แตะเพื่อปิด</small></div>${i === 3 ? '<div class="conf">' + Array.from({ length: 46 }, (o, r) => `<i style="left:${(r * 37) % 100}%;background:hsl(${(r * 47) % 360} 90% 60%);animation-delay:${(r % 9) * 0.07 + 1.3}s;animation-duration:${1.6 + (r % 5) * 0.25}s"></i>`).join("") + "</div>" : ""}`;
    (void ccsTREndEl.offsetWidth, ccsTREndEl.classList.add("on"), (window.ccsTREndOn = !0));
    if (!s) {
      (ke("trFail"), typeof ccsDogSay == "function" && ccsDogSay("whine"));
      ccsTREndT.push(setTimeout(ccsTREndClose, 3600));
      return;
    }
    let o = ccsTREndEl.querySelectorAll(".stars span");
    for (let r = 0; r < i; r++) ccsTREndT.push(setTimeout(() => (o[r].classList.add("on"), ke("trStar" + (r + 1))), 450 + r * 420));
    ccsTREndT.push(setTimeout(() => (ke(i === 3 ? "trFan" : "heart"), typeof ccsDogSay == "function" && ccsDogSay(i === 3 ? "bark" : "happy")), 500 + i * 420));
    ccsTREndT.push(setTimeout(ccsTREndClose, i === 3 ? 5200 : 4000));
  }
  addEventListener(
    "keydown",
    (i) => {
      window.ccsTREndOn && !ho && ["Enter", " ", "Escape"].includes(i.key) && (i.preventDefault(), i.stopPropagation(), ccsTREndClose());
    },
    !0,
  );
  addEventListener(
    "keydown",
    (i) => {
      if (!ho?.tr) return;
      let e = i.key.length === 1 ? i.key.toLowerCase() : i.key,
        t = { " ": "A", Enter: "A", ArrowUp: "A", w: "A", f: "A", ArrowLeft: "L", a: "L", ArrowRight: "R", d: "R" }[e];
      t && (i.preventDefault(), i.stopPropagation(), i.repeat || ccsTRInput(t));
    },
    !0,
  );
  addEventListener(
    "keyup",
    (i) => {
      if (!ho?.tr) return;
      let e = i.key.length === 1 ? i.key.toLowerCase() : i.key,
        t = { " ": "A", Enter: "A", ArrowUp: "A", w: "A", f: "A" }[e];
      t && (i.preventDefault(), i.stopPropagation(), ccsTRInput(t, 1));
    },
    !0,
  );
  addEventListener("blur", () => ho?.tr?.aHeld && ccsTRInput("A", 1));
  function ccsTRTick(i, e) {
    let t = ho.tr,
      n = t.ev.find((l) => l.res === null),
      s = 4.2;
    // v118: นับถอยหลังก่อนเริ่ม + เกจของแต่ละจุดเริ่มจาก 0 เสมอ (ตั้งจุดเริ่มเมื่อจุดก่อนหน้าจบ)
    if (n && n.s === void 0) ((n.s = ho.d), (n.S = Math.max(0.3, n.d - ho.d)));
    t.chg && (t.chg.ph += e / ccsTRL().chg);
    if (t.cd > 0) ((t.cd -= e), (s = 0));
    else if (t.hold > 0) ((t.hold -= e), (s = 0));
    else if (n) {
      let l = n.d - ho.d,
        bE = t.ev.find((x) => x.k === "bal" && x.res === null && ho.d >= x.d);
      if (bE) {
        // ทรงตัวบนสะพาน: เอียงไปเองเรื่อย ๆ (ส่ายเป็นจังหวะ + สุ่ม) ต้องกดแก้ · เกาะสะพานอยู่ = นิ่งขึ้นแต่เดินช้าลง
        let brc = t.aHeld ? 0.35 : 1;
        ((s = 2.3 * (t.aHeld ? 0.6 : 1)), (t.wob = (t.wob ?? Math.random() * 6) + e * 1.7), (t.bv += ((Math.random() - 0.5) * 7 + Math.sin(t.wob) * 1.6 + t.bal * 2.4) * e * brc * (1 - ccsSt("bal") / 200) * ccsTRL().bal), (t.bv *= Math.pow(0.35, e)), (t.bal += t.bv * e));
        ((t.onT = (t.onT ?? 0) + e), Math.abs(t.bal) < 0.22 && (t.gT = (t.gT ?? 0) + e));
        if (Math.abs(t.bal) > 1) {
          for (let x of t.ev) (x.k === "bal" || x.k === "gust") && x.res === null && (x.res = 0);
          ((t.fell = !0), rt("💦 ตกสะพาน!", i.pos, "bad"), ccsTRFx("bad", "ตกสะพาน!"));
          return void ((ho.d = t.len), VH(i));
        }
        if (ho.d >= bE.d1) {
          let q = (t.gT ?? 0) / Math.max(0.1, t.onT ?? 0.1);
          ccsTRRes(bE, !0, q >= 0.7 ? `⚖️ ทรงตัวเยี่ยม! กลางสะพาน ${Math.round(q * 100)}%` : `👍 ผ่านสะพาน (กลาง ${Math.round(q * 100)}%)`, q >= 0.7 ? 1 : q >= 0.4 ? 0.75 : 0.5);
          for (let x of t.ev) x.k === "gust" && x.res === null && (x.res = 0);
        }
      }
      if (n.k === "gust" && bE) {
        // ลมกระโชก: ถึงจุด → ลมตี (ถ้าเกาะอยู่แรงเหลือนิดเดียว) · ต้องค้างเกาะจนลมผ่าน
        if (!n.hit && ho.d >= n.d) {
          n.hit = 1;
          let k = ccsTRL().bal ** 0.5;
          t.aHeld ? ((n.br = (t.bSt ?? -9) >= n.d - 1.1 ? 1 : 0.75), (t.bv += n.dir * 0.2 * k)) : (t.bv += n.dir * 0.25 * k);
          (ke("trChg"), document.body.classList.remove("trshake"), void document.body.offsetWidth, document.body.classList.add("trshake"), setTimeout(() => document.body.classList.remove("trshake"), 350));
        }
        n.hit && !n.br && ho.d > n.d + 0.32 && ((t.bv += n.dir * 1.7 * ccsTRL().bal ** 0.5), ccsTRRes(n, !1, "💨 โดนลมพัด! ⬅ ➡ แก้เร็ว!"));
        n.br && ho.d >= n.d + 0.55 && ccsTRRes(n, !0, n.late ? "👍 เกาะทัน (ช้าไปนิด)" : n.br >= 1 ? "🧱 เกาะแน่น! ลมผ่านไปแล้ว" : "👍 เกาะได้ (เกาะนานไป)", n.late ? 0.75 : n.br);
      } else if (bE && n.k === "bal") {
      } else if (n.k === "sit" || n.k === "dis" || n.k === "rel") {
        ho.d >= n.d && ((s = 0), ccsTBTick(n, t, e, i));
      } else if (n.k === "T" && ho.d >= n.d) {
        // v127: กระดานหก: ถ้ากดค้าง (เบรก) กระดานจะค่อย ๆ ลง ถ้าไม่กดจะกระแทก
        ((s = 0), (t.tip = t.tip ?? 0));
        if (t.tdn === void 0) {
          t.tip += e * (t.aHeld ? 0.6 : 2.4);
          t.tip >= 1 && ((t.tip = 1), t.aHeld ? ((t.tdn = 0), ke("pop"), rt("⬇ แตะพื้นแล้ว ปล่อย!", i.pos, "big")) : ccsTRRes(n, !1, "💥 กระดานกระแทกพื้น!"));
        } else (t.tdn += e) > 1.1 && ccsTRRes(n, !0, "🐢 ค้างนานไป", 0.5);
      } else if (n.k === "J") {
        // v127: วิ่งความเร็วคงที่ ไม่ชะลอให้ — ต้องกะจังหวะชาร์จเอง
        l < 8 && (s = 2.3 * ccsTRL().spd);
        l < -0.25 && ccsTRRes(n, !1, t.chg ? "💥 ปล่อยช้าไป ชนเลย!" : "💥 ไม่ได้กระโดด!");
      } else if (n.k === "stay" && ho.d >= n.d) {
        ((s = 0), (t.st = (t.st ?? 0) + e), (t.stay = t.stay ?? "sit"));
        if (t.stay === "sit" && t.st > ccsTRL().sit + ccsSt("obey") * 0.01) ccsTRRes(n, !1, "😜 ไม่ยอมนั่ง");
        else if (t.stay === "wait") {
          t.st > ccsTRL().stay - ccsSt("obey") * 0.01 && ccsTRRes(n, !0, "🏅 นั่งคอยเก่งมาก!");
        }
      } else {
        // ใกล้จุด: ช้าลงให้เกจวิ่งจาก 0 ถึงจุดอย่างน้อย ~1.4 วิ
        l < 3 && (s = n.k === "A" ? Math.min(2.8, Math.max(1.2, (n.S + 0.25) / 1.4)) * ccsTRL().spd : 3.3 * ccsTRL().spd); // v127: สลาลอมไม่ชะลอ ต้องตามจังหวะ
        l < -0.25 && ccsTRRes(n, !1, n.k === "A" ? (ho.st.id === "hurdle" ? "💥 ชนไม้!" : "💥 ช้าไป!") : "😵 ข้ามเสา!");
      }
    }
    ccsSeeOv = n && n.k === "T" && ho.d >= n.d - 0.02 && n.res === null ? (t.tip ?? 0) : null;
    ho.d += e * s;
    let o = yM(ho.st.path, ho.d, GH),
      r = o.p.y,
      a = t.ev.find((l) => (l.k === "A" || l.k === "J") && l.res !== null && ho.d > l.d - 0.3 && ho.d < l.d + 2.6);
    a && ["hurdle", "tire", "hoops", "broad"].includes(ho.st.id) && (r *= a.res === 0 ? 0.35 : a.pv !== void 0 ? 0.8 + a.pv * 0.4 : 1);
    let c = t.ev.find((l) => l.k === "bal" && ho.d >= l.d && ho.d <= l.d1 + 0.3);
    (i.pos.set(o.p.x + (c ? Math.cos(o.dir) * t.bal * 0.22 : 0), 0, o.p.z - (c ? Math.sin(o.dir) * t.bal * 0.22 : 0)), (j.jy = r), (i.dir = o.dir), (i.spd = s), i.rig.root && (i.rig.root.rotation.z = c ? -t.bal * 0.35 : 0));
    // HUD
    if (ccsTRHud) {
      let l = ccsTRHud.querySelector(".trp"),
        h = ccsTRHud.querySelector(".trbar i"),
        f = ccsTRHud.querySelector(".trbar b"),
        g = ccsTRHud.querySelector(".trbar s"),
        zb = ccsTRHud.querySelector(".trdz b"),
        zi = ccsTRHud.querySelector(".trdz i"),
        d = t.ev.filter((p) => p.res !== null),
        u = n && n.res === null ? n : null;
      u?.k !== "J" && ccsTRHud.classList.remove("jz");
      let bH = t.ev.find((x) => x.k === "bal" && x.res === null && ho.d >= x.d);
      if (bH && t.cd <= 0) {
        let gq = Math.round(((t.gT ?? 0) / Math.max(0.1, t.onT ?? 0.1)) * 100),
          gw = u && u.k === "gust" ? u.d - ho.d : 9;
        ((l.textContent =
          u && u.k === "gust" && gw < 1.9
            ? u.br
              ? "🧱 เกาะไว้… ลมยังพัดอยู่ ห้ามปล่อย!"
              : `💨 ลมกระโชกจาก${u.dir > 0 ? "ซ้าย ➡" : "ขวา ⬅"} กดค้าง ⤴ เกาะสะพาน!`
            : `${d.length + 1}/${t.ev.length} · ⚖️ ทรงตัว ⬅ ➡ · กลางสะพาน ${gq}%`),
          (h.style.left = `${50 + Math.max(-1, Math.min(1, t.bal)) * 50}%`),
          (f.style.cssText = "left:28%;width:44%"),
          (g.style.cssText = "left:39%;width:22%"),
          ccsTRHud.classList.add("bal"),
          ccsTRHud.classList.toggle("hot", !!(u && u.k === "gust" && gw < 1.9 && !u.br)));
      } else if (u && (u.k === "sit" || u.k === "dis" || u.k === "rel") && ho.d >= u.d) ccsTBHud(u, t, l, h, f, g);
      else if (t.cd > 0) ((l.textContent = `${ho.st.icon} ${ho.st.name} · Lv.${(ho.lv ?? 0) + 1} ${ccsTRL().n} · เริ่มใน ${Math.ceil(t.cd / 0.8)}…`), (h.style.left = "0%"), (f.style.cssText = "display:none"), (g.style.cssText = "display:none"));
      else if (u && u.k === "J") {
        // v127: แถบบน = พลัง (ชาร์จวนขึ้นลง) · แถบล่าง = ระยะถึงจุดกระโดด
        let p = u.d - ho.d,
          m = ccsTRL().pw + ccsSt("bal") * 0.0006,
          E = (x) => Math.max(0, Math.min(100, x * 100)),
          y = t.chg ? ccsTRPow(t.chg.ph) : 0,
          q = Math.max(0, Math.min(100, (1 - (p + 0.25) / 7.25) * 100)),
          Z = (x) => Math.max(0, Math.min(100, (1 - (x + 0.25) / 7.25) * 100)),
          D = p <= ccsTRW().e && p > -0.25;
        ((l.textContent = `${d.length + 1}/${t.ev.length} · ${u.lab} — ${t.chg ? (D ? "🟢 ปล่อยเลย!" : "⚡ ชาร์จอยู่…") : "กดค้าง ⤴ ชาร์จพลัง"}`),
          (h.style.left = `${E(y)}%`),
          (f.style.cssText = `left:${E(u.pw - 2 * m)}%;width:${E(u.pw + 2 * m) - E(u.pw - 2 * m)}%`),
          (g.style.cssText = `left:${E(u.pw - m)}%;width:${E(u.pw + m) - E(u.pw - m)}%`),
          (zb.style.cssText = `left:${Z(ccsTRW().e)}%;width:${100 - Z(ccsTRW().e)}%`),
          (zi.style.left = `${q}%`),
          ccsTRHud.classList.remove("bal"),
          ccsTRHud.classList.add("jz"),
          ccsTRHud.classList.toggle("hot", D && !!t.chg));
      } else if (u && u.k === "T") {
        let p = ho.d >= u.d - 0.02;
        ((l.textContent = !p ? `${d.length + 1}/${t.ev.length} · ${t.aHeld ? "✋ ค้างไว้… กำลังไปกลางกระดาน" : u.lab}` : t.tdn !== void 0 ? "⬇ แตะพื้นแล้ว — ปล่อย!" : t.aHeld ? "✋ ค้างไว้… กระดานค่อย ๆ ลง" : "⚠️ กดค้างเร็ว!"),
          (h.style.left = `${(t.tip ?? 0) * 100}%`),
          (f.style.cssText = "display:none"),
          (g.style.cssText = "left:94%;width:6%"),
          ccsTRHud.classList.remove("bal"),
          ccsTRHud.classList.toggle("hot", t.tdn !== void 0));
      } else if (u) {
        let p = u.d - ho.d,
          m = u.S + 0.25,
          E = (x) => Math.max(0, Math.min(100, (1 - (x + 0.25) / m) * 100)),
          y = d.length + 1;
        ((l.textContent = `${y}/${t.ev.length} · ${u.lab} ${u.k === "A" ? "(⤴ / Space / Ⓐ)" : u.k === "L" ? "(⬅ / A / ◀)" : "(➡ / D / ▶)"}`),
          (h.style.left = `${E(p)}%`),
          (f.style.cssText = `left:${E(ccsTRW().e)}%;width:${E(ccsTRW().p) - E(ccsTRW().e)}%`),
          (g.style.cssText = `left:${E(ccsTRW().p)}%;width:${100 - E(ccsTRW().p)}%`),
          ccsTRHud.classList.remove("bal"),
          ccsTRHud.classList.toggle("hot", p < ccsTRW().e && p > -0.25));
      } else ((l.textContent = "🏁 เข้าเส้นชัย!"), (f.style.cssText = "display:none"), (g.style.cssText = "display:none"));
      // ปุ่มที่ต้องกดเรืองแสง
      let v = t.cd > 0 ? "" : bH ? "LR" + (u && u.k === "gust" && u.d - ho.d < 1.9 ? "A" : "") : u ? (u.k === "dis" ? (u.on ? "LR" : "") : u.k === "sit" || u.k === "rel" ? "A" : u.k === "J" || u.k === "T" ? "A" : u.k) : "";
      ccsTRHud.querySelectorAll("[data-tr]").forEach((x) => x.classList.toggle("need", v.includes(x.dataset.tr)));
      ccsTRHud.querySelector(".trdots").innerHTML = t.ev.map((x) => (x.res === null ? (x === u ? "🔸" : "⚪") : x.res >= 1 ? "🟢" : x.res > 0 ? "🟡" : "🔴")).join("");
      ccsTRHud.dataset.cnt = `${d.filter((p) => p.res > 0).length}/${t.ev.length}`;
      ccsTRHud.querySelector(".trp").dataset.cnt = ccsTRHud.dataset.cnt;
    }
    o.done && VH(i);
  }
  function UH(i) {
    if (z.energy < i.stamina) {
      (De(
        "เหนื่อยแล้ว พักกินข้าวกินน้ำก่อนนะ",
        2e3,
      ),
        ke("nope"));
      return;
    }
    if ((z.hunger ?? 100) < 10 || (z.thirst ?? 100) < 10) {
      (De(
        "หิวจนไม่มีแรงฝึกแล้ว 🍖💧",
        2e3,
      ),
        ke("nope"));
      return;
    }
    ((z.energy -= i.stamina * (1 - ccsSt("stam") / 200)), mi(-4, -6), (ho = { st: i, d: 0, tr: Object.assign(ccsTRBuild(i), { bal: 0, bv: 0, hold: 0, cd: 2.4 }) }), (ho.d = Math.min(0, (ho.tr.ev[0]?.d ?? 9) - (ho.tr.ev[0]?.k === "J" ? 4 : 2))), ke("pop"), ccsTRHudSet(!0)); // ถอยหลังให้มีระยะวิ่งเข้าจุดแรกอย่างน้อย 2 ม.
  }
  var ho_paid_tmp = null;
  function VH(i) {
    let e = ho.st,
      a = ho.tr;
    ho_paid_tmp = ho.paid ?? null;
    var lvX = ho.lv ?? 0;
    ((ho = null), (ccsSeeOv = null), (j.jy = 0), ccsTRHudSet(!1), i.rig.root && (i.rig.root.rotation.z = 0));
    let t = Ma();
    t.runs += 1;
    // v117: ดาวตามฝีมือ (ตกสะพาน = 0 ดาว)
    let c = a?.ev.length ? a.ev.reduce((h, f) => h + (f.res ?? 0), 0) / a.ev.length : 1,
      l = a?.fell ? 0 : c >= 0.95 && !a?.ev.some((d) => !d.res) ? 3 : c >= 0.6 ? 2 : c >= 0.3 ? 1 : 0, // v127: 3 ดาวต้องไม่พลาดเลย · ต่ำกว่า 30% = ไม่ผ่าน
      _q = (Ai("train"), l === 3 && (Ai("star3"), ccsSnapSoon(`⭐⭐⭐ ${e.icon} ${e.name} · Lv.${lvX + 1}`, 0.15, "star" + e.id))),
      n = Math.round(e.xp * [0.25, 0.7, 1, 1.5][l] * (1 + Math.random() * 0.2)),
      h = z.trainStars ?? (z.trainStars = {}),
      sk = ccsStarKey(e.id, lvX),
      f = l > (h[sk] ?? 0);
    let G = ho_paid_tmp,
      gain = 0;
    if (((ho_paid_tmp = null), G)) {
      let x = ccsSt(G);
      ((gain = Math.round([0, 1.5, 3, 5][l] * Math.max(0.3, 1 - x / 120) * ccsTRLvDef[lvX].gain * (ccsHG("grad") ? 1.3 : 1) * 10) / 10), (z.stats[G] = Math.min(100, x + gain)));
    }
    ((window.__trLast = [l, a ? a.ev.map((d) => d.res) : [], gain]), f && (h[sk] = l),
      (j.score += n),
      (fa.money.textContent = String(z.money)),
      rt(`${"⭐".repeat(l) || "💤"} ${e.icon} +${n} XP`, i.pos.clone().setY(1.6), l ? "big" : "bad"),
      ccsTREnd(l, e, `${a ? a.ev.map((d) => (d.res >= 1 ? "🟢" : d.res > 0 ? "🟡" : "🔴")).join("") : ""}${a?.fell ? " · ตกสะพาน" : ""}<br>+${n} XP${gain ? ` · ${ccsStatDef.find((d) => d[0] === G)[1]} ${ccsStatDef.find((d) => d[0] === G)[2]} +${gain}` : ""}${f && l ? "<br><b>🎉 สถิติใหม่!</b>" : ""}`, a ? a.ev.filter((d) => !d.res).length : 0),
      Rs(n, i),
      _t(z));
  }
  function Rs(i, e) {
    let t = Ma();
    for (t.xp += i; t.xp >= rd(t.lvl);) {
      ((t.xp -= rd(t.lvl)), (t.lvl += 1));
      let n = 40 * t.lvl;
      ((z.money += n),
        setTimeout(() => {
          (rt(`🏅 Lv.${t.lvl}! +${n}💰`, e.pos.clone().setY(2.2), "big"),
            ke("coin"),
            p0(!0),
            De(
              `🎉 เลเวลฝึก ${t.lvl}! ได้แต้มความสามารถ ⭐ +1 (กด 📋) \xB7 วิ่งเร็วขึ้น อึดขึ้น ได้รางวัล ${n} 💰`,
              3200,
            ));
        }, 400));
    }
    _t(z);
  }
  var mo = new H(Ut.x, 0, Ut.z - 0.2);
  function JE() {
    if (!Rn) return;
    Sd(Rn);
    let i = Le[0];
    (i.pos.copy(Rn.exit).add(new H(0, 0, -1.2)),
      (i.dir = Math.PI),
      (j.yaw = 0),
      Lt.position.set(i.pos.x, 3.4, i.pos.z + 1.2),
      ke("pop"),
      De("🏠 กลับถึงบ้านแล้ว", 1600));
  }
  function WH() {
    (Sd(null), (j.sleeping = 0));
    let i = Le[0],
      e = ze("beach_house");
    (i.pos.copy(mo).add(new H(0, 0, e ? 0.9 : -1.6)), (i.dir = e ? 0 : Math.PI), (j.yaw = e ? 0 : Math.PI), ke("pop"));
  }
  function qH() {
    Rn &&
      ((j.sleeping = 1),
      (j.napT = 0),
      (j.zzT = 0),
      Le[0].pos.copy(Rn.bed),
      (Le[0].dir = Math.PI / 2),
      (Le[0].rig.yaw = Math.PI / 2),
      Oh(1, 0.45),
      De(
        "💤 ครอก… ฟี้… (กดตื่นนอนเมื่อไหร่ก็ได้)",
        2600,
      ));
  }
  function jH() {
    Rn &&
      ((j.sleeping = 1),
      Le[0].pos.copy(Rn.bed),
      (Le[0].dir = Math.PI / 2),
      (Le[0].rig.yaw = Math.PI / 2),
      Oh(2, 0.5),
      YH(() => {
        ((j.sleeping = 0), (z.energy = 100), CT(!1), JE(), Le[0].pos.copy(Rn.bed), Io(Le[0].rig, "none"));
      }));
  }
  function b4(i, e) {
    return Math.max(
      Cr ? Cr.heightAt(i, e) : 0,
      KH(i, e),
      ba(i, e) ?? 0,
      Rd(i, e) ?? 0,
      zo(i, e),
      Hp(i - ll.x, e - ll.z),
      Math.abs(Math.hypot(i - kn.x, e - kn.z) - 7.31) < 0.4 ? 0.6 : 0,
    );
  }
  function x4(i, e, t) {
    let n = Math.sin(e),
      s = Math.cos(e),
      o = t(i.x, i.z);
    for (let [r, a] of [
      [0.42, 0],
      [-0.42, 0],
      [0, 0.22],
      [0, -0.22],
    ])
      o = Math.max(o, t(i.x + n * r + s * a, i.z + s * r - n * a) - 0.03);
    return o;
  }
  function $H(i) {
    let e = Rn?.bedRect;
    return !!e && Math.abs(i.x - e.x) < e.hw - 0.1 && Math.abs(i.z - e.z) < e.hd - 0.1;
  }
  function y4() {
    ((j.sleeping = 0),
      (Le[0].rig.body.scale.y = 1),
      (Le[0].rig.body.position.y = 0),
      Io(Le[0].rig, "none"),
      De("☀️ ตื่นแล้ว สดชื่น!", 1500));
  }
  function XH(i, e) {
    ((z.energy = Math.min(100, (z.energy ?? 100) + i * 6)),
      (j.time += i * 0.004),
      (j.napT += i),
      (j.zzT -= i),
      j.zzT < 0 &&
        ((j.zzT = 2.4),
        rt(
          ["💤 Zzz", "Zzz…", "ครอก…", "ฟี้…"][
            Math.floor(j.napT / 2.4) % 4
          ],
          e.pos.clone().setY(1.4),
          "zz",
        ),
        Math.floor(j.napT / 2.4) % 2 === 0 && Oh(1, 0.35)),
      (z.energy ?? 100) >= 100 &&
        (y4(),
        De(
          "☀️ นอนเต็มอิ่ม พลังเต็มแล้ว!",
          2200,
        )));
  }
  function YH(i) {
    let e = document.getElementById("sleepfx");
    if (!e) {
      i();
      return;
    }
    (e.classList.add("on"),
      (e.innerHTML =
        "<div>💤</div><p>ครอก… ฟี้… ครอก… ฟี้…</p>"),
      setTimeout(() => {
        (i(), setTimeout(() => e.classList.remove("on"), 600));
      }, 4200));
  }
  var Yp = [];
  function M4(i) {
    let e = l3();
    e.scale.setScalar(1.3);
    let t = new H(-Math.sin(i.dir ?? 0), 0, -Math.cos(i.dir ?? 0)).multiplyScalar(0.9);
    (e.position.copy(i.pos).add(t),
      K.add(e),
      Yp.push({ o: e, t: 120 }),
      (z.potty = 0),
      (j.score += 3),
      ke("pop"),
      rt("💩 โล่งสบาย~", i.pos.clone().setY(1.3), "cool"),
      (Math.abs(i.pos.z) < Mt || i.pos.distanceTo(Ut) < 6) &&
        De(
          "อุ๊ย อึเกะกะทาง เดี๋ยวพี่ ๆ ชาวเมืองช่วยเก็บนะ 😅",
          2400,
        ));
  }
  function ZH(i, e) {
    for (let t = Yp.length - 1; t >= 0; t--) {
      let n = Yp[t];
      (n.sp && (n.o.scale.setScalar(Math.max(0.01, Math.sin(Math.min(1, n.t / 1.4) * Math.PI) * 0.32)), (n.o.position.y += i * 0.35), (n.o.material.rotation += i * 2)), (n.t -= i), n.t < 0 && (K.remove(n.o), Yp.splice(t, 1)));
    }
    (z.potty ?? 0) >= 100 &&
      !Se &&
      !ho &&
      !j.sleeping &&
      (M4(e),
      De(
        "💩 อั้นไม่ไหว! อึออกมาแล้ว… คราวหน้ากดอึก่อนนะ",
        2800,
      ));
  }
  function go(i, e) {
    if (ba(i, e) !== null || Rd(i, e) !== null) return 0;
    let t = Math.hypot(i - kn.x, e - kn.z);
    return t < 7
      ? Math.min(0.45, (7 - t) * 0.22)
      : e > Rt - 1.4 && !(Math.abs(i) < 1.9 && e > Rt - 1.45 && e < Rt + 23.4)
        ? Math.max(0, -Lc(e))
        : 0;
  }
  function KH(i, e) {
    return Math.abs(i) < 1.9 && e > Rt - 1.45 && e < Rt + 23.4 ? 0.36 : mE(i, e);
  }
  function dE(i) {
    return Math.hypot(i.x - kn.x, i.z - kn.z) < 7.5 ? 0.07 : Ph;
  }
  var a0 = new H();
  function JH(i, e) {
    let t = [
      { p: e.pos, v: e.spd, dir: e.dir ?? 0, r: 0.55 },
      ...ml.map((n) => ({ p: n.pos, v: n.spd, dir: n.dir, r: 0.3 })),
      ...Pr.map((n) => ({ p: n.pos, v: n.spd, dir: n.dir ?? 0, r: 0.4 })),
    ];
    for (let n of _d) {
      for (let h of t) {
        let f = n.r ?? 0.45,
          d = n.pos.x - h.p.x,
          u = n.pos.z - h.p.z,
          p = Math.hypot(d, u),
          m = f + h.r;
        if (p < m && p > 0.001) {
          let E = d / p,
            g = u / p,
            y = Math.max(2.5, h.v * 1.35);
          // v93: เตะเฉียง = บอลหมุน (สปิน) แล้วเลี้ยวโค้ง
          let SP = Math.sin(h.dir) * g - Math.cos(h.dir) * E;
          ((n.spin = Math.max(-2.2, Math.min(2.2, (n.spin ?? 0) + SP * h.v * 0.35))),
            (n.vel.x += E * y * 0.6 + Math.sin(h.dir) * h.v * 0.4),
            (n.vel.z += g * y * 0.6 + Math.cos(h.dir) * h.v * 0.4),
            (n.pos.x = h.p.x + E * m),
            (n.pos.z = h.p.z + g * m),
            h.v > 3 && n.y < 0.05 && (n.vy = 2.6 + Math.random() * 1.5),
            h === t[0] && Math.random() < 0.3 && ke("pop"));
        }
      }
      let s = Math.hypot(n.vel.x, n.vel.z);
      (s > 9 && n.vel.multiplyScalar(9 / s), a0.set(n.pos.x + n.vel.x * i, 0, n.pos.z + n.vel.z * i));
      let o = (n.r ?? 0.45) * 0.9;
      if (!(fo && n === fo.ball && EA(n, a0.x, a0.z)))
        if (ri(a0, o)) {
          let h = a0.clone();
          ((h.z = n.pos.z), ri(h, o) && (n.vel.x *= -0.6));
          let f = a0.clone();
          ((f.x = n.pos.x), ri(f, o) && (n.vel.z *= -0.6));
        } else n.pos.copy(a0);
      ccsBallPhys(n, i);
      // v93: แรงเสียดทานตามพื้น — หญ้าสนาม/สนามหญ้า หนืดกว่าพื้นปูน, ทรายหนืดสุด
      let FR = n.y > 0.02 ? 0.995 : n.pos.z > Rt - 6 ? 0.955 : Math.abs(n.pos.x) < 60 && Math.abs(n.pos.z) < Mt + 2.6 ? 0.988 : 0.975,
        r = Math.pow(FR, i * 60);
      (n.vel.multiplyScalar(r),
        (n.vy -= 18 * i),
        (n.y += n.vy * i),
        n.y < 0 && ((n.y = 0), (n.vy = Math.abs(n.vy) > 1.2 ? -n.vy * 0.5 : 0)));
      let a = go(n.pos.x, n.pos.z),
        c = n.r ?? 0.45;
      n.m.position.set(n.pos.x, c + 0.03 + n.y - Math.min(a, 0.2), n.pos.z);
      let l = Math.hypot(n.vel.x, n.vel.z);
      if (l > 0.01) {
        let h = new H(n.vel.z, 0, -n.vel.x).normalize();
        n.m.rotateOnWorldAxis(h, (l * i) / (n.r ?? 0.45));
      }
    }
  }
  // v93: ฟิสิกส์ลูกบอลเพิ่ม — แรงแมกนัส (บอลโค้งตามสปิน), ชนเสาประตู/คานแล้วเด้งตามมุมจริง
  function ccsBallPhys(n, i) {
    let s = n.spin ?? 0;
    if (Math.abs(s) > 0.01) {
      let o = Math.hypot(n.vel.x, n.vel.z);
      (o > 0.5 && ((n.vel.x += -n.vel.z * s * 0.55 * i), (n.vel.z += n.vel.x * s * 0.55 * i)), (n.spin = s * Math.pow(0.35, i)));
    }
    if (!fo || n !== fo.ball) return;
    let o = n.r ?? 0.3,
      r = n.y + o;
    for (let a of tb) {
      let c = a.h ?? 2.2;
      for (let l of [-1, 1]) {
        let h = n.pos.x - a.x0,
          f = n.pos.z - (xt.z + (l * a.w) / 2),
          d = Math.hypot(h, f),
          u = o + 0.07;
        if (d < u && d > 1e-4 && r < c + 0.05) {
          let p = h / d,
            m = f / d,
            E = n.vel.x * p + n.vel.z * m;
          E < 0 &&
            ((n.vel.x -= 1.7 * E * p),
            (n.vel.z -= 1.7 * E * m),
            (n.spin = (n.spin ?? 0) * -0.5),
            Math.abs(E) > 2 && (ke("pop"), rt("🥅 ชนเสา!", n.pos.clone().setY(2), "")));
          ((n.pos.x = a.x0 + p * u), (n.pos.z = xt.z + (l * a.w) / 2 + m * u));
        }
      }
      let g = n.pos.x - a.x0,
        y = r - c;
      if (Math.abs(n.pos.z - xt.z) < a.w / 2 && Math.abs(g) < o + 0.07 && Math.abs(y) < o + 0.07) {
        let x = Math.hypot(g, y) || 1,
          b = g / x,
          w = y / x,
          v = n.vel.x * b + n.vy * w;
        v < 0 &&
          ((n.vel.x -= 1.6 * v * b),
          (n.vy -= 1.6 * v * w),
          Math.abs(v) > 2 && (ke("pop"), rt("🥅 ชนคาน!", n.pos.clone().setY(2.6), "")));
      }
    }
  }
