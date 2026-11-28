  var gi = z,
    hC = [
      "🍞 ลุงปั้มดูกังวล \xB7 ไปคุยที่ร้านขนมปัง",
      "🍗 ถามป้าอู้ดที่ร้านไก่ย่าง ว่าเห็นอะไรไหม",
      "👃 กลับไปดมกลิ่นที่หน้าร้านลุงปั้ม",
      "🐾 ตามรอยเศษขนมปัง แล้วขุดตรงที่กลิ่นแรงสุด",
      "🧺 เอาตะกร้าขนมปังไปคืนลุงปั้ม",
    ],
    Pn = { trail: [], spot: null, mark: null, basket: null, prize: null, t: 0 },
    ol = () => ni.clone().add(new H(Math.sin(In) * 1.6, 0, Math.cos(In) * 1.6)),
    X4 = () => y0.find((i) => i.lines.some((e) => e.includes("ไก่ย่าง")));
  function bd() {
    let i = gi.bq;
    if (i.spot) return new H(i.spot[0], 0, i.spot[1]);
    let e = hn.clone().add(new H(-10, 0, 7)),
      t = new H();
    for (let n = 0; n < 14; n += 0.8)
      for (let s = 0; s < Math.PI * 2; s += Math.PI / 10)
        if ((t.set(e.x + Math.cos(s) * n, 0, e.z + Math.sin(s) * n), !po(t) && !ri(t, 1) && go(t.x, t.z) < 0.01))
          return ((i.spot = [+t.x.toFixed(2), +t.z.toFixed(2)]), t.clone());
    return ((i.spot = [e.x, e.z]), e);
  }
  function ob() {
    let i = ol(),
      e = bd(),
      t = [],
      n = i
        .clone()
        .lerp(e, 0.5)
        .add(new H(6, 0, -4));
    for (let [s, o] of [
      [i, n],
      [n, e],
    ]) {
      let r = Math.ceil(s.distanceTo(o) / 1.4);
      for (let a = 0; a < r; a++) {
        let c = s.clone().lerp(o, a / r);
        ((c.x += Math.sin(a * 0.9) * 0.6), (c.z += Math.cos(a * 0.7) * 0.6), t.push(c.setY(0)));
      }
    }
    (t.push(e.clone()), (Pn.trail = t));
  }
  function dC(i) {
    let e = document.createElement("canvas");
    e.width = e.height = 128;
    let t = e.getContext("2d");
    return (
      (t.fillStyle = "#ffd23f"),
      (t.strokeStyle = "#7a4a00"),
      (t.lineWidth = 8),
      t.beginPath(),
      t.arc(64, 64, 52, 0, 7),
      t.fill(),
      t.stroke(),
      (t.fillStyle = "#5a3200"),
      (t.font = "bold 78px sans-serif"),
      (t.textAlign = "center"),
      (t.textBaseline = "middle"),
      t.fillText(i, 64, 70),
      new ut(e)
    );
  }
  var N3 = {};
  function fC() {
    let i = gi.bq;
    if (!i || i.done) return { p: (md?.root.position ?? ni).clone(), h: 2.6, ic: "!" };
    if (i.s === 0 || i.s === 4) return { p: (md?.root.position ?? ni).clone(), h: 2.6, ic: i.s === 4 ? "?" : "!" };
    if (i.s === 1) {
      let e = X4();
      return e ? { p: e.at.clone(), h: 2.6, ic: "?" } : null;
    }
    return i.s === 2 ? { p: ol(), h: 1.4, ic: "👃" } : i.s === 3 ? { p: bd(), h: 1.2, ic: "⛏" } : null;
  }
  function rb() {
    let i = document.getElementById("sideChip");
    if (!i) return;
    let e = gi.bq,
      t = !!e && !e.done && j.started;
    (i.classList.toggle("on", t), t && (i.innerHTML = `${hC[e.s]} <b>(${e.s + 1}/5)</b>`));
  }
  function uC() {
    gi.bq || ((gi.bq = { s: 0 }), rb());
  }
  function Up(i, e) {
    let t = gi.bq;
    ((t.s = i), ke("heart"), De(e, 4200), rb(), _t(z));
  }
  function Y4() {
    if (Pn.prize || !gi.bq?.done) return;
    Pn.prize = !0; // v106: ไม่ตั้งป้ายขอบคุณกลางทาง (บันทึกไว้ในสมุดภารกิจแทน)
    let o = y0.find((a) => a.rig === md),
      r = pl[0].name;
    o &&
      o.lines.push(
        `${r} มาแล้ว! ฮีโร่ตามหาขนมปังของลุง 🐶`,
        `ขอบใจนะ${r} ตะกร้านั้นลุงใช้มายี่สิบปีแล้ว`,
        `${r} ซื้อขนมปังลดให้ 20% ตลอดไปเลย!`,
      );
  }
  var G3 = () => (gi.bq?.done ? 0.8 : 1);
  function pC(i, e) {
    var n;
    if (!j.started) return;
    ((Pn.t += i), !gi.bq && j.time > 0.27 && j.time < 0.75 && !Se && uC(), gi.bq?.done && Y4());
    let t = gi.bq && !gi.bq.done ? fC() : null;
    if (
      (Pn.mark ||
        ((Pn.mark = new zi(new vi({ depthTest: !1, transparent: !0 }))),
        Pn.mark.scale.set(0.7, 0.7, 1),
        (Pn.mark.renderOrder = 5),
        (Pn.mark.userData.noOcc = !0),
        K.add(Pn.mark)),
      (Pn.mark.visible = !!t && !Se),
      t)
    ) {
      let s = N3[(n = t.ic)] ?? (N3[n] = dC(t.ic));
      (Pn.mark.material.map !== s && ((Pn.mark.material.map = s), (Pn.mark.material.needsUpdate = !0)),
        Pn.mark.position.set(t.p.x, t.h + Math.sin(Pn.t * 3) * 0.12, t.p.z));
    }
    gi.bq && gi.bq.s === 3 && !Pn.trail.length && ob();
  }
  function mC(i, e, t, n, s, o) {
    !gi.bq ||
      gi.bq.done ||
      gi.bq.s !== 3 ||
      (Pn.trail.length || ob(),
      Pn.trail.forEach((r, a) => {
        if (r.distanceTo(s) > 50) return;
        let c = e(r.x, 0.18, r.z);
        if (!c) return;
        let l = Math.max(3, o.distanceTo(r)),
          h = 0.35 + 0.65 * Math.max(0, Math.sin(a * 0.5 - n * 4.5));
        (t(c[0], c[1], Math.max(9, (85 / l) * 6), "rgba(255,170,70,1)", 0.75 * h),
          a % 4 === 0 &&
            h > 0.6 &&
            ((i.globalCompositeOperation = "source-over"),
            (i.globalAlpha = 0.95),
            (i.font = `${Math.round(Math.max(14, Math.min(28, 240 / l)))}px sans-serif`),
            (i.textAlign = "center"),
            i.fillText("🍞", c[0], c[1] - 8),
            (i.globalCompositeOperation = "lighter")));
      }));
  }
  function Z4(i) {
    let e = gi.bq;
    if (!e || e.done) return !1;
    let t = md?.root.position ?? ni,
      n = i.distanceTo(t) < 2.6 || i.distanceTo(ol()) < 1.9;
    if (e.s === 0 && n)
      return (
        nt("❗ คุยกับลุงปั้ม", () => {
          (Ln(
            ni.clone().setY(2.4),
            "แย่แล้ว! ตะกร้าขนมปังที่ลุงวางไว้หน้าร้านหายไปทั้งตะกร้าเลย 😢",
          ),
            Up(
              1,
              "🍞 เควสใหม่: ขนมปังของลุงปั้มหายไปไหน \xB7 ลองไปถามป้าอู้ดที่ร้านไก่ย่างดูว่าเห็นอะไรไหม",
            ));
        }),
        !0
      );
    if (e.s === 1) {
      let s = X4();
      if (s && i.distanceTo(s.at) < 2.8)
        return (
          nt("❓ ถามป้าอู้ด", () => {
            (Ln(
              s.at.clone().setY(2.3),
              "เมื่อเช้าป้าเห็นนกนางนวลบินวนหน้าร้านลุงปั้ม แล้วมีอะไรวิ่งตามไปทางสวนสายรุ้งนะ!",
            ),
              Up(
                2,
                "🍗 ป้าอู้ดเห็นนกนางนวลกับอะไรบางอย่างวิ่งไปทางสวนสายรุ้ง \xB7 กลับไปดมกลิ่นที่หน้าร้านลุงปั้ม",
              ));
          }),
          !0
        );
    }
    return e.s === 2 && i.distanceTo(ol()) < 2.2
      ? (nt(
          "👃 ดมกลิ่นที่หน้าร้าน",
          () => {
            (ob(),
              cn.on || xa(!0),
              rt(
                "👃 กลิ่นเศษขนมปัง!",
                ol().setY(1.6),
                "big",
              ),
              Ai("sniff"),
              Up(
                3,
                "👃 เจอกลิ่นเศษขนมปัง 🍞 เป็นทาง \xB7 ตามจุดสีส้มไป แล้วขุดตรงที่กลิ่นแรงที่สุด",
              ));
          },
        ),
        !0)
      : e.s === 3 && i.distanceTo(bd()) < 2
        ? (nt(
            "⛏ ขุดตรงที่กลิ่นขนมปังแรงสุด",
            () => {
              let s = bd();
              if ((ke("dig"), Ai("dig"), Rs(10, Le[0]), ze("breadbasket_0"))) {
                let o = je("breadbasket_0", 0.42);
                (o.position.copy(s),
                  K.add(o),
                  (Pn.basket = o),
                  setTimeout(() => {
                    Pn.basket && (K.remove(Pn.basket), (Pn.basket = null));
                  }, 4e3));
              }
              (rt(
                "🧺 เจอตะกร้าขนมปัง!",
                s.clone().setY(1.4),
                "big",
              ),
                (Pn.trail = []),
                cn.on && xa(!1),
                Up(
                  4,
                  "🧺 เจอตะกร้าขนมปังฝังอยู่ใต้พุ่มไม้ มีขนนกนางนวลติดอยู่ด้วย! คาบกลับไปคืนลุงปั้มกัน",
                ));
            },
          ),
          !0)
        : e.s === 4 && n
          ? (nt(
              "🧺 คืนตะกร้าให้ลุงปั้ม",
              () => {
                ((e.done = !0),
                  (z.money += 150),
                  Rs(60, Le[0]),
                  (j.score += 20),
                  ke("quest"),
                  Ai("greet"),
                  Ln(
                    ni.clone().setY(2.4),
                    `ตะกร้าของลุง! ${pl[0].name} เก่งที่สุดเลย ต่อไปนี้ซื้อขนมปังลด 20% ตลอดไปนะ 🥐`,
                  ),
                  De(
                    "🏆 สำเร็จภารกิจ! +150💰 +60 EXP \xB7 ดูได้ในสมุด 📋",
                    3e3,
                  ),
                  rb(),
                  Y4(),
                  _t(z));
              },
            ),
            !0)
          : !1;
  }
  var gC = {
      paw: {
        t: "🔥 พื้นร้อน อุ้งเท้าพองได้",
        body: "ตอนแดดจัด พื้นยางมะตอยและพื้นปูนร้อนกว่าอากาศมาก อุ้งเท้าหมาพองหรือไหม้ได้<br>👋 <b>ทดสอบง่าย ๆ:</b> วางหลังมือบนพื้น 7 วินาที ถ้าเรายังทนไม่ไหว น้องก็ทนไม่ไหว<br>🌅 พาเดินช่วงเช้าหรือเย็น เดินบนหญ้า และพกน้ำไปด้วย<br>🐻 เชาเชาขนหนา ร้อนง่ายกว่าหมาทั่วไป ถ้าหอบหนัก ลิ้นแดงจัด ซึม ให้พาเข้าที่เย็นแล้วรีบไปหาสัตวแพทย์",
      },
    },
    P6 = [
      {
        id: "choc",
        name: "ช็อกโกแลต",
        icon: "🍫",
        bad: !0,
        why: "ช็อกโกแลตมีสารธีโอโบรมีนที่หมาขับออกได้ช้า ทำให้อาเจียน ใจเต้นเร็ว ชักได้ ยิ่งดาร์กช็อกโกแลตยิ่งอันตราย",
      },
      {
        id: "grape",
        name: "องุ่น",
        icon: "🍇",
        bad: !0,
        why: "องุ่นและลูกเกดทำให้หมาไตวายเฉียบพลันได้ แม้กินไม่มาก",
      },
      {
        id: "onion",
        name: "ลูกชิ้นผัดหัวหอมกระเทียม",
        icon: "🧅",
        bad: !0,
        why: "หัวหอมและกระเทียม ทั้งดิบและสุก ทำลายเม็ดเลือดแดงของหมา ทำให้โลหิตจาง",
      },
      {
        id: "gum",
        name: "หมากฝรั่งไม่มีน้ำตาล",
        icon: "🍬",
        bad: !0,
        why: "ขนมไม่มีน้ำตาลหลายอย่างใส่ไซลิทอล ทำให้น้ำตาลในเลือดหมาตกเร็วมาก อันตรายถึงชีวิต",
      },
      {
        id: "carrot",
        name: "แครอทหั่นชิ้น",
        icon: "🥕",
        bad: !1,
        why: "แครอทหั่นชิ้นเล็ก ไม่ปรุงรส ให้เป็นขนมได้ กรอบ ๆ ช่วยขัดฟันด้วย",
      },
      {
        id: "apple",
        name: "แอปเปิลหั่น (ไม่มีเมล็ด)",
        icon: "🍎",
        bad: !1,
        why: "แอปเปิลหั่นที่เอาเมล็ดและแกนออกแล้ว ให้กินได้เล็กน้อย",
      },
      {
        id: "chicken",
        name: "อกไก่ต้มไม่ปรุง",
        icon: "🍗",
        bad: !1,
        why: "อกไก่ต้มไม่ใส่เกลือ ไม่มีกระดูก เป็นขนมที่ปลอดภัย (แต่ไก่ทอด/ไก่ย่างปรุงรส ไม่ควรให้)",
      },
    ],
    K4 =
      '<p class="note">🩺 ถ้าน้องกินของอันตรายเข้าไปจริง ให้รีบโทรปรึกษาสัตวแพทย์ทันที อย่ารอดูอาการ</p>';
  function EC(i) {
    let e = gC[i];
    e &&
      (Ai("care"),
      (bi.careSeen = [...new Set([...(bi.careSeen ?? []), i])]),
      Gi(
        "ความรู้ดูแลน้องจริง 🐾",
        `<div class="care"><h3>${e.t}</h3><p>${e.body}</p></div><button class="bigbtn" id="careOk">เข้าใจแล้ว</button>`,
      ),
      it("careOk").addEventListener("click", qs));
  }
  function J4(i, e) {
    let t = P6[Math.floor(Math.random() * P6.length)];
    ((bi.offerDay = I0()),
      Ln(
        i.pos,
        `น้องกิน${t.name}มั้ยจ๊ะ ${t.icon}`,
      ),
      Gi(
        `${i.name ?? "ชาวเมือง"} ยื่นของให้`,
        `<div class="care"><div class="big">${t.icon}</div><p><b>${i.name ?? "ชาวเมือง"}:</b> "น้องกิน${t.name}มั้ยจ๊ะ"</p><p class="note">หมากินได้มั้ยนะ? เลือกให้ดี</p></div>
    <div class="offerBtns"><button class="bigbtn" id="ofEat">😋 กินเลย</button><button class="bigbtn ghost" id="ofNo">🙅 ส่ายหน้า ไม่กิน</button></div>`,
      ));
    let n = (s) => {
      let o = "";
      (t.bad && s
        ? ((z.energy = Math.max(0, (z.energy ?? 100) - 35)),
          (z.hunger = Math.max(0, (z.hunger ?? 100) - 10)),
          ke("nope"),
          rt("🤢", e.pos.clone().setY(1.6), "bad"),
          (o = `🤢 ไม่น่ากินเลย! ${t.name}อันตรายสำหรับหมา น้องปวดท้อง พลังลด`))
        : t.bad
          ? (Ai("care"),
            Rs(15, e),
            (j.score += 3),
            ke("heart"),
            rt("👍 เก่งมาก!", e.pos.clone().setY(1.6), "big"),
            (o = `👍 ถูกต้อง! ${t.name}อันตรายสำหรับหมา (+15 EXP)`))
          : s
            ? (Ai("care"),
              mi(10, 0),
              Rs(8, e),
              ke("pop"),
              rt("😋", e.pos.clone().setY(1.6)),
              (o = `😋 อร่อย! ${t.name}หมากินได้ (+8 EXP)`))
            : (o = `🤔 จริง ๆ ${t.name}หมากินได้นะ`),
        (Ea.innerHTML = `<div class="care"><div class="big">${t.icon}</div><h3>${o}</h3><p>${t.why}</p></div>${t.bad ? K4 : ""}<button class="bigbtn" id="careOk">เข้าใจแล้ว</button>`),
        it("careOk").addEventListener("click", qs),
        _t(z));
    };
    (it("ofEat").addEventListener("click", () => n(!0)), it("ofNo").addEventListener("click", () => n(!1)));
  }
  var ws = { heat: 0, warned: !1, popT: 0 };
  function Q4(i, e) {
    if (!j.started || Se || j.sleeping) {
      ws.heat = 0;
      return;
    }
    (z.season === 0 && j.time > 0.42 && j.time < 0.68 && po(e.pos)
      ? (ws.heat += i * vC())
      : (ws.heat = Math.max(0, ws.heat - i * 2)),
      ws.heat > 5 &&
        !ws.warned &&
        ((ws.warned = !0),
        De(
          "🔥 พื้นถนนร้อนจัด! อุ้งเท้าน้องร้อนมาก รีบไปเดินบนหญ้าหรือที่ร่ม",
          3400,
        ),
        rt("🔥🐾", e.pos.clone().setY(1.4), "bad")),
      ws.heat > 10 &&
        ((z.energy = Math.max(0, (z.energy ?? 100) - i * 1.5)),
        (ws.popT -= i) < 0 && ((ws.popT = 1.6), rt("🥵", e.pos.clone().setY(1.6), "bad")),
        (bi.careSeen ?? []).includes("paw") || EC("paw")),
      ws.heat === 0 && (ws.warned = !1));
  }
  var bC = "https://bemlqajyipfxlhpingnl.supabase.co",
    I6 = "sb_publishable_-AF9Ogu0P4SXMNfmvYo6AA_0nwozbTe",
    eT = [
      "ตรงนี้มีของ! 👃",
      "ระวังรถนะ 🚗",
      "วิวสวยมาก 🌅",
      "ไก่ย่างอร่อย 🍗",
      "มาเล่นด้วยกัน 🐾",
      "นั่งพักตรงนี้ดี 🪑",
      "ขุดตรงนี้เลย ⛏",
      "ทางลัด ➡️",
      "ร้อนมาก เดินบนหญ้า 🔥",
      "ไปทะเลกัน 🌊",
      "คิดถึงทุกคน 💕",
      "สู้ ๆ นะ 💪",
    ];
  function f1() {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        let e = localStorage.key(i) ?? "";
        if (!/^sb-.+-auth-token$/.test(e)) continue;
        let t = JSON.parse(localStorage.getItem(e) ?? "null"),
          n = t?.access_token;
        if (n && (t.expires_at ?? 0) * 1e3 > Date.now() + 3e4) return { t: n };
      }
    } catch {}
    return null;
  }
  async function xd(i, e, t) {
    return fetch(`${bC}/rest/v1/${i}`, {
      ...e,
      headers: {
        apikey: I6,
        Authorization: `Bearer ${t?.t ?? I6}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
        ...(e?.headers ?? {}),
      },
    });
  }
  var en = { rec: [], recT: 0, walks: [], live: [], fetchT: 2, spawnT: 4, notes: [], server: !1, used: new Set() };
  function tT(i, e = "rgba(255,255,255,.85)", t = "#241C15", n = 0.42) {
    let s = document.createElement("canvas"),
      o = s.getContext("2d");
    o.font = "600 30px Mitr, sans-serif";
    let r = Math.ceil(o.measureText(i).width) + 28;
    ((s.width = r),
      (s.height = 46),
      (o.font = "600 30px Mitr, sans-serif"),
      (o.fillStyle = e),
      o.beginPath(),
      o.roundRect(1, 1, r - 2, 44, 20),
      o.fill(),
      (o.fillStyle = t),
      (o.textBaseline = "middle"),
      o.fillText(i, 14, 24));
    let a = new ut(s);
    a.colorSpace = Ye;
    let c = new zi(new vi({ map: a, transparent: !0, depthWrite: !1 }));
    return (c.scale.set((n * r) / 46, n, 1), (c.renderOrder = 5), c);
  }
  var _E = "ccs-ghosts",
    SE = "ccs-notes";
  function u1(i) {
    try {
      return JSON.parse(localStorage.getItem(i) ?? "[]");
    } catch {
      return [];
    }
  }
  function nT(i, e) {
    try {
      localStorage.setItem(i, JSON.stringify(e));
    } catch {}
  }
  function ab() {
    // v124: เลิกใช้ระบบวิญญาณเงา (ไม่บันทึก/ไม่อัปโหลดเส้นทางเดินแล้ว)
    if (((en.rec = []), !0)) return;
    let i = en.rec;
    if (((en.rec = []), i.length < 30)) return;
    let e = { dog_name: pl[0].name, coat: z.coat ?? "orange", pts: i };
    nT(_E, [e, ...u1(_E)].slice(0, 6));
    let t = f1();
    t && xd("ghost_walks", { method: "POST", body: JSON.stringify(e) }, t).catch(() => {});
  }
  async function xC() {
    let i = [],
      e = [],
      t = [];
    try {
      localStorage.removeItem(_E);
    } catch {}
    try {
      let s = await xd("paw_notes?select=dog_name,x,z,msg&order=created_at.desc&limit=40");
      s.ok && (t = await s.json());
    } catch {}
    en.walks = [...e, ...i];
    for (let s of en.notes) s.s && K.remove(s.s);
    let n = u1(SE);
    en.notes = [
      ...t,
      ...n.filter((s) => !t.some((o) => Math.abs(o.x - s.x) < 0.05 && Math.abs(o.z - s.z) < 0.05)),
    ].slice(0, 50);
    for (let s of en.notes) iT(s);
  }
  function iT(i) {
    let e = tT(`🐾 ${eT[i.msg] ?? ""}`, "rgba(255,246,229,.92)", "#7a4a24", 0.36);
    (e.position.set(i.x, 0.7, i.z), (e.userData.noOcc = !0), (e.visible = !1), (i.s = e), K.add(e));
  }
  function yC() {
    let i = Le[0];
    if (Se) {
      De(
        "ฝากข้อความได้เฉพาะข้างนอกนะ",
        2e3,
      );
      return;
    }
    (Gi(
      "🐾 ฝากข้อความตรงนี้",
      `<p class="note">เพื่อนที่เล่นเกมนี้จะเห็นข้อความตรงจุดที่น้องยืนอยู่${f1() ? "" : "<br>⚠️ ยังไม่ได้ล็อกอินในแอป: ตอนนี้เห็นแค่ในเครื่องนี้"}</p><div class="notes">${eT.map((e, t) => `<button data-m="${t}">${e}</button>`).join("")}</div>`,
    ),
      Ea.querySelectorAll("[data-m]").forEach((e) =>
        e.addEventListener("click", () => {
          let t = { x: +i.pos.x.toFixed(2), z: +i.pos.z.toFixed(2), msg: +e.dataset.m, dog_name: pl[0].name };
          (nT(SE, [t, ...u1(SE)].slice(0, 20)), iT(t), en.notes.push(t));
          let n = f1();
          (n &&
            xd(
              "paw_notes",
              { method: "POST", body: JSON.stringify({ dog_name: t.dog_name, x: t.x, z: t.z, msg: t.msg }) },
              n,
            )
              .then((s) => {
                s.ok ||
                  De(
                    "ส่งข้อความถี่เกินไป รอสักครู่นะ",
                    2200,
                  );
              })
              .catch(() => {}),
            qs(),
            ke("pop"),
            rt("🐾", i.pos.clone().setY(1.4)),
            De(
              "ฝากข้อความไว้แล้ว 🐾",
              1800,
            ));
        }),
      ));
  }
  function MC(i) {
    if (!Fc()) return;
    let e = null,
      t = 1e9;
    for (let r of en.walks)
      if (!(en.used.has(r) || en.live.some((a) => a.w === r)))
        for (let a = 0; a < r.pts.length - 15; a += 3) {
          let c = Math.hypot(r.pts[a][0] / 10 - i.pos.x, r.pts[a][1] / 10 - i.pos.z);
          c > 9 && c < 32 && c < t && ((t = c), (e = { w: r, i: a }));
        }
    if (!e) return;
    let n = ui(o0[e.w.coat] ? e.w.coat : "orange", 0.72);
    n.root.traverse((r) => {
      let a = r;
      if (a.isMesh) {
        ((a.castShadow = !1), (a.userData.noOcc = !0));
        for (let c of Array.isArray(a.material) ? a.material : [a.material])
          ((c.transparent = !0), (c.opacity = 0), (c.depthWrite = !1));
      }
    });
    let s = tT(
      e.w.own
        ? `👻 ${e.w.dog_name} (เงาของฉัน)`
        : `👻 ${e.w.dog_name}`,
      "rgba(220,235,255,.9)",
      "#2b4a7a",
      0.5,
    );
    (K.add(n.root), K.add(s), en.used.add(e.w));
    let o = e.w.pts[e.i];
    en.live.push({
      rig: n,
      w: e.w,
      i: e.i,
      f: 0,
      pos: new H(o[0] / 10, 0, o[1] / 10),
      label: s,
      a: 0,
      spd: 0,
      dir: null,
    });
  }
  function sT(i, e) {
    if (j.started) {
      if (((en.fetchT -= i) < 0 && ((en.fetchT = 300), xC()), !1)) {
        en.recT = 1;
        let t = en.rec[en.rec.length - 1],
          n = Math.round(e.pos.x * 10),
          s = Math.round(e.pos.z * 10);
        ((!t || Math.hypot(t[0] - n, t[1] - s) > 4) && en.rec.push([n, s]), en.rec.length >= 200 && ab());
      }
      // v124: ไม่เรียกวิญญาณเงาออกมาแล้ว · ลบตัวที่ค้างอยู่ทิ้ง
      for (let t of en.live.splice(0)) (K.remove(t.rig.root), K.remove(t.label));
      for (let t = en.live.length - 1; t >= 0; t--) {
        let n = en.live[t],
          s = n.w.pts;
        for (n.f += i; n.f >= 1 && n.i < s.length - 1;) ((n.f -= 1), n.i++);
        let o = n.i >= s.length - 1 || Se,
          r = s[Math.min(n.i, s.length - 1)],
          a = s[Math.min(n.i + 1, s.length - 1)],
          c = (r[0] + (a[0] - r[0]) * n.f) / 10,
          l = (r[1] + (a[1] - r[1]) * n.f) / 10,
          h = c - n.pos.x,
          f = l - n.pos.z,
          d = Math.hypot(h, f);
        ((n.spd = Math.min(3, d / Math.max(i, 0.001))),
          (n.dir = d > 0.01 ? Math.atan2(h, f) : n.dir),
          n.pos.set(c, 0, l),
          n.rig.root.position.copy(n.pos),
          Qi(n.rig, i, n.spd > 0.2 ? n.spd : 0, n.dir),
          n.label.position.set(n.pos.x, 1.75, n.pos.z),
          (n.a = Math.max(0, Math.min(1, n.a + (o ? -i : i) * 1.2))));
        let u = n.a * 0.55;
        (n.rig.root.traverse((p) => {
          let m = p;
          if (m.isMesh) for (let E of Array.isArray(m.material) ? m.material : [m.material]) E.opacity = u;
        }),
          (n.label.material.opacity = n.a),
          o && n.a <= 0 && (K.remove(n.rig.root), K.remove(n.label), en.live.splice(t, 1)));
      }
      for (let t of en.notes) t.s && (t.s.visible = !Se && Math.hypot(t.x - e.pos.x, t.z - e.pos.z) < 18);
    }
  }
  addEventListener("visibilitychange", () => {
    document.hidden && (ab(), _t(z));
  });
  addEventListener("pagehide", () => _t(z));
  it("sniffBtn").addEventListener("click", () => xa());
  it("noteBtn").addEventListener("click", () => yC());
  it("albumBtn")?.addEventListener("click", () => ccsAlbum());
  it("photoBtn")?.addEventListener("click", () => ccsPhotoAlbum());
  it("dexBtn")?.addEventListener("click", () => ccsDexOpen());
  it("warpBtn")?.addEventListener("click", () => ccsWarpMenu());
  it("compBtn")?.addEventListener("click", () => ccsCompToggle());
  addEventListener("keydown", (i) => {
    (i.key === "p" || i.key === "P") && j.started && !C0() && ccsSnapSoon(`${pl[0]?.name ?? "น้อง"} เที่ยวเล่น`, 0.05);
  });
  it("cmdBtn")?.addEventListener("click", () => ccsCmdMenu());
  it("statBtn")?.addEventListener("click", () => Gi("📊 พลังน้อง", `<div class="stbars">${ccsStatBars()}</div><p class="note">ฝึกเพิ่มได้กับครูฝึกพี่ต้นที่สนามฝึก</p>`));
  it("questBtn").addEventListener("click", () => {
    (ke("pop"), Rr());
  });
  addEventListener("keydown", (i) => {
    ((i.key === "c" || i.key === "C") && j.started && !C0() && Rr(),
      (i.key === "Home" || i.key === "v" || i.key === "V") && j.started && !C0() && ud(!0));
  });
  addEventListener("keydown", (i) => {
    (i.key === "n" || i.key === "N") && j.started && !C0() && xa();
  });
  var TC = ["nose", "dig", "det", "luck", "speed", "stam", "charm", "heat"],
    rl = {
      nose: {
        ic: "👃",
        n: "จมูกไว",
        d: "ของฝังดินต่อวัน +1 \xB7 ดมได้ไกลขึ้น \xB7 แต้ม 3 ขึ้นไปมีเข็มทิศชี้ของ",
      },
      dig: {
        ic: "⛏",
        n: "ขุดเก่ง",
        d: "ขุดใช้พลังน้อยลง \xB7 แต้ม 2 ขึ้นไปมีโอกาสได้ของแถม",
      },
      det: {
        ic: "🕵️",
        n: "นักสืบ",
        d: "รางวัลคดี +15💰/แต้ม \xB7 แต้ม 2 จับผิดได้อีก 1 ครั้ง \xB7 แต้ม 4 รอยหลอกจางลง",
      },
      luck: {
        ic: "🍀",
        n: "โชคดี",
        d: "ขุดเจอสมบัติ 💎 บ่อยขึ้น \xB7 กล่องของขวัญได้ของหายากบ่อยขึ้น",
      },
      speed: {
        ic: "⚡",
        n: "ขาไว",
        d: "เดินและวิ่งเร็วขึ้น 5%/แต้ม",
      },
      stam: {
        ic: "💪",
        n: "อึดทน",
        d: "พลังลดช้าลง 8%/แต้ม",
      },
      charm: {
        ic: "💖",
        n: "เสน่ห์",
        d: "ซื้อของได้ส่วนลด 4%/แต้ม (สูงสุด 20%)",
      },
      heat: {
        ic: "❄️",
        n: "ทนร้อน",
        d: "อุ้งเท้าร้อนช้าลง \xB7 แต้ม 3 เดินถนนตอนแดดจัดได้สบาย",
      },
    },
    wC = {
      "dw:col_red": { charm: 1 },
      "dw:col_blue": { charm: 1, luck: 1 },
      "dw:col_pink": { charm: 2 },
      "dw:col_black": { det: 1 },
      "dw:col_green": { nose: 1 },
      "dw:tee_red": { speed: 1 },
      "dw:stripe_navy": { stam: 1 },
      "dw:dots_pink": { charm: 1 },
      "dw:check_brown": { det: 1 },
      "dw:bee": { luck: 1 },
      "dw:raincoat": { stam: 1 },
      "dw:hoodie": { stam: 1, charm: 1 },
      "dw:pirate": { luck: 2 },
      "dw:dots_blue": { heat: 1 },
      "dw:shoe_red": { speed: 2 },
      "dw:shoe_blue": { speed: 1, stam: 1 },
      "dw:shoe_yellow": { dig: 1, heat: 1 },
      "dw:shoe_pink": { charm: 1, speed: 1 },
      "dw:shoe_black": { det: 1 },
      "dw:col_sniff": { nose: 2 },
      "dw:col_gold": { luck: 2, charm: 1 },
      "dw:col_crown": { nose: 1, dig: 1, det: 1, luck: 1, speed: 1, stam: 1, charm: 1, heat: 1 },
      "dw:folk_santa": { charm: 2, luck: 1 },
      "dw:folk_bee": { speed: 2, stam: 1 },
      "dw:folk_jester": { charm: 2, luck: 2 },
      "dw:folk_viking": { stam: 2, dig: 1, heat: 1 },
      "dw:folk_pirate": { det: 2, luck: 1, nose: 1 },
      "dw:folk_dino": { dig: 2, nose: 1 },
      "dw:folk_overall": { dig: 2 },
      "dw:folk_flannel": { stam: 1, dig: 1 },
      "dw:folk_puffer": { stam: 2 },
      "dw:folk_rocker": { speed: 1, charm: 1, det: 1 },
      "dw:kick_pompom": { charm: 1, stam: 1 },
      "dw:kick_frog": { charm: 2 },
      "dw:kick_sandal": { speed: 1, heat: 1 },
      "dw:kick_skate": { speed: 2 },
      "dw:kick_work": { dig: 2 },
      "dw:kick_red": { speed: 1, charm: 1 },
      "dw:kick_pink": { speed: 1, stam: 1 },
      "dw:kick_santa": { heat: 3 },
      "dw:kick_viking": { speed: 3 },
    },
    oT = (i) => wC[i] ?? (i.startsWith("cc:") ? ccsHatStat[i.slice(3)] ?? { charm: 1 } : {}),
    A0 = (i) =>
      Object.entries(oT(i))
        .map(([e, t]) => `${rl[e].ic}+${t}`)
        .join(" ") + (i.startsWith("cc:") && ccsHatGim[i.slice(3)] ? ` · ${ccsHatGim[i.slice(3)][1]}` : ""),
    xn = z;
  function cb() {
    let i = {};
    for (let e of Object.values(Ar())) for (let [t, n] of Object.entries(oT(e))) i[t] = (i[t] ?? 0) + (n ?? 0);
    for (let [e, t] of Object.entries(ccsSetBonus())) i[e] = (i[e] ?? 0) + t;
    return i;
  }
  var fs = (i) => (cb()[i] ?? 0) + (xn.skills?.[i] ?? 0),
    Kc = () =>
      Math.max(0, Ma().lvl - 1 + (xn.bonusSP ?? 0) - Object.values(xn.skills ?? {}).reduce((i, e) => i + (e ?? 0), 0)),
    U3 = { t: -1, speed: 0, stam: 0 };
  function rT(i) {
    return (U3.t !== TE && (U3 = { t: TE, speed: fs("speed"), stam: fs("stam") }), U3[i]);
  }
  var aT = () => 1 + 0.05 * Math.min(10, rT("speed")),
    F6 = () => Math.max(0.4, 1 - 0.08 * rT("stam")),
    vC = () => Math.max(0, 1 - 0.34 * fs("heat")),
    RC = () => Math.min(0.2, 0.04 * fs("charm"));
  function p1(i, e = "") {
    let t = z.hats ?? (z.hats = []);
    if (t.includes(i)) {
      ((z.money += 60),
        De(
          `มี${_n[i]?.name ?? "ของ"}แล้ว แลกเป็น 60💰 แทน`,
          2400,
        ));
      return;
    }
    (t.push(i),
      ke("heart"),
      rt(`🎁 ${_n[i]?.icon ?? ""} ${_n[i]?.name ?? i}`, Le[0].pos.clone().setY(2.2), "big"),
      De(
        `${e}ได้ ${_n[i]?.icon ?? ""} ${_n[i]?.name ?? i} (${A0(i)}) \xB7 ใส่ได้ที่ 👗 ตู้เสื้อผ้า`,
        3600,
      ));
  }
  function Ai(i, e = 1) {
    let t = xn.stats ?? (xn.stats = {});
    ((t[i] = (t[i] ?? 0) + e), p0(!0));
  }
  var C1 = (i) =>
      i === "lvl" ? Ma().lvl : i === "case" ? Math.max(xn.stats?.case ?? 0, bi.casesSolved ?? 0) : (xn.stats?.[i] ?? 0),
    nd = [
      {
        t: "จมูกตื่นแล้ว",
        d: "กดปุ่ม 👃 เปิดโหมดดมกลิ่นครั้งแรก",
        ev: "sniff",
        n: 1,
        money: 30,
        gear: "dw:col_sniff",
      },
      {
        t: "นักขุดมือใหม่",
        d: "ตามควันสีทอง ขุดของที่ฝังดิน 3 ครั้ง",
        ev: "dig",
        n: 3,
        money: 50,
        gear: "dw:folk_dino",
      },
      {
        t: "รู้จักเพื่อนบ้าน",
        d: "ทักทายชาวเมือง 8 ครั้ง",
        ev: "greet",
        n: 8,
        money: 60,
        sp: 1,
      },
      {
        t: "คดีแรกของเชาเชา",
        d: "ไขคดีประจำวันให้สำเร็จ 1 คดี",
        ev: "case",
        n: 1,
        money: 80,
        gear: "dw:folk_pirate",
      },
      {
        t: "หมารู้ดี",
        d: "ตอบเรื่องอาหารหมาให้ถูก หรืออ่านความรู้ดูแลน้อง 3 ครั้ง",
        ev: "care",
        n: 3,
        money: 80,
        gear: "dw:kick_santa",
      },
      {
        t: "ฝึกจนเก่ง",
        d: "เลเวลฝึกถึง Lv.4",
        ev: "lvl",
        n: 4,
        money: 100,
        gear: "dw:folk_bee",
      },
      {
        t: "ล่าสมบัติ",
        d: "ขุดเจอสมบัติ 💎 1 ครั้ง (ใส่ของ 🍀 โชคช่วยได้)",
        ev: "treasure",
        n: 1,
        money: 120,
        gear: "dw:col_gold",
      },
      {
        t: "นักสืบประจำเมือง",
        d: "ไขคดีสำเร็จรวม 5 คดี",
        ev: "case",
        n: 5,
        money: 200,
        gear: "dw:folk_viking",
        gear2: "dw:kick_viking",
        sp: 1,
      },
      {
        t: "เพื่อนของทุกคน",
        d: "ทักทายชาวเมืองรวม 40 ครั้ง",
        ev: "greet",
        n: 40,
        money: 150,
        gear: "dw:folk_jester",
      },
      {
        t: "ราชาแห่งเมืองเชาเชา",
        d: "เลเวล 10 และไขคดีรวม 10 คดี",
        ev: "case",
        n: 10,
        lvl: 10,
        money: 500,
        gear: "dw:col_crown",
        sp: 2,
      },
    ],
    HE = (i) => C1(i.ev) >= i.n && (!i.lvl || Ma().lvl >= i.lvl),
    _C = [
      [
        "dig",
        2,
        "ขุดของที่ฝังดิน 2 ครั้ง",
        40,
      ],
      [
        "greet",
        4,
        "ทักทายชาวเมือง 4 ครั้ง",
        30,
      ],
      ["egg", 2, "เก็บไข่ไก่ 2 ฟอง", 35],
      ["fish", 1, "ตกปลาได้ 1 ตัว", 40],
      [
        "goal",
        1,
        "ยิงประตูฟุตบอลให้ทีมเชาเชา 1 ลูก",
        40,
      ],
      [
        "case",
        1,
        "ไขคดีประจำวันให้สำเร็จ",
        60,
      ],
      [
        "buy",
        1,
        "ซื้อของในร้านไหนก็ได้ 1 ครั้ง",
        25,
      ],
      [
        "sniff",
        2,
        "เปิดโหมดดมกลิ่น 2 ครั้ง",
        20,
      ],
      // v125: เควสรายวันจากชาวเมือง (ใช้ระบบใหม่ ๆ)
      ["orcamouth", 3, "ลุงทะเล: ป้อนแซลมอนเข้าปากออร์กา 3 ครั้ง", 70],
      ["whalefeed", 2, "ลุงทะเล: ให้อาหารปลาวาฬที่ท่าเรือ 2 ครั้ง", 45],
      ["orcaplay", 2, "เด็ก ๆ ริมหาด: ชวนออร์กาเล่น 2 ครั้ง", 40],
      ["star3", 1, "พี่ต้นครูฝึก: ฝึกให้ได้ ⭐⭐⭐ 1 ฐาน", 60],
      ["train", 3, "พี่ต้นครูฝึก: ฝึกที่สนามฝึก 3 รอบ", 45],
      ["pkwin", 1, "กัปตันแม็ก: ชนะดวลจุดโทษ 1 ครั้ง", 60],
      ["tip", 3, "ชาวเมือง: โชว์คำสั่งให้ชาวเมืองดูจนได้ทิป 3 ครั้ง", 40],
      ["bath", 1, "ร้านอาบน้ำ: อาบน้ำหอม ๆ ที่ร้าน 1 ครั้ง", 35],
      ["dex", 1, "ลุงทะเล: ถ่ายรูปสัตว์ทะเลลงสมุดภาพ 1 แบบใหม่", 90],
      ["loot", 3, "เด็ก ๆ ริมหาด: เก็บของเกยตื้นริมหาด 3 ชิ้น", 40],
    ];
  function lb() {
    let i = I0();
    if (xn.daily?.day === i) return (xn.daily.q = xn.daily.q.filter((q) => q.ev !== "treat")), xn.daily; // v135: ชามผสมขนมถูกเอาออก → ตัดเควสทำขนมที่ค้างอยู่
    let e = [..._C].sort(() => Math.random() - 0.5).slice(0, 4);
    return (
      (xn.daily = { day: i, q: e.map(([t, n, s, o]) => ({ ev: t, n, t: s, m: o, base: C1(t), got: !1 })), box: !1 }),
      xn.daily
    );
  }
  var AE = (i) => Math.min(i.n, C1(i.ev) - i.base);
  function SC() {
    let i = lb(),
      e = nd[xn.story ?? 0];
    return (
      (e && HE(e) ? 1 : 0) +
      i.q.filter((t) => !t.got && AE(t) >= t.n).length +
      (i.q.every((t) => t.got) && !i.box ? 1 : 0)
    );
  }
  var HC = 0,
    V3 = -1;
  function p0(i = !1) {
    if (!i && (HC += 1) % 60) return;
    let e = SC(),
      t = Kc(),
      n = document.getElementById("questBtn");
    n &&
      (n.classList.toggle("dot", e + t > 0),
      e > V3 &&
        V3 >= 0 &&
        e > 0 &&
        (ke("quest"),
        De(
          "✅ ภารกิจสำเร็จ! กด 📋 เพื่อรับรางวัล",
          2400,
        )),
      (V3 = e));
  }
  function cT() {
    let i = fs("luck"),
      e = z.hats ?? [],
      t = Math.random(),
      n = R0.filter((o) => o.q && !e.includes(`dw:${o.key}`) && o.key !== "col_crown"),
      s = R0.filter((o) => !o.q && !e.includes(`dw:${o.key}`));
    if (t < 0.12 + 0.03 * i && n.length)
      p1(
        `dw:${n[Math.floor(Math.random() * n.length)].key}`,
        "🎁 ของหายาก! ",
      );
    else if (t < 0.7 && s.length) p1(`dw:${s[Math.floor(Math.random() * s.length)].key}`, "🎁 ");
    else {
      let o = 80 + Math.floor(Math.random() * 70) + i * 20;
      ((z.money += o),
        (j.bones += 2),
        ke("coin"),
        De(
          `🎁 ได้ ${o}💰 และกระดูก 🦴 2 ชิ้น`,
          2600,
        ));
    }
  }
  var Vp = "quest";
  function Rr() {
    let i = lb(),
      e = xn.story ?? 0,
      t = nd[e],
      n = Ma(),
      s = (r, a) =>
        `<span class="qbar"><i style="width:${Math.round(Math.min(1, r / a) * 100)}%"></i></span><small>${Math.min(r, a)}/${a}</small>`,
      o = "";
    if (Vp === "quest") {
      if (
        ((o += `<h4 class="qh">📖 เรื่องหลัก: เส้นทางหมานักสืบ <small>บทที่ ${Math.min(e + 1, nd.length)}/${nd.length}</small></h4>`),
        t)
      ) {
        let a = HE(t),
          c = [
            ...[t.gear, t.gear2].filter((l) => !!l).map((l) => `${_n[l]?.icon} ${_n[l]?.name} (${A0(l)})`),
            `${t.money}💰`,
            t.sp
              ? `⭐ แต้มความสามารถ +${t.sp}`
              : "",
          ]
            .filter(Boolean)
            .join(" \xB7 ");
        o += `<div class="qcard${a ? " ok" : ""}"><b>${t.t}</b><p>${t.d}</p><div class="qprog">${s(C1(t.ev), t.n)}${t.lvl ? ` <small>\xB7 Lv.${n.lvl}/${t.lvl}</small>` : ""}</div><p class="qrw">🎁 ${c}</p>${a ? '<button class="bigbtn" id="qStory">รับรางวัล</button>' : ""}</div>`;
      } else
        o +=
          '<div class="qcard ok"><b>👑 จบเรื่องหลักแล้ว!</b><p>น้องเป็นราชาแห่งเมืองเชาเชาแล้ว รอบทใหม่เร็ว ๆ นี้</p></div>';
      ((o +=
        '<h4 class="qh">📅 ภารกิจวันนี้ <small>เปลี่ยนทุกวันในเกม</small></h4>'),
        (o += i.q
          .map((a, c) => {
            let l = AE(a),
              h = l >= a.n;
            return `<div class="qrow${a.got ? " got" : ""}"><div><b>${a.t}</b><div class="qprog">${s(l, a.n)}</div></div>${a.got ? "<span>✅</span>" : `<button data-dq="${c}" ${h ? "" : "disabled"}>+${a.m}💰</button>`}</div>`;
          })
          .join("")));
      // v106: เควสพิเศษ (เดิมตั้งป้ายในเมือง → ตอนนี้บันทึกในสมุด)
      if (gi.bq) {
        let a = gi.bq;
        o += `<h4 class="qh">🏆 เควสพิเศษ</h4><div class="qcard${a.done ? " ok" : ""}"><b>${a.done ? "✅ " : ""}ขนมปังของลุงปั้มหายไปไหน</b><p>${a.done ? `ช่วยลุงปั้มตามหาตะกร้าขนมปังสำเร็จ ลุงฝากขอบคุณ${pl[0]?.name ?? "น้อง"}มาก` : `${hC[a.s]} (${a.s + 1}/5)`}</p><p class="qrw">🎁 150💰 \xB7 +60 EXP \xB7 ร้านลุงปั้มลด 20% ตลอดไป${a.done ? " (ได้รับแล้ว)" : ""}</p></div>`;
      }
      let r = i.q.every((a) => a.got);
      o += `<div class="qrow box"><div><b>🎁 กล่องของขวัญประจำวัน</b><small>ทำภารกิจวันนี้ครบ ${i.q.length} อย่าง \xB7 สุ่มชุดมีพลัง (ของหายากจากภารกิจก็มีลุ้น)</small></div>${i.box ? "<span>✅</span>" : `<button id="qBox" ${r ? "" : "disabled"}>เปิด</button>`}</div>`;
    } else {
      let r = cb(),
        a = Kc();
      ((o += `<p class="note">Lv.${n.lvl} \xB7 แต้มความสามารถเหลือ <b>${a}</b> (ได้ 1 แต้มทุกครั้งที่เลเวลขึ้น และจากเรื่องหลัก) \xB7 พลังรวม = ความสามารถ + ชุดที่ใส่</p>`),
        (o += TC.map((c) => {
          let l = xn.skills?.[c] ?? 0,
            h = rl[c],
            f = r[c] ?? 0;
          return `<div class="srow"><span class="ic">${h.ic}</span><div><b>${h.n} <em>${l + f}</em></b><small>${h.d}</small><span class="dots">${"●".repeat(l)}${"○".repeat(3 - l)}${f ? ` <i>ชุด +${f}</i>` : ""}</span></div><button data-sk="${c}" ${a > 0 && l < 3 ? "" : "disabled"}>+</button></div>`;
        }).join("")),
        (o +=
          '<button class="catbtn" id="qWard">👗 เปลี่ยนชุด (ชุดแต่ละแบบมีพลังต่างกัน)</button>'));
    }
    (Gi(
      "📋 ภารกิจ & ความสามารถ",
      `<div class="tabs wtabs"><button data-qt="quest" class="${Vp === "quest" ? "on" : ""}">📋 ภารกิจ</button><button data-qt="skill" class="${Vp === "skill" ? "on" : ""}">⭐ พลัง${Kc() ? ` (+${Kc()})` : ""}</button></div>${o}`,
    ),
      Ea.querySelectorAll("[data-qt]").forEach((r) =>
        r.addEventListener("click", () => {
          ((Vp = r.dataset.qt), ke("pop"), Rr());
        }),
      ),
      document.getElementById("qStory")?.addEventListener("click", () => {
        let r = nd[xn.story ?? 0];
        if (!(!r || !HE(r))) {
          if (
            ((xn.story = (xn.story ?? 0) + 1),
            (z.money += r.money),
            r.sp && (xn.bonusSP = (xn.bonusSP ?? 0) + r.sp),
            Rs(20, Le[0]),
            r.gear2 && !(z.hats ?? (z.hats = [])).includes(r.gear2))
          ) {
            z.hats.push(r.gear2);
            let a = r.gear2;
            setTimeout(() => {
              (ke("heart"),
                rt(`🎁 ${_n[a]?.icon ?? ""} ${_n[a]?.name ?? a}`, Le[0].pos.clone().setY(2.2), "big"),
                De(`และได้ ${_n[a]?.icon ?? ""} ${_n[a]?.name ?? a} (${A0(a)})`, 3200));
            }, 1600);
          } else r.gear2 && (z.money += 60);
          (ke("quest"),
            r.gear
            ? p1(r.gear, `📖 จบบท "${r.t}" `)
            : (ke("coin"),
              De(
                `📖 จบบท "${r.t}" ได้ ${r.money}💰${r.sp ? ` และแต้มความสามารถ +${r.sp}` : ""}`,
                3e3,
              )),
            _t(z),
            p0(!0),
            Rr());
        }
      }),
      Ea.querySelectorAll("[data-dq]").forEach((r) =>
        r.addEventListener("click", () => {
          let a = i.q[+r.dataset.dq];
          a.got ||
            AE(a) < a.n ||
            ((a.got = !0),
            (z.money += a.m),
            Rs(10, Le[0]),
            ke("coin"),
            rt(`✅ +${a.m}💰`, Le[0].pos.clone().setY(2), "big"),
            _t(z),
            p0(!0),
            Rr());
        }),
      ),
      document.getElementById("qBox")?.addEventListener("click", () => {
        i.box || !i.q.every((r) => r.got) || ((i.box = !0), cT(), _t(z), p0(!0), Rr());
      }),
      Ea.querySelectorAll("[data-sk]").forEach((r) =>
        r.addEventListener("click", () => {
          let a = r.dataset.sk;
          Kc() <= 0 ||
            (xn.skills?.[a] ?? 0) >= 3 ||
            (((xn.skills ?? (xn.skills = {}))[a] = (xn.skills[a] ?? 0) + 1),
            ke("heart"),
            rt(`${rl[a].ic} ${rl[a].n} +1`, Le[0].pos.clone().setY(2), "big"),
            _t(z),
            p0(!0),
            Rr());
        }),
      ),
      document.getElementById("qWard")?.addEventListener("click", () => {
        (ke("pop"), _0());
      }));
  }
  var ccsGS = 0.64,
    No = z,
    yd = 8,
    ds = [16748465, 16765503, 16777215, 11832575, 16743001, 9425919],
    AC = [
      ["chow:orange", "เชาเชา ส้มแดง"],
      ["chow:cream", "เชาเชา ครีม"],
      ["chow:black", "เชาเชา ดำ"],
      ["chow:red", "เชาเชา แดงเข้ม"],
      ["chow:blue", "เชาเชา บลู"],
      ["chow:white", "เชาเชา ขาว"],
      ["poodle:orange", "พุดเดิ้ล"],
      ["beast:labrador", "ลาบราดอร์"],
      ["beast:pitt", "พิทบูล"],
      ["beast:rott", "ร็อตไวเลอร์"],
      ["beast:doberman", "โดเบอร์แมน"],
      ["beast:chihuahua", "ชิวาวา"],
    ],
    // v81: สวนสายรุ้งใหม่ (โมเดลของพี่ปั๊ม CHOWCHOW_RAINBOW_GARDEN_v1) · หน่วยในโมเดล × ccsGS = เมตรในเกม
    // แปลงที่ระลึก 8 แปลง ซ้าย/ขวาทางเดินกลาง ประตูอยู่ฝั่ง +z (หันเข้าเมือง)
    kr = Array.from({ length: yd }, (i, e) => {
      let t = e < 4 ? -1 : 1,
        n = [7.1, 2.7, -1.7, -6.1][e % 4];
      return { x: hn.x + t * 6.55 * ccsGS, z: hn.z + n * ccsGS, ry: (-t * Math.PI) / 2, side: t, gx: t * 6.55, gz: n };
    }),
    wn = { g: new J(), plots: [], petals: null, flies: null, lanterns: [], t: 0 };
  function z6(i) {
    let e = document.createElement("canvas");
    ((e.width = 256), (e.height = 320));
    let t = e.getContext("2d"),
      n = t.createLinearGradient(0, 0, 256, 320);
    (n.addColorStop(0, "#fbf8f4"), n.addColorStop(1, "#e4ddd6"), (t.fillStyle = n), t.fillRect(0, 0, 256, 320));
    for (let r = 0; r < 26; r++)
      ((t.strokeStyle = `rgba(160,150,145,${0.03 + Math.random() * 0.04})`),
        (t.lineWidth = 0.8 + Math.random() * 1.2),
        t.beginPath(),
        t.moveTo(Math.random() * 256, Math.random() * 320),
        t.bezierCurveTo(
          Math.random() * 256,
          Math.random() * 320,
          Math.random() * 256,
          Math.random() * 320,
          Math.random() * 256,
          Math.random() * 320,
        ),
        t.stroke());
    ((t.strokeStyle = "#c9a227"),
      (t.lineWidth = 5),
      t.strokeRect(14, 14, 228, 292),
      (t.lineWidth = 1.5),
      t.strokeRect(22, 22, 212, 276));
    let s = (r, a, c) => {
      ((t.fillStyle = "#c9a227"), t.beginPath(), t.ellipse(r, a + c * 0.25, c * 0.42, c * 0.34, 0, 0, 7), t.fill());
      for (let [l, h] of [
        [-0.42, -0.2],
        [-0.15, -0.45],
        [0.15, -0.45],
        [0.42, -0.2],
      ])
        (t.beginPath(), t.ellipse(r + l * c, a + h * c, c * 0.15, c * 0.19, 0, 0, 7), t.fill());
    };
    if (((t.textAlign = "center"), (t.fillStyle = "#5a4a3e"), !i))
      (s(128, 120, 50),
        (t.font = "600 22px Mitr, sans-serif"),
        t.fillText("สวนสายรุ้ง", 128, 200),
        (t.font = "400 16px Mitr, sans-serif"),
        t.fillText(
          "ที่ระลึกของน้องที่รัก",
          128,
          228,
        ));
    else {
      (s(128, 70, 40),
        (t.font = "700 34px Mitr, sans-serif"),
        t.fillText(i.name.slice(0, 16), 128, 140, 220),
        (t.font = "400 18px Mitr, sans-serif"),
        (t.fillStyle = "#8a7766"),
        i.years && t.fillText(i.years.slice(0, 20), 128, 170, 220),
        (t.fillStyle = "#5a4a3e"),
        (t.font = "400 17px Mitr, sans-serif"));
      let r = i.msg.slice(0, 60),
        a = [],
        c = "",
        l = (() => {
          try {
            let h = Intl.Segmenter;
            return [...new h("th", { granularity: "word" }).segment(r)].map((f) => f.segment);
          } catch {
            return [...r];
          }
        })();
      for (let h of l) c && t.measureText(c + h).width > 200 ? (a.push(c.trim()), (c = h.trimStart())) : (c += h);
      (c && a.push(c.trim()),
        a.slice(0, 3).forEach((h, f) => t.fillText(h, 128, 210 + f * 24, 210)),
        (t.font = "16px sans-serif"),
        t.fillText("🌈", 128, 290));
    }
    let o = new ut(e);
    return ((o.colorSpace = Ye), (o.anisotropy = 4), o);
  }
  var CC = (() => {
      let i = document.createElement("canvas");
      i.width = i.height = 64;
      let e = i.getContext("2d"),
        t = e.createRadialGradient(32, 32, 0, 32, 32, 32);
      return (
        t.addColorStop(0, "rgba(255,255,255,1)"),
        t.addColorStop(1, "rgba(255,255,255,0)"),
        (e.fillStyle = t),
        e.fillRect(0, 0, 64, 64),
        new ut(i)
      );
    })(),
    M0 = new X({ color: 16052458, roughness: 0.35, metalness: 0.02 }),
    uI = new X({ color: 15911244, roughness: 0.25, metalness: 0.9, emissive: 3811328, emissiveIntensity: 0.3 });
  function kC(i) {
    let e = new J(),
      t = 0.78,
      n = 1,
      s = t / 2,
      o = new mn();
    (o.moveTo(-s, 0), o.lineTo(-s, n - s), o.absarc(0, n - s, s, Math.PI, 0, !0), o.lineTo(s, 0), o.lineTo(-s, 0));
    let r = new yi(o, {
      depth: 0.12,
      bevelEnabled: !0,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
      curveSegments: 24,
    });
    r.translate(0, 0, -0.06);
    let a = new R(r, M0);
    ((a.castShadow = !0), (a.position.y = 0.16), e.add(a));
    let c = new R(new Te(t * 0.86, n * 0.86), new X({ map: i, roughness: 0.4 }));
    (c.position.set(0, 0.16 + n * 0.47, 0.085), e.add(c));
    let l = new R(new ee(1.06, 0.1, 0.46), M0);
    ((l.position.y = 0.05), (l.castShadow = !0), e.add(l));
    let h = new R(new ee(0.94, 0.07, 0.34), M0);
    return ((h.position.y = 0.135), e.add(h), e);
  }
  function Jc(i, e) {
    let t = new J(),
      n = new X({ color: i, roughness: 0.6 }),
      s = new X({ color: 16769162, roughness: 0.5 }),
      o = new X({ color: 4165434, roughness: 0.8 });
    for (let r = 0; r < e; r++) {
      let a = new J(),
        c = 0.16 + Math.random() * 0.12,
        l = new R(new re(0.006, 0.008, c, 5), o);
      ((l.position.y = c / 2), a.add(l));
      for (let f = 0; f < 5; f++) {
        let d = (f / 5) * Math.PI * 2,
          u = new R(new we(0.026, 8, 6), n);
        (u.scale.set(1, 0.45, 0.7), u.position.set(Math.cos(d) * 0.028, c, Math.sin(d) * 0.028), a.add(u));
      }
      let h = new R(new we(0.016, 8, 6), s);
      ((h.position.y = c + 0.008),
        a.add(h),
        a.position.set((Math.random() - 0.5) * 0.36, 0, (Math.random() - 0.5) * 0.14),
        (a.rotation.z = (Math.random() - 0.5) * 0.3),
        t.add(a));
    }
    return t;
  }
  function L6(i) {
    let [e, t] = i.split(":"),
      n = null;
    try {
      e === "chow" && Fc()
        ? (n = ui(t, 0.36))
        : e === "poodle" && Fc("poodle")
          ? (n = ui("orange", 0.42, "poodle"))
          : e === "beast" && Kg(t) && ((n = Kr(t)), n.root.scale.multiplyScalar(0.36));
    } catch {
      n = null;
    }
    let s = new J(),
      o = new R(new re(0.2, 0.23, 0.12, 24), M0);
    ((o.position.y = 0.06),
      s.add(o),
      n &&
        ((n.root.position.y = 0.12),
        s.add(n.root),
        n.root.traverse((a) => {
          a.castShadow = !0;
        })));
    let r = new R(
      new vt(0.09, 0.012, 8, 28),
      new X({ color: 16773808, emissive: 16767082, emissiveIntensity: 1.2, roughness: 0.3 }),
    );
    return (
      (r.rotation.x = Math.PI / 2),
      r.position.set(0, 0.12 + (n ? n.height + 0.08 : 0.3), n ? 0.12 : 0),
      (r.userData.halo = !0),
      (r.userData.noMerge = !0),
      s.add(r),
      s
    );
  }
  function D6(i) {
    let e = new J(),
      t = new R(
        new re(0.045, 0.045, 0.1, 16, 1, !0),
        new X({ color: 16773590, transparent: !0, opacity: 0.45, roughness: 0.1, side: Ke }),
      );
    ((t.position.y = 0.05), e.add(t));
    let n = new R(new re(0.035, 0.035, 0.07, 14), new X({ color: 16775920, roughness: 0.6 }));
    if (((n.position.y = 0.035), e.add(n), i)) {
      let s = lE(0.09, 0.05);
      ((s.position.y = 0.07), e.add(s));
      let o = new zi(
        new vi({ map: CC, color: 16760944, transparent: !0, opacity: 0.55, depthWrite: !1, blending: $i }),
      );
      (o.scale.setScalar(0.45), (o.position.y = 0.12), (o.userData.noOcc = !0), e.add(o));
    }
    return e;
  }
  // โคมกระดาษสาห้อยเพดาน (ใช้ทั้งบ้านและทุกร้าน) · คืน false ถ้าโมเดลยังไม่มา
  var ccsLampM = null;
  function ccsRiceLamp(i, e, t, n) {
    if (!ze("lamp_rice")) return !1;
    ccsLampM ?? (ccsLampM = new X({ color: 16775920, emissive: 16770238, emissiveIntensity: 0.85, roughness: 0.85, toneMapped: !1 }));
    let s = je("lamp_rice", 0.62);
    (s.traverse((r) => {
      let a = r;
      a.isMesh && ((a.castShadow = !1), /M00/.test(a.material.name) && (a.material = ccsLampM));
    }),
      s.position.set(e, t - 0.42 - 0.62, n),
      i.add(s));
    let o = new R(new re(0.008, 0.008, 0.42, 5), new be({ color: 3355443 }));
    return (o.position.set(e, t - 0.21, n), i.add(o), !0);
  }
  // v88: ยกตัวน้องบนเบาะให้ส่วนที่ต่ำสุดของท่านอน/ท่ายืนอยู่บนผิวเบาะพอดี (ไม่จม ไม่เห็นเงาทะลุเบาะ)
  var ccsLiftBox = null;
  function ccsBedLift(i) {
    let e = performance.now();
    if (i._blT && e - i._blT < 400) return i._bl ?? 0;
    i._blT = e;
    ccsLiftBox || (ccsLiftBox = new mt());
    let t = i.rig.root,
      n = t.position.y;
    (t.position.y = 0, t.updateMatrixWorld(!0), ccsLiftBox.setFromObject(t, !0), (t.position.y = n), t.updateMatrixWorld(!0));
    let s = ccsLiftBox.isEmpty() ? 0 : -ccsLiftBox.min.y;
    return ((i._bl = Math.max(0, Math.min(0.45, s - 0.03))), i._bl);
  }
  // v88: ประตูบานเลื่อนไม้ (บานไม้ทึบ + บานกระจกกรอบไม้ บนรางเลื่อน) ให้ตรงกับประตูบ้านด้านนอก
  function ccsSlideDoor() {
    // v89: ประตูกระจกบานเลื่อน 2 บาน กรอบไม้ มองออกไปเห็นวิวทะเล
    let i = new J(),
      e = new X({ map: Cn(9070127, "#5a3a1c"), roughness: 0.75 }),
      t = new X({ color: 13152156, roughness: 0.7 }),
      n = new X({ color: 2763306, roughness: 0.6, metalness: 0.5 }),
      s = new X({ color: 15201279, roughness: 0.05, metalness: 0.1, transparent: !0, opacity: 0.18, depthWrite: !1 }),
      o = 2.4,
      r = 2.45,
      a = (c, l, h, f, d, u, p) => {
        let m = new R(new ee(c, l, h), f);
        return (m.position.set(d, u, p), i.add(m), m);
      };
    // วิวทะเลด้านนอก (ฟ้า ทะเล คลื่น หาดทราย ต้นมะพร้าว)
    let v = ss(512, 512, (c) => {
        let l = c.createLinearGradient(0, 0, 0, 300);
        (l.addColorStop(0, "#5fb4ee"), l.addColorStop(1, "#cfeefc"), (c.fillStyle = l), c.fillRect(0, 0, 512, 300));
        ((c.fillStyle = "rgba(255,255,255,.85)"), [[90, 70, 46], [140, 80, 34], [380, 110, 40], [420, 100, 30]].forEach(([h, f, d]) => (c.beginPath(), c.arc(h, f, d, 0, 7), c.fill())));
        ((c.fillStyle = "#fff6c8"), c.beginPath(), c.arc(330, 230, 26, 0, 7), c.fill());
        let h = c.createLinearGradient(0, 290, 0, 400);
        (h.addColorStop(0, "#1f86b8"), h.addColorStop(1, "#3cc4c9"), (c.fillStyle = h), c.fillRect(0, 290, 512, 110));
        c.strokeStyle = "rgba(255,255,255,.7)";
        for (let f = 0; f < 6; f++) ((c.lineWidth = 2 + f * 0.6), c.beginPath(), c.moveTo(0, 310 + f * 16), c.bezierCurveTo(130, 300 + f * 16, 380, 322 + f * 16, 512, 308 + f * 16), c.stroke());
        ((c.fillStyle = "#f3dfae"), c.fillRect(0, 400, 512, 112), (c.fillStyle = "#e7cf96"), c.fillRect(0, 470, 512, 42));
        ((c.strokeStyle = "#7a5530"), (c.lineWidth = 14), c.beginPath(), c.moveTo(70, 500), c.quadraticCurveTo(90, 300, 130, 170), c.stroke());
        c.fillStyle = "#2f8a3e";
        for (let f = 0; f < 6; f++) (c.beginPath(), c.ellipse(130, 170, 90, 18, -0.4 + f * 0.62, 0, 7), c.fill());
      }),
      _ = new R(new Te(o, r), new be({ map: v }));
    ((_.rotation.y = Math.PI), _.position.set(0, 0.18 + r / 2, -0.045), i.add(_));
    // วงกบ + ราง
    (a(o + 0.24, 0.14, 0.16, t, 0, r + 0.25, -0.1), a(0.12, r + 0.1, 0.16, t, -o / 2 - 0.06, 0.18 + r / 2, -0.1), a(0.12, r + 0.1, 0.16, t, o / 2 + 0.06, 0.18 + r / 2, -0.1));
    (a(o + 0.1, 0.05, 0.08, n, 0, r + 0.16, -0.2), a(o + 0.1, 0.03, 0.1, n, 0, 0.2, -0.2));
    let c = o / 2 + 0.04;
    for (let [l, h] of [[o / 4, -0.17], [-o / 4, -0.12]]) {
      (a(c, 0.1, 0.05, e, l, 0.25, h), a(c, 0.1, 0.05, e, l, r + 0.1, h), a(0.1, r - 0.06, 0.05, e, l - c / 2 + 0.05, 0.18 + r / 2, h), a(0.1, r - 0.06, 0.05, e, l + c / 2 - 0.05, 0.18 + r / 2, h));
      let f = new R(new ee(c - 0.18, r - 0.26, 0.012), s);
      (f.position.set(l, 0.18 + r / 2, h), i.add(f));
    }
    return (a(0.04, 0.34, 0.05, n, 0.1, 1.25, -0.21), a(0.04, 0.34, 0.05, n, -0.1, 1.25, -0.08), i);
  }
  // v85: กระดูกแทะสำหรับน้องหมา (ทรงกระดูกการ์ตูนสีครีม ไม่ใช่กล่อง)
  function ccsBone(i) {
    let e = new J(),
      t = new X({ color: 16247236, roughness: 0.55 }),
      n = new R(new re(0.09, 0.09, 0.62, 14), t);
    ((n.rotation.z = Math.PI / 2), e.add(n));
    for (let o of [-0.33, 0.33]) for (let r of [-0.08, 0.08]) {
      let a = new R(new we(0.12, 14, 10), t);
      (a.position.set(o, 0, r), e.add(a));
    }
    let s = new J();
    return ((e.position.y = 0.12), (e.rotation.y = 0.5), s.add(e), s.scale.setScalar(i / 0.9), s);
  }
  // v85: ตู้แช่เนื้อสดเปิดหน้า 2 ชั้น (แบบซูเปอร์ญี่ปุ่น/ดองกิ) วางแพ็กเนื้อจริงเต็มตู้
  function ccsMeatCase(e, i, t, x, z) {
    let n = 3.2,
      s = 0.95,
      o = new J();
    o.position.set(x, 0, z);
    let r = new X({ color: 15264495, roughness: 0.35, metalness: 0.4 }),
      a = new X({ color: 2831424, roughness: 0.8 }),
      c = new R(new ee(n, 0.8, s), r);
    (c.position.y = 0.4), o.add(c);
    let l = new R(new ee(n - 0.08, 0.03, s - 0.08), new X({ color: 13429237, roughness: 0.6 }));
    ((l.position.y = 0.815), o.add(l));
    // v89: เอาแถบกันเตะสีดำด้านล่างตู้ออก (ซ้อนระนาบกับตัวตู้ กะพริบ)
    // ป้ายแดงหน้าตู้
    let f = ss(1024, 64, (q) => {
        ((q.fillStyle = "#c8102e"), q.fillRect(0, 0, 1024, 64), (q.fillStyle = "#fff"), (q.font = "700 40px Mitr, sans-serif"), (q.textBaseline = "middle"));
        for (let D = 0; D < 3; D++) q.fillText(["🥩 เนื้อสด", "🐔 ไก่สด", "🐟 ปลาสด"][D] + " · ถูกจัง!", 20 + D * 340, 34);
      }),
      d = new R(new ee(n, 0.14, 0.02), [a, a, a, a, new be({ map: f }), a]);
    (d.position.set(0, 0.68, s / 2 + 0.005), o.add(d));
    // ชั้นบนด้านหลัง (ขั้นบันได) + ขอบกระจกกันละออง + ไฟเย็นสีฟ้าขาว
    let u = new R(new ee(n, 0.38, 0.32), r);
    (u.position.set(0, 0.82 + 0.19, -s / 2 + 0.16), o.add(u));
    let m = new R(new ee(n - 0.1, 0.02, 0.3), new X({ color: 13429237, roughness: 0.6 }));
    (m.position.set(0, 1.215, -s / 2 + 0.16), o.add(m));
    let E = new R(new ee(n, 0.02, 0.5), new X({ color: 14544639, transparent: !0, opacity: 0.25, roughness: 0.05, depthWrite: !1 }));
    (E.position.set(0, 1.62, -s / 2 + 0.25), o.add(E));
    for (let D of [-n / 2 + 0.02, n / 2 - 0.02]) {
      let q = new R(new ee(0.04, 0.82, 0.04), r);
      (q.position.set(D, 1.22, -s / 2 + 0.05), o.add(q));
    }
    let g = new R(new ee(n - 0.1, 0.03, 0.06), new be({ color: 14743551 }));
    (g.position.set(0, 1.6, -s / 2 + 0.25), o.add(g));
    // แพ็กเนื้อ: ชั้นล่าง 2 แถว, ชั้นบน 1 แถว
    let y = ["meatpk_23", "meatpk_18", "meatpk_24", "meatpk_22", "meatpk_25", "meatpk_19", "meatpk_26", "meatpk_20", "meatpk_27"],
      w = ["meatpk_5", "meatpk_6", "meatpk_7", "meatpk_9", "meatpk_10", "meatpk_4", "meatpk_8"],
      v = 0;
    for (let [D, q, L, W, Z] of [
      [0.18, 0.83, y, 8, 0.34],
      [-0.16, 0.83, y.slice().reverse(), 8, 0.34],
      [-s / 2 + 0.16, 1.225, w, 6, 0.46],
    ]) {
      let G = (n - 0.25) / W;
      for (let N = 0; N < W; N++) {
        let A = L[(N + v) % L.length];
        if (!ze(A)) continue;
        let F = je(A, Z);
        (F.position.set(-n / 2 + 0.12 + G * (N + 0.5), q, D), (F.rotation.y = (N % 2 ? 0.08 : -0.06) + (Z > 0.4 ? 0 : Math.PI / 2)), o.add(F));
      }
      v += 3;
    }
    // ชิ้นใหญ่วางหัวท้ายตู้ + ไก่ทั้งตัว
    for (let [D, q, L] of [["meatpk_12", -n / 2 - 0.05, 0.5], ["meatpk_13", n / 2 + 0.05, 0.5]]) {
      if (!ze(D)) continue;
      let W = je(D, L);
      (W.position.set(q * 0.82, 1.23, -s / 2 + 0.16), o.add(W));
    }
    // ป้ายราคาเล็ก ๆ
    for (let D = 0; D < 4; D++) {
      let q = ro(["฿59", "฿79", "฿99", "฿149"][D], 0, 0.22, 0.1);
      (q.position.set(-n / 2 + 0.45 + D * 0.78, 0.79, s / 2 + 0.03), o.add(q));
    }
    (o.traverse((D) => {
      D.isMesh && ((D.castShadow = !0), (D.receiveShadow = !1));
    }),
      e.add(o),
      i.solids.push({ x: t.x + x, z: t.z + z, hw: n / 2 + 0.05, hd: s / 2 + 0.05 }));
  }
  // v84: พื้นผิวแสงไฟหน้ารถ (พัดแสงจากกันชน กว้างขึ้นตามระยะ จางลงตามระยะ)
  var ccsBeamTex = null;
  function ccsBeamMat() {
    if (!ccsBeamTex) {
      let i = document.createElement("canvas");
      ((i.width = 128), (i.height = 256));
      let e = i.getContext("2d");
      for (let t = 0; t < 256; t++) {
        let n = t / 255,
          s = 0.3 + 0.7 * Math.sqrt(n),
          o = Math.pow(1 - n, 1.4) * Math.min(1, n * 14 + 0.25),
          r = e.createLinearGradient(64 - s * 64, 0, 64 + s * 64, 0);
        (r.addColorStop(0, "rgba(255,240,200,0)"), r.addColorStop(0.25, `rgba(255,242,205,${o * 0.75})`), r.addColorStop(0.5, `rgba(255,246,215,${o})`), r.addColorStop(0.75, `rgba(255,242,205,${o * 0.75})`), r.addColorStop(1, "rgba(255,240,200,0)"), (e.fillStyle = r), e.fillRect(0, t, 128, 1));
      }
      ((ccsBeamTex = new ut(i)), (ccsBeamTex.colorSpace = Ye));
    }
    return new be({ map: ccsBeamTex, transparent: !0, opacity: 0.6, depthWrite: !1, blending: $i, toneMapped: !1 });
  }
  // v83: แสงแดดตามน้อง แต่ขยับทีละ 1 พิกเซลของแผนที่เงา (กันเงากระพริบ/สั่นเวลาเดิน)
  var ccsSV = new H(),
    ccsSM = new Oe();
  function ccsSunFollow(i) {
    let e = (2 * 26) / ii.shadow.mapSize.x;
    (ccsSM.lookAt(sd, new H(0, 0, 0), new H(0, 1, 0)), ccsSV.copy(i).applyMatrix4(ccsSM.clone().invert()));
    ((ccsSV.x = Math.round(ccsSV.x / e) * e), (ccsSV.y = Math.round(ccsSV.y / e) * e), ccsSV.applyMatrix4(ccsSM));
    (ii.target.position.copy(ccsSV), ii.position.copy(ccsSV).addScaledVector(sd, 60), ii.target.updateMatrixWorld());
  }
  // v83: ไอคอนเมนูเรนเดอร์จากโมเดลจริงของแต่ละรายการ (ไม่มีไอคอนซ้ำกัน)
  var ccsTh = { c: new Map(), rt: null, sc: null, cam: null, cv: null, buf: null };
  function ccsThumb(i, e) {
    if (ccsTh.c.has(i)) return ccsTh.c.get(i);
    let t = "";
    try {
      let n = ccsTh;
      if (!n.rt) {
        ((n.rt = new qn(128, 128)), (n.rt.texture.colorSpace = Ye), (n.sc = new pc()), (n.cam = new Tn(28, 1, 0.01, 100)));
        n.sc.add(new Tc(16777215, 7829367, 2.2));
        let c = new hr(16777215, 2.4);
        (c.position.set(2, 4, 5), n.sc.add(c));
        ((n.cv = document.createElement("canvas")), (n.cv.width = n.cv.height = 128), (n.buf = new Uint8Array(128 * 128 * 4)));
      }
      let s = e();
      if (!s) return "";
      let o = s.root ?? s;
      (n.sc.add(o), o.updateMatrixWorld(!0));
      let r = new mt().setFromObject(o),
        a = r.getCenter(new H()),
        l = r.getSize(new H()),
        h = Math.max(l.x, l.y, l.z) || 1;
      (n.cam.position.copy(a).add(new H(0.55, 0.42, 0.95).normalize().multiplyScalar(h * 2.3)), n.cam.lookAt(a), (n.cam.near = h / 50), (n.cam.far = h * 20), n.cam.updateProjectionMatrix());
      let f = new ae(),
        d = dn.getClearAlpha(),
        u = dn.shadowMap.autoUpdate;
      (dn.getClearColor(f), dn.setClearColor(0, 0), (dn.shadowMap.autoUpdate = !1), dn.setRenderTarget(n.rt), dn.clear(), dn.render(n.sc, n.cam), dn.readRenderTargetPixels(n.rt, 0, 0, 128, 128, n.buf), dn.setRenderTarget(null), dn.setClearColor(f, d), (dn.shadowMap.autoUpdate = u), n.sc.remove(o));
      let p = n.cv.getContext("2d"),
        m = p.createImageData(128, 128);
      for (let E = 0; E < 128; E++) m.data.set(n.buf.subarray((127 - E) * 512, (128 - E) * 512), E * 512);
      (p.putImageData(m, 0, 0), (t = `<img class="th" src="${n.cv.toDataURL("image/png")}" alt="">`));
    } catch (n) {
      console.warn("thumb", i, n);
    }
    return (ccsTh.c.set(i, t), t);
  }
  // v83: แผงลุงทะเล: คบเพลิง 2 ต้นหน้าแผง (ไฟติดตอนกลางคืน) + โต๊ะไม้วางเรือซาชิมิ
  function ccsStallExtras() {
    if (!ccsStall || ccsStall.userData.ext) return;
    ccsStall.userData.ext = !0;
    let i = (o) => Math.max(od.y, Cr ? Cr.heightAt(o.x, o.z) : 0);
    for (let o of [-1.55, 1.55]) {
      let r = new H(od.x + 1.25, 0, od.z + o);
      if (((r.y = i(r)), ze("tiki_torch"))) {
        let a = je("tiki_torch", 2);
        (a.position.copy(r).setY(r.y - 0.12), K.add(a));
        let c = null;
        (a.updateMatrixWorld(!0),
          a.traverse((f) => {
            let d = f;
            d.isMesh && (d.material.name === "fire_flame" || d.name === "fire_flame") && ((c = new mt().setFromObject(d)), (d.visible = !1));
          }));
        let l = lE(0.55, 0.3);
        (c ? l.position.set((c.min.x + c.max.x) / 2, c.min.y + 0.02, (c.min.z + c.max.z) / 2) : l.position.set(r.x, r.y + 1.82, r.z), (l.visible = !1), K.add(l), hE.push(l), i1.push(l));
        let h = new En(16747056, 0, 9, 1.6);
        (h.position.copy(l.position).add(new H(0, 0.35, 0)), K.add(h), u4.push(h), pd(l.position.x, l.position.z, 2.4, 0.9));
      }
      pt.push({ x: r.x, z: r.z, hw: 0.14, hd: 0.14 });
    }
    // v84: คบเพลิงตลอดสะพานไม้ (สองฝั่ง) ไฟติดตอนกลางคืน แสงส้มอุ่นส่องพื้นไม้
    if (ze("tiki_torch")) {
      let o = Rt + 1;
      for (let [r, a] of [[0.6, !0], [6, !1], [11.4, !0], [16.8, !1], [21.6, !0]])
        for (let c of [-1.62, 1.62]) {
          if (r === 21.6 && c > 0) continue;
          let l = je("tiki_torch", 1.7);
          (l.position.set(c, 0.34, o + r), K.add(l), l.updateMatrixWorld(!0));
          let h = null;
          l.traverse((d) => {
            d.isMesh && (d.material.name === "fire_flame" || d.name === "fire_flame") && ((h = new mt().setFromObject(d)), (d.visible = !1));
          });
          let f = lE(0.48, 0.26);
          (h ? f.position.set((h.min.x + h.max.x) / 2, h.min.y + 0.02, (h.min.z + h.max.z) / 2) : f.position.set(c, 1.85, o + r), (f.visible = !1), K.add(f), hE.push(f), i1.push(f));
          if (a && (c < 0 || r === 21.6)) {
            let d = new En(16747056, 0, 10, 1.4);
            (d.position.set(0, f.position.y + 0.3, f.position.z), K.add(d), u4.push(d));
          }
        }
    }
    // หลอดไฟใต้กันสาด ส่องของบนแผงให้เห็นชัดตอนกลางคืน
    for (let o of [-0.7, 0.7]) {
      let r = new R(new we(0.07, 10, 8), new be({ color: 16773832 }));
      (r.position.set(od.x + 0.55, od.y + 2.25, od.z + o), K.add(r));
    }
    {
      let o = new En(16767392, 0, 7, 1.4);
      (o.position.set(od.x + 0.9, od.y + 2.1, od.z), K.add(o), H0.push({ l: o, on: 10 }));
    }
    // โต๊ะไม้ข้างแผง + เรือซาชิมิ
    let e = new H(od.x + 0.15, 0, od.z + 2.05);
    e.y = i(e);
    let t = new X({ map: Cn(11565636, "#7a4a24"), roughness: 0.75 }),
      n = new R(new ee(1.25, 0.07, 0.8), t);
    (n.position.set(e.x, e.y + 0.78, e.z), (n.castShadow = !0), K.add(n));
    for (let [o, r] of [[-0.55, -0.33], [0.55, -0.33], [-0.55, 0.33], [0.55, 0.33]]) {
      let a = new R(new ee(0.07, 0.76, 0.07), t);
      (a.position.set(e.x + o, e.y + 0.38, e.z + r), K.add(a));
    }
    if (ze("sashimi_boat")) {
      let o = je("sashimi_boat", 1.05);
      (o.position.set(e.x, e.y + 0.815, e.z), (o.rotation.y = Math.PI / 2), K.add(o));
    }
    let s = ro("เรือซาชิมิ 159฿", 2, 1.1, 0.3);
    (s.position.set(e.x + 0.45, e.y + 1.35, e.z), (s.rotation.y = Math.PI / 2), K.add(s));
    pt.push({ x: e.x, z: e.z, hw: 0.66, hd: 0.44 });
  }
  // ป้ายชื่อแนวนอนสำหรับแผ่นทองเหลืองบนหินแต่ละแปลง
  function ccsPlaque(i) {
    let e = document.createElement("canvas");
    ((e.width = 512), (e.height = 320));
    let t = e.getContext("2d");
    ((t.fillStyle = "#8a6a40"), t.fillRect(0, 0, 512, 320));
    let n = t.createLinearGradient(0, 0, 0, 320);
    (n.addColorStop(0, "#fbf3df"), n.addColorStop(1, "#efe2c4"), (t.fillStyle = n), t.beginPath(), t.roundRect(16, 16, 480, 288, 22), t.fill());
    ((t.strokeStyle = "#c9a227"), (t.lineWidth = 4), t.beginPath(), t.roundRect(28, 28, 456, 264, 16), t.stroke());
    ((t.textAlign = "center"), (t.fillStyle = "#4e3d30"), (t.font = "700 64px Mitr, sans-serif"), t.fillText(i.name.slice(0, 16), 256, 118, 440));
    ((t.font = "400 30px Mitr, sans-serif"), (t.fillStyle = "#8a7766"), i.years && t.fillText(i.years.slice(0, 20), 256, 164, 440));
    ((t.fillStyle = "#5a4a3e"), (t.font = "400 28px Mitr, sans-serif"));
    let s = i.msg.slice(0, 60),
      o = [],
      r = "",
      a = (() => {
        try {
          return [...new Intl.Segmenter("th", { granularity: "word" }).segment(s)].map((c) => c.segment);
        } catch {
          return [...s];
        }
      })();
    for (let c of a) r && t.measureText(r + c).width > 420 ? (o.push(r.trim()), (r = c.trimStart())) : (r += c);
    (r && o.push(r.trim()), o.slice(0, 2).forEach((c, l) => t.fillText(c, 256, 214 + l * 36, 440)), (t.font = "26px sans-serif"), t.fillText("🌈", 256, 290));
    let c = new ut(e);
    return ((c.colorSpace = Ye), (c.anisotropy = 4), c);
  }
  // แปลง i: กลุ่มอยู่กลางแปลงในโมเดล หมุนให้ +z ชี้เข้าทางเดินกลาง, หน่วยข้างในเป็นหน่วยโมเดล (scale ccsGS)
  function T0(i) {
    let e = kr[i],
      t = No.memorials?.[i] ?? null,
      n = wn.plots[i];
    n && wn.g.remove(n);
    let s = new J();
    (s.position.set(e.x - hn.x, 0.012, e.z - hn.z), (s.rotation.y = e.ry), s.scale.setScalar(ccsGS));
    // แปลงพิกัดโมเดล (gx, gz) → พิกัดในแปลง
    let o = (h, f, d) => {
        let u = h - e.gx,
          p = d - e.gz;
        return new H(e.side * p, f, -e.side * u);
      },
      r = 1 / ccsGS;
    if (t) {
      // แผ่นชื่อบนหน้าหิน (NAMEPLATE ในโมเดล)
      let h = new R(
        new Te(0.86, 0.54),
        new X({ map: ccsPlaque(t), roughness: 0.5, metalness: 0.05, polygonOffset: !0, polygonOffsetFactor: -2 }),
      );
      (h.position.copy(o(e.side * 6.645, 0.94, e.gz - 0.58)), s.add(h));
      // ดอกไม้ที่วางให้น้อง (ยิ่งวางมาก ยิ่งเยอะ) หน้าหิน
      let f = Jc(ds[t.flower % ds.length], Math.min(14, 4 + t.flowers * 2));
      (f.position.copy(o(e.side * 6.2, 0.26, e.gz - 0.58)), f.scale.setScalar(r * 1.1), (f.rotation.y = Math.PI / 2), s.add(f));
      // รูปปั้นน้อง
      let d = L6(t.kind);
      (d.position.copy(o(e.side * 5.75, 0.26, e.gz + 0.75)), d.scale.setScalar(r * 0.95), (d.rotation.y = 0.4), s.add(d));
      // เทียน: จุดแล้วมีเปลวไฟบนเทียนในโมเดล
      if (t.lit) {
        let u = D6(!0);
        (u.position.copy(o(e.side * 5.17, 0.3, e.gz + 0.46)), u.scale.setScalar(r * 1.3), s.add(u));
      }
    }
    (oo(s, !0), (wn.plots[i] = s), wn.g.add(s));
  }
  // v79: รวมเมชส่วนนิ่งของสวนสายรุ้ง (พุ่มไม้ 40 ลูก ดอกไม้ ซุ้มรุ้ง ต้นซากุระ โคมไฟ จิโซ) จาก ~190 draw call
  // แปลงที่ระลึกกับดอกไม้ที่วางเองแยกไว้ เพราะสร้างใหม่ได้ระหว่างเล่น
  function ccsMergeGarden() {
    let i = wn.g,
      e = [...wn.plots.filter(Boolean), ln.flowers].filter((t) => t.parent === i);
    for (let t of e) i.remove(t);
    try {
      oo(i, !0);
    } catch (t) {
      console.warn("merge garden", t);
    }
    for (let t of e) i.add(t);
  }
  function PC() {
    hb();
  }
  // จุดชน (พิกัดโมเดล: x, z, กว้าง, ลึก)
  var GC0 = [
    [-2.45, 11.3, 0.72, 0.72], [2.45, 11.3, 0.72, 0.72], [-3.6, 11.25, 1, 1], [3.6, 11.25, 1, 1],
    [-4.46, 10.12, 0.3, 0.3], [4.6, 10.98, 0.3, 0.3], [-3.5, 9.45, 1.24, 1.24], [3.5, 9.45, 1.24, 1.24],
    [0, -10, 2.4, 2.4], [0, -11.28, 2.3, 0.5], [-3.82, -9.55, 0.8, 0.85], [3.82, -9.55, 0.8, 0.85],
    [-4.35, -8.85, 1.8, 0.8], [4.35, -8.85, 1.8, 0.8],
    [-9.75, 4.8, 1.1, 1.05], [9.75, 4.8, 1.1, 1.05], [-9.75, -4.9, 1.1, 1.05], [9.75, -4.9, 1.1, 1.05],
    [-10.14, 9.1, 0.55, 0.55], [10.16, 9.1, 0.55, 0.55], [-10.34, 0.4, 0.55, 0.55], [10.36, 0.4, 0.55, 0.55], [-10.09, -9.4, 0.55, 0.55], [10.11, -9.4, 0.55, 0.55],
    [-2.25, 7, 0.3, 0.3], [2.25, 2.7, 0.3, 0.3], [-2.25, -1.7, 0.3, 0.3], [2.25, -6.1, 0.3, 0.3],
  ];
  function IC() {
    let i = wn.g;
    (i.position.copy(hn), K.add(i));
    for (let [e, t, n, s] of GC0) pt.push({ x: hn.x + e * ccsGS, z: hn.z + t * ccsGS, hw: (n / 2) * ccsGS, hd: (s / 2) * ccsGS });
    // หินแต่ละแปลง
    for (let e of kr) pt.push({ x: hn.x + e.side * 6.88 * ccsGS, z: hn.z + (e.gz - 0.58) * ccsGS, hw: 0.3 * ccsGS, hd: 0.62 * ccsGS });
    // ไฟโคม 4 ดวง (ใช้ระบบไฟกลางคืนรวมของเมือง)
    for (let [e, t] of [
      [-2.25, 7],
      [2.25, 2.7],
      [-2.25, -1.7],
      [2.25, -6.1],
    ]) {
      let n = new En(16763274, 0, 7, 1.6);
      (n.position.set(hn.x + e * ccsGS, 1.37 * ccsGS, hn.z + t * ccsGS), K.add(n), H0.push({ l: n, on: 6 }));
    }
    let e = (t, n, s, o, r) => {
      let a = new Float32Array(t * 3);
      for (let h = 0; h < t; h++)
        ((a[h * 3] = (Math.random() - 0.5) * o), (a[h * 3 + 1] = Math.random() * 3.6), (a[h * 3 + 2] = (Math.random() - 0.5) * r));
      let c = new qe();
      c.setAttribute("position", new Je(a, 3));
      let l = new bs(
        c,
        new ls({ color: n, size: s, transparent: !0, opacity: 0.9, depthWrite: !1, blending: n === 16774560 ? $i : Qo }),
      );
      return ((l.userData.noOcc = !0), i.add(l), l);
    };
    ((wn.petals = e(70, 16758479, 0.09, 15, 15)), (wn.flies = e(46, 16774560, 0.12, 14, 15)));
  }
  // v82: รูปปั้นอนุสาวรีย์น้องข้าวต้ม (โมเดลเชาเชาตัวจริง) สีหินเทา ใหญ่กว่าตัวจริง 2 เท่า บนแท่นกลางสวน
  // (โมเดลน้องอาจโหลดเสร็จทีหลัง → เรียกซ้ำจากลูปสวนจนกว่าจะสร้างได้)
  function ccsGardenStatue() {
    if (wn.statue || !wn.model) return;
    try {
      if (Fc()) {
        let e = ui(z.coat ?? "orange", 1.6),
          t = new X({ color: 10988712, roughness: 0.88, metalness: 0.02 }),
          n = new X({ color: 6974056, roughness: 0.8 });
        (e.root.traverse((s) => {
          let o = s;
          o.isMesh && ((o.material = /eye|nose|tongue|mouth/i.test(o.material?.name ?? "") ? n : t), (o.castShadow = !0), (o.userData.noMerge = !0));
        }),
          e.root.position.set(0, 0, -10 * ccsGS),
          e.root.updateMatrixWorld(!0));
        {
          // ยืนบนแท่นพอดี ไม่จม: ให้เท้าต่ำสุดอยู่ที่ผิวแท่น
          let s = new mt().setFromObject(e.root);
          e.root.position.y = 0.6 * ccsGS + 0.012 + 0.03 - s.min.y;
        }
        (wn.g.add(e.root),
          (wn.statue = e));
      }
    } catch (e) {
      console.warn("garden statue", e);
    }
  }
  // วางโมเดลสวน (เรียกหลังโหลดโมเดลเสร็จ) · โมเดลรวมเมชมาแล้ว: ทั้งสวน ~6 draw call
  function ccsGardenModel() {
    if (!ze("rb_garden") || wn.model) return;
    let i = vp.rb_garden.clone(!0);
    (i.scale.setScalar(ccsGS), (i.position.y = 0.012 + 0.06 * ccsGS)); // โมเดลถูกกดลงตามขนาดผิวเพื่อกันกระพริบ ยกกลับขึ้นตรงนี้
    i.traverse((e) => {
      let t = e;
      if (!t.isMesh) return;
      let n = t.material;
      // รวมเป็นชิ้นใหญ่: พื้น/แปลงไม่ต้องให้ระบบฉากบังกล้องจับ, ของสูง (ซากุระ ประตู รุ้ง รูปปั้น) โปร่งแสงได้เมื่อบังน้อง
      ((t.castShadow = !1), (t.receiveShadow = !0), (t.userData.noMerge = !0), n.name !== "rbg_tall" && (t.userData.noOcc = !0));
      n.name === "rbg_glow"
        ? ((n.emissive = new ae(16768656)), (n.emissiveIntensity = 0.1), (n.toneMapped = !1), wn.lanterns.push(n))
        : /rbg_(static|tall)/.test(n.name) && ((n.vertexColors = !0), (n.roughness = 0.92));
      n.map && (n.map.anisotropy = 4);
    });
    ((wn.model = i), wn.g.add(i));
    // v83: ต้นไม้จริงแทนซากุระการ์ตูน 6 ต้น
    for (let [e, t, n] of [[-10.14, 9.1, "tree_r2"], [10.16, 9.1, "tree_r3"], [-10.34, 0.4, "tree_r3"], [10.36, 0.4, "tree_r2"], [-10.09, -9.4, "tree_r2"], [10.11, -9.4, "tree_r3"]]) {
      if (!ze(n)) continue;
      let s = Zp(n, 5.2 + Math.abs(e * t) % 0.8);
      ((s.userData.tree = !1), s.position.set(e * ccsGS, 0.02, t * ccsGS), (s.rotation.y = e + t), wn.g.add(s));
    }
    ccsGardenStatue();
    // v82: รุ้งโมเดลใหม่ (Rainbow) แทนซุ้มรุ้งเดิม คร่อมหลังรูปปั้น
    if (ze("rainbow_arc")) {
      // v83: รุ้งใหญ่ขึ้นและอยู่หลังรูปปั้น วงในสูงกว่าหัวรูปปั้น ไม่ทับกัน
      let e = je("rainbow_arc", 15.5 * ccsGS);
      (e.position.set(0, 0.02, -11.7 * ccsGS),
        e.traverse((t) => {
          let n = t;
          n.isMesh && ((n.castShadow = !1), (n.userData.noMerge = !0));
        }),
        wn.g.add(e));
    }
  }
  function FC(i, e) {
    if (!wn.petals) return;
    wn.t += i;
    let t0 = e.pos.distanceTo(hn),
      t = t0 < 40;
    // v81: เดินเข้าใกล้ (<75 ม.) → ส่งโมเดลสวนขึ้นการ์ดจอไว้ก่อน 1 ครั้ง (เดิมค้างตอนสวนโผล่ครั้งแรก)
    if (!wn.warm && wn.model && t0 < 75 && !Se) {
      wn.warm = !0;
      let n = wn.g.visible,
        s = new qn(4, 4, { type: Zi }),
        o = new Tn(100, 1, 0.5, 40),
        r = dn.shadowMap.autoUpdate;
      try {
        ((wn.g.visible = !0), o.position.set(hn.x, 18, hn.z), o.lookAt(hn), o.updateMatrixWorld(), (dn.shadowMap.autoUpdate = !1), dn.setRenderTarget(s), dn.render(K, o));
      } catch (a) {
        console.warn("warm garden", a);
      } finally {
        (dn.setRenderTarget(null), (dn.shadowMap.autoUpdate = r), (wn.g.visible = n), s.dispose());
      }
    }
    if (((wn.g.visible = t && !Se), !t)) return;
    wn.statue || ccsGardenStatue();
    let n = 1 - Math.min(1, Math.max(0, (Math.sin((j.time - 0.25) * Math.PI * 2) + 0.15) * 3));
    for (let r of wn.lanterns) r.emissiveIntensity = 0.1 + n * 2.4;
    let s = wn.petals.geometry.attributes.position;
    for (let r = 0; r < s.count; r++) {
      let a = s.getY(r) - i * 0.35,
        c = s.getX(r) + Math.sin(wn.t + r) * i * 0.25;
      (a < 0.02 && ((a = 3.4 + Math.random() * 0.6), (c = (Math.random() - 0.5) * 15)), s.setXY(r, c, a));
    }
    ((s.needsUpdate = !0), (wn.petals.material.opacity = 0.9 * (1 - n * 0.6)));
    let o = wn.flies.geometry.attributes.position;
    for (let r = 0; r < o.count; r++)
      o.setXYZ(
        r,
        o.getX(r) + Math.sin(wn.t * 0.7 + r * 2.1) * i * 0.3,
        0.3 + (Math.sin(wn.t * 0.9 + r) * 0.5 + 0.5) * 2,
        o.getZ(r) + Math.cos(wn.t * 0.6 + r * 1.3) * i * 0.3,
      );
    ((o.needsUpdate = !0),
      (wn.flies.material.opacity = n * (0.6 + 0.4 * Math.sin(wn.t * 3))),
      wn.g.traverse((r) => {
        r.userData.halo && (r.position.y += Math.sin(wn.t * 2 + r.id) * i * 0.02);
      }));
  }
  var Jp = z,
    ln = { on: !1, pad: null, padV: 0, btn: null, flowers: new J() };
  function zC() {
    let i = _i();
    if (!i) return null;
    let e = i.createGain();
    e.gain.value = 0;
    let t = i.createBiquadFilter();
    ((t.type = "lowpass"), (t.frequency.value = 900), t.connect(e), e.connect(i.destination));
    let n = [
        [261.6, 329.6, 392],
        [220, 261.6, 329.6],
        [174.6, 220, 261.6],
        [196, 246.9, 293.7],
      ],
      s = [0, 1, 2].flatMap(() =>
        [0, 1].map((c) => {
          let l = i.createOscillator();
          ((l.type = "sine"), (l.detune.value = c ? 7 : -7));
          let h = i.createGain();
          return ((h.gain.value = 0.12), l.connect(h).connect(t), l.start(), l);
        }),
      ),
      o = 0,
      r = () => {
        let c = n[o++ % n.length];
        s.forEach((l, h) => l.frequency.setTargetAtTime(c[Math.floor(h / 2)], i.currentTime, 1.2));
      };
    r();
    let a = setInterval(r, 6e3);
    return {
      g: e,
      stop: () => {
        (clearInterval(a), s.forEach((c) => c.stop()), e.disconnect());
      },
    };
  }
  function m1(i) {
    ln.on !== i &&
      ((ln.on = i),
      document.body.classList.toggle("calm", i),
      i
        ? (qs(),
          (j.dist = 8.5),
          De(
            "🕊 โหมดสงบ \xB7 แตะที่ไหนก็ได้เพื่อกลับ",
            2600,
          ),
          R1(!1),
          setTimeout(() => addEventListener("pointerdown", LC, { once: !0 }), 400))
        : ((j.pitch = Math.max(j.pitch, 0.42)), (j.dist = 13), z.music && R1(!0)));
  }
  var LC = () => m1(!1);
  function hb() {
    (ln.flowers.parent || wn.g.add(ln.flowers), ln.flowers.clear());
    for (let [i, e, t] of Jp.gFlowers ?? []) {
      let n = Jc(ds[t % ds.length], 5);
      (n.position.set(i - hn.x, 0.02, e - hn.z), ln.flowers.add(n));
    }
    oo(ln.flowers, !0);
  }
  // อยู่ในพื้นที่สวน (สี่เหลี่ยมตามโมเดล) · m = ระยะเผื่อ (เมตร)
  function inGarden(i, m = 0) {
    return Math.abs(i.x - hn.x) < 12.2 * ccsGS + m && Math.abs(i.z - hn.z) < 13.2 * ccsGS + m;
  }
  function DC(i) {
    if (Se) return !1;
    let e = Math.abs(i.x - hn.x) / ccsGS,
      t0 = (i.z - hn.z) / ccsGS;
    return !inGarden(i, -0.6) ||
      (e < 1.6 && t0 > -12) ||
      t0 < -7.4 ||
      t0 > 10.4 ||
      kr.some((t) => Math.hypot(i.x - t.x, i.z - t.z) < 1.8)
      ? !1
      : (nt(
          "🌼 วางดอกไม้ตรงนี้",
          () => {
            let t = Jp.gFlowers ?? (Jp.gFlowers = []),
              n = Math.floor(Math.random() * ds.length);
            (t.push([+i.x.toFixed(2), +i.z.toFixed(2), n]),
              t.length > 40 && t.shift(),
              hb(),
              _t(z),
              ke("heart"),
              rt(["🌸", "🌼", "💐"][n % 3], i.clone().setY(1.2)));
          },
        ),
        !0);
  }
  function BC(i, e) {
    let t = !Se && inGarden(e.pos);
    (ln.btn ||
      ((ln.btn = document.createElement("button")),
      (ln.btn.id = "calmBtn"),
      (ln.btn.textContent = "🕊 โหมดสงบ"),
      document.body.appendChild(ln.btn),
      ln.btn.addEventListener("click", (s) => {
        (s.stopPropagation(), m1(!0));
      })),
      ln.btn.classList.toggle("on", t && !ln.on && j.started),
      ln.on && !t && m1(!1),
      ln.on && ((j.yaw += i * 0.07), (j.pitch += (0.22 - j.pitch) * Math.min(1, i * 0.8))));
    let n = z.music ? (ln.on ? 0.22 : t ? 0.08 : 0) : 0;
    (!1, // v83: ไม่เปิดเพลงตอนเข้าสวน
      ln.pad &&
        ((ln.padV += (n - ln.padV) * Math.min(1, i * 0.8)),
        (ln.pad.g.gain.value = ln.padV),
        n === 0 && ln.padV < 0.003 && (ln.pad.stop(), (ln.pad = null), (ln.padV = 0))));
  }
  async function OC(i) {
    let e = f1(),
      t = document.getElementById("mfWeb");
    if (!t) return;
    if (!e) {
      t.innerHTML =
        '<p class="note">เข้าสู่ระบบในแอป ChowChowStory ก่อน จึงจะดึงรายชื่อน้องจากกำแพงรำลึกของคุณได้</p>';
      return;
    }
    let n = "";
    try {
      n = JSON.parse(atob(e.t.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))).sub;
    } catch {}
    t.innerHTML = '<p class="note">กำลังโหลด…</p>';
    try {
      let o = await (
        await xd(
          `memorials?select=dog_name,years,message&user_id=eq.${encodeURIComponent(n)}&order=created_at.desc&limit=12`,
          void 0,
          e,
        )
      ).json();
      if (!Array.isArray(o) || !o.length) {
        t.innerHTML =
          '<p class="note">ยังไม่มีน้องในกำแพงรำลึกของคุณ</p>';
        return;
      }
      let r = (a) => a.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
      ((t.innerHTML =
        '<p class="note">เลือกน้องที่อยากให้มาอยู่ในสวนนี้ (เลือกเองเท่านั้น):</p>' +
        o
          .map(
            (a, c) =>
              `<button class="bigbtn ghost" data-wm="${c}">🌈 ${r(a.dog_name)}${a.years ? " \xB7 " + r(a.years) : ""}</button>`,
          )
          .join("")),
        t.querySelectorAll("[data-wm]").forEach((a) =>
          a.addEventListener("click", () => {
            let c = o[+a.dataset.wm];
            (i({ name: c.dog_name.slice(0, 16), years: (c.years ?? "").slice(0, 20), msg: c.message.slice(0, 60) }),
              (t.innerHTML =
                '<p class="note">ใส่ข้อมูลให้แล้ว กด "สร้างที่ระลึก" เพื่อยืนยัน</p>'));
          }),
        ));
    } catch {
      t.innerHTML =
        '<p class="note">โหลดไม่สำเร็จ ลองใหม่อีกครั้ง</p>';
    }
  }
  function NC(i) {
    if (Se || !inGarden(i, 0.5)) return !1;
    let e = No.memorials ?? (No.memorials = []);
    for (let t = 0; t < yd; t++) {
      let n = kr[t];
      if (Math.hypot(i.x - n.x, i.z - n.z) > 2.1) continue;
      let s = e[t];
      return s
        ? (nt(`🌈 ${s.name}`, () => GC(t)), !0)
        : (nt(
            "🌈 สร้างที่ระลึกให้น้อง",
            () => CE(t),
          ),
          !0);
    }
    if (DC(i)) return !0;
    if (i.distanceTo(hn) < 3.2) {
      let t = kr.findIndex((n, s) => !e[s]);
      return (
        nt(
          t >= 0
            ? "🌈 สร้างที่ระลึกให้น้อง"
            : "🌈 สวนสายรุ้ง",
          () =>
            t >= 0
              ? CE(t)
              : De(
                  "แปลงที่ระลึกครบ 8 แปลงแล้ว แตะที่หินของน้องเพื่อวางดอกไม้หรือแก้ไขได้นะ",
                  3e3,
                ),
        ),
        !0
      );
    }
    return !1;
  }
  function CE(i, e = !1) {
    let t = (No.memorials ?? (No.memorials = []))[i],
      n = (o) => o.replace(/[&<>"]/g, (r) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[r]);
    (Gi(
      e
        ? "แก้ไขที่ระลึก 🌈"
        : "สร้างที่ระลึกให้น้อง 🌈",
      `<div class="memf">
    <p class="note">ที่นี่คือสวนสำหรับคิดถึงน้องหมาที่เคยอยู่ด้วยกัน ใส่ชื่อและคำที่อยากบอกน้องได้เลย 💛</p>
    <label>ชื่อน้อง<input id="mfName" maxlength="16" value="${n(t?.name ?? "")}" placeholder="เช่น ข้าวต้ม"></label>
    <label>ปีที่อยู่ด้วยกัน (ไม่ใส่ก็ได้)<input id="mfYears" maxlength="20" value="${n(t?.years ?? "")}" placeholder="เช่น 2012 – 2024"></label>
    <label>ข้อความถึงน้อง<input id="mfMsg" maxlength="60" value="${n(t?.msg ?? "")}" placeholder="เช่น ขอบคุณที่อยู่ด้วยกันนะ"></label>
    <label>รูปปั้นน้อง<select id="mfKind">${AC.map(([o, r]) => `<option value="${o}"${t?.kind === o ? " selected" : ""}>${r}</option>`).join("")}</select></label>
    <div class="mfFl">ดอกไม้ ${ds.map((o, r) => `<button data-fl="${r}" class="${(t?.flower ?? 0) === r ? "on" : ""}" style="background:#${o.toString(16).padStart(6, "0")}"></button>`).join("")}</div>
    ${e ? "" : '<button class="bigbtn ghost" id="mfWebBtn">📥 ดึงชื่อน้องจากกำแพงรำลึกบนเว็บ (ของฉัน)</button><div id="mfWeb"></div>'}
    <button class="bigbtn" id="mfSave">${e ? "บันทึก" : "สร้างที่ระลึก"}</button></div>`,
    ),
      document.getElementById("mfWebBtn")?.addEventListener(
        "click",
        () =>
          void OC((o) => {
            ((it("mfName").value = o.name), (it("mfYears").value = o.years), (it("mfMsg").value = o.msg));
          }),
      ));
    let s = t?.flower ?? 0;
    (Ea.querySelectorAll("[data-fl]").forEach((o) =>
      o.addEventListener("click", () => {
        ((s = +o.dataset.fl), Ea.querySelectorAll("[data-fl]").forEach((r) => r.classList.toggle("on", r === o)));
      }),
    ),
      it("mfSave").addEventListener("click", () => {
        let o = it("mfName").value.trim();
        if (!o) {
          it("mfName").focus();
          return;
        }
        ((No.memorials[i] = {
          name: o,
          years: it("mfYears").value.trim(),
          msg: it("mfMsg").value.trim(),
          kind: it("mfKind").value,
          coat: "",
          flower: s,
          flowers: t?.flowers ?? 1,
          lit: t?.lit ?? !0,
        }),
          _t(z),
          T0(i),
          qs(),
          ke("heart"),
          rt("🌈 💛", new H(kr[i].x, 1.6, kr[i].z), "big"),
          De(
            `${o} จะอยู่ที่สวนสายรุ้งตรงนี้เสมอ 🌈 แวะมาวางดอกไม้ได้ทุกวันนะ`,
            3800,
          ));
      }));
  }
  function GC(i) {
    let e = No.memorials[i];
    (Gi(
      `🌈 ${e.name}`,
      `<div class="care"><p>${e.years ? `<b>${e.years.replace(/</g, "&lt;")}</b><br>` : ""}${(e.msg || "").replace(/</g, "&lt;")}</p><p class="note">วางดอกไม้แล้ว ${e.flowers} ครั้ง</p></div>
    <div class="offerBtns"><button class="bigbtn" id="mmFl">💐 วางดอกไม้</button><button class="bigbtn ghost" id="mmCd">${e.lit ? "🕯 ดับเทียน" : "🕯 จุดเทียน"}</button></div>
    <div class="offerBtns" style="margin-top:6px"><button class="bigbtn ghost" id="mmEd">✏️ แก้ไข</button><button class="bigbtn ghost" id="mmDel">ย้ายออก</button></div>`,
    ),
      it("mmFl").addEventListener("click", () => {
        (e.flowers++, _t(z), T0(i), qs(), ke("heart"));
        for (let t = 0; t < 3; t++)
          setTimeout(
            () =>
              rt(
                ["💛", "🌸", "🌈"][t],
                new H(kr[i].x + (t - 1) * 0.3, 1.3 + t * 0.2, kr[i].z),
                "big",
              ),
            t * 350,
          );
        De(
          `วางดอกไม้ให้${e.name}แล้ว 💐 น้องคงดีใจที่ยังคิดถึงกัน`,
          3200,
        );
      }),
      it("mmCd").addEventListener("click", () => {
        ((e.lit = !e.lit), _t(z), T0(i), qs(), ke("pop"));
      }),
      it("mmEd").addEventListener("click", () => CE(i, !0)),
      it("mmDel").addEventListener("click", () => {
        let t = it("mmDel");
        t.dataset.sure
          ? ((No.memorials[i] = void 0), _t(z), T0(i), qs())
          : ((t.dataset.sure = "1"),
            (t.textContent =
              "แตะอีกครั้งเพื่อยืนยัน"));
      }));
  }
  IC();
  function UC() {
    let i = Se ? WE.get(Se) : null;
    i &&
      ((qE = GE ? 6 : 1), // v79: มือถือวาดวิวนอกหน้าต่างร้านทุก 6 วิ (เดิม 0.3–0.8 วิ = วาดทั้งเมืองซ้ำในร้าน กระตุก)
      ha.position.copy(i.pos),
      (ha.fov = i.fov),
      (ha.aspect = i.aspect),
      (ha.near = i.near),
      (ha.far = GE ? 32 : 60), // v79: วิวนอกหน้าต่างเห็นแค่ถนนหน้าร้าน ไม่ต้องวาดทั้งเมือง (เดิม ~2,100 draw call ต่อครั้ง)
      ha.updateProjectionMatrix(),
      ha.lookAt(i.look),
      dn.setRenderTarget(VE),
      dn.render(K, ha),
      dn.setRenderTarget(null));
  }
  function Qp(i, e) {
    (i.rig.root.position.copy(i.pos),
      i === Le[0] && hT(i.rig, e, i.spd > 0.3 || (j.jy > 0.01 && !ho?.tr?.tbOn), !!j.sleeping, uo), // v132: ตอนฝึกนั่งบนโต๊ะ (ตัวลอย) ไม่ล้างท่านั่ง
      Qi(i.rig, e, i.spd, i.dir));
  }
  var W3 = [
      ["sit", 20, 6, 11],
      ["happy", 12, 3, 5],
      ["sniff", 12, 2.5, 4],
      ["look", 10, 3, 4.5],
      ["alert", 8, 3, 5],
      ["tilt", 8, 2, 2.8],
      ["beg", 7, 3, 5],
      ["wary", 6, 3, 4.5],
      ["shake", 6, 1.1, 1.3],
      ["scratch", 6, 2, 2.6],
      ["bow", 7, 1.8, 2.6],
      ["yawn", 5, 2, 2.4],
      ["lie", 12, 9, 18],
      ["roll", 6, 5, 9],
      ["scared", 2, 2, 3],
    ],
    B6 = new WeakMap(),
    lT = !1;
  function hT(i, e, t, n, s) {
    if (lT) return;
    let o = B6.get(i);
    if ((o || ((o = { it: 0, end: 0, next: 2.5 + Math.random() * 2 }), B6.set(i, o)), s)) {
      (Io(i, "none"), (o.it = 0));
      return;
    }
    if (n) {
      (Io(i, "sleep"), (o.it = 0));
      return;
    }
    if ((gp(i) === "sleep" && (Io(i, "none"), (o.it = 0), (o.next = 3 + Math.random() * 3)), t)) {
      (gp(i) !== "none" && Io(i, "none"), (o.it = 0), (o.next = 2.5 + Math.random() * 2.5));
      return;
    }
    o.it += e;
    let r = gp(i);
    if (r !== "none") {
      if (o.it > o.end) {
        let a =
          r === "sit" && Math.random() < 0.35
            ? "lie"
            : r === "lie" && Math.random() < 0.3
              ? "roll"
              : r === "roll"
                ? "lie"
                : "none";
        (Io(i, a), (o.it = 0), (o.end = 6 + Math.random() * 8), (o.next = 2 + Math.random() * 3));
      }
      return;
    }
    if (o.it > o.next) {
      let a = W3.reduce((h, f) => h + f[1], 0),
        c = Math.random() * a,
        l = W3[0];
      for (let h of W3)
        if (((c -= h[1]), c <= 0)) {
          l = h;
          break;
        }
      (Io(i, l[0]), (o.it = 0), (o.end = l[2] + Math.random() * (l[3] - l[2])));
    }
  }
  var ns = vn + Xc * 0.5,
    kE = [b0],
    vs = { T: 60, carGreen: 38, carYellow: 41, walk0: 42, walk1: 57 },
    dT = 0,
    db = () => {
      let i = dT % vs.T;
      return {
        t: i,
        car: i < vs.carGreen ? "green" : i < vs.carYellow ? "yellow" : "red",
        walk: i >= vs.walk0 && i < vs.walk1,
        left: i < vs.walk0 ? vs.walk0 - i : i < vs.walk1 ? vs.walk1 - i : vs.T - i + vs.walk0,
      };
    },
    VC = () => {
      let i = db();
      return i.walk && vs.walk1 - i.t > 2.5;
    },
    fT = [],
    uT = (i) => {
      let e = document.createElement("canvas");
      e.width = e.height = 128;
      let t = e.getContext("2d");
      ((t.fillStyle = "#111"),
        t.fillRect(0, 0, 128, 128),
        (t.fillStyle = i ? "#39ff7a" : "#ff3b30"),
        t.beginPath(),
        t.arc(64, 24, 12, 0, Math.PI * 2),
        t.fill(),
        (t.lineCap = "round"),
        (t.strokeStyle = t.fillStyle),
        (t.lineWidth = 16),
        i
          ? (t.beginPath(),
            t.moveTo(62, 42),
            t.lineTo(56, 78),
            t.lineTo(40, 112),
            t.moveTo(56, 78),
            t.lineTo(78, 110),
            t.moveTo(60, 50),
            t.lineTo(84, 66),
            t.moveTo(60, 50),
            t.lineTo(40, 68),
            t.stroke())
          : (t.beginPath(),
            t.moveTo(64, 42),
            t.lineTo(64, 80),
            t.moveTo(56, 80),
            t.lineTo(54, 114),
            t.moveTo(72, 80),
            t.lineTo(74, 114),
            t.moveTo(52, 48),
            t.lineTo(46, 80),
            t.moveTo(76, 48),
            t.lineTo(82, 80),
            t.stroke()));
      let n = new ut(e);
      return ((n.colorSpace = Ye), n);
    },
    WC = uT(!0),
    PE = uT(!1);
  function qC() {
    let i = new X({ color: 3818064, roughness: 0.5, metalness: 0.4 }),
      e = new X({ color: 1909288, roughness: 0.6 });
    for (let t of [-1, 1]) {
      let n = b0 - t * (el / 2 + 0.9),
        s = t * (gH + 0.15),
        o = new J();
      (o.position.set(n, 0, s), K.add(o));
      let r = new R(new re(0.08, 0.1, 4.6, 10), i);
      ((r.position.y = 2.3), o.add(r));
      let a = new R(new re(0.06, 0.06, 2.4, 8), i);
      ((a.rotation.x = Math.PI / 2), a.position.set(0, 4.45, -t * 1.15), o.add(a));
      let c = new J();
      (c.position.set(0, 4.45, -t * 2.1),
        (c.rotation.y = t > 0 ? -Math.PI / 2 : Math.PI / 2),
        o.add(c),
        c.add(new R(new ee(0.42, 1.2, 0.3), e)));
      let l = [];
      [16726832, 16761856, 3800954].forEach((y, x) => {
        let b = new be({ color: new ae(y).multiplyScalar(0.18) });
        ((b.userData.on = y), l.push(b));
        let w = new R(new gt(0.13, 18), b);
        (w.position.set(0, 0.36 - x * 0.36, 0.16), c.add(w));
        let v = new R(new re(0.15, 0.15, 0.14, 16, 1, !0, -Math.PI / 2, Math.PI), e);
        ((v.rotation.x = Math.PI / 2), v.position.set(0, 0.42 - x * 0.36, 0.22), c.add(v));
      });
      let h = new J();
      (h.position.set(0, 2.6, 0),
        (h.rotation.y = t < 0 ? 0 : Math.PI),
        o.add(h),
        h.add(new R(new ee(0.5, 1.1, 0.22), e)));
      let f = new be({ map: PE }),
        d = new R(new Te(0.42, 0.42), f);
      (d.position.set(0, 0.25, 0.115), h.add(d));
      let u = document.createElement("canvas");
      ((u.width = 128), (u.height = 96));
      let p = u.getContext("2d"),
        m = new ut(u);
      m.colorSpace = Ye;
      let E = new R(new Te(0.42, 0.32), new be({ map: m }));
      (E.position.set(0, -0.26, 0.115),
        h.add(E),
        fT.push({ car: l, ped: f, num: m, ctx: p, lastN: -1, lastWalk: null }),
        pt.push({ x: n, z: s, hw: 0.16, hd: 0.16 }));
      let g = new R(new ee(0.16, 0.24, 0.1), new X({ color: 16765503 }));
      (g.position.set(0, 1.1, t * -0.1), (g.rotation.y = t < 0 ? 0 : Math.PI), o.add(g));
    }
  }
  var Er = null,
    ra = null,
    Qc = null,
    O6 = !1;
  async function jC() {
    let i = _i();
    if (!(!i || Qc || O6)) {
      O6 = !0;
      try {
        let e = window,
          t;
        if (e.__XW) {
          let n = atob(e.__XW),
            s = new Uint8Array(n.length);
          for (let o = 0; o < n.length; o++) s[o] = n.charCodeAt(o);
          t = s.buffer;
        } else t = await (await fetch(nb("japan_crosswalk.mp3"))).arrayBuffer();
        Qc = await i.decodeAudioData(t);
      } catch (e) {
        console.warn("xw", e);
      }
    }
  }
  function pT(i, e) {
    dT += i;
    let t = db();
    for (let r of fT) {
      r.car.forEach((h, f) => {
        let d = (f === 0 && t.car === "red") || (f === 1 && t.car === "yellow") || (f === 2 && t.car === "green");
        (h.color.setHex(h.userData.on), d || h.color.multiplyScalar(0.16));
      });
      let a = !t.walk || vs.walk1 - t.t > 4 || Math.floor(t.t * 3) % 2 === 0,
        c = t.walk && a;
      r.lastWalk !== c &&
        ((r.ped.map = t.walk && c ? WC : PE),
        t.walk && !c ? r.ped.color.setHex(2236962) : r.ped.color.setHex(16777215),
        (r.ped.needsUpdate = !0),
        (r.lastWalk = c));
      let l = Math.ceil(t.left);
      if (l !== r.lastN) {
        r.lastN = l;
        let h = r.ctx;
        ((h.fillStyle = "#111"),
          h.fillRect(0, 0, 128, 96),
          (h.fillStyle = t.walk ? "#39ff7a" : "#ff3b30"),
          (h.font = "700 70px Mitr, monospace"),
          (h.textAlign = "center"),
          (h.textBaseline = "middle"),
          h.fillText(String(l).padStart(2, "0"), 64, 52),
          (r.num.needsUpdate = !0));
      }
    }
    let n = j.started ? _i() : null;
    n && !Qc && jC();
    let s = e && !Se ? Math.hypot(e.pos.x - b0, e.pos.z) : 999,
      o = t.walk && s < 45 && !!Qc && !!n;
    if (
      (o &&
        !Er &&
        n &&
        Qc &&
        ((ra = n.createGain()),
        (ra.gain.value = 0),
        ra.connect(n.destination),
        (Er = n.createBufferSource()),
        (Er.buffer = Qc),
        (Er.loop = !0),
        Er.connect(ra),
        Er.start()),
      Er && ra)
    ) {
      let r = o ? 0.55 * Math.max(0, 1 - Math.max(0, s - 6) / 39) : 0;
      ((ra.gain.value += (r - ra.gain.value) * Math.min(1, i * 4)),
        !o && ra.gain.value < 0.01 && (Er.stop(), (Er = null)));
    }
  }
  var br = null,
    aa = null;
  function $C(i, e) {
    let t = j.started ? _i() : null;
    if (!t) return;
    let n = e && !Se ? Math.hypot(e.pos.x - fn.x, e.pos.z - fn.z) : 999,
      s = n < 11;
    if (s && !br) {
      let o = Math.floor(t.sampleRate * 3),
        r = t.createBuffer(1, o, t.sampleRate),
        a = r.getChannelData(0),
        c = 0;
      for (let h = 0; h < o; h++) {
        let f = Math.random() * 2 - 1;
        ((c += (f - c) * 0.6), (a[h] = (f - c) * 0.22 * (0.75 + 0.25 * Math.sin((h / t.sampleRate) * 7))));
      }
      for (let h = 0; h < 140; h++) {
        let f = Math.floor(Math.random() * (o - 800)),
          d = 0.25 + Math.random() * 0.55;
        for (let u = 0; u < 500; u++) a[f + u] += (Math.random() * 2 - 1) * d * Math.exp(-u / 70);
      }
      ((aa = t.createGain()), (aa.gain.value = 0));
      let l = t.createBiquadFilter();
      ((l.type = "highpass"),
        (l.frequency.value = 1800),
        aa.connect(t.destination),
        (br = t.createBufferSource()),
        (br.buffer = r),
        (br.loop = !0),
        br.connect(l).connect(aa),
        br.start());
    }
    if (br && aa) {
      let o = s ? 0.35 * Math.max(0, 1 - Math.max(0, n - 2) / 9) : 0;
      ((aa.gain.value += (o - aa.gain.value) * Math.min(1, i * 3)),
        !s && aa.gain.value < 0.005 && (br.stop(), (br = null)));
    }
  }
  addEventListener("message", (i) => {
    let e = i.data;
    if (!e || e.type !== "ccs-safe" || i.origin !== location.origin) return;
    let t = document.documentElement.style;
    for (let [n, s] of [
      ["--sal", e.l],
      ["--sar", e.r],
      ["--sat", e.t],
      ["--sab", e.b],
    ])
      typeof s == "number" && s >= 0 && s < 200 && t.setProperty(n, s + "px");
  });
  function XC() {
    let i =
        /iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1 && innerWidth < 1100),
      e = navigator.standalone || matchMedia("(display-mode: standalone), (display-mode: fullscreen)").matches;
    try {
      if (!i || e || localStorage.getItem("ccs-iosTip")) return;
      localStorage.setItem("ccs-iosTip", "1");
    } catch {
      return;
    }
    let t = document.createElement("div");
    ((t.id = "iosTip"),
      (t.innerHTML =
        '<span style="flex:none;font-size:18px">📲</span><span style="flex:1;line-height:1.45"><b>เล่นเต็มจอแบบแอป:</b> กดปุ่มแชร์ ⬆︎ แล้วเลือก “เพิ่มไปยังหน้าจอโฮม” \xB7 เปิดจากไอคอนเชาเชา แถบเว็บจะหายไป</span><button aria-label="ปิด">✕</button>'),
      (t.style.cssText =
        "position:fixed;left:50%;translate:-50% 0;top:calc(118px + var(--sat));z-index:30;background:#241c15;color:#fff;border-radius:14px;padding:8px 12px;font:500 12.5px Mitr,sans-serif;max-width:min(56vw,460px);box-shadow:0 4px 0 #000;display:flex;gap:8px;align-items:center"),
      (t.querySelector("button").style.cssText =
        "border:0;background:#FFD23F;border-radius:99px;width:24px;height:24px;font-weight:700;flex:none"),
      t.querySelector("button").addEventListener("click", () => t.remove()),
      document.body.appendChild(t),
      setTimeout(() => t.remove(), 14e3));
  }
  var g1 = null;
  function YC(i) {
    if (!GE) return 0;
    let e = new Set(),
      t = 0;
    for (let n of i)
      n.traverse((s) => {
        let o = s.material;
        if (o)
          for (let r of Array.isArray(o) ? o : [o])
            for (let a of ["map", "emissiveMap", "normalMap", "roughnessMap", "metalnessMap", "aoMap"]) {
              let c = r[a];
              if (!c || e.has(c)) continue;
              e.add(c);
              let l = c.image;
              if (!(
                !l ||
                !l.width ||
                l.width < 960 ||
                (typeof HTMLCanvasElement < "u" && l instanceof HTMLCanvasElement)
              ))
                try {
                  let h = document.createElement("canvas");
                  ((h.width = Math.max(1, l.width >> 1)),
                    (h.height = Math.max(1, l.height >> 1)),
                    h.getContext("2d").drawImage(l, 0, 0, h.width, h.height),
                    (c.image = h),
                    (c.needsUpdate = !0),
                    t++);
                } catch {}
            }
      });
    return t;
  }
  function ZC() {
    let i = performance.now(),
      e = 0,
      t = 0;
    try {
      e = YM(K, "tree");
    } catch (n) {
      console.warn("inst", n);
    }
    for (let n of [...K.children]) n.userData.prop && (t += oo(n, n.userData.prop !== "shop"));
    t += oo(oi.ship, !0);
    for (let n of gl) t += oo(n.c.group);
    (_r.push(...zn.map((n) => n.inside.group)), Rn && _r.push(Rn.group));
    for (let n of zn) {
      let s = n.inside.group;
      for (let c of n.inside.wares) c.mesh.userData.noMerge = !0;
      let o = s.children.filter((c) => c.userData.occOK);
      for (let c of o) c.userData.noMerge = !0;
      let r = s.children.length,
        a = 0;
      try {
        a += oo(s, !0);
        for (let c of o) ((c.userData.noMerge = !1), (a += oo(c, !0)), (c.userData.noMerge = !0));
      } catch (c) {
        console.warn("merge interior", c);
      }
      for (let c of s.children) c.userData.merged && (c.userData.noOcc = !0);
      for (let c of o) delete c.userData.noMerge;
      t += a;
    }
    g1 = ZM(K, si === "low" ? 6 : si === "high" ? 12 : 9);
    {
      let n = YC([K, ..._r]);
      n &&
        console.log(
          `[perf] มือถือ: ย่อภาพผิว ${n} ภาพ`,
        );
    }
    for (let n of _r) K.remove(n);
    console.log(
      `[perf] instanced ${e} \xB7 merged ${t} meshes \xB7 lights ${g1.count}→6 \xB7 ${(performance.now() - i) | 0}ms`,
    );
  }
  var E1 = [];
  function KC() {
    E1.length = 0;
    let i = new mt(),
      e = new Sn();
    for (let t of K.children) {
      if (
        _r.includes(t) ||
        t.userData.grassTile ||
        t.userData.noCull ||
        t === ii ||
        t.isLight ||
        (i.setFromObject(t), i.isEmpty()) ||
        (i.getBoundingSphere(e), e.radius < 0.05)
      )
        continue;
      let n = [];
      (t.traverse((s) => {
        (s.isMesh || s.isPoints || s.isSprite) && n.push(s);
      }),
        n.length && E1.push({ o: t, d: e.center.clone().sub(t.position), r: e.radius, meshes: n, off: !1 }));
    }
  }
  var m0 = null,
    hd = null;
  function JC() {
    m0 = new Map();
    for (let e of K.children) {
      let t = e;
      !t.isMesh ||
        t.isInstancedMesh ||
        t.isSkinnedMesh ||
        !t.visible ||
        (Array.isArray(t.material) ? t.material : [t.material]).some(
          (s) => s.transparent || s.type === "ShaderMaterial" || s.type === "MeshBasicMaterial",
        ) ||
        t.onBeforeRender !== Wt.prototype.onBeforeRender ||
        Object.keys(t.geometry.morphAttributes).length ||
        t.userData.noMerge ||
        (t.updateMatrixWorld(), m0.set(t, t.matrixWorld.clone()));
    }
    hd = new Map();
    let i = new Set([...Le.map((e) => e.rig.root), ...Nn.map((e) => e.rig.root), ...wi.map((e) => e.rig.root), ..._r]);
    for (let e of K.children) {
      if (!e.isGroup || i.has(e) || e.userData.merged || e.userData.noMerge) continue;
      let t = 0,
        n = !1;
      if (
        (e.traverse((o) => {
          let r = o;
          (r.isSkinnedMesh && (n = !0), r.isMesh && !r.isInstancedMesh && t++);
        }),
        n || t < 6)
      )
        continue;
      e.updateMatrixWorld(!0);
      let s = [];
      (e.traverse((o) => s.push(...o.matrixWorld.elements)), hd.set(e, new Float32Array(s)));
    }
  }
  function QC() {
    if (!m0) return 0;
    let i = new Map(),
      e = 0,
      t = new Map(),
      n = [];
    K.traverse((a) => {
      let c = a;
      c.isMesh && t.set(c.geometry, (t.get(c.geometry) ?? 0) + 1);
    });
    for (let a of m0.keys()) n.push(a);
    for (let a of hd?.keys() ?? [])
      a.traverse((c) => {
        c.isMesh && n.push(c);
      });
    for (let [a, c] of m0) {
      if (a.parent !== K || !a.visible || (a.updateMatrixWorld(), !a.matrixWorld.equals(c))) continue;
      let l = [];
      if (Array.isArray(a.material)) {
        let d = a.geometry,
          u = d.getIndex();
        if (!u || !d.groups.length) continue;
        for (let p of d.groups) {
          let m = d.clone();
          (m.setIndex(Array.from(u.array).slice(p.start, p.start + p.count)), m.clearGroups());
          let E = new R(m, a.material[p.materialIndex ?? 0]);
          (E.matrix.copy(a.matrixWorld),
            E.matrix.decompose(E.position, E.quaternion, E.scale),
            (E.castShadow = a.castShadow),
            (E.receiveShadow = a.receiveShadow),
            l.push(E));
        }
      } else l.push(a);
      let h = `${Math.floor(a.position.x / 32)},${Math.floor(a.position.z / 32)}`,
        f = i.get(h) ?? (i.set(h, new J()), i.get(h));
      K.remove(a);
      for (let d of l) f.add(d);
      e++;
    }
    let s = 0;
    for (let a of i.values()) (K.add(a), (s += oo(a, !0)));
    for (let [a, c] of hd ?? []) {
      if (a.parent !== K) continue;
      a.updateMatrixWorld(!0);
      let l = [];
      if (
        (a.traverse((h) => l.push(...h.matrixWorld.elements)),
        !(l.length !== c.length || l.some((h, f) => Math.abs(h - c[f]) > 1e-5)))
      )
        try {
          s += oo(a, !0);
        } catch {}
    }
    let o = (a) => {
        for (let c = a; c; c = c.parent) if (c === K) return !0;
        return !1;
      },
      r = 0;
    for (let a of n)
      if (!o(a)) {
        let c = (t.get(a.geometry) ?? 1) - 1;
        (t.set(a.geometry, c), c <= 0 && (a.geometry.dispose(), r++));
      }
    return (
      console.log(
        `[perf] คืนหน่วยความจำเรขาคณิต ${r} ชิ้น`,
      ),
      (hd = null),
      (m0 = null),
      e + s
    );
  }
  function ek() {
    // v79: คอมไพล์ shader ล่วงหน้าทุกเครื่อง (รวมมือถือ) ทีละร้าน ให้สถานะไฟ/หมอกตรงกับตอนอยู่ในร้านจริง
    // ไม่งั้นเข้าร้านครั้งแรกเกมค้าง (มือถือคอมไพล์ใหม่ ~70 shader ตอนเข้าถูกจังมาร์ท)
    // compile ไม่อัปโหลดภาพ จึงไม่กินหน่วยความจำการ์ดจอ
    let i = performance.now(),
      e = 0;
    try {
      e = dn.compile(K, Lt).size;
      // ในร้านมี 3 แบบ: วาดลงจอ, วิวนอกหน้าต่างร้าน (UC → render target VE), ภาพภายในร้านบนกระจกหน้าร้าน (x6 → render target ไม่มีหมอก)
      // render target ใช้สี linear + ไม่ tone map → shader คนละตัวกับวาดลงจอ ต้องคอมไพล์แยก
      let t = K.fog,
        n = (o) => {
          (dn.setRenderTarget(VE), (e += dn.compile(K, o).size), (K.fog = null), (e += dn.compile(K, o).size), (K.fog = t), dn.setRenderTarget(null));
        };
      n(Lt);
      for (let o of _r) {
        let s = !o.parent;
        (s && K.add(o), (e += dn.compile(K, Lt).size), n(Lt), s && K.remove(o));
      }
    } catch (t) {
      console.warn("prewarm", t);
    }
    console.log(`[perf] prewarm ${dn.info.programs.length} shaders (${e} materials) \xB7 ${(performance.now() - i) | 0}ms`);
  }
  var N6 = 0,
    tk = 0,
    G6 = !1,
    U6;
  function nk(i) {
    if (!G6 && j.started && performance.now() / 1e3 > (U6 ?? (U6 = performance.now() / 1e3 + 3)) && (tk -= 1) < 0)
      if (!m0) (JC(), (U6 = performance.now() / 1e3 + 3));
      else {
        let t = QC();
        ((G6 = !0), KC(), console.log(`[perf] merged ${t} loose meshes \xB7 cull ${E1.length}`));
      }
    if ((g1?.update(i, Le[0]?.pos ?? Lt.position, Se ? Se.origin : null), $p?.tick(i), (N6 -= i) > 0)) return;
    N6 = 0.4;
    let e = Lt.position;
    {
      let t = (pa || si === "low" ? 85 : si === "high" ? 150 : 115) * (1 + 0.6 * ccsClar),
        n = pa || si === "low" ? 55 : 80,
        s = new H();
      for (let o of E1) {
        let r = s.copy(o.o.position).add(o.d).distanceTo(e) - o.r > (Se ? 60 : t);
        if (r !== o.off) {
          o.off = r;
          for (let a of o.meshes) a.layers.set(r ? 31 : 0);
        }
      }
      for (let o of v4) {
        let r = o.boundingSphere;
        o.visible = !Se && !!r && r.center.distanceTo(e) - r.radius < n;
      }
    }
    for (let t of Nn) {
      let n = t.shop && t.shop.stage !== "go" && t.shop.stage !== "enter";
      t.rig.root.visible = n ? !Se || Se === t.shop.ins : !Se && t.pos.distanceToSquared(e) < (pa ? 3025 : 5625);
    }
    for (let t of wi) t.rig.root.visible = !Se && t.pos.distanceToSquared(e) < 5625;
    if (pa && !Se) {
      let t = Nn.filter((n) => n.rig.root.visible && !(n.shop && n.shop.stage !== "go")).sort(
        (n, s) => n.pos.distanceToSquared(e) - s.pos.distanceToSquared(e),
      );
      for (let n = 12; n < t.length; n++) t[n].rig.root.visible = !1;
    }
    for (let t of gl) t.c.group.visible = !Se && t.pos.distanceToSquared(e) < 2304;
  }
  var ua = [],
    ik = 900;
  function sk() {
    let i = zn.map((e) => e.door.clone().setY(0));
    return (
      i.push(
        new H(Bo, 0, Mt + 1.2),
        new H(-9, 0, Mt + 1.6),
        new H(-46, 0, Mt + 2.5),
        new H(0, 0, Rt - 4),
        new H(-78, 0, ns),
        new H(78, 0, -ns),
        new H(30, 0, -Mt - 3),
        new H(Hr.x - 2, 0, Hr.z),
      ),
      i
    );
  }
  var q3 = new sr(),
    V6 = new Oe();
  function W6(i) {
    return i.distanceTo(Lt.position) > 70
      ? !1
      : (V6.multiplyMatrices(Lt.projectionMatrix, Lt.matrixWorldInverse),
        q3.setFromProjectionMatrix(V6),
        q3.containsPoint(q6.set(i.x, i.y + 0.8, i.z)) || q3.containsPoint(q6.set(i.x, i.y + 0.1, i.z)));
  }
  var q6 = new H(),
    j6 = (i) => i.id === "grocery" && (i.W ?? 0) > 15,
    $6 = (i, e) => {
      let t = Jr.queue[Math.min(e, Jr.queue.length - 1)];
      return new H(t[0], 0, t[1]).add(i.origin);
    },
    X6 = null,
    j3 = [],
    $3 = { body: null };
  // v82: ตะกร้า/ถุงช้อปปิ้งติดมือจริง — ทุกเฟรมย้ายหูหิ้วไปที่ตำแหน่งกระดูกมือ (ตัวของตั้งตรงเสมอ)
  var ccsHeld = [],
    ccsHV = new H();
  function ccsHoldAdd(i, e, t) {
    let n = i.hands ?? (i.hands = {});
    if (!(t in n)) {
      let s = null;
      (i.root.traverse((o) => {
        o.isBone && (o.name.endsWith(t + "Prop") ? (s = o) : !s && o.name.endsWith(t) && (s = o));
      }),
        (n[t] = s));
    }
    n[t] && ccsHeld.push({ rig: i, obj: e, bone: n[t] });
  }
  function ccsHeldTick() {
    for (let i = ccsHeld.length - 1; i >= 0; i--) {
      let { rig: e, obj: t, bone: n } = ccsHeld[i];
      if (t.parent !== e.root) {
        ccsHeld.splice(i, 1);
        continue;
      }
      if (!e.root.visible) continue;
      (e.root.updateMatrixWorld(), n.getWorldPosition(ccsHV), e.root.worldToLocal(ccsHV), t.position.copy(ccsHV), (t.position.y -= 0.035 / (e.root.scale.y || 1)));
    }
  }
  function ok() {
    let i = new J(),
      e = $3.body ?? ($3.body = new X({ color: 15073298, roughness: 0.6 })),
      t = 0.34,
      n = 0.22,
      s = 0.14,
      o = new R(new ee(t, 0.015, n), e);
    ((o.position.y = -0.2), i.add(o));
    for (let [a, c, l, h] of [
      [0, n / 2, t, 0.012],
      [0, -n / 2, t, 0.012],
      [t / 2, 0, 0.012, n],
      [-t / 2, 0, 0.012, n],
    ]) {
      let f = new R(new ee(l, s, h), e);
      (f.position.set(a, -0.2 + s / 2, c), i.add(f));
    }
    let r = new R(new vt(0.11, 0.01, 6, 14, Math.PI), e);
    return ((r.position.y = -0.06), i.add(r), (i.userData.items = 0), i);
  }
  var Y6 = [16769280, 1929176, 42576, 16742912, 16732067, 16777215];
  function rk(i) {
    let e = i.userData.items;
    if (e >= 5) return;
    i.userData.items = e + 1;
    let t = new R(
      new ee(0.09 + (e % 2) * 0.03, 0.12 + (e % 3) * 0.03, 0.07),
      new X({ color: Y6[e % Y6.length], roughness: 0.5 }),
    );
    (t.position.set(-0.11 + (e % 3) * 0.11, -0.13 + Math.floor(e / 3) * 0.05, e % 2 ? 0.04 : -0.04),
      (t.rotation.y = e * 0.5),
      i.add(t));
  }
  function ak() {
    if ((X6 ?? (X6 = new ee(0.26, 0.3, 0.12)), !j3.length)) {
      let n = new X({ color: 16769280, roughness: 0.7 }),
        s = new X({
          map: ss(64, 72, (o) => {
            ((o.fillStyle = "#ffe100"),
              o.fillRect(0, 0, 64, 72),
              (o.fillStyle = "#e60012"),
              o.fillRect(0, 0, 64, 8),
              (o.fillStyle = "#111"),
              (o.font = "700 16px Mitr, sans-serif"),
              (o.textAlign = "center"),
              o.fillText("ถูกจัง!", 32, 44));
          }),
          roughness: 0.7,
        });
      j3.push(n, n, n, n, s, s);
    }
    let i = new J(),
      e = new R(X6, j3);
    ((e.position.y = -0.15), i.add(e));
    let t = new R(new vt(0.07, 0.012, 6, 12, Math.PI), new X({ color: 15073298 }));
    return ((t.position.y = 0), i.add(t), i);
  }
  var Z6 = [
      "มันฝรั่งทอดรสบาร์บีคิวลดเหลือ 19 บาท คุ้มมาก!",
      "ขนมปังเพิ่งอบใหม่ หอมไปทั้งร้านเลย",
      "นมสดล็อตนี้วันหมดอายุไกลดี เอาสองขวดเลย",
      "ข้าวกล่องเบนโตะหน้าตาน่ากินจัง",
      "ราเมงชามร้อน ๆ เหมาะกับคืนฝนตก",
      "แอปเปิ้ลแดงลูกโตมาก ราคาถูกกว่าตลาดอีก",
      "กล้วยหอมหวีนี้สุกกำลังดี",
      "นักเก็ตไก่ซื้อไปฝากลูกดีกว่า",
      "ซีเรียลกล่องใหม่มีของแถมด้วยแฮะ",
      "น้ำอัดลมกระป๋องเย็น ๆ ตู้นี้เต็มเลย",
      "ไข่ไก่สดแผงนี้ฟองโตจัง",
      "ส้มกองนั้นสีสวยมาก น่าจะหวาน",
      "ร้านนี้ของเยอะจริง หาอะไรก็เจอ",
      "ของลดราคาเทกระจาดนี่แหละที่ชอบ",
      "เดินวนสามรอบแล้วยังดูไม่หมดเลย",
      "ขนมจากญี่ปุ่นมาใหม่อีกแล้ว",
      "อาหารกระป๋องตุนไว้ช่วงหน้าฝนดีกว่า",
      "ซอสมะเขือเทศขวดใหญ่ใช้ได้นานเลย",
      "เส้นพาสต้าห่อนี้ทำสปาเกตตี้คืนนี้แหละ",
      "ช็อกโกแลตแท่งนี้อร่อยมากนะบอกเลย",
      "ไส้กรอกแพ็กคู่ราคาโปรโมชั่น",
      "น้ำผลไม้กล่องนี้ไม่ใส่น้ำตาล ดีต่อสุขภาพ",
      "ขวดน้ำดื่มแพ็กใหญ่ แบกกลับไหวไหมเนี่ย",
      "นมกล่องรสช็อกโกแลตของโปรดเลย",
      "มันฝรั่งรสชีสหมดอีกแล้ว ขายดีจัง",
      "ตะกร้าเต็มแล้ว ยังอยากได้อีก",
      "ป้ายดาวเหลืองตรงไหนคือถูกแน่นอน",
      "ลองชิมขนมตัวอย่างหน่อยดีกว่า",
      "ของใช้ในบ้านก็มีครบเลยร้านนี้",
      "ผงซักฟอกถุงนี้กลิ่นหอมดอกไม้",
      "แตงกวาสด ๆ เอาไปทำสลัด",
      "มะเขือม่วงลูกนี้สวยดี ทำแกงเขียวหวาน",
      "มะนาวลูกละ 3 บาท ถูกจัง!",
      "ขนมปังแถวยาวเอาไปทำแซนด์วิชพรุ่งนี้",
      "ครัวซองต์เนยสดเหลือชิ้นสุดท้ายพอดี",
      "อยากได้ทุกอย่างในร้านเลย ทำไงดี",
      "เงินในกระเป๋าเริ่มร้องไห้แล้ว 😅",
      "ซื้อขนมให้น้องหมาที่บ้านด้วยดีกว่า",
      "อาหารเม็ดสุนัขสูตรใหม่ น้องที่บ้านต้องชอบ",
      "ร้านเปิด 24 ชั่วโมง มาตอนดึกก็ได้",
      "เพลงในร้านติดหูมาก",
      "แอร์เย็นสบาย เดินเล่นได้ทั้งวัน",
      "ลดราคาแบบนี้ต้องรีบซื้อก่อนหมด",
      "ตู้แช่เครื่องดื่มเรียงสวยจริง",
      "โซนผลไม้สดสีสันสดใสมาก",
      "ซื้อ 2 ชิ้นถูกกว่า งั้นเอาสองเลย",
      "ราเมงคัพรสต้มยำนี่แหละของคู่ห้อง",
      "เบนโตะไก่ทอดใกล้หมดแล้ว รีบหยิบก่อน",
      "วันนี้มาซื้อของเข้าตู้เย็นเต็ม ๆ",
      "จ่ายเงินแล้วกลับบ้านไปทำกับข้าวกัน",
    ],
    K6 = 6,
    X3 = 0,
    J6 = new Map();
  function ck(i) {
    let e = J6.get(i);
    if (e) return e;
    let t = 0.4,
      n = i.bounds,
      s = Math.ceil((n.x1 - n.x0) / t),
      o = Math.ceil((n.z1 - n.z0) / t),
      r = new Uint8Array(s * o);
    for (let a = 0; a < s; a++)
      for (let c = 0; c < o; c++) {
        let l = n.x0 + (a + 0.5) * t,
          h = n.z0 + (c + 0.5) * t;
        r[c * s + a] = i.solids.some((f) => Math.abs(l - f.x) < f.hw + 0.32 && Math.abs(h - f.z) < f.hd + 0.32) ? 0 : 1;
      }
    return ((e = { x0: n.x0, z0: n.z0, nx: s, nz: o, c: t, free: r }), J6.set(i, e), e);
  }
  function jh(i, e, t) {
    let n = ck(i),
      s = (g) => [
        Math.max(0, Math.min(n.nx - 1, Math.floor((g.x - n.x0) / n.c))),
        Math.max(0, Math.min(n.nz - 1, Math.floor((g.z - n.z0) / n.c))),
      ],
      o = ([g, y]) => {
        if (n.free[y * n.nx + g]) return [g, y];
        for (let x = 1; x < 8; x++)
          for (let b = -x; b <= x; b++)
            for (let w = -x; w <= x; w++) {
              let v = g + b,
                _ = y + w;
              if (v >= 0 && _ >= 0 && v < n.nx && _ < n.nz && n.free[_ * n.nx + v]) return [v, _];
            }
        return [g, y];
      },
      [r, a] = o(s(e)),
      [c, l] = o(s(t)),
      h = n.nx * n.nz,
      f = new Int32Array(h).fill(-1),
      d = new Float32Array(h).fill(1e9),
      u = [a * n.nx + r];
    d[u[0]] = 0;
    let p = l * n.nx + c;
    for (; u.length;) {
      let g = 0;
      for (let w = 1; w < u.length; w++)
        d[u[w]] + Math.hypot((u[w] % n.nx) - c, Math.floor(u[w] / n.nx) - l) <
          d[u[g]] + Math.hypot((u[g] % n.nx) - c, Math.floor(u[g] / n.nx) - l) && (g = w);
      let y = u.splice(g, 1)[0];
      if (y === p) break;
      let x = y % n.nx,
        b = Math.floor(y / n.nx);
      for (let [w, v] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ]) {
        let _ = x + w,
          S = b + v;
        if (_ < 0 || S < 0 || _ >= n.nx || S >= n.nz) continue;
        let M = S * n.nx + _;
        if (!n.free[M] || (w && v && (!n.free[b * n.nx + _] || !n.free[S * n.nx + x]))) continue;
        let T = d[y] + (w && v ? 1.414 : 1);
        T < d[M] && ((d[M] = T), (f[M] = y), u.includes(M) || u.push(M));
      }
    }
    let m = [];
    for (let g = p; g !== -1 && m.length < 400; g = f[g])
      m.push(new H(n.x0 + ((g % n.nx) + 0.5) * n.c, 0, n.z0 + (Math.floor(g / n.nx) + 0.5) * n.c));
    m.reverse();
    let E = [];
    for (let g = 2; g < m.length; g += 2) E.push(m[g]);
    return (E.push(t.clone()), E);
  }
