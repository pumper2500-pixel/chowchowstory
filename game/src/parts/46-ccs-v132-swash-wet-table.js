  // ===== v132: คลื่นซัดหาดมีผลกับน้อง — ขนเปียก (เข้มขึ้นตามระดับน้ำ แล้วค่อย ๆ แห้ง) · น้ำกระเซ็นตอนหัวคลื่นถึงตัว · ขึ้นจากน้ำแล้วสะบัดตัว =====
  // สูตรระยะซัดขึ้นหาดเหมือนใน shader ของ ccsSwashMk (hash แบบไม่ใช้ sin จึงได้ค่าเดียวกันทั้ง CPU/GPU)
  var ccsFr = (v) => v - Math.floor(v);
  function ccsHs2(x, y) {
    let a = ccsFr(x * 0.1031),
      b = ccsFr(y * 0.1031),
      c = a,
      d = a * (b + 33.33) + b * (c + 33.33) + c * (a + 33.33);
    return ccsFr((a + d + (b + d)) * (c + d));
  }
  function ccsVn2(x, y) {
    let i = Math.floor(x),
      j = Math.floor(y),
      f = x - i,
      g = y - j,
      u = f * f * (3 - 2 * f),
      v = g * g * (3 - 2 * g),
      a = ccsHs2(i, j),
      b = ccsHs2(i + 1, j),
      c = ccsHs2(i, j + 1),
      d = ccsHs2(i + 1, j + 1);
    return a + (b - a) * u + (c + (d - c) * u - (a + (b - a) * u)) * v;
  }
  function ccsFb2(x, y) {
    let a = 0.5,
      s = 0;
    for (let i = 0; i < 3; i++) ((s += a * ccsVn2(x, y)), (x *= 2.03), (y *= 2.03), (a *= 0.5));
    return s;
  }
  function ccsReach(x, t) {
    let st = Math.max(0, Math.min(1, (ccsSeaV - 0.75) / 1.1)),
      per = 8.5 + (6 - 8.5) * st,
      ph = t / per + 0.35 * ccsVn2(x * 0.018, 3.1) + 0.15 * Math.sin(x * 0.07),
      k = Math.floor(ph),
      u = ph - k,
      big = 0.45 + 0.9 * Math.pow(ccsHs2(k, 7.3), 1.5),
      lobe = 0.65 + 0.5 * ccsVn2(x * 0.11 + k * 3.7, k) + 0.25 * Math.sin(x * 0.42 + k),
      run = u < 0.32 ? 1 - Math.pow(1 - u / 0.32, 2.2) : 1 - Math.pow((u - 0.32) / 0.68, 1.6);
    return { R: (1.1 + 5.8 * st) * big * lobe * Math.max(run, 0), u, big, k };
  }
  // คืนค่าว่าจุด (x,z) อยู่ใต้แผ่นน้ำคลื่นซัดไหม: in=0..1 (ลึกแค่ไหนจากหัวน้ำ), up=กำลังซัดขึ้น, big=ขนาดลูก, k=ลำดับลูก
  function ccsSwashAt(x, z) {
    let e0 = Rt + 1.2,
      best = { in: 0, up: !1, big: 0, k: -1, dz: -9 };
    for (let off of [0, 0.5]) {
      let r = ccsReach(x + off * 37 + (ccsFb2(x * 0.6 + off, z * 0.6 + off) - 0.5) * 1.2, ccsSeaT + off * 7.3),
        dz = z - (e0 - r.R);
      dz > best.dz && (best = { in: Math.max(0, Math.min(1, (dz + 0.04) / 0.5)), up: r.u < 0.32, big: r.big, k: r.k + off * 1e3, dz });
    }
    return best;
  }
  var ccsWet = { flat: 0, v: 0, y: 0, src: 0, prevIn: 0, k: -1, msgT: 0, hopT: 0, outT: 0, shakes: 0, shakeT: 0, applied: -1, appliedY: -1 },
    ccsShakeFx = null;
  function ccsShakeDrops(p, h) {
    if (!ccsShakeFx) {
      let g = new we(0.03, 5, 4),
        m = new be({ color: 15662335, transparent: !0, opacity: 0.8 });
      ccsShakeFx = Array.from({ length: 48 }, () => {
        let d = new R(g, m);
        return ((d.visible = !1), (d.frustumCulled = !1), K.add(d), { m: d, v: new H(), t: 9 });
      });
    }
    let n = 0;
    for (let d of ccsShakeFx) {
      if (d.t < 1.1 || n > 34) continue;
      n++;
      let a = Math.random() * Math.PI * 2,
        y = h * (0.35 + Math.random() * 0.5),
        sp = 2.2 + Math.random() * 2.4;
      // หยดน้ำสะบัดออกด้านข้างตามแนวหมุนตัว (สัมผัสวง) ขึ้นนิดหน่อยแล้วตกพื้น
      (d.m.position.set(p.x + Math.cos(a) * 0.25, p.y + y, p.z + Math.sin(a) * 0.25),
        d.v.set(Math.cos(a) * sp - Math.sin(a) * sp * 0.6, 0.8 + Math.random() * 1.8, Math.sin(a) * sp + Math.cos(a) * sp * 0.6),
        (d.t = -Math.random() * 0.45),
        (d.y0 = p.y),
        (d.m.visible = !1));
    }
  }
  function ccsShakeFxTick(e) {
    if (ccsShakeFx)
      for (let d of ccsShakeFx) {
        if (d.t >= 1.1) continue;
        if (((d.t += e), d.t < 0)) continue;
        ((d.m.visible = !0), (d.v.y -= 9.8 * e), d.m.position.addScaledVector(d.v, e), (d.m.position.y < d.y0 || d.t >= 1.1) && ((d.t = 9), (d.m.visible = !1)));
      }
  }
  function ccsWetTick(e, n) {
    if (!n || !n.rig) return;
    ccsShakeFxTick(e);
    ccsFurTick(e);
    let w = ccsWet,
      rg = n.rig,
      hgt = Math.max(0.3, rg.height ?? 0.8),
      lvl = 0,
      sw = null;
    ((w.msgT -= e), (w.hopT -= e), (w.shakeT -= e));
    if (!Se && j.started) {
      // 1) คลื่นซัดหาด (เฉพาะบนทรายริมทะเล ไม่ใช่บนท่าเรือ)
      if (n.pos.z > Rt - 9 && n.pos.z < Rt + 2 && ba(n.pos.x, n.pos.z) === null && Rd(n.pos.x, n.pos.z) === null && j.jy < 0.15) {
        sw = ccsSwashAt(n.pos.x, n.pos.z);
        if (sw.in > 0) {
          lvl = 0.16 + 0.18 * sw.in * Math.min(1.3, sw.big);
          // หัวคลื่นเพิ่งถึงตัว (ตอนซัดขึ้น) → น้ำกระเซ็น + เสียง
          if (w.prevIn <= 0 && sw.up && w.k !== sw.k) {
            w.k = sw.k;
            let s = 0.35 + 0.35 * Math.min(1.4, sw.big);
            (tl.burst(n.pos.clone(), Lc(n.pos.z) + 0.02, s), kp(_i(), s * 0.6));
            sw.big > 1.05 && w.hopT < 0 && n.spd < 0.2 && j.jy <= 0.001 && ((j.vy = 3.4), (w.hopT = 8), ccsDogSay("happy"));
            sw.big > 0.95 && w.msgT < 0 && ((w.msgT = 30), rt("💦 คลื่นซัดถึงตัว!", n.pos.clone().setY(1.4)));
          }
          // แรงน้ำ: ซัดขึ้นดันเข้าฝั่ง ไหลกลับดึงลงทะเลเบา ๆ (ทะเลแรงดันแรงขึ้น)
          let st = Math.max(0, Math.min(1, (ccsSeaV - 0.6) / 1.2)),
            f = (sw.up ? -0.55 : 0.22) * sw.in * (0.35 + st) * Math.min(1.3, sw.big),
            c = n.pos.clone();
          ((c.z += f * e), ri(c, 0.3) || n.pos.copy(c));
        }
        w.prevIn = sw.in;
      } else w.prevIn = 0;
      // 2) ลุยน้ำ/ว่ายน้ำ
      j.wade > 0.03 && (lvl = Math.max(lvl, Math.min(1.25, j.wade / hgt + 0.18 + (j.wade > 0.32 ? 0.6 : 0))));
      // 3) ฝนตก (ไม่ได้ใส่ชุดกันฝน) → เปียกทั้งตัวแบบบาง ๆ
      let rain = co?.cur?.r > 0.3 && !(ccsSetOn("rain") || ccsHG("rain"));
      rain && ((w.y = 1.25), (w.v = Math.min(0.6, w.v + e * 0.02)));
      if (lvl > 0) {
        ((w.y = Math.max(w.y, lvl)), (w.v = Math.min(1, w.v + e * 3)), (w.src = lvl), (w.outT = 0));
        lvl > 0.3 && (w.flat = 1);   // v144: ลงน้ำถึงตัว → ขนลีบ (จนกว่าจะสะบัดตัว)
        w.y > 0.45 && (w.shakes = 0);
      } else {
        // ขึ้นจากน้ำ: แห้งช้า ๆ (แดดแรงแห้งเร็ว กลางคืน/ฝนแห้งช้า)
        let hr = ((j.time ?? 0.5) % 1) * 24,
          dry = (rain ? 0 : 1) * (hr >= 7 && hr < 18 ? 1 / 55 : 1 / 110);
        ((w.v = Math.max(0, w.v - e * dry)), (w.outT += e), w.v < 0.03 && ((w.y = 0), (w.v = 0)), w.v < 0.15 && (w.flat = 0));
        // เปียกมาก (ลงน้ำถึงตัว) → หยุดยืนแล้วสะบัดตัว 1-2 ครั้ง ไล่น้ำ
        if (w.y > 0.38 && w.v > 0.3 && w.shakes < 2 && w.outT > 0.5 && w.shakeT < 0 && n.spd < 0.1 && j.jy <= 0.001 && !j.sleeping) ccsDoShake(n);
      }
    } else w.prevIn = 0;
    let vv = Math.round(w.v * 50) / 50,
      yy = Math.round(w.y * 25) / 25;
    (vv !== w.applied || yy !== w.appliedY) && rg.setWet && (rg.setWet(vv, yy), (w.applied = vv), (w.appliedY = yy));
    rg.setFurFlat && rg.setFurFlat(w.flat);
    // เพื่อนที่เดินตาม: ขึ้นจากน้ำแล้วสะบัดตัวเหมือนกัน
    for (let c of Pr) {
      if (!c.rig) continue;
      ((c.wetP = Math.max(c.wetP ?? 0, c.wade ?? 0)), (c.shT = (c.shT ?? 0) - e));
      (c.wade ?? 0) < 0.02 && c.wetP > 0.15 && (c.spd ?? 0) < 0.1 && c.shT < 0 && ((c.wetP = 0), (c.shT = 4), Io(c.rig, "shake"), ccsShakeDrops(c.rig.root.position, c.rig.height ?? 0.6));
    }
  }
  function ccsDoShake(n) {
    let w = ccsWet;
    ((w.shakes++), (w.shakeT = 2.6), (w.v *= 0.55), (w.flat = 0), Io(n.rig, "shake"));   // v144: สะบัดแล้วขนฟูกลับมา
    let o = B6.get(n.rig);
    o && ((o.it = 0), (o.end = 1.25));
    (ccsShakeDrops(n.rig.root.position, n.rig.height ?? 0.8), kp(_i(), 0.25));
    w.shakes === 1 && w.msgT < 0 && ((w.msgT = 30), rt("🐕💦 สะบัดน้ำ!", n.pos.clone().setY(1.4)));
  }
  // ===== v132: ด่าน "โต๊ะนั่งคอย" แบบท้าทาย (เรียกจาก ccsTRTick/ccsTRInput/HUD ในไฟล์ 40) =====
  //   sit = เข็มแกว่งไปมา กด ⤴ ตอนอยู่แถบเขียว · dis = สิ่งล่อใจมาจากซ้าย/ขวา กดทิศนั้น ("ไม่!") ตอนเข็มเข้าแถบเขียว ห้ามกด ⤴
  //   rel = เรียกลงจากโต๊ะ กด ⤴ ตอนเขียว · ถ้าปล่อยเข็มสุดแถบ น้องวิ่งตามของล่อใจลงโต๊ะไปเลย (ด่านที่เหลือพลาดหมด)
  function ccsTBZone(n) {
    let gw = ccsTRL().pw * (n.k === "sit" ? 0.7 : 0.9) + ccsSt("obey") * 0.0008;
    return n.k === "sit" ? { g0: 0.5 - gw, g1: 0.5 + gw, y0: 0.5 - gw * 2.2, y1: 0.5 + gw * 2.2 } : { g0: 0.62, g1: Math.min(0.97, 0.62 + gw * 2), y0: 0.45, y1: Math.min(0.99, 0.62 + gw * 2 + 0.12) };
  }
  function ccsTBP(n) {
    return n.k === "sit" ? ccsTRPow(n.sg ?? 0) : (n.p ?? 0);
  }
  function ccsTBLeave(t, dog) {
    ((t.left = 1), (t.tbOn = !1));
    for (let x of t.ev) (x.k === "dis" || x.k === "rel" || x.k === "sit") && x.res === null && (x.res = 0);
    (Io(dog.rig, "none"), ccsDogSay("happy"));
  }
  function ccsTBSit(dog) {
    Io(dog.rig, "sit");
    let o = B6.get(dog.rig);
    o && ((o.it = 0), (o.end = 99));
  }
  function ccsTBGrade(n, okTxt) {
    let p = ccsTBP(n),
      Z = ccsTBZone(n);
    return p >= Z.g0 && p <= Z.g1 ? [1, okTxt] : p >= Z.y0 && p <= Z.y1 ? [0.75, "👍 ผ่าน (จังหวะเกือบเป๊ะ)"] : [0, p < Z.g0 ? "⏩ เร็วไป!" : "🐢 ช้าไป!"];
  }
  function ccsTBTick(n, t, e, dog) {
    let sp = ccsTRL().spd,
      o6 = B6.get(dog.rig);
    ((t.tbOn = !t.left), o6 && (o6.it = 0)); // ค้างท่าปัจจุบันไว้ (ไม่สุ่มท่าเล่นเองบนโต๊ะ)
    if (n.k === "sit") {
      n.sg = (n.sg ?? 0) + e * 0.85 * sp;
      n.sg > 4.6 && (ccsTRRes(n, !1, "😜 ไม่ยอมนั่ง!"), ccsTBSit(dog));
    } else if (n.k === "dis") {
      if (n.w === void 0) n.w = 0.9 + Math.random() * 1.4;
      if (!n.on) {
        (n.w -= e) <= 0 && ((n.on = 1), (n.p = 0), ke("pop"), ccsTBShow(n, dog));
        return;
      }
      ((n.p += (e * sp) / 1.5), (n.fxT = (n.fxT ?? 0) - e) < 0 && ((n.fxT = 0.45), ccsTBShow(n, dog)));
      n.p >= 1 && (ccsTRRes(n, !1, `${n.ic} วิ่งตาม${n.nm}ลงโต๊ะไปแล้ว!`), ccsTBLeave(t, dog));
    } else if (n.k === "rel") {
      if (n.w === void 0) n.w = 0.7 + Math.random() * 0.9;
      if ((n.w -= e) > 0) return;
      n.on || ((n.on = 1), (n.p = 0), ke("pop"));
      ((n.p += (e * sp) / 1.6), n.p >= 1 && (ccsTRRes(n, !1, "🐢 เรียกช้าไป!"), Io(dog.rig, "none"), (t.tbOn = !1)));
    }
  }
  function ccsTBShow(n, dog) {
    // ของล่อใจลอยมาจากด้านข้างของจอ (ตามมุมกล้อง) เข้าหาน้อง
    let r = new H().setFromMatrixColumn(Lt.matrixWorld, 0).setY(0).normalize(),
      k = 2.6 - Math.min(1, n.p ?? 0) * 1.6;
    rt(n.ic, dog.pos.clone().addScaledVector(r, n.side === "L" ? -k : k).setY(1.1), "big");
  }
  function ccsTBInput(n, i, up, t) {
    if (up) return;
    let dog = Le[0];
    if (n.k === "sit") {
      if (i !== "A") return;
      let [q, m] = ccsTBGrade(n, "🐕 นั่งสวย!");
      (ccsTRRes(n, q > 0, q > 0 ? m : "😜 ไม่ยอมนั่ง (" + m.replace(/^\S+\s/, "") + ")", q || 1), ccsTBSit(dog));
    } else if (n.k === "dis") {
      if (i === "A") return void (ccsTRRes(n, !1, "🙈 สั่งลุกก่อนเวลา!"), ccsTBLeave(t, dog));
      if (!n.on) return void ccsTRRes(n, !1, "⏩ ยังไม่มีอะไรมาเลย น้องงง");
      if (i !== n.side) return void ccsTRRes(n, !1, "❌ ผิดทาง!");
      let [q, m] = ccsTBGrade(n, "🙅 ไม่! น้องนั่งนิ่งเลย");
      q === 0 && (n.p ?? 0) < ccsTBZone(n).y0 && ((q = 0.5), (m = "👍 ห้ามเร็วไปนิด"));
      ccsTRRes(n, q > 0, m, q || 1);
    } else if (n.k === "rel") {
      if (i !== "A") return;
      if (!n.on) return void (ccsTRRes(n, !1, "⏩ ยังไม่ถึงเวลาเรียก!"), Io(dog.rig, "none"), (t.tbOn = !1));
      let [q, m] = ccsTBGrade(n, "🏅 นั่งคอยเก่งมาก! ลงมา!");
      (ccsTRRes(n, q > 0, m, q || 1), Io(dog.rig, "none"), (t.tbOn = !1));
    }
  }
  function ccsTBHud(u, t, l, h, f, g) {
    let Z = ccsTBZone(u),
      p = ccsTBP(u),
      c = t.ev.filter((x) => x.res !== null).length + 1,
      P = (x) => `${Math.max(0, Math.min(100, x * 100))}%`,
      bar = () => ((h.style.left = P(p)), (f.style.cssText = `left:${P(Z.y0)};width:${P(Z.y1 - Z.y0)}`), (g.style.cssText = `left:${P(Z.g0)};width:${P(Z.g1 - Z.g0)}`)),
      off = () => ((h.style.left = "0%"), (f.style.cssText = "display:none"), (g.style.cssText = "display:none"));
    if (u.k === "sit") ((l.textContent = `${c}/${t.ev.length} · 🪑 สั่งนั่ง! กด ⤴ ตอนน้องหันมามอง (แถบเขียว)`), bar());
    else if (u.k === "dis") u.on ? ((l.textContent = `${c}/${t.ev.length} · ${u.ic} ${u.nm}มาทาง${u.side === "L" ? " ⬅ ซ้าย" : "ขวา ➡"}! กด ${u.side === "L" ? "⬅" : "➡"} บอก "ไม่!" ตอนเขียว`), bar()) : ((l.textContent = `${c}/${t.ev.length} · 🐕 คอย… ห้ามกดอะไร! ระวังของล่อใจ`), off());
    else u.on ? ((l.textContent = `${c}/${t.ev.length} · 📣 เรียกลง! กด ⤴ ตอนแถบเขียว`), bar()) : ((l.textContent = `${c}/${t.ev.length} · 🐕 คอยอีกนิด… ห้ามกด!`), off());
    (ccsTRHud.classList.remove("bal"), ccsTRHud.classList.toggle("hot", (u.k === "sit" || u.on) && p >= Z.g0 && p <= Z.g1));
  }
  // ===== v136: ขายของเกยตื้น (เปลือกหอย/สาหร่าย/ไข่มุก) ที่แผงปลาลุงทะเล (แทนชามผสมขนมที่เอาออกไป) =====
  var ccsBeachPrice = { shell: 15, kelp: 10, pearl: 80 };
  function ccsBeachSellHTML() {
    let have = Object.keys(ccsBeachPrice).map((k) => z.ing?.[k] ?? 0),
      tot = Object.keys(ccsBeachPrice).reduce((s, k, i) => s + have[i] * ccsBeachPrice[k], 0);
    return (
      `<p class="note">🐚 รับซื้อของเกยตื้นริมหาด (เก็บได้ทุกเช้าและหลังฝนหยุด)</p>` +
      Object.keys(ccsBeachPrice)
        .map((k, i) => `<div class="row"><span class="ic">${ccsLootDef[k].ic}</span><div><b>ขาย${ccsLootDef[k].n}</b><small>ชิ้นละ ${ccsBeachPrice[k]} 💰 · มี ${have[i]} ชิ้น</small></div><button class="buy" data-bsell="${k}" ${have[i] > 0 ? "" : "disabled"}>ขาย 1</button></div>`)
        .join("") +
      `<button class="buy wide" data-bsell="all" ${tot > 0 ? "" : "disabled"}>💰 ขายทั้งหมด (+${tot} 💰)</button>`
    );
  }
  function ccsBeachSellBind(redo, pos) {
    document.querySelectorAll("[data-bsell]").forEach((b) =>
      b.addEventListener("click", () => {
        z.ing ??= { shell: 0, kelp: 0, pearl: 0 };
        let ks = b.dataset.bsell === "all" ? Object.keys(ccsBeachPrice) : [b.dataset.bsell],
          got = 0,
          n = 0;
        for (let k of ks) {
          let c = b.dataset.bsell === "all" ? z.ing[k] ?? 0 : Math.min(1, z.ing[k] ?? 0);
          ((z.ing[k] = (z.ing[k] ?? 0) - c), (got += c * ccsBeachPrice[k]), (n += c));
        }
        if (!n) return void ke("nope");
        ((z.money += got), ke("coin"), Ei(), _t(z), rt(`+${got} 💰`, Le[0].pos.clone().setY(1.5), "big"));
        Ln(pos, ["ของสวยดีนี่ ลุงรับไว้ทำของที่ระลึก", "ไข่มุกเม็ดนี้งามจริง ๆ", "สาหร่ายสดเอาไปทำอาหารได้ ขอบใจนะ"][Math.floor(Math.random() * 3)]);
        redo();
      }),
    );
  }
  // ===== v140 (ร่าง): ขนฟูแบบชั้นเปลือก (shell fur) ให้น้องเชาเชา — ใช้เรขาคณิตเดียวกับตัว + วัสดุชุดเดียวกัน (ท่าทางขยับตามกัน) =====
  var ccsFurList = [];

  // v145: หาตำแหน่งหูของเชาเชาจากรูปทรงโมเดล — ผิวบนหัวที่ไม่ได้หันออกจากกลางหัว (แผ่นหู/ขอบหู) → ค่า aEar 0..1
  //   แล้วเกลี่ยเฉลี่ยกับจุดรอบ ๆ (รัศมี ~5 ซม.) ให้ขอบนุ่ม ไม่มีจุดเดี่ยว ๆ โด่เป็นเส้น
  function ccsEarMask(g, H, L, hx) {
    let P = g.getAttribute("position"), N = g.getAttribute("normal"), n = P.count,
      sc = H / 1.15, ny = 0.71 * sc, nz = 0.33 * sc,
      cx = hx, cy = ny + 0.19 * H, cz = nz + 0.07 * L,
      raw = new Float32Array(n), ear = new Float32Array(n), idx = [], cell = 0.04 * sc, grid = new Map();
    for (let i = 0; i < n; i++) {
      let x = P.getX(i), y = P.getY(i), z = P.getZ(i);
      if (y < cy + 0.04 * H || z < nz - 0.12 * L || z > cz + 0.12 * L) continue;
      let dx = x - cx, dy = y - cy, dz = z - cz, dl = Math.hypot(dx, dy, dz) || 1,
        al = (N.getX(i) * dx + N.getY(i) * dy + N.getZ(i) * dz) / dl;
      raw[i] = al < 0.45 ? 1 : 0;
      idx.push(i);
      let k = Math.floor(x / cell) + "," + Math.floor(y / cell) + "," + Math.floor(z / cell);
      (grid.get(k) ?? grid.set(k, []).get(k)).push(i);
    }
    let R2 = (0.05 * sc) ** 2;
    for (let i of idx) {
      let x = P.getX(i), y = P.getY(i), z = P.getZ(i), gx = Math.floor(x / cell), gy = Math.floor(y / cell), gz = Math.floor(z / cell), s = 0, c = 0;
      for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (let d = -1; d <= 1; d++) {
        let lst = grid.get(gx + a + "," + (gy + b) + "," + (gz + d));
        if (lst) for (let j of lst) { let ex = P.getX(j) - x, ey = P.getY(j) - y, ez = P.getZ(j) - z; ex * ex + ey * ey + ez * ez < R2 && ((s += raw[j]), c++); }
      }
      let m = c ? s / c : 0, t = Math.min(1, Math.max(0, (m - 0.2) / 0.35));
      ear[i] = t * t * (3 - 2 * t);
    }
    g.setAttribute("aEar", new Je(ear, 1));
  }
  function ccsFurShells(p, u, d) {
    let base = u.onBeforeCompile,
      n = 8,
      list = [],
      a2c = !1;
    try { a2c = !!dn?.getContextAttributes?.()?.antialias; } catch (e) {}   // v145: มี MSAA → ขอบขนนุ่ม
    for (let i = 0; i < n; i++) {
      let k = (i + 1) / n,
        sm = u.clone();
      ((sm.color = u.color),
        (sm.onBeforeCompile = (v, r) => {
          let df = "#define FUR_SHELL\n" + (a2c ? "#define FUR_A2C\n" : "");
          (base(v, r), (v.uniforms.uShellK = { value: k }), (v.vertexShader = df + v.vertexShader), (v.fragmentShader = df + v.fragmentShader));
        }),
        (sm.alphaToCoverage = a2c),
        a2c && ((sm.blending = 5), (sm.blendSrc = 201), (sm.blendDst = 200), (sm.blendSrcAlpha = 200), (sm.blendDstAlpha = 201)),   // สีทับปกติ แต่ไม่เขียนค่า alpha ลงจอ (ไม่ให้พื้นหลังหน้าเว็บโผล่ทะลุขน)
        (sm.customProgramCacheKey = () => "ccsFur" + (a2c ? "A" : "")));
      let m = new R(p.geometry, sm);
      ((m.castShadow = !1), (m.receiveShadow = !0), (m.visible = !1), (m.userData.noOcc = !0), (m.userData.ccsShell = !0), p.add(m), list.push(m));
    }
    ccsFurList.push({ list, d, p, last: null, on: 0 });
  }
  // ทุกเฟรม: เปิดชั้นขนเฉพาะน้องเชาเชาที่อยู่ใกล้กล้อง (คอม 8 ชั้น ≤ 5 ตัว · มือถือ 4 ชั้น ≤ 3 ตัว) · คำนวณความเร็วให้ขนลู่ตามการวิ่ง
  var ccsFurMobile = /Android|iPhone|iPad|Mobi/i.test(navigator.userAgent),
    ccsFurOff = !1,
    ccsFurV = new H(),
    ccsFurW = new H();
  function ccsFurTick(e) {
    if (!ccsFurList.length) return;
    let cam = Lt.position,
      near = [];
    for (let f of ccsFurList) {
      f.p.getWorldPosition(ccsFurW);
      let vis = !ccsFurOff;
      for (let o = f.p; o && vis; o = o.parent) o.visible || (vis = !1);
      let dd = ccsFurW.distanceTo(cam);
      // ความเร็วในแกนของตัวหมา (ให้ปลายขนลู่ไปทางตรงข้าม)
      if (f.last && e > 0) {
        ccsFurV.subVectors(ccsFurW, f.last).divideScalar(Math.max(e, 0.001));
        let q = f.p.getWorldQuaternion(ccsFurQ).invert(),
          sc = f.p.getWorldScale(ccsFurS).x || 1;
        (ccsFurV.applyQuaternion(q).divideScalar(sc * 6).clampLength(0, 1), f.d.uFurVel.value.lerp(ccsFurV, Math.min(1, e * 6)));
      }
      ((f.last = (f.last ?? new H()).copy(ccsFurW)), (f.d.uFurT.value += e));
      let me = !1;
      for (let o = f.p; o; o = o.parent) o === Le[0]?.rig?.root && (me = !0);
      vis && (me || dd < (ccsFurMobile ? 12 : 22)) && near.push([me ? -1 : dd, f]);   // v144: น้องของเรามีขนฟูเสมอ (ไม่หายตามระยะกล้อง)
    }
    near.sort((a, b) => a[0] - b[0]);
    let cap = ccsFurMobile ? 3 : 5,
      keep = new Set(near.slice(0, cap).map((x) => x[1]));
    for (let f of ccsFurList)
      f.list.forEach((m, i) => {
        m.visible = keep.has(f) && (!ccsFurMobile || i % 2 === 1);
      });
  }
  var ccsFurQ = new At(),
    ccsFurS = new H();
  // ดีบัก: puff = ความอ้วน (สัดส่วนความสูงตัว), shells = เปิด/ปิดชั้นขน, len = ความยาวขน
  function ccsFluff(puff = 0.06, shells = !0, len = 0.05) {
    ccsFurOff = !shells;
    for (let f of ccsFurList) ((f.d.uPuff.value = puff), (f.d.uFurLen.value = len));
    return { puff, shells, len, dogs: ccsFurList.length, mobile: ccsFurMobile };
  }
