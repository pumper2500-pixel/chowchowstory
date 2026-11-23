  var Rt = 72,
    Ph = -0.12;
  function Lc(i) {
    let e = i - (Rt - 1.35);
    return e <= 0 ? 0 : -Math.min(3, e * 0.085 + e * e * 0.004);
  }
  var oM = `
float hsh(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(hsh(i),hsh(i+vec2(1,0)),u.x), mix(hsh(i+vec2(0,1)),hsh(i+vec2(1,1)),u.x), u.y); }
float fbm(vec2 p){ float a=0.5, s=0.0; for(int i=0;i<4;i++){ s+=a*vn(p); p*=2.03; a*=0.5; } return s; }
// ความสูงคลื่นเล็ก ๆ ใช้ทำ normal
float rip(vec2 p, float t){ return sin(p.x*1.7+t*1.9)*0.35 + sin(p.y*2.3-t*1.4+p.x*0.6)*0.3 + fbm(p*0.9+vec2(t*0.25,-t*0.18))*0.9; }
`,
    rM = [];
  function aM(i, e, t, n, s, o) {
    for (let r of rM)
      ((r.uT.value = i),
        r.uCam.value.copy(e),
        r.uSun.value.copy(t),
        r.uSky.value.copy(n),
        r.uFog.value.copy(s),
        (r.uNight.value = o));
  }
  function cM() {
    let i = Y7();
    return (rM.push(i), i);
  }
  function Y7() {
    return {
      uT: { value: 0 },
      uSun: { value: new H(0.4, 0.8, 0.3).normalize() },
      uSky: { value: new ae(12576501) },
      uFog: { value: new ae(14676471) },
      uNight: { value: 0 },
      uCam: { value: new H() },
    };
  }
  var Z7 = (i) => 0.9 * Math.sin(i * 0.11) + 0.5 * Math.sin(i * 0.29 + 1.3) + 0.25 * Math.sin(i * 0.83 + 0.4);
  function lM(i, e, t, n, s) {
    let o = e - Rt + Z7(i),
      r = Math.max(0, Math.min(1, (o + 2.5) / 8.5)),
      a = r * r * (3 - 2 * r);
    return o < 6 ? t.clone().lerp(n, a) : n.clone().lerp(s, Math.min(1, (o - 6) / 25));
  }
  function hM(i, e, t = !1) {
    let n = cM();
    e && ((e.wrapS = e.wrapT = gn), (e.colorSpace = Ye));
    let s = new Qt({
        uniforms: { ...n, uShore: { value: Rt }, uWave: { value: e ?? null }, uHasWave: { value: e ? 1 : 0 } },
        transparent: !0,
        depthWrite: !1,
        fog: !1,
        defines: t ? { HQ: 1 } : {},
        vertexShader: `uniform float uT, uShore; varying vec3 vW; varying float vWave; varying vec3 vN; varying float vFoam;
      // คลื่นมหาสมุทรแบบ Gerstner (PC): หลายลูกคลื่นซ้อนกัน ยอดแหลม ท้องคลื่นกว้าง วิ่งเข้าหาฝั่ง
      vec3 gerst(vec2 xz, vec2 dir, float L, float A, float Q, float sp, inout vec3 T, inout vec3 B){
        float k = 6.2831/L; vec2 d = normalize(dir); float f = k*(dot(d, xz) - sp*uT); float c = cos(f), s = sin(f);
        T += vec3(-Q*d.x*d.x*A*k*s, d.x*A*k*c, -Q*d.x*d.y*A*k*s); B += vec3(-Q*d.x*d.y*A*k*s, d.y*A*k*c, -Q*d.y*d.y*A*k*s);
        return vec3(Q*A*d.x*c, A*s, Q*A*d.y*c); }
      void main(){ vec4 w = modelMatrix*vec4(position,1.0);
        float d = max(0.0, w.z - uShore);
        float amp = 0.015 + 0.22*smoothstep(4.0, 40.0, d);
        float h = sin(w.x*0.21 + uT*0.9)*0.45 + sin(w.z*0.33 - uT*1.35 + w.x*0.07)*0.4 + sin((w.x - w.z)*0.6 + uT*2.1)*0.15;
        vN = vec3(0.0, 1.0, 0.0); vFoam = 0.0;
      #ifdef HQ
        float ga = smoothstep(3.0, 45.0, d);                   // ริมหาดคลื่นเบา ออกไปไกลคลื่นสูง
        vec3 T = vec3(1.0,0.0,0.0), B = vec3(0.0,0.0,1.0); vec3 off = vec3(0.0); vec2 p = w.xz;
        off += gerst(p, vec2(0.15,-1.0), 38.0, 0.6*ga, 0.55, 5.2, T, B);
        off += gerst(p, vec2(-0.35,-1.0), 21.0, 0.34*ga, 0.6, 4.1, T, B);
        off += gerst(p, vec2(0.6,-0.8), 13.0, 0.26*ga, 0.65, 3.3, T, B);
        off += gerst(p, vec2(-0.8,-0.6), 7.5, 0.14*ga, 0.7, 2.6, T, B);
        off += gerst(p, vec2(0.3,-0.95), 4.2, 0.07*ga, 0.7, 1.9, T, B);
        off += gerst(p, vec2(1.0,-0.2), 2.6, 0.035*ga, 0.6, 1.5, T, B);
        w.xyz += off; w.y += h*amp*0.4; vN = normalize(cross(B, T)); vWave = off.y / max(0.3, 1.9*ga) ;
        vFoam = clamp((off.y - 0.55*ga) / max(0.2, 0.9*ga), 0.0, 1.0);   // ยอดคลื่นสูง → ฟองขาว
      #else
        w.y += h*amp; vWave = h;
      #endif
        vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,
        fragmentShader: `uniform float uT, uShore, uNight, uHasWave; uniform sampler2D uWave; uniform vec3 uSun, uSky, uFog, uCam; varying vec3 vW; varying float vWave; varying vec3 vN; varying float vFoam;
      ${oM}
      float sandY(float z){ float d = z - (uShore - 1.35); if (d <= 0.0) return 0.0; return -min(3.0, d*0.085 + d*d*0.004); }
      void main(){
        float d = vW.z - uShore;
        float wd = vW.y - sandY(vW.z);       // ความลึกน้ำจริงเหนือพื้นทราย
        // สีตามความลึก: ใสอมฟ้า → เขียวมรกต → ฟ้า → น้ำเงินเข้ม
        vec3 c = mix(vec3(0.62,0.93,0.90), vec3(0.18,0.76,0.70), smoothstep(-1.0, 7.0, d));
        c = mix(c, vec3(0.10,0.55,0.78), smoothstep(8.0, 26.0, d));
        c = mix(c, vec3(0.05,0.23,0.52), smoothstep(30.0, 110.0, d));
        // ผิวคลื่นจริงจากภาพ ocean wave ของพี่ปั๊ม: สองชั้นเลื่อนสวนกัน ให้รายละเอียดคลื่น/ฟองเม็ดเล็ก แต่คงสีไล่ความลึกเดิม
        vec3 wv = vec3(0.5);
        if (uHasWave > 0.5) { vec3 w1 = texture2D(uWave, vW.xz/16.0 + vec2(uT*0.012, uT*0.02)).rgb; vec3 w2 = texture2D(uWave, vW.xz/27.0 + vec2(-uT*0.009, uT*0.013) + 0.37).rgb; wv = (w1 + w2) * 0.5;
          float lum = dot(wv, vec3(0.3, 0.59, 0.11)); float deepK = smoothstep(1.5, 18.0, d);
          c *= mix(1.0, 0.55 + lum * 1.55, deepK * 0.85);                            // ลายคลื่นเข้ม-สว่างตามภาพ
          c += vec3(0.85, 0.95, 1.0) * smoothstep(0.5, 0.8, max(w1.g, w2.g)) * 0.35 * deepK * (1.0 - uNight*0.7); }   // ฟองเม็ดเล็กระยิบ
        // normal จากระลอกเล็ก
        vec2 p = vW.xz*0.55; float e = 0.06;
        float h0 = rip(p,uT), hx = rip(p+vec2(e,0.0),uT), hz = rip(p+vec2(0.0,e),uT);
        vec3 n = normalize(vec3(-(hx-h0)/e*0.14 + (wv.r-0.45)*0.5*uHasWave, 1.0, -(hz-h0)/e*0.14 + (wv.b-0.5)*0.5*uHasWave));
      #ifdef HQ
        n = normalize(vec3(vN.x + n.x*0.6, vN.y, vN.z + n.z*0.6));
        { vec3 L = normalize(uSun); vec3 V0 = normalize(uCam - vW);
          // แสงทะลุยอดคลื่น (subsurface): ยอดคลื่นที่หันรับแสงจะใสเป็นเขียวมรกต
          float sss = pow(max(dot(V0, -vec3(L.x, -0.2, L.z)), 0.0), 3.0) * smoothstep(0.0, 0.9, vWave) * (1.0 - uNight);
          c += vec3(0.05, 0.42, 0.38) * sss * 1.4 * smoothstep(4.0, 20.0, d);
          c *= mix(0.78, 1.08, smoothstep(-0.6, 0.8, vWave));   // ท้องคลื่นเข้ม ยอดคลื่นสว่าง
          float fo = vFoam * smoothstep(0.35, 0.7, fbm(vW.xz*0.9 + uT*0.3)) + vFoam*vFoam*0.5;
          c = mix(c, vec3(0.95, 0.98, 1.0) * (1.0 - uNight*0.6), clamp(fo * 0.8, 0.0, 0.75)); }
      #endif
        vec3 V = normalize(uCam - vW);
        float fres = pow(1.0 - max(dot(n, V), 0.0), 3.0);
        c = mix(c, uSky*1.05, fres*0.35);
        // แสงแดดสะท้อนระยิบ
        vec3 H = normalize(uSun + V);
        float spec = pow(max(dot(n, H), 0.0), 140.0) * (1.0 - uNight*0.85);
      #ifdef HQ
        spec += pow(max(dot(n, H), 0.0), 18.0) * 0.12 * (1.0 - uNight*0.9);   // ประกายแดดกว้างบนผิวคลื่น
      #endif
        c += vec3(1.0,0.97,0.9) * spec * 1.6;
        // แสงลายน้ำในที่ตื้น
        float ca = pow(abs(sin(fbm(vW.xz*0.8 + uT*0.35)*9.0)), 6.0);
        c += vec3(0.9,1.0,0.95) * ca * 0.22 * (1.0 - smoothstep(0.0, 9.0, d));
        // ฟองคลื่นริมฝั่ง + แนวคลื่นซัดเข้าหาด
        float edge = 0.10 + 0.08*sin(vW.x*0.23 + uT*0.9) + 0.06*fbm(vW.xz*0.6 + uT*0.25);
        float foam = (1.0 - smoothstep(edge*0.4, edge + 0.12, wd)) * smoothstep(0.0, 0.03, wd);
        foam += smoothstep(0.9, 1.0, sin(wd*22.0 - uT*2.4 + fbm(vW.xz*0.5)*2.0)) * (1.0 - smoothstep(0.1, 0.5, wd)) * 0.6;
        float band = smoothstep(0.82, 1.0, sin(d*0.9 - uT*1.6 + fbm(vW.xz*0.3)*3.0)) * (1.0 - smoothstep(1.0, 9.0, d)) * smoothstep(0.3, 0.7, fbm(vW.xz*1.6 + uT*0.4));
        float crest = smoothstep(0.75, 1.0, vWave) * smoothstep(10.0, 40.0, d) * 0.35 * fbm(vW.xz*2.0);
        c = mix(c, vec3(1.0), clamp(foam*0.9 + band*0.55 + crest, 0.0, 1.0));
        c *= mix(1.0, 0.35, uNight);
        float dist = length(vW - uCam);
        c = mix(c, uFog, smoothstep(150.0, 420.0, dist) * 0.85);
        float a = mix(0.5, 0.97, smoothstep(0.05, 1.6, wd));
        a = max(a, min(foam, 1.0)*0.9);
        a *= smoothstep(0.0, 0.05, wd);
        gl_FragColor = vec4(c, a); }`,
      }),
      o = new Te(900, 420, t ? 640 : 220, t ? 300 : 110);
    o.rotateX(-Math.PI / 2);
    let r = new R(o, s);
    (r.position.set(0, Ph, Rt - 4 + 210), (r.renderOrder = 2), i.add(r));
    let a = new Te(900, 70, 450, 70);
    a.rotateX(-Math.PI / 2);
    let c = a.getAttribute("position"),
      l = [],
      h = new ae(15785130),
      f = new ae(13217402),
      d = new ae(9414794);
    for (let E = 0; E < c.count; E++) {
      let g = c.getZ(E) + Rt + 25,
        y = c.getX(E),
        x = Lc(g);
      c.setY(E, x);
      let b = lM(y, g, h, f, d),
        w = 0.92 + Math.random() * 0.1;
      l.push(b.r * w, b.g * w, b.b * w);
    }
    (a.setAttribute("color", new Fe(l, 3)), a.computeVertexNormals());
    let u = new R(a, new bt({ vertexColors: !0 }));
    (a.translate(0, 0, Rt + 25), (u.receiveShadow = !0), i.add(u));
    let p = new bt({ color: 16773600 }),
      m = new bt({ color: 15895658 });
    for (let E = 0; E < 40; E++) {
      let g = (Math.random() - 0.5) * 180,
        y = Rt - 7 + Math.random() * 6,
        b =
          E % 3 === 0
            ? new R(new re(0.16, 0.16, 0.03, 5), m)
            : new R(new we(0.08, 6, 4, 0, Math.PI * 2, 0, Math.PI / 2), p);
      (b.position.set(g, Lc(y) + 0.02, y), (b.rotation.y = Math.random() * 6), i.add(b));
    }
    return n;
  }
  function d3(i, e) {
    let t = cM(),
      n = new Qt({
        uniforms: { ...t, uR: { value: i } },
        transparent: !0,
        depthWrite: !1,
        fog: !1,
        vertexShader:
          "varying vec3 vW; varying vec2 vL; void main(){ vec4 w = modelMatrix*vec4(position,1.0); vW = w.xyz; vL = position.xy; gl_Position = projectionMatrix*viewMatrix*w; }",
        fragmentShader: `uniform float uT, uR, uNight; uniform vec3 uSun, uSky, uFog, uCam; varying vec3 vW; varying vec2 vL;
      ${oM}
      void main(){
        float d = uR - length(vL);
        vec3 c = mix(vec3(0.58,0.90,0.86), vec3(0.14,0.62,0.58), smoothstep(0.0, uR*0.55, d));
        c = mix(c, vec3(0.08,0.38,0.52), smoothstep(uR*0.5, uR, d));
        // ผิวน้ำ: ระลอกคลื่นเล็ก ๆ สุ่มสองชั้น (ไม่เป็นวงแหวน)
        vec2 p = vW.xz*1.6; float e = 0.04;
        float h0 = rip(p,uT*0.6) + 0.5*rip(p*2.3+7.1,uT*1.1), hx = rip(p+vec2(e,0.0),uT*0.6) + 0.5*rip((p+vec2(e,0.0))*2.3+7.1,uT*1.1), hz = rip(p+vec2(0.0,e),uT*0.6) + 0.5*rip((p+vec2(0.0,e))*2.3+7.1,uT*1.1);
        vec3 n = normalize(vec3(-(hx-h0)/e*0.05, 1.0, -(hz-h0)/e*0.05));
        vec3 V = normalize(uCam - vW);
        c = mix(c, uSky, pow(1.0 - max(dot(n,V),0.0), 3.0)*0.5);
        c += vec3(1.0) * pow(max(dot(n, normalize(uSun + V)), 0.0), 120.0) * 1.3 * (1.0 - uNight*0.85);
        c = mix(c, vec3(0.85,0.95,0.95), (1.0 - smoothstep(0.0, 0.25, d)) * 0.25);
        c *= mix(1.0, 0.4, uNight);
        gl_FragColor = vec4(c, mix(0.7, 0.95, smoothstep(0.0, uR*0.6, d))); }`,
      }),
      s = e ? new Is(e, 24) : new gt(i, 48),
      o = new R(s, n);
    return ((o.rotation.x = -Math.PI / 2), (o.renderOrder = 2), { mesh: o, u: t });
  }
  function K7(i) {
    let n = document.createElement("canvas");
    ((n.width = 512), (n.height = 288));
    let s = n.getContext("2d"),
      o = i,
      r = () => ((o = (o * 16807) % 2147483647), (o - 1) / 2147483646),
      a = [],
      c = 9 + Math.floor(r() * 6);
    for (let d = 0; d < c; d++) {
      let u = d / (c - 1),
        p = 512 * (0.14 + u * 0.72) + (r() - 0.5) * 40,
        m = Math.sin(u * Math.PI),
        E = 34 + m * 62 * (0.7 + r() * 0.5),
        g = 288 * 0.74 - m * 70 - E * 0.35 + (r() - 0.5) * 18;
      a.push([p, g, E]);
    }
    for (let d = 0; d < 7; d++) a.push([512 * (0.22 + r() * 0.56), 288 * (0.35 + r() * 0.2), 30 + r() * 34]);
    for (let [d, u, p] of a) {
      let m = s.createRadialGradient(d, u + p * 0.3, p * 0.2, d, u + p * 0.25, p * 1.05);
      (m.addColorStop(0, "rgba(176,184,222,0.95)"),
        m.addColorStop(0.75, "rgba(170,178,215,0.75)"),
        m.addColorStop(1, "rgba(170,178,215,0)"),
        (s.fillStyle = m),
        s.beginPath(),
        s.arc(d, u + p * 0.25, p * 1.05, 0, Math.PI * 2),
        s.fill());
    }
    for (let [d, u, p] of a) {
      let m = s.createRadialGradient(d - p * 0.2, u - p * 0.35, p * 0.1, d, u - p * 0.1, p * 0.95);
      (m.addColorStop(0, "rgba(255,255,255,1)"),
        m.addColorStop(0.6, "rgba(250,251,255,0.92)"),
        m.addColorStop(1, "rgba(240,244,255,0)"),
        (s.fillStyle = m),
        s.beginPath(),
        s.arc(d, u - p * 0.1, p * 0.95, 0, Math.PI * 2),
        s.fill());
    }
    let l = s.createLinearGradient(0, 288 * 0.62, 0, 288 * 0.86);
    (l.addColorStop(0, "rgba(160,170,210,0)"),
      l.addColorStop(1, "rgba(150,160,205,0)"),
      (s.fillStyle = l),
      s.fillRect(0, 288 * 0.62, 512, 288 * 0.24),
      (s.globalCompositeOperation = "destination-out"));
    let h = s.createLinearGradient(0, 288 * 0.8, 0, 288 * 0.95);
    (h.addColorStop(0, "rgba(0,0,0,0)"),
      h.addColorStop(1, "rgba(0,0,0,1)"),
      (s.fillStyle = h),
      s.fillRect(0, 288 * 0.8, 512, 288 * 0.2));
    let f = new ut(n);
    return ((f.colorSpace = Ye), f);
  }
  function dM(i) {
    let e = [],
      t = [1, 2, 3, 4, 5, 6].map((s) => K7(s * 7919)),
      n = new ae(1, 1, 1);
    for (let s = 0; s < 26; s++) {
      let o = new vi({ map: t[s % t.length], transparent: !0, depthWrite: !1, fog: !1, color: n }),
        r = new zi(o),
        a = (s / 26) * Math.PI * 2 + Math.random() * 0.2,
        c = 230 + Math.random() * 150,
        l = 90 + Math.random() * 90;
      (r.scale.set(l, l * 0.56, 1),
        r.position.set(Math.cos(a) * c, 58 + Math.random() * 50 + (c - 230) * 0.15, Math.sin(a) * c),
        (r.renderOrder = -1),
        i.add(r),
        e.push({ s: r, v: 0.8 + Math.random() * 1.2 }));
    }
    return (s, o, r = 1) => {
      for (let a of e) {
        ((a.s.position.x += a.v * s), a.s.position.x > 420 && (a.s.position.x = -420));
        let c = a.s.material;
        (c.color.copy(o), (c.opacity = r));
      }
    };
  }
  function fM(i) {
    let t = new be({ color: 15662335, transparent: !0, opacity: 0.85 }),
      n = new we(0.05, 6, 4),
      s = Array.from({ length: 90 }, () => {
        let d = new R(n, t);
        return ((d.visible = !1), i.add(d), { m: d, v: new H(), t: 0, y0: 0 });
      }),
      o = new Te(2, 2);
    o.rotateX(-Math.PI / 2);
    let r = () =>
        new Qt({
          transparent: !0,
          depthWrite: !1,
          uniforms: { uT: { value: 0 }, uBig: { value: 1 } },
          vertexShader:
            "varying vec2 vUv; void main(){ vUv = uv * 2.0 - 1.0; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
          fragmentShader: `uniform float uT, uBig; varying vec2 vUv;
      void main(){
        float r = length(vUv);
        float front = uT * 0.62;                       // หน้าคลื่นลูกแรก (สัดส่วนของรัศมีแผ่น)
        float d = front - r;                           // ระยะหลังหน้าคลื่น (คลื่นลูกถัด ๆ ไปตามมา)
        float env = smoothstep(-0.02, 0.06, d) * exp(-d * 5.5);    // มีคลื่นเฉพาะหลังหน้าคลื่น ลดลงเรื่อย ๆ
        float w = sin(d * 46.0) * env;
        float fade = (1.0 - smoothstep(0.55, 1.0, uT)) * (1.0 - smoothstep(0.75, 1.0, r)) * smoothstep(0.0, 0.08, r + 0.02);
        float hi = max(w, 0.0), lo = max(-w, 0.0);
        vec3 col = mix(vec3(0.16, 0.36, 0.42), vec3(0.93, 0.98, 1.0), step(0.0, w));
        float a = (hi * 0.42 + lo * 0.16) * fade;
        if (a < 0.004) discard;
        gl_FragColor = vec4(col, a);
      }`,
        }),
      a = Array.from({ length: 12 }, () => {
        let d = new R(o, r());
        return ((d.visible = !1), (d.renderOrder = 3), i.add(d), { m: d, t: 0, big: 1 });
      }),
      c = 0,
      l = 0;
    return {
      burst: (d, u, p = 1) => {
        let m = Math.round(10 + p * 14);
        for (let g = 0; g < m; g++) {
          let y = s[c++ % 90],
            x = Math.random() * Math.PI * 2,
            b = (1.2 + Math.random() * 2.2) * p;
          ((y.m.visible = !0),
            y.m.position.set(d.x + Math.cos(x) * 0.2, u + 0.05, d.z + Math.sin(x) * 0.2),
            y.v.set(Math.cos(x) * b * 0.6, 2.5 + Math.random() * 2.6 * p, Math.sin(x) * b * 0.6),
            (y.t = 0),
            (y.y0 = u),
            y.m.scale.setScalar(0.6 + Math.random() * 0.9));
        }
        let E = a[l++ % a.length];
        ((E.m.visible = !0), (E.t = 0), (E.big = 0.6 + p * 0.8), E.m.position.set(d.x, u + 0.03, d.z));
      },
      update: (d) => {
        for (let u of s)
          u.m.visible &&
            ((u.t += d),
            (u.v.y -= 11 * d),
            u.m.position.addScaledVector(u.v, d),
            (u.m.position.y < u.y0 || u.t > 1.6) && (u.m.visible = !1));
        for (let u of a) {
          if (!u.m.visible) continue;
          u.t += d;
          let p = 1.5 + u.big * 0.5,
            m = u.t / p,
            E = 1.2 + u.big * 1.6;
          u.m.scale.set(E, 1, E);
          let g = u.m.material.uniforms;
          ((g.uT.value = m), (g.uBig.value = u.big), m >= 1 && (u.m.visible = !1));
        }
      },
    };
  }
  function uM(i, e, t) {
    let n = new J();
    (n.position.copy(e), i.add(n));
    let s = new X({ color: 14209216, roughness: 0.85 }),
      o = new R(new re(1.5, 1.7, 0.45, 28), s);
    ((o.position.y = t + 0.1), n.add(o));
    let r = new R(new gt(1.35, 28), new X({ color: 8377312, roughness: 0.1, transparent: !0, opacity: 0.85 }));
    ((r.rotation.x = -Math.PI / 2), (r.position.y = t + 0.33), n.add(r));
    let a = new R(new re(0.28, 0.4, 1.2, 16), s);
    ((a.position.y = t + 0.9), n.add(a));
    let c = new R(new re(0.75, 0.45, 0.3, 24), s);
    ((c.position.y = t + 1.55), n.add(c), (o.castShadow = c.castShadow = a.castShadow = !0));
    let l = 5e3,
      h = new Float32Array(l * 3),
      f = new Float32Array(l * 3),
      d = new Float32Array(l),
      u = new qe();
    u.setAttribute("position", new Je(h, 3));
    let p = (() => {
        let O = document.createElement("canvas");
        O.width = O.height = 32;
        let U = O.getContext("2d"),
          W = U.createRadialGradient(16, 16, 0, 16, 16, 16);
        return (
          W.addColorStop(0, "rgba(255,255,255,1)"),
          W.addColorStop(0.5, "rgba(230,248,255,.7)"),
          W.addColorStop(1, "rgba(230,248,255,0)"),
          (U.fillStyle = W),
          U.fillRect(0, 0, 32, 32),
          new ut(O)
        );
      })(),
      m = new bs(u, new ls({ size: 0.16, map: p, transparent: !0, depthWrite: !1, color: 15661823 }));
    ((m.frustumCulled = !1), n.add(m));
    for (let O = 0; O < l; O++) ((d[O] = -1), (h[O * 3 + 1] = -99));
    let E = [{ x: 0, z: 0, y: t + 1.75, ph: 0, ring: !1 }];
    for (let O = 0; O < 8; O++) {
      let U = (O / 8) * Math.PI * 2;
      E.push({ x: Math.cos(U) * 2.6, z: Math.sin(U) * 2.6, y: t + 0.05, ph: O * 0.78, ring: !0 });
    }
    let g = 0,
      y = 0,
      x = 900,
      b = 1,
      w = l,
      v = 1,
      _ = 0.16,
      S = (O) => (O < 1.5 ? t + 0.33 : t),
      M = 9.8,
      T = (O, U) => {
        for (y += U * x * v; y > 1;) {
          y -= 1;
          let W = E[Math.floor(Math.random() * E.length)],
            Q =
              (W.ring
                ? 0.9 + 0.7 * Math.max(0, Math.sin(O * 1.1 + W.ph)) + 0.15 * Math.sin(O * 3.1 + W.ph)
                : 2.4 + 1.6 * Math.sin(O * 0.7) * Math.sin(O * 0.23 + 1) + 0.5 * Math.sin(O * 2.2)) *
              (W.hm ?? 1) *
              b,
            Z = g++ % w,
            fe = Math.sqrt(2 * M * Math.max(0.3, Q)) * (0.92 + Math.random() * 0.1),
            _e = W.sp ?? (W.ring ? 0.35 : 0.5),
            ge = W.inw ?? 0.12,
            Pe = W.ring ? -W.x * ge : 0,
            de = W.ring ? -W.z * ge : 0;
          ((f[Z * 3] = Pe + (Math.random() - 0.5) * _e),
            (f[Z * 3 + 1] = fe),
            (f[Z * 3 + 2] = de + (Math.random() - 0.5) * _e),
            (h[Z * 3] = W.x),
            (h[Z * 3 + 1] = W.y),
            (h[Z * 3 + 2] = W.z),
            (d[Z] = 0));
        }
        for (let W = 0; W < w; W++) {
          if (d[W] < 0) continue;
          ((d[W] += U),
            (f[W * 3 + 1] -= M * U),
            (h[W * 3] += f[W * 3] * U),
            (h[W * 3 + 1] += f[W * 3 + 1] * U),
            (h[W * 3 + 2] += f[W * 3 + 2] * U));
          let Q = S(Math.hypot(h[W * 3], h[W * 3 + 2]));
          h[W * 3 + 1] < Q && f[W * 3 + 1] < 0 && ((d[W] = -1), (h[W * 3 + 1] = -99));
        }
        u.getAttribute("position").needsUpdate = !0;
      },
      A = (O, U, W = 0, Q) => {
        for (let Z of [o, r, a, c]) Z.visible = !1;
        if (((O.position.y = W), n.add(O), (E.length = 0), !Q)) {
          E.push({ x: 0, z: 0, y: W + U * 0.94, ph: 0, ring: !1 });
          for (let Z = 0; Z < 6; Z++) {
            let fe = (Z / 6) * Math.PI * 2;
            E.push({ x: Math.cos(fe) * 1.05, z: Math.sin(fe) * 1.05, y: W + U * 0.42, ph: Z, ring: !0 });
          }
          S = (Z) => (Z < 2.9 ? W + 0.55 : t);
          return;
        }
        ((x = 2800), (b = 1), (_ = 0.17), (m.material.size = _ * (1 + (1 - v) * 0.25)));
        for (let Z = 0; Z < 6; Z++) E.push({ x: 0, z: 0, y: W + U * 0.98, ph: 0, ring: !1, hm: 2.2, sp: 0.6 });
        for (let Z = 0; Z < 8; Z++) {
          let fe = (Z / 8) * Math.PI * 2 + 0.2;
          E.push({
            x: Math.cos(fe) * Q.midR,
            z: Math.sin(fe) * Q.midR,
            y: W + Q.midY,
            ph: Z * 0.8,
            ring: !0,
            hm: 1.9,
            inw: -0.05,
            sp: 0.25,
          });
        }
        for (let Z = 0; Z < 12; Z++) {
          let fe = (Z / 12) * Math.PI * 2;
          E.push({
            x: Math.cos(fe) * Q.rimR,
            z: Math.sin(fe) * Q.rimR,
            y: W + Q.rimY,
            ph: Z * 0.52,
            ring: !0,
            hm: 1.45,
            inw: 0.4,
            sp: 0.18,
          });
        }
        ((S = (Z) => (Z < Q.poolR ? W + Q.poolY : t)), (I = Q.rimR * 1.15), (k = U * 1.1), q());
      },
      F = 140,
      C = new Float32Array(F * 3),
      P = new Float32Array(F),
      I = 3.2,
      k = 2.6,
      D = new qe();
    D.setAttribute("position", new Je(C, 3));
    let L = new bs(D, new ls({ size: 1.3, map: p, transparent: !0, depthWrite: !1, opacity: 0, color: 15924223 }));
    ((L.frustumCulled = !1), (L.visible = !1), n.add(L));
    let q = () => {
      for (let O = 0; O < F; O++) {
        let U = Math.random() * Math.PI * 2,
          W = Math.sqrt(Math.random()) * I;
        ((C[O * 3] = Math.cos(U) * W),
          (C[O * 3 + 1] = t + 0.2 + Math.random() * k),
          (C[O * 3 + 2] = Math.sin(U) * W),
          (P[O] = Math.random() * 6.28));
      }
    };
    return (
      q(),
      {
        group: n,
        update: T,
        useModel: A,
        setBudget: (O) => {
          if (((O = Math.max(0.1, Math.min(1, O))), O !== v)) {
            ((v = O), (w = Math.max(200, Math.floor(l * O))));
            for (let U = w; U < l; U++) ((d[U] = -1), (h[U * 3 + 1] = -99));
            ((g = 0), u.setDrawRange(0, w), (m.material.size = _ * (1 + (1 - O) * 0.25)));
          }
        },
        reset: () => {
          for (let O = 0; O < l; O++) ((d[O] = -1), (h[O * 3 + 1] = -99));
          ((y = 0), (u.getAttribute("position").needsUpdate = !0));
        },
        setMist: (O, U) => {
          let W = L.material;
          if (
            ((W.opacity += (0.16 * O - W.opacity) * Math.min(1, U * 2)), (L.visible = W.opacity > 0.005), !!L.visible)
          ) {
            for (let Q = 0; Q < F; Q++)
              ((P[Q] += U),
                (C[Q * 3 + 1] += U * 0.25),
                (C[Q * 3] += Math.sin(P[Q]) * U * 0.15),
                C[Q * 3 + 1] > t + 0.2 + k && (C[Q * 3 + 1] = t + 0.25));
            D.getAttribute("position").needsUpdate = !0;
          }
        },
      }
    );
  }
  function pM(i) {
    let e = i.sampleRate * 4,
      t = i.createBuffer(1, e, i.sampleRate),
      n = t.getChannelData(0),
      s = 0;
    for (let h = 0; h < e; h++) {
      let f = Math.random() * 2 - 1;
      ((s = (s + 0.02 * f) / 1.02), (n[h] = s * 3.5));
    }
    let o = i.createBufferSource();
    ((o.buffer = t), (o.loop = !0));
    let r = i.createBiquadFilter();
    ((r.type = "lowpass"), (r.frequency.value = 700));
    let a = i.createGain();
    a.gain.value = 0;
    let c = i.createGain();
    ((c.gain.value = 0), o.connect(r), r.connect(a), a.connect(c), c.connect(i.destination), o.start());
    let l = 0;
    return (h, f) => {
      l += h;
      let d = 0.35 + 0.65 * Math.pow(Math.max(0, Math.sin(l * 0.55)), 2.2);
      (a.gain.setTargetAtTime(d, i.currentTime, 0.25),
        r.frequency.setTargetAtTime(500 + d * 900, i.currentTime, 0.3),
        c.gain.setTargetAtTime(f * 0.5, i.currentTime, 0.4));
    };
  }
  var Sp = (i) => {
    let e = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    return e - Math.floor(e);
  };
  function Ap(i) {
    return (
      Rt -
      7 -
      2 * Math.sin(i * 0.07) -
      1.2 * Math.sin(i * 0.19 + 1.7) -
      0.7 * Math.sin(i * 0.53 + 0.4) -
      0.35 * Math.sin(i * 1.3)
    );
  }
  var J7 = Array.from({ length: 30 }, (i, e) => ({
    x: -150 + e * 10.3 + (Sp(e) - 0.5) * 6,
    z: Rt - 3.6 - Sp(e + 50) * 2.6,
    r: 1.8 + Sp(e + 9) * 2,
    h: 0.28 + Sp(e + 3) * 0.32,
  }));
  function zo(i, e) {
    if (e < Rt - 13 || e > Rt - 0.8) return 0;
    let t = Math.max(0, Math.min(1, (e - Ap(i)) / 1.2)) * Math.max(0, Math.min(1, (Rt - 1.3 - e) / 1.6));
    if (t <= 0) return 0;
    let n = 0;
    for (let s of J7) {
      let o = i - s.x;
      if (Math.abs(o) > s.r * 4) continue;
      let r = (o * o) / (s.r * s.r * 2.4) + ((e - s.z) * (e - s.z)) / (s.r * s.r * 0.7);
      r < 5 && (n += s.h * Math.exp(-r));
    }
    return n * t;
  }
  function mM(i, e) {
    let n = Rt - 12,
      s = Rt - 1,
      o = new Te(320, s - n, 320, 44);
    o.rotateX(-Math.PI / 2);
    let r = o.getAttribute("position"),
      a = [],
      c = new ae(15785130),
      l = new ae(16246980),
      h = new ae(14861450);
    for (let u = 0; u < r.count; u++) {
      let p = r.getX(u),
        m = r.getZ(u) + (n + s) / 2,
        E = Ap(p),
        g = m >= E,
        y = Rt - 1.7 + 0.55 * Math.sin(p * 0.13) + 0.35 * Math.sin(p * 0.37 + 1) + 0.15 * Math.sin(p * 1.1);
      (r.setZ(u, g ? m : E), r.setY(u, m > y ? -0.12 : g ? 0.03 + zo(p, m) * Math.min(1, (y - m) / 0.8) : 0.03));
      let x = zo(p, m) / 0.4,
        b = c.clone().lerp(l, Math.min(1, x)),
        w = Math.max(0, Math.min(1, (m - (y - 3.2)) / 3.2)),
        v = b.lerp(lM(p, m, new ae(15785130), new ae(13217402), new ae(9414794)), w * w * (3 - 2 * w));
      a.push(v.r, v.g, v.b);
    }
    (o.setAttribute("color", new Fe(a, 3)), o.computeVertexNormals());
    let f = new bt({ vertexColors: !0, map: e ?? null });
    e && ((e.wrapS = e.wrapT = gn), e.repeat.set(320 / 6, (s - n) / 6));
    let d = new R(o, f);
    return ((d.receiveShadow = !0), i.add(d), d);
  }
  var gM = (i) => 5.6 + 0.9 * Math.sin(3 * i + 0.6) + 0.5 * Math.sin(5 * i + 2.1) + 0.3 * Math.sin(9 * i);
  function Hp(i, e) {
    let t = Math.hypot(i, e);
    if (t > 7.5) return 0;
    let n = gM(Math.atan2(e, i)),
      s = 1 - (t / n) * (t / n);
    return s <= 0 ? 0 : 0.95 * s * s + 0.05 * Math.sin(i * 1.7) * Math.sin(e * 1.3) * s;
  }
  function EM(i, e, t) {
    let n = new Te(15, 15, 90, 90);
    n.rotateX(-Math.PI / 2);
    let s = n.getAttribute("position"),
      o = [],
      r = new ae(15323032),
      a = new ae(16313544);
    for (let h = 0; h < s.count; h++) {
      let f = s.getX(h),
        d = s.getZ(h),
        u = Hp(f, d);
      s.setY(h, u > 0 ? 0.06 + u : -0.08);
      let p = r.clone().lerp(a, Math.min(1, u / 0.9));
      o.push(p.r, p.g, p.b);
    }
    (n.setAttribute("color", new Fe(o, 3)), n.computeVertexNormals());
    let c = new R(n, new bt({ vertexColors: !0 }));
    (c.position.set(e, 0, t), (c.receiveShadow = !0), i.add(c));
    let l = new bt({ color: 9416282 });
    for (let h = 0; h < 9; h++) {
      let f = h * 0.7 + 0.3,
        d = gM(f) * 0.82,
        u = new R(new yt(0.18, 0.55, 5), l);
      (u.position.set(e + Math.cos(f) * d, 0.25 + Hp(Math.cos(f) * d, Math.sin(f) * d), t + Math.sin(f) * d),
        (u.rotation.z = ((h % 3) - 1) * 0.25),
        i.add(u));
    }
    return c;
  }
  var Ih = new H();
  function Gs(i, e, t, n, s, o) {
    let r = (2 * Math.PI * s) / 4,
      a = Math.max(o - 2 * s, 0),
      c = Math.PI / 4;
    (Ih.copy(e), (Ih[n] = 0), Ih.normalize());
    let l = (0.5 * r) / (r + a),
      h = 1 - Ih.angleTo(i) / c;
    return Math.sign(Ih[t]) === 1 ? h * l : a / (r + a) + l + l * (1 - h);
  }
  var Dc = class extends ee {
    constructor(e = 1, t = 1, n = 1, s = 2, o = 0.1) {
      if (((s = s * 2 + 1), (o = Math.min(e / 2, t / 2, n / 2, o)), super(1, 1, 1, s, s, s), s === 1)) return;
      let r = this.toNonIndexed();
      ((this.index = null),
        (this.attributes.position = r.attributes.position),
        (this.attributes.normal = r.attributes.normal),
        (this.attributes.uv = r.attributes.uv));
      let a = new H(),
        c = new H(),
        l = new H(e, t, n).divideScalar(2).subScalar(o),
        h = this.attributes.position.array,
        f = this.attributes.normal.array,
        d = this.attributes.uv.array,
        u = h.length / 6,
        p = new H(),
        m = 0.5 / s;
      for (let E = 0, g = 0; E < h.length; E += 3, g += 2)
        switch (
          (a.fromArray(h, E),
          c.copy(a),
          (c.x -= Math.sign(c.x) * m),
          (c.y -= Math.sign(c.y) * m),
          (c.z -= Math.sign(c.z) * m),
          c.normalize(),
          (h[E + 0] = l.x * Math.sign(a.x) + c.x * o),
          (h[E + 1] = l.y * Math.sign(a.y) + c.y * o),
          (h[E + 2] = l.z * Math.sign(a.z) + c.z * o),
          (f[E + 0] = c.x),
          (f[E + 1] = c.y),
          (f[E + 2] = c.z),
          Math.floor(E / u))
        ) {
          case 0:
            (p.set(1, 0, 0), (d[g + 0] = Gs(p, c, "z", "y", o, n)), (d[g + 1] = 1 - Gs(p, c, "y", "z", o, t)));
            break;
          case 1:
            (p.set(-1, 0, 0), (d[g + 0] = 1 - Gs(p, c, "z", "y", o, n)), (d[g + 1] = 1 - Gs(p, c, "y", "z", o, t)));
            break;
          case 2:
            (p.set(0, 1, 0), (d[g + 0] = 1 - Gs(p, c, "x", "z", o, e)), (d[g + 1] = Gs(p, c, "z", "x", o, n)));
            break;
          case 3:
            (p.set(0, -1, 0), (d[g + 0] = 1 - Gs(p, c, "x", "z", o, e)), (d[g + 1] = 1 - Gs(p, c, "z", "x", o, n)));
            break;
          case 4:
            (p.set(0, 0, 1), (d[g + 0] = 1 - Gs(p, c, "x", "y", o, e)), (d[g + 1] = 1 - Gs(p, c, "y", "x", o, t)));
            break;
          case 5:
            (p.set(0, 0, -1), (d[g + 0] = Gs(p, c, "x", "y", o, e)), (d[g + 1] = 1 - Gs(p, c, "y", "x", o, t)));
            break;
        }
    }
  };
  var Ae = (i, e = 0.8, t = {}) => new X({ color: i, roughness: e, ...t }),
    Lo = (i) =>
      i.traverse((e) => {
        e.isMesh && ((e.castShadow = !0), (e.receiveShadow = !0));
      });
  function u3(i, e, t = 9067051) {
    let n = new J(),
      s = new R(new re(e + 0.03, e + 0.03, 0.05, 32), Ae(t, 0.6));
    ((s.rotation.x = Math.PI / 2), n.add(s));
    for (let o of [1, -1]) {
      let r = new R(new gt(e, 32), new be({ map: i, transparent: !0 }));
      ((r.position.z = o * 0.026), o < 0 && (r.rotation.y = Math.PI), n.add(r));
    }
    return n;
  }
  var bM = (i) => () => ((i = (i * 16807) % 2147483647), (i - 1) / 2147483646);
  var ccsCntTex = {};
  function ccsCntTag(i) {
    let e = Math.min(i, 99),
      t = ccsCntTex[e] ?? (ccsCntTex[e] = ei(`×${e}`, 16765503, 6045472, 128, 64));
    return new R(new Te(0.24, 0.12), new be({ map: t }));
  }
  function Q7(lbl = "🧸 ตู้ตุ๊กตาของข้าวต้ม", lit = !0) {
    let i = new J(),
      e = 2.6,
      t = 2.5,
      n = 0.62,
      s = new X({ map: Cn(12618322, "#8a5a2b"), roughness: 0.6 }),
      o = Ae(16774885, 0.5),
      // v105: ตู้ใบเสริมไม่เพิ่มไฟจริง (กันเชดเดอร์คอมไพล์ใหม่ทั้งเกม) ใช้ผนังหลังเรืองแสงอ่อนแทน
      r = lit ? Ae(16770026, 0.9) : Ae(16770026, 0.9, { emissive: new ae(16767392), emissiveIntensity: 0.25 }),
      a = (m, E, g, y, x, b, w) => {
        let v = new R(new ee(m, E, g), y);
        return (v.position.set(x, b, w), i.add(v), v);
      };
    (a(e, 0.18, n + 0.06, s, 0, 0.09, 0),
      a(e + 0.16, 0.14, n + 0.14, o, 0, t + 0.07, 0),
      a(e - 0.1, 0.22, 0.06, s, 0, t + 0.25, -n / 2 + 0.05),
      a(0.1, t, n, s, -e / 2 + 0.05, t / 2, 0),
      a(0.1, t, n, s, e / 2 - 0.05, t / 2, 0),
      a(e, t, 0.04, r, 0, t / 2, -n / 2 + 0.02));
    let c = [0.2, 0.95, 1.7];
    for (let m of [...c, t - 0.04]) a(e - 0.1, 0.06, n - 0.04, s, 0, m, 0);
    let l = new be({ color: 16773568 });
    for (let m of [0.92, 1.67, t - 0.1]) a(e - 0.3, 0.025, 0.04, l, 0, m, n / 2 - 0.08);
    if (lit) {
      let h = new En(16767392, 2.2, 3.2, 1.6);
      (h.position.set(0, 1.6, 0.2), i.add(h)); // v104: ไฟอยู่หลังกระจก กันแสงสะท้อนจ้ากลางตู้
    }
    let f = new X({ color: 14677247, roughness: 0.05, metalness: 0.1, transparent: !0, opacity: 0.18, depthWrite: !1 });
    for (let m of [-1, 1]) {
      let E = new J();
      E.position.set((m * e) / 4, t / 2 + 0.05, n / 2 + 0.01);
      let g = new R(new Te(e / 2 - 0.12, t - 0.3), f);
      E.add(g);
      for (let [x, b, w, v] of [
        [e / 2 - 0.05, 0.05, 0, (t - 0.3) / 2],
        [e / 2 - 0.05, 0.05, 0, -(t - 0.3) / 2],
        [0.05, t - 0.3, -(e / 4 - 0.03), 0],
        [0.05, t - 0.3, e / 4 - 0.03, 0],
      ]) {
        let _ = new R(new ee(x, b, 0.04), o);
        (_.position.set(w, v, 0), E.add(_));
      }
      let y = new R(new we(0.035, 8, 6), Ae(16765503, 0.2, { metalness: 0.8 }));
      (y.position.set(-m * (e / 4 - 0.12), 0, 0.04), E.add(y), i.add(E));
    }
    let d = new R(
      new Te(e - 0.3, 0.2),
      new be({
        map: ei(
          lbl,
          16774885,
          11875210,
          512,
          64,
        ),
      }),
    );
    (d.position.set(0, t + 0.25, -n / 2 + 0.085), i.add(d), Lo(i));
    let u = new J();
    return (
      i.add(u),
      {
        group: i,
        // v105: รับรายการ [ชื่อ, จำนวน] วางแบบละ 1 ตัว ตัวซ้ำมีป้าย ×N ที่ขอบชั้น
        fill: (m) => {
          (u.clear(),
            m.slice(0, 15).forEach((E, g) => {
              let [N, C] = Array.isArray(E) ? E : [E, 1],
                y = je(N, 0.44),
                x = Math.floor(g / 5),
                b = g % 5,
                P = -e / 2 + 0.33 + b * ((e - 0.66) / 4);
              if ((y.position.set(P, c[x] + 0.03, 0.02), (y.rotation.y = (b - 2) * -0.08), u.add(y), C > 1)) {
                let I = ccsCntTag(C);
                (I.position.set(P + 0.13, c[x] + 0.1, n / 2 - 0.04), u.add(I));
              }
            }));
        },
        trim: o,
        size: { w: e, d: n },
      }
    );
  }
  function ta(i, e, t, n = 10) {
    let s = [];
    for (let o = 1; o <= n; o++) {
      let r = o / n;
      s.push(new H(i.x + (e.x - i.x) * r, i.y + (e.y - i.y) * r + Math.sin(r * Math.PI) * t, i.z + (e.z - i.z) * r));
    }
    return s;
  }
  function xM(i, e, t, n, s) {
    let o = new J();
    i.add(o);
    let r = [],
      a = new R(
        new Te(n - e, s - t),
        new X({
          map: (() => {
            let M = document.createElement("canvas");
            M.width = M.height = 256;
            let T = M.getContext("2d");
            for (let F = 0; F < 8; F++) ((T.fillStyle = F % 2 ? "#79c255" : "#6cb84a"), T.fillRect(F * 32, 0, 32, 256));
            ((T.strokeStyle = "rgba(255,255,255,.7)"), (T.lineWidth = 4), T.strokeRect(6, 6, 244, 244));
            let A = new ut(M);
            return ((A.colorSpace = Ye), A);
          })(),
          roughness: 0.95,
        }),
      );
    ((a.rotation.x = -Math.PI / 2), a.position.set((e + n) / 2, 0.035, (t + s) / 2), (a.receiveShadow = !0), o.add(a));
    let c = Ae(16777215, 0.6),
      l = Ae(4163272, 0.5),
      h = (M, T, A, F) => {
        let C = Math.hypot(A - M, F - T),
          P = Math.ceil(C / 1.6);
        for (let I = 0; I <= P; I++) {
          let k = new R(new re(0.06, 0.06, 0.6, 6), l);
          (k.position.set(M + ((A - M) * I) / P, 0.3, T + ((F - T) * I) / P), o.add(k));
        }
        for (let I of [0.25, 0.5]) {
          let k = new R(new ee(C, 0.07, 0.05), c);
          (k.position.set((M + A) / 2, I, (T + F) / 2), (k.rotation.y = -Math.atan2(F - T, A - M)), o.add(k));
        }
        r.push({
          x: (M + A) / 2,
          z: (T + F) / 2,
          hw: Math.abs(A - M) / 2 + 0.1,
          hd: Math.abs(F - T) / 2 + 0.1,
          low: !0,
        });
      },
      f = (e + n) / 2;
    (h(e, t, f - 1.6, t), h(f + 1.6, t, n, t), h(e, s, n, s), h(e, t, e, s), h(n, t, n, s));
    let d = Ae(16748472, 0.5);
    for (let M of [-1, 1]) {
      let T = new R(new re(0.12, 0.12, 2.6, 8), d);
      (T.position.set(f + M * 1.6, 1.3, t), o.add(T));
    }
    let u = new R(new vt(1.6, 0.12, 8, 24, Math.PI), d);
    (u.position.set(f, 2.6, t), o.add(u));
    let p = new R(
      new Te(3.2, 0.55),
      new be({
        map: ei(
          "🏅 สนามฝึกน้องหมา",
          16774885,
          3046706,
          512,
          88,
        ),
        side: Ke,
      }),
    );
    (p.position.set(f, 3.35, t - 0.04), (p.rotation.y = Math.PI), (p.material.side = ji), o.add(p));
    {
      let M = p.clone();
      ((M.rotation.y = 0), (M.position.z = t + 0.04), o.add(M));
    }
    let m = [],
      E = [],
      g = Ae(14829119, 0.5),
      y = Ae(16777215, 0.5),
      x = Ae(16765503, 0.5),
      b = Ae(4163272, 0.5),
      w = (M, T, A) => new H(M, T, A);
    {
      let M = t + 3,
        T = [e + 4, e + 7, e + 10];
      for (let C of T) {
        for (let k of [-1, 1]) {
          let D = new R(new ee(0.1, 0.8, 0.1), y);
          (D.position.set(C, 0.4, M + k * 0.8), o.add(D));
        }
        let P = new R(new re(0.04, 0.04, 1.6, 8), g);
        ((P.rotation.x = Math.PI / 2), P.position.set(C, 0.48, M), o.add(P));
        let I = new R(new re(0.04, 0.04, 1.6, 8), y);
        ((I.rotation.x = Math.PI / 2),
          I.position.set(C, 0.22, M),
          o.add(I),
          r.push({ x: C, z: M, hw: 0.12, hd: 0.85, low: !0 }));
      }
      let A = [w(e + 1.8, 0, M)],
        F = w(e + 1.8, 0, M);
      for (let C of T) {
        let P = w(C - 1.1, 0, M);
        (A.push(P), A.push(...ta(P, w(C + 1.1, 0, M), 1.05, 12)), (F = w(C + 1.1, 0, M)));
      }
      (A.push(w(F.x + 1.5, 0, M)),
        m.push({
          id: "hurdle",
          name: "กระโดดข้ามรั้ว",
          icon: "🚧",
          start: w(e + 1.8, 0, M),
          path: A,
          xp: 25,
          stamina: 8,
        }));
    }
    {
      let M = n - 4,
        T = t + 3,
        A = new J();
      A.position.set(M, 0, T);
      for (let D of [-1, 1]) {
        let L = new R(new ee(0.14, 2.6, 0.14), b);
        (L.position.set(0, 1.3, D * 1.25), A.add(L));
      }
      let F = new R(new ee(0.14, 0.14, 2.64), b);
      ((F.position.y = 2.6), A.add(F));
      let C = new R(new vt(0.78, 0.17, 12, 32), Ae(2829099, 0.85));
      ((C.rotation.y = Math.PI / 2), (C.position.y = 1.25), A.add(C));
      let P = new R(new vt(0.78, 0.175, 6, 32, Math.PI / 2), x);
      ((P.rotation.y = Math.PI / 2), (P.position.y = 1.25), A.add(P));
      for (let D of [-1, 1]) {
        let L = new R(new re(0.02, 0.02, 0.95, 4), y);
        (L.position.set(0, 2.1, D * 0.72), (L.rotation.x = D * 0.75), A.add(L));
      }
      (o.add(A), r.push({ x: M, z: T - 1.25, hw: 0.14, hd: 0.14 }, { x: M, z: T + 1.25, hw: 0.14, hd: 0.14 }));
      let I = w(M - 2.4, 0, T),
        k = w(M + 2.4, 0, T);
      m.push({
        id: "tire",
        name: "ลอดห่วงยาง",
        icon: "⭕",
        start: w(M - 3.6, 0, T),
        path: [w(M - 3.6, 0, T), I, ...ta(I, k, 0.85, 16), w(M + 3.4, 0, T)],
        xp: 30,
        stamina: 9,
      });
    }
    {
      let M = (t + s) / 2,
        T = [0, 1, 2, 3, 4, 5].map((F) => e + 3 + F * 0.95);
      for (let [F, C] of T.entries()) {
        let P = new R(new re(0.035, 0.035, 1.1, 8), F % 2 ? x : b);
        (P.position.set(C, 0.55, M), o.add(P));
        let I = new R(new re(0.12, 0.12, 0.05, 10), y);
        (I.position.set(C, 0.03, M), o.add(I));
      }
      let A = [w(e + 1.4, 0, M)];
      for (let [F, C] of T.entries()) {
        let P = F % 2 ? 1 : -1;
        A.push(w(C - 0.45, 0, M + P * 0.25), w(C, 0, M + P * 0.55), w(C + 0.45, 0, M + P * 0.25));
      }
      (A.push(w(T[5] + 1.6, 0, M)),
        m.push({
          id: "weave",
          name: "วิ่งสลาลอม",
          icon: "🎏",
          start: w(e + 1.4, 0, M),
          path: A,
          xp: 30,
          stamina: 8,
        }));
    }
    {
      let M = (t + s) / 2 + 0.2,
        T = n - 7.5,
        A = n - 3,
        F = (() => {
          let P = document.createElement("canvas");
          ((P.width = 256), (P.height = 32));
          let I = P.getContext("2d"),
            k = ["#e2463f", "#ffd23f", "#3f86c8", "#6cc24a"];
          for (let L = 0; L < 8; L++) ((I.fillStyle = k[L % 4]), I.fillRect(L * 32, 0, 32, 32));
          let D = new ut(P);
          return ((D.colorSpace = Ye), (D.wrapS = gn), D);
        })(),
        C = new R(new re(1, 1, A - T, 28, 1, !0), new X({ map: F, side: Ke, roughness: 0.7 }));
      ((C.rotation.z = Math.PI / 2), C.position.set((T + A) / 2, 0.85, M), o.add(C));
      for (let P of [T, A]) {
        let I = new R(new vt(1, 0.08, 6, 28), y);
        ((I.rotation.y = Math.PI / 2), I.position.set(P, 0.85, M), o.add(I));
      }
      (r.push(
        { x: (T + A) / 2, z: M - 1, hw: (A - T) / 2, hd: 0.06 },
        { x: (T + A) / 2, z: M + 1, hw: (A - T) / 2, hd: 0.06 },
      ),
        m.push({
          id: "tunnel",
          name: "มุดอุโมงค์",
          icon: "🌀",
          start: w(T - 1.4, 0, M),
          path: [w(T - 1.4, 0, M), w(T, 0, M), w(A, 0, M), w(A + 1.4, 0, M)],
          xp: 20,
          stamina: 6,
        }));
    }
    {
      let M = s - 3,
        T = e + 5.5,
        A = 1.5,
        F = 2.2,
        C = new X({ map: Cn(15902298, "#c26d2a"), roughness: 0.7 });
      for (let k of [-1, 1]) {
        let D = Math.hypot(F, A),
          L = new R(new ee(D, 0.1, 1.8), C);
        (L.position.set(T + (k * F) / 2, A / 2, M), (L.rotation.z = -k * Math.atan2(A, F)), o.add(L));
        let q = new R(new ee(D * 0.3, 0.105, 1.81), x);
        (q.position.set(T + k * (F - D * 0.15 * Math.cos(Math.atan2(A, F))), D * 0.15 * Math.sin(Math.atan2(A, F)), M),
          (q.rotation.z = L.rotation.z),
          o.add(q));
      }
      E.push((k, D) => (Math.abs(D - M) < 0.95 && Math.abs(k - T) < F ? A * (1 - Math.abs(k - T) / F) + 0.05 : 0));
      let P = w(T - F - 0.9, 0, M),
        I = [P, w(T - F, 0, M), w(T, A + 0.05, M), w(T + F, 0, M), w(T + F + 1, 0, M)];
      m.push({
        id: "aframe",
        name: "ปีนเนิน A-frame",
        icon: "⛰️",
        start: P,
        path: I,
        xp: 35,
        stamina: 10,
      });
    }
    {
      let M = s - 3,
        T = n - 9.5,
        A = n - 2,
        F = 0.85,
        C = new X({ map: Cn(10211568, "#3f86c8"), roughness: 0.7 }),
        P = 1.6,
        I = new R(new ee(Math.hypot(P, F), 0.09, 0.85), C);
      (I.position.set(T + P / 2, F / 2, M), (I.rotation.z = Math.atan2(F, P)), o.add(I));
      let k = new R(new ee(A - T - 2 * P, 0.1, 0.85), C);
      (k.position.set((T + A) / 2, F, M), o.add(k));
      let D = new R(new ee(Math.hypot(P, F), 0.09, 0.85), C);
      (D.position.set(A - P / 2, F / 2, M), (D.rotation.z = -Math.atan2(F, P)), o.add(D));
      for (let q of [T + P + 0.2, (T + A) / 2, A - P - 0.2])
        for (let $ of [-1, 1]) {
          let te = new R(new ee(0.06, F, 0.06), y);
          (te.position.set(q, F / 2, M + $ * 0.36), o.add(te));
        }
      E.push((q, $) =>
        Math.abs($ - M) > 0.45 || q < T || q > A
          ? 0
          : q < T + P
            ? ((q - T) / P) * F + 0.04
            : q > A - P
              ? ((A - q) / P) * F + 0.04
              : F + 0.04,
      );
      let L = [w(T - 1, 0, M), w(T, 0, M), w(T + P, F + 0.04, M), w(A - P, F + 0.04, M), w(A, 0, M), w(A + 1, 0, M)];
      m.push({
        id: "beam",
        name: "เดินสะพานทรงตัว",
        icon: "🪵",
        start: L[0],
        path: L,
        xp: 35,
        stamina: 10,
      });
    }
    let v = [];
    {
      let M = t + 6.4,
        T = e + 6,
        A = 3.8,
        F = 0.38,
        C = new R(new re(0.22, 0.22, 0.6, 3), g);
      ((C.rotation.x = Math.PI / 2), C.position.set(T, F / 2, M), o.add(C));
      let P = new J();
      (P.position.set(T, F, M), o.add(P));
      let I = new R(new ee(A, 0.08, 0.7), new X({ map: Cn(16765503, "#c99a00"), roughness: 0.7 }));
      P.add(I);
      for (let q of [-1, 1]) {
        let $ = new R(new ee(0.5, 0.085, 0.71), b);
        (($.position.x = q * (A / 2 - 0.25)), P.add($));
      }
      let k = Math.atan2(F - 0.02, A / 2),
        D = -k;
      ((P.rotation.z = -D),
        v.push((q) => {
          let te =
            Math.abs(q.z - M) < 0.5 && Math.abs(q.x - T) < A / 2 ? (q.x > T + 0.1 ? k : q.x < T - 0.1 ? -k : D) : D;
          ((D += (te - D) * 0.12), (P.rotation.z = -D));
        }),
        E.push((q, $) =>
          Math.abs($ - M) < 0.42 && Math.abs(q - T) < A / 2 ? Math.max(0, F - (q - T) * Math.tan(D)) + 0.05 : 0,
        ),
        r.push({ x: T, z: M, hw: 0.2, hd: 0.3, low: !0 }));
      let L = [
        w(T - A / 2 - 0.8, 0, M),
        w(T - A / 2 + 0.1, 0.05, M),
        w(T - 0.2, F + 0.05, M),
        w(T + 0.2, F + 0.05, M),
        w(T + A / 2 - 0.1, 0.05, M),
        w(T + A / 2 + 0.8, 0, M),
      ];
      m.push({
        id: "seesaw",
        name: "เดินกระดานหก",
        icon: "⚖️",
        start: L[0],
        path: L,
        xp: 40,
        stamina: 10,
      });
    }
    {
      let M = t + 6.4,
        T = e + 12.5;
      for (let C = 0; C < 4; C++) {
        let P = new R(new ee(0.42, 0.12, 1.3), C % 2 ? y : g);
        (P.position.set(T + C * 0.6, 0.08, M), (P.rotation.z = 0.25), o.add(P));
      }
      for (let C of [-0.45, 2.25])
        for (let P of [-1, 1]) {
          let I = new R(new yt(0.12, 0.35, 10), Ae(16747034, 0.5));
          (I.position.set(T + C, 0.18, M + P * 0.75), o.add(I));
        }
      r.push({ x: T + 0.9, z: M, hw: 1, hd: 0.65, low: !0 });
      let A = w(T - 1, 0, M),
        F = w(T + 2.8, 0, M);
      m.push({
        id: "broad",
        name: "กระโดดไกล",
        icon: "🦘",
        start: w(T - 3.2, 0, M),
        path: [w(T - 3.2, 0, M), A, ...ta(A, F, 0.8, 16), w(T + 4, 0, M)],
        xp: 35,
        stamina: 9,
      });
    }
    {
      let M = t + 6.4,
        T = [n - 7.5, n - 5.7, n - 3.9],
        A = [Ae(16740241, 0.4), Ae(6080757, 0.4), Ae(10215773, 0.4)];
      T.forEach((C, P) => {
        let I = new R(new vt(0.5, 0.05, 8, 28), A[P]);
        ((I.rotation.y = Math.PI / 2), I.position.set(C, 0.75, M), o.add(I));
        for (let k of [-1, 1]) {
          let D = new R(new re(0.04, 0.04, 1.3, 6), y);
          (D.position.set(C, 0.65, M + k * 0.55),
            o.add(D),
            r.push({ x: C, z: M + k * 0.55, hw: 0.06, hd: 0.06, low: !0 }));
        }
      });
      let F = [w(T[0] - 1.8, 0, M)];
      for (let C of T) {
        let P = w(C - 0.7, 0, M);
        F.push(P, ...ta(P, w(C + 0.7, 0, M), 0.55, 8));
      }
      (F.push(w(T[2] + 1.6, 0, M)),
        m.push({
          id: "hoops",
          name: "ลอดห่วงสามวง",
          icon: "🎯",
          start: F[0],
          path: F,
          xp: 35,
          stamina: 9,
        }));
    }
    {
      let M = (t + s) / 2,
        T = e + 13.5,
        A = 0.55,
        F = new R(new ee(1.3, 0.1, 1.3), Ae(4163272, 0.5));
      (F.position.set(T, A, M), o.add(F));
      for (let [k, D] of [
        [-0.55, -0.55],
        [0.55, -0.55],
        [-0.55, 0.55],
        [0.55, 0.55],
      ]) {
        let L = new R(new ee(0.08, A, 0.08), y);
        (L.position.set(T + k, A / 2, M + D), o.add(L));
      }
      (E.push((k, D) => (Math.abs(k - T) < 0.62 && Math.abs(D - M) < 0.62 ? A + 0.06 : 0)),
        r.push({ x: T, z: M, hw: 0.65, hd: 0.65, low: !0 }));
      let C = w(T - 1.3, 0, M),
        P = w(T, A + 0.06, M),
        I = [];
      for (let k = 0; k <= 16; k++) {
        let D = (k / 16) * Math.PI * 2;
        I.push(w(T + Math.sin(D) * 0.12, A + 0.06, M + (1 - Math.cos(D)) * 0.06));
      }
      m.push({
        id: "table",
        name: "โต๊ะนั่งรอ",
        icon: "🪑",
        start: w(T - 2.6, 0, M),
        path: [w(T - 2.6, 0, M), C, ...ta(C, P, 0.45, 8), ...I, ...ta(P, w(T + 1.3, 0, M), 0.4, 8), w(T + 2.4, 0, M)],
        xp: 30,
        stamina: 7,
      });
    }
    {
      let M = s - 3,
        T = [e + 11, e + 12.4, e + 13.8],
        A = [0.3, 0.6, 0.9],
        F = [Ae(16748472, 0.5), Ae(16765503, 0.5), Ae(10215773, 0.5)];
      (T.forEach((k, D) => {
        let L = new R(new ee(1, A[D], 1), F[D]);
        (L.position.set(k, A[D] / 2, M),
          o.add(L),
          E.push((q, $) => (Math.abs(q - k) < 0.5 && Math.abs($ - M) < 0.5 ? A[D] + 0.04 : 0)));
      }),
        r.push({ x: T[1], z: M, hw: 2, hd: 0.5, low: !0 }));
      let C = [w(T[0] - 2, 0, M)],
        P = w(T[0] - 1.1, 0, M);
      (C.push(P),
        T.forEach((k, D) => {
          let L = w(k, A[D] + 0.04, M);
          (C.push(...ta(P, L, 0.4, 8)), (P = L));
        }));
      let I = w(T[2] + 1.6, 0, M);
      (C.push(...ta(P, I, 0.35, 10), w(I.x + 1, 0, M)),
        m.push({
          id: "steps",
          name: "กระโดดขึ้นบันได",
          icon: "🪜",
          start: C[0],
          path: C,
          xp: 40,
          stamina: 10,
        }));
    }
    for (let M of m) {
      let T = new R(new re(0.22, 0.22, 0.04, 16), Ae(16765503, 0.4, { emissive: new ae(5583616) }));
      (T.position.set(M.start.x, 0.05, M.start.z), o.add(T));
    }
    return (
      Lo(o),
      (a.castShadow = !1),
      {
        group: o,
        stations: m,
        solids: r,
        heightAt: (M, T) => {
          let A = 0;
          for (let F of E) A = Math.max(A, F(M, T));
          return A;
        },
        update: (M) => {
          for (let T of v) T(M);
        },
      }
    );
  }
  function yM(i, e, t) {
    if (e < 0 && i.length > 1) {
      let n = i[1].clone().sub(i[0]).setY(0).normalize();
      return { done: !1, dir: Math.atan2(n.x, n.z), p: t.copy(i[0]).addScaledVector(n, e) };
    }
    for (let n = 1; n < i.length; n++) {
      let s = i[n].distanceTo(i[n - 1]);
      if (e <= s)
        return {
          done: !1,
          dir: Math.atan2(i[n].x - i[n - 1].x, i[n].z - i[n - 1].z),
          p: t.lerpVectors(i[n - 1], i[n], s ? e / s : 1),
        };
      e -= s;
    }
    return (t.copy(i[i.length - 1]), { done: !0, dir: 0, p: t });
  }
  function p3(i) {
    let e = new J(),
      t = new J(),
      n = Ae(16774885, 0.5),
      s = new R(new ee(1.5, 0.36, 0.1), n);
    t.add(s);
    for (let c of [-0.8, 0.8])
      for (let l of [-0.13, 0.13]) {
        let h = new R(new re(0.15, 0.15, 0.1, 14), n);
        ((h.rotation.x = Math.PI / 2), h.position.set(c, l, 0), t.add(h));
      }
    let o = new R(new Te(1.4, 0.3), new be({ map: ei(i, 16774885, 9067051, 512, 110), transparent: !0 }));
    ((o.position.z = 0.056), t.add(o));
    let r = new R(new re(0.05, 0.05, 1.2, 6), Ae(9067051));
    ((r.position.y = -0.6), t.add(r), t.position.set(-2.6, 1.25, -0.3), e.add(t));
    {
      let c = u3(io("st_main", 16774885, 11875210), 0.36, 11875210);
      (c.position.set(-2.6, 1.98, -0.3), e.add(c));
      let l = new R(new re(0.05, 0.05, 0.5, 6), Ae(9067051));
      (l.position.set(-2.6, 1.55, -0.36), e.add(l));
    }
    for (let [c, l] of [
      [1.6, 14829119],
      [2.15, 4163272],
    ]) {
      let h = new R(new re(0.22, 0.17, 0.12, 18), Ae(l, 0.4));
      (h.position.set(c, 0.06, -0.4), e.add(h));
      let f = new R(new gt(0.18, 16), Ae(c < 2 ? 10115626 : 8377328, 0.4));
      ((f.rotation.x = -Math.PI / 2), f.position.set(c, 0.11, -0.4), e.add(f));
    }
    for (let [c, l] of [
      [-1.7, -0.5],
      [1, -0.6],
      [3.1, 0.2],
      [-3.4, 0.6],
    ]) {
      let h = new R(new re(0.22, 0.16, 0.34, 12), Ae(14251850, 0.8));
      (h.position.set(c, 0.17, l), e.add(h));
      for (let d = 0; d < 5; d++) {
        let u = new R(new we(0.08, 8, 6), Ae([16740241, 16765503, 16777215, 11570431][(d + Math.round(c)) & 3], 0.5));
        (u.position.set(c + Math.cos(d * 1.3) * 0.12, 0.42 + (d % 2) * 0.06, l + Math.sin(d * 1.3) * 0.12), e.add(u));
      }
      let f = new R(new we(0.17, 8, 6), Ae(6075454, 0.8));
      ((f.scale.y = 0.5), f.position.set(c, 0.36, l), e.add(f));
    }
    let a = new R(new gt(0.55, 24), Ae(16748472, 0.95));
    ((a.rotation.x = -Math.PI / 2), a.scale.set(1.5, 1, 1), a.position.set(0, 0.03, -0.55), e.add(a));
    for (let [c, l, h] of [
      [0, -0.5, 0.18],
      [-0.28, -0.82, 0.08],
      [-0.1, -0.9, 0.08],
      [0.1, -0.9, 0.08],
      [0.28, -0.82, 0.08],
    ]) {
      let f = new R(new gt(h, 14), Ae(16777215, 0.9));
      ((f.rotation.x = -Math.PI / 2), f.position.set(c, 0.035, l), e.add(f));
    }
    return (Lo(e), e);
  }
  function eH(i, e, t, n, s) {
    (s("b_sofa_big", 0.2, -5.35, 0),
      s("b_table", 0.2, -4.05, 0),
      s("b_sofa_small", -2.7, -4.5, 0.5),
      s("b_sofa_small", 3.1, -4.5, -0.5),
      s("b_pineapple", 0.55, -4.05, 0.3, 0.34, !1),
      s("b_magazine", -0.1, -4.05, 0.4, 0.345, !1),
      s("b_soda", 0.85, -4.1, 0, 0.345, !1),
      s("Plants_19", -7.3, 5.2, 0),
      s("Plants_15", 7.3, 5.2, 0),
      s("Plants_15", -7.3, -5.3, 0),
      s("Light_05", 7.3, -5.3, 0),
      s("Clock_03", 3.6, -5.95, 0, 3, !1),
      s("b_nessie", 6.1, 3.6, -0.8),
      s("b_coolbox", 2.1, -5.3, 0.1),
      s("b_towel2", -5.2, -1.2, 0.1, 0.012, !1)); // v106: เอานกนางนวลบนตู้โชว์ออก
    let o = new R(
      new Te(2.4, 1.2),
      new be({
        map: (() => {
          let d = document.createElement("canvas");
          ((d.width = 512), (d.height = 256));
          let u = d.getContext("2d"),
            p = u.createLinearGradient(0, 0, 0, 150);
          (p.addColorStop(0, "#9fd8f0"),
            p.addColorStop(1, "#fbe6c8"),
            (u.fillStyle = p),
            u.fillRect(0, 0, 512, 150),
            (u.fillStyle = "#ffd27a"),
            u.beginPath(),
            u.arc(380, 110, 34, 0, 7),
            u.fill());
          for (let E = 0; E < 6; E++) {
            ((u.fillStyle = ["#2d8fb8", "#3aa3c8", "#5bbad6", "#7fcde0", "#a7dfe9", "#e9d6ae"][E]),
              u.beginPath(),
              u.moveTo(0, 150 + E * 18));
            for (let g = 0; g <= 512; g += 16) u.lineTo(g, 150 + E * 18 + Math.sin(g * 0.03 + E) * 6);
            (u.lineTo(512, 256), u.lineTo(0, 256), u.fill());
          }
          ((u.strokeStyle = "#ffffff"), (u.lineWidth = 3));
          for (let E = 0; E < 5; E++) {
            u.beginPath();
            for (let g = 0; g <= 512; g += 16) u.lineTo(g, 160 + E * 18 + Math.sin(g * 0.03 + E) * 6);
            u.stroke();
          }
          let m = new ut(d);
          return ((m.colorSpace = Ye), m);
        })(),
      }),
    );
    (o.position.set(0.2, 2.45, -t / 2 + 0.05), i.add(o));
    let r = Ae(16052198, 0.6);
    for (let [d, u, p, m] of [
      [2.6, 0.1, 0, 0.65],
      [2.6, 0.1, 0, -0.65],
      [0.1, 1.4, -1.25, 0],
      [0.1, 1.4, 1.25, 0],
    ]) {
      let E = new R(new ee(d, u, 0.06), r);
      (E.position.set(0.2 + p, 2.45 + m, -t / 2 + 0.05), i.add(E));
    }
    let a = new J();
    for (let d = 0; d < 8; d++) {
      let u = new R(new vt(0.42, 0.13, 12, 10, Math.PI / 4), Ae(d % 2 ? 16777215 : 14829119, 0.5));
      ((u.rotation.z = (d * Math.PI) / 4), a.add(u));
    }
    (a.position.set(-3.6, 2.5, -t / 2 + 0.16), i.add(a));
    let c = new R(new vt(0.42, 0.025, 6, 40), Ae(14206106, 0.9));
    (c.position.copy(a.position).add(new H(0, 0, 0.12)), i.add(c));
    let l = new R(
      new Ri(0.28, 1.7, 6, 18),
      new X({
        roughness: 0.35,
        map: (() => {
          let d = document.createElement("canvas");
          ((d.width = 64), (d.height = 256));
          let u = d.getContext("2d");
          ((u.fillStyle = "#fff6e5"),
            u.fillRect(0, 0, 64, 256),
            (u.fillStyle = "#ff8a3d"),
            u.fillRect(0, 90, 64, 18),
            (u.fillStyle = "#2d8fb8"),
            u.fillRect(0, 112, 64, 10),
            u.fillRect(29, 0, 6, 256));
          let p = new ut(d);
          return ((p.colorSpace = Ye), p);
        })(),
      }),
    );
    (l.scale.set(1, 1, 0.14), l.position.set(-e / 2 + 0.35, 1.25, 2.6), l.rotation.set(0, Math.PI / 2, 0.12), i.add(l));
    let h = new R(
      new Te(2.6, 1.5),
      new X({
        transparent: !0,
        alphaTest: 0.3,
        side: Ke,
        map: (() => {
          let d = document.createElement("canvas");
          d.width = d.height = 256;
          let u = d.getContext("2d");
          ((u.strokeStyle = "#c9a874"), (u.lineWidth = 3));
          for (let m = -256; m < 512; m += 22)
            (u.beginPath(),
              u.moveTo(m, 0),
              u.lineTo(m + 256, 256),
              u.stroke(),
              u.beginPath(),
              u.moveTo(m + 256, 0),
              u.lineTo(m, 256),
              u.stroke());
          let p = new ut(d);
          return ((p.colorSpace = Ye), p);
        })(),
      }),
    );
    (h.position.set(-e / 2 + 0.05, 2.65, -0.6), (h.rotation.y = Math.PI / 2), i.add(h));
    let f = (d) => {
      let u = new mn();
      for (let p = 0; p < 10; p++) {
        let m = p % 2 ? 0.07 : 0.17,
          E = (p / 10) * Math.PI * 2;
        p ? u.lineTo(Math.sin(E) * m, Math.cos(E) * m) : u.moveTo(0, m);
      }
      return new R(
        new yi(u, { depth: 0.03, bevelEnabled: !0, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 2 }),
        Ae(d, 0.7),
      );
    };
    for (let [d, u, p] of [
      [-1.4, 3, 16747100],
      [0.3, 2.3, 16757575],
      [-0.2, 3.15, 14829119],
    ]) {
      let m = f(p);
      (m.position.set(-e / 2 + 0.09, u, d), (m.rotation.y = Math.PI / 2), i.add(m));
    }
    for (let [d, u] of [
      [-1, 2.2],
      [0.8, 3],
      [-1.8, 2.4],
    ]) {
      let p = new R(new we(0.1, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), Ae(16507856, 0.5));
      (p.scale.set(1, 0.6, 1.2), p.position.set(-e / 2 + 0.08, u, d), (p.rotation.z = -Math.PI / 2), i.add(p));
    }
    for (let [d, u] of [
      [-1.6, 0],
      [0.5, 0.3],
    ]) {
      let p = new R(new ee(0.05, 0.42, 0.7), Ae(9067051, 0.6));
      (p.position.set(e / 2 - 0.03, 3.35, d), i.add(p), s("b_fish", e / 2 - 0.16, d, -Math.PI / 2 + u, 3.22, !1));
    }
    for (let d of [-4, 0, 4]) {
      let u = new R(new yt(0.42, 0.5, 18, 1, !0), Ae(13215860, 0.9, { side: Ke }));
      (u.position.set(d, n - 0.7, 0), i.add(u));
      let p = new R(new re(0.01, 0.01, 0.45, 4), Ae(3811866));
      (p.position.set(d, n - 0.25, 0), i.add(p));
    }
  }
  function MM(i, e, t) {
    let n = new J();
    n.position.copy(e);
    let s = 16,
      o = 12,
      r = 4.2,
      a = new R(new Te(s, o), new X({ map: Cn(15257504, "#b8935e"), roughness: 0.7 }));
    (a.material.map.repeat.set(5, 4), (a.rotation.x = -Math.PI / 2), (a.receiveShadow = !0), n.add(a));
    let c = (() => {
        let M = document.createElement("canvas");
        ((M.width = 256), (M.height = 512));
        let T = M.getContext("2d"),
          A = 26;
        for (let C = 0, P = 0; C < 512; C += A, P++) {
          let I = C > 358.4;
          ((T.fillStyle = I ? (P % 2 ? "#6fc0c6" : "#78c7cc") : P % 2 ? "#eef8f6" : "#f7fcfb"),
            T.fillRect(0, C, 256, A),
            (T.fillStyle = "rgba(60,90,90,.18)"),
            T.fillRect(0, C + A - 2, 256, 2));
          for (let k = 0; k < 14; k++)
            ((T.fillStyle = `rgba(${I ? "30,80,90" : "150,170,170"},${Math.random() * 0.08})`),
              T.fillRect(Math.random() * 256, C + 3 + Math.random() * (A - 6), 30 + Math.random() * 80, 1));
        }
        ((T.fillStyle = "#ffffff"),
          T.fillRect(0, 512 * 0.7 - 6, 256, 9),
          (T.fillStyle = "rgba(0,0,0,.12)"),
          T.fillRect(0, 512 * 0.7 + 3, 256, 2));
        let F = new ut(M);
        return ((F.colorSpace = Ye), (F.wrapS = F.wrapT = gn), F.repeat.set(5, 1), F);
      })(),
      l = new X({ map: c, roughness: 0.9, side: Ke });
    for (let [M, T, A, F] of [
      [0, -o / 2, 0, s],
      [-s / 2, 0, Math.PI / 2, o],
      [s / 2, 0, -Math.PI / 2, o],
      [0, o / 2, Math.PI, s],
    ]) {
      let C = new R(new Te(F, r), l);
      (C.position.set(M, r / 2, T), (C.rotation.y = A), (C.receiveShadow = !0), n.add(C));
      let P = new R(
        new ee(A === 0 || A === Math.PI ? F : 0.06, 0.3, A === 0 || A === Math.PI ? 0.06 : F),
        Ae(16777215, 0.6),
      );
      (P.position.set(M, 0.15, T), n.add(P));
    }
    let h = new R(new Te(s, o), Ae(16775920, 0.9, { side: Ke, emissive: new ae(15986660), emissiveIntensity: 0.55 }));
    ((h.rotation.x = Math.PI / 2), (h.position.y = r), n.add(h));
    for (let M = -3; M <= 3; M++) {
      let T = new R(new ee(0.18, 0.2, o), Ae(13208139, 0.7));
      (T.position.set(M * 2.2, r - 0.1, 0), n.add(T));
    }
    let f = ccsSlideDoor(); // v88: ประตูบานเลื่อนไม้แบบเดียวกับด้านนอก
    // v87: ประตู/หน้าต่างด้านในให้ตรงกับบ้านด้านนอก (มองจากในบ้าน: หน้าต่างใหญ่ฝั่ง -x, ประตูเยื้องไป +x, ช่องกระจกข้างประตู)
    const DX = 1.4;
    (f.position.set(DX, -0.18, o / 2 + 0.02),
      n.add(f),
      Ep(n, s, o, r, t, 16777215, 7317688, NaN, -4.6, 3.4));
    for (let M of [-4.6]) {
      for (let A of [-1, 1]) {
        let F = new R(new ee(0.5, 2.5, 0.08), Ae(A < 0 ? 9425888 : 16777215, 0.95));
        (F.position.set(M + A * 1.85, 1.95, o / 2 - 0.22), n.add(F));
      }
      let T = new R(new re(0.03, 0.03, 4.4, 8), Ae(9067051));
      ((T.rotation.z = Math.PI / 2), T.position.set(M, 3.25, o / 2 - 0.22), n.add(T));
    }
    let d = new R(
      new Te(1.5, 5.2),
      new X({
        map: (() => {
          let M = document.createElement("canvas");
          ((M.width = 64), (M.height = 256));
          let T = M.getContext("2d");
          ((T.fillStyle = "#2f8fb5"),
            T.fillRect(0, 0, 64, 256),
            (T.fillStyle = "#ffffff"),
            T.fillRect(6, 0, 4, 256),
            T.fillRect(54, 0, 4, 256));
          for (let F = 16; F < 256; F += 40) ((T.font = "22px serif"), T.fillText("🐾", 20, F));
          let A = new ut(M);
          return ((A.colorSpace = Ye), A);
        })(),
        roughness: 0.95,
      }),
    );
    ((d.rotation.x = -Math.PI / 2), d.position.set(DX, 0.012, o / 2 - 3.4), n.add(d));
    let u = new R(new Te(1.7, 0.8), Ae(9067051, 0.95));
    ((u.rotation.x = -Math.PI / 2), u.position.set(DX, 0.014, o / 2 - 0.5), n.add(u));
    let p = new R(
        new gt(2.2, 40),
        new X({
          roughness: 1,
          map: (() => {
            let M = document.createElement("canvas");
            M.width = M.height = 256;
            let T = M.getContext("2d");
            ((T.fillStyle = "#cdb48a"), T.fillRect(0, 0, 256, 256));
            for (let F = 6; F < 128; F += 7)
              ((T.strokeStyle = F % 14 ? "#e0cba3" : "#b89c70"),
                (T.lineWidth = 4),
                T.beginPath(),
                T.arc(128, 128, F, 0, 7),
                T.stroke());
            let A = new ut(M);
            return ((A.colorSpace = Ye), A);
          })(),
        }),
      ),
      m = new H(-5.2, 0, -3.6),
      E = 0.8,
      g = 1.15,
      y = 0.85,
      x = new J();
    if ((x.position.copy(m), ze("dog_bed_scan"))) {
      let M = je("dog_bed_scan");
      (M.scale.setScalar(2.3),
        (M.rotation.y = Math.PI / 2),
        x.add(M),
        M.traverse((C) => {
          ((C.castShadow = !0), (C.receiveShadow = !0));
        }),
        x.updateMatrixWorld(!0));
      let T = new Ls(),
        A = 9;
      for (let [C, P] of [
        [0, 0],
        [0.35, 0],
        [-0.35, 0],
        [0, 0.25],
        [0, -0.25],
        [0.5, 0.15],
        [-0.5, -0.15],
      ]) {
        T.set(new H(m.x + C, 3, m.z + P), new H(0, -1, 0));
        let I = T.intersectObject(M, !0)[0];
        I && (A = Math.min(A, I.point.y));
      }
      ((E = A < 9 ? A + 0.01 : 0.2), (g = 1.06), (y = 0.86)); // v87: ยกตัวขึ้นนอนบนผิวเบาะ (เดิมจม)
      let F = new R(
        new Te(1.4, 0.32),
        new be({
          map: ei(
            "💤 เตียงข้าวต้ม",
            16774885,
            1736614,
            512,
            116,
          ),
        }),
      );
      (F.position.set(m.x, 2.2, -o / 2 + 0.04), n.add(F));
      {
        let C = new R(new gt(0.34, 32), new be({ map: io("st_home", 16774885, 1736614), transparent: !0 }));
        (C.position.set(m.x + 1, 2.2, -o / 2 + 0.05), n.add(C));
      }
    } else {
      let M = new X({ map: Cn(13208139, "#7a4a24"), roughness: 0.7 }),
        T = new R(new ee(2.3, 0.35, 1.7), M);
      ((T.position.y = 0.3), x.add(T));
      for (let [D, L] of [
        [-1.05, -0.75],
        [1.05, -0.75],
        [-1.05, 0.75],
        [1.05, 0.75],
      ]) {
        let q = new R(new re(0.07, 0.07, 0.2, 8), M);
        (q.position.set(D, 0.1, L), x.add(q));
      }
      let A = new R(new ee(2.4, 1.1, 0.12), M);
      (A.position.set(0, 0.85, -0.85), x.add(A));
      for (let D of [-1.15, 1.15]) {
        let L = new R(new re(0.08, 0.08, 1.35, 10), M);
        (L.position.set(D, 0.75, -0.85), x.add(L));
        let q = new R(new we(0.11, 10, 8), M);
        (q.position.set(D, 1.47, -0.85), x.add(q));
      }
      let F = new R(new gt(0.2, 18), Ae(16748472, 0.6));
      (F.position.set(0, 1, -0.78), x.add(F));
      for (let [D, L] of [
        [-0.22, 1.25],
        [-0.08, 1.31],
        [0.08, 1.31],
        [0.22, 1.25],
      ]) {
        let q = new R(new gt(0.07, 12), Ae(16748472, 0.6));
        (q.position.set(D, L, -0.78), x.add(q));
      }
      let C = new R(new ee(2.1, 0.26, 1.55), Ae(16774885, 0.95));
      ((C.position.y = 0.6), x.add(C));
      let P = new R(new Ri(0.2, 0.9, 6, 12), Ae(10410224, 0.9));
      ((P.rotation.z = Math.PI / 2), P.scale.set(1, 1, 0.7), P.position.set(0, 0.82, -0.5), x.add(P));
      let I = new R(
        new ee(2.14, 0.06, 0.95),
        new X({
          map: (() => {
            let D = document.createElement("canvas");
            D.width = D.height = 64;
            let L = D.getContext("2d");
            for (let $ = 0; $ < 8; $++)
              for (let te = 0; te < 8; te++)
                ((L.fillStyle = ($ + te) % 2 ? "#ffd23f" : "#fff6e5"), L.fillRect($ * 8, te * 8, 8, 8));
            let q = new ut(D);
            return ((q.colorSpace = Ye), q);
          })(),
          roughness: 0.9,
        }),
      );
      (I.position.set(0, 0.76, 0.32), x.add(I));
      let k = new R(
        new Te(1.4, 0.32),
        new be({
          map: ei(
            "💤 เตียงข้าวต้ม",
            16774885,
            11875210,
            512,
            116,
          ),
        }),
      );
      (k.position.set(0, 1.62, -0.78), x.add(k));
      {
        let D = new R(new gt(0.34, 32), new be({ map: io("st_home", 16774885, 11875210), transparent: !0 }));
        (D.position.set(0.95, 1.62, -0.77), x.add(D));
      }
    }
    n.add(x);
    let b = new H(4.7, 0, -2.3);
    if (ze("dogbowl2"))
      for (let [M, T] of [
        [-0.3, "food"],
        [0.3, "water"],
      ]) {
        let A = je("dogbowl2", 0.46);
        (A.position.set(b.x + M, 0, b.z),
          T === "food"
            ? A.traverse((C) => {
                let P = C;
                if (P.isMesh) {
                  let I = P.material.clone();
                  (I.color.set(4165592), (I.metalness = 0), (I.roughness = 0.45), (P.material = I));
                }
              })
            : A.traverse((C) => {
                let P = C;
                if (P.isMesh) {
                  let I = P.material.clone();
                  ((I.metalness = 0.85), (I.roughness = 0.22), (P.material = I));
                }
              }),
          n.add(A));
        let F = new R(
          new gt(0.15, 20),
          T === "water" ? new X({ color: 9426672, roughness: 0.05, transparent: !0, opacity: 0.85 }) : Ae(9065e3, 0.8),
        );
        if (((F.rotation.x = -Math.PI / 2), F.position.set(b.x + M, 0.055, b.z), n.add(F), T === "food"))
          for (let C = 0; C < 14; C++) {
            let P = new R(new we(0.022, 6, 5), Ae(10116910, 0.7)),
              I = C * 2.4,
              k = Math.sqrt(C / 14) * 0.12;
            (P.position.set(b.x + M + Math.cos(I) * k, 0.065, b.z + Math.sin(I) * k), n.add(P));
          }
      }
    else
      for (let [M, T, A] of [
        [-0.35, 14829119, 10115626],
        [0.35, 4163272, 8377328],
      ]) {
        let F = new R(new re(0.26, 0.2, 0.14, 18), Ae(T, 0.4));
        (F.position.set(b.x + M, 0.07, b.z), n.add(F));
        let C = new R(new gt(0.21, 16), Ae(A, 0.4));
        ((C.rotation.x = -Math.PI / 2), C.position.set(b.x + M, 0.13, b.z), n.add(C));
      }
    let w = new R(new Te(1.4, 0.7), Ae(16765503, 0.95));
    ((w.rotation.x = -Math.PI / 2), w.position.set(b.x, 0.011, b.z), n.add(w));
    let v = Q7();
    (v.group.position.set(s / 2 - 0.4, 0, -0.6), (v.group.rotation.y = -Math.PI / 2), n.add(v.group));
    let _ = [],
      S = (M, T, A, F, C = 0, P = !0) => {
        if (!ze(M)) return;
        let I = je(M);
        if ((I.position.set(T, C, A), (I.rotation.y = F), n.add(I), !P)) return;
        I.updateMatrixWorld(!0);
        let k = new mt().setFromObject(I),
          D = k.getCenter(new H()),
          L = k.getSize(new H());
        _.push({ x: D.x + e.x, z: D.z + e.z, hw: L.x / 2 - 0.1, hd: L.z / 2 - 0.1 });
      };
    ze("b_sofa_big")
      ? eH(n, s, o, r, S)
      : (S("Couch_08", 0.2, -5.4, 0),
        S("Coffee_Table_03", 0.2, -3.9, 0),
        S("Plants_19", -7.3, 5.2, 0),
        S("Plants_15", 7.3, 5.2, 0),
        S("Plants_05", 0.2, -3.9, 0, 0.45, !1),
        S("Light_05", 7.3, -5.3, 0),
        S("Picture_08", 0.2, -5.95, 0, 2.3, !1),
        S("Clock_03", 3.6, -5.95, 0, 3, !1),
        S("Closet_01", -7.5, 1, Math.PI / 2),
        S("Toy_02", 1.6, 0.6, 0.4, 0, !1),
        S("Toy_03", -1.2, -0.8, -0.6, 0, !1),
        S("Armchair_02", -2.6, -4.6, 0.4),
        S("Plants_15", -7.3, -5.3, 0));
    // v81: โคมไฟเพดานเป็นโคมกระดาษสา (Rice Paper Lamp) ห้อยสายจากเพดาน
    for (let M of [-4, 0, 4]) {
      let T = new En(16767392, 8, 12, 1.6);
      if ((T.position.set(M, r - 0.75, 0), n.add(T), ccsRiceLamp(n, M, r, 0))) {
      } else {
        let A = new R(new we(0.16, 10, 8), new be({ color: 16773568 }));
        (A.position.set(M, r - 0.3, 0), n.add(A));
      }
    }
    return (
      Lo(n),
      i.add(n),
      _.push(
        { x: e.x + m.x, z: e.z + m.z, hw: g, hd: y, low: !0 },
        { x: e.x + s / 2 - 0.4, z: e.z - 0.6, hw: 0.4, hd: 1.35 },
      ),
      {
        id: "home",
        group: n,
        origin: e,
        exit: new H(DX, 0, o / 2 - 0.8).add(e),
        keeperSpot: new H(9999, 0, 9999),
        wares: [],
        solids: _,
        bounds: { x0: e.x - s / 2 + 0.5, x1: e.x + s / 2 - 0.5, z0: e.z - o / 2 + 0.5, z1: e.z + o / 2 - 0.4 },
        bed: m
          .clone()
          .add(e)
          .add(new H(0, 0, ze("dog_bed_scan") ? -0.3 : 0.1)),
        bedY: E,
        bedRect: { x: e.x + m.x, z: e.z + m.z, hw: g, hd: y },
        bowls: b.clone().add(e),
        cabinet: v,
        cabinets: ccsCabMake(n, s, e, _, v),
      }
    );
  }
  function TM(i, e) {
    let t = new J(),
      n = new X({ map: Cn(13208139, "#8a5a2b"), roughness: 0.7 }),
      s = new R(new ee(2.6, 0.78, 1.1), n);
    ((s.position.y = 0.39), t.add(s));
    let o = new R(new ee(2.8, 0.07, 1.25), Ae(16774885, 0.5));
    ((o.position.y = 0.81), t.add(o));
    let r = Ae(14081506, 0.25, { metalness: 0.85 }),
      a = Ae(2829099, 0.5, { metalness: 0.4 }),
      c = 2.5,
      l = 1.25,
      h = 0.85,
      f = 0.85,
      d = (C, P, I, k, D, L, q) => {
        let $ = new R(new ee(C, P, I), k);
        return ($.position.set(D, L, q), t.add($), $);
      };
    (d(c, 0.08, h, r, 0, f + 0.04, 0), d(c, 0.1, h, r, 0, f + l, 0));
    for (let C of [-1, 1]) d(0.08, l, h, r, C * (c / 2 - 0.04), f + l / 2, 0);
    let u = new R(
      new Te(c - 0.16, l - 0.12),
      new X({ color: 16738842, emissive: new ae(16730640), emissiveIntensity: 1.5, roughness: 1 }),
    );
    (u.position.set(0, f + l / 2, -h / 2 + 0.02), t.add(u));
    for (let C = 0; C < 6; C++) d(c - 0.2, 0.025, 0.02, a, 0, f + 0.18 + C * 0.19, -h / 2 + 0.04);
    let p = new R(new ee(c - 0.2, 0.05, h - 0.12), Ae(9067051, 0.3, { metalness: 0.3 }));
    (p.position.set(0, f + 0.11, 0), t.add(p));
    let m = new R(
      new Te(c - 0.16, l - 0.1),
      new X({ color: 16774368, roughness: 0.05, metalness: 0.1, transparent: !0, opacity: 0.18, depthWrite: !1 }),
    );
    (m.position.set(0, f + l / 2, h / 2 - 0.02), t.add(m));
    let E = (() => {
        let C = document.createElement("canvas");
        C.width = C.height = 128;
        let P = C.getContext("2d"),
          I = P.createLinearGradient(0, 0, 0, 128);
        (I.addColorStop(0, "#f2b252"),
          I.addColorStop(0.5, "#cf7a2a"),
          I.addColorStop(1, "#8a4214"),
          (P.fillStyle = I),
          P.fillRect(0, 0, 128, 128));
        for (let D = 0; D < 900; D++)
          ((P.fillStyle = Math.random() < 0.5 ? "rgba(110,50,12,.35)" : "rgba(255,220,150,.35)"),
            P.beginPath(),
            P.arc(Math.random() * 128, Math.random() * 128, 0.6 + Math.random() * 1.6, 0, Math.PI * 2),
            P.fill());
        ((P.strokeStyle = "rgba(70,30,8,.45)"), (P.lineWidth = 3));
        for (let D = 0; D < 5; D++) (P.beginPath(), P.moveTo(0, 20 + D * 24), P.lineTo(128, 10 + D * 24), P.stroke());
        let k = new ut(C);
        return ((k.colorSpace = Ye), (k.wrapS = k.wrapT = gn), k);
      })(),
      g = new X({ map: E, roughness: 0.35, metalness: 0.05 }),
      y = () => {
        let C = new J(),
          P = new R(new we(0.16, 16, 12), g);
        (P.scale.set(1.25, 0.95, 1), C.add(P));
        for (let I of [-1, 1]) {
          let k = new R(new we(0.075, 10, 8), g);
          (k.scale.set(1.6, 0.9, 0.9), k.position.set(0.1, -0.07, I * 0.11), (k.rotation.y = I * 0.4), C.add(k));
          let D = new R(new re(0.018, 0.02, 0.08, 6), Ae(15985368, 0.6));
          ((D.rotation.z = Math.PI / 2), D.position.set(0.22, -0.08, I * 0.13), C.add(D));
          let L = new R(new we(0.06, 10, 8), g);
          (L.scale.set(1.5, 0.6, 0.8), L.position.set(-0.06, 0.04, I * 0.15), C.add(L));
        }
        return C;
      },
      x = [];
    for (let C = 0; C < 3; C++) {
      let P = new J();
      (P.position.set(0, f + 0.3 + C * 0.33, 0.02), t.add(P), x.push(P));
      let I = new R(new re(0.012, 0.012, c - 0.12, 6), r);
      ((I.rotation.z = Math.PI / 2), P.add(I));
      for (let k = 0; k < 3; k++) {
        let D;
        if (e) {
          D = new J();
          let L = e();
          ((L.rotation.y = Math.PI / 2), (L.position.y = -0.1), D.add(L));
        } else ((D = y()), (D.rotation.y = Math.PI / 2));
        ((D.position.x = -0.72 + k * 0.72), (D.rotation.x = k), P.add(D));
      }
    }
    let b = u,
      w = x;
    for (let C of [-1.25, 1.25])
      for (let P of [-0.5, 0.5]) {
        let I = new R(new re(0.04, 0.04, 2.6, 6), Ae(16777215));
        (I.position.set(C, 2.1, P), t.add(I));
      }
    let v = (() => {
        let C = document.createElement("canvas");
        ((C.width = 256), (C.height = 32));
        let P = C.getContext("2d");
        for (let k = 0; k < 8; k++) ((P.fillStyle = k % 2 ? "#e2463f" : "#fff6e5"), P.fillRect(k * 32, 0, 32, 32));
        let I = new ut(C);
        return ((I.colorSpace = Ye), I);
      })(),
      _ = new R(new ee(3, 0.08, 1.6), new X({ map: v }));
    ((_.position.y = 3.42), (_.rotation.x = 0.12), t.add(_));
    for (let C = 0; C < 12; C++) {
      let P = new R(new we(0.125, 10, 6, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), Ae(C % 2 ? 14829119 : 16774885));
      (P.position.set(-1.4 + C * 0.255, 3.35, 0.8), t.add(P));
    }
    let S = new R(
      new Te(2.2, 0.5),
      new be({
        map: ei(
          "🍗 ไก่ย่างป้าอู้ด",
          16774885,
          12735807,
          512,
          116,
        ),
        side: Ke,
      }),
    );
    (S.position.set(0, 3.08, 0.82), t.add(S));
    {
      let C = u3(io("st_grill", 16774885, 12735807), 0.3, 12735807);
      (C.position.set(1.25, 1.75, 0.56), t.add(C));
    }
    let M = new En(16742960, 5, 4.5, 2);
    (M.position.set(0, 1.5, 0.9), t.add(M), Lo(t), (b.castShadow = !1));
    let T = (() => {
        let C = document.createElement("canvas");
        C.width = C.height = 128;
        let P = C.getContext("2d");
        for (let D = 0; D < 26; D++) {
          let L = 14 + Math.random() * 26,
            q = 64 + (Math.random() - 0.5) * 50,
            $ = 64 + (Math.random() - 0.5) * 50,
            te = P.createRadialGradient(q, $, 0, q, $, L);
          (te.addColorStop(0, "rgba(235,235,235,.32)"),
            te.addColorStop(1, "rgba(235,235,235,0)"),
            (P.fillStyle = te),
            P.fillRect(0, 0, 128, 128));
        }
        let I = P.getImageData(0, 0, 128, 128);
        for (let D = 0; D < 128; D++)
          for (let L = 0; L < 128; L++) {
            let q = Math.hypot(L - 64, D - 64) / 64;
            I.data[(D * 128 + L) * 4 + 3] *= Math.max(0, 1 - q * q);
          }
        P.putImageData(I, 0, 0);
        let k = new ut(C);
        return ((k.colorSpace = Ye), k);
      })(),
      A = Array.from({ length: 18 }, (C, P) => {
        let I = new zi(new vi({ map: T, transparent: !0, depthWrite: !1, opacity: 0, color: 15263976 }));
        return (t.add(I), { m: I, t: P / 18, sx: (Math.random() - 0.5) * 1.4, rot: Math.random() * 6 });
      });
    return {
      group: t,
      update: (C, P) => {
        (w.forEach((I, k) => {
          I.rotation.x = C * (1.1 + k * 0.15) + k;
        }),
          (b.material.emissiveIntensity = 1.2 + Math.sin(C * 7) * 0.2 + Math.sin(C * 13) * 0.1));
        for (let I of A) {
          ((I.t += P * 0.28), I.t > 1 && ((I.t -= 1), (I.sx = (Math.random() - 0.5) * 1.4)));
          let k = I.t,
            D = k * k * 2.2;
          (I.m.position.set(
            I.sx * (0.4 + k) + Math.sin(k * 5 + I.rot) * 0.18,
            2.15 + k * 2,
            -0.15 - D + Math.cos(k * 4 + I.rot) * 0.12,
          ),
            I.m.scale.setScalar(0.35 + k * 2.1));
          let L = I.m.material;
          ((L.rotation = I.rot + k * 1.2), (L.opacity = Math.min(1, k * 6) * (1 - k) * 0.55));
        }
      },
    };
  }
  function tH() {
    let i = document.createElement("canvas");
    i.width = i.height = 256;
    let e = i.getContext("2d");
    ((e.fillStyle = "#fffdf2"),
      e.beginPath(),
      e.roundRect(6, 6, 244, 244, 40),
      e.fill(),
      (e.lineWidth = 12),
      (e.strokeStyle = "#2e7d32"),
      e.stroke());
    for (let [n, s, o, r] of [
      [88, 112, 30, "#e2463f"],
      [128, 98, 32, "#ffb02e"],
      [170, 112, 30, "#7ac74f"],
      [108, 122, 26, "#ffd23f"],
      [150, 124, 26, "#e2463f"],
    ])
      ((e.fillStyle = r),
        e.beginPath(),
        e.arc(n, s, o, 0, Math.PI * 2),
        e.fill(),
        (e.fillStyle = "rgba(255,255,255,.45)"),
        e.beginPath(),
        e.arc(n - o * 0.35, s - o * 0.35, o * 0.25, 0, Math.PI * 2),
        e.fill());
    ((e.fillStyle = "#3e9e3e"),
      e.beginPath(),
      e.ellipse(132, 66, 16, 7, -0.5, 0, Math.PI * 2),
      e.fill(),
      (e.fillStyle = "#c98a4b"),
      e.beginPath(),
      e.moveTo(44, 130),
      e.lineTo(212, 130),
      e.lineTo(190, 214),
      e.lineTo(66, 214),
      e.closePath(),
      e.fill(),
      (e.strokeStyle = "#8a5a2b"),
      (e.lineWidth = 5),
      e.stroke(),
      (e.lineWidth = 4));
    for (let n = 150; n < 214; n += 20)
      (e.beginPath(), e.moveTo(50 + (n - 130) * 0.27, n), e.lineTo(206 - (n - 130) * 0.27, n), e.stroke());
    for (let n = 0; n < 7; n++) {
      let s = n / 6;
      (e.beginPath(), e.moveTo(44 + s * 168, 130), e.lineTo(66 + s * 124, 214), e.stroke());
    }
    ((e.fillStyle = "#b07a44"),
      e.fillRect(38, 124, 180, 14),
      (e.strokeStyle = "#8a5a2b"),
      (e.lineWidth = 9),
      e.beginPath(),
      e.arc(128, 128, 70, Math.PI * 1.08, Math.PI * 1.92),
      e.stroke());
    let t = new ut(i);
    return ((t.colorSpace = Ye), t);
  }
  function nH() {
    let i = document.createElement("canvas");
    i.width = i.height = 256;
    let e = i.getContext("2d");
    ((e.fillStyle = "#fff6e5"),
      e.beginPath(),
      e.roundRect(6, 6, 244, 244, 40),
      e.fill(),
      (e.lineWidth = 12),
      (e.strokeStyle = "#8a5a2b"),
      e.stroke());
    let t = () => {
      (e.beginPath(),
        e.moveTo(70, 196),
        e.bezierCurveTo(40, 150, 40, 70, 98, 64),
        e.bezierCurveTo(140, 60, 150, 120, 128, 140),
        e.bezierCurveTo(106, 120, 116, 60, 158, 64),
        e.bezierCurveTo(216, 70, 216, 150, 186, 196),
        e.moveTo(70, 196),
        e.bezierCurveTo(100, 170, 156, 150, 186, 120),
        e.moveTo(186, 196),
        e.bezierCurveTo(156, 170, 100, 150, 70, 120));
    };
    ((e.lineCap = "round"),
      (e.lineJoin = "round"),
      t(),
      (e.strokeStyle = "#6b3a12"),
      (e.lineWidth = 40),
      e.stroke(),
      t());
    let n = e.createLinearGradient(0, 60, 0, 200);
    (n.addColorStop(0, "#d8853f"),
      n.addColorStop(1, "#a85a22"),
      (e.strokeStyle = n),
      (e.lineWidth = 30),
      e.stroke(),
      (e.fillStyle = "#ffffff"));
    for (let [o, r] of [
      [78, 110],
      [96, 80],
      [168, 84],
      [184, 120],
      [128, 150],
      [150, 178],
      [104, 176],
      [62, 150],
      [198, 156],
    ])
      e.fillRect(o - 3, r - 3, 6, 6);
    let s = new ut(i);
    return ((s.colorSpace = Ye), s);
  }
  function wM(i) {
    let e = new J(),
      t = new X({ map: Cn(14262374, "#8a5a2b"), roughness: 0.7 }),
      n = new R(new ee(2.8, 0.95, 1.1), t);
    ((n.position.y = 0.48), e.add(n));
    let s = new R(new ee(3, 0.08, 1.25), Ae(16774885, 0.5));
    ((s.position.y = 0.99), e.add(s));
    let o = new X({ color: 14677247, roughness: 0.05, metalness: 0.1, transparent: !0, opacity: 0.25, depthWrite: !1 }),
      r = new R(new ee(2.4, 0.55, 0.8), o);
    (r.position.set(0, 1.31, 0), (r.renderOrder = 3), e.add(r));
    for (let [p, m, E, g, y, x] of [
      [2.44, 0.04, 0.84, 0, 1.6, 0],
      [0.04, 0.58, 0.84, -1.22, 1.31, 0],
      [0.04, 0.58, 0.84, 1.22, 1.31, 0],
    ]) {
      let b = new R(new ee(p, m, E), Ae(9067051, 0.5));
      (b.position.set(g, y, x), e.add(b));
    }
    for (let p = 0; p < 12; p++) {
      let m = i(p);
      (m.position.set(-1 + (p % 6) * 0.4, 1.06, -0.2 + Math.floor(p / 6) * 0.38), (m.rotation.y = p * 0.7), e.add(m));
    }
    for (let p = 0; p < 5; p++) {
      let m = i(p + 20);
      (m.position.set(-0.8 + p * 0.4, 1.2, 0), (m.rotation.y = p * 1.3 + 0.4), e.add(m));
    }
    for (let p = 0; p < 3; p++) {
      let m = new R(new re(0.28, 0.22, 0.16, 16, 1, !0), Ae(13208139, 0.9, { side: Ke }));
      (m.position.set(-0.8 + p * 0.8, 1.7, 0), e.add(m));
      for (let E = 0; E < 3; E++) {
        let g = i(p * 3 + E + 30);
        (g.position.set(-0.8 + p * 0.8 + (E - 1) * 0.12, 1.72 + (E === 1 ? 0.06 : 0), (E - 1) * 0.05),
          (g.rotation.y = E),
          e.add(g));
      }
    }
    for (let p of [-1.35, 1.35])
      for (let m of [-0.55, 0.55]) {
        let E = new R(new re(0.04, 0.04, 2.3, 6), Ae(16777215));
        (E.position.set(p, 2.1, m), e.add(E));
      }
    let a = (() => {
        let p = document.createElement("canvas");
        ((p.width = 256), (p.height = 32));
        let m = p.getContext("2d");
        for (let g = 0; g < 8; g++) ((m.fillStyle = g % 2 ? "#5cb0e8" : "#fff6e5"), m.fillRect(g * 32, 0, 32, 32));
        let E = new ut(p);
        return ((E.colorSpace = Ye), E);
      })(),
      c = new R(new ee(3.2, 0.08, 1.6), new X({ map: a }));
    ((c.position.y = 3.27), (c.rotation.x = 0.12), e.add(c));
    for (let p = 0; p < 12; p++) {
      let m = new R(new we(0.13, 10, 6, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), Ae(p % 2 ? 6074600 : 16774885));
      (m.position.set(-1.5 + p * 0.273, 3.2, 0.8), e.add(m));
    }
    let l = new R(
      new Te(2.4, 0.52),
      new be({
        map: ei("🥐 ลุงปั้ม Bakery", 16774885, 9067051, 512, 112),
        side: Ke,
      }),
    );
    (l.position.set(0, 2.92, 0.82), e.add(l));
    let h = u3(io("st_main", 16777215, 9067051, 256, 0.1), 0.3);
    (h.position.set(0.9, 0.5, 0.58), e.add(h));
    let f = new R(new Te(0.6, 0.6), new be({ map: nH() }));
    (f.position.set(0.02, 0.5, 0.562), e.add(f));
    let d = new R(new ee(0.68, 0.68, 0.02), Ae(9067051, 0.6));
    (d.position.set(0.02, 0.5, 0.551), e.add(d));
    let u = new En(16766362, 2, 4, 2);
    return (u.position.set(0, 2, 0.3), e.add(u), Lo(e), e);
  }
  function m3(i = 0.45) {
    if (ze("beach_ball2")) {
      let r = new J(),
        a = je("beach_ball2", i * 2);
      return (
        (a.position.y = -i),
        r.add(a),
        a.traverse((c) => {
          let l = c;
          if (l.isMesh) {
            l.castShadow = !0;
            let h = l.material;
            h && h.isMeshStandardMaterial && ((h.roughness = 0.28), (h.metalness = 0));
          }
        }),
        r
      );
    }
    let e = document.createElement("canvas");
    ((e.width = 256), (e.height = 128));
    let t = e.getContext("2d");
    (["#e2463f", "#fff6e5", "#3f86c8", "#fff6e5", "#ffd23f", "#fff6e5"].forEach((r, a) => {
      ((t.fillStyle = r), t.fillRect((a * 256) / 6, 0, 256 / 6 + 1, 128));
    }),
      (t.fillStyle = "#fff6e5"),
      t.fillRect(0, 0, 256, 10),
      t.fillRect(0, 118, 256, 10));
    let s = new ut(e);
    s.colorSpace = Ye;
    let o = new R(new we(i, 24, 16), new X({ map: s, roughness: 0.35 }));
    return ((o.castShadow = !0), o);
  }
  function g3(i, e = !1) {
    let t = new J(),
      n = Ae(16774885, 0.6),
      s = new X({ map: Cn(10508330, "#5a2e12"), roughness: 0.7 }),
      o = 1.35,
      r = 2.3,
      a = new mn();
    (a.moveTo(-o / 2, 0),
      a.lineTo(o / 2, 0),
      a.lineTo(o / 2, r - o / 2),
      a.absarc(0, r - o / 2, o / 2, 0, Math.PI, !1),
      a.lineTo(-o / 2, 0));
    let c = new R(new yi(a, { depth: 0.12, bevelEnabled: !1 }), n);
    (c.scale.set(1.18, 1.06, 1), c.position.set(0, 0.18, 0), (c.rotation.y = Math.PI), t.add(c));
    let l = new R(new yi(a, { depth: 0.08, bevelEnabled: !1 }), s);
    (l.position.set(0, 0.2, -0.1), (l.rotation.y = Math.PI), t.add(l));
    for (let y of [0.8, 1.5]) {
      let x = new R(new ee(o * 0.95, 0.06, 0.03), Ae(3811866, 0.5, { metalness: 0.4 }));
      (x.position.set(0, 0.2 + y, -0.2), t.add(x));
    }
    let h = new R(new we(0.06, 10, 8), Ae(16765503, 0.25, { metalness: 0.8 }));
    (h.position.set(-0.45, 1.25, -0.22), t.add(h));
    let f = new R(new gt(0.22, 18), Ae(16771496, 0.3, { emissive: new ae(16762976), emissiveIntensity: 0.35 }));
    if ((f.position.set(0, 2.05, -0.19), (f.rotation.y = Math.PI), t.add(f), e)) {
      let y = new be({ color: 16771488 });
      for (let x of [-1.05, 1.05]) {
        let b = new R(new re(0.09, 0.11, 0.24, 8), y);
        (b.position.set(x, 2, -0.15), t.add(b));
      }
      return (Lo(t), t);
    }
    let d = Ae(13221806, 0.9),
      u = new R(new ee(2.2, 0.12, 1), d);
    (u.position.set(0, 0.06, -0.55), t.add(u));
    let p = new R(new ee(1.8, 0.1, 0.5), d);
    (p.position.set(0, 0.17, -0.3), t.add(p));
    let m = new R(new ee(2.1, 0.1, 0.85), Ae(12735807, 0.6));
    (m.position.set(0, r + 0.55, -0.4), (m.rotation.x = -0.25), t.add(m));
    for (let y of [-0.9, 0.9]) {
      let x = new R(new ee(0.06, 0.5, 0.06), n);
      (x.position.set(y, r + 0.3, -0.6), (x.rotation.x = 0.6), t.add(x));
    }
    let E = new be({ color: 16771488 });
    for (let y of [-1.05, 1.05]) {
      let x = new R(new re(0.1, 0.12, 0.28, 8), E);
      (x.position.set(y, 2, -0.15), t.add(x));
      let b = new R(new yt(0.15, 0.12, 8), Ae(2829099));
      (b.position.set(y, 2.2, -0.15), t.add(b));
    }
    let g = new R(new Te(1.7, 0.36), new be({ map: ei(i, 16774885, 11875210, 512, 110) }));
    return (g.position.set(0, r + 0.95, -0.2), (g.rotation.y = Math.PI), t.add(g), Lo(t), t);
  }
  function vM(i, e = 0, t = !1) {
    let n = new J(),
      s = i,
      o = s.fz ?? i.z,
      r = s.top ?? (e || 4.6),
      a = new be({ map: r3(i) }),
      c = [];
    {
      let h = Ae(2829099, 0.4, { metalness: 0.6 }),
        f = i.x + i.w / 2 - 0.12,
        d = e ? Math.min(3.95, r - 0.4) : 3.95,
        u = new R(new ee(0.22, 0.6, 0.06), h);
      (u.position.set(f, d - 0.1, o + 0.03), n.add(u));
      let p = new R(new ee(0.06, 0.06, 1.25), h);
      (p.position.set(f, d + 0.15, o + 0.62), n.add(p));
      let m = new R(new ee(0.04, 0.04, 0.95), h);
      (m.position.set(f, d - 0.17, o + 0.4), (m.rotation.x = 0.62), n.add(m));
      let E = new R(new vt(0.1, 0.02, 6, 14), h);
      ((E.rotation.y = Math.PI / 2), E.position.set(f, d + 0.15, o + 1.3), n.add(E));
      for (let w of [-0.32, 0.32]) {
        let v = new R(new re(0.012, 0.012, 0.2, 4), h);
        (v.position.set(f, d + 0.03, o + 0.78 + w), n.add(v));
      }
      let g = new J();
      (g.position.set(f, d - 0.62, o + 0.78), n.add(g));
      let y = Ae(i.signFg, 0.5),
        x = new R(new re(0.57, 0.57, 0.07, 40, 1, !0), y);
      ((x.rotation.z = Math.PI / 2), g.add(x));
      for (let w of [1, -1]) {
        let v = new R(new gt(0.57, 40), a);
        ((v.rotation.y = (w * Math.PI) / 2), (v.position.x = w * 0.036), g.add(v));
      }
      let b = g;
      c.push((w) => {
        b.rotation.x = Math.sin(w * 1.3 + i.x) * 0.05;
      });
    }
    if (!e) {
      let h = new R(new gt(0.58, 40), a);
      (h.position.set(i.x, 5.1, o + 0.07), n.add(h));
      let f = new R(new vt(0.6, 0.05, 8, 40), Ae(i.trim, 0.5));
      (f.position.copy(h.position), n.add(f));
    }
    let l = (h, f = 0.8, d = {}) => Ae(h, f, d);
    if (i.id === "grocery" && !t) {
      let h = new X({ map: Cn(13208139, "#7a4a24"), roughness: 0.8 }),
        f = (x, b, w) => (ze(x) ? je(x, b) : w()),
        d =
          (x, b = 0.11) =>
          () => {
            let w = new R(new we(b, 12, 10), l(x, 0.45)),
              v = new J();
            return ((w.position.y = b), v.add(w), v);
          },
        u = (x, b) => {
          let w = new R(new ee(0.9, 0.5, 0.7), h);
          (w.position.set(x, 0.45, b), (w.rotation.x = -0.15), n.add(w));
          let v = new R(new ee(0.9, 0.2, 0.7), l(8014372));
          (v.position.set(x, 0.1, b), n.add(v));
        },
        p = i.x - 3.15,
        m = o + 0.62;
      u(p, m);
      let E = [
        () => f("Apple_Red", 0.2, d(14829119)),
        () => f("Orange", 0.2, d(16752412)),
        d(9225791, 0.1),
        () => {
          let x = new J();
          for (let b = 0; b < 4; b++) {
            let w = new R(new Ri(0.03, 0.2, 4, 8), l(16765503, 0.5));
            ((w.rotation.z = Math.PI / 2 + (b - 1.5) * 0.18),
              w.position.set(0, 0.04 + b * 0.012, (b - 1.5) * 0.04),
              x.add(w));
          }
          return x;
        },
      ];
      for (let x = 0; x < 9; x++) {
        let b = E[x % 4]();
        (b.position.set(p - 0.3 + (x % 3) * 0.3, 0.66, m - 0.18 + Math.floor(x / 3) * 0.18),
          (b.rotation.y = x),
          n.add(b));
      }
      u(p + 0.98, m);
      for (let x = 0; x < 2; x++) {
        let b = f("Watermelon", 0.32, () => {
          let w = new R(new we(0.16, 14, 10), l(3050298, 0.5));
          w.scale.set(1.2, 1, 1);
          let v = new J();
          return ((w.position.y = 0.15), v.add(w), v);
        });
        (b.position.set(p + 0.98 - 0.22 + x * 0.42, 0.66, m - 0.08), n.add(b));
      }
      {
        let x = new J(),
          b = new R(new we(0.1, 10, 8), l(14260779, 0.7));
        ((b.scale.y = 1.4), (b.position.y = 0.14), x.add(b));
        for (let w = 0; w < 6; w++) {
          let v = new R(new yt(0.03, 0.18, 4), l(3050298));
          (v.position.set(Math.cos(w) * 0.03, 0.34, Math.sin(w) * 0.03), (v.rotation.z = Math.cos(w) * 0.4), x.add(v));
        }
        (x.position.set(p + 0.98, 0.64, m + 0.2), n.add(x));
      }
      for (let x = 0; x < 12; x++) {
        let b = new R(new we(0.035, 8, 6), l(8011680, 0.35));
        (b.position.set(p + 1.25 + (x % 3) * 0.05, 0.7 - Math.floor(x / 3) * 0.04, m + 0.18 + ((x % 2) - 0.5) * 0.05),
          n.add(b));
      }
      {
        let x = p + 1.96,
          b = l(14081506, 0.3, { metalness: 0.6 });
        for (let v of [0.32, 0.72]) {
          let _ = new R(new ee(0.88, 0.04, 0.55), b);
          (_.position.set(x, v, m), n.add(_));
        }
        for (let v of [-0.42, 0.42])
          for (let _ of [-0.26, 0.26]) {
            let S = new R(new re(0.015, 0.015, 1, 6), b);
            (S.position.set(x + v, 0.5, m + _), n.add(S));
          }
        let w = [14829119, 16765503, 4163272, 8046415, 16748472, 15895592];
        for (let v = 0; v < 8; v++) {
          let _ = v < 4 ? 0.34 : 0.74,
            S = v % 4,
            M;
          if (v % 3 === 0 && ze(v % 2 ? "Chips_1" : "Chips_2")) M = je(v % 2 ? "Chips_1" : "Chips_2", 0.28);
          else {
            let T = new R(new Dc(0.17, 0.26, 0.07, 3, 0.03), l(w[v % 6], 0.4));
            ((T.position.y = 0.13), (M = new J()), M.add(T));
            let A = new R(new gt(0.05, 12), l(16777215, 0.5));
            (A.position.set(0, 0.15, 0.036), M.add(A));
          }
          (M.position.set(x - 0.3 + S * 0.2, _ + 0.02, m + 0.05),
            (M.rotation.y = (Math.random() - 0.5) * 0.3),
            n.add(M));
        }
      }
      {
        let x = p + 2.94,
          b = new R(new ee(0.9, 0.12, 0.7), h);
        (b.position.set(x, 0.06, m), n.add(b));
        let w = [14829119, 4163272, 8046415, 16765503];
        for (let v = 0; v < 4; v++)
          for (let _ = 0; _ < 5 - v; _++) {
            let S = new R(new re(0.06, 0.06, 0.17, 12), [
              l(w[(v + _) % 4], 0.3, { metalness: 0.5 }),
              l(14081506, 0.2, { metalness: 0.8 }),
              l(14081506, 0.2, { metalness: 0.8 }),
            ]);
            (S.position.set(x - 0.3 + _ * 0.13 + v * 0.065, 0.21 + v * 0.17, m - 0.15), n.add(S));
          }
        for (let v = 0; v < 6; v++) {
          let _ = new R(new re(0.05, 0.05, 0.3, 10), l(10410224, 0.05, { transparent: !0, opacity: 0.6 }));
          (_.position.set(x - 0.12 + (v % 3) * 0.11, 0.27, m + 0.17 + Math.floor(v / 3) * 0.11), n.add(_));
          let S = new R(new re(0.022, 0.022, 0.03, 8), l(1929174));
          (S.position.set(_.position.x, 0.44, _.position.z), n.add(S));
        }
      }
      let g = new R(new Te(0.8, 0.8), new be({ map: tH(), side: Ke }));
      (g.position.set(i.x + 3.2, 0.75, o + 0.9), (g.rotation.x = -0.2), n.add(g));
      let y = new R(new ee(0.05, 0.5, 0.05), l(8014372));
      (y.position.set(i.x + 3.2, 0.2, o + 0.86), n.add(y));
    } else if (i.id === "clinic") {
      let h = new J(),
        f = Ae(3126123, 0.4, { emissive: new ae(1740623), emissiveIntensity: 0.6 });
      (h.add(new R(new ee(0.3, 0.9, 0.15), f)),
        h.add(new R(new ee(0.9, 0.3, 0.15), f)),
        h.scale.setScalar(0.72),
        h.position.set(i.x - i.w / 2 + 0.75, e ? Math.min(3.9, r - 0.55) : 3.9, o + 0.06),
        n.add(h));
      // v87: ม้านั่งสั้นลงและเลื่อนไปชิดมุมร้าน ไม่ทับกระถางต้นไม้หน้าประตู
      let d = new R(new ee(1.1, 0.1, 0.5), l(16777215, 0.5));
      (d.position.set(i.x - 2.1, 0.48, o + 0.55), n.add(d));
      for (let u of [-0.48, 0.48]) {
        let p = new R(new ee(0.06, 0.45, 0.45), l(1943770, 0.4));
        (p.position.set(i.x - 2.1 + u, 0.23, o + 0.55), n.add(p));
      }
    } else if (i.id === "groom") {
      let h = new X({ color: 13627391, roughness: 0.05, metalness: 0.1, transparent: !0, opacity: 0.45 }),
        f = new R(new re(0.75, 0.6, 0.6, 24, 1, !0), l(16777215, 0.3));
      ((f.scale.z = 0.6), f.position.set(i.x - 2.2, 0.3, o + 0.75), n.add(f));
      for (let d = 0; d < 7; d++) {
        let u = new R(new we(0.18, 10, 8), l(16777215, 0.6));
        (u.position.set(i.x - 2.5 + (d % 4) * 0.2, 0.62, o + 0.65 + (d % 2) * 0.15), n.add(u));
      }
    } else if (i.id === "chow") {
      let h = new J(),
        f = l(16774885, 0.5);
      {
        let m = new R(new re(0.22, 0.22, 2.4, 14), f);
        ((m.rotation.z = Math.PI / 2), h.add(m));
      }
      for (let m of [-1.25, 1.25])
        for (let E of [-0.2, 0.2]) {
          let g = new R(new we(0.3, 14, 10), f);
          (g.position.set(m, E, 0), h.add(g));
        }
      let d = e ? e + 0.75 : 9.1;
      (h.position.set(i.x + 0.6, d, o - 3), n.add(h));
      let u = new R(new re(0.05, 0.05, 0.9, 8), Ae(2829099, 0.4, { metalness: 0.6 }));
      (u.position.set(i.x + 0.6, d - 0.55, o - 3),
        n.add(u),
        c.push((m) => {
          ((h.rotation.y = Math.sin(m * 0.8) * 0.25), (h.position.y = d + Math.sin(m * 1.6) * 0.06));
        }));
      let p = new be({ color: 11875210, transparent: !0, opacity: 0.55 });
      for (let m = 0; m < 6; m++) {
        let E = new R(new gt(0.12, 12), p);
        ((E.rotation.x = -Math.PI / 2), E.position.set(i.x - 1.2 + m * 0.5, 0.09, o + 1.4 + (m % 2) * 0.25), n.add(E));
      }
    } else if (i.id === "pet") {
      for (let [f, d] of [
        [-2.6, 0.7],
        [-1.6, 0.8],
        [3, 0.7],
      ]) {
        let u = new R(new re(0.45, 0.45, 0.9, 16), l(15188570, 0.95));
        ((u.rotation.z = Math.PI / 2), u.position.set(i.x + f, 0.45, o + d), n.add(u));
      }
      let h = [];
      for (let f = 0; f < 4; f++) {
        let d = new J(),
          u = new R(new we(0.14, 10, 8), l(16769357, 0.6));
        ((u.position.y = 0.14), d.add(u));
        let p = new R(new we(0.09, 10, 8), l(16769357, 0.6));
        (p.position.set(0, 0.3, 0.06), d.add(p));
        let m = new R(new yt(0.03, 0.06, 6), l(16747008));
        ((m.rotation.x = Math.PI / 2),
          m.position.set(0, 0.3, 0.16),
          d.add(m),
          d.position.set(i.x - 2.4 + f * 0.4, 0, o + 1.35),
          n.add(d),
          h.push(d));
      }
      c.push((f) =>
        h.forEach((d, u) => {
          ((d.position.y = Math.abs(Math.sin(f * 4 + u)) * 0.08), (d.rotation.y = Math.sin(f * 0.7 + u) * 1.2));
        }),
      );
    }
    return (
      Lo(n),
      {
        group: n,
        update: (h) => {
          for (let f of c) f(h);
        },
      }
    );
  }
  function RM() {
    let i = new J(),
      e = new Kn({ color: 16777215, roughness: 0.18, clearcoat: 0.8, clearcoatRoughness: 0.15, side: Ke }),
      t = Ae(15002350, 0.12, { metalness: 0.95 }),
      n = Ae(14266442, 0.28, { metalness: 0.85 }),
      s = 2,
      o = 1,
      r = [
        [0, 0.24],
        [0.3, 0.245],
        [0.4, 0.28],
        [0.46, 0.4],
        [0.49, 0.6],
        [0.5, 0.74],
        [0.515, 0.79],
        [0.52, 0.815],
        [0.51, 0.83],
        [0.49, 0.825],
        [0.475, 0.79],
        [0.465, 0.62],
        [0.44, 0.44],
        [0.38, 0.33],
        [0.26, 0.3],
        [0, 0.295],
      ].map(([I, k]) => new me(I, k)),
      a = new R(new ks(r, 48), e);
    (a.scale.set(s, 1, o), i.add(a));
    let c = new R(
      new gt(0.466, 40),
      new Kn({
        color: 10476786,
        roughness: 0.04,
        metalness: 0,
        transmission: 0.35,
        transparent: !0,
        opacity: 0.82,
        clearcoat: 1,
      }),
    );
    ((c.rotation.x = -Math.PI / 2), c.scale.set(s, o, 1), (c.position.y = 0.64), i.add(c));
    let l = Ae(16777215, 0.55),
      h = bM(31);
    for (let I = 0; I < 46; I++) {
      let k = h() * Math.PI * 2,
        D = Math.sqrt(h()) * 0.42,
        L = new R(new we(0.045 + h() * 0.05, 10, 8), l);
      ((L.scale.y = 0.65),
        L.position.set(Math.cos(k) * D * s * 0.95 - 0.15, 0.655 + h() * 0.02, Math.sin(k) * D * o * 0.9),
        i.add(L));
    }
    for (let [I, k] of [
      [-0.66, 0.3],
      [0.66, 0.3],
      [-0.66, -0.3],
      [0.66, -0.3],
    ]) {
      let D = new R(new we(0.06, 12, 10), n);
      (D.position.set(I * 1.06, 0.06, k * 1.12), i.add(D));
      let L = new R(new re(0.045, 0.07, 0.2, 10), n);
      (L.position.set(I * 1.03, 0.17, k * 1.06),
        (L.rotation.z = -Math.sign(I) * 0.18),
        (L.rotation.x = Math.sign(k) * 0.18),
        i.add(L));
      for (let q = 0; q < 3; q++) {
        let $ = new R(new yt(0.018, 0.07, 6), n),
          te = Math.atan2(k, I) + (q - 1) * 0.6;
        ($.position.set(I * 1.06 + Math.cos(te) * 0.055, 0.05, k * 1.12 + Math.sin(te) * 0.055),
          $.rotation.set(Math.sin(te) * 1.2, 0, -Math.cos(te) * 1.2),
          i.add($));
      }
    }
    let f = 0.505 * s,
      d = new R(new re(0.06, 0.07, 0.06, 14), t);
    (d.position.set(f - 0.05, 0.84, 0), i.add(d));
    let u = new R(new re(0.035, 0.035, 0.22, 12), t);
    (u.position.set(f - 0.05, 0.96, 0), i.add(u));
    let p = new R(new vt(0.11, 0.025, 8, 18, Math.PI), t);
    ((p.rotation.y = Math.PI / 2),
      (p.rotation.z = 0),
      p.position.set(f - 0.16, 1.07, 0),
      p.rotation.set(0, 0, 0),
      (p.rotation.y = -Math.PI / 2 + Math.PI / 2),
      i.add(p),
      p.rotation.set(0, Math.PI, 0),
      p.position.set(f - 0.16, 1.07, 0));
    for (let I of [-0.11, 0.11]) {
      let k = new R(new re(0.015, 0.015, 0.1, 8), t);
      ((k.rotation.x = Math.PI / 2), k.position.set(f - 0.05, 0.97, I / 2), i.add(k));
      let D = new R(new re(0.04, 0.04, 0.035, 12), Ae(I < 0 ? 4163272 : 14829119, 0.3));
      (D.position.set(f - 0.05, 0.99, I), i.add(D));
    }
    let m = new R(new re(0.022, 0.022, 1, 10), t);
    (m.position.set(f - 0.05, 1.57, 0), i.add(m));
    let E = new R(new vt(0.1, 0.022, 8, 14, Math.PI / 2), t);
    (E.position.set(f - 0.15, 2.07, 0), i.add(E));
    let g = new R(new re(0.022, 0.022, 0.2, 8), t);
    ((g.rotation.z = Math.PI / 2), g.position.set(f - 0.25, 2.17, 0), i.add(g));
    let y = new R(new re(0.13, 0.09, 0.05, 20), t);
    (y.position.set(f - 0.38, 2.13, 0), i.add(y));
    let x = new J(),
      b = Ae(16765503, 0.4),
      w = new R(new we(0.1, 12, 10), b);
    (w.scale.set(1.2, 0.8, 1), x.add(w));
    let v = new R(new we(0.065, 12, 10), b);
    (v.position.set(0.08, 0.09, 0), x.add(v));
    let _ = new R(new yt(0.028, 0.06, 8), Ae(16747034, 0.4));
    ((_.rotation.z = -Math.PI / 2),
      _.position.set(0.15, 0.08, 0),
      x.add(_),
      x.position.set(0.35, 0.665, -0.12),
      (x.rotation.y = 0.6),
      i.add(x));
    let S = new X({ map: Cn(13208139, "#8a5a2b"), roughness: 0.7 });
    for (let I = 0; I < 2; I++) {
      let k = new R(new ee(0.7, 0.2 + I * 0.2, 0.3), S);
      (k.position.set(-0.1, (0.2 + I * 0.2) / 2, -0.62 - (1 - I) * 0.3), i.add(k));
    }
    let M = new R(new Te(1.2, 0.6), Ae(8374520, 0.95));
    ((M.rotation.x = -Math.PI / 2), M.position.set(-0.1, 0.005, -1.35), i.add(M));
    let T = Ae(16748472, 0.95),
      A = new R(new ee(0.42, 0.03, 0.16), T);
    (A.position.set(-0.75, 0.835, -0.43), i.add(A));
    let F = new R(new ee(0.42, 0.34, 0.03), T);
    (F.position.set(-0.75, 0.68, -0.52),
      (F.rotation.x = 0.12),
      i.add(F),
      i.traverse((I) => {
        ((I.castShadow = !0), (I.receiveShadow = !0));
      }),
      (c.castShadow = !1));
    let C = [12577279, 16766704, 14876630, 16774848].map(
        (I) =>
          new X({
            color: I,
            roughness: 0.05,
            metalness: 0.3,
            transparent: !0,
            opacity: 0.45,
            emissive: new ae(I),
            emissiveIntensity: 0.15,
            depthWrite: !1,
          }),
      ),
      P = Array.from({ length: 14 }, (I, k) => {
        let D = new R(new we(1, 14, 10), C[k % 4].clone());
        return (
          (D.castShadow = !1),
          i.add(D),
          {
            m: D,
            t: Math.random(),
            x: (Math.random() - 0.5) * 1.3,
            z: (Math.random() - 0.5) * 0.55,
            r: 0.035 + Math.random() * 0.06,
            sp: 0.12 + Math.random() * 0.12,
          }
        );
      });
    return (
      (i.userData.update = (I) => {
        for (let k of P) {
          ((k.t += I * k.sp),
            k.t > 1 && ((k.t = 0), (k.x = (Math.random() - 0.5) * 1.3), (k.z = (Math.random() - 0.5) * 0.55)));
          let D = k.t;
          (k.m.position.set(k.x + Math.sin(D * 9 + k.r * 50) * 0.1, 0.68 + D * 1.6, k.z + Math.cos(D * 7) * 0.07),
            k.m.scale.setScalar(k.r * (0.6 + D * 0.8)),
            (k.m.material.opacity = Math.min(1, D * 5) * (1 - D) * 0.6));
        }
      }),
      i
    );
  }
  function _M(i = 0.26) {
    let e = [
        [-0.5, -0.45],
        [-0.85, -0.05],
        [-0.7, 0.4],
        [-0.25, 0.5],
        [0.05, 0.2],
        [0, -0.1],
        [-0.05, 0.2],
        [0.25, 0.5],
        [0.7, 0.4],
        [0.85, -0.05],
        [0.5, -0.45],
      ].map(([a, c]) => new H(a, 0, -c)),
      t = new Xi(e),
      n = new R(new Yi(t, 60, 0.13, 8, !1), Ae(11032607, 0.45)),
      s = new R(
        new Yi(new Xi([new H(-0.5, 0, 0.45), new H(0, 0.05, 0.15), new H(0.5, 0, 0.45)]), 16, 0.12, 8, !1),
        Ae(11032607, 0.45),
      ),
      o = new J();
    (o.add(n, s), o.scale.setScalar(i / 1.9), (o.position.y = 0.03));
    let r = new J();
    return (
      r.add(o),
      r.traverse((a) => {
        a.castShadow = !0;
      }),
      r
    );
  }
  function iH() {
    let t = document.createElement("canvas");
    ((t.width = 960), (t.height = 260));
    let n = t.getContext("2d"),
      s = n.createLinearGradient(0, 0, 0, 260);
    (s.addColorStop(0, "#1f6fae"),
      s.addColorStop(1, "#124a78"),
      (n.fillStyle = s),
      n.fillRect(0, 0, 960, 260),
      (n.fillStyle = "rgba(255,255,255,.18)"),
      n.beginPath(),
      n.moveTo(0, 260));
    for (let c = 0; c <= 960; c += 10) n.lineTo(c, 226 + Math.sin(c / 38) * 10);
    (n.lineTo(960, 260),
      n.fill(),
      (n.strokeStyle = "#ffffff"),
      (n.lineWidth = 8),
      n.strokeRect(10, 10, 940, 240),
      n.save(),
      n.translate(160, 132),
      n.rotate(-0.12));
    let o = () => {
      (n.beginPath(),
        n.moveTo(-120, 0),
        n.bezierCurveTo(-80, -64, 60, -70, 112, -14),
        n.quadraticCurveTo(124, 0, 112, 14),
        n.bezierCurveTo(60, 62, -80, 56, -120, 0),
        n.closePath());
    };
    ((n.fillStyle = "#e07a52"),
      (n.strokeStyle = "#2b2b2b"),
      (n.lineWidth = 6),
      n.beginPath(),
      n.moveTo(-112, 0),
      n.lineTo(-160, -42),
      n.quadraticCurveTo(-146, 0, -160, 42),
      n.closePath(),
      n.fill(),
      n.stroke(),
      (n.fillStyle = "#c8664a"),
      n.beginPath(),
      n.moveTo(-30, -50),
      n.quadraticCurveTo(0, -84, 34, -56),
      n.closePath(),
      n.fill(),
      n.stroke(),
      n.beginPath(),
      n.moveTo(-40, 44),
      n.quadraticCurveTo(-20, 70, 6, 46),
      n.closePath(),
      n.fill(),
      n.stroke());
    let r = n.createLinearGradient(0, -60, 0, 56);
    (r.addColorStop(0, "#5c6d7a"),
      r.addColorStop(0.35, "#f08a5c"),
      r.addColorStop(0.75, "#f6b08a"),
      r.addColorStop(1, "#fde6d6"),
      o(),
      (n.fillStyle = r),
      n.fill(),
      n.save(),
      o(),
      n.clip(),
      (n.fillStyle = "rgba(40,40,50,.55)"));
    for (let c = 0; c < 26; c++)
      (n.beginPath(), n.arc(-90 + ((c * 37) % 190), -42 + ((c * 23) % 40), 3.4, 0, 7), n.fill());
    ((n.fillStyle = "rgba(255,255,255,.35)"),
      n.beginPath(),
      n.ellipse(10, -26, 70, 9, -0.05, 0, 7),
      n.fill(),
      n.restore(),
      o(),
      (n.lineWidth = 6),
      n.stroke(),
      n.beginPath(),
      n.moveTo(62, -40),
      n.quadraticCurveTo(48, 0, 62, 40),
      (n.lineWidth = 4),
      n.stroke(),
      (n.fillStyle = "#fff"),
      n.beginPath(),
      n.arc(86, -12, 11, 0, 7),
      n.fill(),
      n.stroke(),
      (n.fillStyle = "#111"),
      n.beginPath(),
      n.arc(89, -12, 5.5, 0, 7),
      n.fill(),
      n.beginPath(),
      n.moveTo(112, 8),
      n.quadraticCurveTo(100, 14, 92, 10),
      (n.lineWidth = 4),
      n.stroke(),
      n.restore(),
      (n.strokeStyle = "rgba(255,255,255,.8)"),
      (n.lineWidth = 3));
    for (let [c, l, h] of [
      [300, 60, 9],
      [318, 38, 6],
      [290, 30, 4],
    ])
      (n.beginPath(), n.arc(c, l, h, 0, 7), n.stroke());
    ((n.textAlign = "center"),
      (n.textBaseline = "middle"),
      (n.fillStyle = "#ffffff"),
      (n.font = "700 92px Mitr, sans-serif"),
      n.fillText("ปลาสดลุงทะเล", 640, 108),
      (n.fillStyle = "#ffd23f"),
      (n.font = "600 46px Mitr, sans-serif"),
      n.fillText(
        "ซีฟู้ดสด ๆ จากเรือทุกเช้า 🦐",
        640,
        186,
      ));
    let a = new ut(t);
    return ((a.colorSpace = Ye), (a.anisotropy = 4), a);
  }
  function SM() {
    let i = new J(),
      e = bM(77),
      t = Ae(9067054, 0.85, { map: Cn(9067054, "rgba(60,30,10,.45)") }),
      n = Ae(5913116, 0.8),
      s = new R(new Dc(2.1, 0.08, 0.95, 2, 0.02), t);
    ((s.position.y = 0.86), i.add(s));
    let o = new R(new ee(2.1, 0.7, 0.04), t);
    (o.position.set(0, 0.47, 0.455), i.add(o));
    for (let Y of [-1, 1])
      for (let O of [-0.43, 0.43]) {
        let U = new R(new ee(0.07, 0.86, 0.07), n);
        (U.position.set(Y, 0.43, O), i.add(U));
      }
    let r = Ae(16054008, 0.6);
    for (let Y of [-0.6, 0.55]) {
      let O = new R(new Dc(0.62, 0.32, 0.42, 2, 0.03), r);
      (O.position.set(Y, 0.17, -0.12), i.add(O));
    }
    let a = new J();
    (a.position.set(0, 0.93, 0.02), (a.rotation.x = 0.16), i.add(a));
    let c = Ae(13620956, 0.25, { metalness: 0.75 });
    a.add(new R(new ee(1.98, 0.03, 0.86), c));
    for (let [Y, O, U, W] of [
      [1.98, 0.03, 0, 0.43],
      [1.98, 0.03, 0, -0.43],
      [0.03, 0.86, 0.99, 0],
      [0.03, 0.86, -0.99, 0],
    ]) {
      let Q = new R(new ee(Y, 0.07, O), c);
      (Q.position.set(U, 0.035, W), a.add(Q));
    }
    let l = new Kn({ color: 15661055, roughness: 0.15, transmission: 0.2, thickness: 0.05, clearcoat: 1 }),
      h = new Ps(0.035, 0),
      f = new di(h, l, 420),
      d = new Oe(),
      u = new At(),
      p = new Yn(),
      m = new H(),
      E = new H();
    for (let Y = 0; Y < 420; Y++) {
      (E.set((e() - 0.5) * 1.9, 0.03 + e() * 0.03, (e() - 0.5) * 0.8),
        u.setFromEuler(p.set(e() * 3, e() * 3, e() * 3)));
      let O = 0.6 + e() * 0.9;
      (m.set(O, O * 0.7, O), f.setMatrixAt(Y, d.compose(E, u, m)));
    }
    a.add(f);
    let g = (Y) => {
        let O = document.createElement("canvas");
        ((O.width = 256), (O.height = 96));
        let U = O.getContext("2d");
        (Y(U), (U.strokeStyle = "rgba(255,255,255,.12)"), (U.lineWidth = 1));
        for (let Q = 8; Q < 90; Q += 7)
          for (let Z = Q % 14 ? 0 : 4; Z < 256; Z += 8) (U.beginPath(), U.arc(Z, Q, 4, 0.3, Math.PI - 0.3), U.stroke());
        ((U.strokeStyle = "rgba(40,40,40,.45)"),
          (U.lineWidth = 2),
          U.beginPath(),
          U.moveTo(196, 14),
          U.quadraticCurveTo(180, 48, 196, 84),
          U.stroke());
        let W = new ut(O);
        return ((W.colorSpace = Ye), W);
      },
      y = (Y, O) => {
        let U = Y.createLinearGradient(0, 0, 0, 96);
        for (let [W, Q] of O) U.addColorStop(W, Q);
        ((Y.fillStyle = U), Y.fillRect(0, 0, 256, 96));
      },
      x = {
        mackerel: {
          len: 0.26,
          depth: 0.065,
          fin: 12103792,
          tailFork: 0.9,
          dorsal: 0.3,
          tex: g((Y) => {
            (y(Y, [
              [0, "#244a55"],
              [0.32, "#3f7280"],
              [0.5, "#b9c7cc"],
              [0.75, "#e3e9ea"],
              [1, "#f6f7f5"],
            ]),
              (Y.fillStyle = "rgba(20,30,35,.75)"));
            for (let O = 0; O < 9; O++) (Y.beginPath(), Y.arc(40 + O * 17, 30, 3.2, 0, 7), Y.fill());
          }),
        },
        snapper: {
          len: 0.36,
          depth: 0.12,
          fin: 13652028,
          tailFork: 0.55,
          dorsal: 0.65,
          tex: g((Y) =>
            y(Y, [
              [0, "#b8322a"],
              [0.4, "#e0604c"],
              [0.75, "#f2a99a"],
              [1, "#fbe3dc"],
            ]),
          ),
        },
        tilapia: {
          len: 0.32,
          depth: 0.12,
          fin: 5595212,
          tailFork: 0.05,
          dorsal: 0.75,
          tex: g((Y) => {
            (y(Y, [
              [0, "#3a4234"],
              [0.45, "#7a8270"],
              [0.8, "#c9cbbb"],
              [1, "#e6e4d6"],
            ]),
              (Y.fillStyle = "rgba(30,35,28,.28)"));
            for (let O = 0; O < 8; O++) Y.fillRect(30 + O * 20, 10, 8, 62);
          }),
        },
      },
      b = (Y) => {
        let O = new we(0.5, 28, 14),
          U = O.getAttribute("position"),
          W = O.getAttribute("uv");
        for (let Q = 0; Q < U.count; Q++) {
          let Z = U.getX(Q),
            fe = U.getY(Q),
            _e = U.getZ(Q),
            ge = Z + 0.5,
            Pe =
              Math.pow(Math.sin(Math.PI * Math.min(1, 0.08 + ge * 0.98)), 0.75) *
              (ge > 0.85 ? 1 - (ge - 0.85) * 1.6 : 1) *
              (ge < 0.12 ? 0.35 + ge * 5.4 : 1);
          (U.setXYZ(Q, Z * Y.len, _e * 2 * Y.depth * 0.18 * (0.4 + Pe), fe * 2 * Y.depth * Math.max(0.12, Pe) * 0.5),
            W.setXY(Q, ge, 0.5 + fe));
        }
        return (O.computeVertexNormals(), O);
      },
      w = (Y) => {
        let O = new mn();
        O.moveTo(Y[0][0], Y[0][1]);
        for (let [U, W] of Y.slice(1)) O.lineTo(U, W);
        return new Is(O);
      },
      v = (Y) => {
        let O = x[Y],
          U = new J(),
          W = O.len,
          Q = O.depth,
          Z = new R(b(O), new X({ map: O.tex, roughness: 0.32, metalness: 0.3 }));
        ((Z.position.y = Q * 0.2), U.add(Z));
        let fe = new X({ color: O.fin, roughness: 0.5, side: Ke, transparent: !0, opacity: 0.9 }),
          _e = O.tailFork,
          ge = new R(
            w([
              [0, 0],
              [-W * 0.2, Q * 0.55],
              [-W * 0.2 + W * 0.08 * _e, 0],
              [-W * 0.2, -Q * 0.55],
            ]),
            fe,
          );
        ((ge.rotation.x = -Math.PI / 2), ge.position.set(-W * 0.47, Q * 0.2, 0), U.add(ge));
        let Pe = new R(
          w([
            [-W * 0.25, 0],
            [-W * 0.1 - W * 0.15 * O.dorsal, Q * 0.32],
            [W * 0.2, Q * 0.25],
            [W * 0.22, 0],
          ]),
          fe,
        );
        ((Pe.rotation.x = Math.PI / 2), Pe.position.set(0, Q * 0.2, Q * 0.42), U.add(Pe));
        let de = new R(
          w([
            [-W * 0.25, 0],
            [-W * 0.2, -Q * 0.2],
            [0, -Q * 0.15],
            [0, 0],
          ]),
          fe,
        );
        ((de.rotation.x = Math.PI / 2), de.position.set(0, Q * 0.2, -Q * 0.42), U.add(de));
        let Me = new R(
          w([
            [0, 0],
            [-W * 0.13, Q * 0.12],
            [-W * 0.1, -Q * 0.05],
          ]),
          fe,
        );
        ((Me.rotation.x = -Math.PI / 2), Me.position.set(W * 0.24, Q * 0.2 + Q * 0.14, Q * 0.05), U.add(Me));
        let N = new R(new gt(Q * 0.13, 14), Ae(15919824, 0.3));
        ((N.rotation.x = -Math.PI / 2), N.position.set(W * 0.38, Q * 0.2 + Q * 0.16, Q * 0.08), U.add(N));
        let he = new R(new gt(Q * 0.075, 12), Ae(657930, 0.1));
        return ((he.rotation.x = -Math.PI / 2), he.position.copy(N.position).setY(N.position.y + 0.001), U.add(he), U);
      },
      _ = (() => {
        let Y = document.createElement("canvas");
        Y.width = Y.height = 128;
        let O = Y.getContext("2d");
        ((O.fillStyle = "#f2804e"),
          O.fillRect(0, 0, 128, 128),
          (O.strokeStyle = "rgba(255,240,228,.85)"),
          (O.lineWidth = 3));
        for (let W = -2; W < 9; W++)
          (O.beginPath(), O.moveTo(0, W * 16), O.quadraticCurveTo(64, W * 16 + 26, 128, W * 16), O.stroke());
        ((O.fillStyle = "#8b9aa0"),
          O.beginPath(),
          O.ellipse(64, 64, 64, 64, 0, 0, Math.PI * 2),
          (O.lineWidth = 10),
          (O.strokeStyle = "#9aa8ad"),
          O.stroke());
        let U = new ut(Y);
        return ((U.colorSpace = Ye), U);
      })(),
      S = () => {
        let Y = new R(new re(0.075, 0.07, 0.035, 20), [
          new X({ color: 10135725, roughness: 0.4, metalness: 0.3 }),
          new X({ map: _, roughness: 0.45 }),
          new X({ map: _, roughness: 0.45 }),
        ]);
        return (Y.scale.set(1.3, 1, 0.9), Y);
      },
      M = 0;
    for (let Y = 0; Y < 4; Y++) {
      let O = v("snapper");
      (O.position.set(-0.72 + Y * 0.36, 0.06, -0.27), (O.rotation.y = (e() - 0.5) * 0.15), a.add(O), M++);
    }
    for (let Y = 0; Y < 4; Y++) {
      let O = v("tilapia");
      (O.position.set(-0.7 + Y * 0.33, 0.06, -0.02), (O.rotation.y = Math.PI + (e() - 0.5) * 0.15), a.add(O), M++);
    }
    for (let Y = 0; Y < 6; Y++) {
      let O = v("mackerel");
      (O.position.set(-0.8 + Y * 0.17, 0.06, 0.22), (O.rotation.y = -Math.PI / 2 + (e() - 0.5) * 0.12), a.add(O), M++);
    }
    for (let Y = 0; Y < 5; Y++) {
      let O = S();
      (O.position.set(0.55 + (Y % 3) * 0.16, 0.075 + Math.floor(Y / 3) * 0.035, 0.18 + (Y % 2) * 0.03),
        (O.rotation.y = Y),
        a.add(O));
    }
    let T = new X({ color: 15764058, roughness: 0.45 }),
      A = new X({ color: 14178864, roughness: 0.45 }),
      F = () => {
        let Y = new J();
        for (let U = 0; U < 6; U++) {
          let W = -0.4 + U * 0.42,
            Q = 0.045,
            Z = new R(new we(0.02 - U * 0.0018, 10, 8), U % 2 ? A : T);
          (Z.scale.set(1.3, 0.9, 1), Z.position.set(Math.cos(W) * Q, 0, Math.sin(W) * Q), Y.add(Z));
        }
        let O = new R(
          w([
            [0, 0],
            [0.025, 0.02],
            [0.03, -0.005],
            [0.022, -0.022],
          ]),
          new X({ color: 13650472, side: Ke }),
        );
        ((O.rotation.x = -Math.PI / 2), O.position.set(Math.cos(1.7) * 0.045, 0, Math.sin(1.7) * 0.045), Y.add(O));
        for (let U of [-1, 1]) {
          let W = new R(new re(0.0015, 0.0015, 0.09, 4), A);
          ((W.rotation.z = Math.PI / 2), (W.rotation.y = U * 0.3 + 0.9), W.position.set(0.05, 0, -0.04), Y.add(W));
        }
        return Y;
      };
    for (let Y = 0; Y < 6; Y++) {
      let O = F();
      (O.position.set(0.12 + (Y % 3) * 0.1, 0.075, 0.31 + Math.floor(Y / 3) * 0.06),
        (O.rotation.y = e() * 6),
        a.add(O));
    }
    let C = Ae(16181482, 0.4);
    for (let Y = 0; Y < 3; Y++) {
      let O = new R(new Ri(0.035, 0.16, 4, 8), C);
      (O.rotation.set(0, 0, Math.PI / 2),
        (O.rotation.y = 0.3 * Y),
        O.position.set(-0.75 + Y * 0.07, 0.08, 0.3),
        a.add(O));
    }
    for (let Y = 0; Y < 4; Y++) {
      let O = new R(new Te(0.12, 0.08), Ae(16777215, 0.6));
      (O.position.set(-0.7 + Y * 0.47, 0.12, 0.38), (O.rotation.x = -0.4), a.add(O));
      let U = new R(new re(0.004, 0.004, 0.08, 4), n);
      (U.position.set(-0.7 + Y * 0.47, 0.07, 0.385), a.add(U));
    }
    let P = (() => {
      let Y = document.createElement("canvas");
      ((Y.width = 256), (Y.height = 64));
      let O = Y.getContext("2d");
      for (let W = 0; W < 8; W++) ((O.fillStyle = W % 2 ? "#ffffff" : "#2f86c8"), O.fillRect(W * 32, 0, 32, 64));
      let U = new ut(Y);
      return ((U.colorSpace = Ye), U);
    })();
    for (let Y of [-1.08, 1.08])
      for (let O of [-0.48, 0.48]) {
        let U = new R(new re(0.03, 0.03, O < 0 ? 2.25 : 2, 8), Ae(10134442, 0.4, { metalness: 0.6 }));
        (U.position.set(Y, (O < 0 ? 2.25 : 2) / 2, O), i.add(U));
      }
    let I = new R(new Te(2.36, 1.12, 8, 2), new X({ map: P, roughness: 0.9, side: Ke }));
    ((I.rotation.x = -Math.PI / 2 + 0.22), I.position.set(0, 2.14, 0), i.add(I));
    let k = new R(new Te(2.36, 0.16), new X({ map: P, roughness: 0.9, side: Ke }));
    (k.position.set(0, 1.94, 0.6), i.add(k));
    let D = new R(new ee(2, 0.6, 0.05), n);
    (D.position.set(0, 1.62, 0.5), i.add(D));
    let L = new R(new Te(1.92, 0.52), new X({ map: iH(), roughness: 0.55 }));
    (L.position.set(0, 1.62, 0.526), i.add(L));
    for (let Y of [-0.85, 0.85]) {
      let O = new R(new re(0.008, 0.008, 0.26, 4), Ae(10134442, 0.4, { metalness: 0.6 }));
      (O.position.set(Y, 2.02, 0.5), i.add(O));
    }
    let q = new J();
    (q.position.set(-0.8, 0.9, -0.35), i.add(q));
    {
      let Y = new R(new ee(0.22, 0.2, 0.18), Ae(14240314, 0.5));
      ((Y.position.y = 0.1), q.add(Y));
    }
    let $ = new R(new re(0.14, 0.11, 0.03, 16), c);
    (($.position.y = 0.22), q.add($));
    let te = new R(new gt(0.07, 16), Ae(16777215, 0.4));
    return (te.position.set(0, 0.11, 0.091), q.add(te), Lo(i), i);
  }
  function Cp(i, e, t = 512, n = 256, s = 16) {
    let o = document.createElement("canvas");
    ((o.width = t), (o.height = n));
    let r = o.getContext("2d");
    ((r.fillStyle = i), r.fillRect(0, 0, t, n));
    let a = n / s;
    for (let l = 0; l < s; l++) {
      ((r.fillStyle = `rgba(0,0,0,${0.04 + Math.random() * 0.08})`),
        r.fillRect(0, l * a, t, a),
        (r.fillStyle = e),
        r.fillRect(0, l * a, t, 1.5));
      for (let h = (l % 2) * 90; h < t; h += 180 + Math.random() * 60) r.fillRect(h, l * a, 1.5, a);
      for (let h = 0; h < 18; h++)
        ((r.fillStyle = `rgba(255,255,255,${Math.random() * 0.05})`),
          r.fillRect(Math.random() * t, l * a + Math.random() * a, 30 + Math.random() * 80, 1));
    }
    let c = new ut(o);
    return ((c.colorSpace = Ye), (c.wrapS = c.wrapT = gn), (c.anisotropy = 4), c);
  }
  function HM(i) {
    let e = new J(),
      t = 18,
      n = 48,
      s = 18,
      o = (O) =>
        O > 0.82
          ? 2.5 * Math.pow(Math.max(0, (1 - O) / 0.18), 0.75)
          : 2.5 * (0.8 + 0.2 * Math.sin(Math.min(1, O / 0.82) * Math.PI * 0.5 + 0.2)) * (O < 0.06 ? 0.86 : 1),
      r = (O) => 2 + Math.pow(O - 0.45, 2) * 2.6 + (O > 0.9 ? (O - 0.9) * 4 : 0),
      a = (O) => -1.6 + Math.pow(O, 3) * 1.2,
      c = [],
      l = [],
      h = [],
      f = [],
      d = new ae(11743787),
      u = new ae(16051938),
      p = new ae(1, 1, 1),
      m = new ae(2759184);
    for (let O = 0; O <= n; O++) {
      let U = O / n,
        W = -t / 2 + U * t,
        Q = o(U),
        Z = r(U),
        fe = a(U);
      for (let _e = 0; _e <= s; _e++) {
        let ge = _e / s,
          Pe = ge * Math.PI,
          de = Math.sin(Pe),
          Me = Math.cos(Pe) * Q * (1 - 0.3 * de * de),
          N = Z - (Z - fe) * Math.pow(de, 0.85);
        (c.push(W, N, Me), l.push(U * 6, ge * 2));
        let he = N < -0.25 ? m : N < 0.25 ? d : N > Z - 0.35 ? u : p;
        h.push(he.r, he.g, he.b);
      }
    }
    for (let O = 0; O < n; O++)
      for (let U = 0; U < s; U++) {
        let W = O * (s + 1) + U,
          Q = W + s + 1;
        f.push(W, Q, W + 1, Q, Q + 1, W + 1);
      }
    let E = new qe();
    (E.setAttribute("position", new Fe(c, 3)),
      E.setAttribute("uv", new Fe(l, 2)),
      E.setAttribute("color", new Fe(h, 3)),
      E.setIndex(f),
      E.computeVertexNormals());
    let g = new X({ map: Cp("#6b3f1f", "rgba(30,15,5,.6)"), vertexColors: !0, roughness: 0.75, side: Ke });
    e.add(new R(E, g));
    {
      let U = o(0) * 1,
        W = r(0) + 1.1,
        Q = a(0) + 0.6,
        Z = new mn();
      (Z.moveTo(-U, W),
        Z.lineTo(U, W),
        Z.quadraticCurveTo(U * 0.95, Q + 0.4, 0, Q),
        Z.quadraticCurveTo(-U * 0.95, Q + 0.4, -U, W));
      let fe = new R(new Is(Z), new X({ map: Cp("#5a3218", "rgba(20,10,0,.6)"), roughness: 0.8, side: Ke }));
      ((fe.rotation.y = -Math.PI / 2), (fe.position.x = -t / 2 + 0.02), e.add(fe));
      let _e = new X({ color: 16771496, emissive: 16762976, emissiveIntensity: 0.4, roughness: 0.3 });
      for (let ge of [-1.2, 0, 1.2]) {
        let Pe = new R(new Te(0.7, 0.6), _e);
        ((Pe.rotation.y = -Math.PI / 2), Pe.position.set(-t / 2 - 0.01, W - 0.8, ge), e.add(Pe));
      }
    }
    let y = new X({ map: Cp("#c4925a", "rgba(90,50,20,.55)", 512, 256, 24), roughness: 0.8 });
    for (let O = 0; O < n; O++) {
      let U = O / n,
        W = (O + 1) / n,
        Q = -t / 2 + U * t,
        Z = -t / 2 + W * t,
        fe = o(U) * 0.98,
        _e = o(W) * 0.98;
      if (fe < 0.05 && _e < 0.05) continue;
      let ge = new qe(),
        Pe = r(U) - 0.25,
        de = r(W) - 0.25;
      (ge.setAttribute("position", new Fe([Q, Pe, -fe, Z, de, -_e, Z, de, _e, Q, Pe, fe], 3)),
        ge.setAttribute("uv", new Fe([U * 4, 0, W * 4, 0, W * 4, 1, U * 4, 1], 2)),
        ge.setIndex([0, 2, 1, 0, 3, 2]),
        ge.computeVertexNormals(),
        e.add(new R(ge, y)));
    }
    let x = new X({ color: 4860436, roughness: 0.7 }),
      b = (O) =>
        Array.from({ length: n + 1 }, (U, W) => {
          let Q = W / n;
          return new H(-t / 2 + Q * t, r(Q) + 0.55, O * o(Q) * 0.97);
        });
    for (let O of [-1, 1]) {
      let U = b(O),
        W = (fe) => !!i && i.side === O && Math.abs(fe - i.x) < i.w / 2,
        Q = [],
        Z = [];
      for (let fe of U) W(fe.x) ? (Z.length > 1 && Q.push(Z), (Z = [])) : Z.push(fe);
      Z.length > 1 && Q.push(Z);
      for (let fe of Q) e.add(new R(new Yi(new Xi(fe), Math.max(4, fe.length * 2), 0.06, 6), x));
      for (let fe = 2; fe < n - 2; fe += 3) {
        let _e = U[fe];
        if (W(_e.x)) continue;
        let ge = new R(new re(0.04, 0.04, 0.6, 5), x);
        (ge.position.set(_e.x, _e.y - 0.3, _e.z), e.add(ge));
      }
      if (i && i.side === O)
        for (let fe of [-i.w / 2, i.w / 2]) {
          let _e = (i.x + fe + t / 2) / t,
            ge = new R(new re(0.08, 0.08, 1, 8), x);
          (ge.position.set(i.x + fe, r(_e) + 0.3, O * o(_e) * 0.97), e.add(ge));
        }
    }
    if (i) {
      let O = (i.x + t / 2) / t,
        U = o(O),
        W = new X({ color: 11039807, roughness: 0.8 });
      for (let Q = 0; Q < 2; Q++) {
        let Z = new R(new ee(i.w - 0.1, 0.12, 0.35), W);
        (Z.position.set(i.x, r(O) - 0.08 - Q * 0.12, i.side * (U * 0.93 - 0.2 - Q * 0.32)), e.add(Z));
      }
    }
    {
      let O = new J();
      O.position.set(-t / 2 + 2.4, r(0.13) - 0.25, 0);
      let U = new X({ map: Cp("#f1e3c6", "rgba(120,90,50,.35)"), roughness: 0.85 }),
        W = new R(new ee(3.2, 1.7, 3.6), U);
      ((W.position.y = 0.85), O.add(W));
      let Q = new R(new ee(3.5, 0.18, 3.9), x);
      ((Q.position.y = 1.78), O.add(Q));
      let Z = new X({ color: 10410224, emissive: 16767104, emissiveIntensity: 0.15, roughness: 0.2 });
      for (let ge of [-1.81, 1.81])
        for (let Pe of [-0.8, 0.6]) {
          let de = new R(new gt(0.26, 16), Z);
          (de.position.set(Pe, 1, ge), (de.rotation.y = ge < 0 ? Math.PI : 0), O.add(de));
        }
      let fe = new R(new Te(0.8, 1.3), new X({ color: 7028511 }));
      (fe.position.set(1.61, 0.65, 0), (fe.rotation.y = Math.PI / 2), O.add(fe));
      let _e = new R(new vt(0.42, 0.04, 6, 18), x);
      (_e.position.set(0.2, 2.5, 0), (_e.rotation.y = Math.PI / 2), O.add(_e));
      for (let ge = 0; ge < 8; ge++) {
        let Pe = new R(new re(0.02, 0.02, 1, 4), x);
        (Pe.position.set(0.2, 2.5, 0), (Pe.rotation.x = (ge / 8) * Math.PI), O.add(Pe));
      }
      e.add(O);
    }
    let w = new X({ color: 5913118, roughness: 0.7 }),
      v = new X({ color: 16512228, roughness: 0.95, side: Ke }),
      _ = new H(),
      S = [],
      M = [],
      T = (O, U, W, Q = !1) => {
        let Z = Q ? new qe() : new Te(O, U, 10, 8);
        if (Q) {
          let ge = [],
            Pe = [];
          for (let he = 0; he <= 10; he++)
            for (let le = 0; le <= he; le++) {
              let ve = 1 - he / 10,
                He = he ? le / he : 0;
              ge.push((He - 0.5) * O * (he / 10), ve * U - U / 2, 0);
            }
          let Me = 0,
            N = [];
          for (let he = 0; he <= 10; he++) (N.push(Me), (Me += he + 1));
          for (let he = 0; he < 10; he++)
            for (let le = 0; le <= he; le++) {
              let ve = N[he] + le,
                He = N[he + 1] + le;
              (Pe.push(ve, He, He + 1), le < he && Pe.push(ve, He + 1, ve + 1));
            }
          (Z.setAttribute("position", new Fe(ge, 3)), Z.setIndex(Pe));
        }
        let fe = Z.getAttribute("position");
        for (let ge = 0; ge < fe.count; ge++) {
          let Pe = fe.getX(ge) / O + 0.5,
            de = fe.getY(ge) / U + 0.5;
          fe.setZ(ge, Math.sin(Pe * Math.PI) * Math.sin(Math.min(1, de * 1.1) * Math.PI * 0.9 + 0.15) * W);
        }
        Z.computeVertexNormals();
        let _e = new R(Z, v);
        return (
          (_e.userData.noMerge = !0),
          M.push({ m: _e, base: Float32Array.from(fe.array), ph: Math.random() * 6 }),
          _e
        );
      },
      A = [
        [-t / 2 + 5.2, 12],
        [0.6, 14.5],
        [t / 2 - 4.6, 11],
      ];
    for (let [O, U] of A) {
      let W = (O + t / 2) / t,
        Q = r(W) - 0.25,
        Z = new R(new re(0.13, 0.22, U, 10), w);
      (Z.position.set(O, Q + U / 2, 0), e.add(Z));
      let fe = new R(new re(0.55, 0.45, 0.35, 12, 1, !0), w);
      (fe.position.set(O, Q + U * 0.78, 0), e.add(fe));
      let _e = [
        [0.32, 4.2, 3],
        [0.58, 3.5, 2.5],
        [0.86, 2.6, 1.8],
      ];
      for (let [de, Me, N] of _e) {
        let he = Q + U * de,
          le = new R(new re(0.07, 0.07, Me + 0.8, 6), w);
        ((le.rotation.x = Math.PI / 2), le.position.set(O + 0.25, he + N / 2, 0), e.add(le));
        let ve = T(Me, N, 0.55);
        ((ve.rotation.y = Math.PI / 2),
          ve.position.set(O + 0.3, he, 0),
          e.add(ve),
          S.push(
            O + 0.25,
            he + N / 2,
            -(Me / 2 + 0.3),
            O - 1.2,
            r(Math.max(0, W - 0.07)),
            -o(Math.max(0, W - 0.07)) * 0.95,
          ),
          S.push(
            O + 0.25,
            he + N / 2,
            Me / 2 + 0.3,
            O - 1.2,
            r(Math.max(0, W - 0.07)),
            o(Math.max(0, W - 0.07)) * 0.95,
          ));
      }
      _.set(O, Q + U, 0);
      let ge = new Te(1.4, 0.55, 8, 1);
      ge.translate(0.7, 0, 0);
      let Pe = new R(ge, new X({ color: O > 0 ? 16740241 : 16765503, side: Ke, roughness: 0.9 }));
      (Pe.position.set(O, Q + U + 0.3, 0),
        e.add(Pe),
        (Pe.userData.noMerge = !0),
        M.push({ m: Pe, base: Float32Array.from(ge.getAttribute("position").array), ph: -1 }));
      for (let de of [-1, 1])
        for (let Me of [-1.6, 0, 1.4]) {
          let N = Math.min(1, Math.max(0, W + Me / t));
          S.push(O, Q + U * 0.76, 0, O + Me, r(N) + 0.5, de * o(N) * 0.96);
        }
    }
    let F = new H(t / 2 + 4.2, r(1) + 1.6, 0),
      C = new R(new re(0.08, 0.13, 5.4, 8), w);
    (C.position.set(t / 2 + 1.5, r(1) + 0.6, 0), (C.rotation.z = -Math.PI / 2 + 0.38), e.add(C));
    let P = T(3.6, 6.2, 0.45, !0);
    ((P.rotation.y = Math.PI / 2),
      (P.rotation.x = 0),
      P.position.set(t / 2 + 0.6, r(1) + 4.6, 0),
      (P.rotation.z = -0.42),
      e.add(P),
      S.push(A[2][0], r(0.75) + A[2][1] * 0.95, 0, F.x, F.y, 0),
      S.push(A[1][0], r(0.5) + A[1][1], 0, A[2][0], r(0.75) + A[2][1], 0),
      S.push(A[0][0], r(0.3) + A[0][1], 0, A[1][0], r(0.5) + A[1][1] * 0.95, 0));
    let I = new qe();
    (I.setAttribute("position", new Fe(S, 3)), e.add(new Li(I, new Zn({ color: 3811866 }))));
    let k = new R(new we(0.22, 10, 8), new be({ color: 16769162 }));
    (k.position.set(-t / 2 - 0.2, r(0) + 1.6, 0), e.add(k));
    let D = new R(new we(0.45, 12, 10), new X({ color: 14252334, roughness: 0.8 }));
    (D.position.set(t / 2 + 0.3, r(1) + 0.2, 0),
      e.add(D),
      e.traverse((O) => {
        O.isMesh && ((O.castShadow = !0), (O.receiveShadow = !0));
      }),
      e.scale.setScalar(0.9));
    let L = (O, U) => {
        let W = (O + t / 2) / t;
        if (W < 0.03 || W > 0.93) return null;
        let Q = o(W) * 0.86;
        return Math.abs(U) > Q ? null : r(W) - 0.25;
      },
      q = { baseY: -0.55, amp: 1 },
      $ = new Float32Array(0),
      te = (O) => {
        ((e.rotation.z = Math.sin(O * 0.7) * 0.025 * q.amp),
          (e.rotation.x = Math.sin(O * 0.55 + 1) * 0.02 * q.amp),
          (e.position.y = q.baseY + Math.sin(O * 0.9) * 0.12 * q.amp));
        for (let U of M) {
          let W = U.m.geometry.getAttribute("position"),
            Q = W.array;
          if (U.ph < 0)
            for (let Z = 0; Z < W.count; Z++) {
              let fe = U.base[Z * 3];
              Q[Z * 3 + 2] = Math.sin(fe * 3 - O * 6) * 0.12 * fe;
            }
          else
            for (let Z = 0; Z < W.count; Z++) Q[Z * 3 + 2] = U.base[Z * 3 + 2] * (1 + Math.sin(O * 1.3 + U.ph) * 0.12);
          W.needsUpdate = !0;
        }
      },
      Y = [{ x: -t / 2 + 2.4, z: 0, hw: 1.8, hd: 2 }, ...A.map(([O]) => ({ x: O, z: 0, hw: 0.28, hd: 0.28 }))];
    return { ship: e, update: te, deckLocal: L, moor: q, halfW: o, deckY: r, L: t, obstacles: Y };
  }
  var Bc = (i, e, t) => {
      let n = Math.max(0, Math.min(1, (t - i) / (e - i)));
      return n * n * (3 - 2 * n);
    },
    Fh = null;
  function E3(i) {
    if (Fh) return Fh;
    Fh = i.createBuffer(1, i.sampleRate * 3, i.sampleRate);
    let e = Fh.getChannelData(0),
      t = 0;
    for (let n = 0; n < e.length; n++) {
      let s = Math.random() * 2 - 1;
      ((t = (t + 0.02 * s) / 1.02), (e[n] = s * 0.5 + t * 3));
    }
    return Fh;
  }
  function kp(i, e = 1) {
    if (!i) return;
    let t = i.currentTime + 0.01,
      n = e > 0.6,
      s = Math.min(1.2, e),
      o = i.createGain();
    o.gain.value = 0.9;
    let r = i.createDynamicsCompressor();
    ((r.threshold.value = -14), (r.ratio.value = 3), o.connect(r).connect(i.destination));
    let a = (h, f, d, u, p) => {
        (h.gain.setValueAtTime(1e-4, f),
          h.gain.exponentialRampToValueAtTime(Math.max(2e-4, d), f + u),
          h.gain.exponentialRampToValueAtTime(1e-4, f + u + p));
      },
      c = (h = 1) => {
        let f = i.createBufferSource();
        return ((f.buffer = E3(i)), (f.playbackRate.value = h), f);
      };
    {
      let h = c(0.6 + Math.random() * 0.2),
        f = i.createBiquadFilter();
      ((f.type = "lowpass"),
        f.frequency.setValueAtTime(n ? 700 : 1400, t),
        f.frequency.exponentialRampToValueAtTime(n ? 140 : 300, t + (n ? 0.25 : 0.1)),
        (f.Q.value = 1.4));
      let d = i.createGain();
      (a(d, t, (n ? 0.95 : 0.3) * s, 0.006, n ? 0.32 : 0.12),
        h.connect(f).connect(d).connect(o),
        h.start(t, Math.random() * 2),
        h.stop(t + 0.6));
    }
    {
      let h = c(1),
        f = i.createBiquadFilter();
      ((f.type = "bandpass"),
        (f.Q.value = 0.6),
        f.frequency.setValueAtTime(n ? 2600 : 3600, t + 0.01),
        f.frequency.exponentialRampToValueAtTime(n ? 700 : 1300, t + (n ? 0.55 : 0.2)));
      let d = i.createBiquadFilter();
      ((d.type = "highshelf"), (d.frequency.value = 5e3), (d.gain.value = -6));
      let u = i.createGain();
      (a(u, t + 0.01, (n ? 0.55 : 0.16) * s, 0.02, n ? 0.6 : 0.18),
        h.connect(f).connect(d).connect(u).connect(o),
        h.start(t, Math.random() * 2),
        h.stop(t + 1));
    }
    if (n) {
      let h = c(0.8),
        f = i.createBiquadFilter();
      ((f.type = "bandpass"), (f.Q.value = 1.1), (f.frequency.value = 900));
      let d = i.createOscillator();
      d.frequency.value = 9 + Math.random() * 5;
      let u = i.createGain();
      ((u.gain.value = 400), d.connect(u).connect(f.frequency));
      let p = i.createGain();
      (a(p, t + 0.08, 0.2 * s, 0.08, 0.9),
        h.connect(f).connect(p).connect(o),
        h.start(t, Math.random() * 2),
        h.stop(t + 1.4),
        d.start(t),
        d.stop(t + 1.4));
    }
    let l = n ? 10 : 2;
    for (let h = 0; h < l; h++) {
      let f = t + (n ? 0.25 : 0.08) + Math.random() * (n ? 0.7 : 0.2),
        d = c(1.2 + Math.random()),
        u = i.createBiquadFilter();
      ((u.type = "bandpass"), (u.Q.value = 2.5), (u.frequency.value = 1800 + Math.random() * 3e3));
      let p = i.createGain();
      (a(p, f, (0.02 + Math.random() * 0.04) * s, 0.003, 0.04 + Math.random() * 0.05),
        d.connect(u).connect(p).connect(o),
        d.start(f, Math.random() * 2),
        d.stop(f + 0.15));
    }
  }
  function rH(i, e, t, n) {
    let s = i.currentTime + e,
      o = i.createBufferSource();
    ((o.buffer = E3(i)), (o.playbackRate.value = 0.5));
    let r = i.createBiquadFilter();
    ((r.type = "lowpass"),
      r.frequency.setValueAtTime(n ? 260 : 900, s),
      r.frequency.exponentialRampToValueAtTime(90, s + 3));
    let a = i.createGain();
    (a.gain.setValueAtTime(1e-4, s),
      a.gain.exponentialRampToValueAtTime(0.9 * t * (n ? 0.5 : 1), s + 0.06),
      a.gain.exponentialRampToValueAtTime(0.35 * t, s + 0.6),
      a.gain.linearRampToValueAtTime(0.45 * t * (n ? 0.5 : 1), s + 1.1),
      a.gain.exponentialRampToValueAtTime(1e-4, s + 4.2),
      o.connect(r).connect(a).connect(i.destination),
      o.start(s),
      o.stop(s + 4.3));
  }
  function AM(i) {
    let e = { rain: !1, t0: 0.42, t1: 0.58, light: 0 };
    function t(g, y = Math.random()) {
      ((e.rain = g),
        (e.t0 = 0.3 + y * 0.2),
        (e.t1 = e.t0 + 0.12 + ((y * 7.31) % 1) * 0.08),
        (e.light = g ? 0 : ((y * 3.7) % 1) * 0.25));
    }
    function n(g) {
      if (!e.rain) return { o: e.light, r: 0, rb: 0, flash: 0 };
      let { t0: y, t1: x } = e,
        b = Bc(y - 0.07, y + 0.005, g) * (1 - Bc(x - 0.005, x + 0.035, g)),
        w = Bc(y - 0.004, y + 0.02, g) * (1 - Bc(x - 0.025, x, g)),
        _ = (g > 0.27 && g < 0.74 ? 1 : 0) * Bc(x - 0.004, x + 0.012, g) * (1 - Bc(x + 0.06, x + 0.1, g));
      return { o: b, r: w, rb: _, flash: 0 };
    }
    let s = new Qt({
        transparent: !0,
        depthWrite: !1,
        fog: !1,
        blending: $i,
        side: Ke,
        uniforms: { uA: { value: 0 } },
        vertexShader:
          "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
        fragmentShader: `uniform float uA; varying vec2 vUv;
      vec3 hue(float h){ return clamp(abs(mod(h*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0); }
      void main(){
        float r = vUv.y;                      // 0 = ขอบใน, 1 = ขอบนอก
        vec3 c = hue(0.78 - r * 0.78);        // ม่วง→แดง จากในออกนอก
        float band = smoothstep(0.0, 0.18, r) * smoothstep(1.0, 0.82, r);
        float ends = smoothstep(0.0, 0.18, vUv.x) * smoothstep(1.0, 0.82, vUv.x);   // ปลายรุ้งจางลงใกล้พื้น
        gl_FragColor = vec4(c * band * ends * uA * 0.7, 1.0); }`,
      }),
      o = new rr(150, 168, 96, 1, 0, Math.PI);
    {
      let g = o.attributes.position,
        y = o.attributes.uv;
      for (let x = 0; x < g.count; x++) {
        let b = g.getX(x),
          w = g.getY(x);
        y.setXY(x, Math.atan2(w, b) / Math.PI, (Math.hypot(b, w) - 150) / 18);
      }
    }
    let r = new R(o, s);
    ((r.frustumCulled = !1), (r.renderOrder = -1), (r.visible = !1), i.add(r));
    let a = null,
      c = null;
    function l(g) {
      if (a) return;
      let y = g.createBufferSource();
      ((y.buffer = E3(g)), (y.loop = !0));
      let x = g.createBiquadFilter();
      ((x.type = "highpass"),
        (x.frequency.value = 700),
        (c = g.createBiquadFilter()),
        (c.type = "lowpass"),
        (c.frequency.value = 6e3),
        (a = g.createGain()),
        (a.gain.value = 0),
        y.connect(x).connect(c).connect(a).connect(g.destination),
        y.start());
    }
    let h = document.getElementById("flash"),
      f = document.querySelector(".rain"),
      d = 3,
      u = 0,
      p = [],
      m = { o: 0, r: 0, rb: 0, flash: 0 };
    function E(g, y, x, b, w, v) {
      let _ = n(y),
        S = Math.min(1, g * 0.8);
      if (
        ((m.o += (_.o - m.o) * S),
        (m.r += (_.r - m.r) * S),
        (m.rb += (_.rb - m.rb) * S),
        document.body.classList.toggle("raining", m.r > 0.25),
        f &&
          ((f.style.opacity = w ? "0" : String(Math.min(1, m.r * 1.15))),
          (f.style.display = m.r > 0.02 && !w ? "block" : "none"),
          f.style.setProperty("--rs", m.r > 0.7 ? "0.32s" : "0.45s")),
        m.o > 0.55 && ((d -= g), d < 0))
      ) {
        d = 5 + Math.random() * 9;
        let M = 0.6 + Math.random() * 0.4;
        ((p = [0, 0.09 + Math.random() * 0.05, 0.25 + Math.random() * 0.1].slice(0, 2 + (Math.random() < 0.5 ? 1 : 0))),
          v && rH(v, 0.35 + Math.random() * 1.2, M * Math.min(1, m.o), w));
      }
      if (p.length) {
        for (let M = 0; M < p.length; M++) p[M] -= g;
        p[0] <= 0 && ((u = w ? 0.35 : 1), p.shift());
      }
      if (((u = Math.max(0, u - g * 7)), (m.flash = u), h && (h.style.opacity = String(u * (w ? 0.25 : 0.7))), v)) {
        l(v);
        let M = w ? m.r * 0.035 : m.r * 0.11;
        (a.gain.setTargetAtTime(M, v.currentTime, 0.5),
          c.frequency.setTargetAtTime(w ? 1400 : 6e3, v.currentTime, 0.3));
      }
      if (((r.visible = m.rb > 0.01 && !w), r.visible)) {
        let M = -b.x,
          T = -b.z,
          A = Math.hypot(M, T) || 1;
        (r.position.set(x.position.x + (M / A) * 260, -38, x.position.z + (T / A) * 260),
          r.lookAt(x.position.x, -38, x.position.z),
          (s.uniforms.uA.value = m.rb));
      }
      return m;
    }
    return { schedule: t, levels: n, update: E, cur: m, plan: e };
  }
  var Us = [
      { name: "ฤดูร้อน", icon: "☀️", rain: 0.05 },
      { name: "ฤดูฝน", icon: "🌧", rain: 0.6 },
      { name: "ฤดูหนาว", icon: "❄️", rain: 0.05 },
    ],
    PM = 5,
    IM = [
      {
        id: "melon",
        name: "แตงโม",
        icon: "🍉",
        season: 0,
        days: 4,
        seed: 30,
        sell: 90,
        color: 4103738,
        shape: "big",
      },
      {
        id: "corn",
        name: "ข้าวโพด",
        icon: "🌽",
        season: 0,
        days: 3,
        seed: 20,
        sell: 55,
        color: 16765503,
        shape: "corn",
      },
      {
        id: "tomato",
        name: "มะเขือเทศ",
        icon: "🍅",
        season: 0,
        days: 2,
        seed: 15,
        sell: 35,
        color: 14829119,
        shape: "berry",
      },
      {
        id: "morning",
        name: "ผักบุ้ง",
        icon: "🥬",
        season: 1,
        days: 2,
        seed: 10,
        sell: 28,
        color: 5221946,
        shape: "leafy",
      },
      {
        id: "pumpkin",
        name: "ฟักทอง",
        icon: "🎃",
        season: 1,
        days: 4,
        seed: 30,
        sell: 95,
        color: 15895592,
        shape: "big",
      },
      {
        id: "straw",
        name: "สตรอว์เบอร์รี",
        icon: "🍓",
        season: 2,
        days: 3,
        seed: 25,
        sell: 70,
        color: 16727386,
        shape: "berry",
      },
      {
        id: "cabbage",
        name: "กะหล่ำ",
        icon: "🥬",
        season: 2,
        days: 3,
        seed: 20,
        sell: 60,
        color: 10215773,
        shape: "ball",
      },
    ],
    es = [
      {
        name: "พี่มิ้นท์",
        face: "👩‍💼",
        like: "fish:tilapia",
        lines: [
          "ทำงานแคชเชียร์เหนื่อยแต่เห็นน้องแล้วหายเหนื่อย 💕",
          "วันนี้ร้านลูกค้าเยอะมาก",
          "ข้าวต้มขนฟูกว่าเมื่อวานอีกนะ",
          "ถ้าได้ปลานิลมาฝากจะดีใจมาก 🐟",
        ],
      },
      {
        name: "ลุงเสก",
        face: "🎩",
        like: "bug:beetle",
        lines: [
          "ดูนี่! ลุงเสกเหรียญหายได้นะ… อ้าว หายจริง",
          "หมวกม่วงใบนี้ใส่มา 30 ปีแล้ว",
          "เคยเห็นด้วงกว่างตัวใหญ่ในป่าไหม",
          "มายากลที่ดีที่สุดคือรอยยิ้มของน้องหมา",
        ],
      },
      {
        name: "เจ๊ดาว",
        face: "💃",
        like: "bug:butterfly",
        lines: [
          "คืนนี้มีโชว์ที่ลานน้ำพุ มาดูนะจ๊ะ ✨",
          "ชุดนี้เย็บเองทั้งตัวเลย",
          "ผีเสื้อสวย ๆ เอามาให้เจ๊ได้ไหม",
          "เต้นกับเจ๊หน่อยไหมข้าวต้ม",
        ],
      },
      {
        name: "พี่ต้น",
        face: "😎",
        like: "fish:catfish",
        lines: [
          "ร้อนจัด! ไปลงทะเลกันป่ะ 🏖",
          "พี่ชอบเตะบอลชายหาดที่สุด",
          "ไก่ย่างป้าแจ๋วอร่อยสุดในเมือง",
          "ปลาดุกย่างนี่ของโปรดเลย",
        ],
      },
      {
        name: "ยามบุญชัย",
        face: "👮",
        like: "egg",
        lines: [
          "ข้ามถนนระวังรถด้วยนะ 🚗",
          "ลุงเฝ้าเมืองนี้มาสิบปีแล้ว",
          "ตอนกลางคืนอย่าเดินไกลบ้าน",
          "มีไข่ไก่สด ๆ ไหม ลุงชอบไข่ต้ม 🥚",
        ],
      },
      {
        name: "น้องแพร",
        face: "👧",
        like: "bug:ladybug",
        lines: [
          "ลูก ๆ ของข้าวต้มน่ารักมาก!",
          "แพรอยากเลี้ยงเชาเชาบ้างจัง",
          "เต่าทองจุดดำ ๆ น่ารักเนอะ 🐞",
          "ไปสนามฝึกด้วยกันไหม",
        ],
      },
      {
        name: "ลุงหมึก",
        face: "👴",
        like: "fish:carp",
        lines: [
          "สมัยลุงหนุ่ม ๆ เมืองนี้ยังเป็นทุ่งนาอยู่เลย",
          "ตกปลาที่บ่อนี่ได้ปลาตะเพียนตัวโต",
          "ฝนตกแบบนี้ปวดเข่าจริง",
          "ชามน้ำมีทุกมุมเมืองนะ อย่าให้น้องกระหาย",
        ],
      },
      {
        name: "ป้าอู้ด",
        face: "👵",
        like: "egg",
        lines: [
          "ไก่ย่างป้าหอมไปทั้งเมือง 🍗",
          "อย่าลืมกินข้าวกินน้ำนะลูก",
          "ป้าทำไก่ย่างมา 20 ปีแล้ว",
          "เอาไข่มาแลกไก่ย่างได้นะ ล้อเล่น!",
        ],
      },
    ],
    Gt = { x: -24, z: 20, cols: 6, rows: 4, size: 1.7 },
    Ut = new H(-96, 0, 57),
    Oc = new H(-12.5, 0, 15.5),
    QP = new H(11.5, 0, -3.6),
    Bh = "ccs-farm-v1";
  function FM() {
    return {
      day: 1,
      season: 0,
      year: 1,
      money: 100,
      stamina: 100,
      inv: {},
      tiles: Array.from({ length: Gt.cols * Gt.rows }, (i, e) => ({
        state: e < 6 ? "soil" : "grass",
        crop: null,
        growth: 0,
        watered: !1,
        dead: !1,
      })),
      hearts: es.map(() => 0),
      talked: es.map(() => 0),
      gifted: es.map(() => 0),
      ship: {},
      found: [],
      score: 0,
      bones: 0,
      rainToday: !1,
      chickens: 0,
      fed: 0,
      eggs: 0,
      tools: { can: !1, hoe: !1, rod: !1 },
      request: null,
      music: !0,
      tutorial: 0,
    };
  }
  var zM = 3,
    M3 = Bh + "-bak",
    cH = [
      [
        2,
        (i) => {
          let e = {
            "dw:vest_det": "dw:folk_pirate",
            "dw:vest_cool": "dw:folk_bee",
            "dw:vest_lucky": "dw:folk_jester",
            "dw:boots_paw": "dw:kick_santa",
            "dw:boots_dig": "dw:folk_dino",
            "dw:boots_run": "dw:kick_viking",
          };
          Array.isArray(i.hats) && (i.hats = [...new Set(i.hats.map((t) => e[t] ?? t))]);
        },
      ],
      [
        3,
        (i) => {
          let e = i.inv ?? {};
          for (let t of Object.keys(e)) (!Number.isFinite(e[t]) || e[t] < 0) && (e[t] = 0);
          i.inv = e;
        },
      ],
    ];
  function lH(i) {
    let e = (n, s, o = 0, r = 1 / 0) => (typeof n == "number" && Number.isFinite(n) ? Math.max(o, Math.min(r, n)) : s);
    ((i.money = Math.floor(e(i.money, 0))),
      (i.day = e(i.day, 1, 1)),
      (i.season = e(i.season, 0, 0, 3)),
      (i.score = e(i.score, 0)),
      (i.bones = e(i.bones, 0)));
    for (let n of ["hearts", "talked", "gifted"]) {
      let s = Array.isArray(i[n]) ? i[n] : [];
      i[n] = es.map((o, r) => e(s[r], 0, 0, 10));
    }
    (!i.inv || typeof i.inv != "object") && (i.inv = {});
    for (let n of Object.keys(i.inv)) !n.startsWith("food:") && ti(n).icon === "❔" && delete i.inv[n];
    if (Array.isArray(i.tiles)) for (let n of i.tiles) n && n.crop && !so(n.crop) && ((n.crop = null), (n.growth = 0));
    let t = i;
    for (let n of ["energy", "hunger", "thirst"]) n in t && (t[n] = e(t[n], 100, 0, 100));
    return i;
  }
  function y3(i) {
    try {
      let e = JSON.parse(i || "null");
      if (!e || !e.tiles) return null;
      let t = FM(),
        n = typeof e.saveVer == "number" ? e.saveVer : 1;
      for (let [o, r] of cH) n < o && r(e);
      let s = { ...t, ...e, tools: { ...t.tools, ...(e.tools || {}) } };
      for (let o of Object.keys(s.inv)) o.startsWith("seed:") && delete s.inv[o];
      return ((s.saveVer = zM), lH(s));
    } catch {
      return null;
    }
  }
  var b3 = "fresh";
  function LM() {
    let i = null,
      e = null;
    try {
      ((i = localStorage.getItem(Bh)), (e = localStorage.getItem(M3)));
    } catch {}
    let t = y3(i);
    if (t) return ((b3 = "main"), t);
    let n = y3(e);
    return n ? ((b3 = "backup"), n) : ((b3 = "fresh"), FM());
  }
  var CM = 0;
  function _t(i) {
    try {
      i.saveVer = zM;
      let e = JSON.stringify(i);
      if (!e || e.length < 20) return;
      let t = Date.now();
      if (t - CM > 6e4) {
        let n = localStorage.getItem(Bh);
        (n && y3(n) && localStorage.setItem(M3, n), (CM = t));
      }
      localStorage.setItem(Bh, e);
    } catch {}
  }
  function DM() {
    try {
      (localStorage.removeItem(Bh), localStorage.removeItem(M3));
    } catch {}
  }
  var so = (i) => IM.find((e) => e.id === i),
    Nc = (i) =>
      new H(
        Gt.x + ((i % Gt.cols) - (Gt.cols - 1) / 2) * Gt.size,
        0,
        Gt.z + (Math.floor(i / Gt.cols) - (Gt.rows - 1) / 2) * Gt.size,
      ),
    Oi = (i) => new bt({ color: i }),
    na = {
      grass: new bt({ color: 8240466 }),
      soil: Oi(11039818),
      wet: Oi(7227948),
      mound: Oi(9067059),
      leaf: Oi(6075454),
      dead: Oi(10123850),
      stem: Oi(4885040),
    },
    Pp = class {
      constructor(e, t = !1) {
        this.group = new J();
        this.tiles = [];
        if (t) {
          (this.buildBin(), e.add(this.group));
          return;
        }
        let n = Gt.cols * Gt.size + 1.2,
          s = Gt.rows * Gt.size + 1.2,
          o = new re(0.08, 0.08, 0.9, 6),
          r = new ee(1, 0.1, 0.06),
          a = Oi(13208139),
          c = (w, v, _, S) => {
            let M = Math.ceil(Math.hypot(_ - w, S - v) / 1.2);
            for (let T = 0; T <= M; T++) {
              let A = new R(o, a);
              if ((A.position.set(w + ((_ - w) * T) / M, 0.45, v + ((S - v) * T) / M), this.group.add(A), T < M))
                for (let F of [0.35, 0.7]) {
                  let C = new R(r, a);
                  ((C.scale.x = Math.hypot(_ - w, S - v) / M),
                    C.position.set(w + ((_ - w) * (T + 0.5)) / M, F, v + ((S - v) * (T + 0.5)) / M),
                    (C.rotation.y = -Math.atan2(S - v, _ - w)),
                    this.group.add(C));
                }
            }
          },
          l = Gt.x - n / 2,
          h = Gt.x + n / 2,
          f = Gt.z - s / 2,
          d = Gt.z + s / 2;
        (c(l, f, -21, f), c(-17.5, f, h, f), c(l, d, h, d), c(l, f, l, d), c(h, f, h, d));
        for (let w = 0; w < Gt.cols * Gt.rows; w++) {
          let v = Nc(w),
            _ = new R(new ee(Gt.size * 0.92, 0.08, Gt.size * 0.92), na.grass);
          _.position.set(v.x, 0.04, v.z);
          let S = new J();
          (S.position.set(v.x, 0.08, v.z), this.group.add(_, S), this.tiles.push({ base: _, plant: S }));
        }
        let u = new J(),
          p = new R(new ee(5, 3, 4), Oi(16773577));
        p.position.y = 1.5;
        let m = new R(new yt(4.1, 2.2, 4), Oi(12735807));
        ((m.position.y = 4.1), (m.rotation.y = Math.PI / 4));
        let E = new R(new ee(1.1, 1.9, 0.1), Oi(9067051));
        E.position.set(0, 0.95, -2.02);
        let g = new R(new ee(0.9, 0.8, 0.1), Oi(12577271));
        g.position.set(-1.6, 1.8, -2.02);
        let y = g.clone();
        y.position.x = 1.6;
        let x = new R(new ee(0.6, 1.4, 0.6), Oi(11685436));
        x.position.set(1.2, 4.3, 0.6);
        let b = new R(new ee(1.6, 0.04, 0.9), Oi(16748472));
        (b.position.set(0, 0.03, -2.6), u.add(p, m, E, g, y, x, b));
        for (let w of [p, m, x]) {
          let v = new R(w.geometry, new be({ color: 2366485, side: Wn }));
          (v.scale.setScalar(1.03), w.add(v));
        }
        (u.position.copy(Ut).setZ(Ut.z + 2.6), this.group.add(u), this.buildBin(), e.add(this.group));
      }
      buildBin() {
        let e = new R(new ee(1.3, 0.9, 0.9), Oi(13208139));
        e.position.set(Oc.x, 0.45, Oc.z);
        let t = new R(new ee(1.4, 0.12, 1), Oi(9067051));
        ((t.position.y = 0.5), e.add(t), this.group.add(e));
      }
      render(e, t) {
        this.tiles.length &&
          e.forEach((n, s) => {
            let o = this.tiles[s];
            o.base.material = n.state === "grass" ? na.grass : n.watered ? na.wet : na.soil;
            let r = `${n.state}|${n.crop}|${Math.min(n.growth, 99)}|${n.dead}`;
            (o.plant.userData.key !== r && ((o.plant.userData.key = r), this.buildPlant(o.plant, n)),
              o.plant.userData.ripe && (o.plant.rotation.y = Math.sin(t * 2 + s) * 0.08));
          });
      }
      buildPlant(e, t) {
        if ((e.clear(), (e.userData.ripe = !1), !t.crop)) return;
        let n = so(t.crop);
        if (t.dead) {
          let a = new R(new yt(0.25, 0.4, 5), na.dead);
          ((a.position.y = 0.2), e.add(a));
          return;
        }
        let s = t.growth >= n.days ? 3 : t.growth === 0 ? 0 : t.growth >= n.days - 1 ? 2 : 1;
        if (s === 0) {
          let a = new R(new we(0.28, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2), na.mound);
          e.add(a);
          return;
        }
        let o = s === 1 ? 0.5 : s === 2 ? 0.85 : 1,
          r = new R(new re(0.04, 0.05, 0.6 * o, 5), na.stem);
        ((r.position.y = 0.3 * o), e.add(r));
        for (let a = 0; a < (s === 1 ? 2 : 4); a++) {
          let c = new R(new we(0.22 * o, 8, 6), na.leaf);
          c.scale.set(1.4, 0.35, 0.7);
          let l = (a / 4) * Math.PI * 2;
          (c.position.set(Math.cos(l) * 0.22 * o, 0.35 * o + a * 0.05, Math.sin(l) * 0.22 * o),
            (c.rotation.y = -l),
            e.add(c));
        }
        if (s === 3) {
          e.userData.ripe = !0;
          let a = Oi(n.color),
            c = (h, f, d, u, p = 1) => {
              let m = new R(h, a);
              return (m.position.set(f, d, u), m.scale.setScalar(p), e.add(m), m);
            };
          if (n.shape === "big") {
            let h = c(new we(0.42, 14, 10), 0, 0.32, 0.12);
            h.scale.y = n.id === "pumpkin" ? 0.75 : 0.9;
          } else if (n.shape === "ball") c(new we(0.38, 12, 10), 0, 0.4, 0);
          else if (n.shape === "corn")
            for (let h of [-0.15, 0.15]) {
              let f = c(new re(0.1, 0.08, 0.45, 8), h, 0.75, 0);
              f.rotation.z = h * 1.2;
            }
          else if (n.shape === "berry")
            for (let h = 0; h < 5; h++)
              c(new we(0.11, 8, 6), Math.cos(h * 1.3) * 0.25, 0.4 + (h % 2) * 0.15, Math.sin(h * 1.3) * 0.25);
          else
            for (let h = 0; h < 6; h++)
              c(new we(0.2, 8, 6), Math.cos(h) * 0.2, 0.45 + h * 0.04, Math.sin(h) * 0.2).scale.set(0.5, 1.4, 0.5);
          let l = new R(new Ho(0.1), new be({ color: 16769126 }));
          ((l.position.y = 1.15), e.add(l));
        }
      }
    },
    T3 = [
      { id: "tilapia", name: "ปลานิล", icon: "🐟", sell: 40, w: 50 },
      {
        id: "carp",
        name: "ปลาตะเพียน",
        icon: "🐟",
        sell: 60,
        w: 28,
      },
      { id: "catfish", name: "ปลาดุก", icon: "🐡", sell: 85, w: 16 },
      {
        id: "gold",
        name: "ปลาทองเรืองแสง",
        icon: "🐠",
        sell: 250,
        w: 6,
      },
    ],
    Gc = [
      { id: "butterfly", name: "ผีเสื้อ", icon: "🦋", sell: 30 },
      { id: "ladybug", name: "เต่าทอง", icon: "🐞", sell: 45 },
      { id: "beetle", name: "ด้วงกว่าง", icon: "🪲", sell: 120 },
    ];
  function ti(i) {
    let [e, t] = i.split(":");
    if (e === "seed") {
      let n = so(t);
      return n
        ? { name: `เมล็ด${n.name}`, icon: "🌱", sell: 0, giftable: !1 }
        : { name: i, icon: "❔", sell: 0, giftable: !1 };
    }
    if (e === "crop") {
      let n = so(t);
      return n
        ? { name: n.name, icon: n.icon, sell: n.sell, giftable: !0 }
        : { name: i, icon: "❔", sell: 0, giftable: !1 };
    }
    if (e === "fish") {
      let n = T3.find((s) => s.id === t);
      return n
        ? { name: n.name, icon: n.icon, sell: n.sell, giftable: !0 }
        : { name: i, icon: "❔", sell: 0, giftable: !1 };
    }
    if (e === "bug") {
      let n = Gc.find((s) => s.id === t);
      return n
        ? { name: n.name, icon: n.icon, sell: n.sell, giftable: !0 }
        : { name: i, icon: "❔", sell: 0, giftable: !1 };
    }
    return e === "egg"
      ? { name: "ไข่ไก่สด", icon: "🥚", sell: 35, giftable: !0 }
      : e === "food" && Ip[i]
        ? Ip[i]
        : { name: i, icon: "❔", sell: 0, giftable: !1 };
  }
  var Ip = {},
    kn = new H(-46, 0, 40),
    Ti = new H(15.6, 0, 14.2),
    eI = new H(23, 0, -3.6);
  function BM() {
    let i = new J(),
      e = new bt({ color: 16777215 }),
      t = new bt({ color: 14829119 }),
      n = new bt({ color: 16754224 }),
      s = new be({ color: 2366485, side: Wn }),
      o = new R(new we(0.42, 14, 10), e);
    (o.scale.set(1, 0.85, 1.1), (o.position.y = 0.5));
    let r = new R(o.geometry, s);
    (r.scale.setScalar(1.06), o.add(r));
    let a = new R(new we(0.27, 12, 10), e);
    a.position.set(0, 0.95, 0.3);
    let c = new R(a.geometry, s);
    (c.scale.setScalar(1.08), a.add(c));
    let l = new R(new yt(0.08, 0.18, 6), n);
    ((l.rotation.x = Math.PI / 2), l.position.set(0, 0.92, 0.6));
    let h = new J();
    for (let p of [-0.07, 0, 0.07]) {
      let m = new R(new we(0.07, 8, 6), t);
      (m.position.set(0, 1.2 + (p === 0 ? 0.04 : 0), 0.3 + p), h.add(m));
    }
    let f = new be({ color: 2366485 });
    for (let p of [-0.13, 0.13]) {
      let m = new R(new we(0.035, 6, 6), f);
      (m.position.set(p, 1, 0.52), i.add(m));
    }
    let d = new be({ color: 16748451 });
    for (let p of [-0.17, 0.17]) {
      let m = new R(new we(0.045, 6, 6), d);
      (m.position.set(p, 0.92, 0.48), i.add(m));
    }
    let u = new R(new yt(0.16, 0.3, 6), e);
    (u.position.set(0, 0.7, -0.45), (u.rotation.x = -0.9));
    for (let p of [-0.12, 0.12]) {
      let m = new R(new re(0.025, 0.025, 0.2, 5), n);
      (m.position.set(p, 0.12, 0), i.add(m));
    }
    return (i.add(o, a, l, h, u), i);
  }
  function OM() {
    let i = new J(),
      e = (r) => new bt({ color: r }),
      t = new R(new gt(1.3, 20), e(15254634));
    ((t.rotation.x = -Math.PI / 2), (t.position.y = 0.03), i.add(t));
    let n = new R(new ee(1.2, 0.25, 0.45), e(13208139));
    (n.position.set(-1.6, 0.13, 0.4), i.add(n));
    let s = new R(new ee(1.05, 0.04, 0.32), e(15913067));
    (s.position.set(-1.6, 0.26, 0.4), i.add(s));
    let o = new R(new vt(0.35, 0.15, 6, 12), e(15254634));
    return (
      (o.rotation.x = Math.PI / 2),
      o.position.set(0.4, 0.15, 0),
      i.add(o),
      (i.userData.nest = o),
      (i.userData.trough = n),
      i
    );
  }
  var zh = null;
  function _i() {
    if (!zh)
      try {
        zh = new AudioContext();
      } catch {}
    return (zh?.state === "suspended" && zh.resume(), zh);
  }
  function ke(i) {
    let e = _i();
    if (!e) return;
    let t = {
        pop: [
          [660, 0.08, "triangle"],
          [990, 0.08, "triangle"],
        ],
        coin: [
          [988, 0.08, "square"],
          [1319, 0.18, "square"],
        ],
        water: [
          [520, 0.06, "sine"],
          [440, 0.06, "sine"],
          [600, 0.08, "sine"],
        ],
        dig: [
          [180, 0.08, "square"],
          [140, 0.08, "square"],
        ],
        catch: [
          [523, 0.08, "triangle"],
          [659, 0.08, "triangle"],
          [784, 0.08, "triangle"],
          [1047, 0.2, "triangle"],
        ],
        heart: [
          [784, 0.1, "sine"],
          [1047, 0.2, "sine"],
        ],
        nope: [
          [300, 0.12, "sawtooth"],
          [220, 0.16, "sawtooth"],
        ],
        splash: [
          [300, 0.05, "sine"],
          [900, 0.1, "sine"],
        ],
        shutter: [
          [2400, 0.025, "square"],
          [900, 0.04, "square"],
          [1800, 0.03, "square"],
        ],
        sparkle: [
          [1568, 0.06, "sine"],
          [2093, 0.06, "sine"],
          [2637, 0.08, "sine"],
          [3136, 0.22, "triangle"],
        ],
        // v106: เสียงแตรสำเร็จภารกิจ (ต่างจากเสียงอื่นชัดเจน)
        quest: [
          [523, 0.11, "square"],
          [659, 0.11, "square"],
          [784, 0.11, "square"],
          [1047, 0.16, "square"],
          [784, 0.09, "triangle"],
          [1047, 0.5, "triangle"],
        ],
      },
      n = e.currentTime;
    for (let [s, o, r] of t[i]) {
      let a = e.createOscillator(),
        c = e.createGain();
      ((a.type = r),
        (a.frequency.value = s),
        c.gain.setValueAtTime(0.12, n),
        c.gain.exponentialRampToValueAtTime(0.001, n + o),
        a.connect(c).connect(e.destination),
        a.start(n),
        a.stop(n + o + 0.02),
        (n += o * 0.8));
    }
  }
  var Dh = null,
    x3 = !1;
  async function NM(i) {
    if (!(Dh || x3)) {
      x3 = !0;
      try {
        let e = window,
          t;
        if (e.__BARK) {
          let n = atob(e.__BARK),
            s = new Uint8Array(n.length);
          for (let o = 0; o < n.length; o++) s[o] = n.charCodeAt(o);
          t = s.buffer;
        } else t = await (await fetch("dog_bark.mp3")).arrayBuffer();
        Dh = await i.decodeAudioData(t);
      } catch (e) {
        console.warn("bark", e);
      } finally {
        x3 = !1;
      }
    }
  }
  function Uc(i = 2) {
    let e = _i();
    if (!e) return;
    if (!Dh) {
      NM(e).then(() => {
        Dh && Uc(i);
      });
      return;
    }
    let t = e.createBufferSource();
    ((t.buffer = Dh), (t.playbackRate.value = 0.94 + Math.random() * 0.12));
    let n = e.createGain();
    ((n.gain.value = 0.9),
      t.connect(n).connect(e.destination),
      i <= 1 ? t.start(e.currentTime + 0.01, 0.1, 0.34) : t.start(e.currentTime + 0.01, 0.08));
  }
  function GM() {
    let i = _i();
    i && NM(i);
  }
  var Lh = null;
  function kM(i) {
    if (Lh) return Lh;
    Lh = i.createBuffer(1, i.sampleRate * 2, i.sampleRate);
    let e = Lh.getChannelData(0),
      t = 0;
    for (let n = 0; n < e.length; n++) {
      let s = Math.random() * 2 - 1;
      ((t = (t + 0.02 * s) / 1.02), (e[n] = s * 0.6 + t * 3));
    }
    return Lh;
  }
  function Oh(i = 2, e = 0.5) {
    let t = _i();
    if (t)
      for (let n = 0; n < i; n++) {
        let s = t.currentTime + 0.05 + n * 2.2,
          o = t.createBufferSource();
        o.buffer = kM(t);
        let r = t.createBiquadFilter();
        ((r.type = "lowpass"), (r.frequency.value = 420), (r.Q.value = 4));
        let a = t.createGain();
        (a.gain.setValueAtTime(0, s),
          a.gain.linearRampToValueAtTime(0.5 * e, s + 0.35),
          a.gain.linearRampToValueAtTime(0.35 * e, s + 0.9),
          a.gain.linearRampToValueAtTime(0, s + 1.1));
        let c = t.createOscillator();
        c.frequency.value = 28;
        let l = t.createGain();
        ((l.gain.value = 0.25 * e), c.connect(l).connect(a.gain));
        let h = t.createOscillator();
        ((h.type = "sawtooth"), h.frequency.setValueAtTime(70, s), h.frequency.linearRampToValueAtTime(95, s + 1));
        let f = t.createGain();
        ((f.gain.value = 0.25),
          h.connect(f).connect(r),
          o.connect(r).connect(a).connect(t.destination),
          o.start(s),
          o.stop(s + 1.2),
          c.start(s),
          c.stop(s + 1.2),
          h.start(s),
          h.stop(s + 1.2));
        let d = t.createOscillator();
        ((d.type = "sine"),
          d.frequency.setValueAtTime(1100, s + 1.25),
          d.frequency.exponentialRampToValueAtTime(620, s + 1.9));
        let u = t.createBufferSource();
        u.buffer = kM(t);
        let p = t.createBiquadFilter();
        ((p.type = "bandpass"), (p.frequency.value = 2400), (p.Q.value = 0.8));
        let m = t.createGain();
        (m.gain.setValueAtTime(0, s + 1.2),
          m.gain.linearRampToValueAtTime(0.06 * e, s + 1.35),
          m.gain.exponentialRampToValueAtTime(5e-4, s + 1.95),
          d.connect(m),
          u.connect(p).connect(m),
          m.connect(t.destination),
          d.start(s + 1.2),
          d.stop(s + 2),
          u.start(s + 1.2),
          u.stop(s + 2));
      }
  }
  function Fp(i, e, t = 512, n = 500, s = 0.06) {
    let o = document.createElement("canvas");
    o.width = o.height = t;
    let r = o.getContext("2d");
    ((r.fillStyle = i), r.fillRect(0, 0, t, t));
    for (let l = 0; l < n; l++) {
      let h = Math.random() * t,
        f = Math.random() * t,
        d = 8 + Math.random() * t * 0.12,
        u = e[l % e.length];
      for (let [p, m] of [
        [0, 0],
        [t, 0],
        [-t, 0],
        [0, t],
        [0, -t],
      ]) {
        let E = r.createRadialGradient(h + p, f + m, 0, h + p, f + m, d);
        (E.addColorStop(0, u + "26"),
          E.addColorStop(0.7, u + "14"),
          E.addColorStop(1, u + "00"),
          (r.fillStyle = E),
          r.fillRect(h + p - d, f + m - d, d * 2, d * 2));
      }
    }
    let a = r.getImageData(0, 0, t, t);
    for (let l = 0; l < a.data.length; l += 4) {
      let h = (Math.random() - 0.5) * 255 * s;
      ((a.data[l] += h), (a.data[l + 1] += h), (a.data[l + 2] += h));
    }
    r.putImageData(a, 0, 0);
    let c = new ut(o);
    return ((c.wrapS = c.wrapT = gn), (c.colorSpace = Ye), (c.anisotropy = 4), c);
  }
  function UM(i) {
    let e = {
        top: { value: new ae(8177394) },
        bottom: { value: new ae(16773590) },
        sunDir: { value: new H(0, 1, 0) },
        sunCol: { value: new ae(16774344) },
      },
      t = new Qt({
        side: Wn,
        depthWrite: !1,
        fog: !1,
        uniforms: e,
        vertexShader:
          "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
        fragmentShader: `uniform vec3 top; uniform vec3 bottom; uniform vec3 sunDir; uniform vec3 sunCol; varying vec3 vP;
      void main(){ float h = clamp(vP.y*2.6+0.04,0.0,1.0); vec3 c = mix(bottom, top, pow(h,0.55)); c = mix(c, top*0.82, smoothstep(0.35,1.0,vP.y));
        float s = max(dot(normalize(vP), normalize(sunDir)),0.0); c += sunCol * (pow(s,180.0)*0.9 + pow(s,8.0)*0.18);
        gl_FragColor = vec4(c,1.0); }`,
      }),
      n = new R(new we(400, 32, 16), t);
    return ((n.renderOrder = -10), i.add(n), { dome: n, u: e });
  }
  function VM(i, e, t) {
    let n = new Te(0.11, 0.55, 1, 3);
    n.translate(0, 0.275, 0);
    let s = n.attributes.position,
      o = [];
    for (let p = 0; p < s.count; p++) {
      let m = s.getY(p);
      s.setX(p, s.getX(p) * (1 - m / 0.6));
      let E = m / 0.55;
      o.push(0.25 + E * 0.4, 0.5 + E * 0.32, 0.18 + E * 0.12);
    }
    n.setAttribute("color", new Fe(o, 3));
    let r = new bt({ vertexColors: !0, side: Ke }),
      a = { value: 0 };
    r.onBeforeCompile = (p) => {
      ((p.uniforms.time = a),
        (p.vertexShader =
          `uniform float time;
` +
          p.vertexShader.replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
      vec4 ip = instanceMatrix * vec4(0.0,0.0,0.0,1.0);
      float sway = sin(time*1.8 + ip.x*0.35 + ip.z*0.25) + 0.4*sin(time*3.1 + ip.x*1.3);
      transformed.x += sway * 0.12 * pow(position.y/0.55, 2.0);
      transformed.z += sway * 0.05 * pow(position.y/0.55, 2.0);`,
          )));
    };
    let c = new di(n, r, e),
      l = new Oe(),
      h = new At(),
      f = new H(),
      d = new ae(),
      u = 0;
    for (let p = 0; p < e * 3 && u < e; p++) {
      let m = t();
      if (!m) continue;
      h.setFromAxisAngle(new H(0, 1, 0), Math.random() * Math.PI);
      let E = 0.7 + Math.random() * 0.8;
      (f.set(E, E, E),
        l.compose(m, h, f),
        c.setMatrixAt(u, l),
        d.setHSL(0.22 + Math.random() * 0.06, 0.5, 0.42 + Math.random() * 0.15),
        c.setColorAt(u, d),
        u++);
    }
    return ((c.count = u), (c.receiveShadow = !0), i.add(c), a);
  }
  function WM(i, e, t) {
    let n = [16748472, 16769126, 16777215, 11902192, 16751210],
      s = new we(0.11, 6, 4);
    s.translate(0, 0.42, 0);
    let o = new di(s, new bt({ color: 16777215 }), e),
      r = new re(0.015, 0.015, 0.4, 3);
    r.translate(0, 0.2, 0);
    let a = new di(r, new bt({ color: 4099642 }), e),
      c = new Oe(),
      l = new ae(),
      h = 0;
    for (let f = 0; f < e * 3 && h < e; f++) {
      let d = t();
      d &&
        (c.makeTranslation(d.x, 0, d.z),
        o.setMatrixAt(h, c),
        a.setMatrixAt(h, c),
        l.setHex(n[h % n.length]),
        o.setColorAt(h, l),
        h++);
    }
    ((o.count = a.count = h), i.add(o, a));
  }
  function qM(i, e) {
    let t = (v) => new bt({ color: v }),
      n = t(10185274),
      s = t(7029280),
      o = new J();
    for (let v = e - 1; v < e + 19; v += 0.9) {
      let _ = new R(new ee(3.2, 0.18, 0.8), Math.round(v * 3) % 3 ? n : t(9067051));
      (_.position.set(0, 0.25, v), (_.rotation.y = (Math.random() - 0.5) * 0.04), o.add(_));
    }
    for (let v = e + 1; v < e + 19; v += 3.5)
      for (let _ of [-1.6, 1.6]) {
        let S = new R(new re(0.16, 0.18, 2.2, 8), s);
        (S.position.set(_, -0.5, v), o.add(S));
      }
    let r = new R(new re(0.07, 0.07, 2.2, 6), s);
    (r.position.set(1.4, 1.3, e + 17.5), o.add(r));
    let a = new be({ color: 16773242 }),
      c = new R(new we(0.28, 10, 8), a);
    (c.position.set(1.4, 2.5, e + 17.5), o.add(c), i.add(o));
    let l = new J(),
      h = new mn();
    (h.moveTo(-7, 0),
      h.quadraticCurveTo(-5, -2.4, 0, -2.6),
      h.quadraticCurveTo(6, -2.4, 8.5, 0.6),
      h.lineTo(7.5, 1.6),
      h.lineTo(-7.5, 1.6),
      h.closePath());
    let f = new R(
      new yi(h, { depth: 4.2, bevelEnabled: !0, bevelSize: 0.3, bevelThickness: 0.3, bevelSegments: 2 }),
      t(8014372),
    );
    ((f.position.z = -2.1), l.add(f));
    let d = new R(new ee(15.4, 0.35, 4.9), t(14041146));
    ((d.position.y = 1.1), l.add(d));
    let u = new R(new ee(14.6, 0.2, 4.2), t(13208139));
    ((u.position.y = 1.65), l.add(u));
    let p = new R(new ee(3.2, 1.8, 3.4), t(16773577));
    (p.position.set(-5, 2.6, 0), l.add(p));
    let m = new be({ color: 10410224 });
    for (let v of [-5.8, -4.2]) {
      let _ = new R(new Te(0.7, 0.6), m);
      (_.position.set(v, 2.8, 1.72), l.add(_));
    }
    let E = new bt({ color: 16774882, side: Ke });
    for (let [v, _] of [
      [-1.2, 11],
      [3.8, 9],
    ]) {
      let S = new R(new re(0.16, 0.2, _, 8), s);
      (S.position.set(v, 1.6 + _ / 2, 0), l.add(S));
      for (let [T, A, F] of [
        [_ * 0.45, 5.6, 3.2],
        [_ * 0.8, 4.4, 2.6],
      ]) {
        let C = new Te(0.1, F, 1, 6),
          P = C.attributes.position;
        for (let D = 0; D < P.count; D++) P.setZ(D, Math.sin((P.getY(D) / F + 0.5) * Math.PI) * 0.7);
        let I = new R(new ee(0.06, F, A), E);
        (I.position.set(v + 0.4, 1.6 + T, 0), (I.scale.x = 1), l.add(I));
        let k = new R(new re(0.08, 0.08, A + 0.6, 6), s);
        ((k.rotation.x = Math.PI / 2), k.position.set(v + 0.3, 1.6 + T + F / 2, 0), l.add(k));
      }
      let M = new R(new Te(1.4, 0.8), new bt({ color: 16740241, side: Ke }));
      (M.position.set(v + 0.75, 1.6 + _ + 0.2, 0), (M.rotation.y = Math.PI / 2), l.add(M));
    }
    let g = new R(new ee(3.4, 0.9, 0.1), t(16773577));
    (g.position.set(1.5, 2.3, 2.55),
      l.add(g),
      l.position.set(8.5, -0.3, e + 15.5),
      (l.rotation.y = Math.PI / 2 + 0.05),
      i.add(l));
    let y = new J(),
      x = new R(new re(0.9, 0.5, 0.6, 8, 1, !1), t(10185274));
    ((x.scale.z = 2.4), y.add(x));
    let b = new R(new re(0.06, 0.06, 3, 6), s);
    ((b.position.y = 1.5), y.add(b));
    let w = new R(new ee(0.05, 2, 1.4), E);
    (w.position.set(0, 1.7, 0.6), y.add(w), y.position.set(-4, -0.15, e + 9), (y.visible = !1));
    for (let v of [o, l, y])
      v.traverse((_) => {
        _.isMesh && ((_.castShadow = !0), (_.receiveShadow = !0));
      });
    return { ship: l, boat: y, bulbMat: a, winMat: m };
  }
  function jM() {
    let i = document.createElement("canvas");
    i.width = i.height = 256;
    let e = i.getContext("2d"),
      t = e.createImageData(256, 256);
    for (let s = 0; s < t.data.length; s += 4) {
      let o = 200 + Math.random() * 55;
      ((t.data[s] = o), (t.data[s + 1] = o * 0.97), (t.data[s + 2] = o * 0.9), (t.data[s + 3] = 255));
    }
    e.putImageData(t, 0, 0);
    let n = document.createElement("div");
    ((n.className = "paper"),
      (n.style.cssText = `position:fixed;inset:0;pointer-events:none;z-index:2;background:url(${i.toDataURL()}) ,radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(60,40,20,.28) 100%);mix-blend-mode:multiply;opacity:.55`),
      document.body.appendChild(n));
  }
  var $M = [
      "สวัสดีจ้าน้องหมา!",
      "ขนฟูจังเลย ขอลูบหน่อยนะ",
      "โฮ่ง ๆ เหมือนกันนะ 😆",
      "น่ารักที่สุดในเมืองเลย",
      "ไปเดินเล่นที่ไหนมาจ๊ะ",
      "ตัวกลมเหมือนหมีน้อยเลย",
      "ลิ้นสีม่วงด้วย เท่มาก!",
      "วันนี้อารมณ์ดีจังนะ",
      "หางม้วนสวยจัง",
      "มาให้พี่กอดหน่อย",
      "ขนนุ่มเหมือนตุ๊กตาเลย",
      "กินข้าวหรือยังจ๊ะ",
      "อย่าวิ่งไปกลางถนนนะลูก",
      "ระวังรถด้วยนะ",
      "วันนี้แดดดี เดินเล่นสบายเลย",
      "เจ้าของต้องรักมากแน่ ๆ",
      "หน้าบึ้งแต่ใจดีใช่ไหม",
      "ชื่ออะไรเอ่ย ข้าวต้มเหรอ? น่ารักจัง",
      "ตาเล็ก ๆ ปิ๊ง ๆ",
      "เห็นแล้วหายเหนื่อยเลย",
      "ไปอาบน้ำมาหรือเปล่า หอมจัง",
      "ตัวนี้ชอบเล่นบอลไหมนะ",
      "ขอถ่ายรูปด้วยคนนะ 📸",
      "เดี๋ยวพี่ซื้อขนมมาฝาก",
      "ไปร้านไก่ย่างป้าอู้ดมาหรือยัง",
      "ร้อนไหมลูก ไปดื่มน้ำก่อนนะ",
      "อุ้งเท้านุ่มนิ่มแน่ ๆ",
      "เดินเตาะแตะน่ารักมาก",
      "เจอกันอีกแล้วนะ!",
      "ทุกวันต้องผ่านมาทักพี่นะ",
      "เป็นเชาเชาแท้เลยนะเนี่ย",
      "ขนสีส้มเหมือนพระอาทิตย์ตก",
      "วันนี้ไปทะเลมาเหรอ",
      "อย่าไปเล่นน้ำนานนะ เดี๋ยวไม่สบาย",
      "ระวังเปียกนะ ขนจะหนักเลย",
      "เก่งจัง รอข้ามถนนตอนไฟเขียวด้วย",
      "ไปสนามฝึกมาเหรอ เหนื่อยไหม",
      "กระโดดข้ามรั้วได้หรือยัง",
      "ฝึกบ่อย ๆ จะเก่งขึ้นนะ",
      "ขาสั้น ๆ แต่วิ่งเร็วนะเนี่ย",
      "อยากมีหมาแบบนี้สักตัวจัง",
      "ขอเป็นเพื่อนด้วยคนได้ไหม",
      "เดี๋ยวพาไปเดินเล่นด้วยกันนะ",
      "ยิ้มแป้นเลยวันนี้",
      "ทำหน้าง่วงจัง นอนน้อยเหรอ",
      "เมื่อคืนฝันดีไหมจ๊ะ",
      "ตื่นเช้าจังเลยนะ",
      "ไปตลาดกับพี่ไหม",
      "วันนี้มีลมเย็น ๆ สบายดี",
      "ฟ้าครึ้ม ๆ อย่าเพิ่งไปไกลนะ",
      "ฝนจะตกแล้ว รีบกลับบ้านนะ",
      "รุ้งขึ้นสวยมากเลยเห็นไหม",
      "คืนนี้พระจันทร์สวยนะ",
      "ดึกแล้วยังไม่นอนอีกเหรอ",
      "แสงไฟร้านค้าสวยจังตอนกลางคืน",
      "อ้าว มาคนเดียวเหรอ",
      "พาเพื่อนมาด้วยเหรอ น่ารักทั้งคู่เลย",
      "ขนพองฟูเหมือนสิงโตตัวน้อย",
      "แผงคอฟูมากกก",
      "มาเป็นนายแบบให้ร้านพี่ไหม",
      "ใส่หมวกแล้วหล่อขึ้นเยอะเลย",
      "ชุดวันนี้เข้ากันมาก",
      "แว่นเท่จัง!",
      "ปลอกคอสวยนะ ซื้อที่ไหนมา",
      "ผ้าพันคอน่ารักมาก",
      "สะอาดหอมกรุ่นเลยวันนี้",
      "ตัวมอมแมมนิดหน่อยนะ ไปอาบน้ำกัน",
      "แวะร้านอาบน้ำตัดขนสิ พี่เขาใจดี",
      "คลินิกหมอหมาอยู่ทางโน้นนะ ถ้าไม่สบาย",
      "ร้านของชำมีน้ำขวดใหญ่ขายนะ",
      "ไปลองตู้คีบตุ๊กตาหรือยัง",
      "พี่คีบได้ตุ๊กตาหมีมาเมื่อวานล่ะ",
      "แซลมอนแผงลุงทะเลริมหาดอร่อยนะ",
      "ไปเดินเล่นบนสะพานไม้มาหรือยัง",
      "ลมริมหาดเย็นสบายมาก",
      "ลุงปั้มอบขนมปังใหม่ทุกเช้าเลยนะ",
      "เพรทเซลลุงปั้มสูตรน้องหมาด้วย",
      "ป้าอู้ดย่างไก่ไม่ใส่เกลือให้น้อง ๆ",
      "บอร์ดงานมีงานใหม่มาแล้วนะ",
      "ช่วยงานในเมืองได้เงินด้วยนะ",
      "น้องเป็นคนดังของเมืองเลยนะ",
      "ใคร ๆ ก็รู้จักน้อง",
      "เด็ก ๆ ชอบน้องมากเลย",
      "ขอไฮไฟว์หน่อย ✋",
      "นั่ง! เก่งมาก 👏",
      "ยื่นมือ! โอ้ เก่งที่สุด",
      "หมุนตัวให้ดูหน่อยสิ",
      "เห่าทักทายดังดีนะ",
      "เสียงเห่าเท่มาก",
      "อย่าเห่าแมวนะลูก 😅",
      "เห็นนกพิราบแถวน้ำพุไหม",
      "น้ำพุวันนี้พุ่งสูงเชียว",
      "นั่งพักริมบ่อน้ำพุกันไหม",
      "ม้าในสวนสัตว์ตัวโตมากนะ",
      "ยีราฟคอยาวกว่าเสาไฟอีก",
      "แพนด้าแดงน่ารักไม่แพ้น้องเลย",
      "ไปทะเลระวังปูหนีบนะ",
      "เก็บเปลือกหอยมาฝากพี่บ้างสิ",
      "ได้ยินว่ามีไข่มุกในทะเลด้วยนะ",
      "ตกปลาได้ตัวโตไหมวันนี้",
      "จับผีเสื้อได้แล้วเหรอ เก่งจัง",
      "ระวังผึ้งนะ ต่อยเจ็บ",
      "ดอกไม้แถวนี้หอมมากเลย",
      "วิ่งเล่นในสนามหญ้าสนุกไหม",
      "ระวังอึเกะกะทางนะ 😆",
      "พี่ชอบหมาขนฟูที่สุดเลย",
      "อยากหอมแก้มสักฟอด",
      "หน้าตาเหมือนตุ๊กตาหมีที่บ้านพี่",
      "ขอบคุณที่มาทักนะ ใจฟูเลย",
      "วันนี้มีเรื่องดี ๆ แน่นอน",
      "เป็นกำลังใจให้พี่ทำงานนะ",
      "เห็นน้องแล้วหายเครียดเลย",
      "เดี๋ยวพี่ต้องไปทำงานก่อนนะ บ๊ายบาย",
      "ไว้เจอกันใหม่นะ!",
      "ดูแลตัวเองด้วยนะน้องหมา",
      "กลับบ้านดี ๆ นะ",
      "อย่าซนมากนะ เดี๋ยวเจ้าของห่วง",
      "ไปไหนก็ระวังตัวด้วยนะ",
      "รักน้องนะ 💕",
      "ฝันดีคืนนี้นะเจ้าตัวฟู",
    ],
    ia = [];
  function XM() {
    if (!ia.length) {
      ia = $M.map((i, e) => e);
      for (let i = ia.length - 1; i > 0; i--) {
        let e = Math.floor(Math.random() * (i + 1));
        [ia[i], ia[e]] = [ia[e], ia[i]];
      }
    }
    return $M[ia.pop()];
  }
  var zp = (i, e) => {
    let t = new Float32Array(i.count * e);
    for (let n = 0; n < i.count; n++)
      ((t[n * e] = i.getX(n)), e > 1 && (t[n * e + 1] = i.getY(n)), e > 2 && (t[n * e + 2] = i.getZ(n)));
    return new Je(t, e);
  };
  function fH(i, e, t = !1) {
    let n = new qe();
    if (t) {
      let o = i.getAttribute("color"),
        r = i.getAttribute("position").count;
      n.setAttribute("color", o ? zp(o, 3) : new Je(new Float32Array(r * 3).fill(1), 3));
    }
    (n.setAttribute("position", zp(i.getAttribute("position"), 3)),
      i.getAttribute("normal") && n.setAttribute("normal", zp(i.getAttribute("normal"), 3)),
      n.setAttribute(
        "uv",
        i.getAttribute("uv")
          ? zp(i.getAttribute("uv"), 2)
          : new Je(new Float32Array(n.getAttribute("position").count * 2), 2),
      ));
    let s = i.getIndex();
    return (
      n.setIndex(s ? Array.from(s.array) : Array.from({ length: n.getAttribute("position").count }, (o, r) => r)),
      n.getAttribute("normal") || n.computeVertexNormals(),
      n.applyMatrix4(e),
      n
    );
  }
  var uH = (i, e) => {
    for (let t = i; t && t !== e; t = t.parent) if (t.userData.noMerge) return !0;
    return !1;
  };
  function oo(i, e = !1) {
    i.updateMatrixWorld(!0);
    let t = i.matrixWorld.clone().invert(),
      n = new Map();
    i.traverse((o) => {
      let r = o;
      if (!r.isMesh || r.isSkinnedMesh || r.isInstancedMesh || Array.isArray(r.material)) return;
      let a = r.material;
      if (
        a.transparent ||
        !r.visible ||
        uH(r, i) ||
        Object.keys(r.geometry.morphAttributes).length ||
        r.onBeforeRender !== Wt.prototype.onBeforeRender
      )
        return;
      let c = a,
        h =
          (e && !a.onBeforeCompile.toString().includes("sh.")
            ? [
                a.type,
                c.color?.getHex(),
                c.map?.uuid,
                c.roughness,
                c.metalness,
                c.emissive?.getHex(),
                c.emissiveIntensity,
                c.emissiveMap?.uuid,
                a.side,
                c.vertexColors,
                c.flatShading,
                c.normalMap?.uuid,
              ].join("/")
            : a.uuid) +
          (r.castShadow ? "c" : "") +
          (r.receiveShadow ? "r" : ""),
        f = n.get(h);
      (f || ((f = { mat: a, geos: [], meshes: [], cast: r.castShadow, recv: r.receiveShadow }), n.set(h, f)),
        f.meshes.push(r));
    });
    let s = 0;
    for (let o of n.values())
      if (!(o.meshes.length < 2))
        try {
          let r = !!o.mat.vertexColors;
          for (let l of o.meshes) o.geos.push(fH(l.geometry, t.clone().multiply(l.matrixWorld), r));
          let a = ip(o.geos, !1);
          if (!a) continue;
          let c = new R(a, o.mat);
          ((c.castShadow = o.cast), (c.receiveShadow = o.recv), (c.userData.merged = !0), i.add(c));
          for (let l of o.meshes) (l.parent?.remove(l), s++);
        } catch (r) {
          console.warn("merge", r);
        }
    return s;
  }
