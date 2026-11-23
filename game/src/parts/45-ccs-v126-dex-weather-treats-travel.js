  // ===== v126: สมุดภาพสัตว์ทะเล · รุ้ง/ของเกยตื้น/แพลงก์ตอนเรืองแสง · ทำขนมบัฟที่บ้าน · เดินทางด่วน · เข็มทิศขอบจอ · เสียงอารมณ์น้อง =====
  // (ดัดแปลงจากไอเดียไฟล์ 45-ccs-v126-systems.js ให้ใช้ตัวแปร/พิกัด/เสียง/จอยของเกมจริง)
  function ccsV126Save() {
    (z.mdex ??= { got: {}, claimed: {} }), (z.ing ??= { shell: 0, kelp: 0, pearl: 0 }), (z.buff ??= { k: null, n: "", until: 0 }), typeof z.compOn != "boolean" && (z.compOn = !0);
  }
  // ---------- เสียงอารมณ์น้อง (ใช้ AudioContext เดียวกับเกม + เสียงเห่าจริง) ----------
  var ccsSayT = {};
  function ccsDogSay(i) {
    let e = performance.now();
    if (ccsSayT[i] && e - ccsSayT[i] < (i === "pant" ? 900 : 500)) return;
    ccsSayT[i] = e;
    if (i === "bark") return void Uc(1);
    let t = _i();
    if (!t) return;
    if (i === "happy" && Dh) {
      // เห่าเสียงสูงสั้น ๆ สองครั้ง = ดีใจ
      for (let a of [0, 0.17]) {
        let c = t.createBufferSource(),
          l = t.createGain();
        ((c.buffer = Dh), (c.playbackRate.value = 1.32 + Math.random() * 0.08), (l.gain.value = 0.55), c.connect(l).connect(t.destination), c.start(t.currentTime + 0.01 + a, 0.1, 0.16));
      }
      return;
    }
    let n = t.currentTime,
      s = (a, c, l, h, f, d = "sine") => {
        let u = t.createOscillator(),
          p = t.createGain();
        ((u.type = d), u.frequency.setValueAtTime(a, n + h), u.frequency.exponentialRampToValueAtTime(Math.max(40, c), n + h + l), p.gain.setValueAtTime(1e-4, n + h), p.gain.linearRampToValueAtTime(f, n + h + l * 0.2), p.gain.exponentialRampToValueAtTime(1e-4, n + h + l), u.connect(p).connect(t.destination), u.start(n + h), u.stop(n + h + l + 0.02));
      },
      o = (a, c, l, h) => {
        let f = t.createBufferSource(),
          d = t.createBuffer(1, Math.max(1, Math.floor(t.sampleRate * a)), t.sampleRate),
          u = d.getChannelData(0);
        for (let E = 0; E < u.length; E++) u[E] = Math.random() * 2 - 1;
        f.buffer = d;
        let p = t.createBiquadFilter();
        ((p.type = "bandpass"), (p.frequency.value = h));
        let m = t.createGain();
        (m.gain.setValueAtTime(1e-4, n + c), m.gain.linearRampToValueAtTime(l, n + c + a * 0.25), m.gain.exponentialRampToValueAtTime(1e-4, n + c + a), f.connect(p).connect(m).connect(t.destination), f.start(n + c));
      };
    i === "whine" ? (s(620, 430, 0.32, 0, 0.07), s(560, 400, 0.26, 0.3, 0.05)) : i === "pant" ? (o(0.1, 0, 0.05, 1400), o(0.1, 0.17, 0.04, 1100)) : i === "chomp" ? (o(0.05, 0, 0.12, 1800), s(190, 95, 0.07, 0.02, 0.09, "square"), o(0.05, 0.16, 0.1, 1700)) : i === "happy" && s(520, 760, 0.16, 0, 0.06, "triangle");
  }
  // ---------- ของเกยตื้น / รุ้ง / แพลงก์ตอน ----------
  var ccsWea = { init: !1, wasRain: !1, rbT: 0, rb: null, pl: null, drops: [], day: -1 },
    ccsLootDef = { shell: { n: "เปลือกหอย", ic: "🐚" }, kelp: { n: "สาหร่ายสด", ic: "🌿" }, pearl: { n: "ไข่มุก", ic: "🫧" } };
  function ccsLootMesh(k) {
    let i = new J();
    if (k === "shell") {
      // หอยพัดลายเส้น
      let e = new R(new we(0.17, 16, 6, 0, Math.PI * 2, 0, Math.PI / 2), Ae(16767421, 0.45));
      ((e.scale.set(1, 0.38, 1.15), (e.rotation.y = Math.random() * 6), (e.position.y = 0.01)), i.add(e));
      for (let t = 0; t < 5; t++) {
        let n = new R(new ee(0.008, 0.012, 0.3), Ae(16029585, 0.5));
        (n.position.set(0, 0.045, 0), (n.rotation.y = -(t / 4) * Math.PI + Math.PI / 2), e.add(n));
      }
    } else if (k === "kelp")
      for (let e = 0; e < 4; e++) {
        let t = new R(new ee(0.05, 0.02, 0.42), Ae(3833451, 0.55));
        (t.position.set((Math.random() - 0.5) * 0.15, 0.02 + e * 0.012, (Math.random() - 0.5) * 0.1), (t.rotation.y = Math.random() * 3), (t.rotation.z = (Math.random() - 0.5) * 0.4), i.add(t));
      }
    else {
      // หอยมุกเปิดฝา มีไข่มุกเรืองแสงข้างใน
      let e = Ae(10391164, 0.5),
        t = new R(new we(0.14, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), e);
      ((t.scale.y = 0.35), (t.rotation.x = Math.PI), (t.position.y = 0.05), i.add(t));
      let n = t.clone();
      ((n.rotation.set(-0.6, 0, 0)), n.position.set(0, 0.07, -0.1), i.add(n));
      let s = new R(new we(0.055, 14, 10), Ae(16251903, 0.15, { metalness: 0.35, emissive: 7378431, emissiveIntensity: 0.45 }));
      ((s.position.y = 0.08), i.add(s));
    }
    // ใหญ่ขึ้นให้มองเห็นบนทราย + ประกายวิ้งเหนือของ (หาง่าย)
    i.scale.setScalar(1.9);
    let e = new zi(new vi({ map: ccsSoft(), color: k === "pearl" ? 13230079 : 16775392, transparent: !0, depthWrite: !1, blending: $i, opacity: 0.8 }));
    return ((e.scale.setScalar(0.16), (e.position.y = 0.22), (e.userData.tw = Math.random() * 6), i.add(e), (i.userData.tw = e)), i.traverse((t) => t.isMesh && (t.castShadow = !0)), i);
  }
  function ccsLootSpawn(n, why) {
    let i = 0;
    for (let e = 0; e < n * 6 && i < n; e++) {
      let t = -70 + Math.random() * 140,
        s = Rt - 7 + Math.random() * 5.5;
      if (Math.abs(t) < 3.5 || ri(new H(t, 0, s), 0.5, !1, !0)) continue;
      let o = Math.random(),
        r = o < 0.15 ? "pearl" : o < 0.6 ? "shell" : "kelp",
        a = ccsLootMesh(r);
      (a.position.set(t, Math.max(b4(t, s), Ph) + 0.02, s), K.add(a), ccsWea.drops.push({ g: a, k: r, p: a.position }), i++);
    }
    why && i && De(why, 3200);
  }
  function ccsWeaInit() {
    if (ccsWea.init) return;
    ccsWea.init = !0;
    // รุ้งกินน้ำครึ่งวงเหนือทะเล (สีตามรัศมี)
    let i = new Qt({
        transparent: !0,
        depthWrite: !1,
        side: Ke,
        uniforms: { uA: { value: 0 } },
        vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
        fragmentShader: "varying vec2 vUv; uniform float uA; void main(){ float r = length(vUv - 0.5) * 2.0; float t = clamp((r - 0.879) / 0.121, 0.0, 1.0); vec3 c = 0.5 + 0.5 * cos(6.28318 * (t * 0.85 + vec3(0.0, 0.33, 0.67))); float e = smoothstep(0.0, 0.18, t) * smoothstep(1.0, 0.82, t); c = mix(vec3(dot(c, vec3(0.33))), c, 1.15); gl_FragColor = vec4(c, e * uA * 0.6); }",
      }),
      e = new R(new rr(46, 53, 64, 1, 0, Math.PI), i);
    ((e.position.set(10, Ph - 4, Rt + 120), (e.visible = !1), (e.renderOrder = 2), K.add(e), (ccsWea.rb = e)));
    // แพลงก์ตอนเรืองแสงตามแนวน้ำตื้น สว่างขึ้นรอบตัวน้องตอนลุยน้ำ
    let t = 420,
      n = new Float32Array(t * 3),
      s = new Float32Array(t);
    for (let r = 0; r < t; r++) ((n[r * 3] = (Math.random() - 0.5) * 150), (n[r * 3 + 1] = Ph + 0.1), (n[r * 3 + 2] = Rt + 1.5 + Math.pow(Math.random(), 1.6) * 18), (s[r] = Math.random() * 6.28));
    let o = new qe();
    (o.setAttribute("position", new Je(n, 3)), o.setAttribute("aPh", new Je(s, 1)));
    let r = new Qt({
      transparent: !0,
      depthWrite: !1,
      blending: $i,
      uniforms: { uT: { value: 0 }, uDog: { value: new H() }, uA: { value: 0 }, uS: { value: 500 } },
      vertexShader: "attribute float aPh; uniform float uT; uniform vec3 uDog; uniform float uS; varying float vG; void main(){ vec3 p = position; p.y += sin(uT * 2.2 + aPh) * 0.05; float d = distance(p.xz, uDog.xz); float b = smoothstep(7.0, 1.2, d); vG = 0.35 + 0.3 * sin(uT * 3.0 + aPh) + b * 1.2; vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_PointSize = clamp((0.22 + b * 0.34) * uS / -mv.z, 2.0, 22.0); gl_Position = projectionMatrix * mv; }",
      fragmentShader: "uniform float uA; varying float vG; void main(){ float c = length(gl_PointCoord - 0.5); if (c > 0.5) discard; gl_FragColor = vec4(0.15, 0.88, 1.0, smoothstep(0.5, 0.0, c) * vG * uA); }",
    });
    ((ccsWea.pl = new bs(o, r)), (ccsWea.pl.frustumCulled = !1), (ccsWea.pl.visible = !1), K.add(ccsWea.pl));
  }
  function ccsWeaTick(dt) {
    ccsWeaInit();
    let i = co.cur.r > 0.3,
      e = j.time % 1,
      t = Le[0];
    // ฝนหยุด → รุ้ง 3 นาที + ของเกยตื้น · เช้าวันใหม่มีของเกยตื้นเล็กน้อย
    (ccsWea.wasRain && !i && !Se && ((ccsWea.rbT = 180), ccsLootSpawn(6, "🌈 ฝนหยุดแล้ว! มีรุ้งกินน้ำเหนือทะเล และของเกยตื้นริมหาด 🐚")),
      (ccsWea.wasRain = i),
      ccsWea.day !== z.day && ((ccsWea.day = z.day), ccsWea.drops.length < 4 && ccsLootSpawn(3)),
      (ccsWea.rbT = Math.max(0, ccsWea.rbT - dt)),
      (ccsWea.rb.visible = ccsWea.rbT > 0 && !Se && e > 0.25 && e < 0.78),
      (ccsWea.rb.material.uniforms.uA.value = Math.min(1, ccsWea.rbT / 15, (180 - ccsWea.rbT) / 6)));
    let n = !i && (e > 0.83 || e < 0.19) && !Se,
      s = ccsWea.pl.material.uniforms;
    ((s.uA.value += ((n ? 1 : 0) - s.uA.value) * Math.min(1, dt * 1.2)), (s.uT.value += dt), (s.uS.value = innerHeight * 0.9), t && s.uDog.value.copy(t.pos), (ccsWea.pl.visible = s.uA.value > 0.02));
    // เก็บของอัตโนมัติเมื่อเดินผ่าน
    if (t && !Se)
      for (let o = ccsWea.drops.length - 1; o >= 0; o--) {
        let r = ccsWea.drops[o];
        let tw = r.g.userData.tw;
        tw && ((tw.userData.tw += dt * 3), tw.scale.setScalar(0.08 + Math.abs(Math.sin(tw.userData.tw)) * 0.12), (tw.material.opacity = 0.25 + Math.abs(Math.sin(tw.userData.tw)) * 0.5));
        if (t.pos.distanceTo(r.p) > 1.3) continue;
        (ccsV126Save(), (z.ing[r.k] = (z.ing[r.k] ?? 0) + 1), K.remove(r.g), ccsWea.drops.splice(o, 1), ke("pop"), rt(`+1 ${ccsLootDef[r.k].ic} ${ccsLootDef[r.k].n}`, r.p.clone().setY(1.2)), Ai("loot"), _t(z));
      }
  }
  // ---------- สมุดภาพสัตว์ทะเล (ตรวจตอนถ่ายรูป) ----------
  var ccsDexDef = [
    { id: "orca_breach", n: "ออร์กากระโดดพ้นน้ำ", h: "ถ่ายตอนออร์กากระโดด (ตอนล่าเหยื่อ หรือกดเล่นกับออร์กาที่ท่าเรือ)" },
    { id: "orca_beg", n: "ออร์กาอ้าปากขอปลา", h: "โยนแซลมอนจากปลายท่าเรือ แล้วถ่ายตอนออร์กาอ้าปากรอ" },
    { id: "orca_slap", n: "ออร์กาตบหางสาดน้ำ", h: "กดเล่นกับออร์กาแล้วจับจังหวะตบหาง" },
    { id: "orca_spy", n: "ออร์กาโผล่หัวส่อง", h: "กดเล่นกับออร์กาแล้วถ่ายตอนโผล่หัวมองน้อง" },
    { id: "pilot_pod", n: "ฝูงวาฬนำร่อง", h: "ถ่ายวาฬนำร่องตอนโผล่หายใจ (ให้ปลาหมึกที่ท่าเรือจะมาใกล้)" },
    { id: "sperm_giant", n: "วาฬสเปิร์มยักษ์", h: "ถ่ายตอนวาฬสเปิร์มลอยหายใจ (ให้หมึกยักษ์ที่ท่าเรือจะมาใกล้)" },
    { id: "rainbow_sea", n: "รุ้งกินน้ำหลังฝน", h: "รอฝนหยุด แล้วหันกล้องไปทางทะเล" },
    { id: "glow_night", n: "แพลงก์ตอนเรืองแสง", h: "คืนฟ้าใส เดินลุยน้ำตื้นริมหาดแล้วถ่าย" },
  ];
  function ccsInShot(p, d = 120) {
    if (Lt.position.distanceTo(p) > d) return !1;
    let i = p.clone().project(Lt);
    return i.z < 1 && Math.abs(i.x) < 0.95 && Math.abs(i.y) < 0.95;
  }
  function ccsDexOnSnap() {
    ccsV126Save();
    let i = z.mdex.got,
      e = [],
      t = (s) => !i[s] && ((i[s] = Date.now()), e.push(s));
    for (let s of ccsWh?.pods ?? [])
      for (let o of s.m) {
        if (!o.vis || !o.a.root.visible) continue;
        let r = o.pos.clone().setY(o.y);
        if (!ccsInShot(r, s.k === "sperm" ? 160 : 110)) continue;
        let a = o.y > Ph - o.size * 0.22;
        s.k === "orca" ? (o.act?.k === "breach" && t("orca_breach"), o.act?.k === "slap" && t("orca_slap"), o.act?.k === "spy" && t("orca_spy"), s.mode === "beg" && o.beg > 0.6 && t("orca_beg")) : a && t(s.k === "pilot" ? "pilot_pod" : "sperm_giant");
      }
    ccsWea.rb?.visible && ccsInShot(ccsWea.rb.position.clone().setY(30), 400) && t("rainbow_sea");
    let n = Le[0]?.pos;
    if ((ccsWea.pl?.visible && n && n.z > Rt - 1 && ccsWea.pl.material.uniforms.uA.value > 0.5 && t("glow_night"), e.length)) {
      let s = e.map((o) => ccsDexDef.find((r) => r.id === o).n).join(", ");
      (setTimeout(() => (ke("quest"), ccsDogSay("happy"), De(`🐋 ลงสมุดภาพสัตว์ทะเล: ${s} (${Object.keys(i).length}/${ccsDexDef.length})`, 3600)), 900), Ai("dex"), _t(z));
    }
  }
  function ccsDexClaim(t) {
    ccsV126Save();
    let i = Object.keys(z.mdex.got).length;
    if (z.mdex.claimed[t] || i < t) return;
    ((z.mdex.claimed[t] = !0), t === 4 ? ((z.money += 250), (z.ing.pearl += 2), De("🎁 รางวัลสมุดภาพ 4/8: +250💰 และไข่มุก 2 เม็ด", 3200)) : ((z.money += 800), (z.hats ??= []).includes("cc:Hat_55") ? De("🏆 ครบ 8/8! +800💰 (มีหมวกฉลามแล้ว)", 3200) : (z.hats.push("cc:Hat_55"), De("🏆 ครบ 8/8! +800💰 และได้หมวกฉลาม 🦈 (ใส่ได้ที่ตู้เสื้อผ้า)", 3600))), Ei(), ke("quest"), ccsDogSay("happy"), ccsSparkle(Le[0].pos, 14), _t(z), ccsDexOpen());
  }
  function ccsDexOpen() {
    ccsV126Save();
    let i = z.mdex.got,
      e = Object.keys(i).length,
      t = (n) => (z.mdex.claimed[n] ? `<p class="note">✅ รับรางวัล ${n}/8 แล้ว</p>` : e >= n ? `<button class="bigbtn" data-dexc="${n}">🎁 รับรางวัล ${n}/8 ${n === 4 ? "(+250💰 ไข่มุก 2)" : "(+800💰 หมวกฉลาม)"}</button>` : `<p class="note">รางวัลเมื่อครบ ${n}/8 ${n === 4 ? "· +250💰 ไข่มุก 2" : "· +800💰 หมวกฉลาม 🦈"}</p>`);
    (Gi(
      "🐋 สมุดภาพสัตว์ทะเล",
      `<p class="note">ถ่ายรูป (กด P หรือในอัลบั้ม 📷) ตอนเห็นช่วงเหล่านี้ ระบบจะบันทึกลงสมุดถาวร (ลบรูปในอัลบั้มก็ไม่หาย) · ${e}/${ccsDexDef.length}</p>${ccsDexDef.map((n) => `<div class="qcard${i[n.id] ? " ok" : ""}"><b>${i[n.id] ? "✅" : "⬜"} ${n.n}</b><p>${i[n.id] ? "บันทึกแล้ว" : n.h}</p></div>`).join("")}${t(4)}${t(8)}`,
    ),
      document.querySelectorAll("[data-dexc]").forEach((n) => n.addEventListener("click", () => ccsDexClaim(+n.dataset.dexc))));
  }
  // ---------- ขนมบัฟ (ชามผสมที่บ้าน) ----------
  var ccsTreatDef = [
      { id: "kelp_cookie", ic: "🍪", n: "คุกกี้สาหร่าย", d: "ว่ายน้ำเร็วขึ้น 25%", b: "swim", c: { kelp: 2, shell: 1 } },
      { id: "salmon_biscuit", ic: "🥨", n: "บิสกิตแซลมอน", d: "ช่องเขียวตอนยิงจุดโทษกว้างขึ้น", b: "pk", c: { salmon: 1, shell: 1 } },
      { id: "pearl_jelly", ic: "🍮", n: "เจลลี่ไข่มุก", d: "วิ่งใช้พลังน้อยลง 35%", b: "stam", c: { pearl: 1, kelp: 1 } },
      { id: "whale_cake", ic: "🎂", n: "เค้กวาฬ", d: "ความผูกพันวาฬ ×2 · ทิปจากคำสั่ง ×1.5", b: "whale", c: { pearl: 1, salmon: 1, shell: 2 } },
    ],
    ccsIngN = { shell: "🐚 เปลือกหอย", kelp: "🌿 สาหร่าย", pearl: "🫧 ไข่มุก", salmon: "🎣 แซลมอน" },
    ccsBowl = null;
  function ccsBuffOn(k) {
    return z.buff?.k === k && Date.now() < z.buff.until;
  }
  function ccsIngHave(k) {
    return k === "salmon" ? z.bait?.salmon ?? 0 : z.ing?.[k] ?? 0;
  }
  function ccsTreatMake(id) {
    ccsV126Save();
    let i = ccsTreatDef.find((e) => e.id === id);
    if (!i) return;
    if (!Object.entries(i.c).every(([e, t]) => ccsIngHave(e) >= t)) return void (ke("nope"), De("วัตถุดิบไม่พอ · เก็บของเกยตื้นริมหาด / ซื้อแซลมอนที่แผงลุงทะเล", 2400));
    for (let [e, t] of Object.entries(i.c)) e === "salmon" ? (z.bait.salmon -= t) : (z.ing[e] -= t);
    ((z.buff = { k: i.b, n: `${i.ic} ${i.n}`, until: Date.now() + 15 * 60 * 1e3 }), Ai("treat"), ccsDogSay("chomp"), ke("sparkle"), ccsSparkle(Le[0].pos, 10), De(`${i.ic} กิน${i.n}แล้ว! ${i.d} (15 นาที)`, 3200), _t(z), ccsTreatMenu());
  }
  function ccsTreatMenu() {
    ccsV126Save();
    let i = ccsBuffOn(z.buff.k) ? `✨ บัฟตอนนี้: <b>${z.buff.n}</b> เหลือ ${Math.ceil((z.buff.until - Date.now()) / 6e4)} นาที` : "ยังไม่มีบัฟ";
    (Gi(
      "🥣 ชามผสมขนมน้อง",
      `<p class="note">${i}<br>วัตถุดิบ: ${Object.keys(ccsIngN).map((e) => `${ccsIngN[e]} ${ccsIngHave(e)}`).join(" · ")}<br>ของเกยตื้นมีริมหาดทุกเช้าและหลังฝนหยุด · ทำขนมใหม่จะแทนบัฟเดิม</p>${ccsTreatDef
        .map((e) => {
          let t = Object.entries(e.c).every(([n, s]) => ccsIngHave(n) >= s);
          return `<div class="row"><div class="ic">${e.ic}</div><div class="nm"><b>${e.n}</b><small>${e.d} · ${Object.entries(e.c).map(([n, s]) => `${ccsIngN[n]} ${ccsIngHave(n)}/${s}`).join(" ")}</small></div><button class="buy" data-treat="${e.id}" ${t ? "" : "disabled"}>ทำ</button></div>`;
        })
        .join("")}`,
    ),
      document.querySelectorAll("[data-treat]").forEach((e) => e.addEventListener("click", () => ccsTreatMake(e.dataset.treat))));
  }
  function ccsBowlTick() {
    let i = Rn && Se === Rn;
    if (i && !ccsBowl) {
      let e = new J(),
        t = new R(new re(0.36, 0.24, 0.24, 20, 1, !0), Ae(15104546, 0.4, { side: Ke }));
      t.position.y = 0.12;
      let n = new R(new re(0.31, 0.31, 0.03, 20), Ae(16641008, 0.7));
      n.position.y = 0.17;
      let s = new R(new re(0.02, 0.025, 0.5, 6), Ae(10506797, 0.6));
      ((s.position.set(0.12, 0.3, 0), (s.rotation.z = -0.6)), e.add(t, n, s));
      let o = Rn.bowls.clone().add(new H(-1.15, 0, 0));
      e.scale.setScalar(0.85);
      (e.position.copy(o), e.traverse((r) => r.isMesh && (r.castShadow = !0)), K.add(e), (ccsBowl = { g: e, p: o }));
    } else !i && ccsBowl && (K.remove(ccsBowl.g), (ccsBowl = null));
  }
  // ---------- เดินทางด่วน ----------
  var ccsWarpDef = [
      { id: "home", ic: "🏠", n: "หน้าบ้าน", x: -96, z: 54.4 },
      { id: "shops", ic: "🛍️", n: "ถนนร้านค้า", x: -2, z: -6 },
      { id: "fountain", ic: "⛲", n: "ลานน้ำพุ", x: -46, z: 34.5 },
      { id: "train", ic: "🏅", n: "สนามฝึกพี่ต้น", x: -16.5, z: 12.8 },
      { id: "football", ic: "⚽", n: "สนามฟุตบอล", x: -45, z: -57 },
      { id: "ferris", ic: "🎡", n: "ชิงช้าสวรรค์", x: 40, z: 38.5 },
      { id: "pier", ic: "⚓", n: "ท่าเรือดูวาฬ", x: 0, z: 69.5 },
    ],
    ccsWarping = !1;
  function ccsBusy() {
    return !j.started || Se || ho || ccsPK || ccsRide || ccsBath || Oo || j.sleeping;
  }
  function ccsFreeSpot(x, zz) {
    for (let i = 0; i < 40; i++) {
      let e = i === 0 ? 0 : 0.6 + i * 0.18,
        t = i * 2.4,
        n = new H(x + Math.cos(t) * e, 0, zz + Math.sin(t) * e);
      if (vr(n, 0.45) <= 0 && !ri(n, 0.5, !1, !0)) return n;
    }
    return new H(x, 0, zz);
  }
  function ccsWarp(id) {
    let i = ccsWarpDef.find((n) => n.id === id);
    if (!i || ccsWarping) return;
    if (ccsBusy()) return void De("วาร์ปไม่ได้ตอนอยู่ในร้าน/ทำกิจกรรมอยู่", 2200);
    (qs(), (ccsWarping = !0));
    let e = document.getElementById("ccsFade");
    (e || ((e = document.createElement("div")), (e.id = "ccsFade"), document.body.appendChild(e)), e.classList.add("on"), ke("pop"));
    setTimeout(() => {
      let n = ccsFreeSpot(i.x, i.z),
        s = Le[0],
        o = n.clone().sub(s.pos);
      (s.pos.copy(n), (j.jy = 0), (j.vy = 0), (j.gy = Math.max(0, b4(n.x, n.z))), Lt.position.add(o));
      for (let r = 1; r < Le.length; r++) Le[r]?.pos && Le[r].pos.copy(ccsFreeSpot(n.x - 1.2 * r, n.z - 0.8));
      (Ai("warp"),
        setTimeout(() => {
          (e.classList.remove("on"), (ccsWarping = !1), ccsDogSay("bark"), De(`${i.ic} ถึง${i.n}แล้ว`, 1800));
        }, 260));
    }, 260);
  }
  function ccsWarpMenu() {
    if (ccsBusy()) return void De("ออกจากร้านหรือจบกิจกรรมก่อนนะ แล้วค่อยวาร์ป", 2200);
    let i = Le[0].pos;
    (Gi(
      "🚌 เดินทางด่วน",
      `<p class="note">เลือกที่หมาย แล้วน้องจะไปถึงทันที</p>${ccsWarpDef.map((e) => `<div class="row"><div class="ic">${e.ic}</div><div class="nm"><b>${e.n}</b><small>ห่าง ${Math.round(Math.hypot(i.x - e.x, i.z - e.z))} ม.</small></div><button class="buy" data-warp="${e.id}">ไป</button></div>`).join("")}`,
    ),
      document.querySelectorAll("[data-warp]").forEach((e) => e.addEventListener("click", () => ccsWarp(e.dataset.warp))));
  }
  // ---------- เข็มทิศขอบจอ (อัปเดต ~12 ครั้ง/วิ) ----------
  var ccsComp = { el: null, pins: null, t: 0, fwd: new H() };
  function ccsCompTick() {
    if (!ccsComp.el) {
      let a = document.createElement("div");
      ((a.id = "ccsComp"), (a.innerHTML = '<div class="ccs-comp-bar"><div class="ccs-comp-pins"></div><div class="ccs-comp-mid">▼</div></div>'), document.body.appendChild(a), (ccsComp.el = a), (ccsComp.pins = a.querySelector(".ccs-comp-pins")));
    }
    let i = !z.compOn || ccsBusy() || C0();
    if ((ccsComp.el.classList.toggle("on", !i), i)) return;
    let e = performance.now();
    if (e - ccsComp.t < 80) return;
    ccsComp.t = e;
    Lt.getWorldDirection(ccsComp.fwd);
    let t = Math.atan2(ccsComp.fwd.x, ccsComp.fwd.z),
      n = Le[0].pos,
      s = Math.PI * 0.55,
      o = (a) => {
        let c = a - t;
        for (; c > Math.PI; ) c -= Math.PI * 2;
        for (; c < -Math.PI; ) c += Math.PI * 2;
        return c;
      },
      r = "";
    // ทิศ: ทะเลอยู่ทิศใต้ (+z)
    for (let [a, c] of [
      ["S", 0],
      ["E", Math.PI / 2],
      ["N", Math.PI],
      ["W", -Math.PI / 2],
    ]) {
      let l = o(c);
      Math.abs(l) <= s && (r += `<span class="ccs-comp-card" style="left:${(50 - (l / s) * 46).toFixed(1)}%">${a}</span>`);
    }
    let a = [],
      c = ccsWh?.pods.find((h) => h.k === "orca");
    (c?.mode === "beg" && a.push({ ic: "🐳", x: c.m[0].pos.x, z: c.m[0].pos.z, u: 1 }), ccsTROpen() && a.push({ ic: "🏅", x: -18, z: 15 }), (z.bait?.salmon || z.bait?.squid || z.bait?.giant) && a.push({ ic: "⚓", x: 0, z: Rt + 18 }));
    let l = null,
      h = 1e9;
    for (let f of ccsWea.drops) {
      let d = n.distanceTo(f.p);
      d < h && ((h = d), (l = f));
    }
    l && a.push({ ic: "🐚", x: l.p.x, z: l.p.z });
    for (let f of a) {
      let d = Math.hypot(f.x - n.x, f.z - n.z);
      if (d < 4) continue;
      let u = o(Math.atan2(f.x - n.x, f.z - n.z)),
        p = Math.max(-s, Math.min(s, u));
      r += `<span class="ccs-comp-pin${f.u ? " urg" : ""}${Math.abs(u) > s ? " edge" : ""}" style="left:${(50 - (p / s) * 46).toFixed(1)}%">${f.ic}<b>${Math.round(d)}m</b></span>`;
    }
    ccsComp.pins.innerHTML = r;
  }
  function ccsCompToggle() {
    (ccsV126Save(), (z.compOn = !z.compOn), _t(z), De(z.compOn ? "🧭 เปิดเข็มทิศขอบจอแล้ว" : "🧭 ซ่อนเข็มทิศขอบจอแล้ว", 1600));
  }
  // ---------- ป้ายบัฟ + หอบเมื่อเหนื่อย ----------
  var ccsBuffEl = null,
    ccsBuffT = 0,
    ccsPantT = 0;
  function ccsV126Tick(dt) {
    if (!Le[0]) return;
    (ccsV126Save(), ccsWeaTick(dt), ccsBowlTick(), ccsCompTick());
    if ((ccsBuffT -= dt) < 0) {
      ((ccsBuffT = 1), ccsBuffEl || ((ccsBuffEl = document.createElement("div")), (ccsBuffEl.id = "ccsBuff"), document.body.appendChild(ccsBuffEl)));
      let i = Date.now() < z.buff.until;
      if ((ccsBuffEl.classList.toggle("on", i && j.started), i)) {
        let e = Math.max(0, Math.ceil((z.buff.until - Date.now()) / 1e3));
        ccsBuffEl.textContent = `${z.buff.n} ${Math.floor(e / 60)}:${String(e % 60).padStart(2, "0")}`;
      }
    }
    j.running && (z.energy ?? 100) < 20 && !Se ? (ccsPantT -= dt) < 0 && ((ccsPantT = 1.6), ccsDogSay("pant")) : (ccsPantT = 0.3);
  }
