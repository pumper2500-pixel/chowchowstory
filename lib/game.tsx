"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { DOGS, LEVELS, earn as earnPure, levelOf, todayKey } from "@/lib/game-core.mjs";
import { supabase } from "@/lib/supabase";

// ไม่ล็อกอิน: เก็บในเครื่อง (localStorage)
// ล็อกอิน: Supabase เป็นตัวจริง — ให้แต้มผ่าน claim_reward (ตรวจกติกาฝั่งเซิร์ฟเวอร์)
const KEY = "ccs-game-v1";

type GameState = { bones: number; done: Record<string, boolean> };
type Toast = { id: number; html: string };
export type SyncStatus = "local" | "syncing" | "synced" | "error";

type Ctx = {
  state: GameState;
  ready: boolean;
  preview: boolean;
  setPreview: (v: boolean) => void;
  shownBones: number;
  today: string;
  earn: (key: string, pts: number, label: string) => boolean;
  toast: Toast | null;
  showToast: (html: string) => void;
  levelUpTick: number;
  session: Session | null;
  sync: SyncStatus;
  displayName: string | null;
  setDisplayName: (n: string | null) => void;
};

const GameCtx = createContext<Ctx | null>(null);

function readLocal(): GameState {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    if (raw && typeof raw.bones === "number") return { bones: raw.bones, done: raw.done || {} };
  } catch {}
  return { bones: 0, done: {} };
}
function writeLocal(s: GameState) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>({ bones: 0, done: {} });
  const [ready, setReady] = useState(false);
  const [preview, setPreview] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [levelUpTick, setLevelUpTick] = useState(0);
  const [session, setSession] = useState<Session | null>(null);
  const [sync, setSync] = useState<SyncStatus>("local");
  const [displayName, setDisplayName] = useState<string | null>(null);
  const stateRef = useRef(state);
  const sessionRef = useRef<Session | null>(null);
  const today = useMemo(() => todayKey(), []);

  const apply = useCallback((s: GameState) => {
    const before = levelOf(stateRef.current.bones);
    stateRef.current = s;
    setState(s);
    writeLocal(s);
    return levelOf(s.bones) > before;
  }, []);

  // ดึงสถานะจากบัญชี (หลังย้ายแต้มในเครื่องเข้าไปแล้ว)
  const pullFromServer = useCallback(async () => {
    setSync("syncing");
    const localKeys = Object.keys(readLocal().done);
    if (localKeys.length) {
      const { error } = await supabase.rpc("merge_rewards", { p_keys: localKeys });
      if (error) { setSync("error"); return; }
    }
    const [{ data: prof, error: e1 }, { data: rows, error: e2 }] = await Promise.all([
      supabase.from("profiles").select("bones, display_name").single(),
      supabase.from("profile_rewards").select("key"),
    ]);
    if (e1 || e2 || !prof) { setSync("error"); return; }
    const done: Record<string, boolean> = {};
    (rows || []).forEach((r: { key: string }) => { done[r.key] = true; });
    apply({ bones: prof.bones, done });
    setDisplayName(prof.display_name);
    setSync("synced");
  }, [apply]);

  useEffect(() => {
    const s = readLocal();
    stateRef.current = s;
    setState(s);
    setReady(true);

    supabase.auth.getSession().then(({ data }) => {
      sessionRef.current = data.session;
      setSession(data.session);
      if (data.session) pullFromServer();
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, sess) => {
      const was = sessionRef.current?.user.id;
      sessionRef.current = sess;
      setSession(sess);
      if (sess && sess.user.id !== was) pullFromServer();
      if (event === "SIGNED_OUT") {
        // ออกจากระบบ: ล้างแต้มในเครื่อง เพื่อไม่ให้ไปรวมกับบัญชีคนถัดไป
        apply({ bones: 0, done: {} });
        setDisplayName(null);
        setSync("local");
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [pullFromServer, apply]);

  const showToast = useCallback((html: string) => {
    const id = Date.now();
    setToast({ id, html });
    setTimeout(() => setToast((t) => (t && t.id === id ? null : t)), 2600);
  }, []);

  const announce = useCallback((pts: number, label: string, levelUp: boolean, bones: number) => {
    if (levelUp) {
      const li = levelOf(bones);
      showToast(`เลเวลอัป! <b>${LEVELS[li].name}</b> · ${DOGS[li].name} เดินเข้ามาแล้ว`);
      setLevelUpTick((n) => n + 1);
    } else {
      showToast(`+${pts} 🦴 ${label}`);
    }
  }, [showToast]);

  const earn = useCallback((key: string, pts: number, label: string) => {
    const r = earnPure(stateRef.current, key, pts);
    if (!r.gained) return false;
    // แสดงผลทันที แล้วค่อยยืนยันกับเซิร์ฟเวอร์
    const levelUp = apply(r.state);
    announce(pts, label, levelUp, r.state.bones);
    if (sessionRef.current) {
      supabase.rpc("claim_reward", { p_key: key }).then(({ data, error }) => {
        if (error) { setSync("error"); return; }
        const row = Array.isArray(data) ? data[0] : data;
        if (row && typeof row.bones === "number" && row.bones !== stateRef.current.bones) {
          apply({ ...stateRef.current, bones: row.bones });
        }
        setSync("synced");
      });
    }
    return true;
  }, [apply, announce]);

  const value: Ctx = {
    state, ready, preview, setPreview,
    shownBones: preview ? LEVELS[LEVELS.length - 1].min : state.bones,
    today, earn, toast, showToast, levelUpTick,
    session, sync, displayName, setDisplayName,
  };
  return <GameCtx.Provider value={value}>{children}</GameCtx.Provider>;
}

export function useGame() {
  const c = useContext(GameCtx);
  if (!c) throw new Error("useGame ต้องอยู่ใน GameProvider");
  return c;
}

export function useEarnOnMount(key: string, pts: number, label: string, delay = 900) {
  const { ready, earn } = useGame();
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => earn(key, pts, label), delay);
    return () => clearTimeout(t);
  }, [ready, key, pts, label, delay, earn]);
}
