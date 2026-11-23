  // ===== v114/v115: ดวลจุดโทษกับชาวเมือง (ยิง/รับได้ 6 ทิศ: เรียด ซ้าย-กลาง-ขวา + โด่ง ซ้าย-กลาง-ขวา) =====
  var ccsPK = null,
    ccsPKNpc = null,
    ccsPKFoes = [
      { n: "ลุงโต", lv: "ง่าย", read: 0.2, miss: 0.28, pay: 60 },
      { n: "พี่บอล", lv: "กลาง", read: 0.33, miss: 0.16, pay: 100 },
      { n: "กัปตันแม็ก", lv: "ยาก", read: 0.48, miss: 0.08, pay: 160 },
    ],
    // เป้าหมาย 6 ทิศ (มุมมองคนยิง): c = คอลัมน์ -1 ซ้าย / 0 กลาง / 1 ขวา, h = 0 เรียด / 1 โด่ง
    ccsPKDir = { L: [-1, 0], C: [0, 0], R: [1, 0], HL: [-1, 1], HC: [0, 1], HR: [1, 1] },
    ccsPKZone = [
      [0.44, 0.66],
      [0.6, 0.79],
    ];
  function ccsPKFoe() {
    return ccsPKFoes[(z.day ?? 1) % 3];
  }
  function ccsPKGeo() {
    let i = xt.x + Yc;
    return { gx: i, spot: new H(i - 6.5, 0, xt.z), keep: new H(i - 0.55, 0, xt.z), idle: new H(i - 1.6, 0, xt.z + 3.4) };
  }
  function ccsPKMakeNpc() {
    if (ccsPKNpc || !fo) return;
    try {
      let i = mr()
        ? Zr(["Body_11", "Ears_11", "Male_Emotion_Happy_01", "Hairstyle_Male_07", "Outwear_19", "Pants_03", "Shoe_Sneakers_09", "Hat_01"])
        : Ic(Sh[2]);
      ((i.yaw = -Math.PI / 2), i.root.position.copy(ccsPKGeo().idle), K.add(i.root), (ccsPKNpc = { rig: i, pos: ccsPKGeo().idle.clone() }));
    } catch (i) {
      console.warn("pk npc", i);
    }
  }
  function ccsPKBoard() {
    if (!fo?.boardTex) return;
    let i = ccsPK,
      e = fo.boardTex.image.getContext("2d");
    ((e.fillStyle = "#111"), e.fillRect(0, 0, 512, 160), (e.strokeStyle = "#ffe100"), (e.lineWidth = 8), e.strokeRect(4, 4, 504, 152), (e.fillStyle = "#fff"), (e.font = "700 26px Mitr, sans-serif"), (e.textAlign = "center"));
    (e.fillText("ดวลจุดโทษ", 256, 34), e.fillText(pl[0]?.name ?? "น้อง", 110, 70), e.fillText(i.foe.n, 402, 70));
    let t = (n, o) => {
      for (let r = 0; r < Math.max(5, n.length); r++) {
        let a = n[r];
        ((e.fillStyle = a === void 0 ? "#555" : a ? "#4cd964" : "#ff3b30"), e.beginPath(), e.arc(o - 64 + (r % 5) * 32, 108 + Math.floor(r / 5) * 26, 11, 0, 7), e.fill());
      }
    };
    (t(i.me, 110), t(i.cpu, 402), (e.fillStyle = "#ffe100"), (e.font = "700 40px Mitr, sans-serif"), e.fillText(`${i.me.filter(Boolean).length}:${i.cpu.filter(Boolean).length}`, 256, 112), (fo.boardTex.needsUpdate = !0));
    // v120: สกอร์บอร์ดกลางจอด้านบน
    let n = document.getElementById("pkHud");
    n || ((n = document.createElement("div")), (n.id = "pkHud"), document.body.appendChild(n));
    let o = (r) => Array.from({ length: Math.max(5, r.length) }, (a, c) => `<i class="${r[c] === void 0 ? "" : r[c] ? "g" : "x"}">${r[c] === void 0 ? "" : r[c] ? "✓" : "✕"}</i>`).join(""),
      s = i.me.length;
    ((n.innerHTML = `<div class="pkt"><b>${pl[0]?.name ?? "น้อง"}</b><span>${o(i.me)}</span></div><div class="pks">${i.me.filter(Boolean).length} : ${i.cpu.filter(Boolean).length}</div><div class="pkt"><b>${i.foe.n}</b><span>${o(i.cpu)}</span></div><div class="pkm">น้องยิงแล้ว ${s} ลูก · เข้า ${i.me.filter(Boolean).length} · พลาด ${s - i.me.filter(Boolean).length}${s >= 5 || i.cpu.length >= 5 ? " · ดวลต่อ!" : ""}</div>`), n.classList.add("on"));
  }
  function ccsPKStart() {
    if (ccsPK || !fo) return;
    let i = ccsPKFoe();
    ((ccsPK = { foe: i, me: [], cpu: [], ph: "aim", t: 0, aim: null, dive: null, pow: 0 }), ke("pop"), ccsWhistle?.("goal"), Ln(ccsPKNpc?.pos ?? Le[0].pos, `มาเลย! ${i.n} พร้อมแล้ว ยิงคนละ 5 ลูกนะ ⚽`), ccsPKBoard(), ccsPKUI());
  }
  function ccsPKEnd(i) {
    let e = ccsPK;
    if (!e) return;
    window.__pkLast = { why: i ?? "done", me: e.me.slice(), cpu: e.cpu.slice() };
    setTimeout(() => document.getElementById("pkHud")?.classList.remove("on"), i === "quit" ? 0 : 2500);
    ccsPK = null;
    (js.classList.contains("on") && qs(), js.classList.remove("dress"), ccsPKNpc && ((ccsPKNpc.rig.root.rotation.z = 0), (ccsPKNpc.rig.root.position.y = 0), ccsPKNpc.pos.copy(ccsPKGeo().idle)), fo && ((fo.cool = 0), fo.ball.pos.copy(xt), fo.ball.vel.set(0, 0, 0), (fo.ball.y = 0)), P4());
    if (i === "quit") return void De("🏳️ ยกเลิกการดวลจุดโทษ", 1800);
    let t = e.me.filter(Boolean).length,
      n = e.cpu.filter(Boolean).length;
    if (t > n) {
      let s = z.pkWin ?? (z.pkWin = {}),
        o = s[e.foe.n] !== z.day;
      ((s[e.foe.n] = z.day), o && ((z.money += Math.round(e.foe.pay * (ccsSetOn("viking") ? 1.5 : 1))), Ei()), Ai("pkwin"), ccsSnapSoon(`🏆 ชนะดวลจุดโทษ ${t}:${n} กับ${e.foe.n}`, 0.2, "pk"), ke("quest"), Rs(o ? 25 : 8, Le[0]), Ln(ccsPKNpc?.pos ?? Le[0].pos, `เก่งมาก! ${pl[0]?.name ?? "น้อง"} ชนะ ${t}:${n} 👏`), De(`🏆 ชนะดวลจุดโทษ ${t}:${n}!${o ? ` +${e.foe.pay}💰` : " (วันนี้รับรางวัลแล้ว)"}`, 3200));
    } else if (t === n) (ke("pop"), Ln(ccsPKNpc?.pos ?? Le[0].pos, `สูสีมาก! เสมอ ${t}:${n} ไว้มาดวลกันใหม่ 🤝`), De(`🤝 เสมอ ${t}:${n} (ดวลครบ 8 ลูกแล้ว) · ลองใหม่ได้เสมอ`, 3e3));
    else (ke("nope"), Ln(ccsPKNpc?.pos ?? Le[0].pos, `เฮ้! ${e.foe.n} ชนะ ${n}:${t} มาแก้มือได้นะ 😆`), De(`😿 แพ้ดวลจุดโทษ ${t}:${n} · ลองใหม่ได้เสมอ`, 3e3));
    _t(z);
  }
  function ccsPKUI() {
    let i = ccsPK;
    if (!i) return;
    let e = i.ph === "dive",
      t = (n, o) => `<button data-pk="${n}">${o}</button>`,
      n =
        i.ph === "power"
          ? (() => {
              let [o, r] = ccsPKZone[ccsPKDir[i.aim][1]];
              ccsHG("viking") && ((o -= 0.04), (r += 0.04));
              ccsSetOn("viking") && ((o -= 0.03), (r += 0.03));
              return `<p class="note">เล็ง: <b>${{ L: "↙ เรียดซ้าย", C: "⬇ เรียดกลาง", R: "↘ เรียดขวา", HL: "↖ โด่งซ้าย", HC: "⬆ โด่งกลาง", HR: "↗ โด่งขวา" }[i.aim]}</b> · ช่องเขียว = แม่น · เกิน = หลุดกรอบ · เบา = โดนเซฟง่าย</p><div class="pkbar"><b style="left:${o * 100}%;width:${(r - o) * 100}%"></b><em style="left:86%"></em><i id="pkPow"></i></div><button class="bigbtn" data-pk="K">⚽ ยิง!</button>`;
            })()
          : `<div class="pkgrid">${t("HL", e ? "↖ พุ่งสูงซ้าย" : "↖ โด่งซ้าย")}${t("HC", e ? "⬆ กระโดดกลาง" : "⬆ โด่งกลาง")}${t("HR", e ? "↗ พุ่งสูงขวา" : "↗ โด่งขวา")}${t("L", e ? "↙ พุ่งต่ำซ้าย" : "↙ เรียดซ้าย")}${t("C", e ? "⬇ ยืนกลาง" : "⬇ เรียดกลาง")}${t("R", e ? "↘ พุ่งต่ำขวา" : "↘ เรียดขวา")}</div>`;
    (Gi(
      `⚽ ดวลจุดโทษ vs ${i.foe.n} (${i.foe.lv})`,
      `<p class="note">${e ? `ลูกที่ ${i.cpu.length + 1} · ${i.foe.n} ยิง · เดาทางแล้วพุ่งรับ (ซ้าย/ขวา ตามจอ) · เปลี่ยนใจได้จนกว่าจะเตะ` : `ลูกที่ ${i.me.length + 1} · ${pl[0]?.name ?? "น้อง"} ยิง · ${i.ph === "aim" ? "เลือกทิศยิง" : "กดยิงตอนแถบอยู่ในช่องเขียว"}`} <small>(คีย์ Q W E = โด่ง / A S D = เรียด · Space ยิง · จอย: D-pad/สติ๊กซ้าย 8 ทิศ เฉียงขึ้น = โด่งซ้าย/ขวา, ขึ้น = โด่งกลาง · Ⓐ ยืนยัน/ยิง)</small></p>${n}`,
    ),
      js.classList.add("dress"),
      document.querySelectorAll("[data-pk]").forEach((o) => o.addEventListener("click", () => ccsPKInput(o.dataset.pk))));
  }
  function ccsPKInput(i) {
    let e = ccsPK;
    if (!e) return;
    if (e.ph === "aim" && ccsPKDir[i]) ((e.aim = i), (e.ph = "power"), (e.t = 0), ke("pop"), ccsPKUI());
    else if (e.ph === "power" && i === "K") ((e.ph = "kick"), (e.t = 0), (e.shooter = "me"), qs(), js.classList.remove("dress"));
    else if (e.ph === "dive" && ccsPKDir[i] && e.t < 1.7) {
      ((e.dive = i), ke("pop"));
      document.querySelectorAll("[data-pk]").forEach((t) => t.classList.toggle("on", t.dataset.pk === i));
    }
  }
  addEventListener(
    "keydown",
    (i) => {
      if (!ccsPK || !js.classList.contains("on")) return;
      let e = i.key.length === 1 ? i.key.toLowerCase() : i.key,
        t =
          { q: "HL", w: "HC", e: "HR", a: "L", s: "C", d: "R", ArrowLeft: "L", ArrowDown: "C", ArrowRight: "R", ArrowUp: "HC" }[e] ??
          (e === " " || e === "Enter" ? (ccsPK.ph === "power" ? "K" : null) : null);
      t && (i.preventDefault(), i.stopPropagation(), ccsPKInput(t));
    },
    !0,
  );
  function ccsPKTick(i, e) {
    (ccsPKMakeNpc(), ccsTRMakeNpc());
    ccsPK && (c0.set(0, 0, 0), (Ed = !1));
    let t = ccsPK,
      n = ccsPKNpc,
      s = ccsPKGeo();
    if (!t) {
      if (n) {
        n.rig.root.position.copy(n.pos);
        let o = e.pos.distanceTo(n.pos),
          r = o < 6 ? Math.atan2(e.pos.x - n.pos.x, e.pos.z - n.pos.z) : -Math.PI / 2;
        Qi(n.rig, i, 0, r);
        // v120: ชวนมาแข่งเมื่อน้องเดินมาใกล้
        if (((n.say = (n.say ?? 2) - i), o < 7 && n.say <= 0 && !Se)) {
          n.say = 9;
          let a = ccsPKFoe(),
            c = [
              `เฮ้! ${pl[0]?.name ?? "น้อง"} มาดวลจุดโทษกับ${a.n}ไหม ⚽ ชนะได้ ${a.pay}💰 เลยนะ`,
              "ยิงคนละ 5 ลูก ใครเข้าเยอะกว่าชนะ กล้าไหมล่ะ? 😏",
              `วันนี้${a.n}มือขึ้น เซฟได้หมดแน่ ลองมาพิสูจน์สิ!`,
              "ขาแรงแบบนี้ ลองยิงลูกโด่งเสียบมุมดูไหม 🎯",
              "แพ้ไม่ว่ากันนะ มาซ้อมยิงจุดโทษด้วยกันเถอะ! 🧤",
            ];
          Ln(n.pos, c[Math.floor(Math.random() * c.length)]);
        }
      }
      return;
    }
    if (Se) return ccsPKEnd("quit");
    let o = fo.ball;
    ((fo.cool = 5), (t.t += i));
    let r = t.shooter === "cpu" || t.ph === "dive";
    if (n) {
      let a = n.rig;
      ((a.root.position.x = n.pos.x), (a.root.position.z = n.pos.z), Qi(a, i, r && t.ph === "kick" && t.t < 0.45 ? 4 : 0, r ? Math.PI / 2 : -Math.PI / 2));
    }
    e.dir = r ? -Math.PI / 2 : Math.PI / 2;
    // ผู้เล่นกดปิดแผง (✕ / Ⓑ / Esc) ระหว่างเลือก → ยกเลิก
    if ((t.ph === "aim" || t.ph === "power" || (t.ph === "dive" && t.t < 1.7)) && !js.classList.contains("on")) return ccsPKEnd("quit");
    if (t.ph === "power") {
      let a = document.getElementById("pkPow");
      ((t.pow = 0.5 - 0.5 * Math.cos(t.t * 4.3)), a && (a.style.width = `${Math.round(t.pow * 100)}%`));
    }
    let a = n?.rig,
      c = r ? s.keep : s.spot.clone().add(new H(-0.9, 0, 0)),
      l = r ? s.spot.clone().add(new H(-1.1, 0, -0.75)) : s.keep; // คนยิงวิ่งเข้าเฉียง ไม่บังกล้อง
    if (t.ph !== "kick" && t.ph !== "result") {
      (e.pos.copy(c), (j.yaw = r ? Math.PI / 2 : -Math.PI / 2), (j.pitch = 0.18));
      n && n.pos.copy(l);
      (o.pos.copy(s.spot), o.vel.set(0, 0, 0), (o.vy = 0), (o.y = 0), o.m.position.set(o.pos.x, (o.r ?? 0.45) + 0.03, o.pos.z));
    }
    if (t.ph === "dive" && t.t > 1.7) {
      // ชาวเมืองยิง: สุ่มทิศ (มุมบ่อยกว่ากลาง)
      let h = ["L", "R", "HL", "HR", "C", "HC", "L", "R", "HL", "HR"];
      ((t.ph = "kick"), (t.t = 0), (t.shooter = "cpu"), (t.aim = h[Math.floor(Math.random() * h.length)]), qs(), js.classList.remove("dress"));
    }
    if (t.ph === "kick") {
      let h = t.shooter === "me",
        [f, d] = ccsPKDir[t.aim]; // ทิศของลูก (มุมมองคนยิงซึ่งหันเข้าประตู +x → ซ้าย = -z)
      if (t.res === void 0) {
        let u, p, m;
        if (h) {
          // น้องยิง: แรงในช่องเขียว = แม่น, เกิน 0.88 = หลุดกรอบ (โด่งข้ามคาน / เรียดชนเสาออก), ต่ำกว่า 0.25 = ลูกเบา
          let [E, g] = ccsPKZone[d],
            y = t.pow;
          ((E -= ccsSt("bal") * 0.0008 + (d ? ccsSt("jump") * 0.0008 : 0)), (g += ccsSt("bal") * 0.0008 + (d ? ccsSt("jump") * 0.0008 : 0)), ccsHG("viking") && ((E -= 0.04), (g += 0.04)));
          // นอกช่องเขียว: แรงเกิน = เสี่ยงหลุดกรอบมากขึ้นเรื่อย ๆ, เบาไป = เสี่ยงเฉียงออก/โดนเซฟง่าย
          ((p = y > 0.86 || (y > g && Math.random() < (y - g) * (f !== 0 || d ? 7 : 4)) || (y < E && y >= 0.25 && f !== 0 && Math.random() < (E - y) * 1.6)), (m = y < 0.3 ? "weak" : y >= E && y <= g ? "clean" : "ok"));
          let x = Math.random() < t.foe.read;
          u = x ? [f, d] : [[-1, 0, 1][Math.floor(Math.random() * 3)], Math.random() < 0.45 ? 1 : 0];
          Math.random() < 0.2 && !x && (u = [0, 0]);
        } else {
          // ชาวเมืองยิง: น้องเลือกทิศรับจากมุมมองตัวเอง (หันออกจากประตู → ซ้ายของน้อง = ขวาของคนยิง)
          let E = ccsPKDir[t.dive ?? "C"];
          ((u = [E[0], E[1]]), (p = Math.random() < t.foe.miss + (d ? 0.06 : 0)), (m = Math.random() < 0.6 ? "clean" : "ok"));
        }
        // ตัดสินเซฟ: ต้องพุ่งถูกคอลัมน์ ถ้าความสูงไม่ตรงยังมีลุ้นนิดหน่อย; ลูกแม่นเข้ามุมเซฟยากกว่า, ลูกเบาเซฟง่าย
        let E = u[0] === f,
          g = u[1] === d,
          y = !E ? 0 : f === 0 ? (g ? 0.92 : 0.5) : g ? (m === "clean" ? (d ? 0.42 : 0.6) : 0.85) : m === "weak" ? 0.7 : 0.22;
        m === "weak" && !E && f !== 0 && u[0] === 0 && (y = 0.3);
        ((t.res = p ? "miss" : Math.random() < y ? "save" : "goal"), (t.kd = u), (t.miss = p));
      }
      // v122: วิถีลูกตามจริง — เข้าประตูต้องข้ามเส้น, เซฟต้องปัดออกก่อนเส้น, พลาด = ข้ามคาน/ออกข้างเสา/ชนเสา
      if (!t.tg) {
        let G = tb.find((_) => _.side === 1),
          hw = (G?.w ?? 3.6) / 2,
          bh = G?.h ?? 2.2,
          R = o.r ?? 0.45,
          tz = f * hw * 0.72,
          ty = d ? Math.max(R + 0.6, bh * 0.72) : R + 0.04,
          k = t.res;
        if (t.res === "miss") {
          let sd = f || (Math.random() < 0.5 ? -1 : 1);
          d || f === 0
            ? ((ty = bh + R + 0.35 + Math.random() * 0.5), (tz = f * hw * 0.5), (k = "over"))
            : Math.random() < 0.35
              ? ((tz = sd * (hw - R * 0.6)), (ty = R + 0.4), (k = "post"))
              : ((tz = sd * (hw + R + 0.45 + Math.random() * 0.5)), (k = "wide"));
        }
        t.tg = { z: tz, y: ty, k, R, dep: G?.depth ?? 1.2, hit: 0 };
      }
      let g0 = t.tg,
        T1 = h && t.pow < 0.25 ? 0.85 : 0.55;
      if (t.t < 0.45) {
        let p = t.t / 0.45;
        h ? (e.pos.copy(c).lerp(s.spot.clone().add(new H(-0.35, 0, 0)), p), (e.spd = 4)) : n && n.pos.copy(l).lerp(s.spot.clone().add(new H(-0.4, 0, 0)), p);
      } else {
        let q = (t.t - 0.45) / T1,
          X0 = s.spot.x,
          XL = s.gx,
          qc = (s.keep.x + 0.15 - X0) / (XL - X0),
          R = g0.R,
          bx,
          bz,
          by,
          p = 0;
        if (t.res === "save" && q >= qc) {
          // ผู้รักษาประตูปัดลูกออก (ไม่ข้ามเส้น)
          let τ = (q - qc) * T1,
            sz = Math.sign(g0.z) || (Math.random() < 0.5 ? -1 : 1);
          ((bx = s.keep.x + 0.15 - 4.2 * τ), (bz = g0.z + sz * 3 * τ), (by = Math.max(R, g0.y + (g0.y > 1 ? 2.4 : 1.6) * τ - 4.9 * τ * τ)), g0.hit || ((g0.hit = 1), ke("pop")), (p = τ > 0.75 ? 1 : 0));
        } else if (q <= 1) {
          let A = g0.k === "over" ? 0.45 : d ? 0.35 : 0.08;
          ((bx = X0 + (XL - X0) * q), (bz = g0.z * q), (by = R + (g0.y - R) * q + A * Math.sin(q * Math.PI)));
        } else {
          let τ = (q - 1) * T1;
          if (g0.k === "goal") ((bx = XL + Math.min(g0.dep * 0.75, 9 * τ)), (bz = g0.z), (by = Math.max(R, g0.y - 4.9 * τ * τ)), (p = τ > 0.55 ? 1 : 0));
          else if (g0.k === "post") {
            let sz = Math.sign(g0.z);
            (g0.hit || ((g0.hit = 1), ke("pop")), (bx = XL - 4.5 * τ), (bz = g0.z + sz * 2.6 * τ), (by = Math.max(R, g0.y + 1.8 * τ - 4.9 * τ * τ)), (p = τ > 0.65 ? 1 : 0));
          } else ((bx = XL + 10 * τ), (bz = g0.z * (1 + τ * 0.6)), (by = Math.max(R, g0.y + (g0.k === "over" ? 1 : 0.2) * τ - 4.9 * τ * τ)), (p = τ > 0.5 ? 1 : 0));
        }
        (o.pos.set(bx, 0, s.spot.z + bz), (o.y = by - R), o.m.position.set(o.pos.x, R + 0.03 + o.y, o.pos.z));
        // ผู้รักษาประตูพุ่ง: ถ้าเซฟ = ไปถึงจุดลูกพอดี, ถ้าพุ่งถูกฝั่งแต่โดนยิงเข้า = เอื้อมไม่ถึง
        let x = Math.min(1, ((t.t - 0.45) / T1) * 1.7),
          kz = t.res === "save" ? g0.z : t.kd[0] === f && t.res === "goal" && f !== 0 ? g0.z * 0.6 : t.kd[0] * 1.35,
          ky = t.res === "save" ? Math.max(0, g0.y - 1) : t.kd[1] ? 0.85 : 0.15,
          b = kz * x;
        if (h && n) ((n.pos.z = s.keep.z + b), (n.pos.x = s.keep.x), (a.root.rotation.order = "YXZ"), (a.root.rotation.z = -Math.sign(kz) * Math.min(1.35, Math.abs(kz) * 0.9) * x), (a.root.position.y = Math.sin(x * Math.PI * 0.5) * ky));
        else if (!h) (e.pos.set(s.keep.x, 0, s.keep.z + b), (kz !== 0 || ky > 0.5) && x > 0.05 && !t.jumped && ((t.jumped = !0), (j.vy = ky > 0.5 ? 6.8 : 3.6), (j.jt = 0)));
        if (p >= 1) {
          ((t.ph = "result"), (t.t = 0), (t.jumped = !1), (h ? t.me : t.cpu).push(t.res === "goal"), ccsPKBoard());
          let mk = { over: "โด่งข้ามคาน", wide: "ยิงออกข้างเสา", post: "ชนเสาออก" }[t.tg?.k] ?? "ยิงพลาด",
            v = t.res === "goal" ? (h ? "⚽ โกล!!" : `⚽ ${t.foe.n} ยิงเข้า`) : t.res === "save" ? (h ? `🧤 ${t.foe.n} เซฟได้!` : "🧤 เซฟสวย!!") : h ? `😵 ${mk}!` : `😆 ${t.foe.n} ${mk}!`;
          (rt(v, o.pos.clone().setY(2), (t.res === "goal") === h ? "big" : "bad"), t.res === "goal" ? (ke(h ? "heart" : "nope"), ccsWhistle?.("goal")) : ke(h ? "nope" : "heart"), h && t.res === "goal" && Ai("goal"));
          if (t.res === "goal") for (let _ of tb) _.side === 1 && ((_.t = 0), _.hit.copy(o.pos).setY(o.y + 0.5), _.dir.set(1, 0, 0), (_.amp = 0.5));
        }
      }
      return;
    }
    if (t.ph === "result") {
      a && ((a.root.rotation.z *= 0.88), (a.root.position.y *= 0.8));
      if (t.t < 1.6) return;
      a && ((a.root.rotation.z = 0), (a.root.position.y = 0));
      ((t.res = void 0), (t.tg = void 0), (t.aim = null), (t.dive = null), (t.pow = 0));
      let h = t.me.filter(Boolean).length,
        f = t.cpu.filter(Boolean).length,
        d = t.me.length,
        u = t.cpu.length;
      if (d === u) {
        if (d >= 5 && h !== f) return ccsPKEnd();
        if (d >= 8) return ccsPKEnd();
      } else if (d <= 5 && u < 5) {
        let p = 5 - d,
          m = 5 - u;
        if (h + p < f || f + m < h) return ccsPKEnd();
      }
      ((t.ph = d > u ? "dive" : "aim"), (t.t = 0), (t.shooter = d > u ? "cpu" : "me"), ccsPKUI());
    }
  }
  function xA(i, e) {
    if ((gA(i), !fo)) return;
    ccsPKTick(i, e);
    let t = fo,
      n = t.ball;
    t.cool -= i;
    let s = n.pos.x - xt.x,
      o = n.pos.z - xt.z;
    if (t.cool <= 0 && Math.abs(o) < 2 && Math.abs(s) > Yc + 0.3 && Math.abs(s) < Yc + 3 && n.y < 2.2) {
      let r = s > 0 ? 0 : 1;
      (t.score[r]++,
        P4(),
        (t.cool = 2.2),
        rt("⚽ โกล!!!", n.pos.clone().setY(2.2), "big"),
        e.pos.distanceTo(n.pos) < 45 && ccsWhistle("goal"),
        r === 0 && Ai("goal"),
        ke("heart"),
        De(
          r === 0
            ? "🎉 โกล! ทีมเชาเชาได้ประตู!"
            : "🎉 โกล! ทีมเมืองได้ประตู!",
          2200,
        ),
        e.pos.distanceTo(n.pos) < 30 && Rs(r === 0 ? 8 : 3, e));
    }
    (t.cool > 0 && t.cool < 0.6 && (n.pos.copy(xt), n.vel.set(0, 0, 0), (n.vy = 2.5), (n.y = 0.5), (t.cool = 0)),
      ccsBallRules(t, n, e, i));
  }
  var pE = -0.75,
    ao = 0.93 + pE,
    Bo = Ut.x + 6.2;
  function mE(i, e) {
    if (!ze("beach_house")) return 0;
    let t = i - Ut.x,
      n = e - Ut.z;
    return (t > -4.36 && t < 4.8 && n > 1 && n < 3.62) || (t > 2.25 && t < 4.8 && n > -4.06 && n < 1.1)
      ? ao
      : t > -0.3 && t < 2.5 && n >= 3.62 && n < 4.55
        ? n < 4.08
          ? ao * 0.66
          : ao * 0.33
        : t > 2.25 && t < 3.35 && n >= 3.62 && n < 4.15
          ? ao * 0.5
          : 0;
  }
  function yA() {
    let i = Ut.x,
      e = Ut.z,
      t = je("beach_house");
    (t.position.set(i, pE, e),
      K.add(t),
      t.traverse((d) => {
        let u = d;
        u.isMesh && ((u.castShadow = !0), (u.receiveShadow = !0));
      }),
      t.updateMatrixWorld(!0),
      t.traverse((d) => {
        let u = d;
        if (!u.isMesh) return;
        let p = u.geometry,
          m = p.attributes.position,
          E = new Oe().copy(t.matrixWorld).invert().multiply(u.matrixWorld),
          g = p.index ? Array.from(p.index.array) : Array.from({ length: m.count }, (w, v) => v),
          y = [],
          x = new H(),
          b = (w) => (
            x.fromBufferAttribute(m, w).applyMatrix4(E),
            x.x > -4.7 && x.x < 2.55 && x.z > 3.3 && x.z < 3.85 && x.y > 0.96 && x.y < 2.15
          );
        for (let w = 0; w < g.length; w += 3)
          (b(g[w]) && b(g[w + 1]) && b(g[w + 2])) || y.push(g[w], g[w + 1], g[w + 2]);
        if (y.length !== g.length) {
          let w = p.clone();
          (w.setIndex(y), (u.geometry = w));
        }
      }));
    {
      let d = new X({ color: 11833186, roughness: 0.85 }),
        u = ao;
      for (let p = -4.32; p <= -0.3; p += 1) {
        let m = new R(new ee(0.1, 0.9, 0.1), d);
        (m.position.set(i + p, u + 0.45, e + 3.56), (m.castShadow = !0), K.add(m));
      }
      {
        let p = new R(new ee(0.1, 0.9, 0.1), d);
        (p.position.set(i - 0.32, u + 0.45, e + 3.56), K.add(p));
      }
      for (let p of [0.42, 0.84]) {
        let m = new R(new ee(4.06, 0.08, 0.06), d);
        (m.position.set(i - 2.33, u + p, e + 3.56), (m.castShadow = !0), K.add(m));
      }
    }
    {
      let d = new X({ map: Cn(13213802, "#8a6238"), roughness: 0.85 });
      for (let [u, p, m] of [
        [3.86, ao * 0.66, 0.5],
        [4.3, ao * 0.33, 0.45],
      ]) {
        let E = new R(new ee(2.8, p, m), d);
        (E.position.set(i + 1.1, p / 2, e + u), (E.receiveShadow = !0), (E.castShadow = !0), K.add(E));
      }
    }
    pt.push({ x: i - 0.955, z: e - 1.4, hw: 3.26, hd: 2.52 });
    for (let [d, u, p, m] of [
      [-2.33, 3.56, 2.03, 0.06],
      [4.07, 3.56, 0.73, 0.06],
      [4.76, -0.23, 0.06, 3.83],
      [3.55, -4.02, 1.25, 0.06],
      [-4.32, 2.36, 0.06, 1.25],
    ])
      pt.push({ x: i + d, z: e + u, hw: p, hd: m });
    mo.set(i + 0.38, 0, e + 2.15);
    let n = new R(
      new Te(1.5, 0.34),
      new be({
        map: ei(
          "🏖️ บ้านข้าวต้ม",
          16774885,
          1736614,
          512,
          110,
        ),
      }),
    );
    (n.position.set(i + 0.38, pE + 3.12, e + 1.16), K.add(n));
    let s = new X({ map: Cn(14266490, "#9a6a3a"), roughness: 0.85 }),
      o = e + 4.9;
    for (let d = Mt + 0.6, u = 0; d < o + 0.4; d += 0.62, u++) {
      let p = new R(new ee(1.7, 0.06, 0.52), s);
      (p.position.set(Bo + (u % 2 ? 0.04 : -0.04), 0.03, d),
        (p.rotation.y = ((u % 3) - 1) * 0.03),
        (p.receiveShadow = !0),
        K.add(p));
    }
    for (let d = Bo - 0.62, u = 0; d > i - 0.4; d -= 0.62, u++) {
      let p = new R(new ee(0.52, 0.06, 1.5), s);
      (p.position.set(d, 0.03, o - 0.1 + (u % 2 ? 0.03 : -0.03)), (p.receiveShadow = !0), K.add(p));
    }
    let r = new be({ color: 16752704 }),
      a = (d, u) => {
        if (ze("tiki_torch")) {
          let E = je("tiki_torch", 2);
          (E.position.set(d, Math.max(zo(d, u), mE(d, u)) - 0.12, u), (E.rotation.y = d * 1.7), K.add(E));
          let g = null;
          (E.updateMatrixWorld(!0),
            E.traverse((b) => {
              let w = b;
              w.isMesh &&
                ((w.castShadow = !0),
                (w.material.name === "fire_flame" || w.name === "fire_flame") &&
                  ((g = new mt().setFromObject(w)), (w.visible = !1)));
            }));
          let y = lE(0.55, 0.3),
            x = g;
          (x
            ? y.position.set((x.min.x + x.max.x) / 2, x.min.y + 0.02, (x.min.z + x.max.z) / 2)
            : y.position.set(d, E.position.y + 1.82, u),
            (y.visible = !1),
            K.add(y),
            hE.push(y),
            i1.push(y));
          {
            let b = new En(16747056, 0, 8, 1.8);
            (b.position.copy(y.position).add(new H(0, 0.35, 0)),
              K.add(b),
              u4.push(b),
              pd(y.position.x, y.position.z, 2.2, 0.9));
          }
          pt.push({ x: d, z: u, hw: 0.12, hd: 0.12, low: !0 });
          return;
        }
        if (!ze("b_torch")) return;
        let p = je("b_torch", 1.5);
        (p.position.set(d, 0, u), K.add(p));
        let m = lE(0.42, 0.24);
        (m.position.set(d, 1.45, u), (m.visible = !1), K.add(m), hE.push(m), i1.push(m));
      };
    for (let d = Mt + 4, u = 0; d < o - 1; d += 7, u++) a(Bo + (u % 2 ? 1.25 : -1.25), d);
    (a(i - 0.75, e + 4.5), a(i + 3.65, e + 4.35));
    for (let d of [-5.8, -3.4, -1.6, 3.6, 5.8]) a(i + d, e + 6.4 + Math.abs(d) * 0.08);
    for (let d of [-0.8, 0.8]) {
      let u = new R(new re(0.06, 0.07, 1.85, 8), new X({ color: 9067051, roughness: 0.8 }));
      (u.position.set(Bo + 1.5 + d, 0.92, Mt + 1.2), K.add(u));
    }
    let c = new R(new ee(1.5, 0.5, 0.06), new X({ map: Cn(14266490, "#9a6a3a"), roughness: 0.8 }));
    (c.position.set(Bo + 1.5, 1.55, Mt + 1.2), K.add(c));
    for (let d of [-1, 1]) {
      let u = new R(
        new Te(1.36, 0.36),
        new be({
          map: ei(
            "🏖️ บ้านข้าวต้ม",
            16774885,
            1736614,
            512,
            110,
          ),
        }),
      );
      (u.position.set(Bo + 1.5, 1.55, Mt + 1.2 + d * 0.035), (u.rotation.y = d > 0 ? 0 : Math.PI), K.add(u));
    }
    for (let d of [-0.8, 0.8]) pt.push({ x: Bo + 1.5 + d, z: Mt + 1.2, hw: 0.1, hd: 0.1 });
    let l = (d, u, p, m, E, g, y) => {
      if (!ze(d)) return null;
      let x = je(d, g);
      return (
        x.position.set(i + u, p, e + m),
        (x.rotation.y = E),
        x.traverse((b) => {
          ((b.castShadow = !0), (b.receiveShadow = !0));
        }),
        K.add(x),
        y && pt.push({ x: i + u, z: e + m, hw: y[0], hd: y[1] }),
        x
      );
    };
    (l("b_sofa_big", -2.9, ao, 1.62, 0, void 0, [1, 0.36]),
      l("b_table", -2.9, ao, 2.65, 0, void 0, [0.65, 0.22]),
      l("b_sofa_small", 3.95, ao, -1.6, -Math.PI / 2, void 0, [0.38, 0.38]));
    {
      let d = l("b_seagull", 4.72, ao + 0.95, 3.4, -0.6, 0.45);
      d && (d.position.y = Math.max(mE(d.position.x, d.position.z), zo(d.position.x, d.position.z)));
    }
    let h = (d, u) => zo(i + d, e + u);
    (l("b_sunbed", -3.2, h(-3.2, 10.6), 10.6, 0, void 0, [0.38, 1]),
      l("b_sunbed", -1.1, h(-1.1, 10.6), 10.6, 0, void 0, [0.38, 1]),
      l("b_umbrella", -2.15, h(-2.15, 10), 10, 0, void 0, [0.12, 0.12]),
      l("b_sunbed_table", -2.15, h(-2.15, 11.9), 11.9, 0, void 0, [0.26, 0.26]),
      l("b_pineapple", -2.15, h(-2.15, 11.9) + 0.33, 11.9, 0),
      l("b_coolbox", 0.3, h(0.3, 10.6), 10.6, 0, void 0, [0.3, 0.2]),
      l("b_towel", 2.2, h(2.2, 11) + 0.01, 11, 0),
      l("b_flipflops", 2.2, h(2.2, 12.6), 12.6, 0),
      l("b_campfire", 6.4, h(6.4, 10.4), 10.4, 0, void 0, [0.34, 0.34]),
      l("b_cabin", -9.2, 0, 7.5, Math.PI, void 0, [1.6, 1.55]),
      l("b_bike", -5.3, 0, -2.4, Math.PI / 2));
    let f = p3("บ้านข้าวต้ม 🐾");
    (f.position.set(i + 6.2, 0, e + 7.2), (f.rotation.y = Math.PI), K.add(f));
  }
